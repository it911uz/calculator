export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return "/placeholder-building.png";

  if (url.includes("172.18.0.1") || url.includes("localhost:8001")) {
    const fileName = url.split("/").pop(); 
    return `http://192.168.1.120:8001/images/${fileName}`; 
  }

  return url;
};