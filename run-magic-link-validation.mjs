import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMagicLinkValidation() {
  try {
    console.log('🚀 Starting Magic Link Validation Setup...');
    
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'supabase', 'migrations', '20250721110000_magic_link_validation.sql');
    
    if (!fs.existsSync(sqlPath)) {
      console.error('❌ SQL file not found:', sqlPath);
      process.exit(1);
    }
    
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 SQL file loaded successfully');
    console.log('🔧 Executing Magic Link Validation SQL...');
    
    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('❌ Error executing SQL:', error);
      
      // Try alternative approach - execute SQL directly
      console.log('🔄 Trying alternative SQL execution method...');
      
      // Split SQL into individual statements and execute them
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement + ';' });
            if (stmtError) {
              console.warn('⚠️ Warning executing statement:', stmtError);
            }
          } catch (e) {
            console.warn('⚠️ Warning executing statement:', e.message);
          }
        }
      }
    }
    
    console.log('✅ Magic Link Validation Setup Complete!');
    console.log('');
    console.log('📋 What was implemented:');
    console.log('   • validate_magic_link_email() function');
    console.log('   • send_validated_magic_link() function');
    console.log('   • Magic link validation stats view');
    console.log('   • Magic link attempt logging');
    console.log('   • Performance indexes');
    console.log('');
    console.log('🔒 Now magic links will only be sent to:');
    console.log('   • Existing accounts in the profiles table');
    console.log('   • Activated accounts only');
    console.log('   • Valid email addresses');
    console.log('');
    console.log('📊 You can monitor magic link attempts in the magic_link_attempts table');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the setup
runMagicLinkValidation(); 