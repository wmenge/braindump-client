Braindump HTML/Javascript client
==================
Braindump is an alternative to [Evernote](http://www.evernote.com), born out of 
frustration as it is becoming more more locked down.
As I want to be in control of my own notes and bookmarks, I've
decided to take a shot at developing my own note takeing app.

This project contains a very basic Proof-of-Concept-like HTML/Javascript based client. 

Created by Wilco Menge (wilcomenge@gmail.com), the code is hosted at [github](https://github.com/wmenge/braindump-client)

See [Braindump API](https://github.com/wmenge/braindump-api) for the REST based backend API.


Roadmap
-------
Currently, storing and retrieving plain-text notes is supported. If this project works out well I'll be adding functionality so 
Braindump can serve as a reasonable alternative to Evernote.

**Currently supported features:**

* Maintaining/retrieving Notebooks: A notebook contains a number of Notes
* Maintaining/retrieving Notes: A note is a piece of plaintext contained in a Notebook

**Planned features:**

* Simple admin console embedded in this project
* Tagging of notes
* Import/export of notes
* Multiple users
* Search
* HTML Notes
* Paste images/attachments
* Security (Encryption of notes)

Implementation details
----------------------

* [AngularJS](https://angularjs.org)

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
