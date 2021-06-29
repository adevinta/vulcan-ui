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
                    <TableIssues
                        :minDate="minDate"
                        :maxDate="maxDate"
                        :atDate="atDate"
                    >
                    </TableIssues>
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
                    <ListOfFindings
                        ref="assetsTable"
                        :teamId="teamId"
                        :data="this.dataAssets"
                        :total="this.totalAssets"
                        :perPage="this.perPageAssets"
                        :modeSelect="this.modeSelect"
                        :minDate="this.minDate"
                        :maxDate="this.maxDate"
                        :atDate="this.atDate"
                        mode="target"

                        mainListDescriptionColumnHeader="Asset"
                        mainListDescriptionColumnIcon="server"

                        mainListCountColumnHeader="Issues"
                        mainListCountColumnIcon="bug"

                        mainListScoreColumnHeader="Score"

                        findingsListDescriptionColumnHeader="Issue"

                        v-on:updatepage="updatePageTargets"
                        v-on:updateperpage="updatePerPageTargets"
                        v-on:updatestats="updateStats"
                        v-on:handleerror="handleError"
                    >
                    </ListOfFindings>
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
  import ListOfFindings from "../listOfFindings/list.vue";
  import TableIssues from "../tableIssues/tableIssues.vue";
  import ListItem from "../listOfFindings/ListItem";
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
} from "../../services/vulcan-api/models";

@Component({
  name: "Home",
  components: {
    Loading,
    ErrorDialog,
    Session,
    FindingDetails,
    ListOfFindings,
    TableIssues,
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
  private dataIssues: ListItem[] = [];
  private totalIssues: number = 0;
  private loadingIssues: boolean = false;
  private pageIssues: number = 1;
  private perPageIssues: number = 20;

  // Assets
  private dataAssets: ListItem[] = [];
  private totalAssets: number = 0;
  private loadingAssets: boolean = false;
  private pageAssets: number = 1;
  private perPageAssets: number = 20;

  // Top 10 issues
  private dataTop10Issues: FindingsIssue[] = [];
  private totalTop10Issues: number = 0;
  private loadingTop10Issues: boolean = false;

  // Top 10 Assets
  private dataTop10Assets: FindingsTarget[] = [];
  private totalTop10Assets: number = 0;
  private loadingTop10Assets: boolean = false;

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
    
    this.dataIssues = this.convertFindingsIssuesToListItem(issuesList.issues) || [];
    this.totalIssues = issuesList.pagination!.total || 0;
  }

  private convertFindingsIssuesToListItem(issuesList: FindingsIssue[]) {
    let result: ListItem[] = [];

    for (var i=0; i < issuesList.length; i++){
        let item: ListItem = {
            Id: issuesList[i].issueId,
            Description: issuesList[i].summary,
            Count: issuesList[i].targetsCount,
            Score: issuesList[i].maxScore,
        };
        result.push(item);
    }

    return result;
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
    
    this.dataAssets = this.convertFindingsTargetToListItem(assetsList.targets) || [];
    this.totalAssets = assetsList.pagination!.total || 0;
  }

  private convertFindingsTargetToListItem(assetsList: FindingsTarget[]) {
    let result: ListItem[] = [];
      
    for (var i=0; i < assetsList.length; i++){
        let item: ListItem = {
            Id: assetsList[i].targetId,
            Description: assetsList[i].identifier,
            Count: assetsList[i].findingsCount,
            Score: assetsList[i].maxScore,
        };
        result.push(item);
    }

    return result;
  }

  private async updatePageTargets(page: number) {
      this.pageAssets = page;
      await this.loadAssets(
        this.teamId,
        this.findingsApi
      );
  }

  private async updatePerPageTargets(perPage: number) {
    this.perPageAssets = perPage;
    await this.loadAssets(
        this.teamId,
        this.findingsApi
    );
  }

  private async updatePageIssues(page: number) {
      this.pageIssues = page;
      await this.loadIssues(
        this.teamId,
        this.findingsApi
      );
  }

  private async updatePerPageIssues(perPage: number) {
    this.perPageIssues = perPage;
    await this.loadIssues(
        this.teamId,
        this.findingsApi
    );
  }

  private async updateStats() {
    this.getStatsFixed(this.statsApi);
    this.getStatsOpen(this.statsApi);
  }

  dateToStr(date: Date): string {
    const year  = new Intl.DateTimeFormat('en', { year:  'numeric' }).format(date);
    const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
    const day   = new Intl.DateTimeFormat('en', { day:   '2-digit' }).format(date);

    return year+"-"+month+"-"+day;
  }

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

  private resetDetailsTables() {
      //this.$refs["issuesTable"].resetDetailsTables();
      this.$refs["assetsTable"].resetDetailsTables();
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