import { defineMessages } from 'react-intl';

const messages = defineMessages({
  Type: {
    id: 'Teaser',
    defaultMessage: 'Teaser',
  },
  Theme: {
    id: 'Theme',
    defaultMessage: 'Theme',
  },
  ThemeHelp: {
    id: 'Theme',
    defaultMessage: 'Theme',
  },
  ThemeDefault: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  ThemePrimary: {
    id: 'Primary',
    defaultMessage: 'Primary',
  },
  ThemeSecondary: {
    id: 'Secondary',
    defaultMessage: 'Secondary',
  },
  ThemeTertiary: {
    id: 'Tertiary',
    defaultMessage: 'Tertiary',
  },
});

export const StylingSchema = ({ intl }) => ({
  title: intl.formatMessage(messages.Type),
  block: 'teaserGrid',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['theme'],
    },
  ],
  properties: {
    theme: {
      title: intl.formatMessage(messages.Theme),
      description: intl.formatMessage(messages.ThemeHelp),
      choices: [
        ['', intl.formatMessage(messages.ThemeDefault)],
        ['primary', intl.formatMessage(messages.ThemePrimary)],
        ['secondary', intl.formatMessage(messages.ThemeSecondary)],
        ['tertiary', intl.formatMessage(messages.ThemeTertiary)],
      ],
    },
  },
  required: [],
});
