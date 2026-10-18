# Floating-cell startup fix

The homepage's digital-network section could appear without its cells while its WebGL scene prepared. The previous code requested its 125,768-byte texture only after proximity detection and graphics setup; background preparation also waited for the hero/fonts and an idle slot with a four-second timeout.

The homepage now discovers the same texture through a low-priority image preload. Graphics preparation starts after the opening paint, independently of hero/font readiness and viewport proximity. Texture decoding and graphics compilation overlap. Where supported, `KHR_parallel_shader_compile` avoids blocking the main thread while compilation completes; other browsers retain the same rendering path. [Khronos specification](https://registry.khronos.org/webgl/extensions/KHR_parallel_shader_compile/).

No shader, texture, canvas resolution, frame-rate limit, animation math, CSS, copy or layout changes. A new content-hashed JavaScript asset replaces the old homepage reference; existing immutable files are retained.

Validation: build and 83-page asset checks passed. The old and new renders are pixel-for-pixel identical at the same animation time, including the no-parallel-extension fallback. Desktop/mobile scroll checks and cold-start measurements are recorded in the design workspace's `research/deployment/` folder. All 352 original protected forum/API/content files remain unchanged. No emails, account operations or database writes.
