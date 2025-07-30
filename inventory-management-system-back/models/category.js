module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    category_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
  }, {
    tableName: 'categories',
    timestamps: false,
  });
  return Category;
};
