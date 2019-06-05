moment.locale("it");

var apiURL = "http://157.230.17.132:4014/sales/";
var singleSales = {};
var dataTotalSales = [];
var dataSingleSales = [];
var dataQuarterSales = [];
var labelTotalSales = [];
var labelSingleSales = [];
var labelQuarterSales = [];
var allSales = 0;
var employeeValue, dateValue, saleValue;

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

var quarter = {
  Q1: 0,
  Q2: 0,
  Q3: 0,
  Q4: 0
}

var optionMonth = {
  value: ""
}

var optionEmployees = {
  value: ""
}


function dataSalesPerMonth(obj) {
  for (var i = 0; i < obj.length; i++) {
    var formattedData = moment(obj[i].date, "DD/MM/YYYY");
    var currentMonth = formattedData.format("MMMM");
    var employeeSale = obj[i].amount;
    months[currentMonth] += employeeSale;
  }
  labelTotalSales = Object.keys(months);
  dataTotalSales = Object.values(months);
  for (var j = 0; j < Object.keys(months).length; j++) {
    optionMonth.value = Object.keys(months)[j];
    $(".months").append(selectTemplate(optionMonth));
  }
}

function dataSalesPerEmployee(obj) {
  for (var i = 0; i < obj.length; i++) {
    var employee = obj[i].salesman;
    var employeeSale = obj[i].amount;
    var workForce = Object.keys(singleSales);
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
      optionEmployees.value = employee;
      $(".employees").append(selectTemplate(optionEmployees));
    }
  }
}

function dataSalesPerQuarter(obj) {
  for (var i = 0; i < obj.length; i++) {
    var formattedData = moment(obj[i].date, "DD/MM/YYYY");
    var currentQuarter = "Q"+formattedData.quarter();
    console.log("currentQuarter: " + currentQuarter);
    var employeeSale = obj[i].amount;
    quarter[currentQuarter] += employeeSale;
  }
  labelQuarterSales = Object.keys(quarter);
  dataQuarterSales = Object.values(quarter);
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
      dataSalesPerQuarter(obj);
      console.log(obj);
      drawLineChart(labelTotalSales, dataTotalSales);
      drawDoughnutChart(labelSingleSales, dataSingleSales);
      drawBarChart(labelQuarterSales, dataQuarterSales);
    },
    error: function() {
      alert("errore");
    }
  });
}

function call_POST_API(employee, date, sale){
  $.ajax({
    url: apiURL,
    method: "POST",
    contentType: 'application/json',
    data: JSON.stringify({
      salesman: employee,
      amount: parseInt(sale),
      date: date
    }),
    success: function(obj){
      dataSalesPerMonth(obj);
      dataSalesPerEmployee(obj);
      dataSalesPerQuarter(obj);
      console.log(obj);
      drawLineChart(labelTotalSales, dataTotalSales);
      drawDoughnutChart(labelSingleSales, dataSingleSales);
      drawBarChart(labelQuarterSales, dataQuarterSales);
      location.reload();
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
            tension: 0,
        }
      },
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

function drawBarChart(label, data) {
  var ctx3 = document.getElementById("barChart").getContext("2d");
  var barChart = new Chart(ctx3, {
    type: 'bar',
    data: {
      labels: label,
      datasets: [{
        label: ["Trimestre"],
        data: data,
        backgroundColor: ["#f1c40f", "#2ecc71", "#3498db", "#e74c3c"]
      }]
    },
    options: {
      title: {
        display: true,
        text: "Vendite per trimestri"
      }
    }
  });
}

$(".employees").change(function(){
  employeeValue = $(this).val();
  console.log("employeeValue: " + employeeValue);
});

$(".months").change(function(){
  monthNumber = moment().month($(this).val()).format("MM");
  dateValue = "14/" + monthNumber + "/2017";
  console.log("dateValue: " + dateValue);
});

$(".add-sales-btn").click(function(){
  saleValue = $(".sales-input").val();
  console.log("saleValue: " + saleValue);
  $(".sales-input").val("");
  if (!employeeValue || !dateValue || !saleValue) {
    console.log("ATTENZIONE! Mancano alcuni valori");
  } else {
    call_POST_API(employeeValue, dateValue, saleValue);
  }
});

call_API();
