import React from 'react';

// Component styles
import './footer.css'

export default function Footer(props) {

    return (
        <div className='FooterRoot'>
            <div
                className='FooterText'
                variant="body1"
            >
                &copy; 
            </div>
            <div className="subtitle2">
                Footer
            </div>
        </div>
    );
}