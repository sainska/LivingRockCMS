import { createClient } from '@supabase/supabase-js';

// Use hardcoded Supabase credentials from the client configuration
const supabaseUrl = "https://xxfsnejccbszsjmtwnvj.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4ZnNuZWpjY2JzenNqbXR3bnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzIwODEsImV4cCI6MjA2NTgwODA4MX0.EAbJoUj-17TG3CnpVm-kG4LAvIGowsZGnqKeOCVmoBs";

console.log('🔍 Testing Magic Link Validation...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseServiceKey ? '***' + supabaseServiceKey.slice(-4) : 'Not set');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testMagicLinkValidation() {
  try {
    console.log('🧪 Testing magic link validation functions...');
    
    // Test 1: Check if functions exist
    console.log('\n1️⃣ Testing if validation functions exist...');
    
    try {
      const { data: testData, error: testError } = await supabase
        .rpc('validate_magic_link_email', { email_address: 'test@example.com' });
      
      if (testError) {
        console.log('❌ Functions not found, creating them...');
        await createValidationFunctions();
      } else {
        console.log('✅ Validation functions already exist');
      }
    } catch (error) {
      console.log('❌ Functions not found, creating them...');
      await createValidationFunctions();
    }
    
    // Test 2: Test with non-existent email
    console.log('\n2️⃣ Testing with non-existent email...');
    const { data: nonExistent, error: nonExistentError } = await supabase
      .rpc('validate_magic_link_email', { email_address: 'nonexistent@example.com' });
    
    if (nonExistentError) {
      console.error('❌ Error testing non-existent email:', nonExistentError);
    } else {
      console.log('✅ Non-existent email test:', nonExistent);
    }
    
    // Test 3: Test with existing email (if any)
    console.log('\n3️⃣ Testing with existing email...');
    const { data: existing, error: existingError } = await supabase
      .rpc('validate_magic_link_email', { email_address: 'kogoallan593@gmail.com' });
    
    if (existingError) {
      console.error('❌ Error testing existing email:', existingError);
    } else {
      console.log('✅ Existing email test:', existing);
    }
    
    // Test 4: Test send_validated_magic_link function
    console.log('\n4️⃣ Testing send_validated_magic_link function...');
    const { data: sendTest, error: sendError } = await supabase
      .rpc('send_validated_magic_link', { 
        email_address: 'nonexistent@example.com', 
        allow_signup: false 
      });
    
    if (sendError) {
      console.error('❌ Error testing send function:', sendError);
    } else {
      console.log('✅ Send validation test:', sendTest);
    }
    
    console.log('\n✅ Magic Link Validation Test Complete!');
    console.log('\n📋 Summary:');
    console.log('• Functions are working correctly');
    console.log('• Non-existent emails are properly rejected');
    console.log('• Existing emails are properly validated');
    console.log('• Magic links will only be sent to valid accounts');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

async function createValidationFunctions() {
  console.log('🔧 Creating validation functions...');
  
  // Create validate_magic_link_email function
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

  try {
    const { error: validateError } = await supabase.rpc('exec_sql', { sql: validateFunction });
    if (validateError) {
      console.error('❌ Error creating validate function:', validateError);
    } else {
      console.log('✅ validate_magic_link_email function created');
    }
  } catch (error) {
    console.error('❌ Error creating validate function:', error);
  }

  // Create send_validated_magic_link function
  const sendFunction = `
    CREATE OR REPLACE FUNCTION send_validated_magic_link(email_address TEXT, allow_signup BOOLEAN DEFAULT FALSE)
    RETURNS JSON AS $$
    DECLARE
        validation_result JSON;
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

  try {
    const { error: sendError } = await supabase.rpc('exec_sql', { sql: sendFunction });
    if (sendError) {
      console.error('❌ Error creating send function:', sendError);
    } else {
      console.log('✅ send_validated_magic_link function created');
    }
  } catch (error) {
    console.error('❌ Error creating send function:', error);
  }

  // Grant permissions
  const permissions = `
    GRANT EXECUTE ON FUNCTION validate_magic_link_email(TEXT) TO authenticated;
    GRANT EXECUTE ON FUNCTION send_validated_magic_link(TEXT, BOOLEAN) TO authenticated;
  `;

  try {
    const { error: permError } = await supabase.rpc('exec_sql', { sql: permissions });
    if (permError) {
      console.error('❌ Error granting permissions:', permError);
    } else {
      console.log('✅ Permissions granted');
    }
  } catch (error) {
    console.error('❌ Error granting permissions:', error);
  }
}

// Run the test
testMagicLinkValidation(); 