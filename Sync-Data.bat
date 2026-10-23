@echo off
rem Rebuilds assets/js/data.js from /data/*.json (run after editing the JSON files).
cd /d "%~dp0"
node sync-data.js
pause
