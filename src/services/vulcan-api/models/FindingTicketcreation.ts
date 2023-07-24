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
 * Finding Ticket Creation (default view)
 * @export
 * @interface FindingTicketcreation
 */
export interface FindingTicketcreation {
    /**
     * The previous status for the finding referenced by the finding_id field
     * @type {string}
     * @memberof FindingTicketcreation
     */
    description?: string;
    /**
     * Finding ID
     * @type {string}
     * @memberof FindingTicketcreation
     */
    findingId?: string;
    /**
     * The summary of the ticket
     * @type {string}
     * @memberof FindingTicketcreation
     */
    summary?: string;
    /**
     * The ID associated to the team who requested this ticket creation
     * @type {string}
     * @memberof FindingTicketcreation
     */
    teamId?: string;
    /**
     * Link to the ticket
     * @type {string}
     * @memberof FindingTicketcreation
     */
    urlTracker?: string;
}

/**
 * Check if a given object implements the FindingTicketcreation interface.
 */
export function instanceOfFindingTicketcreation(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function FindingTicketcreationFromJSON(json: any): FindingTicketcreation {
    return FindingTicketcreationFromJSONTyped(json, false);
}

export function FindingTicketcreationFromJSONTyped(json: any, ignoreDiscriminator: boolean): FindingTicketcreation {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'description': !exists(json, 'description') ? undefined : json['description'],
        'findingId': !exists(json, 'finding_id') ? undefined : json['finding_id'],
        'summary': !exists(json, 'summary') ? undefined : json['summary'],
        'teamId': !exists(json, 'team_id') ? undefined : json['team_id'],
        'urlTracker': !exists(json, 'url_tracker') ? undefined : json['url_tracker'],
    };
}

export function FindingTicketcreationToJSON(value?: FindingTicketcreation | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'description': value.description,
        'finding_id': value.findingId,
        'summary': value.summary,
        'team_id': value.teamId,
        'url_tracker': value.urlTracker,
    };
}
