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

import { exists, mapValues } from '../runtime';
import type { Theme } from './Theme';
import {
    ThemeFromJSON,
    ThemeFromJSONTyped,
    ThemeToJSON,
} from './Theme';

/**
 * 
 * @export
 * @interface RDFGraphConfig
 */
export interface RDFGraphConfig {
    /**
     * 
     * @type {Array<Theme>}
     * @memberof RDFGraphConfig
     */
    themes?: Array<Theme>;
    /**
     * 
     * @type {string}
     * @memberof RDFGraphConfig
     */
    selectedTheme?: string;
    /**
     * 
     * @type {string}
     * @memberof RDFGraphConfig
     */
    language?: string;
    /**
     * 
     * @type {string}
     * @memberof RDFGraphConfig
     */
    entityNameType?: RDFGraphConfigEntityNameTypeEnum;
    /**
     * 
     * @type {Array<string>}
     * @memberof RDFGraphConfig
     */
    renderers?: Array<string>;
    /**
     * 
     * @type {object}
     * @memberof RDFGraphConfig
     */
    widgets?: object;
    /**
     * 
     * @type {Array<string>}
     * @memberof RDFGraphConfig
     */
    filters?: Array<RDFGraphConfigFiltersEnum>;
}

/**
* @export
* @enum {string}
*/
export enum RDFGraphConfigEntityNameTypeEnum {
    LABEL = 'label',
    PREFIXED_IRI = 'prefixed_iri',
    FULL_IRI = 'full_iri'
}
/**
* @export
* @enum {string}
*/
export enum RDFGraphConfigFiltersEnum {
    ALL = 'all',
    DATA_PROPERTY = 'data-property',
    VALUE_DOMAIN = 'value-domain',
    INDIVIDUAL = 'individual',
    ANNOTATION_PROPERTY = 'annotation-property',
    UNIVERSAL_QUANTIFIER = 'universal_quantifier',
    COMPLEMENT = 'complement',
    HAS_KEY = 'has-key'
}


/**
 * Check if a given object implements the RDFGraphConfig interface.
 */
export function instanceOfRDFGraphConfig(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RDFGraphConfigFromJSON(json: any): RDFGraphConfig {
    return RDFGraphConfigFromJSONTyped(json, false);
}

export function RDFGraphConfigFromJSONTyped(json: any, ignoreDiscriminator: boolean): RDFGraphConfig {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'themes': !exists(json, 'themes') ? undefined : ((json['themes'] as Array<any>).map(ThemeFromJSON)),
        'selectedTheme': !exists(json, 'selectedTheme') ? undefined : json['selectedTheme'],
        'language': !exists(json, 'language') ? undefined : json['language'],
        'entityNameType': !exists(json, 'entityNameType') ? undefined : json['entityNameType'],
        'renderers': !exists(json, 'renderers') ? undefined : json['renderers'],
        'widgets': !exists(json, 'widgets') ? undefined : json['widgets'],
        'filters': !exists(json, 'filters') ? undefined : json['filters'],
    };
}

export function RDFGraphConfigToJSON(value?: RDFGraphConfig | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'themes': value.themes === undefined ? undefined : ((value.themes as Array<any>).map(ThemeToJSON)),
        'selectedTheme': value.selectedTheme,
        'language': value.language,
        'entityNameType': value.entityNameType,
        'renderers': value.renderers,
        'widgets': value.widgets,
        'filters': value.filters,
    };
}

