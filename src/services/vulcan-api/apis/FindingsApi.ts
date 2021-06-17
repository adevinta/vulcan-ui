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


import * as runtime from '../runtime';
import {
    Finding,
    FindingFromJSON,
    FindingToJSON,
    FindingOverwrite,
    FindingOverwriteFromJSON,
    FindingOverwriteToJSON,
    FindingOverwritePayload,
    FindingOverwritePayloadFromJSON,
    FindingOverwritePayloadToJSON,
    FindingsIssuesList,
    FindingsIssuesListFromJSON,
    FindingsIssuesListToJSON,
    FindingsList,
    FindingsListFromJSON,
    FindingsListToJSON,
    FindingsTargetsList,
    FindingsTargetsListFromJSON,
    FindingsTargetsListToJSON,
} from '../models';

export interface FindingsFindFindingRequest {
    findingId: string;
    teamId: string;
}

export interface FindingsFindFindingsFromAIssueRequest {
    issueId: string;
    teamId: string;
    atDate?: string;
    maxDate?: string;
    maxScore?: number;
    minDate?: string;
    minScore?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    status?: string;
}

export interface FindingsFindFindingsFromATargetRequest {
    targetId: string;
    teamId: string;
    atDate?: string;
    maxDate?: string;
    maxScore?: number;
    minDate?: string;
    minScore?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    status?: string;
}

export interface FindingsListFindingOverwritesRequest {
    findingId: string;
    teamId: string;
}

export interface FindingsListFindingsRequest {
    teamId: string;
    atDate?: string;
    identifier?: string;
    issueID?: string;
    maxDate?: string;
    maxScore?: number;
    minDate?: string;
    minScore?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    status?: string;
    targetID?: string;
}

export interface FindingsListFindingsIssuesRequest {
    teamId: string;
    atDate?: string;
    maxDate?: string;
    minDate?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    status?: string;
    targetID?: string;
}

export interface FindingsListFindingsTargetsRequest {
    teamId: string;
    atDate?: string;
    issueID?: string;
    maxDate?: string;
    minDate?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    status?: string;
}

export interface FindingsSubmitAFindingOverwriteRequest {
    findingId: string;
    teamId: string;
    payload: FindingOverwritePayload;
}

/**
 * 
 */
export class FindingsApi extends runtime.BaseAPI {

    /**
     * Find a finding.
     * Find finding findings
     */
    async findingsFindFindingRaw(requestParameters: FindingsFindFindingRequest): Promise<runtime.ApiResponse<Finding>> {
        if (requestParameters.findingId === null || requestParameters.findingId === undefined) {
            throw new runtime.RequiredError('findingId','Required parameter requestParameters.findingId was null or undefined when calling findingsFindFinding.');
        }

        if (requestParameters.teamId === null || requestParameters.teamId === undefined) {
            throw new runtime.RequiredError('teamId','Required parameter requestParameters.teamId was null or undefined when calling findingsFindFinding.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["authorization"] = this.configuration.apiKey("authorization"); // Bearer authentication
        }

        const response = await this.request({
            path: `/teams/{team_id}/findings/{finding_id}`.replace(`{${"finding_id"}}`, encodeURIComponent(String(requestParameters.findingId))).replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters.teamId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => FindingFromJSON(jsonValue));
    }

    /**
     * Find a finding.
     * Find finding findings
     */
    async findingsFindFinding(requestParameters: FindingsFindFindingRequest): Promise<Finding> {
        const response = await this.findingsFindFindingRaw(requestParameters);
        return await response.value();
    }

    /**
     * Find all findings from a team and issue.
     * Find findings from a Issue findings
     */
    async findingsFindFindingsFromAIssueRaw(requestParameters: FindingsFindFindingsFromAIssueRequest): Promise<runtime.ApiResponse<FindingsList>> {
        if (requestParameters.issueId === null || requestParameters.issueId === undefined) {
            throw new runtime.RequiredError('issueId','Required parameter requestParameters.issueId was null or undefined when calling findingsFindFindingsFromAIssue.');
        }

        if (requestParameters.teamId === null || requestParameters.teamId === undefined) {
            throw new runtime.RequiredError('teamId','Required parameter requestParameters.teamId was null or undefined when calling findingsFindFindingsFromAIssue.');
        }

        const queryParameters: any = {};

        if (requestParameters.atDate !== undefined) {
            queryParameters['atDate'] = requestParameters.atDate;
        }

        if (requestParameters.maxDate !== undefined) {
            queryParameters['maxDate'] = requestParameters.maxDate;
        }

        if (requestParameters.maxScore !== undefined) {
            queryParameters['maxScore'] = requestParameters.maxScore;
        }

        if (requestParameters.minDate !== undefined) {
            queryParameters['minDate'] = requestParameters.minDate;
        }

        if (requestParameters.minScore !== undefined) {
            queryParameters['minScore'] = requestParameters.minScore;
        }

        if (requestParameters.page !== undefined) {
            queryParameters['page'] = requestParameters.page;
        }

        if (requestParameters.size !== undefined) {
            queryParameters['size'] = requestParameters.size;
        }

        if (requestParameters.sortBy !== undefined) {
            queryParameters['sortBy'] = requestParameters.sortBy;
        }

        if (requestParameters.status !== undefined) {
            queryParameters['status'] = requestParameters.status;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["authorization"] = this.configuration.apiKey("authorization"); // Bearer authentication
        }

        const response = await this.request({
            path: `/teams/{team_id}/findings/issues/{issue_id}`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters.issueId))).replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters.teamId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => FindingsListFromJSON(jsonValue));
    }

    /**
     * Find all findings from a team and issue.
     * Find findings from a Issue findings
     */
    async findingsFindFindingsFromAIssue(requestParameters: FindingsFindFindingsFromAIssueRequest): Promise<FindingsList> {
        const response = await this.findingsFindFindingsFromAIssueRaw(requestParameters);
        return await response.value();
    }

    /**
     * Find all findings from a team and target.
     * Find findings from a Target findings
     */
    async findingsFindFindingsFromATargetRaw(requestParameters: FindingsFindFindingsFromATargetRequest): Promise<runtime.ApiResponse<FindingsList>> {
        if (requestParameters.targetId === null || requestParameters.targetId === undefined) {
            throw new runtime.RequiredError('targetId','Required parameter requestParameters.targetId was null or undefined when calling findingsFindFindingsFromATarget.');
        }

        if (requestParameters.teamId === null || requestParameters.teamId === undefined) {
            throw new runtime.RequiredError('teamId','Required parameter requestParameters.teamId was null or undefined when calling findingsFindFindingsFromATarget.');
        }

        const queryParameters: any = {};

        if (requestParameters.atDate !== undefined) {
            queryParameters['atDate'] = requestParameters.atDate;
        }

        if (requestParameters.maxDate !== undefined) {
            queryParameters['maxDate'] = requestParameters.maxDate;
        }

        if (requestParameters.maxScore !== undefined) {
            queryParameters['maxScore'] = requestParameters.maxScore;
        }

        if (requestParameters.minDate !== undefined) {
            queryParameters['minDate'] = requestParameters.minDate;
        }

        if (requestParameters.minScore !== undefined) {
            queryParameters['minScore'] = requestParameters.minScore;
        }

        if (requestParameters.page !== undefined) {
            queryParameters['page'] = requestParameters.page;
        }

        if (requestParameters.size !== undefined) {
            queryParameters['size'] = requestParameters.size;
        }

        if (requestParameters.sortBy !== undefined) {
            queryParameters['sortBy'] = requestParameters.sortBy;
        }

        if (requestParameters.status !== undefined) {
            queryParameters['status'] = requestParameters.status;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["authorization"] = this.configuration.apiKey("authorization"); // Bearer authentication
        }

        const response = await this.request({
            path: `/teams/{team_id}/findings/targets/{target_id}`.replace(`{${"target_id"}}`, encodeURIComponent(String(requestParameters.targetId))).replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters.teamId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => FindingsListFromJSON(jsonValue));
    }

    /**
     * Find all findings from a team and target.
     * Find findings from a Target findings
     */
    async findingsFindFindingsFromATarget(requestParameters: FindingsFindFindingsFromATargetRequest): Promise<FindingsList> {
        const response = await this.findingsFindFindingsFromATargetRaw(requestParameters);
        return await response.value();
    }

    /**
     * List Finding Overwrites.
     * List Finding Overwrites findings
     */
    async findingsListFindingOverwritesRaw(requestParameters: FindingsListFindingOverwritesRequest): Promise<runtime.ApiResponse<Array<FindingOverwrite>>> {
        if (requestParameters.findingId === null || requestParameters.findingId === undefined) {
            throw new runtime.RequiredError('findingId','Required parameter requestParameters.findingId was null or undefined when calling findingsListFindingOverwrites.');
        }

        if (requestParameters.teamId === null || requestParameters.teamId === undefined) {
            throw new runtime.RequiredError('teamId','Required parameter requestParameters.teamId was null or undefined when calling findingsListFindingOverwrites.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["authorization"] = this.configuration.apiKey("authorization"); // Bearer authentication
        }

        const response = await this.request({
            path: `/teams/{team_id}/findings/{finding_id}/overwrites`.replace(`{${"finding_id"}}`, encodeURIComponent(String(requestParameters.findingId))).replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters.teamId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(FindingOverwriteFromJSON));
    }

    /**
     * List Finding Overwrites.
     * List Finding Overwrites findings
     */
    async findingsListFindingOverwrites(requestParameters: FindingsListFindingOverwritesRequest): Promise<Array<FindingOverwrite>> {
        const response = await this.findingsListFindingOverwritesRaw(requestParameters);
        return await response.value();
    }

    /**
     * List all findings from a team.
     * list findings findings
     */
    async findingsListFindingsRaw(requestParameters: FindingsListFindingsRequest): Promise<runtime.ApiResponse<FindingsList>> {
        if (requestParameters.teamId === null || requestParameters.teamId === undefined) {
            throw new runtime.RequiredError('teamId','Required parameter requestParameters.teamId was null or undefined when calling findingsListFindings.');
        }

        const queryParameters: any = {};

        if (requestParameters.atDate !== undefined) {
            queryParameters['atDate'] = requestParameters.atDate;
        }

        if (requestParameters.identifier !== undefined) {
            queryParameters['identifier'] = requestParameters.identifier;
        }

        if (requestParameters.issueID !== undefined) {
            queryParameters['issueID'] = requestParameters.issueID;
        }

        if (requestParameters.maxDate !== undefined) {
            queryParameters['maxDate'] = requestParameters.maxDate;
        }

        if (requestParameters.maxScore !== undefined) {
            queryParameters['maxScore'] = requestParameters.maxScore;
        }

        if (requestParameters.minDate !== undefined) {
            queryParameters['minDate'] = requestParameters.minDate;
        }

        if (requestParameters.minScore !== undefined) {
            queryParameters['minScore'] = requestParameters.minScore;
        }

        if (requestParameters.page !== undefined) {
            queryParameters['page'] = requestParameters.page;
        }

        if (requestParameters.size !== undefined) {
            queryParameters['size'] = requestParameters.size;
        }

        if (requestParameters.sortBy !== undefined) {
            queryParameters['sortBy'] = requestParameters.sortBy;
        }

        if (requestParameters.status !== undefined) {
            queryParameters['status'] = requestParameters.status;
        }

        if (requestParameters.targetID !== undefined) {
            queryParameters['targetID'] = requestParameters.targetID;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["authorization"] = this.configuration.apiKey("authorization"); // Bearer authentication
        }

        const response = await this.request({
            path: `/teams/{team_id}/findings`.replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters.teamId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => FindingsListFromJSON(jsonValue));
    }

    /**
     * List all findings from a team.
     * list findings findings
     */
    async findingsListFindings(requestParameters: FindingsListFindingsRequest): Promise<FindingsList> {
        const response = await this.findingsListFindingsRaw(requestParameters);
        return await response.value();
    }

    /**
     * List number of findings and max score per issue.
     * list findings issues findings
     */
    async findingsListFindingsIssuesRaw(requestParameters: FindingsListFindingsIssuesRequest): Promise<runtime.ApiResponse<FindingsIssuesList>> {
        if (requestParameters.teamId === null || requestParameters.teamId === undefined) {
            throw new runtime.RequiredError('teamId','Required parameter requestParameters.teamId was null or undefined when calling findingsListFindingsIssues.');
        }

        const queryParameters: any = {};

        if (requestParameters.atDate !== undefined) {
            queryParameters['atDate'] = requestParameters.atDate;
        }

        if (requestParameters.maxDate !== undefined) {
            queryParameters['maxDate'] = requestParameters.maxDate;
        }

        if (requestParameters.minDate !== undefined) {
            queryParameters['minDate'] = requestParameters.minDate;
        }

        if (requestParameters.page !== undefined) {
            queryParameters['page'] = requestParameters.page;
        }

        if (requestParameters.size !== undefined) {
            queryParameters['size'] = requestParameters.size;
        }

        if (requestParameters.sortBy !== undefined) {
            queryParameters['sortBy'] = requestParameters.sortBy;
        }

        if (requestParameters.status !== undefined) {
            queryParameters['status'] = requestParameters.status;
        }

        if (requestParameters.targetID !== undefined) {
            queryParameters['targetID'] = requestParameters.targetID;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["authorization"] = this.configuration.apiKey("authorization"); // Bearer authentication
        }

        const response = await this.request({
            path: `/teams/{team_id}/findings/issues`.replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters.teamId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => FindingsIssuesListFromJSON(jsonValue));
    }

    /**
     * List number of findings and max score per issue.
     * list findings issues findings
     */
    async findingsListFindingsIssues(requestParameters: FindingsListFindingsIssuesRequest): Promise<FindingsIssuesList> {
        const response = await this.findingsListFindingsIssuesRaw(requestParameters);
        return await response.value();
    }

    /**
     * List number of findings and max score per target.
     * list findings targets findings
     */
    async findingsListFindingsTargetsRaw(requestParameters: FindingsListFindingsTargetsRequest): Promise<runtime.ApiResponse<FindingsTargetsList>> {
        if (requestParameters.teamId === null || requestParameters.teamId === undefined) {
            throw new runtime.RequiredError('teamId','Required parameter requestParameters.teamId was null or undefined when calling findingsListFindingsTargets.');
        }

        const queryParameters: any = {};

        if (requestParameters.atDate !== undefined) {
            queryParameters['atDate'] = requestParameters.atDate;
        }

        if (requestParameters.issueID !== undefined) {
            queryParameters['issueID'] = requestParameters.issueID;
        }

        if (requestParameters.maxDate !== undefined) {
            queryParameters['maxDate'] = requestParameters.maxDate;
        }

        if (requestParameters.minDate !== undefined) {
            queryParameters['minDate'] = requestParameters.minDate;
        }

        if (requestParameters.page !== undefined) {
            queryParameters['page'] = requestParameters.page;
        }

        if (requestParameters.size !== undefined) {
            queryParameters['size'] = requestParameters.size;
        }

        if (requestParameters.sortBy !== undefined) {
            queryParameters['sortBy'] = requestParameters.sortBy;
        }

        if (requestParameters.status !== undefined) {
            queryParameters['status'] = requestParameters.status;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["authorization"] = this.configuration.apiKey("authorization"); // Bearer authentication
        }

        const response = await this.request({
            path: `/teams/{team_id}/findings/targets`.replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters.teamId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => FindingsTargetsListFromJSON(jsonValue));
    }

    /**
     * List number of findings and max score per target.
     * list findings targets findings
     */
    async findingsListFindingsTargets(requestParameters: FindingsListFindingsTargetsRequest): Promise<FindingsTargetsList> {
        const response = await this.findingsListFindingsTargetsRaw(requestParameters);
        return await response.value();
    }

    /**
     * Overwrite data for a specific finding.
     * Submit a Finding Overwrite findings
     */
    async findingsSubmitAFindingOverwriteRaw(requestParameters: FindingsSubmitAFindingOverwriteRequest): Promise<runtime.ApiResponse<FindingsList>> {
        if (requestParameters.findingId === null || requestParameters.findingId === undefined) {
            throw new runtime.RequiredError('findingId','Required parameter requestParameters.findingId was null or undefined when calling findingsSubmitAFindingOverwrite.');
        }

        if (requestParameters.teamId === null || requestParameters.teamId === undefined) {
            throw new runtime.RequiredError('teamId','Required parameter requestParameters.teamId was null or undefined when calling findingsSubmitAFindingOverwrite.');
        }

        if (requestParameters.payload === null || requestParameters.payload === undefined) {
            throw new runtime.RequiredError('payload','Required parameter requestParameters.payload was null or undefined when calling findingsSubmitAFindingOverwrite.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["authorization"] = this.configuration.apiKey("authorization"); // Bearer authentication
        }

        const response = await this.request({
            path: `/teams/{team_id}/findings/{finding_id}/overwrites`.replace(`{${"finding_id"}}`, encodeURIComponent(String(requestParameters.findingId))).replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters.teamId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: FindingOverwritePayloadToJSON(requestParameters.payload),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => FindingsListFromJSON(jsonValue));
    }

    /**
     * Overwrite data for a specific finding.
     * Submit a Finding Overwrite findings
     */
    async findingsSubmitAFindingOverwrite(requestParameters: FindingsSubmitAFindingOverwriteRequest): Promise<FindingsList> {
        const response = await this.findingsSubmitAFindingOverwriteRaw(requestParameters);
        return await response.value();
    }

}
