<template>  
  <div class="invoice"> 
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'发票'"></headers>
    <!-- 发票类型 -->
    <div class="unifiedStyle" :style="$store.state.titleShow?'margin-top:.4rem':''">
      <p class="tabel">发票类型</p>
      <p class="button">
        <span :class="!isShowData?'active':''" @click.stop="changeDelivery(2)">不需要发票</span>
        <span :class="(isShowData && !electronicInvoice)?'active':''" @click.stop="changeDelivery(1)">纸质发票</span>
        <!-- <span :class="(isShowData && electronicInvoice)?'active':''" @click.stop="changeDelivery(6)">电子发票</span> -->
      </p>
      <!-- <p class="miaoshu">电子发票与纸质发票具备同等法律效力，可支持报销入账</p> -->
    </div>
    <!-- 发票抬头 -->
    <div class="unifiedStyle" v-if="isShowData">
      <p class="tabel">发票抬头</p>
      <p class="button">
        <span :class="invoiceTt?'active':''" @click.stop="changeDelivery(3)">个人</span>
        <span :class="!invoiceTt?'active':''" @click.stop="changeDelivery(4)">单位</span>
      </p>  
      <!-- <p class="input" v-if="invoiceTt"><input type="text" placeholder="请填写个人姓名" v-model="grName"></p> -->
      <p class="input" v-if="!invoiceTt"><input type="text" placeholder="请填写单位名称" v-model="dwName"></p>
      <p class="input" v-if="!invoiceTt"><input type="text" placeholder="请填写纳税人识别号" v-model="sbh"></p>
    </div>
    <!-- 收票人信息 -->
    <!-- <div class="email_div" v-show="electronicInvoice">
      <p class="title">收票人信息</p>
      <p class="phone"><span><i>*</i>收票人手机</span><input type="tel" placeholder="请输入手机号"></p>
      <p class="email"><span>收票人邮箱</span><input type="email" placeholder="用来接收电子发票邮件，可选填"></p>
    </div> -->
    <!-- 发票内容 -->
    <div class="unifiedStyle" v-if="isShowData">
      <p class="tabel">发票内容</p>
      <p class="button"><span :class="invoicenr?'active':''" @click.stop="changeDelivery(5)">商品明细</span></p>
    </div>
    <!--  footer_botton -->
    <div class="footer_botton">
      <span @click.stop="Preservation">保存</span>
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
  name: 'invoice',  
  data() {  
    return {  
       isShowData:true,//控制
       invoiceTt:true,
       invoicenr:true,
       electronicInvoice:false,//电子发票
       dwName:null,
       sbh:null,
       // value1:'',
    };  
  },
  components:{
    headers:headers,
  },
  methods:{
    Preservation(){
      let obj ={};
      if(this.isShowData){
        obj.needInvoice=1;//(描述：是否发票（1,。需要，2.不需要）、类型：Integer、是否必填：Y)
        if(this.invoiceTt){//个人
          obj.invoiceName='个人';
          if(this.invoicenr){
            obj.invoiceContent='商品明细';
          }else{
            obj.invoiceContent='';
          }
          obj.invoiceNumber='';
          obj.companyName='';
        }else{
          if(!this.dwName){
            Toast('请填写单位名称!');
            return;
          }else{
            obj.companyName=this.dwName;
          }
          if(!this.sbh){
            Toast('请填写纳税人识别号!');
            return;
          }else{
            obj.invoiceNumber=this.sbh;
          }
          if(this.invoicenr){
            obj.invoiceContent='商品明细';
          }else{
            obj.invoiceContent='';
          }
          obj.invoiceName='单位';
        }
      }else{
        obj.needInvoice=2;
        obj.invoiceContent='';//  (描述：发票内容、类型：String、是否必填：Y)
        obj.invoiceName='';//  (描述：发票抬头、类型：String、是否必填：Y)
        obj.invoiceNumber='';//  (描述：纳税人识别号（单位发票传，个人发票没有不传）、类型：String、是否必填：Y)
        obj.companyName='';//  (描述：发票单位名称（单位发票传，个人发票没有不传）、类型：String、是否必填：Y)
      }
      let str = JSON.stringify(obj);
      window.sessionStorage.setItem('invoice',str);
      this.$router.go(-1);
    },
    changeDelivery(type){
      if(type == 1){
        this.isShowData = true;
        this.electronicInvoice = false;
      }else if(type == 2){
        this.isShowData = false;
      }else if(type == 3){
        this.invoiceTt = true;
      }else if(type == 4){
        this.invoiceTt = false;
      }else if(type == 5){
        if(this.invoicenr){this.invoicenr=false;}else{this.invoicenr=true;}
      }else if(type == 6){
        this.isShowData = true;
        this.electronicInvoice = true;
      }
    },
  },
  created(){
    util.setTitle('发票');
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
  .invoice{
    widows: 100%;
    height: 100%;
    font-size: 0.14rem;
    .unifiedStyle{
      padding:0.1rem 0.15rem;
      background-color: #fff;
      text-align: left;
      margin-bottom: 0.08rem;
      .miaoshu{
        margin-top:.08rem;
        font-size:.13rem;
        color:#989898;
      }
      .tabel{
        text-align: left;
        margin-bottom: 0.08rem;
      }
      .button{
        span{
          display: inline-block;
          width: 0.8rem;
          text-align: center;
          padding: 0.06rem 0;
          border:1px solid #333;
          border-radius: 0.05rem;
          color: #333;
          margin-right: 0.1rem;
        }
        .active{
          color: #cea840;
          border:1px solid #cea840;
        }
      }
      .input{
        margin-top: 0.1rem;
        input{
          border:1px solid #ccc;
          padding: 0.1rem 0.15rem;
          font-size: 0.14rem;
          width: 90%;
        }
      }
    }
    .footer_botton{
      padding: 0.1rem 3%;
      width: 94%;
      position: fixed;
      left: 0;
      bottom: 0;
      span{
        display: inline-block;
        width: 100%;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.14rem;
        color: #fff;
        background-color: #cea840;
        border-radius: 0.05rem;
      }
    }
    .email_div{
      width:100%;
      background:#fff;
      text-align:left;
      margin-bottom:.08rem;
      p{
        padding:.1rem .15rem;
        border-bottom:1px solid #ececec;
        i{
          color:#E12E2E;
        }
        span{
          display:inline-block;
          width:.85rem;
        }
        input{
          font-size:.13rem;
          width:65%;
        }
      }
    }
  }
</style> 











