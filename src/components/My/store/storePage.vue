<template>  
  <div class="storePage" :style="!isShow?'overflow:hidden;background:#fff;'+Pageheight:''">
    <div class="title" id="weizhi" v-show="$store.state.titleShow">
      <em class="goBack" @click.stop="$router.go(-1)"></em>
      <p style='display: inline-block;width:65%;text-align:center;font-size:.17rem;'><em style="display: inline-block;margin-left: .25rem;">查看门店</em></p>
      <p style='display: inline-block;width:20%;margin-right:.15rem;'><span @click="select" v-if="false"><i></i>{{userPosition.area}}</span></p>
      <p v-if="!isData" style='display: inline-block;width:20%;margin-right:.15rem;'><i></i><img :src="loadImg" style="width:0.2rem;height:0.2rem" alt=""></p>
    </div>  
    <p class="tihuoTime" v-if="$route.query.source == 'changeOrder'">
      <span><i></i>自提时间</span>
      <el-date-picker v-model="value1" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions1"></el-date-picker>
    </p>
    <div class="nodata" v-if="!isShow">
    	<img src="../../../assets/images/my/coupons/location_empty@2x.png" alt="">
    	<p class="nodata_p">该地区暂时没有晶杰之家门店</p>
      <p class="nodata_p">点击右上角，更换个地址再试试？</p>
    </div>
    <div v-if="isShow" class="receive" :style="storeheightStr">
    	<div class="store" v-for="stote in stotes" @click.stop="changePage(stote.lng,stote.lat,stote.address,stote.distance,stote.orgName,stote.phoneNo)">
        <img :src="stote.orgLogo" alt=""> 
        <div :class="!laiyuanBoln?'store_conent haveData':'store_conent'">
          <i v-if="!laiyuanBoln" :class="xuanzhongID == stote.orgId?'clickbutton onclick':'clickbutton'" @click.stop="saveStoreLocal(stote,$event)"></i>
          <p class="storeName">{{stote.orgName}} <em v-show="stote.distance && stote.distance!=0">约{{stote.distance>1000?(stote.distance/1000+'KM'):(stote.distance+'M')}}</em></p>
          <p class="storeAdd">门店地址：{{stote.address}}</p>
          <p class="storePhone">
            <i></i>
            <a :href="'tel:'+stote.phoneNo">{{stote.phoneNo}}</a>
          </p>
          <i v-if="!laiyuanBoln" class="datahave">{{stote.stock>0?'有货':'可预定'}}</i>
          <p class="triangle"><i></i><em></em><i class="right"></i></p>
        </div>
      </div>
    </div>
    <div id="allmap"></div>
      <mt-popup v-model="popupVisible" class="tanchuang" position="bottom">
        <div class="areas">
          <v-distpicker class="map"  type="mobile" :province="userPosition.province" :city="userPosition.city" :area="userPosition.area"  @province="onChangeProvince" @city="onChangeCity" @area="onChangeArea"></v-distpicker>
        </div>
        <div class="button" @click.stop="changeUser">
          确定
        </div>
      </mt-popup>
    <button v-if="$route.query.source == 'changeOrder'" class="storeButton" @click.stop="yesChange">确认修改</button>
    <navigation></navigation>
  </div>  
</template>  
  
<script>
import navigation from '../../goods/navigation.vue' 
import VDistpicker from 'v-distpicker'
import {Toast,MessageBox} from 'mint-ui'
import axios from 'axios'
import util from '@/libs/util' 
export default {  
  name: 'storePage',  
  data() {  
    return { 
      selected:[],
      isShow:false, //是否有数据
      isData:true, //是否定位成功
      loadImg:util.loadImg,
      popupVisible:false,
      stotes:[
        {
          address:'',//门店地址
          distance:'',//门店距离
          lat:'',//纬度
          lng:'',//经度
          orgId:'',//门店ID
          orgLogo:'',//门店logo
          orgName:'',//门店名称
          phoneNo:'',//门店联系电话
        },
      ],
      userPosition:{
        "lat":"",//纬度
        "lng":"",//经度
        "province":"",//省
        "city":"",//市
        "area":""//区
      },
      laiyuanBoln:true,//默认为我的入口进入
      storeDate:[],
      xuanzhongID:null,//选中ID值
      value1:null,
      storeheightStr:null,
      pickerOptions1:{
        disabledDate: date=> {
          return date && (date.valueOf() < this.startDate) || (date.valueOf() > this.endDate);
        }
      },
      startDate:'',
      endDate:'',
      Pageheight:'',//页面高度
    };  
  },
  components: {
   VDistpicker ,
   navigation:navigation,
  },
  created(){
    this.readHeight();
    if(this.$route.query.source){
      this.laiyuanBoln=false;//订单page获取门店信息
      this.value1 = this.$route.query.orderTime;
      util.setTitle('选择门店');
    }else{
      this.laiyuanBoln=true;
      util.setTitle('查看门店');
    }
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
    this.Pageheight = 'height:'+window.innerHeight+'px';
  },
  mounted(){
    // this.getStoreList();
    this.getPositionet();
  },
  methods:{
    yesChange(){//确认修改
      let that =this;
      let data = {
        "orderId":Number(that.$route.query.orderId),  //(描述：订单id 、类型：Long、是否必填：N)
        "storeId":that.xuanzhongID,  //(描述：门店id 、类型：Long、是否必填：N)
        "pickupTime":that.value1//(描述：自提时间 、类型：String、是否必填：N)
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/order/updateOrg"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          Toast('修改成功！');
          that.$router.go(-1);
        }else{
          MessageBox('系统提示',response.data.message);
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
    saveStoreLocal(obj,event){//订单修改自提门店func
      let that =this;
      if(that.$route.query.source == 'changeOrder'){
        that.xuanzhongID=obj.orgId;
        that.timeChange(obj);
      }else{
        let str='';
        str = JSON.stringify(obj);
        window.sessionStorage.setItem('storeStr',str);
        that.$router.go(-1);
      }
    },
    timeChange(obj){//自提时间确认时间判断
      let vm = this;
      let nowTimes = new Date();
      let year = nowTimes.getFullYear();    //获取完整的年份(4位,1970-????)
      let month = (Number(nowTimes.getMonth())+1)<10?'0'+(Number(nowTimes.getMonth())+1):(Number(nowTimes.getMonth())+1);       //获取当前月份(0-11,0代表1月)
      let date = Number(nowTimes.getDate())<10?'0'+Number(nowTimes.getDate())+1:Number(nowTimes.getDate())+1;        //获取当前日(1-31)
      if(vm.$route.query.PreSalechangeTime){//预售订单下单
        let kaishiTime = decodeURIComponent(vm.$route.query.PreSalechangeTime),dateobj=null;
        if(new Date(kaishiTime).getTime()>new Date(year+'-'+month+'-'+date+' 00:00:00').getTime()){//修改订单时当前时间在提货时间之前
          dateobj = new Date(kaishiTime);
        }else{
          dateobj = new Date(year+'-'+month+'-'+date+' 00:00:00');
        }
        vm.startDate = Number(dateobj.getTime());
        vm.endDate = Number(dateobj.getTime())+1000*60*60*24*27;
      }else if(vm.$route.query.orderTime){//普通商品下单
        let nowdateobj = new Date(year+'-'+month+'-'+date+' 00:00:00');
        if(obj.stock > 0){//有库存
          vm.startDate = Number(nowdateobj.getTime())-1000*60*60*24;
          vm.endDate = Number(nowdateobj.getTime())+1000*60*60*24*26;
        }else{
          vm.startDate = Number(nowdateobj.getTime());
          vm.endDate = Number(nowdateobj.getTime())+1000*60*60*24*27;
        }
      }
      vm.value1 = vm.timestampToTime(vm.startDate);
      console.log(vm.value1);
    },
    timestampToTime(timestamp){//时间戳准换成时间
        let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y+M+D+h+m+s;
    },
    changeUser(){//缺环地址执行事件
      let that =this;
      if(that.userPosition.province == ''){
        Toast('请选择省！');
        return 
      }else if(that.userPosition.city == ''){
        Toast('请选择市！');
        return 
      }else if(that.userPosition.area == ''){
        Toast('请选择区！');
        return 
      }
      that.popupVisible = false;
      var map = new BMap.Map("allmap");      
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
      var myGeo = new BMap.Geocoder();// 创建地址解析器实例   
      // 将地址解析结果显示在地图上，并调整地图视野    
      myGeo.getPoint(that.userPosition.province+that.userPosition.city+that.userPosition.area, function(point){      
          if (point) { 
            that.userPosition.lat = point.lat;
            that.userPosition.lng = point.lng;
            that.getStoreList();
          }      
       }, 
      that.userPosition.province);
    },
    select(){
      if(this.popupVisible){
        this.popupVisible = false;
      }else{
        this.popupVisible = true;
      }
    },
    changePage(lng,lat,address,distance,orgName,phoneNo){//跳转门店详情地图页面
      this.$router.push({name:'BMap',query:{
                                            'lat':lat,
                                            'lng':lng,
                                            address:encodeURIComponent(address),
                                            distance:distance,
                                            orgName:encodeURIComponent(orgName),
                                            phoneNo:phoneNo,
                                            userlng:this.userPosition.lng,
                                            userlat:this.userPosition.lat
                                          }});
    },
    getPositionet(){//获取用户当前的地理位置
        let that = this;
        let map = new BMap.Map("allmap");
        let point = new BMap.Point(116.331398,39.897445);
        map.enableScrollWheelZoom(true);

        let geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
          if(this.getStatus() == BMAP_STATUS_SUCCESS){
            let mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            that.userPosition.lng = r.point.lng;//经度
            that.userPosition.lat = r.point.lat;//纬度
            let myGeo = new BMap.Geocoder();      
            // 根据坐标得到地址描述    
            myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function(result){      
              if(result){   
                that.userPosition.province = result.address.split('省')[0]+'省';//省
                that.userPosition.city = result.address.split('省')[1].split('市')[0]+'市';//市
                that.userPosition.area = result.address.split('省')[1].split('市')[1].split('区')[0]+'区';//区
              }
              if(that.laiyuanBoln){//true 我的入口（查所有门店），不查自提门店
                that.getStoreList();
              }else{
                that.getGoodStore();//订单page获取门店信息
              } 
              
            });
          }
          else {
            alert('failed'+this.getStatus());
          }
        });
    },
    getGoodStore(){//商品自提门店列表接口:可获取门店存货
      let that =this;
      if(window.sessionStorage.getItem('storeData')){
        let str = window.sessionStorage.getItem('storeData');
        let arr = str.split('&&');
        for(let i in arr){
          let obj = JSON.parse(arr[i]);
          that.storeDate.push(obj);
        }
      }
      // let data = {
      //   "goodsList":that.storeDate,//商品id，多个用,号拼接
      //   "lat": that.userPosition.lat,//纬度
      //   "lng": that.userPosition.lng,//经度
      //   "province":that.userPosition.province,//省
      //   "city":that.userPosition.city,//市
      //   "county":that.userPosition.area//区
      // };
      let data = {
        "goodsList":that.storeDate,//商品id，多个用,号拼接
        "lat": '',//纬度
        "lng": '',//经度
        "province":'',//省
        "city":'',//市
        "county":''//区
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/store/pickupList"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          if(response.data.body.length == 0){
            that.isShow = false;
          }else{
            that.isShow = true;
            that.stotes = response.data.body;
          }
        }else{
          that.isShow = false;
          MessageBox('系统提示',response.data.message);
        }
      }).catch(oData => {
        that.isShow = false;
        MessageBox('系统提示',oData.data.message);
      })
    },
    getStoreList(){//获取所有门店信息--我的入口
      let that =this;
      // let data = {
      //   "lat": that.userPosition.lat,//纬度
      //   "lng": that.userPosition.lng,//经度
      //   "province":that.userPosition.province,//省
      //   "city":that.userPosition.city,//市
      //   "county":that.userPosition.area//区
      // };
      let data = {
        "lat": '',//纬度
        "lng": '',//经度
        "province":'',//省
        "city":'',//市
        "county":''//区
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/store/open/list"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          if(response.data.body.length == 0){
            that.isShow = false;
          }else{
            that.isShow = true;
            that.stotes = response.data.body;
          }
        }else{
          that.isShow = false;
          MessageBox('系统提示',response.data.message);
        }
      }).catch(oData => {
        that.isShow = false;
        MessageBox('系统提示',oData.data.message);
      })
    },
    onChangeProvince(data){
      this.userPosition.province = data.value;
    },
    onChangeCity(data){
      this.userPosition.city = data.value;
    },
    onChangeArea(data){
      this.userPosition.area = data.value;
    },
    readHeight(){
      let str = '';
      if(this.$route.query.source == 'changeOrder'){
        if(this.$store.state.titleShow){
          str = 'margin-top:95px;'
        }else{
          str = 'margin-top:5px;'
        }
      }else{
        if(this.$store.state.titleShow){
          str = 'margin-top:45px;'
        }else{
          str = 'margin-top:0px;'
        }
      }
      this.storeheightStr = str;
    },
  },
  beforeRouteUpdate(to,from,next){
    
  }

};  
</script>  
  
<style lang="less" scoped>  
@import '../../../libs/commnd.less'; 
	.storePage{
    width: 100%;
    height: 100%;
    font-size: @threeFontSize;
    .tihuoTime{
      width:92%;
      padding:0 .15rem;
      border-bottom: 1px solid #ececec;
      border-top: 1px solid #ececec;
      background-color: #fff;
      text-align: right;
      height: .4rem;
      position: fixed;
      top: .45rem;
      left: 0;
      z-index: 100;
      span{
        float: left;
        display: inline-block;
        height: 100%;
        line-height: .4rem;
        i{
          display: inline-block;
          width: .17rem;
          height: .17rem;
          background: url('../../../assets/images/order/time@2x.png') no-repeat;
          background-size: .17rem;
          margin-bottom: .03rem;
          margin-right: .05rem;
          vertical-align: middle;
        }
      }
      .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width: 145px;
        .el-input__inner{
          border: none;
        }
      }
    }
    .title{
      text-align: right;
      font-size: 0.16rem;
      background-color: #fff;
      padding: @padding010 @padding015;
      border-bottom: 1px solid @segmentingLin;
      position: fixed;
      width: 95%;
      top: 0;
      left: 0;
      z-index: 100;
      i{
        vertical-align: middle;
        display: inline-block;
        margin-right: 0.05rem;
        width: 0.1rem;
        height: 0.13rem;
        background: url(../../../assets/images/my/coupons/location@2x.png) no-repeat;
        background-size: 100%;
        vertical-align: top;
        margin-top: .05rem;
      }
      .goBack{
        display: inline-block;
        float: left;
        margin-top: .08rem;
        width: .1rem;
        height: .1rem;
        border-style: solid;
        border-color: #333;
        border-width: 1px 1px 0 0;
        transform: matrix(-.71,.71,.71,.71,0,0);
      }
    }
    .nodata{
      margin-top:@marginbottom015; 
      position: fixed;
      width: 100%;
      top: 30%;
      left: 0;
      img{
        width: 1.05rem;
        height: 0.95rem;
      }
      .nodata_p{
        font-size: 0.16rem;
        color: #cdcdcd;
      }
    }
    .receive{
      width: 100%;
      margin-top: .45rem;
      .store{
        width: 100%;
        margin-bottom: @marginbottom010;
        background: #fff;
        img{
          width: 100%;
          height: 1.7rem;
          display: block;
        }
        .store_conent{
          padding: @padding010 @padding015;
          padding-top:0;
          text-align: left;
          font-size: 0.13rem;
          color: #cdcdcd;
          position: relative;
          .triangle{
            display: block;
            width: 100%;
            height: .1rem;
            position: absolute;
            left: 0;
            top: -0.1rem;
            i{
              display: inline-block;
              height: 0.1rem;
              width: 47.8%;
              background: #fff;
              vertical-align: top;
            }
            em{
              display: inline-block;
              width: 0;
              height: 0;
              border-width: .08rem;
              border-color: transparent #fff #fff #fff;
              border-style: solid;
            }
          }
          .storeAdd{
            font-size: .12rem;
            margin: .1rem 0;
          }
          .storeName{
            color:#000;
            width: 80%;
          }
          .storePhone{
            font-size: .12rem;
            i{
              display: inline-block;
              width: 0.15rem;
              height: 0.15rem;
              vertical-align: sub;
              background: url('../../../assets/images/my/coupons/shop_phone@2x.png') no-repeat;
              background-size: 0.15rem;
              margin-right: .05rem;
            }
            a{
              color: #999;
            }
          }
          .datahave{
            position: absolute;
            top: @marginbottom010;
            right: @marginbottom015;
            color: @tagging;
          }
          &.haveData{
            padding: .1rem .15rem .1rem .5rem;
            position: relative;
            .datahave{
              position: absolute;
              top: @marginbottom010;
              right: @marginbottom015;
              color: @tagging;
            }
            .clickbutton{
              display: inline-block;
              width: .2rem;
              height: .2rem;
              background: url('../../../assets/images/my/coupons/choose@2x.png') no-repeat;
              background-size: .2rem;
              position: absolute;
              top: 50%;
              left: 5%;
              &.onclick{
                background: url('../../../assets/images/my/coupons/choose_black@2x.png') no-repeat;
                background-size: .2rem;
              }
            }
          }
        }
      }
    }
  }
  .tanchuang{
      width: 100%;
      height: 2rem;
      .areas{
        display: inline-block;
        width: 90%;
        height: 100%;
        background-color: #fff;
        overflow: scroll;
        text-align: left;
        .map{
          display: inline-block;
          width: 85%;
        }
      }
      .button{
        width: 10%;
        height: 0.37rem;
        line-height: 0.37rem;
        display: inline-block;
        float: right;
      }
    }
  .storeButton{
    position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: .5rem;
      line-height: .5rem;
      color: #fff;
      font-size: .16rem;
      background-color: #CEA63F;
      border:none;
  }
</style> 









