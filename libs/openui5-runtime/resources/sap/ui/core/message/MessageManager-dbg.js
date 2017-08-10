/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the implementation for a MessageManager
sap.ui.define([
		'jquery.sap.global',
		'sap/ui/base/EventProvider', 'sap/ui/base/ManagedObject',
		'sap/ui/model/message/MessageModel', './Message', './ControlMessageProcessor'],
	function(jQuery, EventProvider, ManagedObject, MessageModel, Message, ControlMessageProcessor) {

	"use strict";


	/**
	 *
	 * @namespace
	 * @name sap.ui.core.message
	 * @public
	 */

	/**
	 * Constructor for a new MessageManager.
	 *
	 * @class
	 *
	 * @extends sap.ui.base.EventProvider
	 *
	 * @author SAP SE
	 * @version 1.48.5
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.core.message.MessageManager
	 */
	var MessageManager = EventProvider.extend("sap.ui.core.message.MessageManager", /** @lends sap.ui.core.message.MessageManager.prototype */ {

		constructor : function () {
			EventProvider.apply(this, arguments);

			this.mProcessors = {};
			this.mObjects = {};
			this.mMessages = {};

			var bHandleValidation = sap.ui.getCore().getConfiguration().getHandleValidation();
			if (bHandleValidation) {
				sap.ui.getCore().attachValidationSuccess(bHandleValidation, this._handleSuccess, this);
				sap.ui.getCore().attachValidationError(bHandleValidation, this._handleError, this);
				sap.ui.getCore().attachParseError(bHandleValidation, this._handleError, this);
				sap.ui.getCore().attachFormatError(bHandleValidation, this._handleError, this);
			}
		},

		metadata : {
			publicMethods : [
				// methods
				"addMessages", "removeMessages", "removeAllMessages", "registerMessageProcessor", "unregisterMessageProcessor", "registerObject", "unregisterObject", "getMessageModel", "destroy"
			]
		}
	});

	/**
	 * handle validation/parse/format error
	 *
	 * @param {object} oEvent The Event object
	 * @private
	 */
	MessageManager.prototype._handleError = function(oEvent, bHandleValidation) {
		if (!this.oControlMessageProcessor) {
			this.oControlMessageProcessor = new ControlMessageProcessor();
		}
		if (bHandleValidation) {
			var oElement = oEvent.getParameter("element");
			var sProperty = oEvent.getParameter("property");
			var sTarget = oElement.getId() + '/' + sProperty;
			var sProcessorId = this.oControlMessageProcessor.getId();
			var bTechnical = oEvent.sId === "formatError";
			if (this.mMessages[sProcessorId] && this.mMessages[sProcessorId][sTarget]) {
				this._removeMessages(this.mMessages[sProcessorId][sTarget], true);
			}
			var oReference = {};
			oReference[oElement.getId()] = {
					properties:{},
					fieldGroupIds: oElement.getFieldGroupIds ? oElement.getFieldGroupIds() : undefined
			};
			oReference[oElement.getId()].properties[sProperty] = true;
			var oMessage = new Message({
					type: sap.ui.core.MessageType.Error,
					message: oEvent.getParameter("message"),
					target: sTarget,
					processor: this.oControlMessageProcessor,
					technical: bTechnical,
					references: oReference,
					validation: true
				});
			this.addMessages(oMessage);
		}
		oEvent.cancelBubble();
	};

	/**
	 * handle validation success
	 *
	 * @param {object} oEvent The Event object
	 * @private
	 */
	MessageManager.prototype._handleSuccess = function(oEvent, bHandleValidation) {
		if (!this.oControlMessageProcessor) {
			this.oControlMessageProcessor = new ControlMessageProcessor();
		}
		if (bHandleValidation) {
			var oElement = oEvent.getParameter("element");
			var sProperty = oEvent.getParameter("property");
			var sTarget = oElement.getId() + '/' + sProperty;
			var sProcessorId = this.oControlMessageProcessor.getId();

			if (this.mMessages[sProcessorId] && this.mMessages[sProcessorId][sTarget]) {
				this._removeMessages(this.mMessages[sProcessorId][sTarget], true);
			}
		}
		oEvent.cancelBubble();
	};

	/**
	 * Add messages to MessageManager
	 *
	 * @param {sap.ui.core.message.Message|sap.ui.core.message.Message[]} vMessages Array of sap.ui.core.message.Message or single sap.ui.core.message.Message
	 * @public
	 */
	MessageManager.prototype.addMessages = function(vMessages) {
		var	oMessage = vMessages;
		if (!vMessages) {
			return;
		}else if (Array.isArray(vMessages)) {
			for (var i = 0; i < vMessages.length; i++) {
				oMessage = vMessages[i];
				this._importMessage(oMessage);
			}
		} else {
			this._importMessage(vMessages);
		}
		this._updateMessageModel();
	};

	/**
	 * import message to internal map of messages
	 * @private
	 */
	MessageManager.prototype._importMessage = function(oMessage) {
		var sMessageKey = oMessage.getTarget(),
				oProcessor = oMessage.getMessageProcessor(),
				sProcessorId = oProcessor && oProcessor.getId();

		if (!this.mMessages[sProcessorId]) {
			this.mMessages[sProcessorId] = {};
		}
		var aMessages = this.mMessages[sProcessorId][sMessageKey] ? this.mMessages[sProcessorId][sMessageKey] : [];
		aMessages.push(oMessage);
		this.mMessages[sProcessorId][sMessageKey] = aMessages;
	};

	/**
	 * push messages to registered MessageProcessors
	 * @private
	 */
	MessageManager.prototype._pushMessages = function() {
		var that = this;
		jQuery.each(this.mProcessors, function(sId, oProcessor) {
			var vMessages = that.mMessages[sId] ? that.mMessages[sId] : {};
			that._sortMessages(vMessages);
			//push a copy
			vMessages = Object.keys(vMessages).length === 0 ? null : jQuery.extend(true, {}, vMessages);
			oProcessor.setMessages(vMessages);
		});
	};

	/**
	 * sort messages by type 'Error', 'Warning', 'Success', 'Information'
	 *
	 * @param {map|sap.ui.core.message.Message[]} vMessages Map or array of Messages to be sorted (in order of severity) by their type property
	 * @private
	 */
	MessageManager.prototype._sortMessages = function(vMessages) {
		var mSortOrder = { 'Error': 0, 'Warning':1, 'Success':2, 'Information':3 };

		if (Array.isArray(vMessages)) {
			vMessages = { "ignored": vMessages };
		}

		jQuery.each(vMessages, function(sTarget, aMessages){
			if (aMessages.length > 0) {
				aMessages.sort(function(a, b){
					return mSortOrder[a.type] - mSortOrder[b.type];
				});
			}
		});
	};

	/**
	 * update MessageModel
	 * @private
	 */
	MessageManager.prototype._updateMessageModel = function() {
		var aMessages = [];

		var oMessageModel = this.getMessageModel();

		jQuery.each(this.mMessages, function(sProcessorId, mMessages) {
			jQuery.each(mMessages, function(sKey, vMessages){
				aMessages = jQuery.merge(aMessages, vMessages);
			});
		});
		this._pushMessages();
		oMessageModel.setData(aMessages);
	};

	/**
	 * Remove all messages
	 * @public
	 */
	MessageManager.prototype.removeAllMessages = function() {
		this.aMessages = [];
		this.mMessages = {};
		this._updateMessageModel();
	};

	/**
	 * Remove given Messages
	 *
	 * @param {sap.ui.core.message.Message|sap.ui.core.message.Message[]} vMessages - The message(s) to be removed.
	 * @public
	 */
	MessageManager.prototype.removeMessages = function(vMessages) {
		// Do not expose bOnlyValidationMessages to public API
		return this._removeMessages.apply(this, arguments);
	};

	/**
	 * Like sap.ui.core.message.MessageManager#removeMessage but with an additional argument to only remove validation
	 * messages.
	 *
	 * @param {sap.ui.core.message.Message|sap.ui.core.message.Message[]} vMessages - The message(s) to be removed.
	 * @param {boolean} bOnlyValidationMessages - If set to true only messages that have been added due to validation
	 *        errors are removed.
	 * @private
	 */
	MessageManager.prototype._removeMessages = function(vMessages, bOnlyValidationMessages) {
		var that = this;
		if (!vMessages || (Array.isArray(vMessages) && vMessages.length == 0)) {
			return;
		} else if (Array.isArray(vMessages)) {
			// We need to work on a copy since the messages reference is changed by _removeMessage()
			var vOriginalMessages = vMessages.slice(0);
			for (var i = 0; i < vOriginalMessages.length; i++) {
				if (!bOnlyValidationMessages || vOriginalMessages[i].validation) {
					that._removeMessage(vOriginalMessages[i]);
				}
			}
		} else if (vMessages instanceof Message && (!bOnlyValidationMessages || vMessages.validation)){
			that._removeMessage(vMessages);
		} else {
			//map with target as key
			jQuery.each(vMessages, function (sTarget, aMessages) {
				that._removeMessages(aMessages, bOnlyValidationMessages);
			});
		}
		this._updateMessageModel();
	};

	/**
	 * remove Message
	 *
	 * @param {sap.ui.core.message.Message} oMessage The Message to remove
	 * @private
	 */
	MessageManager.prototype._removeMessage = function(oMessage) {
		var oProcessor = oMessage.getMessageProcessor(),
				sProcessorId = oProcessor && oProcessor.getId(),
				mMessages = this.mMessages[sProcessorId];

		if (!mMessages) {
			return;
		}
		var aMessages = mMessages[oMessage.getTarget()];

		if (aMessages) {
			for (var i = 0; i < aMessages.length; i++) {
				var oMsg = aMessages[i];
				if (jQuery.sap.equal(oMsg, oMessage)) {
					aMessages.splice(i,1);
					--i; // Decrease counter as one element has been removed
				}
			}
			// delete empty message array
			if (mMessages[oMessage.getTarget()].length === 0) {
				delete mMessages[oMessage.getTarget()];
			}
		}
	};

	/**
	 * message change handler
	 * @private
	 */
	MessageManager.prototype.onMessageChange = function(oEvent) {
		var aOldMessages = oEvent.getParameter('oldMessages');
		var aNewMessages = oEvent.getParameter('newMessages');
		this.removeMessages(aOldMessages);
		this.addMessages(aNewMessages);
	};

	/**
	 * Register MessageProcessor
	 *
	 * @param {sap.ui.core.message.MessageProcessor} oProcessor The MessageProcessor
	 * @public
	 */
	MessageManager.prototype.registerMessageProcessor = function(oProcessor) {
		var sProcessorId = oProcessor.getId();
		if (!this.mProcessors[sProcessorId]) {
			this.mProcessors[sProcessorId] = oProcessor;
			oProcessor.attachMessageChange(this.onMessageChange, this);
			if (sProcessorId in this.mMessages) {
				this._pushMessages();
			}
		}
	};

	/**
	 * Deregister MessageProcessor
	 * @param {sap.ui.core.message.MessageProcessor} oProcessor The MessageProcessor
	 * @public
	 */
	MessageManager.prototype.unregisterMessageProcessor = function(oProcessor) {
		this.removeMessages(this.mMessages[oProcessor.getId()]);
		delete this.mProcessors[oProcessor.getId()];
		oProcessor.detachMessageChange(this.onMessageChange, this);
	};

	/**
	 * Register ManagedObject: Validation and Parse errors are handled by the MessageManager for this object
	 *
	 * @param {sap.ui.base.ManagedObject} oObject The sap.ui.base.ManagedObject
	 * @param {boolean} bHandleValidation Handle validation for this object. If set to true validation/parse events creates Messages and cancel event.
	 * 					If set to false only the event will be canceled, but no messages will be created
	 * @public
	 */
	MessageManager.prototype.registerObject = function(oObject, bHandleValidation) {
		if (!oObject instanceof ManagedObject) {
			jQuery.sap.log.error(this + " : " + oObject.toString() + " is not an instance of sap.ui.base.ManagedObject");
			return;
		}
		oObject.attachValidationSuccess(bHandleValidation, this._handleSuccess, this);
		oObject.attachValidationError(bHandleValidation, this._handleError, this);
		oObject.attachParseError(bHandleValidation, this._handleError, this);
		oObject.attachFormatError(bHandleValidation, this._handleError, this);
	};

	/**
	 * Unregister ManagedObject
	 *
	 * @param {sap.ui.base.ManagedObject} oObject The sap.ui.base.ManagedObject
	 * @public
	 */
	MessageManager.prototype.unregisterObject = function(oObject) {
		if (!oObject instanceof ManagedObject) {
			jQuery.sap.log.error(this + " : " + oObject.toString() + " is not an instance of sap.ui.base.ManagedObject");
			return;
		}
		//oObject.getMetadata().getStereoType() + getId()
		oObject.detachValidationSuccess(this._handleSuccess);
		oObject.detachValidationError(this._handleError);
		oObject.detachParseError(this._handleError);
		oObject.detachFormatError(this._handleError);
	};

	/**
	 * destroy MessageManager
	 * @deprecated
	 * @public
	 */
	MessageManager.prototype.destroy = function() {
		jQuery.sap.log.warning("Deprecated: Do not call destroy on a MessageManager");
	};

	/**
	 * Get the MessageModel
	 * @return {sap.ui.model.message.MessageModel} oMessageModel The Message Model
	 * @public
	 */
	MessageManager.prototype.getMessageModel = function() {
		if (!this.oMessageModel) {
			this.oMessageModel = new MessageModel(this);
			this.oMessageModel.setData([]);
		}
		return this.oMessageModel;
	};
	return MessageManager;

});
