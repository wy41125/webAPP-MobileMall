<template>  
  <div class="goodsDevele">
      <div class="openApp" v-show="$store.state.jumpAppTime">
        <i class="Close" @click.stop="closeJump"></i>
        <b class="appIcon"></b>
        <p class="appName">
          <span class="name">晶杰之家APP</span>
          <!-- <span class="lib">立即领取APP新人专享499元礼包</span> -->
        </p>
        <span class="button" @click.stop="openAppFunc">立即打开</span>
      </div>
      <header class="mint-header is-fixed navbarHeader goodsHeader" :style="$store.state.jumpAppTime?'height:45px;top:.5rem;':'height:45px;'">
          <div class="mint-header-button is-left" @click.stop="$router.go(-1)">
          </div>
          <h1 class="mint-header-title">
              <mt-navbar v-model="titleSelected">
                <mt-tab-item class="navbarLink" id="goods">商品</mt-tab-item>
                <mt-tab-item class="navbarLink" id="detailsObj">详情</mt-tab-item>
                <mt-tab-item class="navbarLink" id="evaluate">评价</mt-tab-item>
              </mt-navbar> 
          </h1>
          <div class="mint-header-button is-right">
              <!-- <button class="mint-button mint-button--default mint-button--normal">
                  <label class="mint-button-text goods_home"></label>
              </button>
              <button class="mint-button mint-button--default mint-button--normal">
                  <label class="mint-button-text goods_Share"></label>
              </button> -->
          </div>
      </header>
      
      <div class="dateConent" :style="$store.state.jumpAppTime?'margin-top:.95rem;':''"> 
          <mt-tab-container v-model="titleSelected">
            <mt-tab-container-item id="goods">
              <goods v-if="goodsObject.isUsed != 0" :goodsObj="goodsObject" @upup="change" :msg="msg"></goods>
              <div v-if="goodsObject.isUsed == 0" :style="'width:100%;height:'+pageHeight+'px;background:#fff;'">
                <div class="nohavedata">
                  <img src="../../assets/images/goods_empty@2x.png" alt="">
                  该商品已下架
                </div>
              </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="detailsObj">
              <detailsObj v-if="goodsObject.isUsed != 0" :goodsObj="goodsObject"></detailsObj>
              <div v-if="goodsObject.isUsed == 0" :style="'width:100%;height:'+pageHeight+'px;background:#fff;'">
                <div  class="nohavedata">
                  <img src="../../assets/images/goods_empty@2x.png" alt="">
                  该商品已下架
                </div>
              </div>
                
            </mt-tab-container-item>
            <mt-tab-container-item id="evaluate">
              <evaluate :modelIdNum="goodsObject"></evaluate>
            </mt-tab-container-item>
          </mt-tab-container>
      </div>
      <!-- <div id="container" style="width:100%;height:100px"></div> -->
      <navigation></navigation>
      <goodsFooter v-if="goodsObject.isUsed != 0" :dataNum="goodNum" :iscolled="iscoll" :goodsObj="goodsObject" @upup="change" :msg="msg"></goodsFooter>
  </div>  
</template>  
  
<script>  
import {Toast,MessageBox} from 'mint-ui'
import axios from 'axios'
import util from '@/libs/util' 
import Goods from './goods.vue'
import DetailsObj from './detailsObj.vue'
import Eealuate from './evaluate.vue'
import goodsFooter from './goods_footer.vue'
import navigation from './navigation.vue'
export default {  
  name: 'goodsDevele',  
  data() {  
    return {  
        Goodsed:null,
        titleSelected:null,
        onlineId:null,//商品上架ID
        navigation:false,
        goodNum:null,
        iscoll:0,//是否收藏
        goodsObject:{},//商品详情信息
        modelId:null,//全部评论modelID
        msg:null,
        pageHeight:null,
    };  
  },
  props:{
    
  },
  components:{
      goods:Goods,
      detailsObj:DetailsObj,
      evaluate:Eealuate,
      goodsFooter:goodsFooter,
      navigation:navigation
  },
  created(){
    this.funcTime();
    util.toTop();
    this.$store.commit('changeTanchaungType','');
    this.onlineId = this.$route.query.onlineId;
    if(window.sessionStorage.getItem('good_page') && window.sessionStorage.getItem('good_page')!=''){
      this.titleSelected = window.sessionStorage.getItem('good_page');
      window.sessionStorage.setItem('good_page','');
    }else{
      this.titleSelected = 'goods';
    }
    this.ajaxGood();
    this.pageHeight = document.body.clientHeight;
    let body = document.body;
    body.style="height:100%;";
    window.sessionStorage.removeItem('cardStr');
  },
  methods:{
    funcTime(){
      let myDate = new Date();
      let year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
      let month = (Number(myDate.getMonth())+1)<10?'0'+(Number(myDate.getMonth())+1):(Number(myDate.getMonth())+1); //获取当前月份(0-11,0代表1月)
      let date = myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate(); //获取当前日(1-31)
      let local_jumpAppTime = year+month+date;
      if(Number(localStorage.getItem("jumpAppTime"))>=Number(local_jumpAppTime)){
        this.$store.commit('addjumpAppTimeFunc');
      }
    },
    change(msg) {
      this.onlineId=msg;
      this.ajaxGood();
      // this.$router.push({name:'goodsDevele',params:{onlineId:msg}});
    },
    ajaxGood(){//商品详情请求
      let that =this;
      let data = {
        onlineId:that.onlineId
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/goods/open/goodsdetail"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          that.goodNum= response.data.body.stock;
          if(response.data.body.collectId && response.data.body.collectId!=''){
            that.iscoll=1;//已收藏
          }else{
            that.iscoll=0;
          }
          that.goodsObject = response.data.body;
          that.modelId = response.data.body.modelId;
          if(that.goodsObject.goodsReviewDto && that.goodsObject.goodsReviewDto.custReviewDtos){
            for(let i in that.goodsObject.goodsReviewDto.custReviewDtos){
              if(that.goodsObject.goodsReviewDto.custReviewDtos[i].pictureAddr){//有值
                let str = that.goodsObject.goodsReviewDto.custReviewDtos[i].pictureAddr;
                let arr = str.split(',');
                that.goodsObject.goodsReviewDto.custReviewDtos[i]['pictureImgAddr']=arr;
              }
            }
          }
          that.$store.commit('preservationGoodId',that.goodsObject.onlineId);
          that.readShopNum();
          if(that.goodsObject.isUsed != 0){
            util.setTitle(that.goodsObject.goodsName);
          }else{
            util.setTitle("商品详情页");
          }
        }else{
          MessageBox('系统提示',response.data.message);
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
    readShopNum(){
      if(localStorage.getItem("shoppingCard")){
        let num = localStorage.getItem("shoppingCard").split(',').length;//shopArr=['id:12222&num:12','id:12222&num:12'];
        this.$store.commit('addShpCardNum',num);
      }
    },
  },
  beforeRouteUpdate(to,from,next){
    
  },
  destoryed(){
    
  },
  beforeDestory(){
    
  }
};  
</script>  
  
<style lang="less" scoped>   
  @import '../../assets/less/goodsDevele.less';
  .nohavedata{
    width: 100%;
    position: fixed;
    top: 35%;
    left: 0;
    font-size: .13rem;
    color: #989898;
    text-align: center;
    img{
      display: block;
      margin: 0 auto;
      width: .92rem;
      height: .82rem;
      margin-bottom: .15rem;
    }    
  }
  .openApp{
    font-size: .14rem;
    width: 100%;
    height: .5rem;
    background: #ddd;
    position: fixed;
    top: 0;
    left: 0;
    text-align: left;
    z-index: 1000;
    .Close{
      display: inline-block;
      width: .15rem;
      height: .15rem;
      background: url('../../assets/images/land/login_close@2x.png') no-repeat;
      background-size: .15rem;
      position: absolute;
      top: 35%;
      left: .1rem;
    }
    .appIcon{
      display: inline-block;
      width: .23rem;
      height: .23rem;
      background: url(../../assets/images/main_icon.png) no-repeat;
      background-size: .23rem;
      position: absolute;
      top: 25%;
      left: .3rem;
    }
    .appName{
      color: #fff;
      display: inline-block;
      text-align: left;
      margin-left: .65rem;
      margin-top: .05rem;
      line-height: .4rem;
      .name{
        display: block;
      }
      .lib{
        font-size: .12rem;
      }
    }
    .button{
      display: inline-block;
      width: .7rem;
      height: .5rem;
      line-height: .5rem;
      background-color: #E12E2E;
      color: #fff;
      position: absolute;
      top: 0;
      right: 0;
      text-align: center;
    }
  }
</style> 







