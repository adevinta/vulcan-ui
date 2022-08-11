<!--
Copyright 2021 Adevinta
-->

<template>
  <div>
    <div :style="contentStyle()">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  name: "Session"
})
export default class Session extends Vue {
  // Vue properties.
  @Prop({ required: true, default: false })
  show!: boolean;

  @Prop({ required: true, default: "" })
  apiUrl!: string;

  private contentStyle(): any {
    const display = !this.show ? "" : "none";
    const s: any = { display: display };
    return s;
  }

  @Watch('show')
  async onShowChange(value: boolean, oldValue: boolean) {
    try {
      if (value == true) {
        window.location.href = this.addr();
      }
    } catch (err) {
      this.$emit('handleerror', err);
    }
  }

  private addr(): string {
    var redirectTo: string = window.location.toString();
    if (this.isDecoded(redirectTo)) {
      redirectTo = encodeURIComponent(window.location.toString());
    }
    return `${this.apiUrl}/login?redirect_to=${redirectTo}`;
  }

  private isDecoded(uri: string): boolean {
    uri = uri || '';
    return uri === decodeURIComponent(uri);
  }
}
</script>
