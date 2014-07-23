Braindump HTML/Javascript client
==================
Braindump is an alternative to [Evernote](http://www.evernote.com), born out of 
frustration as it is becoming more more locked down.
As I want to be in control of my own notes and bookmarks, I've
decided to take a shot at developing my own note takeing app.

This project contains a HTML/Javascript based client for the [Braindump backend](https://github.com/wmenge/braindump-api).

Created by Wilco Menge (wilcomenge@gmail.com), the code is hosted at [github](https://github.com/wmenge/braindump-client)

See [Braindump API](https://github.com/wmenge/braindump-api) for the REST based backend API.


Roadmap
-------
Currently, storing and retrieving simple HTML notes is supported. If this project works out well I'll be adding functionality so  Braindump can serve as a reasonable alternative to Evernote.

**Currently supported features:**

* Simple, clean but fully functional UI
* Maintaining/retrieving Notebooks: A notebook contains a number of Notes
* Maintaining/retrieving Notes: A note is a piece of HTML contained in a Notebook
* Searching in Notes (either in all Notes or Notes in a single Notebook)
* Sorting of Notes and Notebooks

**Planned features:**

* Simple admin console embedded in this project
* Tagging of notes
* Import/export of notes
* Multiple users
* Paste images/attachments
* Security (Encryption of notes)

Implementation details
----------------------

* [AngularJS](https://angularjs.org) Javascript application framework
* [Bootstrap](http://getbootstrap.com) UI Framework (Except Js part, as it is based on Jquery)
* [Angular UI Bootstrap](http://angular-ui.github.io/bootstrap/) Provides glue between Angular and Bootstrap
* [textAngular](http://textangular.com) Angular based RTF editor
* [Angular Loading Bar](https://chieffancypants.github.io/angular-loading-bar/)

###Data Model

####Notebook

field       |type
---         |---
**id**      |`id`
title   |`string`

####Note

field       |type
---         |---
**id**      |`id`
notebook_id |`foreign_key`
title   |`string`
created   |`timestamp`
updated   |`timestamp`
url |`url`
content   |`string`

Future versions:

####Tag

field       |type
---         |---
**tag_id**  |`id`
note_id   |`foreign_key`
tag     |`string`
  
F.A.Q
-----

A list of FAQs

Todo
----

* Use JAM Dependancy manager, http://jamjs.org
* Exand README into:

README, FAQ, INSTALL, CHANGE_LOG (for every release)

Links & References
------------------

A list of links
