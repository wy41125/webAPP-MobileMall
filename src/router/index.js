import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'

Vue.use(Router)

let routerObj =null; 
export default routerObj = new Router({
  routes: [
    {
      path:'/problemList',//登录页面
      name:'problemList',
      component:resolve => {
        require(['@/components/My/helpCenter/problemList'], resolve);
      },
    },
    {
      path: '/',
      name: 'Main',
      component: Main,
      children:[
          {
            path:'',//首页
            name:'homePage',
            component:resolve => {
              require(['@/components/homePage/homaPage'], resolve);
            },
            children:[
              {
                path:'',//首页专区
                name:'recommend',
                component:resolve =>{
                  require(['@/components/homePage/recommend'],resolve);
                }
              },{
                path:'areas',//专区
                name:'areas',
                component:resolve =>{
                  require(['@/components/homePage/areas'],resolve);
                }
              }
            ],
          },
          {
            path:'classification',//分类
            name:'classification',
            component:resolve => {
              require(['@/components/classification/classification'], resolve);
            }
          },
          {
            path:'shoppingCart',//购物车
            name:'shoppingCart',
            component:resolve => {
              require(['@/components/shoppingCart/shoppingCart'], resolve);
            }
          },
          {
              path:'My',//我的
              name:'My',
              component: resolve =>{
                  require(['@/components/My/My'],resolve);
              }
          },
      ]
    }, 
    {
      path:'/signInPage',//登录页面
      name:'signInPage',
      component:resolve => {
        require(['@/components/land/signIn_page'], resolve);
      },
    },
    {
      path:'/userLogin',//账号登录
      name:'userLogin',
      component:resolve =>{
        require(['@/components/land/userLogin'],resolve);
      }
    },
    {
      path:'/register1',//注册页面1
      name:'register1',
      component:resolve =>{
        require(['@/components/land/register1'],resolve);
      }
    },
    {
      path:'/register2',//注册页面2
      name:'register2',
      component:resolve =>{
        require(['@/components/land/register2'],resolve);
      }
    },
    {
      path:'/userProtocol',//注册协议页面
      name:'userProtocol',
      component:resolve =>{
        require(['@/components/land/userProtocol'],resolve);
      }
    },
    {
      path:'/forgetPass',//忘记密码
      name:'forgetPass',
      component:resolve =>{
        require(['@/components/land/forgetPass'],resolve);
      }
    },
    {
      path:'/userInformetion',//客户设置
      name:'userInformetion',
      component:resolve =>{
        require(['@/components/My/set/userInformetion'],resolve);
      }
    },
    {
      path:'/userInfor',//个人信息页面
      name:'userInfor',
      component:resolve =>{
        require(['@/components/My/set/userInfor'],resolve);
      }
    },
    {
      path:'/setpassWord',//个人中心密码设置
      name:'setpassWord',
      component:resolve =>{
        require(['@/components/My/set/setpassWord'],resolve);
      }
    },
    {
      path:'/coupons',//领券列表
      name:'coupons',
      component:resolve =>{
        require(['@/components/My/coupons/coupons'],resolve);
      }
    },
    {
    	path:'/customInput',//搜索页面
    	name:'customInput',
    	component:resolve => {
    		require(['@/components/customInput'], resolve);
    	}
    },
    {
      path:'/goodsList',//商品列表页
      name:'goodsList',
      component:resolve =>{
        require(['@/components/goods/goodsList'],resolve);
      },
    },
    {
      path:'/storePage',//晶杰之家门店
      name:'storePage',
      component:resolve =>{
        require(['@/components/My/store/storePage'],resolve);
      },
    },
    {
      path:'/BMap',//晶杰之家门店地图
      name:'BMap',
      component:resolve =>{
        require(['@/components/My/store/BMap'],resolve);
      },
    },
    {
      path:'/card',//卡券
      name:'card',
      component:resolve =>{
        require(['@/components/My/card/card'],resolve);
      },
    },
    {
      path:'/collection',//我的收藏
      name:'collection',
      component:resolve =>{
        require(['@/components/My/collection/collection'],resolve);
      },
    },
    {
      path:'/order',//我的订单
      name:'order',
      component:resolve =>{
        require(['@/components/My/order/order'],resolve);
      },
    },
    {
      path:'/orderDetails',//我的订单详情
      name:'orderDetails',
      component:resolve =>{
        require(['@/components/My/order/orderDetails'],resolve);
      },
    },
    {
      path:'/orderTrack',//订单跟踪
      name:'orderTrack',
      component:resolve =>{
        require(['@/components/My/order/orderTrack'],resolve);
      },
    },
    {
      path:'/logistics',//售后添加物流
      name:'logistics',
      component:resolve =>{
        require(['@/components/My/service/logistics'],resolve);
      },
    },
    {
      path:'/customerList',//售后单列表
      name:'customerList',
      component:resolve =>{
        require(['@/components/My/service/customerList'],resolve);
      },
    },
    {
      path:'/customDe',//售后单详情
      name:'customDe',
      component:resolve =>{
        require(['@/components/My/service/customDe'],resolve);
      },
    },
    {
      path:'/comment',//订单评价
      name:'comment',
      component:resolve =>{
        require(['@/components/My/order/comment'],resolve);
      },
    },
    {
      path:'/apply',//申请退货、换货
      name:'apply',
      component:resolve =>{
        require(['@/components/My/order/apply'],resolve);
      },
    },
    {
      path:'/applicationRefund',//申请退款
      name:'applicationRefund',
      component:resolve =>{
        require(['@/components/My/order/applicationRefund'],resolve);
      },
    },
    {
      path:'/ApplyAfterSale',//申请售后
      name:'ApplyAfterSale',
      component:resolve =>{
        require(['@/components/My/order/ApplyAfterSale'],resolve);
      },
    },
    {
      path:'/addlessList',//地址列表
      name:'addlessList',
      component:resolve =>{
        require(['@/components/My/address/addlessList'],resolve);
      },
    },
    {
      path:'/changeAddless',//地址新增、修改
      name:'changeAddless',
      component:resolve =>{
        require(['@/components/My/address/changeAddless'],resolve);
      },
    },
    {
      path:'/confirmationOrder',//订单
      name:'confirmationOrder',
      component:resolve =>{
        require(['@/components/shoppingCart/confirmationOrder'],resolve);
      },
    },
    {
      path:'/invoice',//发票
      name:'invoice',
      component:resolve =>{
        require(['@/components/shoppingCart/invoice'],resolve);
      },
    },
    {
      path:'/orderPayment',//收银台
      name:'orderPayment',
      component:resolve =>{
        require(['@/components/shoppingCart/orderPayment'],resolve);
      },
    },
    {
      path:'/ordercard',//订单卡券
      name:'ordercard',
      component:resolve =>{
        require(['@/components/shoppingCart/order_card'],resolve);
      },
    },
    {
      path:'/paymentResults',//支付结果
      name:'paymentResults',
      component:resolve =>{
        require(['@/components/shoppingCart/paymentResults'],resolve);
      },
    },
    {
      path:'/package',//优惠套餐
      name:'package',
      component:resolve =>{
        require(['@/components/goods/package'],resolve);
      },
    },
    {
      path:'/recommended',//配件页面
      name:'recommended',
      component:resolve =>{
        require(['@/components/goods/recommend'],resolve);
      },
    },
    {
      path:'/goodshare',//商品分享
      name:'goodshare',
      component:resolve =>{
        require(['@/components/goods/goodshare'],resolve);
      },
    },
    {
      path:'/goodsDevele',//商品详情页
      name:'goodsDevele',
      component:resolve =>{
        require(['@/components/goods/goodsDevele'],resolve);
      },
      children:[
          {
            path:'/',//商品详情页->商品信息
            name:'goods',
            component:resolve =>{
              require(['@/components/goods/goods'],resolve);
            } 
          },
          {
            path:'detailsObj',//商品详情页->详情信息
            name:'detailsObj',
            component:resolve =>{
              require(['@/components/goods/detailsObj'],resolve);
            } 
          },
          {
            path:'evaluate',//商品详情页->评价信息
            name:'evaluate',
            component:resolve =>{
              require(['@/components/goods/evaluate'],resolve);
            } 
          },
      ]
    },
    {
      path: '/*',
      name: 'error-404',
      meta: {
          title: '404-页面不存在'
      },
      component: resolve => {
          require(['@/components/404'], resolve);
      }
    }
  ]
})

// 获取版本更新的jsonp回调函数
window.getVersion = version => {
  console.log(version);
  if((localStorage.frontendVersion && version != localStorage.frontendVersion) || (window.frontendVersion && version != window.frontendVersion)) {
    console.log('服务器代码更新');
    // Loading.service(); // 启动全屏loading
    location.reload(); // 刷新页面
  }

  localStorage.frontendVersion = version; // 保存 以便下次使用判断
  window.frontendVersion = version; // 保存 以便下次使用判断

}

routerObj.afterEach((to) => {
  let arr = document.getElementsByClassName("myscript");
  if(arr.length>=1){
    for(let i=0;i<arr.length ;i++){
      let elem=arr[i]; // 按 id 获取要删除的元素
      elem.parentNode.removeChild(elem); // 让 “要删除的元素” 的 “父元素” 删除 “要删除的元素”
      i--;
    }
  }
  var versionScript = document.createElement("script");
  versionScript.classList.add("myscript");
  versionScript.src = location.origin + '/version.js?v=' + new Date().getTime();
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(versionScript, s);
});

