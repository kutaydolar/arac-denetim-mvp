import withSerwist from "@serwist/next";

const nextConfig = {
  reactStrictMode: true,
};

// Detect if running in StackBlitz/WebContainer environment
const isStackBlitz = process.env.NODE_ENV === 'development' && (
  process.env.HOSTNAME?.includes('stackblitz') ||
  process.env.HOSTNAME?.includes('bolt.new') ||
  process.env.HOSTNAME?.includes('credentialless') ||
  process.env.DISABLE_SERWIST === 'true'
);

// Conditionally apply Serwist plugin
export default isStackBlitz 
  ? nextConfig 
  : withSerwist({
      swSrc: "app/sw.ts",
      swDest: "public/sw.js",
    })(nextConfig);