/* eslint-disable react/prop-types */
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
