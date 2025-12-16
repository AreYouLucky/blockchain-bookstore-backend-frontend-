import Modal from "../../../components/displays/Modal";
import Button from "../../../components/forms/Button";
import Input from "../../../components/forms/Input";

export default function PriceForm({ open, price, setPrice, onClose, onConfirm }) {

    const handleChange =(e) => {
        setPrice(e.target.value);
    };
    return (
        <Modal open={open} onClose={onClose}>

            <div className="w-full gap-2">
                <div className="flex flex-col">
                    <label htmlFor="book_title" className="text-[13px]">Price</label>
                    <Input
                        id="price"
                        type="text"
                        name="price"
                        value={price || 0}
                        className="mt-1 w-full"
                        autoComplete="off"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="w-full gap-2 flex col-span-2 mt-4">
                    <Button onClick={onClose} className="border-gray-400">
                        Cancel
                    </Button>
                    <Button className="bg-[#00aeef] text-white border-gray-200" onClick={onConfirm} >
                        submit
                    </Button>
                </div>
            </div>

        </Modal>
    );
}
