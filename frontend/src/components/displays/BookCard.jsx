import Button from "../forms/Button";
export default function BookCard({ book, onClick }) {
  const account = localStorage.getItem("walletAddress");
    const {
        book_title,
        author,
        isbn,
        genre,
        price,
        cover,
        pdf,
        author_wallet_address
    } = book;

    return (
        <a
            href={pdf}
            target="_Blank"
            className="flex flex-col items-center bg-white p-6 border rounded-md shadow-md border-gray-200 md:flex-row "
        >
            <div>
                <img
                    className="object-cover w-full rounded-base h-64 md:h-auto md:w-48 mb-4 md:mb-0"
                    src={cover}
                    alt={book_title}
                />
            </div>

            <div className="flex flex-col justify-between p-5 leading-normal space-y-0 relative">
                <span className="text-[10px] border border-gray-200 px-2 py-1 bg-blue-50 rounded-lg mb-2 w-fit">
                    ISBN: {isbn}
                </span>
                <h5 className=" text-2xl font-bold tracking-tight text-heading mb-2">
                    {book_title}
                </h5>

                <p className="text-[13px] text-body mb-1">
                    By <span className="font-medium">{author}</span>
                </p>
                <p className="text-[13px] text-body mb-2">
                    {genre}
                </p>


                <div className="flex items-center justify-between">
                    <span className="text-heading font-semibold text-yellow-600">
                        {price} ETH
                    </span>

                    <Button
                        onClick={onClick}
                        className={` inline-flex items-center text-body border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none `}
                    >
                        {account === author_wallet_address ? 'Buy Books' : 'Sell Books'}
                        <svg
                            className="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 12H5m14 0-4 4m4-4-4-4"
                            />
                        </svg>
                    </Button>
                </div>
            </div>
        </a>
    );
}
