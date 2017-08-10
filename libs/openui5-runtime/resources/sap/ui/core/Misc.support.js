/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/support/library"],function(q,S){"use strict";var C=S.Categories;var a=S.Severity;var A=S.Audiences;return{addRulesToRuleSet:function(r){r.addRule({id:"errorLogs",audiences:[A.Control,A.Internal],categories:[C.Performance],enabled:true,minversion:"1.32",title:"Error logs",description:"Checks for the amount of error logs in the console",resolution:"Error logs should be fixed",resolutionurls:[],check:function(i,c){var b=0,m="";var l=q.sap.log.getLog();l.forEach(function(d){if(d.level===q.sap.log.Level.ERROR){b++;if(b<=20){m+="- "+d.message+"\n";}}});i.addIssue({severity:a.Low,details:"Total error logs: "+b+"\n"+m,context:{id:"WEBPAGE"}});}});}};},true);
