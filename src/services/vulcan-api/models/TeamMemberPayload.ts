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
 * @interface TeamMemberPayload
 */
export interface TeamMemberPayload {
    /**
     * Email
     * @type {string}
     * @memberof TeamMemberPayload
     */
    email?: string;
    /**
     * Member role. Valid values are: owner, member
     * @type {string}
     * @memberof TeamMemberPayload
     */
    role?: string;
    /**
     * User ID
     * @type {string}
     * @memberof TeamMemberPayload
     */
    userId?: string;
}

/**
 * Check if a given object implements the TeamMemberPayload interface.
 */
export function instanceOfTeamMemberPayload(value: object): boolean {
    return true;
}

export function TeamMemberPayloadFromJSON(json: any): TeamMemberPayload {
    return TeamMemberPayloadFromJSONTyped(json, false);
}

export function TeamMemberPayloadFromJSONTyped(json: any, ignoreDiscriminator: boolean): TeamMemberPayload {
    if (json == null) {
        return json;
    }
    return {
        
        'email': json['email'] == null ? undefined : json['email'],
        'role': json['role'] == null ? undefined : json['role'],
        'userId': json['user_id'] == null ? undefined : json['user_id'],
    };
}

export function TeamMemberPayloadToJSON(value?: TeamMemberPayload | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'email': value['email'],
        'role': value['role'],
        'user_id': value['userId'],
    };
}

