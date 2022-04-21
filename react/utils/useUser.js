import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

const useUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  // const navigate = useNavigate();
  const fetchFn = async () => {
    setIsLoading(true);
    const resp = await fetch('/userdata');
    const data = await resp.json();
    if (data.logged_in) {
      setUserData(data);
      setIsLoading(false);
    } else {
      window.location.replace('/', '_self');
      setIsLoading(false);
    }
  };
  useEffect(() => fetchFn(), []);
  return { isLoading, userData };
};

export default useUser;
