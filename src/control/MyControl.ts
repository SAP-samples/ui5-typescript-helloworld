import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";

/**
 * @namespace ui5.typescript.helloworld.control
 */
class MyControl extends Control {
 
    static readonly metadata = {
        properties: {
            "text": "string"
        }
    };

    static renderer = function(oRm: RenderManager, oControl: MyControl) {
        oRm.openStart("div", oControl);
        oRm.openEnd();
        oRm.text(oControl.getText());
        oRm.close("div");
    };

	onclick = function() {
		alert("Hello World!");
	}
}

export {MyControl};
export default MyControl;