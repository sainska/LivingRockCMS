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

async function executeSQLInChunks() {
    console.log('🚀 Living Rock CMS - SQL Deployment');
    console.log('====================================\n');

    try {
        // Read the SQL script
        const sqlScript = fs.readFileSync(path.join(__dirname, 'automated_implementation.sql'), 'utf8');
        
        console.log('✅ SQL Script loaded successfully');
        console.log('🔧 Preparing to execute all 20 steps...\n');

        // Split into logical chunks (by steps)
        const chunks = splitSQLIntoChunks(sqlScript);
        
        console.log(`📊 Found ${chunks.length} logical chunks to execute\n`);

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            console.log(`⏳ Executing chunk ${i + 1}/${chunks.length}...`);
            console.log(`📝 Step: ${chunk.title}`);
            
            try {
                // Execute each chunk using the client's direct SQL method
                const { data, error } = await supabase.rpc('exec_sql', { sql: chunk.sql });
                
                if (error) {
                    console.warn(`⚠️ Warning on chunk ${i + 1}:`, error.message);
                    errorCount++;
                } else {
                    console.log(`✅ Chunk ${i + 1} executed successfully`);
                    successCount++;
                    
                    // Show data if available
                    if (data && data.length > 0) {
                        console.log(`📊 Result:`, data);
                    }
                }
            } catch (chunkError) {
                console.warn(`⚠️ Error on chunk ${i + 1}:`, chunkError.message);
                errorCount++;
            }
            
            // Add a small delay between chunks
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log('\n🎉 SQL Execution Summary:');
        console.log(`✅ Successful chunks: ${successCount}`);
        console.log(`⚠️ Errors/Warnings: ${errorCount}`);
        console.log(`📊 Total chunks processed: ${chunks.length}`);
        
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

function splitSQLIntoChunks(sqlScript) {
    const chunks = [];
    const lines = sqlScript.split('\n');
    let currentChunk = { title: 'Initial Setup', sql: '' };
    
    for (const line of lines) {
        // Check for step headers
        if (line.includes('-- STEP') || line.includes('-- =====================================================')) {
            if (currentChunk.sql.trim()) {
                chunks.push(currentChunk);
            }
            
            // Extract step title
            const stepMatch = line.match(/-- STEP \d+: (.+)/);
            const title = stepMatch ? stepMatch[1] : 'Database Operation';
            currentChunk = { title, sql: '' };
        } else {
            currentChunk.sql += line + '\n';
        }
    }
    
    // Add the last chunk
    if (currentChunk.sql.trim()) {
        chunks.push(currentChunk);
    }
    
    return chunks;
}

// Alternative method using direct table operations
async function executeViaTableOperations() {
    console.log('🔄 Attempting table-based operations...\n');
    
    try {
        // Test basic operations
        console.log('📊 Testing basic database operations...');
        
        // Test profiles table
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('count')
            .limit(1);
            
        if (profilesError) {
            console.warn('⚠️ Profiles table test failed:', profilesError.message);
        } else {
            console.log('✅ Profiles table accessible');
        }
        
        // Test user_roles table
        const { data: roles, error: rolesError } = await supabase
            .from('user_roles')
            .select('count')
            .limit(1);
            
        if (rolesError) {
            console.warn('⚠️ User roles table test failed:', rolesError.message);
        } else {
            console.log('✅ User roles table accessible');
        }
        
        console.log('\n📋 Manual SQL execution required:');
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
        
    } catch (error) {
        console.error('❌ Table operations failed:', error);
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
            console.log('\n📋 Database tables may not exist yet.');
            console.log('🔧 This is expected for a new project.');
            console.log('📝 Please execute the SQL manually in Supabase Dashboard.');
            return;
        }
        
        console.log('✅ Connection test successful!');
        console.log('🚀 Proceeding with implementation...\n');
        
        // Try SQL execution first, then fallback to table operations
        await executeSQLInChunks();
        
    } catch (error) {
        console.error('❌ Connection failed:', error);
        console.log('\n🔄 Trying alternative approach...');
        await executeViaTableOperations();
    }
}

// Run the script
main().catch(console.error); 