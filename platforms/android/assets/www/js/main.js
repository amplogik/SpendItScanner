/******************************************************************************/
/* GLOBALS                                                                    */
/** *************************************************************************** */
var db;
var userInfo = {};
var loginStatus = '';
var loginMessage = '';
var dealsDetailCode = '';
var dealsDetailHeadline = '';
var dealsDetailMerchant = '';
var merchantDetailCode = '';

/** *************************************************************************** */
/* PAGE CREATE */
/** *************************************************************************** */
$(document).on(
		"pagecreate",
		"#homePage",
		function(event) {
			var db = window.openDatabase("Database", "1.0", "User Settings",200000);
			db.transaction(populateDB, errorCreate, successCB);
			db.transaction(getUserInfo, errorSelect, successCB);
			var httpResponse = $.get("https://www.spendit.com/news.json.php");
			httpResponse.done(function(data) {
				news = JSON.parse(data);
				var html = '';
				var scoreCode = {};
				$.each(news, function() {
					$.each(this, function(field, value) {
						news[field] = value;
					});
					html = '';
					html += '<div class="date">' + news['date'] + '</div>';
					html += '<div class="headline">' + news['headline'] + '</div>';
					html += '<div class="image"><img src="' + news['image'] + '" style="max-width: 100%; height: auto; width: auto;"></div>';
					html += '<div class="body">' + news['story'] + '</div>';
				});
				// console.log('WEB: sending news');
				$("#news").append('<div class="newsStory" style="border: 1px solid #DEDEDE;">' + html + '</div>');
			});
		});

$(document).on("pagecreate", "#settingsPage", function(event) {
	$('#loginError').hide();
});

$(document).on(
		"pagecreate",
		"#dealsPage",
		function(event) {
			var httpResponse = $.get(
				"https://www.spendit.com/scorecodes.json.php?token="+ userInfo['loginToken']);
			httpResponse.done(function(data) {
				scorecodes = JSON.parse(data);
				var html = '';
				var scoreCode = {};
				$.each(scorecodes, function() {
					$.each(this, function(field, value) {
						scoreCode[field] = value;
					});
					//var msec = Date.parse(scoreCode['Expires']);
					//var d = new Date(msec);
					var dateString = scoreCode['Expires'];
					var d = new Date(dateString.replace(/-/g, '/'));
					var m_names = new Array("January", "February", "March",
							"April", "May", "June", "July", "August",
							"September", "October", "November", "December");
					var day = d.getDate();
					var month = d.getMonth();
					var year = d.getFullYear();
					var fmtDate = m_names[month] + ' ' + day + ' ' + year;

					html = '';
					html += '<div class="company" style="text-align: left; max-width: 65%; height: auto; width: auto;">' + scoreCode['CompanyName']+ '</div>';
					html += '<div class="headline" style="max-width: 65%; height: auto; width: auto; overflow: hidden; ">' + scoreCode['Headline']+ '</div>';
					html += '<div class="scorecode">' + scoreCode['ScoreCode']+ '</div>';
					html += '<div class="expires">Exp: ' + fmtDate+ '</div>';
					$("#scoreCodes").append(
							'<div class="scoreCodeSummary ui-btn ui-btn-icon-right ui-icon-carat-r" id="'
									+ scoreCode['ScoreCode'] + '"><img style="max-width: 15%; height: auto; width: auto;"src="https://www.spendit.com/images/products/thumb/'+ scoreCode['ScoreCodeID'] +'.jpg" align="left" class="summaryImg">' + html
									+ '</div>');
				});
			});
		});

$(document).on(
		"pagecreate",
		"#dealsDetailPage",
		function(event) {
			$("#scoreCodeDetail").html('');
			var url = "https://www.spendit.com/scorecodes.json.php?token="
					+ userInfo['loginToken'] + '&scorecode=' + dealsDetailCode;
			console.log(url);
			var httpResponse = $.get(url);
			httpResponse.done(function(data) {
				scorecodes = JSON.parse(data);
				var html = '';
				var scoreCode = {};
				$.each(scorecodes, function() {
					$.each(this, function(field, value) {
						scoreCode[field] = value;
					});
				});
				//var msec = Date.parse(scoreCode['Expires']);
				//var d = new Date(msec);
				var dateString = scoreCode['Expires'];
				var d = new Date(dateString.replace(/-/g, '/'));
				var m_names = new Array("January", "February", "March",
						"April", "May", "June", "July", "August", "September",
						"October", "November", "December");
				var day = d.getDate();
				var month = d.getMonth();
				var year = d.getFullYear();
				var fmtDate = m_names[month] + ' ' + day + ' ' + year;
				scoreCode['Picture'] = '<img style="max-width: 100%; height: auto; width: auto;" src="https://www.spendit.com/images/products/thumb/'+ scoreCode['ScoreCodeID'] +'.jpg">';
				//scoreCode['Barcode'] = '[Barcode Coming Soon]';
				html = '';
				if(typeof(scoreCode['Headline']) != "undefined" && scoreCode['Headline'] != '' && scoreCode['Headline'] != 'null' ){
					html += '<div class="detail_heading">' + scoreCode['Headline']+ '</div>';
				}
				if(typeof(scoreCode['SubHeading']) != "undefined" && scoreCode['SubHeading'] != '' && scoreCode['SubHeading'] != 'null'){
					html += '<div class="detail_subheading">'+ scoreCode['SubHeading'] + '</div>';
				}
				if(typeof(scoreCode['Picture']) != "undefined"  && scoreCode['Picture'] != '' && scoreCode['Picture'] != 'null'){
					html += '<div class="detail_picture">' + scoreCode['Picture']+ '</div>';
				}
				if(typeof(scoreCode['OfferDescription']) != "undefined"  && scoreCode['OfferDescription'] != '' && scoreCode['OfferDescription'] != 'null'){
					html += '<div class="detail_description">'+ scoreCode['OfferDescription'] + '</div>';
				}
				html += '<div class="detail_dates">Valid until ' + fmtDate + '</div>';
				/*
				if(typeof(scoreCode['Keywords']) != "undefined"  && scoreCode['Keywords'] != '' && scoreCode['Keywords'] != 'null'){
					html += '<div class="detail_keywords">' + scoreCode['Keywords'] + '</div>';
				}
				*/
				if(typeof(scoreCode['Limitation']) != "undefined"  && scoreCode['Limitation'] != '' && scoreCode['Limitation'] != 'null'){
					html += '<div class="detail_limitation">'+ scoreCode['Limitation'] + '</div>';
				}
				if(typeof(scoreCode['Price']) != "undefined" && scoreCode['Price'] > 0){
					html += '<div class="detail_price">$' + scoreCode['Price']+ '</div>';
				}
				if(typeof(scoreCode['CompanyName']) != "undefined"  && scoreCode['CompanyName'] != '' && scoreCode['CompanyName'] != 'null'){
					html += '<div class="detail_company">'+ scoreCode['CompanyName'] + '</div>';
				}
				if(typeof(scoreCode['Headline']) != "undefined"  && scoreCode['Headline'] != '' && scoreCode['Headline'] != 'null'){
					dealsDetailHeadline = scoreCode['Headline'];
				} else {
					dealsDetailHeadline = '';
				}
				if(typeof(scoreCode['Limitation']) != "CompanyName"  && scoreCode['CompanyName'] != '' && scoreCode['CompanyName'] != 'null'){
					dealsDetailMerchant = scoreCode['CompanyName'];
				} else {					
					dealsDetailMerchant = '';
				}
				if(typeof(scoreCode['Address']) != "undefined"  && scoreCode['Address'] != '' && scoreCode['Address'] != 'null'){
					html += '<div class="detail_company">'+ scoreCode['Address'] + '</div>';
				}
				$("#scoreCodeDetail").html(html);
			});

		});

$(document).on("pagecreate", "#showQRCodePage",function(event) {
	$('#qrcode').qrcode({width: 320,height: 320,text: dealsDetailCode});
	$(".detail_heading").html(dealsDetailHeadline);
	$(".detail_company").html(dealsDetailMerchant);
	
});

$(document).on("pagecreate", "#scanRewardsPage", 		function(event) {
	var url = "https://www.spendit.com/rewards.json.php?token="
		+ userInfo['loginToken'];
	var httpResponse = $.get(url);
	httpResponse.done(function(data) {
		jsonRes = JSON.parse(data);
		var html = '';
		var myData = {};
		html = '';
		$.each(jsonRes, function() {
			$.each(this, function(field, value) {			
				html += '<div class="rewardDetail">'+ field + ':' + value + '</div>';
				myData[field] = value;
			});
		});
		$("#rewardDetails").html(html);
	});
});

$(document).on("pagecreate","#merchantPage",function(event) {
	var url = "https://www.spendit.com/merchantcodes.json.php?token="+ userInfo['loginToken'];
	var httpResponse = $.get(url);
	httpResponse.done(function(data) {
		scorecodes = JSON.parse(data);
		var html = '';
		var scoreCode = {};
		$.each(scorecodes,function() {
			$.each(this,function(field,value) {
				scoreCode[field] = value;
			});
			//var msec = Date.parse(scoreCode['Expires']);
			//var d = new Date(msec);
			var dateString = scoreCode['Expires'];
			var d = new Date(dateString.replace(/-/g, '/'));
			var m_names = new Array(
				"January",
				"February",
				"March", 
				"April",
				"May", 
				"June",
				"July", "August",
				"September",
				"October",
				"November",
				"December");
			var day = d.getDate();
			var month = d.getMonth();
			var year = d.getFullYear();
			var fmtDate = m_names[month]+ ' '+ day+ ' '+ year;
			html = '';
			html += '<div class="company" style="max-width: 65%; height: auto; width: auto; overflow: hidden;">'+ scoreCode['CompanyName']+ '</div>';
			html += '<div class="headline" style="max-width: 65%; height: auto; width: auto; overflow: hidden;" >'+ scoreCode['Headline']+ '</div>';
			html += '<div class="scorecode">'+ scoreCode['ScoreCode']+ '</div>';
			html += '<div class="expires">Exp: '+ fmtDate+ '</div>';
			if(typeof scoreCode['ScanCount'] === "undefined"){				
				scoreCode['ScanCount'] = '0';
			}
			if(scoreCode['ScanCount'] === null){
				scoreCode['ScanCount'] = '0';
			}				
			if(scoreCode['ScanCount'] === "null"){
				scoreCode['ScanCount'] = '0';
			}			
			html += '<div class="expires">Scans '+ scoreCode['ScanCount']+ '</div>';
			$("#merchantCodes").append(
				'<div class="merchantCodeSummary ui-btn ui-btn-icon-right ui-icon-carat-r" id="'
				+ scoreCode['ScoreCode'] + '"><img style="max-width: 15%; height: auto; width: auto;"src="https://www.spendit.com/images/products/thumb/'+ scoreCode['ScoreCodeID'] +'.jpg" align="left" class="summaryImg">'+ html + '</div>');
		});
	});
});

$(document).on(
		"pagecreate",
		"#merchantDetailPage",
		function(event) {
			var url = "https://www.spendit.com/merchantcodes.json.php?token="
					+ userInfo['loginToken'] + '&scorecode='
					+ merchantDetailCode;
			var httpResponse = $.get(url);
			console.log('WEB: ' + url);
			httpResponse.done(function(data) {
				scorecodes = JSON.parse(data);
				var html = '';
				var scoreCode = {};
				$.each(scorecodes, function() {
					$.each(this, function(field, value) {
						scoreCode[field] = value;
					});
				});
				//var msec = Date.parse(scoreCode['Expires']);
				//var d = new Date(msec);
				var dateString = scoreCode['Expires'];
				var d = new Date(dateString.replace(/-/g, '/'));
				var m_names = new Array("January", "February", "March",
						"April", "May", "June", "July", "August", "September",
						"October", "November", "December");
				var day = d.getDate();
				var month = d.getMonth();
				var year = d.getFullYear();
				var fmtDate = m_names[month] + ' ' + day + ' ' + year;
				scoreCode['Picture'] = '<img style="max-width: 100%; height: auto; width: auto;" src="https://www.spendit.com/images/products/thumb/'+ scoreCode['ScoreCodeID'] +'.jpg">';
				if(typeof(scoreCode['ScanCount']) == undefined ){
					scoreCode['ScanCount'] = 0;
				}
				if(scoreCode['ScanCount'] === null){
					scoreCode['ScanCount'] = 0;
				}				
				if(scoreCode['ScanCount'] == 'null'){
					scoreCode['ScanCount'] = 0;
				}
				html = '';
				
				if(typeof(scoreCode['ScanCount']) !== "undefined" && scoreCode['ScanCount'] != ''){ html += '<div class="merchant_detail_scancount">Scans: ' + scoreCode['ScanCount'] + '</div>'; }				
				if(typeof(scoreCode['Headline']) !== "undefined" && scoreCode['Headline'] != ''){ html += '<div class="merchant_detail_heading">' + scoreCode['Headline'] + '</div>'; }
				if(typeof(scoreCode['SubHeading']) !== "undefined" && scoreCode['SubHeading'] != ''){ html += '<div class="merchant_detail_subheading">' + scoreCode['SubHeading'] + '</div>'; }
				if(typeof(scoreCode['Picture']) !== "undefined" && scoreCode['Picture'] != ''){ html += '<div class="detail_picture">' + scoreCode['Picture'] + '</div>'; }
				if(typeof(scoreCode['OfferDescription']) !== "undefined" && scoreCode['OfferDescription'] != 'null' && scoreCode['OfferDescription'] != ''){ html += '<div class="detail_description">' + scoreCode['OfferDescription'] + '</div>'; }
				if(typeof(fmtDate !== "undefined")){ html += '<div class="detail_dates">Valid until ' + fmtDate + '</div>'; }
				//if(typeof(scoreCode['Keywords'] !== "undefined" && scoreCode['Keywords']) != null && scoreCode['Keywords'] != 'null' && scoreCode['Keywords'] != '' scoreCode['Keywords'] !== null){ html += '<div class="detail_keywords">' + scoreCode['Keywords'] + '</div>'; }
				if(typeof(scoreCode['Limitation']) !== "undefined" && scoreCode['Limitation'] != ''){ html += '<div class="detail_limitation">' + scoreCode['Limitation'] + '</div>'; }
				if(typeof(scoreCode['Price']) !== "undefined" && scoreCode['Price'] > 0){ html += '<div class="detail_price">$' + scoreCode['Price'] + '</div>'; }
				if(typeof(scoreCode['CompanyName']) !== "undefined"  && scoreCode['CompanyName'] != ''){ html += '<div class="detail_company">' + scoreCode['CompanyName'] + '</div>'; }
				if(typeof(scoreCode['Address']) !== "undefined" && scoreCode['Address'] != ''){ html += '<div class="detail_company">'+ scoreCode['Address'] + '</div>'; }
				$("#merchantCodeDetail").html(html);
			});
		});

/** *************************************************************************** */
/* BUTTONS */
/** *************************************************************************** */
$(document).on('click', '#saveButton', function() {
	var db = window.openDatabase("Database", "1.0", "User Settings", 200000);
	db.transaction(saveUserInfo, errorSave, successCB);
});

$(document).on('click', '.scoreCodeSummary', function() {
	var search_results = $(this).attr('id');
	console.log('WEB: clicked ' + search_results);
	dealsDetailCode = search_results;
			$("#scoreCodeDetail").html('');
			var url = "https://www.spendit.com/scorecodes.json.php?token="
					+ userInfo['loginToken'] + '&scorecode=' + dealsDetailCode;
			console.log(url);
			var httpResponse = $.get(url);
			httpResponse.done(function(data) {
				scorecodes = JSON.parse(data);
				var html = '';
				var scoreCode = {};
				$.each(scorecodes, function() {
					$.each(this, function(field, value) {
						scoreCode[field] = value;
					});
				});
				//var msec = Date.parse(scoreCode['Expires']);
				//var d = new Date(msec);
				var dateString = scoreCode['Expires'];
				var d = new Date(dateString.replace(/-/g, '/'));
				var m_names = new Array("January", "February", "March",
						"April", "May", "June", "July", "August", "September",
						"October", "November", "December");
				var day = d.getDate();
				var month = d.getMonth();
				var year = d.getFullYear();
				var fmtDate = m_names[month] + ' ' + day + ' ' + year;
				scoreCode['Picture'] = '<img style="max-width: 100%; height: auto; width: auto;" src="https://www.spendit.com/images/products/thumb/'+ scoreCode['ScoreCodeID'] +'.jpg">';
				//scoreCode['Barcode'] = '[Barcode Coming Soon]';
				html = '';
				if(typeof(scoreCode['Headline']) != "undefined" && scoreCode['Headline'] != '' && scoreCode['Headline'] != 'null' ){
					html += '<div class="detail_heading">' + scoreCode['Headline']+ '</div>';
				}
				if(typeof(scoreCode['SubHeading']) != "undefined" && scoreCode['SubHeading'] != '' && scoreCode['SubHeading'] != 'null'){
					html += '<div class="detail_subheading">'+ scoreCode['SubHeading'] + '</div>';
				}
				if(typeof(scoreCode['Picture']) != "undefined"  && scoreCode['Picture'] != '' && scoreCode['Picture'] != 'null'){
					html += '<div class="detail_picture">' + scoreCode['Picture']+ '</div>';
				}
				if(typeof(scoreCode['OfferDescription']) != "undefined"  && scoreCode['OfferDescription'] != '' && scoreCode['OfferDescription'] != 'null'){
					html += '<div class="detail_description">'+ scoreCode['OfferDescription'] + '</div>';
				}
				html += '<div class="detail_dates">Valid until ' + fmtDate + '</div>';
				/*
				if(typeof(scoreCode['Keywords']) != "undefined"  && scoreCode['Keywords'] != '' && scoreCode['Keywords'] != 'null'){
					html += '<div class="detail_keywords">' + scoreCode['Keywords'] + '</div>';
				}
				*/
				if(typeof(scoreCode['Limitation']) != "undefined"  && scoreCode['Limitation'] != '' && scoreCode['Limitation'] != 'null'){
					html += '<div class="detail_limitation">'+ scoreCode['Limitation'] + '</div>';
				}
				if(typeof(scoreCode['Price']) != "undefined" && scoreCode['Price'] > 0){
					html += '<div class="detail_price">$' + scoreCode['Price']+ '</div>';
				}
				if(typeof(scoreCode['CompanyName']) != "undefined"  && scoreCode['CompanyName'] != '' && scoreCode['CompanyName'] != 'null'){
					html += '<div class="detail_company">'+ scoreCode['CompanyName'] + '</div>';
				}
				if(typeof(scoreCode['Headline']) != "undefined"  && scoreCode['Headline'] != '' && scoreCode['Headline'] != 'null'){
					dealsDetailHeadline = scoreCode['Headline'];
				} else {
					dealsDetailHeadline = '';
				}
				if(typeof(scoreCode['Limitation']) != "CompanyName"  && scoreCode['CompanyName'] != '' && scoreCode['CompanyName'] != 'null'){
					dealsDetailMerchant = scoreCode['CompanyName'];
				} else {					
					dealsDetailMerchant = '';
				}
				if(typeof(scoreCode['Address']) != "undefined"  && scoreCode['Address'] != '' && scoreCode['Address'] != 'null'){
					html += '<div class="detail_company">'+ scoreCode['Address'] + '</div>';
				}
				//html += '<div class="detail_barcode">' + scoreCode['Barcode'] + '</div>';
				$("#scoreCodeDetail").html(html);
			});

	
	$.mobile.changePage('#dealsDetailPage',{transition: "slide"});
	//window.location = '#dealsDetailPage';//
});

$(document).on('click', '.merchantCodeSummary', function() {
	$("#merchantCodeDetail").html('');
	var search_results = $(this).attr('id');
	console.log('WEB: clicked ' + search_results);
	merchantDetailCode = search_results;
	var url = "https://www.spendit.com/merchantcodes.json.php?token="
		+ userInfo['loginToken'] + '&scorecode='
		+ merchantDetailCode;
		var httpResponse = $.get(url);
		console.log('WEB: ' + url);
		httpResponse.done(function(data) {
			scorecodes = JSON.parse(data);
			var html = '';
			var scoreCode = {};
			$.each(scorecodes, function() {
				$.each(this, function(field, value) {
					scoreCode[field] = value;
				});
			});
			//var msec = Date.parse(scoreCode['Expires']);
			//var d = new Date(msec);
			var dateString = scoreCode['Expires'];
			var d = new Date(dateString.replace(/-/g, '/'));
			var m_names = new Array("January", "February", "March",
					"April", "May", "June", "July", "August", "September",
					"October", "November", "December");
			var day = d.getDate();
			var month = d.getMonth();
			var year = d.getFullYear();
			var fmtDate = m_names[month] + ' ' + day + ' ' + year;
			scoreCode['Picture'] = '<img style="max-width: 100%; height: auto; width: auto;" src="https://www.spendit.com/images/products/thumb/'+ scoreCode['ScoreCodeID'] +'.jpg">';
			if(typeof(scoreCode['ScanCount']) == undefined ){
				scoreCode['ScanCount'] = 0;
			}
			if(scoreCode['ScanCount'] === null){
				scoreCode['ScanCount'] = 0;
			}				
			if(scoreCode['ScanCount'] == 'null'){
				scoreCode['ScanCount'] = 0;
			}
			html = '';
			
			if(typeof(scoreCode['ScanCount']) !== "undefined" && scoreCode['ScanCount'] != ''){ html += '<div class="merchant_detail_scancount">Scans: ' + scoreCode['ScanCount'] + '</div>'; }				
			if(typeof(scoreCode['Headline']) !== "undefined" && scoreCode['Headline'] != ''){ html += '<div class="merchant_detail_heading">' + scoreCode['Headline'] + '</div>'; }
			if(typeof(scoreCode['SubHeading']) !== "undefined" && scoreCode['SubHeading'] != ''){ html += '<div class="merchant_detail_subheading">' + scoreCode['SubHeading'] + '</div>'; }
			if(typeof(scoreCode['Picture']) !== "undefined" && scoreCode['Picture'] != ''){ html += '<div class="detail_picture">' + scoreCode['Picture'] + '</div>'; }
			if(typeof(scoreCode['OfferDescription']) !== "undefined" && scoreCode['OfferDescription'] != 'null' && scoreCode['OfferDescription'] != ''){ html += '<div class="detail_description">' + scoreCode['OfferDescription'] + '</div>'; }
			if(typeof(fmtDate !== "undefined")){ html += '<div class="detail_dates">Valid until ' + fmtDate + '</div>'; }
			//if(typeof(scoreCode['Keywords'] !== "undefined" && scoreCode['Keywords']) != null && scoreCode['Keywords'] != 'null' && scoreCode['Keywords'] != '' scoreCode['Keywords'] !== null){ html += '<div class="detail_keywords">' + scoreCode['Keywords'] + '</div>'; }
			if(typeof(scoreCode['Limitation']) !== "undefined" && scoreCode['Limitation'] != ''){ html += '<div class="detail_limitation">' + scoreCode['Limitation'] + '</div>'; }
			if(typeof(scoreCode['Price']) !== "undefined" && scoreCode['Price'] > 0){ html += '<div class="detail_price">$' + scoreCode['Price'] + '</div>'; }
			if(typeof(scoreCode['CompanyName']) !== "undefined"  && scoreCode['CompanyName'] != ''){ html += '<div class="detail_company">' + scoreCode['CompanyName'] + '</div>'; }
			if(typeof(scoreCode['Address']) !== "undefined" && scoreCode['Address'] != ''){ html += '<div class="detail_company">'+ scoreCode['Address'] + '</div>'; }
			$("#merchantCodeDetail").html(html);
		});	
	
	$.mobile.changePage('#merchantDetailPage',{transition: "slide"});
});

$(document).on('click','#scanButton',function() {
	cordova.plugins.barcodeScanner.scan(function(result) {
		alert("We got a barcode\n" + "Result: " + result.text + "\n"
			+ "Format: " + result.format + "\n" + "Cancelled: "
			+ result.cancelled);
		}, function(error) {
			alert("Scanning failed: " + error);
	});
});

$(document).on('click', '#merchantScanButton', function() {
	cordova.plugins.barcodeScanner.scan(function(result) {
		var token = userInfo['loginToken'];
		var code = result.text;
		var postdata = {
			loginToken : token,
			ScoreCode : code
		};
		$.ajax({
			url : 'https://www.spendit.com/merchantscan.json.php',
			type : "POST",
			data : postdata,
			success : merchantScanSuccess,
			error : merchantScanError,
			async : false
		});
	}, function(error) {
		alert("Invalid Code" + error);

	});
	var url = "https://www.spendit.com/rewards.json.php?token="
		+ userInfo['loginToken'];
	var httpResponse = $.get(url);
	httpResponse.done(function(data) {
		jsonRes = JSON.parse(data);
		var html = '';
		var myData = {};
		html = '';
		$.each(jsonRes, function() {
			$.each(this, function(field, value) {			
				html += '<div class="rewardDetail">'+ field + ':' + value + '</div>';
				myData[field] = value;
			});
		});
		$("#rewardDetails").html(html);
	});	
});

$(document).on('click', '#showQRCode', function() {
	$.mobile.changePage('#showQRCodePage');
});

$(document).on('click', '#scanRewardButton', function() {
	cordova.plugins.barcodeScanner.scan(function(result) {
		var token = userInfo['loginToken'];
		var code = result.text;
		var postdata = {
			loginToken : token,
			ScoreCode : code
		};

		$.ajax({
			url : 'https://www.spendit.com/claimreward.json.php',
			type : "POST",
			data : postdata,
			success : rewardCodeInfo,
			error : rewardCodeError,
			async : false
		});
	}, function(error) {
		alert("Invalid Code" + error);
	});
});

$(document).on('click','#encodeButton',function() {
	var encodeData = $("#encodeData").val();
	// var scanner = cordova.require("cordova/plugin/BarcodeScanner");
	cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, encodeData, function(success) {
		alert("encode success: " + success);
		}, function(fail) {
		alert("encoding failed: " + fail);
	});
});

/** *************************************************************************** */
/* FUNCTIONS */
/** *************************************************************************** */
function rewardCodeInfo(result) {
	var jsonData = jQuery.parseJSON(result);
	var status = jsonData.status;
	var message = jsonData.message;
	if (status == 'reward') {
		var url = "https://www.spendit.com/rewards.json.php?token="
			+ userInfo['loginToken'];
		var httpResponse = $.get(url);
		httpResponse.done(function(data) {
			jsonRes = JSON.parse(data);
			var html = '';
			var myData = {};
			html = '';
			$.each(jsonRes, function() {
				$.each(this, function(field, value) {			
					html += '<div class="rewardDetail">'+ field + ':' + value + '</div>';
					myData[field] = value;
				});
			});
			$("#rewardDetails").html(html);
		});		
		//$(".merchant_detail_scancount").html(html);
		alert(message);
	}
	if (status == 'scorecode') {
		alert('Please visit http://www.spendit.com/ to claim ScoreCodes');
	}
	if (status == 'duplicate') {
		alert(message);
	}
	if (status == 'fail') {
		alert(message);
	}
}

function rewardCodeError(xhr, textStatus, errorThrown) {
	if (textStatus == 'error') {
		console.log('WEB: error');
	}
	if (textStatus == 'timeout') {
		console.log('WEB: timeout');
	}
	if (textStatus == 'abort') {
		console.log('WEB: abort');
	}
	if (textStatus == 'parsererror') {
		console.log('WEB: parsererror');
	}
	alert("Unable to contact SpendIt server\nPlease try again later");
}


function merchantScanSuccess(result) {
	var jsonData = jQuery.parseJSON(result);
	var status = jsonData.status;
	var message = jsonData.message;
	if (status == 'success') {
		var url = "https://www.spendit.com/scancount.json.php?token="
			+ userInfo['loginToken'] + '&scorecode='
			+ merchantDetailCode;
		var httpResponse = $.get(url);
		httpResponse.done(function(data) {
			jsonRes = JSON.parse(data);
			var html = '';
			var myData = {};
			html = '';
			$.each(jsonRes, function() {
				$.each(this, function(field, value) {			
					html += '<div class="scanInfo" style="background-color: #B4EEB4">'+ field + ':' + value + '</div>';
					myData[field] = value;
				});
			});
			$(".merchant_detail_scancount").html(html);
		});		
		alert(message);
	}
	if (status == 'fail') {
		alert(message);
	}
}

function merchantScanError(xhr, textStatus, errorThrown) {
	if (textStatus == 'error') {
		console.log('WEB: error');
	}
	if (textStatus == 'timeout') {
		console.log('WEB: timeout');
	}
	if (textStatus == 'abort') {
		console.log('WEB: abort');
	}
	if (textStatus == 'parsererror') {
		console.log('WEB: parsererror');
	}
	alert("Unable to contact SpendIt server\nPlease try again later");
}


function populateDB(tx) {
	tx.executeSql('CREATE TABLE IF NOT EXISTS SETTINGS (id unique, fieldname, data)');
}

function successCB() {

}

function getUserInfo(tx) {
	tx.executeSql('SELECT * FROM SETTINGS', [], function(tx, results) {
		var len = results.rows.length, i;
		if (len > 0) {
			for (i = 0; i < len; i++) {
				var fieldname = results.rows.item(i).fieldname;
				var data = results.rows.item(i).data;
				if (fieldname == 'email') {
					// console.log(data);
					userInfo['email'] = data;
					$('#email').val(data);
				}
				if (fieldname == 'password') {
					// console.log(data);
					userInfo['password'] = data;
					$('#password').val(data);
				}
				if (fieldname == 'loginToken') {
					// console.log(data);
					userInfo['loginToken'] = data;
					$('#loginToken').val(data);
				}
			}

		} else {
			$.mobile.changePage("#settingsPage");

		}
		return true;
	});
}

function setLoginResultVars(result) {
	var jsonData = jQuery.parseJSON(result);
	loginStatus = jsonData.status;

	loginMessage = jsonData.message

}

function loginHttpError(xhr, textStatus, errorThrown) {
	if (textStatus == 'error') {
		console.log('WEB: error')
	}
	if (textStatus == 'timeout') {
		console.log('WEB: timeout')
	}
	if (textStatus == 'abort') {
		console.log('WEB: abort')
	}
	if (textStatus == 'parsererror') {
		console.log('WEB: parsererror')
	}
}

function saveUserInfo(tx) {
	/*
	tx.executeSql('DELETE FROM SETTINGS WHERE fieldname="email"');
	tx.executeSql('DELETE FROM SETTINGS WHERE fieldname="password"');
	tx.executeSql('DELETE FROM SETTINGS WHERE fieldname="loginToken"');
	*/
	tx.executeSql('DROP TABLE IF EXISTS SETTINGS');	
	tx.executeSql('CREATE TABLE IF NOT EXISTS SETTINGS (id unique, fieldname, data)');
	var eml = $('#email').val();
	var pas = $('#password').val();
	var postdata = {
		email : eml,
		password : pas
	};
	$.ajax({
		url : 'https://www.spendit.com/auth.json.php',
		type : "POST",
		data : postdata,
		success : setLoginResultVars,
		error : loginHttpError,
		async : false
	});

	if (loginStatus == 'success') {
		userInfo['loginToken'] = loginMessage;

		tx.executeSql('INSERT INTO SETTINGS  (fieldname,data) VALUES (?, ?)', [
				"loginToken", userInfo['loginToken'] ]);

		eml = eml.toLowerCase();
		tx.executeSql('INSERT INTO SETTINGS  (fieldname,data) VALUES (?, ?)', [
				"email", eml ]);

		pas = pas.toLowerCase();
		tx.executeSql('INSERT INTO SETTINGS  (fieldname,data) VALUES (?, ?)', [
				"password", pas ]);

		$.mobile.changePage("#homePage");
		return true;
	} else {
		$('#loginError').show();
		return false;
	}

	// store success
	tx.executeSql('SELECT * FROM SETTINGS', [], function(tx, results) {
		var len = results.rows.length, i;
		if (len > 0) {
			for (i = 0; i < len; i++) {
				userInfo[fieldname] = data;
				if (fieldname == 'email') {
					('#email').value = results.rows.item(i).data;
				}
				if (fieldname == 'password') {
					('#password').value = results.rows.item(i).data;
				}
			}

		} else {
			$.mobile.changePage("#settingsPage");

		}
		return true;
	});
}

function errorCreate(tx, err) {
	console.log("WEB: Error processing SQL table create: " + err);
}
function errorSelect(tx, err) {
	console.log("WEB: Error processing SQL table select: " + err);
}
function errorSave(tx, err) {
	console.log("WEB: Error processing SQL table insert: " + err);
}

function refreshPage() {
	  $.mobile.changePage(
	    window.location.href,
	    {
	      allowSamePageTransition : true,
	      transition              : 'none',
	      showLoadMsg             : false,
	      reloadPage              : true
	    }
	  );
}
