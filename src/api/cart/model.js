import { DataTypes } from "sequelize";
import sequelize from "../../db.js";
import ProductsModel from "../products/model.js";
import UsersModel from "../users/model.js";

const CartModel = sequelize.define("CartModel", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
});


CartModel.belongsTo(UsersModel);
UsersModel.hasMany(CartModel);

CartModel.hasMany(ProductsModel);
ProductsModel.hasMany(CartModel);

export default CartModel;
