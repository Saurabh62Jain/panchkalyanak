# श्री मज्जिनेन्द्र पंचकल्याणक प्रतिष्ठा महोत्सव — ऑनलाइन फॉर्म सेटअप गाइड

यह ऑनलाइन फॉर्म आपकी **Gmail ID (`1001anujjain@gmail.com`)** के **`panchkalyanak` फ़ोल्डर (Label)** और **Google Sheet** से सीधे जुड़ने के लिए तैयार किया गया है — **100% मुफ़्त**, बिना किसी मासिक सर्वर खर्च के, और **सर्वर-साइड CAPTCHA** सुरक्षा के साथ।

---

## प्रोजेक्ट फ़ाइलें
- `index.html`, `styles.css`, `app.js`, `config.js` — ऑनलाइन वेबसाइट फॉर्म (मोबाइल व कंप्यूटर दोनों के लिए उपयुक्त)।
- `google-apps-script/Code.gs` — Google Sheet रिकॉर्डिंग, ईमेल भेजने (`1001anujjain@gmail.com`), `panchkalyanak` फ़ोल्डर में मूव/लेबल करने और बॉट-रोधी CAPTCHA का बैकएंड कोड।
- `google-apps-script/Index.html` — यदि आप बिना किसी अलग वेबसाइट होस्टिंग के सीधे Google पर वेबसाइट चलाना चाहें, तो यह बंडल फ़ाइल तैयार है।

---

## चरण 1: Google Sheet और बैकएंड जोड़ना (केवल 3 मिनट)

1. ब्राउज़र में **Google Sheets** ([sheets.google.com](https://sheets.google.com)) खोलें — सुनिश्चित करें कि आप **`1001anujjain@gmail.com`** से लॉगिन हैं।
2. एक नया **Blank Spreadsheet** बनाएं और उसका नाम रखें: `Panchkalyanak_Vishishta_Patrata_Records`।
3. ऊपर मेन्यू में **Extensions (एक्सटेंशन) → Apps Script** पर क्लिक करें।
4. Apps Script एडिटर में पहले से मौजूद कोड को हटा दें और **`google-apps-script/Code.gs`** फ़ाइल का पूरा कोड कॉपी करके पेस्ट करें, फिर **Save (💾)** करें।

---

## चरण 2: पहली बार अनुमति दें (Sheet + Gmail `panchkalyanak` फ़ोल्डर)

1. Apps Script एडिटर में ऊपर फ़ंक्शन ड्रॉपडाउन से **`setupProject`** चुनें और **Run** पर क्लिक करें।
2. एक पॉपअप आएगा: **"Authorization required"** → **Review Permissions** → अपना खाता `1001anujjain@gmail.com` चुनें।
3. यदि "Google hasn't verified this app" दिखे तो **Advanced → Go to ... (unsafe) → Allow** पर क्लिक करें।
4. अब आपके Google Sheet में `Panchkalyanak_Entries` शीट सभी 22 कॉलम के साथ तैयार हो जाएगी और आपके Gmail में **`panchkalyanak`** नाम का फ़ोल्डर (Label) भी बन जाएगा!
   *(वैकल्पिक: आप `testSubmission` फ़ंक्शन चुनकर Run करके एक टेस्ट एंट्री भी तुरंत जांच सकते हैं।)*

---

## चरण 3: Web App के रूप में Deploy करें

अब इस बैकएंड को लाइव लिंक बनाने के लिए:
1. Apps Script एडिटर में ऊपर दाईं ओर **Deploy → New deployment** पर क्लिक करें।
2. **Select type (⚙️)** पर क्लिक कर **Web app** चुनें।
3. सेटिंग्स भरें:
   - **Description**: `Panchkalyanak Online Form`
   - **Execute as**: **Me (`1001anujjain@gmail.com`)**
   - **Who has access**: **Anyone** *(ज़रूरी है ताकि कोई भी श्रद्धालु बिना लॉगिन किए फॉर्म भर सके)*
4. **Deploy** दबाएं और मिलने वाला **Web app URL** (`https://script.google.com/macros/s/.../exec`) कॉपी कर लें।

---

## चरण 4: अपनी वेबसाइट लिंक पब्लिश करें (दो आसान विकल्प)

### विकल्प A — सुंदर कस्टम वेबसाइट लिंक (Netlify / GitHub Pages) *(अनुशंसित)*
1. **`config.js`** फ़ाइल खोलें और `APPS_SCRIPT_URL` के सामने अपना कॉपी किया हुआ URL पेस्ट करें:
   ```js
   APPS_SCRIPT_URL: "https://script.google.com/macros/s/यहाँ_अपना_URL_डालें/exec",
   ```
2. अब इस पूरे फ़ोल्डर (`index.html`, `styles.css`, `app.js`, `config.js`) को:
   - **[Netlify Drop](https://app.netlify.com/drop)** पर ड्रैग-एंड-ड्रॉप करें — **30 सेकंड में आपको पब्लिक वेबसाइट लिंक मिल जाएगी**, या
   - **GitHub Pages** / **Vercel** पर फ्री होस्ट कर दें।

### विकल्प B — बिना किसी बाहरी होस्टिंग के (सीधे Google Apps Script लिंक से)
1. चरण 1 वाले Apps Script प्रोजेक्ट में बाईं ओर **Files (+)** पर क्लिक करें → **HTML** चुनें → नाम ठीक **`Index`** रखें।
2. **`google-apps-script/Index.html`** फ़ाइल का पूरा कोड कॉपी करके वहाँ पेस्ट करें और Save करें।
3. **Deploy → Manage deployments → Edit (✏️) → Version: New version → Deploy** करें।
4. अब वही `https://script.google.com/macros/s/.../exec` लिंक सीधे पूरा ऑनलाइन फॉर्म खोल देगी!

---

## Gmail में `panchkalyanak` फ़ोल्डर सेटिंग्स (महत्वपूर्ण टिप)

- जब कोई व्यक्ति फॉर्म सबमिट करेगा:
  1. `Code.gs` सभी फ़ील्ड्स का पूरा विवरण `1001anujjain@gmail.com` पर भेजेगा।
  2. स्वतः ही उस ईमेल पर **`panchkalyanak`** लेबल (फ़ोल्डर) लग जाएगा।
- **यदि आप चाहते हैं कि ये ईमेल मुख्य Inbox में न दिखकर केवल `panchkalyanak` फ़ोल्डर में ही दिखें:**
  - `Code.gs` की लाइन 18 पर `ARCHIVE_FROM_INBOX: false` को बदलकर **`ARCHIVE_FROM_INBOX: true`** कर दें और नया deployment करें।
- **अतिरिक्त सुरक्षा बैकअप (Gmail Filter):**
  - Gmail Settings → Filters and Blocked Addresses → Create a new filter में:
    - **Subject**: `[Panchkalyanak]` डालें → **Create filter** → **Apply the label: `panchkalyanak`** चुनें। इससे हर ईमेल 0 सेकंड में स्वतः फ़ोल्डर में पहुँच जाएगा।

---

## स्पैम / रोबोट सुरक्षा (CAPTCHA विवरण)
- **सर्वर-साइड वेक्टर SVG CAPTCHA**: हर विज़िटर को एक 4-अंकीय डिस्टॉर्टेड वेक्टर चित्र दिखता है, जिसका उत्तर केवल सर्वर Cache में (15 मिनट के लिए, एक बार उपयोग हेतु) सुरक्षित रहता है — कोई भी बॉट HTML से कोड नहीं पढ़ सकता।
- **Honeypot + टाइमिंग जाँच**: छिपे हुए बॉट फ़ील्ड और 2 सेकंड से कम में सबमिट करने वाले स्वचालित स्क्रिप्ट स्वतः ब्लॉक हो जाते हैं।
- **डुप्लीकेट रोकथाम**: एक ही मोबाइल नंबर से लगातार 20 सेकंड के भीतर दोहरी सबमिशन रोकी जाती है।
