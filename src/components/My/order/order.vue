<template>  
  <div class="order" :style="!isShow?'height:'+heightStr+'px;':''">
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'全部订单'"></headers>  
    <ul class="title_ul" :style="$store.state.titleShow?'margin-top:.45rem':''">
      <li v-for=" (item,index) in items" :class="index==clickType?'active':''" @click.stop="switchTabbar(item.type)">{{item.name}}</li>
    </ul>
    <div class="haveData" v-if="isShow" :style="$store.state.titleShow?'margin-top:.95rem':''">
      <div @touchstart="funckaishi($event)" @touchmove="functionHeight($event)" style="overflow:auto;">
        <div class="order_data" v-for="item in orders" @click.stop="jumpOrderDetails(item.orderId)">
          <p class="time" style="font-size:12px;"><span>下单时间：{{item.createTime}}</span><i>{{item.statusText}}</i></p>
          <div>
            <img v-for="imgurl in item.imgStrArr" :src="imgurl">
            <span style="font-size:12px;" v-if="item.imgStrArr.length==1">{{item.goodNameStrArr[0]}}</span>
          </div>
          <p class="good" style="font-size:12px;" v-if="item.orderType==1">共{{item.num}}件商品 <b v-text="item.status!=1?'实付':'应付'"></b>金额¥{{(item.realpay/100).toFixed(2)}}</p><!--1.待支付2.待收货3.已完成4.已取消-->
          <p class="good" style="font-size:12px;" v-if="item.presellStatus==1">共{{item.num}}件商品 应付定金:{{item.depositStr}}</p>
          <p class="good" style="font-size:12px;" v-if="item.presellStatus==2">共{{item.num}}件商品 应付尾款:{{item.tailMoneyStr}}</p>
          <p class="button">
            <span class="border" v-if="item.orderType==1 && item.status==1" @click.stop="jumpOrderPay(item.orderId)" >立即支付</span>
            <span class="border" v-if="item.orderType==5 && item.presellStatus == 1" @click.stop="jumpOrderPay(item.orderId)" >支付定金</span>
            <span v-if="item.orderType==5 && item.presellStatus == 2" :class="item.CanPayment?'border':'border noclick'" @click.stop="jumpOrderPay(item.orderId,item)" >支付尾款</span>
            <span class="black" v-if="item.status == 2" @click.stop="jumpOrderTrack(item.orderId)">订单跟踪</span>
            <span class="background" v-if="item.status == 2 && item.isDeliver == 1 && item.shoppingModel!=3" @click.stop="ConfirmationReceipt(item.orderId)">确认收货</span>
            <span class="black" v-if="item.status == 3" @click.stop="jumpAfterSale(item.orderId)">申请售后</span>
            <span class="black" v-if="item.status == 3 && item.isComment == 0" @click.stop="jumpComment(item)">评价</span>
            <span class="black" v-if="item.status == 4" @click.stop="deleteOrder(item.orderId)">删除订单</span>
          </p>
        </div>
      </div><!-- 
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" distance-index="2">
        
      </mt-loadmore> -->
    </div>
    <div class="nodata" v-if="!isShow">
      <img src="../../../assets/images/my/location_empty@2x.png" alt="">
      <span>您还没有任何订单</span>
    </div>
    <navigation></navigation>
  </div>  
</template>  
  
<script>  
import Cookies from 'js-cookie';
import navigation from '../../goods/navigation.vue'  
import headers from '../../headers.vue'
import {Toast,MessageBox} from 'mint-ui'
import axios from 'axios'
import util from '@/libs/util' 
export default {  
  name: 'order',  
  data() {  
    return {  
      isShow:false,
      clickType:null,
      items:[//1.待支付 , 2,.待收货 , 3.已完成 , 4.已取消
        {name:'全部',type:0},{name:'待支付',type:1},{name:'待收货',type:2},{name:'已完成',type:3},{name:'已取消',type:4}
      ],
      titleType:null,
      orders:[],
      allLoaded:false,
      pageNo:1,
      heightStr:null,
      ifNext:true,
      CanPayment:false,//默认不能支付尾款
    };  
  },
  components:{
    headers:headers,
    navigation:navigation,
  },
  methods:{
    funckaishi(e){
     this.yuansukaishi = window.scrollY;
    },
    functionHeight(e){
      this.yuansujieshu = window.scrollY;
      if(this.yuansujieshu>1000 && this.ifNext){
        this.pageNo+=1;
        this.ajaxOrder();
      }
    },
    jumpComment(obj){//订单评价
      let str = encodeURIComponent(JSON.stringify(obj));
      this.$router.push({name:'comment',query:{orderObj:str,type:1}});
    },
    jumpAfterSale(id){//申请售后
      
      this.$router.push({name:'ApplyAfterSale',query:{orderId:id}});
    },
    jumpOrderTrack(id){//订单跟踪跳转
      this.$router.push({name:'orderTrack',query:{orderId:id}});
    },
    jumpOrderDetails(id){//订单详情跳转
      this.$router.push({name:'orderDetails',query:{orderId:id}});
    },
    ConfirmationReceipt(id){//确认收货
      MessageBox.confirm('商品已经全部收到，确认收货？').then(action => {
        let that =this;
        let data = {
          "orderId":id
        };
        let urlStr = util.getpost(data);
        axios({
          method:"post",
          url:"/order/confirmReceipt"+urlStr,
          dataType: 'json',
          data:data,
        }).then(response => {
          if(response.data.status == 0){
            if(response.data.body.isFinish == 0){
              Toast('还未收到货物，无法确认！');
              return;
            }else{
              Toast('确认收货');
              location.reload();
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
      });
    },
    jumpOrderPay(id,obj){//跳转支付页面
      if(obj && !obj.CanPayment){//不可支付尾款
        return;
      }
      let cookieStr=Cookies.get('VUE2SESSID');
      if(obj){//尾款支付跳转
        let newTime = new Date().getTime();//当前时间戳
        let RemainingTime= ((obj.balancePaymentEndTimeT-newTime)/1000).toFixed(0);//尾款支付剩余时间
        this.$router.push({name:'orderPayment',query:{orderId:id,VUE2SESSID:encodeURIComponent(cookieStr),RemainingTime:RemainingTime}});
      }else{
        this.$router.push({name:'orderPayment',query:{orderId:id,VUE2SESSID:encodeURIComponent(cookieStr)}});
      }
    },
    deleteOrder(id){//删除订单
      let that =this;
      let data = {
        "orderId":id
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/order/orderDelete"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          Toast('删除成功!');
          location.reload();
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
    loadTop() {
      this.switchTabbar(this.titleType);
      this.$refs.loadmore.onTopLoaded();
    },
    loadBottom() {
      this.ajaxOrder();
      this.$refs.loadmore.onBottomLoaded();
    },
    switchTabbar(type){//切换标题，请求数据，切换的同时请求的页面要初始化
      let that = this;
      that.clickType = type;
      that.titleType = type;
      that.$router.replace({name:'order',query:{type:type}});
      that.pageNo = 1;
      that.ajaxOrder();
    },
    ajaxOrder(){//数据请求
      let that =this;
      if(that.titleType == 0){that.titleType = null}
      let data = {
        "status": that.titleType,//(描述：订单状态（null.查询所有  1.待支付 , 2,.待收货 , 3.已完成 , 4.已取消）、类型：Integer、是否必填：Y)
        "pageNo": that.pageNo//(描述：第几页、类型：Integer、是否必填：Y)
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/order/page"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          if(response.data.body.items.length == 0 && that.pageNo==1){
            that.isShow=false;
            that.allLoaded=true;
            that.ifNext=false;
          }else{
            that.isShow=true;
            if(that.pageNo ==1){
              that.orders = response.data.body.items;
            }else{
              if(response.data.body.items.length>0){
                for(let i in response.data.body.items){
                  that.orders.push(response.data.body.items[i]);
                }
              }
            }
            that.dataRestructure();
            
            if((response.data.body.total-(response.data.body.limit*response.data.body.page))>0){//有下一页
              that.ifNext = true;
            }else{
              that.allLoaded = true;
              that.ifNext = false;
            }
          }
        }else{
          if(response.data.status = 499){//token失效或没有token
            util.outLogin();
            that.$router.push({name:'signInPage',query:{outLogin:'/'}});
          }else{
            that.isShow=false;
            that.allLoaded=true;
            MessageBox('系统提示',response.data.message);
          }
        }
        response.data.body
      }).catch(oData => {
        that.isShow=false;
        that.allLoaded=true;
        MessageBox('系统提示',oData.data.message);
      })
    },
    dataRestructure(){//请求数据重构
      let vm = this;
      for(let c=0 ;c<vm.orders.length ;c++){
        vm.orders[c]['imgStrArr']=[],vm.orders[c]['goodNameStrArr']=[];
        if(vm.orders[c]['imgUrls'] && vm.orders[c]['imgUrls'].indexOf(',')>=0){
          vm.orders[c]['imgStrArr'] = vm.orders[c].imgUrls.split(',');
          if(vm.orders[c].goodsNames){
            vm.orders[c]['goodNameStrArr']=vm.orders[c].goodsNames.split(',');
          }
        }else{
          if(vm.orders[c]['imgUrls']){
            vm.orders[c]['imgStrArr'].push(vm.orders[c]['imgUrls']);
          }
          if(vm.orders[c]['goodsNames']){
            vm.orders[c]['goodNameStrArr'].push(vm.orders[c]['goodsNames']);
          }
        }
      }
      var timestamp=new Date().getTime();//当前时间戳
      for(let i = 0 ;i < vm.orders.length ; i++){
        let obj = vm.orders[i];
        if(obj.orderType && obj.orderType == 5 && obj.balancePaymentStartTimeL){//是定金预售订单
          if(obj.tailPayStatusByDate == 2){//尾款支付还未开始,不能支付尾款
            obj['CanPayment'] = false;
          }else{
            obj['CanPayment'] = true;
          }
        }
      }
    },
  },
  created(){
    this.titleType = this.$route.query.type;
    this.clickType = this.$route.query.type;
    this.ajaxOrder();
    util.setTitle('全部订单');
    this.heightStr = window.innerHeight;
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
  }, 
};  
</script>   
  
<style lang="less" scoped>   
    @import "../../../assets/less/order.less";
    .demo_ul{
      width: 100%;
      .demo_li{
        width: 100%;
        height: .5rem;
        background-color: #fff;
        border:1px solid #ddd;
      }
    }
</style> 





















