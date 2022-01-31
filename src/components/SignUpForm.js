import React, {useState, useEffect} from 'react';
import {useAuthHooks} from '../hooks/authHooks.js';
import {useDispatch, useSelector} from 'react-redux';
import { useNavigate } from "react-router-dom";
import {useRequestHooks} from '../hooks/serverRequestHooks';
import { ToastContainer, toast } from 'react-toastify';

function SignUpForm() {
    const [formValue, setFormValue] = useState({
      email: '',
      userName: '',
      password: '',                                         //define input forms
      password2: '',
      admin: false
    });
    const {login} = useAuthHooks();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector(state => state.userData);
    const {sendPostRequest} = useRequestHooks();

    useEffect(()=>{
      if (userData.isAuthenticated) {                                         //redirect to main page if user is authenticated
        navigate('/');
      }
    },[userData.isAuthenticated])

    const formChangeHandler = (e) => {
      setFormValue({...formValue, [e.target.name]: e.target.value});
    }
  
    const clickHandler = async () => {
      try {
        if (formValue.password !== formValue.password2) {
          throw new Error(userData.language === 'en'? 'Passwords should be identical' : 'Пароли не совпадают');
        }
        const {error} = await sendPostRequest('register', false, formValue);
        if (error){
          throw new Error(error);
        } else {
          loginClickHandler()
        }
        
      } catch (e) {
        toast('' + e)
      }
    }

    const loginClickHandler = async () => {
      try {
        const {response, error} = await sendPostRequest('authentication', false, formValue);
        if (error) {
          throw new Error(error)
        }
        login(response, dispatch);
        } catch (e) {
        toast('' + e)
      }
    }

    return (
        <section className="mt-5 vh-100 gradient-custom">
            <div className="container py-0 h-100 main-container">
              <div id="signup-form" className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                  <div className="card rounded">
                    <div className="card-body p-5 text-center">

                      <div className="mb-md-5 mt-md-5 pb-0">

                        <h2 className="fw-bold mb-3 text-uppercase">{userData.language === 'en'?'Create new account':'Регистрация'}</h2>
                        <p className="mb-5">{userData.language === 'en'?'Fill following fields with your data':'Заполните поля вашими данными'}</p>

                        <div className="form-outline form-white mb-4">
                          <input type="email" name="email" onChange={formChangeHandler} className="form-control form-control-lg" placeholder={userData.language === 'en'?'Email':'Элетронная почта'} />
                        </div>

                        <div className="form-outline form-white mb-4">
                          <input type="text" name="userName" onChange={formChangeHandler} className="form-control form-control-lg" placeholder={userData.language === 'en'?'Username':'Имя пользователя'}/>
                        </div>

                        <div className="form-outline form-white mb-4">
                          <input type="password" name="password" onChange={formChangeHandler} className="form-control form-control-lg" placeholder={userData.language === 'en'?'Password':'Пароль'}/>
                        </div>

                        <div className="form-outline form-white mb-4">
                          <input type="password" name="password2" onChange={formChangeHandler} className="form-control form-control-lg" placeholder={userData.language === 'en'?'Repeat your password':'Повторите пароль'}/>
                        </div>
                      </div>

                      <div className="mb-md-4 mt-md-4 pb-5">

                        <button className="btn btn-primary btn-lg px-5" type="submit" onClick={clickHandler}>{userData.language === 'en'?'Create an account':'Создать аккаунт'}</button>

                      </div>
                      <div>
                        <p className="mb-0">{userData.language === 'en'?'Already have an account?':'Уже есть аккаунт?'} <a href="/auth" className="fw-bold">{userData.language === 'en'?'Login Here':'Войти'}</a></p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            < ToastContainer />
        </section>
    )
}

export default SignUpForm
