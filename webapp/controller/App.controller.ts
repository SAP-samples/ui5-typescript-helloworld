import MessageBox from "sap/m/MessageBox";
import Controller from "sap/ui/core/mvc/Controller";
import AppComponent from "../Component";

/**
 * @namespace ui5.typescript.helloworld.controller
 */
export default class App extends Controller {

	public onInit() : void {
		// apply content density mode to root view
		const view = this.getView()
		if (view) {
			view.addStyleClass((this.getOwnerComponent() as AppComponent).getContentDensityClass());
		}
	}

	public sayHello() : void {
		MessageBox.show("Hello World!");
	}
}