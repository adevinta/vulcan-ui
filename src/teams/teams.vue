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
    <keep-alive v-if="teamsCrudEnabled">
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

@Component({
  name: "Teams",
  components: {}
})
export default class Teams extends Vue {
  private apiUrl: string = "";
  private teamsCrudEnabled: boolean = false;

  async mounted() {
    try {
      // Load the config paramters needed to build the apli clients.
      const conf = await loadConfig();
      this.teamsCrudEnabled = (conf.teamsCrud === true);
    } catch (err) {
      console.log(err);
    }
  }
}
</script>
