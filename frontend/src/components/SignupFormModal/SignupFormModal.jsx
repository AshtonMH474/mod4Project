import { useEffect,useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../Context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';


function SignupFormModal({setShowMenu}) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [disabled,setDisable] = useState(true)
  const { closeModal } = useModal();

  useEffect(() => {
    if(email.length && username.length && firstName.length && lastName.length && password.length && confirmPassword.length) setDisable(false);
    if(!email.length || !username.length || !firstName.length || !lastName.length || !password.length || !confirmPassword.length || password.length < 6 || username.length < 4) setDisable(true);

    setShowMenu(false)

  },[setShowMenu,setDisable,email,username,firstName,lastName,password,confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }

    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };


  return (
    <>
      <h1 className='h1S'>Sign Up</h1>
      <form className='containerS' onSubmit={handleSubmit}>
      {errors.email  && <p className='errors'>The provided email is invalid.</p>}
      {errors.username && <p className='errors'>Username must be unique.</p>}
      {errors.firstName && <p className='errors'>{errors.firstName}</p>}
      {errors.lastName && <p className='errors'>{errors.lastName}</p>}
      {errors.password && <p className='errors'>{errors.password}</p>}
      {errors.confirmPassword && (
          <p className='errors'>{errors.confirmPassword}</p>
        )}
        <label className='signUp'>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className='signUp'>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label className='signUp'>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>

        <label className='signUp'>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>

        <label className='signUp'>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label className='signUp'>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {disabled == true &&  (<button style={{backgroundColor:'#484848',cursor:'default'}} disabled={disabled} className='buttonS'  type="submit">Sign Up</button>)}
        {disabled == false && (<button style={{}}  className='buttonS'  type="submit">Sign Up</button>)}

      </form>
    </>
  );
}

export default SignupFormModal;
