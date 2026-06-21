import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // posts são lidos do filesystem em build/request — não precisa de webpack loader pra MDX
  // pois usamos next-mdx-remote (serialização runtime)
};

export default nextConfig;
