moment.locale("it");

var apiURL = "http://157.230.17.132:4014/sales/";
var totalSales = {};
var data = [];
var labels = [];

var ctx = document.getElementById('myLineChart').getContext('2d');

var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: ""
});

function call_API(){
  $.ajax({
    url: apiURL,
    method: "GET",
    data: {
    },
    success: function(obj){
      for (var i = 0; i < obj.length; i++) {
        var formattedData = moment(obj[i].date, "DD/MM/YYYY").format("YYYY/MM/DD");
        var currentMonth = moment(formattedData).month();
        var employeeSale = obj[i].amount;
        var months = Object.keys(totalSales);
        console.log(months);
        console.log(currentMonth);
        if (!months.includes(currentMonth)) {
          totalSales[currentMonth] = 0;
        } else {
          totalSales[currentMonth] += employeeSale;
        }
      }
      var data = Object.values(totalSales);
      console.log(totalSales);
      console.log(obj);
      console.log("data: " + data);
    },
    error: function() {
      alert("errore");
    }
  });
}

call_API();
