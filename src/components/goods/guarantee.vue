<template>  
  <div class="guarantee">  
    <div>
      <h4>包装售后</h4>
      <div v-html="guaranteeData" style="border:0px solid #ddd;padding:0;"></div>
    </div>
    <div>
      <h4>正品行货</h4>
      <p>晶杰之家向您保证所售商品均为正品行货，并可开具正规发票。</p>
    </div>
    <div>
      <h4>售后保障</h4>
      <p>凡在晶杰之家购买的产品均可享受本王提供的优质售后服务。如因质量问题或故障，本产品享受“七天包退、十五天包换、三个月非人为损坏保修”等服务（注：因厂家在商品介绍中有售后保障的说明，则此商品按照厂家说明执行售后保障服务），附件产品按其产品规定保修细则执行，保修以购机单所注日期为准。</p>
    </div>
    <div>
      <h4>服务承诺</h4>
      <p>晶杰之家向您保证所售商品均为正品，与您亲临门店选购的商品享受相同的质量保证及更优的服务！本站为您提供具有竞争力的商品价格、服务保障和运费政策，请您放心购买！</p>
      <p>注：因厂家会在没有任何前提通知的情况下更改产品包装、产地或者一些附件，本网不能确保客户收到的货物与本网图片、产地、附件说明一致，只能确保为原厂正货！并且保证与当时市场上同样主流新品一致。若本网没有及时更新，请大家谅解！</p>
    </div>
    <div>
      <h4>权利声明</h4>
      <p>晶杰之家的所有商品信息是晶杰之家重要的经营资源，未经允许，禁止非法转载使用，商品促销信息以商品详情页“促销”栏中的信息为准；商品的具体售价以订单结算页价格为准；如您发现活动商品售价或促销信息有异常，建议购买前先联系导购资讯。</p>
      <p>售后服务电话：0571-88919300</p>
    </div>
  </div>  
</template>  
  
<script>  
import {Toast,MessageBox} from 'mint-ui'
import util from '@/libs/util' 
import axios from 'axios'
export default {  
  name: 'guarantee',  
  data() {  
    return {  
       guaranteeData:'', 
    };  
  },
  props:{
    dataObj:String
  },
  components:{
      
  },
  methods:{
    
  },
  created:function(){
    
  },
  watch:{
    dataObj(){
      this.guaranteeData = this.dataObj;
    }
  }
};  
</script>  
  
<style lang="less" scoped>   
  @import '../../libs/commnd.less';
  .guarantee{
    padding: @padding010 @padding015;
    background: @oneBackgroundColor;
    text-align: left;
    div{
      padding: @padding010 0;
      border-bottom: 1px solid @segmentingLin;
      h4{
        color: @themeColor;
        padding-left: .3rem;
        background: url('../../assets/images/goods/goods_Packagingafter-sale@2x.png') no-repeat;
        background-size: 0.2rem;
        background-position: 0 0;
        vertical-align: middle;
      }
    }
    div:nth-child(2){
      h4{
        background: url('../../assets/images/goods/goods_real@2x.png') no-repeat;
        background-size: 0.2rem;
        background-position: 0 0;
      }
    }
    div:nth-child(3){
      h4{
        background: url('../../assets/images/goods/goods_protection@2x.png') no-repeat;
        background-size: 0.2rem;
        background-position: 0 0;
      }
    }
    div:nth-child(4){
      h4{
        background: url('../../assets/images/goods/goods_service@2x.png') no-repeat;
        background-size: 0.2rem;
        background-position: 0 0;
      }
    }
    div:nth-child(5){
      h4{
        background: url('../../assets/images/goods/goods_statement@2x.png') no-repeat;
        background-size: 0.2rem;
        background-position: 0 0;
      }
    }
  }
</style>












