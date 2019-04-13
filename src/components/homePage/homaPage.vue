<template>
  <div>
    <div class="openApp" v-show="$store.state.jumpAppTime">
      <i class="Close" @click.stop="closeJump"></i>
      <b class="appIcon"></b>
      <p class="appName">
        <span class="name">晶杰之家APP</span>
        <!-- <span class="lib">立即领取APP新人专享499元礼包</span> -->
      </p>
      <span class="button" @click.stop="openAppFunc">立即打开</span>
    </div>
    <div class="homePage"> 
      <header :style="$store.state.jumpAppTime?'top:.5rem;':''">
        <i class="jj_icon"></i>
        <p class="input_p" @click.stop="$router.push({ name: 'customInput', params: { id: 'new' }});">
          <b class="input_icon"></b>
          <span>请输入商品名称查找</span>
        </p>
      </header>
      <!-- navbar -->
      <div class="positionTabbar" v-if="homePage.name" :style="$store.state.jumpAppTime?'top:.95rem;':''">
        <div class="navbarBox" id="navbardiv">
          <router-link class="Tabbarlink" to="/" tag="span">{{homePage.name}}</router-link>
          <router-link tag="span" class="Tabbarlink" v-for="(areas,index) in areaobj" :to="{path:'/areas',query: {name: areas.areaId,}}">{{areas.name}}</router-link>
        </div>
        <br style="clear:both;"/> 
      </div>
      <!-- data -->
      <router-view></router-view>
    </div> 
  </div>
   
</template>  
  
<script> 
import util from '@/libs/util' 
import Headers from '../headers.vue'
import axios from 'axios'
import {Toast,MessageBox} from 'mint-ui'
export default {  
  name: 'homePage',  
  data() {  
    return {  
      selected: '',
      homePage:{},
      areaobj:[],
    };  
  },
  methods: {
    areaAjax(){
      let that =this;
      let date = {};
      let urlStr = util.getpost(date);
      axios({
        method:"post",
        url:"/open/areaList"+urlStr,
        dataType: 'json',
        data:date
      }).then(response => {
        that.homePage = response.data.body[0];
        response.data.body.shift();
        that.areaobj = response.data.body;
        that.selected = that.homePage.areaId;
      }).catch(response => {
        if(response.data.status && response.data.status != 0){
          MessageBox('系统提示',response.data.message);
        }
      })
    },
    openAppFunc(){
      util.openApp();
    },
    closeJump(){
      this.$store.commit('addjumpAppTimeFunc');
    },
    funcTime(){
      let myDate = new Date();
      let year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
      let month = (Number(myDate.getMonth())+1)<10?'0'+(Number(myDate.getMonth())+1):(Number(myDate.getMonth())+1); //获取当前月份(0-11,0代表1月)
      let date = myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate(); //获取当前日(1-31)
      let local_jumpAppTime = year+month+date;
      if(Number(localStorage.getItem("jumpAppTime"))>=Number(local_jumpAppTime)){
        this.$store.commit('addjumpAppTimeFunc');
      }
    },
  },
  components:{
    headers:Headers,
  },
  created:function(){
    this.areaAjax();
    util.setTitle('晶杰之家');
    this.funcTime();
  },
  beforeCreate(){
    
  },
  beforeMount(){
    
  },
  mounted(){
    
  },
  beforeUpdate(){
    
  },
  updated(){
    
  },
  beforeDestroy(){
    
  },
  destroyed(){
    
  },
};  
</script>  
  
<style lang="less" scoped>  
  @import '../../assets/less/homePage.less';
  
  
  .openApp{
    font-size: .14rem;
    width: 100%;
    height: .5rem;
    background: #ddd;
    position: fixed;
    top: 0;
    left: 0;
    text-align: left;
    z-index: 1000;
    .Close{
      display: inline-block;
      width: .15rem;
      height: .15rem;
      background: url('../../assets/images/land/login_close@2x.png') no-repeat;
      background-size: .15rem;
      position: absolute;
      top: 35%;
      left: .1rem;
    }
    .appIcon{
      display: inline-block;
      width: .23rem;
      height: .23rem;
      background: url(../../assets/images/main_icon.png) no-repeat;
      background-size: .23rem;
      position: absolute;
      top: 25%;
      left: .3rem;
    }
    .appName{
      color: #fff;
      display: inline-block;
      text-align: left;
      margin-left: .65rem;
      margin-top: .05rem;
      line-height: .4rem;
      .name{
        display: block;
      }
      .lib{
        font-size: .12rem;
      }
    }
    .button{
      display: inline-block;
      width: .7rem;
      height: .5rem;
      line-height: .5rem;
      background-color: #E12E2E;
      color: #fff;
      position: absolute;
      top: 0;
      right: 0;
      text-align: center;
    }
  }
</style> 









