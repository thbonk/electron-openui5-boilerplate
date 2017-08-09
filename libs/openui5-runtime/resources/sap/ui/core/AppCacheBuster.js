/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/ManagedObject','./Core','sap/ui/thirdparty/URI'],function(q,M,C,U){"use strict";var c=sap.ui.getCore().getConfiguration();var l=c.getLanguage();var s=c.getAppCacheBusterMode()==="sync";var b=c.getAppCacheBusterMode()==="batch";var S={index:{},active:false};var a,v,d,f;var L=document.location.href.replace(/\?.*|#.*/g,"");var u=U(q.sap.getModulePath("","/../"));var o=u.toString();if(u.is("relative")){u=u.absoluteTo(L);}var B=u.normalize().toString();var r=U("resources").absoluteTo(B).toString();var F=new RegExp("^"+q.sap.escapeRegExp(r));var E=function(e){if(e.length>0&&e.slice(-1)!=="/"){e+="/";}return e;};var R=function(B,e){var i=S.index;var g;var j;var k;if(Array.isArray(B)&&!b){B.forEach(function(y){R(y,e);});}else if(Array.isArray(B)&&b){var m=E(B[0]);var n=[];q.sap.log.debug("sap.ui.core.AppCacheBuster.register(\""+m+"\"); // BATCH MODE!");var p=A.normalizeURL(m);q.sap.log.debug("  --> normalized to: \""+p+"\"");B.forEach(function(y){j=E(y);var z=A.normalizeURL(j);if(!i[k]){n.push(z);}});if(n.length>0){var j=p+"sap-ui-cachebuster-info.json?sap-ui-language="+l;g={url:j,type:"POST",async:!s&&!!e,dataType:"json",contentType:"text/plain",data:n.join("\n"),success:function(y){A.onIndexLoaded(j,y);q.extend(i,y);},error:function(){q.sap.log.error("Failed to batch load AppCacheBuster index file from: \""+j+"\".");}};}}else{B=E(B);q.sap.log.debug("sap.ui.core.AppCacheBuster.register(\""+B+"\");");k=A.normalizeURL(B);q.sap.log.debug("  --> normalized to: \""+k+"\"");if(!i[k]){var j=k+"sap-ui-cachebuster-info.json?sap-ui-language="+l;g={url:j,async:!s&&!!e,dataType:"json",success:function(y){A.onIndexLoaded(j,y);i[k]=y;},error:function(){q.sap.log.error("Failed to load AppCacheBuster index file from: \""+j+"\".");}};}}if(g){var I=A.onIndexLoad(g.url);if(I!=null){q.sap.log.info("AppCacheBuster index file injected for: \""+j+"\".");g.success(I);}else{if(g.async){var t=e.startTask("load "+j);var w=g.success,x=g.error;q.extend(g,{success:function(y){w.apply(this,arguments);e.finishTask(t);},error:function(){x.apply(this,arguments);e.finishTask(t,false);}});}q.sap.log.info("Loading AppCacheBuster index file from: \""+j+"\".");q.ajax(g);}}};var A={boot:function(e){var g=c.getAppCacheBuster();if(g&&g.length>0){g=g.slice();var i=true;var V=String(g[0]).toLowerCase();if(g.length===1){if(V==="true"||V==="x"){var u=U(o);g=u.is("relative")?[u.toString()]:[];}else if(V==="false"){i=false;}}if(i){A.init();R(g,e);}}},init:function(){S.active=true;a=q.ajax;v=M.prototype.validateProperty;d=Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype,"src");f=Object.getOwnPropertyDescriptor(HTMLLinkElement.prototype,"href");var g=A.convertURL;var n=A.normalizeURL;var i=function(e){if(this.active===true&&e&&typeof(e)==="string"){e=n(e);return!e.match(F);}return false;}.bind(S);q.ajax=function(e,k){if(e&&e.url&&i(e.url)){e.url=g(e.url);}return a.apply(this,arguments);};M.prototype.validateProperty=function(p,V){var m=this.getMetadata(),P=m.getProperty(p),k;if(P&&P.type==="sap.ui.core.URI"){k=Array.prototype.slice.apply(arguments);try{if(i(k[1])){k[1]=g(k[1]);}}catch(e){}}return v.apply(this,k||arguments);};var j=function(e){var k={get:e.get,set:function(m){if(i(m)){m=g(m);}e.set.call(this,m);},enumerable:e.enumerable,configurable:e.configurable};k.set._sapUiCoreACB=true;return k;};Object.defineProperty(HTMLScriptElement.prototype,"src",j(d));Object.defineProperty(HTMLLinkElement.prototype,"href",j(f));},exit:function(){q.ajax=a;M.prototype.validateProperty=v;var e;if((e=Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype,"src"))&&e.set&&e.set._sapUiCoreACB===true){Object.defineProperty(HTMLScriptElement.prototype,"src",d);}if((e=Object.getOwnPropertyDescriptor(HTMLLinkElement.prototype,"href"))&&e.set&&e.set._sapUiCoreACB===true){Object.defineProperty(HTMLLinkElement.prototype,"href",f);}S.index={};S.active=false;S={index:{},active:false};},register:function(B){R(B);},convertURL:function(e){q.sap.log.debug("sap.ui.core.AppCacheBuster.convertURL(\""+e+"\");");var i=S.index;if(i&&e){var n=A.normalizeURL(e);q.sap.log.debug("  --> normalized to: \""+n+"\"");if(n&&A.handleURL(n)){q.each(i,function(B,m){var g;if(B&&n.length>=B.length&&n.slice(0,B.length)===B){g=n.slice(B.length);if(m[g]){e=B+"~"+m[g]+"~/"+g;q.sap.log.debug("  ==> rewritten to \""+e+"\";");return false;}}});}}return e;},normalizeURL:function(e){var u=U(e||"./");if(u.is("relative")){u=u.absoluteTo(L);}return u.normalizeProtocol().normalizeHostname().normalizePort().normalizePath().toString();},handleURL:function(e){return true;},onIndexLoad:function(e){return null;},onIndexLoaded:function(e,i){}};var h=c.getAppCacheBusterHooks();if(h){["handleURL","onIndexLoad","onIndexLoaded"].forEach(function(e){if(typeof h[e]==="function"){A[e]=h[e];}});}return A;},true);
