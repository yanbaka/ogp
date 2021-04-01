const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })) // postで渡せる容量を増やす
app.use(bodyParser.json()) // これがないとexpressのpostパラメーターが空になる
const { Storage } = require('@google-cloud/storage')
const storage = new Storage({
  projectId: 'create-ogp',
  keyFilename: process.env.SERVICE_ACCOUNT_KEY,
})
const bucketName = 'ogpimage'
const bucket = storage.bucket(bucketName)
let file

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

app.post('/upload', (req, res) => {
  const fileName = String(Math.round(Math.random() * 1000000)) // ファイル名。適当
  file = bucket.file(fileName)
  upload(req.body.imagebuffer).then(() => {
    res.status(200).send(fileName)
  })
})

async function upload(data) {
  try {
    const base64EncodedImageString = data.replace(
      /^data:image\/\w+;base64,/,
      ''
    )
    const imageBuffer = Buffer.from(base64EncodedImageString, 'base64')
    await file.save(imageBuffer, {
      metadata: { contentType: 'image/jpg' },
    })
  } catch (e) {
    throw e
  }
}

module.exports = {
  path: '/api',
  handler: app,
}
