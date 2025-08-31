const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {
  signup,
  login,
  getAllUsers,
  getMe,
  reportUser,
  getUser,
  promoteUser,
} = require("../controller/users");
const { authorization } = require("../middleware/auth");

router.get("/", authorization, wrapAsync(getAllUsers));

const upload = require("../middleware/upload");
router.post("/signup", upload.single("image"), wrapAsync(signup));

router.post("/login", wrapAsync(login));




router.get("/me", authorization, wrapAsync(getMe));

router.get("/:userId", getUser);

// Upload and serve profile picture
const { User } = require("../models");
router.post(
  "/:userId/picture",
  authorization,
  upload.single("image"),
  wrapAsync(async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    if (!(req.role === "admin" || String(req.userId) === String(req.params.userId))) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.picture_data = req.file.buffer;
    user.picture_mime = req.file.mimetype;
    await user.save();
    res.json({ message: "Profile picture updated" });
  })
);

router.get(
  "/:userId/picture",
  wrapAsync(async (req, res) => {
    const user = await User.findByPk(req.params.userId);
    if (!user || !user.picture_data) return res.status(404).send("Not found");
    res.setHeader("Content-Type", user.picture_mime || "application/octet-stream");
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.send(user.picture_data);
  })
);

router.post("/:userId/report", authorization, wrapAsync(reportUser));

router.put("/:userId/promote", authorization, wrapAsync(promoteUser));

module.exports = router;
