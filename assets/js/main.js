/* BRO KOREA — small site script: mobile menu, footer year, quote form. */
(function () {
  "use strict";

  // Mobile menu
  var btn = document.querySelector(".menu-btn");
  var nav = document.getElementById("site-nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  var form = document.getElementById("quote-form");
  if (!form) return;

  var WA_NUMBER = "821039491286";
  var EMAIL = "info@brokorea.com";
  var params = new URLSearchParams(location.search);

  // Pre-fill from links like quote.html?category=brakes or quote.html?make=Kia
  var cat = params.get("category");
  if (cat) {
    var opt = form.querySelector('#f-category option[data-slug="' + cat.replace(/[^a-z-]/g, "") + '"]');
    if (opt) opt.selected = true;
  }
  var make = params.get("make");
  if (make) form.elements["Car make"].value = make.slice(0, 60);

  function val(name) {
    var el = form.elements[name];
    return el ? el.value.trim() : "";
  }

  function summary(intro) {
    var lines = [intro, ""];
    var fields = [["Name", "name"], ["Company", "Company"], ["Country", "Country"],
      ["Category", "Category"], ["Car", null], ["VIN", "VIN / chassis"]];
    fields.forEach(function (f) {
      var v = f[1] ? val(f[1]) : [val("Car make"), val("Model"), val("Year")].filter(Boolean).join(" ");
      if (v) lines.push(f[0] + ": " + v);
    });
    var parts = val("Parts list");
    if (parts) lines.push("", "Parts:", parts);
    var notes = val("Notes");
    if (notes) lines.push("", "Notes: " + notes);
    return lines.join("\n");
  }

  // "Send this list on WhatsApp" — opens WhatsApp with what the buyer typed
  var waBtn = document.getElementById("wa-send");
  if (waBtn) {
    waBtn.addEventListener("click", function () {
      waBtn.href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(summary(waBtn.dataset.intro));
    });
  }

  // "Email my Excel/PDF list" — adds the buyer's name/company to the subject line
  var mailBtn = document.getElementById("mail-list");
  if (mailBtn) {
    mailBtn.addEventListener("click", function () {
      var who = val("Company") || val("name");
      var subject = mailBtn.dataset.subject + (who ? " – " + who : "");
      mailBtn.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(mailBtn.dataset.body);
    });
  }

  // Quote form → Web3Forms (access key lives in assets/js/form-config.js)
  var status = form.querySelector(".form-status");
  var submit = form.querySelector('button[type="submit"]');

  function show(msg, ok) {
    status.hidden = false;
    status.textContent = msg;
    status.classList.toggle("ok", !!ok);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var key = (window.BROKOREA_FORM && window.BROKOREA_FORM.web3formsAccessKey) || "";
    if (!key || key.indexOf("PASTE") === 0) {
      show(form.dataset.msgConfig);
      return;
    }
    if (form.elements.botcheck.checked) return;

    form.elements.access_key.value = key;
    var who = val("Company") || val("name");
    form.elements.subject.value = "Quote request: " + who + (val("Country") ? " (" + val("Country") + ")" : "");

    var data = {};
    new FormData(form).forEach(function (v, k) { if (k !== "botcheck" && k !== "redirect") data[k] = v; });

    submit.disabled = true;
    show(form.dataset.msgSending, true);

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.success) {
          location.href = form.dataset.thanks;
        } else {
          throw new Error((res && res.message) || "error");
        }
      })
      .catch(function () {
        submit.disabled = false;
        show(form.dataset.msgError);
      });
  });
})();
