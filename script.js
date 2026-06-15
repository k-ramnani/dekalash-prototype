// ============================================================= //
// Deka Lash Franklin Lakes — Prototype interactions             //
// ============================================================= //

/* ---------- Background images with graceful fallbacks ---------- */
const FALLBACKS = [
  "linear-gradient(135deg, #d6168b, #a8106d)",
  "linear-gradient(135deg, #f06fb8, #d6168b)",
  "linear-gradient(135deg, #2e2a31, #a8106d)",
  "linear-gradient(135deg, #fbe9f4, #f06fb8)",
];
document.querySelectorAll("[data-img]").forEach((el, i) => {
  const url = el.getAttribute("data-img");
  const probe = new Image();
  probe.onload = () => { el.style.backgroundImage = `url("${url}")`; };
  probe.onerror = () => { el.style.backgroundImage = FALLBACKS[i % FALLBACKS.length]; };
  probe.src = url;
  el.style.backgroundImage = `url("${url}"), ${FALLBACKS[i % FALLBACKS.length]}`;
});

/* ---------- Mobile nav ---------- */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
  mainNav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => mainNav.classList.remove("open"))
  );
}

// ============================================================= //
// BOOKING MODAL — multi-step wizard                             //
// Steps: details → service → addons → provider → datetime → login
// (mirrors the Deka Lash Mindbody appointment flow)             //
// ============================================================= //

/* ---------- Data ---------- */
const CATALOG = [
  { cat: "Full Set", items: [
    { name: "Classic | Full Set", dur: 90, price: "119.99", desc: "Get the closest look and feel to natural lashes — one extension applied to one natural lash for a perfected mascara look without the mascara." },
    { name: "Hybrid | Full Set", dur: 120, price: "139.99", desc: "A blend of classic and volume techniques for soft texture and added fullness." },
    { name: "TrueVolume® | Full Set", dur: 120, price: "154.99", desc: "Lightweight, fluffy volume fans for a full, dramatic finish." },
    { name: "MegaVolume | Full Set", dur: 120, price: "164.99", desc: "Maximum density and drama with ultra-fine, hand-made fans." },
    { name: "TrueXpress® | Full Set", dur: 60, price: "99.99", desc: "A fuller, flawless look in less time — perfect for first-timers." },
  ]},
  { cat: "Refill", items: [
    { name: "Classic | Refill", dur: 60, price: "67.50", desc: "Keep your classic set full and flawless — recommended every 2 weeks." },
    { name: "Hybrid | Refill", dur: 60, price: "77.50", desc: "Maintain your hybrid set's texture and fullness." },
    { name: "Volume | Refill", dur: 75, price: "87.50", desc: "Top up your volume fans for continuous drama." },
  ]},
  { cat: "Lash Lift + Tints", items: [
    { name: "Lash Lift", dur: 60, price: "89.99", desc: "Ditch the curler — a stunning, uplifted curl that lasts up to 8 weeks." },
    { name: "Lash Lift + Tint", dur: 75, price: "109.99", desc: "Lifted curl plus a custom tint for definition." },
    { name: "Lash + Brow Tint", dur: 30, price: "29.00", desc: "Enhance your natural lashes and brows with a custom tint." },
  ]},
  { cat: "Brows", items: [
    { name: "Brow Lamination", dur: 45, price: "89.99", desc: "Lifts and sets your brow hairs into a full, fluffy, shaped look." },
    { name: "Brow Lamination + Tint", dur: 60, price: "109.99", desc: "Laminated, defined brows with a custom tint." },
    { name: "Brow Shaping", dur: 30, price: "25.00", desc: "Clean, tailored brow shaping to frame your face." },
  ]},
  { cat: "Bundle + Save", items: [
    { name: "Lash + Brow Bundle", dur: 120, price: "149.99", desc: "Pair lash + brow services and save." },
    { name: "Lash + Facial Bundle", dur: 150, price: "159.99", desc: "Pair a lash service with a personalized facial and save." },
  ]},
  { cat: "Facials", items: [
    { name: "Hydropeptide® Radiant Results Facial", dur: 60, price: "70.00", desc: "Give your skin a boost with a personalized, results-driven facial." },
    { name: "Sonic Dermaplaning Express Facial", dur: 45, price: "75.00", desc: "Gentle exfoliation for instantly smooth, glowing skin." },
    { name: "Hydrafacial®", dur: 60, price: "99.00", desc: "Cleanse, extract, and hydrate for a refreshed complexion." },
  ]},
];

const ADDONS = [
  { name: "Hydrating Eye Mask", price: "8.00", desc: "A cooling, hydrating under-eye treatment." },
  { name: "Polypeptide Collagel Mask", price: "20.00", desc: "Collagen-rich mask to firm and refresh." },
];

const PROVIDERS = [
  { name: "First Available", sub: "Earliest opening with any artist" },
  { name: "Nej", sub: "Lash Artist" },
  { name: "Ailidh", sub: "Lash Artist" },
  { name: "Ines", sub: "Lash Artist" },
];

const STEPS = ["details", "service", "addons", "provider", "datetime", "confirm"];
const STEP_TITLES = {
  details: "Book an Appointment",
  service: "Book at Deka Lash Franklin Lakes",
  addons: "Customize your service",
  provider: "Select your provider",
  datetime: "Select Date & Time",
  confirm: "Confirm Booking",
};

/* ---------- Small inline icons ---------- */
const ICON = {
  cal: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  clock: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  edit: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
};

/* ---------- State ---------- */
const state = {
  firstName: "", lastName: "", phone: "", consent: true,
  service: null, addons: [], provider: null, date: null, time: null,
};
let flow = STEPS;        // active step sequence
let mode = "full";       // full | servicePicker | staffPicker | slot
let stepIdx = 0;
let reserveTimer = null;

/* ---------- DOM ---------- */
const overlay = document.getElementById("bookModal");
const elBody = document.getElementById("modalBody");
const elTitle = document.getElementById("modalTitle");
const elBack = document.getElementById("modalBack");
const elClose = document.getElementById("modalClose");
const elFoot = document.getElementById("modalFoot");

/* ---------- Open / close ---------- */
function showOverlay() {
  document.body.style.overflow = "hidden";
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
}
function openModal() {            // full booking journey (header / hero / "Book" CTAs)
  mode = "full"; flow = STEPS; stepIdx = 0; openCat = -1; weekOffset = 0;
  showOverlay(); render();
}
function closeModal() {
  clearInterval(reserveTimer);
  document.body.style.overflow = "";
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
}
function goTo(name) { const i = flow.indexOf(name); if (i >= 0) { stepIdx = i; render(); } }
function next() { if (stepIdx < flow.length - 1) { stepIdx++; render(); } }
function back() { if (stepIdx > 0) { stepIdx--; render(); } }

// Wire every "Book" CTA (links to #booking) to open the modal
document.querySelectorAll('a[href="#booking"]').forEach((a) =>
  a.addEventListener("click", (e) => { e.preventDefault(); openModal(); })
);
elClose.addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && overlay.classList.contains("show")) closeModal(); });

/* ---------- Render ---------- */
function render() {
  clearInterval(reserveTimer);
  const step = flow[stepIdx];
  elTitle.textContent = stepTitle(step);
  // Constant header: back always visible — closes on first step, otherwise goes back
  elBack.style.visibility = "visible";
  elBack.onclick = stepIdx === 0 ? closeModal : back;
  elFoot.innerHTML = "";
  ({ details: renderDetails, service: renderService, addons: renderAddons,
     provider: renderProvider, datetime: renderDatetime, confirm: renderConfirm })[step]();
  elFoot.style.display = elFoot.innerHTML.trim() ? "block" : "none";
  elBody.scrollTop = 0;
}
function stepTitle(step) {
  if (mode === "servicePicker") return step === "addons" ? "Add to Your Service" : "Select a Service";
  if (mode === "staffPicker") return "Select Your Provider";
  return STEP_TITLES[step];
}

/* ---------- Step 1: Details (name + number) ---------- */
function renderDetails() {
  elBody.innerHTML = `
    <form class="bk-form" id="detailsForm">
      <div class="bk-row">
        <input class="bk-input" id="fn" placeholder="First name *" value="${state.firstName}" required />
        <input class="bk-input" id="ln" placeholder="Last name" value="${state.lastName}" />
      </div>
      <div class="bk-phone">
        <span class="bk-cc">🇺🇸 +1</span>
        <input class="bk-input bk-phone-input" id="ph" type="tel" placeholder="Phone number *" value="${state.phone}" required />
      </div>
      <label class="bk-consent">
        <input type="checkbox" id="cs" ${state.consent ? "checked" : ""} />
        <span>By checking this box, you agree to receive appointment-related text messages at this number.</span>
      </label>
    </form>`;
  elFoot.innerHTML = `
    <button type="submit" form="detailsForm" class="bk-cta">Book Now</button>
    <p class="bk-secure">🔒 Your data is secure with us</p>`;
  const form = document.getElementById("detailsForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    state.firstName = document.getElementById("fn").value.trim();
    state.phone = document.getElementById("ph").value.trim();
    state.lastName = document.getElementById("ln").value.trim();
    state.consent = document.getElementById("cs").checked;
    if (!state.firstName || !state.phone) return;
    next();
  });
}

/* ---------- Step 2: Service (accordion, collapsed by default) ---------- */
let openCat = -1;
function renderService() {
  elBody.innerHTML = `<div class="bk-accordion">${CATALOG.map((c, ci) => `
    <div class="bk-cat ${ci === openCat ? "open" : ""}" data-ci="${ci}">
      <button class="bk-cat-head" type="button">
        <span>${ci + 1}. ${c.cat}</span>
        <span class="bk-cat-toggle">${ci === openCat ? "Collapse ▴" : "Expand ▾"}</span>
      </button>
      <div class="bk-cat-body">
        ${c.items.map((s, si) => `
          <div class="bk-service" data-ci="${ci}" data-si="${si}">
            <div class="bk-service-info">
              <strong>${s.name}</strong>
              <span class="bk-service-meta">${s.dur} min · Starting at $${s.price}</span>
              <p class="bk-service-desc">${s.desc}</p>
            </div>
            <button class="bk-select" type="button">Select</button>
          </div>`).join("")}
      </div>
    </div>`).join("")}</div>`;

  elBody.querySelectorAll(".bk-cat-head").forEach((h) =>
    h.addEventListener("click", () => {
      const ci = +h.parentElement.dataset.ci;
      openCat = openCat === ci ? -1 : ci;
      renderService();
    })
  );
  elBody.querySelectorAll(".bk-service").forEach((row) =>
    row.querySelector(".bk-select").addEventListener("click", () => {
      const c = CATALOG[+row.dataset.ci];
      state.service = { ...c.items[+row.dataset.si], cat: c.cat };
      state.addons = [];
      next();
    })
  );
}

/* ---------- Step 3: Add-ons ---------- */
function renderAddons() {
  elBody.innerHTML = `
    <div class="bk-svc-chip">${state.service.name} · ${state.service.dur} min · Starting at $${state.service.price}</div>
    <p class="bk-sub">Select one or more popular add-ons</p>
    <div class="bk-addons">
      ${ADDONS.map((a, i) => `
        <label class="bk-addon">
          <input type="checkbox" data-i="${i}" ${state.addons.includes(i) ? "checked" : ""} />
          <span class="bk-addon-info">
            <strong>${a.name}</strong>
            <em>Starting at $${a.price}</em>
            <span class="bk-service-desc">${a.desc}</span>
          </span>
        </label>`).join("")}
    </div>`;
  const aLabel = mode === "servicePicker" ? "Done" : "Continue";
  elFoot.innerHTML = `<button class="bk-cta" id="addonsContinue">${aLabel}</button>`;
  elBody.querySelectorAll(".bk-addon input").forEach((cb) =>
    cb.addEventListener("change", () => {
      const i = +cb.dataset.i;
      if (cb.checked) state.addons.push(i);
      else state.addons = state.addons.filter((x) => x !== i);
    })
  );
  document.getElementById("addonsContinue")
    .addEventListener("click", mode === "servicePicker" ? commitServicePicker : next);
}

/* ---------- Step 4: Provider ---------- */
function renderProvider() {
  elBody.innerHTML = `
    <div class="bk-svc-summary">
      <h3>${state.service.name}</h3>
      <span class="bk-service-meta">${state.service.dur} min · Starting at $${state.service.price}</span>
      <p class="bk-service-desc">${state.service.desc}</p>
    </div>
    <p class="bk-sub">Select your provider</p>
    <div class="bk-providers">
      ${PROVIDERS.map((p, i) => `
        <label class="bk-provider ${state.provider === p.name ? "sel" : ""}" data-i="${i}">
          <input type="radio" name="prov" ${state.provider === p.name ? "checked" : ""} />
          <span><strong>${p.name}</strong><em>${p.sub}</em></span>
        </label>`).join("")}
    </div>`;
  const pLabel = mode === "staffPicker" ? "Done" : "Continue";
  elFoot.innerHTML = `<button class="bk-cta" id="provContinue" ${state.provider ? "" : "disabled"}>${pLabel}</button>`;
  elBody.querySelectorAll(".bk-provider").forEach((row) =>
    row.addEventListener("click", () => {
      state.provider = PROVIDERS[+row.dataset.i].name;
      renderProvider();
    })
  );
  const btn = document.getElementById("provContinue");
  if (state.provider) btn.addEventListener("click", mode === "staffPicker" ? commitStaffPicker : next);
}

/* ---------- Step 5: Date & Time ---------- */
const SLOTS = {
  Morning: ["9:00 AM", "10:30 AM"],
  Afternoon: ["12:30 PM", "2:00 PM", "3:30 PM"],
  Evening: ["6:00 PM"],
};
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
let weekOffset = 0;

function dayList() {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  base.setDate(base.getDate() + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d;
  });
}
function fmtLong(d) { return `${DOW[d.getDay()]}, ${MONTHS[d.getMonth()].slice(0,3)} ${d.getDate()}, ${d.getFullYear()}`; }

function renderDatetime() {
  const days = dayList();
  if (!state.date) state.date = days[0].toISOString();
  const sel = new Date(state.date);
  const selKey = sel.toDateString();
  elBody.innerHTML = `
    <div class="bk-cal">
      <div class="bk-cal-month">
        <strong>${MONTHS[days[0].getMonth()]}</strong>
        <div class="bk-cal-nav">
          <button id="wkPrev" ${weekOffset === 0 ? "disabled" : ""}>‹</button>
          <button id="wkNext">›</button>
        </div>
      </div>
      <div class="bk-days">
        ${days.map((d) => `
          <button class="bk-day ${d.toDateString() === selKey ? "sel" : ""}" data-iso="${d.toISOString()}">
            <span>${DOW[d.getDay()]}</span><b>${d.getDate()}</b>
          </button>`).join("")}
      </div>
      <p class="bk-sub">Availability for ${fmtLong(sel)}</p>
      <p class="bk-tz">All times shown in the location's timezone.</p>
      <div class="bk-slots">
        ${Object.entries(SLOTS).map(([part, times]) => `
          <div class="bk-slot-group">
            <h4>${part}</h4>
            <div class="bk-slot-row">
              ${times.map((t) => `<button class="bk-slot ${state.time === t ? "sel" : ""}" data-t="${t}">${t}</button>`).join("")}
            </div>
          </div>`).join("")}
      </div>
    </div>
    <div class="bk-appt">
      <h4>Appointment Details</h4>
      <strong>${state.service.name}</strong>
      <span>${fmtLong(sel)}${state.time ? " at " + state.time : ""}</span>
      <span>${state.provider}</span>
      <span>${state.service.dur} min · Starting at $${state.service.price}</span>
      ${state.addons.length ? `<span class="bk-appt-add">+ ${state.addons.map(i => ADDONS[i].name).join(", ")}</span>` : ""}
    </div>`;
  elFoot.innerHTML = `<button class="bk-cta" id="addCart" ${state.time ? "" : "disabled"}>Continue</button>`;

  const prev = document.getElementById("wkPrev");
  const nxt = document.getElementById("wkNext");
  if (prev) prev.addEventListener("click", () => { if (weekOffset > 0) { weekOffset--; renderDatetime(); } });
  nxt.addEventListener("click", () => { weekOffset++; state.date = dayList()[0].toISOString(); state.time = null; renderDatetime(); });
  elBody.querySelectorAll(".bk-day").forEach((b) =>
    b.addEventListener("click", () => { state.date = b.dataset.iso; state.time = null; renderDatetime(); })
  );
  elBody.querySelectorAll(".bk-slot").forEach((b) =>
    b.addEventListener("click", () => { state.time = b.dataset.t; renderDatetime(); })
  );
  const cart = document.getElementById("addCart");
  if (state.time) cart.addEventListener("click", next);
}

/* ---------- Helpers for confirm/success ---------- */
const WEEKDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
function fmtFriendly(d) { return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`; }
function fmtClock(d) { let h = d.getHours(); const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return `${h}:${String(d.getMinutes()).padStart(2, "0")} ${ap}`; }
function timeRange(timeStr, mins) {
  const m = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  let h = (+m[1]) % 12; if (/PM/i.test(m[3])) h += 12;
  const start = new Date(2000, 0, 1, h, +m[2]);
  const end = new Date(start.getTime() + mins * 60000);
  return `${fmtClock(start)}–${fmtClock(end)}`;
}
function bookingTotal() {
  return [parseFloat(state.service.price), ...state.addons.map((i) => parseFloat(ADDONS[i].price))]
    .reduce((a, b) => a + b, 0);
}

/* ---------- Step 6: Confirm Booking ---------- */
function renderConfirm() {
  const sel = new Date(state.date);
  const total = bookingTotal();
  const fullName = `${state.firstName}${state.lastName ? " " + state.lastName : ""}`;
  const addonNames = state.addons.map((i) => ADDONS[i].name);
  elBody.innerHTML = `
    <div class="bk-confirm">
      <div class="bk-biz">
        <div class="bk-biz-avatar">D</div>
        <div class="bk-biz-info">
          <strong>Deka Lash Franklin Lakes</strong>
          <span>794 Franklin Ave, Franklin Lakes, NJ 07417</span>
        </div>
      </div>
      <div class="bk-divider"></div>
      <div class="bk-confirm-row">
        <span class="bk-label">Your Details</span>
        <button class="bk-edit" id="editDetails" title="Edit your details">${ICON.edit}</button>
      </div>
      <div class="bk-you">
        <strong>${fullName}</strong>
        <span class="bk-you-phone">+1 ${state.phone}</span>
      </div>
      <div class="bk-divider"></div>
      <div class="bk-when">
        <div><span class="bk-ico">${ICON.cal}</span> ${fmtFriendly(sel)}</div>
        <div><span class="bk-ico">${ICON.clock}</span> ${timeRange(state.time, state.service.dur)} (${state.service.dur} min duration)</div>
      </div>
      <div class="bk-reserve">
        <span>Slot reserved for:</span>
        <span class="bk-reserve-pill" id="resTimer">${ICON.clock} <b>10:00</b></span>
      </div>
      <div class="bk-divider"></div>
      <div class="bk-confirm-svc">
        <div class="bk-confirm-svc-info">
          <strong>${state.service.name}</strong>
          <span>${state.service.dur} min with <a>${state.provider}</a></span>
          ${addonNames.length ? `<span class="bk-confirm-add">+ ${addonNames.join(", ")}</span>` : ""}
        </div>
        <span class="bk-confirm-price">$${total.toFixed(2)}</span>
      </div>
      <div class="bk-divider"></div>
      <div class="bk-pay">
        <div class="bk-pay-row"><span class="bk-pay-now">Pay Now</span><span class="bk-pay-now">$0</span></div>
        <div class="bk-pay-row"><span>Pay at Venue</span><span>$${total.toFixed(2)}</span></div>
      </div>
    </div>`;
  elFoot.innerHTML = `<button class="bk-cta" id="confirmBtn">Confirm Booking</button>`;

  document.getElementById("editDetails").addEventListener("click", () => goTo("details"));
  document.getElementById("confirmBtn").addEventListener("click", renderSuccess);
  startReserveTimer();
}

function startReserveTimer() {
  clearInterval(reserveTimer);
  let secs = 600;
  const tick = () => {
    const el = document.getElementById("resTimer");
    if (!el || !el.isConnected) { clearInterval(reserveTimer); return; }
    const m = Math.floor(secs / 60), s = secs % 60;
    el.querySelector("b").textContent = `${m}:${String(s).padStart(2, "0")}`;
    if (secs <= 0) { clearInterval(reserveTimer); return; }
    secs--;
  };
  tick();
  reserveTimer = setInterval(tick, 1000);
}

/* ---------- Success state (terminal) ---------- */
function renderSuccess() {
  clearInterval(reserveTimer);
  const sel = new Date(state.date);
  const total = bookingTotal();
  elTitle.textContent = "Booking Confirmed";
  elBack.style.visibility = "hidden";
  elBack.onclick = null;
  elBody.innerHTML = `
    <div class="bk-success">
      <div class="bk-check">${ICON.check}</div>
      <h3>You're booked, ${state.firstName}!</h3>
      <p class="bk-success-sub">We can't wait to see you at Deka Lash Franklin Lakes.</p>
      <div class="bk-success-card">
        <div class="bk-success-row"><span>Service</span><strong>${state.service.name}</strong></div>
        <div class="bk-success-row"><span>When</span><strong>${fmtFriendly(sel)} · ${timeRange(state.time, state.service.dur)}</strong></div>
        <div class="bk-success-row"><span>With</span><strong>${state.provider}</strong></div>
        <div class="bk-success-row"><span>Where</span><strong>794 Franklin Ave, Franklin Lakes, NJ</strong></div>
        <div class="bk-success-row"><span>Pay at venue</span><strong>$${total.toFixed(2)}</strong></div>
      </div>
      <form id="emailForm" class="bk-email-form">
        <label class="bk-sub" for="confEmail">Where should we send your confirmation?</label>
        <input class="bk-input" id="confEmail" type="email" placeholder="you@email.com" required />
      </form>
    </div>`;
  elFoot.innerHTML = `<button type="submit" form="emailForm" class="bk-cta">Email me the details</button>`;
  elFoot.style.display = "block";
  document.getElementById("emailForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("confEmail").value.trim();
    if (!email) return;
    document.querySelector(".bk-email-form").innerHTML =
      `<div class="bk-email-sent">✓ Confirmation &amp; reminders sent to <strong>${email}</strong></div>`;
    elFoot.innerHTML = `<button type="button" class="bk-cta" id="doneBtn">Done</button>`;
    document.getElementById("doneBtn").addEventListener("click", closeModal);
  });
}

// ============================================================= //
// INLINE BOOKING SECTION                                        //
// Slot page inline with Service + Staff filter chips.           //
// Chip -> opens modal at that step (picker mode).               //
// Slot picked -> modal opens at details -> confirm -> success.  //
// ============================================================= //
function findService(name) {
  for (const c of CATALOG) {
    const it = c.items.find((i) => i.name === name);
    if (it) return { ...it, cat: c.cat };
  }
  return null;
}

const inline = {
  service: findService("Lash Lift"),   // preselected default
  addons: [],
  provider: "First Available",          // fastest / first available default
  date: null,
  time: null,
};
let inlineWeek = 0;
const inlineEl = document.getElementById("inlineSlots");

function inlineDays() {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  base.setDate(base.getDate() + inlineWeek * 7);
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(base); d.setDate(base.getDate() + i); return d; });
}

function renderInline() {
  if (!inlineEl) return;
  const days = inlineDays();
  let sel = inline.date ? new Date(inline.date) : days[0];
  if (!days.some((d) => d.toDateString() === sel.toDateString())) { sel = days[0]; }
  inline.date = sel.toISOString();
  const selKey = sel.toDateString();
  const addCount = inline.addons.length;
  inlineEl.innerHTML = `
    <div class="il-filters">
      <button class="il-chip" id="ilService" type="button">
        <span class="il-chip-k">Service</span>
        <span class="il-chip-v">${inline.service.name}${addCount ? ` <em>+${addCount} add-on${addCount > 1 ? "s" : ""}</em>` : ""}</span>
        <span class="il-chip-edit">Change ›</span>
      </button>
      <button class="il-chip" id="ilStaff" type="button">
        <span class="il-chip-k">Staff</span>
        <span class="il-chip-v">${inline.provider}</span>
        <span class="il-chip-edit">Change ›</span>
      </button>
    </div>
    <div class="il-cal">
      <div class="il-cal-top">
        <strong>${MONTHS[days[0].getMonth()]} ${days[0].getFullYear()}</strong>
        <div class="il-nav">
          <button id="ilPrev" type="button" ${inlineWeek === 0 ? "disabled" : ""}>‹</button>
          <button id="ilNext" type="button">›</button>
        </div>
      </div>
      <div class="il-days">
        ${days.map((d) => `
          <button class="il-day ${d.toDateString() === selKey ? "sel" : ""}" type="button" data-iso="${d.toISOString()}">
            <span>${DOW[d.getDay()]}</span><b>${d.getDate()}</b>
          </button>`).join("")}
      </div>
      <p class="il-availfor">Availability for ${WEEKDAYS[sel.getDay()]}, ${sel.getDate()} ${MONTHS[sel.getMonth()]}</p>
      <div class="il-slots">
        ${Object.entries(SLOTS).map(([part, times]) => `
          <div class="il-slot-group">
            <h4>${part}</h4>
            <div class="il-slot-row">
              ${times.map((t) => `<button class="il-slot" type="button" data-t="${t}">${t}</button>`).join("")}
            </div>
          </div>`).join("")}
      </div>
    </div>`;

  document.getElementById("ilService").addEventListener("click", openServicePicker);
  document.getElementById("ilStaff").addEventListener("click", openStaffPicker);
  const prev = document.getElementById("ilPrev"), nxt = document.getElementById("ilNext");
  if (prev) prev.addEventListener("click", () => { if (inlineWeek > 0) { inlineWeek--; inline.date = null; renderInline(); } });
  nxt.addEventListener("click", () => { inlineWeek++; inline.date = null; renderInline(); });
  inlineEl.querySelectorAll(".il-day").forEach((b) =>
    b.addEventListener("click", () => { inline.date = b.dataset.iso; renderInline(); }));
  inlineEl.querySelectorAll(".il-slot").forEach((b) =>
    b.addEventListener("click", () => { inline.time = b.dataset.t; openSlotBooking(); }));
}

/* ----- Service / Staff pickers: open modal at one step, commit back to inline ----- */
function openServicePicker() {
  mode = "servicePicker"; flow = ["service", "addons"]; stepIdx = 0;
  state.service = inline.service; state.addons = [...inline.addons];
  openCat = CATALOG.findIndex((c) => c.cat === inline.service.cat);
  showOverlay(); render();
}
function openStaffPicker() {
  mode = "staffPicker"; flow = ["provider"]; stepIdx = 0;
  state.provider = inline.provider;
  showOverlay(); render();
}
function commitServicePicker() {
  inline.service = state.service; inline.addons = [...state.addons];
  closeModal(); renderInline();
}
function commitStaffPicker() {
  inline.provider = state.provider;
  closeModal(); renderInline();
}

/* ----- Slot picked inline -> name & number -> confirm ----- */
function openSlotBooking() {
  state.service = inline.service; state.addons = [...inline.addons];
  state.provider = inline.provider; state.date = inline.date; state.time = inline.time;
  mode = "slot"; flow = ["details", "confirm"]; stepIdx = 0;
  showOverlay(); render();
}

renderInline();
