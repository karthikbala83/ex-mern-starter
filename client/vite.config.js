import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  // ---- Workers must be ES modules here ----
  // Vite bundles workers as IIFE by default, and an IIFE cannot be
  // code-split. Our runner uses dynamic import() to pull in geolib/mathjs
  // only for the bonus stages, which IS a code split — so the default
  // format fails the build with "UMD and IIFE output formats are not
  // supported for code-splitting builds". 'es' lets the worker keep its
  // dynamic imports, which is the whole reason those two libraries stay
  // out of the main bundle.
  worker: { format: 'es' },
 plugins: [react()] });
