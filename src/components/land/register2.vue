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
          <input :type="val.classShow?'text':'password'" oninput="if(value.length>16)value=value.slice(0,16)" placeholder="请设置密码" v-model="val.PhoneNum" @input="watchPhone($event)" >
          <i v-if="val.PhoneNum" @click="val.PhoneNum = '';"></i>
          <span :class="val.classShow?'showchange':''" @click.stop="changeShowHide(1)"></span> 
        </p>
        <p class="Password">
          <input :type="val.classShow1?'text':'password'" @focus="yanzhen()" placeholder="再次确认密码" v-model="val.Password">
          <i v-if="val.Password" @click="val.Password = '';"></i>
          <span :class="val.classShow1?'showchange':''" @click.stop="changeShowHide(2)"></span>
        </p>
        <p class="buttonLogin noBorder"><span :class="val.Password.length ?'canNext':''" @click.stop="phoneLogin($event,1)">完成</span></p>
        <p class="buttonChange noBorder"><span @click.stop="phoneLogin($event)">跳过直接注册成功</span></p>
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
        PhoneNum:'',//密码
        Password:'',//第二密码
        classShow:false,//密码默认不显示
        classShow1:false,//密码默认不显示
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
        this.$router.replace({name:this.$route.query.name,query:{'name':this.$route.query.name,'outLogin':'/'}});
      }else{
        this.$router.replace({name:this.$route.query.name,query:{'name':this.$route.query.name,}});
      }
    },
    changeShowHide(data){
      if(data === 1){
        if(this.val.classShow){
          this.val.classShow = false;
        }else{
          this.val.classShow = true;
        }
      }else{
        if(this.val.classShow1){
          this.val.classShow1 = false;
        }else{
          this.val.classShow1 = true;
        }
      }
    },
    watchPhone(e){//验证设置的密码时候符合正则
      let that = this;
      let phoneNum = e.currentTarget.value;
      if(util.PASSWORD.test(phoneNum)){
        that.phonetrue = true;
      }else{
        that.phonetrue =false;
      }
      console.log(that.phonetrue);
    },
    yanzhen(){
      if(!this.phonetrue){
        Toast('密码长度为6-16位，数字、字母、字符至少包含两种！');
        this.val.PhoneNum ='';
      }
    },
    phoneLogin(e,type){//登录请求
      let that = this;
      if(type == 1){
        if(that.val.PhoneNum === that.val.Password){}else{
          Toast('两次密码输入不正确，请重新输入！');
          that.val.PhoneNum ='';
          that.val.Password ='';
          that.val.showPhoneNum ='';
          that.val.showPassword ='';
          return;
        }
      }
      let data ={
        phoneNo:that.$route.query.phoneNo,
        verifyCode:that.$route.query.verifyCode,
      };
      if(type == 1){
        data.password = that.val.PhoneNum;
        data.confirmPassword = that.val.Password;
      }
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/customer/open/register"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status==0){
          Toast('注册成功');
          let millisecond = new Date().getTime();
          let expiresTime = new Date(millisecond + 60 * 1000 * 60* 24 * 15);
          that.$store.commit('addUserPhone',that.val.PhoneNum);
          Cookies.set('jingjieUser', that.val.PhoneNum );
          Cookies.set('VUE2SESSID', response.data.body.token, {expires: expiresTime} );
          that.$router.go(-1);
        }else{
          MessageBox('系统提示',response.data.message);
          that.val.Password = '';
        }
      }).catch(oData => {
        if(oData.data.status && oData.data.status != 0){
          MessageBox('系统提示',oData.data.message);
        }
      })
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
      .PhoneNum,.Password{
        input{
          width: 90%;
          height: 100%;
          font-size: .14rem;
        }
        i{
          position: absolute;
          top: 35%;
          right: 10%;
          display: inline-block;
          width: 0.15rem;
          height: 0.15rem;
          background: url('../../assets/images/close@2x.png') no-repeat;
          background-size: 0.15rem;
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
            opacity: 1;
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











