import { DataTypes } from "sequelize"
import sequelize from "../../db.js"


const UsersModel = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: DataTypes.UUIDV4,
    },
    totalAmount: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: true,
    },
   
  }
)



export default UsersModel
