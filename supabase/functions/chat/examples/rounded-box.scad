// Parametric rounded box with configurable corner radius
// Good for enclosures, cases, and containers

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
    
    // Hollow out the inside
    translate([wall_thickness, wall_thickness, wall_thickness])
    rounded_box(
        box_length - 2*wall_thickness,
        box_width - 2*wall_thickness,
        box_height,
        corner_radius - wall_thickness/2
    );
}

