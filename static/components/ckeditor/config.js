/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights
 *          reserved. For licensing, see LICENSE.html or
 *          http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function(config) {
	// Define changes to default configuration here.
	// For the complete reference:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [ {
		name : 'clipboard',
		groups : [ 'clipboard', 'undo' ]
	}, {
		name : 'editing',
		groups : [ 'find', 'selection', 'spellchecker' ]
	}, {
		name : 'links'
	}, {
		name : 'insert'
	}, {
		name : 'forms'
	}, {
		name : 'tools'
	}, {
		name : 'document',
		groups : [ 'mode', 'document', 'doctools' ]
	}, {
		name : 'others'
	}, '/', {
		name : 'basicstyles',
		groups : [ 'basicstyles', 'cleanup' ]
	}, {
		name : 'paragraph',
		groups : [ 'list', 'indent', 'blocks', 'align', 'bidi' ]
	}, {
		name : 'styles'
	}, {
		name : 'colors'
	} ];

	// Remove some buttons, provided by the standard plugins, which we don't
	// need to have in the Standard(s) toolbar.
	config.removeButtons = 'Underline,Subscript,Superscript';

	// Se the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';

	// Make dialogs simpler.
	config.removeDialogTabs = 'image:advanced;link:advanced';
	
	config.image_previewText=" ";
	
	
	// 上传文件时浏览服务文件夹                                                                                                       
	config.filebrowserBrowseUrl =ctx+'/static/components/ckfinder/ckfinder.html';                                                           
	// 上传图片时浏览服务文件夹                                                                                                        
	config.filebrowserImageBrowseUrl =ctx+'/static/components/ckfinder/ckfinder.html?Type=Images';                                          
	// 上传Flash时浏览服务文件夹                                                                                                     
	config.filebrowserFlashBrowseUrl =ctx+'/static/components/ckfinder/ckfinder.html?Type=Flash';                                           
	// 上传文件按钮(标签)                                                                                                         
	config.filebrowserUploadUrl =ctx+'/static/ckfinder/core/connector/java/connector.java?command=QuickUpload&type=Files';       
	// 上传图片按钮(标签)                                                                                                         
	config.filebrowserImageUploadUrl =ctx+'/static/ckfinder/core/connector/java/connector.java?command=QuickUpload&type=Images';  
	// 上传Flash按钮(标签)                                                                                                      
	config.filebrowserFlashUploadUrl =ctx+'/static/ckfinder/core/connector/java/connector.java?command=QuickUpload&type=Flash'; 
};
