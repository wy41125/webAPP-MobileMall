<template>
  <div class="Main">
    <div id="allmap"></div>
    <!-- <router-view></router-view> -->
    <tabber class="position"></tabber>
    
  </div>
</template>

<script>
import {Toast,MessageBox} from 'mint-ui' 
import axios from 'axios'
import tabber from './tabbar.vue'
import util from '@/libs/util' 
export default {
  name: 'Main',
  data () {
    return {
      
    }
  },
  components:{
    tabber:tabber,
  },
  methods:{
    ajaxTelephone(){
      let that =this;
      let data = {};
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/open/getServerPhone"+urlStr,
        dataType: 'json', 
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          this.$store.commit('addServiceTelephone',response.data.body.val);
        }else{
          Toast(response.data.message);
        }
      }).catch(oData => {
        that.isShowData=false;
        MessageBox('系统提示',oData.data.message);
      })
    },
  },
  mounted () {
    
  },
  created(){
    this.ajaxTelephone();
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="" scoped>
  .Main{
    width: 100%;
    height: 100%;
  }
  .position{
    bottom:0.4rem;
  }
  #allmap{
      width: 0%;
      height: 0%;
    }
</style>
