<template>  
  <div class="addlessList"> 
    <div class="title">
      <span><i class="goback" v-if="$store.state.titleShow" @click.stop="$router.go(-1)"></i></span>
      <span class="titleName"><em v-if="$store.state.titleShow" style="font-size:15px;">地址管理</em></span>
      <span class="titleClick" @click.stop="jumpPage()">新增地址</span>
    </div>
    <div class="address_div" :style="!isShow?'height:'+heightStr+'px;':''">
      <div class="addressList" v-if="isShow">
        <div :class="address.defaultFlag==1?'address default':'address'" v-for="(address,index) in addresss" @click.stop="SaveLocalAddress(addresss[index])">
          <i v-if="$route.query.source == 'changeOrder'" :class="xuanzeId==address.addrId?'click active':'click'" @click.stop="baocunadd(address.addrId)"></i>
          <p :class="$route.query.source == 'changeOrder'?'addName padd':'addName'">
            <span>{{address.name}}</span>
            <span>{{address.phoneNo}}</span>
            <span v-if="$route.query.source != 'changeOrder'">
              <em @click.stop="jumpPage(address.addrId,address.name,address.phoneNo,address.province,address.city,address.county,address.address,address.defaultFlag,address.postCode)"><i></i>编辑</em>
              <em @click.stop="deleteAddress(address.addrId,index)"><i></i>删除</em>
            </span> 
          </p>
          <p :class="$route.query.source == 'changeOrder'?'addStr padd':'addName'"><i v-if="address.defaultFlag == 1">默认</i>{{address.province}}{{address.city}}{{address.county}}{{address.address}}</p>
        </div>
      </div>
      <div v-if="!isShow" class="nodata">
        <img src="../../../assets/images/shopCart/location_empty@2x.png" alt="">
        <span>您还没有收货地址，请点击右上角新增</span>
      </div>
    </div>  
    <button v-if="$route.query.source == 'changeOrder'" class="addButton" @click.stop="yesChange">确认修改</button>
    <navigation></navigation>
  </div>  
</template>  
  
<script>
import navigation from '../../goods/navigation.vue'  
import {Toast,MessageBox} from 'mint-ui'
import axios from 'axios'
import util from '@/libs/util' 
export default {  
  name: 'addlessList',  
  data() {  
    return {  
      isShow:false,
      addresss:[],
      xuanzeId:null,//选中地址ID
      heightStr:null,
    };  
  },
  components:{
    navigation:navigation,
  },
  methods:{
    yesChange(){//修改地址
      let that =this;
      let data = {
        "orderId":that.$route.query.orderId,  //(描述：订单id 、类型：Long、是否必填：N)
        "addressId":that.xuanzeId  //(描述：收货地址id 、类型：Long、是否必填：N)
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/order/updateReceivingAddress"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          Toast('修改成功！');
          that.$router.go(-1);
        }else{
          MessageBox('系统提示',response.data.message);
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
    baocunadd(id){//勾选地址
      this.xuanzeId = id;

    },
    SaveLocalAddress(obj){//保存本地地址
      if(this.$route.query.source){
        window.sessionStorage.setItem('addStr',JSON.stringify(obj));
        this.$router.go(-1);
      }
    },
    jumpPage(addrId,name,phoneNo,province,city,county,address,defaultFlag,postCode){//跳转编辑地址页面
      if(addrId){
        this.$router.push({name:'changeAddless',query:{addrId:addrId,name:encodeURIComponent(name),phoneNo:encodeURIComponent(phoneNo),province:encodeURIComponent(province),city:encodeURIComponent(city),county:encodeURIComponent(county),address:encodeURIComponent(address),defaultFlag:defaultFlag,postCode:postCode}});
      }else{
        this.$router.push({name:'changeAddless'});
      }
    },
    deleteAddress(addrId,index){//删除地址
      let that =this;
      let data = {
        addrId:addrId
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/deliverAddr/delete"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          that.addresss.splice(index,1);
          Toast('删除成功！');
          if(that.addresss.length == 0){
            that.isShow = false;
          }else{
            that.isShow = true;
          }
        }else{
          MessageBox('系统提示',response.data.message);
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
    ajaxAddress(){//查询地址列表
      let that =this;
      let data = {};
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/deliverAddr/list"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          if(response.data.body.length == 0){
            that.isShow = false;
          }else{
            that.isShow = true;
            that.addresss = response.data.body;
          }
        }else{
          that.isShow = false;
          if(response.data.status = 499){//token失效或没有token
            that.$router.push({name:'signInPage',query:{outLogin:'/'}});
          }else{
            MessageBox('系统提示',response.data.message);
          }
        }
        response.data.body
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    }
  },
  created(){
  	this.ajaxAddress();
    util.setTitle('地址管理');
    this.heightStr = window.innerHeight-45;
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
  },
  beforeRouteUpdate(to,from,next){
    
  }
};  
</script>  
  
<style lang="less" scoped>   
	.addlessList{
    width: 100%;
    height: 100%;
    font-size: 0.12rem;
    background-color: #fff;
    .title{
      background: #fff;
      width: 94%;
      padding: 0.1rem 3% 0.1rem 3%;
      font-size: 0.14rem;
      text-align: right;
      border-bottom: 1px solid #ececec;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
      .goback{
        display: inline-block;
        width: .1rem;
        height: .1rem;
        border-style: solid;
        border-color: #333;
        border-width: 1px 1px 0 0;
        transform: matrix(-.71,.71,.71,.71,0,0);
        float: left;
        margin-top: .03rem;
      }
      .titleName{
        display: inline-block;
        width: 70%;
        text-align: center;
      }
    }
    .address_div{
      margin-top: 0.4rem;
      width: 100%;
      height: 100%;
      .addressList{
        width: 100%;
        height: 100%;
        .address{
          background: #fff;
          padding: 0.1rem 0.15rem;
          font-size: 0.14rem;
          border-bottom: 1px solid #ececec;
          text-align: left;
          position: relative;
          .addName{
            margin-bottom: 0.1rem;
            span{
              display: inline-block;
              &:nth-child(1){
                width: 15%;
              }
              &:nth-child(2){
                width: 40%;
              }
              &:nth-child(3){
                width: 40%;
                text-align: right;
                em:nth-child(2){
                  i{
                    display: inline-block;
                    width: 0.15rem;
                    height: 0.15rem;
                    background: url('../../../assets/images/my/coupons/address_delete@2x.png') no-repeat;
                    background-size: 0.15rem;
                    vertical-align: middle;
                  }
                }
                em:nth-child(1){
                  display: inline-block;
                  margin-right: 0.1rem;
                  i{
                    display: inline-block;
                    width: 0.15rem;
                    height: 0.15rem;
                    background: url('../../../assets/images/my/coupons/address_edit@2x.png') no-repeat;
                    background-size: 0.15rem;
                    vertical-align: middle;
                  }
                }
              }
            }
          }
          .padd{
            padding: 0 0 0 .4rem;
          }
          .click{
            display: inline-block;
            width: .2rem;
            height: .2rem;
            background: url('../../../assets/images/my/coupons/choose@2x.png') no-repeat;
            background-size: .2rem;
            position: absolute;
            top: 35%;
            left: 5%;
            &.active{
              background: url('../../../assets/images/my/coupons/choose_black@2x.png') no-repeat;
              background-size: .2rem;
            }
          }
        }
        .default{
          color: #e32f2d;
          .addStr{
            color: #e32f2d;
            i{
              padding: 0 0.05rem;
              display: inline-block;
              border:1px solid #e32f2d;
              margin-right: 0.1rem;
            }
          }
        }
      }
      .nodata{
        margin:0 auto;
        color: #aeaeae;
        text-align: center;
        font-size: 0.13rem;
        position: relative;
        top: 33%;
        left: 0;
        width: 100%;
        img{
          width: 0.95rem;
          height: 0.85rem;
          display: block;
          margin:0 auto;
          margin-bottom: .08rem;
        }
      }
    }
    .addButton{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: .5rem;
      line-height: .5rem;
      color: #fff;
      font-size: .16rem;
      background-color: #CEA63F;
      border:none;
    }
  }
</style> 