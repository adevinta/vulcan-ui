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
 * @interface AssetAnnotationRequest
 */
export interface AssetAnnotationRequest {
    /**
     * 
     * @type {object}
     * @memberof AssetAnnotationRequest
     */
    annotations?: object;
}

/**
 * Check if a given object implements the AssetAnnotationRequest interface.
 */
export function instanceOfAssetAnnotationRequest(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function AssetAnnotationRequestFromJSON(json: any): AssetAnnotationRequest {
    return AssetAnnotationRequestFromJSONTyped(json, false);
}

export function AssetAnnotationRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): AssetAnnotationRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'annotations': !exists(json, 'annotations') ? undefined : json['annotations'],
    };
}

export function AssetAnnotationRequestToJSON(value?: AssetAnnotationRequest | null): any {
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

