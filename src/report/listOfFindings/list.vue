<!--
Copyright 2021 Adevinta
-->

<template>
  <div>
    <!-- Main list -->
    <b-table
      ref="tableMainList"
      class="live-report"
      :row-class="showcursor"
      :data="data"
      :loading="loading"
      :narrowed="true"
      hoverable
      detailed
      detail-key="Id"
      :show-detail-icon="false"
      :paginated="paginated"
      backend-pagination
      :total="total"
      :per-page="perPageInternal"
      @click="toggleDetailsMainList"
      @details-open="onMainListDetailsOpen"
      @page-change="onMainListPageChange"
    >
      <template slot-scope="propsMainList">
        <!-- Description -->
        <b-table-column field="description" :label="mainListDescriptionColumnHeader">
          <b-icon :icon="mainListDescriptionColumnIcon" size="is-small"></b-icon>
          <a class="has-text-dark">{{ propsMainList.row.Description }}</a>
        </b-table-column>

        <!-- Count -->
        <b-table-column centered width="100" field="Count" :label="mainListCountColumnHeader">
          <b-icon :icon="mainListCountColumnIcon" size="is-small"></b-icon>
          <span class="tag">{{ propsMainList.row.Count }}</span>
        </b-table-column>

        <!-- Score -->
        <b-table-column centered width="100" field="Score" :label="mainListScoreColumnHeader">
          <span v-bind:class="severityStyle(propsMainList.row.Score)" style="width: 70">{{ severityText(propsMainList.row.Score) }}</span>
        </b-table-column>
      </template>

      <template slot="detail" slot-scope="propsDetail">
        <div>
          <div class="card">
            <div class="card-content">
              <div class>
                <!-- Findings table -->
                <b-table
                  :ref="'tableFindings-'+propsDetail.row.Id"
                  class="live-report"
                  :row-class="showcursor"
                  :data="mapFindings.get(propsDetail.row.Id).data"
                  :loading="mapFindings.get(propsDetail.row.Id).loading"
                  :narrowed="true"
                  paginated
                  backend-pagination
                  :total="mapFindings.get(propsDetail.row.Id).total"
                  :per-page="mapFindings.get(propsDetail.row.Id).perPage"
                  detailed
                  detail-key="id"
                  :show-detail-icon="false"
                  @click="row => $refs['tableFindings-'+propsDetail.row.Id].toggleDetails(row)"
                  @page-change="page => onFindingsTablePageChange(propsDetail.row.Id, page)"
                >
                  <template slot-scope="propsFinding">
                    <!-- Description -->
                    <b-table-column
                      field="description"
                      :label="findingsListDescriptionColumnHeader"
                    >
                      <span class="icon is-small">
                        <i class="fa fa-server"></i>
                      </span>
                      <a
                        v-if="mode=='issue'"
                        class="has-text-dark"
                      >{{ propsFinding.row.target.identifier }}</a>
                      <a
                        v-if="mode=='target'"
                        class="has-text-dark"
                      >{{ propsFinding.row.issue.summary }}</a>
                    </b-table-column>

                    <!-- Direct Link -->
                    <b-table-column width="100" field="link" label="Direct Link">
                      <router-link :to="{ name: 'finding', params: { id: propsFinding.row.id }}">
                        <b-button size="is-small" type="is-info is-light" rounded outlined>
                          <i class="fa fa-link"></i>
                          Link
                        </b-button>
                      </router-link>
                    </b-table-column>

                    <!-- Age -->
                    <b-table-column width="100" field="status" label="Status">
                      <span
                        v-bind:class="statusClass(propsFinding.row.status)"
                      >{{ (propsFinding.row.status.charAt(0).toUpperCase() + propsFinding.row.status.toLowerCase().slice(1)).replace("False_positive", "False Positive") }}</span>
                    </b-table-column>

                    <!-- Age -->
                    <b-table-column centered width="100" field="age" label="Age (days)">
                      <a
                        class="has-text-dark"
                      >{{ propsFinding.row.status == "OPEN" ? Math.round(propsFinding.row.currentExposure/24) : "" }}</a>
                    </b-table-column>

                    <!-- Score -->
                    <b-table-column centered width="100" field="score" label="Score">
                      <span
                        v-bind:class="severityStyle(propsFinding.row.score)" style="width: 70"
                      >{{ severityText(propsFinding.row.score) }}</span>
                    </b-table-column>
                  </template>

                  <!-- Finding details -->
                  <template slot="detail" slot-scope="propsFindingDetail">
                    <FindingDetails
                      :teamId="teamId"
                      :findingId="propsFindingDetail.row.id"
                      :propsFindingDetail="propsFindingDetail"
                      v-on:handleerror="handleError"
                      v-on:update="updateFindingsList"
                    ></FindingDetails>
                  </template>
                </b-table>
              </div>
            </div>
          </div>
        </div>
      </template>
    </b-table>

    <!-- Per Page selector -->
    <b-field grouped position="is-right" v-if="paginated">
      <b-select
        v-model="perPageInternal"
        class="is-right"
        @input="$emit('updateperpage', perPageInternal)"
      >
        <option value="5">5 per page</option>
        <option value="10">10 per page</option>
        <option value="15">15 per page</option>
        <option value="20">20 per page</option>
        <option value="50">50 per page</option>
        <option value="100">100 per page</option>
      </b-select>
    </b-field>
  </div>
</template>

<script lang="ts">
// Imports section
import { Component, Prop, Vue } from "vue-property-decorator";
import { severityStyle, severityText, statusClass } from "../utils/utils";
import FindingDetails from "../finding/finding.vue";
import loadConfig, { Config } from "../../common/config";
import tokenProvider from "../../common/token";
import {
  FindingsApi,
  FindingsFindFindingsFromATargetRequest,
  FindingsFindFindingsFromAIssueRequest
} from "../../services/vulcan-api/apis";
import {
  Configuration as ApiConf,
  ConfigurationParameters,
  FindingsList
} from "../../services/vulcan-api";

import ListItem from "./ListItem";

//@ts-ignore
import { Table } from "buefy";

// Component declaration
@Component({
  name: "ListOfFindings",
  components: {
    FindingDetails
  }
})

// ListOfFindings is a Vue component that renders a main list, in which each row
// will expand into a list of findings
export default class ListOfFindings extends Vue {
  // The list of items used to render the main list
  @Prop({ required: true, default: "" })
  data!: ListItem[];

  // The total number of items within 'data' (used for pagination)
  @Prop({ required: true, default: "" })
  total!: number;

  // How many items per page on main list
  @Prop({ required: true, default: "" })
  perPage!: number;

  // The team identifier
  @Prop({ required: true, default: "" })
  private teamId!: string;

  @Prop({ required: true, default: "" })
  private modeSelect!: string;

  // Mode: it should be "asset" or "issue"
  // "asset": Findings will be retrieved by asset
  // "issue": Findings will be retrieved by issue
  @Prop({ required: true, default: "" })
  private mode!: string;

  @Prop({ required: true })
  private minDate!: Date;

  @Prop({ required: true })
  private maxDate!: Date;

  @Prop({ required: true })
  private atDate!: Date;

  @Prop({ required: true })
  private identifiers!: string;

  @Prop({ required: false, default: true })
  private paginated!: boolean;

// Main List columns

  // Header for the Description column
  @Prop({ required: true, default: "" })
  private mainListDescriptionColumnHeader?: string;

  // Icon for the Description column
  @Prop({ required: true, default: "" })
  private mainListDescriptionColumnIcon?: string;

  // Header for the Count column
  @Prop({ required: true, default: "" })
  private mainListCountColumnHeader?: string;

  // Icon for the Count column
  @Prop({ required: true, default: "" })
  private mainListCountColumnIcon?: string;

  // Header for the Score column
  @Prop({ required: true, default: "" })
  private mainListScoreColumnHeader?: string;

  // Findings List

  // Header for the Description column
  @Prop({ required: true, default: "" })
  private findingsListDescriptionColumnHeader?: string;

  // Main List internal attributes
  private loading: boolean = false;
  private perPageInternal: number = 20;

  // Findings internal attributes

  private mapFindings = new Map();

  // findingsApi is used to retrieve the list of findings
  private findingsApi!: FindingsApi;

  // Internal functions
  private severityStyle = severityStyle;
  private severityText = severityText;
  private statusClass = statusClass;

  $refs!: {
    tableMainList: Table;
  };

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

      this.perPageInternal = this.perPage;
    } catch (err) {
      this.handleError(err);
    }
  }

  // toggleDetailsMainList is invoked when the user expand/collapse the detailed
  // view for a row from the Main List.
  private toggleDetailsMainList(row: Object) {
    this.$refs.tableMainList.toggleDetails(row);
  }

  async onMainListDetailsOpen(row: Object) {
    let item: ListItem = row as ListItem;
    await this.loadFindings(this.teamId, this.findingsApi, item.Id, this.mode);
    this.$refs.tableMainList.$forceUpdate();
  }

  async onMainListPageChange(page: number) {
    try {
      if (!this.findingsApi) {
        throw new Error("no client api found");
      }

      this.loading = true;
      this.$emit("updatepage", page);
    } catch (err) {
      this.$emit("handleerror", err);
    } finally {
      this.loading = false;
    }
  }

  async onFindingsTablePageChange(id: string, page: number) {
    try {
      this.mapFindings.get(id).page = page;
      await this.loadFindings(this.teamId, this.findingsApi, id, this.mode);
      this.$refs["tableMainList"].$forceUpdate();
    } catch (err) {
      this.$refs["tableMainList"].$emit("handleerror", err);
    }
  }

  // loadFindings will retrieve from the Vulcan API.
  // params:
  // - teamId:  The ID of the team in the Vulcan API. Required.
  // - api:     Client for the Vulcan API. Required.
  // - Id: The ID of the issue/target (depending on the mode) in the Vulnerability DB.
  //       The query will only return findings that contains
  //       this issue. Optional.
  private async loadFindings(
    teamId: string,
    api: FindingsApi,
    Id: string,
    mode: string
  ) {
    try {
      let status = "OPEN";
      if (this.modeSelect == "fixed") {
        status = "FIXED";
      }

      if (!this.mapFindings.has(Id)) {
        this.mapFindings.set(Id, new Object());
        this.mapFindings.get(Id).perPage = 10;
      }

      let perPage = this.mapFindings.get(Id).perPage;
      let page = this.mapFindings.get(Id).page;
      this.mapFindings.get(Id).loading = true;

      if (mode == "issue") {
        const findingsReq: FindingsFindFindingsFromAIssueRequest = {
          teamId: teamId,
          issueId: Id,
          status: status,
          sortBy: "-score",
          page: page,
          size: perPage,
          minDate: this.minDate ? this.dateToStr(this.minDate) : "",
          maxDate: this.maxDate ? this.dateToStr(this.maxDate) : "",
          atDate: this.atDate ? this.dateToStr(this.atDate) : "",
          identifiers: this.identifiers,
        };
        if (this.dateToStr(this.atDate) == this.dateToStr(new Date())) {
          findingsReq.atDate = undefined;
        }
        let findingsList: FindingsList = await api.findingsFindFindingsFromAIssue(
          findingsReq
        );
        this.mapFindings.get(Id).data = findingsList.findings || [];
        this.mapFindings.get(Id).total = findingsList.pagination!.total || 0;
        this.mapFindings.get(Id).loading = false;
      }

      if (mode == "target") {
        const findingsReq: FindingsFindFindingsFromATargetRequest = {
          teamId: teamId,
          targetId: Id,
          status: status,
          sortBy: "-score",
          page: page,
          size: perPage,
          minDate: this.minDate ? this.dateToStr(this.minDate) : "",
          maxDate: this.maxDate ? this.dateToStr(this.maxDate) : "",
          atDate: this.atDate ? this.dateToStr(this.atDate) : "",
          identifiers: this.identifiers,
        };
        if (this.dateToStr(this.atDate) == this.dateToStr(new Date())) {
          findingsReq.atDate = undefined;
        }
        let findingsList: FindingsList = await api.findingsFindFindingsFromATarget(
          findingsReq
        );
        this.mapFindings.get(Id).data = findingsList.findings || [];
        this.mapFindings.get(Id).total = findingsList.pagination!.total || 0;
        this.mapFindings.get(Id).loading = false;
      }
    } catch (err) {
      this.handleError(err);
    }
  }

  private handleError(err: any) {
    this.$emit("handleerror", err);
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

  private async updateFindingsList(prop: any) {
    console.log("updateFindingsList");
    let id: string = "";

    if (this.mode == "target") {
      id = prop.row.target.id;
    }

    if (this.mode == "issue") {
      id = prop.row.issue.id;
    }

    await this.loadFindings(this.teamId, this.findingsApi, id, this.mode);

    this.$refs["tableMainList"].$forceUpdate();

    this.$emit("updatestats");
  }

  private resetDetailsTables() {
    this.mapFindings = new Map();
    this.$refs["tableMainList"].closeDetailRow();
  }

  private showcursor() {
    return "showcursor";
  }
}
</script>
