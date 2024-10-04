import { useState } from 'react';
import CreateDocument from '../components/CreateDocument';
import Documents from '../components/Documents';
import Share from '../components/Share';

export default function Home({ documents, setDocuments }) {
  const [toggleShare, setToggleShare] = useState(false);
  const [id, setId] = useState();

  function handleShare(id) {
    setToggleShare(true);
    setId(id);
  }

  return (
    <>
      {toggleShare && <Share setToggleShare={setToggleShare} id={id} />}
      <CreateDocument documents={documents} setDocuments={setDocuments} />
      <Documents documents={documents} setDocuments={setDocuments} handleShare={handleShare} />
    </>
  );
}
