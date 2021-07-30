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
 * 
 * @export
 * @interface AssetAnnotationDeleteRequest
 */
export interface AssetAnnotationDeleteRequest {
    /**
     * 
     * @type {Array<string>}
     * @memberof AssetAnnotationDeleteRequest
     */
    annotations?: Array<string>;
}

export function AssetAnnotationDeleteRequestFromJSON(json: any): AssetAnnotationDeleteRequest {
    return AssetAnnotationDeleteRequestFromJSONTyped(json, false);
}

export function AssetAnnotationDeleteRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): AssetAnnotationDeleteRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'annotations': !exists(json, 'annotations') ? undefined : json['annotations'],
    };
}

export function AssetAnnotationDeleteRequestToJSON(value?: AssetAnnotationDeleteRequest | null): any {
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


