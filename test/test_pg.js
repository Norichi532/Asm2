const { Pool, Client } = require('pg')
 
const pool = new Pool({
  user: 'postgres',
  password: '123qwe',
  host: '127.0.0.1',
  port: 5432,
  database: 'postgres',
})
async function view_table() {
    // result = await pool.query(`SELECT * FROM users WHERE uname='minh' AND pword='123456'`);
    let username = 'postgres';
    let password = 'poldn0906';
    const query_string = {
      text: 'SELECT * FROM users WHERE uname = $1 AND pword = $2',
      values: [username, password],
    }
    result = await pool.query(query_string)
    console.log(result);
}
view_table();