import express from 'express'
import ReviewsModel from './model.js'

const Reviewsrouter = express.Router()

Reviewsrouter.post('/', (req, res) => {
  const { author, text, rating } = req.body

  ReviewsModel.create({
    author,
    text,
    rating
  })
    .then(review => res.status(201).send(review))
    .catch(error => res.status(400).send(error))
})

Reviewsrouter.get('/', (req, res) => {
  ReviewsModel.findAll()
    .then(reviews => res.status(200).send(reviews))
    .catch(error => res.status(400).send(error))
})

Reviewsrouter.delete('/:id', (req, res) => {
  const { id } = req.params

  ReviewsModel.destroy({
    where: {
      id
    }
  })
    .then(() => res.status(204).send())
    .catch(error => res.status(400).send(error))
})

export default Reviewsrouter
