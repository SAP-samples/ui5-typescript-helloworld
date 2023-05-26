# A Small TypeScript UI5 Example App

[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/ui5-typescript-helloworld)](https://api.reuse.software/info/github.com/SAP-samples/ui5-typescript-helloworld)

## Description

This app demonstrates a TypeScript setup for developing UI5 applications. However, the code in this *branch* and this document <b>focus on the development of custom controls</b> within applications.

For an explanation of the overall project, please check out the [README file on the `main` branch](https://github.com/SAP-samples/ui5-typescript-helloworld/blob/main/README.md) and the [detailed step-by-step guide](https://github.com/SAP-samples/ui5-typescript-helloworld/blob/main/step-by-step.md) for creating the setup. For the development of control *libraries* see [this sample](https://github.com/SAP-samples/ui5-typescript-control-library).


## Table of Contents

  * [Developing Custom Controls in TypeScript](#developing-custom-controls-in-typescript)
    + [Creating a UI5 Control in TypeScript](#creating-a-ui5-control-in-typescript)
    + [Using the Custom Control](#using-the-custom-control)
    + [Build and Run](#build-and-run)
    + [The Problem of the Missing Runtime-Generated Methods](#the-problem-of-the-missing-runtime-generated-methods)
    + [Use the UI5 TS Interface Generator](#use-the-ui5-ts-interface-generator)
    + [Add the Constructor Signatures](#add-the-constructor-signatures)
  * [Debug the App](#debug-the-app)
  * [Check the Code](#check-the-code)
  * [Limitations](#limitations)
  * [Known Issues](#known-issues)
  * [How to Obtain Support](#how-to-obtain-support)
  * [References](#references)
  * [License](#license)

## Developing Custom Controls in TypeScript

This section assumes that you understand the [TypeScript setup](https://github.com/SAP-samples/ui5-typescript-helloworld/blob/main/step-by-step.md) for UI5 app development and have a TypeScript-based UI5 application project available. You can e.g. use the regular "TypeScript Hello World" app and follow this document step-by-step to add a custom control and the required development setup:

```sh
git clone https://github.com/SAP-samples/ui5-typescript-helloworld.git
cd ui5-typescript-helloworld
```

If you don't want to do all the setup steps for enabling control development, you can get the end result by switching to the `custom-controls` branch after cloning the repository:
```sh
git checkout custom-controls
```

In the end, in any case, install the dependencies, including the needed UI5 type definitions, the Babel transpiler etc., by typing:

```sh
npm install
```

If you have already switched to the `custom-controls` branch (or completed the steps below), you can run the app including the custom control now by doing:

```sh
npm start
```

### Creating a UI5 Control in TypeScript

Just like for Controllers and other application code written in TypeScript, we suggest that Controls should be written as ES6 classes, using ES6 module imports.

A very basic control could hence look as follows. Create a `src/control` folder and inside a file named `MyControl.js` with the following content:

```ts
import Control from "sap/ui/core/Control";
import type { MetadataOptions } from "sap/ui/core/Element";
import RenderManager from "sap/ui/core/RenderManager";

/**
 * @namespace ui5.typescript.helloworld.control
 */
export default class MyControl extends Control {
 
	static readonly metadata: MetadataOptions = {
		properties: {
			"text": "string"
		}
	};

	static renderer = function(rm: RenderManager, control: MyControl) {
		rm.openStart("div", control);
		rm.openEnd();
		rm.text(control.getText());
		rm.close("div");
	};

	onclick = function() {
		alert("Hello World!");
	}
}
```

The control metadata is written as static class member, just like the renderer. It should be typed as `MetadataOptions`. Make sure to import it from `sap/ui/core/Element` in case of controls, or the closest base class in general - the metadata option structure is also defined for `Object`, `ManagedObject` and `Component`. You should also use the TypeScript-specific `import type` instead of just `import` to make clear that this import is only needed for types at designtime, with no runtime impact (unless you need to import other things from the `Element` module). `MetadataOptions` is available since UI5 version 1.110; for earlier versions simply use `object` instead.<br>
Typing the metadata object will give you type safety and code completion for this structure. Not typing it, on the other hand, will lead to issues when inheriting from this control, as the TypeScript compiler will expect the same properties to be present in any derived control's metadata. But properties are inherited, so they should not be repeated.

The JSDoc comment and the `@namespace` annotation inside is required to make the [transformer plugin](https://github.com/r-murphy/babel-plugin-transform-modules-ui5) aware that the class should be transformed to classic UI5 syntax and what the full UI5 name of the class should be in the `BaseClass.extend(...)` call.

Actually, there are [multiple ways supported to supply the name](https://github.com/r-murphy/babel-plugin-transform-modules-ui5#configuring-name-or-namespace). You could e.g. also set the `@name` annotation:

```js
/**
 * @name ui5.typescript.helloworld.control.MyControl
 */
```

Or you could use decorators:

```js
@namespace('ui5.typescript.helloworld.control')
export default class MyControl extends Control {
```

Make sure to export the control class as default export and to do it immediately when the class is defined, otherwise you will run into trouble later on when the TSinterface generator is introduced to the project.

### Using the Custom Control

Such a control is used just like other controls: declare the namespace and use the control. In the `App.view.xml` file in the Hello World app, it could look like this:

```xml
<mvc:View
	controllerName="ui5.typescript.helloworld.controller.App"
	displayBlock="true"
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:cc="ui5.typescript.helloworld.control">

	<App id="app">
		<Page title="My App">
			<cc:MyControl text="Hello World from the custom control!" />
		</Page>
	</App>
</mvc:View>
```

### Build and Run

Use any of the provided ways for triggering the transpilation, like e.g. the watch mode or:

```sh
npm run build:ts
```

This transpiles the app including the control to regular UI5 JavaScript. It can be found in `webapp/control/MyControl.js` and looks like this - more or less like a traditional UI5 JavaScript control:


```js
sap.ui.define(["sap/ui/core/Control"], function (Control) {
  /**
   * @namespace ui5.typescript.helloworld.control
   */
  const MyControl = Control.extend("ui5.typescript.helloworld.control.MyControl", {
    renderer: {
      apiVersion: 2,
      render: function (rm, control) {
        rm.openStart("div", control);
        rm.openEnd();
        rm.text(control.getText());
        rm.close("div");
      }
    },
    metadata: {
      properties: {
        "text": "string"
      }
    },
    constructor: function _constructor(id, settings) {
      Control.prototype.constructor.call(this, id, settings);
      this.onclick = function () {
        alert("Hello World!");
      };
    }
  });
  return MyControl;
});
//# sourceMappingURL=MyControl.js.map
```
The comment in the last line points the browser to a file containing the original TypeScript code and mapping of the statements, which can thus be displayed when debugging.

With 

```sh
npm start
```

you can run the app and see the custom control in action.


### The Problem of the Missing Runtime-Generated Methods

But there is a problem that looks small, but is huge: in the renderer method of `MyControl.ts`, there is a TypeScript error, where the `getText()` method of the control is called:

```ts
rm.text(control.getText())
```

The error says:
> Property 'getText' does not exist on type 'MyControl'.

And indeed : ALL accessor methods for ALL properties, aggregations, associatins and events are generated by UI5 at runtime, so the TypeScript environment cannot know about them at development and build time!
Once you use the control in your application a bit more and try to interact via its API, this issue will become apparent. But it will also hit you when accessing the API in further methods of the control, as it grows.

In addition, TypeScript doesn't know anything about the constructor signatures. You can give (or omit) an ID and initialize the entire control API by constructing it like this:

```ts
new MyControl("myFirstControl", {text: "Hello World"});
```

But again, TypeScript does not know the structure of the settings object.

Unfortunately, this cannot be solved by adding one more transformation step to the already existing TypeScript-to-JavaScript transpilation, because TypeScript needs to know already *within* the editor, while you are writing the code, that these methods exist!

The solution we have decided for is a [tool](https://github.com/SAP/ui5-typescript/tree/main/packages/ts-interface-generator) (published [via npm](https://www.npmjs.com/package/@ui5/ts-interface-generator)) which can run in watch mode while the control code is written. It defines the missing information inside an interface in a separate generated file. The interface is then logically merged by TypeScript with the original control class definition, using concepts like [interface merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces) and [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation). As result, TypeScript knows all nicely typed member methods and the constructor structure. This will not only avoid the error messages, but provide the expected code completion to developers implementing and using the control.

We suggest that these generated interface files are checked-in with the code (so opening the code anew will show no errors) and never modified manually (because they will be overridden anyway when they are re-generated).


### Use the UI5 TS Interface Generator

To generate information about the runtime-generated methods, as explained above, you need to install the interface generator as dev dependency:

```sh
npm install --save-dev @ui5/ts-interface-generator
```

You can then start it either without or with the `--watch` option for either a single run or a launch in watch mode:

```sh
npx @ui5/ts-interface-generator --watch
```

To easily start this when needed, you can add the following line to the "scripts" in package.json:

```js
"watch:controls": "npx @ui5/ts-interface-generator --watch",
```

This generates a `MyControl.gen.d.ts` with the missing method definitions and constructor settings object type and re-generates it whenever any of the TypeScript files changes.

It is recommended to either keep this generator running in watch mode whenever you are doing changes to any control metadata or to run it once whenever such changes are completed.

The `start` script configured in `package.json` only runs the TypeScript transpilation in watch mode (and reloads the browser page automatically), the `watch` script in addition also re-generates the TypeScript interfaces for controls whenever anything changes.

### Add the Constructor Signatures

There is one more thing to make the generated interface fully work and to be able to use the control fully in TypeScript code. Luckily, it's enough to do this once (for each control) and it's super-easy. In the command output of the generator, you see the following block:
```
NOTE:
Class MyControl in file ui5-typescript-helloworld/src/control/MyControl.ts needs to contain
the following constructors, in order to make TypeScript aware of the possible constructor settings.
Please copy&paste the block manually, as the ts-interface-generator will not touch your source files:
===== BEGIN =====
// The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures 
constructor(id?: string | $MyControlSettings);
constructor(id?: string, settings?: $MyControlSettings);
constructor(id?: string, settings?: $MyControlSettings) { super(id, settings); }
===== END =====
``` 

Please copy the block between `===== BEGIN =====` and `===== END =====` into your original class implementation inside `MyControl.ts`. A good location would be right at the beginning of the class body, before the metadata definition.

Congratulations! That's it!
You can now extend the control or develop more of them.


## Debug the App

In the browser, you can directly debug the original TypeScript code, which is supplied via sourcemaps (need to be enabled in the browser's developer console if it does not work straight away). If the browser doesn't automatically jump to the TypeScript code when setting breakpoints, use e.g. Ctrl+P in Chrome to open the `*.ts` file you want to debug.



## Check the Code

Do the following to run a TypeScript check:

```sh
npm run ts-typecheck
```

This checks the application code for any type errors (but will also complain in case of fundamental syntax issues which break the parsing).<br>


To lint the TypeScript code, do:

```sh
npm run lint
```

(Again, when using yarn, do `yarn ts-typecheck` and `yarn lint` instead.)

## Limitations

- At this time, the used eslint rules are not verified to be optimal or to be in sync with UI5 recommendations.


## Known Issues

None.


## How to Obtain Support

The sample code is provided **as-is**. No support is provided.

However, you are welcome to [reate an issue](https://github.com/SAP-samples/ui5-typescript-helloworld/issues) in this repository or to submit a pull request if you find a bug or want to suggest an improvement.

<!-- ## Contributing -->


## References

The <b>main entry point</b> for all TypeScript documentation related to UI5 is at: <b>https://sap.github.io/ui5-typescript</b>

Once you have understood the setup and want to inspect the code of a slightly more comprehensive UI5 app written in TypeScript, you can check out the [TypeScript version of the UI5 CAP Event App Sample](https://github.com/SAP-samples/ui5-cap-event-app/tree/typescript).


## License

Copyright (c) 2022 SAP SE or an SAP affiliate company. All rights reserved.
This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
