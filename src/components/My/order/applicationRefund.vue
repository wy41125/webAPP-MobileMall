<template>  
  <div class="applicationRefund" :style="'height:'+heightStr+'px;'"> 
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'申请退款'" style="left:0;"></headers>
    <div class="applica_div" :style="$store.state.titleShow?'margin-top:.45rem':''">
      <div class="applica_div_input">
        <p>联系方式<i>*</i></p>
        <input type="tel" oninput="if(value.length>11)value=value.slice(0,11)" placeholder="请填写联系电话" v-model="phoneNum">
      </div>
      <div class="applica_div_input">
        <p>退款金额<i>*</i></p>
        <input type="" readonly :value="(totalRefund/100).toFixed(2)">
      </div>
      <div class="applica_div_input">
        <p>退款原因<i>*</i></p>
        <p class="select_div">
          <select name="" id="test" placeholder="请选择退款原因">
            <option :value="index" v-for="(item,index) in seleObj" selected>{{item.reason}}</option>
          </select>
          <i class="xia"></i>
        </p>
        
      </div>
    </div>
    <button @click.stop="Submit">提交</button>
  </div>   
</template>  
  
<script>  
import Cookies from 'js-cookie';
import headers from '../../headers.vue'
import {Toast,MessageBox} from 'mint-ui'
import axios from 'axios'
import util from '@/libs/util' 
export default {  
  name: 'applicationRefund',  
  data() {  
    return {  
      totalRefund:null,//退款金额
      orderId:null,//订单ID
      orderDetailIds:[],//商品订单ID
      phoneNum:null,//手机号码
      seleObj:[],
      heightStr:null,
    };  
  },
  components:{
    headers:headers,
  },
  created(){
    this.ajaxdata();
    this.totalRefund = this.$route.query.totalRefund;
    this.orderId = this.$route.query.orderId;
    this.orderDetailIds = decodeURIComponent(this.$route.query.orderDetailIds).split(',');
    util.setTitle('申请退款');
    this.readPhone();
    this.heightStr = window.innerHeight-45;
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
  }, 
  methods:{
    readPhone(){
      let vm = this;
      if(vm.$store.state.userPhone && vm.$store.state.userPhone != ''){
        vm.phoneNum = vm.$store.state.userPhone;
      }else{
        if(Cookies.get('jingjieUser')){
          vm.phoneNum = Cookies.get('jingjieUser');
        }
      }
    },
    ajaxdata(){
      let that =this;
      let data = {};
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/ordercs/getCancelReasonList"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          for(let i in response.data.body){
            let item = response.data.body[i];
            if(item.code == 'REPLY-REFUND-REASON'){
              that.seleObj.push(item);
            }
          }
          console.log(that.seleObj);
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
    Submit(){
      let that =this;
      if(that.phoneNum <11 || !util.PHONE_REG.test(that.phoneNum)){
        Toast('请填写正确的手机号码！');
        return;
      }
      let  myselect=document.getElementById("test");
      let index=myselect.selectedIndex ;
      console.log(myselect.options[index].text);
      let data = {
        "orderId":that.orderId, //(描述：退货订单id 、类型：Long、是否必填：Y)
        "cancelReason":myselect.options[index].text, //(描述：退款原因、类型：String、是否必填：Y)
        "totalRefund":that.totalRefund, //(描述：退款金额、类型：Integer、是否必填：Y)
        "orderDetailIds":that.orderDetailIds, //(描述:订单详情id数组、类型：list、是否必填：Y)
        "contactPhone":that.phoneNum //(描述:联系方式、类型：String、是否必填：Y)
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/ordercs/createReturnRefundOrder"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          that.$router.push({name:'customDe',query:{cancelId:response.data.body.cancelOrderId}});//售后单id,跳转
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
    }
  },
  
};  
</script>  
  
<style lang="less" scoped>   
@import '../../../libs/commnd.less';
  .applicationRefund{
    font-size: .16rem;
    height: 100%;
    background: #fff;
    padding:0 .2rem;
    .applica_div{
      width: 100%;
      .applica_div_input{
        padding-top: .15rem;
        text-align: left;
        font-size: .14rem;
        .select_div{
          position: relative;
          .xia{
            display: inline-block;
              width: .07rem;
              height: .07rem;
              border-color: #999;
              border-style: solid;
              border-width: 1px 1px 0 0;
              transform: matrix(.71,.71,.71,-.71,0,0);
              position: absolute;
              top: 35%;
              right: 3%;
          }
        }
        em{
          color: #333;
        }
        input{
          width: 100%;
          height: .4rem;
          background: #f8f8f8;
          font-size: .16rem;
        }
        p{
          margin-bottom: .1rem;
          i{
            color: #E12E2E;
          }
        }
        select{
          width: 100%;
          height: .4rem;
          background: #f8f8f8;
          font-size: .16rem;
          border:1px solid #f8f8f8;
          color: #333;
          option{
            width: 100%;
            height: .4rem;
            font-size: .16rem;
            background: #f8f8f8;
          }
        }
      }
    }
    button{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: .5rem;
      color: #fff;
      background: #CDA63F;
      line-height: .5rem;
      font-size: .16rem;
      border: 0px solid #ddd;
    }
  }
</style> 





















