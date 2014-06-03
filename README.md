# VOTUM Page Transition Plugin

An easy, small and lightweight Javascript plugin for page transitions / sliding pages on mobile websites.

## Features

- no jQuery required
- page transitions with slide effect
- slide from right to left, slide from left to right, slide up, slide down
- works on all relative links within your page (absolute links are called normal)
- choose a data-attribute for your links which should not slide
- native browser behaviour given, like middle click which opens link in a new tab
- updates also information in head (title, ... )
- browser navigation support
- inject additional functions for call after slide finish
- possibility to give a special content container instead of whole body for slide

## Demo

https://rawgit.com/votum/page-transitions/master/demo/index.html

## Getting Started

### Requirements
- domparser polyfill for crossbrowser support (js included)

### How to use
- include js files in head information of your template: domparser.polyfill.js and page.transition.min.js
- include css file in head information of your template: page.transition.css

#### Example call of the pageTransition function with default options

    <script type="text/javascript">
        pageTransition({
            effectClasses: [ 'slide' ],
            effectClassesReverse: [ 'slide', 'reverse' ],
            afterSlideFunction: function() {
                /* Placeholder for a callback to get executed after each page transition. */
            },
            ajaxLoader: 'ajax-loader',
            noSlideAttr: 'data-no-slide',
            contentContainerSelector: 'body',
            cssSlideDuration: 705,
            headElementsToReplace: 'meta, link, title'
        });
    </script>

#### Options description

- effectClasses: css class how the sliding should behave (feel free to modify and write your own)
- effectClassesReverse: css class how sliding should behave after browser navigation (back button)
- afterSlideFunction: some js stuff which will be called after slide has finished
- ajaxLoader: id of your ajax loader container which will be appended to your page before slide
- noSlideAttr: data-attribute which makes links not sliding
- contentContainerSelector: selector of what should slide
- cssSlideDuration: Duration of slidingeffect
- headElementsToReplace: choose what should be replaced in head of page

### Good to know

- ONLY RELATIVE PATH COMPATIBLE: this plugin works ONLY with relative paths, links with absolute paths (http://, mailto:, ftp://) etc. will be called normal
- Same issue with links that have hashtags in its address (anchor, JS stuff …)
- I don't know if i really had all exceptions in my mind, but i will extend this plugin soon to make it perfect ;-)


## Further notes

Created and modified by [Ricardo Hildebrand](mailto:ricardo.hildebrand@votum.de) and [Thomas Heuer](mailto:thomas.heuer@votum.de) and developed at [VOTUM](http://www.votum.de/) in Berlin, Germany.

### Version & Update notes

#### 24. January 2014

- v0.1

#### 29. January 2014

- v0.1.1
- Compatibility for Internet Explorer version 10 and higher // Transition styles for IE

#### 06. February 2014

- v0.2
- replace only parts in head element
- free choose of container to slide
- removed jQuery dependency
- shortened/optimized transition styles

