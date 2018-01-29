/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/m/Text','sap/ui/core/HTML','sap/ui/core/Icon','sap/ui/core/IconPool','sap/m/Button','sap/m/GenericTileRenderer','sap/m/GenericTileLineModeRenderer','sap/ui/Device','sap/ui/core/ResizeHandler'],function(q,l,C,T,H,I,a,B,G,L,D,R){"use strict";var b=C.extend("sap.m.GenericTile",{metadata:{library:"sap.m",properties:{"mode":{type:"sap.m.GenericTileMode",group:"Appearance",defaultValue:sap.m.GenericTileMode.ContentMode},"header":{type:"string",group:"Appearance",defaultValue:null},"subheader":{type:"string",group:"Appearance",defaultValue:null},"failedText":{type:"string",group:"Appearance",defaultValue:null},"size":{type:"sap.m.Size",group:"Misc",defaultValue:sap.m.Size.Auto},"frameType":{type:"sap.m.FrameType",group:"Misc",defaultValue:sap.m.FrameType.OneByOne},"backgroundImage":{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},"headerImage":{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},"state":{type:"sap.m.LoadState",group:"Misc",defaultValue:sap.m.LoadState.Loaded},"imageDescription":{type:"string",group:"Accessibility",defaultValue:null},"scope":{type:"sap.m.GenericTileScope",group:"Misc",defaultValue:sap.m.GenericTileScope.Display},"ariaLabel":{type:"string",group:"Accessibility",defaultValue:null}},defaultAggregation:"tileContent",aggregations:{"tileContent":{type:"sap.m.TileContent",multiple:true,bindable:"bindable"},"icon":{type:"sap.ui.core.Control",multiple:false},"_titleText":{type:"sap.m.Text",multiple:false,visibility:"hidden"},"_failedMessageText":{type:"sap.m.Text",multiple:false,visibility:"hidden"}},events:{"press":{parameters:{"scope":{type:"sap.m.GenericTileScope"},"action":{type:"string"},"domRef":{type:"any"}}}}},renderer:function(r,c){if(c.getMode()===l.GenericTileMode.LineMode){L.render(r,c);}else{G.render(r,c);}}});b._Action={Press:"Press",Remove:"Remove"};b.LINEMODE_SIBLING_PROPERTIES=["state","subheader","header","scope"];b.prototype.init=function(){this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.m");D.media.initRangeSet("GenericTileDeviceSet",[450],"px",["small","large"]);this._oTitle=new T(this.getId()+"-title");this._oTitle.addStyleClass("sapMGTTitle");this._oTitle.cacheLineHeight=false;this.setAggregation("_titleText",this._oTitle,true);this._sFailedToLoad=this._oRb.getText("INFOTILE_CANNOT_LOAD_TILE");this._sLoading=this._oRb.getText("INFOTILE_LOADING");this._oFailedText=new T(this.getId()+"-failed-txt",{maxLines:2});this._oFailedText.cacheLineHeight=false;this._oFailedText.addStyleClass("sapMGTFailed");this.setAggregation("_failedMessageText",this._oFailedText,true);this._oWarningIcon=new I(this.getId()+"-warn-icon",{src:"sap-icon://notification",size:"1.375rem"});this._oWarningIcon.addStyleClass("sapMGTFtrFldIcnMrk");this._oBusy=new H(this.getId()+"-overlay");this._oBusy.setBusyIndicatorDelay(0);this._bTilePress=true;this._bThemeApplied=true;if(!sap.ui.getCore().isInitialized()){this._bThemeApplied=false;sap.ui.getCore().attachInit(this._handleCoreInitialized.bind(this));}else{this._handleCoreInitialized();}};b.prototype._handleCoreInitialized=function(){this._bThemeApplied=sap.ui.getCore().isThemeApplied();if(!this._bThemeApplied){sap.ui.getCore().attachThemeChanged(this._handleThemeApplied,this);}};b.prototype._handleThemeApplied=function(){this._bThemeApplied=true;this._oTitle.clampHeight();sap.ui.getCore().detachThemeChanged(this._handleThemeApplied,this);};b.prototype._initScopeContent=function(t){switch(this.getScope()){case l.GenericTileScope.Actions:if(this.getState&&this.getState()===l.LoadState.Disabled){break;}this._oMoreIcon=this._oMoreIcon||a.createControlByURI({id:this.getId()+"-action-more",size:"1rem",useIconTooltip:false,src:"sap-icon://overflow"}).addStyleClass("sapMPointer").addStyleClass(t+"MoreIcon");this._oRemoveButton=this._oRemoveButton||new B({id:this.getId()+"-action-remove",icon:"sap-icon://decline",tooltip:this._oRb.getText("GENERICTILE_REMOVEBUTTON_TEXT")}).addStyleClass("sapUiSizeCompact").addStyleClass(t+"RemoveButton");this._oRemoveButton._bExcludeFromTabChain=true;break;default:}};b.prototype.exit=function(){if(this._sParentResizeListenerId){R.deregister(this._sResizeListenerId);this._sParentResizeListenerId=null;}D.media.detachHandler(this._handleMediaChange,this,"GenericTileDeviceSet");if(this._$RootNode){this._$RootNode.off(this._getAnimationEvents());this._$RootNode=null;}this._clearAnimationUpdateQueue();this._oWarningIcon.destroy();if(this._oImage){this._oImage.destroy();}this._oBusy.destroy();if(this._oMoreIcon){this._oMoreIcon.destroy();}if(this._oRemoveButton){this._oRemoveButton.destroy();}};b.prototype.onBeforeRendering=function(){var s=!!this.getSubheader();if(this.getMode()===l.GenericTileMode.HeaderMode){this._applyHeaderMode(s);}else{this._applyContentMode(s);}var t=this.getTileContent().length;for(var i=0;i<t;i++){this.getTileContent()[i].setDisabled(this.getState()===l.LoadState.Disabled);}this._initScopeContent("sapMGT");this._generateFailedText();this.$().unbind("mouseenter",this._updateAriaAndTitle);this.$().unbind("mouseleave",this._removeTooltipFromControl);if(this._sParentResizeListenerId){R.deregister(this._sResizeListenerId);this._sParentResizeListenerId=null;}D.media.detachHandler(this._handleMediaChange,this,"GenericTileDeviceSet");if(this._$RootNode){this._$RootNode.off(this._getAnimationEvents());}if(this.getFrameType()===l.FrameType.Auto){this.setProperty("frameType",l.FrameType.OneByOne,true);}};b.prototype.onAfterRendering=function(){this.$().bind("mouseenter",this._updateAriaAndTitle.bind(this));this.$().bind("mouseleave",this._removeTooltipFromControl.bind(this));var m=this.getMode();if(m===l.GenericTileMode.LineMode&&this._isScreenLarge()){this.$().parent().addClass("sapMGTLineModeContainer");this._updateHoverStyle(true);if(this.getParent()instanceof C){this._sParentResizeListenerId=R.register(this.getParent(),this._handleResize.bind(this));}else{this._sParentResizeListenerId=R.register(this.$().parent(),this._handleResize.bind(this));}}if(m===l.GenericTileMode.LineMode&&this._bUpdateLineTileSiblings){this._updateLineTileSiblings();this._bUpdateLineTileSiblings=false;}if(m===l.GenericTileMode.LineMode){D.media.attachHandler(this._handleMediaChange,this,"GenericTileDeviceSet");}};b.prototype._handleResize=function(){if(this.getMode()===l.GenericTileMode.LineMode&&this._isScreenLarge()&&this.getParent()){this._queueAnimationEnd();}};b.prototype._isCompact=function(){return q("body").hasClass("sapUiSizeCompact")||this.$().is(".sapUiSizeCompact")||this.$().closest(".sapUiSizeCompact").length>0;};b.prototype._calculateStyleData=function(){this.$("lineBreak").remove();if(!this._isScreenLarge()||!this.getDomRef()||this.$().is(":hidden")){return null;}var $=this.$(),e=this.$("endMarker"),s=this.$("startMarker");if(e.length===0||s.length===0){return null;}var c=this._getLineCount(),d,f,g=Math.ceil(L._getCSSPixelValue(this,"margin-top")),h,A=this.$().parent().innerWidth(),j=Math.ceil(L._getCSSPixelValue(this,"min-height")),k=L._getCSSPixelValue(this,"line-height"),m=this.$().is(":not(:first-child)")&&c>1,n=q("<span><br /></span>"),i=0,r=sap.ui.getCore().getConfiguration().getRTL(),E=e.position();if(m){n.attr("id",this.getId()+"-lineBreak");$.prepend(n);c=this._getLineCount();E=e.position();}var S={rtl:r,lineBreak:m,startOffset:s.offset(),endOffset:e.offset(),availableWidth:A,lines:[]};var o;if(D.browser.msie||D.browser.edge){o=n.find("br").position();}else{o=n.position();}var p=o;if(!(D.browser.mozilla||D.browser.msie||D.browser.edge)&&o.left<E.left){p=E;}S.positionLeft=m?o.left:$.position().left;S.positionRight=m?$.width()-p.left:S.availableWidth-$.position().left;if(!m&&c>1){S.positionRight=s.parent().innerWidth()-(s.position().left+s.width());}for(i;i<c;i++){if(m&&i===0){continue;}if(c===1){d=r?S.availableWidth-S.positionLeft:S.positionLeft;h=$.width();}else if(i===c-1){d=0;h=r?$.width()-E.left:E.left;}else if(m&&i===1){d=0;h=A;}else{d=0;h=A;}f=i*k+g;S.lines.push({offset:{x:d,y:f},width:h,height:j});}return S;};b.prototype._getStyleData=function(){var s=this._calculateStyleData();if(!q.sap.equal(this._oStyleData,s)){delete this._oStyleData;this._oStyleData=s;return true;}return false;};b.prototype._getAnimationEvents=function(){return"transitionend.sapMGT$id animationend.sapMGT$id".replace(/\$id/g,q.sap.camelCase(this.getId()));};b.prototype._updateHoverStyle=function(f){if(!this._getStyleData()&&!f){return;}this._clearAnimationUpdateQueue();this._cHoverStyleUpdates=-1;this._oAnimationEndCallIds={};if(this._oStyleData&&this._oStyleData.lineBreak&&this.getUIArea()){this._$RootNode=q(this.getUIArea().getRootNode());this._$RootNode.on(this._getAnimationEvents(),this._queueAnimationEnd.bind(this));}this._queueAnimationEnd();};b.prototype._queueAnimationEnd=function(e){if(e){var t=q(e.target);if(t.is(".sapMGT, .sapMGT *")){return false;}}if(typeof this._cHoverStyleUpdates!=="number"){this._cHoverStyleUpdates=-1;}if(!this._oAnimationEndCallIds){this._oAnimationEndCallIds={};}this._cHoverStyleUpdates++;this._oAnimationEndCallIds[this._cHoverStyleUpdates]=q.sap.delayedCall(10,this,this._handleAnimationEnd,[this._cHoverStyleUpdates]);};b.prototype._handleAnimationEnd=function(h){delete this._oAnimationEndCallIds[h];if(this._cHoverStyleUpdates===h){this._getStyleData();L._updateHoverStyle.call(this);}};b.prototype._clearAnimationUpdateQueue=function(){for(var k in this._oAnimationEndCallIds){q.sap.clearDelayedCall(this._oAnimationEndCallIds[k]);delete this._oAnimationEndCallIds[k];}};b.prototype._getLineCount=function(){var c=this.getDomRef().getBoundingClientRect(),d=L._getCSSPixelValue(this,"line-height");return Math.round(c.height/d);};b.prototype.getBoundingRects=function(){var p=this.$().offset();if(this.getMode()===l.GenericTileMode.LineMode&&this._isScreenLarge()){this._getStyleData();var r=[],s,o;this.$().find(".sapMGTLineStyleHelper").each(function(){s=q(this);o=s.offset();r.push({offset:{x:o.left,y:o.top},width:s.width(),height:s.height()});});return r;}else{return[{offset:{x:p.left,y:p.top},width:this.$().width(),height:this.$().height()}];}};b.prototype._updateLineTileSiblings=function(){var p=this.getParent();if(this.getMode()===l.GenericTileMode.LineMode&&this._isScreenLarge()&&p){var i=p.indexOfAggregation(this.sParentAggregationName,this);var s=p.getAggregation(this.sParentAggregationName).splice(i+1);for(i=0;i<s.length;i++){var S=s[i];if(S instanceof l.GenericTile&&S.getMode()===l.GenericTileMode.LineMode){S._updateHoverStyle();}}}};b.prototype.ontouchstart=function(){if(this.$("hover-overlay").length>0){this.$("hover-overlay").addClass("sapMGTPressActive");}if(this.getMode()===l.GenericTileMode.LineMode){this.addStyleClass("sapMGTLineModePress");}if(D.browser.internet_explorer&&this.getState()!==l.LoadState.Disabled){this.$().focus();}};b.prototype.ontouchcancel=function(){if(this.$("hover-overlay").length>0){this.$("hover-overlay").removeClass("sapMGTPressActive");}};b.prototype.ontouchend=function(){if(this.$("hover-overlay").length>0){this.$("hover-overlay").removeClass("sapMGTPressActive");}if(this.getMode()===l.GenericTileMode.LineMode){this.removeStyleClass("sapMGTLineModePress");}if(D.browser.internet_explorer&&this.getState()!==l.LoadState.Disabled){this.$().focus();}};b.prototype.ontap=function(e){var p;if(this._bTilePress&&this.getState()!==l.LoadState.Disabled){this.$().focus();p=this._getEventParams(e);this.firePress(p);e.preventDefault();}};b.prototype.onkeydown=function(e){if(q.sap.PseudoEvents.sapselect.fnCheck(e)&&this.getState()!==l.LoadState.Disabled){if(this.$("hover-overlay").length>0){this.$("hover-overlay").addClass("sapMGTPressActive");}e.preventDefault();}};b.prototype._updateAriaLabel=function(){var A=this._getAriaText(),t=this.$(),i=false;if(t.attr("aria-label")!==A){t.attr("aria-label",A);i=true;}return i;};b.prototype.onkeyup=function(e){var p,f=false,s=this.getScope(),A=s===l.GenericTileScope.Actions;if(A&&(q.sap.PseudoEvents.sapdelete.fnCheck(e)||q.sap.PseudoEvents.sapbackspace.fnCheck(e))){p={scope:s,action:b._Action.Remove,domRef:this._oRemoveButton.getPopupAnchorDomRef()};f=true;}if(q.sap.PseudoEvents.sapselect.fnCheck(e)&&this.getState()!==l.LoadState.Disabled){if(this.$("hover-overlay").length>0){this.$("hover-overlay").removeClass("sapMGTPressActive");}p=this._getEventParams(e);f=true;}if(f){this.firePress(p);e.preventDefault();}this._updateAriaLabel();};b.prototype.setProperty=function(p){sap.ui.core.Control.prototype.setProperty.apply(this,arguments);if(this.getMode()===l.GenericTileMode.LineMode&&b.LINEMODE_SIBLING_PROPERTIES.indexOf(p)!==-1){this._bUpdateLineTileSiblings=true;}return this;};b.prototype.getHeader=function(){return this._oTitle.getText();};b.prototype.setHeader=function(t){this._oTitle.setText(t);return this;};b.prototype.setHeaderImage=function(u){var v=!q.sap.equal(this.getHeaderImage(),u);if(v){if(this._oImage){this._oImage.destroy();this._oImage=undefined;}if(u){this._oImage=a.createControlByURI({id:this.getId()+"-icon-image",src:u},l.Image);this._oImage.addStyleClass("sapMGTHdrIconImage");}}return this.setProperty("headerImage",u);};b.prototype._applyHeaderMode=function(s){if(s){this._oTitle.setMaxLines(4);}else{this._oTitle.setMaxLines(5);}this._changeTileContentContentVisibility(false);};b.prototype._applyContentMode=function(s){if(s){this._oTitle.setMaxLines(2);}else{this._oTitle.setMaxLines(3);}this._changeTileContentContentVisibility(true);};b.prototype._changeTileContentContentVisibility=function(v){var t;t=this.getTileContent();for(var i=0;i<t.length;i++){t[i].setRenderContent(v);}};b.prototype._getHeaderAriaAndTooltipText=function(){var t="";var i=true;if(this.getHeader()){t+=this.getHeader();i=false;}if(this.getSubheader()){t+=(i?"":"\n")+this.getSubheader();i=false;}if(this.getImageDescription()){t+=(i?"":"\n")+this.getImageDescription();}return t;};b.prototype._getContentAriaAndTooltipText=function(){var t="";var c=true;var d=this.getTileContent();for(var i=0;i<d.length;i++){if(q.isFunction(d[i]._getAriaAndTooltipText)){t+=(c?"":"\n")+d[i]._getAriaAndTooltipText();}else if(d[i].getTooltip_AsString()){t+=(c?"":"\n")+d[i].getTooltip_AsString();}c=false;}return t;};b.prototype._getAriaAndTooltipText=function(){var A=(this.getTooltip_AsString()&&!this._isTooltipSuppressed())?this.getTooltip_AsString():(this._getHeaderAriaAndTooltipText()+"\n"+this._getContentAriaAndTooltipText());switch(this.getState()){case l.LoadState.Disabled:return"";case l.LoadState.Loading:return A+"\n"+this._sLoading;case l.LoadState.Failed:return A+"\n"+this._oFailedText.getText();default:if(q.trim(A).length===0){return"";}else{return A;}}};b.prototype._getAriaText=function(){var A=this.getTooltip_Text();var s=this.getAriaLabel();if(!A||this._isTooltipSuppressed()){A=this._getAriaAndTooltipText();}if(this.getScope()===l.GenericTileScope.Actions){A=this._oRb.getText("GENERICTILE_ACTIONS_ARIA_TEXT")+" "+A;}if(s){A=s+" "+A;}return A;};b.prototype._getTooltipText=function(){var t=this.getTooltip_Text();if(this._isTooltipSuppressed()===true){t=null;}return t;};b.prototype._checkFooter=function(t,c){var s=c.getState();var A=this.getScope()===l.GenericTileScope.Actions||this._bShowActionsView===true;if(s===l.LoadState.Failed||A&&s!==l.LoadState.Disabled){t.setRenderFooter(false);}else{t.setRenderFooter(true);}};b.prototype._generateFailedText=function(){var c=this.getFailedText();var f=c?c:this._sFailedToLoad;this._oFailedText.setText(f);this._oFailedText.setTooltip(f);};b.prototype._isTooltipSuppressed=function(){var t=this.getTooltip_Text();if(t&&t.length>0&&q.trim(t).length===0){return true;}else{return false;}};b.prototype._isHeaderTextTruncated=function(){var d,m,h,w;if(this.getMode()===l.GenericTileMode.LineMode){h=this.$("hdr-text");if(h.length>0){w=Math.ceil(h[0].getBoundingClientRect().width);return(h[0]&&w<h[0].scrollWidth);}else{return false;}}else{d=this.getAggregation("_titleText").getDomRef("inner");m=this.getAggregation("_titleText").getClampHeight(d);return(m<d.scrollHeight);}};b.prototype._isSubheaderTextTruncated=function(){var s=this.$("subHdr-text"),w;if(s.length>0){w=Math.ceil(s[0].getBoundingClientRect().width);return(s[0]&&w<s[0].scrollWidth);}else{return false;}};b.prototype._setTooltipFromControl=function(){var c,t="";var d=true;var e=this.getTileContent();if(this._isHeaderTextTruncated()){t=this._oTitle.getText();d=false;}if(this._isSubheaderTextTruncated()){t+=(d?"":"\n")+this.getSubheader();d=false;}if(this.getScope()!==l.GenericTileScope.Actions){for(var i=0;i<e.length;i++){c=e[i].getContent();if(c&&c.getMetadata().getLibraryName()==="sap.suite.ui.microchart"){t+=(d?"":"\n")+c.getTooltip_AsString();}d=false;}}if(t&&!this._getTooltipText()&&!this._isTooltipSuppressed()){this.$().attr("title",t);this._bTooltipFromControl=true;}};b.prototype._updateAriaAndTitle=function(){var A=this._getAriaAndTooltipText();var s=this._getAriaText();var t=this.$();if(t.attr("title")!==A){t.attr("aria-label",s);}if(this.getScope()===l.GenericTileScope.Actions){t.find('*:not(.sapMGTRemoveButton)').removeAttr("aria-label").removeAttr("title").unbind("mouseenter");}else{t.find('*').removeAttr("aria-label").removeAttr("title").unbind("mouseenter");}this._setTooltipFromControl();};b.prototype._removeTooltipFromControl=function(){if(this._bTooltipFromControl){this.$().removeAttr("title");this._bTooltipFromControl=false;}};b.prototype._isScreenLarge=function(){return this._getCurrentMediaContainerRange("GenericTileDeviceSet").name==="large";};b.prototype._getEventParams=function(e){var p,A=b._Action.Press,s=this.getScope(),d=this.getDomRef();if(s===l.GenericTileScope.Actions&&e.target.id.indexOf("-action-remove")>-1){A=b._Action.Remove;d=this._oRemoveButton.getPopupAnchorDomRef();}else if(s===l.GenericTileScope.Actions){d=this._oMoreIcon.getDomRef();}p={scope:s,action:A,domRef:d};return p;};b.prototype._handleMediaChange=function(){this._bUpdateLineTileSiblings=true;this.invalidate();};b.prototype.setPressEnabled=function(v){this._bTilePress=v;};b.prototype.showActionsView=function(v){if(this._bShowActionsView!==v){this._bShowActionsView=v;this.invalidate();}};return b;},true);
