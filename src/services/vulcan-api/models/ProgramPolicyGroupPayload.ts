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
 * @interface ProgramPolicyGroupPayload
 */
export interface ProgramPolicyGroupPayload {
    /**
     * group
     * @type {string}
     * @memberof ProgramPolicyGroupPayload
     */
    groupId?: string;
    /**
     * policy
     * @type {string}
     * @memberof ProgramPolicyGroupPayload
     */
    policyId?: string;
}

/**
 * Check if a given object implements the ProgramPolicyGroupPayload interface.
 */
export function instanceOfProgramPolicyGroupPayload(value: object): boolean {
    return true;
}

export function ProgramPolicyGroupPayloadFromJSON(json: any): ProgramPolicyGroupPayload {
    return ProgramPolicyGroupPayloadFromJSONTyped(json, false);
}

export function ProgramPolicyGroupPayloadFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProgramPolicyGroupPayload {
    if (json == null) {
        return json;
    }
    return {
        
        'groupId': json['group_id'] == null ? undefined : json['group_id'],
        'policyId': json['policy_id'] == null ? undefined : json['policy_id'],
    };
}

export function ProgramPolicyGroupPayloadToJSON(value?: ProgramPolicyGroupPayload | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'group_id': value['groupId'],
        'policy_id': value['policyId'],
    };
}

