<!--
Copyright 2021 Adevinta
-->

<template>
  <div>
    <Session :show="showSession" :apiUrl="apiUrl">
      <ErrorDialog :show="showError" :message="errorMessage"></ErrorDialog>
      <Loading :show="loading">
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column is-3">
              <img src="../images/vulcan-logo.png" style="width:150px; margin:40px">
            </div>
            <div class="column is-5">
              <h1 id="team" class="title">
                <span class="icon is-small" style="margin-right:.5em">
                  <i class="fa fa-users"></i>
                </span>
                <span>{{ team }}</span>
              </h1>
            </div>
            <div class="column is-4">
              <b-field label="Select a team" label-position="on-border" >
                <b-select v-model="teamId" @input="onSelectTeam" placeholder="Select a subject">
                  <option v-for="userTeam in userTeamsList" :value="userTeam.id" v-bind:key="userTeam.id">{{ userTeam.name }}</option>
                </b-select>
              </b-field>
            </div>
          </div>
        </div>
        <hr/>
        <router-view v-on:handleerror="handleError"></router-view>
      </Loading>
    </Session>
  </div>
</template>

<script lang="ts">
// Import modules
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Loading from "../components/loading.vue";
import ErrorDialog from "../components/error.vue";
import Session from "../components/session.vue";
import Home from "./home/home.vue";
import loadConfig, { Config } from "../common/config";
import tokenProvider from "../common/token";
import teamID from "../common/team";
import {
  Configuration as ApiConf,
  ConfigurationParameters
} from "../services/vulcan-api";
import {
  TeamsApi, 
  UserApi,
  TeamsListRequest,
  UserListTeamsRequest,
} from "../services/vulcan-api/apis";
import VueRouter, { RouteConfig } from "vue-router";

@Component({
  name: "LiveReport",
  components: {
    Loading,
    ErrorDialog,
    Session,
    Home,
  }
})

export default class LiveReport extends Vue {
   private loading: boolean = true;

   private showSession: boolean = false;
   private apiUrl: string = "";

   private showError: boolean = false;
   private errorMessage: string = "";

   private team: string = "";
   private teamId: string = "";
   private userApi?: UserApi;
   private teamsApi?: TeamsApi;
   private userProfile?: User;
   private userTeamsList: Team[] = [];

   async mounted() {
     try {
      // Load the config.
      const conf = await loadConfig();
      const tProvider = tokenProvider(conf);
      const c: ConfigurationParameters = {
        apiKey: tProvider,
        basePath: conf.apiUrl
      };
      this.apiUrl = conf.apiUrl;

       // Build the api clients.
       const apiConfg = new ApiConf(c);
       this.teamsApi = new TeamsApi(apiConfg);
       this.userApi = new UserApi(apiConfg);

       // Load team.
       this.teamId = teamID();
       await this.loadTeam(
         this.teamId,
         this.teamsApi
       );

       await this.getUserProfile(
         this.userApi
       );

       await this.userListTeams(
         this.userApi,
         this.teamsApi
       );
     } catch (err) {
       this.handleError(err);
     } finally {
       this.loading = false;
     }
   }

  private async loadTeam(teamId: string, api: TeamsApi) {
    const req: TeamsShowRequest = {
      teamId: teamId
    };

    const teamInfo = await api.teamsShow(req);
    
    this.team = teamInfo.name || ""
  }

  private async getUserProfile(api: UserApi) {
    this.userProfile = await api.userProfile();
  }

  private async userListTeams(userApi: UserApi, teamsApi: TeamsApi) {
    if (this.userProfile.admin || this.userProfile.observer) {
      const req: TeamsListRequest = {
        tag: undefined // get all teams
      };
      this.userTeamsList = await teamsApi.teamsList(req);
    } else {
      const req: UserListTeamsRequest = {
        userId: this.userProfile.id
      };
      this.userTeamsList = await userApi.userListTeams(req);
    }
    if (this.userTeamsList.length > 1) {
      this.userTeamsList = this.userTeamsList.sort((t1, t2) => t1.name.localeCompare(t2.name));
    }
  }

  private handleError(err: any) {
    if (err instanceof Response) {
      switch (err.status) {
        case 403:
        case 401:
          this.showSession = true;
          break;
        default:
          console.log(`${err.status} ": " ${err.statusText}`);
          this.errorMessage = `unexpected error calling vulcan api, status code: ${
            err.status
          }`;
          this.showError = true;
          break;
      }
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

  onSelectTeam(){
    var qparams = new URL(document.location.toString()).searchParams;
	  qparams.set('team_id',this.teamId);
    window.location.search = qparams.toString();
  }
}
</script>