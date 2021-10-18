"use strict";
// Class definition
var DataInfo = function () {

    var initPage = function (that) {
    	$("#btn_close").on('click',close);

  		function close() {
      		window.close();
  		};

    };

    var initData = function () {

    }


    return {
        init: function () {
            initPage.apply(this);
            initData.apply(this);
        },
        refresh: function () {
            DataInfo.datatable.ajax.reload();
        },
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    DataInfo.init();
});