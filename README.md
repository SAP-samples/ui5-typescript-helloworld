# A Small TypeScript UI5 Example App with Tests

**This `testing` branch demonstrates how UI5 tests are best written in TypeScript.** 
> In general, this "hello world" app demonstrates a TypeScript setup for developing UI5 applications. For documentation regarding the general setup, please see the [`main` branch](https://github.com/SAP-samples/ui5-typescript-helloworld/tree/main) of this repository. For general UI5 TypeScript information go to https://sap.github.io/ui5-typescript.

### **TL;DR** - Summary

The two *structural* code differences to writing tests in *JavaScript* are:
1. The **OPA Pages are simply classes extending `Opa5`, having the actions and assertions as class methods**.
2. The **OPA Journeys do not use the `Given`/`When`/`Then` objects, but call actions and assertions directly on the Page objects**. 

This simplifies the test code a lot and at the same time avoids type complications in TypeScript caused by OPA APIs not fitting a typed language. 
All other testing code is converted from JavaScript in the same way as regular application code is (i.e. using real ECMAScript classes and modules).

The one *setup* difference is in the configuration to instrument code for coverage reporting: the `istanbul` library needs to be added to the Babel config of `ui5-tooling-transpile-middleware` in `ui5.yaml`.

Details can be found below.

### NOTE

The overall test setup has been modernized by using the [`ui5-test-runner`](https://github.com/ArnaudBuchholz/ui5-test-runner) instead of deprecated `karma`.


## Running Tests

Once the project is set up (`git clone` and `npm install`, see further down), the tests can be executed either manually or in an automated way using [`ui5-test-runner`](https://github.com/ArnaudBuchholz/ui5-test-runner). The setup provides the following options:

1. *Manual execution*: use `npm start` and then execute the tests by opening the [testsuite](http://localhost:8080/test/testsuite.qunit.html) ([http://localhost:8080/test/testsuite.qunit.html](http://localhost:8080/test/testsuite.qunit.html)) in your browser. You can also directly launch the [QUnit tests](http://localhost:8080/test/Test.qunit.html?testsuite=test-resources/ui5/typescript/helloworld/testsuite.qunit&test=unit/unitTests) or the [Integration tests](http://localhost:8080/test/Test.qunit.html?testsuite=test-resources/ui5/typescript/helloworld/testsuite.qunit&test=integration/opaTests) individually.
<!-- 2. *Test-driven* development by running Karma in watch mode using `npm run karma` (which triggers the test each time a source file changes) -->
2. *Headless testing*: launch test-runner either *without* coverage reporting using `npm run test-runner` or *with* coverage using `npm run test-runner-coverage`.
While the tests are running, their status can be observed at http://localhost:8081/_/progress.html

## Writing Unit Tests (QUnit)

Writing [Unit tests (QUnit)](./webapp/test/unit/) in TypeScript is straightforward, just as you know it from JavaScript.

> Note: `QUnit` is globally defined and its types are automatically required by the UI5 types. So there is no setup needed to use it. However, in order to allow clean code that does not access any globals, starting with UI5 1.112, QUnit should be explicitly imported like this: `import QUnit from "sap/ui/thirdparty/qunit-2";`

### Declararing the integration testsuite  `webapp/test/testsuite.qunit.ts`

As required by (and documented with) the [UI5 Test Starter](https://ui5.sap.com/sdk/#/topic/22f50c0f0b104bf3ba84620880793d3f), the unit testsuite is registered in the central [testsuite configuration](webapp/test/testsuite.qunit.ts). This makes it show up in http://localhost:8080/test/testsuite.qunit.html.

### The list of tests in `webapp/test/unit/unitTests.qunit.ts`

[`webapp/test/unit/unitTests.qunit.ts`](webapp/test/unit/unitTests.qunit.ts) is the entry point which simply imports all unit tests. This is a direct translation from the [JavaScript code](https://github.com/SAP/openui5-sample-app/blob/main/webapp/test/unit/unitTests.qunit.js) to TypeScript (in this case more specifically: to ES modules).

### The actual tests in `webapp/test/unit/controller/App.qunit.ts`

In the (very minimal) actual tests in [`webapp/test/unit/controller/App.qunit.ts`](webapp/test/unit/controller/App.qunit.ts) there is nothing surprising from TypeScript perspective. There isn't any TypeScript-specific syntax required, but of course ES6-style imports are used just like in TypeScript application code. This is the only significant difference compared to the [JavaScript way](https://github.com/SAP/openui5-sample-app/blob/main/webapp/test/unit/controller/App.controller.js) of writing UI5 QUnit tests.


## Writing Integration Tests (OPA)

OPA tests are written in a simplified and slightly different way compared to JavaScript, so make sure to carefully read this section.

### Declararing the integration testsuite in `webapp/test/testsuite.qunit.ts`

Just like for the unit tests, as required by (and documented with) the [UI5 Test Starter](https://ui5.sap.com/sdk/#/topic/22f50c0f0b104bf3ba84620880793d3f), the integration testsuite is registered in the central [testsuite configuration](webapp/test/testsuite.qunit.ts). This makes it show up in http://localhost:8080/test/testsuite.qunit.html.

### The list of tests in `webapp/test/integration/opaTests.qunit.ts`

Just like for the unit tests, [`webapp/test/integration/opaTests.qunit.ts`](webapp/test/integration/opaTests.qunit.ts) imports the available tests - in this case the journeys - as ES modules.

### The "Hello" Journey

The test journey [`webapp/test/integration/HelloJourney.ts`](webapp/test/integration/HelloJourney.ts) is pretty straightforward, but it comes with one significant difference to JavaScript: the `Given`/`When`/`Then` objects normally given to the `opaTest(...)` callback are **not used at all!**<br>
Instead, the actions and assertions are called directly on the OPA test Page (in this case the `AppPage`). The same goes for setup and teardown functions like `iStartMyUIComponent` and `iTeardownMyApp`, which are also available on the Page, as it inherits from `Opa5`.

You are free to make the difference between actions and assertions clear with comments, but there is no need to carry different entities around through the code, especially as those entities are hard to fit into the TypeScript world.

### The "App" page

This is where the biggest changes are done compared to non-TypeScript OPA tests: the OPA Pages are simply classes extending `Opa5`, having the actions and assertions as class methods.

Apart from this, the implementation of the actions and assertions is done just like in JavaScript.




## Setting up this Project

1. Clone the project and switch to the `testing` branch:

   ```sh
   git clone https://github.com/SAP-samples/ui5-typescript-helloworld.git
   cd ui5-typescript-helloworld
   git checkout testing
   ```

1. Install the dependencies:

   ```sh
   npm install
   ```

1. Execute the following command to run the app locally for development in watch mode (the browser reloads the app automatically when there are changes in the source code):

   ```sh
   npm start
   ```

   As shown in the terminal after executing this command, the app is then running on http://localhost:8080/index.html. A browser window with this URL should automatically open.


## Limitations

The ways how OPA tests are written in TypeScript might still be improved further.

## Known Issues

None.

## How to Obtain Support

The sample code is provided **as-is**. No support is provided.

[Create an issue](https://github.com/SAP-samples/ui5-typescript-helloworld/issues) in this repository if you find a bug.

## License

Copyright (c) 2023-2025 SAP SE or an SAP affiliate company. All rights reserved.
This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
