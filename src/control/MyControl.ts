import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";

/**
 * @namespace ui5.typescript.helloworld.control
 */
class MyControl extends Control {
 
    // The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
    constructor(idOrSettings?: string | $MyControlSettings);
    constructor(id?: string, settings?: $MyControlSettings);
    constructor(id?: string, settings?: $MyControlSettings) { super(id, settings); }

    static readonly metadata = {
        properties: {
            "text": "string"
        }
    };

    static renderer = function(oRm: RenderManager, oControl: MyControl): void {
        oRm.openStart("div", oControl);
        oRm.openEnd();
        oRm.text(oControl.getText());
        oRm.close("div");
    };

	onclick = function(): void {
		alert("Hello World!");
	}
}

export { MyControl }; // needed for merging the generated interface
export default MyControl;