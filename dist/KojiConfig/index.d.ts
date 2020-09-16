import { Observable, Receipt, TypedEvent } from "@anderjason/observable";
import { ValuePath } from "@anderjason/util";
import { FeedSdk, InstantRemixing } from "@withkoji/vcc";
import { ManagedObject } from "skytree";
export declare type KojiMode = "view" | "generator" | "template";
export declare class KojiConfig extends ManagedObject {
    private static _instance;
    static get instance(): KojiConfig;
    readonly mode: Observable<KojiMode>;
    readonly willReceiveExternalData: TypedEvent<ValuePath>;
    private _internalData;
    private _undoManager;
    private _selectedPath;
    private _instantRemixing;
    private _feedSdk;
    private _updateKojiLater;
    private _pathBindings;
    private constructor();
    get selectedPath(): Observable<ValuePath>;
    get instantRemixing(): InstantRemixing;
    get feedSdk(): FeedSdk;
    onActivate(): void;
    subscribe(vccPath: ValuePath, fn: (value: any) => void, includeLast?: boolean): Receipt;
    toOptionalValueGivenPath(path: ValuePath): any;
    update(path: ValuePath, newValue: any, immediate?: boolean): void;
    sendPendingUpdates(): void;
    private onValueChanged;
}
