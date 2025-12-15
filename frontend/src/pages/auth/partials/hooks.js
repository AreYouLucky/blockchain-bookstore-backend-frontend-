export async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const walletAddress = accounts[0];
    localStorage.setItem("walletAddress", walletAddress);

    return walletAddress;
  } catch (err) {
    alert("Unexpected error occurred");
    console.error("User rejected connection:", err);
    return null;
  }
}
