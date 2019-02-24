
layui.use([ 'jquery','form','layer','laypage'], function() {
	var table = layui.table,
	layer = layui.layer,
	$ = layui.jquery,
	laypage = layui.laypage,
	form = layui.form;
	var pageSize = 10;
	
		getData(1)
	$("#seach").click(function(){
		getData(1)
	})
	function getData(pageNum){
		console.log(sessionId)
		sessionId = 1;
		if(sessionId != 'undefined' && sessionId != undefined){
			var postData = {};
			console.log(1)
			postData.pageNum = pageNum;
			postData.pageSize = pageSize;
			
			if($("#id").val() != ""){
					postData.id = $("#id").val() ;
				}
			if($("#productName").val() != ""){
					postData.productName = $("#productName").val() ;
				}
			if($("#status").val() != ""){
					postData.status = $("#status").val() ;
				}
			if($("#localName").val() != ""){
					postData.localName = $("#localName").val() ;
				}
			if($("#type").val() != ""){
					postData.type = $("#type").val() ;
				}
			$.ajax({
				url: api_url+"product/productInfoList",
				url: "data.json",
				type: "get",
				contentType: "application/json;charset=utf-8",
				data: JSON.stringify(postData),
				datatype: "jsonp",
				xhrFields: {
	            	withCredentials: true
	     		},
				crossDomain: true,
				async: true,
				beforeSend: function (request) {
		          indexInit = layer.load(2, {shade: [0.1,'#fff']});
		        },
				success: function (result) {
					console.log(result)
		        	if(result.resultCode==0){
		        		$("#prodictList").html(getDataHtml(result.data.productInfoList));
		        		layer.close(indexInit);
						if(pageNum == 1){
							laypage.render({
								elem: 'page',
								theme: '#1E9FFF',
								count: result.data.totle,
								limit: pageSize,
								layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
								jump: function(obj, first) {
									if(!first){
										if(obj.limit == pageSize){
											getData(obj.curr);
										}
										else{
											pageSize = obj.limit;
											getData(1);
										}
									}
								}
							});	
						}
		        	}
		        	else{
		        		layer.close(indexInit);
		        		common.msgError(result.resultMsg);
		        	}
		        }
			});
		}else{
//			window.location.href='login.html';
		}
	}
	
//	$("#prodictList").html();
	function getDataHtml(data){
		var htmlStr = "";
		for(var item of data ){
			htmlStr += `<tr>
	        <td>`+item.id+`</td>
	        <td>`+item.productName+`</td>
	        <td >`+item.type+`</td>
	        <td >`+item.localName+`</td>
	        <td >`+(item.status==1?'上架':'下架')+`</td>
	        <td class="td-manage">
	            <a style="text-decoration:none" onclick="member_stop(this,'10001')" href="javascript:;" title="停用">
	                <i class="layui-icon">&#xe601;</i>
	            </a>
	            <a title="编辑" href="javascript:;" onclick="showWin('编辑','member-edit.html','`+item.id+`','600','510')"
	            class="ml-5" style="text-decoration:none">
	                <i class="layui-icon">&#xe642;</i>
	            </a>
	            <a style="text-decoration:none"  onclick="member_password('修改密码','member-password.html','10001','600','400')"
	            </tr>`;
		}
		
		return htmlStr;
	}
	
	
});
