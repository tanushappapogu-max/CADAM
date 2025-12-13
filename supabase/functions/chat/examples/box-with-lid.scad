// Parametric box with matching lid
// Includes lip for secure closure and clearance for 3D printing

box_length = 60;
box_width = 40;
box_height = 25;
wall_thickness = 2;
lip_height = 4;
lip_clearance = 0.3;  // Tolerance for 3D printing fit

module box_base() {
    difference() {
        // Outer shell
        cube([box_length, box_width, box_height]);
        
        // Inner cavity
        translate([wall_thickness, wall_thickness, wall_thickness])
        cube([
            box_length - 2*wall_thickness,
            box_width - 2*wall_thickness,
            box_height
        ]);
    }
    
    // Inner lip for lid to sit on
    difference() {
        translate([wall_thickness, wall_thickness, box_height - lip_height])
        cube([
            box_length - 2*wall_thickness,
            box_width - 2*wall_thickness,
            lip_height
        ]);
        
        translate([wall_thickness*2, wall_thickness*2, box_height - lip_height])
        cube([
            box_length - 4*wall_thickness,
            box_width - 4*wall_thickness,
            lip_height + 1
        ]);
    }
}

module box_lid() {
    lid_inner_width = box_length - 2*wall_thickness - lip_clearance*2;
    lid_inner_depth = box_width - 2*wall_thickness - lip_clearance*2;
    
    // Lid top
    cube([box_length, box_width, wall_thickness]);
    
    // Lid lip that fits inside box
    translate([wall_thickness + lip_clearance, wall_thickness + lip_clearance, wall_thickness])
    difference() {
        cube([lid_inner_width, lid_inner_depth, lip_height - lip_clearance]);
        
        translate([wall_thickness, wall_thickness, -1])
        cube([
            lid_inner_width - 2*wall_thickness,
            lid_inner_depth - 2*wall_thickness,
            lip_height + 2
        ]);
    }
}

// Display box and lid side by side
box_base();
translate([box_length + 10, 0, 0])
box_lid();

