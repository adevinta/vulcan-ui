<!--
Copyright 2021 Adevinta
-->

<template>
  <div>
    <Session :show="showSession" :apiUrl="apiUrl">
      <ErrorDialog :show="showError" :message="errorMessage"></ErrorDialog>
      <Loading :show="loading">
         <body>
        <div class="container" id="main">
            <div class="columns is-vcentered">
                <div class="column is-3">
                    <img src="../images/vulcan-logo.png" style="width:150px; margin:10px">
                </div>
                <div class="column is-4">
                    <h1 class="title">
                        Vulcan Admin Console
                    </h1>
                </div>
            </div>
            <router-view></router-view>
        </div>
    </body>
      </Loading>
    </Session>
  </div>
</template>

<script lang="ts">
// Import modules
import { Component, Prop, Vue } from "vue-property-decorator";
import Loading from "../components/loading.vue";
import ErrorDialog from "../components/error.vue";
import Session from "../components/session.vue";
import loadConfig, { Config } from "../common/config";
import tokenProvider from "../common/token";
import teamID from "../common/team";
import {
  Configuration as ApiConf,
  ConfigurationParameters
} from "../services/vulcan-api";
import {
  AssetsApi,
  AssetsListRequest,
  AssetsUpdateRequest,
  TeamsApi,
  TeamsShowRequest
} from "../services/vulcan-api/apis";
import { Asset, AssetUpdatePayload, Team } from "../services/vulcan-api/models";
import VueRouter, { RouteConfig } from "vue-router";

@Component({
  name: "Index",
  components: {
    Loading,
    ErrorDialog,
    Session,
  }
})
export default class Index extends Vue {
  $refs!: {
    table: any;
  };

  // Fields.
  private team: string = "";

  private assetsApi?: AssetsApi;

  private teamsApi?: TeamsApi;

  private teamID?: string;

  private showError: boolean = false;

  private errorMessage: string = "";

  private loading: boolean = true;

  private showSession: boolean = false;

  private apiUrl: string = "";


  // Properties.
 
  // Hooks.
  async mounted() {
       this.loading = false;
  }
}
</script>
