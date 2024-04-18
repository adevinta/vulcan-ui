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
 * Finding Ticket (default view)
 * @export
 * @interface FindingTicket
 */
export interface FindingTicket {
    /**
     * Link to the ticket
     * @type {string}
     * @memberof FindingTicket
     */
    urlTracker?: string;
}

/**
 * Check if a given object implements the FindingTicket interface.
 */
export function instanceOfFindingTicket(value: object): boolean {
    return true;
}

export function FindingTicketFromJSON(json: any): FindingTicket {
    return FindingTicketFromJSONTyped(json, false);
}

export function FindingTicketFromJSONTyped(json: any, ignoreDiscriminator: boolean): FindingTicket {
    if (json == null) {
        return json;
    }
    return {
        
        'urlTracker': json['url_tracker'] == null ? undefined : json['url_tracker'],
    };
}

export function FindingTicketToJSON(value?: FindingTicket | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'url_tracker': value['urlTracker'],
    };
}

