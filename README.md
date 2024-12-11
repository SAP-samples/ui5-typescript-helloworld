# A Small TypeScript UI5 Example App with Tests

This app demonstrates a TypeScript setup for developing UI5 applications. For general documentation, please see the [`main` branch](https://github.com/SAP-samples/ui5-typescript-helloworld/tree/main) of this repository.

**This `testing` branch explores how tests are best written in TypeScript.**

:construction: **WORK IN PROGRESS** :construction:

* [Unit tests (QUnit)](./webapp/test/unit/) look good: run `npm start` and open http://localhost:8080/test/unit/unitTests.qunit.html 
* OPA tests still need additional boilerplate code and do NOT represent the final state! OPA APIs do not fit a typed language very well. Type definitions as well as APIs are being improved. Nevertheless, the OPA test code in this repository does work and is streamlined to some degree. The integration tests can be run at http://localhost:8080/test/integration/opaTests.qunit.html.

## Testing

### General Setup

The tests can be executed either manually or in an automated way using Karma. The setup provides the following options:

1. *Manual execution*  using `npm start` and execute the tests by opening the [testsuite](http://localhost:8080/test/testsuite.qunit.html) in your browser (but you can also open the QUnit or Integration testsuite directly)
2. *Test-driven* development by running Karma in watch mode using `npm run karma` (which triggers the test each time a source file changes)
3. *Headless testing* by running Karma either without coverage reporting using `npm run karma-ci` or with using `npm run karma-ci-cov`

### Unit Tests (QUnit)

> Note: `QUnit` is globally defined and its types are automatically required by the UI5 types. So there is no setup needed to use it. However, in order to allow cleaner code that does not access any globals, starting with UI5 1.112, QUnit can be explicitly imported like this: `import QUnit from "sap/ui/thirdparty/qunit-2";`

#### The entry point for unit tests

The main entry point for running tests is [`webapp/test/testsuite.qunit.html`](webapp/test/testsuite.qunit.html). This file initializes the testing framework (QUnit) and serves as the consolidated starting point for all tests.

From this entry point, you can choose to run either unit or integration tests. When the **unit/unitTests** link is selected, the UI5 framework is launched, and it loads the list of test cases specified in [`webapp/test/unit/unitTests.qunit.ts`](webapp/test/unit/unitTests.qunit.ts). A shortcut to launch directly the unit tests is `/test/Test.qunit.html?testsuite=test-resources/ui5/typescript/helloworld/testsuite.qunit&test=unit/unitTests`

#### The list of tests in `webapp/test/unit/unitTests.qunit.ts`

[`webapp/test/unit/unitTests.qunit.ts`](webapp/test/unit/unitTests.qunit.ts) imports all test files, which can be done in a very clean way thanks to the ES6 module imports.

#### The concrete tests in `webapp/test/unit/controller/App.qunit.ts`

In the (very minimal) actual tests in [`webapp/test/unit/controller/App.qunit.ts`](webapp/test/unit/controller/App.qunit.ts) there is nothing surprising from TypeScript perspective. There isn't any TypeScript-specific syntax required, but of course ES6-style imports are used just like in the application code.

### Integration Tests (OPA)

**IMPORTANT:**
*The OPA tests in TypeScript are experimental work in progress! This means they **do** work as shown in this sample project, **but** the UI5 team is working on making the OPA APIs work better with TypeScript. Therefore, it is expected that the recommended way of writing OPA tests in TypeScript will change and be simplified over time!*

#### The entry point and the list of tests

Just like for the unit tests, [`webapp/test/testsuite.qunit.html`](webapp/test/testsuite.qunit.html) is the entry point for running the OPA tests, which loads the list of journeys configured in [`webapp/test/integration/opaTests.qunit.ts`](webapp/test/integration/opaTests.qunit.ts). Select the **integration/opaTests** option to run the OPA tests in a separate window or use the following URL: `/test/Test.qunit.html?testsuite=test-resources/ui5/typescript/helloworld/testsuite.qunit&test=integration/opaTests`

#### The "App" page object

The page objects are written as *classes* extending `Opa5`. Inside such classes the actions and assertions are defined as instance methods. Apart from these changes, the implementation of the actions and assertions is done just like in plain JavaScript.

#### The "Hello" Journey

The test journey [`webapp/test/integration/HelloJourney.ts`](webapp/test/integration/HelloJourney.ts) is actually pretty straightforward. The main differences are the following:

* Page objects are imported and an instance is being created
* `Given`/`When`/`Then` parameters in the `opaTest(...)` callbacks are omitted
* On the page object the actions and assertions are called

## Requirements

Either [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/) for dependency management.

## Download and Installation

1. Clone the project and switch to the `testing` branch:

   ```sh
   git clone https://github.com/SAP-samples/ui5-typescript-helloworld.git
   cd ui5-typescript-helloworld
   git checkout testing
   ```

   (or download from https://github.com/SAP-samples/ui5-typescript-helloworld/archive/refs/heads/testing.zip)
   &nbsp;

1. Install the dependencies:

   ```sh
   npm install
   ```

## Run the App and the Tests

Execute the following command to run the app locally for development in watch mode (the browser reloads the app automatically when there are changes in the source code):

```sh
npm start
```

As shown in the terminal after executing this command, the app is then running on http://localhost:8080/index.html. A browser window with this URL should automatically open.

Open http://localhost:8080/test/unit/unitTests.qunit.html to run the QUnit tests.

## Limitations

The ways how OPA tests are written in TypeScript are still being improved. There might be a different option in the future but the current option continues to work!

## Known Issues

None.

## How to Obtain Support

The sample code is provided **as-is**. No support is provided.

[Create an issue](https://github.com/SAP-samples/ui5-typescript-helloworld/issues) in this repository if you find a bug.

## License

Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
