/* BRO KOREA — animated logo in the homepage hero (needs vendor/gsap.min.js).
 *
 * BRO and the flag never move. One timeline, ≈ 1.35 s, then the logo holds still:
 *   0.00 – 1.05  The roofline curve draws along its own path. Its centre-line stroke
 *                (.swoosh-draw inside a mask) moves stroke-dashoffset to 0, revealing the
 *                filled, tapered shape; ease power2.inOut starts gently, runs confidently
 *                through the middle and settles into place.
 *   0.45 – 1.15  The shorter lower curve draws the same way, finishing at the nose.
 *   0.70 – 1.35  KOREA fades in, overlapping the end of the drawing.
 *
 * The filled shapes never change; only their masks are drawn. The motion is the same on
 * English and Arabic pages and the logo is never mirrored.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var svg = document.querySelector(".logo-anim");
  if (!svg) return;

  // Show the finished logo if the animation can't run.
  function release() { root.classList.remove("logo-anim-pending"); }
  if (!window.gsap) { release(); return; }

  var draws = svg.querySelectorAll(".swoosh-draw");   // [roofline mask stroke, lower curve mask stroke]
  var korea = svg.querySelector(".korea");
  var replay = document.querySelector(".logo-replay");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Start state: both curves undrawn, KOREA transparent.
  Array.prototype.forEach.call(draws, function (path) {
    var length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length + " " + length, strokeDashoffset: length });
  });
  gsap.set(korea, { opacity: 0 });
  release();   // GSAP controls the state from here

  var tl = gsap.timeline({ paused: true })
    .to(draws[0], { strokeDashoffset: 0, duration: 1.05, ease: "power2.inOut" }, 0)
    .to(draws[1], { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, 0.45)
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
