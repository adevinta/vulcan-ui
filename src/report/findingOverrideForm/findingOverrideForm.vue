<!--
Copyright 2021 Adevinta
-->

<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Update Status</p>
      <button type="button" class="delete" @click="$parent.close()" />
    </header>
    <section class="modal-card-body">
      <ErrorDialog :show="showError" :message="errorMessage"></ErrorDialog>
      <form @submit.prevent="updateStatus">
        <b-field label="New status for this finding">
          <b-select placeholder="Status" required v-model="status">
            <option value="FALSE_POSITIVE">False Positive</option>
            <option value="OPEN">Open</option>
          </b-select>
        </b-field>
        <b-field label="Additional Information" type="text">
          <b-input
            maxlength="200"
            type="textarea"
            rows="5"
            required
            placeholder="Provide additional information explaining why this finding is being marked as a false positive."
            v-model="notes"
          ></b-input>
        </b-field>

        <b-message
          title="Caution"
          type="is-warning"
          has-icon
          size="is-small"
          v-if="status=='FALSE_POSITIVE'"
        >
          <p>
            Plase, keep in mind that the action of marking a finding as
            <strong>
              false positive is NOT the same
              as risk acceptance
            </strong>. This action must be used with
            <strong>caution</strong>, only for
            findings that are real false positives.
          </p>
          <br />
          <p>
            The Vulcan team is aware of the need of the risk acceptance feature and already have included it as part
            of the product development roadmap.
          </p>
        </b-message>

        <div class="has-text-right">
          <b-button icon-left="save" type="is-info" native-type="submit">Update</b-button>
        </div>
      </form>
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
import {
  Configuration as ApiConf,
  ConfigurationParameters
} from "../../services/vulcan-api";
import {
  FindingsApi,
  FindingsFindingOverrideRequest
} from "../../services/vulcan-api/apis";
import {
  Finding,
  FindingOverridePayload
} from "../../services/vulcan-api/models";

@Component({
  name: "FindingOverrideForm",
  components: {
    ErrorDialog
  }
})

export default class FindingOverrideForm extends Vue {
  private showRiskAcceptanceWarning: boolean = false;
  private findingsApi!: FindingsApi;
  private status: string = "";
  private notes: string = "";

  @Prop({ required: true, default: "" })
  private findingId!: string;

  @Prop({ required: true, default: "" })
  private teamId!: string;

  private showError: boolean = false;
  private errorMessage: string = "";

  async mounted() {
    console.log("xfindingID: " + this.findingId);
    console.log("xteamID: " + this.teamId);
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
      this.findingsApi = new FindingsApi(apiConfg);
    } catch (err) {
      this.handleError(err);
    } 
  }

  async updateStatus() {
    try {
      const req: FindingsFindingOverrideRequest = {
        findingId: this.findingId,
        teamId: this.teamId,
        payload: {
          notes: this.notes,
          status: this.status,
        }
      };

      await this.findingsApi.findingsFindingOverride(req);
      this.$emit('update');
      this.$emit('close');
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
