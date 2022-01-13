/* tslint:disable */
/* eslint-disable */
/**
 * Vulcan API
 * Public API for Vulcan Vulnerability Scan Engine
 *
 * The version of the OpenAPI document: 
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
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

export function SchedulePayloadFromJSON(json: any): SchedulePayload {
    return SchedulePayloadFromJSONTyped(json, false);
}

export function SchedulePayloadFromJSONTyped(json: any, ignoreDiscriminator: boolean): SchedulePayload {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'cron': !exists(json, 'cron') ? undefined : json['cron'],
    };
}

export function SchedulePayloadToJSON(value?: SchedulePayload | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'cron': value.cron,
    };
}

