# 📊 JMeter Test Suite - Setup Complete!

## ✅ Files Created

Your JMeter test suite has been successfully created with the following files:

### 1. **jmeter-test-plan.jmx**
   - Main JMeter test plan file
   - Contains 3 thread groups (Signup, Login, Logout)
   - Pre-configured with assertions and listeners
   - Ready to run in JMeter

### 2. **JMETER_TEST_GUIDE.md**
   - Complete guide with installation instructions
   - Detailed explanation of test scenarios
   - Troubleshooting section
   - Performance benchmarks
   - Best practices

### 3. **JMETER_QUICK_REFERENCE.md**
   - Quick commands cheat sheet
   - Test plan summary
   - Common modifications
   - Quick troubleshooting guide

### 4. **test-users.csv**
   - Sample test data file
   - 10 test users (7 students, 2 teachers, 1 admin)
   - Can be used with CSV Data Set Config

### 5. **run-jmeter-tests.ps1**
   - PowerShell script for easy test execution
   - Interactive menu with 5 options
   - Automatic report generation
   - Pre-flight checks

---

## 🚀 Quick Start Guide

### Step 1: Install JMeter

1. Download Apache JMeter from: https://jmeter.apache.org/download_jmeter.cgi
2. Extract to `C:\JMeter\apache-jmeter-5.6.3` (or update path in script)
3. Verify Java is installed: `java -version`

### Step 2: Start Your Spring Boot Application

```powershell
cd C:\Users\yahya\Desktop\Codelearnappp\Utilisateur
.\mvnw.cmd spring-boot:run
```

Wait for the message: "Started CodelearnApplication"

### Step 3: Create Test User (for Login Tests)

Before running tests, create a test user with these credentials:
- **Email:** test@example.com
- **Password:** Test@123456
- **Role:** STUDENT

You can use Postman or the signup endpoint.

### Step 4: Run Tests

#### Option A: Using PowerShell Script (Recommended)
```powershell
cd C:\Users\yahya\Desktop\Codelearnappp\Utilisateur
.\run-jmeter-tests.ps1
```

Then select option 2 for command-line mode tests.

#### Option B: Manual Command
```powershell
# Make sure to update the path to your JMeter installation
C:\JMeter\apache-jmeter-5.6.3\bin\jmeter.bat -n -t jmeter-test-plan.jmx -l results.jtl -e -o report

# Open the report
start report\index.html
```

#### Option C: GUI Mode (for test development)
```powershell
C:\JMeter\apache-jmeter-5.6.3\bin\jmeter.bat
# Then: File → Open → jmeter-test-plan.jmx
```

---

## 📊 What the Tests Do

### Test 1: Signup Performance Test
- **Concurrent Users:** 10
- **Total Requests:** 10
- **Duration:** ~5 seconds
- **Purpose:** Tests user registration under load
- **Creates:** Unique users with timestamps

### Test 2: Login Performance Test
- **Concurrent Users:** 20
- **Total Requests:** 60 (3 loops)
- **Duration:** ~10 seconds
- **Purpose:** Tests authentication performance
- **Validates:** JWT token generation

### Test 3: Logout Performance Test
- **Concurrent Users:** 5
- **Total Requests:** 5
- **Duration:** ~2 seconds
- **Purpose:** Tests logout endpoint
- **Validates:** Successful logout response

**Total Test Duration:** ~20 seconds  
**Total Requests:** 75

---

## 📈 Expected Results

If your application is performing well, you should see:

| Metric | Expected Value |
|--------|---------------|
| Average Response Time | < 500ms |
| Error Rate | 0% |
| Throughput | > 10 requests/second |
| Max Response Time | < 2000ms |

---

## 🎯 Test Plan Architecture

```
Test Plan
├── HTTP Header Manager (Content-Type, Accept)
├── User Defined Variables (BASE_URL, PORT)
│
├── Thread Group: Signup Test
│   ├── HTTP Request: POST /api/auth/signup
│   ├── JSON Extractor: Extract JWT Token
│   └── Response Assertion: Status 200
│
├── Thread Group: Login Test
│   ├── HTTP Request: POST /api/auth/login
│   ├── JSON Extractor: Extract JWT Token
│   └── Response Assertion: Contains Token
│
├── Thread Group: Logout Test
│   ├── HTTP Request: POST /api/auth/logout
│   └── Response Assertion: Status 200
│
└── Listeners
    ├── View Results Tree
    ├── Summary Report
    ├── View Results in Table
    └── Graph Results
```

---

## 🔧 Configuration

### Change Server/Port

Edit the test plan in JMeter GUI:
1. Open test plan
2. Navigate to: Test Plan → User Defined Variables
3. Modify:
   - `BASE_URL`: Default is `localhost`
   - `PORT`: Default is `8081`

### Increase Load

To test with more users:
1. Open test plan in JMeter GUI
2. Select a Thread Group
3. Increase "Number of Threads (users)"
4. Adjust "Ramp-up Period (seconds)"

### Add More Iterations

1. Select a Thread Group
2. Increase "Loop Count"

---

## 📁 Output Files

After running tests, you'll get:

### 1. results.jtl (or results_TIMESTAMP.jtl)
- Raw test results in CSV/XML format
- Contains all request/response data
- Can be loaded into JMeter later

### 2. report/ folder (or report_TIMESTAMP/)
- HTML dashboard with graphs
- Detailed statistics
- Response time charts
- Throughput analysis
- Error details

### 3. jmeter.log
- JMeter execution log
- Useful for troubleshooting
- Located in project directory

---

## 🐛 Common Issues & Solutions

### Issue: "Connection refused"
**Solution:** Start your Spring Boot application first
```powershell
.\mvnw.cmd spring-boot:run
```

### Issue: "JMeter not found"
**Solution:** Update the JMETER_HOME path in `run-jmeter-tests.ps1`

### Issue: "Login test fails - user not found"
**Solution:** Create test user first (test@example.com / Test@123456)

### Issue: "High error rate in signup"
**Solution:** Clear test data between runs or use unique emails

### Issue: "Slow performance"
**Possible causes:**
- Database connection issues
- High system resource usage
- Network latency
- Insufficient database connection pool

---

## 📊 Understanding the HTML Report

Open `report/index.html` to see:

### Dashboard Tab
- Overview of test results
- Key metrics at a glance
- Pass/fail status

### Charts Tab
- Response Times Over Time
- Throughput
- Active Threads Over Time
- Response Time Percentiles

### Statistics Tab
- Detailed metrics per endpoint
- Min/Max/Average response times
- Error rates
- Throughput per request

### Errors Tab
- Details of any failures
- Error messages
- Stack traces

---

## 💡 Tips for Better Testing

1. **Start Small:** Begin with 5-10 users, then increase
2. **Use Command-Line:** GUI mode uses more resources
3. **Monitor Server:** Watch CPU, memory, database during tests
4. **Run Multiple Times:** First run may be slower (JVM warmup)
5. **Clean Data:** Remove test users between runs
6. **Test Realistic Scenarios:** Mix different user actions
7. **Set Baseline:** Record performance metrics for comparison

---

## 📚 Next Steps

### 1. Add More Endpoints
Once comfortable with basic tests, add tests for:
- User profile endpoints
- Course management
- Protected resources with JWT

### 2. Advanced Scenarios
- **Stress Test:** High load (100+ users)
- **Endurance Test:** Long duration (hours)
- **Spike Test:** Sudden traffic increase
- **Soak Test:** Sustained load

### 3. Integration with CI/CD
Run tests automatically:
```powershell
# In CI/CD pipeline
jmeter -n -t jmeter-test-plan.jmx -l results.jtl
# Fail if error rate > threshold
```

### 4. Use CSV Data
Load test data from `test-users.csv`:
1. Add "CSV Data Set Config"
2. Point to test-users.csv
3. Use variables in requests

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `JMETER_TEST_GUIDE.md` | Full installation and usage guide |
| `JMETER_QUICK_REFERENCE.md` | Quick commands and tips |
| `JMETER_SETUP_SUMMARY.md` | This file - overview |
| `jmeter-test-plan.jmx` | The actual test plan |
| `test-users.csv` | Sample test data |
| `run-jmeter-tests.ps1` | Helper script |

---

## 🎓 Learning Resources

- **JMeter Official Docs:** https://jmeter.apache.org/usermanual/
- **Best Practices:** https://jmeter.apache.org/usermanual/best-practices.html
- **JMeter Tutorial:** https://jmeter.apache.org/usermanual/get-started.html
- **Functions Reference:** https://jmeter.apache.org/usermanual/functions.html

---

## ✅ Checklist

Before running tests, ensure:

- [ ] Java is installed (JDK 8+)
- [ ] JMeter is downloaded and extracted
- [ ] Path in `run-jmeter-tests.ps1` is correct
- [ ] Spring Boot app is running on port 8081
- [ ] Database is accessible
- [ ] Test user created (test@example.com)
- [ ] Firewall allows localhost connections
- [ ] Sufficient system resources available

---

## 📞 Need Help?

1. **Check troubleshooting** in `JMETER_TEST_GUIDE.md`
2. **Review JMeter logs** in `jmeter.log`
3. **Check application logs** for server-side errors
4. **Verify test plan** in JMeter GUI

---

## 🎉 You're Ready!

Your JMeter test suite is ready to use. Start with the PowerShell script for the easiest experience:

```powershell
.\run-jmeter-tests.ps1
```

Good luck with your performance testing!

---

**Created:** December 11, 2025  
**Project:** CodeLearn API  
**Test Coverage:** Authentication endpoints (signup, login, logout)  
**Version:** 1.0

