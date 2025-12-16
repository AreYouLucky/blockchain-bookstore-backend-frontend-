import Modal from "../../../components/displays/Modal";
import Button from "../../../components/forms/Button";
import Input from "../../../components/forms/Input";
import InputFile from "../../../components/forms/InputFile";
import { useState, useCallback } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../../services/pinata";
import { getWriteContract } from "../../../services/ether";
import { ethers } from "ethers";

export default function BookForm({ open, onClose }) {
    const [data, setData] = useState({
        book_title: "",
        author: "",
        isbn: "",
        genre: "",
        cover: null,
        pdf: null,
        price: ''
    });
    const [loading, setLoading] = useState(false)
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const contract = await getWriteContract();
            const coverCID = await uploadFileToIPFS(data.cover);
            const pdfCID = await uploadFileToIPFS(data.pdf);
            const metadata = {
                book_title: data.book_title,
                author: data.author,
                isbn: data.isbn,
                genre: data.genre,
                cover: coverCID,
                file: pdfCID,
                price: data.price, 
            };

            const metadataCID = await uploadJSONToIPFS(metadata, data.book_title);
            const signerAddr = await contract.runner.getAddress();

            const mintTx = await contract.mintBook(signerAddr, metadataCID);
            const mintRcpt = await mintTx.wait();
            let tokenId = null;

            for (const log of mintRcpt.logs) {
                    const parsed = contract.interface.parseLog(log);
                    if (parsed?.name === "BookMinted") {
                        tokenId = Number(parsed.args.tokenID);
                        break;
                    }
            }
            if (tokenId === null) {
                const next = await contract.nextTokenID();
                tokenId = Number(next) - 1;
            }
            const priceWei = ethers.parseEther(String(data.price || "0"));

            if (priceWei <= 0n) {
                throw new Error("Price must be greater than 0");
            }

            const listTx = await contract.sellBook(BigInt(tokenId), priceWei);
            await listTx.wait();

            alert("Book NFT minted and listed!");
            onClose?.();
        } catch (err) {
            console.error(err);
            alert(err?.shortMessage || err?.message || "Failed to upload/mint/list NFT!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <h2 className="font-bold mb-3">Book Details</h2>
            <form
                onSubmit={handleSubmit}
            >
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
                        <Button className="bg-[#00aeef] text-white border-gray-200" type="submit" disabled={loading}>
                            {loading ? 'Minting' : 'Mint Books'}
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
