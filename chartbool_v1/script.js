moment.locale("it");

var apiURL = "http://157.230.17.132:4014/sales/";
var singleSales = {};
var dataTotalSales = [];
var dataSingleSales = [];
var labelTotalSales = [];
var labelSingleSales = [];
var allSales = 0;

var months = {
  gennaio: 0,
  febbraio: 0,
  marzo: 0,
  aprile: 0,
  maggio: 0,
  giugno: 0,
  luglio: 0,
  agosto: 0,
  settembre: 0,
  ottobre: 0,
  novembre: 0,
  dicembre: 0
};

function call_API(){
  $.ajax({
    url: apiURL,
    method: "GET",
    data: {
    },
    success: function(obj){
      for (var i = 0; i < obj.length; i++) {
        var formattedData = moment(obj[i].date, "DD/MM/YYYY");
        var currentMonth = formattedData.format("MMMM");
        console.log(currentMonth);
        months[currentMonth] += employeeSale;
        console.log(months);
        var employee = obj[i].salesman;
        var employeeSale = obj[i].amount;

        //grafico vendite venditori
        var men = Object.keys(singleSales);
        if (!men.includes(employee)) {
          singleSales[employee] = employeeSale;
        } else {
          singleSales[employee] += employeeSale;
        }
        allSales += employeeSale;
      }
      labelSingleSales = Object.keys(singleSales);
      labelTotalSales = Object.keys(months);
      dataTotalSales = Object.values(months);
      if (allSales > 0) {
        for (var employee in singleSales) {
          dataSingleSales.push(((singleSales[employee] / allSales) * 100).toFixed(1));
        }
      }
      console.log(obj);
      drawLineChart(labelTotalSales, dataTotalSales);
      drawDoughnutChart(labelSingleSales, dataSingleSales);
    },
    error: function() {
      alert("errore");
    }
  });
}

function drawLineChart(label, data) {
  var ctx = document.getElementById("lineChart").getContext("2d");
  var lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labelTotalSales,
      datasets: [{
          data: dataTotalSales,
      }]
    }
  });
}

function drawDoughnutChart(label, data) {
  var ctx2 = document.getElementById("doughnutChart").getContext("2d");
  var doughnutChart = new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: label,
      datasets: [{
        data: data,
        backgroundColor: ["#f1c40f", "#2ecc71", "#3498db", "#e74c3c"]
      }]
    },
    options: {
      title: {
        display: true,
        text: "Vendite per singoli venditori nel 2017"
      }
    }
  });
}

call_API();
