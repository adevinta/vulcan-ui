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
import type { FindingsTarget } from './FindingsTarget';
import {
    FindingsTargetFromJSON,
    FindingsTargetFromJSONTyped,
    FindingsTargetToJSON,
} from './FindingsTarget';
import type { Pagination } from './Pagination';
import {
    PaginationFromJSON,
    PaginationFromJSONTyped,
    PaginationToJSON,
} from './Pagination';

/**
 * Findings by Target list (default view)
 * @export
 * @interface FindingsTargetsList
 */
export interface FindingsTargetsList {
    /**
     * 
     * @type {Pagination}
     * @memberof FindingsTargetsList
     */
    pagination?: Pagination;
    /**
     * Findings_targetCollection is the media type for an array of Findings_target (default view)
     * @type {Array<FindingsTarget>}
     * @memberof FindingsTargetsList
     */
    targets?: Array<FindingsTarget>;
}

/**
 * Check if a given object implements the FindingsTargetsList interface.
 */
export function instanceOfFindingsTargetsList(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function FindingsTargetsListFromJSON(json: any): FindingsTargetsList {
    return FindingsTargetsListFromJSONTyped(json, false);
}

export function FindingsTargetsListFromJSONTyped(json: any, ignoreDiscriminator: boolean): FindingsTargetsList {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'pagination': !exists(json, 'pagination') ? undefined : PaginationFromJSON(json['pagination']),
        'targets': !exists(json, 'targets') ? undefined : ((json['targets'] as Array<any>).map(FindingsTargetFromJSON)),
    };
}

export function FindingsTargetsListToJSON(value?: FindingsTargetsList | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'pagination': PaginationToJSON(value.pagination),
        'targets': value.targets === undefined ? undefined : ((value.targets as Array<any>).map(FindingsTargetToJSON)),
    };
}

