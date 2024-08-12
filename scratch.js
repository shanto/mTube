var search = require("youtube-search")
var q = [
    'jamuna tv', 'independent tv', 'ekhon tv',
    'akhoni tv', 'dbc news', 'channel 24',
    'somoy tv', 'ekattor tv', 'bbc news', 'live tv bd'
].join(' | '),
    b = {
        channels: ['UC2P5Fd5g41Gtdqf0Uzh8Qaw', 'UC8NcXMG3A3f2aFQyGTpSNww', 'UC9CYT9gSNLevX5ey2_6CK0Q', 'UCHCR4UFsGwd_VcDa0-a4haw', 'UCdF5Q5QVbYstYrTfpgUl0ZA', 'UC_gUM8rL-Lrg6O3adPW9K1g', 'UCZFMm1mMw0F81Z37aaEzTUA', 'UC7HQ3mzdsyvLU0Y7a2t3N7A', 'UCNvCQpcafnbW4KQ8X7oQ9kg', 'UCr0o9kqCDU_a3JXQUsx38ww', 'UCbf0XHULBkTfv2hBjaaDw9Q', 'UCmiLAkkE7r5Jr92f3XHobrQ', 'UCb2BmRoAtic66vMUodJn7aQ', 'UCSOO8aliEwUKxIVkk5Igz']
    }
var o = {
    maxResults: 50,
    key: process.env.YT_KEY,
    type: "video", eventType: "live"
}

console.log("q: " + q)

const sources = search(q, o, (e, r) => {
    var src = []
    if (!r || !r.length) {
        console.dir("e: " + e)
        return
    }
    r.filter((a) => {
        if (b.channels.indexOf(a.channelId) != -1)
            return false
        return true
    }).forEach((v, i) => {
        src.push("https://www.youtube.com/embed/" + v.id)
        console.log("push=" + v.id)
    })
    return src
})

console.dir(sources)

module.exports = sources