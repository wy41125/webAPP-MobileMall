webpackJsonp([31],{"/U+2":function(e,t){},dVAj:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=i("UeMV"),a=i("wFFv"),c=i("Au9i"),n=i("mtWM"),u=i.n(n),l=i("TVG1"),o={name:"customDe",data:function(){return{cancelId:null,cancelObj:{},fuwuleixing:null,jinduType:null,jinduZuihouStr1:null,jinduZuihouStr2:null}},components:{headers:a.a,navigation:s.a},methods:{jumpLogFunc:function(e){this.$router.push({name:"logistics",query:{cancelId:e}})},jumpWuliu:function(e,t,i,s){this.$router.push({name:"orderTrack",query:{orderId:t,source:"custom",orderCancelId:e,serviceType:i,opStatus:s}})},jumpPage:function(e){this.$router.push({name:"orderDetails",query:{orderId:e}})},ajaxqingqiu:function(){var e=this,t={cancelOrderId:e.cancelId},i=l.a.getpost(t);u()({method:"post",url:"/ordercs/getOrderCancelDetailForReturn"+i,dataType:"json",data:t}).then(function(t){0==t.data.status?(e.cancelObj=t.data.body,e.changeStr(),e.jinduTypeFunc()):(t.data.status=499)?(l.a.outLogin(),e.$router.push({name:"signInPage",query:{outLogin:"/"}})):Object(c.MessageBox)("系统提示",t.data.message)}).catch(function(e){Object(c.MessageBox)("系统提示",e.data.message)})},jinduTypeFunc:function(){4==this.cancelObj.serviceType?2==this.cancelObj.status?this.jinduType=2:this.jinduType=1:1==this.cancelObj.serviceType?1==this.cancelObj.opStatus?(this.jinduType=1,this.jinduZuihouStr1="退货中",this.jinduZuihouStr2="已退货"):2==this.cancelObj.opStatus?(this.jinduType=2,this.jinduZuihouStr1="退货中",this.jinduZuihouStr2="已退货"):3==this.cancelObj.opStatus?(this.jinduType=2,this.jinduZuihouStr1="审核拒绝"):4==this.cancelObj.opStatus?(this.jinduType=2,this.jinduZuihouStr1="已取消"):5==this.cancelObj.opStatus?(this.jinduType=3,this.jinduZuihouStr1="退货中",this.jinduZuihouStr2="已退货"):6==this.cancelObj.opStatus&&(this.jinduType=3,this.jinduZuihouStr1="退货中",this.jinduZuihouStr2="退货拒绝"):2==this.cancelObj.serviceType&&(1==this.cancelObj.opStatus?(this.jinduType=1,this.jinduZuihouStr1="换货中",this.jinduZuihouStr2="已换货"):2==this.cancelObj.opStatus?(this.jinduType=2,this.jinduZuihouStr1="换货中",this.jinduZuihouStr2="已换货"):3==this.cancelObj.opStatus?(this.jinduType=2,this.jinduZuihouStr1="审核拒绝"):4==this.cancelObj.opStatus?(this.jinduType=2,this.jinduZuihouStr1="已取消"):5==this.cancelObj.opStatus?(this.jinduType=3,this.jinduZuihouStr1="换货中",this.jinduZuihouStr2="已换货"):6==this.cancelObj.opStatus&&(this.jinduType=3,this.jinduZuihouStr1="换货中",this.jinduZuihouStr2="换货拒绝"))},changeStr:function(){1==this.cancelObj.serviceType?this.fuwuleixing="退货":2==this.cancelObj.serviceType?this.fuwuleixing="换货":3==this.cancelObj.serviceType?this.fuwuleixing="维修":4==this.cancelObj.serviceType?this.fuwuleixing="退款":5==this.cancelObj.serviceType&&(this.fuwuleixing="退定金")}},created:function(){this.cancelId=this.$route.query.cancelId,this.ajaxqingqiu(),l.a.setTitle("服务单详情"),"other"==l.a.webview()?this.$store.commit("titleShowFunc",!0):this.$store.commit("titleShowFunc",!1)}},r={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"customDe"},[e.$store.state.titleShow?i("headers",{attrs:{headerType:2,headerStr:"服务单详情"}}):e._e(),e._v(" "),i("div",{style:e.$store.state.titleShow?"margin-top:.45rem":""},[1==e.cancelObj.isExpress?i("p",{staticClass:"wuliu",on:{click:function(t){t.stopPropagation(),e.jumpWuliu(e.cancelObj.cancelId,e.cancelObj.expressHistoryId,e.cancelObj.serviceType,e.cancelObj.opStatus)}}},[i("i"),e._v("物流跟踪（"),i("em",{domProps:{textContent:e._s(1==e.cancelObj.expressType?"寄":"收")}}),e._v("）\n    ")]):e._e(),e._v(" "),2==e.cancelObj.opStatus||6==e.cancelObj.opStatus?i("div",{staticClass:"wuliuxinxi"},[i("p",{staticClass:"wuliuxinxi_title"},[e._v("退货寄送至（或到店）：")]),e._v(" "),i("ul",[i("li",[i("span",[e._v("收件姓名：")]),e._v(e._s(e.cancelObj.name))]),e._v(" "),i("li",[i("span",[e._v("联系电话：")]),e._v(e._s(e.cancelObj.linkPhone))]),e._v(" "),i("li",[i("span",[e._v("收货地址：")]),e._v(e._s(e.cancelObj.address))])]),e._v(" "),i("p",{staticClass:"wuliuxinxi_zhushi"},[i("i"),1==e.cancelObj.serviceType?i("em",[e._v("注：确保服务单中所有商品都退货，快递包裹中备注服务单号，晶杰之家确认收货后自动退款")]):e._e(),2==e.cancelObj.serviceType?i("em",[e._v("注：确保服务单中所有商品都换货，快递包裹中备注服务单号，晶杰之家确认收货后自动退款")]):e._e()])]):e._e(),e._v(" "),1==e.cancelObj.isExpress||2==e.cancelObj.opStatus||6==e.cancelObj.opStatus?i("p",{staticStyle:{width:"100%",height:".05rem",background:"#ececec"}}):e._e(),e._v(" "),i("div",{staticClass:"fuwudan"},[i("p",{staticClass:"fuwudan_title"},[i("i"),e._v("晶杰之家服务单 "),i("span",[i("b"),i("a",{staticStyle:{"font-size":"12px"},attrs:{href:"tel:"+e.$store.state.serviceTelephone}},[e._v("联系客服")])])]),e._v(" "),i("div",{staticClass:"fuwudan_jincheng"},[4==e.cancelObj.serviceType?i("el-steps",{attrs:{active:e.jinduType,"align-center":""}},[i("el-step",{attrs:{title:"审核中"}}),e._v(" "),i("el-step",{attrs:{title:"已退款"}})],1):e._e(),e._v(" "),1==e.cancelObj.serviceType?i("el-steps",{attrs:{active:e.jinduType,"align-center":""}},[i("el-step",{attrs:{title:"审核中"}}),e._v(" "),i("el-step",{attrs:{title:e.jinduZuihouStr1}}),e._v(" "),e.jinduZuihouStr2?i("el-step",{attrs:{title:e.jinduZuihouStr2}}):e._e()],1):e._e(),e._v(" "),2==e.cancelObj.serviceType?i("el-steps",{attrs:{active:e.jinduType,"align-center":""}},[i("el-step",{attrs:{title:"审核中"}}),e._v(" "),i("el-step",{attrs:{title:e.jinduZuihouStr1}}),e._v(" "),e.jinduZuihouStr2?i("el-step",{attrs:{title:e.jinduZuihouStr2}}):e._e()],1):e._e()],1)]),e._v(" "),3!=e.cancelObj.opStatus&&6!=e.cancelObj.opStatus||!e.cancelObj.refuseReason||""==e.cancelObj.refuseReason?e._e():i("div",{staticClass:"yuanyin"},[i("p",[e._v("拒绝原因：")]),e._v(" "),i("p",[e._v(e._s(e.cancelObj.refuseReason))])]),e._v(" "),i("div",{staticClass:"dingdanxinxi"},[i("ul",[i("li",[i("span",[e._v("服务单号：")]),e._v(e._s(e.cancelObj.cancelOrderNo))]),e._v(" "),i("li",[i("span",[e._v("服务类型：")]),e._v(e._s(e.fuwuleixing))]),e._v(" "),1==e.cancelObj.serviceType||4==e.cancelObj.serviceType?i("li",[i("span",[e._v("退款金额：")]),e._v("¥"+e._s((e.cancelObj.totalRefund/100).toFixed(2)))]):e._e(),e._v(" "),i("li",[i("span",[e._v("联系方式：")]),e._v(e._s(e.cancelObj.contactPhone))]),e._v(" "),1==e.cancelObj.serviceType?i("li",[i("span",[e._v("退货原因：")]),e._v(e._s(e.cancelObj.cancelReason))]):e._e(),e._v(" "),2==e.cancelObj.serviceType?i("li",[i("span",[e._v("换货原因：")]),e._v(e._s(e.cancelObj.cancelReason))]):e._e(),e._v(" "),4==e.cancelObj.serviceType?i("li",[i("span",[e._v("退款原因：")]),e._v(e._s(e.cancelObj.cancelReason))]):e._e(),e._v(" "),4!=e.cancelObj.serviceType?i("li",[i("span",[e._v("是否拆封：")]),i("em",{domProps:{textContent:e._s(1==e.cancelObj.isOpen?"已拆封":"未拆封")}})]):e._e(),e._v(" "),e.cancelObj.cancelDesc&&""!=e.cancelObj.cancelDesc?i("li",[i("span",[e._v("退货说明：")]),e._v(e._s(e.cancelObj.cancelDesc))]):e._e(),e._v(" "),e.cancelObj.imgUrls&&e.cancelObj.imgUrls.length>0?i("li",[i("span"),e._v(" "),e._l(e.cancelObj.imgUrls,function(e){return i("img",{attrs:{src:e,alt:""}})})],2):e._e()])]),e._v(" "),i("p",{staticStyle:{width:"100%",height:".05rem",background:"#ececec"}}),e._v(" "),i("div",{staticClass:"goodXinxi"},[i("p",{class:1!=e.cancelObj.isDelete?"goodXinxi_title":"goodXinxi_title noafter"},[e._v("商品信息"),1!=e.cancelObj.isDelete?i("span",{on:{click:function(t){t.stopPropagation(),e.jumpPage(e.cancelObj.orderId)}}},[e._v("查看关联订单")]):e._e()]),e._v(" "),i("div",{staticClass:"order_goods"},[e._l(e.cancelObj.details,function(t){return t.packageDetails?e._e():i("div",{staticClass:"good_div nopackage",style:1==e.cancelObj.details.length?"border:0px solid #ddd;":""},[i("div",{staticClass:"goodXinxi"},[i("div",{staticClass:"goodXinxi_img"},[i("img",{attrs:{src:t.imgUrl}})]),e._v(" "),i("div",{staticClass:"goodXinxi_name special"},[i("p",{staticClass:"goodXinxi_name_oneP"},[e._v(e._s(t.goodsName))]),e._v(" "),i("p",{staticClass:"goodXinxi_name_twoP"},[e._v(e._s(t.salePriceStr)),i("i",[e._v("x"+e._s(t.num))])])])]),e._v(" "),e._l(t.giftReturn,function(s){return t.giftReturn&&t.giftReturn.length>0?i("p",{staticClass:"gift"},[e._v("【赠品】 "+e._s(s.goodsName)),i("i",[e._v("x"+e._s(s.num))])]):e._e()})],2)}),e._v(" "),e._l(e.cancelObj.details,function(t){return t.packageDetails?i("div",{staticClass:"good_div",style:1==e.cancelObj.details.length?"border:0px solid #ddd;":""},[i("p",{staticClass:"package_p"},[i("i",[e._v("优惠套餐")]),e._v(e._s(t.packageName)+" "),i("span",{staticClass:"setPrice"},[e._v("¥"+e._s((t.salePrice/100).toFixed(2))),i("b",[e._v("x"+e._s(t.num))])])]),e._v(" "),e._l(t.packageDetails,function(s,a){return t.packageDetails&&t.packageDetails.length>0?i("div",{staticClass:"goodXinxi",style:a==t.packageDetails.length-1?"border:0px solid #ececec;":""},[i("div",{staticClass:"goodXinxi_img"},[i("img",{attrs:{src:s.imgUrl}})]),e._v(" "),i("div",{staticClass:"goodXinxi_name"},[i("p",[e._v(e._s(s.goodsName))])])]):e._e()}),e._v(" "),i("p",{staticClass:"setPrice"},[e._v(e._s(t.salePriceStr)),i("i",[e._v("x"+e._s(t.num))])]),e._v(" "),e._l(t.giftReturn,function(s){return t.giftReturn&&t.giftReturn.length>0?i("p",{staticClass:"gift"},[e._v("【赠品】 "+e._s(s.goodsName)),i("i",[e._v("x"+e._s(s.num))])]):e._e()})],2):e._e()})],2),e._v(" "),1==e.cancelObj.isUseCard&&2!=e.cancelObj.serviceType?i("p",{staticClass:"goodXinxi_price"},[e._v("折后可退金额：¥"+e._s((e.cancelObj.totalRefund/100).toFixed(2)))]):e._e()]),e._v(" "),1!=e.cancelObj.isExpress&&2==e.cancelObj.opStatus?i("button",{staticClass:"button",on:{click:function(t){t.stopPropagation(),e.jumpLogFunc(e.cancelObj.cancelId)}}},[e._v("填写"),1==e.cancelObj.serviceType?i("em",[e._v("退货")]):e._e(),2==e.cancelObj.serviceType?i("em",[e._v("换货")]):e._e(),e._v("物流单号")]):e._e()]),e._v(" "),i("navigation")],1)},staticRenderFns:[]};var _=i("VU/8")(o,r,!1,function(e){i("/U+2")},"data-v-5658263c",null);t.default=_.exports}});
//# sourceMappingURL=31.eb74ae7393fc4cc2c7b6.js.map