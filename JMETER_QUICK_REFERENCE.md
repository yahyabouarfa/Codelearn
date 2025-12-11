# JMeter Quick Reference - CodeLearn API

## 🚀 Quick Commands

### Start JMeter GUI
```powershell
cd C:\JMeter\apache-jmeter-5.6.3\bin
.\jmeter.bat
```

### Run Test (Command Line)
```powershell
cd C:\Users\yahya\Desktop\Codelearnappp\Utilisateur
C:\JMeter\apache-jmeter-5.6.3\bin\jmeter.bat -n -t jmeter-test-plan.jmx -l results.jtl -e -o report
```

### View HTML Report
```powershell
start report/index.html
```

---

## 📊 Test Plan Summary

| Test Group | Threads | Ramp-Up | Loops | Total Requests |
|------------|---------|---------|-------|----------------|
| Signup     | 10      | 5s      | 1     | 10             |
| Login      | 20      | 10s     | 3     | 60             |
| Logout     | 5       | 2s      | 1     | 5              |
| **TOTAL**  | **35**  | -       | -     | **75**         |

---

## 🎯 Test Endpoints

### 1. POST /api/auth/signup
```json
{
  "nom": "TestUser",
  "prenom": "JMeter",
  "email": "test@example.com",
  "motDePasse": "Test@123456",
  "role": "STUDENT"
}
```

### 2. POST /api/auth/login
```json
{
  "email": "test@example.com",
  "motDePasse": "Test@123456"
}
```

### 3. POST /api/auth/logout
```json
{}
```

---

## ✅ Pre-Test Checklist

- [ ] Spring Boot app running on http://localhost:8081
- [ ] Database accessible
- [ ] Test user created (test@example.com / Test@123456)
- [ ] JMeter installed
- [ ] Test plan file (jmeter-test-plan.jmx) available

---

## 📈 Performance Targets

| Metric | Target |
|--------|--------|
| Avg Response Time | < 500ms |
| Error Rate | 0% |
| Throughput | > 10 req/s |
| Max Response Time | < 2000ms |

---

## 🔧 Common Modifications

### Change Thread Count
1. Open test plan in JMeter GUI
2. Select Thread Group
3. Modify "Number of Threads (users)"

### Change Server URL
1. Open test plan in JMeter GUI
2. Select "Test Plan"
3. Edit "User Defined Variables"
4. Change BASE_URL and PORT

### Add More Loops
1. Select Thread Group
2. Modify "Loop Count"

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused | Start Spring Boot app |
| 100% errors | Check request format, verify endpoint |
| Slow responses | Check database, system resources |
| JWT not extracted | Verify JSON path: $.token |

---

## 📊 Reading Results

### Summary Report Columns
- **# Samples**: Total requests
- **Average**: Avg response time (ms)
- **Min/Max**: Fastest/slowest response
- **Error %**: Failed request percentage
- **Throughput**: Requests per second
- **KB/sec**: Data transfer rate

### What to Look For
✅ **Good:** Low average time, 0% errors, stable throughput  
⚠️ **Warning:** Response time > 1000ms, errors > 0%  
❌ **Bad:** High error rate, very slow responses

---

## 📁 Generated Files

| File | Description |
|------|-------------|
| `results.jtl` | Raw test results |
| `report/index.html` | HTML dashboard |
| `jmeter.log` | JMeter execution log |

---

## 💡 Tips

1. **Always use command-line for real tests** (GUI is for development)
2. **Run tests multiple times** for consistent results
3. **Monitor system resources** during tests
4. **Clean test data** between runs
5. **Start with low load** and increase gradually

---

## 📞 Need Help?

See full guide: `JMETER_TEST_GUIDE.md`

