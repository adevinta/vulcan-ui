/*
Copyright 2021 Adevinta
*/

import * as api from './vulcan-api';
import './import-jquery';
import * as common from './common';
const Plotly = window.Plotly;

let config;
let rootElement;
let currentScans;
let client;

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
        common.showError('Cannot retrieve team ID.');
        return;
    }
    try {
        // Get the team name.
        const team = await client.team(teamID);
        common.showTeam($('#team'), team.name);
        // Get current date and current date minus 45 days.
        var today = new Date();
        var date = today.toISOString().split('T')[0];
        today.setDate(today.getDate() - 45);
        var oldDate = today.toISOString().split('T')[0];
        // Load the stats for the team.
        let [
            mttr, mttrOld,
            fixedIssues, fixedIssuesOld,
            openIssues, openIssuesOld,
            assets,
        ] = await Promise.all([
            client.mttr(teamID, "", date), client.mttr(teamID, "", oldDate),
            client.fixedIssues(teamID, date, "", ""), client.fixedIssues(teamID, oldDate, "", ""),
            client.openIssues(teamID, date, "", ""), client.openIssues(teamID, oldDate, "", ""),
            client.assets(teamID),
        ]);
        var dashboardData = {
            mttr: mttr.mttr,
            mttrOld: mttrOld.mttr,
            open: openIssues.open_issues,
            openOld: openIssuesOld.open_issues,
            fixed: fixedIssues.fixed_issues,
            fixedOld: fixedIssuesOld.fixed_issues,
            assets: assets.length,
        };
        loadDashboard(dashboardData);
    } catch (error) {
        handleError(error);
        return;
    }
    common.hideLoading();
    $('#main').css('display', '');
}

const mttrDataTemplate = [
    {
        domain: { x: [0, 1], y: [0, 1] },
        title: {
            text: "<br>&#32;",
            font: {
                size: 16,
            },
        },
        delta: {
            increasing: { symbol: "", color: "crimson" },
            decreasing: { symbol: "", color: "limegreen" },
            valueformat: "+.0f",
        },
        type: "indicator",
        mode: "gauge+number+delta",
        gauge: {
            axis: { range: [null, 120] },
            bar: {
                color: "black",
                line: {
                    color: "white",
                    width: 2,
                },
            },
            borderwidth: 0,
            bgcolor: "gainsboro",
        },
        number: {
            valueformat: ".0f",
            suffix: " d",
        },
    }
];

let mttrDataWarningTemplate = JSON.parse(JSON.stringify(mttrDataTemplate));
mttrDataWarningTemplate[0].gauge.bgcolor = "crimson";
mttrDataWarningTemplate[0].gauge.steps = [{ range: [0, 30], color: "limegreen" }];

const fixingDataTemplate = [{
    title: {
        text: "<br>&#32;",
        font: {
            size: 16,
        },
    },
    values: [],
    labels: ['Open', 'Fixed'],
    marker: {
        colors: ['crimson', 'limegreen'], 
    },
    type: 'pie',
    textinfo: "label+percent",
    textposition: "inside",
    insidetextorientation: "horizontal",
    automargin: false,
}];

const changeDataTemplate = [
    {
        type: "indicator",
        mode: "number+delta",
        title: {
            text: "Open",
            font: {
                size: 14,
            },
        },
        number: {
            font: {
                size: 16,
            },
        },
        delta: {
            valueformat: "+.0f",
            increasing: { symbol: "", color: "crimson" },
            decreasing: { symbol: "", color: "limegreen" },
            font: {
                size: 14,
            },
        },
        domain: { x: [0.15, 0.5], y: [0, 0] },
    },
    {
        type: "indicator",
        mode: "number+delta",
        title: {
            text: "Fixed",
            font: {
                size: 14,
            },
        },
        number: {
            font: {
                size: 16,
            },
        },
        delta: {
            valueformat: "+.0f",
            increasing: { symbol: "", color: "limegreen" },
            decreasing: { symbol: "", color: "crimson" },
            font: {
                size: 14,
            },
        },
        domain: { x: [0.45, 0.9], y: [0, 0] },
    },
];

function loadDashboard(data) {
    const mttrLayout = { width: 300, height: 200, margin: { t: 20, b: 0 } };
    for (const severity of ["critical", "high", "medium", "low"]) {
        let mttrData;
        if (severity == "critical" || severity == "high") {
            mttrData = JSON.parse(JSON.stringify(mttrDataWarningTemplate));
            if (data.mttr[severity] > 720) {
                mttrData[0].number.font = {color: "crimson"};
            } else {
                mttrData[0].number.font = {color: "limegreen"};
            }
        } else {
            mttrData = JSON.parse(JSON.stringify(mttrDataTemplate));
        }
        mttrData[0].value = data.mttr[severity] / 24;
        mttrData[0].delta.reference = data.mttrOld[severity] / 24;
        mttrData[0].title.text = severity.charAt(0).toUpperCase() + severity.slice(1) + mttrData[0].title.text;
        Plotly.newPlot('mttr-' + severity, mttrData, mttrLayout);
    }

    const fixingLayout = { width: 300, height: 200, margin: { t: 10, b: 10, l: 10, r: 10 }, showlegend: false };
    for (const severity of ["critical", "high", "medium", "low"]) {
        let fixingData = JSON.parse(JSON.stringify(fixingDataTemplate));
        fixingData[0].values = [data.open[severity], data.fixed[severity]];
        fixingData[0].title.text = severity.charAt(0).toUpperCase() + severity.slice(1) + fixingData[0].title.text;
        Plotly.newPlot('fixing-' + severity, fixingData, fixingLayout);
    }

    const changeLayout = { width: 300, height: 100, margin: { t: 5, b: 5, l: 5, r: 5 } };
    for (const severity of ["critical", "high", "medium", "low"]) {
        let changeData = JSON.parse(JSON.stringify(changeDataTemplate));
        changeData[0].value = data.open[severity];
        changeData[0].delta.reference = data.openOld[severity];
        changeData[1].value = data.fixed[severity];
        changeData[1].delta.reference = data.fixedOld[severity];
        Plotly.newPlot('change-' + severity, changeData, changeLayout);
    }

    const sizeLayout = { width: 1200, height: 150, margin: { t: 25, r: 25, l: 25, b: 25 } };
    let sizeData = [
        {
            type: "indicator",
            mode: "number",
            value: data.assets,
            title: {
                text: "Total",
            },
            domain: { x: [0, 0.50], y: [0, 0] },
        },
        {
            type: "indicator",
            mode: "number",
            value: "WIP",
            title: {
                text: "Coverage (WIP)",
                font: {
                    color: "darkgrey",
                },
            },
            number: {
                font: {
                    color: "darkgrey",
                },
            },
            domain: { x: [0.50, 1], y: [0, 0] },
        },
    ];
    Plotly.newPlot('size', sizeData, sizeLayout);
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
