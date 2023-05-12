import mysql from "serverless-mysql";

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
});

async function query({ query, values, force = false, singleResult = false }) {
  try {
    if (force) {
      await db.query("SET FOREIGN_KEY_CHECKS=0");
    }
    const results = await db.query(query, values);
    if (force) {
      await db.query("SET FOREIGN_KEY_CHECKS=1");
    }

    if (singleResult) {
      return results[0];
    }
    await db.end();
    return results;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default query;
