/* eslint-disable no-process-env */
import React from 'react';
import theme from './theme';

if (process.env.NODE_ENV === 'production') require('./preview.global.css');

export const parameters = ({
    layout: 'fullscreen',
    readme: {
        theme: {
            textColor: 'white',
            barBg: '#2b2b2b'
        },
        codeTheme: 'a11y-dark',
        StoryPreview: ({children}) => children
    },
    docs: {
        theme
    }
});

function getBackend() {
    try {
        return (window && window.localStorage && window.localStorage.getItem('ut-storybook.backend')) || 'mock';
    } catch (error) {
        return 'mock';
    }
}

function setBackend(backend) {
    try {
        const stored = (window && window.localStorage && window.localStorage.getItem('ut-storybook.backend')) || 'mock';
        if (stored !== backend) window && window.localStorage && window.localStorage.setItem('ut-storybook.backend', backend);
    } catch (error) {
    }
}

export const globalTypes = {
    backend: {
        name: 'Back end',
        description: 'Back end API mock',
        defaultValue: getBackend(),
        toolbar: {
            icon: 'database',
            items: ['mock', 'origin'],
            showName: false
        }
    },
    dir: {
        name: 'Direction',
        description: 'LTR / RTL',
        defaultValue: 'ltr',
        toolbar: {
            icon: 'back',
            items: ['ltr', 'rtl'],
            showName: false
        }
    },
    theme: {
        name: 'Theme',
        description: 'Theme',
        defaultValue: 'compact',
        toolbar: {
            icon: 'eye',
            items: ['compact', 'big'],
            showName: false
        }
    }
};

export const decorators = [
    (Story, {globals: {backend, theme}}) => {
        setBackend(backend);
        return React.createElement(Story, {backend, theme});
    }
];
