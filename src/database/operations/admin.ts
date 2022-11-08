import AdminModel from '~/database/models/AdminModel';
import { AdminPermission, AdminUser } from '~/types/Admin';

export async function hasPermisson(
    user_id: number,
    permisson: AdminPermission
): Promise<boolean> {
    const document = await AdminModel.findOne({
        user_id: user_id
    });
    if (!document) return false;
    if (
        document.permissions.includes(AdminPermission.DEFAULT) &&
        permisson != AdminPermission.GRANT
    )
        return true;
    return document.permissions.includes(permisson);
}

export async function hasPermissons(
    user_id: number,
    permissons: Array<AdminPermission>
): Promise<boolean> {
    const document = await AdminModel.findOne({
        user_id: user_id
    });
    if (!document) return false;
    let flag = true;
    for (const permission of permissons) {
        if (!document.permissions.includes(permission)) flag = false;
    }
    if (document.permissions.includes(AdminPermission.DEFAULT)) return true;
    return flag;
}

export async function grantPermissons(admin: AdminUser): Promise<boolean> {
    let document = await AdminModel.findOne({
        user_id: admin.user_id
    });
    if (document) {
        const modified = await AdminModel.updateOne(
            {
                user_id: admin.user_id
            },
            admin
        );
        if (modified.modifiedCount > 0) return true;
        return false;
    }
    document = new AdminModel(admin);
    await document.save();
    return true;
}

export async function removePermissions(user_id: number): Promise<boolean> {
    const delete_result = await AdminModel.deleteOne({
        user_id: user_id
    });
    if (delete_result.deletedCount > 0) return true;
    return false;
}
