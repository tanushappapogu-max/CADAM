// Architecture Parts Library for Parametrix
// All dimensions in feet

// ============================================================
// STRUCTURAL ELEMENTS
// ============================================================

module part_wall(width=10, height=9, thickness=0.5, material="stucco") {
    c = material == "brick" ? [0.72, 0.4, 0.3] :
        material == "stone" ? [0.65, 0.63, 0.6] :
        material == "wood" ? [0.6, 0.45, 0.28] :
        material == "concrete" ? [0.6, 0.58, 0.55] :
        [0.91, 0.88, 0.82]; // stucco default
    color(c)
    cube([width, thickness, height]);
}

module part_foundation(width=36, depth=28, height=1) {
    color([0.6, 0.58, 0.55])
    cube([width, depth, height]);
}

module part_column(radius=0.5, height=9, style="round") {
    color([0.95, 0.95, 0.93])
    if (style == "round") {
        cylinder(r=radius, h=height, $fn=32);
    } else {
        translate([-radius, -radius, 0])
        cube([radius*2, radius*2, height]);
    }
}

module part_beam(width=0.5, depth=0.5, length=10) {
    color([0.55, 0.35, 0.17])
    cube([length, depth, width]);
}

module part_floor_slab(width=36, depth=28, thickness=0.5) {
    color([0.6, 0.58, 0.55])
    cube([width, depth, thickness]);
}

// ============================================================
// DOORS
// ============================================================

module part_door(width=3, height=6.8, thickness=0.15, material="wood", has_frame=true) {
    c = material == "wood" ? [0.55, 0.35, 0.17] :
        material == "dark_wood" ? [0.4, 0.25, 0.12] :
        material == "white" ? [0.95, 0.95, 0.93] :
        material == "metal" ? [0.3, 0.3, 0.32] :
        [0.55, 0.35, 0.17];

    // Door panel
    color(c)
    cube([width, thickness, height]);

    // Door handle
    color([0.75, 0.7, 0.55])
    translate([width - 0.4, -0.05, height/2])
    sphere(r=0.08, $fn=16);

    // Frame (white trim)
    if (has_frame) {
        frame_w = 0.25;
        color([0.95, 0.95, 0.93]) {
            // Left frame
            translate([-frame_w, -0.02, 0])
            cube([frame_w, thickness + 0.04, height]);
            // Right frame
            translate([width, -0.02, 0])
            cube([frame_w, thickness + 0.04, height]);
            // Top frame
            translate([-frame_w, -0.02, height])
            cube([width + 2*frame_w, thickness + 0.04, frame_w]);
        }
    }
}

module part_double_door(width=6, height=6.8, thickness=0.15, material="wood") {
    half = width / 2;
    gap = 0.05;

    // Left door
    part_door(width=half - gap/2, height=height, thickness=thickness, material=material, has_frame=false);
    // Right door
    translate([half + gap/2, 0, 0])
    part_door(width=half - gap/2, height=height, thickness=thickness, material=material, has_frame=false);

    // Frame
    frame_w = 0.25;
    color([0.95, 0.95, 0.93]) {
        translate([-frame_w, -0.02, 0])
        cube([frame_w, thickness + 0.04, height]);
        translate([width, -0.02, 0])
        cube([frame_w, thickness + 0.04, height]);
        translate([-frame_w, -0.02, height])
        cube([width + 2*frame_w, thickness + 0.04, frame_w]);
    }
}

module part_garage_door(width=9, height=7, thickness=0.2, material="white") {
    c = material == "white" ? [0.92, 0.9, 0.88] :
        material == "wood" ? [0.55, 0.35, 0.17] :
        [0.92, 0.9, 0.88];

    panels = 4;
    panel_h = height / panels;

    color(c)
    for (i = [0:panels-1]) {
        translate([0, 0, i * panel_h + 0.05])
        cube([width, thickness, panel_h - 0.1]);
    }

    // Frame
    color([0.85, 0.85, 0.85]) {
        translate([-0.2, -0.02, 0])
        cube([0.2, thickness + 0.04, height]);
        translate([width, -0.02, 0])
        cube([0.2, thickness + 0.04, height]);
        translate([-0.2, -0.02, height])
        cube([width + 0.4, thickness + 0.04, 0.2]);
    }
}

module part_sliding_door(width=6, height=6.8, thickness=0.15) {
    // Glass panels
    color([0.7, 0.85, 0.95, 0.35])
    cube([width, thickness, height]);

    // Aluminum frame
    frame_w = 0.15;
    color([0.2, 0.2, 0.2]) {
        cube([frame_w, thickness + 0.02, height]);
        translate([width/2 - frame_w/2, 0, 0])
        cube([frame_w, thickness + 0.02, height]);
        translate([width - frame_w, 0, 0])
        cube([frame_w, thickness + 0.02, height]);
        cube([width, thickness + 0.02, frame_w]);
        translate([0, 0, height - frame_w])
        cube([width, thickness + 0.02, frame_w]);
    }
}

// ============================================================
// WINDOWS
// ============================================================

module part_window(width=3, height=4, thickness=0.1, panes_x=1, panes_y=1, frame_material="white") {
    frame_c = frame_material == "dark" ? [0.2, 0.2, 0.2] : [0.95, 0.95, 0.93];
    frame_w = 0.2;
    mullion_w = 0.12;

    // Glass
    color([0.7, 0.85, 0.95, 0.4])
    translate([frame_w, 0, frame_w])
    cube([width - 2*frame_w, thickness, height - 2*frame_w]);

    // Frame
    color(frame_c) {
        // Bottom
        cube([width, thickness + 0.02, frame_w]);
        // Top
        translate([0, 0, height - frame_w])
        cube([width, thickness + 0.02, frame_w]);
        // Left
        cube([frame_w, thickness + 0.02, height]);
        // Right
        translate([width - frame_w, 0, 0])
        cube([frame_w, thickness + 0.02, height]);

        // Mullions (dividers)
        if (panes_x > 1) {
            pane_w = (width - 2*frame_w) / panes_x;
            for (i = [1:panes_x-1]) {
                translate([frame_w + i*pane_w - mullion_w/2, 0, frame_w])
                cube([mullion_w, thickness + 0.02, height - 2*frame_w]);
            }
        }
        if (panes_y > 1) {
            pane_h = (height - 2*frame_w) / panes_y;
            for (i = [1:panes_y-1]) {
                translate([frame_w, 0, frame_w + i*pane_h - mullion_w/2])
                cube([width - 2*frame_w, thickness + 0.02, mullion_w]);
            }
        }
    }

    // Sill
    color(frame_c)
    translate([-0.15, -0.2, -0.1])
    cube([width + 0.3, 0.35, 0.1]);
}

module part_bay_window(width=6, height=4, depth=2, thickness=0.1) {
    angle = 30;
    side_w = depth / cos(angle);

    // Center window
    translate([depth, 0, 0])
    part_window(width=width - 2*depth, height=height, thickness=thickness, panes_y=2);

    // Left angled window
    translate([0, depth, 0])
    rotate([0, 0, angle])
    part_window(width=side_w, height=height, thickness=thickness);

    // Right angled window
    translate([width - depth, 0, 0])
    rotate([0, 0, -angle])
    translate([0, 0, 0])
    part_window(width=side_w, height=height, thickness=thickness);

    // Bottom shelf
    color([0.95, 0.95, 0.93])
    hull() {
        cube([width, 0.1, 0.15]);
        translate([0, depth, 0])
        cube([width, 0.1, 0.15]);
    }
}

module part_dormer_window(width=4, height=4, depth=3) {
    // Dormer walls
    color([0.91, 0.88, 0.82]) {
        // Left wall
        cube([0.3, depth, height]);
        // Right wall
        translate([width - 0.3, 0, 0])
        cube([0.3, depth, height]);
    }

    // Dormer roof
    color([0.35, 0.25, 0.2])
    translate([-0.5, -0.5, height])
    polyhedron(
        points = [
            [0, 0, 0],
            [width + 1, 0, 0],
            [width + 1, depth + 1, 0],
            [0, depth + 1, 0],
            [(width + 1)/2, 0, 2],
            [(width + 1)/2, depth + 1, 2]
        ],
        faces = [
            [0, 1, 4], [1, 2, 5, 4], [2, 3, 5], [3, 0, 4, 5], [0, 3, 2, 1]
        ]
    );

    // Window
    translate([0.5, -0.05, 0.5])
    part_window(width=width - 1, height=height - 1, panes_y=2);
}

// ============================================================
// ROOFS
// ============================================================

module part_roof_gable(width=36, depth=28, height=8, overhang=1.5, material="shingle") {
    c = material == "tile" ? [0.5, 0.15, 0.15] :
        material == "metal" ? [0.4, 0.42, 0.44] :
        material == "slate" ? [0.35, 0.35, 0.38] :
        [0.35, 0.25, 0.2]; // shingle

    w = width + 2*overhang;
    d = depth + 2*overhang;

    color(c)
    translate([-overhang, -overhang, 0])
    polyhedron(
        points = [
            [0, 0, 0],
            [w, 0, 0],
            [w, d, 0],
            [0, d, 0],
            [w/2, 0, height],
            [w/2, d, height]
        ],
        faces = [
            [0, 1, 4], [1, 2, 5, 4], [2, 3, 5], [3, 0, 4, 5], [0, 3, 2, 1]
        ]
    );
}

module part_roof_hip(width=36, depth=28, height=8, overhang=1.5, material="shingle") {
    c = material == "tile" ? [0.5, 0.15, 0.15] :
        material == "metal" ? [0.4, 0.42, 0.44] :
        [0.35, 0.25, 0.2];

    w = width + 2*overhang;
    d = depth + 2*overhang;
    ridge_len = max(0, d - w) + w * 0.3;
    ridge_offset = (d - ridge_len) / 2;

    color(c)
    translate([-overhang, -overhang, 0])
    polyhedron(
        points = [
            [0, 0, 0],
            [w, 0, 0],
            [w, d, 0],
            [0, d, 0],
            [w/2, ridge_offset, height],
            [w/2, d - ridge_offset, height]
        ],
        faces = [
            [0, 1, 4], [1, 2, 5, 4], [2, 3, 5], [3, 0, 4, 5], [0, 3, 2, 1]
        ]
    );
}

module part_roof_flat(width=36, depth=28, thickness=0.5, overhang=0.5, parapet_height=1) {
    w = width + 2*overhang;
    d = depth + 2*overhang;

    // Roof slab
    color([0.55, 0.55, 0.55])
    translate([-overhang, -overhang, 0])
    cube([w, d, thickness]);

    // Parapet walls
    if (parapet_height > 0) {
        color([0.91, 0.88, 0.82]) {
            translate([-overhang, -overhang, thickness])
            cube([w, 0.3, parapet_height]);
            translate([-overhang, depth + overhang - 0.3, thickness])
            cube([w, 0.3, parapet_height]);
            translate([-overhang, -overhang, thickness])
            cube([0.3, d, parapet_height]);
            translate([width + overhang - 0.3, -overhang, thickness])
            cube([0.3, d, parapet_height]);
        }
    }
}

// ============================================================
// STAIRS
// ============================================================

module part_stairs(width=3, num_steps=13, step_height=0.58, step_depth=0.83, material="wood") {
    c = material == "concrete" ? [0.6, 0.58, 0.55] :
        material == "stone" ? [0.65, 0.63, 0.6] :
        [0.55, 0.35, 0.17]; // wood

    color(c)
    for (i = [0:num_steps-1]) {
        translate([0, i * step_depth, i * step_height])
        cube([width, step_depth, step_height]);
    }
}

module part_porch_steps(width=6, num_steps=3, step_height=0.58, step_depth=1) {
    color([0.6, 0.58, 0.55])
    for (i = [0:num_steps-1]) {
        translate([0, i * step_depth, i * step_height])
        cube([width, step_depth + (num_steps - i - 1) * step_depth, step_height]);
    }
}

module part_railing(length=10, height=3, material="wood") {
    c = material == "metal" ? [0.15, 0.15, 0.15] :
        material == "white" ? [0.95, 0.95, 0.93] :
        [0.55, 0.35, 0.17];

    post_spacing = 4;
    baluster_spacing = 0.5;
    num_posts = max(2, floor(length / post_spacing) + 1);
    num_balusters = floor(length / baluster_spacing);

    color(c) {
        // Top rail
        translate([0, 0, height])
        cube([length, 0.15, 0.15]);

        // Bottom rail
        translate([0, 0, 0.3])
        cube([length, 0.1, 0.1]);

        // Posts
        for (i = [0:num_posts-1]) {
            x = i * (length / (num_posts - 1));
            translate([x, -0.05, 0])
            cube([0.25, 0.25, height + 0.15]);
        }

        // Balusters
        for (i = [0:num_balusters-1]) {
            translate([i * baluster_spacing, 0.02, 0.3])
            cube([0.08, 0.08, height - 0.3]);
        }
    }
}

// ============================================================
// FURNITURE
// ============================================================

module part_table(width=4, depth=2.5, height=2.5, leg_size=0.25, material="wood") {
    c = material == "dark_wood" ? [0.4, 0.25, 0.12] :
        material == "white" ? [0.95, 0.95, 0.93] :
        [0.55, 0.35, 0.17];

    top_thickness = 0.15;
    color(c) {
        // Table top
        translate([0, 0, height - top_thickness])
        cube([width, depth, top_thickness]);
        // Legs
        cube([leg_size, leg_size, height - top_thickness]);
        translate([width - leg_size, 0, 0])
        cube([leg_size, leg_size, height - top_thickness]);
        translate([0, depth - leg_size, 0])
        cube([leg_size, leg_size, height - top_thickness]);
        translate([width - leg_size, depth - leg_size, 0])
        cube([leg_size, leg_size, height - top_thickness]);
    }
}

module part_chair(seat_width=1.5, seat_depth=1.5, seat_height=1.5, back_height=1.5, material="wood") {
    c = material == "dark_wood" ? [0.4, 0.25, 0.12] :
        material == "upholstered" ? [0.5, 0.35, 0.3] :
        [0.55, 0.35, 0.17];
    leg = 0.15;

    color(c) {
        // Seat
        translate([0, 0, seat_height])
        cube([seat_width, seat_depth, 0.12]);
        // Back
        translate([0, seat_depth - 0.12, seat_height])
        cube([seat_width, 0.12, back_height]);
        // Legs
        cube([leg, leg, seat_height]);
        translate([seat_width - leg, 0, 0])
        cube([leg, leg, seat_height]);
        translate([0, seat_depth - leg, 0])
        cube([leg, leg, seat_height]);
        translate([seat_width - leg, seat_depth - leg, 0])
        cube([leg, leg, seat_height]);
    }
}

module part_sofa(width=7, depth=3, seat_height=1.4, back_height=1.2, arm_width=0.6) {
    // Seat cushion
    color([0.5, 0.35, 0.3])
    translate([arm_width, 0, seat_height - 0.5])
    cube([width - 2*arm_width, depth - 0.5, 0.5]);

    // Back cushion
    color([0.5, 0.35, 0.3])
    translate([arm_width, depth - 0.6, seat_height])
    cube([width - 2*arm_width, 0.6, back_height]);

    // Frame/base
    color([0.4, 0.25, 0.12]) {
        cube([width, depth, seat_height - 0.5]);
        // Arms
        cube([arm_width, depth, seat_height + 0.3]);
        translate([width - arm_width, 0, 0])
        cube([arm_width, depth, seat_height + 0.3]);
    }
}

module part_bed(width=5, length=6.67, height=2, headboard_height=1.5) {
    frame_h = 0.8;

    // Frame
    color([0.55, 0.35, 0.17]) {
        cube([width, length, frame_h]);
        // Headboard
        translate([0, length - 0.3, frame_h])
        cube([width, 0.3, headboard_height]);
    }

    // Mattress
    color([0.9, 0.88, 0.85])
    translate([0.1, 0.1, frame_h])
    cube([width - 0.2, length - 0.5, height - frame_h]);

    // Pillow(s)
    color([0.95, 0.95, 0.93])
    translate([0.5, length - 1.5, height])
    cube([width - 1, 1, 0.3]);
}

module part_bookshelf(width=3, depth=1, height=6, shelves=4) {
    shelf_spacing = (height - 0.15) / shelves;
    color([0.55, 0.35, 0.17]) {
        // Sides
        cube([0.12, depth, height]);
        translate([width - 0.12, 0, 0])
        cube([0.12, depth, height]);
        // Back
        translate([0, depth - 0.08, 0])
        cube([width, 0.08, height]);
        // Shelves
        for (i = [0:shelves]) {
            translate([0, 0, i * shelf_spacing])
            cube([width, depth, 0.12]);
        }
    }
}

module part_desk(width=5, depth=2.5, height=2.5) {
    // Top
    color([0.55, 0.35, 0.17])
    translate([0, 0, height - 0.12])
    cube([width, depth, 0.12]);

    // Legs
    color([0.3, 0.3, 0.32]) {
        cube([0.2, 0.2, height - 0.12]);
        translate([width - 0.2, 0, 0])
        cube([0.2, 0.2, height - 0.12]);
        translate([0, depth - 0.2, 0])
        cube([0.2, 0.2, height - 0.12]);
        translate([width - 0.2, depth - 0.2, 0])
        cube([0.2, 0.2, height - 0.12]);
    }
}

// ============================================================
// KITCHEN & BATHROOM
// ============================================================

module part_kitchen_counter(width=8, depth=2, height=3, material="granite") {
    top_c = material == "marble" ? [0.9, 0.88, 0.85] :
            material == "wood" ? [0.55, 0.35, 0.17] :
            [0.3, 0.28, 0.26]; // granite

    // Cabinet base
    color([0.92, 0.9, 0.88])
    cube([width, depth, height - 0.15]);

    // Countertop
    color(top_c)
    translate([-0.08, -0.08, height - 0.15])
    cube([width + 0.16, depth + 0.16, 0.15]);
}

module part_kitchen_island(width=5, depth=3, height=3) {
    // Base
    color([0.92, 0.9, 0.88])
    cube([width, depth, height - 0.15]);

    // Countertop (granite)
    color([0.3, 0.28, 0.26])
    translate([-0.1, -0.1, height - 0.15])
    cube([width + 0.2, depth + 0.2, 0.15]);
}

module part_sink(width=2, depth=1.5, height=0.5) {
    color([0.85, 0.85, 0.87]) {
        difference() {
            cube([width, depth, height]);
            translate([0.1, 0.1, 0.1])
            cube([width - 0.2, depth - 0.2, height]);
        }
    }
    // Faucet
    color([0.75, 0.75, 0.77]) {
        translate([width/2, depth - 0.2, height])
        cylinder(r=0.08, h=0.8, $fn=16);
        translate([width/2, depth - 0.5, height + 0.8])
        rotate([90, 0, 0])
        cylinder(r=0.06, h=0.4, $fn=16);
    }
}

module part_bathtub(width=2.5, length=5, height=1.8) {
    color([0.95, 0.95, 0.97]) {
        difference() {
            // Outer shell - rounded
            minkowski() {
                cube([width - 0.3, length - 0.3, height - 0.15]);
                sphere(r=0.15, $fn=16);
            }
            // Inner cavity
            translate([0.15, 0.15, 0.3])
            minkowski() {
                cube([width - 0.6, length - 0.6, height]);
                sphere(r=0.1, $fn=16);
            }
        }
    }
}

module part_toilet(width=1.2, depth=2, height=1.3) {
    // Bowl
    color([0.95, 0.95, 0.97]) {
        // Base
        translate([width/2, depth*0.4, 0])
        scale([1, 1.3, 1])
        cylinder(r=width/2, h=height*0.55, $fn=32);
        // Tank
        translate([0.1, depth*0.65, 0])
        cube([width - 0.2, depth*0.3, height]);
        // Lid
        translate([width/2, depth*0.4, height*0.55])
        scale([1, 1.3, 0.1])
        cylinder(r=width/2 - 0.05, h=1, $fn=32);
    }
}

module part_shower(width=3, depth=3, height=7, glass=true) {
    // Base/tray
    color([0.9, 0.9, 0.92])
    cube([width, depth, 0.3]);

    // Walls (tile)
    color([0.85, 0.87, 0.9]) {
        cube([0.2, depth, height]);
        translate([0, 0, 0])
        cube([width, 0.2, height]);
    }

    // Glass panel
    if (glass) {
        color([0.7, 0.85, 0.95, 0.2])
        translate([width - 0.05, 0, 0.3])
        cube([0.05, depth, height - 0.3]);
    }

    // Shower head
    color([0.75, 0.75, 0.77]) {
        translate([width/2, 0.3, height - 0.5])
        sphere(r=0.2, $fn=16);
        translate([width/2, 0.3, height - 2])
        cylinder(r=0.04, h=1.5, $fn=12);
    }
}

// ============================================================
// EXTERIOR ELEMENTS
// ============================================================

module part_chimney(width=2, depth=2, height=6) {
    color([0.72, 0.4, 0.3]) // brick
    cube([width, depth, height]);

    // Cap
    color([0.6, 0.58, 0.55])
    translate([-0.15, -0.15, height])
    cube([width + 0.3, depth + 0.3, 0.25]);
}

module part_fence(length=10, height=4, style="picket") {
    if (style == "picket") {
        picket_w = 0.25;
        picket_spacing = 0.33;
        num_pickets = floor(length / (picket_w + picket_spacing));

        color([0.95, 0.95, 0.93]) {
            // Rails
            translate([0, 0, height * 0.3])
            cube([length, 0.1, 0.12]);
            translate([0, 0, height * 0.7])
            cube([length, 0.1, 0.12]);

            // Pickets
            for (i = [0:num_pickets-1]) {
                translate([i * (picket_w + picket_spacing), -0.02, 0])
                cube([picket_w, 0.12, height]);
            }

            // Posts
            cube([0.3, 0.3, height + 0.3]);
            translate([length - 0.3, -0.1, 0])
            cube([0.3, 0.3, height + 0.3]);
        }
    } else {
        // Privacy fence
        color([0.45, 0.3, 0.15]) {
            // Boards
            board_w = 0.5;
            num_boards = floor(length / board_w);
            for (i = [0:num_boards-1]) {
                translate([i * board_w, 0, 0])
                cube([board_w - 0.02, 0.1, height]);
            }
            // Rails
            translate([0, 0.1, height * 0.25])
            cube([length, 0.12, 0.12]);
            translate([0, 0.1, height * 0.75])
            cube([length, 0.12, 0.12]);
            // Posts
            cube([0.3, 0.3, height]);
            translate([length - 0.3, 0, 0])
            cube([0.3, 0.3, height]);
        }
    }
}

module part_deck(width=12, depth=10, height=1, board_direction=0) {
    board_w = 0.5;
    gap = 0.04;

    // Joists
    color([0.45, 0.3, 0.15])
    for (i = [0:floor(depth/2)]) {
        translate([0, i*2, 0])
        cube([width, 0.15, height - 0.08]);
    }

    // Deck boards
    color([0.5, 0.35, 0.2]) {
        if (board_direction == 0) {
            num = floor(depth / (board_w + gap));
            for (i = [0:num-1]) {
                translate([0, i*(board_w + gap), height - 0.08])
                cube([width, board_w, 0.08]);
            }
        } else {
            num = floor(width / (board_w + gap));
            for (i = [0:num-1]) {
                translate([i*(board_w + gap), 0, height - 0.08])
                cube([board_w, depth, 0.08]);
            }
        }
    }
}

module part_porch(width=12, depth=6, height=0.8, has_roof=true, roof_height=8, column_radius=0.35) {
    // Deck
    part_deck(width=width, depth=depth, height=height);

    if (has_roof) {
        // Columns
        for (x = [column_radius, width - column_radius]) {
            translate([x, column_radius, height])
            part_column(radius=column_radius, height=roof_height - height);

            translate([x, depth - column_radius, height])
            part_column(radius=column_radius, height=roof_height - height);
        }

        // Roof
        color([0.35, 0.25, 0.2])
        translate([-1, -1, roof_height])
        cube([width + 2, depth + 2, 0.3]);
    }
}

module part_driveway(width=12, length=20) {
    color([0.65, 0.63, 0.6])
    cube([width, length, 0.05]);
}

module part_walkway(width=3, length=15) {
    color([0.7, 0.68, 0.65])
    cube([width, length, 0.05]);
}

module part_planter(width=3, depth=1.5, height=1.5) {
    // Planter box
    color([0.6, 0.58, 0.55]) {
        difference() {
            cube([width, depth, height]);
            translate([0.15, 0.15, 0.15])
            cube([width - 0.3, depth - 0.3, height]);
        }
    }

    // Soil
    color([0.35, 0.25, 0.15])
    translate([0.15, 0.15, height - 0.4])
    cube([width - 0.3, depth - 0.3, 0.3]);

    // Simple bush/greenery
    color([0.25, 0.5, 0.2])
    translate([width/2, depth/2, height])
    scale([1, 0.6, 0.6])
    sphere(r=width/3, $fn=16);
}

module part_tree(trunk_height=6, trunk_radius=0.4, canopy_radius=5) {
    // Trunk
    color([0.45, 0.3, 0.15])
    cylinder(r=trunk_radius, h=trunk_height, $fn=12);

    // Canopy
    color([0.2, 0.45, 0.15])
    translate([0, 0, trunk_height])
    sphere(r=canopy_radius, $fn=24);
}

module part_bush(width=3, height=2, depth=3) {
    color([0.22, 0.42, 0.18])
    scale([width/2, depth/2, height/2])
    translate([1, 1, 1])
    sphere(r=1, $fn=20);
}

// ============================================================
// APPLIANCES
// ============================================================

module part_refrigerator(width=3, depth=2.5, height=5.8) {
    color([0.85, 0.85, 0.87]) {
        cube([width, depth, height]);
        // Handle
        translate([width - 0.15, -0.1, height*0.3])
        cube([0.08, 0.08, height*0.35]);
        translate([width - 0.15, -0.1, height*0.7])
        cube([0.08, 0.08, height*0.2]);
    }
}

module part_oven(width=2.5, depth=2.2, height=3) {
    // Body
    color([0.85, 0.85, 0.87])
    cube([width, depth, height]);

    // Door (glass)
    color([0.15, 0.15, 0.15])
    translate([0.1, -0.02, 0.3])
    cube([width - 0.2, 0.02, height*0.55]);

    // Handle
    color([0.75, 0.75, 0.77])
    translate([0.3, -0.15, height*0.6])
    cube([width - 0.6, 0.08, 0.08]);
}

module part_washer_dryer(width=2.2, depth=2.2, height=3) {
    color([0.92, 0.92, 0.94]) {
        cube([width, depth, height]);
        // Door (circular)
        translate([width/2, -0.01, height*0.45])
        rotate([-90, 0, 0])
        cylinder(r=width*0.35, h=0.02, $fn=32);
    }
}

// ============================================================
// LIGHTING & FIXTURES
// ============================================================

module part_ceiling_light(radius=0.5, drop=0.3) {
    // Base plate
    color([0.85, 0.85, 0.87])
    cylinder(r=0.2, h=0.05, $fn=16);

    // Shade
    color([0.95, 0.93, 0.88])
    translate([0, 0, -drop])
    cylinder(r1=radius, r2=radius*0.3, h=drop, $fn=24);
}

module part_wall_sconce(width=0.5, height=0.8, depth=0.3) {
    // Base plate
    color([0.75, 0.7, 0.55])
    cube([width, depth*0.3, height]);

    // Shade
    color([0.95, 0.93, 0.88])
    translate([0, 0, height*0.2])
    cube([width, depth, height*0.6]);
}

// ============================================================
// UTILITY
// ============================================================

module part_ac_unit(width=3, depth=3, height=2.5) {
    color([0.8, 0.8, 0.82])
    cube([width, depth, height]);

    // Fan grille
    color([0.4, 0.4, 0.42])
    translate([width/2, -0.01, height/2])
    rotate([-90, 0, 0])
    cylinder(r=height*0.35, h=0.02, $fn=32);
}

module part_water_heater(radius=1, height=5) {
    color([0.85, 0.85, 0.87])
    cylinder(r=radius, h=height, $fn=24);

    // Pipes on top
    color([0.75, 0.75, 0.77]) {
        translate([radius*0.3, 0, height])
        cylinder(r=0.08, h=0.5, $fn=12);
        translate([-radius*0.3, 0, height])
        cylinder(r=0.08, h=0.5, $fn=12);
    }
}

// ============================================================
// DECORATIVE COLUMNS & PILASTERS
// ============================================================

module part_pillar(radius=0.6, height=9, style="doric") {
    if (style == "doric") {
        // Doric column: simple, tapered, no base ornamentation
        color([0.92, 0.9, 0.88]) {
            // Base plinth
            translate([0, 0, 0])
            cylinder(r=radius*1.3, h=0.3, $fn=32);
            // Shaft (slight taper)
            translate([0, 0, 0.3])
            cylinder(r1=radius, r2=radius*0.85, h=height - 0.8, $fn=32);
            // Capital (simple slab)
            translate([0, 0, height - 0.5])
            cylinder(r1=radius*0.85, r2=radius*1.4, h=0.2, $fn=32);
            translate([0, 0, height - 0.3])
            cylinder(r=radius*1.4, h=0.3, $fn=32);
        }
    } else if (style == "ionic") {
        // Ionic column: scroll capital
        color([0.95, 0.95, 0.93]) {
            // Base with torus
            cylinder(r=radius*1.3, h=0.15, $fn=32);
            translate([0, 0, 0.15])
            rotate_extrude($fn=32) translate([radius*0.9, 0, 0]) circle(r=0.15, $fn=16);
            translate([0, 0, 0.3])
            cylinder(r=radius*1.1, h=0.1, $fn=32);
            // Fluted shaft
            translate([0, 0, 0.4])
            cylinder(r1=radius, r2=radius*0.88, h=height - 1.0, $fn=24);
            // Capital
            translate([0, 0, height - 0.6])
            cylinder(r1=radius*0.88, r2=radius*1.2, h=0.3, $fn=32);
            // Scroll volutes (simplified as wider cap)
            translate([-radius*1.5, 0, height - 0.3])
            cube([radius*3, radius*0.4, 0.3], center=true);
            translate([0, 0, height - 0.3])
            cylinder(r=radius*1.3, h=0.3, $fn=32);
        }
    } else {
        // Corinthian column: ornate capital
        color([0.95, 0.95, 0.93]) {
            // Base
            cylinder(r=radius*1.3, h=0.2, $fn=32);
            translate([0, 0, 0.2])
            cylinder(r=radius*1.15, h=0.15, $fn=32);
            // Shaft
            translate([0, 0, 0.35])
            cylinder(r1=radius, r2=radius*0.85, h=height - 1.2, $fn=24);
            // Capital (bell-shaped with flare)
            translate([0, 0, height - 0.85])
            cylinder(r1=radius*0.85, r2=radius*0.95, h=0.35, $fn=32);
            translate([0, 0, height - 0.5])
            cylinder(r1=radius*0.95, r2=radius*1.5, h=0.3, $fn=32);
            translate([0, 0, height - 0.2])
            cube([radius*3, radius*3, 0.2], center=true);
        }
    }
}

module part_pilaster(width=0.8, height=9, depth=0.25) {
    // Flat column attached to wall
    color([0.92, 0.9, 0.88]) {
        // Base
        cube([width + 0.2, depth + 0.1, 0.3]);
        // Shaft
        translate([0.1, 0, 0.3])
        cube([width, depth, height - 0.8]);
        // Capital
        translate([0, 0, height - 0.5])
        cube([width + 0.2, depth + 0.1, 0.5]);
    }
}

module part_arch(width=4, height=6, thickness=0.5, depth=1) {
    // Roman arch / doorway arch
    arch_radius = width / 2;
    straight_height = height - arch_radius;

    color([0.65, 0.63, 0.6]) {
        // Left pier
        cube([thickness, depth, straight_height]);
        // Right pier
        translate([width - thickness, 0, 0])
        cube([thickness, depth, straight_height]);
        // Arch top
        translate([width/2, 0, straight_height])
        rotate([-90, 0, 0])
        difference() {
            cylinder(r=arch_radius, h=depth, $fn=48);
            cylinder(r=arch_radius - thickness, h=depth + 0.1, $fn=48);
            translate([-arch_radius - 1, -arch_radius - 1, -0.1])
            cube([width + 2, arch_radius + 1, depth + 0.2]);
        }
    }
}

// ============================================================
// BALCONY & AWNING
// ============================================================

module part_balcony(width=8, depth=4, height=3, railing_style="metal") {
    // Floor slab
    color([0.6, 0.58, 0.55])
    cube([width, depth, 0.3]);

    // Railing
    railing_h = height;
    rc = railing_style == "metal" ? [0.3, 0.3, 0.32] : [0.95, 0.95, 0.93];
    color(rc) {
        // Top rail
        translate([0, depth - 0.1, railing_h])
        cube([width, 0.1, 0.08]);
        // Front rail
        translate([0, depth - 0.1, 0.3])
        cube([width, 0.1, 0.08]);
        // Balusters
        baluster_spacing = 0.4;
        num_bal = floor(width / baluster_spacing);
        for (i = [0:num_bal]) {
            translate([i * baluster_spacing, depth - 0.1, 0.3])
            cube([0.05, 0.1, railing_h - 0.3]);
        }
        // Side railings
        cube([0.1, depth, railing_h + 0.08]);
        translate([width - 0.1, 0, 0])
        cube([0.1, depth, railing_h + 0.08]);
    }
}

module part_awning(width=6, depth=3, style="fabric") {
    if (style == "fabric") {
        // Fabric awning
        color([0.6, 0.15, 0.15]) {
            hull() {
                cube([width, 0.05, 0.05]);
                translate([0, depth, -depth*0.4])
                cube([width, 0.05, 0.05]);
            }
        }
        // Support arms
        color([0.7, 0.72, 0.74])
        for (x = [0.3, width - 0.3]) {
            hull() {
                translate([x, 0, 0])
                cube([0.06, 0.06, 0.06]);
                translate([x, depth, -depth*0.4])
                cube([0.06, 0.06, 0.06]);
            }
        }
    } else {
        // Metal/canopy awning
        color([0.7, 0.72, 0.74]) {
            hull() {
                cube([width, 0.1, 0.1]);
                translate([0, depth, -0.3])
                cube([width, 0.1, 0.1]);
            }
        }
    }
}

module part_shutters(width=0.8, height=4, style="louvered") {
    // A pair of shutters (place next to a window)
    color([0.2, 0.25, 0.3]) {
        if (style == "louvered") {
            // Frame
            cube([width, 0.1, height]);
            // Louvers
            num_louvers = floor(height / 0.3);
            for (i = [0:num_louvers-1]) {
                translate([0.05, -0.05, i * 0.3 + 0.1])
                rotate([30, 0, 0])
                cube([width - 0.1, 0.15, 0.05]);
            }
        } else {
            // Raised panel
            cube([width, 0.1, height]);
            // Panels
            panel_h = (height - 0.6) / 2;
            translate([0.1, -0.03, 0.15])
            cube([width - 0.2, 0.05, panel_h]);
            translate([0.1, -0.03, 0.45 + panel_h])
            cube([width - 0.2, 0.05, panel_h]);
        }
    }
}

// ============================================================
// ADDITIONAL FURNITURE
// ============================================================

module part_coffee_table(width=4, depth=2, height=1.3, material="wood") {
    c = material == "glass" ? [0.7, 0.85, 0.95] :
        material == "dark_wood" ? [0.4, 0.25, 0.12] :
        [0.55, 0.35, 0.17];

    // Legs
    color(c)
    for (x = [0.15, width - 0.25], y = [0.15, depth - 0.25]) {
        translate([x, y, 0])
        cube([0.1, 0.1, height - 0.08]);
    }
    // Top
    color(c)
    translate([0, 0, height - 0.08])
    cube([width, depth, 0.08]);
}

module part_dining_table(width=6, depth=3.5, height=2.5, seats=6) {
    // Table top
    color([0.55, 0.35, 0.17])
    translate([0, 0, height - 0.12])
    cube([width, depth, 0.12]);

    // Legs
    color([0.55, 0.35, 0.17])
    for (x = [0.3, width - 0.5], y = [0.3, depth - 0.5]) {
        translate([x, y, 0])
        cube([0.2, 0.2, height - 0.12]);
    }

    // Chairs around the table
    chair_w = 1.4;
    chair_d = 1.4;
    // Sides
    side_seats = floor((seats - 2) / 2);
    spacing = (width - 1) / (side_seats + 1);
    for (i = [1:side_seats]) {
        // Front side
        translate([i * spacing - chair_w/2, -chair_d - 0.2, 0])
        part_chair(seat_width=chair_w, seat_depth=chair_d);
        // Back side
        translate([i * spacing - chair_w/2, depth + 0.2, 0])
        rotate([0, 0, 180])
        translate([-chair_w, -chair_d, 0])
        part_chair(seat_width=chair_w, seat_depth=chair_d);
    }
    // Ends
    translate([-chair_d - 0.2, depth/2 - chair_w/2, 0])
    rotate([0, 0, 90])
    translate([0, -chair_d, 0])
    part_chair(seat_width=chair_w, seat_depth=chair_d);

    translate([width + 0.2, depth/2 - chair_w/2, 0])
    rotate([0, 0, -90])
    translate([-chair_w, 0, 0])
    part_chair(seat_width=chair_w, seat_depth=chair_d);
}

module part_bar_stool(seat_radius=0.6, height=2.5) {
    // Legs (4)
    color([0.3, 0.3, 0.32])
    for (a = [0:90:270]) {
        rotate([0, 0, a])
        translate([seat_radius*0.6, 0, 0])
        cylinder(r=0.06, h=height - 0.15, $fn=12);
    }
    // Footrest ring
    color([0.3, 0.3, 0.32])
    translate([0, 0, height*0.35])
    difference() {
        cylinder(r=seat_radius*0.7, h=0.08, $fn=24);
        cylinder(r=seat_radius*0.7 - 0.08, h=0.1, $fn=24);
    }
    // Seat
    color([0.15, 0.15, 0.15])
    translate([0, 0, height - 0.15])
    cylinder(r=seat_radius, h=0.15, $fn=24);
}

module part_nightstand(width=1.5, depth=1.2, height=2) {
    color([0.55, 0.35, 0.17]) {
        // Body
        cube([width, depth, height]);
        // Drawer fronts
        translate([0.05, -0.02, 0.1])
        cube([width - 0.1, 0.02, height*0.4]);
        translate([0.05, -0.02, height*0.55])
        cube([width - 0.1, 0.02, height*0.4]);
    }
    // Handles
    color([0.75, 0.7, 0.55]) {
        translate([width/2 - 0.2, -0.08, height*0.3])
        cube([0.4, 0.05, 0.06]);
        translate([width/2 - 0.2, -0.08, height*0.75])
        cube([0.4, 0.05, 0.06]);
    }
}

module part_dresser(width=4, depth=1.5, height=3) {
    color([0.55, 0.35, 0.17]) {
        cube([width, depth, height]);
        // 3 rows of 2 drawers
        for (row = [0:2]) {
            dh = (height - 0.3) / 3;
            for (col = [0:1]) {
                dw = (width - 0.3) / 2;
                translate([0.1 + col*(dw + 0.1), -0.02, 0.1 + row*(dh + 0.05)])
                cube([dw, 0.02, dh - 0.05]);
            }
        }
    }
    // Handles
    color([0.75, 0.7, 0.55]) {
        dh = (height - 0.3) / 3;
        dw = (width - 0.3) / 2;
        for (row = [0:2]) {
            for (col = [0:1]) {
                translate([0.1 + col*(dw + 0.1) + dw/2 - 0.2, -0.08, 0.1 + row*(dh + 0.05) + dh/2])
                cube([0.4, 0.05, 0.06]);
            }
        }
    }
}

module part_wardrobe(width=5, depth=2, height=7) {
    // Body
    color([0.55, 0.35, 0.17]) {
        cube([width, depth, height]);
    }
    // Door fronts
    color([0.5, 0.35, 0.2]) {
        translate([0.05, -0.02, 0.05])
        cube([width/2 - 0.08, 0.02, height - 0.1]);
        translate([width/2 + 0.03, -0.02, 0.05])
        cube([width/2 - 0.08, 0.02, height - 0.1]);
    }
    // Handles
    color([0.75, 0.7, 0.55]) {
        translate([width/2 - 0.15, -0.08, height/2 - 0.3])
        cube([0.06, 0.05, 0.6]);
        translate([width/2 + 0.09, -0.08, height/2 - 0.3])
        cube([0.06, 0.05, 0.6]);
    }
}

module part_tv_stand(width=5, depth=1.5, height=2) {
    // Cabinet body
    color([0.3, 0.28, 0.26]) {
        cube([width, depth, height]);
        // Shelf
        translate([0.1, 0.1, height*0.45])
        cube([width - 0.2, depth - 0.2, 0.06]);
    }
    // TV screen (flat panel on top)
    color([0.1, 0.1, 0.1]) {
        translate([width*0.1, depth/2 - 0.05, height])
        cube([width*0.8, 0.1, width*0.45]);
    }
    // TV stand base
    color([0.3, 0.3, 0.32])
    translate([width/2 - 0.4, depth/2 - 0.3, height])
    cube([0.8, 0.6, 0.05]);
}

module part_piano(width=5, depth=2, height=3.2) {
    // Body
    color([0.12, 0.1, 0.08]) {
        cube([width, depth, height]);
    }
    // Key cover / fallboard
    color([0.12, 0.1, 0.08])
    translate([0.3, -0.08, height*0.6])
    cube([width - 0.6, 0.08, height*0.05]);

    // Keys area
    color([0.95, 0.95, 0.93])
    translate([0.3, -0.15, height*0.55])
    cube([width - 0.6, 0.15, 0.08]);

    // Black keys
    color([0.1, 0.1, 0.1]) {
        key_spacing = (width - 0.6) / 36; // Approximate octave spacing
        for (i = [0:35]) {
            // Place black keys on the standard positions
            if (i % 7 == 1 || i % 7 == 2 || i % 7 == 4 || i % 7 == 5 || i % 7 == 6) {
                translate([0.3 + i * key_spacing, -0.15, height*0.55 + 0.08])
                cube([key_spacing*0.6, 0.1, 0.06]);
            }
        }
    }
}

// ============================================================
// KITCHEN EXTRAS
// ============================================================

module part_kitchen_cabinet(width=2, depth=1, height=2.5, style="lower") {
    if (style == "lower") {
        // Base cabinet
        color([0.55, 0.35, 0.17]) {
            cube([width, depth, height]);
            // Door
            translate([0.05, -0.02, 0.05])
            cube([width - 0.1, 0.02, height - 0.1]);
        }
        // Counter top
        color([0.3, 0.28, 0.26])
        translate([-0.05, -0.05, height])
        cube([width + 0.1, depth + 0.1, 0.12]);
        // Handle
        color([0.75, 0.7, 0.55])
        translate([width/2 - 0.2, -0.08, height*0.55])
        cube([0.4, 0.05, 0.06]);
    } else {
        // Upper/wall cabinet
        color([0.55, 0.35, 0.17]) {
            cube([width, depth*0.6, height*0.6]);
            // Door
            translate([0.05, -0.02, 0.05])
            cube([width - 0.1, 0.02, height*0.6 - 0.1]);
        }
        // Handle
        color([0.75, 0.7, 0.55])
        translate([width/2 - 0.2, -0.08, height*0.3])
        cube([0.4, 0.05, 0.06]);
    }
}

module part_range_hood(width=2.5, depth=1.5, height=2) {
    // Hood body (tapered)
    color([0.85, 0.85, 0.87])
    hull() {
        translate([0, 0, 0])
        cube([width, depth, 0.1]);
        translate([width*0.1, depth*0.1, height])
        cube([width*0.5, depth*0.5, 0.1]);
    }
    // Chimney
    color([0.85, 0.85, 0.87])
    translate([width*0.2, depth*0.2, height])
    cube([width*0.3, depth*0.3, height*0.5]);
}

module part_dishwasher(width=2, depth=2, height=2.8) {
    color([0.85, 0.85, 0.87]) {
        cube([width, depth, height]);
        // Handle
        translate([0.2, -0.1, height*0.85])
        cube([width - 0.4, 0.08, 0.08]);
    }
}

module part_microwave(width=2, depth=1.2, height=1) {
    color([0.3, 0.3, 0.32])
    cube([width, depth, height]);

    // Door (glass)
    color([0.15, 0.15, 0.15])
    translate([0.05, -0.02, 0.05])
    cube([width*0.65, 0.02, height - 0.1]);

    // Control panel
    color([0.2, 0.2, 0.2])
    translate([width*0.72, -0.02, 0.05])
    cube([width*0.25, 0.02, height - 0.1]);

    // Handle
    color([0.75, 0.75, 0.77])
    translate([width*0.7, -0.1, 0.15])
    cube([0.06, 0.08, height - 0.3]);
}

// ============================================================
// BATHROOM EXTRAS
// ============================================================

module part_vanity(width=4, depth=1.8, height=2.8) {
    // Cabinet body
    color([0.55, 0.35, 0.17]) {
        cube([width, depth, height]);
        // Doors
        translate([0.05, -0.02, 0.05])
        cube([width/2 - 0.08, 0.02, height - 0.4]);
        translate([width/2 + 0.03, -0.02, 0.05])
        cube([width/2 - 0.08, 0.02, height - 0.4]);
    }
    // Counter top
    color([0.85, 0.83, 0.8])
    translate([-0.05, -0.05, height])
    cube([width + 0.1, depth + 0.1, 0.1]);

    // Sink basin
    color([0.95, 0.95, 0.97])
    translate([width/2, depth/2, height + 0.1])
    scale([1.2, 0.8, 0.4])
    sphere(r=0.6, $fn=24);

    // Faucet
    color([0.75, 0.75, 0.77]) {
        translate([width/2, depth*0.15, height + 0.1])
        cylinder(r=0.06, h=0.8, $fn=12);
        translate([width/2, depth*0.15, height + 0.9])
        rotate([60, 0, 0])
        cylinder(r=0.04, h=0.5, $fn=12);
    }

    // Mirror above
    color([0.7, 0.85, 0.95])
    translate([0.2, -0.05, height + 0.5])
    cube([width - 0.4, 0.05, height*0.8]);

    // Mirror frame
    color([0.75, 0.75, 0.77]) {
        translate([0.15, -0.08, height + 0.45])
        cube([width - 0.3, 0.03, 0.05]);
        translate([0.15, -0.08, height + 0.45 + height*0.8 + 0.05])
        cube([width - 0.3, 0.03, 0.05]);
    }
}

// ============================================================
// OUTDOOR STRUCTURES
// ============================================================

module part_pergola(width=12, depth=10, height=8, beam_size=0.4) {
    // Posts (4 corners)
    color([0.55, 0.35, 0.17])
    for (x = [0, width - beam_size], y = [0, depth - beam_size]) {
        translate([x, y, 0])
        cube([beam_size, beam_size, height]);
    }

    // Main beams (lengthwise)
    color([0.55, 0.35, 0.17])
    for (y = [0, depth - beam_size]) {
        translate([-0.5, y, height])
        cube([width + 1, beam_size, beam_size]);
    }

    // Cross rafters
    color([0.5, 0.35, 0.2]) {
        num_rafters = floor(width / 1.5);
        for (i = [0:num_rafters]) {
            translate([i * (width / num_rafters), -0.5, height + beam_size])
            cube([beam_size*0.6, depth + 1, beam_size*0.8]);
        }
    }
}

module part_gazebo(radius=6, height=8, sides=8) {
    // Posts
    color([0.95, 0.95, 0.93])
    for (i = [0:sides-1]) {
        angle = i * 360 / sides;
        translate([cos(angle) * radius, sin(angle) * radius, 0])
        cylinder(r=0.25, h=height, $fn=12);
    }

    // Floor
    color([0.5, 0.35, 0.2])
    cylinder(r=radius + 0.3, h=0.15, $fn=sides);

    // Railing between posts
    color([0.95, 0.95, 0.93])
    for (i = [0:sides-1]) {
        angle1 = i * 360 / sides;
        angle2 = (i + 1) * 360 / sides;
        x1 = cos(angle1) * radius;
        y1 = sin(angle1) * radius;
        x2 = cos(angle2) * radius;
        y2 = sin(angle2) * radius;
        // Top rail
        hull() {
            translate([x1, y1, height*0.4])
            sphere(r=0.06, $fn=8);
            translate([x2, y2, height*0.4])
            sphere(r=0.06, $fn=8);
        }
    }

    // Roof (cone)
    color([0.35, 0.25, 0.2])
    translate([0, 0, height])
    cylinder(r1=radius + 1, r2=0.3, h=height*0.35, $fn=sides);
}

module part_pool(width=16, length=30, depth=5) {
    // Water surface
    color([0.3, 0.55, 0.8, 0.6])
    translate([0.5, 0.5, -depth + 0.2])
    cube([width - 1, length - 1, depth - 0.2]);

    // Pool walls/coping
    color([0.85, 0.87, 0.9])
    difference() {
        cube([width, length, 0.3]);
        translate([0.4, 0.4, -0.1])
        cube([width - 0.8, length - 0.8, 0.5]);
    }
}

module part_fire_pit(radius=2, height=1) {
    // Stone ring
    color([0.55, 0.53, 0.5])
    difference() {
        cylinder(r=radius, h=height, $fn=24);
        translate([0, 0, 0.15])
        cylinder(r=radius - 0.3, h=height, $fn=24);
    }
    // Ash/fire bed
    color([0.25, 0.22, 0.2])
    cylinder(r=radius - 0.3, h=0.15, $fn=24);
}

module part_outdoor_kitchen(width=8, depth=2.5, height=3) {
    // Base/counter
    color([0.55, 0.53, 0.5])
    cube([width, depth, height]);

    // Counter top (granite)
    color([0.3, 0.28, 0.26])
    translate([-0.1, -0.1, height])
    cube([width + 0.2, depth + 0.2, 0.12]);

    // Grill area
    color([0.3, 0.3, 0.32])
    translate([width*0.3, -0.05, height + 0.12])
    cube([width*0.4, depth*0.6, 0.3]);

    // Grill grate
    color([0.2, 0.2, 0.2])
    translate([width*0.32, 0, height + 0.42])
    cube([width*0.36, depth*0.5, 0.05]);
}

module part_bench(width=5, depth=1.5, height=1.5, material="wood") {
    c = material == "stone" ? [0.65, 0.63, 0.6] :
        material == "metal" ? [0.3, 0.3, 0.32] :
        [0.55, 0.35, 0.17];

    // Seat
    color(c)
    translate([0, 0, height - 0.12])
    cube([width, depth, 0.12]);

    // Legs
    color(c) {
        cube([0.2, depth, height - 0.12]);
        translate([width - 0.2, 0, 0])
        cube([0.2, depth, height - 0.12]);
    }

    // Back rest
    color(c)
    translate([0, depth - 0.12, height])
    cube([width, 0.12, height*0.7]);
}

module part_lamp_post(height=10, style="classic") {
    // Pole
    color([0.3, 0.3, 0.32])
    cylinder(r=0.15, h=height, $fn=12);

    // Base
    color([0.3, 0.3, 0.32])
    cylinder(r=0.5, h=0.3, $fn=16);

    if (style == "classic") {
        // Lantern housing
        color([0.3, 0.3, 0.32]) {
            translate([0, 0, height])
            cylinder(r1=0.3, r2=0.5, h=0.3, $fn=16);
            translate([0, 0, height + 0.3])
            cylinder(r=0.5, h=0.8, $fn=6);
            translate([0, 0, height + 1.1])
            cylinder(r1=0.5, r2=0.15, h=0.3, $fn=16);
        }
        // Light (warm glow)
        color([1, 0.95, 0.8, 0.5])
        translate([0, 0, height + 0.5])
        sphere(r=0.35, $fn=16);
    } else {
        // Modern
        color([0.3, 0.3, 0.32])
        translate([-0.4, 0, height])
        rotate([0, 100, 0])
        cylinder(r=0.08, h=1.5, $fn=12);
        color([0.95, 0.93, 0.88])
        translate([1, 0, height - 0.3])
        sphere(r=0.3, $fn=16);
    }
}

module part_mailbox(width=0.8, depth=0.6, height=3.5) {
    // Post
    color([0.55, 0.35, 0.17])
    translate([width/2 - 0.15, depth/2 - 0.15, 0])
    cube([0.3, 0.3, height - 1]);

    // Box
    color([0.2, 0.2, 0.2]) {
        translate([0, 0, height - 1])
        cube([width, depth, 0.7]);
        // Rounded top
        translate([0, depth/2, height - 0.3])
        rotate([0, 90, 0])
        cylinder(r=depth/2, h=width, $fn=16);
    }
}

// ============================================================
// INTERIOR DETAILS
// ============================================================

module part_fireplace(width=5, depth=1.5, height=4, material="brick") {
    c = material == "stone" ? [0.65, 0.63, 0.6] :
        material == "marble" ? [0.9, 0.88, 0.85] :
        [0.72, 0.4, 0.3]; // brick default

    // Surround
    color(c) {
        // Main body
        cube([width, depth, height]);
        // Mantel
        translate([-0.3, -0.3, height])
        cube([width + 0.6, depth + 0.3, 0.3]);
    }

    // Firebox opening
    color([0.15, 0.12, 0.1]) {
        fw = width * 0.6;
        fh = height * 0.5;
        translate([width/2 - fw/2, -0.05, 0.2])
        cube([fw, depth*0.4, fh]);
    }

    // Chimney breast above
    color(c)
    translate([width*0.15, 0, height + 0.3])
    cube([width*0.7, depth, height*0.3]);
}

module part_ceiling_fan(radius=2, drop=1) {
    // Mount
    color([0.75, 0.7, 0.55])
    cylinder(r=0.15, h=0.1, $fn=16);

    // Down rod
    color([0.75, 0.7, 0.55])
    translate([0, 0, -drop])
    cylinder(r=0.06, h=drop, $fn=12);

    // Motor housing
    color([0.75, 0.7, 0.55])
    translate([0, 0, -drop - 0.2])
    cylinder(r=0.3, h=0.2, $fn=24);

    // Blades (5)
    color([0.55, 0.35, 0.17])
    for (a = [0:72:288]) {
        rotate([0, 0, a])
        translate([0.2, -0.15, -drop - 0.15])
        cube([radius - 0.2, 0.3, 0.04]);
    }

    // Light (optional)
    color([0.95, 0.93, 0.88])
    translate([0, 0, -drop - 0.5])
    sphere(r=0.25, $fn=16);
}

module part_chandelier(radius=1.5, drop=2, arms=6) {
    // Chain
    color([0.75, 0.7, 0.55])
    cylinder(r=0.04, h=0.1, $fn=8);

    color([0.75, 0.7, 0.55])
    translate([0, 0, -drop + 0.3])
    cylinder(r=0.04, h=drop - 0.3, $fn=8);

    // Central hub
    color([0.75, 0.7, 0.55])
    translate([0, 0, -drop])
    cylinder(r=0.2, h=0.3, $fn=16);

    // Arms with lights
    for (a = [0:360/arms:359]) {
        rotate([0, 0, a]) {
            // Arm
            color([0.75, 0.7, 0.55])
            translate([0, 0, -drop + 0.15])
            rotate([0, -20, 0])
            cylinder(r=0.04, h=radius, $fn=8);

            // Candle/light
            color([0.95, 0.93, 0.88])
            translate([radius*0.94, 0, -drop + 0.15 + radius*0.34])
            cylinder(r=0.12, h=0.3, $fn=12);
        }
    }
}

module part_floor_lamp(height=5.5, shade_radius=0.6) {
    // Base
    color([0.3, 0.3, 0.32])
    cylinder(r=0.5, h=0.1, $fn=24);

    // Pole
    color([0.3, 0.3, 0.32])
    cylinder(r=0.06, h=height - shade_radius, $fn=12);

    // Shade
    color([0.95, 0.93, 0.88])
    translate([0, 0, height - shade_radius*1.5])
    cylinder(r1=shade_radius, r2=shade_radius*0.4, h=shade_radius*1.2, $fn=24);
}

module part_crown_molding(length=10, size=0.25) {
    // Crown molding profile (simplified)
    color([0.95, 0.95, 0.93])
    rotate([0, 90, 0])
    linear_extrude(height=length)
    polygon([
        [0, 0],
        [size, 0],
        [0, size]
    ]);
}

module part_baseboard(length=10, height=0.4, thickness=0.06) {
    color([0.95, 0.95, 0.93])
    cube([length, thickness, height]);
}

module part_wainscoting(width=10, height=3, panel_width=1.5) {
    // Rail
    color([0.95, 0.95, 0.93]) {
        // Top rail (chair rail)
        translate([0, 0, height])
        cube([width, 0.08, 0.15]);
        // Base rail
        cube([width, 0.06, 0.2]);
    }

    // Panels
    color([0.92, 0.9, 0.88]) {
        num_panels = floor(width / (panel_width + 0.2));
        for (i = [0:num_panels-1]) {
            translate([0.15 + i*(panel_width + 0.2), -0.02, 0.3])
            cube([panel_width, 0.02, height - 0.45]);
        }
    }
}

module part_staircase_spiral(radius=3, height=9, turns=1, steps=16) {
    step_angle = turns * 360 / steps;
    step_height = height / steps;

    for (i = [0:steps-1]) {
        angle = i * step_angle;
        color([0.55, 0.35, 0.17])
        translate([0, 0, i * step_height])
        rotate([0, 0, angle])
        translate([0, -0.4, 0])
        cube([radius, 0.8, step_height * 0.9]);
    }

    // Central pole
    color([0.3, 0.3, 0.32])
    cylinder(r=0.15, h=height + 1, $fn=16);

    // Railing
    color([0.3, 0.3, 0.32])
    for (i = [0:steps-1]) {
        angle = i * step_angle;
        translate([0, 0, i * step_height + step_height])
        rotate([0, 0, angle])
        translate([radius - 0.1, 0, 0])
        cylinder(r=0.04, h=3, $fn=8);
    }
}
