// Parametric control knob with grip texture
// Includes D-shaft or set screw options

knob_diameter = 30;
knob_height = 20;
shaft_diameter = 6;
shaft_depth = 15;
d_flat_depth = 1;  // Depth of D-flat (0 for round shaft)
num_ridges = 24;
ridge_depth = 1;
top_indent_diameter = 15;
top_indent_depth = 2;
set_screw_diameter = 3;

$fn = 64;

module knob() {
    difference() {
        union() {
            // Main body with grip ridges
            difference() {
                cylinder(d=knob_diameter, h=knob_height);
                
                // Grip ridges (subtract valleys)
                for (i = [0:num_ridges-1]) {
                    rotate([0, 0, i * 360/num_ridges])
                    translate([knob_diameter/2, 0, -1])
                    cylinder(d=ridge_depth*2, h=knob_height + 2, $fn=16);
                }
            }
            
            // Slight dome on top
            translate([0, 0, knob_height])
            scale([1, 1, 0.15])
            sphere(d=knob_diameter - ridge_depth*2);
        }
        
        // Shaft hole
        translate([0, 0, -1])
        cylinder(d=shaft_diameter, h=shaft_depth + 1);
        
        // D-flat if specified
        if (d_flat_depth > 0) {
            translate([shaft_diameter/2 - d_flat_depth, -shaft_diameter/2, -1])
            cube([d_flat_depth + 1, shaft_diameter, shaft_depth + 1]);
        }
        
        // Top indent for finger placement
        translate([0, 0, knob_height - top_indent_depth + 0.1])
        cylinder(d=top_indent_diameter, h=top_indent_depth + 5);
        
        // Set screw hole (horizontal)
        translate([0, -knob_diameter/2 - 1, shaft_depth/2])
        rotate([-90, 0, 0])
        cylinder(d=set_screw_diameter, h=knob_diameter/2 - shaft_diameter/2);
    }
}

knob();

