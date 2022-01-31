import {createGlobalStyle} from 'styled-components';

export const lightTheme = {
    body: '#d5d5d5',
    font: '#5b5b5b',
    border: '#9099a2',
    background_main: '#fff',
    success: '#38761d',
    button_font_color: '#fff',
    primary: '#0d6efd',
    warning: '#ffc107',
    success: '#198754',
    danger: '#dc3545',
    warning_font: '#000'
}

export const darkTheme= {
    body: '#242424',
    font: '#fff',
    border: '#444444',
    background_main: '#5c5c5c',
    success: '#38761d',
    button_font_color: '#fff',
    primary: '#000',
    warning: '#dca500',
    success: '#167147',
    danger: '#c1303e',
    warning_font: '#fff'
}

export const GlobalStyles = createGlobalStyle`

        * {
            border-color: ${props=>props.theme.border} !important;
        }

        body {
            background-color: ${props=>props.theme.body} !important;
        }

        td {
            background-color: ${props=>props.theme.background_main} !important;
            color: ${props=>props.theme.font} !important;
        }

        tr {
            background-color: ${props=>props.theme.background_main} !important;
            color: ${props=>props.theme.font} !important;
        }

        textarea {
            background-color: ${props=>props.theme.body} !important;
            color: ${props=>props.theme.font} !important;
        }

        div {
            color: ${props=>props.theme.font} !important;
        }

        p {
            color: ${props=>props.theme.font} !important;
        }

        a {
            color: ${props=>props.theme.font} !important;
        }

        input {
            background-color: ${props=>props.theme.body} !important;
            color: ${props=>props.theme.font} !important;
        }

        code {
            color: ${props=>props.theme.font} !important;
        }

        select {
            background-color: ${props=>props.theme.body} !important;
            color: ${props=>props.theme.font} !important;
        }

        textarea:disabled {
            background-color: #000 !important;
        }

        input:disabled {
            background-color: #000 !important;
        }

        .btn.btn-outline-success {
            color: ${props=>props.theme.font} !important;
        }

        .navbar-toggler-icon {
            background-color: ${props=>props.theme.background_main} !important;
            background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/1024px-Hamburger_icon.svg.png");
        }

        .Toastify__toast-body div {
            color: #000 !important;
        }

        .form-group {
            background-color: ${props=>props.theme.background_main} !important;
        }

        .w-md-editor-text-pre.w-md-editor-text-input.w-md-editor-text.w-md-editor-text-pre {
            color: ${props=>props.theme.font} !important;
        }

        .w-md-editor-text-input {
            color: ${props=>props.theme.font} !important;
            background-color: transparent !important;
        }

        .w-md-editor {
            background-color: ${props=>props.theme.body} !important;
            color: ${props=>props.theme.font} !important;
            border: 1px solid;
            border-color: ${props=>props.theme.border} !important;
        }

        .w-md-editor-aree {
            background-color: ${props=>props.theme.body} !important;
            color: ${props=>props.theme.font} !important;
            border: 1px solid;
            border-color: ${props=>props.theme.border} !important;
        }

        .language-markdown {
            color: ${props=>props.theme.font} !important;
        }

        .card {
            background-color: ${props=>props.theme.background_main} !important;
        }

        .btn.btn-warning {
            background-color: ${props=>props.theme.warning} !important;
            border-color: ${props=>props.theme.warning} !important;
            color: ${props=>props.theme.warning_font} !important;
        }

        .btn.btn-success {
            background-color: ${props=>props.theme.success} !important;
            border-color: ${props=>props.theme.success} !important;
        }

        .btn.btn-danger {
            background-color: ${props=>props.theme.danger} !important;
            border-color: ${props=>props.theme.danger} !important;
        }

        .btn.btn-primary {
            background-color: ${props=>props.theme.primary} !important;
            border-color: ${props=>props.theme.primary} !important;
        }

        .shadow-sm {
            background-color: ${props=>props.theme.background_main} !important;
        }

        .lh-1 {
            color: ${props=>props.theme.font} !important;
        }

        .border-bottom {
            border-color: ${props=>props.theme.border} !important;
        }

        .navbar {
            background-color: ${props=>props.theme.background_main} !important;
            color: ${props=>props.theme.font} !important;
        }

        .nav-link {
            color: ${props=>props.theme.font} !important;
        }

        .navbar-brand {
            color: ${props=>props.theme.font} !important;
        }

        .btn {
            color: ${props=>props.theme.button_font_color} !important;
        }

        .table-filter {
            background-color: ${props=>props.theme.body} !important;
            color: ${props=>props.theme.font} !important;
        }

        .react-autocomplete-input {
            background-color: ${props=>props.theme.body} !important;
            color: ${props=>props.theme.font} !important;
        }

        .container {
            background-color: ${props=>props.theme.body} !important;
        }

        .d-flex {
            background-color: ${props=>props.theme.background_main} !important;
        }

        .d-block {
            background-color: ${props=>props.theme.background_main} !important;
        }

        #auth-container {
            background-color: ${props=>props.theme.body} !important;
            color: ${props=>props.theme.font} !important;
        }

        #auth-form {
            background-color: ${props=>props.theme.background_main} !important;
        }

        #signup-form {
            background-color: ${props=>props.theme.body} !important;
        }

        #formWrapper {
            background-color: ${props=>props.theme.background_main} !important;
        }

        #markdown {
            color: ${props=>props.theme.font} !important;
        }

`