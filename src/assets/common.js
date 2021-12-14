/*
Copyright 2021 Adevinta
*/

import {
    ftruncateSync
} from 'fs';

// TODO: This is a hack we should found a way to get the config
// without hard-coding the value of the base path.
const basePath = "/assets/"


$(document).ready(function() {
    $("#errorClose").on("click", function() {
        btnErrorClick()
    })
})

function showLoading() {
    $("#loading").css("display", "")
}

function hideLoading() {
    $("#loading").css("display", "none")
}

function btnErrorClick(elem) {
    $("#errorDlg").css("display", "none")
}

async function askConfirm(message) {
    $('#confirmDialog').addClass('is-active');
    let re
    let ask = new Promise((resolve) => {
        re = resolve;
    })
    $('#confirmDialogMessage').html(message)
    $("#btnConfirmAccept").off('click').on('click', () => {
        re(true);
    });
    $("#btnConfirmCancel").off('click').on('click', () => {
        re(false);
    });
    const res = await ask;
    $('#confirmDialog').removeClass('is-active');
    return res;
}

function showTeam(name) {
    let teamTitle = $(`<span class="icon is-small" style="margin-right:.5em">
              <i class="fa fa-users"></i>
            </span><span>${name}</span>`);
    $("#team").html($(teamTitle))
}

async function config(cb) {
    let resp = await fetch("../config.json")
    if (!resp.ok) {
        throw `Error getting config file ${resp.status} ${resp.statusText}`
    }
    const cfg = await resp.json()
    verifyConfig(cfg)
    return cfg
}

function verifyConfig(cfg) {
    if (!cfg) {
        throw "unable to read configuration"
    }
    if (!cfg.api_url) {
        throw "invalid configuration";
    }
}

function showError(msg, cb) {
    if (cb) {
        $("#errorClose").css("display", "");
    } else {
        $("#errorClose").css("display", "none");
    }
    hideLoading();
    $("#errorBody").html(msg)
    $("#errorDlg").css("display", "")
}

async function showWarningDialog(msg) {
    // warningDialog
    let re;
    const p = new Promise(function(resolve) {
        re = resolve;
    });

    $("#warningClose").off('click').on('click', () => {
        $("#warningDialog").css('display', "none");
    });

    $("#warningBody").html(msg);

    $("#warningDialog").css('display', "");
    await p;
}

function baseQueryParams() {
    let team = teamID();
    let scan = scanID();
    return `team_id=${team}&scan_id=${scan}`
}

function showLogin(cfg) {
    hideLoading();
    let team = teamID();
    let scan = scanID();
    if (!scan || !team) {
        $("#sessionExpiredBody").html(`Your session expired or you don't have permission for this team.
        </BR>
        Can not generate a login link this time because the current
        url does not contain required information.
        </BR>
        You can login in vulcan again by clicking in the full report link present in a vulcan report
        email.
        `)
    } else {
        let url = cfg.api_url;
        url = url + "report"
        url = url + `?team_id=${team}&scan_id=${scan}`
        $("#linkRelogin").attr("href", url)
    }
    $("#main").remove();
    $("#sessionExpired").css("display", "")
}

function teamID() {
    var qparams = (new URL(document.location)).searchParams;
    let team = qparams.get("team_id");
    return team
}

function scanID() {
    var qparams = (new URL(document.location)).searchParams;
    let scanID = qparams.get("scan_id");
    return scanID;
}

export {
    config,
    showError,
    showWarningDialog,
    teamID,
    scanID,
    showLogin,
    showLoading,
    hideLoading,
    showTeam,
    askConfirm,
    baseQueryParams
}
