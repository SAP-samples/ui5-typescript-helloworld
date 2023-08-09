/* eslint-disable @typescript-eslint/no-floating-promises */
import opaTest from "sap/ui/test/opaQunit";
import AppPage from "./pages/AppPage";

const onTheAppPage = new AppPage();

QUnit.module("Hello");

opaTest("Should open the Hello dialog", function () {
	// Arrangements
	onTheAppPage.iStartMyUIComponent({
		componentConfig: {
			name: "ui5.typescript.helloworld"
		}
	});

	//Actions
	onTheAppPage.iPressTheSayHelloWithDialogButton();

	// Assertions
	onTheAppPage.iShouldSeeTheHelloDialog();

	//Actions
	onTheAppPage.iPressTheOkButtonInTheDialog();

	// Assertions
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

	//Actions
	onTheAppPage.iPressTheSayHelloWithDialogButton()
		.and.iPressTheOkButtonInTheDialog();

	// Assertions
	onTheAppPage.iShouldNotSeeTheHelloDialog();

	// Cleanup
	onTheAppPage.iTeardownMyApp();
});
