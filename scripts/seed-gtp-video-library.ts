import { videoSeedDocuments } from "./lib/gtp-library-seeds";
import { runLibrarySeed } from "./lib/run-gtp-library-seed";

runLibrarySeed(videoSeedDocuments).catch(error => { console.error(error.message); process.exitCode = 1; });
