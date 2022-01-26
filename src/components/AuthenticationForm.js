import React, {useState} from 'react';
import { Navigate } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';
import {useAuthHooks} from '../hooks/authHooks.js';

function AuthenticationForm() {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.userData);
  const [formValue, setFormValue] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const {login} = useAuthHooks();
  const formChangeHandler = (e) => {
    setFormValue({...formValue, [e.target.name]: e.target.value});
    console.log(formValue);
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
      if (response.blocked) {
        
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
                  <div className="card bg-dark text-white rounded">
                    <div className="card-body p-5 text-center">

                      <div className="mb-md-5 mt-md-4 pb-5">

                        <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                        <p className="text-white-50 mb-5">{userData.language === 'en'?'Enter your email and password':'Введите ваш адрес электронной почты и пароль'}</p>

                        <div className="form-outline form-white mb-4">
                          <input type="email" name="email" onChange={formChangeHandler} placeholder={userData.language === 'en'?'Email':'Адрес электронной почты'} className="form-control form-control-lg" />
                        </div>

                        <div className="form-outline form-white mb-4">
                          <input type="password" name="password" onChange={formChangeHandler} id="typePasswordX" placeholder={userData.language === 'en'?'Password':'Пароль'} className="form-control form-control-lg" />
                        </div>
                        
                        <button className="btn btn-outline-light btn-lg px-5" onClick={loginClickHandler} type="submit">{userData.language === 'en'?'Login':'Войти'}</button>

                      </div>

                      {(()=>{if (userData.isAuthenticated) {
                        console.log(userData.isAuthenticated);
                        return <Navigate to="/"/>
                      }})()}

                      {(()=>{if(error){
                          return (
                            <div className='text-danger'>
                            {error}
                            </div>
                          )
                          }})()}
                      <div>
                        <p className="mb-0">{userData.language === 'en'?"Don't have an account?":'Ещё нет аккаунта?'} <a href="/signup" className="text-white-50 fw-bold">{userData.language === 'en'?'Sign Up':'Зарегистрироваться'}</a></p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
        </section>
    )
}

export default AuthenticationForm
