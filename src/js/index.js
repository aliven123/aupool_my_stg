import '../css/index.less';
import base from '../assets/js/common.js';
const url_8008='http://10.88.71.83:8008';
const url_getBuyIndicator='http://10.88.71.83:8008';
// const url_8008='https://data.aupool.cn';
// const url_getBuyIndicator='https://data.aupool.cn';
const err_obj={
  loginout:'用户未登录',
  server_error:'服务器异常'
};
const handleCookie=function(c_name='username'){
	let cookie_obj={};
	const cookie=document.cookie;
	if(cookie.length>0){
		let key,val;
		if(cookie.includes(';')){
			//  包含多组cookie键值对
			cookie.split(';').forEach((item)=>{
				let arr=item.split('=');
				key=arr[0].trim();val=arr[1];
				cookie_obj[key]=val;
			})
			
		}else{
		   // 只包含一组cookie
		   let arr=cookie.split('=');
		   key=arr[0].trim();val=arr[1]
		   cookie_obj[key]=val;
		};
		console.log(cookie_obj);
		return cookie_obj[c_name]?cookie_obj[c_name]:false;
	}else{
		return false
	}
}
const getUsername=function(){
  // 获取用户名函数
  //路由如果有code,请求接口，存username到cookie,改路由的code且不能重刷界面
  //如果路由没有code,有cookie,返回cookies,
  //如果路由没有code,没有cookie,抛出错误
  let data={code:base.queryToObj().code},
  src='/wechat/get_username/';
  if(data.code===undefined){
	  const username=handleCookie();
	  if(username){
		  return Promise.resolve(username)
	  }else{
		  return Promise.reject('loginout');
	  }
  }else{
	  return new Promise((resolve,reject)=>{
		base.ajaxfn(`${url_8008}${src}`,'POST','json',data,(res)=>{
		  console.log(res.result);
		  if(res.result==='success'){
			document.cookie=`username=${res.data.username}`;
			window.history.replaceState({},'替换',`${location.origin}${location.pathname}`)
			resolve(res.data.username);
		  }else{
			err_obj.server_error=res?.reason;
			reject('server_error')
		  }
		});
	  })
  };
};
const reqData= function(username){
  // 获取数据函数
  const data={
    username,
    need_nujin_url:1
  },
  src='/quan_language/getBuyIndicator/';
  const promise=new Promise((resolve,reject)=>{
      base.ajaxfn(`${url_getBuyIndicator}${src}`,'POST','json',data,(res)=>{
        console.log(res);
        if(res?.length>=0){
          resolve(res);
        }else{
          err_obj.server_error=res?.reason;
          reject('server_error')
        }
    });
  })
  return promise;
};
const getData=async function(){
  // 数据处理函数
  let username,stg_list;
  try{
    username=await getUsername();
    stg_list=await reqData(username);
    return stg_list;
  }catch(err){
    return Promise.reject(err);
  };
};
const openUrl=function(){
  $('#au_pool_my_stg .au_tbody').on('click',(e)=>{
    const el=$(e.target);
    const tagName=el.get(0).tagName.toLowerCase();
    if(tagName==='td'){
      const url=el.parent().attr('url');
      window.open(`${url}`,'blank');
    }
  })
};
const handleData=function(data){
  // console.log(data);
  if(data.length>0){
    let tr_templale=``;
    for(const [index,item] of Object.entries(data)){
      tr_templale+=`
        <tr index='${index}' url='${item.nujin_url}'>
          <td>
            ${item.indicname}
          </td>  
          <td>${item.description}</td>  
          <td>${item.style}</td>  
          <td>${item.type}</td>   
          <td>${item.expiretime}</td>   
        </tr>  
      `
    };
    $('#au_pool_my_stg .au_tbody tbody').html(tr_templale);
  }
};
window.onload=function(){
  getData().then(data=>{
    handleData(data);
    openUrl();
  }).catch(err=>{
    // 异常处理
    const keys=Object.keys(err_obj);
    if(keys.includes(err)){
      alert(err_obj[err])
    }else{
		alert(err);
	}
  });
}