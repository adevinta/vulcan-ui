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
 * @interface PolicySettingUploadPayload
 */
export interface PolicySettingUploadPayload {
    /**
     * Check Type Name
     * @type {string}
     * @memberof PolicySettingUploadPayload
     */
    checktypeName?: string;
    /**
     * Options
     * @type {string}
     * @memberof PolicySettingUploadPayload
     */
    options?: string;
}

/**
 * Check if a given object implements the PolicySettingUploadPayload interface.
 */
export function instanceOfPolicySettingUploadPayload(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function PolicySettingUploadPayloadFromJSON(json: any): PolicySettingUploadPayload {
    return PolicySettingUploadPayloadFromJSONTyped(json, false);
}

export function PolicySettingUploadPayloadFromJSONTyped(json: any, ignoreDiscriminator: boolean): PolicySettingUploadPayload {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'checktypeName': !exists(json, 'checktype_name') ? undefined : json['checktype_name'],
        'options': !exists(json, 'options') ? undefined : json['options'],
    };
}

export function PolicySettingUploadPayloadToJSON(value?: PolicySettingUploadPayload | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'checktype_name': value.checktypeName,
        'options': value.options,
    };
}

