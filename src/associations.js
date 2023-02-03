import CartModel from "./api/cart/model.js";
import UsersModel from "./api/users/model.js";
import ProductsModel from "./api/products/model.js";

CartModel.hasMany(ProductsModel, { foreignKey: { allowNull: true } });
ProductsModel.belongsTo(CartModel);

UsersModel.hasMany(CartModel, { foreignKey: { allowNull: true } });
CartModel.belongsTo(UsersModel);