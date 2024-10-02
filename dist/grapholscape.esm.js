/**
 * MIT License
 *
 * Copyright (c) 2018-2024 OBDA Systems
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
import chroma from 'chroma-js';
import cy_svg from 'cytoscape-svg';
import automove from 'cytoscape-automove';
import tippy from 'tippy.js';
import '@lit-labs/virtualizer';
import autopan from 'cytoscape-autopan-on-drag';

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
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
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
    WidgetEnum["ENTITY_COLOR_LEGEND"] = "entity-color-legend";
    WidgetEnum["COLOR_BUTTON"] = "color-button";
    WidgetEnum["INCREMENTAL_FILTERS"] = "incremental-filters";
    WidgetEnum["INCREMENTAL_ENTITY_DETAILS"] = "class-instance-details";
    /** @internal */
    WidgetEnum["INSTANCES_EXPLORER"] = "instances-explorer";
    /** @internal */
    WidgetEnum["NAVIGATION_MENU"] = "naviagtion-menu";
    /** @internal */
    WidgetEnum["VKG_PREFERENCES"] = "vkg-preferences";
    WidgetEnum["INCREMENTAL_INITIAL_MENU"] = "incremental-initial-menu";
    WidgetEnum["DESIGNER_TOOLBOX"] = "designer-toolbox";
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

var Language;
(function (Language) {
    Language["DE"] = "de";
    Language["EN"] = "en";
    Language["ES"] = "es";
    Language["FR"] = "fr";
    Language["IT"] = "it";
})(Language || (Language = {}));

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
    get value() {
        return this._value;
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
const DefaultNamespaces = {
    RDFS: new Namespace(['rdfs'], 'http://www.w3.org/2000/01/rdf-schema#'),
    OWL: new Namespace(['owl'], 'http://www.w3.org/2002/07/owl#'),
};

class Iri {
    constructor(iri, namespaces, remainder) {
        let isPrefixed = false;
        this.fullIri = iri;
        this.namespace = namespaces.find(n => {
            if (iri.includes(n.toString()))
                return true;
            for (let prefix of n.prefixes) {
                if (iri === `${prefix}:${iri.split(':')[1]}` && !iri.startsWith('http://')) {
                    isPrefixed = true;
                    return true;
                }
            }
        });
        if (remainder) {
            this.remainder = remainder;
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
    // public get fullIri() {
    //   return this.namespace?.toString() ? `${this.namespace.toString()}${this.remainder}` : this.remainder
    // }
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
    toString() {
        return this.fullIri;
    }
}

const DefaultAnnotationProperties = {
    label: new Iri(`${DefaultNamespaces.RDFS.value}label`, [DefaultNamespaces.RDFS]),
    comment: new Iri(`${DefaultNamespaces.RDFS.value}comment`, [DefaultNamespaces.RDFS]),
    author: new Iri(`${DefaultNamespaces.RDFS.value}author`, [DefaultNamespaces.RDFS]),
    seeAlso: new Iri(`${DefaultNamespaces.RDFS.value}seeAlso`, [DefaultNamespaces.RDFS]),
    isDefinedBy: new Iri(`${DefaultNamespaces.RDFS.value}isDefinedBy`, [DefaultNamespaces.RDFS]),
    deprecated: new Iri(`${DefaultNamespaces.OWL.value}deprecated`, [DefaultNamespaces.OWL]),
    versionInfo: new Iri(`${DefaultNamespaces.OWL.value}versionInfo`, [DefaultNamespaces.OWL]),
    priorVersion: new Iri(`${DefaultNamespaces.OWL.value}priorVersion`, [DefaultNamespaces.OWL]),
    backCompatibleWith: new Iri(`${DefaultNamespaces.OWL.value}backCompatibleWith`, [DefaultNamespaces.OWL]),
    incompatibleWith: new Iri(`${DefaultNamespaces.OWL.value}incompatibleWith`, [DefaultNamespaces.OWL]),
};
class AnnotationProperty extends Iri {
}

class AnnotatedElement {
    constructor() {
        this._annotations = [];
    }
    set annotations(annotations) {
        this._annotations = annotations;
    }
    addAnnotation(newAnnotation) {
        for (let annotation of this._annotations) {
            if (annotation.equals(newAnnotation)) {
                return;
            }
        }
        this._annotations.push(newAnnotation);
    }
    removeAnnotation(annotation) {
        this._annotations = this._annotations.filter(a => !a.equals(annotation));
    }
    getAnnotations(language, annotationProperty) {
        return this._annotations.filter(ann => {
            let shouldAdd = true;
            if (language && ann.language !== language) {
                shouldAdd = false;
            }
            if (annotationProperty && !annotationProperty.equals(ann.property)) {
                shouldAdd = false;
            }
            return shouldAdd;
        });
    }
    getLabels(language) {
        return this.getAnnotations(language, DefaultAnnotationProperties.label);
    }
    getComments(language) {
        return this.getAnnotations(language, DefaultAnnotationProperties.comment);
    }
}

var RendererStatesEnum;
(function (RendererStatesEnum) {
    RendererStatesEnum["GRAPHOL"] = "graphol";
    RendererStatesEnum["GRAPHOL_LITE"] = "lite";
    RendererStatesEnum["FLOATY"] = "floaty";
    RendererStatesEnum["INCREMENTAL"] = "incremental";
})(RendererStatesEnum || (RendererStatesEnum = {}));

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
const BASE_PATH = "https://virtserver.swaggerhub.com/PEPE_2/Grapholscape_Model/1.0.0".replace(/\/+$/, "");
class Configuration {
    constructor(configuration = {}) {
        this.configuration = configuration;
    }
    set config(configuration) {
        this.configuration = configuration;
    }
    get basePath() {
        return this.configuration.basePath != null ? this.configuration.basePath : BASE_PATH;
    }
    get fetchApi() {
        return this.configuration.fetchApi;
    }
    get middleware() {
        return this.configuration.middleware || [];
    }
    get queryParamsStringify() {
        return this.configuration.queryParamsStringify || querystring;
    }
    get username() {
        return this.configuration.username;
    }
    get password() {
        return this.configuration.password;
    }
    get apiKey() {
        const apiKey = this.configuration.apiKey;
        if (apiKey) {
            return typeof apiKey === 'function' ? apiKey : () => apiKey;
        }
        return undefined;
    }
    get accessToken() {
        const accessToken = this.configuration.accessToken;
        if (accessToken) {
            return typeof accessToken === 'function' ? accessToken : () => __awaiter(this, void 0, void 0, function* () { return accessToken; });
        }
        return undefined;
    }
    get headers() {
        return this.configuration.headers;
    }
    get credentials() {
        return this.configuration.credentials;
    }
}
const DefaultConfig = new Configuration();
/**
 * This is the base class for all generated API classes.
 */
class BaseAPI {
    constructor(configuration = DefaultConfig) {
        this.configuration = configuration;
        this.fetchApi = (url, init) => __awaiter(this, void 0, void 0, function* () {
            let fetchParams = { url, init };
            for (const middleware of this.middleware) {
                if (middleware.pre) {
                    fetchParams = (yield middleware.pre(Object.assign({ fetch: this.fetchApi }, fetchParams))) || fetchParams;
                }
            }
            let response = undefined;
            try {
                response = yield (this.configuration.fetchApi || fetch)(fetchParams.url, fetchParams.init);
            }
            catch (e) {
                for (const middleware of this.middleware) {
                    if (middleware.onError) {
                        response = (yield middleware.onError({
                            fetch: this.fetchApi,
                            url: fetchParams.url,
                            init: fetchParams.init,
                            error: e,
                            response: response ? response.clone() : undefined,
                        })) || response;
                    }
                }
                if (response === undefined) {
                    if (e instanceof Error) {
                        throw new FetchError(e, 'The request failed and the interceptors did not return an alternative response');
                    }
                    else {
                        throw e;
                    }
                }
            }
            for (const middleware of this.middleware) {
                if (middleware.post) {
                    response = (yield middleware.post({
                        fetch: this.fetchApi,
                        url: fetchParams.url,
                        init: fetchParams.init,
                        response: response.clone(),
                    })) || response;
                }
            }
            return response;
        });
        this.middleware = configuration.middleware;
    }
    withMiddleware(...middlewares) {
        const next = this.clone();
        next.middleware = next.middleware.concat(...middlewares);
        return next;
    }
    withPreMiddleware(...preMiddlewares) {
        const middlewares = preMiddlewares.map((pre) => ({ pre }));
        return this.withMiddleware(...middlewares);
    }
    withPostMiddleware(...postMiddlewares) {
        const middlewares = postMiddlewares.map((post) => ({ post }));
        return this.withMiddleware(...middlewares);
    }
    /**
     * Check if the given MIME is a JSON MIME.
     * JSON MIME examples:
     *   application/json
     *   application/json; charset=UTF8
     *   APPLICATION/JSON
     *   application/vnd.company+json
     * @param mime - MIME (Multipurpose Internet Mail Extensions)
     * @return True if the given MIME is JSON, false otherwise.
     */
    isJsonMime(mime) {
        if (!mime) {
            return false;
        }
        return BaseAPI.jsonRegex.test(mime);
    }
    request(context, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, init } = yield this.createFetchParams(context, initOverrides);
            const response = yield this.fetchApi(url, init);
            if (response && (response.status >= 200 && response.status < 300)) {
                return response;
            }
            throw new ResponseError(response, 'Response returned an error code');
        });
    }
    createFetchParams(context, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = this.configuration.basePath + context.path;
            if (context.query !== undefined && Object.keys(context.query).length !== 0) {
                // only add the querystring to the URL if there are query parameters.
                // this is done to avoid urls ending with a "?" character which buggy webservers
                // do not handle correctly sometimes.
                url += '?' + this.configuration.queryParamsStringify(context.query);
            }
            const headers = Object.assign({}, this.configuration.headers, context.headers);
            Object.keys(headers).forEach(key => headers[key] === undefined ? delete headers[key] : {});
            const initOverrideFn = typeof initOverrides === "function"
                ? initOverrides
                : () => __awaiter(this, void 0, void 0, function* () { return initOverrides; });
            const initParams = {
                method: context.method,
                headers,
                body: context.body,
                credentials: this.configuration.credentials,
            };
            const overriddenInit = Object.assign(Object.assign({}, initParams), (yield initOverrideFn({
                init: initParams,
                context,
            })));
            const init = Object.assign(Object.assign({}, overriddenInit), { body: isFormData(overriddenInit.body) ||
                    overriddenInit.body instanceof URLSearchParams ||
                    isBlob(overriddenInit.body)
                    ? overriddenInit.body
                    : JSON.stringify(overriddenInit.body) });
            return { url, init };
        });
    }
    /**
     * Create a shallow clone of `this` by constructing a new instance
     * and then shallow cloning data members.
     */
    clone() {
        const constructor = this.constructor;
        const next = new constructor(this.configuration);
        next.middleware = this.middleware.slice();
        return next;
    }
}
BaseAPI.jsonRegex = new RegExp('^(:?application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(:?;.*)?$', 'i');
function isBlob(value) {
    return typeof Blob !== 'undefined' && value instanceof Blob;
}
function isFormData(value) {
    return typeof FormData !== "undefined" && value instanceof FormData;
}
class ResponseError extends Error {
    constructor(response, msg) {
        super(msg);
        this.response = response;
        this.name = "ResponseError";
    }
}
class FetchError extends Error {
    constructor(cause, msg) {
        super(msg);
        this.cause = cause;
        this.name = "FetchError";
    }
}
class RequiredError extends Error {
    constructor(field, msg) {
        super(msg);
        this.field = field;
        this.name = "RequiredError";
    }
}
const COLLECTION_FORMATS = {
    csv: ",",
    ssv: " ",
    tsv: "\t",
    pipes: "|",
};
function exists(json, key) {
    const value = json[key];
    return value !== null && value !== undefined;
}
function querystring(params, prefix = '') {
    return Object.keys(params)
        .map(key => querystringSingleKey(key, params[key], prefix))
        .filter(part => part.length > 0)
        .join('&');
}
function querystringSingleKey(key, value, keyPrefix = '') {
    const fullKey = keyPrefix + (keyPrefix.length ? `[${key}]` : key);
    if (value instanceof Array) {
        const multiValue = value.map(singleValue => encodeURIComponent(String(singleValue)))
            .join(`&${encodeURIComponent(fullKey)}=`);
        return `${encodeURIComponent(fullKey)}=${multiValue}`;
    }
    if (value instanceof Set) {
        const valueAsArray = Array.from(value);
        return querystringSingleKey(key, valueAsArray, keyPrefix);
    }
    if (value instanceof Date) {
        return `${encodeURIComponent(fullKey)}=${encodeURIComponent(value.toISOString())}`;
    }
    if (value instanceof Object) {
        return querystring(value, fullKey);
    }
    return `${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`;
}
function mapValues(data, fn) {
    return Object.keys(data).reduce((acc, key) => (Object.assign(Object.assign({}, acc), { [key]: fn(data[key]) })), {});
}
function canConsumeForm(consumes) {
    for (const consume of consumes) {
        if ('multipart/form-data' === consume.contentType) {
            return true;
        }
    }
    return false;
}
class JSONApiResponse {
    constructor(raw, transformer = (jsonValue) => jsonValue) {
        this.raw = raw;
        this.transformer = transformer;
    }
    value() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transformer(yield this.raw.json());
        });
    }
}
class VoidApiResponse {
    constructor(raw) {
        this.raw = raw;
    }
    value() {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
}
class BlobApiResponse {
    constructor(raw) {
        this.raw = raw;
    }
    value() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.raw.blob();
        });
    }
    ;
}
class TextApiResponse {
    constructor(raw) {
        this.raw = raw;
    }
    value() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.raw.text();
        });
    }
    ;
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the Position interface.
 */
function instanceOfPosition(value) {
    let isInstance = true;
    isInstance = isInstance && "x" in value;
    isInstance = isInstance && "y" in value;
    return isInstance;
}
function PositionFromJSON(json) {
    return PositionFromJSONTyped(json);
}
function PositionFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'x': json['x'],
        'y': json['y'],
    };
}
function PositionToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'x': value.x,
        'y': value.y,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Contiene tutti i tipi di nodi/archi orginirari dal Graphol per evitare di duplicare gli enumeratori. Nella rappresentazione Floaty/vkg vengono usati questi valori.
 * NODI class data-property class-instance (vkg) individual (floaty) union disjoint-union iri (floaty iri range di annotazioni che non sono entità)
 * ARCHI object-property annotation-property instance-of input inclusion equivalence attribute-edge union disjoint-union complete-union complete-disjoint-union
 * @export
 * @enum {string}
 */
var TypesEnum;
(function (TypesEnum) {
    TypesEnum["CLASS"] = "class";
    TypesEnum["OBJECT_PROPERTY"] = "object-property";
    TypesEnum["DATA_PROPERTY"] = "data-property";
    TypesEnum["ANNOTATION_PROPERTY"] = "annotation-property";
    TypesEnum["INDIVIDUAL"] = "individual";
    TypesEnum["CLASS_INSTANCE"] = "class-instance";
    TypesEnum["DOMAIN_RESTRICTION"] = "domain-restriction";
    TypesEnum["RANGE_RESTRICTION"] = "range-restriction";
    TypesEnum["UNION"] = "union";
    TypesEnum["COMPLETE_UNION"] = "complete-union";
    TypesEnum["DISJOINT_UNION"] = "disjoint-union";
    TypesEnum["COMPLETE_DISJOINT_UNION"] = "complete-disjoint-union";
    TypesEnum["COMPLEMENT"] = "complement";
    TypesEnum["INTERSECTION"] = "intersection";
    TypesEnum["ENUMERATION"] = "enumeration";
    TypesEnum["HAS_KEY"] = "has-key";
    TypesEnum["ROLE_INVERSE"] = "role-inverse";
    TypesEnum["ROLE_CHAIN"] = "role-chain";
    TypesEnum["DATATYPE_RESTRICTION"] = "datatype-restriction";
    TypesEnum["VALUE_DOMAIN"] = "value-domain";
    TypesEnum["PROPERTY_ASSERTION"] = "property-assertion";
    TypesEnum["LITERAL"] = "literal";
    TypesEnum["FACET"] = "facet";
    TypesEnum["NEUTRAL"] = "neutral";
    TypesEnum["VALUE"] = "value";
    TypesEnum["INCLUSION"] = "inclusion";
    TypesEnum["EQUIVALENCE"] = "equivalence";
    TypesEnum["INSTANCE_OF"] = "instance-of";
    TypesEnum["INPUT"] = "input";
    TypesEnum["SAME"] = "same";
    TypesEnum["DIFFERENT"] = "different";
    TypesEnum["MEMBERSHIP"] = "membership";
    TypesEnum["ATTRIBUTE_EDGE"] = "attribute-edge";
    TypesEnum["IRI"] = "iri";
})(TypesEnum || (TypesEnum = {}));
function TypesEnumFromJSON(json) {
    return TypesEnumFromJSONTyped(json);
}
function TypesEnumFromJSONTyped(json, ignoreDiscriminator) {
    return json;
}
function TypesEnumToJSON(value) {
    return value;
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the Edge interface.
 */
function instanceOfEdge(value) {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "sourceId" in value;
    isInstance = isInstance && "targetId" in value;
    return isInstance;
}
function EdgeFromJSON(json) {
    return EdgeFromJSONTyped(json);
}
function EdgeFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'id': json['id'],
        'originalId': !exists(json, 'originalId') ? undefined : json['originalId'],
        'diagramId': !exists(json, 'diagramId') ? undefined : json['diagramId'],
        'displayedName': !exists(json, 'displayedName') ? undefined : json['displayedName'],
        'iri': !exists(json, 'iri') ? undefined : json['iri'],
        'type': TypesEnumFromJSON(json['type']),
        'sourceId': json['sourceId'],
        'targetId': json['targetId'],
        'breakpoints': !exists(json, 'breakpoints') ? undefined : (json['breakpoints'].map(PositionFromJSON)),
        'domainTyped': !exists(json, 'domainTyped') ? undefined : json['domainTyped'],
        'rangeTyped': !exists(json, 'rangeTyped') ? undefined : json['rangeTyped'],
        'domainMandatory': !exists(json, 'domainMandatory') ? undefined : json['domainMandatory'],
        'rangeMandatory': !exists(json, 'rangeMandatory') ? undefined : json['rangeMandatory'],
    };
}
function EdgeToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'id': value.id,
        'originalId': value.originalId,
        'diagramId': value.diagramId,
        'displayedName': value.displayedName,
        'iri': value.iri,
        'type': TypesEnumToJSON(value.type),
        'sourceId': value.sourceId,
        'targetId': value.targetId,
        'breakpoints': value.breakpoints === undefined ? undefined : (value.breakpoints.map(PositionToJSON)),
        'domainTyped': value.domainTyped,
        'rangeTyped': value.rangeTyped,
        'domainMandatory': value.domainMandatory,
        'rangeMandatory': value.rangeMandatory,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the Annotation interface.
 */
function instanceOfAnnotation(value) {
    let isInstance = true;
    isInstance = isInstance && "value" in value;
    isInstance = isInstance && "property" in value;
    return isInstance;
}
function AnnotationFromJSON(json) {
    return AnnotationFromJSONTyped(json);
}
function AnnotationFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'value': json['value'],
        'hasIriValue': !exists(json, 'hasIriValue') ? undefined : json['hasIriValue'],
        'property': json['property'],
        'language': !exists(json, 'language') ? undefined : json['language'],
        'datatype': !exists(json, 'datatype') ? undefined : json['datatype'],
    };
}
function AnnotationToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'value': value.value,
        'hasIriValue': value.hasIriValue,
        'property': value.property,
        'language': value.language,
        'datatype': value.datatype,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 *
 * @export
 * @enum {string}
 */
var FunctionPropertiesEnum;
(function (FunctionPropertiesEnum) {
    FunctionPropertiesEnum["FUNCTIONAL"] = "functional";
    FunctionPropertiesEnum["INVERSE_FUNCTIONAL"] = "inverseFunctional";
    FunctionPropertiesEnum["TRANSITIVE"] = "transitive";
    FunctionPropertiesEnum["SYMMETRIC"] = "symmetric";
    FunctionPropertiesEnum["ASYMMETRIC"] = "asymmetric";
    FunctionPropertiesEnum["REFLEXIVE"] = "reflexive";
    FunctionPropertiesEnum["IRREFLEXIVE"] = "irreflexive";
})(FunctionPropertiesEnum || (FunctionPropertiesEnum = {}));
function FunctionPropertiesEnumFromJSON(json) {
    return FunctionPropertiesEnumFromJSONTyped(json);
}
function FunctionPropertiesEnumFromJSONTyped(json, ignoreDiscriminator) {
    return json;
}
function FunctionPropertiesEnumToJSON(value) {
    return value;
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the Entity interface.
 */
function instanceOfEntity(value) {
    let isInstance = true;
    isInstance = isInstance && "fullIri" in value;
    return isInstance;
}
function EntityFromJSON(json) {
    return EntityFromJSONTyped(json);
}
function EntityFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'fullIri': json['fullIri'],
        'annotations': !exists(json, 'annotations') ? undefined : (json['annotations'].map(AnnotationFromJSON)),
        'datatype': !exists(json, 'datatype') ? undefined : json['datatype'],
        'isDataPropertyFunctional': !exists(json, 'isDataPropertyFunctional') ? undefined : json['isDataPropertyFunctional'],
        'functionProperties': !exists(json, 'functionProperties') ? undefined : (json['functionProperties'].map(FunctionPropertiesEnumFromJSON)),
    };
}
function EntityToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'fullIri': value.fullIri,
        'annotations': value.annotations === undefined ? undefined : (value.annotations.map(AnnotationToJSON)),
        'datatype': value.datatype,
        'isDataPropertyFunctional': value.isDataPropertyFunctional,
        'functionProperties': value.functionProperties === undefined ? undefined : (value.functionProperties.map(FunctionPropertiesEnumToJSON)),
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the HierarchySuperclassesInner interface.
 */
function instanceOfHierarchySuperclassesInner(value) {
    let isInstance = true;
    isInstance = isInstance && "classEntity" in value;
    isInstance = isInstance && "complete" in value;
    return isInstance;
}
function HierarchySuperclassesInnerFromJSON(json) {
    return HierarchySuperclassesInnerFromJSONTyped(json);
}
function HierarchySuperclassesInnerFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'classEntity': EntityFromJSON(json['classEntity']),
        'complete': json['complete'],
    };
}
function HierarchySuperclassesInnerToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'classEntity': EntityToJSON(value.classEntity),
        'complete': value.complete,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the Hierarchy interface.
 */
function instanceOfHierarchy(value) {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "inputs" in value;
    isInstance = isInstance && "superclasses" in value;
    return isInstance;
}
function HierarchyFromJSON(json) {
    return HierarchyFromJSONTyped(json);
}
function HierarchyFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'id': json['id'],
        'type': TypesEnumFromJSON(json['type']),
        'inputs': (json['inputs'].map(EntityFromJSON)),
        'superclasses': (json['superclasses'].map(HierarchySuperclassesInnerFromJSON)),
    };
}
function HierarchyToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'id': value.id,
        'type': TypesEnumToJSON(value.type),
        'inputs': (value.inputs.map(EntityToJSON)),
        'superclasses': (value.superclasses.map(HierarchySuperclassesInnerToJSON)),
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the Node interface.
 */
function instanceOfNode(value) {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "type" in value;
    return isInstance;
}
function NodeFromJSON(json) {
    return NodeFromJSONTyped(json);
}
function NodeFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'id': json['id'],
        'originalId': !exists(json, 'originalId') ? undefined : json['originalId'],
        'diagramId': !exists(json, 'diagramId') ? undefined : json['diagramId'],
        'displayedName': !exists(json, 'displayedName') ? undefined : json['displayedName'],
        'iri': !exists(json, 'iri') ? undefined : json['iri'],
        'type': TypesEnumFromJSON(json['type']),
        'position': !exists(json, 'position') ? undefined : PositionFromJSON(json['position']),
        'labelPosition': !exists(json, 'labelPosition') ? undefined : PositionFromJSON(json['labelPosition']),
        'geoPosition': !exists(json, 'geoPosition') ? undefined : PositionFromJSON(json['geoPosition']),
    };
}
function NodeToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'id': value.id,
        'originalId': value.originalId,
        'diagramId': value.diagramId,
        'displayedName': value.displayedName,
        'iri': value.iri,
        'type': TypesEnumToJSON(value.type),
        'position': PositionToJSON(value.position),
        'labelPosition': PositionToJSON(value.labelPosition),
        'geoPosition': PositionToJSON(value.geoPosition),
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the ActionInvolvedElements interface.
 */
function instanceOfActionInvolvedElements(value) {
    let isInstance = true;
    return isInstance;
}
function ActionInvolvedElementsFromJSON(json) {
    return ActionInvolvedElementsFromJSONTyped(json);
}
function ActionInvolvedElementsFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'nodes': !exists(json, 'nodes') ? undefined : (json['nodes'].map(NodeFromJSON)),
        'edges': !exists(json, 'edges') ? undefined : (json['edges'].map(EdgeFromJSON)),
        'hierarchies': !exists(json, 'Hierarchies') ? undefined : (json['Hierarchies'].map(HierarchyFromJSON)),
    };
}
function ActionInvolvedElementsToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'nodes': value.nodes === undefined ? undefined : (value.nodes.map(NodeToJSON)),
        'edges': value.edges === undefined ? undefined : (value.edges.map(EdgeToJSON)),
        'Hierarchies': value.hierarchies === undefined ? undefined : (value.hierarchies.map(HierarchyToJSON)),
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the ActionUser interface.
 */
function instanceOfActionUser(value) {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    return isInstance;
}
function ActionUserFromJSON(json) {
    return ActionUserFromJSONTyped(json);
}
function ActionUserFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'name': json['name'],
        'firstName': !exists(json, 'firstName') ? undefined : json['firstName'],
        'lastName': !exists(json, 'lastName') ? undefined : json['lastName'],
        'email': !exists(json, 'email') ? undefined : json['email'],
    };
}
function ActionUserToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'name': value.name,
        'firstName': value.firstName,
        'lastName': value.lastName,
        'email': value.email,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
* @export
* @enum {string}
*/
var ActionOperationTypeEnum;
(function (ActionOperationTypeEnum) {
    ActionOperationTypeEnum["ADD"] = "add";
    ActionOperationTypeEnum["EDIT"] = "edit";
    ActionOperationTypeEnum["REMOVE"] = "remove";
})(ActionOperationTypeEnum || (ActionOperationTypeEnum = {}));
/**
 * Check if a given object implements the Action interface.
 */
function instanceOfAction(value) {
    let isInstance = true;
    isInstance = isInstance && "operationType" in value;
    isInstance = isInstance && "subject" in value;
    isInstance = isInstance && "user" in value;
    isInstance = isInstance && "timestamp" in value;
    return isInstance;
}
function ActionFromJSON(json) {
    return ActionFromJSONTyped(json);
}
function ActionFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'operationType': json['operationType'],
        'subject': json['subject'],
        'previousState': !exists(json, 'previousState') ? undefined : json['previousState'],
        'involvedElements': !exists(json, 'involvedElements') ? undefined : ActionInvolvedElementsFromJSON(json['involvedElements']),
        'subactions': !exists(json, 'subactions') ? undefined : (json['subactions'].map(ActionFromJSON)),
        'user': ActionUserFromJSON(json['user']),
        'timestamp': json['timestamp'],
    };
}
function ActionToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'operationType': value.operationType,
        'subject': value.subject,
        'previousState': value.previousState,
        'involvedElements': ActionInvolvedElementsToJSON(value.involvedElements),
        'subactions': value.subactions === undefined ? undefined : (value.subactions.map(ActionToJSON)),
        'user': ActionUserToJSON(value.user),
        'timestamp': value.timestamp,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
* @export
* @enum {string}
*/
var AnnotationActionOperationTypeEnum;
(function (AnnotationActionOperationTypeEnum) {
    AnnotationActionOperationTypeEnum["ADD"] = "add";
    AnnotationActionOperationTypeEnum["EDIT"] = "edit";
    AnnotationActionOperationTypeEnum["REMOVE"] = "remove";
})(AnnotationActionOperationTypeEnum || (AnnotationActionOperationTypeEnum = {}));
/**
 * Check if a given object implements the AnnotationAction interface.
 */
function instanceOfAnnotationAction(value) {
    let isInstance = true;
    isInstance = isInstance && "operationType" in value;
    isInstance = isInstance && "user" in value;
    isInstance = isInstance && "timestamp" in value;
    return isInstance;
}
function AnnotationActionFromJSON(json) {
    return AnnotationActionFromJSONTyped(json);
}
function AnnotationActionFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'subject': !exists(json, 'subject') ? undefined : AnnotationFromJSON(json['subject']),
        'previousState': !exists(json, 'previousState') ? undefined : AnnotationFromJSON(json['previousState']),
        'entity': !exists(json, 'entity') ? undefined : EntityFromJSON(json['entity']),
        'onOntology': !exists(json, 'onOntology') ? undefined : json['onOntology'],
        'operationType': json['operationType'],
        'involvedElements': !exists(json, 'involvedElements') ? undefined : ActionInvolvedElementsFromJSON(json['involvedElements']),
        'subactions': !exists(json, 'subactions') ? undefined : (json['subactions'].map(ActionFromJSON)),
        'user': ActionUserFromJSON(json['user']),
        'timestamp': json['timestamp'],
    };
}
function AnnotationActionToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'subject': AnnotationToJSON(value.subject),
        'previousState': AnnotationToJSON(value.previousState),
        'entity': EntityToJSON(value.entity),
        'onOntology': value.onOntology,
        'operationType': value.operationType,
        'involvedElements': ActionInvolvedElementsToJSON(value.involvedElements),
        'subactions': value.subactions === undefined ? undefined : (value.subactions.map(ActionToJSON)),
        'user': ActionUserToJSON(value.user),
        'timestamp': value.timestamp,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the DataPropertyValue interface.
 */
function instanceOfDataPropertyValue(value) {
    let isInstance = true;
    isInstance = isInstance && "value" in value;
    isInstance = isInstance && "iri" in value;
    return isInstance;
}
function DataPropertyValueFromJSON(json) {
    return DataPropertyValueFromJSONTyped(json);
}
function DataPropertyValueFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'value': json['value'],
        'iri': json['iri'],
        'language': !exists(json, 'language') ? undefined : json['language'],
        'datatype': !exists(json, 'datatype') ? undefined : json['datatype'],
        'renderingProperties': !exists(json, 'renderingProperties') ? undefined : json['renderingProperties'],
    };
}
function DataPropertyValueToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'value': value.value,
        'iri': value.iri,
        'language': value.language,
        'datatype': value.datatype,
        'renderingProperties': value.renderingProperties,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the ClassInstanceEntity interface.
 */
function instanceOfClassInstanceEntity(value) {
    let isInstance = true;
    isInstance = isInstance && "fullIri" in value;
    return isInstance;
}
function ClassInstanceEntityFromJSON(json) {
    return ClassInstanceEntityFromJSONTyped(json);
}
function ClassInstanceEntityFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'fullIri': json['fullIri'],
        'annotations': !exists(json, 'annotations') ? undefined : (json['annotations'].map(AnnotationFromJSON)),
        'datatype': !exists(json, 'datatype') ? undefined : json['datatype'],
        'isDataPropertyFunctional': !exists(json, 'isDataPropertyFunctional') ? undefined : json['isDataPropertyFunctional'],
        'functionProperties': !exists(json, 'functionProperties') ? undefined : (json['functionProperties'].map(FunctionPropertiesEnumFromJSON)),
        'parentClasses': !exists(json, 'parentClasses') ? undefined : json['parentClasses'],
        'dataProperties': !exists(json, 'dataProperties') ? undefined : (json['dataProperties'].map(DataPropertyValueFromJSON)),
        'shortIri': !exists(json, 'shortIri') ? undefined : json['shortIri'],
    };
}
function ClassInstanceEntityToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'fullIri': value.fullIri,
        'annotations': value.annotations === undefined ? undefined : (value.annotations.map(AnnotationToJSON)),
        'datatype': value.datatype,
        'isDataPropertyFunctional': value.isDataPropertyFunctional,
        'functionProperties': value.functionProperties === undefined ? undefined : (value.functionProperties.map(FunctionPropertiesEnumToJSON)),
        'parentClasses': value.parentClasses,
        'dataProperties': value.dataProperties === undefined ? undefined : (value.dataProperties.map(DataPropertyValueToJSON)),
        'shortIri': value.shortIri,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the ClassInstanceEntityAllOf interface.
 */
function instanceOfClassInstanceEntityAllOf(value) {
    let isInstance = true;
    return isInstance;
}
function ClassInstanceEntityAllOfFromJSON(json) {
    return ClassInstanceEntityAllOfFromJSONTyped(json);
}
function ClassInstanceEntityAllOfFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'parentClasses': !exists(json, 'parentClasses') ? undefined : json['parentClasses'],
        'dataProperties': !exists(json, 'dataProperties') ? undefined : (json['dataProperties'].map(DataPropertyValueFromJSON)),
        'shortIri': !exists(json, 'shortIri') ? undefined : json['shortIri'],
    };
}
function ClassInstanceEntityAllOfToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'parentClasses': value.parentClasses,
        'dataProperties': value.dataProperties === undefined ? undefined : (value.dataProperties.map(DataPropertyValueToJSON)),
        'shortIri': value.shortIri,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the Viewport interface.
 */
function instanceOfViewport(value) {
    let isInstance = true;
    isInstance = isInstance && "pan" in value;
    isInstance = isInstance && "zoom" in value;
    return isInstance;
}
function ViewportFromJSON(json) {
    return ViewportFromJSONTyped(json);
}
function ViewportFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'pan': PositionFromJSON(json['pan']),
        'zoom': json['zoom'],
    };
}
function ViewportToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'pan': PositionToJSON(value.pan),
        'zoom': value.zoom,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the Diagram interface.
 */
function instanceOfDiagram(value) {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "name" in value;
    return isInstance;
}
function DiagramFromJSON(json) {
    return DiagramFromJSONTyped(json);
}
function DiagramFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'id': json['id'],
        'name': json['name'],
        'nodes': !exists(json, 'nodes') ? undefined : (json['nodes'].map(NodeFromJSON)),
        'edges': !exists(json, 'edges') ? undefined : (json['edges'].map(EdgeFromJSON)),
        'lastViewportState': !exists(json, 'lastViewportState') ? undefined : ViewportFromJSON(json['lastViewportState']),
    };
}
function DiagramToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'id': value.id,
        'name': value.name,
        'nodes': value.nodes === undefined ? undefined : (value.nodes.map(NodeToJSON)),
        'edges': value.edges === undefined ? undefined : (value.edges.map(EdgeToJSON)),
        'lastViewportState': ViewportToJSON(value.lastViewportState),
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
* @export
* @enum {string}
*/
var DiagramActionOperationTypeEnum;
(function (DiagramActionOperationTypeEnum) {
    DiagramActionOperationTypeEnum["ADD"] = "add";
    DiagramActionOperationTypeEnum["EDIT"] = "edit";
    DiagramActionOperationTypeEnum["REMOVE"] = "remove";
})(DiagramActionOperationTypeEnum || (DiagramActionOperationTypeEnum = {}));
/**
 * Check if a given object implements the DiagramAction interface.
 */
function instanceOfDiagramAction(value) {
    let isInstance = true;
    isInstance = isInstance && "operationType" in value;
    isInstance = isInstance && "user" in value;
    isInstance = isInstance && "timestamp" in value;
    return isInstance;
}
function DiagramActionFromJSON(json) {
    return DiagramActionFromJSONTyped(json);
}
function DiagramActionFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'subject': !exists(json, 'subject') ? undefined : DiagramFromJSON(json['subject']),
        'previousState': !exists(json, 'previousState') ? undefined : DiagramFromJSON(json['previousState']),
        'operationType': json['operationType'],
        'involvedElements': !exists(json, 'involvedElements') ? undefined : ActionInvolvedElementsFromJSON(json['involvedElements']),
        'subactions': !exists(json, 'subactions') ? undefined : (json['subactions'].map(ActionFromJSON)),
        'user': ActionUserFromJSON(json['user']),
        'timestamp': json['timestamp'],
    };
}
function DiagramActionToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'subject': DiagramToJSON(value.subject),
        'previousState': DiagramToJSON(value.previousState),
        'operationType': value.operationType,
        'involvedElements': ActionInvolvedElementsToJSON(value.involvedElements),
        'subactions': value.subactions === undefined ? undefined : (value.subactions.map(ActionToJSON)),
        'user': ActionUserToJSON(value.user),
        'timestamp': value.timestamp,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
* @export
* @enum {string}
*/
var EdgeActionOperationTypeEnum;
(function (EdgeActionOperationTypeEnum) {
    EdgeActionOperationTypeEnum["ADD"] = "add";
    EdgeActionOperationTypeEnum["EDIT"] = "edit";
    EdgeActionOperationTypeEnum["REMOVE"] = "remove";
})(EdgeActionOperationTypeEnum || (EdgeActionOperationTypeEnum = {}));
/**
 * Check if a given object implements the EdgeAction interface.
 */
function instanceOfEdgeAction(value) {
    let isInstance = true;
    isInstance = isInstance && "subject" in value;
    isInstance = isInstance && "operationType" in value;
    isInstance = isInstance && "user" in value;
    isInstance = isInstance && "timestamp" in value;
    return isInstance;
}
function EdgeActionFromJSON(json) {
    return EdgeActionFromJSONTyped(json);
}
function EdgeActionFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'subject': EdgeFromJSON(json['subject']),
        'previousState': !exists(json, 'previousState') ? undefined : EdgeFromJSON(json['previousState']),
        'operationType': json['operationType'],
        'involvedElements': !exists(json, 'involvedElements') ? undefined : ActionInvolvedElementsFromJSON(json['involvedElements']),
        'subactions': !exists(json, 'subactions') ? undefined : (json['subactions'].map(ActionFromJSON)),
        'user': ActionUserFromJSON(json['user']),
        'timestamp': json['timestamp'],
    };
}
function EdgeActionToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'subject': EdgeToJSON(value.subject),
        'previousState': EdgeToJSON(value.previousState),
        'operationType': value.operationType,
        'involvedElements': ActionInvolvedElementsToJSON(value.involvedElements),
        'subactions': value.subactions === undefined ? undefined : (value.subactions.map(ActionToJSON)),
        'user': ActionUserToJSON(value.user),
        'timestamp': value.timestamp,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the EdgeAllOf interface.
 */
function instanceOfEdgeAllOf(value) {
    let isInstance = true;
    isInstance = isInstance && "sourceId" in value;
    isInstance = isInstance && "targetId" in value;
    return isInstance;
}
function EdgeAllOfFromJSON(json) {
    return EdgeAllOfFromJSONTyped(json);
}
function EdgeAllOfFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'sourceId': json['sourceId'],
        'targetId': json['targetId'],
        'breakpoints': !exists(json, 'breakpoints') ? undefined : (json['breakpoints'].map(PositionFromJSON)),
        'domainTyped': !exists(json, 'domainTyped') ? undefined : json['domainTyped'],
        'rangeTyped': !exists(json, 'rangeTyped') ? undefined : json['rangeTyped'],
        'domainMandatory': !exists(json, 'domainMandatory') ? undefined : json['domainMandatory'],
        'rangeMandatory': !exists(json, 'rangeMandatory') ? undefined : json['rangeMandatory'],
    };
}
function EdgeAllOfToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'sourceId': value.sourceId,
        'targetId': value.targetId,
        'breakpoints': value.breakpoints === undefined ? undefined : (value.breakpoints.map(PositionToJSON)),
        'domainTyped': value.domainTyped,
        'rangeTyped': value.rangeTyped,
        'domainMandatory': value.domainMandatory,
        'rangeMandatory': value.rangeMandatory,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the Element interface.
 */
function instanceOfElement(value) {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "type" in value;
    return isInstance;
}
function ElementFromJSON(json) {
    return ElementFromJSONTyped(json);
}
function ElementFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'id': json['id'],
        'originalId': !exists(json, 'originalId') ? undefined : json['originalId'],
        'diagramId': !exists(json, 'diagramId') ? undefined : json['diagramId'],
        'displayedName': !exists(json, 'displayedName') ? undefined : json['displayedName'],
        'iri': !exists(json, 'iri') ? undefined : json['iri'],
        'type': TypesEnumFromJSON(json['type']),
    };
}
function ElementToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'id': value.id,
        'originalId': value.originalId,
        'diagramId': value.diagramId,
        'displayedName': value.displayedName,
        'iri': value.iri,
        'type': TypesEnumToJSON(value.type),
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
* @export
* @enum {string}
*/
var EntityActionOperationTypeEnum;
(function (EntityActionOperationTypeEnum) {
    EntityActionOperationTypeEnum["ADD"] = "add";
    EntityActionOperationTypeEnum["EDIT"] = "edit";
    EntityActionOperationTypeEnum["REMOVE"] = "remove";
})(EntityActionOperationTypeEnum || (EntityActionOperationTypeEnum = {}));
/**
 * Check if a given object implements the EntityAction interface.
 */
function instanceOfEntityAction(value) {
    let isInstance = true;
    isInstance = isInstance && "operationType" in value;
    isInstance = isInstance && "user" in value;
    isInstance = isInstance && "timestamp" in value;
    return isInstance;
}
function EntityActionFromJSON(json) {
    return EntityActionFromJSONTyped(json);
}
function EntityActionFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'subject': !exists(json, 'subject') ? undefined : EntityFromJSON(json['subject']),
        'previousState': !exists(json, 'previousState') ? undefined : EntityFromJSON(json['previousState']),
        'operationType': json['operationType'],
        'involvedElements': !exists(json, 'involvedElements') ? undefined : ActionInvolvedElementsFromJSON(json['involvedElements']),
        'subactions': !exists(json, 'subactions') ? undefined : (json['subactions'].map(ActionFromJSON)),
        'user': ActionUserFromJSON(json['user']),
        'timestamp': json['timestamp'],
    };
}
function EntityActionToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'subject': EntityToJSON(value.subject),
        'previousState': EntityToJSON(value.previousState),
        'operationType': value.operationType,
        'involvedElements': ActionInvolvedElementsToJSON(value.involvedElements),
        'subactions': value.subactions === undefined ? undefined : (value.subactions.map(ActionToJSON)),
        'user': ActionUserToJSON(value.user),
        'timestamp': value.timestamp,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the HierarchyAction interface.
 */
function instanceOfHierarchyAction(value) {
    let isInstance = true;
    isInstance = isInstance && "diagramId" in value;
    return isInstance;
}
function HierarchyActionFromJSON(json) {
    return HierarchyActionFromJSONTyped(json);
}
function HierarchyActionFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'subject': !exists(json, 'subject') ? undefined : HierarchyFromJSON(json['subject']),
        'diagramId': json['diagramId'],
        'previousState': !exists(json, 'previousState') ? undefined : HierarchyFromJSON(json['previousState']),
    };
}
function HierarchyActionToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'subject': HierarchyToJSON(value.subject),
        'diagramId': value.diagramId,
        'previousState': HierarchyToJSON(value.previousState),
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the Namespace interface.
 */
function instanceOfNamespace(value) {
    let isInstance = true;
    isInstance = isInstance && "value" in value;
    isInstance = isInstance && "prefixes" in value;
    return isInstance;
}
function NamespaceFromJSON(json) {
    return NamespaceFromJSONTyped(json);
}
function NamespaceFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'value': json['value'],
        'prefixes': json['prefixes'],
    };
}
function NamespaceToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'value': value.value,
        'prefixes': value.prefixes,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
* @export
* @enum {string}
*/
var NamespaceActionOperationTypeEnum;
(function (NamespaceActionOperationTypeEnum) {
    NamespaceActionOperationTypeEnum["ADD"] = "add";
    NamespaceActionOperationTypeEnum["EDIT"] = "edit";
    NamespaceActionOperationTypeEnum["REMOVE"] = "remove";
})(NamespaceActionOperationTypeEnum || (NamespaceActionOperationTypeEnum = {}));
/**
 * Check if a given object implements the NamespaceAction interface.
 */
function instanceOfNamespaceAction(value) {
    let isInstance = true;
    isInstance = isInstance && "subject" in value;
    isInstance = isInstance && "operationType" in value;
    isInstance = isInstance && "user" in value;
    isInstance = isInstance && "timestamp" in value;
    return isInstance;
}
function NamespaceActionFromJSON(json) {
    return NamespaceActionFromJSONTyped(json);
}
function NamespaceActionFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'subject': NamespaceFromJSON(json['subject']),
        'previousState': !exists(json, 'previousState') ? undefined : NamespaceFromJSON(json['previousState']),
        'operationType': json['operationType'],
        'involvedElements': !exists(json, 'involvedElements') ? undefined : ActionInvolvedElementsFromJSON(json['involvedElements']),
        'subactions': !exists(json, 'subactions') ? undefined : (json['subactions'].map(ActionFromJSON)),
        'user': ActionUserFromJSON(json['user']),
        'timestamp': json['timestamp'],
    };
}
function NamespaceActionToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'subject': NamespaceToJSON(value.subject),
        'previousState': NamespaceToJSON(value.previousState),
        'operationType': value.operationType,
        'involvedElements': ActionInvolvedElementsToJSON(value.involvedElements),
        'subactions': value.subactions === undefined ? undefined : (value.subactions.map(ActionToJSON)),
        'user': ActionUserToJSON(value.user),
        'timestamp': value.timestamp,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
* @export
* @enum {string}
*/
var NodeActionOperationTypeEnum;
(function (NodeActionOperationTypeEnum) {
    NodeActionOperationTypeEnum["ADD"] = "add";
    NodeActionOperationTypeEnum["EDIT"] = "edit";
    NodeActionOperationTypeEnum["REMOVE"] = "remove";
})(NodeActionOperationTypeEnum || (NodeActionOperationTypeEnum = {}));
/**
 * Check if a given object implements the NodeAction interface.
 */
function instanceOfNodeAction(value) {
    let isInstance = true;
    isInstance = isInstance && "subject" in value;
    isInstance = isInstance && "operationType" in value;
    isInstance = isInstance && "user" in value;
    isInstance = isInstance && "timestamp" in value;
    return isInstance;
}
function NodeActionFromJSON(json) {
    return NodeActionFromJSONTyped(json);
}
function NodeActionFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'subject': NodeFromJSON(json['subject']),
        'previousState': !exists(json, 'previousState') ? undefined : NodeFromJSON(json['previousState']),
        'operationType': json['operationType'],
        'involvedElements': !exists(json, 'involvedElements') ? undefined : ActionInvolvedElementsFromJSON(json['involvedElements']),
        'subactions': !exists(json, 'subactions') ? undefined : (json['subactions'].map(ActionFromJSON)),
        'user': ActionUserFromJSON(json['user']),
        'timestamp': json['timestamp'],
    };
}
function NodeActionToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'subject': NodeToJSON(value.subject),
        'previousState': NodeToJSON(value.previousState),
        'operationType': value.operationType,
        'involvedElements': ActionInvolvedElementsToJSON(value.involvedElements),
        'subactions': value.subactions === undefined ? undefined : (value.subactions.map(ActionToJSON)),
        'user': ActionUserToJSON(value.user),
        'timestamp': value.timestamp,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the NodeAllOf interface.
 */
function instanceOfNodeAllOf(value) {
    let isInstance = true;
    return isInstance;
}
function NodeAllOfFromJSON(json) {
    return NodeAllOfFromJSONTyped(json);
}
function NodeAllOfFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'position': !exists(json, 'position') ? undefined : PositionFromJSON(json['position']),
        'labelPosition': !exists(json, 'labelPosition') ? undefined : PositionFromJSON(json['labelPosition']),
        'geoPosition': !exists(json, 'geoPosition') ? undefined : PositionFromJSON(json['geoPosition']),
    };
}
function NodeAllOfToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'position': PositionToJSON(value.position),
        'labelPosition': PositionToJSON(value.labelPosition),
        'geoPosition': PositionToJSON(value.geoPosition),
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the OntologyDraftInfo interface.
 */
function instanceOfOntologyDraftInfo(value) {
    let isInstance = true;
    return isInstance;
}
function OntologyDraftInfoFromJSON(json) {
    return OntologyDraftInfoFromJSONTyped(json);
}
function OntologyDraftInfoFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'name': !exists(json, 'name') ? undefined : json['name'],
        'iri': !exists(json, 'iri') ? undefined : json['iri'],
        'version': !exists(json, 'version') ? undefined : json['version'],
        'lastModification': !exists(json, 'lastModification') ? undefined : json['lastModification'],
    };
}
function OntologyDraftInfoToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'name': value.name,
        'iri': value.iri,
        'version': value.version,
        'lastModification': value.lastModification,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
* @export
* @enum {string}
*/
var PropertyActionOperationTypeEnum;
(function (PropertyActionOperationTypeEnum) {
    PropertyActionOperationTypeEnum["ADD"] = "add";
    PropertyActionOperationTypeEnum["EDIT"] = "edit";
    PropertyActionOperationTypeEnum["REMOVE"] = "remove";
})(PropertyActionOperationTypeEnum || (PropertyActionOperationTypeEnum = {}));
/**
 * Check if a given object implements the PropertyAction interface.
 */
function instanceOfPropertyAction(value) {
    let isInstance = true;
    isInstance = isInstance && "operationType" in value;
    isInstance = isInstance && "user" in value;
    isInstance = isInstance && "timestamp" in value;
    return isInstance;
}
function PropertyActionFromJSON(json) {
    return PropertyActionFromJSONTyped(json);
}
function PropertyActionFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'subject': !exists(json, 'subject') ? undefined : EntityFromJSON(json['subject']),
        'previousState': !exists(json, 'previousState') ? undefined : EntityFromJSON(json['previousState']),
        'operationType': json['operationType'],
        'involvedElements': !exists(json, 'involvedElements') ? undefined : ActionInvolvedElementsFromJSON(json['involvedElements']),
        'subactions': !exists(json, 'subactions') ? undefined : (json['subactions'].map(ActionFromJSON)),
        'user': ActionUserFromJSON(json['user']),
        'timestamp': json['timestamp'],
    };
}
function PropertyActionToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'subject': EntityToJSON(value.subject),
        'previousState': EntityToJSON(value.previousState),
        'operationType': value.operationType,
        'involvedElements': ActionInvolvedElementsToJSON(value.involvedElements),
        'subactions': value.subactions === undefined ? undefined : (value.subactions.map(ActionToJSON)),
        'user': ActionUserToJSON(value.user),
        'timestamp': value.timestamp,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the Theme interface.
 */
function instanceOfTheme(value) {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    return isInstance;
}
function ThemeFromJSON(json) {
    return ThemeFromJSONTyped(json);
}
function ThemeFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'id': json['id'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'colours': !exists(json, 'colours') ? undefined : json['colours'],
    };
}
function ThemeToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'id': value.id,
        'name': value.name,
        'colours': value.colours,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
* @export
* @enum {string}
*/
var RDFGraphConfigEntityNameTypeEnum;
(function (RDFGraphConfigEntityNameTypeEnum) {
    RDFGraphConfigEntityNameTypeEnum["LABEL"] = "label";
    RDFGraphConfigEntityNameTypeEnum["PREFIXED_IRI"] = "prefixed_iri";
    RDFGraphConfigEntityNameTypeEnum["FULL_IRI"] = "full_iri";
})(RDFGraphConfigEntityNameTypeEnum || (RDFGraphConfigEntityNameTypeEnum = {}));
/**
* @export
* @enum {string}
*/
var RDFGraphConfigFiltersEnum;
(function (RDFGraphConfigFiltersEnum) {
    RDFGraphConfigFiltersEnum["ALL"] = "all";
    RDFGraphConfigFiltersEnum["DATA_PROPERTY"] = "data-property";
    RDFGraphConfigFiltersEnum["VALUE_DOMAIN"] = "value-domain";
    RDFGraphConfigFiltersEnum["INDIVIDUAL"] = "individual";
    RDFGraphConfigFiltersEnum["ANNOTATION_PROPERTY"] = "annotation-property";
    RDFGraphConfigFiltersEnum["UNIVERSAL_QUANTIFIER"] = "universal_quantifier";
    RDFGraphConfigFiltersEnum["COMPLEMENT"] = "complement";
    RDFGraphConfigFiltersEnum["HAS_KEY"] = "has-key";
})(RDFGraphConfigFiltersEnum || (RDFGraphConfigFiltersEnum = {}));
/**
 * Check if a given object implements the RDFGraphConfig interface.
 */
function instanceOfRDFGraphConfig(value) {
    let isInstance = true;
    return isInstance;
}
function RDFGraphConfigFromJSON(json) {
    return RDFGraphConfigFromJSONTyped(json);
}
function RDFGraphConfigFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'themes': !exists(json, 'themes') ? undefined : (json['themes'].map(ThemeFromJSON)),
        'selectedTheme': !exists(json, 'selectedTheme') ? undefined : json['selectedTheme'],
        'language': !exists(json, 'language') ? undefined : json['language'],
        'entityNameType': !exists(json, 'entityNameType') ? undefined : json['entityNameType'],
        'renderers': !exists(json, 'renderers') ? undefined : json['renderers'],
        'widgets': !exists(json, 'widgets') ? undefined : json['widgets'],
        'filters': !exists(json, 'filters') ? undefined : json['filters'],
    };
}
function RDFGraphConfigToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'themes': value.themes === undefined ? undefined : (value.themes.map(ThemeToJSON)),
        'selectedTheme': value.selectedTheme,
        'language': value.language,
        'entityNameType': value.entityNameType,
        'renderers': value.renderers,
        'widgets': value.widgets,
        'filters': value.filters,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the RDFGraphMetadata interface.
 */
function instanceOfRDFGraphMetadata(value) {
    let isInstance = true;
    isInstance = isInstance && "namespaces" in value;
    return isInstance;
}
function RDFGraphMetadataFromJSON(json) {
    return RDFGraphMetadataFromJSONTyped(json);
}
function RDFGraphMetadataFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'name': !exists(json, 'name') ? undefined : json['name'],
        'iri': !exists(json, 'iri') ? undefined : json['iri'],
        'version': !exists(json, 'version') ? undefined : json['version'],
        'languages': !exists(json, 'languages') ? undefined : json['languages'],
        'defaultLanguage': !exists(json, 'defaultLanguage') ? undefined : json['defaultLanguage'],
        'namespaces': (json['namespaces'].map(NamespaceFromJSON)),
        'annotations': !exists(json, 'annotations') ? undefined : (json['annotations'].map(AnnotationFromJSON)),
        'annotationProperties': !exists(json, 'annotationProperties') ? undefined : json['annotationProperties'],
    };
}
function RDFGraphMetadataToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'name': value.name,
        'iri': value.iri,
        'version': value.version,
        'languages': value.languages,
        'defaultLanguage': value.defaultLanguage,
        'namespaces': (value.namespaces.map(NamespaceToJSON)),
        'annotations': value.annotations === undefined ? undefined : (value.annotations.map(AnnotationToJSON)),
        'annotationProperties': value.annotationProperties,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
* @export
* @enum {string}
*/
var RDFGraphModelTypeEnum;
(function (RDFGraphModelTypeEnum) {
    RDFGraphModelTypeEnum["ONTOLOGY"] = "ontology";
    RDFGraphModelTypeEnum["VKG"] = "vkg";
    RDFGraphModelTypeEnum["RDF"] = "rdf";
})(RDFGraphModelTypeEnum || (RDFGraphModelTypeEnum = {}));
/**
 * Check if a given object implements the RDFGraph interface.
 */
function instanceOfRDFGraph(value) {
    let isInstance = true;
    isInstance = isInstance && "diagrams" in value;
    isInstance = isInstance && "entities" in value;
    isInstance = isInstance && "metadata" in value;
    isInstance = isInstance && "modelType" in value;
    return isInstance;
}
function RDFGraphFromJSON(json) {
    return RDFGraphFromJSONTyped(json);
}
function RDFGraphFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'diagrams': (json['diagrams'].map(DiagramFromJSON)),
        'entities': (json['entities'].map(EntityFromJSON)),
        'classInstanceEntities': !exists(json, 'classInstanceEntities') ? undefined : (json['classInstanceEntities'].map(ClassInstanceEntityFromJSON)),
        'metadata': RDFGraphMetadataFromJSON(json['metadata']),
        'config': !exists(json, 'config') ? undefined : RDFGraphConfigFromJSON(json['config']),
        'selectedDiagramId': !exists(json, 'selectedDiagramId') ? undefined : json['selectedDiagramId'],
        'modelType': json['modelType'],
        'actions': !exists(json, 'actions') ? undefined : (json['actions'].map(ActionFromJSON)),
        'creator': !exists(json, 'creator') ? undefined : json['creator'],
    };
}
function RDFGraphToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'diagrams': (value.diagrams.map(DiagramToJSON)),
        'entities': (value.entities.map(EntityToJSON)),
        'classInstanceEntities': value.classInstanceEntities === undefined ? undefined : (value.classInstanceEntities.map(ClassInstanceEntityToJSON)),
        'metadata': RDFGraphMetadataToJSON(value.metadata),
        'config': RDFGraphConfigToJSON(value.config),
        'selectedDiagramId': value.selectedDiagramId,
        'modelType': value.modelType,
        'actions': value.actions === undefined ? undefined : (value.actions.map(ActionToJSON)),
        'creator': value.creator,
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Check if a given object implements the VKGSnapshot interface.
 */
function instanceOfVKGSnapshot(value) {
    let isInstance = true;
    return isInstance;
}
function VKGSnapshotFromJSON(json) {
    return VKGSnapshotFromJSONTyped(json);
}
function VKGSnapshotFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'lastModification': !exists(json, 'lastModification') ? undefined : json['lastModification'],
        'rdfGraph': !exists(json, 'rdfGraph') ? undefined : RDFGraphFromJSON(json['rdfGraph']),
    };
}
function VKGSnapshotToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'id': value.id,
        'name': value.name,
        'description': value.description,
        'lastModification': value.lastModification,
        'rdfGraph': RDFGraphToJSON(value.rdfGraph),
    };
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 *
 */
class OntologyDesignerApi extends BaseAPI {
    /**
     * Delete the ontology draft {ontologyName}
     */
    deleteOntologyDraftRaw(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
                throw new RequiredError('ontologyName', 'Required parameter requestParameters.ontologyName was null or undefined when calling deleteOntologyDraft.');
            }
            const queryParameters = {};
            const headerParameters = {};
            const response = yield this.request({
                path: `/ontologyDraft/{ontologyName}`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
                method: 'DELETE',
                headers: headerParameters,
                query: queryParameters,
            }, initOverrides);
            return new JSONApiResponse(response, (jsonValue) => jsonValue.map(RDFGraphFromJSON));
        });
    }
    /**
     * Delete the ontology draft {ontologyName}
     */
    deleteOntologyDraft(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.deleteOntologyDraftRaw(requestParameters, initOverrides);
            return yield response.value();
        });
    }
    /**
     * Download the ontology draft in the body converted in OWL2
     */
    downloadOntologyDraftRaw(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryParameters = {};
            const headerParameters = {};
            headerParameters['Content-Type'] = 'application/json';
            const response = yield this.request({
                path: `/ontologyDraft/download`,
                method: 'POST',
                headers: headerParameters,
                query: queryParameters,
                body: RDFGraphToJSON(requestParameters.rDFGraph),
            }, initOverrides);
            if (this.isJsonMime(response.headers.get('content-type'))) {
                return new JSONApiResponse(response);
            }
            else {
                return new TextApiResponse(response);
            }
        });
    }
    /**
     * Download the ontology draft in the body converted in OWL2
     */
    downloadOntologyDraft(requestParameters = {}, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.downloadOntologyDraftRaw(requestParameters, initOverrides);
            return yield response.value();
        });
    }
    /**
     * Returns the ontology draft {ontologyName}
     */
    getOntologyDraftRaw(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
                throw new RequiredError('ontologyName', 'Required parameter requestParameters.ontologyName was null or undefined when calling getOntologyDraft.');
            }
            const queryParameters = {};
            const headerParameters = {};
            const response = yield this.request({
                path: `/ontologyDraft/{ontologyName}`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
                method: 'GET',
                headers: headerParameters,
                query: queryParameters,
            }, initOverrides);
            return new JSONApiResponse(response, (jsonValue) => RDFGraphFromJSON(jsonValue));
        });
    }
    /**
     * Returns the ontology draft {ontologyName}
     */
    getOntologyDraft(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getOntologyDraftRaw(requestParameters, initOverrides);
            return yield response.value();
        });
    }
    /**
     * Returns the list of all ontology drafts made by the user
     */
    getOntologyDraftsRaw(initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryParameters = {};
            const headerParameters = {};
            const response = yield this.request({
                path: `/ontologyDraftInfos`,
                method: 'GET',
                headers: headerParameters,
                query: queryParameters,
            }, initOverrides);
            return new JSONApiResponse(response, (jsonValue) => jsonValue.map(OntologyDraftInfoFromJSON));
        });
    }
    /**
     * Returns the list of all ontology drafts made by the user
     */
    getOntologyDrafts(initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getOntologyDraftsRaw(initOverrides);
            return yield response.value();
        });
    }
    /**
     * Add to the list of all ontology drafts a new draft
     */
    postOntologyDraftsRaw(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
                throw new RequiredError('ontologyName', 'Required parameter requestParameters.ontologyName was null or undefined when calling postOntologyDrafts.');
            }
            const queryParameters = {};
            const headerParameters = {};
            headerParameters['Content-Type'] = 'application/json';
            const response = yield this.request({
                path: `/ontologyDraft/{ontologyName}`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
                method: 'POST',
                headers: headerParameters,
                query: queryParameters,
                body: RDFGraphToJSON(requestParameters.rDFGraph),
            }, initOverrides);
            return new JSONApiResponse(response, (jsonValue) => jsonValue.map(RDFGraphFromJSON));
        });
    }
    /**
     * Add to the list of all ontology drafts a new draft
     */
    postOntologyDrafts(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.postOntologyDraftsRaw(requestParameters, initOverrides);
            return yield response.value();
        });
    }
    /**
     * Modify the ontology draft {ontologyName} (called when using the ontology builder to save the draft)
     */
    putOntologyDraftRaw(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
                throw new RequiredError('ontologyName', 'Required parameter requestParameters.ontologyName was null or undefined when calling putOntologyDraft.');
            }
            const queryParameters = {};
            const headerParameters = {};
            headerParameters['Content-Type'] = 'application/json';
            const response = yield this.request({
                path: `/ontologyDraft/{ontologyName}`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
                method: 'PUT',
                headers: headerParameters,
                query: queryParameters,
                body: RDFGraphToJSON(requestParameters.rDFGraph),
            }, initOverrides);
            return new JSONApiResponse(response, (jsonValue) => jsonValue.map(RDFGraphFromJSON));
        });
    }
    /**
     * Modify the ontology draft {ontologyName} (called when using the ontology builder to save the draft)
     */
    putOntologyDraft(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.putOntologyDraftRaw(requestParameters, initOverrides);
            return yield response.value();
        });
    }
}

/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 *
 */
class VKGApi extends BaseAPI {
    /**
     * Returns RDFGraph for CONSTRUCT visualization
     */
    getRDFGraphConstructRaw(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            if (requestParameters.name === null || requestParameters.name === undefined) {
                throw new RequiredError('name', 'Required parameter requestParameters.name was null or undefined when calling getRDFGraphConstruct.');
            }
            if (requestParameters.queryID === null || requestParameters.queryID === undefined) {
                throw new RequiredError('queryID', 'Required parameter requestParameters.queryID was null or undefined when calling getRDFGraphConstruct.');
            }
            if (requestParameters.pageSize === null || requestParameters.pageSize === undefined) {
                throw new RequiredError('pageSize', 'Required parameter requestParameters.pageSize was null or undefined when calling getRDFGraphConstruct.');
            }
            if (requestParameters.pageNumber === null || requestParameters.pageNumber === undefined) {
                throw new RequiredError('pageNumber', 'Required parameter requestParameters.pageNumber was null or undefined when calling getRDFGraphConstruct.');
            }
            const queryParameters = {};
            if (requestParameters.pageSize !== undefined) {
                queryParameters['pageSize'] = requestParameters.pageSize;
            }
            if (requestParameters.pageNumber !== undefined) {
                queryParameters['pageNumber'] = requestParameters.pageNumber;
            }
            const headerParameters = {};
            const response = yield this.request({
                path: `/endpoint/{name}/cquery/{queryID}/results/rdfGraph`.replace(`{${"name"}}`, encodeURIComponent(String(requestParameters.name))).replace(`{${"queryID"}}`, encodeURIComponent(String(requestParameters.queryID))),
                method: 'GET',
                headers: headerParameters,
                query: queryParameters,
            }, initOverrides);
            return new JSONApiResponse(response, (jsonValue) => RDFGraphFromJSON(jsonValue));
        });
    }
    /**
     * Returns RDFGraph for CONSTRUCT visualization
     */
    getRDFGraphConstruct(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getRDFGraphConstructRaw(requestParameters, initOverrides);
            return yield response.value();
        });
    }
    /**
     * Delete all the saved RDFGraph for VKGs exploration
     */
    owlOntologyOntologyNameVersionVkgCatalogDeleteRaw(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
                throw new RequiredError('ontologyName', 'Required parameter requestParameters.ontologyName was null or undefined when calling owlOntologyOntologyNameVersionVkgCatalogDelete.');
            }
            if (requestParameters.version === null || requestParameters.version === undefined) {
                throw new RequiredError('version', 'Required parameter requestParameters.version was null or undefined when calling owlOntologyOntologyNameVersionVkgCatalogDelete.');
            }
            const queryParameters = {};
            if (requestParameters.version !== undefined) {
                queryParameters['version'] = requestParameters.version;
            }
            const headerParameters = {};
            const response = yield this.request({
                path: `/owlOntology/{ontologyName}/version/vkg/catalog`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
                method: 'DELETE',
                headers: headerParameters,
                query: queryParameters,
            }, initOverrides);
            return new JSONApiResponse(response, (jsonValue) => jsonValue.map(VKGSnapshotFromJSON));
        });
    }
    /**
     * Delete all the saved RDFGraph for VKGs exploration
     */
    owlOntologyOntologyNameVersionVkgCatalogDelete(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.owlOntologyOntologyNameVersionVkgCatalogDeleteRaw(requestParameters, initOverrides);
            return yield response.value();
        });
    }
    /**
     * Returns the catalog as a FileInfo
     */
    owlOntologyOntologyNameVersionVkgCatalogExportGetRaw(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
                throw new RequiredError('ontologyName', 'Required parameter requestParameters.ontologyName was null or undefined when calling owlOntologyOntologyNameVersionVkgCatalogExportGet.');
            }
            if (requestParameters.version === null || requestParameters.version === undefined) {
                throw new RequiredError('version', 'Required parameter requestParameters.version was null or undefined when calling owlOntologyOntologyNameVersionVkgCatalogExportGet.');
            }
            const queryParameters = {};
            if (requestParameters.version !== undefined) {
                queryParameters['version'] = requestParameters.version;
            }
            const headerParameters = {};
            const response = yield this.request({
                path: `/owlOntology/{ontologyName}/version/vkg/catalog/export`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
                method: 'GET',
                headers: headerParameters,
                query: queryParameters,
            }, initOverrides);
            if (this.isJsonMime(response.headers.get('content-type'))) {
                return new JSONApiResponse(response);
            }
            else {
                return new TextApiResponse(response);
            }
        });
    }
    /**
     * Returns the catalog as a FileInfo
     */
    owlOntologyOntologyNameVersionVkgCatalogExportGet(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.owlOntologyOntologyNameVersionVkgCatalogExportGetRaw(requestParameters, initOverrides);
            return yield response.value();
        });
    }
    /**
     * Returns the saved RDFGraph for VKGs exploration
     */
    owlOntologyOntologyNameVersionVkgCatalogGetRaw(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
                throw new RequiredError('ontologyName', 'Required parameter requestParameters.ontologyName was null or undefined when calling owlOntologyOntologyNameVersionVkgCatalogGet.');
            }
            if (requestParameters.version === null || requestParameters.version === undefined) {
                throw new RequiredError('version', 'Required parameter requestParameters.version was null or undefined when calling owlOntologyOntologyNameVersionVkgCatalogGet.');
            }
            const queryParameters = {};
            if (requestParameters.version !== undefined) {
                queryParameters['version'] = requestParameters.version;
            }
            const headerParameters = {};
            const response = yield this.request({
                path: `/owlOntology/{ontologyName}/version/vkg/catalog`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
                method: 'GET',
                headers: headerParameters,
                query: queryParameters,
            }, initOverrides);
            return new JSONApiResponse(response, (jsonValue) => jsonValue.map(VKGSnapshotFromJSON));
        });
    }
    /**
     * Returns the saved RDFGraph for VKGs exploration
     */
    owlOntologyOntologyNameVersionVkgCatalogGet(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.owlOntologyOntologyNameVersionVkgCatalogGetRaw(requestParameters, initOverrides);
            return yield response.value();
        });
    }
    /**
     * Import a FileInfo in the ontology VKG\'s catalog
     */
    owlOntologyOntologyNameVersionVkgCatalogImportPostRaw(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
                throw new RequiredError('ontologyName', 'Required parameter requestParameters.ontologyName was null or undefined when calling owlOntologyOntologyNameVersionVkgCatalogImportPost.');
            }
            if (requestParameters.version === null || requestParameters.version === undefined) {
                throw new RequiredError('version', 'Required parameter requestParameters.version was null or undefined when calling owlOntologyOntologyNameVersionVkgCatalogImportPost.');
            }
            const queryParameters = {};
            if (requestParameters.version !== undefined) {
                queryParameters['version'] = requestParameters.version;
            }
            if (requestParameters.additive !== undefined) {
                queryParameters['additive'] = requestParameters.additive;
            }
            const headerParameters = {};
            headerParameters['Content-Type'] = 'application/json';
            const response = yield this.request({
                path: `/owlOntology/{ontologyName}/version/vkg/catalog/import`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
                method: 'POST',
                headers: headerParameters,
                query: queryParameters,
                body: requestParameters.body,
            }, initOverrides);
            return new JSONApiResponse(response, (jsonValue) => jsonValue.map(VKGSnapshotFromJSON));
        });
    }
    /**
     * Import a FileInfo in the ontology VKG\'s catalog
     */
    owlOntologyOntologyNameVersionVkgCatalogImportPost(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.owlOntologyOntologyNameVersionVkgCatalogImportPostRaw(requestParameters, initOverrides);
            return yield response.value();
        });
    }
    /**
     * Save a new VKG exploration
     */
    owlOntologyOntologyNameVersionVkgCatalogPostRaw(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
                throw new RequiredError('ontologyName', 'Required parameter requestParameters.ontologyName was null or undefined when calling owlOntologyOntologyNameVersionVkgCatalogPost.');
            }
            if (requestParameters.version === null || requestParameters.version === undefined) {
                throw new RequiredError('version', 'Required parameter requestParameters.version was null or undefined when calling owlOntologyOntologyNameVersionVkgCatalogPost.');
            }
            const queryParameters = {};
            if (requestParameters.version !== undefined) {
                queryParameters['version'] = requestParameters.version;
            }
            const headerParameters = {};
            headerParameters['Content-Type'] = 'application/json';
            const response = yield this.request({
                path: `/owlOntology/{ontologyName}/version/vkg/catalog`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
                method: 'POST',
                headers: headerParameters,
                query: queryParameters,
                body: VKGSnapshotToJSON(requestParameters.vKGSnapshot),
            }, initOverrides);
            return new JSONApiResponse(response, (jsonValue) => jsonValue.map(VKGSnapshotFromJSON));
        });
    }
    /**
     * Save a new VKG exploration
     */
    owlOntologyOntologyNameVersionVkgCatalogPost(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.owlOntologyOntologyNameVersionVkgCatalogPostRaw(requestParameters, initOverrides);
            return yield response.value();
        });
    }
    /**
     * Delete the VKG exploration
     */
    owlOntologyOntologyNameVersionVkgCatalogSnapshotIdDeleteRaw(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
                throw new RequiredError('ontologyName', 'Required parameter requestParameters.ontologyName was null or undefined when calling owlOntologyOntologyNameVersionVkgCatalogSnapshotIdDelete.');
            }
            if (requestParameters.version === null || requestParameters.version === undefined) {
                throw new RequiredError('version', 'Required parameter requestParameters.version was null or undefined when calling owlOntologyOntologyNameVersionVkgCatalogSnapshotIdDelete.');
            }
            if (requestParameters.snapshotId === null || requestParameters.snapshotId === undefined) {
                throw new RequiredError('snapshotId', 'Required parameter requestParameters.snapshotId was null or undefined when calling owlOntologyOntologyNameVersionVkgCatalogSnapshotIdDelete.');
            }
            const queryParameters = {};
            if (requestParameters.version !== undefined) {
                queryParameters['version'] = requestParameters.version;
            }
            const headerParameters = {};
            const response = yield this.request({
                path: `/owlOntology/{ontologyName}/version/vkg/catalog/{snapshotId}`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))).replace(`{${"snapshotId"}}`, encodeURIComponent(String(requestParameters.snapshotId))),
                method: 'DELETE',
                headers: headerParameters,
                query: queryParameters,
            }, initOverrides);
            return new JSONApiResponse(response, (jsonValue) => jsonValue.map(VKGSnapshotFromJSON));
        });
    }
    /**
     * Delete the VKG exploration
     */
    owlOntologyOntologyNameVersionVkgCatalogSnapshotIdDelete(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.owlOntologyOntologyNameVersionVkgCatalogSnapshotIdDeleteRaw(requestParameters, initOverrides);
            return yield response.value();
        });
    }
    /**
     * Modify a VKG exploration
     */
    owlOntologyOntologyNameVersionVkgCatalogSnapshotIdPutRaw(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
                throw new RequiredError('ontologyName', 'Required parameter requestParameters.ontologyName was null or undefined when calling owlOntologyOntologyNameVersionVkgCatalogSnapshotIdPut.');
            }
            if (requestParameters.version === null || requestParameters.version === undefined) {
                throw new RequiredError('version', 'Required parameter requestParameters.version was null or undefined when calling owlOntologyOntologyNameVersionVkgCatalogSnapshotIdPut.');
            }
            if (requestParameters.snapshotId === null || requestParameters.snapshotId === undefined) {
                throw new RequiredError('snapshotId', 'Required parameter requestParameters.snapshotId was null or undefined when calling owlOntologyOntologyNameVersionVkgCatalogSnapshotIdPut.');
            }
            const queryParameters = {};
            if (requestParameters.version !== undefined) {
                queryParameters['version'] = requestParameters.version;
            }
            const headerParameters = {};
            headerParameters['Content-Type'] = 'application/json';
            const response = yield this.request({
                path: `/owlOntology/{ontologyName}/version/vkg/catalog/{snapshotId}`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))).replace(`{${"snapshotId"}}`, encodeURIComponent(String(requestParameters.snapshotId))),
                method: 'PUT',
                headers: headerParameters,
                query: queryParameters,
                body: VKGSnapshotToJSON(requestParameters.vKGSnapshot),
            }, initOverrides);
            return new JSONApiResponse(response, (jsonValue) => jsonValue.map(VKGSnapshotFromJSON));
        });
    }
    /**
     * Modify a VKG exploration
     */
    owlOntologyOntologyNameVersionVkgCatalogSnapshotIdPut(requestParameters, initOverrides) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.owlOntologyOntologyNameVersionVkgCatalogSnapshotIdPutRaw(requestParameters, initOverrides);
            return yield response.value();
        });
    }
}

/* tslint:disable */
/* eslint-disable */

var index$4 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ActionFromJSON: ActionFromJSON,
    ActionFromJSONTyped: ActionFromJSONTyped,
    ActionInvolvedElementsFromJSON: ActionInvolvedElementsFromJSON,
    ActionInvolvedElementsFromJSONTyped: ActionInvolvedElementsFromJSONTyped,
    ActionInvolvedElementsToJSON: ActionInvolvedElementsToJSON,
    get ActionOperationTypeEnum () { return ActionOperationTypeEnum; },
    ActionToJSON: ActionToJSON,
    ActionUserFromJSON: ActionUserFromJSON,
    ActionUserFromJSONTyped: ActionUserFromJSONTyped,
    ActionUserToJSON: ActionUserToJSON,
    AnnotationActionFromJSON: AnnotationActionFromJSON,
    AnnotationActionFromJSONTyped: AnnotationActionFromJSONTyped,
    get AnnotationActionOperationTypeEnum () { return AnnotationActionOperationTypeEnum; },
    AnnotationActionToJSON: AnnotationActionToJSON,
    AnnotationFromJSON: AnnotationFromJSON,
    AnnotationFromJSONTyped: AnnotationFromJSONTyped,
    AnnotationToJSON: AnnotationToJSON,
    BASE_PATH: BASE_PATH,
    BaseAPI: BaseAPI,
    BlobApiResponse: BlobApiResponse,
    COLLECTION_FORMATS: COLLECTION_FORMATS,
    ClassInstanceEntityAllOfFromJSON: ClassInstanceEntityAllOfFromJSON,
    ClassInstanceEntityAllOfFromJSONTyped: ClassInstanceEntityAllOfFromJSONTyped,
    ClassInstanceEntityAllOfToJSON: ClassInstanceEntityAllOfToJSON,
    ClassInstanceEntityFromJSON: ClassInstanceEntityFromJSON,
    ClassInstanceEntityFromJSONTyped: ClassInstanceEntityFromJSONTyped,
    ClassInstanceEntityToJSON: ClassInstanceEntityToJSON,
    Configuration: Configuration,
    DataPropertyValueFromJSON: DataPropertyValueFromJSON,
    DataPropertyValueFromJSONTyped: DataPropertyValueFromJSONTyped,
    DataPropertyValueToJSON: DataPropertyValueToJSON,
    DefaultConfig: DefaultConfig,
    DiagramActionFromJSON: DiagramActionFromJSON,
    DiagramActionFromJSONTyped: DiagramActionFromJSONTyped,
    get DiagramActionOperationTypeEnum () { return DiagramActionOperationTypeEnum; },
    DiagramActionToJSON: DiagramActionToJSON,
    DiagramFromJSON: DiagramFromJSON,
    DiagramFromJSONTyped: DiagramFromJSONTyped,
    DiagramToJSON: DiagramToJSON,
    EdgeActionFromJSON: EdgeActionFromJSON,
    EdgeActionFromJSONTyped: EdgeActionFromJSONTyped,
    get EdgeActionOperationTypeEnum () { return EdgeActionOperationTypeEnum; },
    EdgeActionToJSON: EdgeActionToJSON,
    EdgeAllOfFromJSON: EdgeAllOfFromJSON,
    EdgeAllOfFromJSONTyped: EdgeAllOfFromJSONTyped,
    EdgeAllOfToJSON: EdgeAllOfToJSON,
    EdgeFromJSON: EdgeFromJSON,
    EdgeFromJSONTyped: EdgeFromJSONTyped,
    EdgeToJSON: EdgeToJSON,
    ElementFromJSON: ElementFromJSON,
    ElementFromJSONTyped: ElementFromJSONTyped,
    ElementToJSON: ElementToJSON,
    EntityActionFromJSON: EntityActionFromJSON,
    EntityActionFromJSONTyped: EntityActionFromJSONTyped,
    get EntityActionOperationTypeEnum () { return EntityActionOperationTypeEnum; },
    EntityActionToJSON: EntityActionToJSON,
    EntityFromJSON: EntityFromJSON,
    EntityFromJSONTyped: EntityFromJSONTyped,
    EntityToJSON: EntityToJSON,
    FetchError: FetchError,
    get FunctionPropertiesEnum () { return FunctionPropertiesEnum; },
    FunctionPropertiesEnumFromJSON: FunctionPropertiesEnumFromJSON,
    FunctionPropertiesEnumFromJSONTyped: FunctionPropertiesEnumFromJSONTyped,
    FunctionPropertiesEnumToJSON: FunctionPropertiesEnumToJSON,
    HierarchyActionFromJSON: HierarchyActionFromJSON,
    HierarchyActionFromJSONTyped: HierarchyActionFromJSONTyped,
    HierarchyActionToJSON: HierarchyActionToJSON,
    HierarchyFromJSON: HierarchyFromJSON,
    HierarchyFromJSONTyped: HierarchyFromJSONTyped,
    HierarchySuperclassesInnerFromJSON: HierarchySuperclassesInnerFromJSON,
    HierarchySuperclassesInnerFromJSONTyped: HierarchySuperclassesInnerFromJSONTyped,
    HierarchySuperclassesInnerToJSON: HierarchySuperclassesInnerToJSON,
    HierarchyToJSON: HierarchyToJSON,
    JSONApiResponse: JSONApiResponse,
    NamespaceActionFromJSON: NamespaceActionFromJSON,
    NamespaceActionFromJSONTyped: NamespaceActionFromJSONTyped,
    get NamespaceActionOperationTypeEnum () { return NamespaceActionOperationTypeEnum; },
    NamespaceActionToJSON: NamespaceActionToJSON,
    NamespaceFromJSON: NamespaceFromJSON,
    NamespaceFromJSONTyped: NamespaceFromJSONTyped,
    NamespaceToJSON: NamespaceToJSON,
    NodeActionFromJSON: NodeActionFromJSON,
    NodeActionFromJSONTyped: NodeActionFromJSONTyped,
    get NodeActionOperationTypeEnum () { return NodeActionOperationTypeEnum; },
    NodeActionToJSON: NodeActionToJSON,
    NodeAllOfFromJSON: NodeAllOfFromJSON,
    NodeAllOfFromJSONTyped: NodeAllOfFromJSONTyped,
    NodeAllOfToJSON: NodeAllOfToJSON,
    NodeFromJSON: NodeFromJSON,
    NodeFromJSONTyped: NodeFromJSONTyped,
    NodeToJSON: NodeToJSON,
    OntologyDesignerApi: OntologyDesignerApi,
    OntologyDraftInfoFromJSON: OntologyDraftInfoFromJSON,
    OntologyDraftInfoFromJSONTyped: OntologyDraftInfoFromJSONTyped,
    OntologyDraftInfoToJSON: OntologyDraftInfoToJSON,
    PositionFromJSON: PositionFromJSON,
    PositionFromJSONTyped: PositionFromJSONTyped,
    PositionToJSON: PositionToJSON,
    PropertyActionFromJSON: PropertyActionFromJSON,
    PropertyActionFromJSONTyped: PropertyActionFromJSONTyped,
    get PropertyActionOperationTypeEnum () { return PropertyActionOperationTypeEnum; },
    PropertyActionToJSON: PropertyActionToJSON,
    get RDFGraphConfigEntityNameTypeEnum () { return RDFGraphConfigEntityNameTypeEnum; },
    get RDFGraphConfigFiltersEnum () { return RDFGraphConfigFiltersEnum; },
    RDFGraphConfigFromJSON: RDFGraphConfigFromJSON,
    RDFGraphConfigFromJSONTyped: RDFGraphConfigFromJSONTyped,
    RDFGraphConfigToJSON: RDFGraphConfigToJSON,
    RDFGraphFromJSON: RDFGraphFromJSON,
    RDFGraphFromJSONTyped: RDFGraphFromJSONTyped,
    RDFGraphMetadataFromJSON: RDFGraphMetadataFromJSON,
    RDFGraphMetadataFromJSONTyped: RDFGraphMetadataFromJSONTyped,
    RDFGraphMetadataToJSON: RDFGraphMetadataToJSON,
    get RDFGraphModelTypeEnum () { return RDFGraphModelTypeEnum; },
    RDFGraphToJSON: RDFGraphToJSON,
    RequiredError: RequiredError,
    ResponseError: ResponseError,
    TextApiResponse: TextApiResponse,
    ThemeFromJSON: ThemeFromJSON,
    ThemeFromJSONTyped: ThemeFromJSONTyped,
    ThemeToJSON: ThemeToJSON,
    get TypesEnum () { return TypesEnum; },
    TypesEnumFromJSON: TypesEnumFromJSON,
    TypesEnumFromJSONTyped: TypesEnumFromJSONTyped,
    TypesEnumToJSON: TypesEnumToJSON,
    VKGApi: VKGApi,
    VKGSnapshotFromJSON: VKGSnapshotFromJSON,
    VKGSnapshotFromJSONTyped: VKGSnapshotFromJSONTyped,
    VKGSnapshotToJSON: VKGSnapshotToJSON,
    ViewportFromJSON: ViewportFromJSON,
    ViewportFromJSONTyped: ViewportFromJSONTyped,
    ViewportToJSON: ViewportToJSON,
    VoidApiResponse: VoidApiResponse,
    canConsumeForm: canConsumeForm,
    exists: exists,
    instanceOfAction: instanceOfAction,
    instanceOfActionInvolvedElements: instanceOfActionInvolvedElements,
    instanceOfActionUser: instanceOfActionUser,
    instanceOfAnnotation: instanceOfAnnotation,
    instanceOfAnnotationAction: instanceOfAnnotationAction,
    instanceOfClassInstanceEntity: instanceOfClassInstanceEntity,
    instanceOfClassInstanceEntityAllOf: instanceOfClassInstanceEntityAllOf,
    instanceOfDataPropertyValue: instanceOfDataPropertyValue,
    instanceOfDiagram: instanceOfDiagram,
    instanceOfDiagramAction: instanceOfDiagramAction,
    instanceOfEdge: instanceOfEdge,
    instanceOfEdgeAction: instanceOfEdgeAction,
    instanceOfEdgeAllOf: instanceOfEdgeAllOf,
    instanceOfElement: instanceOfElement,
    instanceOfEntity: instanceOfEntity,
    instanceOfEntityAction: instanceOfEntityAction,
    instanceOfHierarchy: instanceOfHierarchy,
    instanceOfHierarchyAction: instanceOfHierarchyAction,
    instanceOfHierarchySuperclassesInner: instanceOfHierarchySuperclassesInner,
    instanceOfNamespace: instanceOfNamespace,
    instanceOfNamespaceAction: instanceOfNamespaceAction,
    instanceOfNode: instanceOfNode,
    instanceOfNodeAction: instanceOfNodeAction,
    instanceOfNodeAllOf: instanceOfNodeAllOf,
    instanceOfOntologyDraftInfo: instanceOfOntologyDraftInfo,
    instanceOfPosition: instanceOfPosition,
    instanceOfPropertyAction: instanceOfPropertyAction,
    instanceOfRDFGraph: instanceOfRDFGraph,
    instanceOfRDFGraphConfig: instanceOfRDFGraphConfig,
    instanceOfRDFGraphMetadata: instanceOfRDFGraphMetadata,
    instanceOfTheme: instanceOfTheme,
    instanceOfVKGSnapshot: instanceOfVKGSnapshot,
    instanceOfViewport: instanceOfViewport,
    mapValues: mapValues,
    querystring: querystring
});

// export enum FunctionalityEnum {
//   functional = 'functional',
//   inverseFunctional = 'inverseFunctional',
//   transitive = 'transitive',
//   symmetric = 'symmetric',
//   asymmetric = 'asymmetric',
//   reflexive = 'reflexive',
//   irreflexive = 'irreflexive'
// }
class GrapholEntity extends AnnotatedElement {
    static newFromSwagger(iri, e) {
        const instance = new GrapholEntity(iri);
        Object.entries(e).forEach(([key, value]) => {
            if (e[key] && key !== 'fullIri') {
                instance[key] = value;
            }
        });
        return instance;
    }
    constructor(iri) {
        super();
        this._occurrences = new Map([[RendererStatesEnum.GRAPHOL, []]]);
        this._isDataPropertyFunctional = false;
        this._functionProperties = [];
        this.iri = iri;
    }
    addOccurrence(newGrapholElement, representationKind = RendererStatesEnum.GRAPHOL) {
        if (!this.occurrences.get(representationKind)) {
            this.occurrences.set(representationKind, []);
        }
        const occurrences = this.occurrences.get(representationKind);
        if (!(occurrences === null || occurrences === void 0 ? void 0 : occurrences.some(occ => occ.equals(newGrapholElement)))) {
            occurrences === null || occurrences === void 0 ? void 0 : occurrences.push(newGrapholElement);
        }
    }
    removeOccurrence(grapholElement, representationKind) {
        const occurrences = this.occurrences.get(representationKind);
        const occurrenceToRemoveIndex = occurrences === null || occurrences === void 0 ? void 0 : occurrences.findIndex(o => o === grapholElement);
        if (occurrenceToRemoveIndex !== undefined && occurrenceToRemoveIndex >= 0) {
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
    get types() {
        var _a;
        let types = new Set();
        (_a = this._manualTypes) === null || _a === void 0 ? void 0 : _a.forEach(t => types.add(t));
        // compute from occurrences
        for (let [_, elements] of this.occurrences) {
            elements.forEach(e => types.add(e.type));
        }
        return Array.from(types);
    }
    // only used when resuming from VKG, in that case we need entities to store their types
    // even if they do not appear in graph.
    // in all other cases types are derived from occurrences in graphs.
    set manualTypes(newTypes) {
        this._manualTypes = newTypes;
    }
    /**
     * Check if entity is of a certain type
     * @param type
     */
    is(type) {
        var _a;
        if ((_a = this._manualTypes) === null || _a === void 0 ? void 0 : _a.has(type))
            return true;
        for (let [_, elements] of this.occurrences) {
            if (elements.some(e => e.is(type))) {
                return true;
            }
        }
        return false;
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
    get fullIri() {
        return this.iri.fullIri;
    }
    get functionProperties() {
        return this._functionProperties;
    }
    set functionProperties(properties) {
        this._functionProperties = properties;
    }
    get isDataPropertyFunctional() {
        return this._isDataPropertyFunctional;
    }
    set isDataPropertyFunctional(value) {
        this._isDataPropertyFunctional = value;
    }
    get datatype() { return this._datatype; }
    set datatype(datatype) { this._datatype = datatype; }
    get color() { return this._color; }
    set color(color) { this._color = color; }
    getOccurrenceByType(type, rendererState) {
        var _a;
        return (_a = this.occurrences.get(rendererState)) === null || _a === void 0 ? void 0 : _a.find(o => o.type === type);
    }
    getOccurrencesByType(type, rendererState) {
        var _a;
        return (_a = this.occurrences.get(rendererState)) === null || _a === void 0 ? void 0 : _a.filter(o => o.type === type);
    }
    hasFunctionProperty(property) {
        var _a;
        const resVal = ((_a = this._functionProperties) === null || _a === void 0 ? void 0 : _a.includes(property)) || false;
        if (property === FunctionPropertiesEnum.FUNCTIONAL) {
            return this.isDataPropertyFunctional || resVal;
        }
        return resVal;
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
    getDisplayedName(nameType, currentLanguage) {
        var _a, _b;
        let newDisplayedName;
        switch (nameType) {
            case RDFGraphConfigEntityNameTypeEnum.LABEL:
                newDisplayedName =
                    ((_a = this.getLabels(currentLanguage)[0]) === null || _a === void 0 ? void 0 : _a.value) ||
                        ((_b = this.getLabels()[0]) === null || _b === void 0 ? void 0 : _b.value) ||
                        (this.iri.remainder.length > 0 ? this.iri.remainder : undefined) ||
                        this.iri.toString();
                break;
            case RDFGraphConfigEntityNameTypeEnum.PREFIXED_IRI:
                newDisplayedName = this.iri.prefixed;
                break;
            case RDFGraphConfigEntityNameTypeEnum.FULL_IRI:
                newDisplayedName = this.iri.fullIri;
                break;
        }
        if (this.is(TypesEnum.CLASS) || this.is(TypesEnum.INDIVIDUAL))
            return newDisplayedName.replace(/\r?\n|\r/g, '');
        else
            return newDisplayedName;
    }
    getEntityOriginalNodeId() {
        const grapholRepresentationOccurrences = this.occurrences.get(RendererStatesEnum.GRAPHOL);
        if (grapholRepresentationOccurrences) {
            return grapholRepresentationOccurrences[0].id; // used in UI to show the original nodeID in graphol
        }
    }
    getIdInDiagram(diagramId, type, rendererState) {
        var _a;
        let entityOccurrences = this.getOccurrencesByType(type, rendererState);
        if (!entityOccurrences || entityOccurrences.length === 0)
            entityOccurrences = this.getOccurrencesByType(type, RendererStatesEnum.GRAPHOL);
        if (!entityOccurrences)
            return;
        return (_a = entityOccurrences.find(o => o.diagramId === diagramId)) === null || _a === void 0 ? void 0 : _a.id;
    }
    json() {
        return {
            fullIri: this.fullIri,
            annotations: this.getAnnotations().map(ann => {
                return {
                    property: ann.property,
                    value: ann.value,
                    language: ann.language,
                    datatype: ann.datatype,
                    hasIriValue: ann.hasIriValue,
                };
            }),
            datatype: this.datatype,
            functionProperties: this.functionProperties,
            isDataPropertyFunctional: this.isDataPropertyFunctional,
        };
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
    get diagramId() { return this._diagramId; }
    set diagramId(newdiagramId) {
        this._diagramId = newdiagramId;
    }
    /**
     * Check if element is of a certain type
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
            case TypesEnum.CLASS:
            case TypesEnum.DATA_PROPERTY:
            case TypesEnum.OBJECT_PROPERTY:
            case TypesEnum.ANNOTATION_PROPERTY:
            case TypesEnum.INDIVIDUAL:
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
        if (grapholEntity && (this.is(TypesEnum.DATA_PROPERTY) || this.is(TypesEnum.OBJECT_PROPERTY)) && (grapholEntity.is(TypesEnum.DATA_PROPERTY) || grapholEntity.is(TypesEnum.OBJECT_PROPERTY))) {
            result.data[FunctionPropertiesEnum.FUNCTIONAL] = grapholEntity.hasFunctionProperty(FunctionPropertiesEnum.FUNCTIONAL);
            result.data[FunctionPropertiesEnum.INVERSE_FUNCTIONAL] = grapholEntity.hasFunctionProperty(FunctionPropertiesEnum.INVERSE_FUNCTIONAL);
        }
        return [result];
    }
    clone() {
        const cloneObj = new GrapholElement(this.id, this.type);
        Object.assign(cloneObj, this);
        return cloneObj;
    }
    json() {
        const result = {
            id: this.id,
            type: this.type,
            originalId: this.originalId,
            diagramId: this.diagramId,
            displayedName: this.displayedName,
            iri: this.iri,
        };
        return result;
    }
    equals(grapholElement) {
        return this === grapholElement ||
            (this.id === grapholElement.id &&
                this.diagramId === grapholElement.diagramId);
    }
    isNode() {
        return this.position !== undefined;
    }
    isEdge() {
        return this.sourceId !== undefined;
    }
}

class GrapholEdge extends GrapholElement {
    static newFromSwagger(n) {
        const instance = new GrapholEdge(n.id, n.type);
        if (n.type === TypesEnum.COMPLETE_DISJOINT_UNION ||
            n.type === TypesEnum.COMPLETE_UNION) {
            instance.targetLabel = 'C';
        }
        Object.entries(n).forEach(([key, value]) => {
            if (n[key] && key !== 'id' && key !== 'type') {
                if (key === 'breakpoints') {
                    instance.addBreakPoint(value);
                }
                else {
                    instance[key] = value;
                }
            }
        });
        return instance;
    }
    constructor(id, type) {
        super(id, type);
        this._breakpoints = [];
        this.isHierarchy = () => {
            return this.is(TypesEnum.UNION) ||
                this.is(TypesEnum.COMPLETE_UNION) ||
                this.is(TypesEnum.DISJOINT_UNION) ||
                this.is(TypesEnum.COMPLETE_DISJOINT_UNION);
        };
        if (type === TypesEnum.ATTRIBUTE_EDGE) {
            this.domainTyped = true;
        }
        if (type === TypesEnum.OBJECT_PROPERTY) {
            this.domainTyped = true;
            this.rangeTyped = true;
        }
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
        if (this.is(TypesEnum.SAME) || this.is(TypesEnum.DIFFERENT))
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
            domainMandatory: this.domainMandatory,
            domainTyped: this.domainTyped,
            rangeMandatory: this.rangeMandatory,
            rangeTyped: this.rangeTyped,
        });
        result[0].classes = this.type.toString();
        return result;
    }
    clone() {
        const cloneObj = new GrapholEdge(this.id, this.type);
        Object.assign(cloneObj, this);
        return cloneObj;
    }
    json() {
        const result = super.json();
        result.sourceId = this.sourceId;
        result.targetId = this.targetId;
        result.breakpoints = this.breakpoints;
        result.domainMandatory = this.domainMandatory;
        result.rangeMandatory = this.rangeMandatory;
        result.domainTyped = this.domainTyped;
        result.rangeTyped = this.rangeTyped;
        return result;
    }
}
function isGrapholEdge(elem) {
    return elem.sourceId !== undefined;
}

const LABEL_HEIGHT = 23;
class GrapholNode extends GrapholElement {
    constructor() {
        super(...arguments);
        this._x = 0;
        this._y = 0;
        this._labelHeight = LABEL_HEIGHT;
        this._labelXcentered = true;
        this._labelYcentered = true;
        this.isHierarchy = () => {
            return this.is(TypesEnum.UNION) || this.is(TypesEnum.DISJOINT_UNION);
        };
        // static wrapDisplayedName(newDisplayedName: string, maxWidth = 40): string {
        //   const textWidth = document.createElement('canvas').getContext('2d')?.measureText(newDisplayedName).width
        //   if (textWidth && textWidth > maxWidth && maxWidth > 0) {
        //     const unitaryWidth = newDisplayedName.length / textWidth
        //     const numberOfChunks = Math.ceil(textWidth / maxWidth)
        //     const chunkWidth = Math.floor(textWidth / numberOfChunks)
        //     const charNumberPerChunk  = Math.floor(chunkWidth / unitaryWidth)
        //     let result = newDisplayedName
        //     let chunk
        //     for(let i = 0; i < numberOfChunks; i++) {
        //       chunk = result.substring((i * charNumberPerChunk) + i, ((i + 1) * charNumberPerChunk) + i)
        //       console.log(chunk)
        //       result.replace(chunk, chunk.concat('\n'))
        //     }
        //     return result
        //   } else {
        //     return newDisplayedName
        //   }
        // }
    }
    static newFromSwagger(n) {
        const instance = new GrapholNode(n.id, n.type);
        Object.entries(n).forEach(([key, value]) => {
            var _a, _b;
            if (n[key] !== undefined && n[key] !== null && key !== 'id' && key !== 'type') {
                if (key === 'labelPosition') {
                    instance.labelXpos = (_a = n.labelPosition) === null || _a === void 0 ? void 0 : _a.x;
                    instance.labelYpos = (_b = n.labelPosition) === null || _b === void 0 ? void 0 : _b.y;
                }
                else {
                    instance[key] = value;
                }
            }
        });
        if (instance.labelXpos === undefined || instance.labelXpos === null) {
            instance.labelXpos = 0;
        }
        if (instance.labelYpos === undefined || instance.labelYpos === null) {
            instance.labelYpos = -18;
        }
        return instance;
    }
    get position() { return { x: this.x, y: this.y }; }
    set position(pos) {
        this._x = pos.x;
        this._y = pos.y;
    }
    get renderedPosition() {
        if (this._renderedX !== undefined && this._renderedY !== undefined)
            return { x: this._renderedX, y: this._renderedY };
    }
    set renderedPosition(pos) {
        this._renderedX = pos === null || pos === void 0 ? void 0 : pos.x;
        this._renderedY = pos === null || pos === void 0 ? void 0 : pos.y;
    }
    get x() { return this._x; }
    set x(valX) { this._x = valX; }
    get y() { return this._y; }
    set y(valY) { this._y = valY; }
    get shape() { return this._shape; }
    set shape(shape) {
        this._shape = shape;
    }
    get hierarchyID() { return this._hierarchyID; }
    set hierarchyID(hierarchyID) {
        this._hierarchyID = hierarchyID;
    }
    get hierarchyForcedComplete() { return this._hierarchyForcedComplete; }
    set hierarchyForcedComplete(complete) {
        this._hierarchyForcedComplete = complete;
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
        if (this.type === TypesEnum.FACET) {
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
        if (labelXpos === 0) {
            this._labelXcentered = true;
        }
    }
    setLabelXposFromXML(labelXpos) {
        if (labelXpos === this.position.x) {
            this.labelXpos = 0;
        }
        else {
            this.labelXpos = labelXpos - this.position.x;
        }
    }
    get labelHeight() { return this._labelHeight; }
    set labelHeight(value) {
        this._labelHeight = value;
    }
    get labelYpos() { return this._labelYpos; }
    set labelYpos(labelYpos) {
        this._labelYpos = labelYpos;
        if (labelYpos === 0) {
            this._labelYcentered = true;
        }
    }
    setLabelYposFromXML(labelYpos) {
        if (labelYpos === this.position.y) {
            this.labelYpos = 0;
        }
        else {
            this.labelYpos = labelYpos - this.y;
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
        if (this.renderedPosition) {
            thisCytoscapeRepr[0].renderedPosition = this.renderedPosition;
        }
        else {
            thisCytoscapeRepr[0].position = this.position;
        }
        Object.assign(thisCytoscapeRepr[0].data, {
            shape: this.shape || undefined,
            height: this.height || undefined,
            width: this.width || undefined,
            fillColor: this.fillColor || undefined,
            computedFillColor: grapholEntity === null || grapholEntity === void 0 ? void 0 : grapholEntity.color,
            shapePoints: this.shapePoints || undefined,
            labelXpos: this.labelXpos || this.labelXpos == 0 ? this.labelXpos : undefined,
            labelYpos: this.labelYpos || this.labelYpos == 0 ? this.labelYpos : undefined,
            labelXcentered: this.isLabelXcentered,
            labelYcentered: this.isLabelYcentered,
            identity: this.identity,
            hierarchyID: this.hierarchyID,
            hierarchyForcedComplete: this.hierarchyForcedComplete,
            icon: this.icon,
            lat: this.geoPosition ? this.geoPosition.x : undefined,
            lng: this.geoPosition ? this.geoPosition.y : undefined,
        });
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
    json() {
        const result = super.json();
        result.position = this.position;
        if (this.labelXpos !== undefined && this.labelYpos !== undefined) {
            result.labelPosition = {
                x: this.labelXpos,
                y: this.labelYpos,
            };
        }
        return result;
    }
}
function isGrapholNode(elem) {
    return elem.isLabelXcentered !== undefined;
}

class DiagramRepresentation {
    constructor(cyConfig = cytoscapeDefaultConfig) {
        this._grapholElements = new Map();
        this._hasEverBeenRendered = false;
        this.cy = cytoscape(cyConfig);
        if (this.cy.autopanOnDrag)
            this.cy.autopanOnDrag().enable();
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
        return this.cy.add(cyElems);
    }
    removeElement(elementId) {
        this.grapholElements.delete(elementId);
        this.cy.$id(elementId).remove();
    }
    clear() {
        this.cy.elements().remove();
        this.grapholElements.clear();
    }
    updateElement(elementIdOrObj, grapholEntity, updatePosition = true) {
        var _a;
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
        if (cyElement.empty()) {
            return;
        }
        if (updatePosition && isGrapholNode(grapholElement) && grapholElement.position !== cyElement.position()) {
            cyElement.position(grapholElement.position);
        }
        if (isGrapholEdge(grapholElement)) {
            cyElement.move({
                source: grapholElement.sourceId,
                target: grapholElement.targetId
            });
        }
        const iri = cyElement.data().iri;
        const computedFillColor = cyElement.data().computedFillColor;
        const grapholElemCyReprData = (_a = grapholElement.getCytoscapeRepr(grapholEntity).find(repr => !repr.data.fake)) === null || _a === void 0 ? void 0 : _a.data;
        if (grapholElemCyReprData)
            cyElement.data(grapholElemCyReprData);
        // iri should be always preserved
        cyElement.data().iri = iri;
        if (computedFillColor && !cyElement.data().computedFillColor) {
            // restore color if it has been lost
            cyElement.data('computedFillColor', computedFillColor);
            // (cyElement as any).updateStyle()
        }
    }
    containsEntity(iriOrGrapholEntity) {
        let iri;
        if (iriOrGrapholEntity.iri !== undefined) {
            iri = iriOrGrapholEntity.iri.fullIri;
        }
        else if (iriOrGrapholEntity.fullIri !== undefined) {
            iri = iriOrGrapholEntity.fullIri;
        }
        else {
            iri = iriOrGrapholEntity;
        }
        for (let [_, grapholElement] of this.grapholElements) {
            if (grapholElement.iri && iri === grapholElement.iri) {
                return true;
            }
        }
        return false;
    }
    filter(elementId, filterTag) {
        const element = this.cy.$id(elementId);
        if (element.hasClass('filtered'))
            return;
        const classesToAdd = ['filtered', filterTag];
        element.addClass(classesToAdd.join(' '));
        // Filter fake nodes!
        this.cy.nodes(`[parent_node_id = "${element.id()}"]`).addClass(classesToAdd.join(' '));
        // ARCHI IN USCITA
        //var selector = `[source = "${element.data('id')}"]`
        element.outgoers('edge').forEach(e => {
            let neighbour = e.target();
            // if inclusion[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
            let number_edges_in_out = getNumberEdgesInOut(neighbour);
            if (!e.target().hasClass(classesToAdd[0]) && (number_edges_in_out <= 0 || e.data('type') === TypesEnum.INPUT)) {
                this.filter(e.target().id(), filterTag);
            }
        });
        // ARCHI IN ENTRATA
        element.incomers('edge').forEach(e => {
            let neighbour = e.source();
            // if Isa[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
            let number_edges_in_out = getNumberEdgesInOut(neighbour);
            if (!e.source().hasClass(classesToAdd[0]) && number_edges_in_out === 0) {
                this.filter(e.source().id(), filterTag);
            }
        });
        function getNumberEdgesInOut(neighbour) {
            let count = neighbour.outgoers('edge').size() + neighbour.incomers(`edge[type != "${TypesEnum.INPUT}"]`).size();
            neighbour.outgoers('node').forEach(node => {
                if (node.hasClass(classesToAdd[0])) {
                    count--;
                }
            });
            neighbour.incomers(`edge[type != "${TypesEnum.INPUT}"]`).forEach(e => {
                if (e.source().hasClass(classesToAdd[0])) {
                    count--;
                }
            });
            return count;
        }
    }
    unfilter(elementId, filterTag) {
        const classToRemove = ['filtered', filterTag];
        const element = this.cy.$id(elementId);
        if (element.hasClass('filtered') && element.hasClass(filterTag)) {
            this.cy.$id(elementId).removeClass(classToRemove.join(' '));
            this.cy.$(`.${filterTag}`).removeClass(classToRemove.join(' '));
        }
    }
    getNewId(nodeOrEdge) {
        let newId = nodeOrEdge === 'node' ? 'n' : 'e';
        let count = this.cy.elements().length + 1;
        while (!this.cy.$id(newId + count).empty()) {
            count = count + 1;
        }
        return newId + count;
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
    get nodesCounter() { return this.cy.nodes().length; }
    get edgesCounter() { return this.cy.edges().length; }
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
    /**
     * Delete every element from a diagram
     * @param rendererState optional, if you pass a particular rendererState, only its representation will be cleared.
     * If you don't pass any rendererState, all representations will be cleared
     */
    clear(rendererState) {
        var _a;
        rendererState
            ? (_a = this.representations.get(rendererState)) === null || _a === void 0 ? void 0 : _a.clear()
            : this.representations.forEach(r => r.clear());
    }
    removeElement(elementId, rendererState) {
        var _a;
        (_a = this.representations.get(rendererState)) === null || _a === void 0 ? void 0 : _a.removeElement(elementId);
    }
    containsEntity(iriOrGrapholEntity, rendererState) {
        var _a;
        return (_a = this.representations.get(rendererState)) === null || _a === void 0 ? void 0 : _a.containsEntity(iriOrGrapholEntity);
    }
}

class AnnotationsDiagram extends Diagram {
    constructor() {
        super('Annotations', -1);
        this.representation = new DiagramRepresentation(floatyOptions);
        this.representations.set(RendererStatesEnum.FLOATY, this.representation);
    }
    addIRIValueAnnotation(sourceEntity, annotationPropertyEntity, targetIri, entityNameType, language, targetEntity) {
        let node;
        let sourceEntityNode = this.representation.cy.$(`[iri = "${sourceEntity.iri.fullIri}"]`).first();
        if (sourceEntityNode.empty()) {
            node = new GrapholNode(this.representation.getNewId('node'), TypesEnum.INDIVIDUAL);
            node.diagramId = this.id;
            node.displayedName = sourceEntity.getDisplayedName(entityNameType, language);
            sourceEntityNode = this.representation.addElement(node, sourceEntity);
            sourceEntity.addOccurrence(node, RendererStatesEnum.FLOATY);
        }
        // take range iri node
        let targetNode = this.representation.cy.$(`[iri = "${targetIri.toString()}"]`).nodes().first();
        if (targetNode.empty()) {
            node = new GrapholNode(this.representation.getNewId('node'), TypesEnum.IRI);
            const tempEntity = new GrapholEntity(targetIri);
            node = new GrapholNode(this.representation.getNewId('node'), TypesEnum.IRI);
            node.iri = targetIri.toString();
            node.diagramId = this.id;
            node.displayedName = tempEntity.getDisplayedName(entityNameType, language);
            targetNode = this.representation.addElement(node);
            targetEntity === null || targetEntity === void 0 ? void 0 : targetEntity.addOccurrence(node, RendererStatesEnum.FLOATY);
        }
        const annotationPropertyEdge = new GrapholEdge(this.representation.getNewId('edge'), TypesEnum.ANNOTATION_PROPERTY);
        annotationPropertyEdge.diagramId = this.id;
        annotationPropertyEdge.sourceId = sourceEntityNode.id();
        annotationPropertyEdge.targetId = targetNode.id();
        annotationPropertyEdge.displayedName = annotationPropertyEntity === null || annotationPropertyEntity === void 0 ? void 0 : annotationPropertyEntity.getDisplayedName(entityNameType, language);
        this.representation.addElement(annotationPropertyEdge, annotationPropertyEntity);
        annotationPropertyEntity.addOccurrence(annotationPropertyEdge, RendererStatesEnum.FLOATY);
    }
    isEmpty() {
        return this.representation.cy.elements().empty();
    }
}

/**
 * ### Ontology
 * Class used as the Model of the whole app.
 */
class Ontology extends AnnotatedElement {
    constructor(name, version, iri, namespaces = [], annProperties = [], diagrams = []) {
        super();
        this.namespaces = [];
        this.annProperties = [];
        this.diagrams = [];
        this.languages = [];
        this.usedColorScales = [];
        this._entities = new Map();
        // computed only in floaty
        this._hierarchies = new Map();
        this._subHierarchiesMap = new Map();
        this._superHierarchiesMap = new Map();
        this._inclusions = [];
        this.name = name;
        this.version = version;
        this.namespaces = namespaces;
        this.annProperties = annProperties;
        this.diagrams = diagrams;
        this.iri = iri;
        if (this.iri) {
            this.ontologyEntity = new GrapholEntity(new Iri(this.iri, this.namespaces));
        }
    }
    addHierarchy(hierarchy) {
        this._hierarchies.set(hierarchy.id, hierarchy);
        let hierarchiesSet;
        hierarchy.inputs.forEach(inputClass => {
            hierarchiesSet = this._superHierarchiesMap.get(inputClass.fullIri);
            if (!hierarchiesSet) {
                this._superHierarchiesMap.set(inputClass.fullIri, new Set([hierarchy]));
            }
            else {
                hierarchiesSet.add(hierarchy);
            }
        });
        hierarchy.superclasses.map(sc => sc.classEntity).forEach(superClass => {
            hierarchiesSet = this._subHierarchiesMap.get(superClass.fullIri);
            if (!hierarchiesSet) {
                this._subHierarchiesMap.set(superClass.fullIri, new Set([hierarchy]));
            }
            else {
                hierarchiesSet.add(hierarchy);
            }
        });
    }
    removeHierarchy(hierarchyOrId) {
        let hierarchy;
        if (typeof hierarchyOrId === 'string') {
            hierarchy = this.getHierarchy(hierarchyOrId);
        }
        if (hierarchy) {
            this._hierarchies.delete(hierarchy.id);
            this._subHierarchiesMap.forEach(sh => {
                sh.delete(hierarchy);
            });
            this._superHierarchiesMap.forEach(sh => {
                sh.delete(hierarchy);
            });
        }
    }
    getHierarchy(hierarchyId) {
        return this._hierarchies.get(hierarchyId);
    }
    getHierarchiesOf(classIri) {
        return Array.from(new Set(Array.from(this.getSubHierarchiesOf(classIri)).concat(Array.from(this.getSuperHierarchiesOf(classIri)))));
    }
    /**
     * @param superClassIri the superclass iri
     * @returns The arrary of hiearchies for which a class appear as superclass
     */
    getSubHierarchiesOf(superClassIri) {
        if (typeof superClassIri !== 'string')
            superClassIri = superClassIri.fullIri;
        return Array.from(this._subHierarchiesMap.get(superClassIri) || []);
    }
    /**
     *
     * @param subClassIri
     * @returns The arrary of hiearchies for which a class appear as subclass
     */
    getSuperHierarchiesOf(subClassIri) {
        if (typeof subClassIri !== 'string')
            subClassIri = subClassIri.fullIri;
        return Array.from(this._superHierarchiesMap.get(subClassIri) || []);
    }
    getSubclassesOf(superClassIri) {
        const res = new Set();
        this.getSubHierarchiesOf(superClassIri).forEach(hierarchy => {
            hierarchy.inputs.forEach(classInput => res.add(classInput));
        });
        this._inclusions.forEach(s => {
            if (s.superclass.iri.equals(superClassIri)) {
                res.add(s.subclass);
            }
        });
        return res;
    }
    getSuperclassesOf(superClassIri) {
        const res = new Set();
        this.getSuperHierarchiesOf(superClassIri).forEach(hierarchy => {
            hierarchy.superclasses.forEach(sc => res.add(sc.classEntity));
        });
        this._inclusions.forEach(s => {
            if (s.subclass.iri.equals(superClassIri)) {
                res.add(s.superclass);
            }
        });
        return res;
    }
    addSubclassOf(subclass, superclass) {
        let subclassEntity;
        let superclassEntity;
        if (!subclass.types) {
            subclassEntity = this.getEntity(subclass);
        }
        else {
            subclassEntity = subclass;
        }
        if (!superclass.types) {
            superclassEntity = this.getEntity(superclass);
        }
        else {
            superclassEntity = subclass;
        }
        if (superclassEntity && subclassEntity) {
            if (!this._inclusions.find(sc => sc.subclass.iri.equals(subclassEntity.iri) && sc.superclass.iri.equals(superclassEntity.iri))) {
                this._inclusions.push({ subclass: subclassEntity, superclass: superclassEntity });
            }
        }
    }
    removeSubclassOf(subclass, superclass) {
        let subclassEntity;
        let superclassEntity;
        if (!subclass.types) {
            subclassEntity = this.getEntity(subclass);
        }
        else {
            subclassEntity = subclass;
        }
        if (!superclass.types) {
            superclassEntity = this.getEntity(superclass);
        }
        else {
            superclassEntity = subclass;
        }
        this._inclusions.splice(this._inclusions.findIndex(sc => sc.subclass === subclassEntity && sc.superclass === superclassEntity), 1);
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
    getNamespaces() {
        return this.namespaces;
    }
    /** @param {AnnotationProperty} annProperty */
    addAnnotationProperty(annProperty) {
        this.annProperties.push(annProperty);
    }
    /**
     * Get the Namspace object given its IRI string
     * @param {string} iriValue the IRI assigned to the namespace
     * @returns {AnnotationProperty}
     */
    getAnnotationProperty(iriValue) {
        return this.annProperties.find(prop => prop.fullIri === iriValue);
    }
    getAnnotationProperties() {
        return this.annProperties;
    }
    /** @param {Diagram} diagram */
    addDiagram(diagram) {
        this.diagrams[diagram.id] = diagram;
    }
    /**
     * Get the diagram with the given id
     */
    getDiagram(diagramId) {
        return this.diagrams[diagramId];
    }
    getDiagramByName(name) {
        return this.diagrams.find(d => d.name.toLowerCase() === (name === null || name === void 0 ? void 0 : name.toLowerCase()));
    }
    addEntity(entity) {
        this.entities.set(entity.iri.fullIri, entity);
    }
    getEntity(iri) {
        return this.entities.get(iri.toString());
    }
    getEntitiesByType(entityType) {
        return Array.from(this.entities).filter(([_, entity]) => entity.is(entityType)).map(([_, entity]) => entity);
    }
    getEntityFromOccurrence(entityOccurrence) {
        const diagram = this.getDiagram(entityOccurrence.diagramId);
        if (!diagram)
            return;
        if (entityOccurrence.iri) {
            const entity = this.getEntity(entityOccurrence.iri);
            if (entity)
                return entity;
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
            if (dataPropertyEntity.is(TypesEnum.DATA_PROPERTY)) {
                occurrences = dataPropertyEntity.occurrences.get(RendererStatesEnum.GRAPHOL);
                if (!occurrences)
                    return;
                // retrieve datatype for dataproperties
                occurrences.forEach(occurrence => {
                    var _a;
                    representation = (_a = this.getDiagram(occurrence.diagramId)) === null || _a === void 0 ? void 0 : _a.representations.get(RendererStatesEnum.GRAPHOL);
                    cyElement = representation === null || representation === void 0 ? void 0 : representation.cy.$id(occurrence.id);
                    if (cyElement && cyElement.nonempty()) {
                        datatypeNode = cyElement
                            .neighborhood(`node[type = "${TypesEnum.RANGE_RESTRICTION}"]`)
                            .neighborhood(`node[type = "${TypesEnum.VALUE_DOMAIN}"]`);
                        if (datatypeNode.nonempty()) {
                            datatype = datatypeNode.first().data('displayedName');
                            dataPropertyEntity.datatype = datatype;
                            representation === null || representation === void 0 ? void 0 : representation.updateElement(occurrence.id, dataPropertyEntity);
                        }
                    }
                });
            }
        });
    }
    /** @override */
    addAnnotation(newAnnotation) {
        super.addAnnotation(newAnnotation);
        if (!this.iri) {
            console.warn('ontology has no defined IRI. Unable to add annotation to ontology entity node.');
            return;
        }
        if (!this.annotationsDiagram) {
            this.diagrams[-1] = new AnnotationsDiagram();
        }
        if (!this.ontologyEntity) {
            this.ontologyEntity = new GrapholEntity(new Iri(this.iri, this.namespaces));
        }
        const annotationPropertyEntity = this.getEntity(newAnnotation.propertyIri);
        if (annotationPropertyEntity && newAnnotation.rangeIri) {
            this.annotationsDiagram.addIRIValueAnnotation(this.ontologyEntity, annotationPropertyEntity, newAnnotation.rangeIri, RDFGraphConfigEntityNameTypeEnum.LABEL, Language.EN, this.getEntity(newAnnotation.rangeIri));
        }
    }
    get isEntitiesEmpty() { return (!this._entities || Object.keys(this._entities).length === 0); }
    get entities() { return this._entities; }
    set entities(newEntities) {
        this._entities = newEntities;
    }
    get annotationsDiagram() {
        return this.diagrams[-1];
    }
}

class IncrementalDiagram extends Diagram {
    constructor() {
        super('Incremental', IncrementalDiagram.ID);
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
    isHierarchyVisible(hierarchy) {
        var _a, _b;
        const unionNode = (_b = (_a = this.representation) === null || _a === void 0 ? void 0 : _a.cy) === null || _b === void 0 ? void 0 : _b.$(`[hierarchyID = "${hierarchy.id}"]`);
        if (unionNode === null || unionNode === void 0 ? void 0 : unionNode.nonempty()) {
            const inputs = unionNode.connectedEdges(`[type = "${TypesEnum.INPUT}"]`);
            const inclusions = unionNode.connectedEdges('[ type $= "union" ]');
            return inputs.size() === hierarchy.inputs.length && inclusions.size() === hierarchy.superclasses.length;
        }
        return false;
    }
    get representation() {
        return this.representations.get(RendererStatesEnum.INCREMENTAL);
    }
}
IncrementalDiagram.ID = -1;

class Annotation {
    constructor(property, range, language, datatype) {
        this._property = property;
        this._range = range;
        this.language = language;
        this.datatype = datatype;
    }
    equals(annotation) {
        return this.datatype === annotation.datatype &&
            this.value === annotation.value &&
            this.language === annotation.language &&
            this._property.equals(annotation.property);
    }
    get hasIriValue() {
        return this.rangeIri !== undefined;
    }
    get property() {
        return this._property.fullIri;
    }
    get propertyIri() {
        return this._property;
    }
    get kind() {
        return this._property.remainder;
    }
    get value() {
        return this._range.toString();
    }
    /**
     * If the range is a Iri, return such a Iri, undefined otherwise
    */
    get rangeIri() {
        return this._range.fullIri ? this._range : undefined;
    }
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
    [TypesEnum.CLASS]: {
        TYPE: TypesEnum.CLASS,
        SHAPE: Shape.RECTANGLE,
        IDENTITY: TypesEnum.CLASS
    },
    [TypesEnum.DOMAIN_RESTRICTION]: {
        TYPE: TypesEnum.DOMAIN_RESTRICTION,
        SHAPE: Shape.RECTANGLE,
        IDENTITY: TypesEnum.CLASS,
    },
    [TypesEnum.RANGE_RESTRICTION]: {
        TYPE: TypesEnum.RANGE_RESTRICTION,
        SHAPE: Shape.RECTANGLE,
        IDENTITY: TypesEnum.NEUTRAL
    },
    [TypesEnum.OBJECT_PROPERTY]: {
        TYPE: TypesEnum.OBJECT_PROPERTY,
        SHAPE: Shape.DIAMOND,
        IDENTITY: TypesEnum.OBJECT_PROPERTY
    },
    [TypesEnum.DATA_PROPERTY]: {
        TYPE: TypesEnum.DATA_PROPERTY,
        SHAPE: Shape.ELLIPSE,
        IDENTITY: TypesEnum.DATA_PROPERTY
    },
    [TypesEnum.UNION]: {
        TYPE: TypesEnum.UNION,
        SHAPE: Shape.HEXAGON,
        IDENTITY: TypesEnum.NEUTRAL,
        LABEL: 'or',
    },
    [TypesEnum.DISJOINT_UNION]: {
        TYPE: TypesEnum.DISJOINT_UNION,
        SHAPE: Shape.HEXAGON,
        IDENTITY: TypesEnum.NEUTRAL
    },
    [TypesEnum.COMPLEMENT]: {
        TYPE: TypesEnum.COMPLEMENT,
        SHAPE: Shape.HEXAGON,
        IDENTITY: TypesEnum.NEUTRAL,
        LABEL: 'not',
    },
    [TypesEnum.INTERSECTION]: {
        TYPE: TypesEnum.INTERSECTION,
        SHAPE: Shape.HEXAGON,
        IDENTITY: TypesEnum.NEUTRAL,
        LABEL: 'and',
    },
    [TypesEnum.ENUMERATION]: {
        TYPE: TypesEnum.ENUMERATION,
        SHAPE: Shape.HEXAGON,
        IDENTITY: TypesEnum.NEUTRAL,
        LABEL: 'oneOf',
    },
    [TypesEnum.HAS_KEY]: {
        TYPE: TypesEnum.HAS_KEY,
        SHAPE: Shape.HEXAGON,
        IDENTITY: TypesEnum.NEUTRAL,
        LABEL: 'key'
    },
    [TypesEnum.ROLE_INVERSE]: {
        TYPE: TypesEnum.ROLE_INVERSE,
        SHAPE: Shape.HEXAGON,
        IDENTITY: TypesEnum.OBJECT_PROPERTY,
        LABEL: 'inv',
    },
    [TypesEnum.ROLE_CHAIN]: {
        TYPE: TypesEnum.ROLE_CHAIN,
        SHAPE: Shape.HEXAGON,
        IDENTITY: TypesEnum.OBJECT_PROPERTY,
        LABEL: 'chain',
    },
    [TypesEnum.DATATYPE_RESTRICTION]: {
        TYPE: TypesEnum.DATATYPE_RESTRICTION,
        SHAPE: Shape.HEXAGON,
        IDENTITY: TypesEnum.VALUE_DOMAIN,
        LABEL: 'data',
    },
    [TypesEnum.VALUE_DOMAIN]: {
        TYPE: TypesEnum.VALUE_DOMAIN,
        SHAPE: Shape.ROUND_RECTANGLE,
        IDENTITY: TypesEnum.VALUE_DOMAIN
    },
    [TypesEnum.PROPERTY_ASSERTION]: {
        TYPE: TypesEnum.PROPERTY_ASSERTION,
        SHAPE: Shape.RECTANGLE,
        IDENTITY: TypesEnum.NEUTRAL
    },
    [TypesEnum.LITERAL]: {
        TYPE: TypesEnum.LITERAL,
        SHAPE: Shape.OCTAGON,
        IDENTITY: TypesEnum.VALUE
    },
    [TypesEnum.INDIVIDUAL]: {
        TYPE: TypesEnum.INDIVIDUAL,
        SHAPE: Shape.OCTAGON,
        IDENTITY: TypesEnum.INDIVIDUAL
    },
    [TypesEnum.FACET]: {
        TYPE: TypesEnum.FACET,
        SHAPE: Shape.POLYGON,
        SHAPE_POINTS: POLYGON_POINTS,
        IDENTITY: TypesEnum.FACET
    },
};

class GrapholscapeTheme {
    constructor(id, colours, name) {
        this.colours = {};
        this.useComputedColours = false;
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
    /** Color used for annotation properties' edges */
    ColoursNames["annotation_property"] = "annotation-property";
    /** Color used for annotation properties' edges contrast */
    ColoursNames["annotation_property_contrast"] = "annotation-property-contrast";
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
})(ColoursNames || (ColoursNames = {}));

var DefaultThemesEnum;
(function (DefaultThemesEnum) {
    DefaultThemesEnum["GRAPHOLSCAPE"] = "grapholscape";
    DefaultThemesEnum["GRAPHOL"] = "graphol";
    DefaultThemesEnum["DARK"] = "dark";
    DefaultThemesEnum["COLORFUL_LIGHT"] = "colorful-light";
    DefaultThemesEnum["COLORFUL_DARK"] = "colorful-dark";
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
    [ColoursNames.annotation_property]: '#EDCF9A',
    [ColoursNames.annotation_property_contrast]: '#DC8D00',
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
    [ColoursNames.annotation_property]: '#fcfcfc',
    [ColoursNames.annotation_property_contrast]: '#000',
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
    [ColoursNames.annotation_property]: '#BDA57B',
    [ColoursNames.annotation_property_contrast]: '#B07000',
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
const dataPropertyFilter = () => {
    return new Filter(RDFGraphConfigFiltersEnum.DATA_PROPERTY, (element) => element.is(TypesEnum.DATA_PROPERTY));
};
const valueDomainFilter = () => {
    return new Filter(RDFGraphConfigFiltersEnum.VALUE_DOMAIN, (element) => element.is(TypesEnum.VALUE_DOMAIN));
};
const individualsFilter = () => {
    return new Filter(RDFGraphConfigFiltersEnum.INDIVIDUAL, (element) => element.is(TypesEnum.INDIVIDUAL));
};
const universalQuantifierFilter = () => new Filter(RDFGraphConfigFiltersEnum.UNIVERSAL_QUANTIFIER, (element) => {
    return (element.is(TypesEnum.DOMAIN_RESTRICTION) || element.is(TypesEnum.RANGE_RESTRICTION)) &&
        element.displayedName === 'forall';
});
const complementFilter = () => new Filter(RDFGraphConfigFiltersEnum.COMPLEMENT, (element) => element.is(TypesEnum.COMPLEMENT));
const hasKeyFilter = () => new Filter(RDFGraphConfigFiltersEnum.HAS_KEY, (element) => element.is(TypesEnum.HAS_KEY));
const annotationPropertyFilter = () => new Filter(RDFGraphConfigFiltersEnum.ANNOTATION_PROPERTY, (element) => element.is(TypesEnum.ANNOTATION_PROPERTY));
const getDefaultFilters = () => {
    return {
        DATA_PROPERTY: dataPropertyFilter(),
        VALUE_DOMAIN: valueDomainFilter(),
        INDIVIDUAL: individualsFilter(),
        ANNOTATION_PROPERTY: annotationPropertyFilter(),
        UNIVERSAL_QUANTIFIER: universalQuantifierFilter(),
        COMPLEMENT: complementFilter(),
        HAS_KEY: hasKeyFilter(),
    };
};

/** @internal */
class ClassInstanceEntity extends GrapholEntity {
    constructor(iri, parentClassIris = []) {
        super(iri);
        this._parentClassIris = [];
        this._dataProperties = new Map();
        this._manualTypes = new Set([TypesEnum.INDIVIDUAL]);
        this._parentClassIris = parentClassIris;
    }
    /**
     * Set the instance to be instance of a particular Class.
     * If it is already instance of such a class, no changes will be made.
     * @param parentClassIri the IRI of the Class
     */
    addParentClass(parentClassIri) {
        var _a;
        if (!this.hasParentClassIri(parentClassIri)) {
            (_a = this._parentClassIris) === null || _a === void 0 ? void 0 : _a.push(parentClassIri);
        }
    }
    /**
     * Check if the instance is instance of a class with such an IRI
     * @param parentClassIri
     * @returns
     */
    hasParentClassIri(parentClassIri) {
        return this._parentClassIris.find(iri => iri.equals(parentClassIri)) !== undefined;
    }
    get isRDFTypeUnknown() { return this._parentClassIris.length === 0; }
    get parentClassIris() { return Array.from(this._parentClassIris); }
    getDataPropertiesValues() {
        return this._dataProperties;
    }
    getDataPropertyValues(dataPropertyIri) {
        return this._dataProperties.get(dataPropertyIri);
    }
    addDataProperty(iri, values) {
        this._dataProperties.set(iri, values);
    }
    set dataProperties(newProperties) {
        newProperties.forEach(dpValue => {
            const existentDpValues = this._dataProperties.get(dpValue.iri);
            const newValues = new Promise(resolve => {
                if (existentDpValues)
                    existentDpValues.then(values => resolve([...values, dpValue]));
                else
                    resolve([dpValue]);
            });
            this._dataProperties.set(dpValue.iri, newValues);
        });
    }
    /**
     * Do not use this to get data properties values,
     * use getDataPropertiesValues or getDataPropertyValues and await for promises.
     */
    get dataProperties() { return []; }
    json() {
        const result = super.json();
        result.parentClasses = this.parentClassIris.map(iri => iri.fullIri);
        return result;
    }
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

class BaseRenderer {
    constructor(renderer) {
        this.layoutRunning = false;
        if (renderer)
            this.renderer = renderer;
    }
    centerOnElementById(elementId, zoom, select) {
        const cy = this.renderer.cy;
        if (!cy || (!zoom && zoom !== 0))
            return;
        const cyElement = cy.$id(elementId);
        zoom = zoom > cy.maxZoom() ? cy.maxZoom() : zoom;
        if (cyElement.empty()) {
            console.warn(`Element id (${elementId}) not found. Please check that this is the correct diagram`);
        }
        else {
            cy.animate({
                center: {
                    eles: cyElement
                },
                zoom: zoom,
                queue: false,
            });
            if (select && cy.$(':selected') !== cyElement) {
                this.renderer.unselect();
                cyElement.select();
            }
        }
    }
    set renderer(newRenderer) {
        this._renderer = newRenderer;
        this.filterManager.filters = newRenderer.filters;
    }
    get renderer() {
        return this._renderer;
    }
    filter(elementId, filter) {
        var _a;
        if (this.renderer.diagram)
            (_a = this.renderer.diagram.representations.get(this.id)) === null || _a === void 0 ? void 0 : _a.filter(elementId, filter.filterTag);
    }
    unfilter(elementId, filter) {
        var _a;
        if (this.renderer.diagram)
            (_a = this.renderer.diagram.representations.get(this.id)) === null || _a === void 0 ? void 0 : _a.unfilter(elementId, filter.filterTag);
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
    LifecycleEvent["ContextClick"] = "contextClick";
    LifecycleEvent["DoubleTap"] = "doubleTap";
    LifecycleEvent["EntityWikiLinkClick"] = "entityWikiLinkClick";
    LifecycleEvent["MouseOver"] = "mouseOver";
    LifecycleEvent["MouseOut"] = "mouseOut";
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
        this.contextClick = [];
        this.doubleTap = [];
        this.mouseOver = [];
        this.mouseOut = [];
        this.entityWikiLinkClick = [];
        this.trigger = (event, ...params) => {
            if (event === LifecycleEvent.FilterRequest || event === LifecycleEvent.UnfilterRequest) {
                return this[event](params[0]);
            }
            this[event].forEach((callback) => callback(...params));
        };
        this.on = (event, callback) => {
            if (event === LifecycleEvent.FilterRequest || event === LifecycleEvent.UnfilterRequest) {
                this[event] = callback;
                return;
            }
            this[event].push(callback);
        };
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
    /**
     *
     * @param id
     * @param type
     * @param forcedComplete if the hierarchy is forced to be complete, any superclass edge
     * will have type COMPLETE_UNION / COMPLETE_DISJOINT_UNION, regardless if they are created
     * as complete or not.
     */
    constructor(id, type, forcedComplete = false) {
        this.type = type;
        this.forcedComplete = forcedComplete;
        this._inputs = [];
        this._superclasses = [];
        this.id = id;
    }
    addInput(classEntity) {
        this.inputs.push(classEntity);
    }
    removeInput(classEntity) {
        const index = this.inputs.findIndex(i => i === classEntity);
        this.inputs.splice(index, 1);
    }
    addSuperclass(classEntity, complete = this.forcedComplete) {
        this._superclasses.push({ classEntity: classEntity, complete: complete });
    }
    removeSuperclass(classEntity) {
        const index = this.superclasses.findIndex(i => i.classEntity === classEntity);
        this.superclasses.splice(index, 1);
    }
    get inputs() { return this._inputs; }
    get superclasses() { return this._superclasses; }
    set id(newId) { this._id = newId; }
    get id() { return this._id; }
    getUnionGrapholNode(nodeId, position) {
        if (!this.isValid()) {
            console.warn('[Grapholscape] Hierarchy not valid, cannot create the union graphol node - check id, inputs and superclasses');
            return;
        }
        const unionNode = new GrapholNode(nodeId, TypesEnum.CLASS);
        unionNode.type = this.type;
        unionNode.identity = TypesEnum.CLASS;
        unionNode.shape = Shape.ELLIPSE;
        unionNode.hierarchyID = this._id;
        unionNode.hierarchyForcedComplete = this.forcedComplete;
        unionNode.displayedName = !this.isDisjoint() ? 'or' : undefined;
        unionNode.height = unionNode.width = 30;
        unionNode.position = position || { x: 0, y: 0 };
        unionNode.setLabelXposFromXML((position === null || position === void 0 ? void 0 : position.x) || 0);
        unionNode.setLabelYposFromXML((position === null || position === void 0 ? void 0 : position.y) || 0);
        return unionNode;
    }
    getInputGrapholEdges(diagramId, rendererState) {
        if (!this.isValid()) {
            console.warn('[Grapholscape] Hierarchy not valid, cannot create input edges - check id, inputs and superclasses');
            return;
        }
        const res = [];
        let sourceId;
        this.inputs.forEach((inputEntity, i) => {
            const newInputEdge = new GrapholEdge(`${this._id}-e-${i}`, TypesEnum.INPUT);
            sourceId = inputEntity.getIdInDiagram(diagramId, TypesEnum.CLASS, rendererState);
            if (!sourceId)
                return;
            newInputEdge.sourceId = sourceId;
            newInputEdge.targetId = this._id;
            res.push(newInputEdge);
        });
        return res;
    }
    getInclusionEdges(diagramId, rendererState) {
        if (!this.isValid()) {
            console.warn('[Grapholscape] Hierarchy not valid, cannot create inclusions edges - check id, inputs and superclasses');
            return;
        }
        const res = [];
        let targetId;
        this.type;
        this._superclasses.forEach((superclass, i) => {
            if (superclass.complete || this.forcedComplete) {
                if (this.isDisjoint()) {
                    TypesEnum.COMPLETE_DISJOINT_UNION;
                }
                else {
                    TypesEnum.COMPLETE_UNION;
                }
            }
            const newInclusionEdge = new GrapholEdge(`${this._id}-inclusion-${i}`, this.type);
            newInclusionEdge.sourceId = this._id;
            targetId = superclass.classEntity.getIdInDiagram(diagramId, TypesEnum.CLASS, rendererState);
            if (!targetId)
                return;
            newInclusionEdge.targetId = targetId;
            if (superclass.complete || this.forcedComplete) {
                newInclusionEdge.targetLabel = 'C';
            }
            res.push(newInclusionEdge);
        });
        return res;
    }
    isDisjoint() {
        return this.type === TypesEnum.DISJOINT_UNION;
    }
    isValid() {
        return this._id && this.inputs.length > 0 && this._superclasses.length > 0;
    }
}

class ColorManager {
    getColors(numberOfColors, usedScales = []) {
        if (numberOfColors <= 1) {
            return [chroma.random().hex()];
        }
        let scaleIndex = Math.floor(Math.random() * ColorManager.brewerSequentialPalettes.length);
        while (usedScales.includes(ColorManager.brewerSequentialPalettes[scaleIndex]) && usedScales.length === ColorManager.brewerSequentialPalettes.length) {
            scaleIndex = Math.floor(Math.random() * ColorManager.brewerSequentialPalettes.length);
        }
        usedScales.push(ColorManager.brewerSequentialPalettes[scaleIndex]);
        return chroma.scale(ColorManager.brewerSequentialPalettes[scaleIndex])
            .mode('lab')
            .padding(numberOfColors > 10 ? 1 / numberOfColors : 0.2)
            .correctLightness(true)
            .colors(numberOfColors);
    }
}
ColorManager.brewerSequentialPalettes = [
    "Blues",
    "BuGn",
    "BuPu",
    "GnBu",
    "Greens",
    // "Greys",
    "Oranges",
    "OrRd",
    "PuBu",
    "PuBuGn",
    "PuRd",
    "Purples",
    "RdPu",
    "Reds",
    "YlGn",
    // "YlGnBu",
    // "YlOrBr",
    "YlOrRd"
];
class OntologyColorManager extends ColorManager {
    constructor(ontology, diagramRepresentation) {
        super();
        this.ontology = ontology;
        this.diagramRepresentation = diagramRepresentation;
        this._classForest = new Set();
    }
    /** @internal */
    setInstanceColor(classInstance, parentClassIris, overwrite = false) {
        if (parentClassIris.length <= 0 || (classInstance.color && !overwrite))
            return this;
        let parentClassInDiagram;
        // get first parent class' color in current diagram 
        for (let parentClassIri of parentClassIris) {
            if (this.diagramRepresentation.containsEntity(parentClassIri)) {
                parentClassInDiagram = this.ontology.getEntity(parentClassIri.fullIri);
                if (parentClassInDiagram === null || parentClassInDiagram === void 0 ? void 0 : parentClassInDiagram.color) {
                    classInstance.color = parentClassInDiagram.color;
                    return this;
                }
            }
        }
        // if not returned then get first parent class color defined, anywhere
        for (let parentClassIri of parentClassIris) {
            const parentClassEntity = this.ontology.getEntity(parentClassIri.fullIri);
            if (parentClassEntity === null || parentClassEntity === void 0 ? void 0 : parentClassEntity.color) {
                classInstance.color = parentClassEntity.color;
                return this;
            }
        }
        // No parent classes with defined colors? => compute it
        // if a parent class is in current diagram then use it, otherwise just get first in list
        const parentClassEntity = parentClassInDiagram || this.ontology.getEntity(parentClassIris[0].fullIri);
        if (parentClassEntity) {
            this.setClassColor(parentClassEntity);
            classInstance.color = parentClassEntity.color;
        }
        return this;
    }
    setClassColor(classEntity, overwrite = false) {
        if (classEntity.color && !overwrite) {
            return this;
        }
        const topSuperClass = this.getTopSuperClass(classEntity);
        const childrenClasses = this.getAllChildren(topSuperClass);
        const colors = this.getColors(childrenClasses.size + 1, this.ontology.usedColorScales);
        let i = 0;
        for (let childClass of childrenClasses.values()) {
            childClass.color = colors[i];
            i++;
        }
        if (childrenClasses.size > 0) {
            topSuperClass.color = chroma(colors[colors.length - 1]).saturate().css();
        }
        else {
            topSuperClass.color = chroma(colors[0]).css();
        }
        this._classForest.clear();
        return this;
    }
    colorEntities(entities = this.ontology.entities, overwrite = false) {
        return new Promise((resolve, _) => {
            const updatedEntities = new Set();
            entities.forEach(entity => {
                var _a;
                if (entity.is(TypesEnum.INDIVIDUAL)) {
                    this.setInstanceColor(entity, entity.parentClassIris || [], overwrite);
                }
                else if (entity.is(TypesEnum.CLASS)) {
                    this.setClassColor(entity, overwrite);
                }
                if (!updatedEntities.has(entity.iri.fullIri)) {
                    (_a = entity.occurrences.get(RendererStatesEnum.INCREMENTAL)) === null || _a === void 0 ? void 0 : _a.forEach(elem => {
                        this.diagramRepresentation.updateElement(elem, entity);
                    });
                    updatedEntities.add(entity.iri.fullIri);
                }
            });
            resolve();
        });
    }
    getTopSuperClass(classEntity) {
        var _a;
        this._classForest.add(classEntity);
        const directSuperclass = Array.from(this.ontology.getSuperclassesOf(classEntity.iri))
            .filter(entity => !this._classForest.has(entity))[0];
        const hierarchies = this.ontology.getSuperHierarchiesOf(classEntity.iri);
        const hierarchySuperClass = (_a = hierarchies[0]) === null || _a === void 0 ? void 0 : _a.superclasses.filter(entity => !this._classForest.has(entity.classEntity))[0];
        if (hierarchySuperClass) {
            return this.getTopSuperClass(hierarchySuperClass.classEntity);
        }
        else if (directSuperclass) {
            return this.getTopSuperClass(directSuperclass);
        }
        else {
            return classEntity;
        }
    }
    getAllChildren(classEntity, result = new Set()) {
        // let result: Set<GrapholEntity> = new Set()
        for (let directChild of this.ontology.getSubclassesOf(classEntity.iri)) {
            if (!result.has(directChild)) {
                result.add(directChild);
                result = new Set([...result, ...this.getAllChildren(directChild, result)]);
            }
        }
        const hierarchies = this.ontology.getSubHierarchiesOf(classEntity.iri);
        if (hierarchies.length > 0) {
            hierarchies.forEach(h => {
                h.inputs.forEach(inputClass => {
                    if (!result.has(inputClass)) {
                        result.add(inputClass);
                        result = new Set([...result, ...this.getAllChildren(inputClass, result)]);
                    }
                });
            });
        }
        return result;
    }
}
class DiagramColorManager extends ColorManager {
    constructor(diagramRepresentation) {
        super();
        this.diagramRepresentation = diagramRepresentation;
        this._classForest = new Set();
    }
    colorDiagram(overwrite = false) {
        this.diagramRepresentation.cy.$(`node[type = "${TypesEnum.CLASS}"]`).forEach(classNode => {
            this.setClassColor(classNode, overwrite);
        });
        this._classForest.clear();
    }
    setClassColor(classNode, overwrite = false) {
        if (classNode.data().computedFillColor && !overwrite) {
            return;
        }
        if (classNode.isNode()) {
            const topSuperClass = this.getTopSuperClass(classNode);
            const childrenClasses = this.getAllChildren(topSuperClass);
            const colors = this.getColors(childrenClasses.size() + 1);
            childrenClasses.forEach((childClass, i) => {
                childClass.data('computedFillColor', colors[i]);
                // childClass.style().update()
            });
            if (childrenClasses.nonempty()) {
                topSuperClass.data('computedFillColor', chroma(colors[colors.length - 1]).saturate().css());
            }
            else {
                topSuperClass.data('computedFillColor', colors[0]);
            }
            // topSuperClass.style().update()
        }
        this._classForest.clear();
    }
    getTopSuperClass(classNode) {
        this._classForest.add(classNode);
        const directSuperclass = classNode
            .outgoers(`edge[type = "${TypesEnum.INCLUSION}"], edge[type = "${TypesEnum.EQUIVALENCE}"]`)
            .targets()
            .filter(n => !this._classForest.has(n))
            .nodes()
            .first();
        const hierarchies = classNode.outgoers(`edge[type = "${TypesEnum.INPUT}"]`).targets().first();
        const hierarchySuperClasses = hierarchies.outgoers(`node[type = "${TypesEnum.CLASS}"]`)
            .filter(n => !this._classForest.has(n))
            .nodes()
            .first();
        if (hierarchySuperClasses.nonempty()) {
            return this.getTopSuperClass(hierarchySuperClasses);
        }
        else if (directSuperclass.nonempty()) {
            return this.getTopSuperClass(directSuperclass);
        }
        else {
            return classNode;
        }
    }
    getAllChildren(classNode, result = this.diagramRepresentation.cy.collection()) {
        classNode.incomers(`edge[type = "${TypesEnum.INCLUSION}"]`).sources().forEach(elem => {
            if (!result.contains(elem)) {
                result = result.union(elem);
                result = result.union(this.getAllChildren(elem, result));
            }
        });
        const hiearchies = classNode.incomers(`node[type = "${TypesEnum.UNION}"], node[type = "${TypesEnum.DISJOINT_UNION}"]`);
        hiearchies.incomers(`edge[type = "${TypesEnum.INPUT}"]`).sources().forEach(elem => {
            if (!result.contains(elem)) {
                result = result.union(elem);
                result = result.union(this.getAllChildren(elem, result));
            }
        });
        return result;
    }
}

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

class BaseGrapholTransformer {
    get newCy() { return this.result.cy; }
    // filter nodes if the criterion function returns true
    // criterion must be a function returning a boolean value for a given a node
    filterByCriterion(criterion) {
        this.newCy.$('*').forEach(node => {
            if (criterion(node)) {
                this.result.filter(node.id(), '');
            }
        });
    }
    deleteFilteredElements() {
        this.deleteElements(this.newCy.elements('.filtered'));
    }
    isRestriction(grapholElement) {
        if (!grapholElement)
            return false;
        return grapholElement.is(TypesEnum.DOMAIN_RESTRICTION) ||
            grapholElement.is(TypesEnum.RANGE_RESTRICTION);
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
                return node.incomers(`edge[type = "${TypesEnum.INPUT}"]`).size() > 1 ? true : false;
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
                node.incomers(`edge[type = "${TypesEnum.INPUT}"]`).forEach(edge => {
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
        this.diagramId = diagram.id;
        this.result.grapholElements = new Map(grapholRepresentation.grapholElements);
        this.newCy.add(grapholRepresentation.cy.elements().clone());
        this.newCy.elements().removeClass('filtered'); // make all filtered elements not filtered anymore
        this.filterByCriterion((node) => {
            const grapholNode = this.getGrapholElement(node.id());
            if (!grapholNode)
                return false;
            switch (grapholNode.type) {
                case TypesEnum.COMPLEMENT:
                case TypesEnum.VALUE_DOMAIN:
                case TypesEnum.ROLE_CHAIN:
                case TypesEnum.ENUMERATION:
                case TypesEnum.HAS_KEY:
                    return true;
                case TypesEnum.DOMAIN_RESTRICTION:
                case TypesEnum.RANGE_RESTRICTION:
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
        this.newCy.nodes().filter(`[ type $= "union" ]`).forEach(elem => {
            // delete incoming inclusions on union nodes
            elem.incomers('edge').forEach(edge => {
                if (edge.data().type === TypesEnum.INCLUSION) {
                    this.deleteElement(edge);
                }
            });
        });
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
                return grapholEdge.is(TypesEnum.INPUT) &&
                    (grapholSource.is(TypesEnum.OBJECT_PROPERTY) || grapholSource.is(TypesEnum.DATA_PROPERTY));
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
            /**
             * Assign typed and/or mandatory. must be done before reversing the edge!
             */
            const mandatory = (edgeOnRestriction.is(TypesEnum.EQUIVALENCE) ||
                (edgeOnRestriction.is(TypesEnum.INCLUSION) && edgeOnRestriction.targetId === restrictionNode.id));
            const typed = (edgeOnRestriction.is(TypesEnum.EQUIVALENCE) ||
                (edgeOnRestriction.is(TypesEnum.INCLUSION) && edgeOnRestriction.targetId !== restrictionNode.id));
            if (restrictionNode.is(TypesEnum.RANGE_RESTRICTION)) {
                edgeOnRestriction.rangeMandatory = mandatory;
                edgeOnRestriction.rangeTyped = typed;
            }
            if (restrictionNode.is(TypesEnum.DOMAIN_RESTRICTION)) {
                edgeOnRestriction.domainMandatory = mandatory;
                edgeOnRestriction.domainTyped = typed;
            }
            if (edgeOnRestriction.targetId !== restrictionNode.id) {
                this.reverseEdge(edgeOnRestriction);
                edgeOnRestrictionSourceNode = this.getGrapholElement(edgeOnRestriction.sourceId);
            }
            edgeOnRestriction.targetId = propertyNode.id;
            // move attribute on restriction node position
            if (propertyNode.is(TypesEnum.DATA_PROPERTY)) {
                edgeOnRestriction.type = TypesEnum.ATTRIBUTE_EDGE;
                propertyNode.x = restrictionNode.position.x;
                propertyNode.y = restrictionNode.position.y;
                this.result.updateElement(propertyNode);
                //new_edge = edges[0]
            }
            if (propertyNode.is(TypesEnum.OBJECT_PROPERTY)) {
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
            restriction.connectedEdges().filter(edge => !this.getGrapholElement(edge.id()).is(TypesEnum.INPUT))
                .forEach((edgeToRestriction, i) => {
                const grapholEdgeToRestriction = this.getGrapholElement(edgeToRestriction.id());
                if (!isGrapholEdge(grapholEdgeToRestriction) || !isGrapholNode(grapholRestrictionNode))
                    return;
                transformIntoRoleEdge(grapholEdgeToRestriction, inputGrapholEdge, grapholRestrictionNode);
            });
            this.result.filter(restriction.id(), '');
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
                this.result.filter(node.id(), '');
            }
        });
        this.deleteFilteredElements();
    }
    isComplexHierarchy(node) {
        const grapholNode = this.getGrapholElement(node.id());
        if (!grapholNode || (!grapholNode.is(TypesEnum.UNION) &&
            !grapholNode.is(TypesEnum.DISJOINT_UNION) &&
            !grapholNode.is(TypesEnum.INTERSECTION)))
            return false;
        // Complex hierarchy if it has something different from a class as input
        const inputNodesNotConcepts = node.incomers(`edge`)
            .filter(edge => this.getGrapholElement(edge.id()).is(TypesEnum.INPUT))
            .sources()
            .filter(node => !this.getGrapholElement(node.id()).is(TypesEnum.CLASS));
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
            let inputEdges = node.incomers('edge').filter(edge => this.getGrapholElement(edge.id()).is(TypesEnum.INPUT));
            allInputClasses = allInputClasses.union(inputEdges.sources().filter(node => this.getGrapholElement(node.id()).is(TypesEnum.CLASS)));
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
            const originAttribute = this.getGrapholElement(attribute.id());
            const newAttribute = originAttribute.clone();
            newAttribute.id = `duplicate-${attribute.id()}-${i}`;
            // const newAttribute = new GrapholNode(`duplicate-${attribute.id()}-${i}`, TypesEnum.DATA_PROPERTY)
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
            newAttributeEdge.diagramId = newAttribute.diagramId;
            this.result.addElement(newAttribute);
            this.result.addElement(newAttributeEdge);
            this.newCy.$id(newAttribute.id).addClass('repositioned');
            // recursively add new attributes connected to replicated attributes by inclusions
            if (!attribute.hasClass('repositioned')) {
                attribute.neighborhood('node').filter(node => this.getGrapholElement(node.id()).is(TypesEnum.DATA_PROPERTY)).forEach((inclusion_attribute, j) => {
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
        let allAttributes = node.neighborhood(`node`).filter(node => this.getGrapholElement(node.id()).is(TypesEnum.DATA_PROPERTY));
        let allInclusionAttributes = this.newCy.collection();
        allAttributes.forEach((attribute) => {
            allClasses.forEach((concept, j) => {
                addAttribute(concept, attribute, TypesEnum.ATTRIBUTE_EDGE, j);
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
                (!grapholUnion.is(TypesEnum.UNION) && !grapholUnion.is(TypesEnum.DISJOINT_UNION)))
                return;
            // process equivalence edges
            union.connectedEdges('edge').forEach(edge => {
                const grapholEdge = this.getGrapholElement(edge.id());
                // if it's equivalence add 'C' and reverse if needed
                if (grapholEdge.is(TypesEnum.EQUIVALENCE)) {
                    grapholEdge.targetLabel = 'C';
                    if (grapholUnion.type === TypesEnum.UNION) {
                        grapholEdge.type = TypesEnum.COMPLETE_UNION;
                    }
                    else if (grapholUnion.type === TypesEnum.DISJOINT_UNION) {
                        grapholEdge.type = TypesEnum.COMPLETE_DISJOINT_UNION;
                    }
                    // the edge must have as source the union node
                    if (grapholEdge.sourceId != grapholUnion.id) {
                        this.reverseEdge(grapholEdge);
                    }
                    this.result.updateElement(grapholEdge);
                    return;
                }
                else if (grapholEdge.sourceId === grapholUnion.id && grapholEdge.is(TypesEnum.INCLUSION)) {
                    // if it's outgoing and of type inclusion
                    grapholEdge.type = grapholUnion.type;
                    this.result.updateElement(grapholEdge);
                }
            });
            // process inclusion edges
            // union.outgoers('edge').forEach(inclusion => {
            //   inclusion.addClass('hierarchy')
            //   if (union.data('type') == TypesEnum.DISJOINT_UNION)
            //     inclusion.addClass('disjoint')
            // })
            // if (union.data('label'))
            //   union.data('label', '')
            //grapholUnion.displayedName = undefined
            this.replicateAttributes(union);
            // replicate role tipization on input classes
            this.replicateRoleTypizations(union);
            this.result.updateElement(grapholUnion);
            const numberEdgesNotInput = union.connectedEdges().filter(edge => !this.getGrapholElement(edge.id()).is(TypesEnum.INPUT)).size();
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
            if (!grapholAndNode || !grapholAndNode.is(TypesEnum.INTERSECTION))
                return;
            this.replicateAttributes(and);
            this.replicateRoleTypizations(and);
            // if there are no incoming inclusions or equivalence and no equivalences connected,
            // remove the intersection
            const incomingInclusions = and.incomers('edge').filter(edge => this.getGrapholElement(edge.id()).is(TypesEnum.INCLUSION));
            const connectedEquivalences = and.connectedEdges().filter(edge => this.getGrapholElement(edge.id()).is(TypesEnum.EQUIVALENCE));
            const incomingUnionEdges = and.incomers('edge').filter(edge => {
                const grapholEdge = this.getGrapholElement(edge.id());
                return grapholEdge.is(TypesEnum.UNION) || grapholEdge.is(TypesEnum.DISJOINT_UNION);
            });
            const edgesToBeReplicated = incomingInclusions.union(connectedEquivalences).union(incomingUnionEdges);
            if (edgesToBeReplicated.empty()) {
                this.result.filter(grapholAndNode.id, '');
            }
            else {
                const incomingInputs = and.incomers('edge').filter(edge => this.getGrapholElement(edge.id()).is(TypesEnum.INPUT));
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
                        if (edgeToBeReplicated.is(TypesEnum.EQUIVALENCE) &&
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
                this.result.filter(grapholAndNode.id, '');
            }
            this.deleteFilteredElements();
            this.deleteElements(edgesToBeReplicated);
        });
    }
    replicateRoleTypizations(constructorNode) {
        // replicate role tipization on input classes
        const restrictionEdges = constructorNode.connectedEdges().filter(edge => this.isRestriction(this.getGrapholElement(edge.id())));
        const inputEdges = constructorNode.incomers('edge').filter(edge => this.getGrapholElement(edge.id()).is(TypesEnum.INPUT));
        restrictionEdges.forEach((restrictionEdge, i) => {
            const grapholRestrictionEdge = this.getGrapholElement(restrictionEdge.id());
            inputEdges.forEach((inputEdge) => {
                const grapholInputEdge = this.getGrapholElement(inputEdge.id());
                if (!grapholInputEdge)
                    return;
                const newRestrictionEdge = new GrapholEdge(`${grapholRestrictionEdge.id}-${grapholInputEdge.id}`, grapholRestrictionEdge.type);
                newRestrictionEdge.diagramId = grapholRestrictionEdge.diagramId;
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
                newRestrictionEdge.domainMandatory = grapholRestrictionEdge.domainMandatory;
                newRestrictionEdge.domainTyped = grapholRestrictionEdge.domainTyped;
                newRestrictionEdge.rangeMandatory = grapholRestrictionEdge.rangeMandatory;
                newRestrictionEdge.rangeTyped = grapholRestrictionEdge.rangeTyped;
                this.result.addElement(newRestrictionEdge);
            });
            this.deleteElement(restrictionEdge);
        });
    }
    simplifyRoleInverse() {
        this.newCy.nodes().filter(node => { var _a; return (_a = this.getGrapholElement(node.id())) === null || _a === void 0 ? void 0 : _a.is(TypesEnum.ROLE_INVERSE); }).forEach(roleInverseNode => {
            // the input role is only one
            const inputEdge = roleInverseNode.incomers('edge').filter(edge => this.getGrapholElement(edge.id()).is(TypesEnum.INPUT));
            const grapholInputEdge = this.getGrapholElement(inputEdge.id());
            // the input edge must always be reversed
            this.reverseEdge(grapholInputEdge);
            const grapholRoleInverseNode = this.getGrapholElement(roleInverseNode.id());
            // for each other edge connected, create a concatenated edge
            // the edge is directed towards the input_role
            roleInverseNode.connectedEdges().filter(edge => !this.getGrapholElement(edge.id()).is(TypesEnum.INPUT))
                .forEach((edge) => {
                const roleInverseEdge = this.getGrapholElement(edge.id());
                roleInverseEdge.type = TypesEnum.ROLE_INVERSE;
                if (roleInverseEdge.sourceId === grapholRoleInverseNode.id) {
                    this.reverseEdge(roleInverseEdge);
                }
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
        this.diagramId = diagram.id;
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
        this.addPropertyAssertionsEdge();
        this.filterByCriterion(node => {
            return this.getGrapholElement(node.id()) === undefined;
        });
        this.makeEdgesStraight();
        this.simplifyRolesFloat();
        // Remove fake nodes and restriction nodes left on diagram
        this.result.cy.nodes().filter(node => {
            return node.data().fake === true || node.data().type.endsWith('restriction');
        }).remove();
        const grapholRepresentation = diagram.representations.get(RendererStatesEnum.GRAPHOL);
        if (grapholRepresentation) {
            this.attachLostPropertiesToOWLThing(grapholRepresentation);
        }
        this.newCy.elements().unlock();
        return this.result;
    }
    static addAnnotationPropertyEdges(grapholscape) {
        const ontology = grapholscape.ontology;
        let diagram = ontology.annotationsDiagram;
        if (!diagram)
            return;
        let annotationPropertyEntity;
        let targetEntity;
        for (let [sourceEntityIri, sourceEntity] of ontology.entities) {
            sourceEntity.getAnnotations().filter(ann => ann.hasIriValue).forEach(annotation => {
                if (!annotation.rangeIri)
                    return;
                // diagramsUsed.clear()
                annotationPropertyEntity = ontology.getEntity(annotation.propertyIri);
                targetEntity = ontology.getEntity(annotation.rangeIri);
                if (!annotationPropertyEntity)
                    return;
                diagram === null || diagram === void 0 ? void 0 : diagram.addIRIValueAnnotation(sourceEntity, annotationPropertyEntity, annotation.rangeIri, grapholscape.entityNameType, grapholscape.language, targetEntity);
            });
        }
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
            return grapholNode && grapholNode.is(TypesEnum.OBJECT_PROPERTY);
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
        let grapholDomainNode, grapholRangeNode, owlThingCyNode;
        if (domains.empty() && ranges.empty()) {
            return;
        }
        if (domains.empty() || ranges.empty()) {
            owlThingCyNode = this.newCy.$id(this.addOWlThing().id);
            if (domains.empty()) {
                domains = domains.union(owlThingCyNode);
            }
            if (ranges.empty()) {
                ranges = ranges.union(owlThingCyNode);
            }
        }
        domains.forEach((domain) => {
            grapholDomainNode = domain === owlThingCyNode
                ? this.getGrapholElement(domain.id())
                : this.getGrapholElement(domain.source().id());
            ranges.forEach((range, i) => {
                grapholRangeNode = range === owlThingCyNode
                    ? this.getGrapholElement(range.id())
                    : this.getGrapholElement(range.source().id());
                let newGrapholEdge = new GrapholEdge(this.result.getNewId('edge'), TypesEnum.OBJECT_PROPERTY);
                newGrapholEdge.sourceId = grapholDomainNode.id;
                newGrapholEdge.targetId = grapholRangeNode.id;
                if (this.diagramId !== undefined)
                    newGrapholEdge.diagramId = this.diagramId;
                // if it's an object property on owl thing then leave domain/range info as default (only typed)
                if (domain !== owlThingCyNode) {
                    newGrapholEdge.domainMandatory = domain.data().domainMandatory;
                    newGrapholEdge.domainTyped = domain.data().domainTyped;
                }
                if (range !== owlThingCyNode) {
                    newGrapholEdge.rangeMandatory = range.data().rangeMandatory;
                    newGrapholEdge.rangeTyped = range.data().rangeTyped;
                }
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
                // newGrapholEdge.originalId = objectProperty.id().toString()
                this.result.addElement(newGrapholEdge);
                const newAddedCyElement = this.newCy.$id(newGrapholEdge.id);
                newAddedCyElement.data('iri', objectProperty.data().iri);
            });
        });
    }
    attachLostPropertiesToOWLThing(grapholRepresentation) {
        const originalObjectProperties = grapholRepresentation.cy.$(`[type = "${TypesEnum.OBJECT_PROPERTY}"]`);
        const originalDataProperties = grapholRepresentation.cy.$(`[type = "${TypesEnum.DATA_PROPERTY}"]`);
        let originalElem, attributeEdge, owlThingClass;
        originalDataProperties.forEach(dp => {
            if (this.result.cy.$(`[type = "${TypesEnum.DATA_PROPERTY}"][iri = "${dp.data().iri}"]`).empty()) {
                originalElem = grapholRepresentation.grapholElements.get(dp.id());
                if (originalElem) {
                    this.result.addElement(originalElem);
                    if (!owlThingClass) {
                        owlThingClass = this.addOWlThing();
                    }
                    attributeEdge = new GrapholEdge(this.result.getNewId('edge'), TypesEnum.DATA_PROPERTY);
                    attributeEdge.sourceId = owlThingClass.id;
                    attributeEdge.targetId = originalElem.id;
                    this.result.addElement(attributeEdge);
                }
            }
        });
        let objectPropertyEdge;
        originalObjectProperties.forEach(op => {
            if (this.result.cy.$(`[type = "${TypesEnum.OBJECT_PROPERTY}"][iri = "${op.data().iri}"]`).empty()) {
                originalElem = grapholRepresentation.grapholElements.get(op.id());
                if (originalElem) {
                    if (!owlThingClass) {
                        owlThingClass = this.addOWlThing();
                    }
                    objectPropertyEdge = new GrapholEdge(this.result.getNewId('edge'), TypesEnum.OBJECT_PROPERTY);
                    objectPropertyEdge.iri = originalElem.iri;
                    objectPropertyEdge.displayedName = originalElem.displayedName;
                    if (this.diagramId)
                        objectPropertyEdge.diagramId = this.diagramId;
                    objectPropertyEdge.sourceId = owlThingClass.id;
                    objectPropertyEdge.targetId = owlThingClass.id;
                    this.result.addElement(objectPropertyEdge);
                }
            }
        });
    }
    getDomainsOfObjectProperty(objectProperty) {
        if (!objectProperty || objectProperty.empty())
            return null;
        let domainRestrictions = objectProperty.incomers(`edge`).filter(edge => this.getGrapholElement(edge.id()).is(TypesEnum.DOMAIN_RESTRICTION));
        const fathers = this.getFathers(objectProperty);
        let fathersDomainRestrictions = this.newCy.collection();
        fathers.forEach(father => {
            const newDomains = this.getDomainsOfObjectProperty(father);
            if (newDomains)
                fathersDomainRestrictions = fathersDomainRestrictions.union(newDomains);
        });
        return domainRestrictions.union(fathersDomainRestrictions);
    }
    getRangesOfObjectProperty(objectProperty) {
        if (!objectProperty || objectProperty.empty())
            return;
        let rangeRestrictions = objectProperty.incomers(`edge`).filter(edge => this.getGrapholElement(edge.id()).is(TypesEnum.RANGE_RESTRICTION));
        const fathers = this.getFathers(objectProperty);
        let fatherRangeRestrictions = this.newCy.collection();
        fathers.forEach(father => {
            const newRanges = this.getRangesOfObjectProperty(father);
            if (newRanges)
                fatherRangeRestrictions = fatherRangeRestrictions.union(newRanges);
        });
        return rangeRestrictions.union(fatherRangeRestrictions);
    }
    addPropertyAssertionsEdge() {
        let sourceId;
        let targetId;
        let objectPropertyNode;
        const propertyAsserstions = this.result.cy.$(`[!fake][type = "${TypesEnum.PROPERTY_ASSERTION}"]`);
        propertyAsserstions.forEach(propertyAssertionNode => {
            const inputs = propertyAssertionNode.connectedEdges(`[type = "${TypesEnum.INPUT}"]`);
            sourceId = inputs.filter(edge => edge.data('targetLabel') === '1').source().id();
            targetId = inputs.filter(edge => edge.data('targetLabel') === '2').source().id();
            if (sourceId && targetId) {
                propertyAssertionNode.connectedEdges(`[type = "${TypesEnum.MEMBERSHIP}"]`).forEach(membershipEdge => {
                    objectPropertyNode = this.getGrapholElement(membershipEdge.target().id());
                    if (objectPropertyNode) {
                        const newObjectPropertyEdge = new GrapholEdge(this.result.getNewId('edge'), TypesEnum.OBJECT_PROPERTY);
                        newObjectPropertyEdge.iri = objectPropertyNode.iri;
                        newObjectPropertyEdge.displayedName = objectPropertyNode.displayedName;
                        if (this.diagramId)
                            newObjectPropertyEdge.diagramId = this.diagramId;
                        // newObjectPropertyEdge.originalId = objectPropertyNode.id
                        newObjectPropertyEdge.sourceId = sourceId;
                        newObjectPropertyEdge.targetId = targetId;
                        newObjectPropertyEdge.domainMandatory = true;
                        newObjectPropertyEdge.rangeMandatory = true;
                        newObjectPropertyEdge.domainTyped = false;
                        newObjectPropertyEdge.rangeTyped = false;
                        const newAddedCyElement = this.result.addElement(newObjectPropertyEdge);
                        newAddedCyElement.data('iri', objectPropertyNode.iri);
                    }
                });
            }
        });
        this.deleteElements(propertyAsserstions);
    }
    getFathers(node) {
        return node.outgoers('edge').filter(edge => this.getGrapholElement(edge.id()).is(TypesEnum.INCLUSION)).targets();
    }
    addOWlThing() {
        const thingIri = DefaultNamespaces.OWL.toString() + 'Thing';
        const owlThingCyElem = this.newCy.$(`[ iri = "${thingIri}"]`).first();
        if (owlThingCyElem.empty()) {
            const owlThingClass = new GrapholNode(this.result.getNewId('node'), TypesEnum.CLASS);
            owlThingClass.iri = thingIri;
            owlThingClass.displayedName = 'Thing';
            if (this.diagramId)
                owlThingClass.diagramId = this.diagramId;
            this.result.addElement(owlThingClass);
            return owlThingClass;
        }
        else {
            return this.getGrapholElement(owlThingCyElem.id());
        }
    }
}

/** @internal */
function rdfgraphSerializer (grapholscape, modelType = RDFGraphModelTypeEnum.ONTOLOGY) {
    const ontology = grapholscape.ontology;
    const result = {
        diagrams: [],
        entities: Array.from(ontology.entities.values()).map(e => e.json()),
        modelType: modelType,
        metadata: {
            name: ontology.name,
            version: ontology.version,
            namespaces: ontology.namespaces.map(n => {
                return {
                    value: n.value,
                    prefixes: n.prefixes
                };
            }),
            iri: ontology.iri,
            defaultLanguage: ontology.defaultLanguage,
            languages: ontology.languages,
            annotations: ontology.getAnnotations().map(ann => {
                return {
                    property: ann.property,
                    value: ann.value,
                    language: ann.language,
                    datatype: ann.datatype,
                    hasIriValue: ann.hasIriValue,
                };
            }),
            annotationProperties: ontology.annProperties.map(ap => ap.fullIri)
        }
    };
    let diagrams = [];
    if (modelType === RDFGraphModelTypeEnum.VKG) {
        if (grapholscape.incremental) {
            // result.classInstanceEntities = Array.from(grapholscape.incremental.classInstanceEntities.values()).map(e => e.json())
            if (grapholscape.incremental.diagram)
                diagrams = [grapholscape.incremental.diagram];
        }
    }
    else {
        diagrams = ontology.diagrams;
    }
    let repr;
    const rendererState = modelType === RDFGraphModelTypeEnum.ONTOLOGY ? RendererStatesEnum.FLOATY : RendererStatesEnum.INCREMENTAL;
    result.diagrams = diagrams.map(d => {
        repr = d.representations.get(rendererState);
        if (!repr) {
            const floatyTransformer = new FloatyTransformer();
            repr = floatyTransformer.transform(d);
        }
        let resElem;
        return {
            id: d.id,
            name: d.name,
            lastViewportState: d.id === grapholscape.diagramId ? grapholscape.renderer.viewportState : d.lastViewportState,
            nodes: repr.cy.nodes().map(n => {
                var _a;
                resElem = (_a = repr.grapholElements.get(n.id())) === null || _a === void 0 ? void 0 : _a.json();
                if (resElem) {
                    resElem.position = n.position();
                }
                return resElem;
            }).filter(n => n !== undefined),
            edges: repr.cy.edges().map(e => { var _a; return (_a = repr.grapholElements.get(e.id())) === null || _a === void 0 ? void 0 : _a.json(); }).filter(e => e !== undefined)
        };
    });
    if (grapholscape.diagramId !== undefined) {
        result.selectedDiagramId = grapholscape.diagramId;
    }
    result.config = {
        themes: grapholscape.themeList.map(t => {
            return {
                id: t.id,
                name: t.name,
                colours: t.colours,
            };
        }),
        selectedTheme: grapholscape.theme.id,
        language: grapholscape.language,
        entityNameType: grapholscape.entityNameType,
        renderers: grapholscape.renderers,
    };
    return result;
}

/**
 * @internal
 */
class DisplayedNamesManager {
    constructor(grapholscape) {
        this._entityNameType = RDFGraphConfigEntityNameTypeEnum.LABEL;
        this._language = Language.EN;
        this._grapholscape = grapholscape;
    }
    get entityNameType() { return this._entityNameType; }
    get language() { return this._language; }
    setEntityNameType(newEntityNameType) {
        if (newEntityNameType === this._entityNameType)
            return;
        if (!Object.values(RDFGraphConfigEntityNameTypeEnum).includes(newEntityNameType)) {
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
        if (!this._grapholscape.ontology.languages.includes(language)) {
            console.warn(`Language ${language} is not supported by this ontology`);
            return;
        }
        if (languageValue === this._language) {
            return;
        }
        this._language = languageValue;
        if (this._entityNameType === RDFGraphConfigEntityNameTypeEnum.LABEL) {
            for (let entity of this._grapholscape.ontology.entities.values()) {
                this.setDisplayedNames(entity);
            }
        }
        this._grapholscape.lifecycle.trigger(LifecycleEvent.LanguageChange, languageValue);
        storeConfigEntry('language', language);
    }
    setDisplayedNames(entity) {
        let diagram, newDisplayedName;
        entity.occurrences.forEach((entityOccurrencesInRenderState, renderState) => {
            entityOccurrencesInRenderState.forEach(entityOccurrence => {
                var _a, _b;
                newDisplayedName = entity.getDisplayedName(this.entityNameType, this.language);
                if (newDisplayedName !== entityOccurrence.displayedName) {
                    entityOccurrence.displayedName = newDisplayedName;
                    if (renderState === RendererStatesEnum.INCREMENTAL) {
                        // incremental diagram is not in the ontology, must take it from inremental controller
                        diagram = (_a = this._grapholscape.incremental) === null || _a === void 0 ? void 0 : _a.diagram;
                    }
                    else {
                        diagram = this._grapholscape.ontology.getDiagram(entityOccurrence.diagramId);
                    }
                }
                (_b = diagram === null || diagram === void 0 ? void 0 : diagram.representations.get(renderState)) === null || _b === void 0 ? void 0 : _b.updateElement(entityOccurrence, entity, false);
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
    _performCenterSelect(grapholElement, select, zoom) {
        if (this._grapholscape.diagramId !== grapholElement.diagramId) {
            this._grapholscape.showDiagram(grapholElement.diagramId);
        }
        this._grapholscape.renderer.centerOnElementById(grapholElement.id, zoom, select);
        if (select) {
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
        var _a;
        if (!this._grapholscape.renderState)
            return;
        const occurrences = (_a = this._grapholscape.ontology.getEntityOccurrences(iri, diagramId)) === null || _a === void 0 ? void 0 : _a.get(this._grapholscape.renderState);
        return occurrences ? occurrences[0] : undefined;
    }
    updateEntitiesOccurrences() {
        var _a;
        if (!this._grapholscape.renderState || this._grapholscape.renderState === RendererStatesEnum.GRAPHOL)
            return;
        this._grapholscape.ontology.diagrams.forEach(diagram => this.updateEntitiesOccurrencesFromDiagram(diagram));
        if ((_a = this._grapholscape.incremental) === null || _a === void 0 ? void 0 : _a.diagram) {
            this.updateEntitiesOccurrencesFromDiagram(this._grapholscape.incremental.diagram);
        }
    }
    updateEntitiesOccurrencesFromDiagram(diagram) {
        diagram.representations.forEach((representation, rendererState) => {
            var _a;
            (_a = representation.cy) === null || _a === void 0 ? void 0 : _a.$("[iri][!fake]").forEach(entityElement => {
                const grapholEntity = this._grapholscape.ontology.getEntity(entityElement.data('iri'));
                if (grapholEntity) {
                    const grapholElement = representation.grapholElements.get(entityElement.id());
                    if (grapholElement) {
                        grapholEntity.addOccurrence(grapholElement, rendererState);
                    }
                }
            });
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
             * Stop rendering current diagram before
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
        }
        filter.active = activate;
    }
    getFilter(filter) {
        let _filter;
        if (typeof filter === 'string') {
            _filter = this.filters.get(filter);
        }
        else {
            _filter = filter;
        }
        if (!_filter) {
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
     * Select a node or an edge in the current diagram given its unique id
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
        (_b = this.renderState) === null || _b === void 0 ? void 0 : _b.centerOnElementById(elementId, zoom, select);
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

class GrapholFilterManager extends BaseFilterManager {
    constructor() {
        super(...arguments);
        this.lockedFilters = [
            RDFGraphConfigFiltersEnum.ANNOTATION_PROPERTY,
        ];
    }
    filterActivation(filter) {
        var _a;
        if (!super.filterActivation(filter))
            return false;
        if (filter.locked) {
            console.warn(`Filter has been locked and cannot be applied at the moment`);
            return false;
        }
        if (filter.key === RDFGraphConfigFiltersEnum.DATA_PROPERTY) {
            // VALUE DOMAIN filter cannot be changed if data-property filter has been activated
            (_a = this.filters.get(RDFGraphConfigFiltersEnum.VALUE_DOMAIN)) === null || _a === void 0 ? void 0 : _a.lock();
        }
        return true;
    }
    filterDeactivation(filter) {
        var _a;
        if (!super.filterDeactivation(filter))
            return false;
        if (filter.key === RDFGraphConfigFiltersEnum.DATA_PROPERTY) {
            // VALUE DOMAIN filter cannot be changed if data-property filter has been activated
            (_a = this.filters.get(RDFGraphConfigFiltersEnum.VALUE_DOMAIN)) === null || _a === void 0 ? void 0 : _a.unlock();
        }
        return true;
    }
}

function grapholStyle (theme) {
    return [
        {
            selector: 'node',
            style: {
                'height': (node) => node.data('height') || 40,
                'width': (node) => node.data('width') || 40,
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
            selector: '[displayedName]',
            style: {
                'label': 'data(displayedName)',
                'min-zoomed-font-size': '5px',
            }
        },
        {
            selector: 'node[displayedName]',
            style: {
                'text-margin-x': (n) => n.data('labelXpos') || 0,
                'text-margin-y': (n) => n.data('labelYpos') || 0,
                'text-wrap': 'wrap',
            }
        },
        {
            selector: `node[displayedName][type = "${TypesEnum.CLASS}"], node[displayedName][type = "${TypesEnum.INDIVIDUAL}"]`,
            style: {
                'text-max-width': (n) => n.data('width') || 80,
                'text-overflow-wrap': (n) => {
                    if (n.data('displayedName').includes(' '))
                        return 'whitespace';
                    else
                        return 'anywhere';
                }
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
            selector: `edge[type = "${TypesEnum.INCLUSION}"]`,
            style: {
                'line-style': 'solid',
                'target-arrow-shape': 'triangle',
                'target-arrow-fill': 'filled'
            }
        },
        {
            selector: `edge[type = "${TypesEnum.MEMBERSHIP}"]`,
            style: {
                'line-style': 'dashed',
                'line-dash-pattern': [2, 3],
                'target-arrow-shape': 'triangle',
                'target-arrow-fill': 'hollow'
            }
        },
        {
            selector: `edge[type = "${TypesEnum.INPUT}"]`,
            style: {
                'line-style': 'dashed',
                'target-arrow-shape': 'diamond',
                'target-arrow-fill': 'hollow'
            }
        },
        {
            selector: `edge[type = "${TypesEnum.EQUIVALENCE}"]`,
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
            selector: 'edge',
            style: {
                'font-size': 10,
                'text-rotation': 'autorotate',
                'text-margin-y': -10,
            }
        },
        {
            selector: `
        [sourceLabel],[targetLabel],
        edge[type = "${TypesEnum.DOMAIN_RESTRICTION}"],
        edge[type = "${TypesEnum.RANGE_RESTRICTION}"],
        edge[type = "${TypesEnum.COMPLETE_UNION}"],
        edge[type = "${TypesEnum.COMPLETE_DISJOINT_UNION}"],
        edge[type = "${TypesEnum.ATTRIBUTE_EDGE}"],
        edge[type = "${TypesEnum.OBJECT_PROPERTY}"],
        edge[type = "${TypesEnum.ANNOTATION_PROPERTY}"]`,
            style: {
                'font-size': 15,
                'target-text-offset': 20,
                'source-text-offset': 20,
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
            selector: 'edge,[sourceLabel],[targetLabel],[text_background]',
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
            selector: `[type = "${TypesEnum.FACET}"][!fake], .fake-bottom-rhomboid`,
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
            selector: `[type = "${TypesEnum.PROPERTY_ASSERTION}"][!fake]`,
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
            selector: `node[type = "${TypesEnum.CLASS}"]`,
            style: {
                'background-color': node => getColor(node, ColoursNames.class),
                'border-color': theme.getColour(ColoursNames.class_contrast),
            }
        },
        {
            selector: `node[type = "${TypesEnum.OBJECT_PROPERTY}"], .fake-triangle`,
            style: {
                'background-color': node => getColor(node, ColoursNames.object_property),
                'border-color': theme.getColour(ColoursNames.object_property_contrast),
            }
        },
        {
            selector: `node[type = "${TypesEnum.DATA_PROPERTY}"]`,
            style: {
                'background-color': node => getColor(node, ColoursNames.data_property),
                'border-color': theme.getColour(ColoursNames.data_property_contrast),
            }
        },
        {
            selector: `node[type = "${TypesEnum.DATA_PROPERTY}"]:selected`,
            style: {
                'text-background-color': theme.getColour(ColoursNames.bg_graph),
                'text-background-opacity': 1,
            }
        },
        {
            selector: `node[type = "${TypesEnum.INDIVIDUAL}"]`,
            style: {
                'background-color': node => getColor(node, ColoursNames.individual),
                'border-color': theme.getColour(ColoursNames.individual_contrast),
            }
        },
        {
            selector: `[type = "${TypesEnum.RANGE_RESTRICTION}"], [type = "${TypesEnum.DISJOINT_UNION}"]`,
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
            selector: `[shape = "${Shape.HEXAGON}"],[type = "${TypesEnum.VALUE_DOMAIN}"]`,
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
        if (this.renderer.viewportState && this.renderer.diagram) {
            this.renderer.diagram.lastViewportState = this.renderer.viewportState;
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
    postOntologyTransform(grapholscape) { }
}

class LiteFilterManager extends BaseFilterManager {
    constructor() {
        super(...arguments);
        this.lockedFilters = [
            RDFGraphConfigFiltersEnum.ANNOTATION_PROPERTY,
            RDFGraphConfigFiltersEnum.VALUE_DOMAIN,
            RDFGraphConfigFiltersEnum.UNIVERSAL_QUANTIFIER,
            RDFGraphConfigFiltersEnum.COMPLEMENT,
            RDFGraphConfigFiltersEnum.HAS_KEY,
        ];
    }
}

function liteStyle (theme) {
    const baseStyle = grapholStyle(theme);
    const liteStyle = [
        {
            selector: `edge[type = "${TypesEnum.INPUT}"]`,
            style: {
                'line-style': 'solid',
                'target-arrow-shape': 'none',
            }
        },
        {
            selector: `node[type = "${TypesEnum.UNION}"], node[type = "${TypesEnum.DISJOINT_UNION}"]`,
            style: {
                'label': '',
                'width': 0.1,
                'height': 0.1,
            }
        },
        {
            selector: `edge[type = "${TypesEnum.UNION}"], edge[type = "${TypesEnum.DISJOINT_UNION}"], edge[type = "${TypesEnum.COMPLETE_UNION}"], edge[type = "${TypesEnum.COMPLETE_DISJOINT_UNION}"]`,
            style: {
                'width': 6,
                'line-style': 'solid',
                'target-arrow-shape': 'triangle',
            }
        },
        {
            selector: `edge[type = "${TypesEnum.COMPLETE_UNION}"], edge[type = "${TypesEnum.COMPLETE_DISJOINT_UNION}"]`,
            style: {
                'target-label': 'C',
                'font-size': 15,
                'target-text-offset': 20,
                'text-background-color': theme.getColour(ColoursNames.bg_graph),
                'text-background-opacity': 1,
                'text-background-shape': 'roundrectangle',
                'text-background-padding': 2,
            }
        },
        {
            selector: `edge[type = "${TypesEnum.UNION}"], edge[type = "${TypesEnum.COMPLETE_UNION}"]`,
            style: {
                'target-arrow-fill': 'hollow',
            }
        },
        {
            selector: `edge[type = "${TypesEnum.DISJOINT_UNION}"], edge[type = "${TypesEnum.COMPLETE_DISJOINT_UNION}"]`,
            style: {
                'target-arrow-fill': 'filled',
            }
        },
        {
            selector: `[type = "${TypesEnum.DOMAIN_RESTRICTION}"], [type = "${TypesEnum.RANGE_RESTRICTION}"]`,
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
            selector: `[type = "${TypesEnum.RANGE_RESTRICTION}"]`,
            style: {
                'target-arrow-shape': 'square',
                'target-arrow-fill': 'filled',
                'source-arrow-shape': 'none',
            }
        },
        {
            selector: `[type = "${TypesEnum.DOMAIN_RESTRICTION}"]`,
            style: {
                'target-arrow-shape': 'square',
                'target-arrow-fill': 'hollow',
                'source-arrow-shape': 'none',
            }
        },
        {
            selector: `[type = "${TypesEnum.DOMAIN_RESTRICTION}"]:selected, [type = "${TypesEnum.RANGE_RESTRICTION}"]:selected`,
            style: {
                'source-label': (e) => {
                    let label = '';
                    if (e.data().domainTyped || e.data().rangeTyped)
                        label = 'T';
                    if (e.data().domainMandatory || e.data().rangeMandatory)
                        label = label + 'M';
                    return label;
                }
            }
        },
        {
            selector: `edge[type = "${TypesEnum.DATA_PROPERTY}"]`,
            style: {
                'line-color': theme.getColour(ColoursNames.data_property_contrast),
                'source-arrow-shape': 'none',
                'target-arrow-shape': 'none',
            }
        },
        {
            selector: `edge[type = "${TypesEnum.ROLE_INVERSE}"]`,
            style: {
                'target-arrow-shape': 'triangle',
                'target-arrow-fill': 'filled',
                'text-rotation': 'autorotate',
            }
        },
        // DOMAIN DP
        {
            selector: `edge[type = "${TypesEnum.ATTRIBUTE_EDGE}"][?domainMandatory][!domainTyped]:selected`,
            style: {
                'source-label': 'M'
            }
        },
        {
            selector: `edge[type = "${TypesEnum.ATTRIBUTE_EDGE}"][?domainTyped][!domainMandatory]:selected`,
            style: {
                'source-label': 'T'
            }
        },
        {
            selector: `edge[type = "${TypesEnum.ATTRIBUTE_EDGE}"][?domainTyped][?domainMandatory]:selected`,
            style: {
                'source-label': 'TM'
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
        if (this.renderer.viewportState && this.renderer.diagram) {
            this.renderer.diagram.lastViewportState = this.renderer.viewportState;
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
    postOntologyTransform(grapholscape) { }
    get layout() { return this._layout; }
    set layout(newLayout) { this._layout = newLayout; }
}

class FloatyFilterManager extends BaseFilterManager {
    constructor() {
        super(...arguments);
        this.lockedFilters = [
            RDFGraphConfigFiltersEnum.VALUE_DOMAIN,
            RDFGraphConfigFiltersEnum.UNIVERSAL_QUANTIFIER,
            RDFGraphConfigFiltersEnum.COMPLEMENT,
            RDFGraphConfigFiltersEnum.HAS_KEY,
        ];
    }
}

function getNodeBodyColor(node, theme) {
    const shouldUseComputedColor = theme.useComputedColours && node.data().computedFillColor !== undefined;
    if (shouldUseComputedColor) {
        if (isThemeDark(theme)) {
            const color = chroma(node.data().computedFillColor);
            const darkenFactor = color.luminance();
            if (color.luminance() > 0.2) {
                color.luminance(0.2, 'lab');
            }
            return color.desaturate(0.1).darken(darkenFactor).css();
        }
        else {
            return node.data().computedFillColor;
        }
    }
}
function getNodeBorderColor(node, theme) {
    const shouldUseComputedColor = theme.useComputedColours && node.data().computedFillColor !== undefined;
    if (shouldUseComputedColor) {
        if (isThemeDark(theme)) {
            return chroma(node.data().computedFillColor).saturate().brighten().css();
        }
        else {
            return chroma(node.data().computedFillColor).darken(2).css();
        }
    }
}
function getNodeLabelColor(node, theme) {
    if (theme.useComputedColours && node.data().computedFillColor !== undefined) {
        const nodeBGColor = chroma(node.style('background-color'));
        const labelColorString = theme.getColour(ColoursNames.label);
        let labelColor;
        if (labelColorString)
            labelColor = chroma(labelColorString);
        else
            return theme.getColour(ColoursNames.label);
        /**
         * 4.5:1 minimum contrast suggested by
         * https://www.w3.org/TR/WCAG20-TECHS/G18.html
         */
        if (chroma.contrast(nodeBGColor, labelColor) > 4.5) {
            return theme.getColour(ColoursNames.label);
        }
        else {
            return theme.getColour(ColoursNames.label_contrast);
        }
    }
    else {
        return theme.getColour(ColoursNames.label);
    }
}
function isThemeDark(theme) {
    const bgColor = theme.getColour(ColoursNames.bg_graph);
    if (bgColor)
        return chroma(bgColor).luminance() < 0.3;
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
            selector: `[type = "${TypesEnum.CLASS}"]`,
            style: {
                'text-margin-x': 0,
                'text-margin-y': 0,
                'text-valign': 'center',
                'text-halign': 'center',
                'height': (node) => node.data('width') || 80,
                'width': (node) => node.data('width') || 80,
                // 'text-background-color': (node) => getNodeBodyColor(node, theme) || 'rgba(0, 0, 0, 0)',
                // 'text-background-opacity': (node) => getNodeBodyColor(node, theme) ? 1 : 0,
                'text-background-shape': 'roundrectangle',
                'text-background-padding': 2,
                color: (node) => getNodeLabelColor(node, theme),
                backgroundColor: (node) => getNodeBodyColor(node, theme) || theme.getColour(ColoursNames.class),
                "border-color": (node) => getNodeBorderColor(node, theme) || theme.getColour(ColoursNames.class_contrast),
            }
        },
        {
            selector: `node[type = "${TypesEnum.DATA_PROPERTY}"]`,
            style: {
                'height': (node) => node.data('width') || 20,
                'width': (node) => node.data('width') || 20
            }
        },
        {
            selector: `node[type = "${TypesEnum.INDIVIDUAL}"]`,
            style: {
                'height': (node) => node.data('width') || 60,
                'width': (node) => node.data('width') || 60,
                backgroundColor: (node) => getNodeBodyColor(node, theme) || theme.getColour(ColoursNames.individual),
                "border-color": (node) => getNodeBorderColor(node, theme) || theme.getColour(ColoursNames.individual_contrast),
            }
        },
        {
            selector: `edge[type = "${TypesEnum.INSTANCE_OF}"]`,
            style: {
                "target-arrow-shape": 'triangle',
                'target-arrow-fill': 'filled',
                'line-color': theme.getColour(ColoursNames.individual_contrast),
                'target-arrow-color': theme.getColour(ColoursNames.individual_contrast),
                'line-opacity': 0.4,
            }
        },
        {
            selector: `edge[type = "${TypesEnum.INPUT}"]`,
            style: {
                'line-style': 'solid',
                'target-arrow-shape': 'none',
            }
        },
        {
            selector: `[displayedName][type = "${TypesEnum.OBJECT_PROPERTY}"]`,
            style: {
                'label': (elem) => elem.data().displayedName.replace(/\r?\n|\r/g, '')
            }
        },
        {
            selector: `[type = "${TypesEnum.OBJECT_PROPERTY}"], [type = "${TypesEnum.ANNOTATION_PROPERTY}"]`,
            style: {
                'target-arrow-shape': 'triangle',
                'target-arrow-fill': 'filled',
                'source-arrow-shape': 'square',
                'source-arrow-fill': 'hollow',
                'width': 4,
            }
        },
        {
            selector: `[type = "${TypesEnum.OBJECT_PROPERTY}"]`,
            style: {
                'line-color': theme.getColour(ColoursNames.object_property_contrast),
                'source-arrow-color': theme.getColour(ColoursNames.object_property_contrast),
                'target-arrow-color': theme.getColour(ColoursNames.object_property_contrast),
            }
        },
        {
            selector: `[type = "${TypesEnum.ANNOTATION_PROPERTY}"]`,
            style: {
                'line-color': theme.getColour(ColoursNames.annotation_property_contrast),
                'source-arrow-color': theme.getColour(ColoursNames.annotation_property_contrast),
                'target-arrow-color': theme.getColour(ColoursNames.annotation_property_contrast),
            }
        },
        {
            selector: `node[type = "${TypesEnum.UNION}"], node[type = "${TypesEnum.DISJOINT_UNION}"]`,
            style: {
                'width': 35,
                'height': 35,
            }
        },
        {
            selector: `edge[type = "${TypesEnum.UNION}"], edge[type = "${TypesEnum.DISJOINT_UNION}"], edge[type = "${TypesEnum.COMPLETE_UNION}"], edge[type = "${TypesEnum.COMPLETE_DISJOINT_UNION}"]`,
            style: {
                'width': 6,
                'line-style': 'solid',
                'target-arrow-shape': 'triangle',
                'text-background-color': theme.getColour(ColoursNames.bg_graph),
                'text-background-opacity': 1,
                'text-background-shape': 'roundrectangle',
                'text-background-padding': 2,
            }
        },
        {
            selector: `edge[type = "${TypesEnum.COMPLETE_UNION}"], edge[type = "${TypesEnum.COMPLETE_DISJOINT_UNION}"]`,
            style: {
                'target-label': 'C',
            }
        },
        {
            selector: ':loop',
            style: {
                'control-point-step-size': 80,
                'control-point-weight': 0.5,
            }
        },
        // DOMAIN DP
        {
            selector: `edge[type = "${TypesEnum.ATTRIBUTE_EDGE}"][?domainMandatory][!domainTyped]:selected`,
            style: {
                'source-label': 'M'
            }
        },
        {
            selector: `edge[type = "${TypesEnum.ATTRIBUTE_EDGE}"][?domainTyped][!domainMandatory]:selected`,
            style: {
                'source-label': 'T'
            }
        },
        {
            selector: `edge[type = "${TypesEnum.ATTRIBUTE_EDGE}"][?domainTyped][?domainMandatory]:selected`,
            style: {
                'source-label': 'TM'
            }
        },
        // DOMAIN OP
        {
            selector: `edge[type = "${TypesEnum.OBJECT_PROPERTY}"][?domainMandatory][!domainTyped]:selected`,
            style: {
                'source-label': 'M'
            }
        },
        {
            selector: `edge[type = "${TypesEnum.OBJECT_PROPERTY}"][?domainTyped][!domainMandatory]:selected`,
            style: {
                'source-label': 'T'
            }
        },
        {
            selector: `edge[type = "${TypesEnum.OBJECT_PROPERTY}"][?domainTyped][?domainMandatory]:selected`,
            style: {
                'source-label': 'TM'
            }
        },
        // RANGE OP
        {
            selector: `edge[type = "${TypesEnum.OBJECT_PROPERTY}"][?rangeMandatory][!rangeTyped]:selected`,
            style: {
                'target-label': 'M'
            }
        },
        {
            selector: `edge[type = "${TypesEnum.OBJECT_PROPERTY}"][?rangeTyped][!rangeMandatory]:selected`,
            style: {
                'target-label': 'T'
            }
        },
        {
            selector: `edge[type = "${TypesEnum.OBJECT_PROPERTY}"][?rangeTyped][?rangeMandatory]:selected`,
            style: {
                'target-label': 'TM'
            }
        },
        {
            selector: `node[icon]`,
            style: {
                'background-image': 'data(icon)',
                'text-valign': 'top',
                'color': theme.getColour(ColoursNames.label),
                'background-width': '100%',
                'background-height': '100%',
                'background-image-crossorigin': "null",
            }
        },
        // {
        //   selector: `node[icon][type = "${TypesEnum.CLASS}"]`,
        //   style: {
        //     'background-width': '50%',
        //     'background-height': '50%',
        //   }
        // },
        // {
        //   selector: `node[icon][type = "${TypesEnum.INDIVIDUAL}"]`,
        //   style: {
        //     'background-width': '100%',
        //     'background-height': '100%',
        //   }
        // },
        {
            selector: '[?pinned]',
            style: {
                'border-width': 4,
            }
        },
    ];
    return baseStyle.concat(floatyStyle);
}
// function getNodeBodyColor(node: NodeSingular, theme: GrapholscapeTheme) {
//   if ((theme.id === DefaultThemesEnum.COLORFUL_LIGHT || theme.id === DefaultThemesEnum.COLORFUL_DARK) && node.data().computedFillColor) {
//     if (ColorManager.isBackgroundDark(theme)) {
//       const color = chroma(node.data().computedFillColor)
//       if (color.luminance() > 0.5) {
//         color.luminance(0.5, 'lab')
//       }
//       return color.desaturate().darken().css()
//     } else {
//       return node.data().computedFillColor
//     }
//   }
// }
// function getNodeBorderColor(node: NodeSingular, theme: GrapholscapeTheme) {
//   if ((theme.id === DefaultThemesEnum.COLORFUL_LIGHT || theme.id === DefaultThemesEnum.COLORFUL_DARK) && node.data().computedFillColor) {
//     if (ColorManager.isBackgroundDark(theme)) {
//       return chroma(node.data().computedFillColor).css()
//     } else {
//       return chroma(node.data().computedFillColor).darken(2).css()
//     }
//   }
// }

function computeHierarchies(ontology) {
    const unionNodeSelector = `node[type = "${TypesEnum.UNION}"], node[type = "${TypesEnum.DISJOINT_UNION}"]`;
    const unionEdgeSelector = `edge[type = "${TypesEnum.UNION}"], edge[type = "${TypesEnum.DISJOINT_UNION}"], edge[type = "${TypesEnum.COMPLETE_UNION}"], edge[type = "${TypesEnum.COMPLETE_DISJOINT_UNION}"]`;
    let representation;
    for (const diagram of ontology.diagrams) {
        representation = diagram.representations.get(RendererStatesEnum.FLOATY);
        if (representation) {
            representation.cy.$(unionNodeSelector).forEach(unionNode => {
                var _a;
                const id = unionNode.data().hierarchyID || `${unionNode.id()}-${diagram.id}`;
                const hierarchy = new Hierarchy(id, unionNode.data().type);
                unionNode.data('hierarchyID', hierarchy.id);
                const grapholUnionNode = (_a = diagram.representations.get(RendererStatesEnum.FLOATY)) === null || _a === void 0 ? void 0 : _a.grapholElements.get(unionNode.id());
                if (grapholUnionNode && isGrapholNode(grapholUnionNode)) {
                    grapholUnionNode.hierarchyID = hierarchy.id;
                }
                let entity;
                unionNode.connectedEdges(`[type = "${TypesEnum.INPUT}"]`).sources().forEach(inputNode => {
                    if (inputNode.data().iri) {
                        entity = ontology.getEntity(inputNode.data().iri);
                        if (entity) {
                            hierarchy.addInput(entity);
                        }
                    }
                });
                unionNode.outgoers(unionEdgeSelector).forEach(inclusionEdge => {
                    const superClass = inclusionEdge.target();
                    if (superClass.data().iri) {
                        entity = ontology.getEntity(superClass.data().iri);
                        if (entity) {
                            hierarchy.addSuperclass(entity, inclusionEdge.data().targetLabel === 'C');
                        }
                    }
                });
                ontology.addHierarchy(hierarchy);
            });
            // let subclassNodes: NodeCollection, subclassEntity: GrapholEntity | undefined, subclassesSet: Set<GrapholEntity> | undefined
            // representation.cy.$(`[type = "${TypesEnum.CLASS}"]`).forEach(classNode => {
            //   subclassNodes = classNode.incomers(`[type = "${TypesEnum.INCLUSION}"]`).targets()
            //   subclassNodes.forEach(subclassNode => {
            //     if (subclassNode.data().iri) {
            //       subclassEntity = ontology.getEntity(subclassNode.data().iri)
            //       if (subclassEntity) {
            //         subclassesSet = ontology.subclasses.get(classNode.data().iri)
            //         if (!subclassesSet) {
            //           ontology.subclasses.set(classNode.data().iri, new Set())
            //           subclassesSet = ontology.subclasses.get(classNode.data().iri)
            //         }
            //         subclassesSet?.add(subclassEntity)
            //       }
            //     }
            //   })
            // })
        }
    }
}

cytoscape.use(automove);
const lock_open = '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/></svg>';
class FloatyRendererState extends BaseRenderer {
    constructor() {
        super(...arguments);
        this.id = RendererStatesEnum.FLOATY;
        this.filterManager = new FloatyFilterManager();
        this.centeringOnElem = false;
        this.grabHandler = (e) => {
            if (this.dragAndPin)
                e.target.data('old_pos', JSON.stringify(e.target.position()));
        };
        this.freeHandler = (e) => {
            if (this.dragAndPin) {
                let current_pos = JSON.stringify(e.target.position());
                if (e.target.data('old_pos') !== current_pos) {
                    this.pinNode(e.target);
                }
                e.target.removeData('old_pos');
            }
        };
        this.automoveOptions = {
            nodesMatching: (node) => {
                var _a;
                return !this.layoutRunning &&
                    ((_a = this.renderer.cy) === null || _a === void 0 ? void 0 : _a.$(':grabbed').neighborhood(`[type = "${TypesEnum.DATA_PROPERTY}"],[[degree = 1]]`).has(node));
            },
            reposition: 'drag',
            dragWith: `[type ="${TypesEnum.CLASS}"][iri]`
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
        computeHierarchies(ontology);
    }
    postOntologyTransform(grapholscape) {
        FloatyTransformer.addAnnotationPropertyEdges(grapholscape);
    }
    runLayout() {
        var _a;
        if (!this.renderer.cy)
            return;
        (_a = this._layout) === null || _a === void 0 ? void 0 : _a.stop();
        this._layout = this.renderer.cy.elements().layout(this.floatyLayoutOptions);
        this._layout.one('layoutstop', (e) => {
            if (e.layout === this._layout) // only if layout has not changed
                this.layoutRunning = false;
        });
        this._layout.run();
        this.layoutRunning = true;
    }
    render() {
        var _a, _b;
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
        new DiagramColorManager(this.renderer.diagram.representations.get(this.id)).colorDiagram();
        if (!floatyRepresentation.hasEverBeenRendered) {
            // this.floatyLayoutOptions.fit = true
            this.renderer.fit();
            this.runLayout();
            this.popperContainers.set(this.renderer.diagram.id, document.createElement('div'));
            this.setDragAndPinEventHandlers();
            this.renderer.cy.automove(this.automoveOptions);
        }
        if (floatyRepresentation.lastViewportState) {
            (_a = this.renderer.cy) === null || _a === void 0 ? void 0 : _a.viewport(floatyRepresentation.lastViewportState);
        }
        if (this.popperContainer)
            (_b = this.renderer.cy.container()) === null || _b === void 0 ? void 0 : _b.appendChild(this.popperContainer);
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
        if (this.renderer.diagram) {
            const floaty = this.renderer.diagram.representations.get(this.id);
            if (floaty) {
                floaty.lastViewportState = this.renderer.viewportState;
            }
        }
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
    pinNode(nodeOrId) {
        if (!nodeOrId || !this.renderer.cy)
            return;
        let node;
        if (typeof (nodeOrId) === 'string') {
            node = this.renderer.cy.$id(nodeOrId);
        }
        else {
            node = nodeOrId;
        }
        if (node.data().pinner)
            return;
        node.lock();
        node.data("pinned", true);
        let n = node;
        n.unlockButton = node.popper({
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
        let dimension = node.width() / 9 * this.renderer.cy.zoom();
        this.setPopperStyle(dimension, unlockButton.state.elements.popper);
        unlockButton.update();
    }
    unpinNode(nodeOrId) {
        if (!nodeOrId || !this.renderer.cy)
            return;
        let node;
        if (typeof (nodeOrId) === 'string') {
            node = this.renderer.cy.$id(nodeOrId);
        }
        else {
            node = nodeOrId;
        }
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
    get defaultLayoutOptions() {
        return {
            name: 'cola',
            avoidOverlap: false,
            edgeLength: function (edge) {
                let crowdnessFactor = edge.target().neighborhood(`[type = "${TypesEnum.OBJECT_PROPERTY}"]`).length +
                    edge.source().neighborhood(`[type = "${TypesEnum.OBJECT_PROPERTY}"]`).length;
                crowdnessFactor = crowdnessFactor > 5 ? crowdnessFactor * 10 : 0;
                if (edge.hasClass('role')) {
                    return 250 + edge.data('displayedName').length * 4 + crowdnessFactor;
                }
                else if (edge.target().data('type') == TypesEnum.DATA_PROPERTY ||
                    edge.source().data('type') == TypesEnum.DATA_PROPERTY)
                    return 150;
                else {
                    return 200 + crowdnessFactor;
                }
            },
            fit: false,
            maxSimulationTime: 4000,
            infinite: false,
            handleDisconnected: true,
            centerGraph: false,
        };
    }
    centerOnElementById(elementId, zoom, select) {
        const cy = this.renderer.cy;
        if (!cy || (!zoom && zoom !== 0))
            return;
        const cyElement = cy.$id(elementId).first();
        zoom = zoom > cy.maxZoom() ? cy.maxZoom() : zoom;
        if (cyElement.empty()) {
            console.warn(`Element id (${elementId}) not found. Please check that this is the correct diagram`);
        }
        else {
            const performAnimation = () => {
                cy.animate({
                    center: {
                        eles: cyElement
                    },
                    zoom: zoom,
                    queue: false,
                });
                if (select && cy.$(':selected') !== cyElement) {
                    this.renderer.unselect();
                    cyElement.select();
                }
            };
            if (this.layoutRunning) {
                if (!cyElement.data().pinned) {
                    // keep element centered while layout runs
                    cyElement.isNode() ? cyElement.lock() : cyElement.connectedNodes().lock();
                }
                performAnimation();
                if (this.isLayoutInfinite) {
                    // run layout not fitting it, avoid conflict with fitting view on element
                    this.floatyLayoutOptions.infinite = false;
                    this.runLayout();
                    this.layout.one('layoutstop', (layoutEvent) => {
                        if (layoutEvent.layout === this.layout) {
                            if (!cyElement.data().pinned) {
                                cyElement.isNode() ? cyElement.unlock() : cyElement.connectedNodes().unlock();
                            }
                            // wait for layout to stop and restore previous conditions
                            this.runLayoutInfinitely();
                        }
                        else {
                            this.centerOnElementById(elementId, zoom, select);
                        }
                    });
                }
                else {
                    this.layout.one('layoutstop', (layoutEvent) => {
                        if (layoutEvent.layout === this.layout) {
                            if (!cyElement.data().pinned) {
                                cyElement.isNode() ? cyElement.unlock() : cyElement.connectedNodes().unlock();
                            }
                        }
                        else {
                            this.centerOnElementById(elementId, zoom, select);
                        }
                    });
                }
            }
            else {
                performAnimation();
            }
        }
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

/**
 * Incremental should not allow any filter and widgtet should not even be visible
 */
class IncrementalFilterManager extends BaseFilterManager {
    constructor() {
        super(...arguments);
        this.lockedFilters = Object.keys(RDFGraphConfigFiltersEnum).map(k => RDFGraphConfigFiltersEnum[k]);
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
            selector: `node[type = "${TypesEnum.INDIVIDUAL}"]`,
            style: {
                'text-valign': 'top',
                'text-wrap': 'ellipsis',
                'text-max-width': 180,
            }
        },
        {
            selector: `edge[type = "${TypesEnum.INSTANCE_OF}"]`,
            style: {
                "target-arrow-shape": 'triangle',
                'target-arrow-fill': 'filled',
                'line-color': theme.getColour(ColoursNames.individual_contrast),
                'target-arrow-color': theme.getColour(ColoursNames.individual_contrast),
                'line-opacity': 0.4,
            }
        },
        {
            selector: `.unknown-parent-class`,
            style: {
                backgroundColor: theme.getColour(ColoursNames.neutral),
                opacity: 0.6,
            }
        },
        {
            selector: '.path',
            style: {
                'underlay-opacity': 0.5,
                'underlay-color': theme.getColour(ColoursNames.success_subtle),
                'underlay-shape': 'ellipse'
            }
        },
        {
            selector: '.loading-edge',
            style: {
                width: 4,
                "line-color": theme.getColour(ColoursNames.neutral),
                "transition-property": "line-color target-arrow-color",
                "transition-duration": '0.5s',
                'text-rotation': 'autorotate',
                'target-arrow-color': theme.getColour(ColoursNames.neutral),
                'font-size': 12,
                'text-background-color': theme.getColour(ColoursNames.bg_graph),
                label: 'Loading...',
            }
        },
        {
            selector: '.loading-edge[?on]',
            style: {
                "line-color": theme.getColour(ColoursNames.accent),
                "target-arrow-color": theme.getColour(ColoursNames.accent)
            }
        },
        {
            selector: '.eh-ghost-edge, edge.eh-preview',
            style: {
                'width': 4,
                'label': 'Find shortest paths to...',
                'line-color': theme.getColour(ColoursNames.accent),
                'target-arrow-color': theme.getColour(ColoursNames.accent),
                'target-arrow-shape': 'triangle',
                'opacity': 0.8,
                'text-rotation': 'autorotate',
            }
        },
        {
            selector: '.eh-ghost-edge.eh-preview-active',
            style: {
                'opacity': 0,
            }
        },
        {
            selector: '.eh-target, .eh-source',
            style: {
                'border-width': 4,
                'border-color': theme.getColour(ColoursNames.accent),
            }
        },
        {
            selector: '.eh-presumptive-target',
            style: {
                'opacity': 1,
            }
        },
        {
            selector: '.eh-not-target',
            style: {
                'opacity': 0.4,
            }
        },
    ];
    return baseStyle.concat(incrementalStyle);
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
        var _a, _b, _c, _d;
        if (this.renderer.diagram && ((_a = this.renderer.diagram) === null || _a === void 0 ? void 0 : _a.id) !== IncrementalDiagram.ID) {
            this.previousDiagram = this.renderer.diagram;
        }
        if (!this.renderer.diagram)
            return;
        const incrementalRepresentation = this.renderer.diagram.representations.get(this.id);
        if (!incrementalRepresentation)
            return;
        this.renderer.cy = incrementalRepresentation.cy;
        this.renderer.mount();
        if (this.renderer.diagram.lastViewportState) {
            (_b = this.renderer.cy) === null || _b === void 0 ? void 0 : _b.viewport(this.renderer.diagram.lastViewportState);
        }
        if (!incrementalRepresentation.hasEverBeenRendered) {
            this.popperContainers.set(this.renderer.diagram.id, document.createElement('div'));
            this.setDragAndPinEventHandlers();
            this.renderer.cy.automove(this.automoveOptions);
        }
        if (this.popperContainer) {
            (_d = (_c = this.renderer.cy) === null || _c === void 0 ? void 0 : _c.container()) === null || _d === void 0 ? void 0 : _d.appendChild(this.popperContainer);
        }
        incrementalRepresentation.hasEverBeenRendered = true;
    }
    runLayout() {
        super.runLayout();
        if (this.isLayoutInfinite) {
            this.unFreezeGraph();
        }
        else {
            this.layout.one('layoutstop', (e) => {
                var _a, _b;
                if (((_b = (_a = this.renderer.diagram) === null || _a === void 0 ? void 0 : _a.representations.get(this.id)) === null || _b === void 0 ? void 0 : _b.grapholElements.size) === 1)
                    this.renderer.fit();
                if (e.layout === this._layout)
                    this.unFreezeGraph();
            });
        }
    }
    runCustomLayout(cyLayoutOptions) {
        if (!this.layoutRunning) {
            Object.assign(this.floatyLayoutOptions, cyLayoutOptions);
        }
        this.runLayout();
        this.floatyLayoutOptions = this.defaultLayoutOptions;
    }
    /** lock all nodes */
    freezeGraph() {
        var _a;
        if (!this.layoutRunning)
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
        var _a;
        // Perform floaty transformation if it has not been done yet
        if (!((_a = ontology.diagrams[0]) === null || _a === void 0 ? void 0 : _a.representations.get(RendererStatesEnum.FLOATY))) {
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
    reset() {
        var _a, _b;
        if ((_a = this.renderer.diagram) === null || _a === void 0 ? void 0 : _a.id) {
            (_b = this.popperContainers.get(this.renderer.diagram.id)) === null || _b === void 0 ? void 0 : _b.childNodes.forEach(c => c.remove());
        }
        this.render();
    }
    filter(elementId, filter) {
        if (this.renderer.cy) {
            const element = this.renderer.cy.$id(elementId);
            if (!element.scratch('filterTags')) {
                element.scratch('filterTags', new Set());
            }
            const elemFilterTags = element.scratch('filterTags');
            elemFilterTags.add(filter.filterTag);
            element.addClass('filtered');
            // ARCHI IN USCITA
            element.outgoers('edge').forEach(e => {
                if (e.data('type') === TypesEnum.INPUT) {
                    this.filter(e.target().id(), filter);
                }
            });
            // ARCHI IN ENTRATA
            element.incomers('edge').forEach(e => {
                let neighbour = e.source();
                switch (e.data().type) {
                    case TypesEnum.UNION:
                    case TypesEnum.DISJOINT_UNION:
                    case TypesEnum.COMPLETE_UNION:
                    case TypesEnum.COMPLETE_DISJOINT_UNION:
                        this.filter(neighbour.id(), filter);
                }
            });
        }
    }
    unfilter(elementId, filter) {
        if (!this.renderer.cy)
            return;
        const element = this.renderer.cy.$id(elementId);
        let elemFilterTags = element.scratch('filterTags');
        if (element.hasClass('filtered') && (elemFilterTags === null || elemFilterTags === void 0 ? void 0 : elemFilterTags.has(filter.filterTag))) {
            elemFilterTags.delete(filter.filterTag);
            if (elemFilterTags.size === 0) {
                element.removeClass('filtered');
            }
        }
        this.renderer.cy.nodes().forEach(elem => {
            elemFilterTags = elem.scratch('filterTags');
            if (elemFilterTags === null || elemFilterTags === void 0 ? void 0 : elemFilterTags.has(filter.filterTag)) {
                elemFilterTags.delete(filter.filterTag);
                if (elemFilterTags.size === 0) {
                    elem.removeClass('filtered');
                }
            }
        });
    }
    get popperContainer() {
        return this.popperContainers.get(IncrementalDiagram.ID);
    }
    set renderer(newRenderer) {
        super.renderer = newRenderer;
        if (!newRenderer.renderStateData[this.id]) {
            newRenderer.renderStateData[this.id] = {};
        }
        // this.floatyLayoutOptions = this.defaultLayoutOptions
        // this.floatyLayoutOptions.fit = false
        // this.floatyLayoutOptions.maxSimulationTime = 1000
        // this.floatyLayoutOptions.edgeLength = function (edge: EdgeSingular) {
        //   let crowdnessFactor =
        //     edge.target().neighborhood(`[type = "${TypesEnum.OBJECT_PROPERTY}"]`).length +
        //     edge.source().neighborhood(`[type = "${TypesEnum.OBJECT_PROPERTY}"]`).length
        //   crowdnessFactor = crowdnessFactor > 5 ? crowdnessFactor * 2 : 0
        //   const nameLength = edge.data('displayedName')?.length * 5 || 0
        //   return 140 + crowdnessFactor + nameLength
        // }
        // this.floatyLayoutOptions.avoidOverlap = true
        // this.floatyLayoutOptions.randomize = true
        // this.floatyLayoutOptions.centerGraph = true
        // this.floatyLayoutOptions.boundingBox = {
        //   x1: 0,
        //   y1: 0,
        //   w: 500,
        //   h: 500
        // }
        // this.floatyLayoutOptions.flow = { axis: 'x', minSeparation: 100 }
    }
    get renderer() {
        return super.renderer;
    }
    get defaultLayoutOptions() {
        return {
            name: 'cola',
            avoidOverlap: true,
            edgeLength: function (edge) {
                var _a;
                let crowdnessFactor = edge.target().neighborhood(`[type = "${TypesEnum.OBJECT_PROPERTY}"]`).length +
                    edge.source().neighborhood(`[type = "${TypesEnum.OBJECT_PROPERTY}"]`).length;
                crowdnessFactor = crowdnessFactor > 5 ? crowdnessFactor * 2 : 0;
                const nameLength = ((_a = edge.data('displayedName')) === null || _a === void 0 ? void 0 : _a.length) * 5 || 0;
                return 140 + crowdnessFactor + nameLength;
            },
            fit: false,
            maxSimulationTime: 1000,
            infinite: false,
            handleDisconnected: true,
            centerGraph: false,
        };
    }
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
                    const grapholEntity = ontology.getEntity(e.target.data().iri) || (ontology.ontologyEntity.iri.equals(e.target.data().iri) && ontology.ontologyEntity);
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
        cy.on('cxttap', evt => lifecycle.trigger(LifecycleEvent.ContextClick, evt));
        cy.on('dbltap', evt => lifecycle.trigger(LifecycleEvent.DoubleTap, evt));
        cy.on('mouseover', '*', e => {
            const container = cy.container();
            if (container) {
                container.style.cursor = 'pointer';
            }
        });
        cy.on('mouseover', evt => lifecycle.trigger(LifecycleEvent.MouseOver, evt));
        cy.on('mouseout', '*', e => {
            const container = cy.container();
            if (container) {
                container.style.cursor = 'inherit';
            }
        });
        cy.on('mouseout', evt => lifecycle.trigger(LifecycleEvent.MouseOut, evt));
        cy.scratch('_gscape-graph-handlers-set', true);
    });
}

/**
 * @internal
 */
class ThemeManager {
    constructor(grapholscape) {
        this.themes = new Set(Object.values(DefaultThemes));
        this._grapholscape = grapholscape;
    }
    setTheme(newThemeId) {
        const newTheme = Array.from(this.themes).find(t => t.id === newThemeId);
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
        this.themes.add(newTheme);
    }
    removeTheme(theme) {
        this.themes.delete(theme);
    }
    removeThemes() {
        this.themes.clear();
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

/** @internal */
var IncrementalEvent;
(function (IncrementalEvent) {
    IncrementalEvent["RequestStopped"] = "requestStopped";
    IncrementalEvent["NewInstances"] = "newInstances";
    IncrementalEvent["InstancesSearchFinished"] = "instancesSearchFinished";
    IncrementalEvent["LimitChange"] = "limitChange";
    IncrementalEvent["EndpointChange"] = "endpointChange";
    IncrementalEvent["Reset"] = "reset";
    IncrementalEvent["ClassInstanceSelection"] = "classInstanceSselection";
    IncrementalEvent["ClassSelection"] = "classSelection";
    IncrementalEvent["ContextClick"] = "contextClick";
    IncrementalEvent["DoubleTap"] = "doubleTap";
    IncrementalEvent["DiagramUpdated"] = "diagramUpdated";
    IncrementalEvent["ReasonerSet"] = "reasonerSet";
    IncrementalEvent["NewDataPropertyValues"] = "newDataPropertyValues";
    IncrementalEvent["DataPropertyValuesLoadingFinished"] = "dpvaluesloadfinish";
})(IncrementalEvent || (IncrementalEvent = {}));
/** @internal */
class IncrementalLifecycle {
    constructor() {
        this.requestStopped = [];
        // private newInstances: ((classInstances: ClassInstance[][], numberResultsAvailable?: number) => void)[] = []
        this.instancesSearchFinished = [];
        this.limitChange = [];
        // private endpointChange: ((endpoint: MastroEndpoint) => void)[] = []
        this.reset = [];
        this.classSelection = [];
        this.diagramUpdated = [];
        this.reasonerSet = [];
        this.newDataPropertyValues = [];
        this.dpvaluesloadfinish = [];
        this.on = (event, callback) => {
            this[event].push(callback);
        };
    }
    trigger(event, ...params) {
        this[event].forEach((callback) => callback(...params));
    }
}

function parseRDFGraph(rdfGraph) {
    const rendererState = rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY
        ? RendererStatesEnum.FLOATY
        : RendererStatesEnum.INCREMENTAL;
    const ontology = getOntology(rdfGraph);
    ontology.entities = getEntities(rdfGraph, ontology.namespaces);
    // const classInstances = getClassInstances(rdfGraph, ontology.namespaces)
    // let incrementalDiagram: IncrementalDiagram
    if (rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY) {
        ontology.diagrams = getDiagrams(rdfGraph, rendererState, ontology.entities);
        computeHierarchies(ontology);
    }
    //if (rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY)
    //  ontology.diagrams = parsedDiagrams
    //else
    //  incrementalDiagram = parsedDiagrams[0] as IncrementalDiagram
    // const grapholscape = new Grapholscape(ontology, container, getConfig(rdfGraph))
    // if (grapholscape.incremental)
    //   grapholscape.incremental.classInstanceEntities = classInstances
    updateEntityOccurrences(ontology);
    // rdfGraph.config?.filters?.forEach(f => {
    //   if (Object.values(DefaultFilterKeyEnum).includes(f)) {
    //     grapholscape.filter(f)
    //   }
    // })
    return ontology;
}
function updateEntityOccurrences(ontology) {
    ontology.diagrams.forEach(parsedDiagram => {
        parsedDiagram.representations.forEach((representation, rendererState) => {
            representation.grapholElements.forEach(elem => {
                var _a;
                if (elem.iri) {
                    (_a = ontology.getEntity(elem.iri)) === null || _a === void 0 ? void 0 : _a.addOccurrence(elem, rendererState);
                }
            });
        });
    });
}
function getOntology(rdfGraph) {
    let ontology;
    ontology = new Ontology(rdfGraph.metadata.name || '', rdfGraph.metadata.version || '', rdfGraph.metadata.iri, rdfGraph.metadata.namespaces.map(n => new Namespace(n.prefixes, n.value)));
    if (rdfGraph.metadata.languages) {
        ontology.languages = rdfGraph.metadata.languages;
    }
    ontology.defaultLanguage = rdfGraph.metadata.defaultLanguage;
    if (rdfGraph.metadata.annotations) {
        ontology.annotations = getAnnotations(rdfGraph.metadata, ontology.namespaces);
    }
    if (rdfGraph.metadata.annotationProperties) {
        ontology.annProperties = rdfGraph.metadata.annotationProperties.map(annProp => new AnnotationProperty(annProp, ontology.namespaces));
    }
    return ontology;
}
function getEntities(rdfGraph, namespaces) {
    let iri;
    const entities = new Map();
    let entity;
    rdfGraph.entities.forEach(e => {
        iri = new Iri(e.fullIri, namespaces);
        entity = GrapholEntity.newFromSwagger(iri, e);
        entity.annotations = getAnnotations(e, namespaces);
        entities.set(iri.fullIri, entity);
    });
    return entities;
}
/** @internal */
function getClassInstances(rdfGraph, namespaces) {
    var _a;
    const classInstances = new Map();
    let classInstance;
    (_a = rdfGraph.classInstanceEntities) === null || _a === void 0 ? void 0 : _a.forEach(ci => {
        var _a;
        let iri = new Iri(ci.fullIri, [], ci.shortIri);
        let parentClassesIris = ((_a = ci.parentClasses) === null || _a === void 0 ? void 0 : _a.map(p => new Iri(p, namespaces))) || [];
        classInstance = new ClassInstanceEntity(iri, parentClassesIris);
        classInstance.annotations = getAnnotations(ci, namespaces);
        if (ci.dataProperties)
            classInstance.dataProperties = ci.dataProperties;
        classInstances.set(iri.fullIri, classInstance);
    });
    return classInstances;
}
function getAnnotations(annotatedElem, namespaces) {
    var _a;
    return ((_a = annotatedElem.annotations) === null || _a === void 0 ? void 0 : _a.map(a => {
        const annotationProperty = Object.values(DefaultAnnotationProperties).find(property => {
            return property.equals(a.property);
        }) || new Iri(a.property, namespaces);
        return new Annotation(annotationProperty, a.lexicalForm || a.value, a.language, a.datatype);
    })) || [];
}
function getDiagrams(rdfGraph, rendererState = RendererStatesEnum.GRAPHOL, entities, namespaces) {
    let diagram;
    let diagramRepr;
    let grapholEntity;
    let grapholElement;
    const diagrams = [];
    rdfGraph.diagrams.forEach(d => {
        var _a, _b;
        if (d.id === -1 && rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY) {
            if (rendererState !== RendererStatesEnum.INCREMENTAL && rendererState !== RendererStatesEnum.FLOATY)
                return;
            diagram = new AnnotationsDiagram();
        }
        else {
            diagram = rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY ? new Diagram(d.name, d.id) : new IncrementalDiagram();
        }
        diagramRepr = diagram.representations.get(rendererState);
        if (!diagramRepr) {
            diagramRepr = new DiagramRepresentation(floatyOptions);
            diagram.representations.set(rendererState, diagramRepr);
        }
        // Nodes
        (_a = d.nodes) === null || _a === void 0 ? void 0 : _a.forEach(n => {
            var _a, _b;
            grapholEntity = undefined;
            grapholElement = GrapholNode.newFromSwagger(n);
            if (grapholElement.is(TypesEnum.CLASS_INSTANCE)) {
                grapholElement.type = TypesEnum.INDIVIDUAL;
            }
            grapholElement.diagramId = d.id;
            if (grapholElement.iri) {
                grapholEntity = entities.get(grapholElement.iri);
                if (!grapholEntity && namespaces) {
                    grapholEntity = new GrapholEntity(new Iri(grapholElement.iri, namespaces));
                }
                grapholElement.displayedName = (grapholEntity === null || grapholEntity === void 0 ? void 0 : grapholEntity.getDisplayedName(((_a = rdfGraph.config) === null || _a === void 0 ? void 0 : _a.entityNameType) || RDFGraphConfigEntityNameTypeEnum.LABEL, ((_b = rdfGraph.config) === null || _b === void 0 ? void 0 : _b.language) || rdfGraph.metadata.defaultLanguage || Language.EN)) || grapholElement.iri;
                if (rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY || rdfGraph.modelType === RDFGraphModelTypeEnum.VKG)
                    grapholEntity === null || grapholEntity === void 0 ? void 0 : grapholEntity.addOccurrence(grapholElement, rendererState);
            }
            diagramRepr.addElement(grapholElement, grapholEntity);
        });
        // Edges
        (_b = d.edges) === null || _b === void 0 ? void 0 : _b.forEach(e => {
            var _a, _b;
            if (!e.id) {
                e.id = diagramRepr.getNewId('edge');
            }
            grapholEntity = undefined;
            grapholElement = GrapholEdge.newFromSwagger(e);
            grapholElement.diagramId = d.id;
            if (grapholElement.iri) {
                grapholEntity = entities.get(grapholElement.iri);
                grapholElement.displayedName = grapholEntity === null || grapholEntity === void 0 ? void 0 : grapholEntity.getDisplayedName(((_a = rdfGraph.config) === null || _a === void 0 ? void 0 : _a.entityNameType) || RDFGraphConfigEntityNameTypeEnum.LABEL, ((_b = rdfGraph.config) === null || _b === void 0 ? void 0 : _b.language) || rdfGraph.metadata.defaultLanguage || Language.EN);
                if (rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY || rdfGraph.modelType === RDFGraphModelTypeEnum.VKG)
                    grapholEntity === null || grapholEntity === void 0 ? void 0 : grapholEntity.addOccurrence(grapholElement, rendererState);
            }
            diagramRepr.addElement(grapholElement, grapholEntity);
        });
        if (d.lastViewportState !== undefined && d.lastViewportState !== null) {
            const diagramRepr = diagram.representations.get(rendererState);
            if (diagramRepr) {
                diagramRepr.lastViewportState = d.lastViewportState;
            }
        }
        diagrams[diagram.id] = diagram;
    });
    return diagrams;
}
function getConfig(rdfGraph) {
    var _a, _b, _c, _d, _e;
    let themes;
    if ((_a = rdfGraph.config) === null || _a === void 0 ? void 0 : _a.themes) {
        themes = rdfGraph.config.themes.map(t => new GrapholscapeTheme(t.id, t.colours, t.name));
    }
    return {
        themes: themes,
        selectedTheme: (_b = rdfGraph.config) === null || _b === void 0 ? void 0 : _b.selectedTheme,
        selectedRenderer: rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY
            ? RendererStatesEnum.FLOATY
            : RendererStatesEnum.INCREMENTAL,
        language: (_c = rdfGraph.config) === null || _c === void 0 ? void 0 : _c.language,
        entityNameType: (_d = rdfGraph.config) === null || _d === void 0 ? void 0 : _d.entityNameType,
        renderers: (_e = rdfGraph.config) === null || _e === void 0 ? void 0 : _e.renderers,
    };
}

var rdfGraphParser = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: parseRDFGraph,
    getClassInstances: getClassInstances,
    getConfig: getConfig,
    getDiagrams: getDiagrams,
    getEntities: getEntities,
    getOntology: getOntology,
    updateEntityOccurrences: updateEntityOccurrences
});

class Grapholscape {
    constructor() {
        this.renderer = new Renderer();
        this.lifecycle = new Lifecycle();
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
    }
    // ----------------------------- RENDERER ----------------------------- //
    /**
     * Show a certain diagram by its ID
     * @param diagramId the diagram's id to display
     * @param viewportState set a custom {@link !model.Viewport}, if not set, last one available will be used
     */
    showDiagram(diagramId, viewportState) {
        var _a, _b;
        const diagram = this.ontology.getDiagram(diagramId);
        if (!diagram) {
            console.warn(`Can't find any diagram with id="${diagramId}"`);
            return;
        }
        if (this.renderState && !((_b = (_a = diagram.representations) === null || _a === void 0 ? void 0 : _a.get(this.renderState)) === null || _b === void 0 ? void 0 : _b.hasEverBeenRendered)) {
            setGraphEventHandlers(diagram, this.lifecycle, this.ontology);
        }
        if (viewportState)
            diagram.lastViewportState = viewportState;
        this.renderer.render(diagram);
    }
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
    setRenderer(newRenderState) {
        var _a, _b, _c, _d;
        const shouldUpdateEntities = (this.diagramId !== 0 && !this.diagramId) || !((_a = this.ontology.getDiagram(this.diagramId)) === null || _a === void 0 ? void 0 : _a.representations.get(newRenderState.id)) ? true : false;
        const shouldTransformOntology = !((_b = this.ontology.diagrams[0]) === null || _b === void 0 ? void 0 : _b.representations.get(newRenderState.id));
        if (shouldTransformOntology) {
            newRenderState.transformOntology(this.ontology);
        }
        if (this.renderer.diagram && !((_d = (_c = this.renderer.diagram) === null || _c === void 0 ? void 0 : _c.representations.get(newRenderState.id)) === null || _d === void 0 ? void 0 : _d.hasEverBeenRendered))
            setGraphEventHandlers(this.renderer.diagram, this.lifecycle, this.ontology);
        this.renderer.renderState = newRenderState;
        if (shouldUpdateEntities)
            this.entityNavigator.updateEntitiesOccurrences();
        if (shouldTransformOntology) {
            newRenderState.postOntologyTransform(this);
        }
        this.lifecycle.trigger(LifecycleEvent.RendererChange, newRenderState.id);
    }
    /**
     * Center the viewport on a single element.
     * @remarks
     * If you specify a different diagram from the current one, it will be displayed
     * @param elementId the element's id (can be a node or an edge)
     * @param diagramId the diagram's id (**default**: the current one)
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
     * If you specify a different diagram from the current one, it will be displayed
     * @param elementId the element's id (can be a node or an edge)
     * @param diagramId the diagram's id (**default**: the current one)
     */
    selectElement(elementId, diagramId) {
        if ((diagramId || diagramId === 0) && this.diagramId !== diagramId)
            this.showDiagram(diagramId);
        this.renderer.selectElement(elementId);
    }
    /** Unselect any selected element in the current diagram */
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
     * It will be currently applied only if the user defined callback on the event
     * {@link !model.LifecycleEvent.FilterRequest} returns true and if the internal logic
     * allows for the filter to be applied.
     * @param filter the filter to apply, can be an object of type {@link !model.Filter}, {@link !model.DefaultFilterKeyEnum}
     * or a string representing the unique key of a defined filter
     */
    filter(filter) { this.renderer.filter(filter); }
    /**
     * Unfilter elements on the diagram.
     * @remarks
     * It will be currently deactivated only if the user defined callback on the event
     * {@link !model.LifecycleEvent.FilterRequest} returns true and if the internal logic
     * allows for the filter to be deactivated.
     * @param filter the filter to disable, can be an object of type {@link !model.Filter}, {@link !model.DefaultFilterKeyEnum}
     * or a string representing the unique key of a defined filter
     */
    unfilter(filter) { this.renderer.unfilter(filter); }
    /** The current diagram's id */
    get diagramId() {
        var _a;
        return (_a = this.renderer.diagram) === null || _a === void 0 ? void 0 : _a.id;
    }
    /** The current renderer state */
    get renderState() {
        var _a;
        return (_a = this.renderer.renderState) === null || _a === void 0 ? void 0 : _a.id;
    }
    /** The current selected Entity */
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
     * Center viewport on a single entity occurrence given its IRI
     * @param iri the iri of the entity to find and center on
     * @param diagramId the diagram containing the entity.
     * If not specified, the first entity occurrence in any diagram will be used.
     * @param zoom the level of zoom to apply.
     * If not specified, zoom level won't be changed.
     */
    centerOnEntity(iri, diagramId, zoom) {
        this.entityNavigator.centerOnEntity(iri, diagramId, zoom);
    }
    /**
     * Center viewport on a single entity occurrence and selects it given its IRI
     * @param iri the iri of the entity to find and center on
     * @param diagramId the diagram containing the entity.
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
    /** The current selected language */
    get language() { return this.displayedNamesManager.language; }
    /** The current selected entity name type (label, full iri or prefixed iri) */
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
     * @experimental
     */
    addTheme(newTheme) {
        this.themesManager.addTheme(newTheme);
    }
    /**
     * @ignore
     * // TODO: make this method update settings widget before publishing in docs
     * Remove a theme in the list of available themes
     * @param newTheme the new theme
     * @experimental
     */
    removeTheme(newTheme) {
        this.themesManager.removeTheme(newTheme);
    }
    /** The current theme used by Grapholscape */
    get theme() { return this.themesManager.theme; }
    /** The available themes for this Grapholscape instance */
    get themeList() { return Array.from(this.themesManager.themes); }
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
     * @privateRemarks // TODO: Be sure this method reflects on UI before publishing it in to the docs
     * Apply a new custom configuration
     * @param newConfig the config object to apply
     * @experimental
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
     * Export current diagram and download it as a PNG image.
     * @param fileName custom file name. Defaults to {@link exportFileName}
     */
    exportToPng(fileName = this.exportFileName) {
        fileName += '.png';
        toPNG(fileName, this.renderer.cy, this.theme.getColour(ColoursNames.bg_graph));
    }
    /**
     * Export current diagram and download it as an SVG.
     * @param fileName custom file name. Defaults to {@link exportFileName}
     */
    exportToSvg(fileName = this.exportFileName) {
        fileName += '.svg';
        toSVG(fileName, this.renderer.cy, this.theme.getColour(ColoursNames.bg_graph));
    }
    /**
     * Export current ontology as an RDFGraph.
     * RDFGraph is a JSON serialization of grapholscape's model.
     * Useful to resume a previous state.
     * @returns RDFGraph representation of this grapholscape instance's model.
     */
    exportToRdfGraph() {
        return rdfgraphSerializer(this);
    }
    resume(rdfGraph) {
        if (!this.renderState || (this.renderState !== RendererStatesEnum.FLOATY && this.renderState !== RendererStatesEnum.INCREMENTAL)) {
            return;
        }
        // Stop layout, use positions from rdfGraph, for floaty/incremental
        this.renderer.stopRendering();
        if (rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY) {
            if (rdfGraph.selectedDiagramId !== undefined) {
                const diagram = this.ontology.getDiagram(rdfGraph.selectedDiagramId);
                if (diagram) {
                    /**
                     * showDiagram won't set event handlers on this diagram cause it results already
                     * been rendered once, but in previous session, not yet in the current one.
                     * Force setting them here.
                     */
                    setGraphEventHandlers(diagram, this.lifecycle, this.ontology);
                    const floatyRepr = diagram.representations.get(RendererStatesEnum.FLOATY);
                    if (floatyRepr)
                        floatyRepr.hasEverBeenRendered = false;
                    this.showDiagram(diagram.id, floatyRepr === null || floatyRepr === void 0 ? void 0 : floatyRepr.lastViewportState);
                }
            }
        }
        else {
            const allEntities = new Map(Array.from(this.ontology.entities)
                .concat(Array.from(getClassInstances(rdfGraph, this.ontology.namespaces))));
            this.ontology.entities = allEntities;
            const diagramRepr = getDiagrams(rdfGraph, RendererStatesEnum.INCREMENTAL, allEntities, this.ontology.namespaces)[IncrementalDiagram.ID].representations.get(RendererStatesEnum.INCREMENTAL);
            if (diagramRepr) {
                // this.incremental.diagram = new IncrementalDiagram()
                if (diagramRepr.lastViewportState) {
                    this._incremental.diagram.lastViewportState = diagramRepr.lastViewportState;
                }
                this._incremental.diagram.representations.set(RendererStatesEnum.INCREMENTAL, diagramRepr);
                diagramRepr.hasEverBeenRendered = false;
                // Diagram (representation) has been changed, set event handlers again
                this._incremental.setIncrementalEventHandlers();
                // Diagram representation has been changed, set nodes button event handlers
                // NodeButtonsFactory(this.incremental)
                new OntologyColorManager(this.ontology, diagramRepr).colorEntities(allEntities);
                this._incremental.showDiagram(rdfGraph.diagrams[0].lastViewportState);
                this._incremental.lifecycle.trigger(IncrementalEvent.DiagramUpdated);
            }
        }
    }
    /**
     * Filename for exports.
     * String in the form: "[ontology name]-[diagram name]-v[ontology version]"
     */
    get exportFileName() {
        var _a;
        return `${this.ontology.name}-${(_a = this.renderer.diagram) === null || _a === void 0 ? void 0 : _a.name}-v${this.ontology.version}`;
    }
    get incremental() {
        return this._incremental;
    }
    set incremental(incrementalController) {
        this._incremental = incrementalController;
        this._incremental.init();
    }
}
class Core extends Grapholscape {
    constructor(ontology, container, config) {
        super();
        this.availableRenderers = [
            RendererStatesEnum.GRAPHOL,
            RendererStatesEnum.GRAPHOL_LITE,
            RendererStatesEnum.FLOATY,
            RendererStatesEnum.INCREMENTAL
        ];
        this.entityNavigator = new EntityNavigator(this);
        this.displayedNamesManager = new DisplayedNamesManager(this);
        this.themesManager = new ThemeManager(this);
        this.ontology = ontology;
        this.container = container;
        this.renderer.container = container;
        this.renderer.lifecycle = this.lifecycle;
        this.themesManager = new ThemeManager(this);
        //this.renderer.renderState = new GrapholRendererState()
        if (!(config === null || config === void 0 ? void 0 : config.selectedTheme)) {
            this.themesManager.setTheme(DefaultThemesEnum.GRAPHOLSCAPE);
        }
        if (config) {
            this.setConfig(config);
        }
    }
}

class DiagramBuilder {
    constructor(diagram, rendererState) {
        this.diagram = diagram;
        this.rendererState = rendererState;
    }
    addClass(classEntity, positionOrNode) {
        var _a, _b;
        if ((_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.containsEntity(classEntity)) {
            const nodeId = classEntity.getIdInDiagram(this.diagram.id, TypesEnum.CLASS, this.rendererState);
            return nodeId
                ? this.diagramRepresentation.grapholElements.get(nodeId)
                : undefined;
        }
        let position, classNode;
        if (positionOrNode && isGrapholNode(positionOrNode)) {
            classNode = positionOrNode;
        }
        else if (positionOrNode) {
            position = positionOrNode;
        }
        if (!classNode) {
            classNode = new GrapholNode(this.getNewId('node'), TypesEnum.CLASS);
            classNode.iri = classEntity.iri.fullIri;
            classNode.displayedName = classEntity.getDisplayedName(RDFGraphConfigEntityNameTypeEnum.LABEL);
            classNode.height = classNode.width = 80;
            if (position)
                classNode.position = position;
            else
                classNode.renderedPosition = this.getCurrentCenterPos();
            classNode.originalId = classNode.id;
            classNode.diagramId = this.diagram.id;
        }
        classEntity.addOccurrence(classNode, this.rendererState);
        (_b = this.diagramRepresentation) === null || _b === void 0 ? void 0 : _b.addElement(classNode, classEntity);
        return classNode;
    }
    addDataProperty(dataPropertyEntity, ownerEntity) {
        var _a, _b, _c, _d, _e;
        const dataPropertyNode = new GrapholNode(this.getNewId('node'), TypesEnum.DATA_PROPERTY);
        dataPropertyNode.diagramId = this.diagram.id;
        dataPropertyNode.iri = dataPropertyEntity.iri.fullIri;
        dataPropertyNode.displayedName = dataPropertyEntity.getDisplayedName(RDFGraphConfigEntityNameTypeEnum.LABEL);
        dataPropertyNode.labelXpos = 0;
        dataPropertyNode.labelYpos = -15;
        dataPropertyNode.originalId = dataPropertyNode.id;
        dataPropertyEntity.addOccurrence(dataPropertyNode, RendererStatesEnum.FLOATY);
        let ownerEntityNode;
        if (ownerEntity) {
            const ownerEntityId = ownerEntity.getIdInDiagram(this.diagram.id, TypesEnum.CLASS, this.rendererState);
            if (!ownerEntityId)
                return;
            ownerEntityNode = (_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.grapholElements.get(ownerEntityId);
            if (!ownerEntityNode)
                return;
            // Check if owner entity node has already the same data property, avoid duplicates on class
            const dpNodeAlreadyPresent = (_b = this.diagramRepresentation) === null || _b === void 0 ? void 0 : _b.cy.$id(ownerEntityNode.id).neighborhood(`[ iri = "${dataPropertyNode.iri}" ]`);
            if (dpNodeAlreadyPresent === null || dpNodeAlreadyPresent === void 0 ? void 0 : dpNodeAlreadyPresent.nonempty()) {
                return (_c = this.diagramRepresentation) === null || _c === void 0 ? void 0 : _c.grapholElements.get(dpNodeAlreadyPresent.first().id());
            }
        }
        if ((ownerEntityNode === null || ownerEntityNode === void 0 ? void 0 : ownerEntityNode.isNode()) && this.diagramRepresentation)
            dataPropertyNode.position = this.diagramRepresentation.cy.$id(ownerEntityNode.id).position();
        else
            dataPropertyNode.renderedPosition = this.getCurrentCenterPos();
        (_d = this.diagramRepresentation) === null || _d === void 0 ? void 0 : _d.addElement(dataPropertyNode, dataPropertyEntity);
        if (ownerEntityNode) {
            const dataPropertyEdge = new GrapholEdge(this.getNewId('edge'), TypesEnum.ATTRIBUTE_EDGE);
            dataPropertyEdge.diagramId = this.diagram.id;
            dataPropertyEdge.sourceId = ownerEntityNode.id;
            dataPropertyEdge.targetId = dataPropertyNode.id;
            (_e = this.diagramRepresentation) === null || _e === void 0 ? void 0 : _e.addElement(dataPropertyEdge);
        }
        return dataPropertyNode;
    }
    /**
     * Add an object property between two entities.
     * If the source and/or target entities are already present in graph, they won't be added again.
     * If there already exists an object property between them with the same IRI, the
     * edge won't be added.
     * @param objectPropertyEntity the object property entity
     * @param sourceEntity the source entity
     * @param targetEntity the target entity
     * @param nodesType the type of source and target
     * @param objectPropertyElement [optional] to use your own GrapholEdge for the object property occurrence.
     * if you don't pass this, a new GrapholEdge will be created from scratch
     * @returns
     */
    addObjectProperty(objectPropertyEntity, sourceEntity, targetEntity, nodesType, objectPropertyElement) {
        return this.addPropertyEdge(objectPropertyEntity, sourceEntity, targetEntity, nodesType, TypesEnum.OBJECT_PROPERTY, objectPropertyElement);
    }
    /**
     * Add an annotation property between two entities.
     * If the source and/or target entities are already present in graph, they won't be added again.
     * If there already exists an annotation property between them with the same IRI, the
     * edge won't be added.
     * @param annotationPropertyEdge the object property entity
     * @param sourceEntity the source entity
     * @param targetEntity the target entity
     * @param nodesType the type of source and target
     * @param annotationPropertyElement [optional] to use your own GrapholEdge for the object property occurrence.
     * if you don't pass this, a new GrapholEdge will be created from scratch
     * @returns
     */
    addAnnotationProperty(annotationPropertyEdge, sourceEntity, targetEntity, nodesType, annotationPropertyElement) {
        return this.addPropertyEdge(annotationPropertyEdge, sourceEntity, targetEntity, nodesType, TypesEnum.ANNOTATION_PROPERTY, annotationPropertyElement);
    }
    addPropertyEdge(propertyEntity, sourceEntity, targetEntity, nodesType, propertyType, propertyEdgeElement) {
        var _a;
        const sourceType = nodesType[0];
        const targetType = nodesType.length > 1 ? nodesType[1] : nodesType[0];
        // if both object property and range class are already present, do not add them again
        let sourceNode = this.getEntityCyRepr(sourceEntity, sourceType);
        let targetNode = this.getEntityCyRepr(targetEntity, targetType);
        if (sourceNode.nonempty() && targetNode.nonempty()) {
            /**
             * If the set of edges between source and target entity nodes
             * includes the property edge we want to add, then it's already present.
             * If the set of edges between source and target entity nodes
             * includes the property edge we want to add, then it's already present.
             */
            let edgesAlreadyPresent = sourceNode.edgesWith(targetNode)
                .filter(e => e.data().iri === propertyEntity.iri.fullIri);
            if (edgesAlreadyPresent.nonempty()) {
                return (_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.grapholElements.get(edgesAlreadyPresent.first().id());
            }
        }
        if (sourceNode.empty()) {
            switch (sourceType) {
                case TypesEnum.CLASS:
                    this.addClass(sourceEntity);
                    break;
                case TypesEnum.INDIVIDUAL:
                    this.addIndividual(sourceEntity);
                    break;
                case TypesEnum.DATA_PROPERTY:
                    this.addDataProperty(sourceEntity);
                    break;
            }
            sourceNode = this.getEntityCyRepr(sourceEntity, sourceType);
            if (sourceNode.empty()) {
                console.warn(`Unable to find the node that has been automatically added with IRI: ${sourceEntity.iri.fullIri}`);
                return;
            }
        }
        if (targetNode.empty()) {
            switch (targetType) {
                case TypesEnum.CLASS:
                    this.addClass(targetEntity);
                    break;
                case TypesEnum.INDIVIDUAL:
                    this.addIndividual(targetEntity);
                    break;
                case TypesEnum.DATA_PROPERTY:
                    this.addDataProperty(targetEntity);
                    break;
            }
            targetNode = this.getEntityCyRepr(targetEntity, targetType);
            if (targetNode.empty()) {
                console.warn(`Unable to find the node that has been automatically added with IRI: ${targetEntity.iri.fullIri}`);
                return;
            }
        }
        if (!this.diagramRepresentation ||
            !sourceEntity.is(sourceType) ||
            !targetEntity.is(targetType)) {
            return;
        }
        let propertyEdge;
        if (!propertyEdgeElement) {
            propertyEdge = new GrapholEdge(this.getNewId('edge'), propertyType);
            propertyEdge.displayedName = propertyEntity.getDisplayedName(RDFGraphConfigEntityNameTypeEnum.LABEL);
            propertyEdge.originalId = propertyEdge.id;
            propertyEdge.iri = propertyEntity.iri.fullIri;
        }
        else {
            propertyEdge = propertyEdgeElement;
        }
        /**
         * propertyEdge might not have the right source(target)NodeId,
         * propertyEdge might not have the right source(target)NodeId,
         * can happen loading rdfGraph in VKG having edges between instances
         * that were already present in the diagram.
         * Just set the right IDs anyway, either a custom edge was provided or not.
         */
        propertyEdge.sourceId = sourceNode.id();
        propertyEdge.targetId = targetNode.id();
        propertyEdge.diagramId = this.diagram.id;
        propertyEntity.addOccurrence(propertyEdge, this.rendererState);
        this.diagramRepresentation.addElement(propertyEdge, propertyEntity);
        return propertyEdge;
    }
    addIndividual(individualEntity, position) {
        var _a, _b;
        if ((_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.containsEntity(individualEntity)) {
            const nodeId = individualEntity.getIdInDiagram(this.diagram.id, TypesEnum.INDIVIDUAL, this.rendererState);
            if (nodeId)
                return this.diagramRepresentation.grapholElements.get(nodeId);
        }
        const individualNode = new GrapholNode(this.getNewId('node'), TypesEnum.INDIVIDUAL);
        if (position)
            individualNode.position = position;
        else
            individualNode.renderedPosition = this.getCurrentCenterPos();
        individualNode.diagramId = this.diagram.id;
        individualNode.displayedName = individualEntity.getDisplayedName(RDFGraphConfigEntityNameTypeEnum.LABEL);
        individualNode.iri = individualEntity.iri.fullIri;
        individualNode.height = individualNode.width = 50;
        individualNode.shape = Shape.ELLIPSE;
        individualNode.labelXpos = 0;
        individualNode.labelYpos = 0;
        individualEntity.addOccurrence(individualNode, this.rendererState);
        (_b = this.diagramRepresentation) === null || _b === void 0 ? void 0 : _b.addElement(individualNode, individualEntity);
        return individualNode;
    }
    addHierarchy(hierarchy, position) {
        var _a, _b;
        if (!((_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy)) {
            return;
        }
        let unionNode;
        /**
         * Check if there is already a hierarchy node of the same type having
         * the same (and only!!) input classes
         */
        const duplicateHierarchy = this.diagramRepresentation.cy.nodes(`[hierarchyID][ type = "${hierarchy.type}" ]`).filter(h => {
            const inputClasses = h.connectedEdges(`[ type = "${TypesEnum.INPUT}" ]`).sources();
            if (inputClasses.length !== hierarchy.inputs.length)
                return false;
            // Every new hierarchy inputs must be included in the inputs connected
            // to the hierarchy in test
            return hierarchy.inputs.every(inputClass => inputClasses.some(node => inputClass.iri.equals(node.data().iri)));
        }).first();
        if (duplicateHierarchy.nonempty()) {
            unionNode = this.diagramRepresentation.grapholElements.get(duplicateHierarchy.id());
        }
        else {
            unionNode = hierarchy.getUnionGrapholNode(this.getNewId('node'), position);
            unionNode && this.diagramRepresentation.addElement(unionNode);
        }
        if (!unionNode || !((_b = this.diagramRepresentation) === null || _b === void 0 ? void 0 : _b.cy))
            return;
        unionNode.diagramId = this.diagram.id;
        let addedClassNode;
        // Add inputs
        for (const inputClasses of hierarchy.inputs) {
            addedClassNode = this.addClass(inputClasses, position);
            this.addEdge(addedClassNode.id, unionNode.id, TypesEnum.INPUT);
        }
        // Add superclasses
        let inclusionType;
        for (const superClass of hierarchy.superclasses) {
            addedClassNode = this.addClass(superClass.classEntity, position);
            inclusionType = hierarchy.type;
            if (superClass.complete || hierarchy.forcedComplete) {
                if (hierarchy.isDisjoint()) {
                    inclusionType = TypesEnum.COMPLETE_DISJOINT_UNION;
                }
                else {
                    inclusionType = TypesEnum.COMPLETE_UNION;
                }
            }
            this.addEdge(unionNode.id, addedClassNode.id, inclusionType);
        }
        return unionNode;
    }
    addEdge(sourceId, targetId, edgeType) {
        var _a, _b, _c, _d, _e, _f;
        const sourceNode = (_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.grapholElements.get(sourceId);
        const targetNode = (_b = this.diagramRepresentation) === null || _b === void 0 ? void 0 : _b.grapholElements.get(targetId);
        const sourceCyNode = (_c = this.diagramRepresentation) === null || _c === void 0 ? void 0 : _c.cy.$id(sourceId);
        const targetCyNode = (_d = this.diagramRepresentation) === null || _d === void 0 ? void 0 : _d.cy.$id(targetId);
        if (sourceCyNode && targetCyNode) {
            const edgesAlreadyPresent = sourceCyNode.edgesTo(targetCyNode).filter(e => e.data().type === edgeType);
            if (edgesAlreadyPresent.nonempty()) {
                return (_e = this.diagramRepresentation) === null || _e === void 0 ? void 0 : _e.grapholElements.get(edgesAlreadyPresent.first().id());
            }
        }
        else {
            return;
        }
        if (sourceNode && targetNode) {
            const instanceEdge = new GrapholEdge(this.getNewId('edge'), edgeType);
            instanceEdge.diagramId = this.diagram.id;
            instanceEdge.sourceId = sourceId;
            instanceEdge.targetId = targetId;
            (_f = this.diagramRepresentation) === null || _f === void 0 ? void 0 : _f.addElement(instanceEdge);
            return instanceEdge;
        }
    }
    get diagramRepresentation() {
        return this.diagram.representations.get(this.rendererState);
    }
    toggleFunctionality(entity, functional) {
        var _a;
        const id = entity.getIdInDiagram(this.diagram.id, TypesEnum.DATA_PROPERTY, this.rendererState);
        if (!id)
            return;
        const node = (_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.$id(id);
        if (!node)
            return;
        node.data('functional', functional);
    }
    toggleUnion(node) {
        const type = node.data('type');
        if (type === TypesEnum.UNION) {
            node.removeClass('union');
            node.data('type', TypesEnum.DISJOINT_UNION);
            node.data('displayedName', undefined);
            node.addClass('disjoint-union');
            // edge
            const edge = node.connectedEdges().find(e => e.data('type') === TypesEnum.UNION);
            edge === null || edge === void 0 ? void 0 : edge.data('type', TypesEnum.DISJOINT_UNION);
        }
        else {
            node.removeClass('disjoint-union');
            node.data('type', TypesEnum.UNION);
            node.data('displayedName', 'or');
            node.data('labelXpos', 0);
            node.data('labelXcentered', true);
            node.data('labelYpos', 0);
            node.data('labelYcentered', true);
            node.addClass('union');
            // edge
            const edge = node.connectedEdges().find(e => e.data('type') === TypesEnum.DISJOINT_UNION);
            edge === null || edge === void 0 ? void 0 : edge.data('type', TypesEnum.UNION);
        }
    }
    toggleComplete(edge) {
        if (edge.data('targetLabel') === 'C') {
            edge.removeClass('equivalence');
            edge.data('targetLabel', '');
            edge.addClass('inclusion');
        }
        else {
            edge.removeClass('inclusion');
            edge.data('targetLabel', 'C');
            edge.addClass('equivalence');
        }
    }
    swapEdge(elem) {
        const oldSourceID = elem.data('source');
        const oldTargetID = elem.data('target');
        elem.move({
            source: elem.target().id(),
            target: elem.source().id(),
        });
        elem.data('source', oldTargetID);
        elem.data('target', oldSourceID);
    }
    removeHierarchy(hierarchy) {
        var _a, _b, _c;
        if (hierarchy.id) {
            let unionNode = (_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.$(`node[hierarchyID = "${hierarchy.id}"]`);
            if (!unionNode || unionNode.empty()) {
                return;
            }
            // remove input edges
            (_b = unionNode === null || unionNode === void 0 ? void 0 : unionNode.connectedEdges(`[ type = "${TypesEnum.INPUT}" ]`)) === null || _b === void 0 ? void 0 : _b.forEach(inputEdge => {
                var _a;
                (_a = this.diagram) === null || _a === void 0 ? void 0 : _a.removeElement(inputEdge.id(), this.rendererState);
            });
            // remove inclusion edges
            (_c = unionNode === null || unionNode === void 0 ? void 0 : unionNode.connectedEdges(`[ type = "${hierarchy.type}" ]`)) === null || _c === void 0 ? void 0 : _c.forEach(inclusionEdge => {
                var _a;
                (_a = this.diagram) === null || _a === void 0 ? void 0 : _a.removeElement(inclusionEdge.id(), this.rendererState);
            });
            // remove union node
            this.diagram.removeElement(unionNode.id(), this.rendererState);
        }
    }
    removeHierarchyInputEdge(hierarchy, inputIri) {
        var _a;
        if (hierarchy.id) {
            const unionNode = (_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.$(`node[hierarchyID = "${hierarchy.id}"]`);
            unionNode === null || unionNode === void 0 ? void 0 : unionNode.edgesWith(`[ iri = "${inputIri}" ]`).forEach(inputEdge => {
                var _a;
                if (inputEdge.data().type === TypesEnum.INPUT)
                    (_a = this.diagram) === null || _a === void 0 ? void 0 : _a.removeElement(inputEdge.id(), this.rendererState);
            });
        }
    }
    removeHierarchyInclusionEdge(hierarchy, superclassIri) {
        var _a;
        if (hierarchy.id) {
            const unionNode = (_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.$(`node[hierarchyID = "${hierarchy.id}"]`);
            unionNode === null || unionNode === void 0 ? void 0 : unionNode.edgesTo(`[ iri = "${superclassIri}" ]`).forEach(inclusionEdge => {
                var _a;
                if (inclusionEdge.data().type.replace('complete-', '') === hierarchy.type)
                    (_a = this.diagram) === null || _a === void 0 ? void 0 : _a.removeElement(inclusionEdge.id(), this.rendererState);
            });
        }
    }
    removeElement(id) {
        var _a, _b, _c;
        const cyElem = (_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.$id(id);
        const grapholElem = (_b = this.diagramRepresentation) === null || _b === void 0 ? void 0 : _b.grapholElements.get(id);
        if (cyElem === null || cyElem === void 0 ? void 0 : cyElem.nonempty()) {
            if (grapholElem && grapholElem.is(TypesEnum.DATA_PROPERTY)) {
                cyElem.connectedEdges().forEach(e => {
                    var _a;
                    (_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.removeElement(e.id());
                });
            }
            (_c = this.diagramRepresentation) === null || _c === void 0 ? void 0 : _c.removeElement(id);
        }
    }
    renameElement(elemId, newIri) {
        var _a, _b;
        const cyElem = (_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.$id(elemId);
        cyElem === null || cyElem === void 0 ? void 0 : cyElem.data('iri', newIri.fullIri);
        cyElem === null || cyElem === void 0 ? void 0 : cyElem.data('displayedName', newIri.remainder);
        const grapholElem = (_b = this.diagramRepresentation) === null || _b === void 0 ? void 0 : _b.grapholElements.get(elemId);
        if (!grapholElem)
            return;
        grapholElem.iri = newIri.fullIri;
        grapholElem.displayedName = newIri.remainder;
    }
    /**
     * Get cytoscape representation of an entity given the type needed
     * @param entity
     * @param type
     * @returns
     */
    getEntityCyRepr(entity, type) {
        var _a;
        const occurrenceID = entity.getIdInDiagram(this.diagram.id, type, this.rendererState);
        if (occurrenceID)
            return ((_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.$id(occurrenceID)) || cytoscape().collection();
        else
            return cytoscape().collection();
    }
    getNewId(nodeOrEdge) {
        var _a;
        return ((_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.getNewId(nodeOrEdge)) || (nodeOrEdge === 'node' ? 'n0' : 'e0');
    }
    getCurrentCenterPos() {
        var _a, _b;
        const height = ((_a = this.diagramRepresentation) === null || _a === void 0 ? void 0 : _a.cy.height()) || 0;
        const width = ((_b = this.diagramRepresentation) === null || _b === void 0 ? void 0 : _b.cy.width()) || 0;
        let pos = {
            x: (width / 2) + Math.random() * 50,
            y: (height / 2) + Math.random() * 50,
        };
        return pos;
    }
}

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=window,e$2=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$3=Symbol(),n$3=new WeakMap;let o$3 = class o{constructor(t,e,n){if(this._$cssResult$=!0,n!==s$3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=n$3.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n$3.set(s,t));}return t}toString(){return this.cssText}};const r$2=t=>new o$3("string"==typeof t?t:t+"",void 0,s$3),i$1=(t,...e)=>{const n=1===t.length?t[0]:e.reduce(((e,s,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[n+1]),t[0]);return new o$3(n,t,s$3)},S$1=(s,n)=>{e$2?s.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((e=>{const n=document.createElement("style"),o=t$1.litNonce;void 0!==o&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n);}));},c$1=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$2(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s$2;const e$1=window,r$1=e$1.trustedTypes,h$1=r$1?r$1.emptyScript:"",o$2=e$1.reactiveElementPolyfillSupport,n$2={toAttribute(t,i){switch(i){case Boolean:t=t?h$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},a$1=(t,i)=>i!==t&&(i==i||t==t),l$2={attribute:!0,type:String,converter:n$2,reflect:!1,hasChanged:a$1},d$1="finalized";let u$1 = class u extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u();}static addInitializer(t){var i;this.finalize(),(null!==(i=this.h)&&void 0!==i?i:this.h=[]).push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Ep(s,i);void 0!==e&&(this._$Ev.set(e,s),t.push(e));})),t}static createProperty(t,i=l$2){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$2}static finalize(){if(this.hasOwnProperty(d$1))return !1;this[d$1]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(c$1(i));}else void 0!==i&&s.push(c$1(i));return s}static _$Ep(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1);}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return S$1(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$EO(t,i,s=l$2){var e;const r=this.constructor._$Ep(t,s);if(void 0!==r&&!0===s.reflect){const h=(void 0!==(null===(e=s.converter)||void 0===e?void 0:e.toAttribute)?s.converter:n$2).toAttribute(i,s.type);this._$El=t,null==h?this.removeAttribute(r):this.setAttribute(r,h),this._$El=null;}}_$AK(t,i){var s;const e=this.constructor,r=e._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=e.getPropertyOptions(r),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:n$2;this._$El=r,this[r]=h.fromAttribute(i,t.type),this._$El=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||a$1)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$E_=this._$Ej());}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$Ek();}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return !0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek();}updated(t){}firstUpdated(t){}};u$1[d$1]=!0,u$1.elementProperties=new Map,u$1.elementStyles=[],u$1.shadowRootOptions={mode:"open"},null==o$2||o$2({ReactiveElement:u$1}),(null!==(s$2=e$1.reactiveElementVersions)&&void 0!==s$2?s$2:e$1.reactiveElementVersions=[]).push("1.6.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t;const i=window,s$1=i.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,o$1="$lit$",n$1=`lit$${(Math.random()+"").slice(9)}$`,l$1="?"+n$1,h=`<${l$1}>`,r=document,u=()=>r.createComment(""),d=t=>null===t||"object"!=typeof t&&"function"!=typeof t,c=Array.isArray,v=t=>c(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),a="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${a}(?:([^\\s"'>=/]+)(${a}*=${a}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,w=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=w(1),b=w(2),T=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),E=new WeakMap,C=r.createTreeWalker(r,129,null,!1);function P(t,i){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const V=(t,i)=>{const s=t.length-1,e=[];let l,r=2===i?"<svg>":"",u=f;for(let i=0;i<s;i++){const s=t[i];let d,c,v=-1,a=0;for(;a<s.length&&(u.lastIndex=a,c=u.exec(s),null!==c);)a=u.lastIndex,u===f?"!--"===c[1]?u=_:void 0!==c[1]?u=m:void 0!==c[2]?(y.test(c[2])&&(l=RegExp("</"+c[2],"g")),u=p):void 0!==c[3]&&(u=p):u===p?">"===c[0]?(u=null!=l?l:f,v=-1):void 0===c[1]?v=-2:(v=u.lastIndex-c[2].length,d=c[1],u=void 0===c[3]?p:'"'===c[3]?$:g):u===$||u===g?u=p:u===_||u===m?u=f:(u=p,l=void 0);const w=u===p&&t[i+1].startsWith("/>")?" ":"";r+=u===f?s+h:v>=0?(e.push(d),s.slice(0,v)+o$1+s.slice(v)+n$1+w):s+n$1+(-2===v?(e.push(void 0),i):w);}return [P(t,r+(t[s]||"<?>")+(2===i?"</svg>":"")),e]};class N{constructor({strings:t,_$litType$:i},e){let h;this.parts=[];let r=0,d=0;const c=t.length-1,v=this.parts,[a,f]=V(t,i);if(this.el=N.createElement(a,e),C.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(h=C.nextNode())&&v.length<c;){if(1===h.nodeType){if(h.hasAttributes()){const t=[];for(const i of h.getAttributeNames())if(i.endsWith(o$1)||i.startsWith(n$1)){const s=f[d++];if(t.push(i),void 0!==s){const t=h.getAttribute(s.toLowerCase()+o$1).split(n$1),i=/([.?@])?(.*)/.exec(s);v.push({type:1,index:r,name:i[2],strings:t,ctor:"."===i[1]?H:"?"===i[1]?L:"@"===i[1]?z:k});}else v.push({type:6,index:r});}for(const i of t)h.removeAttribute(i);}if(y.test(h.tagName)){const t=h.textContent.split(n$1),i=t.length-1;if(i>0){h.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)h.append(t[s],u()),C.nextNode(),v.push({type:2,index:++r});h.append(t[i],u());}}}else if(8===h.nodeType)if(h.data===l$1)v.push({type:2,index:r});else {let t=-1;for(;-1!==(t=h.data.indexOf(n$1,t+1));)v.push({type:7,index:r}),t+=n$1.length-1;}r++;}}static createElement(t,i){const s=r.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){var o,n,l,h;if(i===T)return i;let r=void 0!==e?null===(o=s._$Co)||void 0===o?void 0:o[e]:s._$Cl;const u=d(i)?void 0:i._$litDirective$;return (null==r?void 0:r.constructor)!==u&&(null===(n=null==r?void 0:r._$AO)||void 0===n||n.call(r,!1),void 0===u?r=void 0:(r=new u(t),r._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Co)&&void 0!==l?l:h._$Co=[])[e]=r:s._$Cl=r),void 0!==r&&(i=S(t,r._$AS(t,i.values),r,e)),i}class M{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:r).importNode(s,!0);C.currentNode=o;let n=C.nextNode(),l=0,h=0,u=e[0];for(;void 0!==u;){if(l===u.index){let i;2===u.type?i=new R(n,n.nextSibling,this,t):1===u.type?i=new u.ctor(n,u.name,u.strings,this,t):6===u.type&&(i=new Z(n,this,t)),this._$AV.push(i),u=e[++h];}l!==(null==u?void 0:u.index)&&(n=C.nextNode(),l++);}return C.currentNode=r,o}v(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class R{constructor(t,i,s,e){var o;this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cp=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===(null==t?void 0:t.nodeType)&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),d(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):v(t)?this.T(t):this._(t);}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t));}_(t){this._$AH!==A&&d(this._$AH)?this._$AA.nextSibling.data=t:this.$(r.createTextNode(t)),this._$AH=t;}g(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=N.createElement(P(e.h,e.h[0]),this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.v(s);else {const t=new M(o,this),i=t.u(this.options);t.v(s),this.$(i),this._$AH=t;}}_$AC(t){let i=E.get(t.strings);return void 0===i&&E.set(t.strings,i=new N(t)),i}T(t){c(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new R(this.k(u()),this.k(u()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$Cp=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}}class k{constructor(t,i,s,e,o){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=S(this,t,i,0),n=!d(t)||t!==this._$AH&&t!==T,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=S(this,e[s+l],i,l),h===T&&(h=this._$AH[l]),n||(n=!d(h)||h!==this._$AH[l]),h===A?t=A:t!==A&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class H extends k{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}const I=s$1?s$1.emptyScript:"";class L extends k{constructor(){super(...arguments),this.type=4;}j(t){t&&t!==A?this.element.setAttribute(this.name,I):this.element.removeAttribute(this.name);}}class z extends k{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=S(this,t,i,0))&&void 0!==s?s:A)===T)return;const e=this._$AH,o=t===A&&e!==A||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==A&&(e===A||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t);}}const B=i.litHtmlPolyfillSupport;null==B||B(N,R),(null!==(t=i.litHtmlVersions)&&void 0!==t?t:i.litHtmlVersions=[]).push("2.8.0");const D=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new R(i.insertBefore(u(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l,o;class s extends u$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1);}render(){return T}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n=globalThis.litElementPolyfillSupport;null==n||n({LitElement:s});(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.3.2");

var classIcon = b `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
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
     style="fill:none;stroke: var(--gscape-color-class-contrast);stroke-width:2" />
</svg>
`;

var dataPropertyIcon = b `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
<circle cx="9" cy="9" r="5" stroke="var(--gscape-color-data-property-contrast)" stroke-width="2.5" fill="none"/>
</svg>
`;

var individualIcon = b `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
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
   width="18"
   viewBox="0 0 18 18"
   style="box-sizing: border-box; padding: 1px;"
   >
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
     style="fill:none;fill-rule:evenodd;stroke:var(--gscape-color-individual-contrast);stroke-width:3;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
     sodipodi:type="star" />
</svg>`;

var objectPropertyIcon = b `<svg fill="var(--gscape-color-object-property-contrast)" style="padding: 2.2px; box-sizing: border-box" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="200 -480 960 960" width="20"><path style="-ms-transform: rotate(45deg); -webkit-transform: rotate(45deg); transform: rotate(45deg);" d="M228-110q-49.7 0-83.85-34.15Q110-178.3 110-228v-504q0-49.7 34.15-83.85Q178.3-850 228-850h252v118H228v504h504v-252h118v252q0 49.7-34.15 83.85Q781.7-110 732-110H228Zm190-226-82-82 314-314h-74v-118h274v274H732v-74L418-336Z"/></svg>`;

var annotationPropertyIcon = b `<svg fill="var(--gscape-color-annotation-property-contrast)" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M220-220h328v-192h192v-328H220v520Zm0 67q-27.637 0-47.319-19.681Q153-192.363 153-220v-520q0-27.638 19.681-47.319Q192.363-807 220-807h520q27.638 0 47.319 19.681T807-740v348.5L568.5-153H220Zm67-261v-67h200.5v67H287Zm0-134v-67h386v67H287Zm-67 328v-520 520Z"/></svg>`;

const diagrams = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M6.333 5.438Q5.875 5.438 5.552 5.76Q5.229 6.083 5.229 6.542Q5.229 7 5.552 7.302Q5.875 7.604 6.333 7.604Q6.792 7.604 7.094 7.302Q7.396 7 7.396 6.542Q7.396 6.083 7.094 5.76Q6.792 5.438 6.333 5.438ZM6.333 13.208Q5.875 13.208 5.552 13.51Q5.229 13.812 5.229 14.271Q5.229 14.729 5.552 15.052Q5.875 15.375 6.333 15.375Q6.792 15.375 7.094 15.052Q7.396 14.729 7.396 14.271Q7.396 13.812 7.094 13.51Q6.792 13.208 6.333 13.208ZM3.667 3.167H16.354Q16.667 3.167 16.875 3.375Q17.083 3.583 17.083 3.896V9.104Q17.083 9.458 16.875 9.677Q16.667 9.896 16.354 9.896H3.667Q3.354 9.896 3.135 9.677Q2.917 9.458 2.917 9.104V3.896Q2.917 3.583 3.135 3.375Q3.354 3.167 3.667 3.167ZM4.25 4.5V8.562H15.75V4.5ZM3.667 10.938H16.333Q16.667 10.938 16.875 11.156Q17.083 11.375 17.083 11.708V16.875Q17.083 17.229 16.875 17.448Q16.667 17.667 16.333 17.667H3.688Q3.354 17.667 3.135 17.448Q2.917 17.229 2.917 16.875V11.708Q2.917 11.375 3.125 11.156Q3.333 10.938 3.667 10.938ZM4.25 12.271V16.333H15.75V12.271ZM4.25 4.5V8.562ZM4.25 12.271V16.333Z"/></svg>`;
const triangle_up = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 14l5-5 5 5H7z"/></svg>`;
const triangle_down = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 10l5 5 5-5H7z"/></svg>`;
const arrow_right = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>`;
const arrowDown = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="M480 723 240 483l51-51 189 189 189-189 51 51-240 240Z"/></svg>`;
const explore = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="m5.75 14.25 6.021-2.479L14.25 5.75 8.229 8.229Zm3.542-3.542Q9 10.417 9 10t.292-.708Q9.583 9 10 9t.708.292Q11 9.583 11 10t-.292.708Q10.417 11 10 11t-.708-.292ZM10 18q-1.646 0-3.104-.625-1.458-.625-2.552-1.719t-1.719-2.552Q2 11.646 2 10q0-1.667.625-3.115.625-1.447 1.719-2.541Q5.438 3.25 6.896 2.625T10 2q1.667 0 3.115.625 1.447.625 2.541 1.719 1.094 1.094 1.719 2.541Q18 8.333 18 10q0 1.646-.625 3.104-.625 1.458-1.719 2.552t-2.541 1.719Q11.667 18 10 18Zm0-1.5q2.708 0 4.604-1.896T16.5 10q0-2.708-1.896-4.604T10 3.5q-2.708 0-4.604 1.896T3.5 10q0 2.708 1.896 4.604T10 16.5Zm0-6.5Z"/></svg>`;
const info_outline = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M9.25 14H10.75V9H9.25ZM10 7.5Q10.312 7.5 10.531 7.281Q10.75 7.062 10.75 6.75Q10.75 6.438 10.531 6.219Q10.312 6 10 6Q9.688 6 9.469 6.219Q9.25 6.438 9.25 6.75Q9.25 7.062 9.469 7.281Q9.688 7.5 10 7.5ZM10 16.5Q11.354 16.5 12.531 15.99Q13.708 15.479 14.594 14.594Q15.479 13.708 15.99 12.521Q16.5 11.333 16.5 10Q16.5 8.646 15.99 7.469Q15.479 6.292 14.594 5.406Q13.708 4.521 12.531 4.01Q11.354 3.5 10 3.5Q8.667 3.5 7.479 4.01Q6.292 4.521 5.406 5.406Q4.521 6.292 4.01 7.469Q3.5 8.646 3.5 10Q3.5 11.333 4.01 12.521Q4.521 13.708 5.406 14.594Q6.292 15.479 7.479 15.99Q8.667 16.5 10 16.5ZM10 18Q6.667 18 4.333 15.667Q2 13.333 2 10Q2 6.667 4.333 4.333Q6.667 2 10 2Q13.333 2 15.667 4.333Q18 6.667 18 10Q18 13.333 15.667 15.667Q13.333 18 10 18ZM10 10Q10 10 10 10Q10 10 10 10Q10 10 10 10Q10 10 10 10Q10 10 10 10Q10 10 10 10Q10 10 10 10Q10 10 10 10Z"/></svg>`;
const enterFullscreen = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="1 1 18 18"><path d="M4.167 15.833V11.646H5.5V14.5H8.354V15.833ZM4.167 8.354V4.167H8.354V5.5H5.5V8.354ZM11.646 15.833V14.5H14.5V11.646H15.833V15.833ZM14.5 8.354V5.5H11.646V4.167H15.833V8.354Z"/></svg>`;
const exitFullscreen = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="1 1 18 18"><path d="M7.021 15.833V12.979H4.167V11.646H8.354V15.833ZM4.167 8.354V7.021H7.021V4.167H8.354V8.354ZM11.646 15.833V11.646H15.833V12.979H12.979V15.833ZM11.646 8.354V4.167H12.979V7.021H15.833V8.354Z"/></svg>`;
const centerDiagram = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M10 12.167Q9.104 12.167 8.469 11.531Q7.833 10.896 7.833 10Q7.833 9.104 8.469 8.469Q9.104 7.833 10 7.833Q10.896 7.833 11.531 8.469Q12.167 9.104 12.167 10Q12.167 10.896 11.531 11.531Q10.896 12.167 10 12.167ZM2.917 7.542V4.5Q2.917 3.833 3.375 3.375Q3.833 2.917 4.5 2.917H7.542V4.25H4.5Q4.417 4.25 4.333 4.333Q4.25 4.417 4.25 4.5V7.542ZM7.542 17.083H4.5Q3.833 17.083 3.375 16.625Q2.917 16.167 2.917 15.5V12.458H4.25V15.5Q4.25 15.583 4.333 15.667Q4.417 15.75 4.5 15.75H7.542ZM12.458 17.083V15.75H15.5Q15.583 15.75 15.667 15.667Q15.75 15.583 15.75 15.5V12.458H17.083V15.5Q17.083 16.167 16.625 16.625Q16.167 17.083 15.5 17.083ZM15.75 7.542V4.5Q15.75 4.417 15.667 4.333Q15.583 4.25 15.5 4.25H12.458V2.917H15.5Q16.167 2.917 16.625 3.375Q17.083 3.833 17.083 4.5V7.542ZM10 10.833Q10.354 10.833 10.594 10.594Q10.833 10.354 10.833 10Q10.833 9.646 10.594 9.406Q10.354 9.167 10 9.167Q9.646 9.167 9.406 9.406Q9.167 9.646 9.167 10Q9.167 10.354 9.406 10.594Q9.646 10.833 10 10.833Z"/></svg>`;
const filter = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M8.062 13.979V12.583H11.938V13.979ZM5.104 10.5V9.104H14.875V10.5ZM3.146 7V5.604H16.854V7Z"/></svg>`;
const bubbles = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M6.021 14.667Q4.75 14.667 3.865 13.781Q2.979 12.896 2.979 11.625Q2.979 10.354 3.865 9.469Q4.75 8.583 6.021 8.583Q7.271 8.583 8.156 9.469Q9.042 10.354 9.042 11.625Q9.042 12.896 8.156 13.781Q7.271 14.667 6.021 14.667ZM13.542 11.458Q11.792 11.458 10.583 10.24Q9.375 9.021 9.375 7.271Q9.375 5.5 10.583 4.292Q11.792 3.083 13.542 3.083Q15.292 3.083 16.521 4.292Q17.75 5.5 17.75 7.271Q17.75 9.021 16.521 10.24Q15.292 11.458 13.542 11.458ZM11.958 16.938Q11.042 16.938 10.396 16.292Q9.75 15.646 9.75 14.708Q9.75 13.792 10.396 13.146Q11.042 12.5 11.958 12.5Q12.896 12.5 13.542 13.146Q14.188 13.792 14.188 14.708Q14.188 15.646 13.542 16.292Q12.896 16.938 11.958 16.938Z"/></svg>`;
const lite = b `<svg fill="currentColor" style="padding: 2px; box-sizing: border-box;" width="20" height="20" version="1.1" viewBox="0 0 752 752" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com"><path d="M 375.714 0.009 C 371.042 0.066 366.482 1.447 362.593 3.994 L 156.603 127.708 C 153.518 129.737 150.954 132.436 149.099 135.596 L 12.104 135.596 C 5.422 135.596 0 140.911 0 147.462 L 0 599.375 L 0 599.369 C 0 605.92 5.422 611.236 12.104 611.236 L 139.149 611.236 L 139.149 728.278 L 139.149 728.272 C 139.149 734.568 141.694 740.599 146.235 745.052 C 150.77 749.498 156.93 752 163.343 752 L 588.652 752 C 595.064 752 601.218 749.498 605.76 745.052 C 610.292 740.599 612.846 734.568 612.846 728.272 L 612.846 611.236 L 739.903 611.236 C 746.584 611.236 752 605.92 752 599.369 L 752 147.456 C 752 140.905 746.584 135.59 739.903 135.59 L 602.94 135.59 C 601.08 132.428 598.496 129.73 595.403 127.702 L 389.431 3.988 C 385.371 1.333 380.59 -0.056 375.709 0.001 L 375.714 0.009 Z M 376.014 98.108 L 491.584 157.275 L 376.014 216.436 L 260.427 157.275 L 376.014 98.108 Z M 37.566 178.974 L 149.089 178.974 C 150.949 182.128 153.519 184.821 156.606 186.844 L 362.579 310.545 L 362.584 310.545 C 366.556 313.142 371.23 314.529 376.006 314.529 C 380.781 314.529 385.455 313.142 389.427 310.545 L 595.383 186.844 C 598.463 184.815 601.026 182.122 602.88 178.974 L 714.428 178.974 L 714.428 574.405 L 612.83 574.405 L 612.83 463.926 C 612.83 457.631 610.28 451.599 605.744 447.153 C 601.202 442.701 595.051 440.201 588.631 440.201 L 163.339 440.201 C 156.926 440.201 150.767 442.701 146.232 447.153 C 141.69 451.599 139.146 457.631 139.146 463.926 L 139.146 574.405 L 37.561 574.405 L 37.566 178.974 Z M 242.668 541.701 L 509.325 541.701 L 510.994 652.145 L 240.998 652.145 L 242.668 541.701 Z" fill-rule="evenodd" style=""></path></svg>`;
const settings_icon = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="m8.021 17.917-.313-2.5q-.27-.125-.625-.334-.354-.208-.625-.395l-2.312.979-1.979-3.438 1.979-1.5q-.021-.167-.031-.364-.011-.198-.011-.365 0-.146.011-.344.01-.198.031-.385l-1.979-1.5 1.979-3.417 2.312.958q.271-.187.615-.385t.635-.344l.313-2.5h3.958l.313 2.5q.312.167.625.344.312.177.604.385l2.333-.958 1.979 3.417-1.979 1.521q.021.187.021.364V10q0 .146-.01.333-.011.188-.011.396l1.958 1.5-1.979 3.438-2.312-.979q-.292.208-.615.395-.323.188-.614.334l-.313 2.5Zm1.937-5.355q1.063 0 1.813-.75t.75-1.812q0-1.062-.75-1.812t-1.813-.75q-1.041 0-1.802.75-.76.75-.76 1.812t.76 1.812q.761.75 1.802.75Zm0-1.333q-.5 0-.864-.364-.365-.365-.365-.865t.365-.865q.364-.364.864-.364t.865.364q.365.365.365.865t-.365.865q-.365.364-.865.364ZM10.021 10Zm-.854 6.583h1.666l.25-2.187q.605-.167 1.136-.49.531-.323 1.031-.802l2.021.875.854-1.375-1.792-1.354q.105-.333.136-.635.031-.303.031-.615 0-.292-.031-.573-.031-.281-.115-.635l1.792-1.396-.834-1.375-2.062.875q-.438-.438-1.021-.781-.583-.344-1.125-.49l-.271-2.208H9.167l-.271 2.208q-.584.146-1.125.458-.542.313-1.042.792l-2.021-.854-.833 1.375 1.75 1.354q-.083.333-.125.646-.042.312-.042.604t.042.594q.042.302.125.635l-1.75 1.375.833 1.375 2.021-.854q.479.458 1.021.771.542.312 1.146.479Z"/></svg>`;
const infoFilled = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M10 14.167Q10.354 14.167 10.615 13.906Q10.875 13.646 10.875 13.292V10.021Q10.875 9.667 10.615 9.417Q10.354 9.167 10 9.167Q9.646 9.167 9.385 9.427Q9.125 9.688 9.125 10.042V13.312Q9.125 13.667 9.385 13.917Q9.646 14.167 10 14.167ZM10 7.479Q10.354 7.479 10.615 7.219Q10.875 6.958 10.875 6.604Q10.875 6.25 10.615 5.99Q10.354 5.729 10 5.729Q9.646 5.729 9.385 5.99Q9.125 6.25 9.125 6.604Q9.125 6.958 9.385 7.219Q9.646 7.479 10 7.479ZM10 18.333Q8.271 18.333 6.75 17.677Q5.229 17.021 4.104 15.896Q2.979 14.771 2.323 13.25Q1.667 11.729 1.667 10Q1.667 8.271 2.323 6.75Q2.979 5.229 4.104 4.104Q5.229 2.979 6.75 2.323Q8.271 1.667 10 1.667Q11.729 1.667 13.25 2.323Q14.771 2.979 15.896 4.104Q17.021 5.229 17.677 6.75Q18.333 8.271 18.333 10Q18.333 11.729 17.677 13.25Q17.021 14.771 15.896 15.896Q14.771 17.021 13.25 17.677Q11.729 18.333 10 18.333Z"/></svg>`;
const plus = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M9.188 15.083V10.792H4.896V9.167H9.188V4.875H10.812V9.167H15.104V10.792H10.812V15.083Z"/></svg>`;
const minus = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M4.875 10.792V9.167H15.125V10.792Z"/></svg>`;
const save = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M17.083 6v9.5q0 .667-.458 1.125-.458.458-1.125.458h-11q-.667 0-1.125-.458-.458-.458-.458-1.125v-11q0-.667.458-1.125.458-.458 1.125-.458H14Zm-1.333.604L13.396 4.25H4.5q-.104 0-.177.073T4.25 4.5v11q0 .104.073.177t.177.073h11q.104 0 .177-.073t.073-.177ZM10 14.312q.896 0 1.531-.645.636-.646.636-1.521 0-.896-.636-1.531-.635-.636-1.531-.636-.896 0-1.531.636-.636.635-.636 1.531 0 .875.636 1.521.635.645 1.531.645Zm-4.667-6.02h6.855V5.333H5.333ZM4.25 6.604v9.146-11.5Z"/></svg>`;
const close = b `<svg fillColor="currentColor" style="width:20px;height:20px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>`;
const blankSlateDiagrams = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M14.104 8.521Q13.875 8.312 13.875 8.052Q13.875 7.792 14.083 7.583L15.875 5.792Q16.062 5.604 16.333 5.615Q16.604 5.625 16.792 5.812Q17 6.021 17 6.281Q17 6.542 16.792 6.75L15 8.542Q14.812 8.729 14.552 8.719Q14.292 8.708 14.104 8.521ZM10 6.729Q9.729 6.729 9.531 6.531Q9.333 6.333 9.333 6.062V3.604Q9.333 3.333 9.531 3.135Q9.729 2.938 10 2.938Q10.271 2.938 10.469 3.135Q10.667 3.333 10.667 3.604V6.062Q10.667 6.333 10.469 6.531Q10.271 6.729 10 6.729ZM5 8.521 3.208 6.75Q3 6.562 3.01 6.281Q3.021 6 3.229 5.792Q3.417 5.604 3.688 5.604Q3.958 5.604 4.167 5.792L5.938 7.583Q6.125 7.792 6.125 8.052Q6.125 8.312 5.938 8.521Q5.729 8.708 5.458 8.708Q5.188 8.708 5 8.521ZM3.667 15.75H16.333Q16.417 15.75 16.5 15.667Q16.583 15.583 16.583 15.5V11.896Q16.583 11.812 16.5 11.729Q16.417 11.646 16.333 11.646H13.875Q13.375 12.771 12.302 13.469Q11.229 14.167 10 14.167Q8.771 14.167 7.708 13.469Q6.646 12.771 6.125 11.646H3.667Q3.583 11.646 3.5 11.729Q3.417 11.812 3.417 11.896V15.5Q3.417 15.583 3.5 15.667Q3.583 15.75 3.667 15.75ZM3.667 17.083Q3 17.083 2.542 16.625Q2.083 16.167 2.083 15.5V11.896Q2.083 11.229 2.542 10.771Q3 10.312 3.667 10.312H6.625Q7 10.312 7.083 10.385Q7.167 10.458 7.229 10.708Q7.417 11.5 8.135 12.167Q8.854 12.833 10 12.833Q11.146 12.833 11.865 12.156Q12.583 11.479 12.771 10.708Q12.833 10.458 12.917 10.385Q13 10.312 13.375 10.312H16.333Q17 10.312 17.458 10.771Q17.917 11.229 17.917 11.896V15.5Q17.917 16.167 17.458 16.625Q17 17.083 16.333 17.083ZM3.667 15.75Q3.583 15.75 3.5 15.75Q3.417 15.75 3.417 15.75Q3.417 15.75 3.5 15.75Q3.583 15.75 3.667 15.75H6.125Q6.646 15.75 7.708 15.75Q8.771 15.75 10 15.75Q11.229 15.75 12.302 15.75Q13.375 15.75 13.875 15.75H16.333Q16.417 15.75 16.5 15.75Q16.583 15.75 16.583 15.75Q16.583 15.75 16.5 15.75Q16.417 15.75 16.333 15.75Z"/></svg>`;
const check = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M8.229 13.771 5.021 10.542 5.75 9.792 8.229 12.25 14.25 6.25 14.979 7.021Z"/></svg>`;
const searchOff = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M6 16.417q-1.5 0-2.542-1.042-1.041-1.042-1.041-2.542 0-1.5 1.052-2.541Q4.521 9.25 6 9.25q1.5 0 2.542 1.052 1.041 1.052 1.041 2.552 0 1.479-1.052 2.521Q7.479 16.417 6 16.417Zm10.875-.771-5.083-5.084q-.104.105-.261.188-.156.083-.302.146l-.291-.375q-.146-.188-.313-.354.875-.438 1.427-1.261T12.604 7q0-1.5-1.052-2.552T9 3.396q-1.5 0-2.552 1.052T5.396 7q0 .208.042.406.041.198.083.386-.313.02-.563.073-.25.052-.52.135-.042-.229-.084-.479-.042-.25-.042-.521 0-1.938 1.376-3.312Q7.062 2.312 9 2.312q1.938 0 3.312 1.365Q13.688 5.042 13.688 7q0 .833-.282 1.583-.281.75-.739 1.334l4.979 4.958ZM4.812 14.521l1.167-1.167 1.167 1.167.542-.542-1.167-1.167 1.167-1.145-.542-.542-1.167 1.146-1.167-1.146-.541.542 1.167 1.145-1.167 1.167Z"/></svg>`;
/**
 * Author: Simran
 * Source: https://github.com/Templarian/MaterialDesign/blob/master/svg/checkbox-multiple-blank-circle.svg
 */
const move_bubbles = b `<svg style="width:20px;height:20px" viewBox="0 0 24 24"><path fill="currentColor" d="M14,2A8,8 0 0,0 6,10A8,8 0 0,0 14,18A8,8 0 0,0 22,10A8,8 0 0,0 14,2M4.93,5.82C3.08,7.34 2,9.61 2,12A8,8 0 0,0 10,20C10.64,20 11.27,19.92 11.88,19.77C10.12,19.38 8.5,18.5 7.17,17.29C5.22,16.25 4,14.21 4,12C4,11.7 4.03,11.41 4.07,11.11C4.03,10.74 4,10.37 4,10C4,8.56 4.32,7.13 4.93,5.82Z" /></svg>`;
/**
 * Author: Simran
 * Source: https://github.com/Templarian/MaterialDesign/blob/master/svg/owl.svg
 */
const owl_icon = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="height: 20px; width: auto" aria-hidden="true" focusable="false" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M12 16c.56.84 1.31 1.53 2.2 2L12 20.2L9.8 18c.89-.47 1.65-1.16 2.2-2m5-4.8a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m-10 0a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m10-2.5a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m-10 0a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4M2.24 1c1.76 3.7.49 6.46-.69 9.2c-.36.8-.55 1.63-.55 2.5a6 6 0 0 0 6 6c.21-.01.42-.02.63-.05l2.96 2.96L12 23l1.41-1.39l2.96-2.96c.21.03.42.04.63.05a6 6 0 0 0 6-6c0-.87-.19-1.7-.55-2.5C21.27 7.46 20 4.7 21.76 1c-2.64 2.06-6.4 3.69-9.76 3.7C8.64 4.69 4.88 3.06 2.24 1z"/></svg>`;
const graphol_icon = b `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 12 12" fill="currentColor" xml:space="preserve" style="height: 20px; width: 20px; box-sizing: border-box; padding: 2px;"><path id="path847" d="M5.4,11.9c-1.4-0.1-2.7-0.8-3.8-1.8c-0.8-0.8-1.3-1.8-1.6-3C0.1,6.8,0.1,6.7,0.1,6c0-0.7,0-0.8,0.1-1.1 c0.3-1.2,0.8-2.3,1.7-3.1C2.3,1.3,2.7,1,3.3,0.7c1.7-0.9,3.8-0.9,5.5,0c2.4,1.3,3.6,3.9,3.1,6.5c-0.6,2.6-2.8,4.5-5.5,4.7 C5.8,12,5.8,12,5.4,11.9L5.4,11.9z M6.5,10.5c0.2-0.1,0.3-0.1,0.8-0.7c0.3-0.3,1.2-1.2,2-1.9c1.1-1.1,1.3-1.4,1.4-1.5 c0.2-0.4,0.2-0.7,0-1.1c-0.1-0.2-0.2-0.3-1-1.1c-1-1-1.1-1-1.6-1c-0.5,0-0.5,0-1.9,1.4C5.5,5.2,5,5.8,5,5.8c0,0,0.2,0.3,0.5,0.6 L6,6.9l1-1l1-1l0.5,0.5l0.5,0.5L7.6,7.4L6,8.9L4.5,7.4L2.9,5.8L5,3.7c1.1-1.1,2.1-2.1,2.1-2.1c0-0.1-1-1-1-1c0,0-1,1-2.3,2.2 c-2,2-2.3,2.3-2.3,2.4C1.3,5.5,1.3,5.7,1.3,6c0.1,0.4,0,0.4,2.1,2.4c1.1,1.1,1.9,1.9,2,2C5.7,10.6,6.1,10.6,6.5,10.5z"/></svg>`;
const tune = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M3.375 15.625Q3.104 15.625 2.906 15.427Q2.708 15.229 2.708 14.958Q2.708 14.688 2.906 14.49Q3.104 14.292 3.375 14.292H6.792Q7.062 14.292 7.26 14.49Q7.458 14.688 7.458 14.958Q7.458 15.229 7.26 15.427Q7.062 15.625 6.792 15.625ZM3.375 5.708Q3.104 5.708 2.906 5.51Q2.708 5.312 2.708 5.042Q2.708 4.771 2.906 4.573Q3.104 4.375 3.375 4.375H9.896Q10.167 4.375 10.365 4.573Q10.562 4.771 10.562 5.042Q10.562 5.312 10.365 5.51Q10.167 5.708 9.896 5.708ZM10.083 17.292Q9.812 17.292 9.615 17.094Q9.417 16.896 9.417 16.625V13.312Q9.417 13.042 9.615 12.844Q9.812 12.646 10.083 12.646Q10.354 12.646 10.552 12.844Q10.75 13.042 10.75 13.312V14.292H16.625Q16.896 14.292 17.094 14.49Q17.292 14.688 17.292 14.958Q17.292 15.229 17.094 15.427Q16.896 15.625 16.625 15.625H10.75V16.625Q10.75 16.896 10.552 17.094Q10.354 17.292 10.083 17.292ZM6.792 12.333Q6.521 12.333 6.323 12.135Q6.125 11.938 6.125 11.667V10.667H3.375Q3.104 10.667 2.906 10.469Q2.708 10.271 2.708 10Q2.708 9.729 2.906 9.531Q3.104 9.333 3.375 9.333H6.125V8.354Q6.125 8.083 6.323 7.885Q6.521 7.688 6.792 7.688Q7.062 7.688 7.26 7.885Q7.458 8.083 7.458 8.354V11.667Q7.458 11.938 7.26 12.135Q7.062 12.333 6.792 12.333ZM10.083 10.667Q9.812 10.667 9.615 10.469Q9.417 10.271 9.417 10Q9.417 9.729 9.615 9.531Q9.812 9.333 10.083 9.333H16.625Q16.896 9.333 17.094 9.531Q17.292 9.729 17.292 10Q17.292 10.271 17.094 10.469Q16.896 10.667 16.625 10.667ZM13.208 7.354Q12.938 7.354 12.74 7.156Q12.542 6.958 12.542 6.688V3.375Q12.542 3.104 12.74 2.906Q12.938 2.708 13.208 2.708Q13.479 2.708 13.677 2.906Q13.875 3.104 13.875 3.375V4.375H16.625Q16.896 4.375 17.094 4.573Q17.292 4.771 17.292 5.042Q17.292 5.312 17.094 5.51Q16.896 5.708 16.625 5.708H13.875V6.688Q13.875 6.958 13.677 7.156Q13.479 7.354 13.208 7.354Z"/></svg>`;
const settings_play = b `<svg style="width:20px;height:20px" viewBox="0 0 24 24"><path fill="currentColor" d="M13.54 22H10C9.75 22 9.54 21.82 9.5 21.58L9.13 18.93C8.5 18.68 7.96 18.34 7.44 17.94L4.95 18.95C4.73 19.03 4.46 18.95 4.34 18.73L2.34 15.27C2.21 15.05 2.27 14.78 2.46 14.63L4.57 12.97L4.5 12L4.57 11L2.46 9.37C2.27 9.22 2.21 8.95 2.34 8.73L4.34 5.27C4.46 5.05 4.73 4.96 4.95 5.05L7.44 6.05C7.96 5.66 8.5 5.32 9.13 5.07L9.5 2.42C9.54 2.18 9.75 2 10 2H14C14.25 2 14.46 2.18 14.5 2.42L14.87 5.07C15.5 5.32 16.04 5.66 16.56 6.05L19.05 5.05C19.27 4.96 19.54 5.05 19.66 5.27L21.66 8.73C21.79 8.95 21.73 9.22 21.54 9.37L19.43 11L19.5 12V12.19C19 12.07 18.5 12 18 12C17.83 12 17.66 12 17.5 12.03C17.5 11.41 17.4 10.79 17.2 10.2L19.31 8.65L18.56 7.35L16.15 8.39C15.38 7.5 14.32 6.86 13.12 6.62L12.75 4H11.25L10.88 6.61C9.68 6.86 8.62 7.5 7.85 8.39L5.44 7.35L4.69 8.65L6.8 10.2C6.4 11.37 6.4 12.64 6.8 13.8L4.68 15.36L5.43 16.66L7.86 15.62C8.63 16.5 9.68 17.14 10.87 17.38L11.24 20H12.35C12.61 20.75 13 21.42 13.54 22M15.96 12.36C16 12.24 16 12.12 16 12C16 9.79 14.21 8 12 8S8 9.79 8 12 9.79 16 12 16C12.12 16 12.24 16 12.36 15.96C12.97 14.29 14.29 12.97 15.96 12.36M12 14C10.9 14 10 13.11 10 12S10.9 10 12 10 14 10.9 14 12 13.11 14 12 14M16 15V21L21 18L16 15Z" /></svg>`;
const filterOff = b `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="M16.021 16.5 2.438 2.917l.77-.771 13.584 13.583ZM3.208 5.417V4.333h1.73v1.084Zm2 3.895V8.229h3.646v1.083Zm3.396-3.895L7.521 4.333h9.271v1.084Zm-.396 7.812v-1.083h3.584v1.083ZM12.5 9.312l-1.083-1.083h3.375v1.083Z"/></svg>`;
const incremental = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path d="m10 13.458-1.083-2.416L6.5 9.958l2.417-1.083L10 6.458l1.083 2.417L13.5 9.958l-2.417 1.084Zm0 5.084q-2.354 0-4.323-1.188-1.969-1.187-3.177-3.271v2.709H1.417v-4.5h4.479v1.083H3.375q1.021 1.896 2.771 2.99 1.75 1.093 3.854 1.093 2.458 0 4.406-1.458 1.948-1.458 2.74-3.771l1.042.229q-.813 2.73-3.073 4.407-2.261 1.677-5.115 1.677ZM1.458 9.208q.125-1.354.604-2.52.48-1.167 1.355-2.209l.791.75q-.687.875-1.104 1.834-.416.958-.562 2.145ZM5.25 4.167l-.75-.771q1.021-.875 2.24-1.365 1.218-.489 2.51-.593v1.083q-1.083.125-2.104.552Q6.125 3.5 5.25 4.167Zm9.479 0q-.812-.667-1.864-1.105-1.053-.437-2.115-.541V1.438q1.312.083 2.521.583 1.208.5 2.229 1.375Zm2.709 5.041q-.146-1.146-.563-2.146-.417-1-1.104-1.833l.791-.771q.855 1 1.365 2.209.511 1.208.615 2.541Z"/></svg>`;
const refresh = b `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" /></svg>`;
const instancesIcon = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="padding: 1px;box-sizing: border-box;" height="18" width="18" viewBox="0 0 20 20" ><path d="M10 9q-3.062 0-5.031-.844Q3 7.312 3 6q0-1.229 2.062-2.115Q7.125 3 10 3q2.875 0 4.938.885Q17 4.771 17 6q0 1.312-1.969 2.156Q13.062 9 10 9Zm0 4q-2.979 0-4.99-.865Q3 11.271 3 10V8.042q0 .604.562 1.135.563.531 1.521.938.959.406 2.229.645Q8.583 11 10 11q1.417 0 2.688-.24 1.27-.239 2.229-.645.958-.407 1.521-.938Q17 8.646 17 8.042V10q0 1.271-2.01 2.135Q12.979 13 10 13Zm0 4q-2.917 0-4.958-.906Q3 15.188 3 13.896v-1.958q0 .604.573 1.156.573.552 1.542.979.968.427 2.239.677Q8.625 15 10 15t2.646-.25q1.271-.25 2.239-.677.969-.427 1.542-.979.573-.552.573-1.156v1.958q0 1.292-2.042 2.198Q12.917 17 10 17Z"/></svg>`;
const superHierarchies = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 -1 21 20"><path d="M10 16q-1.667 0-2.833-1.167Q6 13.667 6 12q0-1.479.927-2.573.927-1.094 2.323-1.365V4.875L8.062 6.062 7 5l3-3 3 3-1.062 1.062-1.188-1.187v3.187q1.396.271 2.323 1.365Q14 10.521 14 12q0 1.667-1.167 2.833Q11.667 16 10 16Zm0-1.5q1.042 0 1.771-.729.729-.729.729-1.771 0-1.042-.729-1.771Q11.042 9.5 10 9.5q-1.042 0-1.771.729Q7.5 10.958 7.5 12q0 1.042.729 1.771.729.729 1.771.729Zm0-2.5Z"/></svg>`;
const subHierarchies = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 21 20"><path d="m10 18-3-3 1.062-1.062 1.188 1.187v-3.187q-1.396-.271-2.323-1.365Q6 9.479 6 8q0-1.667 1.167-2.833Q8.333 4 10 4q1.667 0 2.833 1.167Q14 6.333 14 8q0 1.479-.927 2.573-.927 1.094-2.323 1.365v3.187l1.188-1.187L13 15Zm0-7.5q1.042 0 1.771-.729Q12.5 9.042 12.5 8q0-1.042-.729-1.771Q11.042 5.5 10 5.5q-1.042 0-1.771.729Q7.5 6.958 7.5 8q0 1.042.729 1.771.729.729 1.771.729ZM10 8Z"/></svg>`;
const rubbishBin = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M6.5 17q-.625 0-1.062-.438Q5 16.125 5 15.5v-10H4V4h4V3h4v1h4v1.5h-1v10q0 .625-.438 1.062Q14.125 17 13.5 17Zm7-11.5h-7v10h7ZM8 14h1.5V7H8Zm2.5 0H12V7h-1.5Zm-4-8.5v10Z"/></svg>`;
const mastroEndpointIcon = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M3.542 9.25q-.563 0-.948-.396-.386-.396-.386-.937V5.542q0-.542.396-.938.396-.396.938-.396H11V9.25Zm0-1.083h6.375V5.292H3.542q-.104 0-.177.073t-.073.177v2.375q0 .104.073.177t.177.073Zm0 7.625q-.542 0-.938-.396-.396-.396-.396-.938v-2.375q0-.541.396-.937t.938-.396H12.5v5.042Zm0-1.084h7.875v-2.875H3.542q-.104 0-.177.073t-.073.177v2.375q0 .104.073.177t.177.073ZM14 15.792V9.25h-1.5V4.208h5.188L16.25 7.854h1.438Zm-9.896-2.021h1v-1h-1Zm0-6.542h1v-1h-1Zm-.812.938V5.292v2.875Zm0 6.541v-2.875 2.875Z"/></svg>`;
const stopCircle = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M7.208 12.792h5.584V7.208H7.208ZM10 17.583q-1.562 0-2.948-.593-1.385-.594-2.417-1.625-1.031-1.032-1.625-2.417-.593-1.386-.593-2.948 0-1.583.593-2.958.594-1.375 1.625-2.407Q5.667 3.604 7.052 3.01 8.438 2.417 10 2.417q1.583 0 2.958.593 1.375.594 2.407 1.625 1.031 1.032 1.625 2.417.593 1.386.593 2.948t-.593 2.948q-.594 1.385-1.625 2.417-1.032 1.031-2.417 1.625-1.386.593-2.948.593Zm0-1.083q2.708 0 4.604-1.896T16.5 10q0-2.708-1.896-4.604T10 3.5q-2.708 0-4.604 1.896T3.5 10q0 2.708 1.896 4.604T10 16.5Zm0-6.5Z"/></svg>`;
const equivalentClasses = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="m10 17-3-3 1.062-1.062 1.188 1.187v-8.25L8.062 7.062 7 6l3-3 3 3-1.062 1.062-1.188-1.187v8.25l1.188-1.187L13 14Z"/></svg>`;
const search$1 = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="M765 912 526 673q-30 22-65.792 34.5T384.035 720Q284 720 214 650t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.035q0 40.381-12.5 76.173T577 622l239 239-51 51ZM384 648q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z"/></svg>`;
const insertInGraph = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M4.5 17.083q-.667 0-1.125-.458-.458-.458-.458-1.125V7.833q0-.666.458-1.125.458-.458 1.125-.458h2.896v1.333H4.5q-.083 0-.167.084-.083.083-.083.166V15.5q0 .083.083.167.084.083.167.083h11q.083 0 .167-.083.083-.084.083-.167V7.833q0-.083-.083-.166-.084-.084-.167-.084h-2.896V6.25H15.5q.667 0 1.125.458.458.459.458 1.125V15.5q0 .667-.458 1.125-.458.458-1.125.458Zm5.5-4.041L6.938 9.979l.937-.937L9.333 10.5V.625h1.334V10.5l1.458-1.458.937.937Z"/></svg>`;
const cross = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="m291 816-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z"/></svg>`;
// https://materialdesignicons.com/icon/counter
const counter = b `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M4,6V18H11V6H4M20,18V6H18.76C19,6.54 18.95,7.07 18.95,7.13C18.88,7.8 18.41,8.5 18.24,8.75L15.91,11.3L19.23,11.28L19.24,12.5L14.04,12.47L14,11.47C14,11.47 17.05,8.24 17.2,7.95C17.34,7.67 17.91,6 16.5,6C15.27,6.05 15.41,7.3 15.41,7.3L13.87,7.31C13.87,7.31 13.88,6.65 14.25,6H13V18H15.58L15.57,17.14L16.54,17.13C16.54,17.13 17.45,16.97 17.46,16.08C17.5,15.08 16.65,15.08 16.5,15.08C16.37,15.08 15.43,15.13 15.43,15.95H13.91C13.91,15.95 13.95,13.89 16.5,13.89C19.1,13.89 18.96,15.91 18.96,15.91C18.96,15.91 19,17.16 17.85,17.63L18.37,18H20M8.92,16H7.42V10.2L5.62,10.76V9.53L8.76,8.41H8.92V16Z" /></svg>`;
const labelIcon = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="m806.5 576-165 205q-10.833 13-25.205 20-14.371 7-30.795 7h-317q-27.637 0-47.319-19.681Q201.5 768.638 201.5 741V411q0-27.638 19.681-47.319Q240.863 344 268.5 344h317q16.727 0 30.983 7t25.017 20l165 205Zm-86 0L587.596 411H268.5v330h319l133-165Zm-452 0v165-330 165Z"/></svg>`;
const commentIcon = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20" style="padding: 2px; box-sizing: border-box;"><path d="M246 650h468v-79H246v79Zm0-116h468v-79H246v79Zm0-116h468v-79H246v79Zm624 543L716 807H169q-32.587 0-55.794-23.206Q90 760.588 90 728V264q0-32.588 23.206-55.794Q136.413 185 169 185h622q32.588 0 55.794 23.206Q870 231.412 870 264v697ZM169 264v464h580l42 42V264H169Zm0 0v506-506Z"/></svg>`;
const authorIcon = b `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" fill="rgba(255, 255, 255, 0)" /><path fill="currentColor" d="M2 17v3h8v-1.89H3.9V17c0-.64 3.13-2.1 6.1-2.1c.96.01 1.91.14 2.83.38l1.52-1.52c-1.4-.47-2.85-.73-4.35-.76c-2.67 0-8 1.33-8 4m8-13C7.79 4 6 5.79 6 8s1.79 4 4 4s4-1.79 4-4s-1.79-4-4-4m0 6c-1.1 0-2-.89-2-2s.9-2 2-2s2 .9 2 2s-.89 2-2 2m11.7 3.35l-1 1l-2.05-2l1-1a.55.55 0 0 1 .77 0l1.28 1.28c.21.21.21.56 0 .77M12 18.94l6.06-6.06l2.05 2l-6 6.07H12v-2.01"/></svg>`;
const addDiagramIcon = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="M746.5 801.5v-132h-132v-67h132v-132h67v132h132v67h-132v132h-67Zm-600-132v-379h667v113h-67v-46h-533v245h334v67h-401Zm67-134v-178 245-67Z"/></svg>`;
const addClassIcon = b `<svg fill="var(--gscape-color-class-contrast)" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="M480.207 953q-78.083 0-146.895-29.75-68.812-29.75-120.838-81.522-52.027-51.772-81.75-120.954Q101 651.593 101 573.883q0-148.383 98.783-255.444Q298.567 211.378 444 197v87q-109 14.5-182.5 96.729T188 574.536q0 120.964 85.171 206.214Q358.343 866 480 866q72.5 0 132.25-31.5T712 750l77 43q-53 73.5-133.176 116.75Q575.649 953 480.207 953ZM447 737V607H317v-67h130V410h67v130h130v67H514v130h-67Zm378-6-77-43q11-26 17.5-55t6.5-59q0-111.864-73.75-193.932Q624.5 298 516 284v-87q144.933 14.397 243.967 121.604Q859 425.812 859 573.793q0 42.194-8.765 81.511Q841.471 694.621 825 731Z"/></svg>`;
const addDataPropertyIcon = b `<svg fill="var(--gscape-color-data-property-contrast)" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="M480.207 953q-78.083 0-146.895-29.75-68.812-29.75-120.838-81.522-52.027-51.772-81.75-120.954Q101 651.593 101 573.883q0-148.383 98.783-255.444Q298.567 211.378 444 197v87q-109 14.5-182.5 96.729T188 574.536q0 120.964 85.171 206.214Q358.343 866 480 866q72.5 0 132.25-31.5T712 750l77 43q-53 73.5-133.176 116.75Q575.649 953 480.207 953ZM447 737V607H317v-67h130V410h67v130h130v67H514v130h-67Zm378-6-77-43q11-26 17.5-55t6.5-59q0-111.864-73.75-193.932Q624.5 298 516 284v-87q144.933 14.397 243.967 121.604Q859 425.812 859 573.793q0 42.194-8.765 81.511Q841.471 694.621 825 731Z"/></svg>`;
const addIndividualIcon = b `<svg fill="var(--gscape-color-class-instance-contrast)" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="M480.207 953q-78.083 0-146.895-29.75-68.812-29.75-120.838-81.522-52.027-51.772-81.75-120.954Q101 651.593 101 573.883q0-148.383 98.783-255.444Q298.567 211.378 444 197v87q-109 14.5-182.5 96.729T188 574.536q0 120.964 85.171 206.214Q358.343 866 480 866q72.5 0 132.25-31.5T712 750l77 43q-53 73.5-133.176 116.75Q575.649 953 480.207 953ZM447 737V607H317v-67h130V410h67v130h130v67H514v130h-67Zm378-6-77-43q11-26 17.5-55t6.5-59q0-111.864-73.75-193.932Q624.5 298 516 284v-87q144.933 14.397 243.967 121.604Q859 425.812 859 573.793q0 42.194-8.765 81.511Q841.471 694.621 825 731Z"/></svg>`;
const addObjectPropertyIcon = b `<svg fill="var(--gscape-color-object-property-contrast)" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="m575 762-47-47.5 105-105H199v-67h434l-105-105 47-47.5 186 186-186 186Z"/></svg>`;
const addISAIcon = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="m575 762-47-47.5 105-105H199v-67h434l-105-105 47-47.5 186 186-186 186Z"/></svg>`;
const addInstanceIcon = b `<svg fill="var(--gscape-color-class-instance-contrast)" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="m575 762-47-47.5 105-105H199v-67h434l-105-105 47-47.5 186 186-186 186Z"/></svg>`;
const addParentClassIcon = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M479.747-194.5q-78.747 0-133.997-55.471-55.25-55.471-55.25-134.173 0-69.733 44.5-121.795Q379.5-558 446.5-570.562V-732.5l-58 58.5-47.5-47.5 139-139 139 139-47.5 47-58-58v161.938q67 12.411 111.5 64.475 44.5 52.063 44.5 121.798 0 79.289-55.503 134.539-55.502 55.25-134.25 55.25Zm.224-67q51.029 0 86.779-35.721 35.75-35.72 35.75-86.75 0-51.029-35.721-86.779-35.72-35.75-86.75-35.75-51.029 0-86.779 35.721-35.75 35.72-35.75 86.75 0 51.029 35.721 86.779 35.72 35.75 86.75 35.75ZM480-384Z"/></svg>`;
const addChildClassIcon = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m480-99.5-139-139 47.5-47 58 58v-161.938q-67-12.411-111.5-64.475-44.5-52.063-44.5-121.798 0-79.289 55.503-134.539 55.502-55.25 134.25-55.25 78.747 0 133.997 55.471 55.25 55.471 55.25 134.173 0 69.733-44.5 121.795Q580.5-402 513.5-389.438V-227.5l58-58.5 47.5 47.5-139 139Zm-.029-354q51.029 0 86.779-35.721 35.75-35.72 35.75-86.75 0-51.029-35.721-86.779-35.72-35.75-86.75-35.75-51.029 0-86.779 35.721-35.75 35.72-35.75 86.75 0 51.029 35.721 86.779 35.72 35.75 86.75 35.75ZM480-576Z"/></svg>`;
const addSubhierarchyIcon = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M251.788-410q-29.288 0-49.538-20.462Q182-450.925 182-480.212q0-29.288 20.462-49.538Q222.925-550 252.212-550q29.288 0 49.538 20.462Q322-509.075 322-479.788q0 29.288-20.462 49.538Q281.075-410 251.788-410Zm228 0q-29.288 0-49.538-20.462Q410-450.925 410-480.212q0-29.288 20.462-49.538Q450.925-550 480.212-550q29.288 0 49.538 20.462Q550-509.075 550-479.788q0 29.288-20.462 49.538Q509.075-410 479.788-410Zm228 0q-29.288 0-49.538-20.462Q638-450.925 638-480.212q0-29.288 20.462-49.538Q678.925-550 708.212-550q29.288 0 49.538 20.462Q778-509.075 778-479.788q0 29.288-20.462 49.538Q737.075-410 707.788-410Z"/></svg>`;
const addInputIcon = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M767.867-386.5q-29.127 0-52.617-17-23.489-17-33.806-43H98.5v-67H681q10.35-26 33.874-43t52.693-17q38.933 0 66.433 27.275 27.5 27.274 27.5 66 0 38.725-27.378 66.225-27.379 27.5-66.255 27.5Z"/></svg>`;
const renameIcon = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M445-152v-67h71v67h-71Zm0-588v-67h71v67h-71Zm148 588v-67h71v67h-71Zm0-588v-67h71v67h-71Zm148 588v-67h67v67h-67Zm0-144v-71h67v71h-67Zm0-148v-71h67v71h-67Zm0-148v-71h67v71h-67Zm0-148v-67h67v67h-67ZM153-152v-67h83v-521h-83v-67h233v67h-83v521h83v67H153Z"/></svg>`;
const editIcon = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M210-210.5h55l338-338-55-55-338 338v55ZM770-602 602-771l46-46q24-24 56.25-23.75T760-816.5l56.5 56.5q22.5 22.5 22 56.25t-23 56.25L770-602Zm-54.5 54L299-131.5H131v-168L547.5-716l168 168ZM576-575.5l-28-28 55 55-27-27Z"/></svg>`;
const sankey = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style="padding: 1px; box-sizing: border-box;"><path d="M20 4V6H4V4H2V12H4V10C8.16 10 9.92 12.11 11.77 14.34S15.65 19 20 19V21H22V15H20V17C16.59 17 15.07 15.17 13.31 13.06C11.34 10.69 9.1 8 4 8H20V10H22V4Z" /></svg>`;
const pathIcon = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M744-144q-41 0-72-24t-42-60H396q-55 0-93.5-38.5T264-360q0-55 38.5-93.5T396-492h120q34.65 0 59.325-24.748Q600-541.496 600-576.248 600-611 575.325-635.5T516-660H330q-11 36-42 60t-72 24q-50 0-85-35t-35-85q0-50 35-85t85-35q41 0 72 24t42 60h186q65 0 110.5 45.5T672-576q0 65-45.5 110.5T516-420H396q-24.75 0-42.375 17.677T336-359.823Q336-335 353.625-317.5T396-300h234q11-36 42-60t72-24q50 0 85 35t35 85q0 50-35 85t-85 35ZM216-648q20.4 0 34.2-13.8Q264-675.6 264-696q0-20.4-13.8-34.2Q236.4-744 216-744q-20.4 0-34.2 13.8Q168-716.4 168-696q0 20.4 13.8 34.2Q195.6-648 216-648Z"/></svg>`;
const tools = b `<svg fill="currentColor" style="box-sizing: border-box; padding: 1px" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M735-98q-6.5 0-12.75-2.75T711.5-108L515-304.5q-4.5-4.5-7.75-11.25T504-329q0-6.5 3.25-12.75T515-352.5l92.5-92.5q4.5-4.5 10.75-7.75T631-456q6.5 0 13.25 3.25T655.5-445L852-248.5q4.5 4.5 7.25 10.75T862-225q0 6.5-2.75 13.25T852-200.5L758.5-108q-4.5 4.5-10.75 7.25T735-98Zm0-82 45-45-149.5-149.5-45 45L735-180ZM226-98.5q-7.5 0-14-3.25t-11-7.75L107.5-203q-4.5-4.5-6.75-10.5T98.5-226q0-6.5 2.75-12.5t7.25-10.5L289-429.5h93l50.5-50.5L286-626.5h-57L99.5-755 204-860.5 333.5-731v57L480-527.5 595.5-643l-40-41 62.5-62.5H513L483.5-776 616-908.5l29.5 29.5v105l38.5-38.5L826-670q16.5 16.5 26 39t9.5 46q0 23-9 44.5t-24.5 38l-98-98-46 45-40-40L429.5-382v93L250-108.5q-4.5 4.5-10.5 7.25T226-98.5Zm-1-81L363.5-318v-45.5H317L180.5-226l44.5 46.5Zm0 0L180.5-226l22.5 23 22 23.5Zm510-.5 45-45-45 45Z"/></svg>`;
const undo = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M293-202v-67h289q46.5 0 77.75-34.5T691-386q0-48-31.25-82.5T582-503H331l92.5 92.5-48 47.5L202-536.5 375.5-710l48 48-92.5 92h251q74 0 125 54.25T758-386q0 75.5-51 129.75T582-202H293Z"/></svg>`;
const redo = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M378-202q-74 0-125-54.25T202-386q0-75.5 51-129.75T378-570h251l-92.5-92 48-48L758-536.5 584.5-363l-48-47.5L629-503H378q-46.5 0-77.75 34.5T269-386q0 48 31.25 82.5T378-269h289v67H378Z"/></svg>`;
const addPack = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M621.5-622H740 621.5ZM221-622h331-17.5 9H221Zm5.5-67H734l-48-50H273.915L226.5-689Zm179 239 74.5-37 74.5 37v-172h-149v172Zm168 296H224q-29.2 0-49.6-20.269Q154-194.538 154-223v-461q0-12.85 5.25-25.425 5.25-12.575 14.013-21.353L226.5-786q10.5-10.5 22.191-15.25 11.691-4.75 25.482-4.75h411.654q14.144 0 26.158 4.75Q724-796.5 733.5-786l53 55q10 9 14.75 21.575T806-684v165.5q-9.162-1.333-18.617-1.417Q777.928-520 768-520q-7 0-14.5.5T739-518v-104H621.5v153.5q-22 18.5-40 42.5T552-375l-72-37-141.5 71v-281H221v401h322.5q5 18 12.75 34.75T573.5-154ZM733-144v-108H625v-67h108v-108h67v108h108v67H800v108h-67Z"/></svg>`;
const protocol = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" style="padding: 2px; box-sizing: border-box;"><path d="M18 20H14L18 4H22M16 4H12L8 20H12M2 16.5A2.5 2.5 0 0 0 4.5 19A2.5 2.5 0 0 0 7 16.5A2.5 2.5 0 0 0 4.5 14A2.5 2.5 0 0 0 2 16.5M2 9.5A2.5 2.5 0 0 0 4.5 12A2.5 2.5 0 0 0 7 9.5A2.5 2.5 0 0 0 4.5 7A2.5 2.5 0 0 0 2 9.5Z" /></svg>`;
const notes = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M288-168v-432q0-30.076 21-51.038Q330-672 360-672h432q29.7 0 50.85 21.15Q864-629.7 864-600v312L672-96H360q-29.7 0-50.85-21.15Q288-138.3 288-168ZM98-703q-5-29 12.5-54t46.5-30l425-76q29-5 53.5 12.5T665-804l11 60h-73l-9-48-425 76 47 263v228q-16-7-27.5-21.082Q177-260.163 174-278L98-703Zm262 103v432h264v-168h168v-264H360Zm216 216Z"/></svg>`;
const colors = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m344-169.5-222-221q-8.5-8.5-13-18.25T105-430q0-11.5 4.25-22.25T122-471l214.5-214L214-807.5l48-46.5 381.5 383q8.5 8.5 12.75 18.75T660.5-431q0 11.5-4.25 21.75T643.5-390.5l-220 221q-8 8.5-18.25 12.75t-21.75 4.25q-11.5-.5-21.25-4.5T344-169.5Zm39-469L175.5-431v-2 2h415v-2 2L383-638.5ZM770-154q-35.5 0-59.75-24.25T686-238q0-23.5 10.25-45.25T721-324l49-62 49 62q14.5 18.5 24.75 40.5T854-238q0 36-24.5 60T770-154Z"/></svg>`;
const colorPalette = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M480-106q-77.5 0-145.549-29.158-68.048-29.158-119.092-80.201-51.043-51.044-80.201-119.092Q106-402.5 106-480.009 106-558.5 135.5-626 165-693.5 217-744.75T339-825q70-29 148.804-29 75.908 0 142.552 26.5Q697-801 746.741-755.371q49.741 45.63 78.5 106.75Q854-587.5 854-518q0 93-64.75 158t-158.164 65H565q-9.5 0-16.75 5.75T541-274q0 15.947 15 27.724Q571-234.5 571-191q0 29.5-24 57.25T480-106Zm0-374Zm-213 33q23.7 0 40.35-16.65Q324-480.3 324-504q0-23.7-16.65-40.35Q290.7-561 267-561q-23.7 0-40.35 16.65Q210-527.7 210-504q0 23.7 16.65 40.35Q243.3-447 267-447Zm119-142q23.7 0 40.35-16.65Q443-622.3 443-646q0-23.7-16.65-40.35Q409.7-703 386-703q-23.7 0-40.35 16.65Q329-669.7 329-646q0 23.7 16.65 40.35Q362.3-589 386-589Zm189 0q23.7 0 40.35-16.65Q632-622.3 632-646q0-23.7-16.65-40.35Q598.7-703 575-703q-23.7 0-40.35 16.65Q518-669.7 518-646q0 23.7 16.65 40.35Q551.3-589 575-589Zm118 142q23.7 0 40.35-16.65Q750-480.3 750-504q0-23.7-16.65-40.35Q716.7-561 693-561q-23.7 0-40.35 16.65Q636-527.7 636-504q0 23.7 16.65 40.35Q669.3-447 693-447ZM480.158-173q10.842 0 17.342-8.5Q504-190 504-197q0-16-14.5-28.5T475-275q0-37.5 25.75-62.25T564-362h67q66 0 111-45.25T787-518q0-112.5-87.25-190.75T487.914-787Q356.5-787 264.75-697.453T173-480q0 127.5 89.75 217.25T480.158-173Z"/></svg>`;
const warning = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m48-144 432-720 432 720H48Zm127-72h610L480-724 175-216Zm304.789-48Q495-264 505.5-274.289q10.5-10.29 10.5-25.5Q516-315 505.711-325.5q-10.29-10.5-25.5-10.5Q465-336 454.5-325.711q-10.5 10.29-10.5 25.5Q444-285 454.289-274.5q10.29 10.5 25.5 10.5ZM444-384h72v-192h-72v192Zm36-86Z"/></svg>`;
const error = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M479.789-288Q495-288 505.5-298.289q10.5-10.29 10.5-25.5Q516-339 505.711-349.5q-10.29-10.5-25.5-10.5Q465-360 454.5-349.711q-10.5 10.29-10.5 25.5Q444-309 454.289-298.5q10.29 10.5 25.5 10.5ZM444-432h72v-240h-72v240Zm36.276 336Q401-96 331-126q-70-30-122.5-82.5T126-330.958q-30-69.959-30-149.5Q96-560 126-629.5t82.5-122Q261-804 330.958-834q69.959-30 149.5-30Q560-864 629.5-834t122 82.5Q804-699 834-629.276q30 69.725 30 149Q864-401 834-331q-30 70-82.5 122.5T629.276-126q-69.725 30-149 30ZM480-168q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg>`;
const toggleCatalog = b `<svg style="padding: 2px; box-sizing: border-box;" viewBox="64 64 896 896" width="20px" height="20px" fill="currentColor" aria-hidden="true"><path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 000-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0014.4 7z"></path></svg>`;
const domain = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M208-129q-32.587 0-55.794-23.206Q129-175.413 129-208v-544q0-32.588 23.206-55.794Q175.413-831 208-831h544q32.588 0 55.794 23.206Q831-784.588 831-752v544q0 32.587-23.206 55.794Q784.588-129 752-129H208Zm0-79h544v-544H208v544Zm0 0v-544 544Z"/></svg>`;
const range = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M208-129q-32.938 0-55.969-23.031T129-208v-544q0-32.938 23.031-55.969T208-831h544q32.938 0 55.969 23.031T831-752v544q0 32.938-23.031 55.969T752-129H208Z"/></svg>`;
const playCircle = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m387-318 255-162-255-162v324Zm93.276 212q-77.183 0-145.341-29.263-68.159-29.263-119.297-80.5Q164.5-267 135.25-335.046 106-403.091 106-480.458q0-77.449 29.263-145.107 29.263-67.659 80.5-118.797Q267-795.5 335.046-824.75 403.091-854 480.458-854q77.449 0 145.107 29.263 67.659 29.263 118.797 80.5Q795.5-693 824.75-625.188 854-557.377 854-480.276q0 77.183-29.263 145.341-29.263 68.159-80.5 119.297Q693-164.5 625.188-135.25 557.377-106 480.276-106ZM480-173q127.5 0 217.25-89.75T787-480q0-127.5-89.75-217.25T480-787q-127.5 0-217.25 89.75T173-480q0 127.5 89.75 217.25T480-173Zm0-307Z"/></svg>`;
const keep = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m618-479 94 93v67H513.5v221L480-64l-33.5-34v-221H248v-67l94-93v-262h-48v-67h372v67h-48v262Zm-275 93h274l-66-65v-290H409v290l-66 65Zm137 0Z"/></svg>`;
const keepOff = b `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M666-808v67h-48v305l-67-67v-238H409v96l-81.5-81.5-13.5-28h-20V-808h372ZM480-64l-33.5-34v-221H248v-67l94-93v-45.462L101.5-763.5 149-811l658 659-46.5 47.5L547-319h-33.5v221L480-64ZM343-386h136.5L408-457.5l1 6.5-66 65Zm136-183Zm-71 111.5Z"/></svg>`;
const entityIcons = {
    [TypesEnum.CLASS]: classIcon,
    [TypesEnum.OBJECT_PROPERTY]: objectPropertyIcon,
    [TypesEnum.DATA_PROPERTY]: dataPropertyIcon,
    [TypesEnum.INDIVIDUAL]: individualIcon,
    [TypesEnum.ANNOTATION_PROPERTY]: annotationPropertyIcon,
};
const annotationIcons = {
    label: labelIcon,
    comment: commentIcon,
    author: authorIcon,
    deprecated: undefined,
    isDefinedBy: undefined,
    versionInfo: undefined,
    priorVersion: undefined,
    incompatibleWith: undefined,
    backwardCompatible: undefined,
    backwardCompatibleWith: undefined,
};

var grapholscapeLogo = x `<?xml version="1.0" encoding="utf-8"?>
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

var index$3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    addChildClassIcon: addChildClassIcon,
    addClassIcon: addClassIcon,
    addDataPropertyIcon: addDataPropertyIcon,
    addDiagramIcon: addDiagramIcon,
    addISAIcon: addISAIcon,
    addIndividualIcon: addIndividualIcon,
    addInputIcon: addInputIcon,
    addInstanceIcon: addInstanceIcon,
    addObjectPropertyIcon: addObjectPropertyIcon,
    addPack: addPack,
    addParentClassIcon: addParentClassIcon,
    addSubhierarchyIcon: addSubhierarchyIcon,
    annotationIcons: annotationIcons,
    arrowDown: arrowDown,
    arrow_right: arrow_right,
    authorIcon: authorIcon,
    blankSlateDiagrams: blankSlateDiagrams,
    bubbles: bubbles,
    centerDiagram: centerDiagram,
    check: check,
    classIcon: classIcon,
    close: close,
    colorPalette: colorPalette,
    colors: colors,
    commentIcon: commentIcon,
    counter: counter,
    cross: cross,
    dataPropertyIcon: dataPropertyIcon,
    diagrams: diagrams,
    domain: domain,
    editIcon: editIcon,
    enterFullscreen: enterFullscreen,
    entityIcons: entityIcons,
    equivalentClasses: equivalentClasses,
    error: error,
    exitFullscreen: exitFullscreen,
    explore: explore,
    filter: filter,
    filterOff: filterOff,
    graphol_icon: graphol_icon,
    grapholscapeLogo: grapholscapeLogo,
    incremental: incremental,
    individualIcon: individualIcon,
    infoFilled: infoFilled,
    info_outline: info_outline,
    insertInGraph: insertInGraph,
    instancesIcon: instancesIcon,
    keep: keep,
    keepOff: keepOff,
    labelIcon: labelIcon,
    lite: lite,
    mastroEndpointIcon: mastroEndpointIcon,
    minus: minus,
    move_bubbles: move_bubbles,
    notes: notes,
    objectPropertyIcon: objectPropertyIcon,
    owl_icon: owl_icon,
    pathIcon: pathIcon,
    playCircle: playCircle,
    plus: plus,
    protocol: protocol,
    range: range,
    redo: redo,
    refresh: refresh,
    renameIcon: renameIcon,
    rubbishBin: rubbishBin,
    sankey: sankey,
    save: save,
    search: search$1,
    searchOff: searchOff,
    settings_icon: settings_icon,
    settings_play: settings_play,
    stopCircle: stopCircle,
    subHierarchies: subHierarchies,
    superHierarchies: superHierarchies,
    toggleCatalog: toggleCatalog,
    tools: tools,
    triangle_down: triangle_down,
    triangle_up: triangle_up,
    tune: tune,
    undo: undo,
    warning: warning
});

const animationDuration = i$1 `200ms`;
const BOTTOM_RIGHT_WIDGET = i$1 `bottom-right-widget`;
var baseStyle = i$1 `
*, :host {
  line-height: initial;
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

.background-propagation, .background-propagation * {
  background: inherit;
}

.gscape-panel {
  background-color: var(--gscape-color-bg-default);
  box-shadow: 0 2px 10px 0 var(--gscape-color-shadow);
  border-radius: var(--gscape-border-radius);
  border: solid 1px var(--gscape-color-border-subtle);
  width: fit-content;
  min-width: 130px;
  max-width: 50vw;
  max-height: 50vh;
  overflow: auto;
  padding: 8px;
  position: relative;
}

::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}

::-webkit-scrollbar:hover {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--gscape-color-fg-muted);
  -webkit-border-radius: 1ex;
}

.gscape-panel-in-tray {
  position: absolute;
  display: flex;
  flex-direction: column;
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

.actionable:hover, .actionable:focus, .actionable:focus-visible {
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
  position:absolute;
  margin-top: 4px;
  top: 100%;
  animation-name: drop-down;
  animation-duration: ${animationDuration};
  z-index: 999;
}

@keyframes drop-down {
  from {opacity: 0; top: -20%;}
  to {opacity: 1; top: 100%;}
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

.vr {
  width: 1px;
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
  text-overflow: ellipsis;
}

.rtl {
  direction: rtl;
  text-align: left;
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
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chip, .chip-neutral {
  display: inline-flex;
  border: 1px solid var(--gscape-color-accent);
  color: var(--gscape-color-accent);
  border-radius: 16px;
  padding: 2px 6px;
  background: var(--gscape-color-accent-subtle);
  margin: 1px 2px;
}

.chip-neutral {
  color: inherit;
  background-color: var(--gscape-color-neutral-muted);
  border-color: var(--gscape-color-border-subtle);
  padding-top: 1px;
}

.area {
  background: var(--gscape-color-bg-inset);
  border-radius: calc(var(--gscape-border-radius) - 2px);
  padding: 4px 4px 4px 6px;
  border: solid 1px var(--gscape-color-border-subtle);
  margin-bottom: 18px;
}

.area > .area-content {
  padding: 8px;
}

.tip {
  font-size: 90%;
  border-bottom: dotted 2px;
  cursor: help;
}

.tip: hover {
  color:inherit;
}

.top-bar {
  display: flex;
  flex-direction: row-reverse;
  line-height: 1;
}

.top-bar.traslated-down {
  position: absolute;
  right: 0;
}
`;

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
            this.isDefaultClosed = true;
            this.onblur = (ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                const target = ev.relatedTarget;
                if (target && !this.contains(target)) {
                    this.blur();
                }
            };
            this.onTogglePanel = () => { };
        }
        get panel() { var _a; return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('#drop-panel'); }
        togglePanel() {
            this.isPanelClosed() ? this.openPanel() : this.closePanel();
            this.onTogglePanel();
        }
        openPanel() {
            var _a;
            (_a = this.panel) === null || _a === void 0 ? void 0 : _a.classList.remove('hide');
            this.requestUpdate();
            // Blur other widgets in bottom-right-buttons-tray, keep only one panel open at time
            const container = this.parentElement;
            if (container && container.classList.contains('gscape-ui-buttons-tray')) {
                for (const siblingElement of container.children) {
                    if (siblingElement !== this)
                        siblingElement.blur();
                }
            }
        }
        closePanel() {
            var _a;
            if (!this.isPanelClosed()) {
                (_a = this.panel) === null || _a === void 0 ? void 0 : _a.classList.add('hide');
                this.requestUpdate();
            }
        }
        blur() {
            super.blur();
            this.closePanel();
        }
        isPanelClosed() {
            if (this.panel) {
                return this.panel.classList.contains('hide');
            }
            else {
                return this.isDefaultClosed;
            }
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
            this.style.cssText = `
        z-index: 100;
        position: relative;
        height: 100%;
        width: 100%;
        display: block;
      `;
            this.modalBackground.style.cssText = `
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: var(--gscape-color-bg-default);
        opacity: 0.6;
        display: none;
      `;
            this.hide();
        }
        show() {
            var _a;
            // Manually blur other widgets, needed for chrome/safari/edge
            // For firefox DropPanelMixin's onblur event listener is enough
            const container = this.parentElement;
            if (container) {
                for (const siblingElement of container.children) {
                    if (siblingElement !== this)
                        siblingElement.blur();
                }
                const bottomContainer = (_a = this.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('.gscape-ui-buttons-tray');
                if (bottomContainer) {
                    for (const elem of bottomContainer.children) {
                        elem.blur();
                    }
                }
            }
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

const ContextualWidgetMixin = (superClass) => {
    class ContextualWidgetMixinClass extends superClass {
        constructor() {
            super(...arguments);
            this.tippyWidget = tippy(document.createElement('div'));
            this.cxtWidgetProps = {
                trigger: 'manual',
                allowHTML: true,
                interactive: true,
                placement: "bottom",
                appendTo: ((ref) => {
                    return document.querySelector('.gscape-ui') || ref;
                }) || undefined,
                // content prop can be used when the target is a single element https://atomiks.github.io/tippyjs/v6/constructor/#prop
                content: this,
                offset: [0, 0],
            };
            this.oncontextmenu = (e) => e.preventDefault();
        }
        attachTo(element) {
            this._attachTo(element);
            this.tippyWidget.show();
        }
        attachToSilently(element) {
            this._attachTo(element);
        }
        _attachTo(element) {
            this.tippyWidget.setProps(this.cxtWidgetProps);
            this.tippyWidget.setProps({ getReferenceClientRect: () => element.getBoundingClientRect() });
        }
        hide() {
            this.tippyWidget.hide();
        }
    }
    // Cast return type to your mixin's interface intersected with the superClass type
    return ContextualWidgetMixinClass;
};

var GscapeButtonStyle = i$1 `
:host {
  display: inline-block;
}

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
  align-items: center;
  position: relative;
  color: inherit;
  width: inherit;
  max-width: inherit;
  min-width: inherit;
}

.btn[label] {
  gap: 8px;
  justify-content: space-between;
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
  flex-shrink: 1;
}
`;

var SizeEnum;
(function (SizeEnum) {
    SizeEnum["S"] = "s";
    SizeEnum["M"] = "m";
    SizeEnum["L"] = "l";
})(SizeEnum || (SizeEnum = {}));
class GscapeButton extends BaseMixin(s) {
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
        return x `
      <button
        class="btn btn-${this.size} ${this.type}"
        ?label="${this.label}"
        ?disabled = "${this.disabled}"
        ?active = "${this.active}"
        @click = "${this.clickHandler}"
      >

      ${this.toggled && this.altIcon
            ? x `<slot name="alt-icon" class="slotted-icon"></slot>`
            : x `<slot name="icon" class="slotted-icon"></slot>`}

      ${this.label ? x `<span class="btn-label ellipsed">${this.label}<span>` : ``}

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

function getIconSlot (slotName, icon) {
    const span = document.createElement('span');
    span.innerHTML = icon.strings[0];
    span.setAttribute('slot', slotName);
    return span;
}

const textSpinner = () => x `<div title="Loading" class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;
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
    return x `<div class="lds-ring" title="Loading"><div></div><div></div><div></div><div></div></div>`;
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
class ContentSpinner extends s {
    constructor() {
        super(...arguments);
        this.render = getContentSpinner;
    }
    setColor(newColor) {
        this.style.setProperty('--gscape-color-accent', newColor);
    }
}
ContentSpinner.styles = [
    contentSpinnerStyle,
    i$1 `
      :host {
        display: inline-block;
        position: relative;
        top: 50%;
        transform: translate(-50%, -50%);
        left: 50%;
      }
    `
];
ContentSpinner.properties = {
    color: { type: String }
};
customElements.define('gscape-content-spinner', ContentSpinner);

class NodeButton extends ContextualWidgetMixin(BaseMixin(s)) {
    constructor(content, contentType = 'icon') {
        super();
        this.content = content;
        this.contentType = contentType;
        this.cxtWidgetProps = {
            trigger: 'manual',
            allowHTML: true,
            interactive: true,
            placement: "right",
            appendTo: ((ref) => {
                return document.querySelector('.gscape-ui') || ref;
            }) || undefined,
            // content prop can be used when the target is a single element https://atomiks.github.io/tippyjs/v6/constructor/#prop
            content: this,
            offset: [0, 0],
            hideOnClick: false,
            sticky: true,
        };
    }
    render() {
        return x `
      <div
        class="gscape-panel btn ${this.highlighted ? 'primary' : ''}"
        style="${this.contentType === 'icon' ? 'border-radius: 50%;' : ''}"
      >
      ${this.contentType === 'icon'
            ? getIconSlot('icon', this.content)
            : this.content}
      </div>
    `;
    }
}
NodeButton.properties = {
    content: { type: Object },
    contentType: { type: String, reflect: true },
    highlighted: { type: Boolean, reflect: true },
};
NodeButton.styles = [
    baseStyle,
    textSpinnerStyle,
    contentSpinnerStyle,
    GscapeButtonStyle,
    i$1 `
      .gscape-panel {
        padding: 4px;
        min-width: 20px;
        justify-content: center;
      }

      .highlighted {
        border-color: var(--gscape-color-accent);
      }
    `
];
customElements.define('gscape-node-button', NodeButton);

class GscapeContextMenu extends ContextualWidgetMixin(BaseMixin(s)) {
    constructor() {
        super(...arguments);
        this.commands = [];
        this.customElements = [];
        this.showFirst = 'elements';
        this.loading = false;
        this.subMenus = new Map();
        this.onCommandRun = () => { };
    }
    render() {
        return x `
    <div class="gscape-panel">
      ${this.title ? x `<div>${this.title}</div>` : null}
      ${this.loading
            ? x `<div class="loading-wrapper">${getContentSpinner()}</div>`
            : x `
          ${this.showFirst === 'elements' ? this.customElementsTemplate : null}

          ${this.showFirst === 'elements' && this.customElements.length > 0 && this.commands.length > 0
                ? x `<div class="hr"></div>` : null}

          ${this.commandsTemplate}

          ${this.showFirst === 'commands' && this.customElements.length > 0 && this.commands.length > 0
                ? x `<div class="hr"></div>` : null}

          ${this.showFirst === 'commands' ? this.customElementsTemplate : null}
        `}
    </div>
    `;
    }
    // Attach context menu to a given html element
    attachTo(element, commands, elements) {
        super.attachTo(element);
        this.commands = commands || [];
        this.customElements = elements || [];
    }
    // Attach menu to nothing, show it in arbitrary position
    attachToPosition(position, container, commands, elements) {
        const dummyDiv = document.createElement('div');
        dummyDiv.style.position = 'absolute';
        dummyDiv.style.top = position.y + "px";
        dummyDiv.style.left = position.x + "px";
        container.appendChild(dummyDiv);
        super.attachTo(dummyDiv);
        this.commands = commands || [];
        this.customElements = elements || [];
        const oldOnHide = this.cxtWidgetProps.onHide;
        this.cxtWidgetProps.onHide = (instance) => {
            dummyDiv.remove();
            this.cxtWidgetProps.onHide = undefined;
            if (oldOnHide) {
                oldOnHide(instance);
                //restore oldOnHide
                this.cxtWidgetProps.onHide = oldOnHide;
            }
        };
    }
    handleCommandClick(e) {
        const command = this.commands[e.currentTarget.getAttribute('command-id')];
        if (command.select && !command.disabled) {
            command.select();
            this.onCommandRun();
            this.hide();
        }
    }
    get commandsTemplate() {
        if (this.commands.length > 0) {
            return x `
        <div class="commands">
          ${this.commands.map((command, id) => {
                var _a;
                return x `
              <div
                class="command-entry ${!command.disabled ? 'actionable' : null} ${((_a = this.subMenus.get(id.toString())) === null || _a === void 0 ? void 0 : _a.isConnected) ? 'submenu-visible' : null}"
                command-id="${id}"
                @click=${this.handleCommandClick}
                @mouseover=${() => this.showSubMenu(command, id.toString())}
                title=${command.description}
                ?disabled=${command.disabled}
              >
                ${command.icon ? x `<span class="command-icon slotted-icon">${command.icon}</span>` : null}
                <span class="command-text">${command.content}</span>

                <span style="min-width: 20px">
                  ${command.subCommands
                    ? x `<span class="command-icon slotted-icon">${arrow_right}</span>`
                    : null}
                </span>
              </div>
            `;
            })}
        </div>
      `;
        }
    }
    showSubMenu(command, commandID) {
        var _a;
        if (command.subCommands && !command.disabled) {
            const subMenu = this.subMenus.get(commandID) || new GscapeContextMenu();
            if (!subMenu.isConnected) {
                this.subMenus.set(commandID, subMenu);
                subMenu.cxtWidgetProps.placement = 'right';
                subMenu.cxtWidgetProps.offset = [0, 12];
                subMenu.cxtWidgetProps.onHide = () => {
                    subMenu.remove();
                    this.subMenus.delete(commandID);
                };
                subMenu.loading = true;
                const target = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector(`[command-id = "${commandID}"]`);
                if (target !== null && target !== undefined) {
                    subMenu.attachTo(target);
                    command.subCommands.then(subCommands => {
                        if (this.isConnected) {
                            subMenu.attachTo(target, subCommands);
                            subMenu.loading = false;
                        }
                    });
                }
            }
        }
        this.commands.forEach((c, id) => {
            if (id.toString() !== commandID)
                this.hideSubMenu(id.toString());
        });
        this.requestUpdate();
    }
    hideSubMenu(commandID) {
        const subMenu = this.subMenus.get(commandID);
        if (subMenu) {
            subMenu.hide();
            subMenu.subMenus.forEach((menu, id) => subMenu.hideSubMenu(id));
        }
    }
    get customElementsTemplate() {
        if (this.customElements.length > 0)
            return x `
        <div class="custom-elements">
          ${this.customElements.map(c => x `<div class="custom-element-wrapper">${c}</div>`)}
        </div>    
      `;
    }
}
GscapeContextMenu.properties = {
    commands: { type: Object },
    customElements: { type: Object },
    showFirst: { type: String },
    loading: { type: Boolean },
};
GscapeContextMenu.styles = [
    baseStyle,
    contentSpinnerStyle,
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

      .command-entry[disabled] {
        opacity: 50%;
        cursor: initial;
        pointer-events: none;
      }

      .command-text {
        line-height: 20px;
        flex-grow: 2;
      }

      .gscape-panel, .custom-elements {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: stretch;
      }

      .command-entry.submenu-visible {
        background-color: var(--gscape-color-accent-muted);
      }

      .loading-wrapper {
        min-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `
];
customElements.define('gscape-context-menu', GscapeContextMenu);

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

  .list-item.actionable {
    padding-right: 18px;
  }

  .list-item[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

class GscapeActionListItem extends s {
    constructor() {
        super();
        this.expanded = false;
        this.disabled = false;
        this.tabIndex = 0;
    }
    render() {
        return x `
      <li class="list-item ${this.selected && !this.subtle ? 'selected-item' : null} ellipsed" @click=${this.clickHandler} ?disabled=${this.disabled}>
        <div class="list-item actionable" @click=${this.clickHandler}>
          <slot name="icon" class="slotted-icon" ></slot>
          <span class="list-item-label" title=${this.label}>${this.label}</span>
          <slot name="trailing-icon" class="slotted-icon" ></slot>

          ${this.expanded
            ? x `<slot name="hidden-content" class="slotted-icon" ></slot>`
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
    expanded: { state: true },
    disabled: { type: Boolean }
};
GscapeActionListItem.styles = [baseStyle, actionItemStyle];
customElements.define('gscape-action-list-item', GscapeActionListItem);

var entityListItemStyle = i$1 `
  div.entity-list-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    flex-wrap: var(--custom-wrap, initial);
    min-height: var(--custom-min-height, unset);
  }

  .entity-list-item {
    white-space: nowrap;
  }

  .entity-list-item:hover, .entity-list-item:focus {
    background: var(--gscape-color-neutral-subtle);
    border-radius: var(--gscape-border-radius-btn);
  }

  div.entity-list-item > .slotted-icon, summary > .slotted-icon {
    flex-shrink: 0;
  }

  details.entity-list-item > summary {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .entity-list-item .entity-name {
    flex-grow: 2;
  }

  details.entity-list-item > .summary-body {
    background-color: var(--gscape-color-bg-inset);
    white-space: normal;
    padding: 4px 8px;
  }

  details.entity-list-item > summary {
    padding: 6px 8px 6px 4px;
  }

  details.entity-list-item[open] {
    border: solid 1px var(--gscape-color-border-subtle);
    border-radius: var(--gscape-border-radius);
    margin-bottom: 8px;
  }

  slot[name="accordion-body"]::slotted(*) {
    background-color: var(--gscape-color-bg-inset);
    padding: 4px 8px;
  }

  slot {
    white-space: normal;
  }

  .entity-list-item[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .entity-list-item .color-dot {
    height: 16px;
    width: 16px;
    background: var(--entity-color);
    border-radius: 50%;
    flex-shrink: 0;
  }
`;

class GscapeIconList extends s {
    constructor() {
        super(...arguments);
        this.icons = [];
    }
    render() {
        return x `
      <div class="icons background-propagation">
        ${this.icons.map(i => {
            return x `
            <div class="icon-item">
              <div class="icon-img slotted-icon">${i}
            </div>
          `;
        })}
      </div>
    `;
    }
}
GscapeIconList.properties = {
    icons: { type: Array }
};
GscapeIconList.styles = [
    baseStyle,
    i$1 `
    :host {
      display: inline-block;
    }

    .icons {
      display: flex;
    }

    .icon-item:first-of-type {
      margin-left: 0;
      padding-left: 0;
    }
    
    .icon-item {
      /* Nagative margin make icons overlap to previous one */
      margin-left: -0.5rem;
      border-radius: 9999px;
      background: inherit;
      padding-left: 2px;
    }
    
    .icon-img {
      justify-content: center;
      align-items: center;
      display: flex;
      background: inherit;
    }
    `
];
customElements.define('gscape-icon-list', GscapeIconList);

class GscapeEntityListItem extends s {
    constructor() {
        super(...arguments);
        this._types = [];
        this.displayedName = '';
        this.iri = '';
        this.actionable = false;
        this.asAccordion = false;
        this.disabled = false;
        this.isAccordionOpen = false;
    }
    render() {
        return this.asAccordion
            ? x `
        <details title=${this.displayedName} class="ellipsed entity-list-item" style="overflow: inherit" ?open=${this.isAccordionOpen || false} ?disabled=${this.disabled}>
          <summary class="actionable" @click=${this.handleDetailsClick}>
            ${this.iconNameSlotTemplate()}
          </summary>
          <!-- body defined by consumer as slot element -->
          <slot name="accordion-body" class="summary-body"></slot>
        </details>
      `
            : x `
        <div title=${this.displayedName} class="ellipsed background-propagation entity-list-item ${this.actionable ? 'actionable' : null}" ?disabled=${this.disabled}>
          ${this.iconNameSlotTemplate()}
        </div>
      `;
    }
    iconNameSlotTemplate() {
        return x `
      ${this.asAccordion
            ? x `
          <span class="slotted-icon">
            ${this.isAccordionOpen
                ? x `${arrowDown}`
                : x `${arrow_right}`}
          </span>
        `
            : null}

      ${this._types.length > 0
            ? x `
          <span class="entity-icon slotted-icon">
            <gscape-icon-list .icons=${this._types.map(t => entityIcons[t])}></gscape-icon-list>
          </span>
        `
            : null}

      ${this.color
            ? x `
          <span class="color-dot"></span>
        `
            : null}
      
      <div style="display: flex; flex-direction: column; flex-grow: 2; gap: 4px">
        <span class="entity-name rtl"><bdo dir="ltr">${this.displayedName}</bdo></span>
        <slot name="subrow-item"></slot>
      </div>
      <slot name="trailing-element"></slot>
    `;
    }
    handleDetailsClick(e) {
        e.preventDefault();
        this.isAccordionOpen = !this.isAccordionOpen;
        this.requestUpdate();
    }
    openAccordion() {
        if (this.asAccordion)
            this.isAccordionOpen = true;
    }
    closeAccordion() {
        if (this.asAccordion)
            this.isAccordionOpen = false;
    }
    set types(newTypes) {
        this._types = newTypes || [];
    }
    get types() {
        return this._types;
    }
    set color(newColor) {
        this._color = newColor;
        this.style.setProperty('--entity-color', newColor || null);
        this.requestUpdate();
    }
    get color() { return this._color; }
}
GscapeEntityListItem.properties = {
    types: { type: Array, reflect: true },
    displayedName: { type: String, reflect: true },
    actionable: { type: Boolean },
    asAccordion: { type: Boolean },
    disabled: { type: Boolean },
    isAccordionOpen: { type: Boolean, attribute: false },
    iri: { type: String, reflect: true },
    color: { type: String, reflect: true },
};
GscapeEntityListItem.styles = [
    entityListItemStyle,
    baseStyle,
    i$1 `
      :host {
        display: block;
      }
    `
];
customElements.define('gscape-entity-list-item', GscapeEntityListItem);

class GscapeTextSearch extends s {
    constructor() {
        super(...arguments);
        this._onSearchCallback = () => { };
    }
    render() {
        return x `
      
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

class GscapeEntitySearch extends DropPanelMixin(s) {
    constructor() {
        super(...arguments);
        this.areAllFiltersDisabled = true;
        this.isSearchTextEmpty = true;
    }
    render() {
        var _a, _b, _c, _d;
        return x `
      <div class="search-box">
        <div id="input-wrapper" style="position:relative">
          <span class="slotted-icon muted-text">${search$1}</span>
          <input @keyup=${this.handleKeyPress} type="text" placeholder="Search IRI, labels...">
          ${!this.isSearchTextEmpty
            ? x `
              <gscape-button id="clear-btn" size="s" type="subtle" title="Clear search" @click=${this.clearSearch}>
                ${getIconSlot('icon', cross)}
              </gscape-button>
            `
            : A}
        </div>
        
        ${this.atLeastTwoFilters
            ? x `
              <gscape-button size="m" title="Show/Hide filters" @click=${this.togglePanel}>
                ${getIconSlot('icon', filter)}
              </gscape-button>
            `
            : null}
      </div>
      <div id="drop-panel" class="hide">
        <gscape-entity-type-filter
          class=${(_a = this[TypesEnum.CLASS]) !== null && _a !== void 0 ? _a : A}
          object-property=${(_b = this[TypesEnum.OBJECT_PROPERTY]) !== null && _b !== void 0 ? _b : A}
          data-property=${(_c = this[TypesEnum.DATA_PROPERTY]) !== null && _c !== void 0 ? _c : A}
          individual=${(_d = this[TypesEnum.INDIVIDUAL]) !== null && _d !== void 0 ? _d : A}
        ></gscape-entity-type-filter>
      </div>
      
    `;
    }
    handleKeyPress(e) {
        const inputElement = e.currentTarget;
        if (!inputElement)
            return;
        if (e.key === 'Escape') {
            inputElement.blur();
            inputElement.value = '';
            this.handleSearch('');
            return;
        }
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.handleSearch(inputElement.value);
        }, 500);
    }
    handleSearch(searchText) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateComplete;
            this.dispatchEvent(new CustomEvent('onsearch', {
                bubbles: true,
                composed: true,
                detail: { searchText: searchText }
            }));
            this.isSearchTextEmpty = searchText.length <= 0;
        });
    }
    clearSearch() {
        if (this.input) {
            this.input.value = '';
            this.dispatchEvent(new CustomEvent('onsearch', {
                bubbles: true,
                composed: true,
                detail: { searchText: '' }
            }));
            this.isSearchTextEmpty = true;
        }
    }
    get atLeastTwoFilters() {
        let count = 0;
        if (this[TypesEnum.CLASS] !== undefined)
            count++;
        if (this[TypesEnum.OBJECT_PROPERTY] !== undefined)
            count++;
        if (this[TypesEnum.DATA_PROPERTY] !== undefined)
            count++;
        if (this[TypesEnum.INDIVIDUAL] !== undefined)
            count++;
        return count >= 2;
    }
    get input() { var _a; return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('input'); }
}
TypesEnum.CLASS, TypesEnum.DATA_PROPERTY, TypesEnum.OBJECT_PROPERTY, TypesEnum.INDIVIDUAL;
GscapeEntitySearch.properties = {
    [TypesEnum.CLASS]: { type: Number, reflect: true },
    [TypesEnum.DATA_PROPERTY]: { type: Number, reflect: true },
    [TypesEnum.OBJECT_PROPERTY]: { type: Number, reflect: true },
    [TypesEnum.INDIVIDUAL]: { type: Number, reflect: true },
    isSearchTextEmpty: { type: Boolean, state: true },
};
GscapeEntitySearch.styles = [
    baseStyle,
    GscapeButtonStyle,
    i$1 `
      :host {
        display: block;
        padding: 8px;
      }

      .search-box {
        display: flex;
        align-items: stretch;
        gap: 8px;
      }

      #input-wrapper > .slotted-icon {
        position: absolute;
        left: 6px;
        top: 6px;
      }

      #input-wrapper {
        position: relative;
        flex-grow: 2;
      }

      input {
        width: 100%;
        height: 100%;
        padding-left: 32px;
      }

      #clear-btn {
        position: absolute;
        top: 3px;
        right: 4px;
      }
    `
];
customElements.define('gscape-entity-search', GscapeEntitySearch);

function capitalizeFirstChar (text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

class GscapeEntityTypeFilters extends BaseMixin(s) {
    render() {
        return x `
      <div class="chips-filters">
        ${this[TypesEnum.CLASS] !== undefined
            ? this.getChipTemplate(TypesEnum.CLASS)
            : null}

        ${this[TypesEnum.DATA_PROPERTY] !== undefined
            ? this.getChipTemplate(TypesEnum.DATA_PROPERTY)
            : null}

        ${this[TypesEnum.OBJECT_PROPERTY] !== undefined
            ? this.getChipTemplate(TypesEnum.OBJECT_PROPERTY)
            : null}

        ${this[TypesEnum.INDIVIDUAL] !== undefined
            ? this.getChipTemplate(TypesEnum.INDIVIDUAL)
            : null}
      </div>
    `;
    }
    getChipTemplate(type) {
        const labels = type.split('-');
        labels.forEach(l => capitalizeFirstChar(l));
        const label = labels.join(' ');
        return x `
      <span 
        class="chip actionable ${this[type] && !this.areAllFiltersDisabled ? null : 'disabled'}"
        entity-type=${type}
        @click=${this._handleFilterStateChange}
      >
        ${entityIcons[type]} ${label}
      </span>
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
                        [TypesEnum.CLASS]: this[TypesEnum.CLASS],
                        [TypesEnum.DATA_PROPERTY]: this[TypesEnum.DATA_PROPERTY],
                        [TypesEnum.OBJECT_PROPERTY]: this[TypesEnum.OBJECT_PROPERTY],
                        [TypesEnum.INDIVIDUAL]: this[TypesEnum.INDIVIDUAL],
                        areAllFiltersDisabled: this.areAllFiltersDisabled
                    }
                }));
            }
        });
    }
    get areAllFiltersDisabled() {
        let result = true;
        if (this[TypesEnum.CLASS] !== undefined) {
            result = result && !this[TypesEnum.CLASS];
        }
        if (this[TypesEnum.OBJECT_PROPERTY] !== undefined) {
            result = result && !this[TypesEnum.OBJECT_PROPERTY];
        }
        if (this[TypesEnum.DATA_PROPERTY] !== undefined) {
            result = result && !this[TypesEnum.DATA_PROPERTY];
        }
        if (this[TypesEnum.INDIVIDUAL] !== undefined) {
            result = result && !this[TypesEnum.INDIVIDUAL];
        }
        return result;
    }
    set [TypesEnum.CLASS](v) {
        this._class = v;
        this.requestUpdate();
    }
    get [TypesEnum.CLASS]() { return this._class; }
    set [TypesEnum.DATA_PROPERTY](v) {
        this._dataproperty = v;
        this.requestUpdate();
    }
    get [TypesEnum.DATA_PROPERTY]() { return this._dataproperty; }
    set [TypesEnum.OBJECT_PROPERTY](v) {
        this._objectproperty = v;
        this.requestUpdate();
    }
    get [TypesEnum.OBJECT_PROPERTY]() { return this._objectproperty; }
    set [TypesEnum.INDIVIDUAL](v) {
        this._individual = v;
        this.requestUpdate();
    }
    get [TypesEnum.INDIVIDUAL]() { return this._individual; }
}
GscapeEntityTypeFilters.properties = {
    [TypesEnum.CLASS]: { type: Number, reflect: true },
    [TypesEnum.DATA_PROPERTY]: { type: Number, reflect: true },
    [TypesEnum.OBJECT_PROPERTY]: { type: Number, reflect: true },
    [TypesEnum.INDIVIDUAL]: { type: Number, reflect: true },
    onFilterToggle: { type: Function, reflect: true }
};
GscapeEntityTypeFilters.styles = [
    baseStyle,
    GscapeButtonStyle,
    i$1 `
      .chips-filters {
        margin-top: 4px;
        white-space: normal;
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

      .chip[entity-type = "class-instance"] {
        color: var(--gscape-color-class-instance-contrast);
        border-color: var(--gscape-color-class-instance-contrast);
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
        return x `
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

function itemWithIriTemplate(item, onWikiLinkClick, useExternalLink = false) {
    function wikiClickHandler() {
        if (onWikiLinkClick)
            onWikiLinkClick(item.iri);
    }
    return x `
    <div class="item-with-iri-info ellipsed">
      ${useExternalLink
        ? x `<a 
            href="${item.iri}"
            title="${item.name}"
            target="_blank"
          >
            ${item.name}
          </a>`
        : x `
          <div 
            class="name ${onWikiLinkClick ? 'link' : null}" 
            title="${item.name}"
            @click=${onWikiLinkClick ? wikiClickHandler : null}
          >
            ${item.name}
          </div>
        `}
      
      <div class="rtl"><div class="muted-text" style="text-align: center" title="iri: ${item.iri}"><bdo dir="ltr">${item.iri}</bdo></div></div>
      <div class="muted-text type-or-version">
        ${Array.from(item.typeOrVersion).map(text => {
        if (Object.values(TypesEnum).includes(text)) {
            return x `
              <div class="type-or-version">
                ${entityIcons[text]}
                ${text || '-'}
              </div>
            `;
        }
        else {
            return text || '-';
        }
    })}
      </div>
    </div>
  `;
}
const itemWithIriTemplateStyle = i$1 `
  .item-with-iri-info {
    text-align:center;
    background-color: var(--gscape-color-bg-inset);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .item-with-iri-info .type-or-version {
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
    return x `
    <div class="annotations">
      ${annotations.map(annotation => {
        var _a;
        const property = annotation.property;
        if (DefaultAnnotationProperties.comment.equals(annotation.property) || propertiesAlreadyInserted.includes(property))
            return null;
        propertiesAlreadyInserted.push(property);
        let displayName;
        if (Object.values(DefaultAnnotationProperties).find(x => x.equals(annotation.propertyIri.fullIri))) {
            displayName = annotation.kind.charAt(0).toUpperCase() + annotation.kind.slice(1);
        }
        else {
            displayName = annotation.propertyIri.prefixed;
        }
        return x `
          <div class="annotation">
            <div class="bold-text annotation-property">
              <span class="slotted-icon">${(_a = annotationIcons[annotation.kind]) !== null && _a !== void 0 ? _a : A}</span>
              <span>${displayName}</span>
            </div>
            ${annotations.filter(a => a.property === property).map(annotation => {
            return x `
                <div class="annotation-row">
                  ${annotation.language ? x `<span class="language muted-text bold-text">@${annotation.language}</span>` : null}
                  <span title="${annotation.value}">${annotation.value}</span>
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
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .annotations .language {
    margin-right: 6px
  }

  .annotation-row {
    padding: 4px 8px;
  }

  .comment {
    margin: 8px 0;
    display: block;
  }
`;

function commentsTemplate (annotatedElem, selectedLanguage, languageSelectionHandler) {
    const commentsLanguages = Array.from(new Set(annotatedElem.getComments().map(comment => comment.language)));
    selectedLanguage = commentsLanguages.includes(selectedLanguage) ? selectedLanguage : commentsLanguages[0];
    return x `
    <div class="section">
      <div id="description-header" class="section-header">
        <span class="slotted-icon">${commentIcon}</span>
        <span class="bold-text">
          Description
        </span>
        ${languageSelectionHandler !== undefined
        ? x `
            <select id="language-select" class="btn btn-s" @change=${languageSelectionHandler}>
              ${commentsLanguages.map(language => {
            return x `
                  <option value="${language}" ?selected=${selectedLanguage === language}>
                    @${language}
                  </option>
                `;
        })}
            </select>
          `
        : null}
      </div>
      <div class="section-body">
        ${annotatedElem.getComments(selectedLanguage).map(comment => x `<span class="comment">${comment.value}</span>`)}
      </div>
    </div>
  `;
}

class GscapeConfirmDialog extends ModalMixin(BaseMixin(s)) {
    constructor(message, dialogTitle = 'Confirm', type = 'neutral') {
        super();
        this.message = message;
        this.dialogTitle = dialogTitle;
        this.type = type;
    }
    render() {
        return x `
      <div class="gscape-panel">
        <div class="header">
          <span type=${this.type} class="slotted-icon">${this.headerIcon}</span>
          ${this.dialogTitle}
        </div>
        <div class="dialog-message area" type=${this.type}>
          ${this.message}
        </div>

        <div class="buttons">
          ${this._onConfirm || this._onCancel
            ? x `
              <gscape-button label="Cancel" type="subtle" @click=${this.handleCancel}></gscape-button>
            `
            : null}
          <gscape-button type="primary" label="Ok" @click=${this.handleConfirm}></gscape-button>
        </div>
      </div>
    `;
    }
    get headerIcon() {
        switch (this.type) {
            default:
                return info_outline;
            case 'error':
                return error;
            case 'warning':
                return warning;
        }
    }
    handleConfirm() {
        if (this._onConfirm)
            this._onConfirm();
        this.remove();
    }
    handleCancel() {
        if (this._onCancel)
            this._onCancel();
        this.remove();
    }
    onConfirm(callback) {
        this._onConfirm = callback;
        this.requestUpdate();
        return this;
    }
    onCancel(callback) {
        this._onCancel = callback;
        this.requestUpdate();
        return this;
    }
}
GscapeConfirmDialog.properties = {
    message: { type: String },
    dialogTitle: { type: String },
    type: { type: String, reflect: true }
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

      .header {
        margin: 0 0 16px 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .dialog-message {
        margin: 8px;
        padding: 8px;
        margin-bottom: 16px;
      }

      .dialog-message[type = "warning"] {
        background: var(--gscape-color-attention-muted);
        border-color: var(--gscape-color-attention);
      }

      .dialog-message[type = "error"] {
        background: var(--gscape-color-danger-muted);
        border-color: var(--gscape-color-danger);
      }

      .header > span[type = "error"] {
        color: var(--gscape-color-danger);
      }

      .header > span[type = "warning"] {
        color: var(--gscape-color-attention);
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
function showMessage(message, title, container, type) {
    const dialog = new GscapeConfirmDialog(message, title, type);
    container.appendChild(dialog);
    dialog.show();
    return dialog;
}

function a11yClick(event) {
    if (event.type === 'click' || event.type === 'mousedown') {
        return true;
    }
    else if (event.type === 'keypress') {
        var code = event.charCode || event.keyCode;
        if ((code === 32) || (code === 13)) {
            return true;
        }
    }
    else {
        return false;
    }
}

class GscapeSelect extends DropPanelMixin(BaseMixin(s)) {
    constructor() {
        super(...arguments);
        this.PLACEHOLDER_ID = '!PLACEHOLDER!';
        this.options = [];
        this.size = SizeEnum.S;
        this.clearable = false;
        this.multipleSelection = false;
        this._placeholder = {
            id: this.PLACEHOLDER_ID,
            text: 'Select'
        };
        this._selectedOptionsId = new Set();
        this.onSelection = () => { };
    }
    render() {
        return x `
      ${this.getButton()}

      <div class="gscape-panel hide drop-down" id="drop-panel">

        <slot name="custom-element"></slot>

        ${this.options.length > 0
            ? this.options.map(option => {
                const selected = this.isIdSelected(option.id);
                return x `
              <div class="option-wrapper">
                <gscape-action-list-item
                  @click=${this.handleSelection}
                  @keypress=${this.handleSelection}
                  label="${option.text}"
                  title="${option.text}"
                  id="${option.id}"
                  ?selected=${selected || (this.isSelectionEmpty() && this.defaultOptionId === option.id)}
                  ?disabled=${option.disabled !== undefined && option.disabled}
                >
                  ${option.leadingIcon ? getIconSlot('icon', option.leadingIcon) : null}
                </gscape-action-list-item>
              </div>
            `;
            })
            : x `
            <div class="blank-slate">
              ${blankSlateDiagrams}
              <div class="description">No Options</div>
            </div>
          `}
      </div>
    `;
    }
    handleSelection(e) {
        if (a11yClick(e)) {
            const targetItem = e.currentTarget;
            if (targetItem && !targetItem.disabled) {
                if (targetItem.selected) {
                    // UNSELECT
                    if (this.clearable) {
                        this._selectedOptionsId.delete(targetItem.id);
                        this.requestUpdate();
                        this.updateComplete.then(() => this.dispatchEvent(new Event('change')));
                    }
                }
                else {
                    // SELECT
                    if (!this.multipleSelection) {
                        this.closePanel();
                        this._selectedOptionsId.clear();
                    }
                    this._selectedOptionsId.add(targetItem.id);
                    this.requestUpdate();
                    this.updateComplete.then(() => this.dispatchEvent(new Event('change')));
                }
            }
        }
    }
    getButton() {
        var _a;
        const options = this.selectedOptions.length > 0 ? this.selectedOptions : [this.defaultOption];
        const icon = (_a = options.find(o => o.leadingIcon !== undefined)) === null || _a === void 0 ? void 0 : _a.leadingIcon;
        const label = options.map(o => o.text).join(' - ');
        return x `
      <gscape-button id="select-btn" @click="${this.togglePanel}" label=${label} title=${label} size="${this.size}">
        <!-- Only set icons if selected options have all the same icon -->
        ${icon && options.every(o => !o.leadingIcon || o.leadingIcon === icon) ? getIconSlot('icon', icon) : null}
        ${getIconSlot('trailing-icon', triangle_down)}
      </gscape-button>
    `;
    }
    clear() {
        this._selectedOptionsId.clear();
        this.closePanel();
        this.requestUpdate();
        this.updateComplete.then(() => this.dispatchEvent(new Event('change')));
    }
    isSelectionEmpty() {
        return this._selectedOptionsId.size === 0;
    }
    isIdSelected(id) {
        return this._selectedOptionsId.has(id);
    }
    get selectedOptions() {
        const result = this.options.filter(o => this.isIdSelected(o.id));
        if (result.length === 0 && this.defaultOption) {
            result.push(this.defaultOption);
        }
        return result;
    }
    get selectedOptionsId() {
        return this.selectedOptions.map(o => o.id);
    }
    set selectedOptionsId(newSelectedOptionsId) {
        this._selectedOptionsId = new Set(newSelectedOptionsId);
    }
    get defaultOption() {
        return this.options.find(o => o.id === this.defaultOptionId) || this._placeholder;
    }
    get placeholder() { return this._placeholder.text; }
    set placeholder(placeHolder) {
        this._placeholder.text = placeHolder;
        this.requestUpdate();
        // this._placeholder.id = this.PLACEHOLDER_ID
    }
}
GscapeSelect.properties = {
    options: { type: Object },
    selectedOptionsId: { type: Array, reflect: true },
    defaultOptionId: { type: String, attribute: 'default-option' },
    placeholder: { type: String },
    onSelection: { type: Object, attribute: 'onselection' },
    size: { type: String },
    clearable: { type: Boolean },
    multipleSelection: { type: Boolean, attribute: 'multiple-selection' },
};
GscapeSelect.styles = [
    baseStyle,
    GscapeButtonStyle,
    i$1 `
      :host {
        position: relative;
      }

      gscape-button {
        max-width: inherit;
      }

      .option-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .option-wrapper > gscape-action-list-item {
        flex-grow: 1;
      }
    `
];
customElements.define('gscape-select', GscapeSelect);

function getEntityViewOccurrences (grapholEntity, grapholscape) {
    var _a;
    const result = new Map();
    if (grapholscape.renderState) {
        (_a = grapholEntity.occurrences.get(grapholscape.renderState)) === null || _a === void 0 ? void 0 : _a.forEach((occurrence) => {
            addOccurrenceViewData(occurrence);
        });
    }
    return result;
    function addOccurrenceViewData(occurrence) {
        var _a, _b;
        if (!grapholscape.renderState)
            return;
        const diagram = grapholscape.renderState === RendererStatesEnum.INCREMENTAL
            ? (_a = grapholscape.incremental) === null || _a === void 0 ? void 0 : _a.diagram
            : grapholscape.ontology.getDiagram(occurrence.diagramId);
        // const cyElement = diagram?.representations.get(grapholscape.renderState)?.cy?.$id(occurrence.elementId)
        if (diagram) {
            /**
             * In case of repositioned or transformed elements, show the original id
             */
            const occurrenceIdViewData = {
                realId: occurrence.id,
                originalId: occurrence.originalId || occurrence.id,
            };
            const d = Array.from(result).find(([diagramViewData, _]) => diagramViewData.id === diagram.id);
            let diagramViewData;
            if (!d) {
                diagramViewData = { id: diagram.id, name: diagram.name };
                result.set(diagramViewData, []);
            }
            else {
                diagramViewData = d[0];
            }
            (_b = result.get(diagramViewData)) === null || _b === void 0 ? void 0 : _b.push(occurrenceIdViewData);
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
        onNodeNavigation(elementId, parseInt(diagramId));
    }
    return x `
  ${Array.from(occurrences).map(([diagram, occurrencesIds]) => {
        return x `
      <div diagram-id="${diagram.id}" style="display: flex; align-items: center; gap: 2px; flex-wrap: wrap;">
        <span class="diagram-name">${diagram.name}</span>
        ${occurrencesIds.map(occurrenceId => x `
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
        if (!shouldFilterEntity(entity, entityFilters)) {
            result.push({
                displayedName: entity.getDisplayedName(grapholscape.entityNameType, grapholscape.language),
                value: entity,
                viewOccurrences: getEntityViewOccurrences(entity, grapholscape)
            });
        }
    });
    return result.sort((a, b) => a.displayedName.localeCompare(b.displayedName));
}
function shouldFilterEntity(entity, entityFilters) {
    if (!entityFilters)
        return false;
    let typeFilterEnabled = true;
    entity.types.forEach(type => {
        typeFilterEnabled = typeFilterEnabled && entityFilters[type] !== 1 && entityFilters[type] !== true;
    });
    return !entityFilters.areAllFiltersDisabled && typeFilterEnabled;
}
function search(searchValue, entities, includeLabels = false, includeComments = false, includeIri = false) {
    const searchWords = searchValue.split(' ');
    return new Promise((resolve) => {
        const result = entities.filter(entity => {
            let isAmatch = true;
            let isCurrentAMatch = false;
            for (const word of searchWords) {
                if (word.length <= 2)
                    continue;
                isCurrentAMatch =
                    isMatch(entity.displayedName, word) ||
                        (includeLabels && matchInAnnotations(entity.value.getLabels(), word)) ||
                        (includeComments && matchInAnnotations(entity.value.getComments(), word)) ||
                        (includeIri && matchInIRI(entity.value.iri, word));
                isAmatch = isAmatch && isCurrentAMatch;
            }
            return isAmatch;
        });
        resolve(result);
    });
    function matchInIRI(iri, searchValue) {
        return isMatch(iri.fullIri, searchValue) || isMatch(iri.prefixed, searchValue);
    }
    function matchInAnnotations(annotations, searchValue) {
        // search in labels defined in annotations (only for Graphol v3)
        for (const annotation of annotations) {
            if (isMatch(annotation.value, searchValue))
                return true;
        }
        return false; // only if no language has a match
    }
    function isMatch(value1, value2) { return value1.toLowerCase().includes(value2.toLowerCase()); }
}

var emptySearchBlankState = x `
  <div class="blank-slate">
    ${searchOff}
    <div class="header">Can't find any entity</div>
    <div class="description">Please try again with another search text.</div>
  </div>
`;

class GscapeEntitySelector extends DropPanelMixin(BaseMixin(s)) {
    static get properties() {
        return {
            entityList: { type: Object, attribute: false },
            isSearchTextEmpty: { type: Boolean, state: true },
            loading: { type: Boolean, state: true },
            onClassSelection: { type: Object },
            classActions: { type: Array },
        };
    }
    constructor() {
        super();
        this.title = 'Class Selector';
        this.fullEntityList = [];
        this._entityList = [];
        this.isSearchTextEmpty = true;
        this.loading = false;
    }
    render() {
        return x `
      <div class="gscape-panel widget-body">
        <div id="input-wrapper">
          <span class="slotted-icon muted-text">${search$1}</span>
          <input @keyup=${this.handleSearch} type="text" placeholder="Search a class by IRI, labels...">
          ${!this.isSearchTextEmpty
            ? x `
              <gscape-button id="clear-btn" size="s" type="subtle" title="Clear search" @click=${this.clearSearch}>
                ${getIconSlot('icon', cross)}
              </gscape-button>
            `
            : null}
        </div>
        
        <gscape-button 
          type="secondary"
          @click=${this.togglePanel}
          title="Toggle complete list"
          size=${SizeEnum.S}>
          ${getIconSlot('icon', arrowDown)}
        </gscape-button>
      </div>
          
      <div id="drop-panel" class="gscape-panel hide drop-down">
        ${this.loading
            ? x `<div style="margin: 16px auto; display: table;">${getContentSpinner()}</div>`
            : !this.isPanelClosed()
                ? x `
              <lit-virtualizer
                scroller
                class="background-propagation"
                style="min-height: 100%;"
                .items=${this.entityList}
                .renderItem=${(entityItem) => {
                    var _a;
                    return x `
                  <gscape-entity-list-item
                    style="width:100%"
                    .types=${entityItem.value.types}
                    displayedName=${entityItem.displayedName}
                    title=${entityItem.displayedName}
                    iri=${entityItem.value.iri.fullIri}
                    ?disabled=${entityItem.disabled}
                    tabindex="0"
                    @keypress=${this.handleKeyPressOnEntry.bind(this)}
                  >
                    <div slot="trailing-element" class="hover-btn">
                      ${(_a = this.classActions) === null || _a === void 0 ? void 0 : _a.map(action => x `
                        <gscape-button
                          size="s"
                          type="subtle"
                          title=${action.content}
                          @click=${() => {
                        if (action.select)
                            action.select(entityItem.value.iri.fullIri);
                    }}
                        >
                          ${action.icon ? getIconSlot('icon', action.icon) : null}
                        </gscape-button>
                      `)}

                      ${!this.classActions || this.classActions.length === 0
                        ? x `
                          <gscape-button
                            size="s"
                            type="subtle"
                            title="Insert in graph"
                            @click=${this.handleEntitySelection.bind(this)}
                          >
                            ${getIconSlot('icon', insertInGraph)}
                          </gscape-button>
                        `
                        : null}
                    </div>
                  </gscape-entity-list-item>
                `;
                }}
              >
              </lit-virtualizer>

              ${this.entityList.length === 0
                    ? emptySearchBlankState
                    : null} 
            `
                : null}
      </div>
    `;
    }
    // override blur to avoid collapsing when clicking on cytoscape's canvas
    blur() { }
    focusInputSearch() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateComplete;
            (_b = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('input')) === null || _b === void 0 ? void 0 : _b.focus();
        });
    }
    handleEntitySelection(evt) {
        var _a, _b;
        const iri = (_b = (_a = evt.currentTarget.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.getAttribute('iri');
        if (iri)
            this.onClassSelectionCallback(iri);
    }
    handleKeyPressOnEntry(evt) {
        if (a11yClick(evt)) {
            this.onClassSelectionCallback(evt.currentTarget.iri);
        }
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
            this.isSearchTextEmpty = true;
            this.closePanel();
            return;
        }
        this.isSearchTextEmpty = inputElement.value.length <= 0;
        if (((_a = inputElement.value) === null || _a === void 0 ? void 0 : _a.length) > 2) {
            this.loading = true;
            search(inputElement.value, this.fullEntityList).then(entities => {
                this.loading = false;
                this.entityList = entities;
            });
            this.openPanel();
        }
        else {
            this.entityList = this.fullEntityList;
        }
    }
    clearSearch() {
        if (this.input) {
            this.input.value = '';
            this.entityList = this.fullEntityList;
            this.isSearchTextEmpty = true;
        }
    }
    // onClassSelection(callback: (iri: string) => void) {
    //   this.onClassSelectionCallback = callback
    // }
    get onClassSelection() {
        return this.onClassSelectionCallback;
    }
    set onClassSelection(callback) {
        this.onClassSelectionCallback = callback;
        this.requestUpdate();
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
    get input() { var _a; return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('input'); }
}
GscapeEntitySelector.styles = [
    baseStyle,
    GscapeButtonStyle,
    contentSpinnerStyle,
    i$1 `

      .gscape-panel {
        width: 100%;
        max-width: unset;
        box-sizing: border-box;
      }

      .widget-body {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
        z-index: 1;
      }

      #drop-panel {
        position: relative;
        top: 0;
        max-height: unset;
        min-height: 60vh;
        height: 1px;
        overflow: hidden;
      }

      gscape-entity-list-item {
        --custom-min-height: 26.5px;
      }

      .hover-btn {
        display: none;
      }
      
      gscape-entity-list-item:hover > .hover-btn {
        display: initial;
      }

      gscape-entity-search {
        flex-shrink: 0;
      }

      #input-wrapper {
        position: relative;
        flex-grow: 2;
      }

      #input-wrapper > .slotted-icon {
        position: absolute;
        left: 8px;
        top: 11px;
      }

      input {
        width: 100%;
        height: 100%;
        padding: 12px 24px;
        padding-left: 38px;
      }

      #clear-btn {
        position: absolute;
        top: 8px;
        right: 8px;
      }

      @keyframes drop-down {
        from {opacity: 0; top: -20%;}
        to {opacity: 1; top: 0;}
      }
    `
];
customElements.define('gscape-entity-selector', GscapeEntitySelector);

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

function init$9 (rendererSelector, grapholscape) {
    rendererSelector.rendererStates = grapholscape.renderers.map(rendererStateKey => rendererStates[rendererStateKey]);
    if (grapholscape.renderState) {
        rendererSelector.currentRendererStateKey = grapholscape.renderState;
    }
    rendererSelector.onRendererStateSelection = (rendererState) => {
        rendererStateSelectionCallback(rendererState, grapholscape);
    };
    rendererSelector.onIncrementalReset = () => {
        showMessage('Are you sure? This action is irreversible and you will lose your current graph.', 'Confirm Reset', grapholscape.uiContainer, 'warning').onConfirm(() => { var _a; return (_a = grapholscape.incremental) === null || _a === void 0 ? void 0 : _a.reset(); });
    };
    grapholscape.on(LifecycleEvent.RendererChange, (newRendererState) => {
        rendererSelector.currentRendererStateKey = newRendererState;
        // if (newRendererState === RendererStatesEnum.FLOATY)
        // rendererSelector.layoutSettingsComponent.openPanel()
    });
}
function rendererStateSelectionCallback(rendererState, grapholscape) {
    var _a;
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
            case RendererStatesEnum.INCREMENTAL:
                grapholscape.setRenderer(new IncrementalRendererState());
                (_a = grapholscape.incremental) === null || _a === void 0 ? void 0 : _a.showDiagram();
                isRenderValid = true;
                break;
        }
        if (isRenderValid)
            storeConfigEntry('selectedRenderer', rendererState);
    }
}

function init$8 (welcomeRendererSelector, grapholscape) {
    welcomeRendererSelector.options = grapholscape.renderers.map(rendererStateId => rendererStates[rendererStateId]);
    welcomeRendererSelector.onOptionSelection = (optionId) => rendererStateSelectionCallback(optionId, grapholscape);
}

class GscapeFullPageSelector extends BaseMixin(s) {
    constructor() {
        super(...arguments);
        this.title = '';
    }
    render() {
        return x `
      <div class="title bold-text">${this.title}</div>
      <div class="options">
        ${this.options.map(option => {
            if (option)
                return x `
              <div class="card" renderer-state=${option.id} @click=${this.handleRendererSelection} title=${option.name}>
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
        gap: 8px;
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
    init$8(rendererSelectorComponent, grapholscape);
    grapholscape.widgets.set(WidgetEnum.INITIAL_RENDERER_SELECTOR, rendererSelectorComponent);
    if (grapholscape.renderers.length < 1 || grapholscape.renderState) {
        rendererSelectorComponent.disable();
    }
}

class GscapeDiagramSelector extends DropPanelMixin(BaseMixin(s)) {
    constructor() {
        super(...arguments);
        this.title = 'Diagram Selector';
        this.onDiagramSelection = () => { };
    }
    render() {
        var _a;
        return x `
      <gscape-button @click="${this.togglePanel}" label="${((_a = this.currentDiagram) === null || _a === void 0 ? void 0 : _a.name) || 'Select a diagram'}">
        ${getIconSlot('icon', diagrams)}
        ${getIconSlot('trailing-icon', arrowDown)}
      </gscape-button>

      <div class="gscape-panel drop-down hide" id="drop-panel">
        ${(this.diagrams.length === 1 && this.currentDiagramId === 0 && !this.diagrams[-1]) || this.diagrams.length === 0
            ? x `
            <div class="blank-slate">
              ${blankSlateDiagrams}
              <div class="header">No more diagrams</div>
              <div class="description">The ontology contains only one diagram, the one displayed.</div>
            </div>
          `
            : x `
            ${this.diagrams
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
                .map(diagram => x `
                <gscape-action-list-item
                  @click="${this.diagramSelectionHandler}"
                  label="${diagram.name}"
                  diagram-id="${diagram.id}"
                  ?selected = "${this.currentDiagramId === diagram.id}"
                ></gscape-action-list-item>
              `)}
            ${this.diagrams[-1] !== undefined
                ? x `
                <gscape-action-list-item
                  @click="${this.diagramSelectionHandler}"
                  label="${this.diagrams[-1].name}"
                  diagram-id="${this.diagrams[-1].id}"
                  ?selected = "${this.currentDiagramId === this.diagrams[-1].id}"
                ></gscape-action-list-item>
              `
                : null}
          `}
        
      </div>
    `;
    }
    diagramSelectionHandler(e) {
        const selectedDiagramId = parseInt(e.target.getAttribute('diagram-id') || '');
        this.onDiagramSelection(selectedDiagramId);
    }
    get currentDiagram() {
        return this.diagrams[this.currentDiagramId];
    }
}
GscapeDiagramSelector.properties = {
    currentDiagramId: { type: Number },
    currentDiagramName: { type: String },
    diagrams: { type: Array }
};
GscapeDiagramSelector.styles = [
    baseStyle,
    i$1 `
    :host {
      position: absolute;
      top: 10px;
      left: 10px;
    }
    `
];
customElements.define('gscape-diagram-selector', GscapeDiagramSelector);

/**
 *
 * @param {import('./index').default} diagramSelectorComponent
 * @param {import('../../grapholscape').default} grapholscape
 */
function init$7 (diagramSelectorComponent, grapholscape) {
    // const diagramsViewData = grapholscape.ontology.diagrams
    const updateDiagrams = (renderer) => {
        var _a;
        diagramSelectorComponent.diagrams = grapholscape.ontology.diagrams;
        if (renderer === RendererStatesEnum.FLOATY &&
            ((_a = grapholscape.ontology.annotationsDiagram) === null || _a === void 0 ? void 0 : _a.isEmpty())) {
            const index = diagramSelectorComponent.diagrams.indexOf(grapholscape.ontology.annotationsDiagram);
            if (index >= 0) {
                diagramSelectorComponent.diagrams.splice(index, 1);
            }
        }
    };
    diagramSelectorComponent.diagrams = grapholscape.ontology.diagrams;
    if (grapholscape.renderState)
        updateDiagrams(grapholscape.renderState);
    if (grapholscape.diagramId || grapholscape.diagramId === 0) {
        diagramSelectorComponent.currentDiagramId = grapholscape.diagramId;
    }
    if (grapholscape.renderer.diagram) {
        diagramSelectorComponent.currentDiagramName = grapholscape.renderer.diagram.name;
    }
    diagramSelectorComponent.onDiagramSelection = (diagram) => grapholscape.showDiagram(diagram);
    grapholscape.on(LifecycleEvent.DiagramChange, diagram => {
        if (diagramSelectorComponent.diagrams[diagram.id]) {
            diagramSelectorComponent.currentDiagramId = diagram.id;
            diagramSelectorComponent.currentDiagramName = diagram.name;
        }
    });
    grapholscape.on(LifecycleEvent.RendererChange, updateDiagrams);
}

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
function initDiagramSelector(grapholscape) {
    const diagramSelectorComponent = new GscapeDiagramSelector();
    init$7(diagramSelectorComponent, grapholscape);
    grapholscape.widgets.set(WidgetEnum.DIAGRAM_SELECTOR, diagramSelectorComponent);
}

class GscapeEntityColorLegend extends BaseMixin(s) {
    constructor() {
        super(...arguments);
        this.title = 'Color Legend';
        this.elements = [];
        this.isDefaultClosed = false;
        this.onElementSelection = () => { };
    }
    handleElemClick(e) {
        if (a11yClick(e)) {
            const elem = this.elements.find(c => c.id === e.currentTarget.id);
            if (elem)
                this.onElementSelection(elem);
        }
    }
    render() {
        return x `
      ${this.elements.length > 0
            ? x `
          <div class="list">
            ${this.elements.map(element => {
                return x `
                <gscape-entity-list-item
                  id=${element.id}
                  @click=${this.handleElemClick}
                  iri=${element.iri}
                  displayedName=${element.displayedName}
                  color=${element.color}
                  ?filtered=${element.filtered}
                  actionable
                ></gscape-entity-list-item>
              `;
            })}  
          </div>
        `
            : x `
          <div class="blank-slate">
            ${searchOff}
            <div class="header">No Classes</div>
            <div class="description">Current diagram has no classes or instances displayed in it.</div>
          </div>
        `}
    `;
    }
}
GscapeEntityColorLegend.properties = {
    elements: { type: Array },
};
GscapeEntityColorLegend.styles = [
    baseStyle,
    i$1 `
      :host {
        display: block;
      }

      .gscape-panel {
        max-height: unset;
        max-width: unset;
      }

      ul {
        margin: 0;
        padding: 0;
      }

      li {
        list-style: none;
      }

      gscape-entity-list-item[filtered] {
        opacity: 0.4;
      }
    `
];
customElements.define('gscape-entity-color-legend', GscapeEntityColorLegend);

class GscapeIncrementalFilters extends DropPanelMixin(BaseMixin(s)) {
    constructor(entityColorLegend) {
        super();
        this.entityColorLegend = entityColorLegend;
        this.title = 'Color Legend';
        this.isDefaultClosed = false;
    }
    // override blur to avoid collapsing when clicking on cytoscape's canvas
    blur() { }
    render() {
        return x `
      <div class="top-bar ${this.isPanelClosed() ? null : 'traslated-down'}">
        <gscape-button style="z-index: 1;"
          id="toggle-panel-button"
          size="${this.isPanelClosed() ? 'm' : 's'}" 
          type="${this.isPanelClosed() ? '' : 'subtle'}"
          @click=${this.togglePanel}
          label = "${this.isPanelClosed() ? this.title : ''}"
        > 
          ${this.isPanelClosed()
            ? x `
                <span slot="icon">${colors}</span>
                <span slot="trailing-icon">${plus}</span>
              `
            : x `<span slot="icon">${minus}</span>`}
        </gscape-button>
      </div>


      <div id="drop-panel" class="gscape-panel">
        ${this.entityColorLegend}
      </div>
    `;
    }
}
GscapeIncrementalFilters.styles = [
    baseStyle,
    i$1 `
      :host {
        position: absolute;
        bottom: 10px;
        left: 10px;
        max-height: 60%;
        max-width: 20%;
        display: flex;
      }
    `
];
customElements.define('gscape-incremental-filters', GscapeIncrementalFilters);

function initEntityColorLegend(grapholscape) {
    const entityColorLegend = new GscapeEntityColorLegend();
    const incrementalFilters = new GscapeIncrementalFilters(entityColorLegend);
    entityColorLegend['_previous_callback'] = (elem) => grapholscape.selectEntity(elem.iri, grapholscape.diagramId, 1.5);
    entityColorLegend.onElementSelection = (elem) => grapholscape.selectEntity(elem.iri, grapholscape.diagramId, 1.5);
    grapholscape.widgets.set(WidgetEnum.ENTITY_COLOR_LEGEND, entityColorLegend);
    grapholscape.widgets.set(WidgetEnum.INCREMENTAL_FILTERS, incrementalFilters);
    return entityColorLegend;
}
function initEntityColorButton(grapholscape) {
    const colorButtonComponent = new GscapeButton();
    colorButtonComponent.asSwitch = true;
    colorButtonComponent.appendChild(getIconSlot('icon', colors));
    colorButtonComponent.style.order = '8';
    colorButtonComponent.style.marginTop = '10px';
    colorButtonComponent.title = 'Show Colors';
    //fitButtonComponent.style.position = 'initial'
    grapholscape.widgets.set(WidgetEnum.COLOR_BUTTON, colorButtonComponent);
    return colorButtonComponent;
}
function setColorList(entityColorLegend, grapholscape) {
    var _a;
    if (!grapholscape.renderState)
        return;
    const diagramRepr = (_a = grapholscape.renderer.diagram) === null || _a === void 0 ? void 0 : _a.representations.get(grapholscape.renderState);
    if (diagramRepr) {
        const elements = new Map();
        diagramRepr.cy.$(`[type = "${TypesEnum.CLASS}"]`).forEach(classNode => {
            elements.set(classNode.data('iri'), {
                id: classNode.id(),
                displayedName: classNode.data('displayedName'),
                iri: classNode.data('iri'),
                color: classNode.style('background-color'),
                filtered: false,
            });
        });
        if (grapholscape.renderState === RendererStatesEnum.INCREMENTAL && grapholscape.incremental) {
            diagramRepr.cy.$(`[type = "${TypesEnum.INDIVIDUAL}"]`).forEach(instanceNode => {
                instanceNode.connectedEdges(`[type = "${TypesEnum.INSTANCE_OF}"]`).targets().forEach((parentClassNode, i) => {
                    if (!elements.has(parentClassNode.data().iri)) {
                        const parentClassEntity = grapholscape.ontology.getEntity(parentClassNode.data().iri);
                        if (parentClassEntity) {
                            elements.set(parentClassNode.data().iri, {
                                id: `${instanceNode.id()}-${i}`,
                                displayedName: parentClassEntity.getDisplayedName(grapholscape.entityNameType, grapholscape.language),
                                iri: parentClassEntity.fullIri,
                                color: parentClassEntity.color,
                                filtered: false,
                            });
                        }
                    }
                });
            });
        }
        entityColorLegend.elements = Array.from(elements.values()).sort((a, b) => a.displayedName.localeCompare(b.displayedName));
        // entityColorLegend.elements.length > 0
        //   ? entityColorLegend.show()
        //   : entityColorLegend.hide()
    }
}
function initColors(grapholscape) {
    const colorButtonComponent = initEntityColorButton(grapholscape);
    const entityColorLegend = initEntityColorLegend(grapholscape);
    const incrementalFilters = grapholscape.widgets.get(WidgetEnum.INCREMENTAL_FILTERS);
    colorButtonComponent.onclick = () => {
        var _a;
        grapholscape.theme.useComputedColours = colorButtonComponent.active;
        (_a = grapholscape.renderer.cy) === null || _a === void 0 ? void 0 : _a.updateStyle();
        colorButtonComponent.active
            ? incrementalFilters.show()
            : incrementalFilters.hide();
        setColorList(entityColorLegend, grapholscape);
    };
    grapholscape.on(LifecycleEvent.RendererChange, (renderer) => {
        setupColors(grapholscape);
        if (renderer === RendererStatesEnum.FLOATY) {
            entityColorLegend.onElementSelection = entityColorLegend['_previous_callback'];
        }
    });
    grapholscape.on(LifecycleEvent.DiagramChange, () => {
        if (colorButtonComponent.active && colorButtonComponent.isVisible) {
            setColorList(entityColorLegend, grapholscape);
        }
    });
    grapholscape.on(LifecycleEvent.ThemeChange, () => setupColors(grapholscape));
    const setupColors = (grapholscape) => {
        var _a;
        if (grapholscape.renderState === RendererStatesEnum.INCREMENTAL || grapholscape.renderState === RendererStatesEnum.FLOATY) {
            colorButtonComponent.active = true;
        }
        else {
            colorButtonComponent.hide();
            incrementalFilters.hide();
            return;
        }
        colorButtonComponent.show();
        grapholscape.theme.useComputedColours = colorButtonComponent.active;
        (_a = grapholscape.renderer.cy) === null || _a === void 0 ? void 0 : _a.updateStyle();
        colorButtonComponent.active
            ? incrementalFilters.show()
            : incrementalFilters.hide();
        setColorList(entityColorLegend, grapholscape);
    };
    setupColors(grapholscape);
}

class GscapeEntityDetails extends DropPanelMixin(BaseMixin(s)) {
    constructor() {
        super(...arguments);
        this.title = 'Entity Details';
        this.showOccurrences = true;
        this.onNodeNavigation = () => { };
        this.isDefaultClosed = false;
    }
    static get properties() {
        return {
            grapholEntity: { type: Object, attribute: false },
            occurrences: { type: Object, attribute: false },
            showOccurrences: { type: Boolean },
            language: { type: String, attribute: false },
            _isPanelClosed: { type: Boolean, attribute: false },
            incrementalSection: { type: Object, attribute: false }
        };
    }
    render() {
        var _a, _b;
        if (!this.grapholEntity)
            return;
        return x `
      <div class="gscape-panel ellipsed" id="drop-panel">
        ${itemWithIriTemplate(this.entityForTemplate, this.onWikiLinkClick, (_a = this.currentOccurrence) === null || _a === void 0 ? void 0 : _a.is(TypesEnum.IRI))}

        <div class="content-wrapper">
          ${this.currentOccurrenceType === TypesEnum.DATA_PROPERTY && this.grapholEntity.datatype
            ? x `
              <div style="text-align: center" class="chips-wrapper section">
                <span class="chip-neutral">${this.grapholEntity.datatype}</span>
              </div>
            `
            : null}

          ${(this.currentOccurrenceType === TypesEnum.DATA_PROPERTY ||
            this.currentOccurrenceType === TypesEnum.OBJECT_PROPERTY) &&
            (this.grapholEntity.functionProperties.length > 0 || this.grapholEntity.isDataPropertyFunctional)
            ? x `
                <div class="chips-wrapper section">
                ${this.grapholEntity.isDataPropertyFunctional
                ? x `<span class="chip">&#10003; functional</span>`
                : null}
                ${this.grapholEntity.functionProperties.map(functionality => {
                if (this.grapholEntity.isDataPropertyFunctional)
                    return null;
                else
                    return x `<span class="chip">&#10003; ${functionality.toString()}</span>`;
            })}
                </div>
              `
            : null}

          ${((_b = this.currentOccurrence) === null || _b === void 0 ? void 0 : _b.isEdge()) && !this.currentOccurrence.is(TypesEnum.ANNOTATION_PROPERTY)
            ? x `
              <div class="section">
                <div class="section-header">
                  ${this.currentOccurrence.domainTyped !== undefined && this.currentOccurrence.domainMandatory !== undefined
                ? x `
                      <span class="slotted-icon">${domain}</span>
                      <span class="bold-text">Domain</span>
                      ${this.currentOccurrence.domainTyped ? x `<span class="chip-neutral">Typed</span>` : undefined}
                      ${this.currentOccurrence.domainMandatory ? x `<span class="chip-neutral">Mandatory</span>` : undefined}
                    `
                : undefined}
                  
                </div>
                <div class="section-header">
                  ${this.currentOccurrence.rangeTyped !== undefined && this.currentOccurrence.rangeMandatory !== undefined
                ? x `
                      <span class="slotted-icon">${range}</span>
                      <span class="bold-text">Range</span>
                      ${this.currentOccurrence.rangeTyped ? x `<span class="chip-neutral">Typed</span>` : undefined}
                      ${this.currentOccurrence.rangeMandatory ? x `<span class="chip-neutral">Mandatory</span>` : undefined}
                    `
                : undefined}
                  
                </div>
              </div>
            `
            : null}

          ${this.incrementalSection}

          ${annotationsTemplate(this.grapholEntity.getAnnotations())}
          
          ${this.showOccurrences && this.occurrences.size > 0 ? this.occurrencesTemplate() : null}

          ${this.grapholEntity.getComments().length > 0
            ? commentsTemplate(this.grapholEntity, this.language, this.languageSelectionHandler)
            : null}

          ${this.currentOccurrence && !this.currentOccurrence.isEntity()
            ? x `
              <div class="blank-slate">
                ${blankSlateDiagrams}
                <div class="header">No details available</div>
                <div class="description">It seems like this entity has no definition in the current ontology.</div>
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
            ? x `
                <span slot="icon">${infoFilled}</span>
                <span slot="trailing-icon">${plus}</span>
              `
            : x `<span slot="icon">${minus}</span>`}
        </gscape-button>
      </div>
    `;
    }
    occurrencesTemplate() {
        return x `
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
    setGrapholEntity(entity, instance) { }
    languageSelectionHandler(e) {
        this.language = e.target.value;
    }
    get entityForTemplate() {
        const result = {
            name: this.grapholEntity.iri.remainder,
            typeOrVersion: this.currentOccurrenceType ? [this.currentOccurrenceType] : this.grapholEntity.types,
            iri: this.grapholEntity.iri.fullIri,
        };
        return result;
    }
    get commentsLanguages() {
        return Array.from(new Set(this.grapholEntity.getComments().map(comment => comment.language)));
    }
    get currentOccurrenceType() {
        var _a;
        return (_a = this.currentOccurrence) === null || _a === void 0 ? void 0 : _a.type;
    }
    updated() {
        var _a;
        // let description = this.entity?.annotations?.comment
        const allComments = (_a = this.grapholEntity) === null || _a === void 0 ? void 0 : _a.getComments();
        if (!allComments || allComments.length === 0)
            return;
        const commentsInCurrentLanguage = this.grapholEntity.getComments(this.language);
        // if current language is not available, select the first available
        if (commentsInCurrentLanguage.length === 0) {
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
        height: fit-content;
        max-height: calc(100vh - 40px);
        width: 30%;
        display: flex;
        flex-direction: column;
        overflow: auto;
        resize: both;
        direction: rtl;
      }

      #drop-panel {
        direction: ltr;
      }

      .gscape-panel {
        padding: 0;
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        max-height: unset;
        max-width: unset;
        box-sizing: border-box;
      }

      .gscape-panel > * {
        padding: 8px;
      }

      [diagram-id] > gscape-button {
        color: var(--gscape-color-accent);
      }

      #language-select: {
        margin: 10px auto;
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

      .content-wrapper {
        display: flex;
        flex-direction: column;
        gap: 12px;
        overflow: auto;
      }

      .content-wrapper > * {
        flex-shrink: 0;
      }

      .chips-wrapper {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
      }

      .chips-wrapper > .chip {
        flex-shrink: 0;
      }
    `
];
customElements.define('gscape-entity-details', GscapeEntityDetails);

function init$6 (entityDetailsComponent, grapholscape) {
    // entityDetailsComponent.onWikiClick = (iri) => grapholscape.wikiRedirectTo(iri)
    entityDetailsComponent.onNodeNavigation = (elementId, diagramId) => {
        grapholscape.centerOnElement(elementId, diagramId, 1.2);
        grapholscape.selectElement(elementId);
    };
    entityDetailsComponent.language = grapholscape.language;
    entityDetailsComponent.setGrapholEntity = setGrapholEntity;
    grapholscape.on(LifecycleEvent.EntitySelection, setGrapholEntity);
    grapholscape.on(LifecycleEvent.NodeSelection, node => {
        if (node.is(TypesEnum.IRI) && node.iri) {
            const tempEntity = new GrapholEntity(new Iri(node.iri, grapholscape.ontology.namespaces));
            setGrapholEntity(tempEntity, node);
        }
        else if (!node.isEntity())
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
        if (entityDetailsComponent.grapholEntity && grapholscape.renderState !== RendererStatesEnum.INCREMENTAL)
            entityDetailsComponent.occurrences = getEntityViewOccurrences(entityDetailsComponent.grapholEntity, grapholscape);
        entityDetailsComponent.showOccurrences = grapholscape.renderState !== RendererStatesEnum.INCREMENTAL;
    });
    function setGrapholEntity(entity, instance) {
        entityDetailsComponent.grapholEntity = entity;
        entityDetailsComponent.currentOccurrence = instance;
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
    init$6(entityDetailsComponent, grapholscape);
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
        return x `
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
        return x `
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
        let result = (_a = Object.keys(RDFGraphConfigFiltersEnum)
            .find(key => RDFGraphConfigFiltersEnum[key] === filterKey)) === null || _a === void 0 ? void 0 : _a.toLowerCase().replace('_', ' ');
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

function init$5 (filterComponent, grapholscape) {
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
    init$5(filterComponent, grapholscape);
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

class GscapeLayoutSettings extends DropPanelMixin(BaseMixin(s)) {
    constructor() {
        super();
        this.layoutRun = false;
        this.dragAndPin = false;
        this.originalPositions = false;
        this.onLayoutRunToggle = () => { };
        this.onDragAndPinToggle = () => { };
        this.onUseOriginalPositions = () => { };
        this.classList.add(BOTTOM_RIGHT_WIDGET.toString());
    }
    render() {
        return x `
      <gscape-button 
        style="display: block"
        type="subtle" 
        as-switch 
        @click="${this.layoutRunToggleHandler}"
        ?active=${this.layoutRun}
        title="${this.layoutRun ? 'Stop' : 'Run'} Layout"
      >
        <span slot="icon">${playCircle}</span>
      </gscape-button>

      <div class="hr"></div>

      <gscape-button
        style="display: block"
        type="subtle"
        as-switch
        @click="${this.dragAndPinToggleHandler}"
        ?active=${this.dragAndPin}
        title="${this.dragAndPin ? 'Disable' : 'Enable'} Node Pinning"
      >
        <span slot="icon">${keep}</span>
      </gscape-button>
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
        order: 9;
        margin-top:10px;
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
function init$4 (layoutSettingsComponent, grapholscape) {
    if (grapholscape.renderState) {
        updateToggles(grapholscape.renderState);
        if (grapholscape.renderState !== RendererStatesEnum.FLOATY && grapholscape.renderState !== RendererStatesEnum.INCREMENTAL) {
            layoutSettingsComponent.disable();
        }
        else {
            layoutSettingsComponent.enable();
        }
    }
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
        if (rendererState !== RendererStatesEnum.FLOATY && rendererState !== RendererStatesEnum.INCREMENTAL) {
            layoutSettingsComponent.disable();
        }
        else {
            layoutSettingsComponent.enable();
        }
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
    init$4(layoutSettingsComponent, grapholscape);
    grapholscape.widgets.set(WidgetEnum.LAYOUT_SETTINGS, layoutSettingsComponent);
    return layoutSettingsComponent;
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

class GscapeExplorer extends DropPanelMixin(BaseMixin(s)) {
    constructor() {
        super();
        this.title = 'Entity Explorer';
        this._entities = [];
        this.shownEntities = [];
        this.loading = false;
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
                this.loading = true;
                search(e.detail.searchText, this.entities).then(entities => {
                    this.loading = false;
                    this.shownEntities = entities;
                });
            }
            else {
                this.shownEntities = this.entities;
            }
        });
        this.closePanel();
    }
    render() {
        return x `
    <gscape-button type="subtle" @click=${this.togglePanel}>
      <span slot="icon">${explore}</span>
    </gscape-button>

    <div class="gscape-panel gscape-panel-in-tray hide" id="drop-panel">
      <div class="header">${this.title}</div>
      <gscape-entity-search
        class=0
        object-property=0
        data-property=0
        individual=0
        class-instance=0
      ></gscape-entity-search>

        ${this.loading
            ? x `<div style="margin: 16px auto; display: table;">${getContentSpinner()}</div>`
            : this.shownEntities.length === 0
                ? emptySearchBlankState
                : !this.isPanelClosed()
                    ? x `
                <div style="padding: 0 8px; height: inherit">
                  <lit-virtualizer
                    scroller
                    class="background-propagation"
                    style="min-height: 100%"
                    .items=${this.shownEntities}
                    .renderItem=${(entity) => x `
                      <gscape-entity-list-item
                        style="width: 100%"
                        ?asaccordion=${true}
                        displayedname=${entity.displayedName}
                        .types=${entity.value.types}
                        iri=${entity.value.iri.fullIri}
                      >
                        <div slot="accordion-body">
                        ${entity.viewOccurrences && entity.viewOccurrences.size > 0
                        ? getEntityOccurrencesTemplate(entity.viewOccurrences, this.onNodeNavigation)
                        : x `
                            <div class="blank-slate">
                              ${blankSlateDiagrams}
                              <div class="header">No Occurrences</div>
                              <div class="description">The entity has no occurrences in this rendering mode.</div>
                            </div>
                          `}
                        </div>
                      </gscape-entity-list-item>
                    `}
                  >
                  </lit-virtualizer>
                </div>
              `
                    : null}
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
    shownEntities: { type: Object, attribute: false },
    loading: { type: Boolean }
};
GscapeExplorer.styles = [
    baseStyle,
    contentSpinnerStyle,
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
        height: 50vh;
        max-height: unset;
        min-width: 300px;
        min-height: 200px;
        display: flex;
        flex-direction: column;
      }

      .list-wrapper > .blank-slate {
        white-space: normal;
        transform: translateY(40%);
      }

      .list-wrapper {
        padding: 0px 8px;
        overflow: auto;
        flex-grow: 2;
      }

      .content-wrapper {
        height: 100%;
      }
    `
];
customElements.define('gscape-explorer', GscapeExplorer);

function init$3 (ontologyExplorerComponent, grapholscape) {
    ontologyExplorerComponent.onNodeNavigation = (elementId, diagramId) => {
        grapholscape.centerOnElement(elementId, diagramId, 1.2);
        grapholscape.selectElement(elementId);
    };
    ontologyExplorerComponent.addEventListener('onentityfilterchange', (e) => {
        ontologyExplorerComponent.entities = createEntitiesList(grapholscape, e.detail)
            .filter(e => e.viewOccurrences && e.viewOccurrences.size > 0);
    });
    ontologyExplorerComponent.onTogglePanel = () => {
        if (ontologyExplorerComponent.entities.length === 0 || grapholscape.ontology.entities.size !== ontologyExplorerComponent.entities.length) {
            updateEntityList();
        }
    };
    grapholscape.on(LifecycleEvent.RendererChange, () => {
        updateEntityList(ontologyExplorerComponent.searchEntityComponent);
    });
    grapholscape.on(LifecycleEvent.EntityNameTypeChange, () => {
        updateEntityList(ontologyExplorerComponent.searchEntityComponent);
    });
    function updateEntityList(entityFilters) {
        ontologyExplorerComponent.loading = true;
        setTimeout(() => {
            ontologyExplorerComponent.entities = createEntitiesList(grapholscape, entityFilters)
                .filter(e => e.viewOccurrences && e.viewOccurrences.size > 0);
            ontologyExplorerComponent.loading = false;
        }, 0);
    }
}

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
function initOntologyExplorer(grapholscape) {
    const ontologyExplorerComponent = new GscapeExplorer();
    init$3(ontologyExplorerComponent, grapholscape);
    grapholscape.widgets.set(WidgetEnum.ONTOLOGY_EXPLORER, ontologyExplorerComponent);
}

function grapholEntityToEntityViewData(grapholEntity, grapholscape) {
    return {
        displayedName: grapholEntity.getDisplayedName(grapholscape.entityNameType, grapholscape.language),
        value: grapholEntity
    };
}
// export function getEntityViewDataUnfolding(entity: GrapholEntity, grapholscape: Grapholscape, hasUnfoldings?: (iri: string, type: TypesEnum) => boolean ) {
//   let hasAnyUnfolding = true
//   if (hasUnfoldings) {
//     entity.types.forEach(type => {
//       hasAnyUnfolding = hasAnyUnfolding && hasUnfoldings(entity.iri.fullIri, type)
//     })
//   } else {
//     hasAnyUnfolding = false
//   }
//   return {
//     entityViewData: grapholEntityToEntityViewData(entity, grapholscape),
//     available:hasAnyUnfolding
//   } as EntityViewDataUnfolding
// }

var index$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    capitalizeFirstChar: capitalizeFirstChar,
    grapholEntityToEntityViewData: grapholEntityToEntityViewData
});

class GscapeOntologyInfo extends DropPanelMixin(BaseMixin(s)) {
    constructor() {
        super();
        this.title = "Ontology Info";
        this.entityCounters = {
            [TypesEnum.CLASS]: 0,
            [TypesEnum.DATA_PROPERTY]: 0,
            [TypesEnum.OBJECT_PROPERTY]: 0,
            [TypesEnum.INDIVIDUAL]: 0,
        };
        this.classList.add(BOTTOM_RIGHT_WIDGET.toString());
    }
    render() {
        return x `
      <gscape-button type="subtle" @click="${this.togglePanel}">
        <span slot="icon">${info_outline}</span>
      </gscape-button>  

      <div class="gscape-panel gscape-panel-in-tray hide" id="drop-panel">
        ${this.ontology && itemWithIriTemplate({
            name: this.ontology.name,
            iri: this.ontology.iri || '',
            typeOrVersion: [this.ontology.version],
        })}
        
        <div class="content-wrapper">
          ${this.ontology && this.ontology.getAnnotations().length > 0
            ? x `
                <div class="area" style="display: flex; flex-direction: column; gap: 16px">
                  ${annotationsTemplate(this.ontology.getAnnotations())}
                  ${this.ontology && this.ontology.getComments().length > 0
                ? commentsTemplate(this.ontology, this.language, (e) => { var _a; this.language = (_a = e.target) === null || _a === void 0 ? void 0 : _a.value; })
                : null}
                </div>
              `
            : null}

          <div class="area">
            <div class="bold-text">Entity Counters</div>
            <div class="area-content">
              ${this.ontology && this.ontology.diagrams.length > 1
            ? x `
                  <gscape-select
                    size=${SizeEnum.S}
                    .options=${this.ontology.diagrams.map(diagram => {
                return {
                    id: diagram.id.toString(),
                    text: diagram.name,
                };
            })}
                    .placeholder=${{ text: 'Filter by Diagram' }}
                    ?clearable=${true}
                    .selected-options=${this.diagramIdFilter ? new Set([this.diagramIdFilter]) : undefined}
                    @change=${this.handleDiagramFilterChange}
                    style="margin-bottom: 4px;"
                  >
                  </gscape-select>
                `
            : null}

              ${Object.entries(this.entityCounters).map(([entityType, number]) => {
            return x `
                  <div class="entity-counter actionable" title=${number}>
                    <span>${capitalizeFirstChar(entityType.replace('-', ' '))} - <span class="muted-text" style="font-size: 90%">${number}</span></span>
                    <div 
                      class="counter-bar"
                      type=${entityType}
                      style="width: ${Math.round((number / this.totalEntityNumber) * 100)}%"
                    >
                    </div>
                  </div>
                `;
        })}
            </div>
          </div>

          ${this.iriPrefixesTemplate()}
        </div>
      </div>
    `;
    }
    iriPrefixesTemplate() {
        var _a;
        return x `
      <div class="area">
        <div class="bold-text">Namespace prefixes</div>
        <div class="area-content">
          ${(_a = this.ontology) === null || _a === void 0 ? void 0 : _a.namespaces.map(namespace => {
            return x `${namespace.prefixes.map((prefix, i) => {
                return x `
                <div class="row">
                  <div class="prefix-column bold-text">${prefix}</div>
                  <span class="vr"></span>
                  <div class="namespace-value-column">${namespace.toString()}</div>
              </div>
              `;
            })}`;
        })}
        </div>
      </div>
    `;
    }
    handleDiagramFilterChange(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectInput = e.target;
            let selectedDiagramId;
            try {
                selectedDiagramId = parseInt(Array.from(selectInput.selectedOptionsId)[0]);
            }
            catch (e) {
                selectInput.clear();
            }
            yield this.updateComplete;
            if (selectedDiagramId !== undefined && !isNaN(selectedDiagramId)) {
                this.diagramIdFilter = selectedDiagramId;
                this.dispatchEvent(new CustomEvent('counters-filter', {
                    bubbles: true,
                    composed: true,
                    detail: { diagramId: selectedDiagramId },
                }));
            }
            else {
                this.diagramIdFilter = undefined;
                this.dispatchEvent(new CustomEvent('counters-update', {
                    bubbles: true,
                    composed: true,
                    detail: { diagramId: undefined },
                }));
            }
        });
    }
    get totalEntityNumber() {
        return Object.values(this.entityCounters).reduce((result, currentNum) => result + currentNum);
    }
}
GscapeOntologyInfo.properties = {
    title: { type: String },
    language: { type: String },
    ontology: { type: Object },
    entityCounters: { type: Object },
    diagramIdFilter: { type: Number },
};
GscapeOntologyInfo.styles = [
    baseStyle,
    itemWithIriTemplateStyle,
    annotationsStyle,
    GscapeButtonStyle,
    i$1 `
      :host {
        order: 4;
        display:inline-block;
        position: initial;
        margin-top: 10px;
      }

      .gscape-panel {
        padding:0;
        min-height: 200px;
      }

      .gscape-panel > * {
        padding: 8px 16px;
      }

      .gscape-panel-in-tray > .content-wrapper {
        padding: 8px;
      }

      .row {
        display: flex;
        flex-direction: row;
        gap: 8px;
        padding: 4px 0;
      }

      .prefix-column {
        flex-shrink: 0;
        width: 50px;
        text-align: right;
      }

      .area:last-of-type {
        margin-bottom: 0;
      }

      .entity-counter {
        display: flex;
        align-items: center;
        padding: 4px;
      }

      .entity-counter > span {
        width: 145px;
        flex-shrink: 0;
      }

      .counter-bar {
        height: 6px;
        border-radius: 6px;
      }

      .counter-bar[type = "class"] {
        background: var(--gscape-color-class);
        border: solid 1px var(--gscape-color-class-contrast);
      }

      .counter-bar[type = "data-property"] {
        background: var(--gscape-color-data-property);
        border: solid 1px var(--gscape-color-data-property-contrast);
      }

      .counter-bar[type = "object-property"] {
        background: var(--gscape-color-object-property);
        border: solid 1px var(--gscape-color-object-property-contrast);
      }

      .counter-bar[type = "individual"] {
        background: var(--gscape-color-individual);
        border: solid 1px var(--gscape-color-individual-contrast);
      }

      .counter-bar[type = "class-instance"] {
        background: var(--gscape-color-class-instance);
        border: solid 1px var(--gscape-color-class-instance-contrast);
      }
    `,
];
customElements.define('gscape-ontology-info', GscapeOntologyInfo);

function initOntologyInfo(grapholscape) {
    const ontologyInfoComponent = new GscapeOntologyInfo();
    ontologyInfoComponent.language = grapholscape.language;
    grapholscape.on(LifecycleEvent.LanguageChange, language => {
        ontologyInfoComponent.language = language;
    });
    ontologyInfoComponent.onTogglePanel = () => {
        ontologyInfoComponent.ontology = grapholscape.ontology;
        ontologyInfoComponent.entityCounters = countEntities(grapholscape, ontologyInfoComponent.diagramIdFilter);
    };
    ontologyInfoComponent.addEventListener('counters-filter', (event) => {
        ontologyInfoComponent.entityCounters = countEntities(grapholscape, event.detail.diagramId);
    });
    ontologyInfoComponent.addEventListener('counters-update', () => {
        ontologyInfoComponent.entityCounters = countEntities(grapholscape, ontologyInfoComponent.diagramIdFilter);
    });
    grapholscape.widgets.set(WidgetEnum.ONTOLOGY_INFO, ontologyInfoComponent);
}
function countEntities(grapholscape, filterByDiagram) {
    const count = (entities) => {
        if (filterByDiagram !== undefined) {
            return entities.filter(entity => entity.hasOccurrenceInDiagram(filterByDiagram, grapholscape.renderState || RendererStatesEnum.GRAPHOL)).length;
        }
        else {
            return entities.length;
        }
    };
    return {
        [TypesEnum.CLASS]: count(grapholscape.ontology.getEntitiesByType(TypesEnum.CLASS)),
        [TypesEnum.DATA_PROPERTY]: count(grapholscape.ontology.getEntitiesByType(TypesEnum.DATA_PROPERTY)),
        [TypesEnum.OBJECT_PROPERTY]: count(grapholscape.ontology.getEntitiesByType(TypesEnum.OBJECT_PROPERTY)),
        [TypesEnum.INDIVIDUAL]: count(grapholscape.ontology.getEntitiesByType(TypesEnum.INDIVIDUAL)),
    };
}

function entityIriTemplate(iri, entityType) {
    if (entityType === TypesEnum.FACET) {
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
            case TypesEnum.INCLUSION:
                if (grapholSource.identity !== grapholTarget.identity)
                    return;
                switch (grapholSource.identity) {
                    case TypesEnum.CLASS:
                        if (grapholSource.is(TypesEnum.DOMAIN_RESTRICTION) && grapholSource.displayedName != 'self' && grapholTarget.displayedName != 'self') {
                            return this.propertyDomain(edge);
                        }
                        else if (grapholSource.is(TypesEnum.RANGE_RESTRICTION) && grapholSource.displayedName != 'self' && grapholTarget.displayedName != 'self') {
                            return this.propertyRange(edge);
                        }
                        else if (grapholTarget.is(TypesEnum.COMPLEMENT) || grapholSource.is(TypesEnum.COMPLEMENT)) {
                            return this.disjointClassesFromEdge(edge.connectedNodes());
                        }
                        return this.subClassOf(edge);
                    case TypesEnum.OBJECT_PROPERTY:
                        if (grapholTarget.is(TypesEnum.COMPLEMENT))
                            return this.disjointTypeProperties(edge);
                        else
                            return this.subTypePropertyOf(edge);
                    case TypesEnum.VALUE_DOMAIN:
                        return this.propertyRange(edge);
                    case TypesEnum.DATATYPE_RESTRICTION:
                        if (grapholTarget.is(TypesEnum.COMPLEMENT))
                            return this.disjointTypeProperties(edge);
                        else
                            return this.subTypePropertyOf(edge);
                    default: return this.malformed;
                }
            case TypesEnum.EQUIVALENCE:
                if (grapholSource.identity !== grapholTarget.identity)
                    return;
                switch (grapholSource.identity) {
                    case TypesEnum.CLASS:
                        return this.equivalentClasses(edge);
                    case TypesEnum.OBJECT_PROPERTY:
                        if (grapholSource.is(TypesEnum.ROLE_INVERSE) || grapholTarget.is(TypesEnum.ROLE_INVERSE)) {
                            return this.inverseObjectProperties(edge);
                        }
                        else {
                            return this.equivalentTypeProperties(edge);
                        }
                    case TypesEnum.DATA_PROPERTY:
                        return this.equivalentTypeProperties(edge);
                    default:
                        return this.malformed;
                }
            case TypesEnum.MEMBERSHIP:
                if (grapholTarget.identity == TypesEnum.CLASS)
                    return this.classAssertion(edge);
                else
                    return this.propertyAssertion(edge);
        }
    }
    subClassOf(inclusionEdge) {
        return `SubClassOf(${this.nodeToOwlString(inclusionEdge.source())} ${this.nodeToOwlString(inclusionEdge.target())})`;
    }
    propertyDomain(edgeOutFromDomain) {
        const nodes = edgeOutFromDomain.source().incomers(`[type = "${TypesEnum.INPUT}"]`).sources();
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
        var nodeSources = edge.source().incomers(`[type = "${TypesEnum.INPUT}"]`).sources();
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
        if (sourceGrapholNode.type == TypesEnum.PROPERTY_ASSERTION) {
            var property_node = edge.source();
            property_node.incomers(`[type = "${TypesEnum.INPUT}"]`).sources().forEach(input => {
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
        if (edge.source().data('type') == TypesEnum.ROLE_INVERSE) {
            input = edge.target();
            complementInput = edge.source().incomers(`[type = "${TypesEnum.INPUT}"]`).sources()[0];
        }
        else {
            input = edge.source();
            complementInput = edge.target().incomers(`[type = "${TypesEnum.INPUT}"]`).sources()[0];
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
            if (input.data('type') == TypesEnum.COMPLEMENT) {
                input = input.incomers(`[type = "${TypesEnum.INPUT}"]`).source();
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
            if (node.data('type') == TypesEnum.COMPLEMENT) {
                node = node.incomers(`[type = "${TypesEnum.INPUT}"]`).source();
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
        if (grapholNode.isEntity() || grapholNode.is(TypesEnum.VALUE_DOMAIN)) {
            let nodeIri;
            const grapholNodeEntity = this._grapholscape.ontology.getEntity(node.data().iri);
            if (grapholNodeEntity === null || grapholNodeEntity === void 0 ? void 0 : grapholNodeEntity.iri) {
                nodeIri = grapholNodeEntity.iri;
            }
            else if (grapholNode.is(TypesEnum.VALUE_DOMAIN) && grapholNode.displayedName) {
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
                entitiesOwlNames[TypesEnum.CLASS] = 'Class';
                entitiesOwlNames[TypesEnum.OBJECT_PROPERTY] = 'ObjectProperty';
                entitiesOwlNames[TypesEnum.DATA_PROPERTY] = 'DataProperty';
                entitiesOwlNames[TypesEnum.INDIVIDUAL] = 'NamedIndividual';
                entitiesOwlNames[TypesEnum.VALUE_DOMAIN] = 'Datatype';
                if (grapholNode.is(TypesEnum.OBJECT_PROPERTY) || grapholNode.is(TypesEnum.DATA_PROPERTY)) {
                    grapholNodeEntity === null || grapholNodeEntity === void 0 ? void 0 : grapholNodeEntity.functionProperties.forEach(functionality => {
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
                case TypesEnum.FACET:
                    var remainder = grapholNode.displayedName.replace(/\n/g, '^').split('^^');
                    remainder[0] = remainder[0].slice(4);
                    return '<span class="axiom_predicate_prefix">xsd:</span><span class="owl_value-domain">' + remainder[0] + '</span><span class="owl_value">' + remainder[1] + '</span>';
                case TypesEnum.DOMAIN_RESTRICTION:
                case TypesEnum.RANGE_RESTRICTION:
                    var input_edges = node.connectedEdges(`edge[target = "${node.id()}"][type = "${TypesEnum.INPUT}"]`);
                    var input_first;
                    var input_other;
                    if (!input_edges.length) {
                        return this.missingOperand;
                    }
                    input_edges.forEach((e) => {
                        if (e.source().data('type') == TypesEnum.OBJECT_PROPERTY || e.source().data('type') == TypesEnum.DATA_PROPERTY) {
                            input_first = e.source();
                        }
                        if (e.source().data('type') != TypesEnum.OBJECT_PROPERTY && e.source().data('type') != TypesEnum.DATA_PROPERTY) {
                            input_other = e.source();
                        }
                    });
                    if (input_first) {
                        if (input_first.data('type') == TypesEnum.DATA_PROPERTY && grapholNode.type == TypesEnum.RANGE_RESTRICTION)
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
                case TypesEnum.ROLE_INVERSE:
                    inputs = node.incomers(`[type = "${TypesEnum.INPUT}"]`).sources();
                    if (inputs.length <= 0)
                        return this.missingOperand;
                    return this.objectInverseOf(inputs[0]);
                case TypesEnum.ROLE_CHAIN:
                    if (!node.data('inputs'))
                        return this.missingOperand;
                    return this.objectPropertyChain(node.incomers(`[type = "${TypesEnum.INPUT}"]`).sources());
                case TypesEnum.UNION:
                case TypesEnum.INTERSECTION:
                case TypesEnum.COMPLEMENT:
                case TypesEnum.ENUMERATION:
                case TypesEnum.DISJOINT_UNION:
                    inputs = node.incomers(`[type = "${TypesEnum.INPUT}"]`).sources();
                    if (inputs.length <= 0)
                        return this.missingOperand;
                    const axiomType = this.getAxiomPropertyType(grapholNode);
                    if (node.data('type') == TypesEnum.DISJOINT_UNION) {
                        if (!startingFromNode) {
                            return this.logicalConstructors(inputs, TypesEnum.UNION, axiomType);
                        }
                        else {
                            return this.logicalConstructors(inputs, TypesEnum.UNION, axiomType) + '<br />' + this.disjointClassesFromNode(inputs);
                        }
                    }
                    return this.logicalConstructors(inputs, node.data('type'), axiomType);
                case TypesEnum.DATATYPE_RESTRICTION:
                    inputs = node.incomers(`[type = "${TypesEnum.INPUT}"]`).sources();
                    if (inputs.length <= 0) {
                        return this.missingOperand;
                    }
                    return this.datatypeRestriction(inputs);
                case TypesEnum.PROPERTY_ASSERTION:
                    return;
                case TypesEnum.HAS_KEY:
                    inputs = node.incomers(`[type = "${TypesEnum.INPUT}"]`).sources();
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
        if (restrictionType == TypesEnum.RANGE_RESTRICTION) {
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
            if (restrictionType == TypesEnum.RANGE_RESTRICTION) {
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
        let classNode = inputs.filter(`[identity = "${TypesEnum.CLASS}}"]`);
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
        if (constructorName == TypesEnum.ENUMERATION) {
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
        let valueDomain = inputs.filter(`[type = "${TypesEnum.VALUE_DOMAIN}"]`)[0];
        owlString += this.nodeToOwlString(valueDomain) + ' ';
        inputs.forEach((input) => {
            if (input.data('type') == TypesEnum.FACET) {
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
        if (restrictionType == TypesEnum.RANGE_RESTRICTION)
            return `ObjectHasSelf(${this.objectInverseOf(input)})`;
        return `ObjectHasSelf(${this.nodeToOwlString(input)})`;
    }
    getAxiomPropertyType(node) {
        if (node.is(TypesEnum.DATA_PROPERTY))
            return 'Data';
        else if (node.is(TypesEnum.OBJECT_PROPERTY))
            return 'Object';
        if (isGrapholNode(node)) {
            if (node.identity === TypesEnum.DATA_PROPERTY)
                return 'Data';
            else if (node.identity === TypesEnum.OBJECT_PROPERTY)
                return 'Object';
        }
        return '';
    }
}

function init$2 (owlVisualizerComponent, grapholscape) {
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
        this.isDefaultClosed = false;
    }
    render() {
        if (!this.owlText)
            return;
        return x `
      <div class="top-bar ${this.isPanelClosed() ? null : 'traslated-down'}">
        <gscape-button style="z-index: 1"
          id="toggle-panel-button"
          size="${this.isPanelClosed() ? 'm' : 's'}" 
          type="${this.isPanelClosed() ? '' : 'subtle'}"
          @click=${this.togglePanel}
          label = "${this.isPanelClosed() ? this.title : ''}"
        > 
          ${this.isPanelClosed()
            ? x `
                <span slot="icon">${owl_icon}</span>
                <span slot="trailing-icon">${plus}</span>
              `
            : x `<span slot="icon">${minus}</span>`}
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

    `,
];
customElements.define('gscape-owl-visualizer', GscapeOwlVisualizer);

function initOwlVisualizer(grapholscape) {
    const owlVisualizerComponent = new GscapeOwlVisualizer();
    init$2(owlVisualizerComponent, grapholscape);
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
        return x `
      ${this.currentRendererStateKey === RendererStatesEnum.INCREMENTAL && this.onIncrementalReset
            ? x `
          <gscape-button @click=${this.onIncrementalReset} type="subtle" title="Restart Incremental Exploration">
            <span slot="icon">${refresh}</span>
          </gscape-button>
          <div class="hr"></div>
        `
            : null}

      <gscape-button @click="${this.togglePanel}" type="subtle">
        <span slot="icon">${((_a = this.currentRendererState) === null || _a === void 0 ? void 0 : _a.icon) || x `<div style="padding: 1.5px 6.5px;" class="bold-text">?</div>`}</span>
      </gscape-button>

      <div class="gscape-panel gscape-panel-in-tray hanging hide" id="drop-panel">
        <div class="header">${this.title}</div>
        <div class="content-wrapper">
          ${this.rendererStates.map(rendererState => {
            if (rendererState) {
                return x `
                  <gscape-action-list-item
                    @click=${this.rendererSelectionHandler}
                    label="${rendererState.name}"
                    renderer-state="${rendererState.id}"
                    ?selected = "${this.currentRendererState === rendererState}"
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
    get currentRendererState() { return this.rendererStates.find(r => (r === null || r === void 0 ? void 0 : r.id) === this.currentRendererStateKey); }
}
GscapeRenderSelector.properties = {
    currentRendererStateKey: { type: String, attribute: false },
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

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
function initRendererSelector(grapholscape) {
    const rendererSelectorComponent = new GscapeRenderSelector();
    init$9(rendererSelectorComponent, grapholscape);
    rendererSelectorComponent.requestUpdate();
    grapholscape.widgets.set(WidgetEnum.RENDERER_SELECTOR, rendererSelectorComponent);
}

var settingsStyle = i$1 `
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
`;

class GscapeSettings extends DropPanelMixin(BaseMixin(s)) {
    constructor() {
        super();
        this.title = 'Settings';
        this.onEntityNameTypeChange = () => { };
        this.onLanguageChange = () => { };
        this.onThemeChange = () => { };
        this.onPngExport = () => { };
        this.onSvgExport = () => { };
        this.onJSONExport = () => { };
        this.classList.add(BOTTOM_RIGHT_WIDGET.toString());
    }
    render() {
        return x `
      <gscape-button type="subtle" @click=${this.togglePanel}>
        <span slot="icon">${settings_icon}</span>
      </gscape-button>

      <div class="gscape-panel gscape-panel-in-tray hide" id="drop-panel">
        <div class="header">${this.title}</div>

        <div class="content-wrapper">

        <div class="area">
            <div class="bold-text">Preferences</div>
            ${this.getListSettingEntryTemplate(Object.values(RDFGraphConfigEntityNameTypeEnum).map(ent => {
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

        <!-- <div class="area">
          <div class="setting">
            <gscape-button label="Export JSON" size="s" @click=${this.onJSONExport}>
            </gscape-button>
          </div>
        </div> -->

        <div class="area">
          <div class="bold-text">About</div>
          <div id="logo">
            ${grapholscapeLogo}
          </div>

          <div id="version" class="muted-text">
            <span>Version: </span>
            <span>${"4.0.11"}</span>
          </div>
        </div>
      </div>
    `;
    }
    getSettingTitleTemplate(title, label) {
        return x `
    <div class="title-wrap">
      <div class="setting-title">${title}</div>
      <div class="muted-text setting-label">${label}</div>
    </div>
    `;
    }
    getListSettingEntryTemplate(options, selectedOption, title, label) {
        if (options.length <= 0)
            return null;
        return x `
      <div class="setting">
        ${this.getSettingTitleTemplate(title, label)}
        <div class="setting-obj">
          <select id="${title}" @change=${this.listChangeHandler}>
            ${options.map(option => {
            let selected = option.value == selectedOption;
            return x `<option value="${option.value}" ?selected=${selected}>${option.label}</option>`;
        })}
          </select>
        </div>
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
    settingsStyle,
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
    settingsComponent.languages = grapholscape.ontology.languages;
    settingsComponent.selectedLanguage = grapholscape.language;
    settingsComponent.selectedEntityNameType = grapholscape.entityNameType;
    settingsComponent.themes = grapholscape.themeList;
    settingsComponent.selectedTheme = grapholscape.theme.id;
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
    settingsComponent.onJSONExport = () => grapholscape.exportToRdfGraph();
    grapholscape.on(LifecycleEvent.LanguageChange, language => settingsComponent.selectedLanguage = language);
    grapholscape.on(LifecycleEvent.EntityNameTypeChange, entityNameType => settingsComponent.selectedEntityNameType = entityNameType);
    grapholscape.on(LifecycleEvent.ThemeChange, newTheme => settingsComponent.selectedTheme = newTheme.id);
    grapholscape.on(LifecycleEvent.RendererChange, newRenderer => {
        settingsComponent.themes = grapholscape.themeList;
    });
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
        return x `
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
    initLayoutSettings(grapholscape);
    initInitialRendererSelector(grapholscape);
    initColors(grapholscape);
    grapholscape.widgets.get(WidgetEnum.SETTINGS);
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
            case WidgetEnum.INCREMENTAL_FILTERS:
                guiContainer.appendChild(widget);
                break;
            case WidgetEnum.INITIAL_RENDERER_SELECTOR:
                grapholscape.container.appendChild(widget);
                break;
        }
        const _widget = widget;
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

class GscapeTabs extends s {
    constructor() {
        super(...arguments);
        this.tabs = [];
        this.activeTabID = 0;
    }
    handleTabClick(evt) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const tabID = (_a = evt.currentTarget) === null || _a === void 0 ? void 0 : _a.id;
            if (tabID !== undefined) {
                this.activeTabID = parseInt(tabID);
                yield this.updateComplete;
                this.dispatchEvent(new CustomEvent('change', {
                    bubbles: true,
                    composed: true,
                    detail: this.activeTabID
                }));
            }
        });
    }
    render() {
        return x `
      <div class="nav-bar">
        ${this.tabs.map(tab => {
            return x `
            <div id=${tab.id} @click=${this.handleTabClick} class="tab-wrapper" ?active=${this.activeTabID === tab.id}>
              <div class="actionable tab">
                ${tab.icon
                ? x `<span class="slotted-icon">${tab.icon}</span>`
                : null}
                <span class="label">${tab.label}</span>
              </div>
            </div>
          `;
        })}
      </div>
    `;
    }
}
GscapeTabs.properties = {
    tabs: { type: Object },
    activeTabID: { type: String, state: true },
};
GscapeTabs.styles = [
    baseStyle,
    i$1 `
      .nav-bar {
        display: flex;
        justify-content: space-evenly;
        gap: 8px;
      }

      .tab {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
        gap: 4px;
      }

      .tab-wrapper {
        flex-grow: 1;
        padding-bottom: 4px;
      }

      .tab-wrapper[active] {
        border-bottom: solid 3px var(--gscape-color-accent);
      }

      .tab > .label {
        text-align: center;
      }
    `
];
customElements.define('gscape-tabs', GscapeTabs);

class IncrementalInitialMenu extends BaseMixin(s) {
    constructor(grapholscape) {
        super();
        this.shortestPathEnabled = false;
        this.sideMenuMode = false;
        this.render = () => {
            return x `
      <gscape-entity-selector
        .onClassSelection=${(iri) => this.handleClassSelection(iri)}
        .entityList=${this.classes}
      ></gscape-entity-selector>

      ${!this.sideMenuMode && this.shortestPathEnabled
                ? x `
          <gscape-button
            id="shortest-path-btn"
            label="Shortest Path"
            @click=${this.handleShortestPathBtnClick}
          ></gscape-button>
        `
                : null}
    `;
        };
        if (grapholscape) {
            this.classes = createEntitiesList(grapholscape, { class: 1, areAllFiltersDisabled: false });
            grapholscape.on(LifecycleEvent.EntityNameTypeChange, () => {
                this.classes = createEntitiesList(grapholscape, { class: 1, areAllFiltersDisabled: false });
            });
            grapholscape.on(LifecycleEvent.LanguageChange, () => {
                this.classes = createEntitiesList(grapholscape, { class: 1, areAllFiltersDisabled: false });
            });
        }
    }
    focusInputSearch() {
        var _a, _b;
        (_b = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('gscape-entity-selector')) === null || _b === void 0 ? void 0 : _b.focusInputSearch();
    }
    closePanel() {
        var _a;
        let entitySelector = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('gscape-entity-selector');
        entitySelector.closePanel();
        this.requestUpdate();
    }
    openPanel() {
        var _a;
        let entitySelector = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('gscape-entity-selector');
        entitySelector.openPanel();
        this.requestUpdate();
    }
    handleShortestPathBtnClick() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateComplete;
            this.dispatchEvent(new CustomEvent('shortest-path-click', { bubbles: true, composed: true }));
        });
    }
    handleClassSelection(iri) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateComplete;
            this.dispatchEvent(new CustomEvent('class-selection', {
                bubbles: true,
                composed: true,
                detail: iri
            }));
        });
    }
}
IncrementalInitialMenu.properties = {
    classes: { type: Array },
    sideMenuMode: { type: Boolean },
    shortestPathEnabled: { type: Boolean },
};
IncrementalInitialMenu.styles = [
    baseStyle,
    i$1 `
      :host {
        max-height: 70%;
        width: 40%;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        top: 20%;
        left: 50%;
        transform: translate(-50%);
        position: absolute;
      }

      gscape-entity-selector {
        display: block;
        z-index: 1;
      }

      #shortest-path-btn {
        position: fixed;
        top: 200px;
        align-self: center;
      }
    `,
];
customElements.define('incremental-initial-menu', IncrementalInitialMenu);

var _a, _b;
/** @internal */
class ShortestPathDialog extends (_b = GscapeConfirmDialog) {
    constructor(grapholscape) {
        super();
        this.class1EditEnabled = true;
        this.class2EditEnabled = true;
        this.render = () => {
            return x `
      <div class="gscape-panel" style="overflow: unset; max-width: 70%">
        <div class="header">Find shortest path between two classes</div>
        <div class="column-container">
          ${this.getClassSelectorTemplate(1, this.class1, this.class1EditEnabled)}

          <div style="width: fit-content; align-self: center;">
            ${arrow_right}
          </div>

          ${this.getClassSelectorTemplate(2, this.class2, this.class2EditEnabled)}
        </div>

        <div class="buttons">
          ${this._onConfirm || this._onCancel
                ? x `
              <gscape-button label="Cancel" type="subtle" @click=${this.handleCancel}></gscape-button>
            `
                : null}
          <gscape-button
            ?disabled=${!this._class1 || !this._class2}
            title="Find Shortest Path"
            type="primary"
            label="Confirm"
            @click=${this.handleConfirm}
          ></gscape-button>
        </div>
      </div>
    `;
        };
        if (grapholscape)
            this.classes = createEntitiesList(grapholscape, { class: 1, areAllFiltersDisabled: false });
    }
    closePanel() {
        var _c;
        let entitySelectors = (_c = this.shadowRoot) === null || _c === void 0 ? void 0 : _c.querySelectorAll('gscape-entity-selector');
        entitySelectors === null || entitySelectors === void 0 ? void 0 : entitySelectors.forEach(entitySelector => entitySelector.closePanel());
        this.requestUpdate();
    }
    openPanel() {
        var _c;
        let entitySelectors = (_c = this.shadowRoot) === null || _c === void 0 ? void 0 : _c.querySelectorAll('gscape-entity-selector');
        entitySelectors === null || entitySelectors === void 0 ? void 0 : entitySelectors.forEach(entitySelector => entitySelector.openPanel());
        this.requestUpdate();
    }
    onConfirm(callback) {
        this._onConfirm = callback;
        return this;
    }
    getClassSelectorTemplate(id, iri, allowClear = true) {
        var _c;
        if (iri) {
            const classEntity = (_c = this.classes) === null || _c === void 0 ? void 0 : _c.find(c => c.value.iri.equals(iri));
            if (classEntity)
                return x `
          <div class="gscape-panel selected-entity-wrapper">
            <gscape-entity-list-item
              .types=${classEntity.value.types}
              displayedName=${classEntity.displayedName}
              iri=${classEntity.value.iri}
            >
            </gscape-entity-list-item>
            ${allowClear
                    ? x `
                <gscape-button
                  title="Clear"
                  size=${SizeEnum.S}
                  @click=${() => { this[`class${id}`] = undefined; }}
                >
                  ${getIconSlot('icon', cross)}
                </gscape-button>
              `
                    : null}
          </div>
        `;
        }
        else {
            return x `
        <gscape-entity-selector
          .onClassSelection=${(iri) => this.handleClassSelection(iri, id)}
          .entityList=${this.classes}
        ></gscape-entity-selector>
      `;
        }
    }
    handleClassSelection(iri, selectorId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (selectorId === 1) {
                this.class1 = iri;
            }
            if (selectorId === 2) {
                this.class2 = iri;
            }
        });
    }
    handleConfirm() {
        if (this._onConfirm && this.class1 && this.class2)
            this._onConfirm(this.class1, this.class2);
        this.remove();
    }
    set class1(newClassIri) {
        this._class1 = newClassIri;
    }
    get class1() {
        return this._class1;
    }
    set class2(newClassIri) {
        this._class2 = newClassIri;
    }
    get class2() {
        return this._class2;
    }
}
_a = ShortestPathDialog;
ShortestPathDialog.properties = {
    classes: { type: Array },
    _class1: { type: String, attribute: 'class1' },
    _class2: { type: String, attribute: 'class2' },
    class1EditEnabled: { type: Boolean },
    class2EditEnabled: { type: Boolean },
};
ShortestPathDialog.styles = [
    Reflect.get(_b, "styles", _a),
    i$1 `
      gscape-entity-selector {
        position: static;
        display: block;
        z-index: 1;
      }

      .column-container {
        display: flex;
        padding: 16px 8px;
        justify-content: space-between;
        height: 60px;
        gap: 16px;
      }

      .selected-entity-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: fit-content;
        min-width: 200px;
        max-width: unset;
        box-sizing: border-box;
        position: unset;
        left: unset;
        transform: unset;
        align-self: center;
      }
    `,
];
customElements.define('shortest-path-dialog', ShortestPathDialog);

/** @module UI */

var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BOTTOM_RIGHT_WIDGET_CLASS: BOTTOM_RIGHT_WIDGET,
    BaseMixin: BaseMixin,
    ContentSpinner: ContentSpinner,
    ContextualWidgetMixin: ContextualWidgetMixin,
    DropPanelMixin: DropPanelMixin,
    GscapeActionListItem: GscapeActionListItem,
    GscapeActionListStyle: actionItemStyle,
    GscapeButton: GscapeButton,
    GscapeButtonStyle: GscapeButtonStyle,
    GscapeConfirmDialog: GscapeConfirmDialog,
    GscapeContextMenu: GscapeContextMenu,
    GscapeDiagramSelector: GscapeDiagramSelector,
    GscapeEntityColorLegend: GscapeEntityColorLegend,
    GscapeEntityListItem: GscapeEntityListItem,
    GscapeEntitySearch: GscapeEntitySearch,
    GscapeEntitySelector: GscapeEntitySelector,
    GscapeEntityTypeFilters: GscapeEntityTypeFilters,
    GscapeFullPageSelector: GscapeFullPageSelector,
    GscapeSelect: GscapeSelect,
    GscapeTextSearch: GscapeTextSearch,
    GscapeToggle: GscapeToggle,
    IncrementalInitialMenu: IncrementalInitialMenu,
    ModalMixin: ModalMixin,
    NodeButton: NodeButton,
    ShortestPathDialog: ShortestPathDialog,
    get SizeEnum () { return SizeEnum; },
    get ToggleLabelPosition () { return ToggleLabelPosition; },
    get WidgetEnum () { return WidgetEnum; },
    a11yClick: a11yClick,
    annotationsStyle: annotationsStyle,
    annotationsTemplate: annotationsTemplate,
    baseStyle: baseStyle,
    commentsTemplate: commentsTemplate,
    contentSpinnerStyle: contentSpinnerStyle,
    createEntitiesList: createEntitiesList,
    emptySearchBlankState: emptySearchBlankState,
    entityListItemStyle: entityListItemStyle,
    getContentSpinner: getContentSpinner,
    getEntityOccurrencesTemplate: getEntityOccurrencesTemplate,
    getIconSlot: getIconSlot,
    hasDropPanel: hasDropPanel,
    icons: index$3,
    initInitialRendererSelector: initInitialRendererSelector,
    initUI: init,
    itemWithIriTemplate: itemWithIriTemplate,
    itemWithIriTemplateStyle: itemWithIriTemplateStyle,
    search: search,
    setColorList: setColorList,
    showMessage: showMessage,
    textSpinner: textSpinner,
    textSpinnerStyle: textSpinnerStyle
});

class IncrementalBase {
    constructor(grapholscape) {
        this.actionsWithBlockedGraph = 0;
        this.classFilterMap = new Map();
        this.diagram = new IncrementalDiagram();
        this.lifecycle = new IncrementalLifecycle();
        this.on = this.lifecycle.on;
        this.addEdge = (sourceId, targetId, edgeType) => {
            return this.diagramBuilder.addEdge(sourceId, targetId, edgeType);
        };
        this.grapholscape = grapholscape;
        // this.grapholscape.incremental = this
        this.diagramBuilder = new DiagramBuilder(this.diagram, RendererStatesEnum.INCREMENTAL);
    }
    performActionWithBlockedGraph(action, customLayoutOptions) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.actionsWithBlockedGraph += 1;
            const oldElemNumbers = this.numberOfElements;
            (_a = this.incrementalRenderer) === null || _a === void 0 ? void 0 : _a.freezeGraph();
            yield action();
            this.actionsWithBlockedGraph -= 1;
            this.postDiagramEdit(oldElemNumbers, customLayoutOptions);
        });
    }
    showDiagram(viewportState) {
        if (viewportState)
            this.diagram.lastViewportState = viewportState;
        setGraphEventHandlers(this.diagram, this.grapholscape.lifecycle, this.grapholscape.ontology);
        this.grapholscape.renderer.render(this.diagram);
    }
    addClass(iri, centerOnIt = true, position) {
        var _a;
        const entity = this.grapholscape.ontology.getEntity(iri);
        let classNode;
        if (entity && this.diagram.representation) {
            if (!entity.color) {
                const colorManager = new OntologyColorManager(this.grapholscape.ontology, this.diagram.representation);
                colorManager.setClassColor(entity);
            }
            classNode = this.diagramBuilder.addClass(entity, position);
            classNode.displayedName = entity === null || entity === void 0 ? void 0 : entity.getDisplayedName(this.grapholscape.entityNameType, this.grapholscape.language);
            this.diagram.representation.updateElement(classNode, undefined, false);
        }
        else {
            const classNodeId = this.getIDByIRI(iri, TypesEnum.CLASS);
            if (classNodeId)
                classNode = (_a = this.diagram.representation) === null || _a === void 0 ? void 0 : _a.grapholElements.get(classNodeId);
        }
        if (centerOnIt && classNode) {
            this.grapholscape.centerOnElement(classNode.id);
            this.grapholscape.selectElement(classNode.id);
        }
        this.lifecycle.trigger(IncrementalEvent.DiagramUpdated);
        return classNode;
    }
    addIndividual(individual, parentClassesIris, position) {
        const addedNode = this.diagramBuilder.addIndividual(individual, position);
        parentClassesIris === null || parentClassesIris === void 0 ? void 0 : parentClassesIris.forEach(parentClassesIri => {
            const classId = this.getIDByIRI(parentClassesIri, TypesEnum.CLASS);
            if (addedNode && classId) {
                this.diagramBuilder.addEdge(addedNode.id, classId, TypesEnum.INSTANCE_OF);
            }
        });
        // if (!individual.color && this.diagram.representation) {
        //   const colorManager = new OntologyColorManager(this.grapholscape.ontology, this.diagram.representation)
        //   colorManager.setInstanceColor(individual as ClassInstance)
        // }
        // this.updateEntityNameType(individual.iri)
        this.lifecycle.trigger(IncrementalEvent.DiagramUpdated);
        return addedNode;
    }
    /**
     * Add object property edge between two classes.
     * @param objectPropertyIri the object property iri to add
     * @param sourceClassIri
     * @param targetClassIri
     */
    addIntensionalObjectProperty(objectPropertyIri, sourceClassIri, targetClassIri) {
        const objectPropertyEntity = this.grapholscape.ontology.getEntity(objectPropertyIri);
        const sourceClass = this.grapholscape.ontology.getEntity(sourceClassIri);
        const targetClass = this.grapholscape.ontology.getEntity(targetClassIri);
        let objectPropertyEdge;
        if (objectPropertyEntity && sourceClass && targetClass) {
            if ((!sourceClass.color || !targetClass.color) && this.diagram.representation) {
                new OntologyColorManager(this.grapholscape.ontology, this.diagram.representation)
                    .setClassColor(sourceClass)
                    .setClassColor(targetClass);
            }
            objectPropertyEdge = this.diagramBuilder.addObjectProperty(objectPropertyEntity, sourceClass, targetClass, [TypesEnum.CLASS]);
            // this.updateEntityNameType(objectPropertyEntity.iri)
            // this.updateEntityNameType(sourceClassIri)
            // this.updateEntityNameType(targetClassIri)
            setTimeout(() => {
                const nodeId = this.getIDByIRI(targetClassIri, TypesEnum.CLASS);
                if (nodeId) {
                    this.grapholscape.centerOnElement(nodeId);
                }
            }, 250);
            this.lifecycle.trigger(IncrementalEvent.DiagramUpdated);
            return objectPropertyEdge;
        }
    }
    showClassesInIsa(sourceIri, targetsIris, isaType, subOrSuper = 'sub') {
        const sourceId = this.getIDByIRI(sourceIri, TypesEnum.CLASS);
        if (sourceId) {
            this.performActionWithBlockedGraph(() => {
                let targetNode;
                targetsIris.forEach(targetIri => {
                    var _a, _b;
                    targetNode = this.addClass(targetIri, false);
                    if (targetNode) {
                        const cySource = (_a = this.diagram.representation) === null || _a === void 0 ? void 0 : _a.cy.$id(sourceId);
                        const cyTarget = (_b = this.diagram.representation) === null || _b === void 0 ? void 0 : _b.cy.$id(targetNode.id);
                        if ((cySource === null || cySource === void 0 ? void 0 : cySource.nonempty()) && (cyTarget === null || cyTarget === void 0 ? void 0 : cyTarget.nonempty())) {
                            if (subOrSuper === 'super') {
                                const isEdgeAlreadyPresent = cySource.edgesTo(cyTarget)
                                    .filter(e => e.data().type === TypesEnum.INCLUSION ||
                                    e.data().type === TypesEnum.EQUIVALENCE)
                                    .nonempty();
                                if (!isEdgeAlreadyPresent) {
                                    this.diagramBuilder.addEdge(sourceId, targetNode.id, isaType);
                                }
                            }
                            else {
                                const isEdgeAlreadyPresent = cyTarget.edgesTo(cySource)
                                    .filter(e => e.data().type === TypesEnum.INCLUSION ||
                                    e.data().type === TypesEnum.EQUIVALENCE)
                                    .nonempty();
                                if (!isEdgeAlreadyPresent) {
                                    this.diagramBuilder.addEdge(targetNode.id, sourceId, isaType);
                                }
                            }
                        }
                    }
                });
            });
        }
    }
    /**
     * Show hierarchies for which the specified class is a subclass.
     * @param classIri
     */
    showSuperHierarchiesOf(classIri) {
        this.showOrHideHierarchies(classIri, 'super', 'show');
    }
    /**
     * Show hierarchies for which the specified class is a superclass.
     * @param classIri
     */
    showSubHierarchiesOf(classIri) {
        this.showOrHideHierarchies(classIri, 'sub', 'show');
    }
    showOrHideHierarchies(classIri, hierarchyType, showORHide) {
        const classEntity = this.grapholscape.ontology.getEntity(classIri);
        if (!classEntity)
            return;
        let hierarchies;
        const sub = this.grapholscape.ontology.getSubHierarchiesOf(classIri); // get hiearchies with class being a superclass => get sub classes
        const superh = this.grapholscape.ontology.getSuperHierarchiesOf(classIri); // get hierarchies with class being a subclass => get super classes
        switch (hierarchyType) {
            case 'super':
                hierarchies = superh;
                break;
            case 'sub':
                hierarchies = sub;
                break;
            case 'any':
                hierarchies = [];
                if (sub)
                    hierarchies.concat(sub);
                if (superh)
                    hierarchies.concat(superh);
                break;
            default:
                return;
        }
        if (hierarchies && hierarchies.length > 0) {
            this.performActionWithBlockedGraph(() => {
                var _a;
                const classId = this.getIDByIRI(classIri, TypesEnum.CLASS);
                if (classId) {
                    const position = (_a = this.grapholscape.renderer.cy) === null || _a === void 0 ? void 0 : _a.$id(classId).position();
                    if (showORHide === 'show')
                        hierarchies === null || hierarchies === void 0 ? void 0 : hierarchies.forEach(hierarchy => this.diagramBuilder.addHierarchy(hierarchy, position));
                    else
                        hierarchies === null || hierarchies === void 0 ? void 0 : hierarchies.forEach(hierarchy => this.removeHierarchy(hierarchy, [classIri]));
                }
            });
        }
    }
    removeHierarchy(hierarchy, entitiesTokeep = []) {
        if (!hierarchy.id || !this.isHierarchyNodeInDiagram(hierarchy)) {
            return;
        }
        this.diagramBuilder.removeHierarchy(hierarchy);
        let classId;
        // remove input classes or superclasses left with no edges
        hierarchy.inputs.forEach(inputClass => {
            var _a;
            classId = this.getIDByIRI(inputClass.iri.fullIri, TypesEnum.CLASS);
            if (classId &&
                ((_a = this.grapholscape.renderer.cy) === null || _a === void 0 ? void 0 : _a.$id(classId).degree(false)) === 0 &&
                !entitiesTokeep.includes(inputClass.iri.fullIri)) {
                this.removeEntity(inputClass);
            }
        });
        hierarchy.superclasses.forEach(superclass => {
            var _a;
            classId = this.getIDByIRI(superclass.classEntity.iri.fullIri, TypesEnum.CLASS);
            if (classId &&
                ((_a = this.grapholscape.renderer.cy) === null || _a === void 0 ? void 0 : _a.$id(classId).degree(false)) === 0 &&
                !entitiesTokeep.includes(superclass.classEntity.iri.fullIri)) {
                this.removeEntity(superclass.classEntity);
            }
        });
    }
    /**
     * Remove a class, an instance or a data property node from the diagram.
     * Entities left with no other connections are recurisvely removed too.
     * Called when the user click on the remove button on a entity node
     * @param entity
     */
    removeEntity(entity, entitiesIrisToKeep = []) {
        this.performActionWithBlockedGraph(() => {
            var _a;
            (_a = this.grapholscape.renderer.cy) === null || _a === void 0 ? void 0 : _a.$(`[iri = "${entity === null || entity === void 0 ? void 0 : entity.iri.fullIri}"]`).forEach(element => {
                var _a;
                // start from object properties connected to this entity, remove their occurrences from ontology entities
                const edges = element.connectedEdges(`[type = "${TypesEnum.OBJECT_PROPERTY}"]`);
                edges.forEach(objectPropertyEdge => {
                    var _a;
                    const objectPropertyEntity = this.grapholscape.ontology.getEntity(objectPropertyEdge.data().iri);
                    if (objectPropertyEntity) {
                        const grapholOccurrence = (_a = this.diagram.representation) === null || _a === void 0 ? void 0 : _a.grapholElements.get(objectPropertyEdge.id());
                        if (grapholOccurrence) {
                            objectPropertyEntity.removeOccurrence(grapholOccurrence, RendererStatesEnum.INCREMENTAL);
                        }
                    }
                });
                if (element.data().type === TypesEnum.CLASS) {
                    element.neighborhood().forEach(neighbourElement => {
                        if (neighbourElement.isNode()) {
                            // remove nodes only if they have 1 connection, i.e. with the class we want to remove
                            if (neighbourElement.degree(false) === 1 && !entitiesIrisToKeep.includes(neighbourElement.data().iri)) {
                                if (neighbourElement.data().iri) {
                                    // it's an entity, recursively remove entities
                                    entitiesIrisToKeep.push((entity === null || entity === void 0 ? void 0 : entity.iri.fullIri) || ''); // the entity we are removing must be skipped, otherwise cyclic recursion
                                    this.removeEntity(neighbourElement.data().iri, entitiesIrisToKeep);
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
                            // map in diagram representation and entity occurrences)
                            this.diagram.removeElement(neighbourElement.id());
                        }
                    });
                    this.grapholscape.ontology.getSuperHierarchiesOf(entity.iri.fullIri).forEach(hierarchy => {
                        this.removeHierarchy(hierarchy, [entity.iri.fullIri]);
                    });
                    this.grapholscape.ontology.getSubHierarchiesOf(entity.iri.fullIri).forEach(hierarchy => {
                        this.removeHierarchy(hierarchy, [entity.iri.fullIri]);
                    });
                }
                if (entity && this.diagram.representation) {
                    const grapholOccurrence = (_a = this.diagram.representation) === null || _a === void 0 ? void 0 : _a.grapholElements.get(element.id());
                    if (grapholOccurrence) {
                        entity.removeOccurrence(grapholOccurrence, RendererStatesEnum.INCREMENTAL);
                    }
                    this.diagram.removeElement(element.id());
                    // if (entity.is(TypesEnum.CLASS_INSTANCE))
                    //   this.classInstanceEntities.delete(entity.iri.fullIri)
                    // this.classFilterMap.delete(entity.fullIri)
                }
            });
        });
    }
    postDiagramEdit(oldElemsNumber, customLayoutOptions) {
        var _a, _b, _c;
        if (this.numberOfElements !== oldElemsNumber) {
            if (this.actionsWithBlockedGraph === 0) {
                customLayoutOptions
                    ? (_a = this.incrementalRenderer) === null || _a === void 0 ? void 0 : _a.runCustomLayout(customLayoutOptions)
                    : (_b = this.incrementalRenderer) === null || _b === void 0 ? void 0 : _b.runLayout();
            }
            this.lifecycle.trigger(IncrementalEvent.DiagramUpdated);
        }
        else {
            (_c = this.incrementalRenderer) === null || _c === void 0 ? void 0 : _c.unFreezeGraph();
        }
    }
    isHierarchyNodeInDiagram(hierarchy) {
        var _a;
        return (_a = this.grapholscape.renderer.cy) === null || _a === void 0 ? void 0 : _a.$(`[hierarchyID = "${hierarchy.id}"]`).nonempty();
    }
    getIDByIRI(iri, type) {
        var _a;
        const entity = this.grapholscape.ontology.getEntity(iri);
        if (entity) {
            return (_a = entity.getOccurrenceByType(type, RendererStatesEnum.INCREMENTAL)) === null || _a === void 0 ? void 0 : _a.id;
        }
    }
    get incrementalRenderer() {
        if (this.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
            return this.grapholscape.renderer.renderState;
        }
    }
    get numberOfElements() { var _a; return ((_a = this.grapholscape.renderer.cy) === null || _a === void 0 ? void 0 : _a.elements().size()) || 0; }
}

class NeighbourhoodFinder {
    constructor(ontology) {
        this.ontology = ontology;
    }
    getDataProperties(classIriString) {
        const res = [];
        const classIri = this.getIriObject(classIriString);
        const dataPropertySelector = `[type = "${TypesEnum.DATA_PROPERTY}"]`;
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
        const objectPropertyEdgeSelector = `[type = "${TypesEnum.OBJECT_PROPERTY}"]`;
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
                                    if (!resEntry.list.includes(connectedClassEntity)) // add only new classes
                                        resEntry.list.push(connectedClassEntity);
                                }
                                else {
                                    res.set(objectPropertyEntity, { list: [connectedClassEntity], direct: direct, available: true });
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
    getConnectedClassesIrisByType(classIri, type, inclusionType = 'subclass') {
        var _a;
        const res = [];
        let resultingNodes;
        let diagram;
        (_a = this.ontology.getEntityOccurrences(classIri, undefined, RendererStatesEnum.FLOATY)) === null || _a === void 0 ? void 0 : _a.forEach(classOccurrences => {
            classOccurrences.forEach(classOccurrence => {
                var _a;
                diagram = this.ontology.getDiagram(classOccurrence.diagramId);
                if (diagram) {
                    const inclusionEdges = (_a = diagram.representations.get(RendererStatesEnum.FLOATY)) === null || _a === void 0 ? void 0 : _a.cy.$id(classOccurrence.id).edgesWith(`[ type = "${TypesEnum.CLASS}" ]`).filter(edge => edge.data().type === type); // take only inclusions/equivalence edges
                    if (!inclusionEdges)
                        return;
                    if (type === TypesEnum.EQUIVALENCE) {
                        resultingNodes = inclusionEdges.connectedNodes(`[ iri != "${classIri}" ]`);
                    }
                    else if (inclusionType === 'subclass') {
                        resultingNodes = inclusionEdges.sources(`[ iri != "${classIri}" ]`); // of these inclusions, take sources different from the class we are considering as superclass
                    }
                    else {
                        resultingNodes = inclusionEdges.targets(`[ iri != "${classIri}" ]`); // of these inclusions, take targets different from the class we are considering as superclass
                    }
                    resultingNodes.forEach(node => {
                        if (!res.includes(node.data().iri)) {
                            res.push(node.data().iri);
                        }
                    });
                }
            });
        });
        return res;
    }
    getSubclassesIris(classIri) {
        return this.getConnectedClassesIrisByType(classIri, TypesEnum.INCLUSION, 'subclass');
    }
    getEquivalentClassesIris(classIri) {
        return this.getConnectedClassesIrisByType(classIri, TypesEnum.EQUIVALENCE);
    }
    getSuperclassesIris(classIri) {
        return this.getConnectedClassesIrisByType(classIri, TypesEnum.INCLUSION, 'superclass');
    }
    getIriObject(iri) {
        return new Iri(iri, this.ontology.namespaces);
    }
}

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
function showHideEquivalentClasses(hide, callback) {
    return {
        content: `${hide ? `Hide` : `Show`} Equivalent Classes`,
        icon: equivalentClasses,
        select: callback
    };
}
function remove(elems, callback) {
    return {
        content: `Remove${elems.size() > 1 ? ` ${elems.size()} elements` : ''}`,
        icon: rubbishBin,
        select: callback,
    };
}
function showParentClass(callback) {
    return {
        content: 'Show Current Parent Classes',
        icon: classIcon,
        select: callback,
    };
}
function performInstanceChecking(callback) {
    return {
        content: 'Compute and Show Parent Classes',
        icon: classIcon,
        select: callback,
    };
}
function focusInstance(callback) {
    return {
        content: 'Show Relationships',
        icon: objectPropertyIcon,
        select: callback,
    };
}
function getInstances(callback) {
    return {
        content: 'Show Some Instances',
        icon: individualIcon,
        select: callback,
    };
}

function CommandsWidgetFactory(ic) {
    const commandsWidget = new GscapeContextMenu();
    ic.grapholscape.on(LifecycleEvent.ContextClick, event => {
        var _a;
        if (event.target === ic.grapholscape.renderer.cy ||
            !event.target.data().iri ||
            ic.grapholscape.renderState !== RendererStatesEnum.INCREMENTAL)
            return;
        const entity = ic.grapholscape.ontology.getEntity(event.target.data().iri);
        const grapholElement = (_a = ic.diagram.representation) === null || _a === void 0 ? void 0 : _a.grapholElements.get(event.target.id());
        if (!entity || !grapholElement)
            return;
        const commands = ic.getContextMenuCommands(grapholElement, event.target);
        try {
            if (event.target.isEdge() && ic.grapholscape.uiContainer) {
                commandsWidget.attachToPosition(event.renderedPosition, ic.grapholscape.uiContainer, commands);
            }
            else {
                const htmlNodeReference = event.target.popperRef();
                if (htmlNodeReference && commands.length > 0) {
                    commandsWidget.attachTo(htmlNodeReference, commands);
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    });
}

var style = i$1 `
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

class IncrementalEntityDetails extends BaseMixin(s) {
    constructor() {
        super(...arguments);
        this._dataProperties = [];
        this.onComputeCount = (entity) => { };
    }
    render() {
        return x `
    <div id="main-wrapper">
      ${this.dataProperties && this.dataProperties.length > 0
            ? x `
          <div class="section">
            <div class="section-header bold-text">Data Properties</div>
            <div class="section-body" style="padding-left: 0px; padding-right: 0px">
              ${this.dataProperties.map(dataProperty => {
                return x `
                  <gscape-entity-list-item
                    displayedname=${dataProperty.displayedName}
                    iri=${dataProperty.value.iri.fullIri}
                    .types=${dataProperty.value.types}
                  >
                  </gscape-entity-list-item>
                `;
            })}
            </div>
          </div>
        `
            : null}
    </div>
    `;
    }
    // private handleEntityClick(e: Event) {
    //   const target = e.currentTarget as HTMLElement
    //   const iri = target.getAttribute('iri')
    //   if (!iri) return
    //   this.onParentClassSelection(iri)
    // }
    show() {
        var _a, _b;
        super.show();
        (_b = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll(`details`)) === null || _b === void 0 ? void 0 : _b.forEach(detailsElement => detailsElement.open = false);
    }
    reset() {
        this.dataProperties = [];
    }
    addDataPropertyValue(dataPropertyIri, value) {
        this.requestUpdate();
    }
    get dataProperties() {
        return this._dataProperties;
    }
    set dataProperties(newDataProperties) {
        const oldValue = this._dataProperties;
        this._dataProperties = newDataProperties.sort((a, b) => a.displayedName.localeCompare(b.displayedName));
        this.requestUpdate('dataProperties', oldValue);
    }
}
IncrementalEntityDetails.properties = {
    dataProperties: { type: Object, attribute: false },
    canShowDataPropertiesValues: { type: Boolean, attribute: false },
    parentClasses: { type: Object, attribute: false },
    instancesCount: { type: Object, attribute: false },
    instancesCountLoading: { type: Boolean, attribute: false },
    allowComputeCount: { type: Boolean, attribute: false },
    entity: { type: Object, attribute: false },
};
IncrementalEntityDetails.notAvailableText = 'n/a';
IncrementalEntityDetails.styles = [baseStyle, entityListItemStyle, style, textSpinnerStyle, contentSpinnerStyle,
    i$1 `
      gscape-entity-list-item {
        --custom-wrap: wrap;
      }

      .count-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 8px;
      }
    `
];
customElements.define('gscape-class-instance-details', IncrementalEntityDetails);

function IncrementalEntityDetailsFactory(ic) {
    const incrementalEntityDetails = new IncrementalEntityDetails();
    const entityDetailsWidget = ic.grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS);
    if (entityDetailsWidget) {
        entityDetailsWidget.incrementalSection = incrementalEntityDetails;
    }
    ic.grapholscape.widgets.set(WidgetEnum.INCREMENTAL_ENTITY_DETAILS, incrementalEntityDetails);
    ic.grapholscape.on(LifecycleEvent.EntitySelection, (grapholEntity) => __awaiter(this, void 0, void 0, function* () {
        incrementalEntityDetails.dataProperties = [];
        if (!grapholEntity.is(TypesEnum.CLASS) && !grapholEntity.is(TypesEnum.OBJECT_PROPERTY)) {
            incrementalEntityDetails.hide();
            incrementalEntityDetails.entity = undefined;
            return;
        }
        incrementalEntityDetails.entity = grapholEntity;
        if (grapholEntity.is(TypesEnum.CLASS) && ic.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
            let dataProperties;
            dataProperties = yield ic.getDataPropertiesHighlights([grapholEntity.iri.fullIri], false);
            incrementalEntityDetails.dataProperties = dataProperties.map(dp => grapholEntityToEntityViewData(dp, ic.grapholscape));
        }
        incrementalEntityDetails.show();
    }));
    return incrementalEntityDetails;
}

function moveUpLeft(widget) {
    widget.style.transition = 'all 0.5s';
    widget.style.top = '10px';
    widget.style.left = '10px';
    widget.style.transform = 'unset';
    widget.style.width = '20%';
    widget['sideMenuMode'] = true;
}
function restorePosition(widget) {
    widget.style.removeProperty('top');
    widget.style.removeProperty('left');
    widget.style.removeProperty('transform');
    widget.style.removeProperty('width');
    widget['sideMenuMode'] = false;
    setTimeout(() => {
        widget.style.removeProperty('transition');
    }, 500); // wait transition to end before removing it or no transition at all 
}

// import { GscapeInstanceExplorer } from "./instances-explorer";
// import GscapeNavigationMenu from "./navigation-menu/navigation-menu";
function onHideMenu (menu, ic) {
    // incrementalController.endpointController?.stopRequests('instances')
    var _a, _b;
    if (menu.referenceEntity && menu.referenceEntityType) {
        const entity = ic.grapholscape.ontology.getEntity(menu.referenceEntity.value.iri.fullIri);
        const refNodeId = (_a = entity === null || entity === void 0 ? void 0 : entity.getOccurrenceByType(menu.referenceEntityType, RendererStatesEnum.INCREMENTAL)) === null || _a === void 0 ? void 0 : _a.id;
        if (!refNodeId)
            return;
        const refNode = (_b = ic
            .diagram
            .representation) === null || _b === void 0 ? void 0 : _b.cy.$id(refNodeId);
        if (refNode === null || refNode === void 0 ? void 0 : refNode.scratch('should-unpin')) {
            refNode.removeScratch('should-unpin');
            ic.grapholscape.renderer.renderState.unpinNode(refNode);
        }
    }
}

var menuBaseStyle = i$1 `
:host {
  min-width: 300px;
  max-height: 600px;
  display: block;
}

.gscape-panel {
  min-width: inherit;
  max-width: inherit;
  min-height: inherit;
  max-height: inherit;
  width: inherit;
  height: inherit;
  display: flex;
  gap: 16px;
  flex-direction: column;
  overflow: unset;
  padding-right: 0;
  padding-left: 0;
}

.header {
  width: fit-content;
  margin: 0 auto;
}

gscape-entity-list-item {
  --custom-min-height: 26.5px;
}

.hover-btn {
  display: none;
}

gscape-entity-list-item:hover > .hover-btn {
  display: initial;
}

.entity-list {
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.gscape-panel > * {
  padding: 0 8px;
}

.section {
  overflow: auto;
}

`;

class GscapeNavigationMenu extends ContextualWidgetMixin(BaseMixin(s)) {
    constructor() {
        super();
        /** @internal */
        this._objectProperties = [];
        /** @internal */
        this.canShowObjectPropertiesRanges = true;
        this.render = () => {
            var _a, _b, _c;
            return x `
    <div class="gscape-panel" id="drop-panel">
      
      <div class="header">
        <gscape-entity-list-item
          displayedname=${(_a = this.referenceEntity) === null || _a === void 0 ? void 0 : _a.displayedName}
          iri=${(_b = this.referenceEntity) === null || _b === void 0 ? void 0 : _b.value.iri.fullIri}
          .types=${(_c = this.referenceEntity) === null || _c === void 0 ? void 0 : _c.value.types}
        ></gscape-entity-list-item>
      </div>

      ${this.objectProperties && this.objectProperties.length > 0
                ? x `
          <div class="section">
            <div class="section-body" style="padding-left: 0px; padding-right: 0px">
              ${this.objectProperties.map(objectProperty => {
                    // const values = this.dataPropertiesValues?.get(dataProperty.value.iri.fullIri)
                    const disabled = !this.canShowObjectPropertiesRanges || objectProperty.disabled === true;
                    return x `
                  <gscape-entity-list-item
                    displayedname=${objectProperty.displayedName}
                    iri=${objectProperty.value.iri.fullIri}
                    .types=${objectProperty.value.types}
                    ?asaccordion=${this.canShowObjectPropertiesRanges}
                    ?disabled=${disabled}
                    direct=${objectProperty.direct}
                    title=${disabled ? 'Property not mapped to data' : objectProperty.displayedName}
                  >
                    ${this.canShowObjectPropertiesRanges
                        ? x `
                        <div slot="accordion-body">
                          ${objectProperty.connectedClasses.map(connectedClass => {
                            return x `
                                <gscape-entity-list-item
                                  displayedname=${connectedClass.displayedName}
                                  iri=${connectedClass.value.iri.fullIri}
                                  objpropertyiri=${objectProperty.value.iri.fullIri}
                                  direct=${objectProperty.direct}
                                  .types=${connectedClass.value.types}
                                  ?actionable=${false}
                                >
                                  <div slot="trailing-element" class="hover-btn">
                                    <gscape-button
                                      size="s"
                                      type="subtle"
                                      @click=${this.handleInsertInGraphClick}
                                    >
                                      ${getIconSlot('icon', insertInGraph)}
                                    </gscape-button>
                                  </div>
                                </gscape-entity-list-item>
                            `;
                        })}
                        </div>
                      `
                        : null}

                    <div slot="trailing-element" style="display: flex; align-items: center; gap: 4px">
                      ${!objectProperty.direct
                        ? x `
                          <span class="chip" style="line-height: 1">Inverse</span>
                        `
                        : null}

                      ${!this.canShowObjectPropertiesRanges
                        ? x `
                          <span>
                            <gscape-button
                              @click=${(e) => this.handleSearchInstancesRange(e, objectProperty)}
                              size=${SizeEnum.S}
                              title='Search instances in relationship'
                            >
                              ${getIconSlot('icon', search$1)}
                            </gscape-button>
                          </span>
                          <span>
                            <gscape-button
                              @click=${(e) => this.handleObjPropertySelection(e, objectProperty)}
                              size=${SizeEnum.S}
                              title='Directly add first 50 instances'
                            >
                              ${getIconSlot('icon', arrow_right)}
                            </gscape-button>
                          </span>
                        `
                        : null}
                    </div>
                  </gscape-entity-list-item>
                `;
                })}
            </div>
          </div>
        `
                : x `
          <div class="blank-slate" style="padding-bottom: 8px">
            ${blankSlateDiagrams}
            <div class="header">No Object Properties Available</div>
          </div>
        `} 
    </div>
  `;
        };
        this.cxtWidgetProps.placement = 'right';
    }
    handleObjPropertySelection(e, objectProperty) {
        if (a11yClick(e)) ;
    }
    handleInsertInGraphClick(e) {
        var _a, _b;
        const targetListItem = (_a = e.currentTarget.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
        if (targetListItem) {
            this.dispatchEvent(new CustomEvent('onclassselection', {
                bubbles: true,
                composed: true,
                detail: {
                    referenceClassIri: (_b = this.referenceEntity) === null || _b === void 0 ? void 0 : _b.value.iri.fullIri,
                    rangeClassIri: targetListItem.iri,
                    objectPropertyIri: targetListItem.getAttribute('objpropertyiri'),
                    direct: targetListItem.getAttribute('direct') === 'true',
                }
            }));
        }
    }
    handleSearchInstancesRange(e, objectProperty) {
        e.stopPropagation();
        if (a11yClick(e)) {
            if (this.popperRef)
                this.attachTo(this.popperRef);
            // const targetListItem = (e.currentTarget as any)?.parentElement.parentElement.parentElement as GscapeEntityListItem | null
            // if (objectProperty &&
            //   this.referenceEntity?.value.types.includes(TypesEnum.CLASS_INSTANCE) &&
            //   !objectProperty.disabled) {
            //   this.dispatchEvent(new CustomEvent('searchinstancesranges', {
            //     bubbles: true,
            //     composed: true,
            //     detail: {
            //       referenceClassIri: this.referenceEntity?.value.iri.fullIri,
            //       objectPropertyIri: objectProperty.value.iri.fullIri,
            //       direct: objectProperty.direct
            //     }
            //   }) as ObjectPropertyNavigationEvent)
            // }
        }
    }
    hide() {
        // wait a bit.
        // if you don't wait, the user will see all accordions closing before the menu disappear
        setTimeout(() => {
            var _a;
            (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll(`gscape-entity-list-item[asaccordion]`).forEach((listItemAccordion) => listItemAccordion.closeAccordion());
        }, 500);
        super.hide();
    }
    attachTo(element) {
        this.popperRef = element;
        super.attachTo(element);
    }
    get objectProperties() {
        return this._objectProperties;
    }
    set objectProperties(newObjectProperties) {
        this._objectProperties = newObjectProperties.map(op => {
            op.connectedClasses.sort((a, b) => a.displayedName.localeCompare(b.displayedName));
            return op;
        }).sort((a, b) => a.displayedName.localeCompare(b.displayedName));
        this.requestUpdate();
    }
    updated() {
        if (this.popperRef)
            this.attachTo(this.popperRef);
    }
}
GscapeNavigationMenu.properties = {
    objectProperties: { type: Object },
    objectPropertiesRanges: { type: Object },
    canShowObjectPropertiesRanges: { type: Boolean },
};
GscapeNavigationMenu.styles = [
    baseStyle,
    menuBaseStyle,
    i$1 `
      .connected-class-wrapper, .object-property-wrapper {
        display: flex;
        justify-content: space-between;
      }
    `
];
customElements.define('gscape-navigation-menu', GscapeNavigationMenu);

function NavigationMenuFactory(incrementalController) {
    const navigationMenu = new GscapeNavigationMenu();
    incrementalController.grapholscape.widgets.set(WidgetEnum.NAVIGATION_MENU, navigationMenu);
    navigationMenu.requestUpdate();
    navigationMenu.addEventListener('onclassselection', (e) => {
        if (!e.detail.rangeClassIri)
            return;
        incrementalController.performActionWithBlockedGraph(() => {
            e.detail.direct
                ? incrementalController.addIntensionalObjectProperty(e.detail.objectPropertyIri, e.detail.referenceClassIri, e.detail.rangeClassIri)
                : incrementalController.addIntensionalObjectProperty(e.detail.objectPropertyIri, e.detail.rangeClassIri, e.detail.referenceClassIri);
        });
        navigationMenu.popperRef = undefined;
        navigationMenu.hide();
    });
    // navigationMenu.addEventListener('searchinstancesranges', async (e: ObjectPropertyNavigationEvent) => {
    //   const instancesExplorer = incrementalController.grapholscape.widgets.get(WidgetEnum.INSTANCES_EXPLORER) as GscapeInstanceExplorer
    //   if (instancesExplorer) {
    //     const referenceEntity = incrementalController.classInstanceEntities.get(e.detail.referenceClassIri) // must be an instance to be here
    //     const objectPropertyEntity = incrementalController.grapholscape.ontology.getEntity(e.detail.objectPropertyIri)
    //     if (
    //       referenceEntity &&
    //       objectPropertyEntity &&
    //       !(instancesExplorer.referenceEntity?.value.iri.equals(referenceEntity.iri) &&
    //         instancesExplorer.referencePropertyEntity?.value.iri.equals(objectPropertyEntity.iri))
    //     ) {
    //       navigationMenu.hide()
    //       instancesExplorer.clear()
    //       instancesExplorer.areInstancesLoading = true
    //       instancesExplorer.referenceEntity = navigationMenu.referenceEntity
    //       instancesExplorer.referenceEntityType = navigationMenu.referenceEntityType
    //       instancesExplorer.referencePropertyEntity = grapholEntityToEntityViewData(objectPropertyEntity, incrementalController.grapholscape)
    //       instancesExplorer.isPropertyDirect = e.detail.direct
    //       // const dataProperties = await incrementalController.getDataPropertiesByClassInstance(referenceEntity.iri.fullIri)
    //       // instancesExplorer.searchFilterList = dataProperties
    //       //   .map(dp => grapholEntityToEntityViewData(dp, incrementalController.grapholscape))
    //       //   .sort((a, b) => a.displayedName.localeCompare(b.displayedName))
    //       instancesExplorer.classTypeFilterList = navigationMenu.objectProperties
    //         .find(op => op.entityViewData.value.iri.equals(e.detail.objectPropertyIri))
    //         ?.connectedClasses
    //       // if only one related class for this object property, then retrieve data properties for this related class
    //       // as it will be selected by default
    //       if (instancesExplorer.classTypeFilterList?.length === 1) {
    //         const hasUnfoldings = incrementalController.endpointController?.highlightsManager?.hasUnfoldings.bind(
    //           incrementalController.endpointController.highlightsManager
    //         )
    //         instancesExplorer.propertiesFilterList = (await incrementalController
    //           .getDataPropertiesByClasses([instancesExplorer.classTypeFilterList[0].entityViewData.value.iri.fullIri]))
    //           .map(dp => getEntityViewDataUnfolding(dp, incrementalController.grapholscape, hasUnfoldings))
    //       }
    //       instancesExplorer.requestId = await incrementalController.endpointController?.requestInstancesThroughObjectProperty(
    //         referenceEntity.iri.fullIri,
    //         e.detail.objectPropertyIri,
    //         e.detail.direct,
    //         true,
    //         e.detail.rangeClassIri ? [e.detail.rangeClassIri] : undefined
    //       )
    //       if (instancesExplorer.requestId) {
    //         incrementalController
    //           .endpointController
    //           ?.shouldQueryUseLabels(instancesExplorer.requestId)
    //           ?.then(async shouldAskForLabels => {
    //             if (!shouldAskForLabels) {
    //               instancesExplorer.shouldAskForLabels = shouldAskForLabels
    //               instancesExplorer.areInstancesLoading = true
    //               instancesExplorer.requestId = await incrementalController.endpointController?.requestInstancesThroughObjectProperty(
    //                 referenceEntity.iri.fullIri,
    //                 e.detail.objectPropertyIri,
    //                 e.detail.direct,
    //                 shouldAskForLabels,
    //                 e.detail.rangeClassIri ? [e.detail.rangeClassIri] : undefined
    //               )
    //             }
    //           })
    //       }
    //     }
    //     if (navigationMenu.popperRef) {
    //       showMenu(instancesExplorer, incrementalController)
    //     }
    //   }
    // })
    // navigationMenu.addEventListener('objectpropertyselection', async (e: ObjectPropertyNavigationEvent) => {
    //   const referenceEntity = incrementalController.classInstanceEntities.get(e.detail.referenceClassIri)
    //   if (referenceEntity) {
    //     incrementalController.expandObjectPropertyOnInstance(referenceEntity.iri.fullIri, e.detail.objectPropertyIri, e.detail.direct)
    //   }
    // })
    navigationMenu.tippyWidget.setProps({
        onHide: () => onHideMenu(navigationMenu, incrementalController),
    });
    return navigationMenu;
}

function showMenu(menu, ic) {
    var _a;
    if (menu.referenceEntity && menu.referenceEntityType) {
        const cy = ic.grapholscape.renderer.cy;
        if (cy) {
            const entity = ic.grapholscape.ontology.getEntity(menu.referenceEntity.value.iri.fullIri);
            const nodeId = (_a = entity === null || entity === void 0 ? void 0 : entity.getOccurrenceByType(menu.referenceEntityType, RendererStatesEnum.INCREMENTAL)) === null || _a === void 0 ? void 0 : _a.id;
            if (!nodeId)
                return;
            const node = cy.$id(nodeId);
            if (node) {
                {
                    menu.attachTo(node.popperRef());
                    menu.show();
                }
                if (!node.data().pinned) {
                    node.scratch('should-unpin', true);
                    ic.grapholscape.renderer.renderState.pinNode(node);
                }
            }
        }
    }
}

function showButtons(targetNode, nodeButtons) {
    nodeButtons.forEach((btn, i) => {
        // set position relative to default placemente (right)
        btn.cxtWidgetProps.offset = (info) => getButtonOffset(info, i, nodeButtons.length);
        btn.node = targetNode;
        // save the function to attach the button in the scratch for later usage
        targetNode.scratch(`place-node-button-${i}`, () => btn.attachTo(targetNode.popperRef()));
        targetNode.on('position', targetNode.scratch(`place-node-button-${i}`)); // on position change, call the function in the scratch
        btn.attachTo(targetNode.popperRef());
    });
    targetNode.scratch(`node-button-list`, nodeButtons);
}
function hideButtons(targetNode) {
    const nodeButtons = targetNode.scratch('node-button-list');
    nodeButtons === null || nodeButtons === void 0 ? void 0 : nodeButtons.forEach((btn, i) => {
        btn.hide();
        const updatePosFunction = targetNode.scratch(`place-node-button-${i}`);
        if (updatePosFunction) {
            targetNode.removeListener('position', undefined, updatePosFunction);
            targetNode.removeScratch(`place-node-button-${i}`);
        }
    });
}
function getButtonOffset(info, buttonIndex = 0, numberOfButtons = 1) {
    const btnHeight = info.popper.height + 4;
    const btnWidth = info.popper.width;
    return [
        -(btnHeight / 2) - (buttonIndex * btnHeight) + (btnHeight * (numberOfButtons / 2)),
        -btnWidth / 2 // x
    ];
}

function NodeButtonsFactory(ic) {
    if (ic.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
        setHandlersOnIncrementalCytoscape(ic);
    }
    ic.grapholscape.on(LifecycleEvent.RendererChange, (rendererState) => {
        if (rendererState === RendererStatesEnum.INCREMENTAL) {
            setHandlersOnIncrementalCytoscape(ic);
        }
    });
    ic.on(IncrementalEvent.Reset, () => {
        if (ic.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
            setHandlersOnIncrementalCytoscape(ic);
            ic
                .grapholscape
                .container
                .querySelectorAll('[data-tippy-root]') // take all the tippy widgets (loading badges basically)
                .forEach(tippy => tippy.remove());
        }
    });
}
function setHandlersOnIncrementalCytoscape(ic) {
    var _a;
    const cy = (_a = ic.grapholscape.incremental.diagram.representation) === null || _a === void 0 ? void 0 : _a.cy;
    if (!cy)
        return;
    if (cy.scratch('_gscape-graph-incremental-handlers-set'))
        return;
    // const btns = Array.from(nodeButtons.values()).flat()
    let lastSelectedNode;
    cy.on('tap', 'node', e => {
        var _a;
        const grapholElem = (_a = ic.grapholscape.renderer.grapholElements) === null || _a === void 0 ? void 0 : _a.get(e.target.id());
        if (grapholElem) {
            if (lastSelectedNode) {
                hideButtons(lastSelectedNode);
            }
            showButtons(e.target, ic.getNodeButtons(grapholElem, e.target));
            lastSelectedNode = e.target;
        }
    });
    cy.on('tap', e => {
        if (e.target === cy && lastSelectedNode) {
            hideButtons(lastSelectedNode);
            lastSelectedNode = undefined;
        }
    });
    cy.on('pan', e => {
        if (lastSelectedNode) {
            hideButtons(lastSelectedNode);
            lastSelectedNode = undefined;
        }
    });
    cy.scratch('_gscape-graph-incremental-handlers-set', true);
}

function onIncrementalStartup(ic) {
    const grapholscape = ic.grapholscape;
    grapholscape.renderer.unselect();
    manageWidgetsOnActivation(grapholscape.widgets, !grapholscape.renderer.cy || grapholscape.renderer.cy.elements().empty());
    const entityColorLegend = grapholscape.widgets.get(WidgetEnum.ENTITY_COLOR_LEGEND);
    entityColorLegend.onElementSelection = (elem) => {
        const filteredEntity = grapholscape.ontology.getEntity(elem.iri);
        const filter = ic.classFilterMap.get(elem.iri) ||
            new Filter(elem.id, (grapholElement) => {
                const _iri = grapholElement.iri;
                if (_iri) {
                    const entityToCheck = grapholscape.ontology.getEntity(_iri);
                    if (entityToCheck && filteredEntity) {
                        return filteredEntity === null || filteredEntity === void 0 ? void 0 : filteredEntity.iri.equals(entityToCheck.iri);
                    }
                }
                return false;
            });
        ic.classFilterMap.set(elem.iri, filter);
        if (filter.active) {
            grapholscape.unfilter(filter);
        }
        else {
            grapholscape.filter(filter);
        }
        elem.filtered = filter.active;
        entityColorLegend.requestUpdate();
    };
    // if (grapholscape.renderer.diagram)
    //   setGraphEventHandlers(grapholscape.renderer.diagram, grapholscape.lifecycle, grapholscape.ontology)
    // incrementalController.setIncrementalEventHandlers()
}
function manageWidgetsOnActivation(widgets, isCanvasEmpty = false) {
    const filtersWidget = widgets.get(WidgetEnum.FILTERS);
    const diagramSelector = widgets.get(WidgetEnum.DIAGRAM_SELECTOR);
    const initialMenu = widgets.get(WidgetEnum.INCREMENTAL_INITIAL_MENU);
    const classInstanceDetails = widgets.get(WidgetEnum.INCREMENTAL_ENTITY_DETAILS);
    const entityDetails = widgets.get(WidgetEnum.ENTITY_DETAILS);
    const entityColorLegend = widgets.get(WidgetEnum.ENTITY_COLOR_LEGEND);
    entityColorLegend.enable();
    entityDetails.showOccurrences = false;
    classInstanceDetails === null || classInstanceDetails === void 0 ? void 0 : classInstanceDetails.enable();
    diagramSelector === null || diagramSelector === void 0 ? void 0 : diagramSelector.hide();
    initialMenu === null || initialMenu === void 0 ? void 0 : initialMenu.show();
    if (isCanvasEmpty && initialMenu) {
        restorePosition(initialMenu);
        initialMenu.focusInputSearch();
    }
    filtersWidget === null || filtersWidget === void 0 ? void 0 : filtersWidget.hide();
}
function manageWidgetsOnDeactivation(widgets) {
    const filtersWidget = widgets.get(WidgetEnum.FILTERS);
    const diagramSelector = widgets.get(WidgetEnum.DIAGRAM_SELECTOR);
    const initialMenu = widgets.get(WidgetEnum.INCREMENTAL_INITIAL_MENU);
    const classInstanceDetails = widgets.get(WidgetEnum.INCREMENTAL_ENTITY_DETAILS);
    const vkgPreferences = widgets.get(WidgetEnum.VKG_PREFERENCES);
    const entityDetails = widgets.get(WidgetEnum.ENTITY_DETAILS);
    entityDetails.showOccurrences = true;
    classInstanceDetails === null || classInstanceDetails === void 0 ? void 0 : classInstanceDetails.disable();
    vkgPreferences === null || vkgPreferences === void 0 ? void 0 : vkgPreferences.disable();
    diagramSelector === null || diagramSelector === void 0 ? void 0 : diagramSelector.show();
    initialMenu === null || initialMenu === void 0 ? void 0 : initialMenu.hide();
    filtersWidget === null || filtersWidget === void 0 ? void 0 : filtersWidget.show();
}
function onEmptyDiagram(grapholscape) {
    var _a;
    const initialMenu = grapholscape.widgets.get(WidgetEnum.INCREMENTAL_INITIAL_MENU);
    (_a = grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS)) === null || _a === void 0 ? void 0 : _a.hide();
    if (initialMenu) {
        restorePosition(initialMenu);
        initialMenu.focusInputSearch();
    }
    const entityColorLegend = grapholscape.widgets.get(WidgetEnum.ENTITY_COLOR_LEGEND);
    if (entityColorLegend) {
        entityColorLegend.elements = [];
    }
}

// export * from './vkg-preferences'
function initIncrementalUI(ic) {
    var _a;
    IncrementalEntityDetailsFactory(ic);
    NavigationMenuFactory(ic);
    // InstanceExplorerFactory(ic)
    CommandsWidgetFactory(ic);
    NodeButtonsFactory(ic);
    let initialMenu = ic
        .grapholscape
        .widgets
        .get(WidgetEnum.INCREMENTAL_INITIAL_MENU);
    if (!initialMenu) {
        // initEntitySelector(incrementalController.grapholscape)
        initialMenu = new IncrementalInitialMenu(ic.grapholscape);
        ic.grapholscape.widgets.set(WidgetEnum.INCREMENTAL_INITIAL_MENU, initialMenu);
    }
    initialMenu.addEventListener('class-selection', (e) => {
        ic.addClass(e.detail, true);
        moveUpLeft(initialMenu);
        initialMenu.closePanel();
    });
    (_a = ic.grapholscape.uiContainer) === null || _a === void 0 ? void 0 : _a.appendChild(initialMenu);
    if (ic.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
        onIncrementalStartup(ic);
    }
    else {
        manageWidgetsOnDeactivation(ic.grapholscape.widgets);
    }
    // CORE's lifecycle reactions 
    ic.grapholscape.on(LifecycleEvent.RendererChange, (rendererState) => {
        if (rendererState === RendererStatesEnum.INCREMENTAL) {
            onIncrementalStartup(ic);
        }
        else {
            manageWidgetsOnDeactivation(ic.grapholscape.widgets);
        }
    });
    ic.on(IncrementalEvent.DiagramUpdated, () => {
        var _a;
        const initialMenu = ic.grapholscape.widgets.get(WidgetEnum.INCREMENTAL_INITIAL_MENU);
        if ((_a = ic.grapholscape.renderer.cy) === null || _a === void 0 ? void 0 : _a.elements().empty()) {
            onEmptyDiagram(ic.grapholscape);
        }
        else {
            if (initialMenu) {
                moveUpLeft(initialMenu);
            }
            const entityColorLegend = ic.grapholscape.widgets.get(WidgetEnum.ENTITY_COLOR_LEGEND);
            if (entityColorLegend) {
                setColorList(entityColorLegend, ic.grapholscape);
                entityColorLegend.enable();
            }
        }
        const ontologyExplorer = ic.grapholscape.widgets.get(WidgetEnum.ONTOLOGY_EXPLORER);
        if (ontologyExplorer) {
            ontologyExplorer.entities = createEntitiesList(ic.grapholscape, ontologyExplorer.searchEntityComponent)
                .filter(e => e.viewOccurrences && e.viewOccurrences.size > 0);
        }
    });
    ic.on(IncrementalEvent.Reset, () => {
        if (ic.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
            manageWidgetsOnActivation(ic.grapholscape.widgets, true);
            onEmptyDiagram(ic.grapholscape);
        }
    });
}

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CommandsWidgetFactory: CommandsWidgetFactory,
    IncrementalEntityDetailsFactory: IncrementalEntityDetailsFactory,
    NavigationMenuFactory: NavigationMenuFactory,
    NodeButtonsFactory: NodeButtonsFactory,
    focusInstance: focusInstance,
    getButtonOffset: getButtonOffset,
    getInstances: getInstances,
    hideButtons: hideButtons,
    initIncrementalUI: initIncrementalUI,
    manageWidgetsOnActivation: manageWidgetsOnActivation,
    manageWidgetsOnDeactivation: manageWidgetsOnDeactivation,
    moveUpLeft: moveUpLeft,
    onEmptyDiagram: onEmptyDiagram,
    onIncrementalStartup: onIncrementalStartup,
    performInstanceChecking: performInstanceChecking,
    remove: remove,
    restorePosition: restorePosition,
    showButtons: showButtons,
    showHideEquivalentClasses: showHideEquivalentClasses,
    showHideSubClasses: showHideSubClasses,
    showHideSubHierarchies: showHideSubHierarchies,
    showHideSuperClasses: showHideSuperClasses,
    showHideSuperHierarchies: showHideSuperHierarchies,
    showMenu: showMenu,
    showParentClass: showParentClass
});

function objectPropertyButtonHandler(e, incrementalController) {
    return __awaiter(this, void 0, void 0, function* () {
        const targetButton = e.currentTarget;
        const navigationMenu = incrementalController.grapholscape.widgets.get(WidgetEnum.NAVIGATION_MENU);
        if (!navigationMenu)
            return;
        if (targetButton.node && targetButton.node.data().iri) {
            let referenceEnity;
            let objectProperties = new Map();
            if (targetButton.node.data().type === TypesEnum.CLASS) {
                referenceEnity = incrementalController.grapholscape.ontology.getEntity(targetButton.node.data().iri);
                if (!referenceEnity)
                    return;
                navigationMenu.referenceEntity = grapholEntityToEntityViewData(referenceEnity, incrementalController.grapholscape);
                navigationMenu.referenceEntityType = targetButton.node.data().type;
                navigationMenu.canShowObjectPropertiesRanges = true;
                objectProperties = yield incrementalController.getObjectPropertiesHighlights([targetButton.node.data().iri], targetButton.node.data('type') === TypesEnum.INDIVIDUAL);
            }
            navigationMenu.objectProperties = Array.from(objectProperties).map(v => {
                const newV = grapholEntityToEntityViewData(v[0], incrementalController.grapholscape);
                // const viewIncrementalObjProp = newV as ViewObjectProperty
                newV.connectedClasses = v[1].list.map(classEntity => {
                    return grapholEntityToEntityViewData(classEntity, incrementalController.grapholscape);
                });
                newV.direct = v[1].direct;
                return newV;
            });
            // TODO: check why sometimes here targetButton.node is undefined, happens only few times
            // it should be defined due to previous initial if
            if (targetButton.node) {
                showMenu(navigationMenu, incrementalController);
            }
        }
    });
}

class IncrementalController extends IncrementalBase {
    constructor(grapholscape) {
        super(grapholscape);
        this.neighbourhoodFinder = new NeighbourhoodFinder(grapholscape.ontology);
        this.individualsButton = new NodeButton(individualIcon);
        this.objectPropertyButton = new NodeButton(objectPropertyIcon);
    }
    getHighlights(iris, isInstance) {
        throw new Error("Method not implemented.");
    }
    getDataPropertiesHighlights(iris, _isInstance) {
        return new Promise((resolve) => {
            resolve(this.neighbourhoodFinder.getDataProperties(iris[0]));
        });
    }
    getObjectPropertiesHighlights(iris, isInstance) {
        return new Promise((resolve) => {
            resolve(this.neighbourhoodFinder.getObjectProperties(iris[0]));
        });
    }
    getAnnotations(iri) {
        return new Promise((resolve, reject) => {
            const grapholEntity = this.grapholscape.ontology.getEntity(iri);
            if (grapholEntity) {
                resolve(grapholEntity.getAnnotations());
            }
            else {
                reject('Entity not found');
            }
        });
    }
    getSuperClasses(classIri) {
        return new Promise((resolve) => {
            const resultIris = this.neighbourhoodFinder.getSuperclassesIris(classIri);
            const result = [];
            let classEntity;
            for (let superclassIri of resultIris) {
                classEntity = this.grapholscape.ontology.getEntity(superclassIri);
                if (classEntity)
                    result.push(classEntity);
            }
            resolve(result);
        });
    }
    getSubClasses(classIri) {
        return new Promise((resolve) => {
            const resultIris = this.neighbourhoodFinder.getSubclassesIris(classIri);
            const result = [];
            let classEntity;
            for (let superclassIri of resultIris) {
                classEntity = this.grapholscape.ontology.getEntity(superclassIri);
                if (classEntity)
                    result.push(classEntity);
            }
            resolve(result);
        });
    }
    getContextMenuCommands(grapholElement, cyElement) {
        var _a;
        const commands = [];
        if (grapholElement.is(TypesEnum.CLASS) && grapholElement.iri) {
            const superHierarchies = this.grapholscape.ontology.getSuperHierarchiesOf(grapholElement.iri);
            if (superHierarchies && superHierarchies.length > 0) {
                const areAllSuperHierarchiesVisible = superHierarchies.every(hierarchy => this.diagram.isHierarchyVisible(hierarchy));
                commands.push(showHideSuperHierarchies(areAllSuperHierarchiesVisible, () => {
                    if (areAllSuperHierarchiesVisible) {
                        superHierarchies === null || superHierarchies === void 0 ? void 0 : superHierarchies.forEach(hierarchy => this.removeHierarchy(hierarchy, [grapholElement.iri]));
                    }
                    else {
                        this.performActionWithBlockedGraph(() => {
                            superHierarchies === null || superHierarchies === void 0 ? void 0 : superHierarchies.forEach(hierarchy => {
                                this.diagramBuilder.addHierarchy(hierarchy, cyElement.position());
                            });
                        });
                    }
                }));
            }
            const subHierarchies = this.grapholscape.ontology.getSubHierarchiesOf(grapholElement.iri);
            if (subHierarchies && subHierarchies.length > 0) {
                const areAllSubHierarchiesVisible = subHierarchies.every(hierarchy => this.diagram.isHierarchyVisible(hierarchy));
                commands.push(showHideSubHierarchies(areAllSubHierarchiesVisible, () => {
                    areAllSubHierarchiesVisible
                        ? subHierarchies === null || subHierarchies === void 0 ? void 0 : subHierarchies.forEach(hierarchy => this.removeHierarchy(hierarchy, [grapholElement.iri]))
                        : this.performActionWithBlockedGraph(() => {
                            subHierarchies === null || subHierarchies === void 0 ? void 0 : subHierarchies.forEach(hierarchy => {
                                this.diagramBuilder.addHierarchy(hierarchy, cyElement.position());
                            });
                        });
                }));
            }
            const subClasses = this.neighbourhoodFinder.getSubclassesIris(grapholElement.id);
            if (subClasses.length > 0) {
                const areAllSubclassesVisible = subClasses.every(subclass => this.diagram.containsEntity(subclass));
                commands.push(showHideSubClasses(areAllSubclassesVisible, () => {
                    if (areAllSubclassesVisible) {
                        subClasses.forEach(sc => {
                            const scEntity = this.grapholscape.ontology.getEntity(sc);
                            if (scEntity)
                                this.removeEntity(scEntity, [grapholElement.iri]);
                        });
                    }
                    else {
                        this.showClassesInIsa(grapholElement.iri, subClasses, TypesEnum.INCLUSION, 'sub');
                    }
                }));
            }
            const superClasses = this.neighbourhoodFinder.getSuperclassesIris(grapholElement.id);
            if (superClasses.length > 0) {
                const areAllSuperclassesVisible = superClasses.every(superClasses => this.diagram.containsEntity(superClasses));
                commands.push(showHideSuperClasses(areAllSuperclassesVisible, () => {
                    areAllSuperclassesVisible
                        ? superClasses.forEach(sc => {
                            const scEntity = this.grapholscape.ontology.getEntity(sc);
                            if (scEntity)
                                this.removeEntity(scEntity, [grapholElement.iri]);
                        })
                        : this.showClassesInIsa(grapholElement.iri, superClasses, TypesEnum.INCLUSION, 'super');
                }));
            }
            const equivalentClasses = this.neighbourhoodFinder.getEquivalentClassesIris(grapholElement.id);
            if (equivalentClasses.length > 0) {
                const areAllEquivalentClassesVisible = equivalentClasses.every(ec => this.diagram.containsEntity(ec));
                commands.push(showHideEquivalentClasses(areAllEquivalentClassesVisible, () => {
                    if (areAllEquivalentClassesVisible) {
                        equivalentClasses.forEach(sc => {
                            const scEntity = this.grapholscape.ontology.getEntity(sc);
                            if (scEntity)
                                this.removeEntity(scEntity, [grapholElement.iri]);
                        });
                    }
                    else {
                        this.showClassesInIsa(grapholElement.iri, equivalentClasses, TypesEnum.EQUIVALENCE);
                    }
                }));
            }
        }
        const selectedElems = (_a = this.diagram.representation) === null || _a === void 0 ? void 0 : _a.cy.$(':selected[?iri]');
        let elemsToBeRemoved = cyElement;
        if (selectedElems && selectedElems.size() > 1) {
            elemsToBeRemoved = selectedElems;
        }
        commands.push(remove(elemsToBeRemoved, () => {
            elemsToBeRemoved.forEach(cyElem => {
                var _a;
                if (cyElem.data().iri) {
                    const entity = this.grapholscape.ontology.getEntity(cyElem.data().iri);
                    if (entity) {
                        if (cyElem.data().type === TypesEnum.OBJECT_PROPERTY) {
                            const grapholOccurrence = (_a = this.diagram.representation) === null || _a === void 0 ? void 0 : _a.grapholElements.get(cyElem.id());
                            if (grapholOccurrence) {
                                entity.removeOccurrence(grapholOccurrence, RendererStatesEnum.INCREMENTAL);
                            }
                            this.diagram.removeElement(cyElem.id());
                            this.lifecycle.trigger(IncrementalEvent.DiagramUpdated);
                        }
                        else {
                            this.removeEntity(entity);
                        }
                    }
                }
            });
        }));
        return commands;
    }
    init() {
        this.setIncrementalEventHandlers();
        initIncrementalUI(this);
        this.initNodeButtons();
    }
    initNodeButtons() {
        // this.individualsButton.title = 'Search Individuals'
        // this.individualsButton.onclick = e => individualButtonHandler(e, this)
        this.objectPropertyButton.title = 'Navigate through object properties';
        this.objectPropertyButton.onclick = e => objectPropertyButtonHandler(e, this);
    }
    getNodeButtons(grapholElement) {
        if (grapholElement.is(TypesEnum.CLASS)) {
            return [this.objectPropertyButton];
        }
        return [];
    }
    setIncrementalEventHandlers() {
        var _a, _b, _c;
        if ((_a = this.diagram.representation) === null || _a === void 0 ? void 0 : _a.cy.scratch('_gscape-incremental-graph-handlers-set'))
            return;
        // const classOrInstanceSelector = `node[type = "${TypesEnum.CLASS}"], node[type = "${TypesEnum.CLASS_INSTANCE}"]`
        (_b = this.diagram.representation) === null || _b === void 0 ? void 0 : _b.cy.on('tap', evt => {
            const targetType = evt.target.data().type;
            if (targetType === TypesEnum.CLASS || targetType === TypesEnum.INDIVIDUAL) {
                const targetIri = evt.target.data().iri;
                const entity = this.grapholscape.ontology.getEntity(targetIri);
                if (entity)
                    this.lifecycle.trigger(IncrementalEvent.ClassSelection, entity);
            }
        });
        (_c = this.diagram.representation) === null || _c === void 0 ? void 0 : _c.cy.scratch('_gscape-incremental-graph-handlers-set', true);
    }
    reset() {
        var _a;
        let clearedEntities = [];
        (_a = this.diagram.representation) === null || _a === void 0 ? void 0 : _a.grapholElements.forEach(elem => {
            if (elem.iri && !clearedEntities.includes(elem.iri)) {
                const entity = this.grapholscape.ontology.getEntity(elem.iri);
                if (entity) {
                    entity.occurrences.set(RendererStatesEnum.INCREMENTAL, []);
                }
                clearedEntities.push(elem.iri);
            }
        });
        clearedEntities = [];
        this.diagram.clear();
        this.lifecycle.trigger(IncrementalEvent.Reset);
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
            Object.values(FunctionPropertiesEnum).forEach(functionalityKind => {
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
        result.push(new Annotation(DefaultAnnotationProperties.label, label));
        // for searching predicates' description in graphol v2
        const xmlPredicates = xmlDocument.getElementsByTagName('predicate');
        for (let predicateXml of xmlPredicates) {
            if (labelNoBreak === predicateXml.getAttribute('name') && element.getAttribute('type') === predicateXml.getAttribute('type')) {
                let description = (_b = (_a = predicateXml.getElementsByTagName('description')[0]) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.replace(/font-size:0pt/g, '');
                if (description) {
                    let bodyStartIndex = description.indexOf('<p');
                    let bodyEndIndex = description.indexOf('</body');
                    description = description.slice(bodyStartIndex, bodyEndIndex);
                    result.push(new Annotation(DefaultAnnotationProperties.comment, description));
                }
                break;
            }
        }
    }
    return result;
}

var Graphol2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getEntityAnnotations: getEntityAnnotations$1,
    getFacetDisplayedName: getFacetDisplayedName$1,
    getFunctionalities: getFunctionalities$1,
    getIri: getIri$1,
    getNamespaces: getNamespaces$1,
    getOntologyInfo: getOntologyInfo$1,
    warnings: warnings$1
});

let warnings = new Set();
function getOntologyInfo(xmlDocument) {
    var _a, _b, _c;
    let project = getTag(xmlDocument, 'project');
    let ontology_languages = (_a = getTag(xmlDocument, 'languages')) === null || _a === void 0 ? void 0 : _a.children;
    let iri = (_b = getTag(xmlDocument, 'ontology')) === null || _b === void 0 ? void 0 : _b.getAttribute('iri');
    const ontology = new Ontology((project === null || project === void 0 ? void 0 : project.getAttribute('name')) || '', (project === null || project === void 0 ? void 0 : project.getAttribute('version')) || '');
    if (ontology_languages)
        ontology.languages = [...ontology_languages].map(lang => lang.textContent).filter(l => l !== null) || [];
    ontology.defaultLanguage = ((_c = getTag(xmlDocument, 'ontology')) === null || _c === void 0 ? void 0 : _c.getAttribute('lang')) || ontology.languages[0];
    if (iri) {
        ontology.iri = iri;
        ontology.annotations = getIriAnnotations(iri, xmlDocument, getNamespaces(xmlDocument));
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
    if (element.getAttribute('type') === TypesEnum.FACET) {
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
    let current_iri_elem = getIriElem(element, xmlDocument);
    let elementType;
    switch (element.getAttribute('type')) {
        case 'concept':
            elementType = TypesEnum.CLASS;
            break;
        case 'role':
            elementType = TypesEnum.OBJECT_PROPERTY;
            break;
        case 'attribute':
            elementType = TypesEnum.DATA_PROPERTY;
            break;
    }
    if (elementType === TypesEnum.OBJECT_PROPERTY || elementType === TypesEnum.DATA_PROPERTY) {
        if (current_iri_elem && current_iri_elem.children) {
            for (let property of current_iri_elem.children) {
                const functionality = Object.values(FunctionPropertiesEnum).find(f => f.toString() === property.tagName);
                if (functionality) {
                    result.push(functionality);
                }
            }
        }
    }
    return result;
}
function getEntityAnnotations(element, xmlDocument, namespaces) {
    const entityIri = getTagText(element, 'iri');
    if (entityIri)
        return getIriAnnotations(entityIri, xmlDocument, namespaces);
    else
        return [];
}
function getIriAnnotations(iri, xmlDocument, namespaces) {
    let result = [];
    const iriElem = getIriElem(iri, xmlDocument);
    if (iriElem) {
        let annotations = getTag(iriElem, 'annotations');
        let language;
        let property;
        let lexicalForm;
        let iri;
        if (annotations) {
            for (let annotation of annotations.children) {
                property = getTagText(annotation, 'property');
                language = getTagText(annotation, 'language') || undefined;
                lexicalForm = getTagText(annotation, 'lexicalForm') || undefined;
                iri = getTagText(annotation, 'iri') || undefined;
                if (property && (lexicalForm || iri))
                    if (lexicalForm)
                        result.push(new Annotation(new Iri(property, namespaces), lexicalForm, language));
                    else if (iri)
                        result.push(new Annotation(new Iri(property, namespaces), new Iri(iri, namespaces), language));
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

var Graphol3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getEntityAnnotations: getEntityAnnotations,
    getFacetDisplayedName: getFacetDisplayedName,
    getFunctionalities: getFunctionalities,
    getIri: getIri,
    getNamespaces: getNamespaces,
    getOntologyInfo: getOntologyInfo,
    getTag: getTag,
    getTagText: getTagText,
    warnings: warnings
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
        var _a, _b, _c, _d;
        this.ontology = this.graphol.getOntologyInfo(this.xmlDocument);
        this.ontology.namespaces = this.graphol.getNamespaces(this.xmlDocument);
        let i, k, nodes, edges;
        let diagrams = this.xmlDocument.getElementsByTagName('diagram');
        for (i = 0; i < diagrams.length; i++) {
            const diagram = new Diagram(diagrams[i].getAttribute('name') || '', this.ontology.diagrams.length);
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
                        node.iri = iri.fullIri;
                        if (!grapholEntity) {
                            grapholEntity = new GrapholEntity(iri);
                            this.ontology.addEntity(grapholEntity);
                        }
                        grapholEntity.addOccurrence(node);
                        if (node.is(TypesEnum.DATA_PROPERTY) || node.is(TypesEnum.OBJECT_PROPERTY)) {
                            const functionalities = this.graphol.getFunctionalities(nodeXmlElement, this.xmlDocument);
                            if (node.is(TypesEnum.DATA_PROPERTY)) {
                                grapholEntity.isDataPropertyFunctional = functionalities.includes(FunctionPropertiesEnum.FUNCTIONAL);
                            }
                            else {
                                grapholEntity.functionProperties = functionalities;
                            }
                        }
                        grapholEntity.annotations = this.graphol.getEntityAnnotations(nodeXmlElement, this.xmlDocument, this.ontology.namespaces);
                        grapholEntity.getAnnotations().forEach(annotation => {
                            if (annotation.hasIriValue && annotation.rangeIri) {
                                // if (!this.ontology.getEntity(annotation.rangeIri)) {
                                //   this.ontology.addEntity(new GrapholEntity(annotation.rangeIri))
                                // }
                                if (!this.ontology.getEntity(annotation.propertyIri)) {
                                    this.ontology.addEntity(new GrapholEntity(annotation.propertyIri));
                                }
                            }
                        });
                        // APPLY DISPLAYED NAME FROM LABELS
                        node.displayedName = grapholEntity.getDisplayedName(RDFGraphConfigEntityNameTypeEnum.LABEL, undefined);
                        // Add fake nodes
                        if (node.is(TypesEnum.OBJECT_PROPERTY) &&
                            grapholEntity.hasFunctionProperty(FunctionPropertiesEnum.FUNCTIONAL) &&
                            grapholEntity.hasFunctionProperty(FunctionPropertiesEnum.INVERSE_FUNCTIONAL)) {
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
                        case TypesEnum.FACET:
                            node.displayedName = this.graphol.getFacetDisplayedName(nodeXmlElement, this.ontology) || '';
                            break;
                        case TypesEnum.VALUE_DOMAIN:
                            const iri = this.graphol.getIri(nodeXmlElement, this.ontology);
                            node.displayedName = (iri === null || iri === void 0 ? void 0 : iri.prefixed) || '';
                            break;
                        default:
                            node.displayedName = (_b = GrapholNodesEnum[node.type]) === null || _b === void 0 ? void 0 : _b.LABEL;
                            break;
                    }
                    // for domain/range restrictions, cardinalities
                    if (node.type === TypesEnum.DOMAIN_RESTRICTION || node.type === TypesEnum.RANGE_RESTRICTION) {
                        node.displayedName = getTagText(nodes[k], 'label') || '';
                    }
                }
                diagram.addElement(node, grapholEntity);
            }
            for (k = 0; k < edges.length; k++) {
                const edgeXmlElement = edges[k];
                const grapholEdge = this.getGrapholEdgeFromXML(edgeXmlElement, diagram.id);
                if (grapholEdge) {
                    diagram.addElement(grapholEdge);
                    if (grapholEdge.is(TypesEnum.INCLUSION)) {
                        const sourceNode = (_c = diagram.representations.get(RendererStatesEnum.GRAPHOL)) === null || _c === void 0 ? void 0 : _c.grapholElements.get(grapholEdge.sourceId);
                        const targetNode = (_d = diagram.representations.get(RendererStatesEnum.GRAPHOL)) === null || _d === void 0 ? void 0 : _d.grapholElements.get(grapholEdge.targetId);
                        if ((sourceNode === null || sourceNode === void 0 ? void 0 : sourceNode.iri) && (targetNode === null || targetNode === void 0 ? void 0 : targetNode.iri)) {
                            this.ontology.addSubclassOf(sourceNode.iri, targetNode.iri);
                        }
                    }
                }
            }
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
        grapholNode.diagramId = diagramId;
        grapholNode.shape = nodeInfoBasedOnType.SHAPE;
        grapholNode.identity = nodeInfoBasedOnType.IDENTITY;
        grapholNode.fillColor = element.getAttribute('color') || '';
        // Parsing the <geometry> child node of node
        var geometry = element.getElementsByTagName('geometry')[0];
        grapholNode.width = parseInt(geometry.getAttribute('width') || '');
        grapholNode.height = parseInt(geometry.getAttribute('height') || '');
        grapholNode.x = parseInt(geometry.getAttribute('x') || '');
        grapholNode.y = parseInt(geometry.getAttribute('y') || '');
        if (grapholNode.is(TypesEnum.ROLE_CHAIN) || grapholNode.is(TypesEnum.PROPERTY_ASSERTION)) {
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
        if (grapholNode.is(TypesEnum.FACET)) {
            grapholNode.shapePoints = (_b = GrapholNodesEnum.facet) === null || _b === void 0 ? void 0 : _b.SHAPE_POINTS;
            grapholNode.fillColor = '#ffffff';
            // Add fake nodes
            //grapholNode.displayedName = grapholNode.displayedName.replace('^^', '\n\n')
            grapholNode.labelYpos = 1;
            grapholNode.addFakeNode(new FakeTopRhomboid(grapholNode));
            grapholNode.addFakeNode(new FakeBottomRhomboid(grapholNode));
        }
        if (grapholNode.is(TypesEnum.PROPERTY_ASSERTION)) {
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
        const typeKey = Object.keys(TypesEnum).find(k => TypesEnum[k] === edgeXmlElement.getAttribute('type'));
        if (!typeKey)
            return;
        const grapholEdge = new GrapholEdge(edgeXmlElement.getAttribute('id') || '', TypesEnum[typeKey]);
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
            if (targetGrapholNode.is(TypesEnum.ROLE_CHAIN) || targetGrapholNode.is(TypesEnum.PROPERTY_ASSERTION)) {
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
            if (identity === TypesEnum.NEUTRAL) {
                return findIdentity(first_input_node);
            }
            else {
                switch (node.data('type')) {
                    case TypesEnum.RANGE_RESTRICTION:
                        if (identity === TypesEnum.OBJECT_PROPERTY) {
                            return TypesEnum.CLASS;
                        }
                        else if (identity === TypesEnum.DATA_PROPERTY) {
                            return TypesEnum.VALUE_DOMAIN;
                        }
                        else {
                            return identity;
                        }
                    case TypesEnum.ENUMERATION:
                        if (identity === TypesEnum.INDIVIDUAL) {
                            return (_a = GrapholNodesEnum.class) === null || _a === void 0 ? void 0 : _a.TYPE;
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
                elementTypeFromXmL = TypesEnum.CLASS;
                break;
            case 'role':
                elementTypeFromXmL = TypesEnum.OBJECT_PROPERTY;
                break;
            case 'attribute':
                elementTypeFromXmL = TypesEnum.DATA_PROPERTY;
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

cytoscape.use(popper);
cytoscape.use(cola);
autopan(cytoscape);
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
 * @see [Getting started](../pages/getting-started.html)
 * @see [Configuration](../pages/configuration.html)
 */
function fullGrapholscape(file, container, config) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const grapholscape = yield getGrapholscape(file, container, config);
        if (grapholscape) {
            init(grapholscape);
            if ((config === null || config === void 0 ? void 0 : config.initialRendererSelection) === false) {
                (_a = grapholscape.widgets.get(WidgetEnum.INITIAL_RENDERER_SELECTOR)) === null || _a === void 0 ? void 0 : _a.hide();
            }
            if (grapholscape.renderers.includes(RendererStatesEnum.INCREMENTAL) && !(config === null || config === void 0 ? void 0 : config.useCustomIncrementalController)) {
                grapholscape.incremental = new IncrementalController(grapholscape);
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
 * @see [Getting started](../pages/getting-started.html)
 * @see [Configuration](../pages/configuration.html)
 */
function bareGrapholscape(file, container, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const grapholscape = yield getGrapholscape(file, container, config);
        // if (grapholscape?.renderers.includes(RendererStatesEnum.INCREMENTAL)) {
        //   initIncremental(grapholscape)
        // }
        return grapholscape;
    });
}
function incrementalGrapholscape(ontology, container, rdfGraphToResume, config) {
    return __awaiter(this, void 0, void 0, function* () {
        let _config = {};
        let grapholscape;
        if (rdfGraphToResume === null || rdfGraphToResume === void 0 ? void 0 : rdfGraphToResume.config) {
            _config = getConfig(rdfGraphToResume);
        }
        else {
            if (config) {
                _config = Object.assign(config, loadConfig());
            }
        }
        _config.renderers = [RendererStatesEnum.INCREMENTAL];
        _config.initialRendererSelection = false;
        if (ontology.metadata) {
            grapholscape = new Core(parseRDFGraph(ontology), container, _config);
        }
        else {
            grapholscape = yield getGrapholscape(ontology, container, _config);
        }
        if (!grapholscape)
            return;
        init(grapholscape);
        if (grapholscape.renderers.includes(RendererStatesEnum.INCREMENTAL) && (config && !config.useCustomIncrementalController)) {
            grapholscape.incremental = new IncrementalController(grapholscape);
        }
        if (rdfGraphToResume && rdfGraphToResume.modelType === RDFGraphModelTypeEnum.ONTOLOGY) {
            grapholscape.resume(rdfGraphToResume);
        }
        return grapholscape;
    });
}
/** @internal */
function resume(rdfGraph, container, config) {
    var _a;
    const loadingSpinner = showLoadingSpinner(container, { selectedTheme: (_a = rdfGraph.config) === null || _a === void 0 ? void 0 : _a.selectedTheme });
    const savedConfig = loadConfig();
    if (config) {
        // copy savedConfig over config
        config = Object.assign(config, savedConfig);
    }
    else {
        config = getConfig(rdfGraph);
    }
    const grapholscape = new Core(parseRDFGraph(rdfGraph), container, config);
    // initFromResume(grapholscape, rdfGraph, true, config.useCustomIncrementalController)
    init(grapholscape);
    if (grapholscape.renderers.includes(RendererStatesEnum.INCREMENTAL) && (config && config.useCustomIncrementalController)) {
        grapholscape.incremental = new IncrementalController(grapholscape);
    }
    if (rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY) {
        grapholscape.resume(rdfGraph);
    }
    // if (mastroConnection)
    //   grapholscape.incremental?.setMastroConnection(mastroConnection)
    loadingSpinner.remove();
    return grapholscape;
}
/**
 * @internal
 * @deprecated please use grapholscape.resume(rdfGraph)
 */
function initFromResume(grapholscape, rdfGraph, forceInit = true, useCustomIncrementalController) {
    if (forceInit) {
        init(grapholscape);
        if (grapholscape.renderers.includes(RendererStatesEnum.INCREMENTAL) && !useCustomIncrementalController) {
            grapholscape.incremental = new IncrementalController(grapholscape);
        }
    }
    // Stop layout, use positions from rdfGraph, for floaty/incremental
    if (grapholscape.renderer.renderState) {
        grapholscape.renderer.renderState.layoutRunning = false;
        grapholscape.renderer.renderState.stopLayout();
    }
    if (rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY) {
        if (rdfGraph.selectedDiagramId !== undefined) {
            const diagram = grapholscape.ontology.getDiagram(rdfGraph.selectedDiagramId);
            if (diagram) {
                /**
                 * showDiagram won't set event handlers on this diagram cause it results already
                 * been rendered once, but in previous session, not yet in the current one.
                 * Force setting them here.
                 */
                setGraphEventHandlers(diagram, grapholscape.lifecycle, grapholscape.ontology);
                const floatyRepr = diagram.representations.get(RendererStatesEnum.FLOATY);
                if (floatyRepr)
                    floatyRepr.hasEverBeenRendered = false;
                grapholscape.showDiagram(diagram.id, floatyRepr === null || floatyRepr === void 0 ? void 0 : floatyRepr.lastViewportState);
            }
        }
    }
    else if (grapholscape.incremental) {
        // grapholscape.incremental.classInstanceEntities = RDFGraphParser.getClassInstances(rdfGraph, grapholscape.ontology.namespaces)
        const allEntities = new Map(Array.from(grapholscape.ontology.entities)
            .concat(Array.from(getClassInstances(rdfGraph, grapholscape.ontology.namespaces))));
        const diagramRepr = getDiagrams(rdfGraph, RendererStatesEnum.INCREMENTAL, allEntities, grapholscape.ontology.namespaces)[0].representations.get(RendererStatesEnum.INCREMENTAL);
        if (diagramRepr) {
            // grapholscape.incremental.diagram = new IncrementalDiagram()
            if (diagramRepr.lastViewportState) {
                grapholscape.incremental.diagram.lastViewportState = diagramRepr.lastViewportState;
            }
            grapholscape.incremental.diagram.representations.set(RendererStatesEnum.INCREMENTAL, diagramRepr);
            diagramRepr.hasEverBeenRendered = false;
            // Diagram (representation) has been changed, set event handlers again
            grapholscape.incremental.setIncrementalEventHandlers();
            // Diagram representation has been changed, set nodes button event handlers
            // NodeButtonsFactory(grapholscape.incremental)
            if (diagramRepr.grapholElements.size > 0) {
                const initialMenu = grapholscape.widgets.get(WidgetEnum.INCREMENTAL_INITIAL_MENU);
                if (initialMenu)
                    moveUpLeft(initialMenu);
            }
            new OntologyColorManager(grapholscape.ontology, diagramRepr).colorEntities(allEntities);
            grapholscape.incremental.showDiagram(rdfGraph.diagrams[0].lastViewportState);
        }
    }
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
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let ontology;
            let timeout;
            const loadingSpinner = showLoadingSpinner(container, config);
            if (typeof (file) === 'object') {
                let reader = new FileReader();
                reader.onloadend = () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        ontology = yield getResult(reader.result);
                        init();
                    }
                    catch (error) {
                        reject(error);
                    }
                });
                reader.readAsText(file);
                setTimeout(() => {
                    reject('Error: timeout expired');
                }, 10000);
            }
            else if (typeof (file) === 'string') {
                ontology = yield getResult(file);
                init();
            }
            else {
                reject('Err: Grapholscape needs a Graphol File or the corresponding string to be initialized');
            }
            function init() {
                try {
                    if (!ontology) {
                        throw new Error("Error in graphol file");
                    }
                    clearTimeout(timeout);
                    loadingSpinner.remove();
                    const gscape = new Core(ontology, container, config);
                    resolve(gscape);
                }
                catch (e) {
                    console.error(e);
                }
            }
        }));
        function getResult(file) {
            return new GrapholParser(file).parseGraphol();
        }
    });
}
function showLoadingSpinner(container, config) {
    const spinner = new ContentSpinner();
    spinner.style.position = 'absolute';
    spinner.style.zIndex = '10';
    let themeConfig;
    let theme;
    if (config === null || config === void 0 ? void 0 : config.selectedTheme) {
        if (DefaultThemes[config.selectedTheme] !== undefined) {
            theme = DefaultThemes[config.selectedTheme];
        }
        else if (config === null || config === void 0 ? void 0 : config.themes) {
            themeConfig = config.themes.find(theme => theme === (config === null || config === void 0 ? void 0 : config.selectedTheme) || theme.id === (config === null || config === void 0 ? void 0 : config.selectedTheme));
            if (themeConfig) {
                theme = typeof (themeConfig) === 'string' ? DefaultThemes[themeConfig] : themeConfig;
            }
        }
    }
    if (!theme) {
        theme = DefaultThemes.grapholscape;
    }
    spinner.setColor((theme === null || theme === void 0 ? void 0 : theme.getColour(ColoursNames.accent)) || '#000');
    container.appendChild(spinner);
    return spinner;
}

export { AnnotatedElement, Annotation, AnnotationProperty, AnnotationsDiagram, BaseFilterManager, BaseRenderer, Breakpoint, CSS_PROPERTY_NAMESPACE, ClassInstanceEntity, ColoursNames, Core, DefaultAnnotationProperties, RDFGraphConfigFiltersEnum as DefaultFilterKeyEnum, DefaultNamespaces, DefaultThemes, DefaultThemesEnum, Diagram, DiagramBuilder, DiagramColorManager, DiagramRepresentation, DisplayedNamesManager, RDFGraphConfigEntityNameTypeEnum as EntityNameType, EntityNavigator, Filter, FloatyRendererState, FunctionPropertiesEnum as FunctionalityEnum, GrapholEdge, GrapholElement, GrapholEntity, GrapholNode, GrapholNodesEnum, GrapholRendererState, Grapholscape, GrapholscapeTheme, Hierarchy, IncrementalBase, IncrementalController, IncrementalDiagram, IncrementalEvent, IncrementalRendererState, index as IncrementalUI, Iri, Language, Lifecycle, LifecycleEvent, LiteRendererState, Namespace, NeighbourhoodFinder, Ontology, OntologyColorManager, POLYGON_POINTS, rdfGraphParser as RDFGraphParser, Renderer, RendererStatesEnum, Shape, index$4 as SwaggerModel, ThemeManager, TypesEnum, annotationPropertyFilter, bareGrapholscape, classicColourMap, clearLocalStorage, computeHierarchies, darkColourMap, floatyStyle as floatyGraphStyle, floatyOptions, fullGrapholscape, getDefaultFilters, floatyStyle as getFloatyStyle, grapholStyle as grapholGraphStyle, cytoscapeDefaultConfig as grapholOptions, gscapeColourMap, incrementalStyle as incrementalGraphStyle, incrementalGrapholscape, initFromResume, isGrapholEdge, isGrapholNode, liteStyle as liteGraphStyle, liteOptions, loadConfig, parseRDFGraph, rdfgraphSerializer, resume, setGraphEventHandlers, storeConfigEntry, toPNG, toSVG, index$1 as ui, index$2 as util };
