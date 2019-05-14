<%@ page language="java" import="java.util.*,com.zhuozhengsoft.pageoffice.*" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/tags/taglib.jsp"%>
<!DOCTYPE html>
<html lang="zh-CN">

<head>
	<title>拟办意见设置</title>
	<!-- 重置样式 -->
	<link rel="stylesheet" type="text/css" href="${curPath}/static/modules/instance/frame/css/md.bootstrap.reset.css">
	<link rel="stylesheet" href="${uiPath}/libs/bootstrap-3.3.6/css/bootstrap.css?v=${version}">
	<!-- jquery -->
	<script src="${uiPath}/libs/jquery-1.11.3/jquery-2.1.4.min.js"></script>
	<!--当前页面样式 -->
	<link rel="stylesheet" type="text/css" href="${curPath}/static/modules/instance/programSubform/css/newNibanFormPage.css?v=${version}">
</head>

<body class="mdskin white-bg">
	<div id="propose" >
		<button class="btn" style="display:none;" id="proposewin" >设置拟办意见</button>
		<button class="btn" style="display:none;" id="proposeEdit" >追加追减</button>
		<div class="content">
			<textarea name="proposetxt1" id="proposetxt1" disabled rows="4" placeholder="请设置拟办意见"></textarea>
			<textarea name="proposetxt2" id="proposetxt2" disabled rows="2" style="display:none;"></textarea>
		</div>
	</div>	
	<!-- 引入统一 JS 文件 -->
	<%@ include file="/WEB-INF/views/common/common_js.jsp"%>
	<script src="${curPath}/static/modules/instance/programSubform/js/newNibanFormPage.js?v=${version}"></script>
	<script>
		//保存校检
		function canSave(){
			var j = true;
			top.$('.oa-err').blur();
			if(top.$('.oa-err').length>0 && obj==1)return true;
			if(typeof(alldata.nibanData)==='string' && content_!=''){
				var jsons = JSON.parse(alldata.nibanData);
				var contents = jsons.content;
				contents = contents.split('######');
				if(contents[0].trim().replace(/\s/g,"") == ''){
					var name = confirm('拟办意见为空，是否继续发送?');
					if(name=="false"){
						return false;
					}
				}
			}
			//判断是否有更改拟办意见
			if(alldata){
				//保存拟办意见数据
				$.ajax({
					url: baseUrl + '/shouwenNiban/saveNibanData',
					type: "post",
					async:false,
					dataType: "json",
					data:alldata,
					success: function (data) {
						if(data.status=='200'){
							j=true;
						}else{
							j=false;
						}
					},eroor:function(data){
						j=false;
					}
				});
			}
			return j;
		}
		//发送
		function canSend(){
			return canSave();
		}
		//发送
		function send(){
			return true;
		}
		// 保存数据 不使用但占位
		function save(){
			return true
		}
		// 提示语
		function getMessage(){
			return '网络发生异常，请联系管理员';
		}
	</script>
</body>
</html>