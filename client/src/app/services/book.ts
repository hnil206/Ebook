import axios from "@/lib/axios";


export const getBooks = async () => {
    const response = await axios.get("/book");
    console.log(response.data);
    return response.data;
}

