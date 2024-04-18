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
 * @interface SchedulePayload
 */
export interface SchedulePayload {
    /**
     * Cron Expression
     * @type {string}
     * @memberof SchedulePayload
     */
    cron?: string;
}

/**
 * Check if a given object implements the SchedulePayload interface.
 */
export function instanceOfSchedulePayload(value: object): boolean {
    return true;
}

export function SchedulePayloadFromJSON(json: any): SchedulePayload {
    return SchedulePayloadFromJSONTyped(json, false);
}

export function SchedulePayloadFromJSONTyped(json: any, ignoreDiscriminator: boolean): SchedulePayload {
    if (json == null) {
        return json;
    }
    return {
        
        'cron': json['cron'] == null ? undefined : json['cron'],
    };
}

export function SchedulePayloadToJSON(value?: SchedulePayload | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'cron': value['cron'],
    };
}

