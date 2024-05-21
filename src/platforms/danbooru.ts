import axios from '~/utils/axios';
import { ArtworkInfo } from '~/types/Artwork';

export default async function getArtworkInfo(
    post_url: string
): Promise<ArtworkInfo> {
    const { data: post } = await axios.get(`${post_url}.json`, {
        headers: {
            'user-agent': 'curl'
        }
    });

    const { data: artist } = await axios.get(
        `https://danbooru.donmai.us/artists.json?name=${post['tag_string_artist']}`,
        {
            headers: {
                'user-agent': 'curl'
            }
        }
    );

    return {
        source_type: 'danbooru',
        post_url: post_url,
        artist: {
            type: 'danbooru',
            name: post['tag_string_artist'],
            id: artist[0]['id']
        },
        raw_tags: post['tag_string'].split(' '),
        photos: [
            {
                url_thumb: post['large_file_url'],
                url_origin: post['file_url'],
                size: {
                    width: parseInt(post['image_width']),
                    height: parseInt(post['image_height'])
                }
            }
        ]
    };
}
