

//$函数都是在base.js里面封装好的函数
var center=$('center');
var list=$('list');
addEventHandler(center,'click',function() {
  var listStatus=getStyle(list,"display");
  if(listStatus=="none") {
    list.style.display="block";
  }
  else {
    list.style.display="none";
  }
  return false;
})
