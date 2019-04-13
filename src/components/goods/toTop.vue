<template>  
  <div class="toTop">  
    <i class="maodian" @click.stop="toTop"></i>
  </div>  
</template>  
  
<script> 
export default {  
  name: 'toTop',  
  data() {  
    return {  
      
    };  
  },
  methods:{ 
    toTop(){
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    wtachTop(){
      // console.log(document.body.scrollTop);
      // console.log(document.documentElement.scrollTop);
    },
  },
  created(){
    this.wtachTop();
  },
  beforeRouteUpdate(to,from,next){
    
  }  
};  
</script>  
  
<style lang="less" scoped>   
  .maodian{
   position: fixed;
   bottom: 23%;
   right: 3%;
   display: inline-block;
   width: 0.35rem;
   height: 0.35rem;
   border:1px solie #ddd;
   color: #fff;
   background: url('../../assets/images/goods/top@2x.png') no-repeat;
   background-size:0.35rem;
   border-radius: 0.25rem; 
  }
</style> 











