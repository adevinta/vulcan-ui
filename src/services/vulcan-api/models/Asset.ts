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
    Assettype,
    AssettypeFromJSON,
    AssettypeFromJSONTyped,
    AssettypeToJSON,
} from './';

/**
 * Asset (default view)
 * @export
 * @interface Asset
 */
export interface Asset {
    /**
     * Alias
     * @type {string}
     * @memberof Asset
     */
    alias?: string;
    /**
     * 
     * @type {object}
     * @memberof Asset
     */
    annotations?: object;
    /**
     * Classified At
     * @type {string}
     * @memberof Asset
     */
    classifiedAt?: string;
    /**
     * Environmental CVSS
     * @type {string}
     * @memberof Asset
     */
    environmentalCvss?: string;
    /**
     * Asset ID
     * @type {string}
     * @memberof Asset
     */
    id?: string;
    /**
     * Identifier
     * @type {string}
     * @memberof Asset
     */
    identifier?: string;
    /**
     * Options
     * @type {string}
     * @memberof Asset
     */
    options?: string;
    /**
     * Rolfp plus scope vector
     * @type {string}
     * @memberof Asset
     */
    rolfp?: string;
    /**
     * Scannable
     * @type {boolean}
     * @memberof Asset
     */
    scannable?: boolean;
    /**
     * 
     * @type {Assettype}
     * @memberof Asset
     */
    type?: Assettype;
}

export function AssetFromJSON(json: any): Asset {
    return AssetFromJSONTyped(json, false);
}

export function AssetFromJSONTyped(json: any, ignoreDiscriminator: boolean): Asset {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'alias': !exists(json, 'alias') ? undefined : json['alias'],
        'annotations': !exists(json, 'annotations') ? undefined : json['annotations'],
        'classifiedAt': !exists(json, 'classified_at') ? undefined : json['classified_at'],
        'environmentalCvss': !exists(json, 'environmental_cvss') ? undefined : json['environmental_cvss'],
        'id': !exists(json, 'id') ? undefined : json['id'],
        'identifier': !exists(json, 'identifier') ? undefined : json['identifier'],
        'options': !exists(json, 'options') ? undefined : json['options'],
        'rolfp': !exists(json, 'rolfp') ? undefined : json['rolfp'],
        'scannable': !exists(json, 'scannable') ? undefined : json['scannable'],
        'type': !exists(json, 'type') ? undefined : AssettypeFromJSON(json['type']),
    };
}

export function AssetToJSON(value?: Asset | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'alias': value.alias,
        'annotations': value.annotations,
        'classified_at': value.classifiedAt,
        'environmental_cvss': value.environmentalCvss,
        'id': value.id,
        'identifier': value.identifier,
        'options': value.options,
        'rolfp': value.rolfp,
        'scannable': value.scannable,
        'type': AssettypeToJSON(value.type),
    };
}


