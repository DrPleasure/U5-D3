import express from "express"
import createHttpError from "http-errors"
import { Op } from "sequelize"
import ProductsModel from "./model.js"
import UsersModel from "../users/model.js"
import CategoriesModel from "../categories/model.js"
import ProductsCategoriesModel from "./ProductsCategoriesModel.js"

const productsRouter = express.Router()

productsRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ProductsModel.create(req.body)
    if (req.body.categoryId) {
      await ProductsCategoriesModel.create({
        categoryId: req.body.categoryId,
        productId: id,
      })
    }
    res.status(201).send({ id })
  } catch (error) {
    next(error)
  }
})


productsRouter.post("/:productId/:categoryId", async (req, res, next) => {
try {
  await ProductsCategoriesModel.create(
    {categoryId: req.params.categoryId,
    productId: req.params.productId}
  )
  res.status(201).send()
     } catch (error) {
    next(error)
  }
})

productsRouter.get("/", async (req, res, next) => {
  try {
    const query = {}
    if (req.query.name) query.name = { [Op.iLike]: `${req.query.name}%` }
    if (req.query.brand) query.brand = { [Op.iLike]: `${req.query.brand}%` }
    if (req.query.priceMin && req.query.priceMax)
      query.price = { [Op.between]: [req.query.priceMin, req.query.priceMax] }
    const products = await ProductsModel.findAll({
     
      where: { ...query },
      attributes: ["id", "name", "brand", "price", "image"],

      include: [
        { model: UsersModel, attributes: ["firstName", "lastName"] },  
        { model:CategoriesModel, attributes: ["name"], through: {attributes: []} },
      ],
    })
    res.send(products)
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByPk(req.params.productId)
    if (product) {
      res.send(product)
    } else {
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ProductsModel.update(req.body, {
      where: { id: req.params.productId },
      returning: true,
    })
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0])
    } else {
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ProductsModel.destroy({ where: { id: req.params.productId } })
    if (numberOfDeletedRows === 1) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
    }
    })

// MANY TO MANY RELATIONSHIP

    ProductsModel.belongsToMany(CategoriesModel, {
      through: ProductsCategoriesModel,
      foreignKey: { name: "productId", allowNull: false },
    })
    CategoriesModel.belongsToMany(ProductsModel, {
      through: ProductsCategoriesModel,
      foreignKey: { name: "categoryId", allowNull: false },
    })
    
    export default productsRouter
