import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import ManageTranslations from '@plone/volto/components/manage/Multilingual/ManageTranslations';

const AuthenticatedManageTranslations = (props) => {
  const token = useSelector((state) => state.userSession.token);
  const { pathname, search, hash } = useLocation();

  if (!token) {
    const returnUrl = encodeURIComponent(pathname + search + hash);
    return <Redirect to={`/login?return_url=${returnUrl}`} />;
  }

  return <ManageTranslations {...props} />;
};

export default AuthenticatedManageTranslations;
