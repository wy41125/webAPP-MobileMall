webpackJsonp([26],{fbjj:function(e,t){},vS86:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=r("mvHQ"),s=r.n(o),a=r("lbHh"),i=r.n(a),d=r("UeMV"),n=r("wFFv"),c=r("Au9i"),u=r("mtWM"),p=r.n(u),l=r("TVG1"),_={name:"orderDetalis",data:function(){return{orderId:null,orderObj:{},zhuangtaiStr:"",timeStr:"",barcode:null,count:"",timer:null}},components:{headers:n.a,navigation:d.a},created:function(){this.orderId=this.$route.query.orderId,this.ajaxOrderDetail(),l.a.setTitle("订单详情"),"other"==l.a.webview()?this.$store.commit("titleShowFunc",!0):this.$store.commit("titleShowFunc",!1)},methods:{ajaxTelephone:function(){var e=this,t={},r=l.a.getpost(t);p()({method:"post",url:"/open/getServerPhone"+r,dataType:"json",data:t}).then(function(t){0==t.data.status?e.$store.commit("addServiceTelephone",t.data.body.val):Object(c.Toast)(t.data.message)}).catch(function(e){Object(c.MessageBox)("系统提示",e.data.message)})},jumpOrderTrack:function(e){this.$router.push({name:"orderTrack",query:{orderId:e}})},jumpComment:function(e){var t=encodeURIComponent(s()(e));this.$router.push({name:"comment",query:{orderObj:t,type:2}})},modifyOrder:function(e){var t=this,r="";2==e.shoppingModel?t.$router.push({name:"addlessList",query:{source:"changeOrder",orderId:e.orderId}}):5==t.orderObj.orderType?t.orderObj.depositStr&&""!=t.orderObj.depositStr?(r=encodeURIComponent(t.orderObj.balancePaymentEndTime),t.$router.push({name:"storePage",query:{source:"changeOrder",orderId:e.orderId,orderTime:e.pickupTime,PreSalechangeTime:r}})):(r=encodeURIComponent(t.orderObj.presellEndTime),t.$router.push({name:"storePage",query:{source:"changeOrder",orderId:e.orderId,orderTime:e.pickupTime,PreSalechangeTime:r}})):t.$router.push({name:"storePage",query:{source:"changeOrder",orderId:e.orderId,orderTime:e.pickupTime}})},ApplyAfterSale:function(e){this.$router.push({name:"ApplyAfterSale",query:{orderId:e}})},jumpRefund:function(e){var t=this;5==t.orderObj.orderType&&t.orderObj.isRejectedDeposit&&0==t.orderObj.isRejectedDeposit?Object(c.MessageBox)({title:"该预售商品，若申请退款，定金将不予退换。确认取消吗?",message:"该预售商品，若申请退款，定金将不予退换。确认取消吗?",showCancelButton:!0,confirmButtonText:"申请退款",cancelButtonText:"再想一想"}).then(function(e){"confirm"==e&&t.jumpRefundJumpFunc(t.orderObj,"twk")}):t.jumpRefundJumpFunc(t.orderObj,"tqk")},jumpRefundJumpFunc:function(e,t){var r,o=[];for(var s in e.details)o.push(e.details[s].detailId);r=o.join(","),"djkt"==t?this.$router.push({name:"applicationRefund",query:{orderId:e.orderId,orderDetailIds:encodeURIComponent(r),totalRefund:e.deposit}}):"twk"==t?this.$router.push({name:"applicationRefund",query:{orderId:e.orderId,orderDetailIds:encodeURIComponent(r),totalRefund:e.finalMoney}}):"tqk"==t&&this.$router.push({name:"applicationRefund",query:{orderId:e.orderId,orderDetailIds:encodeURIComponent(r),totalRefund:e.realPay}})},cancelOrder:function(){var e=this;5==e.orderObj.orderType?0==e.orderObj.depositPayStatus?e.cancelOrderAjax():0==e.orderObj.isRejectedDeposit?Object(c.MessageBox)({title:"温馨提示",message:"该预售商品，若取消订单，定金将不予退换。确认取消吗?",showCancelButton:!0,confirmButtonText:"取消订单",cancelButtonText:"再想一想"}).then(function(t){"confirm"==t&&e.cancelOrderAjax()}):e.jumpRefundJumpFunc(e.orderObj,"djkt"):e.cancelOrderAjax()},cancelOrderAjax:function(){var e=this,t={orderId:e.orderId},r=l.a.getpost(t);p()({method:"post",url:"/order/orderCancel"+r,dataType:"json",data:t}).then(function(t){0==t.data.status?(Object(c.Toast)("取消成功!"),location.reload()):(t.data.status=499)?(l.a.outLogin(),e.$router.push({name:"signInPage",query:{outLogin:"/"}})):Object(c.MessageBox)("系统提示",t.data.message)}).catch(function(e){Object(c.MessageBox)("系统提示",e.data.message)})},jumpOrderPay:function(e,t){if(!t||2!=t.tailPayStatusByDate){var r=i.a.get("VUE2SESSID");if(t){var o=(new Date).getTime(),s=((t.balancePaymentEndTimeT-o)/1e3).toFixed(0);this.$router.push({name:"orderPayment",query:{orderId:e,VUE2SESSID:encodeURIComponent(r),RemainingTime:s}})}else this.$router.push({name:"orderPayment",query:{orderId:e,VUE2SESSID:encodeURIComponent(r)}})}},deleteOrder:function(e){var t=this,r={orderId:e},o=l.a.getpost(r);Object(c.MessageBox)({title:"提示",message:"是否删除当前订单？",showCancelButton:!0,confirmButtonText:"确认",cancelButtonText:"取消"}).then(function(e){"confirm"==e&&p()({method:"post",url:"/order/orderDelete"+o,dataType:"json",data:r}).then(function(e){0==e.data.status?t.$router.go(-1):(e.data.status=499)?(l.a.outLogin(),t.$router.push({name:"signInPage",query:{outLogin:"/"}})):l.a.viewPopup(e.data.message)}).catch(function(e){l.a.viewPopup(e.data.message)})})},jumpGood:function(e){this.$router.push({name:"goodsDevele",params:{onlineId:e}})},ConfirmationReceipt:function(e){var t=this;c.MessageBox.confirm("商品已经全部收到，确认收货？").then(function(r){var o=t,s={orderId:e},a=l.a.getpost(s);p()({method:"post",url:"/order/confirmReceipt"+a,dataType:"json",data:s}).then(function(e){if(0==e.data.status){if(0==e.data.body.isFinish)return void Object(c.Toast)("还未收到货物，无法确认！");Object(c.Toast)("确认收货"),location.reload()}else(e.data.status=499)?(l.a.outLogin(),o.$router.push({name:"signInPage",query:{outLogin:"/"}})):Object(c.MessageBox)("系统提示",e.data.message)}).catch(function(e){Object(c.MessageBox)("系统提示",e.data.message)})})},ajaxOrderDetail:function(){var e=this,t={orderId:e.orderId},r=l.a.getpost(t);p()({method:"post",url:"/order/detail"+r,dataType:"json",data:t}).then(function(t){0==t.data.status?(e.orderObj=t.data.body,e.timeStrFunc(e.orderObj)):(t.data.status=499)?(l.a.outLogin(),e.$router.push({name:"signInPage",query:{outLogin:"/"}})):Object(c.MessageBox)("系统提示",t.data.message)}).catch(function(e){Object(c.MessageBox)("系统提示",e.data.message)})},timeStrFunc:function(e){1==e.status&&2==e.shoppingModel?(5==e.orderType&&1==e.depositPayStatus&&0==e.payStatus?this.timeStr="请在"+e.balancePaymentStartTime+"-"+e.balancePaymentEndTime+"内完成支付":(this.timeStr="请在"+e.payTime+"内完成支付，否则订单将自动关闭",this.timerFunc(e.payTime)),this.zhuangtaiStr="待支付"):1==e.status&&3==e.shoppingModel?(5==e.orderType&&1==e.depositPayStatus&&0==e.payStatus?this.timeStr="请在"+e.balancePaymentStartTime+"-"+e.balancePaymentEndTime+"内完成支付":(this.timeStr="请在"+e.payTime+"内完成支付，否则订单将自动关闭",this.timerFunc(e.payTime)),this.zhuangtaiStr="待支付"):2==e.status&&2==e.shoppingModel&&0==e.isDeliver?(this.timeStr="我们将尽快为您进行发货",this.zhuangtaiStr="待收货"):2==e.status&&2==e.shoppingModel&&1==e.isDeliver?(this.timeStr="商品已出库发货",this.zhuangtaiStr="待收货"):2==e.status&&3==e.shoppingModel?(this.timeStr="请及时到自提门店进行取货",this.zhuangtaiStr="待收货"):3==e.status?(this.timeStr="期待您下次的光临",this.zhuangtaiStr="已完成"):4==e.status&&(this.timeStr="",this.zhuangtaiStr="已取消")},timerFunc:function(e){var t=0;t=e.indexOf("小时")>=0?60*e.split("小时")[0]*60+60*e.split("小时")[1].split("分钟")[0]:60*e.split("分钟")[0],console.log(t);var r=this;r.count=t,r.timer=setInterval(function(){if(r.count>0&&r.count<=t){r.count--;var e=r.count%60,o=(r.count-e)/60;r.timeStr=o>60?"请在1小时"+(o-60)+"分钟"+e+"秒内完成支付，否则订单将自动关闭":"请在"+o+"分钟"+e+"秒内完成支付，否则订单将自动关闭"}else clearInterval(r.timer),r.timer=null},1e3)}}},m={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"confirmationOrder"},[e.$store.state.titleShow?r("headers",{attrs:{headerType:2,headerStr:"订单详情"}}):e._e(),e._v(" "),r("div",{staticClass:"orderState",style:e.$store.state.titleShow?"margin-top:.45rem":""},[e._m(0),e._v(" "),r("p",{staticClass:"zhuangtai"},[e._v(e._s(e.zhuangtaiStr))]),e._v(" "),""!=e.timeStr?r("p",{staticClass:"time"},[e._v(e._s(e.timeStr))]):e._e()]),e._v(" "),2==e.orderObj.status?r("div",{staticClass:"OrderTracking",on:{click:function(t){t.stopPropagation(),e.jumpOrderTrack(e.orderObj.orderId)}}},[r("i"),r("span",[e._v("订单跟踪")])]):e._e(),e._v(" "),r("div",{staticClass:"orderLogistics",style:2==e.orderObj.status?"margin-top:0;":""},[r("ul",[r("li",[e._v("订单编号："+e._s(e.orderObj.orderNo))]),e._v(" "),r("li",[e._v("下单时间："+e._s(e.orderObj.createTime))]),e._v(" "),2==e.orderObj.shoppingModel?r("li",[e._v("收货人："+e._s(e.orderObj.recvName)+" ("+e._s(e.orderObj.recvPhone)+")")]):e._e(),e._v(" "),2==e.orderObj.shoppingModel?r("li",[e._v("收货地址："+e._s(e.orderObj.recevAddress))]):e._e(),e._v(" "),3==e.orderObj.shoppingModel?r("li",[e._v("自提门店："+e._s(e.orderObj.orgName)+"("+e._s(e.orderObj.linkPhone)+")")]):e._e(),e._v(" "),3==e.orderObj.shoppingModel?r("li",[e._v("门店地址："+e._s(e.orderObj.orgAddress))]):e._e(),e._v(" "),3==e.orderObj.shoppingModel&&e.orderObj.pickupTime?r("li",[e._v("自提时间："+e._s(e.orderObj.pickupTime)+"("+e._s(e.orderObj.weekDay)+")")]):e._e()]),e._v(" "),3==e.orderObj.shoppingModel&&2==e.orderObj.status?r("div",{staticClass:"barcode"},[r("barcode",{attrs:{value:e.orderObj.orderNo,options:{displayValue:!1}}}),e._v(" "),r("p",[e._v(e._s(e.orderObj.orderNo))])],1):e._e()]),e._v(" "),r("div",{staticClass:"order"},[r("p",{staticClass:"order_title"},[r("em",{staticStyle:{"font-size":"12px"}},[e._v("订单信息")]),r("span",[r("a",{staticStyle:{"font-size":"12px"},attrs:{href:"tel:"+e.$store.state.serviceTelephone}},[e._v("联系客服")])])]),e._v(" "),r("div",{staticClass:"order_goods"},[e._l(e.orderObj.details,function(t){return t.packageDetails?e._e():r("div",{staticClass:"good_div nopackage",style:1==e.orderObj.details.length?"border:0px solid #ddd;":"",on:{click:function(r){r.stopPropagation(),e.jumpGood(t.onlineId)}}},[r("div",{staticClass:"goodXinxi"},[r("div",{staticClass:"goodXinxi_img"},[r("img",{attrs:{src:t.imgUrl}})]),e._v(" "),r("div",{staticClass:"goodXinxi_name"},[r("p",{staticClass:"goodXinxi_name_oneP"},[e._v(e._s(t.goodsName))]),e._v(" "),r("p",{staticClass:"goodXinxi_name_twoP"},[e._v(e._s(t.salePriceStr)),r("i",[e._v("x"+e._s(t.num))])])])]),e._v(" "),e._l(t.giftReturn,function(t){return r("p",{staticClass:"gift"},[e._v("【赠品】 "+e._s(t.goodsName)),r("i",[e._v("x"+e._s(t.num))])])})],2)}),e._v(" "),e._l(e.orderObj.details,function(t){return t.packageDetails?r("div",{staticClass:"good_div",style:1==e.orderObj.details.length?"border:0px solid #ddd;":""},[r("p",{staticClass:"package_p"},[r("i",[e._v("优惠套餐")]),e._v(e._s(t.packageName)+" "),r("span",{staticClass:"setPrice"},[e._v("¥"+e._s((t.salePrice/100).toFixed(2))),r("b",[e._v("x"+e._s(t.num))])])]),e._v(" "),e._l(t.packageDetails,function(o,s){return r("div",{staticClass:"goodXinxi",style:s==t.packageDetails.length-1?"border:0px solid #ececec;":"",on:{click:function(t){t.stopPropagation(),e.jumpGood(o.onlineId)}}},[r("div",{staticClass:"goodXinxi_img"},[r("img",{attrs:{src:o.imgUrl}})]),e._v(" "),r("div",{staticClass:"goodXinxi_name"},[r("p",[e._v(e._s(o.goodsName))])])])}),e._v(" "),e._l(t.giftReturn,function(t){return r("p",{staticClass:"gift"},[e._v("【赠品】 "+e._s(t.goodsName)),r("i",[e._v("x"+e._s(t.num))])])})],2):e._e()})],2)]),e._v(" "),r("div",{staticClass:"other",style:e.orderObj.depositStr&&""!=e.orderObj.depositStr?"margin-bottom:0;":""},[r("p",{staticClass:"other_p hasmone"},[e._v("发票信息 "),r("span",[e._v(e._s(e.orderObj.invoiceName))])]),e._v(" "),e.orderObj.cardName?r("p",{staticClass:"other_p hasmone"},[e._v("优惠券"),r("span",[e._v(e._s(e.orderObj.cardName))])]):e._e(),e._v(" "),1==e.orderObj.orderType?r("p",{staticClass:"other_p hasmone"},[e._v("订单总额"),r("span",{staticStyle:{color:"#e12e2e"}},[e._v("¥"+e._s((e.orderObj.salePrice/100).toFixed(2)))])]):e._e(),e._v(" "),1==e.orderObj.orderType?r("p",{staticClass:"other_p hasmone"},[e._v("优惠"),r("span",{staticStyle:{color:"#e12e2e"}},[r("em",{domProps:{textContent:e._s(e.orderObj.couponPrice?"¥"+(e.orderObj.couponPrice/100).toFixed(2):"¥0.00")}})])]):e._e()]),e._v(" "),e.orderObj.depositStr&&""!=e.orderObj.depositStr&&5==e.orderObj.orderType?r("div",{staticClass:"preSale"},[r("p",{staticClass:"title"},[e._v("订单金额")]),e._v(" "),r("div",{staticClass:"stageDiv"},[r("div",{staticClass:"stage selectStage",style:0==e.orderObj.depositPayStatus?"color:#e12e2e;":""},[r("p",{staticClass:"stageOne"},[e._m(1),e._v("\n          定金"),r("span",[r("em",[e._v("小计：")]),e._v(e._s(e.orderObj.depositStr))])]),e._v(" "),r("p",{staticClass:"stageTwo"},[r("i",{domProps:{textContent:e._s(4!=e.orderObj.status&&1==e.orderObj.depositPayStatus?"已支付":"待支付")}}),e._v(" "),4==e.orderObj.status?r("i",[e._v("未支付")]):e._e()])]),e._v(" "),r("div",{class:1==e.orderObj.depositPayStatus&&0==e.orderObj.payStatus||1==e.orderObj.payStatus?"stage selectStage":"stage",style:1==e.orderObj.depositPayStatus&&0==e.orderObj.payStatus?"color:#e12e2e;":""},[r("p",{staticClass:"stageOne"},[e._m(2),e._v("\n          尾款"),r("span",[r("em",[e._v("小计：")]),e._v(e._s(e.orderObj.finalMoneyStr))])]),e._v(" "),r("p",{staticClass:"stageTwo",staticStyle:{border:"0px solid #ddd"}},[r("em",{directives:[{name:"show",rawName:"v-show",value:1==e.orderObj.status,expression:"orderObj.status == 1"}],staticStyle:{color:"#999"}},[e._v("("+e._s(e.orderObj.balancePaymentStartTime)+"-"+e._s(e.orderObj.balancePaymentEndTime)+"支付尾款)")]),e._v(" "),4!=e.orderObj.status&&2==e.orderObj.tailPayStatusByDate?r("i",[e._v("未开始")]):e._e(),e._v(" "),4!=e.orderObj.status&&1==e.orderObj.tailPayStatusByDate?r("i",{domProps:{textContent:e._s(1==e.orderObj.payStatus?"已支付":"待支付")}}):e._e(),e._v(" "),4==e.orderObj.status?r("i",[e._v("未支付")]):e._e()])])]),e._v(" "),r("div",{staticClass:"div_stage_p"},[r("p",{staticClass:"stage_p"},[r("b",[e._v("订单总额：")]),r("span",[r("em"),e._v(e._s(e.orderObj.salePriceStr))]),r("i")]),e._v(" "),r("p",{staticClass:"stage_p"},[r("b",[e._v("优惠：")]),r("span",[r("em",{domProps:{textContent:e._s(e.orderObj.couponPrice?"¥"+(e.orderObj.couponPrice/100).toFixed(2):"¥0.00")}})]),r("i")])])]):e._e(),e._v(" "),r("div",{staticClass:"footer_botton"},[r("p",{staticClass:"maney",style:1==e.orderObj.isApplyRefund?"margin-top:2%;":""},[1==e.orderObj.status&&1==e.orderObj.orderType||1==e.orderObj.status&&5==e.orderObj.orderType&&!e.orderObj.depositStr?r("span",{style:1!=e.orderObj.isApplyRefund?"line-height: .5rem;":""},[r("em",[e._v("应付金额")]),r("i",{staticClass:"red"},[e._v(" ¥"+e._s((e.orderObj.realPay/100).toFixed(2)))])]):e._e(),e._v(" "),5==e.orderObj.orderType&&0==e.orderObj.depositPayStatus?r("span",{style:1!=e.orderObj.isApplyRefund?"line-height: .5rem;":""},[r("em",[e._v("应付定金")]),r("i",{staticClass:"red"},[e._v(" "+e._s(e.orderObj.depositStr))])]):e._e(),e._v(" "),5==e.orderObj.orderType&&1==e.orderObj.depositPayStatus&&0==e.orderObj.payStatus&&1==e.orderObj.status?r("span",{style:1!=e.orderObj.isApplyRefund?"line-height: .5rem;":""},[r("em",[e._v("应付尾款")]),r("i",{staticClass:"red"},[e._v(" "+e._s(e.orderObj.finalMoneyStr))])]):e._e(),e._v(" "),1!=e.orderObj.status?r("span",{style:1!=e.orderObj.isApplyRefund?"line-height: .5rem;":""},[r("em",[e._v("实付金额")]),r("i",{staticClass:"red"},[e._v(" ¥"+e._s((e.orderObj.realPay/100).toFixed(2)))])]):e._e(),e._v(" "),r("span",{directives:[{name:"show",rawName:"v-show",value:1==e.orderObj.isApplyRefund,expression:"orderObj.isApplyRefund==1"}],staticStyle:{color:"#999"}},[e._v("已退款金额：¥"+e._s((e.orderObj.totalRefund/100).toFixed(2)))])]),e._v(" "),1==e.orderObj.orderType&&1==e.orderObj.status?r("span",{staticClass:"button solid",on:{click:function(t){t.stopPropagation(),e.jumpOrderPay(e.orderObj.orderId)}}},[e._v("立即支付")]):e._e(),e._v(" "),5==e.orderObj.orderType&&0==e.orderObj.depositPayStatus&&1==e.orderObj.status?r("span",{staticClass:"button solid",on:{click:function(t){t.stopPropagation(),e.jumpOrderPay(e.orderObj.orderId)}}},[e._v("支付定金")]):e._e(),e._v(" "),5==e.orderObj.orderType&&1==e.orderObj.depositPayStatus&&0==e.orderObj.payStatus&&1==e.orderObj.status?r("span",{staticClass:"button solid",style:2==e.orderObj.tailPayStatusByDate?"background:#ccc;":"",on:{click:function(t){t.stopPropagation(),e.jumpOrderPay(e.orderObj.orderId,e.orderObj)}}},[e._v("支付尾款")]):e._e(),e._v(" "),(5==e.orderObj.orderType&&0==e.orderObj.depositPayStatus||5==e.orderObj.orderType&&1==e.orderObj.depositPayStatus&&0==e.orderObj.payStatus||1==e.orderObj.orderType)&&1==e.orderObj.status?r("span",{staticClass:"button",on:{click:function(t){t.stopPropagation(),e.cancelOrder(e.orderObj.orderId)}}},[e._v("取消订单")]):e._e(),e._v(" "),2==e.orderObj.status&&0==e.orderObj.isDeliver?r("span",{staticClass:"button solid",on:{click:function(t){t.stopPropagation(),e.modifyOrder(e.orderObj)}}},[e._v("修改订单")]):e._e(),e._v(" "),2==e.orderObj.status&&0==e.orderObj.isDeliver&&1==e.orderObj.payStatus?r("span",{staticClass:"button",on:{click:function(t){t.stopPropagation(),e.jumpRefund(e.orderObj)}}},[e._v("申请退款")]):e._e(),e._v(" "),2==e.orderObj.status&&1==e.orderObj.isDeliver?r("span",{staticClass:"button solid",on:{click:function(t){t.stopPropagation(),e.ConfirmationReceipt(e.orderObj.orderId)}}},[e._v("确认收货")]):e._e(),e._v(" "),3==e.orderObj.status&&0==e.orderObj.isComment?r("span",{staticClass:"button solid",on:{click:function(t){t.stopPropagation(),e.jumpComment(e.orderObj)}}},[e._v("评价")]):e._e(),e._v(" "),3==e.orderObj.status?r("span",{staticClass:"button",on:{click:function(t){t.stopPropagation(),e.ApplyAfterSale(e.orderObj.orderId)}}},[e._v("申请售后")]):e._e(),e._v(" "),4==e.orderObj.status?r("span",{staticClass:"button",on:{click:function(t){t.stopPropagation(),e.deleteOrder(e.orderObj.orderId)}}},[e._v("删除订单")]):e._e()]),e._v(" "),r("navigation")],1)},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("p",{staticClass:"img"},[t("i")])},function(){var e=this.$createElement,t=this._self._c||e;return t("em",{staticClass:"icon_em"},[t("b",{staticClass:"icon_b"}),t("i",{staticClass:"icon_i"})])},function(){var e=this.$createElement,t=this._self._c||e;return t("em",{staticClass:"icon_em"},[t("b",{staticClass:"icon_b"}),t("i",{staticClass:"icon_i"})])}]};var b=r("VU/8")(_,m,!1,function(e){r("fbjj")},"data-v-6cf48ca2",null);t.default=b.exports}});
//# sourceMappingURL=26.be6121773571f6465cdf.js.map