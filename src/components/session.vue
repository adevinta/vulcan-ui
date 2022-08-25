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
    // If user has already been redirected and session is still
    // invalid, redirect user to main page. Otherwise redirect
    // user to requested page.
    var redirectTo: string = window.location.toString().split("#")[0];
    if (!this.isDecoded(redirectTo)) redirectTo = decodeURIComponent(redirectTo);

    var query: string = window.location.search;
    if (this.isRedirect(query)) redirectTo = "/?forbidden=true";
    else redirectTo += query.length ? "&redirect=true" : "?redirect=true";

    return `${this.apiUrl}/login?redirect_to=${encodeURIComponent(redirectTo)}`;
  }

  private isRedirect(query: string): boolean {
    query = query.length ? query.substring(1) : query; // Remove leading '?'
    var vars: string[] = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      var kv: string[] = vars[i].split('=');
      if (decodeURIComponent(kv[0]) == "redirect" && decodeURIComponent(kv[1]) == "true") {
        return true;
      }
    }
    return false;
  }

  private isDecoded(uri: string): boolean {
    uri = uri || '';
    return uri === decodeURIComponent(uri);
  }
}
</script>
