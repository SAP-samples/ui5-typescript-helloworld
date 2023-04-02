/* eslint-disable */
// TODO: this code/API needs to be moved into OPA.

import Opa5 from "sap/ui/test/Opa5";

export default class OPA_Extension {
	static createPageObjects_NEW_OVERLOAD(onName: string, Actions: Function, Assertions: Function) {
		const configObject: {[name: string]: {actions: Record<string, () => {}>, assertions: Record<string, () => {}>}} = {};
		configObject[onName] = {
			actions: convert(Actions),
			assertions: convert(Assertions)
		}
		Opa5.createPageObjects(configObject);
	}
}

function convert(Methods: Function): Record<string, () => {}> {
	const dictionary: Record<string, () => {}> = {}
	Object.getOwnPropertyNames(Methods.prototype)
		.filter(name => name !== 'constructor' && typeof Methods.prototype[name] === 'function')
		.map(name => {
			dictionary[name] = Methods.prototype[name]
		})
	return dictionary
}
