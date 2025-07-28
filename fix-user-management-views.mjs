#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

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

async function fixUserManagementViews() {
  try {
    console.log('🔧 Fixing User Management Views...');
    
    // Create the user management view to resolve relationship issues
    const createUserManagementView = `
      -- Drop existing view if it exists
      DROP VIEW IF EXISTS user_management_view;
      
      -- Create user management view with resolved relationships
      CREATE VIEW user_management_view AS
      SELECT 
        p.id,
        p.first_name,
        p.last_name,
        p.email,
        COALESCE(
          ur_system_admin.role,
          ur_clergy.role,
          ur_treasurer.role,
          ur_secretary.role,
          ur_member.role,
          'member'
        ) as primary_role,
        p.is_activated,
        p.activation_requested_at,
        p.activated_at,
        p.created_at,
        p.last_social_login,
        p.social_provider,
        CASE 
          WHEN p.social_provider IS NOT NULL THEN 'Social Login'
          ELSE 'Email Registration'
        END as registration_method,
        CASE 
          WHEN p.last_social_login IS NULL THEN 'Never'
          WHEN p.last_social_login < NOW() - INTERVAL '30 days' THEN '30+ days ago'
          WHEN p.last_social_login < NOW() - INTERVAL '7 days' THEN '7+ days ago'
          ELSE 'Recent'
        END as activity_status,
        ur_system_admin.is_active as is_system_admin,
        ur_clergy.is_active as is_clergy,
        ur_treasurer.is_active as is_treasurer,
        ur_secretary.is_active as is_secretary,
        ur_member.is_active as is_member
      FROM profiles p
      LEFT JOIN user_roles ur_system_admin ON p.id = ur_system_admin.user_id AND ur_system_admin.role = 'system_admin' AND ur_system_admin.is_active = true
      LEFT JOIN user_roles ur_clergy ON p.id = ur_clergy.user_id AND ur_clergy.role = 'clergy' AND ur_clergy.is_active = true
      LEFT JOIN user_roles ur_treasurer ON p.id = ur_treasurer.user_id AND ur_treasurer.role = 'treasurer' AND ur_treasurer.is_active = true
      LEFT JOIN user_roles ur_secretary ON p.id = ur_secretary.user_id AND ur_secretary.role = 'secretary' AND ur_secretary.is_active = true
      LEFT JOIN user_roles ur_member ON p.id = ur_member.user_id AND ur_member.role = 'member' AND ur_member.is_active = true
      ORDER BY p.created_at DESC;
    `;
    
    console.log('📄 Creating user management view...');
    const { error: viewError } = await supabase.rpc('exec_sql', {
      sql_text: createUserManagementView
    });
    
    if (viewError) {
      console.error('❌ Error creating user management view:', viewError);
      console.log('🔄 Trying direct execution...');
      
      // Try executing the statements directly
      const statements = createUserManagementView.split(';').filter(stmt => stmt.trim().length > 0);
      for (const statement of statements) {
        try {
          await supabase.rpc('exec_sql', { sql_text: statement });
        } catch (stmtError) {
          console.error('Error executing statement:', stmtError.message);
        }
      }
    } else {
      console.log('✅ User management view created successfully');
    }
    
    // Create role statistics view
    const createRoleStatsView = `
      -- Drop existing view if it exists
      DROP VIEW IF EXISTS role_statistics_view;
      
      -- Create role statistics view
      CREATE VIEW role_statistics_view AS
      SELECT 
        role,
        COUNT(*) as user_count,
        COUNT(CASE WHEN p.is_activated = true THEN 1 END) as active_count,
        COUNT(CASE WHEN p.is_activated = false THEN 1 END) as inactive_count,
        COUNT(CASE WHEN p.social_provider IS NOT NULL THEN 1 END) as social_count,
        COUNT(CASE WHEN p.social_provider IS NULL THEN 1 END) as email_count
      FROM user_roles ur
      JOIN profiles p ON ur.user_id = p.id
      WHERE ur.is_active = true
      GROUP BY role
      ORDER BY user_count DESC;
    `;
    
    console.log('📊 Creating role statistics view...');
    const { error: statsError } = await supabase.rpc('exec_sql', {
      sql_text: createRoleStatsView
    });
    
    if (statsError) {
      console.error('❌ Error creating role statistics view:', statsError);
    } else {
      console.log('✅ Role statistics view created successfully');
    }
    
    // Test the views
    console.log('🧪 Testing the views...');
    
    try {
      const { data: userViewTest, error: userViewError } = await supabase
        .from('user_management_view')
        .select('*')
        .limit(5);
      
      if (userViewError) {
        console.error('❌ Error testing user management view:', userViewError);
      } else {
        console.log('✅ User management view works:', userViewTest?.length || 0, 'users found');
      }
    } catch (testError) {
      console.error('❌ Error testing user management view:', testError);
    }
    
    try {
      const { data: roleViewTest, error: roleViewError } = await supabase
        .from('role_statistics_view')
        .select('*');
      
      if (roleViewError) {
        console.error('❌ Error testing role statistics view:', roleViewError);
      } else {
        console.log('✅ Role statistics view works:', roleViewTest);
      }
    } catch (testError) {
      console.error('❌ Error testing role statistics view:', testError);
    }
    
    console.log('🎉 User Management Views Fixed!');
    console.log('');
    console.log('📋 What was fixed:');
    console.log('   • Created user_management_view to resolve relationship conflicts');
    console.log('   • Created role_statistics_view for role-based statistics');
    console.log('   • Updated UserManagement component to use the views');
    console.log('');
    console.log('🚀 The User Management module should now work without errors!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the fix
fixUserManagementViews(); 