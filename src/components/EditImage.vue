<template>
  <div>
    <div class="sceneEdit">
      <div class="image">
        <canvas class="canvas"></canvas>
      </div>
      <input type="file" accept=".jpg, .jpeg, .png" @change="previewImage" />
      <button :disabled="scene !== 'selected'" @click="upload">
        画像編集完了
      </button>
      <button @click="hello">hello world</button>
      <a
        class="shareButton"
        v-if="scene === 'share'"
        :href="shareLink"
        target="_blank"
        >シェア</a
      >
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  useContext,
} from '@nuxtjs/composition-api'
let PIXI: any
if (process.client) {
  PIXI = require('pixi.js')
}

export default defineComponent({
  setup() {
    const { app } = useContext()
    const shareText = `pikachu collection
ピカチュウコレクション

#hash`

    const reactiveState = reactive({
      isFile: false,
      scene: 'edit',
      app: null,
      layerContainer: null,
      shareLink: '',
    })

    onMounted(() => {
      // pixijs
      const canvas = document.querySelector('canvas')
      // @ts-ignore
      reactiveState.app = new PIXI.Application({
        width: 600,
        height: 600,
        backgroundColor: 0xffffff,
        view: canvas!,
        preserveDrawingBuffer: true,
        autoDensity: true,
      })
      // @ts-ignore
      reactiveState.layerContainer = new PIXI.Container()
      let frame = methods.frame()
      // @ts-ignore
      reactiveState.app.stage.addChild(reactiveState.layerContainer, frame)
    })

    const methods = {
      frame() {
        let g = new PIXI.Graphics()
        g.lineStyle(20, 0xcf1019)
          .moveTo(0, 0)
          .lineTo(0, 600)
          .lineTo(600, 600)
          .lineTo(600, 0)
          .lineTo(0, 0)
        return g
      },
      previewImage(e: any) {
        const fileReader = new FileReader()
        fileReader.onload = () => {
          const image = new Image()
          // @ts-ignore
          image.src = fileReader.result
          image.onload = () => {
            // @ts-ignore
            let sprite = PIXI.Sprite.from(fileReader.result)
            let transformScale = 1
            if (image.width > image.height) {
              transformScale = 600 / image.height
            } else {
              transformScale = 600 / image.width
            }
            sprite.scale.x = sprite.scale.y = transformScale
            // sprite.x = (600 - sprite.width) / 2;
            // sprite.y = (600 - sprite.height) / 2;
            // @ts-ignore
            reactiveState.layerContainer.addChild(sprite)
          }
          reactiveState.isFile = true
          reactiveState.scene = 'selected'
        }
        const files = e.target.files
        fileReader.readAsDataURL(files[0])
      },
      async upload() {
        let params = new URLSearchParams()
        params.append('imagebuffer', methods.tobase64())
        app.$axios
          .post(`${process.env.BASE_URL}/api/upload`, params)
          .then((response) => {
            reactiveState.scene = 'share'
            reactiveState.shareLink = `http://twitter.com/intent/tweet?url=${process.env.BASE_URL}/share?id=${response.data}`
            console.log(response)
          })
          .catch((error) => {
            console.log(error)
          })
      },
      tobase64() {
        // @ts-ignore
        const dataurl = reactiveState.app.renderer.extract.base64() // toDataURL()だと上下反転してしまう
        return dataurl
      },
      filesize() {
        const type = 'image/png'
        // @ts-ignore
        const dataurl = reactiveState.app.renderer.extract.base64() // toDataURL()だと上下反転してしまう
        const bin = atob(dataurl.split(',')[1])
        const buffer = new Uint8Array(bin.length)
        for (let i = 0; i < bin.length; i++) {
          buffer[i] = bin.charCodeAt(i)
        }
        const blob = new Blob([buffer.buffer], { type: type })
        const shareImg = new File([blob], 'share.png', {
          type: 'image/png',
        })
        console.log(shareImg)
      },
      hello() {
        app.$axios
          .get(`http://localhost:5000/create-ogp-ee39e/us-central1/helloWorld`)
          // .get(
          //   'https://us-central1-create-ogp-ee39e.cloudfunctions.net/helloWorld'
          // )
          .then((res) => {
            console.log(res.data)
          })
      },
    }

    return {
      ...methods,
      ...toRefs(reactiveState),
    }
  },
})
</script>

<style scoped>
.image {
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
}

.imageSrc {
  max-width: 300px;
}

.canvas {
  max-width: 300px;
  max-height: 300px;
}

button,
.share {
  margin: 20px auto 0;
}

button,
a {
  display: block;
}

.shareButton {
  margin-top: 20px;
}
</style>
