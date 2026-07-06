#!/usr/bin/env python3
"""Meco 图版 v2 生成器 — 无字 · 纯灰阶 · 发丝线等轴测。
输出到 persona-website/drafts/meco-plates/（git 未跟踪草稿区）。
线级表 STYLE 是唯一权威；改数重跑即得。
"""
import math, os

OUT = os.path.dirname(os.path.abspath(__file__))
COS30, SIN30 = 0.8660254, 0.5
K, KY = 1.2247449, 0.7071068  # 水平圆 -> 椭圆 rx/ry 系数

STYLE = {
    'L0':  ('#181818', 1.5, None),
    'L1':  ('#6F6F6F', 1,   None),
    'L2':  ('#BEBEBE', 1,   None),
    'L3':  ('#BEBEBE', 1,   '7 5'),
    'L3k': ('#181818', 1.5, '7 5'),
    'L4':  ('#6F6F6F', 1,   '14 5 2 5'),
    'L5':  ('#E0E0E0', 0.75, None),
    'L5t': ('#E0E0E0', 0.75, '2 6'),
    'L5x': ('#E0E0E0', 0.75, '16 5 2 5'),
}

def _a(lv, fill='none'):
    s, w, d = STYLE[lv]
    out = f'fill="{fill}" stroke="{s}" stroke-width="{w}"'
    if d: out += f' stroke-dasharray="{d}"'
    return out

def fmt(v):
    return f'{v:.1f}'.rstrip('0').rstrip('.')

class Scene:
    def __init__(self, ox, oy):
        self.ox, self.oy = ox, oy
        self.el = []

    def P(self, x, y, z):
        return (self.ox + (x - y) * COS30, self.oy + (x + y) * SIN30 - z)

    def line3(self, a, b, lv='L1'):
        self.line2(self.P(*a), self.P(*b), lv)

    def poly3(self, pts, lv='L1', fill='none', close=True):
        pp = ' '.join(f'{fmt(px)},{fmt(py)}' for px, py in (self.P(*p) for p in pts))
        tag = 'polygon' if close else 'polyline'
        self.el.append(f'<{tag} points="{pp}" {_a(lv, fill)}/>')

    def line2(self, p, q, lv='L1'):
        self.el.append(f'<line x1="{fmt(p[0])}" y1="{fmt(p[1])}" x2="{fmt(q[0])}" y2="{fmt(q[1])}" {_a(lv)}/>')

    def path2(self, d, lv='L1', fill='none'):
        self.el.append(f'<path d="{d}" {_a(lv, fill)}/>')

    def rect2(self, x, y, w, h, fill):
        self.el.append(f'<rect x="{fmt(x)}" y="{fmt(y)}" width="{fmt(w)}" height="{fmt(h)}" fill="{fill}"/>')

    def raw(self, s):
        self.el.append(s)

    def box(self, x0, y0, z0, w, d, h, lv='L1', hidden=None, fill=None, outline=None):
        x1, y1, z1 = x0 + w, y0 + d, z0 + h
        V = {(i, j, k): (x0 if i == 0 else x1, y0 if j == 0 else y1, z0 if k == 0 else z1)
             for i in (0, 1) for j in (0, 1) for k in (0, 1)}
        edges = [((0,0,0),(1,0,0)), ((0,0,0),(0,1,0)), ((1,0,0),(1,1,0)), ((0,1,0),(1,1,0)),
                 ((0,0,1),(1,0,1)), ((0,0,1),(0,1,1)), ((1,0,1),(1,1,1)), ((0,1,1),(1,1,1)),
                 ((0,0,0),(0,0,1)), ((1,0,0),(1,0,1)), ((0,1,0),(0,1,1)), ((1,1,0),(1,1,1))]
        hid = {e for e in edges if (0,0,0) in e}
        inner = {e for e in edges if (1,1,1) in e}
        sil = [e for e in edges if e not in hid and e not in inner]
        if fill:
            self.poly3([V[(0,0,1)], V[(1,0,1)], V[(1,1,1)], V[(0,1,1)]], lv, fill)
            self.poly3([V[(1,0,0)], V[(1,1,0)], V[(1,1,1)], V[(1,0,1)]], lv, fill)
            self.poly3([V[(0,1,0)], V[(1,1,0)], V[(1,1,1)], V[(0,1,1)]], lv, fill)
        else:
            hl = hidden or 'L3'
            for a, b in hid:
                self.line3(V[a], V[b], hl)
        for a, b in inner:
            self.line3(V[a], V[b], lv)
        for a, b in sil:
            self.line3(V[a], V[b], outline or lv)
        return V

    def cylinder(self, cx, cy, z0, r, h, lv='L1', fill='#FFFFFF'):
        sx, syb = self.P(cx, cy, z0)
        _, syt = self.P(cx, cy, z0 + h)
        rx, ry = K * r, KY * r
        if fill:
            d = (f'M {fmt(sx-rx)} {fmt(syt)} L {fmt(sx-rx)} {fmt(syb)} '
                 f'A {fmt(rx)} {fmt(ry)} 0 0 0 {fmt(sx+rx)} {fmt(syb)} '
                 f'L {fmt(sx+rx)} {fmt(syt)} Z')
            self.path2(d, lv, fill)
        self.el.append(f'<ellipse cx="{fmt(sx)}" cy="{fmt(syt)}" rx="{fmt(rx)}" ry="{fmt(ry)}" {_a(lv, fill or "none")}/>')

    def tick_ring(self, cx, cy, z, r, n=60, major_every=15, lmin=6, lmaj=14,
                  lv_min='L2', lv_maj='L1'):
        for i in range(n):
            th = 2 * math.pi * i / n
            co, si = math.cos(th), math.sin(th)
            L = lmaj if (i % major_every == 0) else lmin
            lv = lv_maj if (i % major_every == 0) else lv_min
            self.line3((cx + r * co, cy + r * si, z), (cx + (r - L) * co, cy + (r - L) * si, z), lv)

    def face_group(self, origin, du, dv):
        o = self.P(*origin)
        pu = self.P(origin[0]+du[0], origin[1]+du[1], origin[2]+du[2])
        pv = self.P(origin[0]+dv[0], origin[1]+dv[1], origin[2]+dv[2])
        a, b = pu[0]-o[0], pu[1]-o[1]
        c, d = pv[0]-o[0], pv[1]-o[1]
        return f'<g transform="matrix({a:.4f},{b:.4f},{c:.4f},{d:.4f},{fmt(o[0])},{fmt(o[1])})">', '</g>'

    def cable(self, p, q, sag, lv='L1', chevron_at=None):
        mx, my = (p[0]+q[0])/2, (p[1]+q[1])/2 + sag
        self.path2(f'M {fmt(p[0])} {fmt(p[1])} Q {fmt(mx)} {fmt(my)} {fmt(q[0])} {fmt(q[1])}', lv)
        if chevron_at is not None:
            t = chevron_at
            bx = (1-t)**2*p[0] + 2*(1-t)*t*mx + t**2*q[0]
            by = (1-t)**2*p[1] + 2*(1-t)*t*my + t**2*q[1]
            dx = 2*(1-t)*(mx-p[0]) + 2*t*(q[0]-mx)
            dy = 2*(1-t)*(my-p[1]) + 2*t*(q[1]-my)
            n = math.hypot(dx, dy); dx, dy = dx/n, dy/n
            lxx, lyy = -dy, dx
            s = 9
            self.path2(f'M {fmt(bx - dx*s + lxx*s*0.7)} {fmt(by - dy*s + lyy*s*0.7)} '
                       f'L {fmt(bx)} {fmt(by)} '
                       f'L {fmt(bx - dx*s - lxx*s*0.7)} {fmt(by - dy*s - lyy*s*0.7)}', 'L1')

    def hatch_xz(self, y, x0, x1, z0, z1, spacing=8, lv='L2'):
        c = x0 - z1
        while c <= x1 - z0:
            p1x = max(x0, c + z0); p1z = p1x - c
            p2x = min(x1, c + z1); p2z = p2x - c
            if p1z <= z1 and p2z >= z0 and p1x <= x1:
                self.line3((p1x, y, p1z), (p2x, y, p2z), lv)
            c += spacing

    def ink_square(self, sx, sy, s=10):
        self.rect2(sx, sy, s, s, '#181818')

    def mast(self, bx, by, base, base_h, top_z, arc_rs, lv='L1'):
        """通信桅：基座 + 杆 + 顶端三道信号弧。"""
        self.box(bx - base/2, by - base/2, 0 if base_h else 8, base, base, base_h or 24, fill='#FFFFFF')
        z0 = (0 if base_h else 8) + (base_h or 24)
        self.line3((bx, by, z0), (bx, by, top_z), lv)
        mx, my = self.P(bx, by, top_z)
        for r in arc_rs:
            self.path2(f'M {fmt(mx - r*0.42)} {fmt(my - r*0.91)} A {r} {r} 0 0 1 {fmt(mx + r*0.91)} {fmt(my - r*0.42)}', 'L2')


SERIF = "Garamond, 'EB Garamond', Georgia, 'Times New Roman', serif"

HALO = 'paint-order="stroke" stroke="#FFFFFF" stroke-width="8" stroke-linejoin="round"'

def note(S, x, y, text, anchor='start', leader=None, size=19):
    """克制的英文组件标注：斜体小字 + 白色光环（挖空底线，不被遮挡）+ 可选发丝引线。"""
    if leader:
        S.line2(leader[0], leader[1], 'L5')
    S.raw(f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="{SERIF}" '
          f'font-style="italic" font-size="{size}" letter-spacing="1" {HALO} fill="#999999">{text}</text>')

def caption_el(text, w, h):
    """极简英文一行：主站衬线斜体气质，小写、轻字距、弱灰。"""
    return (f'<text x="{w // 2}" y="{h - 44}" text-anchor="middle" '
            f'font-family="{SERIF}" font-style="italic" font-size="26" '
            f'letter-spacing="1.5" {HALO} fill="#999999">{text}</text>')

def plate(name, w, h, title, body_fn, caption=None):
    body = body_fn()
    if caption:
        body += '\n  ' + caption_el(caption, w, h)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
           f'width="{w}" height="{h}" role="img">\n'
           f'  <title>{title}</title>\n'
           '  <style>line,rect,circle,ellipse,path,polyline,polygon{vector-effect:non-scaling-stroke}</style>\n'
           f'  <rect x="0" y="0" width="{w}" height="{h}" fill="#FFFFFF"/>\n'
           + body + '\n</svg>\n')
    with open(os.path.join(OUT, name), 'w') as f:
        f.write(svg)
    print('wrote', name)


# ══════════════════════ ① 单进程四器官 ══════════════════════
def plate_01():
    S = Scene(600, 520)
    HX0, HY0, HX1, HY1, HZ = -210, -130, 210, 130, 150

    S.box(HX0, HY0, 0, 420, 260, 8, lv='L1', fill='#FFFFFF')      # 地板

    spine_y = 20                                                   # 地板刻槽
    S.line3((-160, spine_y, 8), (100, spine_y, 8), 'L2')
    for bx, by in ((-160, -88), (95, -23), (-105, 73), (100, 46)):
        S.line3((bx, by, 8), (bx, spine_y, 8), 'L2')

    S.line3((HX0, HY0, 8), (HX0, HY0, HZ), 'L3')                   # 壳远侧玻璃棱
    S.line3((HX0, HY0, HZ), (HX1, HY0, HZ), 'L3')
    S.line3((HX0, HY0, HZ), (HX0, HY1, HZ), 'L3')

    S.mast(-160, -90, 40, None, 205, (16, 27, 38))                 # A 通信桅

    S.cylinder(-105, 75, 8, 52, 66)                                # C 擒纵鼓
    S.tick_ring(-105, 75, 74, 48, n=60, major_every=15, lmin=6, lmaj=14)

    S.box(20, -115, 8, 150, 90, 110, fill='#FFFFFF')               # B 接口歧管：44 方口
    g0, g1 = S.face_group((31, -25, 107), (1, 0, 0), (0, 0, -1))
    S.raw(g0)
    cell, gap = 8, 4
    for r in range(4):
        for c in range(11):
            S.raw(f'<rect x="{c*(cell+gap)}" y="{14 + r*(cell+gap)}" width="{cell}" height="{cell}" {_a("L2")}/>')
    S.raw(g1)

    S.box(40, 32, 8, 120, 14, 130, fill='#FFFFFF')                 # D 窗板
    g0, g1 = S.face_group((52, 46, 126), (1, 0, 0), (0, 0, -1))
    S.raw(g0)
    S.raw(f'<rect x="0" y="0" width="96" height="106" {_a("L2")}/>')
    S.raw(f'<line x1="0" y1="24" x2="96" y2="24" {_a("L2")}/>')
    S.raw(f'<circle cx="10" cy="12" r="2.5" {_a("L2")}/>')
    S.raw(f'<circle cx="22" cy="12" r="2.5" {_a("L2")}/>')
    S.raw(g1)

    # 壳近侧（玻璃，压在器官之上）
    S.line3((HX1, HY0, 8), (HX1, HY0, HZ), 'L0')
    S.line3((HX0, HY1, 8), (HX0, HY1, HZ), 'L0')
    S.line3((HX1, HY1, 8), (HX1, HY1, HZ), 'L1')
    S.line3((HX1, HY0, HZ), (HX1, HY1, HZ), 'L0')
    S.line3((HX0, HY1, HZ), (HX1, HY1, HZ), 'L0')
    S.line3((HX1, HY0, 8), (HX1, HY1, 8), 'L0')
    S.line3((HX0, HY1, 8), (HX1, HY1, 8), 'L0')

    # 盖板（玻璃线框，爆炸悬浮）+ 轨迹点线
    S.box(HX0, HY0, 236, 420, 260, 14, lv='L1', hidden='L3')
    for cx, cy in ((HX0, HY0), (HX1, HY0), (HX0, HY1), (HX1, HY1)):
        S.line3((cx, cy, 236), (cx, cy, HZ), 'L5t')

    # 组件标注（位置优先落空白区，白色光环兜底防遮挡）
    note(S, 588, 172, 'the bot.', leader=((584, 177), (556, 188)))
    note(S, 930, 432, 'the doors.', leader=((926, 428), (854, 431)))
    note(S, 356, 552, 'the clock.', anchor='end', leader=((362, 546), (426, 500)))
    note(S, 790, 588, 'the window.', leader=((786, 584), (702, 560)))

    return '\n'.join('  ' + e for e in S.el)


# ══════════════════════ ② 五域看板 ══════════════════════
def plate_02():
    S = Scene(600, 450)
    W, T, H = 170, 10, 185          # 板宽 / 厚 / 高
    IN = 12                         # 蚀刻内缩
    UW, UH = W - 2*IN, H - 2*IN     # 146 × 161

    S.box(-340, -70, 0, 680, 140, 12, lv='L1', hidden='L3')        # 台座（玻璃）

    panels = [(-350 + 130*i, -5, 18 + 22*i) for i in range(5)]

    for (x0, y0, z0) in panels:                                    # 底角垂线
        for cx in (x0, x0 + W):
            S.line3((cx, y0 + T, z0), (cx, y0 + T, 12), 'L5t')

    def etch_calendar():
        out = []
        gx0, gy0, gw, gh = 3, 14, 140, 130
        for r in range(6):
            out.append(f'<line x1="{gx0}" y1="{gy0 + r*26}" x2="{gx0+gw}" y2="{gy0 + r*26}" {_a("L2")}/>')
        for c in range(8):
            out.append(f'<line x1="{gx0 + c*20}" y1="{gy0}" x2="{gx0 + c*20}" y2="{gy0+gh}" {_a("L2")}/>')
        for (r, c) in ((0, 2), (1, 5), (2, 1), (3, 4)):
            x, y = gx0 + c*20 + 10, gy0 + r*26 + 13
            out.append(f'<path d="M {x-4} {y-4} L {x+4} {y+4} M {x-4} {y+4} L {x+4} {y-4}" {_a("L2")}/>')
        return out

    def etch_rings():
        out = []
        for r, deg in ((24, 80), (40, 200), (56, 310)):
            a0 = -90; a1 = a0 + deg
            large = 1 if deg > 180 else 0
            x0 = 73 + r*math.cos(math.radians(a0)); y0 = 84 + r*math.sin(math.radians(a0))
            x1 = 73 + r*math.cos(math.radians(a1)); y1 = 84 + r*math.sin(math.radians(a1))
            out.append(f'<path d="M {x0:.1f} {y0:.1f} A {r} {r} 0 {large} 1 {x1:.1f} {y1:.1f}" {_a("L2")}/>')
        return out

    def etch_line():
        pts = [(0, 132), (28, 122), (56, 99), (84, 104), (112, 69), (146, 49)]
        out = [f'<polyline points="{" ".join(f"{x},{y}" for x, y in pts)}" {_a("L2")}/>']
        for x, y in pts[1:]:
            out.append(f'<circle cx="{x}" cy="{y}" r="3.5" fill="#FFFFFF" stroke="#BEBEBE" stroke-width="1"/>')
        return out

    def etch_kanban():
        out = []
        for cx, n in ((0, 4), (53, 3), (106, 5)):
            out.append(f'<rect x="{cx}" y="0" width="40" height="161" {_a("L2")}/>')
            for k in range(n):
                out.append(f'<rect x="{cx+6}" y="{9 + k*24}" width="28" height="14" {_a("L2")}/>')
        return out

    def etch_wave():
        d = 'M 0 90'
        pts = []
        for u in range(0, 147, 4):
            v = 90 - 30 * math.sin(u / 146 * 2 * math.pi * 1.5)
            d += f' L {u} {v:.1f}'
            pts.append((u, v))
        out = [f'<path d="{d}" {_a("L2")}/>']
        for u, v in pts:
            if abs(v - 60) < 1.3 or abs(v - 120) < 1.3:
                out.append(f'<circle cx="{u}" cy="{v:.1f}" r="4" fill="#FFFFFF" stroke="#BEBEBE" stroke-width="1"/>')
        return out

    etches = [etch_calendar, etch_rings, etch_line, etch_kanban, etch_wave]

    names = ('calendar.', 'goals.', 'learning.', 'work.', 'life.')
    for i, (x0, y0, z0) in enumerate(panels):
        outline = 'L0' if i == 4 else None
        S.box(x0, y0, z0, W, T, H, fill='#FFFFFF', outline=outline)
        g0, g1 = S.face_group((x0 + IN, y0 + T, z0 + H - IN), (1, 0, 0), (0, 0, -1))
        S.raw(g0)
        for e in etches[i]():
            S.raw(e)
        S.raw(g1)
        # 组件标注：沿台座前沿阶梯排布
        lx, ly = S.P(x0 + W/2, 85, 0)
        note(S, lx + 6, ly + 26, names[i], anchor='middle')

    return '\n'.join('  ' + e for e in S.el)


# ══════════════════════ ③ 大脑与只读围栏 ══════════════════════
def plate_03():
    S = Scene(610, 430)
    CUBE = 46
    right_col_x = 260
    left_col_x = -260 - CUBE
    ys = (-180, -80, 20, 120)

    # 扇形键合线（地面）：核体底边 4 出发点 → 各立方近面中点
    fan = (-45, -15, 15, 45)
    for gy, fy in zip(ys, fan):
        S.line3((65, fy, 0), (right_col_x, gy + CUBE/2, 0), 'L1')
        S.line3((-65, fy, 0), (left_col_x + CUBE, gy + CUBE/2, 0), 'L3')

    # 左列玻璃立方
    for gy in ys:
        S.box(left_col_x, gy, 0, CUBE, CUBE, CUBE, lv='L1', hidden='L3')

    # 围栏（点划）
    S.box(left_col_x - 30, ys[0] - 34, 0, CUBE + 60, (ys[-1] + CUBE + 34) - (ys[0] - 34), 66,
          lv='L4', hidden='L4')

    # 核体 + 顶面回形迷宫
    S.box(-65, -65, 0, 130, 130, 130, fill='#FFFFFF', outline='L0')
    g0, g1 = S.face_group((-58, -58, 130), (1, 0, 0), (0, 1, 0))
    S.raw(g0)
    c = 58
    for k, s in enumerate((58, 46, 34, 22, 10)):
        gap = 12
        x0, y0, x1, y1 = c - s, c - s, c + s, c + s
        side = k % 4
        if side == 0:
            d = f'M {x0+gap} {y0} L {x1} {y0} L {x1} {y1} L {x0} {y1} L {x0} {y0+gap}'
        elif side == 1:
            d = f'M {x1} {y0+gap} L {x1} {y1} L {x0} {y1} L {x0} {y0} L {x1-gap} {y0}'
        elif side == 2:
            d = f'M {x1-gap} {y1} L {x0} {y1} L {x0} {y0} L {x1} {y0} L {x1} {y1-gap}'
        else:
            d = f'M {x0} {y1-gap} L {x0} {y0} L {x1} {y0} L {x1} {y1} L {x0+gap} {y1}'
        S.raw(f'<path d="{d}" {_a("L2")}/>')
    S.raw(g1)

    # 右列实体立方
    for gy in ys:
        S.box(right_col_x, gy, 0, CUBE, CUBE, CUBE, fill='#FFFFFF')

    # 点睛：围栏前的小擒纵鼓，唯一引线穿入围栏
    drum_c = (left_col_x + CUBE/2, ys[-1] + CUBE + 116)
    S.cylinder(drum_c[0], drum_c[1], 0, 28, 36)
    S.tick_ring(drum_c[0], drum_c[1], 36, 25, n=12, major_every=3, lmin=4, lmaj=9)
    fence_front = ys[-1] + CUBE + 34
    S.line3((drum_c[0], drum_c[1] - 28, 0), (drum_c[0], fence_front, 0), 'L1')
    S.line3((drum_c[0], fence_front, 0), (drum_c[0], ys[-1] + CUBE, 0), 'L3')

    # 组件标注
    note(S, 610, 526, 'the brain.', anchor='middle')
    note(S, 200, 298, 'read-only.', anchor='middle')

    return '\n'.join('  ' + e for e in S.el)


# ══════════════════════ ④ 三端互联 ══════════════════════
def _mushroom(S, cx, cy, R, z_spring, col_w):
    """微缩蘑菇：网壳伞 + 白柱。返回轮廓椭圆参数 (sx, sy0, Rc, ry)。"""
    sx, sy0 = S.P(cx, cy, z_spring)
    Rc, ry = K * R, KY * R
    # 背面元素（先画）
    S.path2(f'M {fmt(sx-Rc)} {fmt(sy0)} A {fmt(Rc)} {fmt(ry)} 0 0 1 {fmt(sx+Rc)} {fmt(sy0)}', 'L3')
    # 柱
    S.box(cx - col_w/2, cy - col_w/2, 0, col_w, col_w, z_spring, fill='#FFFFFF')
    # 伞轮廓
    S.path2(f'M {fmt(sx-Rc)} {fmt(sy0)} A {fmt(Rc)} {fmt(Rc)} 0 0 1 {fmt(sx+Rc)} {fmt(sy0)}', 'L0')
    S.path2(f'M {fmt(sx+Rc)} {fmt(sy0)} A {fmt(Rc)} {fmt(ry)} 0 0 1 {fmt(sx-Rc)} {fmt(sy0)}', 'L0')
    # 纬线（前半）
    for phi in (28, 56):
        rp = R * math.cos(math.radians(phi))
        zz = z_spring + R * math.sin(math.radians(phi))
        px, py = S.P(cx, cy, zz)
        S.path2(f'M {fmt(px-K*rp)} {fmt(py)} A {fmt(K*rp)} {fmt(KY*rp)} 0 0 0 {fmt(px+K*rp)} {fmt(py)}', 'L2')
    # 经线 2 道（前面）
    for alpha in (30, 105):
        pts = []
        for phid in range(0, 91, 10):
            phi, al = math.radians(phid), math.radians(alpha)
            wx = cx + R*math.cos(phi)*math.cos(al)
            wy = cy + R*math.cos(phi)*math.sin(al)
            wz = z_spring + R*math.sin(phi)
            pts.append(S.P(wx, wy, wz))
        S.path2('M ' + ' L '.join(f'{fmt(px)} {fmt(py)}' for px, py in pts), 'L2')
    return sx, sy0, Rc, ry

def _rim(sx, sy0, Rc, ry, deg):
    th = math.radians(deg)
    return (sx + Rc*math.cos(th), sy0 + ry*math.sin(th))

def plate_04(variant='a'):
    S = Scene(600, 470)

    S.line2((110, 640), (1090, 640), 'L5')
    S.line2((150, 654), (1050, 654), 'L5')

    if variant == 'a':
        # Claude Code：建造中的立方（左）
        S.box(-410, -110, 0, 110, 110, 110, lv='L1', hidden='L3')
        S.poly3([(-410, -110, 110), (-300, -110, 110), (-300, 0, 110), (-410, 0, 110)], 'L1', '#FFFFFF')
        for corner in ((-410, -110), (-300, -110), (-410, 0), (-300, 0)):
            S.line3((corner[0], corner[1], 110), (corner[0], corner[1], 144), 'L5')
            S.line3((corner[0], corner[1], 0), (corner[0], corner[1], -16), 'L5')

        S.mast(345, -110, 50, 30, 250, (18, 30, 42))               # 飞书桅

        for k in range(5):                                          # Obsidian 叠板（左前）
            S.box(-330 + 6*k, 150 + 0*k, 10*k, 120, 84, 10, fill='#FFFFFF')

        sx, sy0, Rc, ry = _mushroom(S, 0, 10, 92, 120, 54)          # Meco 蘑菇

        cc_at = S.P(-300, -30, 96)
        fk_at = S.P(345, -110, 246)
        ob_at = S.P(-210, 155, 48)
    else:
        S.box(-410, -110, 0, 110, 110, 110, lv='L1', hidden='L3')
        S.box(310, -160, 0, 110, 110, 110, lv='L1', hidden='L3')
        S.box(-320, 150, 0, 110, 110, 110, lv='L1', hidden='L3')
        sx, sy0, Rc, ry = _mushroom(S, 0, 10, 92, 120, 54)
        cc_at = S.P(-300, -55, 90)
        fk_at = S.P(320, -95, 105)
        ob_at = S.P(-210, 175, 96)

    S.cable(cc_at, _rim(sx, sy0, Rc, ry, 187), 44, 'L1')
    S.cable(_rim(sx, sy0, Rc, ry, -12), fk_at, 56, 'L1')
    S.cable(ob_at, _rim(sx, sy0, Rc, ry, 136), 26, 'L3', chevron_at=0.86)

    return '\n'.join('  ' + e for e in S.el)


# ══════════════════════ ⑤ 全景旅程 ══════════════════════
def plate_05():
    S = Scene(590, 420)
    WT = 12
    HX0, HX1, HY0, HY1 = -290, 290, -90, 0
    HZ0, HZ1 = 8, 110
    LY = -45     # 消息线所在 y

    S.mast(-420, -20, 40, 22, 100, (14, 24, 34))

    S.box(HX0, HY0, HZ0, HX1 - HX0, WT, HZ1 - HZ0, fill='#FFFFFF')     # 后墙
    S.box(HX0, HY0, 0, HX1 - HX0, HY1 - HY0, 8, fill='#FFFFFF')        # 地板
    S.box(HX0, HY0, HZ0, WT, HY1 - HY0, HZ1 - HZ0, fill='#FFFFFF')     # 左墙
    S.line3((HX0 + WT, HY0 + WT, 8), (HX1 - WT, HY0 + WT, 8), 'L2')    # 内墙脚线
    S.line3((HX0 + WT, HY0 + WT, 8), (HX0 + WT, HY1, 8), 'L2')
    S.line3((HX1 - WT, HY0 + WT, 8), (HX1 - WT, HY1, 8), 'L2')

    S.cylinder(-140, LY, 8, 38, 54)                                    # 鼓（矮，绕匝悬于其上）
    S.box(0, -75, 8, 90, 60, 80, fill='#FFFFFF')                       # 歧管
    S.box(205, -85, 8, 12, 74, 92, fill='#FFFFFF')                     # 窗板
    g0, g1 = S.face_group((217, -77, 92), (0, 1, 0), (0, 0, -1))
    S.raw(g0)
    S.raw(f'<rect x="0" y="0" width="58" height="68" {_a("L2")}/>')
    S.raw(f'<line x1="0" y1="16" x2="58" y2="16" {_a("L2")}/>')
    S.raw(g1)

    S.box(HX1 - WT, HY0, HZ0, WT, HY1 - HY0, HZ1 - HZ0, fill='#FFFFFF') # 右墙

    for (x0, x1, z0, z1) in ((HX0, HX0 + WT, HZ0, HZ1), (HX1 - WT, HX1, HZ0, HZ1), (HX0, HX1, 0, 8)):
        S.hatch_xz(0, x0, x1, z0, z1, spacing=8, lv='L2')
        S.poly3([(x0, 0, z0), (x1, 0, z0), (x1, 0, z1), (x0, 0, z1)], 'L0')

    # ── 消息线 ──
    S.cable(S.P(-420, -20, 100), S.P(HX0, LY, 70), 40, 'L0')
    S.line3((HX0, LY, 70), (HX0 + WT, LY, 70), 'L3k')
    S.line3((HX0 + WT, LY, 70), (-178, LY, 70), 'L0')
    dx, dy = S.P(-140, LY, 70)
    S.el.append(f'<ellipse cx="{fmt(dx)}" cy="{fmt(dy)}" rx="{fmt(K*38)}" ry="{fmt(KY*38)}" {_a("L0")}/>')
    S.line3((-102, LY, 70), (0, LY, 60), 'L0')
    S.line3((0, LY, 60), (90, LY, 60), 'L3k')
    S.line3((90, LY, 60), (205, LY, 58), 'L0')
    S.line3((205, LY, 58), (217, LY, 58), 'L3k')
    S.line3((217, LY, 58), (HX1 - WT, LY, 66), 'L0')
    S.line3((HX1 - WT, LY, 66), (HX1, LY, 66), 'L3k')
    end = (1080, 230)
    S.cable(S.P(HX1, LY, 66), end, -60, 'L0')
    S.ink_square(end[0] - 1, end[1] - 5, 10)

    S.line2((100, 585), (1100, 585), 'L5')

    return '\n'.join('  ' + e for e in S.el)


# ══════════════════════ 整体流程横图（模板 · 必备） ══════════════════════
SMALLCAP = ('font-family="Garamond, \'EB Garamond\', Georgia, serif" '
            'font-size="17" letter-spacing="3" '
            'paint-order="stroke" stroke="#FFFFFF" stroke-width="7" stroke-linejoin="round" fill="#6F6F6F"')
ITAL = ('font-family="Garamond, \'EB Garamond\', Georgia, serif" '
        'font-style="italic" font-size="18" letter-spacing="1" '
        'paint-order="stroke" stroke="#FFFFFF" stroke-width="7" stroke-linejoin="round" fill="#999999"')

def plate_flow():
    S = Scene(0, 0)
    NW, NH = 180, 92

    def node(x, y, label, outline='L1'):
        S.raw(f'<rect x="{x}" y="{y}" width="{NW}" height="{NH}" {_a(outline, "#FFFFFF")}/>')
        S.raw(f'<text x="{x + NW/2}" y="{y + NH - 18}" text-anchor="middle" {SMALLCAP}>{label}</text>')
        return (x, y)

    def arrow(p, q, lv='L1', label=None, dashed_to_p=False):
        S.line2(p, q, lv)
        # chevron 指向 q
        dx, dy = q[0]-p[0], q[1]-p[1]
        n = math.hypot(dx, dy); dx, dy = dx/n, dy/n
        s = 8
        S.path2(f'M {fmt(q[0]-dx*s-dy*s*0.7)} {fmt(q[1]-dy*s+dx*s*0.7)} L {fmt(q[0])} {fmt(q[1])} '
                f'L {fmt(q[0]-dx*s+dy*s*0.7)} {fmt(q[1]-dy*s-dx*s*0.7)}', 'L1')
        if label:
            mx, my = (p[0]+q[0])/2, (p[1]+q[1])/2 - 10
            S.raw(f'<text x="{fmt(mx)}" y="{fmt(my)}" text-anchor="middle" {ITAL}>{label}</text>')

    # ── 左：三个入口 ──
    node(70, 86, 'FEISHU')
    S.raw(f'<rect x="{70+NW/2-13}" y="112" width="26" height="19" {_a("L1", "#FFFFFF")}/>')
    S.raw(f'<polyline points="{70+NW/2-5},131 {70+NW/2-9},139 {70+NW/2+3},131" {_a("L1", "#FFFFFF")}/>')
    for i in (-7, 0, 7):
        S.raw(f'<circle cx="{70+NW/2+i}" cy="121.5" r="1.6" fill="#6F6F6F"/>')

    node(70, 214, 'DESKTOP')
    S.raw(f'<rect x="{70+NW/2-14}" y="240" width="28" height="21" {_a("L1", "#FFFFFF")}/>')
    S.raw(f'<line x1="{70+NW/2-14}" y1="246" x2="{70+NW/2+14}" y2="246" {_a("L1")}/>')
    S.raw(f'<circle cx="{70+NW/2-10}" cy="243" r="1.3" fill="#6F6F6F"/>')
    S.raw(f'<circle cx="{70+NW/2-6}" cy="243" r="1.3" fill="#6F6F6F"/>')

    node(70, 342, 'CLAUDE CODE')
    c = Scene(70+NW/2, 386)
    c.box(-11, -11, 0, 22, 22, 22, lv='L1', hidden='L3')
    S.el.extend(c.el)

    # ── 中：MECO 单进程 ──
    MX, MY, MW, MH = 470, 86, 260, 348
    S.raw(f'<rect x="{MX}" y="{MY}" width="{MW}" height="{MH}" {_a("L0", "#FFFFFF")}/>')
    S.raw(f'<text x="{MX+MW/2}" y="{MY+34}" text-anchor="middle" {SMALLCAP}>MECO</text>')
    # 大脑：圆 + 回形刻线
    bx, by = MX+MW/2, MY+118
    S.raw(f'<circle cx="{bx}" cy="{by}" r="42" {_a("L1", "#FFFFFF")}/>')
    S.raw(f'<path d="M {bx-26} {by+6} A 26 26 0 1 1 {bx+8} {by+24}" {_a("L2")}/>')
    S.raw(f'<path d="M {bx-13} {by+2} A 13 13 0 1 1 {bx+5} {by+11}" {_a("L2")}/>')
    # 时钟（节拍）
    cx2, cy2 = MX+72, MY+250
    S.raw(f'<circle cx="{cx2}" cy="{cy2}" r="26" {_a("L1", "#FFFFFF")}/>')
    S.raw(f'<line x1="{cx2}" y1="{cy2}" x2="{cx2}" y2="{cy2-18}" {_a("L1")}/>')
    S.raw(f'<line x1="{cx2}" y1="{cy2}" x2="{cx2+12}" y2="{cy2+7}" {_a("L1")}/>')
    for i in range(12):
        th = i*math.pi/6
        S.raw(f'<line x1="{fmt(cx2+22*math.cos(th))}" y1="{fmt(cy2+22*math.sin(th))}" '
              f'x2="{fmt(cx2+26*math.cos(th))}" y2="{fmt(cy2+26*math.sin(th))}" {_a("L2")}/>')
    # 8 个工具（4×2 小方格，可数）
    tx, ty = MX+150, MY+224
    for r in range(2):
        for cc in range(4):
            S.raw(f'<rect x="{tx+cc*24}" y="{ty+r*24}" width="16" height="16" {_a("L2", "#FFFFFF")}/>')
    S.raw(f'<text x="{MX+MW/2}" y="{MY+MH-20}" text-anchor="middle" {ITAL}>one app.</text>')

    # ── 右：三个去处 ──
    node(950, 86, 'OBSIDIAN')
    for i in range(3):
        S.raw(f'<rect x="{950+NW/2-16+i*3}" y="{112+i*7}" width="32" height="6" {_a("L1", "#FFFFFF")}/>')

    node(950, 214, 'BOARDS')
    gx, gy = 950+NW/2-16, 240
    S.raw(f'<path d="M {gx+8} {gy+10} A 9 9 0 1 1 {gx+16} {gy+1}" {_a("L1")}/>')
    for i, hh in enumerate((8, 14, 11)):
        S.raw(f'<rect x="{gx+22+i*6}" y="{gy+18-hh}" width="4" height="{hh}" {_a("L1", "#FFFFFF")}/>')

    node(950, 342, 'FEISHU')
    bx2 = 950+NW/2
    S.raw(f'<path d="M {bx2-9} 384 A 9 9 0 0 1 {bx2+9} 384 L {bx2+12} 390 L {bx2-12} 390 Z" {_a("L1", "#FFFFFF")}/>')
    S.raw(f'<line x1="{bx2-3}" y1="393" x2="{bx2+3}" y2="393" {_a("L1")}/>')

    # ── 连线 ──
    arrow((250, 132), (470, 158))
    arrow((250, 260), (470, 260))
    arrow((250, 388), (470, 362))
    arrow((950, 132), (730, 158), 'L3', label='read-only.')
    arrow((730, 260), (950, 260))
    arrow((730, 362), (950, 388), label='on time.')

    return '\n'.join('  ' + e for e in S.el)


# ══════════════════════ ⑥ 封面网壳蘑菇 ══════════════════════
def plate_cover():
    S = Scene(360, 520)
    R, Z0 = 190, 200
    sx, sy0 = S.P(0, 0, Z0)
    Rc, ry = K * R, KY * R

    def meridian(alpha_d, lv):
        al = math.radians(alpha_d)
        pts = []
        for phid in range(0, 91, 6):
            phi = math.radians(phid)
            wx = R*math.cos(phi)*math.cos(al)
            wy = R*math.cos(phi)*math.sin(al)
            wz = Z0 + R*math.sin(phi)
            pts.append(S.P(wx, wy, wz))
        S.path2('M ' + ' L '.join(f'{fmt(px)} {fmt(py)}' for px, py in pts), lv)

    # ── 背面层（画在柱前）──
    S.path2(f'M {fmt(sx-Rc)} {fmt(sy0)} A {fmt(Rc)} {fmt(ry)} 0 0 1 {fmt(sx+Rc)} {fmt(sy0)}', 'L3')  # 起拱后半
    for phi_d in (22.5, 45, 67.5):                                   # 纬线后半
        phi = math.radians(phi_d)
        rp, zz = R*math.cos(phi), Z0 + R*math.sin(phi)
        px, py = S.P(0, 0, zz)
        S.path2(f'M {fmt(px-K*rp)} {fmt(py)} A {fmt(K*rp)} {fmt(KY*rp)} 0 0 1 {fmt(px+K*rp)} {fmt(py)}', 'L3')
    for a in (180, 225, 270):                                        # 背面经线
        meridian(a, 'L3')

    # 中心轴（下段；穿柱段被柱覆盖，上段最后画）
    S.line2((sx, S.P(0, 0, -14)[1]), (sx, S.P(0, 0, 60)[1]), 'L5x')
    S.line2((sx - 170, S.P(0, 0, 0)[1] + 48), (sx + 170, S.P(0, 0, 0)[1] + 48), 'L5')

    # ── 菌柄 ──
    S.box(-55, -55, 0, 110, 110, 200, fill='#FFFFFF')
    for cx, cy in ((55, -55), (-55, 55), (55, 55)):
        S.line3((cx, cy, 200), (cx, cy, 212), 'L3')

    # ── 前面层 ──
    for phi_d in (22.5, 45, 67.5):                                   # 纬线前半
        phi = math.radians(phi_d)
        rp, zz = R*math.cos(phi), Z0 + R*math.sin(phi)
        px, py = S.P(0, 0, zz)
        S.path2(f'M {fmt(px-K*rp)} {fmt(py)} A {fmt(K*rp)} {fmt(KY*rp)} 0 0 0 {fmt(px+K*rp)} {fmt(py)}', 'L2')
    for a in (0, 45, 90, 135, 315):                                  # 前面/剪影经线
        meridian(a, 'L2')
    S.path2(f'M {fmt(sx-Rc)} {fmt(sy0)} A {fmt(Rc)} {fmt(Rc)} 0 0 1 {fmt(sx+Rc)} {fmt(sy0)}', 'L0')  # 伞轮廓
    S.path2(f'M {fmt(sx+Rc)} {fmt(sy0)} A {fmt(Rc)} {fmt(ry)} 0 0 1 {fmt(sx-Rc)} {fmt(sy0)}', 'L0')  # 起拱前半
    for deg in range(-42, 133, 6):                                   # 菌褶
        th = math.radians(deg)
        S.line3((R*math.cos(th), R*math.sin(th), Z0), ((R-10)*math.cos(th), (R-10)*math.sin(th), Z0), 'L2')
    # 中心轴上段（穿顶出头）
    S.line2((sx, S.P(0, 0, Z0 + R)[1]), (sx, S.P(0, 0, Z0 + R + 26)[1]), 'L5x')

    # ── 字标 + 副题 ──
    S.raw('<text x="348" y="628" text-anchor="middle" '
          'font-family="Garamond, \'EB Garamond\', Georgia, \'Songti SC\', \'Noto Serif SC\', serif" '
          'font-size="72" letter-spacing="12" fill="#181818">MECO</text>')
    S.ink_square(500, 615, 13)
    S.raw(f'<text x="360" y="668" text-anchor="middle" font-family="{SERIF}" '
          'font-style="italic" font-size="21" letter-spacing="1.5" '
          'fill="#999999">a homegrown butler.</text>')

    return '\n'.join('  ' + e for e in S.el)


def main():
    os.makedirs(OUT, exist_ok=True)
    plate('plate-01-organs.svg', 1200, 750, 'Meco — 一个进程，四个器官 / One vessel, four organs',
          plate_01, caption='one body, four organs.')
    plate('plate-02-boards.svg', 1200, 750, 'Meco — 五域看板 / Five boards',
          plate_02, caption='five views of one life.')
    plate('plate-03-brain-fence.svg', 1200, 750, 'Meco — 大脑与只读围栏 / Look, don\'t touch',
          plate_03, caption='look, don&#8217;t touch.')
    plate('plate-04-triad.svg', 1200, 750, 'Meco — 三端互联 / Never out of touch',
          lambda: plate_04('a'), caption='never out of touch.')
    plate('plate-04-triad-alt.svg', 1200, 750, 'Meco — 三端互联（备选） / Never out of touch (alt)',
          lambda: plate_04('b'), caption='never out of touch.')
    plate('plate-05-journey.svg', 1200, 640, 'Meco — 一条消息的旅程 / In, through, out',
          plate_05, caption='in, through, out.')
    plate('flow-overview.svg', 1200, 520, 'Meco — 整体流程 / How it all connects',
          plate_flow, caption='everything, through one app.')
    plate('cover.svg', 720, 720, 'Meco — 蘑菇管家 / A homegrown butler', plate_cover)

if __name__ == '__main__':
    main()
