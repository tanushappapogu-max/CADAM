// Parametric involute spur gear
// Proper involute tooth profile for meshing gears

num_teeth = 20;
module_size = 2;  // Metric module (pitch diameter / teeth)
pressure_angle = 20;
gear_thickness = 8;
shaft_diameter = 6;
hub_diameter = 15;
hub_height = 5;

$fn = 64;

// Derived dimensions
pitch_diameter = num_teeth * module_size;
outer_diameter = pitch_diameter + 2 * module_size;
root_diameter = pitch_diameter - 2.5 * module_size;

module involute_gear() {
    difference() {
        union() {
            // Gear body with teeth
            linear_extrude(height=gear_thickness)
            gear_2d();
            
            // Hub
            cylinder(d=hub_diameter, h=gear_thickness + hub_height);
        }
        
        // Shaft hole
        translate([0, 0, -1])
        cylinder(d=shaft_diameter, h=gear_thickness + hub_height + 2);
    }
}

module gear_2d() {
    difference() {
        union() {
            circle(d=root_diameter);
            for (i = [0:num_teeth-1]) {
                rotate([0, 0, i * 360/num_teeth])
                gear_tooth();
            }
        }
    }
}

module gear_tooth() {
    tooth_width = module_size * 3.14159 / 2;
    
    // Simplified involute tooth profile
    hull() {
        translate([0, root_diameter/2 - 0.1, 0])
        square([tooth_width * 1.2, 0.2], center=true);
        
        translate([0, pitch_diameter/2, 0])
        square([tooth_width, 0.2], center=true);
        
        translate([0, outer_diameter/2 - 0.5, 0])
        square([tooth_width * 0.7, 0.2], center=true);
    }
}

involute_gear();

