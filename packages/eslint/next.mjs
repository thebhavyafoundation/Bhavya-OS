import nextVitals from "eslint-config-next/core-web-vitals.js";
import base from "./base.mjs";

const nextConfig = Array.isArray(nextVitals) ? nextVitals : [nextVitals];

export default [...base, ...nextConfig];
