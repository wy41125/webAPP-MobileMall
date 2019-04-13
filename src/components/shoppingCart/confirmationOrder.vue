<template>  
  <div class="confirmationOrder">  
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'确认订单'"></headers>
    <!-- 配送方式 -->
    <div class="Distribution" :style="$store.state.titleShow?'margin-top:.4rem':''">
      <div class="changeButton">
        <p>配送方式</p>
        <p>
          <span v-if="cansonghuo" :class="isShowData?'active':''" @click.stop="changeDelivery(1)">送货上门</span>
          <span v-if="canziti" :class="!isShowData?'active':''" @click.stop="changeDelivery(2)">到店自提</span>
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
      <div class="zititime" v-if="!isShowData && showTime">
        <p>
          <em>自提时间</em> 
          <el-date-picker
            v-model="value1"
            type="date" 
            placeholder="请选择自提时间" 
            size="mini" 
            @change="timeChange" 
            :picker-options="pickerOptions1">
          </el-date-picker>
        </p>
        
      </div>
    </div> 
    <!-- 订单信息 -->
    <div class="order">
      <p class="order_title">订单信息</p>
      <div class="order_goods"> 

        <div class="good_div nopackage" v-for="(good,index) in xuanzhongGood" v-if="!good.goodsList">
          <div class="goodXinxi">
            <div class="goodXinxi_img">
              <img :src="good.imgUrl" alt="">
            </div>
            <div class="goodXinxi_name">
              <p>{{good.goodsName}}</p>
              <p v-if="!(good.goodsSellType && good.goodsSellType != 1)">¥{{(good.salePrice/100).toFixed(2)}}<i>x{{good.TotalCommodity/good.salePrice}}</i></p>
              <p v-if="good.goodsSellType && good.goodsSellType != 1">{{good.presellMoneyStr}}<i>x{{good.ObjNumber}}</i></p>
            </div>  
          </div>
          <p class="gift" v-if="good.giftList.length>0 && !(good.goodsSellType && good.goodsSellType != 1)" v-for="gift in good.giftList">【赠品】 {{gift.goodsName}}<i>x{{gift.num*(good.TotalCommodity/good.salePrice)}}</i></p>
          <p class="gift" v-if="good.giftList.length>0 && (good.goodsSellType && good.goodsSellType != 1)" v-for="gift in good.giftList">【赠品】 {{gift.goodsName}}<i>x{{gift.num*good.ObjNumber}}</i></p>
        </div>

        <div class="good_div " v-for="good in xuanzhongGood" v-if="good.goodsList">
          <p class="package_p"><i>优惠套餐</i>{{good.packageName}} <span class="setPrice">¥{{(good.price/100).toFixed(2)}}<b>x{{good.TotalCommodity/good.price}}</b></span></p>
          <div class="goodXinxi" v-for="(list,i) in good.goodsList" :style="i==good.goodsList.length-1?'border:0px solid #ececec;':''">
            <div class="goodXinxi_img">
              <img :src="list.imgUrl">
            </div>
            <div class="goodXinxi_name">
              <p>{{list.goodsName}}</p>
            </div>  
          </div>
          <!-- <p class="setPrice"></p> -->
          <p class="gift" v-if="good.giftList.length>0" v-for="gift in good.giftList">【赠品】 {{gift.goodsName}}<i>x{{gift.num*(good.TotalCommodity/good.price)}}</i></p>
        </div>

      </div>

    </div>
    <!-- 订单其余信息 -->
    <div class="other" :style="(xuanzhongGood[0].goodsSellType && xuanzhongGood[0].goodsSellType == 2)?'':'margin-bottom: 0.6rem;'">
      <p class="other_p hasmone" @click.stop="$router.push({name:'invoice'})">发票信息 <span >{{invoiceStr}}</span></p>
      <p class="other_p hasmone" @click.stop="cardDataProcessing" v-if="!(xuanzhongGood[0].goodsSellType && xuanzhongGood[0].goodsSellType != 1)">优惠券<span>{{cardStr}}</span></p> 
      <div class="other_p" v-if="xuanzhongGood[0].goodsSellType == 1 || xuanzhongGood[0].goodsSellType == 4">
        <p>订单金额 <span class="red">¥{{(Total/100).toFixed(2)}}</span></p>
        <p>优惠 <span class="red">¥{{PreferentialAmount/100}}</span></p>
      </div>
    </div>

    <div v-if="xuanzhongGood[0].goodsSellType && xuanzhongGood[0].goodsSellType == 2" style="margin-bottom: 0.6rem;">
      <!-- 预售订单信息 -->
      <div class="PreSaleOrder">
        <p class="title">订单金额</p> 
        <div class="jieduan">
          <div class="phaseOne selectStage"> 
            <p class="one_p" :style="(xuanzhongGood[0].depositMark && xuanzhongGood[0].depositMark != '')?'':'line-height:.3rem;'"><em class="icon_em"><b class="icon_b"></b><i class="icon_i"></i></em></em>定金 <span>小计：{{((xuanzhongGood[0].deposit*xuanzhongGood[0].ObjNumber)/100).toFixed(2)}}</span></p>
            <p class="two_p">{{xuanzhongGood[0].depositMark}}</p>
          </div>
          <div class="phaseTwo">
            <p class="one_p" :style="(xuanzhongGood[0].finalMoneyMark && xuanzhongGood[0].finalMoneyMark != '')?'':'line-height:.3rem;'">
              <em class="icon_em"><b class="icon_b"></b><i class="icon_i"></i></em></em>尾款 <span>小计：<em v-text="xuanzhongGood[0].finalMoney?((xuanzhongGood[0].finalMoney*xuanzhongGood[0].ObjNumber)/100).toFixed(2):'¥待发布'"></em></span>
            </p>
            <p class="two_p" v-show="xuanzhongGood[0].finalMoneyMark && xuanzhongGood[0].finalMoneyMark != ''">{{xuanzhongGood[0].finalMoneyMark}}</p>
          </div>
        </div>
        
        <p class="TotalPrice"><span>总计：<em v-text="xuanzhongGood[0].finalMoney?(((xuanzhongGood[0].deposit+xuanzhongGood[0].finalMoney)*xuanzhongGood[0].ObjNumber)/100).toFixed(2):'¥待发布'"></em></span><br style="clear:both;"></p>
      </div>
      <div class="checkOut" v-if="xuanzhongGood[0].isRejectedDeposit == 0">
        <p>同意支付定金<em>（预售商品，定金不可退哦！）</em></p>
        <el-switch class="bottom" v-model="value2" active-color="#3c3c3c" inactive-color="#999" width="30"></el-switch>
      </div>
    </div>
    
    <!-- footer_botton -->
    <div class="footer_botton">
      <p v-if="$route.query.sourcePage">应付定金<i class="red">¥{{((xuanzhongGood[0].deposit*xuanzhongGood[0].ObjNumber)/100).toFixed(2)}}</i></p>
      <p v-if="!$route.query.sourcePage">应付金额<i class="red">¥{{((Total-PreferentialAmount)/100).toFixed(2)}}</i></p>
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
      xuanzhongGood:[],//数组对象（订单商品s信息）
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
      cansonghuo:true,//可以送货上门
      canziti:true,//可以上门自提
      value2:false,//预售订单定金不可退情况下默认关闭
      pickerOptions1:{
        disabledDate: date=> {
          return date && (date.valueOf() < this.startDate) || (date.valueOf() > this.endDate);
        }
      },
      startDate:'',
      endDate:'',
      showTime:false,//默认不显示自提时间
    };  
  },
  components:{
    headers:headers,
  },
  created(){
    util.toTop();
    this.dataProcessing();
    this.invoice();
    this.huoquAdd();
    this.DefaultDisplay();
    this.huoquCard();
    util.setTitle('确认订单');
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
  },
  mounted(){
    this.timeChange();
    if(window.sessionStorage.getItem('storeStr')&&window.sessionStorage.getItem('storeStr')!=''){
      
    }
  },
  watch:{
    
  },
  methods:{
    timeChange(){//自提时间确认时间判断
      let vm = this; 
      
      if(vm.$route.query.sourcePage){//预售订单下单 
        let dateobj = new Date(vm.xuanzhongGood[0].balancePaymentEndTime);
        vm.endDate = Number(dateobj.getTime())+1000*60*60*24*27;
        vm.startDate = Number(dateobj.getTime());
      }else{//普通商品下单
        if(vm.xuanzhongGood[0].goodsSellType == 4){
          let dateobj = new Date(vm.xuanzhongGood[0].presellEndTime);
          vm.endDate = Number(dateobj.getTime())+1000*60*60*24*27;
          vm.startDate = Number(dateobj.getTime());
        }else{
          let nowTimes = new Date();
          let year = nowTimes.getFullYear();    //获取完整的年份(4位,1970-????)
          let month = (Number(nowTimes.getMonth())+1)<10?'0'+(Number(nowTimes.getMonth())+1):(Number(nowTimes.getMonth())+1);       //获取当前月份(0-11,0代表1月)
          let date = Number(nowTimes.getDate())<10?'0'+Number(nowTimes.getDate())+1:Number(nowTimes.getDate())+1;        //获取当前日(1-31)
          let dateobj = new Date(year+'-'+month+'-'+date+' 00:00:00');
          if(window.sessionStorage.getItem('storeStr')&&window.sessionStorage.getItem('storeStr')!=''){////普通商品选择门店
            let str = window.sessionStorage.getItem('storeStr');
            let storeobj = JSON.parse(str);
            if(storeobj.stock>0){//选择门店有货，可选择今天
              vm.endDate = Number(dateobj.getTime())+1000*60*60*24*26;
              vm.startDate = Number(dateobj.getTime())-1000*60*60*24;
            }else{//明天开始自提
              vm.endDate = Number(dateobj.getTime())+1000*60*60*24*27;
              vm.startDate = Number(dateobj.getTime());
            }
          }else{//普通商品没选择门店，默认显示明天自提
            vm.endDate = Number(dateobj.getTime())+1000*60*60*24*27;
            vm.startDate = Number(dateobj.getTime());
          }
        }
      }
    },
    timestampToTime(timestamp){//时间戳准换成时间
        let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y+M+D+h+m+s;
    },
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
      if(this.canziti && this.cansonghuo){
        if(window.sessionStorage.getItem('Display')){
          if(window.sessionStorage.getItem('Display') == 'shsm'){
            this.isShowData = true;
          }else{
            this.isShowData = false;
          }
        }else{
          this.isShowData = true;
        }
      }else{
        if(this.canziti){
          this.isShowData = false;
        }else{
          this.isShowData = true;
        }
      }
    },
    placeOrder(aaaaaa){//提交订单
      let that =this,data={},cookieStr=Cookies.get('VUE2SESSID');
      if(!that.value2 && that.xuanzhongGood[0].isRejectedDeposit == 0 && that.xuanzhongGood[0].goodsSellType == 2){
        Toast('预售商品定金不退哦～请先同意支付定金协议再进行操作哦～');
        return;
      }
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
      if(!Cookies.get('VUE2SESSID')){
        this.$router.push({name:'signInPage'});
        return;
      }
      if(that.cardObj && that.cardObj.tccId){
        data.userCardId = that.cardObj.tccId;
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
      if(aaaaaa.length>0){
        data.goods = aaaaaa;
      }else{
        that.arrOBJ = that.returnObj(1);
        data.goods = that.arrOBJ;
      }
      if(that.$route.query.sourcePage){
        data['orderType'] = 5;
      }else{
        data['orderType'] = 1;
      }
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/order/sureOrder"+urlStr,
        dataType: 'json', 
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          window.sessionStorage.removeItem('cardStr');
          that.deleteShopGood(data);
          that.$router.push({name:'orderPayment',query:{orderId:response.data.body.orderId,VUE2SESSID:encodeURIComponent(cookieStr)}});
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
    deleteShopGood(data){//提交订单后，去除相应的购物车商品
      if(localStorage.getItem("shoppingCard")){
        let shopArr = localStorage.getItem("shoppingCard").split(',');//JSON.stringify(json);
        let newArr = shopArr,objStr='';
        for(let b in data.goods){
          objStr += JSON.stringify(data.goods[b]);
        }
        for(var i=0 ;i<newArr.length;i++){
          let id = shopArr[i].split('&')[0].split(':')[1];
          if(objStr.indexOf(id)>=0){
            shopArr.splice(i--,1);
          }
        }
        localStorage.setItem("shoppingCard",shopArr);
      }
    },
    jianquId(id){//商品剔除
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
        for(let i=0 ; i< that.xuanzhongGood.length ;i++){
          let obj={},str='';
          if(that.xuanzhongGood[i].goodsList){
            obj.packageId = that.xuanzhongGood[i].packageId;
            if(that.xuanzhongGood[i].ObjNumber){
              obj.num = (that.xuanzhongGood[i].ObjNumber);
            }else{
              obj.num = that.xuanzhongGood[i].TotalCommodity/that.xuanzhongGood[i].price;
            }
          }else if(!that.xuanzhongGood[i].goodsList){
            obj.onlineId = that.xuanzhongGood[i].onlineId;
            if(that.xuanzhongGood[i].ObjNumber){
              obj.num = (that.xuanzhongGood[i].ObjNumber);
            }else{
              obj.num = that.xuanzhongGood[i].TotalCommodity/that.xuanzhongGood[i].salePrice;
            }
          }
          for(let b=0 ;b<that.xuanzhongGood[i].giftList.length ;b++){
            if(b == that.xuanzhongGood[i].giftList.length-1){
              str+=that.xuanzhongGood[i].giftList[b].giftId;
            }else{
              str+=that.xuanzhongGood[i].giftList[b].giftId+",";
            }
          }
          obj.giftIds=str;
          arr.push(obj);
        }
      }else if(type == 2){
        for(let c=0;c<that.xuanzhongGood.length;c++){
          let obj={},str='';
          if(that.xuanzhongGood[c].goodsList){
            obj.id = that.xuanzhongGood[c].packageId;
            obj.type = 2;
          }else{
            obj.id = that.xuanzhongGood[c].onlineId;
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
          obj['num']=Number(newObj.TotalCommodity/newObj.price);
          newarr.push(obj)
          console.log(obj);
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
        this.invoiceStr = '请选择发票';
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
        this.showTime = true;
      }else{
        this.AddObj2={};
        this.haveAdd2 = false;
        this.showTime = false;
      }
    },
    huoquCard(){//卡券(优惠券)字符串默认显示事件
      if(window.sessionStorage.getItem('cardStr')){
        let str = window.sessionStorage.getItem('cardStr');
        if(str!='无'){//有可用的具体卡券
          this.cardObj = JSON.parse(str);
          if(this.cardObj.cardType ==1){//满减券
            if(this.cardObj.minUsePrice == 0){
              this.cardStr='无门槛'+'减'+this.cardObj.cardVal/100+'元';
            }else{
              this.cardStr='满'+this.cardObj.minUsePrice/100+'减'+this.cardObj.cardVal/100+'元';
            }
          }else{
            if(this.cardObj.minUsePrice == 0){
              this.cardStr='无门槛'+'享'+this.cardObj.cardVal+'折';
            }else{
              this.cardStr='满'+this.cardObj.minUsePrice/100+'享'+this.cardObj.cardVal+'折';
            }
          }
          this.ajaxPreferentialAmount(this.cardObj.tccId);
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
      console.log(urlStr);
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
      let arr = [],that =this,arr2=[],newObj={};
      if(window.sessionStorage.getItem('orderGoods')){
        let str = window.sessionStorage.getItem('orderGoods');
        let arr = str.split('&&'),newArr=[];
        for(let i in arr){
          let obj = JSON.parse(arr[i]);
          if(obj.packageId){
            newObj.packageId = obj.packageId;
            newObj.num = (obj.TotalCommodity/obj.price);
          }else{
            newObj.onlineId = obj.onlineId;
            newObj.num = (obj.TotalCommodity/obj.salePrice);
          }
          arr2.push(newObj);
        }
      }
      let data = {
        cardId:id,
        goodsList:arr2
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
    wayReceivingFunc(){//收货方式页面显示方法
      if(this.$route.query.canChoice.indexOf('2')>=0){
        this.cansonghuo = true;
      }else{
        this.cansonghuo = false;
      }
      if(this.$route.query.canChoice.indexOf('3')>=0){
        this.canziti = true;
      }else{
        this.canziti = false;
      }
      this.DefaultDisplay();
    },
  },
};  
</script>  
  
<style lang="less" scoped>   
  @import '../../assets/less/confirmationOrder.less';
</style> 