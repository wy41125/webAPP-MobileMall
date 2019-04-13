<template>  
  <div class="paymentResults">  
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'晶杰收银台'"></headers>
    <div class="resultsIcon" :style="$store.state.titleShow?'margin-top:.4rem':''">
      <img src="../../assets/images/shopCart/success@2x.png" alt="">
      {{orderStr}}
    </div>
    <div class="resultsXinxi">
      <p v-if="htmlStr.number"><span>订单编号：</span>{{htmlStr.number}}</p>
      <p v-if="htmlStr.time"><span>下单时间：</span>{{htmlStr.time}}</p>
      <p v-if="htmlStr.type"><span>支付方式：</span>{{htmlStr.type}}</p>
      <p v-if="htmlStr.price"><span>实付金额：</span>{{htmlStr.price}}</p>
      <button @click.stop="jumpPage(htmlStr.id)">查看订单</button>
    </div>
  </div>  
</template>  
  
<script>  
import headers from '../headers.vue'
import {Toast,MessageBox} from 'mint-ui'
import Cookies from 'js-cookie';
import util from '@/libs/util' 
import axios from 'axios'
export default {  
  name: 'paymentResults',  
  data() {  
    return {  
      orderStr:null,
      ajax:{
        orderId:null,
        payModel:null,
        fqNum:null,
        fqSellerPercent:null,
      },
      htmlStr:{
        id:null,
        time:null,
        type:null,
        price:null,
        number:null,
      }
    };  
  },
  components:{
    headers:headers,
  },
  methods:{
    jumpPage(id){
      this.$router.push({name:'orderDetails',query:{orderId:id}});
    },
    ajaxOrder(){//订单支付结果查询
      let that =this;
      let data = {
        "orderId": that.ajax.orderId,//(描述：订单id、类型：Long、是否必填：Y)
        "payModel": that.ajax.payModel,//(描述：支付方式 2 微信 3 支付宝 5 花呗分期、类型：Integer、是否必填：Y)
        "fqNum": that.ajax.fqNum,//(描述：分期数、类型：Integer、是否必填：N)
        "fqSellerPercent": that.ajax.fqSellerPercent//(描述：商家承担手续费比例 100 免息 0 含息、类型：Integer、是否必填：N)
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/order/payResult"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        that.htmlStr.id=response.data.body.orderId;
        that.htmlStr.time=response.data.body.createTime;
        that.htmlStr.type=response.data.body.payModelText;
        that.htmlStr.price=response.data.body.realPayText;
        that.htmlStr.number=response.data.body.orderNo;
        if(response.data.status == 0){
          that.orderStr = '付款成功';
        }else if(response.data.status == 1){
          that.orderStr = '付款失败';
        }else if(response.data.status == 499){
          that.$router.push({name:'signInPage',query:{outLogin:'/'}});
        }else if(response.data.status == 2){
          that.orderStr = '待收货';
        }else{
          MessageBox('系统提示',response.data.message);
        }
        
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    }
  },
  created(){
    util.setTitle('晶杰收银台');
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
    this.ajax.orderId = this.$route.query.orderId;
    this.ajax.payModel = this.$route.query.payModel;
    this.ajax.fqNum = this.$route.query.fqNum;
    this.ajax.fqSellerPercent = this.$route.query.fqSellerPercent;
    console.log(this.ajax.orderId);
    this.ajaxOrder();
  }
};  
</script>  
  
<style lang="less" scoped>   
  @import '../../assets/less/paymentResults.less';
</style> 











