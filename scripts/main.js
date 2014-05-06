$(document).ready(function()
{
	var loader = $("#loader");
	var picture = $('#picture');
	var count = 0;
	var count2 = 0;
	var degree = 0;
	var timer;
	function test()
	{
	loader.knob();
	timer = setInterval(function(e)
	{
		
		loader.val(count++);
		loader.change();
		if (count == 101)
		{
			clearInterval(timer);
			$('#loader-knob').fadeOut();
			$('#name').animate({ marginLeft : '-100px', opacity : 1},1000);
			$('#picture-avatar').css('width', count2);
			$('#picture-avatar').animate({height : count2 + 'px'},1000, function()
				{
			$('#picture-avatar').css('background-attachment', 'scroll');
});
		}
	}, 10);
	}
	zoom = setInterval(function(e)
	{
		count2++;
		picture.css({
			'width' 		: count2,
			'height' 		: count2,
			'margin-top' 	: count2 / 2 * -1,
			'margin-left' 	: count2 / 2 * -1
		});
		
		
		if (count2 == 125)
		{
			clearInterval(zoom);
			test();
		}
	}, 'easeInBounce', 7 );
	$('#picture-avatar').click(function()
	{
		$('#name').animate({ marginLeft : '-200px', opacity : 0},1000);
		rotation = setInterval(function()
		{
		degree++;
		$('#picture').css('-webkit-transform','rotateY(' + degree  + 'deg)');
		$('#picture').css('transform','rotateY(' + degree + 'deg)');
		if (degree == 90)
		{
			clearInterval(rotation);
		}
		}, 3);
	});
	

});
