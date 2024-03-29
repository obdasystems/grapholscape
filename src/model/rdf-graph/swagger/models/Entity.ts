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
import type { Annotation } from './Annotation';
import {
    AnnotationFromJSON,
    AnnotationFromJSONTyped,
    AnnotationToJSON,
} from './Annotation';
import type { FunctionPropertiesEnum } from './FunctionPropertiesEnum';
import {
    FunctionPropertiesEnumFromJSON,
    FunctionPropertiesEnumFromJSONTyped,
    FunctionPropertiesEnumToJSON,
} from './FunctionPropertiesEnum';

/**
 * 
 * @export
 * @interface Entity
 */
export interface Entity {
    /**
     * 
     * @type {string}
     * @memberof Entity
     */
    fullIri: string;
    /**
     * 
     * @type {Array<Annotation>}
     * @memberof Entity
     */
    annotations?: Array<Annotation>;
    /**
     * 
     * @type {string}
     * @memberof Entity
     */
    datatype?: string;
    /**
     * 
     * @type {boolean}
     * @memberof Entity
     */
    isDataPropertyFunctional?: boolean;
    /**
     * 
     * @type {Array<FunctionPropertiesEnum>}
     * @memberof Entity
     */
    functionProperties?: Array<FunctionPropertiesEnum>;
}

/**
 * Check if a given object implements the Entity interface.
 */
export function instanceOfEntity(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "fullIri" in value;

    return isInstance;
}

export function EntityFromJSON(json: any): Entity {
    return EntityFromJSONTyped(json, false);
}

export function EntityFromJSONTyped(json: any, ignoreDiscriminator: boolean): Entity {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'fullIri': json['fullIri'],
        'annotations': !exists(json, 'annotations') ? undefined : ((json['annotations'] as Array<any>).map(AnnotationFromJSON)),
        'datatype': !exists(json, 'datatype') ? undefined : json['datatype'],
        'isDataPropertyFunctional': !exists(json, 'isDataPropertyFunctional') ? undefined : json['isDataPropertyFunctional'],
        'functionProperties': !exists(json, 'functionProperties') ? undefined : ((json['functionProperties'] as Array<any>).map(FunctionPropertiesEnumFromJSON)),
    };
}

export function EntityToJSON(value?: Entity | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'fullIri': value.fullIri,
        'annotations': value.annotations === undefined ? undefined : ((value.annotations as Array<any>).map(AnnotationToJSON)),
        'datatype': value.datatype,
        'isDataPropertyFunctional': value.isDataPropertyFunctional,
        'functionProperties': value.functionProperties === undefined ? undefined : ((value.functionProperties as Array<any>).map(FunctionPropertiesEnumToJSON)),
    };
}

