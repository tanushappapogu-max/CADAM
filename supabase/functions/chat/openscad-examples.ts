// OpenSCAD example snippets for the AI to learn from
// These are loaded via the hidden get_openscad_examples tool

export const openscadExamples = [
  {
    name: 'rounded-box',
    description:
      'Parametric rounded box with configurable corner radius. Good for enclosures, cases, and containers.',
    code: `// Parametric rounded box with configurable corner radius
box_length = 80;
box_width = 50;
box_height = 30;
corner_radius = 5;
wall_thickness = 2;

module rounded_box(length, width, height, radius) {
    hull() {
        for (x = [radius, length - radius])
            for (y = [radius, width - radius])
                translate([x, y, 0])
                cylinder(r=radius, h=height, $fn=32);
    }
}

difference() {
    rounded_box(box_length, box_width, box_height, corner_radius);
    translate([wall_thickness, wall_thickness, wall_thickness])
    rounded_box(
        box_length - 2*wall_thickness,
        box_width - 2*wall_thickness,
        box_height,
        corner_radius - wall_thickness/2
    );
}`,
  },
  {
    name: 'box-with-lid',
    description:
      'Parametric box with matching lid. Includes lip for secure closure and clearance for 3D printing.',
    code: `// Parametric box with matching lid
box_length = 60;
box_width = 40;
box_height = 25;
wall_thickness = 2;
lip_height = 4;
lip_clearance = 0.3;  // Tolerance for 3D printing fit

module box_base() {
    difference() {
        cube([box_length, box_width, box_height]);
        translate([wall_thickness, wall_thickness, wall_thickness])
        cube([box_length - 2*wall_thickness, box_width - 2*wall_thickness, box_height]);
    }
    // Inner lip for lid
    difference() {
        translate([wall_thickness, wall_thickness, box_height - lip_height])
        cube([box_length - 2*wall_thickness, box_width - 2*wall_thickness, lip_height]);
        translate([wall_thickness*2, wall_thickness*2, box_height - lip_height])
        cube([box_length - 4*wall_thickness, box_width - 4*wall_thickness, lip_height + 1]);
    }
}

module box_lid() {
    lid_inner_width = box_length - 2*wall_thickness - lip_clearance*2;
    lid_inner_depth = box_width - 2*wall_thickness - lip_clearance*2;
    cube([box_length, box_width, wall_thickness]);
    translate([wall_thickness + lip_clearance, wall_thickness + lip_clearance, wall_thickness])
    difference() {
        cube([lid_inner_width, lid_inner_depth, lip_height - lip_clearance]);
        translate([wall_thickness, wall_thickness, -1])
        cube([lid_inner_width - 2*wall_thickness, lid_inner_depth - 2*wall_thickness, lip_height + 2]);
    }
}

box_base();
translate([box_length + 10, 0, 0]) box_lid();`,
  },
  {
    name: 'phone-stand',
    description:
      'Parametric phone/tablet stand with adjustable angle and cable routing slot.',
    code: `// Parametric phone stand with adjustable angle
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
            cube([stand_width, stand_depth, stand_height]);
            translate([0, stand_depth - wall_thickness, stand_height])
            rotate([90 - viewing_angle, 0, 0])
            cube([stand_width, back_height, wall_thickness]);
        }
        // Phone slot
        translate([(stand_width - phone_slot_width)/2, wall_thickness, stand_height - phone_slot_depth])
        cube([phone_slot_width, stand_depth, phone_slot_depth + 1]);
        // Cable routing
        translate([(stand_width - cable_slot_width)/2, -1, stand_height - cable_slot_height])
        cube([cable_slot_width, wall_thickness + 2, cable_slot_height + 1]);
        // Weight reduction
        translate([wall_thickness, wall_thickness, wall_thickness])
        cube([stand_width - 2*wall_thickness, stand_depth - 3*wall_thickness, stand_height]);
    }
}

phone_stand();`,
  },
  {
    name: 'snap-fit-joint',
    description:
      'Parametric snap-fit cantilever joint. Common for enclosures and removable panels.',
    code: `// Parametric snap-fit cantilever joint
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
    cube([base_width, base_depth, base_height]);
    translate([(base_width - snap_width)/2, base_depth, base_height]) {
        cube([snap_width, snap_length, snap_thickness]);
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
        cube([base_width, base_depth + 5, base_height + slot_height + 2]);
        translate([(base_width - slot_width)/2, base_depth - 1, base_height])
        cube([slot_width, slot_length + 2, slot_height + 3]);
    }
}

snap_male();
translate([base_width + 20, 0, 0]) snap_female();`,
  },
  {
    name: 'gear',
    description:
      'Parametric involute spur gear with proper tooth profile for meshing gears.',
    code: `// Parametric involute spur gear
num_teeth = 20;
module_size = 2;  // Metric module
pressure_angle = 20;
gear_thickness = 8;
shaft_diameter = 6;
hub_diameter = 15;
hub_height = 5;

$fn = 64;

pitch_diameter = num_teeth * module_size;
outer_diameter = pitch_diameter + 2 * module_size;
root_diameter = pitch_diameter - 2.5 * module_size;

module gear_tooth() {
    tooth_width = module_size * 3.14159 / 2;
    hull() {
        translate([0, root_diameter/2 - 0.1, 0])
        square([tooth_width * 1.2, 0.2], center=true);
        translate([0, pitch_diameter/2, 0])
        square([tooth_width, 0.2], center=true);
        translate([0, outer_diameter/2 - 0.5, 0])
        square([tooth_width * 0.7, 0.2], center=true);
    }
}

module gear_2d() {
    circle(d=root_diameter);
    for (i = [0:num_teeth-1])
        rotate([0, 0, i * 360/num_teeth])
        gear_tooth();
}

module involute_gear() {
    difference() {
        union() {
            linear_extrude(height=gear_thickness) gear_2d();
            cylinder(d=hub_diameter, h=gear_thickness + hub_height);
        }
        translate([0, 0, -1])
        cylinder(d=shaft_diameter, h=gear_thickness + hub_height + 2);
    }
}

involute_gear();`,
  },
  {
    name: 'hinge',
    description:
      'Parametric print-in-place hinge designed to print as one piece with proper clearances.',
    code: `// Parametric print-in-place hinge
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
    difference() {
        union() {
            cube([hinge_length, hinge_width, hinge_thickness]);
            for (i = [side : 2 : num_knuckles-1]) {
                translate([hinge_length, i * knuckle_width + clearance/2, barrel_diameter/2])
                rotate([-90, 0, 0])
                cylinder(d=barrel_diameter, h=knuckle_width - clearance);
            }
        }
        translate([hinge_length, -1, barrel_diameter/2])
        rotate([-90, 0, 0])
        cylinder(d=pin_diameter + clearance, h=hinge_width + 2);
    }
}

hinge_leaf(0);
translate([0, 0, hinge_thickness])
mirror([0, 0, 1])
translate([-hinge_length*2, 0, -hinge_thickness])
hinge_leaf(1);`,
  },
  {
    name: 'mounting-bracket',
    description:
      'Parametric L-bracket with mounting holes and fillets for strength.',
    code: `// Parametric L-bracket with mounting holes
bracket_width = 40;
bracket_height = 50;
bracket_depth = 30;
thickness = 4;
hole_diameter = 5;
hole_margin = 10;
fillet_radius = 8;

$fn = 32;

module l_bracket() {
    difference() {
        union() {
            cube([bracket_width, thickness, bracket_height]);
            cube([bracket_width, bracket_depth, thickness]);
            // Fillet for strength
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
        for (x = [hole_margin, bracket_width - hole_margin])
            translate([x, bracket_depth - hole_margin, -1])
            cylinder(d=hole_diameter, h=thickness + 2);
    }
}

l_bracket();`,
  },
  {
    name: 'cable-organizer',
    description:
      'Parametric cable organizer/clip with flexible slots to hold various cable sizes.',
    code: `// Parametric cable organizer
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
        cylinder(d=slot_diameter + wall_thickness*2, h=slot_depth);
        translate([0, 0, -1])
        cylinder(d=slot_diameter, h=slot_depth + 2);
        translate([-slot_opening/2, 0, -1])
        cube([slot_opening, slot_diameter, slot_depth + 2]);
    }
}

module cable_organizer() {
    slot_spacing = base_length / num_slots;
    difference() {
        union() {
            cube([base_length, base_width, base_height]);
            for (i = [0:num_slots-1])
                translate([slot_spacing/2 + i*slot_spacing, base_width/2, base_height])
                cable_slot();
        }
        // Mounting holes with countersinks
        for (x = [base_length/4, 3*base_length/4]) {
            translate([x, base_width/2, -1])
            cylinder(d=mounting_hole_diameter, h=base_height + 2);
            translate([x, base_width/2, base_height - 1])
            cylinder(d1=mounting_hole_diameter, d2=mounting_hole_diameter*2, h=2);
        }
    }
}

cable_organizer();`,
  },
  {
    name: 'knob',
    description:
      'Parametric control knob with grip texture, D-shaft or set screw options.',
    code: `// Parametric control knob with grip texture
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
            difference() {
                cylinder(d=knob_diameter, h=knob_height);
                for (i = [0:num_ridges-1])
                    rotate([0, 0, i * 360/num_ridges])
                    translate([knob_diameter/2, 0, -1])
                    cylinder(d=ridge_depth*2, h=knob_height + 2, $fn=16);
            }
            translate([0, 0, knob_height])
            scale([1, 1, 0.15])
            sphere(d=knob_diameter - ridge_depth*2);
        }
        translate([0, 0, -1])
        cylinder(d=shaft_diameter, h=shaft_depth + 1);
        if (d_flat_depth > 0) {
            translate([shaft_diameter/2 - d_flat_depth, -shaft_diameter/2, -1])
            cube([d_flat_depth + 1, shaft_diameter, shaft_depth + 1]);
        }
        translate([0, 0, knob_height - top_indent_depth + 0.1])
        cylinder(d=top_indent_diameter, h=top_indent_depth + 5);
        translate([0, -knob_diameter/2 - 1, shaft_depth/2])
        rotate([-90, 0, 0])
        cylinder(d=set_screw_diameter, h=knob_diameter/2 - shaft_diameter/2);
    }
}

knob();`,
  },
  {
    name: 'threaded-container',
    description:
      'Parametric threaded container with screw-on lid using metric thread profile.',
    code: `// Parametric threaded container
container_diameter = 50;
container_height = 60;
wall_thickness = 3;
thread_pitch = 3;
thread_depth = 1.5;
thread_length = 12;
lid_height = 15;
clearance = 0.4;

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
            cylinder(d=container_diameter, h=container_height);
            translate([0, 0, container_height - thread_length])
            thread_profile(container_diameter, thread_pitch, thread_depth, thread_length);
        }
        translate([0, 0, wall_thickness])
        cylinder(d=container_diameter - 2*wall_thickness, h=container_height);
    }
}

module container_lid() {
    difference() {
        union() {
            cylinder(d=container_diameter + 2*wall_thickness, h=wall_thickness);
            translate([0, 0, wall_thickness])
            difference() {
                cylinder(d=container_diameter + 2*wall_thickness, h=lid_height - wall_thickness);
                translate([0, 0, -1])
                cylinder(d=container_diameter + clearance*2, h=lid_height + 1);
            }
        }
        translate([0, 0, wall_thickness])
        thread_profile(container_diameter + clearance*2, thread_pitch, thread_depth, thread_length, true);
    }
}

container_body();
translate([container_diameter + 20, 0, 0]) container_lid();`,
  },
];

export type OpenSCADExample = (typeof openscadExamples)[number];
