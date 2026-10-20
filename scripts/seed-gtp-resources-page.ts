import { resourceSeedDocuments } from "./lib/gtp-library-seeds";
import { runLibrarySeed } from "./lib/run-gtp-library-seed";

runLibrarySeed(resourceSeedDocuments).catch(error => { console.error(error.message); process.exitCode = 1; });
