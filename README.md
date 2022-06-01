# DoctestBtn README

DoctestBtn is a simple VSCode extension that aims to replicate the ease of use of the 'run button' included in Microsoft's [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) and apply it to running Python [doctests](https://docs.python.org/3/library/doctest.html).

## Features

- - -

### The Doctest Button

* The doctest button mimics the functionality of the Python extension's run button and uses it to run doctests.
* When clicked:
  * The active document is saved.
  * Focus is brought to the terminal (*a terminal is created if necessary*).
  * Your preferred Python path is used to doctest the active document.

       <img src=https://raw.githubusercontent.com/NoahSyn10/VSCode-PyDoctestBtn/main/assets/example/ExampleGif.gif width="600">
      
      ##### GIF created with [LiceCap](http://www.cockos.com/licecap/).

### Button Icon Options

* There are three options for the style of the doctest button:
  * 'Plain'
  * 'Fancy'
  * 'Xtra Fancy'
    ##### *Named for their alphabetical order.
    
  <img src=https://raw.githubusercontent.com/NoahSyn10/VSCode-PyDoctestBtn/main/assets/example/BtnComparison.png width="250">

* The preferred icon can be chosen using two boolean configurations in user settings.
  * Turning on 'Xtra Fancy' overrides 'Fancy' regardless of its state.

### `execDoctest` Command

* Can be found in command pallate under "Execute Python File in Terminal" when a .py file is in focus.
  * Saves active document.
  * Focus is brought to the terminal (*a terminal is created if necessary*).
  * Your preferred Python and Doctest paths are used to doctest the active document.
  
- - -

## Extension Settings

This extension contributes the following settings:

* `doctestbtn.buttonColor.fancy`: 
  * Choose to use the 'Fancy' themed button.
* `doctestbtn.buttonColor.xtraFancy`: 
  * Choose to use the 'Xtra Fancy' theme button.
  * ***Overrides `'fancy'` theme.***
* `doctestbtn.doctestPath`: 
  * Change the path to the doctest module.
* `doctestbtn.dtPythonPath`:
  * Change the fallback path to the Python Interpereter.

- - -

## Requirements

* Requires the [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) to retrieve the Python path preference.
* Requires the [Python](https://www.python.org/) programming language.

- - -

## To Do

* [ ] Implement Doctest Detection.
  * Detect doctests in python files.
  * Only show button when doctests are present.
  * Show number of tests found in status bar.
    * Maybe show tests passed/failed?
* [ ] Add command structure setting.
  * Would allow you to change the structure of the command sent during doctest execution

- - -

## Known Issues

N/A

## Release Notes

## v1.0.6 - 2022-06-01

* Update pythonpath retrieval to search elsewhere, and then fall back on an editable setting (`dtPythonPath`).
  * Helps fix an issue where certain operating systems printed 'undefined' rather than the python path
  * Thanks to jguerra-astro and Paul-Durrant: https://github.com/NoahSyn10/VSCode-PyDoctestBtn/issues/7

## v1.0.4 - 2022-01-20

* Add quotes around the filename 
  * Fixes errors when dealing with a filename containing spaces
  * Thanks to logonoff: https://github.com/NoahSyn10/VSCode-PyDoctestBtn/issues/5

## v1.0.3 - 2021-04-08

* Fixes for changes made in the VSCode March 2021 release.
  * Fix for change in title 'groups' that caused the doctestBtn to fail to appear.

### v1.0.2 - 2021-03-24

* Quick fix.
  * Fixed issue where an & symbol prefixing the doctest command could cause issues on non-windows devices.
  * Thanks to vbrozik: https://github.com/NoahSyn10/VSCode-PyDoctestBtn/issues/3

### v1.0.1 - 2021-02-13

* Quick fix.
  * Fixed issue where ReadMe was not showing in the VSCode extension viewer.

### v1.0.0 - 2021-02-02

* Initial release of DoctestBtn.
* Introduced:
  * 'Doctest Python File in Terminal' command.
  * The doctest button (maps to the command).
  * Three button 'themes'.
  * Three related settings.

---