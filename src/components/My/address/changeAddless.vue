<template>  
  <div class="changeAddless">  
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'新增收货地址'"></headers>
    <div class="data" :style="$store.state.titleShow?'margin-top:.4rem':''">
    	<ul>
    		<li>
    			<span>收货人姓名</span>
    			<input type="text" :placeholder="'请输入收货人姓名'" v-model="name">
    		</li>
    		<li>
    			<span>手机号码</span>
    			<input type="number" oninput="if(value.length>11)value=value.slice(0,11)" :placeholder="'请输入手机号码'" v-model="phoneNo">
    		</li>
    		<li @click.stop="changeType">
    			<span>所在区域</span>
    			<input type="text" v-model="addStr">
    		</li>
    		<li>
    			<span>详细地址</span>
    			<input type="text" :placeholder="'请输入街道地址'" v-model="address">
    		</li>
    		<li>
    			<span>邮政编码</span>
    			<input type="text" :placeholder="'请输入邮政编码'" v-model="postCode">
    		</li>
    	</ul>
    	<div class="default" @click.stop="changeDefault">
    		<i :class="defaultFlag == 1?'active':''"></i>设为默认地址
    	</div>
    </div>
    <div class="bottom" @click.stop="preservation">
    	保存地址
    </div>
    <mt-popup v-model="popupVisible" class="tanchuang" position="bottom">
        <div class="areas">
          <!-- <area-select :level="2" type="text" v-model="selected"></area-select> -->
          <v-distpicker class="map"  :province="'请选择省'" type="mobile" @province="onChangeProvince" @city="onChangeCity" @area="onChangeArea"></v-distpicker>

        </div>
        <div class="button" @click.stop="changeUser">
          确定
        </div>
    </mt-popup>
  </div>  
</template>  
  
<script>  
import headers from '../../headers.vue'
import VDistpicker from 'v-distpicker'
import {Toast,MessageBox} from 'mint-ui'
import axios from 'axios'
import util from '@/libs/util' 
export default {  
  name: 'changeAddless',  
  data() {  
    return {  
      addrId:null,
      name:null,
      phoneNo:null,
      province:null,
      city:null,
      county:null,
      address:null,
      defaultFlag:null,
      postCode:null,
      addStr:null,
      popupVisible:false,
    };  
  },
  components:{
    headers:headers,
  },
  methods:{
  	changeUser(){
      let that =this; 
      if(that.province == ''){
        Toast('请选择省！');
        return 
      }else if(that.city == ''){
        Toast('请选择市！');
        return 
      }else if(that.county == ''){
        Toast('请选择区！');
        return 
      }
      that.popupVisible = false;
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
  	changeType(){
  		if(this.popupVisible){this.popupVisible=false;}else{this.popupVisible=true}
  	},
    changeDefault(){
    	if(this.defaultFlag == 1){this.defaultFlag = 0}else{this.defaultFlag = 1}
    },
    verification(){
    	let blue = null;
    	if(!this.name){
    		Toast('收货人姓名不能为空！');
    		blue = false;
    	}else if(!this.phoneNo || !util.PHONE_REG.test(this.phoneNo)){
    		Toast('请填写正确的手机号码！');
    		blue = false;
    	}else if(!this.province){
    		Toast('请选择省份！');
    		blue = false;
    	}else if(!this.city){
    		Toast('请选择市级！');
    		blue = false;
    	}else if(!this.county){
    		Toast('请选择区级！');
    		blue = false;
    	}else if(!this.address){
    		Toast('请填写详细地址！');
    		blue = false;
    	}else if(!this.postCode){
    		Toast('请填写邮编！');
    		blue = false;
    	}else{
    		blue = true;
    	}
    	return blue;
    },
    preservation(){
    	if(!this.verification()){
    		return;
    	}
      let that =this;
      let data = {
        "addrId": that.addrId, //(描述：收货地址id 、类型：Long、是否必填：N)
	    "name": that.name, //(描述：收货人名称 、类型：String、是否必填：Y)
	    "phoneNo": that.phoneNo, //(描述：收货人联系方式 、类型：String、是否必填：Y)
	    "province": that.province, //(描述：省份 、类型：String、是否必填：Y)
	    "city": that.city, //(描述：城市 、类型：String、是否必填：Y)
	    "county": that.county, //(描述：区域 、类型：String、是否必填：Y)
	    "address": that.address, //(描述：详细地址 、类型：String、是否必填：Y)
	    "defaultFlag": that.defaultFlag, //(描述：是否默认 1 默认 2 非默认 、类型：Integer、是否必填：Y)
	    "postCode": that.postCode //(描述：邮政编码、类型：String、是否必填：Y)
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/deliverAddr/setting"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          Toast('保存成功！');
          that.$router.go(-1);
        }else{
          MessageBox('系统提示',response.data.message);
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
  },
  created(){ 
  	if(this.$route.query.addrId){
  		this.addrId = this.$route.query.addrId;
  		this.name = decodeURIComponent(this.$route.query.name);
  		this.phoneNo = decodeURIComponent(this.$route.query.phoneNo);
  		this.province = decodeURIComponent(this.$route.query.province);
  		this.city = decodeURIComponent(this.$route.query.city);
  		this.county = decodeURIComponent(this.$route.query.county);
  		this.address = decodeURIComponent(this.$route.query.address);
  		this.defaultFlag = this.$route.query.defaultFlag;
  		this.postCode = this.$route.query.postCode;
  		this.addStr = this.province+this.city+this.county;
  	}
    util.setTitle('新增收货地址');
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
	.changeAddless{
		width: 100%;
		height: 100%;
		font-size: 0.12rem;
		.data{
			ul{
				li{
					padding: 0.2rem 0.15rem;
					font-size: 0.14rem;
					background-color: #fff;
					border-bottom: 1px solid #ececec;
          text-align: left;
          font-size: .15rem;
					span{
						display: inline-block;
						width: 30%;
					}
					input{
						width: 68%;
						font-size: 0.14rem;
					}
					&:nth-child(3){
						position: relative;
						&::after{
							content: '';
							display: inline-block;
							width: 0.08rem;
							height: 0.08rem;
							position: absolute;
							top: 40%;
							right: .15rem;
							border-width: 1px 1px 0 0;
							border-style: solid;
							border-color: #888;
							transform: matrix(.71,.71,.71,-.71,0,0);
						}
					}
				}
			}
			.default{
				// width: 100%;
				font-size: 0.14rem;
				text-align: left;
				background-color: #fff;
				padding: 0.2rem 0.15rem;
				margin-top: 0.08rem;
        font-size: .15rem;
				i{
					margin-right: 0.05rem;
					width: 0.19rem;
					height: 0.19rem;
					display: inline-block;
					background:url('../../../assets/images/my/coupons/choose@2x.png') no-repeat;
					background-size: 0.19rem;
					vertical-align: middle;
          margin-bottom: .04rem;
					&.active{
						background:url('../../../assets/images/my/coupons/choose_black@2x.png') no-repeat;
						background-size: 0.19rem;
					}
				}
			}
		}
		.bottom{
			position: fixed;
			bottom: 0;
			left: 0;
			font-size: 0.16rem;
			width: 100%;
			height: 0.5rem;
			line-height: 0.5rem;
			background-color: #cda73f;
			color:#fff;
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
	}
</style> 













