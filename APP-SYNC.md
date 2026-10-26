# Website → App sync log

New website changes made after the app copy was taken (26 October 2026).
When finished, copy this whole file into the mobile-app chat so the app gets the same changes.

Each entry lists: what changed, the files touched, and anything the app needs to do differently.

## Changes

### 1. MGNREGA renamed to VB—G RAM G (NREGA) + three new services (26 Oct 2026)

**What changed**
- The scheme name **मनरेगा / MGNREGA** is now **VB—G RAM G (NREGA)** everywhere (same text in Hindi and English): menu, home page (service card, button, stats, summary card), the NREGA page, complaint category, admin list, and all data (works, budget, schemes, notices, Gram Sabha, panchayat intro).
- Full name changed from "महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी योजना / Mahatma Gandhi National Rural Employment Guarantee Scheme" to **"विकसित भारत – रोज़गार और आजीविका गारंटी मिशन (ग्रामीण)" / "Viksit Bharat – Guarantee for Rozgar and Ajeevika Mission (Gramin)"**.
- The page address stays **/mgnrega** (only the visible name changed), so existing links keep working.
- The NREGA page now starts with an **"ऑनलाइन सेवाएँ / Online services"** section with three separate options:
  1. **कार्य के लिए आवेदन / Apply for work** → new page **/mgnrega/apply-work**. Form fields (all required): आवेदक का नाम, पिता का नाम, जॉब कार्ड नंबर, गाँव का नाम, मोबाइल नंबर.
  2. **नया जॉब कार्ड बनाने हेतु / Apply for a new job card** → new page **/mgnrega/new-job-card**. Form fields (all required): आवेदक का नाम, पिता / पति का नाम, आयु (18+), लिंग, गाँव का नाम, वार्ड, परिवार के वयस्क सदस्य (1–20), मोबाइल नंबर. No Aadhaar or bank details are asked.
  3. **मिसटोल** → new page **/mgnrega/mistol**. The label **मिसटोल** stays exactly the same in Hindi AND English mode (never "Muster Roll"). Shows each मिसटोल record (from `data/mgnrega-wages.json`): number, work, period, person-days, payment status, and reference number only when verified. Search by number, filter by work, and totals at the top. No worker names, Aadhaar or bank details.
- Both forms: inline Hindi/English error messages under each field, focus moves to the first error, mobile must be 10 digits starting 6–9, job card number format like `RJ-17-012-005-001/123`, a short "जमा हो रहा है…" state, then a **success popup** "आवेदन सफलतापूर्वक जमा हो गया" with the applicant's name and an "ठीक है" button (closes with OK, Esc or a tap outside; the form then resets). The popup also says the online application doesn't reach the Panchayat automatically yet. Frontend only: nothing is sent or stored.
- Every new page has a **"वापस VB—G RAM G (NREGA) पर" (Back) button** and a breadcrumb.
- The home page's "जॉब कार्ड हेतु पंजीकरण" button now opens **/mgnrega/new-job-card** (was /schemes/mgnrega-job-card).
- The wage table column "मस्टर रोल संदर्भ" is now **"मिसटोल नंबर" / "Mistol no."** for consistency.
- Desktop menu (1024–1279px) spacing tightened slightly so the longer name fits in English.

**Files**
- New: `lib/nrega.ts` (name constants `NREGA_NAME`, `MISTOL_LABEL`, form types, validation), `components/nrega/` (`NregaOptions`, `WorkApplicationForm`, `JobCardForm`, `MistolList`, `SuccessDialog`, `BackToNrega`, `useNregaForm`), `app/mgnrega/apply-work/page.tsx`, `app/mgnrega/new-job-card/page.tsx`, `app/mgnrega/mistol/page.tsx`.
- Changed: `lib/i18n/dictionary.ts` (renamed texts + new `nrega.*`, `nf.*`, `nerr.*`, `ns.*`, `mistol.*` keys), `app/mgnrega/page.tsx`, `components/home/MgnregaSummaryCard.tsx`, `components/layout/Header.tsx`, all `data/*.json` that mentioned MGNREGA.
- Tests: `tests/lib/nrega.test.ts`, `tests/components/nrega.test.tsx` (new); `tests/data/integrity.test.ts`, `tests/integration/pages.test.tsx`, `tests/integration/routes.ts`, `tests/components/header.test.tsx`, `tests/components/language.test.tsx` (updated). 200 tests pass; build makes 38 pages.

**Notes for the app**
- Add the three new routes to the app's navigation/back-button handling: `/mgnrega/apply-work/`, `/mgnrega/new-job-card/`, `/mgnrega/mistol/`. The Android back button on these pages should go back to `/mgnrega/`.
- The success popup and forms are plain web UI; they work in the WebView with no extra plugins. Check the keyboard doesn't cover the form fields or the popup on small phones.
- Mobile/age/adults inputs use `inputMode="numeric"` (number keyboard on phones).
- Keep the **मिसटोल** label unchanged in both languages in the app too.

### 2. Three new services at the start of नागरिक सेवाएँ (26 Oct 2026)

**What changed**
- The home page **नागरिक सेवाएँ** section now has 9 cards. The 3 new ones come first, in this order, then the existing 6 unchanged:
  1. **डिजिटल सिग्नेचर / Digital Signature** → **/services/digital-signature**
  2. **डिजिटल सेवाएँ / Digital Services** → **/services/digital-services**
  3. **आवासीय मकान पट्टा / Residential House Patta** → **/services/house-patta**
- The services grid is now 2 columns on phones and 3 columns from tablet up (was 6 in one row on large desktops).
- **डिजिटल सिग्नेचर** page shows three separate options, each with its own form page:
  - **NOC के लिए** → /services/digital-signature/noc (choice: भवन निर्माण / बिजली कनेक्शन / पानी कनेक्शन / अन्य)
  - **राशन कार्ड के लिए** → /services/digital-signature/ration-card (choice: नया राशन कार्ड / नाम जोड़ना / नाम हटाना / सुधार)
  - **लाइट फाइल के लिए** → /services/digital-signature/light-file (choice: घरेलू / कृषि / व्यावसायिक)
  - Each form (all required): आवेदक का नाम, पिता / पति का नाम, गाँव का नाम, वार्ड, मोबाइल नंबर, plus the choice above.
- **डिजिटल सेवाएँ** page lists 7 official portals as cards (icon, Hindi + English name, one-line description, "वेबसाइट खोलें"). Every card opens the site in a **new tab** (`target="_blank" rel="noopener noreferrer"`). Data lives in the new file `data/digital-services.json`:
  1. राज किसान — https://rajkisan.rajasthan.gov.in/
  2. अपना खाता — https://apnakhata.rajasthan.gov.in/
  3. VB—G RAM G (NREGA) — https://vbgramg.dord.gov.in/vbgramg/home.aspx
  4. आधार सेवाएँ (UIDAI) — https://uidai.gov.in/en
  5. भू-नक्शा — https://bhunaksha.rajasthan.gov.in/
  6. मतदाता सेवाएँ — https://voters.eci.gov.in/
  7. पहचान पोर्टल — https://xn--m1bet4hqd2b.xn--11b7cb3a6a.xn--h2brj9c/project/pehchan/
- **आवासीय मकान पट्टा** page: application form (all required): आवेदक का नाम, पिता / पति का नाम, गाँव का नाम, वार्ड, मोबाइल नंबर, मकान / भूखंड का स्थान, भूखंड का क्षेत्रफल (वर्ग फुट, 1–100000), कब से रह रहे हैं (वर्ष, 1900 to the current year). A side box lists the papers to keep ready.
- All new forms work like the NREGA forms: errors under each field, focus on the first error, 10-digit mobile check, then the same success popup ("आवेदन सफलतापूर्वक जमा हो गया" with the name and the service, plus the note that it doesn't reach the Panchayat automatically yet). Frontend only; nothing is sent or stored.
- Every new page has a Back button ("वापस नागरिक सेवाएँ पर" → `/#services`, or "वापस डिजिटल सिग्नेचर पर" on the three sub-forms) and a breadcrumb.
- Shared pieces moved/added: the success popup is now `components/forms/SuccessDialog.tsx` and the form helper `components/forms/useServiceForm.ts` (the NREGA forms use them too); new `components/ui/BackLink.tsx`.

**Files**
- New: `data/digital-services.json`, `lib/services.ts`, `components/services/` (`SignatureOptions`, `SignatureRequestPage`, `ServiceRequestForm`, `PersonFields`, `PattaForm`, `DigitalServicesList`), `components/ui/BackLink.tsx`, `app/services/digital-signature/page.tsx` (+ `noc/`, `ration-card/`, `light-file/`), `app/services/digital-services/page.tsx`, `app/services/house-patta/page.tsx`.
- Moved: `components/nrega/SuccessDialog.tsx` → `components/forms/SuccessDialog.tsx`; `components/nrega/useNregaForm.ts` → `components/forms/useServiceForm.ts` (renamed `useServiceForm`).
- Changed: `app/page.tsx` (services list + grid), `lib/data.ts` (`getDigitalServices`), `lib/types.ts` (`DigitalService`), `lib/i18n/dictionary.ts` (new `svc.*`, `ds.*`, `serr.*`, `patta.*`, `perr.*`, `dsv.*`, `ns.service`, `ns.patta` keys), `components/nrega/*` (use the shared form pieces).
- Tests: new `tests/lib/services.test.ts`, `tests/components/services.test.tsx`; updated `tests/integration/pages.test.tsx`, `tests/integration/routes.ts`, `tests/data/integrity.test.ts`. 221 tests pass; build makes 44 pages.

**Notes for the app**
- Add the 6 new routes to navigation/back-button handling: `/services/digital-signature/`, its three sub-pages, `/services/digital-services/`, `/services/house-patta/`. Back from a डिजिटल सिग्नेचर sub-form goes to `/services/digital-signature/`; back from the others goes to the home page services section.
- The 7 डिजिटल सेवाएँ links must open in the phone's browser, not inside the app (same handling as the scheme official links). The Pehchan link uses a .भारत domain written in punycode (`xn--…`); make sure the external-link handler accepts it.
- Number fields (mobile, area, year) use `inputMode="numeric"`.

### 3. Guidance instead of forms on the new services (26 Oct 2026)

Replaces the forms added in change 2. **डिजिटल सिग्नेचर (NOC / राशन कार्ड / लाइट फाइल) and आवासीय मकान पट्टा no longer have forms**; they show step-by-step guidance. डिजिटल सेवाएँ keeps its 7 links and gets a short "how to use" guide.

**What changed**
- The 4 pages `/services/digital-signature/noc`, `/ration-card`, `/light-file` and `/services/house-patta` now each show four cards (Hindi + English):
  1. **यह क्या है / What is it**: a short explanation.
  2. **ज़रूरी दस्तावेज़ / Documents needed**: bullet list of papers to bring.
  3. **आवेदन कैसे करें / How to apply**: numbered steps.
  4. **कहाँ जाएँ / Where to go**: Panchayat office, E-Mitra, electricity office, etc., plus the note "नियम और शुल्क समय-समय पर बदल सकते हैं। पक्की जानकारी के लिए ग्राम पंचायत कार्यालय से संपर्क करें।"
- The guidance text is in the new file **`data/service-guides.json`** (keys `noc`, `ration-card`, `light-file`, `house-patta`; each has `about/aboutEn`, `documents/documentsEn`, `steps/stepsEn`, `where/whereEn`). Copy this file to the app as-is.
- **/services/digital-services** now starts with a guide card **"इन वेबसाइटों का उपयोग कैसे करें"** (4 steps) and a safety note: "केवल सरकारी वेबसाइट पर ही जानकारी भरें। अपना OTP या पासवर्ड किसी को न बताएँ — सरकारी कर्मचारी कभी OTP नहीं माँगते।" The 7 link cards are unchanged.
- Descriptions reworded from "आवेदन" (apply) to guidance, e.g. home card आवासीय मकान पट्टा: "मकान पट्टा कैसे बनवाएँ — पूरी जानकारी"; डिजिटल सिग्नेचर options: "… डिजिटल सिग्नेचर कैसे करवाएँ".
- Back buttons, breadcrumbs, routes and the home page order (डिजिटल सिग्नेचर → डिजिटल सेवाएँ → आवासीय मकान पट्टा first) are unchanged.

**Files**
- New: `data/service-guides.json`, `components/services/ServiceGuide.tsx`, `components/services/DigitalServicesGuide.tsx`.
- Removed: `components/services/ServiceRequestForm.tsx`, `components/services/PattaForm.tsx`, `components/services/PersonFields.tsx`; the form validation in `lib/services.ts` (it now only lists the 3 डिजिटल सिग्नेचर options).
- Changed: `components/services/SignatureRequestPage.tsx`, the 3 pages in `app/services/digital-signature/*/page.tsx`, `app/services/house-patta/page.tsx`, `app/services/digital-services/page.tsx`, `lib/data.ts` (`getServiceGuide`), `lib/types.ts` (`ServiceGuide`, `ServiceGuideId`), `lib/i18n/dictionary.ts` (removed the form-only keys from change 2; added `guide.*`, `dsv.howTitle`, `dsv.howSteps`, `dsv.safety`; reworded descriptions), `components/ui/Card.tsx` (accepts `aria-labelledby`).
- The shared `components/forms/SuccessDialog.tsx` and `useServiceForm.ts` stay (the VB—G RAM G (NREGA) forms still use them).
- Tests: `tests/components/services.test.tsx` rewritten for guidance; `tests/lib/services.test.ts` removed; `tests/integration/pages.test.tsx` checks these pages have no form; `tests/data/integrity.test.ts` checks the guides. 217 tests pass; build makes 44 pages.

**Notes for the app**
- If the app already copied the change-2 forms for these 4 pages, replace them with the guidance layout above. There's nothing to submit on these pages any more.
- No new routes; the external-link handling for the 7 डिजिटल सेवाएँ links stays as described in change 2.

### 4. ग्राम सभा → पंचायत बैठक (कोरम), new पंचायत सदस्य and गैलरी pages, new hero buttons (27 Oct 2026)

**What changed**
- **Rename:** "ग्राम सभा" is now **"पंचायत बैठक (कोरम)"** (English: **"Panchayat Meeting (Quorum)"**) everywhere: menu, home service card ("पंचायत बैठक (कोरम)"), home section "आगामी पंचायत बैठक (कोरम)", page title, notice category, complaints/contact/admin text, and all data (notices, meeting agendas, works updates, panchayat intro). The page address stays **/gram-sabha**.
- **New page /members, "पंचायत सदस्य":** one card per member in a responsive grid (1 column on small phones, 2 from 420px, 3 on tablet, 4 on desktop), in two groups:
  - "जनप्रतिनिधि व अधिकारी": सरपंच, उप सरपंच, ग्राम विकास अधिकारी, सहायक सचिव, पटवारी, कृषि पर्यवेक्षक, सहकारी समिति प्रतिनिधि.
  - "वार्ड पंच": a separate card for each of wards 1–9.
  - Card order: profile photo (green circle with saffron ring; a person icon until a real photo is added), **पद** (with "— वार्ड N" for ward panch), **नाम**, **मोबाइल नंबर**.
  - Data in the new file **`data/members.json`** (`id, role, ward, name, nameEn, mobile, photo`). Names are sample names. Mobile numbers are **masked** (e.g. `+91 98XXX XX101`) so no real person gets calls; masked numbers show as text, and a real number (no X) automatically becomes a tap-to-call `tel:` link. To add a photo, put it in `public/images/members/` and set `photo` to its path.
- **New page /gallery, "गैलरी":** 8 village photos (sample illustrations for now) in a responsive grid with captions. Tapping a photo opens a large preview with the caption, a counter (2 / 8), previous/next buttons, left/right arrow keys, and Esc / ✕ / tap-outside to close. Data in **`data/gallery.json`** (`id, src, caption, captionEn`); images in **`public/images/gallery/`** (panchayat-bhawan, talab, school, khet, sadak, tanki, anganwadi, chaupal).
- **Home page hero buttons:** "विकास कार्य देखें" and "VB—G RAM G (NREGA) जानकारी" are replaced by **"पंचायत सदस्य" → /members** and **"गैलरी" → /gallery**. Only the hero changed; the menu still has विकास कार्य and VB—G RAM G (NREGA).
- **About page:** the "जनप्रतिनिधि व अधिकारी" section now shows the 7 official member cards (same data as /members) plus a "सभी पंचायत सदस्य देखें" link. The old placeholder list in `panchayat.json` (`representatives`) was removed.
- **Footer quick links** now also include पंचायत सदस्य and गैलरी.
- **Desktop menu:** it now wraps onto a second, centred line when the labels don't fit (this happens in English, because "Panchayat Meeting (Quorum)" is long). Hindi stays on one line. The page-anchor offset on desktop grew to 196px to match.

**Files**
- New: `data/members.json`, `data/gallery.json`, `public/images/gallery/*.svg` (8), `components/members/MemberCard.tsx`, `components/members/MembersGrid.tsx`, `components/gallery/VillageGallery.tsx`, `app/members/page.tsx`, `app/gallery/page.tsx`.
- Changed: `lib/i18n/dictionary.ts` (rename; new `nav.members`, `nav.gallery`, `members.*`, `role.*`, `gallery.desc/open/next/prev/counter`; removed `home.ctaWorks`, `home.ctaMgnrega`, `about.repsSub`), `lib/types.ts` (`Member`, `MemberRole`, `GalleryPhoto`; `representatives` removed from `PanchayatInfo`), `lib/data.ts` (`getMembers`, `getGallery`), `lib/constants.ts` (`EXTRA_LINKS`), `components/home/Hero.tsx`, `components/layout/Footer.tsx`, `components/layout/Header.tsx`, `app/about/page.tsx`, `app/gram-sabha/page.tsx`, `app/globals.css`, `data/notices.json`, `data/gram-sabha.json`, `data/works.json`, `data/panchayat.json`.
- Tests: new `tests/components/members-gallery.test.tsx`; updated `tests/integration/pages.test.tsx`, `tests/integration/routes.ts`, `tests/data/integrity.test.ts`, `tests/components/language.test.tsx`. 227 tests pass; build makes 46 pages.

**Notes for the app**
- Add `/members/` and `/gallery/` to navigation/back-button handling. Back from either goes to the home page.
- The gallery preview locks page scroll while open; the Android back button should close the preview first (like Esc), then leave the page.
- Copy `data/members.json`, `data/gallery.json` and `public/images/gallery/` into the app. Keep mobile numbers masked until real, verified numbers are added; real ones should open the phone dialer (`tel:` links).
- If the app has its own header/menu, use the new name "पंचायत बैठक (कोरम)" and make sure the longer English label fits.

### 5. Sarpanch profile: "हमारे सरपंच — मांगी लाल बुनकर" (27 Oct 2026)

**What changed**
- **Home page:** a highlighted card **directly after the hero** (before नागरिक सेवाएँ), titled **"हमारे सरपंच — मांगी लाल बुनकर"**. It has the round photo with the green/saffron ring, the English name, the place line "गाँव आपलियास · तहसील हुरड़ा · जिला भीलवाड़ा · राजस्थान", the motto "पंचायत का विकास ही हमारा संकल्प", 3 goal tags (स्वच्छ पानी, सड़क एवं नाली, हर मकान का पट्टा) and a **"पूरी प्रोफ़ाइल देखें →"** button. A saffron left border marks it as highlighted. On phones it stacks with a full-width button; from tablet up the photo, text and button sit in one row.
- **New page /sarpanch, "हमारे सरपंच":**
  1. Profile card: photo, role "सरपंच, ग्राम पंचायत आपलियास", name in Hindi (मांगी लाल बुनकर) and English (Mangi Lal Bunkar), place, motto and "आपका विश्वास ही हमारा संकल्प".
  2. **परिचय**: who he is and that the Panchayat includes आपलियास, चैनपुरिया and लक्ष्मणपुरा.
  3. **सरपंच की ज़िम्मेदारियाँ**: 5 general duties of the role.
  4. **विकास के संकल्प**: all **21 goals from his template**, keeping their original numbers, grouped into 6 cards: जनता व सुशासन; भवन व बुनियादी ढाँचा; पानी व स्वच्छता; शिक्षा व स्वास्थ्य; आवास व भूमि; रोज़गार, कृषि व कल्याण. Wording is as on the template, with only "पंचायता" → "पंचायत" and "नालियों कि" → "नालियों की" fixed. They are shown as goals, not achievements.
  5. **पूर्ण व चालू कार्य**: appears only when verified works are added to `works` in `data/sarpanch.json`; empty for now, so hidden.
  - The template's election lines (प्रत्याशी, vote appeal, "विजयी बनायें") are deliberately not shown, and a test blocks them.
  - All of it switches to English with the language button; the Hindi name stays visible next to the English one.
- Village name in this profile is spelled **आपलियास** (rest of the site unchanged).
- **पंचायत सदस्य:** the सरपंच card is now **मांगी लाल बुनकर** with his photo and a "पूरी प्रोफ़ाइल देखें" link to /sarpanch. His mobile stays masked like the others until a real number is given.
- **पंचायत परिचय (/about):** the details card gains **"सरपंच: मांगी लाल बुनकर"** and **"शामिल गाँव: आपलियास, चैनपुरिया, लक्ष्मणपुरा"**.
- **Footer quick links:** added "हमारे सरपंच".
- **Photo:** `public/images/members/mangi-lal-bunkar.webp`, a 480×480 square crop (33 KB) of the supplied photo, used on the home card, the profile page and the member card. It loads straight away (not lazy).

**Files**
- New: `data/sarpanch.json` (all profile text in Hindi + English, 21 goals in 6 groups, `works: []`), `public/images/members/mangi-lal-bunkar.webp`, `components/sarpanch/SarpanchPhoto.tsx`, `components/sarpanch/SarpanchHighlight.tsx`, `components/sarpanch/SarpanchProfile.tsx`, `app/sarpanch/page.tsx`.
- Changed: `data/members.json` (Sarpanch name + photo), `data/panchayat.json` (`villages` + `en.villages`), `lib/types.ts` (`SarpanchProfile`, `SarpanchGoal`; `villages` on `PanchayatInfo`), `lib/data.ts` (`getSarpanch`), `lib/constants.ts` (footer link), `lib/i18n/dictionary.ts` (`nav.sarpanch`, `sp.*`, `about.sarpanch`, `about.villages`), `app/page.tsx`, `app/about/page.tsx`, `components/members/MemberCard.tsx`.
- Tests: new `tests/components/sarpanch.test.tsx`; updated `tests/integration/pages.test.tsx`, `tests/integration/routes.ts`, `tests/data/integrity.test.ts`. 237 tests pass; build makes 47 pages.

**Notes for the app**
- Add `/sarpanch/` to navigation/back-button handling; back goes to the home page.
- Copy `data/sarpanch.json` and `public/images/members/mangi-lal-bunkar.webp`; update the app's `members.json` Sarpanch entry the same way.
- On the home screen, place the Sarpanch card right after the hero, as on the website.

### 6. Sarpanch profile tweaks (27 Oct 2026)

- **Home page order:** the "हमारे सरपंच — मांगी लाल बुनकर" card is now the **first thing on the home page**, above the hero; everything else follows below it. Card spacing changed to `py-6 md:py-8`.
- **/sarpanch "परिचय":** the villages sentence was removed, and the text now describes him as a dedicated, hard-working and honest public servant:
  "मांगी लाल बुनकर ग्राम पंचायत आपलियास (तहसील हुरड़ा, जिला भीलवाड़ा, राजस्थान) के सरपंच हैं। वे एक कर्मठ, मेहनती और ईमानदार जनसेवक हैं। गाँव के हर परिवार की समस्याओं को ध्यान से सुनना और उनके समाधान के लिए लगातार प्रयास करना उनकी पहचान है। सरल स्वभाव और सबको साथ लेकर चलने की सोच के साथ उनका संकल्प ग्राम पंचायत आपलियास का चहुंमुखी विकास है।" (English version in `introEn`).
- **Goals heading:** "विकास के संकल्प" → **"विकास के संकल्प (उद्देश्य)"** / "Development goals (objectives)".
- Files: `data/sarpanch.json` (`intro`, `introEn`), `lib/i18n/dictionary.ts` (`sp.goals`), `app/page.tsx`, `components/sarpanch/SarpanchHighlight.tsx`; tests updated in `tests/components/sarpanch.test.tsx` and `tests/integration/pages.test.tsx`.
- App: put the Sarpanch card at the very top of the home screen and copy the new `data/sarpanch.json`.

### 7. संकल्प पत्र (poster) on the Sarpanch profile (27 Oct 2026)

- New section **"संकल्प पत्र"** on **/sarpanch**, after "विकास के संकल्प (उद्देश्य)" and before works: the Sarpanch's poster image in a card (max ~576px wide, centred), with a **"पूरा देखें"** link. Tapping the image or the link opens the full-size poster in a new tab.
- Image: `public/images/members/sankalp-patra.jpg` (1131×1600, 418 KB), referenced by the new `poster` field in `data/sarpanch.json`.
- Files: `data/sarpanch.json`, `lib/types.ts` (`poster`), `lib/i18n/dictionary.ts` (`sp.poster`, `sp.posterOpen`), `components/sarpanch/SarpanchProfile.tsx`; tests in `tests/components/sarpanch.test.tsx` and `tests/data/integrity.test.ts`.
- App: copy the image and `data/sarpanch.json`; open the full-size poster in the phone's image viewer or browser.

### 8. Names follow the language
- In **Hindi** mode the scheme name shows as **"वीबी—जी राम जी (नरेगा)"** and the village as **"आपलियास"** everywhere: nav, home, NREGA pages, headings, data text and browser-tab titles.
- In **English** mode they show as **"VB—G RAM G (NREGA)"** and **"Appliyas"**. The village in the home hero heading is in capitals: **"Apni Gram Panchayat APPLIYAS"**.
- New dictionary key `site.village` (आपलियास / Appliyas), used by Hero, TopStrip and Footer. New constant `NREGA_NAME_HI` in `lib/nrega.ts`. The NREGA sub-pages use the translated name for description and breadcrumb.
- Data: Hindi fields in works, budget, schemes, notices, gram-sabha, panchayat, digital-services and mgnrega-works now use the Hindi names. The `en` blocks and `*En` fields are unchanged.
- Tests: a dictionary test now fails if a Hindi value contains "Appliyas" or "VB—G RAM G".
- App: copy `lib/i18n/dictionary.ts` and the data files, and apply the same Hindi/English names and the capital "APPLIYAS" in the English hero.

### 9. Real Panchayat building photo in the gallery
- New first gallery photo: `public/images/gallery/panchayat-bhawan-appliyas.jpg` (640×640, 71 KB). Caption: "ग्राम पंचायत भवन, आपलियास" / "Gram Panchayat building, Appliyas".
- It replaces the drawn placeholder `panchayat-bhawan.svg`, which was removed from `data/gallery.json` and deleted.
- App: copy the image and `data/gallery.json`.

### 10. Panchayat building photo on the home page
- The home hero's right side now shows the photo `public/images/gallery/panchayat-bhawan-appliyas.jpg` (square, rounded, white border, loads first) instead of the drawn village illustration. `components/home/VillageIllustration.tsx` was deleted.
- Alt text (`home.illustration`): "ग्राम पंचायत भवन, आपलियास" / "Gram Panchayat building, Appliyas".
- Logo subtitle now follows the language: new key `site.logoSub` = "आपलियास · भीलवाड़ा" / "Appliyas · Bhilwara".
- App: show the same photo on the home screen, and use the per-language logo subtitle.

### 11. Footer office details filled, disclaimer on the right
- "पंचायत कार्यालय" now shows real details instead of [placeholders]:
  - Address: "ग्राम पंचायत भवन, आपलियास, तहसील हुरड़ा, जिला भीलवाड़ा, राजस्थान" / "Gram Panchayat Bhawan, Appliyas, Tehsil Hurda, District Bhilwara, Rajasthan".
  - Hours: "सोमवार–शुक्रवार, सुबह 9:30 से शाम 6:00" / "Monday–Friday, 9:30 am to 6:00 pm".
  - Phone and email rows are hidden until real values are given (the phone will be the Sarpanch's number).
- Keys renamed: `ph.address` → `office.address`, `ph.hours` → `office.hours`; `ph.phone` and `ph.email` removed. The /contact page uses the same two rows. `data/panchayat.json` `office` updated (phone and email empty).
- Footer bottom bar: on tablet and up, copyright on the left and the अस्वीकरण (disclaimer) on the right, right-aligned. On phones the disclaimer shows first, then the copyright.
- Tests: new `tests/components/footer.test.tsx`.
- App: use the same address and hours, hide phone and email for now, and put the disclaimer on the right of the bottom bar.

### 12. Footer disclaimer no longer breaks awkwardly
- The right-aligned disclaimer wrapped onto a second line with one word left over. Copyright and disclaimer now sit side by side only on wide screens (1280px and up), where the disclaimer fits on one line, right-aligned. Below that they stack, left-aligned: disclaimer first, then copyright. Lines are balanced (`text-balance`) when the disclaimer wraps on phones.
- Checked at 360–1920px in Hindi and English: no stray single word and no sideways scroll.
- App: keep the disclaimer left-aligned on phones; right-align it only when it fits on one line.

### 13. Election campaign with an on/off switch
- New `data/campaign.json` with `"enabled": true`, the candidate's name, photo and slogan (मांगी लाल बुनकर / Mangi Lal Bunkar, "पंचायत का विकास ही हमारा संकल्प"). Set `"enabled": false` to hide everything below on all pages. Nothing else on the site was removed or changed.
- When on, every page shows:
  1. **Campaign strip** under the header (`section` "चुनाव अभियान"): small photo, name, slogan (slogan hidden on phones), and a "विकास के संकल्प देखें →" button to `/sarpanch/#sp-goals`.
  2. **Footer campaign card** at the top of the footer: photo, name, slogan, the line "यह एक जन-जागरूकता अभियान वेबसाइट है, आधिकारिक सरकारी पोर्टल नहीं।", a "संकल्प पत्र" button to `/sarpanch/#sp-poster`, and "WhatsApp पर शेयर करें" (opens `wa.me` in a new tab with the name, a short line and the /sarpanch/ link).
  3. **Mobile sticky button** "संकल्प पत्र" at the bottom right (phones only). The footer gets extra bottom space so it doesn't cover the last lines.
- All campaign text follows Hindi/English (new `camp.*` keys).
- Files: `data/campaign.json`, `lib/types.ts` (`Campaign`), `lib/data.ts` (`getCampaign`), `components/campaign/Campaign.tsx`, `components/layout/Footer.tsx` (optional `campaign` prop), `app/layout.tsx`, `lib/i18n/dictionary.ts`. Tests: `tests/components/campaign.test.tsx`.
- Checked at 320–1920px in both languages: no sideways scroll.
- App: add the same on/off flag and the three campaign parts (top strip, footer card with WhatsApp share, floating संकल्प पत्र button).

### 14. WhatsApp share uses the live site link
- The footer "WhatsApp पर शेयर करें" message now always contains `https://apni-gram-panchayat.vercel.app/sarpanch/` (new `shareUrl` field in `data/campaign.json`), instead of the address the page was opened from (which was `localhost` during testing).
- App: share the same link.

### 15. Placeholder text removed
- पंचायत परिचय: removed "[गाँव का विस्तृत परिचय — सत्यापन हेतु]" from the end of the intro (Hindi and English) and removed the "सत्यापन आवश्यक" badge next to it.
- Ward list: removed the "[क्षेत्र का नाम — सत्यापन हेतु]" line; each ward card now shows only "वार्ड 1…9". The area line comes back automatically if a ward gets an `area` in `data/panchayat.json`. `en.wardArea` removed.
- Work W-008 (proposed): funding source "[वित्त स्रोत — सत्यापन हेतु]" → "अभी तय नहीं" / "Not decided yet".
- Work detail, approval number when missing: "[सत्यापन हेतु]" → "अभी उपलब्ध नहीं" / "Not available yet" (key `ph.verify` renamed `common.notYet`).
- Village name now follows the language on /about ("Gram Panchayat" row) and /contact (heading "पंचायत कार्यालय — आपलियास" / "Panchayat office — Appliyas").
- The "सत्यापन आवश्यक" badges on the 3 unverified scheme cards are unchanged.
- Tests: new `tests/data/no-placeholders.test.ts`, which fails if any data file or dictionary text contains [brackets] or "सत्यापन हेतु" / "to be verified".
- App: copy `data/panchayat.json`, `data/works.json` and the dictionary changes; hide the ward area line when empty.
