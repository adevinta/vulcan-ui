<!--
Copyright 2021 Adevinta
-->

<template>
  <div>
    <b-table
      ref="tableMainList"
      class="live-report"
      :row-class="showcursor"
      :data="this.assetsList"
      :loading="loading"
      :narrowed="true"
      hoverable
      detailed
      detail-key="targetId"
      :show-detail-icon="false"
      paginated
      backend-pagination
      :total="assetsListTotal"
      :per-page="perPageAssets"
      @click="toggleDetails"
      @page-change="onMainListPageChange"
    >
      <template slot-scope="propsMainList">
        <b-table-column field="summary" label="Assets">
          <b-icon icon="server" size="is-small"></b-icon>
          <a class="has-text-dark">{{ propsMainList.row.identifier }}</a>
        </b-table-column>

        <b-table-column centered width="100" field="targetsCount" label="Issues">
          <b-icon icon="bug" size="is-small"></b-icon>
          <span class="tag">{{ propsMainList.row.findingsCount }}</span>
        </b-table-column>

        <b-table-column centered width="100" field="Score" label="Score">
          <span
            v-bind:class="severityStyle(propsMainList.row.maxScore)" style="width: 70"
          > {{ severityText(propsMainList.row.maxScore) }}</span>
        </b-table-column>
      </template>

      <template slot="detail" slot-scope="propsDetail">
        <div>
          <div class="card">
            <div class="card-content">
              <div class>
                  <!-- Issues Table -->
                  <b-table
                  :ref="'tableTargetsDetails-'+propsDetail.row.targetId"
                  :row-class="showcursor"
                  :data="mapAssets.get(propsDetail.row.targetId).issues"
                  :loading="loading"
                  :narrowed="true"
                  hoverable
                  detailed
                  detail-key="issueId"
                  :show-detail-icon="false"
                  paginated
                  backend-pagination
                  :total="mapAssets.get(propsDetail.row.targetId).pagination.total"
                  :per-page="10"
                  @click="row => toggleIssueDetails(propsDetail.row.targetId, row)"
                  @page-change="page => onIssueDetailsPageChange(propsDetail.row.targetId, page)"
                >

                <template slot-scope="propsIssues">
                  <b-table-column field="summary" label="Issues">
                    <b-icon icon="server" size="is-small"></b-icon>
                    <a class="has-text-dark">{{ propsIssues.row.summary }}</a>
                  </b-table-column>

                  <b-table-column centered width="100" field="targetsCount" label="Affected Resources">
                    <b-icon icon="bug" size="is-small"></b-icon>
                    <span class="tag">{{ propsIssues.row.targetsCount }}</span>
                  </b-table-column>

                  <b-table-column centered width="100" field="severity" label="Severity">
                    <span
                        v-bind:class="severityStyle(propsIssues.row.maxScore)" style="width: 70"
                    > {{ severityText(propsIssues.row.maxScore) }}</span>
                  </b-table-column>
                </template>

                <!-- Resources table -->
                <template slot="detail" slot-scope="propsDetailAffectedResources">
                  <div>
                    <VueShowdown
                      :markdown="mapAssets.get(propsDetail.row.targetId).findings.get(propsDetailAffectedResources.row.issueId)[0].issue.description"
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
                          v-for="recommendation in mapAssets.get(propsDetail.row.targetId).findings.get(propsDetailAffectedResources.row.issueId)[0].issue.recommendations"
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
                    <tr v-if="mapAssets.get(propsDetail.row.targetId).findings.get(propsDetailAffectedResources.row.issueId)[0].issue.referenceLinks">
                      <td class="has-text-weight-bold">References</td>
                      <td style="width:100%">
                        <a
                          v-for="reference in mapAssets.get(propsDetail.row.targetId).findings.get(propsDetailAffectedResources.row.issueId)[0].issue.referenceLinks"
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

                  <b-table
                      :ref="'tableDetailAffectedResources-'+propsDetail.row.targetId+'-'+propsDetailAffectedResources.row.issueId"
                      class="live-report"
                      :row-class="showcursor"
                      :data="mapAssets.get(propsDetail.row.targetId).findings.get(propsDetailAffectedResources.row.issueId)"
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
                        >{{ propsX.row.affectedResource }}
                        </b-table-column>

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
// Imports section
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
  FindingsIssue,
  FindingsTarget
} from "../../services/vulcan-api";
import {
  FindingsApi,
  TeamsApi,
  FindingsListFindingsIssuesRequest,
  FindingsListFindingsTargetsRequest,
  FindingsListFindingsRequest
} from "../../services/vulcan-api/apis";
import teamID from "../../common/team";

//@ts-ignore
import { Table } from "buefy";

// Component declaration
@Component({
  name: "TableAssets",
  components: {}
})

export default class TableAssets extends Vue {
  private apiUrl: string = "";
  private teamId: string = "";
  private findingsApi?: FindingsApi;
  private teamsApi?: TeamsApi;
  private pageAssets: number = 1;
  private perPageAssets: number = 20;

  // Datepicker
  @Prop({ required: true })
  private atDate!: Date;

  @Prop({ required: true })
  private minDate!: Date;

  @Prop({ required: true })
  private maxDate!: Date;

  private assetsList: Array<FindingsTarget> = [];
  private assetsListTotal: number = 0;

  private loading: boolean = false;

  // Internal functions
  private severityStyle = severityStyle;
  private severityText = severityText;
  private statusClass = statusClass;
  private urlDomain = urlDomain;

  private mapAssets = new Map();

  async mounted() {
    // this.atDate = new Date();
    // this.atDate.setMonth(this.atDate.getMonth() - 3);

    try {
      // Load the config.
      const conf = await loadConfig();
      const tProvider = tokenProvider(conf);
      const c: ConfigurationParameters = {
        apiKey: tProvider,
        basePath: conf.apiUrl
      };
      this.apiUrl = conf.apiUrl;

      // Build the api clients.
      const apiConfg = new ApiConf(c);
      this.findingsApi = new FindingsApi(apiConfg);
      this.teamsApi = new TeamsApi(apiConfg);

      // Load team.
      this.teamId = teamID();
      await this.loadAssets();
    } catch (err) {
      // TODO
    } finally {
      // TODO
    }
  }

  @Watch('atDate')
  @Watch('minDate')
  @Watch('maxDate')
  async loadAssets() {
    const status = "OPEN";
    const assetsReq: FindingsListFindingsTargetsRequest = {
      teamId: this.teamId,
      status: status,
      page: this.pageAssets,
      size: this.perPageAssets,
      minDate: this.minDate ? this.dateToStr(this.minDate) : undefined,
      maxDate: this.maxDate ? this.dateToStr(this.maxDate) : undefined,
      atDate: this.atDate ? this.dateToStr(this.atDate) : undefined
    };
    if (this.dateToStr(this.atDate) == this.dateToStr(new Date())) {
      assetsReq.atDate = undefined;
    }

    const assetsList = await this.findingsApi.findingsListFindingsTargets(
      assetsReq
    );

    this.assetsList = assetsList.targets!;
    this.assetsListTotal = assetsList.pagination!.total!;
  }

  dateToStr(date: Date): string {
    const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(
      date
    );
    const month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(
      date
    );
    const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);

    return year + "-" + month + "-" + day;
  }

  async toggleDetails(row: Object) {
    const status = "OPEN";

    const issuesReq: FindingsListFindingsIssuesRequest = {
      teamId: this.teamId,
      targetID: row.targetId,
      status: status,
      sortBy: "max_score",
      page: 1,
      size: 10,
      minDate: this.minDate ? this.dateToStr(this.minDate) : "",
      maxDate: this.maxDate ? this.dateToStr(this.maxDate) : "",
      atDate: this.atDate ? this.dateToStr(this.atDate) : ""
    };
    if (this.dateToStr(this.atDate) == this.dateToStr(new Date())) {
      issuesReq.atDate = undefined;
    }

    const issuesList = await this.findingsApi?.findingsListFindingsIssues(
      issuesReq
    );

    this.mapAssets.set(row.targetId, issuesList);

    this.$refs.tableMainList.toggleDetails(row);
  }

  async toggleIssueDetails(targetId: string, row: Object) {
    let page:number = 1;
    let more:boolean = true;
    
    // TODO: Req all findings for issue - target
    // display generic issue data and resources list
    
    while (more) {
      const findingsReq: FindingsListFindingsRequest = {
        teamId: this.teamId,
        issueID: row.issueId,
        targetID: targetId,
        status: status,
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
      if (this.mapAssets.get(targetId).findings == null) {
        this.mapAssets.get(targetId).findings = new Map();
      }
      
      if (page == 1) {
        this.mapAssets.get(targetId).findings.set(row.issueId, findingsList.findings);
      } else {
        this.mapAssets.get(targetId).findings.get(row.issueId).concat(findingsList.findings);
      }

      page++;
      more = findingsList.pagination?.more || false;
    }

    //@ts-ignore
    this.$refs["tableTargetsDetails-" + targetId].toggleDetails(row);
  }

  private showcursor() {
    return "showcursor";
  }

  async onMainListPageChange(page: number) {
    this.pageAssets = page;

    const status = "OPEN";
    const targetsReq: FindingsListFindingsTargetsRequest = {
      teamId: this.teamId,
      status: status,
      page: this.pageAssets,
      size: this.perPageAssets,
      minDate: this.minDate ? this.dateToStr(this.minDate) : undefined,
      maxDate: this.maxDate ? this.dateToStr(this.maxDate) : undefined,
      atDate: this.atDate ? this.dateToStr(this.atDate) : undefined
    };
    if (this.dateToStr(this.atDate) == this.dateToStr(new Date())) {
      targetsReq.atDate = undefined;
    }

    const assetsList = await this.findingsApi.findingsListFindingsTargets(
      targetsReq
    );

    this.assetsList = assetsList.targets!;
    this.assetsListTotal = assetsList.pagination!.total!;
  }

  async onIssueDetailsPageChange(targetId: string, page: number) {
    const issuesReq: FindingsListFindingsIssuesRequest = {
      teamId: this.teamId,
      targetID: targetId,
      status: status,
      sortBy: "max_score",
      page: page,
      size: 10,
      minDate: this.minDate ? this.dateToStr(this.minDate) : "",
      maxDate: this.maxDate ? this.dateToStr(this.maxDate) : "",
      atDate: this.atDate ? this.dateToStr(this.atDate) : ""
    };
    if (this.dateToStr(this.atDate) == this.dateToStr(new Date())) {
      issuesReq.atDate = undefined;
    }

    const issuesList = await this.findingsApi.findingsListFindingsIssues(
      issuesReq
    );
    this.mapAssets.set(targetId, issuesList);
    // this.mapAssets.get(targetId).issuesList = issuesList;
    this.$refs["tableTargetsDetails-" + targetId].$forceUpdate();
    this.$refs["tableMainList"].$forceUpdate();
  }
}
</script>
