import ParentCard from "../../components/displays/ParentCard"
import AuthenticatedLayout from "../../layouts/AuthenticatedLayout"

export default function About() {
    return (
        <AuthenticatedLayout>
            <div className="w-full flex items-center justify-center">
                <ParentCard className={` flex-col flex justify-center mt-10 p-10`}>
                    <img src="/images/logo.png" alt="" className="w-[90%]" />
                    <h3 className=" font-bold text-gray-800 text-justify mt-2">Simple Book Chain</h3>
                    <p className="text-justify text-sm mt-1">
                        Just a sample store created with solidity backend and react frontend.
                    </p>
                </ParentCard>
            </div>
        </AuthenticatedLayout>
    )
}