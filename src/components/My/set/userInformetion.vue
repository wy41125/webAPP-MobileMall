<template>  
  <div class="set">  
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'设置'"></headers>
    <div class="user" :style="$store.state.titleShow?'top:.45rem':'top:0;'">
      <p class="title">账户信息</p>
      <p @click.stop="$router.push({name:'userInfor'})" class="conent">个人资料<span>{{$route.query.userName}}</span></p>
      <p @click.stop="$router.push({name:'setpassWord',query:{hasPass:$route.query.hasPassword}})" class="conent">密码设置<span>{{passStr}}</span></p>
      <div class="outLogin">
        <p @click.stop="outLogin" style="padding:0;">退出登录</p>
      </div>
    </div>
    
    <navigation></navigation>
  </div>  
</template>  
  
<script> 
import axios from 'axios' 
import {Toast,MessageBox} from 'mint-ui'
import navigation from '../../goods/navigation.vue'
import headers from '../../headers.vue' 
import util from '@/libs/util' 
export default {  
  name: 'set',  
  data() {  
    return {  
      passStr:'',
    };  
  },
  components:{
    headers:headers,
    navigation:navigation,
  },
  methods:{
  	ajaxUpUser(){
      let that =this;
      let data = {};
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/customer/logout"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          Toast('退出成功！');
          this.$router.go(-1);
        }else{
          if(response.data.status == 499){
            Toast('退出成功！');
            this.$router.go(-1);
          }else{
            that.imgShow = false;
            MessageBox('系统提示',response.data.message);
          }
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
    ajaxUser(){
      let that =this;
      let data = {};
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/customer/info"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          if(response.data.body.hasPassword && response.data.body.hasPassword == 1){//是否有密码
            that.passStr = '修改密码';
          }else{
            that.passStr = '设置密码';
          }
        }else{
          // MessageBox('系统提示',response.data.message);
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
    outLogin(){
      this.ajaxUpUser();
      var myDate=new Date();    
      myDate.setTime(-1000);//设置时间    
      var data=document.cookie;    
      var dataArray=data.split("; ");    
      for(var i=0;i<dataArray.length;i++){    
        var varName=dataArray[i].split("=");    
        document.cookie=varName[0]+"=''; expires="+myDate.toGMTString();    
      }
    }
  },
  created(){
    this.ajaxUser();
    util.setTitle('设置');
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
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
    left: 0;
    z-index: 1000;
    p{
      font-size: 0.15rem;
      height: .53rem;
      line-height: .53rem;
      padding: 0 .32rem 0 .15rem;
    }
    .title{
      color:#9a9a9a;
    }
    .conent{
      background: #fff;
      border-top: 1px solid #ececec;
      color: #333;
      position: relative;
      span{
        float: right;
        color: #ccc;
      }
      &::after{
        content: '';
        display: inline-block;
        width: .07rem;
        height: .07rem;
        border-color: #999;
        border-width: 1px 1px 0 0;
        border-style: solid;
        transform: matrix(.71,.71,-.71,.71,0,0);
        position: absolute;
        top: 41%;
        right: 5%;
      }
    }
  }
  .outLogin{
    margin-top: .15rem;
    padding: 0;
    p{
      width: 100%;
      height: .5rem;
      line-height: .5rem;
      font-size: 0.16rem;
      background-color: #fff;
      text-align: center;
      color:#e22f2d;
    }
  }
}
	
</style> 