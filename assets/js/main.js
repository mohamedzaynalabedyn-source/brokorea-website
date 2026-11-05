/* BRO KOREA — small site script: mobile menu, floating WhatsApp button, footer year, quote form. */
(function () {
  "use strict";

  // ------------------------------------------------------------ mobile menu
  // Opens and closes with the button; Escape, a click outside or choosing a link closes it.
  var btn = document.querySelector(".menu-btn");
  var nav = document.getElementById("site-nav");
  if (btn && nav) {
    var btnLabel = btn.querySelector(".sr-only");
    var setMenu = function (open, returnFocus) {
      nav.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (btnLabel) btnLabel.textContent = open ? btn.dataset.labelClose : btn.dataset.labelOpen;
      if (!open && returnFocus) btn.focus();
      // the links come before the button in the page, so move focus into the menu when it opens
      if (open) { var first = nav.querySelector("a"); if (first) first.focus(); }
    };
    var isOpen = function () { return btn.getAttribute("aria-expanded") === "true"; };
    btn.addEventListener("click", function () { setMenu(!isOpen(), false); });
    document.addEventListener("keydown", function (e) {
      if ((e.key === "Escape" || e.key === "Esc") && isOpen()) {
        e.preventDefault();
        setMenu(false, true);
      }
    });
    document.addEventListener("click", function (e) {
      if (isOpen() && !nav.contains(e.target) && !btn.contains(e.target)) setMenu(false, false);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && isOpen()) setMenu(false, false);
    });
  }

  // ------------------------------------------------------------ floating WhatsApp button
  // Never covers a form field: hidden while any field has focus (the quote page doesn't render it).
  // On the homepage it waits until the introduction's own WhatsApp button has scrolled away.
  var fab = document.querySelector(".wa-float");
  if (fab) {
    var fieldFocused = false, heroVisible = false;
    var updateFab = function () { fab.classList.toggle("is-hidden", fieldFocused || heroVisible); };
    document.addEventListener("focusin", function (e) {
      fieldFocused = !!(e.target.closest && e.target.closest("input, textarea, select"));
      updateFab();
    });
    document.addEventListener("focusout", function () { fieldFocused = false; updateFab(); });
    var heroWa = document.getElementById("hero-wa");
    if (heroWa && "IntersectionObserver" in window) {
      heroVisible = true;
      updateFab();
      new IntersectionObserver(function (entries) {
        heroVisible = entries[0].isIntersecting;
        updateFab();
      }).observe(heroWa);
    }
  }

  // ------------------------------------------------------------ footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ------------------------------------------------------------ quote form
  var form = document.getElementById("quote-form");
  if (!form) return;

  var WA_NUMBER = "821039491286";
  var EMAIL = "info@brokorea.com";
  var params = new URLSearchParams(location.search);
  var typeSel = document.getElementById("f-type");
  var pathRadios = form.querySelectorAll('input[name="Part numbers"]');
  var pathGroup = document.getElementById("f-path");
  var catField = document.getElementById("f-cat-field");
  var listField = document.getElementById("f-list-field");
  var listLabel = document.getElementById("f-list-label");
  var listHelp = document.getElementById("f-list-help");
  var photos = document.getElementById("f-photos");
  var vehOpt = document.getElementById("f-vehicle-opt");
  var vehReq = document.getElementById("f-vehicle-req");
  var vehHint = document.getElementById("f-vehicle-hint");
  var modes = {};
  try { modes = JSON.parse(listField.dataset.modes); } catch (err) { modes = {}; }

  // Pre-fill from links: quote.html?type=vehicle|parts|support, ?category=brakes, ?make=Kia,
  // ?help=identify (no part numbers yet)
  var type = params.get("type");
  if (type) {
    var typeOpt = typeSel.querySelector('option[data-slug="' + type.replace(/[^a-z-]/g, "") + '"]');
    if (typeOpt) typeOpt.selected = true;
  }
  var cat = params.get("category");
  if (cat) {
    var opt = form.querySelector('#f-category option[data-slug="' + cat.replace(/[^a-z-]/g, "") + '"]');
    if (opt) opt.selected = true;
  }
  var make = params.get("make");
  if (make) form.elements["Car make"].value = make.slice(0, 60);
  if (params.get("help") === "identify") {
    var idRadio = form.querySelector('input[data-path="identify"]');
    if (idRadio) idRadio.checked = true;
  }

  function val(name) {
    var el = form.elements[name];
    return el && el.value ? el.value.trim() : "";
  }
  function typeSlug() {
    var o = typeSel.options[typeSel.selectedIndex];
    return o ? o.dataset.slug : "parts";
  }
  function checkedPath() {
    for (var i = 0; i < pathRadios.length; i++) if (pathRadios[i].checked) return pathRadios[i];
    return null;
  }
  // parts | identify | vehicle | support
  function mode() {
    var slug = typeSlug();
    if (slug !== "parts") return slug;
    var r = checkedPath();
    return r && r.dataset.path === "identify" ? "identify" : "parts";
  }

  // Show only what the chosen request needs; labels follow the page language.
  function applyMode() {
    var m = mode();
    var isParts = typeSlug() === "parts";
    pathGroup.hidden = !isParts;
    pathRadios.forEach(function (r) { r.disabled = !isParts; });   // not submitted for vehicles/support
    catField.hidden = !isParts;
    form.elements["Category"].disabled = !isParts;
    if (modes[m]) {
      listLabel.textContent = modes[m][0];
      listHelp.textContent = modes[m][1];
      if (modes[m][2]) form.elements["Parts list"].placeholder = modes[m][2];
    }
    var identify = m === "identify";
    photos.hidden = !identify;
    vehOpt.hidden = identify;
    vehReq.hidden = !identify;
    vehHint.hidden = !identify;
    if (!identify) clearError("vehicle");
  }
  typeSel.addEventListener("change", applyMode);
  pathRadios.forEach(function (r) { r.addEventListener("change", applyMode); });

  // ---- validation (messages come from the page, so an Arabic page never shows browser English)
  var msgs = {
    required: form.dataset.errRequired, reach: form.dataset.errReach,
    email: form.dataset.errEmail, vehicle: form.dataset.errVehicle
  };
  var groupErrors = { reach: document.getElementById("f-reach-error"), vehicle: document.getElementById("f-vehicle-error") };
  var groupFields = { reach: ["WhatsApp", "email"], vehicle: ["Car make", "Model", "Year", "VIN / chassis"] };

  function errId(name) { return "err-" + name.replace(/[^a-z0-9]+/gi, "-").toLowerCase(); }
  function inActiveGroup(name) {
    return Object.keys(groupFields).some(function (g) { return !groupErrors[g].hidden && groupFields[g].indexOf(name) > -1; });
  }
  function fieldError(el) {
    var id = errId(el.name);
    var box = document.getElementById(id);
    if (!box) {
      box = document.createElement("span");
      box.className = "field-error";
      box.id = id;
      box.hidden = true;
      el.insertAdjacentElement("afterend", box);
    }
    return box;
  }
  function describe(el, id, on) {
    var ids = (el.getAttribute("aria-describedby") || "").split(" ").filter(function (x) { return x && x !== id; });
    if (on) ids.push(id);
    if (ids.length) el.setAttribute("aria-describedby", ids.join(" "));
    else el.removeAttribute("aria-describedby");
  }
  function setFieldError(el, msg) {
    var box = fieldError(el);
    box.textContent = msg || "";
    box.hidden = !msg;
    describe(el, box.id, !!msg);
    if (msg) el.setAttribute("aria-invalid", "true");
    else if (!inActiveGroup(el.name)) el.removeAttribute("aria-invalid");
  }
  function setGroupError(group, msg) {
    var box = groupErrors[group];
    box.textContent = msg || "";
    box.hidden = !msg;
    groupFields[group].forEach(function (name) {
      var el = form.elements[name];
      describe(el, box.id, !!msg);
      if (msg) el.setAttribute("aria-invalid", "true");
      else if (!(name === "email" && emailBad())) el.removeAttribute("aria-invalid");
    });
  }
  function clearError(group) { setGroupError(group, ""); }
  function emailBad() {
    var v = val("email");
    return v !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  // Returns the first control with a problem, after marking every problem on the page.
  function validate() {
    var first = null;
    var mark = function (el) { if (!first) first = el; };
    ["Parts list", "name", "Country"].forEach(function (name) {
      var el = form.elements[name];
      var bad = val(name) === "";
      setFieldError(el, bad ? msgs.required : "");
      if (bad) mark(el);
    });
    if (mode() === "identify") {
      var hasVin = val("VIN / chassis") !== "";
      var hasCar = val("Car make") && val("Model") && val("Year");
      if (!hasVin && !hasCar) {
        setGroupError("vehicle", msgs.vehicle);
        mark(form.elements[val("Car make") ? (val("Model") ? "Year" : "Model") : "Car make"]);
      } else clearError("vehicle");
    }
    if (val("WhatsApp") === "" && val("email") === "") {
      setGroupError("reach", msgs.reach);
      mark(form.elements.WhatsApp);
    } else clearError("reach");
    var email = form.elements.email;
    setFieldError(email, emailBad() ? msgs.email : "");
    if (emailBad()) mark(email);
    return first;
  }

  // Clear a field's message as soon as it is fixed.
  form.addEventListener("input", function (e) {
    var name = e.target.name;
    if (!name) return;
    if (!groupErrors.reach.hidden && (val("WhatsApp") || val("email"))) clearError("reach");
    if (!groupErrors.vehicle.hidden && (val("VIN / chassis") || (val("Car make") && val("Model") && val("Year")))) clearError("vehicle");
    var box = document.getElementById(errId(name));
    if (box && !box.hidden && (name === "email" ? !emailBad() : val(name) !== "")) setFieldError(e.target, "");
  });

  applyMode();   // after the error helpers above exist

  // ---- WhatsApp message in the page's language
  var waBtn = document.getElementById("wa-send");
  function summary(intro) {
    var L = {};
    try { L = JSON.parse(waBtn.dataset.labels); } catch (err) { L = {}; }
    var lines = [intro, ""];
    var add = function (label, v) { if (v) lines.push((label || "") + ": " + v); };
    var m = mode();
    var text = function (sel) { var o = sel && sel.options[sel.selectedIndex]; return o ? o.textContent.trim() : ""; };
    add(L.request, text(typeSel));
    if (typeSlug() === "parts") {
      var r = checkedPath();
      if (r) add(L.path, r.parentNode.textContent.trim());
    }
    add(L.name, val("name"));
    add(L.company, val("Company"));
    add(L.country, val("Country"));
    add(L.destination, val("Destination"));
    add(L.email, val("email"));
    if (typeSlug() === "parts") add(L.category, text(form.elements["Category"]));
    add(L.vehicle, [val("Car make"), val("Model"), val("Year")].filter(Boolean).join(" "));
    add(L.vin, val("VIN / chassis"));
    var list = val("Parts list");
    if (list) lines.push("", ((m === "parts" || m === "identify") ? L.parts : L.details) + ":", list);
    var notes = val("Notes");
    if (notes) lines.push("", L.notes + ": " + notes);
    return lines.join("\n");
  }
  if (waBtn) {
    waBtn.addEventListener("click", function () {
      waBtn.href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(summary(waBtn.dataset.intro));
    });
  }

  // "Email my file / photos" — adds the buyer's name/company to the subject line
  var mailBtn = document.getElementById("mail-list");
  if (mailBtn) {
    mailBtn.addEventListener("click", function () {
      var who = val("Company") || val("name");
      var subject = mailBtn.dataset.subject + (who ? " – " + who : "");
      mailBtn.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(mailBtn.dataset.body);
    });
  }

  // ---- Quote form → Web3Forms (access key lives in assets/js/form-config.js)
  var status = form.querySelector(".form-status");
  var submit = form.querySelector('button[type="submit"]');
  var SUBJECT_KIND = { parts: "part numbers", identify: "identify parts", vehicle: "vehicle", support: "export support" };

  function show(msg, ok) {
    status.hidden = false;
    status.textContent = msg;
    status.classList.toggle("ok", !!ok);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = validate();
    if (bad) {
      status.hidden = true;
      bad.focus();
      return;
    }
    var key = (window.BROKOREA_FORM && window.BROKOREA_FORM.web3formsAccessKey) || "";
    if (!key || key.indexOf("PASTE") === 0) {
      show(form.dataset.msgConfig);
      return;
    }
    if (form.elements.botcheck.checked) return;

    form.elements.access_key.value = key;
    var who = val("Company") || val("name");
    form.elements.subject.value = "Quote request – " + SUBJECT_KIND[mode()] + " – " + who +
      (val("Country") ? " (" + val("Country") + ")" : "");

    var data = {};
    new FormData(form).forEach(function (v, k) { if (k !== "botcheck" && k !== "redirect") data[k] = v; });
    if (!data.email) delete data.email;       // email is optional when WhatsApp is given
    if (!data.WhatsApp) delete data.WhatsApp; // and the other way round

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
