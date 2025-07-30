module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define('Purchase', {
    purchase_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    supplier_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.DECIMAL, allowNull: false },
    quantity_remaining: { type: DataTypes.DECIMAL, allowNull: false },
    cost_price: { type: DataTypes.DECIMAL, allowNull: false },
    purchase_date: { type: DataTypes.DATE, allowNull: false },
    batch_no: { type: DataTypes.STRING, allowNull: false }
  }, {
    tableName: 'purchases',
    timestamps: false,
  });

  Purchase.associate = models => {
    Purchase.belongsTo(models.Product, { foreignKey: 'product_id' });
    Purchase.belongsTo(models.Supplier, { foreignKey: 'supplier_id' });
  };

  return Purchase;
};
