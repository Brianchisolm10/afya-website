import { PrismaClient, ProductCategory } from '@prisma/client';

const prisma = new PrismaClient();

const SAMPLE_PRODUCTS = [
  // Apparel
  {
    name: 'AFYA Movement Tee',
    description: 'Comfortable, breathable cotton tee with the AFYA logo. Perfect for workouts or everyday wear. Available in multiple colors.',
    price: 25.00,
    category: ProductCategory.APPAREL,
    images: ['/products/tee-turquoise.jpg', '/products/tee-lavender.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Turquoise', 'Lavender', 'White', 'Black'],
    inventory: 100,
    isActive: true,
    isDrop: false,
    slug: 'afya-movement-tee'
  },
  {
    name: 'Performance Tank Top',
    description: 'Moisture-wicking performance tank designed for intense training sessions. Lightweight and breathable.',
    price: 28.00,
    category: ProductCategory.APPAREL,
    images: ['/products/tank-turquoise.jpg', '/products/tank-black.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Turquoise', 'Black', 'Grey'],
    inventory: 75,
    isActive: true,
    isDrop: false,
    slug: 'performance-tank-top'
  },
  {
    name: 'AFYA Hoodie',
    description: 'Cozy fleece hoodie with embroidered AFYA logo. Perfect for warm-ups and cool-downs.',
    price: 45.00,
    category: ProductCategory.APPAREL,
    images: ['/products/hoodie-lavender.jpg', '/products/hoodie-grey.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Lavender', 'Grey', 'Black'],
    inventory: 60,
    isActive: true,
    isDrop: false,
    slug: 'afya-hoodie'
  },
  {
    name: 'Training Shorts',
    description: 'Lightweight athletic shorts with moisture-wicking fabric. Features side pockets and adjustable waistband.',
    price: 32.00,
    category: ProductCategory.APPAREL,
    images: ['/products/shorts-black.jpg', '/products/shorts-turquoise.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Turquoise', 'Navy'],
    inventory: 80,
    isActive: true,
    isDrop: false,
    slug: 'training-shorts'
  },
  
  // Accessories
  {
    name: 'AFYA Water Bottle',
    description: 'Insulated stainless steel water bottle keeps drinks cold for 24 hours. 32oz capacity with leak-proof lid.',
    price: 22.00,
    category: ProductCategory.ACCESSORIES,
    images: ['/products/bottle-turquoise.jpg', '/products/bottle-lavender.jpg'],
    sizes: ['One Size'],
    colors: ['Turquoise', 'Lavender', 'Black'],
    inventory: 150,
    isActive: true,
    isDrop: false,
    slug: 'afya-water-bottle'
  },
  {
    name: 'Resistance Band Set',
    description: 'Set of 5 resistance bands with varying resistance levels. Includes carrying bag and exercise guide.',
    price: 35.00,
    category: ProductCategory.ACCESSORIES,
    images: ['/products/bands-set.jpg'],
    sizes: ['One Size'],
    colors: ['Multi-Color'],
    inventory: 50,
    isActive: true,
    isDrop: false,
    slug: 'resistance-band-set'
  },
  {
    name: 'AFYA Gym Bag',
    description: 'Durable gym bag with multiple compartments. Water-resistant material with adjustable shoulder strap.',
    price: 40.00,
    category: ProductCategory.ACCESSORIES,
    images: ['/products/bag-black.jpg', '/products/bag-turquoise.jpg'],
    sizes: ['One Size'],
    colors: ['Black', 'Turquoise'],
    inventory: 45,
    isActive: true,
    isDrop: false,
    slug: 'afya-gym-bag'
  },
  {
    name: 'Yoga Mat',
    description: 'Premium non-slip yoga mat with extra cushioning. Includes carrying strap. 6mm thickness.',
    price: 38.00,
    category: ProductCategory.ACCESSORIES,
    images: ['/products/mat-lavender.jpg', '/products/mat-turquoise.jpg'],
    sizes: ['One Size'],
    colors: ['Lavender', 'Turquoise', 'Black'],
    inventory: 40,
    isActive: true,
    isDrop: false,
    slug: 'yoga-mat'
  },
  
  // Drops (Limited Edition)
  {
    name: 'Limited Edition Movement Crew',
    description: 'Exclusive crew neck sweatshirt with special edition design. Only 50 available!',
    price: 55.00,
    category: ProductCategory.DROPS,
    images: ['/products/crew-limited.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Turquoise/Lavender Gradient'],
    inventory: 50,
    isActive: true,
    isDrop: true,
    dropStartDate: new Date('2024-01-01'),
    dropEndDate: new Date('2024-12-31'),
    slug: 'limited-edition-movement-crew'
  },
  {
    name: 'Founder\'s Collection Tee',
    description: 'Special edition tee celebrating AFYA\'s founding. Features unique artwork and premium fabric.',
    price: 35.00,
    category: ProductCategory.DROPS,
    images: ['/products/founders-tee.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Black'],
    inventory: 100,
    isActive: true,
    isDrop: true,
    dropStartDate: new Date('2024-01-01'),
    dropEndDate: new Date('2024-12-31'),
    slug: 'founders-collection-tee'
  },
  
  // Collections
  {
    name: 'Complete Starter Pack',
    description: 'Everything you need to start your movement journey. Includes tee, water bottle, resistance bands, and yoga mat.',
    price: 95.00,
    category: ProductCategory.COLLECTIONS,
    images: ['/products/starter-pack.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Mixed'],
    inventory: 30,
    isActive: true,
    isDrop: false,
    slug: 'complete-starter-pack'
  },
  {
    name: 'Athlete Performance Bundle',
    description: 'Premium bundle for serious athletes. Includes performance tank, training shorts, gym bag, and resistance bands.',
    price: 120.00,
    category: ProductCategory.COLLECTIONS,
    images: ['/products/athlete-bundle.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Mixed'],
    inventory: 25,
    isActive: true,
    isDrop: false,
    slug: 'athlete-performance-bundle'
  }
];

async function main() {
  console.log('🛍️  Seeding products...\n');

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const productData of SAMPLE_PRODUCTS) {
    const existing = await prisma.product.findUnique({
      where: { slug: productData.slug }
    });

    if (existing) {
      console.log(`⚠️  Product "${productData.name}" already exists (slug: ${productData.slug})`);
      
      // Update inventory and price if needed
      await prisma.product.update({
        where: { slug: productData.slug },
        data: {
          price: productData.price,
          inventory: productData.inventory,
          isActive: productData.isActive
        }
      });
      updated++;
    } else {
      await prisma.product.create({
        data: productData
      });
      console.log(`✅ Created product: ${productData.name}`);
      created++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('SEEDING SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Created: ${created} products`);
  console.log(`🔄 Updated: ${updated} products`);
  console.log(`⏭️  Skipped: ${skipped} products`);
  console.log('='.repeat(60) + '\n');

  // Display category breakdown
  const productsByCategory = await prisma.product.groupBy({
    by: ['category'],
    _count: true
  });

  console.log('📊 Products by category:');
  productsByCategory.forEach(({ category, _count }) => {
    console.log(`  ${category}: ${_count} products`);
  });

  console.log('\n✅ Product seeding complete!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
