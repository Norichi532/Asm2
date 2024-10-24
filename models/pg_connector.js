const { Pool, Client } = require('pg')

// Define the DB connection 
const pool = new Pool({
    user: 'asm_atn_db_al6l_user',
    password: 'dsMLNcwo0cMykXWlq8fjS48BYsEAsNjo',
    host: 'dpg-cscse7bv2p9s73fmvscg-a.oregon-postgres.render.com',
    port: 5432,
    database: 'asm_atn_db_al6l',
})
module.exports = pool;