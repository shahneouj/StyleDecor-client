import { use } from 'react';
import { AuthContext } from '../Context/AuthContext';


const useAuth = () => {
  const data = use(AuthContext);
  return data;

}

export default useAuth;