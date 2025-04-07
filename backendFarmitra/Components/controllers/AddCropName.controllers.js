const pool = require("../config/config");
const path = require("path");
const fs = require("fs");

exports.addCropName = async (req, res) => {
  try {
    const { name, category } = req.body; 

    if (!name || !category) {
      return res
        .status(400)
        .json({ error: "Crop name and category are required." });
    }

    const checkQuery = `SELECT * FROM "AddCropNames" WHERE name = $1`;
    const checkResult = await pool.query(checkQuery, [name]);

    if (checkResult.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Crop with this name already exists." });
    }

    const logoFile = req.files["logo"]?.[0];
    const coverFile = req.files["cover"]?.[0];

    if (!logoFile || !coverFile) {
      return res
        .status(400)
        .json({ error: "Both logo and cover images are required." });
    }

    const logoPath = "/uploads/" + logoFile.filename;
    const coverPath = "/uploads/" + coverFile.filename;

    const insertQuery = `
      INSERT INTO "AddCropNames" (name, category_id, logo, cover)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    const values = [name, category, logoPath, coverPath];
    const insertResult = await pool.query(insertQuery, values);

    const newCrop = {
      id: insertResult.rows[0].id,
      name,
      category_id: category,
      logo: logoPath,
      cover: coverPath,
    };

    res.status(201).json(newCrop);
  } catch (error) {
    console.error("Error while adding crop:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCropName = async (req, res) => {
  try {
    const query = `
      SELECT c.id, c.name, c.logo, c.cover, a.name AS category_name , a.logo AS categoryLogo ,  a.id AS category_id
      FROM "AddCropNames" c JOIN "addCategory" a ON c.category_id = a.id WHERE removed = false

    `;

    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching crops:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteCropName = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Crop ID is required" });
  }

  try {
    const result = await pool.query(
      'UPDATE "AddCropNames" SET removed = true WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Crop not found" });
    }

    res.status(200).json({
      message: "Crop marked as removed successfully",
      updatedCrop: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating crop as removed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.editCropName = async (req, res) => {
    try {
      const cropId = req.params.id;
      const { name, category } = req.body;
  
      let logo = null;
      let cover = null;
  
      if (req.files) {
        if (req.files.logo) {
          logo = req.files.logo[0].filename;
        }
        if (req.files.cover) {
          cover = req.files.cover[0].filename;
        }
      }
  
      const fields = [];
      const values = [];
      let paramIndex = 1;
  
      if (name) {
        fields.push(`name = $${paramIndex++}`);
        values.push(name);
      }
      if (category) {
        fields.push(`category_id = $${paramIndex++}`);
        values.push(category);
      }
      if (logo) {
        fields.push(`logo = $${paramIndex++}`);
        values.push(logo);
      }
      if (cover) {
        fields.push(`cover = $${paramIndex++}`);
        values.push(cover);
      }
  
      if (fields.length === 0) {
        return res.status(400).json({ message: "No fields to update" });
      }
  
      fields.push(`"updatedAt" = CURRENT_TIMESTAMP`);
      values.push(cropId);
  
      const query = `UPDATE "AddCropNames" SET ${fields.join(', ')} WHERE id = $${paramIndex}`;
  
      const result = await pool.query(query, values);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Crop not found" });
      }
  
      res.status(200).json({ message: "Crop updated successfully" });
  
    } catch (error) {
      console.error("Error updating crop:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  