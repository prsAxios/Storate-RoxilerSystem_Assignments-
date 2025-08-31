const { sequelize } = require("./models");

async function resetDatabase() {
  try {
    console.log("🔄 Starting database reset...");
    
    // Force sync will drop all tables and recreate them
    await sequelize.sync({ force: true });
    
    console.log("✅ Database reset completed successfully!");
    console.log("📋 All tables have been dropped and recreated:");
    console.log("   - Users");
    console.log("   - Stores");
    console.log("   - Reviews");
    console.log("   - Comments");
    console.log("   - Visitors");
    console.log("   - Favoritestores");
    console.log("   - UserLikedReview");
    console.log("   - UserLikedComment");
    console.log("   - UserReport");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  }
}

resetDatabase();
