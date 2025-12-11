# JMeter Test Runner Script for CodeLearn API
# This script helps you run JMeter tests easily

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  CodeLearn JMeter Test Runner" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$JMETER_HOME = "C:\JMeter\apache-jmeter-5.6.3\apache-jmeter-5.6.3"
$PROJECT_DIR = "C:\Users\yahya\Desktop\Codelearnappp\Utilisateur"
$TEST_PLAN = "jmeter-test-plan.jmx"

# Check if JMeter exists
if (-not (Test-Path "$JMETER_HOME\bin\jmeter.bat")) {
    Write-Host "ERROR: JMeter not found at $JMETER_HOME" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please update JMETER_HOME variable in this script or install JMeter." -ForegroundColor Yellow
    Write-Host "Download from: https://jmeter.apache.org/download_jmeter.cgi" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if test plan exists
if (-not (Test-Path "$PROJECT_DIR\$TEST_PLAN")) {
    Write-Host "ERROR: Test plan not found at $PROJECT_DIR\$TEST_PLAN" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Change to project directory
Set-Location $PROJECT_DIR

Write-Host "Configuration:" -ForegroundColor Green
Write-Host "   JMeter Home: $JMETER_HOME" -ForegroundColor Gray
Write-Host "   Project Dir: $PROJECT_DIR" -ForegroundColor Gray
Write-Host "   Test Plan:   $TEST_PLAN" -ForegroundColor Gray
Write-Host ""

# Menu
Write-Host "Select test mode:" -ForegroundColor Yellow
Write-Host "1. Run tests in GUI mode (for development/debugging)" -ForegroundColor White
Write-Host "2. Run tests in CLI mode (for performance testing)" -ForegroundColor White
Write-Host "3. Open existing HTML report" -ForegroundColor White
Write-Host "4. Check if Spring Boot app is running" -ForegroundColor White
Write-Host "5. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Starting JMeter in GUI mode..." -ForegroundColor Green
        Write-Host "Remember: GUI mode is for test development only!" -ForegroundColor Yellow
        Write-Host ""
        Start-Process "$JMETER_HOME\bin\jmeter.bat" -ArgumentList "-t", "$TEST_PLAN"
        Write-Host "JMeter GUI started. Load the test plan and click Start button." -ForegroundColor Green
    }

    "2" {
        Write-Host ""
        Write-Host "IMPORTANT: Make sure your Spring Boot application is running!" -ForegroundColor Yellow
        Write-Host ""
        $confirm = Read-Host "Is your application running on http://localhost:8081? (y/n)"

        if ($confirm -eq "y" -or $confirm -eq "Y") {
            Write-Host ""
            Write-Host "Running JMeter tests in command-line mode..." -ForegroundColor Green
            Write-Host ""

            # Create timestamp for results
            $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
            $resultsFile = "results_$timestamp.jtl"
            $reportFolder = "report_$timestamp"

            Write-Host "Results will be saved to:" -ForegroundColor Cyan
            Write-Host "   Results file: $resultsFile" -ForegroundColor Gray
            Write-Host "   HTML report:  $reportFolder\index.html" -ForegroundColor Gray
            Write-Host ""

            # Run JMeter
            & "$JMETER_HOME\bin\jmeter.bat" -n -t $TEST_PLAN -l $resultsFile -e -o $reportFolder

            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "Tests completed successfully!" -ForegroundColor Green
                Write-Host ""
                $openReport = Read-Host "Do you want to open the HTML report? (y/n)"
                if ($openReport -eq "y" -or $openReport -eq "Y") {
                    Start-Process "$reportFolder\index.html"
                }
            }
            else {
                Write-Host ""
                Write-Host "Tests failed. Check the output above for errors." -ForegroundColor Red
            }
        }
        else {
            Write-Host "Please start your Spring Boot application first:" -ForegroundColor Red
            Write-Host "   cd $PROJECT_DIR" -ForegroundColor Yellow
            Write-Host "   .\mvnw.cmd spring-boot:run" -ForegroundColor Yellow
        }
    }

    "3" {
        Write-Host ""
        Write-Host "Looking for HTML reports..." -ForegroundColor Green
        $reports = Get-ChildItem -Path $PROJECT_DIR -Directory -Filter "report_*" | Sort-Object LastWriteTime -Descending

        if ($reports.Count -eq 0) {
            Write-Host "No reports found. Run tests first (option 2)." -ForegroundColor Red
        }
        else {
            Write-Host "Found $($reports.Count) report(s):" -ForegroundColor Cyan
            for ($i = 0; $i -lt $reports.Count; $i++) {
                Write-Host "  $($i+1). $($reports[$i].Name) - $($reports[$i].LastWriteTime)" -ForegroundColor White
            }
            Write-Host ""

            if ($reports.Count -eq 1) {
                $reportIndex = 0
            }
            else {
                $reportChoice = Read-Host "Select report to open (1-$($reports.Count))"
                $reportIndex = [int]$reportChoice - 1
            }

            if ($reportIndex -ge 0 -and $reportIndex -lt $reports.Count) {
                $selectedReport = $reports[$reportIndex]
                Write-Host "Opening $($selectedReport.Name)..." -ForegroundColor Green
                Start-Process "$($selectedReport.FullName)\index.html"
            }
            else {
                Write-Host "Invalid selection." -ForegroundColor Red
            }
        }
    }

    "4" {
        Write-Host ""
        Write-Host "Checking if Spring Boot app is running on port 8081..." -ForegroundColor Green
        Write-Host ""

        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8081" -Method GET -TimeoutSec 5 -ErrorAction Stop
            Write-Host "Application is running!" -ForegroundColor Green
            Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Gray
        }
        catch {
            if ($_.Exception.Message -like "*401*" -or $_.Exception.Message -like "*403*") {
                Write-Host "Application is running (authentication required)" -ForegroundColor Green
            }
            else {
                Write-Host "Application is NOT running or not accessible." -ForegroundColor Red
                Write-Host ""
                Write-Host "To start the application:" -ForegroundColor Yellow
                Write-Host "   cd $PROJECT_DIR" -ForegroundColor White
                Write-Host "   .\mvnw.cmd spring-boot:run" -ForegroundColor White
            }
        }
    }

    "5" {
        Write-Host ""
        Write-Host "Goodbye!" -ForegroundColor Cyan
        exit 0
    }

    default {
        Write-Host ""
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host ""
Read-Host "Press Enter to exit"

