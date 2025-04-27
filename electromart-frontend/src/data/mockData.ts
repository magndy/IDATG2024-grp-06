// src/data/mockData.ts

// --- Interfaces ---
export interface Category {
    id: number;
    name: string;
    parentId: number | null; // null for top-level categories
    description?: string;
  }
  
  // Interface for the ProductCard component & mock data
  export interface Product {
    id: number | string;
    name: string;
    description: string;
    price: number;
    categoryId: number;
    stockQuantity: number;
    brandId: number;
    isActive: boolean;
  }

  export interface ProductImage {
    id: number;
    productId: number | string;
    imageUrl: string;
    altText?: string;
  }
  
  // Interface for hierarchical category node (used in Layout)
  export interface CategoryNode extends Category {
      children: CategoryNode[];
  }
  
  
  // --- Mock Data ---
  export const mockCategories: Category[] = [
    // Top Level
    { id: 1, name: 'Computers', parentId: null },
    { id: 2, name: 'Mobile Devices', parentId: null },
    { id: 3, name: 'Cameras', parentId: null },
    { id: 4, name: 'Home Appliances', parentId: null },
    { id: 5, name: 'Accessories', parentId: null },
  
    // Sub-categories for Computers
    { id: 6, name: 'Laptops', parentId: 1 },
    { id: 7, name: 'Desktops', parentId: 1 },
    { id: 8, name: 'Tablets', parentId: 1 }, // Example: Tablet under Computers
  
    // Sub-categories for Mobile Devices
    { id: 9, name: 'Smartphones', parentId: 2 },
    { id: 10, name: 'Smartwatches', parentId: 2 },
    { id: 11, name: 'Tablets', parentId: 2 }, // Example: Tablet also under Mobile
  
    // Sub-categories for Accessories
    { id: 12, name: 'Keyboards', parentId: 5 },
    { id: 13, name: 'Mice', parentId: 5 },
    { id: 14, name: 'Headphones', parentId: 5 },
  
    // Sub-sub-category example (Level 3)
    { id: 15, name: 'Gaming Laptops', parentId: 6 },
    { id: 16, name: 'Business Laptops', parentId: 6 },
  ];
  
// --- Mock Products (Updated Descriptions) ---
export const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Laptop Pro 15"',
      description: 'Experience top-tier performance and a stunning 15-inch Retina display. Ideal for creative professionals and demanding tasks, featuring ample storage and long battery life.',
      price: 14999.90,
      categoryId: 6,
      stockQuantity: 15,
      brandId: 1,
      isActive: true,
    },
    {
      id: 2,
      name: 'Smartphone X',
      description: 'Capture life\'s moments with an advanced triple-camera system and enjoy vibrant visuals on the edge-to-edge OLED screen. Power through your day with optimized battery performance.',
      price: 9890.00,
      categoryId: 9,
      stockQuantity: 15,
      brandId: 1,
      isActive: true,
    },
    {
      id: 3,
      name: 'Wireless Noise-Cancelling Headphones',
      description: 'Immerse yourself in pure sound with industry-leading active noise cancellation. Enjoy superior audio clarity and all-day comfort with this ergonomic over-ear design, perfect for travel or focus.',
      price: 3495.50,
      categoryId: 14,
      stockQuantity: 15,
      brandId: 1,
      isActive: true,
    },
    {
      id: 4,
      name: '4K Ultra HD Smart TV 55"',
      description: 'Bring entertainment to life with breathtaking 4K Ultra HD resolution and vibrant HDR colors on this 55-inch Smart TV. Access your favorite streaming services instantly via the intuitive interface.',
      price: 7490.00,
      categoryId: 4,
      stockQuantity: 15,
      brandId: 1,
      isActive: true,
    },
    {
      id: 5,
      name: 'Digital Camera Alpha',
      description: 'Unleash your creativity with this versatile mirrorless camera. Capture sharp, detailed photos and smooth 4K video, perfect for enthusiasts and aspiring photographers exploring different styles.',
      price: 11500.00,
      categoryId: 3,
      stockQuantity: 15,
      brandId: 1,
      isActive: true,
    },
    {
      id: 6,
      name: 'Gaming Laptop Beast',
      description: 'Dominate the competition with extreme gaming power packed into a portable chassis. Features a top-tier graphics card, ultra-fast refresh rate display, and advanced cooling for peak performance.',
      price: 21999.00,
      categoryId: 15,
      stockQuantity: 15,
      brandId: 1,
      isActive: true,
    },
    {
      id: 7,
      name: 'Business Laptop Slim',
      description: 'Stay productive on the go with this ultra-slim and lightweight business laptop. Offers exceptional battery life, robust security features, and a comfortable typing experience for professionals.',
      price: 13500.00,
      categoryId: 16,
      stockQuantity: 15,
      brandId: 1,
      isActive: true,
    },
    {
      id: 8,
      name: 'Mechanical Keyboard RGB',
      description: 'Elevate your typing and gaming experience with satisfying tactile feedback from premium mechanical switches. Customize your setup with vibrant per-key RGB backlighting and durable construction.',
      price: 899.00,
      categoryId: 12,
      stockQuantity: 15,
      brandId: 1,
      isActive: true,
    },
    {
      id: 9,
      name: 'Tablet Tab S9',
      description: 'Discover the ultimate versatile tablet for productivity and entertainment. Features a large, vibrant display perfect for multitasking, note-taking with stylus support, and immersive media consumption.',
      price: 6990.00,
      categoryId: 8,
      stockQuantity: 15,
      brandId: 1,
      isActive: true,
    },
    {
      id: 10,
      name: 'Tablet Tab Mini',
      description: 'Your perfect companion for reading, Browse, and casual entertainment on the move. This compact and lightweight mini tablet fits easily in your bag and offers a bright, clear display.',
      price: 4500.00,
      categoryId: 11,
      stockQuantity: 0,
      brandId: 1,
      isActive: true,
    }
  ];

  // New mock data for product images
export const mockProductImages: ProductImage[] = [
    // Images for Laptop Pro (id: 1)
    { id: 1001, productId: 1, imageUrl: 'https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/FL2C-A-BB-01?qlt=90&wid=1253&hei=705&extendN=0.12,0.12,0.12,0.12&bgc=FFFFFFFF&fmt=jpg', altText: 'Laptop Pro front view' },
    { id: 1002, productId: 1, imageUrl: 'https://i5.walmartimages.com/seo/HP-15-6-Screen-FHD-Laptop-Computer-AMD-Ryzen-5-5500U-8GB-RAM-256GB-SSD-Spruce-Blue-Windows-11-Home-15-ef2729wm_8dee5689-db47-45ac-9a0d-5399c95a8ee0.ad15a381ad98aa369a68bfb1527d66a9.jpeg', altText: 'Laptop Pro side view' },
    { id: 1003, productId: 1, imageUrl: 'https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/SPZ1B-Platinum-13-BB-00?qlt=90&wid=1253&hei=705&extendN=0.12,0.12,0.12,0.12&bgc=FFFFFFFF&fmt=jpg', altText: 'Laptop Pro keyboard detail' },
  
    // Image for Smartphone X (id: 2)
    { id: 1004, productId: 2, imageUrl: 'https://m.media-amazon.com/images/I/61aiFCe6PpL.jpg', altText: 'Smartphone X front' },
    { id: 1005, productId: 2, imageUrl: 'https://i5.walmartimages.com/asr/504d98eb-4703-43d3-ba29-3763c6526d4b.51f26bc3a78b6db578bc16b4f6a53456.jpeg', altText: 'Smartphone X back camera' },
  
    // Image for Headphones (id: 3)
     { id: 1006, productId: 3, imageUrl: 'https://cdn.mos.cms.futurecdn.net/JcTkkafu6X9GPCiZ28k7RV-1200-80.jpg', altText: 'Wireless Headphones' },
  
    // Image for Gaming Laptop (id: 6)
     { id: 1007, productId: 6, imageUrl: 'https://i.pcmag.com/imagery/roundups/01hiB08j7yaJGJmPl2YhRRH-59..v1713199550.jpg', altText: 'Gaming Laptop open' },
  
     // Add more images for other products as needed...
  ];

  // Optional: Mock Brand Data (if you want to display brand names)
export interface Brand { id: number; name: string; }
export const mockBrands: Brand[] = [
    { id: 1, name: 'ElectroBrand' },
    { id: 2, name: 'TechCore' },
    { id: 3, name: 'PixelPerfect Cameras' },
    { id: 4, name: 'HomeSmart Appliances' },
    { id: 5, name: 'GamerGear' },
    { id: 6, name: 'ClickTech Peripherals' },
];