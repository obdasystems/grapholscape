/**
 * MIT License
 *
 * Copyright (c) 2018-2022 OBDA Systems
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import popper from 'cytoscape-popper';
import automove from 'cytoscape-automove';
import tippy from 'tippy.js';
import cy_svg from 'cytoscape-svg';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var AnnotationsKind;
(function (AnnotationsKind) {
    AnnotationsKind["label"] = "label";
    AnnotationsKind["comment"] = "comment";
    AnnotationsKind["author"] = "author";
})(AnnotationsKind || (AnnotationsKind = {}));
class AnnotatedElement {
    constructor() {
        this._annotations = [];
    }
    set annotations(annotations) {
        this._annotations = annotations;
    }
    addAnnotation(annotation) {
        this._annotations.push(annotation);
    }
    getAnnotations(language, kind) {
        return this._annotations.filter(ann => {
            let shouldAdd = true;
            if (language && ann.language !== language) {
                shouldAdd = false;
            }
            if (kind && ann.property !== kind) {
                shouldAdd = false;
            }
            return shouldAdd;
        });
    }
    getLabels(language) {
        return this.getAnnotations(language, AnnotationsKind.label);
    }
    getComments(language) {
        return this.getAnnotations(language, AnnotationsKind.comment);
    }
}

/**
 * Node types in a Graphol ontology
 */
var GrapholTypesEnum;
(function (GrapholTypesEnum) {
    GrapholTypesEnum["CLASS"] = "class";
    /** @type {"domain-restriction"} */
    GrapholTypesEnum["DOMAIN_RESTRICTION"] = "domain-restriction";
    /** @type {"range-restriction"} */
    GrapholTypesEnum["RANGE_RESTRICTION"] = "range-restriction";
    /** @type {"role"} */
    GrapholTypesEnum["OBJECT_PROPERTY"] = "object-property";
    /** @type {"data property"} */
    GrapholTypesEnum["DATA_PROPERTY"] = "data-property";
    /** @type {"union"} */
    GrapholTypesEnum["UNION"] = "union";
    /** @type {"disjoint-union"} */
    GrapholTypesEnum["DISJOINT_UNION"] = "disjoint-union";
    /** @type {"complement"} */
    GrapholTypesEnum["COMPLEMENT"] = "complement";
    /** @type {"intersection"} */
    GrapholTypesEnum["INTERSECTION"] = "intersection";
    /** @type {"enumeration"} */
    GrapholTypesEnum["ENUMERATION"] = "enumeration";
    /** @type {"has-key"} */
    GrapholTypesEnum["KEY"] = "has-key";
    /** @type {"role-inverse"} */
    GrapholTypesEnum["ROLE_INVERSE"] = "role-inverse";
    /** @type {"role-chain"} */
    GrapholTypesEnum["ROLE_CHAIN"] = "role-chain";
    /** @type {"datatype-restriction"} */
    GrapholTypesEnum["DATATYPE_RESTRICTION"] = "datatype-restriction";
    /** @type {"value-domain"} */
    GrapholTypesEnum["VALUE_DOMAIN"] = "value-domain";
    /** @type {"property-assertion"} */
    GrapholTypesEnum["PROPERTY_ASSERTION"] = "property-assertion";
    /** @type {"literal"} */
    GrapholTypesEnum["LITERAL"] = "literal";
    /** @type {"individual"} */
    GrapholTypesEnum["INDIVIDUAL"] = "individual";
    /** @type {"facet"} */
    GrapholTypesEnum["FACET"] = "facet";
    /** @type {"neutral"} */
    GrapholTypesEnum["NEUTRAL"] = "neutral";
    /** @type {"value"} */
    GrapholTypesEnum["VALUE"] = "value";
    // EDGES
    /** @type {"inclusion"} */
    GrapholTypesEnum["INCLUSION"] = "inclusion";
    /** @type {"input"} */
    GrapholTypesEnum["INPUT"] = "input";
    /** @type {"equivalence"} */
    GrapholTypesEnum["EQUIVALENCE"] = "equivalence";
    /** @type {"instanceOf"} */
    GrapholTypesEnum["INSTANCE_OF"] = "instanceOf";
    /** @type {"same"} */
    GrapholTypesEnum["SAME"] = "same";
    /** @type {"different"} */
    GrapholTypesEnum["DIFFERENT"] = "different";
    /** @type {"membership"} */
    GrapholTypesEnum["MEMBERSHIP"] = "membership";
    /** @type {"class-instance"} */
    GrapholTypesEnum["CLASS_INSTANCE"] = "class-instance";
})(GrapholTypesEnum || (GrapholTypesEnum = {}));
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
var Shape;
(function (Shape) {
    /** @type {"rectangle"} */
    Shape["RECTANGLE"] = "rectangle";
    /** @type {"diamond"} */
    Shape["DIAMOND"] = "diamond";
    /** @type {"ellipse"} */
    Shape["ELLIPSE"] = "ellipse";
    /** @type {"hexagon"} */
    Shape["HEXAGON"] = "hexagon";
    /** @type {"roundrectangle"} */
    Shape["ROUND_RECTANGLE"] = "roundrectangle";
    /** @type {"octagon"} */
    Shape["OCTAGON"] = "octagon";
    /** @type {"polygon"} */
    Shape["POLYGON"] = "polygon";
})(Shape || (Shape = {}));
const POLYGON_POINTS = '-0.9 -1 1 -1 0.9 1 -1 1';
const GrapholNodesEnum = {
    CLASS: {
        TYPE: GrapholTypesEnum.CLASS,
        SHAPE: Shape.RECTANGLE,
        IDENTITY: GrapholTypesEnum.CLASS
    },
    DOMAIN_RESTRICTION: {
        TYPE: GrapholTypesEnum.DOMAIN_RESTRICTION,
        SHAPE: Shape.RECTANGLE,
        IDENTITY: GrapholTypesEnum.CLASS,
    },
    RANGE_RESTRICTION: {
        TYPE: GrapholTypesEnum.RANGE_RESTRICTION,
        SHAPE: Shape.RECTANGLE,
        IDENTITY: GrapholTypesEnum.NEUTRAL
    },
    OBJECT_PROPERTY: {
        TYPE: GrapholTypesEnum.OBJECT_PROPERTY,
        SHAPE: Shape.DIAMOND,
        IDENTITY: GrapholTypesEnum.OBJECT_PROPERTY
    },
    DATA_PROPERTY: {
        TYPE: GrapholTypesEnum.DATA_PROPERTY,
        SHAPE: Shape.ELLIPSE,
        IDENTITY: GrapholTypesEnum.DATA_PROPERTY
    },
    UNION: {
        TYPE: GrapholTypesEnum.UNION,
        SHAPE: Shape.HEXAGON,
        IDENTITY: GrapholTypesEnum.NEUTRAL
    },
    DISJOINT_UNION: {
        TYPE: GrapholTypesEnum.DISJOINT_UNION,
        SHAPE: Shape.HEXAGON,
        IDENTITY: GrapholTypesEnum.NEUTRAL
    },
    COMPLEMENT: {
        TYPE: GrapholTypesEnum.COMPLEMENT,
        SHAPE: Shape.HEXAGON,
        IDENTITY: GrapholTypesEnum.NEUTRAL
    },
    INTERSECTION: {
        TYPE: GrapholTypesEnum.INTERSECTION,
        SHAPE: Shape.HEXAGON,
        IDENTITY: GrapholTypesEnum.NEUTRAL
    },
    ENUMERATION: {
        TYPE: GrapholTypesEnum.ENUMERATION,
        SHAPE: Shape.HEXAGON,
        IDENTITY: GrapholTypesEnum.NEUTRAL
    },
    KEY: {
        TYPE: GrapholTypesEnum.KEY,
        SHAPE: Shape.HEXAGON,
        IDENTITY: GrapholTypesEnum.NEUTRAL
    },
    ROLE_INVERSE: {
        TYPE: GrapholTypesEnum.ROLE_INVERSE,
        SHAPE: Shape.HEXAGON,
        IDENTITY: GrapholTypesEnum.OBJECT_PROPERTY
    },
    ROLE_CHAIN: {
        TYPE: GrapholTypesEnum.ROLE_CHAIN,
        SHAPE: Shape.HEXAGON,
        IDENTITY: GrapholTypesEnum.OBJECT_PROPERTY
    },
    DATATYPE_RESTRICTION: {
        TYPE: GrapholTypesEnum.DATATYPE_RESTRICTION,
        SHAPE: Shape.HEXAGON,
        IDENTITY: GrapholTypesEnum.VALUE_DOMAIN
    },
    VALUE_DOMAIN: {
        TYPE: GrapholTypesEnum.VALUE_DOMAIN,
        SHAPE: Shape.ROUND_RECTANGLE,
        IDENTITY: GrapholTypesEnum.VALUE_DOMAIN
    },
    PROPERTY_ASSERTION: {
        TYPE: GrapholTypesEnum.PROPERTY_ASSERTION,
        SHAPE: Shape.RECTANGLE,
        IDENTITY: GrapholTypesEnum.NEUTRAL
    },
    LITERAL: {
        TYPE: GrapholTypesEnum.LITERAL,
        SHAPE: Shape.OCTAGON,
        IDENTITY: GrapholTypesEnum.VALUE
    },
    INDIVIDUAL: {
        TYPE: GrapholTypesEnum.INDIVIDUAL,
        SHAPE: Shape.OCTAGON,
        IDENTITY: GrapholTypesEnum.INDIVIDUAL
    },
    FACET: {
        TYPE: GrapholTypesEnum.FACET,
        SHAPE: Shape.POLYGON,
        SHAPE_POINTS: POLYGON_POINTS,
        IDENTITY: GrapholTypesEnum.FACET
    },
    CLASS_INSTANCE: {
        TYPE: GrapholTypesEnum.CLASS_INSTANCE,
        SHAPE: Shape.ELLIPSE,
        IDENTITY: GrapholTypesEnum.CLASS_INSTANCE,
    }
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
var ConstructorLabelsEnum;
(function (ConstructorLabelsEnum) {
    /** @type {"or"} */
    ConstructorLabelsEnum["UNION"] = "or";
    /** @type {"and"} */
    ConstructorLabelsEnum["INTERSECTION"] = "and";
    /** @type {"chain"} */
    ConstructorLabelsEnum["ROLE_CHAIN"] = "chain";
    /** @type {"inv"} */
    ConstructorLabelsEnum["ROLE_INVERSE"] = "inv";
    /** @type {"not"} */
    ConstructorLabelsEnum["COMPLEMENT"] = "not";
    /** @type {"data"} */
    ConstructorLabelsEnum["DATATYPE_RESTRICTION"] = "data";
    /** @type {"oneOf"} */
    ConstructorLabelsEnum["ENUMERATION"] = "oneOf";
    /** @type {"key"} */
    ConstructorLabelsEnum["KEY"] = "key";
})(ConstructorLabelsEnum || (ConstructorLabelsEnum = {}));

var RendererStatesEnum;
(function (RendererStatesEnum) {
    RendererStatesEnum["GRAPHOL"] = "graphol";
    RendererStatesEnum["GRAPHOL_LITE"] = "lite";
    RendererStatesEnum["FLOATY"] = "floaty";
    RendererStatesEnum["INCREMENTAL"] = "incremental";
})(RendererStatesEnum || (RendererStatesEnum = {}));

/**
 * # Ontology
 * Class used as the Model of the whole app.
 */
class Ontology extends AnnotatedElement {
    /**
     * @param {string} name
     * @param {string} version
     * @param {Namespace[]} namespaces
     * @param {Diagram[]} diagrams
     */
    constructor(name, version, iri, namespaces = [], diagrams = []) {
        super();
        this.namespaces = [];
        this.diagrams = [];
        this._entities = new Map();
        // computed only in floaty
        this.hierarchiesBySubclassMap = new Map();
        this.hierarchiesBySuperclassMap = new Map();
        /** @type {string} */
        this.name = name;
        /** @type {string} */
        this.version = version;
        /** @type {Namespace[]} */
        this.namespaces = namespaces;
        /** @type {Diagram[]} */
        this.diagrams = diagrams;
        this.iri = iri;
        this.languages = {
            /** @type {import('../grapholscape').Language[]}*/
            list: [],
            default: ''
        };
    }
    /** @param {Namespace} namespace */
    addNamespace(namespace) {
        this.namespaces.push(namespace);
    }
    /**
     * Get the Namspace object given its IRI string
     * @param {string} iriValue the IRI assigned to the namespace
     * @returns {Namespace}
     */
    getNamespace(iriValue) {
        return this.namespaces.find(ns => ns.toString() === iriValue);
    }
    /**
     * Get the Namespace given one of its prefixes
     * @param {string} prefix
     * @returns {Namespace}
     */
    getNamespaceFromPrefix(prefix) {
        return this.namespaces.find(ns => ns.hasPrefix(prefix));
    }
    /** @param {Diagram} diagram */
    addDiagram(diagram) {
        this.diagrams.push(diagram);
    }
    /**
     * Get the diagram with the given id
     */
    getDiagram(diagramId) {
        if (diagramId < 0 || diagramId > this.diagrams.length)
            return;
        return this.diagrams.find(diagram => diagram.id === diagramId);
    }
    getDiagramByName(name) {
        return this.diagrams.find(d => d.name.toLowerCase() === (name === null || name === void 0 ? void 0 : name.toLowerCase()));
    }
    addEntity(entity) {
        this.entities.set(entity.iri.fullIri, entity);
    }
    getEntity(iri) {
        for (let entity of this.entities.values()) {
            if (entity.iri.equals(iri)) {
                return entity;
            }
        }
        console.warn(`Can't find any entity with iri = "${iri}"`);
        return null;
    }
    getEntityFromOccurrence(entityOccurrence) {
        const diagram = this.getDiagram(entityOccurrence.diagramId);
        if (!diagram)
            return;
        for (let [_, representation] of diagram.representations) {
            const cyElement = representation.cy.$id(entityOccurrence.elementId);
            try {
                if (cyElement === null || cyElement === void 0 ? void 0 : cyElement.data().iri) {
                    return this.getEntity(cyElement.data().iri);
                }
            }
            catch (e) {
                console.log(entityOccurrence);
            }
        }
        console.warn(`Can't find occurrence ${entityOccurrence.toString()} in any diagram's representation`);
        return undefined;
    }
    getGrapholElement(elementId, diagramId, renderState = RendererStatesEnum.GRAPHOL) {
        var _a, _b, _c;
        if (diagramId || diagramId === 0)
            return (_b = (_a = this.getDiagram(diagramId)) === null || _a === void 0 ? void 0 : _a.representations.get(renderState)) === null || _b === void 0 ? void 0 : _b.grapholElements.get(elementId);
        for (let diagram of this.diagrams) {
            const elem = (_c = diagram.representations.get(renderState)) === null || _c === void 0 ? void 0 : _c.grapholElements.get(elementId);
            if (elem)
                return elem;
        }
    }
    getGrapholNode(nodeId, diagramId, renderState = RendererStatesEnum.GRAPHOL) {
        try {
            const node = this.getGrapholElement(nodeId, diagramId, renderState);
            return node;
        }
        catch (e) {
            console.error(e);
        }
    }
    getGrapholEdge(edgeId, diagramId, renderState = RendererStatesEnum.GRAPHOL) {
        try {
            const edge = this.getGrapholElement(edgeId, diagramId, renderState);
            return edge;
        }
        catch (e) {
            console.error(e);
        }
    }
    // /**
    //  * Get an element in the ontology by id, searching in every diagram
    //  * @param {string} elem_id - The `id` of the elem to retrieve
    //  * @returns {cytoscape.CollectionReturnValue} The cytoscape object representation.
    //  */
    // getElem(elem_id: string): cytoscape.CollectionReturnValue {
    //   for (let diagram of this.diagrams) {
    //     let node = diagram.cy.$id(elem_id)
    //     if (node.length > 0) return node
    //   }
    // }
    /**
     * Retrieve an entity by its IRI.
     * @param {string} iri - The IRI in full or prefixed form.
     * i.e. : `grapholscape:world` or `https://examples/grapholscape/world`
     * @returns {cytoscape.CollectionReturnValue} The cytoscape object representation.
     */
    // getEntity(iri: string): cytoscape.CollectionReturnValue {
    //   if (this.getEntityOccurrences(iri)) return this.getEntityOccurrences(iri)[0]
    // }
    /**
     * Retrieve all occurrences of an entity by its IRI.
     * @param {string} iri - The IRI in full or prefixed form.
     * i.e. : `grapholscape:world` or `https://examples/grapholscape/world`
     * @returns An array of EntityOccurrence objects
     */
    getEntityOccurrences(iri, diagramId, renderState) {
        var _a, _b;
        // return this.entities[iri] || this.entities[this.prefixedToFullIri(iri)]
        return diagramId || diagramId === 0
            ? (_a = this.getEntity(iri)) === null || _a === void 0 ? void 0 : _a.getOccurrencesByDiagramId(diagramId, renderState)
            : (_b = this.getEntity(iri)) === null || _b === void 0 ? void 0 : _b.occurrences;
    }
    // /**
    //  * Get an element in the ontology by its id and its diagram id
    //  * @param {string} elemID - The id of the element to retrieve
    //  * @param {number} diagramID - the id of the diagram containing the element
    //  * @returns {cytoscape.CollectionReturnValue} The element in cytoscape object representation
    //  */
    // getElemByDiagramAndId(elemID: string, diagramID: number): cytoscape.CollectionReturnValue {
    //   let diagram = this.getDiagram(diagramID)
    //   if (diagram) {
    //     return diagram.cy.$id(elemID)
    //   }
    // }
    /**
     * Get the entities in the ontology
     * @returns {Object.<string, cytoscape.CollectionReturnValue[]>} a map of IRIs, with an array of entity occurrences (object[iri].occurrences)
     */
    // getEntities(): { [s: string]: cytoscape.CollectionReturnValue[] } {
    //   let entities = {}
    //   this.diagrams.forEach(diagram => {
    //     diagram.cy.$('.predicate').forEach(entity => {
    //       let iri = entity.data('iri').fullIri
    //       if (!Object.keys(entities).includes(iri)) {
    //         entities[iri] = []
    //       }
    //       entities[iri].push(entity)
    //     })
    //   })
    //   //this._entities = entities
    //   return entities
    // }
    /**
     * Check if entity has the specified iri in full or prefixed form
     * @param {Entity} entity
     * @param {string} iri
     * @returns {boolean}
     */
    // checkEntityIri(entity: Entity, iri: string): boolean {
    //   /** @type {Iri} */
    //   let entityIri: Iri = entity.data('iri') || entity.data.iri
    //   return entityIri.fullIri === iri ||
    //     entityIri.prefixed === iri
    // }
    /**
     * Retrieve the full IRI given a prefixed IRI
     * @param {string} prefixedIri a prefixed IRI
     * @returns {string} full IRI
     */
    prefixedToFullIri(prefixedIri) {
        if (!prefixedIri || typeof (prefixedIri) !== 'string')
            return;
        for (let namespace of this.namespaces) {
            let prefix = namespace.prefixes.find(p => prefixedIri.includes(p + ':'));
            if (prefix)
                return prefixedIri.replace(prefix + ':', namespace.toString());
            else if (prefixedIri.startsWith(':') && namespace.prefixes.some(p => p === '')) {
                return prefixedIri.replace(':', namespace.toString());
            }
        }
    }
    computeDatatypesOnDataProperties() {
        let cyElement, representation, datatypeNode, datatype, occurrences;
        this.entities.forEach((dataPropertyEntity, _) => {
            if (dataPropertyEntity.is(GrapholTypesEnum.DATA_PROPERTY)) {
                occurrences = dataPropertyEntity.occurrences.get(RendererStatesEnum.GRAPHOL);
                if (!occurrences)
                    return;
                // retrieve datatype for dataproperties
                occurrences.forEach(occurrence => {
                    var _a;
                    representation = (_a = this.getDiagram(occurrence.diagramId)) === null || _a === void 0 ? void 0 : _a.representations.get(RendererStatesEnum.GRAPHOL);
                    cyElement = representation === null || representation === void 0 ? void 0 : representation.cy.$id(occurrence.elementId);
                    if (cyElement && cyElement.nonempty()) {
                        datatypeNode = cyElement
                            .neighborhood(`node[type = "${GrapholTypesEnum.RANGE_RESTRICTION}"]`)
                            .neighborhood(`node[type = "${GrapholTypesEnum.VALUE_DOMAIN}"]`);
                        if (datatypeNode.nonempty()) {
                            datatype = datatypeNode.first().data('displayedName');
                            dataPropertyEntity.datatype = datatype;
                            representation === null || representation === void 0 ? void 0 : representation.updateElement(occurrence.elementId);
                        }
                    }
                });
            }
        });
    }
    get isEntitiesEmpty() { return (!this._entities || Object.keys(this._entities).length === 0); }
    get entities() { return this._entities; }
}

var cytoscapeDefaultConfig = {
    layout: { name: 'preset' },
    autoungrabify: true,
    maxZoom: 2.5,
    minZoom: 0.02,
    wheelSensitivity: 0.2,
};
const liteOptions = {
    layout: { name: 'preset' },
    autoungrabify: false,
    maxZoom: 2.5,
    minZoom: 0.02,
    wheelSensitivity: 0.2,
};
const floatyOptions = {
    layout: { name: 'preset' },
    autoungrabify: false,
    maxZoom: 2.5,
    minZoom: 0.02,
    wheelSensitivity: 0.2,
};

var WidgetEnum;
(function (WidgetEnum) {
    WidgetEnum["DIAGRAM_SELECTOR"] = "diagram-selector";
    WidgetEnum["ENTITY_DETAILS"] = "details";
    WidgetEnum["ENTITY_SELECTOR"] = "entity-selector";
    WidgetEnum["FILTERS"] = "filters";
    WidgetEnum["FIT_BUTTON"] = "fit-button";
    WidgetEnum["FULLSCREEN_BUTTON"] = "fullscreen-button";
    WidgetEnum["ONTOLOGY_EXPLORER"] = "ontology-explorer";
    WidgetEnum["ONTOLOGY_INFO"] = "ontology-info";
    WidgetEnum["OWL_VISUALIZER"] = "owl-visualizer";
    WidgetEnum["RENDERER_SELECTOR"] = "renderer-selector";
    WidgetEnum["LAYOUT_SETTINGS"] = "layout-settings";
    WidgetEnum["SETTINGS"] = "settings";
    WidgetEnum["ZOOM_TOOLS"] = "zoom-tools";
    WidgetEnum["INITIAL_RENDERER_SELECTOR"] = "initial-renderer-selector";
    WidgetEnum["INCREMENTAL_MENU"] = "incremental-menu";
})(WidgetEnum || (WidgetEnum = {}));

const NAMESPACE = 'obda-systems.grapholscape';
const getNamespacedKey = (key) => `${NAMESPACE}-${key}`;
const getKeyWithoutNamespace = (key) => key.substring(NAMESPACE.length + 1);
const valueToStore = (v) => JSON.stringify(v);
const valueFromStorage = (v) => JSON.parse(v);
/**
 * Load config from local storage
 */
function loadConfig() {
    const config = {};
    if (storageAvailable() && isAnySettingSaved()) {
        Object.keys(window.localStorage)
            .filter(k => k.startsWith(NAMESPACE)) // take only local storage items written by grapholscape
            .forEach(k => {
            const configKey = getKeyWithoutNamespace(k);
            const value = valueFromStorage(window.localStorage.getItem(k));
            if (Object.values(WidgetEnum).includes(configKey)) {
                if (!config.widgets)
                    config.widgets = {};
                config.widgets[configKey] = value;
            }
            else {
                config[configKey] = value;
            }
        });
    }
    return config;
}
/**
 * Store a single setting in local storage
 * @param {string} k the key of the setting to store
 * @param {any} value the value of the setting to store
 */
function storeConfigEntry(k, value) {
    if (storageAvailable())
        window.localStorage.setItem(getNamespacedKey(k), valueToStore(value));
}
function storageAvailable() {
    let storage = window.localStorage;
    try {
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}
/**
 * @returns Whether there is any local storage in setting belonging to grapholscape
 */
function isAnySettingSaved() {
    if (storageAvailable()) {
        return Object.keys(window.localStorage).some(k => k.startsWith(NAMESPACE));
    }
    return false;
}
function clearLocalStorage() {
    Object.keys(window.localStorage)
        .filter(k => k.startsWith(NAMESPACE))
        .forEach(k => window.localStorage.removeItem(k));
}

var Language;
(function (Language) {
    Language["DE"] = "de";
    Language["EN"] = "en";
    Language["ES"] = "es";
    Language["FR"] = "fr";
    Language["IT"] = "it";
})(Language || (Language = {}));
var EntityNameType;
(function (EntityNameType) {
    EntityNameType["LABEL"] = "label";
    EntityNameType["PREFIXED_IRI"] = "prefixedIri";
    EntityNameType["FULL_IRI"] = "fullIri";
})(EntityNameType || (EntityNameType = {}));

var FunctionalityEnum;
(function (FunctionalityEnum) {
    FunctionalityEnum["functional"] = "functional";
    FunctionalityEnum["inverseFunctional"] = "inverseFunctional";
    FunctionalityEnum["transitive"] = "transitive";
    FunctionalityEnum["symmetric"] = "symmetric";
    FunctionalityEnum["asymmetric"] = "asymmetric";
    FunctionalityEnum["reflexive"] = "reflexive";
    FunctionalityEnum["irreflexive"] = "irreflexive";
})(FunctionalityEnum || (FunctionalityEnum = {}));
class GrapholEntity extends AnnotatedElement {
    constructor(iri, type) {
        super();
        this._occurrences = new Map([[RendererStatesEnum.GRAPHOL, []]]);
        this._functionalities = [];
        this.iri = iri;
        this.type = type;
    }
    addOccurrence(occurenceId, diagramId, representationKind = RendererStatesEnum.GRAPHOL) {
        if (!this.occurrences.get(representationKind)) {
            this.occurrences.set(representationKind, []);
        }
        const occurrences = this.occurrences.get(representationKind);
        if (!(occurrences === null || occurrences === void 0 ? void 0 : occurrences.find(r => r.elementId === occurenceId && r.diagramId === diagramId))) {
            occurrences === null || occurrences === void 0 ? void 0 : occurrences.push({
                elementId: occurenceId,
                diagramId: diagramId,
            });
        }
    }
    removeOccurrence(occurrenceId, diagramId, representationKind) {
        const occurrences = this.occurrences.get(representationKind);
        const occurrenceToRemoveIndex = occurrences === null || occurrences === void 0 ? void 0 : occurrences.indexOf({ elementId: occurrenceId, diagramId: diagramId });
        if (occurrenceToRemoveIndex !== undefined) {
            occurrences === null || occurrences === void 0 ? void 0 : occurrences.splice(occurrenceToRemoveIndex, 1);
        }
    }
    /**
     * Get all occurrences of the entity in a given diagram
     * @param diagramId the diagram in which the entity must occurr
     * @param representationKind the diagram representation identifier ({@link RendererStatesEnum})
     * if not set, all representations will be considered
     * @returns A map with the occurrences in the original Graphol representation and other
     * replicated occurrences in other diagram representations
     */
    getOccurrencesByDiagramId(diagramId, representationKind) {
        const result = new Map();
        if (representationKind) {
            const occurrences = this.occurrences.get(representationKind);
            if (occurrences) {
                result.set(representationKind, occurrences.filter(occ => occ.diagramId === diagramId));
            }
        }
        else {
            for (let [representationKind, occurrences] of this.occurrences) {
                result.set(representationKind, occurrences.filter(occ => occ.diagramId === diagramId));
            }
        }
        return result;
    }
    get type() { return this._type; }
    set type(type) {
        this._type = type;
    }
    /**
     * Check if entity is of a certain type
     * @param type
     */
    is(type) {
        return this.type === type;
    }
    get occurrences() {
        return this._occurrences;
    }
    set iri(val) {
        this._iri = val;
    }
    get iri() {
        return this._iri;
    }
    get functionalities() {
        return this._functionalities;
    }
    set functionalities(functionalities) {
        this._functionalities = functionalities;
    }
    get datatype() { return this._datatype; }
    set datatype(datatype) { this._datatype = datatype; }
    hasFunctionality(functionalityKind) {
        var _a;
        return ((_a = this._functionalities) === null || _a === void 0 ? void 0 : _a.includes(functionalityKind)) || false;
    }
    hasOccurrenceInDiagram(diagramId, representationKind) {
        var _a;
        if (representationKind) {
            const result = (_a = this.occurrences.get(representationKind)) === null || _a === void 0 ? void 0 : _a.some(occ => occ.diagramId === diagramId);
            return result === true;
        }
        for (let occurrenceInRepresentation of this.occurrences.values()) {
            if (occurrenceInRepresentation.some(occ => occ.diagramId === diagramId)) {
                return true;
            }
        }
        return false;
    }
    getDisplayedName(nameType, actualLanguage, defaultLanguage) {
        var _a, _b, _c;
        let newDisplayedName;
        switch (nameType) {
            case EntityNameType.LABEL:
                newDisplayedName =
                    ((_a = this.getLabels(actualLanguage)[0]) === null || _a === void 0 ? void 0 : _a.lexicalForm) ||
                        ((_b = this.getLabels(defaultLanguage)[0]) === null || _b === void 0 ? void 0 : _b.lexicalForm) ||
                        ((_c = this.getLabels()[0]) === null || _c === void 0 ? void 0 : _c.lexicalForm) ||
                        this.iri.remainder;
                break;
            case EntityNameType.PREFIXED_IRI:
                newDisplayedName = this.iri.prefixed;
                break;
            case EntityNameType.FULL_IRI:
                newDisplayedName = this.iri.fullIri;
                break;
        }
        if (this.is(GrapholTypesEnum.CLASS) || this.is(GrapholTypesEnum.INDIVIDUAL))
            return newDisplayedName.replace(/\r?\n|\r/g, '');
        else
            return newDisplayedName;
    }
    getEntityOriginalNodeId() {
        const grapholRepresentationOccurrences = this.occurrences.get(RendererStatesEnum.GRAPHOL);
        if (grapholRepresentationOccurrences) {
            return grapholRepresentationOccurrences[0].elementId; // used in UI to show the original nodeID in graphol
        }
    }
}

class GrapholElement {
    constructor(_id, _type) {
        this._id = _id;
        this._type = _type;
    }
    get id() { return this._id; }
    set id(value) {
        this._id = value;
    }
    get type() { return this._type; }
    set type(type) {
        this._type = type;
    }
    get displayedName() { return this._displayedName; }
    set displayedName(displayedName) {
        this._displayedName = displayedName;
    }
    get originalId() { return this._originalId; }
    set originalId(id) { this._originalId = id; }
    get iri() { return this._iri; }
    set iri(iri) { this._iri = iri; }
    /**
     * Check if node is of a certain type
     * @param type
     */
    is(type) {
        return this.type === type;
    }
    /**
     *
     * @returns whether node is an entity
     */
    isEntity() {
        switch (this.type) {
            case GrapholTypesEnum.CLASS:
            case GrapholTypesEnum.DATA_PROPERTY:
            case GrapholTypesEnum.OBJECT_PROPERTY:
            case GrapholTypesEnum.INDIVIDUAL:
            case GrapholTypesEnum.CLASS_INSTANCE:
                return true;
        }
        return false;
    }
    getCytoscapeRepr(grapholEntity) {
        const result = {
            data: {
                id: this.id,
                type: this.type || undefined,
                displayedName: this.displayedName || undefined,
                originalId: this.originalId || undefined,
                iri: this.iri || (grapholEntity === null || grapholEntity === void 0 ? void 0 : grapholEntity.iri.fullIri),
                datatype: grapholEntity === null || grapholEntity === void 0 ? void 0 : grapholEntity.datatype,
            }
        };
        // Set functionality for data/object properties
        if ((grapholEntity === null || grapholEntity === void 0 ? void 0 : grapholEntity.is(GrapholTypesEnum.DATA_PROPERTY)) || (grapholEntity === null || grapholEntity === void 0 ? void 0 : grapholEntity.is(GrapholTypesEnum.OBJECT_PROPERTY))) {
            result.data[FunctionalityEnum.functional] = grapholEntity.hasFunctionality(FunctionalityEnum.functional);
            result.data[FunctionalityEnum.inverseFunctional] = grapholEntity.hasFunctionality(FunctionalityEnum.inverseFunctional);
        }
        return [result];
    }
    clone() {
        const cloneObj = new GrapholElement(this.id, this.type);
        Object.assign(cloneObj, this);
        return cloneObj;
    }
}

class GrapholEdge extends GrapholElement {
    constructor(id, type) {
        super(id, type);
        this._breakpoints = [];
    }
    addBreakPoint(breakpoint) {
        if (!this._breakpoints)
            this._breakpoints = [];
        this._breakpoints.push(breakpoint);
    }
    computeBreakpointsDistancesWeights(sourcePosition, targetPosition) {
        this.breakpoints.forEach(breakpoint => {
            breakpoint.setSourceTarget(sourcePosition, targetPosition);
        });
    }
    get sourceEndpoint() {
        return this._sourceEndpoint;
    }
    set sourceEndpoint(endpoint) {
        if (!endpoint || endpoint.x !== 0 || endpoint.y !== 0)
            this._sourceEndpoint = endpoint;
    }
    get targetEndpoint() {
        return this._targetEndpoint;
    }
    set targetEndpoint(endpoint) {
        if (!endpoint || endpoint.x !== 0 || endpoint.y !== 0)
            this._targetEndpoint = endpoint;
    }
    /**
     * Returns an array of mid-edge breakpoints (without source/target endpoints)
     */
    get breakpoints() {
        return this._breakpoints.slice(1, -1);
    }
    /**
     * Returns an array of all the breakpoints (including source/target endpoints)
     */
    get controlpoints() {
        return this._breakpoints;
    }
    set controlpoints(newControlPoints) {
        this._breakpoints = newControlPoints;
    }
    get sourceId() {
        return this._sourceId;
    }
    set sourceId(sourceId) {
        this._sourceId = sourceId;
    }
    get targetId() {
        return this._targetId;
    }
    set targetId(targetId) {
        this._targetId = targetId;
    }
    get targetLabel() {
        return this._targetLabel;
    }
    set targetLabel(targetLabel) {
        this._targetLabel = targetLabel;
    }
    get sourceLabel() {
        return this._sourceLabel;
    }
    set sourceLabel(sourceLabel) {
        this._sourceLabel = sourceLabel;
    }
    get type() { return super.type; }
    set type(newType) {
        super.type = newType;
        if (this.is(GrapholTypesEnum.SAME) || this.is(GrapholTypesEnum.DIFFERENT))
            this.displayedName = this.type;
    }
    getCytoscapeRepr(grapholEntity) {
        let result = super.getCytoscapeRepr(grapholEntity);
        Object.assign(result[0].data, {
            type: this.type || undefined,
            source: this.sourceId,
            target: this.targetId,
            sourceLabel: this.sourceLabel || undefined,
            targetLabel: this.targetLabel || undefined,
            sourceEndpoint: this.sourceEndpoint ? [this.sourceEndpoint.x, this.sourceEndpoint.y] : undefined,
            targetEndpoint: this.targetEndpoint ? [this.targetEndpoint.x, this.targetEndpoint.y] : undefined,
            segmentDistances: this.breakpoints.length > 0 ? this.breakpoints.map(b => b.distance) : undefined,
            segmentWeights: this.breakpoints.length > 0 ? this.breakpoints.map(b => b.weight) : undefined,
        });
        result[0].classes = this.type.toString();
        return result;
    }
    clone() {
        const cloneObj = new GrapholEdge(this.id, this.type);
        Object.assign(cloneObj, this);
        return cloneObj;
    }
}
function isGrapholEdge(elem) {
    return elem.sourceId !== undefined;
}

class DiagramRepresentation {
    constructor(cyConfig = cytoscapeDefaultConfig) {
        this._grapholElements = new Map();
        this._hasEverBeenRendered = false;
        this.cy = cytoscape(cyConfig);
    }
    get cy() {
        return this._cy;
    }
    set cy(newCy) {
        this._cy = newCy;
    }
    get hasEverBeenRendered() {
        return this._hasEverBeenRendered;
    }
    set hasEverBeenRendered(value) {
        this._hasEverBeenRendered = value;
    }
    /**
     * Add a new element (node or edge) to the diagram
     * @param newElement the GrapholElement to add to the diagram
     */
    addElement(newElement, grapholEntity) {
        this.grapholElements.set(newElement.id, newElement);
        // Every elem can have a set of fake elements to build a custom shape
        const cyElems = newElement.getCytoscapeRepr(grapholEntity);
        this.cy.add(cyElems);
    }
    removeElement(elementId) {
        this.grapholElements.delete(elementId);
        this.cy.$id(elementId).remove();
    }
    updateElement(elementIdOrObj) {
        let grapholElement;
        if (typeof elementIdOrObj === 'string') {
            grapholElement = this.grapholElements.get(elementIdOrObj);
        }
        else {
            grapholElement = elementIdOrObj;
        }
        if (!grapholElement)
            return;
        const cyElement = this.cy.$id(grapholElement.id);
        // if (isGrapholNode(grapholElement) && grapholElement.position !== cyElement.position()) {
        //   // cyElement.position(grapholElement.position)
        // }
        if (isGrapholEdge(grapholElement)) {
            cyElement.move({
                source: grapholElement.sourceId,
                target: grapholElement.targetId
            });
        }
        const iri = cyElement.data().iri;
        cyElement.data(grapholElement.getCytoscapeRepr()[0].data);
        // iri should be always preserved
        cyElement.data().iri = iri;
    }
    containsEntity(iriOrGrapholEntity) {
        let iri;
        if (iriOrGrapholEntity.iri !== undefined) {
            iri = iriOrGrapholEntity.iri;
        }
        else {
            iri = iriOrGrapholEntity;
        }
        for (let [_, grapholElement] of this.grapholElements) {
            if (grapholElement.iri && iri.equals(grapholElement.iri)) {
                return true;
            }
        }
        return false;
    }
    get grapholElements() {
        return this._grapholElements;
    }
    set grapholElements(newElementMap) {
        this._grapholElements = newElementMap;
    }
    /**
     * Getter
     */
    get nodes() {
        return this.cy.nodes().jsons();
    }
    /**
     * Getter
     */
    get edges() {
        return this.cy.edges().jsons();
    }
}

/**
 * @property {string} name - diagram's name
 * @property {string | number} id - diagram's identifier
 */
class Diagram {
    /**
     * @param {string} name
     * @param {number} id
     */
    constructor(name, id) {
        this.representations = new Map([[RendererStatesEnum.GRAPHOL, new DiagramRepresentation()]]);
        this.name = name;
        this.id = id;
        this.representations.set(RendererStatesEnum.GRAPHOL, new DiagramRepresentation());
    }
    /**
     * Add a new element (node or edge) to the diagram's representation
     * @param newElement the GrapholElement to add to the diagram
     */
    addElement(newElement, grapholEntity) {
        var _a;
        (_a = this.representations.get(RendererStatesEnum.GRAPHOL)) === null || _a === void 0 ? void 0 : _a.addElement(newElement, grapholEntity);
    }
}

class IncrementalDiagram extends Diagram {
    constructor() {
        super('Incremental', -1);
        this.representations = new Map([[RendererStatesEnum.INCREMENTAL, new DiagramRepresentation(floatyOptions)]]);
    }
    addElement(newElement, grapholEntity) {
        var _a;
        (_a = this.representation) === null || _a === void 0 ? void 0 : _a.addElement(newElement, grapholEntity);
    }
    removeElement(elementId) {
        var _a;
        (_a = this.representation) === null || _a === void 0 ? void 0 : _a.removeElement(elementId);
    }
    containsEntity(iriOrGrapholEntity) {
        var _a;
        return (_a = this.representation) === null || _a === void 0 ? void 0 : _a.containsEntity(iriOrGrapholEntity);
    }
    get representation() {
        return this.representations.get(RendererStatesEnum.INCREMENTAL);
    }
}

/**
 * Class representing a namespace
 * @property {string[]} prefixes - array of prefixes
 * @property {string} value - namespace lexical form
 * @property {boolean} standard - bool saying if the namespace is standard or user defined
 */
class Namespace {
    constructor(prefixes, value, standard = false) {
        this.prefixes = prefixes;
        this.value = value;
        this.standard = standard;
    }
    get prefixes() {
        return Array.from(this._prefixes);
    }
    set prefixes(value) {
        this._prefixes = value;
    }
    set value(val) {
        this._value = val;
    }
    toString() {
        return this._value;
    }
    set standard(value) {
        this._standard = value;
    }
    /**
     * Wether the namespace is standard (`true`) or user defined (`false`)
     */
    isStandard() {
        return this._standard ? true : false;
    }
    /**
     * Check if the passed prefix is assigned to this namespace
     * @param prefix the prefix to check
     */
    hasPrefix(prefix) {
        return this.prefixes.includes(prefix);
    }
    addPrefix(newPrefix) {
        this._prefixes.push(newPrefix);
    }
}

class Iri {
    constructor(iri, namespaces, remainder) {
        let isPrefixed = false;
        this.namespace = namespaces.find(n => {
            if (iri.includes(n.toString()))
                return true;
            for (let prefix of n.prefixes) {
                if (iri === `${prefix}:${iri.split(':')[1]}`) {
                    isPrefixed = true;
                    return true;
                }
            }
        });
        if (remainder) {
            this.remainder = remainder;
            const ns = iri.split(remainder)[0];
            if (iri === ns.concat(remainder)) {
                this.namespace = new Namespace([], ns);
            }
            else {
                this.remainder = iri;
            }
        }
        else {
            if (!this.namespace) {
                console.warn(`Namespace not found for [${iri}]. The prefix undefined has been assigned`);
                // try {
                //   const uri = new URL(iri)
                //   this.remainder = uri.hash || uri.pathname.slice(uri.pathname.lastIndexOf('/') + 1)
                //   this.namespace = new Namespace([], uri.toString().slice(0, uri.toString().length - this.remainder.length))
                // } catch (e) {
                //   this.remainder = iri
                // }
                this.remainder = iri;
            }
            else {
                this.remainder = isPrefixed ? iri.split(':')[1] : iri.slice(this.namespace.toString().length);
            }
        }
    }
    set remainder(value) {
        this._remainder = value;
    }
    get remainder() {
        return this._remainder;
    }
    set namespace(value) {
        this._namespace = value;
    }
    get namespace() {
        return this._namespace;
    }
    get prefix() {
        var _a;
        return (_a = this.namespace) === null || _a === void 0 ? void 0 : _a.prefixes[0];
    }
    get fullIri() {
        var _a;
        return ((_a = this.namespace) === null || _a === void 0 ? void 0 : _a.toString()) ? `${this.namespace.toString()}${this.remainder}` : this.remainder;
    }
    get prefixed() {
        return this.prefix || this.prefix === '' ? `${this.prefix}:${this.remainder}` : `${this.remainder}`;
    }
    equals(iriToCheck) {
        if (typeof iriToCheck !== 'string') {
            iriToCheck = iriToCheck.fullIri;
        }
        if (this.fullIri === iriToCheck || this.prefixed === iriToCheck)
            return true;
        if (!this.namespace)
            return false;
        for (let prefix of this.namespace.prefixes) {
            if (`${prefix}:${this.remainder}` === iriToCheck) {
                return true;
            }
        }
        return false;
    }
    hasPrefix(prefixToCheck) {
        var _a;
        return ((_a = this.namespace) === null || _a === void 0 ? void 0 : _a.hasPrefix(prefixToCheck)) || false;
    }
}

const UNDEFINED_LANGUAGE = '_';
class Annotation {
    constructor(property, lexicalForm, language, datatype) {
        this.property = property;
        this.lexicalForm = lexicalForm;
        this.language = language || UNDEFINED_LANGUAGE;
        this.datatype = datatype || '';
    }
}

class GrapholscapeTheme {
    constructor(id, colours, name) {
        this.colours = {};
        this._id = id;
        this.name = name || '';
        if (colours) {
            this.colours = colours;
        }
    }
    get id() { return this._id; }
    get name() { return this._name || this.id; }
    set name(newName) { this._name = newName; }
    getColour(name) {
        return this.colours[name];
    }
    setColour(name, colourValue) {
        this.colours[name] = colourValue;
    }
}

var ColoursNames;
(function (ColoursNames) {
    // foreground
    /** Foreground color, used for main texts */
    ColoursNames["fg_default"] = "fg-default";
    /** Foreground muted, should be darker than default. Used for secondary text */
    ColoursNames["fg_muted"] = "fg-muted";
    /** Foreground muted, should be lighter and softer than default.
     * Used for placeholders, tips and text used for clarifying UI objects
     */
    ColoursNames["fg_subtle"] = "fg-subtle";
    /** Foreground text colour placed on a surface of a emphasy color such as accent, danger, success and so on */
    ColoursNames["fg_on_emphasis"] = "fg-on-emphasis";
    // background
    /** Main background surface colours used in UI widgets */
    ColoursNames["bg_default"] = "bg-default";
    /** Background color to create a higher or lower level with respect to bg_default color */
    ColoursNames["bg_inset"] = "bg-inset";
    // borders
    /** Borders main color */
    ColoursNames["border_default"] = "border-default";
    /** Softer than default, used for creating softer separations between UI objects */
    ColoursNames["border_subtle"] = "border-subtle";
    ColoursNames["shadow"] = "shadow";
    // neutral
    /** Used to emphasize secondary elements or texts. Like active elements */
    ColoursNames["neutral"] = "neutral";
    /** Emphasize secondary elements, should be darker than default */
    ColoursNames["neutral_muted"] = "neutral-muted";
    /** Emphasize secondary elements, used for active elements borders */
    ColoursNames["neutral_subtle"] = "neutral-subtle";
    // accent
    /** Primary color for selected/active elements in diagram or activable elemnts like toggles */
    ColoursNames["accent"] = "accent";
    /** Primary color in darker tone, used for decorations like surfaces or borders */
    ColoursNames["accent_muted"] = "accent-muted";
    /** Primary color in lighter tone, used for decorations like toggle's background color */
    ColoursNames["accent_subtle"] = "accent-subtle";
    // role colors
    /** Color for denoting a successful action */
    ColoursNames["success"] = "success";
    /** Denote successful action in darker tone, used for texts or borders */
    ColoursNames["success_muted"] = "success-muted";
    /** Denote successful action in lighter tone, used for backgrounds or surfaces */
    ColoursNames["success_subtle"] = "success-subtle";
    /** Color for denoting warnings */
    ColoursNames["attention"] = "attention";
    /** Color for denoting warnings in darker tone, used for texts or borders */
    ColoursNames["attention_muted"] = "attention-muted";
    /** Color for denoting warnings in lighter tone, used for backgrounds or surfaces */
    ColoursNames["attention_subtle"] = "attention-subtle";
    /** Color for denoting errors */
    ColoursNames["danger"] = "danger";
    /** Color for denoting errors in darker tone, used for texts or borders */
    ColoursNames["danger_muted"] = "danger-muted";
    /** Color for denoting errors in lighter tone, used for backgrounds or surfaces */
    ColoursNames["danger_subtle"] = "danger-subtle";
    // entities
    /** Color used for classes' nodes bodies */
    ColoursNames["class"] = "class";
    /** Color used for classes' nodes borders */
    ColoursNames["class_contrast"] = "class-contrast";
    /** Color used for object properties' nodes bodies */
    ColoursNames["object_property"] = "object-property";
    /** Color used for object properties' nodes borders */
    ColoursNames["object_property_contrast"] = "object-property-contrast";
    /** Color used for data properties' nodes bodies */
    ColoursNames["data_property"] = "data-property";
    /** Color used for data properties' nodes borders */
    ColoursNames["data_property_contrast"] = "data-property-contrast";
    /** Color used for individual's nodes bodies */
    ColoursNames["individual"] = "individual";
    /** Color used for individual's nodes borders */
    ColoursNames["individual_contrast"] = "individual-contrast";
    // graph colors
    /** Background color used in the diagram canvas */
    ColoursNames["bg_graph"] = "bg-graph";
    /** Body color for nodes that are white in plain Graphol */
    ColoursNames["bg_node_light"] = "bg-node-light";
    /** Body color for nodes that are black in plain Graphol */
    ColoursNames["bg_node_dark"] = "bg-node-dark";
    /** Body border color */
    ColoursNames["border_node"] = "border-node";
    /** Nodes/Edges label color */
    ColoursNames["label"] = "label";
    /** Opposite color of label */
    ColoursNames["label_contrast"] = "label-contrast";
    /** Edges lines color */
    ColoursNames["edge"] = "edge";
    // Instances Colors
    ColoursNames["class_instance"] = "class-instance";
    ColoursNames["class_instance_contrast"] = "class-instance-contrast";
})(ColoursNames || (ColoursNames = {}));

var DefaultThemesEnum;
(function (DefaultThemesEnum) {
    DefaultThemesEnum["GRAPHOLSCAPE"] = "grapholscape";
    DefaultThemesEnum["GRAPHOL"] = "graphol";
    DefaultThemesEnum["DARK"] = "dark";
})(DefaultThemesEnum || (DefaultThemesEnum = {}));
const gscapeColourMap = {
    // graph colours
    [ColoursNames.bg_graph]: '#fafafa',
    [ColoursNames.edge]: '#000',
    [ColoursNames.bg_node_light]: '#fcfcfc',
    [ColoursNames.bg_node_dark]: '#000',
    [ColoursNames.border_node]: '#000',
    [ColoursNames.label]: '#000',
    [ColoursNames.label_contrast]: '#fcfcfc',
    [ColoursNames.class]: '#F9F3A6',
    [ColoursNames.class_contrast]: '#B08D00',
    [ColoursNames.object_property]: '#AACDE1',
    [ColoursNames.object_property_contrast]: '#065A85',
    [ColoursNames.data_property]: '#C7DAAD',
    [ColoursNames.data_property_contrast]: '#4B7900',
    [ColoursNames.individual]: '#d3b3ef',
    [ColoursNames.individual_contrast]: '#9875b7',
    // UI colours
    [ColoursNames.fg_default]: '#24292f',
    [ColoursNames.fg_muted]: '#57606a',
    [ColoursNames.fg_subtle]: '#6e7781',
    [ColoursNames.fg_on_emphasis]: '#ffffff',
    [ColoursNames.bg_default]: '#f6f8fa',
    [ColoursNames.bg_inset]: '#eff2f5',
    [ColoursNames.border_default]: '#d0d7de',
    [ColoursNames.border_subtle]: 'rgba(27, 31, 36, 0.15)',
    [ColoursNames.shadow]: '#d0d7de',
    [ColoursNames.neutral]: '#e8ecef',
    [ColoursNames.neutral_muted]: '#dae0e7',
    [ColoursNames.neutral_subtle]: '#f3f5f7',
    [ColoursNames.accent]: '#0969da',
    [ColoursNames.accent_muted]: 'rgba(84, 174, 255, 0.4)',
    [ColoursNames.accent_subtle]: '#ddf4ff',
    // State Colours
    [ColoursNames.success]: '#1a7f37',
    [ColoursNames.success_muted]: 'rgba(74, 194, 107, 0.4)',
    [ColoursNames.success_subtle]: '#2da44e',
    [ColoursNames.attention]: '#9a6700',
    [ColoursNames.attention_muted]: 'rgba(212, 167, 44, 0.4)',
    [ColoursNames.attention_subtle]: '#fff8c5',
    [ColoursNames.danger]: '#cf222e',
    [ColoursNames.danger_muted]: 'rgba(255, 129, 130, 0.4)',
    [ColoursNames.danger_subtle]: '#FFEBE9',
    // Instance Colours
    [ColoursNames.class_instance]: '#ffa348',
    [ColoursNames.class_instance_contrast]: '#c64600'
};
const classicColourMap = Object.assign(JSON.parse(JSON.stringify(gscapeColourMap)), {
    [ColoursNames.bg_graph]: '#fafafa',
    [ColoursNames.edge]: '#000',
    [ColoursNames.bg_node_light]: '#fcfcfc',
    [ColoursNames.bg_node_dark]: '#000',
    [ColoursNames.border_node]: '#000',
    [ColoursNames.label]: '#000',
    [ColoursNames.label_contrast]: '#fcfcfc',
    [ColoursNames.object_property]: '#fcfcfc',
    [ColoursNames.object_property_contrast]: '#000',
    [ColoursNames.data_property]: '#fcfcfc',
    [ColoursNames.data_property_contrast]: '#000',
    [ColoursNames.class]: '#fcfcfc',
    [ColoursNames.class_contrast]: '#000',
    [ColoursNames.individual]: '#fcfcfc',
    [ColoursNames.individual_contrast]: '#000',
});
const darkColourMap = {
    // graph colors
    [ColoursNames.bg_graph]: '#0d1117',
    [ColoursNames.edge]: '#a0a0a0',
    [ColoursNames.bg_node_light]: '#a0a0a0',
    [ColoursNames.bg_node_dark]: '#010101',
    [ColoursNames.border_node]: '#a0a0a0',
    [ColoursNames.label]: '#a0a0a0',
    [ColoursNames.label_contrast]: '#000',
    [ColoursNames.object_property]: '#043954',
    [ColoursNames.object_property_contrast]: '#7fb3d2',
    [ColoursNames.data_property_contrast]: '#C7DAAD',
    [ColoursNames.data_property]: '#4B7900',
    [ColoursNames.class_contrast]: '#b28f00',
    [ColoursNames.class]: '#423500',
    [ColoursNames.individual_contrast]: '#9875b7',
    [ColoursNames.individual]: '#422D53',
    // UI colours
    [ColoursNames.fg_default]: '#c9d1d9',
    [ColoursNames.fg_muted]: '#8b949e',
    [ColoursNames.fg_subtle]: '#6e7681',
    [ColoursNames.fg_on_emphasis]: '#ffffff',
    [ColoursNames.bg_default]: '#21262d',
    [ColoursNames.bg_inset]: '#010409',
    [ColoursNames.border_default]: '#8b949e',
    [ColoursNames.border_subtle]: 'rgba(240,246,252,0.1)',
    [ColoursNames.shadow]: '#010409',
    [ColoursNames.neutral]: '#313b48',
    [ColoursNames.neutral_muted]: '#343941',
    [ColoursNames.neutral_subtle]: '#0c1015',
    [ColoursNames.accent]: '#58a6ff',
    [ColoursNames.accent_muted]: 'rgba(56,139,253,0.4)',
    [ColoursNames.accent_subtle]: 'rgba(56,139,253,0.15)',
};
const DefaultThemes = {
    grapholscape: new GrapholscapeTheme(DefaultThemesEnum.GRAPHOLSCAPE, gscapeColourMap, 'Grapholscape'),
    graphol: new GrapholscapeTheme(DefaultThemesEnum.GRAPHOL, classicColourMap, 'Graphol'),
    dark: new GrapholscapeTheme(DefaultThemesEnum.DARK, darkColourMap, 'Dark'),
};

const CSS_PROPERTY_NAMESPACE = '--gscape-color';

/**
 * @typedef {object} Filter
 * @property {string} Filter.selector Cytoscape selector identifying the elements to filter out
 * [cytoscape selectors](https://js.cytoscape.org/#selectors)
 * @property {boolean} Filter.active whether the filter is currently active or not
 * @property {boolean} Filter.activable whether the filter is currently activable
 * @property {string} Filter.class the class to add to filtered elems to easily retrieve them later on
 * @property {string} Filter.key unique key to identify a filter
 */
class Filter {
    /**
     *
     * @param key Unique identifier
     * @param compareFn Function receiving a GrapholElement and returning true if the element should be filtered, false otherwise
     */
    constructor(key, compareFn) {
        this._compareFn = () => false;
        this.active = false;
        this._locked = false;
        this._key = key;
        this._compareFn = compareFn;
    }
    get key() {
        return this._key;
    }
    get filterTag() {
        return `filter-${this.key}`;
    }
    get locked() { return this._locked; }
    lock() {
        this._locked = true;
    }
    unlock() {
        this._locked = false;
    }
    shouldFilter(grapholElement) {
        return this._compareFn(grapholElement);
    }
}
var DefaultFilterKeyEnum;
(function (DefaultFilterKeyEnum) {
    DefaultFilterKeyEnum["ALL"] = "all";
    DefaultFilterKeyEnum["DATA_PROPERTY"] = "data-property";
    DefaultFilterKeyEnum["VALUE_DOMAIN"] = "value-domain";
    DefaultFilterKeyEnum["INDIVIDUAL"] = "individual";
    DefaultFilterKeyEnum["UNIVERSAL_QUANTIFIER"] = "for-all";
    DefaultFilterKeyEnum["COMPLEMENT"] = "complement";
    DefaultFilterKeyEnum["HAS_KEY"] = "has-key";
})(DefaultFilterKeyEnum || (DefaultFilterKeyEnum = {}));
const dataPropertyFilter = () => {
    return new Filter(DefaultFilterKeyEnum.DATA_PROPERTY, (element) => element.is(GrapholTypesEnum.DATA_PROPERTY));
};
const valueDomainFilter = () => {
    return new Filter(DefaultFilterKeyEnum.VALUE_DOMAIN, (element) => element.is(GrapholTypesEnum.VALUE_DOMAIN));
};
const individualsFilter = () => {
    return new Filter(DefaultFilterKeyEnum.INDIVIDUAL, (element) => element.is(GrapholTypesEnum.INDIVIDUAL));
};
const universalQuantifierFilter = () => new Filter(DefaultFilterKeyEnum.UNIVERSAL_QUANTIFIER, (element) => {
    return (element.is(GrapholTypesEnum.DOMAIN_RESTRICTION) || element.is(GrapholTypesEnum.RANGE_RESTRICTION)) &&
        element.displayedName === 'forall';
});
const complementFilter = () => new Filter(DefaultFilterKeyEnum.COMPLEMENT, (element) => element.is(GrapholTypesEnum.COMPLEMENT));
const hasKeyFilter = () => new Filter(DefaultFilterKeyEnum.HAS_KEY, (element) => element.is(GrapholTypesEnum.KEY));
const getDefaultFilters = () => {
    return {
        DATA_PROPERTY: dataPropertyFilter(),
        VALUE_DOMAIN: valueDomainFilter(),
        INDIVIDUAL: individualsFilter(),
        UNIVERSAL_QUANTIFIER: universalQuantifierFilter(),
        COMPLEMENT: complementFilter(),
        HAS_KEY: hasKeyFilter(),
    };
};

const LABEL_HEIGHT = 23;
class GrapholNode extends GrapholElement {
    constructor() {
        super(...arguments);
        this._x = 0;
        this._y = 0;
        this._labelHeight = LABEL_HEIGHT;
    }
    get position() { return { x: this.x, y: this.y }; }
    set position(pos) {
        this._x = pos.x;
        this._y = pos.y;
    }
    get x() { return this._x; }
    set x(valX) { this._x = valX; }
    get y() { return this._y; }
    set y(valY) { this._y = valY; }
    get shape() { return this._shape; }
    set shape(shape) {
        this._shape = shape;
    }
    get identity() { return this._identity; }
    set identity(identity) {
        this._identity = identity;
    }
    get width() { return this._width; }
    set width(width) {
        this._width = width >= 0 ? width : -width;
    }
    get height() { return this._height; }
    set height(height) {
        this._height = height >= 0 ? height : -height;
        if (this.type === GrapholTypesEnum.FACET) {
            this._height = 40;
        }
    }
    get fillColor() { return this._fillColor; }
    set fillColor(fillColor) {
        this._fillColor = fillColor;
    }
    get labelXpos() { return this._labelXpos; }
    set labelXpos(labelXpos) {
        this._labelXpos = labelXpos;
    }
    setLabelXposFromXML(labelXpos) {
        if (labelXpos === this.position.x) {
            this._labelXcentered = true;
            this.labelXpos = 0;
        }
        else {
            this.labelXpos = labelXpos - this.position.x + 1;
        }
    }
    get labelHeight() { return this._labelHeight; }
    set labelHeight(value) {
        this._labelHeight = value;
    }
    get labelYpos() { return this._labelYpos; }
    set labelYpos(labelYpos) {
        this._labelYpos = labelYpos;
    }
    setLabelYposFromXML(labelYpos) {
        if (labelYpos === this.position.y) {
            this._labelYcentered = true;
            this.labelYpos = 0;
        }
        else {
            this.labelYpos = (labelYpos - this.y) + (this.height + 2) / 2 + this.labelHeight / 4;
        }
    }
    get isLabelXcentered() { return this._labelXcentered; }
    get isLabelYcentered() { return this._labelYcentered; }
    get fontSize() { return this._fontSize; }
    set fontSize(value) {
        this._fontSize = value;
    }
    get inputs() { return this._inputs; }
    set inputs(inputs) {
        this._inputs = inputs;
    }
    get shapePoints() { return this._shapePoints; }
    set shapePoints(shapePoints) {
        this._shapePoints = shapePoints;
    }
    get fakeNodes() { return this._fakeNodes; }
    addFakeNode(newFakeNode) {
        if (!this._fakeNodes)
            this._fakeNodes = [];
        this._fakeNodes.push(newFakeNode);
    }
    getCytoscapeRepr(grapholEntity) {
        const fakeNodesCytoscapeRepr = [];
        const thisCytoscapeRepr = super.getCytoscapeRepr(grapholEntity);
        thisCytoscapeRepr[0].position = this.position;
        Object.assign(thisCytoscapeRepr[0].data, {
            shape: this.shape || undefined,
            height: this.height || undefined,
            width: this.width || undefined,
            fillColor: this.fillColor || undefined,
            shapePoints: this.shapePoints || undefined,
            labelXpos: this.labelXpos || this.labelXpos == 0 ? this.labelXpos : undefined,
            labelYpos: this.labelYpos || this.labelYpos == 0 ? this.labelYpos : undefined,
            labelXcentered: this.isLabelXcentered,
            labelYcentered: this.isLabelYcentered,
            identity: this.identity,
        });
        if (!this.type)
            console.log(this);
        thisCytoscapeRepr[0].classes = this.type.toString();
        if (this.fakeNodes) {
            this.fakeNodes.forEach(fakeNode => {
                const fakeCyNode = fakeNode.getCytoscapeRepr(grapholEntity);
                fakeNodesCytoscapeRepr.push(...fakeCyNode);
            });
        }
        return [...fakeNodesCytoscapeRepr, ...thisCytoscapeRepr];
    }
    clone() {
        const cloneObj = new GrapholNode(this.id, this.type);
        Object.assign(cloneObj, this);
        return cloneObj;
    }
}
function isGrapholNode(elem) {
    return elem.shape !== undefined;
}

class BaseFilterManager {
    constructor() {
        this.lockedFilters = [];
    }
    filterActivation(filter) {
        if (filter.active) {
            console.warn(`Filter with key = "${filter.key} is already active`);
            return false;
        }
        if (filter.locked) {
            console.warn(`Filter has been locked and cannot be applied at the moment`);
            return false;
        }
        return true;
    }
    filterDeactivation(filter) {
        if (!filter.active) {
            return false;
        }
        if (filter.locked) {
            console.warn(`Filter has been locked and cannot be deactivated at the moment`);
            return false;
        }
        return true;
    }
    get filters() { return this._filters; }
    set filters(filters) {
        this._filters = filters;
        filters.forEach(filter => {
            if (this.lockedFilters.includes(filter.key))
                filter === null || filter === void 0 ? void 0 : filter.lock();
            else
                filter === null || filter === void 0 ? void 0 : filter.unlock();
        });
    }
}

function cytoscapeFilter(elementId, filterTag, cy) {
    const element = cy.$id(elementId);
    if (element.hasClass('filtered'))
        return;
    const classesToAdd = ['filtered', filterTag];
    element.addClass(classesToAdd.join(' '));
    // Filter fake nodes!
    cy.nodes(`[parent_node_id = "${element.id()}"]`).addClass(classesToAdd.join(' '));
    // ARCHI IN USCITA
    //var selector = `[source = "${element.data('id')}"]`
    element.outgoers('edge').forEach(e => {
        let neighbour = e.target();
        // if inclusion[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
        let number_edges_in_out = getNumberEdgesInOut(neighbour);
        if (!e.target().hasClass(classesToAdd[0]) && (number_edges_in_out <= 0 || e.data('type') === GrapholTypesEnum.INPUT)) {
            cytoscapeFilter(e.target().id(), filterTag, cy);
        }
    });
    // ARCHI IN ENTRATA
    element.incomers('edge').forEach(e => {
        let neighbour = e.source();
        // if Isa[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
        let number_edges_in_out = getNumberEdgesInOut(neighbour);
        if (!e.source().hasClass(classesToAdd[0]) && number_edges_in_out === 0) {
            cytoscapeFilter(e.source().id(), filterTag, cy);
        }
    });
    function getNumberEdgesInOut(neighbour) {
        let count = neighbour.outgoers('edge').size() + neighbour.incomers(`edge[type != "${GrapholTypesEnum.INPUT}"]`).size();
        neighbour.outgoers('node').forEach(node => {
            if (node.hasClass(classesToAdd[0])) {
                count--;
            }
        });
        neighbour.incomers(`edge[type != "${GrapholTypesEnum.INPUT}"]`).forEach(e => {
            if (e.source().hasClass(classesToAdd[0])) {
                count--;
            }
        });
        return count;
    }
}
function cytoscapeUnfilter(elementId, filterTag, cy) {
    const classToRemove = ['filtered', filterTag];
    const element = cy.$id(elementId);
    if (element.hasClass('filtered') && element.hasClass(filterTag)) {
        cy.$id(elementId).removeClass(classToRemove.join(' '));
        cy.$(`.${filterTag}`).removeClass(classToRemove.join(' '));
    }
}

class BaseRenderer {
    constructor(renderer) {
        if (renderer)
            this.renderer = renderer;
    }
    set renderer(newRenderer) {
        this._renderer = newRenderer;
        this.filterManager.filters = newRenderer.filters;
    }
    get renderer() {
        return this._renderer;
    }
    filter(elementId, filter) {
        if (this.renderer.cy)
            cytoscapeFilter(elementId, filter.filterTag, this.renderer.cy);
    }
    unfilter(elementId, filter) {
        if (this.renderer.cy)
            cytoscapeUnfilter(elementId, filter.filterTag, this.renderer.cy);
    }
}

var LifecycleEvent;
(function (LifecycleEvent) {
    LifecycleEvent["DiagramChange"] = "diagramChange";
    LifecycleEvent["RendererChange"] = "rendererChange";
    LifecycleEvent["ThemeChange"] = "themeChange";
    LifecycleEvent["EntitySelection"] = "entitySelection";
    LifecycleEvent["NodeSelection"] = "nodeSelection";
    LifecycleEvent["EdgeSelection"] = "edgeSelection";
    LifecycleEvent["LanguageChange"] = "languageChange";
    LifecycleEvent["EntityNameTypeChange"] = "entityNameTypeChange";
    LifecycleEvent["Filter"] = "filter";
    LifecycleEvent["Unfilter"] = "unfilter";
    LifecycleEvent["FilterRequest"] = "filterRequest";
    LifecycleEvent["UnfilterRequest"] = "unfilterRequest";
    LifecycleEvent["BackgroundClick"] = "backgroundClick";
    LifecycleEvent["EntityWikiLinkClick"] = "entityWikiLinkClick";
})(LifecycleEvent || (LifecycleEvent = {}));
class Lifecycle {
    constructor() {
        this.diagramChange = [];
        this.rendererChange = [];
        this.themeChange = [];
        this.entitySelection = [];
        this.nodeSelection = [];
        this.edgeSelection = [];
        this.languageChange = [];
        this.entityNameTypeChange = [];
        this.filter = [];
        this.unfilter = [];
        this.filterRequest = () => true;
        this.unfilterRequest = () => true;
        this.backgroundClick = [];
        this.entityWikiLinkClick = [];
        this.on = (event, callback) => {
            if (event === LifecycleEvent.FilterRequest || event === LifecycleEvent.UnfilterRequest) {
                this[event] = callback;
                return;
            }
            this[event].push(callback);
        };
    }
    trigger(event, ...params) {
        if (event === LifecycleEvent.FilterRequest || event === LifecycleEvent.UnfilterRequest) {
            return this[event](params[0]);
        }
        this[event].forEach((callback) => callback(...params));
    }
}

class Breakpoint {
    constructor(x, y) {
        this.intersectionPoint = { x: 0, y: 0 };
        this.breakpointRelativeToSource = { x: 0, y: 0 };
        this.x = x || 0;
        this.y = y || 0;
    }
    /**
     * Date le posizioni di source, target e del breakpoint,
     * la funzione calcola i due parametri peso e distanza del breakpoint
     * @param source posizione del nodo source
     * @param target posizione del nodo target
     */
    setSourceTarget(source, target) {
        // Coordinate del breakpoint traslando l'origine sul source:
        this.breakpointRelativeToSource.x = this.x - source.x;
        this.breakpointRelativeToSource.y = this.y - source.y;
        this.deltaX = target.x - source.x;
        this.deltaY = target.y - source.y;
        // Se deltaX è nullo : source e target sono sulla stessa ascissa
        // la retta che li congiunge è verticale e pertanto non esprimibile come y = mx + q
        // Sappiamo però automaticamente che la retta perpendicolare è del tipo y = c
        // quindi l'intersect point avrà X = 0 e Y = breakpoint['y']
        if (this.deltaX == 0) {
            this.intersectionPoint = { x: 0, y: this.breakpointRelativeToSource.y };
        }
        else if (this.deltaY == 0) {
            this.intersectionPoint = { x: this.breakpointRelativeToSource.x, y: 0 };
            this.angularCoefficient = 0;
        }
        else {
            this.angularCoefficient = this.deltaY / this.deltaX;
            // quindi prendendo il source come origine, la retta che unisce source e target è data da:
            // R: y = angularCoefficient * x
            // La retta che interseca perpendicolarmente R e che passa per point è data da :
            // T: y = - x / angularCoefficient + quote
            // dobbiamo calcolare quote imponendo che point faccia parte della retta T, quindi calcoliamo:
            // quote = breakpoint_y + (breakpoint_x/angularCoefficient)
            const quote = this.breakpointRelativeToSource.y + (this.breakpointRelativeToSource.x / this.angularCoefficient);
            // Adesso mettiamo a sistema le due rette T ed R (che sono perpendicolari) e risolvendo il sistema
            // otteniamo che il punto di intersezione tra le due ha le coordinate:
            // intersectpoint_x = (quote * angularCoefficient) / ((angularCoefficient ^ 2) + 1)
            // intersectpoint_y = intersectpoint_x * angularCoefficient
            this.intersectionPoint.x = (quote * this.angularCoefficient) / (Math.pow(this.angularCoefficient, 2) + 1);
            this.intersectionPoint.y = this.intersectionPoint.x * this.angularCoefficient;
        }
        // Distanza tra source e target
        this.distanceSourceTarget = getDisance(source, target);
        /**
         * Distanza tra intersection point e source
         * Le coordinate di intersect point sono espresse traslando l'origine su source, che quindi diventa l'origine (0,0)
         */
        this.distanceIntersectionSource = getDisance(this.intersectionPoint, { x: 0, y: 0 });
        this.setDistance();
        this.setWeight();
    }
    setWeight() {
        let point_weight = this.distanceIntersectionSource / this.distanceSourceTarget;
        // Dobbiamo stabilire se il peso è positivo o negativo
        // Se la X dell' intersectpoint è compresta tra quella del source e quella del target, allora il peso è positivo
        // se la X del target è maggiore della X del source e la X dell'intersectpoint è minore di quella del source, allora il peso è negativo
        if (this.deltaX > 0 && this.intersectionPoint.x < 0) {
            point_weight = -point_weight;
        }
        if (this.deltaX < 0 && this.intersectionPoint.x > 0) {
            point_weight = -point_weight;
        }
        this.weight = point_weight;
    }
    setDistance() {
        // Calcolo la distanza tra breakpoint e intersectpoint (sono entrambi espressi rispetto a source, ma per la distanza non ci interessa)
        let distanceBreakpointIntersectionPoint = getDisance(this.breakpointRelativeToSource, this.intersectionPoint);
        //var point_distance = Math.sqrt(Math.pow(intersectpoint['x'] - breakpoint['x'], 2) + Math.pow(intersectpoint['y'] - breakpoint['y'], 2))
        // Dobbiamo stabilire se prendere la point_distance positiva o negativa
        // La regola è che, andando dal source al target sulla retta che li
        // congiunge, se il breakpoint si trova alla mia sinistra, la distanza
        // è negativa, se invece è alla mia destra è positiva
        // questo si traduce nel valutare una diseguaglianza (Y ><= M*X ? dove Y e X sono le coordinate del breakpoint) e la scelta dipende dal quadrante in cui si trova il target.
        // [Stiamo considerando le coordinate relative al source]
        // [Quindi delta['x'] e delta['y'] sono proprio le coordinate del target]
        // RICORDA: in cytoscape il verso crescente dell'asse Y è verso il
        // basso, quindi occorre fare attenzione al verso delle diseguaglianze
        // Target con X negativa => il breakpoint si trova a sinitra della
        // retta quando si trova al di sotto della retta
        if (this.deltaX < 0 && this.breakpointRelativeToSource.y > this.angularCoefficient * this.breakpointRelativeToSource.x) {
            distanceBreakpointIntersectionPoint = -distanceBreakpointIntersectionPoint;
        }
        // Target con X positiva => il breakpoint si trova a sinistra dela
        // retta quando si trova al di sopra della retta
        if (this.deltaX > 0 && this.breakpointRelativeToSource.y < this.angularCoefficient * this.breakpointRelativeToSource.x) {
            distanceBreakpointIntersectionPoint = -distanceBreakpointIntersectionPoint;
        }
        // SOURCE CON STESSA X DEL TARGET
        // se il target ha una Y maggiore del source (deltaY>0),
        // allora sto guardando verso il basso, quindi il punto sarà a
        // sinistra quando la sua X sarà positiva
        if (this.deltaX == 0 && this.deltaY > 0 && this.breakpointRelativeToSource.x > 0) {
            distanceBreakpointIntersectionPoint = -distanceBreakpointIntersectionPoint;
        }
        // Se invece guardo verso l'alto (target con Y<0), allora il nodo è a
        // sinistra della retta quando ha la X negativa
        if (this.deltaX == 0 && this.deltaY < 0 && this.breakpointRelativeToSource.x < 0) {
            distanceBreakpointIntersectionPoint = -distanceBreakpointIntersectionPoint;
        }
        this.distance = distanceBreakpointIntersectionPoint;
    }
}
function getDisance(point1, point2) {
    const deltaX = point1.x - point2.x;
    const deltaY = point1.y - point2.y;
    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
}

class Hierarchy {
    constructor(type) {
        this.type = type;
        this._inputs = [];
        this._superclasses = [];
    }
    addInput(classIri) {
        this.inputs.push(classIri);
    }
    addSuperclass(classIri, complete = false) {
        this._superclasses.push({ classIri: classIri, complete: complete });
    }
    get inputs() { return this._inputs; }
    get superclasses() { return this._superclasses; }
    set id(newId) { this._id = newId; }
    get id() { return this._id; }
    getUnionGrapholNode(position) {
        if (!this.isValid()) {
            console.warn('[Grapholscape] Hierarchy not valid, cannot create the union graphol node - check id, inputs and superclasses');
            return;
        }
        const unionNode = new GrapholNode(this._id, GrapholTypesEnum.CLASS);
        unionNode.type = this.type;
        unionNode.identity = GrapholTypesEnum.CLASS;
        unionNode.shape = Shape.ELLIPSE;
        unionNode.displayedName = !this.isDisjoint() ? 'or' : undefined;
        unionNode.height = unionNode.width = 30;
        unionNode.position = position;
        unionNode.setLabelXposFromXML(position.x);
        unionNode.setLabelYposFromXML(position.y);
        return unionNode;
    }
    getInputGrapholEdges() {
        if (!this.isValid()) {
            console.warn('[Grapholscape] Hierarchy not valid, cannot create input edges - check id, inputs and superclasses');
            return;
        }
        const res = [];
        this.inputs.forEach((inputClassIri, i) => {
            const newInputEdge = new GrapholEdge(`${this._id}-e-${i}`, GrapholTypesEnum.INPUT);
            newInputEdge.sourceId = inputClassIri;
            newInputEdge.targetId = this._id;
            res.push(newInputEdge);
        });
        return res;
    }
    getInclusionEdges() {
        if (!this.isValid()) {
            console.warn('[Grapholscape] Hierarchy not valid, cannot create inclusions edges - check id, inputs and superclasses');
            return;
        }
        const res = [];
        this._superclasses.forEach((superclass, i) => {
            const newInclusionEdge = new GrapholEdge(`${this._id}-inclusion-${i}`, this.type);
            newInclusionEdge.sourceId = this._id;
            newInclusionEdge.targetId = superclass.classIri;
            if (superclass.complete) {
                newInclusionEdge.targetLabel = 'C';
            }
            res.push(newInclusionEdge);
        });
        return res;
    }
    isDisjoint() {
        return this.type === GrapholTypesEnum.DISJOINT_UNION;
    }
    isValid() {
        return this._id && this.inputs.length > 0 && this._superclasses.length > 0;
    }
}

class FakeGrapholNode extends GrapholNode {
    constructor(originalNode) {
        super(originalNode.id, originalNode.type);
        Object.assign(this, originalNode);
        this.shape = Shape.POLYGON;
        this._fakeNodes = [];
    }
    getCytoscapeRepr(grapholEntity) {
        const result = super.getCytoscapeRepr(grapholEntity);
        result[0].selectable = false;
        result[0].classes += ' no_overlay';
        result[0].data.fake = true;
        delete result[0].data.id;
        delete result[0].data.displayedName;
        return result;
    }
}

class FakeCircle extends FakeGrapholNode {
    constructor(originalNode) {
        super(originalNode);
        this.shape = Shape.ELLIPSE;
        this.width = this.height;
    }
}
class FakeCircleRight extends FakeCircle {
    constructor(originalNode) {
        super(originalNode);
        this.x = originalNode.x + (originalNode.width / 2) - (this.width / 2);
    }
}
class FakeCircleLeft extends FakeCircle {
    constructor(originalNode) {
        super(originalNode);
        this.x = originalNode.x - (originalNode.width / 2) + (this.width / 2);
    }
}

class FakeRectangle extends FakeGrapholNode {
    constructor(originalNode) {
        super(originalNode);
        this.shape = Shape.RECTANGLE;
        this.width = this.width - this.height;
    }
}
class FakeRectangleFront extends FakeRectangle {
    constructor(originalNode) {
        super(originalNode);
        this.height -= 1;
    }
    getCytoscapeRepr(grapholEntity) {
        const result = super.getCytoscapeRepr(grapholEntity);
        result[0].classes += ' no_border';
        return result;
    }
}

class FakeTopRhomboid extends FakeGrapholNode {
    constructor(originalNode) {
        super(originalNode);
        this.shapePoints = '-0.9 -1 1 -1 0.95 0 -0.95 0';
        this.fillColor = '#dedede';
    }
    getCytoscapeRepr(grapholEntity) {
        const result = super.getCytoscapeRepr(grapholEntity);
        result[0].classes += ' fake-top-rhomboid';
        return result;
    }
}
class FakeBottomRhomboid extends FakeGrapholNode {
    constructor(originalNode) {
        super(originalNode);
        this.shapePoints = '-0.95 0 0.95 0 0.9 1 -1 1';
    }
    getCytoscapeRepr(grapholEntity) {
        const result = super.getCytoscapeRepr(grapholEntity);
        result[0].classes += ' fake-bottom-rhomboid';
        return result;
    }
}

class FakeTriangleLeft extends FakeGrapholNode {
    constructor(originalNode) {
        super(originalNode);
        this.width = this.width + 2;
        this.fillColor = '#fcfcfc';
        this.shapePoints = '0 -1 -1 0 0 1';
    }
    getCytoscapeRepr(grapholEntity) {
        const result = super.getCytoscapeRepr(grapholEntity);
        result[0].classes = ' fake-triangle';
        return result;
    }
}
class FakeTriangleRight extends FakeGrapholNode {
    constructor(originalNode) {
        super(originalNode);
        this.width = this.width + 2;
        this.fillColor = '#000';
        this.shapePoints = '0 -1 1 0 0 1';
    }
    getCytoscapeRepr(grapholEntity) {
        const result = super.getCytoscapeRepr(grapholEntity);
        result[0].classes += ' fake-triangle fake-triangle-right';
        return result;
    }
}

let warnings$1 = new Set();
function getOntologyInfo$1(xmlDocument) {
    var _a, _b;
    let xml_ontology_tag = xmlDocument.getElementsByTagName('ontology')[0];
    let ontology_name = ((_a = xml_ontology_tag.getElementsByTagName('name')[0]) === null || _a === void 0 ? void 0 : _a.textContent) || 'Undefined';
    let ontology_version = '';
    ontology_version = ((_b = xml_ontology_tag.getElementsByTagName('version')[0]) === null || _b === void 0 ? void 0 : _b.textContent) || 'Undefined';
    return new Ontology(ontology_name, ontology_version);
}
function getNamespaces$1(xmlDocument) {
    let result = [];
    if (xmlDocument.getElementsByTagName('IRI_prefixes_nodes_dict').length === 0) {
        // for old graphol files
        result.push(new Namespace([''], xmlDocument.getElementsByTagName('iri')[0].textContent || '', false));
    }
    else {
        let iri_prefixes;
        let iri_value, is_standard, prefixes, properties;
        let iris = xmlDocument.getElementsByTagName('iri');
        // Foreach iri create a Iri object
        for (let iri of iris) {
            iri_value = iri.getAttribute('iri_value');
            if (!iri_value)
                continue;
            is_standard = false;
            prefixes = iri.getElementsByTagName('prefix');
            iri_prefixes = [];
            for (let prefix of prefixes) {
                const prefixValue = prefix.getAttribute('prefix_value');
                if (prefixValue)
                    iri_prefixes.push(prefixValue);
            }
            if (iri_prefixes.length == 0)
                iri_prefixes.push('');
            // check if it's a standard iri
            properties = iri.getElementsByTagName('property');
            for (let property of properties) {
                is_standard = property.getAttribute('property_value') == 'Standard_IRI';
            }
            result.push(new Namespace(iri_prefixes, iri_value, is_standard));
        }
    }
    return result;
}
function getIri$1(element, ontology) {
    var _a;
    let labelElement = element.getElementsByTagName('label')[0];
    if (!labelElement)
        return undefined;
    let label = (_a = labelElement.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '');
    if (!label)
        return;
    let splitted_label = label.split(':');
    // if no ':' in label, then use empty prefix
    let node_prefix_iri = splitted_label.length > 1 ? splitted_label[0] : '';
    // facets
    if (node_prefix_iri.search(/"[\w]+"\^\^[\w]+:/) != -1) {
        node_prefix_iri = node_prefix_iri.slice(node_prefix_iri.lastIndexOf('^') + 1, node_prefix_iri.lastIndexOf(':') + 1);
    }
    else {
        //rem_chars = splitted_label.length > 1 ? label.slice(label.indexOf(':')+1) : label
        //namespace = ontology.getNamespaceFromPrefix(node_prefix_iri)
        // if (!namespace && ParserUtil.isPredicate(element)) {
        //   this.warnings.add(`The prefix "${node_prefix_iri}" is not associated to any namespace`)
        // }
        return new Iri(label, ontology.namespaces);
    }
    // iri_infos.remainingChars = rem_chars
    // iri_infos.prefix = node_prefix_iri
    // iri_infos.fullIri = namespace + rem_chars
    // iri_infos.namespace = namespace
    // iri_infos.prefixed = node_prefix_iri + ':' + rem_chars
    // return iri_infos
}
function getFacetDisplayedName$1(element) {
    if (element.getElementsByTagName('label')[0])
        // language undefined for v2 = ''
        return element.getElementsByTagName('label')[0].textContent || undefined;
}
function getFunctionalities$1(element, xmlDocument) {
    var _a;
    let result = [];
    const labelNoBreak = (_a = element.getElementsByTagName('label')[0].textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '');
    // for searching predicates' functionalities in graphol v2
    const xmlPredicates = xmlDocument.getElementsByTagName('predicate');
    const type = element.getAttribute('type');
    for (let predicateXml of xmlPredicates) {
        if (labelNoBreak === predicateXml.getAttribute('name') && type === predicateXml.getAttribute('type')) {
            Object.values(FunctionalityEnum).forEach(functionalityKind => {
                var _a;
                const value = parseInt(((_a = predicateXml.getElementsByTagName(functionalityKind)[0]) === null || _a === void 0 ? void 0 : _a.textContent) || '0');
                if (value !== 0)
                    result.push(functionalityKind);
            });
            break;
        }
    }
    return result;
}
function getEntityAnnotations$1(element, xmlDocument) {
    var _a, _b;
    let result = [];
    const label = element.getElementsByTagName('label')[0].textContent;
    if (label) {
        const labelNoBreak = label.replace(/\n/g, '');
        // push label annotation
        result.push(new Annotation(AnnotationsKind.label, label));
        // for searching predicates' description in graphol v2
        const xmlPredicates = xmlDocument.getElementsByTagName('predicate');
        for (let predicateXml of xmlPredicates) {
            if (labelNoBreak === predicateXml.getAttribute('name') && element.getAttribute('type') === predicateXml.getAttribute('type')) {
                let description = (_b = (_a = predicateXml.getElementsByTagName('description')[0]) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.replace(/font-size:0pt/g, '');
                if (description) {
                    let bodyStartIndex = description.indexOf('<p');
                    let bodyEndIndex = description.indexOf('</body');
                    description = description.slice(bodyStartIndex, bodyEndIndex);
                    result.push(new Annotation(AnnotationsKind.comment, description));
                }
                break;
            }
        }
    }
    return result;
}

var Graphol2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    warnings: warnings$1,
    getOntologyInfo: getOntologyInfo$1,
    getNamespaces: getNamespaces$1,
    getIri: getIri$1,
    getFacetDisplayedName: getFacetDisplayedName$1,
    getFunctionalities: getFunctionalities$1,
    getEntityAnnotations: getEntityAnnotations$1
});

/** @typedef {import('../model').default} Ontology */
let warnings = new Set();
function getOntologyInfo(xmlDocument) {
    var _a, _b, _c;
    let project = getTag(xmlDocument, 'project');
    let ontology_languages = (_a = getTag(xmlDocument, 'languages')) === null || _a === void 0 ? void 0 : _a.children;
    let iri = (_b = getTag(xmlDocument, 'ontology')) === null || _b === void 0 ? void 0 : _b.getAttribute('iri');
    const ontology = new Ontology((project === null || project === void 0 ? void 0 : project.getAttribute('name')) || '', (project === null || project === void 0 ? void 0 : project.getAttribute('version')) || '');
    if (ontology_languages)
        ontology.languages.list = [...ontology_languages].map(lang => lang.textContent) || [];
    ontology.languages.default = ((_c = getTag(xmlDocument, 'ontology')) === null || _c === void 0 ? void 0 : _c.getAttribute('lang')) || ontology.languages.list[0];
    if (iri) {
        ontology.iri = iri;
        ontology.annotations = getIriAnnotations(iri, xmlDocument);
    }
    return ontology;
}
/**
 *
 * @param {Element} xmlDocument
 * @returns
 */
function getNamespaces(xmlDocument) {
    var _a;
    let result = [];
    let prefixes = (_a = getTag(xmlDocument, 'prefixes')) === null || _a === void 0 ? void 0 : _a.children;
    if (prefixes) {
        for (const p of prefixes) {
            const namespaceValue = getTagText(p, 'namespace');
            const prefixValue = getTagText(p, 'value');
            const namespace = result.find(n => n.toString() === namespaceValue);
            if (typeof (prefixValue) === 'string' && namespaceValue) {
                if (namespace) {
                    namespace.addPrefix(prefixValue);
                }
                else {
                    result.push(new Namespace([prefixValue], namespaceValue, false));
                }
            }
        }
    }
    return result;
}
function getIri(element, ontology) {
    let nodeIri = getTagText(element, 'iri');
    if (!nodeIri)
        return;
    return new Iri(nodeIri, ontology.namespaces);
}
/**
 *
 * @param {Element} element
 * @param {Ontology} ontology
 * @returns {string}
 */
function getFacetDisplayedName(element, ontology) {
    // Facets' label must be in the form: [constraining-facet-iri^^"value"] to be compliant to Graphol-V2
    if (element.getAttribute('type') === GrapholTypesEnum.FACET) {
        const constrainingFacet = getTagText(element, 'constrainingFacet');
        if (constrainingFacet) {
            const facetIri = new Iri(constrainingFacet, ontology.namespaces);
            //let constraining_facet = ontology.destructureIri(getTagText(element, 'constrainingFacet'))
            //constraining_facet = constraining_facet.prefix + ':' + constraining_facet.remainingChars
            const lexicalForm = getTagText(element, 'lexicalForm');
            const datatype = getTagText(element, 'datatype');
            if (datatype) {
                const datatypeIri = new Iri(datatype, ontology.namespaces);
                return `${facetIri.prefixed}\n\n"${lexicalForm}"^^${datatypeIri.prefixed}`;
            }
            // unused to be compliant to Graphol-V2
            //let datatype = ontology.destructureIri(getTagText(element, 'datatype'))
            //datatype = datatype.prefix + ':' + datatype.rem_chars
        }
    }
}
/**
 * Returns an object with annotations, description and the properties (functional, etc..) for DataProperties
 * @param {Element} element
 * @param {Element} xmlDocument
 * @returns {FunctionalityEnum[]}
 */
function getFunctionalities(element, xmlDocument) {
    let result = [];
    let actual_iri_elem = getIriElem(element, xmlDocument);
    let elementType;
    switch (element.getAttribute('type')) {
        case 'concept':
            elementType = GrapholTypesEnum.CLASS;
            break;
        case 'role':
            elementType = GrapholTypesEnum.OBJECT_PROPERTY;
            break;
        case 'attribute':
            elementType = GrapholTypesEnum.DATA_PROPERTY;
            break;
    }
    if (elementType === GrapholTypesEnum.OBJECT_PROPERTY || elementType === GrapholTypesEnum.DATA_PROPERTY) {
        if (actual_iri_elem && actual_iri_elem.children) {
            for (let property of actual_iri_elem.children) {
                const functionality = Object.values(FunctionalityEnum).find(f => f.toString() === property.tagName);
                if (functionality) {
                    result.push(functionality);
                }
            }
        }
    }
    return result;
}
function getEntityAnnotations(element, xmlDocument) {
    const entityIri = getTagText(element, 'iri');
    if (entityIri)
        return getIriAnnotations(entityIri, xmlDocument);
    else
        return [];
}
function getIriAnnotations(iri, xmlDocument) {
    let result = [];
    const iriElem = getIriElem(iri, xmlDocument);
    if (iriElem) {
        let annotations = getTag(iriElem, 'annotations');
        let language;
        let annotation_kind;
        let lexicalForm;
        if (annotations) {
            for (let annotation of annotations.children) {
                annotation_kind = getRemainingChars(getTagText(annotation, 'property'));
                language = getTagText(annotation, 'language');
                lexicalForm = getTagText(annotation, 'lexicalForm');
                if (lexicalForm && language)
                    result.push(new Annotation(annotation_kind, lexicalForm, language));
            }
        }
    }
    return result;
}
/**
 * Retrieve the xml tag element in a xml root element
 */
function getTag(root, tagName, n = 0) {
    if (root && root.getElementsByTagName(tagName[n]))
        return root.getElementsByTagName(tagName)[n];
}
/**
 * Retrieve the text inside a given tag in a xml root element
 */
function getTagText(root, tagName, n = 0) {
    if (root && root.getElementsByTagName(tagName)[n])
        return root.getElementsByTagName(tagName)[n].textContent;
}
function getIriElem(node, xmlDocument) {
    var _a;
    let node_iri;
    if (typeof (node) === 'string')
        node_iri = node;
    else
        node_iri = getTagText(node, 'iri');
    if (!node_iri)
        return null;
    let iris = (_a = getTag(xmlDocument, 'iris')) === null || _a === void 0 ? void 0 : _a.children;
    if (iris) {
        for (let iri of iris) {
            if (node_iri == getTagText(iri, 'value')) {
                return iri;
            }
        }
    }
    return null;
}
/**
 * Get the substring after separator '#' or '/' from a full IRI
 * @param {string} iri
 * @returns {string}
 */
function getRemainingChars(iri) {
    let rem_chars = iri.slice(iri.lastIndexOf('#') + 1);
    // if rem_chars has no '#' then use '/' as separator
    if (rem_chars.length == iri.length) {
        rem_chars = iri.slice(iri.lastIndexOf('/') + 1);
    }
    return rem_chars;
}

var Graphol3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    warnings: warnings,
    getOntologyInfo: getOntologyInfo,
    getNamespaces: getNamespaces,
    getIri: getIri,
    getFacetDisplayedName: getFacetDisplayedName,
    getFunctionalities: getFunctionalities,
    getEntityAnnotations: getEntityAnnotations,
    getTag: getTag,
    getTagText: getTagText
});

// Funzioni che ritornano il primo figlio o il fratello successivo di un dato nodo
// Ignorano quindi tutti gli elementi di tipo diverso da 1
// cioè gli attributi, gli spazi vuoti ecc...
function getFirstChild(node) {
    if (node == null || node.firstChild == null) {
        return null;
    }
    node = node.firstChild;
    if (node.nodeType !== 1) {
        node = getNextSibling(node);
    }
    return node;
}
function getNextSibling(node) {
    if (node == null || node.nextSibling == null) {
        return null;
    }
    node = node.nextSibling;
    while (node.nodeType !== 1) {
        if (node.nextSibling == null) {
            return null;
        }
        node = node.nextSibling;
    }
    return node;
}
/**
 * Funzione che decide se spostare un endpoint sul bordo del nodo (source o target) o meno
 * Facciamo quest'operazione per tutti gli archi che presentano degli endpoint
 * non al centro del nodo (source o target), in questi casi le
 * opzioni sono 2:
 * 1: l'arco parte (o arriva) in diagonale, in questo caso l'endpoint lo lasciamo al centro del nodo
 * 2: l'arco arriva perpendicolarmente al bordo del nodo (source o target), in questo caso
 *    vediamo se il breakpoint successivo (o precedente nel caso del target), ha la stessa X o la stessa Y
 *    del nodo in questione.
 *    Valutando poi la coordinata che non risulta uguale a quella del nodo, spostiamo l'endpoint sul bordo del
 *    nodo in direzione del breakpoint successivo (o precedente).
 *
 * Se lasciassimo intatti gli endpoint non centrati, cytoscape farebbe entrare la freccia nel nodo,
 * Traslando sul bordo l'endpoint in direzione del breakpoint successivo (nel caso di source) o precedente
 * (nel caso di target), cytoscape farà corrispondere la punta della freccia sul bordo del nodo e
 * sarà quindi visibile.
 * @param endpoint l'endpoint da spostare
 * @param node il nodo a cui si riferisce l'endpoint
 * @param breakpoint il breakpoint successivo (o precedente)
 */
function getNewEndpoint(endpoint, node, breakpoint) {
    // Calcoliamo le coordinate relative al nodo source (o target)
    const endpointRelativeToNode = { x: 0, y: 0 };
    endpointRelativeToNode.x = endpoint.x - node.x;
    endpointRelativeToNode.y = endpoint.y - node.y;
    if (endpointRelativeToNode.x == 0 && endpointRelativeToNode.y == 0)
        // endpoint centrato sul nodo, non c'è bisogno di spostarlo
        return endpointRelativeToNode;
    const breakpointRelativeToNode = { x: 0, y: 0 };
    breakpointRelativeToNode.x = breakpoint.x - node.x;
    breakpointRelativeToNode.y = breakpoint.y - node.y;
    // Se l'endpoint non è centrato nel nodo ma ha la X uguale al breakpoint successivo (o precedente)
    // Allora l'arco parte (o arriva) perpendicolarmente dall'alto o dal basso
    if (endpointRelativeToNode.x == breakpointRelativeToNode.x) {
        // Se il breakpoint si trova più in basso (Ricorda: asse Y al contrario in cytoscape!),
        // allora spostiamo sul bordo inferiore l'endpoint
        if (breakpointRelativeToNode.y > 0) {
            endpointRelativeToNode.y = node.height / 2;
            return endpointRelativeToNode;
        }
        // Se invece il breakpoint è più in alto del nodo, allora spostiamo l'endpoint sul bordo superiore
        else if (breakpointRelativeToNode.y < 0) {
            endpointRelativeToNode.y = -node.height / 2;
            return endpointRelativeToNode;
        }
    }
    // Se invece ad essere uguale è la Y, l'arco arriva da destra o da sinistra, facciamo gli stessi passaggi appena fatti
    else if (endpointRelativeToNode.y == breakpointRelativeToNode.y) {
        if (breakpointRelativeToNode.x > 0) {
            endpointRelativeToNode.x = node.width / 2;
            return endpointRelativeToNode;
        }
        else if (breakpointRelativeToNode.x < 0) {
            endpointRelativeToNode.x = -node.width / 2;
            return endpointRelativeToNode;
        }
    }
    return endpointRelativeToNode;
}
function getPointOnEdge(point1, point2) {
    const m = (point1.y - point2.y) / (point1.x - point2.x);
    const result = new Breakpoint();
    const middleX = (point1.x - point2.x) / 2;
    const middleY = (point1.y - point2.y) / 2;
    if (point1.x !== point2.x && point1.y !== point2.y) {
        result.x = point1.x - middleX;
        // y = mx + q  [ q = y1 - mx1 ] => y = mx + y1 - mx1
        result.y = m * result.x + point1.y - m * point1.x;
    }
    // horizontal line
    else if (point1.y === point2.y) {
        result.x = point1.x - middleX;
        result.y = point1.y;
    }
    // vertical line
    else if (point1.x === point2.x) {
        result.x = point1.x;
        result.y = point1.y - middleY;
    }
    return result;
}

class GrapholParser {
    constructor(xmlString) {
        this.xmlDocument = (xmlString instanceof XMLDocument) ? xmlString : new DOMParser().parseFromString(xmlString, 'text/xml');
        this.graphol_ver = this.xmlDocument.getElementsByTagName('graphol')[0].getAttribute('version') || -1;
        if (this.graphol_ver == 2 || this.graphol_ver == -1)
            this.graphol = Graphol2;
        else if (this.graphol_ver == 3)
            this.graphol = Graphol3;
        else
            throw new Error(`Graphol version [${this.graphol_ver}] not supported`);
    }
    parseGraphol() {
        var _a;
        this.ontology = this.graphol.getOntologyInfo(this.xmlDocument);
        this.ontology.namespaces = this.graphol.getNamespaces(this.xmlDocument);
        let i, k, nodes, edges;
        let diagrams = this.xmlDocument.getElementsByTagName('diagram');
        for (i = 0; i < diagrams.length; i++) {
            const diagram = new Diagram(diagrams[i].getAttribute('name') || '', i);
            this.ontology.addDiagram(diagram);
            nodes = diagrams[i].getElementsByTagName('node');
            edges = diagrams[i].getElementsByTagName('edge');
            // Create JSON for each node to be added to the collection
            for (k = 0; k < nodes.length; k++) {
                const nodeXmlElement = nodes[k];
                const grapholNodeType = (_a = this.getGrapholNodeInfo(nodeXmlElement)) === null || _a === void 0 ? void 0 : _a.TYPE;
                const node = this.getBasicGrapholNodeFromXML(nodeXmlElement, i);
                if (!node)
                    continue;
                let grapholEntity;
                if (node.isEntity() && grapholNodeType) {
                    const iri = this.graphol.getIri(nodeXmlElement, this.ontology);
                    if (iri) {
                        grapholEntity = this.ontology.entities.get(iri.fullIri);
                        if (!grapholEntity) {
                            grapholEntity = new GrapholEntity(iri, grapholNodeType);
                            this.ontology.addEntity(grapholEntity);
                        }
                        grapholEntity.addOccurrence(node.id, diagram.id);
                        grapholEntity.functionalities = this.graphol.getFunctionalities(nodeXmlElement, this.xmlDocument);
                        grapholEntity.annotations = this.graphol.getEntityAnnotations(nodeXmlElement, this.xmlDocument);
                        // APPLY DISPLAYED NAME FROM LABELS
                        node.displayedName = grapholEntity.getDisplayedName(EntityNameType.LABEL, undefined, this.ontology.languages.default);
                        // Add fake nodes
                        if (node.is(GrapholTypesEnum.OBJECT_PROPERTY) &&
                            grapholEntity.hasFunctionality(FunctionalityEnum.functional) &&
                            grapholEntity.hasFunctionality(FunctionalityEnum.inverseFunctional)) {
                            node.addFakeNode(new FakeTriangleRight(node));
                            node.addFakeNode(new FakeTriangleLeft(node));
                            node.height -= 8;
                            node.width -= 10;
                        }
                    }
                }
                else {
                    // not an entity, take label from <label> tag or use those for constructor nodes          
                    switch (node === null || node === void 0 ? void 0 : node.type) {
                        case GrapholTypesEnum.FACET:
                            node.displayedName = this.graphol.getFacetDisplayedName(nodeXmlElement, this.ontology) || '';
                            break;
                        case GrapholTypesEnum.VALUE_DOMAIN:
                            const iri = this.graphol.getIri(nodeXmlElement, this.ontology);
                            node.displayedName = (iri === null || iri === void 0 ? void 0 : iri.prefixed) || '';
                            break;
                        default:
                            const labelKey = Object.keys(GrapholTypesEnum).find(k => GrapholTypesEnum[k] === node.type);
                            if (labelKey) {
                                const constructorLabel = ConstructorLabelsEnum[labelKey];
                                if (constructorLabel) {
                                    node.displayedName = constructorLabel;
                                }
                            }
                            break;
                    }
                    // for domain/range restrictions, cardinalities
                    if (node.type === GrapholTypesEnum.DOMAIN_RESTRICTION || node.type === GrapholTypesEnum.RANGE_RESTRICTION) {
                        node.displayedName = getTagText(nodes[k], 'label') || '';
                    }
                }
                diagram.addElement(node, grapholEntity);
            }
            for (k = 0; k < edges.length; k++) {
                const edgeXmlElement = edges[k];
                const grapholEdge = this.getGrapholEdgeFromXML(edgeXmlElement, diagram.id);
                if (grapholEdge)
                    diagram.addElement(grapholEdge);
            }
        }
        if (i == 0) {
            throw new Error("The selected .graphol file has no defined diagram");
        }
        this.getIdentityForNeutralNodes();
        this.ontology.computeDatatypesOnDataProperties();
        return this.ontology;
    }
    getBasicGrapholNodeFromXML(element, diagramId) {
        var _a, _b;
        const nodeInfoBasedOnType = this.getGrapholNodeInfo(element);
        if (!nodeInfoBasedOnType) {
            console.warn(`[GRAPHOL_PARSER]: ${element.getAttribute('type')} is not a Graphol node type`);
            return;
        }
        let grapholNode = new GrapholNode(element.getAttribute('id') || '', nodeInfoBasedOnType.TYPE);
        grapholNode.shape = nodeInfoBasedOnType.SHAPE;
        grapholNode.identity = nodeInfoBasedOnType.IDENTITY;
        grapholNode.fillColor = element.getAttribute('color') || '';
        // Parsing the <geometry> child node of node
        var geometry = element.getElementsByTagName('geometry')[0];
        grapholNode.width = parseInt(geometry.getAttribute('width') || '');
        grapholNode.height = parseInt(geometry.getAttribute('height') || '');
        grapholNode.x = parseInt(geometry.getAttribute('x') || '');
        grapholNode.y = parseInt(geometry.getAttribute('y') || '');
        if (grapholNode.is(GrapholTypesEnum.ROLE_CHAIN) || grapholNode.is(GrapholTypesEnum.PROPERTY_ASSERTION)) {
            if (element.getAttribute('inputs') !== '')
                grapholNode.inputs = (_a = element.getAttribute('inputs')) === null || _a === void 0 ? void 0 : _a.split(',');
        }
        let label = element.getElementsByTagName('label')[0];
        // apply label position and font size
        if (label != null) {
            grapholNode.labelHeight = parseInt(label.getAttribute('height') || '12');
            grapholNode.setLabelXposFromXML(parseInt(label.getAttribute('x') || '12'));
            grapholNode.setLabelYposFromXML(parseInt(label.getAttribute('y') || '12'));
            grapholNode.fontSize = parseInt(label.getAttribute('size') || '12');
        }
        if (grapholNode.is(GrapholTypesEnum.FACET)) {
            grapholNode.shapePoints = (_b = GrapholNodesEnum.FACET) === null || _b === void 0 ? void 0 : _b.SHAPE_POINTS;
            grapholNode.fillColor = '#ffffff';
            // Add fake nodes
            //grapholNode.displayedName = grapholNode.displayedName.replace('^^', '\n\n')
            grapholNode.labelYpos = 1;
            grapholNode.addFakeNode(new FakeTopRhomboid(grapholNode));
            grapholNode.addFakeNode(new FakeBottomRhomboid(grapholNode));
        }
        if (grapholNode.is(GrapholTypesEnum.PROPERTY_ASSERTION)) {
            // Add fake nodes
            grapholNode.height -= 1;
            grapholNode.addFakeNode(new FakeRectangle(grapholNode));
            const fakeCircle1 = new FakeCircleRight(grapholNode);
            // fakeCircle1.x = grapholNode.x - ((grapholNode.width - grapholNode.height) / 2)
            grapholNode.addFakeNode(fakeCircle1);
            const fakeCircle2 = new FakeCircleLeft(grapholNode);
            // fakeCircle2.x = grapholNode.x + ((grapholNode.width - grapholNode.height) / 2)
            grapholNode.addFakeNode(fakeCircle2);
            grapholNode.addFakeNode(new FakeRectangleFront(grapholNode));
        }
        // if (ParserUtil.isPredicate(element))
        //   nodo.classes += ' predicate'
        return grapholNode;
    }
    getGrapholEdgeFromXML(edgeXmlElement, diagramId) {
        const typeKey = Object.keys(GrapholTypesEnum).find(k => GrapholTypesEnum[k] === edgeXmlElement.getAttribute('type'));
        if (!typeKey)
            return;
        const grapholEdge = new GrapholEdge(edgeXmlElement.getAttribute('id') || '', GrapholTypesEnum[typeKey]);
        const sourceId = edgeXmlElement.getAttribute('source');
        if (sourceId)
            grapholEdge.sourceId = sourceId;
        const targetId = edgeXmlElement.getAttribute('target');
        if (targetId)
            grapholEdge.targetId = targetId;
        // Prendiamo i nodi source e target
        var sourceGrapholNode = this.ontology.getGrapholNode(grapholEdge.sourceId, diagramId);
        var targetGrapholNode = this.ontology.getGrapholNode(grapholEdge.targetId, diagramId);
        if (sourceGrapholNode && targetGrapholNode) {
            // Impostiamo le label numeriche per gli archi che entrano nei role-chain
            // I role-chain hanno un campo <input> con una lista di id di archi all'interno
            // che sono gli archi che entrano, l'ordine nella sequenza stabilisce la label
            // numerica che deve avere l'arco
            // Quindi se l'arco che stiamo aggiungendo ha come target un nodo role-chain,
            // Cerchiamo l'id dell'arco negli inputs del role-chain e se lo troviamo impostiamo
            // la target_label in base alla posizione nella sequenza
            if (targetGrapholNode.is(GrapholTypesEnum.ROLE_CHAIN) || targetGrapholNode.is(GrapholTypesEnum.PROPERTY_ASSERTION)) {
                if (targetGrapholNode === null || targetGrapholNode === void 0 ? void 0 : targetGrapholNode.inputs) {
                    for (let k = 0; k < targetGrapholNode.inputs.length; k++) {
                        if (targetGrapholNode.inputs[k] === grapholEdge.id) {
                            grapholEdge.targetLabel = (k + 1).toString();
                            break;
                        }
                    }
                }
            }
            // info = <POINT>
            // Processiamo i breakpoints dell'arco
            // NOTA: ogni arco ha sempre almeno 2 breakpoints, cioè gli endpoints
            let point = getFirstChild(edgeXmlElement);
            // let breakpoints = []
            // let segment_weights = []
            // let segment_distances = []
            let count = 0;
            for (let j = 0; j < edgeXmlElement.childNodes.length; j++) {
                // Ignoriamo spazi vuoti, e altri figli di tipo diverso da 1
                if (edgeXmlElement.childNodes[j].nodeType != 1) {
                    continue;
                }
                const breakpoint = new Breakpoint(parseInt(point.getAttribute('x')), parseInt(point.getAttribute('y')));
                //breakpoints[count].push(parseInt(point.getAttribute('x')))
                //breakpoints[count].push(parseInt(point.getAttribute('y')))
                if (getNextSibling(point) != null) {
                    point = getNextSibling(point);
                    // Se il breakpoint in questione non è il primo
                    // e non è l'ultimo, visto che ha un fratello,
                    // allora calcoliamo peso e distanza per questo breakpoint
                    // [Il primo e l'ultimo breakpoint sono gli endpoint e non hanno peso e distanza]
                    if (count > 0) {
                        breakpoint.setSourceTarget(sourceGrapholNode.position, targetGrapholNode.position);
                        // var aux = ParserUtil.getDistanceWeight(targetGrapholNode.position, sourceGrapholNode.position, breakpoints[count])
                        // segment_distances.push(aux[0])
                        // segment_weights.push(aux[1])
                    }
                    count++;
                }
                grapholEdge.addBreakPoint(breakpoint);
            }
            // Calcoliamo gli endpoints sul source e sul target
            // Se non sono centrati sul nodo vanno spostati sul bordo del nodo
            grapholEdge.sourceEndpoint = getNewEndpoint(grapholEdge.controlpoints[0], // first breakpoint is the one on source
            sourceGrapholNode, grapholEdge.controlpoints[1]);
            // Facciamo la stessa cosa per il target
            grapholEdge.targetEndpoint = getNewEndpoint(grapholEdge.controlpoints[grapholEdge.controlpoints.length - 1], // last endpoint is the one on target
            targetGrapholNode, grapholEdge.controlpoints[grapholEdge.controlpoints.length - 2]);
            // If we have no control-points and only one endpoint, we need an intermediate breakpoint
            // why? see: https://github.com/obdasystems/grapholscape/issues/47#issuecomment-987175639
            let breakpoint;
            if (grapholEdge.controlpoints.length === 2) { // 2 breakpoints means only endpoints
                if ((grapholEdge.sourceEndpoint && !grapholEdge.targetEndpoint)) {
                    /**
                     * we have custom endpoint only on source, get a middle breakpoint
                     * between the custom endpoint on source (breakpoints[0]) and target position
                     * (we don't have endpoint on target)
                     *
                     * NOTE: don't use source_endpoint because it contains relative coordinate
                     * with respect source node position. We need absolute coordinates which are
                     * the ones parsed from .graphol file
                     */
                    breakpoint = getPointOnEdge(grapholEdge.controlpoints[0], targetGrapholNode.position);
                }
                if (!grapholEdge.sourceEndpoint && grapholEdge.targetEndpoint) {
                    // same as above but with endpoint on target, which is the last breakpoints (1 since they are just 2)
                    breakpoint = getPointOnEdge(sourceGrapholNode.position, grapholEdge.controlpoints[1]);
                }
                if (breakpoint) {
                    // now if we have the breakpoint we need, let's get distance and weight for cytoscape
                    // just like any other breakpoint
                    breakpoint.setSourceTarget(sourceGrapholNode.position, targetGrapholNode.position);
                    // insert new breakpoint between the the other two we already have
                    grapholEdge.controlpoints.splice(1, 0, breakpoint);
                }
            }
        }
        return grapholEdge;
    }
    getIdentityForNeutralNodes() {
        this.ontology.diagrams.forEach(diagram => {
            var _a;
            const cy = (_a = diagram.representations.get(RendererStatesEnum.GRAPHOL)) === null || _a === void 0 ? void 0 : _a.cy;
            cy === null || cy === void 0 ? void 0 : cy.nodes('[identity = "neutral"]').forEach(node => {
                const newIdentity = findIdentity(node);
                node.data('identity', newIdentity);
                const grapholNode = this.ontology.getGrapholNode(node.id(), diagram.id);
                if (grapholNode)
                    grapholNode.identity = newIdentity;
            });
        });
        // Recursively traverse first input node and return his identity
        // if he is neutral => recursive step
        function findIdentity(node) {
            var _a;
            var first_input_node = node.incomers('[type = "input"]').sources();
            var identity = first_input_node.data('identity');
            if (identity === GrapholTypesEnum.NEUTRAL) {
                return findIdentity(first_input_node);
            }
            else {
                switch (node.data('type')) {
                    case GrapholTypesEnum.RANGE_RESTRICTION:
                        if (identity === GrapholTypesEnum.OBJECT_PROPERTY) {
                            return GrapholTypesEnum.CLASS;
                        }
                        else if (identity === GrapholTypesEnum.DATA_PROPERTY) {
                            return GrapholTypesEnum.VALUE_DOMAIN;
                        }
                        else {
                            return identity;
                        }
                    case GrapholTypesEnum.ENUMERATION:
                        if (identity === GrapholTypesEnum.INDIVIDUAL) {
                            return (_a = GrapholNodesEnum.CLASS) === null || _a === void 0 ? void 0 : _a.TYPE;
                        }
                        else {
                            return identity;
                        }
                    default:
                        return identity;
                }
            }
        }
    }
    getGrapholNodeInfo(element) {
        let elementTypeFromXmL = element.getAttribute('type');
        if (!elementTypeFromXmL)
            return;
        switch (elementTypeFromXmL) {
            case 'concept':
                elementTypeFromXmL = GrapholTypesEnum.CLASS;
                break;
            case 'role':
                elementTypeFromXmL = GrapholTypesEnum.OBJECT_PROPERTY;
                break;
            case 'attribute':
                elementTypeFromXmL = GrapholTypesEnum.DATA_PROPERTY;
                break;
        }
        let nodeTypeKey = Object.keys(GrapholNodesEnum).find(k => GrapholNodesEnum[k].TYPE === elementTypeFromXmL);
        if (!nodeTypeKey)
            return;
        return GrapholNodesEnum[nodeTypeKey];
    }
    getCorrectLabelYpos(labelYpos, positionY, height) {
        return (labelYpos - positionY) + (height + 2) / 2 + LABEL_HEIGHT / 4;
    }
}

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=window,e$2=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$3=Symbol(),n$3=new WeakMap;class o$3{constructor(t,e,n){if(this._$cssResult$=!0,n!==s$3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=n$3.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n$3.set(s,t));}return t}toString(){return this.cssText}}const r$2=t=>new o$3("string"==typeof t?t:t+"",void 0,s$3),i$1=(t,...e)=>{const n=1===t.length?t[0]:e.reduce(((e,s,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[n+1]),t[0]);return new o$3(n,t,s$3)},S$1=(s,n)=>{e$2?s.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((e=>{const n=document.createElement("style"),o=t$1.litNonce;void 0!==o&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n);}));},c$1=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$2(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s$2;const e$1=window,r$1=e$1.trustedTypes,h$1=r$1?r$1.emptyScript:"",o$2=e$1.reactiveElementPolyfillSupport,n$2={toAttribute(t,i){switch(i){case Boolean:t=t?h$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},a$1=(t,i)=>i!==t&&(i==i||t==t),l$2={attribute:!0,type:String,converter:n$2,reflect:!1,hasChanged:a$1};class d$1 extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u();}static addInitializer(t){var i;this.finalize(),(null!==(i=this.h)&&void 0!==i?i:this.h=[]).push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Ep(s,i);void 0!==e&&(this._$Ev.set(e,s),t.push(e));})),t}static createProperty(t,i=l$2){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$2}static finalize(){if(this.hasOwnProperty("finalized"))return !1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(c$1(i));}else void 0!==i&&s.push(c$1(i));return s}static _$Ep(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1);}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return S$1(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$EO(t,i,s=l$2){var e;const r=this.constructor._$Ep(t,s);if(void 0!==r&&!0===s.reflect){const h=(void 0!==(null===(e=s.converter)||void 0===e?void 0:e.toAttribute)?s.converter:n$2).toAttribute(i,s.type);this._$El=t,null==h?this.removeAttribute(r):this.setAttribute(r,h),this._$El=null;}}_$AK(t,i){var s;const e=this.constructor,r=e._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=e.getPropertyOptions(r),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:n$2;this._$El=r,this[r]=h.fromAttribute(i,t.type),this._$El=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||a$1)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$E_=this._$Ej());}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$Ek();}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return !0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek();}updated(t){}firstUpdated(t){}}d$1.finalized=!0,d$1.elementProperties=new Map,d$1.elementStyles=[],d$1.shadowRootOptions={mode:"open"},null==o$2||o$2({ReactiveElement:d$1}),(null!==(s$2=e$1.reactiveElementVersions)&&void 0!==s$2?s$2:e$1.reactiveElementVersions=[]).push("1.4.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t;const i=window,s$1=i.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,o$1=`lit$${(Math.random()+"").slice(9)}$`,n$1="?"+o$1,l$1=`<${n$1}>`,h=document,r=(t="")=>h.createComment(t),d=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,c=t=>u(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,a=/-->/g,f=/>/g,_=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),m=/'/g,p=/"/g,$=/^(?:script|style|textarea|title)$/i,g=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),y=g(1),w=g(2),x=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),T=new WeakMap,A=h.createTreeWalker(h,129,null,!1),E=(t,i)=>{const s=t.length-1,n=[];let h,r=2===i?"<svg>":"",d=v;for(let i=0;i<s;i++){const s=t[i];let e,u,c=-1,g=0;for(;g<s.length&&(d.lastIndex=g,u=d.exec(s),null!==u);)g=d.lastIndex,d===v?"!--"===u[1]?d=a:void 0!==u[1]?d=f:void 0!==u[2]?($.test(u[2])&&(h=RegExp("</"+u[2],"g")),d=_):void 0!==u[3]&&(d=_):d===_?">"===u[0]?(d=null!=h?h:v,c=-1):void 0===u[1]?c=-2:(c=d.lastIndex-u[2].length,e=u[1],d=void 0===u[3]?_:'"'===u[3]?p:m):d===p||d===m?d=_:d===a||d===f?d=v:(d=_,h=void 0);const y=d===_&&t[i+1].startsWith("/>")?" ":"";r+=d===v?s+l$1:c>=0?(n.push(e),s.slice(0,c)+"$lit$"+s.slice(c)+o$1+y):s+o$1+(-2===c?(n.push(void 0),i):y);}const u=r+(t[s]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return [void 0!==e?e.createHTML(u):u,n]};class C{constructor({strings:t,_$litType$:i},e){let l;this.parts=[];let h=0,d=0;const u=t.length-1,c=this.parts,[v,a]=E(t,i);if(this.el=C.createElement(v,e),A.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(l=A.nextNode())&&c.length<u;){if(1===l.nodeType){if(l.hasAttributes()){const t=[];for(const i of l.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(o$1)){const s=a[d++];if(t.push(i),void 0!==s){const t=l.getAttribute(s.toLowerCase()+"$lit$").split(o$1),i=/([.?@])?(.*)/.exec(s);c.push({type:1,index:h,name:i[2],strings:t,ctor:"."===i[1]?M:"?"===i[1]?k:"@"===i[1]?H:S});}else c.push({type:6,index:h});}for(const i of t)l.removeAttribute(i);}if($.test(l.tagName)){const t=l.textContent.split(o$1),i=t.length-1;if(i>0){l.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)l.append(t[s],r()),A.nextNode(),c.push({type:2,index:++h});l.append(t[i],r());}}}else if(8===l.nodeType)if(l.data===n$1)c.push({type:2,index:h});else {let t=-1;for(;-1!==(t=l.data.indexOf(o$1,t+1));)c.push({type:7,index:h}),t+=o$1.length-1;}h++;}}static createElement(t,i){const s=h.createElement("template");return s.innerHTML=t,s}}function P(t,i,s=t,e){var o,n,l,h;if(i===x)return i;let r=void 0!==e?null===(o=s._$Co)||void 0===o?void 0:o[e]:s._$Cl;const u=d(i)?void 0:i._$litDirective$;return (null==r?void 0:r.constructor)!==u&&(null===(n=null==r?void 0:r._$AO)||void 0===n||n.call(r,!1),void 0===u?r=void 0:(r=new u(t),r._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Co)&&void 0!==l?l:h._$Co=[])[e]=r:s._$Cl=r),void 0!==r&&(i=P(t,r._$AS(t,i.values),r,e)),i}class V{constructor(t,i){this.u=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:h).importNode(s,!0);A.currentNode=o;let n=A.nextNode(),l=0,r=0,d=e[0];for(;void 0!==d;){if(l===d.index){let i;2===d.type?i=new N(n,n.nextSibling,this,t):1===d.type?i=new d.ctor(n,d.name,d.strings,this,t):6===d.type&&(i=new I(n,this,t)),this.u.push(i),d=e[++r];}l!==(null==d?void 0:d.index)&&(n=A.nextNode(),l++);}return o}p(t){let i=0;for(const s of this.u)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class N{constructor(t,i,s,e){var o;this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cm=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cm}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=P(this,t,i),d(t)?t===b||null==t||""===t?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==x&&this.g(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):c(t)?this.k(t):this.g(t);}O(t,i=this._$AB){return this._$AA.parentNode.insertBefore(t,i)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}g(t){this._$AH!==b&&d(this._$AH)?this._$AA.nextSibling.data=t:this.T(h.createTextNode(t)),this._$AH=t;}$(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=C.createElement(e.h,this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.p(s);else {const t=new V(o,this),i=t.v(this.options);t.p(s),this.T(i),this._$AH=t;}}_$AC(t){let i=T.get(t.strings);return void 0===i&&T.set(t.strings,i=new C(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new N(this.O(r()),this.O(r()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$Cm=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}}class S{constructor(t,i,s,e,o){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=P(this,t,i,0),n=!d(t)||t!==this._$AH&&t!==x,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=P(this,e[s+l],i,l),h===x&&(h=this._$AH[l]),n||(n=!d(h)||h!==this._$AH[l]),h===b?t=b:t!==b&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.j(t);}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class M extends S{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===b?void 0:t;}}const R=s$1?s$1.emptyScript:"";class k extends S{constructor(){super(...arguments),this.type=4;}j(t){t&&t!==b?this.element.setAttribute(this.name,R):this.element.removeAttribute(this.name);}}class H extends S{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=P(this,t,i,0))&&void 0!==s?s:b)===x)return;const e=this._$AH,o=t===b&&e!==b||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==b&&(e===b||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}}class I{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){P(this,t);}}const z=i.litHtmlPolyfillSupport;null==z||z(C,N),(null!==(t=i.litHtmlVersions)&&void 0!==t?t:i.litHtmlVersions=[]).push("2.4.0");const Z=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new N(i.insertBefore(r(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l,o;class s extends d$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Z(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1);}render(){return x}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n=globalThis.litElementPolyfillSupport;null==n||n({LitElement:s});(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.2.2");

const animationDuration = i$1 `200ms`;
const BOTTOM_RIGHT_WIDGET = i$1 `bottom-right-widget`;
var baseStyle = i$1 `
*, :host {
  line-height: initial;
  scrollbar-width: thin;
  pointer-events: auto;
}

:host(.${BOTTOM_RIGHT_WIDGET}) {
  border-radius: var(--gscape-border-radius-btn);
  border: 1px solid var(--gscape-color-border-subtle);
  background-color: var(--gscape-color-bg-default);
}

:host(.${BOTTOM_RIGHT_WIDGET}:hover) {
  border-color: var(--gscape-color-border-default);
}

.gscape-panel {
  font-size: 12px;
  background-color: var(--gscape-color-bg-default);
  box-shadow: 0 2px 10px 0 var(--gscape-color-shadow);
  border-radius: var(--gscape-border-radius);
  border: solid 1px var(--gscape-color-border-subtle);
  width: fit-content;
  min-width: 130px;
  max-width: 350px;
  max-height: 350px;
  overflow: auto;
  padding: 8px;
  position: relative;
}

::-webkit-scrollbar {
  width: 2px;
}

::-webkit-scrollbar:hover {
  width: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--gscape-color-fg-muted);
  -webkit-border-radius: 1ex;
}

.gscape-panel-in-tray {
  position: absolute;
  right: 100%;
  bottom: 0;
  margin-right: 4px;
  white-space: nowrap;
  animation-name: drop-left;
  animation-duration: ${animationDuration};
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 0;
  padding-left: 0;
}

.gscape-panel-in-tray.hanging {
  bottom: initial;
  transform: translate(0, calc(-50% - 17px));
}

.gscape-panel-in-tray > .content-wrapper {
  overflow: hidden auto;
  scrollbar-width: inherit;
  max-height: 320px;
  padding: 0px 8px;
  position: relative;
}

.slotted-icon, [slot = "icon"], [slot = "alt-icon"], [slot = "trailing-icon"] {
  line-height: 0;
}

.actionable {
  border-radius: var(--gscape-border-radius-btn);
  padding: 6px 8px;
  cursor: pointer;
}

.actionable:hover {
  background-color: var(--gscape-color-neutral);
}

.actionable:active {
  filter: brightness(90%);
}

.selected-item::before {
  content: '.';
  position: static;
  background-color: var(--gscape-color-accent);
  color: var(--gscape-color-accent);
  border-radius: var(--gscape-border-radius);
  margin: 4px 0;
}

.selected-item > .actionable {
  background-color: var(--gscape-color-neutral);
  font-weight: 600;
}

.primary {
  color: var(--gscape-color-accent);
}

.hide {
  display: none !important;
}

.drop-down {
  animation-name: drop-down;
  animation-duration: ${animationDuration};
}

@keyframes drop-down {
  from {opacity: 0; top: -20%;}
  to {opacity: 1; top: 0;}
}

.drop-left {
  animation-name: drop-left;
  animation-duration: ${animationDuration};
}

@keyframes drop-left {
  from {opacity: 0; position: absolute; right: -10px;}
  to {opacity: 1; right: 100%;}
}

.drop-right {
  animation-name: drop-right;
  animation-duration: ${animationDuration};
}

@keyframes drop-right {
  from {opacity: 0; position: absolute; left: -10px;}
  to {opacity: 1;  left: 100%;}
}

.blank-slate {
  display:flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  text-align: center;
}

.blank-slate > svg {
  height: 36px;
  width: 36px;
  margin-bottom: 12px;
}

.blank-slate > .header {
  font-weight: 600;
}

.blank-slate > .description {
  font-size: 12px;
  color: var(--gscape-color-fg-subtle);
}

.hr {
  height:1px;
  width:90%;
  margin: 0 auto;
  background-color: var(--gscape-color-border-subtle)
}

.header {
  font-weight: 600;
  margin: 8px 16px;
}

.gscape-panel-in-tray > .header {
  margin-top: 0;
  text-align: center;
}

.muted-text {
  color: var(--gscape-color-fg-muted);
}

.ellipsed, .ellipsed * {
  overflow-x: hidden;
  text-overflow: ellipsis ellipsis;
}

.bold-text {
  font-weight: 600;
}

select {
  background: var(--gscape-color-neutral-subtle);
  border: solid 1px var(--gscape-color-border-subtle);
  color: inherit;
  padding: 8px 12px;
  font-size: inherit;
  border-radius: var(--gscape-border-radius);
  cursor: pointer;
}

select:focus, input:focus {
  border-color: var(--gscape-color-accent);
  box-shadow: var(--gscape-color-accent) 0px 0px 0px 1px inset;
  outline: currentcolor none 0px;
}

input {
  line-height: inherit;
  border: solid 1px var(--gscape-color-border-subtle);
  padding: 6px 12px;
  border-radius: var(--gscape-border-radius);
  background: var(--gscape-color-bg-inset);
  color: inherit;
  display: inline-block;
  box-sizing: border-box;
}

.link {
  text-decoration: underline;
  cursor: pointer;
  color: var(--gscape-color-accent);
}

.section-body {
  padding: 0px 8px;
}

.section-header {
  margin-bottom: 4px;
}

.chip {
  display: inline-flex;
  border: 1px solid var(--gscape-color-accent);
  color: var(--gscape-color-accent);
  border-radius: 16px;
  padding: 2px 6px;
  background: var(--gscape-color-accent-subtle);
  margin: 1px 2px;
}

.area {
  background: var(--gscape-color-bg-inset);
  border-radius: calc(var(--gscape-border-radius) - 2px);
  padding: 4px 4px 4px 6px;
  border: solid 1px var(--gscape-color-border-subtle);
  margin-bottom: 18px;
}
`;

var GscapeButtonStyle = i$1 `
.btn {
  border-radius: var(--gscape-border-radius-btn);
  border: 1px solid var(--gscape-color-border-subtle);
  font-family: inherit;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  text-align: center;
  background-color: var(--gscape-color-bg-default);
  line-height: 20px;
  display: inline-flex;
  position: relative;
  color: inherit;
}

.btn[label] {
  gap: 8px;
  justify-content: center;
}

.btn:hover {
  background-color: var(--gscape-color-neutral);
  border-color: var(--gscape-color-border-default);
}

.btn:active {
  background-color: var(--gscape-color-neutral-muted);
}

.btn[active] {
  color: var(--gscape-color-accent);
}

.btn[disabled] {
  opacity: 50%;
  cursor: initial;
  pointer-events: none;
}

.btn-s {
  font-size: 12px;
  padding: 3px 4px;
}

.btn-s[label] {
  padding-left: 8px;
  padding-right: 8px;
}


.btn-m {
  font-size: 14px;
  padding: 5px 6px;
}

.btn-m[label] {
  padding-left: 16px;
  padding-right: 16px;
}

.btn-l {
  font-size: 16px;
  padding: 7px 8px;
}

.btn-l[label] {
  padding-left: 32px;
  padding-right: 32px;
}

.btn.primary, .primary-box {
  background-color: var(--gscape-color-accent);
  color: var(--gscape-color-fg-on-emphasis);
}

.btn.subtle, .subtle-box {
  background-color: transparent;
  border: none;
  box-shadow: none;
}

.btn.subtle:hover {
  background-color: var(--gscape-color-neutral);
}

.btn.subtle:active {
  background-color: var(--gscape-color-neutral-muted);
}

.btn.subtle:hover > .btn-label {
  color: var(--gscape-color-accent);
}

.btn-label {
  font-weight: 600;
  line-height: 20px;
}
`;

var SizeEnum;
(function (SizeEnum) {
    SizeEnum["S"] = "s";
    SizeEnum["M"] = "m";
    SizeEnum["L"] = "l";
})(SizeEnum || (SizeEnum = {}));
class GscapeButton extends s {
    // static get styles() {
    //   let super_styles = super.styles
    //   let colors = super_styles[1]
    //   return [
    //     super_styles[0],
    //     css`
    //       :host {
    //         box-shadow: 0 0 4px 0 var(--theme-gscape-shadows, ${colors.shadows});
    //         padding: calc(var(--gscape-icon-size) * 0.2 );
    //         cursor: pointer;
    //       }
    //       :host(:hover){
    //         box-shadow: 0 0 8px 0 var(--theme-gscape-shadows, ${colors.shadows});
    //         color: var(--theme-gscape-secondary, ${colors.secondary});
    //       }
    //       .btn {
    //         display: flex;
    //         align-items: center;
    //       }
    //       .btn-label {
    //         font-weight: var(--gscape-button-font-weight, 600);
    //         padding: 0 5px 0 8px;
    //       }
    //       .btn[active] {
    //         color: var(--theme-gscape-secondary, ${colors.secondary});
    //       }
    //       .btn[disabled] {
    //         opacity: 20%;
    //         cursor: initial;
    //         pointer-events: none;
    //       }
    //       svg {
    //         height: inherit;
    //         width: inherit;
    //       }
    //     `
    //   ]
    // }
    constructor() {
        super();
        this.size = SizeEnum.M;
        this.toggled = false;
        this.asSwitch = false;
        this.active = false;
        this.disabled = false;
        this.label = '';
    }
    render() {
        return y `
      <button
        class="btn btn-${this.size} ${this.type}"
        ?label="${this.label}"
        ?disabled = "${this.disabled}"
        ?active = "${this.active}"
        @click = "${this.clickHandler}"
      >

      ${this.toggled && this.altIcon
            ? y `<slot name="alt-icon" class="slotted-icon"></slot>`
            : y `<slot name="icon" class="slotted-icon"></slot>`}

      ${this.label ? y `<span class="btn-label">${this.label}<span>` : ``}

      <slot name="trailing-icon" class="slotted-icon"></slot>
      </button>
    `;
    }
    clickHandler() {
        this.toggled = !this.toggled;
        if (!this.disabled && this.asSwitch)
            this.active = !this.active;
    }
    get altIcon() {
        return this.querySelector('[slot = "alt-icon"]');
    }
}
GscapeButton.properties = {
    active: { type: Boolean, reflect: true },
    label: { type: String, reflect: true },
    title: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    asSwitch: { type: Boolean, attribute: 'as-switch', reflect: true },
    size: { type: String, reflect: true },
    type: { type: String, reflect: true },
    fullWidth: { type: String, attribute: 'full-width', reflect: true },
    toggled: { type: Boolean, state: true }
};
GscapeButton.styles = [baseStyle, GscapeButtonStyle];
customElements.define('gscape-button', GscapeButton);

var ToggleLabelPosition;
(function (ToggleLabelPosition) {
    ToggleLabelPosition["LEFT"] = "left";
    ToggleLabelPosition["RIGHT"] = "right";
})(ToggleLabelPosition || (ToggleLabelPosition = {}));
class GscapeToggle extends s {
    constructor() {
        super(...arguments);
        this.labelPosition = ToggleLabelPosition.RIGHT;
    }
    static get properties() {
        return {
            disabled: { type: Boolean, reflect: true },
            label: { type: String, reflect: true },
            labelPosition: { type: String, reflect: true, attribute: 'label-position' },
            key: { type: String, reflect: true },
            checked: { type: Boolean, reflect: true },
        };
    }
    render() {
        return y `
    <label class="toggle-container">
      <span class="toggle-label">${this.label}</span>
      <span class="toggle-wrap">
        <input id="${this.key}" type="checkbox"
          ?checked="${this.checked}"
          ?disabled="${this.disabled}"
        />
        <span class="toggle"></span>
      </span>
    </label>
    `;
    }
}
GscapeToggle.ToggleLabelPosition = ToggleLabelPosition;
GscapeToggle.styles = [
    baseStyle,
    i$1 `
      :host {
        display: block;
        cursor: pointer;
      }

      :host([disabled]) {
        cursor: not-allowed;
      }

      .toggle-container {
        white-space: nowrap;
        display: flex;
        align-items: center;
        cursor: inherit;
        gap: 15px;
        justify-content: space-between;
      }

      :host([label-position = "right"]) > .toggle-container {
        flex-direction: row-reverse;
      }

      .toggle-wrap {
        width: 36px;
        height: 18px;
        display: inline-block;
        position: relative;
      }

      .toggle {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 18px;
        background-color: var(--gscape-color-neutral-muted);
        border: 1px solid var(--gscape-color-border-subtle);
        transition: all 0.2s ease 0s;
      }

      .toggle::before {
        content: "";
        transition: all 0.1s ease 0s;
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: var(--gscape-color-bg-default);
        border: solid 1px var(--gscape-color-border-subtle);
        border-radius: 9px;
        bottom: 2px;
        left: 2px;
      }

      .toggle-wrap input {
        display:none;
      }

      .toggle-wrap input:checked + .toggle {
        background-color: var(--gscape-color-accent-muted);
        border-color: var(--gscape-color-accent);
        filter: brightness(100%);
      }

      .toggle-wrap input:checked + .toggle::before {
        -webkit-transform: translateX(18px);
        -ms-transform: translateX(18px);
        transform: translateX(18px);
        background-color: var(--gscape-color-accent);
      }

      .toggle-wrap input:disabled + .toggle {
        opacity:0.5;
      }

      .toggle-label {
        flex-grow: 2;
      }
    `
];
customElements.define('gscape-toggle', GscapeToggle);

var actionItemStyle = i$1 `
  .list-item {
    display: flex;
    gap: 8px;
    width: 100%;
  }

  .list-item.selected-item::before {
    margin-right: -4px;
  }

  .list-item-label {
    align-self: center;
  }
`;

class GscapeActionListItem extends s {
    constructor() {
        super(...arguments);
        this.expanded = false;
    }
    render() {
        return y `
      <li class="list-item ${this.selected && !this.subtle ? 'selected-item' : null} ellipsed" @click=${this.clickHandler}>
        <div class="list-item actionable" @click=${this.clickHandler}>
          <slot name="icon" class="slotted-icon" ></slot>
          <span class="list-item-label" title=${this.label}>${this.label}</span>
          <slot name="trailing-icon" class="slotted-icon" ></slot>

          ${this.expanded
            ? y `<slot name="hidden-content" class="slotted-icon" ></slot>`
            : null}
        </div>
      </li>
    `;
    }
    clickHandler() {
        if (this.hiddenContent) {
            this.expanded = !this.expanded;
        }
    }
    get hiddenContent() { return this.querySelector('[slot = "hidden-content"]'); }
}
GscapeActionListItem.properties = {
    label: { type: String, reflect: true },
    subtle: { type: Boolean },
    selected: { type: Boolean },
    expanded: { state: true }
};
GscapeActionListItem.styles = [baseStyle, actionItemStyle];
customElements.define('gscape-action-list-item', GscapeActionListItem);

const BaseMixin = (superClass) => {
    class BaseMixinClass extends superClass {
        constructor() {
            super(...arguments);
            this.enabled = true;
            this.display = this.style.display;
            this.onStateChange = () => { };
        }
        hide() {
            if (this.enabled && this.style.display !== 'none') {
                this.display = this.style.display;
                this.style.display = 'none';
            }
        }
        show() {
            if (this.enabled && this.style.display === 'none')
                this.style.display = this.display;
        }
        showInPosition(position) {
            if (this.style.position !== 'absolute') {
                console.warn('Grapholscape: showInPosition() has no effect with position different from absolute or relative');
            }
            this.show();
            if (position) {
                this.style.top = position.y + "px";
                this.style.left = position.x + "px";
            }
        }
        enable() {
            this.enabled = true;
            this.show();
            this.onStateChange();
        }
        disable() {
            this.hide();
            this.enabled = false;
            this.onStateChange();
        }
        get isVisible() { return this.enabled && this.style.display !== 'none'; }
    }
    // Cast return type to your mixin's interface intersected with the superClass type
    return BaseMixinClass;
};

// Define the interface for the mixin
const DropPanelMixin = (superClass) => {
    class DropPanelMixinClass extends superClass {
        constructor() {
            super(...arguments);
            this.onTogglePanel = () => { };
        }
        get panel() { var _a; return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('#drop-panel'); }
        togglePanel() {
            var _a;
            (_a = this.panel) === null || _a === void 0 ? void 0 : _a.classList.toggle('hide');
            this.requestUpdate();
            this.onTogglePanel();
        }
        openPanel() {
            var _a;
            (_a = this.panel) === null || _a === void 0 ? void 0 : _a.classList.remove('hide');
            this.requestUpdate();
        }
        closePanel() {
            var _a;
            (_a = this.panel) === null || _a === void 0 ? void 0 : _a.classList.add('hide');
            this.requestUpdate();
        }
        blur() {
            super.blur();
            this.closePanel();
        }
        isPanelClosed() {
            return this.panel ? this.panel.classList.contains('hide') : false; // default open
        }
    }
    // Cast return type to your mixin's interface intersected with the superClass type
    return DropPanelMixinClass;
};
function hasDropPanel(element) {
    return element.togglePanel ? true : false;
}

const ModalMixin = (superClass) => {
    class ModalMixinClass extends superClass {
        constructor(..._) {
            super();
            this.modalBackground = document.createElement('div');
            this.modalBackground.style.cssText = `
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: var(--gscape-color-bg-default);
        opacity: 0.6;
        display: none;
      `;
        }
        show() {
            super.show();
            // (this as unknown as HTMLElement).style.zIndex = '2';
            this.showModalBackground();
        }
        hide() {
            super.hide();
            this.style.zIndex = '';
            this.hideModalBackground();
        }
        showModalBackground() {
            var _a, _b;
            this.modalBackground.style.display = 'initial';
            const thisElem = this;
            (_a = thisElem.shadowRoot) === null || _a === void 0 ? void 0 : _a.insertBefore(this.modalBackground, (_b = thisElem.shadowRoot) === null || _b === void 0 ? void 0 : _b.firstElementChild);
        }
        hideModalBackground() {
            this.modalBackground.style.display = 'none';
        }
    }
    // Cast return type to your mixin's interface intersected with the superClass type
    return ModalMixinClass;
};

class GscapeTextSearch extends s {
    constructor() {
        super(...arguments);
        this._onSearchCallback = () => { };
    }
    render() {
        return y `
      
    `;
    }
    onSearch(callback) {
        this._onSearchCallback = callback;
    }
}
GscapeTextSearch.properties = {
    value: { type: String, reflect: true },
    placeholder: { type: String, reflect: true }
};
GscapeTextSearch.styles = [baseStyle, GscapeButtonStyle];
customElements.define('gscape-text-search', GscapeTextSearch);

var classIcon = w `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   width="18"
   height="18"
   version="1.1"
   id="svg4"
   sodipodi:docname="class.svg"
   inkscape:version="0.92.4 (f8dce91, 2019-08-02)">
  <metadata
     id="metadata10">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <defs
     id="defs8" />
  <sodipodi:namedview
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1"
     objecttolerance="10"
     gridtolerance="10"
     guidetolerance="10"
     inkscape:pageopacity="0"
     inkscape:pageshadow="2"
     inkscape:window-width="1853"
     inkscape:window-height="1025"
     id="namedview6"
     showgrid="false"
     inkscape:zoom="13.111111"
     inkscape:cx="0.11440678"
     inkscape:cy="9"
     inkscape:window-x="67"
     inkscape:window-y="27"
     inkscape:window-maximized="1"
     inkscape:current-layer="svg4" />
  <rect
     x="3"
     y="6"
     width="12"
     height="7"
     rx="0"
     ry="0"
     id="rect2"
     style="fill:none;stroke: var(--gscape-color-class-contrast);stroke-width:3" />
</svg>
`;

var classInstanceIcon = w `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
<circle cx="9" cy="9" r="5" stroke="var(--gscape-color-class-instance-contrast)" stroke-width="3.5" fill="none"/>
</svg>
`;

var dataPropertyIcon = w `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
<circle cx="9" cy="9" r="5" stroke="var(--gscape-color-data-property-contrast)" stroke-width="3.5" fill="none"/>
</svg>
`;

var individualIcon = w `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns:osb="http://www.openswatchbook.org/uri/2009/osb"
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   inkscape:version="1.0 (6e3e5246a0, 2020-05-07)"
   sodipodi:docname="individual.svg"
   id="svg4"
   version="1.1"
   height="18"
   width="18">
  <metadata
     id="metadata10">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <defs
     id="defs8">
    <linearGradient
       osb:paint="solid"
       id="linearGradient880">
      <stop
         id="stop878"
         offset="0"
         style="stop-color:#000000;stop-opacity:1;" />
    </linearGradient>
  </defs>
  <sodipodi:namedview
     inkscape:document-rotation="0"
     fit-margin-bottom="0"
     fit-margin-right="0"
     fit-margin-left="0"
     fit-margin-top="0"
     inkscape:current-layer="svg4"
     inkscape:window-maximized="0"
     inkscape:window-y="27"
     inkscape:window-x="993"
     inkscape:cy="9.677215"
     inkscape:cx="9.0082925"
     inkscape:zoom="22.702061"
     showgrid="false"
     id="namedview6"
     inkscape:window-height="1025"
     inkscape:window-width="927"
     inkscape:pageshadow="2"
     inkscape:pageopacity="0"
     guidetolerance="10"
     gridtolerance="10"
     objecttolerance="10"
     borderopacity="1"
     bordercolor="#666666"
     pagecolor="#ffffff" />
  <g
     id="g27">
    <g
       id="g21">
      <g
         id="g16">
        <g
           id="g12" />
      </g>
    </g>
  </g>
  <path
     transform="matrix(0.9072154,0,0,0.92465409,0.92347539,1.0342853)"
     d="m 15.868025,11.669896 -4.068749,4.075966 -5.7591839,0.0051 -4.0759657,-4.06875 -0.0051,-5.7591835 4.0687497,-4.0759657 5.7591833,-0.0051 4.075966,4.0687497 z"
     inkscape:randomized="0"
     inkscape:rounded="0"
     inkscape:flatsided="true"
     sodipodi:arg2="0.78451219"
     sodipodi:arg1="0.39181311"
     sodipodi:r2="6.9185686"
     sodipodi:r1="7.5247387"
     sodipodi:cy="8.796464"
     sodipodi:cx="8.9135246"
     sodipodi:sides="8"
     id="path51"
     style="fill:none;fill-rule:evenodd;stroke:var(--gscape-color-individual-contrast);stroke-width:4;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
     sodipodi:type="star" />
</svg>`;

var objectPropertyIcon = w `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   width="18"
   height="18"
   version="1.1"
   id="svg4"
   sodipodi:docname="role.svg"
   inkscape:version="0.92.4 (f8dce91, 2019-08-02)">
  <metadata
     id="metadata10">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <defs
     id="defs8" />
  <sodipodi:namedview
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1"
     objecttolerance="10"
     gridtolerance="10"
     guidetolerance="10"
     inkscape:pageopacity="0"
     inkscape:pageshadow="2"
     inkscape:window-width="927"
     inkscape:window-height="1025"
     id="namedview6"
     showgrid="false"
     inkscape:zoom="13.111111"
     inkscape:cx="7.2336581"
     inkscape:cy="6.7167247"
     inkscape:window-x="993"
     inkscape:window-y="27"
     inkscape:window-maximized="0"
     inkscape:current-layer="svg4"
     fit-margin-top="0"
     fit-margin-left="0"
     fit-margin-right="0"
     fit-margin-bottom="0" />
  <polygon
     points="125,86.909 146.992,125 125,163.092 103.008,125 "
     transform="matrix(0.27862408,0,0,0.13179941,-25.774205,-7.2921404)"
     id="polygon2"
     style="fill:none;stroke:var(--gscape-color-object-property-contrast);stroke-width:12.02451324;stroke-linecap:square;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none" />
</svg>
`;

const diagrams = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M6.333 5.438Q5.875 5.438 5.552 5.76Q5.229 6.083 5.229 6.542Q5.229 7 5.552 7.302Q5.875 7.604 6.333 7.604Q6.792 7.604 7.094 7.302Q7.396 7 7.396 6.542Q7.396 6.083 7.094 5.76Q6.792 5.438 6.333 5.438ZM6.333 13.208Q5.875 13.208 5.552 13.51Q5.229 13.812 5.229 14.271Q5.229 14.729 5.552 15.052Q5.875 15.375 6.333 15.375Q6.792 15.375 7.094 15.052Q7.396 14.729 7.396 14.271Q7.396 13.812 7.094 13.51Q6.792 13.208 6.333 13.208ZM3.667 3.167H16.354Q16.667 3.167 16.875 3.375Q17.083 3.583 17.083 3.896V9.104Q17.083 9.458 16.875 9.677Q16.667 9.896 16.354 9.896H3.667Q3.354 9.896 3.135 9.677Q2.917 9.458 2.917 9.104V3.896Q2.917 3.583 3.135 3.375Q3.354 3.167 3.667 3.167ZM4.25 4.5V8.562H15.75V4.5ZM3.667 10.938H16.333Q16.667 10.938 16.875 11.156Q17.083 11.375 17.083 11.708V16.875Q17.083 17.229 16.875 17.448Q16.667 17.667 16.333 17.667H3.688Q3.354 17.667 3.135 17.448Q2.917 17.229 2.917 16.875V11.708Q2.917 11.375 3.125 11.156Q3.333 10.938 3.667 10.938ZM4.25 12.271V16.333H15.75V12.271ZM4.25 4.5V8.562ZM4.25 12.271V16.333Z"/></svg>`;
const triangle_up = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 14l5-5 5 5H7z"/></svg>`;
const triangle_down = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 10l5 5 5-5H7z"/></svg>`;
const arrow_right = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>`;
const arrowDown = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M10 12 6 8H14Z"/></svg>`;
const explore = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="m5.75 14.25 6.021-2.479L14.25 5.75 8.229 8.229Zm3.542-3.542Q9 10.417 9 10t.292-.708Q9.583 9 10 9t.708.292Q11 9.583 11 10t-.292.708Q10.417 11 10 11t-.708-.292ZM10 18q-1.646 0-3.104-.625-1.458-.625-2.552-1.719t-1.719-2.552Q2 11.646 2 10q0-1.667.625-3.115.625-1.447 1.719-2.541Q5.438 3.25 6.896 2.625T10 2q1.667 0 3.115.625 1.447.625 2.541 1.719 1.094 1.094 1.719 2.541Q18 8.333 18 10q0 1.646-.625 3.104-.625 1.458-1.719 2.552t-2.541 1.719Q11.667 18 10 18Zm0-1.5q2.708 0 4.604-1.896T16.5 10q0-2.708-1.896-4.604T10 3.5q-2.708 0-4.604 1.896T3.5 10q0 2.708 1.896 4.604T10 16.5Zm0-6.5Z"/></svg>`;
const info_outline = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M9.25 14H10.75V9H9.25ZM10 7.5Q10.312 7.5 10.531 7.281Q10.75 7.062 10.75 6.75Q10.75 6.438 10.531 6.219Q10.312 6 10 6Q9.688 6 9.469 6.219Q9.25 6.438 9.25 6.75Q9.25 7.062 9.469 7.281Q9.688 7.5 10 7.5ZM10 16.5Q11.354 16.5 12.531 15.99Q13.708 15.479 14.594 14.594Q15.479 13.708 15.99 12.521Q16.5 11.333 16.5 10Q16.5 8.646 15.99 7.469Q15.479 6.292 14.594 5.406Q13.708 4.521 12.531 4.01Q11.354 3.5 10 3.5Q8.667 3.5 7.479 4.01Q6.292 4.521 5.406 5.406Q4.521 6.292 4.01 7.469Q3.5 8.646 3.5 10Q3.5 11.333 4.01 12.521Q4.521 13.708 5.406 14.594Q6.292 15.479 7.479 15.99Q8.667 16.5 10 16.5ZM10 18Q6.667 18 4.333 15.667Q2 13.333 2 10Q2 6.667 4.333 4.333Q6.667 2 10 2Q13.333 2 15.667 4.333Q18 6.667 18 10Q18 13.333 15.667 15.667Q13.333 18 10 18ZM10 10Q10 10 10 10Q10 10 10 10Q10 10 10 10Q10 10 10 10Q10 10 10 10Q10 10 10 10Q10 10 10 10Q10 10 10 10Z"/></svg>`;
const enterFullscreen = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="1 1 18 18"><path d="M4.167 15.833V11.646H5.5V14.5H8.354V15.833ZM4.167 8.354V4.167H8.354V5.5H5.5V8.354ZM11.646 15.833V14.5H14.5V11.646H15.833V15.833ZM14.5 8.354V5.5H11.646V4.167H15.833V8.354Z"/></svg>`;
const exitFullscreen = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="1 1 18 18"><path d="M7.021 15.833V12.979H4.167V11.646H8.354V15.833ZM4.167 8.354V7.021H7.021V4.167H8.354V8.354ZM11.646 15.833V11.646H15.833V12.979H12.979V15.833ZM11.646 8.354V4.167H12.979V7.021H15.833V8.354Z"/></svg>`;
const centerDiagram = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M10 12.167Q9.104 12.167 8.469 11.531Q7.833 10.896 7.833 10Q7.833 9.104 8.469 8.469Q9.104 7.833 10 7.833Q10.896 7.833 11.531 8.469Q12.167 9.104 12.167 10Q12.167 10.896 11.531 11.531Q10.896 12.167 10 12.167ZM2.917 7.542V4.5Q2.917 3.833 3.375 3.375Q3.833 2.917 4.5 2.917H7.542V4.25H4.5Q4.417 4.25 4.333 4.333Q4.25 4.417 4.25 4.5V7.542ZM7.542 17.083H4.5Q3.833 17.083 3.375 16.625Q2.917 16.167 2.917 15.5V12.458H4.25V15.5Q4.25 15.583 4.333 15.667Q4.417 15.75 4.5 15.75H7.542ZM12.458 17.083V15.75H15.5Q15.583 15.75 15.667 15.667Q15.75 15.583 15.75 15.5V12.458H17.083V15.5Q17.083 16.167 16.625 16.625Q16.167 17.083 15.5 17.083ZM15.75 7.542V4.5Q15.75 4.417 15.667 4.333Q15.583 4.25 15.5 4.25H12.458V2.917H15.5Q16.167 2.917 16.625 3.375Q17.083 3.833 17.083 4.5V7.542ZM10 10.833Q10.354 10.833 10.594 10.594Q10.833 10.354 10.833 10Q10.833 9.646 10.594 9.406Q10.354 9.167 10 9.167Q9.646 9.167 9.406 9.406Q9.167 9.646 9.167 10Q9.167 10.354 9.406 10.594Q9.646 10.833 10 10.833Z"/></svg>`;
const filter = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M8.062 13.979V12.583H11.938V13.979ZM5.104 10.5V9.104H14.875V10.5ZM3.146 7V5.604H16.854V7Z"/></svg>`;
const bubbles = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M6.021 14.667Q4.75 14.667 3.865 13.781Q2.979 12.896 2.979 11.625Q2.979 10.354 3.865 9.469Q4.75 8.583 6.021 8.583Q7.271 8.583 8.156 9.469Q9.042 10.354 9.042 11.625Q9.042 12.896 8.156 13.781Q7.271 14.667 6.021 14.667ZM13.542 11.458Q11.792 11.458 10.583 10.24Q9.375 9.021 9.375 7.271Q9.375 5.5 10.583 4.292Q11.792 3.083 13.542 3.083Q15.292 3.083 16.521 4.292Q17.75 5.5 17.75 7.271Q17.75 9.021 16.521 10.24Q15.292 11.458 13.542 11.458ZM11.958 16.938Q11.042 16.938 10.396 16.292Q9.75 15.646 9.75 14.708Q9.75 13.792 10.396 13.146Q11.042 12.5 11.958 12.5Q12.896 12.5 13.542 13.146Q14.188 13.792 14.188 14.708Q14.188 15.646 13.542 16.292Q12.896 16.938 11.958 16.938Z"/></svg>`;
const lite = w `<svg fill="currentColor" style="padding: 2px; box-sizing: border-box;" width="20" height="20" version="1.1" viewBox="0 0 752 752" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com"><path d="M 375.714 0.009 C 371.042 0.066 366.482 1.447 362.593 3.994 L 156.603 127.708 C 153.518 129.737 150.954 132.436 149.099 135.596 L 12.104 135.596 C 5.422 135.596 0 140.911 0 147.462 L 0 599.375 L 0 599.369 C 0 605.92 5.422 611.236 12.104 611.236 L 139.149 611.236 L 139.149 728.278 L 139.149 728.272 C 139.149 734.568 141.694 740.599 146.235 745.052 C 150.77 749.498 156.93 752 163.343 752 L 588.652 752 C 595.064 752 601.218 749.498 605.76 745.052 C 610.292 740.599 612.846 734.568 612.846 728.272 L 612.846 611.236 L 739.903 611.236 C 746.584 611.236 752 605.92 752 599.369 L 752 147.456 C 752 140.905 746.584 135.59 739.903 135.59 L 602.94 135.59 C 601.08 132.428 598.496 129.73 595.403 127.702 L 389.431 3.988 C 385.371 1.333 380.59 -0.056 375.709 0.001 L 375.714 0.009 Z M 376.014 98.108 L 491.584 157.275 L 376.014 216.436 L 260.427 157.275 L 376.014 98.108 Z M 37.566 178.974 L 149.089 178.974 C 150.949 182.128 153.519 184.821 156.606 186.844 L 362.579 310.545 L 362.584 310.545 C 366.556 313.142 371.23 314.529 376.006 314.529 C 380.781 314.529 385.455 313.142 389.427 310.545 L 595.383 186.844 C 598.463 184.815 601.026 182.122 602.88 178.974 L 714.428 178.974 L 714.428 574.405 L 612.83 574.405 L 612.83 463.926 C 612.83 457.631 610.28 451.599 605.744 447.153 C 601.202 442.701 595.051 440.201 588.631 440.201 L 163.339 440.201 C 156.926 440.201 150.767 442.701 146.232 447.153 C 141.69 451.599 139.146 457.631 139.146 463.926 L 139.146 574.405 L 37.561 574.405 L 37.566 178.974 Z M 242.668 541.701 L 509.325 541.701 L 510.994 652.145 L 240.998 652.145 L 242.668 541.701 Z" fill-rule="evenodd" style=""></path></svg>`;
const settings_icon = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="m8.021 17.917-.313-2.5q-.27-.125-.625-.334-.354-.208-.625-.395l-2.312.979-1.979-3.438 1.979-1.5q-.021-.167-.031-.364-.011-.198-.011-.365 0-.146.011-.344.01-.198.031-.385l-1.979-1.5 1.979-3.417 2.312.958q.271-.187.615-.385t.635-.344l.313-2.5h3.958l.313 2.5q.312.167.625.344.312.177.604.385l2.333-.958 1.979 3.417-1.979 1.521q.021.187.021.364V10q0 .146-.01.333-.011.188-.011.396l1.958 1.5-1.979 3.438-2.312-.979q-.292.208-.615.395-.323.188-.614.334l-.313 2.5Zm1.937-5.355q1.063 0 1.813-.75t.75-1.812q0-1.062-.75-1.812t-1.813-.75q-1.041 0-1.802.75-.76.75-.76 1.812t.76 1.812q.761.75 1.802.75Zm0-1.333q-.5 0-.864-.364-.365-.365-.365-.865t.365-.865q.364-.364.864-.364t.865.364q.365.365.365.865t-.365.865q-.365.364-.865.364ZM10.021 10Zm-.854 6.583h1.666l.25-2.187q.605-.167 1.136-.49.531-.323 1.031-.802l2.021.875.854-1.375-1.792-1.354q.105-.333.136-.635.031-.303.031-.615 0-.292-.031-.573-.031-.281-.115-.635l1.792-1.396-.834-1.375-2.062.875q-.438-.438-1.021-.781-.583-.344-1.125-.49l-.271-2.208H9.167l-.271 2.208q-.584.146-1.125.458-.542.313-1.042.792l-2.021-.854-.833 1.375 1.75 1.354q-.083.333-.125.646-.042.312-.042.604t.042.594q.042.302.125.635l-1.75 1.375.833 1.375 2.021-.854q.479.458 1.021.771.542.312 1.146.479Z"/></svg>`;
const infoFilled = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M10 14.167Q10.354 14.167 10.615 13.906Q10.875 13.646 10.875 13.292V10.021Q10.875 9.667 10.615 9.417Q10.354 9.167 10 9.167Q9.646 9.167 9.385 9.427Q9.125 9.688 9.125 10.042V13.312Q9.125 13.667 9.385 13.917Q9.646 14.167 10 14.167ZM10 7.479Q10.354 7.479 10.615 7.219Q10.875 6.958 10.875 6.604Q10.875 6.25 10.615 5.99Q10.354 5.729 10 5.729Q9.646 5.729 9.385 5.99Q9.125 6.25 9.125 6.604Q9.125 6.958 9.385 7.219Q9.646 7.479 10 7.479ZM10 18.333Q8.271 18.333 6.75 17.677Q5.229 17.021 4.104 15.896Q2.979 14.771 2.323 13.25Q1.667 11.729 1.667 10Q1.667 8.271 2.323 6.75Q2.979 5.229 4.104 4.104Q5.229 2.979 6.75 2.323Q8.271 1.667 10 1.667Q11.729 1.667 13.25 2.323Q14.771 2.979 15.896 4.104Q17.021 5.229 17.677 6.75Q18.333 8.271 18.333 10Q18.333 11.729 17.677 13.25Q17.021 14.771 15.896 15.896Q14.771 17.021 13.25 17.677Q11.729 18.333 10 18.333Z"/></svg>`;
const plus = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M9.188 15.083V10.792H4.896V9.167H9.188V4.875H10.812V9.167H15.104V10.792H10.812V15.083Z"/></svg>`;
const minus = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M4.875 10.792V9.167H15.125V10.792Z"/></svg>`;
const save = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M17.083 6v9.5q0 .667-.458 1.125-.458.458-1.125.458h-11q-.667 0-1.125-.458-.458-.458-.458-1.125v-11q0-.667.458-1.125.458-.458 1.125-.458H14Zm-1.333.604L13.396 4.25H4.5q-.104 0-.177.073T4.25 4.5v11q0 .104.073.177t.177.073h11q.104 0 .177-.073t.073-.177ZM10 14.312q.896 0 1.531-.645.636-.646.636-1.521 0-.896-.636-1.531-.635-.636-1.531-.636-.896 0-1.531.636-.636.635-.636 1.531 0 .875.636 1.521.635.645 1.531.645Zm-4.667-6.02h6.855V5.333H5.333ZM4.25 6.604v9.146-11.5Z"/></svg>`;
const lock_open = '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/></svg>';
const close = w `<svg fillColor="currentColor" style="width:20px;height:20px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>`;
const blankSlateDiagrams = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M14.104 8.521Q13.875 8.312 13.875 8.052Q13.875 7.792 14.083 7.583L15.875 5.792Q16.062 5.604 16.333 5.615Q16.604 5.625 16.792 5.812Q17 6.021 17 6.281Q17 6.542 16.792 6.75L15 8.542Q14.812 8.729 14.552 8.719Q14.292 8.708 14.104 8.521ZM10 6.729Q9.729 6.729 9.531 6.531Q9.333 6.333 9.333 6.062V3.604Q9.333 3.333 9.531 3.135Q9.729 2.938 10 2.938Q10.271 2.938 10.469 3.135Q10.667 3.333 10.667 3.604V6.062Q10.667 6.333 10.469 6.531Q10.271 6.729 10 6.729ZM5 8.521 3.208 6.75Q3 6.562 3.01 6.281Q3.021 6 3.229 5.792Q3.417 5.604 3.688 5.604Q3.958 5.604 4.167 5.792L5.938 7.583Q6.125 7.792 6.125 8.052Q6.125 8.312 5.938 8.521Q5.729 8.708 5.458 8.708Q5.188 8.708 5 8.521ZM3.667 15.75H16.333Q16.417 15.75 16.5 15.667Q16.583 15.583 16.583 15.5V11.896Q16.583 11.812 16.5 11.729Q16.417 11.646 16.333 11.646H13.875Q13.375 12.771 12.302 13.469Q11.229 14.167 10 14.167Q8.771 14.167 7.708 13.469Q6.646 12.771 6.125 11.646H3.667Q3.583 11.646 3.5 11.729Q3.417 11.812 3.417 11.896V15.5Q3.417 15.583 3.5 15.667Q3.583 15.75 3.667 15.75ZM3.667 17.083Q3 17.083 2.542 16.625Q2.083 16.167 2.083 15.5V11.896Q2.083 11.229 2.542 10.771Q3 10.312 3.667 10.312H6.625Q7 10.312 7.083 10.385Q7.167 10.458 7.229 10.708Q7.417 11.5 8.135 12.167Q8.854 12.833 10 12.833Q11.146 12.833 11.865 12.156Q12.583 11.479 12.771 10.708Q12.833 10.458 12.917 10.385Q13 10.312 13.375 10.312H16.333Q17 10.312 17.458 10.771Q17.917 11.229 17.917 11.896V15.5Q17.917 16.167 17.458 16.625Q17 17.083 16.333 17.083ZM3.667 15.75Q3.583 15.75 3.5 15.75Q3.417 15.75 3.417 15.75Q3.417 15.75 3.5 15.75Q3.583 15.75 3.667 15.75H6.125Q6.646 15.75 7.708 15.75Q8.771 15.75 10 15.75Q11.229 15.75 12.302 15.75Q13.375 15.75 13.875 15.75H16.333Q16.417 15.75 16.5 15.75Q16.583 15.75 16.583 15.75Q16.583 15.75 16.5 15.75Q16.417 15.75 16.333 15.75Z"/></svg>`;
const check = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M8.229 13.771 5.021 10.542 5.75 9.792 8.229 12.25 14.25 6.25 14.979 7.021Z"/></svg>`;
const searchOff = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M6 16.417q-1.5 0-2.542-1.042-1.041-1.042-1.041-2.542 0-1.5 1.052-2.541Q4.521 9.25 6 9.25q1.5 0 2.542 1.052 1.041 1.052 1.041 2.552 0 1.479-1.052 2.521Q7.479 16.417 6 16.417Zm10.875-.771-5.083-5.084q-.104.105-.261.188-.156.083-.302.146l-.291-.375q-.146-.188-.313-.354.875-.438 1.427-1.261T12.604 7q0-1.5-1.052-2.552T9 3.396q-1.5 0-2.552 1.052T5.396 7q0 .208.042.406.041.198.083.386-.313.02-.563.073-.25.052-.52.135-.042-.229-.084-.479-.042-.25-.042-.521 0-1.938 1.376-3.312Q7.062 2.312 9 2.312q1.938 0 3.312 1.365Q13.688 5.042 13.688 7q0 .833-.282 1.583-.281.75-.739 1.334l4.979 4.958ZM4.812 14.521l1.167-1.167 1.167 1.167.542-.542-1.167-1.167 1.167-1.145-.542-.542-1.167 1.146-1.167-1.146-.541.542 1.167 1.145-1.167 1.167Z"/></svg>`;
/**
 * Author: Simran
 * Source: https://github.com/Templarian/MaterialDesign/blob/master/svg/checkbox-multiple-blank-circle.svg
 */
const move_bubbles = w `<svg style="width:20px;height:20px" viewBox="0 0 24 24"><path fill="currentColor" d="M14,2A8,8 0 0,0 6,10A8,8 0 0,0 14,18A8,8 0 0,0 22,10A8,8 0 0,0 14,2M4.93,5.82C3.08,7.34 2,9.61 2,12A8,8 0 0,0 10,20C10.64,20 11.27,19.92 11.88,19.77C10.12,19.38 8.5,18.5 7.17,17.29C5.22,16.25 4,14.21 4,12C4,11.7 4.03,11.41 4.07,11.11C4.03,10.74 4,10.37 4,10C4,8.56 4.32,7.13 4.93,5.82Z" /></svg>`;
/**
 * Author: Simran
 * Source: https://github.com/Templarian/MaterialDesign/blob/master/svg/owl.svg
 */
const owl_icon = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="height: 20px; width: auto" aria-hidden="true" focusable="false" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M12 16c.56.84 1.31 1.53 2.2 2L12 20.2L9.8 18c.89-.47 1.65-1.16 2.2-2m5-4.8a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m-10 0a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m10-2.5a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m-10 0a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4M2.24 1c1.76 3.7.49 6.46-.69 9.2c-.36.8-.55 1.63-.55 2.5a6 6 0 0 0 6 6c.21-.01.42-.02.63-.05l2.96 2.96L12 23l1.41-1.39l2.96-2.96c.21.03.42.04.63.05a6 6 0 0 0 6-6c0-.87-.19-1.7-.55-2.5C21.27 7.46 20 4.7 21.76 1c-2.64 2.06-6.4 3.69-9.76 3.7C8.64 4.69 4.88 3.06 2.24 1z"/></svg>`;
const graphol_icon = w `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 12 12" fill="currentColor" xml:space="preserve" style="height: 20px; width: 20px; box-sizing: border-box; padding: 2px;"><path id="path847" d="M5.4,11.9c-1.4-0.1-2.7-0.8-3.8-1.8c-0.8-0.8-1.3-1.8-1.6-3C0.1,6.8,0.1,6.7,0.1,6c0-0.7,0-0.8,0.1-1.1 c0.3-1.2,0.8-2.3,1.7-3.1C2.3,1.3,2.7,1,3.3,0.7c1.7-0.9,3.8-0.9,5.5,0c2.4,1.3,3.6,3.9,3.1,6.5c-0.6,2.6-2.8,4.5-5.5,4.7 C5.8,12,5.8,12,5.4,11.9L5.4,11.9z M6.5,10.5c0.2-0.1,0.3-0.1,0.8-0.7c0.3-0.3,1.2-1.2,2-1.9c1.1-1.1,1.3-1.4,1.4-1.5 c0.2-0.4,0.2-0.7,0-1.1c-0.1-0.2-0.2-0.3-1-1.1c-1-1-1.1-1-1.6-1c-0.5,0-0.5,0-1.9,1.4C5.5,5.2,5,5.8,5,5.8c0,0,0.2,0.3,0.5,0.6 L6,6.9l1-1l1-1l0.5,0.5l0.5,0.5L7.6,7.4L6,8.9L4.5,7.4L2.9,5.8L5,3.7c1.1-1.1,2.1-2.1,2.1-2.1c0-0.1-1-1-1-1c0,0-1,1-2.3,2.2 c-2,2-2.3,2.3-2.3,2.4C1.3,5.5,1.3,5.7,1.3,6c0.1,0.4,0,0.4,2.1,2.4c1.1,1.1,1.9,1.9,2,2C5.7,10.6,6.1,10.6,6.5,10.5z"/></svg>`;
const tune = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M3.375 15.625Q3.104 15.625 2.906 15.427Q2.708 15.229 2.708 14.958Q2.708 14.688 2.906 14.49Q3.104 14.292 3.375 14.292H6.792Q7.062 14.292 7.26 14.49Q7.458 14.688 7.458 14.958Q7.458 15.229 7.26 15.427Q7.062 15.625 6.792 15.625ZM3.375 5.708Q3.104 5.708 2.906 5.51Q2.708 5.312 2.708 5.042Q2.708 4.771 2.906 4.573Q3.104 4.375 3.375 4.375H9.896Q10.167 4.375 10.365 4.573Q10.562 4.771 10.562 5.042Q10.562 5.312 10.365 5.51Q10.167 5.708 9.896 5.708ZM10.083 17.292Q9.812 17.292 9.615 17.094Q9.417 16.896 9.417 16.625V13.312Q9.417 13.042 9.615 12.844Q9.812 12.646 10.083 12.646Q10.354 12.646 10.552 12.844Q10.75 13.042 10.75 13.312V14.292H16.625Q16.896 14.292 17.094 14.49Q17.292 14.688 17.292 14.958Q17.292 15.229 17.094 15.427Q16.896 15.625 16.625 15.625H10.75V16.625Q10.75 16.896 10.552 17.094Q10.354 17.292 10.083 17.292ZM6.792 12.333Q6.521 12.333 6.323 12.135Q6.125 11.938 6.125 11.667V10.667H3.375Q3.104 10.667 2.906 10.469Q2.708 10.271 2.708 10Q2.708 9.729 2.906 9.531Q3.104 9.333 3.375 9.333H6.125V8.354Q6.125 8.083 6.323 7.885Q6.521 7.688 6.792 7.688Q7.062 7.688 7.26 7.885Q7.458 8.083 7.458 8.354V11.667Q7.458 11.938 7.26 12.135Q7.062 12.333 6.792 12.333ZM10.083 10.667Q9.812 10.667 9.615 10.469Q9.417 10.271 9.417 10Q9.417 9.729 9.615 9.531Q9.812 9.333 10.083 9.333H16.625Q16.896 9.333 17.094 9.531Q17.292 9.729 17.292 10Q17.292 10.271 17.094 10.469Q16.896 10.667 16.625 10.667ZM13.208 7.354Q12.938 7.354 12.74 7.156Q12.542 6.958 12.542 6.688V3.375Q12.542 3.104 12.74 2.906Q12.938 2.708 13.208 2.708Q13.479 2.708 13.677 2.906Q13.875 3.104 13.875 3.375V4.375H16.625Q16.896 4.375 17.094 4.573Q17.292 4.771 17.292 5.042Q17.292 5.312 17.094 5.51Q16.896 5.708 16.625 5.708H13.875V6.688Q13.875 6.958 13.677 7.156Q13.479 7.354 13.208 7.354Z"/></svg>`;
const settings_play = w `<svg style="width:20px;height:20px" viewBox="0 0 24 24"><path fill="currentColor" d="M13.54 22H10C9.75 22 9.54 21.82 9.5 21.58L9.13 18.93C8.5 18.68 7.96 18.34 7.44 17.94L4.95 18.95C4.73 19.03 4.46 18.95 4.34 18.73L2.34 15.27C2.21 15.05 2.27 14.78 2.46 14.63L4.57 12.97L4.5 12L4.57 11L2.46 9.37C2.27 9.22 2.21 8.95 2.34 8.73L4.34 5.27C4.46 5.05 4.73 4.96 4.95 5.05L7.44 6.05C7.96 5.66 8.5 5.32 9.13 5.07L9.5 2.42C9.54 2.18 9.75 2 10 2H14C14.25 2 14.46 2.18 14.5 2.42L14.87 5.07C15.5 5.32 16.04 5.66 16.56 6.05L19.05 5.05C19.27 4.96 19.54 5.05 19.66 5.27L21.66 8.73C21.79 8.95 21.73 9.22 21.54 9.37L19.43 11L19.5 12V12.19C19 12.07 18.5 12 18 12C17.83 12 17.66 12 17.5 12.03C17.5 11.41 17.4 10.79 17.2 10.2L19.31 8.65L18.56 7.35L16.15 8.39C15.38 7.5 14.32 6.86 13.12 6.62L12.75 4H11.25L10.88 6.61C9.68 6.86 8.62 7.5 7.85 8.39L5.44 7.35L4.69 8.65L6.8 10.2C6.4 11.37 6.4 12.64 6.8 13.8L4.68 15.36L5.43 16.66L7.86 15.62C8.63 16.5 9.68 17.14 10.87 17.38L11.24 20H12.35C12.61 20.75 13 21.42 13.54 22M15.96 12.36C16 12.24 16 12.12 16 12C16 9.79 14.21 8 12 8S8 9.79 8 12 9.79 16 12 16C12.12 16 12.24 16 12.36 15.96C12.97 14.29 14.29 12.97 15.96 12.36M12 14C10.9 14 10 13.11 10 12S10.9 10 12 10 14 10.9 14 12 13.11 14 12 14M16 15V21L21 18L16 15Z" /></svg>`;
const filterOff = w `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M16.021 16.5 2.438 2.917l.77-.771 13.584 13.583ZM3.208 5.417V4.333h1.73v1.084Zm2 3.895V8.229h3.646v1.083Zm3.396-3.895L7.521 4.333h9.271v1.084Zm-.396 7.812v-1.083h3.584v1.083ZM12.5 9.312l-1.083-1.083h3.375v1.083Z"/></svg>`;
const incremental = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="m10 13.458-1.083-2.416L6.5 9.958l2.417-1.083L10 6.458l1.083 2.417L13.5 9.958l-2.417 1.084Zm0 5.084q-2.354 0-4.323-1.188-1.969-1.187-3.177-3.271v2.709H1.417v-4.5h4.479v1.083H3.375q1.021 1.896 2.771 2.99 1.75 1.093 3.854 1.093 2.458 0 4.406-1.458 1.948-1.458 2.74-3.771l1.042.229q-.813 2.73-3.073 4.407-2.261 1.677-5.115 1.677ZM1.458 9.208q.125-1.354.604-2.52.48-1.167 1.355-2.209l.791.75q-.687.875-1.104 1.834-.416.958-.562 2.145ZM5.25 4.167l-.75-.771q1.021-.875 2.24-1.365 1.218-.489 2.51-.593v1.083q-1.083.125-2.104.552Q6.125 3.5 5.25 4.167Zm9.479 0q-.812-.667-1.864-1.105-1.053-.437-2.115-.541V1.438q1.312.083 2.521.583 1.208.5 2.229 1.375Zm2.709 5.041q-.146-1.146-.563-2.146-.417-1-1.104-1.833l.791-.771q.855 1 1.365 2.209.511 1.208.615 2.541Z"/></svg>`;
const refresh = w `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" /></svg>`;
const instancesIcon = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="padding: 1px;box-sizing: border-box;" height="18" width="18" viewBox="0 0 20 20" ><path d="M10 9q-3.062 0-5.031-.844Q3 7.312 3 6q0-1.229 2.062-2.115Q7.125 3 10 3q2.875 0 4.938.885Q17 4.771 17 6q0 1.312-1.969 2.156Q13.062 9 10 9Zm0 4q-2.979 0-4.99-.865Q3 11.271 3 10V8.042q0 .604.562 1.135.563.531 1.521.938.959.406 2.229.645Q8.583 11 10 11q1.417 0 2.688-.24 1.27-.239 2.229-.645.958-.407 1.521-.938Q17 8.646 17 8.042V10q0 1.271-2.01 2.135Q12.979 13 10 13Zm0 4q-2.917 0-4.958-.906Q3 15.188 3 13.896v-1.958q0 .604.573 1.156.573.552 1.542.979.968.427 2.239.677Q8.625 15 10 15t2.646-.25q1.271-.25 2.239-.677.969-.427 1.542-.979.573-.552.573-1.156v1.958q0 1.292-2.042 2.198Q12.917 17 10 17Z"/></svg>`;
const superHierarchies = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="3 2 14 18"><path d="M10 16q-1.667 0-2.833-1.167Q6 13.667 6 12q0-1.479.927-2.573.927-1.094 2.323-1.365V4.875L8.062 6.062 7 5l3-3 3 3-1.062 1.062-1.188-1.187v3.187q1.396.271 2.323 1.365Q14 10.521 14 12q0 1.667-1.167 2.833Q11.667 16 10 16Zm0-1.5q1.042 0 1.771-.729.729-.729.729-1.771 0-1.042-.729-1.771Q11.042 9.5 10 9.5q-1.042 0-1.771.729Q7.5 10.958 7.5 12q0 1.042.729 1.771.729.729 1.771.729Zm0-2.5Z"/></svg>`;
const subHierarchies = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="3 2 14 18"><path d="m10 18-3-3 1.062-1.062 1.188 1.187v-3.187q-1.396-.271-2.323-1.365Q6 9.479 6 8q0-1.667 1.167-2.833Q8.333 4 10 4q1.667 0 2.833 1.167Q14 6.333 14 8q0 1.479-.927 2.573-.927 1.094-2.323 1.365v3.187l1.188-1.187L13 15Zm0-7.5q1.042 0 1.771-.729Q12.5 9.042 12.5 8q0-1.042-.729-1.771Q11.042 5.5 10 5.5q-1.042 0-1.771.729Q7.5 6.958 7.5 8q0 1.042.729 1.771.729.729 1.771.729ZM10 8Z"/></svg>`;
const rubbishBin = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M6.5 17q-.625 0-1.062-.438Q5 16.125 5 15.5v-10H4V4h4V3h4v1h4v1.5h-1v10q0 .625-.438 1.062Q14.125 17 13.5 17Zm7-11.5h-7v10h7ZM8 14h1.5V7H8Zm2.5 0H12V7h-1.5Zm-4-8.5v10Z"/></svg>`;
const mastroEndpointIcon = w `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M3.542 9.25q-.563 0-.948-.396-.386-.396-.386-.937V5.542q0-.542.396-.938.396-.396.938-.396H11V9.25Zm0-1.083h6.375V5.292H3.542q-.104 0-.177.073t-.073.177v2.375q0 .104.073.177t.177.073Zm0 7.625q-.542 0-.938-.396-.396-.396-.396-.938v-2.375q0-.541.396-.937t.938-.396H12.5v5.042Zm0-1.084h7.875v-2.875H3.542q-.104 0-.177.073t-.073.177v2.375q0 .104.073.177t.177.073ZM14 15.792V9.25h-1.5V4.208h5.188L16.25 7.854h1.438Zm-9.896-2.021h1v-1h-1Zm0-6.542h1v-1h-1Zm-.812.938V5.292v2.875Zm0 6.541v-2.875 2.875Z"/></svg>`;
const entityIcons = {};
entityIcons[GrapholTypesEnum.CLASS] = classIcon;
entityIcons[GrapholTypesEnum.OBJECT_PROPERTY] = objectPropertyIcon;
entityIcons[GrapholTypesEnum.DATA_PROPERTY] = dataPropertyIcon;
entityIcons[GrapholTypesEnum.INDIVIDUAL] = individualIcon;
entityIcons[GrapholTypesEnum.CLASS_INSTANCE] = classInstanceIcon;

var grapholscapeLogo = y `<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" id="Livello_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 1024 792.6" style="enable-background:new 0 0 1024 792.6;" xml:space="preserve">
<style type="text/css">
	.st0{fill:url(#SVGID_1_);}
	.st1{fill:#FFFFFF;}
	.st2{enable-background:new    ;}
	.st3{fill:url(#SVGID_2_);}
</style>
<g>
	<g id="Logo">

			<radialGradient id="SVGID_1_" cx="502.1" cy="894.61" r="662.91" gradientTransform="matrix(1 0 0 1 12.76 -283.3)" gradientUnits="userSpaceOnUse">
			<stop  offset="0" style="stop-color:#5B86E5"/>
			<stop  offset="0.34" style="stop-color:#509CE2"/>
			<stop  offset="1" style="stop-color:#36D1DC"/>
		</radialGradient>
		<path class="st0" d="M512,506c-138.1,0-250-111.9-250-250c0-66.3,26.3-129.9,73.2-176.8c97.6-97.6,256-97.6,353.6,0
			s97.6,256,0,353.6C642,479.8,578.3,506.2,512,506z"/>
		<path class="st1" d="M512,11.9c134.8,0,244.1,109.3,244.1,244.2c0,98.1-58.7,186.6-149.1,224.8c-124.2,52.5-267.4-5.7-319.9-129.9
			S292.8,83.6,417,31.1C447.1,18.4,479.4,11.9,512,11.9 M512,0C370.6,0,256,114.6,256,256s114.6,256,256,256s256-114.6,256-256
			S653.4,0,512,0z"/>
		<path class="st1" d="M513.6,432c-12.4,0-24.4-4.9-33.1-13.7L344.1,282c-18.3-18.3-18.3-48,0-66.3L513.6,46.2l40.3,40.3
			L391.6,248.8l122,122l122-122L594.7,208l-81.2,81.1l-40.3-40.3l88.3-88.3c18.3-18.3,48-18.3,66.3,0l55.2,55.2
			c18.3,18.3,18.3,48,0,66.3L546.7,418.3C537.9,427.1,526,432,513.6,432z"/>
		<g class="st2">
			<path d="M83,594.8c5.3,0,10.2,0.3,14.7,0.8s8.9,1.3,13.1,2.2c4.2,1,8.2,2.1,12.1,3.5s7.9,2.9,11.9,4.5v12.6
				c-3.2-2-6.5-3.9-10.1-5.7s-7.4-3.3-11.6-4.7c-4.1-1.3-8.6-2.4-13.3-3.2c-4.7-0.8-9.8-1.2-15.3-1.2c-11.1,0-20.8,1.2-29.1,3.5
				s-15.2,5.7-20.6,10c-5.5,4.3-9.6,9.6-12.4,15.8c-2.7,6.2-4.1,13.2-4.1,21c0,7.3,1.3,14,4,20.1s6.8,11.4,12.2,15.8
				c5.5,4.4,12.3,7.9,20.5,10.4s17.8,3.7,28.9,3.7c4.3,0,8.6-0.2,12.9-0.5c4.2-0.3,8.3-0.8,12-1.3c3.8-0.5,7.2-1.1,10.3-1.7
				c3.1-0.6,5.7-1.3,7.9-2V664H80.7v-9.7h56.9v50.3c-4.1,1.4-8.3,2.7-12.4,3.8c-4.2,1.1-8.5,2-13,2.8c-4.5,0.7-9.1,1.3-13.9,1.7
				s-9.8,0.6-15.1,0.6c-10.8,0-20.7-1.2-30-3.6c-9.2-2.4-17.2-6.1-23.9-11s-12-11.1-15.9-18.5c-3.8-7.4-5.7-16.2-5.7-26.2
				c0-6.7,0.9-12.8,2.7-18.3s4.3-10.5,7.5-14.9s7.2-8.3,11.7-11.5c4.6-3.3,9.7-6,15.2-8.1c5.6-2.1,11.6-3.7,18-4.8
				C69.3,595.3,76,594.8,83,594.8z"/>
			<path d="M181.2,662.2v48.9h-10.4V596.8h56.9c8.7,0,16.2,0.7,22.4,2c6.2,1.4,11.3,3.4,15.3,6.2c4,2.7,6.9,6.2,8.7,10.3
				c1.8,4.1,2.7,8.9,2.7,14.4c0,8.5-2.2,15.4-6.7,20.5s-11.7,8.6-21.7,10.5l39,50.4h-13.1l-36.9-49.3c-1.6,0.1-3.1,0.2-4.7,0.2
				c-1.6,0.1-3.3,0.1-5,0.1L181.2,662.2L181.2,662.2z M266.1,629.7c0-4.9-0.9-8.8-2.6-11.9c-1.7-3-4.5-5.4-8.4-7s-9-2.8-15.3-3.4
				c-6.3-0.6-14-0.9-23.2-0.9h-35.5v45.9h35.1c9.2,0,16.9-0.3,23.2-0.8s11.5-1.6,15.4-3.2c3.9-1.6,6.8-3.9,8.5-6.9
				C265.3,638.6,266.1,634.6,266.1,629.7z"/>
			<path d="M417.4,711.2L401.7,681h-77.6l-15.7,30.2H297l59.8-114.3H369l59.8,114.3H417.4z M362.9,606.9l-33.8,64.6h67.5
				L362.9,606.9z"/>
			<path d="M562.8,632c0,5.7-0.9,10.8-2.8,15.1c-1.9,4.4-4.8,8.1-8.8,11.1s-9.1,5.3-15.4,6.8c-6.3,1.5-13.9,2.3-22.8,2.3h-51.3v43.9
				h-10.4V596.8H513c8.9,0,16.5,0.8,22.8,2.3s11.4,3.8,15.4,6.7s6.9,6.6,8.8,11C561.8,621.2,562.8,626.2,562.8,632z M552.1,632
				c0-5.4-0.9-9.8-2.7-13.1s-4.6-5.9-8.3-7.7s-8.5-3-14.2-3.6s-12.6-0.9-20.4-0.9h-44.7v50.9h44.7c3.1,0,6.3,0,9.8,0
				s6.9-0.1,10.3-0.5c3.4-0.4,6.6-1,9.7-1.9s5.8-2.3,8.2-4.2s4.2-4.4,5.7-7.4C551.4,640.5,552.1,636.6,552.1,632z"/>
			<path d="M703.6,711.2v-55.6H601.2v55.6h-10.4V596.8h10.4v49.3h102.4v-49.3H714v114.3h-10.4V711.2z"/>
			<path d="M889.7,654.1c0,10.3-1.9,19.1-5.6,26.6c-3.7,7.5-8.8,13.6-15.3,18.5s-14.1,8.4-23,10.8s-18.3,3.5-28.5,3.5
				c-10.3,0-19.8-1.2-28.7-3.5s-16.6-5.9-23.1-10.8c-6.5-4.9-11.7-11-15.4-18.5s-5.6-16.3-5.6-26.6c0-6.8,0.9-13,2.6-18.6
				c1.7-5.6,4.1-10.6,7.2-15c3.1-4.4,6.9-8.2,11.3-11.4c4.4-3.2,9.3-5.9,14.7-8s11.2-3.7,17.4-4.7s12.7-1.5,19.5-1.5
				c10.2,0,19.7,1.2,28.5,3.5s16.5,5.9,23,10.8c6.5,4.9,11.6,11,15.3,18.5C887.8,635,889.7,643.8,889.7,654.1z M879,654.1
				c0-8.1-1.3-15.3-4-21.5c-2.6-6.2-6.5-11.4-11.7-15.7c-5.2-4.2-11.6-7.5-19.3-9.7s-16.6-3.3-26.8-3.3s-19.1,1.1-26.9,3.3
				c-7.7,2.2-14.2,5.5-19.4,9.7s-9.2,9.5-11.8,15.7s-4,13.4-4,21.3c0,8.1,1.3,15.3,4,21.5s6.6,11.4,11.8,15.7
				c5.2,4.2,11.7,7.5,19.4,9.7s16.7,3.3,26.9,3.3s19.1-1.1,26.8-3.3s14.1-5.4,19.3-9.7c5.2-4.2,9.1-9.5,11.7-15.7
				C877.7,669.3,879,662.2,879,654.1z"/>
			<path d="M920.2,711.2V596.8h10.4v104.6h83.5v9.7h-93.9V711.2z"/>
		</g>

			<radialGradient id="SVGID_2_" cx="513.05" cy="1101.48" r="466.86" gradientTransform="matrix(1 0 0 1 0 -286)" gradientUnits="userSpaceOnUse">
			<stop  offset="0" style="stop-color:#5B86E5"/>
			<stop  offset="0.34" style="stop-color:#509CE2"/>
			<stop  offset="1" style="stop-color:#36D1DC"/>
		</radialGradient>
		<path class="st3" d="M389.9,700.8h244.3c16.8,0,30.4,13.6,30.4,30.4v27.4c0,16.8-13.6,30.4-30.4,30.4H389.9
			c-16.8,0-30.4-13.6-30.4-30.4v-27.4C359.4,714.4,373,700.8,389.9,700.8L389.9,700.8L389.9,700.8z"/>
		<path class="st1" d="M634.2,704.3c14.8,0,26.8,12,26.8,26.9v27.4c0,14.8-12,26.9-26.9,26.9l0,0H389.9c-14.8,0-26.9-12-26.9-26.9
			v-27.4c0-14.8,12-26.9,26.9-26.9l0,0H634.2 M634.2,697.2H389.9c-18.8,0-34,15.2-34,34v27.4c0,18.8,15.2,34,34,34h244.3
			c18.8,0,34-15.2,34-34v-27.4C668.2,712.4,652.9,697.2,634.2,697.2L634.2,697.2z"/>
		<g class="st2">
			<path class="st1" d="M385,764.8c-3.7-0.9-6.6-2-8.6-3.3l3-4c2.1,1.2,4.7,2.2,7.8,3c3.1,0.8,6.4,1.2,9.8,1.2
				c4.5,0,7.9-0.5,10.1-1.6c2.2-1.1,3.3-2.6,3.3-4.5c0-1.4-0.6-2.4-1.8-3.2c-1.2-0.8-2.7-1.4-4.5-1.8c-1.8-0.4-4.2-0.8-7.3-1.2
				c-4-0.6-7.3-1.1-9.7-1.7c-2.5-0.6-4.5-1.6-6.3-3c-1.7-1.4-2.6-3.4-2.6-5.9c0-3.1,1.7-5.7,5.2-7.7c3.5-2,8.3-3,14.4-3
				c3.2,0,6.4,0.3,9.6,1c3.2,0.6,5.9,1.5,7.9,2.5l-2.9,4c-4.1-2.1-9-3.2-14.6-3.2c-4.3,0-7.5,0.6-9.7,1.7c-2.2,1.1-3.3,2.6-3.3,4.5
				c0,1.4,0.6,2.6,1.8,3.4c1.2,0.9,2.8,1.5,4.6,1.9c1.8,0.4,4.3,0.8,7.6,1.2c4,0.6,7.1,1.1,9.5,1.7c2.4,0.6,4.4,1.5,6.1,2.9
				s2.5,3.3,2.5,5.7c0,3.3-1.8,5.9-5.4,7.8c-3.6,1.9-8.6,2.9-15.1,2.9C392.6,766.1,388.7,765.7,385,764.8z"/>
			<path class="st1" d="M436.9,763.7c-3.9-1.6-6.9-3.9-9.1-6.8c-2.2-2.9-3.3-6.2-3.3-9.8c0-3.6,1.1-6.9,3.3-9.8
				c2.2-2.9,5.2-5.1,9.1-6.7c3.9-1.6,8.3-2.4,13.2-2.4c4.3,0,8.1,0.6,11.5,1.9c3.4,1.3,6,3.1,8,5.5l-5,2.6c-1.6-1.8-3.7-3.2-6.2-4.2
				c-2.5-0.9-5.3-1.4-8.2-1.4c-3.6,0-6.8,0.6-9.7,1.8c-2.9,1.2-5.1,2.9-6.7,5.1s-2.4,4.8-2.4,7.6c0,2.9,0.8,5.4,2.4,7.6
				c1.6,2.2,3.8,3.9,6.7,5.1c2.9,1.2,6.1,1.8,9.7,1.8c3,0,5.7-0.4,8.2-1.3c2.5-0.9,4.6-2.3,6.2-4.1l5,2.6c-2,2.4-4.6,4.2-8,5.5
				c-3.4,1.3-7.2,1.9-11.4,1.9C445.1,766.1,440.7,765.3,436.9,763.7z"/>
			<path class="st1" d="M514.9,731.8c3.5,2.4,5.2,6,5.2,10.8v23.1h-6.4v-5.8c-1.5,1.9-3.7,3.5-6.7,4.5c-2.9,1.1-6.4,1.6-10.4,1.6
				c-5.5,0-9.9-1-13.2-3c-3.3-2-4.9-4.6-4.9-7.9c0-3.2,1.5-5.7,4.6-7.7c3.1-1.9,7.9-2.9,14.6-2.9h15.8v-2.3c0-3.2-1.2-5.7-3.6-7.3
				c-2.4-1.7-5.9-2.5-10.5-2.5c-3.1,0-6.2,0.4-9.1,1.2c-2.9,0.8-5.4,1.9-7.5,3.2l-3-3.8c2.5-1.6,5.5-2.9,9.1-3.7
				c3.5-0.9,7.2-1.3,11.1-1.3C506.5,728.1,511.5,729.3,514.9,731.8z M507.4,760.2c2.7-1.3,4.7-3.2,6-5.6v-6.1h-15.6
				c-8.5,0-12.7,2.2-12.7,6.7c0,2.2,1.1,3.9,3.3,5.1c2.2,1.3,5.3,1.9,9.3,1.9C501.4,762.1,504.7,761.5,507.4,760.2z"/>
			<path class="st1" d="M576.6,730.5c3.8,1.6,6.7,3.8,8.9,6.7c2.1,2.9,3.2,6.2,3.2,9.9c0,3.7-1.1,7.1-3.2,9.9
				c-2.1,2.9-5.1,5.1-8.8,6.7c-3.7,1.6-8,2.4-12.7,2.4c-4,0-7.7-0.6-10.9-1.9c-3.2-1.3-5.9-3.1-8-5.5v20.8h-6.7v-51.1h6.4v7.4
				c2-2.5,4.7-4.4,8-5.7s7-2,11.2-2C568.6,728.1,572.8,728.9,576.6,730.5z M572.9,759.8c2.8-1.2,5.1-2.9,6.7-5.1
				c1.6-2.2,2.4-4.8,2.4-7.6s-0.8-5.4-2.4-7.6c-1.6-2.2-3.8-3.9-6.7-5.1c-2.8-1.2-6-1.8-9.4-1.8c-3.5,0-6.7,0.6-9.5,1.8
				c-2.8,1.2-5,2.9-6.6,5.1s-2.4,4.7-2.4,7.6s0.8,5.4,2.4,7.6c1.6,2.2,3.8,3.9,6.6,5.1s6,1.8,9.5,1.8
				C566.9,761.6,570.1,761,572.9,759.8z"/>
			<path class="st1" d="M645.6,748.6h-41.5c0.4,3.9,2.4,7,5.9,9.4c3.6,2.4,8.1,3.6,13.6,3.6c3.1,0,5.9-0.4,8.5-1.2
				c2.6-0.8,4.8-2,6.7-3.7l3.8,3.3c-2.2,2-5,3.5-8.3,4.5c-3.3,1-6.9,1.6-10.9,1.6c-5.1,0-9.6-0.8-13.6-2.5c-3.9-1.6-7-3.9-9.2-6.8
				c-2.2-2.9-3.3-6.2-3.3-9.8c0-3.6,1.1-6.9,3.2-9.8c2.1-2.9,5-5.1,8.7-6.7c3.7-1.6,7.8-2.4,12.4-2.4c4.6,0,8.7,0.8,12.4,2.4
				c3.7,1.6,6.5,3.8,8.6,6.7c2.1,2.9,3.1,6.1,3.1,9.8L645.6,748.6z M609.6,735.9c-3.2,2.3-5.1,5.3-5.5,9h35.2
				c-0.4-3.7-2.3-6.7-5.5-9c-3.2-2.3-7.3-3.4-12.1-3.4C616.8,732.5,612.8,733.6,609.6,735.9z"/>
		</g>
	</g>
</g>
</svg>`;

var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    classIcon: classIcon,
    objectPropertyIcon: objectPropertyIcon,
    dataPropertyIcon: dataPropertyIcon,
    individualIcon: individualIcon,
    grapholscapeLogo: grapholscapeLogo,
    diagrams: diagrams,
    triangle_up: triangle_up,
    triangle_down: triangle_down,
    arrow_right: arrow_right,
    arrowDown: arrowDown,
    explore: explore,
    info_outline: info_outline,
    enterFullscreen: enterFullscreen,
    exitFullscreen: exitFullscreen,
    centerDiagram: centerDiagram,
    filter: filter,
    bubbles: bubbles,
    lite: lite,
    settings_icon: settings_icon,
    infoFilled: infoFilled,
    plus: plus,
    minus: minus,
    save: save,
    lock_open: lock_open,
    close: close,
    blankSlateDiagrams: blankSlateDiagrams,
    check: check,
    searchOff: searchOff,
    move_bubbles: move_bubbles,
    owl_icon: owl_icon,
    graphol_icon: graphol_icon,
    tune: tune,
    settings_play: settings_play,
    filterOff: filterOff,
    incremental: incremental,
    refresh: refresh,
    instancesIcon: instancesIcon,
    superHierarchies: superHierarchies,
    subHierarchies: subHierarchies,
    rubbishBin: rubbishBin,
    mastroEndpointIcon: mastroEndpointIcon,
    entityIcons: entityIcons
});

function getIconSlot (slotName, icon) {
    const span = document.createElement('span');
    span.innerHTML = icon.strings[0];
    span.setAttribute('slot', slotName);
    return span;
}

var _a, _b, _c, _d;
class GscapeEntitySearch extends DropPanelMixin(s) {
    constructor() {
        super(...arguments);
        this.areAllFiltersDisabled = true;
        this[_a] = 0;
        this[_b] = 0;
        this[_c] = 0;
        this[_d] = 0;
    }
    render() {
        var _e, _f, _g, _h;
        return y `
      <div class="search-box">
        <input @keyup=${this.handleSearch} type="text" placeholder="Search IRI, labels...">
        ${this.atLeastTwoFilters
            ? y `
              <gscape-button size="m" title="Show/Hide filters" @click=${this.togglePanel}>
                ${getIconSlot('icon', filter)}
              </gscape-button>
            `
            : null}
      </div>
      <div id="drop-panel" class="hide">
        <gscape-entity-type-filter
          class=${(_e = this[GrapholTypesEnum.CLASS]) !== null && _e !== void 0 ? _e : b}
          object-property=${(_f = this[GrapholTypesEnum.OBJECT_PROPERTY]) !== null && _f !== void 0 ? _f : b}
          data-property=${(_g = this[GrapholTypesEnum.DATA_PROPERTY]) !== null && _g !== void 0 ? _g : b}
          individual=${(_h = this[GrapholTypesEnum.INDIVIDUAL]) !== null && _h !== void 0 ? _h : b}
        ></gscape-entity-type-filter>
      </div>
      
    `;
    }
    handleSearch(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputElement = e.currentTarget;
            if (!inputElement)
                return;
            if (e.key === 'Escape') {
                inputElement.blur();
                inputElement.value = '';
            }
            yield this.updateComplete;
            this.dispatchEvent(new CustomEvent('onsearch', {
                bubbles: true,
                composed: true,
                detail: { searchText: inputElement.value }
            }));
        });
    }
    get atLeastTwoFilters() {
        let count = 0;
        if (this[GrapholTypesEnum.CLASS] !== undefined)
            count++;
        if (this[GrapholTypesEnum.OBJECT_PROPERTY] !== undefined)
            count++;
        if (this[GrapholTypesEnum.DATA_PROPERTY] !== undefined)
            count++;
        if (this[GrapholTypesEnum.INDIVIDUAL] !== undefined)
            count++;
        return count >= 2;
    }
}
_a = GrapholTypesEnum.CLASS, _b = GrapholTypesEnum.DATA_PROPERTY, _c = GrapholTypesEnum.OBJECT_PROPERTY, _d = GrapholTypesEnum.INDIVIDUAL;
GscapeEntitySearch.properties = {
    [GrapholTypesEnum.CLASS]: { type: Number, reflect: true },
    [GrapholTypesEnum.DATA_PROPERTY]: { type: Number, reflect: true },
    [GrapholTypesEnum.OBJECT_PROPERTY]: { type: Number, reflect: true },
    [GrapholTypesEnum.INDIVIDUAL]: { type: Number, reflect: true }
};
GscapeEntitySearch.styles = [
    baseStyle,
    GscapeButtonStyle,
    i$1 `
      :host {
        display: block;
        padding: 8px;
      }

      .chips-filters {
        margin-top: 4px;
        white-space: normal;
        min-width: 295px;
      }

      .chip[entity-type = "class"] {
        color: var(--gscape-color-class-contrast);
        border-color: var(--gscape-color-class-contrast);
      }

      .chip[entity-type = "data-property"] {
        color: var(--gscape-color-data-property-contrast);
        border-color: var(--gscape-color-data-property-contrast);
      }

      .chip[entity-type = "object-property"] {
        color: var(--gscape-color-object-property-contrast);
        border-color: var(--gscape-color-object-property-contrast);
      }

      .chip[entity-type = "individual"] {
        color: var(--gscape-color-individual-contrast);
        border-color: var(--gscape-color-individual-contrast);
      }

      .chip {
        line-height: 0;
        gap: 4px;
        align-items: center;
        background: inherit;
      }

      .chip.disabled {
        opacity: 0.4;
      }

      .chip:hover {
        opacity: 1;
      }

      .chip.disabled:hover {
        opacity: 0.4;
      }

      .search-box {
        display: flex;
        align-items: center;
        gap: 2px;
      }

      input {
        width: unset;
        flex-grow: 2;
      }
    `
];
customElements.define('gscape-entity-search', GscapeEntitySearch);

class GscapeEntityTypeFilters extends BaseMixin(s) {
    render() {
        return y `
      <div class="chips-filters">
        ${this[GrapholTypesEnum.CLASS] !== undefined
            ? y `
              <span 
                class="chip actionable ${this[GrapholTypesEnum.CLASS] && !this.areAllFiltersDisabled ? null : 'disabled'}" 
                entity-type="class" 
                @click=${this._handleFilterStateChange}
              >
                ${classIcon} Classes
              </span>
            `
            : null}

        ${this[GrapholTypesEnum.DATA_PROPERTY] !== undefined
            ? y `
              <span 
                class="chip actionable ${this[GrapholTypesEnum.DATA_PROPERTY] && !this.areAllFiltersDisabled ? null : 'disabled'}"
                entity-type="data-property"
                @click=${this._handleFilterStateChange}
              >
                ${dataPropertyIcon} Data Properties
              </span>
            `
            : null}

        ${this[GrapholTypesEnum.OBJECT_PROPERTY] !== undefined
            ? y `
              <span 
                class="chip actionable ${this[GrapholTypesEnum.OBJECT_PROPERTY] && !this.areAllFiltersDisabled ? null : 'disabled'}"
                entity-type="object-property"
                @click=${this._handleFilterStateChange}
              >
                ${objectPropertyIcon} Object Properties
              </span>
            `
            : null}

        ${this[GrapholTypesEnum.INDIVIDUAL] !== undefined
            ? y `
              <span 
                class="chip actionable ${this[GrapholTypesEnum.INDIVIDUAL] && !this.areAllFiltersDisabled ? null : 'disabled'}"
                entity-type="individual"
                @click=${this._handleFilterStateChange}
              >
                ${individualIcon} Individual
              </span>`
            : null}
      </div>
    `;
    }
    _handleFilterStateChange(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityType = e.currentTarget.getAttribute('entity-type');
            if (this[entityType] !== undefined) {
                this[entityType] = !this[entityType];
                yield this.updateComplete;
                this.dispatchEvent(new CustomEvent('onentityfilterchange', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        [GrapholTypesEnum.CLASS]: this[GrapholTypesEnum.CLASS],
                        [GrapholTypesEnum.DATA_PROPERTY]: this[GrapholTypesEnum.DATA_PROPERTY],
                        [GrapholTypesEnum.OBJECT_PROPERTY]: this[GrapholTypesEnum.OBJECT_PROPERTY],
                        [GrapholTypesEnum.INDIVIDUAL]: this[GrapholTypesEnum.INDIVIDUAL],
                        areAllFiltersDisabled: this.areAllFiltersDisabled
                    }
                }));
            }
        });
    }
    get areAllFiltersDisabled() {
        let result = true;
        if (this[GrapholTypesEnum.CLASS] !== undefined) {
            result = result && !this[GrapholTypesEnum.CLASS];
        }
        if (this[GrapholTypesEnum.OBJECT_PROPERTY] !== undefined) {
            result = result && !this[GrapholTypesEnum.OBJECT_PROPERTY];
        }
        if (this[GrapholTypesEnum.DATA_PROPERTY] !== undefined) {
            result = result && !this[GrapholTypesEnum.DATA_PROPERTY];
        }
        if (this[GrapholTypesEnum.INDIVIDUAL] !== undefined) {
            result = result && !this[GrapholTypesEnum.INDIVIDUAL];
        }
        return result;
    }
    set [GrapholTypesEnum.CLASS](v) {
        this._class = v;
        this.requestUpdate();
    }
    get [GrapholTypesEnum.CLASS]() { return this._class; }
    set [GrapholTypesEnum.DATA_PROPERTY](v) {
        this._dataproperty = v;
        this.requestUpdate();
    }
    get [GrapholTypesEnum.DATA_PROPERTY]() { return this._dataproperty; }
    set [GrapholTypesEnum.OBJECT_PROPERTY](v) {
        this._objectproperty = v;
        this.requestUpdate();
    }
    get [GrapholTypesEnum.OBJECT_PROPERTY]() { return this._objectproperty; }
    set [GrapholTypesEnum.INDIVIDUAL](v) {
        this._individual = v;
        this.requestUpdate();
    }
    get [GrapholTypesEnum.INDIVIDUAL]() { return this._individual; }
}
GscapeEntityTypeFilters.properties = {
    [GrapholTypesEnum.CLASS]: { type: Number, reflect: true },
    [GrapholTypesEnum.DATA_PROPERTY]: { type: Number, reflect: true },
    [GrapholTypesEnum.OBJECT_PROPERTY]: { type: Number, reflect: true },
    [GrapholTypesEnum.INDIVIDUAL]: { type: Number, reflect: true },
    onFilterToggle: { type: Function, reflect: true }
};
GscapeEntityTypeFilters.styles = [
    baseStyle,
    GscapeButtonStyle,
    i$1 `
      .chips-filters {
        margin-top: 4px;
        white-space: normal;
        min-width: 295px;
      }

      .chip[entity-type = "class"] {
        color: var(--gscape-color-class-contrast);
        border-color: var(--gscape-color-class-contrast);
      }

      .chip[entity-type = "data-property"] {
        color: var(--gscape-color-data-property-contrast);
        border-color: var(--gscape-color-data-property-contrast);
      }

      .chip[entity-type = "object-property"] {
        color: var(--gscape-color-object-property-contrast);
        border-color: var(--gscape-color-object-property-contrast);
      }

      .chip[entity-type = "individual"] {
        color: var(--gscape-color-individual-contrast);
        border-color: var(--gscape-color-individual-contrast);
      }

      .chip {
        line-height: 0;
        gap: 4px;
        align-items: center;
        background: inherit;
      }

      .chip.disabled {
        opacity: 0.4;
      }

      .chip:hover {
        opacity: 1;
      }

      .chip.disabled:hover {
        opacity: 0.4;
      }
    `
];
customElements.define('gscape-entity-type-filter', GscapeEntityTypeFilters);

var emptySearchBlankState = y `
  <div class="blank-slate">
    ${searchOff}
    <div class="header">Can't find any entity</div>
    <div class="description">Please try again with another search text.</div>
  </div>
`;

function getEntityViewOccurrences (grapholEntity, grapholscape) {
    var _a, _b;
    const result = new Map();
    (_a = grapholEntity.occurrences.get(RendererStatesEnum.GRAPHOL)) === null || _a === void 0 ? void 0 : _a.forEach(occurrence => {
        addOccurrenceViewData(occurrence);
    });
    if (grapholscape.renderState && grapholscape.renderState !== RendererStatesEnum.GRAPHOL) {
        (_b = grapholEntity.occurrences.get(grapholscape.renderState)) === null || _b === void 0 ? void 0 : _b.forEach((occurrence) => {
            addOccurrenceViewData(occurrence);
        });
    }
    return result;
    function addOccurrenceViewData(occurrence) {
        var _a, _b, _c;
        if (!grapholscape.renderState)
            return;
        const diagram = grapholscape.ontology.getDiagram(occurrence.diagramId) || grapholscape.renderer.diagram;
        const cyElement = (_b = (_a = diagram === null || diagram === void 0 ? void 0 : diagram.representations.get(grapholscape.renderState)) === null || _a === void 0 ? void 0 : _a.cy) === null || _b === void 0 ? void 0 : _b.$id(occurrence.elementId);
        if (diagram && cyElement && !cyElement.empty()) {
            /**
             * In case of repositioned or transformed elements, show the original id
             */
            const occurrenceIdViewData = {
                realId: occurrence.elementId,
                originalId: cyElement.data().originalId,
            };
            const diagramViewData = { id: diagram.id, name: diagram.name };
            if (!result.get(diagramViewData)) {
                result.set(diagramViewData, []);
            }
            (_c = result.get(diagramViewData)) === null || _c === void 0 ? void 0 : _c.push(occurrenceIdViewData);
            // for (let [diagramViewData, occurrencesIdViewData] of result.entries()) {
            //   if (diagramViewData.id === diagram.id) {
            //     occurrencesIdViewData.push(occurrenceIdViewData)
            //     break
            //   }
            // }
        }
    }
}
function getEntityOccurrencesTemplate(occurrences, onNodeNavigation) {
    function nodeNavigationHandler(e) {
        var _a;
        const target = e.target;
        const diagramId = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.getAttribute('diagram-id');
        const elementId = target.getAttribute('real-id');
        if (!diagramId || !elementId)
            return;
        onNodeNavigation({
            diagramId: parseInt(diagramId),
            elementId: elementId
        });
    }
    return y `
  ${Array.from(occurrences).map(([diagram, occurrencesIds]) => {
        return y `
      <div diagram-id="${diagram.id}">
        <span class="diagram-name">${diagram.name}</span>
        ${occurrencesIds.map(occurrenceId => y `
          <gscape-button
            label="${occurrenceId.originalId || occurrenceId.realId}"
            real-id="${occurrenceId.realId}"
            type="subtle"
            size="s"
            @click=${nodeNavigationHandler}
          ></gscape-button>
        `)}
      </div>
    `;
    })}
  `;
}

function createEntitiesList(grapholscape, entityFilters) {
    const result = [];
    grapholscape.ontology.entities.forEach(entity => {
        if (!entityFilters || (entityFilters[entity.type] !== undefined && (entityFilters[entity.type] || entityFilters.areAllFiltersDisabled))) {
            result.push({
                displayedName: entity.getDisplayedName(grapholscape.entityNameType, grapholscape.language, grapholscape.ontology.languages.default),
                value: entity,
                viewOccurrences: getEntityViewOccurrences(entity, grapholscape)
            });
        }
    });
    return result.sort((a, b) => a.displayedName.localeCompare(b.displayedName));
}
function search(searchValue, entities) {
    const searchWords = searchValue.split(' ');
    return entities.filter(entity => {
        let isAmatch = true;
        for (const word of searchWords) {
            if (word.length <= 2)
                continue;
            isAmatch = isAmatch && (matchInIRI(entity.value.iri, word) ||
                matchInAnnotations(entity.value.getAnnotations(), word));
        }
        return isAmatch;
    });
    function matchInIRI(iri, searchValue) {
        return isMatch(iri.fullIri, searchValue) || isMatch(iri.prefixed, searchValue);
    }
    function matchInAnnotations(annotations, searchValue) {
        // search in labels defined in annotations (only for Graphol v3)
        for (const annotation of annotations) {
            return isMatch(annotation.lexicalForm, searchValue);
        }
        return false; // only if no language has a match
    }
    function isMatch(value1, value2) { return value1.toLowerCase().includes(value2.toLowerCase()); }
}

var entityListItemStyle = i$1 `
  div.entity-list-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
  }

  .entity-list-item {
    white-space: nowrap;
  }

  div.entity-list-item > .entity-icon {
    flex-shrink: 0;
  }

  details.entity-list-item > summary::marker {
    display: inline-block;
  }

  details.entity-list-item > summary > .entity-icon {
    position: absolute;
  }

  details.entity-list-item > summary > .entity-name {
    margin-left: 24px;
    line-height: 18px;
  }

  details.entity-list-item > .summary-body {
    background-color: var(--gscape-color-bg-inset);
    white-space: normal;
    padding: 4px 8px;
  }

  details.entity-list-item[open] {
    border: solid 1px var(--gscape-color-border-subtle);
    border-radius: var(--gscape-border-radius);
    margin-bottom: 8px;
  }
`;

class GscapeExplorer extends DropPanelMixin(BaseMixin(s)) {
    constructor() {
        super();
        this.title = 'Ontology Explorer';
        // search: (e:any) => void = () => { }
        // filterEntities: (entityFilters: IEntityFilters) => void = () => { }
        this.onNodeNavigation = () => { };
        this.closePanel = () => {
            var _a;
            super.closePanel();
            (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.entity-list-item[open]').forEach(item => item.open = false);
        };
        this.classList.add(BOTTOM_RIGHT_WIDGET.toString());
        this.addEventListener('onsearch', (e) => {
            if (e.detail.searchText.length > 2) {
                this.shownEntities = search(e.detail.searchText, this.shownEntities);
            }
            else {
                this.shownEntities = this.entities;
            }
        });
    }
    render() {
        return y `
    <gscape-button type="subtle" @click=${this.togglePanel}>
      <span slot="icon">${explore}</span>
    </gscape-button>

    <div class="gscape-panel gscape-panel-in-tray hide" id="drop-panel">
      <div class="header">${this.title}</div>
      <div class="content-wrapper">
        <gscape-entity-search></gscape-entity-search>
        <!-- <gscape-entity-type-filter></gscape-entity-type-filter> -->

        <div class="list-wrapper">

          ${this.shownEntities.length === 0
            ? emptySearchBlankState
            : null}

          ${this.shownEntities.map(entity => {
            return y `
              <details class="ellipsed entity-list-item" title="${entity.displayedName}">
                <summary class="actionable">
                  <span class="entity-icon" title="${entity.value.type}">${entityIcons[entity.value.type]}</span>
                  <span class="entity-name">${entity.displayedName}</span>
                </summary>
                <div class="summary-body">
                  ${entity.viewOccurrences && entity.viewOccurrences.size > 0
                ? getEntityOccurrencesTemplate(entity.viewOccurrences, this.onNodeNavigation)
                : null}
                </div>
              </details>
            `;
        })}
        </div>
      </div>
    </div>
    `;
    }
    get entities() { return this._entities; }
    set entities(newEntities) {
        this._entities = this.shownEntities = newEntities;
    }
    get searchEntityComponent() { var _a; return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('gscape-entity-search'); }
}
// onSearch: (e: KeyboardEvent) => void
// onEntityFilterToggle: () => void
GscapeExplorer.properties = {
    entities: { type: Object, attribute: false },
    shownEntities: { type: Object, attribute: false }
};
GscapeExplorer.styles = [
    entityListItemStyle,
    baseStyle,
    i$1 `
      :host {
        order: 6;
        margin-top:10px;
      }      

      [diagram-id] > gscape-button {
        color: var(--gscape-color-accent);
      }

      .filter-box {
        padding: 8px;
      }

      .gscape-panel-in-tray {
        height: 350px;
        min-width: 200px;
      }

      .gscape-panel-in-tray > .content-wrapper {
        padding: 0;
        display: flex;
        flex-direction: column;
        max-height: 328px;
      }

      .blank-slate {
        white-space: normal;
        transform: translateY(40%);
      }

      .list-wrapper {
        position: relative;
        overflow: hidden auto;
        padding: 0px 8px;
        scrollbar-width: inherit;
        height: 100%;
      }

      .content-wrapper {
        height: 100%;
      }
    `
];
customElements.define('gscape-explorer', GscapeExplorer);

function init$a (ontologyExplorerComponent, grapholscape) {
    // let languages = grapholscape.languages
    ontologyExplorerComponent.entities = createEntitiesList(grapholscape);
    // ontologyExplorerComponent.onToggleBody = closeAllSubRows.bind(this)
    ontologyExplorerComponent.onNodeNavigation = (entityOccurrence) => {
        grapholscape.centerOnElement(entityOccurrence.elementId, entityOccurrence.diagramId, 1.2);
        grapholscape.selectElement(entityOccurrence.elementId);
    };
    ontologyExplorerComponent.addEventListener('onentityfilterchange', (e) => {
        ontologyExplorerComponent.entities = createEntitiesList(grapholscape, e.detail);
    });
    grapholscape.on(LifecycleEvent.RendererChange, () => {
        ontologyExplorerComponent.entities = createEntitiesList(grapholscape, ontologyExplorerComponent.searchEntityComponent);
    });
}

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
function initOntologyExplorer(grapholscape) {
    const ontologyExplorerComponent = new GscapeExplorer();
    init$a(ontologyExplorerComponent, grapholscape);
    grapholscape.widgets.set(WidgetEnum.ONTOLOGY_EXPLORER, ontologyExplorerComponent);
}

function init$9(entitySelectorComponent, grapholscape) {
    // Set class entity list
    let entities = createEntitiesList(grapholscape, { class: 1, areAllFiltersDisabled: false });
    entitySelectorComponent.entityList = entities;
    if (grapholscape.renderState !== RendererStatesEnum.INCREMENTAL) {
        entitySelectorComponent.hide();
    }
    // grapholscape.on(LifecycleEvent.RendererChange, (newRendererState) => {
    //   if (newRendererState === RendererStatesEnum.INCREMENTAL && grapholscape.renderer.grapholElements?.size === 0) {
    //     entitySelectorComponent.show()
    //   }
    // })
    grapholscape.on(LifecycleEvent.EntityNameTypeChange, () => {
        entities = createEntitiesList(grapholscape, { class: 1, areAllFiltersDisabled: false });
        entitySelectorComponent.entityList = entities;
    });
}

class GscapeEntitySelector extends BaseMixin(s) {
    static get properties() {
        return {
            entityList: { type: Object, attribute: false },
        };
    }
    constructor() {
        super();
        this.title = 'Class Selector';
        this.fullEntityList = [];
        this._entityList = [];
    }
    render() {
        return y `
      <div class="gscape-panel ellipsed">
        <div class="header">${this.title}</div>
        <div class="content-wrapper">
        <input @keyup=${this.handleSearch} type="text" placeholder="Search a class by IRI, labels...">

          <div class="list-wrapper">
            ${this.entityList.map(entityItem => {
            return y `
                <gscape-action-list-item
                  type="subtle"
                  label=${entityItem.displayedName}
                  iri=${entityItem.value.iri.prefixed}
                  @click=${this.handleEntitySelection}
                ></gscape-action-list-item>
              `;
        })}

            ${this.entityList.length === 0
            ? emptySearchBlankState
            : null}
          </div>
        </div>
      </div>
    `;
    }
    // override blur to avoid collapsing when clicking on cytoscape's canvas
    blur() { }
    handleEntitySelection(evt) {
        const iri = evt.target.getAttribute('iri');
        if (iri)
            this.onClassSelectionCallback(iri);
    }
    handleSearch(e) {
        var _a;
        const inputElement = e.currentTarget;
        if (!inputElement)
            return;
        // on ESC key press
        if (e.key === 'Escape') {
            inputElement.blur();
            inputElement.value = '';
            this.entityList = this.fullEntityList;
            return;
        }
        if (((_a = inputElement.value) === null || _a === void 0 ? void 0 : _a.length) > 2) {
            this.entityList = search(inputElement.value, this.fullEntityList);
        }
        else {
            this.entityList = this.fullEntityList;
        }
    }
    onClassSelection(callback) {
        this.onClassSelectionCallback = callback;
    }
    set entityList(newEntityList) {
        if (!this.fullEntityList || this.fullEntityList.length === 0) {
            this.fullEntityList = newEntityList;
        }
        this._entityList = newEntityList;
        this.requestUpdate();
    }
    get entityList() {
        return this._entityList;
    }
}
GscapeEntitySelector.styles = [
    baseStyle,
    GscapeButtonStyle,
    i$1 `
      :host {
        position: absolute;
        top: 15%;
        left: 50%;
        transform: translate(-50%);
        max-height: 70%;
        display: flex;
        width: 25%;
      }

      .gscape-panel {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 8px 0;
        max-height: unset;
        max-width: unset;
        width: 100%;
        font-size: 14px;
      }

      .header {
        text-align: center;
        flex-shrink: 0;
      }

      .content-wrapper {
        display: flex;
        flex-direction: column;
      }

      gscape-entity-search {
        flex-shrink: 0;
      }

      .list-wrapper {
        padding: 0 8px;
      }

      input {
        margin: 8px 16px;
        flex-shrink: 0;
      }
    `
];
customElements.define('gscape-entity-selector', GscapeEntitySelector);

function initEntitySelector(grapholscape) {
    const entitySelectorComponent = new GscapeEntitySelector();
    init$9(entitySelectorComponent, grapholscape);
    grapholscape.widgets.set(WidgetEnum.ENTITY_SELECTOR, entitySelectorComponent);
}

const textSpinner = () => y `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;
const textSpinnerStyle = i$1 `
  .lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 20px;
    height: 1em;
  }
  .lds-ellipsis div {
    position: absolute;
    top: calc(1em / 2);
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--gscape-color-fg-subtle);
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  .lds-ellipsis div:nth-child(1) {
    left: 2px;
    animation: lds-ellipsis1 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(2) {
    left: 2px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(3) {
    left: 8px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(4) {
    left: 14px;
    animation: lds-ellipsis3 0.6s infinite;
  }
  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(6px, 0);
    }
  }
`;

function getContentSpinner() {
    return y `<div class="lds-ring" title="Sparqling is loading"><div></div><div></div><div></div><div></div></div>`;
}
const contentSpinnerStyle = i$1 `
  .lds-ring {
    width: 20px;
    height: 20px;
  }

  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 16px;
    height: 16px;
    margin: 2px;
    border: 2px solid var(--gscape-color-accent);
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: var(--gscape-color-accent) transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

var incrementalDetailsStyle = i$1 `
  .gscape-panel {
    overflow: auto;
  }

  .counter {
    position: absolute;
    margin-left: 18px;
  }

  .chip {
    line-height: 1;
  }

  .chip.data-property-value {
    color: var(--gscape-color-fg-default);
    border-color: var(--gscape-color-data-property-contrast);
    background-color: var(--gscape-color-data-property);
  }

  .neutral-chip {
    color: var(--gscape-color-fg-default);
    border-color: var(--gscape-color-border-default);
    background-color: var(--gscape-color-neutral-subtle);
  }

  .section-body {
    position: relative;
  }

  .content-wrapper > * {
    margin: 8px 0;
  }

  details.entity-list-item > .summary-body {
    white-space: normal;
  }

  .summary-body > .lds-ring {
    margin: 4px auto 8px;
  }

  .search-box {
    display: flex;
    align-items: stretch;
    margin: 4px 0;
  }

  .search-box > select {
    max-width: 30%;
    padding: 8px;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    border-right: none;
    min-width: 100px;
  }

  .search-box > input {
    padding: 8px;
    min-width: 150px;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    flex-grow: 2;
    flex-shrink: 0;
  }

  .limit-box {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 4px 0 8px;
  }

  .limit-box > input {
    padding: 4px 8px;
    max-width: 80px;
  }
`;

class GscapeIncrementalDetails extends BaseMixin(s) {
    constructor() {
        super(...arguments);
        this.limit = 10;
        this.canShowInstances = false;
        this.canShowDataPropertiesValues = false;
        this.canShowObjectPropertiesRanges = false;
        this.isInstanceCounterLoading = true;
        this.areInstancesLoading = true;
        this.onObjectPropertySelection = (iri, objectPropertyIri, direct) => { };
        this.onGetInstances = () => { };
        this.onInstanceSelection = (iri) => { };
        this.onDataPropertyToggle = (enabled) => { };
        this.onEntitySearch = (searchText) => { };
        this.onEntitySearchByDataPropertyValue = (dataPropertyIri, searchText) => { };
        this.onGetRangeInstances = (objectPropertyIri, rangeClassIri) => { };
        this.onInstanceObjectPropertySelection = (instanceIri, objectPropertyIri, parentClassIri, direct) => { };
        this.onLimitChange = (limitValue) => { };
    }
    render() {
        var _a, _b, _c, _d, _e;
        return y `
    <div class="content-wrapper">      
      ${this.canShowInstances
            ? y `
        <details class="ellipsed entity-list-item" title="Instances" style="position:relative" @click=${this.handleShowInstances}>
          <summary class="actionable">
            <span class="entity-icon slotted-icon">${instancesIcon}</span>
            <span class="entity-name">Instances</span>
              ${this.isInstanceCounterLoading
                ? y `<span class="neutral-chip chip counter">${textSpinner()}</span>`
                : y `<span class="neutral-chip chip counter">${(_a = this.instanceCount) !== null && _a !== void 0 ? _a : '?'}</span>`}
            </span>
          </summary>
      
          <div class="summary-body">
            <div class="search-box">
              <select id="data-property-filter">
                <option default>Filter</option>
                ${(_b = this.dataProperties) === null || _b === void 0 ? void 0 : _b.map(dp => y `<option value=${dp.value.iri.fullIri}>${dp.displayedName}</option>`)}
              </select>
              <input id="instances-search" @keyup=${this.handleSearch} type="text" placeholder="Search instances by IRI, labels ..." />
            </div>

            ${(_c = this.instances) === null || _c === void 0 ? void 0 : _c.map(instance => this.getEntitySuggestionTemplate(instance))}
            ${this.areInstancesLoading ? getContentSpinner() : null}
          </div>
        </details>
        `
            : null}

      ${this.dataProperties && this.dataProperties.length > 0
            ? y `
          <div class="section">
            <div class="section-header bold-text">Data Properties</div>
            <div class="section-body" style="padding-left: 0px; padding-right: 0px">
              ${(_d = this.dataProperties) === null || _d === void 0 ? void 0 : _d.map(dataProperty => this.getEntitySuggestionTemplate(dataProperty))}
            </div>
          </div>
        `
            : null}

      ${this.objectProperties && this.objectProperties.length > 0
            ? y `
            <div class="section">
              <div class="section-header bold-text">Object Properties</div>
              <div class="section-body" style="padding: 0">
                ${(_e = this.objectProperties) === null || _e === void 0 ? void 0 : _e.map((op) => {
                return y `
                    <details class="ellipsed entity-list-item" title=${op.objectProperty.displayedName}>
                      <summary class="actionable">
                        <span class="entity-icon slotted-icon">${objectPropertyIcon}</span>
                        <span class="entity-name">${op.objectProperty.displayedName}</span>
                        ${!op.direct
                    ? y `<span class="chip" style="line-height: 1">Inverse</span>`
                    : null}
                      </summary>
                  
                      <div class="summary-body" ?isDirect=${op.direct}>
                        ${op.connectedClasses.map(classEntity => {
                    var _a, _b;
                    if (this.canShowObjectPropertiesRanges) {
                        const rangeClassesInstances = (_b = (_a = this.objectPropertiesRanges) === null || _a === void 0 ? void 0 : _a.get(op.objectProperty.value.iri.fullIri)) === null || _b === void 0 ? void 0 : _b.get(classEntity.value.iri.fullIri);
                        if (rangeClassesInstances) {
                            return y `
                                <details class="ellipsed entity-list-item" title="${classEntity.displayedName}"
                                  objectPropertyIri=${op.objectProperty.value.iri.fullIri}
                                  rangeClassIri=${classEntity.value.iri.fullIri}
                                  @click=${this.handleShowObjectPropertyRanges}
                                >
                                  <summary class="actionable">
                                    <span class="entity-icon slotted-icon">${classIcon}</span>
                                    <span class="entity-name">${classEntity.displayedName}</span>
                                  </summary>

                                  <div class="summary-body">
                                    ${rangeClassesInstances.values.map(instance => this.getEntitySuggestionTemplate(instance, op.objectProperty.value.iri.fullIri, classEntity.value.iri.fullIri, op.direct))}
                                    ${rangeClassesInstances.loading ? getContentSpinner() : null}
                                  </div>
                                </details>
                              `;
                        }
                    }
                    else {
                        return this.getEntitySuggestionTemplate(classEntity, op.objectProperty.value.iri.fullIri, undefined, op.direct);
                    }
                })}
                      </div>
                    </details>
                  `;
            })}
              </div>
            </div>
          `
            : null}    
    </div>
    `;
    }
    handleSearch(e) {
        const inputElement = e.target;
        clearTimeout(this.searchTimeout);
        // on ESC key press
        if (e.key === 'Escape') {
            inputElement.blur();
            inputElement.value = '';
        }
        this.searchTimeout = setTimeout(() => {
            const dataPropertyFilterElem = this.dataPropertyFilter;
            if (dataPropertyFilterElem && dataPropertyFilterElem.options.selectedIndex !== 0) {
                const dataPropertyIri = dataPropertyFilterElem.options[dataPropertyFilterElem.options.selectedIndex].value;
                this.onEntitySearchByDataPropertyValue(dataPropertyIri, inputElement.value);
            }
            else {
                this.onEntitySearch(inputElement.value);
            }
        }, 500);
    }
    handleShowInstances(evt) {
        const target = evt.currentTarget;
        if (!target.open && (!this.instances || this.instances.length === 0)) {
            this.onGetInstances();
        }
    }
    handleShowObjectPropertyRanges(evt) {
        var _a, _b;
        const target = evt.currentTarget;
        const objectPropertyIri = target.getAttribute('objectPropertyIri');
        const rangeClassIri = target.getAttribute('rangeClassIri');
        if (objectPropertyIri && rangeClassIri && !target.open) {
            const actualRangeInstances = (_b = (_a = this.objectPropertiesRanges) === null || _a === void 0 ? void 0 : _a.get(objectPropertyIri)) === null || _b === void 0 ? void 0 : _b.get(rangeClassIri);
            if (!actualRangeInstances || actualRangeInstances.values.length === 0)
                this.onGetRangeInstances(objectPropertyIri, rangeClassIri);
        }
    }
    getEntitySuggestionTemplate(entity, objectPropertyIri, parentClassIri, direct) {
        var _a;
        const values = (_a = this.dataPropertiesValues) === null || _a === void 0 ? void 0 : _a.get(entity.value.iri.fullIri);
        return y `
      <div 
        title=${entity.displayedName}
        iri=${entity.value.iri.fullIri}
        entity-type="${entity.value.type}"
        class="ellipsed entity-list-item ${entity.value.type !== GrapholTypesEnum.DATA_PROPERTY ? 'actionable' : null}"
        @click=${(e) => this.handleEntityClick(e, objectPropertyIri, parentClassIri, direct)}
      >
        <span class="entity-icon slotted-icon">${entityIcons[entity.value.type]}</span>
        <span class="entity-name">${entity.displayedName}</span>
        ${this.canShowDataPropertiesValues && values
            ? y `
            ${values.values.map(v => y `<span class="chip data-property-value">${v}</span>`)}
            ${values.loading
                ? y `<span class="chip neutral-chip">${textSpinner()}</span>`
                : null}
          `
            : null}
      </div>
    `;
    }
    handleEntityClick(e, objectPropertyIri, parentClassIri, direct = true) {
        const target = e.currentTarget;
        const iri = target.getAttribute('iri');
        if (!iri)
            return;
        switch (target.getAttribute('entity-type')) {
            case GrapholTypesEnum.CLASS:
                if (objectPropertyIri) {
                    this.onObjectPropertySelection(iri, objectPropertyIri, direct);
                }
                break;
            case GrapholTypesEnum.CLASS_INSTANCE:
                if (objectPropertyIri) {
                    if (parentClassIri) // nested needed
                        this.onInstanceObjectPropertySelection(iri, objectPropertyIri, parentClassIri, direct);
                }
                else {
                    this.onInstanceSelection(iri);
                }
        }
    }
    // protected get cxtMenuProps() {
    //   let cxtMenuProps = super.cxtMenuProps
    //   cxtMenuProps.placement = 'right'
    //   return cxtMenuProps
    // }
    setDataProperties(dataProperties) { this.dataProperties = dataProperties; }
    addDataProperties(dataProperties) {
        this.dataProperties = (this.dataProperties || []).concat(dataProperties);
    }
    setObjectProperties(objectProperties) { this.objectProperties = objectProperties; }
    addObjectProperties(objectProperties) {
        this.objectProperties = (this.objectProperties || []).concat(objectProperties);
    }
    setInstances(instances) {
        this.instances = instances;
    }
    addInstances(instances) {
        // concat avoiding duplicates
        this.instances = [...new Set([...(this.instances || []), ...instances])];
    }
    setDataPropertiesValues(dataPropertiesValues) {
        this.dataPropertiesValues = dataPropertiesValues;
    }
    addDataPropertiesValues(dataPropertyIri, values) {
        if (!this.dataPropertiesValues)
            return;
        const dataPropertyValues = this.dataPropertiesValues.get(dataPropertyIri);
        if (dataPropertyValues) {
            dataPropertyValues.values = values;
            this.requestUpdate();
        }
    }
    setDataPropertyLoading(dataPropertyIri, isLoading) {
        var _a;
        const dataPropertiesValues = (_a = this.dataPropertiesValues) === null || _a === void 0 ? void 0 : _a.get(dataPropertyIri);
        if (dataPropertiesValues) {
            dataPropertiesValues.loading = isLoading;
            this.requestUpdate();
        }
    }
    // ---- OBJECT PROPERTIES RANGES ----
    setObjectPropertyRanges(objectPropertyRanges) {
        this.objectPropertiesRanges = objectPropertyRanges;
    }
    setObjectPropertyLoading(objectPropertyIri, rangeClassIri, isLoading) {
        var _a, _b;
        const objectPropertyRanges = (_b = (_a = this.objectPropertiesRanges) === null || _a === void 0 ? void 0 : _a.get(objectPropertyIri)) === null || _b === void 0 ? void 0 : _b.get(rangeClassIri);
        if (objectPropertyRanges) {
            objectPropertyRanges.loading = isLoading;
            this.requestUpdate();
        }
    }
    addObjectPropertyRangeInstances(objectPropertyIri, rangeClassIri, classInstances) {
        var _a, _b;
        const objectPropertyRanges = (_b = (_a = this.objectPropertiesRanges) === null || _a === void 0 ? void 0 : _a.get(objectPropertyIri)) === null || _b === void 0 ? void 0 : _b.get(rangeClassIri);
        if (objectPropertyRanges) {
            objectPropertyRanges.values = classInstances;
            this.requestUpdate();
        }
    }
    show() {
        var _a, _b;
        super.show();
        (_b = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll(`details`)) === null || _b === void 0 ? void 0 : _b.forEach(detailsElement => detailsElement.open = false);
    }
    reset() {
        this.dataProperties = undefined;
        this.objectProperties = undefined;
        this.canShowInstances = false;
        this.canShowDataPropertiesValues = false;
        this.canShowObjectPropertiesRanges = false;
        this.dataPropertiesValues = undefined;
        this.objectPropertiesRanges = undefined;
    }
    get dataPropertyFilter() {
        if (this.shadowRoot)
            return this.shadowRoot.querySelector(`select#data-property-filter`);
    }
}
GscapeIncrementalDetails.properties = {
    dataProperties: { type: Object, attribute: false },
    objectProperties: { type: Object, attribute: false },
    instances: { type: Array, attribute: false },
    canShowInstances: { type: Boolean, attribute: false },
    canShowDataPropertiesValues: { type: Boolean, attribute: false },
    isInstanceCounterLoading: { type: Boolean, attribute: false },
    areInstancesLoading: { type: Boolean, attribute: false },
    instanceCount: { type: Number, attribute: false },
    limit: { type: Number, attribute: false },
    // dataPropertiesValues: {type: Object, attribute: false },
    // objectPropertiesRanges: {type: Object, attribute: false },
};
GscapeIncrementalDetails.styles = [baseStyle, entityListItemStyle, incrementalDetailsStyle, textSpinnerStyle, contentSpinnerStyle,
    i$1 `
      div.entity-list-item[entity-type = "data-property"] { 
        flex-wrap: wrap;
      }
    `
];
customElements.define('gscape-incremental-menu', GscapeIncrementalDetails);

function showHideSuperHierarchies(hide, callback) {
    return {
        content: `${hide ? `Hide` : `Show`} Super Hierarchies`,
        icon: superHierarchies,
        select: callback,
    };
}
function showHideSuperClasses(hide, callback) {
    return {
        content: `${hide ? `Hide` : `Show`} Super Classes`,
        icon: superHierarchies,
        select: callback,
    };
}
function showHideSubHierarchies(hide, callback) {
    return {
        content: `${hide ? `Hide` : `Show`} Sub Hierarchies`,
        icon: subHierarchies,
        select: callback,
    };
}
function showHideSubClasses(hide, callback) {
    return {
        content: `${hide ? `Hide` : `Show`} Sub Classes`,
        icon: subHierarchies,
        select: callback,
    };
}
function remove(callback) {
    return {
        content: 'Remove',
        icon: rubbishBin,
        select: callback,
    };
}
function showParentClass(callback) {
    return {
        content: 'Show Parent Classes',
        icon: classIcon,
        select: callback,
    };
}

function initIncrementalMenu(grapholscape) {
    const incrementalMenu = new GscapeIncrementalDetails();
    //   // grapholscape.on(LifecycleEvent.NodeSelection, node => {
    //   //   if (grapholscape.renderState === RendererStatesEnum.INCREMENTAL)
    //   //     cxtMenuWidget.attachTo((grapholscape.renderer.cy.$id(node.id) as any).popperRef(), [])
    //   // })
    grapholscape.widgets.set(WidgetEnum.INCREMENTAL_MENU, incrementalMenu);
}
// function getCxtMenuProps(cxtMenuWidget: ContextMenuWidget): Partial<Props> {
//   return {
//     trigger: 'manual', // mandatory, we cause the tippy to show programmatically.
//     allowHTML: true,
//     interactive: true,
//     placement: "bottom",
//     appendTo: document.querySelector('.gscape-ui') || undefined,
//     // content prop can be used when the target is a single element https://atomiks.github.io/tippyjs/v6/constructor/#prop
//     content: cxtMenuWidget,
//     hideOnClick: true,
//     offset: [0, 0],
//   }
// }
// export function attachCxtMenuTo(element: HTMLElement, commands: Command[]) {
//   cxtMenu.setProps(getCxtMenuProps())
//   cxtMenu.setProps({ getReferenceClientRect: () => element.getBoundingClientRect() } )
//   cxtMenuWidget.commands = commands
//   cxtMenu.show()
// }
// cxtMenuWidget.onCommandRun = () => cxtMenu.hide()

class GscapeDiagramSelector extends DropPanelMixin(BaseMixin(s)) {
    constructor() {
        super(...arguments);
        this.title = 'Diagram Selector';
        this.onDiagramSelection = () => { };
    }
    render() {
        var _a;
        return y `
      <gscape-button @click="${this.togglePanel}" label="${((_a = this.actualDiagram) === null || _a === void 0 ? void 0 : _a.name) || 'Select a diagram'}">
        ${getIconSlot('icon', diagrams)}
        ${getIconSlot('trailing-icon', arrowDown)}
      </gscape-button>

      <div class="gscape-panel drop-down hide" id="drop-panel">
        ${this.diagrams.length === 1 && this.actualDiagramId === 0
            ? y `
            <div class="blank-slate">
              ${blankSlateDiagrams}
              <div class="header">No more diagrams</div>
              <div class="description">The ontology contains only one diagram, the one displayed.</div>
            </div>
          `
            : this.diagrams
                .sort(function (a, b) {
                var x = a.name.toLowerCase();
                var y = b.name.toLowerCase();
                if (x < y) {
                    return -1;
                }
                if (x > y) {
                    return 1;
                }
                return 0;
            })
                .map(diagram => y `
              <gscape-action-list-item
                @click="${this.diagramSelectionHandler}"
                label="${diagram.name}"
                diagram-id="${diagram.id}"
                ?selected = "${this.actualDiagramId === diagram.id}"
              ></gscape-action-list-item>
            `)}
        
      </div>
    `;
    }
    diagramSelectionHandler(e) {
        const selectedDiagramId = parseInt(e.target.getAttribute('diagram-id') || '');
        this.onDiagramSelection(selectedDiagramId);
    }
    get actualDiagram() {
        return this.diagrams.find(diagram => diagram.id === this.actualDiagramId);
    }
}
GscapeDiagramSelector.properties = {
    actualDiagramId: { type: Number }
};
GscapeDiagramSelector.styles = [
    baseStyle,
    i$1 `
    :host {
      position: absolute;
      top: 10px;
      left: 10px;
    }

    .gscape-panel {
      margin-top: 4px;
    }

    gscape-button {
      font-wright: 600;
    }
    `
];
customElements.define('gscape-diagram-selector', GscapeDiagramSelector);

/**
 *
 * @param {import('./index').default} diagramSelectorComponent
 * @param {import('../../grapholscape').default} grapholscape
 */
function init$8 (diagramSelectorComponent, grapholscape) {
    // const diagramsViewData = grapholscape.ontology.diagrams
    diagramSelectorComponent.diagrams = grapholscape.ontology.diagrams;
    if (grapholscape.diagramId || grapholscape.diagramId === 0) {
        diagramSelectorComponent.actualDiagramId = grapholscape.diagramId;
    }
    diagramSelectorComponent.onDiagramSelection = (diagram) => grapholscape.showDiagram(diagram);
    grapholscape.on(LifecycleEvent.DiagramChange, diagram => diagramSelectorComponent.actualDiagramId = diagram.id);
}

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
function initDiagramSelector(grapholscape) {
    const diagramSelectorComponent = new GscapeDiagramSelector();
    init$8(diagramSelectorComponent, grapholscape);
    grapholscape.widgets.set(WidgetEnum.DIAGRAM_SELECTOR, diagramSelectorComponent);
}

function itemWithIriTemplate(item, onWikiLinkClick) {
    function wikiClickHandler() {
        if (onWikiLinkClick)
            onWikiLinkClick(item.iri);
    }
    return y `
    <div class="item-with-iri-info ellipsed">
      <div 
        class="name ${onWikiLinkClick ? 'link' : null}" 
        title="${item.name}"
        @click=${onWikiLinkClick ? wikiClickHandler : null}
      >
        ${item.name}
      </div>
      <div class="muted-text" title="iri: ${item.iri}">${item.iri}</div>
      <div class="muted-text type-or-version">
        ${Object.values(GrapholTypesEnum).includes(item.typeOrVersion)
        ? entityIcons[item.typeOrVersion] : null}
        ${item.typeOrVersion || '-'}
      </div>
    </div>
  `;
}
const itemWithIriTemplateStyle = i$1 `
  .item-with-iri-info {
    text-align:center;
    background-color: var(--gscape-color-bg-inset);
    white-space: nowrap;
  }

  .item-with-iri-info > .type-or-version {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .item-with-iri-info .name {
    font-size: 14px;
    font-weight: 600;
  }
`;
function annotationsTemplate(annotations) {
    if (!annotations || annotations.length === 0)
        return null;
    let propertiesAlreadyInserted = [];
    return y `
    <div class="annotations">
      ${annotations.map(annotation => {
        const property = annotation.property;
        if (annotation.property === 'comment' || propertiesAlreadyInserted.includes(property))
            return null;
        propertiesAlreadyInserted.push(property);
        return y `
          <div class="annotation">
            <div class="bold-text annotation-property">
              ${property.charAt(0).toUpperCase() + property.slice(1)}
            </div>
            ${annotations.filter(a => a.property === property).map(annotation => {
            return y `
                <div class="annotation-row">
                  <span class="language muted-text bold-text">@${annotation.language}</span>
                  <span title="${annotation.lexicalForm}">${annotation.lexicalForm}</span>
                </div>
              `;
        })}
          </div>
        `;
    })}
    </div>
  `;
}
const annotationsStyle = i$1 `
  .annotations {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .annotation-property {
    margin-bottom: 4px;
  }

  .annotations .language {
    margin-right: 6px
  }

  .annotation-row {
    padding: 0 8px;
  }
`;

class GscapeEntityDetails extends DropPanelMixin(BaseMixin(s)) {
    constructor() {
        super(...arguments);
        this.title = 'Entity Details';
        this.onNodeNavigation = () => { };
    }
    static get properties() {
        return {
            grapholEntity: { type: Object, attribute: false },
            occurrences: { type: Object, attribute: false },
            language: { type: String, attribute: false },
            _isPanelClosed: { type: Boolean, attribute: false },
            incrementalSection: { type: Object, attribute: false }
        };
    }
    render() {
        if (!this.grapholEntity)
            return;
        return y `
      <div class="gscape-panel ellipsed" id="drop-panel">
        ${itemWithIriTemplate(this.entityForTemplate, this.onWikiLinkClick)}

        <div class="content-wrapper">
          ${this.grapholEntity.datatype
            ? y `
              <div style="text-align: center" class="chips-wrapper section">
                <span class="chip datatype-chip">${this.grapholEntity.datatype}</span>
              </div>
            `
            : null}

          ${this.grapholEntity.functionalities.length > 0
            ? y `
                <div class="chips-wrapper section">
                ${this.grapholEntity.functionalities.map(functionality => {
                return y `<span class="chip">&#10003; ${functionality.toString()}</span>`;
            })}
                </div>
              `
            : null}

          ${this.incrementalSection}

          ${annotationsTemplate(this.grapholEntity.getAnnotations())}
          
          ${!this.incrementalSection && this.occurrences.size > 0 ? this.occurrencesTemplate() : null}

          ${this.grapholEntity.getComments().length > 0
            ? y `
                <div class="section">
                  <div>
                    <span id="description-header" class="bold-text section-header">Description</span>
                    <select id="language-select" class="btn btn-s" @change=${this.languageSelectionHandler}>
                      ${this.commentsLanguages.map(language => {
                return y `
                          <option value="${language}" ?selected=${this.language === language}>
                            @${language}
                          </option>
                        `;
            })}
                    </select>
                  </div>
                  <div class="section-body">
                    ${this.grapholEntity.getComments(this.language).map(comment => y `<span class="comment">${comment.lexicalForm}</span>`)}
                  </div>
                </div>
              `
            : null}
        </div>
      </div>

      <div class="top-bar">
        <gscape-button style="z-index: 1"
          id="toggle-panel-button"
          size="${this.isPanelClosed() ? 'm' : 's'}" 
          type="${this.isPanelClosed() ? '' : 'subtle'}"
          @click=${this.togglePanel}
          label = "${this.isPanelClosed() ? 'Entity Details' : ''}"
        > 
          ${this.isPanelClosed()
            ? y `
                <span slot="icon">${infoFilled}</span>
                <span slot="trailing-icon">${plus}</span>
              `
            : y `<span slot="icon">${minus}</span>`}
        </gscape-button>
      </div>
    `;
    }
    occurrencesTemplate() {
        return y `
      <div class="section">
        <div class="bold-text section-header">Occurrences</div>
        <div class="section-body">
          ${getEntityOccurrencesTemplate(this.occurrences, this.onNodeNavigation)}
        </div>
      </div>
    `;
    }
    // override blur to avoid collapsing when clicking on cytoscape's canvas
    blur() { }
    setGrapholEntity(entity) { }
    languageSelectionHandler(e) {
        this.language = e.target.value;
    }
    get entityForTemplate() {
        const result = {
            name: this.grapholEntity.iri.remainder,
            typeOrVersion: this.grapholEntity.type.toString(),
            iri: this.grapholEntity.iri.fullIri,
        };
        return result;
    }
    get commentsLanguages() {
        return Array.from(new Set(this.grapholEntity.getComments().map(comment => comment.language)));
    }
    updated() {
        var _a;
        // let description = this.entity?.annotations?.comment
        const allComments = (_a = this.grapholEntity) === null || _a === void 0 ? void 0 : _a.getComments();
        if (!allComments || allComments.length === 0)
            return;
        const commentsInActualLanguage = this.grapholEntity.getComments(this.language);
        // if actual language is not available, select the first available
        if (commentsInActualLanguage.length === 0) {
            this.language = allComments[0].language;
        }
    }
}
GscapeEntityDetails.styles = [
    baseStyle,
    itemWithIriTemplateStyle,
    annotationsStyle,
    GscapeButtonStyle,
    i$1 `
      :host {
        position: absolute;
        top:10px;
        right:62px;
        max-height: 50%;
        min-height: 200px;
        min-width: 300px;
        max-width: 20%;
        display: flex;
        flex-direction: column;
        pointer-events: none;
      }

      .gscape-panel {
        padding:0;
        max-height: inherit;
        display: flex;
        flex-direction: column;
        width: inherit;
        max-width: unset;
        min-width: unset;
      }

      .gscape-panel > * {
        padding: 8px;
      }

      .datatype-chip {
        color: inherit;
        background-color: var(--gscape-color-neutral-muted);
        border-color: var(--gscape-color-border-subtle);
        padding-top: 1px;
      }

      [diagram-id] > gscape-button {
        color: var(--gscape-color-accent);
      }

      #language-select: {
        margin: 10px auto;
        display: block;
      }

      #description-header {
        margin-right: 8px;
      }

      .comment {
        margin: 8px 0;
        display: block;
      }

      .top-bar {
        display: flex;
        flex-direction: row-reverse;
        line-height: 1;
        position: absolute;
        top: 0;
        right: 0;
      }

      .item-with-iri-info {
        padding-top: 12px;
        flex-shrink: 0;
      }

      .content-wrapper > * {
        margin: 8px 0;
      }
    `
];
customElements.define('gscape-entity-details', GscapeEntityDetails);

function init$7 (entityDetailsComponent, grapholscape) {
    // entityDetailsComponent.onWikiClick = (iri) => grapholscape.wikiRedirectTo(iri)
    entityDetailsComponent.onNodeNavigation = (entityOccurrence) => {
        grapholscape.centerOnElement(entityOccurrence.elementId, entityOccurrence.diagramId, 1.2);
        grapholscape.selectElement(entityOccurrence.elementId);
    };
    entityDetailsComponent.language = grapholscape.language;
    entityDetailsComponent.setGrapholEntity = setGrapholEntity;
    grapholscape.on(LifecycleEvent.EntitySelection, setGrapholEntity);
    grapholscape.on(LifecycleEvent.NodeSelection, node => {
        if (!node.isEntity())
            entityDetailsComponent.hide();
    });
    grapholscape.on(LifecycleEvent.EdgeSelection, edge => {
        if (!edge.isEntity())
            entityDetailsComponent.hide();
    });
    grapholscape.on(LifecycleEvent.LanguageChange, language => {
        entityDetailsComponent.language = language;
    });
    grapholscape.on(LifecycleEvent.RendererChange, _ => {
        if (entityDetailsComponent.grapholEntity)
            entityDetailsComponent.occurrences = getEntityViewOccurrences(entityDetailsComponent.grapholEntity, grapholscape);
    });
    function setGrapholEntity(entity) {
        entityDetailsComponent.grapholEntity = entity;
        entityDetailsComponent.occurrences = getEntityViewOccurrences(entity, grapholscape);
        entityDetailsComponent.language = grapholscape.language;
        entityDetailsComponent.show();
        if (grapholscape.lifecycle.entityWikiLinkClick.length > 0 && !entityDetailsComponent.onWikiLinkClick) {
            entityDetailsComponent.onWikiLinkClick = (iri) => {
                grapholscape.lifecycle.trigger(LifecycleEvent.EntityWikiLinkClick, iri);
            };
        }
    }
}

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
function initEntityDetails(grapholscape) {
    const entityDetailsComponent = new GscapeEntityDetails();
    init$7(entityDetailsComponent, grapholscape);
    grapholscape.widgets.set(WidgetEnum.ENTITY_DETAILS, entityDetailsComponent);
}

class GscapeFilters extends DropPanelMixin(BaseMixin(s)) {
    constructor() {
        super();
        this.title = "Filters";
        this.filterAll = new Filter('all', () => false);
        this.onFilterOn = () => { };
        this.onFilterOff = () => { };
        this.onFilterAll = () => { };
        this.onUnfilterAll = () => { };
        this.classList.add(BOTTOM_RIGHT_WIDGET.toString());
    }
    render() {
        return y `
      <gscape-button type="subtle" @click=${this.togglePanel}>
        ${getIconSlot('icon', filter)}
      </gscape-button>

      <div class="gscape-panel gscape-panel-in-tray hide" id="drop-panel">
        <div class="header">${this.title}</div>

        <div class="content-wrapper">
          ${this.filterToggleTemplate(this.filterAll, false)}
          <div class="hr"></div>
          ${Array.from(this.filters).map(([_, filter]) => this.filterToggleTemplate(filter))}
        </div>
      </div>
    `;
    }
    filterToggleTemplate(filter, reverseState = true) {
        return y `
      <gscape-toggle
        class="${!filter.locked ? 'actionable' : null}"
        @click = ${!filter.locked ? this.toggleFilter : null}
        key = ${filter.key}
        label = ${this.getFilterLabel(filter.key)}
        ?disabled = ${filter.locked}
        ?checked = ${reverseState ? !filter.active : filter.active}
      ></gscape-toggle>
    `;
    }
    getFilterLabel(filterKey) {
        var _a;
        let result = (_a = Object.keys(DefaultFilterKeyEnum)
            .find(key => DefaultFilterKeyEnum[key] === filterKey)) === null || _a === void 0 ? void 0 : _a.toLowerCase().replace('_', ' ');
        if (!result)
            return '';
        result = (result === null || result === void 0 ? void 0 : result.charAt(0).toUpperCase()) + (result === null || result === void 0 ? void 0 : result.substring(1));
        return result;
    }
    toggleFilter(e) {
        var _a;
        e.preventDefault();
        const toggle = e.target;
        const filter = this.filters.get(toggle.key);
        if (!filter) {
            if (toggle.key === this.filterAll.key) {
                this.filterAll.active ? this.onUnfilterAll() : this.onFilterAll();
            }
            return;
        }
        ((_a = this.filters.get(toggle.key)) === null || _a === void 0 ? void 0 : _a.active) ? this.onFilterOff(filter) : this.onFilterOn(filter);
    }
}
GscapeFilters.properties = {
    filters: { type: Object, attribute: false }
};
GscapeFilters.styles = [
    baseStyle,
    i$1 `
      :host {
        order: 3;
        display:inline-block;
        position: initial;
        margin-top:10px;
      }

      gscape-toggle {
        padding: 8px;
      }

      gscape-toggle[key ="all"] {
        margin: 0 auto;
      }

      .content-wrapper {
        display: flex;
        flex-direction: column;
      }

      .hr {
        margin-top: 4px;
        margin-bottom: 4px;
      }
    `,
];
customElements.define('gscape-filters', GscapeFilters);

/**
 * @param {import('./index').default} filterComponent
 * @param {import('../../grapholscape').default} grapholscape
 */
function init$6 (filterComponent, grapholscape) {
    filterComponent.filters = grapholscape.renderer.filters;
    filterComponent.onFilterOff = (filter) => grapholscape.unfilter(filter);
    filterComponent.onFilterOn = (filter) => grapholscape.filter(filter);
    filterComponent.onFilterAll = () => {
        grapholscape.renderer.filters.forEach(filter => {
            grapholscape.filter(filter);
            filter.active = true;
        });
        filterComponent.filterAll.active = true;
        filterComponent.requestUpdate();
    };
    filterComponent.onUnfilterAll = () => {
        grapholscape.renderer.filters.forEach(filter => {
            grapholscape.unfilter(filter);
        });
        filterComponent.filterAll.active = false;
        filterComponent.requestUpdate();
    };
    grapholscape.on(LifecycleEvent.Filter, () => filterComponent.requestUpdate());
    grapholscape.on(LifecycleEvent.Unfilter, () => {
        filterComponent.filterAll.active = false;
        filterComponent.requestUpdate();
    });
    grapholscape.on(LifecycleEvent.RendererChange, () => filterComponent.requestUpdate());
    // filterComponent.onFilterOn = (filterType) => {
    //   filterComponent.filterList[filterType].active = true
    //   onFilterToggle(filterType)
    // }
    // filterComponent.onFilterOff = (filterType) => {
    //   filterComponent.filterList[filterType].active = false
    //   onFilterToggle(filterType)
    // }
    // grapholscape.onFilter(_ => filterComponent.updateTogglesState())
    // grapholscape.onUnfilter(_ => filterComponent.updateTogglesState())
    // grapholscape.onRendererChange(() => filterComponent.requestUpdate())
    // function onFilterToggle(type) {
    //   if (type == 'attributes' && !grapholscape.renderer.disabledFilters.includes('value_domain')) {
    //     filterComponent.filterList.value_domain.disabled = filterComponent.filterList.attributes.active
    //   }
    //   // if 'all' is toggled, it affect all other filters
    //   if (type == 'all') {
    //     Object.keys(filterComponent.filterList).map(key => {
    //       if (key != 'all' && !filterComponent.filterList[key].disbaled) {
    //         filterComponent.filterList[key].active = filterComponent.filterList.all.active
    //         /**
    //          * if the actual filter is value-domain it means it's not disabled (see previous if condition)
    //          * but when filter all is active, filter value-domain must be disabled, let's disable it.
    //          * Basically value-domain filter disabled state must be equal to the active state of the 
    //          * 'all' filter.
    //          */
    //         if (key == 'value_domain' && !grapholscape.renderer.disabledFilters.includes('value_domain'))
    //           filterComponent.filterList[key].disabled = filterComponent.filterList['all'].active
    //         executeFilter(key)
    //       }
    //     })
    //   } else if (!filterComponent.filterList[type].active && filterComponent.filterList.all.active) {
    //     // if one filter get deactivated while the 'all' filter is active
    //     // then make the 'all' toggle deactivated
    //     filterComponent.filterList.all.active = false
    //   }
    //   executeFilter(type)
    //   filterComponent.updateTogglesState()
    // }
    // function executeFilter(type) {
    //   if (filterComponent.filterList[type].active) {
    //     grapholscape.filter(type)
    //   } else {
    //     grapholscape.unfilter(type)
    //     // Re-Apply other active filters to resolve ambiguity
    //     applyActiveFilters()
    //   }
    // }
    // function applyActiveFilters() {
    //   Object.keys(filterComponent.filterList).map(key => {
    //     if (filterComponent.filterList[key].active)
    //       grapholscape.filter(filterComponent.filterList[key])
    //   })
    // }
}

function initFilters(grapholscape) {
    const filterComponent = new GscapeFilters();
    init$6(filterComponent, grapholscape);
    grapholscape.widgets.set(WidgetEnum.FILTERS, filterComponent);
}

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
function initFitButton(grapholscape) {
    const fitButtonComponent = new GscapeButton();
    fitButtonComponent.appendChild(getIconSlot('icon', centerDiagram));
    fitButtonComponent.style.order = '2';
    fitButtonComponent.style.marginTop = '10px';
    fitButtonComponent.title = 'Center Diagram';
    //fitButtonComponent.style.position = 'initial'
    fitButtonComponent.onclick = () => grapholscape.fit();
    grapholscape.widgets.set(WidgetEnum.FIT_BUTTON, fitButtonComponent);
}

class FloatyFilterManager extends BaseFilterManager {
    constructor() {
        super(...arguments);
        this.lockedFilters = [
            DefaultFilterKeyEnum.VALUE_DOMAIN,
            DefaultFilterKeyEnum.UNIVERSAL_QUANTIFIER,
            DefaultFilterKeyEnum.COMPLEMENT,
            DefaultFilterKeyEnum.HAS_KEY,
        ];
    }
}

function grapholStyle (theme) {
    return [
        {
            selector: 'node',
            style: {
                'height': 'data(height)',
                'width': 'data(width)',
                'background-color': (node) => getColor(node, ColoursNames.bg_node_light),
                'shape': 'data(shape)',
                'border-width': 1,
                'border-color': theme.getColour(ColoursNames.border_node),
                'border-style': 'solid',
                'font-size': 12,
                'color': theme.getColour(ColoursNames.label),
            }
        },
        {
            selector: '[fontSize]',
            style: {
                'font-size': 'data(fontSize)',
            }
        },
        {
            selector: 'node[displayedName]',
            style: {
                'label': 'data(displayedName)',
                'text-margin-x': 'data(labelXpos)',
                'text-margin-y': 'data(labelYpos)',
                'text-wrap': 'wrap',
                'min-zoomed-font-size': '5px',
            }
        },
        {
            selector: `node[displayedName][type = "${GrapholTypesEnum.CLASS}"], node[displayedName][type = "${GrapholTypesEnum.INDIVIDUAL}"]`,
            style: {
                'text-max-width': 'data(width)',
                'text-overflow-wrap': 'anywhere',
            }
        },
        {
            selector: 'node[labelXcentered]',
            style: {
                'text-halign': 'center',
            }
        },
        {
            selector: 'node[labelYcentered]',
            style: {
                'text-valign': 'center',
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 2,
                'line-color': theme.getColour(ColoursNames.edge),
                'target-arrow-color': theme.getColour(ColoursNames.edge),
                'source-arrow-color': theme.getColour(ColoursNames.edge),
                'curve-style': 'bezier',
                'arrow-scale': 1.3,
                'color': theme.getColour(ColoursNames.label),
            }
        },
        {
            selector: `edge[type = "${GrapholTypesEnum.INCLUSION}"]`,
            style: {
                'line-style': 'solid',
                'target-arrow-shape': 'triangle',
                'target-arrow-fill': 'filled'
            }
        },
        {
            selector: `edge[type = "${GrapholTypesEnum.MEMBERSHIP}"]`,
            style: {
                'line-style': 'dashed',
                'line-dash-pattern': [2, 3],
                'target-arrow-shape': 'triangle',
                'target-arrow-fill': 'hollow'
            }
        },
        {
            selector: `edge[type = "${GrapholTypesEnum.INPUT}"]`,
            style: {
                'line-style': 'dashed',
                'target-arrow-shape': 'diamond',
                'target-arrow-fill': 'hollow'
            }
        },
        {
            selector: `edge[type = "${GrapholTypesEnum.EQUIVALENCE}"]`,
            style: {
                'line-style': 'solid',
                'source-arrow-shape': 'triangle',
                'source-arrow-fill': 'filled',
                'target-arrow-shape': 'triangle',
                'target-arrow-fill': 'filled',
            }
        },
        {
            selector: '[segmentDistances]',
            style: {
                'curve-style': 'segments',
                'segment-distances': 'data(segmentDistances)',
                'segment-weights': 'data(segmentWeights)',
                'edge-distances': 'node-position'
            }
        },
        {
            selector: '[sourceEndpoint]',
            style: {
                'source-endpoint': 'data(sourceEndpoint)'
            }
        },
        {
            selector: '[targetEndpoint]',
            style: {
                'target-endpoint': 'data(targetEndpoint)'
            }
        },
        {
            selector: '[?functional][!inverseFunctional]',
            style: {
                'border-width': 5,
                'border-color': theme.getColour(ColoursNames.border_node),
                'border-style': 'double'
            }
        },
        {
            selector: '[?inverseFunctional][!functional]',
            style: {
                'border-width': 4,
                'border-color': theme.getColour(ColoursNames.border_node),
                'border-style': 'solid'
            }
        },
        {
            selector: 'edge[displayedName]',
            style: {
                'label': 'data(displayedName)',
                'font-size': 10,
                'text-rotation': 'autorotate',
                'text-margin-y': -10,
            }
        },
        {
            selector: '[sourceLabel],[targetLabel]',
            style: {
                'font-size': 15,
                'target-text-offset': 20,
            }
        },
        {
            selector: '[targetLabel]',
            style: {
                'target-label': 'data(targetLabel)',
            }
        },
        {
            selector: '[sourceLabel]',
            style: {
                'source-label': 'data(sourceLabel)',
            }
        },
        {
            selector: 'edge[displayedName],[sourceLabel],[targetLabel],[text_background]',
            style: {
                'text-background-color': theme.getColour(ColoursNames.bg_graph),
                'text-background-opacity': 1,
                'text-background-shape': 'roundrectangle',
                'text-background-padding': 2,
            }
        },
        {
            selector: '[shapePoints]',
            style: {
                'shape-polygon-points': 'data(shapePoints)'
            }
        },
        {
            selector: '.filtered',
            style: {
                'display': 'none'
            }
        },
        {
            selector: `[type = "${GrapholTypesEnum.FACET}"][!fake], .fake-bottom-rhomboid`,
            style: {
                'background-opacity': 0
            }
        },
        {
            selector: `.fake-top-rhomboid`,
            style: {
                'background-color': node => getColor(node, ColoursNames.bg_inset),
            }
        },
        {
            selector: `[type = "${GrapholTypesEnum.PROPERTY_ASSERTION}"][!fake]`,
            style: {
                'background-opacity': 0,
                'border-width': 0,
            }
        },
        {
            selector: '.hidden',
            style: {
                'visibility': 'hidden'
            }
        },
        {
            selector: '.no_border',
            style: {
                'border-width': 0
            }
        },
        {
            selector: '.no_overlay',
            style: {
                'overlay-opacity': 0,
                'overlay-padding': 0
            }
        },
        {
            selector: `node[type = "${GrapholTypesEnum.CLASS}"]`,
            style: {
                'background-color': node => getColor(node, ColoursNames.class),
                'border-color': theme.getColour(ColoursNames.class_contrast),
            }
        },
        {
            selector: `node[type = "${GrapholTypesEnum.OBJECT_PROPERTY}"], .fake-triangle`,
            style: {
                'background-color': node => getColor(node, ColoursNames.object_property),
                'border-color': theme.getColour(ColoursNames.object_property_contrast),
            }
        },
        {
            selector: `node[type = "${GrapholTypesEnum.DATA_PROPERTY}"]`,
            style: {
                'background-color': node => getColor(node, ColoursNames.data_property),
                'border-color': theme.getColour(ColoursNames.data_property_contrast),
            }
        },
        {
            selector: `node[type = "${GrapholTypesEnum.DATA_PROPERTY}"]:selected`,
            style: {
                'text-background-color': theme.getColour(ColoursNames.bg_graph),
                'text-background-opacity': 1,
            }
        },
        {
            selector: `node[type = "${GrapholTypesEnum.INDIVIDUAL}"]`,
            style: {
                'background-color': node => getColor(node, ColoursNames.individual),
                'border-color': theme.getColour(ColoursNames.individual_contrast),
            }
        },
        {
            selector: `[type = "${GrapholTypesEnum.RANGE_RESTRICTION}"], [type = "${GrapholTypesEnum.DISJOINT_UNION}"]`,
            style: {
                'background-color': theme.getColour(ColoursNames.bg_node_dark),
            }
        },
        {
            selector: '.fake-triangle-right',
            style: {
                'background-color': theme.getColour(ColoursNames.object_property_contrast) || 'black',
            }
        },
        {
            selector: `[shape = "${Shape.HEXAGON}"],[type = "${GrapholTypesEnum.VALUE_DOMAIN}"]`,
            style: {
                'color': theme.getColour(ColoursNames.bg_node_dark),
            }
        },
        {
            selector: ':active',
            style: {
                'underlay-color': theme.getColour(ColoursNames.accent),
                'underlay-opacity': 0.2,
                'overlay-opacity': 0,
                'z-index': '100',
                'underlay-shape': (node) => node.style('shape') === Shape.ELLIPSE ? Shape.ELLIPSE : Shape.ROUND_RECTANGLE
            },
        },
        //-----------------------------------------------------------
        // selected selector always last
        {
            selector: ':selected, :active',
            style: {
                'overlay-color': theme.getColour(ColoursNames.accent),
                'overlay-opacity': 0.2,
                'z-index': '100',
                'overlay-shape': (node) => node.style('shape') === Shape.ELLIPSE ? Shape.ELLIPSE : Shape.ROUND_RECTANGLE
            }
        },
    ];
    function getColor(node, colour) {
        // take color from parsed XML source file
        if (theme.id === DefaultThemesEnum.GRAPHOL) {
            return node.data().fillColor;
        }
        else {
            return theme.getColour(colour) || node.data().fillColor;
        }
    }
}

function floatyStyle (theme) {
    const baseStyle = grapholStyle(theme);
    const floatyStyle = [
        {
            selector: 'node',
            style: {
                'shape': 'ellipse',
            }
        },
        {
            selector: `[type = "${GrapholTypesEnum.CLASS}"]`,
            style: {
                'text-margin-x': 0,
                'text-margin-y': 0,
                'text-valign': 'center',
                'text-halign': 'center',
                'height': 'data(width)'
            }
        },
        {
            selector: `edge[type = "${GrapholTypesEnum.INPUT}"]`,
            style: {
                'line-style': 'solid',
                'target-arrow-shape': 'none',
            }
        },
        {
            selector: `[type = "${GrapholTypesEnum.OBJECT_PROPERTY}"]`,
            style: {
                'line-color': theme.getColour(ColoursNames.object_property_contrast),
                'source-arrow-color': theme.getColour(ColoursNames.object_property_contrast),
                'target-arrow-color': theme.getColour(ColoursNames.object_property_contrast),
                'target-arrow-shape': 'triangle',
                'target-arrow-fill': 'filled',
                'source-arrow-shape': 'square',
                'source-arrow-fill': 'hollow',
                'width': 4,
            }
        },
        {
            selector: `node[type = "${GrapholTypesEnum.UNION}"], node[type = "${GrapholTypesEnum.DISJOINT_UNION}"]`,
            style: {
                'width': 35,
                'height': 35,
            }
        },
        {
            selector: `edge[type = "${GrapholTypesEnum.UNION}"], edge[type = "${GrapholTypesEnum.DISJOINT_UNION}"]`,
            style: {
                'width': 6,
                'line-style': 'solid',
                'target-arrow-shape': 'triangle',
            }
        },
        {
            selector: `edge[type = "${GrapholTypesEnum.UNION}"]`,
            style: {
                'target-arrow-fill': 'hollow'
            }
        },
        {
            selector: `edge[type = "${GrapholTypesEnum.DISJOINT_UNION}"]`,
            style: {
                'target-arrow-fill': 'filled',
            }
        },
        {
            selector: ':loop',
            style: {
                'control-point-step-size': 'data(control_point_step_size)',
                'control-point-weight': 0.5,
            }
        },
        {
            selector: '[?pinned]',
            style: {
                'border-width': 4,
                'border-color': theme.getColour(ColoursNames.accent),
            }
        },
    ];
    return baseStyle.concat(floatyStyle);
}

class BaseGrapholTransformer {
    get newCy() { return this.result.cy; }
    // filter nodes if the criterion function returns true
    // criterion must be a function returning a boolean value for a given a node
    filterByCriterion(criterion) {
        this.newCy.$('*').forEach(node => {
            if (criterion(node)) {
                cytoscapeFilter(node.id(), '', this.newCy);
            }
        });
    }
    deleteFilteredElements() {
        this.deleteElements(this.newCy.elements('.filtered'));
    }
    isRestriction(grapholElement) {
        if (!grapholElement)
            return false;
        return grapholElement.is(GrapholTypesEnum.DOMAIN_RESTRICTION) ||
            grapholElement.is(GrapholTypesEnum.RANGE_RESTRICTION);
    }
    getGrapholElement(id) {
        return this.result.grapholElements.get(id);
    }
    deleteElements(elements) {
        elements.forEach(elem => {
            this.deleteElement(elem);
        });
    }
    deleteElement(elem) {
        this.newCy.remove(elem);
        this.result.grapholElements.delete(elem.id());
    }
}

class LiteTransformer extends BaseGrapholTransformer {
    constructor() {
        super(...arguments);
        this.isQualifiedRestriction = (node) => {
            const grapholElement = this.getGrapholElement(node.id());
            if (this.isRestriction(grapholElement)) {
                return node.incomers(`edge[type = "${GrapholTypesEnum.INPUT}"]`).size() > 1 ? true : false;
            }
            return false;
        };
        this.isCardinalityRestriction = (node) => {
            const grapholElement = this.getGrapholElement(node.id());
            if (this.isRestriction(grapholElement) && grapholElement.displayedName && grapholElement.displayedName.search(/[0-9]/g) >= 0) {
                return true;
            }
            return false;
        };
        this.inputEdgesBetweenRestrictions = (node) => {
            const grapholElement = this.getGrapholElement(node.id());
            let outcome = false;
            if (this.isRestriction(grapholElement)) {
                node.incomers(`edge[type = "${GrapholTypesEnum.INPUT}"]`).forEach(edge => {
                    const sourceGrapholElement = this.getGrapholElement(edge.source().id());
                    if (this.isRestriction(sourceGrapholElement)) {
                        outcome = true;
                    }
                });
            }
            return outcome;
        };
    }
    transform(diagram) {
        this.result = new DiagramRepresentation(liteOptions);
        const grapholRepresentation = diagram.representations.get(RendererStatesEnum.GRAPHOL);
        if (!grapholRepresentation) {
            return this.result;
        }
        this.result.grapholElements = new Map(grapholRepresentation.grapholElements);
        this.newCy.add(grapholRepresentation.cy.elements().clone());
        this.newCy.elements().removeClass('filtered'); // make all filtered elements not filtered anymore
        this.filterByCriterion((node) => {
            const grapholNode = this.getGrapholElement(node.id());
            if (!grapholNode)
                return false;
            switch (grapholNode.type) {
                case GrapholTypesEnum.COMPLEMENT:
                case GrapholTypesEnum.VALUE_DOMAIN:
                case GrapholTypesEnum.ROLE_CHAIN:
                case GrapholTypesEnum.ENUMERATION:
                case GrapholTypesEnum.KEY:
                    return true;
                case GrapholTypesEnum.DOMAIN_RESTRICTION:
                case GrapholTypesEnum.RANGE_RESTRICTION:
                    if (grapholNode.displayedName == 'forall')
                        return true;
                    else
                        return false;
                default:
                    return false;
            }
        });
        this.filterByCriterion(this.isQualifiedRestriction);
        this.filterByCriterion(this.isCardinalityRestriction);
        this.filterByCriterion(this.inputEdgesBetweenRestrictions);
        this.deleteFilteredElements();
        this.simplifyDomainAndRange();
        this.simplifyComplexHierarchies();
        this.simplifyUnions();
        this.simplifyIntersections();
        this.simplifyRoleInverse();
        return this.result;
    }
    simplifyDomainAndRange() {
        /**
         * Get all input incomers and pick the one coming from a object/data property
         * @param restriction
         * @returns the input from object/data property to the given restriction
         */
        const getInputEdgeFromPropertyToRestriction = (restriction) => {
            //let edgeResult: EdgeSingular
            // source is any obj/data property node connected to restriction by input edge
            const edgeResult = restriction.incomers('edge')
                .filter(edge => {
                const grapholEdge = this.getGrapholElement(edge.id());
                const grapholSource = this.getGrapholElement(edge.data().source);
                return grapholEdge.is(GrapholTypesEnum.INPUT) &&
                    (grapholSource.is(GrapholTypesEnum.OBJECT_PROPERTY) || grapholSource.is(GrapholTypesEnum.DATA_PROPERTY));
            });
            if (!edgeResult.empty()) {
                return this.getGrapholElement(edgeResult.id());
            }
        };
        /**
         * Given a domain/range restriction, we need each edge on the restriction of type != input
         * to be transformed into a ROLE EDGE going into the object/data property using the
         * input edge from property -> restriction (here we assume it is already been reversed).
         * @param edgeOnRestriction an edge connected to the restriction node, will be transformed into a role edge
         * @param edgeFromProperty the edge from property to restriction (reversed, so it's going from restriction to property)
         * @param restrictionNode the restriction node, must become a breakpoint
         */
        const transformIntoRoleEdge = (edgeOnRestriction, edgeFromProperty, restrictionNode) => {
            // let edges = []
            // let new_edge = null
            let edgeOnRestrictionSourceNode = this.getGrapholElement(edgeOnRestriction.sourceId);
            let edgeOnRestrictionTargetNode = this.getGrapholElement(edgeOnRestriction.targetId);
            const propertyNode = this.getGrapholElement(edgeFromProperty.targetId);
            /**
             * if the edge to restriction is between two existential, remove it and filter the other existential
             */
            if (this.isRestriction(edgeOnRestrictionSourceNode) && this.isRestriction(edgeOnRestrictionTargetNode)) {
                this.newCy.remove(`#${edgeOnRestriction.id}`);
                this.result.grapholElements.delete(edgeOnRestriction.id);
                return;
            }
            if (edgeOnRestriction.targetId !== restrictionNode.id) {
                this.reverseEdge(edgeOnRestriction);
                edgeOnRestrictionSourceNode = this.getGrapholElement(edgeOnRestriction.sourceId);
            }
            edgeOnRestriction.targetId = propertyNode.id;
            // move attribute on restriction node position
            if (propertyNode.is(GrapholTypesEnum.DATA_PROPERTY)) {
                edgeOnRestriction.type = 'attribute-edge';
                propertyNode.x = restrictionNode.position.x;
                propertyNode.y = restrictionNode.position.y;
                this.result.updateElement(propertyNode);
                //new_edge = edges[0]
            }
            if (propertyNode.is(GrapholTypesEnum.OBJECT_PROPERTY)) {
                edgeOnRestriction.type = restrictionNode.type;
                // restriction node must become a new breakpoint
                edgeOnRestriction.addBreakPoint(new Breakpoint(restrictionNode.x, restrictionNode.y));
                // each breakpoint from restriction to property must become a breakpoint for the result edge
                edgeFromProperty.breakpoints.forEach(breakpoint => {
                    edgeOnRestriction.addBreakPoint(breakpoint);
                });
            }
            edgeOnRestriction.computeBreakpointsDistancesWeights(edgeOnRestrictionSourceNode.position, propertyNode.position);
            this.result.updateElement(edgeOnRestriction);
        };
        //let eles = cy.$('*')
        let grapholRestrictionNode;
        // select domain and range restrictions
        this.result.cy.nodes().forEach(restriction => {
            grapholRestrictionNode = this.getGrapholElement(restriction.id());
            if (!this.isRestriction(grapholRestrictionNode))
                return;
            const inputGrapholEdge = getInputEdgeFromPropertyToRestriction(restriction);
            if (!inputGrapholEdge)
                return;
            // Final role edge will be concatenated with this one, 
            // so we need to revert it to make it point to the obj/data property
            this.reverseEdge(inputGrapholEdge);
            // create a new role edge concatenating each edge different from inputs
            // to the input edge from object/data property to restriction node
            restriction.connectedEdges().filter(edge => !this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INPUT))
                .forEach((edgeToRestriction, i) => {
                const grapholEdgeToRestriction = this.getGrapholElement(edgeToRestriction.id());
                if (!isGrapholEdge(grapholEdgeToRestriction) || !isGrapholNode(grapholRestrictionNode))
                    return;
                transformIntoRoleEdge(grapholEdgeToRestriction, inputGrapholEdge, grapholRestrictionNode);
            });
            cytoscapeFilter(restriction.id(), '', this.newCy);
            this.deleteFilteredElements();
        });
        this.deleteFilteredElements();
    }
    reverseEdge(edge) {
        //let new_edge = edge.json()
        let sourceIdAux = edge.sourceId;
        edge.sourceId = edge.targetId;
        edge.targetId = sourceIdAux;
        let sourceEndpointAux = edge.sourceEndpoint;
        edge.sourceEndpoint = edge.targetEndpoint;
        edge.targetEndpoint = sourceEndpointAux;
        edge.controlpoints = edge.controlpoints.reverse();
        edge.breakpoints.forEach(breakpoint => {
            const source = this.newCy.$id(edge.sourceId);
            const target = this.newCy.$id(edge.targetId);
            // update distances and weights
            breakpoint.setSourceTarget(source.position(), target.position());
        });
        // new_edge.data.breakpoints = edge.data('breakpoints').reverse()
        // if (edge.data('segment_distances')) {
        //   new_edge.data.segment_distances = []
        //   new_edge.data.segment_weights = []
        //   new_edge.data.breakpoints.forEach( breakpoint => {
        //     let aux = getDistanceWeight(edge.source().position(), edge.target().position(), breakpoint)
        //     new_edge.data.segment_distances.push(aux[0])
        //     new_edge.data.segment_weights.push(aux[1])
        //   })
        // }
    }
    simplifyComplexHierarchies() {
        this.newCy.nodes().forEach(node => {
            if (this.isComplexHierarchy(node)) {
                this.replicateAttributes(node);
                cytoscapeFilter(node.id(), '', this.newCy);
            }
        });
        this.deleteFilteredElements();
    }
    isComplexHierarchy(node) {
        const grapholNode = this.getGrapholElement(node.id());
        if (!grapholNode || (!grapholNode.is(GrapholTypesEnum.UNION) &&
            !grapholNode.is(GrapholTypesEnum.DISJOINT_UNION) &&
            !grapholNode.is(GrapholTypesEnum.INTERSECTION)))
            return false;
        // Complex hierarchy if it has something different from a class as input
        const inputNodesNotConcepts = node.incomers(`edge`)
            .filter(edge => this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INPUT))
            .sources()
            .filter(node => !this.getGrapholElement(node.id()).is(GrapholTypesEnum.CLASS));
        return !inputNodesNotConcepts.empty();
    }
    replicateAttributes(node) {
        /**
         * Given a hierarchy node, recursively retrieve all input classes nodes
         * @param node the hierearchy node
         * @returns a collection of classes nodes
         */
        const getAllInputClasses = (node) => {
            let allInputClasses = node.cy().collection();
            let inputEdges = node.incomers('edge').filter(edge => this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INPUT));
            allInputClasses = allInputClasses.union(inputEdges.sources().filter(node => this.getGrapholElement(node.id()).is(GrapholTypesEnum.CLASS)));
            inputEdges.sources().difference(allInputClasses).forEach(constructor => {
                allInputClasses = allInputClasses.union(getAllInputClasses(constructor));
            });
            return allInputClasses;
        };
        /**
         *
         * @param concept
         * @param attribute
         * @param i
         */
        const addAttribute = (concept, attribute, edgeType, i) => {
            const newAttribute = new GrapholNode(`duplicate-${attribute.id()}-${i}`, GrapholTypesEnum.DATA_PROPERTY);
            const newAttributeEdge = new GrapholEdge(`e-${concept.id()}-${attribute.id()}`, edgeType);
            newAttribute.originalId = attribute.id();
            newAttribute.x = concept.position().x;
            newAttribute.y = concept.position().y;
            Object.entries(attribute.data()).forEach(([key, value]) => {
                if (key !== 'id' && key !== 'originalId' && key !== 'type')
                    newAttribute[key] = value;
            });
            newAttributeEdge.sourceId = concept.id();
            newAttributeEdge.targetId = newAttribute.id;
            this.result.addElement(newAttribute);
            this.result.addElement(newAttributeEdge);
            this.newCy.$id(newAttribute.id).addClass('repositioned');
            // recursively add new attributes connected to replicated attributes by inclusions
            if (!attribute.hasClass('repositioned')) {
                attribute.neighborhood('node').filter(node => this.getGrapholElement(node.id()).is(GrapholTypesEnum.DATA_PROPERTY)).forEach((inclusion_attribute, j) => {
                    if (allAttributes.contains(inclusion_attribute)) {
                        return;
                    }
                    const edgeBetweenAttributes = attribute.edgesTo(inclusion_attribute)[0];
                    if (edgeBetweenAttributes) {
                        addAttribute(this.newCy.$id(newAttribute.id), inclusion_attribute, edgeBetweenAttributes.data().type, i);
                        inclusion_attribute.addClass('repositioned');
                        allInclusionAttributes = allInclusionAttributes.union(inclusion_attribute);
                    }
                });
            }
        };
        let allClasses = getAllInputClasses(node);
        let allAttributes = node.neighborhood(`node`).filter(node => this.getGrapholElement(node.id()).is(GrapholTypesEnum.DATA_PROPERTY));
        let allInclusionAttributes = this.newCy.collection();
        allAttributes.forEach((attribute) => {
            allClasses.forEach((concept, j) => {
                addAttribute(concept, attribute, 'attribute-edge', j);
            });
            attribute.addClass('repositioned');
            allInclusionAttributes.addClass('repositioned');
        });
        this.deleteElements(allAttributes);
        this.deleteElements(allInclusionAttributes);
    }
    simplifyUnions() {
        this.newCy.nodes().forEach(union => {
            const grapholUnion = this.getGrapholElement(union.id());
            if (!grapholUnion || !isGrapholNode(grapholUnion) ||
                (!grapholUnion.is(GrapholTypesEnum.UNION) && !grapholUnion.is(GrapholTypesEnum.DISJOINT_UNION)))
                return;
            //grapholUnion.height = grapholUnion.width = 0.1
            //makeDummyPoint(union)
            //union.incomers('edge[type = "input"]').data('type', 'easy_input')
            // delete incoming inclusions
            union.incomers('edge').forEach(edge => {
                const grapholEdge = this.getGrapholElement(edge.id());
                if (grapholEdge.is(GrapholTypesEnum.INCLUSION)) {
                    this.deleteElement(edge);
                }
            });
            // process equivalence edges
            union.connectedEdges('edge').forEach(edge => {
                const grapholEdge = this.getGrapholElement(edge.id());
                // if it's equivalence add 'C' and reverse if needed
                if (grapholEdge.is(GrapholTypesEnum.EQUIVALENCE)) {
                    grapholEdge.type = grapholUnion.type;
                    grapholEdge.targetLabel = 'C';
                    // the edge must have as source the union node
                    if (grapholEdge.sourceId != grapholUnion.id) {
                        this.reverseEdge(grapholEdge);
                    }
                    this.result.updateElement(grapholEdge);
                    return;
                }
                // if it's outgoing and of type inclusion
                if (grapholEdge.sourceId === grapholUnion.id && grapholEdge.is(GrapholTypesEnum.INCLUSION)) {
                    grapholEdge.type = grapholUnion.type;
                    this.result.updateElement(grapholEdge);
                }
            });
            // process inclusion edges
            // union.outgoers('edge').forEach(inclusion => {
            //   inclusion.addClass('hierarchy')
            //   if (union.data('type') == GrapholTypesEnum.DISJOINT_UNION)
            //     inclusion.addClass('disjoint')
            // })
            // if (union.data('label'))
            //   union.data('label', '')
            //grapholUnion.displayedName = undefined
            this.replicateAttributes(union);
            // replicate role tipization on input classes
            this.replicateRoleTypizations(union);
            this.result.updateElement(grapholUnion);
            const numberEdgesNotInput = union.connectedEdges().filter(edge => !this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INPUT)).size();
            if (numberEdgesNotInput <= 0) {
                this.deleteElement(union);
            }
            // if the union has not any connected non-input edges, then remove it
            // if (union.connectedEdges('[type !*= "input"]').size() == 0)
            //   cy.remove(union)
        });
    }
    simplifyIntersections() {
        this.newCy.nodes().forEach(and => {
            const grapholAndNode = this.getGrapholElement(and.id());
            if (!grapholAndNode || !grapholAndNode.is(GrapholTypesEnum.INTERSECTION))
                return;
            this.replicateAttributes(and);
            this.replicateRoleTypizations(and);
            // if there are no incoming inclusions or equivalence and no equivalences connected,
            // remove the intersection
            const incomingInclusions = and.incomers('edge').filter(edge => this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INCLUSION));
            const connectedEquivalences = and.connectedEdges().filter(edge => this.getGrapholElement(edge.id()).is(GrapholTypesEnum.EQUIVALENCE));
            const incomingUnionEdges = and.incomers('edge').filter(edge => {
                const grapholEdge = this.getGrapholElement(edge.id());
                return grapholEdge.is(GrapholTypesEnum.UNION) || grapholEdge.is(GrapholTypesEnum.DISJOINT_UNION);
            });
            const edgesToBeReplicated = incomingInclusions.union(connectedEquivalences).union(incomingUnionEdges);
            if (edgesToBeReplicated.empty()) {
                cytoscapeFilter(grapholAndNode.id, '', this.newCy);
            }
            else {
                const incomingInputs = and.incomers('edge').filter(edge => this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INPUT));
                // process incoming inclusion && connected equivalences
                edgesToBeReplicated.forEach(edge => {
                    const edgeToBeReplicated = this.getGrapholElement(edge.id());
                    /**
                     * create a new ISA edge for each input class
                     * the new edge will be a concatenation:
                     *  - ISA towards the 'and' node + input edge
                     *
                     * the input edge must be reversed
                     * In case of equivalence edge, we only consider the
                     * isa towards the 'and' node and discard the other direction
                     */
                    incomingInputs.forEach((input, i) => {
                        /**
                         * if the edge is an equivalence, we must consider it as an
                         * incoming edge in any case and ignore the opposite direction.
                         * so if the edge is outgoing from the intersection, we reverse it
                         */
                        if (edgeToBeReplicated.is(GrapholTypesEnum.EQUIVALENCE) &&
                            edgeToBeReplicated.sourceId === grapholAndNode.id) {
                            this.reverseEdge(edgeToBeReplicated);
                        }
                        // Edge concatenation: isa/equilvance + reversed input
                        const grapholInputEdge = this.getGrapholElement(input.id());
                        this.reverseEdge(grapholInputEdge);
                        grapholInputEdge.sourceId = edgeToBeReplicated.sourceId;
                        grapholInputEdge.controlpoints.unshift(...edgeToBeReplicated.controlpoints);
                        const source = this.getGrapholElement(grapholInputEdge.sourceId);
                        const target = this.getGrapholElement(grapholInputEdge.targetId);
                        grapholInputEdge.computeBreakpointsDistancesWeights(source.position, target.position);
                        grapholInputEdge.targetLabel = edgeToBeReplicated.targetLabel;
                        grapholInputEdge.type = edgeToBeReplicated.type;
                        this.result.updateElement(grapholInputEdge);
                    });
                });
                cytoscapeFilter(grapholAndNode.id, '', this.newCy);
            }
            this.deleteFilteredElements();
            this.deleteElements(edgesToBeReplicated);
        });
    }
    replicateRoleTypizations(constructorNode) {
        // replicate role tipization on input classes
        const restrictionEdges = constructorNode.connectedEdges().filter(edge => this.isRestriction(this.getGrapholElement(edge.id())));
        const inputEdges = constructorNode.incomers('edge').filter(edge => this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INPUT));
        restrictionEdges.forEach((restrictionEdge, i) => {
            const grapholRestrictionEdge = this.getGrapholElement(restrictionEdge.id());
            inputEdges.forEach((inputEdge) => {
                const grapholInputEdge = this.getGrapholElement(inputEdge.id());
                if (!grapholInputEdge)
                    return;
                const newRestrictionEdge = new GrapholEdge(`${grapholRestrictionEdge.id}-${grapholInputEdge.id}`, grapholRestrictionEdge.type);
                /**
                 * if the connected non input edge is only one (the one we are processing)
                 * then the new edge will be the concatenation of the input edge + role edge
                 */
                if (i === 0) {
                    newRestrictionEdge.controlpoints = grapholInputEdge.controlpoints.concat(grapholRestrictionEdge.controlpoints);
                }
                else {
                    newRestrictionEdge.controlpoints = [...grapholRestrictionEdge.controlpoints];
                }
                newRestrictionEdge.sourceId = grapholInputEdge.sourceId;
                newRestrictionEdge.sourceEndpoint = grapholInputEdge.sourceEndpoint
                    ? { x: grapholInputEdge.sourceEndpoint.x, y: grapholInputEdge.sourceEndpoint.y }
                    : undefined;
                newRestrictionEdge.targetEndpoint = grapholRestrictionEdge.targetEndpoint
                    ? { x: grapholRestrictionEdge.targetEndpoint.x, y: grapholRestrictionEdge.targetEndpoint.y }
                    : undefined;
                newRestrictionEdge.targetId = grapholRestrictionEdge.targetId;
                const sourceNode = this.getGrapholElement(newRestrictionEdge.sourceId);
                const targetNode = this.getGrapholElement(newRestrictionEdge.targetId);
                newRestrictionEdge.computeBreakpointsDistancesWeights(sourceNode.position, targetNode.position);
                this.result.addElement(newRestrictionEdge);
            });
            this.deleteElement(restrictionEdge);
        });
    }
    simplifyRoleInverse() {
        this.newCy.nodes().filter(node => { var _a; return (_a = this.getGrapholElement(node.id())) === null || _a === void 0 ? void 0 : _a.is(GrapholTypesEnum.ROLE_INVERSE); }).forEach(roleInverseNode => {
            // the input role is only one
            const inputEdge = roleInverseNode.incomers('edge').filter(edge => this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INPUT));
            const grapholInputEdge = this.getGrapholElement(inputEdge.id());
            // the input edge must always be reversed
            this.reverseEdge(grapholInputEdge);
            this.getGrapholElement(roleInverseNode.id());
            // for each other edge connected, create a concatenated edge
            // the edge is directed towards the input_role
            roleInverseNode.connectedEdges().filter(edge => !this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INPUT))
                .forEach((edge) => {
                const roleInverseEdge = this.getGrapholElement(edge.id());
                roleInverseEdge.type = GrapholTypesEnum.ROLE_INVERSE;
                roleInverseEdge.controlpoints = roleInverseEdge.controlpoints.concat(grapholInputEdge.controlpoints);
                roleInverseEdge.targetId = grapholInputEdge.targetId;
                const source = this.getGrapholElement(roleInverseEdge.sourceId);
                const target = this.getGrapholElement(roleInverseEdge.targetId);
                roleInverseEdge.computeBreakpointsDistancesWeights(source.position, target.position);
                roleInverseEdge.displayedName = 'inverse Of';
                this.result.updateElement(roleInverseEdge);
            });
            this.deleteElement(inputEdge);
            this.deleteElement(roleInverseNode);
            // if (new_edges_count > 1) {
            //   cy.remove(inputEdge)
            //   makeDummyPoint(roleInverseNode)
            //   roleInverseNode.data('label', 'inverse Of')
            //   roleInverseNode.data('labelXpos', 0)
            //   roleInverseNode.data('labelYpos', 0)
            //   roleInverseNode.data('text_background', true)
            // } else {
            //   if (inputEdge.source())
            //     inputEdge.source().connectedEdges('edge.inverse-of').data('displayed_name','inverse Of')
            //   cy.remove(roleInverseNode)
            // }
        });
    }
}

class FloatyTransformer extends BaseGrapholTransformer {
    get newCy() { return this.result.cy; }
    transform(diagram) {
        this.result = new DiagramRepresentation(floatyOptions);
        let liteRepresentation = diagram.representations.get(RendererStatesEnum.GRAPHOL_LITE);
        if (!liteRepresentation || liteRepresentation.grapholElements.size === 0) {
            liteRepresentation = new LiteTransformer().transform(diagram);
            diagram.representations.set(RendererStatesEnum.GRAPHOL_LITE, liteRepresentation);
        }
        this.result.grapholElements = new Map(liteRepresentation.grapholElements);
        this.newCy.add(liteRepresentation.cy.elements().clone());
        this.newCy.elements().removeClass('filtered'); // make all filtered elements not filtered anymore
        // remember original positions
        // this.newCy.$('node').forEach( node => {
        //   node.data('original-position', JSON.stringify(node.position()))
        // })
        this.filterByCriterion(node => {
            return this.getGrapholElement(node.id()) === undefined;
        });
        this.makeEdgesStraight();
        this.simplifyRolesFloat();
        // this.simplifyHierarchiesFloat(cy)
        // this.simplifyAttributesFloat(cy)
        // cy.edges().removeData('segment_distances')
        // cy.edges().removeData('segment_weights')
        // cy.edges().removeData('target_endpoint')
        // cy.edges().removeData('source_endpoint')
        //cy.$(`[type = "${GrapholTypesEnum.CONCEPT}"]`).addClass('bubble')
        this.newCy.elements().unlock();
        return this.result;
    }
    makeEdgesStraight() {
        this.result.cy.$('edge').forEach(edge => {
            const grapholEdge = this.getGrapholElement(edge.id());
            grapholEdge.controlpoints = [];
            grapholEdge.targetEndpoint = undefined;
            grapholEdge.sourceEndpoint = undefined;
            this.result.updateElement(grapholEdge);
        });
    }
    simplifyRolesFloat() {
        let objectProperties = this.newCy.nodes().filter(node => {
            const grapholNode = this.getGrapholElement(node.id());
            return grapholNode && grapholNode.is(GrapholTypesEnum.OBJECT_PROPERTY);
        });
        objectProperties.forEach(objectProperty => {
            let domains = this.getDomainsOfObjectProperty(objectProperty);
            let ranges = this.getRangesOfObjectProperty(objectProperty);
            if (domains && ranges)
                this.connectDomainsRanges(domains, ranges, objectProperty);
        });
        //cy.remove(objectProperties)
        this.deleteElements(objectProperties);
    }
    connectDomainsRanges(domains, ranges, objectProperty) {
        let grapholDomainNode, grapholRangeNode, newId;
        domains.forEach((domain) => {
            grapholDomainNode = this.getGrapholElement(domain.id());
            ranges.forEach((range, i) => {
                grapholRangeNode = this.getGrapholElement(range.id());
                newId = `e-${objectProperty.id()}-${grapholDomainNode.id}-${grapholRangeNode.id}-${i}`;
                let newGrapholEdge = new GrapholEdge(newId, GrapholTypesEnum.OBJECT_PROPERTY);
                newGrapholEdge.sourceId = grapholDomainNode.id;
                newGrapholEdge.targetId = grapholRangeNode.id;
                Object.entries(objectProperty.data()).forEach(([key, value]) => {
                    switch (key) {
                        case 'id':
                        case 'labelXpos':
                        case 'labelYpos':
                        case 'labelXcentered':
                        case 'labelYcentered':
                        case 'shape':
                            break;
                        default:
                            newGrapholEdge[key] = value;
                    }
                });
                newGrapholEdge.originalId = objectProperty.id().toString();
                this.result.addElement(newGrapholEdge);
                const newAddedCyElement = this.newCy.$id(newGrapholEdge.id);
                newAddedCyElement.data().iri = objectProperty.data().iri;
                if (newGrapholEdge.sourceId === newGrapholEdge.targetId) {
                    let loop_edge = this.newCy.$id(newGrapholEdge.id);
                    loop_edge.data('control_point_step_size', grapholDomainNode.width);
                }
            });
        });
    }
    getDomainsOfObjectProperty(objectProperty) {
        if (!objectProperty || objectProperty.empty())
            return null;
        let domains = objectProperty.incomers(`edge`).filter(edge => this.getGrapholElement(edge.id()).is(GrapholTypesEnum.DOMAIN_RESTRICTION)).sources();
        const fathers = this.getFathers(objectProperty);
        let fathersDomains = this.newCy.collection();
        fathers.forEach(father => {
            const newDomains = this.getDomainsOfObjectProperty(father);
            if (newDomains)
                fathersDomains = fathersDomains.union(newDomains);
        });
        return domains.union(fathersDomains);
    }
    getRangesOfObjectProperty(objectProperty) {
        if (!objectProperty || objectProperty.empty())
            return;
        let ranges = objectProperty.incomers(`edge`).filter(edge => this.getGrapholElement(edge.id()).is(GrapholTypesEnum.RANGE_RESTRICTION)).sources();
        const fathers = this.getFathers(objectProperty);
        let fatherRanges = this.newCy.collection();
        fathers.forEach(father => {
            const newRanges = this.getRangesOfObjectProperty(father);
            if (newRanges)
                fatherRanges = fatherRanges.union(newRanges);
        });
        return ranges.union(fatherRanges);
    }
    getFathers(node) {
        return node.outgoers('edge').filter(edge => this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INCLUSION)).targets();
    }
}

cytoscape.use(automove);
class FloatyRendererState extends BaseRenderer {
    constructor() {
        super(...arguments);
        this.id = RendererStatesEnum.FLOATY;
        this.filterManager = new FloatyFilterManager();
        this.grabHandler = (e) => {
            if (this.dragAndPin)
                e.target.data('old_pos', JSON.stringify(e.target.position()));
        };
        this.freeHandler = (e) => {
            if (this.dragAndPin) {
                let actual_pos = JSON.stringify(e.target.position());
                if (e.target.data('old_pos') !== actual_pos) {
                    this.pinNode(e.target);
                }
                e.target.removeData('old_pos');
            }
        };
        this.defaultLayoutOptions = {
            name: 'cola',
            avoidOverlap: false,
            edgeLength: function (edge) {
                let crowdnessFactor = edge.target().neighborhood(`[type = "${GrapholTypesEnum.OBJECT_PROPERTY}"]`).length +
                    edge.source().neighborhood(`[type = "${GrapholTypesEnum.OBJECT_PROPERTY}"]`).length;
                crowdnessFactor = crowdnessFactor > 5 ? crowdnessFactor * 10 : 0;
                if (edge.hasClass('role')) {
                    return 250 + edge.data('displayedName').length * 4 + crowdnessFactor;
                }
                else if (edge.target().data('type') == GrapholTypesEnum.DATA_PROPERTY ||
                    edge.source().data('type') == GrapholTypesEnum.DATA_PROPERTY)
                    return 150;
                else {
                    return 200 + crowdnessFactor;
                }
            },
            fit: true,
            maxSimulationTime: 4000,
            infinite: false,
            handleDisconnected: true,
            centerGraph: false,
        };
        this.automoveOptions = {
            nodesMatching: (node) => { var _a; return (_a = this.renderer.cy) === null || _a === void 0 ? void 0 : _a.$(':grabbed').neighborhood(`[type = "${GrapholTypesEnum.DATA_PROPERTY}"]`).has(node); },
            reposition: 'drag',
            dragWith: `[type ="${GrapholTypesEnum.CLASS}"][iri]`
        };
    }
    set renderer(newRenderer) {
        super.renderer = newRenderer;
        if (!newRenderer.renderStateData[this.id]) {
            newRenderer.renderStateData[this.id] = {};
            newRenderer.renderStateData[this.id].popperContainers = new Map();
            this.floatyLayoutOptions = this.defaultLayoutOptions;
        }
    }
    get renderer() { return super.renderer; }
    transformOntology(ontology) {
        ontology.diagrams.forEach(diagram => {
            const floatyTransformer = new FloatyTransformer();
            diagram.representations.set(this.id, floatyTransformer.transform(diagram));
        });
    }
    runLayout() {
        var _a;
        if (!this.renderer.cy)
            return;
        (_a = this._layout) === null || _a === void 0 ? void 0 : _a.stop();
        this._layout = this.renderer.cy.elements().layout(this.floatyLayoutOptions);
        this._layout.run();
    }
    render() {
        var _a;
        if (!this.renderer.diagram)
            return;
        let floatyRepresentation = this.renderer.diagram.representations.get(this.id);
        if (!floatyRepresentation) {
            const floatyTransformer = new FloatyTransformer();
            floatyRepresentation = floatyTransformer.transform(this.renderer.diagram);
            this.renderer.diagram.representations.set(this.id, floatyRepresentation);
        }
        this.renderer.cy = floatyRepresentation.cy;
        this.renderer.mount();
        if (!floatyRepresentation.hasEverBeenRendered) {
            this.floatyLayoutOptions.fit = true;
            this.runLayout();
            if (this.isLayoutInfinite) {
                setTimeout(() => this.renderer.fit(), 1000);
            }
            this.popperContainers.set(this.renderer.diagram.id, document.createElement('div'));
            this.setDragAndPinEventHandlers();
            this.renderer.cy.automove(this.automoveOptions);
        }
        if (this.popperContainer)
            (_a = this.renderer.cy.container()) === null || _a === void 0 ? void 0 : _a.appendChild(this.popperContainer);
        if (!this.dragAndPin)
            this.unpinAll();
        if (this.isLayoutInfinite) {
            this.floatyLayoutOptions.fit = false;
            this.runLayout();
        }
        floatyRepresentation.hasEverBeenRendered = true;
    }
    stopRendering() {
        var _a;
        (_a = this._layout) === null || _a === void 0 ? void 0 : _a.stop();
    }
    getGraphStyle(theme) {
        return floatyStyle(theme);
    }
    stopLayout() {
        var _a;
        (_a = this._layout) === null || _a === void 0 ? void 0 : _a.stop();
        this.floatyLayoutOptions.infinite = false;
    }
    runLayoutInfinitely() {
        this.floatyLayoutOptions.infinite = true;
        this.floatyLayoutOptions.fit = false;
        this.runLayout();
    }
    pinNode(node) {
        if (!node || !this.renderer.cy || (node === null || node === void 0 ? void 0 : node.data().pinned))
            return;
        node.lock();
        node.data("pinned", true);
        node.unlockButton = node.popper({
            content: () => {
                var _a;
                if (!this.renderer.cy)
                    return;
                let dimension = node.data('width') / 9 * this.renderer.cy.zoom();
                let div = document.createElement('div');
                div.style.background = node.style('border-color');
                div.style.borderRadius = '100%';
                div.style.padding = '5px';
                div.style.cursor = 'pointer';
                div.style.boxSizing = 'content-box';
                div.setAttribute('title', 'Unlock Node');
                div.innerHTML = `<span class="popper-icon">${lock_open}</span>`;
                this.setPopperStyle(dimension, div);
                div.onclick = () => this.unpinNode(node);
                (_a = this.popperContainer) === null || _a === void 0 ? void 0 : _a.appendChild(div);
                return div;
            },
        });
        node.on('position', () => this.updatePopper(node));
        this.renderer.cy.on('pan zoom resize', () => this.updatePopper(node));
    }
    unpinAll() {
        var _a;
        (_a = this.renderer.cy) === null || _a === void 0 ? void 0 : _a.$('[?pinned]').each(node => this.unpinNode(node));
    }
    setPopperStyle(dim, popper) {
        let icon = popper.querySelector('.popper-icon > svg');
        icon.style.display = 'inherit';
        icon.style.color = 'var(--gscape-color-fg-on-emphasis)';
        if (dim > 2) {
            popper.style.width = dim + 'px';
            popper.style.height = dim + 'px';
            popper.style.display = 'flex';
            if (dim > 8) {
                icon.setAttribute('width', dim + 'px');
                icon.setAttribute('height', dim + 'px');
            }
            else if (dim - 10 > 0) {
                icon.setAttribute('width', (dim - 10) + 'px');
                icon.setAttribute('height', (dim - 10) + 'px');
            }
            else {
                icon.style.display = 'none';
            }
        }
        else {
            icon.style.display = 'none';
            popper.style.display = 'none';
        }
    }
    updatePopper(node) {
        if (!node.unlockButton || !this.renderer.cy)
            return;
        let unlockButton = node.unlockButton;
        let dimension = node.data('width') / 9 * this.renderer.cy.zoom();
        this.setPopperStyle(dimension, unlockButton.state.elements.popper);
        unlockButton.update();
    }
    unpinNode(node) {
        this.removeUnlockButton(node);
        node.unlock();
        node.data("pinned", false);
    }
    removeUnlockButton(node) {
        if (node.unlockButton) {
            node.unlockButton.state.elements.popper.remove();
            node.unlockButton.destroy();
            node.unlockButton = null;
        }
    }
    setDragAndPinEventHandlers() {
        var _a, _b;
        (_a = this.renderer.cy) === null || _a === void 0 ? void 0 : _a.on('grab', this.grabHandler);
        (_b = this.renderer.cy) === null || _b === void 0 ? void 0 : _b.on('free', this.freeHandler);
        // this.renderer.cy.$('[?pinned]').each(n => {
        //   //n.on('position', () => this.updatePopper(n))
        //   this.renderer.cy.on('pan zoom resize', () => this.updatePopper(n))
        // })
    }
    get floatyLayoutOptions() {
        return this.renderer.renderStateData[this.id].layoutOptions;
    }
    set floatyLayoutOptions(newOptions) {
        this.renderer.renderStateData[this.id].layoutOptions = newOptions;
    }
    get isLayoutInfinite() {
        return this.floatyLayoutOptions.infinite ? true : false;
    }
    get dragAndPin() { return this.renderer.renderStateData[this.id].dragAndPing; }
    set dragAndPin(isActive) {
        this.renderer.renderStateData[this.id].dragAndPing = isActive;
        if (!isActive)
            this.unpinAll();
    }
    get popperContainer() {
        if (this.renderer.diagram)
            return this.popperContainers.get(this.renderer.diagram.id);
    }
    get popperContainers() {
        return this.renderer.renderStateData[this.id].popperContainers;
    }
    get layout() {
        return this._layout;
    }
}

class GrapholFilterManager extends BaseFilterManager {
    filterActivation(filter) {
        var _a;
        if (!super.filterActivation(filter))
            return false;
        if (filter.locked) {
            console.warn(`Filter has been locked and cannot be applied at the moment`);
            return false;
        }
        if (filter.key === DefaultFilterKeyEnum.DATA_PROPERTY) {
            // VALUE DOMAIN filter cannot be changed if data-property filter has been activated
            (_a = this.filters.get(DefaultFilterKeyEnum.VALUE_DOMAIN)) === null || _a === void 0 ? void 0 : _a.lock();
        }
        return true;
    }
    filterDeactivation(filter) {
        var _a;
        if (!super.filterDeactivation(filter))
            return false;
        if (filter.key === DefaultFilterKeyEnum.DATA_PROPERTY) {
            // VALUE DOMAIN filter cannot be changed if data-property filter has been activated
            (_a = this.filters.get(DefaultFilterKeyEnum.VALUE_DOMAIN)) === null || _a === void 0 ? void 0 : _a.unlock();
        }
        return true;
    }
    get filters() { return this._filters; }
    set filters(filters) {
        var _a, _b;
        this._filters = filters;
        filters.forEach(filter => {
            filter.unlock();
        });
        if ((_a = filters.get(DefaultFilterKeyEnum.DATA_PROPERTY)) === null || _a === void 0 ? void 0 : _a.active) {
            (_b = filters.get(DefaultFilterKeyEnum.VALUE_DOMAIN)) === null || _b === void 0 ? void 0 : _b.lock();
        }
    }
}

class GrapholRendererState extends BaseRenderer {
    constructor() {
        super(...arguments);
        this.id = RendererStatesEnum.GRAPHOL;
        this.cyConfig = cytoscapeDefaultConfig;
        this.filterManager = new GrapholFilterManager();
    }
    render() {
        var _a;
        if (!this.renderer.diagram)
            return;
        const grapholRepresentation = this.renderer.diagram.representations.get(this.id);
        if (!grapholRepresentation)
            return;
        this.renderer.cy = grapholRepresentation.cy;
        this.renderer.mount();
        if (!grapholRepresentation.hasEverBeenRendered) {
            this.renderer.fit();
        }
        if (this.renderer.diagram.lastViewportState) {
            (_a = this.renderer.cy) === null || _a === void 0 ? void 0 : _a.viewport(this.renderer.diagram.lastViewportState);
        }
        grapholRepresentation.hasEverBeenRendered = true;
    }
    stopRendering() {
        if (this.renderer.cy && this.renderer.diagram) {
            this.renderer.diagram.lastViewportState = {
                pan: this.renderer.cy.pan(),
                zoom: this.renderer.cy.zoom(),
            };
        }
    }
    runLayout() {
        throw new Error("Method not implemented.");
    }
    stopLayout() {
        throw new Error("Method not implemented.");
    }
    getGraphStyle(theme) {
        return grapholStyle(theme);
    }
    transformOntology(ontology) { }
}

function computeHierarchies(ontology) {
    var _a;
    const unionNodeSelector = `node[type = "${GrapholTypesEnum.UNION}"], node[type = "${GrapholTypesEnum.DISJOINT_UNION}"]`;
    const unionEdgeSelector = `edge[type = "${GrapholTypesEnum.UNION}"], edge[type = "${GrapholTypesEnum.DISJOINT_UNION}"]`;
    for (const diagram of ontology.diagrams) {
        (_a = diagram.representations.get(RendererStatesEnum.FLOATY)) === null || _a === void 0 ? void 0 : _a.cy.$(unionNodeSelector).forEach(unionNode => {
            const hierarchy = new Hierarchy(unionNode.data().type);
            hierarchy.id = `${unionNode.id()}-${diagram.id}`;
            unionNode.connectedEdges(`[type = "${GrapholTypesEnum.INPUT}"]`).sources().forEach(inputNode => {
                var _a;
                if (inputNode.data().iri) {
                    if (!ontology.hierarchiesBySubclassMap.get(inputNode.data().iri)) {
                        ontology.hierarchiesBySubclassMap.set(inputNode.data().iri, []);
                    }
                    hierarchy.addInput(inputNode.data().iri);
                    (_a = ontology.hierarchiesBySubclassMap.get(inputNode.data().iri)) === null || _a === void 0 ? void 0 : _a.push(hierarchy);
                }
            });
            unionNode.outgoers(unionEdgeSelector).forEach(inclusionEdge => {
                var _a;
                const superClass = inclusionEdge.target();
                if (superClass.data().iri) {
                    if (!ontology.hierarchiesBySuperclassMap.get(superClass.data().iri)) {
                        ontology.hierarchiesBySuperclassMap.set(superClass.data().iri, []);
                    }
                    hierarchy.addSuperclass(superClass.data().iri, inclusionEdge.data().targetLabel === 'C');
                    (_a = ontology.hierarchiesBySuperclassMap.get(superClass.data().iri)) === null || _a === void 0 ? void 0 : _a.push(hierarchy);
                }
            });
        });
    }
}

function incrementalStyle (theme) {
    const baseStyle = floatyStyle(theme);
    const incrementalStyle = [
        {
            selector: '.incremental-expanded-class',
            style: {
                'border-width': 4,
                'background-blacken': 0.1,
            }
        },
        {
            selector: `node[type = "${GrapholTypesEnum.CLASS_INSTANCE}"]`,
            style: {
                backgroundColor: theme.getColour(ColoursNames.class_instance),
                "border-color": theme.getColour(ColoursNames.class_instance_contrast),
            }
        },
        {
            selector: `node[type = "${GrapholTypesEnum.CLASS_INSTANCE}"]:selected`,
            style: {
                'text-background-color': theme.getColour(ColoursNames.bg_graph),
                'text-background-opacity': 1,
            }
        },
        {
            selector: `edge[type = "${GrapholTypesEnum.INSTANCE_OF}"]`,
            style: {
                "target-arrow-shape": 'triangle',
                'target-arrow-fill': 'filled',
                'line-color': theme.getColour(ColoursNames.class_instance_contrast),
                'target-arrow-color': theme.getColour(ColoursNames.class_instance_contrast)
            }
        }
    ];
    return baseStyle.concat(incrementalStyle);
}

/**
 * Incremental should not allow any filter and widgtet should not even be visible
 */
class IncrementalFilterManager extends BaseFilterManager {
    constructor() {
        super(...arguments);
        this.lockedFilters = Object.keys(DefaultFilterKeyEnum).map(k => DefaultFilterKeyEnum[k]);
    }
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
class IncrementalRendererState extends FloatyRendererState {
    constructor() {
        super(...arguments);
        this.id = RendererStatesEnum.INCREMENTAL;
        this.filterManager = new IncrementalFilterManager();
    }
    render() {
        var _a, _b;
        this.overrideDiagram();
        if (this.popperContainer) {
            (_b = (_a = this.renderer.cy) === null || _a === void 0 ? void 0 : _a.container()) === null || _b === void 0 ? void 0 : _b.appendChild(this.popperContainer);
        }
    }
    runLayout() {
        super.runLayout();
        if (this.isLayoutInfinite) {
            this.unFreezeGraph();
        }
        else {
            this.layout.one('layoutstop', () => {
                var _a;
                if (((_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.grapholElements.size) === 1)
                    this.renderer.fit();
                this.unFreezeGraph();
            });
        }
    }
    /** lock all nodes */
    freezeGraph() {
        var _a;
        (_a = this.renderer.cy) === null || _a === void 0 ? void 0 : _a.nodes().lock();
    }
    /** unlock all nodes that are not pinned (pinned can be unlocked only with unpin) */
    unFreezeGraph() {
        var _a;
        (_a = this.renderer.cy) === null || _a === void 0 ? void 0 : _a.$("[!pinned]:locked").unlock();
    }
    stopRendering() {
        super.stopRendering();
        this.renderer.diagram = this.previousDiagram;
    }
    transformOntology(ontology) {
        // Perform floaty transformation if it has not been done yet
        if (!ontology.diagrams[0].representations.get(RendererStatesEnum.FLOATY)) {
            ontology.diagrams.forEach(diagram => {
                const floatyTransformer = new FloatyTransformer();
                diagram.representations.set(RendererStatesEnum.FLOATY, floatyTransformer.transform(diagram));
            });
            computeHierarchies(ontology);
        }
    }
    getGraphStyle(theme) {
        return incrementalStyle(theme);
    }
    overrideDiagram() {
        var _a, _b;
        if (this.renderer.diagram && ((_a = this.renderer.diagram) === null || _a === void 0 ? void 0 : _a.id) !== this.incrementalDiagram.id) {
            this.previousDiagram = this.renderer.diagram;
        }
        this.renderer.stopRendering();
        this.renderer.diagram = this.incrementalDiagram;
        this.renderer.cy = (_b = this.diagramRepresentation) === null || _b === void 0 ? void 0 : _b.cy;
        this.renderer.mount();
    }
    createNewDiagram() {
        var _a, _b, _c, _d;
        this.unpinAll();
        if (!this.incrementalDiagram)
            this.renderer.renderStateData[this.id].diagram = new IncrementalDiagram();
        else {
            (_a = this.incrementalDiagram.representation) === null || _a === void 0 ? void 0 : _a.cy.destroy();
            this.incrementalDiagram.representations.set(this.id, new DiagramRepresentation(floatyOptions));
        }
        this.overrideDiagram();
        (_b = this.diagramRepresentation) === null || _b === void 0 ? void 0 : _b.cy.on('cxttap', `node`, evt => {
            this.onContextClickCallback(evt.target);
        });
        if ((_c = this.renderer.diagram) === null || _c === void 0 ? void 0 : _c.id)
            this.popperContainers.set((_d = this.renderer.diagram) === null || _d === void 0 ? void 0 : _d.id, document.createElement('div'));
        this.setDragAndPinEventHandlers();
        this.render();
    }
    onContextClick(callback) {
        this.onContextClickCallback = callback;
    }
    get diagramRepresentation() {
        return this.incrementalDiagram.representations.get(this.id);
    }
    get incrementalDiagram() { return this.renderer.renderStateData[this.id].diagram; }
    set renderer(newRenderer) {
        super.renderer = newRenderer;
        if (!newRenderer.renderStateData[this.id]) {
            newRenderer.renderStateData[this.id] = {};
        }
        this.floatyLayoutOptions.fit = false;
        this.floatyLayoutOptions.maxSimulationTime = 1000;
        if (!newRenderer.renderStateData[this.id].diagram)
            this.createNewDiagram();
    }
    get renderer() {
        return super.renderer;
    }
}

class LiteFilterManager extends BaseFilterManager {
    constructor() {
        super(...arguments);
        this.lockedFilters = [
            DefaultFilterKeyEnum.VALUE_DOMAIN,
            DefaultFilterKeyEnum.UNIVERSAL_QUANTIFIER,
            DefaultFilterKeyEnum.COMPLEMENT,
            DefaultFilterKeyEnum.HAS_KEY,
        ];
    }
}

function liteStyle (theme) {
    const baseStyle = grapholStyle(theme);
    const liteStyle = [
        {
            selector: `edge[type = "${GrapholTypesEnum.INPUT}"]`,
            style: {
                'line-style': 'solid',
                'target-arrow-shape': 'none',
            }
        },
        {
            selector: `node[type = "${GrapholTypesEnum.UNION}"], node[type = "${GrapholTypesEnum.DISJOINT_UNION}"]`,
            style: {
                'label': '',
                'width': 0.1,
                'height': 0.1,
            }
        },
        {
            selector: `edge[type = "${GrapholTypesEnum.UNION}"], edge[type = "${GrapholTypesEnum.DISJOINT_UNION}"]`,
            style: {
                'width': 6,
                'line-style': 'solid',
                'target-arrow-shape': 'triangle',
            }
        },
        {
            selector: `edge[type = "${GrapholTypesEnum.UNION}"]`,
            style: {
                'target-arrow-fill': 'hollow',
            }
        },
        {
            selector: `edge[type = "${GrapholTypesEnum.DISJOINT_UNION}"]`,
            style: {
                'target-arrow-fill': 'filled',
            }
        },
        {
            selector: `[type = "${GrapholTypesEnum.DOMAIN_RESTRICTION}"], [type = "${GrapholTypesEnum.RANGE_RESTRICTION}"]`,
            style: {
                'line-color': theme.getColour(ColoursNames.object_property_contrast),
                'source-arrow-color': theme.getColour(ColoursNames.object_property_contrast),
                'target-arrow-color': theme.getColour(ColoursNames.object_property_contrast),
                'target-arrow-shape': 'triangle',
                'target-arrow-fill': 'filled',
                'source-arrow-shape': 'square',
                'source-arrow-fill': 'hollow',
            }
        },
        {
            selector: `[type = "${GrapholTypesEnum.RANGE_RESTRICTION}"]`,
            style: {
                'target-arrow-shape': 'square',
                'target-arrow-fill': 'filled',
                'source-arrow-shape': 'none',
            }
        },
        {
            selector: `[type = "${GrapholTypesEnum.DOMAIN_RESTRICTION}"]`,
            style: {
                'target-arrow-shape': 'square',
                'target-arrow-fill': 'hollow',
                'source-arrow-shape': 'none',
            }
        },
        {
            selector: `edge[type = "${GrapholTypesEnum.DATA_PROPERTY}"]`,
            style: {
                'line-color': theme.getColour(ColoursNames.data_property_contrast),
                'source-arrow-shape': 'none',
                'target-arrow-shape': 'none',
            }
        },
    ];
    return baseStyle.concat(liteStyle);
}

class LiteRendererState extends BaseRenderer {
    constructor() {
        super(...arguments);
        this.id = RendererStatesEnum.GRAPHOL_LITE;
        this.filterManager = new LiteFilterManager();
        this.cyConfig = cytoscapeDefaultConfig;
    }
    runLayout() {
        var _a;
        if (!this.renderer.cy)
            return;
        (_a = this._layout) === null || _a === void 0 ? void 0 : _a.stop();
        this.renderer.cy.nodes().lock();
        this._layout = this.renderer.cy.$('.repositioned').closedNeighborhood().closedNeighborhood().layout({
            name: 'cola',
            centerGraph: false,
            refresh: 3,
            maxSimulationTime: 8000,
            convergenceThreshold: 0.0000001,
            fit: false,
        });
        this.renderer.cy.$('.repositioned').unlock();
        this._layout.run();
    }
    render() {
        var _a;
        if (!this.renderer.diagram)
            return;
        let liteRepresentation = this.renderer.diagram.representations.get(this.id);
        if (!liteRepresentation)
            return;
        this.renderer.cy = liteRepresentation.cy;
        this.renderer.mount();
        if (!liteRepresentation.hasEverBeenRendered) {
            this.renderer.fit();
            this.runLayout();
        }
        if (this.renderer.diagram.lastViewportState) {
            (_a = this.renderer.cy) === null || _a === void 0 ? void 0 : _a.viewport(this.renderer.diagram.lastViewportState);
        }
        liteRepresentation.hasEverBeenRendered = true;
    }
    stopRendering() {
        if (this.renderer.cy && this.renderer.diagram) {
            this.renderer.diagram.lastViewportState = {
                pan: this.renderer.cy.pan(),
                zoom: this.renderer.cy.zoom(),
            };
        }
    }
    stopLayout() { }
    getGraphStyle(theme) {
        return liteStyle(theme);
    }
    transformOntology(ontology) {
        ontology.diagrams.forEach(diagram => {
            const liteTransformer = new LiteTransformer();
            diagram.representations.set(this.id, liteTransformer.transform(diagram));
        });
    }
    get layout() { return this._layout; }
    set layout(newLayout) { this._layout = newLayout; }
}

function setGraphEventHandlers(diagram, lifecycle, ontology) {
    diagram.representations.forEach(diagramRepresentation => {
        const cy = diagramRepresentation.cy;
        if (cy.scratch('_gscape-graph-handlers-set'))
            return;
        cy.on('select', e => {
            const grapholElement = diagramRepresentation.grapholElements.get(e.target.id());
            if (grapholElement) {
                if (grapholElement.isEntity()) {
                    const grapholEntity = ontology.getEntity(e.target.data().iri);
                    if (grapholEntity) {
                        lifecycle.trigger(LifecycleEvent.EntitySelection, grapholEntity, grapholElement);
                    }
                }
                if (isGrapholNode(grapholElement)) {
                    lifecycle.trigger(LifecycleEvent.NodeSelection, grapholElement);
                }
                if (isGrapholEdge(grapholElement)) {
                    lifecycle.trigger(LifecycleEvent.EdgeSelection, grapholElement);
                }
            }
        });
        cy.on('tap', evt => {
            if (evt.target === cy) {
                lifecycle.trigger(LifecycleEvent.BackgroundClick);
            }
        });
        cy.on('mouseover', '*', e => {
            const container = cy.container();
            if (container) {
                container.style.cursor = 'pointer';
            }
        });
        cy.on('mouseout', '*', e => {
            const container = cy.container();
            if (container) {
                container.style.cursor = 'inherit';
            }
        });
        cy.scratch('_gscape-graph-handlers-set', true);
    });
}

class ClassInstanceEntity extends GrapholEntity {
    constructor(iri, parentClassIri) {
        super(iri, GrapholTypesEnum.CLASS_INSTANCE);
        this.parentClassIris = new Set;
        if (parentClassIri)
            this.parentClassIris.add(parentClassIri);
    }
}

class GscapeContextMenu extends BaseMixin(s) {
    constructor() {
        super(...arguments);
        this.commands = [];
        this.customElements = [];
        this.showFirst = 'elements';
        this.onCommandRun = () => { };
        this.tippyMenu = tippy(document.createElement('div'));
    }
    render() {
        return y `
    <div class="gscape-panel">
      ${this.title ? y `<div>${this.title}</div>` : null}
      ${this.showFirst === 'elements' ? this.customElementsTemplate : null}
      
      ${this.showFirst === 'elements' && this.customElements.length > 0 && this.commands.length > 0
            ? y `<div class="hr"></div>` : null}

      ${this.commandsTemplate}

      ${this.showFirst === 'commands' && this.customElements.length > 0 && this.commands.length > 0
            ? y `<div class="hr"></div>` : null}


      ${this.showFirst === 'commands' ? this.customElementsTemplate : null}
    </div>
    `;
    }
    attachTo(element, commands, elements) {
        this.tippyMenu.setProps(this.cxtMenuProps);
        this.tippyMenu.setProps({ getReferenceClientRect: () => element.getBoundingClientRect() });
        this.commands = commands || [];
        this.customElements = elements || [];
        this.tippyMenu.show();
    }
    get cxtMenuProps() {
        return {
            trigger: 'manual',
            allowHTML: true,
            interactive: true,
            placement: "bottom",
            appendTo: document.querySelector('.gscape-ui') || undefined,
            // content prop can be used when the target is a single element https://atomiks.github.io/tippyjs/v6/constructor/#prop
            content: this,
            offset: [0, 0],
        };
    }
    handleCommandClick(e) {
        const command = this.commands[e.currentTarget.getAttribute('command-id')];
        if (command.select) {
            command.select();
            this.onCommandRun();
            this.tippyMenu.hide();
        }
    }
    get commandsTemplate() {
        if (this.commands.length > 0)
            return y `
        <div class="commands">
          ${this.commands.map((command, id) => {
                return y `
              <div class="command-entry actionable" command-id="${id}" @click=${this.handleCommandClick}>
                ${command.icon ? y `<span class="command-icon slotted-icon">${command.icon}</span>` : null}
                <span class="command-text">${command.content}</span>
              <div>
            `;
            })}
        </div>
      `;
    }
    get customElementsTemplate() {
        if (this.customElements.length > 0)
            return y `
        <div class="custom-elements">
          ${this.customElements.map(c => y `<div class="custom-element-wrapper">${c}</div>`)}
        </div>    
      `;
    }
}
GscapeContextMenu.properties = {
    commands: { type: Object, attribute: false },
    customElements: { type: Object, attribute: false },
    showFirst: { type: String },
};
GscapeContextMenu.styles = [
    baseStyle,
    i$1 `
      :host {
        display: flex;
        flex-direction: column;
        padding: 5px 0;
      }

      .command-entry {
        white-space: nowrap;
        cursor: pointer;
        padding: 5px 10px;
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .command-text {
        line-height: 20px;
      }

      .gscape-panel, .custom-elements {
        overflow: unset;
        display: flex;
        flex-direction: column;
        gap: 8px;
        justify-content: center;
        align-items: stretch;
      }
    `
];
customElements.define('gscape-context-menu', GscapeContextMenu);

function grapholEntityToEntityViewData (grapholEntity, grapholscape) {
    return {
        displayedName: grapholEntity.getDisplayedName(grapholscape.entityNameType, grapholscape.language, grapholscape.ontology.languages.default),
        value: grapholEntity
    };
}

var QueryPollerStatus;
(function (QueryPollerStatus) {
    QueryPollerStatus[QueryPollerStatus["TIMEOUT_EXPIRED"] = 0] = "TIMEOUT_EXPIRED";
    QueryPollerStatus[QueryPollerStatus["DONE"] = 1] = "DONE";
    QueryPollerStatus[QueryPollerStatus["RUNNING"] = 2] = "RUNNING";
    QueryPollerStatus[QueryPollerStatus["IDLE"] = 3] = "IDLE";
})(QueryPollerStatus || (QueryPollerStatus = {}));
class QueryPoller {
    constructor() {
        this.lastRequestFulfilled = true;
        // Callbacks
        this.onStop = () => { };
        this.onTimeoutExpiration = () => { };
        this.onError = () => { };
        this.status = QueryPollerStatus.IDLE;
    }
    poll() {
        this.status = QueryPollerStatus.RUNNING;
        fetch(this.request)
            .then((response) => {
            response.json().then((result) => {
                if (this.isResultError(result)) {
                    this.triggerError(result);
                }
                else {
                    this.lastRequestFulfilled = true;
                    this._result = result;
                    this.onNewResults(result);
                    if (this.stopCondition()) {
                        this.stop();
                    }
                }
            });
        })
            .catch(error => this.triggerError(error));
    }
    start() {
        this.interval = setInterval(() => {
            if (this.lastRequestFulfilled) {
                this.lastRequestFulfilled = false;
                this.poll();
            }
        }, QueryPoller.INTERVAL_LENGTH);
        this.timeout = setTimeout(() => {
            if (!this.hasAnyResult()) {
                this.stop(true);
            }
            else {
                this.stop();
            }
        }, QueryPoller.TIMEOUT_LENGTH);
    }
    stop(timeoutExpired = false) {
        if (timeoutExpired) {
            this.status = QueryPollerStatus.TIMEOUT_EXPIRED;
            // console.warn(`Qyery timeout expired for query with id = [${this.executionID}]`)
            this.onTimeoutExpiration();
        }
        else {
            this.status = QueryPollerStatus.DONE;
        }
        clearInterval(this.interval);
        clearTimeout(this.timeout);
        this.onStop();
    }
    triggerError(result) {
        this.onError(result);
        this.stop();
    }
}
QueryPoller.TIMEOUT_LENGTH = 5000;
QueryPoller.INTERVAL_LENGTH = 1000;
class QueryResultsPoller extends QueryPoller {
    constructor(request, limit, executionId) {
        super();
        this.request = request;
        this.limit = limit;
        this.executionId = executionId;
        this.onNewResults = () => { };
    }
    isResultError(result) {
        return !result || result.results === undefined || result.type === 'error';
    }
    stopCondition() {
        return this._result.results.length >= this.limit;
    }
    hasAnyResult() {
        return this.result.results.length > 0;
    }
    get result() {
        return this._result;
    }
}
/**
 * Class to perform polling on a count query,
 * it will stop when the result received is equal
 * to the QUERY_STATUS_FINISHED constant.
 */
class QueryCountStatePoller extends QueryPoller {
    constructor(request) {
        super();
        this.request = request;
        /**
         * Callback called in case the count has finished correctly.
         */
        this.onNewResults = () => { };
    }
    isResultError(result) {
        return !result || result === QueryCountStatePoller.QUERY_STATUS_ERROR;
    }
    stopCondition() {
        return this.result === QueryCountStatePoller.QUERY_STATUS_FINISHED;
    }
    hasAnyResult() {
        return this.result === QueryCountStatePoller.QUERY_STATUS_FINISHED;
    }
    get result() {
        return this._result;
    }
}
QueryCountStatePoller.QUERY_STATUS_FINISHED = 3;
QueryCountStatePoller.QUERY_STATUS_ERROR = 4;

class QueryManager {
    constructor(requestOptions, endpoint) {
        this.requestOptions = requestOptions;
        this.endpoint = endpoint;
        this._prefixes = new Promise(() => { });
        this._runningQueryPollerByExecutionId = new Map();
        this.requestOptions.headers['content-type'] = 'application/json';
        this._prefixes = new Promise((resolve) => {
            this.handleCall(fetch(this.prefixesPath, {
                method: 'get',
                headers: this.requestOptions.headers,
            })).then((response) => __awaiter(this, void 0, void 0, function* () {
                const prefixesResponse = yield response.json();
                resolve(prefixesResponse.map((p) => `PREFIX ${p.name} <${p.namespace}>`).join('\n'));
            }));
        });
    }
    /**
     * Start the query using the result route.
     * The QueryResultPoller will poll the query results.
     * @param queryCode
     * @param pageSize the maximum number of results to retrieve
     * @param pageNumber the page number in case you're handling pagination
     * @returns a promise which will be resolved with the query poller, on this
     * object you can set the onNewResults callback to react every time new results
     * are obtained.
     */
    performQuery(queryCode, pageSize, pageNumber = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const executionID = yield this.startQuery(queryCode);
            const queryResultsPoller = new QueryResultsPoller(this.getQueryResultRequest(executionID, pageSize, pageNumber), pageSize, executionID);
            this._runningQueryPollerByExecutionId.set(executionID, queryResultsPoller);
            queryResultsPoller.onError = this.requestOptions.onError;
            return queryResultsPoller;
        });
    }
    /**
     * Start the query using count route, then QueryCountStatePoller
     * will poll for the query state, when it receives the finished state,
     * it yield the result back to the callback onNewResults.
     * In this callback a fetch to the result route will retrieve the
     * actual result and resolve the promise.
     * @param queryCode
     * @returns a promise which will be resolved with the result
     */
    performQueryCount(queryCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const executionID = yield this.startQuery(queryCode, true);
            const countStatePoller = new QueryCountStatePoller(this.getQueryCountStatusRequest(executionID));
            return new Promise((resolve, reject) => {
                countStatePoller.onNewResults = (state) => {
                    if (state === QueryCountStatePoller.QUERY_STATUS_FINISHED) {
                        this.handleCall(fetch(`${this.queryCountPath}/${executionID}/result`, {
                            method: 'get',
                            headers: this.requestOptions.headers,
                        })).then((response) => __awaiter(this, void 0, void 0, function* () {
                            resolve(yield response.json());
                            // The count query has finished and result has been processed
                            // Now we need to delete the query execution from mastro.
                            this.handleCall(fetch(`${this.queryCountPath}/${executionID}`, {
                                method: 'delete',
                                headers: this.requestOptions.headers,
                            }));
                        })).catch(reason => reject(reason));
                    }
                };
                countStatePoller.onError = (error) => {
                    reject(error);
                    this.handleCall(fetch(`${this.queryCountPath}/${executionID}/error`, {
                        method: 'get',
                        headers: this.requestOptions.headers,
                    })).then((errorResponse) => __awaiter(this, void 0, void 0, function* () {
                        this.requestOptions.onError(yield errorResponse.text());
                    }));
                };
                countStatePoller.start();
            });
        });
    }
    getQueryStatus(executionID) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new Request(new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/query/${executionID}/status`), {
                method: 'get',
                headers: this.requestOptions.headers,
            });
            return new Promise((resolve, reject) => {
                this.handleCall(fetch(request))
                    .then(response => resolve(response.json()))
                    .catch(error => {
                    this.requestOptions.onError(error);
                    reject(error);
                });
            });
        });
    }
    stopRunningQueries() {
        this._runningQueryPollerByExecutionId.forEach((_, executionId) => this.stopQuery(executionId));
    }
    stopQuery(executionId) {
        var _a;
        (_a = this._runningQueryPollerByExecutionId.get(executionId)) === null || _a === void 0 ? void 0 : _a.stop(); // stop polling
        this._runningQueryPollerByExecutionId.delete(executionId);
        this.handleCall(fetch(this.getQueryStopPath(executionId), {
            method: 'put',
            headers: this.requestOptions.headers,
        }));
    }
    getPrefixes() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._prefixes;
        });
    }
    startQuery(queryCode, isCount) {
        return __awaiter(this, void 0, void 0, function* () {
            let countURL;
            if (isCount) {
                countURL = this.queryCountPath;
            }
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                this.handleCall(fetch(yield this.getNewQueryRequest(queryCode, countURL))).then((response) => __awaiter(this, void 0, void 0, function* () {
                    resolve((yield response.json()).executionId);
                }));
            }));
        });
    }
    // Request for starting a query
    getNewQueryRequest(queryCode, customURL) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = customURL || this.queryStartPath;
            return new Request(url, {
                method: 'post',
                headers: this.requestOptions.headers,
                body: JSON.stringify({
                    queryCode: `${yield this.getPrefixes()}\n${queryCode}`,
                    queryID: Math.random(),
                    queryDescription: "",
                    mappingParameters: {},
                }),
            });
        });
    }
    // Requests for polling a query
    getQueryResultRequest(queryExecutionId, limit, pagenumber = 1) {
        const params = new URLSearchParams({ pagesize: limit.toString(), pagenumber: pagenumber.toString() });
        return new Request(`${this.getQueryResultPath(queryExecutionId)}?${params.toString()}`, {
            method: 'get',
            headers: this.requestOptions.headers
        });
    }
    getQueryCountStatusRequest(queryExecutionId) {
        return new Request(`${this.queryCountPath}/${queryExecutionId}/state`, {
            method: `get`,
            headers: this.requestOptions.headers,
        });
    }
    get queryStartPath() {
        return new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/query/start`);
    }
    getQueryStopPath(executionId) {
        return new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/query/${executionId}/stop`);
    }
    getQueryResultPath(executionId) {
        return new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/query/${executionId}/results`);
    }
    get prefixesPath() {
        return new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/prefixes`);
    }
    get queryCountPath() {
        return new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/query/count`);
    }
    handleCall(apiCall) {
        return new Promise((resolve, reject) => {
            apiCall
                .then((response) => __awaiter(this, void 0, void 0, function* () {
                if (response.status !== 200) {
                    const result = yield (response.json() || response.text());
                    this.requestOptions.onError(result);
                    reject(result);
                }
                else {
                    resolve(response);
                }
            }))
                .catch(error => {
                this.requestOptions.onError(error);
                reject(error);
            });
        });
    }
}

function getInstances(iri, maxResults, searchText) {
    const select = `?x`;
    const where = `?x a <${iri}>.`;
    let filter = ``;
    if (searchText) {
        filter = `FILTER(regex(?x, '${searchText}')`;
        filter += `)`;
    }
    const optional = ``;
    const limit = maxResults ? `LIMIT ${maxResults}` : ``;
    return `
    SELECT DISTINCT ${select}
    WHERE {
      ${where}
      ${optional}
      ${filter}
    }
    ${limit}
  `;
}
function getInstancesByDataPropertyValue(classIri, dataPropertyIri, dataPropertyValue, maxResults) {
    const select = `?x`;
    const where = [
        `?x a <${classIri}>.`,
        `?x <${dataPropertyIri}> ?y.`
    ];
    let filter = `FILTER(regex(?y, '${dataPropertyValue}'))`;
    const limit = maxResults ? `LIMIT ${maxResults}` : ``;
    return `
    SELECT DISTINCT ${select}
    WHERE {
      ${where.join('\n')}
      ${filter}
    }
    ${limit}
  `;
}
function getInstanceDataPropertyValue(instanceIri, dataPropertyIri) {
    return `
    SELECT DISTINCT ?y
    WHERE {
      <${instanceIri}> <${dataPropertyIri}> ?y.
    }
  `;
}
function getInstancesObjectPropertyRanges(instanceIri, objectPropertyIri, rangeTypeClassIri, isDirect, maxResults, searchText) {
    const select = `?y`;
    let where = isDirect ? `<${instanceIri}> <${objectPropertyIri}> ?y.` : `?y <${objectPropertyIri}> <${instanceIri}>.`;
    where += `?y a <${rangeTypeClassIri}>.`;
    const optional = ``;
    let filter = ``;
    if (searchText) {
        filter = `FILTER(regex(?y, '${searchText}')`;
        filter += `)`;
    }
    const limit = maxResults ? `LIMIT ${maxResults}` : ``;
    return `
    SELECT DISTINCT ${select}
    WHERE {
      ${where}
      ${optional}
      ${filter}
    }
    ${limit}
  `;
}

var QueryStatusEnum;
(function (QueryStatusEnum) {
    QueryStatusEnum["FINISHED"] = "FINISHED";
    QueryStatusEnum["UNAVAILABLE"] = "UNAVAILABLE";
    QueryStatusEnum["ERROR"] = "ERROR";
    QueryStatusEnum["RUNNING"] = "RUNNING";
    QueryStatusEnum["READY"] = "READY";
})(QueryStatusEnum || (QueryStatusEnum = {}));

class VKGApi {
    constructor(requestOptions, endpoint) {
        this.requestOptions = requestOptions;
        this.limit = 10; // How many results to show?
        this.setEndpoint(endpoint);
    }
    getInstances(iri, onNewResults, onStop, searchText) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryCode = getInstances(iri, this.limit, searchText);
            const queryPoller = yield this.queryManager.performQuery(queryCode, this.limit);
            queryPoller.start();
            queryPoller.onNewResults = (result => {
                onNewResults(result.results.map(res => {
                    var _a;
                    return { iri: res[0].value, shortIri: res[0].shortIRI, label: (_a = res[1]) === null || _a === void 0 ? void 0 : _a.value };
                }));
            });
            if (onStop) {
                queryPoller.onStop = onStop;
            }
        });
    }
    getInstancesByDataPropertyValue(classIri, dataPropertyIri, dataPropertyValue, onNewResults, onStop) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryCode = getInstancesByDataPropertyValue(classIri, dataPropertyIri, dataPropertyValue, this.limit);
            const queryPoller = yield this.queryManager.performQuery(queryCode, this.limit);
            queryPoller.start();
            queryPoller.onNewResults = (result => {
                onNewResults(result.results.map(res => {
                    var _a;
                    return { iri: res[0].value, shortIri: res[0].shortIRI, label: (_a = res[1]) === null || _a === void 0 ? void 0 : _a.value };
                }));
            });
            if (onStop) {
                queryPoller.onStop = onStop;
            }
        });
    }
    getInstancesNumber(iri, onResult, onStop, searchText) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryCode = getInstances(iri, undefined, searchText);
            this.queryManager.performQueryCount(queryCode)
                .then(result => onResult(result))
                .catch(_ => {
                if (onStop)
                    onStop();
            });
        });
    }
    getHighlights(classIri) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams({ clickedClassIRI: classIri, version: this.requestOptions.version });
            const url = new URL(`${this.requestOptions.basePath}/owlOntology/${this.requestOptions.name}/highlights?${params.toString()}`);
            return yield (yield fetch(url, {
                method: 'get',
                headers: this.requestOptions.headers
            })).json();
        });
    }
    getInstanceDataPropertyValues(instanceIri, dataPropertyIri, onNewResults, onStop, onError) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryCode = getInstanceDataPropertyValue(instanceIri, dataPropertyIri);
            const pollPage = (pageNumber) => __awaiter(this, void 0, void 0, function* () {
                const queryPoller = yield this.queryManager.performQuery(queryCode, this.limit, pageNumber);
                queryPoller.start();
                queryPoller.onNewResults = (results) => {
                    onNewResults(results.results.map(res => res[0].value));
                };
                // If stopped then we received all results for this page
                // if query has not finished, continue polling for next page
                // if has finished then return and call onStop
                queryPoller.onStop = () => __awaiter(this, void 0, void 0, function* () {
                    const queryStatus = yield this.queryManager.getQueryStatus(queryPoller.executionId);
                    if (queryStatus.status === QueryStatusEnum.FINISHED) {
                        if (onStop)
                            onStop();
                        return;
                    }
                    if (!queryStatus.hasError) {
                        pollPage(pageNumber + 1); // poll for another page
                    }
                    else {
                        if (onError)
                            onError();
                    }
                });
            });
            pollPage(1);
        });
    }
    getInstanceObjectPropertyRanges(instanceIri, objectPropertyIri, isDirect, rangeClassIri, onNewResults, onStop, onError) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryCode = getInstancesObjectPropertyRanges(instanceIri, objectPropertyIri, rangeClassIri, isDirect, this.limit);
            const pollPage = (pageNumber) => __awaiter(this, void 0, void 0, function* () {
                const queryPoller = yield this.queryManager.performQuery(queryCode, this.limit, pageNumber);
                queryPoller.start();
                queryPoller.onNewResults = (newResult) => {
                    onNewResults(newResult.results.map(res => {
                        var _a;
                        return { iri: res[0].value, shortIri: res[0].shortIRI, label: (_a = res[1]) === null || _a === void 0 ? void 0 : _a.value };
                    }));
                };
                // If stopped then we received all results for this page
                // if query has not finished, continue polling for next page
                // if has finished then return and call onStop
                queryPoller.onStop = () => __awaiter(this, void 0, void 0, function* () {
                    const queryStatus = yield this.queryManager.getQueryStatus(queryPoller.executionId);
                    if (queryStatus.status === QueryStatusEnum.FINISHED) {
                        if (onStop)
                            onStop();
                        return;
                    }
                    if (!queryStatus.hasError) {
                        pollPage(pageNumber + 1); // poll for another page
                    }
                    else {
                        if (onError)
                            onError();
                    }
                });
            });
            pollPage(1);
        });
    }
    stopAllQueries() {
        this.queryManager.stopRunningQueries();
    }
    setEndpoint(endpoint) {
        this.queryManager = new QueryManager(this.requestOptions, endpoint);
    }
}
// Stubbed API
// export let vKGApiStub: IVirtualKnowledgeGraphApi = {
//   getInstances: (iri: string) => {
//     return [
//       {
//         iri: `http://obdm.obdasystems.com/book/1`,
//         label: 'Harry Potter',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/2`,
//         label: 'It',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/3`
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/4`,
//         label: 'Divina Commedia',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/5`,
//         label: 'Promessi Sposi',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/6`,
//         label: 'Songs Of My Nightmares',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/7`,
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/8`,
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/9`,
//         label: 'Losing The Sun',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/10`,
//         label: 'Sailing Into The Void',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/11`,
//         label: 'Calling Myself',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/12`,
//         label: 'Bleeding At The Mountains',
//       },
//     ]
//   },
//   getInstancesNumber: function (iri: string, onResult) {
//     onResult(2)
//   },
//   // getObjectProperties: function (iri: string): Promise<Branch[]> {
//   //   throw new Error('Function not implemented.')
//   // }
// }

class DiagramBuilder {
    constructor(ontology, diagram) {
        this.ontology = ontology;
        this.diagram = diagram;
    }
    addEntity(entityIri, connectedClassIri, directObjectProperty = true) {
        const grapholEntity = this.ontology.getEntity(entityIri);
        if (grapholEntity) {
            switch (grapholEntity.type) {
                case GrapholTypesEnum.DATA_PROPERTY:
                    this.addDataProperty(grapholEntity);
                    break;
                case GrapholTypesEnum.OBJECT_PROPERTY:
                    if (connectedClassIri) {
                        const connectedClassGrapholEntity = this.ontology.getEntity(connectedClassIri);
                        if (connectedClassGrapholEntity)
                            this.addObjectProperty(grapholEntity, connectedClassGrapholEntity, directObjectProperty);
                    }
                    break;
                case GrapholTypesEnum.CLASS:
                    if (!this.diagram.containsEntity(grapholEntity))
                        this.addClass(grapholEntity);
                default:
                    return;
            }
        }
    }
    addClassInstance(iri) {
        var _a;
        if (!this.referenceNodeId)
            return;
        const instanceEntity = (_a = this.diagram.classInstances) === null || _a === void 0 ? void 0 : _a.get(iri);
        if (!instanceEntity) {
            console.error(`Can't find the instance [${iri}] entity`);
            return;
        }
        const instanceNode = new GrapholNode(iri, GrapholTypesEnum.CLASS_INSTANCE);
        instanceNode.position = this.referenceNodePosition || { x: 0, y: 0 };
        // instanceNode.displayedName = iri
        instanceNode.height = instanceNode.width = 50;
        instanceNode.shape = Shape.ELLIPSE;
        instanceNode.labelXpos = 0;
        instanceNode.labelYpos = 0;
        this.diagram.addElement(instanceNode, instanceEntity);
    }
    removeEntity(entityIri, nodesIdToKeep = []) {
        var _a;
        (_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.$(`[iri = "${entityIri}"]`).forEach(element => {
            var _a, _b, _c;
            if (element.data().type === GrapholTypesEnum.CLASS) {
                element.neighborhood().forEach(neighbourElement => {
                    if (neighbourElement.isNode()) {
                        // remove nodes only if they have 1 connection, i.e. with the class we want to remove
                        if (neighbourElement.degree(false) === 1 && !(nodesIdToKeep === null || nodesIdToKeep === void 0 ? void 0 : nodesIdToKeep.includes(neighbourElement.id()))) {
                            if (neighbourElement.data().iri) {
                                // it's an entity, recursively remove entities
                                nodesIdToKeep.push(entityIri); // the entity we are removing must be skipped, otherwise cyclic recursion
                                this.removeEntity(neighbourElement.data().iri, nodesIdToKeep);
                            }
                            else {
                                this.diagram.removeElement(neighbourElement.id());
                            }
                        }
                    }
                    else {
                        // edges must be removed anyway
                        // (cytoscape removes them automatically
                        // but we need to update the grapholElements 
                        // map too in diagram representation)
                        this.diagram.removeElement(neighbourElement.id());
                    }
                });
                (_a = this.ontology.hierarchiesBySubclassMap.get(entityIri)) === null || _a === void 0 ? void 0 : _a.forEach(hierarchy => {
                    this.removeHierarchy(hierarchy);
                });
                (_b = this.ontology.hierarchiesBySuperclassMap.get(entityIri)) === null || _b === void 0 ? void 0 : _b.forEach(hierarchy => {
                    this.removeHierarchy(hierarchy);
                });
            }
            (_c = this.diagramRepresentation) === null || _c === void 0 ? void 0 : _c.removeElement(element.id());
        });
        const entity = this.ontology.getEntity(entityIri);
        entity === null || entity === void 0 ? void 0 : entity.removeOccurrence(entityIri, this.diagram.id, RendererStatesEnum.INCREMENTAL);
    }
    addHierarchy(hierarchy) {
        var _a, _b;
        const unionNode = hierarchy.getUnionGrapholNode(this.referenceNodePosition);
        const inputEdges = hierarchy.getInputGrapholEdges();
        const inclusionEdges = hierarchy.getInclusionEdges();
        if (!unionNode || !inputEdges || !inclusionEdges)
            return;
        this.diagram.addElement(unionNode);
        // Add inputs
        for (const inputClassIri of hierarchy.inputs) {
            this.addEntity(inputClassIri);
        }
        for (const superClass of hierarchy.superclasses) {
            this.addEntity(superClass.classIri);
        }
        (_a = hierarchy.getInputGrapholEdges()) === null || _a === void 0 ? void 0 : _a.forEach(inputEdge => this.diagram.addElement(inputEdge));
        (_b = hierarchy.getInclusionEdges()) === null || _b === void 0 ? void 0 : _b.forEach(inclusionEdge => this.diagram.addElement(inclusionEdge));
    }
    removeHierarchy(hierarchy, entitiesTokeep) {
        var _a, _b, _c;
        if (!hierarchy.id || (hierarchy.id && !((_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.grapholElements.get(hierarchy.id))))
            return;
        // remove union node
        this.diagram.removeElement(hierarchy.id);
        // remove input edges
        (_b = hierarchy.getInputGrapholEdges()) === null || _b === void 0 ? void 0 : _b.forEach(inputEdge => {
            this.diagram.removeElement(inputEdge.id);
        });
        // remove inclusion edges
        (_c = hierarchy.getInclusionEdges()) === null || _c === void 0 ? void 0 : _c.forEach(inclusionEdge => {
            this.diagram.removeElement(inclusionEdge.id);
        });
        // remove input classes or superclasses left with no edges
        hierarchy.inputs.forEach(inputClassIri => {
            var _a;
            if (((_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.$id(inputClassIri).degree(false)) === 0 &&
                !(entitiesTokeep === null || entitiesTokeep === void 0 ? void 0 : entitiesTokeep.includes(inputClassIri))) {
                this.removeEntity(inputClassIri);
            }
        });
        hierarchy.superclasses.forEach(superclass => {
            var _a;
            if (((_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.$id(superclass.classIri).degree(false)) === 0 &&
                !(entitiesTokeep === null || entitiesTokeep === void 0 ? void 0 : entitiesTokeep.includes(superclass.classIri))) {
                this.removeEntity(superclass.classIri);
            }
        });
    }
    // addClassInIsa(classInIsa: ClassInIsa) {
    // }
    areDataPropertiesVisibleForClass(classIri) {
        var _a;
        return ((_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.$id(classIri).neighborhood(`node[type = "${GrapholTypesEnum.DATA_PROPERTY}"]`).nonempty()) || false;
    }
    areAllSuperHierarchiesVisibleForClass(classIri) {
        const hierarchies = this.ontology.hierarchiesBySubclassMap.get(classIri);
        if (hierarchies)
            return this.areAllHierarchiesVisible(hierarchies);
        else
            return true;
    }
    areAllSubHierarchiesVisibleForClass(classIri) {
        const hierarchies = this.ontology.hierarchiesBySuperclassMap.get(classIri);
        if (hierarchies)
            return this.areAllHierarchiesVisible(hierarchies);
        else
            return true;
    }
    /**
     * Add an inclusion edge between two classes
     * @param subClassIri
     * @param superClassIri
     */
    addIsa(subClassIri, superClassIri) {
        var _a, _b;
        if ((_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.$id(subClassIri).empty()) {
            this.addEntity(subClassIri);
        }
        if ((_b = this.diagramRepresentation) === null || _b === void 0 ? void 0 : _b.cy.$id(superClassIri).empty()) {
            this.addEntity(superClassIri);
        }
        const inclusionEdge = new GrapholEdge(`${subClassIri}-isa-${superClassIri}`, GrapholTypesEnum.INCLUSION);
        inclusionEdge.sourceId = subClassIri;
        inclusionEdge.targetId = superClassIri;
        this.diagram.addElement(inclusionEdge);
    }
    addSubClass(subClassIri) {
        if (this.referenceNodeIri)
            this.addIsa(subClassIri, this.referenceNodeIri);
    }
    addSuperClass(superClassIri) {
        if (this.referenceNodeIri)
            this.addIsa(this.referenceNodeIri, superClassIri);
    }
    areAllSubclassesVisibleForClass(classIri, subClassesIris) {
        var _a;
        for (let subClassIri of subClassesIris) {
            if ((_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.$id(subClassIri).connectedEdges(`[ type ="${GrapholTypesEnum.INCLUSION}" ]`).targets(`[id = "${classIri}"]`).empty())
                return false;
        }
        return true;
    }
    areAllSuperclassesVisibleForClass(classIri, subClassesIris) {
        var _a;
        for (let subClassIri of subClassesIris) {
            if ((_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.$id(subClassIri).connectedEdges(`[ type = "${GrapholTypesEnum.INCLUSION}" ]`).sources(`[id = "${classIri}"]`).empty())
                return false;
        }
        return true;
    }
    areAllHierarchiesVisible(hierarchies) {
        var _a;
        let result = true;
        for (let hierarchy of hierarchies) {
            if (hierarchy.id && ((_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.$id(hierarchy.id).empty())) {
                result = false;
                break;
            }
        }
        return result;
    }
    addObjectProperty(objectPropertyEntity, connectedClassEntity, direct) {
        var _a, _b;
        if (!this.referenceNodeId)
            return;
        // if both object property and range class are already present, do not add them again
        const connectedClassNode = (_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.$id(connectedClassEntity.iri.fullIri);
        if (connectedClassNode === null || connectedClassNode === void 0 ? void 0 : connectedClassNode.nonempty()) {
            /**
             * If the set of edges between reference node and the connected class
             * includes the object property we want to add, then it's already present.
             */
            const referenceNode = (_b = this.diagramRepresentation) === null || _b === void 0 ? void 0 : _b.cy.$id(this.referenceNodeId);
            if ((referenceNode === null || referenceNode === void 0 ? void 0 : referenceNode.nonempty()) && connectedClassNode.edgesWith(referenceNode)
                .filter(e => e.data().iri === objectPropertyEntity.iri.fullIri)
                .nonempty()) {
                return;
            }
        }
        this.addClass(connectedClassEntity);
        const connectedClassIri = connectedClassEntity.iri.fullIri;
        const objectPropertyEdge = new GrapholEdge(`${this.referenceNodeId}-${objectPropertyEntity.iri.prefixed}-${connectedClassIri}`, GrapholTypesEnum.OBJECT_PROPERTY);
        objectPropertyEdge.displayedName = objectPropertyEntity.getDisplayedName(EntityNameType.LABEL);
        objectPropertyEdge.sourceId = direct ? this.referenceNodeId : connectedClassIri;
        objectPropertyEdge.targetId = direct ? connectedClassIri : this.referenceNodeId;
        objectPropertyEdge.originalId = objectPropertyEntity.getEntityOriginalNodeId();
        objectPropertyEntity.addOccurrence(objectPropertyEdge.id, this.diagram.id, RendererStatesEnum.INCREMENTAL);
        this.diagram.addElement(objectPropertyEdge, objectPropertyEntity);
    }
    addInstanceObjectProperty(objectPropertyIri, classInstanceIri, direct) {
        var _a, _b;
        if (!this.referenceNodeId)
            return;
        const objectPropertyEntity = this.ontology.getEntity(objectPropertyIri);
        if (!objectPropertyEntity)
            return;
        // if both object property and range class are already present, do not add them again
        const connectedInstanceNode = (_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.$id(classInstanceIri);
        if (connectedInstanceNode === null || connectedInstanceNode === void 0 ? void 0 : connectedInstanceNode.nonempty()) {
            /**
             * If the set of edges between reference node and the connected class
             * includes the object property we want to add, then it's already present.
             */
            const referenceNode = (_b = this.diagramRepresentation) === null || _b === void 0 ? void 0 : _b.cy.$id(this.referenceNodeId);
            if ((referenceNode === null || referenceNode === void 0 ? void 0 : referenceNode.nonempty()) && connectedInstanceNode.edgesWith(referenceNode)
                .filter(e => e.data().iri === objectPropertyEntity.iri.fullIri)
                .nonempty()) {
                return;
            }
        }
        this.addClassInstance(classInstanceIri);
        const objectPropertyEdge = new GrapholEdge(`${this.referenceNodeId}-${objectPropertyEntity.iri.prefixed}-${classInstanceIri}`, GrapholTypesEnum.OBJECT_PROPERTY);
        objectPropertyEdge.displayedName = objectPropertyEntity.getDisplayedName(EntityNameType.LABEL);
        objectPropertyEdge.sourceId = direct ? this.referenceNodeId : classInstanceIri;
        objectPropertyEdge.targetId = direct ? classInstanceIri : this.referenceNodeId;
        this.diagram.addElement(objectPropertyEdge, objectPropertyEntity);
    }
    addInstanceOfEdge(instanceIri, parentClassIri) {
        var _a;
        if (!this.referenceNodeId)
            return;
        if (parentClassIri && ((_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.$id(parentClassIri).empty()))
            return;
        const targetId = parentClassIri || this.referenceNodeId;
        const instanceEdge = new GrapholEdge(`${targetId}-instance-${instanceIri}`, GrapholTypesEnum.INSTANCE_OF);
        instanceEdge.sourceId = instanceIri;
        instanceEdge.targetId = targetId;
        this.diagram.addElement(instanceEdge);
    }
    addClass(classEntity) {
        var _a;
        if ((_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.grapholElements.get(classEntity.iri.fullIri))
            return;
        const classNode = this.getEntityElement(classEntity.iri.fullIri);
        classNode.id = classEntity.iri.fullIri;
        classNode.position = this.referenceNodePosition || classNode.position;
        classNode.originalId = classEntity.getEntityOriginalNodeId();
        classEntity.addOccurrence(classNode.id, this.diagram.id, RendererStatesEnum.INCREMENTAL);
        this.diagram.addElement(classNode, classEntity);
    }
    addDataProperty(dataPropertyEntity) {
        if (!this.referenceNodeId)
            return;
        const dataPropertyNode = this.getEntityElement(dataPropertyEntity.iri.fullIri);
        if (!dataPropertyNode)
            return;
        dataPropertyNode.id = dataPropertyEntity.iri.fullIri;
        dataPropertyNode.originalId = dataPropertyEntity.getEntityOriginalNodeId();
        const dataPropertyEdge = new GrapholEdge(`${this.referenceNodeId}-${dataPropertyNode.id}`, GrapholTypesEnum.DATA_PROPERTY);
        dataPropertyEdge.sourceId = this.referenceNodeId;
        dataPropertyEdge.targetId = dataPropertyNode.id;
        this.diagram.addElement(dataPropertyNode, dataPropertyEntity);
        this.diagram.addElement(dataPropertyEdge);
    }
    getEntityElement(entityIri) {
        var _a, _b, _c, _d;
        const occurrences = (_a = this.ontology.getEntityOccurrences(entityIri)) === null || _a === void 0 ? void 0 : _a.get(RendererStatesEnum.GRAPHOL);
        if (occurrences) {
            const occurrence = occurrences[0];
            return (_d = (_c = (_b = this.ontology
                .getDiagram(occurrence.diagramId)) === null || _b === void 0 ? void 0 : _b.representations.get(RendererStatesEnum.FLOATY)) === null || _c === void 0 ? void 0 : _c.grapholElements.get(occurrence.elementId)) === null || _d === void 0 ? void 0 : _d.clone();
        }
    }
    get referenceNodePosition() {
        var _a, _b;
        if (this.referenceNodeId && ((_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy)) {
            return (_b = this.diagramRepresentation) === null || _b === void 0 ? void 0 : _b.cy.$id(this.referenceNodeId).position();
        }
    }
    get referenceNodeIri() {
        var _a, _b;
        if (this.referenceNodeId)
            return (_b = (_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.$id(this.referenceNodeId)) === null || _b === void 0 ? void 0 : _b.data().iri;
    }
    get diagramRepresentation() {
        return this.diagram.representations.get(RendererStatesEnum.INCREMENTAL);
    }
}

class GscapeVKGPreferences extends DropPanelMixin(BaseMixin(s)) {
    constructor() {
        super(...arguments);
        this.endpoints = [];
        this._onEndpointChangeCallback = () => { };
        this._onLimitChangeCallback = () => { };
    }
    render() {
        return y `
      <gscape-button
        @click=${this.togglePanel}
        title="Virtual knowledge graph explorer preferences"
      >
        <span slot="icon">${tune}</span>
      </gscape-button>


      <div class="gscape-panel gscape-panel-in-tray hanging hide" id="drop-panel">
        <div class="header">VKG Preferences</div>
        <div class="content-wrapper">
          <div class="area">
            <span class="bold-text">Endpoint Selection</span>
            <div class="preference">
              ${this.endpoints.map(endpoint => {
            return y `
                  <gscape-action-list-item
                    @click=${this.handleEndpointClick}
                    label="${endpoint.name}"
                    ?selected = "${this.selectedEndpointName === endpoint.name}"
                  >
                  </gscape-action-list-item>
                `;
        })}

              ${this.endpoints.length === 0
            ? y `
                  <div class="blank-slate">
                    ${searchOff}
                    <div class="header">No endpoint available</div>
                  </div>
                `
            : null}
            </div>
          </div>
          <div class="area" style="margin-bottom: 0">
            <span class="bold-text">Limit Instances</span>
            <div class="preference">
              <div class="limit-box">
                <label for="instances-limit" class="bold-text">Limit</label>
                <input id="instances-limit" type="number" min="1" max="100" value="10" @change=${this.handleLimitChange}>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    `;
    }
    handleEndpointClick(e) {
        if (e.currentTarget.label && e.currentTarget.label !== this.selectedEndpointName)
            this._onEndpointChangeCallback(e.currentTarget.label);
    }
    handleLimitChange(e) {
        const input = e.currentTarget;
        if (input.reportValidity()) {
            this._onLimitChangeCallback(input.valueAsNumber);
        }
    }
    onEndpointChange(callback) {
        this._onEndpointChangeCallback = callback;
    }
    onLimitChange(callback) {
        this._onLimitChangeCallback = callback;
    }
}
GscapeVKGPreferences.properties = {
    endpoints: { type: Array, attribute: false },
    selectedEndpointName: { type: String, reflect: true },
};
GscapeVKGPreferences.styles = [baseStyle,
    i$1 `
      :host {
        order: 8;
      }

      .gscape-panel {
        min-width: 150px
      }

      .area > .preference {
        padding: 8px;
      }
    `
];

class EndpointApi {
    constructor(requestOptions) {
        this.requestOptions = requestOptions;
    }
    getRunningEndpoints() {
        return __awaiter(this, void 0, void 0, function* () {
            const runningEndpoints = (yield (yield fetch(`${this.requestOptions.basePath}/endpoints/running`, {
                method: 'get',
                headers: this.requestOptions.headers,
            })).json()).endpoints;
            return runningEndpoints.filter(endpoint => {
                var _a;
                return ((_a = endpoint.mastroID) === null || _a === void 0 ? void 0 : _a.ontologyID.ontologyName) === this.requestOptions.name &&
                    endpoint.mastroID.ontologyID.ontologyVersion === this.requestOptions.version;
            });
        });
    }
}

class EndpointController {
    constructor(container, requestOptions) {
        this.endpointSelector = new GscapeVKGPreferences();
        this._onEndpointChange = (newEndpoint) => { };
        this._onAutoEndpointSelection = (newEndpoint) => { };
        this.endpointApi = new EndpointApi(requestOptions);
        container.appendChild(this.endpointSelector);
        this.endpointSelector.onEndpointChange(newEndpointName => {
            const newEndpoint = this.endpoints.find(e => e.name === newEndpointName);
            if (newEndpoint) {
                this._onEndpointChange(newEndpoint);
                //this.endpointSelector.selectedEndpointName = newEndpoint.name
            }
        });
        this.endpointSelector.onTogglePanel = this.updateEndpointList.bind(this);
    }
    updateEndpointList() {
        return __awaiter(this, void 0, void 0, function* () {
            this.endpoints = yield this.endpointApi.getRunningEndpoints();
            this.endpointSelector.endpoints = this.endpoints.map(e => { return { name: e.name }; }).sort((a, b) => a.name.localeCompare(b.name));
            if (this.endpoints.length >= 1 && !this.endpointSelector.selectedEndpointName) {
                this.endpointSelector.selectedEndpointName = this.endpointSelector.endpoints[0].name;
                this.selectedEndpoint ? this._onAutoEndpointSelection(this.selectedEndpoint) : null;
            }
        });
    }
    get selectedEndpoint() {
        var _a;
        return (_a = this.endpoints) === null || _a === void 0 ? void 0 : _a.find(e => e.name === this.endpointSelector.selectedEndpointName);
    }
    set selectedEndpoint(newEndpoint) {
        if (newEndpoint)
            this.endpointSelector.selectedEndpointName = newEndpoint.name;
    }
    onEndpointChange(callback) {
        this._onEndpointChange = callback;
    }
    onAutoEndpointSelection(callback) {
        this._onAutoEndpointSelection = callback;
    }
    onLimitChange(callback) {
        this.endpointSelector.onLimitChange(callback);
    }
    hideView() {
        this.endpointSelector.hide();
    }
    showView() {
        this.endpointSelector.show();
    }
}
customElements.define('gscape-endpoint-selector', GscapeVKGPreferences);

class NeighbourhoodFinder {
    constructor(ontology) {
        this.ontology = ontology;
    }
    getDataProperties(classIriString) {
        const res = [];
        const classIri = this.getIriObject(classIriString);
        const dataPropertySelector = `[type = "${GrapholTypesEnum.DATA_PROPERTY}"]`;
        this.ontology.diagrams.forEach(diagram => {
            var _a;
            (_a = diagram.representations.get(RendererStatesEnum.FLOATY)) === null || _a === void 0 ? void 0 : _a.cy.$(`node[iri = "${classIri.fullIri}"]`).forEach(classNode => {
                classNode.neighborhood(dataPropertySelector).forEach(dataPropertyNode => {
                    const dataPropertyEntity = this.ontology.getEntity(dataPropertyNode.data().iri);
                    if (dataPropertyEntity && !res.includes(dataPropertyEntity)) {
                        res.push(dataPropertyEntity);
                    }
                });
            });
        });
        return res;
    }
    getObjectProperties(classIriString) {
        const res = new Map();
        const classIri = this.getIriObject(classIriString);
        const objectPropertyEdgeSelector = `[type = "${GrapholTypesEnum.OBJECT_PROPERTY}"]`;
        this.ontology.diagrams.forEach(diagram => {
            var _a;
            (_a = diagram.representations.get(RendererStatesEnum.FLOATY)) === null || _a === void 0 ? void 0 : _a.cy.$(`node[iri = "${classIri.fullIri}"]`).forEach(classNode => {
                classNode.connectedEdges(objectPropertyEdgeSelector).forEach(objectPropertyEdge => {
                    const objectPropertyEntity = this.ontology.getEntity(objectPropertyEdge.data().iri);
                    let classIriConnected;
                    let direct = true;
                    if (objectPropertyEntity) {
                        // if classIri is the source of the edge (i.e. domain of the object property)
                        // then add target's iri to results
                        if (classIri.equals(objectPropertyEdge.source().data().iri)) {
                            classIriConnected = objectPropertyEdge.target().data().iri;
                        }
                        // if classIri is the target of the edge (i.e. range of the object property)
                        // then add source's iri to results
                        else if (classIri.equals(objectPropertyEdge.target().data().iri)) {
                            classIriConnected = objectPropertyEdge.source().data().iri;
                            direct = false;
                        }
                        if (classIriConnected) {
                            const connectedClassEntity = this.ontology.getEntity(classIriConnected);
                            if (connectedClassEntity) {
                                const resEntry = res.get(objectPropertyEntity);
                                if (resEntry) {
                                    if (!resEntry.connectedClasses.includes(connectedClassEntity)) // add only new classes
                                        resEntry.connectedClasses.push(connectedClassEntity);
                                }
                                else {
                                    res.set(objectPropertyEntity, { connectedClasses: [connectedClassEntity], direct: direct });
                                }
                            }
                        }
                    }
                });
            });
        });
        return res;
    }
    /**
     * Given a class and an object property, get all classes connected to the given class through such an
     * object property.
     * @param sourceClassIriString the class' iri involved in the object property
     * either as domain or range
     * @param objectPropertyIriString the object property's iri for which to retrieve the connected classes' iris
     * @returns an array of entities
     */
    getClassesConnectedToObjectProperty(sourceClassIriString, objectPropertyIriString) {
        const res = [];
        const sourceClassIri = this.getIriObject(sourceClassIriString);
        const objectPropertyIri = this.getIriObject(objectPropertyIriString);
        const cyObjectPropertySelector = `edge[iri = "${objectPropertyIri.fullIri}"]`;
        let classIriConnected;
        /**
         * For each diagram in floaty representation, search the object property
         * and check if it's connected to the source class and if so, get
         * the other end of the edge.
         */
        this.ontology.diagrams.forEach(diagram => {
            var _a;
            (_a = diagram.representations.get(RendererStatesEnum.FLOATY)) === null || _a === void 0 ? void 0 : _a.cy.$(cyObjectPropertySelector).forEach(objectPropertyEdge => {
                // if sourceClass is the source of the edge (i.e. domain of the object property)
                // then add target's iri to results
                if (sourceClassIri.equals(objectPropertyEdge.source().data().iri)) {
                    classIriConnected = objectPropertyEdge.target().data().iri;
                }
                // if sourceClass is the target of the edge (i.e. range of the object property)
                // then add source's iri to results
                else if (sourceClassIri.equals(objectPropertyEdge.target().data().iri)) {
                    classIriConnected = objectPropertyEdge.source().data().iri;
                }
                if (classIriConnected) {
                    const entityToAdd = this.ontology.getEntity(classIriConnected);
                    if (entityToAdd) {
                        res.push(entityToAdd);
                    }
                }
            });
        });
        return res;
    }
    getSubclassesIris(classIri) {
        var _a;
        const res = [];
        let diagram;
        (_a = this.ontology.getEntityOccurrences(classIri, undefined, RendererStatesEnum.FLOATY)) === null || _a === void 0 ? void 0 : _a.forEach(classOccurrences => {
            classOccurrences.forEach(classOccurrence => {
                var _a;
                diagram = this.ontology.getDiagram(classOccurrence.diagramId);
                if (diagram) {
                    (_a = diagram.representations.get(RendererStatesEnum.FLOATY)) === null || _a === void 0 ? void 0 : _a.cy.$id(classOccurrence.elementId).edgesWith(`[ type = "${GrapholTypesEnum.CLASS}" ]`).filter(edge => edge.data().type === GrapholTypesEnum.INCLUSION).sources(`[ iri != "${classIri}" ]`).forEach(subClassElement => {
                        if (!res.includes(subClassElement.data().iri)) {
                            res.push(subClassElement.data().iri);
                        }
                    });
                }
            });
        });
        return res;
    }
    getSuperclassesIris(classIri) {
        var _a;
        const res = [];
        let diagram;
        (_a = this.ontology.getEntityOccurrences(classIri, undefined, RendererStatesEnum.FLOATY)) === null || _a === void 0 ? void 0 : _a.forEach(classOccurrences => {
            classOccurrences.forEach(classOccurrence => {
                var _a;
                diagram = this.ontology.getDiagram(classOccurrence.diagramId);
                if (diagram) {
                    (_a = diagram.representations.get(RendererStatesEnum.FLOATY)) === null || _a === void 0 ? void 0 : _a.cy.$id(classOccurrence.elementId).edgesWith(`[ type = "${GrapholTypesEnum.CLASS}" ]`).filter(edge => edge.data().type === GrapholTypesEnum.INCLUSION).targets(`[ iri != "${classIri}" ]`).forEach(subClassElement => {
                        if (!res.includes(subClassElement.data().iri)) {
                            res.push(subClassElement.data().iri);
                        }
                    });
                }
            });
        });
        return res;
    }
    getIriObject(iri) {
        return new Iri(iri, this.ontology.namespaces);
    }
}

class HighlightsManager {
    constructor(vkgApi) {
        this.vkgApi = vkgApi;
        this.highlightsCallsPromises = [];
        this.lastClassIris = [];
        this.actualClassIris = [];
        this._dataProperties = new Set();
        this._objectProperties = new Map();
        this.computationPromise = new Promise(() => { });
    }
    computeHighlights(classIriStringOrArray) {
        return __awaiter(this, void 0, void 0, function* () {
            this.lastClassIris = this.actualClassIris;
            this.actualClassIris = typeof classIriStringOrArray === 'string' ? [classIriStringOrArray] : classIriStringOrArray;
            this.clear();
            this.computationPromise = new Promise((resolve, reject) => {
                for (let classIri of this.actualClassIris) {
                    this.highlightsCallsPromises.push(this.vkgApi.getHighlights(classIri));
                }
                Promise.all(this.highlightsCallsPromises)
                    .then(results => {
                    var _a, _b;
                    for (let highlights of results) {
                        (_a = highlights.dataProperties) === null || _a === void 0 ? void 0 : _a.forEach(dp => this._dataProperties.add(dp));
                        (_b = highlights.objectProperties) === null || _b === void 0 ? void 0 : _b.forEach(op => {
                            if (op.objectPropertyIRI && !this._objectProperties.has(op.objectPropertyIRI)) {
                                this._objectProperties.set(op.objectPropertyIRI, op);
                            }
                        });
                    }
                    resolve();
                });
            });
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            this.highlightsCallsPromises = [];
            this._dataProperties.clear();
            this._objectProperties.clear();
        });
    }
    dataProperties() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.computationPromise;
            return Array.from(this._dataProperties);
        });
    }
    objectProperties() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.computationPromise;
            return Array.from(this._objectProperties).map(([_, opBranch]) => opBranch);
        });
    }
}

class GscapeConfirmDialog extends ModalMixin(BaseMixin(s)) {
    constructor(message, dialogTitle = 'Confirm') {
        super();
        this.message = message;
        this.dialogTitle = dialogTitle;
        this.onConfirm = () => { };
        this.onCancel = () => { };
    }
    render() {
        return y `
      <div class="gscape-panel">
        <div class="header">
          ${this.dialogTitle}
        </div>
        <div class="dialog-message area">
          ${this.message}
        </div>

        <div class="buttons">
          <gscape-button label="Cancel" type="subtle" @click=${this.handleCancel}></gscape-button>
          <gscape-button label="Ok" @click=${this.handleConfirm}></gscape-button>
        </div>
      </div>
    `;
    }
    handleConfirm() {
        this.onConfirm();
        this.remove();
    }
    handleCancel() {
        this.onCancel();
        this.remove();
    }
}
GscapeConfirmDialog.properties = {
    message: { type: String }
};
GscapeConfirmDialog.styles = [
    baseStyle,
    i$1 `
      .gscape-panel {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translate(-50%);
        max-width: 400px;
        min-width: 300px;
      }

      .header, .dialog-message {
        margin: 8px;
      }

      .dialog-message {
        padding: 8px;
        margin-bottom: 16px;
      }

      .buttons {
        display: flex;
        align-items: center;
        justify-content: right;
        gap: 8px;
      }
    `
];
customElements.define('gscape-confirm-dialog', GscapeConfirmDialog);

class IncrementalController {
    constructor(grapholscape) {
        this.grapholscape = grapholscape;
        this.suggestedClassInstances = [];
        this.suggestedClassInstancesRanges = [];
        this.commandsWidget = new GscapeContextMenu();
        this.diagramBuilder = new DiagramBuilder(this.ontology, this.diagram);
        this.neighbourhoodFinder = new NeighbourhoodFinder(this.ontology);
    }
    initEndpointController() {
        if (this.grapholscape.buttonsTray && this.grapholscape.mastroRequestOptions) {
            this.endpointController = new EndpointController(this.grapholscape.buttonsTray, this.grapholscape.mastroRequestOptions);
            this.endpointController.onEndpointChange(newEndpoint => {
                var _a;
                const confirmDialog = new GscapeConfirmDialog(`Are you sure? \nIf you change the current endpoint, your exploration will be reset.`);
                (_a = this.grapholscape.uiContainer) === null || _a === void 0 ? void 0 : _a.appendChild(confirmDialog);
                confirmDialog.show();
                confirmDialog.onConfirm = () => {
                    this.initApi(newEndpoint);
                    this.endpointController.selectedEndpoint = newEndpoint;
                    this.reset();
                };
            });
            this.endpointController.onAutoEndpointSelection(this.initApi.bind(this));
            this.endpointController.updateEndpointList();
        }
    }
    initApi(endpoint) {
        var _a;
        if (!this.vKGApi) {
            if (this.grapholscape.mastroRequestOptions)
                this.vKGApi = new VKGApi(this.grapholscape.mastroRequestOptions, endpoint);
            if (this.highlightsManager) {
                this.highlightsManager.vkgApi = this.vKGApi;
            }
            else {
                this.highlightsManager = new HighlightsManager(this.vKGApi);
            }
        }
        else {
            (_a = this.vKGApi) === null || _a === void 0 ? void 0 : _a.setEndpoint(endpoint);
        }
    }
    init() {
        var _a, _b;
        this.updateWidget();
        if (!this.endpointController) {
            this.initEndpointController();
        }
        (_a = this.endpointController) === null || _a === void 0 ? void 0 : _a.showView();
        this.setIncrementalEventHandlers();
        this.incrementalDetails.reset();
        this.incrementalDetails.onObjectPropertySelection = this.addIntensionalObjectProperty.bind(this);
        this.entitySelector.onClassSelection((iri) => {
            this.entitySelector.hide();
            this.incrementalRenderer.freezeGraph();
            this.diagramBuilder.addEntity(iri);
            this.postDiagramEdit();
        });
        (_b = this.endpointController) === null || _b === void 0 ? void 0 : _b.onLimitChange(this.changeInstancesLimit.bind(this));
        setGraphEventHandlers(this.diagram, this.grapholscape.lifecycle, this.ontology);
    }
    updateWidget() {
        this.incrementalDetails = this.grapholscape.widgets.get(WidgetEnum.INCREMENTAL_MENU);
        this.entitySelector = this.grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR);
    }
    buildDetailsForInstance(instanceIri) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.incrementalDetails)
                return;
            this.incrementalDetails.canShowInstances = false;
            this.incrementalDetails.canShowDataPropertiesValues = true;
            this.incrementalDetails.canShowObjectPropertiesRanges = true;
            const instanceEntity = (_a = this.diagram.classInstances) === null || _a === void 0 ? void 0 : _a.get(instanceIri);
            if (instanceEntity) {
                let shouldUpdate = false;
                instanceEntity.parentClassIris.forEach(parentClassIri => {
                    this.addDataPropertiesDetails(parentClassIri.fullIri);
                    this.addObjectPropertiesDetails(parentClassIri.fullIri);
                });
                // Check if the last classes used for highlights matches with parentClasses of selected instance
                // If it matches, no need to update highlights and values
                for (const parentClassIri of instanceEntity.parentClassIris) {
                    if (!((_b = this.highlightsManager) === null || _b === void 0 ? void 0 : _b.lastClassIris.includes(parentClassIri.fullIri)) &&
                        ((_c = this.highlightsManager) === null || _c === void 0 ? void 0 : _c.lastClassIris.length) !== instanceEntity.parentClassIris.size) {
                        shouldUpdate = true;
                        break;
                    }
                }
                if (shouldUpdate || this.lastInstanceIri !== instanceIri) {
                    // init data properties values and recalculate them all
                    const dataPropertiesValues = new Map();
                    const dataProperties = yield ((_d = this.highlightsManager) === null || _d === void 0 ? void 0 : _d.dataProperties());
                    dataProperties === null || dataProperties === void 0 ? void 0 : dataProperties.forEach(dpIri => {
                        dataPropertiesValues.set(dpIri, { values: [], loading: true });
                    });
                    this.incrementalDetails.setDataPropertiesValues(dataPropertiesValues);
                    dataProperties === null || dataProperties === void 0 ? void 0 : dataProperties.forEach(dpIri => {
                        var _a;
                        (_a = this.vKGApi) === null || _a === void 0 ? void 0 : _a.getInstanceDataPropertyValues(instanceIri, dpIri, (res) => this.incrementalDetails.addDataPropertiesValues(dpIri, res), // onNewResults
                        () => this.onStopDataPropertyValueQuery(instanceIri, dpIri)); // onStop
                    });
                    const objectPropertiesRanges = new Map();
                    let rangeMap;
                    const objectProperties = yield ((_e = this.highlightsManager) === null || _e === void 0 ? void 0 : _e.objectProperties());
                    // init ranges map with empty arrays and all loading
                    objectProperties === null || objectProperties === void 0 ? void 0 : objectProperties.forEach(opBranch => {
                        var _a;
                        if (opBranch.objectPropertyIRI) {
                            (_a = opBranch.relatedClasses) === null || _a === void 0 ? void 0 : _a.forEach(rangeClass => {
                                rangeMap = new Map();
                                rangeMap.set(rangeClass, { values: [], loading: false });
                                objectPropertiesRanges.set(opBranch.objectPropertyIRI, rangeMap);
                            });
                        }
                    });
                    this.suggestedClassInstancesRanges = [];
                    this.incrementalDetails.setObjectPropertyRanges(objectPropertiesRanges);
                    this.incrementalDetails.onGetRangeInstances = (objectPropertyIri, rangeClassIri) => {
                        this.onGetRangeInstances(instanceIri, objectPropertyIri, rangeClassIri);
                    };
                    this.incrementalDetails.onInstanceObjectPropertySelection = this.addInstanceObjectProperty.bind(this);
                    this.lastInstanceIri = instanceIri;
                }
            }
        });
    }
    buildDetailsForClass(classIri) {
        var _a;
        if (!this.incrementalDetails)
            return;
        this.addDataPropertiesDetails(classIri);
        this.addObjectPropertiesDetails(classIri);
        if (this.isReasonerEnabled) {
            this.incrementalDetails.canShowDataPropertiesValues = false;
            this.incrementalDetails.canShowObjectPropertiesRanges = false;
            this.incrementalDetails.canShowInstances = true;
            this.incrementalDetails.onGetInstances = () => this.onGetInstances(classIri);
            this.incrementalDetails.onInstanceSelection = this.addInstance.bind(this);
            this.incrementalDetails.onEntitySearch = (searchText) => this.onGetInstances(classIri, searchText);
            this.incrementalDetails.onEntitySearchByDataPropertyValue = (dataPropertyIri, searchText) => this.onGetInstancesByDataPropertyValue(classIri, dataPropertyIri, searchText);
            if (classIri !== this.lastClassIri) {
                this.incrementalDetails.setInstances([]);
                this.suggestedClassInstances = [];
                this.incrementalDetails.isInstanceCounterLoading = true;
                this.incrementalDetails.areInstancesLoading = true;
                // Ask instance number
                (_a = this.vKGApi) === null || _a === void 0 ? void 0 : _a.getInstancesNumber(classIri, (count) => {
                    this.incrementalDetails.isInstanceCounterLoading = false;
                    this.incrementalDetails.instanceCount = count;
                }, () => this.incrementalDetails.isInstanceCounterLoading = false);
            }
        }
        this.lastClassIri = classIri;
    }
    showCommandsForClass(classIri) {
        var _a, _b;
        const commands = [];
        const classInstanceEntity = (_a = this.diagram.classInstances) === null || _a === void 0 ? void 0 : _a.get(classIri);
        if (classInstanceEntity) {
            commands.push(showParentClass(() => {
                var _a, _b;
                const oldElemNumbers = (_a = this.diagramBuilder.diagram.representation) === null || _a === void 0 ? void 0 : _a.grapholElements.size;
                classInstanceEntity.parentClassIris.forEach(parentClassIri => {
                    this.diagramBuilder.addEntity(parentClassIri.fullIri);
                    this.connectInstanceToParentClasses(classInstanceEntity);
                });
                if (oldElemNumbers !== ((_b = this.diagramBuilder.diagram.representation) === null || _b === void 0 ? void 0 : _b.grapholElements.size))
                    this.postDiagramEdit();
            }));
        }
        const superHierarchies = this.ontology.hierarchiesBySubclassMap.get(classIri);
        const subHierarchies = this.ontology.hierarchiesBySuperclassMap.get(classIri);
        if (superHierarchies && superHierarchies.length > 0) {
            const areAllSuperHierarchiesVisible = this.diagramBuilder.areAllSuperHierarchiesVisibleForClass(classIri);
            commands.push(showHideSuperHierarchies(areAllSuperHierarchiesVisible, () => {
                this.diagramBuilder.referenceNodeId = classIri;
                areAllSuperHierarchiesVisible ? this.hideSuperHierarchiesOf(classIri) : this.showSuperHierarchiesOf(classIri);
            }));
        }
        if (subHierarchies && subHierarchies.length > 0) {
            const areAllSubHierarchiesVisible = this.diagramBuilder.areAllSubHierarchiesVisibleForClass(classIri);
            commands.push(showHideSubHierarchies(areAllSubHierarchiesVisible, () => {
                this.diagramBuilder.referenceNodeId = classIri;
                areAllSubHierarchiesVisible ? this.hideSubHierarchiesOf(classIri) : this.showSubHierarchiesOf(classIri);
            }));
        }
        const subClasses = this.neighbourhoodFinder.getSubclassesIris(classIri);
        const superClasses = this.neighbourhoodFinder.getSuperclassesIris(classIri);
        if (subClasses.length > 0) {
            const areAllSubclassesVisible = this.diagramBuilder.areAllSubclassesVisibleForClass(classIri, subClasses);
            commands.push(showHideSubClasses(areAllSubclassesVisible, () => {
                this.diagramBuilder.referenceNodeId = classIri;
                areAllSubclassesVisible
                    ? subClasses.forEach(sc => this.removeEntity(sc, [classIri]))
                    : this.showSubClassesOf(classIri, subClasses);
            }));
        }
        if (superClasses.length > 0) {
            const areAllSuperclassesVisible = this.diagramBuilder.areAllSuperclassesVisibleForClass(classIri, superClasses);
            commands.push(showHideSuperClasses(areAllSuperclassesVisible, () => {
                this.diagramBuilder.referenceNodeId = classIri;
                areAllSuperclassesVisible
                    ? superClasses.forEach(sc => this.removeEntity(sc, [classIri]))
                    : this.showSuperClassesOf(classIri, superClasses);
            }));
        }
        commands.push(remove(() => this.removeEntity(classIri)));
        try {
            const htmlNodeReference = ((_b = this.diagram.representation) === null || _b === void 0 ? void 0 : _b.cy.$id(classIri)).popperRef();
            if (htmlNodeReference && commands.length > 0) {
                this.commandsWidget.attachTo(htmlNodeReference, commands);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    addDataPropertiesDetails(classIri) {
        this.getDataProperties(classIri).then(dataProperties => {
            this.incrementalDetails.setDataProperties(dataProperties.map(dp => grapholEntityToEntityViewData(dp, this.grapholscape)));
        });
    }
    addObjectPropertiesDetails(classIri) {
        // OBJECT PROPERTIES
        this.getObjectProperties(classIri).then(objectProperties => {
            if (objectProperties) {
                this.incrementalDetails.setObjectProperties(Array.from(objectProperties).map(v => {
                    return {
                        objectProperty: grapholEntityToEntityViewData(v[0], this.grapholscape),
                        connectedClasses: v[1].connectedClasses.map(classEntity => {
                            return grapholEntityToEntityViewData(classEntity, this.grapholscape);
                        }),
                        direct: v[1].direct,
                    };
                }));
            }
        });
    }
    reset() {
        if (this.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
            this.incrementalRenderer.createNewDiagram();
            this.entitySelector.show();
            if (this.grapholscape.renderer.diagram)
                setGraphEventHandlers(this.grapholscape.renderer.diagram, this.grapholscape.lifecycle, this.ontology);
            this.setIncrementalEventHandlers();
            this.incrementalDetails.reset();
            const entityDetails = this.grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS);
            entityDetails.hide();
            this.clearState();
        }
    }
    clearState() {
        var _a, _b;
        this.lastClassIri = undefined;
        this.lastInstanceIri = undefined;
        (_a = this.highlightsManager) === null || _a === void 0 ? void 0 : _a.clear();
        (_b = this.vKGApi) === null || _b === void 0 ? void 0 : _b.stopAllQueries();
    }
    hideUI() {
        var _a;
        this.incrementalDetails.hide();
        (_a = this.endpointController) === null || _a === void 0 ? void 0 : _a.hideView();
    }
    /**
     * Called when the user click on the remove button on a entity node
     * Remove a class, an instance or a data property node from the diagram
     * @param entityIri
     */
    removeEntity(entityIri, entitiesIrisToKeep) {
        this.incrementalRenderer.freezeGraph();
        this.diagramBuilder.removeEntity(entityIri, entitiesIrisToKeep);
        this.postDiagramEdit();
    }
    addInstance(instanceIriString) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.diagramBuilder.referenceNodeId)
                return;
            const parentClassEntity = this.ontology.getEntity(this.diagramBuilder.referenceNodeId);
            if (parentClassEntity) {
                const suggestedClassInstance = this.suggestedClassInstances.find(c => c.iri === instanceIriString);
                if (!suggestedClassInstance)
                    return;
                if (!this.diagram.classInstances) {
                    this.diagram.classInstances = new Map();
                }
                const instanceIri = new Iri(instanceIriString, this.ontology.namespaces, suggestedClassInstance === null || suggestedClassInstance === void 0 ? void 0 : suggestedClassInstance.shortIri);
                let instanceEntity;
                instanceEntity = this.diagram.classInstances.get(instanceIriString);
                if (!instanceEntity) {
                    instanceEntity = new ClassInstanceEntity(instanceIri);
                    this.diagram.classInstances.set(instanceIriString, instanceEntity);
                    // Set label as annotation
                    if (suggestedClassInstance.label) {
                        instanceEntity.addAnnotation(new Annotation(AnnotationsKind.label, suggestedClassInstance.label));
                    }
                }
                instanceEntity.parentClassIris.add(parentClassEntity.iri);
                this.incrementalRenderer.freezeGraph();
                this.diagramBuilder.addClassInstance(instanceIriString);
                this.connectInstanceToParentClasses(instanceEntity);
                const addedInstance = (_a = this.diagram.representation) === null || _a === void 0 ? void 0 : _a.grapholElements.get(instanceIriString);
                if (addedInstance) {
                    addedInstance.displayedName = instanceEntity.getDisplayedName(this.grapholscape.entityNameType, this.grapholscape.language, this.ontology.languages.default);
                    (_b = this.diagram.representation) === null || _b === void 0 ? void 0 : _b.updateElement(addedInstance);
                }
                this.postDiagramEdit();
                this.grapholscape.centerOnElement(instanceIriString);
            }
        });
    }
    addInstanceObjectProperty(instanceIriString, objectPropertyIri, parentClassIri, direct) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.diagramBuilder.referenceNodeId)
                return;
            const parentClassEntity = this.ontology.getEntity(parentClassIri);
            if (parentClassEntity) {
                const suggestedClassInstance = this.suggestedClassInstancesRanges.find(c => c.iri === instanceIriString);
                const instanceIri = new Iri(instanceIriString, this.ontology.namespaces, suggestedClassInstance === null || suggestedClassInstance === void 0 ? void 0 : suggestedClassInstance.shortIri);
                const instanceEntity = new ClassInstanceEntity(instanceIri, parentClassEntity.iri);
                if (!suggestedClassInstance)
                    return;
                // Set label as annotation
                if (suggestedClassInstance.label) {
                    instanceEntity.addAnnotation(new Annotation(AnnotationsKind.label, suggestedClassInstance.label));
                }
                // (await this.vKGApi?.getHighlights(parentClassIri))?.dataProperties?.forEach(dpIri => {
                //   instanceEntity.addDataProperty(dpIri)
                // })
                if (!this.diagram.classInstances) {
                    this.diagram.classInstances = new Map();
                }
                this.diagram.classInstances.set(instanceIriString, instanceEntity);
                this.incrementalRenderer.freezeGraph();
                this.diagramBuilder.addInstanceObjectProperty(objectPropertyIri, instanceIriString, direct);
                const addedInstance = (_a = this.diagram.representation) === null || _a === void 0 ? void 0 : _a.grapholElements.get(instanceIriString);
                if (addedInstance) {
                    addedInstance.displayedName = instanceEntity.getDisplayedName(this.grapholscape.entityNameType, this.grapholscape.language, this.ontology.languages.default);
                    (_b = this.diagram.representation) === null || _b === void 0 ? void 0 : _b.updateElement(addedInstance);
                    this.connectInstanceToParentClasses(instanceEntity);
                }
                this.postDiagramEdit();
                this.grapholscape.centerOnElement(instanceIriString);
            }
        });
    }
    /**
     * Called when the user trigger the toggle for showing data properties.
     * Given the state of the toggle and the list of dataproperties it is
     * controlling, use diagram builder to add or remove them
     * @param enabled
     * @param dataProperties
     */
    toggleDataProperties(enabled, dataProperties) {
        if (enabled) {
            dataProperties.forEach(dataProperty => this.diagramBuilder.addEntity(dataProperty.iri.fullIri));
        }
        else {
            dataProperties.forEach(dataProperty => this.diagramBuilder.removeEntity(dataProperty.iri.fullIri));
        }
        if (dataProperties.length > 0)
            this.postDiagramEdit();
    }
    /**
     * Called when the user select a class connected with the reference class
     * through an object property from the incremental menu.
     * Using diagram builder (which knows the actual reference class),
     * add the object property edge using the right direction
     * (towards reference class in case of a invereObjectProperty)
     * @param classIri the class selected in the list
     * @param objectPropertyIri the object property through which the class has been selected in the list
     * @param direct if true the edge goes from reference class to selected class in menu
     */
    addIntensionalObjectProperty(classIri, objectPropertyIri, direct) {
        this.incrementalRenderer.freezeGraph();
        this.diagramBuilder.addEntity(objectPropertyIri, classIri, direct);
        this.postDiagramEdit();
        this.grapholscape.centerOnElement(classIri);
    }
    /**
     * Show hierarchies for which the specified class is a subClass (i.e. an input class).
     * Hierarchies are pre-computed, after the floaty-transformation is performed.
     * @param classIri
     */
    showSuperHierarchiesOf(classIri) {
        const hierarchies = this.ontology.hierarchiesBySubclassMap.get(classIri);
        if (hierarchies && hierarchies.length > 0) {
            this.incrementalRenderer.freezeGraph();
            hierarchies.forEach(hierarchy => this.diagramBuilder.addHierarchy(hierarchy));
            this.postDiagramEdit();
        }
    }
    /**
     * Hide hierarchies for which the specified class is a subClass (i.e. an input class).
     * Hierarchies are pre-computed, after the floaty-transformation is performed.
     * @param classIri
     */
    hideSuperHierarchiesOf(classIri) {
        const hierarchies = this.ontology.hierarchiesBySubclassMap.get(classIri);
        if (hierarchies && hierarchies.length > 0) {
            this.incrementalRenderer.freezeGraph();
            hierarchies.forEach(hierarchy => this.diagramBuilder.removeHierarchy(hierarchy, [classIri]));
            this.postDiagramEdit();
        }
    }
    /**
     * Show hierarchies for which the specified class is a superclass.
     * Hierarchies are pre-computed, after the floaty-transformation is performed.
     * @param classIri
     */
    showSubHierarchiesOf(classIri) {
        const hierarchies = this.ontology.hierarchiesBySuperclassMap.get(classIri);
        if (hierarchies && hierarchies.length > 0) {
            this.incrementalRenderer.freezeGraph();
            hierarchies.forEach(hierarchy => this.diagramBuilder.addHierarchy(hierarchy));
            this.postDiagramEdit();
        }
    }
    /**
     * Show hierarchies for which the specified class is a superclass (i.e. an input class).
     * Hierarchies are pre-computed, after the floaty-transformation is performed.
     * @param classIri
     */
    hideSubHierarchiesOf(classIri) {
        const hierarchies = this.ontology.hierarchiesBySuperclassMap.get(classIri);
        if (hierarchies && hierarchies.length > 0) {
            this.incrementalRenderer.freezeGraph();
            hierarchies === null || hierarchies === void 0 ? void 0 : hierarchies.forEach(hierarchy => this.diagramBuilder.removeHierarchy(hierarchy, [classIri]));
            this.postDiagramEdit();
        }
    }
    showSubClassesOf(classIri, subclassesIris) {
        if (!subclassesIris) {
            subclassesIris = this.neighbourhoodFinder.getSubclassesIris(classIri);
        }
        subclassesIris.forEach(subclassIri => this.diagramBuilder.addSubClass(subclassIri));
        this.runLayout();
    }
    showSuperClassesOf(classIri, superclassesIris) {
        if (!superclassesIris) {
            superclassesIris = this.neighbourhoodFinder.getSuperclassesIris(classIri);
        }
        superclassesIris.forEach(subclassIri => this.diagramBuilder.addSuperClass(subclassIri));
        this.runLayout();
    }
    changeInstancesLimit(limitValue) {
        if (this.isReasonerEnabled) {
            this.vKGApi.limit = limitValue;
            if (this.incrementalDetails.canShowInstances && this.lastClassIri) {
                this.buildDetailsForClass(this.lastClassIri);
            }
            if (this.incrementalDetails.canShowDataPropertiesValues && this.lastInstanceIri) {
                this.buildDetailsForInstance(this.lastInstanceIri);
            }
        }
    }
    connectInstanceToParentClasses(instanceEntity) {
        instanceEntity.parentClassIris.forEach(parentClassIri => {
            this.diagramBuilder.addInstanceOfEdge(instanceEntity.iri.fullIri, parentClassIri.fullIri);
        });
    }
    onGetInstances(classIri, searchText) {
        this.incrementalDetails.areInstancesLoading = true;
        // if it's a search, clear instances list
        if (searchText !== undefined)
            this.incrementalDetails.setInstances([]);
        this.vKGApi.getInstances(classIri, this.onNewInstancesForDetails.bind(this), // onNewResults
        () => this.onStopInstanceLoading(classIri), // onStop
        searchText);
    }
    onGetInstancesByDataPropertyValue(classIri, dataPropertyIri, dataPropertyValue) {
        this.incrementalDetails.areInstancesLoading = true;
        this.incrementalDetails.setInstances([]);
        this.vKGApi.getInstancesByDataPropertyValue(classIri, dataPropertyIri, dataPropertyValue, this.onNewInstancesForDetails.bind(this), // onNewResults
        () => this.onStopInstanceLoading(classIri) // onStop
        );
    }
    onGetRangeInstances(instanceIri, objectPropertyIri, rangeClassIri) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            this.incrementalDetails.setObjectPropertyLoading(objectPropertyIri, rangeClassIri, true);
            const isDirect = ((_c = (_b = (yield ((_a = this.highlightsManager) === null || _a === void 0 ? void 0 : _a.objectProperties()))) === null || _b === void 0 ? void 0 : _b.find(op => op.objectPropertyIRI === objectPropertyIri)) === null || _c === void 0 ? void 0 : _c.direct) || false;
            (_d = this.vKGApi) === null || _d === void 0 ? void 0 : _d.getInstanceObjectPropertyRanges(instanceIri, objectPropertyIri, isDirect, rangeClassIri, (instances) => this.onNewInstanceRangesForDetails(instances, objectPropertyIri, rangeClassIri), // onNewResults
            () => this.onStopObjectPropertyRangeValueQuery(instanceIri, objectPropertyIri, rangeClassIri) // onStop
            );
        });
    }
    onNewInstancesForDetails(instances) {
        this.suggestedClassInstances = instances;
        this.incrementalDetails.setInstances(instances.map(instance => {
            let instanceEntity = this.getInstanceEntityFromClassInstance(instance);
            return {
                displayedName: instanceEntity.getDisplayedName(this.grapholscape.entityNameType, this.grapholscape.language),
                value: instanceEntity
            };
        }));
    }
    getHighlights(classIri) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isReasonerEnabled) {
                return yield this.vKGApi.getHighlights(classIri);
            }
        });
    }
    onNewInstanceRangesForDetails(instances, objectPropertyIri, rangeClassIri) {
        this.suggestedClassInstancesRanges.push(...instances);
        const instancesEntities = instances.map(i => grapholEntityToEntityViewData(this.getInstanceEntityFromClassInstance(i), this.grapholscape));
        this.incrementalDetails.addObjectPropertyRangeInstances(objectPropertyIri, rangeClassIri, instancesEntities);
    }
    /**
     * Given the iri of a class, retrieve connected object properties.
     * These object properties are inferred if the reasoner is available.
     * Otherwise only object properties directly asserted in the ontology
     * will be retrieved.
     * @param classIri
     * @returns
     */
    getObjectProperties(classIri) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isReasonerEnabled) {
                const branches = yield ((_a = this.highlightsManager) === null || _a === void 0 ? void 0 : _a.objectProperties());
                const objectPropertiesMap = new Map();
                branches === null || branches === void 0 ? void 0 : branches.forEach(branch => {
                    var _a;
                    if (!branch.objectPropertyIRI)
                        return;
                    const objectPropertyEntity = this.ontology.getEntity(branch.objectPropertyIRI);
                    if (!objectPropertyEntity)
                        return;
                    const connectedClasses = {
                        connectedClasses: [],
                        direct: branch.direct || false,
                    };
                    (_a = branch.relatedClasses) === null || _a === void 0 ? void 0 : _a.forEach(relatedClass => {
                        const relatedClassEntity = this.ontology.getEntity(relatedClass);
                        if (relatedClassEntity) {
                            connectedClasses.connectedClasses.push(relatedClassEntity);
                        }
                    });
                    objectPropertiesMap.set(objectPropertyEntity, connectedClasses);
                });
                return objectPropertiesMap;
            }
            else {
                return this.neighbourhoodFinder.getObjectProperties(classIri);
            }
        });
    }
    getDataProperties(classIri) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isReasonerEnabled) {
                const dataProperties = yield ((_a = this.highlightsManager) === null || _a === void 0 ? void 0 : _a.dataProperties());
                return (dataProperties === null || dataProperties === void 0 ? void 0 : dataProperties.map(dp => this.ontology.getEntity(dp)).filter(dpEntity => dpEntity !== null))
                    || [];
            }
            else {
                return this.neighbourhoodFinder.getDataProperties(classIri);
            }
        });
    }
    onStopDataPropertyValueQuery(instanceIri, dataPropertyIri) {
        // if there is a new instance iri, loading will be stopped by new requests
        if (instanceIri === this.lastInstanceIri) {
            this.incrementalDetails.setDataPropertyLoading(dataPropertyIri, false);
        }
    }
    onStopInstanceLoading(classIri) {
        if (classIri === this.lastClassIri) {
            this.incrementalDetails.areInstancesLoading = false;
        }
    }
    onStopObjectPropertyRangeValueQuery(instanceIri, objectPropertyIri, rangeClassIri) {
        if (instanceIri === this.lastInstanceIri) {
            this.incrementalDetails.setObjectPropertyLoading(objectPropertyIri, rangeClassIri, false);
        }
    }
    postDiagramEdit() {
        if (!this.diagram.representation || this.diagram.representation.grapholElements.size === 0) {
            this.entitySelector.show();
        }
        this.runLayout();
        const ontologyExplorer = this.grapholscape.widgets.get(WidgetEnum.ONTOLOGY_EXPLORER);
        if (ontologyExplorer) {
            ontologyExplorer.entities = createEntitiesList(this.grapholscape, ontologyExplorer.searchEntityComponent);
        }
    }
    runLayout() { this.incrementalRenderer.runLayout(); }
    setIncrementalEventHandlers() {
        var _a, _b, _c, _d;
        this.incrementalRenderer.onContextClick(target => this.showCommandsForClass(target.data().iri));
        if (((_a = this.diagram.representation) === null || _a === void 0 ? void 0 : _a.hasEverBeenRendered) || ((_b = this.diagram.representation) === null || _b === void 0 ? void 0 : _b.cy.scratch('_gscape-incremental-graph-handlers-set')))
            return;
        // const classOrInstanceSelector = `node[type = "${GrapholTypesEnum.CLASS}"], node[type = "${GrapholTypesEnum.CLASS_INSTANCE}"]`
        (_c = this.incrementalRenderer.diagramRepresentation) === null || _c === void 0 ? void 0 : _c.cy.on('tap', evt => {
            var _a, _b, _c, _d;
            const targetType = evt.target.data().type;
            if (targetType === GrapholTypesEnum.CLASS || targetType === GrapholTypesEnum.CLASS_INSTANCE) {
                if (this.isReasonerEnabled) {
                    (_a = this.vKGApi) === null || _a === void 0 ? void 0 : _a.stopAllQueries();
                }
                this.diagramBuilder.referenceNodeId = evt.target.id();
                const targetIri = evt.target.data().iri;
                // set class instance entity in entity details widget
                if (evt.target.data().type === GrapholTypesEnum.CLASS_INSTANCE) {
                    const instanceEntity = (_b = this.diagram.classInstances) === null || _b === void 0 ? void 0 : _b.get(targetIri);
                    if (instanceEntity) {
                        (_c = this.highlightsManager) === null || _c === void 0 ? void 0 : _c.computeHighlights(Array.from(instanceEntity.parentClassIris).map(iri => iri.fullIri));
                        this.grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS).setGrapholEntity(instanceEntity);
                        this.buildDetailsForInstance(targetIri);
                    }
                }
                else {
                    (_d = this.highlightsManager) === null || _d === void 0 ? void 0 : _d.computeHighlights(targetIri);
                    this.buildDetailsForClass(targetIri);
                }
                this.incrementalDetails.show();
            }
            else {
                this.incrementalDetails.hide();
            }
        });
        (_d = this.diagram.representation) === null || _d === void 0 ? void 0 : _d.cy.scratch('_gscape-incremental-graph-handlers-set', true);
    }
    get ontology() { return this.grapholscape.ontology; }
    get diagram() { return this.incrementalRenderer.incrementalDiagram; }
    get isReasonerEnabled() { return this.vKGApi !== undefined; }
    // private get vKGApi() {
    //   // if (this.grapholscape.mastroRequestOptions && !this._vKGApi) {
    //   //   if (this.endpointController?.selectedEndpoint)
    //   //     this._vKGApi = new VKGApi(this.grapholscape.mastroRequestOptions, this.endpointController?.selectedEndpoint)
    //   //   else
    //   //     this.initEndpointController()
    //   // }
    //   return this._vKGApi
    // }
    getInstanceEntityFromClassInstance(classInstance) {
        const instanceIri = new Iri(classInstance.iri, this.ontology.namespaces, classInstance.shortIri);
        const instanceEntity = new GrapholEntity(instanceIri, GrapholTypesEnum.CLASS_INSTANCE);
        if (classInstance.label) {
            instanceEntity.addAnnotation(new Annotation(AnnotationsKind.label, classInstance.label));
        }
        return instanceEntity;
    }
    get incrementalRenderer() { return this.grapholscape.renderer.renderState; }
}

function startIncremental(grapholscape, incrementalController) {
    var _a, _b;
    grapholscape.renderer.unselect();
    if (!grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR)) {
        initEntitySelector(grapholscape);
    }
    const entitySelector = grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR);
    (_a = grapholscape.uiContainer) === null || _a === void 0 ? void 0 : _a.appendChild(entitySelector);
    if (!grapholscape.widgets.get(WidgetEnum.INCREMENTAL_MENU)) {
        initIncrementalMenu(grapholscape);
    }
    // const incrementalController = new IncrementalController(
    //   grapholscape,
    //   grapholscape.renderer.renderState as IncrementalRendererState,
    //   grapholscape.widgets.get(WidgetEnum.INCREMENTAL_MENU) as GscapeIncrementalDetails,
    //   entitySelector
    // )
    incrementalController.init();
    grapholscape.widgets.get(WidgetEnum.DIAGRAM_SELECTOR).hide();
    const entityDetailsWidget = grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS);
    entityDetailsWidget.incrementalSection = grapholscape.widgets.get(WidgetEnum.INCREMENTAL_MENU);
    entityDetailsWidget.hide();
    if (((_b = grapholscape.renderer.grapholElements) === null || _b === void 0 ? void 0 : _b.size) === 0) {
        entitySelector.show();
    }
    // // TODO: when it will be available, remember to clear previous callbacks if startIncremental is called multiple times
    // grapholscape.on(LifecycleEvent.RendererChange, rendererState => {
    //   if (rendererState !== RendererStatesEnum.INCREMENTAL && grapholscape.mastroRequestOptions) {
    //     incrementalController.clearState()
    //   }
    // })
}

const rendererStates = {
    [RendererStatesEnum.GRAPHOL]: {
        name: 'Graphol',
        id: RendererStatesEnum.GRAPHOL,
        icon: graphol_icon,
        // description: 'Full ontology representation'
    },
    [RendererStatesEnum.GRAPHOL_LITE]: {
        name: 'Entity Diagram',
        id: RendererStatesEnum.GRAPHOL_LITE,
        icon: lite,
        // description: 'E/R like simplified representation'
    },
    [RendererStatesEnum.FLOATY]: {
        name: 'Floaty',
        id: RendererStatesEnum.FLOATY,
        icon: bubbles,
        // description: 'Further simplified representation. Only classes and properties'
    },
    [RendererStatesEnum.INCREMENTAL]: {
        name: 'Path',
        id: RendererStatesEnum.INCREMENTAL,
        icon: incremental,
        // description: 'Choose a class and explore adding other classe\' information on demand'
    }
};

function init$5 (rendererSelector, grapholscape) {
    let existingIncrementalController;
    rendererSelector.rendererStates = grapholscape.renderers.map(rendererStateKey => rendererStates[rendererStateKey]);
    if (grapholscape.renderState) {
        rendererSelector.actualRendererStateKey = grapholscape.renderState;
        if (grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
            existingIncrementalController = new IncrementalController(grapholscape);
            startIncremental(grapholscape, existingIncrementalController);
        }
    }
    rendererSelector.onRendererStateSelection = (rendererState) => {
        rendererStateSelectionCallback(rendererState, grapholscape);
    };
    rendererSelector.onIncrementalReset = () => {
        existingIncrementalController === null || existingIncrementalController === void 0 ? void 0 : existingIncrementalController.reset();
    };
    grapholscape.on(LifecycleEvent.RendererChange, (newRendererState) => {
        rendererSelector.actualRendererStateKey = newRendererState;
        if (newRendererState === RendererStatesEnum.FLOATY)
            rendererSelector.layoutSettingsComponent.openPanel();
        const filtersWidget = grapholscape.widgets.get(WidgetEnum.FILTERS);
        if (grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
            if (!existingIncrementalController) {
                existingIncrementalController = new IncrementalController(grapholscape);
            }
            startIncremental(grapholscape, existingIncrementalController);
            filtersWidget.hide();
        }
        else {
            existingIncrementalController === null || existingIncrementalController === void 0 ? void 0 : existingIncrementalController.clearState();
            existingIncrementalController === null || existingIncrementalController === void 0 ? void 0 : existingIncrementalController.hideUI();
            filtersWidget.show();
        }
    });
}
function rendererStateSelectionCallback(rendererState, grapholscape) {
    var _a, _b;
    if (rendererState !== grapholscape.renderState) {
        let isRenderValid = false;
        switch (rendererState) {
            case RendererStatesEnum.GRAPHOL:
                grapholscape.setRenderer(new GrapholRendererState());
                isRenderValid = true;
                break;
            case RendererStatesEnum.GRAPHOL_LITE:
                grapholscape.setRenderer(new LiteRendererState());
                isRenderValid = true;
                break;
            case RendererStatesEnum.FLOATY:
                grapholscape.setRenderer(new FloatyRendererState());
                isRenderValid = true;
                break;
        }
        if (rendererState === RendererStatesEnum.INCREMENTAL) {
            const incrementalRendererState = new IncrementalRendererState();
            grapholscape.setRenderer(incrementalRendererState);
            isRenderValid = true;
        }
        else {
            (_a = grapholscape.widgets.get(WidgetEnum.DIAGRAM_SELECTOR)) === null || _a === void 0 ? void 0 : _a.show();
            (_b = grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR)) === null || _b === void 0 ? void 0 : _b.hide();
            const entityDetailsWidget = grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS);
            if (entityDetailsWidget)
                entityDetailsWidget.incrementalSection = undefined;
        }
        if (isRenderValid)
            storeConfigEntry('selectedRenderer', rendererState);
    }
}

function init$4 (welcomeRendererSelector, grapholscape) {
    welcomeRendererSelector.options = grapholscape.renderers.map(rendererStateId => rendererStates[rendererStateId]);
    welcomeRendererSelector.onOptionSelection = (optionId) => rendererStateSelectionCallback(optionId, grapholscape);
}

class GscapeFullPageSelector extends BaseMixin(s) {
    constructor() {
        super(...arguments);
        this._title = 'Select a rendering mode:';
    }
    render() {
        return y `
      <div class="title bold-text">${this._title}</div>
      <div class="options">
        ${this.options.map(option => {
            if (option)
                return y `
              <div class="card" renderer-state=${option.id} @click=${this.handleRendererSelection}>
                <div class="icon">${option.icon}</div>
                <div class="title bold-text">${option.name}</div>
                <div class="description muted-text">${option.description}</div>
              </div>
            `;
        })}
      </div>
    `;
    }
    handleRendererSelection(evt) {
        const targetElement = evt.currentTarget;
        this.onOptionSelection(targetElement.getAttribute('renderer-state'));
        this.hide();
    }
}
GscapeFullPageSelector.properties = {
    rendererStates: { type: Object, attribute: false },
    title: { type: String, reflect: true },
};
GscapeFullPageSelector.styles = [
    baseStyle,
    i$1 `
      :host {
        z-index: 100;
        top: 0;
        height: 100%;
        width: 100%;
        position: absolute;
        background: var(--gscape-color-bg-default);
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 50px;
      }

      .title {
        font-size: 150%;
        text-align: center;
      }

      .options {
        display: flex;
        justify-content: center;
        align-items: stretch;
        gap: 24px;
      }

      .card {
        box-shadow: 0 2px 10px 0 var(--gscape-color-shadow);
        border: solid 1px var(--gscape-color-border-default);
        border-radius: var(--gscape-border-radius);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px;
        width: 15%;
      }

      .card > .icon {
        margin-bottom: 16px;
      }

      .card > .icon > svg {
        height: 40px !important;
        width: auto !important;
      }

      .card > .title {
        font-size: 120%;
      }

      .card > .description {
        text-align: center;
      }

      .card:hover {
        border-color: var(--gscape-color-accent);
        cursor: pointer;
        background-color: var(--gscape-color-neutral);
      }
    `
];
customElements.define('gscape-welcome-renderer-selector', GscapeFullPageSelector);

function initInitialRendererSelector(grapholscape) {
    const rendererSelectorComponent = new GscapeFullPageSelector();
    init$4(rendererSelectorComponent, grapholscape);
    grapholscape.widgets.set(WidgetEnum.INITIAL_RENDERER_SELECTOR, rendererSelectorComponent);
}

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
function initFullscreenButton(grapholscape) {
    const fullscreenComponent = new GscapeButton();
    //fullscreenComponent.container = grapholscape.container
    const icon = getIconSlot('icon', enterFullscreen);
    const alternativeIcon = getIconSlot('alt-icon', exitFullscreen);
    fullscreenComponent.appendChild(icon);
    fullscreenComponent.appendChild(alternativeIcon);
    fullscreenComponent.style.top = '10px';
    fullscreenComponent.style.right = '10px';
    fullscreenComponent.style.position = 'absolute';
    fullscreenComponent.onclick = toggleFullscreen;
    fullscreenComponent.title = 'Fullscreen';
    const doc = document; // avoid typechecking
    doc.cancelFullscreen =
        doc.exitFullscreen ||
            doc.cancelFullscreen ||
            doc.mozCancelFullScreen ||
            doc.webkitCancelFullScreen ||
            doc.msExitFullscreen;
    grapholscape.widgets.set(WidgetEnum.FULLSCREEN_BUTTON, fullscreenComponent);
    const container = grapholscape.container;
    function toggleFullscreen() {
        setFullScreenRequest();
        if (isFullscreen()) {
            doc.cancelFullscreen();
        }
        else {
            container === null || container === void 0 ? void 0 : container.requestFullscreen();
        }
    }
    function isFullscreen() {
        return doc.fullScreenElement ||
            doc.mozFullScreenElement || // Mozilla
            doc.webkitFullscreenElement || // Webkit
            doc.msFullscreenElement; // IE
    }
    function setFullScreenRequest() {
        container.requestFullscreen =
            (container === null || container === void 0 ? void 0 : container.requestFullscreen) ||
                (container === null || container === void 0 ? void 0 : container.mozRequestFullscreen) || // Mozilla
                (container === null || container === void 0 ? void 0 : container.mozRequestFullScreen) || // Mozilla older API use uppercase 'S'.
                (container === null || container === void 0 ? void 0 : container.webkitRequestFullscreen) || // Webkit
                (container === null || container === void 0 ? void 0 : container.msRequestFullscreen); // IE
    }
}

class GscapeOntologyInfo extends DropPanelMixin(BaseMixin(s)) {
    constructor() {
        super();
        this.title = "Ontology Info";
        this.classList.add(BOTTOM_RIGHT_WIDGET.toString());
    }
    render() {
        return y `
      <gscape-button type="subtle" @click="${this.togglePanel}">
        <span slot="icon">${info_outline}</span>
      </gscape-button>  

      <div class="gscape-panel gscape-panel-in-tray hide" id="drop-panel">
        <div class="header" style="display: none">Ontology Info</div>

        ${itemWithIriTemplate(this.ontology)}
        
        ${annotationsTemplate(this.ontology.annotations)}

        ${this.iriPrefixesTemplate()}
      </div>
    `;
    }
    iriPrefixesTemplate() {
        let numRows;
        return y `
      <table>
        <caption>Namespace prefixes</caption>
        ${this.ontology.namespaces.map(namespace => {
            numRows = namespace.prefixes.length;
            return y `
              ${namespace.prefixes.map((prefix, i) => {
                return y `
                  <tr>
                    <th>${prefix}</th>
                    ${i === 0
                    ? y `<td rowspan="${numRows}">${namespace.toString()}</td>`
                    : null}
                  </tr>
                `;
            })}
          `;
        })}
      </table>
    `;
    }
}
GscapeOntologyInfo.styles = [
    baseStyle,
    itemWithIriTemplateStyle,
    annotationsStyle,
    i$1 `
      :host {
        order: 4;
        display:inline-block;
        position: initial;
        margin-top: 10px;
      }

      .gscape-panel {
        padding:0;
        font-size: 12px;
        min-height: 200px;
      }

      .gscape-panel > * {
        padding: 8px 16px;
      }

      table {
        border-spacing: 0;
      }

      th, td {
        padding: 2px;
      }

      td {
        padding-left: 8px;
      }

      th {
        text-align: left;
        border-right: solid 1px var(--gscape-color-border-subtle);
        padding-right: 8px;
      }
      
      table > caption {
        margin-top: 8px;
        font-weight: 600;
      }
    `,
];
customElements.define('gscape-ontology-info', GscapeOntologyInfo);

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
function initOntologyInfo(grapholscape) {
    const ontologyInfoComponent = new GscapeOntologyInfo();
    ontologyInfoComponent.ontology = ontologyModelToViewData(grapholscape.ontology);
    grapholscape.widgets.set(WidgetEnum.ONTOLOGY_INFO, ontologyInfoComponent);
}
function ontologyModelToViewData(ontologyModelData) {
    let ontologyViewData = {
        name: ontologyModelData.name,
        typeOrVersion: ontologyModelData.version,
        iri: ontologyModelData.iri || '',
        namespaces: ontologyModelData.namespaces,
        annotations: ontologyModelData.annotations,
    };
    return ontologyViewData;
}

function capitalizeFirstChar (text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function entityIriTemplate(iri, entityType) {
    if (entityType === GrapholTypesEnum.INDIVIDUAL) {
        if (iri.remainder.search(/"[\w]+"\^\^[\w]+:/) != -1) {
            var value = iri.remainder.split('^^')[0];
            var datatype = iri.remainder.split(':')[1];
            return '<span class="owl_value">' + value + '</span>^^' +
                '<span class="axiom_predicate_prefix">' + iri.prefix + '</span>' +
                '<span class="owl_value-domain">' + datatype + '</span>';
        }
        return;
    }
    return `<span class="axiom_predicate_prefix">${iri.prefix}</span>:<span class="owl_${entityType}">${iri.remainder}</span>`;
}

class GrapholToOwlTranslator {
    constructor(grapholscape) {
        this.malformed = '<span class="owl_error">Malformed Axiom</span>';
        this.missingOperand = '<span class="owl_error">Missing Operand</span>';
        this.owlThing = '<span class="axiom_predicate_prefix">owl:</span><span class="axiom_predefinite_obj">Thing</span>';
        this.rdfsLiteral = '<span class="axiom_predicate_prefix">rdfs:</span><span class="axiom_predefinite_obj">Literal</span>';
        this._grapholscape = grapholscape;
    }
    edgeToOwlString(edge) {
        const grapholEdge = this._grapholscape.ontology.getGrapholEdge(edge.id(), this._grapholscape.diagramId);
        if (!grapholEdge)
            return;
        const source = edge.source();
        const grapholSource = this._grapholscape.ontology.getGrapholNode(source.id(), this._grapholscape.diagramId);
        const target = edge.target();
        const grapholTarget = this._grapholscape.ontology.getGrapholNode(target.id(), this._grapholscape.diagramId);
        if (!grapholSource || !grapholTarget)
            return;
        switch (grapholEdge.type) {
            case GrapholTypesEnum.INCLUSION:
                if (grapholSource.identity !== grapholTarget.identity)
                    return;
                switch (grapholSource.identity) {
                    case GrapholTypesEnum.CLASS:
                        if (grapholSource.is(GrapholTypesEnum.DOMAIN_RESTRICTION) && grapholSource.displayedName != 'self' && grapholTarget.displayedName != 'self') {
                            return this.propertyDomain(edge);
                        }
                        else if (grapholSource.is(GrapholTypesEnum.RANGE_RESTRICTION) && grapholSource.displayedName != 'self' && grapholTarget.displayedName != 'self') {
                            return this.propertyRange(edge);
                        }
                        else if (grapholTarget.is(GrapholTypesEnum.COMPLEMENT) || grapholSource.is(GrapholTypesEnum.COMPLEMENT)) {
                            return this.disjointClassesFromEdge(edge.connectedNodes());
                        }
                        return this.subClassOf(edge);
                    case GrapholTypesEnum.OBJECT_PROPERTY:
                        if (grapholTarget.is(GrapholTypesEnum.COMPLEMENT))
                            return this.disjointTypeProperties(edge);
                        else
                            return this.subTypePropertyOf(edge);
                    case GrapholTypesEnum.VALUE_DOMAIN:
                        return this.propertyRange(edge);
                    case GrapholTypesEnum.DATATYPE_RESTRICTION:
                        if (grapholTarget.is(GrapholTypesEnum.COMPLEMENT))
                            return this.disjointTypeProperties(edge);
                        else
                            return this.subTypePropertyOf(edge);
                    default: return this.malformed;
                }
            case GrapholTypesEnum.EQUIVALENCE:
                if (grapholSource.identity !== grapholTarget.identity)
                    return;
                switch (grapholSource.identity) {
                    case GrapholTypesEnum.CLASS:
                        return this.equivalentClasses(edge);
                    case GrapholTypesEnum.OBJECT_PROPERTY:
                        if (grapholSource.is(GrapholTypesEnum.ROLE_INVERSE) || grapholTarget.is(GrapholTypesEnum.ROLE_INVERSE)) {
                            return this.inverseObjectProperties(edge);
                        }
                        else {
                            return this.equivalentTypeProperties(edge);
                        }
                    case GrapholTypesEnum.DATA_PROPERTY:
                        return this.equivalentTypeProperties(edge);
                    default:
                        return this.malformed;
                }
            case GrapholTypesEnum.MEMBERSHIP:
                if (grapholTarget.identity == GrapholTypesEnum.CLASS)
                    return this.classAssertion(edge);
                else
                    return this.propertyAssertion(edge);
        }
    }
    subClassOf(inclusionEdge) {
        return `SubClassOf(${this.nodeToOwlString(inclusionEdge.source())} ${this.nodeToOwlString(inclusionEdge.target())})`;
    }
    propertyDomain(edgeOutFromDomain) {
        const nodes = edgeOutFromDomain.source().incomers(`[type = "${GrapholTypesEnum.INPUT}"]`).sources();
        if (nodes.size() > 1)
            return this.subClassOf(edgeOutFromDomain);
        const sourceNode = nodes[0];
        const sourceGrapholNode = this._grapholscape.ontology.getGrapholNode(sourceNode.id(), this._grapholscape.diagramId);
        if (!sourceGrapholNode)
            return;
        let axiomType = this.getAxiomPropertyType(sourceGrapholNode);
        return `${axiomType}PropertyDomain(${this.nodeToOwlString(sourceNode)} ${this.nodeToOwlString(edgeOutFromDomain.target())})`;
    }
    propertyRange(edge) {
        var nodeSources = edge.source().incomers(`[type = "${GrapholTypesEnum.INPUT}"]`).sources();
        if (nodeSources.size() > 1) {
            return this.subClassOf(edge);
        }
        const sourceNode = nodeSources[0];
        const sourceGrapholNode = this._grapholscape.ontology.getGrapholNode(sourceNode.id(), this._grapholscape.diagramId);
        if (!sourceGrapholNode)
            return;
        const axiomType = this.getAxiomPropertyType(sourceGrapholNode);
        return `${axiomType}PropertyRange(${this.nodeToOwlString(sourceNode)} ${this.nodeToOwlString(edge.target())})`;
    }
    propertyAssertion(edge) {
        const targetGrapholNode = this._grapholscape.ontology.getGrapholNode(edge.target().id(), this._grapholscape.diagramId);
        const sourceGrapholNode = this._grapholscape.ontology.getGrapholNode(edge.source().id(), this._grapholscape.diagramId);
        if (!targetGrapholNode || !sourceGrapholNode)
            return;
        const axiomType = this.getAxiomPropertyType(targetGrapholNode);
        let owlString = axiomType + 'PropertyAssertion(' + this.nodeToOwlString(edge.target()) + ' ';
        if (sourceGrapholNode.type == GrapholTypesEnum.PROPERTY_ASSERTION) {
            var property_node = edge.source();
            property_node.incomers(`[type = "${GrapholTypesEnum.INPUT}"]`).sources().forEach(input => {
                owlString += this.nodeToOwlString(input) + ' ';
            });
            owlString = owlString.slice(0, owlString.length - 1);
        }
        else {
            owlString += this.nodeToOwlString(edge.source());
        }
        return owlString + ')';
    }
    classAssertion(edge) {
        return `ClassAssertion(${this.nodeToOwlString(edge.source())} ${this.nodeToOwlString(edge.target())})`;
    }
    inverseObjectProperties(edge) {
        let complementInput, input;
        if (edge.source().data('type') == GrapholTypesEnum.ROLE_INVERSE) {
            input = edge.target();
            complementInput = edge.source().incomers(`[type = "${GrapholTypesEnum.INPUT}"]`).sources()[0];
        }
        else {
            input = edge.source();
            complementInput = edge.target().incomers(`[type = "${GrapholTypesEnum.INPUT}"]`).sources()[0];
        }
        if (complementInput.empty()) {
            return this.missingOperand;
        }
        return `InverseObjectProperties(${this.nodeToOwlString(input)} ${this.nodeToOwlString(complementInput)})`;
    }
    equivalentClasses(edge) {
        return `EquivalentClasses(${this.nodeToOwlString(edge.source())} ${this.nodeToOwlString(edge.target())})`;
    }
    equivalentTypeProperties(edge) {
        const sourceGrapholNode = this._grapholscape.ontology.getGrapholNode(edge.source().id(), this._grapholscape.diagramId);
        if (!sourceGrapholNode)
            return;
        const axiomType = this.getAxiomPropertyType(sourceGrapholNode);
        return `Equivalent${axiomType}Properties(${this.nodeToOwlString(edge.source())} ${this.nodeToOwlString(edge.target())})`;
    }
    subTypePropertyOf(edge) {
        const targetGrapholNode = this._grapholscape.ontology.getGrapholNode(edge.target().id(), this._grapholscape.diagramId);
        if (!targetGrapholNode)
            return;
        const axiomType = this.getAxiomPropertyType(targetGrapholNode);
        return `Sub${axiomType}PropertyOf(${this.nodeToOwlString(edge.source())} ${this.nodeToOwlString(edge.target())})`;
    }
    disjointClassesFromEdge(inputs) {
        var owlString = 'DisjointClasses(';
        inputs.forEach((input) => {
            if (input.data('type') == GrapholTypesEnum.COMPLEMENT) {
                input = input.incomers(`[type = "${GrapholTypesEnum.INPUT}"]`).source();
            }
            owlString += this.nodeToOwlString(input) + ' ';
        });
        owlString = owlString.slice(0, owlString.length - 1);
        owlString += ')';
        return owlString;
    }
    disjointTypeProperties(edge) {
        const firstInputGrapholNode = this._grapholscape.ontology.getGrapholNode(edge.target().id(), this._grapholscape.diagramId);
        if (!firstInputGrapholNode)
            return;
        const axiomType = this.getAxiomPropertyType(firstInputGrapholNode);
        let owlString = `Disjoint${axiomType}Properties(`;
        edge.connectedNodes().forEach((node) => {
            if (node.data('type') == GrapholTypesEnum.COMPLEMENT) {
                node = node.incomers(`[type = "${GrapholTypesEnum.INPUT}"]`).source();
            }
            owlString += this.nodeToOwlString(node) + ' ';
        });
        owlString = owlString.slice(0, owlString.length - 1);
        return owlString + ')';
    }
    // ============================== NODE ==============================
    nodeToOwlString(node, startingFromNode = false) {
        const grapholNode = this._grapholscape.ontology.getGrapholNode(node.id(), this._grapholscape.diagramId);
        if (!grapholNode)
            return;
        let owl_string;
        if (grapholNode.isEntity() || grapholNode.is(GrapholTypesEnum.VALUE_DOMAIN)) {
            let nodeIri;
            const grapholNodeEntity = this._grapholscape.ontology.getEntity(node.data().iri);
            if (grapholNodeEntity === null || grapholNodeEntity === void 0 ? void 0 : grapholNodeEntity.iri) {
                nodeIri = grapholNodeEntity.iri;
            }
            else if (grapholNode.is(GrapholTypesEnum.VALUE_DOMAIN) && grapholNode.displayedName) {
                nodeIri = {
                    prefix: grapholNode.displayedName.split(':')[0] || '',
                    remainder: grapholNode.displayedName.split(':')[1] || grapholNode.displayedName,
                };
            }
            else
                return;
            const iriSpan = entityIriTemplate(nodeIri, grapholNode.type);
            // if startingFromNode, return iri declaration
            if (startingFromNode) {
                owl_string = '';
                const entitiesOwlNames = {};
                entitiesOwlNames[GrapholTypesEnum.CLASS] = 'Class';
                entitiesOwlNames[GrapholTypesEnum.OBJECT_PROPERTY] = 'ObjectProperty';
                entitiesOwlNames[GrapholTypesEnum.DATA_PROPERTY] = 'DataProperty';
                entitiesOwlNames[GrapholTypesEnum.INDIVIDUAL] = 'NamedIndividual';
                entitiesOwlNames[GrapholTypesEnum.VALUE_DOMAIN] = 'Datatype';
                if (grapholNode.is(GrapholTypesEnum.OBJECT_PROPERTY) || grapholNode.is(GrapholTypesEnum.DATA_PROPERTY)) {
                    grapholNodeEntity === null || grapholNodeEntity === void 0 ? void 0 : grapholNodeEntity.functionalities.forEach(functionality => {
                        owl_string += `<br/>${capitalizeFirstChar(functionality)}${entitiesOwlNames[grapholNode.type]}(${iriSpan})`;
                    });
                }
                return `Declaration(${entitiesOwlNames[grapholNode.type]}(${iriSpan}))` + owl_string;
            }
            else {
                return iriSpan;
            }
        }
        // node is a constructor
        else {
            let inputs;
            switch (grapholNode.type) {
                case GrapholTypesEnum.FACET:
                    var remainder = grapholNode.displayedName.replace(/\n/g, '^').split('^^');
                    remainder[0] = remainder[0].slice(4);
                    return '<span class="axiom_predicate_prefix">xsd:</span><span class="owl_value-domain">' + remainder[0] + '</span><span class="owl_value">' + remainder[1] + '</span>';
                case GrapholTypesEnum.DOMAIN_RESTRICTION:
                case GrapholTypesEnum.RANGE_RESTRICTION:
                    var input_edges = node.connectedEdges(`edge[target = "${node.id()}"][type = "${GrapholTypesEnum.INPUT}"]`);
                    var input_first;
                    var input_other;
                    if (!input_edges.length) {
                        return this.missingOperand;
                    }
                    input_edges.forEach((e) => {
                        if (e.source().data('type') == GrapholTypesEnum.OBJECT_PROPERTY || e.source().data('type') == GrapholTypesEnum.DATA_PROPERTY) {
                            input_first = e.source();
                        }
                        if (e.source().data('type') != GrapholTypesEnum.OBJECT_PROPERTY && e.source().data('type') != GrapholTypesEnum.DATA_PROPERTY) {
                            input_other = e.source();
                        }
                    });
                    if (input_first) {
                        if (input_first.data('type') == GrapholTypesEnum.DATA_PROPERTY && grapholNode.type == GrapholTypesEnum.RANGE_RESTRICTION)
                            return;
                        switch (grapholNode.displayedName) {
                            case 'exists':
                                return this.valuesFrom(input_first, input_other, grapholNode.type, 'Some');
                            case 'forall':
                                return this.valuesFrom(input_first, input_other, grapholNode.type, 'All');
                            case 'self':
                                return this.hasSelf(input_first, grapholNode.type);
                            default:
                                if (node.data('displayedName').search(/\(([-]|[\d]+),([-]|[\d]+)\)/) != -1) {
                                    var cardinality = grapholNode.displayedName.replace(/\(|\)/g, '').split(/,/);
                                    return this.minMaxExactCardinality(input_first, input_other, cardinality, grapholNode.type);
                                }
                                return this.missingOperand;
                        }
                    }
                    return;
                case GrapholTypesEnum.ROLE_INVERSE:
                    inputs = node.incomers(`[type = "${GrapholTypesEnum.INPUT}"]`).sources();
                    if (inputs.length <= 0)
                        return this.missingOperand;
                    return this.objectInverseOf(inputs[0]);
                case GrapholTypesEnum.ROLE_CHAIN:
                    if (!node.data('inputs'))
                        return this.missingOperand;
                    return this.objectPropertyChain(node.incomers(`[type = "${GrapholTypesEnum.INPUT}"]`).sources());
                case GrapholTypesEnum.UNION:
                case GrapholTypesEnum.INTERSECTION:
                case GrapholTypesEnum.COMPLEMENT:
                case GrapholTypesEnum.ENUMERATION:
                case GrapholTypesEnum.DISJOINT_UNION:
                    inputs = node.incomers(`[type = "${GrapholTypesEnum.INPUT}"]`).sources();
                    if (inputs.length <= 0)
                        return this.missingOperand;
                    const axiomType = this.getAxiomPropertyType(grapholNode);
                    if (node.data('type') == GrapholTypesEnum.DISJOINT_UNION) {
                        if (!startingFromNode) {
                            return this.logicalConstructors(inputs, GrapholTypesEnum.UNION, axiomType);
                        }
                        else {
                            return this.logicalConstructors(inputs, GrapholTypesEnum.UNION, axiomType) + '<br />' + this.disjointClassesFromNode(inputs);
                        }
                    }
                    return this.logicalConstructors(inputs, node.data('type'), axiomType);
                case GrapholTypesEnum.DATATYPE_RESTRICTION:
                    inputs = node.incomers(`[type = "${GrapholTypesEnum.INPUT}"]`).sources();
                    if (inputs.length <= 0) {
                        return this.missingOperand;
                    }
                    return this.datatypeRestriction(inputs);
                case GrapholTypesEnum.PROPERTY_ASSERTION:
                    return;
                case GrapholTypesEnum.KEY:
                    inputs = node.incomers(`[type = "${GrapholTypesEnum.INPUT}"]`).sources();
                    if (inputs.length <= 0)
                        return this.missingOperand;
                    return this.hasKey(inputs);
            }
        }
    }
    valuesFrom(first, other, restrictionType, cardinality) {
        let owlString;
        const firstInputGrapholNode = this._grapholscape.ontology.getGrapholNode(first.id(), this._grapholscape.diagramId);
        if (!firstInputGrapholNode)
            return;
        const axiomType = this.getAxiomPropertyType(firstInputGrapholNode);
        owlString = `${axiomType}${cardinality}ValuesFrom(`;
        // if the node is a range-restriction, put the inverse of the role
        if (restrictionType == GrapholTypesEnum.RANGE_RESTRICTION) {
            owlString += this.objectInverseOf(first);
        }
        else {
            owlString += this.nodeToOwlString(first);
        }
        if (!other && axiomType == 'Object') {
            return owlString += ` ${this.owlThing})`;
        }
        if (!other && axiomType == 'Data') {
            return owlString += ` ${this.rdfsLiteral})`;
        }
        return owlString += ` ${this.nodeToOwlString(other)})`;
    }
    minMaxExactCardinality(first, other, cardinality, restrictionType) {
        const getCardinalityString = (cardinality, cardinalityType) => {
            if (restrictionType == GrapholTypesEnum.RANGE_RESTRICTION) {
                if (!other)
                    return `${axiomType}${cardinalityType}Cardinality(${cardinality} ${this.objectInverseOf(first)})`;
                else
                    return `${axiomType}${cardinalityType}Cardinality(${cardinality} ${this.objectInverseOf(first)} ${this.nodeToOwlString(other)})`;
            }
            else {
                if (!other)
                    return `${axiomType}${cardinalityType}Cardinality(${cardinality} ${this.nodeToOwlString(first)})`;
                else
                    return `${axiomType}${cardinalityType}Cardinality(${cardinality} ${this.nodeToOwlString(first)} ${this.nodeToOwlString(other)})`;
            }
        };
        const firstInputGrapholNode = this._grapholscape.ontology.getGrapholNode(first.id(), this._grapholscape.diagramId);
        if (!firstInputGrapholNode)
            return;
        const axiomType = this.getAxiomPropertyType(firstInputGrapholNode);
        if (cardinality[0] == '-') {
            return getCardinalityString(cardinality[1], 'Max');
        }
        if (cardinality[1] == '-') {
            return getCardinalityString(cardinality[0], 'Min');
        }
        if (cardinality[0] != '-' && cardinality[1] != '-') {
            var min = [];
            var max = [];
            min.push(cardinality[0]);
            min.push('-');
            max.push('-');
            max.push(cardinality[1]);
            return `${axiomType} IntersectionOf(${this.minMaxExactCardinality(first, other, min, restrictionType)} ${this.minMaxExactCardinality(first, other, max, restrictionType)})`;
        }
    }
    objectInverseOf(node) {
        return `ObjectInverseOf(${this.nodeToOwlString(node)})`;
    }
    objectPropertyChain(inputs) {
        let owlString = 'ObjectPropertyChain(';
        inputs.forEach(input => {
            owlString += this.nodeToOwlString(input) + ' ';
        });
        owlString = owlString.slice(0, owlString.length - 1);
        owlString += ')';
        return owlString;
    }
    hasKey(inputs) {
        let classNode = inputs.filter(`[identity = "${GrapholTypesEnum.CLASS}}"]`);
        let owlString = `HasKey(${this.nodeToOwlString(classNode)} `;
        inputs.forEach(input => {
            if (input.id() != classNode.id()) {
                owlString += this.nodeToOwlString(input) + ' ';
            }
        });
        owlString = owlString.slice(0, owlString.length - 1) + ')';
        return owlString;
    }
    logicalConstructors(inputs, constructorName, axiomType) {
        let owlString;
        if (constructorName == GrapholTypesEnum.ENUMERATION) {
            constructorName = 'One';
        }
        else // Capitalize first char
         {
            constructorName = constructorName.charAt(0).toUpperCase() + constructorName.slice(1);
        }
        owlString = axiomType + constructorName + 'Of(';
        inputs.forEach((input) => {
            owlString += this.nodeToOwlString(input) + ' ';
        });
        owlString = owlString.slice(0, owlString.length - 1);
        owlString += ')';
        return owlString;
    }
    disjointClassesFromNode(inputs) {
        let owlString = 'DisjointClasses(';
        inputs.forEach((input) => {
            owlString += this.nodeToOwlString(input) + ' ';
        });
        owlString = owlString.slice(0, owlString.length - 1);
        owlString += ')';
        return owlString;
    }
    datatypeRestriction(inputs) {
        let owlString = 'DatatypeRestriction(';
        let valueDomain = inputs.filter(`[type = "${GrapholTypesEnum.VALUE_DOMAIN}"]`)[0];
        owlString += this.nodeToOwlString(valueDomain) + ' ';
        inputs.forEach((input) => {
            if (input.data('type') == GrapholTypesEnum.FACET) {
                owlString += this.nodeToOwlString(input) + '^^';
                owlString += this.nodeToOwlString(valueDomain) + ' ';
            }
        });
        owlString = owlString.slice(0, owlString.length - 1);
        owlString += ')';
        return owlString;
    }
    hasSelf(input, restrictionType) {
        // if the restriction is on the range, put the inverse of node
        if (restrictionType == GrapholTypesEnum.RANGE_RESTRICTION)
            return `ObjectHasSelf(${this.objectInverseOf(input)})`;
        return `ObjectHasSelf(${this.nodeToOwlString(input)})`;
    }
    getAxiomPropertyType(node) {
        if (node.is(GrapholTypesEnum.DATA_PROPERTY))
            return 'Data';
        else if (node.is(GrapholTypesEnum.OBJECT_PROPERTY))
            return 'Object';
        if (isGrapholNode(node)) {
            if (node.identity === GrapholTypesEnum.DATA_PROPERTY)
                return 'Data';
            else if (node.identity === GrapholTypesEnum.OBJECT_PROPERTY)
                return 'Object';
        }
        return '';
    }
}

function init$3 (owlVisualizerComponent, grapholscape) {
    grapholscape.on(LifecycleEvent.NodeSelection, node => {
        var _a;
        showOwlTranslation((_a = grapholscape.renderer.cy) === null || _a === void 0 ? void 0 : _a.$id(node.id));
    });
    grapholscape.on(LifecycleEvent.EdgeSelection, edge => {
        var _a;
        showOwlTranslation((_a = grapholscape.renderer.cy) === null || _a === void 0 ? void 0 : _a.$id(edge.id));
    });
    // grapholscape.onNodeSelection( node => showOwlTranslation(node))
    // grapholscape.onEdgeSelection( edge => showOwlTranslation(edge))
    grapholscape.on(LifecycleEvent.RendererChange, rendererKey => {
        if (rendererKey !== RendererStatesEnum.GRAPHOL)
            owlVisualizerComponent.hide();
    });
    function showOwlTranslation(elem) {
        if (!elem)
            return;
        if (grapholscape.renderState === RendererStatesEnum.GRAPHOL) {
            const owlTranslator = new GrapholToOwlTranslator(grapholscape);
            if (elem.isNode())
                owlVisualizerComponent.owlText = owlTranslator.nodeToOwlString(elem, true) || '';
            else
                owlVisualizerComponent.owlText = owlTranslator.edgeToOwlString(elem) || '';
            owlVisualizerComponent.show();
        }
    }
}

class GscapeOwlVisualizer extends BaseMixin(DropPanelMixin(s)) {
    constructor() {
        super(...arguments);
        this.title = "OWL 2 Translation";
        this.owlText = '';
    }
    render() {
        if (!this.owlText)
            return;
        return y `
      <div class="top-bar ${this.isPanelClosed() ? null : 'traslated-down'}">
        <gscape-button style="z-index: 1"
          id="toggle-panel-button"
          size="${this.isPanelClosed() ? 'm' : 's'}" 
          type="${this.isPanelClosed() ? '' : 'subtle'}"
          @click=${this.togglePanel}
          label = "${this.isPanelClosed() ? this.title : ''}"
        > 
          ${this.isPanelClosed()
            ? y `
                <span slot="icon">${owl_icon}</span>
                <span slot="trailing-icon">${plus}</span>
              `
            : y `<span slot="icon">${minus}</span>`}
        </gscape-button>
      </div>

      <div class="gscape-panel" id="drop-panel">
        <div class="owl-text"></div>
      </div>
    `;
    }
    // override blur to avoid collapsing when clicking on cytoscape's canvas
    blur() { }
    updated() {
        var _a;
        const owlTextDiv = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('.owl-text');
        if (owlTextDiv)
            owlTextDiv.innerHTML = this.owlText;
    }
}
GscapeOwlVisualizer.properties = {
    owlText: { type: String, attribute: false }
};
GscapeOwlVisualizer.styles = [
    baseStyle,
    i$1 `
      :host {
        bottom: 10px;
        position: absolute;
        max-width: calc(90% - 64px);
        left: 50%;
        transform: translate(-50%);
      }

      .gscape-panel {
        max-width: unset;
        width: 100%;
        box-sizing: border-box;
      }

      .owl-text {
        padding: 15px 10px;
        font-family: "Lucida Console", Monaco, monospace;
        overflow: auto;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .owl_class{
        color: #b58900;
      }

      .owl_object-property{
        color: #268bd2;
      }

      .owl_data-property{
        color: #859900;
      }

      .owl_value-domain{
        color: #2aa198;
      }

      .owl_individual{
        color: #6c71c4;
      }

      .owl_value {
        color: #d33682;
      }

      .axiom_predicate_prefix{
        color:#cb4b16;
      }

      .owl_error {
        color: var(--theme-gscape-error);
      }

      .axiom_predefinite_obj {
        color: #00c0a0;
      }
      
      .top-bar {
        display: flex;
        flex-direction: row-reverse;
        line-height: 1;
      }

      .traslated-down {
        position: absolute;
        right: 0;
      }

    `,
];
customElements.define('gscape-owl-visualizer', GscapeOwlVisualizer);

function initOwlVisualizer(grapholscape) {
    const owlVisualizerComponent = new GscapeOwlVisualizer();
    init$3(owlVisualizerComponent, grapholscape);
    grapholscape.widgets.set(WidgetEnum.OWL_VISUALIZER, owlVisualizerComponent);
}

class GscapeRenderSelector extends DropPanelMixin(BaseMixin(s)) {
    constructor() {
        super();
        this.title = 'Renderer Selector';
        this.onRendererStateSelection = () => { };
        this.classList.add(BOTTOM_RIGHT_WIDGET.toString());
    }
    render() {
        var _a;
        return y `
      ${this.actualRendererStateKey === RendererStatesEnum.FLOATY ||
            this.actualRendererStateKey === RendererStatesEnum.INCREMENTAL
            ? y `
          ${this.actualRendererStateKey === RendererStatesEnum.INCREMENTAL && this.onIncrementalReset
                ? y `
              <gscape-button @click=${this.onIncrementalReset} type="subtle" title="Restart Incremental Exploration">
                <span slot="icon">${refresh}</span>
              </gscape-button>
              <div class="hr"></div>
            `
                : null}
          ${this.layoutSettingsComponent}
          <div class="hr"></div>
        `
            : null}

      <gscape-button @click="${this.togglePanel}" type="subtle">
        <span slot="icon">${(_a = this.actualRendererState) === null || _a === void 0 ? void 0 : _a.icon}</span>
      </gscape-button>

      <div class="gscape-panel gscape-panel-in-tray hanging hide" id="drop-panel">
        <div class="header">${this.title}</div>
        <div class="content-wrapper">
      ${this.rendererStates.map(rendererState => {
            if (rendererState) {
                return y `
                <gscape-action-list-item
                  @click=${this.rendererSelectionHandler}
                  label="${rendererState.name}"
                  renderer-state="${rendererState.id}"
                  ?selected = "${this.actualRendererState === rendererState}"
                >
                  <span slot="icon">${rendererState.icon}</span>
                </gscape-action-list-item>
              `;
            }
        })}
        </div>
      </div>
    `;
    }
    rendererSelectionHandler(e) {
        this.togglePanel();
        const rendererState = e.target.getAttribute('renderer-state');
        this.onRendererStateSelection(rendererState);
    }
    get actualRendererState() { return this.rendererStates.find(r => (r === null || r === void 0 ? void 0 : r.id) === this.actualRendererStateKey); }
}
GscapeRenderSelector.properties = {
    actualRendererStateKey: { type: String, attribute: false },
    rendererStates: { type: Object, attribute: false },
    onIncrementalRefresh: { type: Object, attribute: false }
};
GscapeRenderSelector.styles = [
    baseStyle,
    i$1 `
      :host {
        order: 7;
        margin-top:10px;
      }
    `
];
customElements.define('gscape-render-selector', GscapeRenderSelector);

class GscapeLayoutSettings extends DropPanelMixin(BaseMixin(s)) {
    constructor() {
        super();
        this.layoutRun = false;
        this.dragAndPin = false;
        this.originalPositions = false;
        this.onLayoutRunToggle = () => { };
        this.onDragAndPinToggle = () => { };
        this.onUseOriginalPositions = () => { };
    }
    render() {
        return y `
      <gscape-button type="subtle" @click="${this.togglePanel}">
        <span slot="icon">${settings_play}</span>
      </gscape-button>

      <div id="drop-panel" class="hide gscape-panel gscape-panel-in-tray hanging">
        <div class="header">Layout Settings</div>
        <div class="toggles-wrapper">

          <gscape-toggle
            class="actionable"
            @click = ${this.layoutRunToggleHandler}
            key = "layout-run"
            label = "Layout run"
            ?checked = ${this.layoutRun}
          ></gscape-toggle>

          <gscape-toggle
            class="actionable"
            @click = ${this.dragAndPinToggleHandler}
            key = "drag-and-pin"
            label = "Drag and pin"
            ?checked = ${this.dragAndPin}
          ></gscape-toggle>

        </div>
      </div>
    `;
    }
    layoutRunToggleHandler(e) {
        e.preventDefault();
        this.onLayoutRunToggle();
    }
    dragAndPinToggleHandler(e) {
        e.preventDefault();
        this.onDragAndPinToggle();
    }
}
GscapeLayoutSettings.properties = {
    layoutRun: { type: Boolean, attribute: false },
    dragAndPin: { type: Boolean, attribute: false },
    originalPositions: { type: Boolean, attribute: false },
};
GscapeLayoutSettings.styles = [
    baseStyle,
    i$1 `
      :host {
        box-shadow: initial;
        position: initial;
      }

      gscape-toggle {
        padding: 8px;
      }

      .toggles-wrapper {
        display: flex;
        flex-direction: column;
      }
    `,
];
customElements.define('gscape-layout-settings', GscapeLayoutSettings);

/**
 *
 * @param {import('./layout-settings').default} layoutSettingsComponent
 * @param {import('../../../grapholscape').default} grapholscape
 */
function init$2 (layoutSettingsComponent, grapholscape) {
    if (grapholscape.renderState)
        updateToggles(grapholscape.renderState);
    layoutSettingsComponent.onLayoutRunToggle = () => {
        if (grapholscape.renderState !== RendererStatesEnum.FLOATY &&
            grapholscape.renderState !== RendererStatesEnum.INCREMENTAL)
            return;
        const renderer = grapholscape.renderer.renderState;
        // if (!grapholscape.renderer.layoutStopped) {
        //   layoutSettingsComponent.useOriginalPositionsToggle.state = false
        //   grapholscape.renderer.useOriginalPositions = false
        // }
        if (renderer.isLayoutInfinite) {
            renderer.stopLayout();
        }
        else {
            renderer.runLayoutInfinitely();
        }
        updateToggles(renderer.id);
    };
    layoutSettingsComponent.onDragAndPinToggle = () => {
        if (grapholscape.renderState !== RendererStatesEnum.FLOATY &&
            grapholscape.renderState !== RendererStatesEnum.INCREMENTAL)
            return;
        const renderer = grapholscape.renderer.renderState;
        renderer.dragAndPin = !renderer.dragAndPin;
        updateToggles(renderer.id);
    };
    grapholscape.on(LifecycleEvent.RendererChange, (rendererState) => {
        updateToggles(rendererState);
    });
    function updateToggles(renderState) {
        if (renderState === RendererStatesEnum.FLOATY ||
            grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
            const renderer = grapholscape.renderer.renderState;
            layoutSettingsComponent.layoutRun = renderer.isLayoutInfinite;
            layoutSettingsComponent.dragAndPin = renderer.dragAndPin;
        }
    }
    // layoutSettingsComponent.onUseOriginalPositions = () => {
    //   if (!grapholscape.renderer.useOriginalPositions) {
    //     layoutSettingsComponent.layoutRunToggle.state = false
    //     grapholscape.renderer.layoutStopped = true
    //   }
    //   grapholscape.renderer.useOriginalPositions = !grapholscape.renderer.useOriginalPositions
    // }
}

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
function initLayoutSettings(grapholscape) {
    const layoutSettingsComponent = new GscapeLayoutSettings();
    init$2(layoutSettingsComponent, grapholscape);
    return layoutSettingsComponent;
}

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
function initRendererSelector(grapholscape) {
    const rendererSelectorComponent = new GscapeRenderSelector();
    init$5(rendererSelectorComponent, grapholscape);
    rendererSelectorComponent.layoutSettingsComponent = initLayoutSettings(grapholscape);
    rendererSelectorComponent.requestUpdate();
    grapholscape.widgets.set(WidgetEnum.RENDERER_SELECTOR, rendererSelectorComponent);
    grapholscape.widgets.set(WidgetEnum.LAYOUT_SETTINGS, rendererSelectorComponent.layoutSettingsComponent);
}

class GscapeSettings extends DropPanelMixin(BaseMixin(s)) {
    constructor() {
        super();
        this.title = 'Settings';
        this.widgetStates = {};
        this.onEntityNameTypeChange = () => { };
        this.onLanguageChange = () => { };
        this.onThemeChange = () => { };
        this.onWidgetEnabled = () => { };
        this.onWidgetDisabled = () => { };
        this.onPngExport = () => { };
        this.onSvgExport = () => { };
        this.classList.add(BOTTOM_RIGHT_WIDGET.toString());
    }
    render() {
        return y `
      <gscape-button type="subtle" @click=${this.togglePanel}>
        <span slot="icon">${settings_icon}</span>
      </gscape-button>

      <div class="gscape-panel gscape-panel-in-tray hide" id="drop-panel">
        <div class="header">${this.title}</div>

        <div class="settings-wrapper">

        <div class="area">
            <div class="bold-text">Preferences</div>
            ${this.getListSettingEntryTemplate(Object.values(EntityNameType).map(ent => {
            return { value: ent, label: capitalizeFirstChar(ent) };
        }), this.selectedEntityNameType, 'Entities Name', 'Select the type of name to display on entities')}

            ${this.getListSettingEntryTemplate(this.languages.map(l => {
            return { value: l, label: l };
        }), this.selectedLanguage, 'Language', 'Select the preferred language')}
        </div>

        <div class="area">
            <div class="bold-text">Appearance</div>
            ${this.getListSettingEntryTemplate(this.themes.map(theme => {
            return { value: theme.id, label: theme.name };
        }), this.selectedTheme, 'Theme', 'Select a theme')}
        </div>

        <div class="area">
            <div class="bold-text" style="padding-bottom: 2px">Widgets</div>
            ${Object.entries(this.widgetStates).map(([widgetName, widgetState]) => {
            if (widgetState !== undefined && widgetState !== null) {
                return this.getToggleSettingEntryTemplate(widgetState, widgetName);
            }
        })}
        </div>

        <div class="area">
          <div class="bold-text">Export Ontology Image</div>
          <div class="setting">
            ${this.getSettingTitleTemplate('Image', 'Save a PNG image of the current diagram on your disk')}
            
            <div class="setting-obj">
              <gscape-button label="PNG" size="s" @click=${this.onPngExport}>
                <span slot="icon">${save}</span>
              </gscape-button>
            </div>
          </div>

          <div class="setting">
            ${this.getSettingTitleTemplate('Vectorial', 'Save an SVG of the current diagram on your disk')}
            <div class="setting-obj">
              <gscape-button label="SVG" size="s" @click=${this.onSvgExport}>
                <span slot="icon">${save}</span>
              </gscape-button>
            </div>
          </div>
        </div>

        <div class="area">
          <div class="bold-text">About</div>
          <div id="logo">
            ${grapholscapeLogo}
          </div>

          <div id="version" class="muted-text">
            <span>Version: </span>
            <span>${"3.2.0"}</span>
          </div>
        </div>
      </div>
    `;
    }
    getSettingTitleTemplate(title, label) {
        return y `
    <div class="title-wrap">
      <div class="setting-title">${title}</div>
      <div class="muted-text setting-label">${label}</div>
    </div>
    `;
    }
    getListSettingEntryTemplate(options, selectedOption, title, label) {
        if (options.length <= 0)
            return null;
        return y `
      <div class="setting">
        ${this.getSettingTitleTemplate(title, label)}
        <div class="setting-obj">
          <select id="${title}" @change=${this.listChangeHandler}>
            ${options.map(option => {
            let selected = option.value == selectedOption;
            return y `<option value="${option.value}" ?selected=${selected}>${option.label}</option>`;
        })}
          </select>
        </div>
      </div>
    `;
    }
    getToggleSettingEntryTemplate(actualState, title) {
        let labelPieces = title.split('-');
        const label = labelPieces.map(text => capitalizeFirstChar(text)).join(' ');
        return y `
      <div class="toggle-setting-obj">
        <gscape-toggle
          @click=${this.widgetToggleChangeHandler}
          label=${label}
          label-position="left"
          class="actionable"
          key = ${title}
          ?checked = ${actualState}
        ></gscape-toggle>
      </div>
    `;
    }
    listChangeHandler(e) {
        const selectId = e.target.id;
        const newValue = e.target.value;
        switch (selectId) {
            case 'Entities Name':
                if (newValue !== this.selectedEntityNameType) {
                    this.onEntityNameTypeChange(newValue);
                }
                break;
            case 'Language':
                if (newValue !== this.selectedLanguage) {
                    this.onLanguageChange(newValue);
                }
                break;
            case 'Theme':
                if (newValue !== this.selectedTheme) {
                    this.onThemeChange(newValue);
                }
                break;
        }
    }
    widgetToggleChangeHandler(e) {
        e.preventDefault();
        let toggle = e.target;
        toggle.checked ?
            this.onWidgetDisabled(toggle.key) :
            this.onWidgetEnabled(toggle.key);
    }
}
GscapeSettings.properties = {
    languages: { type: Object, attribute: false, },
    themes: { type: Object, attribute: false, },
    widgetStates: { type: Object, attribute: false, },
    selectedLanguage: { type: String, attribute: false, },
    selectedTheme: { type: String, attribute: false, },
};
GscapeSettings.styles = [
    baseStyle,
    GscapeButtonStyle,
    i$1 `
      :host {
        order: 5;
        display:inline-block;
        position: initial;
        margin-top:10px;
      }

      .gscape-panel {
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 0;
        padding-left: 0;
      }

      .settings-wrapper {
        overflow-y: auto;
        scrollbar-width: inherit;
        max-height: 320px;
        overflow-x: hidden;
        padding: 0 8px;
      }

      .area:last-of-type {
        margin-bottom: 0;
      }

      .setting {
        padding: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .setting-label {
        font-size: 10px;
      }

      .title-wrap {
        white-space: normal;
        width: 220px;
      }

      #logo {
        text-align:center;
      }

      #logo svg {
        width: 40%;
        height: auto;
        margin: 20px 0;
      }

      #version {
        text-align: center;
      }

      .toggle-setting-obj {
        width: 100%;
      }

      gscape-toggle {
        margin: 2px 0;
      }
    `,
];
customElements.define('gscape-settings', GscapeSettings);

function init$1 (settingsComponent, grapholscape) {
    settingsComponent.languages = grapholscape.ontology.languages.list;
    settingsComponent.selectedLanguage = grapholscape.language;
    settingsComponent.selectedEntityNameType = grapholscape.entityNameType;
    settingsComponent.themes = grapholscape.themeList;
    settingsComponent.selectedTheme = grapholscape.theme.id;
    for (let [widgetName, widget] of grapholscape.widgets) {
        settingsComponent.widgetStates[widgetName] = widget.enabled;
    }
    settingsComponent.requestUpdate();
    settingsComponent.onEntityNameTypeChange = (entityNameType) => {
        grapholscape.setEntityNameType(entityNameType);
    };
    settingsComponent.onLanguageChange = (language) => grapholscape.setLanguage(language);
    settingsComponent.onThemeChange = (themeKey) => {
        grapholscape.setTheme(themeKey);
    };
    settingsComponent.onPngExport = () => grapholscape.exportToPng();
    settingsComponent.onSvgExport = () => grapholscape.exportToSvg();
    // let gui_container = grapholscape.container.querySelector('#gscape-ui')
    settingsComponent.onWidgetEnabled = (widgetKey) => {
        const widget = grapholscape.widgets.get(widgetKey);
        widget.enable();
        storeConfigEntry(widgetKey, true);
        settingsComponent.widgetStates[widgetKey] = true;
        settingsComponent.requestUpdate();
    };
    settingsComponent.onWidgetDisabled = (widgetKey) => {
        const widget = grapholscape.widgets.get(widgetKey);
        widget.disable();
        storeConfigEntry(widgetKey, false);
        settingsComponent.widgetStates[widgetKey] = false;
        settingsComponent.requestUpdate();
    };
    grapholscape.on(LifecycleEvent.LanguageChange, language => settingsComponent.selectedLanguage = language);
    grapholscape.on(LifecycleEvent.EntityNameTypeChange, entityNameType => settingsComponent.selectedEntityNameType = entityNameType);
    grapholscape.on(LifecycleEvent.ThemeChange, newTheme => settingsComponent.selectedTheme = newTheme.id);
    // function updateOnChange(settingID, newValue) {
    //   let select = settingsComponent.shadowRoot.querySelector(`#${settingID}`)
    //   let option = Array.from(select.options)?.find( o => o.value === newValue)
    //   if (option) {
    //     option.selected = true
    //     let languageSelect = settingsComponent.shadowRoot.querySelector('#language')
    //     if (select.id == 'entity_name') 
    //       languageSelect.disabled = (select.value !== 'label')
    //   }
    // }
}

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
function initSettings(grapholscape) {
    const settingsComponent = new GscapeSettings();
    init$1(settingsComponent, grapholscape);
    grapholscape.widgets.set(WidgetEnum.SETTINGS, settingsComponent);
}

var bottomRightContainer = () => {
    let div = document.createElement('div');
    div.style.setProperty('position', 'absolute');
    div.style.setProperty('bottom', '0');
    div.style.setProperty('right', '0');
    div.style.setProperty('margin', '10px');
    div.style.setProperty('display', 'flex');
    div.style.setProperty('align-items', 'center');
    div.style.setProperty('flex-direction', 'column-reverse');
    return div;
};

class GscapeZoomTools extends s {
    constructor() {
        super();
        this.classList.add(BOTTOM_RIGHT_WIDGET.toString());
    }
    render() {
        return y `
      <gscape-button title="Zoom In" type="subtle" @click=${this._onZoomIn}><span slot="icon">${plus}</span></gscape-button>
      <div class="hr"></div>
      <gscape-button title="Zoom Out" type="subtle" @click=${this._onZoomOut}><span slot="icon">${minus}</span></gscape-button>
    `;
    }
    set onZoomIn(f) {
        this._onZoomIn = f;
    }
    set onZoomOut(f) {
        this._onZoomOut = f;
    }
}
GscapeZoomTools.styles = [
    baseStyle,
    i$1 `
      :host {
        order: 1;
        margin-top:10px;
        position: initial;
      }
    `
];
customElements.define('gscape-zoom-tools', GscapeZoomTools);

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
function initZoomTools(grapholscape) {
    const zoomToolsComponent = new GscapeZoomTools();
    zoomToolsComponent.onZoomIn = () => grapholscape.zoomIn(0.4);
    zoomToolsComponent.onZoomOut = () => grapholscape.zoomOut(0.4);
    grapholscape.widgets.set(WidgetEnum.ZOOM_TOOLS, zoomToolsComponent);
}

/**
 * Initialize the UI
 */
function init (grapholscape) {
    const guiContainer = document.createElement('div');
    guiContainer.classList.add('gscape-ui');
    guiContainer.style.height = '100%';
    guiContainer.style.width = '100%';
    guiContainer.style.position = 'absolute';
    guiContainer.style.top = '0';
    guiContainer.style.pointerEvents = 'none';
    grapholscape.container.appendChild(guiContainer);
    const buttonsTray = bottomRightContainer();
    buttonsTray.classList.add('gscape-ui-buttons-tray');
    guiContainer.appendChild(buttonsTray);
    initDiagramSelector(grapholscape);
    initFullscreenButton(grapholscape);
    initFitButton(grapholscape);
    initZoomTools(grapholscape);
    initFilters(grapholscape);
    initOntologyInfo(grapholscape);
    initEntityDetails(grapholscape);
    initOntologyExplorer(grapholscape);
    initOwlVisualizer(grapholscape);
    initSettings(grapholscape);
    // initEntitySelector(grapholscape)
    initRendererSelector(grapholscape);
    initInitialRendererSelector(grapholscape);
    const settingsComponent = grapholscape.widgets.get(WidgetEnum.SETTINGS);
    grapholscape.widgets.forEach((widget, key) => {
        switch (key) {
            default:
                buttonsTray.appendChild(widget);
                break;
            case WidgetEnum.FULLSCREEN_BUTTON:
            case WidgetEnum.DIAGRAM_SELECTOR:
            case WidgetEnum.ENTITY_DETAILS:
            case WidgetEnum.OWL_VISUALIZER:
            case WidgetEnum.ENTITY_SELECTOR:
            case WidgetEnum.INCREMENTAL_MENU:
                guiContainer.appendChild(widget);
                break;
            case WidgetEnum.LAYOUT_SETTINGS:
                break;
            case WidgetEnum.INITIAL_RENDERER_SELECTOR:
                grapholscape.container.appendChild(widget);
                break;
        }
        if (hasDropPanel(widget)) {
            widget.onTogglePanel = () => {
                const entityDetailsComponent = grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS);
                const entitySelectorComponent = grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR);
                const owlVisualizerComponent = grapholscape.widgets.get(WidgetEnum.OWL_VISUALIZER);
                if (entityDetailsComponent && entitySelectorComponent && owlVisualizerComponent) {
                    blurAll([widget, entityDetailsComponent, entitySelectorComponent, owlVisualizerComponent]);
                }
                else {
                    blurAll([widget]);
                }
            };
        }
        const _widget = widget;
        _widget.onStateChange = () => {
            if (settingsComponent) {
                settingsComponent.widgetStates[key] = _widget.enabled;
                settingsComponent.requestUpdate();
            }
        };
        if (grapholscape.widgetsInitialStates && grapholscape.widgetsInitialStates[key] === false) {
            _widget.disable();
        }
    });
    if (!grapholscape.container.style.getPropertyValue('--gscape-border-radius'))
        grapholscape.container.style.setProperty('--gscape-border-radius', '8px');
    if (!grapholscape.container.style.getPropertyValue('--gscape-border-radius-btn'))
        grapholscape.container.style.setProperty('--gscape-border-radius-btn', '6px');
    if (!grapholscape.container.style.getPropertyValue('--gscape-font-size'))
        grapholscape.container.style.setProperty('--gscape-font-size', '14px');
    grapholscape.container.style.color = `var(${CSS_PROPERTY_NAMESPACE}-fg-default)`;
    grapholscape.container.style.fontSize = `var(--gscape-font-size)`;
    grapholscape.on(LifecycleEvent.BackgroundClick, blurAll);
    function blurAll(widgetsToSkip = []) {
        grapholscape.widgets.forEach((widget, key) => {
            if ((key === WidgetEnum.ENTITY_DETAILS || key === WidgetEnum.OWL_VISUALIZER)
                && !widgetsToSkip.includes(widget)) {
                widget.hide();
            }
            else if (!widgetsToSkip.includes(widget) && key !== WidgetEnum.ENTITY_SELECTOR) {
                widget.blur();
            }
        });
    }
}

/** @module UI */

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    GscapeToggle: GscapeToggle,
    baseStyle: baseStyle,
    BOTTOM_RIGHT_WIDGET_CLASS: BOTTOM_RIGHT_WIDGET,
    get WidgetEnum () { return WidgetEnum; },
    emptySearchBlankState: emptySearchBlankState,
    entityListItemStyle: entityListItemStyle,
    GscapeEntitySelector: GscapeEntitySelector,
    GscapeIncrementalMenu: GscapeIncrementalDetails,
    icons: index$1,
    initUI: init,
    ContextMenu: GscapeContextMenu,
    GscapeButton: GscapeButton,
    GscapeButtonStyle: GscapeButtonStyle,
    get SizeEnum () { return SizeEnum; },
    get ToggleLabelPosition () { return ToggleLabelPosition; },
    GscapeActionListItem: GscapeActionListItem,
    GscapeActionListStyle: actionItemStyle,
    BaseMixin: BaseMixin,
    DropPanelMixin: DropPanelMixin,
    hasDropPanel: hasDropPanel,
    ModalMixin: ModalMixin,
    GscapeTextSearch: GscapeTextSearch,
    GscapeEntitySearch: GscapeEntitySearch,
    GscapeEntityTypeFilters: GscapeEntityTypeFilters,
    GscapeFullPageSelector: GscapeFullPageSelector,
    initInitialRendererSelector: initInitialRendererSelector,
    createEntitiesList: createEntitiesList,
    search: search,
    textSpinner: textSpinner,
    textSpinnerStyle: textSpinnerStyle,
    getContentSpinner: getContentSpinner,
    contentSpinnerStyle: contentSpinnerStyle
});

var downloadBlob = (blob, fileName) => {
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.style.setProperty('style', 'none');
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
};

cytoscape.use(cy_svg);
let options = {
    output: 'blob',
    full: true,
    bg: '',
};
function toPNG(fileName, cy, backgroundColor) {
    if (!checkParams(fileName, cy))
        return;
    options.bg = backgroundColor;
    if (cy)
        downloadBlob(cy.png(options), fileName);
}
function toSVG(fileName, cy, backgroundColor) {
    if (!checkParams(fileName, cy))
        return;
    options.bg = backgroundColor;
    let svg_content = cy.svg(options);
    let blob = new Blob([svg_content], { type: "image/svg+xml;charset=utf-8" });
    downloadBlob(blob, fileName);
}
function checkParams(fileName, cy) {
    if (!fileName || (typeof (fileName) !== 'string')) {
        console.error('Unable to export using an undefined file name');
        return false;
    }
    if (!cy) {
        console.error('Unable to export: cytoscape instance is undefined');
        return false;
    }
    return true;
}

/**
 * @internal
 */
class DisplayedNamesManager {
    constructor(grapholscape) {
        this._entityNameType = EntityNameType.LABEL;
        this._language = Language.EN;
        this._grapholscape = grapholscape;
    }
    get entityNameType() { return this._entityNameType; }
    get language() { return this._language; }
    setEntityNameType(newEntityNameType) {
        if (newEntityNameType === this._entityNameType)
            return;
        if (!Object.values(EntityNameType).includes(newEntityNameType)) {
            console.warn(`"${newEntityNameType}" is not a valid entity name type`);
            return;
        }
        this._entityNameType = newEntityNameType;
        for (let entity of this._grapholscape.ontology.entities.values()) {
            this.setDisplayedNames(entity);
        }
        this._grapholscape.lifecycle.trigger(LifecycleEvent.EntityNameTypeChange, newEntityNameType);
        storeConfigEntry('entityNameType', newEntityNameType);
    }
    setLanguage(language) {
        const languageValue = language;
        if (!this._grapholscape.ontology.languages.list.includes(language)) {
            console.warn(`Language ${language} is not supported by this ontology`);
            return;
        }
        if (languageValue === this._language) {
            return;
        }
        this._language = languageValue;
        if (this._entityNameType === EntityNameType.LABEL) {
            for (let entity of this._grapholscape.ontology.entities.values()) {
                this.setDisplayedNames(entity);
            }
        }
        this._grapholscape.lifecycle.trigger(LifecycleEvent.LanguageChange, languageValue);
        storeConfigEntry('language', language);
    }
    setDisplayedNames(entity) {
        entity.occurrences.forEach((entityOccurrencesInRenderState, renderState) => {
            entityOccurrencesInRenderState.forEach(entityOccurrence => {
                var _a, _b, _c;
                let grapholElement;
                if (renderState === RendererStatesEnum.INCREMENTAL) {
                    grapholElement = (_a = this._grapholscape.renderer.renderState.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.grapholElements.get(entityOccurrence.elementId);
                }
                else {
                    grapholElement = this._grapholscape.ontology.getGrapholElement(entityOccurrence.elementId, entityOccurrence.diagramId, renderState);
                }
                if (!grapholElement)
                    return;
                let newDisplayedName = entity.getDisplayedName(this.entityNameType, this.language, this._grapholscape.ontology.languages.default);
                if (newDisplayedName !== grapholElement.displayedName) {
                    grapholElement.displayedName = newDisplayedName;
                    const diagram = this._grapholscape.ontology.getDiagram(entityOccurrence.diagramId);
                    if (diagram) {
                        /**
                         * Entity Occurrences are not replicated, in entity.occurrences.get('lite') there will
                         * be only replicated/transformed entities. So the occurrences in graphol will be
                         * present also in other representations unless filtered.
                         * So for each occurrence in graphol, we search it in other representations and update them as well
                         */
                        if (renderState === RendererStatesEnum.GRAPHOL) {
                            diagram.representations.forEach(representation => {
                                if (grapholElement)
                                    representation.cy.$id(grapholElement.id).data('displayedName', grapholElement.displayedName);
                            });
                        }
                        else {
                            (_b = diagram.representations.get(renderState)) === null || _b === void 0 ? void 0 : _b.cy.$id(grapholElement.id).data('displayedName', grapholElement.displayedName);
                        }
                    }
                    else {
                        (_c = this._grapholscape.renderer.diagram) === null || _c === void 0 ? void 0 : _c.representations.forEach(representation => representation.updateElement(grapholElement.id));
                    }
                }
            });
        });
    }
}

/**
 * @internal
 */
class EntityNavigator {
    constructor(grapholscape) {
        this._grapholscape = grapholscape;
    }
    centerOnEntity(iri, diagramId, zoom) {
        this._centerSelectEntity(iri, diagramId, false, zoom);
    }
    selectEntity(iri, diagramId, zoom) {
        this._centerSelectEntity(iri, diagramId, true, zoom);
    }
    _centerSelectEntity(iri, diagramId, select = false, zoom) {
        if (diagramId || diagramId === 0) {
            const entityOccurrence = this.getEntityOccurrenceInDiagram(iri, diagramId);
            if (entityOccurrence) {
                this._performCenterSelect(entityOccurrence, select, zoom);
            }
        }
        else {
            for (let diagram of this._grapholscape.ontology.diagrams) {
                const entityOccurrence = this.getEntityOccurrenceInDiagram(iri, diagram.id);
                if (entityOccurrence) {
                    this._performCenterSelect(entityOccurrence, select, zoom);
                    break;
                }
            }
        }
    }
    _performCenterSelect(occurrence, select, zoom) {
        if (this._grapholscape.diagramId !== occurrence.diagramId) {
            this._grapholscape.showDiagram(occurrence.diagramId);
        }
        this._grapholscape.renderer.centerOnElementById(occurrence.elementId, zoom, select);
        if (select) {
            const grapholElement = this._grapholscape.ontology.getGrapholElement(occurrence.elementId, occurrence.diagramId, this._grapholscape.renderState);
            if (!grapholElement)
                return;
            if (isGrapholNode(grapholElement)) {
                this._grapholscape.lifecycle.trigger(LifecycleEvent.NodeSelection, grapholElement);
            }
            else if (isGrapholEdge(grapholElement)) {
                this._grapholscape.lifecycle.trigger(LifecycleEvent.EdgeSelection, grapholElement);
            }
        }
    }
    getEntityOccurrenceInDiagram(iri, diagramId) {
        const occurrencesMap = this._grapholscape.ontology.getEntityOccurrences(iri, diagramId);
        if (!occurrencesMap)
            return;
        const grapholOccurrences = occurrencesMap.get(RendererStatesEnum.GRAPHOL);
        // if no graphol occurrence, then cannot appear in any representation
        if (!grapholOccurrences || grapholOccurrences.length <= 0)
            return;
        const diagram = this._grapholscape.ontology.getDiagram(diagramId);
        if (!diagram || !this._grapholscape.renderState)
            return;
        const actualDiagramRepresentation = diagram.representations.get(this._grapholscape.renderState);
        // Search any original graphol occurrence in the actual representation
        for (let grapholOccurrence of grapholOccurrences) {
            if (actualDiagramRepresentation === null || actualDiagramRepresentation === void 0 ? void 0 : actualDiagramRepresentation.grapholElements.has(grapholOccurrence.elementId)) {
                return grapholOccurrence;
            }
        }
        // The original graphol occurrence may not be present in a new representation
        // Find first replicated occurrence
        const replicatedOccurrences = occurrencesMap.get(this._grapholscape.renderState);
        if (replicatedOccurrences && replicatedOccurrences.length > 0) {
            return replicatedOccurrences[0];
        }
    }
    updateEntitiesOccurrences() {
        if (this._grapholscape.renderState && this._grapholscape.renderState === RendererStatesEnum.GRAPHOL)
            return;
        this._grapholscape.ontology.diagrams.forEach(diagram => {
            var _a, _b;
            if (!this._grapholscape.renderState)
                return;
            // const diagram = this._grapholscape.renderer.diagram
            const replicatedElements = (_b = (_a = diagram.representations.get(this._grapholscape.renderState)) === null || _a === void 0 ? void 0 : _a.cy) === null || _b === void 0 ? void 0 : _b.$("[originalId]");
            if (replicatedElements && !replicatedElements.empty()) {
                replicatedElements.forEach(replicatedElement => {
                    const grapholEntity = this._grapholscape.ontology.getEntity(replicatedElement.data('iri'));
                    if (grapholEntity) {
                        //grapholEntity.getOccurrencesByDiagramId(diagram.id, this._grapholscape.renderState)
                        // replicatedElement.data('iri', grapholEntity.iri.fullIri)
                        grapholEntity.addOccurrence(replicatedElement.id(), diagram.id, this._grapholscape.renderState);
                    }
                });
            }
        });
    }
}

class Renderer {
    constructor(renderState) {
        this.filters = new Map(Object.values(getDefaultFilters()).map(filter => [filter.key, filter]));
        this.FOCUS_ZOOM_LEVEL = 1.5;
        this.renderStateData = {};
        /**
         * Filter elements on the diagram.
         * It will be actually applied only if the user defined callback on the event
         * {@link !model.LifecycleEvent.FilterRequest} returns true and if the internal logic
         * allows for the filter to be applied.
         * @param filter Can be an object of type {@link !model.Filter}, {@link !model.DefaultFilterKeyEnum}
         * or a string representing the unique key of a defined filter
         */
        this.filter = (filter) => {
            var _a;
            let _filter = this.getFilter(filter);
            if (!_filter)
                return;
            if (this._lifecycle.trigger(LifecycleEvent.FilterRequest, _filter) && ((_a = this._renderState) === null || _a === void 0 ? void 0 : _a.filterManager.filterActivation(_filter))) {
                this.performFilter(_filter);
                this._lifecycle.trigger(LifecycleEvent.Filter, _filter);
            }
        };
        /**
         * Unfilter elements on the diagram.
         * It will be actually deactivated only if the user defined callback on the event
         * {@link !model.LifecycleEvent.FilterRequest} returns true and if the internal logic
         * allows for the filter to be deactivated.
         * @param filter Can be an object of type {@link !model.Filter}, {@link !model.DefaultFilterKeyEnum}
         * or a string representing the unique key of a defined filter
         */
        this.unfilter = (filter) => {
            var _a;
            const _filter = this.getFilter(filter);
            if (!_filter)
                return;
            if (this._lifecycle.trigger(LifecycleEvent.UnfilterRequest, _filter) && ((_a = this._renderState) === null || _a === void 0 ? void 0 : _a.filterManager.filterDeactivation(_filter))) {
                this.performFilter(_filter, false);
                this.applyActiveFilters();
                this._lifecycle.trigger(LifecycleEvent.Unfilter, _filter);
            }
        };
        if (renderState)
            this.renderState = renderState;
    }
    set lifecycle(lc) {
        this._lifecycle = lc;
    }
    set renderState(rs) {
        if (this.diagram) {
            /**
             * Stop rendering actual diagram before
             * changing renderer state
             */
            this.stopRendering();
        }
        this._renderState = rs;
        if (rs) {
            rs.renderer = this;
            if (this.diagram) {
                rs.render();
                this.performAllFilters();
            }
        }
    }
    get renderState() { return this._renderState; }
    get theme() { return this._theme; }
    render(diagram) {
        var _a;
        if (!this.diagram || this.diagram.id !== diagram.id) {
            this.stopRendering();
            this.diagram = diagram;
            (_a = this._renderState) === null || _a === void 0 ? void 0 : _a.render();
            this.performAllFilters();
            this._lifecycle.trigger(LifecycleEvent.DiagramChange, diagram);
        }
    }
    mount() {
        var _a;
        this.applyTheme();
        (_a = this.cy) === null || _a === void 0 ? void 0 : _a.mount(this.container);
    }
    addElement(element) {
        var _a;
        (_a = this.cy) === null || _a === void 0 ? void 0 : _a.add(element);
    }
    performFilter(filter, activate = true) {
        if (this.grapholElements && this._renderState) {
            for (let grapholElement of this.grapholElements.values()) {
                if (filter.shouldFilter(grapholElement)) {
                    if (activate)
                        this._renderState.filter(grapholElement.id, filter);
                    else
                        this._renderState.unfilter(grapholElement.id, filter);
                }
            }
            filter.active = activate;
        }
    }
    getFilter(filter) {
        let _filter;
        if (typeof filter === 'string') {
            _filter = this.filters.get(filter);
        }
        else {
            _filter = filter;
        }
        if (!_filter || !this.filters.has(_filter.key)) {
            console.warn(`Can't find any filter "${filter}"`);
            return;
        }
        return _filter;
    }
    applyActiveFilters() {
        this.filters.forEach(filter => {
            if (filter.active) {
                this.performFilter(filter);
            }
        });
    }
    performAllFilters() {
        // first unfiler
        this.filters.forEach(filter => {
            if (!filter.active)
                this.performFilter(filter, filter.active);
        });
        this.filters.forEach(filter => {
            if (filter.active)
                this.performFilter(filter, filter.active);
        });
    }
    stopRendering() {
        var _a, _b;
        this.unselect();
        (_a = this._renderState) === null || _a === void 0 ? void 0 : _a.stopRendering();
        (_b = this.cy) === null || _b === void 0 ? void 0 : _b.unmount();
    }
    /**
     * Select a node or an edge in the actual diagram given its unique id
     * @param {string} elementId elem id (node or edge)
     */
    selectElement(elementId) {
        var _a;
        this.unselect();
        (_a = this.cy) === null || _a === void 0 ? void 0 : _a.$id(elementId).select();
    }
    /**
     * Unselect every selected element in this diagram
     */
    unselect() {
        var _a;
        (_a = this.cy) === null || _a === void 0 ? void 0 : _a.elements(':selected').unselect();
    }
    /**
     * Fit viewport to diagram
     */
    fit() {
        var _a;
        (_a = this.cy) === null || _a === void 0 ? void 0 : _a.fit();
    }
    /**
     * Put a set of elements (nodes and/or edges) at the center of the viewport.
     * If just one element then the element will be at the center.
     * @param elementId the element's ID
     * @param zoom the zoom level to apply, if not passed, zoom level won't be changed
     */
    centerOnElementById(elementId, zoom, select) {
        var _a, _b;
        if (zoom === void 0) { zoom = (_a = this.cy) === null || _a === void 0 ? void 0 : _a.zoom(); }
        if (!this.cy || (!zoom && zoom !== 0))
            return;
        const cyElement = this.cy.$id(elementId);
        zoom = zoom > this.cy.maxZoom() ? this.cy.maxZoom() : zoom;
        if (cyElement.empty()) {
            console.warn(`Element id (${elementId}) not found. Please check that this is the correct diagram`);
        }
        else {
            (_b = this.cy) === null || _b === void 0 ? void 0 : _b.animate({
                center: {
                    eles: cyElement
                },
                zoom: zoom,
                queue: false,
            });
            if (select && this.cy.$(':selected') !== cyElement) {
                this.unselect();
                cyElement.select();
            }
        }
    }
    centerOnElement(element, zoom, select) {
        this.centerOnElementById(element.id, zoom, select);
    }
    centerOnModelPosition(xPos, yPos, zoom) {
        if (!this.cy)
            return;
        let offsetX = this.cy.width() / 2;
        let offsetY = this.cy.height() / 2;
        xPos -= offsetX;
        yPos -= offsetY;
        this.cy.pan({
            x: -xPos,
            y: -yPos
        });
        this.cy.zoom({
            level: zoom || this.cy.zoom(),
            renderedPosition: { x: offsetX, y: offsetY }
        });
    }
    centerOnRenderedPosition(xPos, yPos, zoom) {
        var _a;
        (_a = this.cy) === null || _a === void 0 ? void 0 : _a.viewport({
            zoom: zoom || this.cy.zoom(),
            pan: { x: xPos, y: yPos }
        });
    }
    zoom(zoomValue) {
        var _a, _b;
        if (zoomValue != ((_a = this.cy) === null || _a === void 0 ? void 0 : _a.zoom()))
            (_b = this.cy) === null || _b === void 0 ? void 0 : _b.animate({
                zoom: zoomValue,
                queue: false
            });
    }
    zoomIn(zoomValue) {
        var _a;
        (_a = this.cy) === null || _a === void 0 ? void 0 : _a.animate({
            zoom: {
                level: this.cy.zoom() + zoomValue * this.cy.zoom(),
                renderedPosition: { x: this.cy.width() / 2, y: this.cy.height() / 2 }
            },
            queue: false,
        });
    }
    zoomOut(zoomValue) {
        var _a;
        (_a = this.cy) === null || _a === void 0 ? void 0 : _a.animate({
            zoom: {
                level: this.cy.zoom() - zoomValue * this.cy.zoom(),
                renderedPosition: { x: this.cy.width() / 2, y: this.cy.height() / 2 }
            },
            queue: false,
        });
    }
    setTheme(theme) {
        if (theme !== this._theme) {
            this._theme = theme;
            if (this.cy) {
                this.applyTheme();
            }
        }
    }
    applyTheme() {
        var _a;
        if (this._theme && this.renderState) {
            (_a = this.cy) === null || _a === void 0 ? void 0 : _a.style(this.renderState.getGraphStyle(this._theme));
            if (this.theme.colours["bg-graph"])
                this.container.style.backgroundColor = this.theme.colours["bg-graph"];
        }
    }
    // updateAll() {
    //   for (let grapholElement of this.grapholElements.values()) {
    //     this.updateElement(grapholElement.id)
    //   }
    // }
    updateElement(grapholElement) {
        if (!this.cy)
            return;
        const cyElement = this.cy.$id(grapholElement.id);
        if (isGrapholNode(grapholElement) && grapholElement.position !== cyElement.position()) {
            cyElement.position(grapholElement.position);
        }
        if (isGrapholEdge(grapholElement)) {
            cyElement.move({
                source: grapholElement.sourceId,
                target: grapholElement.targetId
            });
        }
        cyElement.data(grapholElement.getCytoscapeRepr()[0].data);
    }
    get isThemeApplied() {
        var _a;
        return (_a = this.cy) === null || _a === void 0 ? void 0 : _a.style();
    }
    get grapholElements() {
        var _a, _b;
        if (this.renderState)
            return (_b = (_a = this.diagram) === null || _a === void 0 ? void 0 : _a.representations.get(this.renderState.id)) === null || _b === void 0 ? void 0 : _b.grapholElements;
    }
    get selectedElement() {
        var _a, _b;
        if (this.cy)
            return (_a = this.grapholElements) === null || _a === void 0 ? void 0 : _a.get((_b = this.cy.$(':selected')[0]) === null || _b === void 0 ? void 0 : _b.id());
    }
    get viewportState() {
        if (this.cy)
            return {
                zoom: this.cy.zoom(),
                pan: this.cy.pan(),
            };
    }
    set container(container) {
        this._container = document.createElement('div');
        this._container.classList.add('grapholscape-graph');
        this._container.style.width = '100%';
        this._container.style.height = '100%';
        this._container.style.position = 'relative';
        container.appendChild(this.container);
    }
    get container() { return this._container; }
    /**
     * Getter
     */
    get nodes() {
        var _a;
        return (_a = this.cy) === null || _a === void 0 ? void 0 : _a.nodes().jsons();
    }
    /**
     * Getter
     */
    get edges() {
        var _a;
        return (_a = this.cy) === null || _a === void 0 ? void 0 : _a.edges().jsons();
    }
}

/**
 * @internal
 */
class ThemeManager {
    constructor(grapholscape) {
        this.themes = Object.values(DefaultThemes);
        this._grapholscape = grapholscape;
    }
    setTheme(newThemeId) {
        const newTheme = this.themes.find(t => t.id === newThemeId);
        if (newTheme) {
            this.setMissingColours(newTheme);
            this.theme = newTheme;
            Object.entries(newTheme.colours).forEach(([colourName, colour]) => {
                this._grapholscape.container.style.setProperty(`${CSS_PROPERTY_NAMESPACE}-${colourName}`, colour);
            });
            this._grapholscape.renderer.setTheme(newTheme);
            this._grapholscape.lifecycle.trigger(LifecycleEvent.ThemeChange, newTheme);
            storeConfigEntry('selectedTheme', newThemeId);
        }
    }
    addTheme(newTheme) {
        this.themes.push(newTheme);
    }
    removeThemes() {
        this.themes = [];
    }
    setMissingColours(theme) {
        // Set default theme colours for missing colours
        Object.entries(gscapeColourMap).forEach(([colourName, colourValue]) => {
            const _colourName = colourName;
            if (!theme.getColour(_colourName))
                theme.setColour(_colourName, colourValue);
        });
    }
}

class Grapholscape {
    constructor(ontology, container, config) {
        this.renderer = new Renderer();
        this.availableRenderers = [
            RendererStatesEnum.GRAPHOL,
            RendererStatesEnum.GRAPHOL_LITE,
            RendererStatesEnum.FLOATY,
            RendererStatesEnum.INCREMENTAL
        ];
        this.lifecycle = new Lifecycle();
        this.entityNavigator = new EntityNavigator(this);
        this.displayedNamesManager = new DisplayedNamesManager(this);
        this.themesManager = new ThemeManager(this);
        this.widgets = new Map();
        // ----------------------------- LIFECYCLE ----------------------------- //
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
        this.on = this.lifecycle.on;
        this.ontology = ontology;
        this.container = container;
        this.renderer.container = container;
        this.renderer.lifecycle = this.lifecycle;
        //this.renderer.renderState = new GrapholRendererState()
        if (!(config === null || config === void 0 ? void 0 : config.selectedTheme)) {
            this.themesManager.setTheme(DefaultThemesEnum.GRAPHOLSCAPE);
        }
        if (config) {
            this.setConfig(config);
        }
    }
    // ----------------------------- RENDERER ----------------------------- //
    /**
     * Show a certain diagram by its ID
     * @param diagramId the diagram's id to display
     * @param viewportState set a custom {@link !model.ViewportState}, if not set, last one available will be used
     */
    showDiagram(diagramId, viewportState) {
        var _a, _b;
        const diagram = this.ontology.getDiagram(diagramId);
        if (!diagram) {
            console.warn(`Can't find any diagram with id="${diagramId}"`);
            return;
        }
        if (this.renderState && !((_b = (_a = diagram.representations) === null || _a === void 0 ? void 0 : _a.get(this.renderState)) === null || _b === void 0 ? void 0 : _b.hasEverBeenRendered))
            setGraphEventHandlers(diagram, this.lifecycle, this.ontology);
        if (viewportState)
            diagram.lastViewportState = viewportState;
        this.renderer.render(diagram);
    }
    /**
     * Change the actual renderer (Graphol - Lite - Floaty).
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
    setRenderer(newRenderState) {
        var _a, _b, _c;
        const shouldUpdateEntities = (this.diagramId !== 0 && !this.diagramId) || !((_a = this.ontology.getDiagram(this.diagramId)) === null || _a === void 0 ? void 0 : _a.representations.get(newRenderState.id)) ? true : false;
        if (!this.ontology.diagrams[0].representations.get(newRenderState.id)) {
            newRenderState.transformOntology(this.ontology);
        }
        if (this.renderer.diagram && !((_c = (_b = this.renderer.diagram) === null || _b === void 0 ? void 0 : _b.representations.get(newRenderState.id)) === null || _c === void 0 ? void 0 : _c.hasEverBeenRendered))
            setGraphEventHandlers(this.renderer.diagram, this.lifecycle, this.ontology);
        this.renderer.renderState = newRenderState;
        if (shouldUpdateEntities)
            this.entityNavigator.updateEntitiesOccurrences();
        this.lifecycle.trigger(LifecycleEvent.RendererChange, newRenderState.id);
    }
    /**
     * Center the viewport on a single element.
     * @remarks
     * If you specify a different diagram from the actual one, it will be displayed
     * @param elementId the element's id (can be a node or an edge)
     * @param diagramId the diagram's id (**default**: the actual one)
     * @param zoom the level zoom to apply, do not pass it if you don't want zoom to change
     */
    centerOnElement(elementId, diagramId, zoom) {
        if ((diagramId || diagramId === 0) && this.diagramId !== diagramId)
            this.showDiagram(diagramId);
        this.renderer.centerOnElementById(elementId, zoom);
    }
    /**
     * Select an element in a diagram.
     * @remarks
     * If you specify a different diagram from the actual one, it will be displayed
     * @param elementId the element's id (can be a node or an edge)
     * @param diagramId the diagram's id (**default**: the actual one)
     */
    selectElement(elementId, diagramId) {
        if ((diagramId || diagramId === 0) && this.diagramId !== diagramId)
            this.showDiagram(diagramId);
        this.renderer.selectElement(elementId);
    }
    /** Unselect any selected element in the actual diagram */
    unselect() { this.renderer.unselect(); }
    /** Fit viewport to diagram */
    fit() { this.renderer.fit(); }
    /**
     * Apply a certain level of zoom
     * @param value level of zoom to set
     */
    zoom(value) { this.renderer.zoom(value); }
    /**
     * Increase the zooom level by a certain amount
     * @param amount the amount of zoom to add
     */
    zoomIn(amount) { this.renderer.zoomIn(amount); }
    /**
     * Decrease the zooom level by a certain amount
     * @param amount the amount of zoom to remove
     */
    zoomOut(amount) { this.renderer.zoomOut(amount); }
    /**
     * Filter elements on the diagram.
     * @remarks
     * It will be actually applied only if the user defined callback on the event
     * {@link !model.LifecycleEvent.FilterRequest} returns true and if the internal logic
     * allows for the filter to be applied.
     * @param filter the filter to apply, can be an object of type {@link !model.Filter}, {@link !model.DefaultFilterKeyEnum}
     * or a string representing the unique key of a defined filter
     */
    filter(filter) { this.renderer.filter(filter); }
    /**
     * Unfilter elements on the diagram.
     * @remarks
     * It will be actually deactivated only if the user defined callback on the event
     * {@link !model.LifecycleEvent.FilterRequest} returns true and if the internal logic
     * allows for the filter to be deactivated.
     * @param filter the filter to disable, can be an object of type {@link !model.Filter}, {@link !model.DefaultFilterKeyEnum}
     * or a string representing the unique key of a defined filter
     */
    unfilter(filter) { this.renderer.unfilter(filter); }
    /** The actual diagram's id */
    get diagramId() {
        var _a;
        return (_a = this.renderer.diagram) === null || _a === void 0 ? void 0 : _a.id;
    }
    /** The actual renderer state */
    get renderState() {
        var _a;
        return (_a = this.renderer.renderState) === null || _a === void 0 ? void 0 : _a.id;
    }
    /** The actual selected Entity */
    get selectedEntity() {
        var _a;
        const selectedElement = this.renderer.selectedElement;
        if (selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.isEntity())
            return this.ontology.getEntity((_a = this.renderer.cy) === null || _a === void 0 ? void 0 : _a.$id(selectedElement.id).data().iri);
    }
    /** An array of available renderer's state for this Grapholscape instance */
    get renderers() { return this.availableRenderers; }
    // ------------------------- ENTITY NAVIGATOR ------------------------- //
    /**
     * Center viewport on a single entity given its IRI
     * @param iri the iri of the entity to find and center on
     * @param diagramId the diagram containing.
     * If not specified, the first entity occurrence in any diagram will be used.
     * @param zoom the level of zoom to apply.
     * If not specified, zoom level won't be changed.
     */
    centerOnEntity(iri, diagramId, zoom) {
        this.entityNavigator.centerOnEntity(iri, diagramId, zoom);
    }
    /**
     * Center viewport on a single entity and selects it given its IRI
     * @param iri the iri of the entity to find and center on
     * @param diagramId the diagram containing.
     * If not specified, the first entity occurrence in any diagram will be used.
     * @param zoom the level of zoom to apply.
     * If not specified, zoom level won't be changed.
     */
    selectEntity(iri, diagramId, zoom) {
        this.entityNavigator.selectEntity(iri, diagramId, zoom);
    }
    // ---------------------- DISPLAYED NAMES MANAGER ---------------------- //
    /**
     * Change the displayed entity's names.
     * @param newEntityNametype the entity name type to set
     */
    setEntityNameType(newEntityNametype) {
        this.displayedNamesManager.setEntityNameType(newEntityNametype);
    }
    /**
     * Change the language used for the labels and comments
     * @remarks The language must be supported by the ontology or the first available
     * language for a given label/comment wil be used as fallback
     * @param newLanguage the language to set {@link !config.Language}
     */
    setLanguage(newLanguage) {
        this.displayedNamesManager.setLanguage(newLanguage);
    }
    /** The actual selected language */
    get language() { return this.displayedNamesManager.language; }
    /** The actual selected entity name type (label, full iri or prefixed iri) */
    get entityNameType() { return this.displayedNamesManager.entityNameType; }
    // -------------------------- THEMES MANAGER -------------------------- //
    /**
     * Apply a given theme
     * @param themeId the theme's ID
     */
    setTheme(themeId) {
        this.themesManager.setTheme(themeId);
    }
    /**
     * @ignore
     * // TODO: make this method update settings widget before publishing in docs
     * Add a new theme in the list of available themes
     * @param newTheme the new theme
     */
    addTheme(newTheme) {
        this.themesManager.addTheme(newTheme);
    }
    /** The actual theme used by Grapholscape */
    get theme() { return this.themesManager.theme; }
    /** The available themes for this Grapholscape instance */
    get themeList() { return this.themesManager.themes; }
    // -------------------------------- UI -------------------------------- //
    /**
     * The container in which Grapholscape places the UI components.
     * You can use this container to add new widgets or dialogs if you want to.
     */
    get uiContainer() { return this.container.querySelector('.gscape-ui'); }
    /**
     * The container in which the bottom-right buttons are placed.
     * You can use this container to add your own Buttons if you want to.
     */
    get buttonsTray() { var _a; return (_a = this.uiContainer) === null || _a === void 0 ? void 0 : _a.querySelector('.gscape-ui-buttons-tray'); }
    // ------------------------------ CONFIG ------------------------------ //
    /**
     * @ignore
     * // TODO: Be sure this method reflects on UI before publishing it in to the docs
     * Apply a new custom configuration
     * @param newConfig the config object to apply
     */
    setConfig(newConfig) {
        if (newConfig.language) {
            this.displayedNamesManager.setLanguage(newConfig.language);
        }
        if (newConfig.entityNameType) {
            this.displayedNamesManager.setEntityNameType(newConfig.entityNameType);
        }
        if (newConfig.renderers) {
            this.availableRenderers = newConfig.renderers;
        }
        let rendererStateToSet = undefined;
        /**
         * If only one renderer defined, just use it
         */
        if (this.availableRenderers.length <= 1) {
            rendererStateToSet = this.availableRenderers[0];
        }
        /**
         * If selected renderer is included in the list of renderers, use it.
         * The other ones will be managed by renderer-selector widget
         * or manually by the app importing grapholscape.
         */
        else if (newConfig.selectedRenderer && this.availableRenderers.includes(newConfig.selectedRenderer)) {
            rendererStateToSet = newConfig.selectedRenderer;
        }
        if (rendererStateToSet) {
            switch (rendererStateToSet) {
                case RendererStatesEnum.GRAPHOL: {
                    this.setRenderer(new GrapholRendererState());
                    break;
                }
                case RendererStatesEnum.GRAPHOL_LITE: {
                    this.setRenderer(new LiteRendererState());
                    break;
                }
                case RendererStatesEnum.FLOATY: {
                    this.setRenderer(new FloatyRendererState());
                    break;
                }
                case RendererStatesEnum.INCREMENTAL: {
                    this.setRenderer(new IncrementalRendererState());
                    break;
                }
            }
        }
        if (newConfig.themes) {
            this.themesManager.removeThemes();
            newConfig.themes.forEach(newTheme => {
                const _castedNewTheme = newTheme;
                // It's a default theme id
                if (DefaultThemes[newTheme]) {
                    this.themesManager.addTheme(DefaultThemes[newTheme]);
                }
                // It's a custom theme
                else if (_castedNewTheme.id) {
                    this.themesManager.addTheme(new GrapholscapeTheme(_castedNewTheme.id, _castedNewTheme.colours, _castedNewTheme.name));
                }
            });
        }
        if (newConfig.selectedTheme && this.themeList.map(theme => theme.id).includes(newConfig.selectedTheme)) {
            this.themesManager.setTheme(newConfig.selectedTheme);
        }
        else if (!this.themeList.includes(this.theme)) {
            this.themesManager.setTheme(this.themeList[0].id);
        }
        if (newConfig.widgets) {
            this.widgetsInitialStates = newConfig.widgets;
        }
    }
    // ---------------------------- EXPORTING ---------------------------- //
    /**
     * Export actual diagram and download it as a PNG image.
     * @param fileName custom file name. Defaults to {@link exportFileName}
     */
    exportToPng(fileName = this.exportFileName) {
        fileName += '.png';
        toPNG(fileName, this.renderer.cy, this.theme.getColour(ColoursNames.bg_graph));
    }
    /**
     * Export actual diagram and download it as an SVG.
     * @param fileName custom file name. Defaults to {@link exportFileName}
     */
    exportToSvg(fileName = this.exportFileName) {
        fileName += '.svg';
        toSVG(fileName, this.renderer.cy, this.theme.getColour(ColoursNames.bg_graph));
    }
    /**
     * Filename for exports.
     * String in the form: "[ontology name]-[diagram name]-v[ontology version]"
     */
    get exportFileName() {
        var _a;
        return `${this.ontology.name}-${(_a = this.renderer.diagram) === null || _a === void 0 ? void 0 : _a.name}-v${this.ontology.version}`;
    }
    /**
     * Use this to pass options to build rest calls for querying
     * the virtual knowledge graph when embedded in monolith
     * @internal
     * @param options
     */
    setMastroRequestOptions(options) {
        this.mastroRequestOptions = options;
    }
}

cytoscape.use(popper);
cytoscape.use(cola);
cytoscape.warnings("production" !== 'production');
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
function fullGrapholscape(file, container, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const grapholscape = yield getGrapholscape(file, container, config);
        if (grapholscape) {
            init(grapholscape);
            if ((config === null || config === void 0 ? void 0 : config.initialRendererSelection) === false || grapholscape.renderState) {
                grapholscape.widgets.get(WidgetEnum.INITIAL_RENDERER_SELECTOR).hide();
            }
        }
        return grapholscape;
    });
}
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
function bareGrapholscape(file, container, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const grapholscape = yield getGrapholscape(file, container, config);
        if (grapholscape) {
            if (grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
                const incrementalController = new IncrementalController(grapholscape);
                startIncremental(grapholscape, incrementalController);
            }
        }
        return grapholscape;
    });
}
function getGrapholscape(file, container, config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file || !container) {
            console.error('Please specify an ontology and a container for Grapholscape');
            return undefined;
        }
        const savedConfig = loadConfig();
        // copy savedConfig over config
        config = Object.assign(config || {}, savedConfig);
        return new Promise((resolve, reject) => {
            let ontology;
            if (typeof (file) === 'object') {
                let reader = new FileReader();
                reader.onloadend = () => {
                    try {
                        ontology = getResult(reader.result);
                        init();
                    }
                    catch (error) {
                        reject(error);
                    }
                };
                reader.readAsText(file);
                setTimeout(() => {
                    reject('Error: timeout expired');
                }, 10000);
            }
            else if (typeof (file) === 'string') {
                ontology = getResult(file);
                init();
            }
            else {
                reject('Err: Grapholscape needs a Graphol File or the corresponding string to be initialized');
            }
            function init() {
                try {
                    const gscape = new Grapholscape(ontology, container, config);
                    resolve(gscape);
                }
                catch (e) {
                    console.error(e);
                }
            }
        });
        function getResult(file) {
            return new GrapholParser(file).parseGraphol();
        }
    });
}

export { AnnotatedElement, Annotation, AnnotationsKind, BaseFilterManager, BaseRenderer, Breakpoint, CSS_PROPERTY_NAMESPACE, ColoursNames, ConstructorLabelsEnum, DefaultFilterKeyEnum, DefaultThemes, DefaultThemesEnum, Diagram, DiagramRepresentation, EntityNameType, Filter, FloatyRendererState, FunctionalityEnum, GrapholEdge, GrapholElement, GrapholEntity, GrapholNode, GrapholNodesEnum, GrapholRendererState, GrapholTypesEnum, Grapholscape, GrapholscapeTheme, Hierarchy, IncrementalController, IncrementalDiagram, IncrementalRendererState, Iri, Language, Lifecycle, LifecycleEvent, LiteRendererState, Namespace, Ontology, POLYGON_POINTS, Renderer, RendererStatesEnum, Shape, bareGrapholscape, classicColourMap, clearLocalStorage, darkColourMap, floatyOptions, fullGrapholscape, getDefaultFilters, cytoscapeDefaultConfig as grapholOptions, gscapeColourMap, isGrapholEdge, isGrapholNode, liteOptions, loadConfig, setGraphEventHandlers, startIncremental, storeConfigEntry, toPNG, toSVG, index as ui };
