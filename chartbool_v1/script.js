moment.locale("it");

var apiURL = "http://157.230.17.132:4014/sales/";
var singleSales = {};
var workForce = {};
var dataTotalSales = [];
var dataSingleSales = [];
var labelTotalSales = [];
var labelSingleSales = [];
var allSales = 0;

//setto le variabili per handlebarsjs
var optionTemplate = $("#option-template").html();
var selectTemplate = Handlebars.compile(optionTemplate);

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

function dataSalesPerMonth(obj) {
  for (var i = 0; i < obj.length; i++) {
    var formattedData = moment(obj[i].date, "DD/MM/YYYY");
    var currentMonth = formattedData.format("MMMM");
    var employee = obj[i].salesman;
    var employeeSale = obj[i].amount;
    months[currentMonth] += employeeSale;
  }
  labelTotalSales = Object.keys(months);
  dataTotalSales = Object.values(months);
}

function dataSalesPerEmployee(obj) {
  for (var i = 0; i < obj.length; i++) {
    var employee = obj[i].salesman;
    var employeeSale = obj[i].amount;
    workForce = Object.keys(singleSales);
    if (!workForce.includes(employee)) {
      singleSales[employee] = employeeSale;
    } else {
      singleSales[employee] += employeeSale;
    }
    allSales += employeeSale;
  }
  labelSingleSales = Object.keys(singleSales);
  if (allSales > 0) {
    for (var employee in singleSales) {
      dataSingleSales.push(((singleSales[employee] / allSales) * 100).toFixed(1));
      $(".employees").append(selectTemplate(workForce));
      console.log(workForce);
    }
  }
}

function call_API(){
  $.ajax({
    url: apiURL,
    method: "GET",
    data: {
    },
    success: function(obj){
      dataSalesPerMonth(obj);
      dataSalesPerEmployee(obj);
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
        label: "Vendite",
        data: dataTotalSales,
        backgroundColor: ["#e67e22"],
        borderColor: ["#d35400"],
        borderWidth: 5
      }]
    },
    options: {
      title: {
        display: true,
        text: "Vendite totali nel 2017"
      },
      elements: {
          line: {
              tension: 0
          }
      }
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
