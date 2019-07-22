import HcSticky from 'hc-sticky/src/hc-sticky.js';
import Helpers from 'hc-sticky/src/hc-sticky.helpers.js';
import merge from 'lodash.merge';
import 'intersection-observer';
import ResizeObserver from 'resize-observer-polyfill';

class GlueStick {

    /**
     @class GlueStick
     @summary Stick an element to remain inside the viewport instead of scrolling out of view.
     @see https://github.com/somewebmedia/hc-sticky
     @param {Object} options - Supplied configuration
     @param {String|HTMLElement} options.subject - The element that will stick. Either an HTML element object or selector string. **Required**
     @param {String|HTMLElement} options.footer - The bottom boundary element that the sticky element stretches up to, but not beyond. Either an HTML element object or selector string. **Optional**
     @param {String[]|HTMLElement[]} options.seniorSticky - reference to other sticky that appear above this sticky.  Either an HTML element or selector string. **Optional**
     @param {String|HTMLElement} options.pinStuckWidthToElement - An element to use as a reference for the width of the sticky when it’s stuck. This is useful for when the original container of the sticky is resized, e.g. in a resizable pane In `position: fixed` the sticky needs to stretch to match the reference element’s width. Either an HTML element object or selector string. **Optional**
     @param {Number} [options.stopStickingMaxWidth=600] Maximum responsive pixel width where the sticky stops sticking
     @param {Object} options.hcStickyOpts - Options to pass directly to HcSticky
     @param {Object} [options.callbacks] - User supplied functions to execute at given stages of the component lifecycle
     @param {Function} options.callbacks.preCreate
     @param {Function} options.callbacks.postCreate
     @param {Function} options.callbacks.preOnIntersect
     @param {Function} options.callbacks.postOnIntersect
     @param {Function} options.callbacks.preCalculate
     @param {Function} options.callbacks.postCalculate
     @param {Function} options.callbacks.preDestroy
     @param {Function} options.callbacks.postDestroy
     */

    constructor(options) {
        if (options === undefined) {
            options = {};
        }

        const defaults = {};

        defaults.subject = null;
        defaults.footer = null;
        defaults.seniorSticky = null;
        defaults.pinStuckWidthToElement = null;
        defaults.stopStickingMaxWidth = options.stopStickingMaxWidth || 600;

        defaults.hcStickyOpts = {};
        defaults.hcStickyOpts.followScroll = false;
        defaults.hcStickyOpts.responsive = {};
        defaults.hcStickyOpts.mobileFirst = false;
        defaults.hcStickyOpts.bottomEnd = -999999;
        defaults.hcStickyOpts.stickTo = null;
        defaults.hcStickyOpts.responsive[defaults.stopStickingMaxWidth] = { disable: true };
        defaults.hcStickyOpts.onResize = () => {
            let stickTo = this.subject.parentNode;

            if (options.hcStickyOpts !== undefined && options.hcStickyOpts.stickTo !== undefined && options.hcStickyOpts.stickTo !== null) {
                if (typeof options.hcStickyOpts.stickTo === 'string') { //it’s a string to be used for a selector
                    stickTo = document.querySelector(options.hcStickyOpts.stickTo);
                }
                else if (GlueStick.isElement(options.hcStickyOpts.stickTo)) {
                    stickTo = options.hcStickyOpts.stickTo;
                }
                else {
                    throw 'hGlueStick you must supply a valid HTMLElement or selector string for `hcStickyOpts.stickTo`.';
                }
            }

            if (window.matchMedia('(max-width: ' + defaults.stopStickingMaxWidth + 'px)').matches) {
                stickTo.style.position = null; //undo what is hard coded in hcSticky library :(
            }
            else {
                stickTo.style.position = 'relative';
            }
        };

        defaults.hcStickyOpts.onStart = function removeBottomAuto () {
            // The component is hardcoded to do use an inline style of bottom:auto.
            // We’ll do a bottom of 0 in CSS.
            // Until the bottom is calculated based on the footer height.
            if (this.style.bottom === 'auto') {
                this.style.bottom = null;
            }
        };

        //put supplied options on top of defaults
        merge(this, defaults, options);

        if (this.subject === undefined || this.subject === null) {
            throw 'GlueStick you must supply a subject';
        }

        if (typeof this.subject === 'string') { //it’s a string to be used for a selector
            this.subject = document.querySelector(options.subject);
        }
        if (typeof this.seniorSticky === 'string') { //it’s a string to be used for a selector
            this.seniorSticky = document.querySelector(options.seniorSticky);
        }

        if (typeof this.footer === 'string') { //it’s a string to be used for a selector
            this.footer = document.querySelector(options.footer);
        }

        if (typeof this.pinStuckWidthToElement === 'string') { //it’s a string to be used for a selector
            this.pinStuckWidthToElement = document.querySelector(options.pinStuckWidthToElement);
        }

        if (!GlueStick.isElement(this.subject)) {
            throw 'GlueStick you must supply a valid subject HTMLElement or selector string.';
        }
        if (this.footer !== null && !GlueStick.isElement(this.footer)) {
            throw 'GlueStick you must supply a valid footer HTMLElement or selector string.';
        }
        if (this.pinStuckWidthToElement !== null && !GlueStick.isElement(this.pinStuckWidthToElement)) {
            throw 'GlueStick you must supply a valid pinStuckWidthToElement HTMLElement or selector string.';
        }

        /**
         @property {Boolean} footerVisible - Whether or not the footer element is in view. Maintained by IntersectionObserver.
         @memberOf GlueStick
         @protected
         */
        this.footerVisible = false;

        /**
         @property {Number} topSum - Offset of the sticky from the top of the viewport. Calculated from the `seniorSticky` bottom.
         @memberOf GlueStick
         @protected
         */
        this.topSum = 0;

        const seniorOpts = {
            top: 0
        };

        if (this.seniorSticky) {
            const ro = new ResizeObserver(() => this.updatePosition());
            ro.observe(this.seniorSticky);

            const bbox = this.seniorSticky.getBoundingClientRect();
            this.topSum = bbox.bottom;
            seniorOpts.top = bbox.bottom;

            const bboxSubject = this.subject.getBoundingClientRect();
            seniorOpts.disable = !(this.seniorSticky.classList.contains('sticky') && bboxSubject.top <= bbox.bottom);
        }

        /**
         @property {hcSticky} glued - Instance of hcSticky
         @memberOf GlueStick
         @protected
         */
        this.glued = new HcSticky(this.subject, Object.assign({}, this.hcStickyOpts, seniorOpts));

        this.callCustom('preCreate');

        const onIntersectFn = this.onIntersect.bind(this);
        const calculateFn = this.calculate.bind(this);
        const destroyFn = this.destroy.bind(this);
        const updatePositionFn = this.updatePosition.bind(this);

        if (this.footer !== null && this.footer !== undefined) {
            this.io = new window.IntersectionObserver(onIntersectFn);
            this.io.observe(this.footer);
        }

        const requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        }());

        (function animloop () {
            requestAnimFrame(animloop);
            calculateFn();
        })();

        window.addEventListener('unload', destroyFn);
        window.addEventListener('scroll', updatePositionFn);

        this.callCustom('postCreate');
    }

    /**
     * @method updatePosition
     * @memberOf GlueStick
     * @instance
     * @summary updates hc-sticky
     * @private
     */
    updatePosition() {
        this.topSum = 0;
        const seniorOpts = {
            top: 0
        };

        if (this.seniorSticky) {
            const bbox = this.seniorSticky.getBoundingClientRect();
            this.topSum = bbox.bottom;
            seniorOpts.top = bbox.bottom;

            const bboxSubject = this.subject.getBoundingClientRect();
            seniorOpts.disable = !(this.seniorSticky.classList.contains('sticky') && bboxSubject.top <= bbox.bottom);
        }

        if (this.prevOpts && this.prevOpts.top === seniorOpts.top && this.prevOpts.disable === seniorOpts.disable) {
            return;
        }
        this.prevOpts = Object.assign({}, seniorOpts);

        this.glued.update(seniorOpts);
    }

    /**
     * @method destroy
     * @memberOf GlueStick
     * @instance
     * @summary Destroy sticky behavior
     * @private
     */
    destroy() {
        this.callCustom('preDestroy');
        this.glued.destroy();
        this.callCustom('postDestroy');
    }

    /**
     * @method isElement
     * @memberOf GlueStick
     * @instance
     * @summary Is this a DOM HTML element?
     * @private
     */
    static isElement(obj) {
        return (
            typeof HTMLElement === 'object' ? obj instanceof HTMLElement : //DOM2
                obj && typeof obj === 'object' && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === 'string'
        );
    }

    /**
     * @method callCustom
     * @memberOf GlueStick
     * @instance
     * @summary execute an implementation defined callback on a certain action
     * @private
     */
    callCustom(userFn) {
        const sliced = Array.prototype.slice.call(arguments, 1);

        if (this.callbacks !== undefined && this.callbacks[userFn] !== undefined && typeof this.callbacks[userFn] === 'function') {
            this.callbacks[userFn].apply(this, sliced);
        }
    }

    /**
     * @method getVisible
     * @memberOf GlueStick
     * @instance
     * @summary returns height of node's fragment which is visible within provided context
     * @private
     */
    static getVisible(node, ctx) {
        if (ctx === window) {
            const sy = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
            const rect = node.getBoundingClientRect();

            return Math.max(0, sy - Math.max(0, sy - rect.bottom) - Math.max(0, rect.top));
        }
        else {
            const cTop = ctx.scrollTop;
            const cBottom = cTop + ctx.clientHeight;

            const eTop = node.offsetTop - ctx.offsetTop;
            const eBottom = eTop + node.clientHeight;

            const visibleTop = eTop < cTop ? cTop : eTop;
            const visibleBottom = eBottom > cBottom ? cBottom : eBottom;

            return Math.max(visibleBottom - visibleTop, 0);
        }
    }

    /**
     * @method onIntersect
     * @memberOf GlueStick
     * @instance
     * @summary handle intersection between subject and footer
     * @private
     */
    onIntersect(entries) {
        const footer = entries[0];
        this.callCustom('preOnIntersect', footer, this.footerVisible);

        this.footerVisible = footer.intersectionRatio > 0;

        this.callCustom('postOnIntersect', footer, this.footerVisible);
    }

    /**
     * @method calculate
     * @memberOf GlueStick
     * @instance
     * @summary instead of always doing the height calculation, let IntersectionObserver set a simple short circuit boolean
     * @private
     */
    calculate() {
        let newWidth;
        let visibleHeight;

        this.callCustom('preCalculate', this.footerVisible);

        if (this.footer !== null && !this.footerVisible) {
            this.subject.style.bottom = 0 + 'px';
        }

        if (this.footerVisible) {
            visibleHeight = GlueStick.getVisible(this.footer, window);
            this.subject.style.bottom = visibleHeight + 'px';
        }

        if (this.subject.style.position === 'static') {
            this.subject.style.width = null;
        }

        if (this.pinStuckWidthToElement !== null && this.subject.style.position === 'fixed') {
            newWidth = this.pinStuckWidthToElement.getBoundingClientRect().width;
            this.subject.style.width = newWidth + 'px';
        }

        this.callCustom('postCalculate', this.footerVisible, visibleHeight, newWidth);
    }
}

export default GlueStick;
