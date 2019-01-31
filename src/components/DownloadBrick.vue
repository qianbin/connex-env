<template>
    <a class="brick" :href="asset.url">
        <img width="64" height="64" v-if="logo" :src="logo">
        <div>{{platformName}}</div>
    </a>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class DownloadBrick extends Vue {
    @Prop(Object)
    private asset!: Asset

    get logo() {
        switch (this.asset.platform) {
            case 'win32':
                return 'img/microsoft-windows.svg'
            case 'darwin':
                return 'img/macosx.svg'
            case 'linux':
                return 'img/linux-tux.svg'
        }
        return ''
    }
    get platformName() {
        switch (this.asset.platform) {
            case 'win32':
                return 'Windows'
            case 'darwin':
                return 'Mac OSX'
            case 'linux':
                return 'Linux'
        }
        return ''
    }
}
</script>
<style lang="scss" scoped>
.brick {
    display: inline-block;
    padding: 1.5rem 2.5rem;
    background-color: rgba(0, 0, 0, 0.05);
    text-align: center;
    color: currentColor;
    user-select: none;
    text-decoration: none;
}
</style>

