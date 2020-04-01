$(document).ready(function() {
  $("#search-button").on("click", function() {
    var searchValue = $("#search-value").val();

    // clear input box
    $("#search-value").val("");

    searchWeather(searchValue);
  });

  $(".history").on("click", "li", function() {
    searchWeather($(this).text());
  });

  function makeRow(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(".history").append(li);
  }
  var history = [];

  function searchWeather(searchValue) {
    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=43c39b29fd44c3e28c397449ace42672&units=imperial",
      dataType: "json",
      success: function(data) {
        //create history link for this search
        if (history.indexOf(searchValue) === -1) {
          history.push(searchValue);
          window.localStorage.setItem("history", JSON.stringify(history));
    
          makeRow(searchValue);
        }
        
        // clear any old content
        $("#today").empty();

        // create html content for current weather
        var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var card = $("<div>").addClass("card").attr("style", "width: 20rem");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + Math.floor(data.main.temp) + " °F");
        var cardBody = $("<div>").addClass("card-body");
        var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

        // merge and add to page
        title.append(img);
        cardBody.append(title, temp, humid, wind);
        card.append(cardBody);
        $("#today").append(card);

        // call follow-up api endpoints
        getForecast(searchValue);
        //getUVIndex(data.coord.lat, data.coord.lon);
      }
    });
  }
  
//Get Started 
function getForecast(searchValue) {
  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + ",us&appid=aa550f330654aefb73397b4e69ec9a4c&units=imperial";
$.ajax({
    url: queryURL,
    method: "GET",
}).then(function(data){
  //empty forecast row
  $("#forecast-row").empty();
  $("#forecast").html("<h4>5 Day Forecast:</h4>")

    for(i = 0; i < data.list.length; i += 8){
        
            var col = $("<div>").addClass("col-md-2").attr("style", "margin: auto");
            var card = $("<div>").addClass("card bg-primary");
            var cardBody = $("<div>").addClass("card-body p-2");
            var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png")
            
            var day = data.list[i].dt_txt
            var title = $("<h4>").addClass("card-title").text(new Date(day).toLocaleDateString());;
            var p1 = $("<p>").addClass("card-text").text("Temp: " + Math.floor(data.list[i].main.temp_max) + " F")
            
            col.append(card.append(cardBody.append(title, p1, img)));
            $("#forecast-row").append(col);  
    }
      
});

}

});