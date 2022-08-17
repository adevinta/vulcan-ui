/*
Copyright 2021 Adevinta
*/

import images from "./images/*.*";



const loadingComponent = $(`
<div id="loading" class="container">
    <section class="hero">
      <div class="hero-body is-paddingless">
        <div class="columns is-mobile is-multiline">
          <div class="column has-text-centered" style="min-width:300px">
            <img src = "${images["vulcan-logo"].png}" style = "width:200px; margin:40px" / >
            <br>
            <h2 class="subtitle" style="margin-top:-18px">
              Loading data ...
            </h2>
            <img src="${images.spinner.gif}" />
          </div>
        </div>
      </div>
    </section>
  </div>
  `);

const errorComponent = $(`
  <article id = "errorDlg" class = "message is-danger" style="display: none" >
      <div class = "message-header" >
        <p>Error</p> 
        <button id="errorClose" class="delete" aria-label="delete" ></button> 
      </div> 
      <div id = "errorBody" class = "has-text-centered message-body" >
      </div> 
      </article>
`)

const warningDialogComponent = $(`<article id="warningDialog" class="message is-warning" style="display: none">
      <div class="message-header">
        <p>Read only access</p>
        <button id="warningClose" class="delete" aria-label="delete"></button>
      </div>
      <div id="warningBody" class="has-text-centered message-body">
      </div>
    </article>`)


const confirmDialogComponent = $(`<div id="confirmDialog" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <div class="modal-card-title">
          <p class="">Remove Members</p>
        </div>
      </header>
      <section id="confirmDialogMessage" class="modal-card-body">
      </section>
      <footer class="modal-card-foot">
        <button id="btnConfirmAccept" class="button">Accept</button>
        <button id="btnConfirmCancel" class="button">Cancel</button>
      </footer>
    </div>
  </div>`);

let warningDialogAdded = false;
async function showWarningDialog(elem, msg) {
  // warningDialog
  let warningDialogAdded = false;
  if (!warningDialogAdded) {
    elem.prepend(warningDialogComponent)
    warningDialogAdded = true
  }
  let re;
  const p = new Promise(function (resolve) {
    re = resolve;
  });

  $("#warningClose").off('click').on('click', () => {
    $("#warningDialog").css('display', "none");
  });

  $("#warningBody").html(msg);

  $("#warningDialog").css('display', "");
  await p;
}


let errorAdded = false


function showError(elem, msg, cb) {
  if (!errorAdded) {
    elem.prepend(errorComponent)
    errorAdded = true
  }
  if (cb) {
    $("#errorClose").css("display", "");
  } else {
    $("#errorClose").css("display", "none");
  }
  hideLoading();
  $("#errorBody").html(msg)
  $("#errorDlg").css("display", "")
}

let loadingAdded = false

function showLoading(elem) {
  if (!loadingAdded) {
    elem.append(loadingComponent)
    loadingAdded = true
  }
  $("#loading").css("display", "")
}

function hideLoading() {
  $("#loading").css("display", "none")
}

async function config() {
  let resp = await fetch("./config.json?q=" + new Date().getTime()); // Avoid caching conflict
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

function showSessionExpired(elem, cfg) {
  hideLoading();

  // If user has already been redirected and session is still
  // invalid, redirect user to main page. Otherwise redirect
  // user to requested page.
  let query = window.location.search;
  if (query.length) query = query.substring(1);
  let isredirect = isRedirect(query);
  let redirectTo = window.location.toString().split("#")[0];

  if (!isDecoded(redirectTo)) redirectTo = decodeURIComponent(redirectTo);
  if (isredirect) redirectTo = "/";
  else redirectTo = redirectTo + "&redirect=true";

  window.location.href = cfg.api_url + `login?redirect_to=${encodeURIComponent(redirectTo)}`;
}

function isRedirect(query) {
  let vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    let kv = vars[i].split('=');
    if (decodeURIComponent(kv[0]) == "redirect" && decodeURIComponent(kv[1]) == "true") {
      return true;
    }
  }
  return false;
}

function isDecoded(uri) {
  uri = uri || '';
  return uri === decodeURIComponent(uri);
}

function showTeam(elem, name) {
  const teamTitle = $(`<span class="icon is-small" style="margin-right:.5em">
              <i class="fa fa-users"></i>
            </span><span>${name}</span>`);
  elem.html($(teamTitle))
}


let confirmDialogAdded = false;
async function askConfirm(elem, message) {
  if (!confirmDialogAdded) {
    elem.prepend(confirmDialogComponent)
    confirmDialogAdded = true
  }
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

function teamID() {
  var qparams = (new URL(document.location)).searchParams;
  let team = qparams.get("team_id");
  return team
}

export {
  showLoading,
  hideLoading,
  showSessionExpired,
  showError,
  config,
  showTeam,
  teamID,
  showWarningDialog,
  askConfirm,
}
