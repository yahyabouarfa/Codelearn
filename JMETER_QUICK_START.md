# Quick JMeter Test Commands for CodeLearn API

## ✅ Your Setup
- JMeter Location: `C:\JMeter\apache-jmeter-5.6.3\apache-jmeter-5.6.3`
- Project Location: `C:\Users\yahya\Desktop\Codelearnappp\Utilisateur`
- Test Plan: `jmeter-test-plan.jmx`

---

## 🚀 Method 1: Run Tests in GUI Mode (Easy Start)

Open PowerShell and run:

```powershell
cd C:\Users\yahya\Desktop\Codelearnappp\Utilisateur
C:\JMeter\apache-jmeter-5.6.3\apache-jmeter-5.6.3\bin\jmeter.bat -t jmeter-test-plan.jmx
```

This will:
1. Open JMeter GUI with your test plan loaded
2. Click the green "Start" button (▶️) to run tests
3. View results in the listeners at the bottom

---

## 🚀 Method 2: Run Tests in Command-Line Mode (Best Performance)

### Step 1: Make sure your Spring Boot app is running

Open a PowerShell window and run:
```powershell
cd C:\Users\yahya\Desktop\Codelearnappp\Utilisateur
.\mvnw.cmd spring-boot:run
```

Wait for: "Started CodelearnApplication"

### Step 2: Run JMeter tests (in a NEW PowerShell window)

```powershell
cd C:\Users\yahya\Desktop\Codelearnappp\Utilisateur

C:\JMeter\apache-jmeter-5.6.3\apache-jmeter-5.6.3\bin\jmeter.bat -n -t jmeter-test-plan.jmx -l results.jtl -e -o report
```

### Step 3: View the HTML report

```powershell
start report\index.html
```

---

## 🔍 Quick Checks

### Check if JMeter is installed correctly:
```powershell
C:\JMeter\apache-jmeter-5.6.3\apache-jmeter-5.6.3\bin\jmeter.bat --version
```

### Check if your app is running:
```powershell
Invoke-WebRequest -Uri http://localhost:8081/api/auth/login -Method POST -ContentType "application/json" -Body '{"email":"test@test.com","motDePasse":"test"}' -ErrorAction SilentlyContinue
```

---

## 📊 Alternative: Use the PowerShell Script

If you want to use the interactive script, run:

```powershell
cd C:\Users\yahya\Desktop\Codelearnappp\Utilisateur
powershell -ExecutionPolicy Bypass -File run-jmeter-tests.ps1
```

Then:
- Press `1` for GUI mode
- Press `2` for CLI mode (after starting your app)
- Press `4` to check if your app is running

---

## ⚠️ Before First Test Run

Create a test user for login tests using Postman or curl:

```powershell
Invoke-WebRequest -Uri http://localhost:8081/api/auth/signup -Method POST -ContentType "application/json" -Body '{
  "nom": "Test",
  "prenom": "User",
  "email": "test@example.com",
  "motDePasse": "Test@123456",
  "role": "STUDENT"
}'
```

---

## 🎯 What to Expect

When tests run successfully, you'll see:
```
Summary Report
- # Samples: 75
- Average: ~300ms
- Error %: 0.00%
- Throughput: 10-15 req/sec
```

---

## 🐛 Troubleshooting

**Issue:** "Connection refused"
**Solution:** Start your Spring Boot app first

**Issue:** "JMeter not found"
**Solution:** Double-check the path: `C:\JMeter\apache-jmeter-5.6.3\apache-jmeter-5.6.3\bin\jmeter.bat`

**Issue:** "Login test fails"
**Solution:** Create test user first (see above)

---

## 📁 After Running Tests

You'll get these files:
- `results.jtl` - Raw test results
- `report/` folder with `index.html` - Beautiful HTML dashboard
- `jmeter.log` - Test execution log

---

**Recommended: Start with GUI Mode to see how it works, then use CLI mode for real performance testing!**

