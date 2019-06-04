moment.locale("it");

var apiURL = "http://157.230.17.132:4014/sales/";
var totalSales = {};
var singleSales = {};
var dataTotalSales = [];
var dataSingleSales = [];
var labelTotalSales = [];
var labelSingleSales = [];
var allSales = 0;

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
        var employee = obj[i].salesman;
        var employeeSale = obj[i].amount;
        var months = Object.keys(totalSales);
        var men = Object.keys(singleSales);
        if (!months.includes(currentMonth)) {
          totalSales[currentMonth] = employeeSale;
        } else {
          totalSales[currentMonth] += employeeSale;
        }
        if (!men.includes(employee)) {
          singleSales[employee] = employeeSale;
        } else {
          singleSales[employee] += employeeSale;
        }
        allSales += employeeSale;
      }
      labelSingleSales = Object.keys(singleSales);
      dataTotalSales = Object.values(totalSales);
      for (var j = 0; j < 4; j++) {
        dataSingleSales.push(Math.round(((Object.values(singleSales)[j]) / allSales) * 1000) / 10);
      }
      console.log("dataSingleSales: " + dataSingleSales);
      console.log(labelSingleSales);
      console.log(obj);
    },
    error: function() {
      alert("errore");
    }
  });
}

var ctx = document.getElementById("lineChart").getContext("2d");
var ctx2 = document.getElementById("doughnutChart").getContext("2d");

var lineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: labelTotalSales,
    datasets: [{
        data: dataTotalSales,
    }]
  }
});

var doughnutChart = new Chart(ctx2, {
  type: 'doughnut',
  data: {
    labels: labelSingleSales,
    datasets: [{
      data: dataSingleSales,
      backgroundColor: ["#f1c40f", "#2ecc71", "#3498db", "#e74c3c"]
    }]
  }
});

call_API();
