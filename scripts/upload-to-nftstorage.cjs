const fs = require('fs');
const path = require('path');
const { NFTStorage, File } = require('nft.storage');
const mime = require('mime');

const apiKey = process.env.NFT_STORAGE_API_KEY;
if (!apiKey) {
  console.error('NFT_STORAGE_API_KEY environment variable is required.');
  process.exit(1);
}

const [,, imagesDir, outputJson] = process.argv;
if (!imagesDir || !outputJson) {
  console.error('Usage: node upload-to-nftstorage.cjs <imagesDir> <outputJson>');
  process.exit(1);
}

async function main() {
  const client = new NFTStorage({ token: apiKey });
  const files = fs.readdirSync(imagesDir).filter(f => !f.startsWith('.'));
  const results = [];

  for (const filename of files) {
    const filePath = path.join(imagesDir, filename);
    const content = fs.readFileSync(filePath);
    const type = mime.getType(filePath);
    const imageFile = new File([content], filename, { type });

    // Metadata
    const metadata = {
      name: path.parse(filename).name,
      description: `NFT image for ${filename}`,
      image: imageFile,
    };

    const stored = await client.store(metadata);
    results.push({
      filename,
      metadataUrl: stored.url
    });
    console.log(`Uploaded ${filename} -> ${stored.url}`);
  }

  fs.writeFileSync(outputJson, JSON.stringify(results, null, 2));
  console.log(`Metadata list written to ${outputJson}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
