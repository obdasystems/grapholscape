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
import type { Action } from './Action';
import {
    ActionFromJSON,
    ActionFromJSONTyped,
    ActionToJSON,
} from './Action';
import type { ActionInvolvedElements } from './ActionInvolvedElements';
import {
    ActionInvolvedElementsFromJSON,
    ActionInvolvedElementsFromJSONTyped,
    ActionInvolvedElementsToJSON,
} from './ActionInvolvedElements';
import type { ActionUser } from './ActionUser';
import {
    ActionUserFromJSON,
    ActionUserFromJSONTyped,
    ActionUserToJSON,
} from './ActionUser';
import type { Annotation } from './Annotation';
import {
    AnnotationFromJSON,
    AnnotationFromJSONTyped,
    AnnotationToJSON,
} from './Annotation';
import type { Entity } from './Entity';
import {
    EntityFromJSON,
    EntityFromJSONTyped,
    EntityToJSON,
} from './Entity';

/**
 * 
 * @export
 * @interface AnnotationAction
 */
export interface AnnotationAction {
    /**
     * 
     * @type {Annotation}
     * @memberof AnnotationAction
     */
    subject?: Annotation;
    /**
     * 
     * @type {Annotation}
     * @memberof AnnotationAction
     */
    previousState?: Annotation;
    /**
     * 
     * @type {Entity}
     * @memberof AnnotationAction
     */
    entity?: Entity;
    /**
     * 
     * @type {boolean}
     * @memberof AnnotationAction
     */
    onOntology?: boolean;
    /**
     * 
     * @type {string}
     * @memberof AnnotationAction
     */
    operationType: AnnotationActionOperationTypeEnum;
    /**
     * 
     * @type {ActionInvolvedElements}
     * @memberof AnnotationAction
     */
    involvedElements?: ActionInvolvedElements;
    /**
     * 
     * @type {Array<Action>}
     * @memberof AnnotationAction
     */
    subactions?: Array<Action>;
    /**
     * 
     * @type {ActionUser}
     * @memberof AnnotationAction
     */
    user: ActionUser;
    /**
     * 
     * @type {number}
     * @memberof AnnotationAction
     */
    timestamp: number;
}

/**
* @export
* @enum {string}
*/
export enum AnnotationActionOperationTypeEnum {
    ADD = 'add',
    EDIT = 'edit',
    REMOVE = 'remove'
}


/**
 * Check if a given object implements the AnnotationAction interface.
 */
export function instanceOfAnnotationAction(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "operationType" in value;
    isInstance = isInstance && "user" in value;
    isInstance = isInstance && "timestamp" in value;

    return isInstance;
}

export function AnnotationActionFromJSON(json: any): AnnotationAction {
    return AnnotationActionFromJSONTyped(json, false);
}

export function AnnotationActionFromJSONTyped(json: any, ignoreDiscriminator: boolean): AnnotationAction {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'subject': !exists(json, 'subject') ? undefined : AnnotationFromJSON(json['subject']),
        'previousState': !exists(json, 'previousState') ? undefined : AnnotationFromJSON(json['previousState']),
        'entity': !exists(json, 'entity') ? undefined : EntityFromJSON(json['entity']),
        'onOntology': !exists(json, 'onOntology') ? undefined : json['onOntology'],
        'operationType': json['operationType'],
        'involvedElements': !exists(json, 'involvedElements') ? undefined : ActionInvolvedElementsFromJSON(json['involvedElements']),
        'subactions': !exists(json, 'subactions') ? undefined : ((json['subactions'] as Array<any>).map(ActionFromJSON)),
        'user': ActionUserFromJSON(json['user']),
        'timestamp': json['timestamp'],
    };
}

export function AnnotationActionToJSON(value?: AnnotationAction | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'subject': AnnotationToJSON(value.subject),
        'previousState': AnnotationToJSON(value.previousState),
        'entity': EntityToJSON(value.entity),
        'onOntology': value.onOntology,
        'operationType': value.operationType,
        'involvedElements': ActionInvolvedElementsToJSON(value.involvedElements),
        'subactions': value.subactions === undefined ? undefined : ((value.subactions as Array<any>).map(ActionToJSON)),
        'user': ActionUserToJSON(value.user),
        'timestamp': value.timestamp,
    };
}
