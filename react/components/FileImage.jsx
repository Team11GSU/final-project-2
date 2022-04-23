import {
  Image,
  TextWrap,
  DocumentImage,
  DocumentPdf,
  DocumentPpt,
  DocumentCsv,
  DocumentWord,
  DocumentExcel,
  TextAlignFull,
} from 'grommet-icons';
import PropTypes from 'prop-types';

// Icon is assigned to files depending on the extension type / file type

export default function FileImage({ filetype }) {
  if (filetype.includes('openxmlformats-officedocument.presentationml')) {
    return <DocumentPpt />;
  }
  if (filetype.includes('openxmlformats-officedocument.wordprocessingml')) {
    return <DocumentWord />;
  }
  if (filetype.includes('openxmlformats-officedocument.spreadsheetml')) {
    return <DocumentExcel />;
  }
  if (filetype.includes('csv')) {
    return <DocumentCsv />;
  }
  if (filetype.includes('pdf')) {
    return <DocumentPdf />;
  }
  if (filetype.includes('text/plain')) {
    return <TextAlignFull />;
  }
  if (filetype.includes('text')) {
    return <TextWrap />;
  }
  if (filetype.includes('image')) {
    return <Image />;
  }
  return <DocumentImage />;
}

FileImage.propTypes = {
  filetype: PropTypes.string.isRequired,
};
