export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://quick-tools-4wok.vercel.app/</loc><lastmod>2025-11-19</lastmod><priority>1.0</priority></url>
  <url><loc>https://quick-tools-4wok.vercel.app/tools/youtube-thumbnail-downloader</loc><lastmod>2025-11-19</lastmod><priority>0.9</priority></url>
  <url><loc>https://quick-tools-4wok.vercel.app/tools/instagram-reels-downloader</loc><lastmod>2025-11-19</lastmod><priority>0.9</priority></url>
  <url><loc>https://quick-tools-4wok.vercel.app/tools/whatsapp-without-saving-number</loc><lastmod>2025-11-19</lastmod><priority>0.9</priority></url>
  <url><loc>https://quick-tools-4wok.vercel.app/tools/facebook-video-downloader</loc><lastmod>2025-11-19</lastmod><priority>0.9</priority></url>
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}