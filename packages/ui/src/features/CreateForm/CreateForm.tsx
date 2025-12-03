import './CreateForm.css';
import { CreateFormProps } from './types';

export const CreateForm = (props: CreateFormProps) => {
    return (
        <div className="create-form">
            <div className="create-form-container">
                {props.children}
            </div>
        </div>
    );
}