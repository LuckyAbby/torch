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
            alert('请您先登录再进行评论');
            window.location.href='http://localhost:3004/';
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


var supportFlag=false;
//点赞的函数
function support() {
  var url=location.href;
  var article_id=url.substring(url.indexOf("=")+1,url.length);
  var data = {
    article_id:article_id,
    support:true,
  }
  var xmlHttp=initAjax();
  xmlHttp.open('POST','/users/support',true);
  xmlHttp.onreadystatechange=function (){
    if(xmlHttp.readyState===4) {
      if(xmlHttp.status===200) {
        var obj=JSON.parse(xmlHttp.responseText);
        if(obj['code']===1001) {
          alert('请您先登陆再评论');
          window.location.href="http://localhost:3004";
        }
        if(obj['code']===0) {
          $('praise_img').src="/images/article/praised.jpg";
          supportFlag=true;
          $('supportCount').innerHTML=obj['supportCount'];
        }
      }
    }
  }

  xmlHttp.setRequestHeader("Content-Type","application/json");
  xmlHttp.send(JSON.stringify(data));
}


//取消点赞的函数
function cancelSupport() {
  var url=location.href;
  var article_id=url.substring(url.indexOf("=")+1,url.length);
  var data = {
    article_id:article_id,
    support:false,
  }
  var xmlHttp=initAjax();
  xmlHttp.open('POST','/users/support',true);
  xmlHttp.onreadystatechange=function (){
    if(xmlHttp.readyState===4) {
      if(xmlHttp.status===200) {
        var obj=JSON.parse(xmlHttp.responseText);
        if(obj['code']===1001) {
          alert('请您先登陆再评论');
          window.location.href="http://localhost:3004";
        }
        if(obj['code']===1) {
          $('praise_img').src="/images/article/praise.jpg";
          supportFlag=false;
          $('supportCount').innerHTML=obj['supportCount'];
          // console.log('supportFlag',supportFlag);
        }
      }
    }
  }
  xmlHttp.setRequestHeader("Content-Type","application/json");
  xmlHttp.send(JSON.stringify(data));
}


//加载页面的时候就显示出评论的数目
// function displayCount() {
//   var url=location.href;
//   var article_id=url.substring(url.indexOf("=")+1,url.length);
//   var data = {
//     article_id:article_id,
//     support:false,
//   }
//   var xmlHttp=initAjax();
//   xmlHttp.open('POST','/users/support',true);
//   xmlHttp.onreadystatechange=function (){
//     if(xmlHttp.readyState===4) {
//       if(xmlHttp.status===200) {
//         var obj=JSON.parse(xmlHttp.responseText);
//         if(obj['code']===1001) {
//           alert('请您先登陆再评论');
//           window.location.href="http://localhost:3004";
//         }
//         if(obj['code']===1) {
//           $('praise_img').src="/images/article/praise.jpg";
//           supportFlag=false;
//           $('supportCount').innerHTML=obj['supportCount'];
//           // console.log('supportFlag',supportFlag);
//         }
//       }
//     }
//   }
//   xmlHttp.setRequestHeader("Content-Type","application/json");
//   xmlHttp.send(JSON.stringify(data));
// }


addEventHandler(commentBtn,'click',comment);
addEventHandler(clearBtn,'click',function() {
  $('commit_content').value="";
});
addEventHandler($('praise_img'),'click',support);
addEventHandler($('praise_img'),'click',function() {
  if(supportFlag===false) {
    support();
  }
  else {
    cancelSupport();
  }
});
