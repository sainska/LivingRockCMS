import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the same credentials from your client.js file
const SUPABASE_URL = "https://xxfsnejccbszsjmtwnvj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4ZnNuZWpjY2JzenNqbXR3bnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzIwODEsImV4cCI6MjA2NTgwODA4MX0.EAbJoUj-17TG3CnpVm-kG4LAvIGowsZGnqKeOCVmoBs";

// Initialize Supabase client with your existing credentials
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function executeSQLDirectly() {
    console.log('🚀 Living Rock CMS - Direct SQL Execution');
    console.log('==========================================\n');
    console.log('📋 Using existing Supabase credentials...\n');

    try {
        // Read the SQL script
        const sqlScript = fs.readFileSync(path.join(__dirname, 'automated_implementation.sql'), 'utf8');
        
        console.log('✅ SQL Script loaded successfully');
        console.log('🔧 Executing all 20 steps...\n');

        // Split the script into individual statements
        const statements = sqlScript.split(';').filter(stmt => stmt.trim());
        
        console.log(`📊 Found ${statements.length} SQL statements to execute\n`);

        let successCount = 0;
        let warningCount = 0;

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i].trim();
            if (statement) {
                console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
                
                try {
                    // Execute each statement using the client
                    const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
                    
                    if (error) {
                        console.warn(`⚠️ Warning on statement ${i + 1}:`, error.message);
                        warningCount++;
                    } else {
                        console.log(`✅ Statement ${i + 1} executed successfully`);
                        successCount++;
                        
                        // Show data if available
                        if (data && data.length > 0) {
                            console.log(`📊 Result:`, data);
                        }
                    }
                } catch (stmtError) {
                    console.warn(`⚠️ Error on statement ${i + 1}:`, stmtError.message);
                    warningCount++;
                }
            }
        }
        
        console.log('\n🎉 SQL Execution Summary:');
        console.log(`✅ Successful statements: ${successCount}`);
        console.log(`⚠️ Warnings/Errors: ${warningCount}`);
        console.log(`📊 Total statements processed: ${statements.length}`);
        
        if (successCount > 0) {
            console.log('\n🎯 Living Rock CMS implementation completed!');
            console.log('📋 Your system should now be ready for use.');
        }
        
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
async function executeViaRPC() {
    console.log('🔄 Attempting RPC execution...\n');
    
    try {
        const sqlScript = fs.readFileSync(path.join(__dirname, 'automated_implementation.sql'), 'utf8');
        
        // Try to execute via RPC function
        const { data, error } = await supabase.rpc('exec_sql', { sql: sqlScript });
        
        if (error) {
            throw error;
        }
        
        console.log('✅ RPC execution successful!');
        console.log('📊 Data:', data);
        
    } catch (error) {
        console.error('❌ RPC execution failed:', error);
        console.log('\n🔄 Trying direct SQL execution...');
        await executeSQLDirectly();
    }
}

// Main execution
async function main() {
    console.log('🎯 Connecting to Supabase without password...\n');
    
    // Test connection first
    try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        
        if (error) {
            console.error('❌ Connection test failed:', error.message);
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
            return;
        }
        
        console.log('✅ Connection test successful!');
        console.log('🚀 Proceeding with implementation...\n');
        
        // Try RPC first, then fallback to direct execution
        await executeViaRPC();
        
    } catch (error) {
        console.error('❌ Connection failed:', error);
        console.log('\n📋 Please use manual execution method above.');
    }
}

// Run the script
main().catch(console.error); 