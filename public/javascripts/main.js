var center=document.getElementById('center');
var list=document.getElementById('list');

function getStyle(obj,name)
		{
		if(obj.currentStyle)
		return obj.currentStyle[name];//Ie浏览器用的获取非行间样式的方法
		else
		return getComputedStyle(obj,null)[name];//FF以及谷歌获取非行间样式的方法
		}
  center.onclick=function(e) {
    // e.preventDefault();
    var listStatus=getStyle(list,"display");
    console.log('listStatus: ', listStatus);
    if(listStatus=="none") {
      list.style.display="block";
    }
    else {
      list.style.display="none";
    }
    return false;
  }
