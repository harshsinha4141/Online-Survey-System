import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './UpdatePassword.css'; // Create this CSS file to style the component
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css'

function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    const response = await fetch('http://localhost:2000/signin/resetprofile', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          password: oldPassword,
          new_password: newPassword,
          confirm_new_password: confirmPassword
      })
    });
    const data = await response.json();
        if (!response.ok) {
            toast.error(data.msg);
            return;
        }
        toast.success("Password Updated Successfully");
        setTimeout(() => navigate('/home'), 2000);
  };

  return (
    <div className='body-update'>
      <div className="update-password-container">
      <h2>Update Password</h2>
      <form onSubmit={handleSubmit} className="update-password-form">
        <div className="form-group">
          <label>Old Password:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Update Password</button>
      </form>

      {showPopup && (
        <div className="popup">
          Password updated successfully!
        </div>
      )}

              <ToastContainer
                position='top-center'
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                newestOnTop={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='colored'
              />
    </div>
    </div>
  );
}

export default UpdatePassword;
