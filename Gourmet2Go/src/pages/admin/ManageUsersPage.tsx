import { ManageUsers } from "../../components/admin/ManageUsers"

export const ManageUsersPage = () => {
    return (
        <div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-5">
            User Manager
        </h2>
        <div>
            <ManageUsers />
        </div>
    </div>
    )
}