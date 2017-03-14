var center=document.getElementById('center');
var list=document.getElementById('list');

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
