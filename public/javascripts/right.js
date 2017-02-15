//封装函数
function $(id) {
  return document.getElementById(id);
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


//获得右边部分的函数
function getRight() {
  var xmlHttp=initAjax();
  xmlHttp.open("GET","/right",true);
  xmlHttp.onreadystatechange=function() {
    if(xmlHttp.readyState===4) {
      if(xmlHttp.status===200) {
        var obj=JSON.parse(xmlHttp.responseText);
        console.log(obj);
        console.log(obj["article_list"]);

        var text="";
        for(var i in obj.article_list) {
      text+='<li><a href="/article?article_id='+obj.article_list[i].article_id+'"'+">"+obj.article_list[i].article_title+'</a></li>';
        }
        $("container_first").innerHTML=text;
      }
    }
  }
  xmlHttp.send(null);

}
window.onload=getRight;
