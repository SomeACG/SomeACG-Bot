import path from 'path'
import fs from 'fs'
import axios from "~/utils/axios";
import getAccessToken from "../graph/auth";
import config from '~/config';

export async function uploadOneDrive(file_name: string): Promise<void> {
    let access_token = await getAccessToken()
    let file_path = path.resolve(config.TEMP_DIR, file_name)
    try {
        let uploadSession = await axios.post(`https://graph.microsoft.com/v1.0/me/drive/root:/SomeACG/${file_name}:/createUploadSession`,
            undefined, { headers: { "Authorization": `Bearer ${access_token}` } })
        let uploadUrl = uploadSession.data.uploadUrl as string
        if (!uploadUrl) {
            console.log("获取上传会话失败: ", uploadSession.data)
            throw new Error("获取上传会话失败")
        }

        let filestream = fs.createReadStream(file_path)
        let fileLength = fs.readFileSync(file_path).length

        let uploadRequest = await axios.put(uploadUrl, filestream, {
            headers: {
                "Content-Length": fileLength.toString(),
                "Content-Range": `bytes 0-${fileLength - 1}/${fileLength}`,
                "Authorization": `Bearer ${access_token}`
            },
            maxContentLength: 52428890,
            maxBodyLength: 52428890
        });
        if (uploadRequest.status === 200 || uploadRequest.status === 201) {
            console.log(file_name + " OneDrive上传成功")
        } else {
            console.log(file_name + " OneDrive上传失败: ", uploadRequest.data)
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}

export async function uploadOSS(file_name: string): Promise<void> {
    let file_path = path.resolve(config.TEMP_DIR, file_name)
    try {
        // let stream = fs.createReadStream(filePath)
        let file = fs.readFileSync(file_path)
        await axios.put(config.OSS_PUT_BASE_PATH + 'thumb/' + file_name, file, {
            headers: {
                'content-type': 'image/jpeg'
            }
        })
        console.log(file_name, ' OSS上传成功');
    }
    catch (err) {
        console.log(file_name, ' OSS上传失败');
        throw err
    }
}