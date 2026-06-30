import { Pin } from './types';

export const INITIAL_PINS: Pin[] = [
  {
    id: 'soccer-1',
    title: 'Retro Aesthetic Match-Day Jersey',
    description: 'A blend of vintage athletic heritage and modern casual styling. Soft breathable knit pattern designed for everyday fan comfort.',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
    category: 'soccer',
    author: {
      name: 'Elena Rostova',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
    },
    likes: 342,
    tags: ['Soccer Jersey', 'Retro Fit', 'Blockcore', 'Vintage Activewear'],
    price: '$65.00',
    aspectRatio: 'aspect-[3/4]',
    comments: [
      { id: 'c1', author: 'Liam S.', content: 'Stunning design! The knit fabric texture is top tier.', createdAt: '2 hours ago' },
      { id: 'c2', author: 'Chloe M.', content: 'Love the pastel trim! Ordering mine right now.', createdAt: '1 hour ago' }
    ]
  },
  {
    id: 'fashion-1',
    title: 'Knit Vest & Preppy Retro Accents',
    description: 'An elegant knitted sweater vest paired with bold cherry-red accents, pleated skirts, and retro hair accessories for a perfect preppy look.',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLtyEX4olDRWHUjxBvviPWz5x9UR39sb3vc94r2rra-FGM2UBYrEZFLTlPRWemQ54UcTCd3Rxh7Jv__PpfR5yhrVyLZrXIohBYo_RaVaKrc5obGeKwufJdT6Y7GHHEGesvpFFiZAntt68oOxn6967QsCMZ42rgewsII212lvXBifhb_J3bxdkydsBiTg-WYNBUjy6GrJr7L0VZsza-IHBkSq97rYDW9PmYBrr_jo8lILQYoGPSE_vzYGMsU',
    category: 'fashion',
    author: {
      name: 'Yuki Takahashi',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150'
    },
    likes: 512,
    tags: ['Knit sweater', 'Cherry red', 'Preppy look', 'Aesthetic Fashion'],
    price: '$79.00',
    aspectRatio: 'aspect-[3/4]',
    comments: [
      { id: 'c3', author: 'Isabella G.', content: 'Absolutely obsessed with the cherry red pop!', createdAt: '5 hours ago' }
    ]
  },
  {
    id: 'interior-1',
    title: 'Earthy Space & Mindful Corners',
    description: 'Create a sanctuary of calm. Warm timber storage chests, soft sage bedding, dried botanicals, and cozy textured lighting.',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLv8u647lyLVyHnYFisGgyIT3DvwF-GD8scmPzEuirlLkbVG6xfxQXaVcM9vBVjSueavzuI2B7hRvkrjctloMIwWHgIRopzsLTexAtC7T0qlPry37AdMitbpSNMqNmV83LnQjrSsxg8fPEsjarzFUCHicqXGWuQvfWgxDLwgGtu-JQMIi4nxpN_7NDmkbsFiQhVOB6bpHt0yIQdKo7x_Fwz8LcJlwUEj1wyCW6136V4ILQZH9phHccjtaw',
    category: 'interior',
    author: {
      name: 'Soren Lindqvist',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    },
    likes: 820,
    tags: ['Earthy space inspo', 'Mindful design', 'Minimalist Wood', 'Cosy Bedroom'],
    price: '$220.00',
    aspectRatio: 'aspect-square',
    comments: [
      { id: 'c4', author: 'Markus K.', content: 'Where is that wooden credenza from? It is gorgeous!', createdAt: 'Yesterday' }
    ]
  },
  {
    id: 'lifestyle-1',
    title: 'Aura Creative Inspiration',
    description: 'A curated visual mood board featuring soft pink bandana curls, fluffy pastel activewear jackets, and terracotta styling setups.',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLu5Kr7oILlY_dACZo4XCla8Y8nNi4cZzBGlBBK_oGz086EBUIWXzD5arVPS3EzElN0IGTRhE2vVnn8FARcUKQI_nJpDVYpoEqV98fK1vQlI1I_BExMmTNmk6RTlaRHahGNd1f4WPKxArY6oj6nc1JYVs8X32HTEG3QMdYb7otE-NZcSX-vM5d3fc_bHI7rz12NZIUIP2_hCF2nsYrqRceshCS5DiNarB5gsaAoDZyXuFAB72Xwzz9rz-Xs',
    category: 'lifestyle',
    author: {
      name: 'Chloe Vande',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    },
    likes: 1243,
    tags: ['Inspiration', 'Aesthetic Grid', 'Vibe Curation', 'Pastel Mood'],
    aspectRatio: 'aspect-[3/4]',
    comments: [
      { id: 'c5', author: 'Amélie P.', content: 'The hair gems and scarf combination is pure art.', createdAt: '3 days ago' }
    ]
  },
  {
    id: 'lifestyle-2',
    title: 'Pastel Beauty Match Finder',
    description: 'Find your perfect hue. Interactive interface maps skin tones, lip shades, and seasonal beauty palettes with high-contrast displays.',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLsHwo9oQSSHFME1jqSlN-Tsp-8_uOr5yFDOwSpEn0P8jtqW3Hnp5jw1E1uabnTgnl290tA137lFYbkYT4wZkmuJaPUZN72zBpBUBx8kRoB_UCK-ujQyWd1rs-rI4hWxVJqUh6LDJ35Kc03t--50s2mTlEt3frkjFTMVpHSRg_CCGFL_PwxEIdw5LsVMvll6-8T3yrswSG9pp3ojvZznXThjCOZG6XtSLjG5UGPB_bZf3GViv2vfMETd3Q',
    category: 'lifestyle',
    author: {
      name: 'Maya Lin',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150'
    },
    likes: 671,
    tags: ['Skin Tone Match', 'Bold Lip', 'Aesthetic Makeup', 'Beauty Palette'],
    aspectRatio: 'aspect-square',
    comments: [
      { id: 'c6', author: 'Zarah T.', content: 'Such a helpful visual matrix.', createdAt: '10 hours ago' }
    ]
  },
  {
    id: 'soccer-2',
    title: 'Vintage Leather Ball & Field Sunset',
    description: 'Reliving the classic grassroots era of soccer. The smell of fresh cut grass, warm golden hours, and hand-stitched leather panels.',
    imageUrl: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=800',
    category: 'soccer',
    author: {
      name: 'Nico Rossi',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
    },
    likes: 418,
    tags: ['Vintage Soccer', 'Retro Ball', 'Golden Hour', 'Field Vibes'],
    price: '$45.00',
    aspectRatio: 'aspect-[3/4]',
    comments: []
  },
  {
    id: 'interior-2',
    title: 'Light Dappled Study Desk',
    description: 'Minimalist glass-morphic planner sheets, oak wood storage containers, fresh eucalyptus sprigs, and warm summer sunlight.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
    category: 'interior',
    author: {
      name: 'Soren Lindqvist',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    },
    likes: 933,
    tags: ['Workspace Inspo', 'Glassmorphism', 'Desk Setup', 'Botanical Accent'],
    price: '$18.00',
    aspectRatio: 'aspect-[4/5]',
    comments: []
  },
  {
    id: 'food-1',
    title: 'Matcha Milk Crepe Tower',
    description: 'Indulge in layers of paper-thin crepe stacked with velvety organic Uji matcha cream. Lightly dusted with matcha powder for a bitter-sweet elegance.',
    imageUrl: 'https://images.unsplash.com/photo-1536680465769-2365207b035e?auto=format&fit=crop&q=80&w=800',
    category: 'food',
    author: {
      name: 'Ami Patisserie',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
    },
    likes: 1540,
    tags: ['Matcha Dessert', 'French Crepe', 'Pastel Food', 'Teatime Treats'],
    price: '$12.00',
    aspectRatio: 'aspect-[3/4]',
    comments: [
      { id: 'c7', author: 'Kenji Y.', content: 'Absolutely perfect layering. The sweetness is extremely balanced.', createdAt: '4 days ago' }
    ]
  },
  {
    id: 'food-2',
    title: 'Ethereal Macaron Cloud Selection',
    description: 'French macarons in dreamy shades of dusty lavender, soft mint, and peach curd. Crispy shells yielding to velvety ganache centers.',
    imageUrl: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=800',
    category: 'food',
    author: {
      name: 'Ami Patisserie',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
    },
    likes: 2110,
    tags: ['Macarons', 'High Tea', 'Pastel Palette', 'French Baking'],
    price: '$24.00',
    aspectRatio: 'aspect-[4/5]',
    comments: []
  },
  {
    id: 'soccer-3',
    title: 'Stadium Shadows & Turf Patterns',
    description: 'An architectural perspective of modern stadium fields. Clean lawn lines, grand stand geometry, and dynamic afternoon shadow casting.',
    imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6edd1dec1d?auto=format&fit=crop&q=80&w=800',
    category: 'soccer',
    author: {
      name: 'Elena Rostova',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
    },
    likes: 289,
    tags: ['Stadium', 'Turf Design', 'Matchday Lines', 'Symmetry'],
    aspectRatio: 'aspect-[4/5]',
    comments: []
  },
  {
    id: 'fashion-2',
    title: 'Luminous Silk Scarf & Linen',
    description: 'Graceful summer accessories. Pure washed linen shirts paired with hand-rolled silk scarves featuring abstract watercolor splashes.',
    imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=800',
    category: 'fashion',
    author: {
      name: 'Yuki Takahashi',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150'
    },
    likes: 423,
    tags: ['Silk Scarf', 'Linen Wear', 'Minimalist Wardrobe', 'Aesthetic Classic'],
    price: '$42.00',
    aspectRatio: 'aspect-[3/4]',
    comments: []
  },
  {
    id: 'interior-3',
    title: 'Frosted Glass Terrarium Shelving',
    description: 'Delicate succulent glass vessels arranged on high-opacity frosted glass shelving, casting dreamy diffused shadows on pale lavender walls.',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800',
    category: 'interior',
    author: {
      name: 'Soren Lindqvist',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    },
    likes: 689,
    tags: ['Frosted Glass', 'Succulents', 'Pastel Decor', 'Indoor Plant Shelving'],
    price: '$35.00',
    aspectRatio: 'aspect-[3/4]',
    comments: []
  }
];

export const INITIAL_BOARDS = [
  { id: 'board-1', name: 'Soccer Season ⚽', description: 'Matchday inspiration, vintage fits, and pitch designs.', pinIds: ['soccer-1', 'soccer-2', 'soccer-3'], coverUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800' },
  { id: 'board-2', name: 'Aesthetic Pastels 🌸', description: 'Airy mood boards, soft hues, and creative beauty guides.', pinIds: ['lifestyle-1', 'lifestyle-2', 'food-2'], coverUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLu5Kr7oILlY_dACZo4XCla8Y8nNi4cZzBGlBBK_oGz086EBUIWXzD5arVPS3EzElN0IGTRhE2vVnn8FARcUKQI_nJpDVYpoEqV98fK1vQlI1I_BExMmTNmk6RTlaRHahGNd1f4WPKxArY6oj6nc1JYVs8X32HTEG3QMdYb7otE-NZcSX-vM5d3fc_bHI7rz12NZIUIP2_hCF2nsYrqRceshCS5DiNarB5gsaAoDZyXuFAB72Xwzz9rz-Xs' },
  { id: 'board-3', name: 'Mindful Spaces 🌿', description: 'Calming interiors and glassmorphic designs.', pinIds: ['interior-1', 'interior-2', 'interior-3'], coverUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLv8u647lyLVyHnYFisGgyIT3DvwF-GD8scmPzEuirlLkbVG6xfxQXaVcM9vBVjSueavzuI2B7hRvkrjctloMIwWHgIRopzsLTexAtC7T0qlPry37AdMitbpSNMqNmV83LnQjrSsxg8fPEsjarzFUCHicqXGWuQvfWgxDLwgGtu-JQMIi4nxpN_7NDmkbsFiQhVOB6bpHt0yIQdKo7x_Fwz8LcJlwUEj1wyCW6136V4ILQZH9phHccjtaw' }
];

export const APP_USER: { name: string; email: string; avatarUrl: string } = {
  name: 'Curation Lover',
  email: 'domi.kurniawan22@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
};
