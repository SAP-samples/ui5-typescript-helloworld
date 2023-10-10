/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Button from "sap/m/Button";
import MessageBox from "sap/m/MessageBox";

import { buttonLocator, dialogLocator, OKButtonLocator } from "./locators";

class AppPage {
  async iPressTheSayHelloWithDialogButton() {
    const button = await browser.asControl<Button>(buttonLocator);
    await button.press();
  }

  async iShouldSeeTheHelloDialog(): Promise<boolean> {
    const dialog = await browser.asControl<MessageBox>(dialogLocator);
    return await dialog.getVisible<boolean>();
  }

  async iPressTheOkButtonInTheDialog() {
    await browser.asControl(OKButtonLocator).press();
  }

  async iShouldNotSeeTheHelloDialog(): Promise<boolean> {
    const dialog = await browser.asControl<MessageBox>(dialogLocator);
    // this returns "null" as the message box is not
    // part of the DOM after being close, so
    // no methods can be executed on the control
    const visible = await dialog.getVisible();
    return !visible;
  }
}

export default new AppPage();
