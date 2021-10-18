var MyAccount = function () {
    var initData = function () {

    };
    var initPage = function () {

        $("#btn_close").on('click', close);


        var initUppy = function () {

            const xhr = Uppy.XHRUpload;
            const StatusBar = Uppy.StatusBar;
            const ProgressBar = Uppy.ProgressBar;
            const FileInput = Uppy.FileInput;

            var uppy = Uppy.Core({
                autoProceed: true,
                showProgressDetails: true,
                restrictions: {
                    allowedFileTypes: ['.jpg','.png','jpeg','.gif'],
                    maxFileSize: 5000000 // 10mb
                }
            });

            uppy.use(FileInput, {
                target: '#kt_user_edit_avatar .kt-avatar__upload',
                pretty: false,
                replaceTargetContent: false
            });

            uppy.use(xhr, {
                endpoint: ctx + "/my/photo",
                formData: true,
                fieldName: 'file'
            });

            uppy.use(StatusBar, {
                target: '#kt_user_edit_avatar .kt-uppy__status',
                hideUploadButton: true,
                hideAfterFinish: true
            });

            uppy.use(ProgressBar, {
                target: '#kt_user_edit_avatar .kt-uppy__progress',
                hideAfterFinish: true
            })

            uppy.on('upload-success', (file, response) => {
                $('#kt_user_edit_avatar .kt-avatar__holder').css('background-image', 'url(' + ctx + "/my/photo?id=" + Math.random() + ')');
            })

        }

        form_helpers.parsley($('#form_info'));// 表单验证

        /* 表单提交 */
        $('#form_info').ajaxForm({
            url: ctx + "/my/save",
            dataType: 'json',
            type: 'POST',
            beforeSubmit: function (formData, form, options) {
                form_helpers.blockUI(form);
            },
            success: function (data, status, xhr, form) {
                form_helpers.unblockUI(form);
                if (data.success) {
                    form_helpers.success(data.msg, "提示信息");
                } else {
                    form_helpers.error(data.msg, $(form));
                }
            },
            error: function (data, textStatus, errorThrown, form) {
                form_helpers.unblockUI($(form));
                form_helpers.error('数据提交失败，请检查网络是否畅通!', $(form));
            }

        });

        form_helpers.parsley($('#form_password'));// 表单验证

        $('#form_password').ajaxForm({
            url: ctx + "/my/password",
            dataType: 'json',
            type: 'POST',
            beforeSubmit: function (formData, form, options) {
                form_helpers.blockUI(form);
            },
            success: function (data, status, xhr, form) {
                form_helpers.unblockUI(form);
                if (data.success) {
                    form_helpers.success(data.msg, "提示信息");
                } else {
                    form_helpers.error(data.msg, $(form));
                }
            },
            error: function (data, textStatus, errorThrown, form) {
                form_helpers.unblockUI($('#form_password'));
                form_helpers.error('数据提交失败，请检查网络是否畅通!', $(this.form));
            }

        });


        function close() {
            window.close();
        };

        initUppy();

    }


    return {
        init: function () {
            initPage.apply(this);
            initData.apply(this);
        }
    }
}
();


$(function () {
    MyAccount.init();
});
