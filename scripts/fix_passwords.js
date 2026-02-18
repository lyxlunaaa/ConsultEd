const mysql = require('mysql2/promise');
require('dotenv').config();

const VALID_HASH = '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci'; // hash for 'password'

async function fixPasswords() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });

        console.log('Updating all user passwords to match the valid "password" hash...');
        const [result] = await connection.execute(
            'UPDATE users SET password = ?',
            [VALID_HASH]
        );

        console.log(`Successfully updated ${result.affectedRows} users.`);
        console.log('You can now login with "password" for any testing account.');

    } catch (error) {
        console.error('Error fixing passwords:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

fixPasswords();
