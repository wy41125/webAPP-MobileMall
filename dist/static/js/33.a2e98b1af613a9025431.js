webpackJsonp([33],{"4tl4":function(e,s){},ViE9:function(e,s,a){"use strict";Object.defineProperty(s,"__esModule",{value:!0});a("Au9i");var t=a("wFFv"),o=a("TVG1"),n=a("mtWM"),i=a.n(n),l=(a("lbHh"),/^.*(?=.{6,16})(((?=.*\d)(?=.*[A-Za-z]))|((?=.*\d)(?=.*[!@#$%^&*? ]))|((?=.*[A-Za-z])(?=.*[!@#$%^&*? ]))).*$/),r={name:"signin",data:function(){return{val:{PhoneNum:"",Password:"",userPass:"",userPassTow:""},show:!0,timeStr:"获取动态密码",count:"",timer:null,phonetrue:!1,classShow:!1,classShow1:!1,heightStr:null}},components:{headers:t.a},methods:{changeShowHide:function(e){1===e?this.classShow?this.classShow=!1:this.classShow=!0:this.classShow1?this.classShow1=!1:this.classShow1=!0},yanzhen:function(){var e=this.val.userPass;l.test(e)||(o.a.viewPopup("请设置正确的密码！"),this.val.userPass="")},watchPhone:function(e){var s=e.currentTarget.value;11==s.length&&"1"==s[0]?this.phonetrue=!0:this.phonetrue=!1},verificationCode:function(){var e=this;this.count=60,this.show=!1,this.timer=setInterval(function(){e.count>0&&e.count<=60?e.count--:(e.show=!0,clearInterval(e.timer),e.timeStr="再次发送",e.timer=null)},1e3)},ajaxVerificationCode:function(){var e=this;if(!this.timer)if(this.phonetrue){var s={};s.phoneNo=this.val.PhoneNum,s.type="4";var a=o.a.getpost(s);i()({method:"post",url:"/customer/open/getSmscode"+a,dataType:"json",data:s}).then(function(s){0==s.data.status?e.verificationCode():o.a.viewPopup(s.data.message)}).catch(function(e){e.data.status&&0!=e.data.status&&o.a.viewPopup(e.data.message)})}else o.a.viewPopup("请输入正确的手机号！")},phoneLogin:function(e){var s=this;if(!(e.srcElement.className.indexOf("canNext")<0))if(s.phonetrue){if(s.val.userPass!==s.val.userPassTow)return o.a.viewPopup("两次设置的密码不一致！"),s.val.PhoneNum="",s.val.Password="",s.val.showPhoneNum="",void(s.val.showPassword="");var a={phoneNo:s.val.PhoneNum,verifyCode:s.val.Password,password:s.val.userPass,confirmPassword:s.val.userPassTow},t=o.a.getpost(a);i()({method:"post",url:"/customer/open/forgetPwd"+t,dataType:"json",data:a}).then(function(e){0==e.data.status?s.$router.go(-1):(o.a.viewPopup(e.data.message),s.val.Password="",s.val.userPass="",s.val.userPassTow="")}).catch(function(e){e.data.status&&0!=e.data.status&&o.a.viewPopup(e.data.message)})}else o.a.viewPopup("请输入正确的手机号！")}},created:function(){o.a.setTitle("忘记密码"),this.heightStr="height:"+(window.innerHeight-80)+"px;","other"==o.a.webview()?this.$store.commit("titleShowFunc",!0):this.$store.commit("titleShowFunc",!1)},beforeRouteUpdate:function(e,s,a){}},u={render:function(){var e=this,s=e.$createElement,a=e._self._c||s;return a("div",{staticClass:"signin",style:e.heightStr},[a("header",{staticClass:"mint-header is-fixed"},[a("div",{staticClass:"mint-header-button is-left"},[a("em",{on:{click:function(s){s.stopPropagation(),e.$router.go(-1)}}})]),e._v(" "),a("h1",{staticClass:"mint-header-title"},[e.$store.state.titleShow?a("em",{staticStyle:{display:"inline-block","line-height":".44rem","font-size":".17rem"}},[e._v("忘记密码")]):e._e()]),e._v(" "),a("div",{staticClass:"mint-header-button is-right"})]),e._v(" "),a("div",{staticClass:"inputDiv",style:e.$store.state.titleShow?"margin-top:.45rem":""},[a("div",{staticClass:"tongyiDiv"},[a("p",{staticClass:"PhoneNum "},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.val.PhoneNum,expression:"val.PhoneNum"}],attrs:{type:"number",oninput:"if(value.length>11)value=value.slice(0,11)",placeholder:"手机号码"},domProps:{value:e.val.PhoneNum},on:{input:[function(s){s.target.composing||e.$set(e.val,"PhoneNum",s.target.value)},function(s){e.watchPhone(s)}]}}),e._v(" "),e.val.PhoneNum?a("i",{on:{click:function(s){e.val.PhoneNum=""}}}):e._e(),e._v(" "),a("b")]),e._v(" "),a("p",{staticClass:"Password"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.val.Password,expression:"val.Password"}],attrs:{type:"number",oninput:"if(value.length>6)value=value.slice(0,6)",placeholder:"验证码"},domProps:{value:e.val.Password},on:{input:function(s){s.target.composing||e.$set(e.val,"Password",s.target.value)}}}),e._v(" "),e.val.Password?a("i",{on:{click:function(s){e.val.Password=""}}}):e._e(),e._v(" "),a("span",{staticClass:"canClick",on:{click:e.ajaxVerificationCode}},[e.show?a("b",[e._v(e._s(e.timeStr))]):e._e(),e._v(" "),e.show?e._e():a("b",[e._v(e._s(e.count)+"s")])])]),e._v(" "),a("p",{staticClass:"PhoneNum passAis"},["checkbox"==(e.classShow?"text":"password")?a("input",{directives:[{name:"model",rawName:"v-model",value:e.val.userPass,expression:"val.userPass"}],attrs:{oninput:"if(value.length>16)value=value.slice(0,16)",placeholder:"请设置新密码",type:"checkbox"},domProps:{checked:Array.isArray(e.val.userPass)?e._i(e.val.userPass,null)>-1:e.val.userPass},on:{change:function(s){var a=e.val.userPass,t=s.target,o=!!t.checked;if(Array.isArray(a)){var n=e._i(a,null);t.checked?n<0&&(e.val.userPass=a.concat([null])):n>-1&&(e.val.userPass=a.slice(0,n).concat(a.slice(n+1)))}else e.$set(e.val,"userPass",o)}}}):"radio"==(e.classShow?"text":"password")?a("input",{directives:[{name:"model",rawName:"v-model",value:e.val.userPass,expression:"val.userPass"}],attrs:{oninput:"if(value.length>16)value=value.slice(0,16)",placeholder:"请设置新密码",type:"radio"},domProps:{checked:e._q(e.val.userPass,null)},on:{change:function(s){e.$set(e.val,"userPass",null)}}}):a("input",{directives:[{name:"model",rawName:"v-model",value:e.val.userPass,expression:"val.userPass"}],attrs:{oninput:"if(value.length>16)value=value.slice(0,16)",placeholder:"请设置新密码",type:e.classShow?"text":"password"},domProps:{value:e.val.userPass},on:{input:function(s){s.target.composing||e.$set(e.val,"userPass",s.target.value)}}}),e._v(" "),e.val.userPass?a("i",{on:{click:function(s){e.val.userPass=""}}}):e._e(),e._v(" "),a("span",{class:e.classShow?"showchange":"",on:{click:function(s){s.stopPropagation(),e.changeShowHide(1)}}})]),e._v(" "),a("p",{staticClass:"PhoneNum passAis"},["checkbox"==(e.classShow?"text":"password")?a("input",{directives:[{name:"model",rawName:"v-model",value:e.val.userPassTow,expression:"val.userPassTow"}],attrs:{oninput:"if(value.length>16)value=value.slice(0,16)",placeholder:"再次确认密码",type:"checkbox"},domProps:{checked:Array.isArray(e.val.userPassTow)?e._i(e.val.userPassTow,null)>-1:e.val.userPassTow},on:{focus:function(s){e.yanzhen()},change:function(s){var a=e.val.userPassTow,t=s.target,o=!!t.checked;if(Array.isArray(a)){var n=e._i(a,null);t.checked?n<0&&(e.val.userPassTow=a.concat([null])):n>-1&&(e.val.userPassTow=a.slice(0,n).concat(a.slice(n+1)))}else e.$set(e.val,"userPassTow",o)}}}):"radio"==(e.classShow?"text":"password")?a("input",{directives:[{name:"model",rawName:"v-model",value:e.val.userPassTow,expression:"val.userPassTow"}],attrs:{oninput:"if(value.length>16)value=value.slice(0,16)",placeholder:"再次确认密码",type:"radio"},domProps:{checked:e._q(e.val.userPassTow,null)},on:{focus:function(s){e.yanzhen()},change:function(s){e.$set(e.val,"userPassTow",null)}}}):a("input",{directives:[{name:"model",rawName:"v-model",value:e.val.userPassTow,expression:"val.userPassTow"}],attrs:{oninput:"if(value.length>16)value=value.slice(0,16)",placeholder:"再次确认密码",type:e.classShow?"text":"password"},domProps:{value:e.val.userPassTow},on:{focus:function(s){e.yanzhen()},input:function(s){s.target.composing||e.$set(e.val,"userPassTow",s.target.value)}}}),e._v(" "),e.val.userPassTow?a("i",{on:{click:function(s){e.val.userPassTow=""}}}):e._e(),e._v(" "),a("span",{class:e.classShow1?"showchange":"",on:{click:function(s){s.stopPropagation(),e.changeShowHide(2)}}})]),e._v(" "),a("p",{staticClass:"remarks"},[e._v("注:密码长度为6-16位，数字、字母、字符至少包含两种")]),e._v(" "),a("p",{staticClass:"buttonLogin noBorder"},[a("span",{class:""!=e.val.PhoneNum?"canNext":"",on:{click:function(s){s.stopPropagation(),e.phoneLogin(s)}}},[e._v("完成")])])])])])},staticRenderFns:[]};var c=a("VU/8")(r,u,!1,function(e){a("4tl4")},"data-v-4c1d84ad",null);s.default=c.exports}});
//# sourceMappingURL=33.a2e98b1af613a9025431.js.map