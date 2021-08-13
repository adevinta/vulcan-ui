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
import {
    Statsaverages,
    StatsaveragesFromJSON,
    StatsaveragesFromJSONTyped,
    StatsaveragesToJSON,
} from './';

/**
 * Exposure stats (default view)
 * @export
 * @interface Exposure
 */
export interface Exposure {
    /**
     * 
     * @type {Statsaverages}
     * @memberof Exposure
     */
    exposure?: Statsaverages;
}

export function ExposureFromJSON(json: any): Exposure {
    return ExposureFromJSONTyped(json, false);
}

export function ExposureFromJSONTyped(json: any, ignoreDiscriminator: boolean): Exposure {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'exposure': !exists(json, 'exposure') ? undefined : StatsaveragesFromJSON(json['exposure']),
    };
}

export function ExposureToJSON(value?: Exposure | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'exposure': StatsaveragesToJSON(value.exposure),
    };
}

