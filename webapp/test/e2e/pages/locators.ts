export const buttonLocator = {
  selector: {
    id: "container-ui5.typescript.helloworld---app--helloButton"
  }
}

export const dialogLocator = {
  selector: {
    controlType: "sap.m.Dialog",
    properties: {
      type: "Message"
    },
    searchOpenDialogs: true
  }
}

export const OKButtonLocator = {
  selector: {
    controlType: "sap.m.Button",
    properties: {
      text: "OK"
    },
    searchOpenDialogs: true
  }
}
