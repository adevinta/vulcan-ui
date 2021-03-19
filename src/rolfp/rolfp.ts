/*
Copyright 2021 Adevinta
*/

import Vue from 'vue';
import rolfp from './rolfp.vue';
import { CreateElement } from 'vue';

import { ConfigProgrammatic, Tooltip, Table, Input, Switch, Button, Select, Field } from 'buefy';

// import 'buefy/dist/buefy.css';
// Import styles
import '../../node_modules/bulma/css/bulma.css';
import '../../node_modules/font-awesome/css/font-awesome.css';
import '../styles/style.scss';
const cfg = {
	defaultIconPack: 'fa'
};
ConfigProgrammatic.setOptions(cfg);

Vue.use(Table);
Vue.use(Input);
Vue.use(Switch);
Vue.use(Button);
Vue.use(Select);
Vue.use(Field);
Vue.use(Tooltip);
Vue.config.productionTip = false;
const app = new Vue({
	el: '#main',
	render: (h: CreateElement) => h(rolfp)
});
