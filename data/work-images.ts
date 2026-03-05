// ═══════════════════════════════════════════════════════════════════
//  WORK PORTFOLIO KÉPEK — ITT CSERÉLD LE A KÉPEKET
// ═══════════════════════════════════════════════════════════════════
//
//  Minden kategóriánál 5 egymástól független slot (slot_1 … slot_5).
//
//  src  → Cloudinary URL  VAGY  helyi kép pl. /images/work/social-1.jpg
//  alt  → rövid leírás (accessibility + SEO)
//
//  Cloudinary feltöltés után csak az src értéket írd felül.
//  Ajánlott paraméterek: f_auto,q_auto:good,w_800,c_limit,dpr_2.0
//
// ═══════════════════════════════════════════════════════════════════

export interface WorkImage {
  src: string;
  alt: string;
}

const CDN = 'https://res.cloudinary.com/dafa1pwo4/image/upload/f_auto,q_auto:good,w_800,c_limit,dpr_2.0';

export const WORK_IMAGES = {

  // ── 01 · Social — UGC ────────────────────────────────────────────
  social: [
    { src: `${CDN}/v1761056587/u1524498281_A_photorealistic_macro_shot_of_a_black_tigers_sil_53c9ceff-d396-4cda-8241-b1f8735a9353_0_jisgin.png`,  alt: 'AI video production for SaaS startup'        }, // ← slot 1
    { src: `${CDN}/v1761056675/u1524498281_A_close-up_portrait_of_a_high_fashion_East_Asian__a5e6da82-ffc6-4be5-9041-386a8049dd16_1_k8jha3.png`,  alt: 'Generative brand system for e-commerce'      }, // ← slot 2
    { src: `${CDN}/v1760540706/u1524498281_Film_photography_ultra-detailed_complex_and_extre_37a12263-cb8c-4cd0-96ef-397a9a74684b_0_aoavq9.png`,  alt: 'Digital brand ambassador for fintech company' }, // ← slot 3
    { src: `${CDN}/v1760533408/u1524498281_top_view_of_audi_etron_rs_making_donuts_on_the_mo_fc11774b-68c0-40a3-8052-560f06d0baab_2_ysytl8.png`,  alt: 'Immersive brand experience'                  }, // ← slot 4
    { src: `${CDN}/v1760533408/u1524498281_Wide_fields_of_deep_green._Aerial_view._Grass_in__756915c6-1925-44dc-8560-e4e4c55c20d0_2_jzk1za.png`,  alt: 'Generative art installation'                 }, // ← slot 5
  ],

  // ── 02 · AI Video — Films ────────────────────────────────────────
  video: [
    { src: `${CDN}/v1761056675/u1524498281_A_close-up_portrait_of_a_high_fashion_East_Asian__a5e6da82-ffc6-4be5-9041-386a8049dd16_1_k8jha3.png`,  alt: 'Generative brand system for e-commerce'      }, // ← slot 1
    { src: `${CDN}/v1760540706/u1524498281_Film_photography_ultra-detailed_complex_and_extre_37a12263-cb8c-4cd0-96ef-397a9a74684b_0_aoavq9.png`,  alt: 'Digital brand ambassador for fintech company' }, // ← slot 2
    { src: `${CDN}/v1760540697/u1524498281_cinematic_wide_shot_of_a_horse_and_rider_gallopin_1266586c-ee9f-46ee-9c1e-a1f03404cfa4_0_r1rccg.png`,  alt: 'Social video campaign'                       }, // ← slot 3
    { src: `${CDN}/v1761056587/u1524498281_A_photorealistic_macro_shot_of_a_black_tigers_sil_53c9ceff-d396-4cda-8241-b1f8735a9353_0_jisgin.png`,  alt: 'AI video production for SaaS startup'        }, // ← slot 4
    { src: `${CDN}/v1760533408/u1524498281_top_view_of_audi_etron_rs_making_donuts_on_the_mo_fc11774b-68c0-40a3-8052-560f06d0baab_2_ysytl8.png`,  alt: 'Immersive brand experience'                  }, // ← slot 5
  ],

  // ── 03 · Marketing ───────────────────────────────────────────────
  marketing: [
    { src: `${CDN}/v1760540706/u1524498281_Film_photography_ultra-detailed_complex_and_extre_37a12263-cb8c-4cd0-96ef-397a9a74684b_0_aoavq9.png`,  alt: 'Digital brand ambassador for fintech company' }, // ← slot 1
    { src: `${CDN}/v1760533408/u1524498281_top_view_of_audi_etron_rs_making_donuts_on_the_mo_fc11774b-68c0-40a3-8052-560f06d0baab_2_ysytl8.png`,  alt: 'Immersive brand experience'                  }, // ← slot 2
    { src: `${CDN}/v1760533408/u1524498281_Wide_fields_of_deep_green._Aerial_view._Grass_in__756915c6-1925-44dc-8560-e4e4c55c20d0_2_jzk1za.png`,  alt: 'Generative art installation'                 }, // ← slot 3
    { src: `${CDN}/v1760540697/u1524498281_cinematic_wide_shot_of_a_horse_and_rider_gallopin_1266586c-ee9f-46ee-9c1e-a1f03404cfa4_0_r1rccg.png`,  alt: 'Social video campaign'                       }, // ← slot 4
    { src: `${CDN}/v1761056675/u1524498281_A_close-up_portrait_of_a_high_fashion_East_Asian__a5e6da82-ffc6-4be5-9041-386a8049dd16_1_k8jha3.png`,  alt: 'Generative brand system for e-commerce'      }, // ← slot 5
  ],

  // ── 04 · AI Animation — 3D ───────────────────────────────────────
  animation: [
    { src: `${CDN}/v1760533408/u1524498281_top_view_of_audi_etron_rs_making_donuts_on_the_mo_fc11774b-68c0-40a3-8052-560f06d0baab_2_ysytl8.png`,  alt: 'Immersive brand experience'                  }, // ← slot 1
    { src: `${CDN}/v1760533408/u1524498281_Wide_fields_of_deep_green._Aerial_view._Grass_in__756915c6-1925-44dc-8560-e4e4c55c20d0_2_jzk1za.png`,  alt: 'Generative art installation'                 }, // ← slot 2
    { src: `${CDN}/v1760540697/u1524498281_cinematic_wide_shot_of_a_horse_and_rider_gallopin_1266586c-ee9f-46ee-9c1e-a1f03404cfa4_0_r1rccg.png`,  alt: 'Social video campaign'                       }, // ← slot 3
    { src: `${CDN}/v1761056587/u1524498281_A_photorealistic_macro_shot_of_a_black_tigers_sil_53c9ceff-d396-4cda-8241-b1f8735a9353_0_jisgin.png`,  alt: 'AI video production for SaaS startup'        }, // ← slot 4
    { src: `${CDN}/v1760540706/u1524498281_Film_photography_ultra-detailed_complex_and_extre_37a12263-cb8c-4cd0-96ef-397a9a74684b_0_aoavq9.png`,  alt: 'Digital brand ambassador for fintech company' }, // ← slot 5
  ],

  // ── 05 · Photography — Brand ─────────────────────────────────────
  photography: [
    { src: `${CDN}/v1772707393/freepik__-6-kp-retro-napfny-bringa-arany-frdruha-visor-post__32151_bvbw10.png`, alt: 'Retro sunny bike, golden swimsuit brand editorial'    }, // ← slot 1
    { src: `${CDN}/v1772707393/freepik__-5-kp-rooftop-feketefehr-skyline-hossz-fehr-szrme-__32152_zcy3vb.png`, alt: 'Rooftop black and white skyline, long white fur coat'  }, // ← slot 2
    { src: `${CDN}/v1772707392/freepik__-2-kp-feketefehr-hoodie-felhzs-fej-kitakarva-sport__32156_zgu8o7.png`, alt: 'Black and white hoodie, cloudy sky, sport editorial'   }, // ← slot 3
    { src: `${CDN}/v1772707392/freepik__2-feketefehr-helikopter-bels-hossz-lbnyjts-a-mszer__32160_fce3pm.png`, alt: 'Black and white helicopter interior, leg stretch shot'  }, // ← slot 4
    { src: `${CDN}/v1772707392/freepik__luxurious-baroque-interior-in-flames-with-ornate-c__32203_v5lhc2.png`, alt: 'Luxurious baroque interior in flames, ornate ceiling'   }, // ← slot 5
  ],

} satisfies Record<string, [WorkImage, WorkImage, WorkImage, WorkImage, WorkImage]>;
