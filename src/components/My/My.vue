<template>  
  <div class="My">  
    <header class="headerDiv" style="padding-bottom:.25rem;">
    	<p class="title"><i @click.stop="changeToset"></i></p>
    	<div class="user" :style="imgShow?'position: relative;':''">
    		<p >
    			<img v-if="!imgShow || userImg==''" src="../../assets/images/goods/default@2x.png" height="66" width="66" @click.stop="$router.push({name:'signInPage',query:{'name':'my'}})">
    			<img v-if="imgShow&& userImg!=''" :src="userImg" @click.stop="$router.push({name:'userInfor'})">
    		</p>
    		<p :style="imgShow?'position: absolute;top: 20px;':''">
    			<span v-if="!imgShow" ><em @click.stop="$router.push({name:'signInPage',query:{'name':'my'}})">登录</em> | <em @click.stop="$router.replace({name:'register1',query:{'name':'my'}})">注册</em></span>
    			<span v-if="imgShow"><em style="font-size:.16rem;">{{userName}}</em><br><em style="font-size:.12rem;">积分：{{integral}}</em></span>
    		</p>
    	</div>
    </header>
    <div class="userOrder"> 
    	<p><span style="font-weight: bold;">我的订单</span><span @click.stop="jumpOrder(0)" style="font-size:.12rem;">全部订单</span><i style="margin-bottom:.05rem;"></i></p>
    	<div><img src="../../assets/images/my/homepage/Tobepaid@2x.png" @click.stop="jumpOrder(1)"><br>待支付<b class="tishiNum" v-if="waitPayOrderNum && waitPayOrderNum>0">{{waitPayOrderNum}}</b></div>
    	<div><img src="../../assets/images/my/homepage/Forthegoods@2x.png" @click.stop="jumpOrder(2)"><br>待收货<b class="tishiNum" v-if="waitReceiveOrderNum && waitReceiveOrderNum>0">{{waitReceiveOrderNum}}</b></div>
    	<div><img src="../../assets/images/my/homepage/completed@2x.png" @click.stop="jumpOrder(3)"><br>已完成</div>
    	<div><img src="../../assets/images/my/homepage/after-sales@2x.png" @click.stop="jumpOrder(4)"><br>售后申请</div>
    </div>
  	<div class="userColumn">
  		<p @click.stop="changePage('lqzx')"><img src="../../assets/images/my/homepage/Couponredemption@2x.png" ><br>领券中心</p>
  		<p @click.stop="changePage('jjzj')"><img src="../../assets/images/my/homepage/stores@2x.png" ><br>晶杰之家门店</p>
  		<p @click.stop="changePage('wdkq')"><img src="../../assets/images/my/homepage/Cardvoucher@2x.png" ><br>我的卡券</p>
  		<p @click.stop="changePage('wdsc')"><img src="../../assets/images/my/homepage/collection@2x.png" ><br>我的收藏</p>
  		<!-- <p @click.stop="changePage('glzh')"><img src="../../assets/images/my/homepage/Associatedaccount@2x.png" ><br>关联账号</p> -->
  		<p @click.stop="changePage('dzgl')"><img src="../../assets/images/my/homepage/address@2x.png" ><br>地址管理</p>
      <p @click.stop="changePage('help')"><img src="../../assets/images/my/homepage/address@2x.png" ><br>帮助与反馈</p>
  	</div>
    
  </div>  
</template>    
  
<script>  
import {MessageBox} from 'mint-ui'
import Cookies from 'js-cookie';
import axios from 'axios'
import util from '@/libs/util' 
export default {  
  name: 'My',  
  data() {  
    return {  
      imgShow:false,//显示用户自己的头像
      isLoginShow:false,
      userName:'',
      userImg:'',
      hasPassword:'',
      integral:'',
      waitPayOrderNum:'',//带支付订单数 
      waitReceiveOrderNum:'',//待收货订单数
    };  
  },
  methods:{
    jumpOrder(str){
      if(Cookies.get('VUE2SESSID')){
        if(str == 4){
          this.$router.push({name:'customerList'})
        }else{
          this.$router.push({name:'order',query:{type:str}})
        }
      }else{
        this.$router.push({name:'signInPage'});
      }
    },
    changePage(type){
      switch(type){
        case 'lqzx':
          this.$router.push({name:'coupons'});
          break;
        case 'jjzj':
          this.$router.push({name:'storePage'});
          break;
        case 'wdkq':
            this.$router.push({name:'card'});
          break;
        case 'wdsc':
            this.$router.push({name:'collection'});
          break;
        case 'glzh':
          this.$router.push({name:''});
          break;
        case 'dzgl':
            this.$router.push({name:'addlessList'});
          break;
        case 'help':
            this.$router.push({name:'problemList'});
          break;
      }
    },
  	changeToset(){
  		if(this.isLoginShow){
  			this.$router.push({'name':'userInformetion',query:{'hasPassword':this.hasPassword,userName:this.userName}});
  		}else{
        this.$router.push({name:'signInPage',query:{'orderId':'/'}});
  			// MessageBox('系统提示','请先登录！');
  		}
  	},
  	isLogin(){//判断是否已经登录
  		let that = this;
	  	let arr, reg = new RegExp('(^| )VUE2SESSID=([^;]*)(;|$)');
	    arr = document.cookie.match(reg);
	    if(arr){//有token，请求客户的资料
	    	that.imgShow = true;
	    	that.isLoginShow = true;
	    	that.ajaxUser();
	    }else{
	    	that.isLoginShow = false;
	    	that.imgShow = false;
	    }
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
          that.imgShow = true;
          if(response.data.body.headimgUrl){
            that.userImg = response.data.body.headimgUrl;//user头像
          }else{
            that.userImg = '';
          }
          if(response.data.body.pointValue){
            that.integral = response.data.body.pointValue;//积分
          }else{
            that.integral = 0;
          }
          that.userName = response.data.body.nickName;//user昵称
          if(response.data.body.hasPassword && response.data.body.hasPassword == 1){//是否有密码
            that.hasPassword = 1;
          }else{
            that.hasPassword = 0;
          }
          
          that.waitPayOrderNum = response.data.body.waitPayOrderNum;
          that.waitReceiveOrderNum = response.data.body.waitReceiveOrderNum;
        }else{
          that.imgShow = false;
          // MessageBox('系统提示',response.data.message);
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
  	}
  },
  created(){
  	this.isLogin();
    util.toTop();
    util.setTitle('会员中心');
  },
  beforeRouteUpdate(to,from,next){
    
  }
};  
</script>  
  
<style lang="less" scoped>   
	@import '../../assets/less/My.less';
</style> 