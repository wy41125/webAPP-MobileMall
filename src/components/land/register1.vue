<template>  
  <div class="signin" :style="heightStr">  
    <header class="mint-header is-fixed">
      <div class="mint-header-button is-left">
        <i style="margin-left:.05rem;" @click="guanbiFunc"></i>
      </div>
      <h1 class="mint-header-title">
        <em v-if="$store.state.titleShow" style='display: inline-block;line-height:.45rem;font-size:.17rem;'>注册</em>
      </h1>
      <div class="mint-header-button is-right">
        <button class="mint-button mint-button--default mint-button--normal" style="margin-right:.05rem;">
          <label class="mint-button-text" style="font-size:.14rem;" @click.stop="toRegister">登录</label>
        </button>
      </div> 
    </header>
    <div class="inputDiv">
      <div class="tongyiDiv">
        <p class="PhoneNum">
          <input type="number" oninput="if(value.length>11)value=value.slice(0,11)" placeholder="手机号码" v-model="val.PhoneNum" @input="watchPhone($event)">
          <i v-if="val.PhoneNum" @click="val.PhoneNum = '';"></i>
        </p>
        <p class="Password">
          <input type="number" oninput="if(value.length>6)value=value.slice(0,6)" placeholder="验证码" v-model="val.Password">
          <i v-if="val.Password" @click="val.Password = '';"></i>
          <span :class="phonetrue?'canClick':''" @click="ajaxVerificationCode" style="text-align: center;"> 
            <b v-if="show">获取验证码</b>
            <b v-if="!show">{{count}}s</b>
          </span>
        </p>
        <p class="buttonLogin noBorder"><span :class="(val.Password.length == 6)?'canNext':''" @click.stop="phoneLogin($event)">下一步</span></p>
        <p class=" noBorder">注册即表示同意<span class="colorbluo" @click.stop="$router.push({'name':'userProtocol'})">《用户服务条款及服务协议》</span></p>
      </div>
    </div>
  </div>  
</template>  
  
<script> 
import {Toast,MessageBox} from 'mint-ui' 
import util from '@/libs/util' 
import axios from 'axios'
import Cookies from 'js-cookie';
export default {  
  name: 'signin',  
  data() {  
    return {  
      val:{
        PhoneNum:'',//手机号
        Password:'',//动态验证码
      },
      show:true,//文字、计时显示控制
      count: '',//计时数字
      timer: null,//计时器
      phonetrue:false,//控制手机号是否正确
      heightStr:null,
    };  
  },
  methods:{
    guanbiFunc(){//关闭登录页面
      if(this.$route.query.outLogin){
        this.$router.push({path:'/'});
      }else{
        this.$router.go(-1);
      }
    },
    toRegister(){//登录跳转
      if(this.$route.query.outLogin){
        this.$router.replace({name:this.$route.query.nameTow,query:{'name':this.$route.query.name,'outLogin':'/'}});
      }else{
        this.$router.replace({name:this.$route.query.nameTow,query:{'name':this.$route.query.name,}});
      }
    },
    watchPhone(e){
      let that = this;
      let phoneNum = e.currentTarget.value;
      //手机号码验证
      if(phoneNum.length <11){that.phonetrue = false;}else if(!util.PHONE_REG.test(phoneNum)){that.phonetrue = false;}else{
        that.phonetrue = true;
      }
    },
    verificationCode(){//运行计时器，60倒计时
      let that = this;
      this.count = util.TIME_COUNT;
      this.show = false;
      this.timer = setInterval(() => {
        if (that.count > 0 && that.count <= util.TIME_COUNT) {
          that.count--;
        } else {
          that.show = true;
          clearInterval(that.timer);
          that.timer = null;
        }
      }, 1000)
    },
    ajaxVerificationCode(){//请求验证码
      let that =this;
      if(!that.timer){
        if(!that.phonetrue){
          MessageBox('系统提示','手机号码有误！');
          return;
        }
        let data = {};
        data.phoneNo = that.val.PhoneNum;
        data.type = '1';//注册验证码
        let urlStr = util.getpost(data);
        axios({
          method:"post",
          url:"/customer/open/getSmscode"+urlStr,
          dataType: 'json',
          data:data,
        }).then(response => {
          if(response.data.status == 0){
            this.verificationCode();
          }else if(response.data.status == 1){
            Toast(response.data.message);
            that.$router.replace({name:'signInPage'});
          }else{
            Toast(response.data.message);//提示
          }
        }).catch(oData => {
          if(oData.data.status && oData.data.status != 0){
            MessageBox('系统提示','验证码请求失败！');
          }
        })
      }else{
        Toast('操作过于频繁请等待！');
      }
    },
    phoneLogin(e){//登录请求
      let that = this;
      let loginClass = e.srcElement.className;
      if(loginClass.indexOf('canNext')<0){
        MessageBox('系统提示','请正确输入手机号或验证码！');
      }else{
        let data ={
          phoneNo:that.val.PhoneNum,
          verifyCode:that.val.Password
        };
        let urlStr = util.getpost(data);
        axios({
          method:"post",
          url:"/customer/open/validRegisterCode"+urlStr,
          dataType: 'json',
          data:data,
        }).then(response => {
          if(response.data.status==0){
            // Toast('注册成功');
            // if(that.$route.query){
              that.$router.replace({ 'name':'register2',query:{'name':that.$route.query.nameTow,verifyCode:that.val.Password,phoneNo:that.val.PhoneNum}});
            // }
          }else{
            MessageBox('系统提示',response.data.message);
            that.val.Password = '';
          }
        }).catch(oData => {
          // if(oData.data.status && oData.data.status != 0){
          //   MessageBox('系统提示','登录失败！');
          // }
        })
        // axios({
        //   method:"post",
        //   url:"/customer/open/register"+urlStr,
        //   dataType: 'json',
        //   data:data,
        // }).then(response => {
        //   if(response.data.status==0){
        //     let millisecond = new Date().getTime();
        //     let expiresTime = new Date(millisecond + 60 * 1000 * 60* 24 * 15);
        //     Cookies.set('jingjieUser', that.val.PhoneNum );
        //     Cookies.set('VUE2SESSID', response.data.body.token, {expires: expiresTime} );
        //     if(that.$route.query){
        //       that.$router.replace({ 'name':'register2',query:{'name':$route.query.nameTow}});
        //     }
        //     Toast('注册成功');
        //   }else{
        //     MessageBox('系统提示',response.data.message);
        //     that.val.Password = '';
        //   }
        // }).catch(oData => {
        //   if(oData.data.status && oData.data.status != 0){
        //     MessageBox('系统提示','登录失败！');
        //   }
        // })
      }
    },
    
  },
  created(){
    util.setTitle('注册');
    this.heightStr = 'height:'+(window.innerHeight-80)+'px;';
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
  },
  beforeRouteUpdate(to,from,next){
    
  }  
};  
</script>  
  
<style lang="less" scoped>   
  .signin{
    width: 100%;
    height: 100%;
    background-color: #fff;
    padding:0.8rem 0 0 0; 
  }
  .is-fixed{ 
    width: 100%;
    height: 0.45rem;
    background-color: #fff;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    justify-content: space-between;
    color: #000;
    .is-left,.is-right{
      width: 10%;
      height: 100%;
    }
    .is-left{
      i{
        display: inline-block;
        width: 0.16rem;
        height: 0.16rem;
        background: url('../../assets/images/land/login_close@2x.png') no-repeat;
        background-size:0.16rem;
        position: absolute;
        top: .13rem;
        left: .05rem;
      }
    }
    .mint-header-title{
      width: 80%;
      height: 100%;
    }
  }
  .inputDiv{
    margin-top: 0.4rem;
    font-size: 0.13rem;
    width: 100%;
    .tongyiDiv{
      margin: 0 auto;
      width: 80%;
      p{
        width: 100%;
        height: 0.5rem;
        line-height: 0.5rem;
        border-bottom: 1px solid #ececec;
        position: relative;
      }
      .noBorder{
        border: 0px solid transparent;
      }
      .PhoneNum{
        input{
          width: 100%;
          height: 100%;
          font-size: .14rem;
        }
        i{
          position: absolute;
          top: 35%;
          right: 5%;
          display: inline-block;
          width: 0.15rem;
          height: 0.15rem;
          background: url('../../assets/images/close@2x.png') no-repeat;
          background-size: 0.15rem;
        }
      }
      .Password{
        text-align: left;
        input{
          width: 60%;
          height: 100%;
          font-size: .14rem;
        }
        span{
          display: inline-block;
          width: 35%;
          height: 100%;
          color: #ececec;
          &.canClick{
            color: #CEA63F;
          }
        }
        i{
          position: absolute;
          top: 35%;
          right: 35%;
          display: inline-block;
          width: 0.15rem;
          height: 0.15rem;
          background: url('../../assets/images/close@2x.png') no-repeat;
          background-size: 0.15rem;
        }
      }
      .buttonLogin{
        margin: 0.1rem 0;
        span{
          display: inline-block;
          width: 100%;
          height: 100%;
          border-radius: 0.05rem; 
          color: #fff;
          background-color: #CEA63F;
          opacity: 0.5;
          &.canNext{
            background-color: #CEA63F;
            opacity: 1;
          }
        }
      }
      .colorbluo{
        color:#5d86f5;
      }
    }
  }
  .thirdParty{
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    justify-content: center;
    margin: 0.8rem 0;
    span{
      display: inline-block;
      margin:0 0.2rem;
      width: 0.5rem;
      height: 0.5rem;
      background: url('../../assets/images/land/alipay@2x.png') no-repeat;
      background-size: 0.5rem;
      &:nth-child(2){
        background: url('../../assets/images/land/qq@2x.png') no-repeat;
        background-size: 0.5rem;
      }
      &:nth-child(3){
        background: url('../../assets/images/land/weixin@2x.png') no-repeat;
        background-size: 0.5rem;
      }
    }
  }
</style> 











