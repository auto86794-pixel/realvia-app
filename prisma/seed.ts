import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding indul...");

  // 🧹 reset
  await prisma.listing.deleteMany();

  const listings = [
    {
      title: "Modern lakás Debrecen belváros",
      price: 45000000,
      location: "Debrecen",
      lat: 47.5316,
      lng: 21.6273,
      imageUrl: "https://picsum.photos/400/300?random=1",
    },
    {
      title: "Budapesti panorámás lakás",
      price: 89000000,
      location: "Budapest",
      lat: 47.4979,
      lng: 19.0402,
      imageUrl: "https://picsum.photos/400/300?random=2",
    },
    {
      title: "Kis garzon egyetemistáknak",
      price: 28000000,
      location: "Szeged",
      lat: 46.253,
      lng: 20.1414,
      imageUrl: "https://picsum.photos/400/300?random=3",
    },
    {
      title: "Családi ház kerttel",
      price: 72000000,
      location: "Győr",
      lat: 47.6875,
      lng: 17.6504,
      imageUrl: "https://picsum.photos/400/300?random=4",
    },
    {
      title: "Luxus penthouse",
      price: 150000000,
      location: "Budapest",
      lat: 47.5,
      lng: 19.05,
      imageUrl: "https://picsum.photos/400/300?random=5",
    },
  ];

  await prisma.listing.createMany({
    data: listings,
    skipDuplicates: true,
  });

  console.log(`✅ Seed kész! (${listings.length} rekord beszúrva)`);
}

main()
  .catch((error) => {
    console.error("❌ Seed hiba:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });