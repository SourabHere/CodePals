import mysql from 'mysql2'
import dotenv from 'dotenv';


dotenv.config();


const dbConnection = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: 3306
    }
)


dbConnection.connect((err) => {
    if(err) {
        console.log(`Error connecting to DB: ${err.message}`);
        return;
    }
    else{
        console.log('Connected to DB');
    }
})

export default dbConnection;