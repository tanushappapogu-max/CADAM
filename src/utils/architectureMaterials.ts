import * as THREE from 'three';

/**
 * PBR material presets for architecture mode.
 * Each preset maps to specific vertex colors from the OpenSCAD color() calls.
 */

// ── Revit-style Surface Material Library ──
// These are user-selectable materials with procedural textures for the whole model.
export interface SurfaceMaterial {
  name: string;
  category: string;
  color: number;
  roughness: number;
  metalness: number;
  bumpScale: number;
  pattern: string;
  opacity?: number;
  transparent?: boolean;
}

export const SURFACE_MATERIALS: Record<string, SurfaceMaterial> = {
  // ── Masonry ──
  concrete: {
    name: 'Concrete',
    category: 'Masonry',
    color: 0xb8b4a8,
    roughness: 0.85,
    metalness: 0.0,
    bumpScale: 0.4,
    pattern: 'concrete',
  },
  concrete_smooth: {
    name: 'Smooth Concrete',
    category: 'Masonry',
    color: 0xc5c0b5,
    roughness: 0.7,
    metalness: 0.0,
    bumpScale: 0.15,
    pattern: 'concrete',
  },
  concrete_dark: {
    name: 'Dark Concrete',
    category: 'Masonry',
    color: 0x7a7670,
    roughness: 0.9,
    metalness: 0.0,
    bumpScale: 0.5,
    pattern: 'concrete',
  },
  brick: {
    name: 'Red Brick',
    category: 'Masonry',
    color: 0xa0522d,
    roughness: 0.75,
    metalness: 0.0,
    bumpScale: 0.6,
    pattern: 'brick',
  },
  brick_brown: {
    name: 'Brown Brick',
    category: 'Masonry',
    color: 0x7a4a2a,
    roughness: 0.8,
    metalness: 0.0,
    bumpScale: 0.6,
    pattern: 'brick',
  },
  brick_white: {
    name: 'White Brick',
    category: 'Masonry',
    color: 0xe8e0d5,
    roughness: 0.7,
    metalness: 0.0,
    bumpScale: 0.55,
    pattern: 'brick',
  },
  brick_gray: {
    name: 'Gray Brick',
    category: 'Masonry',
    color: 0x9a9590,
    roughness: 0.75,
    metalness: 0.0,
    bumpScale: 0.6,
    pattern: 'brick',
  },
  stucco: {
    name: 'Stucco',
    category: 'Masonry',
    color: 0xe8e0d0,
    roughness: 0.85,
    metalness: 0.0,
    bumpScale: 0.3,
    pattern: 'concrete',
  },
  stucco_white: {
    name: 'White Stucco',
    category: 'Masonry',
    color: 0xf5f2ed,
    roughness: 0.8,
    metalness: 0.0,
    bumpScale: 0.25,
    pattern: 'concrete',
  },
  stucco_tan: {
    name: 'Tan Stucco',
    category: 'Masonry',
    color: 0xd4c4a8,
    roughness: 0.85,
    metalness: 0.0,
    bumpScale: 0.3,
    pattern: 'concrete',
  },
  stucco_terracotta: {
    name: 'Terracotta Stucco',
    category: 'Masonry',
    color: 0xcc7755,
    roughness: 0.85,
    metalness: 0.0,
    bumpScale: 0.3,
    pattern: 'concrete',
  },
  cinder_block: {
    name: 'Cinder Block',
    category: 'Masonry',
    color: 0x9e9a94,
    roughness: 0.95,
    metalness: 0.0,
    bumpScale: 0.5,
    pattern: 'concrete',
  },

  // ── Stone ──
  marble: {
    name: 'White Marble',
    category: 'Stone',
    color: 0xf0f0f0,
    roughness: 0.15,
    metalness: 0.05,
    bumpScale: 0.1,
    pattern: 'marble',
  },
  marble_black: {
    name: 'Black Marble',
    category: 'Stone',
    color: 0x2a2a2a,
    roughness: 0.1,
    metalness: 0.08,
    bumpScale: 0.1,
    pattern: 'marble',
  },
  marble_cream: {
    name: 'Cream Marble',
    category: 'Stone',
    color: 0xf5e6cc,
    roughness: 0.15,
    metalness: 0.05,
    bumpScale: 0.1,
    pattern: 'marble',
  },
  granite: {
    name: 'Gray Granite',
    category: 'Stone',
    color: 0x808080,
    roughness: 0.4,
    metalness: 0.1,
    bumpScale: 0.2,
    pattern: 'granite',
  },
  granite_dark: {
    name: 'Dark Granite',
    category: 'Stone',
    color: 0x3a3a3a,
    roughness: 0.35,
    metalness: 0.12,
    bumpScale: 0.2,
    pattern: 'granite',
  },
  granite_brown: {
    name: 'Brown Granite',
    category: 'Stone',
    color: 0x6b5040,
    roughness: 0.4,
    metalness: 0.1,
    bumpScale: 0.2,
    pattern: 'granite',
  },
  sandstone: {
    name: 'Sandstone',
    category: 'Stone',
    color: 0xd2b48c,
    roughness: 0.8,
    metalness: 0.0,
    bumpScale: 0.4,
    pattern: 'granite',
  },
  limestone: {
    name: 'Limestone',
    category: 'Stone',
    color: 0xcfc8b8,
    roughness: 0.7,
    metalness: 0.0,
    bumpScale: 0.3,
    pattern: 'concrete',
  },
  slate: {
    name: 'Slate',
    category: 'Stone',
    color: 0x4a4a50,
    roughness: 0.6,
    metalness: 0.05,
    bumpScale: 0.35,
    pattern: 'granite',
  },
  flagstone: {
    name: 'Flagstone',
    category: 'Stone',
    color: 0x8b7d6b,
    roughness: 0.75,
    metalness: 0.0,
    bumpScale: 0.4,
    pattern: 'granite',
  },
  travertine: {
    name: 'Travertine',
    category: 'Stone',
    color: 0xe0d5c0,
    roughness: 0.35,
    metalness: 0.03,
    bumpScale: 0.2,
    pattern: 'marble',
  },

  // ── Wood ──
  wood_oak: {
    name: 'Oak',
    category: 'Wood',
    color: 0xb5651d,
    roughness: 0.55,
    metalness: 0.0,
    bumpScale: 0.3,
    pattern: 'wood',
  },
  wood_walnut: {
    name: 'Walnut',
    category: 'Wood',
    color: 0x5c4033,
    roughness: 0.5,
    metalness: 0.0,
    bumpScale: 0.3,
    pattern: 'wood',
  },
  wood_cherry: {
    name: 'Cherry',
    category: 'Wood',
    color: 0x8b4513,
    roughness: 0.45,
    metalness: 0.0,
    bumpScale: 0.3,
    pattern: 'wood',
  },
  wood_pine: {
    name: 'Pine',
    category: 'Wood',
    color: 0xdeb887,
    roughness: 0.6,
    metalness: 0.0,
    bumpScale: 0.25,
    pattern: 'wood',
  },
  wood_mahogany: {
    name: 'Mahogany',
    category: 'Wood',
    color: 0x4e1609,
    roughness: 0.4,
    metalness: 0.0,
    bumpScale: 0.3,
    pattern: 'wood',
  },
  wood_maple: {
    name: 'Maple',
    category: 'Wood',
    color: 0xc9a66b,
    roughness: 0.45,
    metalness: 0.0,
    bumpScale: 0.2,
    pattern: 'wood',
  },
  wood_birch: {
    name: 'Birch',
    category: 'Wood',
    color: 0xe8d5b0,
    roughness: 0.5,
    metalness: 0.0,
    bumpScale: 0.2,
    pattern: 'wood',
  },
  wood_teak: {
    name: 'Teak',
    category: 'Wood',
    color: 0x9c7a3c,
    roughness: 0.5,
    metalness: 0.0,
    bumpScale: 0.3,
    pattern: 'wood',
  },
  wood_cedar: {
    name: 'Cedar',
    category: 'Wood',
    color: 0xa0522d,
    roughness: 0.6,
    metalness: 0.0,
    bumpScale: 0.35,
    pattern: 'wood',
  },
  wood_ebony: {
    name: 'Ebony',
    category: 'Wood',
    color: 0x1c1008,
    roughness: 0.3,
    metalness: 0.0,
    bumpScale: 0.15,
    pattern: 'wood',
  },
  wood_ash: {
    name: 'Ash',
    category: 'Wood',
    color: 0xd4c4a0,
    roughness: 0.55,
    metalness: 0.0,
    bumpScale: 0.25,
    pattern: 'wood',
  },
  wood_bamboo: {
    name: 'Bamboo',
    category: 'Wood',
    color: 0xc8b060,
    roughness: 0.4,
    metalness: 0.0,
    bumpScale: 0.2,
    pattern: 'wood',
  },
  wood_reclaimed: {
    name: 'Reclaimed Wood',
    category: 'Wood',
    color: 0x7a6a55,
    roughness: 0.8,
    metalness: 0.0,
    bumpScale: 0.5,
    pattern: 'wood',
  },
  wood_whitewash: {
    name: 'Whitewash Wood',
    category: 'Wood',
    color: 0xe0d8cc,
    roughness: 0.65,
    metalness: 0.0,
    bumpScale: 0.2,
    pattern: 'wood',
  },

  // ── Metal ──
  steel: {
    name: 'Steel',
    category: 'Metal',
    color: 0x8c8c8c,
    roughness: 0.3,
    metalness: 0.9,
    bumpScale: 0.1,
    pattern: 'brushed',
  },
  aluminum: {
    name: 'Aluminum',
    category: 'Metal',
    color: 0xc0c0c0,
    roughness: 0.2,
    metalness: 0.85,
    bumpScale: 0.05,
    pattern: 'none',
  },
  stainless_steel: {
    name: 'Stainless Steel',
    category: 'Metal',
    color: 0xd0d0d5,
    roughness: 0.15,
    metalness: 0.95,
    bumpScale: 0.05,
    pattern: 'brushed',
  },
  black_steel: {
    name: 'Black Steel',
    category: 'Metal',
    color: 0x1a1a1e,
    roughness: 0.2,
    metalness: 0.9,
    bumpScale: 0.03,
    pattern: 'none',
  },
  brushed_nickel: {
    name: 'Brushed Nickel',
    category: 'Metal',
    color: 0xc8c0b8,
    roughness: 0.25,
    metalness: 0.85,
    bumpScale: 0.05,
    pattern: 'brushed',
  },
  copper: {
    name: 'Copper',
    category: 'Metal',
    color: 0xb87333,
    roughness: 0.3,
    metalness: 0.9,
    bumpScale: 0.1,
    pattern: 'brushed',
  },
  copper_patina: {
    name: 'Patina Copper',
    category: 'Metal',
    color: 0x4a8c6e,
    roughness: 0.6,
    metalness: 0.5,
    bumpScale: 0.3,
    pattern: 'granite',
  },
  bronze: {
    name: 'Bronze',
    category: 'Metal',
    color: 0x8b6914,
    roughness: 0.35,
    metalness: 0.85,
    bumpScale: 0.1,
    pattern: 'brushed',
  },
  brass: {
    name: 'Brass',
    category: 'Metal',
    color: 0xd4a843,
    roughness: 0.25,
    metalness: 0.9,
    bumpScale: 0.05,
    pattern: 'none',
  },
  wrought_iron: {
    name: 'Wrought Iron',
    category: 'Metal',
    color: 0x3a3a3a,
    roughness: 0.7,
    metalness: 0.8,
    bumpScale: 0.3,
    pattern: 'brushed',
  },
  zinc: {
    name: 'Zinc',
    category: 'Metal',
    color: 0xa8a8aa,
    roughness: 0.4,
    metalness: 0.8,
    bumpScale: 0.1,
    pattern: 'brushed',
  },
  corten_steel: {
    name: 'Corten Steel',
    category: 'Metal',
    color: 0x8b4513,
    roughness: 0.85,
    metalness: 0.6,
    bumpScale: 0.5,
    pattern: 'granite',
  },
  gold: {
    name: 'Gold',
    category: 'Metal',
    color: 0xffd700,
    roughness: 0.15,
    metalness: 1.0,
    bumpScale: 0.02,
    pattern: 'none',
  },
  chrome: {
    name: 'Chrome',
    category: 'Metal',
    color: 0xe8e8e8,
    roughness: 0.05,
    metalness: 1.0,
    bumpScale: 0.01,
    pattern: 'none',
  },
  matte_black_metal: {
    name: 'Matte Black Metal',
    category: 'Metal',
    color: 0x1a1a1a,
    roughness: 0.6,
    metalness: 0.8,
    bumpScale: 0.05,
    pattern: 'none',
  },

  // ── Glass ──
  glass: {
    name: 'Clear Glass',
    category: 'Glass',
    color: 0xadd8e6,
    roughness: 0.05,
    metalness: 0.1,
    bumpScale: 0,
    opacity: 0.3,
    transparent: true,
    pattern: 'none',
  },
  glass_tinted: {
    name: 'Tinted Glass',
    category: 'Glass',
    color: 0x6090a0,
    roughness: 0.05,
    metalness: 0.15,
    bumpScale: 0,
    opacity: 0.4,
    transparent: true,
    pattern: 'none',
  },
  glass_frosted: {
    name: 'Frosted Glass',
    category: 'Glass',
    color: 0xd8e8f0,
    roughness: 0.6,
    metalness: 0.05,
    bumpScale: 0.1,
    opacity: 0.5,
    transparent: true,
    pattern: 'none',
  },
  glass_smoked: {
    name: 'Smoked Glass',
    category: 'Glass',
    color: 0x404040,
    roughness: 0.05,
    metalness: 0.15,
    bumpScale: 0,
    opacity: 0.45,
    transparent: true,
    pattern: 'none',
  },
  glass_mirror: {
    name: 'Mirror',
    category: 'Glass',
    color: 0xe0e8f0,
    roughness: 0.02,
    metalness: 0.95,
    bumpScale: 0,
    pattern: 'none',
  },

  // ── Tile & Ceramic ──
  tile: {
    name: 'Ceramic Tile',
    category: 'Tile',
    color: 0xe8e0d0,
    roughness: 0.3,
    metalness: 0.05,
    bumpScale: 0.2,
    pattern: 'tile',
  },
  tile_white: {
    name: 'White Tile',
    category: 'Tile',
    color: 0xf5f5f5,
    roughness: 0.2,
    metalness: 0.05,
    bumpScale: 0.15,
    pattern: 'tile',
  },
  tile_black: {
    name: 'Black Tile',
    category: 'Tile',
    color: 0x2a2a2a,
    roughness: 0.25,
    metalness: 0.05,
    bumpScale: 0.15,
    pattern: 'tile',
  },
  tile_subway: {
    name: 'Subway Tile',
    category: 'Tile',
    color: 0xf0ede8,
    roughness: 0.2,
    metalness: 0.05,
    bumpScale: 0.25,
    pattern: 'brick',
  },
  tile_terracotta: {
    name: 'Terracotta Tile',
    category: 'Tile',
    color: 0xcc6644,
    roughness: 0.7,
    metalness: 0.0,
    bumpScale: 0.3,
    pattern: 'tile',
  },
  tile_mosaic: {
    name: 'Mosaic Tile',
    category: 'Tile',
    color: 0x6a9daa,
    roughness: 0.2,
    metalness: 0.05,
    bumpScale: 0.15,
    pattern: 'tile',
  },
  porcelain: {
    name: 'Porcelain',
    category: 'Tile',
    color: 0xf8f8fa,
    roughness: 0.1,
    metalness: 0.05,
    bumpScale: 0.05,
    pattern: 'none',
  },

  // ── Roofing ──
  shingle_asphalt: {
    name: 'Asphalt Shingle',
    category: 'Roofing',
    color: 0x4a4540,
    roughness: 0.95,
    metalness: 0.0,
    bumpScale: 0.5,
    pattern: 'granite',
  },
  shingle_brown: {
    name: 'Brown Shingle',
    category: 'Roofing',
    color: 0x5a3a2a,
    roughness: 0.95,
    metalness: 0.0,
    bumpScale: 0.5,
    pattern: 'granite',
  },
  shingle_gray: {
    name: 'Gray Shingle',
    category: 'Roofing',
    color: 0x6a6a6a,
    roughness: 0.9,
    metalness: 0.0,
    bumpScale: 0.45,
    pattern: 'granite',
  },
  roof_tile_clay: {
    name: 'Clay Roof Tile',
    category: 'Roofing',
    color: 0xb55533,
    roughness: 0.7,
    metalness: 0.0,
    bumpScale: 0.4,
    pattern: 'tile',
  },
  roof_tile_slate: {
    name: 'Slate Roof',
    category: 'Roofing',
    color: 0x505058,
    roughness: 0.65,
    metalness: 0.05,
    bumpScale: 0.35,
    pattern: 'granite',
  },
  roof_metal: {
    name: 'Metal Roof',
    category: 'Roofing',
    color: 0x6a7078,
    roughness: 0.4,
    metalness: 0.7,
    bumpScale: 0.1,
    pattern: 'brushed',
  },
  roof_metal_red: {
    name: 'Red Metal Roof',
    category: 'Roofing',
    color: 0x8b2020,
    roughness: 0.4,
    metalness: 0.65,
    bumpScale: 0.1,
    pattern: 'brushed',
  },
  roof_metal_green: {
    name: 'Green Metal Roof',
    category: 'Roofing',
    color: 0x2d5a3c,
    roughness: 0.4,
    metalness: 0.65,
    bumpScale: 0.1,
    pattern: 'brushed',
  },
  thatch: {
    name: 'Thatch',
    category: 'Roofing',
    color: 0xb8a050,
    roughness: 1.0,
    metalness: 0.0,
    bumpScale: 0.6,
    pattern: 'wood',
  },

  // ── Finish / Paint ──
  drywall: {
    name: 'Drywall',
    category: 'Finish',
    color: 0xf0ece0,
    roughness: 0.9,
    metalness: 0.0,
    bumpScale: 0.05,
    pattern: 'none',
  },
  paint_white: {
    name: 'White Paint',
    category: 'Finish',
    color: 0xf5f5f0,
    roughness: 0.4,
    metalness: 0.0,
    bumpScale: 0.02,
    pattern: 'none',
  },
  paint_cream: {
    name: 'Cream Paint',
    category: 'Finish',
    color: 0xf5eed6,
    roughness: 0.4,
    metalness: 0.0,
    bumpScale: 0.02,
    pattern: 'none',
  },
  paint_gray: {
    name: 'Gray Paint',
    category: 'Finish',
    color: 0xa0a0a0,
    roughness: 0.4,
    metalness: 0.0,
    bumpScale: 0.02,
    pattern: 'none',
  },
  paint_charcoal: {
    name: 'Charcoal Paint',
    category: 'Finish',
    color: 0x3a3a3a,
    roughness: 0.45,
    metalness: 0.0,
    bumpScale: 0.02,
    pattern: 'none',
  },
  paint_navy: {
    name: 'Navy Blue Paint',
    category: 'Finish',
    color: 0x1a2a4a,
    roughness: 0.4,
    metalness: 0.0,
    bumpScale: 0.02,
    pattern: 'none',
  },
  paint_sage: {
    name: 'Sage Green Paint',
    category: 'Finish',
    color: 0x8fbc8f,
    roughness: 0.45,
    metalness: 0.0,
    bumpScale: 0.02,
    pattern: 'none',
  },
  paint_burgundy: {
    name: 'Burgundy Paint',
    category: 'Finish',
    color: 0x6b1a2a,
    roughness: 0.4,
    metalness: 0.0,
    bumpScale: 0.02,
    pattern: 'none',
  },
  paint_black: {
    name: 'Black Paint',
    category: 'Finish',
    color: 0x1a1a1a,
    roughness: 0.35,
    metalness: 0.0,
    bumpScale: 0.02,
    pattern: 'none',
  },
  plaster: {
    name: 'Plaster',
    category: 'Finish',
    color: 0xf2ece2,
    roughness: 0.85,
    metalness: 0.0,
    bumpScale: 0.15,
    pattern: 'concrete',
  },
  venetian_plaster: {
    name: 'Venetian Plaster',
    category: 'Finish',
    color: 0xe8dcc8,
    roughness: 0.3,
    metalness: 0.02,
    bumpScale: 0.1,
    pattern: 'marble',
  },
  wallpaper_linen: {
    name: 'Linen Wallpaper',
    category: 'Finish',
    color: 0xe8e0d0,
    roughness: 0.75,
    metalness: 0.0,
    bumpScale: 0.1,
    pattern: 'none',
  },

  // ── Fabric / Upholstery ──
  leather_brown: {
    name: 'Brown Leather',
    category: 'Fabric',
    color: 0x6b3a1f,
    roughness: 0.5,
    metalness: 0.0,
    bumpScale: 0.15,
    pattern: 'none',
  },
  leather_black: {
    name: 'Black Leather',
    category: 'Fabric',
    color: 0x1a1a1a,
    roughness: 0.45,
    metalness: 0.0,
    bumpScale: 0.1,
    pattern: 'none',
  },
  leather_tan: {
    name: 'Tan Leather',
    category: 'Fabric',
    color: 0xc4956a,
    roughness: 0.5,
    metalness: 0.0,
    bumpScale: 0.15,
    pattern: 'none',
  },
  fabric_gray: {
    name: 'Gray Fabric',
    category: 'Fabric',
    color: 0x8a8a88,
    roughness: 0.95,
    metalness: 0.0,
    bumpScale: 0.08,
    pattern: 'none',
  },
  fabric_navy: {
    name: 'Navy Fabric',
    category: 'Fabric',
    color: 0x1e2d4a,
    roughness: 0.95,
    metalness: 0.0,
    bumpScale: 0.08,
    pattern: 'none',
  },
  fabric_beige: {
    name: 'Beige Fabric',
    category: 'Fabric',
    color: 0xc8b898,
    roughness: 0.95,
    metalness: 0.0,
    bumpScale: 0.08,
    pattern: 'none',
  },
  fabric_charcoal: {
    name: 'Charcoal Fabric',
    category: 'Fabric',
    color: 0x3a3a3a,
    roughness: 0.95,
    metalness: 0.0,
    bumpScale: 0.08,
    pattern: 'none',
  },
  fabric_cream: {
    name: 'Cream Fabric',
    category: 'Fabric',
    color: 0xf0e8d8,
    roughness: 0.92,
    metalness: 0.0,
    bumpScale: 0.06,
    pattern: 'none',
  },
  velvet: {
    name: 'Velvet',
    category: 'Fabric',
    color: 0x3a1f5c,
    roughness: 0.98,
    metalness: 0.0,
    bumpScale: 0.05,
    pattern: 'none',
  },
  canvas: {
    name: 'Canvas',
    category: 'Fabric',
    color: 0xd5c8a8,
    roughness: 0.9,
    metalness: 0.0,
    bumpScale: 0.1,
    pattern: 'none',
  },

  // ── Siding ──
  vinyl_siding: {
    name: 'Vinyl Siding',
    category: 'Siding',
    color: 0xe8e4dc,
    roughness: 0.5,
    metalness: 0.0,
    bumpScale: 0.15,
    pattern: 'none',
  },
  vinyl_siding_blue: {
    name: 'Blue Siding',
    category: 'Siding',
    color: 0x5a7a9a,
    roughness: 0.5,
    metalness: 0.0,
    bumpScale: 0.15,
    pattern: 'none',
  },
  vinyl_siding_gray: {
    name: 'Gray Siding',
    category: 'Siding',
    color: 0x8a8a88,
    roughness: 0.5,
    metalness: 0.0,
    bumpScale: 0.15,
    pattern: 'none',
  },
  vinyl_siding_green: {
    name: 'Green Siding',
    category: 'Siding',
    color: 0x4a6a4a,
    roughness: 0.5,
    metalness: 0.0,
    bumpScale: 0.15,
    pattern: 'none',
  },
  wood_siding: {
    name: 'Wood Siding',
    category: 'Siding',
    color: 0x9a7a55,
    roughness: 0.65,
    metalness: 0.0,
    bumpScale: 0.35,
    pattern: 'wood',
  },
  board_batten: {
    name: 'Board & Batten',
    category: 'Siding',
    color: 0x3a3a38,
    roughness: 0.6,
    metalness: 0.0,
    bumpScale: 0.3,
    pattern: 'wood',
  },
  hardie_board: {
    name: 'Hardie Board',
    category: 'Siding',
    color: 0xc8c0b0,
    roughness: 0.6,
    metalness: 0.0,
    bumpScale: 0.2,
    pattern: 'concrete',
  },

  // ── Flooring ──
  hardwood_floor: {
    name: 'Hardwood Floor',
    category: 'Flooring',
    color: 0xa0783c,
    roughness: 0.4,
    metalness: 0.0,
    bumpScale: 0.2,
    pattern: 'wood',
  },
  hardwood_dark: {
    name: 'Dark Hardwood',
    category: 'Flooring',
    color: 0x4a3020,
    roughness: 0.35,
    metalness: 0.0,
    bumpScale: 0.2,
    pattern: 'wood',
  },
  hardwood_light: {
    name: 'Light Hardwood',
    category: 'Flooring',
    color: 0xd4b88c,
    roughness: 0.4,
    metalness: 0.0,
    bumpScale: 0.2,
    pattern: 'wood',
  },
  laminate: {
    name: 'Laminate',
    category: 'Flooring',
    color: 0xb8a070,
    roughness: 0.3,
    metalness: 0.0,
    bumpScale: 0.1,
    pattern: 'wood',
  },
  carpet_beige: {
    name: 'Beige Carpet',
    category: 'Flooring',
    color: 0xc8b898,
    roughness: 1.0,
    metalness: 0.0,
    bumpScale: 0.05,
    pattern: 'none',
  },
  carpet_gray: {
    name: 'Gray Carpet',
    category: 'Flooring',
    color: 0x808080,
    roughness: 1.0,
    metalness: 0.0,
    bumpScale: 0.05,
    pattern: 'none',
  },
  polished_concrete: {
    name: 'Polished Concrete',
    category: 'Flooring',
    color: 0xb0aca0,
    roughness: 0.2,
    metalness: 0.03,
    bumpScale: 0.05,
    pattern: 'concrete',
  },
  epoxy: {
    name: 'Epoxy Floor',
    category: 'Flooring',
    color: 0xa8a8a8,
    roughness: 0.1,
    metalness: 0.02,
    bumpScale: 0.02,
    pattern: 'none',
  },
};

// ── Procedural Texture Generator ──
export function generateProceduralTexture(pattern: string, color: number, size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const r = (color >> 16) & 255;
  const g = (color >> 8) & 255;
  const b = color & 255;

  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, size, size);

  switch (pattern) {
    case 'concrete': {
      for (let i = 0; i < 8000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const v = Math.random() * 30 - 15;
        ctx.fillStyle = `rgba(${r + v},${g + v},${b + v},0.6)`;
        ctx.fillRect(x, y, Math.random() * 3 + 1, Math.random() * 3 + 1);
      }
      for (let i = 0; i < 200; i++) {
        ctx.strokeStyle = `rgba(${r - 20},${g - 20},${b - 20},0.15)`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * size, Math.random() * size);
        ctx.lineTo(Math.random() * size, Math.random() * size);
        ctx.stroke();
      }
      break;
    }
    case 'brick': {
      const bw = 80, bh = 32, mortar = 4;
      ctx.fillStyle = `rgb(${r - 10},${g - 10},${b - 10})`;
      ctx.fillRect(0, 0, size, size);
      for (let row = 0; row < size / (bh + mortar); row++) {
        const offset = row % 2 === 0 ? 0 : bw / 2;
        for (let col = -1; col < size / (bw + mortar) + 1; col++) {
          const bx = col * (bw + mortar) + offset;
          const by = row * (bh + mortar);
          const vr = Math.random() * 30 - 15;
          ctx.fillStyle = `rgb(${r + vr},${g + vr * 0.5},${b + vr * 0.3})`;
          ctx.fillRect(bx, by, bw, bh);
          for (let s = 0; s < 40; s++) {
            ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.1})`;
            ctx.fillRect(bx + Math.random() * bw, by + Math.random() * bh, 2, 2);
          }
        }
      }
      break;
    }
    case 'wood': {
      for (let y = 0; y < size; y++) {
        const wave = Math.sin(y * 0.02) * 15;
        const v = Math.sin(y * 0.1 + wave) * 12;
        ctx.fillStyle = `rgb(${r + v},${g + v * 0.8},${b + v * 0.5})`;
        ctx.fillRect(0, y, size, 1);
      }
      for (let i = 0; i < 15; i++) {
        const y = Math.random() * size;
        ctx.strokeStyle = `rgba(${r - 30},${g - 30},${b - 20},0.25)`;
        ctx.lineWidth = Math.random() * 2 + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < size; x += 10) {
          ctx.lineTo(x, y + Math.sin(x * 0.01) * 4);
        }
        ctx.stroke();
      }
      break;
    }
    case 'tile': {
      const ts = 128, gap = 3;
      ctx.fillStyle = `rgb(${r - 30},${g - 30},${b - 30})`;
      ctx.fillRect(0, 0, size, size);
      for (let ty = 0; ty < size / ts; ty++) {
        for (let tx = 0; tx < size / ts; tx++) {
          const v = Math.random() * 8 - 4;
          ctx.fillStyle = `rgb(${r + v},${g + v},${b + v})`;
          ctx.fillRect(tx * ts + gap, ty * ts + gap, ts - gap * 2, ts - gap * 2);
        }
      }
      break;
    }
    case 'marble': {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x += 4) {
          const noise =
            Math.sin(x * 0.02 + Math.sin(y * 0.03) * 5) * 20 +
            Math.sin(y * 0.01 + x * 0.005) * 10;
          const v = Math.max(0, Math.min(255, r + noise));
          ctx.fillStyle = `rgb(${v},${v - 2},${v - 5})`;
          ctx.fillRect(x, y, 4, 1);
        }
      }
      break;
    }
    case 'granite': {
      for (let i = 0; i < 30000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const v = Math.random() * 60 - 30;
        const s = Math.random() * 4 + 1;
        ctx.fillStyle = `rgba(${r + v},${g + v},${b + v},0.7)`;
        ctx.fillRect(x, y, s, s);
      }
      break;
    }
    case 'brushed': {
      for (let y = 0; y < size; y++) {
        const v = Math.random() * 15 - 7;
        ctx.fillStyle = `rgb(${r + v},${g + v},${b + v})`;
        ctx.fillRect(0, y, size, 1);
      }
      break;
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// ── Normal Map Generator ──
export function generateNormalMap(pattern: string, size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'rgb(128,128,255)';
  ctx.fillRect(0, 0, size, size);

  switch (pattern) {
    case 'brick': {
      const bw = 80, bh = 32, mortar = 4;
      for (let row = 0; row < size / (bh + mortar); row++) {
        const offset = row % 2 === 0 ? 0 : bw / 2;
        for (let col = -1; col < size / (bw + mortar) + 1; col++) {
          const bx = col * (bw + mortar) + offset;
          const by = row * (bh + mortar);
          ctx.fillStyle = 'rgb(128,128,240)';
          ctx.fillRect(bx, by, bw, bh);
          ctx.strokeStyle = 'rgb(128,128,200)';
          ctx.strokeRect(bx, by, bw, bh);
        }
      }
      break;
    }
    case 'tile': {
      const ts = 128, gap = 3;
      for (let ty = 0; ty < size / ts; ty++) {
        for (let tx = 0; tx < size / ts; tx++) {
          ctx.fillStyle = 'rgb(128,128,245)';
          ctx.fillRect(tx * ts + gap, ty * ts + gap, ts - gap * 2, ts - gap * 2);
          ctx.strokeStyle = 'rgb(128,128,200)';
          ctx.strokeRect(tx * ts + gap, ty * ts + gap, ts - gap * 2, ts - gap * 2);
        }
      }
      break;
    }
    case 'wood': {
      for (let y = 0; y < size; y++) {
        const v = Math.sin(y * 0.1) * 10;
        ctx.fillStyle = `rgb(128,${128 + v},255)`;
        ctx.fillRect(0, y, size, 1);
      }
      break;
    }
    default: {
      for (let i = 0; i < 2000; i++) {
        const v = Math.random() * 20 - 10;
        ctx.fillStyle = `rgba(${128 + v},${128 + v},255,0.3)`;
        ctx.fillRect(
          Math.random() * size,
          Math.random() * size,
          Math.random() * 6,
          Math.random() * 6,
        );
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/**
 * Create a Three.js MeshStandardMaterial from a surface material definition,
 * with procedural diffuse texture and normal map.
 */
export function createSurfaceMaterial(matDef: SurfaceMaterial): THREE.MeshStandardMaterial {
  const props: THREE.MeshStandardMaterialParameters = {
    color: matDef.color,
    roughness: matDef.roughness,
    metalness: matDef.metalness,
    side: THREE.DoubleSide,
  };

  if (matDef.transparent) {
    props.transparent = true;
    props.opacity = matDef.opacity;
  }

  if (matDef.pattern !== 'none') {
    const diffuse = generateProceduralTexture(matDef.pattern, matDef.color);
    diffuse.repeat.set(4, 4);
    props.map = diffuse;

    const normal = generateNormalMap(matDef.pattern);
    normal.repeat.set(4, 4);
    props.normalMap = normal;
    props.normalScale = new THREE.Vector2(matDef.bumpScale, matDef.bumpScale);
  }

  if (matDef.pattern === 'none' && !matDef.transparent) {
    props.envMapIntensity = 0.3;
  }

  return new THREE.MeshStandardMaterial(props);
}

export interface MaterialPreset {
  name: string;
  // The reference color(s) to match against vertex colors
  matchColors: [number, number, number][];
  // PBR properties
  metalness: number;
  roughness: number;
  envMapIntensity: number;
  // Procedural texture pattern (concrete, brick, wood, tile, marble, granite, brushed, none)
  pattern?: string;
  // Optional physical material properties
  transmission?: number;
  thickness?: number;
  ior?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  opacity?: number;
  transparent?: boolean;
}

export const MATERIAL_PRESETS: MaterialPreset[] = [
  // Glass - detected by characteristic blue tint
  {
    name: 'glass',
    matchColors: [[0.7, 0.85, 0.95]],
    metalness: 0,
    roughness: 0.05,
    envMapIntensity: 1.0,
    transmission: 0.85,
    thickness: 0.5,
    ior: 1.5,
    opacity: 0.35,
    transparent: true,
  },
  // Metal / Gutters / Aluminum
  {
    name: 'metal',
    matchColors: [
      [0.7, 0.72, 0.74],
      [0.75, 0.75, 0.77],
      [0.75, 0.7, 0.55],
    ],
    metalness: 0.9,
    roughness: 0.3,
    envMapIntensity: 0.8,
    pattern: 'brushed',
  },
  // Stainless steel (appliances)
  {
    name: 'stainless',
    matchColors: [
      [0.85, 0.85, 0.87],
      [0.92, 0.92, 0.94],
    ],
    metalness: 0.6,
    roughness: 0.35,
    envMapIntensity: 0.7,
    pattern: 'brushed',
  },
  // Dark wood (mahogany, walnut)
  {
    name: 'dark_wood',
    matchColors: [
      [0.4, 0.25, 0.12],
    ],
    metalness: 0.0,
    roughness: 0.65,
    envMapIntensity: 0.3,
    clearcoat: 0.3,
    clearcoatRoughness: 0.4,
    pattern: 'wood',
  },
  // Wood (oak, walnut, general)
  {
    name: 'wood',
    matchColors: [
      [0.55, 0.35, 0.17],
      [0.45, 0.3, 0.15],
      [0.5, 0.35, 0.2],
      [0.6, 0.45, 0.28],
    ],
    metalness: 0.0,
    roughness: 0.7,
    envMapIntensity: 0.25,
    clearcoat: 0.15,
    clearcoatRoughness: 0.5,
    pattern: 'wood',
  },
  // Brick
  {
    name: 'brick',
    matchColors: [
      [0.72, 0.4, 0.3],
    ],
    metalness: 0.0,
    roughness: 0.9,
    envMapIntensity: 0.15,
    pattern: 'brick',
  },
  // Roof shingles (dark)
  {
    name: 'shingle',
    matchColors: [
      [0.35, 0.25, 0.2],
    ],
    metalness: 0.0,
    roughness: 0.95,
    envMapIntensity: 0.1,
    pattern: 'granite',
  },
  // Terracotta roof tile
  {
    name: 'terracotta',
    matchColors: [
      [0.5, 0.15, 0.15],
    ],
    metalness: 0.0,
    roughness: 0.75,
    envMapIntensity: 0.2,
    pattern: 'tile',
  },
  // Concrete / Foundation
  {
    name: 'concrete',
    matchColors: [
      [0.6, 0.58, 0.55],
      [0.65, 0.63, 0.6],
      [0.55, 0.55, 0.55],
    ],
    metalness: 0.0,
    roughness: 0.92,
    envMapIntensity: 0.1,
    pattern: 'concrete',
  },
  // White paint / Trim
  {
    name: 'white_paint',
    matchColors: [
      [0.95, 0.95, 0.93],
      [0.92, 0.9, 0.88],
    ],
    metalness: 0.0,
    roughness: 0.4,
    envMapIntensity: 0.3,
    clearcoat: 0.2,
    clearcoatRoughness: 0.3,
  },
  // Stucco / Cream walls
  {
    name: 'stucco',
    matchColors: [
      [0.91, 0.88, 0.82],
      [0.82, 0.78, 0.72],
      [0.85, 0.87, 0.9],
    ],
    metalness: 0.0,
    roughness: 0.85,
    envMapIntensity: 0.15,
    pattern: 'concrete',
  },
  // Porcelain (bathroom fixtures)
  {
    name: 'porcelain',
    matchColors: [
      [0.95, 0.95, 0.97],
      [0.9, 0.9, 0.92],
    ],
    metalness: 0.05,
    roughness: 0.15,
    envMapIntensity: 0.5,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
    pattern: 'tile',
  },
  // Fabric / Upholstery
  {
    name: 'fabric',
    matchColors: [
      [0.5, 0.35, 0.3],
    ],
    metalness: 0.0,
    roughness: 0.95,
    envMapIntensity: 0.05,
  },
  // Mattress / Soft white
  {
    name: 'soft_white',
    matchColors: [
      [0.9, 0.88, 0.85],
    ],
    metalness: 0.0,
    roughness: 0.9,
    envMapIntensity: 0.05,
  },
  // Soil / Dark earth
  {
    name: 'soil',
    matchColors: [
      [0.35, 0.25, 0.15],
    ],
    metalness: 0.0,
    roughness: 1.0,
    envMapIntensity: 0.0,
  },
  // Vegetation / Green
  {
    name: 'vegetation',
    matchColors: [
      [0.25, 0.5, 0.2],
      [0.2, 0.45, 0.15],
      [0.22, 0.42, 0.18],
      [0.4, 0.6, 0.3],  // lighter green
    ],
    metalness: 0.0,
    roughness: 0.85,
    envMapIntensity: 0.1,
  },
  // Dark (oven door, dark aluminum frames)
  {
    name: 'dark_surface',
    matchColors: [
      [0.15, 0.15, 0.15],
      [0.2, 0.2, 0.2],
      [0.3, 0.3, 0.32],
      [0.4, 0.4, 0.42],
    ],
    metalness: 0.3,
    roughness: 0.5,
    envMapIntensity: 0.4,
  },
  // Warm light (lamp shades)
  {
    name: 'lamp_shade',
    matchColors: [
      [0.95, 0.93, 0.88],
    ],
    metalness: 0.0,
    roughness: 0.6,
    envMapIntensity: 0.2,
  },
  // Concrete walkway/driveway (lighter)
  {
    name: 'concrete_light',
    matchColors: [
      [0.65, 0.63, 0.6],
      [0.7, 0.68, 0.65],
    ],
    metalness: 0.0,
    roughness: 0.88,
    envMapIntensity: 0.1,
    pattern: 'concrete',
  },
  // Granite/dark countertop
  {
    name: 'granite',
    matchColors: [
      [0.3, 0.28, 0.26],
    ],
    metalness: 0.05,
    roughness: 0.3,
    envMapIntensity: 0.4,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
    pattern: 'granite',
  },
  // Metal roof
  {
    name: 'metal_roof',
    matchColors: [
      [0.4, 0.42, 0.44],
    ],
    metalness: 0.7,
    roughness: 0.4,
    envMapIntensity: 0.5,
    pattern: 'brushed',
  },
  // Slate roof
  {
    name: 'slate',
    matchColors: [
      [0.35, 0.35, 0.38],
    ],
    metalness: 0.05,
    roughness: 0.75,
    envMapIntensity: 0.15,
  },
];

/**
 * Calculate Euclidean distance between two RGB colors (0-1 range).
 */
function colorDistance(
  a: [number, number, number],
  b: [number, number, number],
): number {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2,
  );
}

/**
 * Find the closest material preset for a given vertex color.
 * Returns the preset and a distance score.
 */
export function findMaterialForColor(
  r: number,
  g: number,
  b: number,
): { preset: MaterialPreset; distance: number } {
  let bestPreset = MATERIAL_PRESETS[0];
  let bestDistance = Infinity;

  for (const preset of MATERIAL_PRESETS) {
    for (const matchColor of preset.matchColors) {
      const dist = colorDistance([r, g, b], matchColor);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestPreset = preset;
      }
    }
  }

  return { preset: bestPreset, distance: bestDistance };
}

/**
 * Create a Three.js MeshPhysicalMaterial from a preset and a vertex color.
 */
export function createPBRMaterial(
  preset: MaterialPreset,
  color: THREE.Color,
): THREE.MeshPhysicalMaterial {
  const mat = new THREE.MeshPhysicalMaterial({
    color,
    metalness: preset.metalness,
    roughness: preset.roughness,
    envMapIntensity: preset.envMapIntensity,
    side: THREE.DoubleSide,
  });

  // Add procedural texture if the preset has a pattern
  if (preset.pattern && preset.pattern !== 'none') {
    const hexColor = color.getHex();
    const diffuse = generateProceduralTexture(preset.pattern, hexColor);
    diffuse.repeat.set(3, 3);
    mat.map = diffuse;

    const normal = generateNormalMap(preset.pattern);
    normal.repeat.set(3, 3);
    mat.normalMap = normal;
    mat.normalScale = new THREE.Vector2(0.3, 0.3);
  }

  if (preset.transmission !== undefined) {
    mat.transmission = preset.transmission;
    mat.transparent = true;
  }
  if (preset.thickness !== undefined) {
    mat.thickness = preset.thickness;
  }
  if (preset.ior !== undefined) {
    mat.ior = preset.ior;
  }
  if (preset.clearcoat !== undefined) {
    mat.clearcoat = preset.clearcoat;
  }
  if (preset.clearcoatRoughness !== undefined) {
    mat.clearcoatRoughness = preset.clearcoatRoughness;
  }
  if (preset.opacity !== undefined) {
    mat.opacity = preset.opacity;
    mat.transparent = true;
  }
  if (preset.transparent !== undefined) {
    mat.transparent = preset.transparent;
  }

  return mat;
}

/**
 * A color key string for grouping faces by their vertex color.
 * Quantizes to avoid floating point grouping issues.
 */
export function colorKey(r: number, g: number, b: number): string {
  // Quantize to nearest 0.02 to group similar colors
  const qr = Math.round(r * 50) / 50;
  const qg = Math.round(g * 50) / 50;
  const qb = Math.round(b * 50) / 50;
  return `${qr},${qg},${qb}`;
}

export interface ColorGroup {
  color: THREE.Color;
  r: number;
  g: number;
  b: number;
  indices: number[]; // face indices (triangle index, not vertex index)
  preset: MaterialPreset;
}

// ── Component-based geometry zone types ──
// These are the heuristic zone types (used as fallback when AI doesn't tag components)
export type GeometryZone = 'roof' | 'walls' | 'windows' | 'doors' | 'floor' | 'trim' | 'vegetation' | 'furniture';

/**
 * Get the default material for an AI-tagged component based on its name.
 */
export function getDefaultMaterialForComponent(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('wall')) return 'stucco';
  if (lower.includes('roof') || lower.includes('shingle')) return 'shingle_asphalt';
  if (lower.includes('garage')) return 'paint_white';
  if (lower.includes('door')) return 'wood_oak';
  if (lower.includes('window')) return 'glass';
  if (lower.includes('foundation') || lower.includes('slab')) return 'concrete';
  if (lower.includes('floor')) return 'hardwood_floor';
  if (lower.includes('trim') || lower.includes('gutter') || lower.includes('accent')) return 'paint_white';
  if (lower.includes('tree') || lower.includes('bush') || lower.includes('plant') || lower.includes('garden')) return 'wood_pine';
  // Furniture — specific items first, then generic fallback
  if (lower.includes('sofa') || lower.includes('couch')) return 'fabric_charcoal';
  if (lower.includes('armchair') || lower.includes('lounge_chair')) return 'leather_brown';
  if (lower.includes('dining_chair') || lower.includes('chair')) return 'wood_walnut';
  if (lower.includes('dining_table') || lower.includes('table')) return 'wood_walnut';
  if (lower.includes('desk')) return 'wood_oak';
  if (lower.includes('bookshelf') || lower.includes('bookcase') || lower.includes('shelf')) return 'wood_oak';
  if (lower.includes('bed') || lower.includes('mattress')) return 'fabric_beige';
  if (lower.includes('dresser') || lower.includes('nightstand') || lower.includes('wardrobe') || lower.includes('closet')) return 'wood_cherry';
  if (lower.includes('tv') || lower.includes('television') || lower.includes('monitor') || lower.includes('screen')) return 'black_steel';
  if (lower.includes('lamp') || lower.includes('light') || lower.includes('chandelier') || lower.includes('sconce')) return 'brushed_nickel';
  if (lower.includes('rug') || lower.includes('carpet')) return 'fabric_beige';
  if (lower.includes('curtain') || lower.includes('drape')) return 'fabric_cream';
  if (lower.includes('pillow') || lower.includes('cushion')) return 'fabric_cream';
  if (lower.includes('furniture')) return 'wood_walnut';

  // Kitchen & bath
  if (lower.includes('cabinet')) return 'wood_maple';
  if (lower.includes('countertop') || lower.includes('counter')) return 'granite_dark';
  if (lower.includes('kitchen')) return 'granite_dark';
  if (lower.includes('sink') || lower.includes('faucet')) return 'stainless_steel';
  if (lower.includes('appliance') || lower.includes('fridge') || lower.includes('refrigerator') || lower.includes('oven') || lower.includes('stove') || lower.includes('dishwasher')) return 'stainless_steel';
  if (lower.includes('bath') || lower.includes('shower') || lower.includes('toilet') || lower.includes('tub')) return 'tile_white';

  // Exterior structures
  if (lower.includes('porch') || lower.includes('deck') || lower.includes('patio')) return 'wood_cedar';
  if (lower.includes('step') || lower.includes('stair')) return 'concrete';
  if (lower.includes('chimney') || lower.includes('fireplace')) return 'brick';
  if (lower.includes('fence') || lower.includes('railing')) return 'wrought_iron';
  if (lower.includes('column') || lower.includes('pillar')) return 'limestone';
  if (lower.includes('pool')) return 'tile_mosaic';
  if (lower.includes('driveway') || lower.includes('walkway') || lower.includes('path') || lower.includes('sidewalk')) return 'concrete_smooth';
  if (lower.includes('siding')) return 'vinyl_siding';
  return 'concrete';
}

/**
 * Get a human-readable label for a component name.
 */
export function getComponentLabel(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Get a unicode icon for a component name.
 */
export function getComponentIcon(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('roof')) return '\u2302';
  if (lower.includes('wall')) return '\u25A1';
  if (lower.includes('window')) return '\u25A3';
  if (lower.includes('door')) return '\u25AF';
  if (lower.includes('floor') || lower.includes('foundation')) return '\u2582';
  if (lower.includes('trim') || lower.includes('gutter')) return '\u2500';
  if (lower.includes('tree') || lower.includes('bush') || lower.includes('plant')) return '\u2618';
  if (lower.includes('furniture') || lower.includes('chair') || lower.includes('table')) return '\u2616';
  if (lower.includes('kitchen')) return '\u2616';
  if (lower.includes('porch') || lower.includes('deck') || lower.includes('step')) return '\u2582';
  if (lower.includes('chimney')) return '\u25AE';
  if (lower.includes('fence') || lower.includes('railing')) return '\u2500';
  return '\u25A0';
}

export interface NormalGroup {
  zone: GeometryZone;
  indices: number[];
  defaultMaterial: string; // key into SURFACE_MATERIALS
}

// Default material assignments for each zone
export const ZONE_DEFAULTS: Record<GeometryZone, string> = {
  roof: 'granite',
  walls: 'brick',
  windows: 'glass',
  doors: 'wood_oak',
  floor: 'concrete',
  trim: 'aluminum',
  vegetation: 'wood_oak',
  furniture: 'wood_oak',
};

export const ZONE_LABELS: Record<GeometryZone, string> = {
  roof: 'Roof',
  walls: 'Walls',
  windows: 'Windows',
  doors: 'Doors',
  floor: 'Foundation',
  trim: 'Trim / Accents',
  vegetation: 'Vegetation',
  furniture: 'Furniture',
};

// ── Connected-component geometry analysis ──

interface ComponentInfo {
  indices: number[];
  avgNormalZ: number;
  avgZ: number;
  bboxMin: THREE.Vector3;
  bboxMax: THREE.Vector3;
  volume: number;       // bbox volume
  faceCount: number;
  isVertical: boolean;  // predominantly vertical faces
  isUpward: boolean;    // predominantly upward faces
  isDownward: boolean;  // predominantly downward faces
}

/**
 * Build a face adjacency graph by finding shared edges, then find
 * connected components via BFS. Classify each component by its
 * normals, size, and position to assign material zones.
 *
 * This separates windows, trim, vegetation, furniture, etc. from walls
 * because they're typically distinct geometric objects in the STL.
 */
export function splitGeometryByComponents(
  geometry: THREE.BufferGeometry,
): NormalGroup[] {
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();

  const pos = geometry.attributes.position;
  const norm = geometry.attributes.normal;
  if (!norm) return [];

  const faceCount = pos.count / 3;
  if (faceCount === 0) return [];

  const modelBbox = geometry.boundingBox!;
  const modelHeight = modelBbox.max.z - modelBbox.min.z;
  const modelWidth = modelBbox.max.x - modelBbox.min.x;
  const modelDepth = modelBbox.max.y - modelBbox.min.y;
  const modelVolume = modelWidth * modelDepth * modelHeight;

  // ── Step 1: Build edge→face adjacency via spatial vertex hashing ──
  const EPSILON = 0.01;
  const hashVertex = (x: number, y: number, z: number) => {
    const qx = Math.round(x / EPSILON);
    const qy = Math.round(y / EPSILON);
    const qz = Math.round(z / EPSILON);
    return `${qx},${qy},${qz}`;
  };

  // Map edge (pair of vertex hashes) → list of face indices
  const edgeFaces = new Map<string, number[]>();
  for (let f = 0; f < faceCount; f++) {
    for (let e = 0; e < 3; e++) {
      const v1 = f * 3 + e;
      const v2 = f * 3 + ((e + 1) % 3);
      const h1 = hashVertex(pos.getX(v1), pos.getY(v1), pos.getZ(v1));
      const h2 = hashVertex(pos.getX(v2), pos.getY(v2), pos.getZ(v2));
      const edgeKey = h1 < h2 ? `${h1}|${h2}` : `${h2}|${h1}`;
      let list = edgeFaces.get(edgeKey);
      if (!list) { list = []; edgeFaces.set(edgeKey, list); }
      list.push(f);
    }
  }

  // Build per-face adjacency list
  const faceAdj: number[][] = new Array(faceCount);
  for (let i = 0; i < faceCount; i++) faceAdj[i] = [];
  for (const faces of edgeFaces.values()) {
    for (let i = 0; i < faces.length; i++) {
      for (let j = i + 1; j < faces.length; j++) {
        faceAdj[faces[i]].push(faces[j]);
        faceAdj[faces[j]].push(faces[i]);
      }
    }
  }

  // ── Step 2: BFS to find connected components ──
  const visited = new Uint8Array(faceCount);
  const components: ComponentInfo[] = [];

  for (let startFace = 0; startFace < faceCount; startFace++) {
    if (visited[startFace]) continue;

    const queue = [startFace];
    visited[startFace] = 1;
    const indices: number[] = [];
    let sumNz = 0, sumZ = 0;
    const bMin = new THREE.Vector3(Infinity, Infinity, Infinity);
    const bMax = new THREE.Vector3(-Infinity, -Infinity, -Infinity);

    let head = 0;
    while (head < queue.length) {
      const f = queue[head++];
      indices.push(f);

      // Accumulate stats
      let faceNz = 0, faceZ = 0;
      for (let v = 0; v < 3; v++) {
        const i = f * 3 + v;
        const px = pos.getX(i), py = pos.getY(i), pz = pos.getZ(i);
        faceNz += norm.getZ(i);
        faceZ += pz;
        bMin.x = Math.min(bMin.x, px); bMin.y = Math.min(bMin.y, py); bMin.z = Math.min(bMin.z, pz);
        bMax.x = Math.max(bMax.x, px); bMax.y = Math.max(bMax.y, py); bMax.z = Math.max(bMax.z, pz);
      }
      sumNz += faceNz / 3;
      sumZ += faceZ / 3;

      for (const adj of faceAdj[f]) {
        if (!visited[adj]) {
          visited[adj] = 1;
          queue.push(adj);
        }
      }
    }

    const n = indices.length;
    const avgNz = sumNz / n;
    const avgZ = sumZ / n;
    const vol = (bMax.x - bMin.x) * (bMax.y - bMin.y) * (bMax.z - bMin.z);

    components.push({
      indices,
      avgNormalZ: avgNz,
      avgZ,
      bboxMin: bMin,
      bboxMax: bMax,
      volume: vol,
      faceCount: n,
      isVertical: Math.abs(avgNz) < 0.4,
      isUpward: avgNz > 0.4,
      isDownward: avgNz < -0.4,
    });
  }

  // ── Step 3: Classify each connected component ──
  const midZ = modelBbox.min.z + modelHeight * 0.35;
  // Volume threshold: components smaller than 2% of model are "small"
  const smallVolThreshold = modelVolume * 0.02;
  // Face count threshold for tiny parts
  const tinyFaceThreshold = Math.max(6, faceCount * 0.005);
  // The largest component(s) are likely the main structure (walls/roof)
  const sortedBySize = [...components].sort((a, b) => b.faceCount - a.faceCount);
  const largestFaceCount = sortedBySize[0]?.faceCount ?? 0;

  const zoneMap: Record<GeometryZone, number[]> = {
    roof: [], walls: [], windows: [], doors: [], floor: [], trim: [], vegetation: [], furniture: [],
  };

  for (const comp of components) {
    if (comp.faceCount < 3) continue; // skip degenerate

    const compHeight = comp.bboxMax.z - comp.bboxMin.z;
    const compWidth = comp.bboxMax.x - comp.bboxMin.x;
    const compDepth = comp.bboxMax.y - comp.bboxMin.y;
    const isSmall = comp.volume < smallVolThreshold;
    const isTiny = comp.faceCount < tinyFaceThreshold;
    const isLarge = comp.faceCount > largestFaceCount * 0.15;
    const isInUpperHalf = comp.avgZ > midZ;
    const minDim = Math.min(compWidth, compDepth);
    const isThin = minDim < modelWidth * 0.05;
    // Doors typically touch the ground and are tall
    const touchesGround = comp.bboxMin.z < modelBbox.min.z + modelHeight * 0.1;
    // Door-like aspect: taller than wide
    const isDoorLike = compHeight > Math.max(compWidth, compDepth) * 0.8 && touchesGround;

    let zone: GeometryZone;

    if (comp.isUpward && isInUpperHalf && isLarge) {
      // Large upward-facing in upper portion → roof
      zone = 'roof';
    } else if (comp.isDownward && !isInUpperHalf) {
      // Downward-facing in lower area → foundation
      zone = 'floor';
    } else if (comp.isVertical && isLarge) {
      // Large vertical → walls
      zone = 'walls';
    } else if (comp.isVertical && isSmall && !isTiny && isDoorLike) {
      // Small vertical, touches ground, taller than wide → door
      zone = 'doors';
    } else if (comp.isVertical && isSmall && !isTiny && isThin) {
      // Small, thin vertical → window glass
      zone = 'windows';
    } else if (comp.isVertical && isSmall && !isTiny) {
      // Other small vertical components → windows by default
      zone = 'windows';
    } else if (isTiny && comp.isVertical) {
      // Tiny vertical pieces → trim, gutters, window frames
      zone = 'trim';
    } else if (isSmall && compHeight > compWidth * 1.5 && compHeight > compDepth * 1.5) {
      // Tall narrow objects → trees/vegetation
      zone = 'vegetation';
    } else if (isSmall && !comp.isUpward && !comp.isDownward) {
      // Small interior objects → furniture
      zone = 'furniture';
    } else if (comp.isUpward && isSmall) {
      // Small upward surfaces → steps, porch, countertops
      zone = 'floor';
    } else if (comp.isUpward && isInUpperHalf) {
      zone = 'roof';
    } else if (comp.isDownward) {
      zone = 'floor';
    } else {
      zone = 'walls';
    }

    zoneMap[zone].push(...comp.indices);
  }

  // ── Step 4: Build result, only include non-empty zones ──
  const groups: NormalGroup[] = [];
  for (const zone of Object.keys(ZONE_DEFAULTS) as GeometryZone[]) {
    if (zoneMap[zone].length > 0) {
      groups.push({
        zone,
        indices: zoneMap[zone],
        defaultMaterial: ZONE_DEFAULTS[zone],
      });
    }
  }

  return groups;
}

/**
 * Split a BufferGeometry into groups by vertex color.
 * Returns an array of ColorGroups, each with their face indices and matched material.
 */
export function groupFacesByColor(geometry: THREE.BufferGeometry): ColorGroup[] {
  const colorAttr = geometry.attributes.color;
  if (!colorAttr) return [];

  const positionAttr = geometry.attributes.position;
  const faceCount = positionAttr.count / 3;
  const groups = new Map<string, ColorGroup>();

  for (let face = 0; face < faceCount; face++) {
    // Use the first vertex of the face as the representative color
    const vi = face * 3;
    const r = colorAttr.getX(vi);
    const g = colorAttr.getY(vi);
    const b = colorAttr.getZ(vi);

    const key = colorKey(r, g, b);

    if (!groups.has(key)) {
      const { preset } = findMaterialForColor(r, g, b);
      groups.set(key, {
        color: new THREE.Color(r, g, b),
        r,
        g,
        b,
        indices: [],
        preset,
      });
    }

    groups.get(key)!.indices.push(face);
  }

  return Array.from(groups.values());
}

/**
 * Create a new BufferGeometry containing only the specified face indices
 * from the source geometry.
 */
export function extractFaces(
  source: THREE.BufferGeometry,
  faceIndices: number[],
): THREE.BufferGeometry {
  const srcPos = source.attributes.position;
  const srcNorm = source.attributes.normal;

  const vertexCount = faceIndices.length * 3;
  const positions = new Float32Array(vertexCount * 3);
  const normals = srcNorm ? new Float32Array(vertexCount * 3) : undefined;

  for (let i = 0; i < faceIndices.length; i++) {
    const face = faceIndices[i];
    for (let v = 0; v < 3; v++) {
      const srcIdx = face * 3 + v;
      const dstIdx = i * 3 + v;

      positions[dstIdx * 3] = srcPos.getX(srcIdx);
      positions[dstIdx * 3 + 1] = srcPos.getY(srcIdx);
      positions[dstIdx * 3 + 2] = srcPos.getZ(srcIdx);

      if (normals && srcNorm) {
        normals[dstIdx * 3] = srcNorm.getX(srcIdx);
        normals[dstIdx * 3 + 1] = srcNorm.getY(srcIdx);
        normals[dstIdx * 3 + 2] = srcNorm.getZ(srcIdx);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  if (normals) {
    geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  }

  // Generate triplanar UVs so textures map correctly
  generateTriplanarUVs(geo);

  return geo;
}

/**
 * Generate triplanar UVs based on face normals.
 * Projects each face from the dominant axis direction for seamless texture mapping.
 * Scale factor controls texture tiling relative to world units.
 */
export function generateTriplanarUVs(geometry: THREE.BufferGeometry, scale = 0.1): void {
  const pos = geometry.attributes.position;
  geometry.computeVertexNormals();
  const norm = geometry.attributes.normal;
  if (!norm) return;

  const uvs = new Float32Array(pos.count * 2);

  for (let face = 0; face < pos.count / 3; face++) {
    // Compute face normal from average of vertex normals
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
        // Face mostly faces X axis — project onto YZ
        u = z * scale;
        vv = y * scale;
      } else if (ny >= nx && ny >= nz) {
        // Face mostly faces Y axis — project onto XZ
        u = x * scale;
        vv = z * scale;
      } else {
        // Face mostly faces Z axis — project onto XY
        u = x * scale;
        vv = y * scale;
      }

      uvs[i * 2] = u;
      uvs[i * 2 + 1] = vv;
    }
  }

  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
}
