
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
//		sessionId = 1;
		if(sessionId != 'undefined' && sessionId != undefined){
			var postData = {};
			console.log(1)
			postData.pageNum = pageNum;
			postData.pageSize = pageSize;
			postData.onlineToken = sessionId;
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
//				url: "data.json",
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
					console.log(result)
		        	if(result.resultCode==0){
		        		$("#prodictList").html(getDataHtml(result.data.productInfoList));
		        		$(".editpro").click(function(){
		        			loadProduct(this.dataset.id)
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
		        		layer.msg(result.resultMsg);
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
	            <a class="editpro" title="编辑" href="javascript:;" data-id = "`+item.id+`"
	            class="ml-5" style="text-decoration:none">
	                <i class="layui-icon">&#xe642;</i>
	            </a>
	            
	            </tr>`;
		}
		
		return htmlStr;
	}
	
	function loadProduct(id){
		var form = layui.form,
				$ = layui.jquery,
				laydate = layui.laydate,
          		layer = layui.layer;
			
			var postData = {};
			postData.id = id;
			postData.onlineToken = sessionId;
			$.ajax({
	            url: api_url+"product/queryProductInfo",
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
					console.log(result)
		        	if(result.resultCode==0){
		        		var indexx = edit_win('编辑',getProductHtmel(result.data.productInfo),900,700);
		        		$("#edittt").find("#type").each(function(){
		        			$(this).val(result.data.productInfo.type)
		        		})
		        		$("#edittt").find("#localName").each(function(){
		        			$(this).val(result.data.productInfo.localName)
		        		})
		        		$("#edittt").find("#status").each(function(){
		        			$(this).val(result.data.productInfo.status)
		        		})
		        		form.render();
		        		bindeve(id,indexx)
		        		layer.close(indexInit);
		        	}
		        	else{
		        		layer.close(indexInit);
		        	}
		        }
	        });
			
	}
	
	function edit_win(title,cont,w,h){
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
	
	function getProductHtmel(data){
		var htmlStr = "";
		htmlStr += `<div class="wrapper" id="edittt">
	        <!-- 右侧主体开始 -->
	        <div class="page-content">
	          <div class="content">
	            <!-- 右侧内容框架，更改从这里开始 -->
	            <form class="layui-form">
				 	<div class="layui-row layui-rows">
					    <div class="layui-col-xs12 layui-col-sm12 layui-col-md12 layui-col-lg12">
					    	<div class="layui-form-item">
			                    <label for="L_email" class="layui-form-label">
			                        <span class="x-red">*</span>商品名称
			                    </label>
			                    <div class="layui-input-inline" style="width: 700px;" >
			                        <input type="text" id="productTitle" placeholder="请输入商品名称" name="productName" required="" lay-verify="required" value="`+data.productName+`"
			                        autocomplete="off" class="layui-input">
			                    </div>
			                </div>
	                    </div>
	                </div>
	                <div class="layui-row layui-rows">
					    <div class="layui-col-xs4 layui-col-sm4 layui-col-md4 layui-col-lg4">
			                <div class="layui-form-item">
			                    <label for="L_username" class="layui-form-label">
			                        <span class="x-red">*</span>产品类型
			                    </label>
			                    <div class="layui-input-inline" style="width: 150px;">
			                        <select name="type"  lay-verify="required" id="type">
				                      	<option selected value="">请选择</option>
				                      	<option value="景点">景点</option>
				                      	<option value="游乐场">游乐场</option>
				                      	<option value="演出体验">演出体验</option>
				                    </select>  
			                    </div>
			                </div>
	                    </div>
	                    <div class="layui-col-xs4 layui-col-sm4 layui-col-md4 layui-col-lg4">
			                <div class="layui-form-item">
			                    <label for="L_pass" class="layui-form-label">
			                        <span class="x-red">*</span>所属地区
			                    </label>
			                    <div class="layui-input-inline" style="width: 150px;">
			                        <select name="localName"  lay-verify="required" id="localName">
				                      	<option selected value="">请选择</option>
				                      	<option value="越秀区">越秀区</option>
				                      	<option value="荔湾区">荔湾区</option>
				                      	<option value="海珠区">海珠区</option>
				                      	<option value="天河区">天河区</option>
				                      	<option value="白云区">白云区</option>
				                      	<option value="黄埔区">黄埔区</option>
				                      	<option value="番禺区">番禺区</option>
				                      	<option value="花都区">花都区</option>
				                      	<option value="南沙区">南沙区</option>
				                      	<option value="增城区">增城区</option>
				                      	<option value="从化区">从化区</option>
				                    </select>  
			                    </div>
			                </div>
	                    </div>
	                    <div class="layui-col-xs4 layui-col-sm4 layui-col-md4 layui-col-lg4">
			                <div class="layui-form-item">
			                    <label for="L_repass" class="layui-form-label">
			                        <span class="x-red">*</span>状态
			                    </label>
			                    <div class="layui-input-inline" style="width: 150px;">
			                        <select name="status" lay-verify="required" id="status">
				                      	<option selected value="">请选择</option>
				                      	<option value="1">上架</option>
				                      	<option value="0">下架</option>
				                    </select>  
			                    </div>
			                </div>
	                    </div>
	                </div>
	                <div class="layui-row layui-rows">
	                    <div class="layui-col-xs4 layui-col-sm4 layui-col-md4 layui-col-lg4">
			                <div class="layui-form-item">
			                    <label for="L_username" class="layui-form-label">
			                        <span class="x-red">*</span>成人票
			                    </label>
			                    <div class="layui-input-inline" style="width: 150px;">
			                        <input type="text" value="`+data.adultAgePrice+`" placeholder="请输入成人票价" id="L_email" name="adultAgePrice" required="" lay-verify="required"
			                        autocomplete="off" class="layui-input"> 
			                    </div>
			                </div>
	                   </div>
	                    <div class="layui-col-xs4 layui-col-sm4 layui-col-md4 layui-col-lg4">
			                <div class="layui-form-item">
			                    <label for="L_username" class="layui-form-label">
			                        <span class="x-red">*</span>儿童票
			                    </label>
			                    <div class="layui-input-inline" style="width: 150px;">
			                        <input type="text" value="`+data.childrenAgePrice+`" id="L_email" placeholder="请输入儿童票价" name="childrenAgePrice" required="" lay-verify="required"
			                        autocomplete="off" class="layui-input"> 
			                    </div>
			                </div>
	                   </div>
	                </div>
	                <div class="layui-row layui-rows">
					    <div class="layui-col-xs12 layui-col-sm12 layui-col-md12 layui-col-lg12">
			                <div class="layui-form-item">
			                    <label for="L_username" class="layui-form-label">
			                        <span class="x-red">*</span>产品介绍
			                    </label>
			                    <div class="layui-input-inline" style="width: 700px;">
			                         <textarea name="introduce" value="" lay-verify="required" placeholder="请输入产品介绍" class="layui-textarea">`+data.introduce+`</textarea>
			                    </div>
			                </div>
	                   </div>
	                </div>
	                <div class="layui-row layui-rows">
					    <div class="layui-col-xs12 layui-col-sm12 layui-col-md12 layui-col-lg12">
			                <div class="layui-form-item">
			                    <label for="L_username" class="layui-form-label">
			                        <span class="x-red">*</span>使用说明
			                    </label>
			                    <div class="layui-input-inline" style="width: 700px;">
			                         <textarea name="instructions" value="" lay-verify="required" placeholder="请输入使用说明" class="layui-textarea">`+data.instructions+`</textarea>
			                    </div>
			                </div>
	                   </div>
	                </div>
	                <div class="layui-row layui-rows">
					    <div class="layui-col-xs12 layui-col-sm12 layui-col-md12 layui-col-lg12">
			                <div class="layui-form-item">
			                    <label for="L_username" class="layui-form-label">
			                        <span class="x-red">*</span>费用包含
			                    </label>
			                    <div class="layui-input-inline" style="width: 700px;">
			                         <textarea name="costIncludes"  lay-verify="required" placeholder="请输入费用包含" class="layui-textarea">`+data.costIncludes+`</textarea>
			                    </div>
			                </div>
	                   </div>
	                </div>
	                <div class="layui-row layui-rows">
					    <div class="layui-col-xs12 layui-col-sm12 layui-col-md12 layui-col-lg12">
			                <div class="layui-form-item">
			                    <label for="L_username" class="layui-form-label">
			                        <span class="x-red">*</span>亮点推荐
			                    </label>
			                    <div class="layui-input-inline" style="width: 700px;">
			                         <textarea name="brightSpot"  lay-verify="required" placeholder="请输入亮点推荐" class="layui-textarea">`+data.brightSpot+`</textarea>
			                    </div>
			                </div>
	                   </div>
	                </div>
	                <div class="layui-row layui-rows">
	                	<label for="L_username" class="layui-form-label" style="width: 100px;">
		                        <span class="x-red">*</span>产品图片
		                </label>
	                	<div class="layui-col-xs3 layui-col-sm3 layui-col-md3 layui-col-lg3">
					    	
					    	<img id="headPortraitImgShow1" src="`+
					    	(data.pic0.indexOf("http://")>=0?data.pic0:api_url+"product/getPic?fileName="+data.pic0)
					    	+`" alt="" width="160px" height="90px" />
					　　		<input type="file" id="headPortraitUpload1" style="margin-top:10px;">
					    </div>
	                	<div class="layui-col-xs3 layui-col-sm3 layui-col-md3 layui-col-lg3">
					    	<img id="headPortraitImgShow2" src="`+(data.pic1.indexOf("http://")>=0?data.pic1:api_url+"product/getPic?fileName="+data.pic1)+`" alt="" width="160px" height="90px" />
					　　		<input type="file" id="headPortraitUpload2" style="margin-top:10px;">
					    </div>
	                	<div class="layui-col-xs3 layui-col-sm3 layui-col-md3 layui-col-lg3">
					    	<img id="headPortraitImgShow3" src="`+(data.pic2.indexOf("http://")>=0?data.pic2:api_url+"product/getPic?fileName="+data.pic2)+`" alt="" width="160px" height="90px" />
					　　		<input type="file" id="headPortraitUpload3" style="margin-top:10px;">
					    </div>
	                </div>
	                <div class="col-sm-6">
					　　
					</div>
	                <div class="layui-form-item">
	                    <label for="L_repass" class="layui-form-label">
	                    </label>
	                    <button  class="layui-btn" lay-filter="update" lay-submit >
	                        保存
	                    </button>
	                </div>
	            </form>
	            <!-- 右侧内容框架，更改从这里结束 -->
	          </div>
	        </div>
	        <!-- 右侧主体结束 -->
	    </div>`;
	    return htmlStr;
	}
	
		//监听提交
		function bindeve(id,indexs){
			$("#headPortraitUpload1").on("change",headPortraitListener1);
		 /*定义全局变量存贮图片信息*/
		 var base64head1="";
		function headPortraitListener1(e) {
		    var img1 = document.getElementById('headPortraitImgShow1');
		      if(window.FileReader) {
		          var file  = e.target.files[0];
		          var reader = new FileReader();
		          if (file && file.type.match('image.*')) {
		              reader.readAsDataURL(file);
		          } else {
		              img1.css('display', 'none');
		              img1.attr('src', '');
		          }
		          reader.onloadend = function (e) {
		          img1.setAttribute('src', reader.result);
		          base64head1 = reader.result;
		          console.log(base64head1)
		        }
		      }
		}
		$("#headPortraitUpload2").on("change",headPortraitListener2);
		 /*定义全局变量存贮图片信息*/
		 var base64head2="";
		function headPortraitListener2(e) {
		    var img2 = document.getElementById('headPortraitImgShow2');
		      if(window.FileReader) {
		          var file  = e.target.files[0];
		          var reader = new FileReader();
		          if (file && file.type.match('image.*')) {
		              reader.readAsDataURL(file);
		          } else {
		              img2.css('display', 'none');
		              img2.attr('src', '');
		          }
		          reader.onloadend = function (e) {
		          img2.setAttribute('src', reader.result);
		          base64head2 = reader.result;
		        }
		      }
		}
		$("#headPortraitUpload3").on("change",headPortraitListener3);
		 /*定义全局变量存贮图片信息*/
		 var base64head3="";
		function headPortraitListener3(e) {
		    var img3 = document.getElementById('headPortraitImgShow3');
		      if(window.FileReader) {
		          var file  = e.target.files[0];
		          var reader = new FileReader();
		          if (file && file.type.match('image.*')) {
		              reader.readAsDataURL(file);
		          } else {
		              img3.css('display', 'none');
		              img3.attr('src', '');
		          }
		          reader.onloadend = function (e) {
		          img3.setAttribute('src', reader.result);
		          base64head3 = reader.result;
		        }
		      }
		}
		
			form.on('submit(update)', function(data){
	            console.log(data.field);
				var indexLoad = layer.load(2); 
	            var postData = data.field;
	            postData.imageModelList = [];
	            postData.onlineToken = sessionId;
	            if(base64head1!=""){
	            	var img = {};
	            	var base64 = base64head1.split(";base64,");
	            	img.baseName = base64[1];
	            	img.typeName = base64[0].split("image/")[1];
	            	img.number = 0;
	            	postData.imageModelList.push(img);
	            }
	            if(base64head2!=""){
	            	var img = {};
	            	var base64 = base64head2.split(";base64,");
	            	img.baseName = base64[1];
	            	img.typeName = base64[0].split("image/")[1];
	            	img.number = 1;
	            	postData.imageModelList.push(img);
	            }
	            if(base64head3!=""){
	            	var img = {};
	            	var base64 = base64head3.split(";base64,");
	            	img.baseName = base64[1];
	            	img.typeName = base64[0].split("image/")[1];
	            	img.number = 2;
	            	postData.imageModelList.push(img);
	            }
	            postData.id = id;
	            $.ajax({
		            url: api_url+"product/updateProduct",
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
						console.log(result)
						layer.close(indexs);
			        	if(result.resultCode==0){
			        		layer.msg('更新成功!', {
								icon: 1,
								time: 1000
							}, function(){
								getData(1)
							});
			        		layer.close(indexInit);
			        	}
			        	else{
			        		layer.close(indexInit);
			        	}
			        }
		        });
	            
	            return false;
	        }); 
		}
	        
});
