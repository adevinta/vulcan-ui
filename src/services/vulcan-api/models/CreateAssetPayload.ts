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
import type { AssetPayload } from './AssetPayload';
import {
    AssetPayloadFromJSON,
    AssetPayloadFromJSONTyped,
    AssetPayloadToJSON,
} from './AssetPayload';

/**
 * 
 * @export
 * @interface CreateAssetPayload
 */
export interface CreateAssetPayload {
    /**
     * 
     * @type {{ [key: string]: any; }}
     * @memberof CreateAssetPayload
     */
    annotations?: { [key: string]: any; };
    /**
     * 
     * @type {Array<AssetPayload>}
     * @memberof CreateAssetPayload
     */
    assets: Array<AssetPayload>;
    /**
     * 
     * @type {Array<string>}
     * @memberof CreateAssetPayload
     */
    groups?: Array<string>;
}

/**
 * Check if a given object implements the CreateAssetPayload interface.
 */
export function instanceOfCreateAssetPayload(value: object): boolean {
    if (!('assets' in value)) return false;
    return true;
}

export function CreateAssetPayloadFromJSON(json: any): CreateAssetPayload {
    return CreateAssetPayloadFromJSONTyped(json, false);
}

export function CreateAssetPayloadFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateAssetPayload {
    if (json == null) {
        return json;
    }
    return {
        
        'annotations': json['annotations'] == null ? undefined : json['annotations'],
        'assets': ((json['assets'] as Array<any>).map(AssetPayloadFromJSON)),
        'groups': json['groups'] == null ? undefined : json['groups'],
    };
}

export function CreateAssetPayloadToJSON(value?: CreateAssetPayload | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'annotations': value['annotations'],
        'assets': ((value['assets'] as Array<any>).map(AssetPayloadToJSON)),
        'groups': value['groups'],
    };
}

