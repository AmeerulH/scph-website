/**
 * Uploads local public images to Sanity and patches the gtp2026AboutPage document
 * with proper image asset references (replacing old plain string paths).
 *
 * Run with: node scripts/upload-images-to-sanity.mjs
 */

import { createClient } from '@sanity/client'
import { createReadStream, existsSync } from 'fs'
import path from 'path'

const PROJECT_ID = 'y0tkemxm'
const DATASET = 'production'
const TOKEN = process.env.SANITY_API_TOKEN

if (!TOKEN) {
  console.error('Error: SANITY_API_TOKEN env var is required')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const PUBLIC_DIR = new URL('../public', import.meta.url).pathname

async function uploadImage(publicPath) {
  const fullPath = path.join(PUBLIC_DIR, publicPath)
  if (!existsSync(fullPath)) {
    console.warn(`  ⚠ File not found, skipping: ${fullPath}`)
    return null
  }
  const filename = path.basename(fullPath)
  console.log(`  Uploading ${filename}...`)
  const asset = await client.assets.upload('image', createReadStream(fullPath), { filename })
  console.log(`  ✓ ${filename} → ${asset._id}`)
  return asset._id
}

async function main() {
  console.log('\n── Why This Meeting Matters images ──')
  const leavesId   = await uploadImage('/images/gtp/conference/leaves.webp')
  const riverId    = await uploadImage('/images/gtp/conference/river.webp')
  const solarId    = await uploadImage('/images/gtp/conference/solar.webp')

  console.log('\n── Co-chair quote photos ──')
  const timId      = await uploadImage('/images/gtp/co-chairs/tim-lenton.jpg')
  const johanId    = await uploadImage('/images/gtp/co-chairs/johan-rockstrom.jpg')
  const jemilahId  = await uploadImage('/images/scph/team/professor-tan-sri-dr-jemilah-mahmood.png')

  console.log('\n── Gallery slides (15 images) ──')
  const gallerySlides = [
    { key: 'i18Da340mO8Zdpvc67usR5', src: '/images/gtp/gtp-2025/main-photo.avif' },
    { key: 'i18Da340mO8Zdpvc67usUc', src: '/images/gtp/gtp-2025/preview-004.avif' },
    { key: 'i18Da340mO8Zdpvc67usY9', src: '/images/gtp/gtp-2025/networking.avif' },
    { key: 'i18Da340mO8Zdpvc67usbg', src: '/images/gtp/gtp-2025/conf-7.avif' },
    { key: 'i18Da340mO8Zdpvc67usfD', src: '/images/gtp/gtp-2025/games-on-lawn.avif' },
    { key: 'i18Da340mO8Zdpvc67usik', src: '/images/gtp/gtp-2025/conf-4.avif' },
    { key: 'i18Da340mO8Zdpvc67usmH', src: '/images/gtp/gtp-2025/preview-117.avif' },
    { key: 'i18Da340mO8Zdpvc67uspo', src: '/images/gtp/gtp-2025/conf-15.jpg' },
    { key: 'i18Da340mO8Zdpvc67ustL', src: '/images/gtp/gtp-2025/conf-9.avif' },
    { key: 'i18Da340mO8Zdpvc67usws', src: '/images/gtp/gtp-2025/workshop.avif' },
    { key: 'i18Da340mO8Zdpvc67ut0P', src: '/images/gtp/gtp-2025/conf-18.jpg' },
    { key: 'i18Da340mO8Zdpvc67ut3w', src: '/images/gtp/gtp-2025/conf-5.avif' },
    { key: 'i18Da340mO8Zdpvc67ut7T', src: '/images/gtp/gtp-2025/preview-092.avif' },
    { key: 'i18Da340mO8Zdpvc67utB0', src: '/images/gtp/gtp-2025/preview-106.avif' },
    { key: 'i18Da340mO8Zdpvc67utEX', src: '/images/gtp/gtp-2025/conf-12.avif' },
  ]

  const slidePatches = {}
  for (const slide of gallerySlides) {
    const assetId = await uploadImage(slide.src)
    if (assetId) {
      slidePatches[`galleryBand.slides[_key=="${slide.key}"].image`] = {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
      }
    }
  }

  console.log('\n── Patching gtp2026AboutPage document ──')

  const setPatch = {
    // whyMattersBand
    ...(leavesId  && { 'whyMattersBand.tallImage':        { _type: 'image', asset: { _type: 'reference', _ref: leavesId  } } }),
    ...(riverId   && { 'whyMattersBand.topRightImage':    { _type: 'image', asset: { _type: 'reference', _ref: riverId   } } }),
    ...(solarId   && { 'whyMattersBand.bottomRightImage': { _type: 'image', asset: { _type: 'reference', _ref: solarId   } } }),
    // quotes
    ...(timId     && { 'quotesBand.quotes[_key=="i18Da340mO8Zdpvc67utI4"].photo': { _type: 'image', asset: { _type: 'reference', _ref: timId     } } }),
    ...(johanId   && { 'quotesBand.quotes[_key=="i18Da340mO8Zdpvc67utLb"].photo': { _type: 'image', asset: { _type: 'reference', _ref: johanId   } } }),
    ...(jemilahId && { 'quotesBand.quotes[_key=="i18Da340mO8Zdpvc67utP8"].photo': { _type: 'image', asset: { _type: 'reference', _ref: jemilahId } } }),
    // gallery slides
    ...slidePatches,
  }

  await client.patch('gtp2026AboutPage').set(setPatch).commit()

  console.log('\n✅ Done! All images uploaded and document patched.')
  console.log('   You can now run: npm run dev — to verify locally before deploying.')
}

main().catch((err) => {
  console.error('\n❌ Upload failed:', err.message)
  process.exit(1)
})
