/* Main page: man / woman → workout / nutrition / report → code → opens that section. */
(function () {
  const S = window.SITE, T = I18N.t, $ = id => document.getElementById(id), html = document.documentElement;
  const KEYS = { w: "am-workouts-v1", r: "am-reports-v1" };
  const PAGE = { w: "workout.html", n: "nutrition/index.html", r: "report.html" };
  const NAME = { w: "secW", n: "secN", r: "secR" };
  const enc = new TextEncoder();
  const hex = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
  const norm = c => String(c || "").toUpperCase().replace(/[^A-Z0-9-]/g, "");
  const sha = async s => hex(await crypto.subtle.digest("SHA-256", enc.encode(s)));

  let st = {};
  try { st = JSON.parse(sessionStorage.getItem("am-hub")) || {}; } catch (e) {}
  try { st.g = st.g || localStorage.getItem("amw-g") || null; } catch (e) {}
  const save = () => { try { sessionStorage.setItem("am-hub", JSON.stringify(st)); if (st.g) localStorage.setItem("amw-g", st.g); } catch (e) {} };

  async function has(sec, code) {
    if (sec === "n") return !!(window.AM_VAULT || {})[await sha("amn-v1:" + code)];
    const id = (await sha(KEYS[sec] + "|id|" + code)).slice(0, 24);
    try { const r = await fetch((sec === "w" ? "workouts/" : "reports/") + id + ".json", { method: "GET", cache: "no-store" }); return r.ok; } catch (e) { return false; }
  }

  const ICON = { m: '<svg width="15" height="15" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"><circle cx="20" cy="28" r="12"/><path d="M29 19 41 7M30 7h11v11"/></svg>',
                 f: '<svg width="15" height="15" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"><circle cx="24" cy="18" r="12"/><path d="M24 30v14M17 38h14"/></svg>' };
  function show(step) { ["st1", "st2", "st3"].forEach(s => $(s).classList.toggle("on", s === step)); }
  function setGender(g) {
    st.g = g; html.dataset.g = g; save();
    document.querySelector('meta[name="theme-color"]').content = g === "f" ? "#fff6f8" : "#0a0907";
    document.querySelectorAll(".gbtn").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.gender === g)));
    document.querySelectorAll(".gi").forEach(n => n.innerHTML = ICON[g]);
    document.querySelectorAll(".gn").forEach(n => n.textContent = T(g === "f" ? "woman" : "man"));
  }
  let lastMsg = null;
  function msg(kind, text) { lastMsg = [kind, text]; $("msg").className = "msg" + (kind === "ok" ? " ok" : ""); $("msg").textContent = text; }

  function apply() {
    const l = I18N.lang, name = T("coach");
    html.lang = l; html.dir = I18N.dir();
    document.querySelectorAll("[data-i]").forEach(n => n.textContent = T(n.dataset.i));
    $("legal").textContent = T("legalH", { name });
    $("copy").textContent = T("foot", { year: new Date().getFullYear(), name });
    $("langname").textContent = I18N.langs[l]._name;
    $("langmenu").innerHTML = I18N.order.map(k => `<button type="button" role="menuitemradio" aria-checked="${k === l}" data-l="${k}" lang="${k}" dir="${I18N.langs[k]._dir}">${I18N.langs[k]._name}${k === l ? " ✓" : ""}</button>`).join("");
    if (st.g) setGender(st.g);
    if (st.sec) $("secname").textContent = T(NAME[st.sec]);
    const a = [];
    if (S.whatsapp) a.push(`<a class="wa" href="https://wa.me/${S.whatsapp.replace(/\D/g, "")}" target="_blank" rel="noopener"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z"/></svg><span>${T("wa")}</span></a>`);
    if (S.instagram) a.push(`<a class="ig" href="https://www.instagram.com/${S.instagram}/" target="_blank" rel="noopener"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg><span dir="ltr">@${S.instagram}</span></a>`);
    $("contact").innerHTML = a.join("");
    if (lastMsg) msg(...lastMsg);
  }

  async function openSec(sec, code) {
    const btn = $("go"); btn.disabled = true; msg("ok", T("msgChecking"));
    try {
      if (await has(sec, code)) { st.code = code; st.sec = sec; save(); location.href = PAGE[sec]; return; }
      const others = [];
      for (const s of ["w", "n", "r"]) if (s !== sec && await has(s, code)) others.push(T(NAME[s]));
      if (others.length) { st.code = code; save(); msg("", T("notThis", { sec: T(NAME[sec]) }) + " " + T("haveOther", { list: others.join(" · ") })); }
      else msg("", T("msgNotFound"));
    } finally { btn.disabled = false; }
  }

  /* events */
  document.querySelectorAll(".gbtn").forEach(b => b.addEventListener("click", () => {
    if (st.g && st.g !== b.dataset.gender) { delete st.code; $("code").value = ""; }   // other gender = probably another person: forget the last code
    setGender(b.dataset.gender); show("st2");
  }));
  document.querySelectorAll(".sec").forEach(b => b.addEventListener("click", () => {
    st.sec = b.dataset.sec; save(); $("secname").textContent = T(NAME[st.sec]); msg("", "");
    if (st.code) { $("code").value = st.code; $("other").hidden = false; show("st3"); $("go").focus({ preventScroll: true }); }
    else { $("other").hidden = true; show("st3"); $("code").focus({ preventScroll: true }); }
  }));
  document.querySelectorAll("[data-back]").forEach(b => b.addEventListener("click", () => { msg("", ""); show(b.dataset.back); }));
  $("other").addEventListener("click", () => { delete st.code; save(); $("code").value = ""; $("other").hidden = true; msg("", ""); $("code").focus(); });
  $("st3").addEventListener("submit", e => { e.preventDefault(); const c = norm($("code").value); if (c.length < 4) { msg("", T("msgShort")); return; } openSec(st.sec, c); });
  const menu = $("langmenu"), globe = $("globe");
  const closeMenu = () => { menu.hidden = true; globe.setAttribute("aria-expanded", "false"); };
  globe.addEventListener("click", e => { e.stopPropagation(); const o = menu.hidden; menu.hidden = !o; globe.setAttribute("aria-expanded", String(o)); });
  menu.addEventListener("click", e => { const b = e.target.closest("button[data-l]"); if (!b) return; I18N.set(b.dataset.l); closeMenu(); apply(); });
  document.addEventListener("click", e => { if (!e.target.closest(".langwrap")) closeMenu(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
  document.addEventListener("contextmenu", e => { if (e.target.tagName !== "INPUT") e.preventDefault(); });
  $("ad").href = S.recoveryLink || "#";

  apply();
  // coming back from a section with a code: go straight to the choice step
  show(st.g && st.code ? "st2" : "st1");
})();
