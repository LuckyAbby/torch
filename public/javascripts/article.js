//封装获取id的函数
function $(id) {
  return document.getElementById(id);
}


//封装添加事件的函数
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
		if(obj.currentStyle)
		return obj.currentStyle[name];//Ie浏览器用的获取非行间样式的方法
		else
		return getComputedStyle(obj,null)[name];//FF以及谷歌获取非行间样式的方法
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
            window.location.href='/';
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
var supportCount=$('supportCount');
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
          alert('请您先登陆再点赞');
          window.location.href="/";
        }
        if(obj['code']===0) {
          $('praise_img').src="/images/article/praised.jpg";
          supportFlag=true;
          supportCount.innerHTML=parseInt(supportCount.innerHTML)+1;
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
          alert('请您先登陆再点赞');
          window.location.href="/";
        }
        if(obj['code']===0) {
          $('praise_img').src="/images/article/praise.jpg";
          supportFlag=false;
            supportCount.innerHTML=parseInt(supportCount.innerHTML)-1;
        }
      }
    }
  }
  xmlHttp.setRequestHeader("Content-Type","application/json");
  xmlHttp.send(JSON.stringify(data));
}


// 加载页面的时候就显示出点赞的数目
function displaySupportCount() {
  var url=location.href;
  var article_id=url.substring(url.indexOf("=")+1,url.length);
  var xmlHttp=initAjax();
  xmlHttp.open('GET','/users/supportCount?article_id='+article_id,true);
  xmlHttp.onreadystatechange=function (){
    if(xmlHttp.readyState===4) {
      if(xmlHttp.status===200) {
        var obj=JSON.parse(xmlHttp.responseText);
        if(obj['code']===1001) {
          alert('请您先登陆再点赞');
          window.location.href="/";
        }
        if(obj['status']===0) {
          console.log("11111");
          $('praise_img').src="/images/article/praise.jpg";
          supportFlag=false;
        }
        else {
          $('praise_img').src="/images/article/praised.jpg";
          supportFlag=true;
        }
        if(obj['code']===0) {
          supportCount.innerHTML=obj['supportCount'];
        }
      }
    }
  }
  xmlHttp.send(null);
}


// 添加emoj到emoj_container的函数
function showEmoj() {
 var docFragment=document.createDocumentFragment();
 for(var i=1;i<70;i++) {
   var imgItem=document.createElement('img');
   imgItem.src="/images/article/emoj/"+i+".gif";
   imgItem.title=i;
   docFragment.appendChild(imgItem);
 }
$('emoj_choose').appendChild(docFragment);
}


// 将emoj显示到评论区域中
function displayEmoj(s) {
  var reg=/\[emoj:\d+\]/g;
  var result=s;
  var match;
  var allEmojs=$('emoj_choose').children.length;
  while(match=reg.exec(s)) {
    var emojItem=match[0].splice(7,-1);
    if(emojItem<allEmojs) {
      s.replace(match[0],'<img src=/images/article/emoj/'+emojItem+'.gif>');
    }
    else {
      result=s;
    }
  }
  return result;
}


// 显示出回复评论的div
// function displayCommentArea() {
//   var textarea=$('commit_content').cloneNode(false);
//   var comment_choose=$('comment_choose').cloneNode(true);
//
// }


window.onload=function() {
  displaySupportCount();
  showEmoj();
  var tools=document.getElementsByClassName('tool');
  var reply_containers=document.getElementsByClassName('reply_comment_container');
  for(var i=0;i<tools.length;i++) {
    addEventHandler(tools[i],'click',function() {
      console.log("执行到这里了");
      var textarea=$('commit_content').cloneNode(false);
      var comment_choose=$('comment_choose').cloneNode(true);
console.log(i);
        reply_containers[i].appendChild(textarea);
        reply_containers.appendChild(comment_choose);
    })
  }
  addEventHandler($('emoj'),'click',function () {
    var display=getStyle($('emoj_choose'),"display");
    console.log(display);
    if(display=="none") {
      $('emoj_choose').style.display="block";
    }
    else {
      $('emoj_choose').style.display="none";
    }
  });

  addEventHandler($('emoj_choose'),'click',function(e) {
    var target=e.target;
    var commit_content=$('commit_content');
    if(target.nodeName.toLowerCase()==="img") {
       commit_content.focus();
       commit_content.value=commit_content.value+"[emoj:"+target.title+"]";
    }
  })


  addEventHandler(commentBtn,'click',comment);
  addEventHandler(clearBtn,'click',function() {
    $('commit_content').value="";
  });
  addEventHandler($('praise_img'),'click',function() {
    if(supportFlag===false) {
      support();
    }
    else {
      cancelSupport();
    }
  });
}
