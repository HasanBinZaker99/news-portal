const { formidable } = require("formidable");
/*
  Formidable helps your backend read form fields and uploaded files. In your news form, those could include the title, description, and selected image. 
  */
const cloudinary = require("cloudinary").v2;
/*
  Cloudinary provides tools for uploading, storing, and transforming images and videos. Its documentation recommends using this v2 interface.
*/
const newsModel = require("../models/newsModel");
const galleryModel = require("../models/galleryModel");

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
      //console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  // End Method

  get_images = async (req, res) => {
    const { id } = req.userInfo;
    try {
      const images = await galleryModel
        .find({ writerId: new ObjectId(id) })
        .sort({ createdAt: -1 });
      return res.status(200).json({ images });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  // End method

  add_images = async (req, res) => {
    const { id } = req.userInfo;
    const form = formidable({});

    cloudinary.config({
      cloud_name: process.env.cloud_name,
      api_key: process.env.api_key,
      api_secret: process.env.api_secret,
      secure: true,
    });
    try {
      const [_, files] = await form.parse(req);
      /**
       _ is a normal variable name that programmers often use to mean “this value is not needed.”
       form.parse(req) return two values: [fields, files]
       So your line:
       const [_, files] = await form.parse(req);

      assigns them like this:
      Variable	Receives
      _	Text fields, such as title or description
      files	Information about uploaded files

      The text fields are still stored in _, but your code does not use them. You only need files here. 
       */
      let allImages = [];
      const { images } = files;

      for (let i = 0; i < images.length; i++) {
        const { url } = await cloudinary.uploader.upload(images[i].filepath, {
          folder: "news_images",
        });
        allImages.push({ writerId: id, url });
      }
      const image = await galleryModel.insertMany(allImages);
      return res
        .status(201)
        .json({ images: image, message: "Images uploaded successfully!" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  //End method

  get_dashboard_news = async (req, res) => {
    const { id, role } = req.userInfo;
    try {
      if (role === "admin") {
        const news = await newsModel.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ news });
      } else {
        const news = await newsModel
          .find({ writerId: new ObjectId(id) })
          .sort({ createdAt: -1 });
        return res.status(200).json({ news });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  //End method

  get_edit_dashboard_news = async (req, res) => {
    const { news_id } = req.params;
    //console.log(news_id);
    try {
      const news = await newsModel.findById(news_id);
      return res.status(200).json({ news });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  //End method

  update_news = async (req, res) => {
    const { news_id } = req.params;
    const form = formidable({});

    cloudinary.config({
      cloud_name: process.env.cloud_name,
      api_key: process.env.api_key,
      api_secret: process.env.api_secret,
      secure: true,
    });

    try {
      const [fields, files] = await form.parse(req);
      /*
      fields contains the form’s text values. files contains information about uploaded files.
      */
      const { title, description } = fields;
      let url = fields.old_image[0];

      /*
    “If the files object contains at least one property, run this block.”
    Example 1: The user uploads a new image.
    const files = {
      new_image: [
        { filepath: "/tmp/upload_abc123" }
      ]
    };
    The property name—or key—is "new_image".
    Object.keys(files);
    // ["new_image"]
    Then:
    Object.keys(files).length;
    // 1
    Therefore, the condition becomes:
    if (1 > 0) {
      // True: run the image replacement code
    }
    Example 2: The user uploads no image.
    const files = {};
    There are no property names:
    Object.keys(files);
    // []

    Object.keys(files).length;
    // 0
    Therefore:
    if (0 > 0) {
      // False: skip the image replacement code
    }
    Each part does this:
    Code	Meaning
    Object.keys(files)	Get the property names from files
    .length	Count those names
    > 0	Check whether that count is greater than zero
    One detail: this counts uploaded field names, not individual files. If new_image contains two files, Object.keys(files) still returns ["new_image"], whose length is 1
          */
      if (Object.keys(files).length > 0) {
        await cloudinary.uploader.destroy(
          `news_images/${url.split("/").pop().split(".")[0]}`,
        );

        // This code uploads the newly selected image from your backend computer to Cloudinary, then response Cloudinary's response in data.
        const data = await cloudinary.uploader.upload(
          files.new_image[0].filepath,
          { folder: "news_images" },
        );
        //console.log("DataValue", data);
        url = data.url;
      }
      const news = await newsModel.findByIdAndUpdate(
        news_id,
        {
          title: title[0].trim(),
          slug: title[0].trim().split(" ").join("-"),
          description: description[0],
          image: url,
        },
        { new: true },
      );
      return res
        .status(201)
        .json({ message: "News updated successfully", news });
      /*
        { new: true } means news contains the updated title, slug, description, and image URL, along with the document’s other fields.
        The word new refers to the updated version of the existing document.
        */

      //let url = fields.old_image[0];
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = new newsControllers();
