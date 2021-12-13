<!--
Copyright 2021 Adevinta
-->

<template>
  <div>
    <div class="container">
      <div class="tile">
        <div class="tile is-2 is-vertical"></div>
        <div class="tile is-vertical">
          <template>
            <ErrorDialog :show="showError" :message="errorMessage"></ErrorDialog>
            <h1 class="title" v-if="teamId==''">Create new team</h1>
            <h1 class="title" v-if="teamId!=''">Edit team</h1>
            <form @submit.prevent="saveTeam">
              <section>
                <b-field label="Name">
                  <b-input v-model="name"></b-input>
                </b-field>
                <b-field label="Description">
                  <b-input v-model="description"></b-input>
                </b-field>
                <b-field label="Tag">
                  <b-input v-model="tag"></b-input>
                </b-field>
                <div class="buttons is-right">
                  <b-button type="is-primary" native-type="submit">Save</b-button>
                </div>
              </section>
            </form>
          </template>
        </div>
        <div class="tile is-2 is-vertical"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import VueRouter, { RouteConfig } from "vue-router";
import loadConfig, { Config } from "../../common/config";
import tokenProvider from "../../common/token";
import {
  Configuration as ApiConf,
  ConfigurationParameters
} from "../../services/vulcan-api";
import {
  TeamsApi,
  TeamsCreateRequest,
  TeamsShowRequest,
  TeamsUpdateRequest
} from "../../services/vulcan-api/apis";
import ErrorDialog from "../../components/error.vue";
import { DialogProgrammatic as Dialog } from "buefy";

@Component({
  name: "Home",
  components: {
    ErrorDialog
  }
})
export default class Home extends Vue {
  private teamsApi!: TeamsApi;

  private teamId: string = "-";
  private name: string = "";
  private description: string = "";
  private tag: string = "";

  private showError: boolean = false;
  private errorMessage: string = "";

  async mounted() {
    try {
      // Load the config.
      const conf = await loadConfig();
      const tProvider = tokenProvider(conf);
      const c: ConfigurationParameters = {
        apiKey: tProvider,
        basePath: conf.apiUrl
      };

      // Build the api clients.
      const apiConfg = new ApiConf(c);
      this.teamsApi = new TeamsApi(apiConfg);

      var qparams = new URL(document.location.toString()).searchParams;
      this.teamId = qparams.get("team_id") || "";

      if (this.teamId != "") {
        const req: TeamsShowRequest = {
          teamId: this.teamId
        };

        let team = await this.teamsApi.teamsShow(req);
        this.name = team.name;
        this.description = team.description;
        this.tag = team.tag;
      }
      console.log(this.teamId);
    } catch (err) {
      this.handleError(err);
    }
  }

  async saveTeam() {
    let msg = "";
    try {
      if (this.teamId == "") {
        msg = "Team created with success";
        console.log("saveTeam");
        const req: TeamsCreateRequest = {
          payload: {
            description: this.description,
            name: this.name,
            tag: this.tag
          }
        };

        const team = await this.teamsApi.teamsCreate(req);
        this.teamId=team.id;
      } else {
        msg = "Team updated with success";
        console.log("updateTeam");
        const req: TeamsUpdateRequest = {
          teamId: this.teamId,
          payload: {
            description: this.description,
            name: this.name,
            tag: this.tag
          }
        };

        const team = await this.teamsApi.teamsUpdate(req);
      }
      Dialog.alert({
        title: "Success",
        message: msg,
        type: "is-primary",
        hasIcon: true,
        icon: "check-circle",
        iconPack: "fa",
        ariaRole: "alertdialog",
        ariaModal: true
      });
    } catch (err) {
      this.handleError(err);
    }
  }

  private handleError(err: any) {
    if (err instanceof Response) {
      console.log(`${err.status} ": " ${err.statusText}`);
      this.errorMessage = `unexpected error calling vulcan api, status code: ${
        err.status
      }`;
      this.showError = true;
      return;
    }
    if (err instanceof Error) {
      console.log(`error: " ${err.message}`);
      this.errorMessage = `unexpected error: ${err.message}`;
      this.showError = true;
      return;
    }
    console.log(`unexpected error: " ${JSON.stringify(err)}`);
    this.showError = true;
  }
}
</script>
