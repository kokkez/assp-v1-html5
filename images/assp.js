// ASSP framework
var
D = self.document,
H = D.documentElement || D.body;

function initmenus() {
	var
	K = [];	//	save keywords to sort later

	//	add ID, REL & CLASS to tags menu anchors
	$('.tags li > a').each(function(e,i,t){
		t = e.textContent.trim();
		e.id = 'kw_'+ t;
		//	populating the K array, that become our alpha menu
		K[i] = '<li><a rel="'
			+ ( e.rel = t.toLowerCase() ) +'" class="'
			+ ( e.className = $(e).data('d') == $(e).data('c') ? 'word' : 'word custom' )
			+'">'+ t +'</a><i></i></li>';
	});
	$('.words').html(K.sort().join(''));

	//	open the parent in tags menu, if location.hash matches
	if (K = location.hash) {	//	free memory by reusing the var
		K = $('#kw_'+ K.substr(1));
		0 in K && K.parents('[data-g]').addClass('opened');
	}
};

function typeAhead(v,r) {	//	value, placeholder
	r = '#quickfind';
	r = 0 in arguments ? $(r).val(v) : $(r);
	v = r.val();
	try {
		r = new RegExp(v,'i');
		r.test('abc');
	} catch(r) {
        return alert('RegEx error (fn typeAhead): '+ r);
	}
	$('.words a').each(function(e){
		e.parentNode.style.display = (v == '' || r.test(e.innerHTML)) ? '' : 'none';
	});
};

function theApply(b,f) {
	if (0 in (f = $('#ASSPconfig'))) {
		if ('theButtonX' in f[0]) f[0].theButtonX.value='Apply Changes';
		f[0].submit();
	}
};

function REplace(v,t) {	//	event, element target
	if (0 in (t = $(t.data('target')))) {
		try {
			t.val(t.val().replace(
				eval("/"+ $("#find").val() +"/ig"),
				$("#replace").val()
			));
		} catch(t){};
	}
};

function pOpener(id,url,height) {
	var
	W = window,
	w = W.open(url,id,"location=0,menubar=0,status=0,resizable=1,width=720,height="
		+ height +",overflow=scroll,scrollbars=1,toolbar=0,directories=0,personalbar=0"
	);
	//	this give the focus to the popup window, if we open a new popup without closing the old one
	return W.focus && !!w.focus();
};
function popFileEditor(f,n) {
	return pOpener(
		"FileEditor",
		"edit?file="+ escape(unescape(f)) +"&note="+ n,
		(n == 0) ? 500 : (n == "m") ? 580 : 550
	);
};
function popAddressAction(addr) {
	return pOpener("AddressAction","addraction"+ (addr ? "?address="+ escape(addr) : ""),500);
};
function popIPAction(ip) {
	return pOpener("IPAction","ipaction"+ (ip ? "?ip="+ escape(ip) : ""),500);
};
function popSyncEditor(c) {
	$.cookie('lastAnchor',c);
	return pOpener("SyncEditor","syncedit?cfgparm="+ escape(c),400);
};
function remember() {
	return pOpener("rememberMe","remember",580);
};

function inViewport(e,m) {	//	element, margin in px
	e = $(e).offset();
	m = ~~(m || 0);

	e.minTop = H.scrollTop + m;
	e.maxTop = e.minTop + self.innerHeight - m - m;
	e.margin = m;
	e.minLeft = H.scrollLeft + m;
	e.maxLeft = e.minLeft + self.innerWidth - m - m;

	return e;
};

function tip(e,c) {	//	element, content
	var o, d, b = $(".tipbox");
	e = $(e)[0];

	if (e && 0 in b) {
		o = inViewport(e,20);	//	offsets of element, with margin
		d = 0 in $(e).parents('.content') ? 1 : 2;

		b.html(c).css({
			"top" : Math.max(
				o.minTop,
				o.top + o.height - o.scrollTop + (d * self.pageYOffset)
			),
			"left" : Math.max(
				o.minLeft,
				o.left + o.width - o.scrollLeft + (d * self.pageXOffset)
			)
		}).show();

		c = inViewport(b,20);	//	offsets of tipbox, with margin
		//	if too bottom
		if (c.top + c.height > c.maxTop) b.css("top",Math.min(
			c.maxTop - c.height,
			o.top - c.height - o.scrollTop + (d * self.pageYOffset)
		));
		//	if too right
		if (c.left + c.width > c.maxLeft) b.css("left",Math.min(
			c.maxLeft - c.width,
			o.left - c.width - o.scrollLeft + (d * self.pageXOffset)
		));

		$(e).on('mouseout',function(){ b.hide() });
    }
	return !1;
};

function tipBox(e,w) {	//	element, word id
	w = $('#kw_'+ w);
	if (e && 0 in w) {
		var
		n = '( <i>empty</i> )',
		d = w.data('d').trim() || n,
		c = w.data('c').trim() || n;
		return tip(e,'<dl><dt>name:</dt><dd>'+ w.text() +'</dd>\
<hr /><dt>group:</dt><dd>'+ (w.parents('[data-g]').find('h3').text().trim() || n) +'</dd>\
<hr /><dt>description:</dt><dd>'+ (w.data('hint').trim() || n) +'</dd>\
<hr /><dt>default value:</dt><dd>'+ (d.length > 60 ? d.substr(0,60) +'...' : d) +'</dd>\
<hr /><dt>current value:</dt><dd>'+ (c.length > 60 ? c.substr(0,60) +'...' : c) +'</dd>\
</dl>');
    }
};

function onHovers(v,e) {	//	event mouseover, placeholder
	e = $(v.target);
	if (e.is('.word') || e.is('[data-hint]')) {
		tipBox(e,e.text());
	}
	if (e.is('[data-tip]')) {
		tip(e,e.data('tip'))
	}
};

function onMousedowns(v,e) {	//	event mousedown, placeholder
	e = $(v.target);

	//	show / hide sections in tagmenu
	if (e.is('.tags h3')) {
		e.parent().toggleClass('opened');
	}

	//	show / hide sections in tagmenu
//	if (e.is('.content h2[rel]')) {
//		$('#'+ e.attr('rel')).toggleClass('closed');
//	}

	//	reset value to factory default
	if (e.is('#ASSPconfig .factory')) {
//		console.log(e);
		if (v = $($('#ASSPconfig').prop(e.text()))) {
			if (e.is('.checkbox')) {
				v[0].checked = eval(e.data('def'));
			} else {
				v.val(e.data('def'));
			}
		}
	}
};

function onClicks(v,e) {
	e = $(v.target);
	if (e.is('[href="#"]')) {
		v.preventDefault();
	}
	//	click on capital letters
	if (e.is('.alpha a')) {
		typeAhead('^'+ e.text());
		v.preventDefault();
//		$.cookie('lastAnchor',location.hash=e.hash);
	}
	//	reset quickfind
	if (e.is('.quickfind a')) {
		typeAhead('');
	}

	//	buttons in .camp, but also A tags eslewhere
	if (e.is('[data-path]')) {
		popFileEditor(e.data('path'),e.data('note'));
	}

	//	log lines: ip, email, files
	if (e.is('.line .ip')) {
		popIPAction(e.text());
	}
	else if (e.is('.line .path')) {
		popFileEditor(e.text(),'m');
	}
	else if (e.is('.line .email')) {
		popAddressAction(e.text());
	}
	//	the apply button
	if (e.is(".apply")) {
		theApply(e);
	}
	//	find and replace
	if (e.is(".replacer button")) {
		REplace(v,e);
	}
	//	keywords click
	if (e.is('.word')) {
		location.href = "./#"+ e.text()
	}
};

function showhint(c,e,v,w,l) {	//	content, element, eVent, width, location
	tip(e,c);
};

function slide(e) {
	e = $('#trigger');
	if (0 in e) e[0].checked = !e[0].checked;
};

function toggleTbody(id) {
	$('#'+id).toggleClass('off');
};

function zebraLines() {
	$('.line.odd').toggleClass('zebra');
};
