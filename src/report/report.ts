/*
Copyright 2021 Adevinta
*/

import Vue from 'vue';
import report from './report.vue';
import { CreateElement } from 'vue';

import { ConfigProgrammatic, Table, Input, Switch, Button, Icon, Field, Datepicker, Tabs, Select, Collapse, Message, Tag } from 'buefy';
import VueShowdown from 'vue-showdown';


// import 'buefy/dist/buefy.css';
// Import styles
import '../../node_modules/bulma/css/bulma.css';
import '../../node_modules/font-awesome/css/font-awesome.css';
import '../styles/style.scss';
import '../style.css';
const cfg = {
	defaultIconPack: 'fa'
};
ConfigProgrammatic.setOptions(cfg);

Vue.use(Table);
Vue.use(Input);
Vue.use(Switch);
Vue.use(Button);
Vue.use(Icon);
Vue.use(Field);
Vue.use(Datepicker);
Vue.use(Tabs);
Vue.use(Select);
Vue.use(Collapse);
Vue.use(Message);
Vue.use(Tag);
Vue.use(VueShowdown, {
	options: {
	  emoji: true
	}
  });

Vue.config.productionTip = false;
const app = new Vue({
	el: '#main',
	render: (h: CreateElement) => h(report)
});
