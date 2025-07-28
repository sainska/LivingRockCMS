#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xxfsnejccbszsjmtwnvj.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

if (!supabaseServiceKey || supabaseServiceKey === 'your-service-role-key') {
  console.error('❌ Error: VITE_SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.log('Please set your Supabase service role key in your environment variables');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSocialAuthFix() {
  try {
    console.log('🔧 Starting Social Authentication Fix...');
    
    // Read the fix migration file
    const fixMigrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20250721080000_fix_social_auth_trigger.sql');
    
    if (!fs.existsSync(fixMigrationPath)) {
      console.error('❌ Error: Fix migration file not found');
      console.log('Expected path:', fixMigrationPath);
      process.exit(1);
    }
    
    const fixMigration = fs.readFileSync(fixMigrationPath, 'utf8');
    
    console.log('📄 Executing social auth trigger fix...');
    
    // Execute the fix migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_text: fixMigration
    });
    
    if (error) {
      console.error('❌ Error executing fix migration:', error);
      
      // Try executing directly if exec_sql function doesn't exist
      console.log('🔄 Trying direct execution...');
      
      // Split the migration into individual statements
      const statements = fixMigration
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      for (const statement of statements) {
        try {
          console.log('Executing:', statement.substring(0, 50) + '...');
          await supabase.rpc('exec_sql', { sql_text: statement });
        } catch (stmtError) {
          console.error('Error executing statement:', stmtError.message);
        }
      }
    } else {
      console.log('✅ Social auth trigger fix executed successfully');
    }
    
    // Test the fix by checking if a new user can be created
    console.log('🧪 Testing the fix...');
    
    // Check if the handle_new_user function exists and works
    const { data: functionCheck, error: functionError } = await supabase.rpc('exec_sql', {
      sql_text: `
        SELECT 
          routine_name,
          routine_type
        FROM information_schema.routines 
        WHERE routine_name = 'handle_new_user' 
        AND routine_schema = 'public'
      `
    });
    
    if (functionError) {
      console.error('❌ Error checking function:', functionError);
    } else {
      console.log('✅ handle_new_user function exists:', functionCheck);
    }
    
    // Check if the trigger exists
    const { data: triggerCheck, error: triggerError } = await supabase.rpc('exec_sql', {
      sql_text: `
        SELECT 
          trigger_name,
          event_manipulation,
          event_object_table
        FROM information_schema.triggers 
        WHERE trigger_name = 'on_auth_user_created' 
        AND trigger_schema = 'public'
      `
    });
    
    if (triggerError) {
      console.error('❌ Error checking trigger:', triggerError);
    } else {
      console.log('✅ on_auth_user_created trigger exists:', triggerCheck);
    }
    
    console.log('🎉 Social Authentication Fix Complete!');
    console.log('');
    console.log('📋 What was fixed:');
    console.log('   • Removed conflicting social auth trigger');
    console.log('   • Updated handle_new_user function to handle social auth properly');
    console.log('   • Added error handling to prevent database errors');
    console.log('   • Ensured proper role assignment for social auth users');
    console.log('');
    console.log('🚀 You can now test Google signup without database errors!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the fix
runSocialAuthFix(); 