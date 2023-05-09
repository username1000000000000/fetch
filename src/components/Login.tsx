import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Input, Message, useToaster } from 'rsuite';
import 'rsuite/dist/rsuite-no-reset.min.css';
import '../App.css';
import PawPrint from '../pawprint.png';

const myFormData = {
    email: '',
    name: ''
}

const Login = () => {
    const [formData, setFormData] = useState(myFormData);
    const {email, name} = formData;
    const [loading, setLoading] = useState(false);
    const [type, setType] = React.useState('error');
    const toaster = useToaster();
    const navigate = useNavigate();

    ///Login response components
    const errorMessage = (message: string) => {
        if (message !== "") {
            return (
                <Message showIcon type='error'>
                    {message}
                </Message>
              );
        }
        return (
            <Message showIcon type='error'>
              Fields are missing. All fields are required.
            </Message>
          );
        
      }

    const successMessage = (
        <Message showIcon type='success'>
            Your login atempt was successful. Directing you to our database!
        </Message>
    );

    ///Methods for input onChange and form onSubmit
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.id]: e.target.value,
        }));
        
      };
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        /*Method checks that email and name have values and on success will
        navigate them to AuthUser.tsx
        */
        setFormData(myFormData);
        if (email !== "" && name !== "") {
            axios.post('https://frontend-take-home-service.fetch.com/auth/login',
            formData,
            { withCredentials: true })
            .then((response) => {
                toaster.push(successMessage, { duration: 5000 });
                setTimeout(() => {
                    navigate(`/AuthUser/${email}`);
                    setLoading(false);
                    console.log(response);
                }, 5000);
            }).catch((error) => {
                console.log(error);
                toaster.push(errorMessage(error.message), { duration: 5000 });
                setLoading(false);
            })
        } else {
            toaster.push(errorMessage('error'), { duration: 5000 });
            setLoading(false);
            console.log('Fields required');
        }
      };
    return (
        ///Form component
        <div className="login-container">
            <form onSubmit={onSubmit}>
                <img src={PawPrint} height='75' width='75' />
                <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={onChange} 
                placeholder="Email address"
                />
                <input 
                type="text" 
                id="name"
                value={name} 
                onChange={onChange}
                placeholder="Name"
                />
                {loading === false ?
                <Button type="submit" appearance="primary" style={{width:'100%'}}>Login</Button>
                :
                <Button appearance="primary" loading style={{width:'100%'}}>...</Button>
                }
                <p>Welcome to the dog database where signing in has never been easier. Enter your email and name to obtain access to wide list of adoptable shelter dogs near you!</p>
            </form>
            
        </div>
    );
}
export default Login;