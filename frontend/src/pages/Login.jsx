import { useState } from 'react';

const Login = () => {
  const [state, setState] = useState('Login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleStateChange = (newState) => {
    setState(newState);
    setEmail('');
    setName('');
    setPassword('');
  };

  return (
    <div className='min-h-[80vh] flex items-center'>
      {/* Flex container for form and image */}
      <div className='flex flex-row w-full'>
        {/* Form on the left side */}
        <div className='flex-1 flex items-center justify-center'>
          <form className='flex flex-col gap-3 items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-custom-blue'>
            <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
            <p>Please {state === 'Sign Up' ? "Create Account" : "Login"} to book appointment</p>
            {
              state === 'Sign Up' && <div className='w-full'>
                <p>Email</p>
                <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='text' placeholder='Enter your email' onChange={(e)=>setEmail(e.target.value)} value={email} required/>
              </div>
            }
            <div className='w-full'>
              <p>Name</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='text' placeholder='Enter your name' onChange={(e)=>setName(e.target.value)} value={name} required/>
            </div>
            <div className='w-full'>
              <p>Password</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='password' placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)} value={password} required/>
            </div>
            <button className='bg-primary text-white w-full py-2 rounded-md text-base'>{state === 'Sign Up' ? "Create Account" : "Login"}</button>
            {
              state === 'Sign Up'
              ? <p className='text-xs'>Already have an account? <span onClick={()=>handleStateChange('Login')} className='text-primary underline cursor-pointer'>Login here</span></p> 
              : <p>Create a new account? <span onClick={()=>handleStateChange('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>
            }
          </form>
        </div>

        {/* Image on the right side */}
        <div className='flex-1 flex items-center justify-center'>
          <img 
            src="https://images.app.goo.gl/1xM3NvWP2tFKFHWq5" // Replace with your image URL
            alt="Login Illustration" 
            className='w-full h-auto max-w-[500px]'
          />
        </div>
      </div>
    </div>
  );
};

export default Login;