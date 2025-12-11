# Script de test de connexion à la base de données
# Usage: .\test-connection.ps1

Write-Host "=== Test de Connexion à la Base de Données ===" -ForegroundColor Cyan
Write-Host ""

# Attendre que le serveur démarre
Write-Host "Attente du démarrage du serveur..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

try {
    Write-Host "Test de l'endpoint /api/admin/db-test..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/db-test" -Method GET
    
    Write-Host ""
    Write-Host "✓ Connexion réussie!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Informations de la base de données:" -ForegroundColor Cyan
    Write-Host "  - Status: $($response.status)" -ForegroundColor White
    Write-Host "  - Connected: $($response.connected)" -ForegroundColor White
    Write-Host "  - Database: $($response.databaseProductName) $($response.databaseProductVersion)" -ForegroundColor White
    Write-Host "  - Driver: $($response.driverName) $($response.driverVersion)" -ForegroundColor White
    Write-Host "  - URL: $($response.url)" -ForegroundColor White
    Write-Host "  - Username: $($response.username)" -ForegroundColor White
    Write-Host ""
    
    if ($response.databaseProductName -eq "H2") {
        Write-Host "ℹ Mode Développement (H2 en mémoire)" -ForegroundColor Yellow
        Write-Host "Pour tester avec Neon (PostgreSQL), définir les variables d'environnement:" -ForegroundColor Yellow
        Write-Host '  $env:JDBC_DATABASE_URL="jdbc:postgresql://..."' -ForegroundColor Gray
        Write-Host '  $env:JDBC_DATABASE_USERNAME="..."' -ForegroundColor Gray
        Write-Host '  $env:JDBC_DATABASE_PASSWORD="..."' -ForegroundColor Gray
        Write-Host "Puis lancer: mvn spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=prod" -ForegroundColor Gray
    } elseif ($response.databaseProductName -eq "PostgreSQL") {
        Write-Host "✓ Mode Production (PostgreSQL/Neon)" -ForegroundColor Green
    }
    
} catch {
    Write-Host ""
    Write-Host "✗ Erreur de connexion!" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Vérifier que l'application est démarrée avec:" -ForegroundColor Yellow
    Write-Host "  mvn spring-boot:run" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "=== Test des endpoints utilisateurs ===" -ForegroundColor Cyan
Write-Host ""

try {
    Write-Host "Test de GET /api/admin/users..." -ForegroundColor Yellow
    $users = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/users" -Method GET
    Write-Host "✓ Endpoint users accessible" -ForegroundColor Green
    Write-Host "  Nombre d'utilisateurs: $($users.Count)" -ForegroundColor White
    
    Write-Host ""
    Write-Host "Test de GET /api/admin/cours..." -ForegroundColor Yellow
    $cours = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/cours" -Method GET
    Write-Host "✓ Endpoint cours accessible" -ForegroundColor Green
    Write-Host "  Nombre de cours: $($cours.Count)" -ForegroundColor White
    
} catch {
    Write-Host "✗ Erreur lors du test des endpoints" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Tests terminés ===" -ForegroundColor Cyan
Write-Host ""
