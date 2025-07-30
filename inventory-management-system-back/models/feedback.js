module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    feedback_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rating: DataTypes.INTEGER,
    customer_id: { type: DataTypes.INTEGER, allowNull: false },
    feedback: DataTypes.TEXT
  }, {
    tableName: 'feedbacks',
    timestamps: false
  });

  Feedback.associate = models => {
    Feedback.belongsTo(models.Customer, { foreignKey: 'customer_id' });
  };

  return Feedback;
};
