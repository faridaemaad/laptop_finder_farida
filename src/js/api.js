export async function fetchLaptops() {
  try {
    const response = await fetch("data/laptops.json");
    if (!response.ok) {
      throw new Error("Server error " + response.status);
    }
    const laptops = await response.json();
    return laptops;
  } catch (error) {
    console.error(error);
    return null;
  }
}