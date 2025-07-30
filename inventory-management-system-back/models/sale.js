module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define('Sale', {
    sale_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    customer_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.DECIMAL, allowNull: false },
    selling_price: { type: DataTypes.DECIMAL, allowNull: false },
    sale_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'sales',
    timestamps: false,
  });

  Sale.associate = models => {
    Sale.belongsTo(models.Product, { foreignKey: 'product_id' });
    Sale.belongsTo(models.Customer, { foreignKey: 'customer_id' });
  };

  return Sale;
};
