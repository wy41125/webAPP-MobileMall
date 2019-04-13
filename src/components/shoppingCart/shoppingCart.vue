<template>  
  <div class="shoppingCart">  
    <header :style="!isShowData?'background:transparent;border-bottom:0px solid #ddd;':''">
      <em style='display: inline-block;width:10%;'></em> 
      <p style='display: inline-block;width:75%;text-align:center;'><em v-if="$store.state.titleShow" style="font-size:.17rem;">购物车</em></p>
      <em style='display: inline-block;width:10%;' @click.stop="$router.push({name:'coupons'})">领券</em>
    </header>
    <div v-if="isShowData" class="data">
      <div class="data_div">
        <!-- 单个商品html -->
        <div class="preBuy" v-for="good in ajaxGoods" v-if="good && !good.goodsList">
          <div class="goods">
            <span class="gouxuan">
              <i :class="quanxuanIcon?'onclick':''" v-for="card in shopCard" v-if="card.id == good.onlineId" @click.stop="clickYes(good.onlineId,good.salePrice,card.num,$event)"></i>
            </span>
            <div class="goodNameImg" >
              <div class="img" @click.stop="$router.push({name:'goodsDevele',query:{onlineId:good.onlineId}})">
                <img :src="good.imgUrl" alt="">
                <div class="mask" v-if="good.stock ==0">无货</div>
              </div> 
              
              <div class="goodName">
                <i class="delete" @click.stop="deleteGood(good,$event,0)"></i>
                <p class="goodName_name">{{good.goodsName}}</p>
                <p class="goodName_num">
                  <span>¥<em style="font-size:.18rem;">{{(good.salePrice/100).toFixed(2)}}</em></span>
                  <!-- <span><i>-</i><b v-for="card in shopCard" v-if="card.id == good.onlineId">{{card.num}}</b><i>+</i></span> -->
                  <el-input-number size="mini" v-for="card in shopCard" v-if="card.id == good.onlineId" v-model="card.num" @change="handleChange(card.id,good.salePrice,card.num,$event)" :min="1"></el-input-number> 
                </p> 
              </div>
            </div>
          </div>
          <div class="string">
            <p class="string_p_one" v-if="good.giftList && good.giftList.length>0" @click.stop="kongzhi(good.giftList)">促销 <span><i>赠品</i>{{good.giftList[0].goodsName}}（赠完为止）x{{good.giftList[0].num}}</span></p>
            <p class="string_p_two" v-if="good.opModel">支持 <span><i></i> <em v-if="good.opModel.indexOf('2')>=0">【送货上门】</em><em v-if="good.opModel.indexOf('3')>=0">【到店自提】</em></span></p>
          </div>
        </div>
        <!-- 套餐商品html -->
        <div class="package" v-for="good in ajaxGoods" v-if="good && good.goodsList">
          <div class="package_div" >
            <p class="package_title">
              <i :class="quanxuanIcon?'onclick':''" v-for="card in shopCard" v-if="card.id == good.packageId" @click.stop="clickYes(good.packageId,good.price,card.num,$event)"></i>
              <span>优惠套餐</span>{{good.packageName}}
              <!-- <span class="setPrice"><b>套餐价 <em style="color:#e12e2e;font-size:.12rem;">¥</em></b><em style="font-weight: bold;">{{(good.price/100).toFixed(2)}}</em></span> -->
              <b class="delete" @click.stop="deleteGood(good,$event,1)"></b>
            </p>
            <div class="package_goods">
              
              <div class="package_good" v-for="(list,index) in good.goodsList" @click.stop="$router.push({name:'goodsDevele',query:{onlineId:list.onlineId}})" :style="index==0?'border-top:0px solid #ddd;':''">
                <div class="img">
                  <img :src="list.imgUrl">
                  <!-- <div class="mask" v-if="">无货</div> -->
                </div>
                <div class=" goodName">
                  <p>{{list.goodsName}}</p>
                  <p class="two"><span><em style="font-size:.12rem;">原价</em>¥<em style="font-size:.18rem;">{{(list.salePrice/100).toFixed(2)}}</em></span></p> 
                </div>
              </div>

              <div class="price" style="height:30px;">
                <span><i>套餐价</i>¥<em style="font-size:.18rem;">{{(good.price/100).toFixed(2)}}</em></span>
                <el-input-number size="mini" v-for="card in shopCard" v-if="card.id == good.packageId" v-model="card.num" @change="handleChange(card.id,good.price,card.num,$event)" :min="1"></el-input-number>
              </div>
            </div>
          </div>
          <div class="string">
            <p class="string_p_one" v-if="good.giftList && good.giftList.length>0" @click.stop="kongzhi(good.giftList)">促销 <span><i>赠品</i>{{good.giftList[0].goodsName}}（赠完为止）x{{good.giftList[0].num}}</span></p>
            <p class="string_p_two" v-if="good.opModel">支持 <span><i></i><em v-if="good.opModel.indexOf('2')>=0">【送货上门】</em><em v-if="good.opModel.indexOf('3')>=0">【到店自提】</em></span></p>
          </div>
        </div>

      </div>
      <div class="Settlement" >
        <p>
          <span >
            <i :class="(xuanzhongNum == ajaxGoods.length)?'onclick':''" @click.stop="Select($event)"></i>
            全选
          </span>
          <span>
            合计：<i>¥{{Total}}</i>
          </span>
        </p>
        <p @click.stop="Settlement">结算<em v-if="TotalNUm.length!=0">({{TotalNUm.length}})</em></p>
      </div>
    </div>
 
    <!-- nodata -->
    <div v-if="!isShowData" class="nodata">
      <div class="nodata_img">
        <img src="../../assets/images/shopCart/shopcar_empty@2x.png" alt="">
        购物车还是空的哦
      </div>
      <div class="nodata_button" @click.stop="TohomePage">
        去逛逛
      </div>
    </div>
  
    <!-- 促销弹窗 -->
    <div v-if="tanchaungType" class="tcTongyi">
        <p>促销<i @click.stop="lookMone()"></i></p> 
        <ul>
          <li v-for="gift in tanchaungObj" v-if="gift.num!=0" @click.stop="jumpgood(gift.onlineId,gift.type)"><i>赠品</i>{{gift.goodsName}}（<em>赠完为止</em>）<span>x{{gift.num}}</span></li>
        </ul>
    </div>
  </div>  
</template>  
  
<script>  
import {Toast,MessageBox} from 'mint-ui' 
import Cookies from 'js-cookie';
import util from '@/libs/util' 
import axios from 'axios'
export default {   
  name: 'shoppingCart',  
  data() {  
    return {  
      isShowData:false,//控制数据有无显示状态
      shopCard:[],//客户保存本地的建议商品信息
      ajaxGoods:[],//接口获取过来的所有客户保存本地商品的详情信息
      num:3,
      goodsNum:null,
      Total:0,//合计
      xuanzhongNum:null,//选中商品数量
      quanxuanIcon:false,//全选
      TotalNUm:[],//客户勾选中的商品集合[{id:,num:}]
      tanchaungType:false,
      tanchaungObj:[],
      OBJobj:{},
    };  
  },
  methods:{
    kongzhi(arr){//赠品弹窗打开
      this.tanchaungType =true;
      this.tanchaungObj = arr;
    },
    lookMone(){//关闭弹窗
      this.tanchaungType =false;
      this.tanchaungObj = [];
    },
    jumpgood(id,type){//赠品跳转
      console.log(type);
      if(type == 1){
        this.lookMone();
        this.$router.push({name:'goodsDevele',query:{onlineId:id}});
      }
    },
    deleteGood(obj,e,num){//删除购物车该商品
      let vm = this;
      if(localStorage.getItem("shoppingCard")){
        let shopArr = localStorage.getItem("shoppingCard").split(',');//JSON.stringify(json);
        let newArr = [];
        for(var i in shopArr){
          if(obj.goodsList && shopArr[i].indexOf(obj.packageId)>=0){
            newArr = shopArr.splice(i,1);
          }else if(shopArr[i].indexOf(obj.onlineId)>=0){
            newArr = shopArr.splice(i,1);
          }
        }
        localStorage.setItem("shoppingCard",shopArr);
        vm.InitializationData();
        location.reload();
      }
    },
    Settlement(){//结算按钮处理事件
      let str = '',that =this,arr=[],obj={};
      if(that.TotalNUm.length<=0){Toast('请勾选具体的购买商品！');return}
      for(let i in that.TotalNUm){
        for(let b in that.ajaxGoods){
          if(that.ajaxGoods[b].onlineId == that.TotalNUm[i].id || that.ajaxGoods[b].packageId == that.TotalNUm[i].id){
            obj = that.ajaxGoods[b];
            obj.TotalCommodity = that.TotalNUm[i].num;
            if(obj.goodsList){
              obj.type=2;
              obj.id=obj.packageId; 
            }else{
              obj.type=1;
              obj.id=obj.onlineId;
            }
            arr.push(obj);
          }
        }
      }
      let nohaveThree =[],nohaveTwo =[];
      for(let a =0 ;a<arr.length; a++){
        if(arr[a].opModel.indexOf('3')<0){
          nohaveThree.push(a);
        }
        if(arr[a].opModel.indexOf('2')<0){
          nohaveTwo.push(a);
        }
      }
      if(nohaveThree.length>0 && nohaveTwo.length>0){
        Toast('所选中的商品取货方式冲突，请分别进行结算');
        return;
      }
      let canChoice = '';
      if(nohaveThree.length<=0){
        canChoice += '3';
      }
      if(nohaveTwo.length<=0){
        canChoice += '2';
      }
      for(let i in arr){
        if(i == arr.length-1){
          str+=JSON.stringify(arr[i]);
        }else{
          str+=JSON.stringify(arr[i])+'&&';
        }
      }
      window.sessionStorage.setItem('orderGoods',str);
      if(Cookies.get('VUE2SESSID')){
        this.$router.push({name:'confirmationOrder',query:{canChoice:canChoice}});
      }else{
        this.$router.push({name:'signInPage',query:{name:'confirmationOrder'}});
      }
    },
    Select(e){//全选按钮
      let that =this;
      if(e.srcElement.className.indexOf('onclick')>=0){
        that.quanxuanIcon = false;
        e.currentTarget.className = '';
        that.xuanzhongNum=0;
        that.TotalNUm=[];
      }else{
        that.quanxuanIcon = true;
        let arr = localStorage.getItem("shoppingCard").split(',');
        that.xuanzhongNum = arr.length;
        for(let b in arr){
          let obj = {};
          obj.id=arr[b].split('&')[0].split(':')[1];
          obj.num = (that.OBJobj[obj.id])*arr[b].split('&')[1].split(':')[1];
          that.TotalNUm.push(obj);
        }
        console.log(that.TotalNUm);
      }
      that.Totalbotton();
    },
    clickYes(ids,Price,num,e){//商品勾选事件
      let strNUm = null,that=this,obj={};
      if(e.srcElement.className.indexOf('onclick')>=0){
        that.xuanzhongNum--;
        e.currentTarget.className = '';
        let arr = that.TotalNUm;
        for(let i=0 ;i<arr.length;i++){
          if(arr[i].id == ids){that.TotalNUm.splice(i,1);}
        }
      }else{
        that.xuanzhongNum++;
        e.currentTarget.className = 'onclick';
        obj["id"] = ids;//商品id
        obj["num"] = Price*num;//单个商品总价
        that.TotalNUm.push(obj);
      }
      that.Totalbotton();
    },
    Totalbotton(id,num){//底部合计、结算数量显示处理事件
      let that = this;
      that.Total=0;
      if(id){//有id入值，handleChange
        for(let i in that.TotalNUm){
          if(that.TotalNUm[i].id == id){
            that.TotalNUm[i].num = num;
            if(that.TotalNUm[i].num<0){that.TotalNUm[i].num = 0;}
          }
        }
      }
      for(let i in that.TotalNUm){
        that.Total+=that.TotalNUm[i].num;
      }
      that.Total = that.Total/100;
    },
    TohomePage(){//无数据，去逛逛跳转事件
      window.sessionStorage.setItem('tabbar','homepage');
      // location.reload(); 
      this.$router.push({path:'/'});
    },
    handleChange(id,Price,num,e) {//商品数量加减处理事件
      let that =this; 
      that.Totalbotton(id,Price*e);
      that.$store.commit('addthisGoodNum',e);
      if(localStorage.getItem("shoppingCard")){
        let shopArr = localStorage.getItem("shoppingCard").split(',');//JSON.stringify(json);
        for(var i in shopArr){
          if(shopArr[i].indexOf(id)>=0){
            let str = shopArr[i].split('&')[0]+'&num:'+e+'&'+shopArr[i].split('&')[2];
            shopArr.splice(i,1);
            shopArr.push(str);
            localStorage.setItem("shoppingCard",shopArr);
          }
        } 
      }
    },
    ajaxShoppCard(){//初始化请求购物车商品详情
      let that =this;
      let data = that.shopCard;
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/goods/open/shoppingCart"+urlStr,
        dataType: 'json', 
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          if(response.data.body.length>=0){
            that.isShowData=true;
            that.ajaxGoods = response.data.body;
            let obj ={};
            for(let i in that.ajaxGoods){
              if(that.ajaxGoods[i].packageId){
                obj[that.ajaxGoods[i].packageId] = that.ajaxGoods[i].price;
              }else if(that.ajaxGoods[i].onlineId){
                obj[that.ajaxGoods[i].onlineId] = that.ajaxGoods[i].salePrice;
              }
            }
            that.OBJobj = obj;
            that.panduanFunc();
          }else{
            that.isShowData=false;
          }
        }else{
          if(response.data.status == 499){
            that.isShowData=false;
            that.$router.push({name:'signInPage',query:{outLogin:'/'}});
          }else{
            that.isShowData=false;
            MessageBox('系统提示',response.data.message);
          }
        }
      }).catch(oData => {
        that.isShowData=false;
        MessageBox('系统提示',oData.data.message);
      })
    },
    panduanFunc(){
      let that = this;
      let shopArr = localStorage.getItem("shoppingCard").split(','),strId='';
      for(let i in that.ajaxGoods){
        if(that.ajaxGoods[i].packageId){
          strId +=that.ajaxGoods[i].packageId+',';
        }else if(that.ajaxGoods[i].onlineId){
          strId +=that.ajaxGoods[i].onlineId+',';
        }
      }
      for(let b= 0;b<shopArr.length ;b++){
        if(strId.indexOf(shopArr[b].split('&')[0].split(':')[1])<0){
          shopArr.splice(b,1);
        }
      }
      // console.log(shopArr);
      localStorage.setItem("shoppingCard",shopArr);
    },
    InitializationData(){//初始化数据处理
      // localStorage.clear();
      let that = this;
      if(localStorage.getItem("shoppingCard")){
        that.isShowData = true;
        let shopArr = localStorage.getItem("shoppingCard").split(',');
        that.shopCard = [];
        for(let i in shopArr){
          let obj ={};
          obj.id = shopArr[i].split('&')[0].split(':')[1];// var arr=['id:12222&num:12','id:12222&num:12'];
          obj.num = shopArr[i].split('&')[1].split(':')[1];
          obj.type = shopArr[i].split('&')[2].split(':')[1];
          that.shopCard.push(obj);
        }
        that.ajaxShoppCard();
      }else{
        that.isShowData = false;
      }
    },
  },
  created(){
    this.InitializationData();
    util.toTop();
    util.setTitle('购物车');
    let body = document.body;
    body.style="height:0%;";
    window.sessionStorage.removeItem('cardStr');
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
  },
  components:{
    
  },
  watch:{
    
  }
};  
</script>  
  
<style lang="less" scoped>   
  @import '../../assets/less/shoppingCart.less';
  .tcTongyi{
      width: 100%;
      height:3rem;
      background: #fff;
      overflow: scroll;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 1000;
      border-top: 1px solid #ececec;
      p{
        width: 100%;
        height: @footerBotton;
        line-height: @footerBotton;
        text-align: center;
        position: absolute;
        font-size: @twoFontSize;
        border-bottom: 1px solid @segmentingLin;
        top: 0;
        left: 0;
        i{
          width: 0.2rem;
          height: 0.2rem;
          display: inline-block;
          position: absolute;
          top: 25%;
          right: 5%;
          background: url(../../assets/images/goods/product_box_close@2x.png) no-repeat;
          background-size: 0.2rem;
        }
      }
      ul{
        margin-top: 0.5rem;
        width: 100%;
        li{
          border-bottom: 1px solid @segmentingLin;
          padding: @padding010 0 @padding010 @padding015;
          font-size: @threeFontSize;
          text-align: left;
          color: #000;
          position:relative;
          i{
            display: inline-block;
            border: 1px solid #dd1413;
            color: #dd1413;
            margin-right: @padding010;
          }
          span{
            color: #ddd;
          }
          &::after{
            content: '';
            display: inline-block;
            width: 0.1rem;
            height: 0.1rem;
            border-style: solid;
            border-width: 1px 1px 0 0;
            border-color: @rightArrow;
            position: absolute;
            top: 35%;
            right: 5%;
            transform: matrix(.71,.71,-.71,.71,0,0);
          }
        }
      }
      .areas,.yes{
        display: inline-block;
        vertical-align: top;
      }
      .areas{
        width: 75%;
      }
      .yes{
        width: 20%;
        padding-top: .1rem;
      }
    }
</style> 











