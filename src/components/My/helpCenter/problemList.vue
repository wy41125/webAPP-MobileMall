<template>  
  <div class="problemList">
    <header>
      <i></i>
      <p>帮助与反馈</p>
    </header>
    <div class="Main">
      <div class="mainTitle">
        <router-link class="problemTitle" v-for="item in mainTitleItems" tag="span" to="/">{{item.name}}</router-link>
      </div>
      <div class="details">
        <router-view></router-view>
      </div>
    </div>
  </div>  
</template>    
  
<script>  
import {MessageBox} from 'mint-ui'
import Cookies from 'js-cookie';
import axios from 'axios'
import util from '@/libs/util' 
export default {  
  name: 'problemList',  
  data() {  
    return {  
      mainTitleItems:[
        {name:'常见问题',problemId:'1'},
        {name:'订单问题',problemId:'2'},
        {name:'售后问题',problemId:'3'},
      ],

    };  
  },
  created(){
    
  },
  beforeRouteUpdate(to,from,next){
    
  },
  methods:{
    
  },
};  
</script>  
  
<style lang="less" scoped>   
	@import '../../../assets/less/problemList.less';
</style> 