module.exports = (sequelize, DataTypes) => {
  const StockLedger = sequelize.define('StockLedger', {
    ledger_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sale_id: { type: DataTypes.INTEGER, allowNull: false },
    purchase_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.DECIMAL, allowNull: false }
  }, {
    tableName: 'stock_ledger',
    timestamps: false,
  });

  StockLedger.associate = models => {
    StockLedger.belongsTo(models.Sale, { foreignKey: 'sale_id' });
    StockLedger.belongsTo(models.Purchase, { foreignKey: 'purchase_id' });
  };

  return StockLedger;
};
