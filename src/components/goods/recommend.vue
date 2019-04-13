<template>  
  <div class="package">  
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'热门配件'"></headers>
    <!-- 数据 -->
    <div class="packages" :style="$store.state.titleShow?'margin-top:.45rem':'margin-top:0;'">
      <div class="package packageshow" v-for="item in items">
        <p class="packageName"><i>{{item.typeName}}</i></p>
        <div class="packageGoods">
          <div class="packageGood" v-if="item.goodsItems.length>0" v-for="(good,index) in item.goodsItems" @click.stop="jumpGood(good.onlineId)" :style="index==item.goodsItems.length-1?'border:0px solid #ddd;':''">
            <div class="packageGood_img">
              <img :src="good.imgUrl">
              <!-- <p class="mask" v-if="item.stock ==0">无货</p> -->
            </div>
            <div class="packageGood_data" style="width:75%;">
              <p>{{good.showName}}</p>
              <!-- <p>已选：{{good.specs}}</p> -->
              <p style="color:#E12E2E;">¥{{(good.salePrice/100).toFixed(2)}}</p>
              <p style="color:#989898;"><span>{{good.reviewNum}}人评价</span> <span>{{good.praiseRate}}%好评</span></p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    <navigation></navigation> 
  </div>   
</template>   
  
<script>  
import navigation from './navigation.vue'  
import VDistpicker from 'v-distpicker'
import {Toast,MessageBox} from 'mint-ui'
import Cookies from 'js-cookie';
import util from '@/libs/util' 
import axios from 'axios'
import headers from '../headers.vue' 
export default {  
  name: 'package',  
  data() {  
    return {  
      items:[],
      num1:null,
    };  
  },
  props:{
    
  },
  created(){
    util.setTitle('热门配件');
    let str = window.sessionStorage.getItem('good_Recommend');
    let arr = str.split('&&');
    for(let i in arr){
      let obj = JSON.parse(arr[i]);
      this.items.push(obj);
    }
  },
  mounted(){
    
  },
  components:{
    headers:headers,
    navigation:navigation,
  },
  methods:{
    jumpGood(id){//跳转商品详情事件
      this.$router.push({name:'goodsDevele',query:{onlineId:id}});
    }
  }, 
};  
</script>  
  
<style lang="less" scoped>   
  @import '../../assets/less/good_recommend.less';
</style> 