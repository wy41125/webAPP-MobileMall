<template>  
  <div class="coupons">
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'领券中心'"></headers>
    <div class="nodata" v-if="isShow" >
    	<img src="../../../assets/images/shopCart/card_empty@2x.png" alt="">
    	<p class="nodata_p">暂无优惠券</p>
    </div>
    <div v-if="!isShow" class="receive" :style="$store.state.titleShow?'margin-top:.45rem':''">
    	<div class="tongyi canReceive" v-for="item in items" v-if="item.cardStatus==2&&item.cardRemainNum>0" @click.stop="Receive(item.cardId,$event)">
    		<div class="conent" :style="fontsize">
    			<p>
            <span v-if="item.cardType==1"><em style="font-size:.18rem;">¥</em><i>{{item.cardVal/100}}</i></span>
            <span v-if="item.cardType==2"><i>{{item.cardVal}}</i>折</span>
            <span><em v-if="item.minUsePrice/100 != 0">满{{item.minUsePrice/100}}元可用</em><em v-if="item.minUsePrice/100 == 0">无现金门槛</em></span>
    			</p>
    			<p>
            <span>{{item.name}}</span>
            <span>{{item.startTime}}-{{item.endTime}}</span>
          </p>
    		</div>
    		<div :class="'data '+item.classStr">
          <!-- <i>已抢<br>0%</i> -->
          <!-- <el-progress type="circle" :percentage="item.PercentageReceiving" color="#fff" width="48" stroke-width="3"></el-progress> -->
          <!-- <canvasObjs :dataBili="item.PercentageReceiving"></canvasObjs> -->
    			<p><span>已抢{{item.PercentageReceiving}}%</span></p>
    		</div>
    	</div>
    	<div class="tongyi isReceive" v-for="item in items" v-if="item.cardStatus==1" @click.stop="jumpGoodLIst(item.cardId)">
    		<div class="conent" :style="fontsize">
    			<p>
            <span v-if="item.cardType==1"><em style="font-size:.18rem;">¥</em><i>{{item.cardVal/100}}</i></span>
            <span v-if="item.cardType==2"><i>{{item.cardVal}}</i>折</span>
            <span><em v-if="item.minUsePrice/100 != 0">满{{item.minUsePrice/100}}元可用</em><em v-if="item.minUsePrice/100 == 0">无现金门槛</em></span>
          </p>
          <p>
            <span>{{item.name}}</span>
            <span>{{item.startTime}}-{{item.endTime}}</span>
          </p>
    		</div>
    		<div class="data"><p></p></div>
    	</div>
    	<div class="tongyi noReceive" v-for="item in items" v-if="item.cardRemainNum==0" @click.stop="jumpGoodLIst(item.cardId)">
    		<div class="conent" :style="fontsize">
    			<p>
            <span v-if="item.cardType==1"><em style="font-size:.18rem;">¥</em><i>{{item.cardVal/100}}</i></span>
            <span v-if="item.cardType==2"><i>{{item.cardVal}}</i>折</span>
            <span><em v-if="item.minUsePrice/100 != 0">满{{item.minUsePrice/100}}元可用</em><em v-if="item.minUsePrice/100 == 0">无现金门槛</em></span>
          </p>
          <p>
            <span>{{item.name}}</span>
            <span>{{item.startTime}}-{{item.endTime}}</span>
          </p>
    		</div>
    		<div class="data"><p></p></div>
    	</div>
    </div>
    <navigation></navigation>
  </div>  
</template>  
  
<script> 
import navigation from '../../goods/navigation.vue' 
import headers from '../../headers.vue' 
import {Toast,MessageBox} from 'mint-ui'
import Cookies from 'js-cookie';
import axios from 'axios'
import util from '@/libs/util' 
import canvasObj from '@/components/My/coupons/canvasObj'
export default {  
  name: 'coupons',  
  data() {  
    return {  
      isShow:false,
      fontsize:null,//卡券高度
      items:[],
      bili:null,
      classStr:'',
    };  
  },
  components:{
    headers:headers,
    navigation:navigation,
  },
  methods:{
    Receive(id,event){
      
      if(!Cookies.get('VUE2SESSID')){
        this.$router.push({name:'signInPage',query:{'name':'coupons'}});
        return;
      }
      let that =this;
      let data = {"cardId":id};
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/collect/receiveCard"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          Toast('领取成功！');
          event.currentTarget.className = 'tongyi isReceive';
          event.srcElement.removeChild(event.srcElement.getElementsByClassName('data')[0]);    
          location.reload();
        }else{
          if(response.data.status == 499){
            util.outLogin();
            this.$router.push({name:'signInPage',query:{outLogin:'/'}});
          }else{
            MessageBox('系统提示',response.data.message);
          }
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      }) 
    },
    jumpGoodLIst(id){//可用商品跳转商品列表页
      this.$router.push({name:'goodsList',query:{cardid:id}});
    },
    jumpHomepage(){//去逛逛跳转首页
      window.sessionStorage.setItem('tabbar','homepage');
      this.$router.replace({path:'/'});
    },
    ajaxcoupons(){
    	let that =this;
      	let data = {};
      	let urlStr = util.getpost(data);
      	axios({
        	method:"post",
        	url:"/open/cardCenter"+urlStr,
        	dataType: 'json',
        	data:data,
      	}).then(response => {
        	if(response.data.status == 0){
          	that.items = response.data.body;
            for(let i in that.items){
              let item = that.items[i];
              if(item.cardStatus==2 && item.cardRemainNum>0){
                item['PercentageReceiving'] = (((item.cardNum-item.cardRemainNum)/item.cardNum)*100).toFixed(1);
                if(item.PercentageReceiving <10){
                  item['classStr'] = 'progressBar00';
                }else if(item.PercentageReceiving>10 && item.PercentageReceiving<20){
                  item['classStr'] = 'progressBar10';
                }else if(item.PercentageReceiving>20 && item.PercentageReceiving<40){
                  item['classStr'] = 'progressBar20';
                }else if (item.PercentageReceiving>40 && item.PercentageReceiving<60){
                  item['classStr'] = 'progressBar40';
                }else if(item.PercentageReceiving>60 && item.PercentageReceiving<80){
                  item['classStr'] = 'progressBar60';
                }else if(item.PercentageReceiving>80 && item.PercentageReceiving<100){
                  item['classStr'] = 'progressBar80';
                }else if(item.PercentageReceiving == 100){
                  item['classStr'] = 'progressBar100';
                }
              }
            }
        	}else{
        		that.imgShow = false;
            MessageBox('系统提示',response.data.message);
        	}
      	}).catch(oData => {
        	MessageBox('系统提示',oData.data.message);
      	})
    },
  },
  created(){
  	if(window.innerWidth<=320){
      this.fontsize = 'font-size:12px;';
    }else if(window.innerWidth>=414){
      this.fontsize = 'font-size:16px;';
    }
    this.ajaxcoupons();
    util.setTitle('领券中心');
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
  },
  mounted(){
    
  },
  beforeRouteUpdate(to,from,next){
    
  },
  beforeUpdate(){
    
  }

};  
</script>  
  
<style lang="less" scoped>
  .el-progress-circle__track{
    background: rgba(255,255,255,.3)
  }
  .el-progress__text{
    color: #fff;
  }
	.coupons{
		width: 100%;
		height: 100%;
		font-size: 0.12rem;
		.nodata{
      color:#989898;
      font-size:13px;
			margin-top:1.5rem; 
			img{
				width: 0.95rem;
				height: 0.85rem;
        margin-bottom:.08rem;
			}
		}
		.receive{
			padding: 0.1rem 0.15rem;
			.tongyi{
				width: 95%;
        padding-right: 5%;
				height: 1rem;
				background: url('../../../assets/images/my/coupons/background1@2x.png') no-repeat;
				background-size: 100% 100%;
				color: #fff;
        margin-bottom: .1rem;
        text-align: left;
				.conent{
					display: inline-block;
					width: 70%;
					text-align: left;
					margin: 0.15rem 0 0 0;
					font-size: 0.14rem;
					p:nth-child(1){
            display: inline-block;
            width: 42%;
            text-align: center;
						span{
							display: inline-block;
              text-align: center;
							&:nth-child(1){
                display: block;
								font-size: 0.25rem;
                font-weight: bold;
								i{
									width: 0.5rem;
									font-size: 0.3rem;
								}
							}
						}
					} 
          p:nth-child(2){
            vertical-align: top;
            display: inline-block;
            width: 52%;
            position: relative;
            height: 100%;
            span:nth-child(1){
              display: inline-block;
              margin: .2rem 0;
              margin-top: .1rem;
              height: .38rem;
              overflow : hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp:2;
              -webkit-box-orient: vertical;
              margin-left: .15rem;
            }
            span:nth-child(2){
              display: inline-block;
              position: absolute;
              left: .15rem;
              bottom: -13px;
              font-size: .12rem;
            }
          }
				}
				.data{
					display: inline-block;
					width: .5rem;
					height: .5rem;
					vertical-align: top;
          position: relative;
          margin-top: .08rem;
          float: right;
          &.progressBar00{
            background:url(../../../assets/images/my/coupons/progressBar/0%@2x.png) no-repeat;
            background-size:100%;
          }
          &.progressBar10{
            background:url(../../../assets/images/my/coupons/progressBar/10%@2x.png) no-repeat;
            background-size:100%;
          }
          &.progressBar20{
            background:url(../../../assets/images/my/coupons/progressBar/20%@2x.png) no-repeat;
            background-size:100%;
          }
          &.progressBar40{
            background:url(../../../assets/images/my/coupons/progressBar/40%@2x.png) no-repeat;
            background-size:100%;
          }
          &.progressBar60{
            background:url(../../../assets/images/my/coupons/progressBar/60%@2x.png) no-repeat;
            background-size:100%;
          }
          &.progressBar80{
            background:url(../../../assets/images/my/coupons/progressBar/80%@2x.png) no-repeat;
            background-size:100%;
          }
          &.progressBar100{
            background:url(../../../assets/images/my/coupons/progressBar/100%@2x.png) no-repeat;
            background-size:100%;
          }
					p{
						width: 100%;
						height: 100%;
						text-align: center;
            display: flex;
            display: -webkie-flex;
            flex-direction: column;
            justify-content: center;
						span{
              display: block;
              margin: 0 auto;
							width: 0.25rem;
						}
					}
				}
			}
			.isReceive{
				background: url('../../../assets/images/my/coupons/background2@2x.png') no-repeat;
				background-size: 100% 100%;
			}
			.noReceive{
				background: url('../../../assets/images/my/coupons/background3@2x.png') no-repeat;
				background-size: 100% 100%;
			}
		}
	}
</style> 