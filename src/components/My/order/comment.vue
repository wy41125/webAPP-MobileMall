<template>  
  <div class="comment"> 
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'评价晒单'"></headers>
    <div class="goods" :style="$store.state.titleShow?'margin-top:.4rem':''">
      <img :src="item" alt="" v-for="item in goodImgs">
      <p v-if="goodImgs.length<2">{{goodNames[0]}}</p>
    </div>
    <p class="keduan"></p>
    <div class="comment_div">
      <h3 >为商品进行评价</h3>
      <p class="star">
        <span v-for="item in 5" @click.stop="clickStar(item)" :class="item<=starNum?'active':''"></span>
      </p>
      <textarea name="" id="" cols="30" rows="10" placeholder="写下您的购买体会" maxlength="300" v-model="textvalue"></textarea>
      <div class="addImg">
        <p style="position: relative;padding:0 .08rem;">
          <img class="oneAdd" src="../../../assets/images/order/add_background@2x.png" alt="" @click.stop="addInput">
          <input id="upload"  class="oneAdd" type="file" accept="image/*;" capture="camera" @change="paizhao('#upload','#img',$event)" style="width: .74rem;height: .74rem;border:1px dashed #aaa;background: url('../../../assets/images/order/add_background@2x.png') no-repeat;background-size: .74rem;opacity:0;position: absolute;top: 0;left: 0;">
        </p>
        <p id="imgs" style="padding:0 .08rem;">
           <span v-for="(img,index) in dataUrl"><img class="addImg" :src="img" alt=""><i @click.stop="deleteImg(index)"></i></span>
        </p>
      </div>  
    </div>
    <button @click.stop="ajaxqingqiu" style="border:0px solid #ddd;">发表</button>
  </div>   
</template>  
  
<script>  
import headers from '../../headers.vue'
import {Toast,MessageBox} from 'mint-ui'
import axios from 'axios'
import util from '@/libs/util' 
export default {  
  name: 'comment',  
  data() {  
    return {  
      showGood:true,//单个商品
      goodImgs:[],
      goodNames:[],
      starNum:0,
      orderId:null,
      textvalue:null,
      dataUrl:[],
    };  
  },
  components:{
    headers:headers,
  },
  methods:{
    deleteImg(i){//删除图片数组
      this.dataUrl.splice(i, 1);
    },
    paizhao(c,d,e){
      let name = e.currentTarget.files[0].name;
      let that = this;
      var $c = document.querySelector(c),file = $c.files[0],reader = new FileReader(),$d = document.querySelector('#imgs');
      reader.readAsDataURL(file);
      reader.onload = function(e){
        // let Img = document.createElement("img");
        // Img.setAttribute("src", e.target.result);
        // Img.setAttribute("style", 'display: inline-block;width: .74rem;height: .74rem;margin-right:.1rem;');
        // Img.className = 'addImg';
        // let dom = document.getElementById("imgs").getElementsByTagName("img");
        // if(dom.length<6){
        //   $d.appendChild(Img);
          that.uploadImg(e.target.result,name);
        // }else{
        //   Toast('亲，最多添加6张哦！');
        // }
      };
    },
    uploadImg(str,name){
      let that =this;
      let data = {
        "fileData":str, //(描述：图片base64转码字符串、类型：String、是否必填：Y)
        "fileName": name,//(描述：文件名称、类型：String、是否必填：Y)
        "type": 2//(描述：上传类型 1 用户头像 2 订单评价 3 售后图片、类型：Integer、是否必填：Y)
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/common/upload"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          let input = document.getElementById('upload');   
          input.outerHTML=input.outerHTML;
          if(that.dataUrl.length<6){
            that.dataUrl.push(response.data.body);
          }else{
            Toast('亲，最多添加6张哦！');
          }
        }else{
          if(response.data.status = 499){//token失效或没有token
            util.outLogin();
            that.$router.push({name:'signInPage',query:{outLogin:'/'}});
          }else{
            MessageBox('系统提示',response.data.message);
          }
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
    clickStar(i){
      this.starNum = i;
    },
    ajaxqingqiu(){
      let that =this;
      if(that.starNum==0){
        Toast('请评分！');
        return;
      }
      let data = {
        "orderId":that.orderId,
        "content":that.textvalue,
        "goodsStarLevel":that.starNum, 
        "commentPictureAddr":"",
        "fromType":3
      };
      if(that.dataUrl.length>0){
        data.commentPictureAddr = that.dataUrl.join(',');
      }
      console.log(data);
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/order/orderComment"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          Toast('评价成功！');
          that.$router.go(-1);
        }else{
          if(response.data.status = 499){//token失效或没有token
            util.outLogin();
            that.$router.push({name:'signInPage',query:{outLogin:'/'}});
          }else{
            MessageBox('系统提示',response.data.message);
          }
        }
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
  },
  created(){
    util.setTitle('评价晒单');
    if(this.$route.query.type == 1){
      let obj = JSON.parse(decodeURIComponent(this.$route.query.orderObj));
      this.goodImgs = obj.imgStrArr;
      this.goodNames = obj.goodNameStrArr;
      this.orderId = obj.orderId;
      // this.goodImgs =['http://file.cdn.xiaohongquan.cn/20161024/3b1dc185fed10ecfe97d2cdc12a65e39.jpg'];
      // this.goodNames =['苹果 iPhone6S 64G 金 全网通版'];
    }else{
      let obj = JSON.parse(decodeURIComponent(this.$route.query.orderObj));
      this.orderId = obj.orderId;
      for(let i in obj.details){
        if(obj.details[i].packageDetails){
          for(let b in obj.details[i].packageDetails){
            this.goodImgs.push(obj.details[i].packageDetails[b].imgUrl);
            this.goodNames.push(obj.details[i].packageDetails[b].goodsName);
          }
        }else{
          this.goodImgs.push(obj.details[i].imgUrl);
          this.goodNames.push(obj.details[i].goodsName);
        }
      }
    }
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
  }, 
};  
</script>  
  
<style lang="less" scoped>   
  .comment{
    width: 100%;
    height: 100%;
    background: #fff;
    font-size: .14rem;
    .goods{
      text-align: left;
      padding: .15rem .1rem;
      background: #fff;
      // height: .9rem;
      img{
        display: inline-block;
        width: .65rem;
        height: .65rem;
        vertical-align: middle;
        // border:1px solid #ddd;
      }
      p{
        display: inline-block;
        margin-left: .1rem;
      }
    }
    .keduan{
      width: 100%;
      height: .1rem;
      background-color: #ececec;
    }
    .comment_div{
      padding: .15rem .1rem;
      margin-bottom: .4rem;
      text-align: center;
      h3{
        font-weight: normal;
        margin: .1rem 0 .05rem 0;
      }
      .star{
        margin: .05rem 0 .05rem 0;
        span{
          display: inline-block;
          width: .28rem;
          height: .25rem;
          background: url('../../../assets/images/order/evaluation_star_gray@2x.png') no-repeat;
          background-size: 100% 100%;
          &.active{
            background: url('../../../assets/images/order/evaluation_star@2x.png') no-repeat;
            background-size: 100% 100%;
          }
        }
      }
      textarea{
        margin: .05rem 0 .1rem 0;
        width: 95%;
        background-color: #F8F8F8;
        border:none;
        font-size: .14rem;
      }
      .addImg{
        text-align: left;
        .oneAdd{
          width: .74rem;
          height: .74rem;
          border:1px dashed #aaa;
        }
      }
      #imgs{
        margin-top: .08rem;
        span{
          display: inline-block;
          position: relative;
          width: .74rem;
          height: .74rem;
          margin-right:.1rem; 
          .addImg{
            display: inline-block;
            width: 100%;
            height: 100%;
          }
          i{
            display: inline-block;
            width: .14rem;
            height: .14rem;
            background: url(../../../assets/images/close@2x.png) no-repeat;
            background-size: .14rem;
            position: absolute;
            top: -.07rem;
            right: -.07rem;
          }
        }
      }
    }
    button{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: .5rem;
      color: #fff;
      background: #CDA63F;
      line-height: .5rem;
      font-size: .16rem;
    }
  }
</style> 





















