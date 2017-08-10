/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	'jquery.sap.global',
	'sap/ui/base/Object'
], function(jQuery, Ui5Object) {
	"use strict";

	var Extension = Ui5Object.extend("sap.ui.core.support.RuleEngineOpaExtension", {
		metadata : {
			publicMethods : [
				"getAssertions"
			]
		},

		getAssertions : function () {
			return {
				/**
				 * Run the Support Assistant and analyze against a specific state of the application.
				 * Depending on the options passed the assertion might either fail or not if any issues were found.
				 * @param {Object} [options] The options used to configure an analysis.
				 * @param {boolean} [options.failOnAnyIssues=true] Should the test fail or not if there are issues of any severity.
				 * @param {boolean} [options.failOnHighIssues] Should the test fail or not if there are issues of high severity.
				 * This parameter will override failOnAnyIssues if set.
				 * @param {Array.<{libName:string, ruleId:string}>} [options.rules] The rules to check.
				 * @param {Object} [executionScope] The execution scope of the analysis.
				 * @param {('global'|'subtree'|'components')} [executionScope.type=global] The type of the execution scope.
				 * @param {string|string[]} [executionScope.selectors] The ids of the components or the subtree.
				*/
				noRuleFailures: function(options) {
					var ruleDeferred = jQuery.Deferred(),
						failOnAnyRuleIssues = options[0] && options[0]["failOnAnyIssues"],
						failOnHighRuleIssues = options[0] && options[0]["failOnHighIssues"],
						rules = options[0] && options[0].rules,
						executionScope = options[0] && options[0].executionScope;

					jQuery.sap.support.analyze(executionScope, rules).then(function () {
						var analysisHistory = jQuery.sap.support.getAnalysisHistory(),
							lastAnalysis = { issues: [] };

						if (analysisHistory.length) {
							lastAnalysis = analysisHistory[analysisHistory.length - 1];
						}

						var issueSummary = lastAnalysis.issues.reduce(function (summary, issue) {
							summary[issue.severity.toLowerCase()] += 1;
							return summary;
						}, { high: 0, medium: 0, low: 0 });

						var assertionResult = lastAnalysis.issues.length === 0;
						if (failOnHighRuleIssues) {
							assertionResult = issueSummary.high === 0;
						} else if (failOnAnyRuleIssues === false || failOnHighRuleIssues === false) {
							assertionResult = true;
						}

						ruleDeferred.resolve({
							result: assertionResult,
							message: "Support Assistant issues found: [High: " + issueSummary.high +
									 ", Medium: " + issueSummary.medium	+
									 ", Low: " + issueSummary.low +
									 "]",
							expected: "0 high 0 medium 0 low",
							actual: issueSummary.high + " high " + issueSummary.medium + " medium " + issueSummary.low + " low"
						});
					});

					return ruleDeferred.promise();
				},
				/**
				 * If there are issues found the assertion result will be false and a report with all the issues will be generated
				 * in the message of the test. If no issues were found the assertion result will be true and no report will
				 * be generated.
				 */
				getFinalReport: function () {
					var ruleDeferred = jQuery.Deferred();

					jQuery.sap.support.getFormattedAnalysisHistory().then(function (history) {
						var analysisHistory = jQuery.sap.support.getAnalysisHistory(),
							totalIssues = analysisHistory.reduce(function (total, analysis) {
								return total + analysis.issues.length;
							}, 0),
							result = totalIssues === 0,
							message = "Support Assistant Analysis History",
							actual = message;

						if (result) {
							message += " - no issues found";
						}

						ruleDeferred.resolve({
							result: result,
							message: message,
							actual: actual,
							expected: history
						});
					});

					return ruleDeferred.promise();
				}
			};
		}
	});

	return Extension;
});
