import { Product } from '../context/CartContext';

export const MOCK_PRODUCTS: (Product & { description: string; rating: number; reviewsCount: number; stock: number })[] = [
    {
        id: 'm1',
        title: 'Premium LED Fairy Lights (50m)',
        price: 1200,
        category: 'Decor',
        image: 'https://images.unsplash.com/photo-1729919561898-f4a994c90b0c?w=600&auto=format&fit=crop&q=80',
        description: 'Enchanting warm white LED string lights. Waterproof and durable, perfect for backdrops and canopy ceilings.',
        rating: 4.8,
        reviewsCount: 124,
        stock: 45
    },
    {
        id: 'm2',
        title: 'Elegant Floral Centerpiece Set',
        price: 4500,
        category: 'Decor',
        image: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=600',
        description: 'Handcrafted artificial rose and hydrangea floral centerpieces. Adds a touch of luxury to event guest tables.',
        rating: 4.9,
        reviewsCount: 98,
        stock: 20
    },
    {
        id: 'm3',
        title: 'Personalized Welcome Sign (Acrylic)',
        price: 3000,
        category: 'Signage',
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600',
        description: 'Frosted acrylic sheet with custom gold foil text. Customize with your name and event date.',
        rating: 4.7,
        reviewsCount: 65,
        stock: 15
    },
    {
        id: 'm4',
        title: 'Bridal Squad Satin Robes (Pack of 5)',
        price: 7500,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1684244177286-8625c54bce6d?w=600&auto=format&fit=crop&q=80',
        description: 'Super-soft silk satin robes with "Bride" and "Bridesmaid" embroidered on the back in gold script.',
        rating: 4.8,
        reviewsCount: 112,
        stock: 30
    },
    {
        id: 'm5',
        title: 'Vintage Photo Booth Props Kit',
        price: 800,
        category: 'Entertainment',
        image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600',
        description: 'Fun collection of vintage-style cardboard props including retro glasses, hats, mustaches, and signs.',
        rating: 4.6,
        reviewsCount: 88,
        stock: 80
    },
    {
        id: 'm6',
        title: 'Custom Engraved Champagne Flutes',
        price: 2200,
        category: 'Gifts',
        image: 'https://images.unsplash.com/photo-1723431620052-46680a65c7b7?w=600&auto=format&fit=crop&q=80',
        description: 'Pair of crystal champagne glasses engraved with initials. Elegant keepsake for the bride and groom.',
        rating: 4.9,
        reviewsCount: 140,
        stock: 25
    },
    {
        id: 'm7',
        title: 'Vintage Metal Lantern Candle Holder',
        price: 1500,
        category: 'Decor',
        image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=600',
        description: 'Distressed black metal lantern with glass panels. Perfect for aisle decoration and tabletop ambience.',
        rating: 4.7,
        reviewsCount: 76,
        stock: 60
    },
    {
        id: 'm8',
        title: 'Groom & Groomsmen Bow Tie Set (Pack of 5)',
        price: 3500,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600',
        description: 'Premium matching velvet bow ties in deep emerald green. Pre-tied with adjustable straps.',
        rating: 4.8,
        reviewsCount: 42,
        stock: 18
    },
    {
        id: 'm9',
        title: 'Golden Table Number Stands (Set of 1-20)',
        price: 2500,
        category: 'Signage',
        image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600',
        description: 'Elegant hoop design table card holders in metallic polished gold. Stable heavy base.',
        rating: 4.5,
        reviewsCount: 33,
        stock: 40
    },
    {
        id: 'm10',
        title: 'Handmade Scented Soy Candles (Box of 4)',
        price: 1800,
        category: 'Gifts',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600',
        description: 'Luxury lavender and vanilla scented soy candles in elegant amber jars. Perfect event return favors.',
        rating: 4.9,
        reviewsCount: 110,
        stock: 55
    },
    {
        id: 'm11',
        title: 'Wireless LED Party Uplighter (Rechargeable)',
        price: 5200,
        category: 'Entertainment',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600',
        description: 'Compact wireless RGBWA+UV uplight. Remote controlled with active sound syncing capabilities.',
        rating: 4.8,
        reviewsCount: 57,
        stock: 12
    },
    {
        id: 'm12',
        title: 'Custom Wooden Photo Guestbook',
        price: 2800,
        category: 'Gifts',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600',
        description: 'Laser-engraved wooden cover book with thick blank pages. Fits Polaroid guest photos and signatures.',
        rating: 4.9,
        reviewsCount: 84,
        stock: 22
    }
];
