import { chromium } from 'playwright';
import { config } from 'dotenv';

config({ path: '.env.local' });

const CLOUDFLARE_DASHBOARD = 'https://dash.cloudflare.com';
const SUPABASE_PROJECT_REF = 'utekxrusinibsosthgec';
const B2_BUCKET = 'bhavya-ai-assets';

const SECRETS_TO_ADD = {
  'B2_S3_ENDPOINT': 'https://s3.us-east-005.backblazeb2.com',
  'B2_S3_REGION': 'us-east-005',
  'B2_BUCKET': 'bhavya-ai-assets',
  'B2_PUBLIC_BASE_URL': 'https://f002.backblazeb2.com/file/bhavya-ai-assets'
};

async function waitForElement(page, selector, timeout = 10000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch {
    return false;
  }
}

async function checkElementExists(page, selector) {
  const count = await page.locator(selector).count();
  return count > 0;
}

async function configureCloudflare(page) {
  console.log('🔧 Configuring Cloudflare Workers secrets...');
  
  // Navigate to the worker settings
  await page.goto('https://dash.cloudflare.com/?to=/:account/workers/services/view/bhavya-foundation/settings/variables');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check if we're on the right page
  const hasVariablesSection = await checkElementExists(page, 'text=Variables and Secrets');
  if (!hasVariablesSection) {
    console.log('⚠️  Not on Variables page, trying to navigate...');
    await page.goto('https://dash.cloudflare.com/?to=/:account/workers/services/view/bhavya-foundation/settings/variables');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  }
  
  // Check existing secrets
  const secretsToAdd = {
    'B2_S3_ENDPOINT': 'https://s3.us-east-005.backblazeb2.com',
    'B2_S3_REGION': 'us-east-005',
    'B2_BUCKET': 'bhavya-ai-assets',
    'B2_PUBLIC_BASE_URL': 'https://f002.backblazeb2.com/file/bhavya-ai-assets'
  };
  
  for (const [name, value] of Object.entries(secretsToAdd)) {
    // Check if secret already exists
    const exists = await page.locator(`text=${name}`).count() > 0;
    if (exists) {
      console.log(`✅ ${name} already exists`);
      continue;
    }
    
    console.log(`Adding secret: ${name}`);
    
    // Click Add button
    const addButton = page.locator('button:has-text("Add")').first();
    if (await addButton.count() > 0) {
      await addButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Fill in the form
    await page.waitForSelector('input[name="name"], input[placeholder*="name" i], input[placeholder*="key" i]', { timeout: 5000 });
    await page.fill('input[name="name"], input[placeholder*="name" i], input[placeholder*="key" i]', name);
    await page.fill('input[name="value"], input[placeholder*="value" i], input[placeholder*="secret" i]', process.env[name] || '');
    
    // Save
    const saveButton = page.locator('button:has-text("Save"), button:has-text("Add")').last();
    await saveButton.click();
    await page.waitForTimeout(1500);
    console.log(`✅ Added ${name}`);
  }
}

async function checkSupabaseRLS(page, projectRef) {
  console.log('🔍 Checking Supabase RLS policies...');
  await page.goto(`https://supabase.com/dashboard/project/${projectRef}/editor`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check tables
  const tables = ['profiles', 'users', 'sessions', 'module_progress', 'audit_events'];
  
  for (const table of tables) {
    await page.goto(`https://supabase.com/dashboard/project/utekxrusinibsosthgec/editor/${table}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check RLS status
    const rlsEnabled = await page.locator('text=Row Level Security').count() > 0;
    const rlsStatus = await page.locator('[data-testid="rls-toggle"]').getAttribute('aria-checked') || 'unknown';
    console.log(`Table ${table}: RLS ${rlsStatus}`);
    
    // Check policies
    const policies = await page.locator('text=Policy').count();
    console.log(`  Policies: ${policies}`);
  }
}

async function configureBackblazeCORS(page) {
  console.log('🔧 Configuring Backblaze B2 CORS...');
  await page.goto('https://secure.backblaze.com/buckets');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Find the bucket
  const bucketLink = page.locator('a:has-text("bhavya-ai-assets")');
  if (await bucketLink.count() > 0) {
    await bucketLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Go to CORS settings
    await page.click('a:has-text("CORS Rules")');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check existing rules
    const rules = await page.locator('.cors-rule, .cors-rule-row, tr:has(td)').count();
    console.log(`Existing CORS rules: ${rules}`);
    
    // Add CORS rule if needed
    const hasCorrectRule = await page.locator('text=https://bhavyafoundation.org').count() > 0;
    if (!hasCorrectRule) {
      console.log('Adding CORS rule for bhavyafoundation.org...');
      await page.click('button:has-text("Add CORS Rule"), button:has-text("Add Rule")');
      await page.waitForTimeout(1000);
      
      // Fill CORS rule form
      await page.fill('textarea[name="allowedOrigins"], input[name="allowedOrigins"]', 'https://bhavyafoundation.org\nhttps://*.bhavyafoundation.org\nhttps://*.vercel.app');
      await page.fill('input[name="allowedMethods"], textarea[name="allowedMethods"]', 'GET\nPUT\nPOST\nDELETE\nHEAD');
      await page.fill('input[name="allowedHeaders"], textarea[name="allowedHeaders"]', '*');
      await page.fill('input[name="exposeHeaders"], textarea[name="exposeHeaders"]', 'ETag');
      await page.fill('input[name="maxAgeSeconds"]', '3600');
      
      await page.click('button:has-text("Save"), button:has-text("Add")');
      await page.waitForTimeout(2000);
      console.log('✅ Added CORS rule');
    } else {
      console.log('✅ CORS rule already exists');
    }
  } else {
    console.log('⚠️ Bucket not found');
  }
}

async function main() {
  console.log('🚀 Starting automated configuration...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const context = await chromium.launchPersistentContext('', {
    headless: false,
    slowMo: 500,
    userDataDir: './playwright-user-data'
  });
  
  const page = await context.newPage();
  
  try {
    // Check if already logged into Cloudflare
    await page.goto('https://dash.cloudflare.com');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const isLoggedIn = await page.locator('text=Workers & Pages').count() > 0;
    
    if (!isLoggedIn) {
      console.log('⚠️ Not logged into Cloudflare. Please log in manually in the browser window.');
      console.log('Press Enter after logging in...');
      await new Promise(resolve => process.stdin.once('data', resolve));
    }
    
    // Configure Cloudflare secrets
    await page.goto('https://dash.cloudflare.com/?to=/:account/workers/services/view/bhavya-foundation/settings/variables');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const secrets = {
      'B2_S3_ENDPOINT': 'https://s3.us-east-005.backblazeb2.com',
      'B2_S3_REGION': 'us-east-005',
      'B2_BUCKET': 'bhavya-ai-assets',
      'B2_PUBLIC_BASE_URL': 'https://f002.backblazeb2.com/file/bhavya-ai-assets'
    };
    
for (const [name, value] of Object.entries(secrets)) {
      const exists = await page.locator(`text=${name}`).count() > 0;
      if (exists) {
        console.log(`✅ ${name} already exists`);
        continue;
      }
      
      console.log(`Adding secret: ${name}`);
      await page.click('button:has-text("Add")');
      await page.waitForTimeout(1000);
      
      await page.fill('input[name="name"], input[placeholder*="name" i]', name);
      await page.fill('input[name="value"], input[placeholder*="value" i]', value);
      await page.click('button:has-text("Save")');
      await page.waitForTimeout(1500);
      console.log(`✅ Added ${name}`);
    }
    
    // Check Supabase
    console.log('\n🔍 Checking Supabase RLS...');
    await page.goto('https://supabase.com/dashboard/project/utekxrusinibsosthgec/editor');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check RLS on key tables
    const tables = ['profiles', 'users', 'sessions'];
    for (const table of ['profiles', 'users', 'sessions', 'module_progress', 'audit_events']) {
      await page.goto(`https://supabase.com/dashboard/project/utekxrusinibsosthgec/editor/${table}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const rlsEnabled = await page.locator('text=Row Level Security').count() > 0;
      console.log(`Table ${table}: RLS ${rlsEnabled ? 'enabled' : 'NOT ENABLED'}`);
      
      // Check policies
      const policies = await page.locator('text=Policy').count();
      console.log(`  Policies: ${policies}`);
    }
    
    // Backblaze B2 CORS
    console.log('\n🔧 Configuring Backblaze B2 CORS...');
    await page.goto('https://secure.backblaze.com/buckets');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const bucketLink = page.locator('a:has-text("bhavya-ai-assets")');
    if (await bucketLink.count() > 0) {
      await bucketLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await page.click('a:has-text("CORS Rules")');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const hasRule = await page.locator('text=bhavyafoundation.org').count() > 0;
      if (!hasRule) {
        console.log('Adding CORS rule...');
        await page.click('button:has-text("Add CORS Rule"), button:has-text("Add Rule")');
        await page.waitForTimeout(1000);
        
        await page.fill('textarea[name="allowedOrigins"], input[name="allowedOrigins"]', 'https://bhavyafoundation.org\nhttps://*.bhavyafoundation.org\nhttps://*.vercel.app');
        await page.fill('input[name="allowedMethods"], textarea[name="allowedMethods"]', 'GET\nPUT\nPOST\nDELETE\nHEAD');
        await page.fill('input[name="allowedHeaders"], textarea[name="allowedHeaders"]', '*');
        await page.fill('input[name="exposeHeaders"], textarea[name="exposeHeaders"]', 'ETag');
        await page.fill('input[name="maxAgeSeconds"]', '3600');
        
        await page.click('button:has-text("Save"), button:has-text("Add")');
        await page.waitForTimeout(2000);
        console.log('✅ Added CORS rule');
      } else {
        console.log('✅ CORS rule already exists');
      }
    } else {
      console.log('⚠️ Bucket not found');
    }
    
    console.log('\n✅ All configurations complete!');
    console.log('\n📋 Summary:');
    console.log('1. Cloudflare secrets: Check dashboard for B2_S3_ENDPOINT, B2_S3_REGION, B2_BUCKET, B2_PUBLIC_BASE_URL');
    console.log('2. Supabase RLS: Check tables profiles, users, sessions, module_progress, audit_events');
    console.log('3. B2 CORS: Verify rule for bhavyafoundation.org and vercel.app');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Keep browser open for manual verification
    console.log('\n🔍 Browser will stay open for manual verification. Press Ctrl+C to exit.');
    await new Promise(() => {});
  }
}

main().catch(console.error);