import Modal from "../../../components/displays/Modal";
import Button from "../../../components/forms/Button";
import Input from "../../../components/forms/Input";
import InputFile from "../../../components/forms/InputFile";
import { useState, useCallback } from "react";

export default function BookForm({ open, onClose }) {
    const [data, setData] = useState({
        book_title: "",
        author: "",
        isbn: "",
        genre: "",
        cover: null,
        pdf: null,
    });

    const [errors, setErrors] = useState({});

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        setData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    }, []);

    const handleFileChange = useCallback((e) => {
        const { name, files } = e.target;
        const file = files?.[0] ?? null;

        setData((prev) => ({ ...prev, [name]: file }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    }, []);

    return (
        <Modal open={open} onClose={onClose}>
            <h2 className="font-bold mb-3">Book Details</h2>

            <div className="w-full grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                    <label htmlFor="book_title" className="text-[13px]">Title</label>
                    <Input
                        id="book_title"
                        type="text"
                        name="book_title"
                        value={data.book_title || ""}
                        className="mt-1 w-full"
                        autoComplete="off"
                        onChange={handleChange}
                        required
                    />
                    {errors.book_title ? (
                        <p className="text-xs text-red-400 mt-1">{errors.book_title}</p>
                    ) : null}
                </div>

                <div className="flex flex-col">
                    <label htmlFor="author" className="text-[13px]">Author</label>
                    <Input
                        id="author"
                        type="text"
                        name="author"
                        value={data.author || ""}
                        className="mt-1 w-full"
                        autoComplete="off"
                        onChange={handleChange}
                        required
                    />
                    {errors.author ? (
                        <p className="text-xs text-red-400 mt-1">{errors.author}</p>
                    ) : null}
                </div>

                <div className="flex flex-col">
                    <label htmlFor="isbn" className="text-[13px]">ISBN</label>
                    <Input
                        id="isbn"
                        type="text"
                        name="isbn"
                        value={data.isbn || ""}
                        className="mt-1 w-full"
                        autoComplete="off"
                        onChange={handleChange}
                        required
                    />
                    {errors.isbn ? (
                        <p className="text-xs text-red-400 mt-1">{errors.isbn}</p>
                    ) : null}
                </div>

                <div className="flex flex-col">
                    <label htmlFor="genre" className="text-[13px]">Genre</label>
                    <Input
                        id="genre"
                        type="text"
                        name="genre"
                        value={data.genre || ""}
                        className="mt-1 w-full"
                        autoComplete="off"
                        onChange={handleChange}
                        required
                    />
                    {errors.genre ? (
                        <p className="text-xs text-red-400 mt-1">{errors.genre}</p>
                    ) : null}
                </div>

                <div className="flex flex-col">
                    <label className="text-[13px] mb-1">Cover</label>
                    <InputFile
                        title="Upload Cover Here"
                        subtitle="File type: PNG, JPG, JPEG"
                        name="cover"
                        onChange={handleFileChange}
                        accept=".png,.jpg,.jpeg"
                    />
                    {errors.cover ? (
                        <p className="text-xs text-red-400 mt-1">{errors.cover}</p>
                    ) : null}
                </div>

                <div className="flex flex-col">
                    <label className="text-[13px] mb-1">PDF</label>
                    <InputFile
                        title="Upload Book Here"
                        subtitle="File type: PDF"
                        name="pdf"
                        onChange={handleFileChange}
                        accept=".pdf,application/pdf"
                    />
                    {errors.pdf ? (
                        <p className="text-xs text-red-400 mt-1">{errors.pdf}</p>
                    ) : null}
                </div>
                <div className="w-full gap-2 col-span-2 flex flex-col mt-2">
                    <label htmlFor="price" className="text-[13px]">Price (ETH)</label>
                    <Input
                        id="price"
                        type="text"
                        name="price"
                        value={data.price || ""}
                        className=" w-full"
                        autoComplete="off"
                        onChange={handleChange}
                        required
                    />
                    {errors.price ? (
                        <p className="text-xs text-red-400 mt-1">{errors.isbn}</p>
                    ) : null}
                </div>

                <div className="w-full gap-2 flex col-span-2 mt-2">
                    <Button onClick={onClose} className="border-gray-400">
                        Cancel
                    </Button>
                    <Button className="bg-[#00aeef] text-white border-gray-200">
                        Mint Book
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
