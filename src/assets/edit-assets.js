/*
Copyright 2021 Adevinta
*/

import * as api from '../vulcan-api'
import * as common from './common'
import "../import-jquery"

// We use require and not import here because is the easy way
// to load a jquery and plugins.
require('./datatables.bulma')(window, $)
require('jquery-datatables-checkboxes/js/dataTables.checkboxes')(window, $)

const ownerRoleToken = "owner";

let client;
let config;
let table;
let currentAssets;
let membershipInfo;
let profile;

$(document).ready(async () => {
    init();
    try {
        config = await common.config()
    } catch (err) {
        handleError(err);
        return;
    }
    client = new api.vulcanAPI(config.api_url, () => api.token(config.ask_credentials));
    loadData(client, config);
})

function init() {
    // Setup global event handlers.
    $('#deleteAssets').off("click").on('click', () => {
        onDeleteClick();
    });
}

async function onEnableWebScanningClick() {
    if (!table) {
        return
    }
    var rows_selected = table.column(0).checkboxes.selected();
    if (rows_selected.length == 0) {
        return;
    }
    let ok = false;
    ok = await common.askConfirm(`Do you want to enable web scanning for the ${rows_selected.length} selected assets? Only WebAddresses assets will be affected by this operation.`);
    if (!ok) {
        return;
    }
    let team_id = common.teamID();
    let ids = []
    $.each(rows_selected, function (index, id) {
         ids.push(id)
    });
    const assets = getSelectedAssetsInfo(currentAssets, ids);
    let results = {
         updated: [],
         notUpdated: []
    }
    $("#main").css("display", "none");
    common.showLoading();
    let webScanningGroupId = await getWebScanningGroupId(team_id)
    if (webScanningGroupId===''){
        const groupPayload = {
            name: "web-scanning"
        }
        const webScanningGroup = await createGroup(team_id, groupPayload)
        if (webScanningGroup===''){
            common.hideLoading();
            loadData(client, config);
            let error = err;
            handleError("Error creating group: " + error)
            return
        } else {
            webScanningGroupId = webScanningGroup.id
        }
    }
    const report = await enableWebScanning(team_id, webScanningGroupId, 0, assets, results)
    common.hideLoading();
    await showReport(report, "update");
    loadData(client, config);
}

async function onDisableWebScanningClick() {
    if (!table) {
        return
    }
    var rows_selected = table.column(0).checkboxes.selected();
    if (rows_selected.length == 0) {
        return;
    }
    let ok = false;
    ok = await common.askConfirm(`Do you want to disable web scanning for the ${rows_selected.length} selected assets?`);
    if (!ok) {
        return;
    }
    let team_id = common.teamID();
    let ids = []
    $.each(rows_selected, function (index, id) {
         ids.push(id)
    });
    const assets = getSelectedAssetsInfo(currentAssets, ids);
    let results = {
         updated: [],
         notUpdated: []
    }
    $("#main").css("display", "none");
    common.showLoading();
    const webScanningGroupId = await getWebScanningGroupId(team_id)
    if (webScanningGroupId===''){
        common.hideLoading();
        loadData(client, config);
        handleError("WebScanning group does not exists. You need to create a group called 'web-scanning' first")
        return
    }
    const report = await disableWebScanning(team_id, webScanningGroupId, 0, assets, results)
    common.hideLoading();
    await showReport(report, "update");
    loadData(client, config);
}

async function onUpdateScannableClick(enable) {
    if (!table) {
        return
    }
    var rows_selected = table.column(0).checkboxes.selected();
    if (rows_selected.length == 0) {
        return;
    }
    let ok = false;

    let operationStr = "enable"
    if (!enable) {
        operationStr = "disable"
    }

    ok = await common.askConfirm(`Do you want to `+ operationStr +` scanning for the ${rows_selected.length} selected assets?`);
    if (!ok) {
        return;
    }
    let team_id = common.teamID();
    let ids = []
    $.each(rows_selected, function (index, id) {
         ids.push(id)
    });
    const assets = getSelectedAssetsInfo(currentAssets, ids);
    let results = {
         updated: [],
         notUpdated: []
    }
    $("#main").css("display", "none");
    common.showLoading();
    const report = await updateScannable(team_id, enable, 0, assets, results)
    common.hideLoading();
    await showReport(report, "update");
    loadData(client, config);
}

async function onDeleteClick() {
    if (!table) {
        return
    }
    var rows_selected = table.column(0).checkboxes.selected();
    if (rows_selected.length == 0) {
        return;
    }
    let ok = false;
    ok = await common.askConfirm(`Do you want to delete ${rows_selected.length} assets?`);
    if (!ok) {
        return;
    }
    let team_id = common.teamID();
    let ids = []
    $.each(rows_selected, function (index, id) {
        ids.push(id)
    });
    const assets = getSelectedAssetsInfo(currentAssets, ids);
    let results = {
        deleted: [],
        notDeleted: []
    }
    $("#main").css("display", "none");
    common.showLoading();
    const report = await deleteAssets(team_id, 0, assets, results)
    common.hideLoading();
    await showReport(report, "delete");
    loadData(client, config);
}

function getSelectedAssetsInfo(assets, ids) {
    let count = 0;
    let selected = ids.map(function (id) {
        const found = assets.find(function (asset) {
            const found = (asset.id == id);
            return found;
        });
        count++;
        return found;
    });
    return selected;
}

async function deleteAssets(team, index, assets, results) {
    if (index === assets.length) {
        return results
    }
    let asset = assets[index];
    let error;
    try {
        await client.deleteAsset(team, asset.id)
    } catch (err) {
        error = err;
    }
    if (error) {
        results.notDeleted.push({
            asset: asset,
            reason: error
        });
    } else {
        results.deleted.push(asset);
    }
    index++;
    results = await deleteAssets(team, index, assets, results)
    return results
}

async function getWebScanningGroupId(team) {
    try {
        const groups = await client.groups(team);
        for (var i = 0; i < groups.length; i++) {
            if (groups[i].name==="web-scanning") {
                return groups[i].id;
            }
        }
    } catch (err) {
        let error = err;
        handleError(error)
    }
    return ""
}

async function enableWebScanning(team, group, index, assets, results) {
    if (index === assets.length) {
        return results
    }
    let asset = assets[index];
    let error;
    try {
        if (asset.type.name==="WebAddress") {
            await client.addAssetToGroup(team, group, asset.id)
        } else {
            error = "Invalid asset type for web scanning.";
        }
    } catch (err) {
        error = err;
    }
    if (error) {
        results.notUpdated.push({
            asset: asset,
            reason: error
        });
    } else {
        results.updated.push(asset);
    }
    index++;
    results = await enableWebScanning(team, group, index, assets, results)
    return results
}

async function disableWebScanning(team, group, index, assets, results) {
    if (index === assets.length) {
        return results
    }
    let asset = assets[index];
    let error;
    try {
        await client.removeAssetFromGroup(team, group, asset.id)
    } catch (err) {
        error = err;
    }
    if (error) {
        results.notUpdated.push({
            asset: asset,
            reason: error
        });
    } else {
        results.updated.push(asset);
    }
    index++;
    results = await disableWebScanning(team, group, index, assets, results)
    return results
}

async function updateScannable(team, enable, index, assets, results) {
    if (index === assets.length) {
        return results
    }
    let asset = {}
    asset.id = assets[index].id;
    asset.scannable=enable;
    let error;
    try {
        await client.updateAsset(team, asset)
    } catch (err) {
        error = err;
    }
    if (error) {
        results.notUpdated.push({
            asset: asset,
            reason: error
        });
    } else {
        results.updated.push(asset);
    }
    index++;
    results = await updateScannable(team, enable, index, assets, results)
    return results
}


async function createGroup(team, groupPayload) {
    try {
        const result = await client.createGroup(team, groupPayload)
        console.log("createGroup: "+result)
        return result
    } catch (err) {
        let error = err;
        handleError(error)
    }
    return ""
}

async function showReport(report, mode) {
    let re;
    let closeClick = new Promise((resolve) => {
        re = resolve;
    })
    closeClick.resolve = re;
    $("#reportClose").off('click').on('click', function () {
        $("#report").removeClass('is-active');
        closeClick.resolve();
    });

    if (mode==="update") {
        $("#results").html('');
        let line = $(`<p>${report.updated.length} assets were updated successfully</p>`);
        $("#results").append(line);
        if (report.notUpdated.length > 0) {
            $("#results").append($("<p>Following assets were not updated:</p>"));
        }
        $('#results').add('<dl>');
        report.notUpdated.forEach((item) => {
            line = $(`<dt>${item.asset.identifier}</dt> <dd>${item.reason}</dd>`);
            $('#results').append(line);
        });
    } else {
        $("#results").html('');
        let line = $(`<p>${report.deleted.length} assets were deleted successfully</p>`);
        $("#results").append(line);
        if (report.notDeleted.length > 0) {
            $("#results").append($("<p>Following assets were not deleted:</p>"));
        }
        $('#results').add('<dl>');
        report.notDeleted.forEach((item) => {
            line = $(`<dt>${item.asset.identifier}</dt> <dd>${item.reason}</dd>`);
            $('#results').append(line);
        });
        }

    $("#report").addClass("is-active");
    await closeClick;
}

async function loadData(client, config) {
    $("#main").css("display", "none")
    common.showLoading();
    let teamID = common.teamID();
    if (!teamID) {
        common.showError("Can not retrieve team id");
        return;
    }
    try {
        // Get the team name.
        const team = await client.team(teamID);
        common.showTeam(team.name);
        // Get the user profile.
        profile = await client.profile();
        const userID = profile.id;
        membershipInfo = await client.member(teamID, userID);
        // Check if the user is owner or admin.
        if ((membershipInfo.role !== ownerRoleToken) && !profile.admin && !profile.observer) {
            const msg = await buildNotOwnerMessage(teamID, userID);
            common.showWarningDialog(msg);
        }
        // Show assets table.
        await showAssets(teamID);
        $("#main").css("display", "");
        common.hideLoading();
    } catch (err) {
        handleError(err);
    }
}

async function buildNotOwnerMessage(teamID, userID) {
    const members = await client.members(teamID);
    // Find email of the users that are owners.
    const emails = members.filter((member) => {
        return (member.role == ownerRoleToken ? true : false);
    }).map(member => `<li >${member.user.email}</li>`);
    const message = `
    <p>
    You are not an owner of this team, therefore, you can only list but not
    delete nor add assets.
    </p>
    <p>
    If  you want to become a team owner you need to contact one of the following team members:
    </p>
    <p class="is-bold">
        <strong>
        <ul>
        ${emails.join("")}
        </ul>
        </strong>
    </p>
    <p>
    They can use the following API call to make you owner:
    </p>
    <div>
     <code>
     curl -X PATCH \\</code>
    </div>
    <div>
     <code>
     ${client.updateMemberRequest(teamID,userID).url} \\
     </code>
    </div>
    <div>
    <code>
    -H "Authorization: Bearer $token" -H 'Cache-Control: no-cache'
    -H 'Content-Type: application/json' -d '{"role": "owner"}'
    </code>
    </div>
    `
    return message;
}

async function showAssets(id) {
    let assets = await client.assets(id)
    handleGroups(assets);
    showTable(assets);
}

function handleGroups(assets){
    for (var i = 0; i < assets.length; i++) {
        assets[i].webScanningIcon = "";
        assets[i].scannableIcon = "";
        assets[i].autoDiscoveredIcon = "";
        
        // Build belonging display icons for
        // Auto Discovered, Web Scanning and Scannable groups
        if (assets[i].groups == null) {
            assets[i].groups = [];
        }
        if (assets[i].groups.filter(group => group.name === 'web-scanning').length > 0) {
            assets[i].webScanningIcon = "<i class=\"fa fa-check-circle\"></i>";
        }
        if (assets[i].scannable) {
            assets[i].scannableIcon = "<i class=\"fa fa-check-circle\"></i>";
        }
        if (assets[i].groups.filter(group => group.name === 'security-team-discovered-assets').length > 0) {
            assets[i].autoDiscoveredIcon = "<i class=\"fa fa-check-circle\"></i>";
        }

        // Build Live Report link for identifier
        let teamID = common.teamID();
        let identifier = assets[i].identifier;
        assets[i].identifier = "<a href=\"/report/report.html?team_id=" + teamID + "&identifiers=" + identifier + "\">" + identifier + "</a>";
    }
}

function showTable(data) {
    if (table) {
        table.destroy();
    }
    currentAssets = data;
    table = $('#assetsTable').DataTable({
        data: data,
        infoCallback: function (settings, start, end, max, total, pre) {
            var api = this.api();
            var pageInfo = api.page.info();
            return `Showing ${parseInt(start,10)} to ${parseInt(end,10)} of ${parseInt(max,10)}`;
        },
        language: {
            lengthMenu: 'Show <select>' +
                '<option value="5">5</option>' +
                '<option value="10">10</option>' +
                '<option value="20">20</option>' +
                '<option value="30">30</option>' +
                '<option value="40">40</option>' +
                '<option value="-1">All</option>' +
                '</select>',
            "info": "Showing _START_ to _END_ of _TOTAL_ entries",

        },
        iDisplayLength: 20,
        columns: [{
                title: "select",
                data: "id"
            },
            {
                title: "Identifier",
                data: "identifier"
            },
            {
                title: "Type",
                data: "type.name"
            },
            {
                title: "Auto Discovered",
                data: "autoDiscoveredIcon",
                className: "dt-center"
            },
            {
                title: "Web Scanning",
                data: "webScanningIcon",
                className: "dt-center"
            },
            {
                title: "Scannable",
                data: "scannableIcon",
                className: "dt-center"
            }
        ],
        'columnDefs': [{
            'targets': 0,
            'searchable': false,
            'orderable': false,
            'checkboxes': {
                'selectRow': true,
                'selectCallback': function () {
                    const selected = table.column(0).checkboxes.selected();
                    if (selected.length > 0) {
                        $('#deleteAssets').removeAttr('disabled');
                        $('#toggleWebScanning').removeAttr('disabled');
                    } else {
                        $('#deleteAssets').attr('disabled', 'true');
                        $('#toggleWebScanning').attr('disabled', 'true');
                    }
                },
            }
        }],
        'select': {
            'style': 'multi'
        },
        'order': [
            [1, 'asc']
        ]
    });

    customizeDataTable(table);

}

function customizeDataTable(table) {
    // This a little bit hacky and should be changed, but by now, is the easiest
    // way to use a customized filter field we wanted to use.
    let filterBtn = $("#search").clone();
    filterBtn.find("#filter-query").attr('id', 'filter-query-1');
    filterBtn.find("#searchReset").attr('id', 'searchReset-1');
    filterBtn.css("display", "");
    $('#assetsTable_filter').html('');
    $('#assetsTable_filter').addClass("column is-4");
    $('#assetsTable_filter').append(filterBtn);
    $('#filter-query-1').on('keyup', function () {
        table.search($('#filter-query-1').val());
        table.draw();
    });

    $('.dataTables_length').addClass('select');

    $('#searchReset-1').off('click').on('click', function () {
        $('#filter-query-1').val("");
        $('#filter-query-1').click();
    });

    if ((membershipInfo.role !== ownerRoleToken) && !profile.admin && !profile.observer) {
        return;
    }

    let toggleWebScanningDropdown = $('#toggleWebScanningTemplate').clone();
    toggleWebScanningDropdown.attr('id', 'toggleWebScanningDropdown')
    toggleWebScanningDropdown.find("#enableWebScanningTemplate").attr('id', 'enableWebScanning-1');
    toggleWebScanningDropdown.find("#disableWebScanningTemplate").attr('id', 'disableWebScanning-1');
    toggleWebScanningDropdown.attr('id', 'toggleWebScanningDropdown')
    toggleWebScanningDropdown.find('#enableWebScanning-1').on('click', () => {
        onEnableWebScanningClick();
    });
    toggleWebScanningDropdown.find('#disableWebScanning-1').on('click', () => {
        onDisableWebScanningClick();
    });
    $('.delete_position').append(toggleWebScanningDropdown);


    let toggleScannableDropdown = $('#toggleScannableTemplate').clone();
    toggleScannableDropdown.attr('id', 'toggleScannableDropdown')
    toggleScannableDropdown.find("#enableScannableTemplate").attr('id', 'enableScannable-1');
    toggleScannableDropdown.find("#disableScannableTemplate").attr('id', 'disableScannable-1');
    toggleScannableDropdown.attr('id', 'toggleScannableDropdown')
    toggleScannableDropdown.find('#enableScannable-1').on('click', () => {
        onUpdateScannableClick(true);
    });
    toggleScannableDropdown.find('#disableScannable-1').on('click', () => {
        onUpdateScannableClick(false);
    });
    $('.delete_position').append(toggleScannableDropdown);


    let deleteBtn = $('#deleteAssetsTemplate').clone();
    deleteBtn.attr('id', 'deleteAssets')
    deleteBtn.on('click', () => {
        onDeleteClick();
    });
    $('.delete_position').append(deleteBtn);


    let addBtn = $('#addAssetsTemplate').clone();
    addBtn.attr('id', 'addAssets')
    let addURL = addBtn.attr('href')
    addURL = `${addURL}?${common.baseQueryParams()}`
    addBtn.attr('href', addURL);
    $('.delete_position').append(addBtn);

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
