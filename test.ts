import pg from 'pg'
const { Client } = pg

const main = async () => {
const client = new Client({
  connectionString: 'postgresql://postgres:pass@localhost:5432/ztm-nextjs?schema=public',
})
await client.connect()
 
const res = await client.query('SELECT * from newtable', ['Hello world!'])
console.log(res.rows[0].message) // Hello world!
await client.end()
}
void main();