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
import type { Program } from './Program';
import {
    ProgramFromJSON,
    ProgramFromJSONTyped,
    ProgramToJSON,
} from './Program';

/**
 * Scan (default view)
 * @export
 * @interface Scan
 */
export interface Scan {
    /**
     * Checks Count
     * @type {number}
     * @memberof Scan
     */
    checksCount?: number;
    /**
     * End Time
     * @type {Date}
     * @memberof Scan
     */
    endTime?: Date;
    /**
     * Scan ID
     * @type {string}
     * @memberof Scan
     */
    id?: string;
    /**
     * 
     * @type {Program}
     * @memberof Scan
     */
    program?: Program;
    /**
     * Progress
     * @type {number}
     * @memberof Scan
     */
    progress?: number;
    /**
     * Requested By
     * @type {string}
     * @memberof Scan
     */
    requestedBy?: string;
    /**
     * Scheduled Time
     * @type {Date}
     * @memberof Scan
     */
    scheduledTime?: Date;
    /**
     * Start Time
     * @type {Date}
     * @memberof Scan
     */
    startTime?: Date;
    /**
     * Status
     * @type {string}
     * @memberof Scan
     */
    status?: string;
}

/**
 * Check if a given object implements the Scan interface.
 */
export function instanceOfScan(value: object): boolean {
    return true;
}

export function ScanFromJSON(json: any): Scan {
    return ScanFromJSONTyped(json, false);
}

export function ScanFromJSONTyped(json: any, ignoreDiscriminator: boolean): Scan {
    if (json == null) {
        return json;
    }
    return {
        
        'checksCount': json['checks_count'] == null ? undefined : json['checks_count'],
        'endTime': json['end_time'] == null ? undefined : (new Date(json['end_time'])),
        'id': json['id'] == null ? undefined : json['id'],
        'program': json['program'] == null ? undefined : ProgramFromJSON(json['program']),
        'progress': json['progress'] == null ? undefined : json['progress'],
        'requestedBy': json['requested_by'] == null ? undefined : json['requested_by'],
        'scheduledTime': json['scheduled_time'] == null ? undefined : (new Date(json['scheduled_time'])),
        'startTime': json['start_time'] == null ? undefined : (new Date(json['start_time'])),
        'status': json['status'] == null ? undefined : json['status'],
    };
}

export function ScanToJSON(value?: Scan | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'checks_count': value['checksCount'],
        'end_time': value['endTime'] == null ? undefined : ((value['endTime']).toISOString()),
        'id': value['id'],
        'program': ProgramToJSON(value['program']),
        'progress': value['progress'],
        'requested_by': value['requestedBy'],
        'scheduled_time': value['scheduledTime'] == null ? undefined : ((value['scheduledTime']).toISOString()),
        'start_time': value['startTime'] == null ? undefined : ((value['startTime']).toISOString()),
        'status': value['status'],
    };
}

