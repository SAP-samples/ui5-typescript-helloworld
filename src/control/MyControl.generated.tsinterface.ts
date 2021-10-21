import { $ControlSettings } from "sap/ui/core/Control";

declare module "./MyControl" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $MyControlSettings extends $ControlSettings {
        text?: string;
    }

    interface MyControl {

        // property: text
        getText(): string;
        setText(text: string): this;
    }
}
