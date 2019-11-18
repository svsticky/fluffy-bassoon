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
  calculateDiscounts(inputFieldBo);
  var products = formatText(inputfieldBp);

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

function formatText(inputField) {
  var split = inputField.split(/\b\n/);
  var products = [];

  for (var i = 0; i < split.length; i++) {
    var currentName = split[i].replace(/\s\s+/g, " ");

    if(currentName === " "){continue;}

    var newNumber = parseInt(split[i]);
    var checkGrams = split[i].match(/\d+[g]/g);

    if(checkGrams != null) {
      grams = checkGrams[0].replace("g", "");
      if(grams == newNumber) {
        newNumber = 1;
        currentName = currentName.replace(checkGrams[0], "");
      }
      else {
        currentName = currentName.replace(newNumber, "");
      }
    }
    else {
      currentName = currentName.replace(newNumber, "");
    }

    var newPrice = currentName.match(/(€ \d+\,\d{1,2})/g);
    newPrice = newPrice[0].match(/(\d+\,\d{1,2})/g);
    var newPriceDot = newPrice[0].replace(",", ".");
    var priceAsFloat = parseFloat(newPriceDot);

    if(priceAsFloat === 0.0){continue;}

    currentName = currentName.replace('€ ' + newPrice, "");

    var product = {Name : currentName, Amount : newNumber, Price : priceAsFloat};
    products.push(product);
  }
  return products;
}

function calculateDiscounts(discountfield){
  var splitOnLines = discountfield.split(/\b\n/);
  var discountDict = {};
  var names = [];
  var values = [];
  
  for(var i = 0; i < splitOnLines.length; i++) {
    splitOnLines[i] = splitOnLines[i].replace(/\s\s+/g, " ");
  }

  for(var i = 0; i < splitOnLines.length; i++){
    var split = splitOnLines[i].split("€");
    split[1] = split[1].replace(",",".");
    if(discountDict[split[0]] == null){
      discountDict[split[0]] = parseFloat(split[1]);
      // add ';' to end of name. This is later usefull for correct splitting of the string
      // we add an ';', because we need a way to tell the difference between an ',' to split the different values and ',' in the values itself
      // ',' in the values is then saved as ',' and the ',' to splitt the different values is saved as ";,"
      names.push(split[0] + ";");
      values.push(split[1]);
    }
    /*else {
      discountDict[split[0]] += parseFloat(split[1]);
    }*/
  }

  // Saves the two lists as global properties. these are always strings
  PropertiesService.getScriptProperties().setProperty('names', names.toString());
  PropertiesService.getScriptProperties().setProperty('values', values.toString());
  AddDiscountOptions();
}

function AddDiscountOptions() {
  // get all the names from the property. This uses the ';' to split at the correct point
  var list = PropertiesService.getScriptProperties().getProperty('names').split(";,");
  
  // add all names to the dropdown
  var cell = SpreadsheetApp.getActive().getRange('C2:C51');
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(list).build();
  cell.setDataValidation(rule);
}

function onEdit(e) {
  // this script checks if the user selects a Discount
  var editRange = { // C2:C51
    top : 2,
    bottom : 51,
    left : 3,
    right : 3
  };
  
  // Splits the two proporties at the correct points
  var names = PropertiesService.getScriptProperties().getProperty('names').split(";,");
  var values = PropertiesService.getScriptProperties().getProperty('values').split(',');
  
  // Exit if we're out of range
  var thisRow = e.range.getRow();
  if (thisRow < editRange.top || thisRow > editRange.bottom) return;

  var thisCol = e.range.getColumn();
  if (thisCol < editRange.left || thisCol > editRange.right) return;

  // Exit if we don't have the list
  if(names.length == 0) return;

  var getValue = SpreadsheetApp.getActiveSheet().getRange(thisRow, thisCol).getValue();
  
  var index = names.indexOf(getValue);
  
  // sets the cell to the correct value
  if(index >= 0) {
    var newValue = values[index];
    var ss = e.range.getSheet();
    ss.getRange(thisRow,thisCol)
    .setValue(newValue);
  }
  
}