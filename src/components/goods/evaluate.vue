<template>  
  <div class="evaluate">
    <!-- 有数据显示 --> 
    <div class="haveData" >
      <!-- 顶部评论、按钮 -->
      <div class="titleEvaluate" :style="$store.state.jumpAppTime?'top:.9rem;':''">
          <p class="evaluationTitle"><span>评价（{{totalNum}}）</span><span>好评度<i>{{rateInt}}</i></span></p>
          <div>
              <span :class="!level?'onClick':''" @click.stop="switchType(0)">全部{{totalNum}}</span>
              <span :class="level==1?'onClick':''" @click.stop="switchType(1)">好评{{total1}}</span>
              <span :class="level==2?'onClick':''" @click.stop="switchType(2)">中评{{total2}}</span>
              <span :class="level==3?'onClick':''" @click.stop="switchType(3)">差评{{total3}}</span>
          </div>
      </div>
      <!-- 用户评论详情 --> 
      <div class="evaluate_div" v-if="haveData" @touchstart="funckaishi($event)" @touchmove="functionHeight($event)" style="overflow:auto;">
        <!-- 数据展示区域 -->
        <!-- <div style="height:100%" v-infinite-scroll="loadMore"
                  infinite-scroll-disabled="loading"
                  infinite-scroll-distance="0" > -->
          <div class="customerEvaluation" v-for="(evaluate,index) in evaluates" :style="index==evaluates.length-1?'border-bottom: 0px solid #ececec;':''">
              <div class="evaluation">
                 <div class="pelpo">
                    <img :src="evaluate.custHeadUrl" alt="">
                    <p>{{evaluate.custName}} <br><i v-for="i in evaluate.goodsStarLevel" class="active"></i><i v-for="i in (5-evaluate.goodsStarLevel)"></i></p>
                 </div>
                 <div class="pelpoEvaluation"> 
                    <p>{{evaluate.content}}</p>
                    <div class="EvaluationImg">
                        <img v-if="evaluate.pictureAdd.length>0" v-for="imgStr in evaluate.pictureAdd" :src="imgStr" @click.stop="bigImg(imgStr)">
                    </div>  
                    <p>购买时间：{{evaluate.purchaseTime}}</p>
                    <p>购买规格：{{evaluate.goodSpecs}}</p>
                 </div>
              </div>
          </div>
        <!-- </div> -->
        <!-- <ul
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10">
          <li v-for="item in list">{{ item }}</li>
        </ul> -->
        <!-- 上啦加载gif -->
        <div class="loadImg" v-show="isLoading">
          <img :src="loadingImg" alt="">
        </div>
      </div>
      <!-- 无数据显示 -->
      <div class="nohaveData" v-if="!haveData">
        <img src="../../assets/images/evaluation_empty@2x.png" alt="">
        没有相应评价 
      </div>
    </div>
    
    <toTop v-if="isshowToTop"></toTop>
  </div>  
</template>   
  
<script>  
import toTop from './toTop.vue'
import {MessageBox} from 'mint-ui'
import util from '@/libs/util' 
import axios from 'axios'
export default {  
  name: 'evaluate',  
  data() {  
    return {
      loading:false,
      level:0,//评论type
      pageNo:0,//页数
      modelId:null,//评论ID
      evaluates:[],//评论数据对象
      totalNum:0,//评论数量
      rateInt:"100%",//好评率
      total1:0,//好评数
      total2:0,//中评数
      total3:0,//差评数
      haveData:false,//默认没有数据显示
      loadingImg:null,//gifSrc
      isLoading:false,//gif展示
      isshowToTop:false,
      nowData:0,//显示数据数量
      list:[],
      yuansukaishi:0,
      yuansujieshu:0,
      ifNext:false,
    };  
  },
  props:{
    modelIdNum:Object,
  },
  components:{
    toTop:toTop,
  },
  methods:{
    bigImg(srcStr){//查看评论图片
      util.viewPicture(srcStr);
    },
    funckaishi(e){
     this.yuansukaishi = window.scrollY;
    },
    functionHeight(e){
      var obj = document.getElementsByClassName("customerEvaluation")[0];
      this.yuansujieshu = window.scrollY;
      if(this.yuansujieshu>400 && this.ifNext){
        this.pageNo+=1;
        this.ajaxEvaluate();
      }
    },
    loadMore() {
      this.isLoading = true;
      this.loading = true;
      // if(this.isLoading){
        setTimeout(() => {
          this.pageNo+=1;
          this.ajaxEvaluate();
          this.loading = false;
        }, 1500);
      // }
      
    },
    switchType(type){
      this.level =type;
      this.pageNo =1;
      this.evaluates=[];
      this.ajaxEvaluate();
    },
    ajaxEvaluate(){//请求评论数据
      let that =this;
      let data = {
        "modelId":that.modelId,//that.modelId, 
        "level":that.level,   //  1：好评  2：中评 3： 差评  不传值：全部评论
        "pageNo":that.pageNo
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/goods/open/allGoodsReview"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          that.isLoading=false;
          if(response.data.body.pagination.items.length == 0 && that.pageNo==1){//第一次请求就没有数据
            that.haveData = false;
            that.ifNext =false;
          }else if(response.data.body.pagination.items.length == 0 && that.pageNo!=1){//非第一次请求没有数据
            that.isloading = false;
            that.isShowB = true;//显示底线
            that.ifNext =false;
          }else{
            for(let i = 0; i<response.data.body.pagination.items.length ;i++){
              that.evaluates.push(response.data.body.pagination.items[i]);
            }
            that.nowData += response.data.body.pagination.items.length;//当前为止请求的数据量
            if(that.nowData == response.data.body.pagination.total){
              that.isloading = false;
              that.ifNext =false;
              that.isShowB = true;//显示底线
            }else{
              that.isloading = true;
              that.ifNext =true;
              that.isShowB = false;//不显示底线
            }
            that.haveData = true;
            for(let i in that.evaluates){
              if(that.evaluates[i].pictureAddr && that.evaluates[i].pictureAddr!=''){
                let pictureAdd = that.evaluates[i].pictureAddr.split(',');
                that.evaluates[i]['pictureAdd'] = pictureAdd;
              }
            }
          }

          that.totalNum = response.data.body.allNumText;//全部评论
          that.rateInt=response.data.body.hpLvText;//好评率
          that.total1=response.data.body.hpNum;//好评
          that.total2=response.data.body.zpNum;//中评
          that.total3=response.data.body.cpNum;//差评
        }else{
          MessageBox('系统提示',response.data.message);
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
  },
  created(){
    this.loadingImg = util.loadImg;
    window.addEventListener('scroll',()=>{
      if(window.scrollY>0){
        this.isshowToTop = true;
      }else{
        this.isshowToTop = false;
      }
    })
  },
  mounted(){
    var obj = document.getElementsByClassName("customerEvaluation");
  },
  watch:{
    modelIdNum(){
      this.pageNo = 1;
      this.modelId = this.modelIdNum.modelId;
      this.ajaxEvaluate();
    }
  } 
};  
</script>  
  
<style lang="less" scoped>   
     @import '../../assets/less/evaluate.less';
</style> 