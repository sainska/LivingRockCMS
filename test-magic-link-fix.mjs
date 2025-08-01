import { createClient } from '@supabase/supabase-js';

// Use hardcoded Supabase credentials
const supabaseUrl = "https://xxfsnejccbszsjmtwnvj.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4ZnNuZWpjY2JzenNqbXR3bnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzIwODEsImV4cCI6MjA2NTgwODA4MX0.EAbJoUj-17TG3CnpVm-kG4LAvIGowsZGnqKeOCVmoBs";

console.log('🧪 Testing Magic Link Validation Fix...');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testMagicLinkValidation() {
  try {
    console.log('\n1️⃣ Testing with non-existent email (should fail)...');
    
    const { data: nonExistentResult, error: nonExistentError } = await supabase
      .rpc('send_validated_magic_link', {
        email_address: 'nonexistent@example.com',
        allow_signup: false
      });
    
    if (nonExistentError) {
      console.error('❌ Error testing non-existent email:', nonExistentError);
    } else {
      console.log('✅ Non-existent email result:', nonExistentResult);
      if (!nonExistentResult.success) {
        console.log('✅ CORRECT: Email validation failed for non-existent email');
      } else {
        console.log('❌ INCORRECT: Email validation passed for non-existent email');
      }
    }
    
    console.log('\n2️⃣ Testing with existing but unactivated email (should fail)...');
    
    const { data: unactivatedResult, error: unactivatedError } = await supabase
      .rpc('send_validated_magic_link', {
        email_address: 'kogoallan593@gmail.com',
        allow_signup: false
      });
    
    if (unactivatedError) {
      console.error('❌ Error testing unactivated email:', unactivatedError);
    } else {
      console.log('✅ Unactivated email result:', unactivatedResult);
      if (!unactivatedResult.success) {
        console.log('✅ CORRECT: Email validation failed for unactivated account');
      } else {
        console.log('❌ INCORRECT: Email validation passed for unactivated account');
      }
    }
    
    console.log('\n3️⃣ Testing with allow_signup=true (should pass)...');
    
    const { data: signupResult, error: signupError } = await supabase
      .rpc('send_validated_magic_link', {
        email_address: 'nonexistent@example.com',
        allow_signup: true
      });
    
    if (signupError) {
      console.error('❌ Error testing signup mode:', signupError);
    } else {
      console.log('✅ Signup mode result:', signupResult);
      if (signupResult.success) {
        console.log('✅ CORRECT: Signup mode allows magic link sending');
      } else {
        console.log('❌ INCORRECT: Signup mode blocked magic link sending');
      }
    }
    
    console.log('\n📋 Summary:');
    console.log('• Non-existent emails should be rejected when allow_signup=false');
    console.log('• Unactivated accounts should be rejected when allow_signup=false');
    console.log('• Any email should be allowed when allow_signup=true');
    console.log('• The AuthContext should respect these validation results');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testMagicLinkValidation(); 