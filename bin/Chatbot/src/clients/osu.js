import BanchoClient from "bancho.js";

import fetch from "node-fetch";

export default class OsuClient {
    constructor() {
        this.osuAuthId = process.env.OSU_OAUTH_ID;
        this.osuAuthSecret = process.env.OSU_OAUTH_SECRET;
        this.client = new BanchoClient.BanchoClient({
            username: process.env.OSU_IRC_USERNAME,
            password: process.env.OSU_IRC_PASSWORD
        })
    }

    async initClient() {
        this.client.connect().then(() => {
            console.log("osu! IRC connected!")
        }).catch(console.error);
        this.osuApiAuthenticate().then(() => {
            console.log("osu! API v2 connected!")
        }).catch(console.error);
    };

    async sendRequestToUser(beatmapId, beatmapUrl, requester) {
        const beatmapJson = await this.returnBeatmapJson(beatmapId);
        const requestMessage = `${requester} > [${beatmapUrl} ${beatmapJson.beatmapset.artist} - ${beatmapJson.beatmapset.title} [${beatmapJson.version}]] by ${beatmapJson.beatmapset.creator} (BPM${beatmapJson.bpm} SR${beatmapJson.difficulty_rating} AR${beatmapJson.ar} CS${beatmapJson.cs} OD${beatmapJson.accuracy})`
        this.client.getUser("Karthy").sendMessage(requestMessage)
    }

    async osuApiAuthenticate() {
        fetch("https://osu.ppy.sh/oauth/token", {
            method: 'post',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "grant_type": "client_credentials",
                "client_id": this.osuAuthId,
                "client_secret": this.osuAuthSecret,
                "scope": "public"
            })
        })
        .then(response => response.json())
        .then(data => {
            this.osuApiToken = data;
        })
        .catch(console.error);
    }

    async returnBeatmapJson(beatmapId) {
        const url = new URL("https://osu.ppy.sh/api/v2/beatmaps/lookup");

        let params = {
            "id": beatmapId,
        };
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer "+this.osuApiToken.access_token
        }

        const result = await fetch(url, {
            method: "GET",
            headers: headers,
        })
        .then(response => response.json())
        .then(json => {return json});
        return result;
    }

    async getDiscordBeatmapEmbed(beatmapId) {
        const beatmapJson = await this.returnBeatmapJson(beatmapId);
        return {
            color: 0x0099ff,
            url: beatmapJson.url,
            title: `${beatmapJson.beatmapset.artist} - ${beatmapJson.beatmapset.title} (mapped by ${beatmapJson.beatmapset.creator})`,
            description: "Your request has been sent!",
            thumbnail: {
                url: beatmapJson.beatmapset.covers.list,
            },
            fields: [
                {
                    name: 'Approach Rate',
                    value: beatmapJson.ar,
                    inline: true
                },
                {
                    name: 'Circle Size',
                    value: beatmapJson.cs,
                    inline: true
                },
                {
                    name: 'Overall Difficulty',
                    value: beatmapJson.accuracy,
                    inline: true
                },
                {
                    name: 'Star Rating',
                    value: beatmapJson.difficulty_rating,
                    inline: true
                },
                {
                    name: 'BPM',
                    value: beatmapJson.bpm,
                    inline: true
                },
            ]
        }
    }
}