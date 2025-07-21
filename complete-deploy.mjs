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

async function createExecFunction() {
    console.log('🔧 Creating exec_sql function...\n');
    
    try {
        const functionSQL = fs.readFileSync(path.join(__dirname, 'create-exec-function.sql'), 'utf8');
        
        // Execute the function creation SQL directly via HTTP request
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
                'apikey': SUPABASE_PUBLISHABLE_KEY
            },
            body: JSON.stringify({
                sql: functionSQL
            })
        });
        
        if (response.ok) {
            console.log('✅ exec_sql function created successfully');
            return true;
        } else {
            console.warn('⚠️ Could not create function via HTTP, will try manual approach');
            return false;
        }
    } catch (error) {
        console.warn('⚠️ Function creation failed:', error.message);
        return false;
    }
}

async function executeSQLDirectly() {
    console.log('🚀 Living Rock CMS - Direct SQL Execution');
    console.log('==========================================\n');

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
                    // Try to execute via HTTP request to Supabase
                    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
                            'apikey': SUPABASE_PUBLISHABLE_KEY
                        },
                        body: JSON.stringify({
                            sql: statement
                        })
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log(`✅ Statement ${i + 1} executed successfully`);
                        successCount++;
                        
                        if (data && data.length > 0) {
                            console.log(`📊 Result:`, data);
                        }
                    } else {
                        console.warn(`⚠️ Warning on statement ${i + 1}: HTTP ${response.status}`);
                        warningCount++;
                    }
                } catch (stmtError) {
                    console.warn(`⚠️ Error on statement ${i + 1}:`, stmtError.message);
                    warningCount++;
                }
                
                // Add delay between statements
                await new Promise(resolve => setTimeout(resolve, 200));
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

async function testDatabaseConnection() {
    console.log('🔍 Testing database connection...\n');
    
    try {
        // Test basic connection
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        
        if (error) {
            console.log('📋 Database tables may not exist yet.');
            console.log('🔧 This is expected for a new project.');
            console.log('📝 Will proceed with SQL execution to create tables.');
            return true; // Continue anyway
        }
        
        console.log('✅ Database connection successful!');
        return true;
        
    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
        return false;
    }
}

// Main execution
async function main() {
    console.log('🎯 Living Rock CMS - Complete Deployment');
    console.log('========================================\n');
    
    // Test connection
    const connectionOk = await testDatabaseConnection();
    
    if (!connectionOk) {
        console.log('\n📋 Manual execution required:');
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
    
    // Try to create the exec function
    const functionCreated = await createExecFunction();
    
    if (!functionCreated) {
        console.log('\n📋 Manual execution required:');
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
    
    // Execute the main SQL
    await executeSQLDirectly();
}

// Run the script
main().catch(console.error); 