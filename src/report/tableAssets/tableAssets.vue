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
      :paginated="paginated"
      backend-pagination
      :total="assetsListTotal"
      :per-page="perPageAssets"
      @click="toggleAssetDetails"
      @page-change="onMainListPageChange"
    >
      <template slot-scope="propsMainList">
        <b-table-column field="summary" label="Assets">
          <b-icon icon="server" size="is-small"></b-icon>
          <a class="has-text-dark">{{ propsMainList.row.identifier }}</a>
        </b-table-column>

        <b-table-column centered width="100" field="issuesCount" label="Issues">
          <b-icon icon="bug" size="is-small"></b-icon>
          <span class="tag">{{ propsMainList.row.issuesCount }}</span>
        </b-table-column>

        <b-table-column centered width="100" field="severity" label="Severity">
          <span
            v-bind:class="severityStyle(propsMainList.row.maxScore)" style="width: 70"
          > {{ severityText(propsMainList.row.maxScore) }}</span>
        </b-table-column>

        <b-table-column centered width="100" field="assetInfo" label="Asset Info">
          <b-button type="is-info is-text is-small"  inverted @click.stop="showAssetInfo(propsMainList.row.identifier)">
            <b-icon pack="mdi" icon="information"></b-icon>
          </b-button>
        </b-table-column>
      </template>

      <template slot="detail" slot-scope="propsDetail">
        <div>
          <div class="card">
            <div class="card-content">
              <div>
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
                  @page-change="page => onAssetDetailsPageChange(propsDetail.row.targetId, page)"
                >

                <template slot-scope="propsIssues">
                  <b-table-column field="summary" label="Issues">
                    <b-icon icon="bug" size="is-small"></b-icon>
                    <a class="has-text-dark">{{ propsIssues.row.summary }}</a>
                  </b-table-column>

                  <b-table-column centered width="100" field="targetsCount" label="Affected Resources">
                    <b-icon icon="server" size="is-small"></b-icon>
                    <span class="tag">{{ propsIssues.row.resourcesCount }}</span>
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
                        <b-table-column field="affectedResource" label="Resource">
                          {{ propsX.row.affectedResource }}
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
  FindingsTarget
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
  name: "TableAssets",
  components: {
      AssetInfoForm,
  }
})
export default class TableAssets extends Vue {
  private apiUrl: string = "";
  private teamId: string = "";
  private findingsApi?: FindingsApi;
  private pageAssets: number = 1;

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
  private perPageAssets!: number;

  private assetsList: Array<FindingsTarget> = [];
  private assetsListTotal: number = 0;

  private assetsInfoModal!: BModalComponent

  private loading: boolean = false;

  // Internal functions
  private severityStyle = severityStyle;
  private severityText = severityText;
  private statusClass = statusClass;
  private urlDomain = urlDomain;

  private mapAssets = new Map();

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
      await this.loadAssets();

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
          this.loadAssets();
      });

    } catch (err) {
      this.$emit('handleerror', err);
    }
  }

  /** Main Targets List */
  async loadAssets() {
    try {
      this.loading = true;
      await this.retrieveAssets();
    } catch (err) {
      this.$emit('handleerror', err);
    } finally {
      this.loading = false;
    }
  }

  async onMainListPageChange(page: number) {
    try {
      this.pageAssets = page;
      await this.retrieveAssets();
    } catch (err) {
      this.$emit('handleerror', err);
    }
  }

  async retrieveAssets() {
    const targetsReq: FindingsListFindingsTargetsRequest = {
      teamId: this.teamId,
      status: this.status,
      page: this.pageAssets,
      size: this.perPageAssets,
      minDate: this.minDate ? this.dateToStr(this.minDate) : undefined,
      maxDate: this.maxDate ? this.dateToStr(this.maxDate) : undefined,
      atDate: this.atDate ? this.dateToStr(this.atDate) : undefined,
      identifiers: this.identifiers,
      labels: this.labels.join(",")
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

  /** Issues List From Target */
  async toggleAssetDetails(row: Object) {
    try {
      // Only request target details data if it has not been loaded yet
      // or if the loaded data for the target does not correspond to page 1
      if (!this.mapAssets.has(row.targetId) ||
        this.mapAssets.get(row.targetId).pagination.offset != 0) {

        await this.retrieveIssuesFromAsset(row.targetId, 1);
      }
    } catch (err) {
      this.$emit('handleerror', err);
    }

    this.$refs.tableMainList.toggleDetails(row);
  }

  async onAssetDetailsPageChange(targetId: string, page: number) {
    try {
      await this.retrieveIssuesFromAsset(targetId, page);
    } catch (err) {
      this.$emit('handleerror', err);
    }

    this.$refs["tableTargetsDetails-" + targetId].$forceUpdate();
    this.$refs["tableMainList"].$forceUpdate();
  }

  async retrieveIssuesFromAsset(targetId: string, page: number) {
    const issuesReq: FindingsListFindingsIssuesRequest = {
      teamId: this.teamId,
      targetID: targetId,
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
      issuesReq.atDate = undefined;
    }

    const issuesList = await this.findingsApi.findingsListFindingsIssues(
      issuesReq
    );
    this.mapAssets.set(targetId, issuesList);
  }

  /** Resources List from Target and Issue */
  async toggleIssueDetails(targetId: string, row: Object) {
    let page:number = 1;
    let more:boolean = true;
    
    // TODO: Use pagination through a "See more" button on table?

    try {
      // Prevent request for data that's already loaded
      if (this.mapAssets.get(targetId).findings == null ||
        !this.mapAssets.get(targetId).findings.has(row.issueId)) {
        
        while (more) {
          const findingsReq: FindingsListFindingsRequest = {
            teamId: this.teamId,
            issueID: row.issueId,
            targetID: targetId,
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
          if (this.mapAssets.get(targetId).findings == null) {
            this.mapAssets.get(targetId).findings = new Map();
          }
          
          if (page == 1) {
            this.mapAssets.get(targetId).findings.set(row.issueId, findingsList.findings);
          } else {
            let findings = this.mapAssets.get(targetId).findings.get(row.issueId);
            this.mapAssets.get(targetId).findings.set(row.issueId, findings.concat(findingsList.findings));
          }
    
          page++;
          more = findingsList.pagination?.more || false;
        }
      }
    } catch (err) {
      this.$emit('handleerror', err);
    }

    //@ts-ignore
    this.$refs["tableTargetsDetails-" + targetId].toggleDetails(row);
  }

  dateToStr(date: Date): string {
    const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
    const month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
    const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);

    return year + "-" + month + "-" + day;
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

  private showcursor() {
    return "showcursor";
  }
}
</script>
