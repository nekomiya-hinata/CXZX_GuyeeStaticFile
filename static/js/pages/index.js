"use strict";
// Class definition
var Dashboard = function () {
    var initPage = function () {

    };

    var initData = function () {

    }
    return {
        // Init demos
        init: function () {
            initPage();
            initData();
        }
    };
}();

// Class initialization on page load
jQuery(document).ready(function () {
    Dashboard.init();
});