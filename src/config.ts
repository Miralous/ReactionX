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

// Catppuccin 配色主题
export const CATPPUCCIN = {
  light: 'latte',
  dark: 'mocha',
}

// 强调色
export const ACCENT_COLOR = 'mauve'

// 站点全局配置
export const SITE: Site = {
  title: "Silvaire's Blog",
  description: 'Per Aspera Ad Astra',
  website: 'https://qwq.blue',
  base: '/',
  author: 'Silvaire',
  ogImage:
    'https://wsrv.nl/?url=avatars.githubusercontent.com/u/184231508?s=400&u=0a370792ba6bbb95a04d309171b562bcd7283a0f&v=4&mask=circle',
  version: '1.8',
  footerText: 'Designed and engineered for the digital void.',
  footerText2: 'Minimalist layout, maximum focus. Data persistence guaranteed.',
}

// 顶部导航菜单
export const HEADER_LINKS: Link[] = [
  { name: '主页', url: '/posts' },
  { name: '动态', url: '/dynamic' },
  { name: '项目', url: '/projects' },
  { name: '关于', url: '/about' },
]

// 底部导航菜单
export const FOOTER_LINKS: Link[] = [
  { name: '主页', url: '/' },
  { name: '文章', url: '/posts' },
  { name: '动态', url: '/dynamic' },
  { name: '项目', url: '/projects' },
  { name: '标签', url: '/tags' },
  { name: '友链', url: '/friends' },
  { name: '关于', url: '/about' },
]

// 社交链接 (图标参考: https://icon-sets.iconify.design/)
export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/Miralous',
    icon: 'icon-[ri--arrow-left-up-line]',
  },
  {
    name: 'BiliBili',
    url: 'https://space.bilibili.com/441325177',
    icon: 'icon-[ri--arrow-left-up-line]',
  },
]

// 技能展示矩阵配置
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

// GitHub 贡献图配置
export const GITHUB_CONFIG: GithubConfig = {
  ENABLED: true,
  GITHUB_USERNAME: 'silvaire-qwq',
  TOOLTIP_ENABLED: true,
}

// 文章页面配置
export const POSTS_CONFIG: PostConfig = {
  title: 'Posts',
  description: 'Silvaire 的文章',
  introduce: '不定时更新维护文章，可订阅 RSS 获取最新更新状态。',
  author: 'Silvaire',
  homePageConfig: { size: 3, type: 'compact' },
  postPageConfig: { size: 8, type: 'image' },
  tagsPageConfig: { size: 5, type: 'time-line' },
  defaultHeroImage:
    'https://wsrv.nl/?url=avatars.githubusercontent.com/u/184231508?s=400&u=0a370792ba6bbb95a04d309171b562bcd7283a0f&v=4&mask=circle',
  defaultHeroImageAspectRatio: '16/9',
  postType: 'jap',
  imageDarkenInDark: true,
  readMoreText: '阅读全文',
  prevPageText: '上一页',
  nextPageText: '下一页',
  tocText: '目录导航',
  backToPostsText: '返回文章列表',
  nextPostText: '下一篇',
  prevPostText: '上一篇',
}

// 标签页面配置
export const TAGS_CONFIG: TagsConfig = {
  title: 'Tags',
  description: '所有文章标签',
  introduce: '所有文章标签均在此处，点击即可筛选。',
}

// 项目页面配置
export const PROJECTS_CONFIG: ProjectConfig = {
  title: 'Projs',
  description: '我的项目案例',
  introduce: '以下是我的项目案例展示，不定期维护项目。',
}

// 动态页面配置
export const DYNAMIC_CONFIG: DynamicConfig = {
  title: 'Dynamic',
  description: '我的动态',
  introduce: '实时信号、简短想法和开发更新。',
}

// 关于页面配置
export const ABOUT_CONFIG = {
  title: 'About',
  description: 'Who am I?',
  introduce: 'A student who is learning frontend development',

  // 个人档案
  profile: {
    name: 'Silvaire',
    avatar:
      'https://wsrv.nl/?url=avatars.githubusercontent.com/u/184231508?s=400&u=0a370792ba6bbb95a04d309171b562bcd7283a0f&v=4&mask=circle',
    role: 'A student who is learning frontend development',
    bio: 'Per Aspera Ad Astra.',
  },

  // 附加信息
  physicalAttributes: [
    { label: 'Height', value: '144 CM', icon: 'icon-[ph--ruler]' },
    { label: 'Weight', value: '43 KG', icon: 'icon-[ph--barbell]' },
    { label: 'Birthday', value: 'May 30, 2013', icon: 'icon-[ph--cake]' },
    { label: 'Location', value: 'Tianjin', icon: 'icon-[ph--map-pin]' },
  ],

  // 技能矩阵
  skills: [
    { category: 'Frontend', items: ['JavaScript', 'Vue', 'TypeScript', 'Tailwind CSS', 'HTML', 'CSS'] },
    { category: 'Tools', items: ['Vite', 'Node.js', 'Git', 'Docker', 'PNPM', 'Yarn', 'NPM'] },
    { category: 'Editors', items: ['VSCode', 'VSCodium', 'Vim', 'Neovim'] },
    { category: 'OS', items: ['Arch Linux', 'Windows', 'Linux'] },
    { category: 'Learning', items: ['Astro', 'React'] },
  ],

  // 硬件清单
  equipment: [],

  // 游戏日志
  games: [],

  // 课程表
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

  // 待办清单
  todos: [
    { task: 'Write more articles', completed: true },
    { task: 'Miracle v2', completed: false },
    { task: 'Make more friends', completed: false },
  ],
}

// 友链页面配置
export const FRIENDS_CONFIG = {
  title: 'Friends',
  description: '我的朋友们都在这里，欢迎互访～',
  introduce: '已获取星图定位，正在前往友链星系的路上……',
  enableAdd: true,
}

// 博主专属友链卡片信息
export const FRIENDS_CONTACT = {
  sitename: "Silvaire's Blog",
  email: 'silvaire_qwq@outlook.com',
  author: 'Silvaire',
  sitelink: 'https://qwq.blue',
  siteavatar:
    'https://wsrv.nl/?url=avatars.githubusercontent.com/u/184231508?s=400&u=0a370792ba6bbb95a04d309171b562bcd7283a0f&v=4&mask=circle',
  description: 'Per Aspera Ad Astra',
}

// Waline 评论系统配置
export const WALINE_CONFIG = {
  enableComment: true,
  serverURL: 'https://waline.qwq.blue',
}
