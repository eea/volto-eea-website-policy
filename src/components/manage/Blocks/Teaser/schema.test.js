import { addExternalLinkField, EXTERNAL_LINK_FIELD } from './schema';

const baseSchema = () => ({
  fieldsets: [{ id: 'default', title: 'Default', fields: ['href', 'title'] }],
  properties: { href: {}, title: {} },
});

describe('addExternalLinkField', () => {
  it('adds the field right after href', () => {
    const schema = addExternalLinkField({ schema: baseSchema() });

    expect(schema.fieldsets[0].fields).toEqual([
      'href',
      EXTERNAL_LINK_FIELD,
      'title',
    ]);
    expect(schema.properties[EXTERNAL_LINK_FIELD]).toMatchObject({
      widget: 'url',
    });
  });

  it('appends the field when there is no href', () => {
    const schema = addExternalLinkField({
      schema: {
        fieldsets: [{ id: 'default', fields: ['title'] }],
        properties: {},
      },
    });

    expect(schema.fieldsets[0].fields).toEqual(['title', EXTERNAL_LINK_FIELD]);
  });

  it('is idempotent', () => {
    let schema = baseSchema();
    schema = addExternalLinkField({ schema });
    schema = addExternalLinkField({ schema });

    expect(
      schema.fieldsets[0].fields.filter((f) => f === EXTERNAL_LINK_FIELD),
    ).toHaveLength(1);
  });
});
