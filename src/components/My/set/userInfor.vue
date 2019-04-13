<template>  
  <div class="set">  
    <headers v-if="$store.state.titleShow" :headerType='2' :headerStr="'设置'"></headers>
    <div class="user" :style="$store.state.titleShow?'margin-top:.5rem':''">
      <p class="userName"><em>头像</em> 
        <img v-if="imgShow" src="../../../assets/images/my/homepage/my_gray@2x.png" alt="">
        <img v-if="!imgShow" :src="headimgUrl" alt="">
        <input id="upload"  class="oneAdd" type="file" accept="image/*;" capture="camera" @change="paizhao('#upload','#img',$event)" style="">
      </p>
      <p class="userName">
        <em>昵称</em>
        <input type="text" v-model="nickName" style="font-size:.15rem;">
      </p>
      <p class="userGender">
        <em>性别</em>
        <select name="sex" id="sex" style="font-size:.15rem;text-aline:right;">
          <option value="1" :selected="sex==1?'selected':''">男</option>
          <option value="2" :selected="sex==2?'selected':''">女</option>
        </select>
      </p>
      <p class="userBirthday">
        <em>生日</em>
        <el-date-picker v-model="value1" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini"></el-date-picker>
      </p>
      <p>
        <em>手机号</em>
        <span>{{phoneNo}}</span>
      </p>
      <p>
        <em>微信</em>
        <span>{{wechatNickName}}</span>
      </p>
      <p>
        <em>QQ</em>
        <span>{{qqNickName}}</span>
      </p>
      <!-- <p>
        <em>支付宝</em>
        <span>{{zhifupay}}</span>
      </p> -->
    </div>
    <button @click.stop="addUser" class="footer_button">保存</button>
  </div>  
</template>  
  
<script> 
import headers from '../../headers.vue'  
import {Toast,MessageBox} from 'mint-ui'
import axios from 'axios'
import util from '@/libs/util' 
export default {  
  name: 'set',  
  data() {  
    return {  
      imgShow:true,
      headimgUrl:'',//头像地址
      phoneNo:'',//手机号
      nickName:'',//昵称
      sex:'',//性别代码
      birthday:'',
      wechatNickName:'关联',
      qqNickName:'关联',
      zhifupay:'关联',
      value1:'',
    };  
  },
  components:{
    headers:headers,
  },
  methods:{
    paizhao(c,d,e){
      let name = e.currentTarget.files[0].name;
      let that = this;
      var $c = document.querySelector(c),file = $c.files[0],reader = new FileReader(),$d = document.querySelector('#imgs');
      reader.readAsDataURL(file);
      reader.onload = function(e){
        that.imgShow = false;
        that.headimgUrl = e.target.result;
        that.uploadImg(e.target.result,name);
      };
    },
    uploadImg(str,name){
      let that =this;
      let data = {
        "fileData":str, //(描述：图片base64转码字符串、类型：String、是否必填：Y)
        "fileName": name,//(描述：文件名称、类型：String、是否必填：Y)
        "type": 1//(描述：上传类型 1 用户头像 2 订单评价 3 售后图片、类型：Integer、是否必填：Y)
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/common/upload"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          that.headimgUrl = response.data.body;
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
  	ajaxUserInfor(){//请求客户个人信息
      let that =this;
      let data = {};
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/customer/info"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          that.imgShow = false;
          that.headimgUrl = response.data.body.headimgUrl;//user头像
          that.nickName = response.data.body.nickName;//user昵称
          that.phoneNo = response.data.body.phoneNo;//user昵称
          that.sex = response.data.body.sex;//user性别
          if(response.data.body.birthday && response.data.body.birthday!=''){
            that.value1 = response.data.body.birthday;//user生日
          }
          if(response.data.body.wechatNickName && response.data.body.wechatNickName!=''){
            that.wechatNickName = response.data.body.wechatNickName;//user微信昵称
          }
          if(response.data.body.qqNickName && response.data.body.qqNickName!=''){
            that.qqNickName = response.data.body.qqNickName;//userQQ昵称
          }
        }else{
          that.imgShow = true;
          MessageBox('系统提示',response.data.message);
        }
        response.data.body
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
    addUser(){//更改客户个人信息
      let that =this;
      let  myselect=document.getElementById("sex");
      let index=myselect.selectedIndex ;
      let data = {
        "headimgUrl": that.headimgUrl, //(描述：第三方平台用户id 、类型：String、是否必填：N)
        "nickName": that.nickName, //(描述：第三方平台用户昵称 、类型：String、是否必填：N)
        "birthday": that.value1, //(描述：生日 、类型：String、是否必填：N)
        "sex": myselect.options[index].value //(描述：性别 、类型：Integer、是否必填：N)
      };
      let urlStr = util.getpost(data);
      axios({
        method:"post",
        url:"/customer/updateInfo"+urlStr,
        dataType: 'json',
        data:data,
      }).then(response => {
        if(response.data.status == 0){
          Toast('更改成功');
          that.$router.go(-1);
        }else{
          MessageBox('系统提示',response.data.message);
        }
        response.data.body
      }).catch(oData => {
        MessageBox('系统提示',oData.data.message);
      })
    },
  },
  created(){
    this.ajaxUserInfor();
    util.setTitle('设置');
    let viewStr = util.webview();
    if(viewStr == 'other'){
      this.$store.commit('titleShowFunc',true);
    }else{
      this.$store.commit('titleShowFunc',false);
    }
  }  
};  
</script>  
  
<style lang="less" scoped>   
.set{
  width: 100%;
  height: 100%;
  font-size: .15rem;
  .user{
    width: 100%;
    p{
      background: #fff;
      padding-right: .3rem;
      height: .53rem;
      line-height: .53rem;
      text-align: right;
      color: #ccc;
      border-bottom: 1px solid #ececec;
      position: relative;
      &::after{
        content: '';
        display: inline-block;
        width: .08rem;
        height: .08rem;
        border-style: solid;
        border-width: 1px 1px 0 0;
        border-color: #999;
        transform: matrix(.71,.71,-.71,.71,0,0);
        position: absolute;
        top: 41%;
        right: 5%;
      }
      em{
        padding-left: .1rem;
        text-align: left;
        float: left;
        display: inline-block;
        width: .6rem;
        height: .53rem;
        line-height: .53rem;
        color: #333;
      }
    }
    .userName{
      font-size: .15rem;
      img{
        display: inline-block;
        width: .3rem;
        height: .3rem;
        position: absolute;
        top: 20%;
        right: .3rem;
        border-radius: .3rem;
      }
      #upload{
        width: 0.3rem;
        height: 0.3rem;
        opacity: 0;
        position: absolute;
        top: 20%;
        right: .3rem;
        z-index: 1000;
      }
      select{
        font-size: .15rem;
      }
    }
    .userName{
      input{
        color: #ccc;
        text-align: right;
        height: 100%;
      }
    }
    .userGender{
      height: 100%;
    }
    .userBirthday{
      .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width: 1.33rem !important;
      }
    }
  }
  .footer_button{
    width: 100%;
    height: .5rem;
    background-color: #CEA63F;
    color: #fff;
    font-size: .15rem;
    line-height: .5rem;
    position: fixed;
    bottom: 0;
    left: 0;
    border:none;
  }
}
	
</style> 