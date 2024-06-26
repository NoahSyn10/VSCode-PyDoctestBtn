# Change Log

All notable changes to the "PyDoctestBtn" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## v1.0.7 - 2022-06-06
### Quick Fix
* Update pythonpath retrieval to search elsewhere, and then fall back on an editable setting.
* Fixes an issue where certain operating systems printed 'undefined' rather than the python path
* Thanks to jguerra-astro and Paul-Durrant: https://github.com/NoahSyn10/VSCode-PyDoctestBtn/issues/7

## v1.0.4 - 2022-01-20
### Quick Fix
* Add quotes around the filename to fix errors when dealing with a filename containing spaces
* Thanks to logonoff: https://github.com/NoahSyn10/VSCode-PyDoctestBtn/issues/5

## v1.0.3 - 2021-04-08
### Fixes for changes made in the VSCode March 2021 release.
  * Fix for change in title 'groups' that caused the doctestBtn to fail to appear.

## v1.0.2 - 2021-03-24
### Quick fix.
  * Fixed issue where an & symbol prefixing the doctest command could cause issues on non-windows devices.
  * Thanks to vbrozik: https://github.com/NoahSyn10/VSCode-PyDoctestBtn/issues/3

## v1.0.1 - 2021-02-13
### Quick fix.
* Fixed issue where ReadMe was not showing in the VSCode extension viewer.

## 1.0.0 - 2021-02-02
### Initial release
#### Introduced:
  * 'Doctest Python File in Terminal' command.
  * The doctest button (maps to the command).
  * Three button 'themes'.
  * Three related settings.