// OpenSCAD context/documentation for AI system prompt
export const OPENSCAD_CONTEXT = `
## OpenSCAD Reference

### 3D Primitives
- cube([x, y, z], center=false) - Creates a cube/box
- sphere(r=radius) or sphere(d=diameter) - Creates a sphere
- cylinder(h=height, r=radius, center=false) - Creates a cylinder
- cylinder(h=height, r1=bottom_r, r2=top_r) - Creates a cone/tapered cylinder

### 2D Primitives
- circle(r=radius) or circle(d=diameter)
- square([x, y], center=false)
- polygon(points=[[x,y],...], paths=[[0,1,2,...]])
- text(t="string", size=10, font="Liberation Sans")

### Transformations
- translate([x, y, z]) - Move object
- rotate([x, y, z]) - Rotate (degrees)
- scale([x, y, z]) - Scale object
- mirror([x, y, z]) - Mirror across plane
- multmatrix(m) - Apply transformation matrix

### Boolean Operations
- union() { ... } - Combine objects
- difference() { ... } - Subtract subsequent from first
- intersection() { ... } - Keep only overlapping parts

### Extrusion
- linear_extrude(height, twist=0, slices=20, scale=1) - Extrude 2D to 3D
- rotate_extrude(angle=360) - Revolve 2D shape around Z axis

### Modifiers
- hull() { ... } - Convex hull of children
- minkowski() { ... } - Minkowski sum
- offset(r=radius) or offset(delta=d) - Offset 2D shape

### Loops and Conditionals
- for (i = [start:step:end]) { ... }
- for (i = [a, b, c]) { ... }
- if (condition) { ... } else { ... }
- let (var = value) { ... }

### Modules and Functions
- module name(params) { ... } - Define reusable geometry
- function name(params) = expression; - Define function

### Special Variables
- $fn - Number of fragments for circles/spheres
- $fa - Minimum angle for fragments
- $fs - Minimum size for fragments
- $t - Animation time (0-1)

### Import/Export
- import("file.stl") - Import STL/OFF/AMF/3MF/DXF/SVG
- surface(file="heightmap.png") - Import heightmap

### Best Practices
1. Use meaningful variable names for dimensions
2. Add comments explaining the design intent
3. Use modules for repeated geometry
4. Set $fn appropriately (higher for final render, lower for preview)
5. Center objects when appropriate for easier manipulation
`;
