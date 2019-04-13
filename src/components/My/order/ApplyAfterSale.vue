<template>  
  <div class="ApplyAfterSale confirmationOrder" :style="!hasData?'background:#fff;'+pageheight:''">  
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'申请售后'"></headers>
    <div v-if="hasData" :style="$store.state.titleShow?'margin-top:.4rem':''">
      <!-- 订单状态 -->
      <p class="title">当前订单以下商品可申请售后：</p>
      <!-- 订单商品信息 -->
      <div class="order"> 
        <div class="order_goods">
          <div class="baoguo" v-for="good in orderGoodObj" v-if="!good.packageDetails && good.num>0">
            <div :class="(detailIdArr.indexOf(good.detailId)>=0 || quanxuanbs)?'active good_div':'good_div'" @click.stop="gouxuan(good.detailId,$event,good)">
              <div class="goodXinxi" >
                <div class="goodXinxi_img">
                  <img :src="good.imgUrl">
                </div>
                <div class="goodXinxi_name">
                  <p class="goodXinxi_name_oneP">{{good.goodsName}}</p>
                  <p class="goodXinxi_name_twoP">¥{{(good.salePrice/100).toFixed(2)}}<i>x{{good.num}}</i></p>
                </div>  
              </div>
              <p class="gift" v-if="good.giftReturn && good.giftReturn.length>0" v-for="gift in good.giftReturn">【赠品】{{gift.goodsName}}<i>x{{gift.num}}</i></p>
            </div>
            <p class="youhuiquan" v-if="good.discountPrice && good.discountPrice!=''">优惠券折后可退金额：¥{{(good.discountPrice/100).toFixed(2)}}</p> 
            <p class="youhuiquan" v-if="!(good.discountPrice && good.discountPrice!='')">可退金额：¥{{(good.salePrice/100).toFixed(2)}}</p>
          </div>
          <div class="baoguo" v-for="good in orderGoodObj" v-if="good.packageDetails && good.num>0">
            <div :class="(detailIdArr.indexOf(good.detailId) || quanxuanbs)?'active good_div':'good_div'" @click.stop="gouxuan(good.detailId,$event,good)">
              <p class="package_p"><i>优惠套餐</i>{{good.packageName}}</p>
              <div class="goodDele">
                <p v-for="item in good.packageDetails">
                  <img :src="item.imgUrl" alt=""/>
                  <span>{{item.goodsName}}</span>
                </p>
              </div>
              <p class="setPrice">¥{{(good.salePrice/100).toFixed(2)}}<i>x{{good.num}}</i></p>
              <p class="gift" v-if="good.giftReturn && good.giftReturn.length>0" v-for="gift in good.giftReturn">【赠品】{{gift.goodsName}}<i>x{{gift.num}}</i></p>
            </div>
            <p class="youhuiquan" v-if="good.discountPrice && good.discountPrice!=''">优惠券折后可退金额：¥{{(good.discountPrice/100).toFixed(2)}}</p>
            <p class="youhuiquan" v-if="!(good.discountPrice && good.discountPrice!='')">可退金额：¥{{(good.salePrice/100).toFixed(2)}}</p>
          </div>
          
        </div>
      </div>
      <!-- footer_botton -->
      <div class="footer_botton">
        <p><i @click.stop="quanxuan($event)" :class="orderGoodObj.length == detailIdArr.length?'active':''"></i>全选</p>
        <span class="button" @click.stop="jumpPage(2)">换货</span>
        <span class="button" @click.stop="jumpPage(1)">退货</span>
      </div>
    </div>
    
    <!-- 没有数据显示 -->
    <div class="noData" v-if="!hasData">
      <p>
        <img src="../../../assets/images/order/after-sales_empty@2x.png" alt=""> 
        您还没有可售后商品哦
      </p>
    </div>
  </div>   
</template>  
  
<script>  
import headers from '../../headers.vue'
import {Toast,MessageBox} from 'mint-ui'
import axios from 'axios'
import util from '@/libs/util' 
export default {  
  name: 'ApplyAfterSale',  
  data() {  
    return {  
      orderId:null,//订单ID
      orderGoodObj:[],
      hasData:false,//是否有数据
      detailIdArr:[],//退换货商品订单id集合
      quanxuanbs:false,//全选标示
      pageheight:'',
    };  
  },
  components:{
    headers:headers,
  },
  created(){
    this.orderId = this.$route.query.orderId;
    this.ajaxOrderDetail();
    util.setTitle('申请售后');
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
    this.pageheight = 'height:'+window.innerHeight+'px';
  },
  methods:{
    jumpPage(type){//跳转申请页面
      if(this.detailIdArr.length<=0){
        Toast('请勾选需要申请的商品！');
        return;
      }
      let str = encodeURIComponent(this.detailIdArr.join(','));
      this.$router.push({name:'apply',query:{orderId:this.orderId,orderDetailIds:str,type:type}});
    },
    quanxuan(e){//全选
      let vm = this;
      if(e.srcElement.className.indexOf('active')>=0){
        e.currentTarget.className = '';
        vm.detailIdArr=[];
        vm.quanxuanbs = false;
      }else{
        vm.quanxuanbs = true;
        e.currentTarget.className = 'active';
        vm.detailIdArr=[];
        for(let i in vm.orderGoodObj){
          let str = '';
          if(vm.orderGoodObj[i].discountPrice && vm.orderGoodObj[i].discountPrice !=''){
            str = vm.orderGoodObj[i].detailId+'#'+vm.orderGoodObj[i].discountPrice;
          }else{
            str = vm.orderGoodObj[i].detailId+'#'+vm.orderGoodObj[i].salePrice;
          }
          vm.detailIdArr.push(str);
        }
      }
      console.log(this.detailIdArr);
    },
    gouxuan(id,e,goodObj){//单个商品勾选
      let newArr =[];
      if(e.srcElement.className.indexOf('active')>=0){
        e.currentTarget.className = 'good_div';
        for(let i in this.detailIdArr){
          if(this.detailIdArr[i].toString().indexOf(id)>=0){
            this.detailIdArr.splice(i,1);
          }
        }
      }else{
        e.currentTarget.className = 'good_div active';
        if(this.detailIdArr.length>0){
          for(let i in this.detailIdArr){
            if(this.detailIdArr[i].toString().indexOf(id)>=0){}else{
              let str = '';
              if(goodObj.discountPrice && goodObj.discountPrice != ''){
                str = id+'#'+goodObj.discountPrice;
              }else{
                str = id+'#'+goodObj.salePrice;
              }
              this.detailIdArr.push(str);
            }
          }
        }else{
          let str = '';
          if(goodObj.discountPrice && goodObj.discountPrice != ''){
            str = id+'#'+goodObj.discountPrice;
          }else{
            str = id+'#'+goodObj.salePrice;
          }
          this.detailIdArr.push(str);
        }
      }
      console.log(this.detailIdArr);
    },
    jumpGood(id){//商品跳转商品详情
      this.$router.push({name:'goodsDevele',query:{onlineId:id}});
    },
    ajaxOrderDetail(){
      let that =this;
      let data = {
        "orderId":that.orderId
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/order/goToAfterSale"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          that.orderGoodObj = response.data.body;
          if(response.data.body && response.data.body.length>0){
            that.hasData=true;
          }else{
            that.hasData=false;
          }
        }else{
          if(response.data.status = 499){//token失效或没有token
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
   
};  
</script>  
  
<style lang="less" scoped>   
  @import '../../../libs/commnd.less';
  @import '../../../assets/less/confirmationOrder.less';
  @import '../../../assets/less/ApplyAfterSale.less';
</style> 





















