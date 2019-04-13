<template>  
  <div class="canvasObj">  
    <canvas class="yuan" width="50px;" height="50px" style="position:absolute;top:0;right:0;z-index:100;"></canvas>
    <canvas class="yuans" width="50px;" height="50px" style="position:absolute;top:0;right:0;z-index:1000;"></canvas>	
  </div>  
</template>  
  
<script>  
import {MessageBox} from 'mint-ui'
import axios from 'axios'
import util from '@/libs/util' 
export default {  
  name: 'coupons',  
  data() {  
    return {  
      
    };  
  },
  props:{
  	dataBili:Number,
  },
  methods:{

    canvasyuan(){
    	let canvas = document.getElementsByClassName('yuan');
      let cxt=canvas[0].getContext("2d");
      cxt.beginPath();
      cxt.arc(25,25,23,0,1*Math.PI,false);
      cxt.lineWidth=3;
      cxt.strokeStyle="rgba(255,255,255,0.5)";
      cxt.stroke();//画空心圆
      cxt.closePath();
   //  	for(let i=0;i<canvas.length-1;i++){
   //  		console.log(canvas[i]);
   //  		let cxt=canvas[i].getContext("2d");
   //  		cxt.beginPath();
			// cxt.arc(25,25,23,0,360,false);
			// cxt.lineWidth=1;
			// cxt.strokeStyle="#fff";
			// cxt.stroke();//画空心圆
			// cxt.closePath();
   //  	}
    },
    huayuan(){
    	let canvass = document.getElementsByClassName('yuans');
      let cxts=canvass[i].getContext("2d");
      cxts.beginPath();
      cxts.arc(25,25,23,0,0.5*Math.PI,1);
      cxts.strokeStyle="red";
      cxts.lineWidth=3;
      cxts.stroke();//画空心圆
      cxts.closePath();
   //  	for(let i=0;i<canvas.length-1;i++){
   //  		let cxts=canvass[i].getContext("2d");
   //  		cxts.beginPath();
			// cxts.arc(25,25,23,0,0.5*Math.PI,1);
			// cxts.strokeStyle="#fff";
			// cxts.lineWidth=3;
			// cxts.stroke();//画空心圆
			// cxts.closePath();
   //  	}
    }
  },
  created(){
  	
  },
  mounted(){
    this.canvasyuan();
  },
  beforeRouteUpdate(to,from,next){
    
  },
  beforeUpdate(){
    
  },
  watch:{
  	dataBili(){
  		this.canvasyuan();
    	this.huayuan();
  	}
  }

};  
</script>  
  
<style lang="less">   
	.canvasObj{
    background:#000;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style> 