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
import type { Entity } from './Entity';
import {
    EntityFromJSON,
    EntityFromJSONTyped,
    EntityToJSON,
} from './Entity';

/**
 * 
 * @export
 * @interface HierarchySuperclassesInner
 */
export interface HierarchySuperclassesInner {
    /**
     * 
     * @type {Entity}
     * @memberof HierarchySuperclassesInner
     */
    classEntity: Entity;
    /**
     * 
     * @type {boolean}
     * @memberof HierarchySuperclassesInner
     */
    complete: boolean;
}

/**
 * Check if a given object implements the HierarchySuperclassesInner interface.
 */
export function instanceOfHierarchySuperclassesInner(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "classEntity" in value;
    isInstance = isInstance && "complete" in value;

    return isInstance;
}

export function HierarchySuperclassesInnerFromJSON(json: any): HierarchySuperclassesInner {
    return HierarchySuperclassesInnerFromJSONTyped(json, false);
}

export function HierarchySuperclassesInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): HierarchySuperclassesInner {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'classEntity': EntityFromJSON(json['classEntity']),
        'complete': json['complete'],
    };
}

export function HierarchySuperclassesInnerToJSON(value?: HierarchySuperclassesInner | null): any {
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
