<template>  
  <div class="goods_footer">  
    <div class="footerButton">
        <span @click.stop="addCollection"><i :class="iscolled!=0?'active':''"></i><em>收藏</em></span>
        <span><a :href="'tel:'+$store.state.serviceTelephone"><i class="service"></i><em>客服</em></a></span>
        <span @click.stop="jumpShop"><i class="shopcar"></i><em>购物车</em><b v-if="$store.state.shpCardNum" class="icon">{{$store.state.shpCardNum}}</b></span>
        <span class="wid245" v-if="dataNum > 0 && goodsObj.goodsSellType == 1" @click.stop="$store.commit('changeTanchaungType',5)">加入购物车</span>
        <span class="wid245" v-if="dataNum > 0 && goodsObj.goodsSellType == 1" @click.stop="$store.commit('changeTanchaungType',4)">立即购买</span>
        <span class="dhtz" v-if="dataNum <= 0 && goodsObj.goodsSellType == 1"  style="background:#6f9ac2;" @click.stop=" ">到货通知</span>
        <!-- 预售底部按钮 -->
        <span class="dhtz" v-if="goodsObj.goodsSellType == 2" :style="preSale.Stage == 1?'background:#CEA63F;':'background:#CEA63F;opacity:.5'" @click.stop="PreSaleClick">支付定金</span>
        <span class="dhtz" v-if="goodsObj.goodsSellType == 4" :style="preSale.Stage == 1?'background:#CEA63F;':'background:#CEA63F;opacity:.5'" @click.stop="PreSaleClick">立即购买</span>
        <span class="dhtz" v-if="goodsObj.goodsSellType == 3" :style="goodsObj.appointShow ==1?'background:#CEA63F;':'background:#CEA63F;opacity:.5'" @click.stop="NoticeArrival" v-text="goodsObj.appointShow ==1?'立即预约':'已预约'"></span>
    </div>

    <!-- 商品选择弹窗 --> 
    <mt-popup v-model="$store.state.thirdParty" class="tanchuang" position="bottom">
      <div v-if="$store.state.tanchaungType == 4 || $store.state.tanchaungType == 5 || $store.state.tanchaungType == 7" class="guige">
          <div class="goodTitle">
            <div class="goodImg"><img :src="goodsObj.imgUrl" alt=""></div>
            <div class="goodName">
              <p v-if="goodsObj.goodsSellType == 1">¥<em>{{(goodsObj.salePrice/100).toFixed(2)}}</em></p>
              <p v-if="goodsObj.goodsSellType == 4 || goodsObj.goodsSellType == 3"><em v-text="goodsObj.presellMoneyStr?goodsObj.presellMoneyStr:'待发布'"></em></p>
              <p v-if="goodsObj.goodsSellType == 2"><em v-text="goodsObj.presellMoneyStr?goodsObj.presellMoneyStr:'待发布'"></em></p>
              <p>{{goodsObj.goodsName}}</p> 
            </div>
          </div>
          <div class="goodgg">
            <div class="gg" v-for="model in goodsObj.modelList">
              <p>{{model.modelName}}</p>
              <p><span v-for="Options in model.modelOptionsList" :class="(Options.flag&&Options.flag ==1)?'active':''" @click.stop="changeOnlineId(Options.onlineId)">{{Options.value}}</span></p>
            </div>
          </div>
          <div class="goodNum">
            <span>购买数量</span>
            <el-input-number size="mini" v-model="DataNum" @change="handleChange" :min="1" label="描述文字"></el-input-number>
            <!-- <el-input-number v-model="goodNum" @change="handleChange" :min="1" label="描述文字"></el-input-number> -->
          </div>  
          <button v-if="$store.state.tanchaungType == 5 && dataNum > 0 && goodsObj.goodsSellType == 1"  @click.stop="addShopCard">加入购物车</button>
          <button v-if="$store.state.tanchaungType == 4 && dataNum > 0 && goodsObj.goodsSellType == 1" class="active" @click.stop="buy(goodsObj,DataNum)">立即购买</button>
          <button v-if="($store.state.tanchaungType == 4 || $store.state.tanchaungType == 5) && dataNum <= 0 && goodsObj.goodsSellType == 1" style="background:#6F98C3;" @click.stop="NoticeArrival">到货通知</button>
          
          <button v-if="($store.state.tanchaungType == 4 || $store.state.tanchaungType == 5) && goodsObj.goodsSellType == 2" :style="preSale.Stage == 1?'background:#CEA63F;':'background:#CEA63F;opacity:.5'" @click.stop="buy(goodsObj,DataNum)">支付定金</button>
          <button v-if="($store.state.tanchaungType == 4 || $store.state.tanchaungType == 5) && goodsObj.goodsSellType == 4" :style="preSale.Stage == 1?'background:#CEA63F;':'background:#CEA63F;opacity:.5'" @click.stop="buy(goodsObj,DataNum)">立即购买</button>
          <button v-if="($store.state.tanchaungType == 4 || $store.state.tanchaungType == 5) && goodsObj.goodsSellType == 3" :style="goodsObj.appointShow ==1?'background:#CEA63F;':'background:#CEA63F;opacity:.5'" @click.stop="NoticeArrival" v-text="goodsObj.appointShow ==1?'立即预约':'已预约'"></button>
      </div>
    </mt-popup>
  </div>  
</template>  
  
<script> 
import Cookies from 'js-cookie';
import {Toast,MessageBox} from 'mint-ui' 
import util from '@/libs/util' 
import axios from 'axios'
export default {  
  name: 'goods_footer',  
  data() {  
    return {  
      DataNum:1,//数量选择框默认数量
      clickTrue:false,
      shoppingCardNum:null,
      preSale:{//预售数据封装对象
        Stage:null,//预售阶段（0预售未开始，1预售已开始，2预售结束）
      },
    };  
  },
  props:{
    dataNum:Number,
    iscolled:Number,
    goodsObj:Object,
  },
  components:{
      
  },
  created(){
    this.ajaxTelephone();
    if(localStorage.getItem("shoppingCard") && localStorage.getItem("shoppingCard") != 0){
      let shopArr = localStorage.getItem("shoppingCard").split(',');//JSON.stringify(json);
      this.$store.commit('addShpCardNum',shopArr.length); 
    }else{
      this.$store.commit('addShpCardNum',0); 
    }
  },
  watch:{
    iscolled(){
      this.iscolled = this.iscolled;
    },
    dataNum(){
      this.dataNum = this.dataNum;
    },
    goodsObj(){
      this.goodsObj = this.goodsObj;
      this.DistinguishPreSale(this.goodsObj);
    }
  },
  methods:{
    ajaxTelephone(){//获取客户电话
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
          that.$store.commit('addServiceTelephone',response.data.body.val);
        }else{
          Toast(response.data.message);
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
    PreSaleClick(){//预售商品底部按钮点击事件
      let vm = this;
      if(vm.preSale.Stage != 1){//预售按钮致灰，不可点击
        return;
      }
      vm.$store.commit('changeTanchaungType',4);
    },
    DistinguishPreSale(goodObj){//预售商品页面显示数据处理
      let vm = this;
      if(goodObj.goodsSellType && (goodObj.goodsSellType==2 || goodObj.goodsSellType==4)){//是定金预售和全款预售
        let newTime = new Date().getTime();//当前时间戳
        if(goodObj.presellStartTimeL>newTime){//预售未开始
          if(goodObj.stock <= 0){
            vm.preSale.Stage = 2;
          }else{
            vm.preSale.Stage = 0;
          }
        }else{
          if(goodObj.presellEndTimeL>newTime){//预售已开始，未结束
            if(goodObj.stock <= 0){
              vm.preSale.Stage = 2;
            }else{
              vm.preSale.Stage = 1;
            }
          }else{//预售已结束
            vm.preSale.Stage = 2;
          }
        }
        console.log('footer:'+vm.preSale.Stage);
      }
    },
    changeOnlineId(ID){
      this.$emit('upup',ID); //主动触发upup方法，'hehe'为向父组件传递的数据
    },
    jumpShop(){//购物车按钮跳转
      window.sessionStorage.setItem('tabbar','shoppingCart');
      this.$router.replace({path:'/shoppingCart'});
    },
    buy(obj,num){//立即购买
      let vm = this,str = '',arr=[],Obj={};
      if(vm.goodsObj.goodsSellType !=1 && vm.preSale.Stage != 1){//1预售已开始
        return;
      }else {//普通商品
        if(obj.stock == 0){
          return;
        }
      }
      Obj = obj;
      if(vm.goodsObj.goodsSellType ==2){//定金预售单个商品
        Obj.TotalCommodity = obj.deposit*num;
      }else if(vm.goodsObj.goodsSellType ==4){//全款预售单个商品
        Obj.TotalCommodity = obj.presellMoney*num;
      }else if(vm.goodsObj.goodsSellType ==1){//普通商品单个商品
        Obj.TotalCommodity = obj.salePrice*num;
      }
      Obj.type=1;
      Obj.id=obj.onlineId;
      Obj.ObjNumber = num;
      arr.push(Obj);
      for(let i in arr){
        if(i == arr.length-1){
          str+=JSON.stringify(arr[i]);
        }else{
          str+=JSON.stringify(arr[i])+'&&';
        }
      }

      window.sessionStorage.setItem('orderGoods',str);
      if(Cookies.get('VUE2SESSID')){
        if(vm.goodsObj.goodsSellType == 2){
          this.$router.push({name:'confirmationOrder',query:{sourcePage:'PreSale',canChoice:Obj.opModel}});
        }else{
          this.$router.push({name:'confirmationOrder',query:{canChoice:Obj.opModel}});
        }
      }else{
        this.$router.push({name:'signInPage'});
      }
    },
    addShopCard(){//弹窗加入购物车按钮点击事件
      let shopArr =[]; 
      //购物车商品数据
      if(localStorage.getItem("shoppingCard")){
        shopArr = localStorage.getItem("shoppingCard").split(',');//shopArr=['id:12222&num:12','id:12222&num:12'];
        if(localStorage.getItem("shoppingCard").indexOf(this.$store.state.goodId) >= 0){
          for(let i in shopArr){//该元素在tmp内部不存在才允许追加
            if(shopArr[i].indexOf(this.$store.state.goodId)>=0){
              let num = Number(shopArr[i].split('&')[1].split(':')[1])+this.$store.state.thisGoodNum;
              shopArr[i]='id:'+shopArr[i].split('&')[0].split(':')[1]+'&num:'+num+'&type:'+shopArr[i].split('&')[2].split(':')[1];
            }
          }
        }else{
          shopArr.push('id:'+this.$store.state.goodId+'&num:'+this.$store.state.thisGoodNum+'&type:'+1);
        }
      }else{
        shopArr.push('id:'+this.$store.state.goodId+'&num:'+this.$store.state.thisGoodNum+'&type:'+1);
      }
      localStorage.setItem("shoppingCard",shopArr);
      this.$store.commit('changeTanchaungType',5);//购物车弹窗开关控制
      this.readShopNum();
    },
    readShopNum(){
      if(localStorage.getItem("shoppingCard")){
        let num = localStorage.getItem("shoppingCard").split(',').length;//shopArr=['id:12222&num:12','id:12222&num:12'];
        this.$store.commit('addShpCardNum',num);
      }
    },
    handleChange(value) { 
      this.$store.commit('addthisGoodNum',value);
    },
    addCollection(){//收藏方法
      if(this.iscolled==1){
        this.CancelCollection();
      }else{
        this.Collection();
      }
    },
    Collection(){//收藏
      let that =this;
      let data = {
        onlineId:that.$store.state.goodId,
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/collect/addCustCollect"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          Toast('收藏成功！');
          that.iscolled = 1;
        }else{
          if(response.data.status == 499){
            that.$router.push({name:'signInPage',query:{outLogin:'/'}});
          }else{
            MessageBox('系统提示',response.data.message);
          }
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
    CancelCollection(){//取消收藏
      let that =this;
      let data = {
        onlineId:that.$store.state.goodId,
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/collect/delCustCollect"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          Toast('取消收藏！');
          that.iscolled = 0;
        }else{
          if(response.data.status == 499){
            that.$router.push({name:'signInPage',query:{outLogin:'/'}});
          }else{
            MessageBox('系统提示',response.data.message);
          }
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
    NoticeArrival(){//到货通知按钮事件
      let vm =this;
      if(vm.goodsObj.appointShow == 0 && vm.goodsObj.goodsSellType == 3){//预约预售商品已经预约
        return;
      }
      let data = {
        onlineId:vm.$store.state.goodId,
      };
      if(vm.goodsObj.goodsSellType && vm.goodsObj.goodsSellType != 1){
        data['messageType'] = 2;
      }else{
        data['messageType'] = 1;
      }
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/goods/notice"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          if(vm.goodsObj.goodsSellType && vm.goodsObj.goodsSellType != 1){
            MessageBox({
              title: '预约成功！',
              message: '请关注提醒及时抢购，货源有限先到先得哦！',
              showCancelButton: false,
              confirmButtonText:'知道啦'
            }).then(action => {
              if(action == 'confirm'){
                vm.$emit('upup',vm.$store.state.goodId); //主动触发upup方法，'hehe'为向父组件传递的数据
              }
            });
          }else{
            Toast('设置成功！');
          }
        }else{
          if(response.data.status == 499){
            vm.$router.push({name:'signInPage',query:{outLogin:'/'}});
          }else{
            MessageBox('系统提示',response.data.message);
          }
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    }
  },
};  
</script>  
  
<style lang="less" scoped>   
     @import '../../assets/less/goods_footer.less';
</style> 