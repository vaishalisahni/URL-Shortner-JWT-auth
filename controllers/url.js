const { nanoid } = require("nanoid");

const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    const allUrls = await URL.find({createdBy:req.user._id});
    const body = req.body;
    if (!body.url) {
        return res.status(400).json({ message: "URL is required" });
    }
    const shortId = nanoid(8);

    await URL.create({
        shortId: shortId,
        redirectUrl: body.url,
        visitHistory: [],
        createdBy: req.user._id, // this came bcoz we are using middleware where we are passing req.user
    });
    return res.render("home", {
        id: shortId,
        urls: allUrls,
    });
    // return res.status(201).json({ message: "Short URL created successfully", id: shortId });
}

// ******************************For Discord bot *****************************
// async function handleGenerateNewShortURL(req, res) {
//     const isFromDiscord = req.query.from === "discord";

//     const body = req.body;
//     if (!body.url) {
//         return res.status(400).json({ message: "URL is required" });
//     }

//     const shortId = nanoid(8);

//     const newEntry = {
//         shortId: shortId,
//         redirectUrl: body.url,
//         visitHistory: []
//     };

//     if (!isFromDiscord) {
//         // this line will throw if req.user is undefined
//         newEntry.createdBy = req.user._id;
//     }

//     await URL.create(newEntry);

//     // Send plain response if from Discord
//     if (isFromDiscord) {
//         return res.status(201).json({ message: "Short URL created", id: shortId });
//     }

//     const allUrls = await URL.find({ createdBy: req.user._id });

//     return res.render("home", {
//         id: shortId,
//         urls: allUrls,
//     });
// }

async function handleGetOriginalURL(req, res) {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push:
        {
            visitHistory: {
                timestamps: new Date()
            }
        }
    });

    res.redirect(entry.redirectUrl);
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;

    const result = await URL.findOne({ shortId })

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    })
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetOriginalURL,
    handleGetAnalytics
}
