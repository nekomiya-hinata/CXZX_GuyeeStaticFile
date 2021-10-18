var MyPassword = function () {

    var initData = function () {

    };

    var initPage = function () {
        form_helpers.parsley($('#form'));// 表单验证
        /*表单提交*/
        $('#form').ajaxForm({
            url: ctx + "/my/password",
            dataType: 'json',
            type: 'POST',
            beforeSubmit: function (formData, form, options) {
                form_helpers.blockUI(form);
            },
            success: function (data, status, xhr, form) {
                form_helpers.unblockUI(form);
                if (data.success) {
                    form_helpers.notify(data.msg, "提示信息", "success");
                } else {
                    form_helpers.error(data.msg, form);
                }
            },
            error: function (data, textStatus, errorThrown, form) {
                form_helpers.unblockUI(form);
                form_helpers.error('数据提交失败，请检查网络是否畅通!', form);
            }

        });

        /*重置按钮*/
        function reset() {
            $('#form')[0].reset();
        };

    }
    return {
        init: function () {
            initPage.apply(this);
            initData.apply(this);
        }
    }

}();


$(function () {
    MyPassword.init();
});