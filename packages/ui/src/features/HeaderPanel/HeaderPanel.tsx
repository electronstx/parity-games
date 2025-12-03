import { HeaderPanelProps } from './types';
import './HeaderPanel.css';

export const HeaderPanel = (props: HeaderPanelProps) => {

    return (
        <div className="header-panel">
        <div className="header-panel-actions">
            <h1>{props.title}</h1>
        </div>
        </div>
    );
}