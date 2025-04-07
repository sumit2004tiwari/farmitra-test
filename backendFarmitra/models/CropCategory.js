module.exports = (sequelize, DataTypes) => {
    const CropCategory = sequelize.define("CropCategory", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Ensures category names are unique
        },
        logo: {
            type: DataTypes.STRING, // Storing image path
            allowNull: true,
        },
    }, {
        timestamps: true,
    });

    return CropCategory;
};
