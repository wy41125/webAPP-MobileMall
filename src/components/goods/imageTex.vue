<template>  
  <div class="imageTex" >
    <div v-html="htmlStr"></div>
  </div>  
</template>  
  
<script> 
import VDistpicker from 'v-distpicker'
import {Toast,MessageBox} from 'mint-ui'
import Cookies from 'js-cookie'; 
import util from '@/libs/util' 
import axios from 'axios'
export default {  
  name: 'imageTex',  
  data() {  
    return {  
      htmlStr:''
    };  
  },
  components:{
      
  },
  methods:{
    
  },
  props:{
    dataObj:String
  },
  created:function(){

  },
  mounted(){
    
  },
  watch:{
    dataObj(){
      // this.dataObj = '<p><img src="http://static.cdn.dripop.com/20180419/788cc08ba3330f1a9556d4b706c9ed2b.jpg"></p><p><img src="http://static.cdn.dripop.com/20180419/788cc08ba3330f1a9556d4b706c9ed2b.jpg"></p>';
      this.htmlStr = this.dataObj.replace(/<img/g, '<img style="width:100%;display:inherit;vertical-align: middle;"');
    }
  }
};  
</script>  
  
<style lang="less" scoped>   
  .imageTex{
    img{
      width: 100%;
      display: block;
    }
  }
</style> 