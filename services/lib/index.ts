import { fetchData, postData } from "@/lib/api";
import { useManageStore } from "@/stores/managementStore";
import { AxiosResponse } from "axios";

// api/management.ts

export const getManagementData = async (): Promise<any> => {
  const { setManagementData, setLoading, setError } = useManageStore.getState();

  try {
    setLoading(true);
    setError(null);

    const response = await fetchData("/management");

    // Update the store with the response data

    if (response) {
      //@ts-ignore
      setManagementData(response.data);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      setError(error);
      throw error;
    }

    const unknownError = new Error(
      "Unknown error occurred while checking email"
    );
    setError(unknownError);
    throw unknownError;
  } finally {
    setLoading(false);
  }
};

type payLoadProps = {
  from: string;
  to: string;
};
export const getRate = async (payload: payLoadProps): Promise<any> => {
  try {
    const response = await postData("/wire/get-rate", payload);

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    const unknownError = new Error(
      "Unknown error occurred while checking email"
    );

    throw unknownError;
  }
};

export const getPurpose = async (): Promise<any> => {
  try {
    const response = await fetchData("/wire/get-purpose");

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    const unknownError = new Error(
      "Unknown error occurred while checking email"
    );

    throw unknownError;
  }
};
