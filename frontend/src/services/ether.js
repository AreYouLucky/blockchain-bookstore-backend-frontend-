import { ethers } from "ethers";
import contractData from '../utils/BookNFT.json';
const contractABI = contractData.abi;
const contractAddress = import.meta.env.VITE_BOOKNFT_ADDRESS;


export async function getReadContract() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(
    contractAddress,
    contractABI,
    provider
  );
  return contract;
}

export async function getWriteContract() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  return contract;
}
