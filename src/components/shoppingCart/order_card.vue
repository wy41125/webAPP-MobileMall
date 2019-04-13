<template>  
  <div class="order_card">  
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'使用优惠券'"></headers>
    <div class="title" :style="$store.state.titleShow?'margin-top:.4rem':''">
      <ul>
        <li style="width:49%;" :class="Tabbar.available?'active':''" @click.stop="changeTabbar(4)">可用优惠券</li>
        <li style="width:49%;" :class="Tabbar.noAvailable?'active':''" @click.stop="changeTabbar(5)">不可用优惠券</li>
      </ul>
    </div>

    <div class="connet"> 
      <div class="data" v-if="isShow">
        <!-- 可用 -->
        <div v-if="Tabbar.available" class="available data_div">
          <div :class="widthType?widthType+' crad':' crad '" v-for="card in cards">
            <i class="clickButton" @click.stop="saveCardData(card,$event)"></i>
            <div class="data_data">
              <p class="data_data_one">{{card.cardType == 1?'¥':''}}<span>{{card.cardVal/100}}</span>{{card.cardType == 2?'折':''}}</p>
              <p class="data_data_two">
                <span>满{{card.minUsePrice/100}}元可用</span>
                <span>{{card.name}}</span>
              </p>
            </div>
            <div class="data_time">
              <span class="data_time_one">有效期：{{card.startTime}}-{{card.endTime}}</span>
            </div>
          </div>
        </div>
        <!-- 不可用 -->
        <div v-if="Tabbar.noAvailable" class="noAvailable data_div">
          <div :class="widthType?widthType+' crad noAvailable':' crad noAvailable'" v-for="card in nocards">
            <div class="data_data">
              <p class="data_data_one">{{card.cardType == 1?'¥':''}}<span>{{card.cardVal/100}}</span>{{card.cardType == 2?'折':''}}</p>
              <p class="data_data_two"> 
                <span>满{{card.minUsePrice/100}}元可用</span>
                <span>{{card.name}}</span>
              </p>
            </div>
            <div class="data_time">
              <p class="data_time_oneP"><span>有效期：{{card.startTime}}-{{card.endTime}}</span></p>
              <p class="data_time_twoP"><span>不可用原因：所结算商品中没有符合条件的商品</span></p>
            </div>
          </div>
        </div>
      </div>

      <div class="nodata" v-if="!isShow">
        <img src="../../assets/images/shopCart/card_empty@2x.png" alt="">
        <br>
        暂无优惠券
      </div>
    </div>
  </div>  
</template>  
  
<script>  
import {MessageBox} from 'mint-ui'
import headers from '../headers.vue'
import axios from 'axios'
import util from '@/libs/util' 
export default {  
  name: 'order_card',  
  data() {  
    return {  
      Tabbar:{
        available:false,
        noAvailable:false,
      },
      isShow:false,
      cardDate:[],//请求可用不可用卡券入参数据
      widthType:'',
      cards:[],
      nocards:[]
    };  
  },
  components:{
    headers:headers,
  },
  methods:{
    saveCardData(obj,e){
      let that =this,str='';
      str = JSON.stringify(obj);
      if(event.srcElement.className.indexOf('onclick')>=0){
        window.sessionStorage.setItem('cardStr','');
        event.currentTarget.className = 'clickButton';
      }else{
        window.sessionStorage.setItem('cardStr',str);
        event.currentTarget.className = 'clickButton onclick';
      }
      that.$router.go(-1);
    },
    changeTabbar(type){//顶部卡券切换
      switch(type){
        case 4:
          this.Tabbar.card = false;
          this.Tabbar.used = false;
          this.Tabbar.expired = false;
          this.Tabbar.available = true;
          this.Tabbar.noAvailable = false;
          this.ajaxCanuse(1);
          break;
        case 5:
          this.Tabbar.card = false;
          this.Tabbar.used = false;
          this.Tabbar.expired = false;
          this.Tabbar.available = false;
          this.Tabbar.noAvailable = true;
          this.ajaxCanuse(2);
          break;
      }
    },
    ajaxCanuse(type){//订单可用不可用卡券请求
      let that =this;
      if(window.sessionStorage.getItem('cardData')){
        let str = window.sessionStorage.getItem('cardData');
        let arr = str.split('&&');
        if(that.cardDate.length <= 0){
          for(let i in arr){
            let obj = JSON.parse(arr[i]);
            that.cardDate.push(obj);
          }
        }
        let data = {
          reqList:that.cardDate,
          status:type
        };
        let urlStr = util.getpost(data);
        axios({
          method:"post",
          url:"/customer/availableCard"+urlStr,
          dataType: 'json',
          data:data,
        }).then(response => {
          if(response.data.status == 0){
            console.log(response.data.body);
            if(response.data.body.length > 0){
              that.isShow = true;
              if(type == 1){//可用
                that.cards = [];
                that.cards = response.data.body;
              }else{
                that.nocards = [];
                that.nocards = response.data.body;
              }
            }else{
              that.isShow =false;
            }
          }else{
            that.isShow =false;
            if(response.data.status == 499){
              that.$router.push({name:'signInPage',query:{outLogin:'/'}});
            }else{
              MessageBox('系统提示',response.data.message);
            }
          }
        }).catch(oData => {
          MessageBox('系统提示',oData.data.message);
        })
      }
    }
  },
  created(){
    util.toTop();
    util.setTitle('使用优惠券');
    this.Tabbar.available=true;
    this.ajaxCanuse(1);
    window.sessionStorage.setItem('cardStr','无');//可用券为空
    if(window.innerWidth <= 320){
      this.widthType = 'height12';
    }else if(window.innerWidth >=414){
      this.widthType = 'height15';
    }
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
  @import '../../assets/less/order_card.less';
</style> 







