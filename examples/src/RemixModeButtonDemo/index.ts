import { DemoActor } from "@anderjason/example-tools";
import { ElementStyle } from "@anderjason/web";
import { RemixModeButton } from "../../../src/RemixModeButton";

export interface RemixModeButtonDemoProps {}

export class RemixModeButtonDemo extends DemoActor<RemixModeButtonDemoProps> {
  onActivate() {
    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.parentElement,
      })
    );

    this.addActor(
      new RemixModeButton({
        parentElement: wrapper.element,
      })
    );
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  css: `
    width: 100%;
    height: 100%;
    position: relative;
  `,
});
