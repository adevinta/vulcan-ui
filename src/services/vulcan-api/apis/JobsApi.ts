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
  Job,
} from '../models/index';
import {
    JobFromJSON,
    JobToJSON,
} from '../models/index';

export interface JobsShowRequest {
    jobId: string;
}

/**
 * 
 */
export class JobsApi extends runtime.BaseAPI {

    /**
     * Describes job status and results. The possible values for the status are:  - \'PENDING\': The job has been noted and is pending to be processed  - \'RUNNING\': The job is on execution  - \'DONE\': The job has finished, either successfully or unsuccesfully. Result.error needs to be processed to determine it  The results field indicates if there was an error during the execution of the job, and otherwise can return data from the job execution
     * show jobs
     */
    async jobsShowRaw(requestParameters: JobsShowRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Job>> {
        if (requestParameters['jobId'] == null) {
            throw new runtime.RequiredError(
                'jobId',
                'Required parameter "jobId" was null or undefined when calling jobsShow().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["authorization"] = await this.configuration.apiKey("authorization"); // Bearer authentication
        }

        const response = await this.request({
            path: `/jobs/{job_id}`.replace(`{${"job_id"}}`, encodeURIComponent(String(requestParameters['jobId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => JobFromJSON(jsonValue));
    }

    /**
     * Describes job status and results. The possible values for the status are:  - \'PENDING\': The job has been noted and is pending to be processed  - \'RUNNING\': The job is on execution  - \'DONE\': The job has finished, either successfully or unsuccesfully. Result.error needs to be processed to determine it  The results field indicates if there was an error during the execution of the job, and otherwise can return data from the job execution
     * show jobs
     */
    async jobsShow(requestParameters: JobsShowRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Job> {
        const response = await this.jobsShowRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
