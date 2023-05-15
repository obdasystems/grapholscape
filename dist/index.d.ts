import * as cytoscape$1 from 'cytoscape';
import cytoscape__default, { Position, ElementDefinition, EventObject, Stylesheet, CytoscapeOptions, NodeSingular, Core } from 'cytoscape';
import * as lit_html from 'lit-html';
import * as lit from 'lit';
import { SVGTemplateResult, LitElement, TemplateResult, PropertyDeclarations, CSSResultArray, CSSResultGroup } from 'lit';
import { Props, Instance } from 'tippy.js';

declare class Annotation {
    property: string;
    lexicalForm: string;
    language: string;
    datatype: string;
    constructor(property: string, lexicalForm: string, language?: string, datatype?: string);
    equals(annotation: Annotation): boolean;
}

declare enum AnnotationsKind {
    label = "label",
    comment = "comment",
    author = "author"
}
declare class AnnotatedElement {
    private _annotations;
    constructor();
    set annotations(annotations: Annotation[]);
    addAnnotation(newAnnotation: Annotation): void;
    getAnnotations(language?: string, kind?: AnnotationsKind): Annotation[];
    getLabels(language?: string): Annotation[];
    getComments(language?: string): Annotation[];
}

/**
 * Node types in a Graphol ontology
 */
declare enum GrapholTypesEnum {
    CLASS = "class",
    /** @type {"domain-restriction"} */
    DOMAIN_RESTRICTION = "domain-restriction",
    /** @type {"range-restriction"} */
    RANGE_RESTRICTION = "range-restriction",
    /** @type {"role"} */
    OBJECT_PROPERTY = "object-property",
    /** @type {"data property"} */
    DATA_PROPERTY = "data-property",
    /** @type {"union"} */
    UNION = "union",
    /** @type {"disjoint-union"} */
    DISJOINT_UNION = "disjoint-union",
    /** @type {"complement"} */
    COMPLEMENT = "complement",
    /** @type {"intersection"} */
    INTERSECTION = "intersection",
    /** @type {"enumeration"} */
    ENUMERATION = "enumeration",
    /** @type {"has-key"} */
    KEY = "has-key",
    /** @type {"role-inverse"} */
    ROLE_INVERSE = "role-inverse",
    /** @type {"role-chain"} */
    ROLE_CHAIN = "role-chain",
    /** @type {"datatype-restriction"} */
    DATATYPE_RESTRICTION = "datatype-restriction",
    /** @type {"value-domain"} */
    VALUE_DOMAIN = "value-domain",
    /** @type {"property-assertion"} */
    PROPERTY_ASSERTION = "property-assertion",
    /** @type {"literal"} */
    LITERAL = "literal",
    /** @type {"individual"} */
    INDIVIDUAL = "individual",
    /** @type {"facet"} */
    FACET = "facet",
    /** @type {"neutral"} */
    NEUTRAL = "neutral",
    /** @type {"value"} */
    VALUE = "value",
    /** @type {"inclusion"} */
    INCLUSION = "inclusion",
    /** @type {"input"} */
    INPUT = "input",
    /** @type {"equivalence"} */
    EQUIVALENCE = "equivalence",
    /** @type {"instanceOf"} */
    INSTANCE_OF = "instanceOf",
    /** @type {"same"} */
    SAME = "same",
    /** @type {"different"} */
    DIFFERENT = "different",
    /** @type {"membership"} */
    MEMBERSHIP = "membership",
    /** @type {"class-instance"} */
    CLASS_INSTANCE = "class-instance"
}
/**
 * Shapes assigned to Graphol nodes. These are [Cytoscape.js shapes](https =//js.cytoscape.org/#style/node-body)
 * @enum {string}
 * @property {string} RECTANGLE rectangle
 * @property {string} DIAMOND diamond
 * @property {string} ELLIPSE ellipse
 * @property {string} HEXAGON hexagon
 * @property {string} ROUND_RECTANGLE roundrectangle
 * @property {string} OCTAGON octagon
 * @property {string} POLYGON polygon
 */
declare enum Shape {
    /** @type {"rectangle"} */
    RECTANGLE = "rectangle",
    /** @type {"diamond"} */
    DIAMOND = "diamond",
    /** @type {"ellipse"} */
    ELLIPSE = "ellipse",
    /** @type {"hexagon"} */
    HEXAGON = "hexagon",
    /** @type {"roundrectangle"} */
    ROUND_RECTANGLE = "roundrectangle",
    /** @type {"octagon"} */
    OCTAGON = "octagon",
    /** @type {"polygon"} */
    POLYGON = "polygon"
}
declare const POLYGON_POINTS = "-0.9 -1 1 -1 0.9 1 -1 1";
/**
 * Enumeration having `type`, `shape` and `identity` for each Graphol node
 */
type GrapholNodeInfo = {
    TYPE: GrapholTypesEnum;
    SHAPE: Shape;
    IDENTITY: GrapholTypesEnum;
    SHAPE_POINTS?: string;
};
declare const GrapholNodesEnum: {
    [x in keyof typeof GrapholTypesEnum]?: GrapholNodeInfo;
};
/**
 * Labels to apply to constructor nodes in Graphol
 * @enum {string}
 * @property {string} UNION or
 * @property {string} INTERSECTION and
 * @property {string} ROLE_CHAIN inv
 * @property {string} COMPLEMENT not
 * @property {string} DATATYPE_RESTRICTION data
 * @property {string} ENUMERATION oneOf
 * @property {string} KEY key
 */
declare enum ConstructorLabelsEnum {
    /** @type {"or"} */
    UNION = "or",
    /** @type {"and"} */
    INTERSECTION = "and",
    /** @type {"chain"} */
    ROLE_CHAIN = "chain",
    /** @type {"inv"} */
    ROLE_INVERSE = "inv",
    /** @type {"not"} */
    COMPLEMENT = "not",
    /** @type {"data"} */
    DATATYPE_RESTRICTION = "data",
    /** @type {"oneOf"} */
    ENUMERATION = "oneOf",
    /** @type {"key"} */
    KEY = "key"
}

declare class Breakpoint implements Position {
    x: number;
    y: number;
    distance: number;
    weight: number;
    private deltaX;
    private deltaY;
    private angularCoefficient;
    private intersectionPoint;
    private distanceSourceTarget;
    private distanceIntersectionSource;
    private breakpointRelativeToSource;
    constructor(x?: number, y?: number);
    /**
     * Date le posizioni di source, target e del breakpoint,
     * la funzione calcola i due parametri peso e distanza del breakpoint
     * @param source posizione del nodo source
     * @param target posizione del nodo target
     */
    setSourceTarget(source: Position, target: Position): void;
    private setWeight;
    private setDistance;
}

declare class GrapholElement {
    private _id;
    private _type;
    private _displayedName?;
    private _originalId?;
    private _iri?;
    constructor(_id: string, _type: GrapholTypesEnum);
    get id(): string;
    set id(value: string);
    get type(): GrapholTypesEnum;
    set type(type: GrapholTypesEnum);
    get displayedName(): string | undefined;
    set displayedName(displayedName: string | undefined);
    get originalId(): string | undefined;
    set originalId(id: string | undefined);
    get iri(): string | undefined;
    set iri(iri: string | undefined);
    /**
     * Check if node is of a certain type
     * @param type
     */
    is(type: GrapholTypesEnum): boolean;
    /**
     *
     * @returns whether node is an entity
     */
    isEntity(): boolean;
    getCytoscapeRepr(grapholEntity?: GrapholEntity): ElementDefinition[];
    clone(): GrapholElement;
}

declare class GrapholEdge extends GrapholElement {
    private _sourceId;
    private _targetId;
    private _breakpoints;
    private _targetLabel?;
    private _sourceLabel?;
    private _sourceEndpoint?;
    private _targetEndpoint?;
    constructor(id: string, type: GrapholTypesEnum);
    addBreakPoint(breakpoint: Breakpoint): void;
    computeBreakpointsDistancesWeights(sourcePosition: Position, targetPosition: Position): void;
    get sourceEndpoint(): Position | undefined;
    set sourceEndpoint(endpoint: Position | undefined);
    get targetEndpoint(): Position | undefined;
    set targetEndpoint(endpoint: Position | undefined);
    /**
     * Returns an array of mid-edge breakpoints (without source/target endpoints)
     */
    get breakpoints(): Breakpoint[];
    /**
     * Returns an array of all the breakpoints (including source/target endpoints)
     */
    get controlpoints(): Breakpoint[];
    set controlpoints(newControlPoints: Breakpoint[]);
    get sourceId(): string;
    set sourceId(sourceId: string);
    get targetId(): string;
    set targetId(targetId: string);
    get targetLabel(): string | undefined;
    set targetLabel(targetLabel: string | undefined);
    get sourceLabel(): string | undefined;
    set sourceLabel(sourceLabel: string | undefined);
    get type(): GrapholTypesEnum;
    set type(newType: GrapholTypesEnum);
    getCytoscapeRepr(grapholEntity?: GrapholEntity): ElementDefinition[];
    clone(): GrapholEdge;
}
declare function isGrapholEdge(elem: GrapholElement): elem is GrapholEdge;

declare class GrapholNode extends GrapholElement {
    private _x;
    private _y;
    private _shape;
    private _identity;
    private _height;
    private _width;
    private _fillColor;
    private _labelHeight;
    private _labelXpos?;
    private _labelXcentered?;
    private _labelYpos?;
    private _labelYcentered?;
    private _fontSize?;
    protected _fakeNodes: GrapholNode[];
    private _inputs?;
    private _shapePoints?;
    get position(): Position;
    set position(pos: Position);
    get x(): number;
    set x(valX: number);
    get y(): number;
    set y(valY: number);
    get shape(): Shape;
    set shape(shape: Shape);
    get identity(): GrapholTypesEnum;
    set identity(identity: GrapholTypesEnum);
    get width(): number;
    set width(width: number);
    get height(): number;
    set height(height: number);
    get fillColor(): string;
    set fillColor(fillColor: string);
    get labelXpos(): number | undefined;
    set labelXpos(labelXpos: number | undefined);
    setLabelXposFromXML(labelXpos: number): void;
    get labelHeight(): number;
    set labelHeight(value: number);
    get labelYpos(): number | undefined;
    set labelYpos(labelYpos: number | undefined);
    setLabelYposFromXML(labelYpos: number): void;
    get isLabelXcentered(): boolean | undefined;
    get isLabelYcentered(): boolean | undefined;
    get fontSize(): number | undefined;
    set fontSize(value: number | undefined);
    get inputs(): string[] | undefined;
    set inputs(inputs: string[] | undefined);
    get shapePoints(): string | undefined;
    set shapePoints(shapePoints: string | undefined);
    get fakeNodes(): GrapholNode[];
    addFakeNode(newFakeNode: GrapholNode): void;
    getCytoscapeRepr(grapholEntity?: GrapholEntity): ElementDefinition[];
    clone(): GrapholNode;
}
declare function isGrapholNode(elem: GrapholElement): elem is GrapholNode;

declare enum ColoursNames {
    /** Foreground color, used for main texts */
    fg_default = "fg-default",
    /** Foreground muted, should be darker than default. Used for secondary text */
    fg_muted = "fg-muted",
    /** Foreground muted, should be lighter and softer than default.
     * Used for placeholders, tips and text used for clarifying UI objects
     */
    fg_subtle = "fg-subtle",
    /** Foreground text colour placed on a surface of a emphasy color such as accent, danger, success and so on */
    fg_on_emphasis = "fg-on-emphasis",
    /** Main background surface colours used in UI widgets */
    bg_default = "bg-default",
    /** Background color to create a higher or lower level with respect to bg_default color */
    bg_inset = "bg-inset",
    /** Borders main color */
    border_default = "border-default",
    /** Softer than default, used for creating softer separations between UI objects */
    border_subtle = "border-subtle",
    shadow = "shadow",
    /** Used to emphasize secondary elements or texts. Like active elements */
    neutral = "neutral",
    /** Emphasize secondary elements, should be darker than default */
    neutral_muted = "neutral-muted",
    /** Emphasize secondary elements, used for active elements borders */
    neutral_subtle = "neutral-subtle",
    /** Primary color for selected/active elements in diagram or activable elemnts like toggles */
    accent = "accent",
    /** Primary color in darker tone, used for decorations like surfaces or borders */
    accent_muted = "accent-muted",
    /** Primary color in lighter tone, used for decorations like toggle's background color */
    accent_subtle = "accent-subtle",
    /** Color for denoting a successful action */
    success = "success",
    /** Denote successful action in darker tone, used for texts or borders */
    success_muted = "success-muted",
    /** Denote successful action in lighter tone, used for backgrounds or surfaces */
    success_subtle = "success-subtle",
    /** Color for denoting warnings */
    attention = "attention",
    /** Color for denoting warnings in darker tone, used for texts or borders */
    attention_muted = "attention-muted",
    /** Color for denoting warnings in lighter tone, used for backgrounds or surfaces */
    attention_subtle = "attention-subtle",
    /** Color for denoting errors */
    danger = "danger",
    /** Color for denoting errors in darker tone, used for texts or borders */
    danger_muted = "danger-muted",
    /** Color for denoting errors in lighter tone, used for backgrounds or surfaces */
    danger_subtle = "danger-subtle",
    /** Color used for classes' nodes bodies */
    class = "class",
    /** Color used for classes' nodes borders */
    class_contrast = "class-contrast",
    /** Color used for object properties' nodes bodies */
    object_property = "object-property",
    /** Color used for object properties' nodes borders */
    object_property_contrast = "object-property-contrast",
    /** Color used for data properties' nodes bodies */
    data_property = "data-property",
    /** Color used for data properties' nodes borders */
    data_property_contrast = "data-property-contrast",
    /** Color used for individual's nodes bodies */
    individual = "individual",
    /** Color used for individual's nodes borders */
    individual_contrast = "individual-contrast",
    /** Background color used in the diagram canvas */
    bg_graph = "bg-graph",
    /** Body color for nodes that are white in plain Graphol */
    bg_node_light = "bg-node-light",
    /** Body color for nodes that are black in plain Graphol */
    bg_node_dark = "bg-node-dark",
    /** Body border color */
    border_node = "border-node",
    /** Nodes/Edges label color */
    label = "label",
    /** Opposite color of label */
    label_contrast = "label-contrast",
    /** Edges lines color */
    edge = "edge",
    class_instance = "class-instance",
    class_instance_contrast = "class-instance-contrast"
}
type ColourMap = {
    [key in ColoursNames]?: string;
};

declare class GrapholscapeTheme {
    private _id;
    private _name;
    colours: ColourMap;
    constructor(id: string, colours?: ColourMap, name?: string);
    get id(): string;
    get name(): string;
    set name(newName: string);
    getColour(name: ColoursNames): string | undefined;
    setColour(name: ColoursNames, colourValue: string): void;
}

declare enum LifecycleEvent {
    DiagramChange = "diagramChange",
    RendererChange = "rendererChange",
    ThemeChange = "themeChange",
    EntitySelection = "entitySelection",
    NodeSelection = "nodeSelection",
    EdgeSelection = "edgeSelection",
    LanguageChange = "languageChange",
    EntityNameTypeChange = "entityNameTypeChange",
    Filter = "filter",
    Unfilter = "unfilter",
    FilterRequest = "filterRequest",
    UnfilterRequest = "unfilterRequest",
    BackgroundClick = "backgroundClick",
    ContextClick = "contextClick",
    EntityWikiLinkClick = "entityWikiLinkClick"
}
interface IonEvent$1 {
    (event: LifecycleEvent.EntitySelection, callback: (entity: GrapholEntity, instance: GrapholElement) => void): void;
    (event: LifecycleEvent.NodeSelection, callback: (node: GrapholNode) => void): void;
    (event: LifecycleEvent.EdgeSelection, callback: (edge: GrapholEdge) => void): void;
    (event: LifecycleEvent.ThemeChange, callback: (theme: GrapholscapeTheme) => void): void;
    (event: LifecycleEvent.DiagramChange, callback: (diagram: Diagram) => void): void;
    (event: LifecycleEvent.RendererChange, callback: (renderer: RendererStatesEnum) => void): void;
    (event: LifecycleEvent.LanguageChange, callback: (language: string) => void): void;
    (event: LifecycleEvent.EntityNameTypeChange, callback: (nameType: EntityNameType) => void): void;
    (event: LifecycleEvent.Filter, callback: (filter: Filter) => void): void;
    (event: LifecycleEvent.Unfilter, callback: (filter: Filter) => void): void;
    (event: LifecycleEvent.FilterRequest, callback: (filter: Filter) => boolean): void;
    (event: LifecycleEvent.UnfilterRequest, callback: (filter: Filter) => boolean): void;
    (event: LifecycleEvent.BackgroundClick, callback: () => void): void;
    (event: LifecycleEvent.ContextClick, callback: (eventObject: EventObject) => void): void;
    (event: LifecycleEvent.EntityWikiLinkClick, callback: (iri: string) => void): void;
}
declare class Lifecycle {
    private diagramChange;
    private rendererChange;
    private themeChange;
    private entitySelection;
    private nodeSelection;
    private edgeSelection;
    private languageChange;
    private entityNameTypeChange;
    private filter;
    private unfilter;
    private filterRequest;
    private unfilterRequest;
    private backgroundClick;
    private contextClick;
    entityWikiLinkClick: ((iri: string) => void)[];
    constructor();
    trigger(event: LifecycleEvent.EntitySelection, entity: GrapholEntity, instance: GrapholElement): void;
    trigger(event: LifecycleEvent.NodeSelection, node: GrapholNode): void;
    trigger(event: LifecycleEvent.EdgeSelection, edge: GrapholEdge): void;
    trigger(event: LifecycleEvent.ThemeChange, theme: GrapholscapeTheme): void;
    trigger(event: LifecycleEvent.DiagramChange, diagram: Diagram): void;
    trigger(event: LifecycleEvent.RendererChange, renderState: RendererStatesEnum): void;
    trigger(event: LifecycleEvent.LanguageChange, language: Language): void;
    trigger(event: LifecycleEvent.EntityNameTypeChange, nameType: EntityNameType): void;
    trigger(event: LifecycleEvent.Filter, filter: Filter): void;
    trigger(event: LifecycleEvent.Unfilter, filter: Filter): void;
    trigger(event: LifecycleEvent.FilterRequest, filter: Filter): boolean;
    trigger(event: LifecycleEvent.UnfilterRequest, filter: Filter): boolean;
    trigger(event: LifecycleEvent.BackgroundClick): void;
    trigger(event: LifecycleEvent.ContextClick, eventObject: EventObject): void;
    trigger(event: LifecycleEvent.EntityWikiLinkClick, iri: string): void;
    on: IonEvent$1;
}

declare class Renderer {
    private _container;
    cy?: cytoscape__default.Core;
    private _renderState?;
    filters: Map<string, Filter>;
    diagram?: Diagram;
    private _theme;
    private _lifecycle;
    FOCUS_ZOOM_LEVEL: number;
    renderStateData: {
        [x: string]: any;
    };
    constructor(renderState?: RenderState);
    set lifecycle(lc: Lifecycle);
    set renderState(rs: RenderState | undefined);
    get renderState(): RenderState | undefined;
    get theme(): GrapholscapeTheme;
    render(diagram: Diagram): void;
    mount(): void;
    addElement(element: ElementDefinition): void;
    /**
     * Filter elements on the diagram.
     * It will be actually applied only if the user defined callback on the event
     * {@link !model.LifecycleEvent.FilterRequest} returns true and if the internal logic
     * allows for the filter to be applied.
     * @param filter Can be an object of type {@link !model.Filter}, {@link !model.DefaultFilterKeyEnum}
     * or a string representing the unique key of a defined filter
     */
    filter: (filter: Filter | DefaultFilterKeyEnum | string) => void;
    private performFilter;
    /**
     * Unfilter elements on the diagram.
     * It will be actually deactivated only if the user defined callback on the event
     * {@link !model.LifecycleEvent.FilterRequest} returns true and if the internal logic
     * allows for the filter to be deactivated.
     * @param filter Can be an object of type {@link !model.Filter}, {@link !model.DefaultFilterKeyEnum}
     * or a string representing the unique key of a defined filter
     */
    unfilter: (filter: Filter | DefaultFilterKeyEnum | string) => void;
    private getFilter;
    private applyActiveFilters;
    private performAllFilters;
    stopRendering(): void;
    /**
     * Select a node or an edge in the current diagram given its unique id
     * @param {string} elementId elem id (node or edge)
     */
    selectElement(elementId: string): void;
    /**
     * Unselect every selected element in this diagram
     */
    unselect(): void;
    /**
     * Fit viewport to diagram
     */
    fit(): void;
    /**
     * Put a set of elements (nodes and/or edges) at the center of the viewport.
     * If just one element then the element will be at the center.
     * @param elementId the element's ID
     * @param zoom the zoom level to apply, if not passed, zoom level won't be changed
     */
    centerOnElementById(elementId: string, zoom?: number | undefined, select?: boolean): void;
    centerOnElement(element: GrapholElement, zoom?: number, select?: boolean): void;
    centerOnModelPosition(xPos: number, yPos: number, zoom?: number): void;
    centerOnRenderedPosition(xPos: number, yPos: number, zoom?: number): void;
    zoom(zoomValue: number): void;
    zoomIn(zoomValue: number): void;
    zoomOut(zoomValue: number): void;
    setTheme(theme: GrapholscapeTheme): void;
    applyTheme(): void;
    updateElement(grapholElement: GrapholElement): void;
    get isThemeApplied(): cytoscape__default.ElementStylesheetStyle | cytoscape__default.ElementStylesheetCSS | undefined;
    get grapholElements(): Map<string, GrapholElement> | undefined;
    get selectedElement(): GrapholElement | undefined;
    get viewportState(): {
        zoom: number;
        pan: cytoscape__default.Position;
    } | undefined;
    set container(container: HTMLElement);
    get container(): HTMLElement;
    /**
     * Getter
     */
    get nodes(): string[] | undefined;
    /**
     * Getter
     */
    get edges(): string[] | undefined;
}

declare class GrapholRendererState extends BaseRenderer {
    layout: cytoscape.Layouts;
    id: RendererStatesEnum;
    cyConfig: cytoscape.CytoscapeOptions;
    filterManager: FilterManager;
    render(): void;
    stopRendering(): void;
    runLayout(): void;
    stopLayout(): void;
    getGraphStyle(theme: GrapholscapeTheme): Stylesheet[];
    transformOntology(ontology: Ontology): void;
}

declare class LiteRendererState extends BaseRenderer {
    readonly id: RendererStatesEnum;
    filterManager: FilterManager;
    cyConfig: CytoscapeOptions;
    private _layout;
    runLayout(): void;
    render(): void;
    stopRendering(): void;
    stopLayout(): void;
    getGraphStyle(theme: GrapholscapeTheme): cytoscape$1.Stylesheet[];
    transformOntology(ontology: Ontology): void;
    get layout(): cytoscape$1.Layouts;
    set layout(newLayout: cytoscape$1.Layouts);
}

declare class FloatyRendererState extends BaseRenderer {
    readonly id: RendererStatesEnum;
    filterManager: FilterManager;
    protected _layout: cytoscape__default.Layouts;
    set renderer(newRenderer: Renderer);
    get renderer(): Renderer;
    transformOntology(ontology: Ontology): void;
    runLayout(): void;
    render(): void;
    stopRendering(): void;
    getGraphStyle(theme: GrapholscapeTheme): cytoscape__default.Stylesheet[];
    stopLayout(): void;
    runLayoutInfinitely(): void;
    pinNode(nodeOrId: NodeSingular | string): void;
    unpinAll(): void;
    private setPopperStyle;
    private updatePopper;
    unpinNode(nodeOrId: string | NodeSingular): void;
    private removeUnlockButton;
    protected setDragAndPinEventHandlers(): void;
    private grabHandler;
    private freeHandler;
    protected defaultLayoutOptions: {
        name: string;
        avoidOverlap: boolean;
        edgeLength: (edge: any) => any;
        fit: boolean;
        maxSimulationTime: number;
        infinite: boolean;
        handleDisconnected: boolean;
        centerGraph: boolean;
    };
    centerOnElementById(elementId: string, zoom?: number, select?: boolean): void;
    get floatyLayoutOptions(): any;
    set floatyLayoutOptions(newOptions: any);
    protected automoveOptions: {
        nodesMatching: (node: NodeSingular) => boolean | undefined;
        reposition: string;
        dragWith: string;
    };
    get isLayoutInfinite(): boolean;
    get dragAndPin(): boolean;
    set dragAndPin(isActive: boolean);
    protected get popperContainer(): HTMLDivElement | undefined;
    protected get popperContainers(): Map<number, HTMLDivElement>;
    get layout(): cytoscape__default.Layouts;
}

/**
 * The incremental renderer state is a kind of floaty renderer state in which
 * ontology's diagrams are used only to compute what to show.
 * There is only a single empty diagram and any render() call just render the same diagram
 * no matter what was the input diagram.
 *
 * This renderer state is logic agnostic, meaning that it does not control what to show and when.
 * You can decide what to show/hide outside, based on lifecycle and/or other custom developed widgets.
 */
declare class IncrementalRendererState extends FloatyRendererState {
    readonly id = RendererStatesEnum.INCREMENTAL;
    filterManager: FilterManager;
    private previousDiagram;
    render(): void;
    runLayout(): void;
    /** lock all nodes */
    freezeGraph(): void;
    /** unlock all nodes that are not pinned (pinned can be unlocked only with unpin) */
    unFreezeGraph(): void;
    stopRendering(): void;
    transformOntology(ontology: Ontology): void;
    getGraphStyle(theme: GrapholscapeTheme): Stylesheet[];
    reset(): void;
    set renderer(newRenderer: Renderer);
    get renderer(): Renderer;
}

/**
 * @typedef {object} Filter
 * @property {string} Filter.selector Cytoscape selector identifying the elements to filter out
 * [cytoscape selectors](https://js.cytoscape.org/#selectors)
 * @property {boolean} Filter.active whether the filter is currently active or not
 * @property {boolean} Filter.activable whether the filter is currently activable
 * @property {string} Filter.class the class to add to filtered elems to easily retrieve them later on
 * @property {string} Filter.key unique key to identify a filter
 */
declare class Filter {
    private _key;
    private _compareFn;
    active: boolean;
    private _locked;
    /**
     *
     * @param key Unique identifier
     * @param compareFn Function receiving a GrapholElement and returning true if the element should be filtered, false otherwise
     */
    constructor(key: string, compareFn: (grapholElement: GrapholElement) => boolean);
    get key(): string;
    get filterTag(): string;
    get locked(): boolean;
    lock(): void;
    unlock(): void;
    shouldFilter(grapholElement: GrapholElement): boolean;
}
declare enum DefaultFilterKeyEnum {
    ALL = "all",
    DATA_PROPERTY = "data-property",
    VALUE_DOMAIN = "value-domain",
    INDIVIDUAL = "individual",
    UNIVERSAL_QUANTIFIER = "for-all",
    COMPLEMENT = "complement",
    HAS_KEY = "has-key"
}
declare const getDefaultFilters: () => {
    readonly DATA_PROPERTY: Filter;
    readonly VALUE_DOMAIN: Filter;
    readonly INDIVIDUAL: Filter;
    readonly UNIVERSAL_QUANTIFIER: Filter;
    readonly COMPLEMENT: Filter;
    readonly HAS_KEY: Filter;
};

interface FilterManager {
    filters: Map<string, Filter>;
    filterActivation: (filter: Filter) => boolean;
    filterDeactivation: (filter: Filter) => boolean;
}
declare abstract class BaseFilterManager implements FilterManager {
    protected _filters: Map<string, Filter>;
    protected lockedFilters: DefaultFilterKeyEnum[];
    filterActivation(filter: Filter): boolean;
    filterDeactivation(filter: Filter): boolean;
    get filters(): Map<string, Filter>;
    set filters(filters: Map<string, Filter>);
}

declare enum RendererStatesEnum {
    GRAPHOL = "graphol",
    GRAPHOL_LITE = "lite",
    FLOATY = "floaty",
    INCREMENTAL = "incremental"
}
interface RenderState {
    id: RendererStatesEnum;
    renderer: Renderer;
    filterManager: FilterManager;
    layout: cytoscape.Layouts;
    layoutRunning: boolean;
    render(): void;
    stopRendering(): void;
    filter(elementId: string, filter: Filter): void;
    unfilter(elementId: string, filter: Filter): void;
    runLayout(): void;
    stopLayout(): void;
    getGraphStyle(theme: GrapholscapeTheme): Stylesheet[];
    transformOntology(ontology: Ontology): void;
    centerOnElementById(elementId: string, zoom?: number, select?: boolean): void;
}

/**
 * Class representing a namespace
 * @property {string[]} prefixes - array of prefixes
 * @property {string} value - namespace lexical form
 * @property {boolean} standard - bool saying if the namespace is standard or user defined
 */
declare class Namespace {
    private _prefixes;
    private _value;
    private _standard;
    constructor(prefixes: string[], value: string, standard?: boolean);
    get prefixes(): string[];
    private set prefixes(value);
    private set value(value);
    toString(): string;
    private set standard(value);
    /**
     * Wether the namespace is standard (`true`) or user defined (`false`)
     */
    isStandard(): boolean;
    /**
     * Check if the passed prefix is assigned to this namespace
     * @param prefix the prefix to check
     */
    hasPrefix(prefix: string): boolean;
    addPrefix(newPrefix: string): void;
}

declare class Iri {
    private _namespace?;
    private _remainder;
    constructor(iri: string, namespaces: Namespace[], remainder?: string);
    set remainder(value: string);
    get remainder(): string;
    private set namespace(value);
    get namespace(): Namespace | undefined;
    get prefix(): string | undefined;
    get fullIri(): string;
    get prefixed(): string;
    equals(iriToCheck: string | Iri): boolean;
    hasPrefix(prefixToCheck: string): boolean;
}

declare enum FunctionalityEnum {
    functional = "functional",
    inverseFunctional = "inverseFunctional",
    transitive = "transitive",
    symmetric = "symmetric",
    asymmetric = "asymmetric",
    reflexive = "reflexive",
    irreflexive = "irreflexive"
}
type EntityOccurrence = {
    elementId: string;
    diagramId: number;
};
declare class GrapholEntity extends AnnotatedElement {
    private _iri;
    private _occurrences;
    private _type;
    private _datatype;
    private _functionalities;
    constructor(iri: Iri, type: GrapholTypesEnum);
    addOccurrence(occurenceId: string, diagramId: number, representationKind?: RendererStatesEnum): void;
    removeOccurrence(occurrenceId: string, diagramId: number, representationKind: RendererStatesEnum): void;
    /**
     * Get all occurrences of the entity in a given diagram
     * @param diagramId the diagram in which the entity must occurr
     * @param representationKind the diagram representation identifier ({@link RendererStatesEnum})
     * if not set, all representations will be considered
     * @returns A map with the occurrences in the original Graphol representation and other
     * replicated occurrences in other diagram representations
     */
    getOccurrencesByDiagramId(diagramId: number, representationKind?: RendererStatesEnum): Map<RendererStatesEnum, EntityOccurrence[]>;
    get type(): GrapholTypesEnum;
    set type(type: GrapholTypesEnum);
    /**
     * Check if entity is of a certain type
     * @param type
     */
    is(type: GrapholTypesEnum): boolean;
    get occurrences(): Map<RendererStatesEnum, EntityOccurrence[]>;
    set iri(val: Iri);
    get iri(): Iri;
    get functionalities(): FunctionalityEnum[];
    set functionalities(functionalities: FunctionalityEnum[]);
    get datatype(): string;
    set datatype(datatype: string);
    hasFunctionality(functionalityKind: FunctionalityEnum): boolean;
    hasOccurrenceInDiagram(diagramId: number, representationKind: RendererStatesEnum): boolean;
    getDisplayedName(nameType: EntityNameType, currentLanguage?: string): string;
    getEntityOriginalNodeId(): string | undefined;
}

declare class DiagramRepresentation {
    private _cy;
    private _grapholElements;
    private _hasEverBeenRendered;
    constructor(cyConfig?: cytoscape__default.CytoscapeOptions);
    get cy(): cytoscape__default.Core;
    set cy(newCy: cytoscape__default.Core);
    get hasEverBeenRendered(): boolean;
    set hasEverBeenRendered(value: boolean);
    /**
     * Add a new element (node or edge) to the diagram
     * @param newElement the GrapholElement to add to the diagram
     */
    addElement(newElement: GrapholElement, grapholEntity?: GrapholEntity): void;
    removeElement(elementId: string): void;
    clear(): void;
    updateElement(element: GrapholElement, updatePosition?: boolean): void;
    updateElement(elementId: string, updatePosition?: boolean): void;
    containsEntity(iriOrGrapholEntity: Iri | GrapholEntity): boolean;
    get grapholElements(): Map<string, GrapholElement>;
    set grapholElements(newElementMap: Map<string, GrapholElement>);
    /**
     * Getter
     */
    get nodes(): string[];
    /**
     * Getter
     */
    get edges(): string[];
}

type ViewportState = {
    pan: Position;
    zoom: number;
};
/**
 * @property {string} name - diagram's name
 * @property {string | number} id - diagram's identifier
 */
declare class Diagram {
    name: string;
    id: number;
    representations: Map<RendererStatesEnum, DiagramRepresentation>;
    lastViewportState: ViewportState;
    /**
     * @param {string} name
     * @param {number} id
     */
    constructor(name: string, id: number);
    /**
     * Add a new element (node or edge) to the diagram's representation
     * @param newElement the GrapholElement to add to the diagram
     */
    addElement(newElement: GrapholElement, grapholEntity?: GrapholEntity): void;
    /**
     * Delete every element from a diagram
     * @param rendererState optional, if you pass a particular rendererState, only its representation will be cleared.
     * If you don't pass any rendererState, all representations will be cleared
     */
    clear(rendererState?: RendererStatesEnum): void;
}

declare class Hierarchy {
    type: GrapholTypesEnum.UNION | GrapholTypesEnum.DISJOINT_UNION;
    private _id?;
    private _inputs;
    private _superclasses;
    constructor(type: GrapholTypesEnum.UNION | GrapholTypesEnum.DISJOINT_UNION);
    addInput(classIri: string): void;
    addSuperclass(classIri: string, complete?: boolean): void;
    get inputs(): string[];
    get superclasses(): {
        classIri: string;
        complete?: boolean | undefined;
    }[];
    set id(newId: string | undefined);
    get id(): string | undefined;
    getUnionGrapholNode(position?: Position): GrapholNode | undefined;
    getInputGrapholEdges(): GrapholEdge[] | undefined;
    getInclusionEdges(): GrapholEdge[] | undefined;
    isDisjoint(): boolean;
    private isValid;
}

/**
 * # Ontology
 * Class used as the Model of the whole app.
 */
declare class Ontology extends AnnotatedElement {
    name: string;
    version: string;
    namespaces: Namespace[];
    diagrams: Diagram[];
    languages: {
        list: any[];
        default: string;
    };
    iri?: string;
    private _entities;
    hierarchiesBySubclassMap: Map<string, Hierarchy[]>;
    hierarchiesBySuperclassMap: Map<string, Hierarchy[]>;
    /**
     * @param {string} name
     * @param {string} version
     * @param {Namespace[]} namespaces
     * @param {Diagram[]} diagrams
     */
    constructor(name: string, version: string, iri?: string, namespaces?: Namespace[], diagrams?: Diagram[]);
    /** @param {Namespace} namespace */
    addNamespace(namespace: Namespace): void;
    /**
     * Get the Namspace object given its IRI string
     * @param {string} iriValue the IRI assigned to the namespace
     * @returns {Namespace}
     */
    getNamespace(iriValue: string): Namespace | undefined;
    /**
     * Get the Namespace given one of its prefixes
     * @param {string} prefix
     * @returns {Namespace}
     */
    getNamespaceFromPrefix(prefix: string): Namespace | undefined;
    /** @param {Diagram} diagram */
    addDiagram(diagram: Diagram): void;
    /**
     * Get the diagram with the given id
     */
    getDiagram(diagramId: number): Diagram | undefined;
    getDiagramByName(name: string): Diagram | undefined;
    addEntity(entity: GrapholEntity): void;
    getEntity(iri: string): GrapholEntity | null;
    getEntitiesByType(entityType: GrapholTypesEnum.CLASS | GrapholTypesEnum.OBJECT_PROPERTY | GrapholTypesEnum.DATA_PROPERTY | GrapholTypesEnum.INDIVIDUAL): GrapholEntity[];
    getEntityFromOccurrence(entityOccurrence: EntityOccurrence): GrapholEntity | null | undefined;
    getGrapholElement(elementId: string, diagramId?: number, renderState?: RendererStatesEnum): GrapholElement | undefined;
    getGrapholNode(nodeId: string, diagramId?: number, renderState?: RendererStatesEnum): GrapholNode | undefined;
    getGrapholEdge(edgeId: string, diagramId?: number, renderState?: RendererStatesEnum): GrapholNode | undefined;
    /**
     * Retrieve an entity by its IRI.
     * @param {string} iri - The IRI in full or prefixed form.
     * i.e. : `grapholscape:world` or `https://examples/grapholscape/world`
     * @returns {cytoscape.CollectionReturnValue} The cytoscape object representation.
     */
    /**
     * Retrieve all occurrences of an entity by its IRI.
     * @param {string} iri - The IRI in full or prefixed form.
     * i.e. : `grapholscape:world` or `https://examples/grapholscape/world`
     * @returns An array of EntityOccurrence objects
     */
    getEntityOccurrences(iri: string, diagramId?: number, renderState?: RendererStatesEnum): Map<RendererStatesEnum, EntityOccurrence[]> | undefined;
    /**
     * Get the entities in the ontology
     * @returns {Object.<string, cytoscape.CollectionReturnValue[]>} a map of IRIs, with an array of entity occurrences (object[iri].occurrences)
     */
    /**
     * Check if entity has the specified iri in full or prefixed form
     * @param {Entity} entity
     * @param {string} iri
     * @returns {boolean}
     */
    /**
     * Retrieve the full IRI given a prefixed IRI
     * @param {string} prefixedIri a prefixed IRI
     * @returns {string} full IRI
     */
    prefixedToFullIri(prefixedIri: string): string | undefined;
    computeDatatypesOnDataProperties(): void;
    get isEntitiesEmpty(): boolean;
    get entities(): Map<string, GrapholEntity>;
}

/** @internal */
declare class ClassInstanceEntity extends GrapholEntity {
    private _parentClassIris;
    constructor(iri: Iri, parentClassIris?: Iri[]);
    /**
     * Set the instance to be instance of a particular Class.
     * If it is already instance of such a class, no changes will be made.
     * @param parentClassIri the IRI of the Class
     */
    addParentClass(parentClassIri: Iri): void;
    /**
     * Check if the instance is instance of a class with such an IRI
     * @param parentClassIri
     * @returns
     */
    hasParentClassIri(parentClassIri: string | Iri): Iri | undefined;
    get isRDFTypeUnknown(): boolean;
    get parentClassIris(): Iri[];
}

declare class IncrementalDiagram extends Diagram {
    static ID: number;
    /** @internal */
    classInstances?: Map<string, ClassInstanceEntity>;
    constructor();
    addElement(newElement: GrapholElement, grapholEntity?: GrapholEntity): void;
    removeElement(elementId: string): void;
    containsEntity(iriOrGrapholEntity: Iri | GrapholEntity): boolean | undefined;
    get representation(): DiagramRepresentation | undefined;
}

declare enum DefaultThemesEnum {
    GRAPHOLSCAPE = "grapholscape",
    GRAPHOL = "graphol",
    DARK = "dark"
}
declare const gscapeColourMap: ColourMap;
declare const classicColourMap: ColourMap;
declare const darkColourMap: ColourMap;
declare const DefaultThemes: {
    [key in DefaultThemesEnum]: GrapholscapeTheme;
};

declare const CSS_PROPERTY_NAMESPACE = "--gscape-color";

declare abstract class BaseRenderer implements RenderState {
    protected _renderer: Renderer;
    abstract id: RendererStatesEnum;
    abstract filterManager: FilterManager;
    abstract layout: cytoscape.Layouts;
    abstract render(): void;
    abstract stopRendering(): void;
    abstract runLayout(): void;
    abstract stopLayout(): void;
    abstract getGraphStyle(theme: GrapholscapeTheme): Stylesheet[];
    abstract transformOntology(ontology: Ontology): void;
    layoutRunning: boolean;
    constructor(renderer?: Renderer);
    centerOnElementById(elementId: string, zoom?: number, select?: boolean): void;
    set renderer(newRenderer: Renderer);
    get renderer(): Renderer;
    filter(elementId: string, filter: Filter): void;
    unfilter(elementId: string, filter: Filter): void;
}

declare enum WidgetEnum {
    DIAGRAM_SELECTOR = "diagram-selector",
    ENTITY_DETAILS = "details",
    ENTITY_SELECTOR = "entity-selector",
    FILTERS = "filters",
    FIT_BUTTON = "fit-button",
    FULLSCREEN_BUTTON = "fullscreen-button",
    ONTOLOGY_EXPLORER = "ontology-explorer",
    ONTOLOGY_INFO = "ontology-info",
    OWL_VISUALIZER = "owl-visualizer",
    RENDERER_SELECTOR = "renderer-selector",
    LAYOUT_SETTINGS = "layout-settings",
    SETTINGS = "settings",
    ZOOM_TOOLS = "zoom-tools",
    INITIAL_RENDERER_SELECTOR = "initial-renderer-selector",
    /** @internal */
    CLASS_INSTANCE_DETAILS = "class-instance-details",
    /** @internal */
    INSTANCES_EXPLORER = "instances-explorer",
    /** @internal */
    NAVIGATION_MENU = "naviagtion-menu",
    /** @internal */
    VKG_PREFERENCES = "vkg-preferences"
}

declare enum Language {
    DE = "de",
    EN = "en",
    ES = "es",
    FR = "fr",
    IT = "it"
}
declare enum EntityNameType {
    LABEL = "label",
    PREFIXED_IRI = "prefixedIri",
    FULL_IRI = "fullIri"
}
type WidgetsConfig = {
    [key in WidgetEnum]?: boolean;
};
type ThemeConfig = GrapholscapeTheme | DefaultThemesEnum;
type GrapholscapeConfig = {
    themes?: ThemeConfig[];
    selectedTheme?: string;
    language?: Language | string;
    entityNameType?: EntityNameType;
    renderers?: RendererStatesEnum[];
    selectedRenderer?: RendererStatesEnum;
    widgets?: WidgetsConfig;
    initialRendererSelection?: boolean;
};

/**
 * Load config from local storage
 */
declare function loadConfig(): GrapholscapeConfig;
/**
 * Store a single setting in local storage
 * @param {string} k the key of the setting to store
 * @param {any} value the value of the setting to store
 */
declare function storeConfigEntry(k: string, value: any): void;
declare function clearLocalStorage(): void;

declare const _default$b: CytoscapeOptions;

declare const liteOptions: {
    layout: {
        name: string;
    };
    autoungrabify: boolean;
    maxZoom: number;
    minZoom: number;
    wheelSensitivity: number;
};
declare const floatyOptions: {
    layout: {
        name: string;
    };
    autoungrabify: boolean;
    maxZoom: number;
    minZoom: number;
    wheelSensitivity: number;
};

type MastroEndpoint = {
    description?: string;
    name: string;
    mastroID?: MastroID;
    needRestart?: boolean;
    user?: string;
};
type MastroID = {
    avpID: string;
    datasourceID: string;
    mappingID: string;
    ontologyID: {
        ontologyName: string;
        ontologyVersion: string;
    };
};
declare enum QueryStatusEnum {
    FINISHED = "FINISHED",
    UNAVAILABLE = "UNAVAILABLE",
    ERROR = "ERROR",
    RUNNING = "RUNNING",
    READY = "READY",
    STOPPED = "STOPPED"
}
type RequestOptions = {
    basePath: string;
    version: string;
    name: string;
    headers: any;
    onError: (errorObject: any) => void;
};
type MWSEntity = {
    entityIRI: string;
    entityID: string;
    entityPrefixIRI: string;
    entityRemainder: string;
    entityType: string;
};
type EmptyUnfoldingEntities = {
    emptyUnfoldingClasses: MWSEntity[];
    emptyUnfoldingDataProperties: MWSEntity[];
    emptyUnfoldingObjectProperties: MWSEntity[];
};
type MaterializedCounts = {
    countsMap: Map<string, CountEntry>;
    endTime: number;
    percentage: number;
    startTime: number;
    state: QueryStatusEnum;
};
type CountEntry = {
    count: number;
    error?: string;
    state: QueryStatusEnum;
    entity: MWSEntity;
};

/**
 * Swagger Sparqling WS
 * This server will expose an API to Sparqling front end to create new SPARQL queries with a combinations of point and click on the [GRAPHOLscape](https://github.com/obdasystems/grapholscape) graph.  Sparqling will be released as a standalone appication but also the server will embedded in [MWS](https://github.com/obdasystems/mws) and Sparqling will be integrated in [Monolith](https://www.monolith.obdasystems.com/).
 *
 * The version of the OpenAPI document: 1.0.1
 * Contact: info@obdasystems.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 *
 * @export
 * @interface Branch
 */
interface Branch {
    /**
     *
     * @type {string}
     * @memberof Branch
     */
    objectPropertyIRI?: string;
    /**
     * It is true when domain and range are the same class.
     * @type {boolean}
     * @memberof Branch
     */
    cyclic?: boolean;
    /**
     *
     * @type {boolean}
     * @memberof Branch
     */
    direct?: boolean;
    /**
     *
     * @type {Array<string>}
     * @memberof Branch
     */
    relatedClasses?: Array<string>;
}

/**
 * Swagger Sparqling WS
 * This server will expose an API to Sparqling front end to create new SPARQL queries with a combinations of point and click on the [GRAPHOLscape](https://github.com/obdasystems/grapholscape) graph.  Sparqling will be released as a standalone appication but also the server will embedded in [MWS](https://github.com/obdasystems/mws) and Sparqling will be integrated in [Monolith](https://www.monolith.obdasystems.com/).
 *
 * The version of the OpenAPI document: 1.0.1
 * Contact: info@obdasystems.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @interface Highlights
 */
interface Highlights {
    /**
     * Subclasses or brother classes
     * @type {Array<string>}
     * @memberof Highlights
     */
    classes?: Array<string>;
    /**
     *
     * @type {Array<Branch>}
     * @memberof Highlights
     */
    objectProperties?: Array<Branch>;
    /**
     *
     * @type {Array<string>}
     * @memberof Highlights
     */
    dataProperties?: Array<string>;
}

type ClassInstance = {
    iri: string;
    shortIri?: string;
    label?: {
        language?: string;
        value: string;
    };
    searchMatch?: string;
};
interface IVirtualKnowledgeGraphApi {
    getInstances: (iri: string, includeLabels: boolean, onNewResults: (classInstances: ClassInstance[][], numberResultsAvailable: number) => void, onStop?: () => void, searchText?: string) => void;
    getNewResults: (executionId: string, pageNumber: number, onNewResults: (classInstances: ClassInstance[][], numberResultsAvailable: number) => void, onStop?: () => void, pageSize?: number) => Promise<void>;
    getInstancesByPropertyValue: (classIri: string, propertyIri: string, propertyType: string, propertyValue: string, includeLabels: boolean, onNewResults: (classInstances: ClassInstance[][], numberResultsAvailable: number) => void, isDirect?: boolean, onStop?: () => void) => void;
    getInstancesNumber: (iri: string, onResult: (resultCount: number) => void, onStop?: () => void) => void;
    getHighlights: (iri: string) => Promise<Highlights>;
    getEntitiesEmptyUnfoldings: (endpoint: MastroEndpoint) => Promise<EmptyUnfoldingEntities>;
    getInstanceDataPropertyValues: (instanceIri: string, dataPropertyIri: string, onNewResults: (values: string[]) => void, onStop?: () => void) => void;
    getInstancesThroughObjectProperty: (instanceIri: string, objectPropertyIri: string, isDirect: boolean, includeLabels: boolean, onNewResults: (classInstances: ClassInstance[][], numberResultsAvailable: number) => void, rangeClassIri?: string, dataPropertyFilterIri?: string, textSearch?: string, onStop?: () => void) => void;
    setEndpoint: (endpoint: MastroEndpoint) => void;
    instanceCheck: (instanceIri: string, classesToCheck: string[], onResult: (classIris: string[]) => void, onStop: () => void) => Promise<void>;
    stopAllQueries: () => void;
    getInstanceLabels: (instanceIri: string, onResult: (result: {
        value: string;
        lang?: string;
    }[]) => void) => Promise<void>;
    pageSize: number;
}

declare enum IncrementalEvent {
    RequestStopped = "requestStopped",
    NewInstances = "newInstances",
    InstancesSearchFinished = "instancesSearchFinished",
    LimitChange = "limitChange",
    EndpointChange = "endpointChange",
    Reset = "reset",
    ClassInstanceSelection = "classInstanceSselection",
    ClassSelection = "classSelection",
    ContextClick = "contextClick",
    DiagramUpdated = "diagramUpdated",
    ReasonerSet = "reasonerSet",
    NewDataPropertyValues = "newDataPropertyValues",
    DataPropertyValuesLoadingFinished = "dpvaluesloadfinish",
    InstanceCheckingStarted = "instanceCheckingStarted",
    InstanceCheckingFinished = "instanceCheckingFinished",
    CountStarted = "countStarted",
    NewCountResult = "newCountResult"
}
interface IonEvent {
    (event: IncrementalEvent.RequestStopped, callback: () => void): void;
    (event: IncrementalEvent.NewInstances, callback: (classInstances: ClassInstance[][], numberResultsAvailable: number) => void): void;
    (event: IncrementalEvent.InstancesSearchFinished, callback: () => void): void;
    (event: IncrementalEvent.LimitChange, callback: (limit: number) => void): void;
    (event: IncrementalEvent.EndpointChange, callback: (endpoint: MastroEndpoint) => void): void;
    (event: IncrementalEvent.Reset, callback: () => void): void;
    (event: IncrementalEvent.ClassInstanceSelection, callback: (classInstanceEntity: ClassInstanceEntity) => void): void;
    (event: IncrementalEvent.ClassSelection, callback: (classEntity: GrapholEntity) => void): void;
    (event: IncrementalEvent.DiagramUpdated, callback: () => void): void;
    (event: IncrementalEvent.ReasonerSet, callback: () => void): void;
    (event: IncrementalEvent.NewDataPropertyValues, callback: (instanceIri: string, dataPropertyIri: string, newValues: string[]) => void): void;
    (event: IncrementalEvent.DataPropertyValuesLoadingFinished, callback: (instanceIri: string, dataPropertyIri: string) => void): void;
    (event: IncrementalEvent.InstanceCheckingStarted, callback: (instanceIri: string) => void): void;
    (event: IncrementalEvent.InstanceCheckingFinished, callback: (instanceIri: string) => void): void;
    (event: IncrementalEvent.NewCountResult, callback: (classIri: string, result?: {
        value: number;
        materialized: boolean;
        date?: string;
    }) => void): void;
    (event: IncrementalEvent.CountStarted, callback: (classIri: string) => void): void;
}
declare class IncrementalLifecycle {
    private requestStopped;
    private newInstances;
    private instancesSearchFinished;
    private limitChange;
    private endpointChange;
    private reset;
    private classInstanceSselection;
    private classSelection;
    private diagramUpdated;
    private reasonerSet;
    private newDataPropertyValues;
    private dpvaluesloadfinish;
    private instanceCheckingStarted;
    private instanceCheckingFinished;
    private newCountResult;
    private countStarted;
    constructor();
    trigger(event: IncrementalEvent.RequestStopped): void;
    trigger(event: IncrementalEvent.NewInstances, classInstances: ClassInstance[][], numberResultsAvailable: number): void;
    trigger(event: IncrementalEvent.InstancesSearchFinished): void;
    trigger(event: IncrementalEvent.LimitChange, limit: number): void;
    trigger(event: IncrementalEvent.EndpointChange, endpoint: MastroEndpoint): void;
    trigger(event: IncrementalEvent.Reset): void;
    trigger(event: IncrementalEvent.ClassInstanceSelection, classInstanceEntity: ClassInstanceEntity): void;
    trigger(event: IncrementalEvent.ClassSelection, classEntity: GrapholEntity): void;
    trigger(event: IncrementalEvent.DiagramUpdated): void;
    trigger(event: IncrementalEvent.ReasonerSet): void;
    trigger(event: IncrementalEvent.NewDataPropertyValues, instanceIri: string, dataPropertyIri: string, newValues: string[]): void;
    trigger(event: IncrementalEvent.DataPropertyValuesLoadingFinished, instanceIri: string, dataPropertyIri: string): void;
    trigger(event: IncrementalEvent.InstanceCheckingStarted, instanceIri: string): void;
    trigger(event: IncrementalEvent.InstanceCheckingFinished, instanceIri: string): void;
    trigger(event: IncrementalEvent.NewCountResult, classIri: string, result?: {
        value: number;
        materialized: boolean;
        date?: string;
    }): void;
    trigger(event: IncrementalEvent.CountStarted, classIri: string): void;
    on: IonEvent;
}

declare class HighlightsManager {
    vkgApi: IVirtualKnowledgeGraphApi;
    private emptyUnfoldingEntities;
    private _dataProperties;
    private _objectProperties;
    private highlightsCallsPromises;
    private computationPromise;
    lastClassIris: string[];
    private currentClassIris;
    private emptyUnfoldingsDataProperties;
    private emptyUnfoldingsObjectProperties;
    private emptyUnfoldingsClasses;
    constructor(vkgApi: IVirtualKnowledgeGraphApi, emptyUnfoldingEntities: EmptyUnfoldingEntities);
    computeHighlights(classesIri: string[]): Promise<void>;
    computeHighlights(classIri: string): Promise<void>;
    clear(): Promise<void>;
    dataProperties(): Promise<string[]>;
    objectProperties(): Promise<Branch[]>;
    hasUnfoldings(entityIri: string, entityType: GrapholTypesEnum): boolean;
}

declare class EndpointController {
    private requestOptions;
    private lifecycle;
    private endpointApi;
    private endpoints;
    private selectedEndpoint?;
    private vkgApi?;
    highlightsManager?: HighlightsManager;
    pageSize: number;
    constructor(requestOptions: RequestOptions, lifecycle: IncrementalLifecycle);
    getRunningEndpoints(): Promise<MastroEndpoint[]>;
    setEndpoint(endpoint: MastroEndpoint): Promise<void>;
    setEndpoint(endpointName: string): Promise<void>;
    setPageSize(newPageSize: number): void;
    clear(): void;
    stopRequests(requestType?: 'instances' | 'counts' | 'all'): void;
    requestInstancesForClass(classIri: string, includeLabels?: boolean, searchText?: string, propertyIriFilter?: string, propertyType?: GrapholTypesEnum.OBJECT_PROPERTY | GrapholTypesEnum.DATA_PROPERTY, isDirect?: boolean): Promise<string> | undefined;
    requestNewInstances(requestId: string, pageNumber: number): void;
    requestInstancesThroughObjectProperty(instanceIri: string, objectPropertyIri: string, isDirect?: boolean, includeLabels?: boolean, rangeClassIri?: string, propertyIriFilter?: string, searchText?: string): Promise<string> | undefined;
    requestDataPropertyValues(instanceIri: string, dataPropertyIri: string): void;
    requestCountForClass(classIri: string): void;
    shouldQueryUseLabels(queryExecutionId: string): Promise<boolean> | undefined;
    getMaterializedCounts(): Promise<MaterializedCounts | undefined>;
    instanceCheck(instanceIri: string, classesToCheck: string[]): Promise<string[]>;
    requestLabels(instanceIri: string): Promise<{
        value: string;
        language?: string | undefined;
    }[]>;
    setLanguage(lang: string): void;
    isReasonerAvailable(): boolean;
    get endpoint(): MastroEndpoint | undefined;
}

type ObjectPropertyConnectedClasses = {
    list: GrapholEntity[];
    direct: boolean;
};
declare class NeighbourhoodFinder {
    private ontology;
    constructor(ontology: Ontology);
    getDataProperties(classIriString: string): GrapholEntity[];
    getObjectProperties(classIriString: string): Map<GrapholEntity, ObjectPropertyConnectedClasses>;
    /**
     * Given a class and an object property, get all classes connected to the given class through such an
     * object property.
     * @param sourceClassIriString the class' iri involved in the object property
     * either as domain or range
     * @param objectPropertyIriString the object property's iri for which to retrieve the connected classes' iris
     * @returns an array of entities
     */
    getClassesConnectedToObjectProperty(sourceClassIriString: string, objectPropertyIriString: string): GrapholEntity[];
    private getConnectedClassesIrisByType;
    getSubclassesIris(classIri: string): string[];
    getEquivalentClassesIris(classIri: string): string[];
    getSuperclassesIris(classIri: string): string[];
    private getIriObject;
}

/** @internal */
declare class IncrementalController {
    grapholscape: Grapholscape;
    private diagramBuilder;
    neighbourhoodFinder: NeighbourhoodFinder;
    classInstanceEntities: Map<string, ClassInstanceEntity>;
    lastClassIri?: string;
    lastInstanceIri?: string;
    diagram: IncrementalDiagram;
    endpointController?: EndpointController;
    private entitySelectionTimeout;
    counts: Map<string, {
        value: number;
        materialized: boolean;
        date?: string;
    }>;
    countersEnabled: boolean;
    lifecycle: IncrementalLifecycle;
    on: IonEvent;
    /**
     * Callback called when user click on data lineage command
     */
    onShowDataLineage: (entityIri: string) => void;
    addEdge: (sourceId: string, targetId: string, edgeType: GrapholTypesEnum.INCLUSION | GrapholTypesEnum.INPUT | GrapholTypesEnum.EQUIVALENCE | GrapholTypesEnum.INSTANCE_OF) => void;
    constructor(grapholscape: Grapholscape);
    showDiagram(viewportState?: ViewportState): void;
    performActionWithBlockedGraph(action: () => void | Promise<void>): Promise<void>;
    /**
     * @internal
     *
     * Create new EndpointApi object with current mastro request options
     */
    setMastroConnection(mastroRequestOptions: RequestOptions): void;
    addEntity(iri: string, centerOnIt?: boolean, position?: Position): void;
    areHierarchiesVisible(hierarchies: Hierarchy[]): boolean;
    areAllConnectedClassesVisibleForClass(classIri: string, connectedClassesIris: string[], positionType: 'sub' | 'super' | 'equivalent'): boolean;
    reset(): void;
    clearState(): void;
    private updateEntityNameType;
    /**
     * Remove a class, an instance or a data property node from the diagram.
     * Entities left with no other connections are recurisvely removed too.
     * Called when the user click on the remove button on a entity node
     * @param entityIri
     */
    removeEntity(entityIri: GrapholEntity, entitiesIrisToKeep?: string[]): void;
    removeEntity(entityIri: string, entitiesIrisToKeep?: string[]): void;
    addInstance(instance: ClassInstance, parentClassesIris?: string[] | string): ClassInstanceEntity;
    /**
     * Add object property edge between two classes.
     * @param objectPropertyIri the object property iri to add
     * @param sourceClassIri
     * @param targetClassIri
     */
    addIntensionalObjectProperty(objectPropertyIri: string, sourceClassIri: string, targetClassIri: string): void;
    /**
     * Add object property edge between two instances
     * @param objectPropertyIri
     * @param sourceInstanceIri
     * @param targetInstanceIri
     */
    addExtensionalObjectProperty(objectPropertyIri: string, sourceInstanceIri: string, targetInstanceIri: string): void;
    /**
     * Show hierarchies for which the specified class is a subclass.
     * @param classIri
     */
    showSuperHierarchiesOf(classIri: string): void;
    /**
     * Show hierarchies for which the specified class is a superclass.
     * @param classIri
     */
    showSubHierarchiesOf(classIri: string): void;
    /**
     * Hide hierarchies for which the specified class is a subClass (i.e. an input class).
     * Hierarchies are pre-computed, after the floaty-transformation is performed.
     * @param classIri
     */
    hideSuperHierarchiesOf(classIri: string): void;
    /**
     * Show hierarchies for which the specified class is a superclass (i.e. an input class).
     * Hierarchies are pre-computed, after the floaty-transformation is performed.
     * @param classIri
     */
    hideSubHierarchiesOf(classIri: string): void;
    private showOrHideHierarchies;
    private addHierarchy;
    private removeHierarchy;
    showSubClassesOf(classIri: string, subclassesIris?: string[]): void;
    showSuperClassesOf(classIri: string, superclassesIris?: string[]): void;
    showEquivalentClassesOf(classIri: string, equivalentClassesIris?: string[]): void;
    private showClassesInIsa;
    /**
     * Given the iri of a class, retrieve connected object properties.
     * These object properties are inferred if the reasoner is available.
     * Otherwise only object properties directly asserted in the ontology
     * will be retrieved.
     * @param classIri
     * @returns
     */
    getObjectPropertiesByClasses(classIris: string[]): Promise<Map<GrapholEntity, ObjectPropertyConnectedClasses>>;
    getDataPropertiesByClasses(classIris: string[]): Promise<GrapholEntity[]>;
    getDataPropertiesByClassInstance(instanceIri: string): Promise<GrapholEntity[]>;
    runLayout: () => void | undefined;
    pinNode: (node: NodeSingular | string) => void | undefined;
    unpinNode: (node: NodeSingular | string) => void | undefined;
    postDiagramEdit(oldElemsNumber: number): void;
    countInstancesForClass(classIri: string): Promise<void>;
    updateMaterializedCounts(): Promise<void>;
    setIncrementalEventHandlers(): void;
    private get ontology();
    private get incrementalRenderer();
    get numberOfElements(): number;
}

/** @internal */
declare function initIncremental(grapholscape: Grapholscape): void;

declare class Grapholscape {
    renderer: Renderer;
    private availableRenderers;
    container: HTMLElement;
    readonly lifecycle: Lifecycle;
    ontology: Ontology;
    private entityNavigator;
    private displayedNamesManager;
    private themesManager;
    widgets: Map<WidgetEnum, HTMLElement>;
    widgetsInitialStates: WidgetsConfig;
    constructor(ontology: Ontology, container: HTMLElement, config?: GrapholscapeConfig);
    /**
     * Show a certain diagram by its ID
     * @param diagramId the diagram's id to display
     * @param viewportState set a custom {@link !model.ViewportState}, if not set, last one available will be used
     */
    showDiagram(diagramId: number, viewportState?: ViewportState): void;
    /**
     * Change the current renderer (Graphol - Lite - Floaty).
     *
     * @remarks
     * A RendererState is an implementation for the {@link !model.iRenderState} interface
     * that changes the way the {@link Renderer} performs the main operations on a
     * {@link !model.Diagram} such as rendering it and filtering elements in it.
     * The renderer states included in Grapholscape are: {@link GrapholRendererState},
     * {@link LiteRendererState} and {@link FloatyRendererState}.
     *
     * @param newRenderState the renderer state instance to set, if you want to reuse
     * these instances it's totally up to you.
     *
     *
     * @example
     * ```ts
     * // Setting the floaty renderer state
     * import { FloatyRendererState } from 'grapholscape'
     *
     * grapholscape.setRenderer(new FloatyRendererState())
     * ```
     */
    setRenderer(newRenderState: RenderState): void;
    /**
     * Center the viewport on a single element.
     * @remarks
     * If you specify a different diagram from the current one, it will be displayed
     * @param elementId the element's id (can be a node or an edge)
     * @param diagramId the diagram's id (**default**: the current one)
     * @param zoom the level zoom to apply, do not pass it if you don't want zoom to change
     */
    centerOnElement(elementId: string, diagramId?: number, zoom?: number): void;
    /**
     * Select an element in a diagram.
     * @remarks
     * If you specify a different diagram from the current one, it will be displayed
     * @param elementId the element's id (can be a node or an edge)
     * @param diagramId the diagram's id (**default**: the current one)
     */
    selectElement(elementId: string, diagramId?: number): void;
    /** Unselect any selected element in the current diagram */
    unselect(): void;
    /** Fit viewport to diagram */
    fit(): void;
    /**
     * Apply a certain level of zoom
     * @param value level of zoom to set
     */
    zoom(value: number): void;
    /**
     * Increase the zooom level by a certain amount
     * @param amount the amount of zoom to add
     */
    zoomIn(amount: number): void;
    /**
     * Decrease the zooom level by a certain amount
     * @param amount the amount of zoom to remove
     */
    zoomOut(amount: number): void;
    /**
     * Filter elements on the diagram.
     * @remarks
     * It will be currently applied only if the user defined callback on the event
     * {@link !model.LifecycleEvent.FilterRequest} returns true and if the internal logic
     * allows for the filter to be applied.
     * @param filter the filter to apply, can be an object of type {@link !model.Filter}, {@link !model.DefaultFilterKeyEnum}
     * or a string representing the unique key of a defined filter
     */
    filter(filter: string | Filter | DefaultFilterKeyEnum): void;
    /**
     * Unfilter elements on the diagram.
     * @remarks
     * It will be currently deactivated only if the user defined callback on the event
     * {@link !model.LifecycleEvent.FilterRequest} returns true and if the internal logic
     * allows for the filter to be deactivated.
     * @param filter the filter to disable, can be an object of type {@link !model.Filter}, {@link !model.DefaultFilterKeyEnum}
     * or a string representing the unique key of a defined filter
     */
    unfilter(filter: string | Filter | DefaultFilterKeyEnum): void;
    /** The current diagram's id */
    get diagramId(): number | undefined;
    /** The current renderer state */
    get renderState(): RendererStatesEnum | undefined;
    /** The current selected Entity */
    get selectedEntity(): GrapholEntity | null | undefined;
    /** An array of available renderer's state for this Grapholscape instance */
    get renderers(): RendererStatesEnum[];
    /**
     * Center viewport on a single entity occurrence given its IRI
     * @param iri the iri of the entity to find and center on
     * @param diagramId the diagram containing the entity.
     * If not specified, the first entity occurrence in any diagram will be used.
     * @param zoom the level of zoom to apply.
     * If not specified, zoom level won't be changed.
     */
    centerOnEntity(iri: string, diagramId?: number, zoom?: number): void;
    /**
     * Center viewport on a single entity occurrence and selects it given its IRI
     * @param iri the iri of the entity to find and center on
     * @param diagramId the diagram containing the entity.
     * If not specified, the first entity occurrence in any diagram will be used.
     * @param zoom the level of zoom to apply.
     * If not specified, zoom level won't be changed.
     */
    selectEntity(iri: string, diagramId?: number, zoom?: number): void;
    /**
     * Change the displayed entity's names.
     * @param newEntityNametype the entity name type to set
     */
    setEntityNameType(newEntityNametype: EntityNameType): void;
    /**
     * Change the language used for the labels and comments
     * @remarks The language must be supported by the ontology or the first available
     * language for a given label/comment wil be used as fallback
     * @param newLanguage the language to set {@link !config.Language}
     */
    setLanguage(newLanguage: string): void;
    /** The current selected language */
    get language(): Language;
    /** The current selected entity name type (label, full iri or prefixed iri) */
    get entityNameType(): EntityNameType;
    /**
     * Apply a given theme
     * @param themeId the theme's ID
     */
    setTheme(themeId: string): void;
    /**
     * @ignore
     * // TODO: make this method update settings widget before publishing in docs
     * Add a new theme in the list of available themes
     * @param newTheme the new theme
     * @experimental
     */
    addTheme(newTheme: GrapholscapeTheme): void;
    /** The current theme used by Grapholscape */
    get theme(): GrapholscapeTheme;
    /** The available themes for this Grapholscape instance */
    get themeList(): GrapholscapeTheme[];
    /**
     * Register a callback for a given event.
     * @remarks
     * Check {@link !model.LifecycleEvent} and {@link !model.IonEvent} for the
     * full list of events/callbacks types
     * @param event The event for which register a callback.
     * @param callback Function to call when the specified event occurs
     *
     * @example reacting to a node selection
     * ```js
     *  import { LifecycleEvent } from 'grapholscape'
     *
     *  // ...init grapholscape
     *
     * grapholscape.on(LifecycleEvent.NodeSelection, (selectedNode) => {
     *  // here you can do whatever you want with selectedNode, like printing its shape
     *  console.log(selectedNode.shape)
     * })
     * ```
     */
    on: IonEvent$1;
    /**
     * The container in which Grapholscape places the UI components.
     * You can use this container to add new widgets or dialogs if you want to.
     */
    get uiContainer(): Element | null;
    /**
     * The container in which the bottom-right buttons are placed.
     * You can use this container to add your own Buttons if you want to.
     */
    get buttonsTray(): Element | null | undefined;
    /**
     * @ignore
     * @privateRemarks // TODO: Be sure this method reflects on UI before publishing it in to the docs
     * Apply a new custom configuration
     * @param newConfig the config object to apply
     * @experimental
     */
    setConfig(newConfig: GrapholscapeConfig): void;
    /**
     * Export current diagram and download it as a PNG image.
     * @param fileName custom file name. Defaults to {@link exportFileName}
     */
    exportToPng(fileName?: string): void;
    /**
     * Export current diagram and download it as an SVG.
     * @param fileName custom file name. Defaults to {@link exportFileName}
     */
    exportToSvg(fileName?: string): void;
    /**
     * Filename for exports.
     * String in the form: "[ontology name]-[diagram name]-v[ontology version]"
     */
    get exportFileName(): string;
    /** @internal */
    incremental?: IncrementalController;
}

declare const diagrams: lit_html.TemplateResult<2>;
declare const triangle_up: lit_html.TemplateResult<2>;
declare const triangle_down: lit_html.TemplateResult<2>;
declare const arrow_right: lit_html.TemplateResult<2>;
declare const arrowDown: lit_html.TemplateResult<2>;
declare const explore: lit_html.TemplateResult<2>;
declare const info_outline: lit_html.TemplateResult<2>;
declare const enterFullscreen: lit_html.TemplateResult<2>;
declare const exitFullscreen: lit_html.TemplateResult<2>;
declare const centerDiagram: lit_html.TemplateResult<2>;
declare const filter: lit_html.TemplateResult<2>;
declare const bubbles: lit_html.TemplateResult<2>;
declare const lite: lit_html.TemplateResult<2>;
declare const settings_icon: lit_html.TemplateResult<2>;
declare const infoFilled: lit_html.TemplateResult<2>;
declare const plus: lit_html.TemplateResult<2>;
declare const minus: lit_html.TemplateResult<2>;
declare const save: lit_html.TemplateResult<2>;
declare const lock_open = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"20px\" viewBox=\"0 0 24 24\" width=\"20px\" fill=\"currentColor\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z\"/></svg>";
declare const close: lit_html.TemplateResult<2>;
declare const blankSlateDiagrams: lit_html.TemplateResult<2>;
declare const check: lit_html.TemplateResult<2>;
declare const searchOff: lit_html.TemplateResult<2>;
/**
 * Author: Simran
 * Source: https://github.com/Templarian/MaterialDesign/blob/master/svg/checkbox-multiple-blank-circle.svg
 */
declare const move_bubbles: lit_html.TemplateResult<2>;
/**
 * Author: Simran
 * Source: https://github.com/Templarian/MaterialDesign/blob/master/svg/owl.svg
 */
declare const owl_icon: lit_html.TemplateResult<2>;
declare const graphol_icon: lit_html.TemplateResult<2>;
declare const tune: lit_html.TemplateResult<2>;
declare const settings_play: lit_html.TemplateResult<2>;
declare const filterOff: lit_html.TemplateResult<2>;
declare const incremental: lit_html.TemplateResult<2>;
declare const refresh: lit_html.TemplateResult<2>;
declare const instancesIcon: lit_html.TemplateResult<2>;
declare const superHierarchies: lit_html.TemplateResult<2>;
declare const subHierarchies: lit_html.TemplateResult<2>;
declare const rubbishBin: lit_html.TemplateResult<2>;
declare const mastroEndpointIcon: lit_html.TemplateResult<2>;
declare const stopCircle: lit_html.TemplateResult<2>;
declare const equivalentClasses: lit_html.TemplateResult<2>;
declare const search$1: lit_html.TemplateResult<2>;
declare const insertInGraph: lit_html.TemplateResult<2>;
declare const cross: lit_html.TemplateResult<2>;
declare const counter: lit_html.TemplateResult<2>;
declare const labelIcon: lit_html.TemplateResult<2>;
declare const commentIcon: lit_html.TemplateResult<2>;
declare const authorIcon: lit_html.TemplateResult<2>;
declare const sankey: lit_html.TemplateResult<2>;
declare const entityIcons: {
    [x in GrapholTypesEnum.CLASS | GrapholTypesEnum.OBJECT_PROPERTY | GrapholTypesEnum.DATA_PROPERTY | GrapholTypesEnum.INDIVIDUAL | GrapholTypesEnum.CLASS_INSTANCE]: SVGTemplateResult;
};
declare const annotationIcons: {
    [x in AnnotationsKind]: SVGTemplateResult;
};

declare const _default$a: lit_html.TemplateResult<2>;

declare const _default$9: lit_html.TemplateResult<2>;

declare const _default$8: lit_html.TemplateResult<2>;

declare const _default$7: lit_html.TemplateResult<2>;

declare const _default$6: lit_html.TemplateResult<2>;

declare const _default$5: lit_html.TemplateResult<1>;

declare const index_d$2_diagrams: typeof diagrams;
declare const index_d$2_triangle_up: typeof triangle_up;
declare const index_d$2_triangle_down: typeof triangle_down;
declare const index_d$2_arrow_right: typeof arrow_right;
declare const index_d$2_arrowDown: typeof arrowDown;
declare const index_d$2_explore: typeof explore;
declare const index_d$2_info_outline: typeof info_outline;
declare const index_d$2_enterFullscreen: typeof enterFullscreen;
declare const index_d$2_exitFullscreen: typeof exitFullscreen;
declare const index_d$2_centerDiagram: typeof centerDiagram;
declare const index_d$2_filter: typeof filter;
declare const index_d$2_bubbles: typeof bubbles;
declare const index_d$2_lite: typeof lite;
declare const index_d$2_settings_icon: typeof settings_icon;
declare const index_d$2_infoFilled: typeof infoFilled;
declare const index_d$2_plus: typeof plus;
declare const index_d$2_minus: typeof minus;
declare const index_d$2_save: typeof save;
declare const index_d$2_lock_open: typeof lock_open;
declare const index_d$2_close: typeof close;
declare const index_d$2_blankSlateDiagrams: typeof blankSlateDiagrams;
declare const index_d$2_check: typeof check;
declare const index_d$2_searchOff: typeof searchOff;
declare const index_d$2_move_bubbles: typeof move_bubbles;
declare const index_d$2_owl_icon: typeof owl_icon;
declare const index_d$2_graphol_icon: typeof graphol_icon;
declare const index_d$2_tune: typeof tune;
declare const index_d$2_settings_play: typeof settings_play;
declare const index_d$2_filterOff: typeof filterOff;
declare const index_d$2_incremental: typeof incremental;
declare const index_d$2_refresh: typeof refresh;
declare const index_d$2_instancesIcon: typeof instancesIcon;
declare const index_d$2_superHierarchies: typeof superHierarchies;
declare const index_d$2_subHierarchies: typeof subHierarchies;
declare const index_d$2_rubbishBin: typeof rubbishBin;
declare const index_d$2_mastroEndpointIcon: typeof mastroEndpointIcon;
declare const index_d$2_stopCircle: typeof stopCircle;
declare const index_d$2_equivalentClasses: typeof equivalentClasses;
declare const index_d$2_insertInGraph: typeof insertInGraph;
declare const index_d$2_cross: typeof cross;
declare const index_d$2_counter: typeof counter;
declare const index_d$2_labelIcon: typeof labelIcon;
declare const index_d$2_commentIcon: typeof commentIcon;
declare const index_d$2_authorIcon: typeof authorIcon;
declare const index_d$2_sankey: typeof sankey;
declare const index_d$2_entityIcons: typeof entityIcons;
declare const index_d$2_annotationIcons: typeof annotationIcons;
declare namespace index_d$2 {
  export {
    _default$a as classIcon,
    _default$9 as objectPropertyIcon,
    _default$8 as dataPropertyIcon,
    _default$7 as individualIcon,
    _default$6 as classInstanceIcon,
    _default$5 as grapholscapeLogo,
    index_d$2_diagrams as diagrams,
    index_d$2_triangle_up as triangle_up,
    index_d$2_triangle_down as triangle_down,
    index_d$2_arrow_right as arrow_right,
    index_d$2_arrowDown as arrowDown,
    index_d$2_explore as explore,
    index_d$2_info_outline as info_outline,
    index_d$2_enterFullscreen as enterFullscreen,
    index_d$2_exitFullscreen as exitFullscreen,
    index_d$2_centerDiagram as centerDiagram,
    index_d$2_filter as filter,
    index_d$2_bubbles as bubbles,
    index_d$2_lite as lite,
    index_d$2_settings_icon as settings_icon,
    index_d$2_infoFilled as infoFilled,
    index_d$2_plus as plus,
    index_d$2_minus as minus,
    index_d$2_save as save,
    index_d$2_lock_open as lock_open,
    index_d$2_close as close,
    index_d$2_blankSlateDiagrams as blankSlateDiagrams,
    index_d$2_check as check,
    index_d$2_searchOff as searchOff,
    index_d$2_move_bubbles as move_bubbles,
    index_d$2_owl_icon as owl_icon,
    index_d$2_graphol_icon as graphol_icon,
    index_d$2_tune as tune,
    index_d$2_settings_play as settings_play,
    index_d$2_filterOff as filterOff,
    index_d$2_incremental as incremental,
    index_d$2_refresh as refresh,
    index_d$2_instancesIcon as instancesIcon,
    index_d$2_superHierarchies as superHierarchies,
    index_d$2_subHierarchies as subHierarchies,
    index_d$2_rubbishBin as rubbishBin,
    index_d$2_mastroEndpointIcon as mastroEndpointIcon,
    index_d$2_stopCircle as stopCircle,
    index_d$2_equivalentClasses as equivalentClasses,
    search$1 as search,
    index_d$2_insertInGraph as insertInGraph,
    index_d$2_cross as cross,
    index_d$2_counter as counter,
    index_d$2_labelIcon as labelIcon,
    index_d$2_commentIcon as commentIcon,
    index_d$2_authorIcon as authorIcon,
    index_d$2_sankey as sankey,
    index_d$2_entityIcons as entityIcons,
    index_d$2_annotationIcons as annotationIcons,
  };
}

declare enum SizeEnum {
    S = "s",
    M = "m",
    L = "l"
}
declare class GscapeButton extends LitElement {
    disabled: boolean;
    asSwitch: boolean;
    active: boolean;
    label: string;
    size: SizeEnum;
    type: string;
    fullWidth: string;
    private toggled;
    static properties: {
        active: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        label: {
            type: StringConstructor;
            reflect: boolean;
        };
        title: {
            type: StringConstructor;
            reflect: boolean;
        };
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        asSwitch: {
            type: BooleanConstructor;
            attribute: string;
            reflect: boolean;
        };
        size: {
            type: StringConstructor;
            reflect: boolean;
        };
        type: {
            type: StringConstructor;
            reflect: boolean;
        };
        fullWidth: {
            type: StringConstructor;
            attribute: string;
            reflect: boolean;
        };
        toggled: {
            type: BooleanConstructor;
            state: boolean;
        };
    };
    static styles: lit.CSSResult[];
    constructor();
    render(): lit_html.TemplateResult<1>;
    private clickHandler;
    private get altIcon();
}

declare const _default$4: lit.CSSResult;

type Constructor$3<T = {}> = new (...args: any[]) => T;
declare class IBaseMixin {
    hide(): void;
    show(): void;
    showInPosition(position?: {
        x: number;
        y: number;
    }): void;
    enable(): void;
    disable(): void;
    onStateChange(): void;
    isVisible: boolean;
    enabled: boolean;
}
declare const BaseMixin: <T extends Constructor$3<LitElement>>(superClass: T) => Constructor$3<IBaseMixin> & T;

type Constructor$2<T = {}> = new (...args: any[]) => T;
declare class IDropPanelMixin {
    togglePanel(): void;
    openPanel(): void;
    closePanel(): void;
    protected get panel(): HTMLElement | undefined | null;
    onTogglePanel(): void;
    isPanelClosed(): boolean;
}
declare const DropPanelMixin: <T extends Constructor$2<LitElement>>(superClass: T) => Constructor$2<IDropPanelMixin> & T;
declare function hasDropPanel(element: any): element is IDropPanelMixin;

type Constructor$1<T = {}> = new (...args: any[]) => T;
declare class IModalMixin {
    hide(): void;
    show(): void;
    protected modalBackground: HTMLDivElement;
}
declare const ModalMixin: <T extends Constructor$1<IBaseMixin>>(superClass: T) => Constructor$1<IModalMixin> & T;

type Constructor<T = {}> = new (...args: any[]) => T;
declare class IContextualWidgetMixin {
    hide(): void;
    /**
     * Attach cxt widget and show it
     * @param element the target html elment
     */
    attachTo(element: HTMLElement): void;
    /**
     * Attach cxt widget and do not show it, if it was visible it stays visible
     * @param element the target html element
     */
    attachToSilently(element: HTMLElement): void;
    cxtWidgetProps: Partial<Props>;
    tippyWidget: Instance<Props>;
}
declare const ContextualWidgetMixin: <T extends Constructor<LitElement>>(superClass: T) => Constructor<IContextualWidgetMixin> & T;

/**
 * A command for the context menu
 */
interface Command {
    /** the string to show */
    content: string;
    /** optional icon */
    icon?: SVGTemplateResult;
    /** callback to execute on selection */
    select: () => void;
}
declare const GscapeContextMenu_base: (new (...args: any[]) => IContextualWidgetMixin) & (new (...args: any[]) => IBaseMixin) & typeof LitElement;
declare class GscapeContextMenu extends GscapeContextMenu_base {
    commands: Command[];
    customElements: (LitElement | HTMLElement | TemplateResult)[];
    showFirst: 'commands' | 'elements';
    onCommandRun: () => void;
    static properties: PropertyDeclarations;
    static styles: CSSResultArray;
    render(): TemplateResult<1>;
    attachTo(element: HTMLElement, commands?: Command[], elements?: (LitElement | HTMLElement | TemplateResult)[]): void;
    attachToPosition(position: {
        x: number;
        y: number;
    }, container: Element, commands?: Command[], elements?: (LitElement | HTMLElement | TemplateResult)[]): void;
    private handleCommandClick;
    private get commandsTemplate();
    private get customElementsTemplate();
}

declare class GscapeActionListItem extends LitElement {
    label: string;
    selected: boolean;
    private expanded;
    subtle: boolean;
    disabled: boolean;
    static properties: PropertyDeclarations;
    static styles?: CSSResultGroup;
    constructor();
    render(): lit_html.TemplateResult<1>;
    private clickHandler;
    private get hiddenContent();
}

declare const _default$3: lit.CSSResult;

declare class GscapeEntityListItem extends LitElement {
    type: GrapholTypesEnum.CLASS | GrapholTypesEnum.DATA_PROPERTY | GrapholTypesEnum.OBJECT_PROPERTY | GrapholTypesEnum.INDIVIDUAL | GrapholTypesEnum.CLASS_INSTANCE;
    displayedName: string;
    iri: string;
    actionable: boolean;
    asAccordion: boolean;
    disabled: boolean;
    private isAccordionOpen;
    static properties: PropertyDeclarations;
    static styles: CSSResultGroup;
    render(): lit_html.TemplateResult<1>;
    private iconNameSlotTemplate;
    private handleDetailsClick;
    openAccordion(): void;
    closeAccordion(): void;
}

declare const textSpinner: () => lit_html.TemplateResult<1>;
declare const textSpinnerStyle: lit.CSSResult;

declare function getContentSpinner(): lit_html.TemplateResult<1>;
declare const contentSpinnerStyle: lit.CSSResult;

declare class GscapeTextSearch extends LitElement {
    private _onSearchCallback;
    static properties: PropertyDeclarations;
    static styles?: CSSResultGroup;
    render(): lit_html.TemplateResult<1>;
    onSearch(callback: (e: KeyboardEvent) => void): void;
}

type ViewObjectPropertyUnfolding = EntityViewDataUnfolding & {
    connectedClasses: EntityViewDataUnfolding[];
    direct: boolean;
};
type EntityViewDataUnfolding = {
    entityViewData: EntityViewData;
    loading?: boolean;
    hasUnfolding?: boolean;
};
type EntityViewData = {
    displayedName: string;
    value: {
        iri: Iri;
        type: GrapholTypesEnum;
    } & AnnotatedElement;
    viewOccurrences?: Map<DiagramViewData, OccurrenceIdViewData[]>;
};
interface IEntityFilters {
    [GrapholTypesEnum.CLASS]?: number;
    [GrapholTypesEnum.DATA_PROPERTY]?: number;
    [GrapholTypesEnum.OBJECT_PROPERTY]?: number;
    [GrapholTypesEnum.INDIVIDUAL]?: number;
    areAllFiltersDisabled: boolean;
}

declare const GscapeEntitySearch_base: (new (...args: any[]) => IDropPanelMixin) & typeof LitElement;
declare class GscapeEntitySearch extends GscapeEntitySearch_base implements IEntityFilters {
    areAllFiltersDisabled: boolean;
    [GrapholTypesEnum.CLASS]?: number;
    [GrapholTypesEnum.DATA_PROPERTY]?: number;
    [GrapholTypesEnum.OBJECT_PROPERTY]?: number;
    [GrapholTypesEnum.INDIVIDUAL]?: number;
    [GrapholTypesEnum.CLASS_INSTANCE]?: number;
    private isSearchTextEmpty;
    static properties: PropertyDeclarations;
    static styles?: CSSResultGroup;
    render(): lit_html.TemplateResult<1>;
    private handleSearch;
    clearSearch(): void;
    private get atLeastTwoFilters();
    private get input();
}
type SearchEvent = CustomEvent<{
    searchText: string;
}>;

declare const GscapeEntityTypeFilters_base: (new (...args: any[]) => IBaseMixin) & typeof LitElement;
declare class GscapeEntityTypeFilters extends GscapeEntityTypeFilters_base implements IEntityFilters {
    static properties: PropertyDeclarations;
    static styles: lit.CSSResult[];
    _class?: number;
    _dataproperty?: number;
    _objectproperty?: number;
    _individual?: number;
    _classInstance?: number;
    render(): lit_html.TemplateResult<1>;
    private getChipTemplate;
    private _handleFilterStateChange;
    get areAllFiltersDisabled(): boolean;
    set [GrapholTypesEnum.CLASS](v: number | undefined);
    get [GrapholTypesEnum.CLASS](): number | undefined;
    set [GrapholTypesEnum.DATA_PROPERTY](v: number | undefined);
    get [GrapholTypesEnum.DATA_PROPERTY](): number | undefined;
    set [GrapholTypesEnum.OBJECT_PROPERTY](v: number | undefined);
    get [GrapholTypesEnum.OBJECT_PROPERTY](): number | undefined;
    set [GrapholTypesEnum.INDIVIDUAL](v: number | undefined);
    get [GrapholTypesEnum.INDIVIDUAL](): number | undefined;
    set [GrapholTypesEnum.CLASS_INSTANCE](v: number | undefined);
    get [GrapholTypesEnum.CLASS_INSTANCE](): number | undefined;
}
type EntityFilterEvent = CustomEvent<IEntityFilters>;

declare enum ToggleLabelPosition {
    LEFT = "left",
    RIGHT = "right"
}
declare class GscapeToggle extends LitElement {
    key: string;
    checked: boolean;
    disabled: boolean;
    label: string;
    labelPosition: ToggleLabelPosition;
    static ToggleLabelPosition: typeof ToggleLabelPosition;
    static get properties(): {
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        label: {
            type: StringConstructor;
            reflect: boolean;
        };
        labelPosition: {
            type: StringConstructor;
            reflect: boolean;
            attribute: string;
        };
        key: {
            type: StringConstructor;
            reflect: boolean;
        };
        checked: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    static styles: lit.CSSResult[];
    render(): lit_html.TemplateResult<1>;
}

declare const GscapeConfirmDialog_base: (new (...args: any[]) => IModalMixin) & (new (...args: any[]) => IBaseMixin) & typeof LitElement;
declare class GscapeConfirmDialog extends GscapeConfirmDialog_base {
    message?: string | undefined;
    dialogTitle: string;
    onConfirm: () => void;
    onCancel: () => void;
    constructor(message?: string | undefined, dialogTitle?: string);
    static properties: PropertyDeclarations;
    static styles: CSSResultGroup;
    render(): lit_html.TemplateResult<1>;
    private handleConfirm;
    private handleCancel;
}

type SelectOption = {
    id: string;
    text: string;
    trailingIcon?: SVGTemplateResult;
    leadingIcon?: SVGTemplateResult;
    disabled?: boolean;
};
declare const GscapeSelect_base: (new (...args: any[]) => IDropPanelMixin) & (new (...args: any[]) => IBaseMixin) & typeof LitElement;
declare class GscapeSelect extends GscapeSelect_base {
    private readonly PLACEHOLDER_ID;
    defaultIcon: SVGTemplateResult;
    selectedOptionId?: string;
    defaultOptionId?: string;
    options: SelectOption[];
    size: SizeEnum;
    clearable: boolean;
    private _placeholder;
    onSelection: (optionId: string) => void;
    static properties: PropertyDeclarations;
    static styles: lit.CSSResult[];
    render(): lit_html.TemplateResult<1>;
    private handleSelection;
    private getButton;
    clear(): void;
    get selectedOption(): SelectOption | undefined;
    get defaultOption(): SelectOption;
    get placeholder(): SelectOption;
    set placeholder(placeHolder: SelectOption);
}

interface IEntitySelector {
    onClassSelection(callback: (iri: string) => void): void;
}
declare const GscapeEntitySelector_base: (new (...args: any[]) => IDropPanelMixin) & (new (...args: any[]) => IBaseMixin) & typeof LitElement;
declare class GscapeEntitySelector extends GscapeEntitySelector_base implements IEntitySelector {
    title: string;
    private fullEntityList;
    private _entityList;
    private onClassSelectionCallback;
    private isSearchTextEmpty;
    static get properties(): {
        entityList: {
            type: ObjectConstructor;
            attribute: boolean;
        };
        isSearchTextEmpty: {
            type: BooleanConstructor;
            state: boolean;
        };
    };
    static styles: lit.CSSResult[];
    constructor();
    render(): lit_html.TemplateResult<1>;
    blur(): void;
    focusInputSearch(): Promise<void>;
    private handleEntitySelection;
    private handleKeyPressOnEntry;
    private handleSearch;
    clearSearch(): void;
    onClassSelection(callback: (iri: string) => void): void;
    set entityList(newEntityList: EntityViewData[]);
    get entityList(): EntityViewData[];
    private get input();
}

type UiOption = {
    name: string;
    id: string;
    icon: SVGTemplateResult;
    description?: string;
};

declare const GscapeFullPageSelector_base: (new (...args: any[]) => IBaseMixin) & typeof LitElement;
declare class GscapeFullPageSelector extends GscapeFullPageSelector_base {
    options: (UiOption | undefined)[];
    private _title;
    onOptionSelection: (optionId: string) => void;
    static properties: PropertyDeclarations;
    static styles: CSSResultGroup;
    render(): lit_html.TemplateResult<1>;
    private handleRendererSelection;
}

declare function initInitialRendererSelector(grapholscape: Grapholscape): void;

/**
 * Initialize the UI
 */
declare function export_default$1(grapholscape: Grapholscape): void;

declare const _default$2: lit.CSSResult;

declare const BOTTOM_RIGHT_WIDGET: lit.CSSResult;
declare const _default$1: lit.CSSResult;

declare const _default: lit_html.TemplateResult<1>;

type DiagramViewData = {
    id: number;
    name: string;
};
type OccurrenceIdViewData = {
    originalId: string;
    realId: string;
};
declare function getEntityOccurrencesTemplate(occurrences: Map<DiagramViewData, OccurrenceIdViewData[]>, onNodeNavigation: (occurrence: EntityOccurrence) => void): lit_html.TemplateResult<1>;

declare function createEntitiesList(grapholscape: Grapholscape, entityFilters?: IEntityFilters): EntityViewData[];
declare function search(searchValue: string, entities: EntityViewData[]): EntityViewData[];

declare const NodeButton_base: (new (...args: any[]) => IContextualWidgetMixin) & (new (...args: any[]) => IBaseMixin) & typeof LitElement;
declare class NodeButton extends NodeButton_base {
    content: TemplateResult | SVGTemplateResult | string | number;
    contentType: 'icon' | 'template';
    node?: NodeSingular;
    highlighted?: boolean;
    cxtWidgetProps: Partial<Props>;
    static properties: PropertyDeclarations;
    static styles: lit.CSSResult[];
    constructor(content: TemplateResult | SVGTemplateResult | string | number, contentType?: 'icon' | 'template');
    render(): TemplateResult<1>;
}

/** @module UI */

type index_d$1_GscapeConfirmDialog = GscapeConfirmDialog;
declare const index_d$1_GscapeConfirmDialog: typeof GscapeConfirmDialog;
type index_d$1_GscapeToggle = GscapeToggle;
declare const index_d$1_GscapeToggle: typeof GscapeToggle;
type index_d$1_GscapeSelect = GscapeSelect;
declare const index_d$1_GscapeSelect: typeof GscapeSelect;
type index_d$1_SelectOption = SelectOption;
type index_d$1_GscapeEntitySelector = GscapeEntitySelector;
declare const index_d$1_GscapeEntitySelector: typeof GscapeEntitySelector;
type index_d$1_IEntitySelector = IEntitySelector;
type index_d$1_UiOption = UiOption;
type index_d$1_WidgetEnum = WidgetEnum;
declare const index_d$1_WidgetEnum: typeof WidgetEnum;
type index_d$1_NodeButton = NodeButton;
declare const index_d$1_NodeButton: typeof NodeButton;
type index_d$1_GscapeButton = GscapeButton;
declare const index_d$1_GscapeButton: typeof GscapeButton;
type index_d$1_SizeEnum = SizeEnum;
declare const index_d$1_SizeEnum: typeof SizeEnum;
type index_d$1_Command = Command;
type index_d$1_GscapeActionListItem = GscapeActionListItem;
declare const index_d$1_GscapeActionListItem: typeof GscapeActionListItem;
type index_d$1_GscapeEntityListItem = GscapeEntityListItem;
declare const index_d$1_GscapeEntityListItem: typeof GscapeEntityListItem;
type index_d$1_IBaseMixin = IBaseMixin;
declare const index_d$1_IBaseMixin: typeof IBaseMixin;
declare const index_d$1_BaseMixin: typeof BaseMixin;
type index_d$1_IDropPanelMixin = IDropPanelMixin;
declare const index_d$1_IDropPanelMixin: typeof IDropPanelMixin;
declare const index_d$1_DropPanelMixin: typeof DropPanelMixin;
declare const index_d$1_hasDropPanel: typeof hasDropPanel;
type index_d$1_IModalMixin = IModalMixin;
declare const index_d$1_IModalMixin: typeof IModalMixin;
declare const index_d$1_ModalMixin: typeof ModalMixin;
type index_d$1_IContextualWidgetMixin = IContextualWidgetMixin;
declare const index_d$1_IContextualWidgetMixin: typeof IContextualWidgetMixin;
declare const index_d$1_ContextualWidgetMixin: typeof ContextualWidgetMixin;
declare const index_d$1_textSpinner: typeof textSpinner;
declare const index_d$1_textSpinnerStyle: typeof textSpinnerStyle;
declare const index_d$1_getContentSpinner: typeof getContentSpinner;
declare const index_d$1_contentSpinnerStyle: typeof contentSpinnerStyle;
type index_d$1_GscapeTextSearch = GscapeTextSearch;
declare const index_d$1_GscapeTextSearch: typeof GscapeTextSearch;
type index_d$1_GscapeEntitySearch = GscapeEntitySearch;
declare const index_d$1_GscapeEntitySearch: typeof GscapeEntitySearch;
type index_d$1_GscapeEntityTypeFilters = GscapeEntityTypeFilters;
declare const index_d$1_GscapeEntityTypeFilters: typeof GscapeEntityTypeFilters;
type index_d$1_SearchEvent = SearchEvent;
type index_d$1_EntityFilterEvent = EntityFilterEvent;
type index_d$1_ToggleLabelPosition = ToggleLabelPosition;
declare const index_d$1_ToggleLabelPosition: typeof ToggleLabelPosition;
type index_d$1_GscapeFullPageSelector = GscapeFullPageSelector;
declare const index_d$1_GscapeFullPageSelector: typeof GscapeFullPageSelector;
declare const index_d$1_initInitialRendererSelector: typeof initInitialRendererSelector;
type index_d$1_ViewObjectPropertyUnfolding = ViewObjectPropertyUnfolding;
type index_d$1_EntityViewDataUnfolding = EntityViewDataUnfolding;
type index_d$1_EntityViewData = EntityViewData;
type index_d$1_IEntityFilters = IEntityFilters;
type index_d$1_DiagramViewData = DiagramViewData;
type index_d$1_OccurrenceIdViewData = OccurrenceIdViewData;
declare const index_d$1_getEntityOccurrencesTemplate: typeof getEntityOccurrencesTemplate;
declare const index_d$1_createEntitiesList: typeof createEntitiesList;
declare const index_d$1_search: typeof search;
declare namespace index_d$1 {
  export {
    index_d$2 as icons,
    GscapeContextMenu as ContextMenu,
    index_d$1_GscapeConfirmDialog as GscapeConfirmDialog,
    index_d$1_GscapeToggle as GscapeToggle,
    index_d$1_GscapeSelect as GscapeSelect,
    index_d$1_SelectOption as SelectOption,
    index_d$1_GscapeEntitySelector as GscapeEntitySelector,
    index_d$1_IEntitySelector as IEntitySelector,
    export_default$1 as initUI,
    _default$2 as entityListItemStyle,
    index_d$1_UiOption as UiOption,
    BOTTOM_RIGHT_WIDGET as BOTTOM_RIGHT_WIDGET_CLASS,
    _default$1 as baseStyle,
    _default as emptySearchBlankState,
    index_d$1_WidgetEnum as WidgetEnum,
    index_d$1_NodeButton as NodeButton,
    index_d$1_GscapeButton as GscapeButton,
    _default$4 as GscapeButtonStyle,
    index_d$1_SizeEnum as SizeEnum,
    index_d$1_Command as Command,
    index_d$1_GscapeActionListItem as GscapeActionListItem,
    _default$3 as GscapeActionListStyle,
    index_d$1_GscapeEntityListItem as GscapeEntityListItem,
    index_d$1_IBaseMixin as IBaseMixin,
    index_d$1_BaseMixin as BaseMixin,
    index_d$1_IDropPanelMixin as IDropPanelMixin,
    index_d$1_DropPanelMixin as DropPanelMixin,
    index_d$1_hasDropPanel as hasDropPanel,
    index_d$1_IModalMixin as IModalMixin,
    index_d$1_ModalMixin as ModalMixin,
    index_d$1_IContextualWidgetMixin as IContextualWidgetMixin,
    index_d$1_ContextualWidgetMixin as ContextualWidgetMixin,
    index_d$1_textSpinner as textSpinner,
    index_d$1_textSpinnerStyle as textSpinnerStyle,
    index_d$1_getContentSpinner as getContentSpinner,
    index_d$1_contentSpinnerStyle as contentSpinnerStyle,
    index_d$1_GscapeTextSearch as GscapeTextSearch,
    index_d$1_GscapeEntitySearch as GscapeEntitySearch,
    index_d$1_GscapeEntityTypeFilters as GscapeEntityTypeFilters,
    index_d$1_SearchEvent as SearchEvent,
    index_d$1_EntityFilterEvent as EntityFilterEvent,
    index_d$1_ToggleLabelPosition as ToggleLabelPosition,
    index_d$1_GscapeFullPageSelector as GscapeFullPageSelector,
    index_d$1_initInitialRendererSelector as initInitialRendererSelector,
    index_d$1_ViewObjectPropertyUnfolding as ViewObjectPropertyUnfolding,
    index_d$1_EntityViewDataUnfolding as EntityViewDataUnfolding,
    index_d$1_EntityViewData as EntityViewData,
    index_d$1_IEntityFilters as IEntityFilters,
    index_d$1_DiagramViewData as DiagramViewData,
    index_d$1_OccurrenceIdViewData as OccurrenceIdViewData,
    index_d$1_getEntityOccurrencesTemplate as getEntityOccurrencesTemplate,
    index_d$1_createEntitiesList as createEntitiesList,
    index_d$1_search as search,
  };
}

declare function setGraphEventHandlers(diagram: Diagram, lifecycle: Lifecycle, ontology: Ontology): void;

declare function toPNG(fileName: string, cy?: Core, backgroundColor?: string): void;
declare function toSVG(fileName: string, cy?: Core, backgroundColor?: string): void;

declare function export_default(text: string): string;

declare function grapholEntityToEntityViewData(grapholEntity: GrapholEntity, grapholscape: Grapholscape): EntityViewData;
declare function getEntityViewDataUnfolding(entity: GrapholEntity, grapholscape: Grapholscape, hasUnfoldings?: (iri: string, type: GrapholTypesEnum) => boolean): EntityViewDataUnfolding;

declare const index_d_grapholEntityToEntityViewData: typeof grapholEntityToEntityViewData;
declare const index_d_getEntityViewDataUnfolding: typeof getEntityViewDataUnfolding;
declare namespace index_d {
  export {
    export_default as capitalizeFirstChar,
    index_d_grapholEntityToEntityViewData as grapholEntityToEntityViewData,
    index_d_getEntityViewDataUnfolding as getEntityViewDataUnfolding,
  };
}

/**
 * Create a full instance of Grapholscape with diagrams and widgets
 *
 * @remarks
 * Once the promise is fulfilled, you get a {@link !core.Grapholscape}.
 * Hence the API you will most likely want to use will be the one of the {@link !core.Grapholscape} class.
 * You can change diagram, zoom, focus elements, select them, filter them and so on with that class.
 *
 * @param file the ontology, can be an object of the
 * [Web API interface File](https://developer.mozilla.org/en-US/docs/Web/API/File)
 * or a String representing the .graphol file to be displayed
 * @param container a DOM element in which the ontology will be rendered in
 * @param config a config object, please read more about [settings](https://github.com/obdasystems/grapholscape/wiki/Settings)
 * @returns a promise that will be fulfilled with a {@link !core.Grapholscape} object
 * @see [Getting started](https://obdasystems.github.io/grapholscape/pages/getting-started.html)
 * @see [Configuration](https://obdasystems.github.io/grapholscape/pages/configuration.html)
 */
declare function fullGrapholscape(file: string | File, container: HTMLElement, config?: GrapholscapeConfig): Promise<Grapholscape | undefined>;
/**
 * Create a bare instance of Grapholscape, only diagrams, no widgets
 *
 * @remarks
 * Once the promise is fulfilled, you get a {@link !core.Grapholscape}.
 * Hence the API you will most likely want to use will be the one of the {@link !core.Grapholscape} class.
 * You can change diagram, zoom, focus elements, select them, filter them and so on with that class.
 *
 * @param file the ontology, can be an object of the
 * [Web API interface File](https://developer.mozilla.org/en-US/docs/Web/API/File)
 * or a String representing the .graphol file to be displayed
 * @param container a DOM element in which the ontology will be rendered in
 * @param config a config object, please read more about [settings](https://github.com/obdasystems/grapholscape/wiki/Settings)
 * @returns a promise that will be fulfilled with a {@link !core.Grapholscape} object
 * @see [Getting started](https://obdasystems.github.io/grapholscape/pages/getting-started.html)
 * @see [Configuration](https://obdasystems.github.io/grapholscape/pages/configuration.html)
 */
declare function bareGrapholscape(file: string | File, container: HTMLElement, config?: GrapholscapeConfig): Promise<Grapholscape | undefined>;

export { AnnotatedElement, Annotation, AnnotationsKind, BaseFilterManager, BaseRenderer, Breakpoint, CSS_PROPERTY_NAMESPACE, ClassInstanceEntity, ColourMap, ColoursNames, ConstructorLabelsEnum, DefaultFilterKeyEnum, DefaultThemes, DefaultThemesEnum, Diagram, DiagramRepresentation, EntityNameType, EntityOccurrence, Filter, FloatyRendererState, FunctionalityEnum, GrapholEdge, GrapholElement, GrapholEntity, GrapholNode, GrapholNodeInfo, GrapholNodesEnum, GrapholRendererState, GrapholTypesEnum, Grapholscape, GrapholscapeConfig, GrapholscapeTheme, Hierarchy, IncrementalController, IncrementalDiagram, IncrementalRendererState, IonEvent$1 as IonEvent, Iri, Language, Lifecycle, LifecycleEvent, LiteRendererState, Namespace, Ontology, POLYGON_POINTS, Renderer, RendererStatesEnum, Shape, ThemeConfig, ViewportState, WidgetsConfig, bareGrapholscape, classicColourMap, clearLocalStorage, darkColourMap, floatyOptions, fullGrapholscape, getDefaultFilters, _default$b as grapholOptions, gscapeColourMap, FilterManager as iFilterManager, RenderState as iRenderState, initIncremental, isGrapholEdge, isGrapholNode, liteOptions, loadConfig, setGraphEventHandlers, storeConfigEntry, toPNG, toSVG, index_d$1 as ui, index_d as util };
