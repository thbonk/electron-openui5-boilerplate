/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var F={};F.render=function(r,f){r.write('<DIV');r.writeControlData(f);r.addClass('sapUiFeed');r.writeClasses();r.write('>');r.renderControl(f.oFeeder);r.write('<HEADER class=sapUiFeedTitle ><H4>');var t=f.getTitle();if(!t||t==""){t=f.rb.getText('FEED_TITLE');}r.writeEscaped(t);if(f.oToolsButton){r.renderControl(f.oToolsButton);}r.renderControl(f.oLiveButton);r.write('</H4>');r.write('<DIV class="sapUiFeedToolbar" >');r.renderControl(f.oFilter);r.renderControl(f.oSearchField);r.write('</DIV>');r.write('</HEADER>');r.write('<SECTION>');for(var i=0;i<f.getChunks().length;i++){var c=f.getChunks()[i];r.renderControl(c);}r.write('</SECTION>');r.write('</DIV>');};return F;},true);
