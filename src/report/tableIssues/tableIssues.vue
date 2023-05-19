<!--
Copyright 2021 Adevinta
-->

<template>
  <div>
    <b-table
      ref="tableMainList"
      class="live-report"
      :row-class="showcursor"
      :data="this.issuesList"
      :loading="loading"
      :narrowed="true"
      hoverable
      detailed
      detail-key="issueId"
      :show-detail-icon="false"
      :paginated="paginated"
      backend-pagination
      :total="issuesListTotal"
      :per-page="perPageIssues"
      @click="toggleIssueDetails"
      @page-change="onMainListPageChange"
    >
      <template slot-scope="propsMainList">
        <b-table-column field="summary" label="Issues">
          <b-icon icon="bug" size="is-small"></b-icon>
          <a class="has-text-dark">{{ propsMainList.row.summary }}</a>
        </b-table-column>

        <b-table-column centered width="100" field="targetsCount" label="Assets">
          <b-icon icon="server" size="is-small"></b-icon>
          <span class="tag">{{ propsMainList.row.targetsCount }}</span>
        </b-table-column>

        <b-table-column centered width="100" field="severity" label="Severity">
          <span
            v-bind:class="severityStyle(propsMainList.row.maxScore)" style="width: 70"
          > {{ severityText(propsMainList.row.maxScore) }}</span>
        </b-table-column>
      </template>

      <template slot="detail" slot-scope="propsDetail">
        <div>
          <div class="card">
            <div class="card-content">
              <div>
                <div>
                  <h4 class="title is-4">{{ mapIssues.get(propsDetail.row.issueId).issue.summary }}</h4>
                  <hr />
                </div>
                <div>
                  <VueShowdown
                    :markdown="mapIssues.get(propsDetail.row.issueId).issue.description"
                    :extensions="['htmlSanitize']"
                  />
                </div>
                <table class="table is-striped is-fullwidth">
                  <!-- Recommendations -->
                  <tr>
                    <td class="has-text-weight-bold">Recommendations</td>
                    <td style="width:100%">
                      <table>
                        <tr
                          v-for="recommendation in mapIssues.get(propsDetail.row.issueId).issue.recommendations"
                          :key="recommendation"
                        >
                          <td>
                            <VueShowdown :markdown="recommendation" :extensions="['htmlSanitize']" />
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- References -->
                  <tr v-if="mapIssues.get(propsDetail.row.issueId).issue.referenceLinks">
                    <td class="has-text-weight-bold">References</td>
                    <td style="width:100%">
                      <a
                        v-for="reference in mapIssues.get(propsDetail.row.issueId).issue.referenceLinks"
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
                </table>
                
                <!-- Targets table -->
                <b-table
                  :ref="'tableIssuesDetails-'+propsDetail.row.issueId"
                  :row-class="showcursor"
                  :data="mapIssues.get(propsDetail.row.issueId).targets"
                  :loading="loading"
                  :narrowed="true"
                  hoverable
                  detailed
                  detail-key="targetId"
                  :show-detail-icon="false"
                  paginated
                  backend-pagination
                  :total="mapIssues.get(propsDetail.row.issueId).pagination.total"
                  :per-page="10"
                  @click="row => toggleTargetDetails(propsDetail.row.issueId, row)"
                  @page-change="page => onIssueDetailsPageChange(propsDetail.row.issueId, page)"
                >
                  <template slot-scope="propsTargets">
                    <b-table-column field="identifier" label="Asset">
                      <b-icon icon="server" size="is-small"></b-icon>
                      <a class="has-text-dark">{{ propsTargets.row.identifier }}</a>
                    </b-table-column>

                    <!-- Count -->
                    <b-table-column
                      centered
                      width="100"
                      field="findingsCount"
                      label="Affected Resources"
                    >
                      <b-icon icon="server" size="is-small"></b-icon>
                      <span class="tag">{{ propsTargets.row.findingsCount }}</span>
                    </b-table-column>

                    <!-- Severity -->
                    <b-table-column centered width="100" field="maxScore" label="Severity">
                      <span
                        v-bind:class="severityStyle(propsTargets.row.maxScore)" style="width: 70"
                      >{{ severityText(propsTargets.row.maxScore) }}</span>
                    </b-table-column>

                    <!-- Asset Info -->
                    <b-table-column centered width="100" field="assetInfo" label="Asset Info">
                      <b-button type="is-info is-text is-small"  inverted @click.stop="showAssetInfo(propsTargets.row.identifier)">
                        <b-icon pack="mdi" icon="information"></b-icon>
                      </b-button>
                    </b-table-column>
                  </template>

                  <!-- Resources table -->
                  <template slot="detail" slot-scope="propsDetailAffectedResources">
                    <b-table
                      :ref="'tableDetailAffectedResources-'+propsDetail.row.issueId+'-'+propsDetailAffectedResources.row.targetId"
                      class="live-report"
                      :row-class="showcursor"
                      :data="mapIssues.get(propsDetail.row.issueId).findings.get(propsDetailAffectedResources.row.targetId)"
                      :loading="loading"
                      :narrowed="true"
                      hoverable
                      detailed
                      :show-detail-icon="false"
                    >
                      <template slot-scope="propsX">
                        <b-table-column
                          field="affectedResource"
                          label="Resource"
                          class="is-long-line"
                        >{{ propsX.row.affectedResource }}</b-table-column>

                        <!-- Direct Link -->
                        <b-table-column width="100" field="link" label="Direct Link">
                          <router-link :to="{ name: 'finding', params: { id: propsX.row.id }}">
                            <b-button size="is-small" type="is-info is-light" rounded outlined>
                              <i class="fa fa-link"></i>
                              Link
                            </b-button>
                          </router-link>
                        </b-table-column>

                        <!-- Status -->
                        <b-table-column width="100" field="status" label="Status">
                          <span
                            v-bind:class="statusClass(propsX.row.status)"
                          >{{ (propsX.row.status.charAt(0).toUpperCase() + propsX.row.status.toLowerCase().slice(1)).replace("False_positive", "False Positive") }}</span>
                        </b-table-column>

                        <!-- Age -->
                        <b-table-column centered width="100" field="age" label="Age (days)">
                          <a class="has-text-dark">
                            {{ propsX.row.status == "OPEN" ? Math.round(propsX.row.currentExposure/24) : "" }}
                          </a>
                        </b-table-column>

                        <!-- Severity -->
                        <b-table-column width="100" field="severity" label="Severity">
                          <span
                            v-bind:class="severityStyle(propsX.row.score)" style="width: 70"
                          >{{ severityText(propsX.row.score) }}</span>
                        </b-table-column>
                      </template>
                    </b-table>
                  </template>
                </b-table>
              </div>
            </div>
          </div>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import loadConfig, { Config } from "../../common/config";
import {
  severityStyle,
  severityText,
  statusClass,
  urlDomain
} from "../utils/utils";
import tokenProvider from "../../common/token";
import {
  Configuration as ApiConf,
  ConfigurationParameters,
  FindingsIssue
} from "../../services/vulcan-api";
import {
  FindingsApi,
  FindingsListFindingsIssuesRequest,
  FindingsListFindingsTargetsRequest,
  FindingsListFindingsRequest
} from "../../services/vulcan-api/apis";
import teamID from "../../common/team";

//@ts-ignore
import { Table } from "buefy";
import { BModalComponent } from "buefy/types/components";
import AssetInfoForm from "../assetInfoForm/assetInfoForm.vue";

@Component({
  name: "TableIssues",
  components: {
    AssetInfoForm,
  }
})

export default class TableIssues extends Vue {
  private apiUrl: string = "";
  private teamId: string = "";
  private findingsApi?: FindingsApi;
  private pageIssues: number = 1;

  @Prop({ required: true })
  private atDate!: Date;

  @Prop({ required: true })
  private minDate!: Date;

  @Prop({ required: true })
  private maxDate!: Date;

  @Prop({ required: false, default: "OPEN" })
  private status!: string;

  @Prop({ required: true })
  private identifiers!: string;

  @Prop({ required: true })
  private labels!: string[];

  @Prop({ required: false, default: true })
  private paginated!: boolean;

  @Prop({ required: false, default: 20 })
  private perPageIssues!: number;

  private issuesList: Array<FindingsIssue> = [];
  private issuesListTotal: number = 0;

  private assetsInfoModal!: BModalComponent

  private loading: boolean = false;

  // Internal functions
  private severityStyle = severityStyle;
  private severityText = severityText;
  private statusClass = statusClass;
  private urlDomain = urlDomain;

  private mapIssues = new Map();

  async mounted() {
    try {
      // Load config
      const conf = await loadConfig();
      const tProvider = tokenProvider(conf);
      const c: ConfigurationParameters = {
        apiKey: tProvider,
        basePath: conf.apiUrl
      };
      this.apiUrl = conf.apiUrl;

      // Build the api clients
      const apiConfg = new ApiConf(c);
      this.findingsApi = new FindingsApi(apiConfg);

      // Load team
      this.teamId = teamID();
      await this.loadIssues();
      
      // Set up watchers
      this.$watch(
        function() {
          return [
            this.atDate,
            this.minDate,
            this.maxDate,
            this.status,
            this.identifiers,
            this.labels
          ]},
        function() {
          this.loadIssues();
      });

    } catch (err) {
      this.$emit('handleerror', err);
    }
  }

  /** Main Issues List */
  async loadIssues() {
    try {
      this.loading = true;
      await this.retrieveIssues();
    } catch (err) {
      this.$emit('handleerror', err);
    } finally {
      this.loading = false;
    }
  }

  async onMainListPageChange(page: number) {
    try {
      this.pageIssues = page;
      await this.retrieveIssues();
    } catch (err) {
      this.$emit('handleerror', err);
    }
  }

  async retrieveIssues() {
    const issuesReq: FindingsListFindingsIssuesRequest = {
      teamId: this.teamId,
      status: this.status,
      page: this.pageIssues,
      size: this.perPageIssues,
      minDate: this.minDate ? this.dateToStr(this.minDate) : undefined,
      maxDate: this.maxDate ? this.dateToStr(this.maxDate) : undefined,
      atDate: this.atDate ? this.dateToStr(this.atDate) : undefined,
      identifiers: this.identifiers,
      labels: this.labels.join(",")
    };
    if (this.dateToStr(this.atDate) == this.dateToStr(new Date())) {
      issuesReq.atDate = undefined;
    }

    const issuesList = await this.findingsApi.findingsListFindingsIssues(
      issuesReq
    );

    this.issuesList = issuesList.issues!;
    this.issuesListTotal = issuesList.pagination!.total!;
  }

  /** Targets List From Issue */
  async toggleIssueDetails(row: Object) {
    try {
      // Only request issue details data if it has not been loaded yet
      // or if the loaded data for the issue does not correspond to page 1
      if (!this.mapIssues.has(row.issueId) ||
        this.mapIssues.get(row.issueId).pagination.offset != 0) {
        
        await this.retrieveAssetsFromIssue(row.issueId, 1);
        
        // Get first finding for issue and target row
        // so we can display generic issue information
        const targetId = this.mapIssues.get(row.issueId).targets[0].targetId;
        await this.retrieveIssueDataFromFinding(row.issueId, targetId);
      }
    } catch (err) {
      this.$emit('handleerror', err);
    }

    this.$refs.tableMainList.toggleDetails(row);
  }

  async onIssueDetailsPageChange(issueId: string, page: number) {
    try {
      // Prevent generic issue data from being
      // overwritten by new targets data page
      // so we avoid making extra requests for it
      const issue = this.mapIssues.get(issueId).issue;
      await this.retrieveAssetsFromIssue(issueId, page);
      this.mapIssues.get(issueId).issue = issue;
    } catch (err) {
      this.$emit('handleerror', err);
    }

    this.$refs["tableIssuesDetails-" + issueId].$forceUpdate();
    this.$refs["tableMainList"].$forceUpdate();
  }

  async retrieveAssetsFromIssue(issueId: string, page: number) {
    const targetsReq: FindingsListFindingsTargetsRequest = {
      teamId: this.teamId,
      issueID: issueId,
      status: this.status,
      sortBy: "-max_score",
      page: page,
      size: 10,
      minDate: this.minDate ? this.dateToStr(this.minDate) : "",
      maxDate: this.maxDate ? this.dateToStr(this.maxDate) : "",
      atDate: this.atDate ? this.dateToStr(this.atDate) : "",
      identifiers: this.identifiers,
      labels: this.labels.join(",")
    };
    if (this.dateToStr(this.atDate) == this.dateToStr(new Date())) {
      targetsReq.atDate = undefined;
    }

    const targetsList = await this.findingsApi.findingsListFindingsTargets(
      targetsReq
    );
    this.mapIssues.set(issueId, targetsList);
  }

  async retrieveIssueDataFromFinding(issueId: string, targetId: string) {
    const findFindingReq: FindingsListFindingsRequest = {
      teamId: this.teamId,
      issueID: issueId,
      targetID: targetId,
      status: this.status,
      page: 1,
      size: 1,
      minDate: this.minDate ? this.dateToStr(this.minDate) : "",
      maxDate: this.maxDate ? this.dateToStr(this.maxDate) : "",
      atDate: this.atDate ? this.dateToStr(this.atDate) : ""
    };
    if (this.dateToStr(this.atDate) == this.dateToStr(new Date())) {
      findFindingReq.atDate = undefined;
    }

    const findingsList = await this.findingsApi.findingsListFindings(
      findFindingReq
    );

    this.mapIssues.get(issueId).issue = findingsList.findings[0].issue;
  }

  /** Resources List from Issue and Target */
  async toggleTargetDetails(issueId: string, row: Object) {
    let page:number = 1;
    let more:boolean = true;
    
    // TODO: Use pagination through a "See more" button on table?

    try {
      // Prevent request for data that's already loaded
      if (this.mapIssues.get(issueId).findings == null ||
        !this.mapIssues.get(issueId).findings.has(row.targetId)) {
        
        while (more) {
          const findingsReq: FindingsListFindingsRequest = {
            teamId: this.teamId,
            issueID: issueId,
            targetID: row.targetId,
            status: this.status,
            sortBy: "-score",
            page: page,
            size: 100,
            minDate: this.minDate ? this.dateToStr(this.minDate) : "",
            maxDate: this.maxDate ? this.dateToStr(this.maxDate) : "",
            atDate: this.atDate ? this.dateToStr(this.atDate) : ""
          };
          if (this.dateToStr(this.atDate) == this.dateToStr(new Date())) {
            findingsReq.atDate = undefined;
          }
      
          const findingsList = await this.findingsApi.findingsListFindings(
            findingsReq
          );
          if (this.mapIssues.get(issueId).findings == null) {
            this.mapIssues.get(issueId).findings = new Map();
          }
    
          if (page == 1) {
            this.mapIssues.get(issueId).findings.set(row.targetId, findingsList.findings);
          } else {
            let findings = this.mapIssues.get(issueId).findings.get(row.targetId);
            this.mapIssues.get(issueId).findings.set(row.targetId, findings.concat(findingsList.findings));
          }
  
          page++;
          more = findingsList.pagination?.more || false;
        }
      }
    } catch (err) {
      this.$emit('handleerror', err);
    }

    //@ts-ignore
    this.$refs["tableIssuesDetails-" + issueId].toggleDetails(row);
  }

  private showAssetInfo(assetIdentifier: string) {
    this.assetsInfoModal = this.$buefy.modal.open({
            parent: this,
            component: AssetInfoForm,
            hasModalCard: true,
            fullScreen: false,
            trapFocus: true,
            props: {
              teamId: this.teamId,
              assetIdentifier: assetIdentifier,
            },
            events: {
                'handleerror': (err: Error) =>{
                    this.$emit('handleerror', err);
                },
                'close': () => {
                    this.assetsInfoModal.close();
                }
            },
        });
  }

  dateToStr(date: Date): string {
    const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
    const month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
    const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);

    return year + "-" + month + "-" + day;
  }

  private showcursor() {
    return "showcursor";
  }
}
</script>
