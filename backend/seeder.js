const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const MenuItem = require('./models/MenuItem');

dotenv.config();
connectDB();

// Image URL mapping based on categories
const categoryImages = {
    'salades': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'pates': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w-800&q=80',
    'pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'sandwichs': 'https://images.unsplash.com/photo-1551509134-eb7c5e9e5f5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'paninis': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'burgers': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'brochettes': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'marocains': 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'supplements': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'boissons': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
};

// Specific images for certain popular items
const specialItemImages = {
    'Salade Niçoise': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Lasagne bolognaise': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Pizza Margharita': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Pizza 4 Fromages': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Burger Poulet': 'https://images.unsplash.com/photo-1603064752734-4c48eff53d05?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Burger Viande hachée': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Couscous': 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Café Noir': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Café Crème': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Cappuccino': 'https://images.unsplash.com/photo-1534778101976-62847782c213?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Thé à la Menthe': 'https://images.unsplash.com/photo-1560512823-829485b8bf24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Jus d\'Orange': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Milkshake Chocolat': 'https://images.unsplash.com/photo-1577805947697-89e18249d767?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Coca-Cola': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
};

const menuItems = [
    // ===== EXISTING FOOD ITEMS =====

    // SALADES
    { name: "Salade Végétarienne", price: 24, category: "salades", description: "Salade verte, tomate, pomme de terre, carotte, concombre, haricot vert, riz, maïs, olives noires, oignon" },
    { name: "Salade Niçoise", price: 30, category: "salades", description: "Salade verte, haricot vert, tomate, pomme de terre, poivron, thon; olives noires, oeuf dur, oignon au choix" },
    { name: "Pasta Salade", price: 35, category: "salades", description: "Penne, maïs, jambon, tomate, oignon, thon, olives noires, concombre, vinaigrette" },
    { name: "Salade Di pollo", price: 35, category: "salades", description: "Salade verte, tomate, poulet, croûton, fromage, parmesan" },
    { name: "Salade du Chef", price: 60, category: "salades", description: "Salade verte, ananas, jambon, fromage, pomme, tomate, avocat, riz, orange, sauce cocktail, calama" },
    { name: "Salade Pêcheur", price: 60, category: "salades", description: "Salade verte, crevette, calamar, maïs, tomate, avocat, fromage" },

    // PATES
    { name: "Végétarienne", price: 28, category: "pates", description: "Légume de saison, huile d'olive, ail" },
    { name: "Arabiata", price: 28, category: "pates", description: "Parmesan, sauce tomate piquante" },
    { name: "Lasagne bolognaise", price: 37, category: "pates", description: "Sauce tomate, viande hachée" },
    { name: "Carbonara", price: 40, category: "pates", description: "Charcuterie, sauce blanche, parmesan" },
    { name: "Bolognaise", price: 44, category: "pates", description: "Sauce tomate, viande hachée, parmesan" },
    { name: "Poulet vert", price: 47, category: "pates", description: "Poulet, champignon, sauce blanche, basilic, parmesan" },
    { name: "Lasagne fruits de mer", price: 50, category: "pates", description: "Sauce blanche, calamar, crevette, fromage" },
    { name: "Vénitienne", price: 49, category: "pates", description: "Poulet, champignons, fromage, sauce blanche" },
    { name: "Pêcheur", price: 65, category: "pates", description: "Crevette, calamar, sauce blanche, parmesan" },
    { name: "Pâtes du chef", price: 60, category: "pates", description: "Poulet, légumes, crevette, huile d'olive" },
    { name: "Pasta al tonno", price: 45, category: "pates", description: "Thon, sauce tomate, l'ail, fromage, l'huile d'olive" },

    // PIZZA
    { name: "Pizza Margharita", price: 30, category: "pizza", description: "Sauce tomate, mozzarella, olives noires, parmesan" },
    { name: "Pizza au Thon", price: 40, category: "pizza", description: "Sauce tomate, mozzarella, thon, olives noires, parmesan, poivron" },
    { name: "Pizza Végétarienne", price: 33, category: "pizza", description: "Sauce tomate, mozzarella, parmesan, poivron, champignons, olives noires" },
    { name: "Pizza 4 Fromages", price: 49, category: "pizza", description: "Sauce blanche, mozzarella, ricotta, parmesan, fromage bleu" },
    { name: "Pizza Chicken", price: 46, category: "pizza", description: "Sauce tomate, mozzarella, poulet, olives noires, parmesan, champignons" },
    { name: "Pizza Royale", price: 50, category: "pizza", description: "Sauce tomate, mozzarella, charcuterie, ananas, olives noires, parmesan, champignons" },
    { name: "Pizza Américaine", price: 50, category: "pizza", description: "Sauce tomate, mozzarella, pepperoni, crevette, parmesan" },
    { name: "Pizza Viande hachée", price: 52, category: "pizza", description: "Sauce tomate, mozzarella, champignons, viande hachée, parmesan, olives noires" },
    { name: "Pizza 4 Saisons", price: 55, category: "pizza", description: "Sauce tomate, mozzarella, poulet, thon, viande hachée, crevettes, olives noires" },
    { name: "Pizza Whatsapp", price: 65, category: "pizza", description: "Crevette, poulet, viande hachée, pepperoni, sauce tomate, mozzarella, parmesan" },
    { name: "Pizza Fruits de mer", price: 70, category: "pizza", description: "Crevette, calamars, sauce tomate, mozzarella, parmesan" },

    // SANDWICHS
    { name: "Sandwich Thon", price: 24, category: "sandwichs", description: "Sandwich au thon" },
    { name: "Sandwich Poulet", price: 28, category: "sandwichs", description: "Sandwich au poulet" },
    { name: "Sandwich Merguez", price: 32, category: "sandwichs", description: "Sandwich à la merguez" },
    { name: "Sandwich Viande hachée", price: 32, category: "sandwichs", description: "Sandwich à la viande hachée" },
    { name: "Sandwich Mixte", price: 35, category: "sandwichs", description: "Sandwich mixte" },

    // PANINIS
    { name: "Panini Thon", price: 22, category: "paninis", description: "Panini au thon" },
    { name: "Panini Poulet", price: 25, category: "paninis", description: "Panini au poulet" },
    { name: "Panini Merguez", price: 28, category: "paninis", description: "Panini à la merguez" },
    { name: "Panini Viande hachée", price: 28, category: "paninis", description: "Panini à la viande hachée" },
    { name: "Panini Mixte", price: 28, category: "paninis", description: "Panini mixte" },
    { name: "Panini Charcuterie", price: 24, category: "paninis", description: "Panini à la charcuterie" },

    // BURGERS
    { name: "Burger Poulet", price: 32, category: "burgers", description: "Burger au poulet" },
    { name: "Burger Viande hachée", price: 35, category: "burgers", description: "Burger à la viande hachée" },

    // BROCHETTES
    { name: "Brochette Poulet", price: 32, category: "brochettes", description: "Brochette de poulet" },
    { name: "Brochette Viande", price: 32, category: "brochettes", description: "Brochette de viande" },
    { name: "Brochette Viande hachée", price: 32, category: "brochettes", description: "Brochette de viande hachée" },
    { name: "Brochette Merguez", price: 32, category: "brochettes", description: "Brochette de merguez" },
    { name: "Brochette Mixte", price: 32, category: "brochettes", description: "Brochette mixte" },

    // MAROCAINS
    { name: "Couscous", price: 32, category: "marocains", description: "Couscous traditionnel (chaque vendredi)", availableDays: [5] },
    { name: "Rfissa", price: 32, category: "marocains", description: "Rfissa traditionnelle (chaque mercredi)", availableDays: [3] },
    { name: "Poulet au citron", price: 32, category: "marocains", description: "Poulet au citron marocain" },
    { name: "Kefta", price: 32, category: "marocains", description: "Kefta traditionnelle" },
    { name: "Boeuf aux pruneaux", price: 32, category: "marocains", description: "Boeuf aux pruneaux marocain" },

    // SUPPLEMENTS
    { name: "Fromage", price: 3, category: "supplements", description: "Supplément fromage" },
    { name: "Frites", price: 3, category: "supplements", description: "Portion de frites" },

    // ===== NEW DRINKS SECTION =====
    // Using category: "boissons"

    // DEFINING COMMON OPTIONS
    // We will attach these to items below

    // CAFÉ CLASSIQUE MAROCAIN
    {
        name: "Café Noir", price: 9, category: "boissons", description: "Café simple, sans lait",
        options: [
            { name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] },
            { name: "Type", choices: ["Verre", "Tasse"] }
        ]
    },
    {
        name: "Café Crème", price: 10, category: "boissons", description: "Café avec lait",
        options: [
            { name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] },
            { name: "Type", choices: ["Verre", "Tasse"] }
        ]
    },
    {
        name: "Café au Lait", price: 11, category: "boissons", description: "Plus de lait que café",
        options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }]
    },
    {
        name: "Café Cassé", price: 10, category: "boissons", description: "Café avec un peu de lait",
        options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }]
    },
    {
        name: "Café Serré", price: 9, category: "boissons", description: "Café très fort",
        options: [
            { name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] },
            { name: "Type", choices: ["Verre", "Tasse"] }
        ]
    },
    {
        name: "Café Allongé", price: 10, category: "boissons", description: "Café léger, plus d'eau",
        options: [
            { name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] },
            { name: "Type", choices: ["Verre", "Tasse"] }
        ]
    },
    {
        name: "Nescafé", price: 11, category: "boissons", description: "Café instantané",
        options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }]
    },
    {
        name: "Nescafé au Lait", price: 12, category: "boissons", description: "Nescafé + lait",
        options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }]
    },

    // CAFÉ ESPRESSO
    {
        name: "Espresso", price: 11, category: "boissons", description: "Café court et fort",
        options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }]
    },
    {
        name: "Double Espresso", price: 15, category: "boissons", description: "Deux doses",
        options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }]
    },
    {
        name: "Lungo", price: 12, category: "boissons", description: "Espresso allongé",
        options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }]
    },
    {
        name: "Americano", price: 13, category: "boissons", description: "Espresso + eau chaude",
        options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }]
    },

    // CAFÉ AVEC LAIT
    {
        name: "Cappuccino", price: 13, category: "boissons", description: "Café + lait mousseux",
        options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }]
    },
    {
        name: "Latte", price: 14, category: "boissons", description: "Beaucoup de lait, café doux",
        options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }]
    },
    {
        name: "Café Viennois", price: 16, category: "boissons", description: "Café + crème",
        options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }]
    },

    // THÉ MAROCAIN
    {
        name: "Thé à la Menthe", price: 9, category: "boissons", description: "Thé vert + menthe fraîche",
        options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }]
    },
    {
        name: "Thé Fort", price: 9, category: "boissons", description: "Thé concentré",
        options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }]
    },
    {
        name: "Thé Léger", price: 9, category: "boissons", description: "Peu de thé",
        options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }]
    },

    // THÉS AUX HERBES
    { name: "Thé à la Verveine", price: 10, category: "boissons", description: "Relaxant", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },
    { name: "Thé au Chiba", price: 10, category: "boissons", description: "Amer, digestif", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },
    { name: "Thé au Fenouil", price: 10, category: "boissons", description: "Digestif", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },
    { name: "Thé au Gingembre", price: 11, category: "boissons", description: "Chaud et épicé", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },

    // THÉS INTERNATIONAUX
    { name: "Thé Noir", price: 9, category: "boissons", description: "Classique", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },
    { name: "Thé Vert", price: 9, category: "boissons", description: "Sans menthe", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },
    { name: "Thé Lipton", price: 9, category: "boissons", description: "Sachet", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },
    { name: "Thé à la Camomille", price: 10, category: "boissons", description: "Relaxant", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },

    // JUS FRAIS
    { name: "Jus d'Orange", price: 12, category: "boissons", description: "Jus d'orange frais", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },
    { name: "Jus de Citron", price: 10, category: "boissons", description: "Jus de citron frais", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },
    { name: "Jus de Banane", price: 12, category: "boissons", description: "Jus de banane frais", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },
    { name: "Jus de Pomme", price: 12, category: "boissons", description: "Jus de pomme frais", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },
    { name: "Jus de Fraise", price: 14, category: "boissons", description: "Jus de fraise frais", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },

    // JUS AVOCAT & SPÉCIAUX
    { name: "Jus d'Avocat", price: 18, category: "boissons", description: "Avocat + lait", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },
    { name: "Avocat aux Fruits Secs", price: 20, category: "boissons", description: "Avocat + amandes/noix", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },
    { name: "Zembou", price: 20, category: "boissons", description: "Banane + avocat + fruits secs", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },
    { name: "Panaché", price: 16, category: "boissons", description: "Mélange de fruits", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },

    // MILKSHAKES
    { name: "Milkshake Vanille", price: 16, category: "boissons", description: "Milkshake à la vanille" },
    { name: "Milkshake Chocolat", price: 16, category: "boissons", description: "Milkshake au chocolat" },
    { name: "Milkshake Fraise", price: 16, category: "boissons", description: "Milkshake à la fraise" },

    // BOISSONS AU LAIT
    { name: "Lait Chaud", price: 9, category: "boissons", description: "Lait chaud", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },
    { name: "Lait Froid", price: 8, category: "boissons", description: "Lait froid", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },
    { name: "Lait au Chocolat", price: 11, category: "boissons", description: "Lait avec chocolat", options: [{ name: "Sucre", choices: ["Sans", "Un peu", "Normal", "Extra"] }] },
    { name: "Lait Caillé (Raib)", price: 9, category: "boissons", description: "Lait caillé traditionnel" },

    // BOISSONS GAZEUSES
    { name: "Coca-Cola", price: 9, category: "boissons", description: "Coca-Cola" },
    { name: "Sprite", price: 9, category: "boissons", description: "Sprite" },
    { name: "Fanta", price: 9, category: "boissons", description: "Fanta" },
    { name: "Hawai", price: 8, category: "boissons", description: "Hawai" },
    { name: "Poms", price: 8, category: "boissons", description: "Poms" },

    // EAU
    { name: "Eau Minérale", price: 6, category: "boissons", description: "Eau minérale (Sidi Ali, etc.)" },
    { name: "Eau Gazeuse", price: 7, category: "boissons", description: "Eau gazeuse" }
];

const completeMenuItems = menuItems.map(item => ({
    ...item,
    description: item.description || "",
    // Assign imageUrl based on priority: special item image -> category image -> default
    imageUrl: specialItemImages[item.name] || categoryImages[item.category] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    availableDays: item.availableDays || [],
    options: item.options || [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
}));

const importData = async () => {
    try {
        await MenuItem.deleteMany();
        console.log('Data Destroyed...');

        await MenuItem.insertMany(completeMenuItems);
        console.log('Data Imported!');

        // Count items by category
        const count = await MenuItem.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        console.log('\n📊 Menu Items by Category:');
        count.forEach(cat => {
            console.log(`${cat._id}: ${cat.count} items`);
        });

        // Show some image URLs for verification
        console.log('\n🖼️  Sample Image URLs:');
        const sampleItems = await MenuItem.find({}).limit(5);
        sampleItems.forEach(item => {
            console.log(`${item.name}: ${item.imageUrl.substring(0, 60)}...`);
        });

        const total = await MenuItem.countDocuments();
        console.log(`\n✅ Total Menu Items: ${total}`);

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();