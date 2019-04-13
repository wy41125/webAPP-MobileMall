<template>  
  <div class="goodsDevele">  

      <div :class="navigation?'active navigation':'navigation'" style="color:#fff;">
        <i v-text="navigation?'》':'《'" class="jiantou"></i>
        <span @click.stop="clickShow" >快速导航</span>
        <ul v-if="navigation">
          <li @click.stop="jumpPage(0)"><i></i>首页</li>
          <li @click.stop="jumpPage(1)"><i class="fenlei"></i>分类</li>
          <li @click.stop="jumpPage(2)"><i class="gwc"></i>购物车</li>
          <li @click.stop="jumpPage(3)"><i class="wd"></i>我的</li>
        </ul>
      </div>
  </div>  
</template>  
  
<script>  
import {Toast,MessageBox} from 'mint-ui'
import axios from 'axios'
import util from '@/libs/util' 
import Goods from './goods.vue'
import DetailsObj from './detailsObj.vue'
import Eealuate from './evaluate.vue'
import goodsFooter from './goods_footer.vue'
export default {  
  name: 'goodsDevele',  
  data() {  
    return {  
      navigation:false,
    };  
  },
  props:{
    
  },
  components:{
    
  },
  methods:{
    jumpPage(type){//快速导航跳转
      switch(type){
        case 0:
          window.sessionStorage.setItem('tabbar','homepage');
          this.$router.replace({path:'/'});
          break;
        case 1:
          window.sessionStorage.setItem('tabbar','classification');
          this.$router.replace({path:'/classification'});
          break;
        case 2:
          window.sessionStorage.setItem('tabbar','shoppingCart');
          this.$router.replace({path:'/shoppingCart'});
          break;
        case 3:
          window.sessionStorage.setItem('tabbar','My');
          this.$router.replace({path:'/My'});
          break;
      }
    },
    clickShow(){//快速导航显示隐藏
      if(this.navigation){
        this.navigation = false;
      }else{
        this.navigation = true;
      }
    },
  },
  created(){
    util.toTop();
  },
  beforeRouteUpdate(to,from,next){
    
  },
  destoryed(){
    
  },
  beforeDestory(){
    
  }
};  
</script>  
  
<style lang="less" scoped>   
     @import '../../assets/less/goodsDevele.less';
</style> 