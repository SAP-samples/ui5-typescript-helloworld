// @ts-ignore
window.suite = function() {

	// @ts-ignore
	var suite = new parent.jsUnitTestSuite(),
		sContextPath = location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1);

		suite.addTestPage(sContextPath + "unit/unitTests.qunit.html");
		suite.addTestPage(sContextPath + "integration/opaTests.qunit.html");

	return suite;
};