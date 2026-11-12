/* Reads an .xlsx file in the browser (no upload, no library). Returns { sheetName: { "A1": value, ... } }.
   Uses the values Excel saved in the file, so open the file in Excel and press Save before using it. */
(function (G) {
  const td = new TextDecoder();
  async function inflate(bytes) {
    const ds = new DecompressionStream("deflate-raw");
    const out = new Blob([bytes]).stream().pipeThrough(ds);
    return new Uint8Array(await new Response(out).arrayBuffer());
  }
  async function unzip(buf) {
    const u8 = new Uint8Array(buf), dv = new DataView(buf);
    let e = u8.length - 22; while (e >= 0 && dv.getUint32(e, true) !== 0x06054b50) e--;
    if (e < 0) throw new Error("not an .xlsx file");
    const n = dv.getUint16(e + 10, true); let p = dv.getUint32(e + 16, true);
    const files = {};
    for (let i = 0; i < n; i++) {
      const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true);
      const nl = dv.getUint16(p + 28, true), xl = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true);
      const off = dv.getUint32(p + 42, true), name = td.decode(u8.subarray(p + 46, p + 46 + nl));
      files[name] = { method, csize, off };
      p += 46 + nl + xl + cl;
    }
    return async name => {
      const f = files[name]; if (!f) return null;
      const start = f.off + 30 + dv.getUint16(f.off + 26, true) + dv.getUint16(f.off + 28, true);
      const raw = u8.subarray(start, start + f.csize);
      return td.decode(f.method === 0 ? raw : await inflate(raw));
    };
  }
  const ent = s => s.replace(/&(lt|gt|quot|apos|amp|#\d+|#x[0-9a-f]+);/gi, (m, k) =>
    ({ lt: "<", gt: ">", quot: '"', apos: "'", amp: "&" }[k.toLowerCase()] ?? (k[1] === "x" || k[1] === "X" ? String.fromCodePoint(parseInt(k.slice(2), 16)) : String.fromCodePoint(+k.slice(1)))));
  const attr = (tag, a) => { const m = tag.match(new RegExp("\\s" + a + '="([^"]*)"')); return m ? ent(m[1]) : null; };
  const texts = x => [...x.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map(m => ent(m[1])).join("");

  async function readWorkbook(buf) {
    const get = await unzip(buf);
    const ss = [], sst = await get("xl/sharedStrings.xml");
    if (sst) for (const m of sst.matchAll(/<si>([\s\S]*?)<\/si>/g)) ss.push(texts(m[1]));
    const wbx = await get("xl/workbook.xml"), rels = await get("xl/_rels/workbook.xml.rels");
    const target = {};
    for (const m of rels.matchAll(/<Relationship\b[^>]*>/g)) target[attr(m[0], "Id")] = attr(m[0], "Target");
    const out = {};
    for (const m of wbx.matchAll(/<sheet\b[^>]*>/g)) {
      const name = attr(m[0], "name"), t = target[attr(m[0], "r:id")]; if (!t) continue;
      const path = t.startsWith("/") ? t.slice(1) : "xl/" + t.replace(/^\.\//, "");
      const x = await get(path); if (!x) continue;
      const cells = {};
      for (const c of x.matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const head = "<c" + c[1] + ">", ref = attr(head, "r"), type = attr(head, "t"), body = c[2] || "";
        const v = body.match(/<v>([\s\S]*?)<\/v>/);
        let val = null;
        if (type === "s") val = v ? ss[+v[1]] : null;
        else if (type === "inlineStr") val = texts(body);
        else if (type === "str" || type === "e") val = v ? ent(v[1]) : null;
        else if (type === "b") val = v ? v[1] === "1" : null;
        else if (v) val = +v[1];
        if (ref && val !== null && val !== "") cells[ref] = val;
      }
      out[name] = cells;
    }
    return out;
  }
  G.XLSXLite = { readWorkbook };
})(typeof window !== "undefined" ? window : globalThis);
