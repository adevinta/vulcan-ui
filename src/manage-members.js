/*
Copyright 2021 Adevinta
*/

import * as api from './vulcan-api'
import * as common from './common'
import "./import-jquery"

// We use require and not import here because is the easier way to load a jquery
// and plugins.
require('./datatables.bulma')(window, $)
require('jquery-datatables-checkboxes/js/dataTables.checkboxes')(window, $)

const ownerRoleToken = "owner";

let client;
let config;
let table;
let currentMembers;
let membershipInfo;
let profile;
let rootElement;

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

async function loadData(client, config) {
    $("#main").css("display", "none")
    common.showLoading(rootElement);
    let teamID = common.teamID();
    if (!teamID) {
        common.showError("Can not retrieve team id");
        return;
    }
    try {
        // Get the team name.
        const team = await client.team(teamID);
        common.showTeam($('#team'), team.name);
        // Get the user profile.
        profile = await client.profile();
        const userID = profile.id;
        membershipInfo = await client.member(teamID, userID);
        // Check if the user is owner or admin.
        if ((membershipInfo.role !== ownerRoleToken) && !profile.admin && !profile.observer) {
            const msg = await buildNotOwnerMessage(teamID, userID);
            common.showWarningDialog(rootElement, msg);
        }
        // Show members table.
        await showMembers(teamID);
        $("#main").css("display", "");
        common.hideLoading();
    } catch (err) {
        handleError(err);
    }
}

function init() {
    rootElement = $(document.body);
    // Setup global event handlers.
    $('#btnAddMemberAccept').off("click").on('click', () => {
        onBtnAddMemberClick();
    });

    $('#btnAddMemberCancel').off("click").on('click', () => {
        $('#addDialog').removeClass('is-active');
    });

    $('#role').on('change', () => {
        $('#addMemberError').css("display", "none");
    })

    $('#email').on('change', () => {
        $('#addMemberError').css("display", "none");
    })

}

async function onBtnAddMemberClick() {
    let error = false
    let errorMsg = ""
    $('#addMemberError').children().detach()
    const role = $('#role').val()
    if (role === "none") {
        errorMsg = `<li>Role is mandatory</li>`
        error = true
    }
    const email = $('#email').val()
    if (!validateEmail(email)) {
        errorMsg = errorMsg + `<li>Invalid Email</li>`;
        error = true
    }
    if (error) {
        $('#addMemberError').append(`<ul>${errorMsg}</ul>`)
        $('#addMemberError').css("display", "");
        return
    }
    $('#addMemberError').css("display", "none");
    $("#addDialog").removeClass('is-active');
    let teamID = common.teamID();
    try {
        common.showLoading(rootElement);
        await client.addMember(teamID, email, role)
        loadData(client, config)
    } catch (err) {
        handleError(err, () => {
            loadData(client, config)
        });
    }
}

function validateEmail(mail) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)
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
    ok = await common.askConfirm(rootElement, `Do you want to remove ${rows_selected.length} members from the team?`);
    if (!ok) {
        return;
    }
    let team_id = common.teamID();
    let ids = []
    $.each(rows_selected, function (index, id) {
        ids.push(id)
    });
    let results = {
        deleted: [],
        notDeleted: []
    }
    $("#main").css("display", "none");
    const membersInfo = getSelectedMembersInfo(currentMembers, ids)
    common.showLoading(rootElement);
    const report = await removeMembers(team_id, 0, membersInfo, results)
    common.hideLoading();
    await showReport(report);
    loadData(client, config);
}

function getSelectedMembersInfo(members, ids) {
    let count = 0;
    let selected = ids.map(function (id) {
        const found = members.find(function (member) {
            const found = (member.user.id == id);
            return found;
        });
        count++;
        return found;
    });
    return selected;
}

async function removeMembers(team, index, members, results) {
    if (index === members.length) {
        return results
    }
    let member = members[index];
    let error;
    try {
        await client.removeMember(team, member.user.id)
    } catch (err) {
        error = err;
    }
    if (error) {
        results.notDeleted.push({
            member: member.user,
            reason: error
        });
    } else {
        results.deleted.push(member.user);
    }
    index++;
    results = await removeMembers(team, index, members, results)
    return results
}

async function showReport(report) {
    let re;
    let closeClick = new Promise((resolve) => {
        re = resolve;
    })
    closeClick.resolve = re;
    $("#reportClose").off('click').on('click', function () {
        $("#report").removeClass('is-active');
        closeClick.resolve();
    });


    $("#results").html('');
    let line = $(`<p>${report.deleted.length} user were removed from the team successfully</p>`);
    $("#results").append(line);
    if (report.notDeleted.length > 0) {
        $("#results").append($("<p>Following users were not removed from the team:</p>"));
    }
    $('#results').add('<dl>');
    report.notDeleted.forEach((item) => {
        line = $(`<dt>${item.email}</dt> <dd>${item.reason}</dd>`);
        $('#results').append(line);
    });

    $("#report").addClass("is-active");
    await closeClick;
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

async function showMembers(id) {
    let members = await client.members(id)
    currentMembers = members;
    showTable(members);
}

function showTable(data) {
    if (table) {
        table.destroy();
    }
    currentMembers = data;
    table = $('#membersTable').DataTable({
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
                data: "user.id"
            },
            {
                title: "Email",
                data: "user.email"
            },
            {
                title: "Role",
                data: "role"
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
                        $('#deleteMembers').removeAttr('disabled');
                    } else {
                        $('#deleteMembers').attr('disabled', 'true');
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
    $('#membersTable_filter').html('');
    $('#membersTable_filter').addClass("column is-4");
    $('#membersTable_filter').append(filterBtn);
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

    let deleteBtn = $('#deleteMembersTemplate').clone();
    deleteBtn.attr('id', 'deleteMembers')
    deleteBtn.on('click', () => {
        onDeleteClick();
    });
    $('.delete_position').append(deleteBtn);


    let addBtn = $('#addMembersTemplate').clone();
    addBtn.attr('id', 'addMembers')

    addBtn.on('click', () => {
        onAddMemberClick()
    })
    $('.delete_position').append(addBtn);

}

function onAddMemberClick() {
    // Reset dialog fields data.
    const role = $('#role').val("none");
    const email = $('#email').val("");
    $('#addDialog').addClass('is-active');
}

function handleError(err, cb) {
    if (!err.indexOf) {
        common.showError(rootElement, err, cb);
        return
    }
    if (err.indexOf(api.entityAlreadyExistsError) >= 0) {
        common.showError(rootElement, "Member is already part of the team.", cb);
        return
    }
    if (err.indexOf(api.unauthorizedError) >= 0) {
        common.showError(rootElement, api.unauthorizedError, cb);
        return
    }
    if (err.indexOf(api.forbiddenError) >= 0) {
        common.showError(rootElement, api.forbiddenError, cb);
        return
    }

    common.showError(err, cb);
    return
}
