import Control from "sap/ui/core/Control";
import type { MetadataOptions } from "sap/ui/core/Element";
import RenderManager from "sap/ui/core/RenderManager";

/**
 * @namespace ui5.typescript.helloworld.control
 */
export default class MyControl extends Control {

	// The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
	constructor(idOrSettings?: string | $MyControlSettings);
	constructor(id?: string, settings?: $MyControlSettings);
	constructor(id?: string, settings?: $MyControlSettings) { super(id, settings); }

	static readonly metadata: MetadataOptions = {
		properties: {
			"text": "string"
		}
	};

	static renderer = {
		apiVersion: 2,
		render: function (rm: RenderManager, control: MyControl): void {
			rm.openStart("div", control);
			rm.openEnd();
			rm.text(control.getText());
			rm.close("div");
		}
	};

	onclick = function (): void {
		alert("Hello World!");
	}
}