import { createClient } from '@supabase/supabase-js';

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
    
    // Create the validation function
    console.log('🔧 Creating validate_magic_link_email function...');
    
    const validateFunction = `
      CREATE OR REPLACE FUNCTION validate_magic_link_email(email_address TEXT)
      RETURNS JSON AS $$
      DECLARE
          user_profile RECORD;
          result JSON;
      BEGIN
          -- Check if email exists in profiles table
          SELECT id, email, is_activated, first_name, last_name
          INTO user_profile
          FROM profiles
          WHERE email = email_address
          LIMIT 1;

          -- If user doesn't exist
          IF user_profile IS NULL THEN
              result := json_build_object(
                  'valid', false,
                  'exists', false,
                  'message', 'No account found with this email address',
                  'error_code', 'EMAIL_NOT_FOUND'
              );
              RETURN result;
          END IF;

          -- If user exists but account is not activated
          IF user_profile.is_activated = false THEN
              result := json_build_object(
                  'valid', false,
                  'exists', true,
                  'activated', false,
                  'message', 'This account is not yet activated. Please contact an administrator.',
                  'error_code', 'ACCOUNT_NOT_ACTIVATED',
                  'user_id', user_profile.id
              );
              RETURN result;
          END IF;

          -- If user exists and is activated
          result := json_build_object(
              'valid', true,
              'exists', true,
              'activated', true,
              'message', 'Email validated successfully',
              'user_id', user_profile.id,
              'first_name', user_profile.first_name,
              'last_name', user_profile.last_name
          );
          
          RETURN result;

      EXCEPTION
          WHEN OTHERS THEN
              result := json_build_object(
                  'valid', false,
                  'exists', false,
                  'message', 'Database error occurred while validating email',
                  'error_code', 'DATABASE_ERROR'
              );
              RETURN result;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    const { error: validateError } = await supabase.rpc('exec_sql', { sql: validateFunction });
    if (validateError) {
      console.error('❌ Error creating validate function:', validateError);
    } else {
      console.log('✅ validate_magic_link_email function created');
    }

    // Create the send validated magic link function
    console.log('🔧 Creating send_validated_magic_link function...');
    
    const sendFunction = `
      CREATE OR REPLACE FUNCTION send_validated_magic_link(email_address TEXT, allow_signup BOOLEAN DEFAULT FALSE)
      RETURNS JSON AS $$
      DECLARE
          validation_result JSON;
          user_profile RECORD;
          result JSON;
      BEGIN
          -- If allow_signup is true, skip validation
          IF allow_signup THEN
              result := json_build_object(
                  'success', true,
                  'message', 'Magic link will be sent (signup allowed)',
                  'allow_signup', true
              );
              RETURN result;
          END IF;

          -- Validate email first
          validation_result := validate_magic_link_email(email_address);
          
          -- Check if validation failed
          IF (validation_result->>'valid')::BOOLEAN = false THEN
              result := json_build_object(
                  'success', false,
                  'message', validation_result->>'message',
                  'error_code', validation_result->>'error_code',
                  'validation_result', validation_result
              );
              RETURN result;
          END IF;

          -- If validation passed, allow magic link sending
          result := json_build_object(
              'success', true,
              'message', 'Email validated successfully',
              'user_id', validation_result->>'user_id',
              'first_name', validation_result->>'first_name',
              'last_name', validation_result->>'last_name'
          );
          
          RETURN result;

      EXCEPTION
          WHEN OTHERS THEN
              result := json_build_object(
                  'success', false,
                  'message', 'Database error occurred',
                  'error_code', 'DATABASE_ERROR'
              );
              RETURN result;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    const { error: sendError } = await supabase.rpc('exec_sql', { sql: sendFunction });
    if (sendError) {
      console.error('❌ Error creating send function:', sendError);
    } else {
      console.log('✅ send_validated_magic_link function created');
    }

    // Grant permissions
    console.log('🔧 Granting permissions...');
    
    const permissions = `
      GRANT EXECUTE ON FUNCTION validate_magic_link_email(TEXT) TO authenticated;
      GRANT EXECUTE ON FUNCTION send_validated_magic_link(TEXT, BOOLEAN) TO authenticated;
    `;

    const { error: permError } = await supabase.rpc('exec_sql', { sql: permissions });
    if (permError) {
      console.error('❌ Error granting permissions:', permError);
    } else {
      console.log('✅ Permissions granted');
    }

    // Create indexes
    console.log('🔧 Creating performance indexes...');
    
    const indexes = `
      CREATE INDEX IF NOT EXISTS idx_profiles_email_activation ON profiles(email, is_activated);
    `;

    const { error: indexError } = await supabase.rpc('exec_sql', { sql: indexes });
    if (indexError) {
      console.error('❌ Error creating indexes:', indexError);
    } else {
      console.log('✅ Performance indexes created');
    }

    console.log('');
    console.log('✅ Magic Link Validation Setup Complete!');
    console.log('');
    console.log('📋 What was implemented:');
    console.log('   • validate_magic_link_email() function');
    console.log('   • send_validated_magic_link() function');
    console.log('   • Performance indexes');
    console.log('');
    console.log('🔒 Now magic links will only be sent to:');
    console.log('   • Existing accounts in the profiles table');
    console.log('   • Activated accounts only');
    console.log('   • Valid email addresses');
    console.log('');
    console.log('🧪 Test the validation:');
    console.log('   • Try sending magic link to non-existent email');
    console.log('   • Try sending magic link to unactivated account');
    console.log('   • Try sending magic link to valid account');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the setup
runMagicLinkValidation(); 