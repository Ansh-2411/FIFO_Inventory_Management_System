module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define('Supplier', {
    supplier_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    company_name: DataTypes.STRING,
    contact_person: DataTypes.STRING,
    contact_number: DataTypes.STRING,
    address: DataTypes.TEXT,
    email:DataTypes.STRING,
    total_orders:DataTypes.INTEGER
  }, {
    tableName: 'suppliers',
    timestamps: false
  });

  Supplier.associate = models => {
    Supplier.hasMany(models.Purchase, { foreignKey: 'supplier_id' });
  };

  return Supplier;
};
