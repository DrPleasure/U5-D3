import express from "express"
import createHttpError from "http-errors"
import { Op } from "sequelize"
import UsersModel from "./model.js"
import ProductsModel from "../products/model.js"
import ShoppingCartModel from"../cart/model.js"
import CartModel from "../cart/model.js"

const usersRouter = express.Router()

usersRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await UsersModel.create(req.body)
    res.status(201).send({ id })
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/", async (req, res, next) => {
  try {
  const query = {}
  if (req.query.firstName) query.firstName = { [Op.iLike]: `${req.query.firstName}%` }
  const skip = req.query.skip ? parseInt(req.query.skip) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 20;
  
 
  const users = await UsersModel.findAll({
    where: { ...query },
    attributes: ["firstName", "lastName", "id", "age", "country"],
    offset: skip,
    limit: limit,
  }) // (SELECT) pass an array for the include list
  res.send(users)
  } catch (error) {
  next(error)
  }
  })

usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.userId, {
      attributes: { exclude: ["createdAt", "updatedAt"] }, // (SELECT) pass an object with exclude property for the omit list
    })
    if (user) {
      res.send(user)
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

// Adding 1-to-N relationship

usersRouter.get("/:userId/products", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.userId, {
      include: {
        model: ProductsModel,
        attributes: ["name", "brand"],
        // where: { title: { [Op.iLike]: "%react%" } },
      },
    })
    res.send(user)
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await UsersModel.update(req.body, {
      where: { id: req.params.userId },
      returning: true,
    })
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0])
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await UsersModel.destroy({ where: { id: req.params.userId } })
    if (numberOfDeletedRows === 1) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})


// ShoppingCart Endpoints

// Add item to the cart
usersRouter.post("/:userId/cart", async (req, res) => {
  const userId = req.params.userId;
  const productId = req.body.productId;
  const quantity = req.body.quantity;

  try {
    const cart = await CartModel.create({
      productId,
      quantity,
      userId,
    });
    const user = await UsersModel.findByPk(userId);
    const product = await ProductsModel.findByPk(productId);

    user.cartId = cart.id;
    await user.save();

    product.CartModelId = cart.id;
    await product.save();

    return res.json({
      cart,
      product,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});


  
  // Update the quantity of items in the cart
  usersRouter.put("/:userId/cart/:productId", async (req, res, next) => {
  try {
  const item = await ShoppingCartModel.findByPk(req.params.productId)
  if (!item) {
  next(createHttpError(404, `Item with id ${req.params.productId} not found!`))
  } else {
  const { quantity } = req.body
  const [numberOfUpdatedRows, updatedRecords] = await ShoppingCartModel.update({ quantity }, {
  where: { id: req.params.productId },
  returning: true,
  })
  if (numberOfUpdatedRows === 1) {
  res.send(updatedRecords[0])
  } else {
  next(createHttpError(404, `Item with id ${req.params.productId} not found!`))
  }
  }
  } catch (error) {
  next(error)
  }
  })
  
  // Retrieve the cart information
  usersRouter.get("/:userId/cart", async (req, res, next) => {
  try {
  const items = await ShoppingCartModel.findAll({
  where: { userId: req.params.userId },
  include: [
  { model: ProductsModel, attributes: ["name", "brand", "price"] },
  ],
  })
  res.send(items)
  } catch (error) {
  next(error)
  }
  })

export default usersRouter