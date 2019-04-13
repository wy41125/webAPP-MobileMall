<template>  
  <div class="orderPayment">  
    <headers v-if="isShowTitle" :headerType='2' :headerStr="'晶杰收银台'"></headers>
    <p class="prompt" :style="isShowTitle?'margin-top:.45rem':''">订单已经提交！请在<i>{{timeStr}}</i>内完成<em v-text="$route.query.RemainingTime?'尾款':''"></em>支付。</p>
    <div class="order">
      <p><span>订单编号</span>{{orderNo}}</p>
      <p><span>下单时间</span>{{orderTime}}</p>
      <p><span>待付金额</span>¥{{(orderPrice/100).toFixed(2)}}</p>
    </div>
    <div class="orderType">
      <p>请选择支付方式</p>
      <p @click.stop="switchType(3)"><i></i>支付宝<b :class="payType==3?'active':''"></b></p> 
      <p @click.stop="switchType(2)"><i></i>微信支付<b :class="payType==2?'active':''"></b></p> 
      <p @click.stop="switchType(5)"><i></i><em v-if="huabeiStr.terminallyPay" v-text="huabeiStr.terminallyPay+'x'+huabeiStr.itemStagingNum+'期'"></em><b :class="payType==5?'active':''"></b></p>
    </div>
    <div class="footer_botton" @click.stop="pay()">
      <span>立即付款</span>
    </div>
    <!-- 花呗弹窗 -->
    <mt-popup v-model="tcShow" class="tanchuang" position="bottom">
      <div class="tcTongyi huabei">
          <p class="title">花呗分期<i @click.stop="lookMone"></i></p>
          <ul>
            <li v-if="orderObj.stagingDto.isUseStaging !=1" v-for="(staging,index) in orderObj.stagingDto.stagingItemList" @click.stop="clickThisLI($event,staging,index)">
              <span>{{staging.terminallyPay}}x{{staging.itemStagingNum}}期</span>
              <span v-text="staging.isStaging ==0?'免息，无服务费':'含利息'+staging.poundageCost+'/期'"></span>
            </li>
          </ul>
          <button @click.stop="lookMone();return false;">确定</button>
      </div>
    </mt-popup>

    <div v-html="str"></div>

    <div class="mask" v-if="!toOtherView"></div>
    <div class="tishi" v-if="!toOtherView">
      <img class="tishi_one" src="../../assets/images/tishi@2x.png" alt="">
      <img class="tishi_two" src="../../assets/images/anniu@2x.png" alt="" @click.stop="guanbi">
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
  name: 'orderPayment',  
  data() {  
    return {  
       timeStr:null,
       orderId:null,//订单id
       orderNo:null,//订单编号
       orderTime:null,//下单时间
       orderPrice:null,//实付金额
       orderObj:{
        stagingDto:{
          isUseStaging:1,
        },
       },
       huabeiStr:{},//选择花呗之后显示的提示语（花呗几期）
       tcShow:false,//弹窗是否显示
       payType:null,//当前选择的支付方式
       str:'',
       appid:null,//微信应用id，微信浏览器支付使用
       code:null,//微信支付
       toOtherView:true,//
       webType:null,//
       shenyufenzhogn:null,//剩余几分钟
       shenyufenzhogn2:null,//剩余几分钟2
       count: '',//计时数字
       timer: null,//计时器
       isShowTitle:false,//页面标题是否显示
       jsonObj:null,
    };  
  },
  components:{
    headers:headers,
  },
  created(){
    util.setTitle('晶杰收银台');
    let millisecond = new Date().getTime(); 
    let expiresTime = new Date(millisecond + 60 * 1000 * 60 * 24 * 15);
    Cookies.set('VUE2SESSID', decodeURIComponent(this.$route.query.VUE2SESSID), {expires: expiresTime} );
    this.webType = util.webview();
    this.orderId = this.$route.query.orderId;
    let urlStr = window.location.href;
    if(urlStr.indexOf('code')>=0){
      this.code = urlStr.split('?')[1].split('&')[0].split('=')[1];
      this.payType = 2;
      this.pay();
    }else{
      this.ajaxPayinfo(this.orderId);
    }
    
  },
  methods:{
    readTitle(){
      let viewStr = util.webview();
      if(viewStr == 'other'){
        this.isShowTitle = true;
      }else{
        this.isShowTitle = false;
      }
    },
    guanbi(){
      this.toOtherView =true;
    },
    switchType(type){//切换支付方式
      let that =this;
      if(type == 5){
        if(that.orderObj.stagingDto.isUseStaging == 1){
          Toast('该笔订单不支持花呗分期支付!');
        }else{
          that.payType = type;
          that.tcShow=true;
        }
      }else{
        that.payType = type;
      }
    },
    pay(){//支付
      let that =this,payModel=0;
      if(!that.payType){
        Toast('请选择支付方式！');
        return;
      }else{
        payModel = that.payType;
      }
      if(that.webType == 'weixin' && payModel != 2){//在微信里面支付宝
        that.toOtherView =false;
        return;
      }else if(that.webType == 'zhifupay' && payModel == 2){//在支付宝里面微信支付
        that.toOtherView =false;
        return;
      }
      let data = {
        "orderId": that.orderId,//(描述：订单id、类型：Long、是否必填：Y)
        "payModel": payModel,//(描述：支付方式 2 微信 3 支付宝 5 花呗分期、类型：Integer、是否必填：Y)
        "code":that.code,
      };
      if(that.huabeiStr.itemStagingNum){
        data.fqNum = that.huabeiStr.itemStagingNum;
      }
      let urlStr = util.getpost(data);
      if(payModel == 2){//微信支付
        that.weixin(data,urlStr)
      }else{//支付宝支付
        that.zhifubao(data,urlStr);
      }
    },
    weixin(data,urlStr){
      let that =this;
      let webType = util.webview();
      if(webType == 'weixin'){
        if(!that.code){//没有code
          let urlStr='http://m.jingjie100.com/#/orderPayment?orderId='+that.orderId+'&VUE2SESSID='+encodeURIComponent(Cookies.get('VUE2SESSID'));
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+that.appid+'&redirect_uri='+encodeURIComponent(urlStr)+'&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
        }else{//有code
          let that =this;
          axios({
            method:"post",
            url:"/order/mwebPay"+urlStr,
            dataType: 'json', 
            data:data,
          }).then(response => {
            if(response.data.status == 0){
              let obj = JSON.parse("{"+response.data.body.payInfo+"}");
              that.jsonObj = obj;
              if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {//苹果手机上微信中微信支付
                WeixinJSBridge.invoke('getBrandWCPayRequest', obj, function(res) {
                  if (res.err_msg == 'get_brand_wcpay_request:ok') {//支付成功或失败前台判断
                    that.$router.push({name:'paymentResults',query:{orderId:data.orderId,payModel:2,fqNum:'',fqSellerPercent:''}});
                  }else{
                    that.$router.go(-1);
                  }
                });
              } else if (/(Android)/i.test(navigator.userAgent)) {
                if(typeof WeixinJSBridge == "undefined"){
                  if(document.addEventListener){
                    document.addEventListener('WeixinJSBridgeReady', that.jsApiCall, false);
                  }else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', that.jsApiCall);
                    document.attachEvent('onWeixinJSBridgeReady', that.jsApiCall);
                  }                     
                }else{
                  that.jsApiCall();
                }
              } else {
                alert('请在手机上打开网址！');
              };
            }else{
              if(response.data.status == 499){
                that.$router.push({name:'signInPage',query:{outLogin:'/'}});
              }else{
                MessageBox('系统提示',response.data.message);
              }
            }
          }).catch(oData => {
            MessageBox('系统提示',oData.data.message);
          })
        }
      }else{//非微信浏览器
        axios({
          method:"post",
          url:"/order/mwebPay"+urlStr,
          dataType: 'json', 
          data:data,
        }).then(response => {
          if(response.data.status == 0){
            if(webType == 'zhifupay'){//在支付宝浏览器
              
            }else{//非微信浏览器，可直接跳转支付宝支付
              window.location.href =response.data.body.mweb_url;
            }
          }else{
            if(response.data.status == 499){
              that.$router.push({name:'signInPage',query:{outLogin:'/'}});
            }else{
              MessageBox('系统提示',response.data.message);
            }
          }
        }).catch(oData => {
          MessageBox('系统提示',oData.data.message);
        })
      }
    },
    jsApiCall(){
      WeixinJSBridge.invoke('getBrandWCPayRequest', this.jsonObj, function(res) {
        if (res.err_msg == 'get_brand_wcpay_request:ok') {//支付成功或失败前台判断
          that.$router.push({name:'paymentResults',query:{orderId:data.orderId,payModel:2,fqNum:'',fqSellerPercent:''}});
        }else{
          window.history.go(-1);
        }
      });
    },
    zhifubao(data,urlStr){
      let that =this;
      axios({
        method:"post",
        url:"/order/mwebPay"+urlStr,
        dataType: 'json', 
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          let webType = util.webview();
          if(webType == 'weixin'){//在微信浏览器中点击支付宝支付（指示使用别的浏览器）
            
          }else{//非微信浏览器，可直接跳转支付宝支付
            if(that.payType == 5){//花呗
              that.str = response.data.body.url.split('<script>')[0];
            }else{
              that.str = response.data.body.form.split('<script>')[0];
            }
            setTimeout(function(){
              document.forms[0].submit();
            },500);
          }
        }else{
          if(response.data.status == 499){
            that.$router.push({name:'signInPage',query:{outLogin:'/'}});
          }else{
            MessageBox('系统提示',response.data.message);
          }
        }
      }).catch(oData => {
        // MessageBox('系统提示',oData.data.message);
      })
    },

    clickThisLI(e,obj,index){//花呗切换事件
      let that =this;
      if(e.srcElement.className.indexOf('activeli')>=0){}else{
        var cls = document.getElementsByClassName('activeli');
        if(cls[0]){
          cls[0].className = '';
          that.huabeiStr={};
        }
        e.currentTarget.className = 'activeli';
        that.huabeiStr=obj;
      }
    },
    ajaxPayinfo(){//请求订单的基本信息
      let that =this;
      let data = {"orderId":that.orderId};
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/order/payInfo"+urlStr,
        dataType: 'json', 
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          that.orderObj = response.data.body;
          that.orderPrice = response.data.body.realPay;
          that.orderTime = response.data.body.createTime;
          that.orderNo = response.data.body.orderNo;
          that.appid = response.data.body.appid;
          let timeArr = that.orderTime.split(' ')[1].split(':');
          let nowTime = new Date();
          let fenzhong = ((nowTime.getHours()-timeArr[0])*60)+(nowTime.getMinutes()-timeArr[1]);
          that.shenyufenzhogn = 120-fenzhong;
          if(that.$route.query.RemainingTime){//尾款支付
            that.TailMoneytimerFunc(that.$route.query.RemainingTime);
          }else{
            that.timerFunc(that.shenyufenzhogn);
          }
        }else{
          if(response.data.status == 499){
            that.isShowData=false;
            that.$router.push({name:'signInPage',query:{outLogin:'/'}});
          }else{
            that.isShowData=false;
            MessageBox('系统提示',response.data.message);
          }
        }
      }).catch(oData => {
        that.isShowData=false;
        MessageBox('系统提示',oData.data.message);
      })
    },
    timerFunc(timeBig){//普通订单支付
      let that =this;
      that.count = timeBig*60;
      that.timer = setInterval(() => {
        if (that.count > 0 && that.count <= timeBig*60) {
          that.count --;
          let yu = that.count%60;
          let fen = (that.count-yu)/60;
          if(fen>60){
            that.timeStr = '1小时'+(fen-60)+'分钟'+yu+'秒';
          }else{
            that.timeStr = fen+'分钟'+yu+'秒';
          }
        } else {
          clearInterval(that.timer);
          that.timer = null;
        }
      }, 1000)
    },
    TailMoneytimerFunc(timeBig){//尾款订单支付
      let vm =this;
      vm.count = timeBig;
      vm.timer = setInterval(() => {
        if (vm.count > 0 && vm.count <= timeBig) {
          vm.count --;
          if(vm.count<60){//秒
              vm.timeStr = '0天0时0分钟'+vm.count+'秒';
          }else if(vm.count>=60 && vm.count<3600){//分
              vm.timeStr = '0天0时'+(vm.count-vm.count%60)/60+'分种'+vm.count%60+'秒';
          }else if(vm.count>=3600 && vm.count<86400){//时
              vm.timeStr = '0天'+(vm.count-vm.count%3600)/3600+'时'+(vm.count%3600-(vm.count%3600)%60)/60+'分钟'+(vm.count%3600)%60+'秒';
          }else if(vm.count>=86400){//天
              vm.timeStr = (vm.count-vm.count%86400)/86400+'天'+(vm.count%86400-(vm.count%86400)%3600)/3600+'时'+(((vm.count%86400)%3600)-((vm.count%86400)%3600)%60)/60+'分钟'+((vm.count%86400)%3600)%60+'秒';
          }
        } else {
          clearInterval(vm.timer);
          vm.timer = null;
        }
      }, 1000)
    },
    lookMone(){//关闭弹窗
      if(!this.huabeiStr.terminallyPay){
        Toast('请选择分期数！');
        return;
      }
      this.tcShow=false;
    },
  },

  updated(){
    if(document.forms[0]){
      document.forms[0].submit();
    }
  },
  deactivated(){
    console.log(1897);
  },
};  
</script>  
  
<style lang="less" scoped>   
  @import '../../assets/less/orderPayment.less';
  .mask{
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.5;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100000;
  }
  .tishi{
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100001;
    .tishi_one{
      width: 95%;
    }
    .tishi_two{
      width: 1rem;
      height: .34rem;
    }
  }
</style> 











