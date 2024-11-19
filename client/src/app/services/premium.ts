import { getServerAuth } from "@/hooks/shop/use-server-session";
import { axiosWithAuth } from "@/lib/axios";
import { access } from "fs";
export const updateUserPremium = async (userId: string) => {
    try {
        const {user} = await getServerAuth();
        console.log('abcxyz', user)
        if (!user) {
            throw new Error('User not found');
        }   
        const response = await axiosWithAuth(user.accessToken).put(`/users/upgrade-premium`);
        // const response = await axios.get(`/shop/orders/${orderId}`);
        console.log('response', response)
        return response.data;
    } catch (error) {
        console.log('Error updateUserPremium', error);
        throw new Error('Error updateUserPremium');
    }
}

export const getUserInfo = async () => {
    try {
        const {user} = await getServerAuth();
        if (!user) {
            throw new Error('User not found');
        }
        const response = await axiosWithAuth(user.accessToken).get("/users/user-info");
        return response.data;
    } catch (error) {
        console.log('Error getUserInfo', error);
        throw new Error('Error getUserInfo');
    }
}