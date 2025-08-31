const { Store, Review, User } = require("../models");
const { Op } = require("sequelize");
const ExpressError = require("../utils/ExpressErrors");
const { deleteCommentAndReplies } = require("./comments");

module.exports.getAllStores = async (req, res) => {
  const { q } = req.query;
  const { ownerId } = req.query;

  let stores;
  const where = {};
  if (q) {
    const searchWords = q.split(" ").join("|");
    where[Op.or] = [
      { title: { [Op.iRegexp]: searchWords } },
      { description: { [Op.iRegexp]: searchWords } },
      { genre: { [Op.overlap]: q.split(" ") } },
    ];
  }
  if (ownerId) {
    where.ownerId = ownerId;
  }
  stores = await Store.findAll({ where });
  res.json({
    stores: stores,
  });
};

module.exports.getStore = async (req, res) => {
  const id = req.params.id;
  const store = await Store.findByPk(id);

  res.json({
    store,
  });
};

  module.exports.createStore = async (req, res) => {
  if (req.role !== "admin") {
    if (req.role !== "owner") {
      throw new ExpressError(401, "You are not Authorized to Add Store");
    }
  }
  const body = req.body;

  // Normalize incoming types for Postgres/Sequelize
    if (body.genre && !Array.isArray(body.genre)) {
    body.genre = typeof body.genre === "string" ? [body.genre] : [];
  }
    if (body.year_published !== undefined) {
    body.year_published = parseInt(body.year_published, 10);
  }

  if (req.file) {
    body.image_mime = req.file.mimetype;
    body.image_data = req.file.buffer;
  }

  if (req.role === "owner") {
    body.ownerId = req.userId;
  }
    const store = await Store.create(body);

  res.json({
    store,
    message: `New Store: ${store.title} Added`,
  });
};

module.exports.deleteStore = async (req, res) => {
  const id = req.params.id;
  const store = await Store.findByPk(id);
  
  if (!store) {
    throw new ExpressError(404, "Store not found");
  }
  
  if (!(req.role === "admin")) {
    if (!(req.role === "owner" && store.ownerId == req.userId)) {
      throw new ExpressError(401, "You are not Authorized to Delete a Store");
    }
  }
  
  await store.destroy();

  res.json({
    store: store,
    message: `Store Deleted: ${store.title}`,
  });
};

module.exports.updateStore = async (req, res) => {
  if (!(req.role === "admin")) {
    const existing = await Store.findByPk(req.params.id);
    if (!(req.role === "owner" && existing && existing.ownerId == req.userId)) {
      throw new ExpressError(401, "You are not Authorized to Update a Store");
    }
  }
  const id = req.params.id;
  const body = req.body;

  // Normalize incoming types for Postgres/Sequelize
  if (body.genre && !Array.isArray(body.genre)) {
    body.genre = typeof body.genre === "string" ? [body.genre] : [];
  }
  if (body.year_published !== undefined) {
    body.year_published = parseInt(body.year_published, 10);
  }

  const previous = await Store.findByPk(id);
  if (req.file) {
    body.image_mime = req.file.mimetype;
    body.image_data = req.file.buffer;
  } else {
    body.image_mime = previous.image_mime;
    body.image_data = previous.image_data;
  }

  await Store.update(body, { where: { id } });
  const current = await Store.findByPk(id);

  res.json({
    previous,
    current,
    message: `Store Updated`,
  });
};
