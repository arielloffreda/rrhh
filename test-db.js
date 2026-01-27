const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '192.168.8.248',
    user: 'rrhh_app',
    password: 'Passwordremoto',
    database: 'rrhh',
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.log('FULL ERROR:', JSON.stringify(err, null, 2));
        console.error('MESSAGE:', err.message);
        return;
    }
    console.log('Connected as id ' + connection.threadId);
    connection.end();
});
