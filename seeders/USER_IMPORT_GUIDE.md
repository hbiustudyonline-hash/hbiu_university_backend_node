# User Import Guide - HBIU University

## Overview
This guide explains how to import all students and staff into the HBIU Virtual Campus system.

## Current Status
✅ **121 Lecturers** - Already seeded and available in the system
⚠️ **3124 Students** - Sample seeded, full import pending

## Quick Start

### Method 1: Run the Existing Seeder (Recommended for Testing)
```bash
cd seeders
node seedAllUsers.js
```
This will seed:
- 121 lecturers (complete)
- Sample students from inline data or allStudentsData.json

### Method 2: Import from CSV (Recommended for Full Dataset)

#### Step 1: Prepare Your CSV File
Create a CSV file with the following columns:
- `name` - Full name of the student
- `email` - Email address (must be unique)
- `program` - Degree program (Bachelor, Master, Doctorate, or empty)
- `status` - Account status (active or suspended)

**Example CSV format:**
```csv
name,email,program,status
John Doe,john.doe@example.com,Bachelor,active
Jane Smith,jane.smith@example.com,Master,suspended
```

#### Step 2: Run the Import Script
```bash
cd seeders
node importFromCSV.js path/to/your/students.csv student
```

For lecturers:
```bash
node importFromCSV.js path/to/your/lecturers.csv lecturer
```

### Method 3: Use JSON File

#### Step 1: Update allStudentsData.json
Edit the file `seeders/allStudentsData.json` and add all student records:

```json
[
  {
    "name": "Student Name",
    "email": "student@example.com",
    "program": "Bachelor",
    "status": "active"
  },
  ...
]
```

#### Step 2: Run the Seeder
```bash
cd seeders
node seedAllUsers.js
```

The seeder will automatically detect and load students from the JSON file.

## Complete Student List

To add ALL 3124 students provided by the administrator:

### Option A: Excel to CSV Conversion
1. Open your student list in Excel
2. Ensure columns are:  
   - Column A: Name
   - Column B: Email
   - Column C: Program (optional)
   - Column D: Status (active/suspended)
3. Save as CSV (Comma delimited) format
4. Run: `node importFromCSV.js your-file.csv student`

### Option B: Manual JSON Update
1. Open `seeders/allStudentsData.json`
2. Add each student entry in this format:
   ```json
   {"name":"Student Name","email":"email@domain.com","program":"Degree","status":"active"}
   ```
3. Save the file
4. Run: `node seedAllUsers.js`

## Default Credentials

All imported users have the same default password:
**Password:** `password123`

Users should be prompted to change this on first login.

## Verification

After importing, verify the users in the admin dashboard:
1. Log in to the admin dashboard
2. Navigate to "User Management"
3. You should see all imported users listed

### Check User Counts
To verify the import was successful, you can query the database:
```javascript
// In Node.js REPL or script
const { User } = require('./models');

// Count lecturers
User.count({ where: { role: 'lecturer' } }).then(count => {
  console.log('Lecturers:', count); // Should be 121
});

// Count students
User.count({ where: { role: 'student' } }).then(count => {
  console.log('Students:', count); // Should be 3124
});
```

## Troubleshooting

### Duplicate Email Errors
The system will automatically skip duplicate emails using `ignoreDuplicates: true`.

### Validation Errors
- **Name too short:** Ensure both firstName and lastName are at least 2 characters
- **Invalid email:** Check email format is valid
- **Missing required fields:** Name and email are required

### Performance
- Large imports (3000+ records) may take several minutes
- Imports are processed in batches of 50 for optimal performance
- Monitor the progress output in the console

## Technical Details

### Database Schema
```javascript
User {
  id: INTEGER (auto-increment)
  firstName: STRING (2-50 chars)
  lastName: STRING (2-50 chars)
  email: STRING (unique, valid email)
  password: STRING (bcrypt hashed)
  role: ENUM ('student', 'lecturer', 'admin', 'college_admin')
  status: ENUM ('active', 'inactive', 'suspended')
  studentId: STRING (for students, format: STU0001)
  address: STRING (used for program/degree info)
  collegeId: INTEGER (default: 1)
}
```

### ID Assignment
- Lecturers: IDs start from 1000
- Students: IDs start from 2000 (or 3000 for CSV imports)

## Next Steps

1. **Prepare your complete student list** in CSV or JSON format
2. **Run the import script** using one of the methods above
3. **Verify in admin dashboard** that all users appear correctly
4. **Test login** with a few sample accounts
5. **Send welcome emails** to users with their credentials (if needed)

## Support

For issues or questions:
- Check the error messages in the console output
- Verify your data format matches the templates
- Ensure the database is properly configured and accessible

## Quick Reference

```bash
# Seed all users (lecturers + sample students)
node seeders/seedAllUsers.js

# Import from CSV
node seeders/importFromCSV.js students.csv student

# Check database
# (Use your preferred database client or Sequelize CLI)
```

---

**Important:** Ensure your database is backed up before running large imports!
