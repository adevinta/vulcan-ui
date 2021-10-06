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
 * Asset Annotations (default view)
 * @export
 * @interface AssetannotationsResponse
 */
export interface AssetannotationsResponse {
    /**
     * 
     * @type {object}
     * @memberof AssetannotationsResponse
     */
    annotations?: object;
}

export function AssetannotationsResponseFromJSON(json: any): AssetannotationsResponse {
    return AssetannotationsResponseFromJSONTyped(json, false);
}

export function AssetannotationsResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): AssetannotationsResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'annotations': !exists(json, 'annotations') ? undefined : json['annotations'],
    };
}

export function AssetannotationsResponseToJSON(value?: AssetannotationsResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'annotations': value.annotations,
    };
}


