// Database Setup Script
// Run this to set up the complete database schema

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = "https://xxfsnejccbszsjmtwnvj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4ZnNuZWpjY2JzenNqbXR3bnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzIwODEsImV4cCI6MjA2NTgwODA4MX0.EAbJoUj-17TG3CnpVm-kG4LAvIGowsZGnqKeOCVmoBs";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function setupDatabase() {
  console.log('🔧 Setting up Living Rock CMS Database...\n');

  try {
    // 1. Read the schema file
    const schemaPath = path.join(__dirname, 'supabase', 'dashboard_schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📖 Schema file loaded successfully');
    console.log('⚠️  Please run the following SQL in your Supabase SQL Editor:\n');
    console.log('='.repeat(80));
    console.log(schemaSQL);
    console.log('='.repeat(80));
    console.log('\n📋 Instructions:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the above SQL');
    console.log('4. Click "Run" to execute the schema');
    console.log('5. Wait for all tables to be created');
    console.log('\n✅ After running the SQL, all dashboard modules will use real data!');

    // 2. Test basic connection
    console.log('\n🔍 Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('user_roles')
      .select('count')
      .limit(1);

    if (testError) {
      console.log('❌ Connection test failed:', testError.message);
      console.log('💡 Make sure your Supabase project is active and accessible');
    } else {
      console.log('✅ Database connection successful');
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

async function testDataFetching() {
  console.log('\n🧪 Testing data fetching...\n');

  try {
    // Test system stats
    console.log('1. Testing system stats...');
    const { data: stats, error: statsError } = await supabase
      .from('system_stats')
      .select('*')
      .limit(5);

    if (statsError) {
      console.log('❌ System stats error:', statsError.message);
    } else {
      console.log('✅ System stats:', stats.length, 'records found');
    }

    // Test church info
    console.log('\n2. Testing church info...');
    const { data: churchInfo, error: churchError } = await supabase
      .from('church_info')
      .select('*')
      .single();

    if (churchError) {
      console.log('❌ Church info error:', churchError.message);
    } else {
      console.log('✅ Church info found:', churchInfo.church_name);
    }

    // Test ministry groups
    console.log('\n3. Testing ministry groups...');
    const { data: groups, error: groupsError } = await supabase
      .from('ministry_groups')
      .select('*')
      .limit(5);

    if (groupsError) {
      console.log('❌ Ministry groups error:', groupsError.message);
    } else {
      console.log('✅ Ministry groups:', groups.length, 'records found');
    }

    // Test financial accounts
    console.log('\n4. Testing financial accounts...');
    const { data: accounts, error: accountsError } = await supabase
      .from('financial_accounts')
      .select('*')
      .limit(5);

    if (accountsError) {
      console.log('❌ Financial accounts error:', accountsError.message);
    } else {
      console.log('✅ Financial accounts:', accounts.length, 'records found');
    }

  } catch (error) {
    console.error('❌ Testing failed:', error.message);
  }
}

// Run the setup
setupDatabase().then(() => {
  console.log('\n⏳ Waiting 3 seconds before testing data fetching...');
  setTimeout(testDataFetching, 3000);
}); 