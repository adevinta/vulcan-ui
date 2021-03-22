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
                    <FindingDetails :propsFindingDetail="propsFindingDetail"></FindingDetails>    
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
   ConfigurationParameters,
} from "../../services/vulcan-api";
import {
   FindingsApi,
   FindingsFindFindingRequest,
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
  private findingId: string = "";
  private findingsApi?: FindingsApi;

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
      this.findingsApi = new FindingsApi(apiConfg);

      // Load team.
      this.teamId = teamID();
      this.findingId = this.$route.params.id;

      await this.loadFinding(
        this.teamId,
        this.findingId,
        this.findingsApi
      );
    } catch (err) {
      this.$emit('handleerror', err);
    } finally {
      this.loading = false;
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
}

</script>