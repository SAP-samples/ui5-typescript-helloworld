sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit test suite for TSTodos",
		defaults: {
			page: "ui5://test-resources/ui5/typescript/helloworld/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 1
			},
			ui5: {
				theme: "sap_horizon"
			},
			loader: {
				paths: {
					"ui5/typescript/helloworld": "../",
					"integration": "./integration",
					"unit": "./unit"
				}
			}
		},
		tests: {
			"unit/unitTests": {
				title: "Retrieving message toast elements with OPA5"
			},
			"integration/opaTests": {
				title: "Retrieving message toast elements with OPA5"
			},
		}
	};
});