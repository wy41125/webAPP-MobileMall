<template>  
  <div class="customerList order" :style="!isShow?'height:'+heightStr+'px;':''">
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'售后申请'"></headers>
    <ul class="title_ul" :style="$store.state.titleShow?'margin-top:.45rem':''">
      <li v-for=" (item,index) in items" :class="index==clickType?'active':''" @click.stop="switchTabbar(item.type)">{{item.name}}</li>
    </ul>
    <div class="haveData" v-if="isShow" :style="$store.state.titleShow?'margin-top:.9rem':''">
      <!-- <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" distance-index="2"> -->
        <div class="customer" @touchstart="funckaishi($event)" @touchmove="functionHeight($event)" v-for="item in orders" @click.stop="jumpPage(item.cancelId)">
          <p class="title" style="font-size:12px;">服务单号：{{item.cancelOrderNo}} <span>{{item.serviceName}}</span></p>
          <div class="div_img" v-if="item.goodsDetails && item.goodsDetails.length>0">
            <img v-for="Detail in item.imgUrlArr" :src="Detail" alt="">
            <p style="font-size:12px;" v-if="item.imgUrlArr.length<2">{{item.goodsDetails[0].goodsName}}</p>
          </div>
          <p class="state" style="font-size:12px;"><i></i>{{item.statusName}}</p>  
        </div>
      <!-- </mt-loadmore> -->
    </div>
    <div class="nodata" v-if="!isShow">
      <img src="../../../assets/images/my/location_empty@2x.png" alt="">
      <span>您没有订单在售后</span>
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
  name: 'customerList',  
  data() {  
    return {  
      isShow:false,
      clickType:0,
      items:[//1.待支付 , 2,.待收货 , 3.已完成 , 4.已取消
        {name:'全部',type:0},{name:'退款',type:1},{name:'换货',type:2},{name:'退货',type:3}
      ],
      titleType:0,
      orders:[],
      allLoaded:false,
      pageNo:1,
      heightStr:null,
      ifNext:true,
    };  
  },
  components:{
    headers:headers,
    navigation:navigation,
  },
  methods:{
    funckaishi(e){
     this.yuansukaishi = window.scrollY;
    },
    functionHeight(e){
      this.yuansujieshu = window.scrollY;
      if(this.yuansujieshu>500 && this.ifNext){
        this.pageNo+=1;
        this.ajaxOrder();
      }
    },
    jumpPage(id){//跳转售后单详情页
      this.$router.push({name:'customDe',query:{cancelId:id}});
    },
    loadTop() {
      this.switchTabbar(this.titleType);
      this.$refs.loadmore.onTopLoaded();
    },
    loadBottom() {
      this.ajaxOrder();
      this.$refs.loadmore.onBottomLoaded();
    },
    switchTabbar(type){//切换标题，请求数据，切换的同时请求的页面要初始化
      let that = this;
      that.clickType = type;
      if(type==1){
        that.titleType = 4;
      }else if (type==2){
        that.titleType = 2;
      }else if(type==3){
        that.titleType = 1;
      }else if(type==0){
        that.titleType = 0;
      }
      that.pageNo = 1;
      that.ajaxOrder();
    },
    ajaxOrder(){//数据请求
      let that =this;
      let data = {
        "serviceType": that.titleType,//(描述：订单状态（null.查询所有  1.待支付 , 2,.待收货 , 3.已完成 , 4.已取消）、类型：Integer、是否必填：Y)
        "pageNo": that.pageNo//(描述：第几页、类型：Integer、是否必填：Y)
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/ordercs/getOrderCancelPage"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          if(response.data.body.items.length == 0 && that.pageNo==1){
            that.isShow=false;
            that.allLoaded=true;
            that.ifNext = false;
          }else{
            that.isShow=true;
            if(that.pageNo ==1){
              that.orders = response.data.body.items;
            }else{
              if(response.data.body.items.length>0){
                for(let i in response.data.body.items){
                  that.orders.push(response.data.body.items[i]);
                }
              }
            }
            for(let i in that.orders){
              if(that.orders[i].serviceType == 4){//退款售后单
                that.orders[i]['serviceName'] = '退款';
                if(that.orders[i].status==2){//退款成功
                  that.orders[i]['statusName'] = '退款成功';
                }else{
                  that.orders[i]['statusName'] = '审核中';
                }
              }else{//非退款售后单
                if(that.orders[i].serviceType == 1){
                  that.orders[i]['serviceName'] = '退货';
                  if(that.orders[i].opStatus == 1){//退货：审核中
                    that.orders[i]['statusName'] = '审核中';
                  }else if(that.orders[i].opStatus == 2){//退货：退货中
                    that.orders[i]['statusName'] = '退货中';
                  }else if(that.orders[i].opStatus == 3){//退货：审核拒绝
                    that.orders[i]['statusName'] = '审核拒绝';
                  }else if(that.orders[i].opStatus == 4){//退货：已拒绝
                    that.orders[i]['statusName'] = '已拒绝';
                  }else if(that.orders[i].opStatus == 5){//退货：已退货
                    that.orders[i]['statusName'] = '已退货';
                  }else if(that.orders[i].opStatus == 6){//退货：退货拒绝
                    that.orders[i]['statusName'] = '退货拒绝';
                  }
                }else if(that.orders[i].serviceType == 2){
                  that.orders[i]['serviceName'] = '换货';
                  if(that.orders[i].opStatus == 1){//换货：审核中
                    that.orders[i]['statusName'] = '审核中';
                  }else if(that.orders[i].opStatus == 2){//换货：换货中
                    that.orders[i]['statusName'] = '换货中';
                  }else if(that.orders[i].opStatus == 3){//换货：审核拒绝
                    that.orders[i]['statusName'] = '审核拒绝';
                  }else if(that.orders[i].opStatus == 4){//换货：已拒绝
                    that.orders[i]['statusName'] = '已拒绝';
                  }else if(that.orders[i].opStatus == 5){//换货：已换货
                    that.orders[i]['statusName'] = '已换货';
                  }else if(that.orders[i].opStatus == 6){//换货：换货拒绝
                    that.orders[i]['statusName'] = '换货拒绝';
                  }
                }
              }
              let imgUrlArr =[];
              for(let a=0;a<that.orders[i].goodsDetails.length;a++){
                let obj = that.orders[i].goodsDetails[a];
                if(obj.packageId){
                  for(let b =0;b<obj.packageDetails.length;b++){
                    imgUrlArr.push(obj.packageDetails[b].imgUrl);
                  }
                }else{
                  imgUrlArr.push(obj.imgUrl);
                }
              }
              that.orders[i]['imgUrlArr'] = imgUrlArr;
            }
            if((response.data.body.total-(response.data.body.limit*response.data.body.page))>0){//有下一页
              that.ifNext = true;
            }else{
              that.allLoaded = true;
              that.ifNext = false;
            }
          }
        }else{
          if(response.data.status = 499){//token失效或没有token
            util.outLogin();
            that.$router.push({name:'signInPage',query:{outLogin:'/'}});
          }else{
            that.isShow=false;
            that.allLoaded=true;
            MessageBox('系统提示',response.data.message);
          }
        }
      }).catch(oData => {
        that.isShow=false;
        that.allLoaded=true;
        MessageBox('系统提示',oData.data.message);
      })
    }
  },
  created(){
    this.ajaxOrder();
    util.setTitle('售后申请');
    this.heightStr = window.innerHeight;
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
  }, 
};  
</script>  
  
<style lang="less" scoped>   
    @import "../../../assets/less/order.less";
    @import '../../../assets/less/customerList.less';
</style> 





















