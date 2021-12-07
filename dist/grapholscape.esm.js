/**
 * MIT License
 *
 * Copyright (c) 2018-2020 OBDA Systems
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
import cy_svg from 'cytoscape-svg';

const NAMESPACE = 'obda-systems.grapholscape';
const namespacedKey = (key) => `${NAMESPACE}-${key}`;
const valueToStore = (v) => JSON.stringify(v);
const valueFromStorage = (v) => JSON.parse(v);

/**
 * Load config from local storage
 */
function loadConfig() {
  const config = {};
  const key = (key) => key.substring(NAMESPACE.length + 1);
  if (storageAvailable() && isAnySettingSaved()) {
    Object.keys(window.localStorage)
      .filter(k => k.startsWith(NAMESPACE)) // take only local storage items written by grapholscape
      .forEach(k => config[key(k)] = valueFromStorage(window.localStorage.getItem(k)));
  }

  return config
}

/**
 * Store a single setting in local storage
 * @param {string} k the key of the setting to store
 * @param {string} value the value of the setting to store
 */
function storeConfigEntry(k, value) {
  if (storageAvailable())
    window.localStorage.setItem(namespacedKey(k), valueToStore(value));
}

function storageAvailable(type = 'localStorage') {
  var storage;
  try {
    storage = window[type];
    var x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true
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
      (storage && storage.length !== 0)
  }
}

/**
 * @returns Whether there is any local storage in setting belonging to grapholscape
 */
function isAnySettingSaved() {
  if (storageAvailable()) {
    return Object.keys(window.localStorage).some(k => k.startsWith(NAMESPACE))
  }

  return false
}

function clearLocalStorage() {
  Object.keys(window.localStorage)
    .filter( k => k.startsWith(NAMESPACE))
    .forEach(k => window.localStorage.removeItem(k));
}

const preferences={entity_name:{type:"list",title:"Entities Name",label:"Select the type of name to display on entities",selected:"label",list:[{value:"label",label:"Label"},{value:"prefixed",label:"Prefixed IRI"},{value:"full",label:"Full IRI"}]},language:{type:"list",title:"Language",label:"Select the preferred language",selected:"",list:[]}};const rendering={theme:{type:"list",title:"Themes",label:"Select a theme",selected:"gscape",list:[{value:"gscape",label:"Light"},{value:"dark",label:"Dark"},{value:"classic",label:"Graphol"}]}};const widgets={explorer:{title:"Ontology Explorer",type:"boolean",enabled:true,label:"Enable Ontology Explorer widget"},details:{type:"boolean",title:"Entity Details",enabled:true,label:"Enable Entity Details widget"},owl_translator:{type:"boolean",title:"OWL Translator",enabled:true,label:"Enable Owl Translation widget"},filters:{type:"boolean",title:"Filters",enabled:true,label:"Enable Filters widget",filter_list:{all:{selector:"#undefined",label:"Filter All",active:false,disabled:false,"class":"undefined"},attributes:{selector:"[type = \"attribute\"]",label:"Attributes",active:false,disabled:false,"class":"filterattributes"},value_domain:{selector:"[type = \"value-domain\"]",label:"Value Domain",active:false,disabled:false,"class":"filtervaluedomains"},individuals:{selector:"[type = \"individual\"]",label:"Individuals",active:false,disabled:false,"class":"filterindividuals"},universal_quantifier:{selector:"[type $= \"-restriction\"][displayed_name = \"forall\"]",label:"Universal Quantifier",active:false,disabled:false,"class":"filterforall"},not:{selector:"[type = \"complement\"]",label:"Not",active:false,disabled:false,"class":"filtercomplements"},key:{selector:"[type = \"has-key\"]",label:"Key",active:false,disabled:false,"class":"filterKeys"}}},simplifications:{type:"boolean",title:"Simplifications",enabled:true,label:"Allow ontology simplification widget"}};var defaultConfig = {preferences:preferences,rendering:rendering,widgets:widgets};

var downloadBlob = (blob, fileName) => {
  let a = document.createElement('a');
  document.body.appendChild(a);
  a.style.setProperty('style', 'none');
  let url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

cytoscape.use(cy_svg);

let options = {
  output: 'blob-promise',
  full: true,
  bg : '',
};

function toPNG(fileName, cy, backgroundColor) {
  if(!checkParams(fileName, cy)) return

  options.bg = backgroundColor;
  cy.png(options).then(blob => downloadBlob(blob, fileName));
}

function toSVG(fileName, cy, backgroundColor) {
  if(!checkParams(fileName, cy)) return
  
  options.bg = backgroundColor;
  let svg_content = cy.svg(options);
  let blob = new Blob([svg_content], {type:"image/svg+xml;charset=utf-8"});
  downloadBlob(blob, fileName);
}


function checkParams(fileName, cy) {
  if( !fileName || ( typeof(fileName) !== 'string' ) ) {
    console.error('Unable to export using an undefined file name');
    return false
  }

  if( !cy ) {
    console.error('Unable to export: cytoscape instance is undefined');
    return false
  }

  return true
}

/**
 * @property {string} name - diagram's name
 * @property {string | number} id - diagram's identifier
 * @property {cytoscape} cy - cytoscape headless instance for managing elements
 */
class Diagram {
  /**
   * @param {string} name
   * @param {string | number} id
   * @param {JSON} elements - JSON representation of cytoscape elements @see [cytoscpae-eles](https://js.cytoscape.org/#notation/elements-json)
   */
  constructor (name, id, elements = null) {
    this.name = name;
    this.id = id;
    this.cy = cytoscape();
    if (elements)
      this.addElems(elements);
    /** @type {boolean} */
    this.hasEverBeenRendered = false;
  }

  /**
   * Add a collection of nodes and edges to the diagram
   * @param {JSON} elems - JSON representation of cytoscape elements @see [cytoscpae-eles](https://js.cytoscape.org/#notation/elements-json)
   */
  addElems (elems) {
    this.cy.add(elems);
  }

  /**
   * Get the entity selected
   * @returns {cytoscape.CollectionReturnValue | undefined}
   */
  getSelectedEntity() {
    let result = this.cy.$('.predicate:selected').first();

    return result.length > 0 ? result : undefined
  }

  /**
   * Select a node or an edge given its unique id
   * @param {string} id unique elem id (node or edge)
   * @param {boolean} [unselect=true] should selected elements be unselected
   */
   selectElem(id, unselect = true) {
    if (unselect) this.cy.$('*:selected').unselect();
    this.cy.$id(id).select();
  }

  /**
   * Getter
   * @returns {JSON} - nodes in JSON
   */
  get nodes() {
    return this.cy.nodes().jsons()
  }

  /**
   * Getter
   * @returns {JSON} - edges in JSON
   */
  get edges() {
    return this.cy.edges().jsons()
  }
}

/**
 * Class representing a namespace
 * @property {string[]} prefixes - array of prefixes
 * @property {string} value - namespace lexical form
 * @property {boolean} standard - bool saying if the namespace is standard or user defined
 */
class Namespace {
  /**
   * @param {string[]} prefixes - array of prefixes
   * @param {string} value - namespace lexical form
   * @param {boolean} standard - bool saying if the namespace is standard or user defined
   */
  constructor (prefixes, value, standard = false) {
    this.prefixes = prefixes || [''];
    this.value = value;
    this.standard = standard;
  }

  /**
   * Wether the namespace is standard (`true`) or user defined (`false`)
   * @returns {boolean}
   */
  isStandard () {
    return this.standard
  }

  /**
   * Check if the passed prefix is assigned to this namespace
   * @param {string} prefix the prefix to check
   */
  hasPrefix(prefix) {
    return this.prefixes.includes(prefix)
  }
}

/** 
 * @typedef {object} Iri
 * @property {string} Iri.fullIri
 * @property {string} Iri.remainingChars the string after the namespace or prefix
 * @property {string} Iri.prefix
 * @property {string} Iri.prefixed
 * @property {string} Iri.namespace
 */ 
/**
 * # Ontology
 * Class used as the Model of the whole app.
 */
class Ontology {
  /**
   * @param {string} name
   * @param {string} version
   * @param {Namespace[]} namespaces
   * @param {Diagram[]} diagrams
   */
  constructor(name, version, namespaces = [], diagrams = []) {
    /** @type {string} */
    this.name = name;
    /** @type {string} */
    this.version = version;
    /** @type {Namespace[]} */
    this.namespaces = namespaces;
    /** @type {Diagram[]} */
    this.diagrams = diagrams;

    /** @type {Object.<string, Annotation>} */
    this.annotations = [];
    
    this.languages = { 
      /** @type {import('../grapholscape').Language[]}*/
      list: [], 
      default: ''
    };
    /** @type {Annotation} */
    this.description = [];
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
    return this.namespaces.find(ns => ns.value === iriValue)
  }

  /**
   * Get the Namespace given one of its prefixes
   * @param {string} prefix 
   * @returns {Namespace}
   */
  getNamespaceFromPrefix(prefix) {
    return this.namespaces.find(ns => ns.hasPrefix(prefix))
  }

  /**
   * Get 
   * @param {string} iri full iri
   * @returns {Iri | undefined}
   */
  destructureIri(iri) {
    for (let namespace of this.namespaces) {
      // if iri contains namespace 
      if (iri.includes(namespace.value)) {
        return {
          namespace: namespace.value,
          prefix: namespace.prefixes[0],
          fullIri: iri,
          remainingChars: iri.slice(namespace.value.length),
          prefixed:  namespace.prefixes[0] + ':' + iri.slice(namespace.value.length)
        }
      }
    }
  }

  /** @param {Diagram} diagram */
  addDiagram(diagram) {
    this.diagrams.push(diagram);
  }

  /**
   * @param {string | number} index the id or the name of the diagram
   * @returns {Diagram} The diagram object
   */
  getDiagram(index) {
    if (index < 0 || index > this.diagrams.length) return
    if (this.diagrams[index]) return this.diagrams[index]

    return this.diagrams.find(d => d.name.toLowerCase() === index.toString().toLowerCase())
  }

  /**
   * Get an element in the ontology by id, searching in every diagram
   * @param {string} elem_id - The `id` of the elem to retrieve
   * @returns {CollectionReturnValue} The cytoscape object representation.
   */
  getElem(elem_id) {
    for (let diagram of this.diagrams) {
      let node = diagram.cy.$id(elem_id);
      if (node.length > 0) return node
    }
  }

  /**
   * Retrieve an entity by its IRI.
   * @param {string} iri - The IRI in full or prefixed form.
   * i.e. : `grapholscape:world` or `https://examples/grapholscape/world`
   * @returns {CollectionReturnValue} The cytoscape object representation.
   */
  getEntity(iri) {
    if (this.getEntityOccurrences(iri)) return this.getEntityOccurrences(iri)[0]
  }

  /**
   * Retrieve all occurrences of an entity by its IRI.
   * @param {string} iri - The IRI in full or prefixed form.
   * i.e. : `grapholscape:world` or `https://examples/grapholscape/world`
   * @returns {CollectionReturnValue[]} An array of cytoscape object representation
   */
  getEntityOccurrences(iri) {
    return this.entities[iri] || this.entities[this.prefixedToFullIri(iri)]
  }

  /**
   * Get an element in the ontology by its id and its diagram id
   * @param {string} elemID - The id of the element to retrieve
   * @param {string } diagramID - the id of the diagram containing the element
   * @returns {CollectionReturnValue} The element in cytoscape object representation
   */
  getElemByDiagramAndId(elemID, diagramID) {
    let diagram = this.getDiagram(diagramID);

    if (diagram) {
      let node = diagram.cy.$(`[id_xml = "${elemID}"]`) || diagram.cy.$id(elemID);
      if (node.length > 0)
        return node
    }
  }

  /**
   * Get the entities in the ontology
   * @returns {Object.<string, CollectionReturnValue[]>} a map of IRIs, with an array of entity occurrences (object[iri].occurrences)
   */
  getEntities() {
    let entities = {};
    this.diagrams.forEach(diagram => {
      diagram.cy.$('.predicate').forEach(entity => {
        let iri = entity.data('iri').fullIri;

        if (!Object.keys(entities).includes(iri)) {
          entities[iri] = [];
        }

        entities[iri].push(entity);
      });
    });

    this._entities = entities;
    return entities
  }

  /**
   * Check if entity has the specified iri in full or prefixed form
   * @param {Entity} entity 
   * @param {string} iri
   * @returns {boolean}
   */
  checkEntityIri(entity, iri) {
    /** @type {Iri} */
    let entityIri = entity.data('iri') || entity.data.iri;
    return entityIri.fullIri === iri ||
      entityIri.prefixed === iri
  }

  /**
   * Retrieve the full IRI given a prefixed IRI
   * @param {string} prefixedIri a prefixed IRI
   * @returns {string} full IRI
   */
  prefixedToFullIri(prefixedIri) {
    if (!prefixedIri || typeof(prefixedIri) !== 'string') return
    for (let namespace of this.namespaces) {
      let prefix = namespace.prefixes.find( p => prefixedIri.includes(p + ':'));

      if (prefix) return prefixedIri.replace(prefix + ':', namespace.value)

      else if (prefixedIri.startsWith(':') && namespace.prefixes.some( p => p === '')) {
        return prefixedIri.replace(':', namespace.value)
      }
    }
  }

  get isEntitiesEmpty() { return (!this._entities || Object.keys(this._entities).length === 0) }

  get entities() { return this.isEntitiesEmpty ? this.getEntities() : this._entities}
}

/** 
 * Node types in a Graphol ontology
 * @enum {string}
 * @property {string} CONCEPT concept
 * @property {string} DOMAIN_RESTRICTION domain-restriction
 * @property {string} RANGE_RESTRICTION range-restriction
 * @property {string} OBJECT_PROPERTY role
 * @property {string} DATA_PROPERTY attribute
 * @property {string} UNION union
 * @property {string} DISJOINT_UNION disjoint-union
 * @property {string} COMPLEMENT complement
 * @property {string} INTERSECTION intersection
 * @property {string} ENUMERATION enumeration
 * @property {string} KEY has-key
 * @property {string} ROLE_INVERSE role-inverse
 * @property {string} ROLE_CHAIN role-chain
 * @property {string} DATATYPE_RESTRICTION datatype-restriction
 * @property {string} VALUE_DOMAIN value-domain
 * @property {string} PROPERTY_ASSERTION property-assertion
 * @property {string} LITERAL literal
 * @property {string} INDIVIDUAL individual
 * @property {string} FACET facet
 * @property {string} NEUTRAL neutral
 * @property {string} VALUE value
 */
const Type = {
  /** @type {"concept"} */
  CONCEPT: 'concept',
  /** @type {"domain-restriction"} */
  DOMAIN_RESTRICTION: 'domain-restriction',
  /** @type {"range-restriction"} */
  RANGE_RESTRICTION: 'range-restriction',
  /** @type {"role"} */
  OBJECT_PROPERTY: 'role',
  /** @type {"attribute"} */
  DATA_PROPERTY: 'attribute',
  /** @type {"union"} */
  UNION: 'union',
  /** @type {"disjoint-union"} */
  DISJOINT_UNION: 'disjoint-union',
  /** @type {"complement"} */
  COMPLEMENT: 'complement',
  /** @type {"intersection"} */
  INTERSECTION: 'intersection',
  /** @type {"enumeration"} */
  ENUMERATION: 'enumeration',
  /** @type {"has-key"} */
  KEY: 'has-key',
  /** @type {"role-inverse"} */
  ROLE_INVERSE: 'role-inverse',
  /** @type {"role-chain"} */
  ROLE_CHAIN: 'role-chain',
  /** @type {"datatype-restriction"} */
  DATATYPE_RESTRICTION: 'datatype-restriction',
  /** @type {"value-domain"} */
  VALUE_DOMAIN: 'value-domain',
  /** @type {"property-assertion"} */
  PROPERTY_ASSERTION: 'property-assertion',
  /** @type {"literal"} */
  LITERAL: 'literal',
  /** @type {"individual"} */
  INDIVIDUAL: 'individual',
  /** @type {"facet"} */
  FACET: 'facet',
  /** @type {"neutral"} */
  NEUTRAL: 'neutral',
  /** @type {"value"} */
  VALUE: 'value'
};

/**
 * Shapes assigned to Graphol nodes. These are [Cytoscape.js shapes](https://js.cytoscape.org/#style/node-body)  
 * @enum {string}
 * @property {string} RECTANGLE rectangle
 * @property {string} DIAMOND diamond
 * @property {string} ELLIPSE ellipse
 * @property {string} HEXAGON hexagon
 * @property {string} ROUND_RECTANGLE roundrectangle
 * @property {string} OCTAGON octagon
 * @property {string} POLYGON polygon
 */
const Shape = {
  /** @type {"rectangle"} */
  RECTANGLE: 'rectangle',
  /** @type {"diamond"} */
  DIAMOND: 'diamond',
  /** @type {"ellipse"} */
  ELLIPSE: 'ellipse',
  /** @type {"hexagon"} */
  HEXAGON: 'hexagon',
  /** @type {"roundrectangle"} */
  ROUND_RECTANGLE: 'roundrectangle',
  /** @type {"octagon"} */
  OCTAGON: 'octagon',
  /** @type {"polygon"} */
  POLYGON: 'polygon'
};

const POLYGON_POINTS = '-0.9 -1 1 -1 0.9 1 -1 1';

/**
 * Enumeration having `type`, `shape` and `identity` for each Graphol node
 * @type {object} 
 */
var grapholNodes = {
  CONCEPT: {
    TYPE: Type.CONCEPT,
    SHAPE: Shape.RECTANGLE,
    IDENTITY: Type.CONCEPT
  },
  DOMAIN_RESTRICTION: {
    TYPE: Type.DOMAIN_RESTRICTION,
    SHAPE: Shape.RECTANGLE,
    IDENTITY: Type.CONCEPT,
  },
  RANGE_RESTRICTION: {
    TYPE: Type.RANGE_RESTRICTION,
    SHAPE: Shape.RECTANGLE,
    IDENTITY: Type.NEUTRAL
  },
  OBJECT_PROPERTY: {
    TYPE: Type.OBJECT_PROPERTY,
    SHAPE: Shape.DIAMOND,
    IDENTITY: Type.OBJECT_PROPERTY
  },
  DATA_PROPERTY: {
    TYPE: Type.DATA_PROPERTY,
    SHAPE: Shape.ELLIPSE,
    IDENTITY: Type.DATA_PROPERTY
  },
  UNION: {
    TYPE: Type.UNION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: Type.NEUTRAL
  },
  DISJOINT_UNION: {
    TYPE: Type.DISJOINT_UNION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: Type.NEUTRAL
  },
  COMPLEMENT: {
    TYPE: Type.COMPLEMENT,
    SHAPE: Shape.HEXAGON,
    IDENTITY: Type.NEUTRAL
  },
  INTERSECTION: {
    TYPE: Type.INTERSECTION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: Type.NEUTRAL
  },
  ENUMERATION: {
    TYPE: Type.ENUMERATION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: Type.NEUTRAL
  },
  KEY: {
    TYPE: Type.KEY,
    SHAPE: Shape.HEXAGON,
    IDENTITY: Type.NEUTRAL
  },
  ROLE_INVERSE: {
    TYPE: Type.ROLE_INVERSE,
    SHAPE: Shape.HEXAGON,
    IDENTITY: Type.OBJECT_PROPERTY
  },
  ROLE_CHAIN: {
    TYPE: Type.ROLE_CHAIN,
    SHAPE: Shape.HEXAGON,
    IDENTITY: Type.OBJECT_PROPERTY
  },
  DATATYPE_RESTRICTION: {
    TYPE: Type.DATATYPE_RESTRICTION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: Type.VALUE_DOMAIN
  },
  VALUE_DOMAIN: {
    TYPE: Type.VALUE_DOMAIN,
    SHAPE: Shape.ROUND_RECTANGLE,
    IDENTITY: Type.VALUE_DOMAIN
  },
  PROPERTY_ASSERTION: {
    TYPE: Type.PROPERTY_ASSERTION,
    SHAPE: Shape.ROUND_RECTANGLE,
    IDENTITY: Type.NEUTRAL
  },
  LITERAL: {
    TYPE: Type.LITERAL,
    SHAPE: Shape.OCTAGON,
    IDENTITY: Type.VALUE
  },
  INDIVIDUAL: {
    TYPE: Type.INDIVIDUAL,
    SHAPE: Shape.OCTAGON,
    IDENTITY: Type.INDIVIDUAL
  },
  FACET: {
    TYPE: Type.FACET,
    SHAPE: Shape.POLYGON,
    SHAPE_POINTS: POLYGON_POINTS, 
    IDENTITY: Type.FACET
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
const constructorLabels = {
  /** @type {"or"} */
  UNION: 'or',
  /** @type {"and"} */
  INTERSECTION : 'and',
  /** @type {"chain"} */
  ROLE_CHAIN : 'chain',
  /** @type {"inv"} */
  ROLE_INVERSE : 'inv',
  /** @type {"not"} */
  COMPLEMENT: 'not',
  /** @type {"data"} */
  DATATYPE_RESTRICTION : 'data',
  /** @type {"oneOf"} */
  ENUMERATION : 'oneOf',
  /** @type {"key"} */
  KEY : 'key',
};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t$1;const i$1=globalThis.trustedTypes,s$3=i$1?i$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,e$2=`lit$${(Math.random()+"").slice(9)}$`,o$3="?"+e$2,n$3=`<${o$3}>`,l$1=document,h$1=(t="")=>l$1.createComment(t),r$2=t=>null===t||"object"!=typeof t&&"function"!=typeof t,d=Array.isArray,u=t=>{var i;return d(t)||"function"==typeof(null===(i=t)||void 0===i?void 0:i[Symbol.iterator])},c=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,a=/>/g,f=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,_=/'/g,m=/"/g,g=/^(?:script|style|textarea)$/i,$=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),p=$(1),y=$(2),b=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),x=new WeakMap,w=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new N(i.insertBefore(h$1(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l},A=l$1.createTreeWalker(l$1,129,null,!1),C=(t,i)=>{const o=t.length-1,l=[];let h,r=2===i?"<svg>":"",d=c;for(let i=0;i<o;i++){const s=t[i];let o,u,$=-1,p=0;for(;p<s.length&&(d.lastIndex=p,u=d.exec(s),null!==u);)p=d.lastIndex,d===c?"!--"===u[1]?d=v:void 0!==u[1]?d=a:void 0!==u[2]?(g.test(u[2])&&(h=RegExp("</"+u[2],"g")),d=f):void 0!==u[3]&&(d=f):d===f?">"===u[0]?(d=null!=h?h:c,$=-1):void 0===u[1]?$=-2:($=d.lastIndex-u[2].length,o=u[1],d=void 0===u[3]?f:'"'===u[3]?m:_):d===m||d===_?d=f:d===v||d===a?d=c:(d=f,h=void 0);const y=d===f&&t[i+1].startsWith("/>")?" ":"";r+=d===c?s+n$3:$>=0?(l.push(o),s.slice(0,$)+"$lit$"+s.slice($)+e$2+y):s+e$2+(-2===$?(l.push(void 0),i):y);}const u=r+(t[o]||"<?>")+(2===i?"</svg>":"");return [void 0!==s$3?s$3.createHTML(u):u,l]};class P{constructor({strings:t,_$litType$:s},n){let l;this.parts=[];let r=0,d=0;const u=t.length-1,c=this.parts,[v,a]=C(t,s);if(this.el=P.createElement(v,n),A.currentNode=this.el.content,2===s){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(l=A.nextNode())&&c.length<u;){if(1===l.nodeType){if(l.hasAttributes()){const t=[];for(const i of l.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(e$2)){const s=a[d++];if(t.push(i),void 0!==s){const t=l.getAttribute(s.toLowerCase()+"$lit$").split(e$2),i=/([.?@])?(.*)/.exec(s);c.push({type:1,index:r,name:i[2],strings:t,ctor:"."===i[1]?M:"?"===i[1]?k:"@"===i[1]?H:S$1});}else c.push({type:6,index:r});}for(const i of t)l.removeAttribute(i);}if(g.test(l.tagName)){const t=l.textContent.split(e$2),s=t.length-1;if(s>0){l.textContent=i$1?i$1.emptyScript:"";for(let i=0;i<s;i++)l.append(t[i],h$1()),A.nextNode(),c.push({type:2,index:++r});l.append(t[s],h$1());}}}else if(8===l.nodeType)if(l.data===o$3)c.push({type:2,index:r});else {let t=-1;for(;-1!==(t=l.data.indexOf(e$2,t+1));)c.push({type:7,index:r}),t+=e$2.length-1;}r++;}}static createElement(t,i){const s=l$1.createElement("template");return s.innerHTML=t,s}}function V(t,i,s=t,e){var o,n,l,h;if(i===b)return i;let d=void 0!==e?null===(o=s._$Cl)||void 0===o?void 0:o[e]:s._$Cu;const u=r$2(i)?void 0:i._$litDirective$;return (null==d?void 0:d.constructor)!==u&&(null===(n=null==d?void 0:d._$AO)||void 0===n||n.call(d,!1),void 0===u?d=void 0:(d=new u(t),d._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Cl)&&void 0!==l?l:h._$Cl=[])[e]=d:s._$Cu=d),void 0!==d&&(i=V(t,d._$AS(t,i.values),d,e)),i}class E{constructor(t,i){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:l$1).importNode(s,!0);A.currentNode=o;let n=A.nextNode(),h=0,r=0,d=e[0];for(;void 0!==d;){if(h===d.index){let i;2===d.type?i=new N(n,n.nextSibling,this,t):1===d.type?i=new d.ctor(n,d.name,d.strings,this,t):6===d.type&&(i=new I(n,this,t)),this.v.push(i),d=e[++r];}h!==(null==d?void 0:d.index)&&(n=A.nextNode(),h++);}return o}m(t){let i=0;for(const s of this.v)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class N{constructor(t,i,s,e){var o;this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cg=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=V(this,t,i),r$2(t)?t===T||null==t||""===t?(this._$AH!==T&&this._$AR(),this._$AH=T):t!==this._$AH&&t!==b&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.S(t):u(t)?this.M(t):this.$(t);}A(t,i=this._$AB){return this._$AA.parentNode.insertBefore(t,i)}S(t){this._$AH!==t&&(this._$AR(),this._$AH=this.A(t));}$(t){this._$AH!==T&&r$2(this._$AH)?this._$AA.nextSibling.data=t:this.S(l$1.createTextNode(t)),this._$AH=t;}T(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=P.createElement(e.h,this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.m(s);else {const t=new E(o,this),i=t.p(this.options);t.m(s),this.S(i),this._$AH=t;}}_$AC(t){let i=x.get(t.strings);return void 0===i&&x.set(t.strings,i=new P(t)),i}M(t){d(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new N(this.A(h$1()),this.A(h$1()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$Cg=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}}class S$1{constructor(t,i,s,e,o){this.type=1,this._$AH=T,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=T;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=V(this,t,i,0),n=!r$2(t)||t!==this._$AH&&t!==b,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=V(this,e[s+l],i,l),h===b&&(h=this._$AH[l]),n||(n=!r$2(h)||h!==this._$AH[l]),h===T?t=T:t!==T&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.k(t);}k(t){t===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class M extends S$1{constructor(){super(...arguments),this.type=3;}k(t){this.element[this.name]=t===T?void 0:t;}}class k extends S$1{constructor(){super(...arguments),this.type=4;}k(t){t&&t!==T?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name);}}class H extends S$1{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=V(this,t,i,0))&&void 0!==s?s:T)===b)return;const e=this._$AH,o=t===T&&e!==T||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==T&&(e===T||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}}class I{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){V(this,t);}}const R=window.litHtmlPolyfillSupport;null==R||R(P,N),(null!==(t$1=globalThis.litHtmlVersions)&&void 0!==t$1?t$1:globalThis.litHtmlVersions=[]).push("2.0.1");

/** @typedef {import('cytoscape').CollectionReturnValue} CollectionReturnValue */

/**
 * Class that manages and control a set of renderers, it's used
 * to handle events fired by renderers, to mount/unmount
 * the required renderer and change the viewport state.
 */
class RendererManager {
  constructor() {

    this.renderers = {};
    /** @type {import('./renderers/index').GrapholscapeRenderer} */
    this.renderer = null;

    /** 
     * The main Grapholscape container, the one passed at initialisation
     * @type {HTMLElement}
     */
    this.container = null;
    /**
     * A div container to use for rendering the graph,
     * this one will be used by renderers.
     * 
     * @type {HTMLDivElement} 
     */
    this.graphContainer = document.createElement('div');

    this.graphContainer.style.width = '100%';
    this.graphContainer.style.height = '100%';
    this.graphContainer.style.position = 'relative';

    this._onEdgeSelection = () => { };
    this._onNodeSelection = () => { };
    this._onBackgroundClick = () => { };

    /** @type {number | string} */
    this.actualDiagramID = undefined;
  }

  setRenderer(rendererKey) {
    if (!this.renderers[rendererKey]) {
      console.warn(`renderer [${rendererKey}] not existing`);
      return
    }
    for (let key in this.renderers) {
      if (key != rendererKey)
        this.renderers[key].unmount();
    }

    this.renderer = this.renderers[rendererKey];
    this.renderer.setContainer(this.graphContainer);
  }

  /**
   * Register a new renderer in the renderers list
   * @param {string} key id of the renderer
   * @param {string} label name of the renderer
   * @param {import('./renderers/index').GrapholscapeRenderer} renderer an object of the Class `GrapholscapeRenderer`
   */
  addRenderer(key, label, renderer) {
    if (this.renderers[key]) console.warn(`Renderer ${key} overwritten`);

    renderer.setContainer(this.graphContainer);
    renderer.onNodeSelection = this._onNodeSelection;
    renderer.onEdgeSelection = this._onEdgeSelection;
    renderer.onBackgroundClick = this._onBackgroundClick;
    renderer.label = label;
    renderer.key = key;
    this.renderers[key] = renderer;
  }

  /**
   * 
   * @param {import('../model/index').Diagram} diagram The diagram to display
   */
  drawDiagram(diagram) {
    this.renderer.drawDiagram(diagram);
    this.actualDiagramID = diagram.id;
    diagram.hasEverBeenRendered = true;
  }

  /** @param {ViewportState} state*/
  setViewport(state) {
    if (state) this.renderer.centerOnRenderedPosition(state.x, state.y, state.zoom);
  }

  /**
   * Center the view port on a node given its ID and zoom on it
   * @param {number} nodeID
   * @param {number?} zoom level of zoom
   */
  centerOnNode(nodeID, zoom) {
    this.renderer.centerOnNode(nodeID, zoom);
  }

  /**
   * Set the container
   * @param {HTMLElement} container the container in which the renderer will draw the graph
   */
  setContainer(container) {
    if (this.container)
      this.container.remove();

    this.container = container;
    this.container.style.overflow = 'hidden';
    this.container.appendChild(this.graphContainer);
  }

  /** @param {number} zoomValue */
  zoomIn(zoomValue) {
    this.renderer.zoomIn(zoomValue);
  }

  /** @param {number} zoomValue */
  zoomOut(zoomValue) {
    this.renderer.zoomOut(zoomValue);
  }

  fit() {this.renderer.fit();}

  /** @param {import("../grapholscape").Filter} filterObj*/
  filter(filterObj) {
    this.renderer.filter(filterObj);
  }

  /** @param {import("../grapholscape").Filter} filterObj*/
  unfilter(filterObj) {
    this.renderer.unfilter(filterObj);
  }

  /** @param {import("../style/themes").Theme} theme */
  setTheme(theme) {
    // Apply theme to graph
    for (let name in this.renderers) {
      this.renderers[name].setTheme(theme);
    }
  }

  /**
   * 
   * @param {string} actualEntityNameType 
   * @param {import('../grapholscape').Languages} languages 
   */
  updateDisplayedNames(actualEntityNameType, languages) {
    this.renderer.cy.$('.predicate').forEach(entity => {
      let displayedName = '';
      switch (actualEntityNameType) {
        case 'label': {
          let labels = entity.data('annotations')?.label;
          if (labels) {
            let first_label_key = Object.keys(labels)[0];
            displayedName =
              labels[languages.selected] ||
              labels[languages.default] ||
              labels[first_label_key];

            displayedName = displayedName[0];
          } else {
            displayedName = entity.data('iri').remainingChars;
          }
          break
        }

        case 'prefixed': {
          displayedName = entity.data('iri').prefixed;
          break
        }

        case 'full': {
          displayedName = entity.data('iri').fullIri;
          break
        }
      }

      /**
       * In floaty mode remove all '\n' from edges' labels to avoid glitches
       */
      if (this.renderer === this.renderers['float'] && entity.data('type') === Type.OBJECT_PROPERTY)
        displayedName = displayedName.replace(/\r?\n|\r/g, '');

      entity.data('displayed_name', displayedName);
    });
  }

  /** @type {ViewportState} */
  get actualViewportState() { return this.renderer?.actualViewportState }

  /** @param {import('../grapholscape').backgroundClickCallback} callback */
  onBackgroundClick(callback) {
    this._onBackgroundClick = callback;
    Object.keys(this.renderers).forEach(k => {
      this.renderers[k].onBackgroundClick = this._onBackgroundClick;
    });
  }

  /** @param {import('../grapholscape').edgeSelectionCallbak} callback */
  onEdgeSelection(callback) {
    this._onEdgeSelection = callback;
    Object.keys(this.renderers).forEach(k => {
      this.renderers[k].onEdgeSelection = this._onEdgeSelection;
    });
  }
   
  /** @param {import('../grapholscape').nodeSelectionCallbak} callback */
  onNodeSelection(callback) {
    this._onNodeSelection = callback;
    Object.keys(this.renderers).forEach(k => {
      this.renderers[k].onNodeSelection = this._onNodeSelection;
    });
  }
}

function getGraphStyle(theme) {
  return [
    {
      selector: 'node',
      style: {
        'height': 'data(height)',
        'width': 'data(width)',
        'background-color': theme.node_bg,
        'shape': 'data(shape)',
        'border-width': 1,
        'border-color': theme.node_border,
        'border-style': 'solid',
        'font-size': 12,
        'color': theme.label_color,
      }
    },

    {
      selector: '[fontSize]',
      style: {
        'font-size' : 'data(fontSize)',
      }
    },

    {
      selector: 'node[displayed_name]',
      style: {
        'label': 'data(displayed_name)',
        'text-margin-x': 'data(labelXpos)',
        'text-margin-y': 'data(labelYpos)',
        'text-wrap': 'wrap',
        'min-zoomed-font-size' : '5px',
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
        'line-color': theme.edge,
        'target-arrow-color': theme.edge,
        'source-arrow-color': theme.edge,
        'curve-style': 'bezier',
        'arrow-scale': 1.3,
        'color': theme.label_color,
      }
    },

    {
      selector: 'edge[type = "inclusion"], edge.inclusion',
      style: {
        'line-style': 'solid',
        'target-arrow-shape': 'triangle',
        'target-arrow-fill': 'filled'
      }
    },

    {
      selector: 'edge[type = "membership"]',
      style: {
        'line-style': 'dashed',
        'line-dash-pattern': [2,3],
        'target-arrow-shape': 'triangle',
        'target-arrow-fill': 'hollow'
      }
    },

    {
      selector: 'edge.hierarchy',
      style: {
        'width': 6,
        'target-arrow-fill': 'hollow',
      }
    },

    {
      selector: 'edge.disjoint',
      style: {
        'target-arrow-fill': 'filled',
      }
    },

    {
      selector: 'edge[type = "input"]',
      style: {
        'line-style': 'dashed',
        'target-arrow-shape': 'diamond',
        'target-arrow-fill': 'hollow'
      }
    },

    {
      selector: 'edge[type = "easy_input"]',
      style: {
        'line-style': 'solid',
      }
    },

    {
      selector: 'edge[type = "equivalence"]',
      style: {
        'line-style': 'solid',
        'source-arrow-shape': 'triangle',
        'source-arrow-fill': 'filled',
        'target-arrow-shape': 'triangle',
        'target-arrow-fill': 'filled',
      }
    },

    {
      selector: '[segment_distances]',
      style: {
        'curve-style': 'segments',
        'segment-distances': 'data(segment_distances)',
        'segment-weights': 'data(segment_weights)',
        'edge-distances': 'node-position'
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
      selector: '[source_endpoint]',
      style: {
        'source-endpoint': 'data(source_endpoint)'
      }
    },

    {
      selector: '[target_endpoint]',
      style: {
        'target-endpoint': 'data(target_endpoint)'
      }
    },

    {
      selector: '[?functional][!inverseFunctional]',
      style: {
        'border-width': 5,
        'border-color': theme.node_border,
        'border-style': 'double'
      }
    },

    {
      selector: '[?inverseFunctional][!functional]',
      style: {
        'border-width': 4,
        'border-color': theme.node_border,
        'border-style': 'solid'
      }
    },

    {
      selector: 'edge[displayed_name]',
      style: {
        'label': 'data(displayed_name)',
        'font-size': 10,
        'text-rotation': 'autorotate',
        'text-margin-y': -10,
      }
    },

    {
      selector: '[target_label]',
      style: {
        'target-label': 'data(target_label)',
      }
    },

    {
      selector: '[source_label]',
      style: {
        'source-label': 'data(source_label)',
      }
    },

    {
      selector: '[source_label],[target_label]',
      style: {
        'font-size': 15,
        'target-text-offset': 20,
      }
    },

    {
      selector: 'edge[displayed_name],[source_label],[target_label],[text_background]',
      style: {
        'text-background-color': theme.background,
        'text-background-opacity': 1,
        'text-background-shape': 'roundrectangle',
        'text-background-padding' : 2,
      }
    },

    {
      selector: '[shape_points]',
      style: {
        'shape-polygon-points': 'data(shape_points)'
      }
    },

    {
      selector: '.filtered',
      style: {
        'display': 'none'
      }
    },

    {
      selector: '.facet',
      style: {
        'background-opacity': 0
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
      selector: '.concept',
      style: {
        'background-color': theme.concept,
        'border-color': theme.concept_dark,
      }
    },

    {
      selector: '.role, .fake-triangle',
      style: {
        'background-color': theme.role,
        'border-color': theme.role_dark,
      }
    },

    {
      selector: '.attribute',
      style: {
        'background-color': theme.attribute,
        'border-color': theme.attribute_dark,
      }
    },

    {
      selector: '.attribute:selected',
      style: {
        'text-background-color': theme.background,
        'text-background-opacity': 1,
      }
    },

    {
      selector: 'edge.role',
      style: {
        'line-color' : theme.role_dark,
        'source-arrow-color': theme.role_dark,
        'target-arrow-color': theme.role_dark,
        'target-arrow-shape': 'triangle',
        'target-arrow-fill': 'filled',
        'source-arrow-shape': 'square',
        'source-arrow-fill': 'hollow',
      }
    },

    {
      selector: 'edge.role.predicate',
      style: {
        'width': 4,
      }
    },

    {
      selector: 'edge.range',
      style: {
        'target-arrow-shape': 'square',
        'target-arrow-fill': 'filled',
        'source-arrow-shape': 'none',
      }
    },

    {
      selector: 'edge.domain',
      style: {
        'target-arrow-shape': 'square',
        'target-arrow-fill': 'hollow',
        'source-arrow-shape': 'none',
      }
    },

    {
      selector: 'edge.attribute',
      style: {
        'line-color': theme.attribute_dark,
        'source-arrow-shape': 'none',
        'target-arrow-shape': 'none',
      }
    },

    {
      selector: '.bubble',
      style: {
        'text-margin-x': 0,
        'text-margin-y': 0,
        'text-valign' : 'center',
        'text-halign' : 'center',
        'shape': 'ellipse',
        'height': 'data(width)'
      }
    },

    {
      selector: '.individual',
      style: {
        'background-color': theme.individual,
        'border-color': theme.individual_dark,
      }
    },

    {
      selector: '[type = "range-restriction"], [type = "disjoint-union"]',
      style: {
        'background-color': theme.node_bg_contrast,
      }
    },

    {
      selector: '.float:locked',
      style: {
        'border-width' : '4px',
      }
    },

    {
      selector: '.float[?pinned]',
      style: {
        'border-color' : theme.secondary,
      }
    },

    { // the right border part of functional && inverseFunctional roles
      selector: '.fake-triangle-right',
      style: {
        'background-color': theme.role_dark || 'black',
      }
    },

    {
      selector: '[shape = "hexagon"],[type = "value-domain"], .facet',
      style: {
        'color': theme.node_bg_contrast,
      }
    },

    //-----------------------------------------------------------
    // selected selector always last
    {
      selector: ':selected',
      style: {
        'overlay-color': theme.secondary,
        'overlay-opacity': 0.2,
        'z-index': '100'
      }
    },
  ]
}

class GrapholscapeRenderer {
  constructor (container = null) {
    this.label = '';
    this.actual_diagram = null;
    this.cy_container = document.createElement('div');

    this.cy_container.style.width = '100%';
    this.cy_container.style.height = '100%';
    this.cy_container.style.position = 'relative';
    this.cy = cytoscape();
    if(container) this.setContainer(container);
  }

  setContainer(container) {
    if (container)
      container.insertBefore(this.cy_container, container.firstChild);
  }

  /**
   * WHY NOT USING cy.mount(container)??
   * because it causes a problem with float renderer.
   * In particular at the second time this.mount() will be
   * called, the layout will stop working, something happens internally
   * breaking the layout.
   *
   * WHY SWITCHING FROM display:none TO position:absolute??
   * display:none will cause the container having clientHeight(Width) = 0
   * and cytoscpae uses those values to perform the fit().
   * This will cause problems when switching renderers cause in some
   * cases fit() will be automatically called on the container having
   *  zero asdimensions
   */
  mount(container) {
    //container.insertBefore(this.cy.container(), container.firstChild)
    // force refresh

    //this.cy.container().style.display = 'block'
    //container.setAttribute('id', 'cy')
    this.cy_container = container;
    this.cy?.mount(this.cy_container);
  }

  unmount() {
    //this.cy.container().style.display = 'none'
    //this.cy.container().parentElement.removeChild(this.cy.container())
    this.cy?.unmount();
  }

  centerOnNode (node_id, zoom) {
    var node = this.cy.getElementById(node_id);
    if (node) {
      this.centerOnPosition(node.position('x'), node.position('y'), zoom);
      this.cy.$(':selected').unselect();
      node.select();
    }
  }

  centerOnPosition (x_pos, y_pos, zoom = this.cy.zoom()) {
    this.cy.reset();
    let offset_x = this.cy.width() / 2;
    let offset_y = this.cy.height() / 2;
    x_pos -= offset_x;
    y_pos -= offset_y;
    this.cy.pan({
      x: -x_pos,
      y: -y_pos
    });
    this.cy.zoom({
      level: zoom,
      renderedPosition: { x: offset_x, y: offset_y }
    });
  }

  centerOnRenderedPosition(x_pos, y_pos, zoom = this.cy.zoom()) {
    this.cy.viewport({
      zoom : zoom,
      pan : {x : x_pos, y : y_pos}
    });
  }

  fit() {
    this.cy.fit();
  }

  drawDiagram (diagram) {
    this.cy = diagram.cy;
    //this.cy.fit()
    this.actual_diagram = diagram.id;
  }

  zoomIn(zoomValue) {
    this.cy.zoom({
      level: this.cy.zoom() + zoomValue,
      renderedPosition: { x: this.cy.width() / 2, y: this.cy.height() / 2 }
    });
  }

  zoomOut(zoomValue) {
    this.cy.zoom({
      level: this.cy.zoom() - zoomValue,
      renderedPosition: { x: this.cy.width() / 2, y: this.cy.height() / 2 }
    });
  }

  filter(filter, cy_instance) {
    let cy = cy_instance || this.cy;
    let selector = `${filter.selector}, .${filter.class}`;

    cy.$(selector).forEach(element => {
      this.filterElem(element, filter.class, cy);
    });
  }

  filterElem (element, filter_class, cy_instance) {
    let cy = cy_instance || this.cy;
    element.addClass('filtered '+filter_class);
    // Filter fake nodes!
    cy.nodes(`[parent_node_id = "${element.id()}"]`).addClass('filtered '+filter_class);

    // ARCHI IN USCITA
    //var selector = `[source = "${element.data('id')}"]`
    element.outgoers('edge').forEach( e => {
      let neighbour = e.target();
      // if inclusion[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
      let number_edges_in_out = getNumberEdgesInOut(neighbour);

      if (!e.target().hasClass('filtered') && (number_edges_in_out <= 0 || e.data('type') === 'input')) {
        this.filterElem(e.target(), filter_class, cy);
      }
    });

    // ARCHI IN ENTRATA
    element.incomers('edge').forEach(e => {
      let neighbour = e.source();
      // if Isa[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
      let number_edges_in_out = getNumberEdgesInOut(neighbour);

      if (!e.source().hasClass('filtered') && number_edges_in_out === 0) {
        this.filterElem(e.source(), filter_class, cy);
      }
    });

    function getNumberEdgesInOut(neighbour) {
      let count =  neighbour.outgoers('edge').size() + neighbour.incomers('edge[type != "input"]').size();

      neighbour.outgoers().forEach( e => {
        if(e.target().hasClass('filtered')) {
          count--;
        }
      });

      neighbour.incomers('[type != "input"]').forEach( e => {
        if(e.source().hasClass('filtered')) {
          count--;
        }
      });

      return count
    }
  }

  unfilter(filter, cy_instance) {
    let selector = `${filter.selector}, .${filter.class}`;
    let cy = cy_instance || this.cy;

    cy.$(selector).removeClass('filtered');
    cy.$(selector).removeClass(filter.class);
  }

  setTheme(theme) {
    this.theme = theme;
    this.cy?.style(getGraphStyle(theme));
  }

  /** @type {import('../renderer-manager').ViewportState} */
  get actualViewportState() {
    return {
      x : this.cy.pan().x,
      y : this.cy.pan().y,
      zoom : this.cy.zoom()
    }
  }

  get disabledFilters() {
    return []
  }

  /** @param {import('cytoscape').Core} cyInstance*/
  set cy(cyInstance) {
    if (cyInstance.json() === this.cy?.json()) return
    if (this._cy) this._cy.unmount();
    cyInstance.mount(this.cy_container);

    cyInstance.removeAllListeners();
    cyInstance.autoungrabify(true);
    cyInstance.maxZoom(2.5);
    cyInstance.minZoom(0.02);
    cyInstance.layout({ name: 'preset' });
    
    this._cy = cyInstance;

    if (this.theme) this.setTheme(this.theme);

    this.cy.on('select', 'node', e => {
      let type = e.target.data('type');
      switch(type) {
        case 'intersection':
        case 'union':
        case 'disjoint-union':
          e.target.neighborhood().select();
          break
      }
      e.target.select();
      this.onNodeSelection(e.target);
    });
    this.cy.on('select', 'edge', e => {this.onEdgeSelection(e.target);});
    this.cy.on('tap', evt => {
      if (evt.target === this.cy) {
        this.onBackgroundClick();
      }
    });
    this.cy.on('mouseover', '*', e => {
      this.cy.container().style.cursor = 'pointer';
    });
    this.cy.on('mouseout', '*', e => {
      this.cy.container().style.cursor = 'inherit';
    });
  }

  get cy() { return this._cy }
}

class LiteGscapeRenderer extends GrapholscapeRenderer {
  constructor(container) {
    super(container);
  }

  drawDiagram(diagram) {
    super.drawDiagram(diagram);
    this.cy.autoungrabify(false);
    this.cy.nodes().lock();
    this.cy.nodes('.repositioned').unlock();

    let layout = this.cy.$('.repositioned').closedNeighborhood().closedNeighborhood().layout({
      name: 'cola',
      randomize:false,
      fit: false,
      refresh:3,
      maxSimulationTime: 8000,
      convergenceThreshold: 0.0000001
    });
    layout.run();
  }

  get disabledFilters() { return ["not", "universal_quantifier", "value_domain"] }
}

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,e$1=Symbol(),n$2=new Map;class s$2{constructor(t,n){if(this._$cssResult$=!0,n!==e$1)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t;}get styleSheet(){let e=n$2.get(this.cssText);return t&&void 0===e&&(n$2.set(this.cssText,e=new CSSStyleSheet),e.replaceSync(this.cssText)),e}toString(){return this.cssText}}const o$2=t=>new s$2("string"==typeof t?t:t+"",e$1),r$1=(t,...n)=>{const o=1===t.length?t[0]:n.reduce(((e,n,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+t[s+1]),t[0]);return new s$2(o,e$1)},i=(e,n)=>{t?e.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((t=>{const n=document.createElement("style"),s=window.litNonce;void 0!==s&&n.setAttribute("nonce",s),n.textContent=t.cssText,e.appendChild(n);}));},S=t?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const n of t.cssRules)e+=n.cssText;return o$2(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s$1;const e=window.reactiveElementPolyfillSupport,r={toAttribute(t,i){switch(i){case Boolean:t=t?"":null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},h=(t,i)=>i!==t&&(i==i||t==t),o$1={attribute:!0,type:String,converter:r,reflect:!1,hasChanged:h};class n$1 extends HTMLElement{constructor(){super(),this._$Et=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Ei=null,this.o();}static addInitializer(t){var i;null!==(i=this.l)&&void 0!==i||(this.l=[]),this.l.push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Eh(s,i);void 0!==e&&(this._$Eu.set(e,s),t.push(e));})),t}static createProperty(t,i=o$1){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||o$1}static finalize(){if(this.hasOwnProperty("finalized"))return !1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Eu=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(S(i));}else void 0!==i&&s.push(S(i));return s}static _$Eh(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}o(){var t;this._$Ev=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Ep(),this.requestUpdate(),null===(t=this.constructor.l)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$Em)&&void 0!==i?i:this._$Em=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$Em)||void 0===i||i.splice(this._$Em.indexOf(t)>>>0,1);}_$Ep(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Et.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return i(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$Em)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$Em)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$Eg(t,i,s=o$1){var e,h;const n=this.constructor._$Eh(t,s);if(void 0!==n&&!0===s.reflect){const o=(null!==(h=null===(e=s.converter)||void 0===e?void 0:e.toAttribute)&&void 0!==h?h:r.toAttribute)(i,s.type);this._$Ei=t,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$Ei=null;}}_$AK(t,i){var s,e,h;const o=this.constructor,n=o._$Eu.get(t);if(void 0!==n&&this._$Ei!==n){const t=o.getPropertyOptions(n),l=t.converter,a=null!==(h=null!==(e=null===(s=l)||void 0===s?void 0:s.fromAttribute)&&void 0!==e?e:"function"==typeof l?l:null)&&void 0!==h?h:r.fromAttribute;this._$Ei=n,this[n]=a(i,t.type),this._$Ei=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||h)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$Ei!==t&&(void 0===this._$ES&&(this._$ES=new Map),this._$ES.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$Ev=this._$EC());}async _$EC(){this.isUpdatePending=!0;try{await this._$Ev;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Et&&(this._$Et.forEach(((t,i)=>this[i]=t)),this._$Et=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$Em)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$EU();}catch(t){throw i=!1,this._$EU(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$Em)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$EU(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Ev}shouldUpdate(t){return !0}update(t){void 0!==this._$ES&&(this._$ES.forEach(((t,i)=>this._$Eg(i,this[i],t))),this._$ES=void 0),this._$EU();}updated(t){}firstUpdated(t){}}n$1.finalized=!0,n$1.elementProperties=new Map,n$1.elementStyles=[],n$1.shadowRootOptions={mode:"open"},null==e||e({ReactiveElement:n$1}),(null!==(s$1=globalThis.reactiveElementVersions)&&void 0!==s$1?s$1:globalThis.reactiveElementVersions=[]).push("1.0.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l,o;class s extends n$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Dt=w(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!1);}render(){return b}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n=globalThis.litElementPolyfillSupport;null==n||n({LitElement:s});(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.0.1");

const diagrams = y`<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>`;

const triangle_up = y`<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 14l5-5 5 5H7z"/></svg>`;

const triangle_down = y`<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 10l5 5 5-5H7z"/></svg>`;

const arrow_right = y`<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>`;

const arrow_down = y`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>`;

const explore = y`<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z"/></svg>`;

const info_outline = y`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>`;

const enter_fullscreen = y`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;

const exit_fullscreen = y`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`;

const center_diagram = y`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5 15H3v4c0 1.1.9 2 2 2h4v-2H5v-4zM5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5zm14-2h-4v2h4v4h2V5c0-1.1-.9-2-2-2zm0 16h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4zM12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;

const filter = y`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>`;

const bubbles = y`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><circle cx="7.2" cy="14.4" r="3.2"/><circle cx="14.8" cy="18" r="2"/><circle cx="15.2" cy="8.8" r="4.8"/></svg>`;

const lite = y`<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><rect fill="none" height="24" width="24"/><g><path d="M14.06,9.94L12,9l2.06-0.94L15,6l0.94,2.06L18,9l-2.06,0.94L15,12L14.06,9.94z M4,14l0.94-2.06L7,11l-2.06-0.94L4,8 l-0.94,2.06L1,11l2.06,0.94L4,14z M8.5,9l1.09-2.41L12,5.5L9.59,4.41L8.5,2L7.41,4.41L5,5.5l2.41,1.09L8.5,9z M4.5,20.5l6-6.01l4,4 L23,8.93l-1.41-1.41l-7.09,7.97l-4-4L3,19L4.5,20.5z"/></g></svg>`;

const settings$1 = y`<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><g><path d="M0,0h24v24H0V0z" fill="none"/><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></g></svg>`;

const info_filled = y`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`;

const plus = y`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`;

const minus = y`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 13H5v-2h14v2z"/></svg>`;

const save = y`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>`;

const lock_open = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/></svg>';

class FloatyGscapeRenderer extends GrapholscapeRenderer {
  constructor(container) {
    super(container);

    this.layoutStopped = false;
    this.dragAndPin = false;
    this.useOriginalPositions = false;

    this.popperContainers = [];
  }

  setCySettings() {
    this.cy.style.textureOnViewport = true;

    this.cy.autoungrabify(false);

    this.cy.on('grab', (e) => {
      e.target.data('old_pos', JSON.stringify(e.target.position()));
    });

    this.cy.on('free', (e) => {
      let actual_pos = JSON.stringify(e.target.position());
      if (this.dragAndPin && e.target.data('old_pos') !== actual_pos) {
        this.pinNode(e.target);
      }

      e.target.removeData('old_pos');
    });

    this.cy.$('[?pinned]').each( n => {
      n.on('position', () => this.updatePopper(n));
      this.cy.on('pan zoom resize', () => this.updatePopper(n));
    });
  }

  addPopperContainer() {
    const popperContainer = document.createElement('div');
    popperContainer.setAttribute('id', this.actual_diagram);
    this.popperContainers[this.actual_diagram] = popperContainer;
  }

  /** @param {import('../../model/index').Diagram} diagram*/
  drawDiagram(diagram) {
    super.drawDiagram(diagram);
   
    this.setCySettings();
    /**
     * At each diagram change, cy instance changes and everything
     * inside cy.container() is overwritten by cytoscape with 
     * the cy instance own container, inside this container we add 
     * the popper container related to the new diagram as the one
     * related to the previous diagram has been deleted.
     */
    this.cy.container().appendChild(this.popperContainer);

    this.cy.nodes().addClass('float');

    this.cy.$('[!pinned]').unlock();
    this.main_layout.removeAllListeners();

    if (this.useOriginalPositions) {
      this.activateOriginalPositions();
    } else {
      this.main_layout = this.layout(); // apply layout on those not locked
      this.main_layout.run();
    }

    /**
     * hack: let layout run a bit and fit to it.
     * Prevent some diagrams to disappear from screen due to
     * automatic layout.
     */
    //setTimeout(() => this.cy.fit(), 100)
  }

  centerOnNode(node_id, zoom) {
      let node = this.cy.$id(node_id);
      if (node) {
        this.cy.$(':selected').unselect();

        if ( node.data('type') == 'role') {
          let elems = node.connectedNodes();
          setTimeout( () => this.cy.fit(elems), 300);
          node.select();
          elems.select();
        } else {
          setTimeout( () => this.centerOnPosition(node.position('x'), node.position('y'), zoom), 300);
          node.select();
        }
      }
  }

  layout(selector = '*') {
    return this.cy.$(selector).layout(this.layout_settings)
  }

  unpinNode(node) {
    this.removeUnlockButton(node);
    node.unlock();
    node.data("pinned", false);
  }

  pinNode(node) {
    node.lock();
    node.data("pinned", true);

    node.unlockButton = node.popper({
      content: () => {
        let dimension =  node.data('width') / 9 * this.cy.zoom();
        let div = document.createElement('div');
        div.style.background = node.style('border-color');
        div.style.borderRadius = '100%';
        div.style.padding = '5px';
        div.style.color = this.theme.on_secondary;
        div.style.cursor = 'pointer';
        div.style.boxSizing = 'content-box';
        div.setAttribute('title', 'Unlock Node');

        div.innerHTML = `<span class="popper-icon">${lock_open}</span>`;
        this.setPopperStyle(dimension, div);

        div.onclick = () => this.unpinNode(node);
        this.popperContainer.appendChild(div);

        return div
      },
    });

    node.on('position', () => this.updatePopper(node));
    this.cy.on('pan zoom resize', () => this.updatePopper(node));
  }

  updatePopper(node) {
    if (!node.unlockButton) return

    
    let unlockButton = node.unlockButton;
    let dimension =  node.data('width') / 9 * this.cy.zoom();
    this.setPopperStyle(dimension, unlockButton.state.elements.popper);
    unlockButton.update();
  }

  setPopperStyle(dim, popper) {
    let icon = popper.querySelector('.popper-icon > svg');
    icon.style.display = 'inherit';
    if (dim > 2) {
      popper.style.width = dim + 'px';
      popper.style.height = dim + 'px';
      popper.style.display = 'flex';
      if (dim > 8) {
        icon.setAttribute('width', dim+'px');
        icon.setAttribute('height', dim+'px');
      } else if (dim - 10 > 0 ) {
        icon.setAttribute('width', (dim - 10)+'px');
        icon.setAttribute('height', (dim - 10)+'px');
      } else {
        icon.style.display = 'none';
      }
    } else {
      icon.style.display = 'none';
      popper.style.display = 'none';
    }
  }

  clearPoppers() {
    this.cy.nodes().each(node => this.removeUnlockButton(node));
  }

  unmount() {
    super.unmount();
  }

  removeUnlockButton(node) {
    if (node.unlockButton) {
      node.unlockButton.state.elements.popper.remove();
      node.unlockButton.destroy();
      node.unlockButton = null;
    }
  }

  /**
   * Create a new layout with default edgeLength and allowing overlapping
   * Put concepts (not already pinned) in their original position and lock them
   * Run the new layout to place hierarchies nodes and attributes
   */
  activateOriginalPositions() {
    let layout_options = this.layout_settings;
    // customize options
    delete layout_options.edgeLength;
    layout_options.avoidOverlap = false;
    delete layout_options.convergenceThreshold;
    this.main_layout = this.cy.$('*').layout(layout_options);

    this.cy.$('.concept').forEach( node => {
      if (!node.data('pinned')) {
        node.position(JSON.parse(node.data('original-position')));
        node.lock();
      }
    });

    this.main_layout.run();
    /**
     * when the layout finishes placing attributes and hierarchy nodes, unlock all
     * nodes not already pinned somewhere
     */
    this.main_layout.on("layoutstop", () => this.cy.$('[!pinned]').unlock());
  }

  disableOriginalPositions() {
    this.cy.$('[type = "concept"][!pinned]').unlock();
    this.main_layout = this.layout();
  }
  
  get disabledFilters() { return ["not", "universal_quantifier", "value_domain", "key"] }

  get layout_settings() {
    return {
      name: 'cola',
      avoidOverlap: true,
      edgeLength: function(edge) {
        if (edge.hasClass('role')) {
          return 300 + edge.data('displayed_name').length * 4
        }
        else if (edge.target().data('type') == 'attribute' ||
                 edge.source().data('type') == 'attribute' )
          return 150
        else
          return 250
      },
      fit : false,
      infinite: !this.layoutStopped,
      handleDisconnected: true, // if true, avoids disconnected components from overlapping
      convergenceThreshold: 0.000000001
    }
  }

  set layoutStopped(isStopped) {
    this._layoutStopped = isStopped;

    if(this.main_layout) {
      this.main_layout.options.infinite = !isStopped;
      isStopped ? this.main_layout.stop() : this.main_layout.run();
    }
  }

  get layoutStopped() { return this._layoutStopped}

  set dragAndPin(active) {
    this._dragAndPin = active;
    if (!active) this.cy.$('[?pinned]').each(node => this.unpinNode(node));
  }

  get dragAndPin() { return this._dragAndPin }

  /**
   * lock concept(classes) nodes in their original positions
   */
  set useOriginalPositions(active) {
    this._useOriginalPoisions = active;

    active ? this.activateOriginalPositions() : this.disableOriginalPositions();
  }

  get useOriginalPositions() { return this._useOriginalPoisions }

  set main_layout(new_layout) {
    this._main_layout?.stop();
    this._main_layout = new_layout;
  }

  get main_layout() { return this._main_layout }

  /** 
   * Each diagram must have its own poppers in its own
   * popper container, if it's the first time we draw
   * a diagram we will create the popper container with
   * addPopperContainer() 
   * @returns {HTMLDivElement} 
   */
  get popperContainer() { 
    if (!this.popperContainers[this.actual_diagram])
      this.addPopperContainer();

    return this.popperContainers[this.actual_diagram]
  }
}

const grapholRenderer = { key: "default", label: "Graphol", getObj: () => new GrapholscapeRenderer() }; 
const grapholLiteRenderer = { key: "lite", label: "Graphol-Lite", getObj: () => new LiteGscapeRenderer() };
const floatyRenderer = { key: "float", label: "Floaty", getObj: () => new FloatyGscapeRenderer() };
 // export class for letting the user extends it creating his own renderer

var renderers = /*#__PURE__*/Object.freeze({
  __proto__: null,
  grapholRenderer: grapholRenderer,
  grapholLiteRenderer: grapholLiteRenderer,
  floatyRenderer: floatyRenderer,
  GrapholscapeRenderer: GrapholscapeRenderer
});

function initRenderersManager(container, renderersKeys = ['default']) {
  let rendererManager = new RendererManager();
  
  rendererManager.setContainer(container);
  
  renderersKeys.forEach( key => {
    let rendererKey = Object.keys(renderers).find( k => {
      if (k === 'GrapholscapeRenderer') return false
      return renderers[k].key === key
    });
    if (!rendererKey) {
      console.warn(`Renderer with key="${key}" does not exists`);
      return
    }
    let renderer = renderers[rendererKey];
    rendererManager.addRenderer(key, renderer.label, renderer.getObj());
  });

  if (Object.keys(rendererManager.renderers).length > 0 )
    rendererManager.setRenderer(Object.keys(rendererManager.renderers)[0]);
  else {
    console.warn('Please specify at least one renderer. Default renderer will be used as fallback');
    rendererManager.addRenderer(
      grapholRenderer.key,
      grapholRenderer.label,
      grapholRenderer.getObj()
    );
    rendererManager.setRenderer(grapholRenderer.key);
  }
  return rendererManager
}

/**
 * @typedef {object} Theme an object of colours
 * 
 * @property {string} id
 * @property {string?} name
 * @property {boolean?} selected
 * 
 * @property {string?} primary
 * @property {string?} on_primary
 * @property {string?} primary_dark
 * @property {string?} on_primary_dark
 * @property {string?} secondary
 * @property {string?} on_secondary
 * @property {string?} secondary_dark
 * @property {string?} on_secondary_dark
 * @property {string?} shadows
 * @property {string?} error
 * @property {string?} on_error
 * @property {string?} warning
 * @property {string?} on_warning
 * @property {string?} background
 * @property {string?} edge
 * @property {string?} node_bg
 * @property {string?} node_bg_contrast
 * @property {string?} node_border
 * @property {string?} label_color
 * @property {string?} label_color_contrast
 * @property {string?} role
 * @property {string?} role_dark
 * @property {string?} attribute
 * @property {string?} attribute_dark
 * @property {string?} concept
 * @property {string?} concept_dark
 * @property {string?} individual
 * @property {string?} individual_dark
 */

const gscape = {
  // primary colors
  primary: r$1`#fff`,
  on_primary: r$1`#666`,
  primary_dark: r$1`#e6e6e6`,
  on_primary_dark: r$1`#888`,

  // secondary colors
  secondary: r$1`rgb(81,149,199)`,
  on_secondary: r$1`#fff`,
  secondary_dark: r$1`#2c6187`,
  on_secondary_dark: r$1`#fff`,

  // misc
  shadows: r$1`rgba(0,0,0,0.2)`,
  error: r$1`#cc3b3b`,
  on_error: r$1`#fff`,
  warning: r$1`#D39F0A`,
  on_warning: r$1`#fff`,

  // graph colors
  background: r$1`#fafafa`,
  edge: r$1`#000`,
  node_bg: r$1`#fcfcfc`,
  node_bg_contrast: r$1`#000`,
  node_border: r$1`#000`,
  label_color: r$1`#000`,
  label_color_contrast: r$1`#fcfcfc`,

  role: r$1`#AACDE1`,
  role_dark: r$1`#065A85`,

  attribute: r$1`#C7DAAD`,
  attribute_dark: r$1`#4B7900`,

  concept: r$1`#F9F3A6`,
  concept_dark: r$1`#B08D00`,

  individual: r$1`#d3b3ef`,
  individual_dark: r$1`#9875b7`,
};

const classic = {
  // primary colors
  primary: r$1`#fff`,
  on_primary: r$1`#666`,
  primary_dark: r$1`#e6e6e6`,
  on_primary_dark: r$1`#888`,

  // secondary colors
  secondary: r$1`rgb(81,149,199)`,
  on_secondary: r$1`#fff`,
  secondary_dark: r$1`#2c6187`,
  on_secondary_dark: r$1`#fff`,

  // misc
  shadows: r$1`rgba(0,0,0,0.2)`,
  error: r$1`#cc3b3b`,
  on_error: r$1`#fff`,

  background: r$1`#fafafa`,
  edge: r$1`#000`,
  node_bg: r$1`#fcfcfc`,
  node_bg_contrast: r$1`#000`,
  node_border: r$1`#000`,
  label_color: r$1`#000`,
  label_color_contrast: r$1`#fcfcfc`,
};

const dark_old = {
  primary: r$1`#333`,
  on_primary: r$1`#fff`,
  primary_dark: r$1`#1a1a1a`,
  on_primary_dark: r$1`#fff`,

  secondary: r$1`#99ddff`,
  on_secondary: r$1`#333`,
  secondary_dark: r$1`#0099e6`,
  on_secondary_dark: r$1`#fff`,

  shadows: r$1`rgba(255, 255, 255, 0.5)`,
  error: r$1`#cc3b3b`,
  on_error: r$1`#fff`,

  // graph colors
  background: r$1`#333`,
  edge: r$1`#fff`,
  node_bg: r$1`#333`,
  node_bg_contrast: r$1`#000`,
  node_border: r$1`#fcfcfc`,
  label_color: r$1`#fcfcfc`,

  role: r$1`#666`,
  role_dark: r$1`#065A85`,

  attribute: r$1`#666`,
  attribute_dark: r$1`#4B7900`,

  concept: r$1`#666`,
  concept_dark: r$1`#B08D00`,

  individual: r$1`#666`,
  individual_dark: r$1`#9875b7`,
};

const dark = {
  primary: r$1`#222831`,
  on_primary: r$1`#a0a0a0`,
  primary_dark: r$1`#1a1a1a`,
  on_primary_dark: r$1`#a0a0a0`,

  secondary: r$1`#72c1f5`,
  on_secondary: r$1`#222831`,
  secondary_dark: r$1`#0099e6`,
  on_secondary_dark: r$1`#a0a0a0`,

  shadows: r$1`rgba(255, 255, 255, 0.25)`,
  error: r$1`#cc3b3b`,
  on_error: r$1`#fff`,

  // graph colors
  background: r$1`#181c22`,
  edge: r$1`#a0a0a0`,
  node_bg: r$1`#a0a0a0`,
  node_bg_contrast: r$1`#010101`,
  node_border: r$1`#a0a0a0`,
  label_color: r$1`#a0a0a0`,

  role: r$1`#043954`,
  role_dark: r$1`#7fb3d2`,

  attribute_dark: r$1`#C7DAAD`,
  attribute: r$1`#4B7900`,

  concept_dark: r$1`#b28f00`,
  concept: r$1`#423500`,

  individual_dark: r$1`#9875b7`,
  individual: r$1`#422D53`,
};

var themes = /*#__PURE__*/Object.freeze({
  __proto__: null,
  gscape: gscape,
  classic: classic,
  dark_old: dark_old,
  dark: dark
});

class ThemesController {
  constructor() {
    /** @type {Object<string, import('./themes').Theme>} */
    this.themes = {};
    for (let themeKey in themes) {
      this.themes[themeKey] = ThemesController.getNormalizedTheme(themes[themeKey]);
    }

    this.actualThemeKey = ThemesController.DEFAULT;
  }

  static DEFAULT = 'gscape'

  /**
   * 
   * @param {Theme} new_theme 
   * @param {string} key_value 
   */
  addTheme(new_theme, key_value) {
    this.themes[key_value] = JSON.parse(JSON.stringify(gscape));

    // each new custom colour will overwrite the default one
    Object.keys(new_theme).forEach(color => {
      if (this.themes[key_value][color]) {
        this.themes[key_value][color] = new_theme[color];
      }
    });
  }

  /**
   * 
   * @param {string} themeKey 
   * @returns {Theme}
   */
  getTheme(themeKey) {
    return this.themes[themeKey] ? ThemesController.getNormalizedTheme(this.themes[themeKey]) : undefined
  }

  /** @returns {Theme} */
  static getNormalizedTheme(theme) {
    let theme_aux = {};

    Object.keys(theme).map(key => {
      // normalize theme using plain strings
      let color = typeof theme[key] == 'string' ? theme[key] : theme[key].cssText;

      theme_aux[key] = color;
    });

    return theme_aux
  }

  set actualTheme(themeKey) { this.actualThemeKey = themeKey; }
  get actualTheme() { return this.getTheme(this.actualThemeKey) }
}

/** @typedef {import('cytoscape').CollectionReturnValue} CollectionReturnValue */
// functions to transform Objects from Model to plain JSON for the views

/**
 * 
 * @param {CollectionReturnValue} cyEntity 
 * @returns {object} Entity for view
 */
function entityModelToViewData(cyEntity) {
  let entity = cyToGrapholElem(cyEntity);

  let entityViewData = {
    id : entity.data.id,
    id_xml : entity.data.id_xml,
    diagram_id : entity.data.diagram_id,
    displayed_name : entity.data.displayed_name,
    type : entity.data.type,
    iri : entity.data.iri,
    annotations : entity.data.annotations,
    functional : entity.data.functional,
    inverseFunctional : entity.data.inverseFunctional,
    asymmetric : entity.data.asymmetric,
    irreflexive : entity.data.irreflexive,
    reflexive : entity.data.reflexive,
    symmetric : entity.data.symmetric,
    transitive : entity.data.transitive,
  };

  return JSON.parse(JSON.stringify(entityViewData))
}

/**
 * 
 * @param {Diagram} diagramModelData 
 * @returns {object} digram for view
 */
function diagramModelToViewData(diagramModelData) {
  let diagramViewData =  {
    name : diagramModelData.name,
    id : diagramModelData.id,
    nodes : diagramModelData.nodes,
    edges : diagramModelData.edges,
  };

  return JSON.parse(JSON.stringify(diagramViewData))
}

/**
 * 
 * @param {Ontology} ontologyModelData 
 * @returns {object} ontology for view
 */
function ontologyModelToViewData(ontologyModelData) {
  let ontologyViewData = {
    name : ontologyModelData.name,
    version : ontologyModelData.version,
    namespaces : ontologyModelData.namespaces,
    annotations : ontologyModelData.annotations,
    description : ontologyModelData.description
  };
  return JSON.parse(JSON.stringify(ontologyViewData))
}

function rendererModelToViewData(rendererModelData) {
  let rendererViewData = {
    label : rendererModelData.label,
  };
  return JSON.parse(JSON.stringify(rendererViewData))
}

/**
 * 
 * @param {CollectionReturnValue} cytoscapeObj 
 * @returns {import('../model/ontology').GrapholElem}
 */
function cyToGrapholElem(cytoscapeObj) {
  return cytoscapeObj?.json()
}

// TO DO: export everything and import in parser.js

// Funzioni che ritornano il primo figlio o il fratello successivo di un dato nodo
// Ignorano quindi tutti gli elementi di tipo diverso da 1
// cioè gli attributi, gli spazi vuoti ecc...
function getFirstChild(node) {
  if (node == null || node.firstChild == null) { return null }

  node = node.firstChild;

  if (node.nodeType !== 1) { node = getNextSibling(node); }

  return node
}

function getNextSibling(node) {
  if (node == null || node.nextSibling == null) { return null }

  node = node.nextSibling;
  while (node.nodeType !== 1) {
    if (node.nextSibling == null) { return null }

    node = node.nextSibling;
  }

  return node
}

function isPredicate(node) {
  switch (node.getAttribute('type')) {
    case 'concept':
    case 'attribute':
    case 'role':
    case 'individual':
      return true
  }

  return false
}

// Date le posizioni di source, target e del breakpoint,
// la funzione calcola i due parametri peso e distanza del breakpoint e li restituisce
function getDistanceWeight(target, source, point) {
  // Esprimiamo le coordinate di point traslando l'origine sul source:
  // point['0'] corrisponde alla coordinata x del punto, point['1'] è l'ordinata
  var breakpoint = [];
  breakpoint['x'] = point['x'] - source['x'];
  breakpoint['y'] = point['y'] - source['y'];

  var delta = [];
  delta['x'] = target['x'] - source['x'];
  delta['y'] = target['y'] - source['y'];

  var intersectpoint = [];
  var angolar_coeff;

  // Se delta['x'] è nullo : source e target sono sulla stessa ascissa
  // la retta che li congiunge è verticale e pertanto non esprimibile come y = mx + q
  // Sappiamo però automaticamente che la retta perpendicolare è del tipo y = c
  // quindi l'intersect point avrà X = 0 e Y = breakpoint['y']
  if (delta['x'] == 0) {
    intersectpoint['x'] = 0;
    intersectpoint['y'] = breakpoint['y'];
  } else if (delta['y'] == 0) {
    intersectpoint['x'] = breakpoint['x'];
    intersectpoint['y'] = 0;
    angolar_coeff = 0;
  } else {
    angolar_coeff = delta['y'] / delta['x'];

    // quindi prendendo il source come origine, la retta che unisce source e target è data da:
    // R: y = angolar_coeff * x

    // La retta che interseca perpendicolarmente R e che passa per point è data da :
    // T: y = - x / angolar_coeff + quote

    // dobbiamo calcolare quote imponendo che point faccia parte della retta T, quindi calcoliamo:
    // quote = breakpoint_y + (breakpoint_x/angolar_coeff)

    var quote = breakpoint['y'] + (breakpoint['x'] / angolar_coeff);

    // Adesso mettiamo a sistema le due rette T ed R (che sono perpendicolari) e risolvendo il sistema
    // otteniamo che il punto di intersezione tra le due ha le coordinate:
    // intersectpoint_x = (quote * angolar_coeff) / ((angolar_coeff ^ 2) + 1)
    // intersectpoint_y = intersectpoint_x * angolar_coeff

    intersectpoint['x'] = (quote * angolar_coeff) / (Math.pow(angolar_coeff, 2) + 1);
    intersectpoint['y'] = intersectpoint['x'] * angolar_coeff;
  }

  // Adesso calcoliamo la distanza tra source e target
  var dist_source_target = Math.sqrt(Math.pow(delta['x'], 2) + Math.pow(delta['y'], 2));

  // Adesso calcoliamo la distanza tra interscetpoint e source
  // NOTA: le coordinate di intersectpoint sono calcolate traslando l'origine sul source, quindi usando il teorema di pitagora non sottraiamo le coordinate di source perchè sono nulle in questo sistema di riferimento
  // NOTA 2: la distanza che otteniamo è un valore assoluto, è quindi indipendente dal sistema di riferimento e possiamo usarla direttamente per calcolare il peso
  var dist_inter_source = Math.sqrt(Math.pow(intersectpoint['x'], 2) + Math.pow(intersectpoint['y'], 2));

  // Il peso lo calcolo come percentuale dividendo la distanza dell'intersectpoint dal source per la distanza tra source e target
  var point_weight = dist_inter_source / dist_source_target;

  // Dobbiamo stabilire se il peso è positivo o negativo
  // Se la X dell' intersectpoint è compresta tra quella del source e quella del target, allora il peso è positivo

  // se la X del target è maggiore della X del source e la X dell'intersectpoint è minore di quella del source, allora il peso è negativo
  if (delta['x'] > 0 && intersectpoint['x'] < 0) { point_weight = -point_weight; }

  if (delta['x'] < 0 && intersectpoint['x'] > 0) { point_weight = -point_weight; }

  // Calcolo la distanza tra point e intersectpoint (sono entrambi espressi rispetto a source, ma per la distanza non ci interessa)
  var point_distance = Math.sqrt(Math.pow(intersectpoint['x'] - breakpoint['x'], 2) + Math.pow(intersectpoint['y'] - breakpoint['y'], 2));

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
  if (delta['x'] < 0 && breakpoint['y'] > angolar_coeff * breakpoint['x']) { point_distance = -point_distance; }

  // Target con X positiva => il breakpoint si trova a sinistra dela
  // retta quando si trova al di sopra della retta
  if (delta['x'] > 0 && breakpoint['y'] < angolar_coeff * breakpoint['x']) { point_distance = -point_distance; }

  // SOURCE CON STESSA X DEL TARGET
  // se il target ha una Y maggiore del source (deltaY>0),
  // allora sto guardando verso il basso, quindi il punto sarà a
  // sinistra quando la sua X sarà positiva
  if (delta['x'] == 0 && delta['y'] > 0 && breakpoint['x'] > 0) { point_distance = -point_distance; }
  // Se invece guardo verso l'alto (target con Y<0), allora il nodo è a
  // sinistra della retta quando ha la X negativa
  if (delta['x'] == 0 && delta['y'] < 0 && breakpoint['x'] < 0) { point_distance = -point_distance; }

  return [point_distance, point_weight]
}

// Funzione che decide se spostare un endpoint sul bordo del nodo (source o target) o meno

// Facciamo quest'operazione per tutti gli archi che presentano degli endpoint
// non al centro del nodo (source o target), in questi casi le
// opzioni sono 2:
//   1: l'arco parte (o arriva) in diagonale, in questo caso l'endpoint lo lasciamo al centro del nodo
//   2: l'arco arriva perpendicolarmente al bordo del nodo (source o target), in questo caso
//      vediamo se il breakpoint successivo (o precedente nel caso del target), ha la stessa X o la stessa Y
//      del nodo in questione.
//      Valutando poi la coordinata che non risulta uguale a quella del nodo, spostiamo l'endpoint sul bordo del
//      nodo in direzione del breakpoint successivo (o precedente).

// Se lasciassimo intatti gli endpoint non centrati, cytoscape farebbe entrare la freccia nel nodo,
// Traslando sul bordo l'endpoint in direzione del breakpoint successivo (nel caso di source) o precedente
// (nel caso di target), cytoscape farà corrispondere la punta della freccia sul bordo del nodo e
// sarà quindi visibile
function getNewEndpoint(end_point, node, break_point) {
  // Calcoliamo le coordinate relative al nodo source (o target)
  var endpoint = {};
  endpoint.x = end_point.x - node.position('x');
  endpoint.y = end_point.y - node.position('y');

  if (endpoint.x == 0 && endpoint.y == 0)
    return endpoint

  var breakpoint = {};
  breakpoint.x = break_point['x'] - node.position('x');
  breakpoint.y = break_point['y'] - node.position('y');

  // Se l'endpoint non è centrato nel nodo ma ha la X uguale al breakpoint successivo (o precedente)
  // Allora l'arco parte (o arriva) perpendicolarmente dall'alto o dal basso

  if (endpoint.x == breakpoint.x) {
    // Se il breakpoint si trova più in basso (Ricorda: asse Y al contrario in cytoscape!),
    // allora spostiamo sul bordo inferiore l'endpoint
    if (breakpoint.y > 0) {
      endpoint.y = node.data('height') / 2;
      return endpoint
    }
    // Se invece il breakpoint è più in alto del nodo, allora spostiamo l'endpoint sul bordo superiore
    else if (breakpoint.y < 0) {
      endpoint.y = -node.data('height') / 2;
      return endpoint
    }
  }
  // Se invece ad essere uguale è la Y, l'arco arriva da destra o da sinistra, facciamo gli stessi passaggi appena fatti
  else if (endpoint.y == breakpoint.y) {
    if (breakpoint.x > 0) {
      endpoint.x = node.data('width') / 2;
      return endpoint
    } else if (breakpoint.x < 0) {
      endpoint.x = -node.data('width') / 2;
      return endpoint
    }
  }
  return endpoint
}

function getPointOnEdge(point1, point2) {
  const m = (point1.y - point2.y) / (point1.x - point2.x);
  const result = { x: 0, y: 0 };
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

  return result
}

/** @param {Ontology} ontology */
function computeSimplifiedOntologies(ontology) {
  let aux_renderer = new GrapholscapeRenderer(null);
  let lite_ontology = new Ontology(ontology.name, ontology.version, ontology.namespaces);
  let float_ontology = new Ontology(ontology.name, ontology.version, ontology.namespaces);
  let new_ontologies = {
    lite : lite_ontology,
    float : float_ontology,
  };

  return new Promise( (resolve, reject) => {
    try {
      window.setTimeout(() => {
        ontology.diagrams.forEach( diagram => {
          let lite_diagram = new Diagram(diagram.name, diagram.id);
          let float_diagram = new Diagram(diagram.name, diagram.id);
          lite_diagram.addElems(simplifyDiagramLite(diagram.nodes, diagram.edges));
          lite_ontology.addDiagram(lite_diagram);
          float_diagram.addElems(simplifyDiagramFloat(lite_diagram.nodes, lite_diagram.edges));
          float_ontology.addDiagram(float_diagram);
        });
        resolve(new_ontologies);
      }, 1);
    } catch (e) {reject(e);}
  })



// ----------------------------------
  function simplifyDiagramLite(nodes, edges) {
    let cy = cytoscape();

    cy.add(nodes);
    cy.add(edges);

    filterByCriterion(cy, (node) => {
      switch(node.data('type')) {
        case 'complement' :
        case 'value-domain':
        case 'role-chain':
        case 'enumeration':
          return true

        case 'domain-restriction':
        case 'range-restriction':
          if (node.data('displayed_name') == 'forall')
            return true
          else
            return false
      }
    });

    filterByCriterion(cy, isQualifiedRestriction);
    filterByCriterion(cy, isExistentialWithCardinality);
    filterByCriterion(cy, inputEdgesBetweenRestrictions);
    cy.remove('.filtered');
    simplifyDomainAndRange(cy);
    simplifyComplexHierarchies(cy);
    simplifyUnions(cy);
    simplifyIntersections(cy);
    simplifyRoleInverse(cy);

    return cy.$('*')
  }

  function simplifyDomainAndRange(cy) {
    let eles = cy.$('*');

    // select domain and range restrictions
    // type start with 'domain' or 'range'
    let selector = `[type ^= "domain"],[type ^= "range"]`;
    eles.filter(selector).forEach(restriction => {
      let input_edge = getInputEdgeFromPropertyToRestriction(restriction);
      let new_edge = null;
      let type = restriction.data('type') == 'domain-restriction' ? 'domain' : 'range';

      restriction.connectedEdges('[type != "input"]').forEach((edgeToRestriction, i) => {
        new_edge = createRoleEdge(edgeToRestriction, input_edge, type, i);
        if(new_edge) {
          cy.add(new_edge);
          cy.remove(edgeToRestriction);
        }
      });
      aux_renderer.filterElem(restriction, '', cy);
      cy.remove('.filtered');
    });

    cy.remove('.filtered');

    function getInputEdgeFromPropertyToRestriction(restriction_node) {
      let e = null;
      restriction_node.incomers('[type = "input"]').forEach(edge => {
        if (edge.source().data('type') == 'role' || edge.source().data('type') == 'attribute') {
          e = edge;
        }
      });

      return e
    }

    function createRoleEdge(edgeToRestriction, edgeFromProperty, type, i) {
      let edges = [];
      let new_edge = null;

      /**
       * if the actual edge is between two existential, remove it and filter the other existential
       */
      if ((edgeToRestriction.source().data('type') == 'domain-restriction' ||
           edgeToRestriction.source().data('type') == 'range-restriction') &&
          (edgeToRestriction.target().data('type') == 'domain-restriction' ||
           edgeToRestriction.target().data('type') == 'range-restriction')) {
        cy.remove(edgeToRestriction);
        return new_edge
      }

      if (edgeToRestriction.target().data('id') !== edgeFromProperty.target().data('id')) {
        edges.push(reverseEdge(edgeToRestriction));
      } else {
        edges.push(edgeToRestriction.json());
      }

      // move attribute on restriction node position
      if (edgeFromProperty.source().data('type') == "attribute") {
        edgeFromProperty.source().position(edgeFromProperty.target().position());
        new_edge = edges[0];
        new_edge.data.target = edgeFromProperty.source().id();
        new_edge.data.id += '_'+i;
      } else {
        // concatenation only if the input is not an attribute
        edges.push(reverseEdge(edgeFromProperty));
        new_edge = createConcatenatedEdge(edges, cy, edges[0].data.id+'_'+i);
      }

      // add the type of input to the restriction as a class of the new edge
      // role or attribute, used in the stylesheet to assign different colors
      new_edge.classes += `${edgeFromProperty.source().data('type')} ${type}`;
      new_edge.data.type = 'default';

      return new_edge
    }
  }

  function reverseEdge(edge) {
    let new_edge = edge.json();
    let source_aux = edge.source().id();
    new_edge.data.source = edge.target().id();
    new_edge.data.target = source_aux;

    let endpoint_aux = edge.data('source_endpoint');
    new_edge.data.source_endpoint = edge.data('target_endpoint');
    new_edge.data.target_endpoint = endpoint_aux;

    new_edge.data.breakpoints = edge.data('breakpoints').reverse();
    if (edge.data('segment_distances')) {
      new_edge.data.segment_distances = [];
      new_edge.data.segment_weights = [];
      new_edge.data.breakpoints.forEach( breakpoint => {
        let aux = getDistanceWeight(edge.source().position(), edge.target().position(), breakpoint);
        new_edge.data.segment_distances.push(aux[0]);
        new_edge.data.segment_weights.push(aux[1]);
      });
    }

    return new_edge
  }

  /**
   * @param {array} edges - array of edges in json format
   * @param {cytoscape} cy
   * @param {string} id - the id to assign to the new edge
   */
  function createConcatenatedEdge(edges, cy, id) {
    let source = edges[0].data.source;
    let target = edges[edges.length - 1].data.target;
    let segment_distances = [];
    let segment_weights = [];
    let breakpoints = [];
    let aux = undefined;

    edges.forEach( (edge, i, array) => {
      if (edge.data.breakpoints) {
        breakpoints = breakpoints.concat(edge.data.breakpoints);
        edge.data.breakpoints.forEach(breakpoint => {
          aux = getDistanceWeight(cy.getElementById(target).position(), cy.getElementById(source).position(), breakpoint);

          segment_distances.push(aux[0]);
          segment_weights.push(aux[1]);
        });
      }

      // add target position as new breakpoint
      if ( i < array.length - 1 ) {
        aux = getDistanceWeight(cy.getElementById(target).position(),
                                    cy.getElementById(source).position(),
                                    cy.getElementById(edge.data.target).position());
        segment_distances.push(aux[0]);
        segment_weights.push(aux[1]);
        breakpoints.push(cy.getElementById(edge.data.target).position());
      }
    });

    let new_edge = edges[0];
    new_edge.data.id = id;
    new_edge.data.source = source;
    new_edge.data.target = target;
    new_edge.data.target_endpoint = edges[edges.length-1].data.target_endpoint;
    new_edge.data.type = 'inclusion';
    new_edge.data.segment_distances = segment_distances;
    new_edge.data.segment_weights = segment_weights;
    new_edge.data.breakpoints = breakpoints;

    return new_edge
  }

  // filter nodes if the criterion function return true
  // criterion must be a function returning a boolean value for a given a node
  function filterByCriterion(cy_instance, criterion) {
    let cy = cy_instance;
    cy.$('*').forEach(node => {
      if (criterion(node)) {
        aux_renderer.filterElem(node, '', cy);
      }
    });
  }

  function isQualifiedRestriction(node) {
    if ((node.data('type') == 'domain-restriction' || node.data('type') == 'range-restriction')
        && (node.data('displayed_name') == 'exists')) {
      return node.incomers('edge[type = "input"]').size() > 1 ? true : false
    }

    return false
  }

  function inputEdgesBetweenRestrictions(node) {
    let outcome = false;

    if ((node.data('type') == 'domain-restriction' || node.data('type') == 'range-restriction')) {
      node.incomers('edge[type = "input"]').forEach(edge => {
        if (edge.source().data('type').endsWith('restriction')){
          outcome = true;
        }
      });
    }
    return outcome
  }

  function isExistentialWithCardinality(node) {
    if ((node.data('type') == 'domain-restriction' || node.data('type') == 'range-restriction')
        && node.data('displayed_name').search(/[0-9]/g) >= 0) {
      return true
    }

    return false
  }

  function isComplexHierarchy(node) {
    if (node.data('type') != 'union' &&
        node.data('type') != 'disjoint-union' &&
        node.data('type') != 'intersection')
      return false

    let outcome = false;
    node.incomers('[type *= "input"]').forEach(input => {
      if (input.source().data('type') != 'concept') {
        outcome = true;
      }
    });

    return outcome
  }

  function simplifyUnions(cy) {
    let eles = cy.$('*');

    eles.filter('[type $= "union"]').forEach( union => {
      makeDummyPoint(union);

      union.incomers('edge[type = "input"]').data('type', 'easy_input');
      cy.remove(union.incomers('edge[type = "inclusion"]'));

      // process equivalence edges
      union.connectedEdges('edge[type = "equivalence"]').forEach(edge => {
        edge.data('type','inclusion');
        edge.data('target_label', 'C');

        if (edge.source().id() != union.id()) {
          let reversed_edge =  reverseEdge(edge);
          cy.remove(edge);
          cy.add(reversed_edge);
        }
      });

      // process inclusion edges
      union.outgoers('edge[type = "inclusion"]').forEach(inclusion => {
        inclusion.addClass('hierarchy');
        if (union.data('type') == 'disjoint-union')
          inclusion.addClass('disjoint');
      });

      if (union.data('label'))
        union.data('label', '');

      replicateAttributes(union);

      // replicate role tipization on input classes
      replicateRoleTypizations(union);

      // if the union has not any connected non-input edges, then remove it
      if (union.connectedEdges('[type !*= "input"]').size() == 0)
        cy.remove(union);
    });
  }

  function makeDummyPoint(node) {
    node.data('width', 0.1);
    node.data('height', 0.1);
    node.addClass('dummy');
  }

  function simplifyIntersections(cytoscape_instance) {
    let cy = cytoscape_instance;

    cy.$('node[type = "intersection"]').forEach( and => {
      replicateAttributes(and);
      replicateRoleTypizations(and);

      // if there are no incoming inclusions or equivalence and no equivalences connected,
      // remove the intersection
      if (and.incomers('edge[type !*= "input"]').size() == 0 &&
          and.connectedEdges('edge[type = "equivalence"]').size() == 0) {
         aux_renderer.filterElem(and, '', cy);
      } else {
        // process incoming inclusion
        and.incomers('edge[type !*= "input"]').forEach(edge => {
          /**
           * create a new ISA edge for each input class
           * the new edge will be a concatenation:
           *  - ISA towards the 'and' node + input edge
           *
           * the input edge must be reversed
           * In case of equivalence edge, we only consider the
           * isa towards the 'and' node and discard the other direction
           */
          and.incomers('edge[type = "input"]').forEach( (input, i) => {
            /**
             * if the edge is an equivalence, we must consider it as an
             * incoming edge in any case and ignore the opposite direction.
             * so if the edge is outgoing from the intersection, we reverse it
             */
            let edges = [];
            if (edge.source().id() == and.id()) {
              edges.push( reverseEdge(edge));
            } else edges.push(edge.json());

            let new_id = `${edge.id()}_${i}`;
            edges.push( reverseEdge(input));
            let new_isa = createConcatenatedEdge(edges, cy, new_id);

            cy.remove(edge);
            cy.add(new_isa);
          });
        });

        cy.remove(and);
      }
    });
  }

  function replicateRoleTypizations(constructor) {
    let cy = constructor.cy();
    // replicate role tipization on input classes
    constructor.connectedEdges('edge.role').forEach(role_edge => {
      constructor.incomers('[type *= "input"]').forEach( (input,i) => {
        let new_id = `${role_edge.id()}_${i}`;
        let new_edge = {};
        let edges = [];
        /**
         * if the connected non input edge is only one (the one we are processing)
         * then the new edge will be the concatenation of the input edge + role edge
         */
        if(constructor.connectedEdges('[type !*= "input"]').size() <= 1) {
          edges.push(input.json());
          edges.push(role_edge.json());
          new_edge = createConcatenatedEdge(edges, cy, new_id);
          new_edge.data.type = 'default';
          new_edge.classes = role_edge.json().classes;
        } else {
          /**
           * Otherwise the constructor node will not be deleted and the new role edges can't
           * pass over the constructor node. We then just properly change the source/target
           * of the role edge. In this way the resulting edges will go from the last
           * breakpoint of the original role edge towards the input classes of the constructor
          */
          new_edge = role_edge.json();
          new_edge.data.id = new_id;

          let target = undefined;
          let source = undefined;
          target = role_edge.target();
          source = input.source();
          new_edge.data.source = input.source().id();

          // Keep the original role edge breakpoints
          let segment_distances = [];
          let segment_weights = [];
          new_edge.data.breakpoints.forEach( breakpoint => {
            let aux = getDistanceWeight(target.position(), source.position(), breakpoint);
            segment_distances.push(aux[0]);
            segment_weights.push(aux[1]);
          });

          new_edge.data.segment_distances = segment_distances;
          new_edge.data.segment_weights = segment_weights;
        }
        cy.add(new_edge);
      });

      cy.remove(role_edge);
    });
  }

  function simplifyComplexHierarchies(cytoscape_instance) {
    let cy = cytoscape_instance;

    cy.nodes('[type = "intersection"],[type = "union"],[type = "disjoint-union"]').forEach(node => {
      if(isComplexHierarchy(node)) {
        replicateAttributes(node);
        aux_renderer.filterElem(node, '', cy);
      }
    });

    cy.remove('.filtered');
  }

  function replicateAttributes(node) {
    let cy = node.cy();
    let all_classes = getAllInputs(node);
    let all_attributes = node.neighborhood('[type = "attribute"]');
    let all_inclusion_attributes = cy.collection();

    all_classes.forEach( (concept,i) => {
      all_attributes.forEach((attribute, j) => {
        addAttribute(concept, i, attribute, 'attribute');
      });
    });

    cy.remove(all_attributes);
    aux_renderer.filterElem(all_inclusion_attributes, '', cy);

    function addAttribute(target, i, attribute, edge_classes) {
      let new_attribute = attribute.json();
      new_attribute.position = target.position();
      new_attribute.data.id += '_'+i+'_'+target.id();
      new_attribute.classes += ' repositioned';
      //attribute.addClass('repositioned')
      cy.add(new_attribute);
      let edge = {
        data: {
          id: new_attribute.data.id + '_edge',
          target: new_attribute.data.id,
          source: target.id(),
        },
        classes: edge_classes,
      };
      cy.add(edge);

      // recursively add new attributes connected to replicated attributes by inclusions
      if (!target.hasClass('repositioned')) {
        attribute.neighborhood('[type = "attribute"]').forEach( (inclusion_attribute, j) => {
          if(all_attributes.contains(inclusion_attribute)) {
            return
          }

          addAttribute(cy.$id(new_attribute.data.id), j, inclusion_attribute, 'inclusion');
          all_inclusion_attributes = all_inclusion_attributes.union(inclusion_attribute);
        });
      }
    }

    function getAllInputs(node) {
      let all_classes = node.cy().collection();

      let input_edges = node.incomers('edge[type *= "input"]');
      all_classes = all_classes.union(input_edges.sources('[type = "concept"]'));

      input_edges.sources('[type != "concept"]').forEach(constructor => {
        all_classes = all_classes.union(getAllInputs(constructor));
        constructor.addClass('attr_replicated');
      });

      return all_classes
    }
  }

  function simplifyRoleInverse(cytoscape_instance) {
    let cy = cytoscape_instance;

    cy.nodes('[type = "role-inverse"]').forEach(role_inverse => {
      let new_edges_count = 0;
      // the input role is only one
      let input_edge = role_inverse.incomers('[type *= "input"]');

      // for each other edge connected, create a concatenated edge
      // the edge is directed towards the input_role
      role_inverse.connectedEdges('[type !*= "input"]').forEach((edge, i) => {
        let edges = [];
        // if the edge is outgoing from the role-inverse node, then we need to reverse it
        if (edge.source().id() == role_inverse.id()) {
          edges.push( reverseEdge(edge));
        } else {
          edges.push(edge.json());
        }

        // the input edge must always be reversed
        edges.push( reverseEdge(input_edge));
        let new_id = input_edge.id() + '_' + i;
        let new_edge = createConcatenatedEdge(edges, cy, new_id);
        new_edge.data.type = 'inclusion';
        new_edge.classes = 'inverse-of';
        cy.add(new_edge);
        cy.remove(edge);
        new_edges_count += 1;
      });

      if (new_edges_count > 1) {
        cy.remove(input_edge);
        makeDummyPoint(role_inverse);
        role_inverse.data('label', 'inverse Of');
        role_inverse.data('labelXpos', 0);
        role_inverse.data('labelYpos', 0);
        role_inverse.data('text_background', true);
      } else {
        if (input_edge.source())
          input_edge.source().connectedEdges('edge.inverse-of').data('displayed_name','inverse Of');
        cy.remove(role_inverse);
      }
    });
  }

  // -------- FLOAT ----------
  function simplifyDiagramFloat(nodes, edges) {
    let cy = cytoscape();
    cy.add(nodes);
    cy.add(edges);
    // remember original positions
    cy.$('node').forEach( node => {
      node.data('original-position', JSON.stringify(node.position()));
    });

    filterByCriterion(cy, node => node.data('type') === 'has-key');
    simplifyRolesFloat(cy);
    simplifyHierarchiesFloat(cy);
    simplifyAttributesFloat(cy);
    cy.edges().removeData('segment_distances');
    cy.edges().removeData('segment_weights');
    cy.edges().removeData('target_endpoint');
    cy.edges().removeData('source_endpoint');
    cy.$('[type = "concept"]').addClass('bubble');
    return cy.$('*')
  }

  function simplifyRolesFloat(cy) {
    let eles = cy.$('[type = "role"]');

    eles.forEach(role => {
      let edges = role.incomers('edge.role');
      let domains = edges.filter('.domain');
      let range_nodes = edges.filter('.range').sources();

      domains.forEach(domain => {
        range_nodes.forEach((target,i) => {

          let new_edge = {
            data : {
              id : domain.id() + '-' + i,
              id_xml : domain.target().data('id_xml'),
              diagram_id : domain.target().data('diagram_id'),
              source : domain.source().id(),
              target : target.id(),
              type : domain.target().data('type'),
              iri : domain.target().data('iri'),
              displayed_name : domain.target().data('displayed_name'),
              annotations : domain.target().data('annotations'),
              description : domain.target().data('description'),
              functional : domain.target().data('functional'),
              inverseFunctional : domain.target().data('inverseFunctional'),
              asymmetric : domain.target().data('asymmetric'),
              irreflexive : domain.target().data('irreflexive'),
              reflexive : domain.target().data('reflexive'),
              symmetric : domain.target().data('symmetric'),
              transitive : domain.target().data('transitive')
            },
            classes : 'role predicate'
          };

          cy.add(new_edge);
          if(cy.getElementById(new_edge.data.id).isLoop()) {
            let loop_edge = cy.getElementById(new_edge.data.id);
            loop_edge.data('control_point_step_size', target.data('width'));
          }
        });
      });
      cy.remove(role);
    });
  }

  function simplifyHierarchiesFloat(cy) {
    cy.$('.dummy').forEach(dummy => {
      dummy.neighborhood('node').forEach(neighbor => {
        neighbor.position(dummy.position());
      });
      dummy.data('width', 35);
      dummy.addClass('bubble');
    });
  }

  function simplifyAttributesFloat(cy) {
    cy.$('[type = "attribute"]').forEach(attribute => {
      attribute.neighborhood('node').forEach(neighbor => {
        attribute.position(neighbor.position());
      });
    });
  }
}

/** @typedef {import('cytoscape').CollectionReturnValue} CollectionReturnValue */

class Grapholscape {
  /**
   * Create a core object of Grapholscape
   * @param {!Ontology} ontology An Ontology object
   * @param {object} container DOM element in which grapholscape will render the ontology
   * @param {?object} customConfig JSON of custom default settings, check out 
   * [wiki/settings](https://github.com/obdasystems/grapholscape/wiki/Settings)
   */
  constructor(ontology, container, customConfig = null) {
    this.config = JSON.parse(JSON.stringify(defaultConfig)); //create copy

    this.themesController = new ThemesController();

    if (customConfig) this.setConfig(customConfig);

    if (customConfig?.renderers) {
      /** @type {import("./rendering/renderer-manager").default} */
      this.renderersManager = initRenderersManager(container, customConfig.renderers);
    } else {
      this.renderersManager = initRenderersManager(container, ['default', 'lite', 'float']);
    }

    // set language
    this.config.preferences.language.list = ontology.languages.list.map(lang => {
      return {
        "label": lang,
        "value": lang,
      }
    });

    this.defaultLanguage = ontology.languages.default;

    // if not selected in config, select the default one
    let selectedLanguage = this.config.preferences.language.selected;
    if (selectedLanguage == '')
      this.config.preferences.language.selected = this.defaultLanguage;
    else {
      // if language is not supported by ontology, add it in the list
      // only for consistency : user defined it so he wants to see it
      if (!ontology.languages.list.includes(selectedLanguage))
        this.config.preferences.language.list.push({
          "label": selectedLanguage + ' - unsupported',
          "value": selectedLanguage
        });
    }

    this._callbacksDiagramChange = [];
    this._callbacksEntitySelection = [];
    this._callbacksNodeSelection = [];
    this._callbacksBackgroundClick = [];
    this._callbacksEdgeSelection = [];
    this._callbacksFilterOn = [];
    this._callbacksFilterOff = [];
    this._callbacksRendererChange = [];
    this._callbacksWikiClick = [];
    this._callbacksThemeChange = [];
    this._callbacksEntityNameTypeChange = [];
    this._callbacksLanguageChange = [];

    this.renderersManager.onEdgeSelection(selectedEdge => this.handleEdgeSelection(selectedEdge));
    this.renderersManager.onNodeSelection(selectedNode => this.handleNodeSelection(selectedNode));
    this.renderersManager.onBackgroundClick(_ => this.handleBackgroundClick());

    this.ontologies = {
      default: ontology,
      lite: null,
      float: null
    };

    if (this.shouldSimplify) {
      this.SimplifiedOntologyPromise = computeSimplifiedOntologies(ontology)
        .then(result => {
          this.ontologies.lite = result.lite;
          this.ontologies.float = result.float;
        })
        .catch(reason => { console.error(reason); });
    }

    this.applyTheme(this.config.rendering.theme.selected);
    this.ZOOM_STEP_VALUE = 0.08;
  }

  /**
   * Register a new callback to be called on a entity selection
   * @param {entitySelectionCallbak} callback 
   */
  onEntitySelection(callback) { this._callbacksEntitySelection.push(callback); }

  /**
   * Register a new callback to be called on a node selection
   * @param {nodeSelectionCallbak} callback 
   */
  onNodeSelection(callback) { this._callbacksNodeSelection.push(callback); }

  /**
   * Function handling the selection of a node on a diagram [called by renderer]
   * @param {CollectionReturnValue} node 
   */
  handleNodeSelection(node) {
    if (cyToGrapholElem(node).classes.includes('predicate')) {
      this._callbacksEntitySelection.forEach(fn => fn(node));
    }

    this._callbacksNodeSelection.forEach(fn => fn(node));
  }

  /**
   * Register a new callback to be called on a edge selection
   * @param {edgeSelectionCallbak} callback 
   */
  onEdgeSelection(callback) { this._callbacksEdgeSelection.push(callback); }

  /**
   * Function handling the selection of an edge on a diagram [called by renderer]
   * @param {CollectionReturnValue} edge 
   */
  handleEdgeSelection(edge) {
    if (cyToGrapholElem(edge).classes.includes('predicate')) {
      this._callbacksEntitySelection.forEach(fn => fn(edge));
    }

    this._callbacksEdgeSelection.forEach(fn => fn(edge));
  }

  /**
   * Register a new callback to be called on a background click
   * @param {backgroundClickCallback} callback 
   */
  onBackgroundClick(callback) {
    this._callbacksBackgroundClick.push(callback);
  }

  handleBackgroundClick() { this._callbacksBackgroundClick.forEach(fn => fn()); }

  /**
   * Register a new callback to be called on a diagram change
   * @param {diagramChangeCallback} callback 
   */
  onDiagramChange(callback) { this._callbacksDiagramChange.push(callback); }

  /**
   * Display a diagram on the screen.
   * @param {Diagram | string | number} diagram The diagram retrieved from model, its name or it's id
   * @param {import("./rendering/renderer-manager").ViewportState} viewportState the viewPortState of the viewport,
   * if you don't pass it, viewport won't change unless it's the first time you draw such diagram. In this case
   * viewport will fit to diagram.
   */
  showDiagram(diagram, viewportState = null) {
    const showDiagram = () => {
      if (typeof diagram == 'string' || typeof diagram == 'number') {
        diagram = this.ontology.getDiagram(diagram);
      }

      if (!diagram) {
        console.warn('diagram not existing');
        return
      }

      const isFirstTimeRendering = diagram.hasEverBeenRendered;
      this.renderersManager.drawDiagram(diagram);
      if (viewportState)
        this.renderersManager.setViewport(viewportState);
      else if (!isFirstTimeRendering) {
        this.renderersManager.fit();
      }
      this.renderersManager.updateDisplayedNames(this.actualEntityNameType, this.languages);

      Object.keys(this.filterList).forEach(key => {
        let filter = this.filterList[key];
        if (filter.active) this.renderersManager.filter(filter);
      });

      // simulate selection on old selected entity, this updates UI too
      let entity = diagram.getSelectedEntity();
      if (entity) {
        let grapholEntity = cyToGrapholElem(entity);
        if (grapholEntity.data.diagram_id === this.actualDiagramID) {
          this._callbacksEntitySelection.forEach(fn => fn(entity));
          this.centerOnNode(grapholEntity.data.id);
        }
      }

      this._callbacksDiagramChange.forEach(fn => fn(diagram));
    };
    
    this.performActionInvolvingOntology(showDiagram);
  }

  /**
   * Select a single node and zoom on it.
   * If necessary it also display the diagram containing the node.
   * @param {number} nodeID - The node unique ID
   * @param {number?} zoom - The zoom level to apply (Default: 1.5)
   */
  centerOnNode(nodeID, zoom = 1.5) {
    const centerOnNode = () => {
      // get diagram id containing the node
      let elem = this.ontology.getElem(nodeID);
      if (!elem) {
        console.warn(`Could not find any element with id=${nodeID} in the actual ontology, try to change renderer`);
        return
      }
      let nodeDiagramID = cyToGrapholElem(this.ontology.getElem(nodeID)).data.diagram_id;
      if (this.actualDiagramID != nodeDiagramID) {
        this.showDiagram(nodeDiagramID);
        /**
         * hack in case of actual renderer is based on simplifications.
         * In that case, if we call centerOnNode on renderer immediately, it will be performed
         * before the new diagram has been drawn, this because showDiagram will wait for
         * the simplified ontology promise to be resolved. (showDiagram is async).
         * Calling again this same function will wait again for that promise to be
         * fulfilled and for sure the right diagram will be drawn.
         */
        if (this.shouldWaitSimplifyPromise) {
          this.centerOnNode(nodeID, zoom);
          return
        }
      }
      
      this.renderersManager.centerOnNode(nodeID, zoom);
    };

    this.performActionInvolvingOntology(centerOnNode);
  }

  /**
   * Register a new callback to be called on a renderer change
   * @param {rendererChangeCallback} callback 
   */
  onRendererChange(callback) {
    this._callbacksRendererChange.push(callback);
  }

  /**
   * Change the rendering mode.
   * @param {string} rendererKey - the rendering/simplifation mode to activate: `default`, `lite`, or `float`
   * @param {boolean} [keepViewportState=true] - if `false`, viewport will fit on diagram.
   * Set it `true` if you don't want the viewport state to change.
   * In case of no diagram displayed yet, it will be forced to `false`.
   * Default: `true`.
   * > Note: in case of activation or deactivation of the `float` mode, this value will be ignored.
   */
  setRenderer(rendererKey, keepViewportState = true) {
    const setRenderer = () => {
      let viewportState = keepViewportState ? this.renderersManager.actualViewportState : null;

      let selectedEntities = {};
      // get selected entity in each diagram
      this.ontology.diagrams.forEach(diagram => {
        if (diagram.getSelectedEntity())
          selectedEntities[diagram.id] = cyToGrapholElem(diagram.getSelectedEntity());
      });

      this.renderersManager.setRenderer(rendererKey);

      Object.keys(this.filterList).forEach(filterKey => {
        this.filterList[filterKey].disabled = this.renderer.disabledFilters.includes(filterKey);
      });

      this.showDiagram(this.actualDiagramID, viewportState);
      // for each selected entity in each diagram, select it again in the new renderer
      Object.keys(selectedEntities).forEach(diagramID => {
        this.selectEntityOccurrences(selectedEntities[diagramID].data.iri.fullIri, diagramID);
      });

      this._callbacksRendererChange.forEach(fn => fn(rendererKey));
    };

    let oldRendererKey = this.renderer.key;

    if (rendererKey === oldRendererKey) return
    // if we come or are going to float renderer then never keep the old viewport state
    keepViewportState = keepViewportState &&
      !(oldRendererKey == 'float' || rendererKey == 'float');

    this.performActionInvolvingOntology(setRenderer);
  }

  /**
   * Select an entity by its IRI and the diagram it belongs to.
   * If you don't specify a diagram, actual diagram will be used if it exists and if it contains
   * any occurrence of the specified entity IRI, otherwise the diagram of the first entity IRI
   * occurrence will be used.
   * @param {string} iri the IRI of the entity to select in full or prefixed form
   * @param {Diagram | number | string} [diagram] The diagram in which to select the IRI (can be
   * also the diagram id).
   */
  selectEntityOccurrences(iri, diagram) {
    const selectEntityOccurrences = () => {
      let diagramID = '';
      if (typeof (diagram) === 'object')
        diagramID = diagram.id;
      else
        diagramID = this.ontology.getDiagram(diagram)?.id;

      const iriOccurrences = this.ontology.getEntityOccurrences(iri);
      
      if (!iriOccurrences || iriOccurrences.length === 0) {
        console.warn(`Could not find any entity with "${iri}" as prefixed or full IRI`);
        return
      }

      if (!diagramID) {
        if (this.actualDiagramID && iriOccurrences.some( e => cyToGrapholElem(e).data.diagram_id === this.actualDiagramID)) {
          diagramID = this.actualDiagramID;
        } else {
          diagramID = cyToGrapholElem(iriOccurrences[0]).data.diagram_id;
        }
      }

      iriOccurrences.forEach(entity => {
        const grapholEntity = cyToGrapholElem(entity);
        if (grapholEntity.data.diagram_id === diagramID) {
          this.selectElem(grapholEntity.data.id, diagramID);
        }
      });
    };
    
    this.performActionInvolvingOntology(selectEntityOccurrences);
  }

  /**
   * Select a node or an edge given its unique id.
   * It does not change diagram nor viewport state.
   * If you want to select and focus viewport on a node,
   * you should use {@link centerOnNode}.
   * @param {string} id unique elem id (node or edge)
   * @param {number | string} [diagram] The diagram in which to select the IRI (can be also the diagram id)
   */
  selectElem(id, diagram) {
    const selectElem = () => {
      if (!diagram) {
        diagram = cyToGrapholElem(this.ontology.getElem(id)).data.diagram_id;
      }
      this.ontology.getDiagram(diagram)?.selectElem(id);
    };
    this.performActionInvolvingOntology(selectElem);
  }

  /**
   * Set viewport state.
   * @param {import('./rendering/renderer-manager').ViewportState} state - 
   * object representation of **rendered position** in 
   * [cytoscape format](https://js.cytoscape.org/#notation/position).
   *
   * > Example: { x: 0, y: 0, zoom: 1} - initial state
   */
  setViewport(state) {
    if (state) this.renderersManager.setViewport(state);
  }

  zoomIn(zoomValue = this.ZOOM_STEP_VALUE) { this.renderersManager.zoomIn(zoomValue); }
  zoomOut(zoomValue = this.ZOOM_STEP_VALUE) { this.renderersManager.zoomOut(zoomValue); }
  fit() { this.renderersManager.fit();}
  /**
   * Register a callback to be called on a filter activation
   * @param {filterCallback} callback 
   */
  onFilter(callback) { this._callbacksFilterOn.push(callback); }

  /**
   * Activate a predefined filter or execute a custom filter on a selector
   * @param {string | Filter} filterType The name of the predefined filter to execute
   * or a custom Filter obj
   */
  filter(filterType) {
    /** @type {Filter} */
    let filterObj = this.isDefinedFilter(filterType) ?
      this.filterList[filterType] : filterType;

    if (this.isDefinedFilter(filterType)) {
      this.filterList[filterType].active = true;
    }
  
    this.renderersManager.filter(filterObj);
    filterObj['key'] = Object.keys(this.filterList).find(key => this.filterList[key] === filterObj);
    this._callbacksFilterOn.forEach(fn => fn(filterObj));
  }

  isDefinedFilter(filterType) {
    return this.filterList[filterType] ? true : false
  }
  
  /** @param {filterCallback} callback */
  onUnfilter(callback) { this._callbacksFilterOff.push(callback); }

  /**
   * deactivate a predefined filter or execute a custom filter on a selector
   * @param {string | Filter} filterType The name of the predefined filter to execute
   * or a custom Filter obj
   */
  unfilter(filterType) {
    /** @type {Filter} */
    let filterObj = this.isDefinedFilter(filterType) ?
      this.filterList[filterType] : filterType;

    if (this.isDefinedFilter(filterType)) 
      this.filterList[filterType].active = false;

    this.renderersManager.unfilter(filterObj);

    this._callbacksFilterOff.forEach(fn => fn(filterObj));
  }

  /** @param {themeChangeCallback} callback */
  onThemeChange(callback) { this._callbacksThemeChange.push(callback); }

  /**
   * Apply an existing theme or pass a new custom theme that will be added and then applied
   * Please read more about [themes](https://github.com/obdasystems/grapholscape/wiki/Themes)
   * @param {string | import('./style/themes').Theme } themeKey a predefined theme key or a custom Theme object
   * @tutorial Themes
   */
  applyTheme(themeKey) {
    if (themeKey === this.themesController.actualTheme) return

    let normalizedTheme = this.themesController.getTheme(themeKey);
    if (!normalizedTheme) { // if it's not defined then maybe it's a custom theme
      try {
        this.addTheme(themeKey); // addTheme returns the key of the new added theme
      } catch (e) {
        console.error('The specified theme is not a valid theme, please read: https://github.com/obdasystems/grapholscape/wiki/Themes');
        console.error(e);
        return
      }
      normalizedTheme = this.themesController.getTheme(themeKey.id);
      if(!normalizedTheme) return
      themeKey = themeKey.id;
    }

    this.container.style.background = normalizedTheme.background; // prevent black background on fullscreen

    // set custom properties on container so the gui widgets can use these new colours
    let prefix = '--theme-gscape-';
    Object.keys(normalizedTheme).forEach(key => {
      let css_key = prefix + key.replace(/_/g, '-');
      this.container.style.setProperty(css_key, normalizedTheme[key]);
    });

    this.config.rendering.theme.selected = themeKey;
    this.renderersManager.setTheme(normalizedTheme); // set graph style based on new theme
    this.themesController.actualTheme = themeKey;
    storeConfigEntry('theme', themeKey);
    this._callbacksThemeChange.forEach(fn => fn(normalizedTheme, themeKey));
  }

  /**
   * Register a new theme
   * @param {import('./style/themes').Theme} theme a theme object, please read more about [themes](https://github.com/obdasystems/grapholscape/wiki/Themes)
   * @tutorial Themes
   */
  addTheme(theme) {
    if (!theme.id) {
      throw( new Error('The custom theme you specified must have a declared unique "id" property'))
    }

    this.config.rendering.theme.list.push({
      value: theme.id,
      label: theme.name || theme.id
    });


    // update selected theme unless new them is set with selected = false
    if (theme.selected == undefined || theme.selected == true) {
      this.config.rendering.theme.selected = theme.id;
    }
    // remove metadata from theme in order to get only colours
    delete theme.name;
    delete theme.selected;

    this.themesController.addTheme(theme, theme.id);
  }

  /** @param {entityNameTypeChangeCallback} callback */
  onEntityNameTypeChange(callback) { this._callbacksEntityNameTypeChange.push(callback); }

  /**
   * Change displayed names on entities using label in the selected language, full or prefixed IRI
   * @param {EntityNameType} entityNameType 
   */
  changeEntityNameType(entityNameType) {
    this.config.preferences.entity_name.selected = entityNameType;
    // update displayed names (if label is selected then update the label language)
    this.renderersManager.updateDisplayedNames(this.actualEntityNameType, this.languages);
    storeConfigEntry('entity_name', entityNameType);
    this._callbacksEntityNameTypeChange.forEach(fn => fn(entityNameType));
  }

  onLanguageChange(callback) { this._callbacksLanguageChange.push(callback); }

  /**
   * Change the language of entities names
   * @param {string} language a languageKey (Language.value), you can find defined languages in Grapholscape.languages.list
   */
  changeLanguage(language) {
    this.config.preferences.language.selected = language;
    // update displayed names (if label is selected then update the label language)
    this.renderersManager.updateDisplayedNames(this.actualEntityNameType, this.languages);
    storeConfigEntry('language', language);
    this._callbacksLanguageChange.forEach(fn => fn(language));
  }

  /**
   * Export the current diagram in to a PNG image and save it on user's disk
   * @param {String} fileName - the name to assign to the file
   * (Default: [ontology name]-[diagram name]-v[ontology version])
   */
  exportToPNG(fileName = this.exportFileName) {
    fileName = fileName + '.png';
    toPNG(fileName, this.renderer.cy, this.themesController.actualTheme.background);
  }

  /**
   * Export the current diagram in to a SVG file and save it on user's disk
   * @param {String} fileName - the name to assign to the file
   * (Default: [ontology name]-[diagram name]-v[ontology version])
   */
  exportToSVG(fileName = this.exportFileName) {
    fileName = fileName + '.svg';
    toSVG(fileName, this.renderer.cy, this.themesController.actualTheme.background);
  }

  /**
   * Update the actual configuration and apply changes.
   * @param {Object} new_config - a configuration object. Please read [wiki/settings](https://github.com/obdasystems/grapholscape/wiki/Settings)
   * @tutorial Settings
   */
  setConfig(new_config) {
    Object.keys(new_config).forEach(entry => {

      // if custom theme
      if (entry == 'theme' && typeof (new_config[entry]) == 'object') {
        this.addTheme(new_config[entry]);
      } else {
        for (let area in this.config) {
          try {
            let setting = this.config[area][entry];
            if (setting) {
              // apply custom settings only if they match type and are defined in lists
              if (setting.type == 'boolean' && typeof (new_config[entry]) == 'boolean')
                this.config[area][entry].enabled = new_config[entry];
              else if (this.config[area][entry].list.map(elm => elm.value).includes(new_config[entry]))
                this.config[area][entry].selected = new_config[entry];
            }
          } catch (e) {
            console.warn(`Custom default setting [${entry}] not recognized`);
          }
        }
      }
    });
  }

  /**
   * Set a callback to be called on a wiki redirection.
   * @param {function} callback the function to call on a wiki redirection, it will be passed the IRI to redirect to
   */
  onWikiClick(callback) {
    this._callbacksWikiClick.push(callback);
  }

  wikiRedirectTo(iri) {
    this._callbacksWikiClick.forEach(fn => fn(iri));
  }

  /**
   * @type {Ontology}
   */
  get ontology() {
    return this.ontologies[this.actualRenderingMode] || this.ontologies.default
  }

  /**
   * Filename for exports
   * string in the form: "[ontology name]-[diagram name]-v[ontology version]"
   * @type {string}
   */
  get exportFileName() {
    const diagramName = this.ontology.getDiagram(this.actualDiagramID).name;
    return `${this.ontology.name}-${diagramName}-v${this.ontology.version}`
  }

  get renderer() { return this.renderersManager.renderer }

  get container() { return this.renderersManager.container }
  get graphContainer() { return this.renderersManager.graphContainer }

  /** @type {Languages} */
  get languages() {
    return {
      selected: this.config.preferences.language.selected,
      default: this.defaultLanguage,
      list: this.config.preferences.language.list
    }
  }

  /** @type {Filter[]} */
  get filterList() { return this.config.widgets.filters.filter_list }

  get themes() { return this.themesController.themes }

  /** @type {string | number} */
  get actualDiagramID() { return this.renderersManager.actualDiagramID }

  /** @type {string} */
  get actualRenderingMode() { return this.renderer?.key }

  /** @type {EntityNameType} */
  get actualEntityNameType() { return this.config.preferences.entity_name.selected }

  /**
   * Whether grapholscape should perform simplifications or not
   * used to wait for result in case 'lite' or 'float' renderer
   * is selected.
   * @type {boolean}
   */
  get shouldSimplify() {
    let rendererKeys = Object.keys(this.renderersManager.renderers);
    return rendererKeys.includes('lite') || rendererKeys.includes('float')
  }

  get shouldWaitSimplifyPromise() {
    return this.renderer.key !== 'default'
  }

  /**
   * Perform any action that might be using simplified ontologies,
   * this ensures the action to be performed only when such
   * ontology is available.
   * @param {function} callback the function to execute
   */
  performActionInvolvingOntology(callback) {
    if (this.shouldSimplify && this.shouldWaitSimplifyPromise) {
      this.SimplifiedOntologyPromise.then( () => callback());
    } else {
      callback();
    }
  }
}

let warnings$1 = new Set();

function getOntologyInfo$1(xmlDocument) {
  let xml_ontology_tag = xmlDocument.getElementsByTagName('ontology')[0];
  let ontology_name = xml_ontology_tag.getElementsByTagName('name')[0].textContent;
  let ontology_version = '';

  if (xml_ontology_tag.getElementsByTagName('version')[0]) {
    ontology_version = xml_ontology_tag.getElementsByTagName('version')[0].textContent;
  } else {
    ontology_version = 'Undefined';
  }

  return {
    name : ontology_name,
    version: ontology_version,
    languages: [''],
  }
}

function getIriPrefixesDictionary$1(xmlDocument) {
  let result = [];

  if (xmlDocument.getElementsByTagName('IRI_prefixes_nodes_dict').length === 0) {
    // for old graphol files
    result.push({
      prefix : [''],
      value : xmlDocument.getElementsByTagName('iri')[0].textContent,
      standard: false
    });
  } else {
    let iri_prefixes;
    let iri_value, is_standard, prefixes, properties;
    let iris = xmlDocument.getElementsByTagName('iri');
    // Foreach iri create a Iri object
    for (let iri of iris) {
      iri_value = iri.getAttribute('iri_value');
      is_standard = false;
      prefixes = iri.getElementsByTagName('prefix');
      iri_prefixes = [];
      for (let prefix of prefixes) {
        iri_prefixes.push(prefix.getAttribute('prefix_value'));
      }

      if(iri_prefixes.length == 0)
        iri_prefixes.push('');

      // check if it's a standard iri
      properties = iri.getElementsByTagName('property');
      for (let property of properties) {
        is_standard = property.getAttribute('property_value') == 'Standard_IRI';
      }

      result.push({
        prefixes : iri_prefixes,
        value : iri_value,
        standard : is_standard
      });
    }
  }

  return result
}

function getIri$1(element, ontology) {
  let iri_infos = {};
  let label = element.getElementsByTagName('label')[0];
  if (!label)
    return undefined

  label = label.textContent.replace(/\n/g, '');
  let splitted_label = label.split(':');
  // if no ':' in label, then use empty prefix
  let node_prefix_iri = splitted_label.length > 1 ? splitted_label[0] : '';
  let namespace, rem_chars;
  // facets
  if (node_prefix_iri.search(/"[\w]+"\^\^[\w]+:/) != -1) {
    rem_chars = label;
    namespace = '';
    node_prefix_iri = node_prefix_iri.slice(node_prefix_iri.lastIndexOf('^') + 1, node_prefix_iri.lastIndexOf(':') + 1);
  } else {
    rem_chars = splitted_label.length > 1 ? label.slice(label.indexOf(':')+1) : label;
    namespace = ontology.getNamespaceFromPrefix(node_prefix_iri);

    if (!namespace && isPredicate(element)) {
      this.warnings.add(`The prefix "${node_prefix_iri}" is not associated to any namespace`);
    }

    namespace = namespace ? namespace.value : '';
  }

  iri_infos.remainingChars = rem_chars;
  iri_infos.prefix = node_prefix_iri;
  iri_infos.fullIri = namespace + rem_chars;
  iri_infos.namespace = namespace;
  iri_infos.prefixed = node_prefix_iri + ':' + rem_chars;
  return iri_infos
}

function getFacetDisplayedName$1(element) {
  if (element.getElementsByTagName('label')[0])
    // language undefined for v2 = ''
    return element.getElementsByTagName('label')[0].textContent
  else return undefined
}

function getPredicateInfo$1(element, xmlDocument) {
  let result = {};
  result.annotations = {
    label : { 
      '': [element.getElementsByTagName('label')[0].textContent]
    }
  };
  let label_no_break = result.annotations.label[''][0].replace(/\n/g, '');
  let type = element.getAttribute('type');
  let description, start_body_index, end_body_index;
  // for searching predicates' description in graphol v2
  let xmlPredicates = xmlDocument.getElementsByTagName('predicate');

  for (let predicateXml of xmlPredicates) {
    if (label_no_break === predicateXml.getAttribute('name') && type === predicateXml.getAttribute('type')) {
      description = predicateXml.getElementsByTagName('description')[0].textContent;
      description = description.replace(/font-size:0pt/g, '');
      start_body_index = description.indexOf('<p');
      end_body_index = description.indexOf('</body');

      if (description)
        result.annotations.comment = { '' : [description.slice(start_body_index, end_body_index)] };

      // Impostazione delle funzionalità dei nodi di tipo role o attribute
      if (type === 'attribute' || type === 'role') {
        result.functional = parseInt(predicateXml.getElementsByTagName('functional')[0].textContent);
      }

      if (type === 'role') {
        result.inverseFunctional = parseInt(predicateXml.getElementsByTagName('inverseFunctional')[0].textContent);
        result.asymmetric = parseInt(predicateXml.getElementsByTagName('asymmetric')[0].textContent);
        result.irreflexive = parseInt(predicateXml.getElementsByTagName('irreflexive')[0].textContent);
        result.reflexive = parseInt(predicateXml.getElementsByTagName('reflexive')[0].textContent);
        result.symmetric = parseInt(predicateXml.getElementsByTagName('symmetric')[0].textContent);
        result.transitive = parseInt(predicateXml.getElementsByTagName('transitive')[0].textContent);
      }
      break
    }
  }
  return result
}

var Graphol2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  warnings: warnings$1,
  getOntologyInfo: getOntologyInfo$1,
  getIriPrefixesDictionary: getIriPrefixesDictionary$1,
  getIri: getIri$1,
  getFacetDisplayedName: getFacetDisplayedName$1,
  getPredicateInfo: getPredicateInfo$1
});

/** @typedef {import('../model').default} Ontology */

let warnings = new Set();

/**
 * 
 * @param {Document | XMLDocument} xmlDocument 
 */
function getOntologyInfo(xmlDocument) {
  let project = getTag(xmlDocument, 'project');
  let ontology_languages = getTag(xmlDocument, 'languages').children;
  let iri = getTag(xmlDocument, 'ontology').getAttribute('iri');
  let iri_elem = getIriElem(iri, xmlDocument);

  return {
    /** @type {string} */
    name: project.getAttribute('name'),
    /** @type {string} */
    version: project.getAttribute('version'),
    /** @type {string} */
    iri: iri,
    /** @type {string[]} */
    languages: [...ontology_languages].map(lang => lang.textContent),
    /** @type {string} */
    default_language: getTag(xmlDocument, 'ontology').getAttribute('lang'),
    other_infos: getIriAnnotations(iri_elem)
  }
}

/**
 * 
 * @param {Document | XMLDocument} xmlDocument 
 * @returns 
 */
function getIriPrefixesDictionary(xmlDocument) {
  let result = [];
  let prefixes = getTag(xmlDocument, 'prefixes').children;
  for (const p of prefixes) {
    const namespaceValue = getTagText(p, 'namespace');
    const namespace = result.find( n => n.value === namespaceValue);
    if (namespace) 
      namespace.prefixes.push(getTagText(p, 'value'));
    else {
      result.push({
        prefixes: [getTagText(p, 'value')],
        value: namespaceValue,
        standard: false,
      });
    }
  }
  return result
}

/**
 * 
 * @param {HTMLElment} element an xml element
 * @param {import('../model/').default} ontology 
 * @returns {import('../model/ontology').Iri}
 */
function getIri(element, ontology) {
  let nodeIri = getTagText(element, 'iri');
  
  if (!nodeIri) return {}

  let destructuredIri = ontology.destructureIri(nodeIri);
  if (destructuredIri) {
    return destructuredIri
  } else {
    this.warnings.add(`Namespace not found for [${nodeIri}]. The prefix "undefined" has been assigned`);
    /** @type {import('../model/ontology').Iri} */
    return {
      prefix: 'undefined',
      remainingChars: nodeIri,
      namespace: 'undefined',
      fullIri: nodeIri,
      prefixed: nodeIri
    }
  }
}
/**
 * 
 * @param {HTMLElement} element 
 * @param {Ontology} ontology
 * @returns {string}
 */
function getFacetDisplayedName(element, ontology) {
  // Facets' label must be in the form: [constraining-facet-iri^^"value"] to be compliant to Graphol-V2
  if (element.getAttribute('type') === Type.FACET) {
    let constraining_facet = ontology.destructureIri(getTagText(element, 'constrainingFacet'));
    constraining_facet = constraining_facet.prefix + ':' + constraining_facet.remainingChars;

    let value = getTagText(element, 'lexicalForm');

    // unused to be compliant to Graphol-V2
    //let datatype = ontology.destructureIri(getTagText(element, 'datatype'))
    //datatype = datatype.prefix + ':' + datatype.rem_chars

    return constraining_facet + '^^"' + value + '"'
  }
}

/**
 * Returns an object with annotations, description and the properties (functional, etc..) for DataProperties
 * @param {HTMLElement} element 
 * @param {Document | XMLDocument} xmlDocument 
 * @returns {Object.<string, Object.<string, string[]> | boolean>}
 */
function getPredicateInfo(element, xmlDocument) {
  let result = {};
  let actual_iri_elem = getIriElem(element, xmlDocument);
  result = getIriAnnotations(actual_iri_elem);

  if (actual_iri_elem && actual_iri_elem.children) {
    for (let property of actual_iri_elem.children) {
      if (property.tagName != 'value' && property.tagName != 'annotations' &&
        property.textContent != '0') {
        result[property.tagName] = 1;
      }
    }
  }

  return result
}

/** @param {HTMLElement} iri */
function getIriAnnotations(iri) {
  let result = {};
  /** @type {Object.<string, string[]} */
  result.annotations = {};

  let annotations = getTag(iri, 'annotations');
  let language, annotation_kind, lexicalForm;
  if (annotations) {
    for (let annotation of annotations.children) {
      annotation_kind = getRemainingChars(getTagText(annotation, 'property'));
      language = getTagText(annotation, 'language');
      lexicalForm = getTagText(annotation, 'lexicalForm');

      if (!result.annotations[annotation_kind])
        result.annotations[annotation_kind] = {};

      if (!result.annotations[annotation_kind][language])
        result.annotations[annotation_kind][language] = [];

      result.annotations[annotation_kind][language].push(lexicalForm);
    }
  }

  return result
}

/**
 * Retrieve the xml tag element in a xml root element
 * @param {HTMLElement} root root element to search the tag in
 * @param {string} tagName the name of the tag to search
 * @param {number} n in case of more instances, retrieve the n-th. Default: 0 (the first one)
 * @returns {HTMLElement}
 */
function getTag(root, tagName, n = 0) {
  if (root && root.getElementsByTagName(tagName[n]))
    return root.getElementsByTagName(tagName)[n]
}

/**
 * Retrieve the text inside a given tag in a xml root element
 * @param {HTMLElement} root root element to search the tag in
 * @param {string} tagName the name of the tag to search
 * @param {number} n in case of more instances, retrieve the n-th. Default: 0 (the first one)
 * @returns {string}
 */
function getTagText(root, tagName, n = 0) {
  if (root && root.getElementsByTagName(tagName)[n])
    return root.getElementsByTagName(tagName)[n].textContent
}

/**
 * 
 * @param {string | HTMLElement} node 
 * @param {Document | XMLDocument} xmlDocument 
 * @returns {HTMLElement}
 */
function getIriElem(node, xmlDocument) {
  let node_iri = null;

  if (typeof (node) === 'string')
    node_iri = node;
  else
    node_iri = getTagText(node, 'iri');

  if (!node_iri) return null
  let iris = getTag(xmlDocument, 'iris').children;
  for (let iri of iris) {
    if (node_iri == getTagText(iri, 'value')) {
      return iri
    }
  }

  return null
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

  return rem_chars
}

var Graphol3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  warnings: warnings,
  getOntologyInfo: getOntologyInfo,
  getIriPrefixesDictionary: getIriPrefixesDictionary,
  getIri: getIri,
  getFacetDisplayedName: getFacetDisplayedName,
  getPredicateInfo: getPredicateInfo,
  getTag: getTag,
  getTagText: getTagText
});

class GrapholParser {
  constructor(xmlString) {
    this.xmlDocument = (xmlString instanceof XMLDocument) ? xmlString : new DOMParser().parseFromString(xmlString, 'text/xml');

    this.graphol_ver = this.xmlDocument.getElementsByTagName('graphol')[0].getAttribute('version') || -1;

    if(this.graphol_ver == 2 || this.graphol_ver == -1)
      this.graphol = Graphol2;
    else if(this.graphol_ver == 3)
      this.graphol = Graphol3;
    else
      throw new Error(`Graphol version [${this.graphol_ver}] not supported`)
  }

  parseGraphol() {
    let ontology_info = this.graphol.getOntologyInfo(this.xmlDocument);
    this.ontology = new Ontology(ontology_info.name, ontology_info.version);
    this.ontology.languages.list = ontology_info.languages || [];
    this.ontology.languages.default = ontology_info.default_language || ontology_info.languages[0];
    if (ontology_info.other_infos) {
      this.ontology.annotations = ontology_info.other_infos.annotations;
      this.ontology.description = ontology_info.other_infos.description;
    }
    // Create iri and add them to ontology.namespaces
    //let iri_list = this.xmlDocument.getElementsByTagName('iri')
    let dictionary = this.graphol.getIriPrefixesDictionary(this.xmlDocument);

    dictionary.forEach(iri => {
      this.ontology.addNamespace(new Namespace(iri.prefixes, iri.value, iri.standard));
    });

    let i, k, nodes, edges, cnt, array_json_elems, diagram, node;
    let diagrams = this.xmlDocument.getElementsByTagName('diagram');
    for (i = 0; i < diagrams.length; i++) {
      diagram = new Diagram(diagrams[i].getAttribute('name'), i);
      this.ontology.addDiagram(diagram);

      array_json_elems = [];
      nodes = diagrams[i].getElementsByTagName('node');
      edges = diagrams[i].getElementsByTagName('edge');
      cnt = 0;
      // Create JSON for each node to be added to the collection
      for (k = 0; k < nodes.length; k++) {
        node = this.getBasicNodeInfos(nodes[k], i);
        node.data.iri = this.graphol.getIri(nodes[k], this.ontology);

        if (isPredicate(nodes[k])) {
          let predicate_infos = this.graphol.getPredicateInfo(nodes[k], this.xmlDocument, this.ontology);
          if (predicate_infos) {
            Object.keys(predicate_infos).forEach(info => {
              node.data[info] = predicate_infos[info];
            });
            
            // APPLY DISPLAYED NAME FROM LABELS
            let labels = node.data.annotations.label;
            let displayedName;
            // if no labels defined, apply remainingChars from iri as displayed name
            if (!labels) { 
              displayedName = node.data.iri.remainingChars;
            }

            // else try to apply default language label as displayed name
            else if (labels[this.ontology.languages.default]?.length > 0) {
              displayedName = labels[this.ontology.languages.default][0];
            }
            // otherwise pick the first language available
            else {
              for (let lang of this.ontology.languages.list) {
                if (labels[lang]?.length > 0) {
                  displayedName = labels[lang][0];
                  break
                }
              }
            }

            // if still failing, pick the first label you find
            if (!displayedName) {
              displayedName = labels[Object.keys(labels)[0]][0];
            }

            node.data.displayed_name = displayedName;
          }
        } else { // not an entity, take label from <label> tag or use those for constructor nodes
          if (node.data.type === Type.FACET) {
            node.data.displayed_name = this.graphol.getFacetDisplayedName(nodes[k], this.xmlDocument, this.ontology);
          } 

          else if (node.data.type === Type.VALUE_DOMAIN) {
            node.data.displayed_name = node.data.iri.prefixed;
          }
          
          // for domain/range restrictions, cardinalities
          else if (getTagText(nodes[k], 'label')) {
            node.data.displayed_name = getTagText(nodes[k], 'label');
          }

          else { // a constructor node
            let typeKey = Object.keys(Type).find(k => Type[k] === node.data.type);
            if (constructorLabels[typeKey])
              node.data.displayed_name = constructorLabels[typeKey];
          }
        }        
        
        array_json_elems.push(node);

        // add fake nodes when necessary
        // for property assertion, facets or for
        // both functional and inverseFunctional ObjectProperties
        if (array_json_elems[cnt].data.type === Type.PROPERTY_ASSERTION ||
          array_json_elems[cnt].data.type ===  Type.FACET ||
          (array_json_elems[cnt].data.functional && array_json_elems[cnt].data.inverseFunctional)) {
          this.addFakeNodes(array_json_elems);
          cnt += array_json_elems.length - cnt;
        } else { cnt++; }
      }
      diagram.addElems(array_json_elems);
      array_json_elems = [];
      for (k = 0; k < edges.length; k++) {
        array_json_elems.push(this.EdgeXmlToJson(edges[k], i));
      }
      diagram.addElems(array_json_elems);


    }

    if(i==0) {
      throw new Error("The selected .graphol file has no defined diagram")
    }

    this.getIdentityForNeutralNodes();
    this.warnings = [...this.graphol.warnings];
    if (this.warnings.length > 10) {
      let length = this.warnings.length;
      this.warnings = this.warnings.slice(0, 9);
      this.warnings.push(`...${length - 10} warnings not shown`);
    }
    this.warnings.forEach( w => console.warn(w) );
    return this.ontology
  }

  getBasicNodeInfos(element, diagram_id) {
    let enumTypeKey = Object.keys(grapholNodes).find( k => grapholNodes[k].TYPE === element.getAttribute('type'));
    let nodo = {
      data: {
        id_xml: element.getAttribute('id'),
        diagram_id: diagram_id,
        id: element.getAttribute('id') + '_' + diagram_id,
        fillColor: element.getAttribute('color'),
        type: grapholNodes[enumTypeKey].TYPE,
        shape: grapholNodes[enumTypeKey].SHAPE,
        identity: grapholNodes[enumTypeKey].IDENTITY
      },
      position: {},
      classes:grapholNodes[enumTypeKey].TYPE
    };

    // Parsing the <geometry> child node of node
    var geometry = element.getElementsByTagName('geometry')[0];
    nodo.data.width = parseInt(geometry.getAttribute('width'));
    nodo.data.height = parseInt(geometry.getAttribute('height'));

    // Gli individual hanno dimensioni negative nel file graphol
    if (nodo.data.width < 0) { nodo.data.width = -nodo.data.width; }
    // Gli individual hanno dimensioni negative nel file graphol
    if (nodo.data.height < 0) { nodo.data.height = -nodo.data.height; }
    // L'altezza dei facet è nulla nel file graphol, la impostiamo a 40
    if (nodo.data.type === Type.FACET) {
      nodo.data.height = 40;
    }

    nodo.position.x = parseInt(geometry.getAttribute('x'));
    nodo.position.y = parseInt(geometry.getAttribute('y'));

    if (nodo.data.type === grapholNodes.ROLE_CHAIN.TYPE) {
      if (element.getAttribute('inputs') !== '')
        nodo.data.inputs = element.getAttribute('inputs').split(',');
    }

    if (nodo.data.type === grapholNodes.PROPERTY_ASSERTION.TYPE)
      nodo.data.inputs = element.getAttribute('inputs').split(',');

    if (nodo.data.type === grapholNodes.FACET.TYPE) {
      nodo.data.shape_points = grapholNodes.FACET.SHAPE_POINTS;
      nodo.data.fillColor = '#ffffff';
    }

    let label = element.getElementsByTagName('label')[0];
    // apply label position and font size
    if (label != null) {
      
      if (parseInt(label.getAttribute('x')) == nodo.position.x) {
        nodo.data.labelXcentered = true;
        nodo.data.labelXpos = 0;
      } else {
        nodo.data.labelXpos = parseInt(label.getAttribute('x')) - nodo.position.x + 1;
      }

      if (parseInt(label.getAttribute('y')) == nodo.position.y) {
        nodo.data.labelYcentered = true;
        nodo.data.labelYpos = 0;
      } else {
        nodo.data.labelYpos = (parseInt(label.getAttribute('y')) - nodo.position.y) + (nodo.data.height + 2) / 2 + parseInt(label.getAttribute('height')) / 4;
      }

      nodo.data.fontSize = parseInt(label.getAttribute('size')) || 12;
    }

    if(isPredicate(element))
      nodo.classes += ' predicate';
    return nodo
  }

  EdgeXmlToJson (arco, diagram_id) {
    var k;
    var edge = {
      data: {
        target: arco.getAttribute('target') + '_' + diagram_id,
        source: arco.getAttribute('source') + '_' + diagram_id,
        id: arco.getAttribute('id') + '_' + diagram_id,
        id_xml: arco.getAttribute('id'),
        diagram_id: diagram_id,
        type: arco.getAttribute('type'),
        breakpoints: [],
      }
    };

    if (edge.data.type.toLowerCase() == 'same' || edge.data.type.toLowerCase() == 'different')
      edge.data.displayed_name = edge.data.type.toLowerCase();

    // Prendiamo i nodi source e target
    var source = this.ontology.getDiagram(diagram_id).cy.$id(edge.data.source);
    var target = this.ontology.getDiagram(diagram_id).cy.$id(edge.data.target);
    // Impostiamo le label numeriche per gli archi che entrano nei role-chain
    // I role-chain hanno un campo <input> con una lista di id di archi all'interno
    // che sono gli archi che entrano, l'ordine nella sequenza stabilisce la label
    // numerica che deve avere l'arco
    // Quindi se l'arco che stiamo aggiungendo ha come target un nodo role-chain,
    // Cerchiamo l'id dell'arco negli inputs del role-chain e se lo troviamo impostiamo
    // la target_label in base alla posizione nella sequenza
    if (target.data('type') === Type.ROLE_CHAIN || target.data('type') === Type.PROPERTY_ASSERTION) {
      for (k = 0; k < target.data('inputs').length; k++) {
        if (target.data('inputs')[k] ===edge.data.id_xml) {
          edge.data.target_label = k + 1;
          break
        }
      }
    }

    // info = <POINT>
    // Processiamo i breakpoints dell'arco
    // NOTA: ogni arco ha sempre almeno 2 breakpoints, cioè gli endpoints
    var point = getFirstChild(arco);
    var breakpoints = [];
    var segment_weights = [];
    var segment_distances = [];
    var j;
    var count = 0;
    for (j = 0; j < arco.childNodes.length; j++) {
      // Ignoriamo spazi vuoti, e altri figli di tipo diverso da 1
      if (arco.childNodes[j].nodeType != 1) { continue }
      breakpoints[count] = {
        'x' : parseInt(point.getAttribute('x')),
        'y' : parseInt(point.getAttribute('y')),
      };
      //breakpoints[count].push(parseInt(point.getAttribute('x')))
      //breakpoints[count].push(parseInt(point.getAttribute('y')))
      if (getNextSibling(point) != null) {
        point = getNextSibling(point);
        // Se il breakpoint in questione non è il primo
        // e non è l'ultimo, visto che ha un fratello,
        // allora calcoliamo peso e distanza per questo breakpoint
        // [Il primo e l'ultimo breakpoint sono gli endpoint e non hanno peso e distanza]
        if (count > 0) {
          var aux = getDistanceWeight(target.position(), source.position(), breakpoints[count]);
          segment_distances.push(aux[0]);
          segment_weights.push(aux[1]);
        }
        count++;
      } else { break }
    }
    // Se ci sono almeno 3 breakpoints, allora impostiamo gli array delle distanze e dei pesi
    if (count > 1) {
      edge.data.breakpoints = breakpoints.slice(1, count);
      edge.data.segment_distances = segment_distances;
      edge.data.segment_weights = segment_weights;
    }
    // Calcoliamo gli endpoints sul source e sul target
    // Se non sono centrati sul nodo vanno spostati sul bordo del nodo
    let source_endpoint = getNewEndpoint(
      breakpoints[0], // first breakpoint is the one on source
      source,
      breakpoints[1]
    );

    // Impostiamo l'endpoint solo se è diverso da zero
    // perchè di default l'endpoint è impostato a (0,0) relativamente al nodo di riferimento
    if (source_endpoint.x != 0 || source_endpoint.y != 0) {
      edge.data.source_endpoint = [];
      edge.data.source_endpoint.push(source_endpoint.x);
      edge.data.source_endpoint.push(source_endpoint.y);
    }
    // Facciamo la stessa cosa per il target
    let target_endpoint = getNewEndpoint(
      breakpoints[breakpoints.length - 1], // last endpoint is the one on target
      target, 
      breakpoints[breakpoints.length - 2]
    );

    if (target_endpoint.x != 0 || target_endpoint.y != 0) {
      edge.data.target_endpoint = [];
      edge.data.target_endpoint.push(target_endpoint.x);
      edge.data.target_endpoint.push(target_endpoint.y);
    }

    // If we have no control-points and only one endpoint, we need an intermediate breakpoint
    // why? see: https://github.com/obdasystems/grapholscape/issues/47#issuecomment-987175639
    let breakpoint;
    if ( breakpoints.length === 2 ) { // 2 breakpoints means no control-points
      if ((edge.data.source_endpoint && !edge.data.target_endpoint)) {
        /**
         * we have custom endpoint only on source, get a middle breakpoint 
         * between the custom endpoint on source (breakpoints[0]) and target position
         * (we don't have endpoint on target)
         * 
         * NOTE: don't use source_endpoint because it contains relative coordinate 
         * with respect source node position. We need absolute coordinates which are
         * the ones parsed from .graphol file
         */
        breakpoint = getPointOnEdge(breakpoints[0], target.position());
      }

      if (!edge.data.source_endpoint && edge.data.target_endpoint) {
        // same as above but with endpoint on target, which is the last breakpoints (1 since they are just 2)
        breakpoint = getPointOnEdge(source.position(), breakpoints[1]);
      }

      if (breakpoint) {
        // now if we have the breakpoint we need, let's get distance and weight for cytoscape
        // just like any other breakpoint
        const distanceWeight = getDistanceWeight(target.position(), source.position(), breakpoint);
        edge.data.breakpoints = [ breakpoint ];
        edge.data.segment_distances = [ distanceWeight[0] ];
        edge.data.segment_weights = [ distanceWeight[1] ];
      }
    }
    return edge
  }

  addFakeNodes(array_json_nodes) {
    var nodo = array_json_nodes[array_json_nodes.length - 1];
    if (nodo.data.type ==='facet') {
      // Se il nodo è di tipo facet inseriamo i ritorni a capo nella label
      // e la trasliamo verso il basso di una quantità pari all'altezza del nodo
      nodo.data.displayed_name = nodo.data.displayed_name.replace('^^', '\n\n');
      nodo.data.labelYpos = nodo.data.height;
      // Creating the top rhomboid for the grey background
      var top_rhomboid = {
        selectable: false,
        data: {
          height: nodo.data.height,
          width: nodo.data.width,
          shape: Shape.POLYGON,
          shape_points: '-0.9 -1 1 -1 0.95 0 -0.95 0',
          diagram_id: nodo.data.diagram_id,
          parent_node_id: nodo.data.id,
          type: nodo.data.type
        },
        position: {
          x: nodo.position.x,
          y: nodo.position.y
        },
        classes: 'fake-top-rhomboid' 
      };

      var bottom_rhomboid = {
        selectable: false,
        data: {
          height: nodo.data.height,
          width: nodo.data.width,
          shape: 'polygon',
          shape_points: '-0.95 0 0.95 0 0.9 1 -1 1',
          diagram_id: nodo.data.diagram_id,
          parent_node_id: nodo.data.id,
          type: nodo.data.type
        },
        position: {
          x: nodo.position.x,
          y: nodo.position.y
        }
      };
      array_json_nodes[array_json_nodes.length - 1] = top_rhomboid;
      array_json_nodes.push(bottom_rhomboid);
      array_json_nodes.push(nodo);
      return
    }

    if (nodo.data.functional ===1 && nodo.data.inverseFunctional ===1) {
      // Creating "fake" nodes for the double style border effect
      var triangle_right = {
        selectable: false,
        data: {
          height: nodo.data.height,
          width: nodo.data.width,
          fillColor: "#000",
          shape: 'polygon',
          shape_points: '0 -1 1 0 0 1',
          diagram_id: nodo.data.diagram_id,
          type: nodo.data.type,
        },
        position: {
          x: nodo.position.x,
          y: nodo.position.y,
        },
        classes: 'fake-triangle fake-triangle-right'
      };
      var triangle_left = {
        selectable: false,
        data: {
          height: nodo.data.height,
          width: nodo.data.width + 2,
          fillColor: '#fcfcfc',
          shape: 'polygon',
          shape_points: '0 -1 -1 0 0 1',
          diagram_id: nodo.data.diagram_id,
          type: nodo.data.type,
        },
        position: {
          x: nodo.position.x,
          y: nodo.position.y
        },
        classes: 'fake-triangle'
      };
      //var old_labelXpos = nodo.data.labelXpos
      //var old_labelYpos = nodo.data.labelYpos
      nodo.data.height -= 8;
      nodo.data.width -= 10;
      // If the node is both functional and inverse functional,
      // we added the double style border and changed the node height and width.
      // The label position is function of node's height and width so we adjust it
      // now after those changes.
      if (nodo.data.displayed_name != null) {
        nodo.data.labelYpos -= 4;
      }
      array_json_nodes[array_json_nodes.length - 1] = triangle_left;
      array_json_nodes.push(triangle_right);
      array_json_nodes.push(nodo);
    }

    if (nodo.data.type === Type.PROPERTY_ASSERTION) {
      var circle1 = {
        selectable: false,
        classes: 'no_overlay',
        data: {
          height: nodo.data.height,
          width: nodo.data.height,
          shape: Shape.ELLIPSE,
          diagram_id: nodo.data.diagram_id,
          fillColor: '#fff',
          parent_node_id: nodo.data.id,
          type: nodo.data.type
        },
        position: {
          x: nodo.position.x - ((nodo.data.width - nodo.data.height) / 2),
          y: nodo.position.y
        }
      };
      var circle2 = {
        selectable: false,
        classes: 'no_overlay',
        data: {
          height: nodo.data.height,
          width: nodo.data.height,
          shape: Shape.ELLIPSE,
          diagram_id: nodo.data.diagram_id,
          fillColor: '#fff',
          parent_node_id: nodo.data.id,
          type: nodo.data.type
        },
        position: {
          x: nodo.position.x + ((nodo.data.width - nodo.data.height) / 2),
          y: nodo.position.y
        }
      };
      var back_rectangle = {
        data: {
          selectable: false,
          height: nodo.data.height,
          width: nodo.data.width - nodo.data.height,
          shape: Shape.RECTANGLE,
          diagram_id: nodo.data.diagram_id,
          fillColor: '#fff',
          parent_node_id: nodo.data.id,
          type: nodo.data.type
        },
        position: nodo.position
      };

      nodo.data.height -= 1;
      nodo.data.width = nodo.data.width - nodo.data.height;
      nodo.data.shape = Shape.RECTANGLE;
      nodo.classes = `${Type.PROPERTY_ASSERTION} no_border`;
      
      array_json_nodes[array_json_nodes.length - 1] = back_rectangle;
      array_json_nodes.push(circle1);
      array_json_nodes.push(circle2);
      array_json_nodes.push(nodo);
    }
  }

  getIdentityForNeutralNodes() {
    this.ontology.diagrams.forEach(diagram => {
      diagram.cy.nodes('[identity = "neutral"]').forEach(node => {
        node.data('identity', findIdentity(node));
      });
    });

    // Recursively traverse first input node and return his identity
    // if he is neutral => recursive step
    function findIdentity (node) {
      var first_input_node = node.incomers('[type = "input"]').sources();
      var identity = first_input_node.data('identity');
      if (identity === Type.NEUTRAL) { return findIdentity(first_input_node) } else {
        switch (node.data('type')) {
          case Type.RANGE_RESTRICTION:
            if (identity === Type.OBJECT_PROPERTY) { 
              return Type.CONCEPT
            } else if (identity === Type.DATA_PROPERTY) { 
              return Type.VALUE_DOMAIN
            } else {
              return identity
            }
          case Type.ENUMERATION:
            if (identity === Type.INDIVIDUAL) { return grapholNodes.CONCEPT.TYPE } else { return identity }
          default:
            return identity
        }
      }
    }
  }
}

/**
 * Initialize a Grapholscape instance given a file, container and optional config
 * @param {string | object} file 
 * @param {object} container 
 * @param {oject} config 
 * @returns {Promise<Grapholscape>}
 */
function initGrapholscape (file, container, config) {

  const savedConfig = loadConfig();
  let lastUsedTheme = savedConfig.theme;
  delete savedConfig.theme; // we don't need to override theme in config
  // copy savedConfig over config
  config = Object.assign(config, savedConfig);
  if (config.theme) {
    config.theme.selected = lastUsedTheme && lastUsedTheme === config.theme?.id;
  }
  return new Promise ((resolve, reject) => {
    let ontology = null;

    if (typeof (file) === 'object') {
      let reader = new FileReader();

      reader.onloadend = () => {
        try {
          ontology = getResult(reader.result);
          init();
        } catch (error) { reject(error); }
      };

      reader.readAsText(file);

      setTimeout( () => {
        reject('Error: timeout expired');
      }, 10000);

    } else if (typeof (file) === 'string') {
      ontology = getResult(file);
      init();
    } else {
      reject('Err: Grapholscape needs a Graphol File or the corresponding string to be initialized');
    }

    function init() {
      try {
        const gscape = new Grapholscape(ontology, container, config);
        if (lastUsedTheme) gscape.applyTheme(lastUsedTheme);
        resolve(gscape);
      } catch (e) { console.error(e);}
    }
  }).catch(error => console.error(error) )

  function getResult(file) {
    return new GrapholParser(file).parseGraphol()
  }
}

class GscapeWidget extends s {
  static get properties() {
    return {
      isEnabled: { type: Boolean },
      hiddenDefault: { type: Boolean }
    }
  }

  static get styles() {
    let colors = gscape;

    return [[r$1`
      :host, .gscape-panel{
        font-family : "Open Sans","Helvetica Neue",Helvetica,sans-serif;
        display: block;
        position: absolute;
        color: var(--theme-gscape-on-primary, ${colors.on_primary});
        background-color:var(--theme-gscape-primary, ${colors.primary});
        box-shadow: 0 2px 4px 0 var(--theme-gscape-shadows, ${colors.shadows});
        border-radius: 8px;
        transition: opacity 0.2s;
        scrollbar-width: thin;
        --mdc-icon-button-size: 24px;
      }

      :host(:hover){
        box-shadow: 0 4px 8px 0 var(--theme-gscape-shadows, ${colors.shadows});
      }

      .hide {
        display:none;
      }

      .widget-body {
        width: 100%;
        max-height:450px;
        border-top:solid 1px var(--theme-gscape-shadows, ${colors.shadows});
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
        overflow:auto;
        scrollbar-width: inherit;
      }

      .gscape-panel {
        position: absolute;
        bottom: 40px;
        width: auto;
        padding:10px;
        overflow: unset;
        border: none;
      }

      .gscape-panel::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 16px;
        margin-left: -8px;
        border-width: 8px;
        border-style: solid;
        border-color: #ddd transparent transparent transparent;
      }

      .gscape-panel-title{
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
      }

      .widget-body .section:last-of-type {
        margin-bottom: 12px;
      }

      .widget-body .section-header {
        text-align: center;
        font-weight: bold;
        border-bottom: solid 1px var(--theme-gscape-shadows, ${colors.shadows});
        color: var(--theme-gscape-secondary, ${colors.secondary});
        width: 85%;
        margin: auto;
        margin-bottom: 10px;
        padding-bottom: 5px;
      }

      .description {
        margin-bottom: 20px;
      }

      .description:last-of-type {
        margin-bottom: 0;
      }

      .description .language {
        min-width: 50px;
        display: inline-block;
        font-weight: bold;
        color: var(--theme-gscape-secondary, ${colors.secondary});
        margin: 5px;
      }

      .section { padding: 10px; }

      .details_table{
        border-spacing: 0;
      }

      .details_table th {
        color: var(--theme-gscape-secondary, ${colors.secondary});
        border-right: solid 1px var(--theme-gscape-shadows, ${colors.shadows});
        font-weight: bold;
        text-align:left;
        min-width: 50px;
      }

      .details_table th, td {
        padding:5px 8px;
        white-space: nowrap;
      }

      .highlight:hover {
        color: var(--theme-gscape-on-secondary, ${colors.on_secondary});
        background-color:var(--theme-gscape-secondary, ${colors.secondary});
      }

      /* width */
      ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }

      /* Track */
      ::-webkit-scrollbar-track {
        background: #f0f0f0;
      }

      /* Handle */
      ::-webkit-scrollbar-thumb {
        background: #cdcdcd;
      }

      /* Handle on hover */
      ::-webkit-scrollbar-thumb:hover {
        background: #888;
      }

      .clickable {
        font-weight:bold;
        text-decoration: underline;
      }

      .clickable:hover {
        cursor:pointer;
        color: var(--theme-gscape-secondary-dark, ${colors.secondary_dark});
      }

      .icon {
        height:24px;
        width:24px;
      }

    `], colors]
  }

  constructor() {
    super();
    this.draggable = false;
    this.collapsible = false;
    this.isEnabled = true;
    this._hiddenDefault = false;

    this.onselectstart = () => { };
    this.onToggleBody = () => { };
  }

  render() {
    return p``
  }

  toggleBody() {
    if (this.collapsible) {
      if (this.header) {
        this.header.toggleIcon();
      }

      if (this.body)
        this.body.classList.toggle('hide');

      this.onToggleBody();
    }
  }

  collapseBody() {
    if (this.collapsible) {
      if (this.header && !this.isCollapsed)
        this.header.toggleIcon();

      if (this.body)
        this.body.classList.add('hide');
    }
  }

  showBody() {
    if (this.collapsible) {
      if (this.header && this.isCollapsed)
        this.header.toggleIcon();

      if (this.body)
        this.body.classList.remove('hide');
    }
  }

  firstUpdated() {
    this.header = this.shadowRoot.querySelector('gscape-head');
    this.body = this.shadowRoot.querySelector('.widget-body');

    if (this.collapsible) {
      this.addEventListener('toggle-widget-body', this.toggleBody);
    }

    if (this.draggable) {
      let dragHandler = this.shadowRoot.querySelector('.drag-handler');
      if (dragHandler) this.makeDraggable(dragHandler);
    }
  }

  makeDraggableHeadTitle() {
    if (this.draggable) {
      setTimeout( () => {
        const headTitleDiv = this.header.shadowRoot.querySelector('.head-title');
        headTitleDiv.classList.add('drag_handler');
        this.makeDraggable(headTitleDiv);
      });     
    }
  }

  makeDraggable(drag_handler) {
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;

    const elmnt = this;

    if (drag_handler)
      drag_handler.onmousedown = dragMouseDown;
    else
      console.warn(`No .drag-handler elem for a ${this.constructor.name} draggable instance`);

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + 'px';
      elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px';
    }

    function closeDragElement() {
      /* stop moving when mouse button is released: */
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  show() {
    if (this.isEnabled) this.style.display = 'initial';
  }

  hide() {
    this.style.display = 'none';
  }

  enable() {
    this.isEnabled = true;
    if (!this.hiddenDefault) this.show();
  }

  disable() {
    this.isEnabled = false;
    this.hide();
  }

  blur() {
    this.collapseBody();
  }

  isCustomIcon(icon) {
    return typeof (icon) !== 'string'
  }

  get isVisible() {
    return this.style.display !== 'none'
  }

  set hiddenDefault(value) {
    this._hiddenDefault = value;
    value ? this.hide() : this.show();
    this.requestUpdate();
  }

  get hiddenDefault() {
    return this._hiddenDefault
  }

  get isCollapsed() {
    if (this.body)
      return this.body.classList.contains('hide')
    else
      return true
  }
}

//customElements.define('gscape-widget', GscapeWidget)

class GscapeButton extends GscapeWidget {

  static get properties() {
    return {
        icon: { type : String },
        active: { type : Boolean },
        label: { type : String }
      }
    }

  static get styles() {
    let super_styles = super.styles;
    let colors = super_styles[1];

    return [
      super_styles[0],
      r$1`

        mwc-icon {
          font-size: var(--gscape-button-font-size, 24px)
        }

        .btn {
          padding:5px;
          line-height: 25px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .btn-label {
          font-weight: var(--gscape-button-font-weight, 600);
          padding: 0 5px 0 8px;
        }

        .btn:hover {
          color: var(--theme-gscape-secondary, ${colors.secondary});
        }

        .btn[active] {
          color: var(--theme-gscape-secondary, ${colors.secondary});
        }
      `
    ]
  }

  constructor(icon, alt_icon, draggable=false) {
    super();
    this.draggable = draggable;

    this.icon = icon;
    this.alternate_icon = alt_icon || icon;
    this.onClick = () => {};
    this.highlight = false;
    this.active = false;
    this.label = '';
  }

  render() {
    return p`
      <div
        class="btn"
        ?active = "${this.active}"
        @click="${this.clickHandler}"
        title="${this.icon}">

        <div class="icon">${this.icon}</div>
        ${this.label ? p`<span class="btn-label">${this.label}<span>` : ``}
      </div>
    `
  }


  set icon(icon) {
    let oldval = this._icon;
    this._icon = icon;

    this.requestUpdate('icon', oldval);
  }

  get icon() {
    return this._icon
  }

  set alternate_icon(icon) {
    let oldval = this._alternate_icon;
    this._alternate_icon = icon;

    this.requestUpdate('alternative_icon', oldval);
  }

  set onClick(f) {
    this._onClick = f;
  }

  clickHandler() {
    if (this.highlight)
      this.active = !this.active;

    this.toggleIcon();
    this._onClick();
  }

  toggleIcon() {
    let aux = this._icon;
    this.icon = this._alternate_icon;
    this.alternate_icon = aux;
  }

  firstUpdated() {
    super.firstUpdated();

    this.shadowRoot.querySelector('.icon').onselectstart =  () => false;
  }
}

customElements.define('gscape-button', GscapeButton);

class GscapeToggle extends GscapeWidget {
  static get properties() {
    return {
      state: {type: Boolean},
      disabled: {type: Boolean},
      label: {type: String},
      key : {type: String},
      checked : {type: Boolean},
    }
  }

  static get styles() {
    let super_styles = super.styles;
    let colors = super_styles[1];

    return r$1`
        :host {
          display: flex;
        }

        .toggle-container {
          white-space: nowrap;
          display: flex;
          align-items: center;
        }

        .toggle-wrap {
          width: 33px;
          height: 19px;
          display: inline-block;
          position: relative;
        }

        .toggle {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: checked 0.2s;
          border-radius: 19px;
        }

        .toggle::before {
          position: absolute;
          content: "";
          height: 11px;
          width: 11px;
          left: 4px;
          bottom: 4px;
          background-color: var(--theme-gscape-primary, ${colors.primary});
          transition: .1s;
          border-radius: 20px;
        }

        .toggle-wrap input {
          display:none;
        }

        .toggle-wrap input:checked + .toggle {
          background-color: var(--theme-gscape-secondary, ${colors.secondary});
        }

        .toggle-wrap input:checked + .toggle::before {
          -webkit-transform: translateX(14px);
          -ms-transform: translateX(14px);
          transform: translateX(14px);
        }

        .toggle-wrap input:disabled + .toggle {
          opacity:0.25;
        }

        .toggle-label {
          margin: 0 15px;
        }
      `
  }

  constructor(key, state, disabled, label, onToggle, inverse_mode = false) {
    super();
    this.key = key || '';
    // always set inverse before state
    this.inverse = inverse_mode;
    this.state = state || false;

    this.disabled = disabled || false;
    this.onToggle = onToggle || {};
    this.label = label || '';
    this.label_pos = 'left';
  }

  render() {
    return p`
    <div class="toggle-container">
      ${this.label_pos == 'left' ? this.label_span : p``}
      <label class="toggle-wrap">
        <input id="${this.key}" type="checkbox"
          ?checked="${this.checked}"
          ?disabled="${this.disabled}"
          @click="${this.clickHandler}"
        />
        <span class="toggle"></span>
      </label>
      ${this.label_pos == 'right' ? this.label_span : p``}
    </div>
    `
  }

  set state(state) {
    this._state = state;
    this.checked = this.inverse ? !state : state;

    // trying to force an update, doesn't work
    //this.requestUpdate('checked', old_checked_val)
  }

  get state() {
    return this._state
  }

  get label_span() {
    return p`<span class="toggle-label">${this.label}</span>`
  }

  clickHandler(e) {
    this.state = !this.state;
    this.onToggle(e);
  }

  updated(a) {
    // force toggle to change its visual state
    // this should be unnecessary: see issue
    this.shadowRoot.querySelector(`#${this.key}`).checked = this.checked;
  }

}

customElements.define('gscape-toggle', GscapeToggle);

class GscapeDialog extends GscapeWidget {

  static get properties() {
    return {
      text: { type : Array },
      type: { type : String },
    }
  }

  static get styles() {
    let super_styles = super.styles;
    let colors = super_styles[1];

    return [
      super_styles[0],
      r$1`
        :host {
          top: 30%;
          left: 50%;
          max-width: 500px;
          transform: translate(-50%, 0);
        }

        .widget-body {
          padding : 10px;
          width: initial;
        }

        .widget-body.error {
          background : var(--theme-gscape-error, ${colors.error});
          color : var(--theme-gscape-on-error, ${colors.on_error});
        }

        gscape-head {
          --title-text-align : center;
          --title-width : 100%;
        }

        gscape-head.error {
          color : var(--theme-gscape-error, ${colors.error});
        }

        gscape-head.warning {
          color : var(--theme-gscape-warning, ${colors.warning});
        }
      `
    ]
  }

  constructor() {
    super();
    this.draggable = true;
    this.text = [];
    this.type = 'error';
  }

  render() {
    return p`
    <gscape-head
      title="${this.type}"
      icon="close"
      class="${this.type.toLowerCase()} drag-handler">
    </gscape-head>
    <div class="widget-body ${this.type.toLowerCase()}">
      ${this.text.map( text => p`<p>${text}</p>`)}
    </div>
    `
  }

  // override
  show(type, message) {
    super.show();

    this.type = type;
    if (typeof(message) == 'string')
      this.text = [message];
    else
      this.text = message;
  }

  clickHandler() {
    this.hide();
    this._onClick();
  }

  firstUpdated() {
    super.firstUpdated();

    this.hide();
    this.header.onClick = this.hide.bind(this);
  }
}

customElements.define('gscape-dialog', GscapeDialog);

class GscapeHeader extends GscapeWidget {
  static get properties() {
    return {
      title: { type : String },
      initial_icon: { type : String },
      secondary_icon: { type : String },
      icon : { type : String },
      left_icon: { type: String }
    }
  }

  constructor(title = 'header', left_icon = '') {
    super();
    this.title = title;
    this.initial_icon = triangle_down;
    this.secondary_icon = triangle_up;
    this.icon = this.initial_icon;
    this.left_icon = left_icon;
    this.onClick = () => {};
  }

  static get styles() {
    // we don't need super.styles, just the colors from default imported theme
    let colors = super.styles[1];

    return r$1`
      :host {
        display:flex;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--header-padding, 8px);
      }

      .head-btn {
        color:var(--theme-gscape-on-primary, ${colors.on_primary});
        right:0;
        cursor:pointer;
      }

      .head-btn:hover{
        color:var(--theme-gscape-secondary, ${colors.secondary});
      }

      .head-title {
        padding: var(--title-padding, 0 10px);
        box-sizing: border-box;
        font-weight:bold;
        cursor:grab;
        width: var(--title-width, '');
        text-align: var(--title-text-align, 'left');
        justify-self: flex-start;
        line-height: 25px;
      }

      .icon {
        height:24px;
        width:24px;
      }
    `
  }

  render () {
    return p`
      <div class='icon'>${this.left_icon}</div>
      <div class="head-title">${this.title}</div>
      <slot></slot>
      <div class="head-btn icon" @click="${this.iconClickHandler}">${this.icon}</div>
    `
  }

  iconClickHandler() {
    this.onClick();
    this.toggleBody();
  }

  toggleBody() {
    const e = new CustomEvent('toggle-widget-body', {
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(e);
  }

  invertIcons() {
    [this.initial_icon, this.secondary_icon] = [this.secondary_icon, this.initial_icon];
    this.toggleIcon();
  }

  toggleIcon() {
    this.icon = this.icon == this.initial_icon ? this.secondary_icon : this.initial_icon;
  }
}

customElements.define('gscape-head', GscapeHeader);

class GscapeDiagramSelector extends GscapeWidget {
  static get properties() {
    return [
      super.properties,
      {
        actual_diagram_id : String,
      }
    ]
  }

  static get styles() {
    let super_styles = super.styles;
    let colors = super_styles[1];

    return [
      super_styles[0],
      r$1`
        :host {
          top: 10px;
          left: 10px;
        }

        .diagram-item {
          cursor:pointer;
          padding:5px 10px;
        }

        .diagram-item:last-of-type {
          border-radius: inherit;
        }

        .selected {
          background-color: var(--theme-gscape-primary-dark, ${colors.primary_dark});
          color: var(--theme-gscape-on-primary-dark, ${colors.on_primary_dark});
          font-weight: bold;
        }
      `
    ]
  }

  constructor(diagrams$1) {
    super();
    this.draggable = true;
    this.collapsible = true;
    this.diagrams = diagrams$1;
    this.actual_diagram_id = null;
    this._onDiagramChange = null;
    this.header = new GscapeHeader('Select a Diagram', diagrams);
  }

  render () {
    return p`
      ${this.header}

      <div class="widget-body hide">
        ${this.diagrams
          .sort(function (a, b) {
            var x = a.name.toLowerCase();
            var y = b.name.toLowerCase();
            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0
          })
          .map( diagram => p`
            <div
              @click="${this.changeDiagram}"
              name="${diagram.name}"
              diagram-id="${diagram.id}"
              class="diagram-item highlight ${diagram.id == this.actual_diagram_id ? `selected` : ``}"
            >
              ${diagram.name}
            </div>
            `)}
      </div>
    `
  }

  changeDiagram(e) {
    if (this.shadowRoot.querySelector('.selected'))
      this.shadowRoot.querySelector('.selected').classList.remove('selected');

    e.target.classList.add('selected');

    let diagram_id = e.target.getAttribute('diagram-id');

    this.toggleBody();
    this.actual_diagram_id = diagram_id;
    this._onDiagramChange(diagram_id);
  }

  firstUpdated() {
    super.firstUpdated();

    this.makeDraggableHeadTitle();
  }

  set onDiagramChange(f) {
    this._onDiagramChange = f;
  }

  set actual_diagram_id(diagram_id) {
    this._actual_diagram_id = diagram_id;

    if (diagram_id != null) {
      this.header.title = this.diagrams.find(d => d.id == diagram_id).name;
    }

    this.requestUpdate();
  }

  get actual_diagram_id() {
    return this._actual_diagram_id
  }

  get actual_diagram() {
    return this._actual_diagram
  }
}

customElements.define('gscape-diagram-selector', GscapeDiagramSelector);

/**
 * 
 * @param {import('./index').default} diagramSelectorComponent 
 * @param {import('../../grapholscape').default} grapholscape 
 */
function init$8(diagramSelectorComponent, grapholscape) {
  const diagramsViewData = grapholscape.ontology.diagrams.map(diagram => diagramModelToViewData(diagram));
  diagramSelectorComponent.diagrams = diagramsViewData;
  diagramSelectorComponent.onDiagramChange = (diagram) => grapholscape.showDiagram(diagram);

  grapholscape.onDiagramChange(newDiagram => diagramSelectorComponent.actual_diagram_id = newDiagram.id);
}

const diagramSelector = (grapholscape) => {
  const diagramSelectorComponent = new GscapeDiagramSelector();
  init$8(diagramSelectorComponent, grapholscape);
  return diagramSelectorComponent
};

var annotationsTemplate = (entity) => {
  return p`
    ${entity.annotations && Object.keys(entity.annotations).length > 0 ?
      p`
        <div class="section">
          <div class="section-header">Annotations</div>
          <table class="details_table annotations">
          ${Object.keys(entity.annotations).map( kind => {
            if (kind === 'comment') return p``
            let annotation = entity.annotations[kind];
            return p`
              <tbody class="annotation-row">
                ${Object.keys(annotation).map( (language, count)  => {
                  return p`
                    ${annotation[language].map( value => {
                      return p`
                        <tr>
                          ${count == 0 ? p`<th rowspan="3">${kind.charAt(0).toUpperCase() + kind.slice(1)}</th>` : ''}
                          <td class="language">${language}</td>
                          <td>${value}</td>
                        </tr>
                      `
                    })}
                  `
                })}
              </tbody>
            `
          })}
          </table>
        </div>
      ` : ''
    }
    
    ${entity.annotations.comment && Object.keys(entity.annotations.comment).length > 0 ?
      p`
        <div class="section">
          <div class="section-header"> Description </div>
          ${Object.keys(entity.annotations.comment).map( language => {
            return p`
              <div class="description" lang="${language}">
                ${language != '' ? p`<span class="language">${language}</span>` : ''}
                <span class="descr-text"></span>
              </div>
            `
          })}
        </div>
      ` : p``
    }
  `
};

var entityOccurrencesTemplate = (occurrences, onNodeNavigation) => {
  return p`${occurrences && occurrences.length > 0 ?
    p`
      <div class="section">
        <div class="section-header">Occurrences</div>
          <table class="details_table">
            <tbody>
            ${occurrences.map( occurrence => {
              return p`
                <tr>
                  <th>${occurrence.diagram_name}</th>
                  <td node_id="${occurrence.id}" class="clickable" @click="${onNodeNavigation}">${occurrence.id_xml}</td>
                </tr>
              `
            })}
            </tbody>
          </table>
        </div>
      </div>
    ` :
    ''
  }`
};

//import entityOccurrencesTemplate from './common/entityOccurrencesTemplate'

class GscapeEntityDetails extends GscapeWidget {

  static get properties() {
    return [
      super.properties,
      {
        entity: { type: Object }
      }
    ]
  }

  static get styles() {
    let super_styles = super.styles;
    let colors = super_styles[1];

    return [
      super_styles[0],
      r$1`
        :host {
          top:10px;
          right:62px;
          width:400px;
        }

        .chips-wrapper {
          padding: 0 10px;
        }

        .descr-header {
          text-align: center;
          padding: 12px;
          font-weight: bold;
          border-bottom: solid 1px var(--theme-gscape-shadows, ${colors.shadows});
          color: var(--theme-gscape-secondary, ${colors.secondary});
          width: 85%;
          margin: auto;
        }

        gscape-head {
          --title-text-align: center;
          --title-width: 100%;
        }

        .chip {
          display: inline-block;
          margin: 4px;
          padding: 3px 8px;
          border-radius: 32px;
          border: 1px solid var(--theme-gscape-secondary, ${colors.secondary});
          color: var(--theme-gscape-secondary, ${colors.secondary});
          font-size: 13px;
        }

        .language {
          text-align: center;
          font-size: 14px;
        }

        tbody:nth-child(n+2)::before {
          content: '';
          display: table-row;
          height: 20px;
        }
      `
    ]
  }

  constructor() {
    super();
    this.draggable = true;
    this.collapsible = true;

    this.hiddenDefault = true;
    this._entity = null;
    this.properties = {
      functional : 'Functional',
      inverseFunctional : 'Inverse Functional',
      symmetric : 'Symmetric',
      asymmetric: 'Asymmetric',
      reflexive : 'Reflexive',
      irreflexive : 'Irreflexive',
      transitive : 'Transitive',
    };

    this.onNodeNavigation = {};
    this.header = new GscapeHeader('Entity Details', info_filled);
  }

  render() {
    return p`
      ${this.header}
      <div class="widget-body">
        ${this.entity?
          p`
            <div class="section">
              <table class="details_table">
                <tr>
                  <th>Name</th>
                  <td class="wiki" @click="${this.wikiClickHandler}">${this.entity.iri.remainingChars}</td>
                </tr>
                <tr>
                  <th>Type</th>
                  <td>${this.entity.type}</td>
                </tr>
                ${this.entity.type != 'individual' ? p`
                <tr>
                  <th>IRI</th>
                  <td>${this.entity.iri.fullIri}</td>
                </tr>
                ` : p``
                }
              </table>
            </div>

            <div class="chips-wrapper">
              ${Object.keys(this.properties).map(property => {
                return this.entity[property]?
                  p`<span class="chip">&#10003; ${this.properties[property]}</span>`
                : p``
              })}
            </div>
            
            ${entityOccurrencesTemplate(this.entity.occurrences, this.handleNodeSelection)}
            ${annotationsTemplate(this.entity)}
          `
        : p``
        }
      </div>
    `
  }

  wikiClickHandler(e) {
    if (this._onWikiClick)
      this._onWikiClick(this.entity.iri.fullIri);
  }

  set onWikiClick(foo) {
    this._onWikiClick = foo;
  }

  set entity(entity) {
    let oldval = this.entity;
    this._entity = entity;
    switch (this._entity.type) {
      case 'concept' :
        this._entity.type = 'Class';
        break;

      case 'role' :
        this._entity.type = 'Object Property';
        break;

      case 'attribute':
        this._entity.type = 'Data Property';
        break;
    }
    this.requestUpdate('entity', oldval);
  }

  get entity() {
    return this._entity
  }

  updated() {
    if (this.entity && this.entity.annotations?.comment)
      this.renderDescription(this.entity.annotations.comment);

    if (this._onWikiClick) {
      this.shadowRoot.querySelectorAll('.wiki').forEach(el => {
        el.classList.add('clickable');
      });
    }
  }

  renderDescription (description) {
    let descr_container;
    let text;
    Object.keys(description).forEach( language => {
      text = '';
      descr_container = this.shadowRoot.querySelector(`[lang = "${language}"] > .descr-text`);
      description[language].forEach((comment, i) => {
        i > 0 ?
          text += '<p>'+comment.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/')+'</p>' :
          text += comment.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/');
      });
      descr_container.innerHTML = text;
    });
  }

  handleNodeSelection(e) {
    let node_id = e.target.getAttribute('node_id');
    this.onNodeNavigation(node_id);
  }

  firstUpdated() {
    super.firstUpdated();
    this.header.invertIcons();
    this.makeDraggableHeadTitle();
  }

  // override
  blur() {
    this.hide();
  }
}

customElements.define('gscape-entity-details', GscapeEntityDetails);

/**
 * @param {import('./index').default} entityDetailsComponent
 * @param {import('../../grapholscape').default} grapholscape 
 */
function init$7(entityDetailsComponent, grapholscape) {
  entityDetailsComponent.onWikiClick = (iri) => grapholscape.wikiRedirectTo(iri);
  entityDetailsComponent.onNodeNavigation = (nodeID) => grapholscape.centerOnNode(nodeID);

  grapholscape.onEntitySelection(entity => {
    let entityViewData = entityModelToViewData(entity, grapholscape.languages);

    entityViewData.occurrences = grapholscape.ontology.getEntityOccurrences(entityViewData.iri.fullIri).map(elem => {
      const grapholElem = cyToGrapholElem(elem);
      return {
        id: grapholElem.data.id,
        id_xml: grapholElem.data.id_xml,
        diagram_id: grapholElem.data.diagram_id,
        diagram_name: grapholscape.ontology.getDiagram(grapholElem.data.diagram_id).name
      }
    });

    entityDetailsComponent.entity = entityViewData;
    entityDetailsComponent.show();
  });
}

const entityDetails = (grapholscape) => {
  const entityDetailsComponent = new GscapeEntityDetails();
  init$7(entityDetailsComponent, grapholscape);
  return entityDetailsComponent
};

class GscapeFilters extends GscapeWidget {

  static get properties() {
    return {
      filters : {
        type: Object,
        hasChanged(newVal, oldVal) {
          if(!oldVal) return true

          Object.keys(newVal).map(key => {
            if ( (newVal[key].active != oldVal[key].active) ||
              (newVal[key].disabled != oldVal[key].disabled) )
              return true
          });

          return false
        }
      }
    }
  }

  static get styles() {
    let super_styles = super.styles;
    super_styles[1];

    return [
      super_styles[0],
      r$1`
        :host {
          display:inline-block;
          position: initial;
          margin-right:10px;
        }

        gscape-button{
          position: static;
        }

        gscape-toggle {
          padding: 8px;
        }

        gscape-toggle[first]{
          justify-content: center;
          border-bottom: 1px solid #ccc;
          margin-bottom: 10px;
          padding: 10px;
        }
      `,
    ]
  }

  constructor(filters = {}) {
    super();
    this.collapsible = true;
    this.filterList = filters;

    this.btn = new GscapeButton(filter);
    this.btn.onClick = this.toggleBody.bind(this);
    this.btn.active = false;

    this.onFilterOn = () => {};
    this.onFilterOff = () => {};
  }

  render() {
    return p`
      ${this.btn}

      <div class="widget-body hide gscape-panel">
        <div class="gscape-panel-title">Filters</div>

        <div class="filters-wrapper">
          ${Object.keys(this.filterList).map(key => {
            let filter = this.filterList[key];
            let toggle = {};

            /**
             * filter toggles work in inverse mode
             *  checked => filter not active
             *  unchecked => filter active
             *
             * we invert the visual behaviour of a toggle passing the last flag setted to true
             * the active boolean will represent the filter state, not the visual state.
             */
            if (key == 'all') {
              toggle = new GscapeToggle(key, filter.active, filter.disabled, filter.label, this.toggleFilter.bind(this));
              toggle.setAttribute('first', 'true');
            } else {
              toggle = new GscapeToggle(key, filter.active, filter.disabled, filter.label, this.toggleFilter.bind(this), true);
            }
            toggle.label_pos = 'right';
            return p`
              ${toggle}
            `
          })}
        </div>
      </div>
    `
  }

  toggleFilter(e) {
    let toggle = e.target;
    if (toggle.id == 'all')
      toggle.checked ? this.onFilterOn(toggle.id) : this.onFilterOff(toggle.id);
    else
      !toggle.checked ? this.onFilterOn(toggle.id) : this.onFilterOff(toggle.id);
  }

  updateTogglesState() {
    let toggles = this.shadowRoot.querySelectorAll(`gscape-toggle`);
    let is_activated = false;

    toggles.forEach(toggle => {
      toggle.state = this.filterList[toggle.key].active;
      toggle.disabled = this.filterList[toggle.key].disabled;
      if (toggle.state)
        is_activated = true;
    });

    this.btn.active = is_activated;
    this.btn.requestUpdate();
  }

  show() {
    if (this.isEnabled) this.style.display = 'inline-block';
  }
}



customElements.define('gscape-filters', GscapeFilters);

/**
 * @param {import('./index').default} filterComponent
 * @param {import('../../grapholscape').default} grapholscape 
 */
function init$6 (filterComponent, grapholscape) {
  filterComponent.filterList = grapholscape.filterList;
  filterComponent.onFilterOn = (filterType) => {
    filterComponent.filterList[filterType].active = true;
    onFilterToggle(filterType);
  };
  filterComponent.onFilterOff = (filterType) => {
    filterComponent.filterList[filterType].active = false;
    onFilterToggle(filterType);
  };

  grapholscape.onFilter(_ => filterComponent.updateTogglesState());
  grapholscape.onUnfilter(_ => filterComponent.updateTogglesState());
  grapholscape.onRendererChange(() => filterComponent.requestUpdate());

  function onFilterToggle(type) {
    if (type == 'attributes' && !grapholscape.renderer.disabledFilters.includes('value_domain')) {
      filterComponent.filterList.value_domain.disabled = filterComponent.filterList.attributes.active;
    }

    // if 'all' is toggled, it affect all other filters
    if (type == 'all') {
      Object.keys(filterComponent.filterList).map(key => {
        if (key != 'all' && !filterComponent.filterList[key].disbaled) {
          filterComponent.filterList[key].active = filterComponent.filterList.all.active;

          /**
           * if the actual filter is value-domain it means it's not disabled (see previous if condition)
           * but when filter all is active, filter value-domain must be disabled, let's disable it.
           * Basically value-domain filter disabled state must be equal to the active state of the 
           * 'all' filter.
           */
          if (key == 'value_domain' && !grapholscape.renderer.disabledFilters.includes('value_domain'))
            filterComponent.filterList[key].disabled = filterComponent.filterList['all'].active;

          executeFilter(key);
        }
      });
    } else if (!filterComponent.filterList[type].active && filterComponent.filterList.all.active) {
      // if one filter get deactivated while the 'all' filter is active
      // then make the 'all' toggle deactivated
      filterComponent.filterList.all.active = false;
    }

    executeFilter(type);
    filterComponent.updateTogglesState();
  }

  function executeFilter(type) {
    if (filterComponent.filterList[type].active) {
      grapholscape.filter(type);
    } else {
      grapholscape.unfilter(type);
      // Re-Apply other active filters to resolve ambiguity
      applyActiveFilters();
    }
  }

  function applyActiveFilters() {
    Object.keys(filterComponent.filterList).map(key => {
      if (filterComponent.filterList[key].active)
        grapholscape.filter(filterComponent.filterList[key]);
    });
  }
}

const filterComponent = new GscapeFilters();

const filters = (grapholscape) => {
  init$6(filterComponent, grapholscape);
  return filterComponent
};

class GscapeLayoutSettings extends GscapeWidget {

  static get properties() {
    return {
    }
  }

  static get styles() {
    let super_styles = super.styles;
    let colors = super_styles[1];

    return [
      super_styles[0],
      r$1`
        :host {
          left: 50%;
          bottom: 10px;
          transform: translate(-50%, 0);
        }

        gscape-head span {
          display: flex;
        }

        .widget-body {
          margin:0;
          border-top: none;
          border-bottom: 1px solid var(--theme-gscape-shadows, ${colors.shadows});
          border-radius: inherit;
          border-bottom-left-radius:0;
          border-bottom-right-radius:0;
        }

        gscape-head {
          --header-padding: 5px 8px;
          --title-padding: 0 30px 0 0;
          --btn-padding: 0 0 0 10px;
        }

        gscape-toggle {
          margin-left: 50px;
        }

        .wrapper {
          display:flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px;
        }

        .title {
          padding: 0 5px 0 0;
          font-weight:bold;
        }

        .toggles-wrapper {
          display: flex;
        }
      `,
    ]
  }

  constructor() {
    super();
    this.collapsible = false;

    this.layoutRunToggle = new GscapeToggle('layout-run', true, false, 'Layout Running');
    this.dragAndDropToggle = new GscapeToggle('layout-pin', false, false, 'Drag and Pin');
    this.useOriginalPositionsToggle = new GscapeToggle('layout-orginal-pos', false, false, 'Original Positions');

    this.onLayoutRunToggle = {};
    this.onDragAndPinToggle = {};
    this.onUseOriginalPositions = {};
  }

  render() {
    return p`
      <!-- in case of body
      <div class="widget-body hide">
      </div>
      <gscape-head title="Layout Settings" collapsed="true" class="drag-handler">
        <span>
          ${new GscapeToggle('layout-run', true, false, 'Layout Running', this.onLayoutRunToggle)}
          ${new GscapeToggle('layout-pin', false, false, 'Drag and Pin', this.onDragAndPinToggle)}
        </span>
      </gscape-head>
      -->

      <div class="wrapper">
        <span class="title">Layout Settings</span>
        <span class="toggles-wrapper">
          ${this.layoutRunToggle}
          ${this.dragAndDropToggle}
          ${this.useOriginalPositionsToggle}
        </span>
      </div>

    `
  }

  set onLayoutRunToggle(callback) {
    this._onLayoutRunToggle = callback;
    this.layoutRunToggle.onToggle = callback;
  }

  set onDragAndPinToggle(callback) {
    this._onDragAndPinToggle = callback;
    this.dragAndDropToggle.onToggle = callback;
  }

  set onUseOriginalPositions(callback) {
    this._onUseOriginalPositions = callback;
    this.useOriginalPositionsToggle.onToggle = callback;
  }

  get onLayoutRunToggle() {
    return this._onLayoutRunToggle
  }
}



customElements.define('gscape-layout-settings', GscapeLayoutSettings);

/**
 * 
 * @param {import('./layout-settings').default} layoutSettingsComponent 
 * @param {import('../../grapholscape').default} grapholscape 
 */
function init$5(layoutSettingsComponent, grapholscape) {
  if (grapholscape.renderer.key !== 'float') layoutSettingsComponent.hide();

  grapholscape.onRendererChange( rendererKey => {
    if (rendererKey === 'float')
      layoutSettingsComponent.show();
    else
      layoutSettingsComponent.hide();
  });

  layoutSettingsComponent.onLayoutRunToggle = () => {
    if (!grapholscape.layoutStopped) {
      layoutSettingsComponent.useOriginalPositionsToggle.state = false;
      grapholscape.renderer.useOriginalPositions = false;
    }

    grapholscape.renderer.layoutStopped = !grapholscape.renderer.layoutStopped;
  };
  layoutSettingsComponent.onDragAndPinToggle =
    () => grapholscape.renderer.dragAndPin = !grapholscape.renderer.dragAndPin;

  layoutSettingsComponent.onUseOriginalPositions = () => {
    if (!grapholscape.renderer.useOriginalPositions) {
      layoutSettingsComponent.layoutRunToggle.state = false;
      grapholscape.renderer.layoutStopped = true;
    }

    grapholscape.renderer.useOriginalPositions = !grapholscape.renderer.useOriginalPositions;
  };
}

const layoutSettings = (grapholscape) => {
  const layoutSettingsComponent = new GscapeLayoutSettings();
  init$5(layoutSettingsComponent, grapholscape);
  return layoutSettingsComponent
};

const fullscreenButton = (container) => {
  const fullscreenComponent = new GscapeButton(enter_fullscreen, exit_fullscreen);
  fullscreenComponent.container = container;
  fullscreenComponent.style.top = '10px';
  fullscreenComponent.style.right = '10px';
  fullscreenComponent.onClick = toggleFullscreen;



  document.cancelFullscreen =
  document.exitFullscreen ||
  document.cancelFullscreen ||
  document.mozCancelFullScreen ||
  document.webkitCancelFullScreen ||
  document.msExitFullscreen;

  return fullscreenComponent

  function toggleFullscreen () {
    setFullScreenRequest();
    if (isFullscreen()) {
      document.cancelFullscreen();
    } else {
      fullscreenComponent.container?.requestFullscreen();
    }
  }

  function isFullscreen () {
    return document.fullScreenElement ||
      document.mozFullScreenElement || // Mozilla
      document.webkitFullscreenElement || // Webkit
      document.msFullscreenElement // IE
  }

  function setFullScreenRequest() {
    fullscreenComponent.container.requestFullscreen =
    fullscreenComponent.container?.requestFullscreen ||
    fullscreenComponent.container?.mozRequestFullscreen || // Mozilla
    fullscreenComponent.container?.mozRequestFullScreen || // Mozilla older API use uppercase 'S'.
    fullscreenComponent.container?.webkitRequestFullscreen || // Webkit
    fullscreenComponent.container?.msRequestFullscreen; // IE
  }
};

class GscapeExplorer extends GscapeWidget{

  static get properties() {
    return {
      predicates: { 
        type: Object,
        attribute: false,
      }
    }
  }

  static get styles() {
    let super_styles = super.styles;
    let colors = super_styles[1];

    return [
      super_styles[0],
      r$1`
        :host {
          left:50%;
          top:10px;
          min-width:370px;
          max-width:450px;
          transform: translate(-50%, 0);
        }

        .widget-body {
          overflow:auto;
        }

        .row{
          line-height: 0;
          display: flex;
          align-items: center;
          padding:4px 0;
          cursor:pointer;
        }

        .row-label{
          padding-left:5px;
          width:100%;
          white-space: nowrap;
        }

        .icon:hover{
          color: var(--theme-gscape-primary, ${colors.primary});
          cursor:pointer;
        }

        .type-img{
          width: 20px;
          height: 20px;
          text-align: center;
          line-height: 20px;
        }

        .type-img-A{
          background-color: var(--theme-graph-attribute, ${colors.attribute});
          color: var(--theme-graph-attribute-dark, ${colors.attribute_dark});
          border: solid 1px var(--theme-graph-attribute-dark, ${colors.attribute_dark});
        }

        .type-img-R{
          background-color: var(--theme-graph-role, ${colors.role});
          color: var(--theme-graph-role-dark, ${colors.role_dark});
          border: solid 1px var(--theme-graph-role-dark, ${colors.role_dark});
        }

        .type-img-C{
          background-color: var(--theme-graph-concept, ${colors.concept});
          color: var(--theme-graph-concept-dark, ${colors.concept_dark});
          border: solid 1px var(--theme-graph-concept-dark, ${colors.concept_dark});
        }

        .type-img-I{
          background-color: var(--theme-graph-individual, ${colors.individual});
          color: var(--theme-graph-individual-dark, ${colors.individual_dark});
          border: solid 1px var(--theme-graph-individual-dark, ${colors.individual_dark});
        }

        .sub-row{
          background-color: var(--theme-gscape-primary-dark, ${colors.primary_dark});
          padding: 4px 0 4px 34px;
          cursor: pointer;
        }

        .sub-rows-wrapper{
          padding: 2px 0;
        }

        .add-shadow{
          box-shadow: 0 2px 2px 0 var(--theme-gscape-shadows, ${colors.shadows});
        }

        gscape-head input {
          position:initial;
          left: 30%;
          width: 50%;
          padding: 0 10px;
          line-height:23px;
          box-sizing: border-box;
          background-color: var(--theme-gscape-primary, ${colors.primary});
          border:none;
          border-bottom: 1px solid var(--theme-gscape-shadows, ${colors.shadows});
          transition: width .35s ease-in-out;
          color:inherit;
          flex-grow:2;
          font-size:inherit;
        }

        gscape-head input:focus {
          position:absolute;
          border-color: var(--theme-gscape-secondary, ${colors.secondary});
          left: 34px;
          margin: 0px 8px;
          width:75%;
        }
      `
    ]
  }

  constructor(predicates = []) {
    super();
    this.draggable = true;
    this.collapsible = true;
    this.predicates = predicates;
    this.onNodeNavigation = (nodeID) => {};
  }

  render() {
    function getTypeImg(type) {
      let letter = type.charAt(0).toUpperCase();

      return p`
        <div class="type-img type-img-${letter}">${letter}<div>
      `
    }


    return p`
      <gscape-head title="Explorer">
        <input
          type="text"
          autocomplete="off"
          @keyup="${this.search}"
          placeholder="Search Entities"
        />
      </gscape-head>

      <div class="widget-body hide">
      ${this.predicates.map( occurrences => {
        let entityData = occurrences[0];
        return p`
          <div>
            <div
              id="${entityData.id}"
              class="row highlight"
              type="${entityData.type}"
              displayed_name = "${entityData.displayed_name}"
              iri = "${entityData.iri.fullIri}"
              @click='${this.toggleSubRows}'
            >
              <span class="icon">
                ${entityData.areSubrowsOpen ? arrow_down : arrow_right}
              </span>
              <span>${getTypeImg(entityData.type)}</span>
              <div class="row-label" >${entityData.displayed_name}</div>
            </div>

            <div class="sub-rows-wrapper hide">
            ${occurrences.map( entityInstance => {
              return p`
                <div class="sub-row highlight"
                  diagram_id="${entityInstance.diagram_id}"
                  node_id="${entityInstance.id}"
                  @click="${this.handleNodeSelection}"
                >
                  - ${entityInstance.diagram_name} - ${entityInstance.id_xml}
                </div>
              `
            })}
            </div>
          </div>
        `
      })}
      </div>
    `
  }

  toggleSubRows(e) {
    const iri = e.currentTarget.getAttribute('iri');

    e.currentTarget.parentNode
      .querySelector('.sub-rows-wrapper')
      .classList
      .toggle('hide');

    const entity = this.predicates.find( entityOccurr => entityOccurr[0].iri.fullIri === iri);
    entity[0].areSubrowsOpen = !entity[0].areSubrowsOpen;

    e.currentTarget.classList.toggle('add-shadow');
    this.requestUpdate();
  }

  handleNodeSelection(e) {
    this.collapseBody();
    let node_id = e.target.getAttribute('node_id');
    this.onNodeNavigation(node_id);
  }

  // override
  blur() {
    super.blur();
    this.shadowRoot.querySelector('input').blur();
  }

  firstUpdated() {
    super.firstUpdated();
    this.header.left_icon = explore;
    this.makeDraggableHeadTitle();
  }
}

customElements.define('gscape-explorer', GscapeExplorer);

/**
 * 
 * @param {import('./ontology-explorer').default} ontologyExplorerComponent 
 * @param {import('../../grapholscape').default} grapholscape 
 */
function init$4 (ontologyExplorerComponent, grapholscape) {
  grapholscape.languages;
  let entities = createEntitiesList(grapholscape.ontology.entities);

  ontologyExplorerComponent.onToggleBody = closeAllSubRows.bind(this);
  ontologyExplorerComponent.predicates = entities;

  ontologyExplorerComponent.onNodeNavigation = (nodeID) => grapholscape.centerOnNode(nodeID);
  ontologyExplorerComponent.search = e => {
    closeAllSubRows();
    // on ESC key press
    if (e.keyCode == 27) {
      e.target.blur();
      ontologyExplorerComponent.collapseBody();
      return
    }

    let iris = search(e.target.value);
    ontologyExplorerComponent.showBody();
    if (iris.length > 0) {
      ontologyExplorerComponent.predicates = iris;
    } else {
      // if no results, show all entities
      ontologyExplorerComponent.predicates = entities;
    }
  };



  grapholscape.onRendererChange(() => {
    entities = ontologyExplorerComponent.predicates = createEntitiesList(grapholscape.ontology.entities);
  });

  /**
   * 
   * @param {import("cytoscape").CollectionReturnValue} entities 
   * @returns {Object[][]}
   */
  function createEntitiesList(entities) {
    let result = Object.keys(entities).map(iri => {
      return entities[iri].map( (entity, i) => {
        let entityViewData = entityModelToViewData(entity);
        entityViewData.diagram_name = grapholscape.ontology.getDiagram(entityViewData.diagram_id).name;

        // the first entity occurrence will have the state of subrows wrapper, open or closed
        if (i === 0) {
          entityViewData.areSubrowsOpen = false;
        }

        return entityViewData
      })
    });

    return result.sort((a, b) => a[0].displayed_name.localeCompare(b[0].displayed_name))
  }

  /**
   * 
   * @param {string} searchValue
   * @returns {string[]} array of IRI strings
   */
  function search(searchValue) {

    return entities.filter(iriOccurrences => {
      let entity = iriOccurrences[0];
      for (const word of searchValue.split(' ')) {
        if (word.length <= 2) return
        return matchInIRI(entity.iri, word) ||
          matchInLabel(entity.annotations?.label, word)
      }
      return false
    })


    function matchInIRI(iri, searchValue) {
      let prefixed = iri.prefix + ':' + iri.remainingChars;
      return isMatch(iri.fullIri, searchValue) || isMatch(prefixed, searchValue)
    }

    function matchInLabel(labels, searchValue) {
      // search in labels defined in annotations (only for Graphol v3)
      for (const language in labels) {
        let found = labels[language].some(label => isMatch(label, searchValue));
        // if you return [found] directly you'll skip other languages if it is false!
        if (found) return true
      }

      return false // only if no language has a match
    }

    function isMatch(value1, value2) { return value1.toLowerCase().includes(value2.toLowerCase()) }
  }

  function closeAllSubRows() {
    ontologyExplorerComponent.predicates.forEach( entityOccurr => {
      if (entityOccurr[0].areSubrowsOpen) {
        entityOccurr[0].areSubrowsOpen = false;
        const entityRow = ontologyExplorerComponent.shadowRoot
          .querySelector(`.row[iri = '${entityOccurr[0].iri.fullIri}']`);
        
        entityRow.classList.remove('add-shadow');
        entityRow.parentNode
          .querySelector('.sub-rows-wrapper')
          .classList.add('hide');
      }
    });
    ontologyExplorerComponent.requestUpdate();
  }
}

const ontologyExplorerComponent = new GscapeExplorer();

const ontologyExplorer = (grapholscape) => {
  init$4(ontologyExplorerComponent, grapholscape);
  return ontologyExplorerComponent
};

class GscapeOntologyInfo extends GscapeWidget {

  static get styles() {
    let super_styles = super.styles;
    let colors = super_styles[1];

    return [
      super_styles[0],
      r$1`
        :host {
          display:inline-block;
          position: initial;
          margin-right:10px;
        }

        .gscape-panel {
          padding-right: 0;
        }

        gscape-button {
          position: static;
        }

        .iri-dict th.table-header{
          text-align: center;
          padding: 12px;
          font-weight: bold;
          border-right: 0;
          color: var(--theme-gscape-on-primary, ${colors.on_primary});
        }

        .iri-dict th {
          color: var(--theme-gscape-on-primary, ${colors.on_primary});
          border-right: solid 1px var(--theme-gscape-shadows, ${colors.shadows});
          text-align: left;
          font-weight: normal;
        }

        .wrapper {
          overflow-y: auto;
          scrollbar-width: inherit;
          max-height: 420px;
          overflow-x: hidden;
          padding-right: 10px;
        }

        .section {
          padding-left: 0;
          padding-right: 0;
        }
      `,
    ]
  }

  constructor(ontology) {
    super();
    this.collapsible = true;
    this.ontology = ontology;

    this.btn = new GscapeButton(info_outline);
    this.btn.onClick = this.toggleBody.bind(this);
  }

  render() {
    return p`
      ${this.btn}

      <div class="widget-body hide gscape-panel">
        <div class="gscape-panel-title">Ontology Info</div>

        <div class="wrapper">

          <div class="section">
            <table class="details_table">
              <tr>
                <th>Name</th>
                <td>${this.ontology.name}</td>
              </tr>
              <tr>
                <th>Version</th>
                <td>${this.ontology.version}</td>
              </tr>
            </table>
          </div>

          ${annotationsTemplate(this.ontology)}

          <div class="section">
            <div class="section-header">IRI Prefixes Dictionary</div>
            <table class="iri-dict details_table">
              ${[...this.ontology.namespaces].map(iri => {
                if (!iri.standard) {
                  return p`
                    <tr>
                      <th>${iri.prefixes[0]}</th>
                      <td>${iri.value}</td>
                    </tr>
                  `
                }
              })}
            </table>
          </div>
        </div>
      </div>
    `
  }

  updated() {
    if (this.ontology.description) {
      let descr_container;
      let text;
      Object.keys(this.ontology.description).forEach( language => {
        text = '';
        descr_container = this.shadowRoot.querySelector(`[lang = "${language}"] > .descr-text`);
        this.ontology.description[language].forEach((comment, i) => {
          i > 0 ?
            text += '<p>'+comment.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/')+'</p>' :
            text += comment.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/');
        });
        descr_container.innerHTML = text;
      });
    }
  }

  show() {
    if (this.isEnabled) this.style.display = 'inline-block';
  }
}

customElements.define('gscape-ontology-info', GscapeOntologyInfo);

const ontologyInfo = (ontology) => 
  new GscapeOntologyInfo(ontologyModelToViewData(ontology));

/**
 * Author: Simran
 * Source: https://github.com/Templarian/MaterialDesign/blob/master/svg/owl.svg
 */

var owl_icon = p`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
style="height: 20px; width: auto; padding: 2px;" aria-hidden="true" focusable="false" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M12 16c.56.84 1.31 1.53 2.2 2L12 20.2L9.8 18c.89-.47 1.65-1.16 2.2-2m5-4.8a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m-10 0a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m10-2.5a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m-10 0a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4M2.24 1c1.76 3.7.49 6.46-.69 9.2c-.36.8-.55 1.63-.55 2.5a6 6 0 0 0 6 6c.21-.01.42-.02.63-.05l2.96 2.96L12 23l1.41-1.39l2.96-2.96c.21.03.42.04.63.05a6 6 0 0 0 6-6c0-.87-.19-1.7-.55-2.5C21.27 7.46 20 4.7 21.76 1c-2.64 2.06-6.4 3.69-9.76 3.7C8.64 4.69 4.88 3.06 2.24 1z" fill="currentColor"/></svg>`;

class GscapeOwlVisualizer extends GscapeWidget {
  static get properties() {
    return {
      owl_text: String,
    }
  }
  static get styles() {
    let super_styles = super.styles;
    let colors = super_styles[1];

    return [
      super.styles[0],
      r$1`
        :host {
          left:50%;
          bottom:10px;
          transform: translate(-50%, 0);
          max-width:60%;
        }

        gscape-head {
          --title-text-align: center;
          --title-width: 100%;
        }

        .widget-body {
          margin:0;
          border-top: none;
          border-bottom: 1px solid var(--theme-gscape-shadows, ${colors.shadows});
          border-bottom-left-radius:0;
          border-bottom-right-radius:0;
        }

        .owl-text {
          padding: 15px 10px;
          font-family: "Lucida Console", Monaco, monospace;
          overflow: auto;
          white-space: nowrap;
          line-height: 1.5;
        }

        .owl_concept{
          color: #b58900;
        }

        .owl_role{
          color: #268bd2;
        }

        .owl_attribute{
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
          color: var(--theme-gscape-error, ${colors.error});
        }

        .axiom_predefinite_obj {
          color: #00c0a0;
        }

      `,
    ]
  }

  constructor() {
    super();
    this.collapsible = true;
    this.hiddenDefault = true;
    this.owl_text = '';
    this.header = new GscapeHeader();
    this.header.title = 'Owl Translation';
    this.header.left_icon = owl_icon;
  }

  render() {
    return p`
      <div class="widget-body">
        <div class="owl-text"></div>
      </div>
      ${this.header}
    `
  }

  updated() {
    this.shadowRoot.querySelector('.owl-text').innerHTML = this.owl_text;
  }

  // override
  blur() {
    this.hide();
  }

}

customElements.define('gscape-owl-visualizer', GscapeOwlVisualizer);

/** 
 * @param {import("../model/ontology").Iri} iri 
 * @param {import("../model/node-enums").ElemType} entityType
 */
function entityIriTemplate(iri, entityType) {
  return `<span class="axiom_predicate_prefix">${iri.prefix}</span>:<span class="owl_${entityType}">${iri.remainingChars}</span>`
}

const malformed = '<span class="owl_error">Malformed Axiom</span>';
const missing_operand = '<span class="owl_error">Missing Operand</span>';

function edgeToOwlString (edge) {
  var source = edge.source();
  var target = edge.target();

  switch (edge.data('type')) {
    case 'inclusion':
      if (source.data('identity') == 'concept' && target.data('identity') == 'concept') {
        if (source.data('type') == 'domain-restriction' && source.data('displayed_name') != 'self' && target.data('displayed_name') != 'self') {
          return propertyDomain(edge)
        } else if (source.data('type') == 'range-restriction' && source.data('displayed_name') != 'self' && target.data('displayed_name') != 'self') {
          return propertyRange(edge)
        } else if (target.data('type') == 'complement' || source.data('type') == 'complement') {
          return disjointClassesFromEdge(edge.connectedNodes())
        }

        return subClassOf(edge)
      } else if (source.data('identity') == 'role' && target.data('identity') == 'role') {
        if (target.data('type') == 'complement') {
          return disjointTypeProperties(edge)
        }
        return subTypePropertyOf(edge)
      } else if (source.data('identity') == 'value_domain' && target.data('identity') == 'value_domain') {
        return propertyRange(edge)
      } else if (source.data('identity') == 'attribute' && target.data('identity') == 'attribute') {
        if (target.data('type') == 'complement') {
          return disjointTypeProperties(edge)
        } else { return subTypePropertyOf(edge) }
      } else { return malformed }

    case 'equivalence':
      if (source.data('identity') == 'concept' && target.data('identity') == 'concept') {
        return equivalentClasses(edge)
      } else if (source.data('identity') == 'role' && target.data('identity') == 'role') {
        if (source.data('type') == 'role-inverse' || target.data('type') == 'role-inverse') { return inverseObjectProperties(edge) } else { return equivalentTypeProperties(edge) }
      } else if (source.data('identity') == 'attribute' && target.data('identity') == 'attribute') {
        return equivalentTypeProperties(edge)
      } else { return malformed }

    case 'membership':
      if (target.data('identity') == 'concept') { return classAssertion(edge) } else { return propertyAssertion(edge) }
  }
}

function propertyAssertion (edge) {
  var axiom_type = 'Object';
  var owl_string;

  if (edge.target().data('identity') == 'attribute') {
    axiom_type = 'Data';
  }

  owl_string = axiom_type + 'PropertyAssertion(' + nodeToOwlString(edge.target()) + ' ';

  if (edge.source().data('type') == 'property-assertion') {
    var property_node = edge.source();

    property_node.incomers('[type = "input"]').sources().forEach( input => {
      owl_string += nodeToOwlString(input) + ' ';
    });

    owl_string = owl_string.slice(0, owl_string.length - 1);
  } else {
    owl_string += nodeToOwlString(edge.source());
  }

  return owl_string + ')'
}

function classAssertion (edge) {
  return 'ClassAssertion(' + nodeToOwlString(edge.source()) + ' ' + nodeToOwlString(edge.target()) + ')'
}

function inverseObjectProperties (edge) {
  var complement_input;
  var input;
  if (edge.source().data('type') == 'role-inverse') {
    input = edge.target();
    complement_input = edge.source().incomers('[type = "input"]').sources().first();
  } else {
    input = edge.source();
    complement_input = edge.target().incomers('[type = "input"]').sources().first();
  }

  if (!complement_input.length) { return missing_operand }

  return 'InverseObjectProperties(' + nodeToOwlString(input) + ' ' + nodeToOwlString(complement_input) + ')'
}

function equivalentClasses (edge) {
  return 'EquivalentClasses(' + nodeToOwlString(edge.source()) + ' ' + nodeToOwlString(edge.target()) + ')'
}

function equivalentTypeProperties (edge) {
  var axiom_type;
  if (edge.source().data('idenity') == 'role') { axiom_type = 'Object'; } else { axiom_type = 'Data'; }

  return 'Equivalent' + axiom_type + 'Properties(' + nodeToOwlString(edge.source()) + ' ' + nodeToOwlString(edge.target()) + ')'
}

function subClassOf (edge) {
  return 'SubClassOf(' + nodeToOwlString(edge.source()) + ' ' + nodeToOwlString(edge.target()) + ')'
}

function subTypePropertyOf (edge) {
  var axiom_type;

  if (edge.target().data('identity') == 'role') { axiom_type = 'Object'; } else if (edge.target().data('type') == 'attribute') { axiom_type = 'Data'; } else { return null }

  return 'Sub' + axiom_type + 'PropertyOf(' + nodeToOwlString(edge.source()) + ' ' + nodeToOwlString(edge.target()) + ')'
}

function propertyDomain (edge) {
  var node = edge.source().incomers('[type = "input"]').sources();

  if (node.size() > 1) { return subClassOf(edge) }

  if (node.data('type') == 'role') { return 'ObjectPropertyDomain(' + nodeToOwlString(node) + ' ' + nodeToOwlString(edge.target()) + ')' } else if (node.data('type') == 'attribute') { return 'DataPropertyDomain(' + nodeToOwlString(node) + ' ' + nodeToOwlString(edge.target()) + ')' }
}

function propertyRange (edge) {
  var node = edge.source().incomers('[type = "input"]').sources();

  if (node.size() > 1) { return subClassOf(edge) }

  if (node.data('type') == 'role') { return 'ObjectPropertyRange(' + nodeToOwlString(node) + ' ' + nodeToOwlString(edge.target()) + ')' } else if (node.data('type') == 'attribute') { return 'DataPropertyRange(' + nodeToOwlString(node) + ' ' + nodeToOwlString(edge.target()) + ')' }
}

function disjointClassesFromEdge (inputs) {
  var owl_string = 'DisjointClasses(';

  inputs.forEach(function (input) {
    if (input.data('type') == 'complement') {
      input = input.incomers('[type = "input"]').source();
    }
    owl_string += nodeToOwlString(input) + ' ';
  });

  owl_string = owl_string.slice(0, owl_string.length - 1);
  owl_string += ')';
  return owl_string
}

function disjointTypeProperties (edge) {
  var axiom_type, owl_string;

  if (edge.target().data('identity') == 'role') { axiom_type = 'Object'; } else if (edge.target().data('identity') == 'attribute') { axiom_type = 'Data'; } else { return null }

  owl_string = 'Disjoint' + axiom_type + 'Properties(';

  edge.connectedNodes().forEach(function (node) {
    if (node.data('type') == 'complement') {
      node = node.incomers('[type = "input"]').source();
    }
    owl_string += nodeToOwlString(node) + ' ';
  });

  owl_string = owl_string.slice(0, owl_string.length - 1);
  return owl_string + ')'
}

const owl_thing = '<span class="axiom_predicate_prefix">owl:</span><span class="axiom_predefinite_obj">Thing</span>';
const rdfs_literal = '<span class="axiom_predicate_prefix">rdfs:</span><span class="axiom_predefinite_obj">Literal</span>';
const not_defined = 'Undefined';

function nodeToOwlString (node, from_node) {
  
  var from_node_flag = from_node || null;

  if (from_node_flag && (node.hasClass('predicate') || node.data('type') == 'value-domain')) {
    var owl_predicate = entityIriTemplate(node.data('iri'), node.data('type'));
    var owl_type;

    switch (node.data('type')) {
      case 'concept':
        owl_type = 'Class';
        return 'Declaration(' + owl_type + '(' + owl_predicate + '))'

      case 'role':
        owl_type = 'ObjectProperty';
        var owl_string = 'Declaration(' + owl_type + '(' + owl_predicate + '))';

        if (node.data('functional')) { owl_string += '<br/>Functional' + owl_type + '(' + owl_predicate + ')'; }

        if (node.data('inverseFunctional')) { owl_string += '<br/>InverseFunctional' + owl_type + '(' + owl_predicate + ')'; }

        if (node.data('asymmetric')) { owl_string += '<br />Asymmetric' + owl_type + '(' + owl_predicate + ')'; }

        if (node.data('irreflexive')) { owl_string += '<br/>Irreflexive' + owl_type + '(' + owl_predicate + ')'; }

        if (node.data('reflexive')) { owl_string += '<br/>Reflexive' + owl_type + '(' + owl_predicate + ')'; }

        if (node.data('symmetric')) { owl_string += '<br/>Symmetric' + owl_type + '(' + owl_predicate + ')'; }

        if (node.data('transitive')) { owl_string += '<br/>Transitive' + owl_type + '(' + owl_predicate + ')'; }

        return owl_string

      case 'attribute':
        owl_type = 'DataProperty';
        var owl_string = 'Declaration(' + owl_type + '(' + owl_predicate + '))';

        if (node.data('functional')) { owl_string += '<br/>Functional' + owl_type + '(' + owl_predicate + '))'; }

        return owl_string

      case 'individual':
        if (node.data('iri').remainingChars.search(/"[\w]+"\^\^[\w]+:/) != -1) {
          var value = node.data('iri').remainingChars.split('^^')[0];
          var datatype = node.data('iri').remainingChars.split(':')[1];

          owl_predicate = '<span class="owl_value">' + value + '</span>^^' +
          '<span class="axiom_predicate_prefix">' + node.data('iri').prefix + '</span>' +
          '<span class="owl_value-domain">' + datatype + '</span>';
        }
        owl_type = 'NamedIndividual';
        return 'Declaration(' + owl_type + '(' + owl_predicate + '))'

      case 'value-domain':
        owl_type = 'Datatype';
        return 'Declaration(' + owl_type + '(' + owl_predicate + '))'
    }
  }

  switch (node.data('type')) {
    case 'individual':
      if (node.data('iri').remainingChars.search(/"[\w]+"\^\^[\w]+:/) != -1) {
        var value = node.data('iri').remainingChars.split('^^')[0];
        var datatype = node.data('iri').remainingChars.split(':')[1];

        return '<span class="owl_value">' + value + '</span>^^' +
        '<span class="axiom_predicate_prefix">' + node.data('iri').prefix + '</span>' +
        '<span class="owl_value-domain">' + datatype + '</span>'
      }

    case 'concept':
    case 'role':
    case 'value-domain':
    case 'attribute':
    case 'individual':
      return entityIriTemplate(node.data('iri'), node.data('type'))

    case 'facet':
      var rem_chars = node.data('displayed_name').replace(/\n/g, '^').split('^^');
      rem_chars[0] = rem_chars[0].slice(4);
      return '<span class="axiom_predicate_prefix">xsd:</span><span class="owl_value-domain">' + rem_chars[0] + '</span><span class="owl_value">' + rem_chars[1] + '</span>'

    case 'domain-restriction':
    case 'range-restriction':
      var input_edges = node.connectedEdges('edge[target = "' + node.id() + '"][type = "input"]');
      var input_first; var input_other;
      if (!input_edges.length) { return missing_operand }

      input_edges.forEach(function (e) {
        if (e.source().data('type') == 'role' || e.source().data('type') == 'attribute') {
          input_first = e.source();
        }

        if (e.source().data('type') != 'role' && e.source().data('type') != 'attribute') {
          input_other = e.source();
        }
      });

      if (input_first) {
        if (input_first.data('type') == 'attribute' && node.data('type') == 'range-restriction') { return not_defined }

        if (node.data('displayed_name') == 'exists') { return someValuesFrom(input_first, input_other, node.data('type')) } else if (node.data('displayed_name') == 'forall') { return allValuesFrom(input_first, input_other, node.data('type')) } else if (node.data('displayed_name').search(/\(([-]|[\d]+),([-]|[\d]+)\)/) != -1) {
          var cardinality = node.data('displayed_name').replace(/\(|\)/g, '').split(/,/);
          return minMaxExactCardinality(input_first, input_other, cardinality, node.data('type'))
        } else if (node.data('displayed_name') == 'self') {
          return hasSelf(input_first, node.data('type'))
        }
      } else return missing_operand

    case 'role-inverse':
      var input = node.incomers('[type = "input"]').sources();

      if (!input.length) { return missing_operand }

      return objectInverseOf(input)

    case 'role-chain':
      if (!node.data('inputs')) { return missing_operand }

      return objectPropertyChain(node.incomers('[type = "input"]').sources())

    case 'union':
    case 'intersection':
    case 'complement':
    case 'enumeration':
    case 'disjoint-union':
      var inputs = node.incomers('[type = "input"]').sources();
      if (!inputs.length) { return missing_operand }

      var axiom_type = 'Object';

      if (node.data('identity') != 'concept' && node.data('identity') != 'role') { axiom_type = 'Data'; }

      if (node.data('type') == 'disjoint-union') {
        if (!from_node_flag) {
          return logicalConstructors(inputs, 'union', axiom_type)
        } else {
          return logicalConstructors(inputs, 'union', axiom_type) + '<br />' + disjointClassesFromNode(inputs)
        }
      }

      return logicalConstructors(inputs, node.data('type'), axiom_type)

    case 'datatype-restriction':
      inputs = node.incomers('[type = "input"]').sources();
      if (!inputs.length) { return missing_operand }

      return datatypeRestriction(inputs)

    case 'property-assertion':
      return not_defined

    case 'has-key':
      inputs = node.incomers('[type = "input"]');
      if (!inputs.length || inputs.length < 2)
        return missing_operand

      return hasKey(inputs.sources())
  }
}


function someValuesFrom (first, other, restr_type) {
  var axiom_type, owl_string;
  if (first.data('type') == 'role') { axiom_type = 'Object'; }

  if (first.data('type') == 'attribute') { axiom_type = 'Data'; }

  owl_string = axiom_type + 'SomeValuesFrom(';

  // if the node is a range-restriction, put the inverse of the role
  if (restr_type == 'range-restriction') { owl_string += objectInverseOf(first); } else { owl_string += nodeToOwlString(first); }

  if (!other && axiom_type == 'Object') { return owl_string += ' ' + owl_thing + ')' }

  if (!other && axiom_type == 'Data') { return owl_string += ' ' + rdfs_literal + ')' }

  return owl_string += ' ' + nodeToOwlString(other) + ')'
}

function allValuesFrom (first, other, restr_type) {
  var axiom_type, owl_string;
  if (first.data('type') == 'role') { axiom_type = 'Object'; }

  if (first.data('type') == 'attribute') { axiom_type = 'Data'; }

  owl_string = axiom_type + 'AllValuesFrom(';

  // if the node is a range-restriction, put the inverse of the role
  if (restr_type == 'range-restriction') { owl_string += objectInverseOf(first); } else { owl_string += nodeToOwlString(first); }

  if (!other && axiom_type == 'Object') { return owl_string += ' ' + owl_thing + ')' }

  if (!other && axiom_type == 'Data') { return owl_string += ' ' + rdfs_literal + ')' }

  return owl_string += ' ' + nodeToOwlString(other) + ')'
}

function minMaxExactCardinality (first, other, cardinality, restr_type) {
  var axiom_type;
  if (first.data('type') == 'role') { axiom_type = 'Object'; }

  if (first.data('type') == 'attribute') { axiom_type = 'Data'; }

  if (cardinality[0] == '-') {
    if (restr_type == 'range-restriction') {
      if (!other) { return axiom_type + 'MaxCardinality(' + cardinality[1] + ' ' + objectInverseOf(first) + ')' } else { return axiom_type + 'MaxCardinality(' + cardinality[1] + ' ' + objectInverseOf(first) + ' ' + nodeToOwlString(other) + ')' }
    } else {
      if (!other) { return axiom_type + 'MaxCardinality(' + cardinality[1] + ' ' + nodeToOwlString(first) + ')' } else { return axiom_type + 'MaxCardinality(' + cardinality[1] + ' ' + nodeToOwlString(first) + ' ' + nodeToOwlString(other) + ')' }
    }
  }

  if (cardinality[1] == '-') {
    if (restr_type == 'range-restriction') {
      if (!other) { return axiom_type + 'MinCardinality(' + cardinality[0] + ' ' + objectInverseOf(first) + ')' } else { return axiom_type + 'MinCardinality(' + cardinality[0] + ' ' + objectInverseOf(first) + ' ' + nodeToOwlString(other) + ')' }
    } else {
      if (!other) { return axiom_type + 'MinCardinality(' + cardinality[0] + ' ' + nodeToOwlString(first) + ')' } else { return axiom_type + 'MinCardinality(' + cardinality[0] + ' ' + nodeToOwlString(first) + ' ' + nodeToOwlString(other) + ')' }
    }
  }

  if (cardinality[0] != '-' && cardinality[1] != '-') {
    var min = []; var max = [];

    min.push(cardinality[0]);
    min.push('-');

    max.push('-');
    max.push(cardinality[1]);

    return axiom_type + 'IntersectionOf(' + minMaxExactCardinality(first, other, min, restr_type) + ' ' + minMaxExactCardinality(first, other, max, restr_type) + ')'
  }
}

function objectInverseOf (node) {
  return 'ObjectInverseOf(' + nodeToOwlString(node) + ')'
}

function objectPropertyChain (inputs) {
  var owl_string = 'ObjectPropertyChain(';
  inputs.forEach( input => {
    owl_string += nodeToOwlString(input) + ' ';
  });

  owl_string = owl_string.slice(0, owl_string.length - 1);
  owl_string += ')';
  return owl_string
}

function hasKey(inputs) {
  
  let class_node = inputs.filter('[identity = "concept"]');
  let owl_string = 'HasKey(' + nodeToOwlString(class_node) + ' ';
  
  inputs.forEach(input => {
    if (input.id() != class_node.id()) {
      owl_string += nodeToOwlString(input) + ' ';
    }
  });
  
  owl_string = owl_string.slice(0, owl_string.length - 1) + ')';
  return owl_string
}

function logicalConstructors (inputs, constructor_name, axiom_type) {
  var owl_string;

  if (constructor_name == 'enumeration') { constructor_name = 'One'; } else // Capitalize first char
  { constructor_name = constructor_name.charAt(0).toUpperCase() + constructor_name.slice(1); }

  owl_string = axiom_type + constructor_name + 'Of(';

  inputs.forEach(function (input) {
    owl_string += nodeToOwlString(input) + ' ';
  });

  owl_string = owl_string.slice(0, owl_string.length - 1);
  owl_string += ')';

  return owl_string
}

function disjointClassesFromNode (inputs) {
  var owl_string = 'DisjointClasses(';

  inputs.forEach(function (input) {
    owl_string += nodeToOwlString(input) + ' ';
  });

  owl_string = owl_string.slice(0, owl_string.length - 1);
  owl_string += ')';
  return owl_string
}

function datatypeRestriction (inputs) {
  var owl_string = 'DatatypeRestriction(';

  var value_domain = inputs.filter('[type = "value-domain"]').first();

  owl_string += nodeToOwlString(value_domain) + ' ';

  inputs.forEach(function (input) {
    if (input.data('type') == 'facet') {
      owl_string += nodeToOwlString(input) + '^^';
      owl_string += nodeToOwlString(value_domain) + ' ';
    }
  });
  owl_string = owl_string.slice(0, owl_string.length - 1);
  owl_string += ')';
  return owl_string
}

function hasSelf (input, restr_type) {
  // if the restriction is on the range, put the inverse of node
  if (restr_type == 'range-restriction') { return 'ObjectHasSelf(' + objectInverseOf(input) + ')' }

  return 'ObjectHasSelf(' + nodeToOwlString(input) + ')'
}

/**
 * 
 * @param {import('./owl-visualizer').default} owlVisualizerComponent 
 * @param {import('../../grapholscape').default} grapholscape
 */
function init$3(owlVisualizerComponent, grapholscape) {
  grapholscape.onNodeSelection( node => showOwlTranslation(node));
  grapholscape.onEdgeSelection( edge => showOwlTranslation(edge));
  grapholscape.onRendererChange( rendererKey => {
    if (rendererKey !== 'default')
      owlVisualizerComponent.hide();
  });

  function showOwlTranslation(elem) {
    let grapholElem = cyToGrapholElem(elem);
    if (grapholscape.actualRenderingMode === 'default') {
      if (grapholElem.group === 'nodes')
        owlVisualizerComponent.owl_text = nodeToOwlString(elem, true);
      else
        owlVisualizerComponent.owl_text = edgeToOwlString(elem);

      owlVisualizerComponent.show();
    }
  }
}

const owlVisualizerComponent = new GscapeOwlVisualizer();

const owlVisualizer = (grapholscape) => {
  init$3(owlVisualizerComponent, grapholscape);
  return owlVisualizerComponent
};

class GscapeRenderSelector extends GscapeWidget {

  static get properties() {
    return {
      actual_mode : { type : String }
    }
  }

  static get styles() {
    let super_styles = super.styles;
    let colors = super_styles[1];

    return [
      super_styles[0],
      r$1`
        :host {
          display:inline-block;
          position:initial;
          margin-right:10px;
        }

        .renderer-item {
          cursor:pointer;
          padding:5px 10px;
          display: flex;
          align-items: center;
        }

        .renderer-item:hover {
          color: var(--theme-gscape-on-secondary, ${colors.on_secondary});
          background-color:var(--theme-gscape-secondary, ${colors.secondary});
        }

        .renderer-item:first-of-type {
          border-top-left-radius: inherit;
          border-top-right-radius: inherit;
        }

        .renderer-item > .label {
          padding:0 10px;
        }

        .selected {
          background-color: var(--theme-gscape-primary-dark, ${colors.primary_dark});
          color: var(--theme-gscape-on-primary-dark, ${colors.on_primary_dark});
          font-weight: bold;
        }

        .widget-body {
          margin:0;
          border-top: none;
          border-bottom: 1px solid var(--theme-gscape-shadows, ${colors.shadows});
          border-radius: inherit;
          border-bottom-left-radius:0;
          border-bottom-right-radius:0;
        }

        gscape-head {
          --header-padding: 5px 8px;
        }

        svg {
          margin-right:8px;
        }
      `,
    ]
  }

  constructor(dict = {}) {
    super();
    this.collapsible = true;

    this.dict = dict;
    this._actual_mode = null;
    this._onRendererChange = () => {};

    this.header = new GscapeHeader('');
    //this.header.title = this.dict[this.actual_mode]?.label
    //this.header.left_icon = this.dict[this.actual_mode]?.icon
  }

  render() {
    return p`
      <div class="widget-body hide">
        ${Object.keys(this.dict).map( mode => p`
        <div
          @click="${this.changeRenderer}"
          mode="${mode}"
          class="renderer-item ${mode == this.actual_mode ? `selected` : ``}"
        >
        ${this.isCustomIcon(this.dict[mode].icon) ? p`
          <mwc-icon-button>${this.dict[mode].icon}</mwc-icon-button>`
        : p`
          <mwc-icon-button icon="${this.dict[mode].icon}"></mwc-icon-button>
        `}
        <span class="label">${this.dict[mode].label}</span>
        </div>
        `)}
      </div>

     ${this.header}
    `
  }

  changeRenderer(e) {
    if (this.shadowRoot.querySelector('.selected'))
      this.shadowRoot.querySelector('.selected').classList.remove('selected');

    let target = e.currentTarget;
    target.classList.add('selected');
    let mode = target.getAttribute('mode');
    this.actual_mode = mode;
    this.toggleBody();
    this._onRendererChange(mode);
  }

  firstUpdated() {
    super.firstUpdated();
    // invert header's dropdown icon behaviour
    this.header.invertIcons();
  }

  set onRendererChange(f) {
    this._onRendererChange = f;
  }

  show() {
    if (this.isEnabled) this.style.display = 'inline-block';
  }

  set actual_mode(mode) {
    this._actual_mode = mode;

    this.header.title = this.dict[mode].label;
    this.header.left_icon = this.dict[mode].icon;
  }

  get actual_mode() { return this._actual_mode }
}

customElements.define('gscape-render-selector', GscapeRenderSelector);

var graphol_icon = p`<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
  viewBox="0 0 12 12" fill="currentColor" xml:space="preserve" style="height: 20px; width: auto; padding: 2px;">
<path id="path847" d="M5.4,11.9c-1.4-0.1-2.7-0.8-3.8-1.8c-0.8-0.8-1.3-1.8-1.6-3C0.1,6.8,0.1,6.7,0.1,6c0-0.7,0-0.8,0.1-1.1
 c0.3-1.2,0.8-2.3,1.7-3.1C2.3,1.3,2.7,1,3.3,0.7c1.7-0.9,3.8-0.9,5.5,0c2.4,1.3,3.6,3.9,3.1,6.5c-0.6,2.6-2.8,4.5-5.5,4.7
 C5.8,12,5.8,12,5.4,11.9L5.4,11.9z M6.5,10.5c0.2-0.1,0.3-0.1,0.8-0.7c0.3-0.3,1.2-1.2,2-1.9c1.1-1.1,1.3-1.4,1.4-1.5
 c0.2-0.4,0.2-0.7,0-1.1c-0.1-0.2-0.2-0.3-1-1.1c-1-1-1.1-1-1.6-1c-0.5,0-0.5,0-1.9,1.4C5.5,5.2,5,5.8,5,5.8c0,0,0.2,0.3,0.5,0.6
 L6,6.9l1-1l1-1l0.5,0.5l0.5,0.5L7.6,7.4L6,8.9L4.5,7.4L2.9,5.8L5,3.7c1.1-1.1,2.1-2.1,2.1-2.1c0-0.1-1-1-1-1c0,0-1,1-2.3,2.2
 c-2,2-2.3,2.3-2.3,2.4C1.3,5.5,1.3,5.7,1.3,6c0.1,0.4,0,0.4,2.1,2.4c1.1,1.1,1.9,1.9,2,2C5.7,10.6,6.1,10.6,6.5,10.5z"/>
</svg>`;

let icons = {
  'default': graphol_icon,
  'lite': lite,
  'float': bubbles
};

/**
 * 
 * @param {import('./index').default} rendererSelector 
 * @param {import('../../grapholscape').default} grapholscape 
 */
function init$2(rendererSelector, grapholscape) {
  Object.keys(grapholscape.renderersManager.renderers).forEach(key => {
    let renderer = grapholscape.renderersManager.renderers[key];
    rendererSelector.dict[key] = rendererModelToViewData(renderer);
    rendererSelector.dict[key].icon = icons[key];
  });
  rendererSelector.actual_mode = grapholscape.renderer.key;
  rendererSelector.onRendererChange = (rendererName) => grapholscape.setRenderer(rendererName);

  grapholscape.onRendererChange( rendererKey => rendererSelector.actual_mode = rendererKey);
}

const rendererSelectorComponent = new GscapeRenderSelector();

const rendererSelector = (grapholscape) => {
  init$2(rendererSelectorComponent, grapholscape);
  return rendererSelectorComponent
};

const grapholscape = p`<?xml version="1.0" encoding="utf-8"?>
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

class GscapeSettings extends GscapeWidget {

  static get styles() {
    let super_styles = super.styles;
    super_styles[1];

    return [
      super_styles[0],
      r$1`
        :host {
          display:inline-block;
          position: initial;
          margin-right:10px;
        }

        gscape-button {
          position: static;
        }

        .gscape-panel {
          padding-right: 0;
        }

        .settings-wrapper {
          overflow-y: auto;
          scrollbar-width: inherit;
          max-height: 420px;
          overflow-x: hidden;
          white-space: nowrap;
          padding-right: 20px;
        }

        .area {
          margin-bottom: 30px;
        }

        .area:last-of-type {
          margin-bottom: 0;
        }

        .area-title {
          font-weight: bold;
          margin-bottom: 5px;
          font-size: 105%;
        }

        .setting {
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .title-wrap {
          margin-right: 50px;
        }

        .setting-label {
          font-size : 12px;
          opacity: 0.7;
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
          font-size: 14px;
        }
      `,
    ]
  }

  constructor(settings = null) {
    super();
    this.collapsible = true;
    this.settings = settings;
    this.btn = new GscapeButton(settings$1);
    this.btn.onClick = this.toggleBody.bind(this);
    this.callbacks = {};

    this.savePNGButton = new GscapeButton(save);
    this.savePNGButton.label = 'PNG';
    this.saveSVGButton = new GscapeButton(save);
    this.saveSVGButton.label = 'SVG';
  }

  render() {
    return p`
      ${this.btn}

      <div class="widget-body hide gscape-panel">
        <div class="gscape-panel-title">Settings</div>

        <div class="settings-wrapper">

      ${Object.keys(this.settings).map( area_entry => {
        if (area_entry == 'default')
          return p``

        let area = this.settings[area_entry];
        return p`
          <div class="area">
            <div class="area-title">${capitalizeFirstLetter(area_entry)}</div>

        ${Object.keys(area).map( setting_entry => {
          let setting = area[setting_entry];
          return p`
            <div class="setting">
              <div class="title-wrap">
                <div class="setting-title">${setting.title}</div>
                <div class="setting-label">${setting.label}</div>
              </div>
            ${setting.type == 'list' ?
              p`
                <div class="setting_obj">
                  <select area="${area_entry}" id="${setting_entry}" @change="${this.onListChange}">
                    ${setting.list.map(option => {
                      if (option.value == '') return
                      let selected = option.value == setting.selected;
                      return p`<option value="${option.value}" ?selected=${selected}>${option.label}</option>`
                    })}
                  </select>
                </div>
              ` : p``
            }

            ${setting.type == 'boolean' ?
              p`
                ${new GscapeToggle(setting_entry, setting.enabled, false, '', this.onToggleChange.bind(this))}
              ` : p``
            }
            </div>
          `
        })}
        </div>
        `
      })}

        <div class="area">
          <div class="area-title">Export Ontology Image</div>
          <div class="setting">
            <div class="title-wrap">
              <div class="setting-title">Image</div>
              <div class="setting-label">Save a PNG image of the current diagram on your disk</div>
            </div>

            <div class="setting-obj">
              ${this.savePNGButton}
            </div>
          </div>

          <div class="setting">
          <div class="title-wrap">
            <div class="setting-title">Vectorial</div>
            <div class="setting-label">Save an SVG of the current diagram on your disk</div>
          </div>

          <div class="setting-obj">
            ${this.saveSVGButton}
          </div>
        </div>
        </div>

        <div class="area">
          <div class="area-title">About</div>
          <div id="logo">
            ${grapholscape}
          </div>

          <div id="version">
            <span>Version: </span>
            <span>${"2.0.0-beta.1"}</span>
          </div>
        </div>
      </div>
    `

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }

  updated(changedProperties) {
    /**
     * when controller change a property in this.settings, lit element doesn't see it
     * (this.settings should be assigned to a completely new object (new reference)
     * for lit element to notice it).
     * So controller forces the update and in that case litElement will update even if
     * no property has changed.
     * So if it has been updated forcefully from controller, then react to each change
     */
    if( changedProperties.size == 0) {
      this.shadowRoot.querySelectorAll('select').forEach( list => {
        this.onListChange({target: list});
      });
      this.shadowRoot.querySelectorAll('gscape-toggle').forEach( toggle => {
        // onToggleChange uses toggle.id because it gets the <input> elem
        toggle.id = toggle.key;
        this.onToggleChange({ target: toggle });
      });
    }
  }

  onListChange(e) {
    let selection = e.target;
    let area = selection.getAttribute('area');
    this.settings[area][selection.id].selected = selection.value;
    this.callbacks[selection.id](selection.value);
  }

  onToggleChange(e) {
    let toggle = e.target;
    this.settings.widgets[toggle.id].enabled = toggle.checked;

    toggle.checked ?
      this.callbacks.widgetEnable(toggle.id) :
      this.callbacks.widgetDisable(toggle.id);
  }


  set onEntityNameSelection(foo) {
    this.callbacks.entity_name = foo;
  }

  set onLanguageSelection(foo) {
    this.callbacks.language = foo;
  }

  set onThemeSelection(foo) {
    this.callbacks.theme = foo;
  }

  set onWidgetEnabled(foo) {
    this.callbacks.widgetEnable = foo;
  }

  set onWidgetDisabled(foo) {
    this.callbacks.widgetDisable = foo;
  }

  set onPNGSaveButtonClick(foo) {
    this.savePNGButton.onClick = foo;
  }

  set onSVGSaveButtonClick(foo) {
    this.saveSVGButton.onClick = foo;
  }

  show() {
    if (this.isEnabled) this.style.display = 'inline-block';
  }
}

customElements.define('gscape-settings', GscapeSettings);

/**
 * @param {GscapeSettings} settingsComponent
 * @param {Grapholscape} grapholscape 
 */
function init$1(settingsComponent, grapholscape) {
  settingsComponent.settings = grapholscape.config;
  settingsComponent.onEntityNameSelection = (entityNameType) => { 
    grapholscape.changeEntityNameType(entityNameType);
  };
  settingsComponent.onLanguageSelection = (language) => { grapholscape.changeLanguage(language); };
  settingsComponent.onThemeSelection = (themeKey) => grapholscape.applyTheme(themeKey);
  settingsComponent.onPNGSaveButtonClick = () => grapholscape.exportToPNG();
  settingsComponent.onSVGSaveButtonClick = () => grapholscape.exportToSVG();

  grapholscape.onLanguageChange( language => updateOnChange('language', language));
  grapholscape.onEntityNameTypeChange( entityNameType => updateOnChange('entity_name', entityNameType) );
  grapholscape.onThemeChange( (_ , themeKey) => updateOnChange('theme', themeKey));

  function updateOnChange(settingID, newValue) {
    let select = settingsComponent.shadowRoot.querySelector(`#${settingID}`);
    let option = Array.from(select.options)?.find( o => o.value === newValue);

    if (option) {
      option.selected = true;
      
      let languageSelect = settingsComponent.shadowRoot.querySelector('#language');
      if (select.id == 'entity_name') 
        languageSelect.disabled = (select.value !== 'label');
    }
  }
}

const settingsComponent = new GscapeSettings();

const settings = (grapholscape) => {
  init$1(settingsComponent, grapholscape);
  return settingsComponent
};

class GscapeZoomTools extends GscapeWidget {

  static get styles() {
    let super_styles = super.styles;
    let colors = super_styles[1];

    return [
      super_styles[0],
      r$1`
        :host {
          position: absolute;
          bottom:52px;
          right:10px;
        }

        gscape-button{
          position: static;
          box-shadow: initial;
        }

        #hr {
          height:1px;
          width:90%;
          margin: 2px auto 0 auto;
          background-color: var(--theme-gscape-shadows, ${colors.shadows})
        }

      `
    ]
  }
  constructor() {
    super();

    this.btn_plus = new GscapeButton(plus);
    this.btn_minus = new GscapeButton(minus);

    this._onZoomIn = null;
    this._onZoomOut = null;
  }

  render() {
    return p`
      ${this.btn_plus}
      <div id="hr"></div>
      ${this.btn_minus}
    `
  }

  set onZoomIn(f) {
    this._onZoomIn = f;
    this.btn_plus.onClick = this._onZoomIn;
  }

  set onZoomOut(f) {
    this._onZoomOut= f;
    this.btn_minus.onClick = this._onZoomOut;
  }
}

customElements.define('gscape-zoom-tools', GscapeZoomTools);

const zoomTools = (grapholscape) => {
  const zoomToolsComponent = new GscapeZoomTools();
  zoomToolsComponent.onZoomIn = () => grapholscape.zoomIn();
  zoomToolsComponent.onZoomOut = () => grapholscape.zoomOut();
  return zoomToolsComponent
};

/** @param {import('../grapholscape').default} */
const fitButton = (grapholscape) => {
  const fitButtonComponent = new GscapeButton(center_diagram);
  fitButtonComponent.style.bottom = '10px';
  fitButtonComponent.style.right = '10px';
  fitButtonComponent.onClick = () => grapholscape.fit();
  return fitButtonComponent
};

var bottomLeftContainer = () => {
  let div = document.createElement('div');
  div.style.setProperty('position','absolute');
  div.style.setProperty('bottom','0');
  div.style.setProperty('left','0');
  div.style.setProperty('margin','10px');
  div.style.setProperty('display','flex');
  div.style.setProperty('align-items','flex-end');

  return div
};

const widgetNames = {
  explorer: 'gscape-explorer',
  details: 'gscape-entity-details',
  owl_translator: 'gscape-owl-visualizer',
  filters: 'gscape-filters',
  simplifications: 'gscape-render-selector',
};

/**
 * Initialize the UI
 * @param {import('../grapholscape').default} grapholscape 
 */
function init (grapholscape) {
  const init = () => {
    let gui_container = document.createElement('div');

    const diagramSelectorComponent = diagramSelector(grapholscape);
    const entityDetailsComponent = entityDetails(grapholscape);

    const zoomToolsComponent = zoomTools(grapholscape);
    const ontologyInfoComponent = ontologyInfo(grapholscape.ontology);
    const fullscreenComponent = fullscreenButton(grapholscape.container);
    const fitButtonComponent = fitButton(grapholscape);
    const ontologyExplorerComponent = ontologyExplorer(grapholscape);
    const owlVisualizerComponent = owlVisualizer(grapholscape);
    const filterComponent = filters(grapholscape);
    const settingsComponent = settings(grapholscape);
    settingsComponent.onWidgetEnabled = (widgetName) => {
      gui_container.querySelector(widgetNames[widgetName]).enable();
      storeConfigEntry(widgetName, true);
    };
    settingsComponent.onWidgetDisabled = (widgetName) => {
      gui_container.querySelector(widgetNames[widgetName]).disable();
      storeConfigEntry(widgetName, false);
    };
    const rendererSelectorComponent = rendererSelector(grapholscape);
    const layoutSettingsComponent = layoutSettings(grapholscape);

    // USING GRAPHOLSCAPE CALLBACKS
    grapholscape.onBackgroundClick(() => {
      blurAll(gui_container);
    });
    grapholscape.onNodeSelection(node => {
      let grapholNode = cyToGrapholElem(node);
      if (!grapholNode.classes.includes('predicate')) entityDetailsComponent.hide();
    });

    grapholscape.onEdgeSelection(edge => {
      let grapholEdge = cyToGrapholElem(edge);
      if (!grapholEdge.classes.includes('predicate')) entityDetailsComponent.hide();
    });

    gui_container.appendChild(diagramSelectorComponent);
    gui_container.appendChild(ontologyExplorerComponent);
    gui_container.appendChild(entityDetailsComponent);
    gui_container.appendChild(zoomToolsComponent);
    gui_container.appendChild(owlVisualizerComponent);
    gui_container.appendChild(fullscreenComponent);
    gui_container.appendChild(fitButtonComponent);
    gui_container.appendChild(layoutSettingsComponent);

    let bottomContainer = bottomLeftContainer();
    bottomContainer.appendChild(filterComponent);
    bottomContainer.appendChild(ontologyInfoComponent);
    bottomContainer.appendChild(settingsComponent);
    bottomContainer.appendChild(rendererSelectorComponent);
    gui_container.appendChild(bottomContainer);
    grapholscape.container.appendChild(gui_container);

    bottomContainer.querySelectorAll('*').forEach(widget => {
      if (isGrapholscapeWidget(widget)) {
        widget.onToggleBody = () => blurAll(bottomContainer, [widget]);
      }
    });

    disableWidgets(grapholscape.config.widgets);

    function blurAll(container, widgetsToSkip = []) {
      container.querySelectorAll('*').forEach(widget => {
        if (isGrapholscapeWidget(widget) && !widgetsToSkip.includes(widget)) {
          widget.blur();
        }
      });
    }

    function isGrapholscapeWidget(widget) {
      return widget.nodeName.toLowerCase().startsWith('gscape')
    }

    function disableWidgets(widgets) {
      for (let widget in widgets) {
        if (!widgets[widget].enabled)
          gui_container.querySelector(widgetNames[widget]).disable();
      }
    }
  };

  if (grapholscape.shouldSimplify && grapholscape.shouldWaitSimplifyPromise) {
    grapholscape.SimplifiedOntologyPromise.then( _ => {
      init();
    });
  } else
    init();
}

/** @module UI */

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  GscapeButton: GscapeButton,
  GscapeToggle: GscapeToggle,
  GscapeDialog: GscapeDialog,
  GscapeWidget: GscapeWidget,
  initUI: init,
  GscapeDiagramSelector: GscapeDiagramSelector,
  diagramSelector: diagramSelector,
  entityDetails: entityDetails,
  filterComponent: filterComponent,
  filters: filters,
  layoutSettings: layoutSettings,
  fullscreenButton: fullscreenButton,
  ontologyExplorerComponent: ontologyExplorerComponent,
  ontologyExplorer: ontologyExplorer,
  ontologyInfo: ontologyInfo,
  owlVisualizerComponent: owlVisualizerComponent,
  owlVisualizer: owlVisualizer,
  rendererSelectorComponent: rendererSelectorComponent,
  rendererSelector: rendererSelector,
  settingsComponent: settingsComponent,
  settings: settings,
  zoomTools: zoomTools,
  fitButton: fitButton
});

/**
 * Create an instance of Grapholscape with complete GUI
 * @param {string | object} file the ontology, can be an object of the 
 * [Web API interface File](https://developer.mozilla.org/en-US/docs/Web/API/File) 
 * or a String representing the .graphol file to be displayed
 * @param {object} container a DOM element in which the ontology will be rendered in
 * @param {object} config a config object, please read more about [settings](https://github.com/obdasystems/grapholscape/wiki/Settings)
 * @returns a promise that will be fulfilled with a Grapholscape object
 * @tutorial Settings
 * @tutorial Themes
 */
async function fullGrapholscape(file, container, config = {}) {
  if (!file || !container) {
    console.error('Please specify an ontology and a container for Grapholscape');
    return undefined
  }

  const grapholscape = await initGrapholscape(file, container, config);
  init(grapholscape);
  return grapholscape
}

cytoscape.use(popper);
cytoscape.use(cola);
//export { GrapholscapeRenderer } from './rendering/renderers'

/**
 * Create a bare instance of Grapholscape, only diagrams, no UI
 * @param {string | object} file the ontology, can be an object of the 
 * [Web API interface File](https://developer.mozilla.org/en-US/docs/Web/API/File) 
 * or a String representing the .graphol file to be displayed
 * @param {object} container a DOM element in which the ontology will be rendered in
 * @param {object} config a config object, please read more about [settings](https://github.com/obdasystems/grapholscape/wiki/Settings)
 * @returns a promise that will be fulfilled with a Grapholscape object
 * @tutorial Settings
 * @tutorial Themes
 */
function bareGrapholscape(file, container, config = {}) {
  if (!file || !container) {
    console.error('Please specify an ontology and a container for Grapholscape');
    return undefined
  }

  return initGrapholscape(file, container, config)
}

export { POLYGON_POINTS, Shape, Type, index as UI, bareGrapholscape, clearLocalStorage, constructorLabels, fullGrapholscape, grapholNodes as grapholEnums, loadConfig, storeConfigEntry, themes };
