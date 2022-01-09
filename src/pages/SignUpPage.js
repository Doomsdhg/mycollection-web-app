import React, {useState} from 'react';
import {useAuthHooks} from '../hooks/authHooks.js';
import {useDispatch, useSelector} from 'react-redux';
import { Navigate } from "react-router-dom";

function SignUpPage() {
  
    const [formValue, setFormValue] = useState({
      email: '',
      username: '',
      password: '',
      password2: ''
    });
    const [error, setError] = useState(null);
    const {login} = useAuthHooks();
    const dispatch = useDispatch();
    const userData = useSelector(state => state.userData);

    const formChangeHandler = (e) => {
      setFormValue({...formValue, [e.target.name]: e.target.value});
      console.log(formValue);
    }
  
    const clickHandler = async () => {
      try {
        const response = await fetch('https://mycollection-server.herokuapp.com/api/register', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify(formValue)
        });
        const data = await response.json();
        if (!response.ok){
          throw new Error(data.message);
        }
        loginClickHandler()
      } catch (e) {
        setError(`${e}`);
        console.log(e)
      }
    }

    const loginClickHandler = async () => {
      try {
        const response = await fetch('https://mycollection-server.herokuapp.com/api/authentication', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: formValue?JSON.stringify(formValue):null
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok){
          throw new Error(data.message);
        }
        login(data, dispatch);
        console.log(userData);
        } catch (e) {
        setError(`${e}`);
        console.log(e)
      }
    }

    return (
        <section className="vh-100 gradient-custom">
            <div className="container py-0 h-100">
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                  <div className="card bg-dark text-white" style={{borderRadius: '1rem'}}>
                    <div className="card-body p-5 text-center">

                      <div className="mb-md-5 mt-md-5 pb-0">

                        <h2 className="fw-bold mb-3 text-uppercase">Create new account</h2>
                        <p className="text-white-50 mb-5">Fill following fields with your data</p>

                        <div className="form-outline form-white mb-4">
                          <input type="email" name="email" onChange={formChangeHandler} className="form-control form-control-lg" placeholder='Email' />
                        </div>

                        <div className="form-outline form-white mb-4">
                          <input type="text" name="username" onChange={formChangeHandler} className="form-control form-control-lg" placeholder='Username'/>
                        </div>

                        <div className="form-outline form-white mb-4">
                          <input type="password" name="password" onChange={formChangeHandler} className="form-control form-control-lg" placeholder='Password'/>
                        </div>

                        <div className="form-outline form-white mb-4">
                          <input type="password" name="password2" onChange={formChangeHandler} className="form-control form-control-lg" placeholder='Repeat your password'/>
                        </div>
                      </div>

                      <div className="mb-md-4 mt-md-4 pb-5">

                        <button className="btn btn-outline-light btn-lg px-5" type="submit" onClick={clickHandler}>Create an account</button>

                      </div>

                      {(()=>{if (userData.isAuthenticated) {
                        console.log(userData.isAuthenticated);
                        return <Navigate to="/"/>
                      }})()}

                      {(()=>{if(error){
                          return (
                            <div style={{'color': 'red'}}>
                            {error}
                            </div>
                          )
                          }})()}

                      <div>
                        <p className="mb-0">Already have an account? <a href="/auth" className="text-white-50 fw-bold">Login Here</a></p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
        </section>
    )
}

export default SignUpPage
