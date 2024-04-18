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
 * @interface ScanPayload
 */
export interface ScanPayload {
    /**
     * Program ID
     * @type {string}
     * @memberof ScanPayload
     */
    programId: string;
    /**
     * Group ID
     * @type {Date}
     * @memberof ScanPayload
     */
    scheduledTime?: Date;
}

/**
 * Check if a given object implements the ScanPayload interface.
 */
export function instanceOfScanPayload(value: object): boolean {
    if (!('programId' in value)) return false;
    return true;
}

export function ScanPayloadFromJSON(json: any): ScanPayload {
    return ScanPayloadFromJSONTyped(json, false);
}

export function ScanPayloadFromJSONTyped(json: any, ignoreDiscriminator: boolean): ScanPayload {
    if (json == null) {
        return json;
    }
    return {
        
        'programId': json['program_id'],
        'scheduledTime': json['scheduled_time'] == null ? undefined : (new Date(json['scheduled_time'])),
    };
}

export function ScanPayloadToJSON(value?: ScanPayload | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'program_id': value['programId'],
        'scheduled_time': value['scheduledTime'] == null ? undefined : ((value['scheduledTime']).toISOString()),
    };
}

