/*
 *	Votum Page Transition Plugin v0.1.1
 *
 *  @requires jQuery-2.0.3 or later
 *  @requires domparser.polyfill.js for cross browser compatibility
 *  @requires transition.css for sliding behaviour
 *
 *	(c) 2013-2014 Ricardo Hildebrand
 *	ricardo.hildebrand@votum.de
 *  www.votum.de
 *
 */
function pageTransition(userOptions) {

    //default options
    var options = {
        effectClass: 'slide',
        browserNavEffectClass: 'slide reverse',
        afterSlideFunction: function () {
            /* default pageTransition finish function */
        },
        loaderId: 'ajax-loader',
        noSlideAttr: 'data-no-slide',
        contentContainer: 'body'
    };
    //bind user options
    jQuery.extend(options, userOptions);

    var initialSlide = false;

    /**
     * HTTP Request of new HTML Dom and parsing via Ajax
     *
     * @param url
     * @param t
     * @param callback
     */
    function ajaxDomLoad(url, t, callback) {
        if (window.XMLHttpRequest) {
            var response = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            var response = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (response != undefined) {
            response.onreadystatechange = function () {
                if (response.readyState == 4) {
                    if (response.status == 200 || response.status == 0) {

                        /**DON'T FORGET TO INCLUDE domparser.polyfill.js in head of your template for cross browser support**/

                        var parser = new DOMParser(),
                            doc = parser.parseFromString(response.responseText, 'text/html');
                        callback(doc.querySelector('head'), doc.querySelector(options.contentContainer));
                    } else {
                        console.log("Error:\n" + response.status + "\n" + response.statusText);
                    }
                }
            };
            response.open("GET", url, true);
            response.send("");
        }
    }

    /**
     * Slide Effect Function, Handle Content and DIV's
     *
     * @returns {{d1: HTMLElement, d2: HTMLElement}}
     */
    function slideEffect() {
        var content = document.querySelector(options.contentContainer).innerHTML;
        document.querySelector(options.contentContainer).innerHTML = "";

        //old body
        var d1 = document.createElement("div");
        d1.id = "d1";
        d1.style.zIndex = 2;
        d1.style.position = "absolute";
        d1.style.width = "100%";
        d1.style.height = "100%";
        d1.style.left = "0px";
        d1.style.top = "0px";
        document.querySelector(options.contentContainer).appendChild(d1);
        d1.innerHTML = content;

        //new body
        var d2 = document.createElement("div");
        d2.id = "d2";
        d2.style.zIndex = 1;
        d2.style.position = "absolute";
        d2.style.width = "100%";
        d2.style.height = "100%";
        d2.style.left = "0px";
        d2.style.top = "0px";
        document.querySelector(options.contentContainer).appendChild(d2);

        return {d1: d1, d2: d2 };
    }

    /**
     * Slide Function: write new HTML head + body
     *
     * @param url
     * @param effect
     * @param pushstate
     */
    function slideTo(url, effect, pushstate) {

        //append ajax loader before slide
        jQuery(options.contentContainer).append('<div id="' + options.loaderId + '"></div>');

        var d = slideEffect();
        var d1 = d.d1;
        var d2 = d.d2;

        ajaxDomLoad(url, d2,
            function (head, body) {

                //save new bodyContent to d2
                var bodyContents = body.children;
                for (var len = bodyContents.length, i = 0; i < len; i++) {
                    d2.appendChild(bodyContents[0])
                }

                //pushState function for browser history and back button functionality
                if (pushstate == true) {
                    window.history.pushState(null, null, url);
                }

                //set classnames for sliding effects
                setTimeout(function () {
                    d1.className = effect + " out";
                }, 1);
                setTimeout(function () {
                    d2.className = effect + " in";
                }, 1);


                setTimeout(function () {
                    //set new content
                    document.querySelector(options.contentContainer).innerHTML = d2.innerHTML;
                    // set new HEAD
                    document.querySelector('head').innerHTML = head.innerHTML;

                    //call users afterSlideFunction
                    options.afterSlideFunction();

                    //reInit script after slide
                    pageTransition(options);
                }, 706);
            }
        );
    }

    /**
     * check window.history popstate (browser nav) and slide
     */
    if (window.history && window.history.pushState) {
        jQuery(window).on('popstate', function (e) {
            e.preventDefault();
            if (initialSlide == true) {
                slideTo(document.location.pathname, options.browserNavEffectClass, false);
            }
        });
    }

    /**
     * look for link clicks and slide or do exceptional stuff
     */
    jQuery('a').on('click', function (e) {
        var link = jQuery(this),
            url = link.attr("href");

        /* no slide exceptions:
         * data-no-slide attribute
         * external link(' : ' in url)
         * middle mouseclick(new tab)
         * anchor links (hash sign in link)
         */
        if (link.attr(options.noSlideAttr) != undefined || url.match(':') || e.which == 2 || this.hash.length > 0) {
            return;
        } else {
            //set initialSlide true for activating window history and browser navigation
            initialSlide = true;
            slideTo(url, options.effectClass, true);
        }
        e.preventDefault();
    });

}

