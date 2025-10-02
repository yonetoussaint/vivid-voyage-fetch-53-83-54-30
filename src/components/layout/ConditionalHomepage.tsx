import React from 'react';
import { useHomepage } from '@/context/HomepageContext';
import Index from '@/pages/Index';
import BooksHomepage from '@/pages/BooksHomepage';

const ConditionalHomepage = () => {
  const { homepageType } = useHomepage();
  
  return homepageType === 'books' ? <BooksHomepage /> : <Index />;
};

export default ConditionalHomepage;