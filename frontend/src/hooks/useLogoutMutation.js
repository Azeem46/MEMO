import { useDispatch } from 'react-redux';
import { useMutation } from 'react-query';
import { logout } from '../features/auth/authSlice';

const useLogoutMutation = () => {
  const dispatch = useDispatch();

  return useMutation(() => {
    // Clear token from localStorage or other storage if needed
    localStorage.removeItem('token'); // Assuming token is stored in localStorage
    
    // Dispatch the logout action
    dispatch(logout());
  }, {
    onSuccess: () => {
      // Any additional logic on successful logout
      // For example, redirect the user to the home page
      window.location.href = '/'; // Or use React Router's useNavigate
    },
  });
};

export default useLogoutMutation;
