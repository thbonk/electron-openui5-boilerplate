# electron-openui5-boilerplate

This repository contains a boilerplate for developing 
[Electron](https://electron.atom.io) applications using
[OpenUI5](http://openui5.org).

## Prerequisits

* [node.js](https://nodejs.org/en/) => 8.2.1
* [Electron](https://electron.atom.io) => 1.6.11

## Usage

* Get the boilerplate, by either
  * downloading a release as ZIP file or
  * cloning the repository
* After downloading or cloning, rename the directory according to your application's name
* Open a terminal and `cd` into the directory
* Delete the `.git` folder, if present
  * this is necessary, since it points to the boilerplate repository on GitHub
* Open the file `package.json` and replace the following placeholders:

  Place Holder                   | Description
  -------------------------------|-----------------------------------------------------------------
  `APPNAME_PLACEHOLDER`          | Application name, must only contain characters A-Z, a-z
  `DESCRIPTION_PLACEHOLDER`      | Description of your application
  `UI5_APP_NAMESPACE_PLACEHOLDER`| Base namespace of your application that used in the OpenUI5 code
  `REPOSITORY_URL_PLACEHOLDER`   | URL of the source repository
  `AUTHOR_PLACEHOLDER`           | Your name
  `EMAIL_PLACEHOLDER`            | Your email address
  
* In the terminal, issue the following commands:
  * `npm install --only=dev`
  * `node rename-project.js`
* You're ready to go!
  * You can now delete the files `rename-project.js` and `README.md`
