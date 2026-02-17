import { SelectMenuToEdit } from "../../components/admin/SelectMenuToEdit"

export const SelectMenuToEditPage = () => {
    return (
        <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mt-10 mb-6 pb-20">Select Menu to Edit</h2>
            <div>
                <SelectMenuToEdit />
            </div>
        </div>
    )
}