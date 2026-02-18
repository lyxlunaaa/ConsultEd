# Testing Data Import - Quick Start

## Files Created

1. **`testing_guide.md`** - Comprehensive testing guide with all instructions
2. **`sample_students.csv`** - CSV file with 15 sample students
3. **`database/import_test_data.sql`** - Complete SQL script to import all test data

---

## Quick Import (Recommended)

### Step 1: Import Test Data via SQL

```bash
# Navigate to project directory
cd C:\Users\MKS\Desktop\Assignment

# Run the import script
mysql -u root -p consulted_db < database\import_test_data.sql
```

**This will import:**
- ✅ 4 Admin users (registrar, dean, it_chair, cs_chair)
- ✅ 4 Professors
- ✅ 15 Students (8 IT, 7 CS)
- ✅ 8 Courses (4 IT, 4 CS)
- ✅ Professor-Course assignments
- ✅ Student enrollments

### Step 2: Update Passwords

**IMPORTANT:** The SQL script uses placeholder password hashes. You need to generate real bcrypt hashes.

**Option A: Use the backend to create users**
1. Start the backend server
2. Use the admin interface to add users (it will hash passwords automatically)

**Option B: Generate hashes manually**
```javascript
// In Node.js console
const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('password', 10));
```

Then replace the placeholder hashes in `import_test_data.sql`

---

## Test Credentials (After Import)

| Role | Username | Password | Access |
|---|---|---|---|
| **Students** | | | |
| IT Student | 2021-00001 | password | password |
| IT Student | 2021-00002 | password | password |
| CS Student | 2021-00003 | password | password |
| CS Student | 2021-00004 | password | password |
| **Professors** | | | |
| IT Professor | EMP-001 | password | password |
| CS Professor | EMP-002 | password | password |
| **Admins** | | | |
| Registrar | registrar | password | password |
| Dean | dean | password | password |
| IT Chair | it_chair | password | password |
| CS Chair | cs_chair | password | password |

---

## Alternative: Add Students via Admin UI

1. Login as admin: `registrar` / `password`
2. Go to **Manage Students**
3. Click **"+ Add Student"**
4. Fill in form using data from `sample_students.csv`
5. Click **Create**

---

## Verify Import

```sql
-- Check student count
SELECT p.program_name, COUNT(*) as students
FROM students s
JOIN programs p ON s.program_id = p.program_id
GROUP BY p.program_name;

-- Check enrollments
SELECT s.student_number, COUNT(*) as courses
FROM enrollments e
JOIN students s ON e.student_id = s.student_id
GROUP BY s.student_id;
```

---

## Quick Test Scenario

1. **Login as Student** (`2021-00001` / `password`)
   - View enrolled courses
   - Request consultation with Prof. Sanchez

2. **Login as Professor** (`EMP-001` / `password`)
   - View consultation requests
   - Approve the request

3. **Login as Admin** (`registrar` / `password`)
   - View all students
   - Add new student
   - Edit student details

---

## Need Help?

See **`testing_guide.md`** for:
- Detailed testing checklist
- Complete test scenarios
- Troubleshooting guide
- Verification queries
