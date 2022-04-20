/**
 * This script duplicates a template sheet and renamed it to the current date
 * Version: 1.0
 * Created by Yorick van Zweeden; Bestuur 11 Hoogh!
 * 
 * This script is updated to auto fill the 'facturen' with the data from the Jumbo receipts
 * Version 2.0
 * Created by Commit 2019-2020
 */

//Name of the sheet to be duplicated
var templateName = "Template"
var ui = SpreadsheetApp.getUi();

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

function formatPDF(pdfText) {
  // Check if the user isn't trying to change the template
  if(SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName() == 'Template') { 
    Browser.msgBox("The template doesn't need to be filled");
    return;
  }

  // Check if the current sheet is empty
  if(SpreadsheetApp.getActiveSheet().getRange(2, 1).getValue() != "") {
    // Asks the user if he wants to override the current values
    var result = ui.alert(
      'Please confirm',
      'Are you sure you want to override the current values?',
      ui.ButtonSet.YES_NO);

    // Process the result
    if(result == ui.Button.NO) {return;}
  }

  var products = formatPdfText(pdfText);

  for (var i = 2; i <= products.length + 1; i++) {
    setCell("A", i, products[i - 2].Name);
    setCell("B", i, products[i - 2].TotalPrice);
    setCell("F", i, products[i - 2].TaxPercentage);
    setCell("G", i, products[i - 2].Amount);
    setCell("H", i, products[i - 2].PricePerProduct);
  }

  setupSideBar();
}

function setCell(row, inputIndex, output) {
  var currentSheet = SpreadsheetApp.getActiveSheet();
  currentSheet.getRange(row + inputIndex).setValue(output);
}

function formatPdfText(pdfText) { 
  var split = pdfText.split(/\b\n/);
  var products = [];
  for (var i = 0; i < split.length; i++) {
    //NAME PRODUCT WITH SPACES AMOUNT PRICEPERITEM IGNORE TAXPERCENTAGE % TOTALPRICE
    var info = reverseString(split[i]).split(' ').map(x => reverseString(x)); //perform a split from right to left
    var totalPrice = commaParseFloat(info[0]);
    var taxPercentage = commaParseFloat(info[2]) / 100;
    var pricePerProduct = commaParseFloat(info[4]);
    var amount = parseInt(info[5]);
    var name = info.slice(6).join(' ');

    var product = {Name : name, TotalPrice : totalPrice, TaxPercentage : taxPercentage, Amount : amount, PricePerProduct : pricePerProduct};
    products.push(product);
  }
  return products;
}

function commaParseFloat(commaStr) {
  return parseFloat(commaStr.replace(",", "."));
}

function reverseString(str) {
  return str.split("").reverse().join("");
}