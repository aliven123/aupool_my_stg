import $ from 'jquery';
const ajaxfn=function(url,type,datatype,data,fn){	/*异步调用函数*/
 $.ajax({
   "url":url,
   "type":type,
   "async":true,
   "xhrFields":{
     "withCredentials":true
   },
   "dataType":datatype,
   "data":data,
   "success":function(res){
     fn(res);
   },
   "error":function(XMLHttpRequest, textStatus, errorThrown) {
      var result=XMLHttpRequest.status+","+XMLHttpRequest.readyState+","+textStatus;
      fn(result);
     /* error事件返回的第一个参数XMLHttpRequest：
       XMLHttpRequest.readyState: 状态码的意思
       0 － （未初始化）还没有调用send()方法
       1 － （载入）已调用send()方法，正在发送请求
       2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
       3 － （交互）正在解析响应内容
       4 － （完成）响应内容解析完成，可以在客户端调用了*/
    }
 });
};
const remInit=function(designWidth, maxWidth) {
	var doc = document,
	win = window,
	docEl = doc.documentElement,
	remStyle = document.createElement("style"),
	tid;
 
	function refreshRem() {
		var width = docEl.getBoundingClientRect().width;
		maxWidth = maxWidth || 540;
		width>maxWidth && (width=maxWidth);
		var rem = width * 100 / designWidth;
		remStyle.innerHTML = 'html{font-size:' + rem + 'px;}';
	}
 
	if (docEl.firstElementChild) {
		docEl.firstElementChild.appendChild(remStyle);
	} else {
		var wrap = doc.createElement("div");
		wrap.appendChild(remStyle);
		doc.write(wrap.innerHTML);
		wrap = null;
	}
	//要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
	refreshRem();
 
	win.addEventListener("resize", function() {
		clearTimeout(tid); //防止执行两次
		tid = setTimeout(refreshRem, 100);
	}, false);
 
	win.addEventListener("pageshow", function(e) {
		if (e.persisted) { // 浏览器后退的时候重新计算
			clearTimeout(tid);
			tid = setTimeout(refreshRem, 100);
		}
	}, false);
 
	if (doc.readyState === "complete") {
		doc.body.style.fontSize = "16px";
	} else {
		doc.addEventListener("DOMContentLoaded", function(e) {
			doc.body.style.fontSize = "16px";
		}, false);
	}
};
const queryToObj=function(){
	const res={};
	const search=location.search.substr(1);
	search.split('&').forEach(param=>{
		const arr=param.split('=');
		const key=arr[0],val=arr[1];
		res[key]=val;
	});
	return res;
};
remInit(750,750);
export default {
 ajaxfn,
 queryToObj
};