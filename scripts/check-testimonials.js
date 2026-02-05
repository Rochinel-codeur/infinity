
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const testimonials = await prisma.testimonial.findMany();
  console.log("Total Testimonials:", testimonials.length);
  console.log("Active Testimonials:", testimonials.filter(t => t.isActive).length);
  console.log("Inactive Testimonials:", testimonials.filter(t => !t.isActive).length);
  
  if (testimonials.length > 0) {
      console.log("\nSample Testimonials:");
      testimonials.slice(0, 3).forEach(t => {
          console.log(`- [${t.isActive ? 'ACTIVE' : 'INACTIVE'}] ${t.name} (Source: ${t.source}) (Image: ${t.imageUrl})`);
      });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
