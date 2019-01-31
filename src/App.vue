<template>
    <transition-group id="app" tag="div" name="content">
        <div key="tip">Your browser is missing Connex to run VeChain App</div>
        <div key="app-link" class="app-link">
            <b
                class="text-truncate"
                style="flex:1 1 auto;margin:0rem 1rem;text-align:center;"
            >{{targetHref}}</b>
            <a class="btn open-btn" style="flex:0 0 auto" @click="openInSync">
                <b>Open with Sync</b>
            </a>
        </div>
        <div
            v-if="!showDownloads"
            key="download-switch"
            @click="showDownloads=true"
            style="cursor:pointer;color:#3573c7;margin-top:1rem;margin-bottom:5rem;"
        >Downloads</div>
        <div v-else key="downloads" style="text-align:center;margin:1rem;">
            <div>Seems VeChain Sync is not installed</div>
            <div v-if="matchedAsset">
                <a class="btn download-btn" :href="matchedAsset.url">Download</a>
                <div style="margin-top:1rem;">
                    <img width="48" height="48" src="./assets/sync-logo.png">
                </div>
                <div style="font-size: 0.9rem;">Sync v{{matchedAsset.version}}</div>
            </div>
            <div style="margin-top:1rem;opacity:0.6;">All supported platforms</div>
            <div>
                <DownloadBrick
                    class="btn"
                    v-for="(item,i) in assets"
                    :key="i"
                    :asset="item"
                    style="border-radius:0px;margin:1rem;"
                />
            </div>
        </div>
        <!-- cache images -->
        <div key="cache" v-show="false">
            <DownloadBrick v-for="(item,i) in assets" :key="i" :asset="item"/>
            <img width="48" height="48" src="./assets/sync-logo.png">
        </div>
    </transition-group>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DownloadBrick from './components/DownloadBrick.vue'
import { targetHref, networkName, platform } from '@/utils'
// tslint:disable-next-line:no-var-requires
const customProtocolDetection = require('custom-protocol-detection')

@Component({
    components: {
        DownloadBrick
    },
})
export default class App extends Vue {
    private connex = window.connex || null
    private targetHref = targetHref
    private platform = platform

    private assets = (require('./sync-release') as Asset[]).sort((a, b) => {
        const order = ['win32', 'darwin', 'linux']
        return order.indexOf(a.platform) - order.indexOf(b.platform)
    })

    private showDownloads = false

    get matchedAsset() {
        return this.assets.find(a => a.platform === this.platform) || null
    }

    get network() { return networkName(window.connex.thor.genesis.id) }

    private openInSync() {
        const vechainAppUrl = 'vechain-app:///' + this.targetHref
        customProtocolDetection(vechainAppUrl,
            () => this.showDownloads = true,
            // tslint:disable-next-line:no-console
            () => console.log('opened with sync'),
            () => this.showDownloads = true)
    }
    private download(url: string) {
        window.open(url, '_blank')
    }
}
</script>

<style lang="scss">
#app {
    color: #2c3e50;
    display: flex;
    min-height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 2rem;
}

.btn {
    position: relative;
    text-decoration: none;
    border-radius: 3px;
    cursor: pointer;
    padding: 0.3rem 0.8rem;
    user-select: none;
    vertical-align: middle;
    white-space: nowrap;
    outline: none;
}

.btn::before {
    content: "";
    background-color: currentColor;
    position: absolute;
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    opacity: 0;
    transition: all 0.2s;
    border-radius: inherit;
}
.btn:hover::before {
    opacity: 0.12;
}

.open-btn {
    background-color: #3573c7;
    color: white;
}

.download-btn {
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 0.9rem;
    margin: 0.5rem;
    padding-left: 2rem;
    padding-right: 2rem;
}

.app-link {
    display: inline-flex;
    align-items: center;
    background-color: #f0f0f0;
    padding: 0.15rem 0.15rem;
    border-radius: 3px;
    max-width: 70%;
    min-width: 40%;
    margin: 0.5rem 0rem;
    box-shadow: 0px 0px 5px 0.5px rgba(0, 0, 0, 0.05) inset;
}

.content-enter-active {
    transition: all 0.4s;
}
.content-leave-active {
    display: none;
}

.content-enter,
.content-leave-to {
    transform: translateY(50%);
    opacity: 0;
}

.content-move {
    transition: all 0.3s;
}
</style>
