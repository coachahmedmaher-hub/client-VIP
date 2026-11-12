/* Extra languages for the workout pages: Urdu, German, Malayalam, Russian. Load right after i18n.js. */
(function () {
  const MUS = {
    ur: { Chest: "سینہ", Back: "کمر", Shoulders: "کندھے", "Rear Delts": "پچھلے کندھے", Biceps: "بائسپس", Triceps: "ٹرائسپس", Forearms: "فور آرمز", "Lower Traps": "نچلے ٹریپس", Traps: "ٹریپس", Hamstrings: "ہیمسٹرنگز", Glutes: "کولہے", Quads: "کواڈز", Calves: "پنڈلیاں", Abductors: "ایبڈکٹرز", Adductors: "ایڈکٹرز", Core: "کور", "Lower Back": "کمر کا نچلا حصہ", Tibialis: "ٹبیالس" },
    de: { Chest: "Brust", Back: "Rücken", Shoulders: "Schultern", "Rear Delts": "Hintere Schulter", Biceps: "Bizeps", Triceps: "Trizeps", Forearms: "Unterarme", "Lower Traps": "Unterer Trapez", Traps: "Trapez", Hamstrings: "Beinbeuger", Glutes: "Gesäß", Quads: "Quadrizeps", Calves: "Waden", Abductors: "Abduktoren", Adductors: "Adduktoren", Core: "Rumpf", "Lower Back": "Unterer Rücken", Tibialis: "Schienbeinmuskel" },
    ml: { Chest: "നെഞ്ച്", Back: "പുറം", Shoulders: "തോളുകൾ", "Rear Delts": "പിൻ തോൾ", Biceps: "ബൈസെപ്സ്", Triceps: "ട്രൈസെപ്സ്", Forearms: "കൈത്തണ്ട", "Lower Traps": "താഴ്ന്ന ട്രാപ്സ്", Traps: "ട്രാപ്സ്", Hamstrings: "ഹാംസ്ട്രിംഗ്സ്", Glutes: "ഗ്ലൂട്ട്സ്", Quads: "ക്വാഡ്സ്", Calves: "കാഫ്", Abductors: "അബ്ഡക്ടറുകൾ", Adductors: "അഡക്ടറുകൾ", Core: "കോർ", "Lower Back": "താഴത്തെ പുറം", Tibialis: "ടിബിയാലിസ്" },
    ru: { Chest: "Грудь", Back: "Спина", Shoulders: "Плечи", "Rear Delts": "Задние дельты", Biceps: "Бицепс", Triceps: "Трицепс", Forearms: "Предплечья", "Lower Traps": "Нижняя трапеция", Traps: "Трапеция", Hamstrings: "Бицепс бедра", Glutes: "Ягодицы", Quads: "Квадрицепс", Calves: "Икры", Abductors: "Отводящие", Adductors: "Приводящие", Core: "Кор", "Lower Back": "Поясница", Tibialis: "Большеберцовая" }
  };
  const X = {
    ur: { _name: "اردو", _dir: "rtl", coach: "احمد ماہر",
      role: "کوچ", tagline: "آپ کی ذاتی ورزش، جم میں تیار", step1: "مرحلہ 1 از 2", step2: "مرحلہ 2 از 2", change: "تبدیل کریں",
      plan: "کوچ کا ہدف", days: "ٹریننگ کے دن", dayN: "دن {n}", photo: "تصویر", sendCoach: "واٹس ایپ پر کوچ کو بھیجیں", sentNote: "محفوظ ہو گیا۔ واٹس ایپ کھل گیا ہے — Send دبائیں تاکہ کوچ کو آپ کے نمبر مل جائیں۔",
      chooseTitle: "آج کون ٹریننگ کر رہا ہے؟", chooseSub: "ہم صفحہ آپ کے لیے سیٹ کر دیں گے۔ آپ اسے کبھی بھی بدل سکتے ہیں۔", man: "مرد", woman: "خاتون",
      findTitle: "آپ کی ورزش", findSub: "اپنے کوچ کا دیا ہوا ذاتی کوڈ لکھیں۔", go: "میری ورزش کھولیں", codeLabel: "کلائنٹ کوڈ",
      legal: "ورزشیں ذاتی ہیں۔ انہیں کاپی یا شیئر کرنے کی اجازت نہیں۔ © {name} — جملہ حقوق محفوظ ہیں۔",
      msgShort: "براہ کرم پورا کوڈ لکھیں۔", msgChecking: "آپ کا کوڈ چیک ہو رہا ہے…", msgReady: "ورزش تیار ہے، {name}۔ چلیں!",
      msgNotFound: "اس کوڈ کے لیے کوئی ورزش نہیں ملی۔ حروف اور نمبر چیک کریں یا اپنے کوچ سے رابطہ کریں۔",
      style: "انداز", back: "→ مینو", hi: "چلیں، {name}", targets: "ہدف کے پٹھے",
      warmup: "وارم اپ", warmupDef: "5 منٹ ہلکی سائیکل یا واک، پھر پہلی ورزش کا ایک ہلکا سیٹ۔",
      sets: "سیٹ", reps: "ریپس", rest: "آرام", video: "ویڈیو", set: "سیٹ", kg: "کلو", rp: "ریپس",
      last: "پچھلی بار", firstTime: "پہلی بار — ایسا وزن چنیں جو آپ تمام ریپس میں اچھی فارم کے ساتھ اٹھا سکیں۔",
      progress: "{t} میں سے {d} سیٹ مکمل", save: "میری ورزش محفوظ کریں", saved: "محفوظ ہو گیا۔ اگلی بار یہ نمبر نظر آئیں گے اور آپ انہیں بہتر کر سکیں گے۔",
      savedOn: "آخری بار محفوظ: {d}", core: "کور", cardio: "کارڈیو فنشر", time: "وقت", speed: "رفتار", incline: "ڈھلان",
      min: "منٹ", kmh: "کلومیٹر/گھنٹہ", restBtn: "آرام {s} سیکنڈ", restLeft: "آرام", skip: "چھوڑیں", better: "▲ پچھلی بار سے بہتر", same: "= پچھلی بار جتنا", lower: "▼ پچھلی بار سے کم",
      allDone: "ورزش مکمل۔ زبردست!", device: "آپ کے نمبر اسی فون پر محفوظ ہیں۔ اگلی بار یہی فون اور براؤزر استعمال کریں۔",
      history: "آپ کے سیشن", noHistory: "ابھی کوئی سیشن محفوظ نہیں۔", sessions: "{n} محفوظ سیشن", best: "بہترین", perSide: "ہر طرف",
      exN: "ورزش {n}", notes: "کوچ کے نوٹس", foot: "© {year} {name} — جملہ حقوق محفوظ ہیں۔", foot2: "ذاتی ورزشیں · صرف کوڈ سے رسائی", wa: "واٹس ایپ" },
    de: { _name: "Deutsch", _dir: "ltr", coach: "Ahmed Maher",
      role: "Coach", tagline: "Dein persönliches Training, bereit fürs Gym", step1: "Schritt 1 von 2", step2: "Schritt 2 von 2", change: "Ändern",
      plan: "Ziel vom Coach", days: "Trainingstage", dayN: "Tag {n}", photo: "Foto", sendCoach: "Per WhatsApp an den Coach senden", sentNote: "Gespeichert. WhatsApp ist offen — tippe auf Senden, damit dein Coach deine Zahlen bekommt.",
      chooseTitle: "Wer trainiert heute?", chooseSub: "Wir passen die Seite für dich an. Du kannst das jederzeit ändern.", man: "Mann", woman: "Frau",
      findTitle: "Dein Training", findSub: "Gib den persönlichen Code ein, den dir dein Coach gegeben hat.", go: "Mein Training öffnen", codeLabel: "Kundencode",
      legal: "Trainingspläne sind persönlich. Kopieren oder Weitergeben ist nicht erlaubt. © {name} — alle Rechte vorbehalten.",
      msgShort: "Bitte gib deinen vollständigen Code ein.", msgChecking: "Code wird geprüft…", msgReady: "Training bereit, {name}. Los geht's!",
      msgNotFound: "Für diesen Code wurde kein Training gefunden. Prüfe Buchstaben und Zahlen oder kontaktiere deinen Coach.",
      style: "Stil", back: "← Menü", hi: "Los geht's, {name}", targets: "Zielmuskeln",
      warmup: "Aufwärmen", warmupDef: "5 Min. locker Rad fahren oder gehen, dann 1 leichter Satz der ersten Übung.",
      sets: "Sätze", reps: "Wdh.", rest: "Pause", video: "Video", set: "Satz", kg: "kg", rp: "Wdh.",
      last: "Letztes Mal", firstTime: "Erstes Mal — wähle ein Gewicht, das du bei allen Wiederholungen sauber bewegen kannst.",
      progress: "{d} von {t} Sätzen erledigt", save: "Training speichern", saved: "Gespeichert. Nächstes Mal siehst du diese Zahlen und kannst sie schlagen.",
      savedOn: "Zuletzt gespeichert: {d}", core: "Rumpf", cardio: "Cardio-Finisher", time: "Zeit", speed: "Tempo", incline: "Steigung",
      min: "Min.", kmh: "km/h", restBtn: "Pause {s}s", restLeft: "Pause", skip: "Überspringen", better: "▲ besser als letztes Mal", same: "= wie letztes Mal", lower: "▼ weniger als letztes Mal",
      allDone: "Training geschafft. Stark!", device: "Deine Zahlen sind auf diesem Handy gespeichert. Nutze nächstes Mal dasselbe Handy und denselben Browser.",
      history: "Deine Einheiten", noHistory: "Noch keine gespeicherten Einheiten.", sessions: "{n} gespeicherte Einheiten", best: "Bestwert", perSide: "pro Seite",
      exN: "Übung {n}", notes: "Hinweise vom Coach", foot: "© {year} {name} — alle Rechte vorbehalten.", foot2: "Persönliche Trainingspläne · Zugang nur mit Code", wa: "WhatsApp" },
    ml: { _name: "മലയാളം", _dir: "ltr", coach: "Ahmed Maher",
      role: "കോച്ച്", tagline: "നിങ്ങളുടെ സ്വന്തം വർക്കൗട്ട്, ജിമ്മിൽ റെഡി", step1: "ഘട്ടം 1 / 2", step2: "ഘട്ടം 2 / 2", change: "മാറ്റുക",
      plan: "കോച്ചിന്റെ ലക്ഷ്യം", days: "ട്രെയിനിംഗ് ദിവസങ്ങൾ", dayN: "ദിവസം {n}", photo: "ഫോട്ടോ", sendCoach: "വാട്ട്‌സ്ആപ്പിൽ കോച്ചിന് അയയ്ക്കുക", sentNote: "സേവ് ചെയ്തു. വാട്ട്‌സ്ആപ്പ് തുറന്നു — കോച്ചിന് നിങ്ങളുടെ നമ്പറുകൾ കിട്ടാൻ Send അമർത്തുക.",
      chooseTitle: "ഇന്ന് ആരാണ് ട്രെയിൻ ചെയ്യുന്നത്?", chooseSub: "പേജ് നിങ്ങൾക്കായി ഒരുക്കാം. എപ്പോൾ വേണമെങ്കിലും മാറ്റാം.", man: "പുരുഷൻ", woman: "സ്ത്രീ",
      findTitle: "നിങ്ങളുടെ വർക്കൗട്ട്", findSub: "കോച്ച് തന്ന സ്വകാര്യ കോഡ് ടൈപ്പ് ചെയ്യുക.", go: "എന്റെ വർക്കൗട്ട് തുറക്കുക", codeLabel: "ക്ലയന്റ് കോഡ്",
      legal: "വർക്കൗട്ടുകൾ സ്വകാര്യമാണ്. പകർത്താനോ പങ്കിടാനോ അനുവാദമില്ല. © {name} — എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.",
      msgShort: "ദയവായി പൂർണ്ണ കോഡ് ടൈപ്പ് ചെയ്യുക.", msgChecking: "കോഡ് പരിശോധിക്കുന്നു…", msgReady: "വർക്കൗട്ട് റെഡി, {name}. തുടങ്ങാം!",
      msgNotFound: "ഈ കോഡിന് വർക്കൗട്ട് കണ്ടെത്തിയില്ല. അക്ഷരങ്ങളും നമ്പറുകളും പരിശോധിക്കുക, അല്ലെങ്കിൽ കോച്ചിനെ ബന്ധപ്പെടുക.",
      style: "സ്റ്റൈൽ", back: "← മെനു", hi: "തുടങ്ങാം, {name}", targets: "ലക്ഷ്യ പേശികൾ",
      warmup: "വാം-അപ്പ്", warmupDef: "5 മിനിറ്റ് ലഘുവായി സൈക്കിൾ അല്ലെങ്കിൽ നടത്തം, പിന്നെ ആദ്യ എക്സർസൈസിന്റെ ഒരു ലൈറ്റ് സെറ്റ്.",
      sets: "സെറ്റുകൾ", reps: "റെപ്സ്", rest: "വിശ്രമം", video: "വീഡിയോ", set: "സെറ്റ്", kg: "കി.ഗ്രാം", rp: "റെപ്സ്",
      last: "കഴിഞ്ഞ തവണ", firstTime: "ആദ്യ തവണ — എല്ലാ റെപ്സും നല്ല ഫോമിൽ ചെയ്യാൻ കഴിയുന്ന ഭാരം തിരഞ്ഞെടുക്കുക.",
      progress: "{t} ൽ {d} സെറ്റുകൾ പൂർത്തിയായി", save: "എന്റെ വർക്കൗട്ട് സേവ് ചെയ്യുക", saved: "സേവ് ചെയ്തു. അടുത്ത തവണ ഈ നമ്പറുകൾ കാണാം, അവയെ മറികടക്കാം.",
      savedOn: "അവസാനം സേവ് ചെയ്തത്: {d}", core: "കോർ", cardio: "കാർഡിയോ ഫിനിഷർ", time: "സമയം", speed: "വേഗത", incline: "ചരിവ്",
      min: "മിനിറ്റ്", kmh: "കി.മീ/മ", restBtn: "വിശ്രമം {s}സെ", restLeft: "വിശ്രമം", skip: "ഒഴിവാക്കുക", better: "▲ കഴിഞ്ഞ തവണയേക്കാൾ മികച്ചത്", same: "= കഴിഞ്ഞ തവണ പോലെ", lower: "▼ കഴിഞ്ഞ തവണയേക്കാൾ കുറവ്",
      allDone: "വർക്കൗട്ട് പൂർത്തിയായി. മികച്ച ജോലി!", device: "നിങ്ങളുടെ നമ്പറുകൾ ഈ ഫോണിൽ സേവ് ചെയ്തിരിക്കുന്നു. അടുത്ത തവണ ഇതേ ഫോണും ബ്രൗസറും ഉപയോഗിക്കുക.",
      history: "നിങ്ങളുടെ സെഷനുകൾ", noHistory: "ഇതുവരെ സേവ് ചെയ്ത സെഷനുകളില്ല.", sessions: "{n} സേവ് ചെയ്ത സെഷനുകൾ", best: "മികച്ചത്", perSide: "ഓരോ വശത്തും",
      exN: "എക്സർസൈസ് {n}", notes: "കോച്ചിന്റെ കുറിപ്പുകൾ", foot: "© {year} {name} — എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.", foot2: "സ്വകാര്യ വർക്കൗട്ടുകൾ · കോഡ് വഴി മാത്രം പ്രവേശനം", wa: "WhatsApp" },
    ru: { _name: "Русский", _dir: "ltr", coach: "Ahmed Maher",
      role: "Тренер", tagline: "Ваша персональная тренировка — готова для зала", step1: "Шаг 1 из 2", step2: "Шаг 2 из 2", change: "Изменить",
      plan: "Цель тренера", days: "Дни тренировок", dayN: "День {n}", photo: "Фото", sendCoach: "Отправить тренеру в WhatsApp", sentNote: "Сохранено. WhatsApp открыт — нажмите «Отправить», чтобы тренер получил ваши результаты.",
      chooseTitle: "Кто сегодня тренируется?", chooseSub: "Мы настроим страницу для вас. Изменить можно в любой момент.", man: "Мужчина", woman: "Женщина",
      findTitle: "Ваша тренировка", findSub: "Введите личный код, который дал вам тренер.", go: "Открыть тренировку", codeLabel: "Код клиента",
      legal: "Тренировки персональные. Копировать и передавать их запрещено. © {name} — все права защищены.",
      msgShort: "Введите код полностью.", msgChecking: "Проверяем код…", msgReady: "Тренировка готова, {name}. Вперёд!",
      msgNotFound: "Тренировка по этому коду не найдена. Проверьте буквы и цифры или свяжитесь с тренером.",
      style: "Стиль", back: "← Меню", hi: "Вперёд, {name}", targets: "Целевые мышцы",
      warmup: "Разминка", warmupDef: "5 мин лёгкого велосипеда или ходьбы, затем 1 лёгкий подход первого упражнения.",
      sets: "Подходы", reps: "Повторы", rest: "Отдых", video: "Видео", set: "Подход", kg: "кг", rp: "повт.",
      last: "В прошлый раз", firstTime: "Первый раз — выберите вес, с которым выполните все повторы с правильной техникой.",
      progress: "Выполнено {d} из {t} подходов", save: "Сохранить тренировку", saved: "Сохранено. В следующий раз вы увидите эти цифры и сможете их превзойти.",
      savedOn: "Последнее сохранение: {d}", core: "Кор", cardio: "Кардио в конце", time: "Время", speed: "Скорость", incline: "Наклон",
      min: "мин", kmh: "км/ч", restBtn: "Отдых {s} с", restLeft: "Отдых", skip: "Пропустить", better: "▲ лучше, чем в прошлый раз", same: "= как в прошлый раз", lower: "▼ меньше, чем в прошлый раз",
      allDone: "Тренировка завершена. Отличная работа!", device: "Ваши результаты сохранены на этом телефоне. В следующий раз используйте тот же телефон и браузер.",
      history: "Ваши тренировки", noHistory: "Сохранённых тренировок пока нет.", sessions: "Сохранено тренировок: {n}", best: "Рекорд", perSide: "на каждую сторону",
      exN: "Упражнение {n}", notes: "Заметки тренера", foot: "© {year} {name} — все права защищены.", foot2: "Персональные тренировки · доступ только по коду", wa: "WhatsApp" }
  };
  window.I18N_MUS = MUS;
  window.I18N_ADD = function (dict, X) {
    const I = window.I18N; if (!I) return;
    for (const l in X) I.langs[l] = Object.assign(I.langs[l] || {}, X[l], { mus: Object.assign({}, MUS[l], (I.langs[l] || {}).mus) });
    I.order.splice(0, I.order.length, ...["ar", "en", "ur", "hi", "ml", "fil", "fr", "de", "ru"].filter(k => I.langs[k]));
    let s = ""; try { s = localStorage.getItem("amw-lang") || ""; } catch (e) {}
    if (I.langs[s]) { if (I.lang !== s) I.set(s); }
    else if (!s) { const n = (navigator.language || "").toLowerCase().slice(0, 2); if (["ur", "de", "ml", "ru"].includes(n)) I.set(n); }
  };
  window.I18N_ADD(null, X);
})();
