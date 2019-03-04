
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
		if(sessionId != 'undefined' && sessionId != undefined){
			var postData = {};
			postData.pageNum = pageNum;
			postData.pageSize = pageSize;
			postData.onlineToken = sessionId;
			
			if($("#id").val() != ""){
					postData.orderNum = $("#id").val() ;
				}
			if($("#productName").val() != ""){
					postData.productName = $("#productName").val() ;
				}
			if($("#status").val() != ""){
					postData.status = $("#status").val() ;
				}
			if($("#orderStatus").val() != ""){
					postData.orderStatus = $("#orderStatus").val() ;
				}
			if($("#type").val() != ""){
					postData.type = $("#type").val() ;
				}
			$.ajax({
				url: api_url+"order/queryOrderInfoList",
//				url: "data.json",
				type: "post",
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
		        			var id = this.dataset.id;
		        			var ind = saleAfter_win("售后退款",getSaleAfterHtml(this.dataset.text),400,250);
		        			$("#yes").click(function(){
		        				saleAfterRepoet(id,2,ind)
		        			});
		        			$("#no").click(function(){
		        				saleAfterRepoet(id,3,ind)
		        			});

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
	        <td class="td-manage">`;
	        	if(item.orderView.afterSaleStatus == 1){
	        		htmlStr += `<a data-id="`+ item.orderView.id +`" style="text-decoration:none" data-text="`+ item.orderView.afterSaleRemark +`" class="saleAfter" href="javascript:;" title="售后">
		                <i class="layui-icon">&#xe65e;</i>
		            </a>`;
	        	}
		            
	            
	            htmlStr += `
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
			case 4:return "退款中";
			case 5:return "已退款";
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
	
	function getSaleAfterHtml(text){
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
		                         <textarea name="brightSpot" lay-verify="required" placeholder="" class="layui-textarea">`+ text +`</textarea>
		                    </div>
		                </div>
                   </div>
                </div>
				<div class="layui-form-item" style="margin-left:100px;">
		             <button  class="layui-btn" id="yes" type="button" >
		                        退款
                    </button>
                    <button  class="layui-btn" id="no" type="button" >
		                        拒绝
                    </button>
                </div>
            </form>
		`;
		return htmlStr;
	}
	
	function saleAfterRepoet(id,type,index){
		var postData = {};
			postData.id = id;
			postData.afterSaleStatus = type;
			if(type==1){
				postData.orderStatus = 1;
			}else{
				postData.orderStatus = 5;
			}
			postData.onlineToken = sessionId;
			$.ajax({
	            url: api_url+"order/updateOrderStatus",
				type: "post",
				contentType: "application/json;charset=utf-8",
				data: JSON.stringify(postData),
				datatype: "json",
				xhrFields: {
	            	withCredentials: true
	     		},
				crossDomain: true,
				async: true,
				beforeSend: function (request) {
		          indexInit = layer.load(2, {shade: [0.1,'#fff']});
		        },
				success: function (result) {
		        	if(result.resultCode==0){
		        		layer.close(indexInit);
		        		layer.msg(result.resultMsg, {
								  	time: 2000,
								  	anim: 1
								});
								getData(1);
		        		layer.close(index);
		        	}
		        	else{
		        		layer.msg(result.resultMsg, {
								  	time: 2000,
								  	anim: 6
								});
		        		layer.close(indexInit);
		        	}
		        }
	        });
	}

});
