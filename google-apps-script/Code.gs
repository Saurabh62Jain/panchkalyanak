/**
 * श्री मज्जिनेन्द्र पंचकल्याणक प्रतिष्ठा महोत्सव (बीना, म.प्र. | 10-16 दिसंबर 2026)
 * विशिष्ट पात्रता ऑनलाइन फॉर्म - Google Apps Script Backend
 *
 * कार्य:
 * 1. सर्वर-साइड SVG CAPTCHA बनाना व सत्यापित करना (बॉट/स्पैम रोकने हेतु)
 * 2. सभी फ़ॉर्म फ़ील्ड्स को Google Sheet ("Panchkalyanak_Entries") में सुरक्षित रिकॉर्ड करना
 * 3. सभी फ़ील्ड्स का सुंदर ईमेल 1001anujjain@gmail.com पर भेजना
 * 4. Gmail में "panchkalyanak" फ़ोल्डर (Label) बनाकर ईमेल को उसके भीतर एकत्रित करना
 */

var CONFIG = {
  RECIPIENT_EMAIL: "1001anujjain@gmail.com",
  GMAIL_LABEL_NAME: "panchkalyanak",
  SHEET_NAME: "Panchkalyanak_Entries",
  FALLBACK_SPREADSHEET_NAME: "Panchkalyanak_Vishishta_Patrata_Records",
  // यदि आप चाहते हैं कि ईमेल केवल 'panchkalyanak' फ़ोल्डर में दिखे और मुख्य Inbox में न आए, तो इसे true करें:
  ARCHIVE_FROM_INBOX: false,
  MIN_FORM_TIME_MS: 2000,
  CAPTCHA_TTL_SECONDS: 900 // 15 मिनट
};

var HEADERS = [
  "क्र.सं. / Reference ID",
  "सबमिट समय (IST)",
  "नाम",
  "पत्नि / अभिभावक का नाम",
  "मोबाइल नंबर",
  "आयु",
  "नौकरी / व्यवसाय",
  "निवास (पूरा पता)",
  "वांछित पद - 1 (प्राथमिकता)",
  "वांछित पद - 2 (विकल्प)",
  "कुल न्यौछावर / दान राशि (₹)",
  "राशि शब्दों में",
  "चयनित विशिष्ट पात्र एवं राशि विवरण",
  "दैनिक अभिषेक/पूजन",
  "स्वाध्याय",
  "प्रतिमा संख्या",
  "पूर्व पंचकल्याणक/विधान पद",
  "अन्य विशेष नियम",
  "नियमावली सहमति",
  "हस्ताक्षर",
  "आवेदन दिनांक",
  "Gmail Label स्थिति"
];

/**
 * पहली बार अनुमतियाँ (Sheet + Gmail) देने और शीट/फ़ोल्डर तैयार करने हेतु
 * Apps Script Editor में इस फ़ंक्शन को एक बार Run करें।
 */
function setupProject() {
  var sheet = getOrCreateSheet_();
  var label = getOrCreateGmailLabel_();
  Logger.log("Setup Successful! Sheet URL: " + sheet.getParent().getUrl());
  Logger.log("Gmail Label ready: " + label.getName());
}

/**
 * GET Requests:
 * - ?action=captcha -> नया SVG CAPTCHA देता है
 * - सामान्य खोलने पर -> यदि Index.html जुड़ा है तो पूरा ऑनलाइन फॉर्म दिखाता है
 */
function doGet(e) {
  var action = e && e.parameter && e.parameter.action ? e.parameter.action : "";

  if (action === "captcha") {
    var challenge = getCaptchaChallenge();
    return jsonOutput_(challenge);
  }

  try {
    return HtmlService.createHtmlOutputFromFile("Index")
      .setTitle("विशिष्ट पात्रता फार्म | श्री मज्जिनेन्द्र पंचकल्याणक प्रतिष्ठा महोत्सव")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag("viewport", "width=device-width, initial-scale=1");
  } catch (err) {
    return jsonOutput_({
      success: true,
      service: "Panchkalyanak Vishishta Patrata API",
      recipient: CONFIG.RECIPIENT_EMAIL,
      gmailFolder: CONFIG.GMAIL_LABEL_NAME
    });
  }
}

/**
 * POST Requests (External Website जैसे Netlify / GitHub Pages से सबमिट होने पर)
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOutput_({ success: false, message: "खाली अनुरोध प्राप्त हुआ।" });
    }
    var payload = JSON.parse(e.postData.contents);
    var result = processSubmission_(payload);
    return jsonOutput_(result);
  } catch (err) {
    Logger.log("doPost Error: " + err);
    return jsonOutput_({
      success: false,
      message: "सर्वर त्रुटि: " + (err.message || err.toString())
    });
  }
}

/**
 * यदि फॉर्म Google Apps Script के भीतर (Index.html) से सीधे सबमिट हो
 */
function submitFormFromHost(payload) {
  return processSubmission_(payload);
}

/**
 * मुख्य सबमिशन प्रोसेसिंग (Validation + CAPTCHA + Sheet + Gmail + Label)
 */
function processSubmission_(payload) {
  if (!payload || typeof payload !== "object") {
    return { success: false, message: "अमान्य डेटा प्राप्त हुआ।" };
  }

  // 1. Honeypot Bot Check
  if (payload.website_hp && String(payload.website_hp).trim() !== "") {
    return { success: false, message: "अमान्य स्वचालित अनुरोध अस्वीकार किया गया।" };
  }

  // 2. Timing Check (Instant script submission prevention)
  var durationMs = Number(payload.formDurationMs);
  if (isNaN(durationMs) || durationMs < CONFIG.MIN_FORM_TIME_MS) {
    return {
      success: false,
      message: "फ़ॉर्म बहुत तेज़ी से सबमिट किया गया है। कृपया सभी जानकारी जांचकर पुनः सबमिट करें।"
    };
  }

  // 3. Server-side Single-Use CAPTCHA Verification
  var captchaCheck = verifyCaptcha_(payload.captchaId, payload.captchaAnswer);
  if (!captchaCheck.valid) {
    return {
      success: false,
      captchaInvalid: true,
      message: captchaCheck.message
    };
  }

  // 4. Required Fields Validation
  var name = sanitizeText_(payload.applicantName);
  var mobile = sanitizeText_(payload.mobileNumber);
  if (!name || !/^[6-9]\d{9}$/.test(mobile)) {
    return {
      success: false,
      message: "कृपया सही नाम और 10 अंकों का वैध मोबाइल नंबर दर्ज करें।"
    };
  }

  // 5. Short duplicate-submission rate limit per mobile (20 seconds)
  var cache = CacheService.getScriptCache();
  var rlKey = "RL_" + mobile;
  if (cache.get(rlKey)) {
    return {
      success: false,
      message: "इस मोबाइल नंबर से अभी-अभी एक आवेदन प्राप्त हुआ है। कृपया 20 सेकंड बाद पुनः प्रयास करें।"
    };
  }
  cache.put(rlKey, "1", 20);

  // 6. Prepare Record Data
  var now = new Date();
  var istTimestamp = Utilities.formatDate(now, "Asia/Kolkata", "dd/MM/yyyy hh:mm:ss a");
  var refId = generateRefId_();
  var patraSummary = formatSelectedPatras_(payload.selectedPatras);

  var lock = LockService.getScriptLock();
  lock.waitLock(15000);

  var sheetUrl = "";
  var rowIndex = 0;

  try {
    var sheet = getOrCreateSheet_();
    sheetUrl = sheet.getParent().getUrl();

    var rowData = [
      refId,
      istTimestamp,
      name,
      sanitizeText_(payload.spouseName) || "-",
      mobile,
      sanitizeText_(payload.age),
      sanitizeText_(payload.occupation),
      sanitizeText_(payload.address),
      sanitizeText_(payload.desiredRole1),
      sanitizeText_(payload.desiredRole2) || "-",
      Number(payload.donationAmount || 0),
      sanitizeText_(payload.donationAmountWords),
      patraSummary,
      sanitizeText_(payload.abhishekPoojan),
      sanitizeText_(payload.swadhyay),
      sanitizeText_(payload.pratimaCount),
      sanitizeText_(payload.previousPanchkalyanak) || "-",
      sanitizeText_(payload.otherSpecialRules) || "-",
      sanitizeText_(payload.rulesAgreed) || "हाँ",
      sanitizeText_(payload.signature),
      sanitizeText_(payload.submissionDate),
      "प्रक्रियाधीन"
    ];

    sheet.appendRow(rowData);
    rowIndex = sheet.getLastRow();
  } finally {
    lock.releaseLock();
  }

  // 7. Send Notification Email & Apply 'panchkalyanak' Gmail Label
  var labelStatus = sendEmailAndApplyLabel_(refId, istTimestamp, payload, patraSummary, sheetUrl);

  if (rowIndex > 1) {
    try {
      getOrCreateSheet_().getRange(rowIndex, 22).setValue(labelStatus);
    } catch (ignore) {}
  }

  return {
    success: true,
    referenceId: refId,
    timestamp: istTimestamp,
    gmailStatus: labelStatus,
    message: "आवेदन सफलतापूर्वक दर्ज हो गया है।"
  };
}

/**
 * Google Sheet प्राप्त करें या नया बनाएं
 */
function getOrCreateSheet_() {
  var ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    ss = null;
  }

  if (!ss) {
    var props = PropertiesService.getScriptProperties();
    var savedId = props.getProperty("SPREADSHEET_ID");
    if (savedId) {
      try {
        ss = SpreadsheetApp.openById(savedId);
      } catch (e) {
        ss = null;
      }
    }
    if (!ss) {
      ss = SpreadsheetApp.create(CONFIG.FALLBACK_SPREADSHEET_NAME);
      props.setProperty("SPREADSHEET_ID", ss.getId());
    }
  }

  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }

  // यदि पहली पंक्ति खाली है तो हेडर जोड़ें और स्टाइल करें
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange
      .setBackground("#8b1e1e")
      .setFontColor("#ffffff")
      .setFontWeight("bold")
      .setWrap(true)
      .setVerticalAlignment("middle");
    sheet.setRowHeight(1, 36);
    sheet.setFrozenRows(1);

    // कॉलम चौड़ाई व्यवस्थित करें
    var widths = [140, 165, 160, 160, 120, 70, 150, 240, 200, 180, 130, 210, 300, 120, 110, 130, 200, 200, 120, 150, 110, 150];
    for (var i = 0; i < widths.length; i++) {
      sheet.setColumnWidth(i + 1, widths[i]);
    }
  }

  return sheet;
}

/**
 * Gmail में 'panchkalyanak' फ़ोल्डर (Label) बनाएं या प्राप्त करें
 */
function getOrCreateGmailLabel_() {
  var label = GmailApp.getUserLabelByName(CONFIG.GMAIL_LABEL_NAME);
  if (label) return label;

  var allLabels = GmailApp.getUserLabels();
  var targetLower = CONFIG.GMAIL_LABEL_NAME.toLowerCase();
  for (var i = 0; i < allLabels.length; i++) {
    if (allLabels[i].getName().toLowerCase() === targetLower) {
      return allLabels[i];
    }
  }

  return GmailApp.createLabel(CONFIG.GMAIL_LABEL_NAME);
}

/**
 * 1001anujjain@gmail.com पर ईमेल भेजें और 'panchkalyanak' फ़ोल्डर में लेबल करें
 */
function sendEmailAndApplyLabel_(refId, istTimestamp, payload, patraSummary, sheetUrl) {
  var name = sanitizeText_(payload.applicantName);
  var subject = "[Panchkalyanak] [" + refId + "] विशिष्ट पात्रता आवेदन - " + name + " (" + sanitizeText_(payload.mobileNumber) + ")";

  var htmlBody = buildEmailHtml_(refId, istTimestamp, payload, patraSummary, sheetUrl);
  var plainBody =
    "श्री मज्जिनेन्द्र पंचकल्याणक प्रतिष्ठा महोत्सव - विशिष्ट पात्रता आवेदन\n" +
    "Reference ID: " + refId + "\n" +
    "समय: " + istTimestamp + "\n\n" +
    "नाम: " + name + "\n" +
    "पत्नि/अभिभावक: " + (sanitizeText_(payload.spouseName) || "-") + "\n" +
    "मोबाइल: " + sanitizeText_(payload.mobileNumber) + "\n" +
    "आयु: " + sanitizeText_(payload.age) + "\n" +
    "नौकरी/व्यवसाय: " + sanitizeText_(payload.occupation) + "\n" +
    "निवास: " + sanitizeText_(payload.address) + "\n" +
    "पद प्राथमिकता 1: " + sanitizeText_(payload.desiredRole1) + "\n" +
    "पद प्राथमिकता 2: " + (sanitizeText_(payload.desiredRole2) || "-") + "\n" +
    "राशि: ₹" + Number(payload.donationAmount || 0) + " (" + sanitizeText_(payload.donationAmountWords) + ")\n" +
    "चयनित विशिष्ट पात्र:\n" + patraSummary + "\n\n" +
    "अभिषेक/पूजन: " + sanitizeText_(payload.abhishekPoojan) + "\n" +
    "स्वाध्याय: " + sanitizeText_(payload.swadhyay) + "\n" +
    "प्रतिमा: " + sanitizeText_(payload.pratimaCount) + "\n" +
    "पूर्व पद: " + (sanitizeText_(payload.previousPanchkalyanak) || "-") + "\n" +
    "विशेष नियम: " + (sanitizeText_(payload.otherSpecialRules) || "-") + "\n" +
    "हस्ताक्षर: " + sanitizeText_(payload.signature) + " (" + sanitizeText_(payload.submissionDate) + ")\n\n" +
    "Google Sheet: " + sheetUrl;

  GmailApp.sendEmail(CONFIG.RECIPIENT_EMAIL, subject, plainBody, {
    htmlBody: htmlBody,
    name: "Panchkalyanak Form Portal"
  });

  // ईमेल को तुरंत 'panchkalyanak' फ़ोल्डर (Label) में टैग करें
  try {
    var label = getOrCreateGmailLabel_();
    var labeledCurrent = false;

    for (var attempt = 0; attempt < 2; attempt++) {
      Utilities.sleep(1300);
      var threads = GmailApp.search('subject:"' + refId + '"');
      if (threads && threads.length > 0) {
        for (var t = 0; t < threads.length; t++) {
          threads[t].addLabel(label);
          if (CONFIG.ARCHIVE_FROM_INBOX) {
            threads[t].moveToArchive();
          }
        }
        labeledCurrent = true;
        break;
      }
    }

    // यदि पिछले किसी ईमेल पर लेबल बाकी रह गया हो तो उसे भी लेबल करें
    labelPendingPanchkalyanakEmails();

    return labeledCurrent ? "Sent & Labelled (" + label.getName() + ")" : "Sent (Pending Label Sync)";
  } catch (err) {
    Logger.log("Labeling warning: " + err);
    return "Sent (Label error: " + err.message + ")";
  }
}

/**
 * किसी भी छूटे हुए [Panchkalyanak] ईमेल को 'panchkalyanak' फ़ोल्डर में मूव/लेबल करने हेतु
 */
function labelPendingPanchkalyanakEmails() {
  var label = getOrCreateGmailLabel_();
  var pending = GmailApp.search('subject:"[Panchkalyanak]" -label:"' + label.getName() + '"', 0, 20);
  for (var i = 0; i < pending.length; i++) {
    pending[i].addLabel(label);
    if (CONFIG.ARCHIVE_FROM_INBOX) {
      pending[i].moveToArchive();
    }
  }
}

function buildEmailHtml_(refId, istTimestamp, payload, patraSummary, sheetUrl) {
  var patraHtml = escapeHtml_(patraSummary).replace(/\n/g, "<br/>");
  return (
    '<div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; border: 2px solid #8b1e1e; border-radius: 10px; overflow: hidden;">' +
      '<div style="background: #8b1e1e; color: #ffffff; padding: 16px 20px; text-align: center;">' +
        '<div style="font-size: 12px; opacity: 0.9;">॥ श्री आदिनाथाय नमः ॥ श्री विद्यासागराय नमः ॥ श्री महावीराय नमः ॥</div>' +
        '<h2 style="margin: 6px 0 4px; font-size: 20px;">श्री मज्जिनेन्द्र पंचकल्याणक प्रतिष्ठा महोत्सव</h2>' +
        '<div style="font-size: 14px;">विशिष्ट पात्रता ऑनलाइन आवेदन | श्रुततीर्थ – श्रुतधाम, बीना (म.प्र.)</div>' +
      '</div>' +
      '<div style="padding: 18px 20px; background: #fffdf8;">' +
        '<p style="margin: 0 0 12px; font-size: 14px; background: #fef3c7; padding: 8px 12px; border-left: 4px solid #d97706;">' +
          '<strong>संदर्भ क्रमांक (Ref ID):</strong> ' + escapeHtml_(refId) + ' &nbsp;|&nbsp; <strong>समय:</strong> ' + escapeHtml_(istTimestamp) +
        '</p>' +
        '<h3 style="color: #631111; border-bottom: 1px solid #e5d5b5; padding-bottom: 6px;">1. पात्र परिचय</h3>' +
        '<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 16px;">' +
          emailRow_("नाम", payload.applicantName) +
          emailRow_("पत्नि / अभिभावक का नाम", payload.spouseName || "-") +
          emailRow_("मोबाइल नंबर", payload.mobileNumber) +
          emailRow_("आयु", payload.age + " वर्ष") +
          emailRow_("नौकरी / व्यवसाय", payload.occupation) +
          emailRow_("निवास", payload.address) +
          emailRow_("पद प्राथमिकता (1)", payload.desiredRole1) +
          emailRow_("द्वितीय विकल्प (2)", payload.desiredRole2 || "-") +
          emailRow_("न्यौछावर / दान राशि", "₹ " + Number(payload.donationAmount || 0).toLocaleString("en-IN") + " (" + (payload.donationAmountWords || "") + ")") +
          emailRow_("हस्ताक्षर एवं दिनांक", (payload.signature || "") + " (" + (payload.submissionDate || "") + ")") +
        '</table>' +
        '<h3 style="color: #631111; border-bottom: 1px solid #e5d5b5; padding-bottom: 6px;">2. चयनित विशिष्ट पात्र एवं राशि विवरण</h3>' +
        '<div style="background: #ffffff; border: 1px solid #e5d5b5; padding: 10px 12px; border-radius: 6px; font-size: 14px; margin-bottom: 16px;">' +
          patraHtml +
        '</div>' +
        '<h3 style="color: #631111; border-bottom: 1px solid #e5d5b5; padding-bottom: 6px;">3. नियमावली एवं स्वेच्छिक नियम</h3>' +
        '<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 16px;">' +
          emailRow_("नियमावली सहमति", payload.rulesAgreed) +
          emailRow_("प्रतिदिन अभिषेक, पूजन", payload.abhishekPoojan) +
          emailRow_("स्वाध्याय", payload.swadhyay) +
          emailRow_("प्रतिमाधारी विवरण", payload.pratimaCount) +
          emailRow_("पूर्व पंचकल्याणक/विधान पद", payload.previousPanchkalyanak || "-") +
          emailRow_("अन्य विशेष नियम", payload.otherSpecialRules || "-") +
        '</table>' +
        (sheetUrl
          ? '<p style="text-align: center; margin: 16px 0 4px;"><a href="' + sheetUrl + '" style="display: inline-block; background: #8b1e1e; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: bold;">Google Sheet में पूरा रिकॉर्ड देखें</a></p>'
          : "") +
      '</div>' +
    '</div>'
  );
}

function emailRow_(label, value) {
  return (
    '<tr>' +
      '<td style="padding: 7px 10px; border-bottom: 1px solid #efe4cf; width: 38%; font-weight: bold; color: #572121; vertical-align: top;">' + escapeHtml_(label) + '</td>' +
      '<td style="padding: 7px 10px; border-bottom: 1px solid #efe4cf; color: #1f2937; vertical-align: top;">' + escapeHtml_(value) + '</td>' +
    '</tr>'
  );
}

// ==========================================
// Server-Side Vector SVG CAPTCHA Engine
// ==========================================

var DIGIT_PATHS = {
  "0": "M10 3 C4 3 3 9 3 15 C3 21 4 27 10 27 C16 27 17 21 17 15 C17 9 16 3 10 3 Z",
  "1": "M6 7 L11 3 L11 27 M5 27 L16 27",
  "2": "M4 8 C4 3 16 3 16 9 C16 15 4 21 4 27 L17 27",
  "3": "M4 6 C7 2 16 3 16 9 C16 13 11 14 8 14 C12 14 17 16 17 21 C17 27 6 28 3 24",
  "4": "M13 27 L13 3 L3 19 L17 19",
  "5": "M16 3 L5 3 L4 14 C7 11 17 12 17 20 C17 27 6 28 3 24",
  "6": "M15 4 C9 2 4 8 4 17 C4 25 7 27 11 27 C15 27 17 23 17 19 C17 14 13 13 10 13 C7 13 4 15 4 19",
  "7": "M3 4 L17 4 L7 27",
  "8": "M10 14 C5 14 4 10 4 7 C4 4 7 3 10 3 C13 3 16 4 16 7 C16 10 15 14 10 14 Z M10 14 C4 14 3 19 3 22 C3 26 6 27 10 27 C14 27 17 26 17 22 C17 19 16 14 10 14 Z",
  "9": "M16 13 C16 16 13 18 10 18 C6 18 3 15 3 10 C3 5 6 3 10 3 C15 3 17 8 17 15 C17 23 12 28 5 26"
};

/**
 * नया 4-अंकीय वेक्टर SVG कैप्चा बनाता है और उत्तर को सर्वर Cache में सुरक्षित रखता है
 */
function getCaptchaChallenge() {
  var code = String(Math.floor(1000 + Math.random() * 9000));
  var challengeId = Utilities.getUuid();
  CacheService.getScriptCache().put("CAPTCHA_" + challengeId, code, CONFIG.CAPTCHA_TTL_SECONDS);

  var svg = buildCaptchaSvg_(code);
  return {
    success: true,
    challengeId: challengeId,
    svg: svg
  };
}

function buildCaptchaSvg_(code) {
  var colors = ["#7c1d1d", "#9a3412", "#631111", "#854d0e"];
  var noise = "";

  for (var i = 0; i < 5; i++) {
    var y1 = Math.floor(Math.random() * 64);
    var y2 = Math.floor(Math.random() * 64);
    var cy = Math.floor(Math.random() * 64);
    var strokeColor = i % 2 === 0 ? "rgba(139,30,30,0.28)" : "rgba(217,119,6,0.35)";
    noise += '<path d="M0 ' + y1 + " Q 92 " + cy + ", 185 " + y2 + '" fill="none" stroke="' + strokeColor + '" stroke-width="1.6" />';
  }

  for (var d = 0; d < 18; d++) {
    var cx = Math.floor(Math.random() * 185);
    var cyDot = Math.floor(Math.random() * 64);
    noise += '<circle cx="' + cx + '" cy="' + cyDot + '" r="1.4" fill="rgba(120,53,15,0.25)" />';
  }

  var digitsMarkup = "";
  for (var idx = 0; idx < code.length; idx++) {
    var ch = code.charAt(idx);
    var pathD = DIGIT_PATHS[ch];
    var tx = 22 + idx * 38 + Math.floor(Math.random() * 6 - 3);
    var ty = 17 + Math.floor(Math.random() * 6 - 3);
    var rot = Math.floor(Math.random() * 28 - 14);
    var color = colors[idx % colors.length];

    digitsMarkup +=
      '<g transform="translate(' + tx + "," + ty + ") rotate(" + rot + ',10,15)">' +
        '<path d="' + pathD + '" fill="none" stroke="' + color + '" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />' +
      "</g>";
  }

  return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 185 64" width="185" height="64">' +
      '<rect width="185" height="64" fill="#fffaf0" />' +
      noise +
      digitsMarkup +
    "</svg>"
  );
}

function verifyCaptcha_(challengeId, userAnswer) {
  if (!challengeId || challengeId === "LOCAL") {
    return {
      valid: false,
      message: "सुरक्षा टोकन अमान्य है। कृपया पेज रिफ्रेश करके पुनः प्रयास करें।"
    };
  }

  var key = "CAPTCHA_" + challengeId;
  var cache = CacheService.getScriptCache();
  var expected = cache.get(key);
  cache.remove(key); // Single-use: उपयोग होते ही हटाएं

  if (!expected) {
    return {
      valid: false,
      message: "कैप्चा कोड की समय-सीमा समाप्त हो गई है। कृपया नया कोड डालें।"
    };
  }

  if (String(userAnswer || "").trim() !== expected) {
    return {
      valid: false,
      message: "कैप्चा कोड गलत है। कृपया चित्र में दिख रहे 4 अंक सही से दर्ज करें।"
    };
  }

  return { valid: true };
}

// ==========================================
// Helper Utilities & Testing
// ==========================================

function formatSelectedPatras_(selectedPatras) {
  if (!selectedPatras || !selectedPatras.length) {
    return "केवल मुख्य पद प्राथमिकता चयनित";
  }
  var lines = [];
  for (var i = 0; i < selectedPatras.length; i++) {
    var p = selectedPatras[i];
    var parts = ["(" + p.id + ") " + sanitizeText_(p.title)];
    if (p.amount && Number(p.amount) > 0) {
      parts.push("₹" + Number(p.amount).toLocaleString("en-IN"));
    }
    if (p.note) {
      parts.push(sanitizeText_(p.note));
    }
    lines.push(parts.join(" — "));
  }
  return lines.join("\n");
}

function generateRefId_() {
  var randomPart = Math.floor(1000 + Math.random() * 9000);
  var timePart = Utilities.formatDate(new Date(), "Asia/Kolkata", "MMddHHmm");
  return "PK-2026-" + timePart + "-" + randomPart;
}

function sanitizeText_(val) {
  if (val === null || val === undefined) return "";
  return String(val).replace(/[<>]/g, "").trim();
}

function escapeHtml_(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Apps Script Editor से सीधे टेस्ट करने हेतु (Google Sheet व Gmail टेस्ट एंट्री जांचने के लिए)
 */
function testSubmission() {
  var challenge = getCaptchaChallenge();
  var cache = CacheService.getScriptCache();
  // टेस्ट के लिए कैप्चा कोड को सीधे रीप्लेस कर टेस्ट कर रहे हैं
  cache.put("CAPTCHA_" + challenge.challengeId, "1234", 60);

  var samplePayload = {
    website_hp: "",
    formDurationMs: 12000,
    captchaId: challenge.challengeId,
    captchaAnswer: "1234",
    rulesAgreed: "हाँ (सहमत)",
    abhishekPoojan: "हाँ",
    swadhyay: "हाँ",
    pratimaCount: "2 प्रतिमा",
    previousPanchkalyanak: "बीना महोत्सव में पात्र अनुभव",
    otherSpecialRules: "रात्रि भोजन त्याग",
    selectedPatras: [
      { id: 14, title: "ब्रह्म इन्द्र", amount: 151000, note: "टेस्ट आवेदक" }
    ],
    applicantName: "श्री अनुज जैन (टेस्ट एंट्री)",
    spouseName: "श्रीमती जैन",
    mobileNumber: "9876543210",
    age: "38",
    occupation: "व्यवसाय",
    address: "श्रुतधाम कॉलोनी, बीना (म.प्र.)",
    desiredRole1: "(14) ब्रह्म इन्द्र",
    desiredRole2: "(22) महामंडलेश्वर ( 4 )",
    donationAmount: 151000,
    donationAmountWords: "एक लाख इक्यावन हजार रुपये मात्र",
    signature: "अनुज जैन",
    submissionDate: "2026-11-11"
  };

  var res = processSubmission_(samplePayload);
  Logger.log(JSON.stringify(res, null, 2));
}
