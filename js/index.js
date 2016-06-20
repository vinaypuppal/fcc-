//Geolocation Api only works with https
//So Load pen with https or use this url https://codepen.io/vinaypuppal/pen/NNLepx
// If not loaded with https you will see infinite loading icon....

$(document).ready(function() {
  var lat, lng, address, cTemp,hTemp;

  function timer() {
    var today = new Date;
    var hrs = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    if (hrs < 10) {
      hrs = '0' + hrs;
    }
    if (min < 10) {
      min = '0' + min;
    }
    if (sec < 10) {
      sec = '0' + sec;
    }
    $('.hrs').text(hrs);
    $('.min').text(min);
    $('.sec').text(sec);
  }
  timer();
  setInterval(timer, 1000);
  var today = new Date;
  $('.current-day').text(today.toDateString());

  function renderAddress(address) {
    $('.city').text(address);
  }
  var tempInF = true;

  function convertToCelcius(temp) {
    tempInF = false;
    return Math.floor((temp - 32) * (5 / 9)) + '<i class="wi wi-celsius"></i>';
  }

  function loadWeather(lat, lng) {
    $.ajax({
      url: "https://api.forecast.io/forecast/462174812063339598f1677ef8979001/" + lat + "," + lng,
      dataType: 'jsonp',
      beforeSend: function(xhr) {
        //console.log('Before: ' + xhr);
        $('.main-content').hide();
        $('.loading').fadeIn();
      },
      complete: function(xhr, status) {
        //console.log('complete: ' + status);
        $('.loading').hide();
        $('.main-content').fadeIn();
      },
      success: function(result, status, xhr) {
        // console.log(result);
        var currentWeather = result.currently;
        var hourlyWeather = result.hourly;
        var weeklyWeather = result.daily;
        // console.log(currentWeather);
        var iconHtml = '<i class="wi wi-forecast-io-' + currentWeather.icon + '"></i>'
        $('.current-weather .weather .icon').html(iconHtml);
        $('.current-weather .summary').text(currentWeather.summary);
        cTemp =Math.floor( currentWeather.temperature);
        $('.current-weather .temperature').html(cTemp + '<i class="wi wi-fahrenheit"></i>');
        iconHtml = '<i class="wi wi-forecast-io-' + hourlyWeather.icon + '"></i>'
        $('.hourly-weather .weather .icon').html(iconHtml);
        $('.hourly-weather .summary').text(hourlyWeather.summary);
        hTemp =Math.floor( hourlyWeather.data[23].temperature);
        $('.hourly-weather .temperature').html(hTemp + '<i class="wi wi-fahrenheit"></i>');
        iconHtml = '<i class="wi wi-forecast-io-' + weeklyWeather.icon + '"></i>'
        $('.weeks-weather .weather .icon').html(iconHtml);
        $('.weeks-weather .summary').text(weeklyWeather.summary);
        // $('.last-updated .value').text(new Date(currentWeather.time).toLocaleTimeString())
      },
      error: function(xhr, status, error) {
        console.log(error);
      }
    });
  }
  //console.log(convertToCelcius(77.07));
  if (navigator.geolocation) {
    //alert("work")
    //console.log(navigator.gelocation);
    navigator.geolocation.getCurrentPosition(function(position) {
      //console.log(position);
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      //console.log(lat,lng);
      $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&sensor=true", function(json) {
        //console.log(json.results[0].formatted_address);
        address = json.results[0].formatted_address;
        renderAddress(address);
      });
      loadWeather(lat, lng);
    });
  } else {
    console.warn("Browser Does Not Support Geolocation Api");
  }
  $('#toggle-temp').on('click', function(e) {
    e.preventDefault();
    if (tempInF) {
      var changedcTemp = convertToCelcius(cTemp);
      var changedhTemp = convertToCelcius(hTemp);
      $('.current-weather .temperature').html(changedcTemp);
      $('.hourly-weather .temperature').html(changedhTemp);
      $(this).css('padding', '10px');
      $(this).text("Show In Fahrenheit");
      
    } else {
      tempInF = true;
      $('.current-weather .temperature').html(cTemp + '<i class="wi wi-fahrenheit"></i>');
      $('.hourly-weather .temperature').html(hTemp + '<i class="wi wi-fahrenheit"></i>');
      $(this).text("Show In Celsius");
    }

  });
  $('#refresh').on('click', function(e) {
    e.preventDefault();
    loadWeather(lat, lng);
  })
});