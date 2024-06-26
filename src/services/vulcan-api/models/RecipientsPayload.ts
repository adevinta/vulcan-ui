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
 * @interface RecipientsPayload
 */
export interface RecipientsPayload {
    /**
     * Emails
     * @type {Array<string>}
     * @memberof RecipientsPayload
     */
    emails: Array<string>;
}

/**
 * Check if a given object implements the RecipientsPayload interface.
 */
export function instanceOfRecipientsPayload(value: object): boolean {
    if (!('emails' in value)) return false;
    return true;
}

export function RecipientsPayloadFromJSON(json: any): RecipientsPayload {
    return RecipientsPayloadFromJSONTyped(json, false);
}

export function RecipientsPayloadFromJSONTyped(json: any, ignoreDiscriminator: boolean): RecipientsPayload {
    if (json == null) {
        return json;
    }
    return {
        
        'emails': json['emails'],
    };
}

export function RecipientsPayloadToJSON(value?: RecipientsPayload | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'emails': value['emails'],
    };
}

