const { Sequelize, DataTypes } = require("sequelize");

const DATABASE_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const useSSL =
  (DATABASE_URL && /sslmode=require/i.test(DATABASE_URL)) ||
  String(process.env.POSTGRES_SSL || "").toLowerCase() === "true";

if (!DATABASE_URL) {
  console.warn("POSTGRES_URL (or DATABASE_URL) is not set. Using default local connection.");
}

const sequelize = new Sequelize(
  DATABASE_URL || "postgres://postgres:postgres@localhost:5432/store_world",
  {
    logging: false,
    dialect: "postgres",
    dialectOptions: useSSL
      ? {
          ssl: {
            require: true,
          },
        }
      : undefined,
  }
);

// Models
const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  auth_method: { type: DataTypes.ENUM("local", "google"), defaultValue: "local" },
  picture: { type: DataTypes.STRING, defaultValue: "" },
  picture_data: { type: DataTypes.BLOB },
  picture_mime: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.ENUM("user", "owner", "admin"), defaultValue: "user" },
});

const Store = sequelize.define("Store", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  image: { type: DataTypes.STRING },
  author: { type: DataTypes.STRING, allowNull: false },
  image_url: {
    type: DataTypes.STRING,
    defaultValue:
      "https://res.cloudinary.com/dibsgcq9a/image/upload/v1716750907/store-world/sfx9lfhbj3pkxy0esxkk.jpg",
  },
  image_data: { type: DataTypes.BLOB },
  image_mime: { type: DataTypes.STRING },
  genre: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
  year_published: { type: DataTypes.INTEGER, defaultValue: new Date().getFullYear() },
  ownerId: { type: DataTypes.INTEGER, allowNull: true },
});

const Review = sequelize.define("Review", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  likes: { type: DataTypes.INTEGER, defaultValue: 0 },
});

const Comment = sequelize.define("Comment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  likes: { type: DataTypes.INTEGER, defaultValue: 0 },
});

const Visitor = sequelize.define("Visitor", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userAgent: { type: DataTypes.STRING, allowNull: false },
  ip: { type: DataTypes.STRING, allowNull: false },
  firstLoginDate: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  visitCount: { type: DataTypes.INTEGER, defaultValue: 1 },
});

// Associations
User.hasMany(Review, { foreignKey: { name: "userId", allowNull: false }, onDelete: "CASCADE" });
Review.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });

Store.hasMany(Review, { foreignKey: { name: "storeId", allowNull: false }, onDelete: "CASCADE" });
Review.belongsTo(Store, { foreignKey: { name: "storeId", allowNull: false } });

// Owner relations
User.hasMany(Store, { foreignKey: { name: "ownerId", allowNull: true }, as: "ownedstores" });
Store.belongsTo(User, { foreignKey: { name: "ownerId", allowNull: true }, as: "owner" });

// Unique constraint for one review per user per store
Review.addHook("afterSync", async () => {
  const qi = sequelize.getQueryInterface();
  const tableName = Review.getTableName();
  try {
    await qi.addConstraint(tableName, {
      fields: ["storeId", "userId"],
      type: "unique",
      name: "reviews_unique_user_store",
    });
  } catch (e) {
    // ignore if exists
  }
});

Review.hasMany(Comment, { foreignKey: { name: "reviewId", allowNull: false }, onDelete: "CASCADE" });
Comment.belongsTo(Review, { foreignKey: { name: "reviewId", allowNull: false } });

Comment.hasMany(Comment, { as: "replies", foreignKey: "parentId", onDelete: "CASCADE" });
Comment.belongsTo(Comment, { as: "parent", foreignKey: "parentId" });



// Likes for reviews
const UserLikedReview = sequelize.define("UserLikedReview", {}, { timestamps: false });
User.belongsToMany(Review, { through: UserLikedReview, as: "likedReviews" });
Review.belongsToMany(User, { through: UserLikedReview, as: "likedBy" });

// Likes for comments
const UserLikedComment = sequelize.define("UserLikedComment", {}, { timestamps: false });
User.belongsToMany(Comment, { through: UserLikedComment, as: "likedComments" });
Comment.belongsToMany(User, { through: UserLikedComment, as: "likedBy" });

// Reports (self-referential many-to-many)
const UserReport = sequelize.define("UserReport", {}, { timestamps: false });
User.belongsToMany(User, { through: UserReport, as: "reportedBy", foreignKey: "reportedId", otherKey: "reporterId" });
User.belongsToMany(User, { through: UserReport, as: "reports", foreignKey: "reporterId", otherKey: "reportedId" });

// Ensure API responses include `_id` alias for backward compatibility
function addIdAlias(model) {
  const originalToJSON = model.prototype.toJSON;
  model.prototype.toJSON = function toJSONWithAlias() {
    const value = originalToJSON ? originalToJSON.call(this) : { ...this.get() };
    if (value && value.id !== undefined && value._id === undefined) {
      value._id = value.id;
    }
    return value;
  };
}

[User, Store, Review, Comment, Visitor].forEach(addIdAlias);

module.exports = {
  sequelize,
  Sequelize,
  User,
  Store,
  Review,
  Comment,
  Visitor,

  UserLikedReview,
  UserLikedComment,
  UserReport,
};


