<!--
Copyright 2021 Adevinta
-->

<template>
  <article class="message is-danger" :style="errorStyle()">
    <div class="message-header">
      <p>Error</p>
      <button class="delete" aria-label="delete" @click="onCloseClick()"></button>
    </div>
    <div class="has-text-centered message-body">{{ message }}</div>
  </article>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "ErrorDialog"
})
export default class ErrorDialog extends Vue {
  // Vue properties.
  @Prop({ required: true, default: false })
  show!: boolean;

  @Prop({ required: true, default: "" })
  message: string = "";

  // Fields.
  closed: boolean = false;

  // Events.
  onCloseClick() {
    this.closed = true;
  }

  // Private methods.
  isVisible(): boolean {
    return this.show && !this.closed;
  }

  errorStyle(): any {
    const display = this.isVisible() ? "" : "none";
    const s: any = { display: display };
    return s;
  }
}
</script>
