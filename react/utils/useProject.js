import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useProject = (projectID) => {
  const [projIsLoading, setIsLoading] = useState(true);
  const [projectData, setProjData] = useState(null);
  const navigate = useNavigate();
  const fetchFn = async () => {
    setIsLoading(true);
    const resp = await fetch(`/${projectID}/getProjectData`);
    const data = await resp.json();
    if (data.projectExists) {
      setProjData(data);
      setIsLoading(false);
    } else {
      navigate('/profile');
      setIsLoading(false);
    }
  };
  useEffect(() => { fetchFn(); }, []);
  return { projIsLoading, projectData };
};

export default useProject;
