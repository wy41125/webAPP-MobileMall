webpackJsonp([4],{"8dV4":function(t,e){},OcQv:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i("wFFv"),o=i("Au9i"),n=i("lbHh"),s=i.n(n),r=i("TVG1"),c=i("mtWM"),d=i.n(c),u={name:"orderPayment",data:function(){return{timeStr:null,orderId:null,orderNo:null,orderTime:null,orderPrice:null,orderObj:{stagingDto:{isUseStaging:1}},huabeiStr:{},tcShow:!1,payType:3,str:"",appid:null,code:null,toOtherView:!0,webType:null,shenyufenzhogn:null,shenyufenzhogn2:null,count:"",timer:null,isShowTitle:!1,jsonObj:null}},components:{headers:a.a},created:function(){r.a.setTitle("晶杰收银台");var t=(new Date).getTime(),e=new Date(t+1296e6);s.a.set("VUE2SESSID",decodeURIComponent(this.$route.query.VUE2SESSID),{expires:e}),this.webType=r.a.webview(),this.orderId=this.$route.query.orderId;var i=window.location.href;i.indexOf("code")>=0?(this.code=i.split("?")[1].split("&")[0].split("=")[1],this.payType=2,this.pay()):this.ajaxPayinfo(this.orderId),this.readTitle()},methods:{readTitle:function(){var t=r.a.webview();console.log(t),this.isShowTitle="other"==t},guanbi:function(){this.toOtherView=!0},switchType:function(t){5==t?1==this.orderObj.stagingDto.isUseStaging?Object(o.Toast)("该笔订单不支持花呗分期支付!"):(this.payType=t,this.tcShow=!0):this.payType=t},pay:function(){var t=0;if(this.payType)if(t=this.payType,"weixin"!=this.webType||2==t)if("zhifupay"!=this.webType||2!=t){var e={orderId:this.orderId,payModel:t,code:this.code};this.huabeiStr.itemStagingNum&&(e.fqNum=this.huabeiStr.itemStagingNum);var i=r.a.getpost(e);2==t?this.weixin(e,i):this.zhifubao(e,i)}else this.toOtherView=!1;else this.toOtherView=!1;else Object(o.Toast)("请选择支付方式！")},weixin:function(t,e){var i=this,a=r.a.webview();if("weixin"==a)if(i.code){var n=this;d()({method:"post",url:"/order/mwebPay"+e,dataType:"json",data:t}).then(function(e){if(0==e.data.status){var i=JSON.parse("{"+e.data.body.payInfo+"}");n.jsonObj=i,/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)?WeixinJSBridge.invoke("getBrandWCPayRequest",i,function(e){"get_brand_wcpay_request:ok"==e.err_msg?n.$router.push({name:"paymentResults",query:{orderId:t.orderId,payModel:2,fqNum:"",fqSellerPercent:""}}):n.$router.go(-1)}):/(Android)/i.test(navigator.userAgent)?"undefined"==typeof WeixinJSBridge?document.addEventListener?document.addEventListener("WeixinJSBridgeReady",n.jsApiCall,!1):document.attachEvent&&(document.attachEvent("WeixinJSBridgeReady",n.jsApiCall),document.attachEvent("onWeixinJSBridgeReady",n.jsApiCall)):n.jsApiCall():alert("请在手机上打开网址！")}else 499==e.data.status?n.$router.push({name:"signInPage",query:{outLogin:"/"}}):Object(o.MessageBox)("系统提示",e.data.message)}).catch(function(t){Object(o.MessageBox)("系统提示",t.data.message)})}else{var c="http://m.jingjie100.com/#/orderPayment?orderId="+i.orderId+"&VUE2SESSID="+encodeURIComponent(s.a.get("VUE2SESSID"));window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+i.appid+"&redirect_uri="+encodeURIComponent(c)+"&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect"}else d()({method:"post",url:"/order/mwebPay"+e,dataType:"json",data:t}).then(function(t){0==t.data.status?"zhifupay"==a||(window.location.href=t.data.body.mweb_url):499==t.data.status?i.$router.push({name:"signInPage",query:{outLogin:"/"}}):Object(o.MessageBox)("系统提示",t.data.message)}).catch(function(t){Object(o.MessageBox)("系统提示",t.data.message)})},jsApiCall:function(){WeixinJSBridge.invoke("getBrandWCPayRequest",this.jsonObj,function(t){"get_brand_wcpay_request:ok"==t.err_msg?that.$router.push({name:"paymentResults",query:{orderId:data.orderId,payModel:2,fqNum:"",fqSellerPercent:""}}):window.history.go(-1)})},zhifubao:function(t,e){var i=this;d()({method:"post",url:"/order/mwebPay"+e,dataType:"json",data:t}).then(function(t){0==t.data.status?"weixin"==r.a.webview()||(5==i.payType?i.str=t.data.body.url.split("<script>")[0]:i.str=t.data.body.form.split("<script>")[0],setTimeout(function(){document.forms[0].submit()},500)):499==t.data.status?i.$router.push({name:"signInPage",query:{outLogin:"/"}}):Object(o.MessageBox)("系统提示",t.data.message)}).catch(function(t){})},clickThisLI:function(t,e,i){if(t.srcElement.className.indexOf("activeli")>=0);else{var a=document.getElementsByClassName("activeli");a[0]&&(a[0].className="",this.huabeiStr={}),t.currentTarget.className="activeli",this.huabeiStr=e}},ajaxPayinfo:function(){var t=this,e={orderId:t.orderId},i=r.a.getpost(e);d()({method:"post",url:"/order/payInfo"+i,dataType:"json",data:e}).then(function(e){if(0==e.data.status){t.orderObj=e.data.body,t.orderPrice=e.data.body.realPay,t.orderTime=e.data.body.createTime,t.orderNo=e.data.body.orderNo,t.appid=e.data.body.appid;var i=t.orderTime.split(" ")[1].split(":"),a=new Date,n=60*(a.getHours()-i[0])+(a.getMinutes()-i[1]);t.shenyufenzhogn=120-n,t.$route.query.RemainingTime?t.TailMoneytimerFunc(t.$route.query.RemainingTime):t.timerFunc(t.shenyufenzhogn)}else 499==e.data.status?(t.isShowData=!1,t.$router.push({name:"signInPage",query:{outLogin:"/"}})):(t.isShowData=!1,Object(o.MessageBox)("系统提示",e.data.message))}).catch(function(e){t.isShowData=!1,Object(o.MessageBox)("系统提示",e.data.message)})},timerFunc:function(t){var e=this;e.count=60*t,e.timer=setInterval(function(){if(e.count>0&&e.count<=60*t){e.count--;var i=e.count%60,a=(e.count-i)/60;e.timeStr=a>60?"1小时"+(a-60)+"分钟"+i+"秒":a+"分钟"+i+"秒",e.$store.commit("addPlaceOrderSurplusTime",e.timeStr)}else clearInterval(e.timer),e.timer=null},1e3)},TailMoneytimerFunc:function(t){var e=this;e.count=t,e.timer=setInterval(function(){e.count>0&&e.count<=t?(e.count--,e.count<60?e.timeStr="0天0时0分钟"+e.count+"秒":e.count>=60&&e.count<3600?e.timeStr="0天0时"+(e.count-e.count%60)/60+"分种"+e.count%60+"秒":e.count>=3600&&e.count<86400?e.timeStr="0天"+(e.count-e.count%3600)/3600+"时"+(e.count%3600-e.count%3600%60)/60+"分钟"+e.count%3600%60+"秒":e.count>=86400&&(e.timeStr=(e.count-e.count%86400)/86400+"天"+(e.count%86400-e.count%86400%3600)/3600+"时"+(e.count%86400%3600-e.count%86400%3600%60)/60+"分钟"+e.count%86400%3600%60+"秒"),e.$store.commit("addPlaceOrderSurplusTime",e.timeStr)):(clearInterval(e.timer),e.timer=null)},1e3)},lookMone:function(){this.huabeiStr.terminallyPay?this.tcShow=!1:Object(o.Toast)("请选择分期数！")}},updated:function(){document.forms[0]&&document.forms[0].submit()},deactivated:function(){console.log(1897)}},l={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"orderPayment"},[t.isShowTitle?a("headers",{attrs:{headerType:2,headerStr:"晶杰收银台"}}):t._e(),t._v(" "),a("p",{staticClass:"prompt",style:t.isShowTitle?"margin-top:.45rem":""},[t._v("订单已经提交！请在"),a("i",[t._v(t._s(t.timeStr))]),t._v("内完成"),a("em",{domProps:{textContent:t._s(t.$route.query.RemainingTime?"尾款":"")}}),t._v("支付。")]),t._v(" "),a("div",{staticClass:"order"},[a("p",[a("span",[t._v("订单编号")]),t._v(t._s(t.orderNo))]),t._v(" "),a("p",[a("span",[t._v("下单时间")]),t._v(t._s(t.orderTime))]),t._v(" "),a("p",[a("span",[t._v("待付金额")]),t._v("¥"+t._s((t.orderPrice/100).toFixed(2)))])]),t._v(" "),a("div",{staticClass:"orderType"},[a("p",[t._v("请选择支付方式")]),t._v(" "),a("p",{on:{click:function(e){e.stopPropagation(),t.switchType(3)}}},[a("i"),t._v("支付宝"),a("b",{class:3==t.payType?"active":""})]),t._v(" "),a("p",{on:{click:function(e){e.stopPropagation(),t.switchType(2)}}},[a("i"),t._v("微信支付"),a("b",{class:2==t.payType?"active":""})]),t._v(" "),a("p",{directives:[{name:"show",rawName:"v-show",value:1!=t.orderObj.stagingDto.isUseStaging,expression:"orderObj.stagingDto.isUseStaging!=1"}],on:{click:function(e){e.stopPropagation(),t.switchType(5)}}},[a("i"),t.huabeiStr.terminallyPay?a("em",{domProps:{textContent:t._s(t.huabeiStr.terminallyPay+"x"+t.huabeiStr.itemStagingNum+"期")}}):t._e(),a("b",{class:5==t.payType?"active":""})])]),t._v(" "),a("div",{staticClass:"footer_botton",on:{click:function(e){e.stopPropagation(),t.pay()}}},[a("span",[t._v("立即付款")])]),t._v(" "),a("mt-popup",{staticClass:"tanchuang",attrs:{position:"bottom"},model:{value:t.tcShow,callback:function(e){t.tcShow=e},expression:"tcShow"}},[a("div",{staticClass:"tcTongyi huabei"},[a("p",{staticClass:"title"},[t._v("花呗分期"),a("i",{on:{click:function(e){e.stopPropagation(),t.lookMone(e)}}})]),t._v(" "),a("ul",t._l(t.orderObj.stagingDto.stagingItemList,function(e,i){return 1!=t.orderObj.stagingDto.isUseStaging?a("li",{on:{click:function(a){a.stopPropagation(),t.clickThisLI(a,e,i)}}},[a("span",[t._v(t._s(e.terminallyPay)+"x"+t._s(e.itemStagingNum)+"期")]),t._v(" "),a("span",{domProps:{textContent:t._s(0==e.isStaging?"免息，无服务费":"含利息"+e.poundageCost+"/期")}})]):t._e()})),t._v(" "),a("button",{on:{click:function(e){return e.stopPropagation(),t.lookMone(),!1}}},[t._v("确定")])])]),t._v(" "),a("div",{domProps:{innerHTML:t._s(t.str)}}),t._v(" "),t.toOtherView?t._e():a("div",{staticClass:"mask"}),t._v(" "),t.toOtherView?t._e():a("div",{staticClass:"tishi"},[a("img",{staticClass:"tishi_one",attrs:{src:i("mTye"),alt:""}}),t._v(" "),a("img",{staticClass:"tishi_two",attrs:{src:i("c5dl"),alt:""},on:{click:function(e){e.stopPropagation(),t.guanbi(e)}}})])],1)},staticRenderFns:[]};var p=i("VU/8")(u,l,!1,function(t){i("8dV4")},"data-v-203e9575",null);e.default=p.exports},c5dl:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABECAYAAADEKno9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyRjA4NEI2NDQ2QUExMUU4QTNCOENDNzFEREI5QzExMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyRjA4NEI2NTQ2QUExMUU4QTNCOENDNzFEREI5QzExMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjJGMDg0QjYyNDZBQTExRThBM0I4Q0M3MUREQjlDMTExIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjJGMDg0QjYzNDZBQTExRThBM0I4Q0M3MUREQjlDMTExIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+MuMRBQAACaxJREFUeNrsnVtoFFcY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"},mTye:function(t,e,i){t.exports=i.p+"static/img/tishi@2x.3937791.png"}});
//# sourceMappingURL=4.6c41faf69280ced5e15b.js.map