# DoctestBtn README

DoctestBtn is a simple VSCode extension that aims to replicate the ease of use of the 'run button' included in Microsoft's [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) and apply it to running Python [doctests](https://docs.python.org/3/library/doctest.html).

## Features
- - -
### The Doctest Button

* The doctest button mimics the functionality of the Python extension's run button and uses it to run doctests.
* When clicked:
  * The active document is saved
  * Focus is brought to the terminal (*a terminal is created if necessary*)
  * Your preferred Python path is used to doctest the active document

       <img src=assets/example/ExampleGif.gif width="750">
      
      ##### GIF created with [LiceCap](http://www.cockos.com/licecap/).
### Button Icon Options

* There are three options for the style of the doctest button
  * 'Plain'
  * 'Fancy'
  * 'Xtra Fancy'
    ##### *Named for their alphabetical order
    
  <img src=assets/example/BtnComparison.png width="250">

* The preferred icon can be chosen using two boolean configurations in user settings
  * Turning on 'Xtra Fancy' overrides 'Fancy' regardless of its state
  
- - -

## Extension Settings

This extension contributes the following settings:

* `doctestbtn.buttonColor.fancy`: 
  * Choose to use the 'Fancy' themed button
* `doctestbtn.buttonColor.xtraFancy`: 
  * Choose to use the 'Xtra Fancy' theme button
  * ***Overrides `'fancy'` theme***
* `doctestbtn.doctestPath`: 
  * Change the path to the doctest module
  

- - -

## Requirements

* Requires the [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) to retrieve the Python path preference
* Requires the [Python](https://www.python.org/) programming language

- - -

## Known Issues

N/A

## Release Notes

### v1.0.0 
##### - 02/01/21

* Initial release of DoctestBtn
* Introduced:
  * The doctest button
  * Three button 'themes'
  * Three related settings

---