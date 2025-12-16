import BookCard from "../../components/displays/BookCard";
import AuthenticatedLayout from "../../layouts/AuthenticatedLayout";
import Button from "../../components/forms/Button";
import { useEffect, useState, useCallback } from "react";
import { getReadContract, getWriteContract } from "../../services/ether";
import { ethers } from "ethers";
import PriceForm from "./partials/PriceForm";

export default function OwnedBooks() {
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState([]);
  const [account, setAccount] = useState("");
  const [price, setPrice] = useState(0);
  const [open,setOpen] = useState(false)

  useEffect(() => {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);

    const load = async () => {
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      setAccount(ethers.getAddress(await signer.getAddress()));
    };

    const onAccountsChanged = (accs) => {
      setAccount(accs?.[0] ? ethers.getAddress(accs[0]) : "");
    };

    load();
    window.ethereum.on("accountsChanged", onAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", onAccountsChanged);
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

  const isOwner = (owner) => normalizeAddr(owner) === normalizeAddr(account);

  const fetchBookMetadata = useCallback(async (uriOrCid) => {
    if (!uriOrCid) throw new Error("Missing tokenURI");

    const cid = uriOrCid.startsWith("ipfs://")
      ? uriOrCid.replace("ipfs://", "")
      : uriOrCid;

    const url = `https://dweb.link/ipfs/${cid}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch IPFS data");
    return await res.json();
  }, []);

  const loadOwnedBooks = useCallback(async () => {
    try {
      if (!account || !ethers.isAddress(account)) return;

      const contract = await getReadContract();
      const owned = await contract.getOwnedBooks(account);
      const formatted = owned.map((b) => ({
        tokenId: Number(b[0]),
        owner: b[1],
        priceWei: b[2].toString(),
        forSale: b[3],
        tokenURI: b[4],
      }));

      const withMeta = await Promise.all(
        formatted.map(async (book) => {
          const metadata = await fetchBookMetadata(book.tokenURI);
          return { ...book, metadata };
        })
      );

      setBooks(withMeta);
    } catch (err) {
      console.error("Failed to load books:", err);
    }
  }, [account, fetchBookMetadata]);


  useEffect(() => {
    loadOwnedBooks();
  }, [loadOwnedBooks]);

  const unlistBook = async (tokenId) => {
    try {
      const contract = await getWriteContract();
      const tx = await contract.unlistBook(BigInt(tokenId));
      await tx.wait();
      alert("Book Successfully Unlisted");
      await loadOwnedBooks();
    } catch (e) {
      console.error(e);
      alert(e?.shortMessage || e?.message || "Unlist failed");
    }
  };

  const openPrice =(tokenId)=>{
    setBook(tokenId)
    setOpen(true)
  }

  const sellBooks = async () => {
    setOpen(false)
    try {
      const contract = await getWriteContract();
      const tx = await contract.sellBook(BigInt(book),BigInt(price));
      await tx.wait();
      alert("Book Successfully Listed");
      await loadOwnedBooks();
    } catch (e) {
      console.error(e);
      alert(e?.shortMessage || e?.message || "Book List failed");
    }
  }

  const viewBook = (pdfCid) => window.open(`https://dweb.link/ipfs/${pdfCid}`, "_blank");

  return (
    <AuthenticatedLayout>
      <div className="grid grid-cols-3 gap-5 p-5">
        {books.length === 0 && (
          <p className="text-gray-400 col-span-3 text-center">No books owned yet</p>
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

            {/* Optional: only show Unlist if it's actually listed */}
            { book.forSale ? (
              <Button
                onClick={() => unlistBook(book.tokenId)}
                className="border-gray-200 text-white bg-amber-600"
              >
                Unlist
              </Button>
            ) : <Button
                onClick={() => openPrice(book.tokenId)}
                className="border-gray-200 text-white bg-red-500"
              >
                Sell
              </Button>}
          </BookCard>
        ))}
      </div>

      <PriceForm open={open} onClose={()=>setOpen(false)} price={price} setPrice={setPrice} onConfirm={sellBooks} />
    </AuthenticatedLayout>
  );
}
