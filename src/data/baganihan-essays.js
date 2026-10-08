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
      "Hubert Joseph Balana Posadas argues that Philippine land and infrastructure planning still assumes a stable climate and a predictable global economy, and that the answer is ecological design joined to organised community capacity. Part one of a series from the Baganihan Collective.",
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
              "Our commercial and residential hubs remain structurally brittle. Large-scale properties lean heavily on international logistics and highly centralised networks for basic operational stability, hardware and specialised resources. The Philippines is among the largest rice importers in the world and buys most of its fertiliser from abroad. In a sustained economic contraction, those long lines are the first thing to thin out.",
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
          "How a single shock travels. An expert panel at the Cascade Institute traced the Ukraine-Russia war through food, energy, shipping, economy and domestic politics at the same time. This is one way the word polycrisis plays out in practice.",
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
          "Rather than clearing land, design multi-tiered biological shields. Targeted earthworks, micro-swales and deep-rooted native vegetation anchor vulnerable topsoil, hold back off-site flash flooding and reduce ambient temperatures around infrastructure. These are established landscape-hydrology techniques, most effective when they are designed to the site. Applied early, they cost far less than fighting the same water later.",
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
          "The Baganihan system in full. Area assessment, tabletop exercise, Taglay mapping, a ninety day sprint, then build resilience and repeat. Mycelium is the digital platform used with this programme.",
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
  {
    slug: "permaculture-beyond-the-farm",
    seriesLabel: "From the Convenor",
    date: "October 2026",
    author: "Hubert Joseph Balana Posadas",
    authorRole:
      "Convenor, The Baganihan Collective. Risk and eco-development consultant-integrator.",
    title: "Permaculture beyond the farm: permanent culture, resilience and security",
    subtitle:
      "If permaculture also means permanent culture, then what keeps a community working through uncertainty belongs inside the design.",

    // ── card (front of the resources page) ──
    cardTitle: "Permaculture Beyond the Farm: Permanent Culture, Resilience and Security",
    cardSummary:
      "Hubert Joseph Balana Posadas asks what permanent culture has to include if communities are to stay functional under stress. Drawing on risk management and community security work in the Philippines, he reads bayanihan as distributed capacity and argues that security may already be part of the culture permaculture is trying to design.",
    cardImage: "/images/baganihan/essays/permanent-culture-field.jpg",

    hero: "/images/baganihan/essays/permanent-culture-field.jpg",
    heroCaption:
      "On an upland site in the Philippines. Much of what keeps a place like this functional is unwritten: relationships, local knowledge and who notices what. Photo: Hubert Joseph Balana Posadas.",

    blocks: [
      {
        t: "lead",
        text:
          "If permaculture is not only about permanent agriculture but also about Permanent Culture, then perhaps we need to look more closely at what allows communities to remain functional through uncertainty.",
      },

      {
        t: "prose",
        label: "Human systems around the ecological ones",
        paras: [
          "Permaculture already deals with ecological resilience: soil, water, food, energy, biodiversity and regenerative landscapes. But these systems exist within human systems. When conditions become difficult, we also need to ask whether people can continue cooperating, making decisions, sharing resources and protecting essential functions.",
          "My background in risk management and community security has led me to look at permaculture from this perspective.",
        ],
      },

      {
        t: "prose",
        label: "What security covers",
        paras: [
          "Security is not only about crime or physical attack. It includes the continuity of food, water, livelihoods, ecological systems, knowledge, relationships and decision-making. But disruption is not always accidental. Communities can also face conflict, exploitation, criminal activity, sabotage and other intentional threats.",
          "This is an area I believe deserves more attention in community resilience.",
        ],
      },

      {
        t: "prose",
        label: "What I have seen on Philippine ground",
        paras: [
          "In the Philippines, I have encountered informal and often unwritten community security practices around pasang bilis, kasanga, tactical approaches and Barangay Intelligence Networks. I do not present these as universal models. My exposure is based on Philippine ground conditions, and those working elsewhere would need to study the equivalent systems within their own communities.",
          "What interests me is the underlying principle: some of the most important security technologies in a community may not look like security technologies at all.",
          "They may exist as relationships, trust, local knowledge, communication patterns, mutual observation, early warning and reciprocal responsibility.",
        ],
      },

      {
        t: "prose",
        label: "Bayanihan as distributed capacity",
        paras: [
          "This connects strongly with my observations of Bayanihan.",
          "Bayanihan is often described simply as Filipinos helping one another. From a resilience perspective, I see it as distributed social capacity: when individual capacity is insufficient, relationships allow people to pool labour, knowledge, resources and responsibility.",
          "But Bayanihan cannot simply be manufactured. Programs can organise participation, but they cannot automatically create the trust, reciprocity and pakikipagkapwa that make genuine collective action possible.",
        ],
      },

      {
        t: "pullquote",
        text: "One does not manufacture Bayanihan. One enters into relationship.",
      },

      {
        t: "prose",
        label: "The parallel with permaculture",
        paras: [
          "There is a strong parallel with permaculture. We do not manufacture an ecosystem. We observe its existing relationships, resources and constraints, then design interventions that strengthen rather than replace them.",
          "Perhaps community design should work the same way.",
          "Before asking what intervention we should bring, we can ask: what relationships, knowledge, assets, vulnerabilities and protective capacities already exist here? What happens to them under stress? And what happens when the disruption is intentional rather than accidental?",
        ],
      },

      {
        t: "prose",
        label: "Resiliency security",
        paras: [
          "This is where I see Resiliency Security developing: connecting risk management, ecological resilience and community capability so communities can anticipate, absorb, adapt, recover and protect essential functions.",
          "I also suspect this is not uniquely Filipino. Other communities may have their own forms of what I would call cultural security technologies: unwritten ways of maintaining awareness, cooperation, protection and continuity.",
          "The challenge is not to copy Bayanihan, but to look at our own ground and discover what already exists.",
        ],
      },

      {
        t: "prose",
        label: "The question for permaculture",
        paras: [
          "If Permanent Culture is about maintaining essential capacities while adapting to change, then perhaps security is part of that culture.",
          "The question becomes: how do we design not only landscapes capable of enduring, but cultures capable of caring for those landscapes, protecting their relationships, and remaining functional when conditions become difficult?",
          "That, to me, is an important question for permaculture to explore.",
        ],
      },
    ],

    tags: [
      "Permanent Culture",
      "Resiliency Security",
      "Bayanihan",
      "Community Security",
      "Baganihan Collective",
      "Permaculture",
    ],

    // ── closing note ──
    closing: {
      label: "A note from Mycelium",
      paras: [
        "This is one practitioner writing from inside the work. The argument is his rather than ours, and we publish it because the questions underneath it deserve a real conversation.",
        "Read it closely and decide for yourself what holds and where you would push back. Then bring that to Common Ground, where the rest of the community is working through the same questions.",
      ],
    },
  },
];
