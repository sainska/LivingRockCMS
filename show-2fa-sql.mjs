#!/usr/bin/env node

/**
 * Show 2FA SQL Script
 * This script displays the SQL that needs to be executed in Supabase dashboard
 */

import fs from 'fs';
import path from 'path';

async function show2FASQL() {
  console.log('🔧 2FA Database Fix Instructions\n');

  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20250721130000_two_factor_auth_complete.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath);
      process.exit(1);
    }

    const sqlContent = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📋 To fix the 2FA database error, please follow these steps:\n');
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor (in the left sidebar)');
    console.log('4. Copy and paste the following SQL code:');
    console.log('5. Click "Run" to execute the SQL\n');
    
    console.log('='.repeat(80));
    console.log('SQL CODE TO EXECUTE:');
    console.log('='.repeat(80));
    console.log(sqlContent);
    console.log('='.repeat(80));
    
    console.log('\n🎯 After running this SQL:');
    console.log('   ✅ 2FA database functions will be created');
    console.log('   ✅ Required tables will be set up');
    console.log('   ✅ Permissions will be granted');
    console.log('   ✅ The "Send Code to Email" button should work');
    
    console.log('\n🔧 Then test the 2FA functionality in your app!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
show2FASQL(); 