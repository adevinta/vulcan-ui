<!--
Copyright 2021 Adevinta
-->

<template>
  <div class="modal" v-bind:class="{ 'is-active': isActive() }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <div class="modal-card-title">
          <p>{{ title }}</p>
        </div>
      </header>
      <section class="modal-card-body">
        <div id="results" class="content">
          <slot>{{ content }}</slot>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="onCloseClick()">Accept</button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
// Import modules
import { Component, Prop, Vue, Emit } from "vue-property-decorator";

@Component({
  name: "Report"
})
export default class Report extends Vue {
  // Vue properties.
  @Prop({ required: true, default: false })
  show!: boolean;

  @Prop({ required: true, default: "" })
  title!: string;

  @Prop({ required: true, default: "" })
  content!: string;

  // Emit events.
  @Emit("report-closed")
  reportClosed() {}

  // Fields.
  closed: boolean = false;

  // Events.
  onCloseClick() {
    this.closed = true;
    this.reportClosed();
  }

  // Private methods.
  isActive(): boolean {
    return this.show && !this.closed;
  }
}
</script>
