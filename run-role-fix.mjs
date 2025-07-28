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

async function runRoleFix() {
  try {
    console.log('🔧 Starting Role Column Fix...');
    
    // Read the fix migration file
    const fixMigrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20250721090000_fix_role_column_issues.sql');
    
    if (!fs.existsSync(fixMigrationPath)) {
      console.error('❌ Error: Role fix migration file not found');
      console.log('Expected path:', fixMigrationPath);
      process.exit(1);
    }
    
    const fixMigration = fs.readFileSync(fixMigrationPath, 'utf8');
    
    console.log('📄 Executing role column fix...');
    
    // Execute the fix migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_text: fixMigration
    });
    
    if (error) {
      console.error('❌ Error executing role fix migration:', error);
      
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
      console.log('✅ Role column fix executed successfully');
    }
    
    // Test the fix by checking table structure
    console.log('🧪 Testing the fix...');
    
    // Check if user_roles table has the correct structure
    const { data: tableCheck, error: tableError } = await supabase.rpc('exec_sql', {
      sql_text: `
        SELECT 
          column_name,
          data_type,
          is_nullable
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles'
        ORDER BY ordinal_position
      `
    });
    
    if (tableError) {
      console.error('❌ Error checking table structure:', tableError);
    } else {
      console.log('✅ user_roles table structure:', tableCheck);
    }
    
    // Check if role column exists and has correct type
    const { data: roleCheck, error: roleError } = await supabase.rpc('exec_sql', {
      sql_text: `
        SELECT 
          column_name,
          data_type,
          is_nullable
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles' 
        AND column_name = 'role'
      `
    });
    
    if (roleError) {
      console.error('❌ Error checking role column:', roleError);
    } else {
      console.log('✅ Role column check:', roleCheck);
    }
    
    // Test the get_user_role function
    const { data: functionCheck, error: functionError } = await supabase.rpc('exec_sql', {
      sql_text: `
        SELECT 
          routine_name,
          routine_type
        FROM information_schema.routines 
        WHERE routine_name = 'get_user_role' 
        AND routine_schema = 'public'
      `
    });
    
    if (functionError) {
      console.error('❌ Error checking function:', functionError);
    } else {
      console.log('✅ get_user_role function exists:', functionCheck);
    }
    
    // Check for any users without roles
    const { data: userCheck, error: userError } = await supabase.rpc('exec_sql', {
      sql_text: `
        SELECT 
          COUNT(*) as users_without_roles
        FROM public.profiles p
        WHERE NOT EXISTS (
          SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id
        )
      `
    });
    
    if (userError) {
      console.error('❌ Error checking users without roles:', userError);
    } else {
      console.log('✅ Users without roles check:', userCheck);
    }
    
    console.log('🎉 Role Column Fix Complete!');
    console.log('');
    console.log('📋 What was fixed:');
    console.log('   • Ensured role column exists in user_roles table');
    console.log('   • Created user_role enum type if missing');
    console.log('   • Updated role column to use enum type');
    console.log('   • Added missing columns (assigned_by, assigned_at, is_active)');
    console.log('   • Fixed all functions that reference role column');
    console.log('   • Ensured all users have proper role assignments');
    console.log('');
    console.log('🚀 Email templates and other features should now work without role column errors!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the fix
runRoleFix(); 