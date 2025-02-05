# A Small TypeScript UI5 Example App with Tests

**This `testing` branch additionally demonstrates how UI5 tests are best written in TypeScript.** 
> In general, this "hello world" app demonstrates a TypeScript setup for developing UI5 applications. For documentation regarding the general setup, please see the [`main` branch](https://github.com/SAP-samples/ui5-typescript-helloworld/tree/main) of this repository. For general UI5 TypeScript information go to https://sap.github.io/ui5-typescript.

### Summary

The main differences to tests written in JavaScript relate to a) writing OPA tests and b) configuring code coverage instrumentation:

The *structural* code differences to writing tests in *JavaScript* are:
1. The **OPA Pages are simply classes extending `Opa5`, having the actions and assertions as class methods**.
2. The **OPA Journeys do not use the `Given`/`When`/`Then` objects, but call actions and assertions directly on the Page objects**. 

This simplifies the test code a lot and at the same time avoids type complications in TypeScript caused by OPA APIs not fitting a typed language. 
All other testing code is converted from JavaScript in the same way as regular application code is (i.e. using real ECMAScript classes and modules).

The *setup* difference is in the configuration to instrument code for coverage reporting: the `istanbul` library needs to be added to the Babel config of `ui5-tooling-transpile-middleware` in `ui5.yaml`.

Details can be found in [step-by-step.md](step-by-step.md).

### NOTE

The overall test setup is now using the [`ui5-test-runner`](https://github.com/ArnaudBuchholz/ui5-test-runner) instead of deprecated `karma`.


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


## Running Tests

Once the project is set up (`git clone` and `npm install`, see further down), the tests can be executed either manually or in an automated way using [`ui5-test-runner`](https://github.com/ArnaudBuchholz/ui5-test-runner):

1. *Manual execution*: use `npm start` and then execute the tests by opening the [testsuite](http://localhost:8080/test/testsuite.qunit.html) at [http://localhost:8080/test/testsuite.qunit.html](http://localhost:8080/test/testsuite.qunit.html) in your browser. You can also directly launch the [QUnit tests](http://localhost:8080/test/Test.qunit.html?testsuite=test-resources/ui5/typescript/helloworld/testsuite.qunit&test=unit/unitTests) or the [Integration tests](http://localhost:8080/test/Test.qunit.html?testsuite=test-resources/ui5/typescript/helloworld/testsuite.qunit&test=integration/opaTests) individually.
<!-- 2. *Test-driven* development by running Karma in watch mode using `npm run karma` (which triggers the test each time a source file changes) -->
2. *Headless testing*: launch test-runner either *without* coverage reporting using `npm run test-runner` or *with* coverage using `npm run test-runner-coverage`.
While the tests are running, their status can be monitored at http://localhost:8081/_/progress.html

> Note: when the application to test is passed using the `--url` argument (as we do it in this sample), then there is [no "watch" mode of the ui5-test-runner so far](https://github.com/ArnaudBuchholz/ui5-test-runner/issues/119), which automatically re-runs the tests when a resource changes. 

## Limitations

In the future there might be further improvements to how tests are written and configured.

## Known Issues

None.

## How to Obtain Support

The sample code is provided **as-is**. No support is provided.

[Create an issue](https://github.com/SAP-samples/ui5-typescript-helloworld/issues) in this repository if you find a bug.

## License

Copyright (c) 2023-2025 SAP SE or an SAP affiliate company. All rights reserved.
This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
