(function () {
  "use strict";

  const PATRA_ITEMS = [
    // Group A: 1 to 13 (Open bid / offered amount)
    { id: 1, group: "A", title: "सौधर्म इन्द्र - शची इन्द्राणी", fixedAmount: null, hint: "अपनी राशि लिखें" },
    { id: 2, group: "A", title: "कुबेर", fixedAmount: null, hint: "अपनी राशि लिखें" },
    { id: 3, group: "A", title: "महायज्ञनायक", fixedAmount: null, hint: "अपनी राशि लिखें" },
    { id: 4, group: "A", title: "राजा श्रेयांस", fixedAmount: null, hint: "अपनी राशि लिखें" },
    { id: 5, group: "A", title: "राजा सोम", fixedAmount: null, hint: "अपनी राशि लिखें" },
    { id: 6, group: "A", title: "चक्रवर्ती-भरत", fixedAmount: null, hint: "अपनी राशि लिखें" },
    { id: 7, group: "A", title: "कामदेव - बाहुबली", fixedAmount: null, hint: "अपनी राशि लिखें" },
    { id: 8, group: "A", title: "ईशान इन्द्र", fixedAmount: null, hint: "अपनी राशि लिखें" },
    { id: 9, group: "A", title: "सानत कुमार इन्द्र", fixedAmount: null, hint: "अपनी राशि लिखें" },
    { id: 10, group: "A", title: "माहेन्द्र इन्द्र", fixedAmount: null, hint: "अपनी राशि लिखें" },
    { id: 11, group: "A", title: "यज्ञनायक ( एक से अधिक )", fixedAmount: null, hint: "अपनी राशि लिखें" },
    { id: 12, group: "A", title: "विधिनायक प्रतिमा प्रदाता", fixedAmount: null, hint: "अपनी राशि लिखें" },
    { id: 13, group: "A", title: "ध्वजारोहणकर्ता", fixedAmount: null, hint: "अपनी राशि लिखें" },

    // Group B: 14 to 24 (Fixed amount + applicant name/consent)
    { id: 14, group: "B", title: "ब्रह्म इन्द्र", fixedAmount: 151000, feeLabel: "1,51,000/-" },
    { id: 15, group: "B", title: "लान्तव इन्द्र", fixedAmount: 111000, feeLabel: "1,11,000/-" },
    { id: 16, group: "B", title: "शुक्र इन्द्र", fixedAmount: 111000, feeLabel: "1,11,000/-" },
    { id: 17, group: "B", title: "शतार इन्द्र", fixedAmount: 111000, feeLabel: "1,11,000/-" },
    { id: 18, group: "B", title: "आनत इन्द्र", fixedAmount: 111000, feeLabel: "1,11,000/-" },
    { id: 19, group: "B", title: "प्राणत इन्द्र", fixedAmount: 111000, feeLabel: "1,11,000/-" },
    { id: 20, group: "B", title: "आरण इन्द्र", fixedAmount: 111000, feeLabel: "1,11,000/-" },
    { id: 21, group: "B", title: "अच्युत इन्द्र", fixedAmount: 111000, feeLabel: "1,11,000/-" },
    { id: 22, group: "B", title: "महामंडलेश्वर ( 4 )", fixedAmount: 71000, feeLabel: "71,000/- प्रत्येक" },
    { id: 23, group: "B", title: "मंडलेश्वर ( 16 )", fixedAmount: 51000, feeLabel: "51,000/- प्रत्येक" },
    { id: 24, group: "B", title: "मुकुटबद्ध राजा ( 32 )", fixedAmount: 31000, feeLabel: "31,000/- प्रत्येक" },

    // Group C: 25 to 30 (Special Nyaochhavar roles)
    {
      id: 25,
      group: "C",
      title: "स्वर्ण-सौभाग्यवती महिलायें - ( एकाधिक )",
      fixedAmount: 51151,
      feeLabel: "न्यौछावर राशि - 51,151/-",
      desc: "माता-पिता, सास-ससुर जीवित हो, संतान पैदा हुई हो, प्रत्येक मंगल कार्य करने का सौभाग्य प्राप्त होगा।"
    },
    {
      id: 26,
      group: "C",
      title: "अष्ट कुमारियां ( 8 से भी अधिक )",
      fixedAmount: 25125,
      feeLabel: "न्यौछावर राशि - 25,125/-",
      desc: "इसमें धार्मिक, 12 से 16 वर्ष तक की मंगल कन्यायें भाग लेंगी।"
    },
    {
      id: 27,
      group: "C",
      title: "छप्पन कुमारियां ( 56 बाल कन्यायें )",
      fixedAmount: 3100,
      feeLabel: "न्यौछावर राशि - 3,100/-",
      desc: "इसमें संस्कारित 10 वर्ष तक की मंगल कन्यायें भाग ले सकती हैं।"
    },
    {
      id: 28,
      group: "C",
      title: "लौकान्तिकदेव ( 8 से भी अधिक )",
      fixedAmount: 11001,
      feeLabel: "न्यौछावर राशि - 11,001/-",
      desc: "इसमें धार्मिक, संस्कारित 16 वर्ष तक के बालक भाग ले सकते हैं।"
    },
    { id: 29, group: "C", title: "सामान्य इन्द्र - इन्द्राणी", fixedAmount: 5100, feeLabel: "न्यौछावर राशि - 5,100/-" },
    { id: 30, group: "C", title: "एकल इन्द्र अथवा इन्द्राणी", fixedAmount: 3100, feeLabel: "न्यौछावर राशि - 3,100/-" }
  ];

  const HINDI_WORDS_0_99 = [
    "शून्य", "एक", "दो", "तीन", "चार", "पाँच", "छह", "सात", "आठ", "नौ",
    "दस", "ग्यारह", "बारह", "तेरह", "चौदह", "पंद्रह", "सोलह", "सत्रह", "अठारह", "उन्नीस",
    "बीस", "इक्कीस", "बाईस", "तेईस", "चौबीस", "पच्चीस", "छब्बीस", "सत्ताईस", "अठ्ठाईस", "उनतीस",
    "तीस", "इकतीस", "बत्तीस", "तैंतीस", "चौंतीस", "पैंतीस", "छत्तीस", "सैंतीस", "अड़तीस", "उनतालीस",
    "चालीस", "इकतालीस", "बयालीस", "तैंतालीस", "चौवालीस", "पैंतालीस", "छियालीस", "सैंतालीस", "अड़तालीस", "उनचास",
    "पचास", "इक्यावन", "बावन", "तिरपन", "चौवन", "पचपन", "छप्पन", "सत्तावन", "अठ्ठावन", "उनसठ",
    "साठ", "इकसठ", "बासठ", "तिरसठ", "चौंसठ", "पैंसठ", "छियासठ", "सड़सठ", "अड़सठ", "उनहत्तर",
    "सत्तर", "इकहत्तर", "बहत्तर", "तिहत्तर", "चौहत्तर", "पचहत्तर", "छिहत्तर", "सतहत्तर", "अठहत्तर", "उनासी",
    "अस्सी", "इक्यासी", "बयासी", "तिरासी", "चौरासी", "पचासी", "छियासी", "सत्तासी", "अठासी", "नवासी",
    "नब्बे", "इक्यानवे", "बानवे", "तिरानवे", "चौरानवे", "पचानवे", "छियानवे", "सत्तानवे", "अठानवे", "निन्यानवे"
  ];

  function numberToHindiWords(num) {
    const n = Math.floor(Number(num));
    if (!Number.isFinite(n) || n < 0) return "";
    if (n === 0) return "शून्य रुपये मात्र";

    function twoOrThreeDigits(val) {
      let str = "";
      const hundreds = Math.floor(val / 100);
      const rem = val % 100;
      if (hundreds > 0) {
        str += HINDI_WORDS_0_99[hundreds] + " सौ";
      }
      if (rem > 0) {
        str += (str ? " " : "") + HINDI_WORDS_0_99[rem];
      }
      return str;
    }

    const parts = [];
    const crore = Math.floor(n / 10000000);
    const lakh = Math.floor((n % 10000000) / 100000);
    const thousand = Math.floor((n % 100000) / 1000);
    const rest = n % 1000;

    if (crore > 0) parts.push((crore < 100 ? HINDI_WORDS_0_99[crore] : numberToHindiWordsRaw(crore)) + " करोड़");
    if (lakh > 0) parts.push(HINDI_WORDS_0_99[lakh] + " लाख");
    if (thousand > 0) parts.push(HINDI_WORDS_0_99[thousand] + " हजार");
    if (rest > 0) parts.push(twoOrThreeDigits(rest));

    return parts.join(" ") + " रुपये मात्र";
  }

  function numberToHindiWordsRaw(n) {
    if (n < 100) return HINDI_WORDS_0_99[n];
    return String(n);
  }

  function formatINR(num) {
    const n = Number(num) || 0;
    return n.toLocaleString("en-IN");
  }

  // Runtime environment detection
  const config = window.PANCHKALYANAK_CONFIG || {};
  const isGasHost = typeof google !== "undefined" && google.script && google.script.run;
  const appsScriptUrl = (config.APPS_SCRIPT_URL || "").trim();
  const isConnected = isGasHost || Boolean(appsScriptUrl);

  const state = {
    formLoadedAt: Date.now(),
    captchaId: null,
    localCaptchaAnswer: null,
    userEditedRole1: false,
    userEditedRole2: false,
    userEditedAmount: false,
    userEditedWords: false
  };

  // DOM References
  const form = document.getElementById("panchkalyanakForm");
  const demoBanner = document.getElementById("demoBanner");
  const patraGroupA = document.getElementById("patraGroupA");
  const patraGroupB = document.getElementById("patraGroupB");
  const patraGroupC = document.getElementById("patraGroupC");
  const selectedCountBadge = document.getElementById("selectedCountBadge");
  const selectedTotalBadge = document.getElementById("selectedTotalBadge");
  const desiredRole1 = document.getElementById("desiredRole1");
  const desiredRole2 = document.getElementById("desiredRole2");
  const donationAmountInput = document.getElementById("donationAmount");
  const donationWordsInput = document.getElementById("donationAmountWords");
  const submissionDateInput = document.getElementById("submissionDate");
  const captchaDisplay = document.getElementById("captchaDisplay");
  const captchaInput = document.getElementById("captchaInput");
  const refreshCaptchaBtn = document.getElementById("refreshCaptchaBtn");
  const submitBtn = document.getElementById("submitBtn");
  const formGlobalError = document.getElementById("formGlobalError");
  const formContainer = document.getElementById("formContainer");
  const receiptView = document.getElementById("receiptView");
  const receiptRefId = document.getElementById("receiptRefId");
  const receiptDemoNotice = document.getElementById("receiptDemoNotice");
  const receiptSummary = document.getElementById("receiptSummary");
  const printReceiptBtn = document.getElementById("printReceiptBtn");
  const newFormBtn = document.getElementById("newFormBtn");

  function init() {
    if (!isConnected && demoBanner) {
      demoBanner.classList.remove("hidden");
    }

    setDefaultDate();
    renderPatraRows();
    populateRoleDropdowns();
    attachEventListeners();
    loadCaptcha();
  }

  function setDefaultDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    submissionDateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  function renderPatraRows() {
    const containers = { A: patraGroupA, B: patraGroupB, C: patraGroupC };

    PATRA_ITEMS.forEach((item) => {
      const row = document.createElement("div");
      row.className = "patra-row";
      row.dataset.patraId = String(item.id);

      const checkWrap = document.createElement("div");
      checkWrap.className = "patra-check-wrap";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "patra-checkbox";
      checkbox.id = `patra-check-${item.id}`;
      checkbox.dataset.patraId = String(item.id);

      const numSpan = document.createElement("span");
      numSpan.className = "patra-num";
      numSpan.textContent = `(${item.id})`;

      checkWrap.appendChild(checkbox);
      checkWrap.appendChild(numSpan);

      const info = document.createElement("label");
      info.className = "patra-info";
      info.htmlFor = checkbox.id;
      info.style.cursor = "pointer";

      const titleSpan = document.createElement("span");
      titleSpan.className = "patra-title";
      titleSpan.textContent = item.title;
      info.appendChild(titleSpan);

      if (item.feeLabel) {
        const feeSpan = document.createElement("span");
        feeSpan.className = "patra-fixed-fee";
        feeSpan.textContent = item.feeLabel;
        info.appendChild(feeSpan);
      }

      if (item.desc) {
        const descSpan = document.createElement("span");
        descSpan.className = "patra-desc";
        descSpan.textContent = item.desc;
        info.appendChild(descSpan);
      }

      const inputBox = document.createElement("div");
      inputBox.className = "patra-input-box";

      if (item.group === "A") {
        const prefix = document.createElement("span");
        prefix.className = "currency-prefix";
        prefix.textContent = "₹";

        const amtInput = document.createElement("input");
        amtInput.type = "number";
        amtInput.min = "0";
        amtInput.inputMode = "numeric";
        amtInput.className = "patra-amount-input";
        amtInput.id = `patra-amt-${item.id}`;
        amtInput.placeholder = item.hint;
        amtInput.setAttribute("aria-label", `${item.title} राशि`);

        amtInput.addEventListener("input", () => {
          const val = Number(amtInput.value);
          checkbox.checked = val > 0 || amtInput.value.trim() !== "";
          row.classList.toggle("selected", checkbox.checked);
          updatePatraSummary();
        });

        inputBox.appendChild(prefix);
        inputBox.appendChild(amtInput);
      } else {
        const noteInput = document.createElement("input");
        noteInput.type = "text";
        noteInput.className = "patra-note-input";
        noteInput.id = `patra-note-${item.id}`;
        noteInput.placeholder = item.group === "B" ? "इच्छुक व्यक्ति का नाम लिखें" : "प्रतिभागी का नाम / टिप्पणी";
        noteInput.setAttribute("aria-label", `${item.title} प्रतिभागी नाम`);

        noteInput.addEventListener("input", () => {
          if (noteInput.value.trim() !== "") {
            checkbox.checked = true;
            row.classList.toggle("selected", true);
            updatePatraSummary();
          }
        });

        inputBox.appendChild(noteInput);
      }

      checkbox.addEventListener("change", () => {
        row.classList.toggle("selected", checkbox.checked);
        updatePatraSummary();
      });

      row.appendChild(checkWrap);
      row.appendChild(info);
      row.appendChild(inputBox);
      containers[item.group].appendChild(row);
    });
  }

  function populateRoleDropdowns() {
    PATRA_ITEMS.forEach((item) => {
      const label = `(${item.id}) ${item.title}${item.fixedAmount ? ` — ₹${formatINR(item.fixedAmount)}` : ""}`;
      const opt1 = new Option(label, `(${item.id}) ${item.title}`);
      const opt2 = new Option(label, `(${item.id}) ${item.title}`);
      desiredRole1.add(opt1);
      desiredRole2.add(opt2);
    });
    desiredRole1.add(new Option("अन्य / चयनित सभी पात्र", "अन्य / चयनित सभी पात्र"));
    desiredRole2.add(new Option("अन्य / कोई नहीं", "अन्य / कोई नहीं"));
  }

  function getSelectedPatraList() {
    const selected = [];
    PATRA_ITEMS.forEach((item) => {
      const checkbox = document.getElementById(`patra-check-${item.id}`);
      if (!checkbox || !checkbox.checked) return;

      if (item.group === "A") {
        const amtInput = document.getElementById(`patra-amt-${item.id}`);
        const amount = amtInput && amtInput.value.trim() !== "" ? Number(amtInput.value) : 0;
        selected.push({
          id: item.id,
          title: item.title,
          amount: Number.isFinite(amount) ? amount : 0,
          note: ""
        });
      } else {
        const noteInput = document.getElementById(`patra-note-${item.id}`);
        const note = noteInput ? noteInput.value.trim() : "";
        selected.push({
          id: item.id,
          title: item.title,
          amount: item.fixedAmount || 0,
          note
        });
      }
    });
    return selected;
  }

  function updatePatraSummary() {
    const selected = getSelectedPatraList();
    const total = selected.reduce((sum, item) => sum + (item.amount || 0), 0);

    selectedCountBadge.textContent = String(selected.length);
    selectedTotalBadge.textContent = `₹ ${formatINR(total)}`;

    if (!state.userEditedRole1) {
      desiredRole1.value = selected[0] ? `(${selected[0].id}) ${selected[0].title}` : "";
    }
    if (!state.userEditedRole2) {
      desiredRole2.value = selected[1] ? `(${selected[1].id}) ${selected[1].title}` : "";
    }
    if (!state.userEditedAmount) {
      donationAmountInput.value = total > 0 ? String(total) : "";
      if (!state.userEditedWords) {
        donationWordsInput.value = total > 0 ? numberToHindiWords(total) : "";
      }
    }
  }

  function attachEventListeners() {
    desiredRole1.addEventListener("change", () => {
      state.userEditedRole1 = true;
      clearFieldError("desiredRole1");
    });

    desiredRole2.addEventListener("change", () => {
      state.userEditedRole2 = true;
    });

    donationAmountInput.addEventListener("input", () => {
      state.userEditedAmount = true;
      const val = Number(donationAmountInput.value);
      if (!state.userEditedWords) {
        donationWordsInput.value = donationAmountInput.value.trim() !== "" && val >= 0
          ? numberToHindiWords(val)
          : "";
      }
      clearFieldError("donationAmount");
      clearFieldError("donationAmountWords");
    });

    donationWordsInput.addEventListener("input", () => {
      state.userEditedWords = donationWordsInput.value.trim() !== "";
      clearFieldError("donationAmountWords");
    });

    const clearOnInputIds = [
      "applicantName",
      "mobileNumber",
      "age",
      "occupation",
      "address",
      "signature",
      "submissionDate",
      "captchaInput"
    ];
    clearOnInputIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", () => clearFieldError(id));
      }
    });

    document.getElementById("rulesAgreed").addEventListener("change", () => clearFieldError("rulesAgreed"));
    document.querySelectorAll('input[name="abhishekPoojan"]').forEach((r) =>
      r.addEventListener("change", () => clearFieldError("abhishekPoojan"))
    );
    document.querySelectorAll('input[name="swadhyay"]').forEach((r) =>
      r.addEventListener("change", () => clearFieldError("swadhyay"))
    );

    refreshCaptchaBtn.addEventListener("click", () => {
      captchaInput.value = "";
      clearFieldError("captchaInput");
      loadCaptcha();
    });

    form.addEventListener("submit", handleSubmit);

    printReceiptBtn.addEventListener("click", () => window.print());

    newFormBtn.addEventListener("click", resetFormForNewEntry);
  }

  // ========================
  // CAPTCHA Loading & Render
  // ========================
  async function loadCaptcha() {
    captchaDisplay.innerHTML = '<span class="captcha-loading">कोड लोड हो रहा है...</span>';
    state.captchaId = null;
    state.localCaptchaAnswer = null;

    if (isGasHost) {
      google.script.run
        .withSuccessHandler((res) => {
          if (res && res.svg && res.challengeId) {
            renderServerSvgCaptcha(res.challengeId, res.svg);
          } else {
            renderLocalCanvasCaptcha();
          }
        })
        .withFailureHandler(() => {
          renderLocalCanvasCaptcha();
        })
        .getCaptchaChallenge();
      return;
    }

    if (appsScriptUrl) {
      try {
        const sep = appsScriptUrl.includes("?") ? "&" : "?";
        const resp = await fetch(`${appsScriptUrl}${sep}action=captcha&t=${Date.now()}`, {
          method: "GET"
        });
        if (!resp.ok) throw new Error("Captcha fetch failed");
        const data = await resp.json();
        if (data && data.svg && data.challengeId) {
          renderServerSvgCaptcha(data.challengeId, data.svg);
          return;
        }
      } catch (err) {
        console.warn("Server captcha fallback to local canvas:", err);
      }
    }

    renderLocalCanvasCaptcha();
  }

  function renderServerSvgCaptcha(challengeId, svgString) {
    state.captchaId = challengeId;
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const svgEl = doc.documentElement;
    if (svgEl && svgEl.nodeName.toLowerCase() === "svg") {
      captchaDisplay.innerHTML = "";
      captchaDisplay.appendChild(document.importNode(svgEl, true));
    } else {
      renderLocalCanvasCaptcha();
    }
  }

  function renderLocalCanvasCaptcha() {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    state.localCaptchaAnswer = code;
    state.captchaId = "LOCAL";

    const canvas = document.createElement("canvas");
    canvas.width = 185;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#fffaf0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Noise lines
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = i % 2 === 0 ? "rgba(139,30,30,0.28)" : "rgba(217,119,6,0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 30, Math.random() * 64);
      ctx.bezierCurveTo(
        60 + Math.random() * 40,
        Math.random() * 64,
        110 + Math.random() * 40,
        Math.random() * 64,
        155 + Math.random() * 30,
        Math.random() * 64
      );
      ctx.stroke();
    }

    // Noise dots
    for (let i = 0; i < 25; i++) {
      ctx.fillStyle = "rgba(120, 53, 15, 0.25)";
      ctx.beginPath();
      ctx.arc(Math.random() * 185, Math.random() * 64, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw digits
    const colors = ["#7c1d1d", "#9a3412", "#631111", "#854d0e"];
    for (let i = 0; i < code.length; i++) {
      ctx.save();
      const x = 32 + i * 36;
      const y = 42 + (Math.random() * 8 - 4);
      const angle = (Math.random() - 0.5) * 0.42;
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.font = "bold 30px Georgia, serif";
      ctx.fillStyle = colors[i % colors.length];
      ctx.textAlign = "center";
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }

    captchaDisplay.innerHTML = "";
    captchaDisplay.appendChild(canvas);
  }

  // ========================
  // Validation & Submission
  // ========================
  function setFieldError(fieldId, message) {
    const errEl = document.getElementById(`err-${fieldId}`);
    if (errEl) errEl.textContent = message;
    const inputEl = document.getElementById(fieldId);
    if (inputEl) inputEl.classList.add("invalid");
  }

  function clearFieldError(fieldId) {
    const errEl = document.getElementById(`err-${fieldId}`);
    if (errEl) errEl.textContent = "";
    const inputEl = document.getElementById(fieldId);
    if (inputEl) inputEl.classList.remove("invalid");
  }

  function clearAllErrors() {
    document.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));
    document.querySelectorAll(".form-control.invalid").forEach((el) => el.classList.remove("invalid"));
    formGlobalError.classList.add("hidden");
    formGlobalError.textContent = "";
  }

  function validateForm() {
    clearAllErrors();
    let firstErrorEl = null;

    function flagError(fieldId, msg, focusTarget) {
      setFieldError(fieldId, msg);
      if (!firstErrorEl) {
        firstErrorEl = focusTarget || document.getElementById(fieldId);
      }
    }

    if (!document.getElementById("rulesAgreed").checked) {
      flagError("rulesAgreed", "कृपया नियमावली (1 से 7) के लिए सहमति बॉक्स चुनें।");
    }

    const abhishek = document.querySelector('input[name="abhishekPoojan"]:checked');
    if (!abhishek) {
      flagError(
        "abhishekPoojan",
        "कृपया हाँ या नहीं चुनें।",
        document.querySelector('input[name="abhishekPoojan"]')
      );
    }

    const swadhyay = document.querySelector('input[name="swadhyay"]:checked');
    if (!swadhyay) {
      flagError(
        "swadhyay",
        "कृपया हाँ या नहीं चुनें।",
        document.querySelector('input[name="swadhyay"]')
      );
    }

    const name = document.getElementById("applicantName").value.trim();
    if (!name) flagError("applicantName", "कृपया अपना पूरा नाम लिखें।");

    const mobile = document.getElementById("mobileNumber").value.trim();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      flagError("mobileNumber", "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।");
    }

    const ageVal = Number(document.getElementById("age").value);
    if (!Number.isFinite(ageVal) || ageVal < 1 || ageVal > 120) {
      flagError("age", "कृपया सही आयु (1 से 120 के बीच) लिखें।");
    }

    const occupation = document.getElementById("occupation").value.trim();
    if (!occupation) flagError("occupation", "कृपया नौकरी या व्यवसाय का विवरण लिखें।");

    const address = document.getElementById("address").value.trim();
    if (!address) flagError("address", "कृपया पूरा निवास पता लिखें।");

    if (!desiredRole1.value) {
      flagError("desiredRole1", "कृपया कम से कम एक वांछित पद चुनें।");
    }

    const amtRaw = donationAmountInput.value.trim();
    if (amtRaw === "" || Number(amtRaw) < 0 || !Number.isFinite(Number(amtRaw))) {
      flagError("donationAmount", "कृपया मान्य न्यौछावर/दान राशि अंकों में लिखें।");
    }

    const wordsRaw = donationWordsInput.value.trim();
    if (!wordsRaw) {
      flagError("donationAmountWords", "कृपया राशि शब्दों में लिखें।");
    }

    const signature = document.getElementById("signature").value.trim();
    if (!signature) flagError("signature", "कृपया हस्ताक्षर के रूप में अपना पूरा नाम लिखें।");

    const subDate = submissionDateInput.value;
    if (!subDate) flagError("submissionDate", "कृपया दिनांक चुनें।");

    const captchaVal = captchaInput.value.trim();
    if (!/^\d{4}$/.test(captchaVal)) {
      flagError("captchaInput", "कृपया चित्र में दिख रहे 4 अंक दर्ज करें।");
    } else if (state.captchaId === "LOCAL" && captchaVal !== state.localCaptchaAnswer) {
      flagError("captchaInput", "कैप्चा कोड मेल नहीं खा रहा है, कृपया पुनः प्रयास करें।");
    }

    if (firstErrorEl) {
      firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
      if (typeof firstErrorEl.focus === "function") {
        firstErrorEl.focus({ preventScroll: true });
      }
      return false;
    }
    return true;
  }

  function buildPayload() {
    const selectedPatras = getSelectedPatraList();
    return {
      website_hp: document.getElementById("website_hp").value,
      formDurationMs: Date.now() - state.formLoadedAt,
      captchaId: state.captchaId,
      captchaAnswer: captchaInput.value.trim(),

      rulesAgreed: document.getElementById("rulesAgreed").checked ? "हाँ (सहमत)" : "नहीं",
      abhishekPoojan: (document.querySelector('input[name="abhishekPoojan"]:checked') || {}).value || "",
      swadhyay: (document.querySelector('input[name="swadhyay"]:checked') || {}).value || "",
      pratimaCount: document.getElementById("pratimaCount").value,
      previousPanchkalyanak: document.getElementById("previousPanchkalyanak").value.trim() || "नहीं / उल्लेख नहीं",
      otherSpecialRules: document.getElementById("otherSpecialRules").value.trim() || "कोई विशेष नियम नहीं",

      selectedPatras,
      applicantName: document.getElementById("applicantName").value.trim(),
      spouseName: document.getElementById("spouseName").value.trim() || "-",
      mobileNumber: document.getElementById("mobileNumber").value.trim(),
      age: document.getElementById("age").value.trim(),
      occupation: document.getElementById("occupation").value.trim(),
      address: document.getElementById("address").value.trim(),
      desiredRole1: desiredRole1.value,
      desiredRole2: desiredRole2.value || "-",
      donationAmount: Number(donationAmountInput.value),
      donationAmountWords: donationWordsInput.value.trim(),
      signature: document.getElementById("signature").value.trim(),
      submissionDate: submissionDateInput.value
    };
  }

  function setSubmitting(isLoading) {
    submitBtn.disabled = isLoading;
    const spinner = submitBtn.querySelector(".btn-spinner");
    const btnText = submitBtn.querySelector(".btn-text");
    if (isLoading) {
      spinner.classList.remove("hidden");
      btnText.textContent = "सबमिट हो रहा है, कृपया प्रतीक्षा करें...";
    } else {
      spinner.classList.add("hidden");
      btnText.textContent = "आवेदन फार्म सबमिट करें";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = buildPayload();

    // Instant client-side honeypot block
    if (payload.website_hp) {
      showGlobalError("अमान्य अनुरोध अस्वीकार कर दिया गया।");
      return;
    }

    setSubmitting(true);

    try {
      let result;

      if (isGasHost) {
        result = await new Promise((resolve, reject) => {
          google.script.run
            .withSuccessHandler(resolve)
            .withFailureHandler(reject)
            .submitFormFromHost(payload);
        });
      } else if (appsScriptUrl) {
        const resp = await fetch(appsScriptUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        });
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
        }
        result = await resp.json();
      } else {
        // Demo Mode
        await new Promise((r) => setTimeout(r, 650));
        const rand = Math.floor(1000 + Math.random() * 9000);
        result = {
          success: true,
          demoMode: true,
          referenceId: `PK-2026-DEMO-${rand}`
        };
      }

      if (!result || !result.success) {
        const errMsg = (result && result.message) || "सबमिट करने में त्रुटि आई। कृपया पुनः प्रयास करें।";
        showGlobalError(errMsg);
        if (result && result.captchaInvalid) {
          captchaInput.value = "";
          loadCaptcha();
        }
        return;
      }

      showReceipt(payload, result);
    } catch (err) {
      console.error("Submission error:", err);
      showGlobalError(
        "सर्वर से संपर्क करने में समस्या आई। कृपया अपना इंटरनेट कनेक्शन जांचें या थोड़ी देर बाद पुनः प्रयास करें।"
      );
    } finally {
      setSubmitting(false);
    }
  }

  function showGlobalError(msg) {
    formGlobalError.textContent = msg;
    formGlobalError.classList.remove("hidden");
    formGlobalError.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = String(text || "");
    return div.innerHTML;
  }

  function showReceipt(payload, result) {
    formContainer.classList.add("hidden");
    receiptView.classList.remove("hidden");
    receiptRefId.textContent = result.referenceId || "PK-2026";
    receiptDemoNotice.classList.toggle("hidden", !result.demoMode);

    const patraText = payload.selectedPatras.length
      ? payload.selectedPatras
          .map((p) => {
            const extra = [];
            if (p.amount) extra.push(`₹${formatINR(p.amount)}`);
            if (p.note) extra.push(p.note);
            return `(${p.id}) ${p.title}${extra.length ? ` [${extra.join(" | ")}]` : ""}`;
          })
          .join("<br />")
      : "केवल मुख्य पद प्राथमिकता चयनित";

    receiptSummary.innerHTML = `
      <table class="receipt-table">
        <tr><th>आवेदक का नाम</th><td>${escapeHtml(payload.applicantName)}</td></tr>
        <tr><th>पत्नि / अभिभावक का नाम</th><td>${escapeHtml(payload.spouseName)}</td></tr>
        <tr><th>मोबाइल नंबर</th><td>${escapeHtml(payload.mobileNumber)}</td></tr>
        <tr><th>आयु / व्यवसाय</th><td>${escapeHtml(payload.age)} वर्ष | ${escapeHtml(payload.occupation)}</td></tr>
        <tr><th>निवास</th><td>${escapeHtml(payload.address)}</td></tr>
        <tr><th>मुख्य पद प्राथमिकता (1)</th><td>${escapeHtml(payload.desiredRole1)}</td></tr>
        <tr><th>द्वितीय विकल्प (2)</th><td>${escapeHtml(payload.desiredRole2)}</td></tr>
        <tr><th>चयनित विशिष्ट पात्र</th><td>${patraText}</td></tr>
        <tr><th>न्यौछावर / दान राशि</th><td><strong>₹ ${formatINR(payload.donationAmount)}</strong> (${escapeHtml(payload.donationAmountWords)})</td></tr>
        <tr><th>दैनिक नियम</th><td>अभिषेक/पूजन: ${escapeHtml(payload.abhishekPoojan)} | स्वाध्याय: ${escapeHtml(payload.swadhyay)} | प्रतिमा: ${escapeHtml(payload.pratimaCount)}</td></tr>
        <tr><th>हस्ताक्षर एवं दिनांक</th><td>${escapeHtml(payload.signature)} (${escapeHtml(payload.submissionDate)})</td></tr>
      </table>
    `;

    receiptView.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetFormForNewEntry() {
    form.reset();
    document.querySelectorAll(".patra-row.selected").forEach((el) => el.classList.remove("selected"));
    state.userEditedRole1 = false;
    state.userEditedRole2 = false;
    state.userEditedAmount = false;
    state.userEditedWords = false;
    state.formLoadedAt = Date.now();
    setDefaultDate();
    updatePatraSummary();
    clearAllErrors();
    receiptView.classList.add("hidden");
    formContainer.classList.remove("hidden");
    loadCaptcha();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Expose helper for automated tests if needed
  window.__PANCHKALYANAK_UTILS__ = { numberToHindiWords, formatINR, PATRA_ITEMS };

  init();
})();
