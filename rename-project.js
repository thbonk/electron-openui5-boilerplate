/**
 * Renames and replaces placeholders in the project files
 * according to the attributes in the file package.json.
 *
 * @Author: Thomas Bonk
 * @Email:  thomas@meandmymac.de
 * @Filename: rename-project.js
 * 
 * Copyright (C) Thomas Bonk.
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

//var replaceInFile = require("replace-in-file");

const APPNAME_PLACEHOLDER = "${APPNAME}";
const DESCRIPTION_PLACEHOLDER = "${DESCRIPTION}";
const UI5_APP_NAMESPACE_PLACEHOLDER = "${UI5_APP_NAMESPACE}";
const REPOSITORY_URL_PLACEHOLDER = "${REPOSITORY_URL}";
const AUTHOR_PLACEHOLDER = "${AUTHOR}";
const EMAIL_PLACEHOLDER ="${EMAIL}";

const FILES_TO_PROCESS = ["./index.html", "./main.js", "./package-lock.json"];
const PACKAGE_FILENAME = "./package.json";

function readAndValidatePackageFile(packageFilename) {
    var data = {"attribute": "value"};

    return data;
}

(function() {
    var package = readAndValidatePackageFile(PACKAGE_FILENAME);
})();
