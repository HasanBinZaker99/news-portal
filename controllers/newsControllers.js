const { formidable } = require("formidable");
/*
  Formidable helps your backend read form fields and uploaded files. In your news form, those could include the title, description, and selected image. 
  */
const cloudinary = require("cloudinary").v2;
/*
  Cloudinary provides tools for uploading, storing, and transforming images and videos. Its documentation recommends using this v2 interface.
  */
const newsModel = require("../models/newsModel");
const {
  mongo: { ObjectId },
} = require("mongoose");
const moment = require("moment");
/*This loads Moment, a library for working with dates and times.*/
class newsControllers {
  add_news = async (req, res) => {
    const form = formidable({});

    cloudinary.config({
      cloud_name: process.env.cloud_name,
      api_key: process.env.api_key,
      api_secret: process.env.api_secret,
      secure: true,
      /* secure: true tells Cloudinary to generate and deliver all your images and videos using HTTPS instead of HTTP */
    });

    try {
      /**
  fields: The written answers on the paper form (the text data).
  files: The USB flash drive containing the actual image (the uploaded file).
  */
      //console.log(req.userInfo);
      if (!req.userInfo) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { id, name, category } = req.userInfo;
      const [fields, files] = await form.parse(req);
      const { url } = await cloudinary.uploader.upload(
        files.image[0].filepath,
        {
          folder: "news_images",
        },
      );
      const { title, description } = fields;
      const news = await newsModel.create({
        writerId: id,
        writerName: name,
        title: title[0].trim(),
        slug: title[0].trim().split(" ").join("-"),
        category,
        description: description[0],
        date: moment().format("LL"),
        image: url,
      });
      return res.status(201).json({ message: "News added successfully", news });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = new newsControllers();
