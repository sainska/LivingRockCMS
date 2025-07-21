import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection configuration
const connectionString = 'postgresql://postgres:n64OxTzutLkZfpjb@db.xxfsnejccbszsjmtwnvj.supabase.co:5432/postgres';

async function runSQL() {
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'supabase', 'member_dashboard_queries.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('Executing SQL file...');
    
    // Split the SQL content by semicolons and execute each statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`Executing statement ${i + 1}/${statements.length}...`);
          await client.query(statement);
          console.log(`Statement ${i + 1} executed successfully`);
        } catch (error) {
          console.error(`Error executing statement ${i + 1}:`, error.message);
        }
      }
    }

    console.log('SQL execution completed!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

runSQL(); 