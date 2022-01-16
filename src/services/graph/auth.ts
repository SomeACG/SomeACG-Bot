import axios from "~/utils/axios";
import config from "~/config";

const AUTH_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token"

export default async function getAccessToken(): Promise<string> {
    let body = new URLSearchParams()
    body.append("client_id", config.CLIENT_ID)
    body.append("client_secret", config.CLIENT_SECRET)
    body.append("refresh_token", config.REFRESH_TOKEN)
    body.append("redirect_uri", "http://localhost")
    body.append("grant_type", "refresh_token")

    try {

        let response = await axios.post(AUTH_URL, body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        if (response.data.access_token) {
            return response.data.access_token
        }

        throw new Error("获取 access_token 失败")
    }
    catch (err)
    {
        console.log("获取AccessToken失败:", err)
        throw err
    }
}