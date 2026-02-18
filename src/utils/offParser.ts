import * as THREE from 'three';

/**
 * Parse an OFF (Object File Format) file into a Three.js BufferGeometry.
 * OFF format preserves per-face colors from OpenSCAD's color() calls,
 * unlike binary STL which loses them.
 *
 * Format:
 *   OFF
 *   numVertices numFaces numEdges
 *   x y z          (vertex positions)
 *   ...
 *   N v0 v1 v2 ... r g b a   (face: N vertices, indices, RGBA 0-1)
 *   ...
 */
export function parseOFF(data: string): THREE.BufferGeometry {
  // Filter out empty lines and comments, collect meaningful lines
  const rawLines = data.split('\n');
  const lines: string[] = [];
  for (const raw of rawLines) {
    const trimmed = raw.trim();
    if (trimmed !== '' && !trimmed.startsWith('#')) {
      lines.push(trimmed);
    }
  }

  if (lines.length === 0) {
    throw new Error('OFF file is empty');
  }

  let lineIdx = 0;

  // First meaningful line should be OFF/COFF header (possibly with counts on same line)
  const header = lines[lineIdx];
  let countsLine: string;

  if (header === 'OFF' || header === 'COFF') {
    // Counts are on the next line
    lineIdx++;
    countsLine = lines[lineIdx];
  } else if (header.startsWith('OFF ') || header.startsWith('COFF ')) {
    // Counts are on the same line as header: "OFF 8 6 0"
    countsLine = header.replace(/^C?OFF\s+/, '');
  } else {
    // Try treating the first line as counts (some OFF files omit the header)
    countsLine = header;
  }
  lineIdx++;

  // Parse counts: numVertices numFaces numEdges
  const counts = countsLine.split(/\s+/).map(Number);
  const numVertices = counts[0];
  const numFaces = counts[1];

  if (isNaN(numVertices) || isNaN(numFaces) || numVertices <= 0 || numFaces <= 0) {
    throw new Error(`Invalid OFF counts: vertices=${numVertices}, faces=${numFaces}`);
  }

  // Parse vertices
  const vertices: [number, number, number][] = [];
  for (let i = 0; i < numVertices; i++) {
    if (lineIdx >= lines.length) throw new Error(`OFF: expected ${numVertices} vertices, found ${i}`);
    const parts = lines[lineIdx].split(/\s+/).map(Number);
    vertices.push([parts[0], parts[1], parts[2]]);
    lineIdx++;
  }

  // Parse faces — each face may have color info
  // We triangulate n-gon faces and assign per-face colors as vertex colors
  const positions: number[] = [];
  const colors: number[] = [];
  let hasColors = false;

  for (let f = 0; f < numFaces; f++) {
    if (lineIdx >= lines.length) break;

    const parts = lines[lineIdx].split(/\s+/).map(Number);
    lineIdx++;

    const n = parts[0]; // number of vertices in this face
    if (n < 3) continue; // skip degenerate faces

    const faceIndices: number[] = [];
    for (let i = 1; i <= n; i++) {
      faceIndices.push(parts[i]);
    }

    // Color info comes after the vertex indices
    let r = 0.8, g = 0.8, b = 0.8;
    const colorStart = n + 1;
    if (parts.length >= colorStart + 3) {
      // Colors can be 0-1 floats or 0-255 integers
      const cr = parts[colorStart];
      const cg = parts[colorStart + 1];
      const cb = parts[colorStart + 2];
      // Heuristic: if any value > 1, assume 0-255 range
      if (cr > 1 || cg > 1 || cb > 1) {
        r = cr / 255;
        g = cg / 255;
        b = cb / 255;
      } else {
        r = cr;
        g = cg;
        b = cb;
      }
      hasColors = true;
    }

    // Triangulate (fan from first vertex)
    for (let i = 1; i < n - 1; i++) {
      const i0 = faceIndices[0];
      const i1 = faceIndices[i];
      const i2 = faceIndices[i + 1];

      // Bounds check vertex indices
      if (i0 >= vertices.length || i1 >= vertices.length || i2 >= vertices.length) continue;

      const v0 = vertices[i0];
      const v1 = vertices[i1];
      const v2 = vertices[i2];

      positions.push(v0[0], v0[1], v0[2]);
      positions.push(v1[0], v1[1], v1[2]);
      positions.push(v2[0], v2[1], v2[2]);

      // Same color for all 3 vertices of the triangle (per-face color)
      colors.push(r, g, b);
      colors.push(r, g, b);
      colors.push(r, g, b);
    }
  }

  if (positions.length === 0) {
    throw new Error('OFF file produced no triangles');
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  );

  if (hasColors) {
    geometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3),
    );
  }

  geometry.computeVertexNormals();

  // Generate triplanar UVs for texture mapping
  generateOFFUVs(geometry);

  return geometry;
}

/**
 * Generate triplanar UVs for the parsed OFF geometry.
 * Uses face normals to project UVs from the dominant axis.
 */
function generateOFFUVs(geometry: THREE.BufferGeometry, scale = 0.1): void {
  const pos = geometry.attributes.position;
  const norm = geometry.attributes.normal;
  if (!norm) return;

  const uvs = new Float32Array(pos.count * 2);

  for (let face = 0; face < pos.count / 3; face++) {
    let nx = 0, ny = 0, nz = 0;
    for (let v = 0; v < 3; v++) {
      const i = face * 3 + v;
      nx += Math.abs(norm.getX(i));
      ny += Math.abs(norm.getY(i));
      nz += Math.abs(norm.getZ(i));
    }

    for (let v = 0; v < 3; v++) {
      const i = face * 3 + v;
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      let u: number, vv: number;
      if (nx >= ny && nx >= nz) {
        u = z * scale;
        vv = y * scale;
      } else if (ny >= nx && ny >= nz) {
        u = x * scale;
        vv = z * scale;
      } else {
        u = x * scale;
        vv = y * scale;
      }

      uvs[i * 2] = u;
      uvs[i * 2 + 1] = vv;
    }
  }

  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
}
