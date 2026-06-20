import type {
  GithubConfig,
  Link,
  PostConfig,
  ProjectConfig,
  DynamicConfig,
  Site,
  SkillsShowcaseConfig,
  SocialLink,
  TagsConfig,
} from '~/types'

// Catppuccin color theme + design tokens + UI effects
export const UI_CONFIG = {
  theme: {
    // Catppuccin flavor for light and dark mode. 'latte' is light, 'mocha', 'macchiato' and 'frappe' is dark.
    light: 'latte',
    dark: 'mocha',
    // Catppuccin hue — controls accent color. 280 matches Catppuccin default (lavender)
    hue: 280,
    // Shift ALL UI colors (not just accent) by hue when true
    isGlobal: true,
    // Zero saturation on all colors for a monochrome look
    mono: false,
  },

  // Global design tokens — overrides Tailwind's default scale
  design: {
    // Base radius in rem. Controls all rounded-* utilities:
    // xs=0.25x, sm=0.5x, md=0.75x, lg=1x, xl=1.5x, 2xl=2x, 3xl=3x, 4xl=4x
    // Default: 0.5 (8px at 16px base → rounded-lg)
    radius: 1.2,

    // Base spacing unit in rem. Affects all p-*, m-*, gap-*, space-*, etc.
    // Default: 0.25 (4px at 16px base). e.g. p-4 = 4 × 0.25rem = 1rem
    spacing: 0.25,

    // Sidebar icon size in Tailwind scale (4 = 1rem, 5 = 1.25rem, 6 = 1.5rem, etc.)
    // Default: 5 (1.25rem / 20px)
    sidebarIconSize: 6,

    // Font families — family picks the directory under /public/fonts/
    font: {
      family: 'Inter', // import /fonts/$/{Serif,Sans,Mono}.woff2 (as Serif, Sans, Mono)
      serif: "'Sans', system-ui, sans-serif",
      // serif-fallback-to-serif: "'Serif', ui-serif, serif",
      // serif-fallback-to-sans-serif: "'Serif', system-ui, sans-serif",
      sans: "'Sans', system-ui, sans-serif",
      mono: "'Mono', ui-monospace, monospace",
    },
  },

  // Card hover 3D tilt effect
  cardHover: {
    enabled: true,
    maxMove: 8,
    maxRotate: 3,
    easing: 0.1,
    scale: 1.02,
    duration: 0.2,
  },
}

// Global site configuration
export const SITE: Site = {
  title: "Silvaire's Blog",
  description: 'Per Aspera Ad Astra',
  website: 'https://qwq.blue',
  base: '/',
  author: 'Silvaire',
  ogImage:
    'https://wsrv.nl/?url=avatars.githubusercontent.com/u/184231508?s=400&u=0a370792ba6bbb95a04d309171b562bcd7283a0f&v=4&mask=circle',
  version: '1.8',
  favicon: '/favicon.webp',
  footerText: 'Designed and engineered for the digital void.',
  footerText2: 'Minimalist layout, maximum focus. Data persistence guaranteed.',
}

// Top navigation menu
export const HEADER_LINKS: Link[] = [
  { name: 'Posts', url: '/posts', icon: 'icon-[ph--book-open-text]' },
  { name: 'Dynamic', url: '/dynamic', icon: 'icon-[ph--waveform]' },
  { name: 'Projects', url: '/projects', icon: 'icon-[ph--code-block]' },
  { name: 'About', url: '/about', icon: 'icon-[ph--user]' },
]

// Bottom navigation menu
export const FOOTER_LINKS: Link[] = [
  { name: 'Home', url: '/' },
  { name: 'Posts', url: '/posts' },
  { name: 'Dynamic', url: '/dynamic' },
  { name: 'Projects', url: '/projects' },
  { name: 'Tags', url: '/tags' },
  { name: 'Friends', url: '/friends' },
  { name: 'About', url: '/about' },
]

// Social links (Icon reference: https://icon-sets.iconify.design/)
export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/Miralous',
    icon: 'icon-[ri--arrow-left-up-line]',
  },
  {
    name: 'BiliBili',
    url: 'https://bilibili.com',
    icon: 'icon-[ri--arrow-left-up-line]',
  },
]

// Skills showcase matrix configuration
export const SKILLSSHOWCASE_CONFIG: SkillsShowcaseConfig = {
  SKILLS_ENABLED: true,
  SKILLS_DATA: [
    {
      direction: 'left',
      skills: [
        { name: 'Arch Linux', icon: 'icon-[mdi--language-javascript]' },
        { name: 'CSS', icon: 'icon-[mdi--language-css3]' },
        { name: 'HTML', icon: 'icon-[mdi--language-html5]' },
        { name: 'TypeScript', icon: 'icon-[mdi--language-typescript]' },
        { name: 'Vue', icon: 'icon-[mdi--vuejs]' },
        { name: 'JavaScript', icon: 'icon-[mdi--language-javascript]' },
      ],
    },
    {
      direction: 'right',
      skills: [
        { name: 'Vite', icon: 'icon-[lineicons--astro]' },
        { name: 'Node.js', icon: 'icon-[mdi--nodejs]' },
        { name: 'Tailwind CSS', icon: 'icon-[mdi--tailwind]' },
        { name: 'Docker', icon: 'icon-[mdi--docker]' },
        { name: 'PNPM', icon: 'icon-[lineicons--vercel]' },
        { name: 'Vim', icon: 'icon-[line-md--iconify2-static]' },
      ],
    },
    {
      direction: 'left',
      skills: [
        { name: 'Git', icon: 'icon-[mdi--git]' },
        { name: 'Neovim', icon: 'icon-[lineicons--mongodb]' },
        { name: 'Windows', icon: 'icon-[lineicons--vercel]' },
        { name: 'Linux', icon: 'icon-[lineicons--vercel]' },
      ],
    },
  ],
}

// GitHub contribution graph configuration
export const GITHUB_CONFIG: GithubConfig = {
  ENABLED: true,
  GITHUB_USERNAME: 'silvaire-qwq',
  TOOLTIP_ENABLED: true,
}

// Posts page configuration
export const POSTS_CONFIG: PostConfig = {
  title: 'Posts',
  description: "Silvaire's articles",
  introduce: 'Articles are updated irregularly. You can subscribe to the RSS feed for the latest updates.',
  author: 'Silvaire',
  homePageConfig: { size: 3, type: 'compact' },
  postPageConfig: { size: 8, type: 'image' },
  tagsPageConfig: { size: 5, type: 'compact' },
  defaultHeroImage:
    'https://wsrv.nl/?url=avatars.githubusercontent.com/u/184231508?s=400&u=0a370792ba6bbb95a04d309171b562bcd7283a0f&v=4&mask=circle',
  defaultHeroImageAspectRatio: '16/9',
  postType: 'jap',
  imageDarkenInDark: true,
  readMoreText: 'Read More',
  prevPageText: 'Previous Page',
  nextPageText: 'Next Page',
  tocText: 'Table of Contents',
  backToPostsText: 'Back to Posts',
  nextPostText: 'Next Post',
  prevPostText: 'Previous Post',
}

// Tags page configuration
export const TAGS_CONFIG: TagsConfig = {
  title: 'Tags',
  description: 'All article tags',
  introduce: 'All article tags are here. Click to filter.',
}

// Projects page configuration
export const PROJECTS_CONFIG: ProjectConfig = {
  title: 'Projs',
  description: 'My project showcases',
  introduce: 'Below are my project showcases, maintained irregularly.',
}

// Dynamic page configuration
export const DYNAMIC_CONFIG: DynamicConfig = {
  title: 'Dynamic',
  description: 'My updates',
  introduce: 'Live signals, brief thoughts, and development updates.',
}

// About page configuration
export const ABOUT_CONFIG = {
  title: 'About',
  description: 'Who am I?',
  introduce: 'A student who is learning frontend development',

  // Personal profile
  profile: {
    name: 'Silvaire',
    avatar:
      'https://wsrv.nl/?url=avatars.githubusercontent.com/u/184231508?s=400&u=0a370792ba6bbb95a04d309171b562bcd7283a0f&v=4&mask=circle',
    role: 'A student who is learning frontend development',
    bio: 'Per Aspera Ad Astra.',
  },

  // Additional information
  physicalAttributes: [
    { label: 'Height', value: '144 CM', icon: 'icon-[ph--ruler]' },
    { label: 'Weight', value: '43 KG', icon: 'icon-[ph--barbell]' },
    { label: 'Birthday', value: 'March 30, 2013', icon: 'icon-[ph--cake]' },
    { label: 'Location', value: 'Tianjin', icon: 'icon-[ph--map-pin]' },
  ],

  // Skill matrix
  skills: [
    {
      category: 'Frontend',
      items: ['JavaScript', 'Vue', 'TypeScript', 'Tailwind CSS', 'HTML', 'CSS'],
    },
    { category: 'Tools', items: ['Vite', 'Node.js', 'Git', 'Docker', 'PNPM', 'Yarn', 'NPM'] },
    { category: 'Editors', items: ['VSCode', 'VSCodium', 'Vim', 'Neovim'] },
    { category: 'OS', items: ['Arch Linux', 'Windows', 'Linux'] },
    { category: 'Learning', items: ['Astro', 'React'] },
  ],

  // Equipment list
  equipment: [],

  // Game log
  games: [],

  // Course schedule
  courseSchedule: [
    {
      day: 'MON',
      label: 'Mon',
      courses: [
        { time: '07:30-07:50', name: 'English' },
        { time: '08:00-08:45', name: 'Chinese' },
        { time: '09:15-10:00', name: 'Biology' },
        { time: '10:15-11:00', name: 'Geography' },
        { time: '11:15-12:00', name: 'English' },
        { time: '13:30-14:15', name: 'Maths' },
        { time: '14:30-15:15', name: 'PE' },
        { time: '15:30-16:15', name: 'English' },
        { time: '16:45-17:30', name: 'English' },
        { time: '17:45-18:20', name: 'Drama' },
      ],
    },
    {
      day: 'TUE',
      label: 'Tue',
      courses: [
        { time: '07:30-07:50', name: 'Maths' },
        { time: '08:00-08:45', name: 'Maths' },
        { time: '09:15-10:00', name: 'English' },
        { time: '10:15-11:00', name: 'PE' },
        { time: '11:15-12:00', name: 'Biology' },
        { time: '13:30-14:15', name: 'Political Ed' },
        { time: '14:30-15:15', name: 'Labor' },
        { time: '15:30-16:15', name: 'Chinese' },
        { time: '16:45-17:30', name: 'Geography' },
        { time: '17:45-18:20', name: 'History' },
      ],
    },
    {
      day: 'WED',
      label: 'Wed',
      courses: [
        { time: '07:30-07:50', name: 'Geography' },
        { time: '08:00-08:45', name: 'Chinese' },
        { time: '09:15-10:00', name: 'Political Ed' },
        { time: '10:15-11:00', name: 'Maths' },
        { time: '11:15-12:00', name: 'Maths' },
        { time: '13:30-14:15', name: 'Chinese' },
        { time: '14:30-15:15', name: 'PE (Public)' },
        { time: '15:30-16:15', name: 'Geography' },
        { time: '16:45-17:30', name: 'Maths' },
        { time: '17:45-18:20', name: 'Maths' },
      ],
    },
    {
      day: 'THU',
      label: 'Thu',
      courses: [
        { time: '07:30-07:50', name: 'Chinese' },
        { time: '08:00-08:45', name: 'English' },
        { time: '09:15-10:00', name: 'IT' },
        { time: '10:15-11:00', name: 'Music' },
        { time: '11:15-12:00', name: 'History' },
        { time: '13:30-14:15', name: 'PE' },
        { time: '14:30-15:15', name: 'Chinese' },
        { time: '15:30-16:15', name: 'Chinese' },
        { time: '16:45-17:30', name: 'Chinese' },
        { time: '17:45-18:20', name: 'Chinese' },
      ],
    },
    {
      day: 'FRI',
      label: 'Fri',
      courses: [
        { time: '07:30-07:50', name: 'English' },
        { time: '08:00-08:45', name: 'Art' },
        { time: '09:15-10:00', name: 'Biology' },
        { time: '10:15-11:00', name: 'Political Ed' },
        { time: '11:15-12:00', name: 'History' },
        { time: '13:30-14:15', name: 'English' },
        { time: '14:30-15:15', name: 'Maths' },
        { time: '15:30-16:15', name: 'PE (Public)' },
        { time: '16:45-17:30', name: 'English' },
        { time: '17:45-18:20', name: 'English' },
      ],
    },
  ],

  // To-do list
  todos: [
    { task: 'Write more articles', completed: true },
    { task: 'Miracle v2', completed: false },
    { task: 'Make more friends', completed: false },
  ],
}

// Friends page configuration
export const FRIENDS_CONFIG = {
  title: 'Friends',
  description: 'All my friends are here. Feel free to exchange links~',
  introduce: 'Star map positioning acquired. Heading towards the friends link galaxy...',
  enableAdd: true,
}

// Directory ordering for friend groups. Groups listed here appear in order; groups not listed appear after.
export const FRIENDS_DIRECTORIES: { key: string; label: string; num?: string }[] = [
  { key: 'Developer', label: 'Developer', num: '00' },
  { key: 'Friend', label: 'Friend', num: '01' },
  { key: '', label: 'Normal', num: '02' },
]

// Blog owner's exclusive friend link card information
export const FRIENDS_CONTACT = {
  sitename: "Silvaire's Blog",
  email: 'silvaire_qwq@outlook.com',
  author: 'Silvaire',
  sitelink: 'https://qwq.blue',
  siteavatar:
    'https://wsrv.nl/?url=avatars.githubusercontent.com/u/184231508?s=400&u=0a370792ba6bbb95a04d309171b562bcd7283a0f&v=4&mask=circle',
  description: 'Per Aspera Ad Astra',
}

// Deprecated: use UI_CONFIG.theme
export const CATPPUCCIN = UI_CONFIG.theme

// Global design tokens — overrides Tailwind's default scale
// Deprecated: use UI_CONFIG.design
export const DESIGN = UI_CONFIG.design

// Visual appearance — card hover 3D tilt effect
// Deprecated: use UI_CONFIG.cardHover
export const GLOBAL_CONFIG = { styles: { visual: { cardHover: UI_CONFIG.cardHover } } }

// Waline comment system configuration
export const WALINE_CONFIG = {
  enableComment: true,
  serverURL: 'https://waline.qwq.blue',
}

export const CMS_CONFIG = {
  enableCMS: true,
  owner: 'Miralous',
  repo: 'ReactionX',
  branch: 'main',
  pathPrefix: 'src/content/posts/',
}
