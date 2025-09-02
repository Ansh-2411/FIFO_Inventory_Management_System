module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    customer_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    contact: DataTypes.STRING,
    address: DataTypes.TEXT,
    email: DataTypes.STRING

  }, {
    tableName: 'customers',
    timestamps: false
  });

  Customer.associate = models => {
    Customer.hasMany(models.Sale, { foreignKey: 'customer_id' });
    Customer.hasMany(models.Feedback, { foreignKey: 'customer_id' });
  };

  return Customer;
};
