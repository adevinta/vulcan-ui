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
 * Finding Override (default view)
 * @export
 * @interface FindingOverride
 */
export interface FindingOverride {
    /**
     * Creation time
     * @type {Date}
     * @memberof FindingOverride
     */
    createdAt?: Date;
    /**
     * Finding ID
     * @type {string}
     * @memberof FindingOverride
     */
    findingId?: string;
    /**
     * Finding Override ID
     * @type {string}
     * @memberof FindingOverride
     */
    id?: string;
    /**
     * Complementary information
     * @type {string}
     * @memberof FindingOverride
     */
    notes?: string;
    /**
     * The status requested for the finding referenced by the finding_id field
     * @type {string}
     * @memberof FindingOverride
     */
    status?: string;
    /**
     * The previous status for the finding referenced by the finding_id field
     * @type {string}
     * @memberof FindingOverride
     */
    statusPrevious?: string;
    /**
     * The tag associated to the user/team who requested this override
     * @type {string}
     * @memberof FindingOverride
     */
    tag?: string;
    /**
     * User who requested the finding override
     * @type {string}
     * @memberof FindingOverride
     */
    user?: string;
}

export function FindingOverrideFromJSON(json: any): FindingOverride {
    return FindingOverrideFromJSONTyped(json, false);
}

export function FindingOverrideFromJSONTyped(json: any, ignoreDiscriminator: boolean): FindingOverride {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'createdAt': !exists(json, 'created_at') ? undefined : (new Date(json['created_at'])),
        'findingId': !exists(json, 'finding_id') ? undefined : json['finding_id'],
        'id': !exists(json, 'id') ? undefined : json['id'],
        'notes': !exists(json, 'notes') ? undefined : json['notes'],
        'status': !exists(json, 'status') ? undefined : json['status'],
        'statusPrevious': !exists(json, 'status_previous') ? undefined : json['status_previous'],
        'tag': !exists(json, 'tag') ? undefined : json['tag'],
        'user': !exists(json, 'user') ? undefined : json['user'],
    };
}

export function FindingOverrideToJSON(value?: FindingOverride | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'created_at': value.createdAt === undefined ? undefined : (value.createdAt.toISOString()),
        'finding_id': value.findingId,
        'id': value.id,
        'notes': value.notes,
        'status': value.status,
        'status_previous': value.statusPrevious,
        'tag': value.tag,
        'user': value.user,
    };
}


