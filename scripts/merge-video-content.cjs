const fs = require('fs');
const path = require('path');

const videosPath = path.join(__dirname, '../public/data/videos.json');
const videos = JSON.parse(fs.readFileSync(videosPath, 'utf8'));

const GEOFF_BIO = 'Geoff Lawton is a world renowned permaculture consultant, designer and teacher. He first took his Permaculture Design Certificate (PDC) Course in 1983 with Bill Mollison, widely considered the "father of permaculture." Geoff has undertaken thousands of jobs teaching, consulting, designing, administering and implementing, in 6 continents and over 50 countries around the world.';
const GEOFF_THUMB = 'https://secure.gravatar.com/avatar/ca88db5714ce5ba92d66c2ff80b8ac14ad7ad189c131d54aafa3854cebd08363?s=96&d=mm&r=g';
const GEOFF_ROLE = 'Permaculture Consultant & Designer';

const HUBERT_BIO = 'Hubert Posadas is a Filipino permaculture practitioner and community organizer leading the Bayanihan Project, a program that integrates modern permaculture with indigenous Filipino practices across six pilot communities nationwide. His work is rooted in the belief that food security and community resilience are inseparable, drawing on the Filipino value of bayanihan as the foundation for sustainable land stewardship.';
const HUBERT_THUMB = 'https://secure.gravatar.com/avatar/56bdba3d8d5e2178b74a425a46edd195748af0af7ac6fe02e3d2913c5c3b6a1a?s=96&d=mm&r=g';
const HUBERT_ROLE = 'Filipino Permaculture Practitioner';

const PPA_BIO = 'Bert Peeters and Sixto Bereber are permaculture educators and long-time practitioners leading the Philippine Permaculture Association (PPA). Through the Kapitbahay: Kwentong Permakultura series, they share conversations and practical insights on soil health and community-based permaculture in the Philippine context.';
const PPA_THUMB = 'https://secure.gravatar.com/avatar/03322ca2f73b406d2c5c89c2419d83cbc51ca39ba088bba9801dc865aa3dbc89?s=96&d=mm&r=g';
const PPA_ROLE = 'Philippine Permaculture Association';

const scraped = [
  {
    wpLink: 'https://mycelium-learn.com/video/taking-the-hard-work-out-of-composting-2/',
    about: 'Access to high-quality organic fertilizer can be one of the biggest hurdles in growing diverse, healthy crops. In this video, Geoff Lawton introduces the Subpod, a subterranean worm farm designed to turn everyday organic waste into nutrient-rich fertilizer right where it\'s needed. The system avoids the usual worm farm problems—no mess, flies, maggots, or unpleasant odors—while creating a continuous supply of soil nourishment.\n\nThe video highlights the Subpod\'s real-world impact by showing how even challenging plants like Brahmi thrive when fed with the fertilizer it produces. Small gardens, large-scale setups, or multiple linked units for commercial operations can all benefit from its scalable design. Beyond fertilization, the Subpod doubles as a functional seat, making it both practical and efficient.',
    idealFor: 'Gardeners, small-scale farmers, and anyone interested in sustainable, zero-waste food production. It shows how simple, well-designed systems can transform kitchen waste into powerful tools for growing healthy, organic crops while reducing energy use and environmental impact.',
    category: 'Visual Learning', series: null, authorRole: GEOFF_ROLE, authorBio: GEOFF_BIO, authorThumb: GEOFF_THUMB,
  },
  {
    wpLink: 'https://mycelium-learn.com/video/the-forested-garden-what-is-a-food-forest-2/',
    about: 'Geoff Lawton walks through what a food forest actually is and how it works. The video covers the layered structure of a food forest, the role of support species in building soil fertility, how pruning and timing drive productivity, and how animals can be integrated to speed up the whole process. By the end you have a clear picture of how these systems are designed, managed, and why they produce so much with so little input.',
    idealFor: 'Those looking to understand food forests from the ground up — from the basic concept to the practical management strategies behind a functioning system.',
    category: 'Visual Learning', series: null, authorRole: GEOFF_ROLE, authorBio: GEOFF_BIO, authorThumb: GEOFF_THUMB,
  },
  {
    wpLink: 'https://mycelium-learn.com/video/how-to-build-a-worm-tower-2/',
    about: null, idealFor: null, category: 'Visual Learning', series: null,
    authorRole: GEOFF_ROLE, authorBio: GEOFF_BIO, authorThumb: GEOFF_THUMB,
  },
  {
    wpLink: 'https://mycelium-learn.com/video/what-is-permaculture/',
    about: null, idealFor: null, category: 'Visual Learning', series: null,
    authorRole: GEOFF_ROLE, authorBio: GEOFF_BIO, authorThumb: GEOFF_THUMB,
  },
  {
    wpLink: 'https://mycelium-learn.com/video/permaculture-for-beginners-the-permaculture-designers-manual-in-one-hour/',
    about: null, idealFor: null, category: 'Visual Learning', series: null,
    authorRole: GEOFF_ROLE, authorBio: GEOFF_BIO, authorThumb: GEOFF_THUMB,
  },
  {
    wpLink: 'https://mycelium-learn.com/video/polycrisis-prepping-and-permaculture/',
    about: 'Hubert Posadas breaks down the concept of polycrisis — what happens when climate, economic, social, and geopolitical crises hit simultaneously and compound on each other. He examines why the Philippines is particularly vulnerable, why the Western model of prepping doesn\'t translate to the Filipino context, and how bayanihan and indigenous permaculture practices offer a solid path to community preparedness.',
    idealFor: 'Filipinos wanting to understand how permaculture connects to broader issues of food security, community resilience, and preparing for an increasingly unstable world. Particularly relevant for those interested in the intersection of indigenous practices and practical sustainability.',
    category: 'Visual Learning', series: null, authorRole: HUBERT_ROLE, authorBio: HUBERT_BIO, authorThumb: HUBERT_THUMB,
  },
  {
    wpLink: 'https://mycelium-learn.com/video/permaculture-vs-regenerative-agriculture-syntropic-agriculture-holistic/',
    about: 'This Q&A session from Geoff Lawton\'s 2021 Permaculture Design Course tackles one of the most common sources of confusion for learners: how permaculture relates to other land-use methodologies like regenerative agriculture, syntropic agriculture, holistic management, biodynamics, and organic farming.\n\nGeoff uses the metaphor of a wardrobe to explain permaculture\'s unique role — it\'s not a single garment, but the entire organizational system that holds diverse practices together. Unlike methodologies focused solely on agriculture, permaculture extends to housing, water systems, waste management, and urban economies.',
    idealFor: 'Learners trying to understand how permaculture differs from and incorporates other sustainable practices. If you\'ve been confused about where permaculture fits in the broader landscape of regenerative systems, this video provides the conceptual clarity to move forward with confidence.',
    category: 'Visual Learning', series: null, authorRole: GEOFF_ROLE, authorBio: GEOFF_BIO, authorThumb: GEOFF_THUMB,
  },
  {
    wpLink: 'https://mycelium-learn.com/video/integrated-system-design/',
    about: 'Geoff Lawton provides a comprehensive walkthrough of integrated system design, focusing on water management, land use, and property productivity. The approach emphasizes working with natural features while integrating engineered solutions like swales, ponds, and windmills to maximize water retention. Central to the design process is the principle of "stop it, spread it, and soak it" — managing water to infiltrate and hydrate soil rather than allowing runoff.',
    idealFor: 'Learners looking to understand the practical mechanics of property design in permaculture. If you\'re planning your own land project or want to see how water management, access planning, and zoning work together to create a productive, functional system, this video offers the foundational framework.',
    category: 'Visual Learning', series: null, authorRole: GEOFF_ROLE, authorBio: GEOFF_BIO, authorThumb: GEOFF_THUMB,
  },
  {
    wpLink: 'https://mycelium-learn.com/video/water-the-lifeblood-of-the-landscape-discover-permaculture-the-podcast/',
    about: null, idealFor: null, category: 'Podcast', series: 'Discover Permaculture: The Podcast',
    authorRole: GEOFF_ROLE, authorBio: GEOFF_BIO, authorThumb: GEOFF_THUMB,
  },
  {
    wpLink: 'https://mycelium-learn.com/video/how-to-grow-food-security-discover-permaculture-the-podcast/',
    about: null, idealFor: null, category: 'Podcast', series: 'Discover Permaculture: The Podcast',
    authorRole: GEOFF_ROLE, authorBio: GEOFF_BIO, authorThumb: GEOFF_THUMB,
  },
  {
    wpLink: 'https://mycelium-learn.com/video/kapitbahay-kwentong-permakultura-permaculture-tails-episode-2-lupa/',
    about: null, idealFor: null, category: 'Podcast', series: 'Kapitbahay: Kwentong Permakultura',
    authorRole: PPA_ROLE, authorBio: PPA_BIO, authorThumb: PPA_THUMB,
  },
  {
    wpLink: 'https://mycelium-learn.com/video/kapitbahay-kwentong-permakultura-episode-1-bakit-kami-nasa-permakultura-why-are-we-in-permaculture/',
    about: null, idealFor: null, category: 'Podcast', series: 'Kapitbahay: Kwentong Permakultura',
    authorRole: PPA_ROLE, authorBio: PPA_BIO, authorThumb: PPA_THUMB,
  },
  {
    wpLink: 'https://mycelium-learn.com/video/the-permaculture-principles/',
    about: null, idealFor: null, category: 'Visual Learning', series: null,
    authorRole: GEOFF_ROLE, authorBio: GEOFF_BIO, authorThumb: GEOFF_THUMB,
  },
  {
    wpLink: 'https://mycelium-learn.com/video/permaculture-demystified-your-essential-guide-for-beginner-green-thumbs/',
    about: 'Billy from Perma Pastures Farm walks through a real working example of integrated animal management — sheep, chickens, and bees operating as a single coordinated system. The sheep graze down vegetation around the bee boxes, the chickens follow to handle insects and mites that would otherwise threaten the colony, and the bees pollinate the whole operation. One of the clearest on-the-ground demonstrations of what permaculture actually looks like when it\'s functioning.',
    idealFor: 'Those who find permaculture easier to grasp through real examples than through theory. If you\'ve heard the principles but want to see them working together on an actual farm, this is a good place to start.',
    category: 'Visual Learning', series: null, authorRole: GEOFF_ROLE, authorBio: GEOFF_BIO, authorThumb: GEOFF_THUMB,
  },
  {
    wpLink: 'https://mycelium-learn.com/video/reading-the-landscape-with-permaculture-design/',
    about: null, idealFor: null, category: 'Visual Learning', series: null,
    authorRole: GEOFF_ROLE, authorBio: GEOFF_BIO, authorThumb: GEOFF_THUMB,
  },
  // Hubert videos (apply author info)
  {
    wpLink: 'https://mycelium-learn.com/video/the-farm-why-the-philippines-cant-feed-itself-atty-esteban-salonga-with-baganihan-collective/',
    about: null, idealFor: null, category: 'Visual Learning', series: null,
    authorRole: HUBERT_ROLE, authorBio: HUBERT_BIO, authorThumb: HUBERT_THUMB,
  },
];

const lookup = {};
scraped.forEach(s => { lookup[s.wpLink] = s; });

const updated = videos.map(v => {
  const s = lookup[v.wpLink];
  if (!s) return v;
  return {
    ...v,
    about: s.about !== undefined ? s.about : (v.about || null),
    idealFor: s.idealFor !== undefined ? s.idealFor : (v.idealFor || null),
    category: s.category || v.category || null,
    series: s.series || v.series || null,
    authorRole: s.authorRole || v.authorRole || null,
    authorBio: s.authorBio || v.authorBio || null,
    authorThumb: s.authorThumb || v.authorThumb || null,
  };
});

fs.writeFileSync(videosPath, JSON.stringify(updated, null, 2));
console.log('Done. Merged', scraped.length, 'entries.');
