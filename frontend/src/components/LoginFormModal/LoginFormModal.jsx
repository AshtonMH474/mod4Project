import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../Context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [disabled,setDisable] = useState(true)
  const { closeModal } = useModal();

  useEffect(() => {
    if(credential.length >= 4 && password.length >= 6) setDisable(false);
    if(credential.length < 4 || password.length < 6) setDisable(true);

  },[setDisable,credential,password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        console.log(data)
        if (data && data.message) {
          setErrors(data.message);
        }
      });

  };

  return (
    <>

      <h1 className='loginH1'>Log In</h1>
      <form className='containerF' onSubmit={handleSubmit}>
      {errors.length && (
          <p className='loginP'>The provided credentials were invalid.</p>
        )}
        <label className='login'>
          Username or Email
          <input className='login'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className='login'>
          Password
          <input className='login'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {disabled == true &&  (<button style={{backgroundColor:'#484848'}} disabled={disabled} className='buttonL'  type="submit">Log In</button>)}
        {disabled == false && (<button style={{}} disabled={disabled} className='buttonL'  type="submit">Log In</button>)}
      </form>
    </>
  );
}

export default LoginFormModal;
