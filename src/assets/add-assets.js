/*
Copyright 2021 Adevinta
*/

import * as api from '../vulcan-api'
import * as common from './common'
import "./import-jquery"
import {validateAsset} from "./common";

var client;
var config;
var teamID;

$(document).ready(async () => {
    setEventHandlers();
    try {
        config = await common.config()
    } catch (err) {
        handleError(err);
        return;
    }
    client = new api.vulcanAPI(config.api_url, () => api.token(config.ask_credentials));
    addAssetsLoaded(client, config);
})

function setEventHandlers() {
    // Setup initial html element attributes.
    let editURL = $('#back').attr('href')
    editURL = `${editURL}?${common.baseQueryParams()}`
    $('#back').attr('href', editURL);

    // Setup event handlers
    $('#add').off("click").on('click', () => {
        var assets = $("#assets").val().split('\n');
        addAssets(client, config, assets, teamID);
    });

    $('#modal-close').off("click").on('click', () => {
        $(".modal").removeClass("is-active");
    });
}

async function addAssetsLoaded(client, config) {
    $("#main").css("display", "none");
    common.showLoading();
    teamID = common.teamID();
    if (!teamID) {
        common.showError("Can not retrieve team id");
        return;
    }
    try {
        const team = await client.team(teamID);
        common.showTeam(team.name);
        $("#main").css("display", "");
        common.hideLoading();
    } catch (err) {
        handleError(err);
    }
}

async function addAssets(client, config, assets, id) {
    $("#main").css("display", "none");

    common.showLoading();

    var assetArray = [];
    for (var i = 0; i < assets.length; i++) {
        if (assets[i].trim().length === 0) {
            continue
        }
        let kv = assets[i].split(',');
        if (kv.length>2){
            common.showError(`Invalid format on ${assets[i]}.`);
            return;
        }
        let id=kv[0].trim()
        if (!validateAsset(id)){
            common.showError(`The identifier of the asset ${id} doesn't have a valid format.`);
            return;
        }
        let asset = {
            identifier: id
        }
        if (kv.length==2) {
            asset.type=kv[1].trim()
        }
        assetArray.push(asset);
    }

    var assetsObj = {
        assets: assetArray
    };

    try {
        let response = await client.createAssets(id, assetsObj);
        $("#results").html('');

        if (response.resp.status === 201 || response.resp.status === 207) {
            let content = '';

            if (response.resp.status === 201) {
                content = $(`<p>${response.body.length} assets were created successfully</p>`);
            }
            else {
                content = parseMultiStatusResponse(response.body);
            }

            if (areNewAWSAccounts(response.body)) {
                $('#modal-close').hide();
                $('#modal-close-rolfp').off("click").on('click', () => {
                    window.location.href = `../rolfp/rolfp.html?team_id=${teamID}&only_unclassifieds=true`;
                });
                $('#modal-close-rolfp').show();
            } else {
                $('#modal-close').show();
                $('#modal-close-rolfp').hide();
            }

            $("#results").append(content);
            $("#assets").val('');
        } else {
            let line = $(`<dt></dt> <dd>Error: ${response.body.error}</dd>`);
            $('results').add('<dl>');
            $("#results").append(line);
            $("#assets").val(assets.join('\n'));
            $('results').add('</dl>');
        }

        $(".modal").addClass("is-active");
    } catch (err) {
        handleError(err)
    }

    $("#main").css("display", "");
    common.hideLoading();
}

function areNewAWSAccounts(assets) {
    for (let i = 0; i < assets.length; i++) {
        if (assets[i].status.code === 201 &&
            assets[i].type.name == "AWSAccount") {
            return true;
        }
    }

    return false;
}

function parseMultiStatusResponse(assets) {
    let content = '';
    
    let okAssets = [];
    let koAssets = [];

    assets.forEach(a => {
        if (a.status.code === 201) {
            okAssets.push(a);
        } else {
            koAssets.push(a);
        }
    });

    let okLine = `<p>${okAssets.length} assets were created successfully.</p>`;
    let koLine = `<p>${koAssets.length} assets were not created successfully:<p>`;

    if (okAssets.length) {
        content += okLine;
    }
    if (koAssets.length) {
        let koTable = "<table><thead></thead><tbody>"
        for (let i = 0; i < koAssets.length; i++) {
            koTable += `
            <tr>
                <td>
                    <span><strong>Asset: </strong></span>
                    <span>${koAssets[i].identifier}</span>
                </td>
                <td>
                    <span><strong>Type: </strong></span>
                    <span>${koAssets[i].type.name}</span>
                </td>
                <td>
                    <span><strong>Error: </strong></span>
                    <span>${koAssets[i].status.error}</span>
                </td>
            </tr>`;
        }
        koTable += "</tbody></table>"

        content += koLine;
        content += koTable;
    }

    return content;
}

function handleError(err, cb) {
    if (!err.indexOf) {
        common.showError(err, cb);
        return
    }
    if (err.indexOf(api.unauthorizedError) >= 0) {
        common.showLogin(config);
        return
    }
    if (err.indexOf(api.forbiddenError) >= 0) {
        common.showLogin(config);
        return
    }
    common.showError(err, cb);
    return
}
