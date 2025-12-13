// Parametric L-bracket with mounting holes
// Includes fillets for strength

bracket_width = 40;
bracket_height = 50;
bracket_depth = 30;
thickness = 4;
hole_diameter = 5;
hole_margin = 10;
fillet_radius = 8;

$fn = 32;

module fillet_2d(r) {
    difference() {
        square([r, r]);
        translate([r, r])
        circle(r=r);
    }
}

module l_bracket() {
    difference() {
        union() {
            // Vertical plate
            cube([bracket_width, thickness, bracket_height]);
            
            // Horizontal plate
            cube([bracket_width, bracket_depth, thickness]);
            
            // Fillet/gusset for strength
            translate([0, thickness, thickness])
            rotate([90, 0, 90])
            linear_extrude(height=bracket_width)
            difference() {
                square([fillet_radius, fillet_radius]);
                translate([fillet_radius, fillet_radius])
                circle(r=fillet_radius);
            }
        }
        
        // Vertical mounting holes
        for (x = [hole_margin, bracket_width - hole_margin]) {
            translate([x, -1, bracket_height - hole_margin])
            rotate([-90, 0, 0])
            cylinder(d=hole_diameter, h=thickness + 2);
            
            translate([x, -1, hole_margin + thickness])
            rotate([-90, 0, 0])
            cylinder(d=hole_diameter, h=thickness + 2);
        }
        
        // Horizontal mounting holes
        for (x = [hole_margin, bracket_width - hole_margin]) {
            translate([x, bracket_depth - hole_margin, -1])
            cylinder(d=hole_diameter, h=thickness + 2);
        }
    }
}

l_bracket();

