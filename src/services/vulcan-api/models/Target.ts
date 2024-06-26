/* tslint:disable */
/* eslint-disable */
/**
 * Vulcan API
 * Public API for Vulcan Vulnerability Scan Engine
 *
 * The version of the OpenAPI document: 1.1.3
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * target (default view)
 * @export
 * @interface Target
 */
export interface Target {
    /**
     * Target ID
     * @type {string}
     * @memberof Target
     */
    id?: string;
    /**
     * Target identifier
     * @type {string}
     * @memberof Target
     */
    identifier?: string;
    /**
     * List of TeamIDs associated with target
     * @type {Array<string>}
     * @memberof Target
     */
    teams?: Array<string>;
}

/**
 * Check if a given object implements the Target interface.
 */
export function instanceOfTarget(value: object): boolean {
    return true;
}

export function TargetFromJSON(json: any): Target {
    return TargetFromJSONTyped(json, false);
}

export function TargetFromJSONTyped(json: any, ignoreDiscriminator: boolean): Target {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'identifier': json['identifier'] == null ? undefined : json['identifier'],
        'teams': json['teams'] == null ? undefined : json['teams'],
    };
}

export function TargetToJSON(value?: Target | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'id': value['id'],
        'identifier': value['identifier'],
        'teams': value['teams'],
    };
}

