//获得右边部分的函数
function getRight() {
  var xmlHttp=initAjax();
  xmlHttp.open("GET","/right",true);
  xmlHttp.onreadystatechange=function() {
    if(xmlHttp.readyState===4) {
      if(xmlHttp.status===200) {
        var obj=JSON.parse(xmlHttp.responseText);
        var text_announcement="";
        var text_hot="";
        for(var i in obj.article_announcement) {
      text_announcement+='<li><a href="/article?article_id='+obj.article_announcement[i].article_id+'"'+">"+obj.article_announcement[i].article_title+'</a></li>';
        }
        for(var i in obj.article_hot) {
      text_hot+='<li><a href="/article?article_id='+obj.article_hot[i].article_id+'"'+">"+obj.article_hot[i].article_title+'</a></li>';
        }
        $("container_first").innerHTML=text_announcement;
        $('container_second').innerHTML=text_hot;
      }
    }
  }
  xmlHttp.send(null);

}
window.onload=getRight;
