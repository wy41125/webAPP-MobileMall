<template>  
  <div class="parameter">  
      <div class="tabel">
        <table align='center' style="border-collapse:collapse;">
          <tr v-for="list in parameterData.prodDetailList">
            <td>{{list.paramName}}</td>
            <td>{{list.goodsParamVal}}</td>
          </tr>
        </table>
        <table align='center' style="border-collapse:collapse;" class="noborderTop05" v-for="ParamList in parameterData.detailParamList">
          <tr>
            <th colspan='2'>{{ParamList.channelName}}</th>
          </tr>
          <tr v-for="item in ParamList.goodsParamList">
            <td>{{item.paramName}}</td>
            <td>{{item.goodsParamVal}}</td>
          </tr>
        </table>
      </div>  
  </div>  
</template>  
  
<script>  
import VDistpicker from 'v-distpicker'
import {Toast,MessageBox} from 'mint-ui'
import Cookies from 'js-cookie';
import util from '@/libs/util' 
import axios from 'axios'
export default {  
  name: 'parameter',  
  data() {  
    return {  
      parameterData:{},
    };  
  },
  props:{
    dataObj:Object
  },
  components:{
      
  },
  methods:{
    
  },
  created:function(){
    
  },
  watch:{
    dataObj(){
      this.parameterData = this.dataObj;
    }
  }
};  
</script>  
  
<style lang="less" scoped>   
@import '../../libs/commnd.less';
  .tabel{
    // width: 100%;
    background: @oneBackgroundColor;
    padding: @padding010 @padding015;
    table{
      width: 100%;
      .borderTop05{
        border-top: 1px solid transparent;
      }
      tr{
        width: 100%;
        th,td{
          text-align: left;
          padding: @padding010 @padding015;
          font-size: @threeFontSize;
          border: 1px solid #ddd;
        }
        td:nth-child(1){
          width: 40%;
        }
      }
    }
  }
</style> 








