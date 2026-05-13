/**
 * Refresh the Instagram long-lived token before its 60-day expiry.
 * Runs monthly via GitHub Actions and updates the META_LONG_LIVED_TOKEN secret.
 *
 * Required env vars:
 *   META_LONG_LIVED_TOKEN  — current token to refresh
 *   GH_TOKEN               — GitHub PAT with repo secrets write access
 *   GH_REPO                — owner/repo  e.g. "NoahtheBoah32/mycelium"
 */

import https from 'https';
import crypto from 'crypto';

function apiFetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(`Non-JSON: ${data.slice(0, 200)}`)); }
      });
    }).on('error', reject);
  });
}

function apiPost(hostname, path, body, headers) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const req = https.request({ hostname, path, method: 'PUT', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyStr), ...headers } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function getPublicKey(repo, ghToken) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.github.com',
      path: `/repos/${repo}/actions/secrets/public-key`,
      headers: { Authorization: `token ${ghToken}`, 'User-Agent': 'mycelium-refresh-token' },
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.end();
  });
}

async function updateSecret(repo, ghToken, secretName, secretValue) {
  const { key_id, key } = await getPublicKey(repo, ghToken);

  // Encrypt with libsodium (sodium-native not available — use Node crypto workaround via raw ECDH isn't viable; we use the GitHub API's simple base64 approach with tweetnacl if available, else warn)
  // Fallback: use the GitHub CLI approach — just PUT the base64 value. GitHub requires libsodium sealed-box encryption.
  // We dynamically import tweetnacl-sealedbox if available, otherwise error with instructions.
  let encryptedValue;
  try {
    const { box } = await import('tweetnacl');
    const { encode: encodeUTF8, encode: encodeBase64 } = await import('tweetnacl-util');
    // Use sodium sealed box: nacl.box.keyPair + seal
    // Since tweetnacl doesn't have sealed box natively, we shell out to gh CLI instead
    throw new Error('use-gh-cli');
  } catch {
    // Use gh CLI to update the secret — simpler, no native deps needed
    const { execSync } = await import('child_process');
    execSync(`gh secret set ${secretName} --body "${secretValue}" --repo ${repo}`, { stdio: 'inherit' });
    console.log(`✓ Secret ${secretName} updated via gh CLI`);
    return;
  }
}

async function main() {
  const token = process.env.META_LONG_LIVED_TOKEN;
  const ghToken = process.env.GH_TOKEN;
  const repo = process.env.GH_REPO;
  if (!token) throw new Error('META_LONG_LIVED_TOKEN not set');

  console.log('Refreshing Instagram long-lived token...');
  const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`;
  const data = await apiFetch(url);

  if (data.error) throw new Error(`Token refresh failed: ${data.error.message}`);

  const newToken = data.access_token;
  const expiresIn = data.expires_in;
  console.log(`✓ New token received. Expires in ${Math.round(expiresIn / 86400)} days.`);

  if (ghToken && repo) {
    console.log(`Updating GitHub secret META_LONG_LIVED_TOKEN in ${repo}...`);
    await updateSecret(repo, ghToken, 'META_LONG_LIVED_TOKEN', newToken);
  } else {
    console.log('GH_TOKEN or GH_REPO not set — printing token for manual update:');
    console.log(newToken);
  }
}

main().catch(err => { console.error(err.message); process.exit(1); });
