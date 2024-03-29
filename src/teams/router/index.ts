import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/",
        name: "home",
        component: () => import("../home/home.vue")
    },
];

const router = new VueRouter({
    mode: "hash",
    routes
});

export default router;
