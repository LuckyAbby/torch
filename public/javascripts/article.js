//封装获取id的函数
function $(id) {
  return document.getElementById(id);
}


//封装添加事件的函数
function addEventHandler(element,type,handler) {
  //DOM2级方法
  if(element.addEventHandler) {
    element.addEventHandler(type,handler,false);
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


//以浏览器兼容形式初始Ajax
function initAjax() {
var xmlHttp=false;
if(window.XMLHttpRequest)
xmlHttp=new XMLHttpRequest();
else if(window.ActiveXObject){
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

var commentBtn=$('comment');
var clearBtn=$('clear');
//向后台传入评论
function comment() {
  var content=$('commit_content').value;
  var url=location.href;
  var article_id=url.substring(url.indexOf("=")+1,url.length);
  var data={
    comment_content:content,
    article_id:article_id,
  };
  if(content) {
    var xmlHttp=initAjax();
    xmlHttp.open('POST','/users/comment',true);
    xmlHttp.onreadystatechange=function() {
      if(xmlHttp.readyState===4) {
        if(xmlHttp.status===200) {
          var obj=JSON.parse(xmlHttp.responseText);
          if(obj['code']===1001) {
            return alert('请您先登录再进行评论');
          }
          if(obj['code']===0) {
           $('commit_content').value="";
           window.location.reload();
          }
        }
      }
    }
    xmlHttp.setRequestHeader("Content-Type","application/json");
    xmlHttp.send(JSON.stringify(data));
  }
  else {
    alert("请输入评论");
  }

}


addEventHandler(commentBtn,'click',comment);
addEventHandler(clearBtn,'click',function() {
  $('commit_content').value="";
})
