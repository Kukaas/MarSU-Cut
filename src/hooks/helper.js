import axios from "axios";
import { token } from "@/lib/token";
import { BASE_URL } from "@/lib/api";

export const fetchProductTypes = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/system-maintenance/product-type/all`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      return response.data.productTypes.sort((a, b) =>
        a.productType.localeCompare(b.productType)
      );
    } else {
      throw new Error("Failed to fetch product types");
    }
  } catch (error) {
    console.error("Error fetching product types:", error);
    throw error;
  }
};

export const fetchSizes = async (productType) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/system-maintenance/size/all`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      // Filter sizes by productType if needed
      const allSizes = response.data.sizes;

      if (!productType) return allSizes;

      const filteredSizes = allSizes.filter(
        (size) => size.productType === productType
      );

      return filteredSizes.sort((a, b) => a.size.localeCompare(b.size));
    } else {
      throw new Error("Failed to fetch sizes");
    }
  } catch (error) {
    console.error("Error fetching sizes:", error);
    throw error;
  }
};
