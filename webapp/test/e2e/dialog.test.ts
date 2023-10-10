/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import AppPage from "./pages/AppPage";

describe("Hello!", () => {
  it("Should open the Hello dialog", async () => {
    await AppPage.iPressTheSayHelloWithDialogButton();
    const dialogVisible = await AppPage.iShouldSeeTheHelloDialog();
    expect(dialogVisible).toBeTruthy();
  });

  it("Should close the Hello dialog", async () => {
    await AppPage.iPressTheOkButtonInTheDialog();
    const dialogNotVisible = await AppPage.iShouldNotSeeTheHelloDialog();
    expect(dialogNotVisible).toBeTruthy();
  });
});
