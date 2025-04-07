const pool = require("../config/config"); // Import database connection
const upload = require("../utils/multer.utils");
const path = require("path");
const fs = require("fs");

exports.addCropCategory = async (req, res) => {

    try {
        const { name } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        console.log(name, image, "name and image are given below");

        if (!name || !image) {
            return res.status(400).json({ error: "Name and Image are required" });
        }

        const query = `
            INSERT INTO "addCategory" (name, logo, "createdAt", "updatedAt")
            VALUES ($1, $2, NOW(), NOW()) 
            RETURNING *;
        `;

        const values = [name, image];

        const result = await pool.query(query, values);

        return res.status(201).json({
            message: "Crop Category Added Successfully",
            category: result.rows[0], 
        });

    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getCropCategory = async (req, res) => {
    console.log("2343")
    try {
        console.log("131")
        const query = `SELECT * FROM "addCategory" ORDER BY "id" DESC;`;
        
        const result = await pool.query(query);
   console.log(result , "result")
        return res.status(200).json({
            message: "Crop Categories Fetched Successfully",
            categories: result.rows,
        });

    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.deleteCropCategory = async (req, res) => {
    const categoryId = req.params.id;

    try {
        const query = `DELETE FROM "addCategory" WHERE "id" = $1 RETURNING *;`;
        const result = await pool.query(query, [categoryId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Crop Category not found" });
        }

        return res.status(200).json({
            message: "Crop Category deleted successfully",
            deletedCategory: result.rows[0],
        });

    } catch (error) {
        console.error("Error deleting crop category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.editCropCategory = async (req, res) => {
    const categoryId = req.params.id;
    const { name } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const checkQuery = `SELECT * FROM "addCategory" WHERE id = $1;`;
        const checkResult = await pool.query(checkQuery, [categoryId]);

        if (checkResult.rowCount === 0) {
            return res.status(404).json({ error: "Crop Category not found" });
        }

        const updateQuery = `
            UPDATE "addCategory"
            SET name = $1,
                logo = COALESCE($2, logo),
                "updatedAt" = NOW()
            WHERE id = $3
            RETURNING *;
        `;

        const values = [name, image, categoryId];
        const result = await pool.query(updateQuery, values);

        return res.status(200).json({
            message: "Crop Category updated successfully",
            updatedCategory: result.rows[0],
        });

    } catch (error) {
        console.error("Error editing crop category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

