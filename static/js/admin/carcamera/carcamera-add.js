"use strict";
// Class definition
var CarcameraList = function () {

	var initPage = function (that) {

		$('#placeid').select2({
			placeholder : "请选择场所...",
			language:'zh-CN',
			allowClear : true,
			ajax : {
				url : ctx + "/admin/place/quickSearch",
				dataType : 'json',
				method : 'GET',
				delay: 250,
				data : function(params){
					return {
						search_LIKE_name : params.term,
					}
				},
				cache : true,
				processResults : function(data, page) {
					var result = [];
					$.each(data.data, function(index, val) {
						result.push({
							'id' : this.id,
							'text' : this.name,
						});
					});
					return {
						results : result
					};
				}
			}
		});
		$('#cameratype').select2({
			placeholder : "请选择摄像头类型...",
			language:'zh-CN',
			allowClear : true,
			ajax : {
				url : ctx + "/admin/carcamera/getCarameraTypeTree",
				dataType : 'json',
				method : 'GET',
				delay: 250,
				data : function(params){
					return {
						search_LIKE_name : params.term,
					}
				},
				cache : true,
				processResults : function(data, page) {
					var result = [];
					$.each(data, function(index, val) {
						result.push({
							'id' : this.id,
							'text' : this.text,
						});
					});
					return {
						results : result
					};
				}
			}
		});
		form_helpers.parsley($('#form'));// 表单验证
		$('#form').ajaxForm(
			// 表单提交
			{
				url : ctx + "/admin/carcamera",
				dataType : 'json',
				type : 'POST',
				beforeSubmit : function(formData, form, options) {
					form_helpers.blockUI($('#form'));// 加载动画
				},
				error : function(data, textStatus, errorThrown) {
					form_helpers.unblockUI($('#form'));// 取消加载动画

				},
				success : function(data) {
					form_helpers.unblockUI($('#form'));
					if (data.success) {
						form_helpers.notify(data.msg, '提示',
							'success');
					} else {
						form_helpers.info($('#alert'), "warning",
							"warning", data.msg, 6);
					}

				}
			});
	};

	var initData = function () {

	}


	return {
		init: function () {
			initPage.apply(this);
			initData.apply(this);
		}
	};

}();

// Class initialization on page load
jQuery(document).ready(function () {
	CarcameraList.init();
});