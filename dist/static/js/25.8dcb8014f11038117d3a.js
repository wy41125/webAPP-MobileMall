webpackJsonp([25],{SKWk:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a("lbHh"),o=a.n(s),n=a("wFFv"),i=a("Au9i"),r=a("mtWM"),u=a.n(r),d=a("TVG1"),l={name:"applicationRefund",data:function(){return{totalRefund:null,orderId:null,orderDetailIds:[],phoneNum:null,seleObj:[],heightStr:null}},components:{headers:n.a},created:function(){this.ajaxdata(),this.totalRefund=this.$route.query.totalRefund,this.orderId=this.$route.query.orderId,this.orderDetailIds=decodeURIComponent(this.$route.query.orderDetailIds).split(","),d.a.setTitle("申请退款"),this.readPhone(),this.heightStr=window.innerHeight-45,"other"==d.a.webview()?this.$store.commit("titleShowFunc",!0):this.$store.commit("titleShowFunc",!1)},methods:{readPhone:function(){var e=this;e.$store.state.userPhone&&""!=e.$store.state.userPhone?e.phoneNum=e.$store.state.userPhone:o.a.get("jingjieUser")&&(e.phoneNum=o.a.get("jingjieUser"))},ajaxdata:function(){var e=this,t={},a=d.a.getpost(t);u()({method:"post",url:"/ordercs/getCancelReasonList"+a,dataType:"json",data:t}).then(function(t){if(0==t.data.status){for(var a in t.data.body){var s=t.data.body[a];"REPLY-REFUND-REASON"==s.code&&e.seleObj.push(s)}console.log(e.seleObj)}else(t.data.status=499)?(d.a.outLogin(),e.$router.push({name:"signInPage",query:{outLogin:"/"}})):Object(i.MessageBox)("系统提示",t.data.message)}).catch(function(e){Object(i.MessageBox)("系统提示",e.data.message)})},Submit:function(){var e=this;if(e.phoneNum<11||!d.a.PHONE_REG.test(e.phoneNum))Object(i.Toast)("请填写正确的手机号码！");else{var t=document.getElementById("test"),a=t.selectedIndex;console.log(t.options[a].text);var s={orderId:e.orderId,cancelReason:t.options[a].text,totalRefund:e.totalRefund,orderDetailIds:e.orderDetailIds,contactPhone:e.phoneNum},o=d.a.getpost(s);u()({method:"post",url:"/ordercs/createReturnRefundOrder"+o,dataType:"json",data:s}).then(function(t){0==t.data.status?e.$router.push({name:"customDe",query:{cancelId:t.data.body.cancelOrderId}}):(t.data.status=499)?(d.a.outLogin(),e.$router.push({name:"signInPage",query:{outLogin:"/"}})):Object(i.MessageBox)("系统提示",t.data.message)}).catch(function(e){Object(i.MessageBox)("系统提示",e.data.message)})}}}},c={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"applicationRefund",style:"height:"+e.heightStr+"px;"},[e.$store.state.titleShow?a("headers",{staticStyle:{left:"0"},attrs:{headerType:2,headerStr:"申请退款"}}):e._e(),e._v(" "),a("div",{staticClass:"applica_div",style:e.$store.state.titleShow?"margin-top:.45rem":""},[a("div",{staticClass:"applica_div_input"},[e._m(0),e._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:e.phoneNum,expression:"phoneNum"}],attrs:{type:"tel",oninput:"if(value.length>11)value=value.slice(0,11)",placeholder:"请填写联系电话"},domProps:{value:e.phoneNum},on:{input:function(t){t.target.composing||(e.phoneNum=t.target.value)}}})]),e._v(" "),a("div",{staticClass:"applica_div_input"},[e._m(1),e._v(" "),a("input",{attrs:{type:"",readonly:""},domProps:{value:(e.totalRefund/100).toFixed(2)}})]),e._v(" "),a("div",{staticClass:"applica_div_input"},[e._m(2),e._v(" "),a("p",{staticClass:"select_div"},[a("select",{attrs:{name:"",id:"test",placeholder:"请选择退款原因"}},e._l(e.seleObj,function(t,s){return a("option",{attrs:{selected:""},domProps:{value:s}},[e._v(e._s(t.reason))])})),e._v(" "),a("i",{staticClass:"xia"})])])]),e._v(" "),a("button",{on:{click:function(t){t.stopPropagation(),e.Submit(t)}}},[e._v("提交")])],1)},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("p",[this._v("联系方式"),t("i",[this._v("*")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[this._v("退款金额"),t("i",[this._v("*")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[this._v("退款原因"),t("i",[this._v("*")])])}]};var h=a("VU/8")(l,c,!1,function(e){a("epgA")},"data-v-7564606c",null);t.default=h.exports},epgA:function(e,t){}});
//# sourceMappingURL=25.8dcb8014f11038117d3a.js.map