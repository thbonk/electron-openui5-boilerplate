/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library","sap/ui/core/Renderer","./ListItemBaseRenderer"],function(c,R,L){"use strict";var T=c.TextDirection;var I=R.extend(L);I.renderLIAttributes=function(r,l){r.addClass("sapMILI");};I.renderLIContent=function(r,l){var s=l.getLabel();if(s){var a=l.getId()+"-label",b=l.getLabelTextDirection();r.write('<span id="'+a+'" class="sapMILILabel"');if(b!==T.Inherit){r.writeAttribute("dir",b.toLowerCase());}r.write('>');r.writeEscaped(s);r.write('</span>');}r.write('<div class="sapMILIDiv sapMILI-CTX">');l.getContent().forEach(function(C){if(a&&C.addAriaLabelledBy&&C.getAriaLabelledBy().indexOf(a)==-1){C.addAssociation("ariaLabelledBy",a,true);}r.renderControl(C);});r.write('</div>');};return I;},true);
