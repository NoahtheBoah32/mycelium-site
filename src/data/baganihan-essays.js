// Longform writing from the Baganihan Collective, shown on the resources page
// under Baganihan Reports alongside the situation reports.
//
// Separate route from /resources/baganihan/[slug].astro because that page renders
// the bilingual situation-report format and these pieces are single-language
// longform. Both surface under the same "Baganihan Reports" tab.
//
// Rendered by /resources/baganihan-reports/[slug].astro.

export const baganihanEssays = [
  {
    slug: "mit-horizon-resiliency-security",
    seriesLabel: "Part 1 of a series",
    date: "October 2026",
    author: "Hubert Joseph Balana Posadas",
    authorRole:
      "Convenor, The Baganihan Collective. Risk and eco-development consultant-integrator.",
    title:
      "Why traditional master planning will fail without resiliency security",
    subtitle:
      "A case for designing land, infrastructure and community as one system, rather than defending an asset from the region around it.",

    // ── card (front of the resources page) ──
    cardTitle: "Why Master Planning Will Fail Without Resiliency Security",
    cardSummary:
      "Hubert Joseph Posadas argues that Philippine land and infrastructure planning still assumes a stable climate and a predictable global economy, and that the answer is ecological design joined to organised community capacity. Part one of a series from the Baganihan Collective.",
    cardImage: "/images/baganihan/essays/baganihan-field.jpg",

    hero: "/images/baganihan/essays/baganihan-field.jpg",
    heroCaption:
      "Baganihan Collective field work across Luzon. Area assessments, tabletop exercises and community builds.",

    blocks: [
      {
        t: "lead",
        text:
          "For decades, planners treated the 1972 MIT study Limits to Growth as a distant academic exercise. Its scenarios projected that industrial expansion, resource depletion and ecological overshoot would converge on a structural tipping point somewhere in the first half of this century. My own reading is that we are standing on that horizon now. What global institutions comfortably label the polycrisis, the compounding convergence of climate disruption, supply chain fracture and economic decay, I read as the visible deceleration of industrial civilisation.",
      },

      {
        t: "prose",
        label: "Why the Philippines is exposed",
        paras: [
          "In the Philippines, the way we manage properties, corporate estates and rural land developments leaves us dangerously exposed. Our major territorial assets were engineered for a background climate and a global economy that behaved predictably. Neither assumption holds the way it used to.",
          "As a risk management practitioner who spent years conducting physical security audits for mission-critical sectors through Independent Insight Inc., I look at our national developmental footprint and see the same weaknesses repeating across very different sites.",
        ],
      },

      {
        t: "numbered",
        label: "Three structural vulnerabilities",
        items: [
          {
            title: "Centralised supply dependency",
            text:
              "Our commercial and residential hubs remain structurally brittle. Large-scale properties lean heavily on international logistics and highly centralised networks for basic operational stability, hardware and specialised resources. The Philippines is among the largest rice importers in the world and sources the overwhelming majority of its fertiliser from abroad. In a sustained economic contraction, those long lines are the first thing to thin out.",
          },
          {
            title: "Catchment collapse",
            text:
              "Baseline engineering models here are badly out of date. Mass land developers still clear topsoil and pave over natural topography, which disrupts local hydrology. When an unusually heavy monsoon or a severe typhoon arrives, cleared sites produce severe soil erosion, flash flooding onto adjacent properties and, in the worst cases, foundation failure. Of everything in this essay, this is the most measurable and the easiest to verify on the ground.",
          },
          {
            title: "Geographic position",
            text:
              "The Philippines sits at the centre of escalating superpower friction in the Asia-Pacific. Our maritime borders, shipping lanes and communication networks are exposed to external pressure. In a regional conflict, a centralised and highly visible territorial asset is a straightforward target for digital sabotage, local resource competition or simple supply interruption. I cannot tell you that such a conflict is coming. I can tell you the exposure is real and currently unplanned for.",
          },
        ],
      },

      {
        t: "image",
        src: "/images/baganihan/essays/polycrisis-cascade.jpg",
        caption:
          "How a single shock travels. The Cascade Institute traced the Ukraine-Russia war through food, energy, shipping, economy and domestic politics at the same time. This is the mechanism behind the word polycrisis.",
        credit: "Diagram by Michael Lawrence, Cascade Institute.",
      },

      {
        t: "prose",
        label: "The fatal flaw of hard isolation",
        paras: [
          "When property managers meet a heightened threat, the industrial-era reflex is asset hardening. Higher seawalls, heavier surveillance, taller fences, all of it meant to isolate a valuable asset from the geography and the population around it.",
          "In a compounding crisis, a hard fence is a point of brittleness rather than strength. A development operating as an island of resources inside an unravelling regional economy becomes a target for resource competition and community friction. Concrete walls cannot repair a broken watershed, and they cannot hold together an unravelling local social fabric. If the community outside your boundary reads your asset as an environmental liability or a corporate invader, your physical security model has already failed.",
        ],
      },

      {
        t: "pullquote",
        text:
          "A walled compound inside a struggling region still drinks the same water and still stands on the same slope.",
      },

      {
        t: "prose",
        label: "Resiliency security",
        paras: [
          "I would retire the passive vocabulary of sustainability. You cannot sustain a system that is already under strain, and the word has been worn smooth by overuse. What I am arguing for instead is resiliency security through decentralised preparation.",
          "Resiliency security means using ecological design and landscape biology as a form of territorial defence. Through the lens of industrial permaculture, the landscape is not real estate to be conquered. It is a living, productive system designed to catch and slow energy, water and risk.",
          "Rather than clearing land, design multi-tiered biological shields. Targeted earthworks, micro-swales and deep-rooted native vegetation anchor vulnerable topsoil, hold back off-site flash flooding and reduce ambient temperatures around infrastructure. None of this is novel and none of it is speculative. It is ordinary landscape hydrology applied deliberately and early, instead of being fought expensively later.",
        ],
      },

      {
        t: "prose",
        label: "Scientific Bayanihan",
        paras: [
          "Biology alone is not enough. The social matrix has to be engineered too, and this is where the Baganihan Collective works.",
          "As an initial phase of preparing for compounding risk, we focus on engaging communities to establish decentralised networks of regional resilience. We do that through Scientific Bayanihan, which takes a sentimental cultural ideal and turns it into a rigorous social method. Through that framework we organise human resources and community capability so they integrate directly with the territorial layout.",
          "By designing decentralised, productive dual-use agricultural buffers, where local farming cooperatives and indigenous knowledge holders cultivate shade-tolerant crop guilds within or alongside property boundaries, a spatial liability becomes a self-contained, shock-absorbing ecosystem.",
          "When a community's food security, water access and livelihood are stitched into the structural survival of a territorial asset, that community becomes the most effective security arrangement available to it.",
        ],
      },

      {
        t: "image",
        src: "/images/baganihan/essays/baganihan-system.jpg",
        caption:
          "The Baganihan system in full. Area assessment, tabletop exercise, Taglay mapping, a ninety day sprint, then build resilience and repeat. Mycelium is the digital platform inside it.",
        credit: "Baganihan, The Community Resilience System. Powered by Kabuohan.",
      },

      {
        t: "prose",
        label: "What I am asking planners to do",
        paras: [
          "We can no longer afford to design developments that merely occupy land. Master planning has to make the land, the infrastructure and the surrounding community capable of absorbing shock together.",
          "The choice, as I see it, is between building higher fences and waiting for them to be tested, or lowering them and integrating the asset into a decentralised network of territorial resilience.",
        ],
      },

      {
        t: "callout",
        label: "Coming in part two",
        text:
          "The field protocols of Deep Spatial Diagnosis, and how hydrological architecture is applied to high-stakes assets.",
      },
    ],

    tags: [
      "Resiliency Security",
      "Scientific Bayanihan",
      "Baganihan Collective",
      "Industrial Permaculture",
      "Polycrisis",
      "Limits to Growth",
    ],

    // ── closing note ──
    // Short, and placed after the piece. It frames whose argument this is and
    // points the reader to Common Ground. It is not a fact-check.
    closing: {
      label: "A note from Mycelium",
      paras: [
        "This is one practitioner writing from inside the work. The argument is his rather than ours, and we publish it because the questions underneath it deserve a real conversation.",
        "Read it closely and decide for yourself what holds and where you would push back. Then bring that to Common Ground, where the rest of the community is working through the same questions.",
      ],
    },
  },
];
