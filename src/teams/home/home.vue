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
            <b-collapse :open="false" aria-id="dangerZone" v-if="teamId!=''">
              <template #trigger>
                <b-button label="Danger Zone" class="button is-light" aria-controls="dangerZone" />
              </template>
              <div class="notification">
                <div class="buttons">
                  <b-button label="Delete Team" type="is-danger" @click="confirmDelete" />
                </div>
              </div>
            </b-collapse>
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
  TeamsUpdateRequest,
  TeamsDeleteRequest
} from "../../services/vulcan-api/apis";
import ErrorDialog from "../../components/error.vue";
import router from "../router";
import { DialogProgrammatic as Dialog } from "buefy";

@Component({
  name: "Home",
  components: {
    ErrorDialog
  }
})
export default class Home extends Vue {
  private teamsApi!: TeamsApi;

  private teamId: string = "";
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
        this.teamId = team.id;
        this.description = team.description;
        this.name = team.name;
        this.tag = team.tag;
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
        this.description = team.description;
        this.name = team.name;
        this.tag = team.tag;
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
      window.history.replaceState(null, null, "?team_id=" + this.teamId);
    } catch (err) {
      this.handleError(err);
    }
  }

  async handleError(err: any) {
    if (err instanceof Response) {
      console.log(`${err.statusText} ": " ${err.statusText}`);
      this.errorMessage = `unexpected error calling vulcan api: ${await err.text()}`;
      this.showError = true;
      return;
    }
    if (err instanceof Error) {
      console.log(JSON.stringify(err, null, 4));
      console.log(`error: " ${err.message}`);
      this.errorMessage = `unexpected error: ${err.message}`;
      this.showError = true;
      return;
    }
    console.log(`unexpected error: " ${JSON.stringify(err)}`);
    this.showError = true;
  }

  confirmDelete() {
    this.$buefy.dialog.confirm({
      title: "Deleting team",
      message:
        "Are you sure you want to <b>delete</b> this team? This action cannot be undone.",
      confirmText: "Delete Team",
      type: "is-danger",
      hasIcon: true,
      onConfirm: () => {
        this.deleteTeam(this.teamId);
      }
    });
  }

  async deleteTeam(teamId: string) {
    const req: TeamsDeleteRequest = {
      teamId: this.teamId
    };

    const team = await this.teamsApi.teamsDelete(req);
    this.$buefy.dialog.confirm({
      message: "Team deleted with sucess",
      onConfirm: () => window.close(),
      type: "is-danger",
      canCancel: false,
    });
  }
}
</script>
