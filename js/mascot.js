// Mascottes qui pédalent : un « squelette » commun (vélo, pédalier, jambes en cinématique inverse,
// expressions d'effort, sueur, vapeur) + des « peaux » interchangeables (corps, tête, accessoires).
// Ajouter une mascotte = écrire une peau ; l'animation et l'effort sont partagés.
(function(){
  const INK = '#3b1f3a', NS = 'http://www.w3.org/2000/svg';
  const W = 200, H = 120, TOP = -36;   // le viewBox commence au-dessus de 0 pour laisser la place à la tête et à la corne
  // Géométrie du vélo (repère du viewBox 200×120, vélo tourné vers la droite)
  const G = {rear:[52,94], front:[152,94], wheelR:21, bb:[96,96], crankR:10, seat:[86,60], head:[134,60], bar:[146,48],
    hip:[86,56], thigh:27, shin:27};

  const torso = (fill, stroke) => `<ellipse cx="10" cy="-14" rx="14" ry="17" fill="${fill}" stroke="${stroke}" stroke-width="2" transform="rotate(28 10 -14)"/>`;
  const heart = (x, y, k, f) => `<path d="M${x} ${y+k*.9} C${x-k*1.5} ${y-k*.1} ${x-k*.7} ${y-k*1.2} ${x} ${y-k*.35} C${x+k*.7} ${y-k*1.2} ${x+k*1.5} ${y-k*.1} ${x} ${y+k*.9} Z" fill="${f}" stroke="#c41f74" stroke-width="1.2"/>`;
  // ---------- Peaux ----------
  // Chaque peau dessine le buste et la tête (sans visage) dans le repère du personnage (hanche en 0,0),
  // et indique où placer le visage (face.x, face.y, face.s). limb = couleur des jambes / bras.
  const SKINS = {
    licorne: {n:'Paillette la licorne', avatar:0, limb:'#ffffff', limbStroke:'#f2c6de', bike:'#ff5fae', bike2:'#b27cff',
      body: `<ellipse cx="10" cy="-14" rx="14" ry="17" fill="#fff" stroke="#f2c6de" stroke-width="2" transform="rotate(28 10 -14)"/>
             <path d="M-8 -6 Q-22 -2 -24 10" fill="none" stroke="#ff9fd0" stroke-width="7" stroke-linecap="round"/>
             <path d="M-9 -3 Q-20 4 -20 14" fill="none" stroke="#c7a0ff" stroke-width="6" stroke-linecap="round"/>`,
      head: `<circle cx="-14" cy="-10" r="10" fill="#ff9fd0"/><circle cx="-19" cy="3" r="9" fill="#c7a0ff"/><circle cx="-15" cy="14" r="7" fill="#8fe8d4"/>
             <path d="M-6 -16 L-4 -30 L4 -18 Z" fill="#fff" stroke="#f2c6de" stroke-width="2" stroke-linejoin="round"/>
             <ellipse cx="0" cy="0" rx="21" ry="19" fill="#fff" stroke="#f2c6de" stroke-width="2"/>
             <path d="M2 -18 L9 -40 L15 -17 Z" fill="#ffd36b" stroke="#f0b43c" stroke-width="2" stroke-linejoin="round"/>
             <path d="M5 -25 L13 -27 M7 -32 L12 -33" stroke="#f0b43c" stroke-width="1.6"/>
             <circle cx="-6" cy="-19" r="7" fill="#ff9fd0"/><circle cx="1" cy="-21" r="5" fill="#c7a0ff"/>
             <ellipse cx="12" cy="9" rx="12" ry="8" fill="#ffe1ef"/><circle cx="9" cy="8" r="1.3" fill="#d98bb3"/><circle cx="16" cy="8" r="1.3" fill="#d98bb3"/>`,
      neck:[22,-34], face:{x:4, y:-3, s:0.9}},
    narval: {n:'Norbert le narval', avatar:1, limb:'#9fb6ff', limbStroke:'#7d95f0', bike:'#4f7cff', bike2:'#ff5fae',
      body: torso('#9fb6ff','#7d95f0') + `<ellipse cx="12" cy="-10" rx="7" ry="10" fill="#e3ebff" transform="rotate(28 12 -10)"/>
             <path d="M-6 -4 Q-22 -10 -30 -2 Q-24 2 -30 8 Q-20 8 -6 2 Z" fill="#8ea8ff" stroke="#7d95f0" stroke-width="1.5"/>`,
      head: `<ellipse cx="0" cy="0" rx="21" ry="19" fill="#9fb6ff" stroke="#7d95f0" stroke-width="2"/><ellipse cx="2" cy="9" rx="14" ry="8" fill="#e3ebff"/>
             <path d="M-3 -17 L2 -48 L7 -17 Z" fill="#fff4cc" stroke="#e8cf86" stroke-width="1.6" stroke-linejoin="round"/>
             <path d="M-1 -26 L5 -28 M0 -35 L4 -36 M1 -42 L3 -43" stroke="#e8cf86" stroke-width="1.4"/>
             <path d="M-19 -7 Q0 -22 19 -7" fill="none" stroke="#ff5fae" stroke-width="6" stroke-linecap="round"/>
             <circle cx="-13" cy="6" r="2" fill="#7d95f0"/><circle cx="15" cy="-2" r="1.6" fill="#7d95f0"/>`,
      neck:[22,-34], face:{x:2, y:1, s:.9}},
    lama: {n:'Lola la lama', avatar:2, limb:'#fff1dc', limbStroke:'#ecd3ae', bike:'#a874ff', bike2:'#ff4fa3',
      body: torso('#fff1dc','#ecd3ae') + `<path d="M8 -30 Q22 -22 30 -30 L30 -24 Q22 -15 8 -24 Z" fill="#a874ff"/><path d="M12 -24 L8 -12 L16 -20 Z" fill="#a874ff"/>`,
      head: `<ellipse cx="-9" cy="-21" rx="4.5" ry="10" fill="#fff1dc" stroke="#ecd3ae" stroke-width="1.6" transform="rotate(-18 -9 -21)"/>
             <ellipse cx="8" cy="-22" rx="4.5" ry="10" fill="#fff1dc" stroke="#ecd3ae" stroke-width="1.6" transform="rotate(14 8 -22)"/>
             <ellipse cx="0" cy="0" rx="19" ry="19" fill="#fff1dc" stroke="#ecd3ae" stroke-width="2"/>
             <circle cx="-8" cy="-16" r="7" fill="#ffe0b5"/><circle cx="0" cy="-19" r="8" fill="#ffe0b5"/><circle cx="8" cy="-16" r="7" fill="#ffe0b5"/>
             ${heart(-6,-10,6,'#ff4fa3')}${heart(9,-10,6,'#ff4fa3')}<path d="M-1 -12 L4 -12" stroke="#c41f74" stroke-width="2"/>
             <ellipse cx="4" cy="9" rx="10" ry="7" fill="#ffe6c7"/>`,
      neck:[22,-34], face:{x:2, y:1, s:.85}},
    axolotl: {n:"Axelle l'axolotl", avatar:3, limb:'#ffc0da', limbStroke:'#ff9cc4', bike:'#2fb36d', bike2:'#ff6fa8',
      body: torso('#ffc0da','#ff9cc4') + `<path d="M-6 -2 Q-26 -6 -32 6 Q-20 6 -6 4 Z" fill="#ffb3d1" stroke="#ff9cc4" stroke-width="1.5"/>`,
      head: `<ellipse cx="-23" cy="-12" rx="11" ry="4.5" fill="#ff6fa8" transform="rotate(-30 -23 -12)"/><ellipse cx="-27" cy="0" rx="11" ry="4.5" fill="#ff6fa8"/><ellipse cx="-23" cy="12" rx="11" ry="4.5" fill="#ff6fa8" transform="rotate(30 -23 12)"/>
             <ellipse cx="23" cy="-12" rx="10" ry="4" fill="#ff6fa8" transform="rotate(30 23 -12)"/><ellipse cx="26" cy="0" rx="10" ry="4" fill="#ff6fa8"/>
             <ellipse cx="0" cy="0" rx="23" ry="17" fill="#ffc0da" stroke="#ff9cc4" stroke-width="2"/>
             <path d="M-6 -15 L0 -38 L6 -15 Z" fill="#8fe8d4" stroke="#4fcdb0" stroke-width="1.6" stroke-linejoin="round"/><circle cx="0" cy="-38" r="4" fill="#ffd36b"/>
             <circle cx="-14" cy="-6" r="2" fill="#ff9cc4"/><circle cx="16" cy="-8" r="2.4" fill="#ff9cc4"/>`,
      neck:[22,-33], face:{x:2, y:2, s:.95}, tint:'<ellipse cx="0" cy="0" rx="23" ry="17" fill="#ff3b3b" opacity="{o}"/>'},
    paresseux: {n:'Speedy le paresseux', avatar:4, limb:'#c9a27e', limbStroke:'#9c7653', bike:'#e0a800', bike2:'#ff5fae',
      body: torso('#c9a27e','#9c7653') + `<ellipse cx="12" cy="-12" rx="7" ry="10" fill="#e0c3a3" transform="rotate(28 12 -12)"/>`,
      head: `<circle cx="0" cy="0" r="20" fill="#c9a27e" stroke="#9c7653" stroke-width="2"/><ellipse cx="3" cy="3" rx="15" ry="12" fill="#f4dfc5"/>
             <ellipse cx="-3.5" cy="0.5" rx="6.5" ry="4.5" fill="#a77e58" transform="rotate(-20 -3.5 0.5)"/><ellipse cx="9.5" cy="0.5" rx="6.5" ry="4.5" fill="#a77e58" transform="rotate(20 9.5 0.5)"/>
             <ellipse cx="3" cy="4.6" rx="2.6" ry="1.7" fill="#5a3a24"/>
             <path d="M-18 -9 Q0 -27 18 -9" fill="none" stroke="#ff5fae" stroke-width="5" stroke-linecap="round"/>`,
      neck:[22,-34], face:{x:2, y:1, s:.9}},
    capybara: {n:'Capu le capybara', avatar:5, limb:'#c48a5a', limbStroke:'#a8724a', bike:'#14b8c4', bike2:'#ffa630',
      body: torso('#c48a5a','#a8724a'),
      head: `<circle cx="-14" cy="-16" r="5" fill="#a8724a"/><circle cx="9" cy="-18" r="5" fill="#a8724a"/>
             <rect x="-20" y="-17" width="40" height="33" rx="14" fill="#c48a5a" stroke="#a8724a" stroke-width="2"/>
             <rect x="-2" y="0" width="26" height="16" rx="8" fill="#dcab80"/>
             <circle cx="-1" cy="-24" r="8" fill="#ffa630"/><path d="M-1 -32 Q4 -39 10 -36 Q5 -30 -1 -32 Z" fill="#5fcf7a"/>`,
      neck:[22,-33], face:{x:1, y:-2, s:.85}, tint:'<rect x="-20" y="-17" width="40" height="33" rx="14" fill="#ff3b3b" opacity="{o}"/>'},
    pingouin: {n:'Gisèle la pingouine', avatar:6, limb:'#ffa630', limbStroke:'#e08a10', arm:'#3d3a5c', armStroke:'#2f2c4a', bike:'#ff4fa3', bike2:'#3d3a5c',
      body: torso('#3d3a5c','#2f2c4a') + `<ellipse cx="13" cy="-12" rx="8" ry="12" fill="#fff" transform="rotate(28 13 -12)"/>
             <path d="M-10 0 L-6 -6 L-2 2 L2 -6 L6 2 L10 -6 L14 2 L18 -5 L20 2 Q5 12 -10 0 Z" fill="#ff9fd0" stroke="#ff5fae" stroke-width="1.5" stroke-linejoin="round"/>`,
      head: `<circle cx="0" cy="0" r="19" fill="#3d3a5c"/><ellipse cx="3" cy="3" rx="13" ry="12" fill="#fff"/>
             <path d="M14 1 L24 4 L14 8 Z" fill="#ffa630"/>
             <path d="M-2 -18 L-12 -25 L-12 -12 Z M-2 -18 L8 -25 L8 -12 Z" fill="#ff4fa3"/><circle cx="-2" cy="-18" r="3" fill="#ff8fc8"/>`,
      neck:[22,-34], face:{x:1, y:0, s:.85}},
    grenouille: {n:'Gégé la grenouille cowboy', avatar:7, limb:'#7ddc8a', limbStroke:'#4fae5d', bike:'#c9844a', bike2:'#ff5fae',
      body: torso('#7ddc8a','#4fae5d') + `<path d="M8 -30 L30 -30 L19 -18 Z" fill="#ff5fae"/>`,
      head: `<circle cx="-5" cy="-12" r="8.5" fill="#7ddc8a" stroke="#4fae5d" stroke-width="1.6"/><circle cx="9" cy="-12" r="8.5" fill="#7ddc8a" stroke="#4fae5d" stroke-width="1.6"/>
             <ellipse cx="0" cy="2" rx="23" ry="15" fill="#7ddc8a" stroke="#4fae5d" stroke-width="2"/>
             <circle cx="-5" cy="-12" r="6" fill="#fff"/><circle cx="9" cy="-12" r="6" fill="#fff"/>
             <path d="M-8 -22 Q-7 -38 2 -36 Q11 -38 12 -22 Z" fill="#c9844a"/><rect x="-7.5" y="-26" width="19" height="4" fill="#ff5fae"/>
             <path d="M-20 -21 Q2 -14 24 -21 Q22 -26 17 -24 Q2 -19 -13 -24 Q-18 -26 -20 -21 Z" fill="#b5713b"/>`,
      neck:[22,-32], face:{x:2, y:-10, s:.95}, tint:'<ellipse cx="0" cy="2" rx="23" ry="15" fill="#ff3b3b" opacity="{o}"/>'},
    pieuvre: {n:'Octavie la pieuvre', avatar:8, limb:'#c58cff', limbStroke:'#a46ee0', bike:'#e0a800', bike2:'#c58cff',
      body: `<g fill="none" stroke="#c58cff" stroke-width="6" stroke-linecap="round"><path d="M0 0 Q-10 12 -4 22"/><path d="M-4 -2 Q-18 6 -16 18"/></g>`
             + torso('#c58cff','#a46ee0')
             + `<path d="M4 -24 Q-14 -34 -16 -50" fill="none" stroke="#a46ee0" stroke-width="8" stroke-linecap="round"/><path d="M4 -24 Q-14 -34 -16 -50" fill="none" stroke="#c58cff" stroke-width="5" stroke-linecap="round"/>
             <circle cx="-16" cy="-54" r="8" fill="#ffd36b"/><circle cx="-19" cy="-56" r="3" fill="#ffe79a"/><circle cx="-12" cy="-52" r="3" fill="#ffe79a"/>`,
      head: `<ellipse cx="0" cy="-2" rx="21" ry="21" fill="#c58cff" stroke="#a46ee0" stroke-width="2"/>
             <circle cx="-10" cy="-14" r="3" fill="#dcb6ff"/><circle cx="9" cy="-15" r="2.4" fill="#dcb6ff"/><circle cx="15" cy="-6" r="2" fill="#dcb6ff"/>`,
      neck:[22,-34], face:{x:2, y:2, s:.9}},
    cubo: {n:'Cubo le cube', avatar:null, pixel:true, limb:'#8a5a2b', limbStroke:'#5a3a1b', arm:'#5ec43a', armStroke:'#3f8a2a', bike:'#2f8fe0', bike2:'#ffcf33',
      body: `<g shape-rendering="crispEdges" transform="rotate(28 10 -14)"><rect x="-2" y="-32" width="24" height="34" fill="#2f8fe0" stroke="#1c4f80" stroke-width="2"/>
             <rect x="2" y="-28" width="6" height="6" fill="#4fa8f0"/><rect x="12" y="-14" width="6" height="6" fill="#1f6fbf"/></g>`,
      head: `<g shape-rendering="crispEdges"><rect x="-18" y="-18" width="36" height="36" fill="#5ec43a" stroke="#2f6a1f" stroke-width="2"/>
             <rect x="-18" y="-18" width="36" height="9" fill="#3f8a2a"/><rect x="-12" y="-9" width="6" height="4" fill="#3f8a2a"/><rect x="8" y="-9" width="4" height="3" fill="#3f8a2a"/>
             <rect x="-16" y="8" width="5" height="5" fill="#7fe060"/><rect x="11" y="10" width="5" height="5" fill="#4fae2f"/></g>`,
      neck:[22,-34], face:{x:1, y:2, s:1}, tint:'<rect x="-18" y="-18" width="36" height="36" fill="#ff3b3b" opacity="{o}"/>'},
  };

  // ---------- Expressions selon l'effort (dessinées par le squelette, pour toutes les peaux) ----------
  const LEVELS = ['Tranquille', 'Ça chauffe', 'Ça pique', 'Dur dur', 'À fond !'];
  function face(level, t){
    const e = (x, y, r = 3.4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x+1.2}" cy="${y-1.2}" r="${r*.38}" fill="#fff"/>`;
    const blush = a => `<ellipse cx="-9" cy="6" rx="4.5" ry="2.6" fill="#ff6fa3" opacity="${a}"/><ellipse cx="13" cy="6" rx="4.5" ry="2.6" fill="#ff6fa3" opacity="${a}"/>`;
    const spiral = (x, y) => `<path d="M${x} ${y} m0 0 a1 1 0 0 1 2 0 a2 2 0 0 1 -4 0 a3 3 0 0 1 6 0 a4 4 0 0 1 -8 0" fill="none" stroke="${INK}" stroke-width="1.4" transform="rotate(${(t*400)%360} ${x} ${y})"/>`;
    switch(level){
      case 0: return e(-6,-1) + e(8,-1) + blush(.5) + `<path d="M-1 6 Q2 9.5 5 6" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`;
      case 1: return e(-6,-1) + e(8,-1) + blush(.7) + `<ellipse cx="2" cy="7.5" rx="2.6" ry="2" fill="${INK}"/>`;
      case 2: return `<path d="M-9 -2 L-3 -1 M5 -1 L11 -2" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>` + e(-6,1,2.6) + e(8,1,2.6) + blush(.9)
        + `<rect x="-3" y="5" width="10" height="5" rx="1.5" fill="#fff" stroke="${INK}" stroke-width="1.6"/><path d="M2 5 V10 M-0.5 7.5 H4.5" stroke="${INK}" stroke-width="1"/>`;
      case 3: return `<path d="M-9 -4 L-4 -1 L-9 2 M11 -4 L6 -1 L11 2" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>` + blush(1)
        + `<path d="M-3 5 Q2 13 7 5 Z" fill="#c2325f"/><path d="M0 8 Q2 14 5 9" fill="#ff8fb0" stroke="#c2325f" stroke-width=".8"/>`;
      default: return spiral(-6,-1) + spiral(8,-1) + blush(1)
        + `<ellipse cx="2" cy="8" rx="5" ry="5.5" fill="#c2325f"/><path d="M-1 10 Q2 17 5 10" fill="#ff8fb0" stroke="#c2325f" stroke-width=".8"/>`;
    }
  }

  // Visage en pixels (pour Cubo)
  function pixFace(level){
    const r = (x, y, w, h, c = INK) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
    let f = '';
    if (level <= 1) f += r(-9,-5,5,5) + r(5,-5,5,5) + r(-8,-5,2,2,'#fff') + r(6,-5,2,2,'#fff');
    else if (level === 2) f += r(-10,-7,6,2) + r(5,-7,6,2) + r(-9,-3,5,3) + r(5,-3,5,3);
    else if (level === 3) f += r(-10,-6,2,2) + r(-8,-4,2,2) + r(-10,-2,2,2) + r(10,-6,2,2) + r(8,-4,2,2) + r(10,-2,2,2);
    else f += [[-10,-6],[-6,-6],[-8,-4],[-10,-2],[-6,-2],[5,-6],[9,-6],[7,-4],[5,-2],[9,-2]].map(([x,y]) => r(x,y,2,2)).join('');
    if (level >= 1) f += r(-14,3,4,2,'#ff6fa3') + r(11,3,4,2,'#ff6fa3');
    f += [r(-3,6,7,2) + r(-5,4,2,2) + r(4,4,2,2), r(-1,5,3,3), r(-4,5,9,4) + r(-3,6,7,2,'#fff'),
          r(-3,4,7,6,'#c2325f') + r(-1,8,3,3,'#ff8fb0'), r(-4,3,9,8,'#c2325f') + r(-2,8,5,4,'#ff8fb0')][level];
    return `<g shape-rendering="crispEdges">${f}</g>`;
  }

  // ---------- Cinématique inverse à deux os (cuisse + tibia), genou vers l'avant ----------
  function ik(hx, hy, fx, fy, l1, l2){
    let dx = fx - hx, dy = fy - hy, d = Math.hypot(dx, dy);
    const max = l1 + l2 - 0.5; if (d > max){ dx *= max/d; dy *= max/d; fx = hx + dx; fy = hy + dy; d = max; }
    const a = Math.atan2(dy, dx), off = Math.acos(Math.min(1, Math.max(-1, (l1*l1 + d*d - l2*l2) / (2*l1*d))));
    const k1 = [hx + l1*Math.cos(a - off), hy + l1*Math.sin(a - off)], k2 = [hx + l1*Math.cos(a + off), hy + l1*Math.sin(a + off)];
    return {knee: k1[0] > k2[0] ? k1 : k2, foot:[fx, fy]};
  }

  // ---------- Dessin d'une image (état complet) ----------
  function wheel(cx, cy, r, ang, col){
    let spokes = ''; for (let i = 0; i < 6; i++){ const a = ang + i*Math.PI/3; spokes += `<line x1="${cx}" y1="${cy}" x2="${cx + r*Math.cos(a)}" y2="${cy + r*Math.sin(a)}" stroke="#c9b8d6" stroke-width="1.2"/>`; }
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="${r-3}" fill="none" stroke="${col}" stroke-width="1.5" opacity=".6"/>${spokes}<circle cx="${cx}" cy="${cy}" r="2.5" fill="${INK}"/>`;
  }
  function frame(skin, st){
    const {level, t, crank, wheelA, particles, bob, shake, scroll} = st;
    const sx = shake ? (Math.random()-.5)*shake : 0, sy = shake ? (Math.random()-.5)*shake : 0;
    const [bx, by] = G.bb, hip = [G.hip[0], G.hip[1] + bob];
    const p1 = [bx + G.crankR*Math.cos(crank), by + G.crankR*Math.sin(crank)], p2 = [bx - G.crankR*Math.cos(crank), by - G.crankR*Math.sin(crank)];
    const L1 = ik(hip[0], hip[1], p1[0], p1[1] - 2, G.thigh, G.shin), L2 = ik(hip[0], hip[1], p2[0], p2[1] - 2, G.thigh, G.shin);
    const leg = (L, col, sc, w) => `<path d="M${hip[0]} ${hip[1]} L${L.knee[0]} ${L.knee[1]} L${L.foot[0]} ${L.foot[1]}" fill="none" stroke="${sc}" stroke-width="${w+3}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M${hip[0]} ${hip[1]} L${L.knee[0]} ${L.knee[1]} L${L.foot[0]} ${L.foot[1]}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>
      <ellipse cx="${L.foot[0]+2}" cy="${L.foot[1]+1}" rx="5" ry="3.2" fill="${INK}"/>`;
    const tint = [0, 0, .08, .22, .38][level];
    let s = '';
    // sol qui défile + traits de vitesse
    s += `<line x1="0" y1="116" x2="${W}" y2="116" stroke="${INK}" stroke-width="1.5" stroke-dasharray="14 10" stroke-dashoffset="${scroll}" opacity=".35"/>`;
    if (level >= 3) for (let i = 0; i < level - 1; i++){ const y = 50 + i*14, x = ((scroll*3 + i*37) % 60); s += `<line x1="${8 + x}" y1="${y}" x2="${28 + x}" y2="${y}" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity=".25"/>`; }
    s += `<g transform="translate(${sx} ${sy})">`;
    // jambe du fond, roues, cadre
    s += leg(L2, shade(skin.limb), shade(skin.limbStroke), 6);
    s += wheel(G.rear[0], G.rear[1], G.wheelR, wheelA, skin.bike2) + wheel(G.front[0], G.front[1], G.wheelR, wheelA, skin.bike2);
    s += `<path d="M${G.rear[0]} ${G.rear[1]} L${bx} ${by} L${G.seat[0]} ${G.seat[1]+4} Z M${G.seat[0]} ${G.seat[1]+4} L${G.head[0]} ${G.head[1]} L${bx} ${by} M${G.head[0]} ${G.head[1]} L${G.front[0]} ${G.front[1]} M${G.head[0]} ${G.head[1]} L${G.bar[0]-6} ${G.bar[1]+2} L${G.bar[0]} ${G.bar[1]}"
      fill="none" stroke="${skin.bike}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += `<rect x="${G.seat[0]-9}" y="${G.seat[1]}" width="18" height="5" rx="2.5" fill="${INK}"/>`;
    s += `<circle cx="${bx}" cy="${by}" r="5" fill="${INK}"/><line x1="${p2[0]}" y1="${p2[1]}" x2="${p1[0]}" y2="${p1[1]}" stroke="#777" stroke-width="2.5" stroke-linecap="round"/>`;
    // buste + tête (peau), bras vers le guidon
    const neck = [hip[0] + skin.neck[0], hip[1] + skin.neck[1]];
    s += `<g transform="translate(${hip[0]} ${hip[1]})">${skin.body}</g>`;
    s += `<path d="M${hip[0]+16} ${hip[1]-22} Q${hip[0]+38} ${hip[1]-20} ${G.bar[0]} ${G.bar[1]}" fill="none" stroke="${skin.armStroke || skin.limbStroke}" stroke-width="8" stroke-linecap="${skin.pixel ? 'square' : 'round'}"/>
          <path d="M${hip[0]+16} ${hip[1]-22} Q${hip[0]+38} ${hip[1]-20} ${G.bar[0]} ${G.bar[1]}" fill="none" stroke="${skin.arm || skin.limb}" stroke-width="5" stroke-linecap="${skin.pixel ? 'square' : 'round'}"/>`;
    const hb = level >= 2 ? Math.sin(t*14)*0.8*level : 0;
    s += `<g transform="translate(${neck[0]} ${neck[1] + hb})">${skin.head}
      ${tint ? (skin.tint ? skin.tint.replace('{o}', tint) : `<ellipse cx="0" cy="0" rx="21" ry="19" fill="#ff3b3b" opacity="${tint}"/>`) : ''}
      <g transform="translate(${skin.face.x} ${skin.face.y}) scale(${skin.face.s})">${skin.pixel ? pixFace(level) : face(level, t)}</g></g>`;
    // jambe du premier plan par-dessus
    s += leg(L1, skin.limb, skin.limbStroke, 6.5);
    s += `</g>`;
    // particules (sueur, vapeur, notes)
    particles.forEach(p => {
      const o = Math.max(0, 1 - p.age / p.life);
      if (p.k === 'drop') s += `<path d="M${p.x} ${p.y-4} Q${p.x+3} ${p.y} ${p.x} ${p.y+2} Q${p.x-3} ${p.y} ${p.x} ${p.y-4} Z" fill="#6cc4ff" stroke="#2f8fd8" stroke-width=".6" opacity="${o}"/>`;
      else if (p.k === 'steam') s += `<circle cx="${p.x}" cy="${p.y}" r="${3 + p.age*9}" fill="#fff" stroke="#ddd" stroke-width=".8" opacity="${o*.8}"/>`;
      else s += `<text x="${p.x}" y="${p.y}" font-size="11" font-weight="900" fill="${skin.bike}" opacity="${o}">♪</text>`;
    });
    return s;
  }
  function shade(hex){ // un peu plus sombre pour la jambe du fond
    const n = parseInt(hex.slice(1), 16), f = .82;
    return '#' + [n>>16, n>>8&255, n&255].map(c => Math.round(c*f).toString(16).padStart(2,'0')).join('');
  }

  // ---------- Animation ----------
  class Rider {
    constructor(el){ this.el = el; this.svg = document.createElementNS(NS, 'svg'); this.svg.setAttribute('viewBox', `0 ${TOP} ${W} ${H - TOP}`);
      this.svg.setAttribute('preserveAspectRatio', 'xMidYMax meet'); this.svg.style.width = '100%'; this.svg.style.height = '100%';
      el.innerHTML = ''; el.appendChild(this.svg);
      this.st = {level:0, t:0, crank:0, wheelA:0, particles:[], bob:0, shake:0, scroll:0}; this.cad = 1; this.last = performance.now(); this.spawn = 0;
      this.reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      const loop = now => { if (!this.el.isConnected){ this.stop = true; return; } this.tick(now); this.raf = requestAnimationFrame(loop); };
      this.raf = requestAnimationFrame(loop); }
    set(id, level, cadenceS){ this.skin = SKINS[id] || SKINS.licorne; this.st.level = Math.max(0, Math.min(4, level|0)); this.cad = cadenceS; }
    tick(now){
      const dt = Math.min(.1, (now - this.last) / 1000); this.last = now;
      if (now - (this.drawn||0) < 33) return; this.drawn = now;          // ~30 images/s suffisent
      const st = this.st, moving = this.cad > 0 && this.cad < 20, w = moving ? 2*Math.PI / this.cad : 0;
      const k = this.reduce ? .4 : 1;
      st.t += dt; st.crank += w*dt*k; st.wheelA += w*1.8*dt*k; st.scroll -= (moving ? 60/this.cad : 0)*dt*k;
      st.bob = moving ? Math.sin(st.crank*2)*(1 + st.level*.4) : 0;
      st.shake = this.reduce ? 0 : [0,0,0,.6,1.4][st.level];
      // particules
      const rate = moving ? [.5, 1.2, 3, 6, 11][st.level] : 0; this.spawn += rate*dt;
      const neck = [G.hip[0] + this.skin.neck[0], G.hip[1] + this.skin.neck[1]];
      while (this.spawn > 1){ this.spawn--;
        if (st.level === 0) st.particles.push({k:'note', x:neck[0]+18, y:neck[1]-14, vx:6, vy:-14, age:0, life:1.6});
        else st.particles.push({k:'drop', x:neck[0] + (Math.random()*16 - 6), y:neck[1] - 12 + Math.random()*10, vx:-20 - Math.random()*25, vy:-25 - Math.random()*20 - st.level*6, age:0, life:1});
        if (st.level >= 3 && Math.random() < .5) st.particles.push({k:'steam', x:neck[0] - 4 + Math.random()*10, y:neck[1] - 22, vx:-6, vy:-18, age:0, life:1.1});
      }
      st.particles = st.particles.filter(p => { p.age += dt; p.x += p.vx*dt; p.y += p.vy*dt; if (p.k === 'drop') p.vy += 90*dt; return p.age < p.life && p.y < H; });
      if (st.particles.length > 80) st.particles.splice(0, st.particles.length - 80);
      this.svg.innerHTML = frame(this.skin, st);
    }
  }

  const riders = new WeakMap();
  window.HTMascot = {
    list: Object.entries(SKINS).map(([id, s]) => ({id, n:s.n, avatar:s.avatar})),
    levels: LEVELS,
    css: '',
    // image fixe (pour les listes de choix)
    svg(id, level = 0){ const skin = SKINS[id] || SKINS.licorne;
      return `<svg viewBox="0 ${TOP} ${W} ${H - TOP}" xmlns="${NS}">${frame(skin, {level, t:0, crank:.6, wheelA:0, particles:[], bob:0, shake:0, scroll:0})}</svg>`; },
    // mascotte animée dans un élément ; rappeler mount() met à jour mascotte, niveau et cadence (secondes par tour)
    mount(el, id, level, cadenceS){ let r = riders.get(el); if (!r || r.stop){ r = new Rider(el); riders.set(el, r); } r.set(id, level, cadenceS); return r; },
  };
})();
