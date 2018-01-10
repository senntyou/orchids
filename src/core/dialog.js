/**
 * Similar to Page Object, but no route, always cover page(that is to say, if you want to go to another page,
 *     you need first to close current dialog, or you will not see the effect), 
 */

"use strict";

var extend = require('../util/extend');
var container = require('../data/container');

var init = require('./dialog/init');

var newDialog = () => {
    /**
     * constructor
     * @param option Option to initialize dialog
     * @param data Parameter to be used by onCreate method
     * @constructor
     */
    function Dialog(option, data) {
        var self = this;
        self.option = extend(true, {}, option);
        self.__orchids__data = data || null;
        self.__orchids__init();
    }

    Dialog.prototype = {
        constructor: Dialog,
        /**
         * init dialog
         * @private
         */
        __orchids__init: function() {
            var self = this;

            init(self);
        },
        /**
         * destroy current dialog
         * @private
         */
        __orchids__destroy: function () {
            var self = this;
            self.onDestroy();

            self.el.classList.remove('orchids-active');

            if (self.option.animate)
                // has animation
                setTimeout(() => {
                    self.el.remove()
                }, 500);
            else
                // no animation
                self.el.remove();
        },
        /**
         * show current dialog
         * @param forResult
         * @param prepareResultData
         * @private
         */
        __orchids__show: function (forResult, prepareResultData) {
            var self = this;

            /**
             * show dialog
             */
            self.el.classList.add('orchids-active');

            self.onShow();

            forResult && self.prepareForResult(prepareResultData);
        },
        /**
         * hide current dialog
         * @private
         */
        __orchids__hide: function () {
            var self = this;

            self.onHide();
            /**
             * hide dialog
             */
            self.el.classList.remove('orchids-active');
        },
        /**
         * render a dialog after a dialog is initialized
         * @param data
         */
        onCreate: function(data) {},
        /**
         * pre handle before destroy a dialog
         */
        onDestroy: function() {},
        /**
         * called when back dialog from other dialog
         */
        onShow: function () {},
        /**
         * called when start another dialog
         */
        onHide: function () {},
        /**
         * set the result if this dialog is called by startDialogForResult method,
         * and the returned value will be used as the param of the onResult method of last dialog or page
         *
         * @param {*} data
         */
        setResult: function(data) {
            var self = this;
            self.__orchids__result = data;
        },
        /**
         * called when the child dialog destroyed and return the value by setResult method.
         * @param {*} data
         */
        onResult: function(data) {},
        /**
         * receive data from the previous dialog, startDialogForResult method's second parameter
         * @param data
         */
        prepareForResult: function(data) {}
    };

    return Dialog;
};

module.exports = newDialog;