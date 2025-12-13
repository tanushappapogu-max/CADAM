// Parametric phone/tablet stand with adjustable angle
// Includes cable routing slot

stand_width = 80;
stand_depth = 60;
stand_height = 15;
back_height = 70;
viewing_angle = 65;  // Angle from horizontal
phone_slot_width = 12;
phone_slot_depth = 8;
cable_slot_width = 15;
cable_slot_height = 10;
wall_thickness = 4;

module phone_stand() {
    difference() {
        union() {
            // Base
            cube([stand_width, stand_depth, stand_height]);
            
            // Back support angled
            translate([0, stand_depth - wall_thickness, stand_height])
            rotate([90 - viewing_angle, 0, 0])
            cube([stand_width, back_height, wall_thickness]);
        }
        
        // Phone slot
        translate([(stand_width - phone_slot_width)/2, wall_thickness, stand_height - phone_slot_depth])
        cube([phone_slot_width, stand_depth, phone_slot_depth + 1]);
        
        // Cable routing slot
        translate([(stand_width - cable_slot_width)/2, -1, stand_height - cable_slot_height])
        cube([cable_slot_width, wall_thickness + 2, cable_slot_height + 1]);
        
        // Weight reduction cutout in base
        translate([wall_thickness, wall_thickness, wall_thickness])
        cube([
            stand_width - 2*wall_thickness,
            stand_depth - 3*wall_thickness,
            stand_height
        ]);
    }
}

phone_stand();

