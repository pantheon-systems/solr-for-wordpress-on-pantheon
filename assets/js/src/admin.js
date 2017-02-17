jQuery(document).ready(function () {
	var refURI = jQuery('input[name="_wp_http_referer"]').val();
	refURI = refURI.replace(/#.*$/, '');
	jQuery('#solr-tabs').find('a').click(function () {
			jQuery('#solr-tabs').find('a').removeClass('nav-tab-active');
			jQuery('.solrtab').removeClass('active');

			var id = jQuery(this).attr('id').replace('-tab', '');
			jQuery('#' + id).addClass('active');
			jQuery(this).addClass('nav-tab-active');
			jQuery('input[name="_wp_http_referer"]').val(refURI + '#top#' + id);
		}
	);

	// init
	var solrActiveTab = window.location.hash.replace('#top#', '');

	// default to first tab
	if (solrActiveTab === '' || solrActiveTab === '#_=_') {
		solrActiveTab = jQuery('.solrtab').first().attr('id');
	}

	jQuery('#' + solrActiveTab).addClass('active');
	jQuery('#' + solrActiveTab + '-tab').addClass('nav-tab-active').click();

});

var $j = jQuery.noConflict();

function switch1() {
	if ($j('#solrconnect_single').is(':checked')) {
		$j('#solr_admin_tab2').css('display', 'block');
		$j('#solr_admin_tab2_btn').addClass('solr_admin_on');
		$j('#solr_admin_tab3').css('display', 'none');
		$j('#solr_admin_tab3_btn').removeClass('solr_admin_on');
	}
	if ($j('#solrconnect_separated').is(':checked')) {
		$j('#solr_admin_tab2').css('display', 'none');
		$j('#solr_admin_tab2_btn').removeClass('solr_admin_on');
		$j('#solr_admin_tab3').css('display', 'block');
		$j('#solr_admin_tab3_btn').addClass('solr_admin_on');
	}
}


function doLoad($type, $prev) {
	$j.post(solr.ajax_url, {
		action  : 'solr_options',
		security: solr.security,
		method  : 'load',
		type    : $type,
		prev    : $prev
	}, function (response) {
		var data = JSON.parse(response);
		$j('#percentspan').show().text(data.percent + "%");
		if (!data.end) {
			doLoad(data.type, data.last);
		} else {
			$j('#percentspan').hide();
			enableAll();
		}
	});

	// handleResults, "json");
}

function handleResults(data) {

	$j('#percentspan').text(data.percent + "%");
	if (!data.end) {
		doLoad(data.type, data.last);
	} else {
		$j('#percentspan').remove();
		enableAll();
	}
}

function disableAll() {
	$j.each(solr.post_types, function (index, value) {
		$j('[name=s4wp_postload_' + value.post_type).attr('disabled', 'disabled');
	});
	$j('[name=s4wp_deleteall]').attr('disabled', 'disabled');
	$j('[name=s4wp_init_blogs]').attr('disabled', 'disabled');
	$j('[name=s4wp_optimize]').attr('disabled', 'disabled');
	$j('[name=s4wp_ping]').attr('disabled', 'disabled');
	$j('#settingsbutton').attr('disabled', 'disabled');
}
function enableAll() {
	$j.each(solr.post_types, function (index, value) {
		$j('[name=s4wp_postload_' + value.post_type + ']').removeAttr('disabled');
	});
	$j('[name=s4wp_postload]').removeAttr('disabled');
	$j('[name=s4wp_deleteall]').removeAttr('disabled');
	$j('[name=s4wp_init_blogs]').removeAttr('disabled');
	$j('[name=s4wp_optimize]').removeAttr('disabled');
	// $j('[name=s4wp_pageload]').removeAttr('disabled');
	$j('[name=s4wp_ping]').removeAttr('disabled');
	$j('#settingsbutton').removeAttr('disabled');
}

$j(document).ready(function () {
	$j('#percentspan').hide();
	switch1();
	$j('.s4wp_postload_post').click(function () {
		disableAll();
		doLoad('post', 0);
	});

});

(function($){

	var solrActions = {

		init: function() {
			this.bindEvents();
		},

		bindEvents: function() {
			$('[name=s4wp_start_index]').on('click',$.proxy(this.indexPosts,this));
			$('[name=s4wp_resume_index]').on('click',$.proxy(this.indexPosts,this));
		},

		disableAll: function() {
			$('.solr-admin-action').attr('disabled','disabled');
		},

		enableAll: function() {
			$('.solr-admin-action').removeAttr('disabled');
		},
		
		indexPosts: function(e) {
			disableAll();
			var el = $(e.currentTarget);
			console.log( 'indexPosts' );
		}
	}
	
	$(document).ready($.proxy(solrActions.init,solrActions));

}(jQuery));
