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
import type { Position } from './Position';
import {
    PositionFromJSON,
    PositionFromJSONTyped,
    PositionToJSON,
} from './Position';
import type { TypesEnum } from './TypesEnum';
import {
    TypesEnumFromJSON,
    TypesEnumFromJSONTyped,
    TypesEnumToJSON,
} from './TypesEnum';

/**
 * 
 * @export
 * @interface NodeAllOf
 */
export interface NodeAllOf {
    /**
     * 
     * @type {Position}
     * @memberof NodeAllOf
     */
    position?: Position;
    /**
     * 
     * @type {TypesEnum}
     * @memberof NodeAllOf
     */
    identity?: TypesEnum;
    /**
     * 
     * @type {Position}
     * @memberof NodeAllOf
     */
    labelPosition?: Position;
}

/**
 * Check if a given object implements the NodeAllOf interface.
 */
export function instanceOfNodeAllOf(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function NodeAllOfFromJSON(json: any): NodeAllOf {
    return NodeAllOfFromJSONTyped(json, false);
}

export function NodeAllOfFromJSONTyped(json: any, ignoreDiscriminator: boolean): NodeAllOf {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'position': !exists(json, 'position') ? undefined : PositionFromJSON(json['position']),
        'identity': !exists(json, 'identity') ? undefined : TypesEnumFromJSON(json['identity']),
        'labelPosition': !exists(json, 'labelPosition') ? undefined : PositionFromJSON(json['labelPosition']),
    };
}

export function NodeAllOfToJSON(value?: NodeAllOf | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'position': PositionToJSON(value.position),
        'identity': TypesEnumToJSON(value.identity),
        'labelPosition': PositionToJSON(value.labelPosition),
    };
}
