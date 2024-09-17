import React from 'react'
import { Helmet } from 'react-helmet'

interface propsType {
    title: string;
    description: string;
}

const MetaDecorator: React.FC<propsType> = ({ title, description }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={`${description}`} />
        </Helmet>
    )
}

export default MetaDecorator
