/**
 * This script duplicates a template sheet and renamed it to the current date
 * Version: 1.0
 * Created by Yorick van Zweeden; Bestuur 11 Hoogh!
 * 
 * This script is updated to auto fill the 'facturen' with the data from the Jumbo receipts
 * Version 1.0
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

  // FOR TESTING AS ADDON:
  ui.createMenu("Multi HTML")
    .addItem("Formatter", "setupSideBar")
    .addToUi();
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

function formatButton(inputfieldBp, inputFieldBo) {
  var products = formatText(inputfieldBp);
  //var overview = formatText(inputFieldBo);

  for (var i = 2; i <= products.length + 1; i++) {
    setCell("A", i, products[i - 2].Name);
    setCell("G", i, products[i - 2].Amount);
    setCell("B", i, products[i - 2].Price);
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
  var products = [];

  for (var i = 0; i < split.length; i++) {
    var currentName = split[i].replace(/\s\s+/g, " ");

    if(currentName === " "){continue;}

    var newNumber = parseFloat(split[i]);
    
    var newPrice = currentName.match(/(\d+\,\d{1,2})/g);
    var newPriceDot = newPrice[0].replace(",", ".");
    var priceAsFloat = parseFloat(newPriceDot);

    if(priceAsFloat === 0.0){continue;}

    currentName = currentName.replace(newNumber, "");
    currentName = currentName.replace('€ ' + newPrice, "");


    var product = {Name : currentName, Amount : newNumber, Price : priceAsFloat};
    products.push(product);
  }
  products.sort(compareProducts);
  return products;
}

function compareProducts( a, b ) {
  if ( a.Name < b.Name ){
    return -1;
  }
  if ( a.Name > b.Name ){
    return 1;
  }
  return 0;
}