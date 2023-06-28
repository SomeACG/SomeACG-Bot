import Mongoose from '~/database';
import { Artwork, ArtworkSource, ImageSize, ArtworkTag } from '~/types/Artwork';

const artworkSchema = new Mongoose.Schema<Artwork>({
    index: Number,
    quality: Boolean,
    title: String,
    desc: String,
    file_name: String,
    img_thumb: String,
    size: new Mongoose.Schema<ImageSize>({
        width: Number,
        height: Number
    }),
    tags: [
        new Mongoose.Schema<ArtworkTag>({
            _id: String,
            name: String
        })
    ],
    source: new Mongoose.Schema<ArtworkSource>({
        type: String,
        post_url: String,
        picture_index: Number
    }),
    create_time: {
        type: Date,
        default: new Date()
    },
    artist_id: Mongoose.Types.ObjectId
});

// artworkSchema.pre<Mongoose.Document<unknown, unknown, Artwork>>(
//     'save',
//     function (next) {
//         // eslint-disable-next-line @typescript-eslint/no-this-alias
//         const _this = this;
//         const result = ConfigModel.findOneAndUpdate(
//             {},
//             { $inc: { artwork_count: 1 } },
//             {},
//             function (err, counter) {
//                 if (err) return next(err);
//                 _this.$set({ index: counter.artwork_count + 1 });
//                 next();
//             }
//         );
//     }
// );

// 不能改，Artwork 的 index 在创建时就应该是固定的，改了就会出问题
// 所以网站查询的时候也不能依靠 index 了，下次再想想其他方式

// artworkSchema.pre('deleteOne', function(next) {
//     CounterModel.findOneAndUpdate({}, { $inc: { artwork_count: -1 } }, {}, function (err) {
//         if (err) return next(err); next()
//     })
// })

const ArtworkModel = Mongoose.model<Artwork>('Artwork', artworkSchema);

export default ArtworkModel;
