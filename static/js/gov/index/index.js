"use strict";
var Index=function(){
	
	var initKpi=function(){
		/*blockLoading($(document.body)); */
		$.ajax({  
    		type: 'get',  
    		dataType: 'text',  
    		url :  ctx+'/gov/dashboard/kpi', 
    		success : function(data){ 
    			var parsedWordArray = CryptoJS.enc.Base64.parse(data);
            	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
            	var result=JSON.parse(msg);
    			$('#placeTotal').html('<span class="counter"  data-value="'+result.placeTotal+'">0</span>');
    			/*$('#whitePersonTotal').html('<span class="counter"  data-value="'+result.whitePersonTotal+'">0</span>');*/
    			$('#keyPersonTotal').html('<span class="counter"  data-value="'+result.keyPersonTotal+'">0</span>');
    			/*$('#strangerTotal').html('<span class="counter"  data-value="'+result.strangerTotal+'">0</span>');*/
    			$('#carTotal').html('<span class="counter"  data-value="'+result.carTotal+'">0</span>');
    			$('#boxTotal').html('<span class="counter"  data-value="'+result.boxTotal+'">0</span>');
    			$('#todayWarningTotal').html('<span class="counter"  data-value="'+result.todayWarningTotal+'">0</span>');
    			$('#todaySnapFaceTotoal').html('<span class="counter"  data-value="'+result.todaySnapFaceTotoal+'">0</span>');
    			$('#todaySnapCarTotoal').html('<span class="counter"  data-value="'+result.todaySnapCarTotoal+'">0</span>');
        		
    			$('.counter').counterUp({
    				delay: 10,/*每个数字动画的延迟时间，单位毫秒。*/
	        	    time: 1000/*计数动画总的持续时间。*/
	        	});
        		/*unblockUI($(document.body));*/
    			
    			/*function startRun(){
    				var olddata = $('#syy1').attr("data-value")==null?888:$('#syy1').attr("data-value"); 
    				var data =  parseInt(olddata)+1;
    				$('#todayWarningTotal').html('<span class="counter" id="syy1" data-counterup-beginat="'+olddata+'" data-value="'+data+'">'+olddata+'</span>');
    				$('#syy1').counterUp({
        				delay: 10,//每个数字动画的延迟时间，单位毫秒。
    	        	    time: 1000,//计数动画总的持续时间。
    	        	    beginAt: olddata,
    	        	    offset: 70,
    	        	});
    			}
    			
    			var timer_block = setInterval(function() {
    				startRun();
    			}, 3000);*/
    			
    		}  
    	});
		
	};
	
	return{
		initPage : function(){
			initKpi();
		}
	}
	
}();

jQuery(document).ready(function () {
	Index.initPage();
});