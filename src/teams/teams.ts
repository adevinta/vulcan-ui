import Vue from 'vue';
import teams from './teams.vue';
import { CreateElement } from 'vue';

//@ts-ignore
import { Input, Button, Icon, Field, Select, Collapse, Message, Tag, Modal, Dialog } from 'buefy';

import VueShowdown from 'vue-showdown';

// import 'buefy/dist/buefy.css';
// Import styles
import '../../node_modules/bulma/css/bulma.css';
import '../../node_modules/font-awesome/css/font-awesome.css';
import '@mdi/font/css/materialdesignicons.css'
import '../styles/style.scss';
import '../style.css';
import router from "./router"

Vue.use(Input);
Vue.use(Button);
Vue.use(Icon);
Vue.use(Field);
Vue.use(Select);
Vue.use(Collapse);
Vue.use(Message);
Vue.use(Tag);
Vue.use(Modal);
Vue.use(Dialog);

Vue.config.productionTip = false;
const app = new Vue({
    router,
	el: '#main',
	render: (h: CreateElement) => h(teams)
});
