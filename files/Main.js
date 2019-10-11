// --Globals--
// Current File
var ui = SpreadsheetApp.getUi();

//Set up the Menu Dropdown.
function onOpen(e) {
  /*ui.createMenu("Multi HTML")
    .addItem("Formatter", "setupSideBar")
    .addToUi();*/

    var submenu = [{name:"Formatter", functionName:"setupSideBar"}]
    SpreadsheetApp.getActiveSpreadsheet().addMenu('Fluffy Bassoon', submenu);
}

//Set up for first time use.
function onInstall(e) {
  ui.alert("Starting");
  onOpen();
}

function setupSideBar() {
  var html = HtmlService.createTemplateFromFile("Index").evaluate();
  //Once created it becomes a HtmlOutput
  html.setTitle("Formatter");
  ui.showSidebar(html);
}

// Creates an import or include function so files can be added
// inside the main index.
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function formatButton(inputfieldBp, inputFieldBo) {
  var products = formatText(inputfieldBp);
  //var overview = formatText(inputFieldBo);

  var productNames = products[0];
  var productNumbers = products[1];
  var productPrices = products[2];
  for (var i = 2; i <= productNames.length + 1; i++) {
    setCell("A", i, productNames[i - 2]);
    setCell("G", i, productNumbers[i - 2]);
    setCell("B", i, productPrices[i - 2]);
  }

  setupSideBar();
}

function setCell(row, inputIndex, output) {
  var currentSheet = SpreadsheetApp.getActiveSheet();
  currentSheet.getRange(row + inputIndex).setValue(output);
}

// euro: /(€\d+\.\d{1,2})/g
//whitespaces: /\s+ /g
function formatText(inputField) {
  var split = inputField.split(/\b\n/);
  var numbers = [];
  var prices = [];

  for (var i = 0; i < split.length; i++) {
    split[i] = split[i].replace(/\s\s+/g, " ");

    var newNumber = parseFloat(split[i]);
    numbers.push(newNumber);

    var newPrice = split[i].match(/(\d+\,\d{1,2})/g);
    var newPriceDot = newPrice[0].replace(",", ".");
    prices.push(parseFloat(newPriceDot));

    split[i] = split[i].replace(newNumber, "");
    split[i] = split[i].replace('€ ' + newPrice, "");
  }
  return [split, numbers, prices];
}
