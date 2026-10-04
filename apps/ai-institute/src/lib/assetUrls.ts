const GITHUB_PAGES_BASE = "https://thebhavyafoundation.github.io/Bhavya-OS";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_STORAGE_BASE = SUPABASE_URL
  ? `${SUPABASE_URL}/storage/v1/object/public`
  : "";
const VERCEL_BLOB_BASE = process.env.NEXT_PUBLIC_VERCEL_BLOB_URL || "";
const CLOUDFLARE_ASSETS_BASE = "https://assets.thebhavyafoundation.org";

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
    hdris: (filename: string) =>
      `${CLOUDFLARE_ASSETS_BASE}/hdris/${filename}`,
  },
} as const;

export function resolveAssetUrl(
  placeholder: string | undefined,
): string | null {
  if (!placeholder) return null;
  if (!placeholder.includes("[to-be-downloaded]")) return placeholder;

  if (placeholder.includes("kenney/cartoon-robot")) return ASSETS.github.models.cartoonRobot;
  if (placeholder.includes("kenney/brain")) return ASSETS.github.models.brain;
  if (placeholder.includes("kenney/robot")) return ASSETS.github.models.robot;
  if (placeholder.includes("kenney/computer")) return ASSETS.github.models.computer;
  if (placeholder.includes("poly-haven/neural-net")) return ASSETS.github.models.neuralNet;
  if (placeholder.includes("reshot/book")) return ASSETS.github.icons.book;
  if (placeholder.includes("reshot/brain")) return ASSETS.github.icons.brain;
  if (placeholder.includes("reshot/neural-net")) return ASSETS.github.icons.neuralNet;
  if (placeholder.includes("reshot/robot")) return ASSETS.github.icons.robot;

  return null;
}
