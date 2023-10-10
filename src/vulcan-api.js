/*
Copyright 2021 Adevinta
*/

import "./assets/import-jquery"

const cookieName = "devcon-token";
const unauthorizedError = "Unauthorized";
const forbiddenError = "Forbidden";
const itemDoesNotExistError = "item does not exist";
const methodNotAllowedError = "method not allowed";
const defaultError = "error calling vulcan-api, details: ";
const internalServerError = "internal server error";
const entityAlreadyExistsError = "AlreadyExists"
const ajaxErrors = {
    // Default error
    0: defaultError,
    401: unauthorizedError,
    403: forbiddenError,
    404: itemDoesNotExistError,
    405: methodNotAllowedError,
    500: internalServerError,
    409: entityAlreadyExistsError
}

function getCookie(name) {
    var cvalues = document.cookie.split(";")
    let cname = name + "="
    var found = cvalues.filter((cookie) => {
        var trimmed = cookie.trim(cookie)
        if (trimmed.startsWith(cname)) {
            return true
        }
        return false
    })
    if (found.length > 0) {
        var parts = found[0].split("=")
        if (parts.length > 1) {
            return parts[1]

        }
    }
    return null
}

function setTokenCookie(token) {
    let date = new Date()
    date.setFullYear(date.getFullYear() + 1)
    document.cookie = cookieName + "=" + token + "; path=/; expires=" + date.toString()
}

function token(ask) {
    let token = getCookie(cookieName)
    if (!token && ask) {
        token = window.prompt("enter token")
        if (token) {
            setTokenCookie(token)
        }
    }
    return token
}

class vulcanAPI {

    constructor(url, tokenProvider) {
        this.url = url;
        this.tokenProvider = tokenProvider;
    }

    baseRequest() {
        const token = this.tokenProvider();
        if (!token) {
            throw unauthorizedError;
        }
        const req = {
            url: this.url,
            headers: new Headers({
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                "Authorization": "Bearer " + token
            })
        }
        return req
    }

    addMemberRequest(teamID) {
        let path = `teams/${teamID}/members`;
        let req = this.baseRequest();
        req.method = "POST";
        req.url = req.url + path;
        return req
    }

    programScansRequest(teamID, programID) {
        let path = `teams/${teamID}/programs/${programID}/scans`
        let req = this.baseRequest();
        req.method = "GET";
        req.url = req.url + path;
        return req
    }

    scanReportRequest(teamID, scanID) {
        let path = `teams/${teamID}/scans/${scanID}/report`
        let req = this.baseRequest();
        req.method = "GET";
        req.url = req.url + path;
        return req
    }

    removeMemberRequest(teamID, userID) {
        let path = `teams/${teamID}/members/${userID}`;
        let req = this.baseRequest();
        req.method = "DELETE";
        req.url = req.url + path;
        return req
    }

    teamRequest(teamID) {
        let path = "teams/" + teamID;
        let req = this.baseRequest();
        req.method = "GET";
        req.url = req.url + path;
        return req
    }

    teamsRequest() {
        let path = "teams"
        let req = this.baseRequest();
        req.method = "GET";
        req.url = req.url + path;
        return req
    }

    teamAssetsRequest(teamID) {
        let req = this.teamRequest(teamID);
        req.url = req.url + "/assets";
        return req;
    }

    teamCreateAssetsMultistatusRequest(teamID) {
        let req = this.teamRequest(teamID);
        req.url = req.url + "/assets/multistatus";
        return req;
    }

    teamDeleteAssetRequest(teamID, assetID) {
        let req = this.teamAssetsRequest(teamID);
        req.url = req.url + `/${assetID}`;
        req.method = 'DELETE';
        return req;
    }

    teamUpdateAssetRequest(teamID, assetID) {
        let req = this.teamAssetsRequest(teamID);
        req.url = req.url + `/${assetID}`;
        req.method = 'PATCH';
        return req;
    }

    teamUpdateRecipientsRequest(teamID) {
        let req = this.teamRequest(teamID);
        req.url = req.url + `/recipients`;
        req.method = 'PUT';
        return req;
    }

    profileRequest() {
        let req = this.baseRequest();
        req.method = "GET";
        req.url = req.url + `profile`;
        return req;
    }

    teamMemberRequest(teamID, userID) {
        let req = this.teamRequest(teamID);
        req.method = "GET";
        req.url = req.url + `/members/${userID}`;
        return req;
    }

    teamMembersRequest(teamID) {
        let req = this.teamRequest(teamID);
        req.method = "GET";
        req.url = req.url + `/members`;
        return req;
    }

    updateMemberRequest(teamID, userID) {
        let req = this.teamRequest(teamID);
        req.method = "PUT";
        req.url = req.url + `/members/${userID}`;
        return req;
    }

    teamRecipientsRequest(teamID) {
        let req = this.teamRequest(teamID);
        req.method = "GET";
        req.url = req.url + `/recipients`;
        return req;
    }

    userTeamsRequest(userID) {
        let req = this.baseRequest();
        req.method = "GET";
        req.url = req.url + `users/${userID}/teams`;
        return req;
    }
    
    mttrRequest(teamID, minDate, maxDate) {
        let path = `teams/${teamID}/stats/mttr?minDate=${minDate}&maxDate=${maxDate}`
        let req = this.baseRequest();
        req.method = "GET";
        req.url = req.url + path;
        return req;
    }

    openRequest(teamID, atDate, minDate, maxDate) {
        let path = `teams/${teamID}/stats/open?atDate=${atDate}&minDate=${minDate}&maxDate=${maxDate}`;
        let req = this.baseRequest();
        req.method = "GET";
        req.url = req.url + path;
        return req;
    }
    
    fixedRequest(teamID, atDate, minDate, maxDate) {
        let path = `teams/${teamID}/stats/fixed?atDate=${atDate}&minDate=${minDate}&maxDate=${maxDate}`;
        let req = this.baseRequest();
        req.method = "GET";
        req.url = req.url + path;
        return req;
    }

    teamCreateGroupRequest(teamID) {
        let req = this.teamRequest(teamID);
        req.method = "POST";
        req.url = req.url + `/groups`;
        return req;
    }

    addAssetToGroupRequest(teamID, groupID) {
        let req = this.teamRequest(teamID);
        req.method = "POST";
        req.url = req.url + `/groups/${groupID}/assets`;
        return req;
    }

    removeAssetFromGroupRequest(teamID, groupID, assetID) {
        let req = this.teamRequest(teamID);
        req.method = "DELETE";
        req.url = req.url + `/groups/${groupID}/assets/${assetID}`;
        return req;
    }

    teamGroupsRequest(teamID) {
        let req = this.teamRequest(teamID);
        req.method = "GET";
        req.url = req.url + `/groups`;
        return req;
    }

    async team(teamID) {
        const req = this.teamRequest(teamID);
        const resp = await fetch(req.url, req)
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
        return await resp.json();
    }

    async teams() {
        const req = this.teamsRequest();
        const resp = await fetch(req.url, req)
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
        return await resp.json();
    }

    async assets(teamID) {
        const req = this.teamAssetsRequest(teamID);
        const resp = await fetch(req.url, req)
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
        return await resp.json();
    }

    async groups(teamID) {
        const req = this.teamGroupsRequest(teamID);
        const resp = await fetch(req.url, req)
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
        return await resp.json();
    }

    async createGroup(teamID, groupPayload) {
        var req = this.teamCreateGroupRequest(teamID);
        req.method = "POST";
        req.body = JSON.stringify(groupPayload);
        const resp = await fetch(req.url, req);
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
        return await resp.json();
    }

    async deleteAsset(teamID, assetID) {
        const req = this.teamDeleteAssetRequest(teamID, assetID)
        const resp = await fetch(req.url, req)
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
        return assetID;
    }

    async createAssets(teamID, assetsPayload) {
        var req = this.teamCreateAssetsMultistatusRequest(teamID);
        req.method = "POST";
        req.body = JSON.stringify(assetsPayload);
        const resp = await fetch(req.url, req);
        let result;
        try {
            let body = await resp.json();
            // The operation didn't work and failed without a
            // logic error.
            if (!body.error && !body.length) {
                throw handleAjaxError(resp.status, resp.statusText)
            }
            result = {
                body: body,
                resp: resp
            }
        } catch (err) {
            throw handleAjaxError(err)
        }
        return result;
    }

    async updateAsset(teamID, assetPayload) {
        var req = this.teamUpdateAssetRequest(teamID, assetPayload.id)
        req.body = JSON.stringify(assetPayload);
        const resp = await fetch(req.url, req)
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
        return assetPayload.id;
    }

    async member(teamID, userID) {
        var req = this.teamMemberRequest(teamID, userID);
        const resp = await fetch(req.url, req)
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
        // example response
        /*
        {
            "user": {
                "id": "edeewfe-111e-fd657-a27f-ee51025ad5d6",
                "firstname": "User1",
                "lastname": "Surname",
                "email": "user1.surname@vulcan.example.com",
                "admin": false,
                "disabled": false
            },
            "role": "owner",
            "is_default": false
        }
        */
        return await resp.json();
    }

    async members(teamID) {
        var req = this.teamMembersRequest(teamID);
        const resp = await fetch(req.url, req)
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
        // example response
        /*
        [{
            "user": {
                "id": "dsf-fesdfcds-fsdfsd-fsfs",
                "firstname": "User1",
                "lastname": "Surname",
                "email": "user.surname@vulcan.example.com",
                "admin": true,
                "disabled": false
            },
            "role": "owner",
            "is_default": false
        }]
        */
        return await resp.json();
    }

    async updateRecipients(teamID, emails) {
        var req = this.teamUpdateRecipientsRequest(teamID)
        req.body = JSON.stringify({ "emails": emails });
        const resp = await fetch(req.url, req)
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
        return await resp.json();
    }

    async recipients(teamID) {
        var req = this.teamRecipientsRequest(teamID);
        const resp = await fetch(req.url, req)
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
        // example response
        /*
        {
            "emails": [ "user@example.com", "user2@example.com"]
        }
        */
        return await resp.json();
    }

    async profile() {
        var req = this.profileRequest()
        const resp = await fetch(req.url, req)
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
        // example response
        /*
       {
           "id": "ede284fe-355e-4657-a27f-ee51025ad5d6",
           "firstname": "User1",
           "lastname": "Surname",
           "email": "user.surname@vulcan.example.com",
           "admin": true,
           "disabled": false
       }
        */
        return await resp.json();
    }

    async userTeams(userID) {
        var req = this.userTeamsRequest(userID)
        const resp = await fetch(req.url, req)
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
        // example response
        /*
       [{
           "id": "8c03ba6a-2167-4fe0-b974-c316b7a58868",
           "name": "Team1",
           "description": "",
           "tag": "team:team1"
       }]*/
        return await resp.json();
    }

    async addMember(teamID, userEmail, role) {
        var req = this.addMemberRequest(teamID);
        const addMemberPayload = {
            "email": userEmail,
            "role": role,
        };
        req.body = JSON.stringify(addMemberPayload);
        const resp = await fetch(req.url, req);
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
        let result;
        try {
            let body = await resp.json();
            // The operation didn't work and failed without a
            // logic error.
            if (!body.user) {
                throw defaultError
            }
            result = {
                body: body,
                resp: resp
            }
        } catch (err) {
            err = handleAjaxError(err);
            throw err;
        }
        return result;
    }

    async removeMember(teamID, userID) {
        var req = this.removeMemberRequest(teamID, userID)
        const resp = await fetch(req.url, req);
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
    }

    async programScans(teamID, programID) {
        var req = this.programScansRequest(teamID, programID);
        const resp = await fetch(req.url, req)
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
        // example response
        /*
        [
    {
        "id": "73a43499-aac3-4f15-bbac-240fd75a2eb4",
        "start_time": "2019-10-16T08:00:00.769626535Z",
        "end_time": "2019-10-16T08:16:12.440433656Z",
        "scheduled_time": "2019-10-16T08:00:00.007883879Z",
        "progress": 1,
        "check_count": 119,
        "status": "FINISHED",
        "requested_by": "vulcan@vulcan.example.com",
        "program": {}
]
        */
        return await resp.json();
    }

    async scanReport(teamID, scanID) {
        var req = this.scanReportRequest(teamID, scanID);
        const resp = await fetch(req.url, req)
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
        // example response
        return await resp.json();
    }
    
    async mttr(teamID, minDate, maxDate) {
        var req = this.mttrRequest(teamID, minDate, maxDate);
        const resp = await fetch(req.url, req)
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
        return await resp.json();
    }
    
    async openIssues(teamID, atDate, minDate, maxDate) {
        var req = this.openRequest(teamID, atDate, minDate, maxDate);
        const resp = await fetch(req.url, req)
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
        return await resp.json();
    }
    
    async fixedIssues(teamID, atDate, minDate, maxDate) {
        var req = this.fixedRequest(teamID, atDate, minDate, maxDate);
        const resp = await fetch(req.url, req)
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
        return await resp.json();
    }

    async addAssetToGroup(teamID, groupID, assetID) {
        var req = this.addAssetToGroupRequest(teamID, groupID);
        const addAssetToGroupPayload = {
            "asset_id": assetID,
        };
        req.body = JSON.stringify(addAssetToGroupPayload);
        const resp = await fetch(req.url, req);
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }

        if (resp.status!=200) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
    }

    async removeAssetFromGroup(teamID, groupID, assetID) {
        var req = this.removeAssetFromGroupRequest(teamID, groupID, assetID);
        const resp = await fetch(req.url, req);
        if (!resp.ok) {
            throw handleAjaxError(resp.status, resp.statusText);
        }

        if (resp.status!=204) {
            throw handleAjaxError(resp.status, resp.statusText);
        }
    }
}

function handleAjaxError(status, statusText) {
    status = status || 0;
    let err = ajaxErrors[status];
    err = err || defaultError;
    if (err == defaultError) {
        err = err + statusText;
    }
    return err
}

export {
    vulcanAPI,
    token,
    forbiddenError,
    unauthorizedError,
    entityAlreadyExistsError,
}
