@echo off
echo ======================================
echo  Plateforme de Cours - Backend API
echo ======================================
echo.
echo Demarrage de l'application...
echo.
echo IMPORTANT: Verifiez que vous avez configure vos credentials Cloudinary
echo dans src\main\resources\application.properties avant de continuer!
echo.
pause
echo.
echo Lancement en cours...
call mvnw.cmd spring-boot:run

