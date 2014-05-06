var toggle = 0;
var size_window = $(window).width();
var position = (size_window - 1040) / 2;
var userDetails = null;


function isConnect()
{
	if(!userDetails)
	{
		$('#toolbar').append('\
			<span id="close">x</span>\
			<section id="form-connect">\
			<h3 class="title-form">Signin <small class="sub-title-form">StreamNation</small></h3>\
			<div id="errors"></div>\
			<input type="email" placeholder="E-mail" id="email"/>\
			<input type="password" placeholder="Password" id="password"/></br>\
			<input type="checkbox" name="agree" value="yes">I agree with sharing my settings</br>\
			<input type="submit" class="button" value="Sign In" id="signin"/>\
			</section></br>\
			<section id="form-register">\
				<a href="https://www.streamnation.com/" class="button">Not yet registered ?</a>\
			</section>');
	}
	else
	{
		$('#toolbar').append('\
			<span id="close">x</span>\
			<img id="avatar" src="' + userDetails.user.avatar_url + '">\
			<a id="signout" class="button">Sign Out</a>\
			<a id="profile" class="button">Account Details</a>\
			<div class="title-welcome"><small class="sub-title-welcome">Hello, </small> ' + userDetails.user.first_name + '</div>\
			<section class="category">Latest Adds</section>\
			<section class="category">My Subscribes</section>\
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
		$('#toolbar').show().animate(
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
		$('#toolbar').animate({
			right: "-300px"}, 1000);
	}
	toggle = (toggle == 1) ? 0 : 1;
}

function showInfoBulle()
{
	if(toggle == 0)
	{
		$('#toolbar, #triangle').show().animate(
		{
			bottom: "30px",
			opacity: 1
		}, 1000);
	}
	else
	{
		$('#toolbar, #triangle').animate({
			bottom: "-100px",
			opacity: 0}, 1000);
	}
	toggle = (toggle == 1) ? 0 : 1;
}

function getUserlocalStorage()
{
	if (localStorage['st_user_details'])
		return JSON.parse(localStorage['st_user_details']);
	else
		return null;
}

function storeUserData(data) {
	localStorage['st_user_details'] = JSON.stringify(data);
	console.log("User :" + localStorage['st_user_details']);
}

function signOutUser() {
	delete window.localStorage["st_user_details"]
	userDetails = null;
	console.log("Disconnect : " + userDetails);
	showToolbar();
	$("#toolbar").empty();
	isConnect();
}

