module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    image_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    url: DataTypes.STRING,
  }, {
    tableName: 'images',
    timestamps: false,
  });

  Image.associate = models => {
    Image.belongsTo(models.Product, { foreignKey: 'product_id' });
  };

  return Image;
};
