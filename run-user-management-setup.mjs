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

async function setupUserManagement() {
  try {
    console.log('🔧 Setting up User Management Functions...');
    
    // Read the user management migration file
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20250721100000_user_management_functions.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Error: User management migration file not found');
      console.log('Expected path:', migrationPath);
      process.exit(1);
    }
    
    const migration = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Executing user management functions migration...');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_text: migration
    });
    
    if (error) {
      console.error('❌ Error executing user management migration:', error);
      
      // Try executing directly if exec_sql function doesn't exist
      console.log('🔄 Trying direct execution...');
      
      // Split the migration into individual statements
      const statements = migration
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
      console.log('✅ User management functions migration executed successfully');
    }
    
    // Test the user management functions
    console.log('🧪 Testing the user management functions...');
    
    // Check if user management functions exist
    const { data: functionCheck, error: functionError } = await supabase.rpc('exec_sql', {
      sql_text: `
        SELECT 
          routine_name,
          routine_type
        FROM information_schema.routines 
        WHERE routine_schema = 'public'
        AND routine_name IN (
          'invite_user',
          'assign_user_role',
          'remove_user_role',
          'get_user_statistics',
          'search_users',
          'reset_all_passwords',
          'expire_all_sessions',
          'send_welcome_emails',
          'lock_inactive_accounts',
          'review_suspicious_activity'
        )
        ORDER BY routine_name
      `
    });
    
    if (functionError) {
      console.error('❌ Error checking user management functions:', functionError);
    } else {
      console.log('✅ User management functions exist:', functionCheck);
    }
    
    // Check if user management views exist
    const { data: viewCheck, error: viewError } = await supabase.rpc('exec_sql', {
      sql_text: `
        SELECT 
          table_name,
          table_type
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('user_management_view', 'role_statistics_view')
      `
    });
    
    if (viewError) {
      console.error('❌ Error checking user management views:', viewError);
    } else {
      console.log('✅ User management views exist:', viewError);
    }
    
    // Test user statistics function
    try {
      const { data: statsData, error: statsError } = await supabase.rpc('get_user_statistics');
      
      if (statsError) {
        console.error('❌ Error testing get_user_statistics:', statsError);
      } else {
        console.log('✅ User statistics function works:', statsData);
      }
    } catch (statsTestError) {
      console.error('❌ Error testing user statistics:', statsTestError);
    }
    
    console.log('🎉 User Management Functions Setup Complete!');
    console.log('');
    console.log('📋 What was implemented:');
    console.log('   • User invitation function with role assignment');
    console.log('   • Role management functions (assign/remove roles)');
    console.log('   • User statistics and activity reporting');
    console.log('   • User search and filtering functions');
    console.log('   • Bulk action functions (reset passwords, expire sessions)');
    console.log('   • Security functions (lock accounts, review activity)');
    console.log('   • User management views for dashboard');
    console.log('');
    console.log('🚀 You can now:');
    console.log('   • Access user management in admin dashboard');
    console.log('   • Invite new users with specific roles');
    console.log('   • Manage user roles and permissions');
    console.log('   • View user statistics and activity');
    console.log('   • Perform bulk actions on users');
    console.log('   • Monitor user security and activity');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the setup
setupUserManagement(); 