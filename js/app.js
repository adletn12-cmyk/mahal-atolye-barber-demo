/* ==========================================================================
   MAHAL ATÖLYE — Interactive Booking & Studio Management Engine
   ========================================================================== */

(function () {
  "use strict";

  const DATA = window.MAHAL_DATA;
  const STORAGE_KEY = "mahal_atolye_demo_v1";

  const TR_DAYS_SHORT = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  const TR_DAYS_LONG = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const TR_MONTHS_SHORT = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

  // Generate 7 upcoming days starting from current date
  function buildUpcomingDates() {
    const base = new Date();
    base.setHours(12, 0, 0, 0);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const iso = `${yyyy}-${mm}-${dd}`;
      const dow = d.getDay();
      const isSunday = dow === 0;
      let prefix = TR_DAYS_SHORT[dow];
      if (i === 0) prefix = "Bugün";
      else if (i === 1) prefix = "Yarın";

      days.push({
        iso,
        dayNum: d.getDate(),
        monthShort: TR_MONTHS_SHORT[d.getMonth()],
        dayShort: prefix,
        fullLabel: `${d.getDate()} ${TR_MONTHS_SHORT[d.getMonth()]} ${TR_DAYS_LONG[dow]}`,
        isClosed: isSunday
      });
    }
    return days;
  }

  const UPCOMING_DATES = buildUpcomingDates();
  const FIRST_OPEN_DATE = (UPCOMING_DATES.find(d => !d.isClosed) || UPCOMING_DATES[0]).iso;
  const SECOND_OPEN_DATE = (UPCOMING_DATES.filter(d => !d.isClosed)[1] || UPCOMING_DATES[0]).iso;

  // Format TRY currency: ₺1.450
  function formatTRY(amount) {
    return "₺" + Number(amount || 0).toLocaleString("tr-TR");
  }

  function timeToIndex(timeStr) {
    return DATA.timeSlots.indexOf(timeStr);
  }

  function addMinutesToTime(timeStr, mins) {
    const [h, m] = timeStr.split(":").map(Number);
    const total = h * 60 + m + mins;
    const nh = Math.floor(total / 60);
    const nm = total % 60;
    return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
  }

  // Seed realistic initial studio appointments across branches
  function createSeedAppointments() {
    const seed = [
      // Nişantaşı - First Open Day
      {
        id: "MHL-8412",
        branchId: "nisantasi",
        date: FIRST_OPEN_DATE,
        startTime: "09:30",
        duration: 45,
        barberId: "kerem",
        serviceIds: ["imza-sac"],
        serviceLabel: "İmza Saç Kesimi & Tasarım",
        price: 950,
        clientName: "Mertcan Yılmaz",
        clientPhone: "0 (532) 418 72 90",
        drink: "Sade Türk Kahvesi",
        quietMode: false,
        status: "tamamlandi",
        source: "Online Web",
        visits: 11
      },
      {
        id: "MHL-8419",
        branchId: "nisantasi",
        date: FIRST_OPEN_DATE,
        startTime: "10:30",
        duration: 60,
        barberId: "kerem",
        serviceIds: ["mahal-tam"],
        serviceLabel: "Mahal Tam Bakım Ritüeli",
        price: 1450,
        clientName: "Selim Karaosmanoğlu",
        clientPhone: "0 (533) 609 14 22",
        drink: "Soğuk Espresso",
        quietMode: true,
        status: "koltukta",
        source: "Sadık Üye",
        visits: 19
      },
      {
        id: "MHL-8425",
        branchId: "nisantasi",
        date: FIRST_OPEN_DATE,
        startTime: "13:00",
        duration: 30,
        barberId: "kerem",
        serviceIds: [],
        serviceLabel: "Öğle & Dinlenme Molası",
        price: 0,
        clientName: "Usta Molası",
        clientPhone: "—",
        drink: "—",
        quietMode: false,
        status: "mola",
        source: "Atölye Planı",
        visits: 0
      },
      {
        id: "MHL-8431",
        branchId: "nisantasi",
        date: FIRST_OPEN_DATE,
        startTime: "14:30",
        duration: 90,
        barberId: "kerem",
        serviceIds: ["damat-vip"],
        serviceLabel: "Damat & Özel Gün VIP Oda Deneyimi",
        price: 3800,
        clientName: "Burak Özdemir",
        clientPhone: "0 (542) 312 88 45",
        drink: "Sade Türk Kahvesi",
        quietMode: false,
        status: "onaylandi",
        source: "Online Web",
        visits: 4
      },
      {
        id: "MHL-8434",
        branchId: "nisantasi",
        date: FIRST_OPEN_DATE,
        startTime: "10:00",
        duration: 45,
        barberId: "emirhan",
        serviceIds: ["skin-fade"],
        serviceLabel: "Modern Skin Fade & Kontür",
        price: 1050,
        clientName: "Kaan Çelik",
        clientPhone: "0 (535) 882 19 04",
        drink: "İnce Belli Taze Çay",
        quietMode: false,
        status: "tamamlandi",
        source: "WhatsApp",
        visits: 7
      },
      {
        id: "MHL-8438",
        branchId: "nisantasi",
        date: FIRST_OPEN_DATE,
        startTime: "11:30",
        duration: 60,
        barberId: "emirhan",
        serviceIds: ["skin-fade", "ustura-sakal"],
        serviceLabel: "Modern Skin Fade + Ustura Sakal",
        price: 1650,
        clientName: "Caner Aydın",
        clientPhone: "0 (530) 741 55 30",
        drink: "Maden Suyu & Limon",
        quietMode: true,
        status: "koltukta",
        source: "Online Web",
        visits: 6
      },
      {
        id: "MHL-8442",
        branchId: "nisantasi",
        date: FIRST_OPEN_DATE,
        startTime: "15:00",
        duration: 45,
        barberId: "emirhan",
        serviceIds: ["skin-fade"],
        serviceLabel: "Modern Skin Fade & Kontür",
        price: 1050,
        clientName: "Yiğit Soydan",
        clientPhone: "0 (536) 229 40 18",
        drink: "Soğuk Espresso",
        quietMode: false,
        status: "onaylandi",
        source: "Online Web",
        visits: 2
      },
      {
        id: "MHL-8446",
        branchId: "nisantasi",
        date: FIRST_OPEN_DATE,
        startTime: "11:00",
        duration: 60,
        barberId: "okan",
        serviceIds: ["imza-sac", "bas-masaj"],
        serviceLabel: "İmza Saç Kesimi + Baş Masajı",
        price: 1450,
        clientName: "Tolga Erdem",
        clientPhone: "0 (532) 904 61 73",
        drink: "Orta Türk Kahvesi",
        quietMode: true,
        status: "onaylandi",
        source: "Online Web",
        visits: 9
      },
      {
        id: "MHL-8450",
        branchId: "nisantasi",
        date: FIRST_OPEN_DATE,
        startTime: "13:30",
        duration: 30,
        barberId: "okan",
        serviceIds: [],
        serviceLabel: "Öğle Molası",
        price: 0,
        clientName: "Usta Molası",
        clientPhone: "—",
        drink: "—",
        quietMode: false,
        status: "mola",
        source: "Atölye Planı",
        visits: 0
      },
      {
        id: "MHL-8454",
        branchId: "nisantasi",
        date: FIRST_OPEN_DATE,
        startTime: "16:00",
        duration: 45,
        barberId: "okan",
        serviceIds: ["imza-sac"],
        serviceLabel: "İmza Saç Kesimi & Tasarım",
        price: 950,
        clientName: "Alp Tekin",
        clientPhone: "0 (544) 510 32 81",
        drink: "Sade Türk Kahvesi",
        quietMode: false,
        status: "onaylandi",
        source: "Telefon",
        visits: 5
      },
      {
        id: "MHL-8459",
        branchId: "nisantasi",
        date: FIRST_OPEN_DATE,
        startTime: "10:30",
        duration: 60,
        barberId: "furkan",
        serviceIds: ["ustura-sakal", "ozon-cilt"],
        serviceLabel: "Ustura Sakal + Ozon Cilt Bakımı",
        price: 1300,
        clientName: "Onur Şahin",
        clientPhone: "0 (537) 615 09 44",
        drink: "İnce Belli Taze Çay",
        quietMode: false,
        status: "tamamlandi",
        source: "Online Web",
        visits: 8
      },
      {
        id: "MHL-8463",
        branchId: "nisantasi",
        date: FIRST_OPEN_DATE,
        startTime: "14:00",
        duration: 60,
        barberId: "furkan",
        serviceIds: ["mahal-tam"],
        serviceLabel: "Mahal Tam Bakım Ritüeli",
        price: 1450,
        clientName: "Sinan Aksoy",
        clientPhone: "0 (532) 398 77 12",
        drink: "Sade Türk Kahvesi",
        quietMode: true,
        status: "onaylandi",
        source: "Online Web",
        visits: 14
      },

      // Karaköy & Alsancak sample appointments
      {
        id: "MHL-8501",
        branchId: "karakoy",
        date: FIRST_OPEN_DATE,
        startTime: "11:00",
        duration: 60,
        barberId: "kerem",
        serviceIds: ["mahal-tam"],
        serviceLabel: "Mahal Tam Bakım Ritüeli",
        price: 1450,
        clientName: "Barış Korkmaz",
        clientPhone: "0 (533) 210 98 11",
        drink: "Soğuk Espresso",
        quietMode: false,
        status: "koltukta",
        source: "Online Web",
        visits: 6
      },
      {
        id: "MHL-8504",
        branchId: "karakoy",
        date: FIRST_OPEN_DATE,
        startTime: "14:30",
        duration: 45,
        barberId: "emirhan",
        serviceIds: ["skin-fade"],
        serviceLabel: "Modern Skin Fade & Kontür",
        price: 1050,
        clientName: "Doruk Arıkan",
        clientPhone: "0 (535) 412 63 90",
        drink: "Sade Türk Kahvesi",
        quietMode: true,
        status: "onaylandi",
        source: "Online Web",
        visits: 3
      },
      {
        id: "MHL-8510",
        branchId: "alsancak",
        date: FIRST_OPEN_DATE,
        startTime: "12:00",
        duration: 60,
        barberId: "okan",
        serviceIds: ["mahal-tam"],
        serviceLabel: "Mahal Tam Bakım Ritüeli",
        price: 1450,
        clientName: "Ege Kavaklı",
        clientPhone: "0 (532) 765 24 80",
        drink: "Maden Suyu & Limon",
        quietMode: false,
        status: "onaylandi",
        source: "Online Web",
        visits: 9
      },
      // Second Open Day sample
      {
        id: "MHL-8602",
        branchId: "nisantasi",
        date: SECOND_OPEN_DATE,
        startTime: "11:30",
        duration: 60,
        barberId: "kerem",
        serviceIds: ["mahal-tam"],
        serviceLabel: "Mahal Tam Bakım Ritüeli",
        price: 1450,
        clientName: "Hakan Vural",
        clientPhone: "0 (532) 601 44 19",
        drink: "Sade Türk Kahvesi",
        quietMode: false,
        status: "onaylandi",
        source: "Online Web",
        visits: 15
      },
      {
        id: "MHL-8608",
        branchId: "nisantasi",
        date: SECOND_OPEN_DATE,
        startTime: "14:00",
        duration: 45,
        barberId: "emirhan",
        serviceIds: ["skin-fade"],
        serviceLabel: "Modern Skin Fade & Kontür",
        price: 1050,
        clientName: "Umut Güler",
        clientPhone: "0 (541) 892 11 05",
        drink: "Soğuk Espresso",
        quietMode: false,
        status: "onaylandi",
        source: "WhatsApp",
        visits: 4
      }
    ];
    return seed;
  }

  // Application State
  let state = {
    mode: "client", // "client" | "admin"
    brand: { ...DATA.defaultBrand },
    branchId: "nisantasi",
    activeCategory: "tumu",
    selectedServiceIds: ["mahal-tam"],
    selectedBarberId: "any",
    selectedDate: FIRST_OPEN_DATE,
    selectedTime: null,
    drink: "Sade Türk Kahvesi",
    quietMode: false,
    clientName: "",
    clientPhone: "",
    appointments: [],
    newOnlineCount: 0,
    lastTicket: null,
    // Admin specific state
    adminDate: FIRST_OPEN_DATE,
    adminSubView: "calendar", // "calendar" | "list"
    inspectedApptId: null
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.appointments) && parsed.appointments.length > 0) {
          state.appointments = parsed.appointments;
          if (parsed.brand) state.brand = parsed.brand;
          state.newOnlineCount = parsed.newOnlineCount || 0;
          return;
        }
      }
    } catch (_) {}
    state.appointments = createSeedAppointments();
  }

  function saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          brand: state.brand,
          appointments: state.appointments,
          newOnlineCount: state.newOnlineCount
        })
      );
    } catch (_) {}
  }

  // Helpers for selected services
  function getSelectedServices() {
    return DATA.services.filter(s => state.selectedServiceIds.includes(s.id));
  }

  function getTotalDuration() {
    const srvs = getSelectedServices();
    return srvs.reduce((acc, s) => acc + s.duration, 0) || 30;
  }

  function getTotalPrice() {
    const srvs = getSelectedServices();
    return srvs.reduce((acc, s) => acc + s.price, 0);
  }

  function getBranch(branchId) {
    return DATA.branches.find(b => b.id === (branchId || state.branchId)) || DATA.branches[0];
  }

  function getBarber(barberId) {
    return DATA.barbers.find(b => b.id === barberId);
  }

  // Availability Calculation
  function isBarberFreeAt(branchId, dateIso, barberId, startSlotTime, durationMins) {
    const startIdx = timeToIndex(startSlotTime);
    if (startIdx === -1) return false;
    const slotsNeeded = Math.ceil(durationMins / 30);
    if (startIdx + slotsNeeded > DATA.timeSlots.length) return false;

    // Gather occupied slot indices for this barber on this date + branch
    const occupied = new Set();
    state.appointments.forEach(appt => {
      if (appt.branchId !== branchId || appt.date !== dateIso || appt.barberId !== barberId) return;
      const aIdx = timeToIndex(appt.startTime);
      if (aIdx === -1) return;
      const aLen = Math.ceil((appt.duration || 30) / 30);
      for (let k = 0; k < aLen; k++) {
        occupied.add(aIdx + k);
      }
    });

    for (let s = 0; s < slotsNeeded; s++) {
      if (occupied.has(startIdx + s)) return false;
    }
    return true;
  }

  function isSlotAvailableForSelection(timeStr) {
    const dur = getTotalDuration();
    if (state.selectedBarberId === "any") {
      return DATA.barbers.some(b =>
        isBarberFreeAt(state.branchId, state.selectedDate, b.id, timeStr, dur)
      );
    }
    return isBarberFreeAt(state.branchId, state.selectedDate, state.selectedBarberId, timeStr, dur);
  }

  function pickBestAvailableBarber(timeStr, durationMins) {
    if (state.selectedBarberId !== "any") return state.selectedBarberId;
    const candidates = DATA.barbers.filter(b =>
      isBarberFreeAt(state.branchId, state.selectedDate, b.id, timeStr, durationMins)
    );
    if (candidates.length === 0) return DATA.barbers[0].id;
    // Choose barber with fewest appointments today to balance studio load
    candidates.sort((a, b) => {
      const countA = state.appointments.filter(
        x => x.branchId === state.branchId && x.date === state.selectedDate && x.barberId === a.id
      ).length;
      const countB = state.appointments.filter(
        x => x.branchId === state.branchId && x.date === state.selectedDate && x.barberId === b.id
      ).length;
      return countA - countB;
    });
    return candidates[0].id;
  }

  function findEarliestSlotForBarber(barberId) {
    for (const slot of DATA.timeSlots) {
      if (isBarberFreeAt(state.branchId, FIRST_OPEN_DATE, barberId, slot, 45)) {
        return slot;
      }
    }
    return "Yarın 10:00";
  }

  function countOpenSlotsToday() {
    let open = 0;
    for (const slot of DATA.timeSlots) {
      const anyFree = DATA.barbers.some(b =>
        isBarberFreeAt(state.branchId, FIRST_OPEN_DATE, b.id, slot, 45)
      );
      if (anyFree) open++;
    }
    return open;
  }

  // Phone Formatting: 0 (5XX) XXX XX XX
  function formatTurkishPhone(raw) {
    let digits = raw.replace(/\D/g, "");
    if (digits.startsWith("90")) digits = "0" + digits.slice(2);
    if (digits.length > 0 && digits[0] !== "0") {
      digits = "0" + digits;
    }
    digits = digits.slice(0, 11);
    if (digits.length <= 1) return digits;
    if (digits.length <= 4) return `${digits[0]} (${digits.slice(1)}`;
    if (digits.length <= 7) return `${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 9) return `${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)} ${digits.slice(7)}`;
    return `${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
  }

  // Deterministic Clean SVG QR Generator for Digital Ticket
  function generateTicketQR(codeStr) {
    let hash = 2166136261;
    for (let i = 0; i < codeStr.length; i++) {
      hash ^= codeStr.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const size = 13;
    const cell = 6;
    const dim = size * cell;
    let rects = "";

    const isFinder = (r, c) =>
      (r < 4 && c < 4) || (r < 4 && c >= size - 4) || (r >= size - 4 && c < 4);

    const drawFinder = (ox, oy) => {
      rects += `<rect x="${ox}" y="${oy}" width="${3 * cell}" height="${3 * cell}" fill="#1B1613"/>`;
      rects += `<rect x="${ox + 3}" y="${oy + 3}" width="${3 * cell - 6}" height="${3 * cell - 6}" fill="#FFFFFF"/>`;
      rects += `<rect x="${ox + 6}" y="${oy + 6}" width="${3 * cell - 12}" height="${3 * cell - 12}" fill="#1B1613"/>`;
    };

    drawFinder(0, 0);
    drawFinder((size - 3) * cell, 0);
    drawFinder(0, (size - 3) * cell);

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (isFinder(r, c)) continue;
        hash ^= (r * 31 + c * 17) & 0xff;
        hash = Math.imul(hash, 16777619);
        if ((hash >>> 0) % 2 === 0) {
          rects += `<rect x="${c * cell}" y="${r * cell}" width="${cell - 0.6}" height="${cell - 0.6}" fill="#1B1613" rx="1"/>`;
        }
      }
    }

    return `<svg width="${dim}" height="${dim}" viewBox="0 0 ${dim} ${dim}" xmlns="http://www.w3.org/2000/svg" aria-label="Randevu QR Kodu">${rects}</svg>`;
  }

  // Toast Feedback
  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById("toast-msg");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 3400);
  }

  // ==========================================================================
  // RENDERING FUNCTIONS
  // ==========================================================================

  function applyBrandTheme() {
    document.documentElement.setAttribute("data-accent", state.brand.accent || "brass");
    document.querySelectorAll("[data-brand-name]").forEach(el => {
      el.textContent = state.brand.name;
    });
    document.querySelectorAll("[data-brand-tagline]").forEach(el => {
      el.textContent = state.brand.tagline;
    });

    const wlNameInput = document.getElementById("wl-brand-input");
    const wlTagInput = document.getElementById("wl-tagline-input");
    if (wlNameInput && document.activeElement !== wlNameInput) wlNameInput.value = state.brand.name;
    if (wlTagInput && document.activeElement !== wlTagInput) wlTagInput.value = state.brand.tagline;

    document.querySelectorAll(".swatch-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.swatch === state.brand.accent);
    });
  }

  function renderModeState() {
    document.body.classList.toggle("mode-admin", state.mode === "admin");
    document.getElementById("mode-btn-client").classList.toggle("active", state.mode === "client");
    document.getElementById("mode-btn-admin").classList.toggle("active", state.mode === "admin");

    const badge = document.getElementById("admin-new-badge");
    if (state.newOnlineCount > 0) {
      badge.textContent = `+${state.newOnlineCount} Yeni`;
    } else {
      const todayCount = state.appointments.filter(
        a => a.branchId === state.branchId && a.date === state.adminDate && a.status !== "mola"
      ).length;
      badge.textContent = `${todayCount}`;
    }
  }

  function renderHeaderAndHero() {
    const branch = getBranch();

    // Sync header branch select & hero quick-book select
    document.querySelectorAll(".js-branch-select").forEach(sel => {
      sel.innerHTML = DATA.branches
        .map(b => `<option value="${b.id}" ${b.id === state.branchId ? "selected" : ""}>${b.name}</option>`)
        .join("");
    });

    const qbSrv = document.getElementById("qb-service-select");
    if (qbSrv) {
      const primaryId = state.selectedServiceIds[0] || DATA.services[0].id;
      qbSrv.innerHTML = DATA.services
        .map(
          s =>
            `<option value="${s.id}" ${s.id === primaryId ? "selected" : ""}>${s.name} (${formatTRY(s.price)})</option>`
        )
        .join("");
    }

    // Hero live caption
    document.getElementById("hero-caption-branch").textContent = branch.name;
    document.getElementById("hero-caption-addr").textContent = `${branch.address} · ${branch.perk}`;
    const openSlots = countOpenSlotsToday();
    document.getElementById("hero-caption-slots").textContent = `Bugün ${openSlots} Müsait Saat`;
  }

  function renderServiceMenu() {
    const tabsWrap = document.getElementById("category-tabs");
    tabsWrap.innerHTML = DATA.categories
      .map(
        c =>
          `<button type="button" class="cat-tab ${state.activeCategory === c.id ? "active" : ""}" data-cat="${c.id}">${c.label}</button>`
      )
      .join("");

    const filtered =
      state.activeCategory === "tumu"
        ? DATA.services
        : DATA.services.filter(s => s.category === state.activeCategory);

    const ledger = document.getElementById("menu-ledger");
    ledger.innerHTML = filtered
      .map((s, idx) => {
        const isSel = state.selectedServiceIds.includes(s.id);
        const num = String(idx + 1).padStart(2, "0");
        return `
          <div class="menu-row ${isSel ? "selected" : ""}" data-srv-toggle="${s.id}" role="button" tabindex="0" aria-pressed="${isSel}">
            <span class="menu-index">${num}</span>
            <div>
              <div class="menu-info-top">
                <h3 class="menu-title">${s.name}</h3>
                ${s.badge ? `<span class="menu-tag">${s.badge}</span>` : ""}
              </div>
              <p class="menu-desc">${s.desc}</p>
            </div>
            <div class="menu-right">
              <div class="menu-pricing">
                <div class="menu-price">${formatTRY(s.price)}</div>
                <div class="menu-duration">${s.duration} dk</div>
              </div>
              <div class="menu-check" aria-hidden="true">✓</div>
            </div>
          </div>
        `;
      })
      .join("");

    // Update Floating Tray
    const tray = document.getElementById("floating-tray");
    const count = state.selectedServiceIds.length;
    if (count > 0 && state.mode === "client") {
      document.getElementById("tray-summary-text").textContent = `${count} Hizmet · ${getTotalDuration()} dk`;
      document.getElementById("tray-summary-price").textContent = formatTRY(getTotalPrice());
      tray.classList.add("visible");
    } else {
      tray.classList.remove("visible");
    }
  }

  function renderMastersSection() {
    const grid = document.getElementById("masters-grid");
    grid.innerHTML = DATA.barbers
      .map(b => {
        const earliest = findEarliestSlotForBarber(b.id);
        return `
          <article class="master-card">
            <div class="master-portrait-wrap">
              <img src="${b.photo}" alt="${b.name} — ${b.role}" loading="lazy" />
              <span class="master-rating-chip">★ ${b.rating} (${b.reviews})</span>
            </div>
            <div class="master-body">
              <div class="master-role">${b.role} · ${b.exp}</div>
              <h3 class="master-name">${b.name}</h3>
              <p class="master-specialty">${b.specialty}</p>
              <div class="master-footer">
                <div>
                  <div class="next-slot-label">Bugün En Erken</div>
                  <div class="next-slot-time">${earliest}</div>
                </div>
                <button type="button" class="master-book-btn" data-pick-master="${b.id}">Randevu Al →</button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderBookingStudio() {
    // 1. Branches
    const branchGrid = document.getElementById("studio-branch-grid");
    branchGrid.innerHTML = DATA.branches
      .map(
        b => `
        <button type="button" class="studio-branch-btn ${b.id === state.branchId ? "active" : ""}" data-studio-branch="${b.id}">
          <span class="b-name">${b.name}</span>
          <span class="b-city">${b.city}</span>
        </button>
      `
      )
      .join("");

    // 2. Services inside Studio
    const srvGrid = document.getElementById("studio-service-list");
    srvGrid.innerHTML = DATA.services
      .map(s => {
        const isSel = state.selectedServiceIds.includes(s.id);
        return `
          <button type="button" class="studio-srv-item ${isSel ? "selected" : ""}" data-srv-toggle="${s.id}">
            <span>
              <span class="studio-srv-name">${s.name}</span>
              <span class="studio-srv-meta">${s.duration} dk</span>
            </span>
            <span class="studio-srv-price">${formatTRY(s.price)}</span>
          </button>
        `;
      })
      .join("");

    // 3. Usta Selection
    const ustaGrid = document.getElementById("studio-usta-grid");
    const anyCard = `
      <button type="button" class="usta-pick-btn ${state.selectedBarberId === "any" ? "active" : ""}" data-studio-barber="any">
        <span class="usta-any-circle">✦</span>
        <span class="usta-pick-name">Fark Etmez</span>
        <span class="usta-pick-sub">İlk Müsait Usta</span>
      </button>
    `;
    const barberCards = DATA.barbers
      .map(
        b => `
        <button type="button" class="usta-pick-btn ${state.selectedBarberId === b.id ? "active" : ""}" data-studio-barber="${b.id}">
          <img src="${b.photo}" alt="${b.name}" class="usta-avatar" />
          <span class="usta-pick-name">${b.name.split(" ")[0]}</span>
          <span class="usta-pick-sub">★ ${b.rating}</span>
        </button>
      `
      )
      .join("");
    ustaGrid.innerHTML = anyCard + barberCards;

    // 4. Date Strip
    const dateStrip = document.getElementById("date-strip");
    dateStrip.innerHTML = UPCOMING_DATES.map(
      d => `
        <button type="button" class="date-btn ${d.iso === state.selectedDate ? "active" : ""}"
          data-studio-date="${d.iso}" ${d.isClosed ? "disabled title='Pazar Günü Kapalı'" : ""}>
          <span class="date-day-label">${d.isClosed ? "Kapalı" : d.dayShort}</span>
          <span class="date-num-label">${d.dayNum}</span>
          <span class="date-month-label">${d.monthShort}</span>
        </button>
      `
    ).join("");

    // Ensure currently selected time is still valid; if not, auto-pick first valid slot
    if (!state.selectedTime || !isSlotAvailableForSelection(state.selectedTime)) {
      state.selectedTime = DATA.timeSlots.find(t => isSlotAvailableForSelection(t)) || null;
    }

    // 5. Grouped Time Slots
    const periods = [
      { label: "Sabah Seansları", slots: DATA.timeSlots.filter(t => t < "12:30") },
      { label: "Öğleden Sonra", slots: DATA.timeSlots.filter(t => t >= "12:30" && t < "17:00") },
      { label: "Akşam Seansları", slots: DATA.timeSlots.filter(t => t >= "17:00") }
    ];

    const slotsContainer = document.getElementById("slots-container");
    slotsContainer.innerHTML = periods
      .map(
        p => `
        <div class="slot-period-group">
          <div class="slot-period-label">${p.label}</div>
          <div class="slots-grid">
            ${p.slots
              .map(t => {
                const ok = isSlotAvailableForSelection(t);
                const isAct = state.selectedTime === t && ok;
                return `<button type="button" class="slot-btn ${isAct ? "active" : ""}" data-studio-slot="${t}" ${
                  !ok ? "disabled" : ""
                }>${t}</button>`;
              })
              .join("")}
          </div>
        </div>
      `
      )
      .join("");

    // 6. Hospitality Chips & Quiet Mode
    const drinkWrap = document.getElementById("drink-chips");
    drinkWrap.innerHTML = DATA.drinks
      .map(
        dr =>
          `<button type="button" class="pref-chip ${state.drink === dr ? "active" : ""}" data-drink="${dr}">${dr}</button>`
      )
      .join("");

    document.getElementById("quiet-switch").classList.toggle("on", state.quietMode);

    // 7. Right-Side Summary Card
    const branch = getBranch();
    document.getElementById("sum-branch").textContent = `${branch.name} (${branch.city})`;

    const barberObj =
      state.selectedBarberId === "any" ? null : getBarber(state.selectedBarberId);
    document.getElementById("sum-barber").textContent = barberObj
      ? barberObj.name
      : "İlk Müsait Başberber";

    const dateObj = UPCOMING_DATES.find(d => d.iso === state.selectedDate);
    const endTime = state.selectedTime
      ? addMinutesToTime(state.selectedTime, getTotalDuration())
      : "";
    document.getElementById("sum-datetime").textContent = state.selectedTime
      ? `${dateObj ? dateObj.fullLabel : state.selectedDate} · ${state.selectedTime} – ${endTime}`
      : "Saat Seçiniz";

    document.getElementById("sum-duration").textContent = `${getTotalDuration()} Dakika`;
    document.getElementById("sum-hosp").textContent = `${state.drink}${
      state.quietMode ? " · Sessiz Mod" : ""
    }`;

    const selectedSrvs = getSelectedServices();
    const srvListEl = document.getElementById("sum-services-list");
    if (selectedSrvs.length === 0) {
      srvListEl.innerHTML = `<div class="s-srv-line"><span>Henüz hizmet seçilmedi</span><span class="mono">₺0</span></div>`;
    } else {
      srvListEl.innerHTML = selectedSrvs
        .map(
          s => `
          <div class="s-srv-line">
            <span>${s.name}</span>
            <span class="mono">${formatTRY(s.price)}</span>
          </div>
        `
        )
        .join("");
    }

    document.getElementById("sum-total-price").textContent = formatTRY(getTotalPrice());
  }

  function renderFooterBranches() {
    const wrap = document.getElementById("footer-branches");
    wrap.innerHTML = DATA.branches
      .map(
        b => `
        <div class="f-branch-card">
          <h4>${b.name}</h4>
          <p>${b.address}<br/>Tel: ${b.phone}</p>
          <div class="f-branch-hours">${b.hours}</div>
        </div>
      `
      )
      .join("");
  }

  // ==========================================================================
  // ADMIN / STUDIO MANAGEMENT RENDERING
  // ==========================================================================
  function renderAdminView() {
    const branch = getBranch();
    document.getElementById("admin-branch-label").textContent = `${branch.name} · ${branch.city}`;

    // Admin Date Tabs (first 4 open dates)
    const openDates = UPCOMING_DATES.filter(d => !d.isClosed).slice(0, 4);
    if (!openDates.some(d => d.iso === state.adminDate)) {
      state.adminDate = openDates[0].iso;
    }

    document.getElementById("admin-date-tabs").innerHTML = openDates
      .map(
        d => `
        <button type="button" class="adm-tab ${d.iso === state.adminDate ? "active" : ""}" data-adm-date="${d.iso}">
          ${d.dayShort} · ${d.dayNum} ${d.monthShort}
        </button>
      `
      )
      .join("");

    document.querySelectorAll("[data-adm-subview]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.admSubview === state.adminSubView);
    });

    // Day Appointments for current branch + adminDate
    const dayAppts = state.appointments.filter(
      a => a.branchId === state.branchId && a.date === state.adminDate
    );
    const clientAppts = dayAppts.filter(a => a.status !== "mola");

    const expectedRev = clientAppts.reduce((sum, a) => sum + (a.price || 0), 0);
    const collectedRev = clientAppts
      .filter(a => a.status === "tamamlandi")
      .reduce((sum, a) => sum + (a.price || 0), 0);

    // Occupancy: total booked 30-min blocks / (4 barbers * 22 slots)
    const bookedBlocks = dayAppts.reduce((sum, a) => sum + Math.ceil((a.duration || 30) / 30), 0);
    const totalBlocks = DATA.barbers.length * DATA.timeSlots.length;
    const occupancyPct = Math.min(100, Math.round((bookedBlocks / totalBlocks) * 100));

    document.getElementById("kpi-revenue").textContent = formatTRY(expectedRev);
    document.getElementById("kpi-collected").textContent = `Kasada Tahsil Edilen: ${formatTRY(collectedRev)}`;
    document.getElementById("kpi-occupancy").textContent = `%${occupancyPct}`;
    document.getElementById("kpi-count").textContent = `${clientAppts.length} Randevu`;
    const newCountDay = clientAppts.filter(a => a.status === "yeni").length;
    document.getElementById("kpi-new-sub").textContent =
      newCountDay > 0 ? `${newCountDay} yeni online kayıt` : "Tümü onaylandı";

    // Toggle Board vs List
    const boardWrap = document.getElementById("schedule-board-wrap");
    const listWrap = document.getElementById("admin-list-panel");
    boardWrap.classList.toggle("hidden", state.adminSubView !== "calendar");
    listWrap.classList.toggle("active", state.adminSubView === "list");

    // Render Schedule Head
    const schHead = document.getElementById("schedule-head");
    schHead.innerHTML =
      `<div class="sch-head-time">SAAT</div>` +
      DATA.barbers
        .map(b => {
          const bCount = clientAppts.filter(a => a.barberId === b.id).length;
          const bRev = clientAppts
            .filter(a => a.barberId === b.id)
            .reduce((s, a) => s + a.price, 0);
          return `
            <div class="sch-head-barber">
              <img src="${b.photo}" alt="${b.name}" />
              <div>
                <div class="sch-b-name">${b.name}</div>
                <div class="sch-b-load">${bCount} Randevu · ${formatTRY(bRev)}</div>
              </div>
            </div>
          `;
        })
        .join("");

    // Render Schedule Body (56px per 30-min slot)
    const ROW_H = 56;
    const totalHeight = DATA.timeSlots.length * ROW_H;
    const timeAxisHtml = DATA.timeSlots.map(t => `<div class="time-tick">${t}</div>`).join("");

    const colsHtml = DATA.barbers
      .map(b => {
        const bAppts = dayAppts.filter(a => a.barberId === b.id);
        const blocks = bAppts
          .map(a => {
            const idx = timeToIndex(a.startTime);
            if (idx === -1) return "";
            const top = idx * ROW_H + 3;
            const height = Math.max(48, (a.duration / 30) * ROW_H - 6);
            const endT = addMinutesToTime(a.startTime, a.duration);
            return `
              <button type="button" class="appt-block status-${a.status}"
                style="top:${top}px; height:${height}px;"
                data-inspect-appt="${a.id}">
                <div>
                  <div class="appt-top-line">
                    <span class="appt-client">${a.clientName}</span>
                    ${a.status !== "mola" ? `<span class="appt-price">${formatTRY(a.price)}</span>` : ""}
                  </div>
                  <div class="appt-srv">${a.serviceLabel}</div>
                </div>
                <div class="appt-badges">
                  <span class="mono">${a.startTime}–${endT}</span>
                  ${a.quietMode ? `<span>· Sessiz</span>` : ""}
                  ${a.status === "yeni" ? `<span style="color:var(--accent)">· YENİ</span>` : ""}
                </div>
              </button>
            `;
          })
          .join("");

        return `<div class="barber-col" style="height:${totalHeight}px">${blocks}</div>`;
      })
      .join("");

    document.getElementById("schedule-body").innerHTML =
      `<div class="time-axis">${timeAxisHtml}</div>` + colsHtml;

    // Render List Table
    const sorted = [...dayAppts].sort((a, b) => a.startTime.localeCompare(b.startTime));
    const statusMap = {
      yeni: "Yeni Online",
      onaylandi: "Onaylandı",
      koltukta: "Koltukta",
      tamamlandi: "Tamamlandı",
      mola: "Usta Molası"
    };

    document.getElementById("admin-table-body").innerHTML = sorted
      .map(a => {
        const b = getBarber(a.barberId);
        return `
          <tr data-inspect-appt="${a.id}">
            <td class="mono">${a.startTime} (${a.duration} dk)</td>
            <td><strong>${a.clientName}</strong><br/><span style="font-size:0.75rem;color:var(--text-dim)">${a.clientPhone}</span></td>
            <td>${b ? b.name : "—"}</td>
            <td>${a.serviceLabel}<br/><span style="font-size:0.74rem;color:var(--text-dim)">İkram: ${a.drink}${a.quietMode ? " · Sessiz Kesim" : ""}</span></td>
            <td class="mono">${a.status === "mola" ? "—" : formatTRY(a.price)}</td>
            <td><span class="status-pill ${a.status}">${statusMap[a.status] || a.status}</span></td>
          </tr>
        `;
      })
      .join("");
  }

  function renderAll() {
    applyBrandTheme();
    renderModeState();
    renderHeaderAndHero();
    renderServiceMenu();
    renderMastersSection();
    renderBookingStudio();
    renderAdminView();
    renderFooterBranches();
  }

  // ==========================================================================
  // INTERACTIONS & BOOKING SUBMISSION
  // ==========================================================================

  function toggleService(serviceId) {
    const idx = state.selectedServiceIds.indexOf(serviceId);
    if (idx >= 0) {
      if (state.selectedServiceIds.length > 1) {
        state.selectedServiceIds.splice(idx, 1);
      } else {
        showToast("En az 1 hizmet seçili olmalıdır.");
        return;
      }
    } else {
      state.selectedServiceIds.push(serviceId);
    }
    renderServiceMenu();
    renderBookingStudio();
  }

  function handleBookingSubmit() {
    const errEl = document.getElementById("booking-error");
    errEl.classList.remove("visible");

    if (state.selectedServiceIds.length === 0) {
      errEl.textContent = "Lütfen en az bir hizmet seçiniz.";
      errEl.classList.add("visible");
      return;
    }
    if (!state.selectedTime || !isSlotAvailableForSelection(state.selectedTime)) {
      errEl.textContent = "Lütfen uygun bir randevu saati seçiniz.";
      errEl.classList.add("visible");
      return;
    }

    const nameVal = document.getElementById("client-name-input").value.trim();
    const phoneVal = document.getElementById("client-phone-input").value.trim();
    const digits = phoneVal.replace(/\D/g, "");

    if (nameVal.length < 3) {
      errEl.textContent = "Lütfen adınızı ve soyadınızı giriniz.";
      errEl.classList.add("visible");
      document.getElementById("client-name-input").focus();
      return;
    }
    if (digits.length < 10) {
      errEl.textContent = "Lütfen geçerli bir cep telefonu numarası giriniz (05XX...).";
      errEl.classList.add("visible");
      document.getElementById("client-phone-input").focus();
      return;
    }

    const duration = getTotalDuration();
    const price = getTotalPrice();
    const assignedBarberId = pickBestAvailableBarber(state.selectedTime, duration);
    const srvs = getSelectedServices();
    const code = "MHL-" + Math.floor(1000 + Math.random() * 8999);

    const newAppt = {
      id: code,
      branchId: state.branchId,
      date: state.selectedDate,
      startTime: state.selectedTime,
      duration,
      barberId: assignedBarberId,
      serviceIds: [...state.selectedServiceIds],
      serviceLabel: srvs.map(s => s.name).join(" + "),
      price,
      clientName: nameVal,
      clientPhone: phoneVal,
      drink: state.drink,
      quietMode: state.quietMode,
      status: "yeni",
      source: "Online Web",
      visits: 1
    };

    state.appointments.push(newAppt);
    state.newOnlineCount += 1;
    state.lastTicket = newAppt;
    state.adminDate = newAppt.date;
    saveState();

    openTicketModal(newAppt);
    renderAll();
  }

  function openTicketModal(appt) {
    const branch = getBranch(appt.branchId);
    const barber = getBarber(appt.barberId);
    const dateObj = UPCOMING_DATES.find(d => d.iso === appt.date);
    const dateLabel = dateObj ? dateObj.fullLabel : appt.date;
    const endT = addMinutesToTime(appt.startTime, appt.duration);

    document.getElementById("tkt-code").textContent = `#${appt.id}`;
    document.getElementById("tkt-brand").textContent = state.brand.name;
    document.getElementById("tkt-client").textContent = appt.clientName;
    document.getElementById("tkt-branch").textContent = `${branch.name} (${branch.city})`;
    document.getElementById("tkt-barber").textContent = barber ? barber.name : "Başberber";
    document.getElementById("tkt-datetime").textContent = `${dateLabel} · ${appt.startTime} – ${endT}`;
    document.getElementById("tkt-services").textContent = `${appt.serviceLabel} (${formatTRY(appt.price)})`;
    document.getElementById("tkt-qr").innerHTML = generateTicketQR(appt.id);

    document.getElementById("tkt-whatsapp-msg").innerHTML = `
      <strong>✓ WhatsApp Onay & Hatırlatma Gönderildi (${appt.clientPhone})</strong>
      Sayın ${appt.clientName}, <b>${state.brand.name} — ${branch.name}</b> şubemizdeki <b>${dateLabel} saat ${appt.startTime}</b> randevunuz <b>${barber ? barber.name : ""}</b> adına oluşturulmuştur. İkram tercihiniz (${appt.drink}) hazır edilecektir. Kod: <b>#${appt.id}</b>
    `;

    document.getElementById("ticket-modal-backdrop").classList.add("open");
  }

  // Download .ics calendar file
  function downloadICS(appt) {
    if (!appt) return;
    const branch = getBranch(appt.branchId);
    const barber = getBarber(appt.barberId);
    const [y, m, d] = appt.date.split("-");
    const [hh, mm] = appt.startTime.split(":");
    const endStr = addMinutesToTime(appt.startTime, appt.duration);
    const [eh, em] = endStr.split(":");

    const dtStart = `${y}${m}${d}T${hh}${mm}00`;
    const dtEnd = `${y}${m}${d}T${eh}${em}00`;

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Mahal Atolye//Randevu//TR",
      "BEGIN:VEVENT",
      `UID:${appt.id}@mahalatolye.com.tr`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${state.brand.name} Randevu (${barber ? barber.name : "Usta"})`,
      `LOCATION:${branch.address}`,
      `DESCRIPTION:${appt.serviceLabel} - Tutar: ${formatTRY(appt.price)} - Kod: #${appt.id}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Randevu-${appt.id}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("Takvim dosyası (.ics) indirildi.");
  }

  // Admin Appointment Detail Drawer
  function openInspectDrawer(apptId) {
    const appt = state.appointments.find(a => a.id === apptId);
    if (!appt) return;
    state.inspectedApptId = apptId;

    const barber = getBarber(appt.barberId);
    const endT = addMinutesToTime(appt.startTime, appt.duration);

    const body = document.getElementById("inspect-drawer-content");
    body.innerHTML = `
      <div class="drawer-card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="mono" style="color:var(--accent);font-size:0.78rem;">#${appt.id} · ${appt.source}</span>
          <span class="status-pill ${appt.status}">${appt.status.toUpperCase()}</span>
        </div>
        <div style="font-family:var(--font-serif);font-size:1.6rem;">${appt.clientName}</div>
        <div style="color:var(--text-sand);">${appt.clientPhone} ${appt.visits > 1 ? `· Sadık Müşteri (${appt.visits}. Ziyaret)` : "· İlk Ziyaret"}</div>
      </div>

      <div class="drawer-card">
        <div><span style="color:var(--text-dim)">Usta:</span> <strong>${barber ? barber.name : "—"}</strong></div>
        <div><span style="color:var(--text-dim)">Saat:</span> <strong class="mono">${appt.startTime} – ${endT} (${appt.duration} dk)</strong></div>
        <div><span style="color:var(--text-dim)">İşlem:</span> <strong>${appt.serviceLabel}</strong></div>
        ${
          appt.status !== "mola"
            ? `<div><span style="color:var(--text-dim)">Misafirperverlik:</span> <strong>${appt.drink}${appt.quietMode ? " · Sessiz Kesim" : ""}</strong></div>
               <div><span style="color:var(--text-dim)">Tutar:</span> <strong class="mono" style="color:var(--accent);font-size:1.1rem;">${formatTRY(appt.price)}</strong></div>`
            : ""
        }
      </div>
    `;

    const actions = document.getElementById("inspect-drawer-actions");
    if (appt.status === "mola") {
      actions.innerHTML = `
        <button type="button" class="action-btn danger" data-appt-action="cancel">Molayı Kaldır (Saati Müsait Yap)</button>
      `;
    } else {
      actions.innerHTML = `
        <button type="button" class="action-btn" data-appt-action="onaylandi">✓ Onaylandı İşaretle</button>
        <button type="button" class="action-btn" data-appt-action="koltukta">✂ Koltukta (İşlem Başladı)</button>
        <button type="button" class="action-btn" data-appt-action="tamamlandi">₺ Tamamlandı & Tahsilat Al</button>
        <button type="button" class="action-btn danger" data-appt-action="cancel">✕ Randevuyu İptal Et (Saati Aç)</button>
      `;
    }

    document.getElementById("inspect-drawer-backdrop").classList.add("open");
  }

  // Quick Walk-in / Break Modal in Admin
  function openQuickAddDrawer() {
    const barberSel = document.getElementById("qa-barber");
    barberSel.innerHTML = DATA.barbers
      .map(b => `<option value="${b.id}">${b.name}</option>`)
      .join("");

    const srvSel = document.getElementById("qa-service");
    srvSel.innerHTML =
      DATA.services
        .map(s => `<option value="${s.id}">${s.name} (${s.duration} dk · ${formatTRY(s.price)})</option>`)
        .join("") + `<option value="mola">⏸ Usta Molası / Özel Blokaj (30 dk)</option>`;

    const timeSel = document.getElementById("qa-time");
    timeSel.innerHTML = DATA.timeSlots.map(t => `<option value="${t}">${t}</option>`).join("");

    document.getElementById("quickadd-drawer-backdrop").classList.add("open");
  }

  function handleQuickAddSubmit(e) {
    e.preventDefault();
    const barberId = document.getElementById("qa-barber").value;
    const srvVal = document.getElementById("qa-service").value;
    const startTime = document.getElementById("qa-time").value;
    const clientInput = document.getElementById("qa-client").value.trim();
    const phoneInput = document.getElementById("qa-phone").value.trim() || "0 (532) 000 00 00";

    const isMola = srvVal === "mola";
    const srvObj = isMola ? null : DATA.services.find(s => s.id === srvVal);
    const duration = isMola ? 30 : srvObj.duration;

    if (!isBarberFreeAt(state.branchId, state.adminDate, barberId, startTime, duration)) {
      showToast("Seçilen saatte ustanın başka bir kaydı bulunuyor!");
      return;
    }

    const rec = {
      id: "MHL-" + Math.floor(1000 + Math.random() * 8999),
      branchId: state.branchId,
      date: state.adminDate,
      startTime,
      duration,
      barberId,
      serviceIds: isMola ? [] : [srvObj.id],
      serviceLabel: isMola ? clientInput || "Özel Mola / Blokaj" : srvObj.name,
      price: isMola ? 0 : srvObj.price,
      clientName: isMola ? "Usta Molası" : clientInput || "Kapıdan Misafir",
      clientPhone: isMola ? "—" : phoneInput,
      drink: isMola ? "—" : "Sade Türk Kahvesi",
      quietMode: false,
      status: isMola ? "mola" : "onaylandi",
      source: isMola ? "Atölye Planı" : "Telefon / Walk-in",
      visits: 1
    };

    state.appointments.push(rec);
    saveState();
    document.getElementById("quickadd-drawer-backdrop").classList.remove("open");
    document.getElementById("qa-client").value = "";
    renderAll();
    showToast(isMola ? "Usta molası takvime işlendi." : "Manuel randevu takvime eklendi.");
  }

  // ==========================================================================
  // EVENT DELEGATION & BINDINGS
  // ==========================================================================

  function bindEvents() {
    // Mode Switch
    document.getElementById("mode-btn-client").addEventListener("click", () => {
      state.mode = "client";
      renderAll();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.getElementById("mode-btn-admin").addEventListener("click", () => {
      state.mode = "admin";
      state.newOnlineCount = 0;
      saveState();
      renderAll();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // White-label customizer popover
    const wlBtn = document.getElementById("wl-trigger-btn");
    const wlPop = document.getElementById("wl-popover");
    wlBtn.addEventListener("click", e => {
      e.stopPropagation();
      wlPop.classList.toggle("open");
    });

    document.addEventListener("click", e => {
      if (!wlPop.contains(e.target) && e.target !== wlBtn) {
        wlPop.classList.remove("open");
      }
    });

    document.getElementById("wl-brand-input").addEventListener("input", e => {
      state.brand.name = e.target.value.trim() || "MAHAL ATÖLYE";
      saveState();
      applyBrandTheme();
    });

    document.getElementById("wl-tagline-input").addEventListener("input", e => {
      state.brand.tagline = e.target.value.trim() || "Erkek Bakım & Ustura Evi";
      saveState();
      applyBrandTheme();
    });

    document.querySelectorAll(".swatch-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.brand.accent = btn.dataset.swatch;
        saveState();
        applyBrandTheme();
      });
    });

    document.getElementById("reset-demo-btn").addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      state.brand = { ...DATA.defaultBrand };
      state.appointments = createSeedAppointments();
      state.newOnlineCount = 0;
      wlPop.classList.remove("open");
      renderAll();
      showToast("Demo verileri başlangıç durumuna sıfırlandı.");
    });

    // Branch Selects
    document.querySelectorAll(".js-branch-select").forEach(sel => {
      sel.addEventListener("change", e => {
        state.branchId = e.target.value;
        renderAll();
        showToast(`${getBranch().name} şubesi seçildi.`);
      });
    });

    // Hero Quick-Book CTA
    document.getElementById("qb-submit-btn").addEventListener("click", () => {
      const chosenSrv = document.getElementById("qb-service-select").value;
      if (chosenSrv) state.selectedServiceIds = [chosenSrv];
      renderAll();
      document.getElementById("randevu-studyo").scrollIntoView({ behavior: "smooth" });
    });

    // Phone mask & Demo autofill
    const phoneInput = document.getElementById("client-phone-input");
    phoneInput.addEventListener("input", e => {
      e.target.value = formatTurkishPhone(e.target.value);
    });

    document.getElementById("autofill-demo-client").addEventListener("click", () => {
      document.getElementById("client-name-input").value = "Emre Soyluoğlu";
      document.getElementById("client-phone-input").value = "0 (532) 684 19 20";
      showToast("Örnek müşteri bilgileri dolduruldu.");
    });

    // Quiet Mode Switch
    document.getElementById("quiet-toggle-btn").addEventListener("click", () => {
      state.quietMode = !state.quietMode;
      renderBookingStudio();
    });

    // Submit Booking
    document.getElementById("submit-booking-btn").addEventListener("click", handleBookingSubmit);

    // Ticket Modal Buttons
    document.getElementById("tkt-close-btn").addEventListener("click", () => {
      document.getElementById("ticket-modal-backdrop").classList.remove("open");
    });

    document.getElementById("tkt-ics-btn").addEventListener("click", () => {
      downloadICS(state.lastTicket);
    });

    document.getElementById("tkt-goto-admin-btn").addEventListener("click", () => {
      document.getElementById("ticket-modal-backdrop").classList.remove("open");
      state.mode = "admin";
      state.newOnlineCount = 0;
      if (state.lastTicket) {
        state.adminDate = state.lastTicket.date;
      }
      saveState();
      renderAll();
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast("Yeni randevunuz Usta Takviminde altın vurguyla gösteriliyor.");
    });

    // Admin Quick Add Drawer
    document.getElementById("open-quickadd-btn").addEventListener("click", openQuickAddDrawer);
    document.getElementById("close-quickadd-btn").addEventListener("click", () => {
      document.getElementById("quickadd-drawer-backdrop").classList.remove("open");
    });
    document.getElementById("quickadd-form").addEventListener("submit", handleQuickAddSubmit);

    document.getElementById("close-inspect-btn").addEventListener("click", () => {
      document.getElementById("inspect-drawer-backdrop").classList.remove("open");
    });

    // Delegated Clicks
    document.body.addEventListener("click", e => {
      const catBtn = e.target.closest("[data-cat]");
      if (catBtn) {
        state.activeCategory = catBtn.dataset.cat;
        renderServiceMenu();
        return;
      }

      const srvToggle = e.target.closest("[data-srv-toggle]");
      if (srvToggle) {
        toggleService(srvToggle.dataset.srvToggle);
        return;
      }

      const masterBtn = e.target.closest("[data-pick-master]");
      if (masterBtn) {
        state.selectedBarberId = masterBtn.dataset.pickMaster;
        renderBookingStudio();
        document.getElementById("randevu-studyo").scrollIntoView({ behavior: "smooth" });
        return;
      }

      const stBranch = e.target.closest("[data-studio-branch]");
      if (stBranch) {
        state.branchId = stBranch.dataset.studioBranch;
        renderAll();
        return;
      }

      const stBarber = e.target.closest("[data-studio-barber]");
      if (stBarber) {
        state.selectedBarberId = stBarber.dataset.studioBarber;
        renderBookingStudio();
        return;
      }

      const stDate = e.target.closest("[data-studio-date]");
      if (stDate && !stDate.disabled) {
        state.selectedDate = stDate.dataset.studioDate;
        renderBookingStudio();
        return;
      }

      const stSlot = e.target.closest("[data-studio-slot]");
      if (stSlot && !stSlot.disabled) {
        state.selectedTime = stSlot.dataset.studioSlot;
        renderBookingStudio();
        return;
      }

      const drChip = e.target.closest("[data-drink]");
      if (drChip) {
        state.drink = drChip.dataset.drink;
        renderBookingStudio();
        return;
      }

      const admDate = e.target.closest("[data-adm-date]");
      if (admDate) {
        state.adminDate = admDate.dataset.admDate;
        renderAdminView();
        return;
      }

      const admSub = e.target.closest("[data-adm-subview]");
      if (admSub) {
        state.adminSubView = admSub.dataset.admSubview;
        renderAdminView();
        return;
      }

      const inspectItem = e.target.closest("[data-inspect-appt]");
      if (inspectItem) {
        openInspectDrawer(inspectItem.dataset.inspectAppt);
        return;
      }

      const apptAct = e.target.closest("[data-appt-action]");
      if (apptAct && state.inspectedApptId) {
        const act = apptAct.dataset.apptAction;
        if (act === "cancel") {
          state.appointments = state.appointments.filter(a => a.id !== state.inspectedApptId);
          showToast("Kayıt silindi ve saat tekrar online randevuya açıldı.");
        } else {
          const target = state.appointments.find(a => a.id === state.inspectedApptId);
          if (target) {
            target.status = act;
            showToast(`Randevu durumu güncellendi.`);
          }
        }
        saveState();
        document.getElementById("inspect-drawer-backdrop").classList.remove("open");
        renderAll();
      }
    });
  }

  // Initialize App
  document.addEventListener("DOMContentLoaded", () => {
    loadState();
    bindEvents();
    renderAll();
  });
})();
