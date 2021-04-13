/*
Copyright 2021 Adevinta
*/

import Vue from 'vue';
import report from './report.vue';
import { CreateElement } from 'vue';
import { ConfigProgrammatic, Table, Input, Switch, Button, Icon, Field, Datepicker, Tabs, Select, Collapse, Message, Tag } from 'buefy';
import VueShowdown from 'vue-showdown';
import { VueShowdownPlugin, showdown } from 'vue-showdown';
import DOMPurify from 'dompurify';

// import 'buefy/dist/buefy.css';
// Import styles
import '../../node_modules/bulma/css/bulma.css';
import '../../node_modules/font-awesome/css/font-awesome.css';
import '../styles/style.scss';
import '../style.css';
import router from "./router"
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
	  simpleLineBreaks: false,
	  literalMidWordUnderscores: true,
	},
  });

VueShowdown.showdown.extension('htmlSanitize', () => [
  {
    type: 'output',
    filter: function (text, converter, options) {
      return DOMPurify.sanitize(text);
    }
  },
]);

// Prevent strings such as "> 2 years" from being interpreted as a quotation block.
VueShowdown.showdown.extension('noBlockquote', () => [
  {
    type: 'lang',
    regex: /(?<!<.*)>/g,
    replace: '&gt;'
  },
]);

Vue.config.productionTip = false;
const app = new Vue({
    router,
	el: '#main',
	render: (h: CreateElement) => h(report)
});
