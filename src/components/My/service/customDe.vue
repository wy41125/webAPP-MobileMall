<template>  
  <div class="customDe"> 
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'服务单详情'"></headers>
    <div :style="$store.state.titleShow?'margin-top:.45rem':''">
      <p class="wuliu" v-if="cancelObj.isExpress == 1" @click.stop="jumpWuliu(cancelObj.cancelId,cancelObj.expressHistoryId)"><i></i>物流跟踪（<em v-text="cancelObj.expressType == 1?'寄':'收'"></em>）</p>
      <div class="wuliuxinxi" v-if="cancelObj.opStatus == 2 || cancelObj.opStatus == 6">
        <p class="wuliuxinxi_title">退货寄送至（或到店）：</p>
        <ul>
          <li><span>收件姓名：</span>{{cancelObj.name}}</li>
          <li><span>联系电话：</span>{{cancelObj.linkPhone}}</li>
          <li><span>收货地址：</span>{{cancelObj.address}}</li>
        </ul>
        <p class="wuliuxinxi_zhushi"><i></i><em v-if="cancelObj.serviceType ==1">注：确保服务单中所有商品都退货，快递包裹中备注服务单号，晶杰之家确认收货后自动退款</em><em v-if="cancelObj.serviceType ==2">注：确保服务单中所有商品都换货，快递包裹中备注服务单号，晶杰之家确认收货后自动退款</em></p>
      </div>
      <p style="width:100%;height:.05rem;background:#ececec;" v-if="cancelObj.isExpress == 1 || cancelObj.opStatus == 2 || cancelObj.opStatus == 6"></p>
      <div class="fuwudan">
        <p class="fuwudan_title"><i></i>晶杰之家服务单 <span><b></b><a :href="'tel:'+$store.state.serviceTelephone" style="font-size:12px;">联系客服</a></span></p>
        <div class="fuwudan_jincheng">
          <el-steps :active="jinduType" align-center v-if="cancelObj.serviceType==4">
            <el-step title="审核中" ></el-step>
            <el-step title="已退款" ></el-step>
          </el-steps>
          <el-steps :active="jinduType" align-center v-if="cancelObj.serviceType==1">
            <el-step title="审核中" ></el-step>
            <el-step :title="jinduZuihouStr1"></el-step>
            <el-step v-if="jinduZuihouStr2" :title="jinduZuihouStr2"></el-step>
          </el-steps>
          <el-steps :active="jinduType" align-center v-if="cancelObj.serviceType==2">
            <el-step title="审核中" ></el-step>
            <el-step :title="jinduZuihouStr1"></el-step>
            <el-step v-if="jinduZuihouStr2" :title="jinduZuihouStr2"></el-step>
          </el-steps>
        </div>
      </div>  
      <div class="yuanyin" v-if="(cancelObj.opStatus == 3||cancelObj.opStatus == 6)&&(cancelObj.refuseReason&&cancelObj.refuseReason!='')">
        <p>拒绝原因：</p>
        <p>{{cancelObj.refuseReason}}</p>
      </div>
      <div class="dingdanxinxi">
        <ul>
          <li><span>服务单号：</span>{{cancelObj.cancelOrderNo}}</li>
          <li><span>服务类型：</span>{{fuwuleixing}}</li>
          <li v-if="cancelObj.serviceType==1 || cancelObj.serviceType==4"><span>退款金额：</span>¥{{(cancelObj.totalRefund/100).toFixed(2)}}</li>
          <li><span>联系方式：</span>{{cancelObj.contactPhone}}</li>
          <li v-if="cancelObj.serviceType==1"><span>退货原因：</span>{{cancelObj.cancelReason}}</li>
          <li v-if="cancelObj.serviceType==2"><span>换货原因：</span>{{cancelObj.cancelReason}}</li>
          <li v-if="cancelObj.serviceType==4"><span>退款原因：</span>{{cancelObj.cancelReason}}</li>
          <li v-if="cancelObj.serviceType != 4"><span>是否拆封：</span><em v-text="cancelObj.isOpen ==1?'已拆封':'未拆封'"></em></li>
          <li v-if="cancelObj.cancelDesc && cancelObj.cancelDesc!=''"><span>退货说明：</span>{{cancelObj.cancelDesc}}</li>
          <li v-if="cancelObj.imgUrls && cancelObj.imgUrls.length>0">
            <span></span>
            <img v-for="img in cancelObj.imgUrls" :src="img" alt="">
          </li>
        </ul>
      </div>
      <p style="width:100%;height:.05rem;background:#ececec;"></p>
      <div class="goodXinxi">
        <p :class="cancelObj.isDelete != 1?'goodXinxi_title':'goodXinxi_title noafter'" >商品信息<span @click.stop="jumpPage(cancelObj.orderId)" v-if="cancelObj.isDelete != 1">查看关联订单</span></p>
        <div class="order_goods">
          <div class="good_div nopackage" v-for="good in cancelObj.details" v-if="!good.packageDetails" :style="cancelObj.details.length==1?'border:0px solid #ddd;':''">
            <div class="goodXinxi" >
              <div class="goodXinxi_img">
                <img :src="good.imgUrl">
              </div>
              <div class="goodXinxi_name special">
                <p class="goodXinxi_name_oneP">{{good.goodsName}}</p>
                <p class="goodXinxi_name_twoP">{{good.salePriceStr}}<i>x{{good.num}}</i></p>
              </div>  
            </div>
            <p class="gift" v-if="good.giftReturn && good.giftReturn.length>0" v-for="gift in good.giftReturn">【赠品】 {{gift.goodsName}}<i>x{{gift.num}}</i></p>
          </div>
          <div class="good_div" v-for="good in cancelObj.details" v-if="good.packageDetails" :style="cancelObj.details.length==1?'border:0px solid #ddd;':''">
            <p class="package_p"><i>优惠套餐</i>{{good.packageName}} <span class="setPrice">¥{{(good.salePrice/100).toFixed(2)}}<b>x{{good.num}}</b></span></p>
            <div class="goodXinxi" v-for="(item,i) in good.packageDetails" v-if="good.packageDetails && good.packageDetails.length>0" :style="i==good.packageDetails.length-1?'border:0px solid #ececec;':''">
              <div class="goodXinxi_img">
                <img :src="item.imgUrl">
              </div>
              <div class="goodXinxi_name">
                <p>{{item.goodsName}}</p>
              </div>  
            </div>
            <p class="setPrice">{{good.salePriceStr}}<i>x{{good.num}}</i></p>
            <p class="gift" v-if="good.giftReturn && good.giftReturn.length>0" v-for="gift in good.giftReturn">【赠品】 {{gift.goodsName}}<i>x{{gift.num}}</i></p>
          </div>
        </div>
        <p class="goodXinxi_price" v-if="cancelObj.isUseCard==1 && cancelObj.serviceType != 2">优惠折后可退金额：¥{{(cancelObj.totalRefund/100).toFixed(2)}}</p>
      </div>
      <button class="button" v-if="cancelObj.isExpress != 1 && cancelObj.opStatus == 2" @click.stop="jumpLogFunc(cancelObj.cancelId)">填写<em v-if="cancelObj.serviceType ==1">退货</em><em v-if="cancelObj.serviceType ==2">换货</em>物流单号</button>
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
  name: 'customDe',  
  data() {  
    return {  
      cancelId:null,//售后单号
      cancelObj:{},//售后单对象
      fuwuleixing:null,//服务类型
      jinduType:null,//进度状态
      jinduZuihouStr1:null,//(退货、换货)最后状态文字描述
      jinduZuihouStr2:null,//(退货、换货)最后状态文字描述
    };  
  },
  components:{
    headers:headers,
    navigation:navigation,
  },
  methods:{
    jumpLogFunc(id){//添加物流
      this.$router.push({name:'logistics',query:{cancelId:id}});
    },
    jumpWuliu(str,id){//跳转物流页面
      this.$router.push({name:'orderTrack',query:{orderId:id,source:'custom',orderCancelId:str}});
    },
    jumpPage(id){//跳转订单详情
      this.$router.push({name:'orderDetails',query:{orderId:id}});
    },
    ajaxqingqiu(){
      let that =this;
      let data = {
        "cancelOrderId":that.cancelId//(描述：售后单id、类型：String、是否必填：Y)
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/ordercs/getOrderCancelDetailForReturn"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          that.cancelObj = response.data.body;
          that.changeStr();
          that.jinduTypeFunc();
        }else{
          if(response.data.status = 499){//token失效或没有token
            util.outLogin();
            that.$router.push({name:'signInPage',query:{outLogin:'/'}});
          }else{
            MessageBox('系统提示',response.data.message);
          }
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
    jinduTypeFunc(){//进度状态
      let that = this;
      if(that.cancelObj.serviceType ==4){//退款
        if(that.cancelObj.status == 2){//已退款
          that.jinduType = 2;
        }else{
          that.jinduType = 1;
        }
      }else if(that.cancelObj.serviceType ==1){//退货
        if(that.cancelObj.opStatus == 1){//待审核
          that.jinduType = 1;
          that.jinduZuihouStr1 = '退货中';
          that.jinduZuihouStr2 = '已退货';
        }else if(that.cancelObj.opStatus == 2){//审核通过
          that.jinduType = 2;
          that.jinduZuihouStr1 = '退货中';
          that.jinduZuihouStr2 = '已退货';
        }else if(that.cancelObj.opStatus == 3){//审核拒绝
          that.jinduType = 2;
          that.jinduZuihouStr1 = '审核拒绝';
        }else if(that.cancelObj.opStatus == 4){//取消申请
          that.jinduType = 2;
          that.jinduZuihouStr1 = '已取消';
        }else if(that.cancelObj.opStatus == 5){//售后成功
          that.jinduType = 3;
          that.jinduZuihouStr1 = '退货中';
          that.jinduZuihouStr2 = '已退货';
        }else if(that.cancelObj.opStatus == 6){//售后失败
          that.jinduType = 3;
          that.jinduZuihouStr1 = '退货中';
          that.jinduZuihouStr2 = '退货拒绝';
        }
      }else if(that.cancelObj.serviceType ==2){//换货
        if(that.cancelObj.opStatus == 1){//待审核
          that.jinduType = 1;
          that.jinduZuihouStr1 = '换货中';
          that.jinduZuihouStr2 = '已换货';
        }else if(that.cancelObj.opStatus == 2){//审核通过
          that.jinduType = 2;
          that.jinduZuihouStr1 = '换货中';
          that.jinduZuihouStr2 = '已换货';
        }else if(that.cancelObj.opStatus == 3){//审核拒绝
          that.jinduType = 2;
          that.jinduZuihouStr1 = '审核拒绝';
        }else if(that.cancelObj.opStatus == 4){//取消申请
          that.jinduType = 2;
          that.jinduZuihouStr1 = '已取消';
        }else if(that.cancelObj.opStatus == 5){//售后成功
          that.jinduType = 3;
          that.jinduZuihouStr1 = '换货中';
          that.jinduZuihouStr2 = '已换货';
        }else if(that.cancelObj.opStatus == 6){//售后失败
          that.jinduType = 3;
          that.jinduZuihouStr1 = '换货中';
          that.jinduZuihouStr2 = '换货拒绝';
        }
      }
    },
    changeStr(){//服务类型
      let that = this;
      if(that.cancelObj.serviceType ==1){
        that.fuwuleixing = '退货';
      }else if(that.cancelObj.serviceType ==2){
        that.fuwuleixing = '换货';
      }else if(that.cancelObj.serviceType ==3){
        that.fuwuleixing = '维修';
      }else if(that.cancelObj.serviceType ==4){
        that.fuwuleixing = '退款';
      }else if(that.cancelObj.serviceType ==5){
        that.fuwuleixing = '退定金';
      }
    },
  },
  created(){
    this.cancelId = this.$route.query.cancelId;
    this.ajaxqingqiu();
    util.setTitle('服务单详情');
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
  @import '../../../assets/less/customDe.less';
</style> 





















