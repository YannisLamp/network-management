import React from 'react';

// Component styles
import './footer.css'

export default function Footer(props) {

    return (
        <div className='FooterRoot'>
            <hr className="my-2" />
            <div
                className='FooterText'
                variant="body1"
            >
                &copy; 
            </div>
            <div className="FooterSubtitle">
                Footer
            </div>
        </div>
    );
}