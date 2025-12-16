
export default function BookCard({ book, children }) {

  const { priceWei, metadata, forSale } = book;

  return (
    <div className="flex flex-col items-center bg-white px-4 py-4 border rounded-md shadow-md border-[#f3f3f3] md:flex-row hover:scale-105 duration-200">
      <div>
        <img
          className="object-cover w-full rounded-base h-56 md:w-48 mb-4 md:mb-0 border border-gray-200 shadow-lg rounded-lg hover:scale-105 duration-200"
          src={`https://dweb.link/ipfs/${metadata.cover}`}
          alt={metadata.book_title}
        />
      </div>

      <div className="flex flex-col justify-between p-5 leading-normal space-y-0 relative">
        <span className="text-[10px] border border-gray-200 px-2 py-1 bg-blue-50 rounded-lg mb-2 w-fit">
          ISBN: {metadata.isbn}
        </span>

        <h5 className="text-2xl font-bold tracking-tight text-heading mb-2">
          {metadata.book_title}
        </h5>

        <p className="text-[13px] text-body mb-1">
          By <span className="font-medium">{metadata.author}</span>
        </p>

        <p className="text-[13px] text-body mb-2">{metadata.genre}</p>
        {forSale &&
          <div className="flex items-center justify-between gap-5">
            <span className="text-heading font-semibold text-yellow-600">
              {priceWei > 0 ? priceWei : 0} WEI
            </span>
          </div>
        }

        <div className="flex flex-row items-center gap-2 mt-3">
          {children}
        </div>
      </div>
    </div>
  );
}
