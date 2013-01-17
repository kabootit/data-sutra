This is an installer of Data Sutra application platform with Demo CRM.

For the most up to date version of these instructions, please visit:
http://community.data-sutra.com/projects/datasutra/wiki/Developer_installation

FILES

- LICENSE.txt
- README.txt
- sutra.servoy
- sutra_no_connector.servoy
- sutra.jar
- sutra.sql
- ROOT directory

1) LICENSE.txt

License for Data Sutra application platform (GNU AGPLv3).

2) README.txt

This document containing basic instructions.

3) VERSION.txt

Version of Data Sutra included.

4) sutra.servoy

Servoy install file with sample and meta data. Includes everything needed to be up and running.

5) sutra_no_connector.servoy

Servoy install file without data for upgrade installs.

6) sutra.jar

Plugin needed to run Data Sutra. Place in /Servoy/application_server/plugins directory.

7) sutra.sql

A MySQL dump file of all data. Included just in case.

8) ROOT directory

Copy the contents of this directory into Servoy's server ROOT directory:
	/Servoy/application_server/server/webapps/ROOT
Note that you will overwrite some files.


INSTALLATION

- Database connections required:
	- sutra
	- sutra_example
	- sutra_log

- Plugins required
	- sutra.jar
		included with the download
	- ScrollerPlus.jar:
		http://www.servoyforge.net/projects/scroller
	- keyListener.jar:
		http://www.servoyforge.net/projects/keylisteners
	- Web Client Utils:
		https://www.servoyforge.net/projects/webclientutils
		

- import the sutra.servoy (or sutra_no_connector.servoy, if upgrading) file

- place the contents of the ROOT directory in the ROOT directory


SERVER SETTINGS

- http://localhost:8080/servoy-admin/
	- make sure that servoy.application_server.allowClientRepositoryAccess is true


DOCUMENTATION

http://www.data-sutra.com/


FEEDBACK

E-mail: sutra@data-mosaic.com
