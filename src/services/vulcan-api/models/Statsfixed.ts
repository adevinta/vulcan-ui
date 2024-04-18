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
import type { Stats } from './Stats';
import {
    StatsFromJSON,
    StatsFromJSONTyped,
    StatsToJSON,
} from './Stats';

/**
 * Fixed issues stats (default view)
 * @export
 * @interface Statsfixed
 */
export interface Statsfixed {
    /**
     * 
     * @type {Stats}
     * @memberof Statsfixed
     */
    fixedIssues?: Stats;
}

/**
 * Check if a given object implements the Statsfixed interface.
 */
export function instanceOfStatsfixed(value: object): boolean {
    return true;
}

export function StatsfixedFromJSON(json: any): Statsfixed {
    return StatsfixedFromJSONTyped(json, false);
}

export function StatsfixedFromJSONTyped(json: any, ignoreDiscriminator: boolean): Statsfixed {
    if (json == null) {
        return json;
    }
    return {
        
        'fixedIssues': json['fixed_issues'] == null ? undefined : StatsFromJSON(json['fixed_issues']),
    };
}

export function StatsfixedToJSON(value?: Statsfixed | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'fixed_issues': StatsToJSON(value['fixedIssues']),
    };
}

