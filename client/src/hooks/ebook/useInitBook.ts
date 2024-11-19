import { Book } from '@/components/ui.custom/home/listbook';
import { axiosWithAuth } from '@/lib/axios';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useAuth from '../useAuth';
import useEbookStore from '../useEbookStore';

export default function UseInitBook(book: Book) {
  const [initBookStyle, setInitBookStyle] = useState(null);
  const [initBookOption, setInitBookOption] = useState(null);
  const [initCurrentLocation, setInitCurrentLocation] = useState(null);
  const [isSetting, setIsSetting] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const {
    setBookStyle,
    setBookOption,
    setCurrentLocation,
    bookStyle,
    bookOption,
    currentLocation,
    bookMarks,
    setBookMarks,
    setHighlights,
    setBook,
  } = useEbookStore();
  const { user } = useAuth();

  useEffect(() => {
    setBook(book);
  }, [book]);

  const handleFetchSetting = async () => {
    const token = user?.accessToken;
    if (!token) {
      // throw new Error('User not logged in or session information missing');
      return null;
    }
    const res = await axiosWithAuth(token).get('/ebook/setting');
    const data = await res.data;
    console.log(data);
    if (data != null) {
      setInitBookOption(data.bookOption);
      setInitBookStyle(data.bookStyle);
    }
  };

  useEffect(() => {
    handleFetchSetting();
  }, [user]);

  useEffect(() => {
    if (!isSetting && initBookOption && initBookStyle) {
      console.log(initBookOption, initBookStyle);
      setBookOption(initBookOption);
      setBookStyle(initBookStyle);
      setIsSetting(true);
    }
  }, [initBookOption, initBookStyle, isSetting]);

  const continueReading = async () => {
    console.log(book);
    const token = user?.accessToken;
    if (!token) {
      console.warn('User not logged in or session information missing');
      return null;
    }
    try {
      const res = await axiosWithAuth(token).get(`/reader/${book._id}`);
      const result = await res.data;
      setInitCurrentLocation(result.currentLocation);
      setBookMarks(result.bookmarks);
      setHighlights(result.highlights);
      setIsReading(true);

      console.log('get current location :', res.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error updating location:',
          error.response?.data || error.message,
        );
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  useEffect(() => {
    if (!initCurrentLocation && !isReading) {
      console.log('chay useeffect');
      continueReading();
    }
  }, [user]);

  return {
    initCurrentLocation,
  };
}
