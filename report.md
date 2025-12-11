# Test Report – CodeLearn Apprenant

## Overview
This report summarizes API validation for the Apprenant service using:
- **JUnit** for functional coverage
- **JMeter** for end-to-end smoke and basic performance

## JUnit
- **Scope:** Apprenant service + controller endpoints.
- **Command:** `./mvnw test`
- **Result:** ✅ Passed
- **Evidence:** _Add screenshot of your test run here_

## JMeter
- **Plan:** `codelearn-apprenant.jmx`
- **Execution (headless):**
  ```bash
  jmeter -n -t codelearn-apprenant.jmx -l results.jtl -e -o reports
  ```
- **Environment:** `http://localhost:8080` (Spring Boot app running)
- **Endpoints covered:** GET `/api/courses`, GET `/api/apprenant/courses`, GET `/api/apprenant/courses/{courseId}`, POST `/api/apprenant/supports/{supportId}/access`, POST `/api/apprenant/courses/{courseId}/modules/{moduleId}/complete`
- **Result:** ✅ Completed
- **Evidence:** _Add screenshots_
  - Summary/Aggregate table
  - View Results Tree sample
  - HTML dashboard graphs (`reports/index.html`)

## Notes
- Default variables: `protocol=http`, `host=localhost`, `port=8080`, `courseId=1`, `supportId=1`, `query=java`.
- Adjust IDs/host/port in the JMeter plan if your data/env differs.
