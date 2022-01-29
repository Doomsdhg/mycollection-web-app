import {createGlobalStyle} from 'styled-components';

export const lightTheme = {
    body: '#fff',
    font: '#000',
    border: '#000',
    buttons: '#cae9e9'
}

export const darkTheme= {
    body: '#545454',
    font: '#c5c5c5',
    border: '#fff',
    buttons: '#000'
}

export const GlobalStyles = createGlobalStyle`

        * {
            background-color: ${props=>props.theme.body} !important;
            color: ${props=>props.theme.font} !important;
            border-color: ${props=>props.theme.border} !important;
        }

        .btn {
            background-color: ${props=>props.theme.buttons} !important;
            border-color: ${props=>props.theme.buttons} !important;
        }

        .bg-body {
            background-color: ${props=>props.theme.body} !important;
        }
`