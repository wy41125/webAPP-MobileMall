<template>  
  <div class="problemDetails">
    
  </div>  
</template>    
  
<script>  
import {MessageBox} from 'mint-ui'
import Cookies from 'js-cookie';
import axios from 'axios'
import util from '@/libs/util' 
export default {  
  name: 'problemDetails',  
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
	@import '../../../assets/less/problemDetails.less';
</style> 