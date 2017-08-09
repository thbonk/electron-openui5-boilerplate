/**
 * UI5 Application component.
 *
 * @Author: APPNAME_PLACEHOLDER
 * @Email:  EMAIL_PLACEHOLDER
 * @Filename: Component.js
 * 
 * Copyright (C) AUTHOR_PLACEHOLDER.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/UIComponent"
], function (jQuery, UIComponent) {

    "use strict";

    return UIComponent.extend("UI5_APP_NAMESPACE_PLACEHOLDER.app.Component", {

        metadata: {
            manifest: "json"
        },
        
        init: function () {

            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
        }
    });
});