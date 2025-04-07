const pool = require("../config/config");
const path = require("path");
const fs = require("fs");

exports.getSummary = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id AS category_id,
        c.name AS category_name,
        c.logo AS category_logo,
        ac.id AS crop_id,
        ac.name AS crop_name,
        ac.logo,
        ac.preview,
        ac.removed  -- include removed column
      FROM 
        "addCategory" c
      LEFT JOIN 
        "AddCropNames" ac ON ac.category_id = c.id
      ORDER BY 
        c.name, ac.name;
    `;

    const { rows } = await pool.query(query);

    const filteredRows = rows.filter(row => row.crop_id !== null);

    const totalCategories = new Set(rows.map(row => row.category_id)).size;

    const totalCrops = filteredRows.length;

    const previewedCrops = filteredRows.filter(row => row.preview === true).length;

    const removedCrops = filteredRows.filter(row => row.removed === true).length;

    res.status(200).json({
      totalCategories,
      totalCrops,
      reviewCrops: previewedCrops,
      removedCrops,
      breakdown: filteredRows, 
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
  

exports.setCropPreviewTrue = async (req, res) => {
    const cropId = req.params.id;
  
    try {
      const query = `
        UPDATE "AddCropNames"
        SET preview = true
        WHERE id = $1
        RETURNING *;
      `;
      const { rows } = await pool.query(query, [cropId]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "Crop not found" });
      }
  
      res.status(200).json({
        message: "Preview updated successfully",
        data: rows[0],
      });
    } catch (error) {
      console.error("Error updating preview:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
};
  
  