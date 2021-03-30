import * as functions from 'firebase-functions'
import * as corsLib from 'cors'
// @ts-ignore
const cors = corsLib({ origin: true, credentials: true })

export const helloWorld = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    functions.logger.info('Hello logs!', { structuredData: true })
    response.send('Hello from Firebase!')
  })
})
