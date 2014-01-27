# Votum Page Transition Plugin v0.1

### A small lightweight javascript/jQuery function for page transitions

## Features
- page transitions with slide effect
- slide from right to left, slide from left to right, slide up, slide down
- works on all relative links within your page (absolute links are called normal)
- choose a data-attribute for your links which should not slide
- native browser behaviour given, like middle click which opens link in a new tab
- updates also information in head (title, ... )
- browser navigation support
- inject additional functions for call after slide finish
- in work: possibility to give a special content container instead of whole body for slide

## DEMO
- http://demo.dev.votum.local/page-transitions/demo/

## Getting Started
#### Requirements
- domparser polyfill for crossbrowser support (js included), jQuery 2.0.3 and later (not included)

#### How to use
- include js files in head information of your template: jQuery 2.0.3 and later, domparser.polyfill.js and page.transition.min.js
- include css file in head information of your template: page.transition.css

##### EXAMPLE call of pageTransition function with default options

    <script type="text/javascript">
        jQuery(document).ready(function () {
            pageTransition({
                effectClass: 'slide',
                browserNavEffectClass: 'slide reverse',
                afterSlideFunction: function () {

                },
                loaderId: 'ajax-loader',
                noSlideAttr: 'data-no-slide',
                contentContainer: 'body'
            });
        });
    </script>


##### Options description

- effectClass: css class how the sliding should behave (look to page.transition.css for what classes are given - feel free to write your own)
- browserNavEffectClass: css class how sliding should behave after browser navigation
- afterSlideFunction: some js stuff which will be called after slide has finished
- loaderId: id of your ajax loader container which will be appended to your page before slide
- noSlideAttr: data-attribute which makes links not sliding
- contentContainer: still in work (not working in a good way right now), for sliding a special container and not the whole body


##### Good to know

- ONLY RELATIVE PATH COMPATIBLE: this plugin works ONLY with relative paths, links with absolute paths (http://, mailto:, ftp://) etc. will be called normal
- same issue with links that have hashtags in its address (anchor, js stuff ...)
- i don't know if i really had all exceptions in my mind, but i will extend this plugin soon to make it perfect ;-)

## Further notes
January 2014 - v0.1
Created and modified by [Ricardo Hildebrand] and developed at [Votum](http://www.votum.de/) in Berlin, Germany.
