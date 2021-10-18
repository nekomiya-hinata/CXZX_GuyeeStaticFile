$(function () {

    'use strict';


    var $citypicker3 = $('#cascade-picker3').cascadepicker({
    	tabs:['省','市','县'],
    	valueField:'code',
    	textField:'text',
    	data:cascadeData
    });
    
    
  

    $('#reset').click(function () {
        $citypicker3.cascadepicker('reset');
    });

    $('#get').click(function () {
    	  alert($citypicker3.cascadepicker('getValue'));
    	  alert($('#cascade-picker3').val());
    });
    
    var data=[{value:'510000',text:'四川省'},{value:'510700',text:'绵阳市'},{value:'510704',text:'游仙区'}];
    $('#set').click(function () {
  	   $citypicker3.cascadepicker('setValue',data);
   });

    $('#destroy').click(function () {
        $citypicker3.cascadepicker('destroy');
    });
    
    
 

});
