
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
		        		$("#prodictList").html(getDataHtml(result.data.orderInfoList));
		        		$(".saleAfter").click(function(){
		        			saleAfter_win("售后退款",getSaleAfterHtml(),400,250)
		        		})
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
	        <td>`+item.orderView.orderNum+`</td>
	        <td >`+ item.productView.productName +`</td>
	        <td >`+ item.orderView.checkCode +`</td>
	        <td>`+getStatus(item.orderView.orderStatus)+`</td>
	        <td >`+(item.orderView.adultAgePrice == 0? "儿童":"成人") + `</td>
	        <td >`+(item.orderView.adultAgePrice == 0?item.orderView.childrenAgePrice:item.orderView.adultAgePrice)+`</td>
	        <td >`+item.orderView.num+`</td>
	        <td >
	        	姓名:`+item.orderView.guestName+`<br>
	        	手机:`+item.orderView.guestPhone+`<br>
	        	邮箱:`+item.orderView.guestEmail+`<br>
	        	备注:`+item.orderView.remark+`
	        </td>
	        <td class="td-manage">
	            <a style="text-decoration:none" class="saleAfter" href="javascript:;" title="售后">
	                <i class="layui-icon">&#xe65e;</i>
	            </a>
	            <a title="编辑预定信息" href="javascript:;" onclick="showWin('编辑','member-edit.html','`+item.id+`','600','510')"
	            class="ml-5" style="text-decoration:none">
	                <i class="layui-icon">&#xe642;</i>
	            </a>
	            </td>
	            </tr>`;
		}
		return htmlStr;
	}
	
	function getStatus(n){
		switch(n){
			case 0:return "待付款";
			case 1:return "已付款";
			case 2:return "已使用";
			case 3:return "已取消";
		}
	}
	
	function saleAfter_win(title,cont,w,h){
	    if (title == null || title == '') {
	        title=false;
	    };
	    if (w == null || w == '') {
	        w=800;
	    };
	    if (h == null || h == '') {
	        h=($(window).height() - 50);
	    };
	    index = layer.open({
	        type: 1,
	        area: [w+'px', h +'px'],
	        fix: false, //不固定
	        maxmin: true,
	        shadeClose: false,
	        shade:0.4,
	        title: title,
	        content: cont,
	    });
	    return index;
	}
	
	function getSaleAfterHtml(data){
		var htmlStr = "";
		htmlStr +=`
			<form class="layui-form">
				<div class="layui-row layui-rows">
				    <div class="layui-col-xs12 layui-col-sm12 layui-col-md12 layui-col-lg12">
		                <div class="layui-form-item" >
		                    <label for="L_username" style="width:70px;" class="layui-form-label">
		                        <span class="x-red">*</span>退款理由
		                    </label>
		                    <div class="layui-input-inline" style="width: 60%;">
		                         <textarea name="brightSpot" lay-verify="required" placeholder="" class="layui-textarea">12313132</textarea>
		                    </div>
		                </div>
                   </div>
                </div>
				<div class="layui-form-item" style="margin-left:100px;">
		             <button  class="layui-btn" lay-filter="add" lay-submit >
		                        退款
                    </button>
                    <button  class="layui-btn" lay-filter="add" lay-submit >
		                        拒绝
                    </button>
                </div>
            </form>
		`;
		return htmlStr;
	}
});
