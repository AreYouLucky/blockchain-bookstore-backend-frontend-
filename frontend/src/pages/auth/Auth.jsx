import ParentCard from "../../components/displays/ParentCard";
import GuestLayout from "../../layouts/GuestLayout";
import Button from "../../components/forms/Button";
import { FaBookmark } from "react-icons/fa";
import { connectWallet } from "./partials/hooks";

export default function Auth() {
  const handleButtonClick = async () => {
    await connectWallet();
    window.location.reload();
  };
  return (
    <GuestLayout>
      <ParentCard className={` flex-col flex justify-center mt-n[10] `}>
          <img src="/images/logo.png" alt="" className="w-[90%]" />
          <p className="text-center font-bold text-gray-600">Simple Book Store</p>
          <Button className="bg-[#00aeef] text-white mt-5 flex items-center justify-center gap-3" onClick={handleButtonClick}>Get Started <FaBookmark/></Button>
      </ParentCard>
    </GuestLayout>
  );
}
