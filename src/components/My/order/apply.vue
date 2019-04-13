<template> 
<div>
  <headers v-if="$store.state.titleShow && $route.query.type==1" :headerType='2' :headerStr="'申请退货'"></headers>
  <headers v-if="$store.state.titleShow && $route.query.type!=1" :headerType='2' :headerStr="'申请换货'"></headers> 
  <div class="applicationRefund" :style="$store.state.titleShow?'margin-top:.45rem':''">
    <div class="applica_div" >
      <div class="applica_div_input">
        <p>联系方式<i>*</i></p>
        <input type="tel" oninput="if(value.length>11)value=value.slice(0,11)" placeholder="请填写联系电话" v-model="phoneNum">
      </div>
      <div class="applica_div_input" v-if="$route.query.type==1">
        <p>退款金额<i>*</i></p>
        <input type="" readonly :value="(totalRefund/100).toFixed(2)">
      </div>
      <div class="applica_div_input">
        <p><em v-text="$route.query.type==1?'退货原因':'换货原因'"></em><i>*</i></p>
        <p class="select_div">
          <select name="" id="test" placeholder="请选择退款原因" @change="onSelected($event)">
            <option :value="index" v-for="(item,index) in oneArr">{{item.reason}}</option>
          </select>
          <i class="xia"></i>
        </p>
        
      </div>
      <div class="applica_div_input" v-if="yuanyinVal==1">
        <p>是否拆封<i>*</i></p>
        <p class="select_div">
          <select name="" id="test1" placeholder="请选择退款原因">
            <option :value="(index+1)" v-for="(item,index) in twoArr">{{item.val}}</option>
          </select>
          <i class="xia"></i>
        </p>
        
      </div>
      <div class="applica_div_input" v-if="yuanyinVal==2">
        <p>是否检测<i>*</i></p>
        <p class="select_div">
          <select name="" id="test2" placeholder="请选择退款原因">
            <option :value="(index+1)" v-for="(item,index) in therrArr">{{item.val}}</option>
          </select>
          <i class="xia"></i>
        </p>
       
      </div>
      <div class="applica_div_input">
        <p><em v-text="$route.query.type==1?'退货说明':'换货说明'"></em><i>*</i></p>
        <textarea name="" id="" cols="30" rows="10" maxlength="300" :placeholder="$route.query.type==1?'请填写退货说明':'请填写换货说明'" v-model="textvalue"></textarea>
      </div>
      <div class="applica_div_input">
        <p><em>上传商品当前照片</em><i>*</i></p>
        <div class="addImgs">
          <p style="position: relative;">
            <img class="oneAdd" src="../../../assets/images/order/add_background@2x.png" alt="" @click.stop="addInput">
            <input id="upload"  class="oneAdd" type="file" accept="image/*;" capture="camera" @change="paizhao('#upload','#img',$event)" style="width: .74rem;height: .74rem;border:1px dashed #aaa;background: url('../../../assets/images/order/add_background@2x.png') no-repeat;background-size: .74rem;opacity:0;position: absolute;top: 0;left: 0;">
          </p>
          <p id="imgs">
            <span v-for="(img,index) in dataUrl"><img class="addImg" :src="img" alt=""><i @click.stop="deleteImg(index)"></i></span>
          </p>
        </div>  
      </div>
    </div>
    <button @click.stop="ajaxtijiao">提交</button>
  </div>
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
      totalRefund:null,//金额
      orderId:null,//订单id
      orderDetailIds:null,
      phoneNum:null,//手机号码
      yuanyinVal:null,//原因选中值
      textvalue:null,
      dataUrl:[],//图片路径数组
      oneArr:[{
        reason:'未选择'
      }],
      twoArr:[],
      therrArr:[],
    };  
  },
  components:{
    headers:headers,
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
    deleteImg(i){//删除图片数组
      this.dataUrl.splice(i, 1);
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
            if(item.code == 'REPLY-GOODS-REASON'){
              that.oneArr.push(item);
            }
            if(item.code == 'REPLY-GOODS-REASON' && item.reason.indexOf('性能') >=0 ){
              that.therrArr = item.dtoList;
            }
            if(item.code == 'REPLY-GOODS-REASON' && item.reason.indexOf('颜色') >=0 ){
              that.twoArr = item.dtoList;
            }
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
    paizhao(c,d,event){
      let name = event.currentTarget.files[0].name;
      let that = this;
      var $c = document.querySelector(c),file = $c.files[0],reader = new FileReader(),$d = document.querySelector('#imgs');
      reader.readAsDataURL(file);
      reader.onload = function(e){
        that.uploadImg(e.target.result,name);
      };
    },
    uploadImg(str,name){
      let that =this;
      let data = {
        "fileData":str, //(描述：图片base64转码字符串、类型：String、是否必填：Y)
        "fileName": name,//(描述：文件名称、类型：String、是否必填：Y)
        "type": 3//(描述：上传类型 1 用户头像 2 订单评价 3 售后图片、类型：Integer、是否必填：Y)
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/common/upload"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          let input = document.getElementById('upload');   
          input.outerHTML=input.outerHTML;
          if(that.dataUrl.length<6){
            that.dataUrl.push(response.data.body);
          }else{
            Toast('亲，最多添加6张哦！');
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
    onSelected(event){//选项切换
      this.yuanyinVal = event.target.value;
    },
    ajaxtijiao(){//提交请求
      let that =this,data={};
      data.orderId = that.orderId;
      let  myselect=document.getElementById("test");
      let index=myselect.selectedIndex;
      if(index == 0){
        Toast('请选择原因');
        return;
      }else{
        data.cancelReason=myselect.options[index].text;
      }
      data.cancelDesc = that.textvalue;
      data.totalRefund = that.totalRefund;
      data.serviceType = that.$route.query.type;
      if(index == 1){//外观
        data.isOpen = document.getElementById("test1").selectedIndex;
      }else if(index == 2){
        data.isCheck = document.getElementById("test2").selectedIndex;
      }
      data.orderDetailIds = that.orderDetailIds;
      if(that.phoneNum <11 || !util.PHONE_REG.test(that.phoneNum)){
        Toast('请填写正确的手机号码！');
        return;
      }else{
        data.contactPhone = that.phoneNum;
      }
      if(that.dataUrl.length>0){
        data.imgUrls = that.dataUrl.join(',');
      }
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/ordercs/createReturnOrder"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          that.$router.push({name:'customDe',query:{cancelId:response.data.body.cancelOrderId}});//跳转售后单详情页
        }else{
          if(response.data.status = 499){//token失效或没有token
            util.outLogin();
            that.$router.push({name:'signInPage'});
          }else{
            MessageBox('系统提示',response.data.message);
          }
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    }
  },
  created(){
    this.readPhone();
    this.ajaxdata();
    this.orderId = this.$route.query.orderId;
    let arr = decodeURIComponent(this.$route.query.orderDetailIds).split(',');
    let str = '';
    for(let i in arr){
      this.totalRefund += Number(arr[i].split('#')[1]);
      if(i == arr.length-1){
        str+=arr[i].split('#')[0];
      }else{
        str+=arr[i].split('#')[0]+',';
      }
    }
    this.orderDetailIds = str;
    if(this.$route.query.type==1){
      util.setTitle('申请退货');
    }else{
      util.setTitle('申请换货');
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
@import '../../../libs/commnd.less';
  .applicationRefund{
    font-size: .16rem;
    background: #fff;
    padding:0 .2rem;
    margin-bottom: .5rem;
    position: fixed;
    width: 90%;
    z-index: 1;
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
        input,textarea{
          width: 100%;
          height: .4rem;
          background: #f8f8f8;
          font-size: .16rem;
        }
        textarea{
          border:none;
          height: 1.11rem;
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
          position: relative;
          font-size: .16rem;
          border:1px solid #f8f8f8;
          color: #333;
          &::after{
            
          }
          option{
            width: 100%;
            height: .4rem;
            font-size: .16rem;
            background: #f8f8f8;
          }
        }
      }
    }
    .addImgs{
      text-align: left;
      .oneAdd{
        width: .74rem;
        height: .74rem;
        border:1px dashed #aaa;
        background: url('../../../assets/images/order/add_background@2x.png') no-repeat;
        background-size: .74rem;
      }
    }
    #imgs{
        span{
          display: inline-block;
          position: relative;
          width: .74rem;
          height: .74rem;
          margin-right:.1rem; 
          .addImg{
            display: inline-block;
            width: 100%;
            height: 100%;
          }
          i{
            display: inline-block;
            width: .14rem;
            height: .14rem;
            background: url(../../../assets/images/close@2x.png) no-repeat;
            background-size: .14rem;
            position: absolute;
            top: -.07rem;
            right: -.07rem;
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





















