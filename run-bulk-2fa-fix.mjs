import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('   VITE_SUPABASE_ANON_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  console.error('\nPlease set these environment variables and try again.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runBulk2FASetup() {
  try {
    console.log('🚀 Starting Bulk 2FA System Setup...');
    
    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), 'bulk-2fa-system.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('📄 SQL file loaded successfully');
    console.log('🔧 Executing SQL...');
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('❌ Error executing SQL:', error);
      console.log('\n📋 Manual Execution Required:');
      console.log('1. Go to your Supabase Dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the contents of bulk-2fa-system.sql');
      console.log('4. Click "Run" to execute');
      return;
    }
    
    console.log('✅ SQL executed successfully!');
    console.log('📊 Results:', data);
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n📋 Manual Execution Required:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of bulk-2fa-system.sql');
    console.log('4. Click "Run" to execute');
  }
}

// Run the setup
runBulk2FASetup(); 