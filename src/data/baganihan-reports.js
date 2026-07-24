// Baganihan Reports — structured content for the branded report pages.
// Each report has a card (front of the resources page, no em dashes) and full
// bilingual content rendered as blocks by /resources/baganihan/[slug].astro.

export const baganihanReports = [
  {
    slug: "issue-001-community-resilience",
    issueLabel: "Issue No. 001",
    date: "July 2026",
    // ── card (front page) ── keep it plain, no em dashes ──
    cardTitle: "Issue No. 001 · Building Community Resilience",
    cardSummary:
      "Communities face rising uncertainty from climate, the economy, and global instability, yet the effects land locally. This first report is a guide to seeing change early, strengthening what a community already has, and deciding together through systems thinking and Community Continuity Management.",
    cardImage: "/images/baganihan/community-garden.jpg",
    hero: "/images/baganihan/community-garden.jpg",
    heroCaption:
      "A community that grows its own food, stores its own water, and knows its neighbours is a community that adapts.",

    versions: {
      en: {
        docName: "Baganihan Community Situation Report",
        docCode: "BCSITREP",
        theme: "Building Community Resilience in an Increasingly Uncertain World",
        blocks: [
          { t: "lead", label: "Executive Summary", text: "Communities are facing increasing uncertainty from climate change, economic pressures, technological disruption, and global instability. While these challenges are global, their effects are felt locally. This report helps communities observe change, strengthen resilience, and make better decisions through open-source information, systems thinking, ecological analysis, and Community Continuity Management." },

          { t: "status", label: "Strategic Horizon", items: [
            { lvl: "watch",  title: "Food Security",         text: "Strengthen local food production and diversify crops to reduce dependence on external supply chains." },
            { lvl: "watch",  title: "Water Security",        text: "Monitor water sources, improve storage, and conserve water as weather patterns continue to change." },
            { lvl: "watch",  title: "Livelihoods",           text: "Encourage diverse local enterprises to reduce economic vulnerability." },
            { lvl: "watch",  title: "Information Environment", text: "Verify information before acting and rely on trusted local networks." },
            { lvl: "strong", title: "Community Cohesion",    text: "Communities with strong relationships adapt and recover faster during crises." },
          ]},

          { t: "prose", label: "Ecological Intelligence", paras: [
            "Modern communities depend on interconnected systems for food, energy, transport, communications, and finance. While we cannot control global events, we can improve our ability to adapt.",
            "Resilience begins by understanding local assets, reducing unnecessary dependence, strengthening cooperation, and learning to observe change early.",
          ]},

          { t: "image", src: "/images/baganihan/mycelium-network.jpg", caption: "Like mycelium beneath the soil, a community is held together by the connections we cannot always see." },

          { t: "bullets", label: "Weak Signals to Watch", intro: "Observe this month:", items: [
            "Food prices", "Crop pests and diseases", "Water levels", "Transport costs", "Online scams", "Migration", "Business activity", "Community volunteerism",
          ], note: "Small observations often reveal larger trends." },

          { t: "checklist", label: "Community Continuity Actions", items: [
            "Update emergency contacts.",
            "Identify vulnerable households.",
            "Inspect water sources.",
            "Encourage every household to grow food.",
            "Inventory community skills and equipment.",
            "Strengthen cooperation with neighbouring communities.",
          ]},

          { t: "image", src: "/images/baganihan/diverse-crops.jpg", caption: "Many crops in one bed. Food security begins with what a community can grow for itself." },

          { t: "bullets", label: "Opportunity Watch", intro: "Consider developing:", items: [
            "Community gardens", "Seed banks", "Compost systems", "Food processing", "Tool-sharing", "Rainwater harvesting", "Youth skills training", "Cooperative marketing",
          ]},

          { t: "questions", label: "Community Observation", intro: "Each month, discuss:", items: [
            "What changed?", "What surprised us?", "What concerns us?", "What opportunities emerged?", "What should other communities know?",
          ], note: "Your observations help strengthen the resilience of the entire Baganihan network." },

          { t: "quote", label: "Kabuohan Reflection", text: "Communities become resilient by learning to observe, adapt, cooperate, and continuously improve. Before we seek to change our community, we must first learn to see it clearly." },

          { t: "prose", label: "Next Month", paras: [
            "The next Community Situation Report will introduce the Baganihan Community Resilience Scorecard, a practical tool for assessing community strengths in food, water, livelihoods, ecology, preparedness, and social cohesion.",
          ]},
        ],
      },

      fil: {
        docName: "Baganihan Community Observation Report",
        docCode: "BCOR",
        theme: "Mas Matatag na Pamayanan sa Panahon ng Lumalaking Kawalang-Katiyakan",
        blocks: [
          { t: "lead", label: "Kamusta Tayo?", text: "Marami tayong napapansing pagbabago. Mas mainit ang panahon. Mas pabago-bago ang ulan. Tumataas ang presyo ng pagkain. Nagbabago ang kabuhayan. Mas mabilis kumalat ang impormasyon, kasama na rin ang maling impormasyon. Samantala, ang mga pangyayari sa ibang bahagi ng mundo ay mas mabilis na ring nakaaapekto sa ating mga pamayanan. Hindi natin kontrolado ang lahat ng ito. Ngunit may magagawa tayo." },

          { t: "prose", paras: [
            "Sa Baganihan, naniniwala tayong ang isang matatag na pamayanan ay nagsisimula sa pagmamasid, pag-unawa, at sama-samang pagkilos.",
            "Ang ulat na ito ay hindi para magdulot ng takot. Ito ay paanyaya upang sama-sama nating makita ang kalagayan ng ating pamayanan at matutong kumilos nang may karunungan.",
          ]},

          { t: "themeCards", label: "Ano ang Napapansin Natin?", items: [
            { title: "Pagkain",     questions: ["May sapat ba tayong pagkain?", "May sarili ba tayong produksyon?", "May iba't ibang pananim ba tayo?"], note: "Mas malapit ang pagkain, mas matatag ang pamayanan." },
            { title: "Tubig",       questions: ["Ano ang kalagayan ng ating mga balon, bukal, ilog, at imbakan?", "May sapat bang tubig kung humaba ang tag-init o magkaroon ng sakuna?"], note: "Ang tubig ay yaman ng buong pamayanan." },
            { title: "Kabuhayan",   questions: ["Kumusta ang hanapbuhay ng ating mga pamilya?", "May iba-iba bang pinagkukunan ng kita o iisa lamang?"], note: "Mas maraming kakayahan at kabuhayan, mas handa ang komunidad sa pagbabago." },
            { title: "Impormasyon", questions: ["Ano ang mga balitang kumakalat?", "Alin ang napatunayan?", "Sino ang mapagkakatiwalaan nating mapagkukunan ng impormasyon?"], note: "Sa panahon ngayon, ang tamang impormasyon ay bahagi na rin ng paghahanda." },
            { title: "Bayanihan",   questions: ["Nagkakakilala pa ba ang ating mga magkakapitbahay?", "May mga boluntaryo ba?", "Nagkakaroon ba tayo ng mga gawain bilang komunidad?"], note: "Sa panahon ng krisis, ang pinakamahalagang yaman ay ang ugnayan ng tao sa tao." },
          ]},

          { t: "image", src: "/images/baganihan/mycelium-network.jpg", caption: "Tulad ng mycelium sa ilalim ng lupa, ang pamayanan ay binubuklod ng mga ugnayang hindi natin laging nakikita." },

          { t: "bullets", label: "Mga Maliliit na Senyales na Hindi Dapat Balewalain", intro: "Ngayong buwan, pagmasdan natin ang mga sumusunod:", items: [
            "Presyo ng pagkain", "Kalusugan ng mga pananim", "Peste at sakit", "Antas ng tubig", "Gastos sa transportasyon", "Maling impormasyon at online scam", "Paglipat ng mga tao", "Pagbubukas o pagsasara ng mga negosyo", "Paglahok ng mga mamamayan sa mga gawaing pangkomunidad",
          ], note: "Ang maliliit na pagbabago ngayon ay maaaring maging malalaking hamon o pagkakataon bukas." },

          { t: "checklist", label: "Mga Maaaring Gawin Ngayon", items: [
            "I-update ang listahan ng emergency contacts.",
            "Kilalanin ang mga pamilyang nangangailangan ng dagdag na suporta.",
            "Suriin ang mga pinagkukunan ng tubig.",
            "Hikayatin ang bawat tahanan na magtanim ng kahit kaunting pagkain.",
            "Alamin ang mga kasanayan, kagamitan, at iba pang yaman ng komunidad.",
            "Makipag-ugnayan sa mga karatig na pamayanan.",
            "Magdaos ng simpleng pulong upang magbahagi ng mga napapansin.",
          ]},

          { t: "image", src: "/images/baganihan/diverse-crops.jpg", caption: "Maraming pananim sa iisang taniman. Nagsisimula ang seguridad sa pagkain sa kung ano ang kayang itanim ng pamayanan para sa sarili nito." },

          { t: "bullets", label: "Mga Pagkakataong Maaari Nating Simulan", items: [
            "Community Garden", "Seed Bank", "Composting", "Pagproseso ng pagkain", "Tool Sharing", "Rainwater Harvesting", "Pagsasanay ng kabataan", "Kooperatiba at lokal na pamilihan",
          ], note: "Hindi kailangang malaki ang simula. Ang maliliit na hakbang na sama-samang ginagawa ang nagiging pundasyon ng matatag na pamayanan." },

          { t: "questions", label: "Pag-usapan Natin", intro: "Kapag nagtipon ang komunidad, maaaring magsimula sa limang tanong:", items: [
            "Ano ang nagbago?", "Ano ang napansin natin?", "Ano ang dapat nating paghandaan?", "Anong pagkakataon ang nakikita natin?", "Ano ang maaari nating ibahagi sa ibang pamayanan?",
          ], note: "Ang mga sagot sa mga tanong na ito ang bumubuo ng karunungan ng komunidad." },

          { t: "quote", label: "Pagninilay ng Kabuohan", text: "Hindi nagsisimula ang Bayanihan sa pagtulong. Nagsisimula ito sa pagmamasid. Kapag natutunan nating makita ang ating pamayanan bilang isang kabuuan, ang tao, kalikasan, kabuhayan, kultura, at mga ugnayang nagbubuklod sa atin, mas nagiging matalino ang ating pagkilos. Ang tunay na katatagan ay hindi lamang paghahanda sa sakuna. Ito ay ang kakayahan ng isang pamayanan na matutong umangkop, magtulungan, at patuloy na umunlad anuman ang pagbabago." },

          { t: "prose", label: "Sa Susunod na Ulat", paras: [
            "Sa susunod na isyu, ipakikilala natin ang Baganihan Community Resilience Scorecard, isang simpleng kasangkapan upang sama-samang masukat ang kalagayan ng ating pagkain, tubig, kabuhayan, kalikasan, kahandaan, at Bayanihan.",
            "Sa Baganihan, hindi tayo naghihintay ng krisis upang kumilos. Nagmamasid tayo. Natututo tayo. Nagtutulungan tayo. Sama-sama tayong umuunlad.",
          ]},
        ],
      },
    },
  },
];

export const getReport = (slug) => baganihanReports.find((r) => r.slug === slug);
