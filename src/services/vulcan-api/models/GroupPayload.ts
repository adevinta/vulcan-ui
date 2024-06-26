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
 * 
 * @export
 * @interface GroupPayload
 */
export interface GroupPayload {
    /**
     * name
     * @type {string}
     * @memberof GroupPayload
     */
    name: string;
    /**
     * Options
     * @type {string}
     * @memberof GroupPayload
     */
    options?: string;
}

/**
 * Check if a given object implements the GroupPayload interface.
 */
export function instanceOfGroupPayload(value: object): boolean {
    if (!('name' in value)) return false;
    return true;
}

export function GroupPayloadFromJSON(json: any): GroupPayload {
    return GroupPayloadFromJSONTyped(json, false);
}

export function GroupPayloadFromJSONTyped(json: any, ignoreDiscriminator: boolean): GroupPayload {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'options': json['options'] == null ? undefined : json['options'],
    };
}

export function GroupPayloadToJSON(value?: GroupPayload | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'name': value['name'],
        'options': value['options'],
    };
}

