/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var P={};P.getPastedDataAs2DArray=function(e){var c=e.clipboardData;if(!c){c=window.clipboardData;}var r=/sapui5Placeholder4MultiLine/g;var p=r.source;var a=/""/g;var d,D,R,b=[];if(c){d=c.getData('Text');var C=[];var m=false;var f=d.indexOf("\""),g=-1;var h,k;while(f>-1){k=d.charAt(f-1);if((f===0)||(k==='\n')||(k==='\t')||(k==='\r')){g=d.indexOf("\"",f+1);if(g>-1){h=d.charAt(g+1);while((g>-1)&&(h==='\"')){g=d.indexOf("\"",g+2);h=d.charAt(g+1);}if((h==='\n')||(h==='\t')||(h==='')||(h==='\r')){var M=d.substring(f+1,g);d=d.replace("\""+M+"\"",p);M=M.replace(a,"\"");C.push(M);f=d.indexOf("\"",f+p.length+1);m=true;}}}if(!m){f=d.indexOf("\"",f+1);}m=false;}D=d.split(/\r\n|\r|\n/);var j=0;var G=function(){return C[j++];};for(var i=0;i<D.length;i++){R=D[i];if(C.length>0){R=R.replace(r,G);}if(R.length||i<D.length-1){b.push(R.split("\t"));}}}return b;};return P;});
