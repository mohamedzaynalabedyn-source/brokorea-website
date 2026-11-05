/* BRO KOREA — header logo intro (first page of a visit only).
 *
 * The <head> script adds "logo-intro" to <html> on the first page of a visit (not for reduced
 * motion, not if sessionStorage is blocked); CSS then hides the red swoosh and KOREA. This script
 * loads GSAP and plays once:
 *   - a thin red wave line runs in from the page edge (left on English pages, right on Arabic
 *     pages) through the space beside the logo and hands over to the swoosh, then fades away;
 *   - the roofline curve draws (from its tail in English, from its nose in Arabic), the lower curve
 *     follows and KOREA fades in, with the approved timing;
 *   - BRO and the flag never move; the logo itself is never mirrored.
 * Where there is little space beside the logo (phones, small laptops) the logo just draws itself.
 * Without GSAP, or if anything fails, the finished logo is shown. Nothing loops.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  if (!root.classList.contains("logo-intro")) return;          // not the first page of this visit

  var header = document.querySelector(".site-header");
  var svg = header && header.querySelector(".logo-anim");
  var me = document.currentScript;
  function release() {
    root.classList.remove("logo-intro");
    clearTimeout(window.BK_LOGO_INTRO);
  }
  if (!svg || !me) { release(); return; }

  var gsapScript = document.createElement("script");
  gsapScript.src = me.src.replace(/logo-anim\.js(\?.*)?$/, "vendor/gsap.min.js");
  gsapScript.onload = start;
  gsapScript.onerror = release;
  document.head.appendChild(gsapScript);

  var SVGNS = "http://www.w3.org/2000/svg";
  var LOGO_W = 1120;                        // logo viewBox width
  var TAIL = [36, 470], NOSE = [1094, 466]; // ends of the roofline curve, logo units

  function reversed(d) {                    // "M x,y L x,y ..." polyline, drawn from the other end
    var pts = d.match(/-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?/g).reverse();
    return "M" + pts.join(" L");
  }

  function start() {
    if (!window.gsap || !root.classList.contains("logo-intro")) { release(); return; }  // fallback already showed the logo
    var rtl = root.getAttribute("dir") === "rtl";
    var lines = [].slice.call(svg.querySelectorAll("defs > path"));
    var original = lines.map(function (p) { return p.getAttribute("d"); });
    if (rtl) lines.forEach(function (p) { p.setAttribute("d", reversed(p.getAttribute("d"))); });

    var draws = [].slice.call(svg.querySelectorAll(".swoosh-draw"));
    var curve = function (n) { return draws.filter(function (u) { return u.getAttribute("data-curve") === String(n); }); };
    var korea = svg.querySelector(".korea");
    draws.forEach(function (use) {
      var line = svg.querySelector(use.getAttribute("href"));
      var length = line.getTotalLength();
      var lead = parseFloat(use.getAttribute("data-lead")) || 0;
      var cap = (parseFloat(use.getAttribute("stroke-width")) || 0) / 2;
      // the leading tip strokes are longer by `lead` and have round caps; the nose end of the centre line
      // is close to the shape, so from there start further back or a speck would show before the line arrives
      gsap.set(use, { strokeDasharray: (length + lead) + " " + (2 * length), strokeDashoffset: length + (rtl ? lead + cap : 0) });
    });
    gsap.set(korea, { opacity: 0 });
    var wave = makeWave(rtl);
    release();                               // GSAP controls the state from here

    function finish() {
      lines.forEach(function (p, i) { p.setAttribute("d", original[i]); });
      gsap.set(draws, { clearProps: "strokeDasharray,strokeDashoffset" });
      gsap.set(korea, { clearProps: "opacity" });
      if (wave) wave.svg.remove();
    }

    var tl = gsap.timeline({ onComplete: finish });
    var t = 0;
    if (wave) {
      tl.to(wave.path, { strokeDashoffset: 0, duration: wave.dur, ease: "power1.in" }, 0);
      t = wave.dur;                          // the swoosh picks up exactly as the line arrives
      tl.to(wave.path, { strokeDashoffset: -wave.len, duration: 0.7, ease: "power1.in" }, t + 0.05)   // line slides into the logo
        .to(wave.svg, { opacity: 0, duration: 0.45, ease: "power1.out" }, t + 0.4);
    }
    tl.to(curve(1), { strokeDashoffset: 0, duration: 1.05, ease: wave ? "power1.out" : "power1.inOut" }, t)
      .to(curve(2), { strokeDashoffset: 0, duration: 0.52, ease: "power1.inOut" }, t + 0.58)
      .to(korea, { opacity: 1, duration: 0.65, ease: "power1.out" }, t + 0.7);
  }

  // Wave line from the page edge to the end of the roofline curve, sized to the real gap.
  function makeWave(rtl) {
    var hr = header.getBoundingClientRect(), lr = svg.getBoundingClientRect();
    if (!lr.width) return null;
    var k = lr.width / LOGO_W;
    var end = rtl ? NOSE : TAIL;
    var ex = lr.left - hr.left + end[0] * k, ey = lr.top - hr.top + end[1] * k;
    var W = hr.width, H = hr.height;
    var gap = rtl ? W - ex : ex;
    if (gap < 64) return null;               // phones and small laptops: the logo draws itself
    var x0 = rtl ? W + 4 : -4;
    var halfWaves = Math.max(2, Math.round(gap / 70));
    var amp = Math.min(8, H * 0.1);
    var n = Math.max(40, Math.round(gap / 3)), pts = [];
    for (var i = 0; i <= n; i++) {
      var s = i / n, env = amp * Math.pow(1 - s, 1.4);        // waves settle as they reach the logo
      pts.push((x0 + (ex - x0) * s).toFixed(1) + "," + (ey + env * Math.sin(s * halfWaves * Math.PI)).toFixed(1));
    }
    var el = document.createElementNS(SVGNS, "svg");
    el.setAttribute("class", "logo-wave");
    el.setAttribute("aria-hidden", "true");
    el.setAttribute("focusable", "false");
    el.setAttribute("width", W);
    el.setAttribute("height", H);
    el.setAttribute("viewBox", "0 0 " + W + " " + H);
    var path = document.createElementNS(SVGNS, "path");
    path.setAttribute("d", "M" + pts.join(" L"));
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#CD2E3A");
    path.setAttribute("stroke-width", Math.max(1.6, 28 * k).toFixed(2));
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    el.appendChild(path);
    header.appendChild(el);
    var len = path.getTotalLength();
    // gap slightly longer than the line, so no zero-length dash (a round dot) sits at its end before it moves
    gsap.set(path, { strokeDasharray: len + " " + (len + 4), strokeDashoffset: len });
    return { svg: el, path: path, len: len, dur: Math.min(0.8, Math.max(0.35, gap / 650)) };
  }
})();
