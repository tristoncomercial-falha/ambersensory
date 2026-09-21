/**
 * AMBER at GEMMA — backend da lista (Google Apps Script)
 * Salva cada inscrição numa planilha do Google e entrega a lista ao painel admin.
 *
 * 1) Troque a SENHA abaixo por uma sua.
 * 2) Implantar > Nova implantação > Tipo: App da Web
 *    Executar como: Eu · Quem pode acessar: Qualquer pessoa
 * 3) Copie a URL que termina em /exec e cole no index.html e no admin.html.
 */

const SENHA = "troque-esta-senha";   // senha do painel admin
const ABA   = "Inscritos";

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(ABA);
  if (!sh) {
    sh = ss.insertSheet(ABA);
    sh.appendRow(["Data", "Nome", "Instagram", "WhatsApp"]);
    sh.setFrozenRows(1);
    sh.getRange("A1:D1").setFontWeight("bold");
    sh.getRange("D:D").setNumberFormat("@"); // WhatsApp como texto
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Recebe a inscrição do site */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const d = JSON.parse(e.postData.contents || "{}");
    if (d.site) return json_({ ok: true });                 // robô (honeypot)

    const nome = String(d.nome || "").trim().replace(/\s+/g, " ").slice(0, 80);
    const ig   = String(d.instagram || "").trim().replace(/^@+/, "").toLowerCase().slice(0, 30);
    const wpp  = String(d.whatsapp || "").replace(/\D/g, "").slice(0, 11);

    if (nome.length < 3 || !/^[a-z0-9._]{2,30}$/.test(ig) || !/^\d{10,11}$/.test(wpp)) {
      return json_({ ok: false, error: "dados inválidos" });
    }

    lock.waitLock(10000);
    const sh = sheet_();
    const last = sh.getLastRow();
    if (last > 1) {
      const rows = sh.getRange(2, 3, last - 1, 2).getValues(); // Instagram, WhatsApp
      const dup = rows.some(r => String(r[1]).replace(/\D/g, "") === wpp ||
                                 String(r[0]).replace(/^@/, "").toLowerCase() === ig);
      if (dup) return json_({ ok: true, duplicate: true });
    }
    sh.appendRow([new Date(), nome, "@" + ig, wpp]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

/** Entrega a lista ao painel admin (precisa da senha) */
function doGet(e) {
  const key = (e && e.parameter && e.parameter.key) || "";
  if (key !== SENHA) return json_({ ok: false, error: "senha incorreta" });

  const sh = sheet_();
  const last = sh.getLastRow();
  const tz = Session.getScriptTimeZone();
  const rows = last > 1 ? sh.getRange(2, 1, last - 1, 4).getValues() : [];
  const lista = rows.map(r => ({
    data: r[0] instanceof Date ? Utilities.formatDate(r[0], tz, "dd/MM HH:mm") : String(r[0]),
    ts: r[0] instanceof Date ? r[0].getTime() : 0,
    nome: String(r[1]),
    instagram: String(r[2]),
    whatsapp: String(r[3])
  }));
  return json_({ ok: true, total: lista.length, lista: lista });
}
