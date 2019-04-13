<template>  
  <div class="orderTrack"> 
  <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'物流跟踪'"></headers>
  <div :style="$store.state.titleShow?'margin-top:.4rem':''">
    <!-- 包裹数量 -->
    <ul class="package" v-if="trackObj.length>1">
      <li :class="nowSwitch==index?'active':''" v-for="(track,index) in trackObj.length" @click.stop="changeSwitch(index)">包裹{{index}}</li>
    </ul>
    <!-- 订单物流详情 -->
    <div v-if="wuliuType" v-for="(track,index) in trackObj" v-show="nowSwitch==index">
      <!-- 订单信息 -->
      <ul class="orderXinxi">
        <li>订单编号：{{track.orderNo}}</li>
        <li>下单时间：{{track.createTime}}</li>
        <li v-if="track.expressName && track.expressName!=''">物流公司：{{track.expressName}}</li>
        <li v-if="track.expressNo && track.expressNo!=''">物流单号：{{track.expressNo}}</li>
      </ul>
      <!-- 商品信息 -->
      <div class="goodXin" v-if="track.goodsName &&track.goodsName !=''">
        <p v-for="good in track.goodArr">{{good}}<i>x1</i></p>
        <!-- <p>【赠品】OPPO R11 玫瑰金<i>x1</i></p> -->
      </div>
      <!-- 物流信息 -->
      <div class="logistics">
        <div class="logistics_div" v-if="track.orderTrackDataDtos && track.orderTrackDataDtos.length>0" v-for="(TrackData,b) in track.orderTrackDataDtos">
          <i :class="b==0?'one':''"></i>
          <p>{{TrackData.context}}</p>
          <p class="time">{{TrackData.time}}</p>
        </div>
      </div>
    </div>

    <!-- 服务单物流详情 -->
    <div v-if="!wuliuType" class="wuliu">
      <!-- 订单信息 -->
      <ul class="orderXinxi">
        <li>服务单号：{{trackObj.cancelOrderNo}}</li>
        <li>物流公司：{{trackObj.expressName}}</li>
        <li>物流单号：{{trackObj.expressNo}}</li>
      </ul>
      <!-- 物流信息 -->
      <div class="logistics" v-if="trackObj.orderTrackDataDto && trackObj.orderTrackDataDto.length>0">
        <div class="logistics_div"  v-for="(TrackData,b) in trackObj.orderTrackDataDto">
          <i :class="b==0?'one':''"></i>
          <p>{{TrackData.context}}</p>
          <p class="time">{{TrackData.time}}</p>
        </div>
      </div>
    </div>
  </div> 
    
    <button class="button" v-if="!wuliuType" @click.stop="jumpLogFunc(trackObj.expressHistoryId)">更改物流单号</button>
    <navigation></navigation>
  </div>  
</template>  
  
<script> 
import navigation from '../../goods/navigation.vue' 
import headers from '../../headers.vue'
import {Toast,MessageBox} from 'mint-ui' 
import Cookies from 'js-cookie';
import util from '@/libs/util' 
import axios from 'axios' 
export default {  
  name: 'orderTrack',
  data() {  
    return {  
      orderId:null,//订单ID
      trackObj:[],//数据对象
      nowSwitch:0,//默认显示第一个包裹（数组0）
      wuliuType:true,//默认显示普通的
      orderCancelId:null,//售后单id
    };  
  },
  components:{
    headers:headers,
    navigation:navigation,
  },
  methods:{
    jumpLogFunc(id){//服务单更改物流
      this.$router.replace({name:'logistics',query:{cancelId:this.orderCancelId,expressHistoryId:id}});
    },
    changeSwitch(type){//包裹切换
      this.nowSwitch=type;
    },
    ajaxOrderTrack(){//普通物流信息
      let that =this;
      let data = {
        "orderId":that.orderId
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/order/orderTrack"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          that.trackObj = response.data.body;
          let arr= [];
          for(let i in that.trackObj){
            if(that.trackObj[i].goodsName && that.trackObj[i].goodsName != ''){
              arr = that.trackObj[i].goodsName.split(',');
            }
            that.trackObj[i]['goodArr']=arr;
          }
        }else{
          if(response.data.status = 499){//token失效或没有token
            util.outLogin();
            that.$router.push({name:'signInPage',query:{outLogin:'/'}});
          }else{
            MessageBox('系统提示',response.data.message);
          }
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
    ajaxCustom(){//售后单物流查询
      let that =this;
      let data = {
        "expressHistoryId":that.orderId
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/ordercs/afterSaleExpressTrack"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          that.trackObj = response.data.body;
          // let arr= [];
          // for(let i in that.trackObj){
          //   if(that.trackObj[i].goodsName && that.trackObj[i].goodsName != ''){
          //     arr = that.trackObj[i].goodsName.split(',');
          //   }
          //   that.trackObj[i]['goodArr']=arr;
          // }
          console.log(that.trackObj);
        }else{
          if(response.data.status = 499){//token失效或没有token
            util.outLogin();
            that.$router.push({name:'signInPage',query:{outLogin:'/'}});
          }else{
            MessageBox('系统提示',response.data.message);
          }
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
  },
  created(){
    this.orderId = this.$route.query.orderId;
    if(this.$route.query.source){
      this.wuliuType=false;
      this.orderCancelId = this.$route.query.orderCancelId;
      this.ajaxCustom();
    }else{
      this.wuliuType=true;
      this.ajaxOrderTrack();
    }
    util.setTitle('物流跟踪');
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
  },
  updated(){
    
  }
};  
</script>  
  
<style lang="less" scoped>   
  @import '../../../assets/less/orderTrack.less';
</style> 











