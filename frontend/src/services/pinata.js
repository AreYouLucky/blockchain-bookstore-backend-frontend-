const PINATA_JWT = import.meta.env.VITE_PINATA_JWT; 

export async function uploadFileToIPFS(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
  });

  if (!res.ok) {
    throw new Error(`File upload failed: ${res.statusText}`);
  }
  const data = await res.json();
  console.log(data);
  return `${data.IpfsHash}`;
}

export async function uploadJSONToIPFS(json, name) {
  const payload = {
    pinataMetadata: {
      name: name || "Default Name",
    },
    pinataContent: json,
  };

  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`JSON upload failed: ${res.statusText}`);
  }

  const data = await res.json();
  return `${data.IpfsHash}`;
}

