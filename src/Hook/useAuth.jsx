import { use } from 'react';
import { AuthContext } from '../Context/AuthContext';


const useAuth = () => {
  const data = AuthContext();
  return data;

}