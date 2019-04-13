// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css' 
import axios from 'axios'
import util from '@/libs/util' 
import routerPage from './router/index.js';
import VueAreaLinkage from 'vue-area-linkage'
import VDistpicker from 'v-distpicker'
import VueBarcode from '@xkeshi/vue-barcode'
import { Tabbar, TabItem, TabContainer, TabContainerItem, Cell, Button, Header, Navbar, Swipe, SwipeItem, Lazyload, Popup, InfiniteScroll,Loadmore} from 'mint-ui';
import store from './store'//vuex
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


axios.defaults.timeout = 5000;//请求相应时间
// axios.defaults.baseURL = 'service';  //配置接口地址(生成)
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';      //配置请求头
// axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';      //配置请求头
// axios.defaults.headers.post['Access-Control-Allow-Headers'] = 'x-requested-with,content-type';      //配置请求头


Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.component(Tabbar.name, Tabbar);
Vue.component(TabItem.name, TabItem);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Cell.name, Cell);
Vue.component(Button.name, Button);
Vue.component(Header.name, Header);
Vue.component(Navbar.name, Navbar);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Popup.name, Popup);
Vue.component(Loadmore.name, Loadmore);
Vue.component('v-distpicker', VDistpicker); 
Vue.component('barcode', VueBarcode);
Vue.use(InfiniteScroll);
Vue.use(VueAreaLinkage);
Vue.use(Lazyload); 
Vue.use(Lazyload,{
	preLoad: 1.3,
  	error: util.loadImg,
  	loading: util.loadImg,
  	attempt: 1
});



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router:routerPage,
  store,//使用store
  components: { App },
  template: '<App/>'
})















