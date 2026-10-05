// Generates synthetic, non-personal image fixtures for tests. No real photos.
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const OUT_DIR = new URL("../tests/fixtures/", import.meta.url);
mkdirSync(OUT_DIR, { recursive: true });

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

/** @param {Buffer} buf */
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/**
 * @param {string} type
 * @param {Buffer} data
 */
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

/**
 * Minimal uncompressed (zlib level 0) RGB PNG — enough for a synthetic test
 * fixture without pulling in an image-encoding dependency.
 * @param {string} name
 * @param {number} width
 * @param {number} height
 * @param {number} fillByte
 */
function writePng(name, width, height, fillByte) {
  const rowSize = 1 + width * 3; // filter byte + RGB
  const raw = Buffer.alloc(rowSize * height, fillByte);
  for (let y = 0; y < height; y++) raw[y * rowSize] = 0; // filter: none

  const idat = deflateSync(raw, { level: 0 });

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const png = Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);

  writeFileSync(new URL(name, OUT_DIR), png);
}

/**
 * Synthetic "JPEG-shaped" fixture: real JPEG SOI/EOI markers wrapping
 * deterministic filler bytes, sized to the requested byte count — enough to
 * exercise upload/size-limit logic without needing a real photo.
 * @param {string} name
 * @param {number} sizeBytes
 */
function writeJpegLike(name, sizeBytes) {
  const soi = Buffer.from([0xff, 0xd8]);
  const eoi = Buffer.from([0xff, 0xd9]);
  const fillerLength = Math.max(0, sizeBytes - soi.length - eoi.length);
  const filler = Buffer.alloc(fillerLength, 0x00);
  writeFileSync(new URL(name, OUT_DIR), Buffer.concat([soi, filler, eoi]));
}

writePng("portrait.png", 200, 230, 0x80);
writeJpegLike("portrait.jpg", 40 * 1024);
writeJpegLike("large.jpg", 6 * 1024 * 1024);
writePng("signature.png", 300, 100, 0xf0);

console.log("Fixtures written to tests/fixtures/");
