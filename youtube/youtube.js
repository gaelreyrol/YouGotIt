
$(document).ready(function()
{
	$('body').append('<section id="mytoolbar"></section>');
	isConnect();
//	$('body').append('<section id="triangle"></section>');

	
	$('#watch7-subscription-container').prepend('<span id="streamnation"><a id="button-add">Add</a> or <a id="button-sub">Subscribe</a></span>');
	$(document).on( 'click', '#streamnation', function()
	{

		showToolbar();
  		if (connect == 1)
		{
			$('#form-connect').fadeOut().remove();
			isConnect();
		}


	});
	$(document).on( 'click', '#connexion', function()
	{
  		$('#form-connect').fadeOut().remove();
  		connect = 1;
  		isConnect();
	});
	
});
