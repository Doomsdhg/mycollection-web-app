import React, {useState} from 'react';
import {useAuthHooks} from '../hooks/authHooks.js';
import {useDispatch, useSelector} from 'react-redux';
import { Navigate } from "react-router-dom";

function SignUpForm() {
    
    const [formValue, setFormValue] = useState({
      email: '',
      username: '',
      password: '',
      password2: '',
      admin: false
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
        if (formValue.password !== formValue.password2) {
          throw new Error(userData.language === 'en'? 'Passwords should be identical' : 'Пароли не совпадают');
        }
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
        <section className="mt-5 vh-100 gradient-custom">
            <div className="container py-0 h-100 main-container">
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                  <div className="card bg-dark text-white rounded">
                    <div className="card-body p-5 text-center">

                      <div className="mb-md-5 mt-md-5 pb-0">

                        <h2 className="fw-bold mb-3 text-uppercase">{userData.language === 'en'?'Create new account':'Регистрация'}</h2>
                        <p className="text-white-50 mb-5">{userData.language === 'en'?'Fill following fields with your data':'Заполните поля вашими данными'}</p>

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

                        <button className="btn btn-outline-light btn-lg px-5" type="submit" onClick={clickHandler}>{userData.language === 'en'?'Create an account':'Создать аккаунт'}</button>

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
                        <p className="mb-0">{userData.language === 'en'?'Already have an account?':'Уже есть аккаунт?'} <a href="/auth" className="text-white-50 fw-bold">{userData.language === 'en'?'Login Here':'Войти'}</a></p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
        </section>
    )
}

export default SignUpForm
