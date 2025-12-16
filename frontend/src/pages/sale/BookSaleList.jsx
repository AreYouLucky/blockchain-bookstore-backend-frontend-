import BookCard from "../../components/displays/BookCard";
import AuthenticatedLayout from "../../layouts/AuthenticatedLayout";
import Button from "../../components/forms/Button";
import { useEffect, useState } from "react";
import BookForm from "./partials/BookForm";
import { getReadContract, getWriteContract } from "../../services/ether";
import { ethers } from "ethers";

export default function BookSaleList() {
    const [open, setOpen] = useState(false);
    const [books, setBooks] = useState([]);

    const [account, setAccount] = useState("");

    useEffect(() => {
        const load = async () => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            setAccount(ethers.getAddress(await signer.getAddress()));
        };
        load();

        window.ethereum?.on("accountsChanged", (accs) => {
            setAccount(accs?.[0] ? ethers.getAddress(accs[0]) : "");
        });

        return () => {
            window.ethereum?.removeListener("accountsChanged", () => { });
        };
    }, []);

    const normalizeAddr = (addr) => {
        if (!addr) return "";
        try {
            return ethers.getAddress(addr.trim());
        } catch {
            return addr.trim().toLowerCase();
        }
    };
    const isOwner = (owner) => normalizeAddr(owner) === account;

    async function fetchBookMetadata(cid) {
        const url = `https://dweb.link/ipfs/${cid}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch IPFS data");
        return await res.json();
    }

    async function loadListedBooks() {
        try {
            const contract = await getReadContract();
            const listedBooks = await contract.getBooksForSale();

            const formattedBooks = listedBooks.map((book) => ({
                tokenId: Number(book[0]),
                owner: book[1],
                priceWei: book[2].toString(),
                forSale: book[3],
                tokenURI: book[4],
            }));

            const booksWithMetadata = await Promise.all(
                formattedBooks.map(async (book) => {
                    const metadata = await fetchBookMetadata(book.tokenURI);
                    return { ...book, metadata };
                })
            );

            setBooks(booksWithMetadata);
            console.log(booksWithMetadata)
        } catch (err) {
            console.error("Failed to load books:", err);
        }
    }

    const unlistBook = async (tokenId) => {
        try {
            const contract = await getWriteContract();
            const tx = await contract.unlistBook(BigInt(tokenId));
            await tx.wait();

            alert("Book Successfully Unlisted");
            await loadListedBooks();
        } catch (e) {
            console.error(e);
            alert(e?.shortMessage || e?.message || "Unlist failed");
        }
    };

    const buyBook = async (tokenId, priceWei) => {
        const contract = await getWriteContract();
        const tx = await contract.buyBook(BigInt(tokenId), { value: BigInt(priceWei) });
        await tx.wait();
        await loadListedBooks();
    };

    const viewBook = (pdf) => window.open(`https://dweb.link/ipfs/${pdf}`, "_blank");

    useEffect(() => {
        loadListedBooks();
    }, []);

    const onClose = () => {
        setOpen(false);
        loadListedBooks();
    };

    return (
        <AuthenticatedLayout>
            <div className="border py-4 px-6 rounded-lg border-gray-200 text-gray-50 font-bold grid grid-cols-2 shadow-xs bg-[#00aeef]">
                <div className="flex items-center text-lg">Book Selections</div>
                <div className="flex items-center justify-end">
                    <Button className="bg-[#00aeef] text-white" onClick={() => setOpen(true)}>
                        Add Listing
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-5 p-5">
                {books.length === 0 && (
                    <p className="text-gray-400 col-span-3 text-center">No books listed yet</p>
                )}

                {books.map((book) => (
                    <BookCard key={book.tokenId} book={book}>
                        {isOwner(book.owner) && (
                            <Button
                                onClick={() => viewBook(book.metadata.file)}
                                className="border-gray-200 bg-[#00aeef] text-white"
                            >
                                View
                            </Button>
                        )}

                        <Button
                            onClick={() => (isOwner(book.owner) ? unlistBook(book.tokenId) : buyBook(book.tokenId, book.priceWei))}
                            className="border-gray-200 text-white bg-amber-600"
                        >
                            {isOwner(book.owner) ? "Unlist" : "Buy"}
                        </Button>
                    </BookCard>
                ))}
            </div>

            <BookForm open={open} onClose={onClose} />
        </AuthenticatedLayout>
    );
}
