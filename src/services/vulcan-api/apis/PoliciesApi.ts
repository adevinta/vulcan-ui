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
  Policy,
  PolicyPayload,
  PolicyUpdatePayload,
} from '../models/index';
import {
    PolicyFromJSON,
    PolicyToJSON,
    PolicyPayloadFromJSON,
    PolicyPayloadToJSON,
    PolicyUpdatePayloadFromJSON,
    PolicyUpdatePayloadToJSON,
} from '../models/index';

export interface PoliciesCreateRequest {
    teamId: string;
    payload: PolicyPayload;
}

export interface PoliciesDeleteRequest {
    policyId: string;
    teamId: string;
}

export interface PoliciesListRequest {
    teamId: string;
}

export interface PoliciesShowRequest {
    policyId: string;
    teamId: string;
}

export interface PoliciesUpdateRequest {
    policyId: string;
    teamId: string;
    payload: PolicyUpdatePayload;
}

/**
 * 
 */
export class PoliciesApi extends runtime.BaseAPI {

    /**
     * Create a new policy.
     * create policies
     */
    async policiesCreateRaw(requestParameters: PoliciesCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Policy>> {
        if (requestParameters['teamId'] == null) {
            throw new runtime.RequiredError(
                'teamId',
                'Required parameter "teamId" was null or undefined when calling policiesCreate().'
            );
        }

        if (requestParameters['payload'] == null) {
            throw new runtime.RequiredError(
                'payload',
                'Required parameter "payload" was null or undefined when calling policiesCreate().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["authorization"] = await this.configuration.apiKey("authorization"); // Bearer authentication
        }

        const response = await this.request({
            path: `/teams/{team_id}/policies`.replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters['teamId']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PolicyPayloadToJSON(requestParameters['payload']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PolicyFromJSON(jsonValue));
    }

    /**
     * Create a new policy.
     * create policies
     */
    async policiesCreate(requestParameters: PoliciesCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Policy> {
        const response = await this.policiesCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete a policy.
     * delete policies
     */
    async policiesDeleteRaw(requestParameters: PoliciesDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['policyId'] == null) {
            throw new runtime.RequiredError(
                'policyId',
                'Required parameter "policyId" was null or undefined when calling policiesDelete().'
            );
        }

        if (requestParameters['teamId'] == null) {
            throw new runtime.RequiredError(
                'teamId',
                'Required parameter "teamId" was null or undefined when calling policiesDelete().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["authorization"] = await this.configuration.apiKey("authorization"); // Bearer authentication
        }

        const response = await this.request({
            path: `/teams/{team_id}/policies/{policy_id}`.replace(`{${"policy_id"}}`, encodeURIComponent(String(requestParameters['policyId']))).replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters['teamId']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete a policy.
     * delete policies
     */
    async policiesDelete(requestParameters: PoliciesDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.policiesDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * List all policies from a team.
     * list policies
     */
    async policiesListRaw(requestParameters: PoliciesListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Policy>>> {
        if (requestParameters['teamId'] == null) {
            throw new runtime.RequiredError(
                'teamId',
                'Required parameter "teamId" was null or undefined when calling policiesList().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["authorization"] = await this.configuration.apiKey("authorization"); // Bearer authentication
        }

        const response = await this.request({
            path: `/teams/{team_id}/policies`.replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters['teamId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(PolicyFromJSON));
    }

    /**
     * List all policies from a team.
     * list policies
     */
    async policiesList(requestParameters: PoliciesListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Policy>> {
        const response = await this.policiesListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Show information about a policy.
     * show policies
     */
    async policiesShowRaw(requestParameters: PoliciesShowRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Policy>> {
        if (requestParameters['policyId'] == null) {
            throw new runtime.RequiredError(
                'policyId',
                'Required parameter "policyId" was null or undefined when calling policiesShow().'
            );
        }

        if (requestParameters['teamId'] == null) {
            throw new runtime.RequiredError(
                'teamId',
                'Required parameter "teamId" was null or undefined when calling policiesShow().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["authorization"] = await this.configuration.apiKey("authorization"); // Bearer authentication
        }

        const response = await this.request({
            path: `/teams/{team_id}/policies/{policy_id}`.replace(`{${"policy_id"}}`, encodeURIComponent(String(requestParameters['policyId']))).replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters['teamId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PolicyFromJSON(jsonValue));
    }

    /**
     * Show information about a policy.
     * show policies
     */
    async policiesShow(requestParameters: PoliciesShowRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Policy> {
        const response = await this.policiesShowRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Update information about a policy.
     * update policies
     */
    async policiesUpdateRaw(requestParameters: PoliciesUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Policy>> {
        if (requestParameters['policyId'] == null) {
            throw new runtime.RequiredError(
                'policyId',
                'Required parameter "policyId" was null or undefined when calling policiesUpdate().'
            );
        }

        if (requestParameters['teamId'] == null) {
            throw new runtime.RequiredError(
                'teamId',
                'Required parameter "teamId" was null or undefined when calling policiesUpdate().'
            );
        }

        if (requestParameters['payload'] == null) {
            throw new runtime.RequiredError(
                'payload',
                'Required parameter "payload" was null or undefined when calling policiesUpdate().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["authorization"] = await this.configuration.apiKey("authorization"); // Bearer authentication
        }

        const response = await this.request({
            path: `/teams/{team_id}/policies/{policy_id}`.replace(`{${"policy_id"}}`, encodeURIComponent(String(requestParameters['policyId']))).replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters['teamId']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PolicyUpdatePayloadToJSON(requestParameters['payload']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PolicyFromJSON(jsonValue));
    }

    /**
     * Update information about a policy.
     * update policies
     */
    async policiesUpdate(requestParameters: PoliciesUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Policy> {
        const response = await this.policiesUpdateRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
