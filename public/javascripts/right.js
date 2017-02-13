//封装函数
function $(id) {
  return document.getElementById(id);
}


//封装绑定事件的函数
function addEventHandler(ele,type,handler) {
  if(ele.addEventListener) {
    ele.addEventListener(type,handler,false);
  }
  else if(element.attachEvent) {
    ele.attachEvent("on"+type,handler);
  }
  else {
    ele["on"+type]=handler;
  }
}

function initAjax() {
  var xmlHttp=false;
  if(window.XMLHttpRequest) {
    xmlHttp=new XMLHttpRequest();
  }
  else if(window.ActiveXObject) {
    try{
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

function getRight() {
  var xmlHttp=initAjax();
  xmlHttp.open("GET","/right",true);
  xmlHttp.onreadystatechange=function() {
    if(xmlHttp.readyState===4) {
      if(xmlHttp.status===200) {
        var obj=JSON.parse(xmlHttp.responseText);
        
      }
    }
  }

}
