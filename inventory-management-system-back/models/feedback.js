module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    feedback_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rating: DataTypes.INTEGER,
    customer_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    feedback: DataTypes.TEXT,
    feedback_datetime: DataTypes.DATE
  }, {
    tableName: 'feedbacks',
    timestamps: false
  });

  Feedback.associate = models => {
    Feedback.belongsTo(models.Customer, { foreignKey: 'customer_id' });
    Feedback.belongsTo(models.Product, { foreignKey: 'product_id' });
  };

  return Feedback;
};
