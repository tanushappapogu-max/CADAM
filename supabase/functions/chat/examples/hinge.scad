// Parametric print-in-place hinge
// Designed to print as one piece with proper clearances

hinge_width = 40;
hinge_length = 30;
hinge_thickness = 3;
barrel_diameter = 8;
num_knuckles = 5;
clearance = 0.4;  // Gap for print-in-place
pin_diameter = 3;

$fn = 32;

knuckle_width = hinge_width / num_knuckles;

module hinge_leaf(side=0) {
    // side: 0 = left (odd knuckles), 1 = right (even knuckles)
    
    difference() {
        union() {
            // Flat part
            cube([hinge_length, hinge_width, hinge_thickness]);
            
            // Barrel knuckles
            for (i = [side : 2 : num_knuckles-1]) {
                translate([hinge_length, i * knuckle_width + clearance/2, barrel_diameter/2])
                rotate([-90, 0, 0])
                cylinder(d=barrel_diameter, h=knuckle_width - clearance);
            }
        }
        
        // Pin hole through all knuckles
        translate([hinge_length, -1, barrel_diameter/2])
        rotate([-90, 0, 0])
        cylinder(d=pin_diameter + clearance, h=hinge_width + 2);
    }
}

module hinge_pin() {
    translate([hinge_length, 0, barrel_diameter/2])
    rotate([-90, 0, 0])
    cylinder(d=pin_diameter, h=hinge_width);
}

// Assemble hinge (print-in-place)
hinge_leaf(0);

translate([0, 0, hinge_thickness])
mirror([0, 0, 1])
translate([-hinge_length*2, 0, -hinge_thickness])
hinge_leaf(1);

// Pin (optional - can be printed separately or use filament)
color("silver")
hinge_pin();

