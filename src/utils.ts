export const targetHref = (() => {
    if (window.location.search) {
        return window.location.search.slice(1) + window.location.hash
    }
    if (document.referrer) {
        try {
            if (window.location.host !== new URL(document.referrer).host) {
                return document.referrer
            }
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.warn(err)
        }
    }
    return ''
})()

export function networkName(genesisId: string) {
    switch (genesisId) {
        case '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127':
            return 'TestNet'
        case '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a':
            return 'MainNet'
        case '0x00000000973ceb7f343a58b08f0693d6701a5fd354ff73d7058af3fba222aea4':
            return 'Solo Mode'
        default:
            return 'Unknown Network'
    }
}


import UAParser from 'ua-parser-js'

const ua = new UAParser(navigator.userAgent, {
    browser: [[/(sync)\/([\w\.]+)/i], [UAParser.BROWSER.NAME, UAParser.BROWSER.VERSION]]
})

export const platform = ((): NodeJS.Platform | undefined => {
    switch (ua.getOS().name) {
        case 'Mac OS':
            return 'darwin'
        case 'Windows':
            return 'win32'
        case 'Linux':
        case 'Ubuntu':
        case 'RedHat':
        case 'CentOS':
        case 'Fedora':
        case 'Mint':
        case 'SUSE':
        case 'VectorLinux':
            return 'linux'
    }
})()

export const browser = ua.getBrowser()

