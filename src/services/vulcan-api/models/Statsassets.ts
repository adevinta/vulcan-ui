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
import type { Statstotal } from './Statstotal';
import {
    StatstotalFromJSON,
    StatstotalFromJSONTyped,
    StatstotalToJSON,
} from './Statstotal';

/**
 * Assets by severity stats (default view)
 * @export
 * @interface Statsassets
 */
export interface Statsassets {
    /**
     * 
     * @type {Statstotal}
     * @memberof Statsassets
     */
    assets?: Statstotal;
}

/**
 * Check if a given object implements the Statsassets interface.
 */
export function instanceOfStatsassets(value: object): boolean {
    return true;
}

export function StatsassetsFromJSON(json: any): Statsassets {
    return StatsassetsFromJSONTyped(json, false);
}

export function StatsassetsFromJSONTyped(json: any, ignoreDiscriminator: boolean): Statsassets {
    if (json == null) {
        return json;
    }
    return {
        
        'assets': json['assets'] == null ? undefined : StatstotalFromJSON(json['assets']),
    };
}

export function StatsassetsToJSON(value?: Statsassets | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'assets': StatstotalToJSON(value['assets']),
    };
}

