/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./GroupHeaderListItem','./ListItemBase','./library','sap/ui/core/Control','sap/ui/core/delegate/ItemNavigation','sap/ui/core/InvisibleText'],function(q,G,L,l,C,I,a){"use strict";var b=C.extend("sap.m.ListBase",{metadata:{library:"sap.m",properties:{inset:{type:"boolean",group:"Appearance",defaultValue:false},headerText:{type:"string",group:"Misc",defaultValue:null},headerDesign:{type:"sap.m.ListHeaderDesign",group:"Appearance",defaultValue:sap.m.ListHeaderDesign.Standard,deprecated:true},footerText:{type:"string",group:"Misc",defaultValue:null},mode:{type:"sap.m.ListMode",group:"Behavior",defaultValue:sap.m.ListMode.None},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},includeItemInSelection:{type:"boolean",group:"Behavior",defaultValue:false},showUnread:{type:"boolean",group:"Misc",defaultValue:false},noDataText:{type:"string",group:"Misc",defaultValue:null},showNoData:{type:"boolean",group:"Misc",defaultValue:true},enableBusyIndicator:{type:"boolean",group:"Behavior",defaultValue:true},modeAnimationOn:{type:"boolean",group:"Misc",defaultValue:true},showSeparators:{type:"sap.m.ListSeparators",group:"Appearance",defaultValue:sap.m.ListSeparators.All},swipeDirection:{type:"sap.m.SwipeDirection",group:"Misc",defaultValue:sap.m.SwipeDirection.Both},growing:{type:"boolean",group:"Behavior",defaultValue:false},growingThreshold:{type:"int",group:"Misc",defaultValue:20},growingTriggerText:{type:"string",group:"Appearance",defaultValue:null},growingScrollToLoad:{type:"boolean",group:"Behavior",defaultValue:false},growingDirection:{type:"sap.m.ListGrowingDirection",group:"Behavior",defaultValue:sap.m.ListGrowingDirection.Downwards},rememberSelections:{type:"boolean",group:"Behavior",defaultValue:true},keyboardMode:{type:"sap.m.ListKeyboardMode",group:"Behavior",defaultValue:sap.m.ListKeyboardMode.Navigation}},defaultAggregation:"items",aggregations:{items:{type:"sap.m.ListItemBase",multiple:true,singularName:"item",bindable:"bindable"},swipeContent:{type:"sap.ui.core.Control",multiple:false},headerToolbar:{type:"sap.m.Toolbar",multiple:false},infoToolbar:{type:"sap.m.Toolbar",multiple:false}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{select:{deprecated:true,parameters:{listItem:{type:"sap.m.ListItemBase"}}},selectionChange:{parameters:{listItem:{type:"sap.m.ListItemBase"},listItems:{type:"sap.m.ListItemBase[]"},selected:{type:"boolean"}}},"delete":{parameters:{listItem:{type:"sap.m.ListItemBase"}}},swipe:{allowPreventDefault:true,parameters:{listItem:{type:"sap.m.ListItemBase"},swipeContent:{type:"sap.ui.core.Control"},srcControl:{type:"sap.ui.core.Control"}}},growingStarted:{deprecated:true,parameters:{actual:{type:"int"},total:{type:"int"}}},growingFinished:{deprecated:true,parameters:{actual:{type:"int"},total:{type:"int"}}},updateStarted:{parameters:{reason:{type:"string"},actual:{type:"int"},total:{type:"int"}}},updateFinished:{parameters:{reason:{type:"string"},actual:{type:"int"},total:{type:"int"}}},itemPress:{parameters:{listItem:{type:"sap.m.ListItemBase"},srcControl:{type:"sap.ui.core.Control"}}}}}});b.prototype.iAnnounceDetails=1;b.getInvisibleText=function(){return this.oInvisibleText||(this.oInvisibleText=new a().toStatic());};b.prototype.sNavItemClass="sapMLIB";b.prototype.init=function(){this._aNavSections=[];this._aSelectedPaths=[];this._iItemNeedsHighlight=0;this.data("sap-ui-fastnavgroup","true",true);};b.prototype.onBeforeRendering=function(){this._bRendering=true;this._bActiveItem=false;this._aNavSections=[];this._removeSwipeContent();};b.prototype.onAfterRendering=function(){this._bRendering=false;this._sLastMode=this.getMode();if(sap.ui.Device.system.desktop){this._bItemNavigationInvalidated=true;}};b.prototype.exit=function(){this._oSelectedItem=null;this._aNavSections=[];this._aSelectedPaths=[];this._destroyGrowingDelegate();this._destroyItemNavigation();};b.prototype.refreshItems=function(r){if(r!="sort"||this.getBinding("items").getLength()!=0){this._showBusyIndicator();}if(this._oGrowingDelegate){this._oGrowingDelegate.refreshItems(r);}else{if(!this._bReceivingData){this._updateStarted(r);this._bReceivingData=true;}this.refreshAggregation("items");}};b.prototype.updateItems=function(r){if(this._oGrowingDelegate){this._oGrowingDelegate.updateItems(r);}else{if(this._bReceivingData){this._bReceivingData=false;}else{this._updateStarted(r);}this.updateAggregation("items");this._updateFinished();}};b.prototype.setBindingContext=function(){this._resetItemsBinding();return C.prototype.setBindingContext.apply(this,arguments);};b.prototype._bindAggregation=function(n){n=="items"&&this._resetItemsBinding();return C.prototype._bindAggregation.apply(this,arguments);};b.prototype.destroyItems=function(s){if(!this.getItems(true).length){return this;}this._oSelectedItem=null;this.destroyAggregation("items","KeepDom");if(!s){this.invalidate();}return this;};b.prototype.removeAllItems=function(A){this._oSelectedItem=null;return this.removeAllAggregation("items");};b.prototype.removeItem=function(i){var o=this.removeAggregation("items",i);if(o&&o===this._oSelectedItem){this._oSelectedItem=null;}return o;};b.prototype.getItems=function(r){if(r){return this.mAggregations["items"]||[];}return this.getAggregation("items",[]);};b.prototype.getId=function(s){var i=this.sId;return s?i+"-"+s:i;};b.prototype.setGrowing=function(g){g=!!g;if(this.getGrowing()!=g){this.setProperty("growing",g,!g);if(g){q.sap.require("sap.m.GrowingEnablement");this._oGrowingDelegate=new sap.m.GrowingEnablement(this);}else if(this._oGrowingDelegate){this._oGrowingDelegate.destroy();this._oGrowingDelegate=null;}}return this;};b.prototype.setGrowingThreshold=function(t){return this.setProperty("growingThreshold",t,true);};b.prototype.setEnableBusyIndicator=function(e){this.setProperty("enableBusyIndicator",e,true);if(!this.getEnableBusyIndicator()){this._hideBusyIndicator();}return this;};b.prototype.setNoDataText=function(n){this.setProperty("noDataText",n,true);this.$("nodata-text").text(this.getNoDataText());return this;};b.prototype.getNoDataText=function(c){if(c&&this._bBusy){return"";}var n=this.getProperty("noDataText");n=n||sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("LIST_NO_DATA");return n;};b.prototype.getSelectedItem=function(){var c=this.getItems(true);for(var i=0;i<c.length;i++){if(c[i].getSelected()){return c[i];}}return null;};b.prototype.setSelectedItem=function(o,s,f){if(this.indexOfItem(o)<0){q.sap.log.warning("setSelectedItem is called without valid ListItem parameter on "+this);return;}if(this._bSelectionMode){o.setSelected((s===undefined)?true:!!s);f&&this._fireSelectionChangeEvent([o]);}};b.prototype.getSelectedItems=function(){return this.getItems(true).filter(function(i){return i.getSelected();});};b.prototype.setSelectedItemById=function(i,s){var o=sap.ui.getCore().byId(i);return this.setSelectedItem(o,s);};b.prototype.getSelectedContexts=function(A){var B=this.getBindingInfo("items"),m=(B||{}).model,M=this.getModel(m);if(!B||!M){return[];}if(A&&this.getRememberSelections()){return this._aSelectedPaths.map(function(p){return M.getContext(p);});}return this.getSelectedItems().map(function(i){return i.getBindingContext(m);});};b.prototype.removeSelections=function(A,f,d){var c=[];this._oSelectedItem=null;A&&(this._aSelectedPaths=[]);this.getItems(true).forEach(function(i){if(!i.getSelected()){return;}if(d&&i.isSelectedBoundTwoWay()){return;}i.setSelected(false,true);c.push(i);!A&&this._updateSelectedPaths(i);},this);if(f&&c.length){this._fireSelectionChangeEvent(c);}return this;};b.prototype.selectAll=function(f){if(this.getMode()!="MultiSelect"){return this;}var c=[];this.getItems(true).forEach(function(i){if(!i.getSelected()){i.setSelected(true,true);c.push(i);this._updateSelectedPaths(i);}},this);if(f&&c.length){this._fireSelectionChangeEvent(c);}return this;};b.prototype.getLastMode=function(m){return this._sLastMode;};b.prototype.setMode=function(m){m=this.validateProperty("mode",m);var o=this.getMode();if(o==m){return this;}this._bSelectionMode=m.indexOf("Select")>-1;if(!this._bSelectionMode){this.removeSelections(true);}else{var s=this.getSelectedItems();if(s.length>1){this.removeSelections(true);}else if(o===sap.m.ListMode.MultiSelect){this._oSelectedItem=s[0];}}return this.setProperty("mode",m);};b.prototype.getGrowingInfo=function(){return this._oGrowingDelegate?this._oGrowingDelegate.getInfo():null;};b.prototype.setRememberSelections=function(r){this.setProperty("rememberSelections",r,true);!this.getRememberSelections()&&(this._aSelectedPaths=[]);return this;};b.prototype.setSelectedContextPaths=function(s){this._aSelectedPaths=s||[];};b.prototype.getSelectedContextPaths=function(){return this._aSelectedPaths.slice(0);};b.prototype.isAllSelectableSelected=function(){if(this.getMode()!=sap.m.ListMode.MultiSelect){return false;}var i=this.getItems(true),s=this.getSelectedItems().length,S=i.filter(function(o){return o.isSelectable();}).length;return(i.length>0)&&(s==S);};b.prototype.getVisibleItems=function(){return this.getItems(true).filter(function(i){return i.getVisible();});};b.prototype.getActiveItem=function(){return this._bActiveItem;};b.prototype.onItemDOMUpdate=function(o){if(!this._bRendering&&this.bOutput){this._startItemNavigation(true);}};b.prototype.onItemActiveChange=function(o,A){this._bActiveItem=A;};b.prototype.onItemHighlightChange=function(i,n){this._iItemNeedsHighlight+=(n?1:-1);if(this._iItemNeedsHighlight==1&&n){this.$("listUl").addClass("sapMListHighlight");}else if(this._iItemNeedsHighlight==0){this.$("listUl").removeClass("sapMListHighlight");}};b.prototype.onItemSelectedChange=function(o,s){if(this.getMode()==sap.m.ListMode.MultiSelect){this._updateSelectedPaths(o,s);return;}if(s){this._aSelectedPaths=[];this._oSelectedItem&&this._oSelectedItem.setSelected(false,true);this._oSelectedItem=o;}else if(this._oSelectedItem===o){this._oSelectedItem=null;}this._updateSelectedPaths(o,s);};b.prototype.getItemsContainerDomRef=function(){return this.getDomRef("listUl");};b.prototype.checkGrowingFromScratch=function(){};b.prototype.onBeforePageLoaded=function(g,c){this._fireUpdateStarted(c,g);this.fireGrowingStarted(g);};b.prototype.onAfterPageLoaded=function(g,c){this._fireUpdateFinished(g);this.fireGrowingFinished(g);};b.prototype.addNavSection=function(i){this._aNavSections.push(i);return i;};b.prototype.getMaxItemsCount=function(){var B=this.getBinding("items");if(B&&B.getLength){return B.getLength()||0;}return this.getItems(true).length;};b.prototype.shouldRenderItems=function(){return true;};b.prototype._resetItemsBinding=function(){if(this.isBound("items")){this._bUpdating=false;this._bReceivingData=false;this.removeSelections(true,false,true);this._oGrowingDelegate&&this._oGrowingDelegate.reset();this._hideBusyIndicator();if(this._oItemNavigation){this._oItemNavigation.iFocusedIndex=-1;}}};b.prototype._updateStarted=function(r){if(!this._bReceivingData&&!this._bUpdating){this._bUpdating=true;this._fireUpdateStarted(r);}};b.prototype._fireUpdateStarted=function(r,i){this._sUpdateReason=q.sap.charToUpperCase(r||"Refresh");this.fireUpdateStarted({reason:this._sUpdateReason,actual:i?i.actual:this.getItems(true).length,total:i?i.total:this.getMaxItemsCount()});};b.prototype._updateFinished=function(){if(!this._bReceivingData&&this._bUpdating){this._fireUpdateFinished();this._bUpdating=false;}};b.prototype._fireUpdateFinished=function(i){this._hideBusyIndicator();q.sap.delayedCall(0,this,function(){this._bItemNavigationInvalidated=true;this.fireUpdateFinished({reason:this._sUpdateReason,actual:i?i.actual:this.getItems(true).length,total:i?i.total:this.getMaxItemsCount()});});};b.prototype._showBusyIndicator=function(){if(this.getEnableBusyIndicator()&&!this.getBusy()&&!this._bBusy){this._bBusy=true;this._sBusyTimer=q.sap.delayedCall(this.getBusyIndicatorDelay(),this,function(){this.$("nodata-text").text("");});this.setBusy(true,"listUl");}};b.prototype._hideBusyIndicator=function(){if(this._bBusy){this._bBusy=false;this.setBusy(false,"listUl");q.sap.clearDelayedCall(this._sBusyTimer);if(!this.getItems(true).length){this.$("nodata-text").text(this.getNoDataText());}}};b.prototype.onItemBindingContextSet=function(i){if(!this._bSelectionMode||!this.getRememberSelections()||!this.isBound("items")){return;}if(i.isSelectedBoundTwoWay()){return;}var p=i.getBindingContextPath();if(p){var s=(this._aSelectedPaths.indexOf(p)>-1);i.setSelected(s);}};b.prototype.onItemInserted=function(i,s){if(s){this.onItemSelectedChange(i,true);}if(!this._bSelectionMode||!this._aSelectedPaths.length||!this.getRememberSelections()||!this.isBound("items")||i.isSelectedBoundTwoWay()||i.getSelected()){return;}var p=i.getBindingContextPath();if(p&&this._aSelectedPaths.indexOf(p)>-1){i.setSelected(true);}};b.prototype.onItemSelect=function(o,s){if(this.getMode()==sap.m.ListMode.MultiSelect){this._fireSelectionChangeEvent([o]);}else if(this._bSelectionMode&&s){this._fireSelectionChangeEvent([o]);}};b.prototype._fireSelectionChangeEvent=function(c){var o=c&&c[0];if(!o){return;}this.fireSelectionChange({listItem:o,listItems:c,selected:o.getSelected()});this.fireSelect({listItem:o});};b.prototype.onItemDelete=function(o){this.fireDelete({listItem:o});};b.prototype.onItemPress=function(o,s){if(o.getType()==sap.m.ListType.Inactive){return;}q.sap.delayedCall(0,this,function(){this.fireItemPress({listItem:o,srcControl:s});});};b.prototype._updateSelectedPaths=function(i,s){if(!this.getRememberSelections()||!this.isBound("items")){return;}var p=i.getBindingContextPath();if(!p){return;}s=(s===undefined)?i.getSelected():s;var c=this._aSelectedPaths.indexOf(p);if(s){c<0&&this._aSelectedPaths.push(p);}else{c>-1&&this._aSelectedPaths.splice(c,1);}};b.prototype._destroyGrowingDelegate=function(){if(this._oGrowingDelegate){this._oGrowingDelegate.destroy();this._oGrowingDelegate=null;}};b.prototype._destroyItemNavigation=function(){if(this._oItemNavigation){this.removeEventDelegate(this._oItemNavigation);this._oItemNavigation.destroy();this._oItemNavigation=null;}};b.prototype._getTouchBlocker=function(){return this.$().children();};b.prototype._getSwipeContainer=function(){return this._$swipeContainer||(q.sap.require("sap.m.InstanceManager"),this._$swipeContainer=q("<div>",{"id":this.getId("swp"),"class":"sapMListSwp"}));};b.prototype._setSwipePosition=function(){if(this._isSwipeActive){return this._getSwipeContainer().css("top",this._swipedItem.$().position().top);}};b.prototype._renderSwipeContent=function(){var $=this._swipedItem.$(),c=this._getSwipeContainer();this.$().prepend(c.css({top:$.position().top,height:$.outerHeight(true)}));if(this._bRerenderSwipeContent){this._bRerenderSwipeContent=false;var r=sap.ui.getCore().createRenderManager();r.render(this.getSwipeContent(),c.empty()[0]);r.destroy();}return this;};b.prototype._swipeIn=function(){var t=this,$=t._getTouchBlocker(),c=t._getSwipeContainer();t._isSwipeActive=true;t._renderSwipeContent();sap.m.InstanceManager.addDialogInstance(t);window.document.activeElement.blur();q(window).on("resize.swp",function(){t._setSwipePosition();});$.css("pointer-events","none").on("touchstart.swp mousedown.swp",function(e){if(!c[0].firstChild.contains(e.target)){e.preventDefault();e.stopPropagation();}});c.bind("webkitAnimationEnd animationend",function(){q(this).unbind("webkitAnimationEnd animationend");c.css("opacity",1).focus();$.parent().on("touchend.swp touchcancel.swp mouseup.swp",function(e){if(!c[0].firstChild.contains(e.target)){t.swipeOut();}});}).removeClass("sapMListSwpOutAnim").addClass("sapMListSwpInAnim");};b.prototype._onSwipeOut=function(c){this._getSwipeContainer().css("opacity",0).remove();q(window).off("resize.swp");this._getTouchBlocker().css("pointer-events","auto").off("touchstart.swp mousedown.swp");if(typeof c=="function"){c.call(this,this._swipedItem,this.getSwipeContent());}this._isSwipeActive=false;sap.m.InstanceManager.removeDialogInstance(this);};b.prototype.swipeOut=function(c){if(!this._isSwipeActive){return this;}var t=this,$=this._getSwipeContainer();this._getTouchBlocker().parent().off("touchend.swp touchend.swp touchcancel.swp mouseup.swp");$.bind("webkitAnimationEnd animationend",function(){q(this).unbind("webkitAnimationEnd animationend");t._onSwipeOut(c);}).removeClass("sapMListSwpInAnim").addClass("sapMListSwpOutAnim");return this;};b.prototype._removeSwipeContent=function(){if(this._isSwipeActive){this.swipeOut()._onSwipeOut();}};b.prototype.close=b.prototype._removeSwipeContent;b.prototype._onSwipe=function(e){var c=this.getSwipeContent(),s=e.srcControl;if(c&&s&&!this._isSwipeActive&&this!==s&&!this._eventHandledByControl&&(sap.ui.Device.support.touch||(sap.ui.Device.os.windows&&sap.ui.Device.os.version>=8))){for(var d=s;d&&!(d instanceof sap.m.ListItemBase);d=d.oParent);if(d instanceof sap.m.ListItemBase){this._swipedItem=d;this.fireSwipe({listItem:this._swipedItem,swipeContent:c,srcControl:s},true)&&this._swipeIn();}}};b.prototype.ontouchstart=function(e){this._eventHandledByControl=e.isMarked();};b.prototype.onswipeleft=function(e){var c=sap.ui.getCore().getConfiguration().getRTL()?"RightToLeft":"LeftToRight";if(this.getSwipeDirection()!=c){this._onSwipe(e);}};b.prototype.onswiperight=function(e){var c=sap.ui.getCore().getConfiguration().getRTL()?"LeftToRight":"RightToLeft";if(this.getSwipeDirection()!=c){this._onSwipe(e);}};b.prototype.setSwipeDirection=function(d){return this.setProperty("swipeDirection",d,true);};b.prototype.getSwipedItem=function(){return(this._isSwipeActive?this._swipedItem:null);};b.prototype.setSwipeContent=function(c){this._bRerenderSwipeContent=true;this.toggleStyleClass("sapMListSwipable",!!c);return this.setAggregation("swipeContent",c,!this._isSwipeActive);};b.prototype.invalidate=function(o){if(o&&o===this.getSwipeContent()){this._bRerenderSwipeContent=true;this._isSwipeActive&&this._renderSwipeContent();return this;}C.prototype.invalidate.apply(this,arguments);return this;};b.prototype.addItemGroup=function(g,h,s){h=h||new G({title:g.text||g.key});h._bGroupHeader=true;this.addAggregation("items",h,s);return h;};b.prototype.removeGroupHeaders=function(s){this.getItems(true).forEach(function(i){if(i.isGroupHeader()){i.destroy(s);}});};b.prototype.getAccessibilityType=function(){return sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_LIST");};b.prototype.getAccessibilityStates=function(){if(!this.getItems(true).length){return"";}var s="",m=sap.m.ListMode,M=this.getMode(),B=this.getBinding("rows"),o=sap.ui.getCore().getLibraryResourceBundle("sap.m");if(M==m.MultiSelect){s+=o.getText("LIST_MULTISELECTABLE")+" ";}else if(M==m.Delete){s+=o.getText("LIST_DELETABLE")+" ";}else if(M!=m.None){s+=o.getText("LIST_SELECTABLE")+" ";}if(B&&B.isGrouped()){s+=o.getText("LIST_GROUPED")+" ";}return s;};b.prototype.getAccessibilityDescription=function(){var d=this.getAriaLabelledBy().map(function(A){var o=sap.ui.getCore().byId(A);return L.getAccessibilityText(o);}).join(" ");var h=this.getHeaderToolbar();if(h){var t=h.getTitleControl();if(t){d+=t.getText()+" ";}}else{d+=this.getHeaderText()+" ";}d+=this.getAccessibilityType()+" ";d+=this.getAccessibilityStates()+" ";d+=this.getFooterText();return d.trim();};b.prototype.getAccessibilityInfo=function(){return{description:this.getAccessibilityDescription(),focusable:true};};b.prototype.getAccessbilityPosition=function(i){var s=0,c=this.getVisibleItems(),p=c.indexOf(i)+1,B=this.getBinding("items");if(this.getGrowing()&&this.getGrowingScrollToLoad()&&B&&B.isLengthFinal()){s=B.getLength();if(B.isGrouped()){s+=c.filter(function(i){return i.isGroupHeader()&&i.getVisible();}).length;}}else{s=c.length;}return{setSize:s,posInset:p};};b.prototype.onItemFocusIn=function(i){if(!sap.ui.getCore().getConfiguration().getAccessibility()){return;}var o=i.getDomRef(),p=this.getAccessbilityPosition(i);if(!i.getContentAnnouncement){this.getNavigationRoot().setAttribute("aria-activedescendant",o.id);o.setAttribute("aria-posinset",p.posInset);o.setAttribute("aria-setsize",p.setSize);}else{var A=i.getAccessibilityInfo(),B=sap.ui.getCore().getLibraryResourceBundle("sap.m"),d=A.type+" ";d+=B.getText("LIST_ITEM_POSITION",[p.posInset,p.setSize])+" ";d+=A.description;this.updateInvisibleText(d,o);}};b.prototype.updateInvisibleText=function(t,i,p){var o=b.getInvisibleText(),f=q(i||document.activeElement);if(this.iAnnounceDetails){if(this.iAnnounceDetails==1){t=this.getAccessibilityStates()+" "+t;}else{t=this.getAccessibilityInfo().description+" "+t;}this.iAnnounceDetails=0;}o.setText(t.trim());f.addAriaLabelledBy(o.getId(),p);window.setTimeout(function(){f.removeAriaLabelledBy(o.getId());},0);};b.prototype.getNavigationRoot=function(){return this.getDomRef("listUl");};b.prototype.getFocusDomRef=function(){return this.getNavigationRoot();};b.prototype._startItemNavigation=function(i){if(!sap.ui.Device.system.desktop){return;}var k=this.getKeyboardMode(),K=sap.m.ListKeyboardMode;if(k==K.Edit&&!this.getItems(true).length){return;}if(i&&!this.getNavigationRoot().contains(document.activeElement)){this._bItemNavigationInvalidated=true;return;}if(!this._oItemNavigation){this._oItemNavigation=new I();this._oItemNavigation.setCycling(false);this.addEventDelegate(this._oItemNavigation);var t=(k==K.Edit)?-1:0;this._setItemNavigationTabIndex(t);this._oItemNavigation.setTableMode(true,true).setColumns(1);this._oItemNavigation.setDisabledModifiers({sapnext:["alt"],sapprevious:["alt"]});}this._oItemNavigation.setPageSize(this.getGrowingThreshold());var n=this.getNavigationRoot();this._oItemNavigation.setRootDomRef(n);this.setNavigationItems(this._oItemNavigation,n);this._bItemNavigationInvalidated=false;};b.prototype.setNavigationItems=function(i,n){var N=q(n).children(".sapMLIB").get();i.setItemDomRefs(N);if(i.getFocusedIndex()==-1){if(this.getGrowing()&&this.getGrowingDirection()==sap.m.ListGrowingDirection.Upwards){i.setFocusedIndex(N.length-1);}else{i.setFocusedIndex(0);}}};b.prototype.getItemNavigation=function(){return this._oItemNavigation;};b.prototype._setItemNavigationTabIndex=function(t){if(this._oItemNavigation){this._oItemNavigation.iActiveTabIndex=t;this._oItemNavigation.iTabIndex=t;}};b.prototype.setKeyboardMode=function(k){this.setProperty("keyboardMode",k,true);if(this.isActive()){var t=(k==sap.m.ListKeyboardMode.Edit)?-1:0;this.$("listUl").prop("tabIndex",t);this.$("after").prop("tabIndex",t);this._setItemNavigationTabIndex(t);}return this;};b.prototype.setItemFocusable=function(o){if(!this._oItemNavigation){return;}var i=this._oItemNavigation.getItemDomRefs();var c=i.indexOf(o.getDomRef());if(c>=0){this._oItemNavigation.setFocusedIndex(c);}};b.prototype.forwardTab=function(f){this._bIgnoreFocusIn=true;this.$(f?"after":"before").focus();};b.prototype.onsaptabnext=function(e){if(e.isMarked()||this.getKeyboardMode()==sap.m.ListKeyboardMode.Edit){return;}if(e.target.id==this.getId("nodata")){this.forwardTab(true);e.setMarked();}};b.prototype.onsaptabprevious=function(e){if(e.isMarked()||this.getKeyboardMode()==sap.m.ListKeyboardMode.Edit){return;}var t=e.target.id;if(t==this.getId("nodata")){this.forwardTab(false);}else if(t==this.getId("trigger")){this.focusPrevious();e.preventDefault();}};b.prototype._navToSection=function(f){var t;var i=0;var s=f?1:-1;var c=this._aNavSections.length;this._aNavSections.some(function(S,d){var e=q.sap.domById(S);if(e&&e.contains(document.activeElement)){i=d;return true;}});var o=this.getItemsContainerDomRef();var $=q.sap.byId(this._aNavSections[i]);if($[0]===o&&this._oItemNavigation){$.data("redirect",this._oItemNavigation.getFocusedIndex());}this._aNavSections.some(function(){i=(i+s+c)%c;t=q.sap.byId(this._aNavSections[i]);if(t[0]===o&&this._oItemNavigation){var r=t.data("redirect");var d=this._oItemNavigation.getItemDomRefs();var T=d[r]||o.children[0];t=q(T);}if(t.is(":focusable")){t.focus();return true;}},this);return t;};b.prototype.onsapshow=function(e){if(e.isMarked()||e.which==q.sap.KeyCodes.F4||e.target.id!=this.getId("trigger")&&!q(e.target).hasClass(this.sNavItemClass)){return;}if(this._navToSection(true)){e.preventDefault();e.setMarked();}};b.prototype.onsaphide=function(e){if(e.isMarked()||e.target.id!=this.getId("trigger")&&!q(e.target).hasClass(this.sNavItemClass)){return;}if(this._navToSection(false)){e.preventDefault();e.setMarked();}};b.prototype.onkeydown=function(e){var c=(e.which==q.sap.KeyCodes.A)&&(e.metaKey||e.ctrlKey);if(e.isMarked()||!c||!q(e.target).hasClass(this.sNavItemClass)){return;}e.preventDefault();if(this.getMode()!==sap.m.ListMode.MultiSelect){return;}if(this.isAllSelectableSelected()){this.removeSelections(false,true);}else{this.selectAll(true);}e.setMarked();};b.prototype.onmousedown=function(e){if(this._bItemNavigationInvalidated){this._startItemNavigation();}};b.prototype.focusPrevious=function(){if(!this._oItemNavigation){return;}var n=this._oItemNavigation.getItemDomRefs();var i=this._oItemNavigation.getFocusedIndex();var $=q(n[i]);var r=$.control(0)||{};var t=r.getTabbables?r.getTabbables():$.find(":sapTabbable");var f=t.eq(-1).add($).eq(-1);this.iAnnounceDetails=2;f.focus();};b.prototype.onfocusin=function(e){if(this._bIgnoreFocusIn){this._bIgnoreFocusIn=false;e.stopImmediatePropagation(true);return;}if(this._bItemNavigationInvalidated){this._startItemNavigation();}if(e.isMarked()||!this._oItemNavigation||this.getKeyboardMode()==sap.m.ListKeyboardMode.Edit||e.target.id!=this.getId("after")){return;}this.focusPrevious();e.setMarked();};b.prototype.onsapfocusleave=function(e){if(!this.iAnnounceDetails&&this._oItemNavigation&&!this.getNavigationRoot().contains(e.target)){this.iAnnounceDetails=1;}};b.prototype.onItemArrowUpDown=function(o,e){var i=this.getItems(true),c=i.indexOf(o)+(e.type=="sapup"?-1:1),d=i[c];if(d&&d.isGroupHeader()){d=i[c+(e.type=="sapup"?-1:1)];}if(!d){return;}var t=d.getTabbables(),f=o.getTabbables().index(e.target),E=t.eq(t[f]?f:-1);E[0]?E.focus():d.focus();e.preventDefault();e.setMarked();};return b;},true);
