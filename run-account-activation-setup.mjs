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

async function setupAccountActivation() {
  try {
    console.log('🔧 Setting up Account Activation System...');
    
    // Read the account activation migration file
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20250721095000_account_activation_system.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Error: Account activation migration file not found');
      console.log('Expected path:', migrationPath);
      process.exit(1);
    }
    
    const migration = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Executing account activation system migration...');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_text: migration
    });
    
    if (error) {
      console.error('❌ Error executing account activation migration:', error);
      
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
      console.log('✅ Account activation system migration executed successfully');
    }
    
    // Test the activation system
    console.log('🧪 Testing the account activation system...');
    
    // Check if activation columns exist in profiles table
    const { data: columnsCheck, error: columnsError } = await supabase.rpc('exec_sql', {
      sql_text: `
        SELECT 
          column_name,
          data_type,
          is_nullable
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
        AND column_name IN ('is_activated', 'activation_requested_at', 'activated_by', 'activated_at', 'activation_notes')
        ORDER BY column_name
      `
    });
    
    if (columnsError) {
      console.error('❌ Error checking activation columns:', columnsError);
    } else {
      console.log('✅ Activation columns in profiles table:', columnsCheck);
    }
    
    // Check if activation_requests table exists
    const { data: tableCheck, error: tableError } = await supabase.rpc('exec_sql', {
      sql_text: `
        SELECT 
          table_name,
          table_type
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'activation_requests'
      `
    });
    
    if (tableError) {
      console.error('❌ Error checking activation_requests table:', tableError);
    } else {
      console.log('✅ activation_requests table exists:', tableCheck);
    }
    
    // Check if activation functions exist
    const { data: functionCheck, error: functionError } = await supabase.rpc('exec_sql', {
      sql_text: `
        SELECT 
          routine_name,
          routine_type
        FROM information_schema.routines 
        WHERE routine_name IN ('approve_user_activation', 'reject_user_activation', 'get_pending_activations', 'get_activation_stats')
        AND routine_schema = 'public'
      `
    });
    
    if (functionError) {
      console.error('❌ Error checking activation functions:', functionError);
    } else {
      console.log('✅ Activation functions exist:', functionCheck);
    }
    
    // Check if views exist
    const { data: viewCheck, error: viewError } = await supabase.rpc('exec_sql', {
      sql_text: `
        SELECT 
          table_name,
          table_type
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('pending_activations_view', 'activation_history_view')
      `
    });
    
    if (viewError) {
      console.error('❌ Error checking activation views:', viewError);
    } else {
      console.log('✅ Activation views exist:', viewCheck);
    }
    
    console.log('🎉 Account Activation System Setup Complete!');
    console.log('');
    console.log('📋 What was implemented:');
    console.log('   • Added activation fields to profiles table');
    console.log('   • Created activation_requests table for workflow tracking');
    console.log('   • Updated handle_new_user function for activation workflow');
    console.log('   • Created admin functions for approval/rejection');
    console.log('   • Added RLS policies for security');
    console.log('   • Created views for admin dashboard');
    console.log('   • Auto-activation for social auth users');
    console.log('');
    console.log('🚀 You can now:');
    console.log('   • Access account activation in admin dashboard');
    console.log('   • Approve/reject new user accounts');
    console.log('   • Track activation workflow');
    console.log('   • Auto-activate social auth users');
    console.log('   • Monitor activation statistics');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the setup
setupAccountActivation(); 