/*	--------------------------------------------------
	:: Handlebars Helpers
	-------------------------------------------------- 

	Atomic Handlebars Helpers
	http://atomicinfotech.com/atomic-handlebars-helpers
	http://github.com/atomicinfotech/atomic-handlebars-helpers

	---------------------------------------------------
	
	The MIT License (MIT)

	Copyright (c) 2013 Atomic Infotech

	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/


$(document).ready(function() {
	
	// For debugging values inside of a template
	Handlebars.registerHelper('log', function(context) {
		if(console && (typeof console.log === 'function')){
			console.log(context);
		}
		return '';
	});

	Handlebars.registerHelper('uriEncode',function(string) {
		return encodeURIComponent(string);
	});

	// HELPER: #key_value
	//
	// Usage: {{#key_value obj}} Key: {{key}} // Value: {{value}} {{/key_value}}
	//
	// Iterate over an object, setting 'key' and 'value' for each property in
	// the object.
	Handlebars.registerHelper("key_value", function(obj, options) {
		var buffer = "",
			key;
	
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				buffer += options.fn({key: key, value: obj[key]});
			}
		}
	
		return buffer;
	});

	// HELPER: #each_with_key
	//
	// Usage: {{#each_with_key container key="myKey"}}...{{/each_with_key}}
	//
	// Iterate over an object containing other objects. Each
	// inner object will be used in turn, with an added key ("myKey")
	// set to the value of the inner object's key in the container.
	Handlebars.registerHelper("each_with_key", function(obj, options) {
		var context,
			buffer = "",
			key,
			keyName = options.hash.key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				context = obj[key];
				if (keyName) {
					context[keyName] = key;
				}
				buffer += options.fn(context);
			}
		}
		
		return buffer;
	});
	
	// Indexed version of each (only works with arrays)
	Handlebars.registerHelper('each_i', function(context, options) {
		var ret = '';
		if (context) {
			for(var i=0, j=context.length; i<j; i++) {
				context[i]._index = i;
				ret += options.fn(context[i]);
			}
		}
		return ret;
	});

	// Keyed version on each (works with arrays and other objects)
	Handlebars.registerHelper('each_k', function(/* obj,key,ctx */) {
		var obj,key,ctx,ret;
		
		arguments = Array.prototype.slice.call(arguments);
		
		ctx = arguments.pop();
		
		obj = arguments[0] || {};
		key = arguments[1] || '_k';
		ret = '';
		
		for (var x in obj) {
			obj[x][key] = x;
			ret += ctx.fn(obj[x]);
		}
		
		return ret;
	});

	Handlebars.registerHelper("apply", function(templateName, data) {
		var t = HandleBarsTemplates[templateName];
		if(typeof t == 'undefined') 
			return new Handlebars.SafeString('<!-- apply error [' + templateName + '] -->');
		
		return new Handlebars.SafeString(t(data));
	});

	Handlebars.registerHelper("eachWeekday", function(indexed_obj, options) {
		
		var names = [
			{ full: "Sunday", short: "Sun", caps: "SUN", small: "sun" },
			{ full: "Monday", short: "Mon", caps: "MON", small: "mon" },
			{ full: "Tuesday", short: "Tue", caps: "TUE", small: "tue" },
			{ full: "Wednesday", short: "Wed", caps: "WED", small: "wed" },
			{ full: "Thursday", short: "Thu", caps: "THU", small: "thu" },
			{ full: "Friday", short: "Fri", caps: "FRI", small: "fri" },
			{ full: "Saturday", short: "Sat", caps: "SAT", small: "sat" },
		];
		
		var buffer = "";
	
		for(var i = 0; i <= 6; i++) {
			buffer += options.fn({
				dayNames: names[i], 
				dayData: indexed_obj[i], 
				index: i, 
				indexOB: i+1,
			});
		}
	
		return buffer;
	});
	
	Handlebars.registerHelper("int", function(obj) {
		var n = parseInt(obj, 10);
		return typeof n == "number" && !isNaN(n) ? n : obj;
	});

	Handlebars.registerHelper("YesNo", function(x) {
		return x == true ? 'Yes' : 'No';
	});

	Handlebars.registerHelper("yesno", function(x) {
		return x == true ? 'yes' : 'no';
	});
	
	// not the prettiest, but it's good enough
	Handlebars.registerHelper("phone", function(obj) {
		if(typeof obj != 'string') return obj;
		var l = obj.length;
		if(l <= 7) return obj.replace(/(.*)(....)/, '$1-$2');
		if(l <= 10) return obj.replace(/(.*)(...)(....)/, '$1-$2-$3');
		if(l > 10) return obj.replace(/(.*)(...)(...)(....)/, '$1-$2-$3-$4');
	});
	
	Handlebars.registerHelper("%", function(obj) {
		var n = parseFloat(obj);
		return typeof n == "number" && !isNaN(n) ? n.toMoney(1) : obj;
	});
	
	Handlebars.registerHelper("%%", function(obj) {
		var n = parseFloat(obj);
		return typeof n == "number" && !isNaN(n) ? (n.toMoney(1) + '%') : obj;
	});
	
	Handlebars.registerHelper("$", function(obj) {
		var n = parseFloat(obj);
		return typeof n == "number" && !isNaN(n) ? n.toMoney(0) : obj;
	});
	
	Handlebars.registerHelper("cents", function(obj) {
		var n = parseFloat(obj);
		return typeof n == "number" && !isNaN(n) ? n.toMoney(2) : obj;
	});
	
	Handlebars.registerHelper("$$", function(obj) {
		var n = parseFloat(obj);
		return typeof n == "number" && !isNaN(n) ? n.toMoney(0, '.', ',', '$') : obj;
	});
	
	Handlebars.registerHelper("$cents", function(obj) {
		var n = parseFloat(obj);
		return typeof n == "number" && !isNaN(n) ? n.toMoney(2, '.', ',', '$') : obj;
	});
	
	// "plus/minus"
	Handlebars.registerHelper("pm", function(obj) {
		return typeof parseFloat(obj) == "number" ? (obj >= 0 ? 'good' : 'bad') : '';
	});
	
	// "plus/minus (inverted)"
	Handlebars.registerHelper("pmi", function(obj) {
		return typeof parseFloat(obj) == "number" ? (obj >= 0 ? 'bad' : 'good') : '';
	});
	
	Handlebars.registerHelper("ago", function(context,formatString) {
		var isTimestamp,when;
		
		if (typeof context === 'number') {
			when = moment.unix(context);
		} else {
			isTimestamp = context.match(/^\d+\.?\d+$/);
			
			if (isTimestamp && isTimestamp[0].length === context.length) {
				when = moment.unix(context);
			} else {
				if (arguments.length < 3) formatString = '';
				when = moment(context,formatString);
			}
		}
		
		if(when.isValid())
			return new Handlebars.SafeString(when.fromNow());
		return '';
	});
	
	Handlebars.registerHelper("formatDate", function(/* d,fmtStr */) {
		var dt,fs,ctx;
		
		arguments = Array.prototype.slice.call(arguments);
		
		ctx = arguments.pop();
		
		dt = arguments[0];
		fs = arguments[1] || "YYYY-MM-DD";
		
		if(typeof dt == 'undefined' || dt == null) {
			return 'Never';
		}
		
		return moment(dt).format(fs);
	});
	
	Handlebars.registerHelper("hourFormat", function(d) {
		return d == 12 ? "NOON" : (d % 12) + (d / 12 < 1 ? "AM" : "PM")
	});
	
	
	Handlebars.registerHelper("delta", function(diff, pct, decimals) {
		
		if(typeof decimals == undefined) decimals = 0;
		
		var pm = typeof parseFloat(diff) == "number" ? (diff >= 0 ? 'good' : 'bad') : '';
		
		var difff = parseFloat(diff);
		diff = typeof difff == "number" && !isNaN(difff) ? difff.toMoney(decimals) : diff;
		
		var pctf = parseFloat(pct);
		pct = typeof pctf == "number" && !isNaN(pctf) ? (pctf.toMoney(1) + '%') : pct;
		
		var s = '<span class="delta ' + pm +'"><span class="diff">' + 
			diff + '</span> <span class="pct">' + pct + '</span></span>';
		
 		return new Handlebars.SafeString(s);
 	});
	
	Handlebars.registerHelper("progress", function(percent, yellow, red, extraclasses) {
		
		extraclasses = typeof extraclasses == 'string' || '';
		
		var pctf = parseFloat(percent);
		pct = (typeof pctf == "number" && !isNaN(pctf)) ? pctf : 0;
		
		var rf = parseFloat(red);
		var yf = parseFloat(yellow);
		if(typeof rf == 'number' && rf <= pctf)
			barcolor = 'progress-bar-danger';
		else if (typeof yf == 'number' && yf <= pctf)
			barcolor = 'progress-bar-warning';
		else
			barcolor = 'progress-bar-success';
		
		// clamp the width number
		var w = pct > 100 ? 100 : (pct < 0 ? 0 : pct);
		w = w.toMoney(1);
		
		var s = '<div class="progress ' + extraclasses + '">' +
				'<div class="progress-bar ' + barcolor + '" style="width: ' + w + '%;">' + (pct|0) + '%</div></div>';
		
 		return new Handlebars.SafeString(s);
 	});
	
 	
	Handlebars.registerHelper('cmp',function(v1,op,v2,context){
		var ops = {
				'===': function(l,r){ return l===r; },
				'!==': function(l,r){ return l!==r; },
				'==' : function(l,r){ return l==r; },
				'!=' : function(l,r){ return l!=r; },
				'<=' : function(l,r){ return l<=r; },
				'>=' : function(l,r){ return l>=r; },
				'<'  : function(l,r){ return l<r; },
				'>'  : function(l,r){ return l>r; }
			};
		return (ops[op] && ops[op](v1,v2)) ? context.fn(this) : context.inverse(this);
	});
	
	
	Handlebars.registerHelper('default',function(val,def){
		return new Handlebars.SafeString(val ? val : def);
	});
	
	Handlebars.registerHelper('logic',function(v1,op,v2,context){
		var ops = {
				'and' : function(l,r){ return l && r; },
				'or'  : function(l,r){ return l || r; },
				'xor' : function(l,r){ return (l || r) && ! (l && r); },
				'not' : function(l,r){ return ! l; },
				'nand': function(l,r){ return ! (l && r); },
				'nor' : function(l,r){ return ! (l || r); }
			};
		return (ops[op] && ops[op](bool(v1),bool(v2))) ? context.fn(this) : context.inverse(this);
	});
	
	Handlebars.registerHelper('math', function(l,fn,r,opt) {
		l = parseFloat(l);
		r = parseFloat(r);
		
		var ops = {
				'+': l + r,
				'-': l - r,
				'*': l * r,
				'/': l / r,
				'%': l % r
			};
		
		return (opt === 'int') ? parseInt(ops[fn],10) : ops[fn];
	});
	
	
	Handlebars.registerHelper('selectOptions',function(options, selectedValue, defaultTitle, defaultValue){
		var dV = typeof defaultValue == 'undefined' || typeof defaultValue == 'object' ? '' : defaultValue;

		var def = typeof defaultTitle != 'object' && typeof defaultTitle != 'undefined' ? '' +
					'<option value="'+dV + 
					'"' + (selectedValue == dV ? ' selected="selected"' : '') + 
					'>'+defaultTitle+'</option>' : '<option selected="selected"></option>';

		return new Handlebars.SafeString(def + _(options).reduce(function(m,v){
			if (typeof v.value != 'undefined') {
				return m + 
					'<option value="'+v.value + '"' +
					 (selectedValue == v.value ? ' selected="selected"' : '') + 
					 (v.disabled == true ? ' disabled="disabled"' : '') + 
					'>'+v.title+'</option>';
			} else return m+'<option>'+v.title+'</option>';
		},''));
	});
	
	Handlebars.registerHelper('makeEnum',function(valueList){
		if (!(valueList instanceof Array)) {
			valueList = valueList.split(',');
		}
		
		valueList = _(valueList).map(function(v){
			return v.split('|');
		});
		
		return new Handlebars.SafeString(_(valueList).reduce(function(m,v){
			if (v.length === 2) {
				return m+'<option value="'+v[0]+'">'+v[1]+'</option>';
			} else return m+'<option>'+v[0]+'</option>';
		},''));
	});
	
	// google places convert number to word description
	Handlebars.registerHelper("googleplacesrating", function(rating) {
		rating = parseFloat(rating);

		if (rating == 0) {
			return 'Poor';
		} else if (rating == 1) {
			return 'Good';
		} else if (rating == 2) {
			return 'Very Good';
		} else if (rating == 3) {
			return 'Excellent';
		} else { 
			return '';
		}

	});

	// formats numbers to desired decial places
	Handlebars.registerHelper("numFormat", function(num, decimals) {
		var num = parseFloat(num);
		return num.toFixed(decimals);
	});
	

	Handlebars.registerHelper('select', function( value, options ){
        var $el = $('<select />').html( options.fn(this) );
        $el.find('[value=' + value + ']').attr({'selected':'selected'});
        return $el.html();
    });
});