const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcryptjs');
const db = require('../src/config/database');

async function importStudents() {
    try {
        console.log('📥 Starting student import from CSV...\n');

        const csvFilePath = 'info management-sample data - STUDENTS.csv';

        if (!fs.existsSync(csvFilePath)) {
            console.error(`❌ CSV file not found: ${csvFilePath}`);
            console.log('Please make sure the CSV file is in the project root directory.');
            process.exit(1);
        }

        // Get program IDs
        const [programs] = await db.query('SELECT program_id, program_code, program_name FROM programs');
        const programMap = {};
        programs.forEach(p => {
            programMap[p.program_name] = p.program_id;
            programMap[p.program_code] = p.program_id;
        });

        const students = [];
        let rowCount = 0;

        // Read CSV file
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvFilePath)
                .pipe(csv())
                .on('data', (row) => {
                    rowCount++;
                    // CSV columns: ID Number, Password, Last Name, First Name, Middle Name, Program, Block Section
                    const studentData = {
                        student_number: row['ID Number'] || row['id_number'] || Object.values(row)[0],
                        password: row['Password'] || row['password'] || Object.values(row)[1],
                        last_name: row['Last Name'] || row['last_name'] || Object.values(row)[2],
                        first_name: row['First Name'] || row['first_name'] || Object.values(row)[3],
                        middle_name: row['Middle Name'] || row['middle_name'] || Object.values(row)[4],
                        program: row['Program'] || row['program'] || Object.values(row)[5],
                        section: row['Block Section'] || row['section'] || Object.values(row)[6]
                    };
                    students.push(studentData);
                })
                .on('end', resolve)
                .on('error', reject);
        });

        console.log(`📊 Found ${students.length} students in CSV file\n`);

        let imported = 0;
        let skipped = 0;
        let errors = 0;

        // Import students
        for (const student of students) {
            try {
                // Determine program ID
                let programId = null;

                // Try to match program
                if (student.program) {
                    const programName = student.program.trim();
                    if (programName.includes('Information Technology') || programName.includes('IT')) {
                        programId = programMap['IT'];
                    } else if (programName.includes('Computer Science') || programName.includes('CS')) {
                        programId = programMap['CS'];
                    } else {
                        programId = programMap[programName] || programMap['IT']; // Default to IT
                    }
                }

                if (!programId) {
                    console.warn(`⚠️  Skipping ${student.student_number}: Unknown program "${student.program}"`);
                    skipped++;
                    continue;
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(student.password, 10);

                // Create user account
                const [userResult] = await db.query(
                    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                    [student.student_number, hashedPassword, 'student']
                );

                // Create student record
                await db.query(
                    `INSERT INTO students 
                     (user_id, student_number, first_name, last_name, middle_name, program_id, section, status) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
                    [
                        userResult.insertId,
                        student.student_number,
                        student.first_name,
                        student.last_name,
                        student.middle_name,
                        programId,
                        student.section
                    ]
                );

                imported++;
                if (imported % 20 === 0) {
                    console.log(`✅ Imported ${imported} students...`);
                }

            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    console.warn(`⚠️  Skipping ${student.student_number}: Already exists`);
                    skipped++;
                } else {
                    console.error(`❌ Error importing ${student.student_number}:`, error.message);
                    errors++;
                }
            }
        }

        console.log('\n📊 Import Summary:');
        console.log(`   Total rows in CSV: ${students.length}`);
        console.log(`   ✅ Successfully imported: ${imported}`);
        console.log(`   ⚠️  Skipped (duplicates/errors): ${skipped}`);
        console.log(`   ❌ Errors: ${errors}`);
        console.log('\n🎉 Student import completed!\n');

        // Enroll students in sample courses
        console.log('📚 Enrolling students in sample courses...');

        const [courses] = await db.query('SELECT course_id, course_code FROM courses');
        const [allStudents] = await db.query('SELECT student_id, program_id FROM students LIMIT 10');

        for (const student of allStudents) {
            // Enroll in 2-3 random courses from their program
            const programCourses = courses.filter(c =>
                (student.program_id === programMap['IT'] && c.course_code.startsWith('INF')) ||
                (student.program_id === programMap['CS'] && c.course_code.startsWith('COM'))
            );

            for (const course of programCourses.slice(0, 2)) {
                try {
                    await db.query(
                        'INSERT INTO enrollments (student_id, course_id, semester) VALUES (?, ?, ?)',
                        [student.student_id, course.course_id, '2024-2025 1st Semester']
                    );
                } catch (err) {
                    // Ignore duplicate enrollment errors
                }
            }
        }

        console.log('✅ Sample enrollments created\n');
        console.log('🚀 Database is ready! You can now start the server with "npm start"\n');

        process.exit(0);

    } catch (error) {
        console.error('❌ Import error:', error);
        process.exit(1);
    }
}

importStudents();
