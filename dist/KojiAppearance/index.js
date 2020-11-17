"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KojiAppearance = exports.KojiTheme = void 0;
const color_1 = require("@anderjason/color");
const geometry_1 = require("@anderjason/geometry");
const util_1 = require("@anderjason/util");
const Preload_1 = require("@anderjason/web/dist/Preload");
class KojiTheme {
    constructor(key, definition) {
        this.key = key;
        this.definition = definition;
    }
    toHighContrastColor() {
        return this.toColor().toHighContrastColor();
    }
    toColor() {
        switch (this.definition.type) {
            case "color":
                return this.definition.color;
            case "gradient":
                return this.definition.gradient.toHclInterpolatedColor(util_1.Percent.ofHalf());
            default:
                throw new Error("Unsupported theme type");
        }
    }
    toStyle(styleType) {
        switch (styleType) {
            case "background":
                return this.toBackgroundStyle();
            case "text":
                return this.toTextStyle();
            default:
                throw new Error(`Unsupported style type '${styleType}'`);
        }
    }
    applyStyle(element, styleType) {
        const style = this.toStyle(styleType);
        Object.keys(style).forEach((key) => {
            element.style[key] = style[key];
        });
    }
    toBackgroundStyle() {
        switch (this.definition.type) {
            case "color":
                const { color } = this.definition;
                return {
                    background: color.toHexString(),
                };
            case "gradient":
                const { gradient, angle } = this.definition;
                return {
                    background: gradient
                        .withHclStepCount(5)
                        .toLinearGradientString(`${angle.toDegrees()}deg`),
                };
            default:
                throw new Error("Unsupported theme definition type");
        }
    }
    toTextStyle() {
        switch (this.definition.type) {
            case "color":
                const { color } = this.definition;
                return {
                    color: color.toHexString(),
                };
            case "gradient":
                return {
                    color: this.toColor().toHexString(),
                };
            default:
                throw new Error("Unsupported theme definition type");
        }
    }
}
exports.KojiTheme = KojiTheme;
class KojiAppearance {
    static preloadFonts() {
        for (let style of KojiAppearance.fontStyles.values()) {
            Preload_1.Preload.instance.addFont(style);
        }
    }
}
exports.KojiAppearance = KojiAppearance;
KojiAppearance.fontStyles = new Map();
KojiAppearance.themes = new Map();
KojiAppearance.fontStyles.set("ptSansBold", {
    fontFamily: "PT Sans",
    weight: 700,
    url: "https://fonts.googleapis.com/css2?family=PT+Sans:wght@700&display=swap",
});
KojiAppearance.fontStyles.set("sourceSansSemibold", {
    fontFamily: "Source Sans Pro",
    weight: 600,
    url: "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@600&display=swap",
});
KojiAppearance.fontStyles.set("sourceSansRegular", {
    fontFamily: "Source Sans Pro",
    weight: 400,
    url: "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400&display=swap",
});
KojiAppearance.themes.set("kojiBlue", new KojiTheme("kojiBlue", {
    type: "color",
    color: color_1.Color.givenHexString("#007AFF"),
}));
KojiAppearance.themes.set("white", new KojiTheme("white", {
    type: "color",
    color: color_1.Color.givenHexString("#FFFFFF"),
}));
KojiAppearance.themes.set("gray4", new KojiTheme("gray4", {
    type: "color",
    color: color_1.Color.givenHexString("#BDBDBD"),
}));
KojiAppearance.themes.set("gray5", new KojiTheme("gray5", {
    type: "color",
    color: color_1.Color.givenHexString("#E0E0E0"),
}));
KojiAppearance.themes.set("gray6", new KojiTheme("gray6", {
    type: "color",
    color: color_1.Color.givenHexString("#F2F2F2"),
}));
KojiAppearance.themes.set("kojiBlack", new KojiTheme("kojiBlack", {
    type: "color",
    color: color_1.Color.givenHexString("#2D2F30"),
}));
KojiAppearance.themes.set("red", new KojiTheme("red", {
    type: "color",
    color: color_1.Color.givenHexString("#EB5757"),
}));
KojiAppearance.themes.set("orange", new KojiTheme("orange", {
    type: "color",
    color: color_1.Color.givenHexString("#F2994A"),
}));
KojiAppearance.themes.set("mustard", new KojiTheme("mustard", {
    type: "color",
    color: color_1.Color.givenHexString("#FCBA04"),
}));
KojiAppearance.themes.set("green2", new KojiTheme("green2", {
    type: "color",
    color: color_1.Color.givenHexString("#27AE60"),
}));
KojiAppearance.themes.set("blue2", new KojiTheme("blue2", {
    type: "color",
    color: color_1.Color.givenHexString("#2D9CDB"),
}));
KojiAppearance.themes.set("purple2", new KojiTheme("purple2", {
    type: "color",
    color: color_1.Color.givenHexString("#BB6BD9"),
}));
KojiAppearance.themes.set("gradient1", new KojiTheme("gradient1", {
    type: "gradient",
    gradient: color_1.ColorGradient.givenSteps([
        color_1.Color.givenHexString("#FFF123"),
        color_1.Color.givenHexString("#FF91A5"),
        color_1.Color.givenHexString("#CA77F2"),
        color_1.Color.givenHexString("#95CCFF"),
    ]),
    angle: geometry_1.Rotation.givenDegrees(91.65),
}));
KojiAppearance.themes.set("gradient2", new KojiTheme("gradient2", {
    type: "gradient",
    gradient: color_1.ColorGradient.givenSteps([
        color_1.Color.givenHexString("#BDAFE2"),
        color_1.Color.givenHexString("#C3F5DC"),
    ]),
    angle: geometry_1.Rotation.givenDegrees(91.65),
}));
//# sourceMappingURL=index.js.map