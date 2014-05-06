
$(document).ready(function()
{
	$('body').append('<section id="mytoolbar"></section>');
	isConnect();
//	$('body').append('<section id="triangle"></section>');

	
	$('#watch7-subscription-container').prepend('<span id="follow">follow to Streamnation</span>');
	$(document).on( 'click', '#follow', function()
	{
		alert( "A toi de definir une action" ); 
	});
	$(document).on( 'click', '#connexion', function()
	{
  		$('#form-connect').fadeOut().remove();
  		connect = 1;
  		isConnect();
	});
	
});