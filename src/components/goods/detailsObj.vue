<template>  
  <div class="detailsObj">  
      <div class="towNavbar goodsObj" :style="$store.state.jumpAppTime?'top:.95rem;':''">
          <mt-navbar v-model="towNavbarSelected">
              <mt-tab-item class="towNavbarLink" id="imageText">图文详情</mt-tab-item>
              <i class="fenge"></i>
              <mt-tab-item class="towNavbarLink" id="parameter">详情参数</mt-tab-item>
              <i class="fenge"></i>
              <mt-tab-item class="towNavbarLink" id="guarantee">售后保障</mt-tab-item>
          </mt-navbar> 
      </div>
      <div class="data">
          <mt-tab-container v-model="towNavbarSelected">
            <mt-tab-container-item id="imageText">
              <imageText :dataObj="imageTextData"></imageText>
            </mt-tab-container-item>
            <mt-tab-container-item id="parameter">
              <parameter :dataObj="parameterData"></parameter>
            </mt-tab-container-item>
            <mt-tab-container-item id="guarantee">
              <guarantee :dataObj="guaranteeData"></guarantee>
            </mt-tab-container-item>
          </mt-tab-container>
      </div>
      <toTop v-if="isshowToTop"></toTop>
  </div>  
</template>  
  
<script>  
import {Toast,MessageBox} from 'mint-ui'
import util from '@/libs/util' 
import axios from 'axios'
import imageText from './imageTex.vue'
import parameter from './parameter.vue'
import guarantee from './guarantee.vue'
import toTop from './toTop.vue'
export default {  
  name: 'detailsObj',  
  data() {  
    return {  
        towNavbarSelected:'imageText',
        onlineId:null,
        imageTextData:null,//图文详情数据
        parameterData:null,//详细参数数据
        guaranteeData:null,//售后保障数据
        onlineId:null,
        isshowToTop:false,
    };  
  },
  props:{
    goodsObj:Object
  },
  watch:{
    goodsObj(){
      this.onlineId = this.goodsObj.onlineId;
      this.ajaxDetails();
    }
  },
  components:{
      imageText:imageText,
      parameter:parameter,
      guarantee:guarantee,
      toTop:toTop,
  },
  methods:{
    ajaxDetails(){
      let that =this;
      let data = {
        "onlineId":that.onlineId
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/goods/open/searchGoodsDescrip"+urlStr,
        dataType: 'json', 
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          that.imageTextData = response.data.body.description;
          that.parameterData = response.data.body.goodsParmsMap;
          that.guaranteeData = response.data.body.maintainDesction;
        }else{
          MessageBox('系统提示',oData.data.message);
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    }
  },
  created(){
    window.addEventListener('scroll',()=>{
      if(window.scrollY>0){
        this.isshowToTop = true;
      }else{
        this.isshowToTop = false;
      }
    })
  },
};  
</script>  
  
<style lang="less" scoped>   
    @import '../../assets/less/detailsObj.less'; 
    * {-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}
    .fenge{
      display: inline-block;
      height: .24rem;
      border-width: 0 0 0 0;
      border-left: 1px solid #ececec;
      margin-top: .08rem;
    }
</style> 








