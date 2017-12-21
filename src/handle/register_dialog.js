
'use strict';

var container = require('../data/container');
var logger = require('../util/logger');
var extend = require('../util/extend');
var makeDialogDefinition = require('../make/dialog_definition');
var makeNewDialog = require('../core/dialog');
var defaultDialogOption = require('../option/dialog');
var app = require('../app');

/**
 * register a Dialog Object
 *
 * @param name Name of dialog
 * @param attributes Attributes to be extended to new Dialog Object
 * @param option Option to initialize a Dialog
 * @param parentName Parent Dialog Object
 */
module.exports = (name, attributes, option, parentName) => {
    // all parent extend attributes
    var allParentAttributes = [];
    // all parent options
    var allParentOption = [];

    /**
     * get all parent attributes
     *
     * @param parentName
     */
    var getParentAttributes = (parentName) => {
        var parent = container.dialogDefinitions[parentName],
            parentOption = parent.option,
            parentAttributes = container.dialogAttributes[parentName];

        parentAttributes && allParentAttributes.unshift(parentAttributes);
        parentOption && allParentOption.unshift(parentOption);
        parent.parent && getParentAttributes(parent.parent);
    };

    if (!name || typeof name != 'string') {
        logger.throwError('"' + JSON.stringify(name) + '" is not a valid dialog name.');
        return;
    }

    if (container.dialogAttributes[name]) {
        logger.throwError('dialog "' + name + '" has been registered.');
    }

    if (arguments.length == 1) {
        logger.error('Register dialog "' + name + '" with no extend attributes.');
        return;
    }
    // (name, attr)
    else if (arguments.length == 2) {
        option = {};
        parentName = void 0;
    }
    // (name, attr, parent)
    else if (arguments.length == 3 && typeof arguments[2] == 'string') {
        parentName = option;
        option = {};
    }

    // put attributes to dialogAttributes container
    container.dialogAttributes[name] = attributes;

    // new Dialog Object
    var newDialog = makeNewDialog();
    var dialogOption = extend(!0, {}, defaultDialogOption);

    // has parent
    if (parentName) {
        getParentAttributes(parentName);

        allParentAttributes.forEach((item) => {
            extend(!0, newDialog.prototype, item);
        });

        allParentOption.forEach((item) => {
            extend(!0, dialogOption, item);
        });
    }

    extend(!0, newDialog.prototype, attributes);
    extend(!0, dialogOption, option);

    dialogOption.name = name;
    dialogOption.route = app.option.route;
    container.dialogDefinitions[name] = makeDialogDefinition(dialogOption, newDialog, parentName, dialogOption.singleton);
};