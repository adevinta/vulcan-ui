<!--
Copyright 2021 Adevinta
-->

<template>
   <div>
    <Session :show="showSession" :apiUrl="apiUrl">
      <ErrorDialog :show="showError" :message="errorMessage"></ErrorDialog>
      <Loading :show="loading">
        <div class="container">
        <div class="columns table-pagination">
                 <div class="column is-narrow show-label">
                  <span>Program</span>
                </div>
                <div class="column is-2">
                   <b-select v-model="selectedProgram" @input="onProgramSelected">
                     <option v-for="program in programs" :value="program.id" v-bind:key="program.id">{{ program.name }}</option>
                   </b-select>
                  </b-field>
                </div>
                <div class="column is-narrow show-label">
                  <span>Show</span>
                </div>
                <div class="column is-2 select-container">
                  <div class="select pull-left">
                    <select v-model="rowsPerPage" :disabled="currentRows.length < 1">
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                      <option value="40">40</option>
                      <option value="-1">All</option>
                    </select>
                  </div>
                </div>
                <div class="column column is-4">
                  <div id="search" class="field has-addons">
                    <div class="control has-icons-left">
                      <input
                        id="filter-query"
                        class="input"
                        type="text"
                        placeholder="Filter teams"
                        v-model="filter"
                      />
                      <span class="icon is-small is-left">
                        <i class="fa fa-filter"></i>
                      </span>
                    </div>
                    <div id="searchReset" class="control">
                      <a class="button is-primary clear-filter" @click="onSearchResetClick" >
                        <span class="icon">
                          <i class="fa fa-times"></i>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <b-table
                :per-page="rowsPerPage"
                :data="currentRows"
                :paginated="isPaginated()"
                :hoverable="true"
                ref="table"
              >
                <template slot="empty">
                  <section class="section">
                    <div class="content has-text-grey has-text-centered">
                      <p>No teams with selected global program found</p>
                    </div>
                  </section>
                </template>
                <template slot-scope="props">
                  <b-table-column field="team" label="Team">{{ props.row.teamName }}</b-table-column>
                  <b-table-column field="schedule" label="Schedule">{{ props.row.humanSchedule }}</b-table-column>
                  <b-table-column field="sendReport" label="Send Report">{{ props.row.autosendReport }}</b-table-column>
                </template>
              </b-table>
         </div>
      </Loading>
    </Session>
</template>
<script lang="ts">
// Import modules.
import { Component, Prop, Vue } from "vue-property-decorator";
import construe from "cronstrue";
import Loading from "../../components/loading.vue";
import ErrorDialog from "../../components/error.vue";
import Session from "../../components/session.vue";
import loadConfig, { Config } from "../../common/config";
import tokenProvider from "../../common/token";
import asyncBatch from "../../common/asyncbatches";
import {
  Configuration as ApiConf,
  ConfigurationParameters,
} from "../../services/vulcan-api";
import {
  TeamsApi,
  TeamsShowRequest,
  TeamsListRequest,
  ProgramsApi,
} from "../../services/vulcan-api/apis";
import {
  Asset,
  AssetUpdatePayload,
  Program,
  Team,
} from "../../services/vulcan-api/models";
import VueRouter, { RouteConfig } from "vue-router";

@Component({
  name: "Programs",
  components: {
    Loading,
    ErrorDialog,
    Session,
  },
})
export default class Index extends Vue {
  $refs!: {
    table: any;
  };

  // Fields.
  private team: string = "";

  private teamsApi?: TeamsApi;

  private programsApi?: ProgramsApi;

  private showError: boolean = false;

  private errorMessage: string = "";

  private loading: boolean = true;

  private showSession: boolean = false;

  private apiUrl: string = "";

  private teams: Team[] = [];

  private programs: GlobalProgram[] = [
    {
      name: "Periodic Scan",
      id: "periodic-full-scan",
    },
    {
      name: "Web Scanning",
      id: "web-scanning",
    },
    {
      name: "Redcon Scan",
      id: "redcon-scan",
    },
  ];

  selectedProgram: string = this.programs[0].id;

  rows: TeamPrograms[] = [];

  checkedRows: TeamPrograms[] = [];
  // Show items page properties.
  private rowsPerPage: number = 10;

  // Filter teams programs text input bound property.
  private filter: string = "";

  // Properties.
  private get currentRows(): TeamPrograms[] {
    const rexp = new RegExp(this.filter, "i");
    const ret = this.rows.filter(
      (t: TeamPrograms): Boolean => {
        const regexpMatch = rexp.test(t.teamName);
        return regexpMatch;
      }
    );
    return ret;
  }

  // Hooks.
  async mounted() {
    try {
      // Load the config parameters needed to build the apli clients.
      this.loading = true;
      const conf = await loadConfig();
      const tProvider = tokenProvider(conf);
      const c: ConfigurationParameters = {
        apiKey: tProvider,
        basePath: conf.apiUrl,
      };
      this.apiUrl = conf.apiUrl;
      // Build the api clients.
      const apiConfg = new ApiConf(c);
      // Load the teams.
      this.teamsApi = new TeamsApi(apiConfg);
      const req: TeamsListRequest = {
        tag: undefined // get all teams
      };
      this.teams = await this.teamsApi.teamsList(req);
      this.programsApi = new ProgramsApi(apiConfg);
      this.rows = await this.loadTeamsPrograms(
        this.teams,
        this.selectedProgram
      );
    } catch (err) {
      this.handleError(err);
    }
    this.loading = false;
  }

  // Event handlers.
  async onProgramSelected(programID: string) {
    try {
      // Load the config parameters needed to build the apli clients.
      this.loading = true;
      this.rows = await this.loadTeamsPrograms(
        this.teams,
        this.selectedProgram
      );
    } catch (err) {
      this.handleError(err);
    }
    this.loading = false;
  }
  
  async onSearchResetClick() {
    this.filter = ""
  }


  // Private methods.
  private async loadTeamsPrograms(
    teams: Team[],
    programID: string
  ): Promise<TeamPrograms[]> {
    const programs = await asyncBatch(
      teams,
      10,
      (t) =>
        this.programsApi!.programsShow({
          teamId: t.id || "",
          programId: programID,
        })
    );
    const res: TeamPrograms[] = [];
    programs.forEach(([t, p], index) => {
      const teamID = t.id || "";
      const teamName = t.name || "";
      p.schedule = p.schedule || { cron: "" };
      let humanSchedule = "";
      try {
        humanSchedule = construe.toString(p.schedule.cron);
      } catch {
        humanSchedule = `invalid cron schedule: ${p.schedule.cron}`;
      }
      res.push({
        teamID: teamID,
        schedule: p.schedule!.cron || "",
        teamName: teamName,
        autosendReport: p.autosend || true,
        humanSchedule: humanSchedule,
      });
    });
    return res;
  }

  private isPaginated(): boolean {
    return this.rowsPerPage != -1;
  }

  private handleError(err: any) {
    if (err instanceof Response) {
      switch (err.status) {
        case 403:
        case 401:
        case 404:
          this.showSession = true;
          break;
        default:
          console.log(`${err.status} ": " ${err.statusText}`);
          this.errorMessage = `unexpected error calling vulcan api, status code: ${err.status}`;
          this.showError = true;
          break;
      }
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

interface GlobalProgram {
  name: string;
  id: string;
}

interface TeamPrograms {
  teamID: string;
  teamName: string;
  schedule: string;
  humanSchedule: string;
  autosendReport: Boolean;
}
</script>
