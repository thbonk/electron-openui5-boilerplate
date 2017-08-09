/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides useful string operations not available in pure JavaScript.
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";

	/**
	 * Checks whether a given <code>sString</code> ends with <code>sEndString</code>
	 * respecting the case of the strings.
	 *
	 * @param {string} sString String to be checked
	 * @param {string} sEndString The end string to be searched
	 * @returns {boolean} Whether <code>sString</code> ends with <code>sEndString</code>
	 * @see jQuery.sap.endsWithIgnoreCase
	 * @public
	 */
	jQuery.sap.endsWith = function endsWith(sString, sEndString) {
		if (typeof (sEndString) != "string" || sEndString == "") {
			return false;
		}
		var iPos = sString.lastIndexOf(sEndString);
		return iPos >= 0 && iPos == sString.length - sEndString.length;
	};

	/**
	 * Checks whether a given <code>sString</code> ends with <code>sEndString</code>
	 * ignoring the case of the strings.
	 *
	 * @param {string} sString String to be checked
	 * @param {string} sEndString The end string to be searched
	 * @returns {boolean} Whether <code>sString</code> ends with <code>sEndString</code>
	 * @see jQuery.sap.endsWith
	 * @public
	 */
	jQuery.sap.endsWithIgnoreCase = function endsWithIgnoreCase(sString, sEndString) {
		if (typeof (sEndString) != "string" || sEndString == "") {
			return false;
		}
		sString = sString.toUpperCase();
		sEndString = sEndString.toUpperCase();
		return jQuery.sap.endsWith(sString,sEndString);
	};

	/**
	 * Checks whether a given <code>sString</code> starts with <code>sStartString</code>
	 * respecting the case of the strings.
	 *
	 * @param {string} sString String to be checked
	 * @param {string} sStartString The start string to be searched
	 * @returns {boolean} Whether <code>sString</code> starts with <code>sStartString</code>
	 * @see jQuery.sap.startsWithIgnoreCase
	 * @public
	 */
	jQuery.sap.startsWith = function startsWith(sString, sStartString) {
		if (typeof (sStartString) != "string" || sStartString == "") {
			return false;
		}
		if (sString == sStartString) {
			return true;
		}
		return sString.indexOf(sStartString) == 0;
	};

	/**
	 * Checks whether a given <code>sString</code> starts with <code>sStartString</code>
	 * ignoring the case of both strings.
	 *
	 * @param {string} sString String to be checked
	 * @param {string} sStartString The start string to be searched
	 * @returns {boolean} Whether <code>sString</code> starts with <code>sStartString</code>
	 * @see jQuery.sap.startsWith
	 * @public
	 */
	jQuery.sap.startsWithIgnoreCase = function startsWithIgnoreCase(sString, sStartString) {
		if (typeof (sStartString) != "string" || sStartString == "") {
			return false;
		}
		sString = sString.toUpperCase();
		sStartString = sStartString.toUpperCase();
		return jQuery.sap.startsWith(sString,sStartString);
	};

	/**
	 * Converts one character of the string to upper case, at a given position.
	 *
	 * If no position is given or when it is negative or beyond the last character
	 * of <code>sString</code>, then the first character will be converted to upper case.
	 * The first character position is 0.
	 *
	 * @param {string} sString String for which one character should be converted
	 * @param {int} iPos Position of the character that should be converted
	 * @returns {string} String with the converted character
	 * @public
	 * @SecPassthrough {0|return}
	 */
	jQuery.sap.charToUpperCase = function charToUpperCase(sString,iPos) {
		if (!sString) {
			return sString;
		}
		if (!iPos || isNaN(iPos) || iPos <= 0 || iPos >= sString.length) {
			iPos = 0;
		}
		var sChar = sString.charAt(iPos).toUpperCase();
		if (iPos > 0) {
			return sString.substring(0,iPos) + sChar + sString.substring(iPos + 1);
		}
		return sChar + sString.substring(iPos + 1);
	};

	/**
	 * Pads a string on the left side until is has at least the given length.
	 *
	 * The method always adds full copies of <code>sPadChar</code> to the given string.
	 * When <code>sPadChar</code> has a length > 1, the length of the returned string
	 * actually might be greater than <code>iLength</code>.
	 *
	 * @param {string} sString String to be padded
	 * @param {string} sPadChar Char to use for the padding
	 * @param {int} iLength Target length of the string
	 * @returns {string} The padded string
	 * @public
	 * @SecPassthrough {0 1|return}
	 */
	jQuery.sap.padLeft = function padLeft(sString, sPadChar, iLength) {
		jQuery.sap.assert(typeof sPadChar === 'string' && sPadChar, "padLeft: sPadChar must be a non-empty string");
		if (!sString) {
			sString = "";
		}
		while (sString.length < iLength) {
			sString = sPadChar + sString;
		}
		return sString;
	};

	/**
	 * Pads a string on the right side until is has at least the given length.
	 *
	 * The method always adds full copies of <code>sPadChar</code> to the given string.
	 * When <code>sPadChar</code> has a length > 1, the length of the returned string
	 * actually might be greater than <code>iLength</code>.
	 *
	 * @param {string} sString String to be padded
	 * @param {string} sPadChar Char to use for the padding
	 * @param {int} iLength Target length of the string
	 * @returns {string} The padded string
	 * @public
	 * @SecPassthrough {0 1|return}
	 */
	jQuery.sap.padRight = function padRight(sString, sPadChar, iLength) {
		jQuery.sap.assert(typeof sPadChar === 'string' && sPadChar, "padRight: sPadChar must be a non-empty string");
		if (!sString) {
			sString = "";
		}
		while (sString.length < iLength) {
			sString = sString + sPadChar;
		}
		return sString;
	};


	var rCamelCase = /-(.)/ig;

	/**
	 * Transforms a hyphen separated string to a camel case string.
	 *
	 * @param {string} sString Hyphen separated string
	 * @returns {string} The transformed string
	 * @since 1.7.0
	 * @public
	 * @SecPassthrough {0|return}
	 */
	jQuery.sap.camelCase = function camelCase(sString) {
		return sString.replace( rCamelCase, function( sMatch, sChar ) {
			return sChar.toUpperCase();
		});
	};


	var rHyphen = /([A-Z])/g;

	/**
	 * Transforms a camel case string into a hyphen separated string.
	 *
	 * @param {string} sString camel case string
	 * @returns {string} The transformed string
	 * @since 1.15.0
	 * @public
	 * @SecPassthrough {0|return}
	 */
	jQuery.sap.hyphen = function hyphen(sString) {
		return sString.replace( rHyphen, function(sMatch, sChar) {
			return "-" + sChar.toLowerCase();
		});
	};


	var rEscapeRegExp = /[[\]{}()*+?.\\^$|]/g;

	/**
	 * Escapes all characters that would have a special meaning in a regular expression.
	 *
	 * This method can be used when a string with arbitrary content has to be integrated
	 * into a regular expression and when the whole string should match literally.
	 *
	 * Example:
	 * <pre>
	 *   var text = "E=m*c^2"; // text to search
	 *   var search = "m*c";   // text to search for
	 *
	 *   text.match( new RegExp(                         search  ) ); // [ "c" ]
	 *   text.match( new RegExp( jQuery.sap.escapeRegExp(search) ) ); // [ "m*c" ]
	 * </pre>
	 *
	 * @param {string} sString String to escape
	 * @returns {string} The escaped string
	 * @since 1.9.3
	 * @public
	 * @SecPassthrough {0|return}
	 */
	jQuery.sap.escapeRegExp = function escapeRegExp(sString) {
		return sString.replace(rEscapeRegExp, "\\$&");
	};

	/**
	 * Creates a string from a pattern by replacing placeholders with concrete values.
	 *
	 * The syntax of the pattern is inspired by (but not fully equivalent to) the
	 * java.util.MessageFormat.
	 *
	 * Placeholders have the form <code>{ integer }</code>, where any occurrence of
	 * <code>{0}</code> is replaced by the value with index 0 in <code>aValues</code>,
	 * <code>{1}</code> by the value with index 1 in <code>aValues</code> etc.
	 *
	 * To avoid interpretation of curly braces as placeholders, any non-placeholder fragment
	 * of the pattern can be enclosed in single quotes. The surrounding single quotes will be
	 * omitted from the result. Single quotes that are not meant to escape a fragment and
	 * that should appear in the result, need to be doubled. In the result, only a single
	 * single quote will occur.
	 *
	 * Example Pattern Strings:
	 * <pre>
	 *   jQuery.sap.formatMessage("Say {0}",     ["Hello"]) -> "Say Hello"    // normal use case
	 *   jQuery.sap.formatMessage("Say '{0}'",   ["Hello"]) -> "Say {0}"      // escaped placeholder
	 *   jQuery.sap.formatMessage("Say ''{0}''", ["Hello"]) -> "Say 'Hello'"  // doubled single quote
	 *   jQuery.sap.formatMessage("Say '{0}'''", ["Hello"]) -> "Say {0}'"     // doubled single quote in quoted fragment
	 * </pre>
	 *
	 * In contrast to java.util.MessageFormat, format types or format styles are not supported.
	 * Everything after the argument index and up to the first closing curly brace is ignored.
	 * Nested placeholders (as supported by java.lang.MessageFormat for the format type choice)
	 * are not ignored but reported as a parse error.
	 *
	 * This method throws an Error when the pattern syntax is not fulfilled (e.g. unbalanced curly
	 * braces, nested placeholders or a non-numerical argument index).
	 *
	 * This method can also be used as a formatter within a binding. The first part of a composite binding
	 * will be used as pattern, the following parts as aValues. If there is only one value and this
	 * value is an array it will be handled like the default described above.
	 *
	 * @param {string} sPattern A pattern string in the described syntax
	 * @param {any[]} [aValues=[]] The values to be used instead of the placeholders.
	 *
	 * @returns {string} The formatted result string
	 * @since 1.12.5
	 * @SecPassthrough {*|return}
	 * @public
	 */
	jQuery.sap.formatMessage = function formatMessage(sPattern, aValues) {
		jQuery.sap.assert(typeof sPattern === "string" || sPattern instanceof String, "pattern must be string");
		if (arguments.length > 2 || (aValues != null && !Array.isArray(aValues))) {
			aValues = Array.prototype.slice.call(arguments,1);
		}
		aValues = aValues || [];
		return sPattern.replace(rMessageFormat, function($0,$1,$2,$3,offset) {
			if ( $1 ) {
				// a doubled single quote in a normal string fragment
				//   --> emit a single quote
				return "'";
			} else if ( $2 ) {
				// a quoted sequence of chars, potentially containing doubled single quotes again
				//   --> emit with doubled single quotes replaced by a single quote
				return $2.replace(/''/g, "'");
			} else if ( $3 ) {
				// a welformed curly brace
				//   --> emit the argument but ignore other parameters
				return String(aValues[parseInt($3, 10)]);
			}
			// e.g. malformed curly braces
			//   --> throw Error
			throw new Error("formatMessage: pattern syntax error at pos. " + offset);
		});
	};

	/**
	 * Pattern to analyze MessageFormat strings.
	 *
	 * Group 1: captures doubled single quotes within the string
	 * Group 2: captures quoted fragments within the string.
	 *            Note that java.util.MessageFormat silently forgives a missing single quote at
	 *            the end of a pattern. This special case is handled by the RegEx as well.
	 * Group 3: captures placeholders
	 *            Checks only for numerical argument index, any remainder is ignored up to the next
	 *            closing curly brace. Nested placeholdes are not accepted!
	 * Group 4: captures any remaining curly braces and indicates syntax errors
	 *
	 *                    [-1] [----- quoted string -----] [------ placeholder ------] [--]
	 * @private
	 */
	var rMessageFormat = /('')|'([^']+(?:''[^']*)*)(?:'|$)|\{([0-9]+(?:\s*,[^{}]*)?)\}|[{}]/g;

	return jQuery;

});
