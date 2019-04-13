<template>  
  <div class="classDate">   
      <img class="advertising" :src="classContainer.imgUrl" @click.stop="jumpPage(classContainer.linkUrl)">
      <div class="classontent">
          <p class="title_p">
            <span class="lanmuName">{{classContainer.name}}</span>
            <span class="mone" @click.stop="$router.push({name:'goodsList',query:{id:classContainer.classId}});">更多<i></i></span>
          </p>
          <div class="dateShop" v-for="item in classContainer.items" @click.stop="$router.push({name:'goodsList',query:{id:item.classId}});">
              <img :src="item.imgUrl" alt="">
              <span>{{item.name}}</span>
          </div>
          <br style="clear:both"/>  
      </div>
  </div>  
</template>  
  
<script>  
export default {  
  name: 'classDate',  
  data() {  
    return {  

    };  
  },
  components:{

  },
  methods:{
    jumpPage(url){
      let that =this;
      if(url.indexOf('url=')>=0){
        window.location.href = url.split('url=')[1];
      }else if(url.indexOf('onlineId=')>=0){
        that.$router.push({name:'goodsDevele',query:{onlineId:url.split('onlineId=')[1]}});
      }
    },
  },
  props:{
      classContainer:Object
  },
  created:function(){
    // console.log(this.classContainer);
  }
};  
</script>  
  
<style lang="less" scoped>   
     @import '../../assets/less/classDate.less';
     .mone{
        i{
          display: inline-block;
          width: .06rem;
          height: 0.07rem;
          background: url(../../assets/images/my/set-more@2x.png) no-repeat;
          background-size: 100%;
          vertical-align: middle;
          margin-left: .05rem;
          padding-bottom: .05rem;
        }
     }
</style> 