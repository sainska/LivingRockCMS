import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = 'https://xxfsnejccbszsjmtwnvj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4ZnNuZWpjY2JzenN6bXR3bnZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDU5NzQ5NywiZXhwIjoyMDUwMTczNDk3fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'; // Replace with your service role key

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function executeAutomatedImplementation() {
    console.log('🚀 Starting Living Rock CMS Automated Implementation...\n');

    try {
        // Read the SQL script
        const sqlScript = fs.readFileSync(path.join(__dirname, 'automated_implementation.sql'), 'utf8');
        
        console.log('📋 SQL Script loaded successfully');
        console.log('🔧 Executing 20-step implementation...\n');

        // Split the script into individual statements
        const statements = sqlScript.split(';').filter(stmt => stmt.trim());
        
        console.log(`📊 Found ${statements.length} SQL statements to execute\n`);

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i].trim();
            if (statement) {
                console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
                
                try {
                    // Execute each statement individually
                    const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
                    
                    if (error) {
                        console.warn(`⚠️ Warning on statement ${i + 1}:`, error.message);
                    } else {
                        console.log(`✅ Statement ${i + 1} executed successfully`);
                    }
                } catch (stmtError) {
                    console.warn(`⚠️ Error on statement ${i + 1}:`, stmtError.message);
                }
            }
        }
        
        console.log('\n✅ Direct SQL execution completed!');
        
    } catch (error) {
        console.error('❌ Error during implementation:', error);
        console.log('\n📝 Manual execution required:');
        console.log('1. Go to Supabase Dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Copy and paste the content of automated_implementation.sql');
        console.log('4. Execute the script');
    }
}

// Alternative method using direct SQL execution
async function executeViaDirectSQL() {
    console.log('🔄 Attempting direct SQL execution...\n');
    
    try {
        const sqlScript = fs.readFileSync(path.join(__dirname, 'automated_implementation.sql'), 'utf8');
        
        // Execute the entire script as one query
        const { data, error } = await supabase.rpc('exec_sql', { sql: sqlScript });
        
        if (error) {
            throw error;
        }
        
        console.log('✅ Direct SQL execution successful!');
        console.log('📊 Data:', data);
        
    } catch (error) {
        console.error('❌ Direct SQL execution failed:', error);
        console.log('\n📋 Manual execution instructions:');
        console.log('=====================================');
        console.log('1. Open your browser and go to:');
        console.log('   https://supabase.com/dashboard/project/xxfsnejccbszsjmtwnvj');
        console.log('');
        console.log('2. Click on "SQL Editor" in the left sidebar');
        console.log('');
        console.log('3. Copy the entire content of automated_implementation.sql');
        console.log('');
        console.log('4. Paste it into the SQL Editor');
        console.log('');
        console.log('5. Click "Run" to execute all 20 steps automatically');
        console.log('');
        console.log('6. Wait for completion and verify results');
        console.log('=====================================');
    }
}

// Main execution
async function main() {
    console.log('🎯 Living Rock CMS - Automated Implementation');
    console.log('=============================================\n');
    
    // Try the direct SQL method first
    await executeViaDirectSQL();
    
    // If that fails, try the statement-by-statement method
    if (process.argv.includes('--fallback')) {
        await executeAutomatedImplementation();
    }
    
    console.log('\n🎉 Implementation process completed!');
    console.log('📋 Check the results above for any errors or warnings.');
    console.log('🚀 Your Living Rock CMS should now be ready for use.');
}

// Run the script
main().catch(console.error); 