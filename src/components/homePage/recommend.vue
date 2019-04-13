<template>  
  <div class="recommend">
    <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
      <div v-if="isDateShow" :style="$store.state.jumpAppTime?'margin-top:.95rem;':'margin-top:.45rem;'">
        <!-- 轮播图 -->
        <div class="swipeDiv" v-if="images && images.length>0">
          <mt-swipe :auto="3000">
            <mt-swipe-item v-for="img in images">
              <img class="imagesStyle" :src="img.val" @click.stop="changeurl(img.link)">
            </mt-swipe-item>
          </mt-swipe>
        </div>
        <!-- 消息轮播 -->
        <div class="xiaoxiSwipe" v-if="xiaoxiArr.length>0">
          <div class="swipe"> 
            <span class="gongg"><i></i>公告</span>
            <div class="xiaoxi">
              <mt-swipe :auto="3000" :showIndicators="false">
                <mt-swipe-item v-for="item in xiaoxiArr">
                  <p @click.stop="changeurl(item.link)">{{item.content}}</p>
                </mt-swipe-item>
              </mt-swipe>
            </div>  
            <b class="close" @click.stop="ajaxCarousel(xiaoxiArr[0].createTime)"></b>
          </div>
        </div>
        <p style="width:100%;height:.1rem;background:#f3f3f3;"></p>
        <div style="border-bottom:1px solid #f3f3f3;">
          <!-- 模块一 -->
          <div class="box" v-if="goods1.goodsList && goods1.goodsList.length>0">
            <p class="egmentingImg">- {{goods1.name}} -</p>
            <div class="listNew" >
              <div class="tongyi" v-for="(item,i) in goods1.goodsList" >
                <div v-if="i==0" class="listNew-special" @click.stop="changeurl(item.link)">
                  <img v-if="item.val && item.val!=''" :src="item.val" alt="">
                  <div v-if="item.goodsName" class="ordinary_conent">
                    <p>{{item.goodsName}}</p>
                    <p class="red" v-if="item.salePrice && item.salePrice!=''">¥{{(item.salePrice/100).toFixed(2)}}</p>
                  </div>
                  <p class="position" v-if="item.cardType"><!-- 定位的券 -->
                    <span v-if="item.cardType == 1">领券减<br><i>{{item.label}}</i></span>
                    <span v-if="item.cardType != 1">领券享<br><i>{{item.label}}折</i></span>
                  </p>
                </div>
                <div v-if="i!=0" class="ordinary" @click.stop="changeurl(item.link)"> 
                  <img v-if="item.val && item.val!=''" :src="item.val" alt="">
                  <div v-if="item.goodsName" class="ordinary_conent">
                    <p>{{item.goodsName}}</p>
                    <p class="red" v-if="item.salePrice && item.salePrice !=''">¥{{(item.salePrice/100).toFixed(2)}}</p>
                  </div>
                  <p class="position" v-if="item.cardType">
                    <span v-if="item.cardType == 1">领券减<br><i>{{item.label}}</i></span>
                    <span v-if="item.cardType != 1">领券享<br><i>{{item.label}}折</i></span>
                  </p>
                </div>
              </div>
              <img class="advertisement" v-if="goods1.channel" :src="goods1.channel?goods1.channel.val:''" @click.stop="changeurl(goods1.channel.link)">
            </div>
            <br style="clear:both;" />
          </div>

          <!-- 模块二 -->
          <div class="box" v-if="goods2.goodsList && goods2.goodsList.length>0">
            <p class="egmentingImg">- {{goods2.name}} -</p>
            <div class="listNew" >
              <div class="tongyi" v-for="(item,i) in goods2.goodsList" >
                <div v-if="i!=2" class="ordinary" @click.stop="changeurl(item.link)"> 
                  <img :src="item.val" alt="">
                  <div v-if="item.goodsName" class="ordinary_conent">
                    <p>{{item.goodsName}}</p>
                    <p class="red" v-if="item.salePrice && item.salePrice!=''">¥{{(item.salePrice/100).toFixed(2)}}</p>
                  </div>
                  <p class="position" v-if="item.cardType">
                    <span v-if="item.cardType == 1">领券减<br><i>{{item.label}}</i></span>
                    <span v-if="item.cardType != 1">领券享<br><i>{{item.label}}折</i></span>
                  </p>
                </div>
                <div v-if="i == 2" class="Bursting-special" @click.stop="changeurl(item.link)">
                  <img :src="item.val" alt="">
                  <div v-if="item.goodsName" class="ordinary_conent">
                    <p>{{item.goodsName}}</p>
                    <p class="red" v-if="item.salePrice && item.salePrice !=''">¥{{(item.salePrice/100).toFixed(2)}}</p>
                  </div>
                  <p class="position" v-if="item.cardType">
                    <span v-if="item.cardType == 1">领券减<br><i>{{item.label}}</i></span>
                    <span v-if="item.cardType != 1">领券享<br><i>{{item.label}}折</i></span>
                  </p>
                </div> 
                
              </div>
              <img class="advertisement" v-if="goods2.channel" :src="goods2.channel?goods2.channel.val:''" @click.stop="changeurl(goods2.channel.link)">
            </div>
            <br style="clear:both;" />
          </div>

          <!-- 模块三 -->
          <div class="box" v-if="goods3.goodsList && goods3.goodsList.length>0">
            <p class="egmentingImg">- {{goods3.name}} -</p>
            <div class="listNew" >
              <div class="tongyi" v-for="(item,i) in goods3.goodsList" >
                <div v-if="i==1" class="listNew-special" @click.stop="changeurl(item.link)">
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
                <div v-if="i!=1&&i!=0" class="ordinary" @click.stop="changeurl(item.link)"> 
                  <img :src="item.val" alt="">
                  <div v-if="item.goodsName" class="ordinary_conent">
                    <p>{{item.goodsName}}</p>
                    <p class="red" v-if="item.salePrice && item.salePrice !=''">¥{{(item.salePrice/100).toFixed(2)}}</p>
                  </div>
                  <p class="position" v-if="item.cardType">
                    <span v-if="item.cardType == 1">领券减<br><i>{{item.label}}</i></span>
                    <span v-if="item.cardType != 1">领券享<br><i>{{item.label}}折</i></span>
                  </p>
                </div>
                <div v-if="i == 0" class="Bursting-special" @click.stop="changeurl(item.link)">
                  <img :src="item.val" alt="">
                  <div v-if="item.goodsName" class="ordinary_conent">
                    <p>{{item.goodsName}}</p>
                    <p class="red" v-if="item.salePrice && item.salePrice !=''">¥{{(item.salePrice/100).toFixed(2)}}</p>
                  </div>
                  <p class="position" v-if="item.cardType">
                    <span v-if="item.cardType == 1">领券减<br><i>{{item.label}}</i></span>
                    <span v-if="item.cardType != 1">领券享<br><i>{{item.label}}折</i></span>
                  </p>
                </div> 
                
              </div>
              <img class="advertisement" v-if="goods3.channel" :src="goods3.channel?goods3.channel.val:''" @click.stop="changeurl(goods3.channel.link)">
            </div>
            <br style="clear:both;" />
          </div>

          <div class="box" v-if="listGoods.goodsList && listGoods.goodsList.length>0">
            <p class="egmentingImg">- {{listGoods.name}} -</p>
            <div class="listNew" >
              <div class="tongyi" v-for="item in listGoods.goodsList" >
                <div class="baohan">
                  <div class="findDoods_ordinary" @click.stop="changeurl(item.link)">
                    <img :src="item.val" alt="">  
                    <div class="findDoods_conent">
                      <span>{{item.goodsName}}</span><br/>
                      <span style="color:#E12E2E;" v-if="item.salePrice && item.salePrice != ''">¥{{(item.salePrice/100).toFixed(2)}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br style="clear:both;" /> 
          </div>

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
        <p class="button" @click="ajaxHomePage()">重新加载</p>
      </div>
    </div>

  </div>  
</template>  
  
<script>  
import util from '@/libs/util' 
import axios from 'axios';
export default {  
  name: 'recommend',  
  data() {  
    return {  
      id:'',
      goods1:[],
      goods2:[],
      goods3:[],
      listGoods:[{name:'',goodsList:[{goodsName:'',link:'',val:'',salePrice:''}],channel:{val:''}}],
      images:[],
      isDateShow:true,
      loadImg:null,
      allLoaded:false,
      xiaoxiArr:[],//消息轮播数组
    };  
  },
  props:{
    dataIds:String
  },
  components:{
      
  },
  methods:{
    loadTop() {
      this.ajaxHomePage();
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
    ajaxHomePage(){
      let that = this;
      that.id = '1';
      let date = {
        areaId:that.id,
      };
      let urlStr = util.getpost(date);
      axios({
        method:"post",
        url:"/open/areaDetail"+urlStr,
        dataType: 'json',
        data:date,
      }).then(response => {
        let arr = response.data.body;
        that.goods1 = response.data.body.blockList[0];
        that.goods2 = response.data.body.blockList[1];
        that.goods3 = response.data.body.blockList[2];
        that.listGoods = response.data.body.blockList[3];
        this.goods = arr.blockList;
        this.images = arr.bannerList;
        this.isDateShow = true;
      }).catch(oData => {
        this.isDateShow = false;
      })
    },
    ajaxCarousel(time){
      let that = this;
      let timeStr = that.getTimeStr();
      let date = {};
      if(time){
        date['createTime']=time;
      }else{
        date['createTime']='';
      }
      let urlStr = util.getpost(date);
      axios({
        method:"post",
        url:"/sysmsgSend/open/carousel"+urlStr,
        dataType: 'json',
        data:date,
      }).then(response => {
        that.xiaoxiArr = response.data.body;
      }).catch(oData => {
        
      })
    },
    getTimeStr(){
      let myDate = new Date();
      let Year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
      let month = Number(myDate.getMonth()+1)<10?'0'+Number(myDate.getMonth()+1):Number(myDate.getMonth()+1); //获取当前月份(0-11,0代表1月)
      let date = Number(myDate.getDate())<10?'0'+Number(myDate.getDate()):Number(myDate.getDate()); //获取当前日(1-31)
      let hours = Number(myDate.getHours())<10?'0'+Number(myDate.getHours()):Number(myDate.getHours()); //获取当前小时数(0-23)
      let min = Number(myDate.getMinutes())<10?'0'+Number(myDate.getMinutes()):Number(myDate.getMinutes()); //获取当前分钟数(0-59)
      let sec = Number(myDate.getSeconds())<10?'0'+Number(myDate.getSeconds()):Number(myDate.getSeconds()); //获取当前秒数(0-59)
      let timeStr = Year+'-'+month+'-'+date+' '+hours+':'+min+':'+sec;
      return timeStr; //获取日期与时间
    }
  },
  created:function(){
    // console.log('recom组件实力创建完成');
    this.ajaxHomePage();
    this.ajaxCarousel();
    this.loadImg = util.loadImg;
  },
  activated(){
    // console.log('组件被激活时');
  },
  beforeCreate(){
    // console.log('组件实力刚呗创建');
  },
  beforeMount(){
    // console.log('挂载前');
  },
  mounted(){
    // console.log('挂载后');
  },
  beforeUpdate(){
    // console.log('recom');
  },
  updated(){
    // console.log('组件更新之后');
  },
  updated(){
    // console.log('组件更新之后');
  },
  deactivated(){
    // console.log('组件被移除时');
  },
};  
</script>  
  
<style lang="less" scoped>  
@import '../../assets/less/recommend.less'; 
  .recommend{
    margin-top: 0.4rem;
    .swipeDiv{//轮播
      height: 1.57rem;
      .imagesStyle{
          width: 100%;
      }
    }
    .xiaoxiSwipe{
      height: .3rem;
      padding: .05rem .15rem;
      .swipe{
        width: 100%;
        height: 100%;
        background-color: #fff;
        position: relative;
        text-align: left;
        .gongg,.xiaoxi{
          display: inline-block;
          line-height: .3rem;
        }
        .gongg{
          width: 20%;
          text-align: left;
          vertical-align: top;
          border-right: 1px solid #ececec;
          i{
            display: inline-block;
            width: .16rem;
            height: .18rem;
            background: url('../../assets/images/home_sys_msg@2x.png') no-repeat;
            background-size: .16rem .18rem;
            vertical-align: middle;
            margin-right: .05rem;
            padding-top: .05rem;
          }
        }
        .xiaoxi{
          width: 70%;
          height: .4rem;
          p{
            text-align: left;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            margin-left: .11rem;
          }
        }
        .close{
          display: inline-block;
          width: .16rem;
          height: .16rem;
          background: url('../../assets/images/close_red@2x.png') no-repeat;
          background-size: .16rem;
          position: absolute;
          top: 22%;
          right: 0%;
        }
      }
    }
    .mint-swipe-indicators{
      bottom:0;
    }
    .mint-swipe-indicator.is-active{//mintUI改造
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
    
  }
</style> 


