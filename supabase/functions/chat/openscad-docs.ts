// OpenSCAD function documentation for the AI to reference
// Loaded via the hidden get_openscad_docs tool

export interface OpenSCADDoc {
  id: string;
  category: string;
  signature: string;
  parameters: { name: string; type: string; description: string }[];
  description: string;
  examples: string[];
}

export const openscadDocs: OpenSCADDoc[] = [
  {
    id: 'cube',
    category: '3D Primitives',
    signature: 'cube(size, center)',
    parameters: [
      {
        name: 'size',
        type: 'number or [x,y,z]',
        description: 'Single value for cube, or [x,y,z] for rectangular box',
      },
      {
        name: 'center',
        type: 'boolean',
        description: 'If true, centers the cube on origin. Default: false',
      },
    ],
    description:
      'Creates a cube or rectangular box. When size is a single number, creates a cube. When size is [x,y,z], creates a box with those dimensions.',
    examples: [
      'cube(10);',
      'cube([20, 30, 10]);',
      'cube([10, 10, 5], center=true);',
    ],
  },
  {
    id: 'sphere',
    category: '3D Primitives',
    signature: 'sphere(r, d)',
    parameters: [
      { name: 'r', type: 'number', description: 'Radius of sphere' },
      {
        name: 'd',
        type: 'number',
        description: 'Diameter of sphere (alternative to r)',
      },
    ],
    description:
      'Creates a sphere centered at the origin. Use $fn, $fa, or $fs to control resolution.',
    examples: ['sphere(r=10);', 'sphere(d=20, $fn=64);'],
  },
  {
    id: 'cylinder',
    category: '3D Primitives',
    signature: 'cylinder(h, r, r1, r2, d, d1, d2, center)',
    parameters: [
      { name: 'h', type: 'number', description: 'Height of cylinder' },
      {
        name: 'r',
        type: 'number',
        description: 'Radius (for uniform cylinder)',
      },
      { name: 'r1', type: 'number', description: 'Bottom radius (for cone)' },
      { name: 'r2', type: 'number', description: 'Top radius (for cone)' },
      { name: 'd', type: 'number', description: 'Diameter (alternative to r)' },
      {
        name: 'center',
        type: 'boolean',
        description: 'If true, centers on Z axis. Default: false',
      },
    ],
    description:
      'Creates a cylinder or cone. Use r1/r2 for cones. Use $fn to control sides (e.g., $fn=6 for hexagon).',
    examples: [
      'cylinder(h=20, r=10);',
      'cylinder(h=15, r1=10, r2=5);',
      'cylinder(h=10, d=20, $fn=6);',
    ],
  },
  {
    id: 'translate',
    category: 'Transformations',
    signature: 'translate(v)',
    parameters: [
      { name: 'v', type: '[x,y,z]', description: 'Translation vector' },
    ],
    description: 'Moves child objects by the specified vector.',
    examples: ['translate([10, 0, 5]) cube(10);'],
  },
  {
    id: 'rotate',
    category: 'Transformations',
    signature: 'rotate(a, v)',
    parameters: [
      {
        name: 'a',
        type: 'number or [x,y,z]',
        description:
          'Angle(s) in degrees. Single value rotates around Z, or [x,y,z] for each axis',
      },
      {
        name: 'v',
        type: '[x,y,z]',
        description: 'Optional axis vector for single-angle rotation',
      },
    ],
    description:
      'Rotates child objects. When a is [x,y,z], rotations applied in order: X, then Y, then Z.',
    examples: [
      'rotate([0, 0, 45]) cube(10);',
      'rotate([90, 0, 45]) cylinder(h=10, r=5);',
    ],
  },
  {
    id: 'scale',
    category: 'Transformations',
    signature: 'scale(v)',
    parameters: [
      {
        name: 'v',
        type: 'number or [x,y,z]',
        description: 'Scale factor(s). Single value scales uniformly.',
      },
    ],
    description:
      'Scales child objects. Use [x,y,z] for non-uniform scaling. Negative values mirror.',
    examples: ['scale(2) sphere(5);', 'scale([1, 2, 0.5]) cube(10);'],
  },
  {
    id: 'mirror',
    category: 'Transformations',
    signature: 'mirror(v)',
    parameters: [
      {
        name: 'v',
        type: '[x,y,z]',
        description: 'Normal vector of mirror plane through origin',
      },
    ],
    description: 'Mirrors child objects across a plane through the origin.',
    examples: ['mirror([1, 0, 0]) cube([10, 20, 5]);'],
  },
  {
    id: 'union',
    category: 'Boolean Operations',
    signature: 'union()',
    parameters: [],
    description:
      'Combines multiple objects into one. Default behavior when objects placed together, but explicit union() needed inside difference().',
    examples: ['union() { cube(10); translate([5, 5, 5]) sphere(8); }'],
  },
  {
    id: 'difference',
    category: 'Boolean Operations',
    signature: 'difference()',
    parameters: [],
    description:
      'Subtracts all subsequent children from the first child. First object is base, all others cut away.',
    examples: ['difference() { cube(20, center=true); sphere(13); }'],
  },
  {
    id: 'intersection',
    category: 'Boolean Operations',
    signature: 'intersection()',
    parameters: [],
    description:
      'Creates geometry where all children overlap. Only common volume remains.',
    examples: ['intersection() { cube(15, center=true); sphere(10); }'],
  },
  {
    id: 'linear_extrude',
    category: 'Extrusion',
    signature: 'linear_extrude(height, center, twist, slices, scale)',
    parameters: [
      { name: 'height', type: 'number', description: 'Extrusion height' },
      {
        name: 'center',
        type: 'boolean',
        description: 'If true, centers on z=0',
      },
      {
        name: 'twist',
        type: 'number',
        description: 'Degrees to twist over height',
      },
      {
        name: 'slices',
        type: 'number',
        description: 'Number of slices for twist',
      },
      {
        name: 'scale',
        type: 'number or [x,y]',
        description: 'Scale factor at top',
      },
    ],
    description:
      'Extrudes a 2D shape along Z axis. Can twist and scale during extrusion.',
    examples: [
      'linear_extrude(height=20) circle(10);',
      'linear_extrude(height=30, twist=90) square(10, center=true);',
    ],
  },
  {
    id: 'rotate_extrude',
    category: 'Extrusion',
    signature: 'rotate_extrude(angle)',
    parameters: [
      {
        name: 'angle',
        type: 'number',
        description: 'Degrees to rotate (default 360)',
      },
    ],
    description:
      'Rotates a 2D shape around Z axis for solids of revolution. 2D shape must be in positive X half-plane.',
    examples: ['rotate_extrude() translate([10, 0]) circle(3);'],
  },
  {
    id: 'hull',
    category: 'Boolean Operations',
    signature: 'hull()',
    parameters: [],
    description:
      'Creates convex hull of all children - smallest convex shape containing all. Great for rounded shapes.',
    examples: ['hull() { cube(10); translate([20, 0, 0]) cube(10); }'],
  },
  {
    id: 'minkowski',
    category: 'Boolean Operations',
    signature: 'minkowski()',
    parameters: [],
    description:
      "Minkowski sum of children. Used to add rounded edges by 'rolling' a sphere around object. Very slow.",
    examples: ['minkowski() { cube(10); sphere(2); }'],
  },
  {
    id: 'circle',
    category: '2D Primitives',
    signature: 'circle(r, d)',
    parameters: [
      { name: 'r', type: 'number', description: 'Radius' },
      { name: 'd', type: 'number', description: 'Diameter (alternative to r)' },
    ],
    description:
      'Creates a 2D circle. Use $fn to control resolution or create regular polygons.',
    examples: ['circle(r=10);', 'circle(d=20, $fn=6);'],
  },
  {
    id: 'square',
    category: '2D Primitives',
    signature: 'square(size, center)',
    parameters: [
      {
        name: 'size',
        type: 'number or [x,y]',
        description: 'Single value for square, or [x,y] for rectangle',
      },
      {
        name: 'center',
        type: 'boolean',
        description: 'If true, centers on origin',
      },
    ],
    description: 'Creates a 2D square or rectangle.',
    examples: ['square(10);', 'square([20, 10], center=true);'],
  },
  {
    id: 'polygon',
    category: '2D Primitives',
    signature: 'polygon(points, paths)',
    parameters: [
      { name: 'points', type: 'array', description: 'Array of [x,y] vertices' },
      {
        name: 'paths',
        type: 'array',
        description: 'Optional array of paths for holes',
      },
    ],
    description:
      'Creates a 2D polygon from points. Use paths for polygons with holes.',
    examples: ['polygon([[0,0], [10,0], [5,10]]);'],
  },
  {
    id: 'text',
    category: '2D Primitives',
    signature: 'text(text, size, font, halign, valign)',
    parameters: [
      { name: 'text', type: 'string', description: 'The text to render' },
      { name: 'size', type: 'number', description: 'Font size' },
      { name: 'halign', type: 'string', description: 'left, center, right' },
      {
        name: 'valign',
        type: 'string',
        description: 'top, center, baseline, bottom',
      },
    ],
    description: 'Creates 2D text. Extrude with linear_extrude() for 3D text.',
    examples: [
      'linear_extrude(height=3) text("Hello", size=10, halign="center");',
    ],
  },
  {
    id: 'import',
    category: 'Import',
    signature: 'import(file)',
    parameters: [
      {
        name: 'file',
        type: 'string',
        description: 'Path to file (STL, DXF, SVG)',
      },
    ],
    description: 'Imports external geometry. STL for 3D, DXF/SVG for 2D.',
    examples: [
      'import("model.stl");',
      'linear_extrude(5) import("outline.dxf");',
    ],
  },
  {
    id: 'module',
    category: 'User Defined',
    signature: 'module name(params) { ... }',
    parameters: [],
    description:
      'Defines reusable geometry. Use children() inside to access passed objects.',
    examples: ['module box(w,h,d) { cube([w,h,d]); }\\nbox(10, 20, 5);'],
  },
  {
    id: 'function',
    category: 'User Defined',
    signature: 'function name(params) = expression;',
    parameters: [],
    description: 'Defines a function returning a value. Use for calculations.',
    examples: ['function double(x) = x * 2;'],
  },
  {
    id: 'for',
    category: 'Control Flow',
    signature: 'for (var = range) { ... }',
    parameters: [],
    description:
      'Creates multiple copies. For creates implicit union of all iterations.',
    examples: ['for (i = [0:5]) translate([i*10, 0, 0]) cube(5);'],
  },
  {
    id: 'if',
    category: 'Control Flow',
    signature: 'if (condition) { ... }',
    parameters: [],
    description: 'Conditional geometry creation.',
    examples: ['if (use_sphere) sphere(10); else cube(15, center=true);'],
  },
  {
    id: 'color',
    category: 'Display',
    signature: 'color(c, alpha)',
    parameters: [
      {
        name: 'c',
        type: 'string or [r,g,b]',
        description: 'Color name or RGB 0-1',
      },
      { name: 'alpha', type: 'number', description: 'Opacity 0-1' },
    ],
    description: 'Sets display color. Does not affect STL export.',
    examples: ['color("red") cube(10);'],
  },
  {
    id: 'offset',
    category: '2D Operations',
    signature: 'offset(r, delta)',
    parameters: [
      { name: 'r', type: 'number', description: 'Radius for rounded offset' },
      {
        name: 'delta',
        type: 'number',
        description: 'Distance for sharp offset',
      },
    ],
    description:
      'Expands or contracts 2D shape. Use r for rounded, delta for sharp corners.',
    examples: ['offset(r=2) square(10);'],
  },
  {
    id: '$fn',
    category: 'Special Variables',
    signature: '$fn = number',
    parameters: [],
    description:
      'Number of fragments for curves. Higher = smoother. Common: 32 preview, 64-100 final.',
    examples: ['$fn = 64; sphere(10);'],
  },
  {
    id: 'children',
    category: 'User Defined',
    signature: 'children(index)',
    parameters: [
      {
        name: 'index',
        type: 'number',
        description: 'Optional specific child index',
      },
    ],
    description:
      'Inside module, refers to passed objects. Enables wrapper modules.',
    examples: [
      'module twice() { children(); translate([20,0,0]) children(); }',
    ],
  },
];

// Categories for filtering
export const docCategories = [
  '3D Primitives',
  '2D Primitives',
  'Transformations',
  'Boolean Operations',
  'Extrusion',
  '2D Operations',
  'Control Flow',
  'User Defined',
  'Special Variables',
  'Import',
  'Display',
] as const;

export type DocCategory = (typeof docCategories)[number];
