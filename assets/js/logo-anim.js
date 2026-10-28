/* BRO KOREA — animated logo in the homepage hero (needs vendor/gsap.min.js).
 *
 * Total ≈ 1.8 s
 *   0.00 – 0.60  The gust: the two red lines sweep in from the reading side of the
 *                page (left on English pages, right on Arabic pages), ease power3.out,
 *                and settle around "Bro".
 *   0.60 – 1.80  The trace: the single-stroke .korea-stroke animates its
 *                stroke-dashoffset to 0 (ease power2.inOut). It is the stroke of a
 *                mask, so it writes out the official KOREA lettering, while a thin
 *                red streak (.wind-trail) rides the writing front and fades out.
 *
 * Each red line starts one full width off to the entry side (x = ∓ its own width,
 * the same as xPercent ∓100). The logo itself is never mirrored, and KOREA is
 * always written left to right because it is a Latin wordmark.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var svg = document.querySelector(".logo-anim");
  if (!svg) return;

  // Show the finished logo if the animation can't run.
  function release() { root.classList.remove("logo-anim-pending"); }
  if (!window.gsap) { release(); return; }

  var GUST_END = 0.6, GUST_STAGGER = 0.08, GUST_EASE = "power3.out";
  var TRACE_START = 0.6, TRACE_TIME = 1.2, TRACE_EASE = "power2.inOut";
  var TRAIL_LENGTH = 150;   // SVG units of red streak behind the writing front

  var winds = Array.prototype.slice.call(svg.querySelectorAll(".wind"));
  var koreaStroke = svg.querySelector(".korea-stroke");
  var trail = svg.querySelector(".wind-trail");
  var replay = document.querySelector(".logo-replay");
  var traceLength = koreaStroke.getTotalLength();
  var dirSign = getComputedStyle(root).direction === "rtl" ? 1 : -1;   // +1 RTL, -1 LTR
  var ordered = dirSign < 0 ? winds : winds.slice().reverse();          // nearest line leads

  // Initial state: "Bro" and the flag O visible, KOREA hidden, red lines off to the side.
  gsap.set(koreaStroke, { strokeDasharray: traceLength + " " + traceLength, strokeDashoffset: traceLength });
  gsap.set(trail, { strokeDasharray: TRAIL_LENGTH + " " + (traceLength + TRAIL_LENGTH), strokeDashoffset: TRAIL_LENGTH, opacity: 0 });
  winds.forEach(function (w) {
    gsap.set(w, { x: dirSign * w.getBBox().width, skewX: dirSign * -14, transformOrigin: "50% 50%", opacity: 0 });
  });
  release();   // GSAP controls the state from here

  var tl = gsap.timeline({ paused: true });

  // The gust (0 → 0.6 s)
  tl.to(ordered, {
      x: 0, skewX: 0,
      duration: GUST_END - GUST_STAGGER * (ordered.length - 1),
      ease: GUST_EASE,
      stagger: GUST_STAGGER
    }, 0)
    .to(ordered, { opacity: 1, duration: 0.22, ease: "none", stagger: GUST_STAGGER }, 0);

  // The trace (0.6 → 1.8 s). The streak uses the same duration and ease, so it stays
  // locked to the writing front: offset (TRAIL_LENGTH - drawn) shows [drawn - TRAIL_LENGTH, drawn].
  tl.to(koreaStroke, { strokeDashoffset: 0, duration: TRACE_TIME, ease: TRACE_EASE }, TRACE_START)
    .to(trail, { strokeDashoffset: TRAIL_LENGTH - traceLength, duration: TRACE_TIME, ease: TRACE_EASE }, TRACE_START)
    .to(trail, { opacity: 1, duration: 0.12, ease: "none" }, TRACE_START)
    .to(trail, { opacity: 0, duration: 0.3, ease: "power1.in" }, TRACE_START + TRACE_TIME - 0.3);

  // Visitors who ask for reduced motion see the finished logo; the button still replays it.
  // Otherwise play once the logo is on screen (on phones it sits below the first screen).
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    tl.progress(1);
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { io.disconnect(); tl.play(0); }
    }, { threshold: 0.75 });
    io.observe(svg);
  } else {
    tl.play(0);
  }

  if (replay) {
    replay.hidden = false;
    replay.addEventListener("click", function () { tl.play(0); });
  }
})();
