<template>  
  <div class="card">  
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'我的卡券'"></headers>
    <div class="title" :style="$store.state.titleShow?'margin-top:.45rem':''">
      <ul>
        <li :class="Tabbar.card?'active':''" @click.stop="changeTabbar(1)">未使用</li>
        <li :class="Tabbar.used?'active':''" @click.stop="changeTabbar(2)">已使用</li>
        <li :class="Tabbar.expired?'active':''" @click.stop="changeTabbar(3)">已过期</li>
      </ul> 
    </div>
    <div class="connet" :style="$store.state.titleShow?'margin-top:.95rem':'margin-top:.55rem'">
      <div class="data" v-if="isShow"> 
        <div v-if="Tabbar.card" class="data_div">
          <div :class="widthType?widthType+' crad':' crad'" v-for="card in cards">
            <div class="data_data">
              <p class="data_data_one">{{card.cardType == 1?'¥':''}}<span>{{card.cardValText}}</span>{{card.cardType == 2?'折':''}}</p>
              <p class="data_data_two">
                <span>{{card.name}}</span>
                <span><em v-if="card.minUsePrice/100 != 0">满{{card.minUsePrice/100}}元可用</em><em v-if="card.minUsePrice/100 == 0">无现金门槛</em></span>
              </p>
            </div>
            <div class="data_time">
              <span class="data_time_one">有效期：{{card.startTime}}-{{card.endTime}}</span>
              <span class="data_time_two" @click.stop="jumpGoodLIst(card.cardId)">查看可用商品></span>
            </div>
          </div>
        </div>

        <div v-if="Tabbar.used" class="data_div">
          <div :class="widthType?widthType+' crad used':' crad used'" v-for="card in cards">
            <div class="data_data">
              <p class="data_data_one">{{card.cardType == 1?'¥':''}}<span>{{card.cardValText}}</span>{{card.cardType == 2?'折':''}}</p>
              <p class="data_data_two">
                <span>{{card.name}}</span>
                <span><em v-if="card.minUsePrice/100 != 0">满{{card.minUsePrice/100}}元可用</em><em v-if="card.minUsePrice/100 == 0">无现金门槛</em></span>
              </p>
            </div>
            <div class="data_time">
              <span class="data_time_one">有效期：{{card.startTime}}-{{card.endTime}}</span>
              <!-- <span class="data_time_two" @click.stop="jumpGoodLIst(card.cardId)">查看可用商品></span>  -->
            </div>
          </div>
        </div>

        <div v-if="Tabbar.expired" class="data_div">
          <div :class="widthType?widthType+' crad expired':' crad expired'" v-for="card in cards" >
            <div class="data_data">
              <p class="data_data_one">{{card.cardType == 1?'¥':''}}<span>{{card.cardValText}}</span>{{card.cardType == 2?'折':''}}</p>
              <p class="data_data_two">
                <span>{{card.name}}</span>
                <span><em v-if="card.minUsePrice/100 != 0">满{{card.minUsePrice/100}}元可用</em><em v-if="card.minUsePrice/100 == 0">无现金门槛</em></span>
              </p>
            </div>
            <div class="data_time">
              <span class="data_time_one">有效期：{{card.startTime}}-{{card.endTime}}</span>
              <!-- <span class="data_time_two" @click.stop="jumpGoodLIst(card.cardId)">查看可用商品></span>  -->
            </div>
          </div>
        </div>
        
      </div>
      <div>
        
      </div>
      <div class="nodata" v-if="!isShow">
        <img src="../../../assets/images/shopCart/card_empty@2x.png" alt="">
        <br>
        暂无优惠券
      </div>
    </div>
    <navigation></navigation>
  </div>  
</template>  
  
<script> 
import navigation from '../../goods/navigation.vue' 
import headers from '../../headers.vue' 
import {MessageBox} from 'mint-ui'
import axios from 'axios'
import util from '@/libs/util' 
export default {  
  name: 'card',  
  data() {  
    return {  
      isShow:false,
      widthType:'',
      Tabbar:{
        card:false,
        used:false,
        expired:false,
        available:false,
        noAvailable:false,
      },
      cards:[],
    };  
  },
  components:{
    headers:headers,
    navigation:navigation,
  },
  methods:{
    jumpGoodLIst(id){//可用商品跳转商品列表页
      this.$router.push({name:'goodsList',query:{cardid:id}});
    },
    changeTabbar(type){//顶部卡券切换
      switch(type){
        case 1:
          this.Tabbar.card = true;
          this.Tabbar.used = false;
          this.Tabbar.expired = false;
          this.Tabbar.available = false;
          this.Tabbar.noAvailable = false;
          this.ajaxcard(1);
          break;
        case 2:
          this.Tabbar.card = false;
          this.Tabbar.used = true;
          this.Tabbar.expired = false;
          this.Tabbar.available = false;
          this.Tabbar.noAvailable = false;
          this.ajaxcard(2);
          break;
        case 3:
          this.Tabbar.card = false;
          this.Tabbar.used = false;
          this.Tabbar.expired = true;
          this.Tabbar.available = false;
          this.Tabbar.noAvailable = false;
          this.ajaxcard(3);
          break;
      }
    },
    ajaxcard(status){//我的卡券请求
      let that =this;
      let data = {
        status:status
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/customer/cardList"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          if(response.data.body.length == 0){
            that.isShow =false;
          }else{
            that.cards = response.data.body;
            that.isShow = true;
          }
        }else{
          that.isShow =false;
          if(response.data.status == 499){
            util.outLogin();
            that.$router.push({name:'signInPage',query:{outLogin:'/'}});
          }else{
            MessageBox('系统提示',response.data.message);
          }
          
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
  },
  created(){
    this.Tabbar.card=true;
    this.ajaxcard(1);
  	if(window.innerWidth <= 320){
      this.widthType = 'height12';
    }else if(window.innerWidth >=414){
      this.widthType = 'height15';
    }
    util.setTitle('我的卡券');
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
  @import '../../../assets/less/card.less';
</style> 







