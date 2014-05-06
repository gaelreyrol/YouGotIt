var toggle = 0;
var size_window = $(window).width();
var position = (size_window - 1040) / 2;
var connect = 0;
function isConnect()
{
	if(connect == 0)
	{
		$('#mytoolbar').append('\
			<section id="form-connect">\
			<h3>Connexion</h3>\
			<input type="text" placeholder="Your Login" id="login"/>\
			<input type="password" placeholder="Your Password" id="password"/>\
			<input type="submit" value="Connexion" id="connexion"/>\
			</section>');
	}
	else
	{
		$('#mytoolbar').append('\
		<img id="my-avatar" src="http://imageshack.com/a/img843/9840/1pl6f.jpg">\
		<section id="categorie1" class="categorie">Derniers Ajouts</section>\
		<section id="categorie3" class="categorie">Mes Abonnements</section>\
		');
	}
}
function showToolbar()
{

	if(toggle == 0)
	{
		$('html').css('right', position + 'px');
		$('html').css('overflow', 'hidden');
		$('html').css('position', 'absolute');
		$('html').animate(
		{
			right: "300px"
		}, 1000).fadeIn();
		$('#mytoolbar').show().animate(
		{
			right: "0px"
		}, 1000);
	}
	else
	{
		$('html').animate({
			right: position +"px"
		}, 1000, function()
		{
			$('html').css('position', 'static');
		});
		$('#mytoolbar').animate({
			right: "-300px"}, 1000);
	}
	toggle = (toggle == 1) ? 0 : 1;
}

function showInfoBulle()
{
	if(toggle == 0)
	{
		$('#mytoolbar, #triangle').show().animate(
		{
			bottom: "30px",
			opacity: 1
		}, 1000);
	}
	else
	{
		$('#mytoolbar, #triangle').animate({
			bottom: "-100px",
			opacity: 0}, 1000);
	}
	toggle = (toggle == 1) ? 0 : 1;
}

function ActivateIcon() {
	console.log("activate icon");
}
