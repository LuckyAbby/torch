// 封装获取id的函数
function $(id) {
  return document.getElementById(id);
}


// 封装添加事件的函数
function addEventHandler(element,type,handler) {
  //DOM2级方法
  if(element.addEventListener) {
    element.addEventListener(type,handler,false);
  }
  //兼容IE
  else if(element.attachEvent) {
    element.attachEvent("on"+type,handler);
  }
  //DOM0级方法
  else {
    element["on"+type]=handler;
  }
}


//获取非行间样式的函数
function getStyle(obj,name)
	{
		if(obj.currentStyle){
      return obj.currentStyle[name];//Ie浏览器用的获取非行间样式的方法
    }
		else {
      return getComputedStyle(obj,null)[name];//FF以及谷歌获取非行间样式的方法
    }
	}


//以浏览器兼容形式初始Ajax
function initAjax() {
  var xmlHttp=false;
  if(window.XMLHttpRequest)
    xmlHttp=new XMLHttpRequest();
    else if(window.ActiveXObject){
      try{
        //兼容IE5 6
        xmlHttp=new ActiveXObject("Msxm12.XMLHTTP");
      }catch(e){
      try {
        xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
      }catch(e){
        window.alert("该浏览器不支持Ajax");
      }
    }
  }
  return xmlHttp;
}
