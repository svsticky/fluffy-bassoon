/**
 * This script duplicates a template sheet and renamed it to the current date
 * Version: 1.0
 * Created by Yorick van Zweeden; Bestuur 11 Hoogh!
 */

//Name of the sheet to be duplicated
var templateName = "Template"

/**
 * This script duplicates a template sheet and renamed it to the current date
 */
function onOpen() {
  var submenu = [{name:"Nieuwe factuur", functionName:"duplicateTab"}]
  SpreadsheetApp.getActiveSpreadsheet().addMenu('Facturen', submenu);
  
  var submenuBassoon = [{name:"Formatter", functionName:"setupSideBar"}]
  SpreadsheetApp.getActiveSpreadsheet().addMenu('Fluffy Bassoon', submenuBassoon);
}

/**
 * Duplicates sheet and renames
 */
function duplicateTab() {
  //Get active sheet 
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Template').copyTo(ss);
  
  //Get today
  var today = getDate();
  
  //Rename sheet
  var old = ss.getSheetByName(today);
  if (old) today = today + " (2)";
  sheet.setName(today);

  //Set new sheet as active sheet
  ss.setActiveSheet(sheet);
}

/**
 * Gets current date formatted as YYYY-MM-DD
 */
function getDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

/**
* Fluffy Bassoon
*/

// --Globals--
// Current File
var ui = SpreadsheetApp.getUi();

function setupSideBar() {
  var html = HtmlService.createTemplateFromFile("index").evaluate();
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