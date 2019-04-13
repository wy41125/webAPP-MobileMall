<template>  
  <div class="orderPayment">  
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'晶杰收银台'"></headers>
    <p class="prompt" :style="$store.state.titleShow?'margin-top:.4rem':''">订单已经提交！请在<i>{{timeStr}}</i>内完成支付。</p>
    <div class="order">
      <p><span>订单编号</span>{{orderNo}}</p>
      <p><span>下单时间</span>{{orderTime}}</p>
      <p><span>代付金额</span>¥{{(orderPrice/100).toFixed(2)}}</p>
    </div>
    <div class="orderType">
      <p>请选择支付方式</p>
      <p @click.stop="switchType(3)"><i></i>支付宝<b :class="payType==3?'active':''"></b></p> 
      <p @click.stop="switchType(2)"><i></i>微信支付<b :class="payType==2?'active':''"></b></p> 
      <p @click.stop="switchType(5)"><i></i><em v-if="huabeiStr.terminallyPay" v-text="huabeiStr.terminallyPay+'x'+huabeiStr.itemStagingNum+'期'"></em><b :class="payType==5?'active':''"></b></p> 
    </div>
    <div class="footer_botton">
      <span  @click.stop="pay()">立即付款</span>
    </div>
    <!-- 花呗弹窗 -->
    <mt-popup v-model="tcShow" class="tanchuang" position="bottom">
      <div class="tcTongyi huabei">
          <p class="title">花呗分期<i @click.stop="lookMone"></i></p>
          <ul>
            <li v-if="orderObj.stagingDto.isUseStaging !=1" v-for="staging in orderObj.stagingDto.stagingItemList" @click.stop="clickThisLI($event,staging)">
              <span>{{staging.terminallyPay}}x{{staging.itemStagingNum}}期</span>
              <span v-text="staging.isStaging ==0?'免息，无服务费':'含利息'+staging.poundageCost+'/期'"></span>
            </li>
          </ul>
          <button @click.stop="lookMone">确定</button>
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
    };  
  },
  components:{
    headers:headers,
  },
  created(){
    util.setTitle('晶杰收银台');
    let millisecond = new Date().getTime(); 
    let expiresTime = new Date(millisecond + 60 * 1000 * 60 * 24 * 15);
    let str = this.$route.params.id;
    let obj = JSON.parse(str);
    Cookies.set('VUE2SESSID', decodeURIComponent(obj.VUE2SESSID), {expires: expiresTime} );
    this.webType = util.webview();
    this.orderId = obj.orderId;
    let urlStr = window.location.href;
    if(urlStr.indexOf('code')>=0){
      this.code = urlStr.split('?')[1].split('&')[0].split('=')[1];
      this.payType = 2;
      this.pay();
    }else{
      this.ajaxPayinfo(this.orderId);
    }
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
  },
  methods:{
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

      
      
      // this.$router.replace({name:'paymentResults'});
    },
    weixin(data,urlStr){
      let that =this;
      let webType = util.webview();
      if(webType == 'weixin'){
        alert(that.code);
        if(!that.code){//没有code
          let urlStr='http://m.dripop.com/#/orderPayment?orderId='+that.orderId+'&VUE2SESSID='+encodeURIComponent(Cookies.get('VUE2SESSID'));
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
              window.location.href =response.data.body.payInfo;
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
              alert("支付宝浏览器中使用微信支付，未处理，");
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
            alert("微信浏览器中点击支付宝支付，未处理，请在别的浏览器中使用支付！");
          }else{//非微信浏览器，可直接跳转支付宝支付
            if(that.payType == 5){//花呗
              that.str = response.data.body.url.split('<script>')[0];
            }else{
              that.str = response.data.body.form.split('<script>')[0];
            }
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
    },
    clickThisLI(e,obj){//花呗切换事件
      let that =this;
      if(e.srcElement.className.indexOf('active')>=0){
        e.currentTarget.className = '';
        that.huabeiStr={};
      }else{
        e.currentTarget.className = 'active';
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
          that.timerFunc(that.shenyufenzhogn);
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
    timerFunc(timeBig){
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
  }
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
















<template>  
  <div class="confirmationOrder">  
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'确认订单'"></headers>
    <!-- 配送方式 -->
    <div class="Distribution" :style="$store.state.titleShow?'margin-top:.4rem':''">
      <div class="changeButton">
        <p>配送方式</p>
        <p>
          <span :class="isShowData?'active':''" @click.stop="changeDelivery(1)">送货上门</span>
          <span :class="!isShowData?'active':''" @click.stop="changeDelivery(2)">到店自提</span>
        </p>
      </div>
      <div class="addressStore" v-if="isShowData" @click.stop="$router.push({name:'addlessList',query:{source:'order'}})">
        <p v-if="haveAdd">{{AddObj.name}} {{AddObj.phoneNo}}</p>
        <p v-if="haveAdd">{{AddObj.province}}{{AddObj.city}}{{AddObj.county}}{{AddObj.address}}</p>
        <p style="color:#999;" v-if="!haveAdd">请选择收货地址</p>
      </div>
      <div class="addressStore" v-if="!isShowData" @click.stop="storeDataProcessing">
        <p v-if="haveAdd2">{{AddObj2.orgName}} {{AddObj2.phoneNo}}</p>
        <p v-if="haveAdd2">{{AddObj2.province}}{{AddObj2.city}}{{AddObj2.county}}{{AddObj2.address}}</p>
        <p style="color:#999;" v-if="!haveAdd2">请选择门店</p>
      </div>
      <div class="zititime" v-if="!isShowData">
        <p>
          <em>自提时间</em>
          <el-date-picker v-model="value1" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini"> </el-date-picker>
        </p>
        
      </div>
    </div> 
    <!-- 订单信息 -->
    <div class="order">
      <p class="order_title">订单信息</p>
      <div class="order_goods"> 

        <div class="good_div" v-for="(good,index) in xuanzhongGood" v-if="!good.goodsList" :style="index == xuanzhongGood.length-1?'border:0px solid #ddd;':''">
          <div class="goodXinxi">
            <div class="goodXinxi_img">
              <img :src="good.imgUrl" alt="">
            </div>
            <div class="goodXinxi_name">
              <p>{{good.goodsName}}</p>
              <p>¥{{(good.salePrice/100).toFixed(2)}}<i>x{{good.TotalCommodity/good.salePrice}}</i></p>
            </div>  
          </div>
          <p class="gift" v-if="good.giftList.length>0" v-for="gift in good.giftList">【赠品】 {{gift.goodsName}}<i>x{{gift.num*(good.TotalCommodity/good.salePrice)}}</i></p>
        </div>

        <div class="good_div" v-for="good in xuanzhongGood" v-if="good.goodsList">
          <p class="package_p"><i>优惠套餐</i>{{good.packageName}}</p>
          <div class="goodXinxi" v-for="list in good.goodsList">
            <div class="goodXinxi_img">
              <img :src="list.imgUrl">
            </div>
            <div class="goodXinxi_name">
              <p>{{list.goodsName}}</p>
            </div>  
          </div>
          <p class="setPrice">¥{{(good.price/100).toFixed(2)}}<i>x{{good.TotalCommodity/good.price}}</i></p>
          <p class="gift" v-if="good.giftList.length>0" v-for="gift in good.giftList">【赠品】 {{gift.goodsName}}<i>x{{gift.num*(good.TotalCommodity/good.price)}}</i></p>
        </div>

      </div>

    </div>
    <!-- 订单其余信息 -->
    <div class="other">
      <p class="other_p hasmone" @click.stop="$router.push({name:'invoice'})">发票信息 <span >{{invoiceStr}}</span></p>
      <p class="other_p hasmone" @click.stop="cardDataProcessing">优惠券<span>{{cardStr}}</span></p>
      <div class="other_p">
        <p>订单金额 <span class="red">¥{{(Total/100).toFixed(2)}}</span></p>
        <p>优惠 <span class="red">¥{{PreferentialAmount}}</span></p>
      </div>
    </div>
    <!-- footer_botton -->
    <div class="footer_botton">
      <p>实付款 <i class="red">¥{{((Total-PreferentialAmount)/100).toFixed(2)}}</i></p>
      <span @click.stop="placeOrder">提交订单</span>
    </div>
  </div>  
</template>  
  
<script>  
import {Toast,MessageBox} from 'mint-ui' 
import headers from '../headers.vue'
import Cookies from 'js-cookie';
import util from '@/libs/util' 
import axios from 'axios'
export default {  
  name: 'confirmationOrder',  
  data() {  
    return {  
       isShowData:null,//收货方式控制
       value1:'',//时间选择器时间
       xuanzhongGood:[],
       daixuanGood:[],
       ajaxArr:[],//请求卡券商品集合
       invoiceStr:'',//发票字符串
       cardStr:'',//优惠券显示字符串
       haveAdd:false,//默认本地没保存地址
       AddObj:{},
       haveAdd2:false,//默认本地没保存地址
       AddObj2:{},
       Total:null,//订单金额
       PreferentialAmount:0,//优惠金额
       cardObj:{},//选中优惠券对象
       invoiceStrObj:{},//发票对象
       arrOBJ:[],
    };  
  },
  components:{
    headers:headers,
  },
  methods:{ 
    changeDelivery(type){//收货方式切换
      if(type == 1){
        this.isShowData = true;
        window.sessionStorage.setItem('Display','shsm');
      }else{
        this.isShowData = false;
        window.sessionStorage.setItem('Display','ddzt');
      }
    }, 
    DefaultDisplay(){//默认显示收货方式
      if(window.sessionStorage.getItem('Display')){
        if(window.sessionStorage.getItem('Display') == 'shsm'){
          this.isShowData = true;
        }else{
          this.isShowData = false;
        }
      }else{
        this.isShowData = true;
      }
    },
    placeOrder(aaaaaa){//提交订单
      let that =this,data={},cookieStr=Cookies.get('VUE2SESSID');
      if(that.isShowData){
        if(!that.AddObj.name){
          Toast('请补充收货地址！');
          return;
        }
      }else{
        if(!that.AddObj2.orgName){
          Toast('请补充门店地址！');
          return;
        }
        if(that.value1 == ''){
          Toast('请选择自提时间！');
          return;
        }
      }
      // if(!that.invoiceStrObj.needInvoice){
      //   Toast('请补充发票信息！');
      //   return;
      // }
      if(!Cookies.get('VUE2SESSID')){
        this.$router.push({name:'signInPage'});
        return;
      }
      if(that.cardObj.cardId){
        data.userCardId = that.cardObj.cardId;
      }
      if(that.isShowData){//送货上门
        data.shoppingModel = 2;//(描述：送货方式（2.寄送 3.上门自提）、类型：Integer、是否必填：Y)
        data.addressId = Number(that.AddObj.addrId);//(描述：收货地址Id、类型：Long、是否必填：Y)
        data.orderChannel = 3;//(描述：下单渠道（3.H5，4.IOS,5.安卓）、类型：Integer、是否必填：Y)
        data.needInvoice = that.invoiceStrObj.needInvoice;//(描述：是否发票（1,。需要，2.不需要）、类型：Integer、是否必填：Y)
        data.invoiceContent = that.invoiceStrObj.invoiceContent;//  (描述：发票内容、类型：String、是否必填：Y)
        data.invoiceName = that.invoiceStrObj.invoiceName;//  (描述：发票抬头、类型：String、是否必填：Y)
        data.invoiceNumber = that.invoiceStrObj.invoiceNumber;//  (描述：纳税人识别号（单位发票传，个人发票没有不传）、类型：String、是否必填：Y)
        data.companyName = that.invoiceStrObj.companyName;//  (描述：发票单位名称（单位发票传，个人发票没有不传）、类型：String、是否必填：Y)
      }else{
        data.shoppingModel = 3;
        data.storeId = Number(that.AddObj2.orgId);
        data.pickupTime = that.value1;
        data.orderChannel = 3;
        data.needInvoice = that.invoiceStrObj.needInvoice;
        data.invoiceContent = that.invoiceStrObj.invoiceContent;
        data.invoiceName = that.invoiceStrObj.invoiceName;
        data.invoiceNumber = that.invoiceStrObj.invoiceNumber;
        data.companyName = that.invoiceStrObj.companyName;
      }
      if(!aaaaaa.isTrusted){
        data.goods = aaaaaa;
      }else{
        that.arrOBJ = that.returnObj(1);
        data.goods = that.arrOBJ;
      }
      console.log(data);
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/order/sureOrder"+urlStr,
        dataType: 'json', 
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          let obj = {
            orderId:response.data.body.orderId,
            VUE2SESSID:encodeURIComponent(cookieStr)
          };
          let str = JSON.stringify(obj);
          that.$router.push({name:'orderPayment',params:{id:str}});
        }else{
          if(response.data.status == 499){
            that.$router.push({name:'signInPage',query:{outLogin:'/'}});
          }else if(response.data.status == 101){
            MessageBox.confirm(response.data.message).then(action => {
              that.jianquId(response.data.body.giftId);
            });
          }else{
            MessageBox('系统提示',response.data.message);
          }
        }
      }).catch(oData => {
        // MessageBox('系统提示',oData.data.message);
      })
    },
    jianquId(id){
      let that =this;
      let objArr = that.returnObj(1);
      for(let i in objArr){
        if(objArr[i].giftIds.indexOf(id)>=0){
          var reg = new RegExp(id,"g");
          var a = objArr[i].giftIds.replace(reg,"");
          objArr[i].giftIds = a;
        }
      }
      that.arrOBJ = objArr;
      that.placeOrder(objArr);
    },
    returnObj(type){//数据格式处理
      let arr = [],that=this;
      if(type == 1){
        for(let i in that.xuanzhongGood){
          let obj={},str='';
          if(that.xuanzhongGood[i].goodsList){
            obj.packageId = that.xuanzhongGood[i].packageId;
            obj.num = (that.xuanzhongGood[i].TotalCommodity/that.xuanzhongGood[i].price);
          }else{
            obj.onlineId = that.xuanzhongGood[i].onlineId;
            obj.num = (that.xuanzhongGood[i].TotalCommodity/that.xuanzhongGood[i].salePrice);
          }
          for(let b=0 ;b<that.xuanzhongGood[i].giftList.length ;b++){
            if(b == that.xuanzhongGood[i].giftList.length-1){
              str+=that.xuanzhongGood[i].giftList[b].giftId;
            }else{
              str+=that.xuanzhongGood[i].giftList[b].giftId+",";
            }
          }
          // obj.giftIds='86';
          obj.giftIds=str;
          arr.push(obj);
        }
      }else{
        for(let i in that.xuanzhongGood){
          let obj={},str='';
          if(that.xuanzhongGood[i].goodsList){
            obj.id = that.xuanzhongGood[i].packageId;
            obj.type = 2;
          }else{
            obj.id = that.xuanzhongGood[i].onlineId;
            obj.type = 1;
          }
          arr.push(obj);
        }
      }
      
      return arr;
    },
    dataProcessing(){//初始化数据处理
      if(this.$route.query.source){
        let newarr = [],newObj={},obj={};
        if(window.sessionStorage.getItem('orderGoods')){
          let str = window.sessionStorage.getItem('orderGoods');
          newObj = JSON.parse(str);
          obj['id']=newObj.id;
          obj['type']=newObj.type;
          obj['num']=Number(newObj.TotalCommodity/newObj.salePrice);
          newarr.push(obj)
          this.ajaxGoodData(newarr,newObj);
        }
      }else{
        if(window.sessionStorage.getItem('orderGoods')){
          let str = window.sessionStorage.getItem('orderGoods');
          let arr = str.split('&&'),newArr=[];
          for(let i in arr){
            let obj = JSON.parse(arr[i]);
            newArr.push(obj);
            this.Total += obj.TotalCommodity;
          }
          this.xuanzhongGood = newArr;
        }
      }
    },
    
    ajaxGoodData(arr,obj){
      let that =this;
      let data = arr;
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/goods/open/shoppingCart"+urlStr,
        dataType: 'json', 
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          if(response.data.body.length>=0){
            obj.giftList = response.data.body[0].giftList;
            that.xuanzhongGood.push(obj);
            that.Total += obj.TotalCommodity;
          }else{
          }
        }else{
          if(response.data.status == 499){
            that.$router.push({name:'signInPage',query:{outLogin:'/'}});
          }else{
            MessageBox('系统提示',response.data.message);
          }
        }
      }).catch(oData => {
        that.isShowData=false;
        MessageBox('系统提示',oData.data.message);
      })
    },
    invoice(){//发票信息处理
      if(window.sessionStorage.getItem('invoice')){
        let str = window.sessionStorage.getItem('invoice');
        this.invoiceStrObj = JSON.parse(str);
        if(this.invoiceStrObj.needInvoice == 2){
          this.invoiceStr = '不需要发票';
        }else{
          if(this.invoiceStrObj.invoiceContent != ''){
            this.invoiceStr = '纸质（商品明细 - '+this.invoiceStrObj.invoiceName+'）';
          }else{
            this.invoiceStr = '纸质（'+this.invoiceStrObj.invoiceName+'）';
          }
        }
      }else{
        this.invoiceStr = '补充发票信息';
        let obj = {
          companyName:"",invoiceContent:"",invoiceName:"",invoiceNumber:"",needInvoice:2
        };
        this.invoiceStrObj = obj;
      }
    },
    huoquAdd(){//获取地址(two)
      if(window.sessionStorage.getItem('addStr')){
        let str = window.sessionStorage.getItem('addStr');
        this.AddObj = JSON.parse(str);
        this.haveAdd = true;
      }else{
        this.ajaxAddress();
      }
      if(window.sessionStorage.getItem('storeStr')&&window.sessionStorage.getItem('storeStr')!=''){
        let str = window.sessionStorage.getItem('storeStr');
        this.AddObj2 = JSON.parse(str);
        this.haveAdd2 = true;
      }else{
        this.AddObj2={};
        this.haveAdd2 = false;
      }
    },
    huoquCard(){//卡券(优惠券)字符串默认显示事件
      if(window.sessionStorage.getItem('cardStr')){
        let str = window.sessionStorage.getItem('cardStr');
        if(str!='无'){//有可用的具体卡券
          this.cardObj = JSON.parse(str);
          if(this.cardObj.cardType ==1){//满减券
            this.cardStr='满'+this.cardObj.minUsePrice+'减'+this.cardObj.cardVal+'元';
          }else{
            this.cardStr='满'+this.cardObj.minUsePrice+'享'+this.cardObj.cardVal+'折';
          }
          this.ajaxPreferentialAmount(this.cardObj.cardId);
        }else{
          this.cardStr='暂无可用优惠券';
        }
      }else{
        this.cardStr='选择优惠券';
      }
    },
    storeDataProcessing(){//处理自提门店接口请求需要的数据
      var arr = this.returnObj(1),urlStr='';
      for(let i in arr){
        if(i == arr.length-1){
          urlStr+=JSON.stringify(arr[i]);
        }else{
          urlStr+=JSON.stringify(arr[i])+'&&';
        }
      }
      window.sessionStorage.setItem('storeData',urlStr);
      this.$router.push({name:'storePage',query:{source:'order'}});
    },
    cardDataProcessing(){//处理优惠券请求需要的数据
      let arr = this.returnObj(2),urlStr='';
      for(let i in arr){
        if(i == arr.length-1){
          urlStr+=JSON.stringify(arr[i]);
        }else{
          urlStr+=JSON.stringify(arr[i])+'&&';
        }
      }
      window.sessionStorage.setItem('cardData',urlStr);
      if(Cookies.get('VUE2SESSID')){
        this.$router.push({name:'ordercard',query:{source:'order'}});
      }else{
        this.$router.push({name:'signInPage'});
      }
    },
    ajaxPreferentialAmount(id){//优惠金额获取
      let arr = this.returnObj(1),that =this;
      let data = {
        cardId:id,
        goodsList:arr
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/order/cardPrice"+urlStr,
        dataType: 'json', 
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          that.PreferentialAmount=response.data.body.cardPrice;
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
    },
    eliminateShopGood(arr){//订单下单完成后，消除购物车本地某商品
      let shopCard=[],shopArr = localStorage.getItem("shoppingCard").split(',');
      for(let i in shopArr){
        for(let b in arr){
          if(shopArr[i].indexOf(arr[b].onlineId)>=0){
            shopArr.splice(i,1);
          }
        }
      }
      localStorage.setItem("shoppingCard",shopArr);
    },
    ajaxAddress(){//查询地址列表
      let that =this;
      let data = {};
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/deliverAddr/list"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          if(response.data.body.length > 0){//客户有收货地址
            that.AddObj = response.data.body[0];
            that.haveAdd = true;
          }else{//没有收货地址
            that.AddObj = {};
            that.haveAdd = false;
          }
        }else{
          if(response.data.status = 499){//token失效或没有token
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
    this.dataProcessing();
    this.invoice();
    this.huoquAdd();
    this.DefaultDisplay();
    this.huoquCard();
    util.setTitle('确认订单');
  },
  watch:{
    
  }
};  
</script>  
  
<style lang="less" scoped>   
  @import '../../assets/less/confirmationOrder.less';
</style> 


















