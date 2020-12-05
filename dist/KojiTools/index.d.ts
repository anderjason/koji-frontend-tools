import { Observable, ReadOnlyObservable, TypedEvent } from "@anderjason/observable";
import { ValuePath } from "@anderjason/util";
import { FeedSdk, InstantRemixing } from "@withkoji/vcc";
import { ObservableState } from "@anderjason/web";
import { Actor } from "skytree";
export declare type KojiMode = "about" | "admin" | "edit" | "remix" | "screenshot" | "view";
export declare class KojiTools extends Actor<void> {
    private static _instance;
    static get instance(): KojiTools;
    private _currentMode;
    private _sessionMode;
    private _vccData;
    private _selectedPath;
    private _instantRemixing;
    private _feedSdk;
    private _updateKojiLater;
    readonly willReceiveExternalData: TypedEvent<ValuePath>;
    readonly allPlaybackShouldStop: TypedEvent<void>;
    readonly currentMode: ReadOnlyObservable<KojiMode>;
    readonly sessionMode: ReadOnlyObservable<KojiMode>;
    private constructor();
    get vccData(): ObservableState;
    get selectedPath(): Observable<ValuePath>;
    get instantRemixing(): InstantRemixing;
    get feedSdk(): FeedSdk;
    onActivate(): void;
    sendPendingUpdates(): void;
    private onValueChanged;
}