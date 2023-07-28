import RichTextWidget from '@plone/volto-slate/widgets/RichTextWidget';
import { DataProvenance as NextDataProvenance } from '@eeacms/volto-widget-dataprovenance/components/theme/Widgets/DataProvenance';

export const DataProvenance = (props) => {
  if (props.behavior === 'eea.coremetadata.behavior') {
    return <NextDataProvenance {...props} />;
  }
  if (props.behavior === 'eea.dexterity.indicators.metadata') {
    return <RichTextWidget {...props} />;
  }
  return ' Data Provenance ';
};
