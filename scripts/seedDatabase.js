const bcrypt = require('bcryptjs');
const db = require('../src/config/database');

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...\n');

        // 1. Insert Programs
        console.log('📚 Inserting programs...');
        await db.query(`
            INSERT INTO programs (program_code, program_name) VALUES
            ('IT', 'Information Technology'),
            ('CS', 'Computer Science'),
            ('GRAD', 'Graduate Studies')
            ON DUPLICATE KEY UPDATE program_name = VALUES(program_name)
        `);
        console.log('✅ Programs inserted\n');

        // 2. Create Admin Users
        console.log('👤 Creating admin users...');

        // Registrar (access to all programs)
        const registrarPassword = await bcrypt.hash('registrar123', 10);
        await db.query(`
            INSERT INTO users (username, password, role, program_scope) 
            VALUES ('registrar', ?, 'registrar', 'ALL')
            ON DUPLICATE KEY UPDATE password = VALUES(password)
        `, [registrarPassword]);

        // Dean (access to IT and CS)
        const deanPassword = await bcrypt.hash('dean123', 10);
        await db.query(`
            INSERT INTO users (username, password, role, program_scope) 
            VALUES ('dean', ?, 'dean', 'CCIT')
            ON DUPLICATE KEY UPDATE password = VALUES(password)
        `, [deanPassword]);

        // IT Program Chair
        const itChairPassword = await bcrypt.hash('itchair123', 10);
        await db.query(`
            INSERT INTO users (username, password, role, program_scope) 
            VALUES ('it_chair', ?, 'program_chair', 'IT')
            ON DUPLICATE KEY UPDATE password = VALUES(password)
        `, [itChairPassword]);

        // CS Program Chair
        const csChairPassword = await bcrypt.hash('cschair123', 10);
        await db.query(`
            INSERT INTO users (username, password, role, program_scope) 
            VALUES ('cs_chair', ?, 'program_chair', 'CS')
            ON DUPLICATE KEY UPDATE password = VALUES(password)
        `, [csChairPassword]);

        console.log('✅ Admin users created\n');

        // 3. Create Sample Professors
        console.log('👨‍🏫 Creating sample professors...');

        // Get program IDs
        const [programs] = await db.query('SELECT program_id, program_code FROM programs');
        const programMap = {};
        programs.forEach(p => programMap[p.program_code] = p.program_id);

        // Professor 1 - IT
        const prof1Password = await bcrypt.hash('prof123', 10);
        const [prof1User] = await db.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE user_id=LAST_INSERT_ID(user_id)',
            ['200-123', prof1Password, 'professor']
        );
        await db.query(`
            INSERT INTO professors (user_id, employee_id, first_name, last_name, department) 
            VALUES (?, '200-123', 'Juan', 'Dela Cruz', 'Information Technology')
            ON DUPLICATE KEY UPDATE employee_id = VALUES(employee_id)
        `, [prof1User.insertId]);

        // Professor 2 - CS
        const prof2Password = await bcrypt.hash('prof456', 10);
        const [prof2User] = await db.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE user_id=LAST_INSERT_ID(user_id)',
            ['200-124', prof2Password, 'professor']
        );
        await db.query(`
            INSERT INTO professors (user_id, employee_id, first_name, last_name, department) 
            VALUES (?, '200-124', 'Maria', 'Santos', 'Computer Science')
            ON DUPLICATE KEY UPDATE employee_id = VALUES(employee_id)
        `, [prof2User.insertId]);

        console.log('✅ Sample professors created\n');

        // 4. Create Sample Courses
        console.log('📖 Creating sample courses...');

        await db.query(`
            INSERT INTO courses (course_code, course_name, program_id, schedule) VALUES
            ('COM251', 'Object Oriented Programming', ?, 'MWF 10:00-11:30'),
            ('COM252', 'Data Structures and Algorithms', ?, 'TTH 13:00-14:30'),
            ('INF240', 'Database Management Systems', ?, 'MWF 14:00-15:30'),
            ('INF241', 'Web Development', ?, 'TTH 10:00-11:30')
            ON DUPLICATE KEY UPDATE course_name = VALUES(course_name)
        `, [programMap.CS, programMap.CS, programMap.IT, programMap.IT]);

        console.log('✅ Sample courses created\n');

        // 5. Assign Professors to Courses
        console.log('🔗 Assigning professors to courses...');

        const [professors] = await db.query('SELECT professor_id, employee_id FROM professors');
        const [courses] = await db.query('SELECT course_id, course_code FROM courses');

        const prof1 = professors.find(p => p.employee_id === '200-123');
        const prof2 = professors.find(p => p.employee_id === '200-124');

        const com251 = courses.find(c => c.course_code === 'COM251');
        const com252 = courses.find(c => c.course_code === 'COM252');
        const inf240 = courses.find(c => c.course_code === 'INF240');
        const inf241 = courses.find(c => c.course_code === 'INF241');

        if (prof1 && inf240 && inf241) {
            await db.query(`
                INSERT INTO professor_courses (professor_id, course_id, section) VALUES
                (?, ?, 'INF240'),
                (?, ?, 'INF241')
                ON DUPLICATE KEY UPDATE section = VALUES(section)
            `, [prof1.professor_id, inf240.course_id, prof1.professor_id, inf241.course_id]);
        }

        if (prof2 && com251 && com252) {
            await db.query(`
                INSERT INTO professor_courses (professor_id, course_id, section) VALUES
                (?, ?, 'COM251'),
                (?, ?, 'COM252')
                ON DUPLICATE KEY UPDATE section = VALUES(section)
            `, [prof2.professor_id, com251.course_id, prof2.professor_id, com252.course_id]);
        }

        console.log('✅ Professors assigned to courses\n');

        console.log('🎉 Database seeding completed successfully!\n');
        console.log('📋 Admin Credentials:');
        console.log('   Registrar: username=registrar, password=registrar123');
        console.log('   Dean: username=dean, password=dean123');
        console.log('   IT Chair: username=it_chair, password=itchair123');
        console.log('   CS Chair: username=cs_chair, password=cschair123');
        console.log('\n📋 Sample Professor Credentials:');
        console.log('   Professor 1: username=200-123, password=prof123');
        console.log('   Professor 2: username=200-124, password=prof456');
        console.log('\n💡 Next step: Run "npm run import-students" to import student data\n');

        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
}

seedDatabase();
