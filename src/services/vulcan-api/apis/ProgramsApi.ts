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


import * as runtime from '../runtime';
import type {
  Program,
  ProgramPayload,
  ProgramUpdatePayload,
} from '../models/index';
import {
    ProgramFromJSON,
    ProgramToJSON,
    ProgramPayloadFromJSON,
    ProgramPayloadToJSON,
    ProgramUpdatePayloadFromJSON,
    ProgramUpdatePayloadToJSON,
} from '../models/index';

export interface ProgramsCreateRequest {
    teamId: string;
    payload: ProgramPayload;
}

export interface ProgramsDeleteRequest {
    programId: string;
    teamId: string;
}

export interface ProgramsListRequest {
    teamId: string;
}

export interface ProgramsShowRequest {
    programId: string;
    teamId: string;
}

export interface ProgramsUpdateRequest {
    programId: string;
    teamId: string;
    payload: ProgramUpdatePayload;
}

/**
 * 
 */
export class ProgramsApi extends runtime.BaseAPI {

    /**
     * Create a new program.
     * create programs
     */
    async programsCreateRaw(requestParameters: ProgramsCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Program>> {
        if (requestParameters['teamId'] == null) {
            throw new runtime.RequiredError(
                'teamId',
                'Required parameter "teamId" was null or undefined when calling programsCreate().'
            );
        }

        if (requestParameters['payload'] == null) {
            throw new runtime.RequiredError(
                'payload',
                'Required parameter "payload" was null or undefined when calling programsCreate().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["authorization"] = await this.configuration.apiKey("authorization"); // Bearer authentication
        }

        const response = await this.request({
            path: `/teams/{team_id}/programs`.replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters['teamId']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ProgramPayloadToJSON(requestParameters['payload']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProgramFromJSON(jsonValue));
    }

    /**
     * Create a new program.
     * create programs
     */
    async programsCreate(requestParameters: ProgramsCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Program> {
        const response = await this.programsCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete a program.
     * delete programs
     */
    async programsDeleteRaw(requestParameters: ProgramsDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['programId'] == null) {
            throw new runtime.RequiredError(
                'programId',
                'Required parameter "programId" was null or undefined when calling programsDelete().'
            );
        }

        if (requestParameters['teamId'] == null) {
            throw new runtime.RequiredError(
                'teamId',
                'Required parameter "teamId" was null or undefined when calling programsDelete().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["authorization"] = await this.configuration.apiKey("authorization"); // Bearer authentication
        }

        const response = await this.request({
            path: `/teams/{team_id}/programs/{program_id}`.replace(`{${"program_id"}}`, encodeURIComponent(String(requestParameters['programId']))).replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters['teamId']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete a program.
     * delete programs
     */
    async programsDelete(requestParameters: ProgramsDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.programsDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * List all programs from a team.
     * list programs
     */
    async programsListRaw(requestParameters: ProgramsListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Program>>> {
        if (requestParameters['teamId'] == null) {
            throw new runtime.RequiredError(
                'teamId',
                'Required parameter "teamId" was null or undefined when calling programsList().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["authorization"] = await this.configuration.apiKey("authorization"); // Bearer authentication
        }

        const response = await this.request({
            path: `/teams/{team_id}/programs`.replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters['teamId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ProgramFromJSON));
    }

    /**
     * List all programs from a team.
     * list programs
     */
    async programsList(requestParameters: ProgramsListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Program>> {
        const response = await this.programsListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Show information about a program.
     * show programs
     */
    async programsShowRaw(requestParameters: ProgramsShowRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Program>> {
        if (requestParameters['programId'] == null) {
            throw new runtime.RequiredError(
                'programId',
                'Required parameter "programId" was null or undefined when calling programsShow().'
            );
        }

        if (requestParameters['teamId'] == null) {
            throw new runtime.RequiredError(
                'teamId',
                'Required parameter "teamId" was null or undefined when calling programsShow().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["authorization"] = await this.configuration.apiKey("authorization"); // Bearer authentication
        }

        const response = await this.request({
            path: `/teams/{team_id}/programs/{program_id}`.replace(`{${"program_id"}}`, encodeURIComponent(String(requestParameters['programId']))).replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters['teamId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProgramFromJSON(jsonValue));
    }

    /**
     * Show information about a program.
     * show programs
     */
    async programsShow(requestParameters: ProgramsShowRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Program> {
        const response = await this.programsShowRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Update information about a program.
     * update programs
     */
    async programsUpdateRaw(requestParameters: ProgramsUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Program>> {
        if (requestParameters['programId'] == null) {
            throw new runtime.RequiredError(
                'programId',
                'Required parameter "programId" was null or undefined when calling programsUpdate().'
            );
        }

        if (requestParameters['teamId'] == null) {
            throw new runtime.RequiredError(
                'teamId',
                'Required parameter "teamId" was null or undefined when calling programsUpdate().'
            );
        }

        if (requestParameters['payload'] == null) {
            throw new runtime.RequiredError(
                'payload',
                'Required parameter "payload" was null or undefined when calling programsUpdate().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["authorization"] = await this.configuration.apiKey("authorization"); // Bearer authentication
        }

        const response = await this.request({
            path: `/teams/{team_id}/programs/{program_id}`.replace(`{${"program_id"}}`, encodeURIComponent(String(requestParameters['programId']))).replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters['teamId']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: ProgramUpdatePayloadToJSON(requestParameters['payload']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProgramFromJSON(jsonValue));
    }

    /**
     * Update information about a program.
     * update programs
     */
    async programsUpdate(requestParameters: ProgramsUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Program> {
        const response = await this.programsUpdateRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
