import Opa5 from "sap/ui/test/Opa5";
import { AppPageActions, AppPageAssertions } from "./App";

// TODO: want to get rid of this

export class When extends Opa5 {
	onTheAppPage: AppPageActions
	// add further pages here, once they are created!
}
export class Then extends Opa5 {
	onTheAppPage: AppPageAssertions
	// add further pages here, once they are created!
}