import { DataTypes } from "sequelize"
import sequelize from "../../db.js"

const UsersModel = sequelize.define(
  "user",
  {
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
  }
  /* {timestamps: false} TIMESTAMPS HERE ARE TRUE BY DEFAULT */
)

export default UsersModel
