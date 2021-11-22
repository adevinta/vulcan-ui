<!--
Copyright 2021 Adevinta
-->

<template>
    <div>
        <div class="container">
            <div class="tile">
                <div class="tile is-2 is-vertical"></div>
                <div class="tile is-vertical">
                    <template>
                        <section>
                            <b-field label="Name">
                                <b-input ></b-input>
                            </b-field>
                            <b-field label="Description">
                                <b-input ></b-input>
                            </b-field>
                            <b-field label="Tag">
                                <b-input ></b-input>
                            </b-field>
                            <div class="buttons is-right">
                                <b-button >Cancel</b-button>
                                <b-button type="is-primary">Save</b-button>
                            </div>
                        </section>
                    </template>
                </div>
                <div class="tile is-2 is-vertical"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  name: "Home",
  components: {},
})
export default class Home extends Vue {
}
</script>
