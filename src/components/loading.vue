<!--
Copyright 2021 Adevinta
-->

<template>
  <div>
    <div :style="contentStyle()">
      <slot></slot>
    </div>
    <div id="loading" class="container" :style="loadingStyle()">
      <section class="hero">
        <div class="hero-body is-paddingless">
          <div class="columns is-mobile is-multiline">
            <div class="column has-text-centered" style="min-width:300px">
              <img src="../images/vulcan-logo.png" style="width:200px; margin:40px" />
              <br />
              <h2 class="subtitle" style="margin-top:-18px">Loading data ...</h2>
              <img src="../images/spinner.gif" />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script lang="ts">
// Import modules
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "Loading"
})
export default class Loading extends Vue {
  // Vue properties.
  @Prop({ required: true, default: false })
  show!: boolean;

  // Private methods.
  loadingStyle(): any {
    const display = this.show ? "" : "none";
    const s: any = { display: display };
    return s;
  }

  contentStyle(): any {
    const display = !this.show ? "" : "none";
    const s: any = { display: display };
    return s;
  }
}
</script>
