/*!
* UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(['jquery.sap.global','./NavContainer','./library','sap/ui/core/Control','sap/ui/core/IconPool','sap/ui/core/delegate/ItemNavigation'],function(q,N,l,C,I,a){"use strict";var F=C.extend("sap.m.FacetFilter",{metadata:{interfaces:["sap.ui.core.IShrinkable"],library:"sap.m",properties:{showPersonalization:{type:"boolean",group:"Appearance",defaultValue:false},type:{type:"sap.m.FacetFilterType",group:"Appearance",defaultValue:sap.m.FacetFilterType.Simple},liveSearch:{type:"boolean",group:"Behavior",defaultValue:true},showSummaryBar:{type:"boolean",group:"Behavior",defaultValue:false},showReset:{type:"boolean",group:"Behavior",defaultValue:true},showPopoverOKButton:{type:"boolean",group:"Appearance",defaultValue:false}},defaultAggregation:"lists",aggregations:{lists:{type:"sap.m.FacetFilterList",multiple:true,singularName:"list"},buttons:{type:"sap.m.Button",multiple:true,singularName:"button",visibility:"hidden"},removeFacetIcons:{type:"sap.ui.core.Icon",multiple:true,singularName:"removeFacetIcon",visibility:"hidden"},popover:{type:"sap.m.Popover",multiple:false,visibility:"hidden"},addFacetButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"},dialog:{type:"sap.m.Dialog",multiple:false,visibility:"hidden"},summaryBar:{type:"sap.m.Toolbar",multiple:false,visibility:"hidden"},resetButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"},arrowLeft:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"},arrowRight:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}},events:{reset:{},confirm:{}}}});F.SCROLL_STEP=264;F.prototype.setType=function(t){var s=this.getAggregation("summaryBar");if(sap.ui.Device.system.phone){this.setProperty("type",sap.m.FacetFilterType.Light);s.setActive(true);}else{this.setProperty("type",t);s.setActive(t===sap.m.FacetFilterType.Light);}if(t===sap.m.FacetFilterType.Light){if(this.getShowReset()){this._addResetToSummary(s);}else{this._removeResetFromSummary(s);}}return this;};F.prototype.setShowReset=function(v){this.setProperty("showReset",v);var s=this.getAggregation("summaryBar");if(v){if(this.getShowSummaryBar()||this.getType()===sap.m.FacetFilterType.Light){this._addResetToSummary(s);}}else{if(this.getShowSummaryBar()||this.getType()===sap.m.FacetFilterType.Light){this._removeResetFromSummary(s);}}return this;};F.prototype.setShowSummaryBar=function(v){this.setProperty("showSummaryBar",v);if(v){var s=this.getAggregation("summaryBar");if(this.getShowReset()){this._addResetToSummary(s);}else{this._removeResetFromSummary(s);}s.setActive(this.getType()===sap.m.FacetFilterType.Light);}return this;};F.prototype.setLiveSearch=function(v){this.setProperty("liveSearch",v);if(this._displayedList){var L=this._displayedList;var s=sap.ui.getCore().byId(L.getAssociation("search"));s.detachLiveChange(L._handleSearchEvent,L);if(v){s.attachLiveChange(L._handleSearchEvent,L);}}return this;};F.prototype.getLists=function(){var L=this.getAggregation("lists");if(!L){L=[];}if(this._displayedList){L.splice(this._listAggrIndex,0,this._displayedList);}return L;};F.prototype.removeList=function(o){var L=sap.ui.base.ManagedObject.prototype.removeAggregation.call(this,"lists",o);this._removeList(L);return L;};F.prototype.removeAggregation=function(){var L=sap.ui.base.ManagedObject.prototype.removeAggregation.apply(this,arguments);if(arguments[0]==="lists"){this._removeList(L);}return L;};F.prototype.openFilterDialog=function(){var d=this._getFacetDialog();var n=this._getFacetDialogNavContainer();d.addContent(n);this.getLists().forEach(function(L){L._preserveOriginalActiveState();});d.setInitialFocus(n.getPages()[0].getContent()[0].getItems()[0]);d.open();return this;};F.prototype.init=function(){this._pageSize=5;this._addDelegateFlag=false;this._invalidateFlag=false;this._closePopoverFlag=false;this._lastCategoryFocusIndex=0;this._aDomRefs=null;this._previousTarget=null;this._addTarget=null;this._aRows=null;this._bundle=sap.ui.getCore().getLibraryResourceBundle("sap.m");this.data("sap-ui-fastnavgroup","true",true);this._buttons={};this._removeFacetIcons={};this._listAggrIndex=-1;this._displayedList=null;this._lastScrolling=false;this._bPreviousScrollForward=false;this._bPreviousScrollBack=false;this._getAddFacetButton();this._getSummaryBar();this.setAggregation("resetButton",this._createResetButton());if(q.sap.touchEventMode==="ON"&&!sap.ui.Device.system.phone){this._enableTouchSupport();}if(sap.ui.Device.system.phone){this.setType(sap.m.FacetFilterType.Light);}this._aOwnedLabels=[];};F.prototype.exit=function(){var c;sap.ui.getCore().detachIntervalTimer(this._checkOverflow,this);if(this.oItemNavigation){this.removeDelegate(this.oItemNavigation);this.oItemNavigation.destroy();}if(this._aOwnedLabels){this._aOwnedLabels.forEach(function(i){c=sap.ui.getCore().byId(i);if(c){c.destroy();}});this._aOwnedLabels=null;}};F.prototype.onBeforeRendering=function(){if(this.getShowSummaryBar()||this.getType()===sap.m.FacetFilterType.Light){var s=this.getAggregation("summaryBar");var t=s.getContent()[0];t.setText(this._getSummaryText());t.setTooltip(this._getSummaryText());}sap.ui.getCore().detachIntervalTimer(this._checkOverflow,this);};F.prototype.onAfterRendering=function(){if(this.getType()!==sap.m.FacetFilterType.Light&&!sap.ui.Device.system.phone){sap.ui.getCore().attachIntervalTimer(this._checkOverflow,this);}this._startItemNavigation();};F.prototype._startItemNavigation=function(){var f=this.getDomRef(),r=f.getElementsByClassName("sapMFFHead"),d=[];if(r.length>0){for(var i=0;i<r[0].childNodes.length;i++){if(r[0].childNodes[i].id.indexOf("ff")<0&&r[0].childNodes[i].id.indexOf("icon")<0&&r[0].childNodes[i].id.indexOf("add")<0){d.push(r[0].childNodes[i]);}if(r[0].childNodes[i].id.indexOf("add")>=0){d.push(r[0].childNodes[i]);}}}if(d!=""){this._aDomRefs=d;}if((!this.oItemNavigation)||this._addDelegateFlag==true){this.oItemNavigation=new a();this.addDelegate(this.oItemNavigation);this._addDelegateFlag=false;}this._aRows=r;for(var i=0;i<this.$().find(":sapTabbable").length;i++){if(this.$().find(":sapTabbable")[i].id.indexOf("add")>=0){this._addTarget=this.$().find(":sapTabbable")[i];break;}}this.oItemNavigation.setRootDomRef(f);this.oItemNavigation.setItemDomRefs(d);this.oItemNavigation.setCycling(false);this.oItemNavigation.setPageSize(this._pageSize);};F.prototype.onsapdelete=function(e){var b,L;if(!this.getShowPersonalization()){return;}b=sap.ui.getCore().byId(e.target.id);if(!b){return;}L=sap.ui.getCore().byId(b.getAssociation("list"));if(!L){return;}if(!L.getShowRemoveFacetIcon()){return;}L.removeSelections(true);L.setSelectedKeys();L.setProperty("active",false,true);this.invalidate();var t=this.$().find(":sapTabbable");q(t[t.length-1]).focus();var n=this.oItemNavigation.getFocusedIndex();q(e.target).blur();this.oItemNavigation.setFocusedIndex(n+1);this.focus();if(this.oItemNavigation.getFocusedIndex()==0){for(var k=0;k<this.$().find(":sapTabbable").length-1;k++){if(t[k].id.indexOf("add")>=0){q(t[k]).focus();}}}};F.prototype.onsaptabnext=function(e){this._previousTarget=e.target;if(e.target.parentNode.className=="sapMFFHead"){for(var i=0;i<this.$().find(":sapTabbable").length;i++){if(this.$().find(":sapTabbable")[i].parentNode.className=="sapMFFResetDiv"){q(this.$().find(":sapTabbable")[i]).focus();e.preventDefault();e.setMarked();return;}}}this._lastCategoryFocusIndex=this.oItemNavigation.getFocusedIndex();if(this._invalidateFlag==true){this.oItemNavigation.setFocusedIndex(-1);this.focus();this._invalidateFlag=false;}if(this._closePopoverFlag==true){this.oItemNavigation.setFocusedIndex(-1);this.focus();this._closePopoverFlag=false;}};F.prototype.onsaptabprevious=function(e){if(e.target.parentNode.className=="sapMFFResetDiv"&&this._previousTarget==null){q(this.$().find(":sapTabbable")[0]).focus();e.preventDefault();e.setMarked();return;}if(e.target.parentNode.className=="sapMFFResetDiv"&&this._previousTarget!=null&&this._previousTarget.id!=e.target.id){q(this._previousTarget).focus();e.preventDefault();e.setMarked();return;}if(e.target.id.indexOf("add")>=0||e.target.parentNode.className=="sapMFFHead"){this._previousTarget=e.target;q(this.$().find(":sapTabbable")[0]).focus();}};F.prototype.onsapend=function(e){if(this._addTarget!=null){q(this._addTarget).focus();e.preventDefault();e.setMarked();}else{q(this._aRows[this._aRows.length-1]).focus();e.preventDefault();e.setMarked();}this._previousTarget=e.target;};F.prototype.onsaphome=function(e){q(this._aRows[0]).focus();e.preventDefault();e.setMarked();this._previousTarget=e.target;};F.prototype.onsappageup=function(e){this._previousTarget=e.target;};F.prototype.onsappagedown=function(e){this._previousTarget=e.target;};F.prototype.onsapincreasemodifiers=function(e){if(e.which==q.sap.KeyCodes.ARROW_RIGHT){this._previousTarget=e.target;var c=this.oItemNavigation.getFocusedIndex()-1;var n=c+this._pageSize;q(e.target).blur();this.oItemNavigation.setFocusedIndex(n);this.focus();}};F.prototype.onsapdecreasemodifiers=function(e){var c=0;if(e.which==q.sap.KeyCodes.ARROW_LEFT){this._previousTarget=e.target;c=this.oItemNavigation.getFocusedIndex()+1;var n=c-this._pageSize;q(e.target).blur();this.oItemNavigation.setFocusedIndex(n);this.focus();}};F.prototype.onsapdownmodifiers=function(e){this._previousTarget=e.target;var c=0;c=this.oItemNavigation.getFocusedIndex()-1;var n=c+this._pageSize;q(e.target).blur();this.oItemNavigation.setFocusedIndex(n);this.focus();};F.prototype.onsapupmodifiers=function(e){this._previousTarget=e.target;var c=0;c=this.oItemNavigation.getFocusedIndex();if(c!=0){c=c+1;}var n=c-this._pageSize;q(e.target).blur();this.oItemNavigation.setFocusedIndex(n);this.focus();};F.prototype.onsapexpand=function(e){this._previousTarget=e.target;var n=this.oItemNavigation.getFocusedIndex()+1;q(e.target).blur();this.oItemNavigation.setFocusedIndex(n);this.focus();};F.prototype.onsapcollapse=function(e){this._previousTarget=e.target;var n=this.oItemNavigation.getFocusedIndex()-1;q(e.target).blur();this.oItemNavigation.setFocusedIndex(n);this.focus();};F.prototype.onsapdown=function(e){this._previousTarget=e.target;if(e.target.parentNode.className=="sapMFFResetDiv"){q(e.target).focus();e.preventDefault();e.setMarked();return;}};F.prototype.onsapup=function(e){this._previousTarget=e.target;if(e.target.parentNode.className=="sapMFFResetDiv"){q(e.target).focus();e.preventDefault();e.setMarked();}};F.prototype.onsapleft=function(e){this._previousTarget=e.target;if(e.target.parentNode.className=="sapMFFResetDiv"){q(e.target).focus();e.preventDefault();e.setMarked();}};F.prototype.onsapright=function(e){this._previousTarget=e.target;if(e.target.parentNode.className=="sapMFFResetDiv"){q(e.target).focus();e.preventDefault();e.setMarked();}};F.prototype.onsapescape=function(e){if(e.target.parentNode.className=="sapMFFResetDiv"){return;}var n=this._lastCategoryFocusIndex;q(e.target).blur();this.oItemNavigation.setFocusedIndex(n);this.focus();};F.prototype._getPopover=function(){var p=this.getAggregation("popover");if(!p){var t=this;p=new sap.m.Popover({placement:sap.m.PlacementType.Bottom,beforeOpen:function(e){if(t._displayedList){t._displayedList._setSearchValue("");}this.setCustomHeader(t._createFilterItemsSearchFieldBar(t._displayedList));var s=this.getSubHeader();if(!s){this.setSubHeader(t._createSelectAllCheckboxBar(t._displayedList));}c(t._displayedList);},afterClose:function(e){t._addDelegateFlag=true;t._closePopoverFlag=true;if(sap.ui.Device.browser.internet_explorer&&sap.ui.Device.browser.version<10){q.sap.delayedCall(100,t,t._handlePopoverAfterClose);}else{t._handlePopoverAfterClose();}},horizontalScrolling:false});this.setAggregation("popover",p,true);p.setContentWidth("30%");if(sap.ui.Device.browser.internet_explorer&&sap.ui.Device.browser.version<10){p.setContentWidth("30%");}p.addStyleClass("sapMFFPop");var c=function(L){if(!L){return;}var i=t._getFacetRemoveIcon(L);if(i){i._bTouchStarted=false;}};}if(this.getShowPopoverOKButton()){this._addOKButtonToPopover(p);}else{p.destroyAggregation("footer");}return p;};F.prototype._handlePopoverAfterClose=function(){var p=this.getAggregation("popover"),L=this._displayedList;if(!p){return;}var i=this._getFacetRemoveIcon(L);if(i&&i._bTouchStarted){return;}this._restoreListFromDisplayContainer(p);this._displayRemoveIcon(false,L);L._fireListCloseEvent();this._fireConfirmEvent();this.destroyAggregation("popover");if(this._oOpenPopoverDeferred){q.sap.delayedCall(0,this,function(){this._oOpenPopoverDeferred.resolve();this._oOpenPopoverDeferred=undefined;});}};F.prototype._fireConfirmEvent=function(){this.fireEvent('confirm');};F.prototype._openPopover=function(p,c){if(!p.isOpen()){var L=sap.ui.getCore().byId(c.getAssociation("list"));L.fireListOpen({});this._moveListToDisplayContainer(L,p);p.openBy(c);if(L.getShowRemoveFacetIcon()){this._displayRemoveIcon(true,L);}if(L.getWordWrap()){p.setContentWidth("30%");}L._applySearch();}return this;};F.prototype._getAddFacetButton=function(){var b=this.getAggregation("addFacetButton");if(!b){var t=this;var b=new sap.m.Button(this.getId()+"-add",{icon:I.getIconURI("add-filter"),type:sap.m.ButtonType.Transparent,tooltip:this._bundle.getText("FACETFILTER_ADDFACET"),press:function(e){t.openFilterDialog();}});this.setAggregation("addFacetButton",b,true);}return b;};F.prototype._getButtonForList=function(L){if(this._buttons[L.getId()]){this._setButtonText(L);return this._buttons[L.getId()];}var t=this;var b=new sap.m.Button({type:sap.m.ButtonType.Transparent,press:function(e){var T=this;var o=function(){var p=t._getPopover();t._openPopover(p,T);};L._preserveOriginalActiveState();if(sap.ui.Device.browser.internet_explorer&&sap.ui.Device.browser.version<10){q.sap.delayedCall(100,this,o);}else{var p=t._getPopover();if(p.isOpen()){q.sap.delayedCall(100,this,function(){if(p.isOpen()){return;}t._oOpenPopoverDeferred=q.Deferred();t._oOpenPopoverDeferred.promise().done(o);});}else{q.sap.delayedCall(100,this,o);}}}});this._buttons[L.getId()]=b;this.addAggregation("buttons",b);b.setAssociation("list",L.getId(),true);this._setButtonText(L);return b;};F.prototype._setButtonText=function(L){var b=this._buttons[L.getId()];if(b){var t="";var s=Object.getOwnPropertyNames(L._oSelectedKeys);var i=s.length;if(i===1){var S=L._oSelectedKeys[s[0]];t=this._bundle.getText("FACETFILTER_ITEM_SELECTION",[L.getTitle(),S]);}else if(i>0&&i===L._getNonGroupItems().length){t=this._bundle.getText("FACETFILTER_ALL_SELECTED",[L.getTitle()]);}else if(i>0){t=this._bundle.getText("FACETFILTER_ITEM_SELECTION",[L.getTitle(),i]);}else{t=L.getTitle();}b.setText(t);b.setTooltip(t);}};F.prototype._getFacetRemoveIcon=function(L){var t=this,i=this._removeFacetIcons[L.getId()];if(!i){i=new sap.ui.core.Icon({src:I.getIconURI("sys-cancel"),tooltip:this._bundle.getText("FACETFILTER_REMOVE"),press:function(){i._bPressed=true;}});i.addDelegate({ontouchstart:function(){i._bTouchStarted=true;i._bPressed=false;},ontouchend:function(){t._displayRemoveIcon(false,L);i._bTouchStarted=false;q.sap.delayedCall(100,this,p);}},true);var p=function(){if(i._bPressed){L.removeSelections(true);L.setSelectedKeys();L.setProperty("active",false,true);}t._handlePopoverAfterClose();};i.setAssociation("list",L.getId(),true);i.addStyleClass("sapMFFLRemoveIcon");this._removeFacetIcons[L.getId()]=i;this.addAggregation("removeFacetIcons",i);this._displayRemoveIcon(false,L);}return i;};F.prototype._displayRemoveIcon=function(d,L){if(this.getShowPersonalization()){var i=this._removeFacetIcons[L.getId()];if(d){i.removeStyleClass("sapMFFLHiddenRemoveIcon");i.addStyleClass("sapMFFLVisibleRemoveIcon");}else{i.removeStyleClass("sapMFFLVisibleRemoveIcon");i.addStyleClass("sapMFFLHiddenRemoveIcon");}}};F.prototype._getFacetDialogNavContainer=function(){var n=new N({autoFocus:false});var f=this._createFacetPage();n.addPage(f);n.setInitialPage(f);var t=this;n.attachAfterNavigate(function(e){var T=e.getParameters()["to"];var o=e.getParameters()['from'];if(o===f){var b=T.getContent(0)[1].getItems()[0];if(b){b.focus();}}if(T===f){o.destroySubHeader();o.destroyContent();t._selectedFacetItem.invalidate();T.invalidate();q.sap.focus(t._selectedFacetItem);t._selectedFacetItem=null;}});return n;};F.prototype._createFacetPage=function(){var f=this._createFacetList();var o=new sap.m.SearchField({width:"100%",tooltip:this._bundle.getText("FACETFILTER_SEARCH"),liveChange:function(e){var b=f.getBinding("items");if(b){var c=new sap.ui.model.Filter("text",sap.ui.model.FilterOperator.Contains,e.getParameters()["newValue"]);b.filter([c]);}}});var p=new sap.m.Page({enableScrolling:true,title:this._bundle.getText("FACETFILTER_TITLE"),subHeader:new sap.m.Bar({contentMiddle:o}),content:[f]});return p;};F.prototype._createFilterItemsPage=function(){var t=this;var p=new sap.m.Page({showNavButton:true,enableScrolling:true,navButtonPress:function(e){var n=e.getSource().getParent();t._navFromFilterItemsPage(n);}});return p;};F.prototype._getFilterItemsPage=function(n){var o=n.getPages()[1];if(o){n.removePage(o);o.destroy();}var p=this._createFilterItemsPage();n.addPage(p);return p;};F.prototype._createFilterItemsSearchFieldBar=function(L){var t=this;var s=true;if(L.getDataType()!=sap.m.FacetFilterListDataType.String){s=false;}var S=new sap.m.SearchField({value:L._getSearchValue(),width:"100%",enabled:s,tooltip:this._bundle.getText("FACETFILTER_SEARCH"),search:function(e){t._displayedList._handleSearchEvent(e);}});if(this.getLiveSearch()){S.attachLiveChange(L._handleSearchEvent,L);}var b=new sap.m.Bar({contentMiddle:S});L.setAssociation("search",S);return b;};F.prototype._getFacetDialog=function(){var d=this.getAggregation("dialog");if(!d){var t=this;d=new sap.m.Dialog({showHeader:false,stretch:sap.ui.Device.system.phone?true:false,afterClose:function(){t._addDelegateFlag=true;t._invalidateFlag=true;var n=this.getContent()[0];var f=n.getPages()[1];if(n.getCurrentPage()===f){var L=t._restoreListFromDisplayContainer(f);L._updateActiveState();L._fireListCloseEvent();}this.destroyAggregation("content",true);t.invalidate();},beginButton:new sap.m.Button({text:this._bundle.getText("FACETFILTER_ACCEPT"),tooltip:this._bundle.getText("FACETFILTER_ACCEPT"),press:function(){t._closeDialog();}}),contentHeight:"500px"});d.addStyleClass("sapMFFDialog");d.onsapentermodifiers=function(e){if(e.shiftKey&&!e.ctrlKey&&!e.altKey){var n=this.getContent()[0];t._navFromFilterItemsPage(n);}};this.setAggregation("dialog",d,true);}return d;};F.prototype._closeDialog=function(){var d=this.getAggregation("dialog");if(d&&d.isOpen()){d.close();this._fireConfirmEvent();}};F.prototype._closePopover=function(){var p=this.getAggregation("popover");if(p&&p.isOpen()){p.close();}};F.prototype._createFacetList=function(){var f=new sap.m.List({mode:sap.m.ListMode.None,items:{path:"/items",template:new sap.m.StandardListItem({title:"{text}",counter:"{count}",type:sap.m.ListType.Navigation,customData:[new sap.ui.core.CustomData({key:"index",value:"{index}"})]})}});var b=[];for(var i=0;i<this.getLists().length;i++){var L=this.getLists()[i];b.push({text:L.getTitle(),count:L.getAllCount(),index:i});}var m=new sap.ui.model.json.JSONModel({items:b});if(b.length>100){m.setSizeLimit(b.length);}var t=this;f.attachUpdateFinished(function(){for(var i=0;i<f.getItems().length;i++){var o=this.getItems()[i];o.detachPress(t._handleFacetListItemPress,t);o.attachPress(t._handleFacetListItemPress,t);}});f.setModel(m);return f;};F.prototype._createSelectAllCheckboxBar=function(L){if(!L.getMultiSelect()){return null;}var s=L.getActive()&&L.getItems().length>0&&Object.getOwnPropertyNames(L._oSelectedKeys).length===L.getItems().length;var c=new sap.m.CheckBox(L.getId()+"-selectAll",{text:this._bundle.getText("FACETFILTER_CHECKBOX_ALL"),tooltip:this._bundle.getText("FACETFILTER_CHECKBOX_ALL"),selected:s,select:function(e){c.setSelected(e.getParameter("selected"));L._handleSelectAllClick(e.getParameter("selected"));}});L.setAssociation("allcheckbox",c);var b=new sap.m.Bar();b.addEventDelegate({ontap:function(e){if(e.srcControl===this){L._handleSelectAllClick(c.getSelected());}}},b);b.addContentLeft(c);b.addStyleClass("sapMFFCheckbar");return b;};F.prototype._handleFacetListItemPress=function(e){this._navToFilterItemsPage(e.getSource());};F.prototype._navToFilterItemsPage=function(f){this._selectedFacetItem=f;var n=this.getAggregation("dialog").getContent()[0];var c=f.getCustomData();var i=c[0].getValue();var o=this.getLists()[i];this._listIndexAgg=this.indexOfAggregation("lists",o);if(this._listIndexAgg==i){var b=this._getFilterItemsPage(n);o.fireListOpen({});this._moveListToDisplayContainer(o,b);b.setSubHeader(this._createFilterItemsSearchFieldBar(o));var d=this._createSelectAllCheckboxBar(o);if(d){b.insertContent(d,0);}b.setTitle(o.getTitle());n.to(b);}};F.prototype._navFromFilterItemsPage=function(n){var f=n.getPages()[1];var L=this._restoreListFromDisplayContainer(f);L._updateActiveState();L._fireListCloseEvent();this._selectedFacetItem.setCounter(L.getAllCount());n.backToTop();};F.prototype._moveListToDisplayContainer=function(L,c){this._listAggrIndex=this.indexOfAggregation("lists",L);sap.ui.base.ManagedObject.prototype.removeAggregation.call(this,"lists",L,true);c.addAggregation("content",L,false);L.setAssociation("facetFilter",this,true);this._displayedList=L;};F.prototype._restoreListFromDisplayContainer=function(c){var L=c.removeAggregation("content",this._displayedList,true);this.insertAggregation("lists",L,this._listAggrIndex,L.getActive());this._listAggrIndex=-1;this._displayedList=null;return L;};F.prototype._getSequencedLists=function(){var m=-1;var s=[];var L=this.getLists();if(L.length>0){for(var i=0;i<L.length;i++){if(L[i].getActive()){if(L[i].getSequence()<-1){L[i].setSequence(-1);}else if(L[i].getSequence()>m){m=L[i].getSequence();}s.push(L[i]);}else if(!L[i].getRetainListSequence()){L[i].setSequence(-1);}}for(var j=0;j<s.length;j++){if(s[j].getSequence()<=-1){m+=1;s[j].setSequence(m);}}if(s.length>1){s.sort(function(b,c){return b.getSequence()-c.getSequence();});}}return s;};F.prototype._getSummaryBar=function(){var s=this.getAggregation("summaryBar");if(!s){var t=new sap.m.Text({maxLines:1});var b=this;s=new sap.m.Toolbar({content:[t],active:this.getType()===sap.m.FacetFilterType.Light?true:false,design:sap.m.ToolbarDesign.Info,press:function(e){b.openFilterDialog();}});this.setAggregation("summaryBar",s);}return s;};F.prototype._createResetButton=function(){var t=this;var b=new sap.m.Button({type:sap.m.ButtonType.Transparent,icon:I.getIconURI("undo"),tooltip:this._bundle.getText("FACETFILTER_RESET"),press:function(e){t._addDelegateFlag=true;t._invalidateFlag=true;t.fireReset();var L=t.getLists();for(var i=0;i<L.length;i++){L[i]._searchValue="";L[i]._applySearch();q.sap.focus(L[i].getItems()[0]);}t.invalidate();}});return b;};F.prototype._addOKButtonToPopover=function(p){var b=p.getFooter();if(!b){var t=this;var b=new sap.m.Button({text:this._bundle.getText("FACETFILTER_ACCEPT"),tooltip:this._bundle.getText("FACETFILTER_ACCEPT"),width:"100%",press:function(){t._closePopover();}});p.setFooter(b);}return b;};F.prototype._getSummaryText=function(){var b=", ";var S=" ";var f="";var c=true;var L=this.getLists();if(L.length>0){for(var i=0;i<L.length;i++){var o=L[i];if(o.getActive()){var d=this._getSelectedItemsText(o);var t="";for(var j=0;j<d.length;j++){t=t+d[j]+b;}if(t){t=t.substring(0,t.lastIndexOf(b)).trim();if(c){f=this._bundle.getText("FACETFILTER_INFOBAR_FILTERED_BY",[o.getTitle(),t]);c=false;}else{f=f+S+this._bundle.getText("FACETFILTER_INFOBAR_AND")+S+this._bundle.getText("FACETFILTER_INFOBAR_AFTER_AND",[o.getTitle(),t]);}}}}}if(!f){f=this._bundle.getText("FACETFILTER_INFOBAR_NO_FILTERS");}return f;};F.prototype._getSelectedItemsText=function(L){var t=L.getSelectedItems().map(function(v){return v.getText();});L._oSelectedKeys&&Object.getOwnPropertyNames(L._oSelectedKeys).forEach(function(v){t.indexOf(L._oSelectedKeys[v])===-1&&t.push(L._oSelectedKeys[v]);});return t;};F.prototype._addResetToSummary=function(s){if(s.getContent().length===1){s.addContent(new sap.m.ToolbarSpacer({width:""}));var b=this._createResetButton();s.addContent(b);b.addStyleClass("sapUiSizeCompact");b.addStyleClass("sapMFFRefresh");b.addStyleClass("sapMFFBtnHoverable");}};F.prototype._removeResetFromSummary=function(s){if(s.getContent().length===3){var S=s.removeAggregation("content",1);S.destroy();var b=s.removeAggregation("content",1);b.destroy();}};F.prototype._removeList=function(L){if(L){var b=this._buttons[L.getId()];if(b){this.removeAggregation("buttons",b);b.destroy();}var r=this._removeFacetIcons[L.getId()];if(r){this.removeAggregation("removeIcons",r);r.destroy();}delete this._buttons[L.getId()];delete this._removeFacetIcons[L.getId()];}};F.prototype._getScrollingArrow=function(n){var A=null;var p={src:"sap-icon://navigation-"+n+"-arrow"};if(n==="left"){A=this.getAggregation("arrowLeft");if(!A){p.id=this.getId()+"-arrowScrollLeft";A=I.createControlByURI(p);var c=["sapMPointer","sapMFFArrowScroll","sapMFFArrowScrollLeft"];for(var i=0;i<c.length;i++){A.addStyleClass(c[i]);A.setTooltip(this._bundle.getText("FACETFILTER_PREVIOUS"));}this.setAggregation("arrowLeft",A);}}else if(n==="right"){A=this.getAggregation("arrowRight");if(!A){p.id=this.getId()+"-arrowScrollRight";A=I.createControlByURI(p);var b=["sapMPointer","sapMFFArrowScroll","sapMFFArrowScrollRight"];for(var i=0;i<b.length;i++){A.addStyleClass(b[i]);A.setTooltip(this._bundle.getText("FACETFILTER_NEXT"));}this.setAggregation("arrowRight",A);}}else{q.sap.log.error("Scrolling arrow name "+n+" is not valid");}return A;};F.prototype._checkOverflow=function(){var b=this.getDomRef("head"),L=q(b),B=this.$(),s=false,S=false,c=false,i=null,d=null,e=null;if(b){i=b.scrollLeft;d=b.scrollWidth;e=b.clientWidth;if(d>e){if(d-e==1){d=e;}else{c=true;}}B.toggleClass("sapMFFScrolling",c);B.toggleClass("sapMFFNoScrolling",!c);this._lastScrolling=c;if(!this._bRtl){s=i>0;S=(d>e)&&(d>i+e);}else{S=L.scrollLeftRTL()>0;s=L.scrollRightRTL()>0;}if((S!=this._bPreviousScrollForward)||(s!=this._bPreviousScrollBack)){B.toggleClass("sapMFFNoScrollBack",!s);B.toggleClass("sapMFFNoScrollForward",!S);}}};F.prototype.onclick=function(e){var t=e.target.id;if(t){var i=this.getId();e.preventDefault();if(t==i+"-arrowScrollLeft"){this._scroll(-F.SCROLL_STEP,500);}else if(t==i+"-arrowScrollRight"){this._scroll(F.SCROLL_STEP,500);}}};F.prototype._scroll=function(d,D){var o=this.getDomRef("head");var s=o.scrollLeft;if(!sap.ui.Device.browser.internet_explorer&&this._bRtl){d=-d;}var S=s+d;q(o).stop(true,true).animate({scrollLeft:S},D);};F.prototype._enableTouchSupport=function(){var t=this;var T=function(e){e.preventDefault();if(t._iInertiaIntervalId){window.clearInterval(t._iInertiaIntervalId);}t.startScrollX=t.getDomRef("head").scrollLeft;t.startTouchX=e.touches[0].pageX;t._bTouchNotMoved=true;t._lastMoveTime=new Date().getTime();};var f=function(e){var d=e.touches[0].pageX-t.startTouchX;var L=t.getDomRef("head");var o=L.scrollLeft;var n=t.startScrollX-d;L.scrollLeft=n;t._bTouchNotMoved=false;var c=new Date().getTime()-t._lastMoveTime;t._lastMoveTime=new Date().getTime();if(c>0){t._velocity=(n-o)/c;}e.preventDefault();};var b=function(e){if(t._bTouchNotMoved===false){e.preventDefault();var L=t.getDomRef("head");var d=50;var c=Math.abs(t._velocity/10);t._iInertiaIntervalId=window.setInterval(function(){t._velocity=t._velocity*0.80;var g=t._velocity*d;L.scrollLeft=L.scrollLeft+g;if(Math.abs(t._velocity)<c){window.clearInterval(t._iInertiaIntervalId);t._iInertiaIntervalId=undefined;}},d);}else if(t._bTouchNotMoved===true){t.onclick(e);e.preventDefault();}t._bTouchNotMoved=undefined;t._lastMoveTime=undefined;};this.addEventDelegate({ontouchstart:T},this);this.addEventDelegate({ontouchend:b},this);this.addEventDelegate({ontouchmove:f},this);};return F;},true);
