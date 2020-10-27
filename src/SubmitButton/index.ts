import { Color } from "@anderjason/color";
import { Observable, ObservableBase, Receipt } from "@anderjason/observable";
import { ElementStyle, ManagedElement } from "@anderjason/web";
import { Actor } from "skytree";
import { ThisOrParentElement } from "..";
import { KojiTheme } from "../KojiAppearance";
import { LoadingIndicator } from "../LoadingIndicator";

export type SubmitButtonMode = "ready" | "busy" | "success";

export interface SubmitButtonProps {
  buttonMode: SubmitButtonMode | ObservableBase<SubmitButtonMode>;
  onClick: () => void;
  element: ThisOrParentElement<HTMLButtonElement>;
  text: string | ObservableBase<string>;
  theme: KojiTheme | ObservableBase<KojiTheme>;
}

const checkSvg = `
  <svg height="556" viewBox="0 -46 417.813 417" width="556" xmlns="http://www.w3.org/2000/svg">
    <path d="M159.988 318.582c-3.988 4.012-9.43 6.25-15.082 6.25s-11.094-2.238-15.082-6.25L9.375 198.113c-12.5-12.5-12.5-32.77 0-45.246l15.082-15.086c12.504-12.5 32.75-12.5 45.25 0l75.2 75.203L348.104 9.781c12.504-12.5 32.77-12.5 45.25 0l15.082 15.086c12.5 12.5 12.5 32.766 0 45.246zm0 0" fill="currentColor" />
  </svg>
`;

export class SubmitButton extends Actor<SubmitButtonProps> {
  onActivate() {
    let button: HTMLButtonElement;

    switch (this.props.element.type) {
      case "thisElement":
        button = this.props.element.element;
        break;
      case "parentElement":
        button = this.addActor(
          ManagedElement.givenDefinition({
            tagName: "button",
            parentElement: this.props.element.parentElement,
          })
        ).element;
        break;
      default:
        throw new Error("An element is required (this or parent)");
    }

    button.classList.add(SubmitButtonStyle.toCombinedClassName());
    button.addEventListener("click", this.props.onClick);

    this.cancelOnDeactivate(
      new Receipt(() => {
        button.removeEventListener("click", this.props.onClick);
      })
    );

    const textElement = document.createElement("span");
    textElement.className = "text";
    textElement.innerHTML = "Unlock Now";
    button.appendChild(textElement);

    const observableText = Observable.givenValueOrObservable(this.props.text);
    this.cancelOnDeactivate(
      observableText.didChange.subscribe((text) => {
        if (text == null) {
          textElement.innerHTML = "";
        } else {
          textElement.innerHTML = text;
        }
      }, true)
    );

    const loadingWrapper = document.createElement("div");
    loadingWrapper.className = "loading";
    button.appendChild(loadingWrapper);

    const completeIcon = document.createElement("div");
    completeIcon.className = "complete";
    completeIcon.innerHTML = checkSvg;
    button.appendChild(completeIcon);

    const observableMode = Observable.givenValueOrObservable(
      this.props.buttonMode
    );

    let loader: LoadingIndicator;
    this.cancelOnDeactivate(
      observableMode.didChange.subscribe((mode) => {
        switch (mode) {
          case "ready":
            button.className = SubmitButtonStyle.toCombinedClassName();
            button.disabled = false;
            break;
          case "busy":
            button.className = SubmitButtonStyle.toCombinedClassName(
              "isTextHidden"
            );
            button.disabled = true;
            break;
          case "success":
            button.className = SubmitButtonStyle.toCombinedClassName([
              "isTextHidden",
              "isSuccess",
            ]);
            button.disabled = true;
            break;
        }

        if (loader != null) {
          this.removeActor(loader);
          loader = undefined;
        }

        if (mode === "busy") {
          loader = this.addActor(
            new LoadingIndicator({
              parentElement: loadingWrapper,
              color: Color.givenHexString("#FFFFFF"),
            })
          );
        }
      })
    );

    const observableTheme = Observable.givenValueOrObservable(this.props.theme);
    this.cancelOnDeactivate(
      observableTheme.didChange.subscribe((theme) => {
        if (theme == null) {
          return;
        }

        switch (theme.type) {
          case "color":
            button.style.background = theme.color.toHexString();
            break;
          case "gradient":
            button.style.background = theme.gradient
              .withHclStepCount(5)
              .toLinearGradientString(`${theme.angle.toDegrees()}deg`);
            break;
        }
      }, true)
    );
  }
}

const SubmitButtonStyle = ElementStyle.givenDefinition({
  css: `
    align-items: center;
    background: #2D2F30;
    border-radius: 10px;
    border: none;
    color: #FFFFFF;
    display: flex;
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    grid-area: pay;
    line-height: 25px;
    letter-spacing: 0.02em;
    justify-content: center;
    outline: none;
    padding: 1em 0;
    position: relative;
    text-align: center;
    transition: 0.2s ease all;
    width: 100%;

    &:active:enabled {
      transform: scale(0.98);
      outline: none;
    }

    .loading {
      align-items: center;
      bottom: 0;
      display: flex;
      justify-content: center;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
    }

    .complete {
      align-items: center;
      bottom: 0;
      display: flex;
      justify-content: center;
      left: 0;
      opacity: 0;
      position: absolute;
      right: 0;
      top: 0;
      transform: scale(0.3);

      svg {
        height: 40px;
        width: 40px;
      }
    }
  `,
  modifiers: {
    isTextHidden: `
      .text {
        opacity: 0;
      }
    `,
    isSuccess: `
      background-position: 1px -110px;

      .text {
        opacity: 0;
      }

      .complete {
        transition: 0.3s ease all;
        opacity: 1;
        transform: scale(0.6);
      }
    `,
  },
});