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
import type { DataPropertyValue } from './DataPropertyValue';
import {
    DataPropertyValueFromJSON,
    DataPropertyValueFromJSONTyped,
    DataPropertyValueToJSON,
} from './DataPropertyValue';

/**
 * 
 * @export
 * @interface ClassInstanceEntityAllOf
 */
export interface ClassInstanceEntityAllOf {
    /**
     * 
     * @type {Array<string>}
     * @memberof ClassInstanceEntityAllOf
     */
    parentClasses?: Array<string>;
    /**
     * 
     * @type {Array<DataPropertyValue>}
     * @memberof ClassInstanceEntityAllOf
     */
    dataProperties?: Array<DataPropertyValue>;
}

/**
 * Check if a given object implements the ClassInstanceEntityAllOf interface.
 */
export function instanceOfClassInstanceEntityAllOf(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ClassInstanceEntityAllOfFromJSON(json: any): ClassInstanceEntityAllOf {
    return ClassInstanceEntityAllOfFromJSONTyped(json, false);
}

export function ClassInstanceEntityAllOfFromJSONTyped(json: any, ignoreDiscriminator: boolean): ClassInstanceEntityAllOf {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'parentClasses': !exists(json, 'parentClasses') ? undefined : json['parentClasses'],
        'dataProperties': !exists(json, 'dataProperties') ? undefined : ((json['dataProperties'] as Array<any>).map(DataPropertyValueFromJSON)),
    };
}

export function ClassInstanceEntityAllOfToJSON(value?: ClassInstanceEntityAllOf | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'parentClasses': value.parentClasses,
        'dataProperties': value.dataProperties === undefined ? undefined : ((value.dataProperties as Array<any>).map(DataPropertyValueToJSON)),
    };
}
