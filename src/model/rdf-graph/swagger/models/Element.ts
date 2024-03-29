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
import type { TypesEnum } from './TypesEnum';
import {
    TypesEnumFromJSON,
    TypesEnumFromJSONTyped,
    TypesEnumToJSON,
} from './TypesEnum';

/**
 * 
 * @export
 * @interface Element
 */
export interface Element {
    /**
     * 
     * @type {string}
     * @memberof Element
     */
    id: string;
    /**
     * In case of replicated elements, this is the ID of the original element replicated in multiple occurrences, all of them with different IDs
     * @type {string}
     * @memberof Element
     */
    originalId?: string;
    /**
     * 
     * @type {number}
     * @memberof Element
     */
    diagramId?: number;
    /**
     * 
     * @type {string}
     * @memberof Element
     */
    displayedName?: string;
    /**
     * 
     * @type {string}
     * @memberof Element
     */
    iri?: string;
    /**
     * 
     * @type {TypesEnum}
     * @memberof Element
     */
    type: TypesEnum;
}

/**
 * Check if a given object implements the Element interface.
 */
export function instanceOfElement(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "type" in value;

    return isInstance;
}

export function ElementFromJSON(json: any): Element {
    return ElementFromJSONTyped(json, false);
}

export function ElementFromJSONTyped(json: any, ignoreDiscriminator: boolean): Element {
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

export function ElementToJSON(value?: Element | null): any {
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

