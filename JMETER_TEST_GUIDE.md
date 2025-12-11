# JMeter Performance Testing Guide for CodeLearn API

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Test Plan Overview](#test-plan-overview)
- [Running Tests](#running-tests)
- [Understanding Results](#understanding-results)
- [Test Scenarios](#test-scenarios)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before running JMeter tests, ensure you have:

1. **Java JDK 8 or higher** installed
   ```powershell
   java -version
   ```

2. **Apache JMeter** installed (Download from: https://jmeter.apache.org/download_jmeter.cgi)

3. **Your Spring Boot application running**
   ```powershell
   cd C:\Users\yahya\Desktop\Codelearnappp\Utilisateur
   .\mvnw.cmd spring-boot:run
   ```
   - Application should be running on `http://localhost:8081`

---

## 📥 Installation

### Installing JMeter on Windows

1. **Download JMeter**
   - Go to: https://jmeter.apache.org/download_jmeter.cgi
   - Download the `.zip` file (e.g., `apache-jmeter-5.6.3.zip`)

2. **Extract the Archive**
   - Extract to a folder like `C:\JMeter\apache-jmeter-5.6.3`

3. **Set Environment Variable (Optional)**
   ```powershell
   # Add JMeter bin directory to PATH
   $env:JMETER_HOME = "C:\JMeter\apache-jmeter-5.6.3"
   $env:Path += ";$env:JMETER_HOME\bin"
   ```

4. **Verify Installation**
   ```powershell
   cd C:\JMeter\apache-jmeter-5.6.3\bin
   .\jmeter.bat --version
   ```

---

## 📊 Test Plan Overview

The provided test plan (`jmeter-test-plan.jmx`) includes:

### Test Groups

#### 1. **Signup Test**
- **Purpose:** Tests user registration endpoint
- **Threads:** 10 concurrent users
- **Ramp-up:** 5 seconds
- **Loops:** 1 iteration per user
- **Endpoint:** `POST /api/auth/signup`
- **Features:**
  - Creates unique users with timestamps
  - Extracts JWT tokens
  - Validates 200 OK responses

#### 2. **Login Test**
- **Purpose:** Tests user authentication endpoint
- **Threads:** 20 concurrent users
- **Ramp-up:** 10 seconds
- **Loops:** 3 iterations per user (60 total requests)
- **Endpoint:** `POST /api/auth/login`
- **Features:**
  - Tests login performance
  - Extracts JWT tokens
  - Validates token presence in response

#### 3. **Logout Test**
- **Purpose:** Tests logout endpoint
- **Threads:** 5 concurrent users
- **Ramp-up:** 2 seconds
- **Loops:** 1 iteration per user
- **Endpoint:** `POST /api/auth/logout`
- **Features:**
  - Tests logout functionality
  - Validates success response

### Configuration Variables

- **BASE_URL:** `localhost`
- **PORT:** `8081`

You can modify these in the test plan to test different environments.

---

## 🚀 Running Tests

### Method 1: GUI Mode (For Test Development)

1. **Start JMeter GUI**
   ```powershell
   cd C:\JMeter\apache-jmeter-5.6.3\bin
   .\jmeter.bat
   ```

2. **Open the Test Plan**
   - File → Open → Select `jmeter-test-plan.jmx`

3. **Configure if needed**
   - Update BASE_URL or PORT in User Defined Variables
   - Adjust thread counts or ramp-up times

4. **Run the Test**
   - Click the green "Start" button (▶️)
   - Or press `Ctrl + R`

5. **View Results**
   - Click on "View Results Tree" to see individual requests
   - Click on "Summary Report" for aggregate statistics
   - Click on "Graph Results" for visual representation

### Method 2: Command Line Mode (For Performance Testing)

⚠️ **Important:** GUI mode consumes significant resources. Use command-line for actual performance testing.

```powershell
# Navigate to your project directory
cd C:\Users\yahya\Desktop\Codelearnappp\Utilisateur

# Run test and generate report
C:\JMeter\apache-jmeter-5.6.3\bin\jmeter.bat -n -t jmeter-test-plan.jmx -l results.jtl -e -o report

# OR if you added JMeter to PATH:
jmeter -n -t jmeter-test-plan.jmx -l results.jtl -e -o report
```

**Command Options:**
- `-n`: Non-GUI mode
- `-t`: Test plan file
- `-l`: Results log file
- `-e`: Generate HTML report
- `-o`: Output folder for HTML report

### Method 3: Run Specific Test Group

```powershell
# Create a copy and modify to enable only one thread group
jmeter -n -t jmeter-test-plan.jmx -l login-results.jtl
```

---

## 📈 Understanding Results

### Key Metrics

1. **Samples**
   - Total number of requests sent

2. **Average (ms)**
   - Average response time
   - **Good:** < 500ms
   - **Acceptable:** 500-1000ms
   - **Poor:** > 1000ms

3. **Min/Max (ms)**
   - Fastest and slowest response times

4. **Std. Dev.**
   - Standard deviation of response times
   - Lower is better (more consistent)

5. **Error %**
   - Percentage of failed requests
   - **Target:** 0%

6. **Throughput**
   - Requests per second
   - Higher is better

7. **KB/sec**
   - Data transfer rate

### Reading the HTML Report

After running in command-line mode, open `report/index.html` in a browser:

```powershell
# Open the report
start report/index.html
```

The HTML report includes:
- **Dashboard:** Overview of test results
- **Charts:** Response times, throughput, transactions per second
- **Statistics:** Detailed metrics per request
- **Errors:** Any failures encountered

---

## 🎯 Test Scenarios

### Scenario 1: Basic Load Test (Current Setup)
- Tests normal load with moderate concurrent users
- Validates API can handle typical traffic

### Scenario 2: Stress Test (Modify Thread Counts)

Edit the test plan to increase load:
- Signup: 50 threads, 10 sec ramp-up
- Login: 100 threads, 20 sec ramp-up, 5 loops
- Logout: 50 threads, 5 sec ramp-up

### Scenario 3: Spike Test

Test sudden traffic increase:
- Set ramp-up time to 1 second
- High thread count (100+)
- Tests system recovery

### Scenario 4: Endurance Test

Test long-running stability:
- Moderate thread count (20-30)
- Many loops (100+)
- Or use scheduler with long duration

---

## 🔍 Monitoring During Tests

### 1. Monitor Application Logs

```powershell
# In another terminal, watch the Spring Boot logs
cd C:\Users\yahya\Desktop\Codelearnappp\Utilisateur
.\mvnw.cmd spring-boot:run
```

### 2. Monitor Database Connections

Check your PostgreSQL database for:
- Connection pool usage
- Query performance
- Lock contention

### 3. System Resources

Use Task Manager to monitor:
- CPU usage
- Memory consumption
- Network I/O

---

## 🛠️ Customizing Tests

### Change Target Server

1. Open `jmeter-test-plan.jmx` in JMeter GUI
2. Navigate to: Test Plan → User Defined Variables
3. Update:
   - `BASE_URL`: Change from `localhost` to your server
   - `PORT`: Change from `8081` to your port

### Add Authentication Header

To test protected endpoints:

1. Add HTTP Header Manager
2. Add header: `Authorization: Bearer ${JWT_TOKEN}`
3. Use the extracted token from login

### Test with CSV Data

Create a CSV file with test data:

```csv
email,password
user1@test.com,Pass123!
user2@test.com,Pass123!
user3@test.com,Pass123!
```

Add CSV Data Set Config in JMeter:
- Filename: `test-users.csv`
- Variable Names: `email,password`
- Use `${email}` and `${password}` in requests

---

## 🐛 Troubleshooting

### Issue 1: Connection Refused

**Problem:** Cannot connect to `localhost:8081`

**Solutions:**
- Ensure Spring Boot app is running
- Check the correct port in application.properties
- Verify firewall settings

### Issue 2: All Requests Failing

**Problem:** 100% error rate

**Solutions:**
- Check application logs for errors
- Verify request body format matches DTOs
- Ensure database is accessible

### Issue 3: Slow Response Times

**Problem:** High average response times

**Solutions:**
- Check database query performance
- Monitor system resources
- Review JPA configurations
- Check network latency

### Issue 4: JWT Extraction Fails

**Problem:** JWT_TOKEN variable shows "NOT_FOUND"

**Solutions:**
- Check JSON Post Processor path: `$.token`
- Verify response contains token field
- Enable "View Results Tree" to see actual response

### Issue 5: Duplicate Email Errors

**Problem:** Signup fails with duplicate email

**Solutions:**
- Test uses timestamps to create unique emails
- Clear database between test runs
- Check email generation pattern

---

## 📝 Test Data

### Default Test User (for Login Test)

Before running login tests, create a test user:

**Email:** `test@example.com`  
**Password:** `Test@123456`  
**Role:** `STUDENT`

You can create this via Postman or signup endpoint first.

### Auto-generated Signup Users

The signup test creates users with pattern:
- **Name:** `TestUser_<thread_num>`
- **Email:** `testuser<thread_num>_<timestamp>@test.com`
- **Password:** `Test@123456`
- **Role:** `STUDENT`

---

## 📊 Performance Benchmarks

### Expected Results (Good Performance)

| Endpoint | Avg Response Time | Throughput | Error % |
|----------|------------------|------------|---------|
| Signup   | < 500ms          | > 10 req/s | 0%      |
| Login    | < 300ms          | > 20 req/s | 0%      |
| Logout   | < 200ms          | > 30 req/s | 0%      |

### Warning Signs

- Response time > 2000ms
- Error rate > 5%
- Throughput drops during test
- Increasing response times over time

---

## 🎓 Best Practices

1. **Always test in non-production environment first**
2. **Use command-line mode for actual performance tests**
3. **Monitor system resources during tests**
4. **Clean test data after tests**
5. **Run tests multiple times for consistency**
6. **Document baseline performance metrics**
7. **Test one endpoint at a time initially**
8. **Gradually increase load**

---

## 📚 Additional Resources

- **JMeter Documentation:** https://jmeter.apache.org/usermanual/index.html
- **JMeter Best Practices:** https://jmeter.apache.org/usermanual/best-practices.html
- **JMeter Functions:** https://jmeter.apache.org/usermanual/functions.html

---

## 🎯 Quick Start Checklist

- [ ] Java installed and verified
- [ ] JMeter downloaded and extracted
- [ ] Spring Boot application running on port 8081
- [ ] Test user created (test@example.com)
- [ ] JMeter test plan loaded
- [ ] Test executed successfully
- [ ] Results reviewed and documented

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review JMeter logs in `jmeter.log`
3. Check Spring Boot application logs
4. Verify database connectivity

---

**Created:** December 11, 2025  
**Test Plan Version:** 1.0  
**Compatible with:** JMeter 5.x and above

