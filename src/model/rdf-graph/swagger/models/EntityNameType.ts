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
export enum EntityNameType {
    LABEL = 'label',
    PREFIXED_IRI = 'prefixed_iri',
    FULL_IRI = 'full_iri'
}


export function EntityNameTypeFromJSON(json: any): EntityNameType {
    return EntityNameTypeFromJSONTyped(json, false);
}

export function EntityNameTypeFromJSONTyped(json: any, ignoreDiscriminator: boolean): EntityNameType {
    return json as EntityNameType;
}

export function EntityNameTypeToJSON(value?: EntityNameType | null): any {
    return value as any;
}
