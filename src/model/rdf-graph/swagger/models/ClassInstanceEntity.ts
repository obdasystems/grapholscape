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
import type { DataPropertyValue } from './DataPropertyValue';
import {
    DataPropertyValueFromJSON,
    DataPropertyValueFromJSONTyped,
    DataPropertyValueToJSON,
} from './DataPropertyValue';
import type { FunctionPropertiesEnum } from './FunctionPropertiesEnum';
import {
    FunctionPropertiesEnumFromJSON,
    FunctionPropertiesEnumFromJSONTyped,
    FunctionPropertiesEnumToJSON,
} from './FunctionPropertiesEnum';

/**
 * 
 * @export
 * @interface ClassInstanceEntity
 */
export interface ClassInstanceEntity {
    /**
     * 
     * @type {string}
     * @memberof ClassInstanceEntity
     */
    fullIri: string;
    /**
     * 
     * @type {Array<Annotation>}
     * @memberof ClassInstanceEntity
     */
    annotations?: Array<Annotation>;
    /**
     * 
     * @type {string}
     * @memberof ClassInstanceEntity
     */
    datatype?: string;
    /**
     * 
     * @type {boolean}
     * @memberof ClassInstanceEntity
     */
    isDataPropertyFunctional?: boolean;
    /**
     * 
     * @type {Array<FunctionPropertiesEnum>}
     * @memberof ClassInstanceEntity
     */
    functionProperties?: Array<FunctionPropertiesEnum>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ClassInstanceEntity
     */
    parentClasses?: Array<string>;
    /**
     * 
     * @type {Array<DataPropertyValue>}
     * @memberof ClassInstanceEntity
     */
    dataProperties?: Array<DataPropertyValue>;
    /**
     * 
     * @type {string}
     * @memberof ClassInstanceEntity
     */
    shortIri?: string;
}

/**
 * Check if a given object implements the ClassInstanceEntity interface.
 */
export function instanceOfClassInstanceEntity(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "fullIri" in value;

    return isInstance;
}

export function ClassInstanceEntityFromJSON(json: any): ClassInstanceEntity {
    return ClassInstanceEntityFromJSONTyped(json, false);
}

export function ClassInstanceEntityFromJSONTyped(json: any, ignoreDiscriminator: boolean): ClassInstanceEntity {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'fullIri': json['fullIri'],
        'annotations': !exists(json, 'annotations') ? undefined : ((json['annotations'] as Array<any>).map(AnnotationFromJSON)),
        'datatype': !exists(json, 'datatype') ? undefined : json['datatype'],
        'isDataPropertyFunctional': !exists(json, 'isDataPropertyFunctional') ? undefined : json['isDataPropertyFunctional'],
        'functionProperties': !exists(json, 'functionProperties') ? undefined : ((json['functionProperties'] as Array<any>).map(FunctionPropertiesEnumFromJSON)),
        'parentClasses': !exists(json, 'parentClasses') ? undefined : json['parentClasses'],
        'dataProperties': !exists(json, 'dataProperties') ? undefined : ((json['dataProperties'] as Array<any>).map(DataPropertyValueFromJSON)),
        'shortIri': !exists(json, 'shortIri') ? undefined : json['shortIri'],
    };
}

export function ClassInstanceEntityToJSON(value?: ClassInstanceEntity | null): any {
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
        'parentClasses': value.parentClasses,
        'dataProperties': value.dataProperties === undefined ? undefined : ((value.dataProperties as Array<any>).map(DataPropertyValueToJSON)),
        'shortIri': value.shortIri,
    };
}

