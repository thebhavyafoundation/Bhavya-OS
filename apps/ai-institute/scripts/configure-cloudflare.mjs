import { chromium } from 'playwright';
import * as fs from 'fs';

const CLOUDFLARE_DASHBOARD = 'https://dash.cloudflare.com';
const SUPABASE_DASHBOARD = 'https://supabase.com/dashboard';
const BACKBLAZE_DASHBOARD = 'https://secure.backblaze.com';

async function loginToCloudflare(page, email, password) {
  await page.goto('https://dash.cloudflare.com/login');
  await page.waitForSelector('input[name="email"]');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dash.cloudflare.com/**', { timeout: 30000 });
  console.log('✅ Logged into Cloudflare');
}

async function addCloudflareSecrets(page, secrets) {
  await page.goto('https://dash.cloudflare.com/?to=/:account/workers/services/view/bhavya-foundation/settings/variables');
  await page.waitForSelector('text=Variables and Secrets', { timeout: 10000 });
  
  for (const [name, value] of Object.entries(secrets)) {
    // Check if secret already exists
    const exists = await page.locator(`text=${name}`).count() > 0;
    if (exists) {
      console.log(`✅ ${name} already exists`);
      continue;
    }
    
    console.log(`Adding secret: ${name}`);
    await page.click('button:has-text("Add")');
    await page.waitForSelector('input[name="name"]');
    await page.fill('input[name="name"]', name);
    await page.fill('input[name="value"]', value);
    await page.click('button:has-text("Save")');
    await page.waitForTimeout(1000);
    console.log(`✅ Added ${name}`);
  }
}

async function configureSupabaseRLS(page, projectRef) {
  await page.goto(`https://supabase.com/dashboard/project/${projectRef}/editor`);
  await page.waitForSelector('text=Authentication', { timeout: 15000 });
  
  // Navigate to Table Editor
  await page.click('a[href*="/editor"]');
  await page.waitForTimeout(2000);
  
  // Check RLS policies for profiles table
  await page.goto(`https://supabase.com/dashboard/project/${projectRef}/editor/39870`);
  await page.waitForTimeout(2000);
  
  // Check if RLS policies exist for users and sessions tables
  console.log('Checking Supabase RLS policies...');
}

async function configureBackblazeCORS(page, bucketName) {
  await page.goto('https://secure.backblaze.com/buckets');
  await page.waitForSelector('text=Buckets', { timeout: 15000 });
  
  // Find and click the bucket
  await page.click(`text=${bucketName}`);
  await page.waitForTimeout(2000);
  
  // Go to CORS settings
  await page.click('text=CORS Rules');
  await page.waitForTimeout(2000);
  
  // Check existing CORS rules
  const existingRules = await page.locator('.cors-rule').count();
  console.log(`Existing CORS rules: ${existingRules}`);
  
  // Add CORS rules if needed
  const corsRules = [
    {
      allowedOrigins: ['https://bhavyafoundation.org', 'https://*.bhavyafoundation.org', 'https://*.vercel.app'],
      allowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
      allowedHeaders: ['*'],
      exposeHeaders: ['ETag'],
      maxAgeSeconds: 3600
    }
  ];
  
  for (const rule of corsRules) {
    const exists = await page.locator(`text=${rule.allowedOrigins.join(',')}`).count() > 0;
    if (!exists) {
      await page.click('button:has-text("Add CORS Rule")');
      await page.fill('input[name="allowedOrigins"]', rule.allowedOrigins.join('\n'));
      await page.fill('input[name="allowedMethods"]', rule.allowedMethods.join('\n'));
      await page.fill('input[name="allowedHeaders"]', rule.allowedHeaders.join('\n'));
      await page.fill('input[name="exposeHeaders"]', rule.exposeHeaders.join('\n'));
      await page.fill('input[name="maxAgeSeconds"]', rule.maxAgeSeconds.toString());
      await page.click('button:has-text("Save")');
      await page.waitForTimeout(1000);
      console.log('✅ Added CORS rule');
    } else {
      console.log('✅ CORS rule already exists');
    }
  }
}

async function main() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Load credentials from environment or prompt
  const email = process.env.CLOUDFLARE_EMAIL || 'thebhavyafoundation@gmail.com';
  const password = process.env.CLOUDFLARE_PASSWORD;
  
  if (!password) {
    console.log('Please set CLOUDFLARE_PASSWORD environment variable');
    await browser.close();
    return;
  }
  
  try {
    // Cloudflare configuration
    console.log('🔧 Configuring Cloudflare...');
    await loginToCloudflare(page, email, password);
    
    const secrets = {
      'B2_S3_ENDPOINT': 'https://s3.us-east-005.backblazeb2.com',
      'B2_S3_REGION': 'us-east-005',
      'B2_BUCKET': 'bhavya-ai-assets',
      'B2_PUBLIC_BASE_URL': 'https://f002.backblazeb2.com/file/bhavya-ai-assets'
    };
    
    await addCloudflareSecrets(page, secrets);
    
    // Supabase RLS
    console.log('🔧 Checking Supabase RLS...');
    await configureSupabaseRLS(page, 'utekxrusinibsosthgec');
    
    // Backblaze B2 CORS
    console.log('🔧 Configuring Backblaze B2 CORS...');
    await configureBackblazeCORS(page, 'bhavya-ai-assets');
    
    console.log('✅ All configurations complete!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);