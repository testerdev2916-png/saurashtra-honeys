import fs from "fs";
import path from "path";
import zlib from "zlib";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

/**
 * Minimal ZIP Writer in pure Node.js (no external dependencies)
 */
class ZipWriter {
  constructor(outputPath) {
    this.fd = fs.openSync(outputPath, "w");
    this.offset = 0;
    this.files = [];
  }

  addFile(zipPath, localFilePath) {
    if (!fs.existsSync(localFilePath)) {
      console.warn(`[WARN] Skipping missing file: ${localFilePath}`);
      return;
    }
    const stat = fs.statSync(localFilePath);
    if (stat.isDirectory()) return;

    const data = fs.readFileSync(localFilePath);
    const crc = zlib.crc32(data);
    const compressed = zlib.deflateRawSync(data);
    const filenameBuf = Buffer.from(zipPath, "utf8");

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0); // Signature
    localHeader.writeUInt16LE(20, 4); // Version needed
    localHeader.writeUInt16LE(0, 6); // Flags
    localHeader.writeUInt16LE(8, 8); // Compression method (8 = deflate)
    localHeader.writeUInt16LE(0, 10); // Mod time
    localHeader.writeUInt16LE(0, 12); // Mod date
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(data.length, 22);
    localHeader.writeUInt16LE(filenameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28); // Extra length

    const headerOffset = this.offset;
    fs.writeSync(this.fd, localHeader);
    fs.writeSync(this.fd, filenameBuf);
    fs.writeSync(this.fd, compressed);

    this.offset += 30 + filenameBuf.length + compressed.length;

    this.files.push({
      zipPath,
      crc,
      compressedSize: compressed.length,
      uncompressedSize: data.length,
      filenameBuf,
      headerOffset,
    });
  }

  finish() {
    const cdStartOffset = this.offset;
    let cdSize = 0;

    for (const f of this.files) {
      const cdHeader = Buffer.alloc(46);
      cdHeader.writeUInt32LE(0x02014b50, 0); // Signature
      cdHeader.writeUInt16LE(20, 4); // Version made by
      cdHeader.writeUInt16LE(20, 6); // Version needed
      cdHeader.writeUInt16LE(0, 8); // Flags
      cdHeader.writeUInt16LE(8, 10); // Compression method
      cdHeader.writeUInt16LE(0, 12); // Mod time
      cdHeader.writeUInt16LE(0, 14); // Mod date
      cdHeader.writeUInt32LE(f.crc, 16);
      cdHeader.writeUInt32LE(f.compressedSize, 20);
      cdHeader.writeUInt32LE(f.uncompressedSize, 24);
      cdHeader.writeUInt16LE(f.filenameBuf.length, 28);
      cdHeader.writeUInt16LE(0, 30); // Extra length
      cdHeader.writeUInt16LE(0, 32); // Comment length
      cdHeader.writeUInt16LE(0, 34); // Disk number start
      cdHeader.writeUInt16LE(0, 36); // Internal attributes
      cdHeader.writeUInt32LE(0, 38); // External attributes
      cdHeader.writeUInt32LE(f.headerOffset, 42);

      fs.writeSync(this.fd, cdHeader);
      fs.writeSync(this.fd, f.filenameBuf);

      cdSize += 46 + f.filenameBuf.length;
    }

    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0); // Signature
    eocd.writeUInt16LE(0, 4); // Disk number
    eocd.writeUInt16LE(0, 6); // Disk with central directory
    eocd.writeUInt16LE(this.files.length, 8); // Total entries on this disk
    eocd.writeUInt16LE(this.files.length, 10); // Total entries
    eocd.writeUInt32LE(cdSize, 12); // Size of central directory
    eocd.writeUInt32LE(cdStartOffset, 16); // Offset of central directory
    eocd.writeUInt16LE(0, 20); // Comment length

    fs.writeSync(this.fd, eocd);
    fs.closeSync(this.fd);
  }
}

// 1. Create Patch ZIP
console.log("=== Creating Patch ZIP (Saurashtra_Honey_Admin_Video_CMS_Patch.zip) ===");
const patchZipPath = path.join(ROOT, "Saurashtra_Honey_Admin_Video_CMS_Patch.zip");
const patchZip = new ZipWriter(patchZipPath);

const patchFiles = [
  "supabase/migrations/20260728100000_admin_video_cms_and_dynamic_categories.sql",
  "src/lib/homepage-videos.ts",
  "src/routes/admin.stories.tsx",
  "src/lib/admin-cms.functions.ts",
  "src/components/site/StorySection.tsx",
  "src/components/admin/AdminShell.tsx",
  "src/routes/admin.products.tsx",
  "src/components/site/Navbar.tsx",
  "src/routes/shop.tsx",
  "src/integrations/supabase/types.ts",
  "CHANGELOG_ADMIN_VIDEO_CMS_DYNAMIC_CATEGORIES.md",
];

for (const relPath of patchFiles) {
  const fullPath = path.join(ROOT, relPath);
  patchZip.addFile(relPath, fullPath);
  console.log(`  + Added ${relPath}`);
}
patchZip.finish();
console.log(`✅ Patch ZIP created: ${patchZipPath} (${(fs.statSync(patchZipPath).size / 1024).toFixed(2)} KB)\n`);

// 2. Create Complete Website ZIP
console.log("=== Creating Complete Website ZIP (Saurashtra_Honey_Complete_Website_Updated.zip) ===");
const fullZipPath = path.join(ROOT, "Saurashtra_Honey_Complete_Website_Updated.zip");
const fullZip = new ZipWriter(fullZipPath);

const ignoredDirs = new Set([
  "node_modules",
  ".git",
  ".tanstack",
  ".gemini",
  "dist",
  ".vercel",
  ".output",
]);

const ignoredFiles = new Set([
  "Saurashtra_Honey_Admin_Video_CMS_Patch.zip",
  "Saurashtra_Honey_Complete_Website_Updated.zip",
]);

function walkDir(currentDir, baseDir) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        walkDir(fullPath, baseDir);
      }
    } else if (entry.isFile()) {
      if (!ignoredFiles.has(entry.name) && !entry.name.endsWith(".zip")) {
        fullZip.addFile(relPath, fullPath);
      }
    }
  }
}

walkDir(ROOT, ROOT);
fullZip.finish();
console.log(`✅ Complete Website ZIP created: ${fullZipPath} (${(fs.statSync(fullZipPath).size / (1024 * 1024)).toFixed(2)} MB)\n`);
