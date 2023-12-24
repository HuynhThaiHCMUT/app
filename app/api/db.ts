import sql from 'mysql2/promise'

if (process.env.DB_USER == undefined || process.env.DB_PWD == undefined || process.env.DB_NAME == undefined) {
  throw new Error("SQL local environment not configured");
}

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  connectionLimit: 3
}

let clientPromise = sql.createConnection(config);

export {clientPromise, sql};