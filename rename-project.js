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

const APPNAME_PLACEHOLDER = "APPNAME_PLACEHOLDER";
const DESCRIPTION_PLACEHOLDER = "DESCRIPTION_PLACEHOLDER";
const UI5_APP_NAMESPACE_PLACEHOLDER = "UI5_APP_NAMESPACE_PLACEHOLDER";
const REPOSITORY_URL_PLACEHOLDER = "REPOSITORY_URL_PLACEHOLDER";
const AUTHOR_PLACEHOLDER = "AUTHOR_PLACEHOLDER";
const EMAIL_PLACEHOLDER = "EMAIL_PLACEHOLDER";

const FILES_TO_PROCESS = [
    "./index.html", 
    "./main.js", 
    "./package-lock.json",
    "./app/**"
];
const PACKAGE_FILENAME = "./package.json";

(function () {
    try {
        var packageData = readAndValidatePackageFile(PACKAGE_FILENAME);

        replacePlaceholdersInFiles(
            FILES_TO_PROCESS,
            packageData.name,
            packageData.description,
            packageData.namespace,
            packageData.repository.url,
            packageData.author,
            packageData.email);
    } catch (err) {
        console.log(`${err}\n`);
    }
})();

function replacePlaceholdersInFiles(filenames, name, description, namespace, repositoryUrl, author, email) {
    const replace = require("replace-in-file");
    const options = {
        files: filenames,

        from: [
            /APPNAME_PLACEHOLDER/g,
            /DESCRIPTION_PLACEHOLDER/g,
            /UI5_APP_NAMESPACE_PLACEHOLDER/g,
            /REPOSITORY_URL_PLACEHOLDER/g,
            /AUTHOR_PLACEHOLDER/g,
            /EMAIL_PLACEHOLDER/g
        ],
        to: [name, description, namespace, repositoryUrl, author, email],

        allowEmptyPaths: false,
        encoding: 'utf8'
    };
    const changedFiles = replace.sync(options);

    console.log('\n\nModified files:\n', changedFiles.join('\n'), '\n');
}

function readAndValidatePackageFile(packageFilename) {
    var packageData = require(packageFilename);

    validatePackageData(packageData);

    return packageData;
}

function validatePackageData(packageData) {
    checkOrThrow(packageData.name !== APPNAME_PLACEHOLDER,
        "Please set the attribute >name< in the file package.json");
    checkOrThrow(packageData.description !== DESCRIPTION_PLACEHOLDER,
        "Please set the attribute >description< in the file package.json");
    checkOrThrow(packageData.namespace !== UI5_APP_NAMESPACE_PLACEHOLDER,
        "Please set the attribute >namespace< in the file package.json");
    checkOrThrow(packageData.repository.url !== REPOSITORY_URL_PLACEHOLDER,
        "Please set the attribute >repository.url< in the file package.json");
    checkOrThrow(packageData.author !== AUTHOR_PLACEHOLDER,
        "Please set the attribute >author< in the file package.json");
    checkOrThrow(packageData.email !== EMAIL_PLACEHOLDER,
        "Please set the attribute >email< in the file package.json");
}

function checkOrThrow(condition, message) {
    if (!condition) {
        throw message;
    }
}