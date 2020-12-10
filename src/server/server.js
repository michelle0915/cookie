import express from 'express'
import Path from 'path'
import rootpath from 'app-root-path'
import fs from 'fs'
import config from 'config'

import chokidar from 'chokidar'
import axios from 'axios'
import {logger} from './logger'
import imageConverter from './imageConverter'
import db from './db'

const app = express()
const serverConfig = config.get('server')
const pathConfig = config.get('path')
const URL = config.get('url')

app.use(express.static(Path.join('./', 'dist')))
app.use(express.static(Path.join('./', 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routing
app.get('/list/all', (req, res) => {
  db.find((results) => {
    res.send(results)
  })
})

app.get('/list/update', (req, res) => {
  db.find((results) => {
    res.send(results)
  }, req.lastUpdateTime)
})

app.get('/test', (req, res) => {
  db.find((results) => {
    res.send(results)
  })
})

app.get('*', (req, res) => {
  res.sendFile(Path.join(__dirname, '../dist', 'index.html'))
})

app.listen(serverConfig.port, () => {
  logger.info(`server starting -> [port] ${serverConfig.port} [env] ${process.env.NODE_ENV}`)
})


// automatically process captured image
const watcher = chokidar.watch('./capture', { ignoreInitial: true, persistent: true, depth: 0 })
watcher
  .on('ready', () => { logger.info('watcher starting')})
  .on('add', async (img_path) => {
    logger.info('capture: '+img_path)

    // convert and save captured image
    // create query csv
    const csv_path = Path.join(pathConfig.query, `${Date.now()}.csv`)
    await Promise.all([imageConverter.convert(img_path), createQueryCsv(csv_path, img_path)])

    // NeoPulse Query
    const resQuery = await axios.post(
      URL.query,
      { "model_id": '', "model_iter": '', "csv": csv_path }
    )
    const queryId = resQuery.query_id

    // save DB
    db.insert(queryId, Path.join('images', Path.basename(img_path)))

    // Polling NeoPulse Results
    do {
      const resResults = await axios.post(
        URL.results,
        { "query_id": resQuery.query_id, }
      )
    } while (resResults.status == 'QUERYING' || resResults.status == 'WAITING_TO_QUERY')

    // NeoPulse Results
    if (resResults.status == 'QUERY_COMPLETED') {
      const resResults = await axios.post(
        URL.results,
        { "query_id": resQuery.query_id, "show": true }
      )

      // update DB
      db.update(queryId, resResults.results)
    } else {
      logger.error(`failed to query`)
    }
  })

const createQueryCsv = async (csv_path, img_path) => {
  try {
    fs.writeFileSync(csv_path, `Image\n${Path.basename(img_path)}`)
  } catch (e) {
    logger.error(`failed to save csv file: ${e}`)
  }
}
