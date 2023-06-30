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
                            rows="5"
                            required
                            v-model="description">
                    </b-input>
                </b-field>
                <div class="has-text-right">
                    <b-button :loading="isLoading" icon-left="save" type="is-info" native-type="submit">Create</b-button>
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
import {Configuration as ApiConf, ConfigurationParameters, Issue} from "../../services/vulcan-api";
import {FindingsApi, FindingsSubmitAFindingTicketCreationRequest} from "../../services/vulcan-api/apis";
import {FindingTicket, Finding} from "../../services/vulcan-api/models";

@Component({
    name: "CreateTicketForm",
    components: {
        ErrorDialog
    }
})

export default class FindingTicketCreationForm extends Vue {
    private findingsApi!: FindingsApi;

    @Prop({required: true, default: ""})
    private findingId!: string;

    @Prop({required: true, default: ""})
    private teamId!: string;

    @Prop({required: true})
    private finding!: Finding

    private showError: boolean = false;
    private errorMessage: string = "";
    private isLoading: boolean = true;

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
            this.isLoading = false;

        } catch (err) {
            this.handleError(err);
        }
    }

    get summary() {
        return (this.finding.issue && this.finding.issue.summary) ? this.finding.issue.summary: "";
    }

    get description() {
        return this.buildCreateTicketDescription(this.finding);
    }

    async createTicket() {
        this.isLoading = true;
        try {
            const req: FindingsSubmitAFindingTicketCreationRequest = {
                findingId: this.findingId,
                teamId: this.teamId,
                payload: {
                    summary: this.summary,
                    description: this.description,
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

    private buildCreateTicketDescription(finding: Finding): string {

        let description: string = ""

        if (finding.issue) {
            description += `Description: ${finding.issue.description ?? ""}\n`
            description += `CWE: ${finding.issue.cweId ?? ""}\n`
        }
        description += `Affected Resource: ${finding.affectedResource ?? ""}\n`
        description += `Current Exposure: ${finding.currentExposure ?? ""}\n`
        description += `Details: ${finding.details ?? ""}\n`
        description += `Impact Details: ${finding.impactDetails ?? ""}\n`
        description += `Status: ${ finding.status ?? ""}\n`

        description += `Vulcan URL: ${window.location.href}\n`

        return description
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
