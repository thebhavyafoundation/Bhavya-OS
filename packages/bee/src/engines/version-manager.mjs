import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const VERSIONS_DIR = join(process.cwd(), '..', '..', 'bhavya-ai-lab', 'versions');

function ensureDir(dir) { if (!existsSync(dir)) mkdirSync(dir, { recursive: true }); }

/**
 * Version Manager — immutable releases, reproducible from provenance.
 */
export class VersionManager {
  constructor() {
    ensureDir(VERSIONS_DIR);
  }

  /** Create a new immutable version of a package */
  createVersion(pkg, message = '') {
    if (pkg.status !== 'published') {
      return { success: false, error: 'Only published packages can be versioned' };
    }

    const version = this.#incrementVersion(pkg.version, 'patch');
    const versionId = `ver-${pkg.id}-${version}`;

    const versionData = {
      id: versionId, packageId: pkg.id, version,
      status: 'immutable', message,
      snapshot: pkg.toJSON(),
      immutableHash: pkg.publication?.immutableHash || this.#hash(pkg.toJSON()),
      provenance: pkg.getProvenanceChain(),
      executionTrace: pkg.executionTrace,
      createdAt: new Date().toISOString(),
    };

    const dir = join(VERSIONS_DIR, pkg.id);
    ensureDir(dir);
    writeFileSync(join(dir, `${version}.json`), JSON.stringify(versionData, null, 2));

    // Update version manifest
    const manifestPath = join(dir, 'manifest.json');
    const manifest = existsSync(manifestPath)
      ? JSON.parse(readFileSync(manifestPath, 'utf-8'))
      : { packageId: pkg.id, versions: [] };
    manifest.versions.push({ version, versionId, hash: versionData.immutableHash, createdAt: versionData.createdAt, message });
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    // Update the package's version to reflect the new version
    pkg.version = version;

    return { success: true, versionId, version, hash: versionData.immutableHash };
  }

  /** Reproduce a version — load snapshot and re-run pipeline */
  getReproductionPlan(versionId) {
    const [_, packageId, version] = versionId.split('-').length > 3
      ? [null, versionId.split('-').slice(1, -1).join('-'), versionId.split('-').pop()]
      : [null, versionId, null];

    const dir = join(VERSIONS_DIR, packageId);
    if (!existsSync(dir)) return { success: false, error: 'Package versions not found' };

    const versionFile = join(dir, `${version}.json`);
    if (!existsSync(versionFile)) return { success: false, error: `Version ${version} not found` };

    const versionData = JSON.parse(readFileSync(versionFile, 'utf-8'));
    return {
      success: true, versionData,
      reproducible: versionData.provenance?.length > 0,
      steps: (versionData.provenance || []).map(p => ({
        capabilityId: p.capabilityId, skillId: p.skillId, agentId: p.agentId,
        source: `Re-execute from provenance chain`,
      })),
    };
  }

  /** List versions for a package */
  listVersions(packageId) {
    const dir = join(VERSIONS_DIR, packageId);
    if (!existsSync(dir)) return [];
    const manifestPath = join(dir, 'manifest.json');
    if (!existsSync(manifestPath)) return [];
    return JSON.parse(readFileSync(manifestPath, 'utf-8')).versions || [];
  }

  /** Compare two versions — what changed */
  compareVersions(packageId, v1, v2) {
    const dir = join(VERSIONS_DIR, packageId);
    const file1 = join(dir, `${v1}.json`);
    const file2 = join(dir, `${v2}.json`);
    if (!existsSync(file1) || !existsSync(file2)) return { error: 'Version(s) not found' };

    const d1 = JSON.parse(readFileSync(file1, 'utf-8'));
    const d2 = JSON.parse(readFileSync(file2, 'utf-8'));

    const changed = [];
    for (const key of ['lesson', 'assessment', 'teacherGuide', 'workbook', 'visualSpec', 'video']) {
      const s1 = JSON.stringify(d1.snapshot?.[key]);
      const s2 = JSON.stringify(d2.snapshot?.[key]);
      if (s1 !== s2) changed.push(key);
    }

    return { v1, v2, changed, identical: changed.length === 0 };
  }

  #incrementVersion(current, type = 'patch') {
    const parts = (current || '1.0.0').split('.').map(Number);
    if (type === 'patch') parts[2] = (parts[2] || 0) + 1;
    else if (type === 'minor') { parts[1] = (parts[1] || 0) + 1; parts[2] = 0; }
    else if (type === 'major') { parts[0] = (parts[0] || 0) + 1; parts[1] = 0; parts[2] = 0; }
    return parts.join('.');
  }

  #hash(data) {
    const str = JSON.stringify(data);
    let h = 0;
    for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    return `hash-${Math.abs(h).toString(16).padStart(8, '0')}`;
  }
}
