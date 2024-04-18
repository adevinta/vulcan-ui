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
 * @interface TeamMemberUpdatePayload
 */
export interface TeamMemberUpdatePayload {
    /**
     * Member role. Valid values are: owner, member
     * @type {string}
     * @memberof TeamMemberUpdatePayload
     */
    role?: string;
}

/**
 * Check if a given object implements the TeamMemberUpdatePayload interface.
 */
export function instanceOfTeamMemberUpdatePayload(value: object): boolean {
    return true;
}

export function TeamMemberUpdatePayloadFromJSON(json: any): TeamMemberUpdatePayload {
    return TeamMemberUpdatePayloadFromJSONTyped(json, false);
}

export function TeamMemberUpdatePayloadFromJSONTyped(json: any, ignoreDiscriminator: boolean): TeamMemberUpdatePayload {
    if (json == null) {
        return json;
    }
    return {
        
        'role': json['role'] == null ? undefined : json['role'],
    };
}

export function TeamMemberUpdatePayloadToJSON(value?: TeamMemberUpdatePayload | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'role': value['role'],
    };
}

