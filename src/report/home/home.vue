<!--
Copyright 2021 Adevinta
-->

<template>
    <div>
        <div class="container">
        <div class="columns" v-if="modeSelect == 'fixed'">
            <div class="column has-text-white" style="background: purple; font-size: 36; text-align: center;" >{{ statsFixed && statsFixed.fixedIssues ? statsFixed.fixedIssues.critical : "-" }}</div>
            <div class="column has-text-white" style="background: red; font-size: 36;    text-align: center;">{{ statsFixed && statsFixed.fixedIssues ? statsFixed.fixedIssues.high : "-" }}</div>
            <div class="column has-text-white" style="background: orange; font-size: 36; text-align: center;" >{{ statsFixed && statsFixed.fixedIssues ? statsFixed.fixedIssues.medium : "-" }}</div>
            <div class="column has-text-dark"  style="background: hsl(48, 100%, 67%); font-size: 36; text-align: center;">{{ statsFixed && statsFixed.fixedIssues ? statsFixed.fixedIssues.low : "-" }}</div>
            <div class="column has-text-white" style="background: hsl(204, 86%, 53%); font-size: 36; text-align: center;">{{ statsFixed && statsFixed.fixedIssues ? statsFixed.fixedIssues.informational : "-" }}</div>
        </div>
        <div class="columns" v-else>
            <div class="column has-text-white" style="background: purple; font-size: 36; text-align: center;" >{{ statsOpen.openIssues ? statsOpen.openIssues.critical : "-" }}</div>
            <div class="column has-text-white" style="background: red; font-size: 36;    text-align: center;">{{ statsOpen.openIssues ? statsOpen.openIssues.high : "-" }}</div>
            <div class="column has-text-white" style="background: orange; font-size: 36; text-align: center;" >{{ statsOpen.openIssues ? statsOpen.openIssues.medium : "-" }}</div>
            <div class="column has-text-dark"  style="background: hsl(48, 100%, 67%); font-size: 36; text-align: center;">{{ statsOpen.openIssues ? statsOpen.openIssues.low : "-" }}</div>
            <div class="column has-text-white" style="background: hsl(204, 86%, 53%); font-size: 36; text-align: center;">{{ statsOpen.openIssues ? statsOpen.openIssues.informational : "-" }}</div>
        </div>
        <b-collapse class="card" :open=true animation="slide" aria-id="contentIdForA11y3">
            <div
                slot="trigger"
                class="card-header"
                role="button"
                aria-controls="contentIdForA11y3">
                <p class="card-header-title has-background-info	has-text-white">
                    Advanced Search
                </p>
            </div>
            <div class="card-content">
                <div class="content">
                    <div class="columns">
                    <div class="column">
                        <b-field label-position="on-border" label="Report Mode">
                            <b-select expanded placeholder="Select a mode" v-model="modeSelect" @input="onSelectInput">
                            <option value="digest">Open Findings</option>
                            <option value="open">New Findings</option>
                            <option value="fixed">Fixed Findings</option>
                            </b-select>
                        </b-field>
                    </div>
                    <div class="column">
                        <div :class="digestDateClass">
                        <b-field label-position="on-border" label="Select a date">
                            <b-datepicker v-model="atDate"
                                :first-day-of-week="1"
                                placeholder="Click to select...">

                                <button class="button is-primary"
                                    @click="atDate = new Date();">
                                    <b-icon icon="calendar-today"></b-icon>
                                    <span>Today</span>
                                </button>

                                <button class="button is-danger"
                                    @click="atDate = null;">
                                    <b-icon icon="close"></b-icon>
                                    <span>Clear</span>
                                </button>
                            </b-datepicker>
                        </b-field>
                        </div>
                        <div :class="diffMinDateClass">
                        <b-field label-position="on-border" label="From: " >
                            <b-datepicker v-model="minDate"
                                :first-day-of-week="1"
                                placeholder="Click to select...">

                                <button class="button is-primary"
                                    @click="minDate = new Date();">
                                    <b-icon icon="calendar-today"></b-icon>
                                    <span>Today</span>
                                </button>

                                <button class="button is-danger"
                                    @click="minDate = null;">
                                    <b-icon icon="close"></b-icon>
                                    <span>Clear</span>
                                </button>
                            </b-datepicker>
                        </b-field>
                        <b-field label-position="on-border" label="To: ">
                            <b-datepicker v-model="maxDate"
                                :first-day-of-week="1"
                                placeholder="Click to select...">

                                <button class="button is-primary"
                                    @click="maxDate = new Date();">
                                    <b-icon icon="calendar-today"></b-icon>
                                    <span>Today</span>
                                </button>

                                <button class="button is-danger"
                                    @click="maxDate = null;">
                                    <b-icon icon="close"></b-icon>
                                    <span>Clear</span>
                                </button>
                            </b-datepicker>
                        </b-field>
                        </div>
                    </div>
                    <div class="column is-quarter">
                        <b-button size="is-small" type="is-text" @click="onClickDateShortcut('today')">Today</b-button>
                        <b-button size="is-small" type="is-text" @click="onClickDateShortcut('7days')">7 Days ago</b-button>
                        <b-button size="is-small" type="is-text" @click="onClickDateShortcut('15days')">15 Days ago</b-button>
                        <b-button size="is-small" type="is-text" @click="onClickDateShortcut('1month')">1 Month ago</b-button>
                        <b-button size="is-small" type="is-text" @click="onClickDateShortcut('3months')">3 Months ago</b-button>
                        <b-button size="is-small" type="is-text" @click="onClickDateShortcut('6months')">6 Months ago</b-button>
                        <b-button size="is-small" type="is-text" @click="onClickDateShortcut('1year')">1 Year ago</b-button>
                        <b-button size="is-small" type="is-text" @click="onClickDateShortcut('2years')">2 Years ago</b-button>
                    </div>
                    <div class="column is-quarter"></div>
                    </div>
                </div>
                <b-message type="is-info">
                    {{ modeDescription }}
                </b-message>
                
            </div>
        </b-collapse>
        </div>
        <hr/>

        <div class="container">
        <b-tabs v-model="activeTab" 
            class="block"
            type="is-boxed"
            :animated=false>
            <b-tab-item label="Overview" class="has-text-strong" icon="eye">
            <div class="card">
                <div class="card-content">
                <h1 class="title">Top 10 Most Relevant Issues</h1>
                <b-table
                    ref="top10Issues"
                    class="live-report"
                    :data="dataTop10Issues"
                    :loading="loadingTop10Issues"
                    :narrowed=true
                    :paginated=false
                    :total="totalTop10Issues">

                    <template slot-scope="propsIssues">
                    <b-table-column field="issue" label="Issue">
                        {{ propsIssues.row.summary }}
                    </b-table-column>

                    <b-table-column centered width="100" field="assets-count" label="Assets">
                        <b-icon
                            icon="server"
                            size="is-small">
                        </b-icon>
                        <span class="tag ">
                            {{ propsIssues.row.targetsCount }}
                        </span>
                    </b-table-column>

                    <b-table-column centered width="100" field="score" label="Score">
                        <span v-bind:class="severityStyle(propsIssues.row.maxScore)">
                            {{ propsIssues.row.maxScore }}
                        </span>
                    </b-table-column>
                    </template>
                </b-table>
                </div>
            </div>
            <hr/>
            <div class="card">
                <div class="card-content">
                <h1 class="title">Top 10 Most Vulnerable Assets</h1>
                <b-table
                    ref="top10Assets"
                    class="live-report"
                    :data="dataTop10Assets"
                    :loading="loadingTop10Assets"
                    :narrowed=true
                    :total="totalTop10Assets">

                    <template slot-scope="propsAssets">
                    <b-table-column field="asset" label="Asset">
                        {{ propsAssets.row.identifier }}
                    </b-table-column>

                    <b-table-column centered width="100" field="issues-count" label="Issues">
                        <b-icon
                            icon="server"
                            size="is-small">
                        </b-icon>
                        <span class="tag ">
                            {{ propsAssets.row.findingsCount }}
                        </span>
                    </b-table-column>

                    <b-table-column centered width="100" field="score" label="Score">
                        <span v-bind:class="severityStyle(propsAssets.row.maxScore)">
                            {{ propsAssets.row.maxScore }}
                        </span>
                    </b-table-column>
                    </template>
                </b-table>
                </div>
            </div>

            </b-tab-item>
            <b-tab-item label="Issues" class="has-text-strong" icon="bug">
            <div class="card">
                <div class="card-content">
                <!-- /* ISSUES TABLE */ -->
                <b-table
                    ref="tableIssues"
                    class="live-report"
                    :data="dataIssues"
                    :loading="loadingIssues"
                    :narrowed=true
                    paginated
                    hoverable
                    backend-pagination
                    :total="totalIssues"
                    :per-page="perPageIssues"
                    :row-class="rowclass"
                    @click="toggleDetailsForIssuesTable"
                    @page-change="onIssuesPageChange"

                    detailed
                    
                    detail-key="issueId"
                    :show-detail-icon=false

                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-page-label="Page"
                    aria-current-label="Current page">

                    <template slot-scope="propsIssues">
                        <!-- /* COLUMNS FROM ISSUES TABLE */ -->
                        <b-table-column field="issue" label="Issue">
                            <b-icon
                                icon="bug"
                                size="is-small"
                                >
                            </b-icon>
                            <a class="has-text-dark">
                                {{ propsIssues.row.summary }}
                            </a>
                        </b-table-column>

                        <b-table-column centered width="100" field="assets-count" label="Assets">
                            <b-icon
                                icon="server"
                                size="is-small">
                            </b-icon>
                            <span class="tag ">
                                {{ propsIssues.row.targetsCount }}
                            </span>
                        </b-table-column>

                        <b-table-column centered width="100" field="score" label="Score">
                            <span v-bind:class="severityStyle(propsIssues.row.maxScore)">
                                {{ propsIssues.row.maxScore }}
                            </span>
                        </b-table-column>
                    </template>
                    <template slot="detail" slot-scope="propsDetail">
                        <div>
                        <div class="card">
                            <div class="card-content">
                            <div class="">
                                <!-- /* FINDINGS BY ISSUE TABLE */ -->
                                <b-table
                                    :ref="'tableFindingsByIssues-'+propsDetail.row.issueId"
                                    class="live-report"
                                    :data="mapFindingsByIssues.get(propsDetail.row.issueId).data"
                                    :loading="mapFindingsByIssues.get(propsDetail.row.issueId).loading"
                                    :narrowed=true
                                    paginated
                                    backend-pagination
                                    :total="mapFindingsByIssues.get(propsDetail.row.issueId).total"
                                    :per-page="mapFindingsByIssues.get(propsDetail.row.issueId).perPage"
                                    :row-class="rowclass"
                                    @click="row => $refs['tableFindingsByIssues-'+propsDetail.row.issueId].toggleDetails(row)" 

                                    detailed
                                    
                                    detail-key="id"
                                    :show-detail-icon=false

                                    aria-next-label="Next page"
                                    aria-previous-label="Previous page"
                                    aria-page-label="Page"
                                    aria-current-label="Current page">

                                    <template slot-scope="propsFinding">
                                        <!-- /* COLUMNS FROM FINDINGS BY ISSUE TABLE */ -->
                                        <b-table-column field="asset" label="Asset">
                                        <span class="icon is-small">
                                            <i class="fa fa-server"></i>
                                        </span>
                                        <a class="has-text-dark">
                                            {{ propsFinding.row.target.identifier }} 
                                        </a>
                                        </b-table-column>

                                        <b-table-column width="100" field="link" label="Direct Link">
                                        <router-link :to="{ name: 'finding', params: { id: propsFinding.row.id }}">
                                            <b-button size="is-small" type="is-info is-light" rounded outlined>
                                                <i class="fa fa-link"></i>
                                                Link
                                            </b-button>
                                        </router-link>
                                        </b-table-column>

                                        <b-table-column width="100" field="status" label="Status">
                                        <span v-bind:class="statusClass(propsFinding.row.status)">
                                            {{ (propsFinding.row.status.charAt(0).toUpperCase() + propsFinding.row.status.toLowerCase().slice(1)).replace("False_positive", "False Positive") }}
                                        </span>
                                        </b-table-column>
                                        
                                        <b-table-column centered width="100" field="age" label="Age (days)">
                                        <a class="has-text-dark">
                                            {{ propsFinding.row.status == "OPEN" ? Math.round(propsFinding.row.currentExposure/24) : "" }} 
                                        </a>
                                        </b-table-column>

                                        <b-table-column centered width="100" field="score" label="Score">
                                        <span v-bind:class="severityStyle(propsFinding.row.score)">
                                            {{ propsFinding.row.score }}
                                        </span>
                                        </b-table-column>
                                    </template>
                                    <template slot="detail" slot-scope="propsFindingDetail" >
                                    <FindingDetails
                                        v-on:handleerror="handleError"
                                        v-on:update="updateIssue"
                                        :teamId="teamId"
                                        :findingId="propsFindingDetail.row.id"
                                        :propsFindingDetail="propsFindingDetail">
                                    </FindingDetails>
                                    </template>
                                </b-table> 
                            </div>
                            </div>
                        </div>
                        </div>
                    </template>
                </b-table>
                <b-field grouped position="is-right">
                    <b-select v-model="perPageIssues" class="is-right" @input="loadIssues(teamId, findingsApi)">
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="15">15 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                    </b-select>
                </b-field>
                </div>

                <footer class="card-footer">
                <div class="card-footer-item">
                </div>
                </footer>
            </div>
            </b-tab-item>

            <b-tab-item label="Assets" class="has-text-strong" icon="server">
            <div class="card">
                <div class="card-content">
                <!-- /* ASSETS TABLE */ -->
                <b-table
                    ref="tableAssets"
                    class="live-report"
                    :data="dataAssets"
                    :loading="loadingAssets"
                    :narrowed=true
                    paginated
                    hoverable
                    backend-pagination
                    :total="totalAssets"
                    :per-page="perPageAssets"
                    @page-change="onAssetsPageChange"
                    :row-class="rowclass"
                    @click="toggleDetailsForAssetsTable"

                    detailed
                    
                    detail-key="targetId"
                    :show-detail-icon=false

                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-page-label="Page"
                    aria-current-label="Current page">

                    <template slot-scope="propsAssets">
                        <!-- /* COLUMNS FROM ASSETS TABLE */ -->
                        <b-table-column field="asset" label="Asset">
                            <b-icon
                                icon="bug"
                                size="is-small"
                                >
                            </b-icon>
                            <a class="has-text-dark">
                                {{ propsAssets.row.identifier }}
                            </a>
                        </b-table-column>

                        <b-table-column centered width="100" field="issues-count" label="Issues">
                            <b-icon
                                icon="server"
                                size="is-small">
                            </b-icon>
                            <span class="tag ">
                                {{ propsAssets.row.findingsCount }}
                            </span>
                        </b-table-column>

                        <b-table-column centered width="100" field="score" label="Score">
                            <span v-bind:class="severityStyle(propsAssets.row.maxScore)">
                                {{ propsAssets.row.maxScore }}
                            </span>
                        </b-table-column>
                    </template>
                    <template slot="detail" slot-scope="propsDetail">
                        <div>
                        <div class="card">
                            <div class="card-content">
                            <div class="">
                                <!-- /* FINDINGS BY ASSET TABLE */ -->
                                <b-table
                                    :ref="'tableFindingsByAssets-'+propsDetail.row.targetId"
                                    class="live-report"
                                    :data="mapFindingsByAssets.get(propsDetail.row.targetId).data"
                                    :loading="mapFindingsByAssets.get(propsDetail.row.targetId).loading"
                                    :narrowed=true
                                    paginated
                                    backend-pagination
                                    :total="mapFindingsByAssets.get(propsDetail.row.targetId).total"
                                    :per-page="mapFindingsByAssets.get(propsDetail.row.targetId).perPage"
                                    :row-class="rowclass"
                                    @click="row => $refs['tableFindingsByAssets-'+propsDetail.row.targetId].toggleDetails(row)" 

                                    detailed
                                    
                                    detail-key="id"
                                    :show-detail-icon=false

                                    aria-next-label="Next page"
                                    aria-previous-label="Previous page"
                                    aria-page-label="Page"
                                    aria-current-label="Current page">

                                    <template slot-scope="propsFinding">
                                        <!-- /* COLUMNS FROM FINDINGS BY ASSET TABLE */ -->
                                        <b-table-column field="issue" label="Issue">
                                        <span class="icon is-small">
                                            <i class="fa fa-server"></i>
                                        </span>
                                        <a class="has-text-dark">
                                            {{ propsFinding.row.issue.summary }} 
                                        </a>
                                        </b-table-column>

                                        <b-table-column width="100" field="link" label="Direct Link">
                                        <router-link :to="{ name: 'finding', params: { id: propsFinding.row.id }}">
                                            <b-button size="is-small" type="is-info is-light" rounded outlined>
                                                <i class="fa fa-link"></i>
                                                Link
                                            </b-button>
                                        </router-link>
                                        </b-table-column>

                                        <b-table-column width="100" field="status" label="Status">
                                        <span v-bind:class="statusClass(propsFinding.row.status)">
                                            {{ propsFinding.row.status.charAt(0).toUpperCase() + propsFinding.row.status.toLowerCase().slice(1) }} 
                                        </span>
                                        </b-table-column>
                                        <b-table-column centered width="100" field="age" label="Age (days)">
                                        <a class="has-text-dark">
                                            {{ propsFinding.row.status == "OPEN" ? Math.round(propsFinding.row.currentExposure/24) : "" }} 
                                        </a>
                                        </b-table-column>
                                        <b-table-column centered width="100" field="score" label="Score">
                                        <span v-bind:class="severityStyle(propsFinding.row.score)">
                                            {{ propsFinding.row.score }}
                                        </span>
                                        </b-table-column>
                                    </template>
                                    <template slot="detail" slot-scope="propsFindingDetail">
                                    <FindingDetails
                                        v-on:handleerror="handleError"
                                        v-on:update="updateAsset"
                                        :teamId="teamId"
                                        :findingId="propsFindingDetail.row.id"
                                        :propsFindingDetail="propsFindingDetail">
                                    </FindingDetails>
                                    </template>
                                </b-table> 
                            </div>
                            </div>
                        </div>
                        </div>
                    </template>
                </b-table>
                <b-field grouped position="is-right">
                    <b-select v-model="perPageAssets" class="is-right" @input="loadAssets(teamId, findingsApi)">
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="15">15 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                    </b-select>
                </b-field>
                </div>

                <footer class="card-footer">
                <div class="card-footer-item">
                </div>
                </footer>
            </div>
            </b-tab-item>
        </b-tabs>
        </div>
    </div>
</template>

<script lang="ts">
// Import modules
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
  import Loading from "../../components/loading.vue";
  import ErrorDialog from "../../components/error.vue";
  import Session from "../../components/session.vue";
  import FindingDetails from "../finding/finding.vue";
  import loadConfig, { Config } from "../../common/config";
  import tokenProvider from "../../common/token";
  import teamID from "../../common/team";
import { severityStyle, severityText, statusClass } from "../utils/utils";
import {
   Configuration as ApiConf,
    ConfigurationParameters,
    Configuration
} from "../../services/vulcan-api";
import {
   FindingsApi,
   FindingsListFindingsRequest,
   FindingsListFindingsIssuesRequest,
   FindingsListFindingsTargetsRequest,
   TeamsApi, 
   TeamsShowRequest,
   UserApi, 
   StatsApi, 
   StatsOpenRequest, 
   StatsFixedRequest,
   FindingsFindFindingsFromAIssueRequest,
   FindingsFindFindingsFromATargetRequest
} from "../../services/vulcan-api/apis";
import {
  Finding,
  FindingsList,
  Team,
  FindingsTarget,
  FindingsIssue,
  User,
  Statsopen,
  Statsfixed
} from "../../services/vulcan-api/models"

@Component({
  name: "Home",
  components: {
    Loading,
    ErrorDialog,
    Session,
    FindingDetails,
  }
})
export default class Home extends Vue {
  $refs!: {
    table: any;
  };
  private activeTab: number = 0;

  private modeSelect: string = "digest";
  private modeDescription: string = "";
  private digestDateClass: string = "";
  private diffMinDateClass: string = "is-hidden";
  private diffMaxDateClass: string = "is-hidden";

  private loading: boolean = true;

  private showSession: boolean = false;
  private apiUrl: string = "";

  private showError: boolean = false;
  private errorMessage: string = "";

  private team: string = "";
  private teamId: string = "";
  private findingsApi?: FindingsApi;
  private teamsApi?: TeamsApi;
  private userApi?: UserApi;
  private statsApi?: StatsApi;
  private userProfile?: User;

  // Datepicker
  private atDate: Date = new Date();
  private minDate: Date = null;
  private maxDate: Date = null;
  
  // Issues
  private dataIssues: FindingsIssue[] = [];
  private totalIssues: number = 0;
  private loadingIssues: boolean = false;
  private pageIssues: number = 1;
  private perPageIssues: number = 20;

  // Assets
  private dataAssets: FindingsTarget[] = [];
  private totalAssets: number = 0;
  private loadingAssets: boolean = false;
  private pageAssets: number = 1;
  private perPageAssets: number = 20;

  // Findings by Issue
  private mapFindingsByIssues = new Map();

  // Findings by Assets
  private mapFindingsByAssets = new Map();

  // Findings
  private dataFindings: Finding[] = [];
  private totalFindings: number = 0;
  private loadingFindings: boolean = false;
  private pageFindings: number = 1;
  private perPageFindings: number = 20;

  // Top 10 issues
  private dataTop10Issues: FindingsIssue[] = [];
  private totalTop10Issues: number = 0;
  private loadingTop10Issues: boolean = false;

  // Top 10 Assets
  private dataTop10Assets: FindingsTarget[] = [];
  private totalTop10Assets: number = 0;
  private loadingTop10Assets: boolean = false;

  private userTeamsList: Team[] = [];
  private statsOpen: Statsopen = {};
  private statsFixed: Statsfixed = {};

  private severityStyle = severityStyle
  private severityText = severityText
  private statusClass = statusClass

  async mounted() {
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
      this.userApi = new UserApi(apiConfg);
      this.statsApi = new StatsApi(apiConfg);

      // TODO: Load tables data
      // concurrently.

      // Load team.
      this.teamId = teamID();

      var qparams = new URL(document.location.toString()).searchParams;
      if (qparams.get('minDate') || qparams.get('maxDate')) {
        this.modeSelect="open";
      } else {
        this.modeSelect="digest";
      }

      if (qparams.get('status')=="FIXED") {
        this.modeSelect="FIXED";
      }

      this.onSelectInput(this.modeSelect);
    } catch (err) {
      this.$emit('handleerror', err);
    } finally {
      this.$emit('toggleUserListTeams', true);
      this.loading = false;
    }
  }

  private async getStatsOpen(statsApi: StatsApi) {
    const req: StatsOpenRequest = {
      teamId: this.teamId,
      minDate: this.minDate ? this.dateToStr(this.minDate) : undefined,
      maxDate: this.maxDate ? this.dateToStr(this.maxDate) : undefined,
      atDate: this.atDate ? this.dateToStr(this.atDate) : undefined,
    };
    if (this.dateToStr(this.atDate)==this.dateToStr(new Date())){
      req.atDate=undefined;
    }
    this.statsOpen = await this.statsApi.statsOpen(req)
  }

  private async getStatsFixed(statsApi: StatsApi) {
    const req: StatsFixedRequest = {
      teamId: this.teamId,
      minDate: this.minDate ? this.dateToStr(this.minDate) : undefined,
      maxDate: this.maxDate ? this.dateToStr(this.maxDate) : undefined,
      atDate: this.atDate ? this.dateToStr(this.atDate) : undefined,
    };
    if (this.dateToStr(this.atDate)==this.dateToStr(new Date())){
      req.atDate=undefined;
    }
    this.statsFixed = await this.statsApi.statsFixed(req)
  }

  private async loadTop10Issues(teamId: string, api: FindingsApi) {
    let status = "OPEN"
    if (this.modeSelect=="fixed") {
      status="FIXED"
    }

    const issuesReq: FindingsListFindingsIssuesRequest = {
      teamId: teamId,
      status: status,
      page: 0,
      size: 10,
      minDate: this.minDate ? this.dateToStr(this.minDate) : undefined,
      maxDate: this.maxDate ? this.dateToStr(this.maxDate) : undefined,
      atDate: this.atDate ? this.dateToStr(this.atDate) : undefined,
    };
    if (this.dateToStr(this.atDate)==this.dateToStr(new Date())){
      issuesReq.atDate=undefined;
    }

    this.loadingTop10Issues = true;
    const issuesList = await api.findingsListFindingsIssues(issuesReq);
    this.loadingTop10Issues = false;

    this.dataTop10Issues = issuesList.issues || [];
    this.totalTop10Issues = issuesList.pagination!.total || 0;
  }

  private async loadTop10Assets(teamId: string, api: FindingsApi) {
    let status = "OPEN"
    if (this.modeSelect=="fixed") {
      status="FIXED"
    }

    const assetsReq: FindingsListFindingsTargetsRequest = {
      teamId: teamId,
      status: status,
      page: 0,
      size: 10,
      minDate: this.minDate ? this.dateToStr(this.minDate) : undefined,
      maxDate: this.maxDate ? this.dateToStr(this.maxDate) : undefined,
      atDate: this.atDate ? this.dateToStr(this.atDate) : undefined,
    };
    if (this.dateToStr(this.atDate)==this.dateToStr(new Date())){
      assetsReq.atDate=undefined;
    }

    this.loadingTop10Assets = true;
    const assetsList = await api.findingsListFindingsTargets(assetsReq);
    this.loadingTop10Assets = false;

    this.dataTop10Assets = assetsList.targets || [];
    this.totalTop10Assets = assetsList.pagination!.total || 0;
  }

  private async loadIssues(teamId: string, api: FindingsApi) {
    let status = "OPEN"
    if (this.modeSelect=="fixed") {
      status="FIXED"
    }

    const issuesReq: FindingsListFindingsIssuesRequest = {
      teamId: teamId,
      status: status,
      page: this.pageIssues,
      size: this.perPageIssues,
      minDate: this.minDate ? this.dateToStr(this.minDate) : undefined,
      maxDate: this.maxDate ? this.dateToStr(this.maxDate) : undefined,
      atDate: this.atDate ? this.dateToStr(this.atDate) : undefined,
    };
    if (this.dateToStr(this.atDate)==this.dateToStr(new Date())){
      issuesReq.atDate=undefined;
    }

    const issuesList = await api.findingsListFindingsIssues(issuesReq);
    
    this.dataIssues = issuesList.issues || [];
    this.totalIssues = issuesList.pagination!.total || 0;
  }

  private async loadAssets(teamId: string, api: FindingsApi) {
    let status = "OPEN"
    if (this.modeSelect=="fixed") {
      status="FIXED"
    }

    const assetsReq: FindingsListFindingsTargetsRequest = {
      teamId: teamId,
      status: status,
      page: this.pageAssets,
      size: this.perPageAssets,
      minDate: this.minDate ? this.dateToStr(this.minDate) : undefined,
      maxDate: this.maxDate ? this.dateToStr(this.maxDate) : undefined,
      atDate: this.atDate ? this.dateToStr(this.atDate) : undefined,
    };
    if (this.dateToStr(this.atDate)==this.dateToStr(new Date())){
      assetsReq.atDate=undefined;
    }

    const assetsList = await api.findingsListFindingsTargets(assetsReq);
    
    this.dataAssets = assetsList.targets || [];
    this.totalAssets = assetsList.pagination!.total || 0;
  }

  async onIssuesPageChange(page: number) {
    try {
      if (!this.findingsApi) {
        throw new Error("no client api found");
      }

      this.pageIssues = page;
      this.loadingIssues = true;
      
      await this.loadIssues(
        this.teamId,
        this.findingsApi
      );
    } catch (err) {
      this.$emit('handleerror', err);
    } finally {
      this.loadingIssues = false;
    }
  }

  async onAssetsPageChange(page: number) {
    try {
      if (!this.findingsApi) {
        throw new Error("no client api found");
      }

      this.pageAssets = page;
      this.loadingAssets = true;

      await this.loadAssets(
        this.teamId,
        this.findingsApi
      );
    } catch (err) {
      this.$emit('handleerror', err);
    } finally {
      this.loadingAssets = false;
    }
  }

  dateToStr(date: Date): string {
    const year  = new Intl.DateTimeFormat('en', { year:  'numeric' }).format(date);
    const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
    const day   = new Intl.DateTimeFormat('en', { day:   '2-digit' }).format(date);

    return year+"-"+month+"-"+day;
  }

  // Beginning of routines related to Findings

  // loadFindings will retrieve from the Vulcan API. 
  // params:
  // - teamId:  The ID of the team in the Vulcan API. Required.
  // - api:     Client for the Vulcan API. Required.
  // - issueId: The ID of the issue in the Vulnerability DB. The query will only return findings that 
  //            contains this issue. Optional. 
  private async loadFindings(teamId: string, api: FindingsApi, issueId: string, targetId: string) {
    let status = "OPEN"
    if (this.modeSelect=="fixed") {
      status="FIXED"
    }

    let perPage = this.perPageFindings;
    let page = this.pageFindings;

    if (issueId && issueId != "") {
      if (!this.mapFindingsByIssues.has(issueId)){
        this.mapFindingsByIssues.set(issueId, new Object());
        this.mapFindingsByIssues.get(issueId).perPage = 10;
      }
      perPage = this.mapFindingsByIssues.get(issueId).perPage;
      page = this.mapFindingsByIssues.get(issueId).page;
      this.mapFindingsByIssues.get(issueId).loading = true;
    }

    if (targetId && targetId != "") {
      if (!this.mapFindingsByAssets.has(targetId)){
        this.mapFindingsByAssets.set(targetId, new Object());
        this.mapFindingsByAssets.get(targetId).perPage = 10;
      }
      perPage = this.mapFindingsByAssets.get(targetId).perPage;
      page = this.mapFindingsByAssets.get(targetId).page;
      this.mapFindingsByAssets.get(targetId).loading = true;
    }

    let findingsList = {};
    if (!issueId && !targetId) {
      const findingsReq: FindingsListFindingsRequest = {
        teamId: teamId,
        status: status,
        sortBy: "-score",
        page: page,
        size: perPage,
        minDate: this.minDate ? this.dateToStr(this.minDate): "",
        maxDate: this.maxDate ? this.dateToStr(this.maxDate): "",
        atDate: this.atDate ? this.dateToStr(this.atDate): "",
      };
      if (this.dateToStr(this.atDate)==this.dateToStr(new Date())){
        findingsReq.atDate=undefined;
      }
    
      findingsList = await api.findingsListFindings(findingsReq);
    }

    if (issueId && issueId != "") {
      const findingsReq: FindingsFindFindingsFromAIssueRequest = {
        teamId: teamId,
        issueId: issueId,
        status: status,
        sortBy: "-score",
        page: page,
        size: perPage,
        minDate: this.minDate ? this.dateToStr(this.minDate): "",
        maxDate: this.maxDate ? this.dateToStr(this.maxDate): "",
        atDate: this.atDate ? this.dateToStr(this.atDate): "",
      };
      if (this.dateToStr(this.atDate)==this.dateToStr(new Date())){
        findingsReq.atDate=undefined;
      }
      findingsList = await api.findingsFindFindingsFromAIssue(findingsReq);
      this.mapFindingsByIssues.get(issueId).data = findingsList.findings || [];
      this.mapFindingsByIssues.get(issueId).total = findingsList.pagination!.total || 0;
      this.mapFindingsByIssues.get(issueId).loading = false;
    }

    if (targetId && targetId != "") {
      const findingsReq: FindingsFindFindingsFromATargetRequest = {
        teamId: teamId,
        targetId: targetId,
        status: status,
        sortBy: "-score",
        page: page,
        size: perPage,
        minDate: this.minDate ? this.dateToStr(this.minDate): "",
        maxDate: this.maxDate ? this.dateToStr(this.maxDate): "",
        atDate: this.atDate ? this.dateToStr(this.atDate): "",
      };
      if (this.dateToStr(this.atDate)==this.dateToStr(new Date())){
        findingsReq.atDate=undefined;
      }
      findingsList = await api.findingsFindFindingsFromATarget(findingsReq);
      
      this.mapFindingsByAssets.get(targetId).data = findingsList.findings || [];
      this.mapFindingsByAssets.get(targetId).total = findingsList.pagination!.total || 0;
      this.mapFindingsByAssets.get(targetId).loading = false;
    }

    this.dataFindings = findingsList.findings || [];
    this.totalFindings = findingsList.pagination!.total || 0;
  }

  // Beginning of routines related to the Issues Tab
  
  // toggleDetailsIssues is invoked when the user expand/collapse the detailed view for a row from the Issues table.
  async toggleDetailsForIssuesTable(row) {
    // Check if the current row is already visible. If it's not visible, query the Vulcan API 
    // for the findings for the select issue. 
    let visible = this.$refs.tableIssues.isVisibleDetailRow(row)

    this.$refs.tableIssues.toggleDetails(row)
    if (!visible) {
      await this.loadFindings(
        this.teamId,
        this.findingsApi,
        row.issueId,
      );

      await this.$refs["tableFindingsByIssues-"+row.issueId]

      // Add event listeners
      this.$refs["tableFindingsByIssues-"+row.issueId].$on('page-change', this.makeOnPageChange(
        this.teamId, 
        this.findingsApi, 
        "tableFindingsByIssues-"+row.issueId,
        "tableIssues",
        row.issueId, 
        this.mapFindingsByIssues, 
        this.loadFindings,
        this.$refs)); 
    }

    this.$refs["tableIssues"].$forceUpdate();
  }

  makeOnPageChange(teamId: string, api: FindingsApi, tableName, parentName, id, map, loadFunc, refs) {
    return async function(page: number) {
      try {
        if (!api) {
          throw new Error("no client api found");
        }
        refs[parentName].$forceUpdate(); 
        map.get(id).page = page;
        
        if (parentName=="tableIssues") {
          await loadFunc(
            teamId,
            api,
            id,
            undefined,
          );
        } else {
          await loadFunc(
            teamId,
            api,
            undefined,
            id,
          );  
        }
        refs[tableName].$emit('data:update', id, map.get(id).data)
        await refs[tableName]
      } catch (err) {
        refs[tableName].$emit('handleerror', err);
      } finally {
        refs[parentName].$forceUpdate(); 
      }
    };    
  }  
  // Beginning of routines related to the Assets Tab
  
  // toggleDetailsIssues is invoked when the user expand/collapse the detailed view for a row from the Issues table.
  async toggleDetailsForAssetsTable(row) {
    
    // Check if the current row is already visible. If it's not visible, query the Vulcan API 
    // for the findings for the select issue. 
    let visible = this.$refs.tableAssets.isVisibleDetailRow(row)
    this.$refs.tableAssets.toggleDetails(row)

    if (!visible) {
      await this.loadFindings(
        this.teamId,
        this.findingsApi,
        row.issueId,
        row.targetId,
      );

      await this.$refs["tableFindingsByAssets-"+row.targetId]

      // Add event listeners
      this.$refs["tableFindingsByAssets-"+row.targetId].$on('page-change', this.makeOnPageChange(
        this.teamId, 
        this.findingsApi, 
        "tableFindingsByAssets-"+row.targetId,
        "tableAssets",
        row.targetId, 
        this.mapFindingsByAssets, 
        this.loadFindings,
        this.$refs)); 

      this.$refs["tableAssets"].$forceUpdate();
    }    
  }

  // End Assets Tab

  @Watch('atDate')
  async onAtDateChanged(value: string, oldValue: string) {
    try {
      this.resetDetailsTables();

      if (!this.findingsApi) {
        throw new Error("no client api found");
      }

      this.pageIssues = null;
      this.loadingIssues = true;

      this.pageAssets = null;
      this.loadingAssets = true;
      
      this.getStatsOpen(
        this.statsApi,
      );

      this.loadTop10Issues(
        this.teamId,
        this.findingsApi
      );

      this.loadTop10Assets(
        this.teamId,
        this.findingsApi
      );

      await this.loadIssues(
        this.teamId,
        this.findingsApi
      );

      await this.loadAssets(
        this.teamId,
        this.findingsApi
      );
    } catch (err) {
      this.$emit('handleerror', err);
    } finally {
      this.loadingIssues = false;
      this.loadingAssets = false;
    }
  }

  @Watch('minDate')
  @Watch('maxDate')
  async onMinMaxDateChange(value: string, oldValue: string) {
    try {
      this.resetDetailsTables();

      if (!this.findingsApi) {
        throw new Error("no client api found");
      }

      this.pageIssues = null;
      this.loadingIssues = true;

      this.pageAssets = null;
      this.loadingAssets = true;
      
      if (this.modeSelect=="open") {
        await this.getStatsOpen(
          this.statsApi,
        );
      } else if (this.modeSelect=="fixed") {
        await this.getStatsFixed(
          this.statsApi,
        );
      }
      
      await this.loadTop10Issues(
        this.teamId,
        this.findingsApi
      );

      await this.loadTop10Assets(
        this.teamId,
        this.findingsApi
      );

      await this.loadIssues(
        this.teamId,
        this.findingsApi
      );

      await this.loadAssets(
        this.teamId,
        this.findingsApi
      );
    } catch (err) {
      this.$emit('handleerror', err);
    } finally {
      this.loadingIssues = false;
      this.loadingAssets = false;
    }
  }

  resetDetailsTables() {
    this.mapFindingsByAssets = new Map();
    this.mapFindingsByIssues = new Map();
  
    for (let i = 0; i < this.dataAssets.length; i++) {
      this.$refs["tableAssets"].closeDetailRow()
    }
  
    for (let i = 0; i < this.dataIssues.length; i++) {
      this.$refs["tableIssues"].closeDetailRow()
    }   
  }

  onSelectInput(value) {
    this.resetDetailsTables(); 

    if (value=="digest") {
      this.modeDescription = "Showing all findings that are still OPEN until the selected date.";
      this.atDate = new Date();
      this.digestDateClass = "";

      this.minDate = null;
      this.maxDate = null;
      this.diffMinDateClass = "is-hidden";
      this.diffMaxDateClass = "is-hidden";
    } else if (value=="open" || value=="fixed"){
      this.modeDescription = "Showing all findings that were DETECTED during a time range.";
      if (value=="fixed") {
        this.modeDescription = "Showing all findings that were FIXED during a time range.";
      }
      this.atDate = null;
      this.digestDateClass = "is-hidden";

      this.maxDate = new Date();
      this.minDate = new Date(this.maxDate);
      this.minDate.setMonth(this.minDate.getMonth() - 3);

      var qparams = new URL(document.location.toString()).searchParams;
      let minDate = qparams.get('minDate');
      if (minDate && minDate.length > 0){
        this.minDate = new Date(minDate.substr(0,4), minDate.substr(5,2)-1, minDate.substr(8, 2))
      }

      let maxDate = qparams.get('maxDate');
      if (maxDate && maxDate.length > 0){
        this.maxDate = new Date(maxDate.substr(0,4), maxDate.substr(5,2)-1, maxDate.substr(8, 2))
      }

      this.diffMinDateClass = "";
      this.diffMaxDateClass = "";
    }
  }

  onClickDateShortcut(range) {
    if (this.modeSelect=='diff' || this.modeSelect=='fixed') {
      this.maxDate=new Date();
      this.minDate=new Date(this.maxDate);
      if (range=='7days') {
        this.minDate.setDate(this.minDate.getDay() - 7);
      }
      if (range=='15days') {
        this.minDate.setDate(this.minDate.getDay() - 15);
      }
      if (range=='1month') {
        this.minDate.setMonth(this.minDate.getMonth() - 1);
      }
      if (range=='3months') {
        this.minDate.setMonth(this.minDate.getMonth() - 3);
      }
      if (range=='6months') {
        this.minDate.setMonth(this.minDate.getMonth() - 6);
      }
      if (range=='1year') {
        this.minDate.setFullYear(this.minDate.getFullYear() - 1);
      }
      if (range=='2years') {
        this.minDate.setFullYear(this.minDate.getFullYear() - 2);
      }
    }

    if (this.modeSelect=='digest') {
      this.atDate=new Date();
      if (range=='7days') {
        this.atDate.setDate(this.atDate.getDay() - 7);
      }
      if (range=='15days') {
        this.atDate.setDate(this.atDate.getDay() - 15);
      }
      if (range=='1month') {
        this.atDate.setMonth(this.atDate.getMonth() - 1);
      }
      if (range=='3months') {
        this.atDate.setMonth(this.atDate.getMonth() - 3);
      }
      if (range=='6months') {
        this.atDate.setMonth(this.atDate.getMonth() - 6);
      }
      if (range=='1year') {
        this.atDate.setFullYear(this.atDate.getFullYear() - 1);
      }
      if (range=='2years') {
        this.atDate.setFullYear(this.atDate.getFullYear() - 2);
      }
    }
  }

  rowclass(){
    return "showcursor"
  }

  openSince(currentExposure) {
    var d = new Date();
    d.setHours(d.getHours() - (currentExposure/24)*24);
    let tmp = (d.toISOString().split('T')[0]).split('-')
    return tmp[2]+"/"+tmp[1]+"/"+tmp[0];
  }

  private handleError(err: any) {
    this.$emit('handleerror', err);
  }

  private async updateIssue(prop) {
      await this.loadFindings(
        this.teamId,
        this.findingsApi,
        prop.row.issue.id,
      );

      await this.$refs["tableFindingsByIssues-"+prop.row.issue.id]
      this.$refs["tableIssues"].$forceUpdate();
      this.getStatsFixed(this.statsApi);
      this.getStatsOpen(this.statsApi);
  }

  private async updateAsset(prop) {
      await this.loadFindings(
        this.teamId,
        this.findingsApi,
        prop.row.issue.id,
        prop.row.target.id,
      );

      await this.$refs["tableFindingsByAssets-"+prop.row.target.id]
      this.$refs["tableAssets"].$forceUpdate();
      this.getStatsFixed(this.statsApi);
      this.getStatsOpen(this.statsApi);
  }
}

Vue.filter('truncate', function (value: string, length: number) {
  return value.length > length
    ? value.substr(0, length) + '...'
    : value
})

Vue.filter('fmtDate', function(date: string): string {
  let dateTimeLength = "YYYY-MM-DD hh:mm:ss".length
  
  return date.length > dateTimeLength
    ? date.substr(0, dateTimeLength)
    : date
})

Vue.filter('fmtLink', function(link: string): string {
  return new URL(link).hostname
})
</script>