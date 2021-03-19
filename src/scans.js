/*
Copyright 2021 Adevinta
*/

import * as api from './vulcan-api';
import './import-jquery';
import * as common from './common';
// We use require and not import here because is the easier way to load a jquery
// and plugins.
require('./datatables.bulma')(window, $);
require('jquery-datatables-checkboxes/js/dataTables.checkboxes')(window, $);

let config;
let rootElement;
let currentScans;
let table;
let client;
const programID = 'periodic-full-scan';
const programName = 'Periodic Full Scan';

$(document).ready(async () => {
    init();
    // Load config.
    try {
        config = await common.config();
    } catch (err) {
        handleError(err);
        return;
    }
    // Create vulcan-api client and load data.
    client = new api.vulcanAPI(config.api_url, () => api.token(config.ask_credentials));
    loadData(client);
});

function init() {
    rootElement = $(document.body);
}

async function loadData(client) {
    $('#main').css('display', 'none');
    common.showLoading(rootElement);
    let teamID = common.teamID();
    if (!teamID) {
        common.showError('Can not retrieve team id');
        return;
    }
    try {
        // Get the team name.
        const team = await client.team(teamID);
        common.showTeam($('#team'), team.name);
        // Load the last scans for the team;
        currentScans = await client.programScans(teamID, programID);
        if (!scans || scans.length < 1) {
            return;
        }
        showTable(currentScans);
    } catch (error) {
        handleError(error);
        return;
    }
    common.hideLoading();
    $('#main').css('display', '');
}

function showTable(data) {
    if (table) {
        table.destroy();
    }

    data.forEach((scan) => {});
    table = $('#scansTable').DataTable({
        data: data,
        infoCallback: function (settings, start, end, max, total, pre) {
            var api = this.api();
            var pageInfo = api.page.info();
            return `Showing ${parseInt(start, 10)} to ${parseInt(end, 10)} of ${parseInt(max, 10)}`;
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
            info: 'Showing _START_ to _END_ of _TOTAL_ entries'
        },
        iDisplayLength: 20,
        columns: [{
                title: 'Program',
                defaultContent: programName
            },
            {
                title: 'Start Time',
                data: 'start_time',
                render: (data, type, full, meta) => {
                    if (type === 'display') {
                        data = dateToString(data);
                    }
                    return data;
                }
            },
            {
                title: 'End Time',
                data: 'end_time',
                render: (data, type, full, meta) => {
                    if (type === 'display') {
                        if (data) {
                            data = dateToString(data);
                        } else {
                            data = "";
                        }
                    }
                    return data;
                }
            },
            {
                title: 'Status',
                data: 'status'
            },
            {
                title: 'Report',
                data: 'id',
                render: function (data, type, full, meta) {
                    if (type === 'display') {
                        const scan = findScan(currentScans, data);
                        if (scan.status != "FINISHED") {
                            data = "Unavailable";
                        } else {
                            data = `<a class="report-link" href="#" data-scan_id="${data}">View Report</a>`;
                        }
                    }
                    return data;
                }
            }
        ],
        columnDefs: [{}],
        select: {
            style: 'multi'
        },
        order: [
            [2, 'desc']
        ]
    });
    $('.report-link').on('click', (elem) => {
        let scanID = elem.target.getAttribute('data-scan_id');
        showReport(scanID);
    });
    customizeDataTable(table);
}

async function showReport(scanID) {
    try {
        const teamID = common.teamID();
        var url = await buildReportLink(teamID, scanID);
        url = `${url}?team_id=${teamID}&scan_id=${scanID}`
        window.open(url);
    } catch (error) {
        handleError(error);
    }
}

function customizeDataTable(table) {
    // This a little bit hacky and should be changed, but by now, is the easiest
    // way to use a customized filter field we wanted to use.
    let filterBtn = $('#search').clone();
    filterBtn.find('#filter-query').attr('id', 'filter-query-1');
    filterBtn.find('#searchReset').attr('id', 'searchReset-1');
    filterBtn.css('display', '');
    $('#scansTable_filter').html('');
    $('#scansTable_filter').addClass('column is-4');
    $('#scansTable_filter').append(filterBtn);
    $('#filter-query-1').on('keyup', function () {
        table.search($('#filter-query-1').val());
        table.draw();
    });

    $('.dataTables_length').addClass('select');

    $('#searchReset-1').off('click').on('click', function () {
        $('#filter-query-1').val('');
        $('#filter-query-1').click();
    });
}

function handleError(err, cb) {
    if (!err.indexOf) {
        common.showError(rootElement, err, cb);
        return
    }
    if (err.indexOf(api.unauthorizedError) >= 0) {
        common.showSessionExpired(rootElement, config);
        $("#main").remove();
        return
    }
    if (err.indexOf(api.forbiddenError) >= 0) {
        common.showSessionExpired(rootElement, config);
        $("#main").remove();
        return
    }
    common.showError(rootElement, err, cb);
    return
}

function dateToString(data) {
    const d = Date.parse(data);
    const da = new Date(d);
    const month = (da.getMonth() + 1).toString().padStart(2, '0');
    const hours = da.getHours().toString().padStart(2, '0');
    const day = da.getDate().toString().padStart(2, '0');
    const minutes = da.getMinutes().toString().padStart(2, '0');
    return `${da.getFullYear()}-${month}-${day} ${hours}:${minutes}`;
}

async function buildReportLink(teamID, scanID) {
    const report = await client.scanReport(teamID, scanID)
    return report.report;
}

function findScan(scans, scanID) {
    let scan;
    scans.some((s) => {
        if (s.id === scanID) {
            scan = s;
            return true
        }
        return false;
    })
    return scan;
}
