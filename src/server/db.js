const mongoose = require('mongoose')
const Schema = mongoose.Schema
import {logger} from './logger'

const RecordSchema = new Schema({
  query_id: String,
  path: String,
  result: Array,
  update_time: Number,
})

mongoose.connect('mongodb://localhost/cookie')
const Record = mongoose.model('Record', RecordSchema)

const insert = (queryId, path) => {
  let obj = new Record({
    query_id: queryId,
    path: path,
    result: null,
    update_time: Date.now()
  })

  obj.save((err) => { if (err) logger.error(`failed to save on DB: ${err}`) })
}

const update = (queryId, result) => {
  Record.update(
    { query_id: queryId },
    { $set: { result: result, update_time: Date.now() }},
    (err) => { if (err) logger.error(`failed to save on DB: ${err}`)}
  )
}

const find = (callback, utime) => {
  Record.find(
    (() => {
      if (utime) return { update_time: { $gt: utime } }
      else return {}
    })(),
    (err, records) => {
      if (err) {
        logger.error(`failed to save on DB: ${err}`)
        return
      }
      callback(records)
    }
  )
}

module.exports = {
  insert: insert,
  update: update,
  find: find
}
