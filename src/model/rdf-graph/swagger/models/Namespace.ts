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
 * @interface Namespace
 */
export interface Namespace {
    /**
     * 
     * @type {string}
     * @memberof Namespace
     */
    value: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof Namespace
     */
    prefixes: Array<string>;
}

/**
 * Check if a given object implements the Namespace interface.
 */
export function instanceOfNamespace(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "value" in value;
    isInstance = isInstance && "prefixes" in value;

    return isInstance;
}

export function NamespaceFromJSON(json: any): Namespace {
    return NamespaceFromJSONTyped(json, false);
}

export function NamespaceFromJSONTyped(json: any, ignoreDiscriminator: boolean): Namespace {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'value': json['value'],
        'prefixes': json['prefixes'],
    };
}

export function NamespaceToJSON(value?: Namespace | null): any {
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
