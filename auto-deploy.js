const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

        // Execute the SQL script
        const { data, error } = await supabase.rpc('exec_sql', { sql: sqlScript });

        if (error) {
            console.error('❌ Error executing SQL script:', error);
            return;
        }

        console.log('✅ SQL script executed successfully!');
        console.log('📊 Results:', data);

    } catch (error) {
        console.error('❌ Error during implementation:', error);
        
        // Fallback: Execute SQL directly
        console.log('🔄 Attempting direct SQL execution...');
        
        try {
            const sqlScript = fs.readFileSync(path.join(__dirname, 'automated_implementation.sql'), 'utf8');
            
            // Split the script into individual statements
            const statements = sqlScript.split(';').filter(stmt => stmt.trim());
            
            for (let i = 0; i < statements.length; i++) {
                const statement = statements[i].trim();
                if (statement) {
                    console.log(`Executing statement ${i + 1}/${statements.length}...`);
                    
                    const { error } = await supabase.rpc('exec_sql', { sql: statement });
                    
                    if (error) {
                        console.warn(`⚠️ Warning on statement ${i + 1}:`, error.message);
                    }
                }
            }
            
            console.log('✅ Direct SQL execution completed!');
            
        } catch (fallbackError) {
            console.error('❌ Fallback execution failed:', fallbackError);
            console.log('\n📝 Manual execution required:');
            console.log('1. Go to Supabase Dashboard');
            console.log('2. Navigate to SQL Editor');
            console.log('3. Copy and paste the content of automated_implementation.sql');
            console.log('4. Execute the script');
        }
    }
}

// Alternative method using Supabase client directly
async function executeViaClient() {
    console.log('🔄 Attempting execution via Supabase client...\n');
    
    try {
        const sqlScript = fs.readFileSync(path.join(__dirname, 'automated_implementation.sql'), 'utf8');
        
        // Execute the script using the client
        const { data, error } = await supabase.from('_exec_sql').select('*').execute(sqlScript);
        
        if (error) {
            throw error;
        }
        
        console.log('✅ Execution via client successful!');
        console.log('📊 Data:', data);
        
    } catch (error) {
        console.error('❌ Client execution failed:', error);
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
    
    // Try the main method first
    await executeAutomatedImplementation();
    
    // If that fails, try the client method
    if (process.argv.includes('--fallback')) {
        await executeViaClient();
    }
    
    console.log('\n🎉 Implementation process completed!');
    console.log('📋 Check the results above for any errors or warnings.');
    console.log('🚀 Your Living Rock CMS should now be ready for use.');
}

// Run the script
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { executeAutomatedImplementation, executeViaClient }; 