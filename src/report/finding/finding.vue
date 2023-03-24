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
            <h4 class="title is-4">{{ propsFindingDetail.row.issue.summary }}</h4>
            <hr />
          </div>
          <div>
            <VueShowdown :markdown="propsFindingDetail.row.issue.description" :extensions="['htmlSanitize']" />
          </div>
          <hr />
          <table class="table is-striped is-fullwidth">
            <tr>
              <td class="has-text-weight-bold">Asset</td>
              <td style="width:100%">
                <a target="_blank" rel="noopener noreferrer" :href="buildTargetViewLink(propsFindingDetail.row.target.identifier)">
                  <span>{{ propsFindingDetail.row.target.identifier }}</span>
                </a>
              </td>
            </tr>
            <tr>
              <td class="has-text-weight-bold">Score / Severity</td>
              <td style="width:100%">
                <b-tooltip
                    label="Score ranges from 0.0 (no security risks) to 10.0 (maximum security risk)."
                    position="is-bottom"
                    type="is-info">
                    <span class="tag">{{ propsFindingDetail.row.score }}</span> /
                </b-tooltip>
                <span
                  v-bind:class="severityStyle(propsFindingDetail.row.score)"
                >{{ severityText(propsFindingDetail.row.score) }}</span>
              </td>
            </tr>
            <tr>
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
            </tr>
            <tr v-if="propsFindingDetail.row.details">
              <td class="has-text-weight-bold">Details</td>
              <td style="width:100%">
                <pre style="white-space:pre-wrap;">{{ propsFindingDetail.row.details }}</pre>
              </td>
            </tr>
            <tr>
              <td class="has-text-weight-bold">Affected Resource</td>
              <td style="width:100%" class="is-long-line"
              >{{ propsFindingDetail.row.affectedResource }}</td>
            </tr>
            <tr>
              <td class="has-text-weight-bold">Labels</td>
              <td style="width:100%">
                <b-taglist>
                  <b-tag type="is-info" v-for="label in propsFindingDetail.row.issue.labels" :key="label">
                    {{ label }}
                  </b-tag>
                </b-taglist>
              </td>
            </tr>
            <tr>
              <td class="has-text-weight-bold">Impact</td>
              <td style="width:100%">{{ propsFindingDetail.row.impactDetails }}</td>
            </tr>
            <tr>
              <td class="has-text-weight-bold">Recommendations</td>
              <td style="width:100%">
                <table>
                  <tr
                    v-for="recommendation in propsFindingDetail.row.issue.recommendations"
                    :key="recommendation"
                  >
                    <td>
                      <VueShowdown :markdown="recommendation" :extensions="['htmlSanitize']" />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr v-if="propsFindingDetail.row.issue.referenceLinks">
              <td class="has-text-weight-bold">References</td>
              <td style="width:100%">
                <a
                  v-for="reference in propsFindingDetail.row.issue.referenceLinks"
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
              >{{ propsFindingDetail.row.source.name }} / {{ propsFindingDetail.row.source.component }}</td>
            </tr>

            <tr v-for="resource in propsFindingDetail.row.resources" v-bind:key="resource.name">
              <td class="has-text-weight-bold">{{ resource.name }}</td>
              <td style="width:100%; word-break: normal;" class="is-long-line">
                <table class="table is-striped">
                  <thead>
                    <th v-for="header in resource.attributes">{{ header }}</th>
                  </thead>
                  <tr v-for="(row) in resource.resources">
                    <td v-for="header in resource.attributes">
                        <div v-if="markdownAllowed(header)"><VueShowdown :markdown="row[header]" :extensions="['restrictedHTMLSanitize','noBlockquote']" /></div>
                        <div v-else>{{ row[header] }}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr v-if="teamOnBoardedVT">
              <td class="has-text-weight-bold">Ticket</td>
              <td v-if="!propsFindingDetail.row.urlTracker" style="width:100%">
                <b-button type="is-info" @click="createTicket()">
                    <span>Create Ticket</span>
                </b-button>
              </td>
              <td v-else style="width:100%">
                  <a target="_blank" rel="noopener noreferrer" :href="propsFindingDetail.row.urlTracker" class="button"
                  >
                    <span>{{ ticketId(propsFindingDetail.row.urlTracker) }}</span>
                    <span class="icon is-small">
                      <i class="fa fa-external-link"></i>
                    </span>
                  </a>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import FindingOverwriteForm from "../findingOverwriteForm/findingOverwriteForm.vue";
import CreateTicketForm from "../createTicketForm/createTicketForm.vue";
import { severityStyle, severityText, statusClass, urlDomain, propsFindingDetailTemplate } from "../utils/utils";
import { ModalProgrammatic as Modal } from 'buefy';
import { BModalComponent } from "buefy/types/components";

@Component({
  name: "FindingDetails",
  components: {
      FindingOverwriteForm,
      CreateTicketForm
  }
})
export default class FindingDetails extends Vue {
  @Prop({ required: true, default: "" })
  propsFindingDetail!: propsFindingDetailTemplate;

  @Prop({ required: true, default: "" })
  private findingId?: string;

  @Prop({ required: true, default: "" })
  private teamId?: string;

  @Prop({ required: true, default: false })
  private teamOnBoardedVT?: boolean;

  private isComponentModalActive: boolean = true;
  private severityStyle = severityStyle
  private severityText = severityText
  private statusClass = statusClass
  private urlDomain = urlDomain

  private statusModal!: BModalComponent

  private updateStatus() {
    this.statusModal = this.$buefy.modal.open({
            parent: this,
            component: FindingOverwriteForm,
            hasModalCard: true,
            fullScreen: false,
            trapFocus: true,
            props: {
                findingId: this.findingId,
                teamId: this.teamId
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

  private createTicket() {

    this.statusModal = this.$buefy.modal.open({
            parent: this,
            component: CreateTicketForm,
            hasModalCard: true,
            fullScreen: false,
            trapFocus: true,
            props: {
                findingId: this.findingId,
                teamId: this.teamId,
                finding: this.propsFindingDetail.row
            },
            events: {
                'handleerror': (err: Error) =>{
                    this.$emit('handleerror', err);
                },
                'create': () => {
                    this.$emit('update', this.propsFindingDetail);
                },
                'close': () => {
                    this.statusModal.close();
                }
            },
        });
  }

  private buildTargetViewLink(identifier: string): string {
    return "/report/report.html?team_id=" + this.teamId + "&identifiers=" + identifier;
  }

  private ticketId(urlTracker: string): string {
    const splitUrl = urlTracker.split("/")
    return splitUrl[splitUrl.length - 1];
}

  // TODO: PTVUL-2489
  // Unify resources table columns which allows markdown/html.
  // We should review the checks and define a column header name convention
  // or limit the resources table columns that accept markdown/html.
  private markdownAllowed(headerLabel: string): boolean {
    if (headerLabel === undefined) {
      return false;
    }
    let markdownAllowedArr = [
      "CWEs",             // vulcan-burp
      "References",       // vulcan-github-alerts
      "Vulnerabilities",  // vulcan-trivy
      "Link",             // vulcan-vulners
    ];
    return (markdownAllowedArr.indexOf(headerLabel) > -1);
  }

}
</script>
