import type { MediaStore } from '@/types/media';

// Media from AvelonMotion-17h30 (Cloudinary + Unsplash)
export const MEDIA: MediaStore = {
  heroVideo: {
    src: '', // empty = use heroImage (local hero-bg.png)
    poster: '/media/hero-bg.png',
    autoplay: true,
    muted: true,
    loop: true,
    preload: 'metadata',
  },
  heroImage: '/media/hero-bg.png',

  aboutImage: {
    src: 'https://res.cloudinary.com/dafa1pwo4/image/upload/f_auto,q_auto:good,w_800,c_limit,dpr_2.0/v1763554994/u1524498281_Minimalist_studio_cube_with_diffused_light_formin_71f04ffa-5791-462f-a592-1571e87651e5_3_wflojy.png',
    alt: 'Minimalist studio workspace with diffused lighting - Avelon Motion creative environment',
  },

  ctaImage: {
    src: 'https://res.cloudinary.com/dafa1pwo4/image/upload/f_auto,q_auto:good,w_600,c_limit,dpr_2.0/v1759930339/u1524498281_a_mirror-like_monolith_reflecting_the_world_aroun_75dc882f-d755-4935-a57f-1d44f9a41b94_3_jiwswv.png',
    alt: 'Mirror-like monolith reflecting creative vision - contact us for AI video production',
  },

  services: {
    strategy: {
      src: 'https://res.cloudinary.com/dafa1pwo4/image/upload/f_auto,q_auto:good,w_600,c_limit,dpr_2.0/v1763565245/u1524498281_Avant-garde_fashion_editorial_of_a_Doberman_holdi_8cc846ed-e033-4132-b97b-0e6ced93a5f6_3_vfdzb9.png',
      alt: 'Cinematic AI video production - avant-garde visual storytelling',
    },
    visualIdentity: {
      src: 'https://res.cloudinary.com/dafa1pwo4/image/upload/f_auto,q_auto:good,w_600,c_limit,dpr_2.0/v1760427653/u1524498281_a_joyful_woman_wearing_colorful_headphones_splash_94be33ad-cb20-47d7-8d70-7d5bc9155d23_3_cwgeh8.png',
      alt: 'Dynamic visual brand systems - AI-powered design tools',
    },
    digitalDesign: {
      src: 'https://res.cloudinary.com/dafa1pwo4/image/upload/f_auto,q_auto:good,w_600,c_limit,dpr_2.0/v1760439621/u1524498281_Herms_brand_campaign_with_minimalist_photography__c2edd215-2611-40f6-af24-d76ff0c44145_3_ts6bsf.png',
      alt: 'AI-generated brand personas - custom digital characters',
    },
  },

  process: {
    concept: {
      src: 'https://res.cloudinary.com/dafa1pwo4/image/upload/f_auto,q_auto:good,w_500,c_limit,dpr_2.0/v1763570484/openart-image_T49Bq0yj_1763569699749_raw_pg7s6n.jpg',
      alt: 'Concept and strategy phase - brand story and creative vision',
    },
    aiGeneration: {
      src: 'https://res.cloudinary.com/dafa1pwo4/image/upload/f_auto,q_auto:good,w_500,c_limit,dpr_2.0/v1763567919/openart-image_K5jiC2eL_1763567863006_raw_tw9zqa.jpg',
      alt: 'AI generation and visual development',
    },
    production: {
      src: 'https://res.cloudinary.com/dafa1pwo4/image/upload/f_auto,q_auto:good,w_500,c_limit,dpr_2.0/v1763568258/openart-image_M7Wk2TuT_1763568068288_raw_fdsywp.jpg',
      alt: 'Production and refinement',
    },
    delivery: {
      src: 'https://res.cloudinary.com/dafa1pwo4/image/upload/f_auto,q_auto:good,w_500,c_limit,dpr_2.0/v1763570352/openart-image_yuPqxyEP_1763570312752_raw_rr68al.jpg',
      alt: 'Delivery and optimization',
    },
  },

  workImages: {
    card1: {
      src: 'https://res.cloudinary.com/dafa1pwo4/image/upload/f_auto,q_auto:good,w_800,c_limit,dpr_2.0/v1761056587/u1524498281_A_photorealistic_macro_shot_of_a_black_tigers_sil_53c9ceff-d396-4cda-8241-b1f8735a9353_0_jisgin.png',
      alt: 'AI video production for SaaS startup',
    },
    card2: {
      src: 'https://res.cloudinary.com/dafa1pwo4/image/upload/f_auto,q_auto:good,w_800,c_limit,dpr_2.0/v1761056675/u1524498281_A_close-up_portrait_of_a_high_fashion_East_Asian__a5e6da82-ffc6-4be5-9041-386a8049dd16_1_k8jha3.png',
      alt: 'Generative brand system for e-commerce',
    },
    card3: {
      src: 'https://res.cloudinary.com/dafa1pwo4/image/upload/f_auto,q_auto:good,w_800,c_limit,dpr_2.0/v1760540706/u1524498281_Film_photography_ultra-detailed_complex_and_extre_37a12263-cb8c-4cd0-96ef-397a9a74684b_0_aoavq9.png',
      alt: 'Digital brand ambassador for fintech company',
    },
    card4: {
      src: 'https://res.cloudinary.com/dafa1pwo4/image/upload/f_auto,q_auto:good,w_800,c_limit,dpr_2.0/v1760533408/u1524498281_top_view_of_audi_etron_rs_making_donuts_on_the_mo_fc11774b-68c0-40a3-8052-560f06d0baab_2_ysytl8.png',
      alt: 'Immersive brand experience',
    },
    card5: {
      src: 'https://res.cloudinary.com/dafa1pwo4/image/upload/f_auto,q_auto:good,w_800,c_limit,dpr_2.0/v1760533408/u1524498281_Wide_fields_of_deep_green._Aerial_view._Grass_in__756915c6-1925-44dc-8560-e4e4c55c20d0_2_jzk1za.png',
      alt: 'Generative art installation',
    },
    card6: {
      src: 'https://res.cloudinary.com/dafa1pwo4/image/upload/f_auto,q_auto:good,w_800,c_limit,dpr_2.0/v1760540697/u1524498281_cinematic_wide_shot_of_a_horse_and_rider_gallopin_1266586c-ee9f-46ee-9c1e-a1f03404cfa4_0_r1rccg.png',
      alt: 'Social video campaign',
    },
  },

  logos: {
    quantum: null,
    cubekit: null,
    ephemeral: null,
    warpspeed: null,
    magnolia: null,
    global: null,
  },
};
