//imposto momentjs in italiano
moment.locale("it");

//imposto le variabili che mi serviranno successivamente
var apiURL = "http://157.230.17.132:4014/sales/";
var singleSales = {};
var dataTotalSales = [];
var dataSingleSales = [];
var dataQuarterSales = [];
var labelTotalSales = [];
var labelSingleSales = [];
var labelQuarterSales = [];
var employeeValue, dateValue, saleValue;
var allSales = 0;

//imposto le variabili per handlebarsjs
var optionTemplate = $("#option-template").html();
var selectTemplate = Handlebars.compile(optionTemplate);

//imposto l'oggetto per i mesi
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

//imposto l'oggetto per i trimestri
var quarter = {
  Q1: 0,
  Q2: 0,
  Q3: 0,
  Q4: 0
}

//imposto i due oggetti da passare ad handlebarsjs
//per generare le options alle select relative
var optionMonth = {
  value: ""
}

var optionEmployees = {
  value: ""
}

//creo una funzione per le vendite per mese
//cambio formato alla data da API e prendo il nome del mese relativo
//prendo il valore delle vendite da API
//nell'oggetto months, all'indice relativo, vado a sommare le vendite
//salvo le label e i data utili al grafico lineare
//genero le options per la select dei mesi
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

//creo la funzione per le vendite per venditore
//prendo il nome del venditore e il valore della vendita da API
//imposto le chiavi sull'oggetto workForce
//al primo ciclo sarà vuoto, quindi vado a definire chiave e valore di una vendita
//quindi ogni volta che il venditore non è incluso nell'oggetto workForce
//seleziono singleSales sull'indice relativo al venditore e sommo le vendite
//in una variabile di appoggio vado a sommare tutti i valori delle vendite
//salvo le label per il grafico a torta
//se le vendite sono maggiori di 0 allora ciclo per il numero di venditori
//vado a popolare l'array data per il grafico con i valori delle vendite in percentuale
//creo le options per la select dei venditori
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

//creo una funzione per le vendite per trimestre
//formatto al data restituita da API e prendo il trimestre relativo usando momentjs
//prendo i dati di vendita da API e vado a sommare le vendite in base al Q relativo
//recupero le label e data per il grafico a barre
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

//creo una funzione per la chiamata API in GET
//al success richiamo le varie funzioni
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

//creo una funzione per la chiamata API in POST
//passo al data il nome venditore, data di vendita e importo vendita
//in base a quello che ha selezionato e aggiunto l'utente
//al success richiamo le varie funzioni
//NOTA: siccome ogni chiamata API trasforma tutto in stringa,
//uso il metodo JSON.stringify e parseInt() sul dato che voglio mantenere int
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

//creo la funzione per disegnare il grafico lineare coi data e label relativi
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

//creo la funzione per disegnare il grafico a torta coi data e label relativi
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

//creo la funzione per disegnare il grafico a barre coi data e label relativi
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

//creo le funzione che al cambio delle select recuperano i valori delle options selezionate
$(".employees").change(function(){
  employeeValue = $(this).val();
  console.log("employeeValue: " + employeeValue);
});

//passo un giorno e anno di default, il mese invece cambia in base alla select
$(".months").change(function(){
  monthNumber = moment().month($(this).val()).format("MM");
  dateValue = "14/" + monthNumber + "/2017";
  console.log("dateValue: " + dateValue);
});

//al click di aggiunta della vendita recupero l'importo di vendita e resetto il campo input
//controllo, se manca qualche dato avverto l'utente, altrimenti chiamo l'API in POST
//passandogli come valori il nome venditore, data di vendita e importo vendita
$(".add-sales-btn").click(function(){
  saleValue = $(".sales-input").val();
  console.log("saleValue: " + saleValue);
  $(".sales-input").val("");
  if (!employeeValue || !dateValue || !saleValue) {
    alert("ATTENZIONE! Mancano alcuni valori");
  } else {
    call_POST_API(employeeValue, dateValue, saleValue);
  }
});

//chiamo l'API in GET per popolare il tutto all'avvio della pagina
call_API();
