import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the same credentials from your client.js file
const SUPABASE_URL = "https://xxfsnejccbszsjmtwnvj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4ZnNuZWpjY2JzenNqbXR3bnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzIwODEsImV4cCI6MjA2NTgwODA4MX0.EAbJoUj-17TG3CnpVm-kG4LAvIGowsZGnqKeOCVmoBs";

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function executeFixedSQL() {
    console.log('🚀 Living Rock CMS - Fixed SQL Deployment');
    console.log('==========================================\n');

    try {
        // Read the fixed SQL script
        const sqlScript = fs.readFileSync(path.join(__dirname, 'fixed_implementation.sql'), 'utf8');
        
        console.log('✅ Fixed SQL Script loaded successfully');
        console.log('📊 Script size:', (sqlScript.length / 1024).toFixed(2), 'KB');
        console.log('🔧 This script will create all tables, functions, and sample data\n');

        // Test connection first
        console.log('🔍 Testing database connection...');
        const { data: testData, error: testError } = await supabase
            .from('profiles')
            .select('count')
            .limit(1);
        
        if (testError && testError.code === 'PGRST116') {
            console.log('📋 Tables do not exist yet - this is expected for a new project');
            console.log('🔧 Proceeding with table creation...\n');
        } else if (testError) {
            console.error('❌ Connection test failed:', testError.message);
            return;
        } else {
            console.log('✅ Connection test successful - some tables may already exist\n');
        }

        // Split the script into individual statements
        const statements = sqlScript
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt && !stmt.startsWith('--'));

        console.log(`📊 Found ${statements.length} SQL statements to execute\n`);

        let successCount = 0;
        let warningCount = 0;
        let errorCount = 0;

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement) {
                console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
                
                try {
                    // Execute via Supabase client using raw SQL
                    const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
                    
                    if (error) {
                        if (error.message.includes('function public.exec_sql')) {
                            console.log('📋 exec_sql function not available - manual execution required');
                            console.log('🔧 This is expected for new projects');
                            break;
                        } else {
                            console.warn(`⚠️ Warning on statement ${i + 1}:`, error.message);
                            warningCount++;
                        }
                    } else {
                        console.log(`✅ Statement ${i + 1} executed successfully`);
                        successCount++;
                        
                        if (data && data.length > 0) {
                            console.log(`📊 Result:`, data);
                        }
                    }
                } catch (stmtError) {
                    console.warn(`⚠️ Error on statement ${i + 1}:`, stmtError.message);
                    errorCount++;
                }
                
                // Add delay between statements
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        console.log('\n🎉 SQL Execution Summary:');
        console.log(`✅ Successful statements: ${successCount}`);
        console.log(`⚠️ Warnings: ${warningCount}`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log(`📊 Total statements processed: ${statements.length}`);
        
        if (successCount === 0 && errorCount > 0) {
            console.log('\n📋 Manual execution required:');
            console.log('=====================================');
            console.log('1. Open your browser and go to:');
            console.log('   https://supabase.com/dashboard/project/xxfsnejccbszsjmtwnvj');
            console.log('');
            console.log('2. Click on "SQL Editor" in the left sidebar');
            console.log('');
            console.log('3. Copy the entire content of fixed_implementation.sql');
            console.log('');
            console.log('4. Paste it into the SQL Editor');
            console.log('');
            console.log('5. Click "Run" to execute all steps automatically');
            console.log('');
            console.log('6. Wait for completion and verify results');
            console.log('=====================================');
        } else if (successCount > 0) {
            console.log('\n🎯 Living Rock CMS implementation completed!');
            console.log('📋 Your system should now be ready for use.');
        }
        
    } catch (error) {
        console.error('❌ Error during implementation:', error);
        console.log('\n📋 Manual execution required:');
        console.log('=====================================');
        console.log('1. Open your browser and go to:');
        console.log('   https://supabase.com/dashboard/project/xxfsnejccbszsjmtwnvj');
        console.log('');
        console.log('2. Click on "SQL Editor" in the left sidebar');
        console.log('');
        console.log('3. Copy the entire content of fixed_implementation.sql');
        console.log('');
        console.log('4. Paste it into the SQL Editor');
        console.log('');
        console.log('5. Click "Run" to execute all steps automatically');
        console.log('');
        console.log('6. Wait for completion and verify results');
        console.log('=====================================');
    }
}

// Run the script
executeFixedSQL().catch(console.error); 