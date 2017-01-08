"use strict";

var util = require('./util'),
    container = require('./container');

var newFragment = function () {
    /**
     *
     * @param option Option to initialize fragment
     * @constructor
     */
    function Fragment(option) {
        var self = this;
        self.option = util.extend(true, {}, option);
        self.__orchids__init();
        // whether current fragment is initialized
        self.__orchids__initialized = !1;
        /**
         * current sub fragment instances
         * @type {{}}
         * @private
         */
        self.__orchids__subFragmentsInstances = {};
        /**
         * current active sub fragment id
         * @type {number}
         * @private
         */
        self.__orchids__currentSubFragmentId = 1;
    }

    Fragment.prototype = {
        constructor: Fragment,
        __orchids__init: function() {
            var self = this,
                classes = [
                    'orchids',
                    'orchids-fragment'
                ];
            // make id
            self.id = self.option.fragmentId;
            // whether current fragment is the first fragment to render or not
            self.__orchids__isFirstFragment = self.id == 1;
            // make root el
            self.el = document.createElement('div');
            // data-orchids-fragment-is
            self.el.dataset.orchidsFragmentId = self.id;

            // background color
            self.el.style.backgroundColor = self.option.backgroundColor;
            // left, top, width, height
            self.option.fragmentDirection == 'vertical' ? (
                classes.push('orchids-vertical'),
                    self.el.style.top = self.option.fragmentHeight * (self.id - 1) + 'px',
                    self.el.style.height = self.option.fragmentHeight
            ) : (
                classes.push('orchids-horizontal'),
                    self.el.style.left = self.option.fragmentWidth * (self.id - 1) + 'px',
                    self.el.style.width = self.option.fragmentWidth
            );
            self.el.classList = classes.join(' ');
            // user custom initialization
            self.__orchids__isFirstFragment && (
                self.__orchids__initialized = !0,
                !!self.onCreate && self.onCreate(),
                    // render fragments
                !!self.option.subFragments && !!self.option.subFragments.length && self.__orchids__renderSubFragments()
            );
        },
        // render sub fragments
        __orchids__renderSubFragments: function () {
            var self = this,
                fragmentsEl = self.el.querySelector('[data-orchids-fragments]'),
                i, il, fragmentName, fragment,
                fragmentsContainerClasses = [
                    'orchids-fragments-sub-container'
                ],
                fragmentOption, instance;
            if (!fragmentsEl) {
                console.error('Render fragments failed: no fragments container which should has "data-orchids-sub-fragments" attribute.');
                return;
            }

            // guarantee the root fragments elements has overflow-hidden element
            fragmentsEl.style.overflow = 'hidden';
            // fragment's width and height
            self.__orchids__subFragmentWidth = fragmentsEl.offsetWidth;
            self.__orchids__subFragmentHeight = fragmentsEl.offsetHeight;

            // create fragments container element
            self.__orchids__subFragmentsContainerEl = document.createElement('div');

            self.option.subFragmentAnimate && fragmentsContainerClasses.push('orchids-with-animation');
            self.option.subFragmentAnimateDirection == 'vertical' ? (
                fragmentsContainerClasses.push('orchids-vertical'),
                    self.__orchids__subFragmentsContainerEl.style.height = self.option.subFragments.length * self.__orchids__subFragmentHeight + 'px'
            ) : (
                fragmentsContainerClasses.push('orchids-horizontal'),
                    self.__orchids__subFragmentsContainerEl.style.width = self.option.subFragments.length * self.__orchids__subFragmentWidth + 'px'
            );

            // class list
            self.__orchids__subFragmentsContainerEl.classList = fragmentsContainerClasses.join(' ');
            // clear fragments root element inner html
            fragmentsEl.innerHTML = '';
            fragmentsEl.appendChild(self.__orchids__subFragmentsContainerEl);

            for (i = 0, il = self.option.subFragments.length; i < il; i++) {
                fragmentName = self.option.subFragments[i];
                fragment = container.fragments[fragmentName];
                if (!fragment) {
                    console.error('Render fragment "' + fragmentName + '" failed: no such a fragment registered.');
                    return;
                }
                fragmentOption = util.extend(!0, {}, fragment.option);
                fragmentOption.fragmentId = i + 1;
                fragmentOption.fragmentWidth = self.__orchids__subFragmentWidth;
                fragmentOption.fragmentHeight = self.__orchids__subFragmentHeight;
                fragmentOption.fragmentDirection = self.option.subFragmentAnimateDirection;
                instance = new fragment.fragment(fragmentOption);

                self.__orchids__subFragmentsInstances[fragmentOption.fragmentId] = instance;
            }
        },
        /**
         * show sub fragment specified by id
         * @param id
         */
        showSubFragment: function (id) {
            var self = this,
                instance;
            if (!id) {
                console.error('method showFragment needs a specified fragment id');
                return;
            }
            if (id == self.__orchids__currentSubFragmentId) {
                return;
            }
            instance = self.__orchids__subFragmentsInstances[id];
            if (!instance) {
                console.error('fragment not found with id: ' + id + '.');
                return;
            }

            // update current active fragment id
            self.__orchids__currentSubFragmentId = id;
            // create fragment if not created
            !instance.__orchids__initialized && !!instance.onCreate && instance.onCreate();
            // create sub fragments if not created
            !!instance.option.subFragments && !!instance.option.subFragments.length && instance.__orchids__renderSubFragments();
            self.option.subFragmentAnimateDirection == 'vertical' ? (
                self.__orchids__subFragmentsContainerEl.style.transform = 'translateY(' + (0 - self.__orchids__subFragmentHeight * (id - 1)) + ')'
            ) : (
                self.__orchids__subFragmentsContainerEl.style.transform = 'translateX(' + (0 - self.__orchids__subFragmentWidth * (id - 1)) + ')'
            );
        },
        /**
         * get sub fragment specified by id, default return the first fragment
         * @param id
         */
        getSubFragment: function (id) {
            var self = this;
            id = id || 1;
            try {
                return self.__orchids__subFragmentsInstances[id];
            } catch (e) {
                return null;
            }
        },
        /**
         * render a fragment after a fragment is initialized
         */
        onCreate: function() {}
    };

    return Fragment;
};

module.exports = newFragment;