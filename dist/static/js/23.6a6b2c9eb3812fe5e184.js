webpackJsonp([23],{"8Bnr":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});n("Au9i"),n("mtWM"),n("TVG1");var a={name:"coupons",data:function(){return{}},props:{dataBili:Number},methods:{canvasyuan:function(){var t=document.getElementsByClassName("yuan")[0].getContext("2d");t.beginPath(),t.arc(25,25,23,0,1*Math.PI,!1),t.lineWidth=3,t.strokeStyle="rgba(255,255,255,0.5)",t.stroke(),t.closePath()},huayuan:function(){var t=document.getElementsByClassName("yuans")[i].getContext("2d");t.beginPath(),t.arc(25,25,23,0,.5*Math.PI,1),t.strokeStyle="red",t.lineWidth=3,t.stroke(),t.closePath()}},created:function(){},mounted:function(){this.canvasyuan()},beforeRouteUpdate:function(t,e,n){},beforeUpdate:function(){},watch:{dataBili:function(){this.canvasyuan(),this.huayuan()}}},s={render:function(){this.$createElement;this._self._c;return this._m(0)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"canvasObj"},[e("canvas",{staticClass:"yuan",staticStyle:{position:"absolute",top:"0",right:"0","z-index":"100"},attrs:{width:"50px;",height:"50px"}}),this._v(" "),e("canvas",{staticClass:"yuans",staticStyle:{position:"absolute",top:"0",right:"0","z-index":"1000"},attrs:{width:"50px;",height:"50px"}})])}]};var o=n("VU/8")(a,s,!1,function(t){n("TKzC")},null,null);e.default=o.exports},TKzC:function(t,e){}});
//# sourceMappingURL=23.6a6b2c9eb3812fe5e184.js.map