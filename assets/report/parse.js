/* Turns the coach file (Coach_Training_Load.xlsx, sheets "Week 1" … "Week N") into report data. */
(function (G) {
  const num = v => (typeof v === "number" ? v : parseFloat(v)) || 0;
  const KG = ["O", "Q", "S", "U"], RP = ["P", "R", "T", "V"];

  function parseCoachFile(wb) {
    const names = Object.keys(wb).filter(n => /^week\s*\d+$/i.test(n.trim()))
      .sort((a, b) => parseInt(a.replace(/\D/g, "")) - parseInt(b.replace(/\D/g, "")));
    if (!names.length) throw new Error("no sheets named Week 1, Week 2 …");
    let client = "";
    const weeks = [], days = new Map(), ex = new Map(), mus = new Map();

    names.forEach((sn, wi) => {
      const S = wb[sn], w = parseInt(sn.replace(/\D/g, ""));
      const cell = (c, r) => S[c + r];
      const title = String(cell("A", 1) || "");
      if (!client && title.includes("|")) client = title.split("|").pop().trim();
      const ph = String(cell("A", 2) || "").match(/Phase:\s*([^|]+)/);
      const W = { w, phase: ph ? ph[1].trim() : "", vol: 0, reps: 0, plan: 0, done: 0, logged: false };
      let maxRow = 0; for (const k in S) { const r = +k.replace(/^[A-Z]+/, ""); if (r > maxRow) maxRow = r; }
      let day = 0;
      for (let r = 1; r <= maxRow; r++) {
        const a = cell("A", r);
        const dm = typeof a === "string" && a.match(/^DAY\s*(\d+)\s*[—–-]\s*(.+)$/i);
        if (dm && !/TOTAL/i.test(a)) {
          day = +dm[1];
          if (!days.has(day)) days.set(day, { d: day, title: dm[2].split("|")[0].trim(), vol: [], has: false });
          continue;
        }
        if (typeof a === "string" && /^DAY\s*\d+\s*TOTAL/i.test(a)) { const D = days.get(day); if (D) { D.vol[wi] = num(cell("AA", r)); D.has = true; } continue; }
        const name = cell("B", r);
        if (!day || typeof name !== "string" || !name.trim() || (typeof a !== "number" && a != null)) continue;
        if (!cell("C", r) && cell("J", r) == null) continue;
        const plan = num(cell("J", r)), type = String(cell("E", r) || "Reps");
        let sets = 0, top = 0;
        for (let i = 0; i < 4; i++) {
          const rp = num(cell(RP[i], r)), kg = num(cell(KG[i], r));
          if (rp > 0) { sets++; if (kg > top) top = kg; }
        }
        const reps = num(cell("Y", r)), vol = num(cell("AA", r)), time = num(cell("Z", r));
        const key = day + "|" + name.trim().toLowerCase();
        if (!ex.has(key)) ex.set(key, { name: name.trim(), day, muscle: String(cell("C", r) || "Other").trim(),
          useBW: /^y/i.test(String(cell("I", r) || "")), timed: /sec|m$|min|dist/i.test(type), w: {} });
        const E = ex.get(key);
        E.w[w] = { sets, plan, top, reps: E.timed ? (time || reps) : reps, vol };
        W.plan += plan; W.done += Math.min(sets, plan || sets); W.reps += reps; W.vol += vol;
      }
      W.vol = Math.round(W.vol * 10) / 10;
      W.logged = W.done > 0 || W.vol > 0;
      weeks.push(W);
    });

    const logged = new Set(weeks.filter(x => x.logged).map(x => x.w));
    for (const E of ex.values()) for (const w in E.w) {
      if (!logged.has(+w)) continue;
      const M = mus.get(E.muscle) || { m: E.muscle, plan: 0, done: 0 };
      M.plan += E.w[w].plan; M.done += Math.min(E.w[w].sets, E.w[w].plan || E.w[w].sets); mus.set(E.muscle, M);
    }
    const D = [...days.values()].filter(d => d.has).sort((a, b) => a.d - b.d)
      .map(d => ({ d: d.d, title: d.title, vol: weeks.map((_, i) => d.vol[i] || 0) }));
    const exList = [...ex.values()].filter(e => Object.values(e.w).some(x => x.plan > 0 || x.sets > 0))
      .sort((a, b) => a.day - b.day);
    return { client, weeks, days: D, ex: exList, muscles: [...mus.values()].filter(m => m.plan > 0) };
  }
  G.parseCoachFile = parseCoachFile;
})(typeof window !== "undefined" ? window : globalThis);
