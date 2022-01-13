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
 * Policy Setting (default view)
 * @export
 * @interface Policysetting
 */
export interface Policysetting {
    /**
     * Check Type Name
     * @type {string}
     * @memberof Policysetting
     */
    checktypeName?: string;
    /**
     * Policy ID
     * @type {string}
     * @memberof Policysetting
     */
    id?: string;
    /**
     * options
     * @type {string}
     * @memberof Policysetting
     */
    options?: string;
}

export function PolicysettingFromJSON(json: any): Policysetting {
    return PolicysettingFromJSONTyped(json, false);
}

export function PolicysettingFromJSONTyped(json: any, ignoreDiscriminator: boolean): Policysetting {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'checktypeName': !exists(json, 'checktype_name') ? undefined : json['checktype_name'],
        'id': !exists(json, 'id') ? undefined : json['id'],
        'options': !exists(json, 'options') ? undefined : json['options'],
    };
}

export function PolicysettingToJSON(value?: Policysetting | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'checktype_name': value.checktypeName,
        'id': value.id,
        'options': value.options,
    };
}

