/*
*  author: yj
*  form helper
* */


$(function () {
    "use strict";
    form_helpers.parsley_validation_config();
});

form_helpers = {
    parsley_validation_config: function () {
        window.ParsleyConfig = $.extend(window.ParsleyConfig || {}, {
            excluded: '[disabled],input[type=button], input[type=submit], input[type=reset], input[type=hidden], input.exclude_validation',
            trigger: 'change',
            errorsWrapper: '<span class="help-block help-block-error"></span>',
            errorTemplate: '<span></span>',
            errorsContainer: function (ParsleyField) {
                var element = ParsleyField.$element;

                if (element.closest('.input-group', 'form-group').length)
                    return element.closest('.input-group').parent('div');
                else if (element.closest('.kt-checkbox-inline', 'form-group').length > 0)
                    return element.closest('.kt-checkbox-inline', 'form-group').parent('div');
                else if (element.closest('.kt-radio-inline', 'form-group').length > 0)
                    return element.closest('.kt-radio-inline', 'form-group').parent('div');
                else return element.parent()


            }
        });
    },
    parsley: function ($obj) {
        $obj
            .parsley()
            .on('form:error', function () {
                form_helpers.updatge_form($obj);
            })
            .on('field:validated', function (parsleyField) {
                var el = parsleyField.element;
                form_helpers.update_input($(el));
            });
    },
    updatge_form: function (object) {
        form_helpers.info(object, "warning", "fa fa-info-circle", "数据填写不完整", 6);
    },
    update_input: function (object) {
        // clear wrapper classes
        object.closest('.form-group ').removeClass('has-error has-success');

        if (object.closest('.parsley-error', '.form-group').length > 0) {
            if (object.closest('.form-group').length > 0) {
                object.closest('.form-group').addClass('has-error')
            }
        }

        if (object.hasClass('parsley-success')) {
            if (object.closest('.form-group').length) {
                object.closest('.form-group').addClass('has-success')
            }
        }
    },
    blockUI: function (target, msg) {
        KTApp.block(target, {message: msg});
    },
    unblockUI: function (target) {
        KTApp.unblock(target);
    },
    info: function (target, type, icon, text, duration) {
        /**
         * type:Success,Danger,Warning,Info
         * icon:warning,check
         */
        dialog.info(target, type, icon, text, duration);
    },
    confirm: function (text, callback) {
        dialog.confirm(text, callback);
    },
    prompt: function (text, callback) {
        dialog.prompt(text, callback);
    },
    alert: function (msg, callback) {
        /**
         * 提示
         */
        dialog.alert(msg, callback);
    },
    //提示框
    notify: function (msg, title, type) {
        dialog.notify(msg, title, type);
    },
    error: function (text, target) {
        dialog.info(target ? target : $('#kt_content'), "danger", null, text, 6);
    },
    success: function (msg, title) {
        dialog.notify(msg, title, "success");
    }
}


