<template>  
  <div class="logistics">  
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'售后申请'"></headers>
    <div class="applica_div" :style="$store.state.titleShow?'margin-top:.4rem':''">
      <div class="applica_div_input">
        <p>选择物流公司<i>*</i></p>
        <select name="" id="test">
          <option v-for="Express in ExpressList" :value="Express.expressId" >{{Express.name}}</option>
        </select>
      </div>
      <div class="applica_div_input">
        <p>填写物流单号<i>*</i></p>
        <input type="number" v-model="value">
      </div>
    </div>
    <button @click.stop="ajaxtijiao">提交</button>
  </div>   
</template>  
  
<script>
import headers from '../../headers.vue'  
import {Toast,MessageBox} from 'mint-ui'
import axios from 'axios'
import util from '@/libs/util' 
export default {  
  name: 'logistics',  
  data() {  
    return {  
      cancelId:null,//售后单
      ExpressList:[],//物流公司数组
      value:null,//物流单号,
      expressHistoryId:null,//物流单id
    };  
  },
  components:{
    headers:headers,
  },
  methods:{
    ajaxtijiao(){
      let that =this;
      let  myselect=document.getElementById("test");
      let index=myselect.selectedIndex ;
      if(!that.value){
        Toast('请填写物流单号');
        return;
      }
      let data = {
        "orderCancelId":that.cancelId,  //(描述：售后单id 、类型：Long、是否必填：N)
        "expressId":myselect.options[index].value,//(描述：快递物流公司id 、类型：Long、是否必填：N)
        "expressNo":that.value,//(描述：物流单号、类型：String、是否必填：N)
        "expressHistoryId":that.expressHistoryId//(描述：物流单id（新建物流单没有，不传，更改物流单有，传）、类型：Long、是否必填：N)
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/ordercs/submitExpressForAfterSale"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          Toast('提交成功！');
          that.$router.go(-1);
        }else{
          if(response.data.status = 499){//token失效或没有token
            that.$router.push({name:'signInPage',query:{outLogin:'/'}});
          }else{
            MessageBox('系统提示',response.data.message);
          }
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
    ajaxGetExpressList(){
      let that =this;
      let data = {};
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/ordercs/getExpressList"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          that.ExpressList = response.data.body;
          console.log(that.ExpressList);
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
  created(){
    this.cancelId = this.$route.query.cancelId;
    this.expressHistoryId = this.$route.query.expressHistoryId;
    this.ajaxGetExpressList();
    util.setTitle('填写物流');
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
  .logistics{
    font-size: .16rem;
    height: 100%;
    background: #fff;
    padding:0 .2rem;
    .applica_div{
      width: 100%;
      .applica_div_input{
        padding-top: .15rem;
        text-align: left;
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
          background: #f8f8f8;
          font-size: .16rem;
          border:1px solid #f8f8f8;
          option{
            width: 100%;
            height: .4rem;
            font-size: .16rem;
            background: #f8f8f8;
          }
        }
      }
    }
    .addImg{
      text-align: left;
      .oneAdd{
        width: .74rem;
        height: .74rem;
        border:1px dashed #aaa;
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
    }
  }
</style> 





















