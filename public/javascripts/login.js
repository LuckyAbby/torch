function $(id) {
  return document.getElementById(id);
}
var log_in=$('log_in');
var lost_pass=$('lost_pass');
var submit_btn=$("submit_btn");
var forget_btn=$('forget_btn');
var reset_success=$('reset_success');
var lost_cancle=$('lost_cancle');
var lost_submit=$('lost_submit');
var student_number=$('student_number');
var password=$('password');
function forgetPassword() {
    log_in.style.display='none';
		lost_pass.style.display='block';
	  student_number.value='';
		password.value='';
		$('user_name').value='';
		$('sid').value='';
		$('idcard').value='';
}
function checkBrowser() {
		if(navigator.vendor==''&&navigator.userAgent.indexOf('Firefox')==-1||navigator.vendor==undefined){
			$('ieCore').style.display='block';
		}else{
			$('ieCore').style.display='none';
		}
	}
  function backLogin() {
  		log_in.style.display='block';
  		lost_pass.style.display='none';
  		reset_success.style.display='none';
      $('loginTip').innerHTML='';
  	}
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
   function resetPassword() {
    var student_name=$('user_name').value;
    var student_id=$('sid').value;
    var id_card=$('idcard').value;
     var data={
       student_name:student_name,
       student_id:student_id,
       id_card:id_card
     };
    //  console.log('data:'+data.student_id);
      var xmlHttp=initAjax();
      xmlHttp.open("post","/reset",true);
      xmlHttp.onreadystatechange=function() {
        if(xmlHttp.readyState===4) {
          if(xmlHttp.status===200) {
            var obj=JSON.parse(xmlHttp.responseText);
            // console.log(JSON.parse(xmlHttp.responseText)["code"]);
            if(obj["code"]===0) {
              lost_pass.style.display='none';
					    reset_success.style.display='block';
            }
            else {
              $('mess').innerHTML='信息不匹配，请重新填写';
              // console.log("aaa");
            }
            // console.log("bbb");
            student_number.value='';
					password.value='';
					student_name='';
					student_id='';
					id_card='';
          }
        }
      }
      xmlHttp.setRequestHeader("Content-Type","application/json");
      xmlHttp.send(JSON.stringify(data));
    }
  window.onload=checkBrowser;
  forget_btn.onclick=forgetPassword;
  lost_submit.onclick=resetPassword;
  lost_cancle.onclick=backLogin;
