<!--
Copyright 2021 Adevinta
-->

<template>
  <div>
    <Session :show="showSession" :apiUrl="apiUrl">
      <ErrorDialog :show="showError" :message="errorMessage"></ErrorDialog>
      <Loading :show="loading">
        <div class="columns">
          <div class="column has-text-centered">
            <h1 id="team" class="title">
              <span class="icon is-small" style="margin-right:.5em">
                <i class="fa fa-users"></i>
              </span>
              <span>{{ team }}</span>
            </h1>
          </div>
        </div>
        <div class="container">
          <div class="card">
            <header class="card-header">
              <p class="card-header-title is-size-5">AWS Accounts Risk Assessment</p>
            </header>
            <div class="card-content">
              <div class="columns table-pagination">
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
                        :disabled="currentRows.length < 1"
                        id="filter-query"
                        class="input"
                        type="text"
                        placeholder="Filter accounts"
                        v-model="filter"
                      />
                      <span class="icon is-small is-left">
                        <i class="fa fa-filter"></i>
                      </span>
                    </div>
                    <div id="searchReset" class="control">
                      <a class="button is-primary clear-filter" :disabled="currentRows.length < 1">
                        <span class="icon">
                          <i class="fa fa-times"></i>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="column is-narrow show-label">
                  <span>Unclassifieds Only</span>
                </div>
                <div class="column is-2 select-container">
                  <div class="pull-left">
                    <b-switch v-model="showUnclassifiedsOnly" @change.native="toggleUnclassifieds()" type="is-primary" size="is-medium"></b-switch>
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
                      <p>The team has no AWS accounts.</p>
                    </div>
                  </section>
                </template>
                <template slot-scope="props">
                  <b-table-column field="alias" label="Alias">{{ props.row.alias }}</b-table-column>
                  <b-table-column field="account" label="Identifier">{{ props.row.account }}</b-table-column>
                  <b-table-column field="Reputation" label="Reputation">
                    <template slot="header" slot-scope="{ column } ">
                      <b-tooltip label="Is the asset customer-facing?" dashed>{{ column.label }}</b-tooltip>
                    </template>
                    <b-switch
                      v-model="props.row.rolfp.r"
                      true-value="1"
                      false-value="0"
                      type="is-primary"
                      size="is-small"
                      @change.native="roflpSwitchClick(props,'r')"
                      :outlined="true"
                    >{{ rolfpValue(props.row.rolfp.r) }}</b-switch>
                  </b-table-column>
                  <b-table-column field="Operation" label="Operation">
                    <template slot="header" slot-scope="{ column } ">
                      <b-tooltip
                        label="Is the asset required for the productive activity of the company?"
                        dashed
                      >{{ column.label }}</b-tooltip>
                    </template>
                    <b-switch
                      v-model="props.row.rolfp.o"
                      true-value="1"
                      false-value="0"
                      type="is-primary"
                      size="is-small"
                      :outlined="true"
                      @change.native="roflpSwitchClick(props,'o')"
                    >{{ rolfpValue(props.row.rolfp.o) }}</b-switch>
                  </b-table-column>
                  <b-table-column field="Legal" label="Legal">
                    <template slot="header" slot-scope="{ column } ">
                      <b-tooltip
                        label="Is the security of the asset enforced by fines or other penalties?"
                        dashed
                      >{{ column.label }}</b-tooltip>
                    </template>
                    <b-switch
                      v-model="props.row.rolfp.l"
                      true-value="1"
                      false-value="0"
                      type="is-primary"
                      size="is-small"
                      :outlined="true"
                      @change.native="roflpSwitchClick(props,'l')"
                    >{{ rolfpValue(props.row.rolfp.l) }}</b-switch>
                  </b-table-column>
                  <b-table-column field="Financial" label="Financial">
                    <template slot="header" slot-scope="{ column } ">
                      <b-tooltip
                        label="Is the asset directly involved in the making or processing of money?"
                        dashed
                      >{{ column.label }}</b-tooltip>
                    </template>
                    <b-switch
                      v-model="props.row.rolfp.f"
                      true-value="1"
                      false-value="0"
                      type="is-primary"
                      size="is-small"
                      :outlined="true"
                      @change.native="roflpSwitchClick(props,'f')"
                    >{{ rolfpValue(props.row.rolfp.f) }}</b-switch>
                  </b-table-column>
                  <b-table-column field="Personal" label="Personal">
                    <template slot="header" slot-scope="{ column } ">
                      <b-tooltip
                        label="Is the asset relevant to the physical safety of people?"
                        dashed
                      >{{ column.label }}</b-tooltip>
                    </template>
                    <b-switch
                      v-model="props.row.rolfp.p"
                      true-value="1"
                      false-value="0"
                      type="is-primary"
                      size="is-small"
                      :outlined="true"
                      @change.native="roflpSwitchClick(props,'p')"
                    >{{ rolfpValue(props.row.rolfp.p) }}</b-switch>
                  </b-table-column>
                  <b-table-column field="Scope" label="Scope">
                    <template slot="header" slot-scope="{ column } ">
                      <b-tooltip
                        label="Is the asset capable of providing access to other completely independent assets?"
                        dashed
                      >{{ column.label }}</b-tooltip>
                    </template>
                    <b-switch
                      v-model="props.row.rolfp.s"
                      true-value="1"
                      false-value="0"
                      type="is-primary"
                      size="is-small"
                      :outlined="true"
                      @change.native="roflpSwitchClick(props,'s')"
                    >{{ rolfpValue(props.row.rolfp.s) }}</b-switch>
                  </b-table-column>
                  <b-table-column field="new" label>
                    <img
                      v-if="props.row.classifiedAt == undefined"
                      src="../images/unclassified.png"
                      title="Unclassified"
                    />
                  </b-table-column>
                </template>
              </b-table>
            </div>
          </div>
        </div>
      </Loading>
    </Session>
  </div>
</template>

<script lang="ts">
// Import modules
import { Component, Prop, Vue } from "vue-property-decorator";
import Loading from "../components/loading.vue";
import ErrorDialog from "../components/error.vue";
import Session from "../components/session.vue";
import loadConfig, { Config } from "../common/config";
import tokenProvider from "../common/token";
import teamID from "../common/team";
import {
  Configuration as ApiConf,
  ConfigurationParameters
} from "../services/vulcan-api";
import {
  AssetsApi,
  AssetsListRequest,
  AssetsUpdateRequest,
  TeamsApi,
  TeamsShowRequest
} from "../services/vulcan-api/apis";
import { Asset, AssetUpdatePayload, Team } from "../services/vulcan-api/models";

@Component({
  name: "ROLFP",
  components: {
    Loading,
    ErrorDialog,
    Session,
  }
})
export default class ROLFP extends Vue {
  $refs!: {
    table: any;
  };

  // Fields.
  private team: string = "";

  private assetsApi?: AssetsApi;

  private teamsApi?: TeamsApi;

  private teamID?: string;

  private showError: boolean = false;

  private errorMessage: string = "";

  private loading: boolean = true;

  private showSession: boolean = false;

  private apiUrl: string = "";

  // Filter accounts text input bound property.
  private filter: string = "";
  // Flag to show only unclassified accounts.
  private showUnclassifiedsOnly: boolean = false;

  private rows: AWSAccountViewModel[] = [];
  private forceShowRows: AWSAccountViewModel[] = [];

  // Show items page properties.
  private rowsPerPage: number = 10;

  // Properties.
  private get currentRows(): AWSAccountViewModel[] {
    const rexp = new RegExp(this.filter, "i");
    const ret = this.rows.filter(
      (v: any): Boolean => {
        const forceShow = this.forceShowRows.indexOf(v) > -1;
        const regexpMatch = rexp.test(v.alias);
        const classifiedMatch = this.showUnclassifiedsOnly && 
          v.classifiedAt == undefined || !this.showUnclassifiedsOnly;
        return (forceShow && regexpMatch) || (regexpMatch && classifiedMatch);
      }
    );
    return ret;
  }

  private isPaginated(): boolean {
    return this.rowsPerPage != -1;
  }

  // Hooks.
  async mounted() {
    try {
      // Load the config paramters needed to build the apli clients.
      const conf = await loadConfig();
      const tProvider = tokenProvider(conf);
      const c: ConfigurationParameters = {
        apiKey: tProvider,
        basePath: conf.apiUrl
      };
      this.apiUrl = conf.apiUrl;
      // Build the api clients.
      const apiConfg = new ApiConf(c);
      // Get the team id from the url.
      this.teamID = teamID();
      // Parse only unclassifieds from url.
      this.showUnclassifiedsOnly = this.onlyUnclassifieds();

      const assetsApi = new AssetsApi(apiConfg);
      const teamsApi = new TeamsApi(apiConfg);
      this.assetsApi = assetsApi;
      this.teamsApi = teamsApi;

      // Load team description.
      this.team = await this.loadTeam(
        this.teamID.toString() || "",
        this.teamsApi
      );

      // Load the aws accounts of the team.
      this.rows = await this.loadAccounts(
        this.teamID.toString() || "",
        this.assetsApi
      );
    } catch (err) {
      this.handleError(err);
    }
    this.loading = false;
  }

  async roflpSwitchClick(
    event: { row: AWSAccountViewModel },
    field: "r" | "o" | "l" | "f" | "p" | "s"
  ) {
    try {
      if (!this.assetsApi) {
        throw new Error("no client api found");
      }
      const req: AssetsUpdateRequest = {
        assetId: event.row.id,
        teamId: this.teamID || "",
        payload: {
          rolfp: event.row.rolfp.toString()
        }
      };
      await this.assetsApi.assetsUpdate(req);
      
      // If asset update was correct, update
      // classifiedAt date locally.
      // If 'unclassifieds only' switch is on
      // add row to forceShowRows so it does not
      // disappear from the view.
      if (this.showUnclassifiedsOnly) {
        this.forceShowRows.push(event.row);
      }
      event.row.classifiedAt = new Date();

    } catch (err) {
      // Rollback switch in case of error
      switch (field) {
      case "r":
        event.row.rolfp.r = event.row.rolfp.r == 0 ? 1 : 0;
        break;
      case "o":
        event.row.rolfp.o = event.row.rolfp.o == 0 ? 1 : 0;
        break;
      case "l":
        event.row.rolfp.l = event.row.rolfp.l == 0 ? 1 : 0;
        break;
      case "f":
        event.row.rolfp.f = event.row.rolfp.f == 0 ? 1 : 0;
        break;
      case "p":
        event.row.rolfp.p = event.row.rolfp.p == 0 ? 1 : 0;
        break;
      case "s":
        event.row.rolfp.s = event.row.rolfp.s == 0 ? 1 : 0;
        break;
      }
      this.handleError(err);
    }
  }

  // Private methods.
  private async loadTeam(team: string, api: TeamsApi): Promise<string> {
    const req: TeamsShowRequest = {
      teamId: team
    };
    const teamInfo = await api.teamsShow(req);
    return teamInfo.name || "";
  }

  private async loadAccounts(team: string, api: AssetsApi) {
    const assetsReq: AssetsListRequest = {
      teamId: team
    };
    const assets = await api.assetsList(assetsReq);
    return awsAccountsFromAssets(assets);
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
          this.errorMessage = `unexpected error calling vulcan api, status code: ${
            err.status
          }`;
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

  rolfpValue(val: Number): String {
    return val == 1 ? "Yes" : "No";
  }

  onlyUnclassifieds(): boolean {
	  var qparams = new URL(document.location.toString()).searchParams;
    let onlyUnclassifieds = qparams.get('only_unclassifieds');
	  return onlyUnclassifieds?.toLowerCase() == "true";
  }

  toggleUnclassifieds() {
    // Clear rows that were added to forceShowRows
    // so they did not disappear when classifying 
    // accounts with 'unclassifieds only' switch on
    this.forceShowRows = [];
  }
}

interface AWSAccountViewModel {
  account: string;
  alias: string;
  rolfp: rolfp;
  id: string;
  classifiedAt?: Date;
}

interface rolfp {
  r: number;
  o: number;
  l: number;
  f: number;
  p: number;
  s: number;
  isEmpty(): boolean;
  toString(): string;
}

function awsAccountsFromAssets(assets: Asset[]): AWSAccountViewModel[] {
  const ret: AWSAccountViewModel[] = assets
    .filter(a => {
      a.type = a.type || {};
      return a.type.name == "AWSAccount";
    })
    .map((a: Asset) => {
      const rolfp = new Rolfp(a.rolfp || "");
      const acc: AWSAccountViewModel = {
        account: a.identifier || "",
        id: a.id || "",
        rolfp: rolfp,
        classifiedAt: a.classifiedAt ? new Date(a.classifiedAt) : undefined,
        alias: a.alias || ""
      };
      return acc;
    })
    .sort((a, b) => {
      // If one of them does not has an alias we want it at the end.
      if (a.alias == "") {
        return 1;
      }
      if (b.alias == "") {
        return -1;
      }
      return a.alias.localeCompare(b.alias);
    });

  return ret;
}

class Rolfp {
  r: number = 0;
  rUpdated: boolean = false;
  o: number = 0;
  oUpdated: boolean = false;
  l: number = 0;
  lUpdated: boolean = false;
  f: number = 0;
  fUpdated: boolean = false;
  p: number = 0;
  pUpdated: boolean = false;
  s: number = 0;
  sUpdated: boolean = false;

  private empty: boolean = true;

  isEmpty(): boolean {
    return this.empty;
  }

  toString(): string {
    if (this.isEmpty()) {
      return "";
    }
    const ret = `R:${this.r}/O:${this.o}/L:${this.l}/F:${this.f}/P:${
      this.p
    }+S:${this.s}`;
    return ret;
  }

  constructor(vector: string | null) {
    this.parseVector(vector);
  }

  parseVector(vector: string | null) {
    if (!vector || vector == "") {
      this.empty = true;
      return;
    }
    const parts = vector.split("+");
    if (parts.length != 2) {
      throw Error(`invalid rolfp vector ${vector}`);
    }
    this.s = this.parseField(parts[1]);
    const rest = parts[0].split("/");
    if (rest.length != 5) {
      throw Error(`invalid rolfp vector ${vector}`);
    }
    this.r = this.parseField(rest[0]);
    this.o = this.parseField(rest[1]);
    this.l = this.parseField(rest[2]);
    this.f = this.parseField(rest[3]);
    this.p = this.parseField(rest[4]);
    this.empty = false;
  }

  parseField(field: string): number {
    const parts = field.split(":");
    if (parts.length != 2) {
      throw Error(`invalid rolfp field ${field}`);
    }
    return Number.parseInt(parts[1]);
  }
}
</script>
