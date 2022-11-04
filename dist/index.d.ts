/// <reference types="cytoscape" />
import * as cytoscape$1 from 'cytoscape';
import cytoscape__default, { Position, ElementDefinition, Stylesheet, CytoscapeOptions } from 'cytoscape';
import * as lit_html from 'lit-html';
import * as lit from 'lit';
import { LitElement, PropertyDeclarations, CSSResultGroup, SVGTemplateResult } from 'lit';

declare class Annotation {
    property: string;
    lexicalForm: string;
    language: string;
    datatype: string;
    constructor(property: string, lexicalForm: string, language?: string, datatype?: string);
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
    addAnnotation(annotation: Annotation): void;
    getAnnotations(language?: string, kind?: AnnotationsKind): Annotation[];
    getLabels(language?: string): Annotation[];
    getComments(language?: string): Annotation[];
}

/**
 * Node types in a Graphol ontology
 */
declare enum GrapholTypesEnum {
    /** @type {"class"} */
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
    MEMBERSHIP = "membership"
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
 * @type {object}
 */
declare const _default$a: {
    CLASS: {
        TYPE: GrapholTypesEnum;
        SHAPE: Shape;
        IDENTITY: GrapholTypesEnum;
    };
    DOMAIN_RESTRICTION: {
        TYPE: GrapholTypesEnum;
        SHAPE: Shape;
        IDENTITY: GrapholTypesEnum;
    };
    RANGE_RESTRICTION: {
        TYPE: GrapholTypesEnum;
        SHAPE: Shape;
        IDENTITY: GrapholTypesEnum;
    };
    OBJECT_PROPERTY: {
        TYPE: GrapholTypesEnum;
        SHAPE: Shape;
        IDENTITY: GrapholTypesEnum;
    };
    DATA_PROPERTY: {
        TYPE: GrapholTypesEnum;
        SHAPE: Shape;
        IDENTITY: GrapholTypesEnum;
    };
    UNION: {
        TYPE: GrapholTypesEnum;
        SHAPE: Shape;
        IDENTITY: GrapholTypesEnum;
    };
    DISJOINT_UNION: {
        TYPE: GrapholTypesEnum;
        SHAPE: Shape;
        IDENTITY: GrapholTypesEnum;
    };
    COMPLEMENT: {
        TYPE: GrapholTypesEnum;
        SHAPE: Shape;
        IDENTITY: GrapholTypesEnum;
    };
    INTERSECTION: {
        TYPE: GrapholTypesEnum;
        SHAPE: Shape;
        IDENTITY: GrapholTypesEnum;
    };
    ENUMERATION: {
        TYPE: GrapholTypesEnum;
        SHAPE: Shape;
        IDENTITY: GrapholTypesEnum;
    };
    KEY: {
        TYPE: GrapholTypesEnum;
        SHAPE: Shape;
        IDENTITY: GrapholTypesEnum;
    };
    ROLE_INVERSE: {
        TYPE: GrapholTypesEnum;
        SHAPE: Shape;
        IDENTITY: GrapholTypesEnum;
    };
    ROLE_CHAIN: {
        TYPE: GrapholTypesEnum;
        SHAPE: Shape;
        IDENTITY: GrapholTypesEnum;
    };
    DATATYPE_RESTRICTION: {
        TYPE: GrapholTypesEnum;
        SHAPE: Shape;
        IDENTITY: GrapholTypesEnum;
    };
    VALUE_DOMAIN: {
        TYPE: GrapholTypesEnum;
        SHAPE: Shape;
        IDENTITY: GrapholTypesEnum;
    };
    PROPERTY_ASSERTION: {
        TYPE: GrapholTypesEnum;
        SHAPE: Shape;
        IDENTITY: GrapholTypesEnum;
    };
    LITERAL: {
        TYPE: GrapholTypesEnum;
        SHAPE: Shape;
        IDENTITY: GrapholTypesEnum;
    };
    INDIVIDUAL: {
        TYPE: GrapholTypesEnum;
        SHAPE: Shape;
        IDENTITY: GrapholTypesEnum;
    };
    FACET: {
        TYPE: GrapholTypesEnum;
        SHAPE: Shape;
        SHAPE_POINTS: string;
        IDENTITY: GrapholTypesEnum;
    };
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
    private _displayedName;
    private _originalId;
    private _iri?;
    constructor(id: string);
    get id(): string;
    set id(value: string);
    get type(): GrapholTypesEnum;
    set type(type: GrapholTypesEnum);
    get displayedName(): string;
    set displayedName(displayedName: string);
    get originalId(): string;
    set originalId(id: string);
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
}

declare class GrapholEdge extends GrapholElement {
    private _sourceId;
    private _targetId;
    private _breakpoints;
    private _targetLabel?;
    private _sourceLabel?;
    private _sourceEndpoint?;
    private _targetEndpoint?;
    constructor(id: string);
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
}

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
    get isLabelXcentered(): boolean;
    get isLabelYcentered(): boolean;
    get fontSize(): number | undefined;
    set fontSize(value: number | undefined);
    get inputs(): string[] | undefined;
    set inputs(inputs: string[] | undefined);
    get shapePoints(): string | undefined;
    set shapePoints(shapePoints: string | undefined);
    get fakeNodes(): GrapholNode[];
    addFakeNode(newFakeNode: GrapholNode): void;
    getCytoscapeRepr(grapholEntity?: GrapholEntity): ElementDefinition[];
}

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
    edge = "edge"
}
declare type ColourMap = {
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
    getColour(name: ColoursNames): string;
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
    EntityWikiLinkClick = "entityWikiLinkClick"
}
interface IonEvent {
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
    trigger(event: LifecycleEvent.EntityWikiLinkClick, iri: string): void;
    on: IonEvent;
}

declare class Renderer {
    private _container;
    cy?: cytoscape__default.Core;
    private _renderState;
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
    set renderState(rs: RenderState);
    get renderState(): RenderState;
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
     * Select a node or an edge in the actual diagram given its unique id
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
    centerOnElementById(elementId: string, zoom?: number, select?: boolean): void;
    centerOnElement(element: GrapholElement, zoom?: number, select?: boolean): void;
    centerOnModelPosition(xPos: number, yPos: number, zoom?: number): void;
    centerOnRenderedPosition(xPos: number, yPos: number, zoom?: number): void;
    zoom(zoomValue: number): void;
    zoomIn(zoomValue: number): void;
    zoomOut(zoomValue: number): void;
    setTheme(theme: GrapholscapeTheme): void;
    applyTheme(): void;
    updateElement(grapholElement: GrapholElement): void;
    get isThemeApplied(): cytoscape__default.ElementStylesheetStyle | cytoscape__default.ElementStylesheetCSS;
    get grapholElements(): Map<string, GrapholElement>;
    get selectedElement(): GrapholElement;
    get viewportState(): {
        zoom: number;
        pan: cytoscape__default.Position;
    };
    set container(container: HTMLElement);
    get container(): HTMLElement;
    /**
     * Getter
     */
    get nodes(): string[];
    /**
     * Getter
     */
    get edges(): string[];
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
    layout: cytoscape.Layouts;
    readonly id: RendererStatesEnum;
    filterManager: FilterManager;
    private _layout;
    set renderer(newRenderer: Renderer);
    get renderer(): Renderer;
    transformOntology(ontology: Ontology): void;
    runLayout(): void;
    render(): void;
    stopRendering(): void;
    getGraphStyle(theme: GrapholscapeTheme): cytoscape.Stylesheet[];
    stopLayout(): void;
    runLayoutInfinitely(): void;
    pinNode(node: any): void;
    unpinAll(): void;
    private setPopperStyle;
    private updatePopper;
    unpinNode(node: any): void;
    private removeUnlockButton;
    private setDragAndPinEventHandlers;
    private grabHandler;
    private freeHandler;
    private floatyLayoutOptions;
    get isLayoutInfinite(): boolean;
    get dragAndPin(): boolean;
    set dragAndPin(isActive: boolean);
    private get popperContainer();
    private get popperContainers();
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
    abstract filters: Map<string, Filter>;
    filterActivation(filter: Filter): boolean;
    filterDeactivation(filter: Filter): boolean;
}

declare enum RendererStatesEnum {
    GRAPHOL = "graphol",
    GRAPHOL_LITE = "lite",
    FLOATY = "floaty"
}
interface RenderState {
    id: RendererStatesEnum;
    renderer: Renderer;
    filterManager: FilterManager;
    layout: cytoscape.Layouts;
    render(): void;
    stopRendering(): void;
    filter(elementId: string, filter: Filter): void;
    unfilter(elementId: string, filter: Filter): void;
    runLayout(): void;
    stopLayout(): void;
    getGraphStyle(theme: GrapholscapeTheme): Stylesheet[];
    transformOntology(ontology: Ontology): void;
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
    constructor(iri: string, namespaces: Namespace[]);
    set remainder(value: string);
    get remainder(): string;
    private set namespace(value);
    get namespace(): Namespace | undefined;
    get prefix(): string;
    get fullIri(): string;
    get prefixed(): string;
    equals(iriToCheck: string): boolean;
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
declare type EntityOccurrence = {
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
    updateElement(element: GrapholElement): void;
    updateElement(elementId: string): void;
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

declare type ViewportState = {
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
    getEntity(iri: string): GrapholEntity;
    getGrapholElement(elementId: string, diagramId?: number, renderState?: RendererStatesEnum): GrapholElement;
    getGrapholNode(nodeId: string, diagramId?: number, renderState?: RendererStatesEnum): GrapholNode;
    getGrapholEdge(edgeId: string, diagramId?: number, renderState?: RendererStatesEnum): GrapholNode;
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
    constructor(renderer?: Renderer);
    set renderer(newRenderer: Renderer);
    get renderer(): Renderer;
    filter(elementId: string, filter: Filter): void;
    unfilter(elementId: string, filter: Filter): void;
}

declare enum WidgetEnum {
    DIAGRAM_SELECTOR = "diagram-selector",
    ENTITY_DETAILS = "details",
    FILTERS = "filters",
    FIT_BUTTON = "fit-button",
    FULLSCREEN_BUTTON = "fullscreen-button",
    ONTOLOGY_EXPLORER = "ontology-explorer",
    ONTOLOGY_INFO = "ontology-info",
    OWL_VISUALIZER = "owl-visualizer",
    RENDERER_SELECTOR = "renderer-selector",
    LAYOUT_SETTINGS = "layout-settings",
    SETTINGS = "settings",
    ZOOM_TOOLS = "zoom-tools"
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
declare type WidgetsConfig = {
    [key in WidgetEnum]?: boolean;
};
declare type ThemeConfig = GrapholscapeTheme | DefaultThemesEnum;
declare type GrapholscapeConfig = {
    themes?: ThemeConfig[];
    selectedTheme?: string;
    language?: Language | string;
    entityNameType?: EntityNameType;
    renderers?: RendererStatesEnum[];
    widgets?: WidgetsConfig;
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

declare const _default$9: CytoscapeOptions;

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
     * Change the actual renderer (Graphol - Lite - Floaty).
     *
     * @remarks
     * A RendererState is an implementation for the {@link !model.iRenderState} interface
     * that changes the way the {@link Renderer} performs the main operations on a
     * {@link !model.Diagram} such as rendering it and filtering elements in it.
     * The renderer states included in Grapholscape are: {@link GrapholRendererState},
     * {@link LiteRendererState} and {@link FloatyRenderState}.
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
     * If you specify a different diagram from the actual one, it will be displayed
     * @param elementId the element's id (can be a node or an edge)
     * @param diagramId the diagram's id (**default**: the actual one)
     * @param zoom the level zoom to apply, do not pass it if you don't want zoom to change
     */
    centerOnElement(elementId: string, diagramId?: number, zoom?: number): void;
    /**
     * Select an element in a diagram.
     * @remarks
     * If you specify a different diagram from the actual one, it will be displayed
     * @param elementId the element's id (can be a node or an edge)
     * @param diagramId the diagram's id (**default**: the actual one)
     */
    selectElement(elementId: string, diagramId?: number): void;
    /** Unselect any selected element in the actual diagram */
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
     * It will be actually applied only if the user defined callback on the event
     * {@link !model.LifecycleEvent.FilterRequest} returns true and if the internal logic
     * allows for the filter to be applied.
     * @param filter the filter to apply, can be an object of type {@link !model.Filter}, {@link !model.DefaultFilterKeyEnum}
     * or a string representing the unique key of a defined filter
     */
    filter(filter: string | Filter | DefaultFilterKeyEnum): void;
    /**
     * Unfilter elements on the diagram.
     * @remarks
     * It will be actually deactivated only if the user defined callback on the event
     * {@link !model.LifecycleEvent.FilterRequest} returns true and if the internal logic
     * allows for the filter to be deactivated.
     * @param filter the filter to disable, can be an object of type {@link !model.Filter}, {@link !model.DefaultFilterKeyEnum}
     * or a string representing the unique key of a defined filter
     */
    unfilter(filter: string | Filter | DefaultFilterKeyEnum): void;
    /** The actual diagram's id */
    get diagramId(): number;
    /** The actual renderer state */
    get renderState(): RendererStatesEnum;
    /** The actual selected Entity */
    get selectedEntity(): GrapholEntity;
    /** An array of available renderer's state for this Grapholscape instance */
    get renderers(): RendererStatesEnum[];
    /**
     * Center viewport on a single entity given its IRI
     * @param iri the iri of the entity to find and center on
     * @param diagramId the diagram containing.
     * If not specified, the first entity occurrence in any diagram will be used.
     * @param zoom the level of zoom to apply.
     * If not specified, zoom level won't be changed.
     */
    centerOnEntity(iri: string, diagramId?: number, zoom?: number): void;
    /**
     * Center viewport on a single entity and selects it given its IRI
     * @param iri the iri of the entity to find and center on
     * @param diagramId the diagram containing.
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
    /** The actual selected language */
    get language(): Language;
    /** The actual selected entity name type (label, full iri or prefixed iri) */
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
     */
    addTheme(newTheme: GrapholscapeTheme): void;
    /** The actual theme used by Grapholscape */
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
    on: IonEvent;
    /**
     * The container in which Grapholscape places the UI components.
     * You can use this container to add new widgets or dialogs if you want to.
     */
    get uiContainer(): Element;
    /**
     * The container in which the bottom-right buttons are placed.
     * You can use this container to add your own Buttons if you want to.
     */
    get buttonsTray(): Element;
    /**
     * @ignore
     * // TODO: Be sure this method reflects on UI before publishing it in to the docs
     * Apply a new custom configuration
     * @param newConfig the config object to apply
     */
    setConfig(newConfig: GrapholscapeConfig): void;
    /**
     * Export actual diagram and download it as a PNG image.
     * @param fileName custom file name. Defaults to {@link exportFileName}
     */
    exportToPng(fileName?: string): void;
    /**
     * Export actual diagram and download it as an SVG.
     * @param fileName custom file name. Defaults to {@link exportFileName}
     */
    exportToSvg(fileName?: string): void;
    /**
     * Filename for exports.
     * String in the form: "[ontology name]-[diagram name]-v[ontology version]"
     */
    get exportFileName(): string;
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

declare const _default$8: lit.CSSResult;

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

declare class GscapeActionListItem extends LitElement {
    label: string;
    selected: boolean;
    private expanded;
    subtle: boolean;
    static properties: PropertyDeclarations;
    static styles?: CSSResultGroup;
    render(): lit_html.TemplateResult<1>;
    private clickHandler;
    private get hiddenContent();
}

declare const _default$7: lit.CSSResult;

declare type Constructor$1<T = {}> = new (...args: any[]) => T;
declare class IBaseMixin {
    hide(): () => void;
    show(): () => void;
    enable(): () => void;
    disable(): () => void;
    onStateChange: () => void;
    isVisible: boolean;
    enabled: boolean;
}
declare const BaseMixin: <T extends Constructor$1<LitElement>>(superClass: T) => Constructor$1<IBaseMixin> & T;

declare type Constructor<T = {}> = new (...args: any[]) => T;
declare class IDropPanelMixin {
    togglePanel: () => void;
    openPanel: () => void;
    closePanel: () => void;
    protected get panel(): HTMLElement | undefined | null;
    onTogglePanel: () => void;
    isPanelClosed: () => boolean;
}
declare const DropPanelMixin: <T extends Constructor<LitElement>>(superClass: T) => Constructor<IDropPanelMixin> & T;
declare function hasDropPanel(element: any): element is IDropPanelMixin;

declare const BOTTOM_RIGHT_WIDGET: lit.CSSResult;
declare const _default$6: lit.CSSResult;

interface IEntityFilters {
    [GrapholTypesEnum.CLASS]: Boolean;
    [GrapholTypesEnum.DATA_PROPERTY]: Boolean;
    [GrapholTypesEnum.OBJECT_PROPERTY]: Boolean;
    [GrapholTypesEnum.INDIVIDUAL]: Boolean;
}
declare class GscapeEntitySearch extends LitElement implements IEntityFilters {
    [GrapholTypesEnum.CLASS]: Boolean;
    [GrapholTypesEnum.DATA_PROPERTY]: Boolean;
    [GrapholTypesEnum.OBJECT_PROPERTY]: Boolean;
    [GrapholTypesEnum.INDIVIDUAL]: Boolean;
    private _onSearchCallback;
    private _onEntityFilterToggleCallback;
    static properties: PropertyDeclarations;
    static styles?: CSSResultGroup;
    render(): lit_html.TemplateResult<1>;
    private handleFilterStateChange;
    private toggleChipsFilters;
    onSearch(callback: (e: KeyboardEvent) => void): void;
    onEntityFilterToggle(callback: () => void): void;
}

declare const _default$5: lit.CSSResult;

declare const diagrams = "<svg fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" height=\"20\" width=\"20\"><path d=\"M6.333 5.438Q5.875 5.438 5.552 5.76Q5.229 6.083 5.229 6.542Q5.229 7 5.552 7.302Q5.875 7.604 6.333 7.604Q6.792 7.604 7.094 7.302Q7.396 7 7.396 6.542Q7.396 6.083 7.094 5.76Q6.792 5.438 6.333 5.438ZM6.333 13.208Q5.875 13.208 5.552 13.51Q5.229 13.812 5.229 14.271Q5.229 14.729 5.552 15.052Q5.875 15.375 6.333 15.375Q6.792 15.375 7.094 15.052Q7.396 14.729 7.396 14.271Q7.396 13.812 7.094 13.51Q6.792 13.208 6.333 13.208ZM3.667 3.167H16.354Q16.667 3.167 16.875 3.375Q17.083 3.583 17.083 3.896V9.104Q17.083 9.458 16.875 9.677Q16.667 9.896 16.354 9.896H3.667Q3.354 9.896 3.135 9.677Q2.917 9.458 2.917 9.104V3.896Q2.917 3.583 3.135 3.375Q3.354 3.167 3.667 3.167ZM4.25 4.5V8.562H15.75V4.5ZM3.667 10.938H16.333Q16.667 10.938 16.875 11.156Q17.083 11.375 17.083 11.708V16.875Q17.083 17.229 16.875 17.448Q16.667 17.667 16.333 17.667H3.688Q3.354 17.667 3.135 17.448Q2.917 17.229 2.917 16.875V11.708Q2.917 11.375 3.125 11.156Q3.333 10.938 3.667 10.938ZM4.25 12.271V16.333H15.75V12.271ZM4.25 4.5V8.562ZM4.25 12.271V16.333Z\"/></svg>";
declare const triangle_up: lit_html.TemplateResult<2>;
declare const triangle_down: lit_html.TemplateResult<2>;
declare const arrow_right: lit_html.TemplateResult<2>;
declare const arrowDown = "<svg fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" height=\"20\" width=\"20\"><path d=\"M10 12 6 8H14Z\"/></svg>";
declare const explore: lit_html.TemplateResult<2>;
declare const info_outline: lit_html.TemplateResult<2>;
declare const enterFullscreen = "<svg fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" height=\"20\" width=\"20\"><path d=\"M4.167 15.833V11.646H5.5V14.5H8.354V15.833ZM4.167 8.354V4.167H8.354V5.5H5.5V8.354ZM11.646 15.833V14.5H14.5V11.646H15.833V15.833ZM14.5 8.354V5.5H11.646V4.167H15.833V8.354Z\"/></svg>";
declare const exitFullscreen = "<svg fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" height=\"20\" width=\"20\"><path d=\"M7.021 15.833V12.979H4.167V11.646H8.354V15.833ZM4.167 8.354V7.021H7.021V4.167H8.354V8.354ZM11.646 15.833V11.646H15.833V12.979H12.979V15.833ZM11.646 8.354V4.167H12.979V7.021H15.833V8.354Z\"/></svg>";
declare const centerDiagram = "<svg fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" height=\"20\" width=\"20\"><path d=\"M10 12.167Q9.104 12.167 8.469 11.531Q7.833 10.896 7.833 10Q7.833 9.104 8.469 8.469Q9.104 7.833 10 7.833Q10.896 7.833 11.531 8.469Q12.167 9.104 12.167 10Q12.167 10.896 11.531 11.531Q10.896 12.167 10 12.167ZM2.917 7.542V4.5Q2.917 3.833 3.375 3.375Q3.833 2.917 4.5 2.917H7.542V4.25H4.5Q4.417 4.25 4.333 4.333Q4.25 4.417 4.25 4.5V7.542ZM7.542 17.083H4.5Q3.833 17.083 3.375 16.625Q2.917 16.167 2.917 15.5V12.458H4.25V15.5Q4.25 15.583 4.333 15.667Q4.417 15.75 4.5 15.75H7.542ZM12.458 17.083V15.75H15.5Q15.583 15.75 15.667 15.667Q15.75 15.583 15.75 15.5V12.458H17.083V15.5Q17.083 16.167 16.625 16.625Q16.167 17.083 15.5 17.083ZM15.75 7.542V4.5Q15.75 4.417 15.667 4.333Q15.583 4.25 15.5 4.25H12.458V2.917H15.5Q16.167 2.917 16.625 3.375Q17.083 3.833 17.083 4.5V7.542ZM10 10.833Q10.354 10.833 10.594 10.594Q10.833 10.354 10.833 10Q10.833 9.646 10.594 9.406Q10.354 9.167 10 9.167Q9.646 9.167 9.406 9.406Q9.167 9.646 9.167 10Q9.167 10.354 9.406 10.594Q9.646 10.833 10 10.833Z\"/></svg>";
declare const filter = "<svg fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" height=\"20\" width=\"20\"><path d=\"M8.062 13.979V12.583H11.938V13.979ZM5.104 10.5V9.104H14.875V10.5ZM3.146 7V5.604H16.854V7Z\"/></svg>";
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
declare const filterOff: lit_html.TemplateResult<2>;
declare const entityIcons: {
    [x: string]: SVGTemplateResult;
};

declare const _default$4: lit_html.TemplateResult<2>;

declare const _default$3: lit_html.TemplateResult<2>;

declare const _default$2: lit_html.TemplateResult<2>;

declare const _default$1: lit_html.TemplateResult<2>;

declare const _default: lit_html.TemplateResult<1>;

declare const index_d$1_diagrams: typeof diagrams;
declare const index_d$1_triangle_up: typeof triangle_up;
declare const index_d$1_triangle_down: typeof triangle_down;
declare const index_d$1_arrow_right: typeof arrow_right;
declare const index_d$1_arrowDown: typeof arrowDown;
declare const index_d$1_explore: typeof explore;
declare const index_d$1_info_outline: typeof info_outline;
declare const index_d$1_enterFullscreen: typeof enterFullscreen;
declare const index_d$1_exitFullscreen: typeof exitFullscreen;
declare const index_d$1_centerDiagram: typeof centerDiagram;
declare const index_d$1_filter: typeof filter;
declare const index_d$1_bubbles: typeof bubbles;
declare const index_d$1_lite: typeof lite;
declare const index_d$1_settings_icon: typeof settings_icon;
declare const index_d$1_infoFilled: typeof infoFilled;
declare const index_d$1_plus: typeof plus;
declare const index_d$1_minus: typeof minus;
declare const index_d$1_save: typeof save;
declare const index_d$1_lock_open: typeof lock_open;
declare const index_d$1_close: typeof close;
declare const index_d$1_blankSlateDiagrams: typeof blankSlateDiagrams;
declare const index_d$1_check: typeof check;
declare const index_d$1_searchOff: typeof searchOff;
declare const index_d$1_move_bubbles: typeof move_bubbles;
declare const index_d$1_owl_icon: typeof owl_icon;
declare const index_d$1_graphol_icon: typeof graphol_icon;
declare const index_d$1_tune: typeof tune;
declare const index_d$1_filterOff: typeof filterOff;
declare const index_d$1_entityIcons: typeof entityIcons;
declare namespace index_d$1 {
  export {
    _default$4 as classIcon,
    _default$3 as objectPropertyIcon,
    _default$2 as dataPropertyIcon,
    _default$1 as individualIcon,
    _default as grapholscapeLogo,
    index_d$1_diagrams as diagrams,
    index_d$1_triangle_up as triangle_up,
    index_d$1_triangle_down as triangle_down,
    index_d$1_arrow_right as arrow_right,
    index_d$1_arrowDown as arrowDown,
    index_d$1_explore as explore,
    index_d$1_info_outline as info_outline,
    index_d$1_enterFullscreen as enterFullscreen,
    index_d$1_exitFullscreen as exitFullscreen,
    index_d$1_centerDiagram as centerDiagram,
    index_d$1_filter as filter,
    index_d$1_bubbles as bubbles,
    index_d$1_lite as lite,
    index_d$1_settings_icon as settings_icon,
    index_d$1_infoFilled as infoFilled,
    index_d$1_plus as plus,
    index_d$1_minus as minus,
    index_d$1_save as save,
    index_d$1_lock_open as lock_open,
    index_d$1_close as close,
    index_d$1_blankSlateDiagrams as blankSlateDiagrams,
    index_d$1_check as check,
    index_d$1_searchOff as searchOff,
    index_d$1_move_bubbles as move_bubbles,
    index_d$1_owl_icon as owl_icon,
    index_d$1_graphol_icon as graphol_icon,
    index_d$1_tune as tune,
    index_d$1_filterOff as filterOff,
    index_d$1_entityIcons as entityIcons,
  };
}

/**
 * Initialize the UI
 */
declare function export_default(grapholscape: Grapholscape): void;

/** @module UI */

type index_d_GscapeToggle = GscapeToggle;
declare const index_d_GscapeToggle: typeof GscapeToggle;
type index_d_WidgetEnum = WidgetEnum;
declare const index_d_WidgetEnum: typeof WidgetEnum;
type index_d_GscapeEntitySearch = GscapeEntitySearch;
declare const index_d_GscapeEntitySearch: typeof GscapeEntitySearch;
type index_d_GscapeButton = GscapeButton;
declare const index_d_GscapeButton: typeof GscapeButton;
type index_d_SizeEnum = SizeEnum;
declare const index_d_SizeEnum: typeof SizeEnum;
type index_d_ToggleLabelPosition = ToggleLabelPosition;
declare const index_d_ToggleLabelPosition: typeof ToggleLabelPosition;
type index_d_GscapeActionListItem = GscapeActionListItem;
declare const index_d_GscapeActionListItem: typeof GscapeActionListItem;
type index_d_IBaseMixin = IBaseMixin;
declare const index_d_IBaseMixin: typeof IBaseMixin;
declare const index_d_BaseMixin: typeof BaseMixin;
type index_d_IDropPanelMixin = IDropPanelMixin;
declare const index_d_IDropPanelMixin: typeof IDropPanelMixin;
declare const index_d_DropPanelMixin: typeof DropPanelMixin;
declare const index_d_hasDropPanel: typeof hasDropPanel;
declare namespace index_d {
  export {
    index_d_GscapeToggle as GscapeToggle,
    _default$6 as baseStyle,
    BOTTOM_RIGHT_WIDGET as BOTTOM_RIGHT_WIDGET_CLASS,
    index_d_WidgetEnum as WidgetEnum,
    _default$5 as entityListItemStyle,
    index_d_GscapeEntitySearch as GscapeEntitySearch,
    index_d$1 as icons,
    export_default as initUI,
    index_d_GscapeButton as GscapeButton,
    _default$8 as GscapeButtonStyle,
    index_d_SizeEnum as SizeEnum,
    index_d_ToggleLabelPosition as ToggleLabelPosition,
    index_d_GscapeActionListItem as GscapeActionListItem,
    _default$7 as GscapeActionListStyle,
    index_d_IBaseMixin as IBaseMixin,
    index_d_BaseMixin as BaseMixin,
    index_d_IDropPanelMixin as IDropPanelMixin,
    index_d_DropPanelMixin as DropPanelMixin,
    index_d_hasDropPanel as hasDropPanel,
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
declare function fullGrapholscape(file: string | File, container: HTMLElement, config?: GrapholscapeConfig): Promise<Grapholscape>;
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
declare function bareGrapholscape(file: string | File, container: HTMLElement, config?: GrapholscapeConfig): Promise<Grapholscape>;

export { AnnotatedElement, Annotation, AnnotationsKind, BaseFilterManager, BaseRenderer, Breakpoint, CSS_PROPERTY_NAMESPACE, ColourMap, ColoursNames, ConstructorLabelsEnum, DefaultFilterKeyEnum, DefaultThemes, DefaultThemesEnum, Diagram, DiagramRepresentation, EntityNameType, EntityOccurrence, Filter, FloatyRendererState as FloatyRenderState, FunctionalityEnum, GrapholEdge, GrapholElement, GrapholEntity, GrapholNode, _default$a as GrapholNodesEnum, GrapholRendererState, GrapholTypesEnum, Grapholscape, GrapholscapeConfig, GrapholscapeTheme, IonEvent, Iri, Language, Lifecycle, LifecycleEvent, LiteRendererState, Namespace, Ontology, POLYGON_POINTS, Renderer, RendererStatesEnum, Shape, ThemeConfig, ViewportState, WidgetsConfig, bareGrapholscape, classicColourMap, clearLocalStorage, darkColourMap, floatyOptions, fullGrapholscape, getDefaultFilters, _default$9 as grapholOptions, gscapeColourMap, FilterManager as iFilterManager, RenderState as iRenderState, liteOptions, loadConfig, storeConfigEntry, index_d as ui };
