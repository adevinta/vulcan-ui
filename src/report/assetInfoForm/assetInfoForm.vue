<!--
Copyright 2021 Adevinta
-->

<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Asset Info</p>
      <button type="button" class="delete" @click="$parent.close()" />
    </header>
    <section class="modal-card-body">
        <ErrorDialog :show="showError" :message="errorMessage"></ErrorDialog>
          <json-viewer :expand-depth=4 :value="data"></json-viewer>
    </section>
  </div>
</template>

<script lang="ts">
// Import modules
import { Vue, Component, Prop } from "vue-property-decorator";
import loadConfig, { Config } from "../../common/config";
import tokenProvider from "../../common/token";
import teamID from "../../common/team";
import ErrorDialog from "../../components/error.vue";
import JsonViewer from 'vue-json-viewer'
import {
  Configuration as ApiConf,
  ConfigurationParameters
} from "../../services/vulcan-api";
import {
  AssetsApi,
  AssetsListRequest,
} from "../../services/vulcan-api/apis";
import {
  Listassetentry,
} from "../../services/vulcan-api/models";

@Component({
  name: "AssetInfoForm",
  components: {
    ErrorDialog,
    JsonViewer,
  }
})

export default class AssetInfoForm extends Vue {
  private assetsApi!: AssetsApi;
  private data: Listassetentry[] = [];

  @Prop({ required: true, default: "" })
  private assetIdentifier!: string;

  @Prop({ required: true, default: "" })
  private teamId!: string;

  private showError: boolean = false;
  private errorMessage: string = "";

  async mounted() {
    try {
      // Load the config
      const conf = await loadConfig();
      const tProvider = tokenProvider(conf);
      const c: ConfigurationParameters = {
        apiKey: tProvider,
        basePath: conf.apiUrl
      };

      // Build the api clients
      const apiConfg = new ApiConf(c);
      this.assetsApi = new AssetsApi(apiConfg);

      // Retrieve assets data by identifier
      const assetReq: AssetsListRequest = {
          teamId: this.teamId,
          identifier: this.assetIdentifier,
      }
      this.data = await this.assetsApi.assetsList(assetReq);
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
