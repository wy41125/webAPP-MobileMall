<template>  
  <div class="goodsList" :style="!haveData?'background:#fff;'+pageheight:''">  
      <header>
        <i @click.stop="$router.go(-1)" style="margin-right:.08rem;"></i>
        <p class="input_p">
          <b></b>
          <input v-model="keyword" class="mint-header-input" type="text" style="font-size:0.13rem;" placeholder="请输入商品名称查找" @click.stop="$router.push({ name: 'customInput', params: { id: 'new' }})">
        </p>
        <span @click.stop="custom" :class="clickStyle?'bigImg':''"></span>
      </header>

      <div v-if="haveData">
        <div class="navbar_div"> 
          <p class="navbar">
            <span :class="!sortBy?'active':''" @click.stop="changeNavbar(0)">综合</span>
            <span :class="sortBy == 1?'active price':'price'" @click.stop="changeNavbar(1)">价格<i :class="(sortBy == 1 &&!sortType)?'active upper':'upper'"></i><i class="lower" :class="(sortBy == 1 &&sortType)?'active lower':'lower'"></i></span>
            <span :class="sortBy == 2?'active':''" @click.stop="changeNavbar(2)">新品</span>
            <span :class="sortBy == 3?'active':''" @click.stop="changeNavbar(3)">人气</span>
          </p>
        </div>
        <div :class="clickStyle?'goods_div bigImg':'goods_div'"> 
            
            <div class="goods" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
              <div class="singleGood" v-for="date in dates"  @click.stop="$router.push({path:'/goodsDevele/',query:{onlineId:date.onlineId}})">
                <div class="goodImg">
                  <img :src="date.imgUrl" alt="">
                  <p class="position" v-if="date.cardType == 1 && date.goodsSellType ==1"><span>领券减</span><i>{{date.lable}}</i></p>
                  <p class="position" v-if="date.cardType ==2 && date.goodsSellType ==1"><span>领券享</span><i>{{date.lable}}折</i></p>
                  <span v-if="date.displayType && date.displayType!=''" :class="date.displayType==1?'preSaleIcon':'preSaleIcon over'">{{date.display}}</span>
                </div>
                <div class="gooddata">
                  <p class="goodTitle">{{date.goodsName}}</p>
                  <div class="pingjia">
                    <span class="highlight" style="font-wi">{{date.salePriceText}}</span>
                    <p class="auxiliary">
                      <span>{{date.reviewNum}}人评价</span><span>{{date.praiseRate}}%好评</span>
                    </p>
                  </div>
                  <br style="clear:both">
                </div>
              </div>
            </div>
            <div class="loadImg" v-if="isLoading">
              <img :src="loadingImg" alt="">
              加载中...
            </div>
            <div class="footerLine" v-if="isShowB"> 
              <hr/><span>我也是有底线的</span><hr/>
            </div>
        </div>
      </div>
      <div class="loadImg nohavedata" v-if="!haveData">
        <img src="../../assets/images/search_empty@2x.png" alt="">  
        没有找到搜索结果
      </div>
      <toTop v-if="isshowToTop"></toTop>
      <navigation></navigation>
  </div>  
</template>  
  
<script> 
import navigation from './navigation.vue' 
import toTop from './toTop.vue'
import VDistpicker from 'v-distpicker'
import {Toast,MessageBox} from 'mint-ui'
import util from '@/libs/util' 
import headers from '../headers.vue'
import axios from 'axios'
export default {  
  name: 'goodsList',  
  data() {  
    return {  
        dates:[],
        clickStyle:false,//商品列表样式切换
        isloading:true,//无限滚动：是否有下一页
        nowData:null,//现阶段展示了几条数据
        keyword:null,//(描述：关键字搜索、类型：String、是否必填：N)
        sortBy:null,//(描述：1 价格 2 新品 3人气 、类型：Integer、是否必填：N)空为综合
        sortType:null,//(描述：1 倒序、类型：Integer、是否必填：N)
        pageNo:null,//(描述：页码 、类型：Integer、是否必填：Y)
        brandId:null,//(描述：品牌ID 、类型：Long、是否必填：N)
        typeId:null,//(描述：类目ID 、类型：Long、是否必填：N)
        isShowB:false,
        isLoading:false,
        loadingImg:null,
        haveData:true,
        isshowToTop:false,
        pageheight:'',
    };  
  },
  components:{
    toTop:toTop,
    navigation:navigation,
  },
  created:function(){
    let that =this;
    if(that.$route.query.str){
      that.keyword = decodeURIComponent(that.$route.query.str);
    }
    if(that.$route.query.GoodsName){
      that.typeId = that.$route.query.id;
      that.keyword = decodeURIComponent(that.$route.query.GoodsName);
    }else{
      that.typeId = that.$route.query.id;
    }

    that.loadingImg = util.loadImg;
    window.addEventListener('scroll',()=>{
      if(window.scrollY>0){
        this.isshowToTop = true;
      }else{
        this.isshowToTop = false;
      }
    })
    this.pageheight = 'height:'+window.innerHeight+'px';
  },
  methods:{
    loadMore() {//上啦加载更多
      if(!this.isloading){
        this.isShowB = true;
      }else{
        this.isShowB = false;
        this.isLoading = true;
        this.loading = true;
        setTimeout(() => {
          this.pageNo+=1;
          this.goodsList();
          this.loading = false;
        }, 1000);
      }
    },
    changeNavbar(type){//副标题切换
      switch(type){
        case 0:
          this.sortBy = '';
          this.sortType = '';
          this.pageNo = 1;
          this.dates = [];
          break;
        case 1:
          this.sortBy = 1;
          if(this.sortType == ''){
            this.sortType = 1;
            this.pageNo = 1;
            this.dates = [];
          }else{
            this.sortType = '';
            this.pageNo = 1;
            this.dates = [];
          }
          break;
        case 2:
          this.sortBy = 2;
          this.sortType = '';
          this.pageNo = 1;
          this.dates = [];
          break;
        case 3:
          this.sortBy = 3;
          this.sortType = '';
          this.pageNo = 1;
          this.dates = [];
          break;
      }
      this.goodsList();
    },
    custom(){
      if(this.clickStyle){this.clickStyle=false;}else{this.clickStyle=true;}
    },
    goodsList(){//请求数据
      let that = this;
      let data = {
        "keyword":that.keyword,
        "sortBy":that.sortBy,
        "sortType":that.sortType,
        "pageNo":that.pageNo,
        "brandId":that.brandId,
        "typeId":that.typeId
      };
      let ajaxOb ={
        method:"post",
        dataType: 'json',
        data:data
      };
      if(that.$route.query.cardid){
        data['cardId'] = that.$route.query.cardid;
        let urlStr = util.getpost(data);
        ajaxOb['url']="/collect/alreadyReceive"+urlStr;
      }else{
        let urlStr = util.getpost(data);
        ajaxOb['url']="/goods/open/searchgoods"+urlStr;
      }
      axios(ajaxOb).then(response =>{
        this.isLoading = false;
        if(response.data.status == 0){
          if(response.data.body.items.length == 0 && that.pageNo==1){//第一次请求就没有数据
            that.isloading = false;
            that.haveData = false;
          }else if(response.data.body.items.length == 0 && that.pageNo!=1){//非第一次请求没有数据
            that.isloading = false;
            that.isShowB = true;//显示底线
          }else{
            for(let i = 0; i<response.data.body.items.length ;i++){
              that.dates.push(response.data.body.items[i]);
            }
            that.nowData += response.data.body.items.length;//当前为止请求的数据量
            if(that.nowData == response.data.body.total){
              that.isloading = false;
              that.isShowB = true;//显示底线
            }else{
              that.isloading = true;
              that.isShowB = false;//不显示底线
            }
            that.haveData = true;
          }
        }else{
          that.haveData = false;
          MessageBox('系统提示',response.data.message);
        }
      }).catch(response =>{
        that.haveData = false;
        this.isLoading = false;
        MessageBox('系统提示',oData.data.message);
      })
    }
  },
  props:{
      classContainerType:String
  },
  
};  
</script>  
  
<style lang="less" scoped>   
     @import '../../assets/less/goodsList.less';
     header{
      position: fixed;
      width: 100%;
      top: 0;
      left: 0;
      height: 0.3rem;
      background-color: #fff;
      color: #000;
      border-bottom: 1px solid #ececec;
      padding: 0.05rem 0;
      z-index: 1000;
      i{
        display: inline-block;
        width: 0.08rem;
        height: 0.08rem;
        line-height: 0.3rem;
        border-width: 2px 2px 0 0;
        border-style: solid;
        border-color: #888;
        transform: matrix(-.71,.71,.71,.71,0,0); 
      }
      .input_p{
        display: inline-block;
        width: 70%;
        height: 100%;
        background: #ddd;
        opacity: 0.5;
        padding-left:0.15rem; 
        margin-right: 0.2rem;
        font-size: .13rem;
        text-align: left;
        b{
          display: inline-block;
          width: .15rem;
          height: .15rem;
          background: url(../../assets/images/search_icon.png) no-repeat;
          background-size: .15rem .15rem;
          background-position: 0 0;
          margin-right: .1rem;
          vertical-align: middle;
        }
        input{
          background: #ddd;
          height: 100%;
        }
      }
      
      span{
        display: inline-block;
        width: 0.15rem;
        height: 0.15rem;
        background: url('../../assets/images/style_state1.png') no-repeat;
        background-size:0.15rem; 
        vertical-align: middle;
        padding-bottom: .05rem;
        &.bigImg{
          background: url('../../assets/images/style_state2.png') no-repeat;
          background-size:0.15rem; 
        }
      }    
    }
    .loadImg{
      position: fixed;
      top: 30%;
      left: 0;
      width: 100%;
      text-align: center;
      font-size: .14rem;
      color:#989898;
      img{
        display: block;
        margin: 0 auto;
      }
    }
    .nohavedata{
      position: fixed;
      top: 30%;
      left: 0;
      width: 100%;
      text-align: center;
      font-size: .14rem;
      color:#989898;
      img{
        display: block;
        margin: 0 auto;
        width: 0.95rem;
        height: .85rem;
        margin-bottom: .15rem;
      }
    }
</style>







