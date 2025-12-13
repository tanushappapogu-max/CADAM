// Parametric threaded container with screw-on lid
// Uses metric thread profile approximation

container_diameter = 50;
container_height = 60;
wall_thickness = 3;
thread_pitch = 3;
thread_depth = 1.5;
thread_length = 12;
lid_height = 15;
clearance = 0.4;  // Thread clearance for printing

$fn = 64;

module thread_profile(d, pitch, depth, length, internal=false) {
    offset = internal ? clearance : 0;
    turns = length / pitch;
    
    for (i = [0:$fn*turns]) {
        angle = i * 360 / $fn;
        z = i * pitch / $fn;
        if (z <= length) {
            translate([0, 0, z])
            rotate([0, 0, angle])
            translate([(d/2 - depth + offset), 0, 0])
            cylinder(d1=0, d2=depth*2, h=pitch/$fn*2, $fn=4);
        }
    }
}

module container_body() {
    difference() {
        union() {
            // Main body
            cylinder(d=container_diameter, h=container_height);
            
            // External threads at top
            translate([0, 0, container_height - thread_length])
            thread_profile(container_diameter, thread_pitch, thread_depth, thread_length);
        }
        
        // Hollow inside
        translate([0, 0, wall_thickness])
        cylinder(d=container_diameter - 2*wall_thickness, h=container_height);
    }
}

module container_lid() {
    difference() {
        union() {
            // Lid top
            cylinder(d=container_diameter + 2*wall_thickness, h=wall_thickness);
            
            // Lid skirt with internal threads
            translate([0, 0, wall_thickness])
            difference() {
                cylinder(d=container_diameter + 2*wall_thickness, h=lid_height - wall_thickness);
                translate([0, 0, -1])
                cylinder(d=container_diameter + clearance*2, h=lid_height + 1);
            }
        }
        
        // Internal thread groove
        translate([0, 0, wall_thickness])
        thread_profile(container_diameter + clearance*2, thread_pitch, thread_depth, thread_length, true);
    }
}

// Display
container_body();
translate([container_diameter + 20, 0, 0])
container_lid();

