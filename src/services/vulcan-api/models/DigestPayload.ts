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

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface DigestPayload
 */
export interface DigestPayload {
    /**
     * End Date
     * @type {string}
     * @memberof DigestPayload
     */
    endDate?: string;
    /**
     * Start Date
     * @type {string}
     * @memberof DigestPayload
     */
    startDate?: string;
}

/**
 * Check if a given object implements the DigestPayload interface.
 */
export function instanceOfDigestPayload(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function DigestPayloadFromJSON(json: any): DigestPayload {
    return DigestPayloadFromJSONTyped(json, false);
}

export function DigestPayloadFromJSONTyped(json: any, ignoreDiscriminator: boolean): DigestPayload {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'endDate': !exists(json, 'end_date') ? undefined : json['end_date'],
        'startDate': !exists(json, 'start_date') ? undefined : json['start_date'],
    };
}

export function DigestPayloadToJSON(value?: DigestPayload | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'end_date': value.endDate,
        'start_date': value.startDate,
    };
}

