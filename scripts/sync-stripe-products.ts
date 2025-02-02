import { syncProducts } from "@/lib/infrastructure/stripe/products";

async function main() {
    try {
        console.log("Starting Stripe product synchronization...");
        await syncProducts();
        console.log("Successfully synchronized products with Stripe");
        process.exit(0);
    } catch (error) {
        console.error("Error synchronizing products:", error);
        process.exit(1);
    }
}

main();
