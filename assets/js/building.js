/* Mặt cắt toà nhà JDV — vẽ bằng SVG, 4 lớp hệ thống: hvac · elec · water · fire.
   Dùng chung cho hero và mục "4 hệ thống". Không cần thư viện ngoài. */
window.JDVBuilding = function (uid) {
  var X0 = 110, X1 = 490, FL = [150, 235, 320, 405], H = 85, G = 490;
  var s = [];
  function p(t) { s.push(t); }

  p('<svg class="bld" viewBox="0 0 600 580" role="img" aria-label="Mặt cắt toà nhà: điều hoà, điện, cấp nước, PCCC vận hành">');
  p('<defs><pattern id="' + uid + 'h" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#F1EDE8"/><line x1="0" y1="0" x2="0" y2="8" stroke="#D2CAC0" stroke-width="2"/></pattern></defs>');

  /* trời nắng + hơi nóng */
  p('<g class="L L-hvac">');
  p('<g class="sun"><circle cx="54" cy="56" r="16" fill="#D49A4E"/>');
  for (var a = 0; a < 8; a++) { var r = a * Math.PI / 4; p('<line x1="' + (54 + Math.cos(r) * 22).toFixed(1) + '" y1="' + (56 + Math.sin(r) * 22).toFixed(1) + '" x2="' + (54 + Math.cos(r) * 30).toFixed(1) + '" y2="' + (56 + Math.sin(r) * 30).toFixed(1) + '" stroke="#D49A4E" stroke-width="2.4" stroke-linecap="round"/>'); }
  p('</g>');
  p('<path class="heat" d="M40 110 q8 14 0 28 t0 28 t0 28"/><path class="heat" d="M64 120 q8 14 0 28 t0 28 t0 28"/><path class="heat" d="M88 104 q8 14 0 28 t0 28"/>');
  p('</g>');

  /* đất + tầng hầm */
  p('<rect class="gnd" x="20" y="494" width="90" height="86" fill="url(#' + uid + 'h)"/><rect class="gnd" x="490" y="494" width="90" height="86" fill="url(#' + uid + 'h)"/>');
  p('<rect x="' + X0 + '" y="494" width="' + (X1 - X0) + '" height="80" fill="#FBF1E6" stroke="#2E3035" stroke-width="2"/>');
  p('<text class="lbl" x="' + (X0 - 14) + '" y="530" text-anchor="end">HẦM KT</text>');

  /* khung nhà */
  p('<rect x="' + X0 + '" y="' + FL[0] + '" width="' + (X1 - X0) + '" height="' + (G - FL[0]) + '" fill="#fff"/>');
  for (var i = 1; i < 4; i++) p('<line class="st2" x1="' + X0 + '" y1="' + (FL[i] - 42) + '" x2="' + X1 + '" y2="' + (FL[i] - 42) + '" stroke-dasharray="2 6"/>');
  p('<rect class="slab" x="' + (X0 - 6) + '" y="' + (FL[0] - 5) + '" width="' + (X1 - X0 + 12) + '" height="6"/>');
  p('<rect class="slab" x="' + (X0 - 6) + '" y="' + (FL[0] - 22) + '" width="5" height="18"/><rect class="slab" x="' + (X1 + 1) + '" y="' + (FL[0] - 22) + '" width="5" height="18"/>');
  for (i = 1; i < 4; i++) p('<rect class="slab" x="' + X0 + '" y="' + FL[i] + '" width="' + (X1 - X0) + '" height="5"/>');
  p('<rect class="slab" x="20" y="' + G + '" width="560" height="4"/>');
  p('<rect x="' + (X0 - 6) + '" y="' + FL[0] + '" width="6" height="' + (G - FL[0]) + '" fill="#2E3035"/><rect x="' + X1 + '" y="' + FL[0] + '" width="6" height="' + (G - FL[0]) + '" fill="#2E3035"/>');
  var fname = ['TẦNG 4', 'TẦNG 3', 'TẦNG 2', 'TẦNG 1'];
  FL.forEach(function (y, k) { p('<text class="lbl" x="' + (X0 - 14) + '" y="' + (y + 50) + '" text-anchor="end">' + fname[k] + '</text>'); });

  /* ---------- lớp ĐIỆN ---------- */
  p('<g class="L L-elec">');
  p('<path class="cab" d="M124 ' + 520 + ' V' + (FL[0] + 8) + '"/>');
  FL.forEach(function (y) {
    p('<path class="cab" d="M124 ' + (y + 8) + ' H430"/>');
    [245, 350].forEach(function (x) { p('<circle class="lamp-g" cx="' + x + '" cy="' + (y + 24) + '" r="16"/><circle class="lamp" cx="' + x + '" cy="' + (y + 10) + '" r="3.5"/>'); });
    p('<rect class="dev" x="114" y="' + (y + 40) + '" width="16" height="22" rx="1"/><line x1="118" y1="' + (y + 47) + '" x2="126" y2="' + (y + 47) + '" stroke="#D49A4E" stroke-width="2"/>');
  });
  p('<rect class="dev" x="150" y="504" width="44" height="42" rx="2"/><path d="M160 514 h24 M160 522 h24 M160 530 h16" stroke="#D49A4E" stroke-width="2"/><path d="M124 520 H150" class="cab"/>');
  p('<text class="lbl" x="150" y="564">TỦ ĐIỆN</text>');
  p('</g>');

  /* ---------- lớp NƯỚC ---------- */
  p('<g class="L L-water">');
  p('<path class="wat" d="M472 530 V' + (FL[0] + 76) + '"/>');
  FL.forEach(function (y) {
    p('<path class="wat" d="M472 ' + (y + 76) + ' H392"/>');
    p('<rect class="dev" x="370" y="' + (y + 64) + '" width="22" height="16" rx="2"/><path d="M381 ' + (y + 64) + ' v-8 h6" fill="none" stroke="#8A8D93" stroke-width="2"/>');
  });
  p('<rect class="dev" x="392" y="506" width="62" height="40" rx="2"/><path d="M396 524 q7 -5 14 0 t14 0 t14 0 t12 0" fill="none" stroke="#8A8D93" stroke-width="1.6"/><path d="M454 530 H472" class="wat-s"/>');
  p('<text class="lbl" x="392" y="564">BỂ NƯỚC</text>');
  p('</g>');

  /* ---------- lớp PCCC ---------- */
  p('<g class="L L-fire">');
  p('<path class="fire" d="M138 530 V' + (FL[0] + 28) + '"/>');
  FL.forEach(function (y) {
    p('<path class="fire" d="M138 ' + (y + 28) + ' H440"/>');
    [215, 300, 385].forEach(function (x) { p('<path class="spk" d="M' + (x - 4) + ' ' + (y + 28) + ' h8 l-4 7z"/>'); });
    p('<circle class="det" cx="160" cy="' + (y + 10) + '" r="5"/><circle class="det-l" cx="160" cy="' + (y + 10) + '" r="1.8"/>');
  });
  p('<rect class="dev" x="222" y="508" width="48" height="36" rx="18" stroke="#B23A26"/><circle cx="246" cy="526" r="9" fill="none" stroke="#B23A26" stroke-width="2"/><path d="M138 530 H222" class="fire"/>');
  p('<text class="lbl" x="222" y="564">BƠM PCCC</text>');
  p('</g>');

  /* ---------- lớp ĐIỀU HOÀ ---------- */
  p('<g class="L L-hvac">');
  p('<path class="ref flow" d="M234 138 H456 V' + (FL[3] + 14) + '"/>');
  FL.forEach(function (y) {
    p('<path class="ref flow" d="M456 ' + (y + 14) + ' H170"/>');
    [190, 300, 400].forEach(function (cx) {
      p('<path class="air" d="M' + (cx - 20) + ' ' + (y + 23) + ' q-8 18 -20 34"/><path class="air" d="M' + (cx + 20) + ' ' + (y + 23) + ' q8 18 20 34"/><path class="air" d="M' + cx + ' ' + (y + 25) + ' v26"/>');
      p('<rect class="dev" x="' + (cx - 26) + '" y="' + (y + 11) + '" width="52" height="11" rx="2"/><line x1="' + (cx - 16) + '" y1="' + (y + 18) + '" x2="' + (cx + 16) + '" y2="' + (y + 18) + '" stroke="#8A8D93" stroke-width="1.5"/>');
    });
  });
  [170, 250, 330].forEach(function (x, k) {
    p('<rect class="dev" x="' + x + '" y="98" width="64" height="47" rx="2"/>');
    p('<circle cx="' + (x + 32) + '" cy="116" r="13" fill="#F6F3EF" stroke="#2E3035" stroke-width="1.4"/>');
    p('<g class="fan' + (k === 1 ? ' slow' : '') + '"><path d="M' + (x + 32) + ' 116 l0 -11 a4 4 0 0 1 4 5z M' + (x + 32) + ' 116 l9.5 5.5 a4 4 0 0 1 -6 1.5z M' + (x + 32) + ' 116 l-9.5 5.5 a4 4 0 0 1 2 -6z" fill="#B5532A"/><circle cx="' + (x + 32) + '" cy="116" r="2.2" fill="#2E3035"/></g>');
    p('<path d="M' + (x + 8) + ' 134 h48 M' + (x + 8) + ' 139 h48" stroke="#D2CAC0" stroke-width="1.5"/>');
  });
  p('<text class="lbl" x="170" y="90">DÀN NÓNG VRF</text>');
  p('</g>');

  /* ---------- nhãn khi làm nổi ---------- */
  function tag(cls, y, tx, ty, txt) {
    p('<g class="tagL ' + cls + '"><line class="tag-ln" x1="' + tx + '" y1="' + ty + '" x2="500" y2="' + (y + 11) + '"/><rect class="tag-box" x="500" y="' + y + '" width="100" height="22" rx="2"/><text class="tag-t" x="508" y="' + (y + 15) + '">' + txt + '</text></g>');
  }
  tag('tag-hvac', 60, 394, 118, 'VRF · FCU');
  tag('tag-elec', 190, 350, FL[0] + 10, 'ĐIỆN · ĐÈN');
  tag('tag-water', 300, 472, FL[1] + 76, 'CẤP NƯỚC');
  tag('tag-fire', 420, 385, FL[3] + 32, 'SPRINKLER');
  p('</svg>');
  return s.join('');
};
