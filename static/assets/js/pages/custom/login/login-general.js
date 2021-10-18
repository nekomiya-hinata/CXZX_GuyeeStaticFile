"use strict";

// Class Definition
var KTLoginGeneral = function () {

    var login = $('#kt_login');

    var showErrorMsg = function (msg) {
        var alert = $('.alert');
        //alert.animateClass('fadeIn animated');
        KTUtil.animateClass(alert[0], 'fadeIn animated');
        alert.find('span').html(msg);
    }


    var handleFormSwitch = function () {


    }
    
    function isEmpty(value){
	    if(value == null || value == "" || value == "undefined" || value == undefined || value == "null"){
	        return true;
	    }
	    else{
	        if(value == ""){
	            return true;
	        }
	        return false;
	    }
	}
    
    function AESencrypt(word){
        var key = CryptoJS.enc.Utf8.parse("UBsjSE@B2ybOo36*");//这个不知道是什么
        var srcs = CryptoJS.enc.Utf8.parse(word);
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        	mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7
         });
        return encrypted.toString();
    }
    
    if(!isEmpty($("#username"))){
    	var hidden_username = AESencrypt($("#username").val());
		$("#hidden_username").val(hidden_username);
	 }
	
	$("#username").blur(function () {
		 if(!isEmpty($("#username"))){
			var hidden_username = AESencrypt($("#username").val());
			$("#hidden_username").val(hidden_username);
		 }
	 });
	
	if(!isEmpty($("#password"))){
    	var hidden_password = AESencrypt($("#password").val());
		$("#hidden_password").val(hidden_password);
	 }
	
	$("#password").blur(function () {
		 if(!isEmpty($("#password"))){
			var hidden_password = AESencrypt($("#password").val());
			$("#hidden_password").val(hidden_password);
		 }
	 });

    var handleSignInFormSubmit = function () {

            var form = $('#kt_login_form');

            form.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'invalid-feedback', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {
                    username: {
                        required: true,
                    },
                    password: {
                        required: true
                    },
                    captcha: {
                        required: true
                    }
                },
                messages: {
                    username: {
                        required: "请输入用户名."
                    },
                    password: {
                        required: "请输入密码."
                    },
                    captcha: {
                        required: "请输入验证码."
                    }
                },
                highlight: function (element) { // hightlight error inputs
                    $(element).addClass(' is-invalid'); // set error class to the control group
                },
                success: function (label) {
                    label.removeClass('is-invalid');
                    label.remove();
                },
                errorPlacement: function (error, element) {
                    error.insertAfter(element);
                },

                submitHandler: function (form) {
                    form.submit();
                }
            });


    }


    // Public Functions
    return {
        // public functions
        init: function () {
            handleFormSwitch();
            handleSignInFormSubmit();
        }
    };
}();

// Class Initialization
jQuery(document).ready(function () {
    KTLoginGeneral.init();
});
