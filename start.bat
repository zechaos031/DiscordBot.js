@echo off
chcp 65001 > nul
if NOT EXIST node_modules (
    ECHO Le dossier node_modules n'existe pas dans le répertoire; Installation des modules...
    CALL npm install
    if NOT EXIST node_modules (
        START CMD /C "ECHO Un problème est survenu lors de l'installation des modules. Assurez-vous que Node (NPM) est installé. && PAUSE"
        EXIT
    )
    ECHO Modules installés.
)
cls
echo Le bot va démarrer...
node index.js
node --trace-warnings index.js
pause