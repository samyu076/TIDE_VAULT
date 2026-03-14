import math
import random

def generate_jagged_line(start, end, segments, amplitude, rand_seed):
    random.seed(rand_seed)
    lines = []
    lat1, lng1 = start
    lat2, lng2 = end
    
    # Base vector
    dlat = (lat2 - lat1) / segments
    dlng = (lng2 - lng1) / segments
    
    # Perpendicular vector for noise
    length = math.hypot(dlat, dlng)
    px = -dlng / length * amplitude
    py = dlat / length * amplitude
    
    current_lat, current_lng = lat1, lng1
    points = [[round(current_lat, 5), round(current_lng, 5)]]
    
    for i in range(1, segments):
        base_lat = lat1 + dlat * i
        base_lng = lng1 + dlng * i
        
        # Add bounded noise
        noise = random.uniform(-1, 1)
        # Smoothing trend
        point_lat = base_lat + px * noise
        point_lng = base_lng + py * noise
        points.append([round(point_lat, 5), round(point_lng, 5)])
        
    points.append([round(lat2, 5), round(lng2, 5)])
    return points

# Location A (Juhu side)
a_2011 = generate_jagged_line([19.055, 72.823], [19.075, 72.826], 15, 0.0005, 42)
a_2019 = generate_jagged_line([19.055, 72.823], [19.075, 72.826], 15, 0.0008, 43)

# Location B (Aksa side)
c_2011 = generate_jagged_line([19.165, 72.795], [19.185, 72.785], 15, 0.0004, 99)
c_2019 = generate_jagged_line([19.165, 72.795], [19.185, 72.785], 15, 0.0007, 100)

with open('realistic_coords.js', 'w') as f:
    f.write("export const REAL_COORDS = {\n")
    f.write(f"  A_2011: {a_2011},\n")
    f.write(f"  A_2019: {a_2019},\n")
    f.write(f"  C_2011: {c_2011},\n")
    f.write(f"  C_2019: {c_2019}\n")
    f.write("};\n")
print("Done")
