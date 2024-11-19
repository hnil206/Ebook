"use client";
import React, { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { axiosWithAuth } from "@/lib/axios";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Crown, Mail, User2, Shield, Calendar } from "lucide-react";
import { checkoutWithVNPay } from "./action";
import { useServerAction } from "zsa-react";
import { toast } from "@/components/ui/use-toast";
import { Heart } from "lucide-react";
interface User {
  premiumStatus: {
    isPremium: boolean;
    expiresAt: Date;
  };
}

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const router = useRouter();

  const { execute } = useServerAction(checkoutWithVNPay, {
    onSuccess: () => {},
    onError: ({ err }) => {
      toast({
        variant: "error",
        title: "Order Failed",
        description: `An error occurred, please try again later. ${
          err.message || ""
        }`,
      });
    },
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = user?.accessToken;
      if (!token) return;
      const response = await axiosWithAuth(token).get("/users/user-info");
      setUserInfo(response.data);
    };
    fetchUserInfo();
    setLoading(!user);
  }, [user]);

  const handleClickPayment = async () => {
    const result = await execute();
    if (result[0] && result[0].success) {
      router.push(result[0].redirectUrl as string);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader className="pb-2">
          <Skeleton className="h-12 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8 border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-red-500">
            <Shield className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8 p-6">
        <p className="text-center text-gray-500">User not found</p>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8 shadow-lg">
      <CardHeader className="pb-2 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Profile Dashboard
          </h1>
          {userInfo?.premiumStatus.isPremium && (
            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500">
              <Crown className="w-4 h-4 mr-1" />
              Premium Member
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* User Basic Info Section */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 flex-1">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Account Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User2 className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700">{user.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700">{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User2 className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700">@{user.username}</span>
                </div>
              </div>
            </div>

            {/* Membership Status Section */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 flex-1">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Membership Status
              </h2>
              {userInfo?.premiumStatus.isPremium ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-5 w-5 text-amber-500" />
                    <span className="text-gray-700">Premium Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-amber-500" />
                    <span className="text-gray-700">
                      Expires:{" "}
                      {new Date(
                        userInfo.premiumStatus.expiresAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Upgrade to Premium to unlock all features!
                  </p>
                  <Button
                    onClick={handleClickPayment}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Role Section */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Role & Permissions
            </h2>
            <div className="flex flex-wrap gap-2">
              {user.role.map((role: string) => (
                <Badge
                  key={role}
                  className="bg-green-100 text-green-800 hover:bg-green-200"
                >
                  <Shield className="w-4 h-4 mr-1" />
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardContent>
        <a href="/user/favourites">
          <Button className="flex items-center justify-center bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-200">
            <Heart className="mr-2" />{" "}
            {/* Giả sử bạn có một component icon cho hình trái tim */}
            Your Favorites Books
          </Button>
        </a>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
