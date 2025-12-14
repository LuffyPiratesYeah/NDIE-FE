// cloudflare.config.ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  runtime: "edge",
  output: "worker"
});
