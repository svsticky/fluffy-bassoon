// --Globals--
// Current File
var ui = SpreadsheetApp.getUi();
var currentSheet = SpreadsheetApp.getActiveSheet();
 
 
//Set up the Menu Dropdown.
function onOpen(e) {
    ui.createMenu("Multi HTML")
    .addItem("Formatter","setupSideBar")
    .addToUi();
};
 
//Set up for first time use.
function onInstall(e){
  ui.alert("Starting");
  onOpen();
};

function setupSideBar(){
  var html = HtmlService
    .createTemplateFromFile("Index")
    .evaluate();
  //Once created it becomes a HtmlOutput
  html.setTitle("Formatter");
  ui.showSidebar(html);
};
 
// Creates an import or include function so files can be added 
// inside the main index.
function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
};

function formatButton(inputField) {
    formatText(inputField);
    setupSideBar();
} 

function setCell(row, inputIndex, output) {
    currentSheet.getRange(row + inputIndex)
    .setValue(output);
}

// Dit is een test

function formatText(inputField) {
  //var split = inputField.split(/  +/g); deze split bij meerdere whitespaces
  var split = inputField.split(/\b\n/);
  for(var i = 0; i < split.length; i++) {
    split[i] = split[i].replace(/[^a-z]/gi, '');
  }
  Logger.log(split);
}