const pg = require('pg')

pool = new pg.Pool({
    user: process.env.VITE_POSTGRESS_USER,
    host: process.env.VITE_POSTGRESS_HOST,
    database: process.env.VITE_POSTGRESS_DATABASE,
    password: process.env.VITE_POSTGRESS_PASSWORD,
    port: process.env.VITE_POSTGRESS_PORT,
})

pool.connect((error) => {
    if (error) {
        console.log("DB Not Connect !")
    }
    else {
        console.log("DB Connected Successsfully !")
    }
})

module.exports = pool;