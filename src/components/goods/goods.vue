<template>  
  <div class="goods" >  
    <!-- 轮播 -->
    <div class="swipeDiv swipeGoods goodSwipe" style="background:#fff;">
      <mt-swipe :auto="3000">
          <mt-swipe-item v-for="img in goods.photoBook">
            <img class="imagesStyle" :src="img">
          </mt-swipe-item>
        </mt-swipe>
    </div>
    <!-- 预售商品信息 -->  
    <div v-if="goods.goodsSellType && goods.goodsSellType != 1" :class="(goods.goodsSellType == 2 && goods.depositDiscountAmount && goods.depositDiscountAmount != '')?'appointmentManey':'appointmentManey bottomframe'" >
      <span style="margin-left:.3rem;" class="maney" v-if="goods.goodsSellType == 4 || goods.goodsSellType == 3"><em>{{goods.presellMoneyStr}}</em>
      </span>
      <span class="maney" style="float:left;margin-left:.15rem;" v-if="goods.goodsSellType == 2"><i><em v-show="goods.goodsSellType == 2">
        定金</em></i> <span v-html="preSale.depositHtmlStr"></span>  <!-- <em v-text="goods.goodsSellType == 2?goods.depositStr:goods.presellMoneyStr"></em> -->
      </span>
      <span class="twoline" v-if="goods.goodsSellType == 2 && goods.depositDiscountAmount && goods.depositDiscountAmount != ''">
        <em>定金可抵<br>  <em style="font-size:.15rem;">{{goods.depositDiscountAmountStr}}</em></em>
      </span>
      <span v-show="goods.goodsSellType && (goods.goodsSellType==2 || goods.goodsSellType==4) && preSale.Stage !=2" class="timer">
        距预售<em v-text="preSale.Stage == 0?'开始':'结束'"></em>：<br><em v-html="preSale.coundownTimestr"></em>
      </span>
      <span v-show="goods.goodsSellType && (goods.goodsSellType==2 || goods.goodsSellType==4) && preSale.Stage ==2" class="timer oneFont">预售已结束</span>
      <span v-show="goods.goodsSellType && goods.goodsSellType==3" class="timer appointmenting">预约中</span>
    </div>
    <!-- 商品信息 -->
    <div class="goodsCenent"> 
        <p class="goodsName">{{goods.goodsName}}</p>
        <p class="goodsRemarks" style="color:#999;font-size:12px;" v-if="goods.goodsSellType == 1">{{goods.remark}}</p>
        <p class="goodsPrice" v-if="goods.goodsSellType == 1">¥<span><em style="font-weight: bold;" v-text="(goods.salePrice/100).toFixed(2)"></em></span></p> 
        <p class="goodsPromptone" v-if="goods.goodsSellType != 1 && goods.remark && goods.remark !=''">{{goods.remark}}</p><!-- 预售新增提示语 -->
        <p class="goodsPromptTwo" v-if="goods.goodsSellType == 3"><i>预约中</i>预约后请关注提醒，及时抢购哦～</p>
    </div>
    <!-- 促销、领券、分期、已选、库存 -->
    <div class="thirdParty">
      <!-- 预售新增流程 -->
        <div class="tongyi" v-if="goods.goodsSellType == 2" style="text-align:left;">
            <p class="tongyi_title" style="margin-top:.03rem;">总价</p>
            <div class="tongyi_conent">
              <p class="yusou_p" v-html="preSale.presellMoneyHtmlStr"></p>
            </div>
            <span class="tongyi_icon nodata"></span>
        </div>
        <!-- 预售新增流程 -->
        <div class="tongyi" v-if="goods.goodsSellType == 2" style="text-align:left;">
            <p class="tongyi_title">尾款</p>
            <div class="tongyi_conent">
              <p class="yusou_p">
                <span v-html="preSale.finalMoneyHtmlStr" style='border:0px solid #ddd;'></span> 
                <b v-show="goods.finalMoneyAdd" style="font-size:.12rem;">{{goods.finalMoneyAdd}}</b>
              </p>
            </div>
            <span class="tongyi_icon nodata"></span>
        </div>
        <div class="tongyi thirdParty_promotion" v-if="goods.giftList.length != 0">
            <p class="tongyi_title">促销</p>
            <div class="tongyi_conent">
              <p v-for="gift in zengpinObj" :giftId="gift.giftId">
                <span style="padding:0 .02rem;">赠品</span>{{gift.goodsName}}（赠完为止）<i style="color:#999;">x{{gift.num}}</i>
              </p>
              <p v-if="goods.giftList.length>2">...</p> 
            </div>
            <span class="tongyi_icon" @click.stop="lookMone(1)"></span>
        </div>  
        <div class="tongyi VoucheCollar" v-if="goods.goodsSellType == 1 && goods.cardList.length != 0">
            <p class="tongyi_title">领券</p>
            <div class="tongyi_conent">
              <span v-if="goods.cardList[0].cardType == 1">
                <em v-text="goods.cardList[0].minUsePrice==0?'无门槛':'满'+(goods.cardList[0].minUsePrice/100)"></em>
                减{{(goods.cardList[0].cardVal/100)}}
              </span>
              <span v-if="goods.cardList[0].cardType != 1">
                <em v-text="goods.cardList[0].minUsePrice==0?'无门槛':'满'+(goods.cardList[0].minUsePrice/100)"></em> 
                享{{goods.cardList[0].cardVal}}折
              </span>

            </div>
            <span class="tongyi_icon" @click.stop="lookMone(2)"></span>
        </div>
        <!-- 预售新增流程 -->
        <div class="tongyi" v-if="goods.goodsSellType != 1" style="text-align:left;">
            <p class="tongyi_title" style="margin-top:.02rem;">流程</p>
            <div class="tongyi_conent">
              <p class="yusou_p" v-if="goods.goodsSellType == 3">1.预约——2.抢购——3.发货</p>
              <p class="yusou_p" v-if="goods.goodsSellType == 4">1.付全款——2.发货</p>
              <p class="yusou_p" v-if="goods.goodsSellType == 2">1.付定金——2.付尾款——3.发货</p>
              <i class="yusouIcon" @click.stop="lookMone(7)"></i>
            </div>
            <span class="tongyi_icon nodata"></span>
        </div>
        <div class="tongyi byStages" v-if="goods.stagingInfo.isUseStaging != 1">
            <p class="tongyi_title">分期</p>
            <div class="tongyi_conent">
              <i></i>
              <em v-text="$store.state.buyGood_huabei?$store.state.buyGood_huabei:goods.stagingInfo.stagingDesc"></em>
            </div>
            <span class="tongyi_icon" @click.stop="lookMone(3)"></span>
        </div>
        <div class="tongyi selecedGoods" @click.stop="selectedPop">
            <p class="tongyi_title">已选</p>
            <div class="tongyi_conent">
                {{goods.goodsName}}
            </div>
            <span class="tongyi_icon"></span>
        </div>
        <div class="tongyi Stock"  @click.stop="lookMone(0)" v-if="goods.goodsSellType == 1">
            <p class="tongyi_title" style="float:left">库存</p>
            <div class="tongyi_conent"><i class="addIcon"></i>{{addStr}}</div>
            <span class="tongyi_icon">{{goods.stock>0?'现货':'无货'}}</span>
        </div>
    </div>
    <!-- 优惠套餐、热门配件、售后-->
    <div class="tcpjsh" :style="goods.goodsReviewDto.totalNum==0?'margin-bottom: 0.7rem;':'margin-top:.05rem;'">
        <div class="tongyi_div tcpjsh_tc" v-if="goods.comboPackageList.length != 0" @click.stop="savePackage(goods.comboPackageList)">
            <p class="tongyiTitle after"><span style="display: inline-block;margin-left: .08rem;">优惠套餐</span></p>
        </div> 
        <div class="tongyi_div tcpjsh_pj" v-if="goods.recommendGoods.length!=0" @click.stop="jumpRecommendGoods(goods.recommendGoods)">
            <p class="tongyiTitle after"><span style="display: inline-block;margin-left: .08rem;">热门配件</span></p>
            <div class="parts" v-for="recommendGood in goods.recommendGoods">
                <p><img :src="recommendGood.imgUrl" alt=""><span>{{recommendGood.typeName}}</span></p>
            </div>
        </div> 
        <div class="support">
          <span v-if="supportDelivery">支持送货上门</span><span v-if="supportSelfLifting">支持到店自提</span>  
        </div>
        <div class="customerService">
            <p><b style="height:.18rem;"></b>7天包退<br><i>（已激活除外）</i></p>
            <p><b></b>15天包换<br><i>（已激活除外）</i></p>
            <p><b></b>优质售后<br><i>（在保修期内）</i></p>
        </div>
    </div>
    <!-- 评论 -->
    <div class="customerEvaluation" v-if="goods.goodsReviewDto.totalNum != 0">
        <p class="evaluationTitle"><span>评价（{{goods.goodsReviewDto.totalNum}}）</span><span @click.stop="jumpReview">好评度<i>{{goods.goodsReviewDto.rateInt}}</i></span></p>
        <div class="evaluation">
          <div v-for="custReviewDtos in goods.goodsReviewDto.custReviewDtos">
            <div class="pelpo">
              <img :src="custReviewDtos.custHeadUrl" alt="" >
              <p>{{custReviewDtos.custName}}<br><i v-for="item in custReviewDtos.goodsStarLevel" class="active"></i><i v-for="star in (5-custReviewDtos.goodsStarLevel)"></i></p>
           </div>
           <div class="pelpoEvaluation">
              <p>{{custReviewDtos.content}}</p>
              <div class="EvaluationImg" v-if="custReviewDtos.pictureImgAddr && custReviewDtos.pictureImgAddr.length>0">
                  <img v-for="img in custReviewDtos.pictureImgAddr" :src="img" alt="" @click.stop="bigImg(img)">
              </div>  
              <p>购买时间：{{custReviewDtos.reviewTime}}</p>
              <p>购买规格：{{custReviewDtos.goodSpecs}}</p>
           </div>
          </div>
          <button class="buttonEvaluation" @click.stop="jumpReview">查看全部评价</button>
        </div>
    </div>
    <!-- 弹窗 -->
    <mt-popup v-model="thirdParty" class="tanchuang" position="bottom">
      <!-- 地区选择弹窗 -->
      <div v-if="tanchaungType == 0" class="tcTongyi">
        <div class="areas">
          <v-distpicker class="map"  :province="'请选择省'" type="mobile" @province="onChangeProvince" @city="onChangeCity" @area="onChangeArea"></v-distpicker>
        </div>
        <div class="yes" @click.stop="openDIzi">
          确定
        </div>
      </div>
      <!-- 促销弹窗 -->
      <div v-if="tanchaungType == 1" class="tcTongyi">
          <p>促销<i @click.stop="lookMone(1)"></i></p>
          <ul>
            <li :class="gift.type!=1?'noclick':''" v-for="gift in goods.giftList" v-if="gift.num!=0" @click.stop="jumpgood(gift.onlineId,gift.type)"><i>赠品</i>{{gift.goodsName}}（<em>赠完为止</em>）<span>x{{gift.num}}</span></li>
          </ul>
      </div>
      <!-- 领券弹窗 -->
      <div v-if="tanchaungType == 2" class="tcTongyi VoucheCollar">
          <p class="title">领券<i @click.stop="lookMone(2)"></i></p>
          <ul>
            <li v-for="card in goods.cardList" v-if="card.cardStatus == 2&& card.cardRemainNum > 0" @click.stop="Coupons(card.cardId)">
              <div class="VoucheCollar_div">
                <div class="plice">
                  <span><b v-text="card.cardType == 1?'¥':''"></b><em>{{card.cardType == 2?card.cardVal:card.cardValText}}</em><b v-text="card.cardType == 2?'折':''"></b></span>
                  <span><em v-text="card.minUsePrice==0?'无门槛':'满'+(card.minUsePrice/100)+'元可用'"></em></span>
                </div>
                <div class="time">
                  <span>{{card.name}}</span>
                  <span>{{card.startTime}}-{{card.endTime}}</span> 
                </div>
              </div>
            </li>
            <li class="have" v-for="card in goods.cardList" v-if="card.cardStatus == 1" @click.stop="jumpGoodLIst(card.cardId)">
              <div class="VoucheCollar_div">
                <div class="plice">
                  <span><b v-text="card.cardType == 1?'¥':''"></b><em>{{card.cardType == 2?card.cardVal:card.cardValText}}</em><b v-text="card.cardType == 2?'折':''"></b></span>
                  <span><em v-text="card.minUsePrice==0?'无门槛':'满'+(card.minUsePrice/100)+'元可用'"></em></span>
                </div>
                <div class="time">
                  <span>{{card.name}}</span>
                  <span>{{card.startTime}}-{{card.endTime}}</span> 
                </div>
              </div>
            </li>
            <li class="nohave" v-for="card in goods.cardList" v-if="card.cardRemainNum <= 0" @click.stop="jumpGoodLIst(card.cardId)">
              <div class="VoucheCollar_div">
                <div class="plice">
                  <span><b v-text="card.cardType == 1?'¥':''"></b><em>{{card.cardType == 2?card.cardVal:card.cardValText}}</em><b v-text="card.cardType == 2?'折':''"></b></span>
                  <span><em v-text="card.minUsePrice==0?'无门槛':'满'+(card.minUsePrice/100)+'元可用'"></em></span>
                </div>
                <div class="time">
                  <span>{{card.name}}</span>
                  <span>{{card.startTime}}-{{card.endTime}}</span> 
                </div>
              </div>
            </li>
          </ul>
      </div>
      <!-- 花呗弹窗 -->
      <div v-if="tanchaungType == 3" class="tcTongyi huabei">
          <p class="title">花呗分期<i @click.stop="lookMone(3)"></i></p>
          <ul>
            <li v-for="staging in goods.stagingInfo.stagingItemList" @click.stop="$store.commit('increment',staging.terminallyPay+'x'+staging.itemStagingNum+'期')">
              <span>{{staging.terminallyPay}}x{{staging.itemStagingNum}}期</span>
              <span v-text="staging.isStaging ==0?'免息，无服务费':'含利息'+staging.poundageCost+'/期'">免息，无服务费</span>
            </li>
          </ul>
      </div>
      <!-- 预售说明 -->
      <div v-if="tanchaungType == 7 && goods.goodsSellType != 1" class="tcTongyi yushou">
          <p class="title">预售说明<i @click.stop="lookMone(7)"></i></p>
          <div class="tiaogui">
            <h4>预售规则：</h4>
            <div v-for="item in goods.presellExplainArr">{{item}}</div>
          </div>
      </div>
    </mt-popup>
    

    <toTop v-if="isshowToTop"></toTop> 
    <div id="allmap"></div>
  </div>   
</template>  
  
<script>  
import Cookies from 'js-cookie';
import VDistpicker from 'v-distpicker'
import {Toast,MessageBox} from 'mint-ui'
import util from '@/libs/util' 
import axios from 'axios'
import toTop from './toTop.vue'
export default {  
  name: 'goods',  
  data() {  
    return {  
      goodNum:1,
      thirdParty:false,
      tanchaungType:null,
      images:[],
      goods:{
        "goodsSellType":null,     // 预售商品需求 2017-05-10 新增字段商品销售类型，1 普通商品，2 预售商品，3 增值服务（碎屏保）默认为1  
        "goodsId": null,//商品ID
        "remark": null,//热点描述
        "onlineId": null,//商品上架ID
        "imgUrl": null,//商品图片
        "expressPrice": null,//运费
        "stock": null,//库存数量
        "salePrice": null, //销售价格
        "photoBook":  [],//lunbo
        "goodsName": null, //商品名称
        "specs": null,  //商品描述
        "stagingInfo":{},//新增字段 （花呗二期）  2017-04-10  花呗分期信息
        "modelList": [],//新增字段，接口合并，将获取商品规格列表接口合并到商品详情接口中
        "comboPackageList":[],//(描述：组合套装列表 、类型：[]、是否必填：Y)
        "cardList":[],//(描述：卡券列表 、类型：[]、是否必填：Y)
        "giftList":[],//(描述：赠品列表 、类型：[]、是否必填：Y)
        "recommendGoods": [],//推荐套餐列表,无数据时该字段无
        "goodsReviewDto": {},//(描述：评论信息 、类型：{}、是否必填：N)
        "modelId":null  //商品型号ID     
      },
      zengpinObj:[],//促销显示2件对象
      pictureAddr:[],
      onlineId:null,
      addStr:null,//地址全拼
      province:null,//省
      city:null,//市
      county:null,//区
      isshowToTop:false,//默认不显示
      supportDelivery:true,//支持送货上门
      supportSelfLifting:true,//支持上门自提
      preSale:{//预售数据封装对象
        Stage:null,//预售阶段（0预售未开始，1预售已开始，2预售结束）
        startTime:0,//预售未开始倒计时间长
        endTime:0,//预售结束倒计时间长
        StartCount: '',//预售未开始计时数字
        StartTimer: null,//预售未开始计时器
        EndCount:'',//预售结束计时数字
        EndTimer:null,//预售结束计时器
        coundownTimestr:'',//倒计时时间显示文字
        depositHtmlStr:'',//定金预售定金样式
        presellMoneyHtmlStr:'',//定金预售总价样式
        finalMoneyHtmlStr:'',//定金预售尾款样式
      },
    };  
  },
  props:{
    goodsObj:Object,
  },
  created(){
    window.addEventListener('scroll',()=>{
      if(window.scrollY>0){
        this.isshowToTop = true;
      }else{
        this.isshowToTop = false;
      }
    })
    // this.onlineId = this.$route.query.onlineId;
    // this.$store.commit('preservationGoodId',this.onlineId);
    
  },
  mounted () {
    this.ready();
  },
  watch:{
    goodsObj(){
      let vm = this;
      clearInterval(vm.preSale.StartTimer);
      vm.preSale.StartTimer = null;
      clearInterval(vm.preSale.EndTimer);
      vm.preSale.EndTimer = null;
      vm.goods = vm.goodsObj;
      if(vm.goods.giftList.length>2){
        vm.zengpinObj = vm.goods.giftList.slice(0,2);
      }else{
        vm.zengpinObj = vm.goods.giftList;
      }
      vm.$store.commit('addGoodData','numberPraise',this.goods.goodsReviewDto.totalNum);
      vm.$store.commit('addGoodData','praiseRate',this.goods.goodsReviewDto.rateInt);
      if(vm.goods.opModel.indexOf('2')>=0){
        vm.supportDelivery = true;
      }else {
        vm.supportDelivery = false;
      }
      if(vm.goods.opModel.indexOf('3')>=0){
        vm.supportSelfLifting = true;
      }else{
        vm.supportSelfLifting = false;
      }
      vm.DistinguishPreSale(vm.goods);
      vm.moneyStyleFunc();
    }
  },
  components:{
    toTop:toTop,
  },
  methods:{
    bigImg(srcStr){
      util.viewPicture(srcStr);
    },
    moneyStyleFunc(){
      let vm = this;
      if(vm.goods.goodsSellType == 2){
        let arr = (vm.goods.deposit/100).toFixed(2).toString().split('.');
        console.log(arr);
        vm.preSale.depositHtmlStr = '<span style="font-size:.15rem;font-weight: bold;">¥ <em style="font-size:.24rem;">'+arr[0]+'</em><i>.'+arr[1]+'</i></span>';
        if(vm.goods.presellMoney && vm.goods.presellMoney !=''){
          let arr1 = (vm.goods.presellMoney/100).toFixed(2).toString().split('.');
          vm.preSale.presellMoneyHtmlStr = '<span style="font-size:.12rem;color:#e12e2e;font-weight: bold;">¥ <em style="font-size:.18rem;">'+arr1[0]+'</em><i>.'+arr1[1]+'</i></span>';
        }else{
          vm.preSale.presellMoneyHtmlStr = '<span style="font-size:.12rem;color:#e12e2e;font-weight: bold;"> <em style="font-size:.18rem;">'+vm.goods.presellMoneyStr+'</em></span>';
        }
        if(vm.goods.finalMoney && vm.goods.finalMoney !=''){
          let arr2 = (vm.goods.finalMoney/100).toFixed(2).toString().split('.');
          vm.preSale.finalMoneyHtmlStr = '<span style="font-size:.12rem;color:#e12e2e;font-weight: bold;">¥ <em style="font-size:.15rem;">'+arr2[0]+'</em><i>.'+arr2[1]+'</i></span>';
        }else{
          vm.preSale.finalMoneyHtmlStr = '<span style="font-size:.12rem;color:#e12e2e;font-weight: bold;"> <em style="font-size:.15rem;">'+vm.goods.finalMoneyStr+'</em></span>';
        }
      }
    },
    presaleExplain(goodObj){//预售说明数据处理func
      if(goodObj.presellExplain && goodObj.presellExplain!=0){
        goodObj['presellExplainArr'] = goodObj.presellExplain.split('@');
      }
    },
    DistinguishPreSale(goodObj){//预售商品页面显示数据处理
      let vm = this;
      vm.presaleExplain(goodObj);
      if(goodObj.goodsSellType && (goodObj.goodsSellType==2 || goodObj.goodsSellType==4)){//是定金预售和全款预售
        let newTime = new Date().getTime();//当前时间戳
        if(goodObj.presellStartTimeL>newTime){//预售未开始
          if(goodObj.stock <= 0){//虚拟库存为空，预售结束
            vm.preSale.Stage = 2;
          }else{
            vm.preSale.Stage = 0;
            vm.preSale.startTime = Number(((goodObj.presellStartTimeL - newTime)/1000).toFixed(0));
            vm.preSale.endTime = Number(((goodObj.presellEndTimeL - goodObj.presellStartTimeL)/1000).toFixed(0));
          }
        }else{
          if(goodObj.presellEndTimeL>newTime){//预售已开始，未结束
            if(goodObj.stock <= 0){//虚拟库存为空，预售结束
              vm.preSale.Stage = 2;
            }else{
              vm.preSale.Stage = 1;
              vm.preSale.endTime = Number(((goodObj.presellEndTimeL - newTime)/1000).toFixed(0));
            }
          }else{//预售已结束
            vm.preSale.Stage = 2;
          }
        }
        if(vm.preSale.Stage == 0){
          vm.preSaleStartTimeCountdown();
        }else if(vm.preSale.Stage == 1){
          vm.preSaleEndTimeCountdown();
        }
      }
    },
    preSaleStartTimeCountdown(){//预售未开始倒计时func
      let vm =this;
      vm.preSale.StartCount = vm.preSale.startTime;
      vm.preSale.coundownTimestr = util.timeTransformation(vm.preSale.StartCount,'**天**时**分**秒');
      vm.preSale.StartTimer = setInterval(() => {
        if (vm.preSale.StartCount > 0 && vm.preSale.StartCount <= vm.preSale.startTime) {
          vm.preSale.StartCount --;
          vm.preSale.coundownTimestr = util.timeTransformation(vm.preSale.StartCount,'**天**时**分**秒');
        } else {
          clearInterval(vm.preSale.StartTimer);
          vm.preSale.StartTimer = null;
          //预售未开始倒计时结束，开始预售结束倒计时
          vm.$emit('upup',vm.goods.onlineId); //主动触发upup方法，'hehe'为向父组件传递的数据
          vm.preSale.Stage = 1;
          vm.preSaleEndTimeCountdown();
        }
      }, 1000)
    },
    preSaleEndTimeCountdown(){//预售结束倒计时func
      let vm =this;
      vm.preSale.EndCount = vm.preSale.endTime;
      vm.preSale.coundownTimestr = util.timeTransformation(vm.preSale.EndCount,'**天**时**分**秒');
      vm.preSale.EndTimer = setInterval(() => {
        if (vm.preSale.EndCount > 0 && vm.preSale.EndCount <= vm.preSale.endTime) {
          vm.preSale.EndCount --;
          vm.preSale.coundownTimestr = util.timeTransformation(vm.preSale.EndCount,'**天**时**分**秒');
        } else {
          clearInterval(vm.preSale.EndTimer);
          vm.preSale.EndTimer = null;
          //预售结束倒计时结束，预售结束
          vm.preSale.Stage = 2;
        }
      }, 1000) 
    },
    selectedPop(){//已选弹窗控制（普通商品、预售商品）
      // if(this.goods.goodsSellType != 1){//预售商品
      //   this.$store.commit('changeTanchaungType',7);
      // }else{//普通商品
        this.$store.commit('changeTanchaungType',5);
      // }
    },    
    ready () {//获取客户当前位置
      let that = this;
      let map = new BMap.Map("allmap");
      let point = new BMap.Point(116.404, 39.915);
      map.enableScrollWheelZoom(true);
      let geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
          let mk = new BMap.Marker(r.point);
          map.addOverlay(mk);
          map.panTo(r.point);
          let myGeo = new BMap.Geocoder();    
          myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function(result){// 根据坐标得到地址描述        
            if(result){   
              that.addStr = result.address;//省
            }
          });
        }else{
          
        }
      }); 
    },
    jumpGoodLIst(id){//可用商品跳转商品列表页
      this.$router.push({name:'goodsList',query:{cardid:id}});
    },
    jumpHomepage(){//去逛逛跳转首页
      window.sessionStorage.setItem('tabbar','homepage');
      this.$router.replace({path:'/'});
    },
    jumpgood(id,type){//赠品跳转
      if(type == 1){
        this.lookMone(1);
        this.$emit('upup',id); //主动触发upup方法，'hehe'为向父组件传递的数据
      }
    },
    jumpReview(){//跳转评论
      location.reload();
      window.sessionStorage.setItem('good_page','evaluate');
    },
    jumpRecommendGoods(arr){//跳转配件页面
      let str = '';
      for(let i in arr){
        if(i == arr.length-1){
          str += JSON.stringify(arr[i]);
        }else{
          str += JSON.stringify(arr[i])+'&&';
        }
      }
      window.sessionStorage.setItem('good_Recommend',str);
      this.$router.push({name:'recommended'});
    },
    savePackage(arr){//跳转优惠套餐页面
      let str = '';
      for(let i in arr){
        if(i == arr.length-1){
          str += JSON.stringify(arr[i]);
        }else{
          str += JSON.stringify(arr[i])+'&&';
        }
      }
      window.sessionStorage.setItem('good_package',str);
      this.$router.push({name:'package'});
    },
    openDIzi(){
      if(!this.province){
        Toast('请选择省！');
      }else if(!this.city){
        Toast('请选择市！');
      }else if(!this.county){
        Toast('请选择区！');
      }else{
         this.lookMone(0);
      }
    },
    onChangeProvince(data){
      this.province = data.value;
      this.addStr = this.province+this.city+this.county;
    },
    onChangeCity(data){
      this.city = data.value;
      this.addStr = this.province+this.city+this.county;
    },
    onChangeArea(data){
      this.county = data.value;
      this.addStr = this.province+this.city+this.county;
    },
    Coupons(cardId){//领券
      let that =this;
      let data = {
        "cardId":cardId,      //优惠券id
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/collect/receiveCard"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          Toast('领取成功！');
          this.thirdParty=true;
          this.tanchaungType=2;
          this.$emit('upup',that.goods.onlineId); //主动触发upup方法，'hehe'为向父组件传递的数据
        }else{
          if(response.data.status == 499){
            that.$router.push({name:'signInPage'});
          }else{
            MessageBox('系统提示',response.data.message);
          }
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
    changeOnlineId(ID){
      this.onlineId=ID;
      this.$store.commit('preservationGoodId',this.onlineId);
      this.thirdParty=true;
      this.tanchaungType=4;
      this.ajaxGood();
    },
    handleChange(value) {
      this.$store.commit('addthisGoodNum',value);
    },
    selectionClassification(type,str){
      let that =this;
      if(type == 'huabei'){
        that.$store.mutations('huabei',str);
      }else{

      }
    },
    lookMone(type){//弹窗控制事件
      if(type == 1){
        if(this.thirdParty){
          this.tanchaungType = null;
          this.thirdParty=false;
        }else{
          this.tanchaungType = 1;
          this.thirdParty=true;
        }
      }else if(type == 2){
        if(this.thirdParty){
          this.tanchaungType = null;
          this.thirdParty=false;
        }else{
          this.tanchaungType = 2;
          this.thirdParty=true;
        }
      }else if(type == 3){
        if(this.thirdParty){
          this.tanchaungType = null;
          this.thirdParty=false;
        }else{
          this.tanchaungType = 3;
          this.thirdParty=true;
        }
      }else if(type == 0){
        if(this.thirdParty){
          this.tanchaungType = null;
          this.thirdParty=false;
        }else{
          this.tanchaungType = 0;
          this.thirdParty=true;
        }
      }else if(type==7){//预售弹窗
        if(this.thirdParty){
          this.tanchaungType = null;
          this.thirdParty=false;
        }else{
          this.tanchaungType = 7;
          this.thirdParty=true;
        }
      }
    },
    ajaxGood(){//商品详情请求
      let that =this;
      let data = {
        onlineId:that.onlineId
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/goods/open/goodsdetail"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          that.goods = response.data.body;
          if(that.goods.giftList.length>2){
            that.zengpinObj = that.goods.giftList.slice(0,2);
          }else{
            that.zengpinObj = that.goods.giftList;
          }
          that.$store.commit('addGoodData','numberPraise',that.goods.goodsReviewDto.totalNum);
          that.$store.commit('addGoodData','praiseRate',that.goods.goodsReviewDto.rateInt);
        }else{
          MessageBox('系统提示',response.data.message);
        }
      }).catch(oData => {
        // MessageBox('系统提示',oData.data.message);
      })
    },
  }, 
};  
</script>  
  
<style lang="less" scoped>   
     @import '../../assets/less/goods.less';
</style> 