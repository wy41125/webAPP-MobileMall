<template>  
  <div class="swipeDiv">
        <mt-swipe :auto="3000">
          <mt-swipe-item v-for="img in images">
            <img class="imagesStyle" :src="img.val" @click.stop="changeurl(img.link)">
          </mt-swipe-item>
        </mt-swipe>
  </div>
</template>  
  
<script>  
import util from '@/libs/util' 
import axios from 'axios'
export default {  
  name: 'areas',  
  data() {  
    return {  
      images:[
          {
            link:'',val:''
          }
      ]
    };  
  },
  components:{

  },
  props:{
    swipeTypes:Object
  },
  methods:{
      
  },
  created:function(){
    this.images = this.swipeTypes;
  }
};  
</script>  
  
<style lang="less" scoped>   
    .swipeDiv{//轮播
      height: 1.57rem;
      .imagesStyle{
          width: 100%;
      }
   }
   .mint-swipe-indicators{
      bottom:0;
   }
   //mintUI改造
  .mint-swipe-indicator.is-active{
    width: 0.2rem;
    border-radius: 20px; 
  }
</style> 