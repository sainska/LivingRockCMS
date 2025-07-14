// Debug script to test authentication and user roles
// Run this with: node debug_auth.js

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://xxfsnejccbszsjmtwnvj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4ZnNuZWpjY2JzenNqbXR3bnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzIwODEsImV4cCI6MjA2NTgwODA4MX0.EAbJoUj-17TG3CnpVm-kG4LAvIGowsZGnqKeOCVmoBs";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function debugAuth() {
  console.log('🔍 Starting authentication debug...\n');

  try {
    // 1. Test basic connection
    console.log('1. Testing database connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('user_roles')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.log('❌ Connection failed:', connectionError.message);
    } else {
      console.log('✅ Database connection successful');
    }

    // 2. Check if tables exist
    console.log('\n2. Checking table structure...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['profiles', 'user_roles']);

    if (tablesError) {
      console.log('❌ Could not check tables:', tablesError.message);
    } else {
      console.log('✅ Tables found:', tables.map(t => t.table_name));
    }

    // 3. Check user_roles table structure
    console.log('\n3. Checking user_roles table...');
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .limit(5);

    if (rolesError) {
      console.log('❌ Could not query user_roles:', rolesError.message);
    } else {
      console.log('✅ user_roles table accessible');
      console.log('📊 Sample roles:', roles);
    }

    // 4. Check profiles table structure
    console.log('\n4. Checking profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);

    if (profilesError) {
      console.log('❌ Could not query profiles:', profilesError.message);
    } else {
      console.log('✅ profiles table accessible');
      console.log('📊 Sample profiles:', profiles);
    }

    // 5. Test authentication (if you have test credentials)
    console.log('\n5. Testing authentication...');
    console.log('⚠️  Add test credentials to test login');
    
    // Uncomment and add test credentials:
    /*
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'your-test-email@example.com',
      password: 'your-test-password'
    });

    if (authError) {
      console.log('❌ Authentication failed:', authError.message);
    } else {
      console.log('✅ Authentication successful');
      console.log('👤 User:', authData.user.email);
      
      // Test role fetching
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id)
        .eq('is_active', true)
        .single();

      if (roleError) {
        console.log('❌ Role fetch failed:', roleError.message);
      } else {
        console.log('✅ User role:', userRole.role);
      }
    }
    */

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }

  console.log('\n🔍 Debug complete!');
}

debugAuth(); 