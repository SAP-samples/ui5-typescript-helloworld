import AppController from "ui5/typescript/helloworld/controller/App.controller";
import QUnit from "sap/ui/thirdparty/qunit-2";

QUnit.module("Sample App controller test");

QUnit.test("The AppController class has a sayHello method", function (assert) {
    // as a very basic test example just check the presence of the "sayHello" method
    assert.strictEqual(typeof AppController.prototype.sayHello, "function");
});
