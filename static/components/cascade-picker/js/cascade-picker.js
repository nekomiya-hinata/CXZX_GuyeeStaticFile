/*!
 * CityPicker v1.0.2
 * https://github.com/tshi0912/citypicker
 *
 * Copyright (c) 2015-2016 Tao Shi
 * Released under the MIT license
 *
 * Date: 2016-02-29T12:11:36.477Z
 */
(function (factory) {
	"use strict";
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	}
	else if(typeof module !== 'undefined' && module.exports) {
		module.exports = factory(require('jquery'));
	}
	else {
		factory(jQuery);
	}
}(function ($) {

    'use strict';

    var NAMESPACE = 'cascadepicker';
    var EVENT_CHANGE = 'change.' + NAMESPACE;

    function CascadePicker(element, options) {
        this.$element = $(element);
        this.$dropdown = null;
        this.$tab=null;
        this.options = $.extend({}, CascadePicker.DEFAULTS, $.isPlainObject(options) && options);
        this.active = false;
        this.dems = [];
        this.needBlur = false;
        this.cascadeData=options.data;
        this.selectedValue= new Array(this.options.tabs.length);
        this.init();
    }

    CascadePicker.prototype = {
        constructor: CascadePicker,
        init: function () {

            this.defineDems();

            this.render();

            this.bind();

            this.active = true;
        },

        render: function () {
        	var $this=this;
        	
            var p = this.getPosition(),
                placeholder = this.$element.attr('placeholder') || this.options.placeholder,
                textspan = '<span class="cascade-picker-span" style="' +
                    this.getWidthStyle(p.width) + 'height:' +
                    p.height + 'px;">' +
                    (placeholder ? '<span class="placeholder">' + placeholder + '</span>' : '') +
                    '<span class="title"></span><div class="arrow"></div>' + '</span>',
                dropdown = '<div class="cascade-picker-dropdown" style="left:10px;top:100%;' +
                    this.getWidthStyle(p.width, true) + '">' +
                    '<div class="cascade-select-wrap">' +
                    '<div class="cascade-select-tab">';
            
		            $.each(this.options.tabs, function (i, item) {
		            	dropdown+='<a '+(i==0?'class="active"':'')+ ' data-index="'+i+'">'+item+'</a>';
		            });
                    
                    dropdown+='</div>';
                    
                    dropdown+='<div class="cascade-select-content">';
                    
                    $.each(this.options.tabs, function (i, item) {
                    	dropdown+='<div class="cascade-select"  data-index="'+i+'"></div>';
		            });
                    dropdown+='</div>';

            this.$element.addClass('cascade-picker-input');
            this.$textspan = $(textspan).insertAfter(this.$element);
            this.$dropdown = $(dropdown).insertAfter(this.$textspan);
            
            var $select = this.$dropdown.find('.cascade-select');
            
            $.each(this.options.tabs, function (i, item) {
            	$this['$' + item] =$select.filter('[data-index="'+i+'"]');
            });
            
            this['$' + this.options.tabs[0]].data('items',this.cascadeData)
            
            this.refresh();
        },

        refresh: function (item) {
        	item=item?item:this.options.tabs[0];
            this.output(item);
            this.tab(item);
        },

        defineDems: function () {
            var stop = false;
            $.each(this.options.tabs, $.proxy(function (i, item) {
                    this.dems.push(item);
            }, this));
        },
        getPosition: function () {
            var p, h, w, s, pw;
            p = this.$element.position();
            s = this.getSize(this.$element);
            h = s.height;
            w = s.width;
            if (this.options.responsive) {
                pw = this.$element.offsetParent().width();
                if (pw) {
                    w = w / pw;
                    if (w > 0.99) {
                        w = 1;
                    }
                    w = w * 100 + '%';
                }
            }

            return {
                top: p.top || 0,
                left: p.left || 0,
                height: h,
                width: w
            };
        },

        getSize: function ($dom) {
            var $wrap, $clone, sizes;
            if (!$dom.is(':visible')) {
                $wrap = $("<div />").appendTo($("body"));
                $wrap.css({
                    "position": "absolute !important",
                    "visibility": "hidden !important",
                    "display": "block !important"
                });

                $clone = $dom.clone().appendTo($wrap);

                sizes = {
                    width: $clone.outerWidth(),
                    height: $clone.outerHeight()
                };

                $wrap.remove();
            } else {
                sizes = {
                    width: $dom.outerWidth(),
                    height: $dom.outerHeight()
                };
            }

            return sizes;
        },

        getWidthStyle: function (w, dropdown) {
            if (this.options.responsive && !$.isNumeric(w)) {
                return 'width:' + w + ';';
            } else {
                return 'width:' + (dropdown ? Math.max(320, w) : w) + 'px;';
            }
        },

        bind: function () {
            var $this = this;

            $(document).on('click', (this._mouteclick = function (e) {
	                var $target = $(e.target);
	                var $dropdown, $span, $input;
	                if ($target.is('.cascade-picker-span')) {
	                    $span = $target;
	                } else if ($target.is('.cascade-picker-span *')) {
	                    $span = $target.parents('.cascade-picker-span');
	                }
	                if ($target.is('.cascade-picker-input')) {
	                    $input = $target;
	                }
	                if ($target.is('.cascade-picker-dropdown')) {
	                    $dropdown = $target;
	                } else if ($target.is('.cascade-picker-dropdown *')) {
	                    $dropdown = $target.parents('.cascade-picker-dropdown');
	                }
	                
	                if ((!$input && !$span && !$dropdown) ||
	                    ($span && $span.get(0) !== $this.$textspan.get(0)) ||
	                    ($input && $input.get(0) !== $this.$element.get(0)) ||
	                    ($dropdown && $dropdown.get(0) !== $this.$dropdown.get(0))) {
	                    $this.close(true);
	                }

             }));

             this.$element.on('focus', (this._focusElement = $.proxy(function () {
                this.needBlur = true;
                this.open();
            }, this))).on('blur', (this._blurElement = $.proxy(function () {
                if (this.needBlur) {
                    this.needBlur = false;
                    this.close(true);
                }
            }, this)));

            this.$textspan.on('click', function (e) {
                var $target = $(e.target);
                $this.needBlur = false;
                if ($target.is('.select-item')) {
                    var index =$($target[0]).data('index');
                    $this.open($this.options.tabs[index]);
                } else {
                    if ($this.$dropdown.is(':visible')) {
                        $this.close();
                    } else {
                    	var tab=$this.$dropdown.find('.cascade-select-tab a.active');
                        $this.open($this.options.tabs[tab.data('index')]);
                    }
                }
            }).on('mousedown', function () {
                $this.needBlur = false;
            });

            this.$dropdown.on('click', '.cascade-select a', function () {
            	var $select = $(this).parents('.cascade-select');
            	var index=$select.data("index");
            	
            	
            	 for (var i=0;i < index; i++)
                 {
                 	if (!$this.selectedValue[i])
                 	{
                 		alert("请按照层级顺序选择!");
                 		return ;
                 	}
                 }	
            	 
             	for (var i=index+1;i<$this.options.tabs.length;i++)
             	{
             		$this.selectedValue[i]=null;
             	}	
            	
            	var $next = $select.next();
            	
                var $active = $select.find('a.active');
                $active.removeClass('active');
                
                $(this).addClass('active');
                
               
                
                $this.selectedValue[index]={value:$(this).data("value"),text:$(this).text()};
                
                if ($next.length === 0)
                {
                	 $select.addClass('active');
                	 $this.close();
                }
                else
                {
                	 var nextTab=$this.options.tabs[$next.data('index')];
                	 
                	 var data=$(this).data('items');
                	 if (data)
                		 $this['$' + nextTab].data('items',data);
                	 else
                		 $this['$' + nextTab].data('items',[]); 
                	 
                	 $(this).trigger(EVENT_CHANGE,[nextTab]);
                }
                $this.feedVal();
                
            }).on('click', '.cascade-select-tab a', function () {
                if (!$(this).hasClass('active')) {
                    var index = $(this).data('index');
                    $this.tab($this.options.tabs[index]);
                }
            }).on('mousedown', function () {
                $this.needBlur = false;
            });

            
	       
        
            var $select = this.$dropdown.find('.cascade-select');
            
            $select.on(EVENT_CHANGE, (this._selectValue = $.proxy(function (e,tab) {
            	this.output(tab);
            	this.tab(tab);
            	this.open(tab);
	         }, this)));
	        
        },
        open: function (tab) {
        	tab=tab?tab:this.options.tabs[0];
            this.$dropdown.show();
            this.$textspan.addClass('open').addClass('focus');
            this.tab(tab);
        },

        close: function (blur) {
            this.$dropdown.hide();
            this.$textspan.removeClass('open');
            if (blur) {
                this.$textspan.removeClass('focus');
            }
        },

        unbind: function () {
            $(document).off('click', this._mouteclick);

            this.$element.off('focus', this._focusElement);
            this.$element.off('blur', this._blurElement);

            this.$textspan.off('click');
            this.$textspan.off('mousedown');

            this.$dropdown.off('click');
            this.$dropdown.off('mousedown');
            
            var $select = this.$dropdown.find('.cascade-select');
            $select.off(EVENT_CHANGE, this._selectValue);

        },
        getPlaceHolder: function () {
            return this.$element.attr('placeholder') || this.options.placeholder;
        },
        getValue: function() {
        	return this.selectedValue;
        },
        setValue:function(val){
        	var $this=this;
        	$this.selectedValue=val;
        	$this.$dropdown.find('.cascade-select a.active').removeClass('active');
            $.each($this.selectedValue,function(index,item){
            	var tab=$this.options.tabs[index];
            	if (item)
            	{
            		$this.refresh(tab);
            		var selected=$this.$dropdown.find('.cascade-select[data-index="'+index+'"] a[data-value="'+item.value+'"]');
            		selected.addClass('active');
            		selected.parents('.cascade-select').next().data("items",selected.data("items"));
            	}
            	else
            		$this['$'+tab].html("");
            });
            $this.feedVal();
        },
        feedVal: function () {
        	var value=[],text=[];
        	$.each(this.selectedValue,function(index,item){
        		if (item)
        		{	
        		    value.push(item.value);
        		    text.push('<span class="select-item" data-index="' +index + '" data-value="' + item.value + '">' + item.text + '</span>');
        		}
        	});
        	
        	if (value.length>0)
        	{	
        		this.$element.val(value.join(","));
        		this.$textspan.find('>.placeholder').hide();
                this.$textspan.find('>.title').html(text.join("/")).show();
        	}
        	else
        	{	
        		this.$textspan.find('>.placeholder').text(this.getPlaceHolder()).show();
                this.$textspan.find('>.title').html('').hide();
        		this.$element.val("");
        	}	
        	this.$element.trigger('change');
        },
        getTabIndex:function(tab)
        {
        	 return $.inArray(tab,this.options.tabs);
        },
        output: function (tab) {
        	var index=this.getTabIndex(tab);
            var options = this.options;
            var $select = this['$' + tab];
            
            var data = $select.data('items');
            if (data)
            {
	            $select.html(this.getList(data));
	            var dds=$select.find('a');
	            $.each(dds,function(index,item){
	            	$(item).data('items',data[index].data);
	            });
            }
            else
            	$select.html("");
        },
        getList: function (data) {
            var list = [],
                $this = this;
            var valueField=$this.options.valueField,textField=$this.options.textField;
            
            if (this.options.groupBy)
            {
            	//数据分组
            	var  map={'empty':[]};
            	$.each(data, function (i, n) {
            		var group=n[$this.options.groupBy];
            		if (group)
            		{	
	            		if (!map.hasOwnProperty(group))
	            			map[group]=[];
	            		
	            		map[group].push(n)
            		}
            		else
            			map["empty"].push(n);
                	
                });
            	
            	for(var prop in map){
            		 list.push(prop=='empty'?'':'<dt>'+prop+'</dt>');
            		 list.push('<dl class="clearfix"><dd>');
            		 $.each(map[prop],function(i,n){
            			 list.push(
     		                    '<a' +
     		                    ' title="' +n[textField] + '"' +
     		                    ' data-value="' + n[valueField] + '"' +
     		                    ' >' +
     		                    n[textField] +
     		              '</a>');
            		 });
            		 list.push('</dd></dl>');
            	}
            }
            else{
		            list.push('<dl class="clearfix"><dd>');
		            $.each(data, function (i, n) {
		                list.push(
		                    '<a' +
		                    ' title="' +n[textField] + '"' +
		                    ' data-value="' + n[valueField] + '"' +
		                    ' >' +
		                    n[textField] +
		                    '</a>');
		            });
		            list.push('</dd></dl>');
            }
            return list.join('');
        },
        tab: function (item) {
            var $selects = this.$dropdown.find('.cascade-select');
            var $tabs = this.$dropdown.find('.cascade-select-tab > a');
            var $select = this['$' + item];
            var $tab = this.$dropdown.find('.cascade-select-tab > a[data-index="' + this.getTabIndex(item) + '"]');
            if ($select) {
            	 $selects.hide();
                 $select.show();
                 $tabs.removeClass('active');
                 $tab.addClass('active');
            }
        },

        reset: function () {
        	this.setValue(new Array(this.options.tabs.length));
            this.refresh();
        },

        destroy: function () {
            this.unbind();
            this.$element.removeData(NAMESPACE).removeClass('cascade-picker-input');
            this.$textspan.remove();
            this.$dropdown.remove();
        }
    };

    CascadePicker.DEFAULTS = {
        responsive: false,
        placeholder: '请选择...',
        valueField: 'id',
        textField:'text',
    };

    CascadePicker.setDefaults = function (options) {
        $.extend(CascadePicker.DEFAULTS, options);
    };

    // Register as jQuery plugin
    $.fn.cascadepicker = function (option) {
        var args = [].slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this);
            var data = $this.data(NAMESPACE);
            var options;
            var fn;

            if (!data) {
                if (/destroy/.test(option)) {
                    return;
                }

                options = $.extend({}, $this.data(), $.isPlainObject(option) && option);
                
                $this.data(NAMESPACE, (data = new CascadePicker(this, options)));
            }

            if (typeof option === 'string' && $.isFunction(fn = data[option])) {
                fn.apply(data, args);
            }
        });
    };

    $.fn.cascadepicker.Constructor = CascadePicker;
    $.fn.cascadepicker.setDefaults = CascadePicker.setDefaults;
    
}));