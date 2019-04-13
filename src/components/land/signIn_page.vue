<template>  
  <div class="signin" :style="heightStr">
    <header class="mint-header is-fixed">
      <div class="mint-header-button is-left">
        <i @click.stop="guanbiFunc"></i> 
      </div>
      <h1 class="mint-header-title"> 
        <em v-if="$store.state.titleShow" style='display: inline-block;line-height:.44rem;font-size:.17rem;'>手机快捷登录</em>
      </h1>
      <div class="mint-header-button is-right">
        <button class="mint-button mint-button--default mint-button--normal" style="margin-right:.05rem;">
          <label class="mint-button-text" style="font-size:.14rem;" @click.stop="toRegister">注册</label>
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
          <input type="number" oninput="if(value.length>6)value=value.slice(0,6)" placeholder="动态密码" v-model="val.Password">
          <i v-if="val.Password" @click="val.Password = '';"></i>
          <span :class="phonetrue?'canClick':''" @click="ajaxVerificationCode" style="font-size:.14rem;">
            <b v-if="show">获取动态密码</b>
            <b v-if="!show">{{count}}s</b>
          </span>
        </p>
        <p class="buttonLogin noBorder"><span :class="(val.Password.length == 6)?'canNext':''" @click.stop="phoneLogin($event)">登录</span></p>
        <p class="buttonChange noBorder"><span @click.stop="switchUserLogin">账户登录</span></p>
      </div>
    </div>
    <div class="thirdParty">
      <!-- <span class="zhifupay"></span> -->
      <!-- <span class="qq"></span> -->
      <!-- <span class="weixin"></span> -->
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
        this.$router.go(-1)
      }
    },
    switchUserLogin(){//账户登录跳转
      if(this.$route.query.outLogin){
        this.$router.replace({name:'userLogin',query:{'outLogin':'/'}});
      }else{
        this.$router.replace({name:'userLogin'});
      }
    },
    toRegister(){//注册跳转
      if(this.$route.query.outLogin){
        this.$router.replace({name:'register1',query:{'name':this.$route.query.name,'nameTow':'signInPage','outLogin':'/'}});
      }else{
        this.$router.replace({name:'register1',query:{'name':this.$route.query.name,'nameTow':'signInPage'}});
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
      that.count = util.TIME_COUNT;
      that.show = false;
      that.timer = setInterval(() => {
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
      if (!that.timer) {
        if(!that.phonetrue){
          MessageBox('系统提示','手机号码有误！');
          return;
        }
        let data = {};
        data.phoneNo = that.val.PhoneNum;
        data.type = '2';//快捷登录动态密码
        let urlStr = util.getpost(data);
        axios({
          method:"post",
          url:"/customer/open/getSmscode"+urlStr,
          dataType: 'json',
          data:data,
        }).then(response => {
          if(response.data.status == 0){//成功
            this.verificationCode();
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
          url:"/customer/open/quickLogin"+urlStr,
          dataType: 'json',
          data:data,
        }).then(response => {
          if(response.data.status==0){
            let millisecond = new Date().getTime();
            let expiresTime = new Date(millisecond + 60 * 1000 * 60 * 24 * 15);
            that.$store.commit('addUserPhone',that.val.PhoneNum);
            Cookies.set('jingjieUser', that.val.PhoneNum );
            Cookies.set('VUE2SESSID', response.data.body.token, {expires: expiresTime} );
            Toast('登录成功');
            // if(that.$route.query.name){
            //   that.$router.push({ 'name': that.$route.query.name});
            // }else{
              that.$router.go(-1);
            // }
          }else{
            MessageBox('系统提示',response.data.message);
            that.val.Password = '';
          }
        }).catch(oData => {
          if(oData.data.status && oData.data.status != 0){
            MessageBox('系统提示','登录失败！');
          }
        })
      }
    },
    
  },
  created(){
    util.setTitle('手机快捷登录');
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
@import '../../assets/less/signIn_page.less';
  
</style> 











