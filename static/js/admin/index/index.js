"use strict";
var Index=function(){
	
	var initKpi=function(){
		//blockLoading($(document.body));
		$.ajax({  
    		type: 'get',  
    		dataType: 'json',  
    		url :  ctx+'/admin/dashboard/kpi', 
    		success : function(result){ 
    			$('#yhsl').html('<span class="counter"  data-value="'+result.yhsl+'">0</span>');
    			$('#cssl').html('<span class="counter"  data-value="'+result.cssl+'">0</span>');
    			$('#sbsl').html('<span class="counter"  data-value="'+result.sbsl+'">0</span>');
    			
    			$('#fwqsl').html('<span class="counter"  data-value="'+result.fwqsl+'">0</span>');
    			$('#rawdatatotal').html('<span class="counter"  data-value="'+result.rawdatatotal+'">0</span>');
    			$('#pictotal').html('<span class="counter"  data-value="'+result.pictotal+'">0</span>');
    			$('#rawdatatotal_week').html('<span class="counter"  data-value="'+result.rawdatatotal_week+'">0</span>');
    			$('#rawdatatotal_today').html('<span class="counter"  data-value="'+result.rawdatatotal_today+'">0</span>');
    			
    			$('#rysl').html('<span class="counter"  data-value="'+result.rysl+'">0</span>');
    			$('#carsl').html('<span class="counter"  data-value="'+result.carsl+'">0</span>');
    			
    			/*$('#totolLinker').html(result.totolLinker);
    			$('#todayIncreasesLinker').html(result.todayIncreasesLinker);
    			$('#linkerIncreases').html('<span class="kt-widget24__number" >'+result.linkerIncreases+'%</span>');
    			$('#linkerPicIncreases').html('<div class="progress-bar kt-bg-brand" role="progressbar" style="width: '+result.linkerIncreases+'%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>');
    			
    			$('#totolData').html(result.totolData);
    			$('#todayIncreasesData').html(result.todayIncreasesData);
    			$('#dataIncreases').html('<span class="kt-widget24__number" >'+result.dataIncreases+'%</span>');
    			$('#dataPicIncreases').html('<div class="progress-bar kt-bg-warning" role="progressbar" style="width: '+result.dataIncreases+'%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>');*/
        		
    			$('.counter').counterUp({
	        	    delay: 10,//每个数字动画的延迟时间，单位毫秒。
	        	    time: 1000//计数动画总的持续时间。
	        	});
        		//unblockUI($(document.body));
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