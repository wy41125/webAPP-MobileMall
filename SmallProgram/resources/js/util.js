import md5 from 'js-md5';
var util = {};

util.loadImg = 'data:image/gif;base64,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';
util.PHONE_REG = /^(((11[0-9]{1})|(12[0-9]{1})|(13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;//手机正则
util.PASSWORD = /^.*(?=.{6,16})(((?=.*\d)(?=.*[A-Za-z]))|((?=.*\d)(?=.*[!@#$%^&*? ]))|((?=.*[A-Za-z])(?=.*[!@#$%^&*? ]))).*$/;//密码正则
util.TIME_COUNT = 60;//倒计时时间

util.getpost = function (data) { //请求头部方法添加 
    let timestamp = parseInt(new Date().getTime() / 1000);
    let arr, reg = new RegExp('(^| )VUE2SESSID=([^;]*)(;|$)');
    arr = document.cookie.match(reg);
    let token = arr ? unescape(arr[2]) : '';
    let sign_key = '2b03753ccc9d983702e448660f065369';
    let sign = 'time' + timestamp + 'token' + token + JSON.stringify(data) + sign_key;
    let aaa = md5(encodeURIComponent(sign.replace(/\s+/g, '')));
    return '?token=' + token + '&time=' + timestamp + '&sign=' + aaa;
};

util.webview = function(){//检测当前浏览器是什么环境
	let webStr = window.navigator.userAgent,webType='';
	if (/MicroMessenger/.test(webStr)) { 
	    webType='weixin'; 
	} else if (/AlipayClient/.test(webStr)) { 
	    webType='zhifupay'; 
	} else if(/qq/.test(webStr)){
	   webType='qq'; 
	}else{
		webType='other'; 
	}
	return webType;
}

util.toTop = function(){//页面跳转显示顶部
	document.body.scrollTop = document.documentElement.scrollTop = 0;
}
util.setTitle = function(str){//页面设置标题func
    document.title=str;
}
util.outLogin = function(){//用户登出func
    var myDate=new Date();    
    myDate.setTime(-1000);//设置时间
    var data=document.cookie;    
    var dataArray=data.split("; ");    
    for(var i=0;i<dataArray.length;i++){    
        var varName=dataArray[i].split("=");    
        document.cookie=varName[0]+"=''; expires="+myDate.toGMTString();    
    }
}
util.getPositionet = function(){//获取用户当前的地理位置func
    let that = this,AddSre={};
    let map = new BMap.Map("allmap");
    let point = new BMap.Point(116.331398,39.897445);
    map.enableScrollWheelZoom(true);
    let geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
     	if(this.getStatus() == BMAP_STATUS_SUCCESS){
        	let mk = new BMap.Marker(r.point);
        	map.addOverlay(mk);
        	map.panTo(r.point);
        	AddSre.lng = r.point.lng;//经度
        	AddSre.lat = r.point.lat;//纬度
        	let myGeo = new BMap.Geocoder();      
        	myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function(result){// 根据坐标得到地址描述        
            	if(result){   
              		AddSre.province = result.address.split('省')[0]+'省';//省
              		AddSre.city = result.address.split('省')[1].split('市')[0]+'市';//市
              		AddSre.area = result.address.split('省')[1].split('市')[1].split('区')[0]+'区';//区
              		AddSre.str = AddSre.province+AddSre.city+AddSre.area;
            	}
            	return AddSre;
          	});
        }else {
          	alert('failed'+this.getStatus());
        }
    });
}
util.openApp = function(){//h5跳转打开APP或跳转下载页func
    let url_ios =  'applinks:m.jingjie100.com';//打开app的协议，由ios App同事提供
    let url_android = 'dripop://home';//打开app的协议，有android App同事提供
    let url_download =  'http://static.jingjie100.com/download.html';
    if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){//通过window.navigator.userAgent来判断当前设备是IOS还是Android。
        var ifr = document.createElement('iframe');
        ifr.src = url_ios;
        ifr.style.display = 'none';
        document.body.appendChild(ifr);
        window.setTimeout(function(){
            document.body.removeChild(ifr);
　　　　　　　window.location.href = url_download;
        },1000)
    }else{
        var ifr = document.createElement('iframe');
        ifr.src = url_android;
        ifr.style.display = 'none';
        document.body.appendChild(ifr);
        window.setTimeout(function(){
            document.body.removeChild(ifr);
　　　　　　　window.location.href = url_download;
        },1000)
    }
}
/*
*   second
*   str
*/
util.timeTransformation = function(second,str){//“秒”转换不同格式的时间字符串func（入参必须为秒，在秒的基础上转换）
    let timeStr = '',styleStr = 'style="display: inline-block;width: .18rem;height: .16rem;background: #563618;border-radius: .05rem;color: #fff;text-align: center;"';
    second = Number(second);
    let miao = '',fen = '',shi = '',tian = '';
    if(str.indexOf('秒') >= 0 || str.indexOf('分') >= 0 || str.indexOf('时') >= 0 || str.indexOf('天') >= 0){//转换为：**天**时**分**秒
        if(second<60){//秒
            miao = (((second%86400)%3600)%60)<10?'0'+((second%86400)%3600)%60:((second%86400)%3600)%60;
            timeStr = '00天<i '+styleStr+'>00</i>:<i '+styleStr+'>00</i>:<i '+styleStr+'>'+miao+'</i>';
        }else if(second>=60 && second<3600){//分
            fen = ((second-second%60)/60)<10?'0'+(second-second%60)/60:(second-second%60)/60;
            miao = (second%60)<10?'0'+second%60:second%60;
            timeStr = '00天<i '+styleStr+'>00</i>:<i '+styleStr+'>'+fen+'</i>:<i '+styleStr+'>'+miao+'</i>';
        }else if(second>=3600 && second<86400){//时
            shi = ((second-second%3600)/3600)<10?'0'+(second-second%3600)/3600:(second-second%3600)/3600;
            fen = ((second%3600-(second%3600)%60)/60)<10?'0'+(second%3600-(second%3600)%60)/60:(second%3600-(second%3600)%60)/60;
            miao = ((second%3600)%60)<10?'0'+(second%3600)%60:(second%3600)%60;
            timeStr = '00天<i '+styleStr+'>'+shi+'</i>:<i '+styleStr+'>'+fen+'</i>:<i '+styleStr+'>'+miao+'</i>';
        }else if(second>=86400){//天
            tian = ((second-second%86400)/86400)<10?'0'+(second-second%86400)/86400:(second-second%86400)/86400;
            shi = ((second%86400-(second%86400)%3600)/3600)<10?'0'+(second%86400-(second%86400)%3600)/3600:(second%86400-(second%86400)%3600)/3600;
            fen = ((((second%86400)%3600)-((second%86400)%3600)%60)/60)<10?'0'+(((second%86400)%3600)-((second%86400)%3600)%60)/60:(((second%86400)%3600)-((second%86400)%3600)%60)/60;
            miao = (((second%86400)%3600)%60)<10?'0'+((second%86400)%3600)%60:((second%86400)%3600)%60;
            timeStr = tian+'天<i '+styleStr+'>'+shi+'</i>:<i '+styleStr+'>'+fen+'</i>:<i '+styleStr+'>'+miao+'</i>';
        }
    }
    return timeStr;
}
/*
* startTime 开始时间 （****-**-** **:**:**）
* SelectTime 用户选中时间 （****-**-** **:**:**）
*/
util.judgeTimeFrame = function(startTime,SelectTime){//自提时间判断是否在范围中（期限都是28天）
    let Result = true,oneDateStamp = 1000*60*60*24;
    let startTimeStamp = Number(new Date(startTime).getTime())+oneDateStamp*28;
    let SelectTimeStamp = new Date(SelectTime).getTime();
    if(startTimeStamp>=SelectTimeStamp){
        Result = true;
    }else{
        Result = false;
    }
    return Result;
}
/*
*   imgStr 查看图片的图片地址
*/
util.docu = document.getElementsByTagName("body")[0];
util.viewPicture = function(imgStr){//评论放大图片，点击再次关闭
    let maskDiv=document.createElement("div");
    maskDiv.setAttribute('class','maskDiv');
    maskDiv.style.cssText = 'position: fixed;top: 0;left: 0;display: block;width: 100%;height: 100%;background: #000;opacity: 0.8;z-index: 1000000;';
    let imgDiv = document.createElement("div");
    imgDiv.setAttribute('class','imgDiv');
    imgDiv.style.cssText = 'position: fixed;top: 15%;left: 0;margin: 0 auto;z-index: 10000000000;width: 100%;text-align: center;';
    let imgobj = document.createElement("img");
    imgobj.style.cssText = 'width:70%;height:70%;';
    imgobj.setAttribute('src',imgStr);
    imgDiv.appendChild(imgobj);
    util.docu.appendChild(imgDiv);
    util.docu.appendChild(maskDiv);
    let closeMaskObj = document.getElementsByClassName("maskDiv")[0];
    let closeImgObj = document.getElementsByClassName("imgDiv")[0];
    closeMaskObj.onclick = function(){
        util.closeMask(0);
    }
    closeImgObj.onclick = function(){
        util.closeMask(0);
    }
}

/*
* str提示框文本内容
*/
util.timer = null;
util.tixingSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyMTE3NEIwMzY0QUIxMUU4QTE0QUYzNERFQTIxRjI5QSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyMTE3NEIwNDY0QUIxMUU4QTE0QUYzNERFQTIxRjI5QSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIxMTc0QjAxNjRBQjExRThBMTRBRjM0REVBMjFGMjlBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjIxMTc0QjAyNjRBQjExRThBMTRBRjM0REVBMjFGMjlBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+lUO6nwAABAVJREFUeNrUWt1LVFEQP17MrIyozXIh6UPJ2gI/qoVAcO0xP4j+AN+jj/9EH8R96KHS8rleizINITENUinpg6BUInF1KdcgMJsTc212OLvuvXfOujvwY+/ej5n53XPOnHPnTKmSlZOAVkA9Hp8AHATsxes/AUuAz4APgCnAMB4XjDQCegBzgA2fmEcdjdtFogTQARgLQCITxlB3iV/HvMoFQBx/M0kCMAv4BFgEpNDZCsAhQC3gNCCURccE4Dr+WpFyQB9g3fBW/wBGAbcAEQ86I/jMKOrgetfRZrk0mVM4gLnBNTRYI2CjBnWtGey8QR9EpAWwYmiRAUDYQk8Io27eYsuA5qDK2wC/DBEplofAE0NbvEdcDqIwxRQ+xnklX6JtPWE+pLDXeB4zSaboHqB0G6YIbbOf+ZL0MqZ2GQLAoM8Qr53Zz7DT5/QyyHyaQl+3lD724BCgzOfbbTZErGs+dZWhL1RXXy6TJp1n5gKOGUlC7piaY/NUNFuzTrDQHDSaSRNygxUN6ROZhkM7M3xfYEDbIKRwnqI62003vWTxPlzAhMJsRTHuXnDwtwFwkTxwF/BNFa5o3+6Q/1HksEmoi1zU/bNbFb50o6/KwCEtcgwLGj1n6HJdgvqHWET+10J1gCPkpoeCBpOGc0uC+h+RY82hzsEcAJXnlgklBPXz3hRzsFtQY+8sE1oW1P+WvaAmt8u5Mov9UUrWMdNji5Dr8+aiWhOqJic+WohGy4xgQlg/9bnaYYmKJQuEkhZbh/tc6ZAkoDJ0j2IgRH2ucPIwAdomROW3wxlaMLJCjhct6E/rYQ4bpJVF2EL0e+2Hg5kVV2qLkBD1eUETek9ORHzmDnIllLBAiGZqZzWhSXIipLylcr0Skp4WzrBp57VjWA9dshgUpFuIpwhG3C63QE5eKaIxdJUcz9Ph08MyKceL4APvmErPUPXQiw3KY76rAKSX+dzAbxi3kCSxJRmTJFQ6GOMBAcN7AE8Zzgro5WmsDtNNNhKN+ww5haB7PDGVnmiczDZ3RpVsKliakPblq8oxFexKnDnwTPlP1ksSMiXr47k8uBswrWS2U/R2x20GP+tF03bKNPqak5g2vHSue8c2RDRt84EKsOFFl0CmLclQHsmE0Cbfkmz1q9C0aawHZUseyLSwALCBvrRJKDZt6/cDqiwQqULdfFt/RfJF6v46o8yFF3oJIlV40avMhRczSrDwwpVyDJOZSmNeAG4q76UxN/DZTKUxceWhNMZPKI6ikfNZ7qHFS98BqyQJcxhbI7JFgNErAF289Cof0Ue/iE5lr7ys00IqIGdxCwDnVfACwCaJNy0pdbh4rMfjo4AD6n++bxW/Wr/g16UunhhhiZpA8leAAQBBuuszLdZWJgAAAABJRU5ErkJggg==';
util.chenggongSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0QTU0OTVEMzY0QUMxMUU4OENDOEY4NzRGQjVBRjlBRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0QTU0OTVENDY0QUMxMUU4OENDOEY4NzRGQjVBRjlBRiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjRBNTQ5NUQxNjRBQzExRTg4Q0M4Rjg3NEZCNUFGOUFGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjRBNTQ5NUQyNjRBQzExRTg4Q0M4Rjg3NEZCNUFGOUFGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+5/3LpgAAA8pJREFUeNrcWs1OFEEQLsGAmkXF6E3QxD8Ospp4IB6MeoSV9Y7xqkaBR/AJCLIkHngCr3DSBA+SiGA0YEw4SABZwIsBJCo/JsBahTXYW/Ts9s5Mz8xSyZdMZqer6pvtqaru6oMQrFxE3ERc5etziJOIGv79F2IRMY2YRHxCDPF1bKQR0Y3IInIekWUdyahIHEC0IIZ9kHAD6UyxjVDkGmLEwLFNnlofEa8Rg3w9zb8VGz/CtqzJIcQzxJaLA2uIAUQnT53qArqq+ZlOHrPmopNsZdh2oHIBMe5idALxEHHUh/4a1jHhYmOcfQhEriOWNEYWEPcQFQG+uArWuaCxt8S++JJmxKpQvI3oRSQsTu8E29gWtlfZJ0/SpCGzjEiHGE3vsk1JqqlURec5AaqKZhENEaSIBrYtp5/xN0URaEwomEeciTB517MPqk9jRSLprmTEwBWuBuJQkawI3zImSXNTBIA0xEfSIlBsFkq+VGq8F2+gF+InPZqKQlsmpTR5JhFDQglNnkrpHnwrHmqD+EqbpqDNk6R4gNYnlRE5e9jgmUr2UfX5Cihly30xoJsLw7DlMeIz4nSR57bYR1XyOKhzcgNRGxEZJ4JNGZCqZV/VXLkjl8VfNxAxGQcvDMb1izG07N8p29WbHTEgM4o4ZjC2Q4x7QDf7dB9XGZAB9lUd+xx410XNvFURkhkpgYxTd6qVDS314atyY6aMyDgyI/3/qdx4V6IyCih1JY55EiAZYJ8dPbTvl6f4ZYlkvvMuTl1EZEheCX2eCDUyGWecCSkbZCShP16nXAsPzhmSskVGTrlFP0HhjiEpm2SAbar2fYVtN1L1IZGpEmF7KIjE6kbqqWUyusTapyt92j0o1pHKWSYD7Oue0kcWp/0elacKkLJBxrU4JfkW0PJBR8oWGdflA0mXcOKRD0NEat0yGWAfVZ+7Cn1cfpfgpxA3EEcskaGV9pdiwWx4P22SlNs21rzJNpZuo7GnnDcaSXRbwa0xItMKJWwFO7KvNutJqEGra6fUR0jGrZ1i3EymZpLsnM0iLkVARtfw+qFWBaaia0kucd0WlqRgb8PaU0tSXcitw96mcQbsN40zmmqdfGn2q/y2Zvo535Wttv6cxt4y+xKIFDp4MclLED/74cdZxySEcPBCjX6U1NyOxmxwOU/bs8kiK98qDsPtPGYDQj4aI5PvKJgdXqIuwgf4d3BpkK+nwOzw0ihYPrwky6QU7JPjZboM7vcA4BwEdAAw6LdAye4W/D+ieRZxQgnxvzlaZXk9Q0c030CARzT/CjAA9SKfrESAPj8AAAAASUVORK5CYII=';
util.viewPopup = function(str,type){//系统提示弹窗
    let maskDiv=document.createElement("div");
    maskDiv.setAttribute('class','maskDiv');
    maskDiv.style.cssText = 'position: fixed;top: 0;left: 0;display: block;width: 100%;height: 100%;background: #000;opacity: 0.3;z-index: 1000000;';
    let popupDiv = document.createElement("div");
    popupDiv.setAttribute('class','popupDiv');
    popupDiv.style.cssText = 'position: fixed;top: 30%;left: 0;z-index: 10000000000;text-align: center;font-size: .14rem;width: 100%;';
    let baohanDiv = document.createElement("div");
    baohanDiv.style.cssText = 'width: 50%;margin: 0 auto;padding: .15rem;background: #fff;border-radius: .15rem;';
    let baohanI = document.createElement("i");
    if(type && type==1){
        baohanI.style.cssText = 'display: block;width: .27rem;height: .27rem;margin: 0 auto;border-radius: .27rem;margin-bottom: .15rem;text-align: center;background:url('+util.chenggongSrc+') no-repeat;background-size:27px;';
    }else{
        baohanI.style.cssText = 'display: block;width: .27rem;height: .27rem;margin: 0 auto;border-radius: .27rem;margin-bottom: .15rem;text-align: center;background:url('+util.tixingSrc+') no-repeat;background-size:27px;';
    }
    baohanDiv.appendChild(baohanI);
    let baohanP = document.createElement("p");
    baohanP.innerHTML = str;
    baohanDiv.appendChild(baohanP);
    popupDiv.appendChild(baohanDiv);
    util.docu.appendChild(popupDiv);
    util.docu.appendChild(maskDiv);
    let closeMaskObj = document.getElementsByClassName("maskDiv")[0];
    let closePopupObj = document.getElementsByClassName("popupDiv")[0];
    closeMaskObj.onclick = function(){
        util.closeMask(1);
    }
    closePopupObj.onclick = function(){
        util.closeMask(1);
    }
    util.timer = window.setTimeout(function(){
        util.closeMask(1);
    },2000);
}
util.closeMask = function(type){
    if(type == 0){
        let closeMaskObj = document.getElementsByClassName("maskDiv")[0];
        let closeImgObj = document.getElementsByClassName("imgDiv")[0];
        if(closeImgObj){
            util.docu.removeChild(closeMaskObj);
            util.docu.removeChild(closeImgObj);
        }
    }else if(type == 1){
        let closeMaskObj = document.getElementsByClassName("maskDiv")[0];
        let closePopupObj = document.getElementsByClassName("popupDiv")[0];
        if(closePopupObj){
            util.docu.removeChild(closeMaskObj);
            util.docu.removeChild(closePopupObj);
        }
    }
}























