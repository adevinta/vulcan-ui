<!--
Copyright 2021 Adevinta
-->

<template>
  <div class="columns is-mobile is-multiline">
    <div id="body" class="container">
      <div class="columns is-variable is-8 is-multiline is-desktop">
        <div class="column is-one-half">
          <div class="columns is-variable is-8 is-one-half">
            <div class="column is-one-half">
              <div class="dropdown is-hoverable">
                <div class="dropdown-trigger">
                  <a href="#" class="manageMembersLink">
                    <div class="box has-text-centered">
                      <i class="fa fa-5x fa-users"></i>
                      <div class="content" style="margin-top: 20px">
                        <h3>Global Programs</h3>
                        <p>List and manage the global programs</p>
                      </div>
                    </div>
                  </a>
                </div>
                <div class="dropdown-menu" id="dropdown-menu3" role="menu">
                  <div class="dropdown-content">
                    <a href="#" class="dropdown-item manageMembersLink">
                      <span class="icon">
                        <i class="fa fa-edit"></i>
                      </span>
                      <router-link :to="{ name: 'programs' }">
                        <a>
                          <span>Global programs</span>
                        </a>
                      </router-link>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import VueRouter, { RouteConfig } from "vue-router";
import Vue from "vue";
export default class Home extends Vue {}
</script>
