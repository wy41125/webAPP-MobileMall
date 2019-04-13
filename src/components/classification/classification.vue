<template>  
  <div class="classification" :style="str">  
    <header>
      <i class="jj_icon"></i>
      <p class="input_p" @click.stop="$router.push({ name: 'customInput', params: { id: 'new' }});">
        <b class="input_icon"></b>
        <span>请输入商品名称查找</span>
      </p>
    </header>
       <!-- <headers :headerType="5"></headers>  -->
      <div class="classDataMone">
          <mt-navbar class="classNavbar" v-model="selected">
            <mt-tab-item v-for="date in dates" class="navbarTitle" :id="date.classId">{{date.name}}</mt-tab-item>
          </mt-navbar>

          <!-- tab-container -->
          <mt-tab-container class="classContainer" v-model="selected">
            <mt-tab-container-item v-for="date in dates"  :id="date.classId">
              <classData :classContainer="date"></classData>
            </mt-tab-container-item> 
          </mt-tab-container>
      </div>
      <!-- <router-view></router-view> -->
  </div>  
</template>  
  
<script>  
import Headers from '../headers.vue'
import classData from './classDate.vue'
import util from '@/libs/util' 
import axios from 'axios'
import {Toast,MessageBox} from 'mint-ui'
export default {  
  name: 'classification',  
  data() {  
    return {  
       selected:null,
       dates:[],
       str:'',
    };  
  },
  components:{
      headers:Headers,
      classData:classData
  },
  methods:{
    ajaxclass(){
          let data = {};
          let urlStr = util.getpost(data);
          axios({
            method:"post",
            url:"/open/goodsClass"+urlStr,
            dataType: 'json',
            data:data,
          }).then(response => {
            this.dates = response.data.body;
            this.selected = response.data.body[0].classId;
          }).catch(response => {
            if(response.data.status && response.data.status != 0){
              MessageBox('系统提示', response.data.message);
            }
          })
    }
  },
  created(){
    util.toTop();
    this.ajaxclass();
    let height = 'height:'+(window.innerHeight-46)+'px';
    this.str = height;
    util.setTitle('全部分类');
    let body = document.body;
    body.style="height:0%;";
  }  
};  
</script>  
  
<style lang="less" scoped>   
     @import '../../assets/less/classification.less';
     header{
      width: 100%;
      height: .45rem;
      background: #fff;
      text-align: left;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
      border-bottom: 1px solid #ececec;
      .jj_icon{
        display: inline-block;
        width: .23rem;
        height: .23rem;
        background: url(../../assets/images/main_icon.png) no-repeat;
        background-size: 100%;
        margin: .1rem .16rem 0 .16rem;
        vertical-align: top;
      }
      .input_p{
        display: inline-block;
        color: #999999;
        font-size: .13rem;
        width: 78%;
        height: .3rem;
        background: #F5F5F5;
        margin-top: .05rem;
        line-height: .3rem;
        .input_icon{
          display: inline-block;
          width: .15rem;
          height: .15rem;
          background: url(../../assets/images/search_icon.png) no-repeat;
          background-size: 100%;
          vertical-align: middle;
          margin: 0 .1rem;
        }
      }
    }
</style> 