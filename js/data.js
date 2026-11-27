/* ==========================================================================
   MAHAL ATÖLYE — Domain Data (100% Authentic Turkish Market)
   ========================================================================== */

window.MAHAL_DATA = {
  defaultBrand: {
    name: "MAHAL ATÖLYE",
    tagline: "Erkek Bakım & Ustura Evi",
    accent: "brass"
  },

  branches: [
    {
      id: "nisantasi",
      name: "Nişantaşı Atölye",
      city: "Şişli · İstanbul",
      address: "Harbiye Mah. Abdi İpekçi Cad. No: 42/A, Nişantaşı",
      phone: "0 (212) 296 48 10",
      hours: "Pzt – Cmt · 09:30 – 21:00",
      perk: "Vale Hizmeti & Özel Espresso Bar"
    },
    {
      id: "karakoy",
      name: "Karaköy Tersane",
      city: "Beyoğlu · İstanbul",
      address: "Kemankeş Mah. Mumhane Cad. Tarihi Kemer No: 18, Karaköy",
      phone: "0 (212) 244 91 30",
      hours: "Pzt – Cmt · 10:00 – 21:30",
      perk: "Tarihi Taş Kemer & VIP Damat Odası"
    },
    {
      id: "alsancak",
      name: "Alsancak Kordon",
      city: "Konak · İzmir",
      address: "Kültür Mah. Atatürk Cad. No: 194/B, Alsancak",
      phone: "0 (232) 464 72 15",
      hours: "Pzt – Cmt · 09:30 – 20:30",
      perk: "Körfez Manzaralı Dinlenme Terası"
    }
  ],

  categories: [
    { id: "tumu", label: "Tüm Ritüeller" },
    { id: "sac", label: "Saç & Tasarım" },
    { id: "sakal", label: "Sakal & Ustura" },
    { id: "paket", label: "İmza Paketler" },
    { id: "bakim", label: "Cilt & Terapi" }
  ],

  services: [
    {
      id: "mahal-tam",
      category: "paket",
      name: "Mahal Tam Bakım Ritüeli",
      desc: "Anatomik saç kesimi, çift kat sıcak havluyla geleneksel ustura sakal tasarımı, ozon buharı, kil maskesi ve tonik baş masajı.",
      duration: 60,
      price: 1450,
      badge: "En Çok Tercih Edilen"
    },
    {
      id: "imza-sac",
      category: "sac",
      name: "İmza Saç Kesimi & Tasarım",
      desc: "Yüz ve kafa yapısına özel makas/makine kesim, arındırıcı kerastase yıkama, sıcak havlu kompresi ve doğal şekillendirme.",
      duration: 45,
      price: 950,
      badge: "İmza"
    },
    {
      id: "skin-fade",
      category: "sac",
      name: "Modern Skin Fade & Kontür",
      desc: "Sıfır geçişli kusursuz gölgelendirme, jilet netliğinde ense ve favori hattı düzenlemesi, mat kil bitişi.",
      duration: 45,
      price: 1050,
      badge: null
    },
    {
      id: "ustura-sakal",
      category: "sakal",
      name: "Sıcak Havlu & Ustura Sakal Ritüeli",
      desc: "Sandal ağacı ve misket limonu köpüğü, el dövmesi ustura tıraşı, buharlı keten havlu ve soğuk bazalt taş uygulaması.",
      duration: 30,
      price: 600,
      badge: "Klasik"
    },
    {
      id: "sakal-tasarim",
      category: "sakal",
      name: "Sakal Form & Bakım Yağı Terapisi",
      desc: "Çene hattını belirginleştiren makas kesimi, ustura yanak temizliği ve soğuk sıkım sedir ağacı sakal serumu.",
      duration: 30,
      price: 550,
      badge: null
    },
    {
      id: "ozon-cilt",
      category: "bakim",
      name: "Ozon Buharlı Cilt Arındırma",
      desc: "Derin gözenek açıcı buhar, aktif karbon maskesi, kolajen göz çevresi pedi ve lenfatik yüz masajı.",
      duration: 30,
      price: 700,
      badge: null
    },
    {
      id: "bas-masaj",
      category: "bakim",
      name: "Anadolu Aromaterapi Baş & Boyun Masajı",
      desc: "Bergamot ve okaliptüs özleriyle şakak, ense ve omuz gerginliğini alan derin dinlenme seansı.",
      duration: 30,
      price: 500,
      badge: null
    },
    {
      id: "damat-vip",
      category: "paket",
      name: "Damat & Özel Gün VIP Oda Deneyimi",
      desc: "İzole VIP süitte saç ve sakal tasarımı, tam cilt bakımı, el bakımı, kaş-kulak rötuşu ve özel ikram servisi.",
      duration: 90,
      price: 3800,
      badge: "VIP Süit"
    }
  ],

  barbers: [
    {
      id: "kerem",
      name: "Kerem Soylu",
      role: "Kurucu & Başberber",
      exp: "14 Yıl Deneyim",
      rating: "4.99",
      reviews: 418,
      specialty: "Anatomik Makas Kesim & VIP Damat Tasarımı",
      photo: "assets/usta-kerem.jpg"
    },
    {
      id: "emirhan",
      name: "Emirhan Kaya",
      role: "Kıdemli Fade & Sakal Ustası",
      exp: "9 Yıl Deneyim",
      rating: "4.97",
      reviews: 294,
      specialty: "Kusursuz Skin Fade & Keskin Sakal Kontürü",
      photo: "assets/usta-emirhan.jpg"
    },
    {
      id: "okan",
      name: "Okan Arslan",
      role: "Stil Direktörü",
      exp: "11 Yıl Deneyim",
      rating: "4.98",
      reviews: 336,
      specialty: "Orta/Uzun Saç Dokusu & Doğal Akış Kesim",
      photo: "assets/usta-okan.jpg"
    },
    {
      id: "furkan",
      name: "Furkan Demir",
      role: "Ustura & Bakım Uzmanı",
      exp: "8 Yıl Deneyim",
      rating: "4.96",
      reviews: 221,
      specialty: "Geleneksel Sıcak Havlu Ustura & Ozon Bakım",
      photo: "assets/usta-furkan.jpg"
    }
  ],

  drinks: [
    "Sade Türk Kahvesi",
    "Orta Türk Kahvesi",
    "İnce Belli Taze Çay",
    "Soğuk Espresso",
    "Maden Suyu & Limon",
    "İkram İstemiyorum"
  ],

  timeSlots: [
    "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00",
    "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
  ]
};
