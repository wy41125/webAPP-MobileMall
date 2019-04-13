<template>  
  <div class="page-header">  
    <!-- 购物车标题 -->
    <mt-header v-if="headerType==1?true:false" fixed title="购物车">
      <router-link to="/" slot="right">
        <mt-button icon="">领券</mt-button>
      </router-link>
      <router-link to="/" slot="right">
        <mt-button icon=""><i>1</i></mt-button>
      </router-link>
    </mt-header>

    <!-- 标准标题，左侧带后退按钮 -->
    <mt-header v-if="headerType==2?true:false" :title="headerStr">
      <router-link to="" slot="left">
        <mt-button icon="back" @click.stop="$router.go(-1)"></mt-button>
      </router-link>
    </mt-header>

    <!-- 标准标题，左侧带后退按钮，右侧带自定义按钮 -->
    <mt-header v-if="headerType==3?true:false" fixed title="请选择收获地址">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <router-link to="/" slot="right">
        <mt-button icon="">新增地址</mt-button>
      </router-link>
    </mt-header>

    <!-- 选项标题，左侧带后退按钮，右侧带自定义按钮 -->
    <header v-if="headerType==4?true:false" class="mint-header is-fixed">
      <div class="mint-header-button is-left">
         <a href="#/" class="router-link-active">
            <button class="mint-button mint-button--default mint-button--normal">
                <span class="mint-button-icon">
                    <i class="mintui mintui-back"></i>
                </span> 
            </button>
        </a>
      </div>
      <h1 class="mint-header-title">
        <input class="mint-header-input" type="text" placeholder="请输入商品名称查找" v-model="inputMegess">
      </h1>
      <div class="mint-header-button is-right">
          <button class="mint-button mint-button--default mint-button--normal" @click="">
            搜索
          </button>
      </div>
    </header>

    <!-- 搜索标题，左侧带后退按钮，右侧带自定义按钮 -->
    <header v-if="headerType==5?true:false" class="mint-header is-fixed customInput">
      <div class="mint-header-button is-left">
        <i class="mainIcon"></i>
      </div>
      <h1 class="mint-header-title">
        <!-- <input class="mint-header-input" @click.stop="$router.push({ name: 'customInput', params: { id: 'new' }});" type="text" placeholder="请输入商品名称查找"> -->
        <i class="icon"></i>
        <span class="mint-header-input" @click.stop="$router.push({ name: 'customInput', params: { id: 'new' }});">请输入商品名称查找</span>
      </h1>
      <div class="mint-header-button is-right">
        <!-- <a href="#/" class="router-link-exact-active router-link-active">
          <button class="mint-button mint-button--default mint-button--normal">
            <label class="mint-button-text"><i>99</i></label>
          </button>
        </a> -->
      </div>
    </header>

    <!-- 搜索标题，左侧带后退按钮，右侧带自定义按钮 -->
    <header v-if="headerType==6?true:false" class="mint-header is-fixed goodsInput">
        <div class="mint-header-button is-left">
            <a href="#/" class="router-link-active">
                <button class="mint-button mint-button--default mint-button--normal">
                    <span class="mint-button-icon">
                        <i class="mintui mintui-back"></i>
                    </span> 
                </button>
            </a>
        </div> 
        <h1 class="mint-header-title">
            <input class="mint-header-input" @click.stop="$router.push({ name: 'customInput', params: { id: 'new' }});" type="text" placeholder="请输入商品名称查找">
        </h1>
        <div class="mint-header-button is-right">
                <button class="mint-button mint-button--default mint-button--normal" @click.stop="changesStyle()">
                    <label :class="{'styleState2':goodsInputStyle,'mint-button-text':true}"></label>
                </button>
        </div>
    </header>
    <br style="clear:both;" />
  </div>  
</template>  
  
<script>  
export default {  
  name: 'headers',  
  data() {  
    return {  
      // isShow:this.headerType,//标题控制器
      // selected:1,
      goodsInputStyle:false,
      titleSelected:'good',
      inputMegess:this.inputStr,
    };  
  },
  methods:{
      changesStyle(){
          let elems=document.getElementsByClassName("styleState2");
          if(elems){
              this.goodsInputStyle = false;
          }else{
              this.goodsInputStyle = true;
          }
      },
      changeClick(){
        
      }
  },
  props:{
      headerType:Number,
      inputStr:String,
      headerStr:String
  } 
};  
</script>  
  
<style lang="less" scoped>   
  @import '../assets/less/headers.less';
  .page-header{
    position: fixed;
    width: 100%;
    z-index: 1;
    top: 0;
    height: 0.4rem;
  }
</style> 