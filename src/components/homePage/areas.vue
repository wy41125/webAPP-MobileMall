<template>  
  <div class="areas"> 
    <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
      <div v-if="isDateShow" :style="$store.state.jumpAppTime?'margin-top:.95rem;':'margin-top:.45rem;'">
        <!-- 轮播图 -->
        <div class="swipeDiv" v-if="images && images.length>0">
          <mt-swipe :auto="3000">
            <mt-swipe-item v-for="img in images" :key="img.val">
              <img class="imagesStyle" :src="img.val" @click.stop="changeurl(img.link)">
            </mt-swipe-item>
          </mt-swipe>
        </div> 
        <!-- 手机 -->
        <div class="dateModular" v-for="(good,index) in goods" v-if="good.goodsList && good.goodsList.length>0">
          <p class="title_p">
            <span :class="(index+1)%3==1?'lanmuName':''" v-if="(index+1)%3==1"><i></i>{{good.name}}</span>
            <span :class="(index+1)%3==2?'twoI lanmuName':''" v-if="(index+1)%3==2"><i></i>{{good.name}}</span>
            <span :class="(index+1)%3==0?'threeI lanmuName':''" v-if="(index+1)%3==0"><i></i>{{good.name}}</span>
            <span class="mone" v-if="good.keyword" @click.stop="$router.push({name:'goodsList',query:{str:encodeURIComponent(good.keyword)}})">更多<i></i></span> 
          </p>
          <div class="tongyi" v-for="(item,i) in good.goodsList" @click.stop="changeurl(item.link)">
            <div v-if="i==0" class="Bursting-special">
              <img :src="item.val" alt="">  
              <div v-if="item.goodsName" class="ordinary_conent">
                <p>{{item.goodsName}}</p>
                <p class="red" v-if="item.salePrice && item.salePrice != ''">¥{{(item.salePrice/100).toFixed(2)}}</p>
              </div>
              <p class="position" v-if="item.cardType"><!-- 定位的券 -->
                <span v-if="item.cardType == 1">领券减<br><i>{{item.label}}</i></span>
                <span v-if="item.cardType != 1">领券享<br><i>{{item.label}}折</i></span>
              </p>
            </div>
            <div v-if="i!=0" class="ordinary" @click.stop="changeurl(item.link)">
              <img :src="item.val" alt="">
              <div v-if="item.goodsName" class="ordinary_conent">
                <p>{{item.goodsName}}</p>
                <p class="red" v-if="item.salePrice && item.salePrice !=''">¥{{(item.salePrice/100).toFixed(2)}}</p>
              </div>
              <p class="position" v-if="item.cardType"><!-- 定位的券 -->
                <span v-if="item.cardType == 1">领券减<br><i>{{item.label}}</i></span>
                <span v-if="item.cardType != 1">领券享<br><i>{{item.label}}折</i></span>
              </p>
            </div>
          </div>
          
          <img class="advertisement" v-if="good.channel" :src="good.channel?good.channel.val:''" alt="" @click.stop="changeurl(good.channel.link)"> 
          <br style="clear:both;" />
          
        </div>
        <div class="footerLine">
          <hr/><span>我也是有底线的</span><hr/>
        </div>
      </div>
      <div slot="top" class="mint-loadmore-top">
        <img :src="loadImg" alt="">
      </div>
    </mt-loadmore>

      

    <div v-if="!isDateShow" class="nohaveData">
      <div class="default_div">
        <img class="default_img" src="../../assets/images/loading_empty@2x.png" alt="">
        <br> 
        <p class="str">加载失败，网络开小差了</p>
        <p class="button" @click="ajaxArea()">重新加载</p>
      </div>
    </div>

  </div>  
</template>  
  
<script>  
import util from '@/libs/util' 
import axios from 'axios'
import {MessageBox} from 'mint-ui'
export default {  
  name: 'areas',  
  data() {  
    return {  
      images:[],
      goods:[],
      isDateShow:true,
      loadImg:null,
      allLoaded:false,
      areasId:null,
    };  
  },
  components:{
      
  },
  props:{
    
  },
  methods:{
    loadTop() {
      this.ajaxArea(this.$route.query.name);
      this.$refs.loadmore.onTopLoaded();
    },
    loadBottom() {
      this.allLoaded = true;// 若数据已全部获取完毕
      this.$refs.loadmore.onBottomLoaded();
    },
    changeurl(url){
      let that =this;
      if(url){
        if(url.indexOf('url=')>=0){//网页
          window.location.href = url.split('url=')[1];
        }else if(url.indexOf('onlineId=')>=0){//商品详情
          that.$router.push({name:'goodsDevele',query:{onlineId:url.split('onlineId=')[1]}});
        }else {
          window.location.href = url;
        }
      }
    },
    ajaxArea(id,type){
      let that =this;
      let data = {
        areaId:id,
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/open/areaDetail"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          that.images = response.data.body.bannerList;
          that.goods = response.data.body.blockList;
          if(response.data.body.blockList.length>0 && response.data.body.blockList.length>0){
            that.isDateShow =true;
          }else{
            that.isDateShow =false;
          }
        }else{
          MessageBox('系统提示',oData.data.message);
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
  },
  created(){
    this.areasId = this.$route.query.name;
    this.ajaxArea(this.$route.query.name,1);
    this.loadImg = util.loadImg;
  },
  beforeRouteUpdate(to,from,next){
    next(function(){

    })
  },
  watch:{
    $route(){
      this.ajaxArea(this.$route.query.name);
    }
  },
  beforeUpdate(){

  },
};  
</script>  
  
<style lang="less" scoped>   
    @import '../../assets/less/areas.less'; 
    .areas{
      margin-top:0.4rem;
      font-size: .14rem;
      color: #666;
    }
    .swipeDiv{//轮播
      height: 1.57rem;
      .imagesStyle{
          width: 100%;
      }
      img{
        height:100%;
      }
    }
    .mint-swipe-indicators{
      bottom:0;
    }
    //mintUI改造
    .mint-swipe-indicator.is-active{
      width: 0.2rem;
      border-radius: 20px; 
    }
    .nohaveData{
      position: fixed;
      top: 30%;
      left: 0;
      width: 100%;
      .default_div{
        .default_img{
          width:1.1rem;
          height: .9rem;
          margin-left: .2rem;
        }
        .str{
          color: #989898;
          margin: .15rem 0;
          font-size: .13rem;
        }
        .button{
          display: inline-block;
          background: #fff;
          font-size: 0.12rem;
          width: .76rem;
          height: .26rem;
          line-height: .26rem;
          text-align: center;
          border:1px solid #ccc;
          border-radius: 0.05rem;
          color: #666;
        }
      }
    }
</style> 