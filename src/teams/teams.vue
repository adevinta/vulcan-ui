<!--
Copyright 2021 Adevinta
-->

<template>
  <div>
    <div class="container">
      <div class="columns is-vcentered">
        <div class="column is-3">
          <img src="../images/vulcan-logo.png" style="width:150px; margin:40px" />
        </div>
        <div class="column is-5">
          <h1 id="team" class="title">
            <span class="icon is-small" style="margin-right:.5em">
              <i class="fa fa-users"></i>
            </span>
            <span>Teams</span>
          </h1>
          <h1 id="team" class="subtitle">
            <span class="icon is-small" style="margin-right:1.0em"></span>
            <span></span>
          </h1>
        </div>
        <div class="column is-4"></div>
      </div>
    </div>
    <hr />
    <keep-alive>
      <router-view :key="$route.fullPath"></router-view>
    </keep-alive>
  </div>
</template>

<script lang="ts">
// Import modules
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Home from "./home/home.vue";
import tokenProvider from "../common/token";
import loadConfig, { Config } from "../common/config";
import {
  Configuration as ApiConf,
  ConfigurationParameters
} from "../services/vulcan-api";
import {
  UserApi
} from "../services/vulcan-api/apis";
import VueRouter, { RouteConfig } from "vue-router";

@Component({
  name: "Teams",
  components: {}
})
export default class Teams extends Vue {
  private apiUrl: string = "";

  async mounted() {
    try {
      // Load the config paramters needed to build the apli clients.
      const conf = await loadConfig();
      const tProvider = tokenProvider(conf);
      const c: ConfigurationParameters = {
        apiKey: tProvider,
        basePath: conf.apiUrl
      };
      this.apiUrl = conf.apiUrl;
      const apiConfg = new ApiConf(c);
      const userApi = new UserApi(apiConfg);

      console.log(tProvider);
      console.log(c);
      console.log(this.apiUrl);
      const prof = await userApi.userProfile()
      console.log(prof);
    } catch (err) {
      console.log(err);
    }
  }
}
</script>
