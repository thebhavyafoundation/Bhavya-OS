const GITHUB_PAGES_BASE = "https://thebhavyafoundation.github.io/Bhavya-OS";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_STORAGE_BASE = SUPABASE_URL
  ? `${SUPABASE_URL}/storage/v1/object/public`
  : "";
const VERCEL_BLOB_BASE = process.env.NEXT_PUBLIC_VERCEL_BLOB_URL || "";
const CLOUDFLARE_ASSETS_BASE = "https://assets.thebhavyafoundation.org";
const B2_PUBLIC_URL_BASE =
  process.env.B2_PUBLIC_URL_BASE ||
  `https://f002.backblazeb2.com/file/${process.env.B2_BUCKET || "bhavya-ai-assets"}`;

export const ASSETS = {
  github: {
    models: {
      cartoonRobot: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/models/kenney/cartoon-robot.glb`,
      brain: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/models/kenney/brain.glb`,
      robot: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/models/kenney/robot.glb`,
      computer: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/models/kenney/computer.glb`,
      neuralNet: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/models/poly-haven/neural-net.glb`,
      tree: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/models/kenney/tree.glb`,
      house: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/models/kenney/house.glb`,
      car: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/models/kenney/car.glb`,
      earth: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/models/kenney/earth.glb`,
      mountain: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/models/kenney/mountain.glb`,
      plant: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/models/kenney/plant.glb`,
      book: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/models/kenney/book.glb`,
      lightbulb: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/models/kenney/lightbulb.glb`,
      gear: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/models/kenney/gear.glb`,
    },
    icons: {
      book: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/icons/reshot/book.svg`,
      brain: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/icons/reshot/brain.svg`,
      neuralNet: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/icons/reshot/neural-net.svg`,
      robot: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/icons/reshot/robot.svg`,
      computer: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/icons/reshot/computer.svg`,
      tree: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/icons/reshot/tree.svg`,
      house: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/icons/reshot/house.svg`,
      earth: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/icons/reshot/earth.svg`,
      mountain: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/icons/reshot/mountain.svg`,
      plant: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/icons/reshot/plant.svg`,
      lightbulb: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/icons/reshot/lightbulb.svg`,
      gear: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/icons/reshot/gear.svg`,
      people: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/icons/reshot/people.svg`,
    },
    animations: {
      loading: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/animations/lottiefiles/loading.json`,
      brain: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/animations/lottiefiles/brain.json`,
      robot: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/animations/lottiefiles/robot.json`,
      computer: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/animations/lottiefiles/computer.json`,
      nature: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/animations/lottiefiles/nature.json`,
      learning: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/animations/lottiefiles/learning.json`,
      book: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/animations/lottiefiles/book.json`,
      lightbulb: `${GITHUB_PAGES_BASE}/apps/ai-institute/public/animations/lottiefiles/lightbulb.json`,
    },
  },
  supabase: {
    avatars: (userId: string) =>
      `${SUPABASE_STORAGE_BASE}/avatars/${userId}/avatar.png`,
    submissions: (userId: string, submissionId: string) =>
      `${SUPABASE_STORAGE_BASE}/submissions/${userId}/${submissionId}.json`,
    textures: (filename: string) =>
      `${SUPABASE_STORAGE_BASE}/textures/${filename}`,
  },
  vercel: {
    coursePreviews: (courseId: string) =>
      `${VERCEL_BLOB_BASE}/videos/${courseId}/preview.mp4`,
    generatedImages: (imageId: string) =>
      `${VERCEL_BLOB_BASE}/generated/${imageId}.png`,
  },
  cloudflare: {
    largeModels: (filename: string) =>
      `${CLOUDFLARE_ASSETS_BASE}/models/${filename}`,
    hdris: (filename: string) => `${CLOUDFLARE_ASSETS_BASE}/hdris/${filename}`,
  },
  b2: {
    models: (filename: string) => `${B2_PUBLIC_URL_BASE}/models/${filename}`,
    glb: (filename: string) => `${B2_PUBLIC_URL_BASE}/models/glb/${filename}`,
    gltf: (filename: string) => `${B2_PUBLIC_URL_BASE}/models/gltf/${filename}`,
    textures: (filename: string) =>
      `${B2_PUBLIC_URL_BASE}/textures/${filename}`,
    hdris: (filename: string) => `${B2_PUBLIC_URL_BASE}/hdris/${filename}`,
    videos: (filename: string) => `${B2_PUBLIC_URL_BASE}/videos/${filename}`,
    signedUrl: (key: string, expiresIn = 3600) =>
      `${process.env.NEXT_PUBLIC_API_BASE || ""}/api/b2/signed-url?key=${encodeURIComponent(key)}&expires=${expiresIn}`,
  },
} as const;

export function resolveAssetUrl(
  placeholder: string | undefined,
): string | null {
  if (!placeholder) return null;
  if (!placeholder.includes("[to-be-downloaded]")) return placeholder;

  // GitHub Pages (Kenney models)
  if (placeholder.includes("kenney/cartoon-robot"))
    return ASSETS.github.models.cartoonRobot;
  if (placeholder.includes("kenney/brain")) return ASSETS.github.models.brain;
  if (placeholder.includes("kenney/robot")) return ASSETS.github.models.robot;
  if (placeholder.includes("kenney/computer"))
    return ASSETS.github.models.computer;
  if (placeholder.includes("kenney/tree")) return ASSETS.github.models.tree;
  if (placeholder.includes("kenney/house")) return ASSETS.github.models.house;
  if (placeholder.includes("kenney/car")) return ASSETS.github.models.car;
  if (placeholder.includes("kenney/earth")) return ASSETS.github.models.earth;
  if (placeholder.includes("kenney/mountain"))
    return ASSETS.github.models.mountain;
  if (placeholder.includes("kenney/plant")) return ASSETS.github.models.plant;
  if (placeholder.includes("kenney/book")) return ASSETS.github.models.book;
  if (placeholder.includes("kenney/lightbulb"))
    return ASSETS.github.models.lightbulb;
  if (placeholder.includes("kenney/gear")) return ASSETS.github.models.gear;

  // GitHub Pages (Poly Haven models)
  if (placeholder.includes("poly-haven/neural-net"))
    return ASSETS.github.models.neuralNet;
  if (placeholder.includes("poly-haven/book"))
    return ASSETS.b2.gltf("poly-haven/book_encyclopedia_set_01.gltf");
  if (placeholder.includes("poly-haven/binder"))
    return ASSETS.b2.gltf("poly-haven/binder_notebook.gltf");
  if (placeholder.includes("poly-haven/bookshelf"))
    return ASSETS.b2.gltf("poly-haven/wooden_bookshelf_worn.gltf");

  // GitHub Pages (Reshot icons)
  if (placeholder.includes("reshot/book")) return ASSETS.github.icons.book;
  if (placeholder.includes("reshot/brain")) return ASSETS.github.icons.brain;
  if (placeholder.includes("reshot/neural-net"))
    return ASSETS.github.icons.neuralNet;
  if (placeholder.includes("reshot/robot")) return ASSETS.github.icons.robot;
  if (placeholder.includes("reshot/computer"))
    return ASSETS.github.icons.computer;
  if (placeholder.includes("reshot/tree")) return ASSETS.github.icons.tree;
  if (placeholder.includes("reshot/house")) return ASSETS.github.icons.house;
  if (placeholder.includes("reshot/earth")) return ASSETS.github.icons.earth;
  if (placeholder.includes("reshot/mountain"))
    return ASSETS.github.icons.mountain;
  if (placeholder.includes("reshot/plant")) return ASSETS.github.icons.plant;
  if (placeholder.includes("reshot/lightbulb"))
    return ASSETS.github.icons.lightbulb;
  if (placeholder.includes("reshot/gear")) return ASSETS.github.icons.gear;
  if (placeholder.includes("reshot/people")) return ASSETS.github.icons.people;

  // B2 for large assets (GLB/GLTF/HDRI/Video)
  if (placeholder.includes("b2/models/glb/")) {
    const filename = placeholder.replace("b2/models/glb/", "");
    return ASSETS.b2.glb(filename);
  }
  if (placeholder.includes("b2/models/gltf/")) {
    const filename = placeholder.replace("b2/models/gltf/", "");
    return ASSETS.b2.gltf(filename);
  }
  if (placeholder.includes("b2/models/")) {
    const filename = placeholder.replace("b2/models/", "");
    return ASSETS.b2.models(filename);
  }
  if (placeholder.includes("b2/textures/")) {
    const filename = placeholder.replace("b2/textures/", "");
    return ASSETS.b2.textures(filename);
  }
  if (placeholder.includes("b2/hdris/")) {
    const filename = placeholder.replace("b2/hdris/", "");
    return ASSETS.b2.hdris(filename);
  }
  if (placeholder.includes("b2/videos/")) {
    const filename = placeholder.replace("b2/videos/", "");
    return ASSETS.b2.videos(filename);
  }

  // Supabase textures
  if (placeholder.includes("supabase/textures/")) {
    const filename = placeholder.replace("supabase/textures/", "");
    return ASSETS.supabase.textures(filename);
  }

  // Vercel Blob
  if (placeholder.includes("vercel/videos/")) {
    const courseId = placeholder
      .replace("vercel/videos/", "")
      .replace("/preview.mp4", "");
    return ASSETS.vercel.coursePreviews(courseId);
  }
  if (placeholder.includes("vercel/generated/")) {
    const imageId = placeholder
      .replace("vercel/generated/", "")
      .replace(".png", "");
    return ASSETS.vercel.generatedImages(imageId);
  }

  // Cloudflare
  if (placeholder.includes("cloudflare/models/")) {
    const filename = placeholder.replace("cloudflare/models/", "");
    return ASSETS.cloudflare.largeModels(filename);
  }
  if (placeholder.includes("cloudflare/hdris/")) {
    const filename = placeholder.replace("cloudflare/hdris/", "");
    return ASSETS.cloudflare.hdris(filename);
  }

  return null;
}

export function getB2ModelUrl(filename: string): string {
  const B2_PUBLIC_URL_BASE =
    process.env.B2_PUBLIC_URL_BASE ||
    `https://f002.backblazeb2.com/file/${process.env.B2_BUCKET || "bhavya-ai-assets"}`;
  return `${B2_PUBLIC_URL_BASE}/models/${filename}`;
}

export function getB2GLBUrl(filename: string): string {
  const B2_PUBLIC_URL_BASE =
    process.env.B2_PUBLIC_URL_BASE ||
    `https://f002.backblazeb2.com/file/${process.env.B2_BUCKET || "bhavya-ai-assets"}`;
  return `${B2_PUBLIC_URL_BASE}/models/glb/${filename}`;
}

export function getB2GLTFUrl(filename: string): string {
  const B2_PUBLIC_URL_BASE =
    process.env.B2_PUBLIC_URL_BASE ||
    `https://f002.backblazeb2.com/file/${process.env.B2_BUCKET || "bhavya-ai-assets"}`;
  return `${B2_PUBLIC_URL_BASE}/models/gltf/${filename}`;
}

export function getB2TextureUrl(filename: string): string {
  const B2_PUBLIC_URL_BASE =
    process.env.B2_PUBLIC_URL_BASE ||
    `https://f002.backblazeb2.com/file/${process.env.B2_BUCKET || "bhavya-ai-assets"}`;
  return `${B2_PUBLIC_URL_BASE}/textures/${filename}`;
}

export function getB2HDRIUrl(filename: string): string {
  const B2_PUBLIC_URL_BASE =
    process.env.B2_PUBLIC_URL_BASE ||
    `https://f002.backblazeb2.com/file/${process.env.B2_BUCKET || "bhavya-ai-assets"}`;
  return `${B2_PUBLIC_URL_BASE}/hdris/${filename}`;
}

export function getB2VideoUrl(filename: string): string {
  const B2_PUBLIC_URL_BASE =
    process.env.B2_PUBLIC_URL_BASE ||
    `https://f002.backblazeb2.com/file/${process.env.B2_BUCKET || "bhavya-ai-assets"}`;
  return `${B2_PUBLIC_URL_BASE}/videos/${filename}`;
}
