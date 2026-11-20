import AuthenticatedManageTranslations from './components/AuthenticatedManageTranslations/AuthenticatedManageTranslations';

const routes = [
  {
    path: '/**/manage-translations',
    exact: true,
    component: AuthenticatedManageTranslations,
  },
];

export default routes;
