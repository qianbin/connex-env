#!/usr/bin/env node

import _https from 'https'
// tslint:disable-next-line:no-var-requires
const https = require('follow-redirects').https as typeof _https
import { writeFileSync } from 'fs'
import * as Path from 'path'
import * as URL from 'url'
import JSYaml from 'js-yaml'

function getPlatform(ymlUrl: string): NodeJS.Platform {
    if (ymlUrl.endsWith('-linux.yml')) {
        return 'linux'
    }
    if (ymlUrl.endsWith('-mac.yml')) {
        return 'darwin'
    }
    return 'win32'
}

async function fetchLatest() {
    const assets: Asset[] = []
    const data = await httpGet('https://api.github.com/repos/vechain/thor-sync.electron/releases/latest')
    console.log(data)
    const items = JSON.parse(data).assets as any[]
    for (const item of items) {
        if (item.browser_download_url.endsWith('.yml')) {
            const yml = JSYaml.safeLoad(await httpGet(item.browser_download_url))
            const file = (yml.files as any[]).find(f => f.size)
            if (file) {
                assets.push({
                    url: URL.resolve(item.browser_download_url, file.url),
                    size: file.size,
                    version: yml.version,
                    sha512: file.sha512,
                    releaseDate: yml.releaseDate,
                    platform: getPlatform(item.browser_download_url)
                })
            }
        }
    }
    return assets
}

function httpGet(url: string) {
    return new Promise<string>((resolve, reject) => {
        https.get(url,
            { headers: { 'User-Agent': 'Mozilla/5.0' } },
            res => {
                const chunks: Buffer[] = []
                res.on('data', chunk => {
                    chunks.push(chunk)
                })
                res.on('end', () => {
                    resolve(Buffer.concat(chunks).toString('utf8'))
                })
            }).on('error', err => {
                reject(err)
            })
    })
}

fetchLatest().then(assets => {
    writeFileSync(Path.resolve(__dirname, 'sync-release.json'), JSON.stringify(assets), 'utf8')
}).catch(err => {
    // tslint:disable-next-line:no-console
    console.error(err)
    process.exit(1)
})

