webpackJsonp([30],{"65uH":function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=s("mtWM"),o=s.n(a),n=s("Au9i"),r=s("UeMV"),i=s("wFFv"),c=s("TVG1"),u={name:"set",data:function(){return{passStr:""}},components:{headers:i.a,navigation:r.a},methods:{ajaxUpUser:function(){var t=this,e=this,s={},a=c.a.getpost(s);o()({method:"post",url:"/customer/logout"+a,dataType:"json",data:s}).then(function(s){0==s.data.status?(Object(n.Toast)("退出成功！"),t.$router.go(-1)):499==s.data.status?(Object(n.Toast)("退出成功！"),t.$router.go(-1)):(e.imgShow=!1,Object(n.MessageBox)("系统提示",s.data.message))}).catch(function(t){Object(n.MessageBox)("系统提示",t.data.message)})},ajaxUser:function(){var t=this,e={},s=c.a.getpost(e);o()({method:"post",url:"/customer/info"+s,dataType:"json",data:e}).then(function(e){0==e.data.status&&(e.data.body.hasPassword&&1==e.data.body.hasPassword?t.passStr="修改密码":t.passStr="设置密码")}).catch(function(t){Object(n.MessageBox)("系统提示",t.data.message)})},outLogin:function(){this.ajaxUpUser();var t=new Date;t.setTime(-1e3);for(var e=document.cookie.split("; "),s=0;s<e.length;s++){var a=e[s].split("=");document.cookie=a[0]+"=''; expires="+t.toGMTString()}}},created:function(){this.ajaxUser(),c.a.setTitle("设置"),"other"==c.a.webview()?this.$store.commit("titleShowFunc",!0):this.$store.commit("titleShowFunc",!1)}},d={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"set"},[t.$store.state.titleShow?s("headers",{attrs:{headerType:2,headerStr:"设置"}}):t._e(),t._v(" "),s("div",{staticClass:"user",style:t.$store.state.titleShow?"top:.45rem":"top:0;"},[s("p",{staticClass:"title"},[t._v("账户信息")]),t._v(" "),s("p",{staticClass:"conent",on:{click:function(e){e.stopPropagation(),t.$router.push({name:"userInfor"})}}},[t._v("个人资料"),s("span",[t._v(t._s(t.$route.query.userName))])]),t._v(" "),s("p",{staticClass:"conent",on:{click:function(e){e.stopPropagation(),t.$router.push({name:"setpassWord",query:{hasPass:t.$route.query.hasPassword}})}}},[t._v("密码设置"),s("span",[t._v(t._s(t.passStr))])]),t._v(" "),s("div",{staticClass:"outLogin"},[s("p",{staticStyle:{padding:"0"},on:{click:function(e){e.stopPropagation(),t.outLogin(e)}}},[t._v("退出登录")])])]),t._v(" "),s("navigation")],1)},staticRenderFns:[]};var p=s("VU/8")(u,d,!1,function(t){s("BVL0")},"data-v-5e92d896",null);e.default=p.exports},BVL0:function(t,e){}});
//# sourceMappingURL=30.82fd16c77924cbba9125.js.map