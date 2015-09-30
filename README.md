Graphical user interface for intellectual systems based on OSTIS project.

See more information at www.ostis.net

Steps for running:

1. Clone ostis geometry system:
	git clone https://github.com/geometryostis/geometry.ostis.git

2. Move to geometry.ostis folder and remove geometry.drawings subfolder

3. Clone geometry drawings:
	git clone https://github.com/MikhailSadovsky/geometry.drawings.git

4. In console tab:
	cd geometry.ostis/scripts

5. Make knowledge base building script:
	./build_kb.sh

6. Make running scripts:
	./run_sctp.sh
   In new console tab
	./run_scweb.sh

7. Open web browser on localhost:8000


Steps for interface developing:

1-3 steps the same as before

4. Change permissions:

	Open geometry.ostis/sc-web/server/ws.py
	Change line 23 (write_rights = True)
	Change line 108 (canEdit = True)
	Change line 124 (self.write_message(message, True))

5. Open any coding tool and import project 
	(choose geometry.ostis/geometry.drawings/src/components/drawings/src as project folder)

6. After making changes:
	In console tab:
		cd geometry.ostis/scripts
	Make update drawings component script:
		./update_component.sh  - script creates drawing.js file, where all *.js files located

7. Make running scripts:
	./run_sctp.sh
   In new console tab
	./run_scweb.sh

8. Open web browser on localhost:8000

=======================
