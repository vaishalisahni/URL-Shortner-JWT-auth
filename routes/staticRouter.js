const express = require('express');
const URL = require("../models/url");
const { restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.get('/admin/urls',restrictTo(["ADMIN"]),async (req, res) => {
  const allUrls = await URL.find({}).populate("createdBy", "email"); // admin can see all the users 
  res.render('home', {
    urls: allUrls,
    isAdmin:true,
  });
});

router.get('/', restrictTo(["NORMAL","ADMIN"]), async (req, res) => {
  // if (!req.user) return res.redirect("/login");

  // const allUrls = await URL.find({}); // before login signup logic

  // ṇow we will show only those links which are created by the user
  const allUrls = await URL.find({ createdBy: req.user._id })
  res.render('home', {
    urls: allUrls,
  });
});

router.get('/signup', (req, res) => {
  res.render("signup");
})

router.get('/login', (req, res) => {
  res.render("login");
})

module.exports = router;
