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
/**
 * 
 * @export
 * @interface InstanceShortestPathTarget
 */
export interface InstanceShortestPathTarget {
    /**
     * 
     * @type {boolean}
     * @memberof InstanceShortestPathTarget
     */
    isInstance: boolean;
    /**
     * 
     * @type {string}
     * @memberof InstanceShortestPathTarget
     */
    iri: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof InstanceShortestPathTarget
     */
    parentClasses?: Array<string>;
}

/**
 * Check if a given object implements the InstanceShortestPathTarget interface.
 */
export function instanceOfInstanceShortestPathTarget(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "isInstance" in value;
    isInstance = isInstance && "iri" in value;

    return isInstance;
}

export function InstanceShortestPathTargetFromJSON(json: any): InstanceShortestPathTarget {
    return InstanceShortestPathTargetFromJSONTyped(json, false);
}

export function InstanceShortestPathTargetFromJSONTyped(json: any, ignoreDiscriminator: boolean): InstanceShortestPathTarget {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'isInstance': json['isInstance'],
        'iri': json['iri'],
        'parentClasses': !exists(json, 'parentClasses') ? undefined : json['parentClasses'],
    };
}

export function InstanceShortestPathTargetToJSON(value?: InstanceShortestPathTarget | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'isInstance': value.isInstance,
        'iri': value.iri,
        'parentClasses': value.parentClasses,
    };
}
