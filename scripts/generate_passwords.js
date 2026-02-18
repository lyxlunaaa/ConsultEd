// Password Hash Generator for ConsultEd
// Run this script to generate bcrypt hashes for the test data

const bcrypt = require('bcryptjs');

console.log('=== ConsultEd Password Hash Generator ===\n');

// Generate hashes for common test passwords
const passwords = {
    'password': null,
    '2021-00001': null,
    '2021-00002': null,
    '2021-00003': null,
    '2021-00004': null,
    '2021-00005': null,
    'EMP-001': null,
    'EMP-002': null,
    'EMP-003': null,
    'EMP-004': null,
    'registrar': null,
    'dean': null,
    'it_chair': null,
    'cs_chair': null
};

// Generate hashes
for (const password in passwords) {
    passwords[password] = bcrypt.hashSync(password, 10);
}

console.log('Generated Password Hashes:\n');
console.log('-- Common password "password":');
console.log(`'${passwords['password']}'`);
console.log('\n-- Student passwords (student_number):');
console.log(`2021-00001: '${passwords['2021-00001']}'`);
console.log(`2021-00002: '${passwords['2021-00002']}'`);
console.log(`2021-00003: '${passwords['2021-00003']}'`);
console.log(`2021-00004: '${passwords['2021-00004']}'`);
console.log(`2021-00005: '${passwords['2021-00005']}'`);
console.log('\n-- Professor passwords (employee_id):');
console.log(`EMP-001: '${passwords['EMP-001']}'`);
console.log(`EMP-002: '${passwords['EMP-002']}'`);
console.log(`EMP-003: '${passwords['EMP-003']}'`);
console.log(`EMP-004: '${passwords['EMP-004']}'`);
console.log('\n-- Admin passwords (username):');
console.log(`registrar: '${passwords['registrar']}'`);
console.log(`dean: '${passwords['dean']}'`);
console.log(`it_chair: '${passwords['it_chair']}'`);
console.log(`cs_chair: '${passwords['cs_chair']}'`);

console.log('\n\n=== SQL UPDATE STATEMENTS ===\n');
console.log('-- Copy these into your SQL file or run directly:\n');

console.log('-- Update admin users');
console.log(`UPDATE users SET password = '${passwords['registrar']}' WHERE username = 'registrar';`);
console.log(`UPDATE users SET password = '${passwords['dean']}' WHERE username = 'dean';`);
console.log(`UPDATE users SET password = '${passwords['it_chair']}' WHERE username = 'it_chair';`);
console.log(`UPDATE users SET password = '${passwords['cs_chair']}' WHERE username = 'cs_chair';`);

console.log('\n-- Update professor users');
console.log(`UPDATE users SET password = '${passwords['EMP-001']}' WHERE username = 'EMP-001';`);
console.log(`UPDATE users SET password = '${passwords['EMP-002']}' WHERE username = 'EMP-002';`);
console.log(`UPDATE users SET password = '${passwords['EMP-003']}' WHERE username = 'EMP-003';`);
console.log(`UPDATE users SET password = '${passwords['EMP-004']}' WHERE username = 'EMP-004';`);

console.log('\n-- Update student users (first 5)');
console.log(`UPDATE users SET password = '${passwords['2021-00001']}' WHERE username = '2021-00001';`);
console.log(`UPDATE users SET password = '${passwords['2021-00002']}' WHERE username = '2021-00002';`);
console.log(`UPDATE users SET password = '${passwords['2021-00003']}' WHERE username = '2021-00003';`);
console.log(`UPDATE users SET password = '${passwords['2021-00004']}' WHERE username = '2021-00004';`);
console.log(`UPDATE users SET password = '${passwords['2021-00005']}' WHERE username = '2021-00005';`);

console.log('\n-- For remaining students (2021-00006 to 2021-00015), use same pattern');
console.log('-- Or set all to "password":');
console.log(`UPDATE users SET password = '${passwords['password']}' WHERE role = 'student';`);

console.log('\n\n✅ Done! Copy the UPDATE statements above and run them in MySQL.');
