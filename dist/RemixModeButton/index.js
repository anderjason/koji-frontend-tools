"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemixModeButton = void 0;
const geometry_1 = require("@anderjason/geometry");
const observable_1 = require("@anderjason/observable");
const time_1 = require("@anderjason/time");
const util_1 = require("@anderjason/util");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const Callout_1 = require("../Callout");
const Vcc_1 = require("../Vcc");
function createToggleSwitchSvg() {
    const filterId = util_1.StringUtil.stringOfRandomCharacters(8);
    return `
    <svg width="59" height="36" viewBox="0 0 47 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g class="shadow" filter="url(#${filterId})">
        <rect
          x="3"
          y="3.5"
          width="41"
          height="22"
          rx="11"
          stroke="#fff"
          stroke-width="1.5"
        />
        <ellipse class="ellipse" cx="14.5" cy="14.5" rx="9.5" ry="9" fill="#fff" />
      </g>
      <g>
        <rect
          class="rect"
          x="3"
          y="3.5"
          width="41"
          height="22"
          rx="11"
          stroke="#fff"
          stroke-width="1.5"
          fill="transparent"
        />
        <ellipse class="ellipse" cx="14.5" cy="14.5" rx="9.5" ry="9" fill="#fff" />
      </g>
      <defs>
        <filter
          id="${filterId}"
          x=".25"
          y=".75"
          width="46.5"
          height="27.5"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur id="blur1" stdDeviation="1" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  `;
}
class RemixModeButton extends skytree_1.Actor {
    onActivate() {
        const button = this.addActor(ButtonStyle.toManagedElement({
            tagName: "button",
            parentElement: this.props.parentElement,
        }));
        const calloutPoint = observable_1.Observable.ofEmpty(geometry_1.Point2.isEqual);
        const shouldShowCallout = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        this.addActor(new skytree_1.ConditionalActivator({
            input: shouldShowCallout,
            fn: (v) => v,
            actor: new skytree_1.DelayActivator({
                activateAfter: time_1.Duration.givenSeconds(0.1),
                // deactivateAfter: Duration.givenSeconds(6),
                actor: new Callout_1.Callout({
                    parentElement: document.body,
                    screenPoint: calloutPoint,
                    text: "Show more remix controls",
                    calloutSide: observable_1.Observable.givenValue("right"),
                }),
            }),
        }));
        button.element.innerHTML = createToggleSwitchSvg();
        this.cancelOnDeactivate(web_1.Pointer.instance.addTarget(button.element));
        this.cancelOnDeactivate(web_1.Pointer.instance.didClick.subscribe((e) => {
            if (e.isHandled) {
                return;
            }
            if (e.target === button.element) {
                e.isHandled = true;
                this.onClick();
            }
        }));
        this.cancelOnDeactivate(web_1.ScreenSize.instance.availableSize.didChange.subscribe((size) => {
            if (size == null) {
                return;
            }
            calloutPoint.setValue(geometry_1.Point2.givenXY(86, size.height - 39));
        }, true));
        this.cancelOnDeactivate(Vcc_1.Vcc.instance.mode.didChange.subscribe((mode) => {
            switch (mode) {
                case "view":
                    shouldShowCallout.setValue(false);
                    button.setModifier("isVisible", false);
                    break;
                case "template":
                    shouldShowCallout.setValue(true);
                    button.setModifier("isVisible", true);
                    button.setModifier("isActive", false);
                    button.element.title = "Change to edit mode";
                    break;
                case "generator":
                    shouldShowCallout.setValue(false);
                    button.setModifier("isVisible", true);
                    button.setModifier("isActive", true);
                    button.element.title = "Change to remix mode";
                    break;
            }
        }, true));
    }
    onClick() {
        const mode = Vcc_1.Vcc.instance.mode;
        switch (mode.value) {
            case "generator":
                mode.setValue("template");
                break;
            case "template":
                mode.setValue("generator");
                break;
            default:
                mode.setValue("generator");
                break;
        }
    }
}
exports.RemixModeButton = RemixModeButton;
const ButtonStyle = web_1.ElementStyle.givenDefinition({
    css: `
    appearance: none;
    background: transparent;
    border: none;
    box-sizing: border-box;
    left: 16px;
    bottom: 16px;
    outline: none;
    opacity: 0;
    padding: 0;
    pointer-events: none;
    position: absolute;
    transition: 0.3s ease opacity;
    z-index: 1000;

    svg {
      .shadow {
        transition: 0.3s ease opacity;
      }
      
      .ellipse {
        transition: 0.3s ease cx;
      }

      .rect {
        transition: 0.3s ease stroke, 0.3s ease fill;
      }
    }
  `,
    modifiers: {
        isVisible: `
      pointer-events: auto;
      opacity: 1;
    `,
        isActive: `
      svg {
        .shadow {
          opacity: 0;
        }
        
        .ellipse {
          cx: 32.5px;
        }

        .rect {
          stroke: transparent;
          fill: #007aff;
        }
      }
    `,
    },
});
//# sourceMappingURL=index.js.map