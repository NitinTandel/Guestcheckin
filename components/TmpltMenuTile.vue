<template>
  <div id="MenuTileComponent" @click="onExeClickTile($event)">
    <v-card class="mx-auto pa-1 ma-1" raised dark>
      <v-card-actions class="justify-center">
        <input
          type="image"
          :src="getImgUrl()"
          alt="menuImg"
          width="80"
          height="80"
          @click="onExeClickTile"
        >
      </v-card-actions>
      <v-card-title primary-title class="justify-center">
        {{ menuTitle.substring(0, 14) }}
      </v-card-title>
      <v-card-text class="justify-center">
        {{ menuDetail.substring(0, 30) }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'MenuTile',
  props: {
    menuId: {
      type: String,
      default: '0',
      required: true
    },
    menuLevel: {
      type: Number,
      default: 0,
      required: true
    },
    menuTitle: {
      type: String,
      default: 'Menu Title',
      required: true
    },
    menuDetail: {
      type: String,
      default: 'Menu Description',
      required: true
    },
    imgFile: {
      type: String,
      default: 'logo.png',
      required: true
    },
    navTo: {
      type: String,
      default: '/',
      required: true
    }
  /*
  navType: {
      type: String,
      default: 'PAGE',
      required: true
    },
  nClickTile: {
      type: Function,
      required: true
    }
 */
  },
  methods: {
    onExeClickTile (event) {
      const menuData = {
        Id: this.menuId,
        Level: this.menuLevel,
        Title: this.menuTitle,
        Detail: this.menuDetail,
        imgFile: this.imgFile,
        //        navType: this.navType,
        navTo: this.navTo
      }
      this.$emit('onClickTile', menuData)
    },

    getImgUrl () {
      let RtnimgPath = ' '
      if (process.env.NODE_ENV === 'development') {
        RtnimgPath = '/img/' + this.imgFile
      } else {
        RtnimgPath = '/img/' + this.imgFile
      }
      RtnimgPath = '/img/' + this.imgFile
      return RtnimgPath
    }
  }
}
</script>

<style scoped>
    #MenuTileComponent {
        width: 250px;
        height: 220px;
        cursor: pointer;
        justify-content: center;
    }

</style>
