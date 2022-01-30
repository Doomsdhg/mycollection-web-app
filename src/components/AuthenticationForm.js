import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';
import {useAuthHooks} from '../hooks/authHooks.js';
import {useRequestHooks} from '../hooks/serverRequestHooks';
import { ToastContainer, toast } from 'react-toastify';

function AuthenticationForm() {
  const navigate = useNavigate();
  const {sendPostRequest} = useRequestHooks();
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
  }

  const loginClickHandler = async () => {
    try {
      const {response, error} = await sendPostRequest('authentication', false, formValue, userData)
      if (error){
        throw new Error(error);
      }
      login(response, dispatch);
      navigate('/');
    } catch (e) {
      toast('' + e);
    }
  }

    return (
        <section className="vh-100 gradient-custom">
            <div className="container main-container py-0 h-100">
              <div id="auth-container" className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                  <div id="auth-form" className="card bg-dark text-white rounded">
                    <div className="card-body p-5 text-center">

                      <div className="mb-md-5 mt-md-4 pb-5">

                        <h2 className="fw-bold mb-2 text-uppercase">{userData.language === 'en'?'Login':'Авторизация'}</h2>
                        <p className="mb-5">{userData.language === 'en'?'Enter your email and password':'Введите ваш адрес электронной почты и пароль'}</p>

                        <div className="form-outline form-white mb-4">
                          <input type="email" name="email" onChange={formChangeHandler} placeholder={userData.language === 'en'?'Email':'Адрес электронной почты'} className="form-control form-control-lg" />
                        </div>

                        <div className="form-outline form-white mb-4">
                          <input type="password" name="password" onChange={formChangeHandler} id="typePasswordX" placeholder={userData.language === 'en'?'Password':'Пароль'} className="form-control form-control-lg" />
                        </div>
                        
                        <button className="btn btn-primary btn-lg px-5" onClick={loginClickHandler} type="submit">{userData.language === 'en'?'Login':'Войти'}</button>

                      </div>

                      {error?
                      <div className='text-danger'>
                      {error}
                      </div>:null}
                      <div>
                        <p className="mb-0">{userData.language === 'en'?"Don't have an account?":'Ещё нет аккаунта?'} <a href="/signup" className="fw-bold">{userData.language === 'en'?'Sign Up':'Зарегистрироваться'}</a></p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ToastContainer />
        </section>
    )
}

export default AuthenticationForm
