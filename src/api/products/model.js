import { DataTypes } from "sequelize"
import sequelize from "../../db.js"
import UsersModel from "../users/model.js"
import CategoriesModel from "../categories/model.js"
import ProductsCategoriesModel from "./ProductsCategoriesModel.js"
import ReviewsModel from "../reviews/model.js"

const ProductsModel = sequelize.define(
  "product",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },  
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },  
  }
  /* {timestamps: false} TIMESTAMPS HERE ARE TRUE BY DEFAULT */
)

// Many to many relationship
ProductsModel.belongsToMany(CategoriesModel, {
  through: ProductsCategoriesModel
})
CategoriesModel.belongsToMany(ProductsModel, {
  through: ProductsCategoriesModel
})

ProductsModel.hasMany(ReviewsModel);
ReviewsModel.belongsTo(ProductsModel, { foreignKey: "productId", allowNull: false });




export default ProductsModel

