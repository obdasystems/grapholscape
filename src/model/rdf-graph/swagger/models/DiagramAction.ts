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
import type { Diagram } from './Diagram';
import {
    DiagramFromJSON,
    DiagramFromJSONTyped,
    DiagramToJSON,
} from './Diagram';

/**
 * 
 * @export
 * @interface DiagramAction
 */
export interface DiagramAction {
    /**
     * 
     * @type {Diagram}
     * @memberof DiagramAction
     */
    subject?: Diagram;
    /**
     * 
     * @type {Diagram}
     * @memberof DiagramAction
     */
    previousState?: Diagram;
    /**
     * 
     * @type {string}
     * @memberof DiagramAction
     */
    operationType: DiagramActionOperationTypeEnum;
    /**
     * 
     * @type {ActionInvolvedElements}
     * @memberof DiagramAction
     */
    involvedElements?: ActionInvolvedElements;
    /**
     * 
     * @type {Array<Action>}
     * @memberof DiagramAction
     */
    subactions?: Array<Action>;
    /**
     * 
     * @type {ActionUser}
     * @memberof DiagramAction
     */
    user: ActionUser;
    /**
     * 
     * @type {number}
     * @memberof DiagramAction
     */
    timestamp: number;
}

/**
* @export
* @enum {string}
*/
export enum DiagramActionOperationTypeEnum {
    ADD = 'add',
    EDIT = 'edit',
    REMOVE = 'remove'
}


/**
 * Check if a given object implements the DiagramAction interface.
 */
export function instanceOfDiagramAction(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "operationType" in value;
    isInstance = isInstance && "user" in value;
    isInstance = isInstance && "timestamp" in value;

    return isInstance;
}

export function DiagramActionFromJSON(json: any): DiagramAction {
    return DiagramActionFromJSONTyped(json, false);
}

export function DiagramActionFromJSONTyped(json: any, ignoreDiscriminator: boolean): DiagramAction {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'subject': !exists(json, 'subject') ? undefined : DiagramFromJSON(json['subject']),
        'previousState': !exists(json, 'previousState') ? undefined : DiagramFromJSON(json['previousState']),
        'operationType': json['operationType'],
        'involvedElements': !exists(json, 'involvedElements') ? undefined : ActionInvolvedElementsFromJSON(json['involvedElements']),
        'subactions': !exists(json, 'subactions') ? undefined : ((json['subactions'] as Array<any>).map(ActionFromJSON)),
        'user': ActionUserFromJSON(json['user']),
        'timestamp': json['timestamp'],
    };
}

export function DiagramActionToJSON(value?: DiagramAction | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'subject': DiagramToJSON(value.subject),
        'previousState': DiagramToJSON(value.previousState),
        'operationType': value.operationType,
        'involvedElements': ActionInvolvedElementsToJSON(value.involvedElements),
        'subactions': value.subactions === undefined ? undefined : ((value.subactions as Array<any>).map(ActionToJSON)),
        'user': ActionUserToJSON(value.user),
        'timestamp': value.timestamp,
    };
}

