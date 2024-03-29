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
 * @interface FindingTicketPayload
 */
export interface FindingTicketPayload {
    /**
     * Description
     * @type {string}
     * @memberof FindingTicketPayload
     */
    description?: string;
    /**
     * Summary
     * @type {string}
     * @memberof FindingTicketPayload
     */
    summary: string;
}

/**
 * Check if a given object implements the FindingTicketPayload interface.
 */
export function instanceOfFindingTicketPayload(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "summary" in value;

    return isInstance;
}

export function FindingTicketPayloadFromJSON(json: any): FindingTicketPayload {
    return FindingTicketPayloadFromJSONTyped(json, false);
}

export function FindingTicketPayloadFromJSONTyped(json: any, ignoreDiscriminator: boolean): FindingTicketPayload {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'description': !exists(json, 'description') ? undefined : json['description'],
        'summary': json['summary'],
    };
}

export function FindingTicketPayloadToJSON(value?: FindingTicketPayload | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'description': value.description,
        'summary': value.summary,
    };
}

