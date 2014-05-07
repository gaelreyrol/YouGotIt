$(document).ready(function()
{
	userDetails = getUserlocalStorage();
	if (userDetails)
		youtubeId = getYoutubeId();
	

	$('body').append('<section id="toolbar"></section>');
	isConnect();
	$('#watch7-subscription-container').prepend('<span id="streamnation"><a id="button-add">Add</a> or <a id="button-sub">Subscribe</a></span>');


	$(document).on('click', '#button-add', function() {
		if (toggle == 0)
			showToolbar();
		if (!userDetails)
			return ;
		var videoUrl = "http://www.youtube.com/watch?v=" + $("meta[itemprop=videoId]").attr("content");
		channelId = getChannelId(youtubeId);
		$.ajax({
			type: "POST",
			url: "http://api.streamnation.com/api/v1/weblink/download",
			data: {auth_token: userDetails.auth_token, uri: videoUrl, parent_id: channelId},
			beforeSend: function () {
				$('#messages').prepend("<p id='process'>Waiting...</p>");
			},
			success: function(data) {
				storeVideoData(data.content);
				$("#process").remove();
				$(".sub").fadeOut().remove();
				$(".add").fadeOut().remove();
				$('#messages').prepend("<p id='success'>Video added !<span id='dismiss'>x</span></p>");
				getAdds();
				getSubscribes();
				
			},
			error: function() {
				$("#process").remove();
				$('#messages').prepend("<p id='error'>An error occured, please try again.<span id='dismiss'>x</span></p>");
			}
		});
	});
	$(document).on('click', '#button-sub', function() {
			
	});
	$(document).on('click', '.delete-subs', function() {
		var channelid = $(this).attr("id");
		var channel = $("#" + channelid).parent().parent();
		$.ajax({
			type: "DELETE",
			url : "http://api.streamnation.com/api/v1/content/" + channelid,
			data: {auth_token: userDetails.auth_token},
			BeforeSend: function() {
				$('#messages').prepend("<p id='process'>Waiting...</p>");	
			},
			success: function() {
				channel.fadeOut();
				$("#process").remove();
				$('#messages').prepend("<p id='success'>Subscribe deleted !<span id='dismiss'>x</span></p>");
			},
			error: function() {
				$("#process").remove();
				$('#messages').prepend("<p id='error'>An error occured, please try again.<span id='dismiss'>x</span></p>");
			}
		});
	});
	$(document).on('click', '#signin', function() {
		console.log("login");
		var emailInput = $("#email").val();
		var passwordInput = $("#password").val();
		var agreeCheck = $("#agree");
		if (!emailInput || !passwordInput)
		{
			if ($("#error").length)
				$("#error").remove();
			$('#errors').prepend("<p id='error'>E-mail or password incorrect.<span id='dismiss'>x</span></p>");
			return ;
		}
		if (!agreeCheck.prop('checked', true))
		{
			if ($("#error").length)
				$("#error").remove();
			$('#errors').prepend("<p id='error'>You must agree to use this.<span id='dismiss'>x</span></p>");
			return ;
		}
		$.ajax({
			type: "POST",
			url: "http://api.streamnation.com/api/v1/auth",
			data: {identity: emailInput, password: passwordInput},
			beforeSend:function() {
				$('#errors').prepend("<p id='process'>Waiting...</p>");
			},
			success: function(data) {
		  		$('#form-connect').fadeOut().remove();
				$('#form-register').fadeOut().remove();
				$("#close").fadeOut().remove();
				console.log("Connected");
				storeUserData(data);
				userDetails = getUserlocalStorage();
				youtubeId = getYoutubeId();
  				isConnect();
			},
			error: function() {
				if (!$("#error").length)
					$("#error").remove();
				$("#process").remove();
				$('#errors').prepend("<p id='error'>E-mail or password incorrect.");
				return ;
			}
		});
	});
	$(document).on('click', '#signout', function(){
		signOutUser();
	});
	$(document).on('click', '#close', function () {
		showToolbar();	
	});	
	$(document).on('click', '#dismiss', function () {
		$(this).parent().fadeOut().remove();
	});

	setInterval(function() {
		$("#success").fadeOut().hidden;
	},6000);
});
