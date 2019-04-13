<template>  
  <div class="page-tabbar">  
    <div class="page-wrap">    
      <router-view></router-view>
    </div>  
  
    <div class="tabbar">
      <router-link :to="item.url" tag="span" v-for="item in tabbarArr"><i :class="item.id"></i>{{item.name}}</router-link>
    </div>
  </div>  
</template>  
  
<script>
export default {  
  name: 'page-tabbar',  
  data() {  
    return {  
      tabbarArr:[
        {
          id:'homepage',name:'首页',url:'/'
        },{
          id:'classification',name:'分类',url:'/classification'
        },{
          id:'shoppingCart',name:'购物车',url:'/shoppingCart'
        },{
          id:'My',name:'我的',url:'/My'
        }
      ],  
    };  
  },
  components:{
    
  },
  methods:{
    
  },
  created(){
    
  }
};  
</script>  
  
<style lang="less" scoped>   
  .page-tabbar{
    font-size: .14rem;
    width:100%;
    height:100%;
    .page-wrap{
      width:100%;
    }
    .tabbar{
      width: 100%;
      height: .5rem;
      display: flex;
      display: -webkit-flex;
      position: fixed;
      bottom: 0;
      left: 0;
      background: #fff;
      border-top: 1px solid #ececec;
      z-index:100;
      span{
        flex-grow:1;
        text-align: center;
        font-size: .1rem;
        color: #999;
        i{
          display: block;
          width: .22rem;
          height: .2rem;
          margin: 0 auto;
          margin-top: .08rem;
        }
        .homepage{
          background: url('../assets/images/navbar/home_gray@2x.png') no-repeat;
          background-size: 100%;
        }
        .classification{
          background: url('../assets/images/navbar/classify_gray@2x.png') no-repeat;
          background-size: 100%;
        }
        .shoppingCart{
          background: url('../assets/images/navbar/shopcar_gray@2x.png') no-repeat;
          background-size: 100%;
        }
        .My{
          background: url('../assets/images/navbar/my_gray@2x.png') no-repeat;
          background-size: 100%;
        }
      }
      .router-link-exact-active{
        color: #CEA63F;
        .homepage{
          background: url('../assets/images/navbar/home_gold@2x.png') no-repeat;
          background-size: 100%;
        }
        .classification{
          background: url('../assets/images/navbar/classify_gold@2x.png') no-repeat;
          background-size: 100%;
        }
        .shoppingCart{
          background: url('../assets/images/navbar/shopcar_gold@2x.png') no-repeat;
          background-size: 100%;
        }
        .My{
          background: url('../assets/images/navbar/my_gold@2x.png') no-repeat;
          background-size: 100%;
        }
      }
    }
  }
</style>












