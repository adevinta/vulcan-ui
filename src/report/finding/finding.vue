<!--
Copyright 2021 Adevinta
-->

<template>
  <div width="100%">
    <div class="card">
      <div class="card-content">
        <!-- /* FINDING DETAILS */ -->
        <div class="content">
          <div>              
            <h4 class="title is-4">{{ findings[0].issue.summary }}</h4>
            <hr />
          </div>
          <div>
            <VueShowdown :markdown="findings[0].issue.description" :extensions="['htmlSanitize']" />
          </div>
          <hr />
          <table class="table is-striped is-fullwidth">
            <tr>
              <td class="has-text-weight-bold">Asset</td>
              <td style="width:100%" >{{ findings[0].target.identifier }}</td>
            </tr>
            <tr>
              <td class="has-text-weight-bold">Severity Score</td>
              <td style="width:100%">
                <!-- <span class="tag">{{ propsFindingDetail.row.score }}</span> -->
                <!-- <span
                  v-bind:class="severityStyle(propsFindingDetail.row.score)"
                >{{ severityText(propsFindingDetail.row.score) }}</span> -->
              </td>
            </tr>
            <!-- <tr>
              <td class="has-text-weight-bold">Status</td>
              <td style="width:100%">
                <span
                  v-bind:class="statusClass(propsFindingDetail.row.status)"
                >{{ (propsFindingDetail.row.status.charAt(0).toUpperCase() + propsFindingDetail.row.status.toLowerCase().slice(1)).replace("False_positive", "False Positive") }}</span>
                <b-button type="is-info is-text is-small"  inverted
                    @click="updateStatus()">
                    <span>False Positive</span>
                </b-button>
              </td>
            </tr> -->
           <!-- <tr>
             <td v-if="propsFindingDetail.row.details" class="has-text-weight-bold">Details</td>
              <td style="width:100%">
                <pre style="white-space:pre-wrap;">{{ propsFindingDetail.row.details }}</pre>
              </td>
            </tr> -->
            <!-- <tr>
              <td class="has-text-weight-bold">Impact</td>
              <td style="width:100%">{{ propsFindingDetail.row.impactDetails }}</td>
            </tr> -->
            <tr>
              <td class="has-text-weight-bold">Recommendations</td>
              <td style="width:100%">
                <table>
                  <tr
                    v-for="recommendation in findings[0].issue.recommendations"
                    :key="recommendation"
                  >
                    <td>
                      <VueShowdown :markdown="recommendation" :extensions="['htmlSanitize']" />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr v-if="findings[0].issue.referenceLinks">
              <td class="has-text-weight-bold">References</td>
              <td style="width:100%">
                <a
                  v-for="reference in findings[0].issue.referenceLinks"
                  :key="reference"
                  target="_blank"
                  rel="noopener noreferrer"
                  :href="reference"
                  class="button reference"
                >
                  <span>{{ urlDomain(reference) }}</span>
                  <span class="icon is-small">
                    <i class="fa fa-external-link"></i>
                  </span>
                </a>
              </td>
            </tr>

            <tr>
              <td class="has-text-weight-bold">Sources</td>
              <td
                style="width:100%"
              >
              <!-- {{ propsFindingDetail.row.source.name }} / {{ propsFindingDetail.row.source.component }} -->
              </td>
            </tr>

            <tr >
                <td class="has-text-weight-bold">Affected Resources</td>
                <td
                    style="width:100%"
                >
                    <table class="table is-striped">
                    <thead>
                    </thead>
                    <tr v-for="finding in findings" v-bind:key="finding.id">
                        <td class="has-text-weight-bold">{{ finding.affectedResource }}</td>
                        <td style="width:20%">
                            <span class="tag">{{ finding.score }}</span>
                            <span v-bind:class="severityStyle(finding.score)">{{ severityText(finding.score) }}</span>
                        </td>                        
                        <td style="width:20%">
                            <span v-bind:class="statusClass(finding.status)"
                            >{{ (finding.status.charAt(0).toUpperCase() + finding.status.toLowerCase().slice(1)).replace("False_positive", "False Positive") }}</span>
                            <b-button type="is-info is-text is-small"  inverted
                                @click="updateStatus(finding.id)">
                                <span>False Positive</span>
                            </b-button>
                        </td>
                        <!-- <td style="width:100%"></td> -->
                    </tr>
                    </table>
                </td>
            </tr>

            <!-- <tr v-for="resource in propsFindingDetail.row.resources" v-bind:key="resource.name">
              <td class="has-text-weight-bold">{{ resource.name }}</td>
              <td style="width:100%">
                <table class="table is-striped">
                  <thead>
                    <th v-for="header in resource.attributes">{{ header }}</th>
                  </thead>
                  <tr v-for="(row) in resource.resources">
                    <td v-for="header in resource.attributes">
                      <VueShowdown :markdown="row[header]" :extensions="['htmlSanitize','noBlockquote']" />
                    </td>
                  </tr>
                </table>
              </td>
            </tr> -->
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import FindingOverwriteForm from "../findingOverwriteForm/findingOverwriteForm.vue";
import { severityStyle, severityText, statusClass, urlDomain } from "../utils/utils";
import { ModalProgrammatic as Modal } from 'buefy';
import { BModalComponent } from "buefy/types/components";
import {
   FindingsApi,
   FindingsListFindingsRequest,
} from "../../services/vulcan-api/apis";
import {
  Finding,
  FindingsList,
} from "../../services/vulcan-api/models";
import {
  Configuration as ApiConf,
  ConfigurationParameters,
} from "../../services/vulcan-api";
import loadConfig, { Config } from "../../common/config";
import tokenProvider from "../../common/token";

@Component({
  name: "FindingDetails",
  components: {
      FindingOverwriteForm,
  }
})
export default class FindingDetails extends Vue {
  private findingId?: string;
  
  // The team identifier
  @Prop({ required: true, default: "" })
  private teamId!: string;

  @Prop({ required: true, default: "" })
  private targetId!: string;

  @Prop({ required: true, default: "" })
  private issueId!: string;

  private findings: Finding[] = [
      {
        issue: {
            description: "loading...",
            recommendations: new Array(),
            referenceLinks: new Array(),
        },
        target: {
            identifier: "loading..."
        },
        status: "loading...",
        source: {},
        score: 0,
        resources: new Array(),
      },
  ]; 


  private isComponentModalActive: boolean = true;
  private severityStyle = severityStyle
  private severityText = severityText
  private statusClass = statusClass
  private urlDomain = urlDomain

  // findingsApi is used to retrieve the list of findings
  private findingsApi!: FindingsApi;

  private statusModal!: BModalComponent

  async mounted() {
    try {
        // Load the config.
        const conf = await loadConfig();
        const tProvider = tokenProvider(conf);
        const c: ConfigurationParameters = {
            apiKey: tProvider,
            basePath: conf.apiUrl
        };

        const apiConfg = new ApiConf(c);
        this.findingsApi = new FindingsApi(apiConfg);

        await this.loadFindings(this.teamId, this.issueId, this.targetId, this.findingsApi)
    } catch (err) {
    //   this.handleError(err);
    }
  }

  private async loadFindings(teamId: string, issueId: string, targetId: string, api: FindingsApi){
    const req: FindingsListFindingsRequest = {
       teamId: teamId,
       issueID: issueId,
       targetID: targetId,
    };

    const resp: FindingsList = await api.findingsListFindings(req);
    this.findings = resp.findings
    console.log(JSON.stringify(this.findings))
  }

  private updateStatus(findingId: string) {
      console.log("findingId: "+findingId)
    this.statusModal = this.$buefy.modal.open({
            parent: this,
            component: FindingOverwriteForm,
            hasModalCard: true,
            fullScreen: false,
            trapFocus: true,
            props: {
                findingId: findingId,
                teamId: this.teamId,
            },
            events: {
                'handleerror': (err: Error) =>{
                    this.$emit('handleerror', err);
                },
                'update': () => {
                    this.$emit('update', this.propsFindingDetail);
                },
                'close': () => {
                    this.statusModal.close();
                }
            },
        });
  }

}
</script>
