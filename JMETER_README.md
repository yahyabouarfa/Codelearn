# 🚀 Quick Start - JMeter Performance Testing

## What Was Created

I've set up a complete JMeter performance testing suite for your CodeLearn authentication API with 6 files:

### 📄 Core Files
1. **jmeter-test-plan.jmx** - The JMeter test plan (ready to run)
2. **test-users.csv** - Sample test data
3. **run-jmeter-tests.ps1** - Automated test runner script

### 📚 Documentation
4. **JMETER_TEST_GUIDE.md** - Complete installation & usage guide
5. **JMETER_QUICK_REFERENCE.md** - Command cheat sheet
6. **JMETER_SETUP_SUMMARY.md** - Detailed overview

---

## ⚡ Run Tests in 3 Steps

### Step 1: Install JMeter
Download from: https://jmeter.apache.org/download_jmeter.cgi
Extract to: `C:\JMeter\apache-jmeter-5.6.3`

### Step 2: Start Your App
```powershell
.\mvnw.cmd spring-boot:run
```

### Step 3: Run Tests
```powershell
.\run-jmeter-tests.ps1
```
Select option 2 (CLI mode) for best results.

---

## 📊 What Gets Tested

- ✅ **Signup endpoint** - 10 concurrent users
- ✅ **Login endpoint** - 20 concurrent users, 3 loops each
- ✅ **Logout endpoint** - 5 concurrent users
- ✅ **Total:** 75 requests in ~20 seconds

---

## 📈 View Results

After running tests, open the HTML report:
```powershell
start report\index.html
```

---

## 📖 Full Documentation

- **Complete Guide:** [JMETER_TEST_GUIDE.md](JMETER_TEST_GUIDE.md)
- **Quick Reference:** [JMETER_QUICK_REFERENCE.md](JMETER_QUICK_REFERENCE.md)
- **Setup Summary:** [JMETER_SETUP_SUMMARY.md](JMETER_SETUP_SUMMARY.md)

---

## ⚠️ Before First Run

Create a test user for login tests:
- Email: `test@example.com`
- Password: `Test@123456`
- Role: `STUDENT`

---

## 🎯 Expected Performance

| Metric | Target |
|--------|--------|
| Avg Response Time | < 500ms |
| Error Rate | 0% |
| Throughput | > 10 req/s |

---

## 💡 Need Help?

Check [JMETER_TEST_GUIDE.md](JMETER_TEST_GUIDE.md) for:
- Installation instructions
- Troubleshooting
- Advanced scenarios
- Best practices

Happy Testing! 🎉

