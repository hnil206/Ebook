'use client';

import UserWrapper from '@/components/UserWrapper';
import useAuth from '@/hooks/useAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormPost from '../components/PostForm';
import {BreadcrumbCustom} from "@/components/ui.custom/Breadcrumb";
export default function AddPost() {
    const { user } = useAuth();
    return (
        <main className="flex flex-col h-full ml-6">
            <BreadcrumbCustom name="Community" href="community" />
        <UserWrapper>
            <div className="">
                <FormPost user={user} />
            </div>
        </UserWrapper>
        </main>
    );
};