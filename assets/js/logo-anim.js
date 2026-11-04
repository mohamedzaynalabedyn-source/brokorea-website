/* BRO KOREA — animated logo in the homepage hero (needs vendor/gsap.min.js).
 *
 * BRO and the flag never move. One timeline, ≈ 1.35 s, then the logo holds still:
 *   0.00 – 1.05  The roofline curve draws along its own path (ease power1.inOut: gentle start,
 *                confident middle, smooth settle). Visible from ≈ 0.15 s.
 *   0.58 – 1.10  The shorter lower curve follows, starting as the roofline passes above it.
 *   0.70 – 1.35  KOREA fades in, overlapping the end of the drawing.
 *
 * Each red shape is a fixed filled silhouette inside a mask. The mask holds several strokes
 * (<use class="swoosh-draw">) along the shape's centre line: a full-width one, plus narrower
 * round-ended ones whose dash is longer by `data-lead`, so they run just ahead of it. All of a
 * curve's strokes share one stroke-dashoffset tween, so the moving front is a rounded taper and
 * the reveal never leaves the silhouette. The motion is identical on English and Arabic pages;
 * the logo is never mirrored.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var svg = document.querySelector(".logo-anim");
  if (!svg) return;

  // Show the finished logo if the animation can't run.
  function release() { root.classList.remove("logo-anim-pending"); }
  if (!window.gsap) { release(); return; }

  var draws = Array.prototype.slice.call(svg.querySelectorAll(".swoosh-draw"));
  var curve = function (n) { return draws.filter(function (u) { return u.getAttribute("data-curve") === String(n); }); };
  var korea = svg.querySelector(".korea");
  var replay = document.querySelector(".logo-replay");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Start state: both curves undrawn, KOREA transparent.
  draws.forEach(function (use) {
    var line = svg.querySelector(use.getAttribute("href"));
    var length = line.getTotalLength();
    var lead = parseFloat(use.getAttribute("data-lead")) || 0;
    gsap.set(use, { strokeDasharray: (length + lead) + " " + (2 * length), strokeDashoffset: length });
  });
  gsap.set(korea, { opacity: 0 });
  release();   // GSAP controls the state from here

  var tl = gsap.timeline({ paused: true })
    .to(curve(1), { strokeDashoffset: 0, duration: 1.05, ease: "power1.inOut" }, 0)
    .to(curve(2), { strokeDashoffset: 0, duration: 0.52, ease: "power1.inOut" }, 0.58)
    .to(korea, { opacity: 1, duration: 0.65, ease: "power1.out" }, 0.7);

  if (reduceMotion) {
    tl.progress(1);   // finished logo, no motion; no replay button
    return;
  }

  // Play once when most of the logo is on screen (on phones it can sit below the first screen).
  var io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { io.disconnect(); io = null; tl.restart(); }
    }, { threshold: 0.75 });
    io.observe(svg);
  } else {
    tl.restart();
  }

  // Replay restarts the same timeline from the beginning, however often it is pressed.
  if (replay) {
    replay.hidden = false;
    replay.addEventListener("click", function () {
      if (io) { io.disconnect(); io = null; }
      tl.restart();
    });
  }
})();
