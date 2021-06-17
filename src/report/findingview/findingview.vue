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
                        :issueId="issueId"
                        :targetId="this.targetId"
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
  private issueId: string = "";
  private targetId: string = "";
  private findingsApi!: FindingsApi;

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

  async beforeMount() {
      this.teamId = teamID();
      this.issueId = this.$route.query.issueID.toString();
      this.targetId = this.$route.query.targetID.toString();
  }

  async mounted() {
    try {

    } catch (err) {
      this.$emit('handleerror', err);
    } finally {
      this.$emit('toggleUserListTeams', false);
    }
  }

  private handleError(err: any) {
      this.$emit('handleerror', err);
  }

  private async update() {

  }
}

</script>