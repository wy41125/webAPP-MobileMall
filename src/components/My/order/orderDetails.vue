<template>  
  <div class="confirmationOrder">  
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'订单详情'"></headers>  
    <!-- 订单状态 -->
    <div class="orderState" :style="$store.state.titleShow?'margin-top:.45rem':''">
      <p class="img"><i></i></p>
      <p class="zhuangtai">{{zhuangtaiStr}}</p>
      <p class="time" v-if="timeStr != ''">{{timeStr}}</p>
    </div>
    <!-- 订单跟踪 -->
    <div class="OrderTracking" v-if="orderObj.status == 2" @click.stop="jumpOrderTrack(orderObj.orderId)">
      <i></i><span>订单跟踪</span>
    </div>
    <!-- 订单物流信息 -->
    <div class="orderLogistics" :style="orderObj.status == 2?'margin-top:0;':''">
      <ul>
        <li>订单编号：{{orderObj.orderNo}}</li>
        <li>下单时间：{{orderObj.createTime}}</li>
        <li v-if="orderObj.shoppingModel ==2">收货人：{{orderObj.recvName}} ({{orderObj.recvPhone}})</li>
        <li v-if="orderObj.shoppingModel ==2">收货地址：{{orderObj.recevAddress}}</li>
        <li v-if="orderObj.shoppingModel ==3">自提门店：{{orderObj.orgName}}({{orderObj.linkPhone}})</li>
        <li v-if="orderObj.shoppingModel ==3">门店地址：{{orderObj.orgAddress}}</li>
        <li v-if="orderObj.shoppingModel ==3">自提时间：{{orderObj.pickupTime}}({{orderObj.weekDay}})</li>
      </ul>
      <div class="barcode" v-if="orderObj.shoppingModel == 3">
        <barcode :value="orderObj.takegoodscode" :options="{ displayValue: false }"></barcode>
        <p>{{orderObj.takegoodscode}}</p>
      </div>
    </div>
    <!-- 订单商品信息 -->
    <div class="order">
      <p class="order_title"><em style="font-size:12px;">订单信息</em><span><a :href="'tel:'+$store.state.serviceTelephone" style="font-size:12px;">联系客服</a></span></p>
      <div class="order_goods">
        <div class="good_div nopackage" v-for="item in orderObj.details" v-if="!item.packageDetails" @click.stop="jumpGood(item.onlineId)" :style="orderObj.details.length==1?'border:0px solid #ddd;':''">
          <div class="goodXinxi" >
            <div class="goodXinxi_img">
              <img :src="item.imgUrl">
            </div>
            <div class="goodXinxi_name">
              <p class="goodXinxi_name_oneP">{{item.goodsName}}</p>
              <p class="goodXinxi_name_twoP">{{item.salePriceStr}}<i>x{{item.num}}</i></p>
            </div>  
          </div>
          <p class="gift" v-for="gift in item.giftReturn">【赠品】 {{gift.goodsName}}<i>x{{gift.num}}</i></p>
        </div>
        <div class="good_div" v-for="item in orderObj.details" v-if="item.packageDetails" :style="orderObj.details.length==1?'border:0px solid #ddd;':''">
          <p class="package_p"><i>优惠套餐</i>{{item.packageName}} <span class="setPrice">¥{{(item.salePrice/100).toFixed(2)}}<b>x{{item.num}}</b></span></p>
          <div class="goodXinxi" v-for="(packageGood,i) in item.packageDetails" @click.stop="jumpGood(packageGood.onlineId)" :style="i==item.packageDetails.length-1?'border:0px solid #ececec;':''">
            <div class="goodXinxi_img">
              <img :src="packageGood.imgUrl">
            </div>
            <div class="goodXinxi_name">
              <p>{{packageGood.goodsName}}</p>
            </div>  
          </div>
          <!-- <p class="setPrice">{{item.salePriceStr}}<i>x{{item.num}}</i></p> -->
          <p class="gift" v-for="gift in item.giftReturn">【赠品】 {{gift.goodsName}}<i>x{{gift.num}}</i></p>
        </div>
      </div>
    </div>
    <!-- 订单其余信息 -->
    <div class="other" :style="orderObj.depositStr && orderObj.depositStr != ''?'margin-bottom:0;':''">
      <p class="other_p hasmone" >发票信息 <span >{{orderObj.invoiceName}}</span></p>
      <p class="other_p hasmone" v-if="orderObj.cardName">优惠券<span>{{orderObj.cardName}}</span></p>
      <p class="other_p hasmone" v-if="orderObj.orderType == 1">订单总额<span style="color:#e12e2e">¥{{(orderObj.salePrice/100).toFixed(2)}}</span></p>
      <p class="other_p hasmone" v-if="orderObj.orderType == 1">优惠<span style="color:#e12e2e"><em v-text="orderObj.couponPrice?'¥'+(orderObj.couponPrice/100).toFixed(2):'¥0.00'"></em></span></p>
    </div>
    <!-- 预售信息 -->
    <div class="preSale" v-if="orderObj.depositStr && orderObj.depositStr != '' && orderObj.orderType == 5">
      <p class="title">订单金额</p>  
      <div class="stageDiv">
        <div class="stage selectStage" :style="orderObj.depositPayStatus == 0?'color:#e12e2e;':''">
          <p class="stageOne">
            <em class="icon_em"><b class="icon_b"></b><i class="icon_i"></i></em>
            定金<span><em>小计：</em>{{orderObj.depositStr}}</span>
          </p>
          <p class="stageTwo"><i v-text="orderObj.depositPayStatus == 1?'已支付':'待支付'"></i></p>
        </div>
        <div :class="((orderObj.depositPayStatus == 1 && orderObj.payStatus == 0) || orderObj.payStatus == 1)?'stage selectStage':'stage'" :style="orderObj.depositPayStatus == 1 && orderObj.payStatus == 0?'color:#e12e2e;':''">
          <p class="stageOne" >
            <em class="icon_em"><b class="icon_b"></b><i class="icon_i"></i></em>
            尾款<span><em>小计：</em>{{orderObj.finalMoneyStr}}</span>
          </p>
          <p class="stageTwo" style="border:0px solid #ddd;">
            <em style="color:#999;" v-show="orderObj.status == 1">({{orderObj.balancePaymentStartTime}}-{{orderObj.balancePaymentEndTime}}支付尾款)</em>
            <i v-if="orderObj.tailPayStatusByDate == 2">未开始</i>
            <i v-if="orderObj.tailPayStatusByDate == 1" v-text="orderObj.payStatus==1?'已支付':'待支付'"></i>
          </p> 
        </div>
      </div>
      <div class="div_stage_p">
        <p class="stage_p"><b>订单总额：</b><span><em></em>{{orderObj.salePriceStr}}</span><i></i></p>
        <p class="stage_p"><b>优惠：</b><span><em v-text="orderObj.couponPrice?'¥'+(orderObj.couponPrice/100).toFixed(2):'¥0.00'"></em></span><i></i></p>
      </div>
    </div>

    <!-- footer_botton -->
    <div class="footer_botton">
      <p class="maney" :style="orderObj.isApplyRefund==1?'margin-top:2%;':''">
        <span v-if="(orderObj.status ==1 && orderObj.orderType==1) || (orderObj.status ==1 && orderObj.orderType==5 && !orderObj.depositStr)" :style="orderObj.isApplyRefund!=1?'line-height: .5rem;':''"><em >应付金额</em><i class="red"> ¥{{(orderObj.realPay/100).toFixed(2)}}</i></span>
        <span v-if="orderObj.orderType==5 && orderObj.depositPayStatus ==0" :style="orderObj.isApplyRefund!=1?'line-height: .5rem;':''"><em >应付定金</em><i class="red"> {{orderObj.depositStr}}</i></span>
        <span v-if="orderObj.orderType==5 && orderObj.depositPayStatus ==1 && orderObj.payStatus ==0 && orderObj.status == 1" :style="orderObj.isApplyRefund!=1?'line-height: .5rem;':''"><em >应付尾款</em><i class="red"> {{orderObj.finalMoneyStr}}</i></span>
        <span v-if="orderObj.status !=1" :style="orderObj.isApplyRefund!=1?'line-height: .5rem;':''"><em >实付金额</em><i class="red"> ¥{{(orderObj.realPay/100).toFixed(2)}}</i></span>
        <span v-show="orderObj.isApplyRefund==1" style="color:#999;">已退款金额：¥{{(orderObj.totalRefund/100).toFixed(2)}}</span>
      </p> 
      <span class="button solid" v-if="orderObj.orderType==1 && orderObj.status ==1" @click.stop="jumpOrderPay(orderObj.orderId)">立即支付</span>
      <span class="button solid" v-if="orderObj.orderType==5 && orderObj.depositPayStatus ==0 && orderObj.status ==1" @click.stop="jumpOrderPay(orderObj.orderId)">支付定金</span>
      <span class="button solid" :style="(orderObj.tailPayStatusByDate==2)?'opacity:.5;':''" v-if="orderObj.orderType==5 && orderObj.depositPayStatus ==1 && orderObj.payStatus ==0 && orderObj.status == 1" @click.stop="jumpOrderPay(orderObj.orderId,orderObj)">支付尾款</span>
      <span class="button" v-if="((orderObj.orderType==5 && orderObj.depositPayStatus ==0) || (orderObj.orderType==5 && orderObj.depositPayStatus ==1 && orderObj.payStatus == 0) || orderObj.orderType==1) && orderObj.status ==1" @click.stop="cancelOrder(orderObj.orderId)">取消订单</span>
      <span class="button" v-if="orderObj.status ==2 && orderObj.isDeliver==0 && orderObj.payStatus == 1" @click.stop="jumpRefund(orderObj)">申请退款</span>
      <span class="button solid" v-if="orderObj.status ==2 && orderObj.isDeliver==0" @click.stop="modifyOrder(orderObj)">修改订单</span>
      <span class="button solid" v-if="orderObj.status ==2 && orderObj.isDeliver==1" @click.stop="ConfirmationReceipt(orderObj.orderId)">确认收货</span>
      <span class="button" v-if="orderObj.status ==3" @click.stop="ApplyAfterSale(orderObj.orderId)">申请售后</span>
      <span class="button solid" v-if="orderObj.status ==3 && orderObj.isComment==0" @click.stop="jumpComment(orderObj)">评价</span>
      <span class="button" v-if="orderObj.status ==4" @click.stop="deleteOrder(orderObj.orderId)">删除订单</span>
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
  name: 'orderDetalis',  
  data() {  
    return {  
      orderId:null,//订单ID
      orderObj:{},//订单详情数据对象
      zhuangtaiStr:'',//订单状态描述
      timeStr:'',//订单友好提示语
      barcode:null,//订单码
      count: '',//计时数字
      timer: null,//计时器
    };  
  },
  components:{
    headers:headers,
    navigation:navigation,
  },
  created(){
    this.orderId = this.$route.query.orderId;
    this.ajaxOrderDetail();
    util.setTitle('订单详情');
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }

  },
  methods:{
    ajaxTelephone(){//获取客户电话
      let that =this;
      let data = {};
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/open/getServerPhone"+urlStr,
        dataType: 'json', 
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          that.$store.commit('addServiceTelephone',response.data.body.val);
        }else{
          Toast(response.data.message);
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
    jumpOrderTrack(id){//订单跟踪跳转
      this.$router.push({name:'orderTrack',query:{orderId:id}});
    },
    jumpComment(obj){//订单评价
      let str = encodeURIComponent(JSON.stringify(obj));
      this.$router.push({name:'comment',query:{orderObj:str,type:2}});
    },
    modifyOrder(obj){//修改订单地址
      let vm = this,PreSalechangeTime='';
      if(obj.shoppingModel==2){
        vm.$router.push({name:'addlessList',query:{source:'changeOrder',orderId:obj.orderId}});
      }else{
        if(vm.orderObj.orderType == 5){//预售商品订单
          if(vm.orderObj.depositStr && vm.orderObj.depositStr != ''){//定金预售订单
            PreSalechangeTime = encodeURIComponent(vm.orderObj.balancePaymentEndTime);
            vm.$router.push({name:'storePage',query:{source:'changeOrder',orderId:obj.orderId,orderTime:obj.pickupTime,PreSalechangeTime:PreSalechangeTime}});
          }else{//全款预售订单
            PreSalechangeTime = encodeURIComponent(vm.orderObj.presellEndTime);
            vm.$router.push({name:'storePage',query:{source:'changeOrder',orderId:obj.orderId,orderTime:obj.pickupTime,PreSalechangeTime:PreSalechangeTime}});
          }
        }else{//普通商品订单
          vm.$router.push({name:'storePage',query:{source:'changeOrder',orderId:obj.orderId,orderTime:obj.pickupTime}});
        }
      }
    },
    ApplyAfterSale(id){//申请售后
      this.$router.push({name:'ApplyAfterSale',query:{orderId:id}});
    },
    jumpRefund(obj){//申请退款
      let that =this;
      if(that.orderObj.orderType == 5 && that.orderObj.isRejectedDeposit &&that.orderObj.isRejectedDeposit == 0){
        MessageBox({
          title: '温馨提示',
          message: '该预售商品，若申请退款，定金将不予退换。确认取消吗?',
          showCancelButton: true,
          confirmButtonText:'申请退款',
          cancelButtonText:'再想一想'
        }).then(active =>{
          if(active == 'confirm'){
            that.jumpRefundJumpFunc(that.orderObj,'twk');
          }
        });
      }else{
        that.jumpRefundJumpFunc(that.orderObj,'tqk');
      }
    },
    jumpRefundJumpFunc(obj,type){//申请退款跳转func
      let arr = [],str='';
      for(let i in obj.details){
        arr.push(obj.details[i].detailId);
      }
      str = arr.join(',');
      if(type == 'djkt'){//定金可退，退定金跳转
        this.$router.push({name:'applicationRefund',query:{orderId:obj.orderId,orderDetailIds:encodeURIComponent(str),totalRefund:obj.deposit}});
      }else if(type == 'twk'){//退尾款
        this.$router.push({name:'applicationRefund',query:{orderId:obj.orderId,orderDetailIds:encodeURIComponent(str),totalRefund:obj.finalMoney}});
      }else if(type == 'tqk'){//退全款
        this.$router.push({name:'applicationRefund',query:{orderId:obj.orderId,orderDetailIds:encodeURIComponent(str),totalRefund:obj.realPay}});
      }
    },
    cancelOrder(){//取消订单
      let that =this;
      if(that.orderObj.orderType == 5){//预售商品订单
        if(that.orderObj.depositPayStatus == 0){//定金未支付-》直接取消
          that.cancelOrderAjax();
        }else{
          if(that.orderObj.isRejectedDeposit == 0){//定金不可退-》先提示在取消
            MessageBox({
              title: '温馨提示',
              message: '该预售商品，若取消订单，定金将不予退换。确认取消吗?',
              showCancelButton: true,
              confirmButtonText:'取消订单',
              cancelButtonText:'再想一想'
            }).then(active =>{
              if(active == 'confirm'){
                that.cancelOrderAjax();
              }
            });
          }else{//定金可退-》跳转申请退款页面手动退定金
            that.jumpRefundJumpFunc(that.orderObj,'djkt');
          }
        }
      }else{//普通商品订单-》直接取消
        that.cancelOrderAjax();
      }
    },
    cancelOrderAjax(){//取消订单请求func
      let that = this;
      let data = {
        "orderId":that.orderId
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/order/orderCancel"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          Toast('取消成功!');
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
    jumpOrderPay(id,obj){//跳转支付页面
      if(obj && obj.tailPayStatusByDate == 2){
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
          that.$router.go(-1);
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
    jumpGood(id){//商品跳转商品详情
      this.$router.push({name:'goodsDevele',query:{onlineId:id}});
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
    ajaxOrderDetail(){
      let that =this;
      let data = {
        "orderId":that.orderId
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/order/detail"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          that.orderObj = response.data.body;
          that.timeStrFunc(that.orderObj);
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
    
    timeStrFunc(obj){//订单友好提示语处理、订单状态描述
      let that =this;
      if(obj.status == 1 && obj.shoppingModel == 2){//待支付寄送
        if(obj.orderType==5 && obj.depositPayStatus ==1 && obj.payStatus ==0){//带支付尾款
          that.timeStr = '请在'+obj.balancePaymentStartTime+'-'+obj.balancePaymentEndTime+'内完成支付';
        }else{//带支付定金或普通商品
          that.timeStr = '请在'+obj.payTime+'内完成支付，否则订单将自动关闭';
          that.timerFunc(obj.payTime);
        }
        that.zhuangtaiStr = '待支付';
      }else if(obj.status == 1 && obj.shoppingModel == 3){//待支付自提
        if(obj.orderType==5 && obj.depositPayStatus ==1 && obj.payStatus ==0){//带支付尾款
          that.timeStr = '请在'+obj.balancePaymentStartTime+'-'+obj.balancePaymentEndTime+'内完成支付';
        }else{//带支付定金或普通商品
          that.timeStr = '请在'+obj.payTime+'内完成支付，否则订单将自动关闭';
          that.timerFunc(obj.payTime);
        }
        that.zhuangtaiStr = '待支付';
      }else if(obj.status == 2 && obj.shoppingModel == 2 && obj.isDeliver==0){//待收寄送（没发货）
        that.timeStr = '我们将尽快为您进行发货';
        that.zhuangtaiStr = '待收货';
      }else if(obj.status == 2 && obj.shoppingModel == 2 && obj.isDeliver==1){//待收寄送（已发货）
        that.timeStr = '商品已出库发货';
        that.zhuangtaiStr = '待收货';
      }else if(obj.status == 2 && obj.shoppingModel == 3){//待收自提
        that.timeStr = '请及时到自提门店进行取货';
        that.zhuangtaiStr = '待收货';
      }else if(obj.status == 3){//已完成自提、寄送
        that.timeStr = '期待您下次的光临';
        that.zhuangtaiStr = '已完成';
      }else if(obj.status == 4){//已取消
        that.timeStr = '';
        that.zhuangtaiStr = '已取消';
      }
    },
    timerFunc(timeStr){//普通订单支付
      let timeMiao = 0;
      if(timeStr.indexOf('小时')>=0){
        timeMiao = timeStr.split('小时')[0]*60*60+timeStr.split('小时')[1].split('分钟')[0]*60
      }else{
        timeMiao = timeStr.split('分钟')[0]*60
      }
      console.log(timeMiao);
      let that =this;
      that.count = timeMiao;
      that.timer = setInterval(() => {
        if (that.count > 0 && that.count <= timeMiao) {
          that.count --;
          let yu = that.count%60;
          let fen = (that.count-yu)/60;
          if(fen>60){
            that.timeStr = '请在1小时'+(fen-60)+'分钟'+yu+'秒内完成支付，否则订单将自动关闭';
          }else{
            that.timeStr = '请在'+fen+'分钟'+yu+'秒内完成支付，否则订单将自动关闭';
          }
        } else {
          clearInterval(that.timer);
          that.timer = null;
        }
      }, 1000)
    },
  },

};  
</script>  
  
<style lang="less" scoped>   
  @import '../../../libs/commnd.less';
  @import '../../../assets/less/confirmationOrder.less';
  @import '../../../assets/less/orderDetails.less';
</style> 





















