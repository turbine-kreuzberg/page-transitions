/**
 * Votum Page Transition Plugin v0.2
 *
 * @requires domparser.polyfill.js for cross browser compatibility
 * @requires page.transition.css for sliding behaviour
 *
 * @author    Ricardo Hildebrand <ricardo.hildebrand@votum.de>
 * @author    Thomas Heuer <thomas.heuer@votum.de>
 * @copyright Copyright (c) 2014 Votum media GmbH
 * @link      http://git.votum-media.net/vtm-frontend/page-transitions/tree/master
 *
 */
function pageTransition( userOptions ) {

  /* default options */
  var options = {
    effectClasses: [ 'slide' ],
    effectClassesReverse: [ 'slide', 'reverse' ],
    beforeSlideFunction: function() {
      /* Placeholder for a callback to get executed before each page transition. */
    },
    afterSlideFunction: function() {
      /* Placeholder for a callback to get executed after each page transition. */
    },
    ajaxLoader: 'ajax-loader',
    noSlideAttr: 'data-no-slide',
    contentContainerSelector: 'body',
    cssSlideDuration: 705,
    headElementsToReplace: 'meta, link, title'
  };

  // merge default and userOptions
  Object.prototype.extend = function(options,userOptions) {
    for (var property in userOptions)
      options[property] = userOptions[property];
    return options;
  };
  options.extend(userOptions);

  //bind user options
  var initialSlide = false;

  /**
   * HTTP Request via Ajax and parsing of the new HTML DOM
   *
   * @param {String} url
   * @param {Function} callback Retrieves thenew DOM as an argument
   */
  function ajaxDomLoad( url, callback ) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if( request.readyState === 4 ) {
        if( request.status === 200 || request.status === 0 ) {
          var parser = new DOMParser();
          callback( parser.parseFromString( request.responseText, 'text/html' ) );
        } else {
          console.log( "Error:\n" + request.status + "\n" + request.statusText );
        }
      }
    };
    request.open( 'GET', url, true );
    request.send( '' );
  }

  /* Adding two little helper functions to add a list (i.e. array) of classes to an element.
   * In an ideal world – the one without MS IE – we also could have used apply instead:
   *   DOMTokenList.prototype.add.apply( element.classList, [ 'classA', 'classB', 'classC' ] );
   * (This does not evebn work in MS IE 11) */

  /**
   * @param {DOMTokenList} classlist
   * @param {Array} classes
   */
  function addManyClasses( classlist, classes ) {
    for( var i = 0, length = classes.length; i < length; i++ ) {
      classlist.add( classes[i] );
    }
  }

  /**
   * @param {DOMTokenList} classlist
   * @param {Array} classes
   */
  function removeManyClasses( classlist, classes ) {
    for( var i = 0, length = classes.length; i < length; i++ ) {
      classlist.remove( classes[i] );
    }
  }

  /**
   * Slide Function: write new HTML head + body
   *
   * @param {String} url
   * @param {Array} effectClasses
   * @param {Boolean} pushstate
   */
  function slideTo( url, effectClasses, pushstate ) {

    //call users beforeSlideFunction
    options.beforeSlideFunction();

    /* prepare the old and new content containers */
    var oldContentContainer = document.querySelector( options.contentContainerSelector );

    /* create and append ajax loader element */
    var ajaxLoader = document.createElement('div');
    ajaxLoader.id = options.ajaxLoader;
    oldContentContainer.appendChild(ajaxLoader);

    oldContentContainer.style.zIndex = 2;
    addManyClasses( oldContentContainer.classList, effectClasses );

    var newContentContainer = oldContentContainer.cloneNode( false );
    newContentContainer.style.zIndex = 1;
    addManyClasses( newContentContainer.classList, effectClasses );
    newContentContainer.classList.add( 'new' );

    if( newContentContainer.id ) {
      newContentContainer.dataset.originalId = newContentContainer.id;
      newContentContainer.id = newContentContainer.id + '-new';
    }

    oldContentContainer.parentNode.appendChild( newContentContainer );

    /* request page contents for url */
    ajaxDomLoad( url, function( newDom ) {
        var oldHead = document.querySelector( 'head' ),
          newHead = newDom.querySelector( 'head' ),
          content = newDom.querySelector( options.contentContainerSelector );

        /* append new content to newContentContainer */
        newContentContainer.innerHTML = content.innerHTML;

        /* Set classnames for the slide effect (i.e. perform the slide effect) */
        oldContentContainer.classList.add( 'out' );
        newContentContainer.classList.add( 'in' );

        /* Let the loaded content appear as a page on its own:
         * - replace HEAD content (incl. TITLE, Metadata, …)
         * - push new URL to navigator history
         * - reset wrapper elements
         * - call options.afterSlideFunction
         */
        setTimeout( function() {
          /* pushState function for browser history and back button functionality */
          if( pushstate === true ) {
            window.history.pushState( null, null, url );
          }

          /* Set some new HEAD contents.
           * The version:
           *   document.querySelector( 'head' ).innerHTML = head.innerHTML;
           * breaks the better-dom.extend and other functions. */

          var tagsToRemove = oldHead.querySelectorAll( options.headElementsToReplace ),
            tagsToInsert = newHead.querySelectorAll( options.headElementsToReplace );

          for( var ttr = 0, ttrLength = tagsToRemove.length; ttr < ttrLength; ttr++ ) {
            oldHead.removeChild( tagsToRemove[ttr] );
          }
          for( var tti = 0, ttiLength = tagsToInsert.length; tti < ttiLength; tti++ ) {
            oldHead.appendChild( tagsToInsert[tti] );
          }

          /* remove the old wrapper */
          oldContentContainer.parentNode.removeChild( oldContentContainer );

          /* fix the classes and the ID for the new one */
          removeManyClasses( newContentContainer.classList, effectClasses );
          newContentContainer.classList.remove( 'new' );
          newContentContainer.classList.remove( 'in' );
          if( newContentContainer.dataset.originalId ) {
            newContentContainer.id = newContentContainer.dataset.originalId;
            delete newContentContainer.dataset.originalId;
          }

          //call users afterSlideFunction
          options.afterSlideFunction();
        }, options.cssSlideDuration );
      }
    );
  }

  /**
   * check window.history popstate (browser nav) and slide
   */
  if( window.history && window.history.pushState ) {
    window.onpopstate = function() {
      if( initialSlide == true ) {
        slideTo( document.location.pathname, options.effectClassesReverse, false );
      }
    };
  }

  /**
   * listen to click events and slide or do exceptional stuff
   */
  document.addEventListener( 'click', checkClickEvent, false );
  function checkClickEvent( e ) {
    if( e.target.tagName === 'A' ) {
      var link = e.target,
        url = link.getAttribute( 'href' );

      /* no slide exceptions:
       * data-no-slide attribute
       * external link(' : ' in url)
       * middle mouseclick(new tab)
       * anchor links (hash sign in link)
       */
      if( link.getAttribute( options.noSlideAttr ) != null || url.match( ':' ) || e.which === 2 || link.hash.length > 0 ) {
        return;
      } else {
        e.preventDefault();
        /* set initialSlide true for activating window history and browser navigation */
        initialSlide = true;
        /* perform page transition */
        slideTo( url, options.effectClasses, true );
      }
    } else {
      return;
    }
  }


}

