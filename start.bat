@echo off
if NOT EXIST node_modules (
    ECHO Le dossier node_modules n'existe pas dans le repertoire; Installation des modules ...
    CALL npm install
    if NOT EXIST node_modules (
        START CMD /C "ECHO Un probleme est survenu lors de l'installation des modules. Assurez-vous que Node (NPM) est installer. && PAUSE"
        EXIT
    )
    ECHO Modules installer.
)
cls
echo Le bot vas demarrer...
node index.js
pause