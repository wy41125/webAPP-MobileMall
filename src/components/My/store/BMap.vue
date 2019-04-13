<template>
  <div class="home" :style="heightStr">
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'查看门店'"></headers>
    <div :style="$store.state.titleShow?'margin-top:.4rem':''" id="allmap" ></div>
    <div class="store">
      <div class="storediv">
        <div>
          <p><span>{{orgName}}</span> 约{{distance>1000?(distance/1000+'KM'):(distance+'M')}}</p>
          <p>{{address}}</p>
        </div>  
        <div>
          <i></i>
          <a :href="'tel:'+phoneNo">拨打电话</a>
        </div>  
      </div>
      <div class="daohang" @click.stop="daohang">
        <i class="icon" style=""></i>导航
      </div>
    </div>
  </div>
</template>

<script>
import util from '@/libs/util'
import headers from '../../headers.vue'  
  export default {
    data () {
      return {
        heightStr:null,//屏幕可见高度
        address:'',//门店地址
        userAddRess:'',//用户地址
        distance:'',//门店距离
        lat:'',//纬度
        lng:'',//经度
        orgName:'',//门店名称
        phoneNo:'',//门店联系电话
        userlat:'',
        userlng:'',

      }
    },
    components:{
      headers:headers,
    },
    created(){
      // this.heightStr = 'height:'+(window.innerHeight-80)+'px;';
      let str = 'height:'+window.innerHeight+'px;';
      this.heightStr = str;
      console.log(this.heightStr);
    },
    mounted () {
      this.address = decodeURIComponent(this.$route.query.address);
      this.distance = this.$route.query.distance;
      this.lat = this.$route.query.lat;
      this.lng = this.$route.query.lng;
      this.orgName = decodeURIComponent(this.$route.query.orgName);
      this.phoneNo = 'tel:'+this.$route.query.phoneNo;
      this.userlat = this.$route.query.userlat;
      this.userlng = this.$route.query.userlng;
      this.ready();
      util.setTitle('查看门店');
      let viewStr = util.webview();
      if(viewStr == 'other'){
        this.$store.commit('titleShowFunc',true);
      }else{
        this.$store.commit('titleShowFunc',false);
      }
    },
    methods: {
      ready () {
        let that = this;
        let map = new BMap.Map("allmap");
        let point = new BMap.Point(that.$route.query.lng,that.$route.query.lat);
        map.centerAndZoom(point, 15);
        let marker = new BMap.Marker(point);  // 创建标注
        map.addOverlay(marker);               // 将标注添加到地图中
        that.userAdd(this.userlng, this.userlat);
        // let geolocation = new BMap.Geolocation();
        // geolocation.getCurrentPosition(function(r){
        //   if(this.getStatus() == BMAP_STATUS_SUCCESS){
        //     let mk = new BMap.Marker(r.point);
        //     map.addOverlay(mk);
        //     map.panTo(r.point);
        //     that.userlat = r.point.lat;
        //     that.userlng = r.point.lng;
        //     that.userAdd(r.point.lng, r.point.lat);
        //   }
        //   else {
        //     alert('failed'+this.getStatus());
        //   }        
        // });
      },
      userAdd(lng, lat){
        let that =this;
        let myGeo = new BMap.Geocoder();      
        myGeo.getLocation(new BMap.Point(lng, lat), function(result){// 根据坐标得到地址描述          
          if(result){ 
            that.userAddRess = result.address;
          } 
        });
      },
      daohang(){
        console.log(this.userlat+','+this.userlng+','+this.lat+','+this.lng+','+this.address+','+this.userAddRess);
        let userCite = this.userAddRess.split('省')[1].split('市');
        // console.log("http://api.map.baidu.com/direction/v2/transit?origin=40.056878,116.30815&destination=31.222965,121.505821&ak=您的ak");
        // window.location.href="https://map.baidu.com/mobile/webapp/walk/list/qt=walk&sn=1%24%24%24%24"+this.userlat+"%2C"+this.userlng+"%24%24我的位置%24%24&en=1%24%24%24%24"+this.lat+"%2C"+this.lng+"%24%24"+this.address+"%24%24&sc=179&ec=179&c=179&pn=0&rn=5&searchFlag=transit&version=3&wm=1/foo=bar&vt=map&traffic=off&evtson=off&calluniversalonce=1&universalLinkCbkTag=1";
        // let that = this;
        // var map = new BMap.Map("allmap");    
        // map.centerAndZoom(new BMap.Point(that.$route.query.lng,that.$route.query.lat), 15);    
        // var walk = new BMap.WalkingRoute(map, {    
        //   renderOptions: {map: map}   
        // });
        // console.log(that.userAddRess);
        // console.log(that.address);
        // walk.search(that.userAddRess,that.address);
        window.location.href = "http://api.map.baidu.com/direction?origin=latlng:"+this.userlat+","+this.userlng+"|name:我的位置&destination="+this.address+"&mode=driving&origin_region="+userCite+"&destination_region=杭州&output=html&src=yourCompanyName|yourAppName";
      },
    }
  }
</script>

<style lang="less" scoped>
  .home{
    width: 100%;
    height: 100%;
    font-size: 0.13rem;
    #allmap{
      width: 100%;
      height: 100%;
    }
    .store{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color:#fff; 
      z-index: 1000;
      .storediv{
        width: 100%;
        height: 70%;
        border-bottom: 1px solid #ececec;
        div{
          display: inline-block;
          padding: 0.1rem 0.15rem;
          text-align: left;
          &:nth-child(1){
            width: 62%;
            color: #a1a1a1;
            border-right: 1px solid #ececec;
            span{
              color: #333;
              font-size: .15rem;
            }
          }
          &:nth-child(2){
            color: #8e9bc3;
            a{
              color: #8e9bc3;
            }
            i{
              margin:0 auto;
              display: block;
              width: 0.15rem;
              height: 0.15rem;
              background: url('../../../assets/images/my/phone_blue@2x.png') no-repeat;
              background-size: 0.15rem;
            }
          }
        }
      }
      .daohang{
        width: 100%;
        height: .5rem;
        line-height: .5rem;
        text-align: center;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        justify-content: center;
        color: #CDA63F;
        position: relative;
        .icon{
          display: inline-block;
          width: 0.13rem;
          height: 0.13rem;
          background: url(../../../assets/images/shopCart/navigation@2x.png) no-repeat;
          background-size: 0.13rem;
          position: absolute;
          top: 35%;
          left: 43%;
        }
      }
    }
  }
</style>











