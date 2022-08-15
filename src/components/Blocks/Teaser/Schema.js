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
  Rounded: {
    id: 'Rounded',
    defaultMessage: 'Rounded',
  },
  RoundedHelp: {
    id: 'Rounded Image',
    defaultMessage: 'Rounded Image',
  },
});

export const StylingSchema = ({ intl }) => ({
  title: intl.formatMessage(messages.Type),
  block: 'teaserGrid',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['theme', 'rounded'],
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
    rounded: {
      title: intl.formatMessage(messages.Rounded),
      description: intl.formatMessage(messages.RoundedHelp),
      type: 'boolean',
    },
  },
  required: [],
});

export const makeTitleFieldRequired = (schema) => {
  // const fieldset = schema.fieldsets.find(({fields}) => fields?.indexOf('title') > -1);

  // make the title required for accessility reasons
  if (schema.properties?.title && schema.required?.indexOf('title') === -1) {
    schema.required.push('title');
  }

  return schema;
};
