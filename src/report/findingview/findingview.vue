<template>
    <div>
        <div class="container">
            <div class="card">
                <router-link :to="{ name: 'home'}">
                    <b-button size="is-small" type="is-info is-light" rounded outlined>
                        <i class="fa fa-arrow-left"></i>
                        Back to Report
                    </b-button>
                </router-link>
                <div class="card-content">
                    <FindingDetails
                        v-on:handleerror="handleError"
                        v-on:update="update"
                        :teamId="teamId"
                        :teamOnBoardedVT="teamOnBoardedVT"
                        :findingId="propsFindingDetail.row.id"
                        :propsFindingDetail="propsFindingDetail">
                    </FindingDetails>
                </div>
            </div>
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
import { propsFindingDetailTemplate } from "../utils/utils";
import {
    Configuration as ApiConf,
    ConfigurationParameters, TeamsApi,
} from "../../services/vulcan-api";
import {
   FindingsApi,
   FindingsFindFindingRequest,
   TeamsShowRequest,
} from "../../services/vulcan-api/apis";
import {
  Finding,
} from "../../services/vulcan-api/models"

@Component({
  name: "FindingView",
  components: {
    Loading,
    ErrorDialog,
    Session,
    FindingDetails,
  }
})

export default class FindingView extends Vue {
  private apiUrl: string = "";
  private teamId: string = "";
  private teamOnBoardedVT: boolean = false;
  private findingId: string = "";
  private findingsApi!: FindingsApi;
  private teamsApi?: TeamsApi

  private propsFindingDetail: propsFindingDetailTemplate = {
      row: {
        issue: {
            description: "loading...",
            recommendations: new Array(),
            referenceLinks: new Array(),
        },
        target: {
            identifier: "loading..."
        },
        status: "loading...",
        source: {},
        score: 0,
        resources: new Array(),
      },
  }

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
      this.teamsApi = new TeamsApi(apiConfg);
      this.findingsApi = new FindingsApi(apiConfg);

      // Load team.
      this.teamId = teamID();

      await this.loadTeam(
            this.teamId,
            this.teamsApi
      );

      this.findingId = this.$route.params.id;

      await this.loadFinding(
        this.teamId,
        this.findingId,
        this.findingsApi
      );
    } catch (err) {
      this.$emit('handleerror', err);
    } finally {
      this.$emit('toggleUserListTeams', false);
    }
  }

  private async loadFinding(teamId: string, findingId: string, api: FindingsApi){
    const req: FindingsFindFindingRequest = {
      teamId: teamId,
      findingId: findingId
    };

    const finding: Finding = await api.findingsFindFinding(req);
    this.propsFindingDetail.row = finding
  }

  private async loadTeam(teamId: string, api: TeamsApi) {
    const req: TeamsShowRequest = {
        teamId: teamId
    };

    const teamInfo = await api.teamsShow(req);

    this.teamOnBoardedVT = teamInfo.usingTracker || false
  }


    private handleError(err: any) {
      this.$emit('handleerror', err);
  }

  private async update() {
      await this.loadFinding(
        this.teamId,
        this.findingId,
        this.findingsApi
      );
  }
}

</script>
