<template>  
  <div class="customInput">
      <header>
        <i @click.stop="$router.go(-1)"></i>
        <input class="mint-header-input" type="text" :placeholder="placehStr" v-model="inputStr" autofocus="autofocus">
        <span @click.stop="custom">搜索</span>
      </header>

      <div class="conentDiv">
          <div class="tongyi hot"> 
              <p>热门搜索</p>
              <div>
                  <span v-for="item in items" @click.stop="assignment(item)" v-if="item">{{item}}</span>
              </div>  
          </div>
          <div class="tongyi histroy" v-if="locaStrs.length != 0">
              <p class="titleP">历史搜索 <i @click.stop="clearLoac"></i></p>
              <div class="histroyConent">
                  <p @click.stop="assignment(locaStr)" v-for="locaStr in locaStrs">{{locaStr}}</p>
              </div>
          </div>
      </div>
  </div>  
</template>  
  
<script>
import {Toast,MessageBox} from 'mint-ui'
import axios from 'axios'
import util from '@/libs/util'
export default {  
  name: 'recommend',  
  data() {  
    return {  
      items:[],
      locaStrs:[],
      inputStr:null,//搜索框中文字
      placehStr:null,
    };  
  },
  components:{
    
  },
  mounted () {
    util.toTop();
    this.ajaxHotSearch();
  },
  created (){
    if((window.localStorage['customStr'])){
      let customArr = (window.localStorage['customStr']).split(',');//**,**,**
      this.locaStrs = customArr;
    }
  },
  methods:{
    clearLoac(){
      window.localStorage['customStr'] = '';
      this.locaStrs = [];
    },
    custom(){
      if(!this.inputStr){
        this.inputStr = this.placehStr;
      }
      let customArr = [],customStr='';
      if((window.localStorage['customStr'])){
        customStr = window.localStorage['customStr'];
        customArr = (window.localStorage['customStr']).split(',');//**,**,**
      }
      let newArr = []; //一个新的临时数组 
      for(let i = 0; i < customArr.length; i++){ //遍历当前数组 
        customArr[i].replace(/(^\s*)|(\s*$)/g, "");
        newStr=customArr[i].toLowerCase();
        customStr = customStr.toLowerCase();
        if (customStr.indexOf(newStr) == -1) newArr.push(customArr[i]); //如果当前数组的第i已经保存进了临时数组，那么跳过， //否则把当前项push到临时数组里面 
      }
      newArr.push(this.inputStr);
      let newStr = newArr.join(',');
      window.localStorage.customStr = newStr;

      this.$router.replace({name:'goodsList',query:{str:encodeURIComponent(this.inputStr)}});
    },
    assignment(str){
      this.inputStr = str;
      this.custom();
    },
    ajaxHotSearch(){
      let date = {};
      let urlStr = util.getpost(date);
      axios({
        method:"POST",
        url:"/goods/open/hotSearch"+urlStr,
        dataType: 'json',
        data:date
      }).then(response => {
          this.items = response.data.body;
          this.placehStr = response.data.body[0];
      }).catch(oData => {
        if(oData.data.status && oData.data.status != 0){
          MessageBox('系统提示',oData.data.message);
        }
      })
    },
  },
  
  
};  
</script>  
  
<style lang="less" scoped> 
    @import '../assets/less/custominput.less';
    header{
      height: 0.3rem;
      background-color: #fff;
      color: #000;
      border-bottom: 1px solid #ececec;
      padding: 0.05rem 0;
      padding-left: .08rem;
      i{
        display: inline-block;
        width: 0.08rem;
        height: 0.08rem;
        line-height: 0.3rem;
        border-width: 2px 2px 0 0;
        border-style: solid;
        border-color: #888;
        transform: matrix(-.71,.71,.71,.71,0,0); 
        margin-right: .04rem;
        margin-left: .08rem;
      }
      input{
        display: inline-block;
        width: 70%;
        height: 100%;
        background: #ddd;
        opacity: 0.5;
        padding-left:0.15rem; 
      }
      span{
        display: inline-block;
        width: 10%;
        height: 100%;
        text-align: center;
        line-height: 0.3rem;
        margin-left: .1rem;
      }    
    }
</style> 












