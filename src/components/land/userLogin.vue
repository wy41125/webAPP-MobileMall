<template>  
  <div class="signin" :style="heightStr">  
    <header class="mint-header is-fixed">
      <div class="mint-header-button is-left">
        <i style="margin-left:.05rem;" @click="guanbiFunc"></i>
      </div>
      <h1 class="mint-header-title">
        <em v-if="$store.state.titleShow" style='display: inline-block;line-height:.45rem;font-size:.17rem;'>账户登录</em>
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
          <input :type="classShow?'text':'password'"  v-model="val.Password" placeholder="密码">
          <i v-if="val.Password" @click="val.Password = '';"></i>
          
          <span @click.stop="$router.push({'name':'forgetPass','query':{'name':'userLogin'}})" style="font-size:.14rem;">
            <b v-if="show" @click.stop="$router.push({name:'forgetPass'})" style="text-decoration:underline;color:#999;">忘记密码?</b>
          </span>
          <em :class="classShow?'showchange':''" @click.stop="changeShowHide(1)"></em>
        </p>
        <p class="buttonLogin noBorder"><span :class="(val.Password.length&&val.PhoneNum.length ==11)?'canNext':''" @click.stop="phoneLogin($event)">登录</span></p>
        <p class="buttonChange noBorder"><span @click.stop="switchUserLogin">手机快捷登录</span></p>
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
        Password:'',//密码
      },
      show:true,//文字、计时显示控制
      count: '',//计时数字
      timer: null,//计时器
      phonetrue:false,//控制手机号是否正确
      heightStr:null,
      classShow:false,
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
    switchUserLogin(){//快捷登录
      if(this.$route.query.outLogin){
        this.$router.replace({name:'signInPage',query:{'outLogin':'/'}});
      }else{
        this.$router.replace({name:'signInPage'});
      }
    },
    toRegister(){//注册跳转
      if(this.$route.query.outLogin){
        this.$router.replace({name:'register1',query:{'name':this.$route.query.name,'nameTow':'userLogin','outLogin':'/'}});
      }else{
        this.$router.replace({name:'register1',query:{'name':this.$route.query.name,'nameTow':'userLogin'}});
      }
    },
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
    watchPhone(e){
      let that = this;
      let phoneNum = e.currentTarget.value;
      //手机号码验证
      if(phoneNum.length <11){that.phonetrue = false;}else if(!util.PHONE_REG.test(phoneNum)){that.phonetrue = false;}else{
        that.phonetrue = true;
      }
    },
    phoneLogin(e){//登录请求
      let that = this;
      let loginClass = e.srcElement.className;
      if(loginClass.indexOf('canNext')<0){
        MessageBox('系统提示','请正确输入手机号或密码！');
      }else{
        let data ={
          phoneNo:that.val.PhoneNum,
          password:that.val.Password
        };
        let urlStr = util.getpost(data);
        axios({
          method:"post",
          url:"/customer/open/login"+urlStr,
          dataType: 'json',
          data:data,
        }).then(response => {
          if(response.data.status==0){
            let millisecond = new Date().getTime();
            let expiresTime = new Date(millisecond + 60 * 1000 * 60* 24 * 15);
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
            Toast(response.data.message);
            that.val.Password = '';
          }
        }).catch(oData => {
          if(oData.data.status && oData.data.status != 0){
            Toast('登录失败！');
          }
        })
      }
    }
  },
  created(){
    util.setTitle('账号登录');
    this.heightStr = 'height:'+(window.innerHeight-80)+'px;';
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
  },
  beforeRouteUpdate(to,from,next){
    // next( ()=>{
    //   console.log(this.$router.params.id); 
    // });
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
        em{
          display: inline-block;
          width: 0.15rem;
          height: 0.1rem;
          background: url(../../assets/images/land/login_invisibility@2x.png) no-repeat;
          background-size:100%; 
          background-position: 0 45%;
          height: .5rem;
          line-height: .5rem;
          float: right;
          margin-right: .1rem;
          &.showchange{
            background: url(../../assets/images/land/login_visible@2x.png) no-repeat;
            background-size:100%; 
            background-position: 0 45%;
          }
        }
        span{
          float: right;
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
    .zhifupay,.qq,.weixin{
      display: inline-block;
      margin:0 0.2rem;
      width: 0.5rem;
      height: 0.5rem;
      background: url('../../assets/images/land/alipay@2x.png') no-repeat;
      background-size: 0.5rem;
    }
    .qq{
      background: url('../../assets/images/land/qq@2x.png') no-repeat;
      background-size: 0.5rem;
    }
    .weixin{
      background: url('../../assets/images/land/weixin@2x.png') no-repeat;
      background-size: 0.5rem;
    }
  }
</style> 











