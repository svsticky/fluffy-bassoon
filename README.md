# fluffy-bassoon
Stocky reborn

## Using the program
* copy everything underneath: "bestelde producten". (start with the first number, don't copy "Bestelde producten").
* paste the data into the textField with the name: "bestelde producten".
* Make sure that the last symbol in de field is a number/letter/etc. and not a whitespace.
* click on the "Format" button.

## Starting up
* Clone the repo in your desired folder.
* install clasp.
    * Go to https://yagisanatode.com/2019/04/01/working-with-google-apps-script-in-visual-studio-code-using-clasp/ and download clasp. DON'T CLONE OR CREATE YET, JUST INSTALL CLASP AND LOGIN.
* Go to https://script.google.com and create a new project and open the project to go to the editor.
* Copy the url.
* create a temporary folder.
* open this folder in visual studio code.
* open the terminal in visual studio code (ctrl + `)
* type: clasp clone [url you just copied]
* you get three files: .json, .clasp.json and .js
* copy the .json and .clasp.json in your cloned repo.
* you now have your own test environment.

## Testing
you can test the code as a addon. Go to "Run" in the menu and select "test as addon". you can select your options and the file you want to test it in.
the addon is our test environment. Final versions of the project will be deployed to the code begind the spreadsheet and everything will be used as a menu option.

## Clasp functions
* clasp create: create a new google scripts project on your account.
* clasp push: push all your code to a google scripts project.
* clasp pull: pull all code from a google scripts project.
* clasp clone: clone a existing google scripts project.