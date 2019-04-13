import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

export default new vuex.Store({
    state:{
        buyGood_huabei:'', //花呗等级
        goodId:'',//客户当前查看的商品上架ID
        thisGoodNum:1,//当前商品选中数量(默认数量为1)
        shpCardNum:null,//购物车中商品种类的数量
        goodNum:null,//商品库存数量
        thirdParty:false,
        tanchaungType:null,//加入购物车、立即购买弹窗状态
        good:{
        	good_imageText:null,//商品图文详情数据
        	good_parameter:null,//商品参数详情
        	good_guarantee:null,//商品售后数据
        	good_numberPraise:null,//商品好评数
        	good_praiseRate:null,//商品好评率 
        },
        titleShow:true,//默认显示标题
        MapStr:{//用户当前位置信息
        	lng:null,
        	lat:null,
        	province:null,
        	city:null,
        	area:null,
        	addStr:null,
        },
        serviceTelephone:null,//全局客服电话保存
        jumpAppTime:false,//打开app操作关闭时间
        userPhone:null,//客户登录保存的手机号
    },
    mutations: {
    	addUserPhone(state,num){//保存手机号
    		state.userPhone = num;
    	},
    	addjumpAppTimeFunc(state){//关闭时间
    		let myDate = new Date();
		    let year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
		    let month = (Number(myDate.getMonth())+1)<10?'0'+(Number(myDate.getMonth())+1):(Number(myDate.getMonth())+1); //获取当前月份(0-11,0代表1月)
		    let date = myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate(); //获取当前日(1-31)
		    let local_jumpAppTime = year+month+date;
		    localStorage.setItem("jumpAppTime",local_jumpAppTime);
    		state.jumpAppTime = false;
    	},
    	addMapStrFunc(state,type,val){//全局设置：用户位置信息
    		if(type == 'lng'){
    			state.MapStr.lng = val;
    		}else if(type == 'lat'){
    			state.MapStr.lat = val;
    		}else if(type == 'province'){
    			state.MapStr.province = val;
    		}else if(type == 'city'){
    			state.MapStr.city = val;
    		}else if(type == 'area'){
    			state.MapStr.area = val;
    		}else if(type == 'addStr'){
    			state.MapStr.addStr = val;
    		}
    	},
    	titleShowFunc(state,bluo){//浏览器标题控制
    		state.titleShow = bluo;
    	},
	    increment (state,objVal) { 
	    	state.buyGood_huabei = objVal;// 变更状态
	    },
	    preservationGoodId(state,goodId){
	    	state.goodId = goodId;// 变更状态
	    },
	    addGoodNum(state,num){//商品数量赋值
	    	state.goodNum = num;
	    },
	    changeTanchaungType(state,type){
	    	if(type == 4 || type == 5 || type == 7){
		        if(state.thirdParty){
		        	state.tanchaungType = null;
		        	state.thirdParty=false;
		        }else{
		        	state.tanchaungType = type;
		        	state.thirdParty=true;
		        }
		    }else{
		    	state.tanchaungType = null;
		        state.thirdParty=false;
		    }
	    },
	    addShpCardNum(state,num){
	    	if(num!=0){
				state.shpCardNum=num;
	    	}else{
	    		state.shpCardNum=null;
	    	}
	    },
	    addthisGoodNum(state,num){
	    	state.thisGoodNum = num;
	    },
	    addGoodData(state,type,str){//添加数据（商品图文详情、商品参数、商品售后、商品好评数、商品好评率）
	    	if(type == 'img'){
	    		state.good.good_imageText=str;
	    	}else if(type == 'paramet'){
	    		state.good.good_parameter=str;
	    	}else if(type == 'guarantee'){
	    		state.good.good_guarantee=str;
	    	}else if(type =='numberPraise'){
	    		state.good.good_numberPraise=str;
	    	}else if(type =='praiseRate'){
	    		state.good.good_praiseRate=str;
	    	}
	    },
	    addServiceTelephone(state,val){//全局客服电话保存事件
	    	state.serviceTelephone = val;
	    },
	}
})








