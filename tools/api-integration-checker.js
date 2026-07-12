#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, '..');
const checks = [];

function exists(relPath) {
  return fs.existsSync(path.join(root, relPath));
}

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function addCheck(name, ok, detail) {
  checks.push({ name, ok, detail });
}

// Frontend setup checks
addCheck('axios client exists', exists('src/lib/api/axios.ts'), 'Shared Axios instance should live here.');
if (exists('src/lib/api/axios.ts')) {
  const content = read('src/lib/api/axios.ts');
  addCheck('axios baseURL uses env', /baseURL/.test(content) && /VITE_API_URL/.test(content), 'Axios client should read API base URL from env.');
  addCheck('tenant header interceptor exists', /X-Tenant-Slug/.test(content), 'Tenant header should be set centrally in interceptor.');
}

addCheck('services layer exists', exists('src/services/api.ts'), 'A service wrapper is useful for reusable API calls.');
if (exists('src/services/api.ts')) {
  const content = read('src/services/api.ts');
  addCheck('auth token interceptor exists', /Authorization/.test(content), 'Auth token should be attached centrally.');
  addCheck('401 handling exists', /401/.test(content), 'Unauthorized responses should be handled centrally.');
}

addCheck('auth slice exists', exists('src/features/auth/authSlice.ts'), 'Auth state should be managed in one feature slice.');
if (exists('src/features/auth/authSlice.ts')) {
  const content = read('src/features/auth/authSlice.ts');
  addCheck('auth thunk exists', /createAsyncThunk/.test(content), 'Login flow should use async thunk or equivalent.');
}

addCheck('package has axios', exists('package.json') && /"axios"/.test(read('package.json')), 'Axios should be available in dependencies.');
addCheck('env file exists', exists('.env') || exists('.env.local') || exists('.env.development') || exists('.env.production'), 'API base URL should be configurable via env.');

// Backend reference checks
addCheck('backend auth controller exists', exists('../Backend/PathoCareBackend/src/modules/auth/auth.controller.ts'), 'Backend auth endpoints should be referenced for frontend contract.');
if (exists('../Backend/PathoCareBackend/src/modules/auth/auth.controller.ts')) {
  const content = read('../Backend/PathoCareBackend/src/modules/auth/auth.controller.ts');
  addCheck('backend login endpoint exists', /@Post\('login'\)/.test(content), 'Frontend should target the login endpoint.');
  addCheck('backend me endpoint exists', /@Get\('me'\)/.test(content), 'Profile fetch should target the me endpoint.');
}

let passCount = 0;
console.log('=== API integration direction check ===');
for (const check of checks) {
  const label = check.ok ? 'PASS' : 'WARN';
  console.log(`${label} - ${check.name}`);
  if (check.detail) console.log(`       ${check.detail}`);
  if (check.ok) passCount += 1;
}

console.log(`\nSummary: ${passCount}/${checks.length} checks passed.`);
console.log('\nRecommended direction:');
console.log('- Use one shared Axios instance');
console.log('- Keep auth token and tenant header in interceptors');
console.log('- Put auth calls behind a feature service layer');
console.log('- Start with login + me/profile flow first');
