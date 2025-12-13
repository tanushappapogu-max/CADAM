// Parametric cable organizer/clip
// Flexible slots to hold various cable sizes

base_length = 60;
base_width = 25;
base_height = 5;
num_slots = 4;
slot_diameter = 8;
slot_opening = 5;  // Opening width (less than diameter for grip)
slot_depth = 15;
wall_thickness = 2;
mounting_hole_diameter = 4;

$fn = 32;

module cable_slot() {
    difference() {
        // Outer cylinder
        cylinder(d=slot_diameter + wall_thickness*2, h=slot_depth);
        
        // Inner channel
        translate([0, 0, -1])
        cylinder(d=slot_diameter, h=slot_depth + 2);
        
        // Entry slot (narrower than cable for grip)
        translate([-slot_opening/2, 0, -1])
        cube([slot_opening, slot_diameter, slot_depth + 2]);
    }
}

module cable_organizer() {
    slot_spacing = base_length / num_slots;
    
    difference() {
        union() {
            // Base plate
            cube([base_length, base_width, base_height]);
            
            // Cable slots
            for (i = [0:num_slots-1]) {
                translate([slot_spacing/2 + i*slot_spacing, base_width/2, base_height])
                cable_slot();
            }
        }
        
        // Mounting holes in base
        translate([base_length/4, base_width/2, -1])
        cylinder(d=mounting_hole_diameter, h=base_height + 2);
        
        translate([3*base_length/4, base_width/2, -1])
        cylinder(d=mounting_hole_diameter, h=base_height + 2);
        
        // Countersinks
        translate([base_length/4, base_width/2, base_height - 1])
        cylinder(d1=mounting_hole_diameter, d2=mounting_hole_diameter*2, h=2);
        
        translate([3*base_length/4, base_width/2, base_height - 1])
        cylinder(d1=mounting_hole_diameter, d2=mounting_hole_diameter*2, h=2);
    }
}

cable_organizer();

