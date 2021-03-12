const { promisify } = require('util');

const mysql = require('mysql');
const { keys } = require('./keys');     //Solo tomo una parte de ese objeto

const pool = mysql.createPool(keys);


pool.getConnection((err, connection) =>{
    if(err){
        if(err.code == 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if(err.code == 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTION');
        }
        if(err.code == 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }
    if(connection){ connection.release(); }
    console.log('DB is connected');
    return;
})

//Promisify pool query
pool.query = promisify(pool.query);

module.exports = pool;