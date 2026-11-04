import json
import math
import os
import struct
import zlib

PROD_DIR = "C:/Users/ADMIN/.antigravity-extensions-src/jetbrains-intellij-new-ui-dark/icons/product-icons"
WOFF_PATH = os.path.join(PROD_DIR, "intellij-expui-icons.woff")
JSON_PATH = os.path.join(PROD_DIR, "intellij-new-ui-product-icons.json")

os.makedirs(PROD_DIR, exist_ok=True)

# Coordinate space: 0..1024 EM square (baseline at 0, ascent 1024, descent 0)
# Helper geometry builders (all contours clockwise for outer, counter-clockwise for inner holes in TrueType)
def rect_contour(x1, y1, x2, y2, hole=False):
    pts = [(x1, y1), (x1, y2), (x2, y2), (x2, y1)]
    if hole:
        pts.reverse()
    return [(int(round(x)), int(round(y)), 1) for x, y in pts]

def poly_contour(pts, hole=False):
    p = list(pts)
    if hole:
        p.reverse()
    return [(int(round(x)), int(round(y)), 1) for x, y in p]

def stroke_segment(x1, y1, x2, y2, thickness=88):
    dx = x2 - x1
    dy = y2 - y1
    length = math.hypot(dx, dy)
    if length == 0:
        return rect_contour(x1 - thickness / 2, y1 - thickness / 2, x1 + thickness / 2, y1 + thickness / 2)
    nx = -dy / length * (thickness / 2.0)
    ny = dx / length * (thickness / 2.0)
    pts = [
        (x1 + nx, y1 + ny),
        (x2 + nx, y2 + ny),
        (x2 - nx, y2 - ny),
        (x1 - nx, y1 - ny),
    ]
    return poly_contour(pts, hole=False)

def circle_contour(cx, cy, r, hole=False, steps=16):
    pts = []
    for i in range(steps):
        # Clockwise in Y-up means angle goes from 2*pi down to 0
        angle = -2.0 * math.pi * i / steps
        pts.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    if hole:
        pts.reverse()
    return [(int(round(x)), int(round(y)), 1) for x, y in pts]

def ring_contours(cx, cy, r_outer, r_inner, steps=16):
    return [
        circle_contour(cx, cy, r_outer, hole=False, steps=steps),
        circle_contour(cx, cy, r_inner, hole=True, steps=steps),
    ]

def hollow_box(x1, y1, x2, y2, t=80):
    return [
        rect_contour(x1, y1, x2, y2, hole=False),
        rect_contour(x1 + t, y1 + t, x2 - t, y2 - t, hole=True),
    ]

# Define JetBrains New UI (expui) 16x16 style glyphs mapped to 1024x1024 grid
GLYPH_SPECS = [
    # 0xE001: run / play (JetBrains rounded play triangle)
    (0xE001, ["run", "debug-start"], [
        poly_contour([(240, 160), (240, 864), (840, 512)], hole=False),
        poly_contour([(328, 300), (680, 512), (328, 724)], hole=True),
    ]),
    # 0xE002: debug / bug (JetBrains expui bug icon)
    (0xE002, ["debug", "bug", "debug-alt"], (
        ring_contours(512, 460, 240, 155) + [
            rect_contour(472, 220, 552, 700),
            stroke_segment(200, 620, 310, 540, 72),
            stroke_segment(824, 620, 714, 540, 72),
            stroke_segment(180, 460, 280, 460, 72),
            stroke_segment(744, 460, 844, 460, 72),
            stroke_segment(200, 300, 310, 380, 72),
            stroke_segment(824, 300, 714, 380, 72),
            circle_contour(512, 740, 90, hole=False, steps=12),
        ]
    )),
    # 0xE003: debug-stop (JetBrains hollow/rounded stop square)
    (0xE003, ["debug-stop", "primitive-square"], hollow_box(220, 220, 804, 804, 88)),
    # 0xE004: debug-restart / refresh / sync (Circular arrow)
    (0xE004, ["debug-restart", "refresh", "sync"], (
        ring_contours(512, 512, 320, 232) + [
            poly_contour([(680, 860), (880, 860), (880, 660)], hole=False),
        ]
    )),
    # 0xE005: debug-step-over
    (0xE005, ["debug-step-over"], [
        stroke_segment(220, 480, 512, 760, 84),
        stroke_segment(512, 760, 804, 480, 84),
        poly_contour([(660, 440), (840, 440), (840, 620)], hole=False),
        rect_contour(200, 180, 824, 268),
    ]),
    # 0xE006: debug-step-into
    (0xE006, ["debug-step-into"], [
        rect_contour(468, 320, 556, 860),
        stroke_segment(300, 480, 512, 280, 84),
        stroke_segment(724, 480, 512, 280, 84),
        rect_contour(200, 160, 824, 240),
    ]),
    # 0xE007: debug-step-out
    (0xE007, ["debug-step-out"], [
        rect_contour(468, 280, 556, 820),
        stroke_segment(300, 640, 512, 840, 84),
        stroke_segment(724, 640, 512, 840, 84),
        rect_contour(200, 160, 824, 240),
    ]),
    # 0xE008: debug-pause
    (0xE008, ["debug-pause"], [
        rect_contour(280, 200, 410, 824),
        rect_contour(614, 200, 744, 824),
    ]),
    # 0xE009: search (JetBrains magnifying glass)
    (0xE009, ["search"], (
        ring_contours(450, 574, 260, 172) + [
            stroke_segment(620, 404, 840, 184, 88),
        ]
    )),
    # 0xE00A: replace
    (0xE00A, ["replace", "replace-all"], [
        rect_contour(180, 620, 540, 840),
        rect_contour(484, 184, 844, 404),
        stroke_segment(260, 480, 440, 300, 76),
        stroke_segment(580, 720, 760, 540, 76),
    ]),
    # 0xE00B: filter (JetBrains funnel)
    (0xE00B, ["filter", "filter-filled"], [
        poly_contour([(160, 800), (864, 800), (576, 460), (576, 200), (448, 200), (448, 460)], hole=False),
        poly_contour([(290, 716), (492, 480), (532, 480), (734, 716)], hole=True),
    ]),
    # 0xE00C: collapse-all
    (0xE00C, ["collapse-all"], [
        rect_contour(200, 472, 824, 552),
        stroke_segment(340, 780, 512, 610, 80),
        stroke_segment(684, 780, 512, 610, 80),
        stroke_segment(340, 244, 512, 414, 80),
        stroke_segment(684, 244, 512, 414, 80),
    ]),
    # 0xE00D: expand-all
    (0xE00D, ["expand-all"], [
        rect_contour(200, 472, 824, 552),
        stroke_segment(340, 650, 512, 820, 80),
        stroke_segment(684, 650, 512, 820, 80),
        stroke_segment(340, 374, 512, 204, 80),
        stroke_segment(684, 374, 512, 204, 80),
    ]),
    # 0xE00E: close (JetBrains clean X)
    (0xE00E, ["close", "clear-all", "chrome-close"], [
        stroke_segment(240, 240, 784, 784, 84),
        stroke_segment(240, 784, 784, 240, 84),
    ]),
    # 0xE00F: add / plus
    (0xE00F, ["add", "plus"], [
        rect_contour(468, 200, 556, 824),
        rect_contour(200, 468, 824, 556),
    ]),
    # 0xE010: trash
    (0xE010, ["trash"], (
        hollow_box(260, 180, 764, 740, 80) + [
            rect_contour(180, 740, 844, 820),
            rect_contour(400, 820, 624, 884),
        ]
    )),
    # 0xE011: edit / pencil
    (0xE011, ["edit"], [
        stroke_segment(240, 240, 760, 760, 110),
        poly_contour([(180, 180), (220, 320), (320, 220)], hole=False),
    ]),
    # 0xE012: settings-gear (JetBrains gear)
    (0xE012, ["settings-gear", "gear"], (
        ring_contours(512, 512, 280, 150) + [
            rect_contour(464, 760, 560, 884),
            rect_contour(464, 140, 560, 264),
            rect_contour(760, 464, 884, 560),
            rect_contour(140, 464, 264, 560),
            stroke_segment(680, 680, 780, 780, 92),
            stroke_segment(244, 244, 344, 344, 92),
            stroke_segment(680, 344, 780, 244, 92),
            stroke_segment(244, 780, 344, 680, 92),
        ]
    )),
    # 0xE013: more / kebab-vertical (JetBrains 3 vertical dots)
    (0xE013, ["more", "kebab-vertical", "ellipsis"], [
        circle_contour(512, 780, 68, hole=False, steps=12),
        circle_contour(512, 512, 68, hole=False, steps=12),
        circle_contour(512, 244, 68, hole=False, steps=12),
    ]),
    # 0xE014: chevron-right
    (0xE014, ["chevron-right"], [
        stroke_segment(380, 760, 640, 512, 84),
        stroke_segment(380, 264, 640, 512, 84),
    ]),
    # 0xE015: chevron-down
    (0xE015, ["chevron-down"], [
        stroke_segment(264, 640, 512, 380, 84),
        stroke_segment(760, 640, 512, 380, 84),
    ]),
    # 0xE016: chevron-up
    (0xE016, ["chevron-up"], [
        stroke_segment(264, 380, 512, 640, 84),
        stroke_segment(760, 380, 512, 640, 84),
    ]),
    # 0xE017: chevron-left
    (0xE017, ["chevron-left"], [
        stroke_segment(640, 760, 380, 512, 84),
        stroke_segment(640, 264, 380, 512, 84),
    ]),
    # 0xE018: folder / folder-opened
    (0xE018, ["folder", "folder-opened", "root-folder", "root-folder-opened"], [
        poly_contour([(120, 200), (120, 800), (420, 800), (520, 700), (904, 700), (904, 200)], hole=False),
        poly_contour([(204, 284), (820, 284), (820, 616), (484, 616), (384, 716), (204, 716)], hole=True),
    ]),
    # 0xE019: file
    (0xE019, ["file", "new-file"], [
        poly_contour([(220, 140), (220, 884), (640, 884), (804, 720), (804, 140)], hole=False),
        poly_contour([(304, 224), (720, 224), (720, 680), (600, 800), (304, 800)], hole=True),
    ]),
    # 0xE01A: source-control / git-branch (JetBrains VCS branch icon)
    (0xE01A, ["source-control", "git-branch", "git-merge"], (
        ring_contours(320, 760, 110, 48, steps=12) +
        ring_contours(320, 264, 110, 48, steps=12) +
        ring_contours(720, 680, 110, 48, steps=12) + [
            rect_contour(280, 360, 360, 660),
            stroke_segment(320, 440, 720, 580, 80),
        ]
    )),
    # 0xE01B: git-commit
    (0xE01B, ["git-commit", "git-pull-request"], (
        ring_contours(512, 512, 200, 112) + [
            rect_contour(120, 472, 320, 552),
            rect_contour(704, 472, 904, 552),
        ]
    )),
    # 0xE01C: discard / history (Rollback arrow)
    (0xE01C, ["discard", "history"], [
        stroke_segment(220, 640, 420, 820, 80),
        stroke_segment(220, 640, 420, 460, 80),
        rect_contour(240, 600, 760, 680),
        rect_contour(680, 240, 760, 680),
        rect_contour(320, 240, 760, 320),
    ]),
    # 0xE01D: terminal / output (JetBrains >_ terminal icon)
    (0xE01D, ["terminal", "output", "console"], (
        hollow_box(120, 160, 904, 864, 76) + [
            stroke_segment(280, 640, 460, 512, 72),
            stroke_segment(280, 384, 460, 512, 72),
            rect_contour(500, 340, 720, 412),
        ]
    )),
    # 0xE01E: error / warning / info / bell
    (0xE01E, ["error", "warning", "info", "bell"], (
        ring_contours(512, 512, 360, 272) + [
            rect_contour(468, 440, 556, 720),
            circle_contour(512, 310, 52, hole=False, steps=12),
        ]
    )),
    # 0xE01F: split-horizontal
    (0xE01F, ["split-horizontal", "layout-sidebar-left", "layout-sidebar-right"], (
        hollow_box(140, 180, 884, 844, 76) + [
            rect_contour(474, 180, 550, 844),
        ]
    )),
    # 0xE020: split-vertical
    (0xE020, ["split-vertical", "layout-panel"], (
        hollow_box(140, 180, 884, 844, 76) + [
            rect_contour(140, 474, 884, 550),
        ]
    )),
]

def encode_simple_glyph(contours):
    if not contours:
        return b"", (0, 0, 0, 0), 0
    all_pts = [pt for c in contours for pt in c]
    xmin = min(p[0] for p in all_pts)
    ymin = min(p[1] for p in all_pts)
    xmax = max(p[0] for p in all_pts)
    ymax = max(p[1] for p in all_pts)

    end_pts = []
    idx = -1
    for c in contours:
        idx += len(c)
        end_pts.append(idx)

    flags = bytearray()
    x_bytes = bytearray()
    y_bytes = bytearray()
    prev_x = 0
    prev_y = 0
    for x, y, on_curve in all_pts:
        dx = x - prev_x
        dy = y - prev_y
        prev_x = x
        prev_y = y
        flags.append(0x01 if on_curve else 0x00)
        x_bytes.extend(struct.pack(">h", dx))
        y_bytes.extend(struct.pack(">h", dy))

    header = struct.pack(">hhhhh", len(contours), xmin, ymin, xmax, ymax)
    end_pts_bin = struct.pack(f">{len(end_pts)}H", *end_pts)
    instr_len = struct.pack(">H", 0)
    data = header + end_pts_bin + instr_len + bytes(flags) + bytes(x_bytes) + bytes(y_bytes)
    if len(data) % 4 != 0:
        data += b"\x00" * (4 - (len(data) % 4))
    return data, (xmin, ymin, xmax, ymax), len(all_pts)

def build_ttf_and_woff():
    # Glyph 0 is .notdef
    glyphs = [encode_simple_glyph(hollow_box(128, 128, 896, 896, 64))]
    cmap_map = {}
    icon_definitions = {}

    for glyph_index, (codepoint, icon_names, contours) in enumerate(GLYPH_SPECS, start=1):
        glyphs.append(encode_simple_glyph(contours))
        cmap_map[codepoint] = glyph_index
        hex_code = f"\\{codepoint:04x}"
        for name in icon_names:
            icon_definitions[name] = {"fontCharacter": hex_code}

    num_glyphs = len(glyphs)

    # 1. glyf & loca (long format = uint32 offsets)
    glyf_parts = []
    loca_offsets = [0]
    curr_offset = 0
    max_points = 0
    max_contours = 0
    for g_data, bbox, n_pts in glyphs:
        glyf_parts.append(g_data)
        curr_offset += len(g_data)
        loca_offsets.append(curr_offset)
        max_points = max(max_points, n_pts)
        if g_data:
            n_c = struct.unpack(">h", g_data[:2])[0]
            max_contours = max(max_contours, n_c)

    glyf_table = b"".join(glyf_parts)
    loca_table = struct.pack(f">{len(loca_offsets)}I", *loca_offsets)

    # 2. head
    head_table = struct.pack(
        ">IIIIHHQQhhhhHHhhh",
        0x00010000,  # version 1.0
        0x00010000,  # fontRevision
        0,           # checkSumAdjustment
        0x5F0F3CF5,  # magicNumber
        0x000B,      # flags
        1024,        # unitsPerEm
        0,           # created
        0,           # modified
        0,           # xMin
        0,           # yMin
        1024,        # xMax
        1024,        # yMax
        0,           # macStyle
        8,           # lowestRecPPEM
        2,           # fontDirectionHint
        1,           # indexToLocFormat (1 = uint32 loca)
        0            # glyphDataFormat
    )

    # 3. hhea (36 bytes = 17 fields)
    hhea_table = struct.pack(
        ">IhhhHhhhhhhhhhhhH",
        0x00010000,  # version
        1024,        # ascent
        0,           # descent
        0,           # lineGap
        1024,        # advanceWidthMax
        0,           # minLeftSideBearing
        0,           # minRightSideBearing
        1024,        # xMaxExtent
        1,           # caretSlopeRise
        0,           # caretSlopeRun
        0,           # caretOffset
        0, 0, 0, 0,  # reserved
        0,           # metricDataFormat
        num_glyphs   # numberOfHMetrics
    )

    # 4. hmtx
    hmtx_entries = []
    for g_data, bbox, _ in glyphs:
        lsb = bbox[0] if g_data else 0
        hmtx_entries.append(struct.pack(">Hh", 1024, lsb))
    hmtx_table = b"".join(hmtx_entries)

    # 5. maxp (version 1.0)
    maxp_table = struct.pack(
        ">IHHHHHHHHHHHHHH",
        0x00010000,
        num_glyphs,
        max_points,
        max_contours,
        0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0
    )

    # 6. cmap (Format 4 single contiguous range 0xE001..0xE000+len + 0xFFFF end)
    start_cp = 0xE001
    end_cp = 0xE000 + len(GLYPH_SPECS)
    id_delta = (1 - start_cp) & 0xFFFF
    seg_count = 2
    seg_count_x2 = seg_count * 2
    search_range = 4
    entry_selector = 1
    range_shift = 0
    subtable = struct.pack(
        ">HHHHHHH",
        4,                  # format 4
        14 + 2 + 4 * seg_count * 2,  # length = 32
        0,                  # language
        seg_count_x2,
        search_range,
        entry_selector,
        range_shift
    )
    subtable += struct.pack(">HH", end_cp, 0xFFFF)        # endCode
    subtable += struct.pack(">H", 0)                      # reservedPad
    subtable += struct.pack(">HH", start_cp, 0xFFFF)      # startCode
    subtable += struct.pack(">HH", id_delta, 1)           # idDelta
    subtable += struct.pack(">HH", 0, 0)                  # idRangeOffset

    cmap_table = struct.pack(">HH", 0, 1) + struct.pack(">HHI", 3, 1, 12) + subtable

    # 7. OS/2 (Version 1, 86 bytes)
    os2_table = struct.pack(
        ">HhHHHHhhhhhhhhhh10sIIII4sHHHhhhHHII",
        1,          # version
        1024,       # xAvgCharWidth
        400,        # usWeightClass (Regular)
        5,          # usWidthClass (Medium)
        0,          # fsType (Installable)
        512, 512, 0, 0,
        512, 512, 0, 0,
        50, 512, 0,
        b"\x00" * 10,
        0, 0, 0x10000000, 0,
        b"JBUI",
        0x0040,     # fsSelection (REGULAR)
        start_cp,
        end_cp,
        1024,       # sTypoAscender
        0,          # sTypoDescender
        0,          # sTypoLineGap
        1024,       # usWinAscent
        0,          # usWinDescent
        1, 0
    )

    # 8. name (Format 0 minimal valid Unicode & Windows records)
    family_utf16 = "intellij-expui-icons".encode("utf-16-be")
    subfam_utf16 = "Regular".encode("utf-16-be")
    records = [
        (1, family_utf16),
        (2, subfam_utf16),
        (4, family_utf16),
        (6, family_utf16),
    ]
    str_buf = bytearray()
    name_recs = []
    for name_id, raw in records:
        offset = len(str_buf)
        str_buf.extend(raw)
        name_recs.append(struct.pack(">HHHHHH", 3, 1, 0x0409, name_id, len(raw), offset))
    name_table = struct.pack(">HHH", 0, len(name_recs), 6 + 12 * len(name_recs)) + b"".join(name_recs) + bytes(str_buf)

    # 9. post (Format 3.0 - no PostScript glyph names needed)
    post_table = struct.pack(">IIhhIIIII", 0x00030000, 0, 0, 0, 0, 0, 0, 0, 0)

    tables = {
        b"OS/2": os2_table,
        b"cmap": cmap_table,
        b"glyf": glyf_table,
        b"head": head_table,
        b"hhea": hhea_table,
        b"hmtx": hmtx_table,
        b"loca": loca_table,
        b"maxp": maxp_table,
        b"name": name_table,
        b"post": post_table,
    }

    def calc_checksum(data):
        padded = data + b"\x00" * ((4 - len(data) % 4) % 4)
        total = 0
        for (val,) in struct.iter_unpack(">I", padded):
            total = (total + val) & 0xFFFFFFFF
        return total

    # Build WOFF 1.0 file
    sorted_tags = sorted(tables.keys())
    num_tables = len(sorted_tags)
    woff_header_size = 44
    dir_size = 20 * num_tables
    curr_woff_offset = woff_header_size + dir_size

    dir_entries = []
    data_blocks = []
    total_sfnt_size = 12 + 16 * num_tables

    for tag in sorted_tags:
        orig_data = tables[tag]
        orig_len = len(orig_data)
        total_sfnt_size += (orig_len + 3) & ~3
        checksum = calc_checksum(orig_data)
        comp_candidate = zlib.compress(orig_data, 9)
        if len(comp_candidate) < orig_len:
            stored_data = comp_candidate
        else:
            stored_data = orig_data
        comp_len = len(stored_data)
        padded_stored = stored_data + b"\x00" * ((4 - comp_len % 4) % 4)
        dir_entries.append(struct.pack(">4sIIII", tag, curr_woff_offset, comp_len, orig_len, checksum))
        data_blocks.append(padded_stored)
        curr_woff_offset += len(padded_stored)

    woff_header = struct.pack(
        ">4sIIHHIHHIIIII",
        b"wOFF",
        0x00010000,          # flavor (TrueType)
        curr_woff_offset,    # length
        num_tables,
        0,                   # reserved
        total_sfnt_size,
        1,                   # majorVersion
        0,                   # minorVersion
        0, 0, 0,             # metaOffset, metaLength, metaOrigLength
        0, 0                 # privOffset, privLength
    )

    woff_bytes = woff_header + b"".join(dir_entries) + b"".join(data_blocks)
    with open(WOFF_PATH, "wb") as f:
        f.write(woff_bytes)

    product_theme = {
        "fonts": [
            {
                "id": "intellij-expui-icons",
                "src": [
                    {
                        "path": "./intellij-expui-icons.woff",
                        "format": "woff"
                    }
                ],
                "weight": "normal",
                "style": "normal"
            }
        ],
        "iconDefinitions": icon_definitions
    }

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(product_theme, f, indent=2)

    print(f"Generated WOFF font ({len(woff_bytes)} bytes) and mapped {len(icon_definitions)} product icons.")

if __name__ == "__main__":
    build_ttf_and_woff()
