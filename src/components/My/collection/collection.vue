<template>  
  <div class="collection">
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'我的收藏'"></headers>
    <div class="goods" v-if="isShow" :style="$store.state.titleShow?'margin-top:.45rem':''">
      <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <li v-for="(item,index) in list">
          <div class="singleGood"  @click.stop="$router.push({path:'goodsDevele',query:{onlineId:item.onlineId}})">
            <div class="goodImg">
              <img :src="item.imgUrl" alt="">
              <span v-show="item.goodsSellType!=1" :class="item.displayType==1?'plesaleGood':'plesaleGood nohave'" v-text="item.displayType==1?'预售':'预售结束'"></span>
            </div>
            <div class="gooddata">
              <p class="goodTitle">{{item.goodsName}}</p>
              <span class="highlight">{{item.salePriceText}}</span>
              <p class="auxiliary">
                <span>{{item.reviewNum}}人评价</span>    <span>{{item.praiseRate}}%好评</span> <span @click.stop="deleteColl(item.onlineId,index)"><i></i>删除收藏</span>
              </p>
            </div>
          </div>
        </li>
        <li class="loading" v-if="isload">
          <img :src="loadingImg" alt="">
          加载中...
        </li>
        <li class="botton" v-if="isBotton">
          <hr><span>我也是有底线的</span><hr>
        </li>
      </ul>
    </div>
    <div class="nodata" v-if="!isShow">
      <img src="../../../assets/images/my/coupons/collect_empty@2x.png" alt=""><br>暂无收藏
    </div>
    <navigation></navigation>
  </div>  
</template>  
  
<script>  
import navigation from '../../goods/navigation.vue'
import headers from '../../headers.vue' 
import {Toast,MessageBox} from 'mint-ui'
import axios from 'axios'
import util from '@/libs/util' 
export default {  
  name: 'collection',
  data() {  
    return {  
      isShow:true,//无数据提示
      hasNext:true,//是否有下一页
      pageNo:0,//页数
      isBotton:false,//底线默认不显示
      isload:false,//loading默认不显示
      listNum:null,//页面显示数据数量
      loadingImg:null,//加载图
      list:[],
    };  
  },
  components:{
    headers:headers,
    navigation:navigation,
  },
  methods:{
    deleteColl(onlineId,index){//删除收藏
      MessageBox.confirm('您确定要删除该商品吗?').then(action => {
        let that =this;
        let data = {
          onlineId:onlineId
        };
        let urlStr = util.getpost(data);
        axios({
          method:"post",
          url:"/collect/delCustCollect"+urlStr,
          dataType: 'json',
          data:data,
        }).then(response => {
          if(response.data.status == 0){
            Toast('删除成功！');
            that.list.splice(index,1);
            if(that.list.length<1){
              that.ajaxData(1);
            }
          }else{
            MessageBox('系统提示',response.data.message);
          }
          response.data.body
        }).catch(oData => {
          MessageBox('系统提示',oData.data.message);
        })
      });       
    },
    loadMore() {
      if(this.hasNext){//有下一页
        setTimeout(() => {
          this.isload=true;//显示加载图
          this.ajaxData(this.pageNo+=1);
        }, 1000);
      }else{
        this.isBotton = true;
      }
    },
    ajaxData(pageNo){
      let that =this;
      let data = {
        pageNo:pageNo
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/collect/custCollect"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        this.isload=false;//关闭加载图
        if(response.data.status == 0){
          if(response.data.body.items.length == 0 && pageNo == 1){
            that.loading = false;//没有下一页
            that.isShow = false;//第一页没有数据
            that.hasNext =false;
          }else if(response.data.body.items.length == 0 && pageNo != 1){
            that.loading = false;//非第一页，但是没有数据了，没有下一页
            that.hasNext =false;
          }else{
            if(pageNo == 1){
              that.list = response.data.body.items;
            }else{
              that.list = that.list.concat(response.data.body.items);
            }
            that.listNum += response.data.body.items.length;
            if(that.listNum == response.data.body.total){
              that.loading = false;
              that.hasNext =false;
            }else{
              that.loading = true;
              that.hasNext =true;
            }
          }
        }else{
          that.hasNext =false;
          that.loading = false;//没有下一页
          that.isShow = false;
          MessageBox('系统提示',response.data.message);
        }
        response.data.body
      }).catch(oData => {
        that.hasNext =false;
        that.isload=false;//关闭加载图
        that.loading = false;//没有下一页
        that.isShow = false;
        MessageBox('系统提示',oData.data.message);
      })
    }
  },
  created(){
  	util.setTitle('我的收藏');
    this.loadingImg = util.loadImg;
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
  },
  beforeRouteUpdate(to,from,next){
    
  }
};  
</script>  
  
<style lang="less" scoped>   
	@import '../../../assets/less/collection.less';
</style> 











