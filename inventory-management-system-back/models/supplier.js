module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define('Supplier', {
    supplier_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    contact: DataTypes.STRING,
    address: DataTypes.TEXT
  }, {
    tableName: 'suppliers',
    timestamps: false
  });

  Supplier.associate = models => {
    Supplier.hasMany(models.Purchase, { foreignKey: 'supplier_id' });
  };

  return Supplier;
};
