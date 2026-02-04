import { ManageAdmins } from "../../components/admin/ManageAdmins"

export const ManageAdminsPage = () => {
    return (
        <div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-5">
            Admin Manager
        </h2>
        <div>
            <ManageAdmins />
        </div>
    </div>
    )
}