<!--
Copyright 2023 Adevinta
-->
<template>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Create ticket</p>
        <button type="button" class="delete" @click="$parent.close()" />
      </header>
      <section class="modal-card-body">
        <ErrorDialog :show="showError" :message="errorMessage"></ErrorDialog>
        <form @submit.prevent="createTicket">
          <b-field label="Summary" type="text">
            <b-input
                    maxlength="255"
                    required
                    v-model="summary">{{ summary }}</b-input>
          </b-field>
          <b-field label="Description" type="text">
            <b-input
                    maxlength="30000"
                    type="textarea"
                    rows="5"
                    required
                    v-model="description"
            >{{ description }}</b-input>
          </b-field>
          <div class="has-text-right">
            <b-button icon-left="save" type="is-info" native-type="submit">Create</b-button>
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
  import ErrorDialog from "../../components/error.vue";
  import {
    Configuration as ApiConf,
    ConfigurationParameters
  } from "../../services/vulcan-api";
  import {
    FindingsApi,
FindingsSubmitAFindingTicketCreationRequest
  } from "../../services/vulcan-api/apis";
  import {
    Finding,
FindingTicketCreationPayload,
FindingTicketcreation
  } from "../../services/vulcan-api/models";

  @Component({
    name: "CreateTicketForm",
    components: {
      ErrorDialog
    }
  })

  export default class FindingTicketCreationForm extends Vue {
    private findingsApi!: FindingsApi;

    @Prop({ required: true, default: "" })
    private findingId!: string;

    @Prop({ required: true, default: "" })
    private teamId!: string;

    @Prop({ required: true, default: "" })
    private summary!: string;

    @Prop({ required: true, default: "" })
    private description!: string;

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
        this.findingsApi = new FindingsApi(apiConfg);

      } catch (err) {
        this.handleError(err);
      }
    }

    async createTicket() {
      try {
        const req: FindingsSubmitAFindingTicketCreationRequest = {
          findingId: this.findingId,
          teamId: this.teamId,
          payload: {
            summary: this.summary,
            description: this.description,
          }
        };

        const finding: FindingTicketcreation  = await this.findingsApi.findingsSubmitAFindingTicketCreation(req);
        this.$emit('create');
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
