<!--
Copyright 2023 Adevinta
-->
<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Create ticket</p>
      <button type="button" class="delete" @click="$parent.close()"/>
    </header>
    <section class="modal-card-body">
      <ErrorDialog :show="showError" :message="errorMessage"></ErrorDialog>
      <form @submit.prevent="createTicket">
        <b-field label="Summary" type="text">
          <b-input
              maxlength="255"
              required
              v-model="summary">
          </b-input>
        </b-field>
        <b-field label="Description" type="text">
          <b-input
              maxlength="30000"
              type="textarea"
              rows="10"
              required
              v-model="description">
          </b-input>
        </b-field>
        <div class="has-text-right">
          <b-button :loading="isLoading" icon-left="save" type="is-info" native-type="submit">Create
          </b-button>
        </div>
      </form>
    </section>
  </div>
</template>

<script lang="ts">
// Import modules
import {Component, Prop, Vue} from "vue-property-decorator";
import loadConfig from "../../common/config";
import tokenProvider from "../../common/token";
import ErrorDialog from "../../components/error.vue";
import {
  Configuration as ApiConf,
  ConfigurationParameters,
  ResponseError,
  TeamsApi,
  TeamsShowRequest
} from "../../services/vulcan-api";
import {FindingsApi, FindingsSubmitAFindingTicketCreationRequest} from "../../services/vulcan-api/apis";
import {Finding, FindingTicket} from "../../services/vulcan-api/models";
import {severityText} from "../utils/utils";

@Component({
  name: "CreateTicketForm",
  components: {
    ErrorDialog
  }
})

export default class FindingTicketCreationForm extends Vue {
  private findingsApi!: FindingsApi;
  private teamsApi?: TeamsApi

  @Prop({required: true, default: ""})
  private findingId!: string;

  @Prop({required: true, default: ""})
  private teamId!: string;

  @Prop({required: true})
  private finding!: Finding;

  private showError: boolean = false;
  private errorMessage: string = "";
  private isLoading: boolean = true;
  private summary: string = "";
  private description: string = "";
  private teamTag: string = "";

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
      this.findingsApi = new FindingsApi(apiConfg);
      this.teamsApi = new TeamsApi(apiConfg);

      await this.loadTeam(
          this.teamId,
          this.teamsApi
      );

      this.isLoading = false;

      this.summary = this.buildCreateTicketSummary(this.finding);
      this.description = this.buildCreateTicketDescription(this.finding);

    } catch (err) {
      this.handleError(err);
    }
  }

  async createTicket() {
    this.isLoading = true;
    try {
      if (this.summary.length>255) {
        throw new Error('The summary is too long.');
      }
      if (this.description.length>30000) {
        throw new Error('The description is too long.');
      }
      const req: FindingsSubmitAFindingTicketCreationRequest = {
        findingId: this.findingId,
        teamId: this.teamId,
        payload: {
          summary: this.summary,
          description: this.description,
          labels: [this.teamTag]
        }
      };
      const finding: FindingTicket = await this.findingsApi.findingsSubmitAFindingTicketCreation(req);
      this.$emit('create');
      this.isLoading = false;
      this.$emit('close');
    } catch (err) {
      this.isLoading = false;
      this.handleError(err);
    }
  }

  private buildCreateTicketSummary(finding: Finding): string {
    const issue = (finding.issue && finding.issue.summary) ? finding.issue.summary : "";
    const asset: string | undefined = finding.target?.identifier;
    const resource = finding.affectedResource;

    return issue + ' | ' + asset + ' | ' + resource;
  }

  private buildCreateTicketDescription(finding: Finding): string {

    let description: string = `* Vulcan URL: [Finding|${window.location.href}]\n`;

    if (finding.issue) {
      if (finding.issue.description) {
        description += `* Description: ${finding.issue.description ?? ""}\n`;
      }
      if (finding.issue.cweId) {
        description += `* CWE: ${finding.issue.cweId}\n`;
      }
    }
    if (finding.score) {
      description += `* Severity: ${severityText(finding.score).toUpperCase()}\n`;
    }
    if (finding.affectedResource) {
      description += `* Affected Resource: ${finding.affectedResource}\n`;
    }
    if (finding.details) {
      description += `* Details: \n{noformat}\n${finding.details}\n{noformat}\n`;
    }
    if (finding.impactDetails) {
      description += `* Impact Details: ${finding.impactDetails}\n`;
    }
    return description;
  }

  private async loadTeam(teamId: string, api: TeamsApi) {
    const req: TeamsShowRequest = {
      teamId: teamId
    };

    const teamInfo = await api.teamsShow(req);
    this.teamTag = teamInfo.tag
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

      if (err.response) {
        const re = err as ResponseError;
        re.response.json().then(data => {
          const message = this.ManageError(data.code, data.error);
          this.errorMessage = `unexpected error: ${message}`;
          this.showError = true;
        });
        return;
      }
      this.errorMessage = `unexpected error: ${err.message}`;
      this.showError = true;
    }
    console.log(`unexpected error: " ${JSON.stringify(err)}`);
    this.showError = true;
  }

  private ErrorToJSON(value?: any | null): any {
    if (!value) {
      return null;
    }
    const obj = JSON.parse(value);

    // This is the format received from vulcan-tracker.
    return {
      'message': obj.message,
      'code': obj.code
    };
  }

  private ManageError(code: number, data: any): string {
    const defaultMessage = 'There has been a problem creating the ticket. Please, retry later.'
    let message: string;
    switch (code) {
      case 403:
      case 401:
      case 404:
      case 500:
        message = defaultMessage;
        break;
      default:
        const jsonError = this.ErrorToJSON(data.error);
        message = (jsonError && jsonError.message) ? jsonError.message : defaultMessage;
        break;
    }
    return message;
  }
}
</script>
