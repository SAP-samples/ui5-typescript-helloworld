sap.ui.define(function () {
	"use strict";

	return {
		name: "Testsuite for the TypesScript Hello World app",
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
				title: "QUnit test suite for the TypesScript Hello World app"
			},
			"integration/opaTests": {
				title: "Integration tests for the TypeScript Hello World app"
			},
		}
	};
});