(function($){
	$(function(){
		var $form = $('#esajaxform');
		var $selected = $('#facet-selected');

		var onresponse = function(data){
			$selected.find('.facet-item.removable').hide();

			$.each(data.faceting, function(type){
				var container = $("#facet-" + type + '-available');
				var me = this;

				if(me.min > 0){
					container.find('.facet-item').hide();

					if(me.min < data.found){
						$.each(this.available, function(slug){
							if(this.count > 0 && this.count < data.found){
								var li = $("#facet-" + type + '-' + slug);

								li.find('.count').text('(' + this.count + ')').show();
								li.show();
								container.show();
							}
						});

						if(window.esselected && window.esselected.showEmpty == 1){
							container.find('.facet-empty').hide();
						}
					}else{
						if(window.esselected && window.esselected.showEmpty == 1){
							container.find('.facet-empty').show();
						}else{
							container.hide();
						}
					}
				}else{
					container.hide();
				}

				$.each(this.selected, function(slug){
					var li = $("#facet-" + type + '-' + slug);
					
					if(!window.esselected || window.esselected.showEmpty != 1 || total < data.found){
						li.find('.count').hide();
						li.show();
					}

					$("#facet-" + type + '-' + slug + '-selected').show();
				});
			});

			if($selected.find('.facet-item:visible').length > 0){
				$selected.show();
			}

			var $el = $(window.esfaceting.replace);

			$el.empty().html(data.content);
			$(document).scrollTop($el.offset().top);	
		};

		var buildQuery = function(){
			var s = [];

			var terms = $selected.find('.term');
			terms.each(function(){
				s.push($(this).data('term'));
			});

			if(terms.length == 1){
				terms.each(function(){
					$(this).removeClass('removable').html($(this).text());
				});
			}

			return $form.serialize() + '&esasync=1&s=' + s.join(' ');
		}

		$form.find('input[type=checkbox]').change(function(){
			var url = $form.attr('action');

			$.getJSON(url, buildQuery(), onresponse);
		});

		$form.find('.clear-inner').click(function(){
			$form[0].reset();

			$.getJSON($(this).attr('href'), buildQuery(), onresponse);

			return false;
		});

		$selected.find('.term a').click(function(){
			$(this).parent().remove();

			var s = '';

			var terms = $selected.find('.term');
			terms.each(function(){
				s += $(this).data('term');
			});

			if(terms.length == 1){
				terms.each(function(){
					$(this).removeClass('removable').html($(this).text());
				});
			}

			$.getJSON('#', buildQuery(), function(data){
				$(this).parent().remove();

				onresponse(data);
			});

			return false;
		});

		$selected.find('.facet-item a').click(function(){
			var selector = $(this).attr('href');

			$(selector).find('input').click();

			return false;
		});

		$(document).on('click', '.pagination a, .navigation a', function(){
			$.getJSON($(this).attr('href'), $form.serialize() + '&esasync=1', onresponse);

			return false;
		});
	});
})(jQuery);