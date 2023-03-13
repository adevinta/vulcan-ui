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
 * Token (default view)
 * @export
 * @interface Token
 */
export interface Token {
    /**
     * Creation time
     * @type {string}
     * @memberof Token
     */
    creationTime?: string;
    /**
     * Email
     * @type {string}
     * @memberof Token
     */
    email?: string;
    /**
     * Hash
     * @type {string}
     * @memberof Token
     */
    hash?: string;
    /**
     * Token
     * @type {string}
     * @memberof Token
     */
    token?: string;
}

/**
 * Check if a given object implements the Token interface.
 */
export function instanceOfToken(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function TokenFromJSON(json: any): Token {
    return TokenFromJSONTyped(json, false);
}

export function TokenFromJSONTyped(json: any, ignoreDiscriminator: boolean): Token {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'creationTime': !exists(json, 'creation_time') ? undefined : json['creation_time'],
        'email': !exists(json, 'email') ? undefined : json['email'],
        'hash': !exists(json, 'hash') ? undefined : json['hash'],
        'token': !exists(json, 'token') ? undefined : json['token'],
    };
}

export function TokenToJSON(value?: Token | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'creation_time': value.creationTime,
        'email': value.email,
        'hash': value.hash,
        'token': value.token,
    };
}

