import opaTest from "sap/ui/test/opaQunit";
import AppPage from "./pages/AppPage";
import QUnit from "sap/ui/thirdparty/qunit-2";

const onTheAppPage = new AppPage();

QUnit.module("Hello");

opaTest("Should open the Hello dialog", function () {
	// Arrangements
	onTheAppPage.iStartMyUIComponent({
		componentConfig: {
			name: "ui5.typescript.helloworld"
		}
	});

	// Action
	onTheAppPage.iPressTheSayHelloWithDialogButton();

	// Assertion
	onTheAppPage.iShouldSeeTheHelloDialog();

	// Action
	onTheAppPage.iPressTheOkButtonInTheDialog();

	// Assertion
	onTheAppPage.iShouldNotSeeTheHelloDialog();

	// Cleanup
	onTheAppPage.iTeardownMyApp();
});

opaTest("Should close the Hello dialog", function () {
	// Arrangements
	onTheAppPage.iStartMyUIComponent({
		componentConfig: {
			name: "ui5.typescript.helloworld"
		}
	});

	// Actions
	onTheAppPage.iPressTheSayHelloWithDialogButton()
		.and.iPressTheOkButtonInTheDialog();

	// Assertions
	onTheAppPage.iShouldNotSeeTheHelloDialog();

	// Cleanup
	onTheAppPage.iTeardownMyApp();
});
