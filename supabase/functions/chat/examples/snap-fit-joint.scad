// Parametric snap-fit cantilever joint
// Common for enclosures and removable panels

base_width = 40;
base_depth = 30;
base_height = 5;
snap_width = 8;
snap_length = 15;
snap_thickness = 2;
snap_hook_height = 2;
snap_hook_angle = 45;
clearance = 0.3;

$fn = 32;

module snap_male() {
    // Base plate
    cube([base_width, base_depth, base_height]);
    
    // Snap cantilever
    translate([(base_width - snap_width)/2, base_depth, base_height]) {
        // Flexible arm
        cube([snap_width, snap_length, snap_thickness]);
        
        // Hook
        translate([0, snap_length, 0])
        hull() {
            cube([snap_width, 0.1, snap_thickness]);
            translate([0, snap_hook_height * tan(snap_hook_angle), 0])
            cube([snap_width, 0.1, snap_thickness + snap_hook_height]);
        }
    }
}

module snap_female() {
    slot_width = snap_width + clearance*2;
    slot_length = snap_length + snap_hook_height + clearance;
    slot_height = snap_thickness + snap_hook_height + clearance;
    
    difference() {
        // Base plate
        cube([base_width, base_depth + 5, base_height + slot_height + 2]);
        
        // Snap slot
        translate([(base_width - slot_width)/2, base_depth - 1, base_height])
        cube([slot_width, slot_length + 2, slot_height + 3]);
        
        // Entry ramp for snap
        translate([(base_width - slot_width)/2, base_depth + slot_length - snap_hook_height, base_height])
        rotate([-snap_hook_angle, 0, 0])
        cube([slot_width, snap_hook_height*2, slot_height*2]);
    }
}

// Display parts side by side
snap_male();
translate([base_width + 20, 0, 0])
snap_female();

