//theme,bookOption,bookStyle,viewerLayout,

import useEbookStore from '@/hooks/useEbookStore';
import { axiosWithAuth } from '@/lib/axios';
import { useCallback, useEffect } from 'react';
import useAuth from '../useAuth';

export default function useBookStyle({ viewerRef }: any) {
  const { user } = useAuth();

  const {
    theme,
    setTheme,
    bookOption,
    setBookOption,
    viewerLayout,
    setViewerLayout,
    bookStyle,
    setBookStyle,
  } = useEbookStore();

  const handleUpdate = async () => {
    const token = user?.accessToken;
    if (!token) {
      // throw new Error('User not logged in or session information missing');
      return null;
    }
    const data = {
      bookOption,
      bookStyle,
    };

    const res = await axiosWithAuth(token).post('/ebook/setting', data);
    const result = await res.data;
    // console.log('result ', result);
  };

  const onThemeChange = useCallback(
    (_type: 'dark' | 'light') => {
      setTheme(
        _type === 'dark' ? '/themes/dark.theme.css' : '/themes/light.theme.css',
      );
    },
    [viewerRef],
  );

  // đọc dọc,ngang
  const onDirection = useCallback(
    async (_type: 'Horizontal' | 'Vertical') => {
      if (_type === 'Horizontal') {
        setBookOption({ ...bookOption, flow: 'paginated' });
      } else {
        setBookOption({ ...bookOption, flow: 'scrolled-doc' });
      }
    },
    [viewerRef, bookOption],
  );

  // phân trang
  const onViewType = useCallback(
    async (_isSpread: boolean) => {
      if (_isSpread) {
        setBookOption({ ...bookOption, spread: 'auto' });
      } else {
        setBookOption({ ...bookOption, spread: 'none' });
      }
    },
    [viewerRef, bookOption],
  );

  // thay fontsize
  const onFontSize = useCallback(
    async (_size: number) => {
      setBookStyle({ ...bookStyle, fontSize: _size });
    },
    [viewerRef, bookStyle],
  );

  // khoảng cách giữa các dòng
  const onLineHeight = useCallback(
    async (_size: number) => {
      setBookStyle({ ...bookStyle, lineHeight: _size });
    },
    [viewerRef, bookStyle],
  );

  // margin vertical
  const onMarginVertical = useCallback(
    async (_size: number) => {
      setBookStyle({ ...bookStyle, marginVertical: _size });
    },
    [viewerRef, bookStyle],
  );

  // margin horizontal
  const onMarginHorizontal = useCallback(
    async (_size: number) => {
      setBookStyle({ ...bookStyle, marginHorizontal: _size });
    },
    [viewerRef, bookStyle],
  );

  useEffect(() => {
    handleUpdate();
  }, [bookStyle, bookOption]);

  return {
    theme,
    onThemeChange,
    viewerLayout,
    setViewerLayout,
    bookOption,
    bookStyle,
    onDirection,
    onViewType,
    onFontSize,
    onLineHeight,
    onMarginVertical,
    onMarginHorizontal,
  };
}
