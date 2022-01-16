import Mongoose from "~/database"
import { AdminUser } from "~/types/Admin"

const adminSchema = new Mongoose.Schema<AdminUser>({
    user_id: Number,
    grant_by: Number,
    permissions: [String],
    create_time: {
        type: Date,
        default: new Date()
    }
})

const AdminModel = Mongoose.model('Admin', adminSchema)

export default AdminModel