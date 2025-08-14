module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    feedback_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rating: DataTypes.INTEGER,
    customer_name: { type: DataTypes.STRING, allowNull: false },
    product_name: { type: DataTypes.STRING, allowNull: false },
    feedback: DataTypes.TEXT
  }, {
    tableName: 'feedbacks',
    timestamps: false
  });

  return Feedback;
};
