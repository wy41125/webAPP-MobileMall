<template>  
  <div class="set">  
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'设置'"></headers>
    <div class="user" :style="$store.state.titleShow?'margin-top:.45rem':''">
      <p class="title">密码长度为6-16位，数字、字母、字符至少包含两种</p>
      <ul v-if="oldOrnew">
        <li>密码
          <input :type="!passShow.setone?'password':'text'"  v-model="passWord.passWord1" oninput="if(value.length>16)value=value.slice(0,16)" placeholder="请设置密码" >
          <i :class="passShow.setone?'showLi':''" @click.stop="showOrhidn(1)"></i>
        </li>
        <li >
          确认密码
          <input :type="!passShow.settwo?'password':'text'"  v-model="passWord.passWord2" placeholder="请再次输入密码"  @focus="watchPass(1)">
          <i :class="passShow.settwo?'showLi':''" @click.stop="showOrhidn(2)"></i>
        </li>
      </ul>
      <ul v-if="!oldOrnew">
        <li >原密码
          <input :type="!passShow.changeone?'password':'text'"  v-model="passWord.passWord3" placeholder="请输入旧密码" >
          <i :class="passShow.changeone?'showLi':''" @click.stop="showOrhidn(3)"></i>
        </li>
        <li >新密码
          <input :type="!passShow.changetwo?'password':'text'"  v-model="passWord.passWord4" oninput="if(value.length>16)value=value.slice(0,16)" placeholder="请设置新密码" >
          <i :class="passShow.changetwo?'showLi':''" @click.stop="showOrhidn(4)"></i>
        </li>
        <li >确认新密码
          <input :type="!passShow.changetreen?'password':'text'"  v-model="passWord.passWord5" placeholder="请再次输入新密码" @focus="watchPass(2)">
          <i :class="passShow.changetreen?'showLi':''" @click.stop="showOrhidn(5)"></i>
        </li>
      </ul>
    </div>
    <button v-if="oldOrnew == 1" :class="(passWord.passWord1 && passWord.passWord2)?'canclick bottom':'bottom'"  @click.stop="ajaxUserInformetion(0)">确定</button>
    <button v-if="!oldOrnew == 1" :class="(passWord.passWord3.length && passWord.passWord5.length)?'canclick bottom':'bottom'"  @click.stop="ajaxUserInformetion(1)">确定</button>
  </div>  
</template>  
  
<script> 
import headers from '../../headers.vue'  
import {Toast,MessageBox} from 'mint-ui'
import axios from 'axios'
import util from '@/libs/util' 
export default {  
  name: 'set',  
  data() {  
    return {  
      oldOrnew:'',//控制密码设置显示与否
      passShow:{
        setone:false,
        settwo:false,
        changeone:false,
        changetwo:false,
        changetreen:false
      },
      passWord:{//密码
        passWord1:'',
        passWord2:'',
        passWord3:'',
        passWord4:'',
        passWord5:''
      }
    };  
  },
  components:{
    headers:headers,
  },
  methods:{
    showOrhidn(type){
      if(type === 1){
        if(this.passShow.setone){this.passShow.setone=false;}else{this.passShow.setone=true;}
      }else if(type === 2){
        if(this.passShow.settwo){this.passShow.settwo=false;}else{this.passShow.settwo=true;}
      }else if(type === 3){
        if(this.passShow.changeone){this.passShow.changeone=false;}else{this.passShow.changeone=true;}
      }else if(type === 4){
        if(this.passShow.changetwo){this.passShow.changetwo=false;}else{this.passShow.changetwo=true;}
      }else{
        if(this.passShow.changetreen){this.passShow.changetreen=false;}else{this.passShow.changetreen=true;}
      }
    },
    watchPass(type){
      if(type === 1){
        let that = this,phoneNum = that.passWord.passWord1;
        if(util.PASSWORD.test(phoneNum)){}else{
          Toast('密码长度为6-16位，数字、字母、字符至少包含两种！');
          that.passWord.passWord1 ='';
          that.passWord.passWord2 ='';
        }
      }else{
        let that = this,phoneNum = that.passWord.passWord4;
        if(util.PASSWORD.test(phoneNum)){}else{
          Toast('密码长度为6-16位，数字、字母、字符至少包含两种！');
          that.passWord.passWord4 ='';
          that.passWord.passWord5 ='';
        }
      }
    },
    ajaxUserInformetion(type){
      let that =this;
      if(type === 1){//修改密码
        if(!that.passWord.passWord3){Toast('原密码不能为空');return;}
        if(that.passWord.passWord4 != that.passWord.passWord5){
          Toast('两次新密码不一致！');
          that.passWord.passWord4 = '';
          that.passWord.passWord5 = '';
          return;
        }
        let data = {
          oldPassword:that.passWord.passWord3,
          password:that.passWord.passWord4,
          confirmPassword:that.passWord.passWord5,
        };
        let urlStr = util.getpost(data);
        axios({
          method:"post",
          url:"/customer/updatePwd"+urlStr,
          dataType: 'json',
          data:data,
        }).then(response => {
          if(response.data.status==0){
            that.$router.go(-1);
            Toast('设置成功！');
          }else{
            if(response.data.status = 499){//token失效或没有token
              util.outLogin();
              that.$router.push({name:'signInPage',query:{outLogin:'/'}});
            }else{
              MessageBox('系统提示',response.data.message);
            }
            that.passWord.passWord3 ='';
            that.passWord.passWord4 ='';
            that.passWord.passWord5 ='';
          }
        }).catch(oData => {
          if(oData.data.status && oData.data.status != 0){
            MessageBox('系统提示',oData.data.message);
          }
        })

      }else{
        if(that.passWord.passWord1 != that.passWord.passWord2){
          Toast('两次新密码不一致！');
          that.passWord.passWord1 = '';
          that.passWord.passWord2 = '';
          return;
        }
        let data = {
          password:that.passWord.passWord1,
          confirmPassword:that.passWord.passWord2,
        };
        let urlStr = util.getpost(data);
        axios({
          method:"post",
          url:"/customer/updatePwd"+urlStr,
          dataType: 'json',
          data:data,
        }).then(response => {
          if(response.data.status==0){
            that.$router.go(-1);
            Toast('设置成功！');
          }else{
            MessageBox('系统提示',response.data.message);
            that.passWord.passWord1 ='';
            that.passWord.passWord2 ='';
          }
        }).catch(oData => {
          if(oData.data.status && oData.data.status != 0){
            MessageBox('系统提示',oData.data.message);
          }
        })
      }
    },
  },
  created(){
    if(this.$route.query.hasPass == 0){
      this.oldOrnew = true;
    }else{
      this.oldOrnew = false;
    }
    util.setTitle('设置');
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
  },
  beforRouterUpdet(to,from,next){

  }  
};  
</script>  
  
<style lang="less" scoped>   
.set{
  width: 100%;
  height: 100%;
  .user{
    width: 100%;
    text-align: left;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    .title{
      font-size: 0.14rem;
      padding: 0.1rem 0.15rem;
      color:#9a9a9a;
    }
    ul{
      width: 100;
      li{
        padding: 0.1rem 0.35rem 0.1rem 0.15rem;
        font-size: 0.15rem;
        background-color:#fff;
        border-bottom: 1px solid #ececec;
        position: relative;
        input{
          font-size: 0.14rem;
          float: right;
          color:#000;
          text-align: right;
          margin-right: 0.1rem;
        }
        i{
          display: inline-block;
          width: 0.2rem;
          height: 0.2rem;
          position: absolute;
          top: 40%;
          right: 0.15rem;
          background: url('../../../assets/images/land/login_invisibility@2x.png') no-repeat;
          background-size: 0.2rem;
          &.showLi{
            background: url('../../../assets/images/land/login_visible@2x.png') no-repeat;
            background-size: 0.2rem;
          }
        }
      }
    }
  }
  .outLogin{
    margin-top: 0.15rem;
    p{
      font-size: 0.15rem;
      background-color: #fff;
      text-align: center;
      padding: 0.1rem 0.15rem;
      color:#e22f2d;
    }
  }
  .bottom{
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #ececec;
    border:1px solid #ececec;
    font-size: 0.15rem;
    padding: 0.15rem;
    color:#fff;
    &.canclick{
      background-color: #cda73f;
    }
  }
}
  
</style> 





















