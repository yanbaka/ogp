import * as functions from 'firebase-functions'

const cors = require('cors')
import express from 'express'
const app: express.Express = express()
const bodyParser = require('body-parser')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json()) // これがないとexpressのpostパラメーターが空になる
const { Storage } = require('@google-cloud/storage')
const storage = new Storage({
  projectId: 'pikachu-test',
  keyFilename: process.env.SERVICE_ACCOUNT_KEY,
})
const bucketName = 'ogpimage'
const bucket = storage.bucket(bucketName)
let file: any

app.post('/upload', (req: express.Request, res: express.Response) => {
  const fileName = String(Math.round(Math.random() * 1000000)) // ファイル名。適当
  file = bucket.file(fileName)
  upload(req.body.imagebuffer).then(() => {
    res.status(200).send(fileName)
  })
})

/**
 * 画像アップロード
 * @param {string} data
 */
async function upload(data: string) {
  const base64EncodedImageString = data.replace(/^data:image\/\w+;base64,/, '')
  const imageBuffer = Buffer.from(base64EncodedImageString, 'base64')
  await file.save(imageBuffer, {
    metadata: { contentType: 'image/jpg' },
  })
}

app.get('/ogp', async (req, res, next) => {
  try {
    const [url] = await bucket.file(req.query.id).getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60 * 24,
    })
    res.status(200).send(url)
  } catch (error) {
    next(error)
  }
})

app.get('/hello', (request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true })
  response.send('Hello from Firebase!')
})

const api = functions.https.onRequest(app)
module.exports = { api }
