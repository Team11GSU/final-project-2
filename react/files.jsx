import { FileInput, Heading, List } from 'grommet';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import FileImage from './components/FileImage';

export default function Files() {
  const params = useParams();
  const [fileList, setFileList] = useState([]);
  const [bucketURL, setBucketURL] = useState('');
  const fetchList = () => fetch(`/${params.projectID}/s3/list`)
    .then((resp) => resp.json())
    .then((listData) => {
      setBucketURL(listData.url);
      setFileList(listData.files);
    });
  useEffect(() => {
    fetchList();
  }, []);
  const fileImage = useCallback((file) => <FileImage filetype={file.type} />, []);

  const getSignedURL = async (event) => {
    try {
      const file = event.target.files && event.target.files[0];
      const resp = await fetch(`/${params.projectID}/s3/sign?${new URLSearchParams({
        filename: file.name,
        filetype: file.type,
      })}`);
      const signedData = await resp.json();
      // const s3Data = new FormData();
      // s3Data.append('Content-Type', file.type);
      // Object.keys(signedData.fields).forEach((key) => {
      //   s3Data.append(key, signedData.fields[key]);
      // });

      // s3Data.append('file', file);
      // console.log(...s3Data);
      await fetch(`${signedData.url}Project_${params.projectID}_${file.name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: file,
      });
      // eslint-disable-next-line no-param-reassign
      event.target.value = null;
      fetchList();
    } catch (e) {
      throw new Error(`error ${e}`);
    }
  };

  return (
    <>
      <h1>Files</h1>
      <FileInput
        name="file"
        onChange={getSignedURL}
      />
      {fileList.length ? (
        <List
          primaryKey={(file) => file.name.replace(`Project_${params.projectID}_`, '')}
          secondaryKey={fileImage}
          data={fileList}
          onClickItem={({ item }) => {
            window.open(bucketURL + item.name, '_blank');
          }}
        />
      ) : <Heading>No Files Saved in this project</Heading>}
    </>
  );
}
