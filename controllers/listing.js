const Listing = require('../models/listing.js');
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };

module.exports.renderNewForm =  (req, res) => {
    res.render("listings/new.ejs");
  }

  module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"},}).populate("owner");
    if(!listing){
      req.flash("error", "Listing You Requested For does not exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }

  module.exports.searchListing = async (req, res) => {
    const { category } = req.query;
  
    if (!category) {
      req.flash("error", "Search term cannot be empty.");
      return res.redirect("/listings"); // <-- return added here
    }
  
    const filteredListings = await Listing.find({
      category: { $regex: new RegExp(category, 'i') }
    });
  
    res.render("listings/index.ejs", { allListings: filteredListings });
  };
  
  

  module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = {url, filename};
    }
    let category = req.body.listing.category;
    console.log(category);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  }

  module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing You Requested For does not exist");
      res.redirect("/listings");
    }

  
    let originalImageUrl = listing.image?.url || null;
    if(originalImageUrl){
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_150");
    }
    res.render("listings/edit.ejs", { listing, originalImageUrl });
  }
  
  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    } 
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
  }

  module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id, { ...req.body.listing });
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
  }