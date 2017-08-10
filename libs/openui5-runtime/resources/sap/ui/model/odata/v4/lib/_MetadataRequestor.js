/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","./_Helper","./_MetadataConverter"],function(q,_,a){"use strict";return{create:function(h,Q){var s=_.buildQuery(Q);return{read:function(u,S){return new Promise(function(r,R){q.ajax(S?u:u+s,{method:"GET",headers:h}).then(function(d,t,j){var J=a.convertXMLMetadata(d),l=j.getResponseHeader("Last-Modified")||j.getResponseHeader("Date");if(l){J.$LastModified=l;}r(J);},function(j,t,e){R(_.createError(j));});});}};}};},false);
