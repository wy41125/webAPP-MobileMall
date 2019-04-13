<template>  
  <div class="package">  
    <!-- 顶部购物车跳转 -->
    <header class="header">
      <span><i class="goback" v-if="$store.state.titleShow" @click.stop="$router.go(-1)"></i></span>
      <span class="titleName"><b v-if="$store.state.titleShow">优惠套餐</b></span>
      <em @click.stop="jumpShop"></em>
    </header>
    <!-- 数据 -->
    <div class="packages">
      <div ref="package" class="package" v-for="(item,index) in items">
        <p class="packageName" @click.stop="switchShow($event,index)"><em>优惠套餐</em><i>{{item.packageName}}</i><span>¥{{(item.price/100).toFixed(2)}}</span></p>
        <div class="packageImg" >
          <p class="packageImg_p" v-for="(good,index) in item.goodsList" @click.stop="$router.push({name:'goodsDevele',query:{onlineId:good.onlineId}})">
            <img :src="good.imgUrl" @click.stop="">  
            <em v-if="index != item.goodsList.length-1">+</em>
          </p>
        </div> 
        <div class="packageGoods">
          <div class="packageGood" v-for="(good,index) in item.goodsList" @click.stop="$router.push({name:'goodsDevele',query:{onlineId:good.onlineId}})">
            <div class="packageGood_img"> 
              <img :src="good.imgUrl">
              <p class="mask" v-if="item.stock ==0">无货</p>
            </div>
            <div class="packageGood_data">
              <p>{{good.goodsName}}</p>
              <p>已选：{{good.specs}}</p>
              <p>原价：¥{{(good.salePrice/100).toFixed(2)}}</p>
            </div>
          </div>
          <p class="packageGoods_button">
            <el-input-number v-model="num1" @change="handleChange" :min="1" size="mini" label="描述文字"></el-input-number>
            <button @click.stop="addShop(item,num1)">加入购物车</button>
            <button :class="item.stock==0?'disabled':''" @click.stop="buy(item,num1)">立即购买</button>
          </p>
        </div>
      </div>
    </div>

    <navigation></navigation>
  </div>   
</template>  
  
<script> 
import navigation from './navigation.vue'  
import VDistpicker from 'v-distpicker'
import {Toast,MessageBox} from 'mint-ui'
import Cookies from 'js-cookie';
import util from '@/libs/util' 
import axios from 'axios'
export default {  
  name: 'package',  
  data() {  
    return {  
      items:[],
      num1:null,
    };  
  },
  props:{
    
  },
  created(){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    let str = window.sessionStorage.getItem('good_package');
    let arr = str.split('&&');
    for(let i in arr){
      let obj = JSON.parse(arr[i]);
      this.items.push(obj);
    }
    window.sessionStorage.removeItem('cardStr');
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
  },
  mounted(){
    
  },
  components:{
    navigation:navigation,
  },
  methods:{
    buy(obj,num){//立即购买
      if(obj.stock == 0){
        return;
      }
      let str = '',that =this,arr=[],Obj={};
      Obj = obj;
      Obj.TotalCommodity = obj.price*num;
      Obj.type=2;
      Obj.id=obj.packageId;
      arr.push(Obj);
      for(let i in arr){
        if(i == arr.length-1){
          str+=JSON.stringify(arr[i]);
        }else{
          str+=JSON.stringify(arr[i])+'&&';
        }
      }

      window.sessionStorage.setItem('orderGoods',str);
      if(Cookies.get('VUE2SESSID')){
        this.$router.push({name:'confirmationOrder',query:{source:'package',canChoice:Obj.opModel}});
      }else{
        this.$router.push({name:'signInPage'});
      }
    },
    addShop(obj,num){//加入购物车
      let shopArr =[];
      //购物车商品数据
      if(localStorage.getItem("shoppingCard")){
        shopArr = localStorage.getItem("shoppingCard").split(',');//shopArr=['id:12222&num:12','id:12222&num:12'];
        if(localStorage.getItem("shoppingCard").indexOf(obj.packageId) >= 0){
          for(let i in shopArr){//该元素在tmp内部不存在才允许追加
            if(shopArr[i].indexOf(obj.packageId)>=0){
              let Num = Number(shopArr[i].split('&')[1].split(':')[1])+num;
              shopArr[i]='id:'+shopArr[i].split('&')[0].split(':')[1]+'&num:'+Num+'&type:'+shopArr[i].split('&')[2].split(':')[1];
            }
          }
        }else{
          shopArr.push('id:'+obj.packageId+'&num:'+num+'&type:'+2);
        }
      }else{
        shopArr.push('id:'+obj.packageId+'&num:'+num+'&type:'+2);
      }
      localStorage.setItem("shoppingCard",shopArr);
      this.$store.commit('changeTanchaungType',5);//购物车弹窗开关控制
      for(let i in shopArr){
        if(shopArr[i].indexOf(this.$store.state.goodId)>=0){
          this.$store.commit('addShpCardNum',shopArr[i].split('&')[1].split(':')[1]);
        }
      }
      Toast('成功加入购物车');
    },
    handleChange(value){
      
    },
    switchShow(e,i){//套餐显示控制
      let that =this;
      if(e.srcElement.className.indexOf('packageName')>=0){
        if(e.srcElement.className.indexOf('onclick')>=0){
          e.currentTarget.className = 'packageName';
          that.$refs.package[i].className='package';
        }else{
          e.currentTarget.className = 'packageName onclick';
          that.$refs.package[i].className = 'package packageshow';
          // e.path[1].className='package packageshow';
        }
      }
    },
    jumpShop(){//跳转购物车
      window.sessionStorage.setItem('tabbar','shoppingCart');
      this.$router.replace({path:'/shoppingCart'});
    }
  }, 
};  
</script>  
  
<style lang="less" scoped>   
  @import '../../assets/less/package.less';
  // .transfrom{
  //     width: 200px;
  //     height: 200px;
  //     background: yellow;
  //     animation: rotatefresh 1s;
  //     // transform-origin: 100% 50%;
  //     // -webkit-transform-origin: 100% 50%;
  //     // animation:3s linear 0s myrotate;
  //     // -webkit-animation:3s linear 0s myrotate;/* Safari and Chrome */
  //     // animation-fill-mode:forwards;/*动画播放完毕时停止，不回到初始状态*/
  //     // -webkit-animation-fill-mode:forwards;
  // }
  // @keyframes rotatefresh {
  //           from { transform: rotate(0deg) }
  //           to {
  //               transform: rotate(90deg);
  //               transition: all 0.6s;
  //           }
  //       }
  // @keyframes myrotate{
  //     form {transform:rotateX(0deg);}    
  //     to    {transform:rotateX(90deg);}
  // }
  // @-webkit-keyframes myrotate{/* Safari and Chrome */
  //     form {transform:rotateX(0deg);}    
  //     to    {transform:rotateX(180deg);}
  // }
</style> 