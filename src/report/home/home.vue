<!--
Copyright 2021 Adevinta
-->

<template>
    <div>
        <div class="container">
        <div class="columns"><div class="column" style="font-weight: bold;">Total Security Issues</div></div>
        <div class="columns"  style="padding:1">
            <div class="column has-text-white is-critical-severity" style="font-size: 4; text-align: center;padding:4" >
            </div>
            <div class="column has-text-white is-high-severity" style="font-size: 4;    text-align: center;padding:4">
            </div>
            <div class="column has-text-white is-medium-severity" style="font-size: 4; text-align: center;padding:4" >
            </div>
            <div class="column has-text-dark is-low-severity"  style="font-size: 4; text-align: center;padding:4">
            </div>
            <div class="column has-text-white is-info-severity" style="font-size: 4; text-align: center;padding:4">
            </div>
        </div>
        <div class="columns" v-if="modeSelect == 'fixed'">
            <div class="column" style="font-size: 36; text-align: center;" >
                {{ statsFixed && statsFixed.fixedIssues ? statsFixed.fixedIssues.critical : "-" }}
                <div style="font-size: 14;">Critical</div>
            </div>
            <div class="column" style="font-size: 36;    text-align: center;">
                {{ statsFixed && statsFixed.fixedIssues ? statsFixed.fixedIssues.high : "-" }}
                <div style="font-size: 14;">High</div>
            </div>
            <div class="column" style="font-size: 36; text-align: center;" >
                {{ statsFixed && statsFixed.fixedIssues ? statsFixed.fixedIssues.medium : "-" }}
                <div style="font-size: 14;">Medium</div>
            </div>
            <div class="column"  style="font-size: 36; text-align: center;">
                {{ statsFixed && statsFixed.fixedIssues ? statsFixed.fixedIssues.low : "-" }}
                <div style="font-size: 14;">Low</div>
            </div>
            <div class="column" style="font-size: 36; text-align: center;">
                {{ statsFixed && statsFixed.fixedIssues ? statsFixed.fixedIssues.informational : "-" }}
                <div style="font-size: 14;">Informational</div>
            </div>
        </div>
        <div class="columns" v-else>
            <div class="column" style="font-size: 36; text-align: center;">
                {{ statsOpen.openIssues ? statsOpen.openIssues.critical : "-" }}
                <div style="font-size: 14;">Critical</div>
            </div>
            <div class="column" style="font-size: 36; text-align: center;">
                {{ statsOpen.openIssues ? statsOpen.openIssues.high : "-" }}
                <div style="font-size: 14;">High</div>
            </div>
            <div class="column" style="font-size: 36; text-align: center;" >
                {{ statsOpen.openIssues ? statsOpen.openIssues.medium : "-" }}
                <div style="font-size: 14;">Medium</div>
            </div>
            <div class="column"  style="font-size: 36; text-align: center;">
                {{ statsOpen.openIssues ? statsOpen.openIssues.low : "-" }}
                <div style="font-size: 14;">Low</div>
            </div>
            <div class="column" style="font-size: 36; text-align: center;">
                {{ statsOpen.openIssues ? statsOpen.openIssues.informational : "-" }}
                <div style="font-size: 14;">Informational</div>
            </div>
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
                <!-- Labels Picker -->
                <div>
                  <section>
                    <b-field>
                      <b-checkbox-button type="is-info" v-model="selLabels" v-for="label in allLabels" :key="label"
                          :native-value="label"
                      >
                        <span>{{ label }}</span>
                      </b-checkbox-button>
                    </b-field>
                  </section>
                </div>
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
            <div v-if='homeMounted' class="card">
                <div class="card-content">
                <h1 class="title">Top 10 Most Relevant Issues</h1>
                <!-- TOP 10 ISSUES TABLE -->
                <TableIssues
                  :minDate="minDate"
                  :maxDate="maxDate"
                  :atDate="atDate"
                  :status="status"
                  :identifiers="identifiers"
                  :labels="selLabels"
                  :paginated="false"
                  :perPageIssues="10"
                  v-on:handleerror="handleError"
                >
                </TableIssues>
                </div>
            </div>
            <hr/>
            <div v-if='homeMounted' class="card">
                <div class="card-content">
                <h1 class="title">Top 10 Most Vulnerable Assets</h1>
                <!-- TOP 10 ASSETS TABLE -->
                <TableAssets
                  :minDate="minDate"
                  :maxDate="maxDate"
                  :atDate="atDate"
                  :status="status"
                  :identifiers="identifiers"
                  :labels="selLabels"
                  :paginated="false"
                  :perPageAssets="10"
                  v-on:handleerror="handleError"
                >
                </TableAssets>
                </div>
            </div>

            </b-tab-item>
            <b-tab-item label="Issues" class="has-text-strong" icon="bug">
            <div v-if='homeMounted' class="card">
                <div class="card-content">
                    <!-- ISSUES TABLE -->
                    <TableIssues
                      :minDate="minDate"
                      :maxDate="maxDate"
                      :atDate="atDate"
                      :status="status"
                      :identifiers="identifiers"
                      :labels="selLabels"
                      v-on:handleerror="handleError"
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
            <div v-if='homeMounted' class="card">
                <div class="card-content">
                  <!-- ASSETS TABLE -->
                  <TableAssets
                    :minDate="minDate"
                    :maxDate="maxDate"
                    :atDate="atDate"
                    :status="status"
                    :identifiers="identifiers"
                    :labels="selLabels"
                    v-on:handleerror="handleError"
                  >
                  </TableAssets>
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
  import TableIssues from "../tableIssues/tableIssues.vue";
  import TableAssets from "../tableAssets/tableAssets.vue";
  import loadConfig, { Config } from "../../common/config";
  import tokenProvider from "../../common/token";
  import teamID from "../../common/team";
import { severityStyle, severityText, statusClass } from "../utils/utils";
import {
   Configuration as ApiConf,
   ConfigurationParameters,
} from "../../services/vulcan-api";
import {
   StatsApi, 
   StatsOpenRequest, 
   StatsFixedRequest,
   FindingsApi,
   FindingsListFindingsLabelsRequest
} from "../../services/vulcan-api/apis";
import {
  Statsopen,
  Statsfixed
} from "../../services/vulcan-api/models";

const digestModeDesc = "Showing all findings that are still OPEN until the selected date.";
const openModeDesc = "Showing all findings that were DETECTED during a time range.";
const fixedModeDesc = "Showing all findings that were FIXED during a time range.";

@Component({
  name: "Home",
  components: {
    Loading,
    ErrorDialog,
    Session,
    FindingDetails,
    TableIssues,
    TableAssets,
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
  private homeMounted: boolean = false;

  private showSession: boolean = false;
  private apiUrl: string = "";

  private showError: boolean = false;
  private errorMessage: string = "";

  private teamId: string = "";
  private statsApi?: StatsApi;
  private findingsApi?: FindingsApi;

  // Datepicker
  private atDate: Date = new Date();
  private minDate: Date = null;
  private maxDate: Date = null;
  
  private status: string = "OPEN";
  private identifiers: string = "";
  private staticLabels: string[] = [];
  private allLabels: string[] = [];
  private selLabels: string[] = [];

  private statsOpen: Statsopen = {};
  private statsFixed: Statsfixed = {};

  private severityStyle = severityStyle
  private severityText = severityText
  private statusClass = statusClass

  async mounted() {
    try {
      // Load the config
      const conf = await loadConfig();
      const tProvider = tokenProvider(conf);
      const c: ConfigurationParameters = {
        apiKey: tProvider,
        basePath: conf.apiUrl
      };
      this.apiUrl = conf.apiUrl;
      this.staticLabels = conf.staticLabels;

      // Build the api clients
      const apiConfg = new ApiConf(c);
      this.statsApi = new StatsApi(apiConfg);
      this.findingsApi = new FindingsApi(apiConfg);

      // Load params
      this.teamId = teamID();
      this.parseQueryString();
      this.onSelectInput(this.modeSelect);

      // Set mounted flag to true so childs can init
      // with parsed data for query string parameters
      this.homeMounted = true;
    } catch (err) {
      this.$emit('handleerror', err);
    } finally {
      this.$emit('toggleUserListTeams', true);
      this.loading = false;
    }
  }

  private async loadLabels(findingsApi: FindingsApi) {
    try {
      const labelsReq: FindingsListFindingsLabelsRequest = {
        teamId: this.teamId,
        status: this.status,
        minDate: this.minDate ? this.dateToStr(this.minDate) : undefined,
        maxDate: this.maxDate ? this.dateToStr(this.maxDate) : undefined,
        atDate: this.atDate ? this.dateToStr(this.atDate) : undefined,
        identifiers: this.identifiers,
      };
      if (this.dateToStr(this.atDate) == this.dateToStr(new Date())) {
        labelsReq.atDate = undefined;
      }
  
      const labelsList = await findingsApi?.findingsListFindingsLabels(
        labelsReq
      );
  
      this.allLabels = this.mergeLabels(this.staticLabels, labelsList.labels!);
    } catch (err) {
      this.$emit('handleerror', err);
    }
  }


  private async getStatsOpen(statsApi: StatsApi) {
    const req: StatsOpenRequest = {
      teamId: this.teamId,
      minDate: this.minDate ? this.dateToStr(this.minDate) : undefined,
      maxDate: this.maxDate ? this.dateToStr(this.maxDate) : undefined,
      atDate: this.atDate ? this.dateToStr(this.atDate) : undefined,
      identifiers: this.identifiers,
      labels: this.selLabels.join(",")
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
      identifiers: this.identifiers,
      labels: this.selLabels.join(",")
    };
    if (this.dateToStr(this.atDate)==this.dateToStr(new Date())){
      req.atDate=undefined;
    }
    this.statsFixed = await this.statsApi.statsFixed(req)
  }

  dateToStr(date: Date): string {
    const year  = new Intl.DateTimeFormat('en', { year:  'numeric' }).format(date);
    const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
    const day   = new Intl.DateTimeFormat('en', { day:   '2-digit' }).format(date);

    return year+"-"+month+"-"+day;
  }

  @Watch('atDate')
  @Watch('selLabels', {deep: true})
  async onAtDateChanged(value: string, oldValue: string) {
    try {

      if (!this.statsApi || !this.findingsApi) {
        throw new Error("no client api found");
      }
      
      this.getStatsOpen(
        this.statsApi,
      );

      this.loadLabels(
        this.findingsApi
      );

    } catch (err) {
      this.$emit('handleerror', err);
    }
  }

  @Watch('minDate')
  @Watch('maxDate')
  @Watch('selLabels', {deep: true})
  async onMinMaxDateChange(value: string, oldValue: string) {
    try {

      if (!this.statsApi || !this.findingsApi) {
        throw new Error("no client api found");
      }
      
      if (this.modeSelect=="open") {
          this.getStatsOpen(
          this.statsApi,
        );
      } else if (this.modeSelect=="fixed") {
          this.getStatsFixed(
          this.statsApi,
        );
      }

      this.loadLabels(
        this.findingsApi
      );
      
    } catch (err) {
      this.$emit('handleerror', err);
    }
  }

  onSelectInput(value) {
    this.status = "OPEN";

    if (value == "digest") {
      
      this.modeDescription = digestModeDesc;
      
      this.atDate = new Date();
      this.minDate = null;
      this.maxDate = null;

      this.digestDateClass = "";
      this.diffMinDateClass = "is-hidden";
      this.diffMaxDateClass = "is-hidden";

    } else if (value == "open" || value == "fixed"){
      
      this.modeDescription = openModeDesc;
      if (value == "fixed") {
        this.status = "FIXED";
        this.modeDescription = fixedModeDesc;
      }

      this.atDate = null;
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

      this.digestDateClass = "is-hidden";
      this.diffMinDateClass = "";
      this.diffMaxDateClass = "";
    }
  }

  onClickDateShortcut(range) {
    if (this.modeSelect=='open' || this.modeSelect=='fixed') {
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

  openSince(currentExposure) {
    var d = new Date();
    d.setHours(d.getHours() - (currentExposure/24)*24);
    let tmp = (d.toISOString().split('T')[0]).split('-')
    return tmp[2]+"/"+tmp[1]+"/"+tmp[0];
  }

  private parseQueryString() {
    var qparams = new URL(document.location.toString()).searchParams;
      if (qparams.get('minDate') || qparams.get('maxDate')) {
        this.modeSelect="open";
      } else {
        this.modeSelect="digest";
      }
      if (qparams.get('status')=="FIXED") {
        this.modeSelect="FIXED";
      }
      this.identifiers = qparams.get('identifiers') || ""
  }

  // MergeLabels merges ls and ld arrays by pushing back ld
  // elements into ls and discarding repeated ones
  private mergeLabels(ls: string[], ld: string[]): string[] {
    ld.forEach(l => {
      if (ls.indexOf(l) == -1) {
        ls.push(l);
      }
    });
    return ls;
  }

  private handleError(err: any) {
    this.$emit('handleerror', err);
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
