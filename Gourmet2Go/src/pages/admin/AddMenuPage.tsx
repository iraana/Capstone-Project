import { AddMenu } from "../../components/admin/AddMenu";

export const AddMenuPage = () => {
    return (
        <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-5">
                Add New Menu
            </h1>
            <div className="mt-10">
                <AddMenu />
            </div>
        </div>
    );
}