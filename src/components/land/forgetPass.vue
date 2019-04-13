<template>  
  <div class="signin" :style="heightStr">  
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'忘记密码'" class="headers" style='border-bottom: none;'></headers>
    <div class="inputDiv" :style="$store.state.titleShow?'margin-top:.45rem':''">
      <div class="tongyiDiv"> 
        <p class="PhoneNum ">
          <input type="number" oninput="if(value.length>11)value=value.slice(0,11)" placeholder="手机号码" v-model="val.PhoneNum" @input="watchPhone($event)">
          <i v-if="val.PhoneNum" @click="val.PhoneNum = '';"></i>
          <b></b>
        </p>
        <p class="Password">
          <input type="number" oninput="if(value.length>6)value=value.slice(0,6)" placeholder="验证码" v-model="val.Password">
          <i v-if="val.Password" @click="val.Password = '';"></i>
          <span :class="phonetrue?'canClick':''" @click="ajaxVerificationCode">
            <b v-if="show">获取动态密码</b>
            <b v-if="!show">{{count}}s</b>
          </span>
        </p>
        <p class="PhoneNum passAis">
          <input :type="classShow?'text':'password'" oninput="if(value.length>16)value=value.slice(0,16)" placeholder="请设置新密码" v-model="val.userPass">
          <i v-if="val.userPass" @click="val.userPass = '';"></i>
          <span :class="classShow?'showchange':''" @click.stop="changeShowHide(1)"></span>
        </p>
        <p class="PhoneNum passAis">
          <input :type="classShow?'text':'password'" @focus="yanzhen()" oninput="if(value.length>16)value=value.slice(0,16)" placeholder="再次确认密码" v-model="val.userPassTow">
          <i v-if="val.userPassTow" @click="val.userPassTow = '';"></i>
          <span :class="classShow1?'showchange':''" @click.stop="changeShowHide(2)"></span>
        </p>
        <p class="buttonLogin noBorder"><span :class="(val.Password && val.Password && val.userPass && val.userPassTow)?'canNext':''" @click.stop="phoneLogin($event)">完成</span></p>
      </div>
    </div>
  </div>  
</template>  
  
<script> 
import {Toast,MessageBox} from 'mint-ui' 
import headers from '../headers.vue' 
import util from '@/libs/util' 
import axios from 'axios'
import Cookies from 'js-cookie';
const TIME_COUNT = 60;
const PHONE_REG = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
const PASSWORD = /^.*(?=.{6,16})(((?=.*\d)(?=.*[A-Za-z]))|((?=.*\d)(?=.*[!@#$%^&*? ]))|((?=.*[A-Za-z])(?=.*[!@#$%^&*? ]))).*$/;
export default {  
  name: 'signin',  
  data() {  
    return {  
      val:{
        PhoneNum:'',//手机号
        Password:'',//动态验证码
        userPass:'',
        userPassTow:''
      },
      show:true,//文字、计时显示控制
      count: '',//计时数字
      timer: null,//计时器
      phonetrue:false,//控制手机号是否正确
      classShow:false,//密码默认不显示
      classShow1:false,//密码默认不显示
      heightStr:null,
    };  
  },
  components:{
    headers:headers,
  },
  methods:{
    changeShowHide(data){
      if(data === 1){
        if(this.classShow){
          this.classShow = false;
        }else{
          this.classShow = true;
        }
      }else{
        if(this.classShow1){
          this.classShow1 = false;
        }else{
          this.classShow1 = true;
        }
      }
    },
    yanzhen(){
      let that = this;
      let phoneNum = that.val.userPass;
      if(PASSWORD.test(phoneNum)){}else{
        Toast('密码长度为6-16位，数字、字母、字符至少包含两种！');
        this.val.userPass ='';
      }
    },
    watchPhone(e){
      let that = this;
      let phoneNum = e.currentTarget.value;
      //手机号码验证
      if(phoneNum.length <11){that.phonetrue = false;}else if(!PHONE_REG.test(phoneNum)){that.phonetrue = false;}else{
        that.phonetrue = true;
      }
    },
    verificationCode(){//运行计时器，60倒计时
      let that = this;
      this.count = TIME_COUNT;
      this.show = false;
      this.timer = setInterval(() => {
        if (that.count > 0 && that.count <= TIME_COUNT) {
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
          Toast('手机号码有误！');
          return;
        }
        let data = {};
        data.phoneNo = that.val.PhoneNum;
        data.type = '4';//忘记密码获取动态密码
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
            Toast('验证码请求失败！');
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
        MessageBox('系统提示','请完善以上必要信息！');
        return;
      }
      if(that.val.userPass === that.val.userPassTow){}else{
        Toast('两次密码输入不正确，请重新输入！');
        that.val.PhoneNum ='';
        that.val.Password ='';
        that.val.showPhoneNum ='';
        that.val.showPassword ='';
        return;
      }
      let data ={
        phoneNo:that.val.PhoneNum,
        verifyCode:that.val.Password,
        password:that.val.userPass,
        confirmPassword:that.val.userPassTow,
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/customer/open/forgetPwd"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status==0){
          Toast('修改成功');
          that.$router.go(-1);
        }else{
          MessageBox('系统提示',response.data.message);
          that.val.Password = '';
          that.val.userPass = '';
          that.val.userPassTow = '';
        }
      }).catch(oData => {
        if(oData.data.status && oData.data.status != 0){
          MessageBox('系统提示','登录失败！');
        }
      })
    },
    
  },
  created(){
    util.setTitle('忘记密码');
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
  .headers .mint-header{
    border-bottom: none !important;
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
        margin-top: 0.05rem;
        display: inline-block;
        width: 0.25rem;
        height: 0.25rem;
        background: url('../../assets/images/land/login_close@2x.png') no-repeat;
        background-size:0.25rem;

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
          width: 90%;
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
          background-size: 0.115rem;
        }
        span{
          display: inline-block;
          width: 0.15rem;
          height: 0.1rem;
          background: url(../../assets/images/land/login_invisibility@2x.png) no-repeat;
          background-size:100%; 
          &.showchange{
            background: url(../../assets/images/land/login_visible@2x.png) no-repeat;
            background-size:100%; 
          }
        }
        b{
          display: inline-block;
          width: 0.15rem;
          height: 0.1rem;
        }
      }
      .passAis{
        i{
          position: absolute;
          top: 35%;
          right: 10%;
          display: inline-block;
          width: 0.15rem;
          height: 0.15rem;
          background: url('../../assets/images/close@2x.png') no-repeat;
          background-size: 0.115rem;
        }
      }
      .Password{
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
          background-size: 0.115rem;
        }
      }
      .buttonLogin,.buttonChange{
        margin: 0.1rem 0;
        span{
          display: inline-block;
          width: 100%;
          height: 100%;
          border-radius: 0.05rem; 
        }
      }
      .buttonLogin{
        span{
          color: #fff;
          background-color: #CEA63F;
          opacity: 0.5;
          &.canNext{
            background-color: #CEA63F;
          }
        }
      }
      .buttonChange{
        color: #fff;
        border:1px solid #CEA63F;
        border-radius: 0.05rem; 
        color: #CEA63F;
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











