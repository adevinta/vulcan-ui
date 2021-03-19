/*
Copyright 2021 Adevinta
*/

import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/",
        name: "home",
        component: () => import("../home.vue")
    },
    {
        path: "/programs",
        name: "programs",
        component: () => import("../programs/programs.vue")
    }
];

const router = new VueRouter({
    mode: "hash",
    base: process.env.BASE_URL,
    routes
});

export default router;
