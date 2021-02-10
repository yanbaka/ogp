<template>
  <div>
    <h1>画面プロトタイプ</h1>
    <hr />
    <div class="sceneEdit">
      <h2>編集画面</h2>
      <div class="image">
        <canvas class="canvas"> </canvas>
      </div>
      <input type="file" accept="*" @change="previewImage" />
      <button :disabled="scene !== 'selected'" @click="share">シェア</button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
} from '@nuxtjs/composition-api';
import * as PIXI from 'pixi.js';
import axios from 'axios';

export default defineComponent({
  setup() {
    const shareText = `pikachu collection
ピカチュウコレクション

#hash`;

    const reactiveState = reactive({
      isFile: false,
      scene: 'edit',
      shareImage: '',
      app: null,
      layerContainer: null,
    });

    onMounted(() => {
      // pixijs
      const canvas = document.querySelector('canvas');
      // @ts-ignore
      reactiveState.app = new PIXI.Application({
        width: 600,
        height: 600,
        backgroundColor: 0xffffff,
        view: canvas!,
        preserveDrawingBuffer: true,
        autoDensity: true,
      });
      // @ts-ignore
      reactiveState.layerContainer = new PIXI.Container();
      let frame = methods.frame();
      // @ts-ignore
      reactiveState.app.stage.addChild(reactiveState.layerContainer, frame);
    });

    const methods = {
      frame() {
        let g = new PIXI.Graphics();
        g.lineStyle(20, 0xcf1019)
          .moveTo(0, 0)
          .lineTo(0, 600)
          .lineTo(600, 600)
          .lineTo(600, 0)
          .lineTo(0, 0);
        return g;
      },
      previewImage(e: any) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const image = new Image();
          // @ts-ignore
          image.src = fileReader.result;
          image.onload = () => {
            // @ts-ignore
            let sprite = PIXI.Sprite.from(fileReader.result);
            let transformScale = 1;
            if (image.width > image.height) {
              transformScale = 600 / image.height;
            } else {
              transformScale = 600 / image.width;
            }
            sprite.scale.x = sprite.scale.y = transformScale;
            // sprite.x = (600 - sprite.width) / 2;
            // sprite.y = (600 - sprite.height) / 2;
            // @ts-ignore
            reactiveState.layerContainer.addChild(sprite);
          };
          reactiveState.isFile = true;
          reactiveState.scene = 'selected';
        };
        const files = e.target.files;
        fileReader.readAsDataURL(files[0]);
      },
      async share() {
        // @ts-ignore
        reactiveState.shareImage = reactiveState.app.renderer.extract.base64();
        let params = new URLSearchParams();
        params.append('imagebuffer', methods.tobase64());
        axios
          .post('http://localhost:3000/api/upload', params)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      },
      tobase64() {
        // @ts-ignore
        const dataurl = reactiveState.app.renderer.extract.base64(); // toDataURL()だと上下反転してしまう
        return dataurl;
      },
      filesize() {
        const type = 'image/png';
        // @ts-ignore
        const dataurl = reactiveState.app.renderer.extract.base64(); // toDataURL()だと上下反転してしまう
        const bin = atob(dataurl.split(',')[1]);
        const buffer = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
          buffer[i] = bin.charCodeAt(i);
        }
        const blob = new Blob([buffer.buffer], { type: type });
        const shareImg = new File([blob], 'share.png', {
          type: 'image/png',
        });
        console.log(shareImg);
      },
    };

    return {
      ...methods,
      ...toRefs(reactiveState),
    };
  },
});
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
</style>
