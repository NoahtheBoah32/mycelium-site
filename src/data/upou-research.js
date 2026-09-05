// Two peer-reviewed studies from the University of the Philippines on how permaculture
// actually lives in Filipino hands. Rendered by src/pages/resources/research/[slug].astro
// and listed as cards on /resources.
//
// Block types used in `blocks`:
//   p        { paras: [html] }                       running text; first p block gets the drop cap
//   h        { kicker, text }                        section heading (text may hold <em>)
//   fig      { src, pos, alt, caption, size }        size: 'col' | 'wide' | 'full'
//   duo      { items: [{ src, pos, alt, caption }] } two portrait figures side by side
//   quote    { text, cite }                          pull quote
//   stats    { label, items: [{ n, label }], note }  number strip
//   list     { label, items: [{ term, text }] }      definition rows
//   plate    { kicker, text, sub }                   full-width dark statement
//   paperfig { tag, src, alt, caption, source }      a real figure from the paper

const IMG = "/images/research/";
const JNS_URL = "https://journalofnaturestudies.org/issue-details.php?artid=41";
const JNS_PDF = "https://journalofnaturestudies.org/files/41/1-21_Flores_Working%20Nature%20Perspectives.pdf";

export const upouStudies = [
  // =====================================================================
  // A. Working with Nature (Flores & Buot, 2023)
  // =====================================================================
  {
    slug: "working-with-nature",
    kicker: "UP Los Baños · Journal of Nature Studies · 2023",
    title: "What does permaculture <em>actually mean</em> in the Philippines?",
    dek: "Dr. Jabez Joshua M. Flores and Professor Inocencio E. Buot, Jr. spent three months on twelve Filipino farms, asking seventeen practitioners a question nobody had put to them before. The answers came back in three different shapes, and each one was written into the land.",
    authorsLine: "Dr. Jabez Joshua M. Flores and Professor Inocencio E. Buot, Jr.",
    readTime: 9,

    cardTitle: "Working with Nature: How Filipino Practitioners See Permaculture",
    cardSummary: "Two UP researchers spent three months on twelve Filipino farms asking seventeen practitioners what permaculture means to them. Three different answers came back, and each one showed up in the shape of the land.",
    cardImage: IMG + "a04-hands.jpg",
    cardPos: "center 45%",

    hero: {
      src: IMG + "a01-mosaic.jpg",
      pos: "center 50%",
      alt: "A patchwork of Filipino farm plots seen from above",
      caption: "Twelve sites, nine of them in Luzon. The researchers visited each one between August and November 2018.",
    },

    authors: [
      { name: "Dr. Jabez Joshua M. Flores", note: "Corresponding author. Environmental scientist working in landscape ecology and agroecology. Senior Lecturer at the University of the Philippines Open University and at UP Los Baños." },
      { name: "Professor Inocencio E. Buot, Jr.", note: "Professor Emeritus of the University of the Philippines. Botanist and plant ecologist at UP Los Baños, and former Dean of the Faculty of Management and Development Studies at the UP Open University." },
    ],

    paper: {
      journal: "Journal of Nature Studies",
      journalShort: "Journal of Nature Studies",
      volume: "22",
      issue: "1",
      year: "2023",
      pages: "1–21",
      institution: "University of the Philippines Los Baños",
      institutionSub: "Los Baños, Laguna",
      factLabel: "Fieldwork",
      factValue: "12 farms, 17 practitioners",
      factSub: "August to November 2018, from Isabela to Zamboanga del Sur",
      url: JNS_URL,
      pdf: JNS_PDF,
      urlShort: "journalofnaturestudies.org",
      funding: "The study was funded by the Southeast Asian Regional Center for Graduate Study and Research in Agriculture (SEARCA) and the Department of Science and Technology Accelerated Science and Technology Human Resource Development Program (DOST-ASTHRDP).",
    },

    apa: {
      authors: "Flores, J. J. M., & Buot, I. E., Jr.",
      year: "2023",
      title: "Working with nature: Practitioners’ perspectives on permaculture design in agricultural landscapes in the Philippines.",
      journal: "Journal of Nature Studies",
      volume: "22",
      issue: "1",
      pages: "1–21",
      url: JNS_URL,
    },

    related: "virtual-corridors",

    blocks: [
      { t: "p", paras: [
        "When a farm is treated as a factory, the farm slowly eats itself. Output and profit become the only measures that count, and the soil, the water table, the insects, and everything else living around that field quietly pay the bill. The researchers call this a reductionist view, a way of seeing that shrinks a whole living farm down to a single number. Their paper opens with that view and then asks a gentler question. What happens when Filipino farmers begin somewhere else entirely?",
        "Permaculture is where many of them begin. It is a design framework born in Australia in the 1970s as a grassroots answer to the oil crisis, built around twelve principles such as <em>observe and interact</em> and <em>use small and slow solutions</em>. Its founders, Bill Mollison and David Holmgren, aimed it squarely at people without farming backgrounds. To most of the practitioners in this study, permaculture was their first introduction to sustainability of any kind.",
      ]},
      { t: "fig", size: "wide", src: IMG + "a02-cracked.jpg", pos: "center 55%", alt: "Cracked, dry farm soil under harsh light", caption: "A reductionist view of agriculture as food production for profit, the paper opens, often leads to the unsustainable management of the land and the ecosystems around it." },

      { t: "h", kicker: "The question", text: "Nobody had asked <em>Filipino practitioners</em> how they define it" },
      { t: "p", paras: [
        "Permaculture has been studied on farms in Cuba, Japan, Nepal, Turkey, and Malawi. Very little of that work had looked at the Philippines. So from August to November 2018, Dr. Flores and Professor Buot travelled to twelve permaculture sites. Nine of them were in Luzon. The remaining four were spread across the Visayas and Mindanao. At each one they sat down with the practitioners for key informant interviews, gathered families and farm staff for focus group discussions, and then did something unusual for a journal paper. They picked up their phones and started filming.",
        "The technique is called vlogging, short for video blogging, and here it worked as a form of field journal. The researchers followed each practitioner for three days and documented how their beliefs showed up in what they actually did on the land. The sixteen episodes were produced and edited by the researchers themselves and shared on Facebook and YouTube, so the knowledge went straight back to the community it came from. Anyone who preferred to stay off camera was simply left out of the footage.",
      ]},
      { t: "fig", size: "wide", src: IMG + "a03-vlog.jpg", pos: "center 45%", alt: "A mobile phone filming a farmer at work in a vegetable plot", caption: "Field observation ran on mobile phones. The team followed each practitioner for three days, cut the footage into a sixteen-episode vlog series, and released it as free educational material." },

      { t: "h", kicker: "Who is practising", text: "Only three of the seventeen <em>came from agriculture</em>" },
      { t: "stats", label: "The seventeen practitioners", items: [
        { n: "17", label: "practitioners across twelve sites" },
        { n: "3", label: "had a background in agriculture" },
        { n: "13", label: "owned the land they worked" },
        { n: "15", label: "had taken a workshop or a Permaculture Design Certificate course" },
      ]},
      { t: "p", paras: [
        "The rest arrived from somewhere else completely. Information technology. An airline pilot. A nurse. A ski instructor turned Christian missionary. A psychology professor. A landscape architect. Ten were men and seven were women. Thirteen owned the land they worked and four were staff. What united them was a decision to learn. Fifteen of the seventeen had gone through a workshop or a full Permaculture Design Certificate course, the PDC, which is the standard training a practitioner takes before designing a site.",
        "Here is the detail the researchers found most interesting. A person’s profession had no measurable effect on how they defined permaculture. The pilot and the nurse were as likely to talk about nature as the agriculturist was. Whatever shaped their view, it was something other than the job title.",
      ]},
      { t: "fig", size: "col", src: IMG + "a04-hands.jpg", pos: "center 50%", alt: "Weathered hands holding freshly pulled seedlings", caption: "Backgrounds ranged from software to aviation. The researchers found that a practitioner’s profession had no bearing on how they defined the practice." },

      { t: "h", kicker: "What they kept saying", text: "The word that surfaced most <em>was people</em>" },
      { t: "p", paras: [
        "Every interview was transcribed and run through word cloud analysis, a simple method that counts how often each word appears and draws the frequent ones larger. For a practice most of us file under farming, the vocabulary kept drifting toward each other. The crops came second.",
      ]},
      { t: "stats", label: "Most repeated words across the transcripts", items: [
        { n: "44", label: "people" },
        { n: "39", label: "gulay" },
        { n: "34", label: "organic" },
        { n: "32", label: "food" },
        { n: "31", label: "baboy" },
      ], note: "Gulay means vegetables and baboy means pig. Native pigs came up again and again as the animal that fits a Filipino permaculture farm best." },
      { t: "p", paras: [
        "<em>People</em> appeared most often in Metro Manila and Mountain Province, where it carried the sense of stewardship and a culture of respect for nature as a giver of life. <em>Organic</em> came up because for most of the seventeen, their permaculture journey had begun inside the organic agriculture network. The word cloud was a doorway. Behind it sat three quite different ways of seeing.",
      ]},
      { t: "fig", size: "wide", src: IMG + "a05-gulay.jpg", pos: "center 50%", alt: "A basket of freshly harvested Filipino vegetables", caption: "Gulay, organic, food, baboy. Four of the five most repeated words describe what people grow and raise. The most repeated one described who they share it with." },

      { t: "h", kicker: "Three ways of seeing", text: "Nobody defined it <em>the same way</em>" },
      { t: "p", paras: [
        "Some explained permaculture through nature. Some called it a way of life. Some described it as food production. When the definitions were laid side by side, the researchers noticed something kind. None of them were wrong. None of them were complete either. Each one quietly revealed what mattered most to the person saying it, which is a different thing from what they knew.",
      ]},
      { t: "list", label: "The three perspectives", items: [
        { term: "Ecological", text: "Shared at <strong>seven sites</strong>. Nature has worth of its own, and the practitioner is a participant in a larger ecosystem, an observer long before a designer." },
        { term: "Socio-cultural", text: "Shared at <strong>three sites</strong>. Permaculture is a way of living that reaches past the garden into food culture and into how a household runs its day." },
        { term: "Agricultural", text: "Shared at <strong>two sites</strong>. Permaculture is a way to grow food sustainably, and the farm is measured by what it feeds." },
      ]},
      { t: "fig", size: "col", src: IMG + "a06-prism.jpg", pos: "center 42%", alt: "Light splitting through a glass prism into separate colours", caption: "One practice, three perspectives. The researchers describe each definition as a fragment that shows where a practitioner places their emphasis." },

      { t: "h", kicker: "Perspective one · Ecological", text: "Seven farms saw themselves <em>inside the ecosystem</em>" },
      { t: "quote", text: "Let nature do the job for you.", cite: "A practitioner in Isabela, asked to define permaculture" },
      { t: "p", paras: [
        "This was the most common view by far. These practitioners treat nature as having worth of its own and take the role of observer long before they take the role of designer. The researchers describe the view as ecocentric, a word that simply means the ecosystem sits at the centre and the human takes a seat beside it. A practitioner from Quezon put it as <em>follow the movement of water</em>, describing how rainwater running over the ground had shaped the contours of their whole farm. Another from Metro Manila said permaculture is about energy and patterns.",
        "In Quezon the philosophy became livestock. The family had watched their native pigs eat through every bit of vegetation in the forest when they were left to roam. So they let them. The pigs now clear patches of land and fertilise the soil with their manure as they go, because that is simply what pigs do. On the same farm the practitioners noticed stingless bees building hives inside discarded coconut husks, and started making beehives out of the husks that were already lying everywhere.",
      ]},
      { t: "duo", items: [
        { src: IMG + "a08-coconut-bees.jpg", pos: "center 50%", alt: "Stingless bees at the opening of a coconut husk hive", caption: "Stingless bees had already chosen coconut husks. The farm in Quezon followed their lead and built hives from the husks it had in abundance." },
        { src: IMG + "a12-pig.jpg", pos: "center 50%", alt: "A native black pig rooting through forest undergrowth", caption: "Native pigs released into the forest clear undergrowth and fertilise as they go. The paper files this under animal behaviour and nutrient cycling." },
      ]},
      { t: "p", paras: [
        "Organic farming came up constantly in this group. To them it was the system that fit their context because it relied on natural inputs and biological ways of handling pests. The researchers are honest about the trade. A farm run this way may not match a conventional farm on yield in any single season. Over the long term it pays back in biodiversity and soil health, which is the timescale these practitioners were already thinking on.",
      ]},
      { t: "fig", size: "wide", src: IMG + "a07-forestfloor.jpg", pos: "center 50%", alt: "Leaf litter and new shoots on a forest floor", caption: "The ecological view treats the forest floor as the teacher. Decomposition and water retention were the concepts the vlogs from these farms returned to most often." },

      { t: "h", kicker: "Perspective two · Socio-cultural", text: "Three farms treat it as <em>a way of living</em>" },
      { t: "p", paras: [
        "These practitioners grow food without ever calling themselves farmers. That is the detail that sets the group apart. The design principles reach past the garden into how a business is run and how a household eats. The researchers note that this is the most common version of permaculture worldwide, found in studies from Australia and Belgium to Brazil and Japan, and that on the surface it can look like a middle-class pursuit. Look closer and it is where the human side of the practice lives.",
        "In Mountain Province an Igorot family realised that the framework they were being taught matched practices their ancestors had used for generations. They still gather sapsapon, a wild green their elders cooked, which grows on its own and asks nothing of anyone. Permaculture, they said, is a way of life. <em>Our</em> way of life. In Cebu the practitioners quoted Bill Mollison’s line that the problem is the solution, and used it to describe how they handle the daily challenges of a family business.",
      ]},
      { t: "duo", items: [
        { src: IMG + "a10-terraces.jpg", pos: "center 50%", alt: "Stone-walled rice terraces in Mountain Province at dawn", caption: "In Mountain Province the practice had a name long before it had a certificate. The family linked their Igorot heritage directly to what the PDC was teaching them." },
        { src: IMG + "a09-table.jpg", pos: "center 50%", alt: "A shared meal laid out on a wooden table", caption: "A socio-cultural perspective puts the table at the centre. Food culture and personal relationships were the human dimensions this group kept returning to." },
      ]},

      { t: "h", kicker: "Perspective three · Agricultural", text: "Two farms measure it <em>in what it feeds</em>" },
      { t: "p", paras: [
        "The least common perspective, and the one the researchers suggest may be the most balanced of the three. Production sits at the centre here, reached through organic methods and through aquaponics, a system that raises fish and vegetables in one loop so that the fish feed the plants and the plants clean the water.",
        "In Laguna a practitioner built his income on organic lechon from native pigs. He found a real market in that niche, and his farm went on to become a Department of Agriculture field school for sustainable pig farming. In Palawan another ran an aquaponics system that fed his family, his staff, the children in their orphanage, and walk-in customers. Both farms also earned from training workshops and agritourism, which points to a quiet truth in the paper. Most permaculture farms in the study earned more from teaching than from what they harvested. Whether that is a good thing, the researchers write, is still up for debate.",
      ]},
      { t: "fig", size: "wide", src: IMG + "a11-aquaponics.jpg", pos: "center 50%", alt: "Vegetables growing above a fish tank in an aquaponics system", caption: "Aquaponics in Palawan. Fish and vegetables share one closed loop, and the harvest fed the family and the children in their orphanage." },

      { t: "fig", size: "full", src: IMG + "a13-swale.jpg", pos: "center 50%", alt: "A curved swale cut along the contour of a hillside farm", caption: "A swale follows the contour of the land to catch rainwater. Whether a practitioner cuts one, and where, says something about how they see the world." },
      { t: "plate", kicker: "The finding", text: "An individual’s worldview is manifested in the <em>design of their habitat.</em>", sub: "The researchers state it plainly. Perspective drives the decisions, and the decisions shape the form and the function of the farm. Walk someone’s land carefully enough and you are reading their mind." },

      { t: "h", kicker: "Why it matters", text: "Different views, <em>the same destination</em>" },
      { t: "p", paras: [
        "No perspective was found to be more correct than another, and that turns out to be the whole point. The differences let each practitioner own their design completely while still handing it to someone else to interpret their own way. A finding from one farm, whether it came from experience or from experiment, can be shared on social media or at a conference and land differently on the next farm. That freedom is what keeps the practice spreading.",
        "The paper closes with an invitation. A larger study across more sites would surface more variations, and sharing them openly would help ordinary households find their own style within what permaculture calls a permanent culture. That is close to the reason Mycelium exists. If you have been wondering which of the three ways of seeing is yours, the study suggests the land you tend has probably already answered.",
      ]},
      { t: "fig", size: "col", src: IMG + "a14-seeds.jpg", pos: "center 50%", alt: "Assorted seeds spread across an open palm", caption: "The same seeds, planted by three different worldviews, become three different farms. The goal of a permanent culture stays the same." },
    ],
  },

  // =====================================================================
  // B. Creating Virtual Corridors (Flores, Obrero, Gelisan, Foronda & Mendiola, 2017)
  // =====================================================================
  {
    slug: "virtual-corridors",
    kicker: "UP Open University · IJODeL · 2017",
    title: "Can a Facebook friend list <em>redraw a landscape?</em>",
    dek: "A team led by Dr. Jabez Joshua M. Flores took one man’s Facebook network, 1,267 friends gathered since 2011, and asked which of those friendships were strong enough to carry permaculture from one garden to another. Fourteen were. Ten of them are drawn on a real map.",
    authorsLine: "Dr. Jabez Joshua M. Flores, Rick Jason Obrero, Luisa A. Gelisan, Edward Allan Foronda, and Rikki Lee Mendiola",
    readTime: 10,

    cardTitle: "Creating Virtual Corridors: Permaculture Networks on Facebook",
    cardSummary: "Can a Facebook friendship carry permaculture from one garden to another? A UP Open University team scored 286 connections and found fourteen strong enough to count as living corridors across Luzon.",
    cardImage: IMG + "b12-archipelago.jpg",
    cardPos: "center 50%",

    hero: {
      src: IMG + "b01-delta.jpg",
      pos: "center 50%",
      alt: "A river delta seen from above, its channels branching like a network",
      caption: "In landscape ecology a corridor is a strip of land that joins two patches of habitat. The study asked whether a friendship could do the same job.",
    },

    authors: [
      { name: "Dr. Jabez Joshua M. Flores", note: "Lead author. Environmental scientist working in landscape ecology and socio-ecological networks. Senior Lecturer at the University of the Philippines Open University and at UP Los Baños." },
      { name: "Rick Jason Obrero", note: "Instructor, University of the Philippines Los Baños, as listed in the paper." },
      { name: "Luisa A. Gelisan", note: "University Researcher, University of the Philippines Open University, as listed in the paper." },
      { name: "Edward Allan Foronda", note: "Permaculture practitioner." },
      { name: "Rikki Lee Mendiola", note: "University Extension Specialist, University of the Philippines Los Baños, as listed in the paper." },
    ],

    paper: {
      journal: "International Journal on Open and Distance e-Learning",
      journalShort: "IJODeL",
      volume: "3",
      issue: "2",
      year: "2017",
      pages: "13–37",
      institution: "University of the Philippines Open University",
      institutionSub: "with UP Los Baños",
      factLabel: "The network",
      factValue: "286 people from one friend list",
      factSub: "1,267 friends and 18 permaculture groups, September 2012 to January 2016",
      url: "https://ijodel.upou.edu.ph/ijodel/article/view/22",
      pdf: "https://ijodel.upou.edu.ph/ijodel/article/view/22/58",
      urlShort: "ijodel.upou.edu.ph",
      funding: null,
    },

    apa: {
      authors: "Flores, J. J. M., Obrero, R. J., Gelisan, L. A., Foronda, E. A., & Mendiola, R. L.",
      year: "2017",
      title: "Creating virtual corridors: Social network discovery and landscape patch connectivity of permaculture projects and initiatives on Facebook.",
      journal: "International Journal on Open and Distance e-Learning",
      volume: "3",
      issue: "2",
      pages: "13–37",
      url: "https://ijodel.upou.edu.ph/ijodel/article/view/22",
    },

    related: "working-with-nature",

    blocks: [
      { t: "p", paras: [
        "How does Facebook enable people to practise permaculture in real life? That is the first sentence of the study, and it came from scrolling. The lead researcher kept seeing photos of friends’ garden projects in his newsfeed, alongside the endless gardening memes and how-to posts that fill any permaculture group. With so much of daily life now documented online, he wondered how much of that activity translated into actual practice on actual land.",
        "Permaculture is a design system conceptualised in Australia in the 1970s, and in the decades since it has spread mostly through social media, with universities arriving late to the conversation. Researchers have a name for knowledge that lives that way. They call it <em>feral ecology</em>, ecological discourse that escaped the academy and went to live with ordinary people. This study was an attempt to track a feral idea across a map.",
      ]},

      { t: "h", kicker: "Start with the ecology", text: "In nature, a corridor <em>is a strip of land</em>" },
      { t: "p", paras: [
        "Landscape ecology, the branch of science that studies how the pieces of a landscape fit together, has a word for a thin band of habitat joining two larger patches of forest. It is a corridor. Seeds, birds, insects, and small animals travel along it, and because they travel, both patches stay alive. Cut the corridor and the patches slowly starve on their own.",
      ]},
      { t: "fig", size: "wide", src: IMG + "b02-corridor.jpg", pos: "center 50%", alt: "A narrow strip of forest connecting two larger woodlands across farmland", caption: "A corridor in landscape ecology. Two patches of habitat stay healthy because something living can move between them." },
      { t: "p", paras: [
        "The team borrowed the idea and moved it online. They defined a virtual corridor as a friendship strong enough to carry permaculture itself, the knowledge and the practice, from one person’s land to another’s. You cannot walk it. It still moves things. And if the corridor is real, the two gardens at either end of it are the landscape patches it connects.",
      ]},
      { t: "fig", size: "col", src: IMG + "b03-web.jpg", pos: "center 50%", alt: "A spider web strung between two branches, beaded with dew", caption: "A virtual corridor has no soil of its own. It is a link between two people that permaculture can travel along." },

      { t: "h", kicker: "The sample", text: "The study area was <em>one man’s friend list</em>" },
      { t: "p", paras: [
        "The terrain here was the lead researcher’s own Facebook account, a network he had been building since 2011. It held 1,267 people. Membership in eighteen permaculture-related Facebook groups narrowed that down to 286 people who might plausibly be carrying the practice. Each of them became a node, a single point in the network, and the researcher himself became the focal node at the centre, the point every line would be measured from.",
      ]},
      { t: "stats", label: "The network", items: [
        { n: "1,267", label: "friends on the account, gathered since 2011" },
        { n: "18", label: "permaculture groups used as the filter" },
        { n: "286", label: "people who might be carrying the practice" },
        { n: "4", label: "years of activity pulled, September 2012 to January 2016" },
      ]},
      { t: "fig", size: "wide", src: IMG + "b04-mangrove.jpg", pos: "center 50%", alt: "Mangrove roots tangled together above tidal water", caption: "One account, 1,267 people, eighteen groups. The filter left 286 candidates, and each became a node in the network." },

      { t: "h", kicker: "Building a metric", text: "How do you measure a friendship <em>in soil?</em>" },
      { t: "p", paras: [
        "The team built a score that did not exist before and called it Percentage Linkage Strength. It asks one question. How much permaculture actually travels down this connection? Forty percent of the answer comes from what happens online, and sixty percent comes from what exists on the ground. Those two halves have names of their own.",
      ]},
      { t: "list", label: "The two halves of the score", items: [
        { term: "Social Score<br>40 points", text: "How alive the friendship is on Facebook. A script written in R, a programming language built for statistics, pulled every like and every comment the person left on the researcher’s account between September 2012 and January 2016. Shared group membership was measured on the Bogardus social distance scale, a psychology tool from the 1920s that gauges how close one person is willing to let another come." },
        { term: "Permaculture Score<br>60 points", text: "Whether anything grows. Keeping a real permaculture project earned <strong>35 points</strong>. Having attended a training earned <strong>25</strong>. The gap was deliberate. A garden that exists counts for more than any amount of talking about gardens." },
      ]},
      { t: "duo", items: [
        { src: IMG + "b06-plankton.jpg", pos: "center 50%", alt: "Glowing plankton scattered through dark water", caption: "Four years of likes and comments, gathered by a script. Every small point of light counted." },
        { src: IMG + "b07-roots.jpg", pos: "center 50%", alt: "Plant roots reaching down through dark soil", caption: "The offline half of the score carried more weight. A project on real land was worth 35 of the 60 points." },
      ]},

      { t: "h", kicker: "The bar", text: "Being loud online <em>got you nowhere</em>" },
      { t: "p", paras: [
        "To qualify as a corridor, a person needed at least 30 of the 40 social points and 75 out of 100 overall. Run the arithmetic and something kind happens. Someone posting constantly with nothing planted could reach 40 at most. Someone with a project and training but no online presence topped out at 71. Only a person who was both active online and growing something in the ground could cross the line. The maths quietly refused to reward performance.",
      ]},
      { t: "fig", size: "wide", src: IMG + "b08-lightning.jpg", pos: "center 45%", alt: "Lightning branching across a night sky over farmland", caption: "The paper’s table of scenarios lists sixteen real-life cases. Only three qualify, and every one of the three includes a project on real land." },

      { t: "h", kicker: "The result", text: "Out of 286 people, <em>only fourteen made it</em>" },
      { t: "stats", label: "Who qualified", items: [
        { n: "14", label: "corridors found among 286 people" },
        { n: "10", label: "scored 90 or higher out of 100" },
        { n: "280", label: "likes per person on average over four years" },
        { n: "43", label: "comments per person on average" },
        { n: "4.9", label: "permaculture groups shared with the researcher, on average" },
      ], note: "Across the top ten that works out to roughly nine likes and one and a half comments a month. Nothing viral. The groups they shared most were Good Food Community and the Philippine Permaculture Association." },
      { t: "p", paras: [
        "Every one of the ten had a permaculture project running on real land, mostly home gardens. Every one had sat in a training room beside the researcher at least once. They were young organic farmers, urban gardeners, entrepreneurs, advocates, a student, and a musician, spread across Laguna, Metro Manila, Rizal, Pampanga, and Nueva Ecija. The network moving permaculture across Luzon was built out of backyards.",
      ]},
      { t: "duo", items: [
        { src: IMG + "b10-constellation.jpg", pos: "center 50%", alt: "A constellation of stars joined by faint lines", caption: "The top ten belonged to farmers, gardeners, advocates, a student, and a musician. Most of what they tended were home gardens." },
        { src: IMG + "b11-leafvein.jpg", pos: "center 50%", alt: "The branching veins of a leaf lit from behind", caption: "Corridors are built from small, repeated attention. Around nine likes and one and a half comments a month, kept up for four years." },
      ]},
      { t: "fig", size: "full", src: IMG + "b09-fireflies.jpg", pos: "center 50%", alt: "Fireflies glowing across a dark field at night", caption: "Fourteen points of light in a field of 286. Ten of them burned brightest." },

      { t: "h", kicker: "Putting it on the map", text: "Then they watched the network <em>grow, year by year</em>" },
      { t: "p", paras: [
        "The team drew the top ten as a sociogram, a diagram of who is linked to whom, using a tool called Meerkat Lite from the University of Alberta. Eleven nodes and thirteen edges. Then they did something a journal paper almost never does. They animated it.",
        "Using Google Earth they pinned all 286 people to their provinces, since Facebook only shares location down to that level, and let the years run from 2011 to 2016. Clusters bloomed across the Philippine map as each friendship formed. Then the top ten lit up, joined to the focal node by lines. The camera dropped into each one, and what surfaced was a photograph of that person’s actual garden. The whole sequence was cut together in Camtasia Studio.",
      ]},
      { t: "paperfig", tag: "Figure 2 · From the paper", src: IMG + "vc-figure2.jpg", alt: "Final frame of the GIS animation showing ten network nodes connected to the focal node on a map of Luzon", caption: "The final frame of the GIS animation. All ten network nodes stem from the focal node, and each line connects a person to a garden they actually built.", source: "Flores et al., 2017, IJODeL 3(2)." },
      { t: "fig", size: "wide", src: IMG + "b12-archipelago.jpg", pos: "center 50%", alt: "An archipelago of islands seen from high above, dotted with lights", caption: "Facebook only shares location down to the province. The researchers grouped people into provincial clusters and pinned each one somewhere inside their cluster." },

      { t: "h", kicker: "Modelling the spread", text: "They ran the whole thing <em>a thousand times</em>" },
      { t: "p", paras: [
        "The last step was a simulation in NetLogo, a program built for modelling how simple rules play out across many agents at once. The team used its rumour mill model, which treats an idea like a rumour passing from neighbour to neighbour one step at a time, and ran it a thousand times with a year as each step.",
      ]},
      { t: "stats", label: "Rumour mill results, per month", items: [
        { n: "4.2%", label: "heard of permaculture each month in year one" },
        { n: "8.3%", label: "heard of it each month by year two" },
        { n: "0.35%", label: "started practising each month in year one" },
        { n: "0.52%", label: "started practising each month by year two" },
      ], note: "In the runs that let the rumour reach more neighbours at once, awareness climbed to 83 percent by the second year. Practice still crawled. Hearing about something and doing it turned out to be very different problems, and only the second one builds a corridor." },
      { t: "fig", size: "col", src: IMG + "b13-ants.jpg", pos: "center 50%", alt: "A line of ants passing along a branch, antennae touching", caption: "Ants pass information one touch at a time. The rumour mill model spreads an idea the same way, neighbour to neighbour." },

      { t: "plate", kicker: "What it means", text: "Every online network has <em>a twin made of soil.</em>", sub: "Ten out of 286 is a small sample, and the researchers say so. The takeaway they stand behind is that an online social network has an equivalent spatial network when it comes to permaculture, and it leaves marks you can find on a map, patch by patch, garden by garden." },

      { t: "h", kicker: "Why it matters", text: "A method for <em>finding the gardens</em>" },
      { t: "p", paras: [
        "The paper suggests two uses for the method. Researchers could use it to find study sites for permaculture work, since every corridor points at a real patch of land. Practitioners could use it to see how a scatter of individual gardens might add up to landscape-scale change, the kind of effect no single backyard can produce alone. It also comes with a hopeful note. Any discovered node can become a focal node itself, with its own friend list to measure. The corridors keep branching.",
        "For Mycelium the finding lands close to home. Our whole reason for existing is to connect scattered permaculture knowledge into paths people can follow, and here is a study showing that those paths already exist between Filipino gardeners. They are only invisible until someone measures them.",
      ]},
      { t: "fig", size: "wide", src: IMG + "b14-reclaim.jpg", pos: "center 50%", alt: "Green shoots reclaiming an old paved path", caption: "Feral ecology is knowledge that left the university and went to live with ordinary people. This study followed it home." },
    ],
  },
];

export function getStudy(slug) {
  return upouStudies.find((s) => s.slug === slug);
}
